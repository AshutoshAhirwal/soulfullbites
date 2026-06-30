'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import './dashboard.css';

const BAG_STORAGE_KEY = 'choc_bag';

export default function CustomerDashboardPage() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Data states
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);

  // Sidebar mobile toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Status message
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');

  // Order search and filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Address form states
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [addressEditId, setAddressEditId] = useState(null);
  const [addressLabel, setAddressLabel] = useState('Home');
  const [addressZip, setAddressZip] = useState('');
  const [addressText, setAddressText] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressDefault, setAddressDefault] = useState(false);

  // Settings profile form states
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');

  // Settings password form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Form submit loadings
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const timerRef = useRef(null);

  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setMessage(null);
    }, 4000);
  };

  useEffect(() => {
    // 1. Auth check
    const init = async () => {
      try {
        const authRes = await fetch('/api/user-auth');
        const authData = await authRes.json();
        if (!authData?.user) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
          return;
        }

        setUser(authData.user);
        setProfileName(authData.user.name || '');
        setProfilePhone(authData.user.phone || '');

        // 2. Fetch data in parallel
        const [ordersRes, wishlistRes, addressesRes] = await Promise.all([
          fetch('/api/user-orders'),
          fetch('/api/user-wishlist'),
          fetch('/api/user-addresses')
        ]);

        const ordersData = await ordersRes.json();
        const wishlistData = await wishlistRes.json();
        const addressesData = await addressesRes.json();

        setOrders(ordersData?.orders || []);
        setWishlist(wishlistData?.wishlist || []);
        setAddresses(addressesData?.addresses || []);
      } catch (err) {
        console.error('Failed to boot dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleLogout = async () => {
    await fetch('/api/user-auth', { method: 'DELETE' });
    window.location.href = '/login';
  };

  const handleReorder = (order) => {
    if (!order?.items?.length) return;
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem(BAG_STORAGE_KEY)) || [];
    } catch (e) {
      cart = [];
    }

    order.items.forEach(item => {
      const existing = cart.find(c => c.id === item.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + (item.qty ?? item.quantity ?? 1);
      } else {
        cart.push({
          id: item.id,
          name: item.name,
          price: Number(item.price || 0),
          quantity: Math.max(1, Math.floor(Number(item.qty ?? item.quantity ?? 1))),
          image_slug: item.image_slug
        });
      }
    });

    localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(cart));
    showMessage('Items added to your bag! 🛒', 'success');
  };

  const handleRemoveWishlist = async (prodId) => {
    try {
      const res = await fetch(`/api/user-wishlist?productId=${prodId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data?.success) {
        setWishlist(prev => prev.filter(w => w.product_id !== prodId));
        showMessage('Removed from wishlist.', 'info');
      } else {
        throw new Error(data.error || 'Failed to remove');
      }
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const handleAddToBagFromWishlist = (item) => {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem(BAG_STORAGE_KEY)) || [];
    } catch (e) {
      cart = [];
    }

    const existing = cart.find(c => c.id === item.product_id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({
        id: item.product_id,
        name: item.name,
        price: Number(item.price || 0),
        quantity: 1,
        image_slug: item.image_slug
      });
    }

    localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(cart));
    showMessage(`"${item.name}" added to bag! 🛒`, 'success');
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Delete this address?')) return;
    try {
      const res = await fetch(`/api/user-addresses?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data?.success) {
        setAddresses(prev => prev.filter(a => a.id !== id));
        showMessage('Address deleted.', 'info');
      } else {
        throw new Error(data.error || 'Failed to delete address');
      }
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const handleSetDefaultAddress = async (addr) => {
    try {
      const res = await fetch(`/api/user-addresses?id=${addr.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: addr.label,
          address: addr.address,
          city: addr.city,
          zip: addr.zip,
          isDefault: true
        })
      });
      const data = await res.json();
      if (data?.address) {
        // Refresh addresses
        const refresh = await fetch('/api/user-addresses');
        const refreshData = await refresh.json();
        setAddresses(refreshData?.addresses || []);
        showMessage('Default address updated.', 'success');
      } else {
        throw new Error(data.error || 'Failed to update default address');
      }
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const handleOpenAddressForm = (editId = null) => {
    setIsAddressFormOpen(true);
    setAddressEditId(editId);
    if (editId) {
      const addr = addresses.find(a => a.id === editId);
      setAddressLabel(addr?.label || 'Home');
      setAddressZip(addr?.zip || '');
      setAddressText(addr?.address || '');
      setAddressCity(addr?.city || '');
      setAddressDefault(addr?.is_default || false);
    } else {
      setAddressLabel('Home');
      setAddressZip('');
      setAddressText('');
      setAddressCity('');
      setAddressDefault(false);
    }
    // Scroll form into view
    setTimeout(() => {
      document.getElementById('address-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressText.trim()) {
      showMessage('Address is required.', 'error');
      return;
    }

    setIsSavingAddress(true);
    const body = {
      label: addressLabel.trim(),
      address: addressText.trim(),
      city: addressCity.trim(),
      zip: addressZip.trim(),
      isDefault: addressDefault
    };

    try {
      const url = addressEditId ? `/api/user-addresses?id=${addressEditId}` : '/api/user-addresses';
      const method = addressEditId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save address.');
      }

      // Refresh
      const refresh = await fetch('/api/user-addresses');
      const refreshData = await refresh.json();
      setAddresses(refreshData?.addresses || []);

      setIsAddressFormOpen(false);
      showMessage(addressEditId ? 'Address updated!' : 'Address saved!', 'success');
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/user-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileName.trim(),
          phone: profilePhone.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save profile changes');
      }

      setUser(prev => ({ ...prev, name: data.user.name, phone: data.user.phone }));
      showMessage('Profile updated successfully!', 'success');
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage('All password fields are required.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showMessage('New password must be at least 8 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showMessage('New passwords do not match.', 'error');
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await fetch('/api/user-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'password',
          currentPassword,
          newPassword
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showMessage('Password changed successfully!', 'success');
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const switchSection = (name) => {
    setActiveSection(name);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#1a0e0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0e4d4' }}>
        <div style={{ fontSize: '1.25rem', fontFamily: 'serif' }}>Loading Account Details…</div>
      </div>
    );
  }

  // Filter orders
  let filteredOrders = [...orders];
  if (orderStatusFilter !== 'all') {
    filteredOrders = filteredOrders.filter(o => o.status === orderStatusFilter);
  }
  if (orderSearch) {
    const q = orderSearch.toLowerCase();
    filteredOrders = filteredOrders.filter(o =>
      o.id.toLowerCase().includes(q) || o.itemsText?.toLowerCase().includes(q)
    );
  }

  const userInitial = (user?.name || '?')[0].toUpperCase();

  return (
    <>
      <style>{`
        body {
          background: #1a0e0a !important;
          color: #f0e4d4 !important;
        }
      `}</style>

      {/* Sidebar Navigation */}
      <aside className={`dash-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="dash-brand">
          <Link href="/" className="dash-brand-link">
            <span className="dash-brand-mark">✦</span>
            SoulfullBites
          </Link>
        </div>

        <div className="dash-user-card">
          <div className="dash-avatar">{userInitial}</div>
          <div className="dash-user-info">
            <strong>{user?.name}</strong>
            <span className="dash-user-email">{user?.email}</span>
            <span className={`dash-role-badge role-${user?.role || 'user'}`}>
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
            </span>
          </div>
        </div>

        <nav className="dash-nav" role="navigation" aria-label="Dashboard sections">
          <button onClick={() => switchSection('overview')} className={`dash-nav-item ${activeSection === 'overview' ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            Overview
          </button>
          <button onClick={() => switchSection('orders')} className={`dash-nav-item ${activeSection === 'orders' ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            My Orders
            {orders.length > 0 && <span className="dash-nav-badge">{orders.length}</span>}
          </button>
          <button onClick={() => switchSection('wishlist')} className={`dash-nav-item ${activeSection === 'wishlist' ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            Wishlist
            {wishlist.length > 0 && <span className="dash-nav-badge">{wishlist.length}</span>}
          </button>
          <button onClick={() => switchSection('addresses')} className={`dash-nav-item ${activeSection === 'addresses' ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            Saved Addresses
          </button>
          <button onClick={() => switchSection('settings')} className={`dash-nav-item ${activeSection === 'settings' ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
            Settings
          </button>
        </nav>

        <div className="dash-sidebar-footer">
          <Link href="/" className="dash-sidebar-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            Back to Store
          </Link>
          <button onClick={handleLogout} className="dash-sidebar-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="dash-mobile-header">
        <button onClick={() => setIsSidebarOpen(true)} className="dash-mobile-menu" aria-label="Open menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <span className="dash-mobile-title">SoulfullBites</span>
        <div onClick={() => setIsSidebarOpen(true)} className="dash-mobile-avatar">{userInitial}</div>
      </header>

      {/* Main Content */}
      <main className="dash-main">
        {/* Global message banner */}
        {message && (
          <div className={`dash-message ${messageType}`} role="alert" style={{ textAlign: 'left' }}>
            {message}
          </div>
        )}

        {/* SECTION: Overview */}
        {activeSection === 'overview' && (
          <section className="dash-section active" style={{ display: 'block' }}>
            <div className="dash-section-header">
              <div style={{ textAlign: 'left' }}>
                <p className="dash-kicker">Dashboard</p>
                <h1>Welcome back, {user?.name?.split(' ')[0]}!</h1>
              </div>
              <Link href="/shop" className="dash-cta-btn">Shop Now →</Link>
            </div>

            {/* Stats grid */}
            <div className="dash-stats-grid">
              <div className="dash-stat-card">
                <div className="dash-stat-icon">📦</div>
                <div style={{ textAlign: 'left' }}>
                  <div className="dash-stat-value">{orders.length}</div>
                  <div className="dash-stat-label">Total Orders</div>
                </div>
              </div>
              <div className="dash-stat-card">
                <div className="dash-stat-icon">❤️</div>
                <div style={{ textAlign: 'left' }}>
                  <div className="dash-stat-value">{wishlist.length}</div>
                  <div className="dash-stat-label">Wishlist Items</div>
                </div>
              </div>
              <div className="dash-stat-card">
                <div className="dash-stat-icon">🏠</div>
                <div style={{ textAlign: 'left' }}>
                  <div className="dash-stat-value">{addresses.length}</div>
                  <div className="dash-stat-label">Saved Addresses</div>
                </div>
              </div>
              <div className="dash-stat-card">
                <div className="dash-stat-icon">✅</div>
                <div style={{ textAlign: 'left' }}>
                  <div className="dash-stat-value">{orders.filter(o => o.status === 'delivered').length}</div>
                  <div className="dash-stat-label">Delivered</div>
                </div>
              </div>
            </div>

            {/* Recent Orders card */}
            <div className="dash-card" style={{ marginTop: '2rem', textAlign: 'left' }}>
              <div className="dash-card-header">
                <h2>Recent Orders</h2>
                <button onClick={() => setActiveSection('orders')} className="dash-link-btn">View all</button>
              </div>
              <div className="dash-order-list">
                {orders.length === 0 ? (
                  <div className="dash-empty">
                    <div className="dash-empty-icon">📦</div>
                    <h3>No orders yet</h3>
                    <p>Your chocolate journey awaits! <Link href="/shop" style={{ color: 'var(--gold)' }}>Browse the shop →</Link></p>
                  </div>
                ) : (
                  orders.slice(0, 3).map(order => (
                    <div key={order.id} className="dash-order-card">
                      <div>
                        <div className="dash-order-id">{order.id}</div>
                        <div className="dash-order-items">
                          {order.itemsText || order.items?.map(i => `${i.name} ×${i.quantity}`).join(', ') || '—'}
                        </div>
                        <div className="dash-order-meta" style={{ display: 'flex', gap: '1rem' }}>
                          <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span>{order.totalDisplay || `₹${order.totalAmount?.toFixed(2)}`}</span>
                        </div>
                      </div>
                      <div className="dash-order-actions">
                        <span className={`status-badge status-${order.status}`}>{order.status}</span>
                        <button onClick={() => handleReorder(order)} className="dash-icon-btn" title="Reorder">Reorder</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* SECTION: Orders */}
        {activeSection === 'orders' && (
          <section className="dash-section active" style={{ display: 'block', textAlign: 'left' }}>
            <div className="dash-section-header">
              <div>
                <p className="dash-kicker">Order History</p>
                <h1>My Orders</h1>
              </div>
            </div>
            <div className="dash-card">
              <div className="dash-orders-filter" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <input type="search" value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="dash-search" placeholder="Search orders…" style={{ flex: 1 }} />
                <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)} className="dash-select">
                  <option value="all">All Status</option>
                  <option value="new">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div className="dash-order-list">
                {filteredOrders.length === 0 ? (
                  <div className="dash-empty">
                    <div className="dash-empty-icon">📦</div>
                    <h3>No orders found</h3>
                    <p>Try adjusting your search filters.</p>
                  </div>
                ) : (
                  filteredOrders.map(order => (
                    <div key={order.id} className="dash-order-card">
                      <div>
                        <div className="dash-order-id">{order.id}</div>
                        <div className="dash-order-items">
                          {order.itemsText || order.items?.map(i => `${i.name} ×${i.quantity}`).join(', ') || '—'}
                        </div>
                        <div className="dash-order-meta">
                          <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span>{order.totalDisplay || `₹${order.totalAmount?.toFixed(2)}`}</span>
                        </div>
                      </div>
                      <div className="dash-order-actions">
                        <span className={`status-badge status-${order.status}`}>{order.status}</span>
                        <button onClick={() => handleReorder(order)} className="dash-icon-btn" title="Reorder">Reorder</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* SECTION: Wishlist */}
        {activeSection === 'wishlist' && (
          <section className="dash-section active" style={{ display: 'block', textAlign: 'left' }}>
            <div className="dash-section-header">
              <div>
                <p className="dash-kicker">Saved Items</p>
                <h1>My Wishlist</h1>
              </div>
            </div>
            <div className="dash-product-grid">
              {wishlist.length === 0 ? (
                <div className="dash-empty" style={{ gridColumn: '1/-1' }}>
                  <div className="dash-empty-icon">❤️</div>
                  <h3>Your wishlist is empty</h3>
                  <p><Link href="/shop" style={{ color: 'var(--gold)' }}>Explore our chocolates →</Link></p>
                </div>
              ) : (
                wishlist.map(item => (
                  <div key={item.product_id} className="dash-product-card">
                    <div className="dash-product-img">
                      {item.image_slug ? (
                        <img src={item.image_slug.startsWith('http') || item.image_slug.startsWith('/api/') ? item.image_slug : `/assets/${item.image_slug}`} alt={item.name} onError={(e) => { e.target.src = '/assets/chocolate_bar.png'; }} />
                      ) : (
                        '🍫'
                      )}
                    </div>
                    <div className="dash-product-body">
                      <div className="dash-product-name">{item.name || 'Product'}</div>
                      <div className="dash-product-price">₹{Number(item.price || 0).toFixed(2)}</div>
                      <div className="dash-product-actions">
                        <button onClick={() => handleAddToBagFromWishlist(item)} className="dash-primary-btn" style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem' }}>Add to Bag</button>
                        <button onClick={() => handleRemoveWishlist(item.product_id)} className="dash-icon-btn danger">✕</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* SECTION: Addresses */}
        {activeSection === 'addresses' && (
          <section className="dash-section active" style={{ display: 'block', textAlign: 'left' }}>
            <div className="dash-section-header">
              <div>
                <p className="dash-kicker">Delivery Details</p>
                <h1>Saved Addresses</h1>
              </div>
              <button onClick={() => handleOpenAddressForm(null)} className="dash-cta-btn">+ Add Address</button>
            </div>

            <div className="dash-address-grid">
              {addresses.length === 0 ? (
                <div className="dash-empty" style={{ gridColumn: '1/-1' }}>
                  <div className="dash-empty-icon">🏠</div>
                  <h3>No saved addresses</h3>
                  <p>Add an address for faster checkout.</p>
                </div>
              ) : (
                addresses.map(addr => (
                  <div key={addr.id} className={`dash-address-card ${addr.is_default ? 'is-default' : ''}`}>
                    <div className="dash-address-label">
                      {addr.label}
                      {addr.is_default && <span className="dash-address-default-tag">Default</span>}
                    </div>
                    <div className="dash-address-text">
                      {[addr.address, addr.city, addr.zip].filter(Boolean).join(', ')}
                    </div>
                    <div className="dash-address-actions">
                      <button onClick={() => handleOpenAddressForm(addr.id)} className="dash-icon-btn">Edit</button>
                      {!addr.is_default && (
                        <button onClick={() => handleSetDefaultAddress(addr)} className="dash-icon-btn">Set Default</button>
                      )}
                      <button onClick={() => handleDeleteAddress(addr.id)} className="dash-icon-btn danger">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Address Form Card */}
            {isAddressFormOpen && (
              <div id="address-form-card" className="dash-card dash-form-card">
                <h2>{addressEditId ? 'Edit Address' : 'Add New Address'}</h2>
                <form onSubmit={handleAddressSubmit} className="dash-form" noValidate>
                  <div className="dash-form-row">
                    <div className="dash-field">
                      <label htmlFor="addr-label">Label</label>
                      <input id="addr-label" type="text" placeholder="Home, Office, etc." value={addressLabel} onChange={(e) => setAddressLabel(e.target.value)} />
                    </div>
                    <div className="dash-field">
                      <label htmlFor="addr-zip">PIN / ZIP Code</label>
                      <input id="addr-zip" type="text" placeholder="400001" value={addressZip} onChange={(e) => setAddressZip(e.target.value)} />
                    </div>
                  </div>
                  <div className="dash-field">
                    <label htmlFor="addr-address">Full Address *</label>
                    <input id="addr-address" type="text" placeholder="Street, Building, Apartment" value={addressText} onChange={(e) => setAddressText(e.target.value)} required />
                  </div>
                  <div className="dash-form-row">
                    <div className="dash-field">
                      <label htmlFor="addr-city">City</label>
                      <input id="addr-city" type="text" placeholder="Mumbai" value={addressCity} onChange={(e) => setAddressCity(e.target.value)} />
                    </div>
                  </div>
                  <label className="dash-checkbox">
                    <input type="checkbox" checked={addressDefault} onChange={(e) => setAddressDefault(e.target.checked)} />
                    <span>Set as default address</span>
                  </label>
                  <div className="dash-form-actions">
                    <button type="submit" disabled={isSavingAddress} className="dash-primary-btn">
                      {isSavingAddress ? 'Saving…' : 'Save Address'}
                    </button>
                    <button type="button" onClick={() => setIsAddressFormOpen(false)} className="dash-ghost-btn">Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </section>
        )}

        {/* SECTION: Settings */}
        {activeSection === 'settings' && (
          <section className="dash-section active" style={{ display: 'block', textAlign: 'left' }}>
            <div className="dash-section-header">
              <div>
                <p className="dash-kicker">Account</p>
                <h1>Settings</h1>
              </div>
            </div>

            {/* Profile information */}
            <div className="dash-card dash-settings-card">
              <h2>Profile Information</h2>
              <form onSubmit={handleProfileSubmit} className="dash-form" noValidate>
                <div className="dash-form-row">
                  <div className="dash-field">
                    <label htmlFor="profile-name">Full Name</label>
                    <input id="profile-name" type="text" placeholder="Your name" value={profileName} onChange={(e) => setProfileName(e.target.value)} required />
                  </div>
                  <div className="dash-field">
                    <label htmlFor="profile-phone">Phone Number</label>
                    <input id="profile-phone" type="tel" placeholder="+91 98765 43210" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} />
                  </div>
                </div>
                <div className="dash-field">
                  <label>Email Address</label>
                  <input id="profile-email" type="email" disabled className="dash-disabled" value={user?.email || ''} />
                </div>
                <div className="dash-form-actions">
                  <button type="submit" disabled={isSavingProfile} className="dash-primary-btn">
                    {isSavingProfile ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Change password card */}
            <div className="dash-card dash-settings-card">
              <h2>Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="dash-form" noValidate>
                <div className="dash-field">
                  <label htmlFor="pw-current">Current Password</label>
                  <input id="pw-current" type="password" placeholder="Your current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                </div>
                <div className="dash-form-row">
                  <div className="dash-field">
                    <label htmlFor="pw-new">New Password</label>
                    <input id="pw-new" type="password" placeholder="Min. 8 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                  </div>
                  <div className="dash-field">
                    <label htmlFor="pw-confirm">Confirm New Password</label>
                    <input id="pw-confirm" type="password" placeholder="Repeat new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  </div>
                </div>
                <div className="dash-form-actions">
                  <button type="submit" disabled={isSavingPassword} className="dash-primary-btn">
                    {isSavingPassword ? 'Updating…' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="dash-card dash-danger-card">
              <h2>Danger Zone</h2>
              <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
              <button onClick={() => {
                if (confirm('Are you absolutely sure? This will permanently delete your account and all data.')) {
                  showMessage('To delete your account, please contact support@soulfullbites.com', 'info');
                }
              }} className="dash-danger-btn">Delete My Account</button>
            </div>
          </section>
        )}
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="dash-overlay"></div>}
    </>
  );
}
