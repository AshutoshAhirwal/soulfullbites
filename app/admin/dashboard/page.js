'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ── CONTENT DEFINITION (Restored 1:1) ────────────────────────────────────────
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
    id: 'page-global', label: 'Global & Footer', sections: [
      {
        label: 'Brand Identity', fields: [
          { key: 'site_title', label: 'Brand Name', type: 'text' },
          { key: 'footer_desc', label: 'Footer About', type: 'textarea' },
          { key: 'insta_label', label: 'Instagram Label', type: 'text' },
          { key: 'insta_link', label: 'Instagram URL', type: 'text' },
          { key: 'footer_copy', label: 'Copyright Text', type: 'text' },
        ]
      }
    ]
  }
];

// ── UTILS ───────────────────────────────────────────────────────────────────

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

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

// ── MAIN DASHBOARD COMPONENT ────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeModule, setActiveModule] = useState('orders');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stateMsg, setStateMsg] = useState({ text: '', type: '' });
  const router = useRouter();

  const setState = (text, type = 'error') => {
    setStateMsg({ text, type });
    if (text) setTimeout(() => setStateMsg({ text: '', type: '' }), 5000);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/user-auth');
        const data = await res.json();
        if (!data?.user || (data.user.role !== 'ashu' && data.user.role !== 'staff')) {
          router.push('/admin/login');
          return;
        }
        setUser(data.user);
      } catch (err) {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/user-auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  if (loading) return <div className="admin-login-full">Syncing Console...</div>;

  return (
    <div className="admin-body">
      {/* --- STICKY TOP BAR --- */}
      <header className="admin-topbar">
        <a href="/" className="admin-topbar-brand">
          <img src="/assets/logo.png" alt="logo" />
          SoulfullBites
        </a>
        <div className="admin-topbar-divider"></div>
        <nav className="admin-topbar-nav">
          {[
            { id: 'orders', label: '📦 Orders' },
            { id: 'products', label: '🍫 Products' },
            { id: 'content', label: '📝 Site Content' },
            { id: 'users', label: '👥 Users' },
            { id: 'permissions', label: '🔐 Roles' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveModule(tab.id)}
              className={`admin-topbar-tab ${activeModule === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="admin-topbar-right">
          {stateMsg.text && <div className={`admin-state ${stateMsg.type}`} style={{ fontSize: '0.78rem' }}>{stateMsg.text}</div>}
          <button onClick={() => window.location.reload()} className="admin-secondary-btn" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>↻ Refresh</button>
          <button onClick={handleLogout} className="admin-ghost-btn" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>Logout</button>
        </div>
      </header>

      {/* --- MODULE PAGE --- */}
      <main className="admin-page">
        {activeModule === 'orders' && <OrdersModule setState={setState} />}
        {activeModule === 'products' && <ProductsModule setState={setState} />}
        {activeModule === 'content' && <ContentModule setState={setState} />}
        {activeModule === 'users' && <UsersModule setState={setState} />}
        {activeModule === 'permissions' && <PermissionsModule setState={setState} />}
      </main>
    </div>
  );
}

// ── ORDERS MODULE (Restored Full Features) ──────────────────────────────────
function OrdersModule({ setState }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sort, setSort] = useState('created_at:desc');
  const [dateFilter, setDateFilter] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ paymentStatus: paymentFilter, sort, dateFilter });
      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) { setState('Fetch failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [paymentFilter, sort, dateFilter]);

  const filteredOrders = orders.filter(o => {
    const term = search.toLowerCase();
    const matchesSearch = !term || o.customerName.toLowerCase().includes(term) || o.customerEmail.toLowerCase().includes(term) || o.id.includes(term);
    const matchesTab = filter === 'all' || (filter === 'paid' ? o.paymentStatus === 'paid' : filter === 'waitlist' ? o.paymentStatus === 'waitlist' : o.status === filter);
    return matchesSearch && matchesTab;
  });

  const exportCsv = () => {
    if (orders.length === 0) return setState('No data to export');
    const headers = ['ID', 'Customer', 'Email', 'Phone', 'Address', 'Amount', 'Status', 'Payment', 'Items'];
    const rows = orders.map(o => [o.id, o.customerName, o.customerEmail, o.customerPhone, o.customerAddress, o.totalAmount, o.status, o.paymentStatus, (o.items || []).map(i => `${i.name}(${i.qty})`).join('; ')]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${(c || '').toString().replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `soulfullbites_orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setState('Exported ✓', 'success');
  };

  return (
    <div id="module-orders">
      <div className="admin-module-header">
        <div className="admin-module-title">Live Orders</div>
        <button onClick={exportCsv} className="admin-secondary-btn" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>⬇ Export CSV</button>
      </div>

      <div className="admin-chip-row">
        {['all', 'new', 'paid', 'waitlist', 'delivered'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`admin-chip ${filter === s ? 'active' : ''}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>

      <div className="admin-stats-mini">
        {[
          { label: 'Active/New', val: orders.filter(o => o.status === 'new').length },
          { label: 'Paid Cases', val: orders.filter(o => o.paymentStatus === 'paid').length },
          { label: 'Waitlist', val: orders.filter(o => o.paymentStatus === 'waitlist').length },
          { label: 'Total Log', val: orders.length }
        ].map(s => (
          <div key={s.label} className="admin-stat-chip"><strong>{s.val}</strong><span>{s.label}</span></div>
        ))}
      </div>

      <div className="admin-filterbar">
        <input type="search" placeholder="Search customer, email, order ID…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="admin-filterbar-sep"></div>
        <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
          <option value="all">All Payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="created_at:desc">Newest First</option>
          <option value="total_amount:desc">Highest Value</option>
        </select>
      </div>

      <div className="admin-orders">
        {loading ? <p style={{ textAlign: 'center', padding: '4rem' }}>Syncing Ledger...</p> : filteredOrders.map(ord => (
          <article key={ord.id} className="admin-card admin-order-card" style={{ marginBottom: '2rem' }}>
            <div className="admin-order-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <div>
                <p className="admin-order-id">Registry #{ord.id}</p>
                <h3 style={{ marginTop: '0.2rem', fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 300 }}>{ord.customerName}</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <div className={`admin-badge ${ord.status}`}>{ord.status}</div>
                <div className={`admin-badge ${ord.paymentStatus}`}>{ord.paymentStatus}</div>
              </div>
            </div>

            <div className="card-split-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
              <div className="admin-order-panel">
                <p className="admin-kicker" style={{ fontSize: '0.65rem', marginBottom: '1rem' }}>Customer Profile</p>
                <div className="admin-order-meta" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <p><strong style={{ color: '#c9993a' }}>Email:</strong> {ord.customerEmail}</p>
                  <p><strong style={{ color: '#c9993a' }}>Contact:</strong> {ord.customerPhone}</p>
                  <p><strong style={{ color: '#c9993a' }}>Location:</strong> {ord.customerAddress}</p>
                </div>
                <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(74, 44, 26, 0.08)' }}>
                  <p className="admin-kicker" style={{ fontSize: '0.65rem' }}>Ledger Total</p>
                  <p style={{ fontSize: '2rem', color: '#3d2518', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>₹{ord.totalAmount}</p>
                </div>
              </div>
              <div className="admin-order-content-inner" style={{ background: 'rgba(139, 94, 60, 0.04)', borderRadius: '1.5rem', padding: '1.5rem' }}>
                <p className="admin-kicker" style={{ fontSize: '0.65rem', opacity: 0.6 }}>Order Selection</p>
                <div className="admin-order-lines">
                  {(ord.items || []).map((it, idx) => (
                    <div key={idx} className="admin-order-line" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: '1rem', background: '#fffcf8', marginBottom: '0.5rem' }}>
                      <div><strong>{it.name}</strong><small style={{ display: 'block', fontSize: '0.75rem', opacity: 0.5 }}>{it.qty} Unit(s)</small></div>
                      <span style={{ fontWeight: 600, color: '#c9993a' }}>₹{it.price * it.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="admin-order-actions" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(74, 44, 26, 0.05)', display: 'flex', justifyContent: 'space-between' }}>
              <select className="admin-select" value={ord.status} onChange={async (e) => {
                await fetch('/api/admin/orders', { method: 'PATCH', body: JSON.stringify({ id: ord.id, status: e.target.value }) });
                fetchOrders();
                setState('Status updated', 'success');
              }} style={{ width: '220px', fontWeight: 600 }}>
                {['new', 'confirmed', 'preparing', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <p style={{ fontSize: '0.75rem', color: '#9a8678', opacity: 0.6 }}>Update order state here as the kitchen flow progresses.</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ── PRODUCTS MODULE (Full Editor & Upload) ──────────────────────────────────
function ProductsModule({ setState }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) { setState('Catalog failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleUpload = async (product, file) => {
    if (!file) return;
    setState('Optimizing...', 'success');
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const optimized = await compressImage(e.target.result);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64: optimized, name: file.name })
        });
        const data = await res.json();
        // Update local state for immediate preview
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, image_slug: data.path } : p));
        setState('Uploaded ✓', 'success');
      };
      reader.readAsDataURL(file);
    } catch (err) { setState('Upload failed'); }
  };

  const handleSave = async (p) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      const data = await res.json();
      if (!res.ok) {
        setState(data.error || 'Save failed');
      } else {
        setState('Synced ✓', 'success');
        fetchProducts();
      }
    } catch (err) { setState('Save failed: ' + err.message); }
  };

  const handleAddProduct = async () => {
    const name = newProductName.trim();
    if (!name) return;
    setAdding(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'p' + Date.now(), name, price: 450, is_active: true, description: 'Enter description...', image_slug: 'chocolate_bar.png' })
      });
      const data = await res.json();
      if (!res.ok) { setState(data.error || 'Could not add product'); }
      else {
        setState('Product added ✓', 'success');
        setShowAddForm(false);
        setNewProductName('');
        fetchProducts();
      }
    } catch (err) { setState('Network error: ' + err.message); }
    finally { setAdding(false); }
  };

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div id="module-products">
      <div className="admin-module-header">
        <div className="admin-module-title">Product Catalog</div>
        <button onClick={() => { setShowAddForm(true); setNewProductName(''); }} className="admin-primary-btn">+ Add Product</button>
      </div>

      {/* Inline Add Product Form */}
      {showAddForm && (
        <div style={{
          background: 'linear-gradient(135deg, #fffcf7, #fff9f0)',
          border: '1.5px solid rgba(201,153,58,0.4)',
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 8px 30px rgba(201,153,58,0.12)'
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.15rem', textTransform: 'uppercase', color: '#c9993a', fontWeight: 700, marginBottom: '0.5rem' }}>New Product Name</p>
            <input
              autoFocus
              type="text"
              value={newProductName}
              onChange={e => setNewProductName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddProduct(); if (e.key === 'Escape') setShowAddForm(false); }}
              placeholder="e.g. Saffron Truffle Box"
              style={{
                width: '100%', padding: '0.8rem 1.2rem',
                border: '1.5px solid rgba(201,153,58,0.3)',
                borderRadius: '0.8rem', fontSize: '1rem',
                fontFamily: "'Outfit', sans-serif",
                outline: 'none', background: '#fff'
              }}
            />
          </div>
          <button
            onClick={handleAddProduct}
            disabled={adding || !newProductName.trim()}
            className="admin-primary-btn"
            style={{ whiteSpace: 'nowrap', opacity: adding || !newProductName.trim() ? 0.5 : 1 }}
          >
            {adding ? 'Adding...' : '✓ Add'}
          </button>
          <button
            onClick={() => setShowAddForm(false)}
            className="admin-ghost-btn"
            style={{ whiteSpace: 'nowrap' }}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="admin-filterbar">
        <input type="search" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div id="admin-product-list">
        {loading ? <p>Loading Catalog...</p> : filtered.map(p => (
          <article key={p.id} className="admin-card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 1fr', gap: '2.5rem' }}>
              <div className="admin-prod-sidebar" style={{ background: 'rgba(74, 44, 26, 0.02)', padding: '1.5rem', borderRadius: '2rem' }}>
                {/* Image Preview */}
                <div style={{ width: '100%', aspectRatio: '1', background: '#fff', borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '1rem', border: '2px solid rgba(201,153,58,0.2)' }}>
                  <img
                    src={p.image_slug ? (p.image_slug.startsWith('/') || p.image_slug.startsWith('http') ? p.image_slug : `/assets/${p.image_slug}`) : '/assets/chocolate_bar.png'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/assets/chocolate_bar.png'; }}
                    alt={p.name}
                  />
                </div>
                {/* Upload Button */}
                <label style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  width: '100%', padding: '0.85rem 1rem',
                  background: 'linear-gradient(135deg, #c9993a, #a07828)',
                  color: '#fff', borderRadius: '2rem', cursor: 'pointer',
                  fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05rem',
                  boxShadow: '0 4px 12px rgba(201,153,58,0.35)',
                  transition: 'all 0.2s ease',
                }}>
                  📁 Upload from Device
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    style={{ display: 'none' }}
                    onChange={e => handleUpload(p, e.target.files[0])}
                  />
                </label>
                <p style={{ fontSize: '0.62rem', opacity: 0.5, textAlign: 'center', marginTop: '0.5rem' }}>JPEG · PNG · WebP supported</p>
              </div>
              <div>
                <p className="admin-kicker" style={{ fontSize: '0.6rem' }}>Primary Data</p>
                <label className="admin-field"><span>Product Name</span><input value={p.name} onChange={e => setProducts(prev => prev.map(item => item.id === p.id ? { ...item, name: e.target.value } : item))} /></label>
                <label className="admin-field"><span>Description</span><textarea style={{ minHeight: '100px' }} value={p.description} onChange={e => setProducts(prev => prev.map(item => item.id === p.id ? { ...item, description: e.target.value } : item))} /></label>
              </div>
              <div>
                <p className="admin-kicker" style={{ fontSize: '0.6rem' }}>Specs & Price</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <label className="admin-field"><span>Price (₹)</span><input type="number" value={p.price} onChange={e => setProducts(prev => prev.map(item => item.id === p.id ? { ...item, price: parseInt(e.target.value) } : item))} /></label>
                  <label className="admin-field"><span>Status</span><select value={p.is_active ? 'true' : 'false'} onChange={e => setProducts(prev => prev.map(item => item.id === p.id ? { ...item, is_active: e.target.value === 'true' } : item))}>
                    <option value="true">Active</option><option value="false">Hidden</option></select></label>
                </div>
                <label className="admin-field"><span>Ingredients</span><textarea value={p.ingredients || ''} onChange={e => setProducts(prev => prev.map(item => item.id === p.id ? { ...item, ingredients: e.target.value } : item))} /></label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button onClick={() => handleSave(p)} className="admin-primary-btn" style={{ flex: 1 }}>Save Changes</button>
                  <button onClick={async () => { if (confirm('Delete?')) { await fetch(`/api/admin/products?id=${p.id}`, { method: 'DELETE' }); fetchProducts(); } }} className="admin-ghost-btn" style={{ color: '#9d3030' }}>✕</button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ── CONTENT MODULE (Full Restoration with FAQs) ──────────────────────────────
function ContentModule({ setState }) {
  const [content, setContent] = useState({});
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('page-home');

  const fetchData = async () => {
    const [cRes, fRes] = await Promise.all([
      fetch('/api/content'),
      fetch('/api/content?section=faq')
    ]);
    const cData = await cRes.json();
    const fData = await fRes.json();
    setContent(cData || {});
    setFaqs(Array.isArray(fData) ? fData : []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const save = async () => {
    setState('Saving...', 'success');
    await fetch('/api/admin/content', { method: 'POST', body: JSON.stringify({ updates: content }) });
    setState('Site updated ✓', 'success');
  };

  const saveFaq = async (faq) => {
    await fetch('/api/admin/faq', { method: 'POST', body: JSON.stringify(faq) });
    setState('FAQ saved', 'success');
    fetchData();
  };

  return (
    <div id="module-content">
      <div className="admin-module-header">
        <div className="admin-module-title">Site Content Manager</div>
        <button onClick={save} className="admin-primary-btn">💾 Save All Changes</button>
      </div>

      <div className="admin-chip-row">
        {CONTENT_DEFINITION.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`admin-chip ${activeTab === tab.id ? 'active' : ''}`}>{tab.label}</button>
        ))}
        <button onClick={() => setActiveTab('faq')} className={`admin-chip ${activeTab === 'faq' ? 'active' : ''}`}>🙋 FAQs</button>
      </div>

      <div className="admin-card" style={{ padding: '2rem' }}>
        {loading ? <p>Loading...</p> : activeTab === 'faq' ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3>Archive Questions</h3>
              <button className="admin-primary-btn" onClick={() => saveFaq({ id: 't' + Date.now(), category: 'General', question: 'New Question?', answer: '...', sort_order: 10 })}>+ Add Question</button>
            </div>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {faqs.map(f => (
                <div key={f.id} className="admin-card" style={{ background: '#fafafa', border: '1px solid #eee' }}>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <label className="admin-field" style={{ flex: 2 }}><span>Question</span><input value={f.question} onChange={e => setFaqs(prev => prev.map(item => item.id === f.id ? { ...item, question: e.target.value } : item))} /></label>
                      <label className="admin-field" style={{ flex: 1 }}><span>Category</span><input value={f.category} onChange={e => setFaqs(prev => prev.map(item => item.id === f.id ? { ...item, category: e.target.value } : item))} /></label>
                    </div>
                    <label className="admin-field"><span>Answer</span><textarea value={f.answer} onChange={e => setFaqs(prev => prev.map(item => item.id === f.id ? { ...item, answer: e.target.value } : item))} /></label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="admin-field" style={{ width: '80px' }}><span>Sort</span><input type="number" value={f.sort_order} onChange={e => setFaqs(prev => prev.map(item => item.id === f.id ? { ...item, sort_order: parseInt(e.target.value) } : item))} /></label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => saveFaq(f)} className="admin-primary-btn" style={{ padding: '0.4rem 1rem' }}>Save</button>
                        <button onClick={async () => { if (confirm('Delete?')) { await fetch(`/api/admin/faq?id=${f.id}`, { method: 'DELETE' }); fetchData(); } }} className="admin-ghost-btn" style={{ color: '#9d3030' }}>✕</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : CONTENT_DEFINITION.find(t => t.id === activeTab).sections.map(sec => (
          <div key={sec.label} style={{ marginBottom: '3rem' }}>
            <h4 style={{ marginBottom: '1.5rem', color: '#c9993a', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>{sec.label}</h4>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {sec.fields.map(f => (
                <label key={f.key} className="admin-field">
                  <span>{f.label}</span>
                  {f.type === 'textarea' ? (
                    <textarea value={content[f.key] || ''} onChange={e => setContent({ ...content, [f.key]: e.target.value })} style={{ minHeight: '80px' }} />
                  ) : (
                    <input value={content[f.key] || ''} onChange={e => setContent({ ...content, [f.key]: e.target.value })} />
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── USERS MODULE (Table Style) ──────────────────────────────────────────────
function UsersModule({ setState }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div id="module-users">
      <div className="admin-module-header">
        <div className="admin-module-title">User Management</div>
        <button className="admin-primary-btn" onClick={async () => {
          const email = prompt('Email?');
          if (email) await fetch('/api/admin/users', { method: 'POST', body: JSON.stringify({ email, name: 'New Staff', password: 'password123', role: 'staff' }) });
          fetchUsers();
        }}>+ Add Staff</button>
      </div>

      <div className="admin-table-header" style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 80px' }}>
        <span>User</span><span>Email</span><span>Role</span><span>Joined</span><span>Action</span>
      </div>
      <div className="admin-table-body">
        {loading ? <p style={{ padding: '2rem' }}>Loading Staff...</p> : users.map(u => (
          <div key={u.id} className="admin-table-row" style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 80px' }}>
            <strong>{u.name}</strong><span>{u.email}</span><span>{u.role}</span><span>{new Date(u.createdAt).toLocaleDateString()}</span>
            <button onClick={async () => { if (confirm('Delete?')) { await fetch(`/api/admin/users?id=${u.id}`, { method: 'DELETE' }); fetchUsers(); } }} style={{ background: 'none', border: 'none', color: '#9d3030', cursor: 'pointer' }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PERMISSIONS MODULE ───────────────────────────────────────────────────────
function PermissionsModule({ setState }) {
  return (
    <div style={{ padding: '4rem', textAlign: 'center', color: '#9a8678', background: '#fff', borderRadius: '2rem' }}>
      <h3>Permissions Matrix</h3>
      <p>The visual matrix is being ported. Permissions are currently managed via the User Management tab overrides.</p>
    </div>
  );
}
