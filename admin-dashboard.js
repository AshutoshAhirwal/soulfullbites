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
const paymentFilter = document.getElementById('admin-payment-filter');
const sortFilter = document.getElementById('admin-sort-filter');
const exportBtn = document.getElementById('admin-export-csv');
const tabsContainer = document.getElementById('admin-tabs');
let activeStatus = 'all';
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
    ordersContainer.innerHTML = '<section class="admin-card"><p class="admin-copy" style="text-align:center; padding: 4rem; opacity: 0.5;">No orders found for this status.</p></section>';
    return;
  }

  ordersContainer.innerHTML = orders.map((order) => {
    const lines = Array.isArray(order.items) && order.items.length > 0
      ? order.items.map((item) => `
          <div class="admin-order-line" style="display:flex; justify-content:space-between; margin-bottom: 0.5rem; font-size: 0.85rem;">
            <span><strong style="color:var(--choc-dark)">${escapeHtml(item.qty || 1)}x</strong> ${escapeHtml(item.name)}</span>
            <span style="color:#666">${currencyFormat.format(Number(item.lineTotal || item.price || 0))}</span>
          </div>
        `).join('')
      : `<p style="font-size:0.85rem; color:#666">${escapeHtml(order.itemsText)}</p>`;

    return `
      <article class="admin-card admin-order-card" data-order-id="${escapeHtml(order.id)}" style="margin-bottom: 1.5rem;">
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div class="admin-order-top" style="border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 1rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span class="status-dot ${escapeHtml(order.status)}"></span>
              <div>
                <p class="admin-order-id" style="margin: 0; font-size: 0.75rem; color: #999; font-family: monospace;">${escapeHtml(order.id)}</p>
                <h3 style="margin: 0; font-size: 1.4rem;">${escapeHtml(order.customerName)}</h3>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
               <div style="display: flex; gap: 0.5rem;">
                 <span class="admin-badge ${escapeHtml(order.status)}">${escapeHtml(order.status.toUpperCase())}</span>
                 <span class="admin-badge ${escapeHtml(order.paymentStatus === 'paid' ? 'paid' : 'unpaid')}" style="font-size: 0.7rem;">${escapeHtml(order.paymentStatus === 'paid' ? 'PAID' : 'UNPAID')}</span>
               </div>
               <span style="font-size: 1.2rem; color: var(--gold); font-weight: 700;">${escapeHtml(order.totalDisplay)}</span>
            </div>
          </div>

          <!-- Mid Section: Details & Items -->
          <div class="card-split-grid">
            <div class="admin-order-meta" style="font-size: 0.85rem; line-height: 1.6;">
                <p><strong>Contact:</strong> ${escapeHtml(order.customerName)}<br>${escapeHtml(order.customerEmail)} / <a href="tel:${order.customerPhone}" style="color: inherit;">${escapeHtml(order.customerPhone)}</a></p>
                <p><strong>Address:</strong> ${escapeHtml(order.customerAddress)}${order.customerCity ? `, ${escapeHtml(order.customerCity)}` : ''}</p>
                <p style="color: #999; margin-top: 1rem;">Placed ${escapeHtml(formatDate(order.createdAt))}</p>
                ${order.customerNote ? `<p style="margin-top: 1rem; padding: 1rem; background: rgba(138, 99, 24, 0.05); border-radius: 1rem; border-left: 3px solid #8a6318;"><strong>Note:</strong> ${escapeHtml(order.customerNote)}</p>` : ''}
            </div>
            <div class="admin-order-content-inner">
                <span class="admin-order-id" style="margin-bottom:0.8rem; display: block; opacity: 0.6;">Order Contents</span>
                ${lines}
            </div>
          </div>

          <div class="admin-order-panel" style="border-top: 1px solid rgba(0,0,0,0.05); padding-top: 1.5rem; display: flex; flex-direction: column; gap: 1.2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                    <span style="font-size: 0.7rem; color: #bbb; text-transform: uppercase; margin-right: 0.5rem; font-weight: 600;">Fast Workflow</span>
                    ${order.status === 'new' ? `<button class="admin-secondary-btn quick-status" data-status="confirmed" style="padding: 0.4rem 1rem; font-size: 0.8rem; background: #eef2ff; color: #3730a3; border-color: #c7d2fe;">Confirm Order</button>` : ''}
                    ${order.status === 'confirmed' ? `<button class="admin-secondary-btn quick-status" data-status="preparing" style="padding: 0.4rem 1rem; font-size: 0.8rem; background: #fffbeb; color: #92400e; border-color: #fef3c7;">Start Packing</button>` : ''}
                    ${order.status === 'preparing' ? `<button class="admin-secondary-btn quick-status" data-status="delivered" style="padding: 0.4rem 1rem; font-size: 0.8rem; background: #ecfdf5; color: #065f46; border-color: #d1fae5;">Mark Out for Delivery</button>` : ''}
                </div>
                
                <div style="display: flex; align-items: center; gap: 0.8rem;">
                    <select class="admin-status-input" style="padding: 0.5rem; border-radius: 0.6rem; border: 1px solid #eee; font-size: 0.85rem; background: #fff;">
                      ${ORDER_STATUSES.map((status) => `<option value="${status}" ${status === order.status ? 'selected' : ''}>${status.toUpperCase()}</option>`).join('')}
                    </select>
                    <button type="button" class="admin-save-btn" style="padding: 0.6rem 1.2rem; font-size: 0.85rem; border-radius: 0.6rem;">Save Details</button>
                </div>
            </div>
            
            <div style="position: relative;">
                <textarea class="admin-note-input" placeholder="Add packing instructions or internal notes here..." style="width: 100%; height: 70px; padding: 1rem; border-radius: 1rem; border: 1px solid #f3f3f3; font-size: 0.85rem; background: #fff; resize: vertical;">${escapeHtml(order.adminNote || '')}</textarea>
                <p style="font-size: 0.7rem; color: #ccc; text-align: right; margin-top: 0.3rem;">Internal Use Only • Last update ${escapeHtml(formatDate(order.updatedAt))}</p>
            </div>
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
    status: activeStatus,
    paymentStatus: paymentFilter ? paymentFilter.value : 'all',
    sort: sortFilter ? sortFilter.value : 'created_at:desc',
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

paymentFilter?.addEventListener('change', () => loadOrders());
sortFilter?.addEventListener('change', () => loadOrders());

tabsContainer?.addEventListener('click', (e) => {
  const tab = e.target.closest('.admin-tab');
  if (!tab) return;

  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  activeStatus = tab.dataset.status;
  loadOrders();
});

exportBtn?.addEventListener('click', () => {
    if (currentOrders.length === 0) return alert('No orders to export');
    
    const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Phone', 'Total', 'Payment', 'Status', 'Items'];
    const rows = currentOrders.map(o => [
        o.id,
        new Date(o.createdAt).toLocaleDateString(),
        o.customerName,
        o.customerEmail,
        o.customerPhone,
        o.totalAmount,
        o.paymentStatus,
        o.status,
        o.itemsText.replace(/\n/g, '; ')
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `soulfullbites_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});


ordersContainer?.addEventListener('click', async (event) => {
  const quickBtn = event.target.closest('.quick-status');
  if (quickBtn) {
    const card = quickBtn.closest('[data-order-id]');
    const orderId = card.dataset.orderId;
    const nextStatus = quickBtn.dataset.status;
    
    quickBtn.disabled = true;
    quickBtn.textContent = 'Updating...';

    try {
      const payload = await apiRequest(ADMIN_ORDER_UPDATE_API, {
        method: 'PATCH',
        body: JSON.stringify({ id: orderId, status: nextStatus }),
      });
      const nextOrder = payload.order;
      currentOrders = currentOrders.map((order) => (order.id === nextOrder.id ? nextOrder : order));
      buildStats(currentOrders);
      renderOrders(currentOrders);
      setState(`Order ${orderId} marked as ${nextStatus}.`);
    } catch (err) {
      setState(err.message || 'Quick update failed.');
    } finally {
      quickBtn.disabled = false;
    }
    return;
  }

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
