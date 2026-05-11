// ─────────────────────────────────────────────────────────────────────────────
// SoulfullBites — User Dashboard Logic
// ─────────────────────────────────────────────────────────────────────────────

const API = '/api';
const $ = (id) => document.getElementById(id);

// ── State ─────────────────────────────────────────────────────────────────────
let currentUser = null;
let allOrders = [];
let allWishlist = [];
let allAddresses = [];
let activeSection = 'overview';

// ── Bootstrap ─────────────────────────────────────────────────────────────────
async function init() {
  // 1. Auth check — must be logged in
  const { user } = await fetchJSON('/user-auth', 'GET') || {};
  if (!user) {
    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    return;
  }
  currentUser = user;
  renderUserInfo();

  // 2. Load data in parallel
  await Promise.all([loadOrders(), loadWishlist(), loadAddresses()]);
  renderOverview();
  setupNav();
  setupMobile();
  setupLogout();
  prefillSettingsForms();
}

// ── API Helper ────────────────────────────────────────────────────────────────
async function fetchJSON(endpoint, method = 'GET', body = null) {
  const opts = {
    method,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(`${API}${endpoint}`, opts);
    if (res.status === 401) {
      window.location.href = '/login';
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error('API Error:', e);
    return null;
  }
}

// ── User Info Rendering ───────────────────────────────────────────────────────
function renderUserInfo() {
  const initial = (currentUser.name || '?')[0].toUpperCase();
  $('dash-avatar').textContent = initial;
  $('dash-mobile-avatar').textContent = initial;
  $('dash-user-name').textContent = currentUser.name;
  $('dash-user-email').textContent = currentUser.email;
  $('overview-greeting').textContent = `Welcome back, ${currentUser.name.split(' ')[0]}!`;

  const badge = $('dash-user-role-badge');
  badge.textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
  badge.className = `dash-role-badge role-${currentUser.role}`;
}

// ── Data Loaders ──────────────────────────────────────────────────────────────
async function loadOrders() {
  const data = await fetchJSON('/user-orders', 'GET');
  allOrders = data?.orders || [];
  $('orders-badge').textContent = allOrders.length;
  $('orders-badge').style.display = allOrders.length ? '' : 'none';
}

async function loadWishlist() {
  const data = await fetchJSON('/user-wishlist', 'GET');
  allWishlist = data?.wishlist || [];
  $('wishlist-badge').textContent = allWishlist.length;
  $('wishlist-badge').style.display = allWishlist.length ? '' : 'none';
}

async function loadAddresses() {
  const data = await fetchJSON('/user-addresses', 'GET');
  allAddresses = data?.addresses || [];
}

// ── Navigation ────────────────────────────────────────────────────────────────
function setupNav() {
  document.querySelectorAll('.dash-nav-item').forEach((btn) => {
    btn.addEventListener('click', () => switchSection(btn.dataset.section));
  });
  // "View all" link buttons inside sections
  document.querySelectorAll('[data-section]').forEach((el) => {
    if (el.classList.contains('dash-link-btn')) {
      el.addEventListener('click', () => switchSection(el.dataset.section));
    }
  });
}

function switchSection(name) {
  if (activeSection === name) return;
  activeSection = name;

  document.querySelectorAll('.dash-section').forEach((s) => s.classList.remove('active'));
  document.querySelectorAll('.dash-nav-item').forEach((b) => b.classList.remove('active'));

  const section = $(`section-${name}`);
  const navBtn = $(`nav-${name}`);
  if (section) section.classList.add('active');
  if (navBtn) navBtn.classList.add('active');

  // Lazy-render sections
  if (name === 'orders') renderOrders();
  if (name === 'wishlist') renderWishlist();
  if (name === 'addresses') renderAddresses();

  // Close mobile sidebar
  $('dash-sidebar').classList.remove('open');
  $('dash-overlay').classList.add('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Mobile Sidebar ────────────────────────────────────────────────────────────
function setupMobile() {
  $('dash-mobile-menu').addEventListener('click', () => {
    $('dash-sidebar').classList.add('open');
    $('dash-overlay').classList.remove('hidden');
  });
  $('dash-overlay').addEventListener('click', () => {
    $('dash-sidebar').classList.remove('open');
    $('dash-overlay').classList.add('hidden');
  });
}

// ── Logout ────────────────────────────────────────────────────────────────────
function setupLogout() {
  $('dash-logout-btn').addEventListener('click', async () => {
    await fetchJSON('/user-auth', 'DELETE');
    window.location.href = '/login';
  });
}

// ── Message Banner ────────────────────────────────────────────────────────────
function showMessage(text, type = 'info', duration = 4000) {
  const el = $('dash-message');
  el.textContent = text;
  el.className = `dash-message ${type}`;
  el.classList.remove('hidden');
  if (duration > 0) setTimeout(() => el.classList.add('hidden'), duration);
}

// ── OVERVIEW Section ──────────────────────────────────────────────────────────
function renderOverview() {
  $('stat-orders').textContent = allOrders.length;
  $('stat-wishlist').textContent = allWishlist.length;
  $('stat-addresses').textContent = allAddresses.length;
  $('stat-delivered').textContent = allOrders.filter((o) => o.status === 'delivered').length;

  const recentContainer = $('overview-recent-orders');
  const recent = allOrders.slice(0, 3);
  if (!recent.length) {
    recentContainer.innerHTML = emptyState('📦', 'No orders yet', 'Your chocolate journey awaits! <a href="/shop" style="color:var(--gold)">Browse the shop →</a>');
    return;
  }
  recentContainer.innerHTML = recent.map(renderOrderCard).join('');
  attachReorderListeners(recentContainer);
}

// ── ORDERS Section ────────────────────────────────────────────────────────────
function renderOrders(filter = 'all', search = '') {
  const container = $('orders-list');
  let orders = [...allOrders];

  if (filter !== 'all') orders = orders.filter((o) => o.status === filter);
  if (search) {
    const q = search.toLowerCase();
    orders = orders.filter((o) =>
      o.id.toLowerCase().includes(q) || o.itemsText?.toLowerCase().includes(q)
    );
  }

  if (!orders.length) {
    container.innerHTML = emptyState('📦', 'No orders found', 'Try adjusting your filters.');
    return;
  }
  container.innerHTML = orders.map(renderOrderCard).join('');
  attachReorderListeners(container);
}

function renderOrderCard(order) {
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return `
    <div class="dash-order-card">
      <div>
        <div class="dash-order-id">${order.id}</div>
        <div class="dash-order-items">${order.itemsText || order.items?.map((i) => `${i.name} ×${i.quantity}`).join(', ') || '—'}</div>
        <div class="dash-order-meta">
          <span>${date}</span>
          <span>${order.totalDisplay || '—'}</span>
        </div>
      </div>
      <div class="dash-order-actions">
        <span class="status-badge status-${order.status}">${order.status}</span>
        <button class="dash-icon-btn reorder-btn" data-order-id="${order.id}" title="Reorder">Reorder</button>
      </div>
    </div>
  `;
}

function attachReorderListeners(container) {
  container.querySelectorAll('.reorder-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const order = allOrders.find((o) => o.id === btn.dataset.orderId);
      if (!order?.items?.length) return;

      // Add items back to cart (localStorage)
      const cartKey = 'soulfullbites_bag';
      let cart = [];
      try { cart = JSON.parse(localStorage.getItem(cartKey)) || []; } catch {}

      order.items.forEach((item) => {
        const existing = cart.find((c) => c.id === item.id);
        if (existing) { existing.quantity = (existing.quantity || 1) + item.quantity; }
        else { cart.push({ ...item }); }
      });
      localStorage.setItem(cartKey, JSON.stringify(cart));
      showMessage('Items added to your bag! 🛒', 'success');
    });
  });
}

// Order search & filter
$('order-search')?.addEventListener('input', (e) => {
  renderOrders($('order-status-filter').value, e.target.value);
});
$('order-status-filter')?.addEventListener('change', (e) => {
  renderOrders(e.target.value, $('order-search').value);
});

// ── WISHLIST Section ──────────────────────────────────────────────────────────
function renderWishlist() {
  const container = $('wishlist-grid');

  if (!allWishlist.length) {
    container.innerHTML = emptyState('❤️', 'Your wishlist is empty', '<a href="/shop" style="color:var(--gold)">Explore our chocolates →</a>');
    return;
  }

  container.innerHTML = allWishlist.map((item) => `
    <div class="dash-product-card" data-product-id="${item.product_id}">
      <div class="dash-product-img">
        ${item.image_slug
          ? `<img src="/api/media?slug=${encodeURIComponent(item.image_slug)}" alt="${item.name}" loading="lazy" onerror="this.parentElement.textContent='🍫'">`
          : '🍫'}
      </div>
      <div class="dash-product-body">
        <div class="dash-product-name">${item.name || 'Product'}</div>
        <div class="dash-product-price">₹${((item.price || 0) / 100).toFixed(2)}</div>
        <div class="dash-product-actions">
          <button class="dash-primary-btn add-to-bag-btn" data-id="${item.product_id}" data-name="${item.name}" data-price="${item.price}" style="font-size:0.8rem;padding:0.5rem 0.9rem;">Add to Bag</button>
          <button class="dash-icon-btn danger remove-wishlist-btn" data-id="${item.product_id}">✕</button>
        </div>
      </div>
    </div>
  `).join('');

  // Add to bag
  container.querySelectorAll('.add-to-bag-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cartKey = 'soulfullbites_bag';
      let cart = [];
      try { cart = JSON.parse(localStorage.getItem(cartKey)) || []; } catch {}
      const existing = cart.find((c) => c.id === btn.dataset.id);
      if (existing) { existing.quantity = (existing.quantity || 1) + 1; }
      else { cart.push({ id: btn.dataset.id, name: btn.dataset.name, price: Number(btn.dataset.price), quantity: 1 }); }
      localStorage.setItem(cartKey, JSON.stringify(cart));
      showMessage(`"${btn.dataset.name}" added to bag! 🛒`, 'success');
    });
  });

  // Remove from wishlist
  container.querySelectorAll('.remove-wishlist-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const res = await fetchJSON(`/user-wishlist?productId=${btn.dataset.id}`, 'DELETE');
      if (res?.success) {
        allWishlist = allWishlist.filter((w) => w.product_id !== btn.dataset.id);
        $('wishlist-badge').textContent = allWishlist.length;
        $('stat-wishlist').textContent = allWishlist.length;
        renderWishlist();
        showMessage('Removed from wishlist.', 'info');
      }
    });
  });
}

// ── ADDRESSES Section ─────────────────────────────────────────────────────────
function renderAddresses() {
  const container = $('addresses-grid');

  if (!allAddresses.length) {
    container.innerHTML = emptyState('🏠', 'No saved addresses', 'Add an address for faster checkout.');
    return;
  }

  container.innerHTML = allAddresses.map((addr) => `
    <div class="dash-address-card ${addr.is_default ? 'is-default' : ''}">
      <div class="dash-address-label">
        ${addr.label}
        ${addr.is_default ? '<span class="dash-address-default-tag">Default</span>' : ''}
      </div>
      <div class="dash-address-text">
        ${[addr.address, addr.city, addr.zip].filter(Boolean).join(', ')}
      </div>
      <div class="dash-address-actions">
        <button class="dash-icon-btn edit-addr-btn" data-id="${addr.id}">Edit</button>
        ${!addr.is_default ? `<button class="dash-icon-btn set-default-btn" data-id="${addr.id}">Set Default</button>` : ''}
        <button class="dash-icon-btn danger delete-addr-btn" data-id="${addr.id}">Delete</button>
      </div>
    </div>
  `).join('');

  // Edit
  container.querySelectorAll('.edit-addr-btn').forEach((btn) => {
    btn.addEventListener('click', () => openAddressForm(btn.dataset.id));
  });
  // Set Default
  container.querySelectorAll('.set-default-btn').forEach((btn) => {
    btn.addEventListener('click', () => saveAddress({ isDefault: true }, btn.dataset.id));
  });
  // Delete
  container.querySelectorAll('.delete-addr-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this address?')) return;
      const res = await fetchJSON(`/user-addresses?id=${btn.dataset.id}`, 'DELETE');
      if (res?.success) {
        allAddresses = allAddresses.filter((a) => a.id != btn.dataset.id);
        $('stat-addresses').textContent = allAddresses.length;
        renderAddresses();
        showMessage('Address deleted.', 'info');
      }
    });
  });
}

function openAddressForm(editId = null) {
  const formCard = $('address-form-card');
  const title = $('address-form-title');
  const form = $('address-form');

  formCard.classList.remove('hidden');
  formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (editId) {
    const addr = allAddresses.find((a) => a.id == editId);
    title.textContent = 'Edit Address';
    $('address-edit-id').value = editId;
    $('addr-label').value = addr?.label || 'Home';
    $('addr-address').value = addr?.address || '';
    $('addr-city').value = addr?.city || '';
    $('addr-zip').value = addr?.zip || '';
    $('addr-default').checked = addr?.is_default || false;
  } else {
    title.textContent = 'Add New Address';
    form.reset();
    $('address-edit-id').value = '';
    $('addr-label').value = 'Home';
  }
}

$('add-address-btn')?.addEventListener('click', () => openAddressForm());
$('address-cancel-btn')?.addEventListener('click', () => {
  $('address-form-card').classList.add('hidden');
  $('address-form').reset();
});

$('address-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const editId = $('address-edit-id').value;
  const body = {
    label: $('addr-label').value.trim(),
    address: $('addr-address').value.trim(),
    city: $('addr-city').value.trim(),
    zip: $('addr-zip').value.trim(),
    isDefault: $('addr-default').checked,
  };
  if (!body.address) { showMessage('Address is required.', 'error'); return; }
  await saveAddress(body, editId || null);
});

async function saveAddress(body, editId = null) {
  const submitBtn = $('address-submit-btn');
  if (submitBtn) submitBtn.disabled = true;

  const method = editId ? 'PATCH' : 'POST';
  const endpoint = editId ? `/user-addresses?id=${editId}` : '/user-addresses';
  const res = await fetchJSON(endpoint, method, body);

  if (submitBtn) submitBtn.disabled = false;

  if (res?.address || res?.success) {
    await loadAddresses();
    $('stat-addresses').textContent = allAddresses.length;
    renderAddresses();
    $('address-form-card').classList.add('hidden');
    showMessage(editId ? 'Address updated!' : 'Address saved!', 'success');
  } else {
    showMessage(res?.error || 'Failed to save address.', 'error');
  }
}

// ── SETTINGS Section ──────────────────────────────────────────────────────────
function prefillSettingsForms() {
  $('profile-name').value = currentUser.name;
  $('profile-phone').value = currentUser.phone || '';
  $('profile-email').value = currentUser.email;
}

$('profile-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = $('profile-save-btn');
  btn.disabled = true; btn.textContent = 'Saving…';

  const res = await fetchJSON('/user-profile', 'PATCH', {
    name: $('profile-name').value.trim(),
    phone: $('profile-phone').value.trim(),
  });

  btn.disabled = false; btn.textContent = 'Save Changes';

  if (res?.success) {
    currentUser = { ...currentUser, ...res.user };
    renderUserInfo();
    showMessage('Profile updated successfully!', 'success');
  } else {
    showMessage(res?.error || 'Failed to update profile.', 'error');
  }
});

$('password-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const current = $('pw-current').value;
  const newPw = $('pw-new').value;
  const confirm = $('pw-confirm').value;

  if (!current || !newPw || !confirm) { showMessage('All password fields are required.', 'error'); return; }
  if (newPw.length < 8) { showMessage('New password must be at least 8 characters.', 'error'); return; }
  if (newPw !== confirm) { showMessage('New passwords do not match.', 'error'); return; }

  const btn = $('pw-save-btn');
  btn.disabled = true; btn.textContent = 'Updating…';

  const res = await fetchJSON('/user-profile?section=password', 'PATCH', {
    section: 'password', currentPassword: current, newPassword: newPw,
  });

  btn.disabled = false; btn.textContent = 'Update Password';

  if (res?.success) {
    $('password-form').reset();
    showMessage('Password changed successfully!', 'success');
  } else {
    showMessage(res?.error || 'Failed to update password.', 'error');
  }
});

$('delete-account-btn')?.addEventListener('click', () => {
  if (confirm('Are you absolutely sure? This will permanently delete your account and all data.')) {
    showMessage('To delete your account, please contact support@soulfullbites.com', 'info', 10000);
  }
});

// ── Utility ───────────────────────────────────────────────────────────────────
function emptyState(icon, title, desc) {
  return `<div class="dash-empty">
    <div class="dash-empty-icon">${icon}</div>
    <h3>${title}</h3>
    <p>${desc}</p>
  </div>`;
}

// ── Run ───────────────────────────────────────────────────────────────────────
init().catch(console.error);
