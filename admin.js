const ADMIN_ORDERS_API = '/api/admin-orders';
const ADMIN_LOGIN_API = '/api/admin-login';
const ADMIN_LOGOUT_API = '/api/admin-logout';
const ADMIN_ORDER_UPDATE_API = '/api/admin-order-update';
const ORDER_STATUSES = ['new', 'confirmed', 'preparing', 'delivered', 'cancelled'];

const dashboard = document.getElementById('admin-dashboard');
const loginPanel = document.getElementById('admin-login-panel');
const loginForm = document.getElementById('admin-login-form');
const loginButton = document.getElementById('admin-login-button');
const passwordInput = document.getElementById('admin-password');
const refreshButton = document.getElementById('admin-refresh');
const logoutButton = document.getElementById('admin-logout');
const searchInput = document.getElementById('admin-search');
const statusFilter = document.getElementById('admin-status-filter');
const statsContainer = document.getElementById('admin-stats');
const stateBox = document.getElementById('admin-state');
const ordersContainer = document.getElementById('admin-orders');

let searchDebounce;
let currentOrders = [];

const currencyFormat = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function setState(message = '', type = 'info') {
  if (!message) {
    stateBox.classList.add('hidden');
    stateBox.textContent = '';
    return;
  }

  stateBox.classList.remove('hidden');
  stateBox.textContent = message;
  stateBox.dataset.type = type;
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload?.error || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return payload;
}

function buildStats(orders) {
  const counts = orders.reduce((accumulator, order) => {
    accumulator.total += 1;
    accumulator[order.status] = (accumulator[order.status] || 0) + 1;
    return accumulator;
  }, { total: 0, new: 0, confirmed: 0, preparing: 0, delivered: 0, cancelled: 0 });

  statsContainer.innerHTML = [
    ['Total Orders', counts.total],
    ['New', counts.new],
    ['Confirmed', counts.confirmed],
    ['Preparing', counts.preparing],
    ['Delivered', counts.delivered],
    ['Cancelled', counts.cancelled],
  ].map(([label, value]) => `
    <article class="admin-stat">
      <strong>${value}</strong>
      <span>${label}</span>
    </article>
  `).join('');
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value || '';
  }
}

function renderOrders(orders) {
  if (orders.length === 0) {
    ordersContainer.innerHTML = '<section class="admin-card"><p class="admin-copy">No orders found for the current filters.</p></section>';
    return;
  }

  ordersContainer.innerHTML = orders.map((order) => {
    const lines = Array.isArray(order.items) && order.items.length > 0
      ? order.items.map((item) => `
          <div class="admin-order-line">
            <div>
              <strong>${escapeHtml(item.name || 'Order item')}</strong>
              <small>Quantity: ${escapeHtml(item.qty || 1)}</small>
            </div>
            <strong>${currencyFormat.format(Number(item.lineTotal || item.price || 0))}</strong>
          </div>
        `).join('')
      : `
          <div class="admin-order-line">
            <div>
              <strong>${escapeHtml(order.itemsText)}</strong>
            </div>
            <strong>${escapeHtml(order.totalDisplay)}</strong>
          </div>
        `;

    return `
      <article class="admin-card admin-order-card" data-order-id="${escapeHtml(order.id)}">
        <div>
          <div class="admin-order-top">
            <div>
              <p class="admin-order-id">${escapeHtml(order.id)}</p>
              <h3>${escapeHtml(order.customerName)}</h3>
            </div>
            <span class="admin-badge ${escapeHtml(order.status)}">${escapeHtml(order.status)}</span>
          </div>

          <div class="admin-order-meta">
            <span><strong>Email:</strong> ${escapeHtml(order.customerEmail)}</span>
            <span><strong>Phone:</strong> ${escapeHtml(order.customerPhone)}</span>
            <span><strong>Address:</strong> ${escapeHtml(order.customerAddress)}${order.customerCity ? `, ${escapeHtml(order.customerCity)}` : ''}${order.customerZip ? ` - ${escapeHtml(order.customerZip)}` : ''}</span>
            <span><strong>Total:</strong> ${escapeHtml(order.totalDisplay)}${Number.isFinite(order.totalAmount) && order.totalAmount > 0 ? ` (${currencyFormat.format(order.totalAmount)})` : ''}</span>
            <span><strong>Placed:</strong> ${escapeHtml(formatDate(order.createdAt))}</span>
            ${order.customerNote ? `<span><strong>Note:</strong> ${escapeHtml(order.customerNote)}</span>` : ''}
            ${order.customerEmailSkipped ? `<span><strong>Email:</strong> Customer confirmation skipped in current sender mode</span>` : ''}
          </div>

          <div class="admin-order-lines">${lines}</div>
        </div>

        <div class="admin-order-panel">
          <label class="admin-field">
            <span>Status</span>
            <select class="admin-status-input">
              ${ORDER_STATUSES.map((status) => `<option value="${status}" ${status === order.status ? 'selected' : ''}>${status}</option>`).join('')}
            </select>
          </label>

          <label class="admin-field">
            <span>Admin Note</span>
            <textarea class="admin-note-input" placeholder="Add internal notes for packing, delivery, follow-up...">${escapeHtml(order.adminNote || '')}</textarea>
          </label>

          <div class="admin-order-actions">
            <p class="admin-copy">Updated ${escapeHtml(formatDate(order.updatedAt))}</p>
            <button type="button" class="admin-save-btn">Save Changes</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function showLogin() {
  loginPanel.classList.remove('hidden');
  dashboard.classList.add('hidden');
}

function showDashboard() {
  loginPanel.classList.add('hidden');
  dashboard.classList.remove('hidden');
}

async function loadOrders() {
  setState('Loading orders...');

  const query = new URLSearchParams({
    search: searchInput.value.trim(),
    status: statusFilter.value,
  });

  try {
    const payload = await apiRequest(`${ADMIN_ORDERS_API}?${query.toString()}`, { method: 'GET' });
    currentOrders = payload.orders || [];
    buildStats(currentOrders);
    renderOrders(currentOrders);
    showDashboard();
    setState('');
  } catch (error) {
    if (error.status === 401) {
      showLogin();
      setState('');
      return;
    }

    setState(error.message || 'Unable to load orders right now.');
  }
}

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginButton.disabled = true;
  loginButton.textContent = 'Opening...';
  setState('');

  try {
    await apiRequest(ADMIN_LOGIN_API, {
      method: 'POST',
      body: JSON.stringify({ password: passwordInput.value }),
    });

    passwordInput.value = '';
    await loadOrders();
  } catch (error) {
    setState(error.message || 'Unable to log in right now.');
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = 'Open Dashboard';
  }
});

refreshButton?.addEventListener('click', () => {
  loadOrders();
});

logoutButton?.addEventListener('click', async () => {
  await apiRequest(ADMIN_LOGOUT_API, { method: 'POST' }).catch(() => {});
  currentOrders = [];
  ordersContainer.innerHTML = '';
  statsContainer.innerHTML = '';
  showLogin();
  setState('Logged out successfully.');
});

searchInput?.addEventListener('input', () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    loadOrders();
  }, 300);
});

statusFilter?.addEventListener('change', () => {
  loadOrders();
});

ordersContainer?.addEventListener('click', async (event) => {
  const saveButton = event.target.closest('.admin-save-btn');
  if (!saveButton) {
    return;
  }

  const card = saveButton.closest('[data-order-id]');
  if (!card) {
    return;
  }

  const orderId = card.dataset.orderId;
  const statusInput = card.querySelector('.admin-status-input');
  const noteInput = card.querySelector('.admin-note-input');

  saveButton.disabled = true;
  saveButton.textContent = 'Saving...';

  try {
    const payload = await apiRequest(ADMIN_ORDER_UPDATE_API, {
      method: 'PATCH',
      body: JSON.stringify({
        id: orderId,
        status: statusInput?.value,
        admin_note: noteInput?.value || '',
      }),
    });

    const nextOrder = payload.order;
    currentOrders = currentOrders.map((order) => (order.id === nextOrder.id ? nextOrder : order));
    buildStats(currentOrders);
    renderOrders(currentOrders);
    setState(`Order ${orderId} updated.`);
  } catch (error) {
    setState(error.message || 'Unable to update this order right now.');
  }
});

loadOrders();
