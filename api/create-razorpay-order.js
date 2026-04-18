import Razorpay from 'razorpay';
import { buildOrderRecord, createOrder } from './_lib/orders.js';

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
    order_items,
    order_lines,
    order_total,
    order_total_value,
    user_note,
    source,
  } = req.body;

  if (!order_total_value || order_total_value <= 0) {
    return res.status(400).json({ error: 'Invalid order total' });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    // 1. Create Razorpay Order
    // Amount is in paise (₹1 = 100 paise)
    const options = {
      amount: Math.round(order_total_value * 100),
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
      order_items,
      order_lines,
      order_total,
      order_total_value,
      user_note,
      source,
      razorpay_order_id: razorpayOrder.id,
      payment_status: 'unpaid',
    };

    const storedOrder = await createOrder(buildOrderRecord(orderData));

    return res.status(200).json({
      success: true,
      orderId: storedOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount,
      currency: options.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    return res.status(500).json({ error: 'Unable to create payment order' });
  }
}
