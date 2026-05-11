import Razorpay from 'razorpay';
import { buildOrderRecord, createOrder } from './_lib/orders.js';
import { getProducts, seedProducts } from './_lib/products.js';
import { hasFilledHoneypot, verifyTurnstile } from './_lib/security.js';

const cleanText = (value) => (typeof value === 'string' ? value.trim() : '');
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanText(value));

function normalizeSelections(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  const mergedSelections = new Map();

  value.forEach((item) => {
    const id = cleanText(item?.id);
    const quantity = Math.max(0, Math.floor(Number(item?.qty ?? item?.quantity ?? 0) || 0));

    if (!id || quantity <= 0) {
      return;
    }

    mergedSelections.set(id, (mergedSelections.get(id) || 0) + quantity);
  });

  return [...mergedSelections.entries()].map(([id, quantity]) => ({ id, quantity }));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    user_name,
    user_email,
    user_phone,
    user_address,
    user_city,
    user_zip,
    bag_items,
    user_note,
    source,
    security_token,
    hp_data,
  } = req.body;

  if (hasFilledHoneypot(hp_data)) {
    return res.status(200).json({ success: true, ignored: true });
  }

  const isHuman = await verifyTurnstile(security_token);
  if (!isHuman) {
    return res.status(403).json({ error: 'Security verification failed. Please refresh the page and try again.' });
  }

  if (
    !cleanText(user_name)
    || !isValidEmail(user_email)
    || !cleanText(user_phone)
    || !cleanText(user_address)
    || !cleanText(user_city)
    || !cleanText(user_zip)
  ) {
    return res.status(400).json({ error: 'Missing required checkout details' });
  }

  const selections = normalizeSelections(bag_items);
  if (selections.length === 0) {
    return res.status(400).json({ error: 'Your bag is empty' });
  }

  if (!cleanText(process.env.RAZORPAY_KEY_ID) || !cleanText(process.env.RAZORPAY_KEY_SECRET)) {
    return res.status(500).json({ error: 'Payment gateway is not configured' });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    await seedProducts();
    const catalog = await getProducts();
    const productMap = new Map(catalog.map((product) => [product.id, product]));

    const orderLines = selections.map((selection) => {
      const product = productMap.get(selection.id);

      if (!product || product.is_active === false) {
        const unavailableError = new Error(`Product unavailable: ${selection.id}`);
        unavailableError.statusCode = 400;
        throw unavailableError;
      }

      if (selection.quantity > 20) {
        const quantityError = new Error(`Quantity too high for product: ${selection.id}`);
        quantityError.statusCode = 400;
        throw quantityError;
      }

      return {
        id: product.id,
        name: cleanText(product.name),
        quantity: selection.quantity,
        price: Number(product.price || 0),
        lineTotal: Number(product.price || 0) * selection.quantity,
      };
    });

    const orderTotalValue = orderLines.reduce((sum, item) => sum + item.lineTotal, 0);
    if (orderTotalValue <= 0) {
      return res.status(400).json({ error: 'Invalid order total' });
    }

    const orderItems = orderLines.map((item) => `${item.name} (${item.quantity})`).join(', ');
    const orderTotal = `₹${orderTotalValue.toFixed(2)}`;

    // 1. Create Razorpay Order
    // Amount is in paise (₹1 = 100 paise)
    const options = {
      amount: Math.round(orderTotalValue * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 2. Create Order Record in DB (pending payment)
    const orderData = {
      user_name,
      user_email,
      user_phone,
      user_address,
      user_city,
      user_zip,
      order_items: orderItems,
      order_lines: orderLines,
      order_total: orderTotal,
      order_total_value: orderTotalValue,
      user_note,
      source,
      razorpay_order_id: razorpayOrder.id,
      payment_status: 'unpaid',
    };

    const storedOrder = await createOrder(buildOrderRecord(orderData));
    if (!storedOrder) {
      return res.status(500).json({ error: 'Order storage is not configured' });
    }

    return res.status(200).json({
      success: true,
      orderId: storedOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount,
      currency: options.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderSummary: {
        items: storedOrder.items,
        totalAmount: storedOrder.totalAmount,
        totalDisplay: storedOrder.totalDisplay,
      },
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    return res.status(error.statusCode || 500).json({ error: error.message || 'Unable to create payment order' });
  }
}
