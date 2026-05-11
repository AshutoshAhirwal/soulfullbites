import crypto from 'node:crypto';
import { getOrderById, updatePaymentStatus } from './_lib/orders.js';
import { sendOrderEmails } from './_lib/emails.js';

const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(left || '', 'utf8');
  const rightBuffer = Buffer.from(right || '', 'utf8');

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    order_id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification details' });
  }

  // 1. Verify Signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (!safeEqual(expectedSignature, razorpay_signature)) {
    return res.status(400).json({ error: 'Invalid payment signature' });
  }

  try {
    const storedOrder = await getOrderById(order_id);
    if (!storedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (storedOrder.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ error: 'Payment order mismatch' });
    }

    if (storedOrder.paymentStatus === 'paid') {
      const samePayment = storedOrder.razorpayPaymentId === razorpay_payment_id;

      return res.status(samePayment ? 200 : 409).json({
        success: samePayment,
        message: samePayment ? 'Payment already verified' : 'Order already has a different payment recorded',
        order: storedOrder,
      });
    }

    // 2. Update status in DB
    const updatedOrder = await updatePaymentStatus(order_id, {
      expectedRazorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: 'paid',
    });

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found for this payment order' });
    }

    // 3. Send confirmation emails
    const emailResult = await sendOrderEmails(updatedOrder);

    return res.status(200).json({
      success: true,
      message: 'Payment verified and order confirmed',
      order: updatedOrder,
      emailSkipped: emailResult.customerEmailSkipped
    });
  } catch (error) {
    console.error('Verification Error:', error);
    return res.status(500).json({ error: 'Unable to verify payment' });
  }
}
