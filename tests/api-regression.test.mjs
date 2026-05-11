import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { afterEach, test } from 'node:test';

import adminAuthHandler from '../api/admin-auth.js';
import adminProductsHandler from '../api/admin-products.js';
import createRazorpayOrderHandler from '../api/create-razorpay-order.js';
import reviewsHandler from '../api/reviews.js';
import sendOrderHandler from '../api/send-order.js';
import verifyPaymentHandler from '../api/verify-payment.js';
import { buildOrderRecord } from '../api/_lib/orders.js';
import { DEFAULT_PRODUCTS, getProducts } from '../api/_lib/products.js';
import { hasFilledHoneypot, verifyTurnstile } from '../api/_lib/security.js';

const originalEnv = { ...process.env };
const originalFetch = global.fetch;

function restoreEnvironment() {
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) {
      delete process.env[key];
    }
  }

  for (const [key, value] of Object.entries(originalEnv)) {
    process.env[key] = value;
  }

  global.fetch = originalFetch;
}

function createMockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    getHeader(name) {
      return this.headers[name.toLowerCase()];
    },
  };
}

async function invoke(handler, { method = 'GET', url = '/', body = {}, headers = {} } = {}) {
  const req = { method, url, body, headers };
  const res = createMockResponse();
  await handler(req, res);
  return res;
}

afterEach(() => {
  restoreEnvironment();
});

test('honeypot detection trims whitespace and flags filled values', { concurrency: false }, () => {
  assert.equal(hasFilledHoneypot('   '), false);
  assert.equal(hasFilledHoneypot(' hidden-bot '), true);
});

test('turnstile verification is permissive without a secret and blocks missing tokens when enabled', { concurrency: false }, async () => {
  delete process.env.TURNSTILE_SECRET_KEY;
  assert.equal(await verifyTurnstile(''), true);

  process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret';
  assert.equal(await verifyTurnstile(''), false);
});

test('product catalog falls back to the built-in defaults without a database', { concurrency: false }, async () => {
  delete process.env.DATABASE_URL;
  delete process.env.POSTGRES_URL;
  delete process.env.NEON_DATABASE_URL;

  const products = await getProducts();

  assert.deepEqual(products, DEFAULT_PRODUCTS.filter((product) => product.is_active));
});

test('order records normalize qty aliases into consistent order lines', { concurrency: false }, () => {
  const record = buildOrderRecord({
    user_name: 'Ashu',
    user_email: 'ashu@example.com',
    user_phone: '9999999999',
    user_address: 'Indore',
    order_items: 'Dark & Bold (2)',
    order_lines: [{ id: 'p1', name: 'Dark & Bold', qty: 2, price: 450 }],
    order_total: '₹900.00',
    order_total_value: 900,
  });

  assert.match(record.id, /^SB-/);
  assert.deepEqual(record.items, [{
    id: 'p1',
    name: 'Dark & Bold',
    quantity: 2,
    qty: 2,
    price: 450,
    lineTotal: 900,
  }]);
});

test('create-razorpay-order rejects missing turnstile tokens when bot protection is enabled', { concurrency: false }, async () => {
  process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret';

  const res = await invoke(createRazorpayOrderHandler, {
    method: 'POST',
    body: {
      user_name: 'Ashu',
      user_email: 'ashu@example.com',
      user_phone: '9999999999',
      user_address: 'Indore',
      user_city: 'Indore',
      user_zip: '452001',
      bag_items: [{ id: 'p1', qty: 1 }],
      security_token: '',
    },
  });

  assert.equal(res.statusCode, 403);
  assert.match(res.body.error, /Security verification failed/i);
});

test('create-razorpay-order rejects empty bags before payment setup', { concurrency: false }, async () => {
  delete process.env.TURNSTILE_SECRET_KEY;
  delete process.env.RAZORPAY_KEY_ID;
  delete process.env.RAZORPAY_KEY_SECRET;

  const res = await invoke(createRazorpayOrderHandler, {
    method: 'POST',
    body: {
      user_name: 'Ashu',
      user_email: 'ashu@example.com',
      user_phone: '9999999999',
      user_address: 'Indore',
      user_city: 'Indore',
      user_zip: '452001',
      bag_items: [],
    },
  });

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.error, 'Your bag is empty');
});

test('verify-payment rejects invalid signatures before touching order state', { concurrency: false }, async () => {
  process.env.RAZORPAY_KEY_SECRET = 'razorpay-secret';

  const res = await invoke(verifyPaymentHandler, {
    method: 'POST',
    body: {
      order_id: 'SB-demo',
      razorpay_order_id: 'order_demo',
      razorpay_payment_id: 'pay_demo',
      razorpay_signature: 'bad-signature',
    },
  });

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.error, 'Invalid payment signature');
});

test('verify-payment returns missing-details errors for incomplete payloads', { concurrency: false }, async () => {
  process.env.RAZORPAY_KEY_SECRET = 'razorpay-secret';

  const res = await invoke(verifyPaymentHandler, {
    method: 'POST',
    body: {
      order_id: 'SB-demo',
      razorpay_order_id: 'order_demo',
    },
  });

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.error, 'Missing payment verification details');
});

test('send-order ignores honeypot submissions without sending email', { concurrency: false }, async () => {
  process.env.RESEND_API_KEY = 're_test_key';

  const res = await invoke(sendOrderHandler, {
    method: 'POST',
    body: {
      hp_data: 'bot-data',
    },
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
});

test('send-order blocks missing turnstile tokens when protection is enabled', { concurrency: false }, async () => {
  process.env.RESEND_API_KEY = 're_test_key';
  process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret';

  const res = await invoke(sendOrderHandler, {
    method: 'POST',
    body: {
      source: 'SoulfullBites Waitlist',
      user_email: 'ashu@example.com',
      security_token: '',
    },
  });

  assert.equal(res.statusCode, 403);
  assert.match(res.body.error, /Security verification failed/i);
});

test('reviews API validates required submission fields before review lookup', { concurrency: false }, async () => {
  const res = await invoke(reviewsHandler, {
    method: 'POST',
    body: {
      orderId: 'SB-demo',
      customerName: 'Ashu',
      rating: 5,
    },
  });

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.error, 'Missing required fields');
});

test('admin product delete requires a valid authenticated session and an id', { concurrency: false }, async () => {
  process.env.ADMIN_PASSWORD = 'secret-password';
  process.env.ADMIN_SESSION_SECRET = 'session-secret';

  const loginResponse = await invoke(adminAuthHandler, {
    method: 'POST',
    body: {
      password: 'secret-password',
    },
  });

  assert.equal(loginResponse.statusCode, 200);
  const sessionCookie = String(loginResponse.getHeader('set-cookie')).split(';')[0];
  assert.match(sessionCookie, /^soulfull_admin_session=/);

  const deleteResponse = await invoke(adminProductsHandler, {
    method: 'DELETE',
    url: '/api/admin-products',
    headers: {
      cookie: sessionCookie,
    },
  });

  assert.equal(deleteResponse.statusCode, 400);
  assert.equal(deleteResponse.body.error, 'Product id is required');
});

test('admin login rejects invalid passwords', { concurrency: false }, async () => {
  process.env.ADMIN_PASSWORD = 'secret-password';
  process.env.ADMIN_SESSION_SECRET = 'session-secret';

  const res = await invoke(adminAuthHandler, {
    method: 'POST',
    body: {
      password: 'wrong-password',
    },
  });

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.error, 'Invalid password');
});

test('verify-payment can compute a valid signature shape for sanity checks', { concurrency: false }, async () => {
  process.env.RAZORPAY_KEY_SECRET = 'razorpay-secret';

  const razorpayOrderId = 'order_demo';
  const razorpayPaymentId = 'pay_demo';
  const razorpaySignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  assert.match(razorpaySignature, /^[a-f0-9]{64}$/);
});
