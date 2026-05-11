import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'node:crypto';
import { dbQuery, ensureOrdersTable } from '@/lib/db';
import { buildOrderRecord, createOrder, getOrderById, updatePaymentStatus } from '@/lib/orders';
import { getProducts, seedProducts } from '@/lib/products';
import { hasFilledHoneypot, verifyTurnstile } from '@/lib/security';
import { sendOrderEmails, getEmailSettings } from '@/lib/emails';
import { Resend } from 'resend';

const cleanText = (value) => (typeof value === 'string' ? value.trim() : '');
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanText(value));

function normalizeSelections(value) {
  if (!Array.isArray(value)) return [];
  const merged = new Map();
  value.forEach((item) => {
    const id = cleanText(item?.id);
    const qty = Math.max(0, Math.floor(Number(item?.qty ?? item?.quantity ?? 0) || 0));
    if (id && qty > 0) merged.set(id, (merged.get(id) || 0) + qty);
  });
  return [...merged.entries()].map(([id, qty]) => ({ id, quantity: qty }));
}

export async function POST(request, { params }) {
  const { action } = await params;
  const body = await request.json();

  // 1. CREATE RAZORPAY ORDER
  if (action === 'create-order') {
    const { user_name, user_email, user_phone, user_address, user_city, user_zip, bag_items, user_note, source, security_token, hp_data } = body;
    if (hasFilledHoneypot(hp_data)) return NextResponse.json({ success: true, ignored: true });
    if (!(await verifyTurnstile(security_token))) return NextResponse.json({ error: 'Security failed' }, { status: 403 });

    const selections = normalizeSelections(bag_items);
    if (selections.length === 0) return NextResponse.json({ error: 'Bag is empty' }, { status: 400 });

    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    
    await seedProducts();
    const catalog = await getProducts();
    const productMap = new Map(catalog.map(p => [p.id, p]));

    const orderLines = selections.map(sel => {
      const p = productMap.get(sel.id);
      if (!p || !p.is_active) throw new Error(`Product unavailable: ${sel.id}`);
      return { id: p.id, name: p.name, quantity: sel.quantity, price: p.price, lineTotal: p.price * sel.quantity };
    });

    const totalValue = orderLines.reduce((sum, it) => sum + it.lineTotal, 0);
    const rOrder = await razorpay.orders.create({ amount: Math.round(totalValue * 100), currency: 'INR', receipt: `rcpt_${Date.now()}` });

    const stored = await createOrder(buildOrderRecord({
      user_name, user_email, user_phone, user_address, user_city, user_zip,
      order_items: orderLines.map(l => `${l.name} (${l.quantity})`).join(', '),
      order_lines: orderLines, order_total: `₹${totalValue.toFixed(2)}`,
      order_total_value: totalValue, user_note, source, razorpay_order_id: rOrder.id
    }));

    return NextResponse.json({ success: true, orderId: stored.id, razorpayOrderId: rOrder.id, amount: rOrder.amount, keyId: process.env.RAZORPAY_KEY_ID });
  }

  // 2. VERIFY PAYMENT
  if (action === 'verify-payment') {
    const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id + "|" + razorpay_payment_id).digest("hex");
    if (expected !== razorpay_signature) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });

    const updated = await updatePaymentStatus(order_id, { expectedRazorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature });
    const emailResult = await sendOrderEmails(updated);
    return NextResponse.json({ success: true, order: updated, emailSkipped: emailResult.customerEmailSkipped });
  }

  // 3. WAITLIST / INSIDER SIGNUP
  if (action === 'waitlist') {
    const { user_email, security_token, hp_data } = body;
    if (hasFilledHoneypot(hp_data)) return NextResponse.json({ success: true });
    if (!(await verifyTurnstile(security_token))) return NextResponse.json({ error: 'Security failed' }, { status: 403 });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const settings = getEmailSettings();
    
    // Owner Alert
    await resend.emails.send({
      from: settings.orderFromEmail, to: settings.ownerEmails, subject: 'New Insider Signup',
      html: `<p>New signup: <strong>${user_email}</strong></p>`
    });

    // Customer Welcome
    if (settings.customerEmailsEnabled) {
        await resend.emails.send({
            from: settings.customerFromEmail, to: [user_email],
            subject: 'SoulfullBites | You are on the insider list',
            html: `<div style="text-align:center; font-family:serif; background:#fdf6ee; padding:40px;"><h2>You are on the list.</h2><p>We'll notify you when the next batch is ready.</p></div>`
        });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 404 });
}
