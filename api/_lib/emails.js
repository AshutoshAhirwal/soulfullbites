import { Resend } from 'resend';
import { cleanText } from './http.js';

const DEFAULT_OWNER_EMAILS = ['ashutosh15798@gmail.com'];
const DEFAULT_CC_EMAILS = ['soulfulbites.studio@gmail.com'];
const DEFAULT_CUSTOMER_FROM_EMAIL = 'SoulfullBites <hello@resend.dev>';
const DEFAULT_ORDER_FROM_EMAIL = 'SoulfullBites <orders@resend.dev>';

const parseEmailList = (value, fallback = []) => {
  const rawList = cleanText(value);
  const list = rawList ? rawList.split(',') : fallback;
  return [...new Set(list.map((entry) => cleanText(entry)).filter(Boolean))];
};

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
};

export const getEmailSettings = () => {
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

const escapeHtml = (value) => (typeof value === 'string' ? value.trim() : '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

export async function sendOrderEmails(order, settingsOverride = {}) {
  const resend = getResendClient();
  if (!resend) return { success: false, error: 'Resend not configured' };

  const settings = { ...getEmailSettings(), ...settingsOverride };
  const { customerFromEmail, orderFromEmail, customerEmailsEnabled, allowedTestRecipients } = settings;
  
  const testingMode = isTestingSender(customerFromEmail) || isTestingSender(orderFromEmail);
  const ownerRecipients = testingMode ? filterTestingRecipients(settings.ownerEmails, allowedTestRecipients) : settings.ownerEmails;
  const ccRecipients = testingMode ? filterTestingRecipients(settings.ccEmails, allowedTestRecipients) : settings.ccEmails;

  if (ownerRecipients.length === 0) return { success: false, error: 'No recipients' };

  try {
    // Owner Notification
    const ownerEmailData = {
      from: orderFromEmail,
      to: ownerRecipients,
      reply_to: order.customerEmail,
      subject: `New Chocolate Order: ${order.customerName} 🍫 · Paid · ${order.id}`,
      html: `
        <div style="background-color: #fdf6ee; padding: 40px; font-family: 'Helvetica', sans-serif; color: #4a2c1a;">
          <h2 style="border-bottom: 2px solid #4a2c1a; padding-bottom: 10px;">NEW PAID SALES ALERT展</h2>
          <p><strong>Order ID:</strong> ${escapeHtml(order.id)}</p>
          <p><strong>Customer:</strong> ${escapeHtml(order.customerName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(order.customerEmail)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(order.customerPhone)}</p>
          <p><strong>Shipping:</strong> ${escapeHtml(order.customerAddress)}</p>
          <div style="background: #fff; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <p style="font-size: 1.1rem;"><strong>Order:</strong> ${escapeHtml(order.itemsText)}</p>
            <h3 style="color: #c9993a;">Total: ${escapeHtml(order.totalDisplay)} (Paid via Razorpay)</h3>
          </div>
        </div>
      `,
    };
    if (ccRecipients.length > 0) ownerEmailData.cc = ccRecipients;
    await resend.emails.send(ownerEmailData);

    // Customer Confirmation
    const canSendCustomer = customerEmailsEnabled && (!testingMode || isAllowedTestRecipient(order.customerEmail, allowedTestRecipients));
    if (canSendCustomer) {
      await resend.emails.send({
        from: customerFromEmail,
        to: [order.customerEmail],
        subject: 'SoulfullBites | Order Confirmed! 🍫',
        html: `
          <div style="background-color: #fdf6ee; padding: 40px; font-family: 'Georgia', serif; color: #4a2c1a; text-align: center; border-radius: 15px;">
            <h1 style="text-transform: uppercase; letter-spacing: 5px; font-weight: 300;">SoulfullBites</h1>
            <p style="color: #c9936a; letter-spacing: 2px; font-size: 10px; margin-bottom: 40px;">ARTISANAL CHOCOLATE</p>
            <h2 style="font-size: 24px; font-weight: 400; font-style: italic;">Payment Successful, ${escapeHtml(order.customerName)}.</h2>
            <p style="line-height: 1.8; margin-top: 20px;">Your artisanal order is confirmed. We are now preparing your chocolates with love and care.</p>
            <div style="margin: 40px auto; max-width: 300px; padding: 20px; border: 1px solid #e0d5c5; border-radius: 10px; background: #fff;">
               <p style="font-size: 0.8rem; opacity: 0.7; margin-bottom: 5px;">ITEMS</p>
               <p style="font-weight: bold; margin: 0;">${escapeHtml(order.itemsText)}</p>
               <p style="font-size: 14px; color: #c9993a; margin: 12px 0 0;">${escapeHtml(order.totalDisplay)}</p>
            </div>
            <p style="font-size: 14px; opacity: 0.8;">Delivery to: <strong>${escapeHtml(order.customerAddress)}</strong></p>
            <p style="margin-top: 40px; font-size: 12px; opacity: 0.6;">Stay Soulfull.</p>
          </div>
        `,
      });
    }

    return { success: true, customerEmailSkipped: !canSendCustomer };
  } catch (err) {
    console.error('Email send failed', err);
    return { success: false, error: err.message };
  }
}
