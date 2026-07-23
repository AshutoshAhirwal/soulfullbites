'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';

const BAG_STORAGE_KEY = 'choc_bag';
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAC-oYQnEiMEhkCQO';

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [note, setNote] = useState('');

  // Page States
  const [isPaying, setIsPaying] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('error');
  const [turnstileToken, setTurnstileToken] = useState('');

  const turnstileContainerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    // 0. Check User Session & pre-fill details if available
    fetch('/api/user-auth')
      .then(res => res.json())
      .then(data => {
        if (data?.user) {
          setUser(data.user);
          if (data.user.name) setName(prev => prev || data.user.name);
          if (data.user.email) setEmail(prev => prev || data.user.email);
          if (data.user.phone) setPhone(prev => prev || data.user.phone);
        }
      })
      .catch(() => {});

    // Load Cart from localStorage
    const savedCart = localStorage.getItem(BAG_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCart(parsed);
        if (parsed.length === 0) {
          window.location.href = '/shop';
        }
      } catch (e) {
        window.location.href = '/shop';
      }
    } else {
      window.location.href = '/shop';
    }

    setLoading(false);
  }, []);

  const handleTurnstileLoad = () => {
    if (window.turnstile && turnstileContainerRef.current && !widgetIdRef.current) {
      const widgetId = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'light',
        callback: (token) => {
          setTurnstileToken(token);
        },
      });
      widgetIdRef.current = widgetId;
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!turnstileToken) {
      setMessageType('error');
      setMessage('Please complete the security check.');
      return;
    }

    setIsPaying(true);

    try {
      // 1. Create Order on Server
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: name,
          user_email: email,
          user_phone: phone,
          user_address: address,
          user_city: city,
          user_zip: zip,
          user_note: note,
          bag_items: cart,
          source: 'Next.js Checkout',
          security_token: turnstileToken,
          hp_data: '', // empty honeypot
        })
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || 'Failed to place order');
      }

      // 2. Open Razorpay payment gateway
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: 'INR',
        name: 'SoulfullBites',
        description: 'Artisanal Chocolate Order',
        image: '/assets/logo.png',
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify Payment on server
            const verifyRes = await fetch('/api/checkout/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: orderData.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            // Success: Clear Cart
            localStorage.removeItem(BAG_STORAGE_KEY);
            setCart([]);
            setMessageType('success');
            setMessage(`Payment successful! Order ID: ${orderData.orderId}`);
            
            setTimeout(() => {
              window.location.href = '/shop';
            }, 3000);
          } catch (err) {
            setMessageType('error');
            setMessage(`Verification failed: ${err.message}`);
            setIsPaying(false);
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: phone,
        },
        theme: {
          color: '#4a2c1a',
        },
        modal: {
          ondismiss: function () {
            setIsPaying(false);
          }
        }
      };

      const rpay = new window.Razorpay(options);
      rpay.open();
    } catch (err) {
      setMessageType('error');
      setMessage(err.message);
      setIsPaying(false);
      
      // Reset turnstile
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken('');
      }
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.qty ?? item.quantity ?? 0)), 0);

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onLoad={handleTurnstileLoad} />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <style>{`
        :root {
          --archive-bg: #f8f1e9;
        }
        .bg-warm {
          background: var(--archive-bg) !important;
          color: var(--choc-dark) !important;
        }
      `}</style>

      <div className="bg-warm" style={{ minHeight: '100vh' }}>
        {/* NAV */}
        <nav id="main-nav">
          <div className="nav-left">
            <Link href="/" className="nav-brand">SoulfullBites</Link>
          </div>
          <div className="nav-links">
            <Link href="/shop" className="nav-link">Back to Shop</Link>
            <Link href={user ? "/dashboard" : "/login"} className="nav-link">
              {user ? 'Account' : 'Login'}
            </Link>
          </div>
          <div className="nav-right">
            <a href="https://www.instagram.com/soulfulbitesofficial/" target="_blank" rel="noopener noreferrer" className="nav-insta">Instagram ↗</a>
          </div>
        </nav>

        <main className="content-pg" style={{ paddingTop: '120px' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <h1 className="text-center" style={{ marginBottom: '3rem' }}>Checkout</h1>

            {message && (
              <div className={`auth-message ${messageType}`} style={{ marginBottom: '2rem', padding: '1rem', borderRadius: '10px' }}>
                {message}
              </div>
            )}

            <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem' }}>
              {/* SHIPPING FORM */}
              <div className="checkout-form">
                <h3 style={{ marginBottom: '1.5rem', textAlign: 'left' }}>Shipping Information</h3>
                <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {/* Honeypot */}
                  <div style={{ display: 'none', visibility: 'hidden' }}>
                    <input type="text" name="hp_field" tabIndex="-1" autoComplete="off" />
                  </div>

                  <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid #ddd' }} />
                  
                  <div className="checkout-row" style={{ display: 'flex', gap: '1rem' }}>
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ flex: 1, padding: '1rem', borderRadius: '0.5rem', border: '1px solid #ddd' }} />
                    <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: '180px', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #ddd' }} />
                  </div>

                  <input type="text" placeholder="Shipping Address" value={address} onChange={(e) => setAddress(e.target.value)} required style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid #ddd' }} />
                  
                  <div className="checkout-row" style={{ display: 'flex', gap: '1rem' }}>
                    <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required style={{ flex: 1, padding: '1rem', borderRadius: '0.5rem', border: '1px solid #ddd' }} />
                    <input type="text" placeholder="Pincode" value={zip} onChange={(e) => setZip(e.target.value)} required style={{ width: '120px', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #ddd' }} />
                  </div>

                  <textarea placeholder="Special Instructions (Optional)" value={note} onChange={(e) => setNote(e.target.value)} style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid #ddd', height: '80px', resize: 'none' }}></textarea>

                  <div ref={turnstileContainerRef} style={{ margin: '1rem 0' }}></div>

                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem', textAlign: 'left' }}>✨ Payments are processed securely via Razorpay and sent to our kitchen with your latest delivery details.</p>
                  
                  <button type="submit" disabled={isPaying} className="btn-buy" style={{ width: '100%', padding: '1.5rem', background: 'var(--choc-dark)', fontSize: '1.1rem', cursor: 'pointer', opacity: isPaying ? 0.7 : 1 }}>
                    {isPaying ? 'Processing...' : 'Pay Now & Confirm Order'}
                  </button>
                </form>
              </div>

              {/* ORDER SUMMARY */}
              <div className="order-summary" style={{ background: 'rgba(255,255,255,0.6)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', height: 'fit-content', textAlign: 'left' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
                <div id="checkout-items-list" style={{ marginBottom: '1.5rem' }}>
                  {cart.map(item => {
                    const quantity = Math.max(0, Math.floor(Number(item.qty ?? item.quantity ?? 0) || 0));
                    return (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
                        <span>{item.name} × {quantity}</span>
                        <span>₹{(item.price * quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ borderTop: '1px solid #ddd', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem' }}>
                  <span>Total</span>
                  <span id="checkout-total">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="checkout-trust-list" style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#555', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p><strong>Dispatch:</strong> small batches packed in 2 to 4 working days.</p>
                  <p><strong>Packaging:</strong> gifting-ready presentation by default.</p>
                  <p><strong>Support:</strong> we confirm details before dispatch if anything looks unclear.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
