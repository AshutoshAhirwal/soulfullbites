'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const BAG_STORAGE_KEY = 'choc_bag';

export default function ShopPage() {
  const [content, setContent] = useState({});
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [reviewOrderId, setReviewOrderId] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState(null);
  const [reviewMessageType, setReviewMessageType] = useState('error');

  useEffect(() => {
    // 1. Fetch CMS Content
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content');
        const data = await res.json();
        setContent(data || {});
      } catch (err) {
        console.warn('CMS Fetch failed:', err);
      }
    };

    // 2. Fetch Products
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.warn('Products fetch failed:', err);
      }
    };

    // 3. Fetch Reviews
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        setReviews(data?.reviews || []);
      } catch (err) {
        console.warn('Reviews fetch failed:', err);
      }
    };

    // Load Cart from localStorage
    const savedCart = localStorage.getItem(BAG_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        setCart([]);
      }
    }

    Promise.all([fetchContent(), fetchProducts(), fetchReviews()]).then(() => {
      setLoading(false);
    });
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(newCart));
  };

  const addToBag = (prod) => {
    const existing = cart.find(item => item.id === prod.id);
    if (existing) {
      const updated = cart.map(item =>
        item.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(updated);
    } else {
      const updated = [...cart, { id: prod.id, name: prod.name, price: prod.price, quantity: 1, image_slug: prod.image_slug }];
      saveCart(updated);
    }
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    const updated = cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean);
    saveCart(updated);
  };

  const removeFromBag = (id) => {
    const updated = cart.filter(item => item.id !== id);
    saveCart(updated);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMessage(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: reviewOrderId,
          customerName: reviewName,
          rating: Number(reviewRating),
          comment: reviewComment
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setReviewMessageType('success');
      setReviewMessage('Review submitted successfully! Thank you.');
      setReviewOrderId('');
      setReviewName('');
      setReviewComment('');

      // Re-fetch reviews
      const revRes = await fetch('/api/reviews');
      const revData = await revRes.json();
      setReviews(revData?.reviews || []);

      setTimeout(() => {
        setIsReviewFormOpen(false);
        setReviewMessage(null);
      }, 2000);
    } catch (err) {
      setReviewMessageType('error');
      setReviewMessage(err.message);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const t = (key, fallback) => content[key] || fallback;

  return (
    <>
      {/* LOADER */}
      {loading && (
        <div id="loader">
          <div className="loader-inner">
            <span className="loader-brand">{t('site_title', 'SoulfullBites')}</span>
            <div className="loader-line">
              <div className="loader-progress"></div>
            </div>
            <span className="loader-hint">Melting the finest cocoa...</span>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav id="main-nav">
        <div className="nav-left">
          <Link href="/" className="nav-brand">{t('site_title', 'SoulfullBites')}</Link>
        </div>
        <div className="nav-links">
          <Link href="/about" className="nav-link">Our Story</Link>
          <Link href="/shop" className="nav-link active">Shop</Link>
          <Link href="/inspiration" className="nav-link">Inspiration</Link>
          <Link href="/faq" className="nav-link">FAQ</Link>
        </div>
        <div className="nav-right">
          <button onClick={() => setIsCartOpen(true)} id="cart-toggle" style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--choc-dark)', position: 'relative' }}>
            👜 <span id="cart-count">{cartCount}</span>
          </button>
          <a href={t('insta_link', 'https://www.instagram.com/soulfulbitesofficial/')} target="_blank" rel="noopener noreferrer" className="nav-insta">
            {t('insta_label', 'Instagram ↗')}
          </a>
        </div>
      </nav>

      {/* CART DRAWER */}
      <div id="cart-drawer" style={{
        position: 'fixed', top: 0, right: isCartOpen ? '0' : '-100vw',
        width: 'min(400px, 100vw)', height: '100vh', background: '#fff',
        zIndex: 1000, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
        transition: 'right 0.4s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', flexDirection: 'column', color: 'var(--text-dark)'
      }}>
        <div style={{ padding: '2.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.8rem' }}>{t('shop_bag_title', 'Your Bag')}</h3>
          <button onClick={() => setIsCartOpen(false)} id="cart-close" style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        </div>
        <div id="cart-items" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          {cart.length === 0 ? (
            <p id="empty-msg" style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '5rem' }}>{t('shop_empty_msg', 'Your bag is empty.')}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                  <img src={item.image_slug?.startsWith('http') || item.image_slug?.startsWith('/api/') ? item.image_slug : `/assets/${item.image_slug || 'chocolate_bar.png'}`} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'contain', background: '#fdf6ee', borderRadius: '10px' }} onError={(e) => { e.target.src = '/assets/chocolate_bar.png'; }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{item.name}</h4>
                    <span style={{ fontSize: '0.9rem', color: 'var(--gold)', fontWeight: 600 }}>₹{item.price}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button onClick={() => updateQuantity(item.id, -1)} style={{ border: '1px solid #ccc', background: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} style={{ border: '1px solid #ccc', background: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromBag(item.id)} style={{ border: 'none', background: 'none', color: '#9d3030', cursor: 'pointer', alignSelf: 'flex-start' }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: '2.5rem', borderTop: '1px solid var(--glass-border)', background: 'var(--warm-white)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <span style={{ fontWeight: 600 }}>Subtotal</span>
            <span id="cart-total" style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '1.2rem' }}>₹{cartTotal.toFixed(2)}</span>
          </div>
          <Link href="/checkout" style={{ display: 'block', textDecoration: 'none' }}>
            <button id="checkout-btn" disabled={cart.length === 0} style={{
              width: '100%', padding: '1.2rem', background: 'var(--choc-dark)',
              color: '#fff', border: 'none', borderRadius: '3rem', fontWeight: 600,
              cursor: 'pointer', transition: 'background 0.3s', opacity: cart.length === 0 ? 0.5 : 1
            }}>
              {t('shop_checkout_txt', 'Checkout')}
            </button>
          </Link>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="content-pg">
        <div className="container text-center">
          <header className="hero-small">
            <span className="label-tag">Artisanal Store</span>
            <h1 style={{ lineHeight: 0.9 }}>
              {content.shop_h1 ? (
                <span dangerouslySetInnerHTML={{ __html: content.shop_h1.replace(/\n/g, '<br>') }} />
              ) : (
                <>Chocolate for<br /><em>the Soul.</em></>
              )}
            </h1>
            <p className="label-sub" style={{ margin: '0 auto' }}>
              {t('shop_p', 'Small-batch, handmade bars shipped fresh from our kitchen to yours.')}
            </p>
          </header>

          <div id="shop-grid" className="shop-grid">
            {products.length === 0 ? (
              <p style={{ gridColumn: '1/-1', opacity: 0.5 }}>Loading catalog...</p>
            ) : (
              products.map(prod => (
                <div key={prod.id} className="product-card">
                  {/* Image + Hover Overlay scoped to image only */}
                  <div className="product-img-wrap">
                    <img src={prod.image_slug?.startsWith('http') || prod.image_slug?.startsWith('/api/') ? prod.image_slug : `/assets/${prod.image_slug || 'chocolate_bar.png'}`} alt={prod.name} className="product-img" onError={(e) => { e.target.src = '/assets/chocolate_bar.png'; }} />
                    <div className="product-hover-overlay">
                      {prod.description && (
                        <p className="overlay-desc">{prod.description}</p>
                      )}
                      {prod.ingredients && (
                        <>
                          <span className="overlay-label">Ingredients</span>
                          <div className="overlay-ingredients">
                            {prod.ingredients.split(',').map((ing, i) => (
                              <span key={i} className="overlay-ingredient-chip">{ing.trim()}</span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <h3>{prod.name}</h3>
                  <span className="price">
                    ₹{Number(prod.price).toFixed(2)}
                    <span style={{ fontSize: '0.8rem', fontWeight: 'normal', opacity: 0.75, marginLeft: '0.3rem' }}>
                      /kg + shipping charges.
                    </span>
                  </span>
                  <button onClick={() => addToBag(prod)} className="btn-buy">Add to Bag</button>
                  {prod.flavor_note && (
                    <p className="flavor-desc" style={{ fontSize: '0.8rem', marginTop: '1rem', color: 'var(--text-light)' }}>
                      {prod.flavor_note}
                    </p>
                  )}
                </div>
              ))

            )}
          </div>

          <section className="store-assurance">
            <div className="store-assurance-grid">
              <article className="assurance-card">
                <span className="label-tag">Fresh Dispatch</span>
                <h3>Made in weekly micro-batches.</h3>
                <p>Orders are prepared in limited runs so texture, aroma, and snap arrive at their best.</p>
              </article>
              <article className="assurance-card">
                <span className="label-tag">Gift Ready</span>
                <h3>Premium presentation built in.</h3>
                <p>Each order is packed to feel present-worthy for birthdays, thank-yous, and client gifting.</p>
              </article>
              <article className="assurance-card">
                <span className="label-tag">Store Confidence</span>
                <h3>Transparent ingredients and secure payments.</h3>
                <p>Every product shows its flavor profile and ingredients, and checkout is handled through Razorpay.</p>
              </article>
            </div>
            <p className="store-assurance-note">Need gifting inspiration or event dessert ideas? Explore <Link href="/inspiration">Inspiration</Link> or message us on Instagram.</p>
          </section>
        </div>

        {/* REVIEWS SECTION */}
        <section id="reviews-section" style={{ marginTop: '8rem', borderTop: '1px solid rgba(74, 44, 26, 0.08)', paddingTop: '6rem' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
              <div style={{ textAlign: 'left' }}>
                <span className="label-tag">Testimonials</span>
                <h2 style={{ fontSize: '3rem', fontFamily: "'Cormorant Garamond', serif", margin: 0 }}>Voice of the <em>Soul.</em></h2>
                <p style={{ maxWidth: '420px', color: 'var(--text-light)', marginTop: '0.8rem' }}>Verified buyer reviews unlock after an order is marked delivered, so this section stays trustworthy as the store grows.</p>
              </div>
              <button onClick={() => setIsReviewFormOpen(!isReviewFormOpen)} id="open-review-form" className="btn-buy" style={{ background: 'var(--choc-dark)', border: 'none', padding: '1rem 2rem', cursor: 'pointer' }}>
                {isReviewFormOpen ? 'Cancel' : 'Leave a Delivered-Order Review'}
              </button>
            </div>

            {/* REVIEW SUBMISSION FORM */}
            {isReviewFormOpen && (
              <form onSubmit={handleReviewSubmit} style={{ maxWidth: '500px', margin: '0 auto 4rem', padding: '3rem', background: '#fffaf5', borderRadius: '20px', border: '1px solid var(--choc-light)', textAlign: 'left' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: '2rem', color: 'var(--choc-dark)' }}>Submit Review</h3>

                {reviewMessage && (
                  <div className={`auth-message ${reviewMessageType}`} style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '10px' }}>
                    {reviewMessage}
                  </div>
                )}

                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="review-order-id" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Order ID (e.g. SB-xxxxx)</label>
                  <input type="text" id="review-order-id" value={reviewOrderId} onChange={(e) => setReviewOrderId(e.target.value)} required style={{ width: '100%', padding: '1rem', border: '1px solid #ccc', borderRadius: '10px' }} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="review-name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Your Name (matching order)</label>
                  <input type="text" id="review-name" value={reviewName} onChange={(e) => setReviewName(e.target.value)} required style={{ width: '100%', padding: '1rem', border: '1px solid #ccc', borderRadius: '10px' }} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="review-rating" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Rating</label>
                  <select id="review-rating" value={reviewRating} onChange={(e) => setReviewRating(e.target.value)} style={{ width: '100%', padding: '1rem', border: '1px solid #ccc', borderRadius: '10px' }}>
                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                    <option value="3">⭐⭐⭐ (3/5)</option>
                    <option value="2">⭐⭐ (2/5)</option>
                    <option value="1">⭐ (1/5)</option>
                  </select>
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label htmlFor="review-comment" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Your Review (min. 12 characters)</label>
                  <textarea id="review-comment" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} required style={{ width: '100%', padding: '1rem', border: '1px solid #ccc', borderRadius: '10px', height: '100px' }}></textarea>
                </div>
                <button type="submit" className="btn-buy" style={{ width: '100%', border: 'none', padding: '1.2rem', cursor: 'pointer' }}>Submit Review</button>
              </form>
            )}

            <div id="reviews-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem', textAlign: 'left', paddingBottom: '2rem' }}>
              {reviews.length === 0 ? (
                <p style={{ textAlign: 'center', gridColumn: '1/-1', opacity: 0.5 }}>Be the first to share your experience...</p>
              ) : (
                reviews.map(rev => (
                  <div key={rev.id} style={{ padding: '2rem', background: '#fff', border: '1px solid rgba(74, 44, 26, 0.05)', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <strong>{rev.customer_name}</strong>
                      <span style={{ color: 'var(--gold)' }}>{'⭐'.repeat(rev.rating)}</span>
                    </div>
                    <p style={{ fontStyle: 'italic', opacity: 0.9, fontSize: '0.95rem', lineHeight: 1.6 }}>"{rev.comment}"</p>
                    {rev.is_verified && (
                      <span style={{ fontSize: '0.75rem', background: 'rgba(82, 200, 125, 0.1)', color: '#2ea85f', padding: '0.2rem 0.6rem', borderRadius: '10px', display: 'inline-block', marginTop: '0.5rem', fontWeight: 600 }}>Verified Buyer ✓</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ background: 'var(--choc-dark)', color: 'var(--cream)', padding: '5rem 5% 2rem', position: 'relative', zIndex: 20 }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 5%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', borderBottom: '1px solid rgba(253, 246, 238, 0.1)', paddingBottom: '4rem', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ color: 'var(--cream)', marginBottom: '1.5rem', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem' }}>{t('site_title', 'SoulfullBites')}</h3>
              <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: 1.6 }}>{t('footer_desc', 'Small-batch handmade chocolates crafted with soul and intention.')}</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.2rem', fontSize: '0.8rem', letterSpacing: '0.2rem', textTransform: 'uppercase' }}>Discover</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: 0 }}>
                <li><Link href="/" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7, fontSize: '0.9rem' }}>Home</Link></li>
                <li><Link href="/about" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7, fontSize: '0.9rem' }}>Our Story</Link></li>
                <li><Link href="/shop" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7, fontSize: '0.9rem' }}>Shop</Link></li>
                <li><Link href="/inspiration" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7, fontSize: '0.9rem' }}>Inspiration</Link></li>
                <li><Link href="/faq" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7, fontSize: '0.9rem' }}>FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.2rem', fontSize: '0.8rem', letterSpacing: '0.2rem', textTransform: 'uppercase' }}>Follow Us</h4>
              <a href={t('insta_link', '#')} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7, fontSize: '0.9rem' }}>
                {t('insta_label', 'Instagram ↗')}
              </a>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.4, fontSize: '0.7rem', letterSpacing: '0.1rem', textTransform: 'uppercase' }}>
            <p>{t('footer_copy', '© 2026 SoulfullBites.')}</p>
            <p>Made with &hearts; in the Mountains.</p>
            <a href="https://ashutosh-ahirwal.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Ashutosh Ahirwal</a>
          </div>
        </div>
      </footer>
    </>
  );
}
