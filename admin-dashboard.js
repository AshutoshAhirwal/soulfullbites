const stateEl = document.getElementById('admin-state');
const orderList = document.getElementById('admin-order-list');
const productList = document.getElementById('admin-product-list');
const contentForm = document.getElementById('admin-content-form');
const saveContentBtn = document.getElementById('admin-save-content');
const addProductBtn = document.getElementById('admin-add-product');
const refreshBtn = document.getElementById('admin-refresh');
const searchInput = document.getElementById('admin-search');
const paymentFilterInput = document.getElementById('admin-payment-filter');
const sortFilterInput = document.getElementById('admin-sort-filter');

const loginPanel = document.getElementById('admin-login-panel');
const dashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('admin-login-form');
const passwordInput = document.getElementById('admin-password');
const logoutBtn = document.getElementById('admin-logout');

// Orders Filters
const searchInput = document.getElementById('admin-search');
const paymentFilterInput = document.getElementById('admin-payment-filter');
const sortFilterInput = document.getElementById('admin-sort-filter');
const orderDateFilterInput = document.getElementById('admin-date-filter');

// Product Filters
const productSearchInput = document.getElementById('product-search');
const productStatusFilterInput = document.getElementById('product-status-filter');
const productSortFilterInput = document.getElementById('product-sort-filter');

// Users Filters
const usersSearchInput = document.getElementById('users-search');
const usersRoleFilterInput = document.getElementById('users-role-filter');
const usersStatusFilterInput = document.getElementById('users-status-filter');
const usersSortFilterInput = document.getElementById('users-sort-filter');
const usersDateFilterInput = document.getElementById('users-date-filter');

// Permissions Filters
const permCategoryFilterInput = document.getElementById('perm-category-filter');
const permSearchInput = document.getElementById('perm-search');

const moduleOrders = document.getElementById('module-orders');
const moduleProducts = document.getElementById('module-products');
const moduleContent = document.getElementById('module-content');
const moduleUsers = document.getElementById('module-users');
const modulePermissions = document.getElementById('module-permissions');

let currentContentSubTab = 'page-home';
let cachedOrders = [];
let cachedProducts = [];
let orderFilter = 'all';

function setState(msg, type = 'error') {
  if (!stateEl) return;
  stateEl.textContent = msg;
  stateEl.className = `admin-state ${type}`;
  stateEl.classList.toggle('hidden', !msg);
  if (msg) setTimeout(() => stateEl.classList.add('hidden'), 5000);
}

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function apiRequest(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (res.status === 401) {
    showLogin();
    throw new Error('Please login to continue');
  }

  let data;
  try {
    data = await res.json();
  } catch (e) {
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    data = {};
  }

  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function showLogin() {
  loginPanel?.classList.remove('hidden');
  dashboard?.classList.add('hidden');
}

function showDashboard() {
  loginPanel?.classList.add('hidden');
  dashboard?.classList.remove('hidden');
}

// Login Handler
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('admin-login-button');
  if (btn) { btn.disabled = true; btn.textContent = 'Authenticating...'; }

  try {
    await apiRequest('/api/admin-auth', {
      method: 'POST',
      body: JSON.stringify({ password: passwordInput.value })
    });
    showDashboard();
    loadOrders();
  } catch (err) {
    setState(err.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Open Dashboard'; }
  }
});

// Logout Handler
logoutBtn?.addEventListener('click', async () => {
  try {
    await apiRequest('/api/admin-auth', { method: 'DELETE' });
    showLogin();
  } catch (err) { setState('Logout failed'); }
});

refreshBtn?.addEventListener('click', () => {
  if (!moduleOrders.classList.contains('hidden')) loadOrders();
  if (!moduleProducts.classList.contains('hidden')) loadProducts();
});

function applyFilters() {
  if (!moduleOrders.classList.contains('hidden')) {
    const term = (searchInput?.value || '').toLowerCase();
    let filtered = cachedOrders;
    if (orderFilter !== 'all') {
      if (orderFilter === 'paid') filtered = filtered.filter(o => o.paymentStatus === 'paid');
      else if (orderFilter === 'waitlist') filtered = filtered.filter(o => o.paymentStatus === 'waitlist');
      else filtered = filtered.filter(o => o.status === orderFilter);
    }
    if (term) {
      filtered = filtered.filter(o =>
        o.customerName.toLowerCase().includes(term) ||
        o.customerEmail.toLowerCase().includes(term) ||
        o.id.toString().includes(term)
      );
    }
    renderOrders(filtered);
  }

  if (!moduleProducts.classList.contains('hidden')) {
    const term = (productSearchInput?.value || '').toLowerCase();
    let filtered = cachedProducts;
    if (term) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }
    renderProducts(filtered);
  }
}

searchInput?.addEventListener('input', applyFilters);
paymentFilterInput?.addEventListener('change', loadOrders);
sortFilterInput?.addEventListener('change', loadOrders);
orderDateFilterInput?.addEventListener('change', loadOrders);

// Product Filter Listeners
productSearchInput?.addEventListener('input', applyFilters);
productStatusFilterInput?.addEventListener('change', loadProducts);
productSortFilterInput?.addEventListener('change', loadProducts);

// User Filter Listeners
usersSearchInput?.addEventListener('input', loadUsers);
usersRoleFilterInput?.addEventListener('change', loadUsers);
usersStatusFilterInput?.addEventListener('change', loadUsers);
usersSortFilterInput?.addEventListener('change', loadUsers);
usersDateFilterInput?.addEventListener('change', loadUsers);

document.querySelectorAll('#admin-tabs .admin-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#admin-tabs .admin-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    orderFilter = btn.dataset.status;
    applyFilters();
  });
});

// Export CSV Logic
document.getElementById('admin-export-csv')?.addEventListener('click', () => {
  if (!cachedOrders || cachedOrders.length === 0) {
    setState('No order data available for export');
    return;
  }

  const headers = ['ID', 'Customer', 'Email', 'Phone', 'Address', 'Amount', 'Status', 'Payment Status', 'Items'];
  const rows = cachedOrders.map(o => [
    o.id,
    o.customerName,
    o.customerEmail,
    o.customerPhone,
    o.customerAddress,
    o.totalAmount,
    o.status,
    o.paymentStatus,
    (o.items || []).map(i => `${i.name}(${i.quantity ?? i.qty ?? 0})`).join('; ')
  ]);

  const csvBody = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const BOM = '\ufeff';
  const blob = new Blob([BOM + csvBody], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  const date = new Date().toISOString().split('T')[0];
  link.download = `soulfullbites_orders_${date}.csv`;

  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);

  setState('Registry exported to CSV', 'success');
});

// Global Module Switching
function switchModule(moduleName) {
  document.querySelectorAll('[data-module]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.module === moduleName);
  });

  moduleOrders?.classList.toggle('hidden', moduleName !== 'orders');
  moduleProducts?.classList.toggle('hidden', moduleName !== 'products');
  moduleContent?.classList.toggle('hidden', moduleName !== 'content');
  moduleUsers?.classList.toggle('hidden', moduleName !== 'users');
  modulePermissions?.classList.toggle('hidden', moduleName !== 'permissions');

  if (moduleName === 'orders') loadOrders();
  if (moduleName === 'products') loadProducts();
  if (moduleName === 'content') loadContentEditor();
  if (moduleName === 'users') loadUsers();
  if (moduleName === 'permissions') loadPermissionsModule();
}

document.querySelectorAll('.admin-topbar-tab[data-module]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.admin-topbar-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    switchModule(btn.dataset.module);
  });
});

// Order Logic
async function loadOrders() {
  if (!moduleOrders || moduleOrders.classList.contains('hidden')) return;
  setState('Syncing...', 'success');
  try {
    const params = new URLSearchParams();
    const paymentStatus = paymentFilterInput?.value || 'all';
    const sort = sortFilterInput?.value || 'created_at:desc';
    const dateFilter = orderDateFilterInput?.value || 'all';

    if (paymentStatus !== 'all') params.set('paymentStatus', paymentStatus);
    if (sort) params.set('sort', sort);
    if (dateFilter !== 'all') params.set('dateFilter', dateFilter);

    const data = await apiRequest(`/api/admin-orders${params.toString() ? `?${params.toString()}` : ''}`);
    showDashboard();
    cachedOrders = data.orders || [];
    renderStats(cachedOrders);
    applyFilters();
    setState('');
  } catch (err) {
    if (err.message !== 'Please login to continue') setState(err.message || 'Sync failed');
  }
}

function renderStats(orders) {
  const statsContainer = document.getElementById('admin-stats-container');
  if (!statsContainer) return;

  const stats = [
    { label: 'Active/New', val: orders.filter(o => o.status === 'new').length },
    { label: 'Paid Cases', val: orders.filter(o => o.paymentStatus === 'paid').length },
    { label: 'Waitlist', val: orders.filter(o => o.paymentStatus === 'waitlist').length },
    { label: 'Delivered', val: orders.filter(o => o.status === 'delivered').length },
    { label: 'Total Log', val: orders.length }
  ];

  statsContainer.innerHTML = stats.map(s => `
    <div class="admin-stat-chip">
      <strong>${s.val}</strong>
      <span>${s.label}</span>
    </div>
  `).join('');
}

function renderOrders(orders) {
  if (!orders || orders.length === 0) {
    orderList.innerHTML = '<section class="admin-card"><p class="admin-copy" style="text-align:center; padding: 4rem; opacity: 0.5;">No items found matching current filters.</p></section>';
    return;
  }

  orderList.innerHTML = orders.map(ord => `
        <article class="admin-card admin-order-card" style="margin-bottom: 2rem;">
            <div class="admin-order-top" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
                <div>
                    <p class="admin-order-id">Registry #${ord.id}</p>
                    <h3 style="margin-top: 0.2rem; font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 300;">${escapeHtml(ord.customerName)}</h3>
                </div>
                <div style="display: flex; gap: 0.8rem; align-items: center;">
                    <div class="admin-badge ${ord.status}">${ord.status}</div>
                    <div class="admin-badge ${ord.paymentStatus}">${ord.paymentStatus}</div>
                </div>
            </div>

            <div class="card-split-grid" style="margin: 2.5rem 0;">
                <div class="admin-order-panel">
                    <p class="admin-kicker" style="font-size: 0.65rem; margin-bottom: 1rem;">Customer Profile</p>
                    <div class="admin-order-meta">
                        <p style="font-size: 1.05rem;"><strong style="color: var(--gold); font-weight: 600;">Email:</strong> ${escapeHtml(ord.customerEmail)}</p>
                        <p style="font-size: 1.05rem;"><strong style="color: var(--gold); font-weight: 600;">Contact:</strong> ${escapeHtml(ord.customerPhone)}</p>
                        <p style="font-size: 1.05rem;"><strong style="color: var(--gold); font-weight: 600;">Location:</strong> ${escapeHtml(ord.customerAddress)}</p>
                    </div>
                    
                    <div style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(74, 44, 26, 0.08);">
                         <p class="admin-kicker" style="font-size: 0.65rem; margin-bottom: 0.8rem;">Ledger Total</p>
                         <p style="font-size: 2rem; color: var(--choc-dark); font-family: 'Cormorant Garamond', serif; font-style: italic;">₹${ord.totalAmount}</p>
                    </div>
                </div>

                <div class="admin-order-content-inner">
                    <p class="admin-kicker" style="font-size: 0.65rem; opacity: 0.6; margin-bottom: 1rem;">Order Selection</p>
                    <div class="admin-order-lines">
                        ${(ord.items || []).map(it => {
                            const quantity = Number(it.quantity ?? it.qty ?? 0);
                            return `
                            <div class="admin-order-line">
                                <div>
                                    <strong style="color: var(--choc-dark); font-weight: 600;">${escapeHtml(it.name)}</strong>
                                    <small style="display: block; font-size: 0.75rem; opacity: 0.5;">${quantity} Unit${quantity > 1 ? 's' : ''}</small>
                                </div>
                                <span style="font-weight: 600; color: var(--gold);">₹${Number(it.price || 0) * quantity}</span>
                            </div>
                        `;
                        }).join('') || '<p style="opacity: 0.3; font-style: italic; padding: 2rem; text-align: center;">No catalog items found</p>'}
                    </div>
                </div>
            </div>

            <div class="admin-order-actions" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(74, 44, 26, 0.05); display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; gap: 1.5rem; align-items: center;">
                    <select class="admin-select" onchange="updateOrderStatus('${ord.id}', this.value)" style="width: 220px; font-weight: 600;">
                        <option value="new" ${ord.status === 'new' ? 'selected' : ''}>New Activity</option>
                        <option value="confirmed" ${ord.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="preparing" ${ord.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                        <option value="delivered" ${ord.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${ord.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                    <p style="font-size: 0.75rem; color: var(--text-light); opacity: 0.6;">Update order state here as the kitchen and delivery flow progresses.</p>
                </div>
            </div>
        </article>
    `).join('');
}

window.updateOrderStatus = async (id, status) => {
  try {
    await apiRequest('/api/admin-orders', { method: 'PATCH', body: JSON.stringify({ id, status }) });
    loadOrders();
    setState('Status updated', 'success');
  } catch (err) { setState('Update failed'); }
}

// Product Logic
async function compressImage(base64, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
  });
}

window.handleRealUpload = async (input) => {
  const file = input.files[0];
  if (!file) return;

  const container = input.closest('article');
  if (!container) return console.error('Upload: could not find parent card');

  const imgEl = container.querySelector('.admin-prod-preview img');
  const imagesInput = container.querySelector('.prod-images');
  const btnText = container.querySelector('.upload-btn-text');

  if (btnText) btnText.textContent = 'Optimizing...';

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const rawBase64 = e.target.result;

      // Optimize first for performance
      const optimizedBase64 = await compressImage(rawBase64);

      // Show local preview immediately (good UX)
      imgEl.src = optimizedBase64;

      if (btnText) btnText.textContent = 'Uploading...';

      // Send to server
      const res = await fetch('/api/admin-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64: optimizedBase64,
          name: file.name
        })
      });

      if (!res.ok) throw new Error(`Server upload failed (${res.status})`);
      const data = await res.json();
      if (!data.path) throw new Error('Server did not return an image path');

      // Keep only already-uploaded paths (/api/media/ or http://), drop old placeholders like 'chocolate_bar.png'
      const current = imagesInput.value.split(',')
        .map(s => s.trim())
        .filter(s => s && (s.startsWith('/api/') || s.startsWith('http')));
      current.push(data.path);
      imagesInput.value = current.join(', ');

      // Update preview to the served URL
      imgEl.src = data.path;

      if (btnText) btnText.textContent = '📷 Add Another Image';
      setState('Image uploaded & synced ✓', 'success');
    } catch (err) {
      console.error(err);
      if (btnText) btnText.textContent = 'Upload Failed - Retry';
      setState('Upload failed: ' + err.message);
    }
  };
  reader.readAsDataURL(file);
}

async function loadProducts() {
  if (!moduleProducts || moduleProducts.classList.contains('hidden')) return;
  setState('Catalog loading...', 'success');
  try {
    const status = productStatusFilterInput?.value || 'all';
    const sort = productSortFilterInput?.value || 'name:asc';
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    if (sort) params.set('sort', sort);

    const products = await apiRequest(`/api/admin-products?${params.toString()}`);
    cachedProducts = products || [];
    applyFilters();
    setState('');
  } catch (err) { setState(err.message || 'Load failed'); }
}

function renderProducts(products) {
  if (!products || products.length === 0) {
    productList.innerHTML = '<section class="admin-card"><p class="admin-copy" style="text-align:center; padding: 4rem; opacity: 0.5;">Catalog empty.</p></section>';
    return;
  }

  productList.innerHTML = products.map(p => {
    let images = [];
    try { images = JSON.parse(p.images_json || '[]'); } catch (e) { images = [p.image_slug || 'chocolate_bar.png']; }
    const imageStr = images.join(', ');
    const firstImg = images[0] || 'chocolate_bar.png';
    const firstSrc = (firstImg.startsWith('http') || firstImg.startsWith('data') || firstImg.startsWith('/api/')) ? firstImg : `/assets/${firstImg}`;

    return `
        <article class="admin-card" data-product-id="${escapeHtml(p.id)}" style="margin-bottom: 2rem;">
            <div style="display: grid; grid-template-columns: 240px 1fr 1fr; gap: 2.5rem;">
                <div class="admin-prod-sidebar" style="background: rgba(74, 44, 26, 0.02); padding: 1.5rem; border-radius: 2rem;">
                    <p class="admin-kicker" style="font-size: 0.6rem; margin-bottom: 1rem;">Visual Stacks</p>
                    <div class="admin-prod-preview" style="width: 100%; aspect-ratio: 1; background: #fff; border-radius: 1.5rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; position: relative;">
                        <img src="${firstSrc}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://placehold.co/400x400?text=Upload+Error'">
                        <div class="upload-overlay" style="position: absolute; bottom: 0; width: 100%; padding: 0.8rem; background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); text-align: center; border-top: 1px solid rgba(0,0,0,0.05);">
                             <label style="font-size: 0.65rem; font-weight: 700; cursor: pointer; color: var(--choc-dark);">
                                <span class="upload-btn-text">📷 Add New Image</span>
                                <input type="file" class="prod-file-real" accept="image/*" style="display: none;" onchange="handleRealUpload(this)">
                             </label>
                        </div>
                    </div>
                    <label class="admin-field" style="margin-top: 1.5rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                            <span>Visual Asset List</span>
                            <button onclick="this.closest('article').querySelector('.prod-images').value=''; this.closest('article').querySelector('.prod-images').dispatchEvent(new Event('input'))" style="background:none; border:none; color:#9d3030; font-size: 0.6rem; cursor:pointer; text-decoration: underline;">Clear All</button>
                        </div>
                        <input type="text" class="prod-images" value="${escapeHtml(imageStr)}" placeholder="Filenames or URLs" oninput="const first = this.value.split(',')[0].trim(); const src = (first.startsWith('/api/') || first.startsWith('http') || first.startsWith('data')) ? first : '/assets/' + (first || 'chocolate_bar.png'); this.closest('article').querySelector('.admin-prod-preview img').src = src;">
                        <p style="font-size: 0.6rem; opacity: 0.6; margin-top: 0.5rem; line-height: 1.4;">• Use the button above to upload files<br>• Or paste external Image URLs</p>
                    </label>
                </div>
                <div>
                   <p class="admin-kicker" style="font-size: 0.6rem; margin-bottom: 1rem;">Primary Data</p>
                   <label class="admin-field">
                        <span>Product Name</span>
                        <input type="text" class="prod-name" value="${escapeHtml(p.name)}">
                   </label>
                   <label class="admin-field">
                        <span>Description</span>
                        <textarea class="prod-desc" style="min-height: 100px;">${escapeHtml(p.description)}</textarea>
                   </label>
                   <label class="admin-field">
                        <span>Flavor Kicker</span>
                        <input type="text" class="prod-flavor" value="${escapeHtml(p.flavor_note || '')}">
                   </label>
                </div>
                <div>
                   <p class="admin-kicker" style="font-size: 0.6rem; margin-bottom: 1rem;">Specifications</p>
                   <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <label class="admin-field">
                             <span>Price (₹)</span>
                             <input type="number" class="prod-price" value="${p.price}">
                        </label>
                        <label class="admin-field">
                             <span>Visibility</span>
                             <select class="prod-active" style="border-color: ${p.is_active ? '#2d6e4b' : '#999'}">
                                 <option value="true" ${p.is_active ? 'selected' : ''}>Active</option>
                                 <option value="false" ${!p.is_active ? 'selected' : ''}>Hidden</option>
                             </select>
                        </label>
                   </div>
                   <label class="admin-field">
                        <span>Ingredients</span>
                        <textarea class="prod-ingredients" style="min-height: 85px; font-size: 0.8rem;">${escapeHtml(p.ingredients || '')}</textarea>
                   </label>
                   <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
                        <button class="admin-primary-btn prod-save" style="flex: 1;">Save Changes</button>
                        <button class="admin-ghost-btn prod-delete" style="color: #9d3030;">✕</button>
                   </div>
                </div>
            </div>
        </article>
    `;
  }).join('');
}

productList?.addEventListener('click', async (e) => {
  const card = e.target.closest('[data-product-id]');
  if (!card) return;
  const id = card.dataset.productId;

  if (e.target.classList.contains('prod-save')) {
    const btn = e.target;
    btn.disabled = true; btn.textContent = 'Saving...';
    const imgInput = card.querySelector('.prod-images').value;

    // Parse image URLs/data (now all from upload endpoint, so all valid)
    const imgArray = imgInput.split(',')
      .map(s => s.trim())
      .filter(s => s); // Just filter empty strings, keep all URLs/data

    try {
      const saveData = {
        id,
        name: card.querySelector('.prod-name').value,
        description: card.querySelector('.prod-desc').value,
        ingredients: card.querySelector('.prod-ingredients').value,
        price: parseInt(card.querySelector('.prod-price').value),
        image_slug: imgArray[0] || 'chocolate_bar.png',
        images_json: JSON.stringify(imgArray),
        flavor_note: card.querySelector('.prod-flavor').value,
        is_active: card.querySelector('.prod-active').value === 'true'
      };

      console.log('Saving product:', { id, imageCount: imgArray.length, firstImageType: imgArray[0]?.substring(0, 30) });

      await apiRequest('/api/admin-products', {
        method: 'POST',
        body: JSON.stringify(saveData)
      });;
      setState('Catalog synced', 'success');
      loadProducts();
    } catch (err) { setState(err.message || 'Sync failed'); } finally { btn.disabled = false; btn.textContent = 'Save Changes'; }
  }

  if (e.target.classList.contains('prod-delete')) {
    if (!confirm('Delete?')) return;
    try {
      await apiRequest(`/api/admin-products?id=${id}`, { method: 'DELETE' });
      loadProducts();
      setState('Deleted');
    } catch (err) { setState(err.message || 'Failed'); }
  }
});

addProductBtn?.addEventListener('click', async () => {
  const name = prompt('Product Name?', 'New Artisanal Bar');
  if (!name) return;
  const id = 'p' + Date.now();
  try {
    await apiRequest('/api/admin-products', { method: 'POST', body: JSON.stringify({ id, name, description: 'Enter description...', ingredients: '...', price: 450, image_slug: 'chocolate_bar.png', flavor_note: 'Flavor notes', is_active: true }) });
    loadProducts();
    setState('Added to catalog', 'success');
  } catch (err) { setState('Fail'); }
});

// FAQ Logic
async function renderFaqItemList() {
  const listContainer = document.getElementById('faq-items-manager');
  if (!listContainer) return;
  try {
    const faqs = await apiRequest('/api/admin-cms?section=faq');
    listContainer.innerHTML = `
            <div style="margin-top: 3rem; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h3>Archive Questions</h3>
                    <button class="admin-primary-btn" id="add-faq-item-inline">+ Add Question</button>
                </div>
                <div style="display: grid; gap: 1.5rem;">
                    ${faqs.map(f => `
                        <div class="admin-card faq-card-inline" data-id="${f.id}">
                            <div style="display: grid; gap: 1rem;">
                                <div style="display: flex; gap: 1rem;">
                                    <label class="admin-field" style="flex: 2;">
                                        <span>Question</span>
                                        <input type="text" class="fi-q" value="${escapeHtml(f.question)}">
                                    </label>
                                    <label class="admin-field" style="flex: 1;">
                                        <span>Category</span>
                                        <input type="text" class="fi-cat" value="${escapeHtml(f.category)}">
                                    </label>
                                </div>
                                <label class="admin-field">
                                    <span>Answer</span>
                                    <textarea class="fi-a">${escapeHtml(f.answer)}</textarea>
                                </label>
                                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                                    <label class="admin-field" style="width: 100px;">
                                        <span>Sort</span>
                                        <input type="number" class="fi-sort" value="${f.sort_order}">
                                    </label>
                                    <div style="display: flex; gap: 0.5rem; padding-bottom: 0.2rem;">
                                        <button class="admin-save-btn save-faq-inline">Save</button>
                                        <button class="admin-ghost-btn delete-faq-inline" style="color:#9d3030">✕</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    document.getElementById('add-faq-item-inline')?.addEventListener('click', async () => {
      await apiRequest('/api/admin-cms?section=faq', { method: 'POST', body: JSON.stringify({ category: 'General', question: 'New?', answer: '...', is_active: true, sort_order: 10, id: 't' + Date.now() }) });
      renderFaqItemList();
    });
    listContainer.querySelectorAll('.save-faq-inline').forEach(btn => btn.addEventListener('click', async (e) => {
      const card = e.target.closest('.faq-card-inline');
      await apiRequest('/api/admin-cms?section=faq', { method: 'POST', body: JSON.stringify({ id: card.dataset.id, question: card.querySelector('.fi-q').value, category: card.querySelector('.fi-cat').value, answer: card.querySelector('.fi-a').value, sort_order: parseInt(card.querySelector('.fi-sort').value), is_active: true }) });
      setState('Saved', 'success');
      renderFaqItemList();
    }));
    listContainer.querySelectorAll('.delete-faq-inline').forEach(btn => btn.addEventListener('click', async (e) => {
      if (confirm('Delete?')) { await apiRequest(`/api/admin-cms?section=faq&id=${e.target.closest('.faq-card-inline').dataset.id}`, { method: 'DELETE' }); renderFaqItemList(); }
    }));
  } catch (e) { }
}

const CONTENT_DEFINITION = [
  {
    id: 'page-home', label: 'Home Page', sections: [
      {
        label: 'Hero Section', fields: [
          { key: 'home_h1', label: 'Main Headline', type: 'textarea' },
          { key: 'home_p', label: 'Sub-headline', type: 'textarea' },
          { key: 'home_cta', label: 'CTA Button Text', type: 'text' },
        ]
      },
      {
        label: 'Origin Section', fields: [
          { key: 'home_origin_h', label: 'Origin Title', type: 'text' },
          { key: 'home_origin_p', label: 'Origin Story', type: 'textarea' },
        ]
      },
      {
        label: 'Our Story', fields: [
          { key: 'home_story_h', label: 'Story Title', type: 'text' },
          { key: 'home_story_p', label: 'Main Narrative', type: 'textarea' },
          { key: 'home_story_quote', label: 'Featured Quote', type: 'textarea' },
        ]
      },
      {
        label: 'The Craft', fields: [
          { key: 'home_craft_h', label: 'Craft Title', type: 'text' },
          { key: 'home_craft_p', label: 'Craft Description', type: 'textarea' },
        ]
      },
      {
        label: 'Insider Signup', fields: [
          { key: 'home_newsletter_h', label: 'Signup Title', type: 'text' },
          { key: 'home_newsletter_p', label: 'Signup Copy', type: 'textarea' },
          { key: 'home_newsletter_cta', label: 'Signup Button', type: 'text' },
        ]
      },
      {
        label: 'Promises', fields: [
          { key: 'promises_h2', label: 'Section Title', type: 'text' },
          { key: 'promise_1_h', label: 'Promise 1 Title', type: 'text' },
          { key: 'promise_1_p', label: 'Promise 1 Desc', type: 'textarea' },
          { key: 'promise_2_h', label: 'Promise 2 Title', type: 'text' },
          { key: 'promise_2_p', label: 'Promise 2 Desc', type: 'textarea' },
          { key: 'promise_3_h', label: 'Promise 3 Title', type: 'text' },
          { key: 'promise_3_p', label: 'Promise 3 Desc', type: 'textarea' },
          { key: 'promise_4_h', label: 'Promise 4 Title', type: 'text' },
          { key: 'promise_4_p', label: 'Promise 4 Desc', type: 'textarea' },
        ]
      },
      {
        label: 'Footer Global', fields: [
          { key: 'site_title', label: 'Brand Name', type: 'text' },
          { key: 'footer_desc', label: 'Footer About', type: 'textarea' },
          { key: 'footer_col2_title', label: 'Col 2 Title', type: 'text' },
          { key: 'insta_label', label: 'Insta Label', type: 'text' },
          { key: 'footer_copy', label: 'Copyright Text', type: 'text' },
          { key: 'footer_credit', label: 'Credit Text', type: 'text' },
        ]
      }
    ]
  },
  {
    id: 'page-shop', label: 'Shop Page', sections: [
      {
        label: 'Shop Header', fields: [
          { key: 'shop_h1', label: 'Shop Headline', type: 'text' },
          { key: 'shop_p', label: 'Shop Introduction', type: 'textarea' },
        ]
      },
      {
        label: 'Cart UI', fields: [
          { key: 'shop_bag_title', label: 'Cart Heading', type: 'text' },
          { key: 'shop_empty_msg', label: 'Empty Msg', type: 'text' },
          { key: 'shop_checkout_txt', label: 'Checkout Button', type: 'text' },
        ]
      }
    ]
  },
  {
    id: 'page-about', label: 'Our Story', sections: [
      {
        label: 'About Header', fields: [
          { key: 'about_h1', label: 'Page Title', type: 'textarea' },
          { key: 'about_p', label: 'Manifesto Text', type: 'textarea' },
        ]
      },
      {
        label: 'Chapter 1', fields: [
          { key: 'about_chap1_h2', label: 'Chapter Title', type: 'textarea' },
          { key: 'about_chap1_p', label: 'Chapter Text', type: 'textarea' },
          { key: 'about_quote', label: 'Featured Quote', type: 'textarea' },
        ]
      },
      {
        label: 'The Raw Spirit', fields: [
          { key: 'about_raw_h2', label: 'Section Title', type: 'textarea' },
          { key: 'about_raw_1_h', label: 'Focus 1 Title', type: 'text' },
          { key: 'about_raw_1_p', label: 'Focus 1 Text', type: 'textarea' },
          { key: 'about_raw_2_h', label: 'Focus 2 Title', type: 'text' },
          { key: 'about_raw_2_p', label: 'Focus 2 Text', type: 'textarea' },
          { key: 'about_raw_3_h', label: 'Focus 3 Title', type: 'text' },
          { key: 'about_raw_3_p', label: 'Focus 3 Text', type: 'textarea' },
        ]
      },
      {
        label: 'Philosophy', fields: [
          { key: 'about_philo_h2', label: 'Philosophy Title', type: 'textarea' },
          { key: 'about_philo_p', label: 'Philosophy Text', type: 'textarea' },
        ]
      },
      {
        label: 'Impact', fields: [
          { key: 'about_impact_h2', label: 'Impact Title', type: 'textarea' },
          { key: 'about_impact_p', label: 'Impact Text', type: 'textarea' },
        ]
      }
    ]
  },
  {
    id: 'page-inspiration', label: 'Inspiration', sections: [
      {
        label: 'Editorial Header', fields: [
          { key: 'insp_h1', label: 'Page Headline', type: 'text' },
          { key: 'insp_p', label: 'Introduction Text', type: 'textarea' },
        ]
      },
      {
        label: 'Codex Entries', fields: [
          { key: 'codex_1_h', label: 'Entry 1 Title', type: 'text' },
          { key: 'codex_1_p', label: 'Entry 1 Text', type: 'textarea' },
          { key: 'codex_2_h', label: 'Entry 2 Title', type: 'text' },
          { key: 'codex_2_p', label: 'Entry 2 Text', type: 'textarea' },
          { key: 'codex_3_h', label: 'Entry 3 Title', type: 'text' },
          { key: 'codex_3_p', label: 'Entry 3 Text', type: 'textarea' },
          { key: 'codex_4_h', label: 'Entry 4 Title', type: 'text' },
          { key: 'codex_4_p', label: 'Entry 4 Text', type: 'textarea' },
        ]
      }
    ]
  },
  {
    id: 'page-recipe', label: 'Recipe Details', sections: [
      {
        label: 'Layout Text', fields: [
          { key: 'recipe_header_h1', label: 'Header Mini Title', type: 'text' },
          { key: 'recipe_ingredients_h2', label: 'Ingredients Headline', type: 'text' },
          { key: 'recipe_back_btn', label: 'Back Button Text', type: 'text' },
        ]
      }
    ]
  },
  {
    id: 'page-faq', label: 'FAQ Page', sections: [
      {
        label: 'Header & Intro', fields: [
          { key: 'faq_h1', label: 'FAQ Headline', type: 'text' },
          { key: 'faq_p', label: 'FAQ Subtext', type: 'textarea' },
        ]
      }
    ]
  }
];

async function loadContentEditor() {
  if (!moduleContent || moduleContent.classList.contains('hidden')) return;
  setState('Syncing...', 'success');
  try {
    const content = await apiRequest('/api/content');
    renderContentEditor(content);
    setState('');
  } catch (err) { setState('Fail'); }
}

function renderContentEditor(data) {
  const activePage = CONTENT_DEFINITION.find(p => p.id === currentContentSubTab) || CONTENT_DEFINITION[0];
  const subtabsHtml = CONTENT_DEFINITION.map(page => `<button class="admin-tab-mini ${currentContentSubTab === page.id ? 'active' : ''}" data-subtab="${page.id}">${page.label}</button>`).join('');
  const fieldsHtml = activePage.sections.map(section => `
        <div class="content-section-card">
            <h4 style="margin-bottom: 1.5rem; opacity: 0.5; font-size: 0.7rem; text-transform: uppercase;">${section.label}</h4>
            <div style="display: grid; gap: 1.5rem;">
                ${section.fields.map(f => `<label class="admin-field"><span>${f.label}</span>${f.type === 'textarea' ? `<textarea name="${f.key}">${escapeHtml(data[f.key] || '')}</textarea>` : `<input type="text" name="${f.key}" value="${escapeHtml(data[f.key] || '')}">`}</label>`).join('')}
            </div>
        </div>
    `).join('');

  contentForm.innerHTML = `<nav class="admin-tabs-mini">${subtabsHtml}</nav><div style="display: grid; gap: 2rem;">${fieldsHtml}</div>${currentContentSubTab === 'page-faq' ? '<div id="faq-items-manager"></div>' : ''}`;
  if (currentContentSubTab === 'page-faq') renderFaqItemList();
  contentForm.querySelectorAll('[data-subtab]').forEach(btn => btn.addEventListener('click', () => { currentContentSubTab = btn.dataset.subtab; renderContentEditor(data); }));
}

saveContentBtn?.addEventListener('click', async () => {
  saveContentBtn.disabled = true; saveContentBtn.textContent = 'Syncing...';
  const updates = {};
  contentForm.querySelectorAll('input[name], textarea[name]').forEach(el => updates[el.name] = el.value);
  try {
    await apiRequest('/api/admin-cms', { method: 'POST', body: JSON.stringify({ updates }) });
    setState('Narratives synced', 'success');
    loadContentEditor();
  } catch (err) { setState('Sync fail'); } finally { saveContentBtn.disabled = false; saveContentBtn.textContent = 'Save All Changes'; }
});

// Init
loadOrders();

// ═══════════════════════════════════════════════════════════════════════════
// USERS MODULE
// ═══════════════════════════════════════════════════════════════════════════

let cachedUsers = [];

async function loadUsers() {
  if (!moduleUsers || moduleUsers.classList.contains('hidden')) return;
  try {
    const params = new URLSearchParams();
    const search = usersSearchInput?.value || '';
    const role = usersRoleFilterInput?.value || 'all';
    const status = usersStatusFilterInput?.value || 'all';
    const sort = usersSortFilterInput?.value || 'created_at:desc';
    const date = usersDateFilterInput?.value || 'all';

    if (search) params.set('search', search);
    if (role !== 'all') params.set('role', role);
    if (status !== 'all') params.set('status', status);
    if (sort) params.set('sort', sort);
    if (date !== 'all') params.set('dateFilter', date);

    const data = await apiRequest(`/api/admin-users?${params.toString()}`);
    cachedUsers = data.users || [];
    renderUsers(cachedUsers);
  } catch (err) { setState(err.message || 'Failed to load users'); }
}

function renderUsers(users) {
  const userList = document.getElementById('admin-user-list');
  if (!userList) return;
  if (!users.length) {
    userList.innerHTML = '<div class="admin-card" style="text-align:center;padding:3rem;opacity:0.5">No users found.</div>';
    return;
  }
  const roleColors = {
    ashu:  { bg: 'rgba(139,94,42,0.1)',  text: '#7a4f1a', label: 'Ashu' },
    staff: { bg: 'rgba(52,100,180,0.08)', text: '#2d5fa0', label: 'Staff' },
    user:  { bg: 'rgba(0,0,0,0.04)',      text: '#6b5a50', label: 'User' },
  };
  
  userList.innerHTML = users.map(u => {
    const rc = roleColors[u.role] || roleColors.user;
    return `
    <div class="admin-table-row" style="grid-template-columns:2fr 2fr 1fr 1fr 120px" data-user-id="${escapeHtml(u.id)}">
      <div style="display:flex;align-items:center;gap:0.5rem">
        <div style="width:28px;height:28px;border-radius:50%;background:#3d2518;color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:600">
          ${escapeHtml((u.name||'?')[0]).toUpperCase()}
        </div>
        <div style="font-weight:500;color:#2d1a12">${escapeHtml(u.name)}</div>
      </div>
      <div style="color:#7a6a60;font-size:0.82rem">${escapeHtml(u.email)}</div>
      <div>
        <span style="font-size:0.65rem;font-weight:700;text-transform:uppercase;padding:2px 8px;border-radius:4px;background:${rc.bg};color:${rc.text}">${rc.label}</span>
      </div>
      <div style="color:#9a8678;font-size:0.8rem">${new Date(u.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</div>
      <div style="display:flex;gap:0.4rem">
        <button class="user-edit-btn" data-id="${escapeHtml(u.id)}" title="Edit" style="border:none;background:none;padding:2px;cursor:pointer">✏️</button>
        <button class="user-toggle-btn" data-id="${escapeHtml(u.id)}" data-active="${u.is_active}" title="${u.is_active ? 'Deactivate' : 'Activate'}" style="border:none;background:none;padding:2px;cursor:pointer">${u.is_active ? '🔓' : '🔒'}</button>
        <button class="user-delete-btn" data-id="${escapeHtml(u.id)}" title="Delete" style="border:none;background:none;padding:2px;cursor:pointer">🗑️</button>
      </div>
    </div>
  `}).join('');

  userList.querySelectorAll('.user-edit-btn').forEach(btn => btn.addEventListener('click', () => openUserForm(btn.dataset.id)));
  userList.querySelectorAll('.user-toggle-btn').forEach(btn => btn.addEventListener('click', async () => {
    const active = btn.dataset.active === 'true';
    await apiRequest(`/api/admin-users?id=${btn.dataset.id}`, { method: 'PATCH', body: JSON.stringify({ isActive: !active }) });
    loadUsers();
    setState(!active ? 'User activated' : 'User deactivated', 'success');
  }));
  userList.querySelectorAll('.user-delete-btn').forEach(btn => btn.addEventListener('click', async () => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    await apiRequest(`/api/admin-users?id=${btn.dataset.id}`, { method: 'DELETE' });
    loadUsers();
    setState('User deleted');
  }));
}

function openUserForm(editId = null) {
  const card = document.getElementById('user-form-card');
  const title = document.getElementById('user-form-title');
  const pwField = document.getElementById('user-form-pw-field');
  card.classList.remove('hidden');
  card.scrollIntoView({ behavior: 'smooth' });

  if (editId) {
    const u = cachedUsers.find(u => u.id === editId);
    title.textContent = 'Edit User';
    document.getElementById('user-edit-id').value = editId;
    document.getElementById('user-form-name').value = u?.name || '';
    document.getElementById('user-form-email').value = u?.email || '';
    document.getElementById('user-form-email').disabled = true;
    document.getElementById('user-form-role').value = u?.role || 'user';
    document.getElementById('user-form-password').value = '';
    if (pwField) pwField.querySelector('span').textContent = 'New Password (leave blank to keep)';
  } else {
    title.textContent = 'Add New User';
    document.getElementById('user-edit-id').value = '';
    document.getElementById('user-form-name').value = '';
    document.getElementById('user-form-email').value = '';
    document.getElementById('user-form-email').disabled = false;
    document.getElementById('user-form-role').value = 'user';
    document.getElementById('user-form-password').value = '';
    if (pwField) pwField.querySelector('span').textContent = 'Password';
  }
}

document.getElementById('admin-add-user')?.addEventListener('click', () => openUserForm());
document.getElementById('user-form-cancel')?.addEventListener('click', () => {
  document.getElementById('user-form-card')?.classList.add('hidden');
  document.getElementById('user-form')?.reset();
});

document.getElementById('user-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const editId = document.getElementById('user-edit-id').value;
  const name = document.getElementById('user-form-name').value.trim();
  const email = document.getElementById('user-form-email').value.trim();
  const password = document.getElementById('user-form-password').value;
  const role = document.getElementById('user-form-role').value;
  const btn = document.getElementById('user-form-submit');

  btn.disabled = true; btn.textContent = 'Saving...';

  try {
    if (editId) {
      const body = { role };
      if (password) body.password = password;
      await apiRequest(`/api/admin-users?id=${editId}`, { method: 'PATCH', body: JSON.stringify(body) });
      setState('User updated', 'success');
    } else {
      if (!password) { setState('Password is required for new users'); btn.disabled = false; btn.textContent = 'Save User'; return; }
      await apiRequest('/api/admin-users', { method: 'POST', body: JSON.stringify({ name, email, password, role }) });
      setState('User created', 'success');
    }
    document.getElementById('user-form-card').classList.add('hidden');
    loadUsers();
  } catch (err) {
    setState(err.message || 'Save failed');
  } finally { btn.disabled = false; btn.textContent = 'Save User'; }
});

// (Listeners moved to top)

// ═══════════════════════════════════════════════════════════════════════════
// PERMISSIONS MODULE
// ═══════════════════════════════════════════════════════════════════════════

let permSchema = null;
let selectedPermUserId = null;
let selectedPermUserOverrides = {};

async function loadPermissionsModule() {
  try {
    // Load schema
    const data = await apiRequest('/api/admin-permissions');
    permSchema = data;

    // Load staff users for the select dropdown
    const staffData = await apiRequest('/api/admin-users?role=staff');
    const staffUsers = (staffData.users || []).filter(u => u.role === 'staff');

    const select = document.getElementById('perm-user-select');
    if (select) {
      select.innerHTML = '<option value="">— choose a staff user —</option>' +
        staffUsers.map(u => `<option value="${escapeHtml(u.id)}">${escapeHtml(u.name)} (${escapeHtml(u.email)})</option>`).join('');
    }
  } catch (err) { setState(err.message || 'Failed to load permissions'); }
}

document.getElementById('perm-load-btn')?.addEventListener('click', async () => {
  const userId = document.getElementById('perm-user-select')?.value;
  if (!userId) { setState('Please select a staff user first'); return; }

  selectedPermUserId = userId;
  const userData = await apiRequest(`/api/admin-users?search=${userId}`);
  const user = (userData.users || []).find(u => u.id === userId);
  selectedPermUserOverrides = {};
  try { selectedPermUserOverrides = JSON.parse(user?.permission_overrides || '{}'); } catch {}

  renderPermissionsMatrix();
});

function renderPermissionsMatrix() {
  if (!permSchema) return;
  const { permissions, roleDefaults } = permSchema;
  const staffDefaults = new Set(roleDefaults.staff || []);
  const matrix = document.getElementById('permissions-matrix');
  if (!matrix) return;

  const categoryFilter = permCategoryFilterInput?.value || 'all';
  const searchTerm = (permSearchInput?.value || '').toLowerCase();

  // Group by category with filtering
  const byCategory = {};
  permissions.forEach(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return;
    if (searchTerm && !p.label.toLowerCase().includes(searchTerm) && !p.key.toLowerCase().includes(searchTerm)) return;

    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  });

  matrix.innerHTML = Object.entries(byCategory).map(([cat, perms]) => `
    <div style="margin-bottom:2rem">
      <p class="admin-kicker" style="margin-bottom:0.75rem;font-size:0.65rem;letter-spacing:0.1em;color:#9a8678">${escapeHtml(cat)}</p>
      <div style="display:grid;gap:0.4rem">
        ${perms.map(p => {
          const defaultGranted = staffDefaults.has(p.key);
          const override = selectedPermUserOverrides[p.key];
          const effective = override !== undefined ? override : defaultGranted;
          return `
            <label style="display:flex;align-items:center;gap:0.85rem;padding:0.7rem 1rem;background:${effective ? 'rgba(74,44,26,0.05)' : '#fff'};border:1px solid rgba(74,44,26,0.1);border-radius:8px;cursor:pointer;font-size:0.85rem;color:#3d2518;transition:all 0.15s">
              <input type="checkbox" class="perm-checkbox" data-key="${p.key}" ${effective ? 'checked' : ''} style="accent-color:#3d2518;width:16px;height:16px;flex-shrink:0">
              <span style="flex:1;color:#2d1a12;font-weight:${effective ? '600' : '400'}">${escapeHtml(p.label)}</span>
              ${override !== undefined
                ? `<span style="font-size:0.65rem;font-weight:600;padding:2px 9px;border-radius:10px;background:rgba(139,94,42,0.12);color:#8b5e2a;border:1px solid rgba(139,94,42,0.2);letter-spacing:0.04em">OVERRIDDEN</span>`
                : defaultGranted
                  ? `<span style="font-size:0.65rem;font-weight:600;padding:2px 9px;border-radius:10px;background:rgba(44,120,74,0.1);color:#2c784a;border:1px solid rgba(44,120,74,0.2);letter-spacing:0.04em">DEFAULT</span>`
                  : `<span style="font-size:0.65rem;font-weight:600;padding:2px 9px;border-radius:10px;background:rgba(0,0,0,0.05);color:#9a8678;border:1px solid rgba(0,0,0,0.08);letter-spacing:0.04em">DENIED</span>`
              }
            </label>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');

  if (Object.keys(byCategory).length === 0) {
    matrix.innerHTML = '<div style="text-align:center;padding:3rem;color:#9a8678;font-size:0.85rem">No permissions found matching filters.</div>';
  }

  matrix.querySelectorAll('.perm-checkbox').forEach(cb => cb.addEventListener('change', () => {
    document.getElementById('perm-save-row')?.classList.remove('hidden');
  }));
}

permCategoryFilterInput?.addEventListener('change', renderPermissionsMatrix);
permSearchInput?.addEventListener('input', renderPermissionsMatrix);

document.getElementById('perm-save-btn')?.addEventListener('click', async () => {
  if (!selectedPermUserId || !permSchema) return;
  const { permissions, roleDefaults } = permSchema;
  const staffDefaults = new Set(roleDefaults.staff || []);
  const overrides = {};

  document.querySelectorAll('.perm-checkbox').forEach(cb => {
    const key = cb.dataset.key;
    const checked = cb.checked;
    const defaultVal = staffDefaults.has(key);
    // Only store overrides that differ from the role default
    if (checked !== defaultVal) overrides[key] = checked;
  });

  try {
    await apiRequest('/api/admin-permissions', {
      method: 'PATCH',
      body: JSON.stringify({ userId: selectedPermUserId, permissionOverrides: overrides })
    });
    setState('Permissions saved successfully', 'success');
    selectedPermUserOverrides = overrides;
    renderPermissionsMatrix();
  } catch (err) { setState(err.message || 'Save failed'); }
});
