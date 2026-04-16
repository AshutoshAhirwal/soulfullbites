import { Resend } from 'resend';
import { buildOrderRecord, createOrder, markOrderCustomerEmail } from './_lib/orders.js';

const WAITLIST_SOURCE = 'SoulfullBites Waitlist';
const DEFAULT_OWNER_EMAILS = ['ashutosh15798@gmail.com'];
const DEFAULT_CC_EMAILS = ['soulfulbites.studio@gmail.com'];
const DEFAULT_CUSTOMER_FROM_EMAIL = 'SoulfullBites <hello@resend.dev>';
const DEFAULT_ORDER_FROM_EMAIL = 'SoulfullBites <orders@resend.dev>';

const cleanText = (value) => (typeof value === 'string' ? value.trim() : '');

const escapeHtml = (value) => cleanText(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanText(value));
const parseEmailList = (value, fallback = []) => {
  const rawList = cleanText(value);
  const list = rawList ? rawList.split(',') : fallback;

  return [...new Set(list.map((entry) => cleanText(entry)).filter(Boolean))];
};

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
};

const getEmailSettings = () => {
  const ownerEmails = parseEmailList(process.env.RESEND_OWNER_EMAILS, DEFAULT_OWNER_EMAILS);
  const ccEmails = parseEmailList(process.env.RESEND_CC_EMAILS, DEFAULT_CC_EMAILS);
  const allowedTestRecipients = parseEmailList(process.env.RESEND_TEST_RECIPIENTS, ownerEmails);
  const customerFromEmail = cleanText(process.env.RESEND_FROM_EMAIL) || DEFAULT_CUSTOMER_FROM_EMAIL;
  const orderFromEmail = cleanText(process.env.RESEND_ORDER_FROM_EMAIL) || DEFAULT_ORDER_FROM_EMAIL;

  return {
    ownerEmails,
    ccEmails,
    allowedTestRecipients,
    customerFromEmail,
    orderFromEmail,
    customerEmailsEnabled: process.env.RESEND_ENABLE_CUSTOMER_EMAILS !== 'false',
  };
};

const isTestingSender = (value) => /@resend\.dev>?$/i.test(cleanText(value));
const isAllowedTestRecipient = (email, allowedList) => allowedList.some((entry) => entry.toLowerCase() === email.toLowerCase());
const filterTestingRecipients = (emails, allowedList) => emails.filter((email) => isAllowedTestRecipient(email, allowedList));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const resend = getResendClient();

  if (!resend) {
    return res.status(500).json({ error: 'Email service is not configured' });
  }

  const {
    ownerEmails,
    ccEmails,
    allowedTestRecipients,
    customerFromEmail,
    orderFromEmail,
    customerEmailsEnabled,
  } = getEmailSettings();

  const testingMode = isTestingSender(customerFromEmail) || isTestingSender(orderFromEmail);
  const ownerRecipients = testingMode ? filterTestingRecipients(ownerEmails, allowedTestRecipients) : ownerEmails;
  const ccRecipients = testingMode ? filterTestingRecipients(ccEmails, allowedTestRecipients) : ccEmails;

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
  } = req.body ?? {};

  const safeSource = cleanText(source);
  const safeEmail = cleanText(user_email);
  const safeName = cleanText(user_name);
  const safePhone = cleanText(user_phone);
  const safeAddress = cleanText(user_address);
  const safeItems = cleanText(order_items);
  const safeTotal = cleanText(order_total);
  const safeNote = cleanText(user_note) || 'None';

  if (ownerRecipients.length === 0) {
    return res.status(500).json({ error: 'No valid owner email is configured for Resend testing mode' });
  }

  try {
    if (safeSource === WAITLIST_SOURCE) {
      if (!isValidEmail(safeEmail)) {
        return res.status(400).json({ error: 'A valid email address is required for waitlist signup' });
      }

      const waitlistNotification = {
        from: orderFromEmail,
        to: ownerRecipients,
        reply_to: safeEmail,
        subject: 'New waitlist signup',
        html: `
          <div style="background-color: #fdf6ee; padding: 40px; font-family: 'Helvetica', sans-serif; color: #4a2c1a;">
            <h2 style="border-bottom: 2px solid #4a2c1a; padding-bottom: 10px;">NEW WAITLIST SIGNUP</h2>
            <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
            <p><strong>Source:</strong> ${escapeHtml(safeSource)}</p>
          </div>
        `,
      };

      if (ccRecipients.length > 0) {
        waitlistNotification.cc = ccRecipients;
      }

      await resend.emails.send(waitlistNotification);

      const canSendWaitlistCustomerEmail = customerEmailsEnabled && (!testingMode || isAllowedTestRecipient(safeEmail, allowedTestRecipients));

      if (!canSendWaitlistCustomerEmail) {
        return res.status(200).json({
          success: true,
          customerEmailSkipped: true,
          message: 'Waitlist saved. Customer email is skipped until a sending domain is verified.',
        });
      }

      await resend.emails.send({
        from: customerFromEmail,
        to: [safeEmail],
        subject: 'SoulfullBites | You are on the waitlist',
        html: `
          <div style="background-color: #fdf6ee; padding: 40px; font-family: 'Georgia', serif; color: #4a2c1a; text-align: center; border-radius: 15px;">
            <h1 style="text-transform: uppercase; letter-spacing: 5px; font-weight: 300;">SoulfullBites</h1>
            <p style="color: #c9936a; letter-spacing: 2px; font-size: 10px; margin-bottom: 40px;">ARTISANAL CHOCOLATE</p>
            <h2 style="font-size: 24px; font-weight: 400; font-style: italic;">You are on the list.</h2>
            <p style="line-height: 1.8; margin-top: 20px;">We will let you know as soon as the next batch is ready.</p>
            <p style="margin-top: 40px; font-size: 12px; opacity: 0.6;">Stay Soulfull.</p>
          </div>
        `,
      });

      return res.status(200).json({ success: true, message: 'Waitlist emails sent successfully' });
    }

    if (!safeName || !isValidEmail(safeEmail) || !safePhone || !safeAddress || !safeItems || !safeTotal) {
      return res.status(400).json({ error: 'Missing required order details' });
    }

    const storedOrder = await createOrder(buildOrderRecord({
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
    }));

    const ownerOrderEmail = {
      from: orderFromEmail,
      to: ownerRecipients,
      reply_to: safeEmail,
      subject: `New Chocolate Order: ${safeName} 🍫${storedOrder ? ` · ${storedOrder.id}` : ''}`,
      html: `
        <div style="background-color: #fdf6ee; padding: 40px; font-family: 'Helvetica', sans-serif; color: #4a2c1a;">
          <h2 style="border-bottom: 2px solid #4a2c1a; padding-bottom: 10px;">NEW SALES ALERT</h2>
          ${storedOrder ? `<p><strong>Order ID:</strong> ${escapeHtml(storedOrder.id)}</p>` : ''}
          <p><strong>Customer:</strong> ${escapeHtml(safeName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(safePhone)}</p>
          <p><strong>Shipping:</strong> ${escapeHtml(safeAddress)}</p>
          <p><strong>Note:</strong> ${escapeHtml(safeNote)}</p>
          <div style="background: #fff; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <p style="font-size: 1.1rem;"><strong>Order:</strong> ${escapeHtml(safeItems)}</p>
            <h3 style="color: #c9993a;">Total: ${escapeHtml(safeTotal)}</h3>
          </div>
        </div>
      `,
    };

    if (ccRecipients.length > 0) {
      ownerOrderEmail.cc = ccRecipients;
    }

    await resend.emails.send(ownerOrderEmail);

    const canSendCustomerOrderEmail = customerEmailsEnabled && (!testingMode || isAllowedTestRecipient(safeEmail, allowedTestRecipients));

    if (!canSendCustomerOrderEmail) {
      if (storedOrder) {
        await markOrderCustomerEmail(storedOrder.id, true);
      }

      return res.status(200).json({
        success: true,
        orderId: storedOrder?.id || null,
        recordStored: Boolean(storedOrder),
        customerEmailSkipped: true,
        message: 'Order received. Customer email is skipped until a sending domain is verified.',
      });
    }

    await resend.emails.send({
      from: customerFromEmail,
      to: [safeEmail],
      subject: 'SoulfullBites | We have received your order! 🍫',
      html: `
        <div style="background-color: #fdf6ee; padding: 40px; font-family: 'Georgia', serif; color: #4a2c1a; text-align: center; border-radius: 15px;">
          <h1 style="text-transform: uppercase; letter-spacing: 5px; font-weight: 300;">SoulfullBites</h1>
          <p style="color: #c9936a; letter-spacing: 2px; font-size: 10px; margin-bottom: 40px;">ARTISANAL CHOCOLATE</p>
          <h2 style="font-size: 24px; font-weight: 400; font-style: italic;">Thank you, ${escapeHtml(safeName)}.</h2>
          <p style="line-height: 1.8; margin-top: 20px;">Your artisanal order has been received at our kitchen. We are currently tempering the finest cocoa to bring you a soulful experience.</p>
          <div style="margin: 40px auto; max-width: 300px; padding: 20px; border: 1px solid #e0d5c5; border-radius: 10px; background: #fff;">
             <p style="font-size: 0.8rem; opacity: 0.7; margin-bottom: 5px;">YOU ORDERED</p>
             <p style="font-weight: bold; margin: 0;">${escapeHtml(safeItems)}</p>
             <p style="font-size: 14px; color: #c9993a; margin: 12px 0 0;">${escapeHtml(safeTotal)}</p>
          </div>
          <p style="font-size: 14px; opacity: 0.8;">Our team will reach out at <strong>${escapeHtml(safePhone)}</strong> for delivery confirmation.</p>
          <p style="margin-top: 40px; font-size: 12px; opacity: 0.6;">Stay Soulfull.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      orderId: storedOrder?.id || null,
      recordStored: Boolean(storedOrder),
      message: 'Emails sent successfully',
    });
  } catch (error) {
    console.error('send-order failed', error);
    return res.status(500).json({ error: 'Unable to send email right now' });
  }
}
