const stateEl = document.getElementById('admin-state');
const orderList = document.getElementById('admin-order-list');
const productList = document.getElementById('admin-product-list');
const contentForm = document.getElementById('admin-content-form');
const saveContentBtn = document.getElementById('admin-save-content');
const addProductBtn = document.getElementById('admin-add-product');
const refreshBtn = document.getElementById('admin-refresh');
const searchInput = document.getElementById('admin-search');

const loginPanel = document.getElementById('admin-login-panel');
const dashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('admin-login-form');
const passwordInput = document.getElementById('admin-password');
const logoutBtn = document.getElementById('admin-logout');

const moduleOrders = document.getElementById('module-orders');
const moduleProducts = document.getElementById('module-products');
const moduleContent = document.getElementById('module-content');

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
        await apiRequest('/api/admin-login', {
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
        await apiRequest('/api/admin-logout', { method: 'POST' });
        showLogin();
    } catch (err) { setState('Logout failed'); }
});

refreshBtn?.addEventListener('click', () => {
    if (!moduleOrders.classList.contains('hidden')) loadOrders();
    if (!moduleProducts.classList.contains('hidden')) loadProducts();
});

function applyFilters() {
    const term = (searchInput?.value || '').toLowerCase();
    
    if (!moduleOrders.classList.contains('hidden')) {
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

document.querySelectorAll('#admin-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('#admin-tabs button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        orderFilter = btn.dataset.status;
        applyFilters();
    });
});

// Global Module Switching
function switchModule(moduleName) {
    document.querySelectorAll('[data-module]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.module === moduleName);
    });

    moduleOrders?.classList.toggle('hidden', moduleName !== 'orders');
    moduleProducts?.classList.toggle('hidden', moduleName !== 'products');
    moduleContent?.classList.toggle('hidden', moduleName !== 'content');

    if (moduleName === 'orders') loadOrders();
    if (moduleName === 'products') loadProducts();
    if (moduleName === 'content') loadContentEditor();
}

document.querySelectorAll('[data-module]').forEach(btn => {
    btn.addEventListener('click', () => switchModule(btn.dataset.module));
});

// Order Logic
async function loadOrders() {
    if (!moduleOrders || moduleOrders.classList.contains('hidden')) return;
    setState('Syncing...', 'success');
    try {
        const data = await apiRequest('/api/admin-orders');
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

    const stats = {
        total: orders.length,
        new: orders.filter(o => o.status === 'new').length,
        waitlist: orders.filter(o => o.paymentStatus === 'waitlist').length,
        paid: orders.filter(o => o.paymentStatus === 'paid').length,
        delivered: orders.filter(o => o.status === 'delivered').length
    };

    statsContainer.innerHTML = `
        <div class="admin-stat">
            <strong>${stats.new}</strong>
            <span>Active/New</span>
        </div>
        <div class="admin-stat">
            <strong>${stats.paid}</strong>
            <span>Paid Cases</span>
        </div>
        <div class="admin-stat">
            <strong>${stats.waitlist}</strong>
            <span>Waitlist</span>
        </div>
        <div class="admin-stat">
            <strong>${stats.delivered}</strong>
            <span>Delivered</span>
        </div>
        <div class="admin-stat">
            <strong>${stats.total}</strong>
            <span>Total Log</span>
        </div>
    `;
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
                        <p style="font-size: 1.05rem;"><strong style="color: var(--gold); font-weight: 600;">Contact:</strong> ${ord.customerPhone}</p>
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
                        ${(ord.items || []).map(it => `
                            <div class="admin-order-line">
                                <div>
                                    <strong style="color: var(--choc-dark); font-weight: 600;">${it.name}</strong>
                                    <small style="display: block; font-size: 0.75rem; opacity: 0.5;">${it.quantity} Unit${it.quantity > 1 ? 's' : ''}</small>
                                </div>
                                <span style="font-weight: 600; color: var(--gold);">₹${it.price * it.quantity}</span>
                            </div>
                        `).join('') || '<p style="opacity: 0.3; font-style: italic; padding: 2rem; text-align: center;">No catalog items found</p>'}
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
                    <p style="font-size: 0.75rem; color: var(--text-light); opacity: 0.6;">State change triggers automated logistics notifications</p>
                </div>
                <div>
                     ${ord.paymentStatus === 'waitlist' ? `<button class="admin-primary-btn" onclick="copyPaymentLink('${ord.id}')">Payment Link</button>` : ''}
                </div>
            </div>
        </article>
    `).join('');
}

window.updateOrderStatus = async (id, status) => {
    try {
        await apiRequest('/api/admin-order-update', { method: 'PATCH', body: JSON.stringify({ id, status }) });
        loadOrders();
        setState('Status updated', 'success');
    } catch (err) { setState('Update failed'); }
}

// Product Logic
async function loadProducts() {
    if (!moduleProducts || moduleProducts.classList.contains('hidden')) return;
    setState('Catalog loading...', 'success');
    try {
        const products = await apiRequest('/api/admin-products');
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

    productList.innerHTML = products.map(p => `
        <article class="admin-card" data-product-id="${escapeHtml(p.id)}" style="margin-bottom: 2rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;">
                <div>
                   <label class="admin-field">
                        <span>Product Name</span>
                        <input type="text" class="prod-name" value="${escapeHtml(p.name)}">
                   </label>
                   <label class="admin-field">
                        <span>Description</span>
                        <textarea class="prod-desc" style="min-height: 80px;">${escapeHtml(p.description)}</textarea>
                   </label>
                   <label class="admin-field">
                        <span>Ingredients</span>
                        <textarea class="prod-ingredients" style="min-height: 60px; font-size: 0.8rem;">${escapeHtml(p.ingredients || '')}</textarea>
                   </label>
                </div>
                <div>
                   <div style="display: flex; gap: 1rem;">
                        <label class="admin-field" style="flex: 1;">
                             <span>Price (₹)</span>
                             <input type="number" class="prod-price" value="${p.price}">
                        </label>
                        <label class="admin-field" style="flex: 1;">
                             <span>Image Slug</span>
                             <input type="text" class="prod-image" value="${escapeHtml(p.image_slug || 'chocolate_bar.png')}">
                        </label>
                   </div>
                   <label class="admin-field">
                        <span>Flavor Kicker</span>
                        <input type="text" class="prod-flavor" value="${escapeHtml(p.flavor_note || '')}">
                   </label>
                   <div style="display: flex; gap: 1rem; align-items: flex-end;">
                        <label class="admin-field" style="flex: 1;">
                             <span>Visibility</span>
                             <select class="prod-active" style="border-color: ${p.is_active ? '#2d6e4b' : '#999'}">
                                 <option value="true" ${p.is_active ? 'selected' : ''}>Active</option>
                                 <option value="false" ${!p.is_active ? 'selected' : ''}>Hidden</option>
                             </select>
                        </label>
                        <div style="display: flex; gap: 0.5rem; padding-bottom: 0.5rem;">
                             <button class="admin-primary-btn prod-save">Save</button>
                             <button class="admin-ghost-btn prod-delete" style="color: #9d3030;">✕</button>
                        </div>
                   </div>
                </div>
            </div>
        </article>
    `).join('');
}

productList?.addEventListener('click', async (e) => {
    const card = e.target.closest('[data-product-id]');
    if (!card) return;
    const id = card.dataset.productId;

    if (e.target.classList.contains('prod-save')) {
        const btn = e.target;
        btn.disabled = true; btn.textContent = 'Saving...';
        try {
            await apiRequest('/api/admin-products', { method: 'POST', body: JSON.stringify({
                id,
                name: card.querySelector('.prod-name').value,
                description: card.querySelector('.prod-desc').value,
                ingredients: card.querySelector('.prod-ingredients').value,
                price: parseInt(card.querySelector('.prod-price').value),
                image_slug: card.querySelector('.prod-image').value,
                flavor_note: card.querySelector('.prod-flavor').value,
                is_active: card.querySelector('.prod-active').value === 'true'
            })});
            setState('Catalog synced', 'success');
            loadProducts();
        } catch (err) { setState(err.message || 'Sync failed'); } finally { btn.disabled = false; btn.textContent = 'Save'; }
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
    const id = 'p' + Date.now();
    try {
        await apiRequest('/api/admin-products', { method: 'POST', body: JSON.stringify({ id, name: 'New Artisanal Bar', description: 'Description...', ingredients: '...', price: 450, image_slug: 'chocolate_bar.png', flavor_note: 'Notes', is_active: true }) });
        loadProducts();
        setState('Added', 'success');
    } catch (err) { setState('Fail'); }
});

// FAQ Logic
async function renderFaqItemList() {
    const listContainer = document.getElementById('faq-items-manager');
    if (!listContainer) return;
    try {
        const faqs = await apiRequest('/api/admin-faq');
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
            await apiRequest('/api/admin-faq', { method: 'POST', body: JSON.stringify({ category: 'General', question: 'New?', answer: '...', is_active: true, sort_order: 10, id: 't' + Date.now() }) });
            renderFaqItemList();
        });
        listContainer.querySelectorAll('.save-faq-inline').forEach(btn => btn.addEventListener('click', async (e) => {
            const card = e.target.closest('.faq-card-inline');
            await apiRequest('/api/admin-faq', { method: 'POST', body: JSON.stringify({ id: card.dataset.id, question: card.querySelector('.fi-q').value, category: card.querySelector('.fi-cat').value, answer: card.querySelector('.fi-a').value, sort_order: parseInt(card.querySelector('.fi-sort').value), is_active: true }) });
            setState('Saved', 'success');
            renderFaqItemList();
        }));
        listContainer.querySelectorAll('.delete-faq-inline').forEach(btn => btn.addEventListener('click', async (e) => {
            if (confirm('Delete?')) { await apiRequest(`/api/admin-faq?id=${e.target.closest('.faq-card-inline').dataset.id}`, { method: 'DELETE' }); renderFaqItemList(); }
        }));
    } catch (e) {}
}

const CONTENT_DEFINITION = [
  { id: 'page-home', label: 'Home Page', sections: [
    { label: 'Hero Section', fields: [
        { key: 'home_h1', label: 'Main Headline', type: 'textarea' },
        { key: 'home_p', label: 'Sub-headline', type: 'textarea' },
        { key: 'home_cta', label: 'CTA Button Text', type: 'text' },
    ]},
    { label: 'Origin Section', fields: [
        { key: 'home_origin_h', label: 'Origin Title', type: 'text' },
        { key: 'home_origin_p', label: 'Origin Story', type: 'textarea' },
    ]},
    { label: 'Our Story', fields: [
        { key: 'home_story_h', label: 'Story Title', type: 'text' },
        { key: 'home_story_p', label: 'Main Narrative', type: 'textarea' },
        { key: 'home_story_quote', label: 'Featured Quote', type: 'textarea' },
    ]},
    { label: 'The Craft', fields: [
        { key: 'home_craft_h', label: 'Craft Title', type: 'text' },
        { key: 'home_craft_p', label: 'Craft Description', type: 'textarea' },
    ]},
    { label: 'Waitlist', fields: [
        { key: 'home_waitlist_h', label: 'Waitlist Title', type: 'text' },
        { key: 'home_waitlist_p', label: 'Instruction Text', type: 'textarea' },
    ]},
    { label: 'Promises', fields: [
        { key: 'promises_h2', label: 'Section Title', type: 'text' },
        { key: 'promise_1_h', label: 'Promise 1 Title', type: 'text' },
        { key: 'promise_1_p', label: 'Promise 1 Desc', type: 'textarea' },
        { key: 'promise_2_h', label: 'Promise 2 Title', type: 'text' },
        { key: 'promise_2_p', label: 'Promise 2 Desc', type: 'textarea' },
        { key: 'promise_3_h', label: 'Promise 3 Title', type: 'text' },
        { key: 'promise_3_p', label: 'Promise 3 Desc', type: 'textarea' },
        { key: 'promise_4_h', label: 'Promise 4 Title', type: 'text' },
        { key: 'promise_4_p', label: 'Promise 4 Desc', type: 'textarea' },
    ]},
    { label: 'Footer Global', fields: [
        { key: 'site_title', label: 'Brand Name', type: 'text' },
        { key: 'footer_desc', label: 'Footer About', type: 'textarea' },
        { key: 'footer_col2_title', label: 'Col 2 Title', type: 'text' },
        { key: 'insta_label', label: 'Insta Label', type: 'text' },
        { key: 'footer_copy', label: 'Copyright Text', type: 'text' },
        { key: 'footer_credit', label: 'Credit Text', type: 'text' },
    ]}
  ]},
  { id: 'page-shop', label: 'Shop Page', sections: [
    { label: 'Shop Header', fields: [
        { key: 'shop_h1', label: 'Shop Headline', type: 'text' },
        { key: 'shop_p', label: 'Shop Introduction', type: 'textarea' },
    ]},
    { label: 'Cart UI', fields: [
        { key: 'shop_bag_title', label: 'Cart Heading', type: 'text' },
        { key: 'shop_empty_msg', label: 'Empty Msg', type: 'text' },
        { key: 'shop_checkout_txt', label: 'Checkout Button', type: 'text' },
    ]}
  ]},
  { id: 'page-about', label: 'Our Story', sections: [
    { label: 'About Header', fields: [
        { key: 'about_h1', label: 'Page Title', type: 'textarea' },
        { key: 'about_p', label: 'Manifesto Text', type: 'textarea' },
    ]},
    { label: 'Chapter 1', fields: [
        { key: 'about_chap1_h2', label: 'Chapter Title', type: 'textarea' },
        { key: 'about_chap1_p', label: 'Chapter Text', type: 'textarea' },
        { key: 'about_quote', label: 'Featured Quote', type: 'textarea' },
    ]},
    { label: 'The Raw Spirit', fields: [
        { key: 'about_raw_h2', label: 'Section Title', type: 'textarea' },
        { key: 'about_raw_1_h', label: 'Focus 1 Title', type: 'text' },
        { key: 'about_raw_1_p', label: 'Focus 1 Text', type: 'textarea' },
        { key: 'about_raw_2_h', label: 'Focus 2 Title', type: 'text' },
        { key: 'about_raw_2_p', label: 'Focus 2 Text', type: 'textarea' },
        { key: 'about_raw_3_h', label: 'Focus 3 Title', type: 'text' },
        { key: 'about_raw_3_p', label: 'Focus 3 Text', type: 'textarea' },
    ]},
    { label: 'Philosophy', fields: [
        { key: 'about_philo_h2', label: 'Philosophy Title', type: 'textarea' },
        { key: 'about_philo_p', label: 'Philosophy Text', type: 'textarea' },
    ]},
    { label: 'Impact', fields: [
        { key: 'about_impact_h2', label: 'Impact Title', type: 'textarea' },
        { key: 'about_impact_p', label: 'Impact Text', type: 'textarea' },
    ]}
  ]},
  { id: 'page-inspiration', label: 'Inspiration', sections: [
    { label: 'Editorial Header', fields: [
        { key: 'insp_h1', label: 'Page Headline', type: 'text' },
        { key: 'insp_p', label: 'Introduction Text', type: 'textarea' },
    ]},
    { label: 'Codex Entries', fields: [
        { key: 'codex_1_h', label: 'Entry 1 Title', type: 'text' },
        { key: 'codex_1_p', label: 'Entry 1 Text', type: 'textarea' },
        { key: 'codex_2_h', label: 'Entry 2 Title', type: 'text' },
        { key: 'codex_2_p', label: 'Entry 2 Text', type: 'textarea' },
        { key: 'codex_3_h', label: 'Entry 3 Title', type: 'text' },
        { key: 'codex_3_p', label: 'Entry 3 Text', type: 'textarea' },
        { key: 'codex_4_h', label: 'Entry 4 Title', type: 'text' },
        { key: 'codex_4_p', label: 'Entry 4 Text', type: 'textarea' },
    ]}
  ]},
  { id: 'page-recipe', label: 'Recipe Details', sections: [
    { label: 'Layout Text', fields: [
        { key: 'recipe_header_h1', label: 'Header Mini Title', type: 'text' },
        { key: 'recipe_ingredients_h2', label: 'Ingredients Headline', type: 'text' },
        { key: 'recipe_back_btn', label: 'Back Button Text', type: 'text' },
    ]}
  ]},
  { id: 'page-faq', label: 'FAQ Page', sections: [
    { label: 'Header & Intro', fields: [
        { key: 'faq_h1', label: 'FAQ Headline', type: 'text' },
        { key: 'faq_p', label: 'FAQ Subtext', type: 'textarea' },
    ]}
  ]}
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
        await apiRequest('/api/admin-content', { method: 'POST', body: JSON.stringify({ updates }) });
        setState('Narratives synced', 'success');
        loadContentEditor();
    } catch (err) { setState('Sync fail'); } finally { saveContentBtn.disabled = false; saveContentBtn.textContent = 'Save All Changes'; }
});

// Init
loadOrders();
