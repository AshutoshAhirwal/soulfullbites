'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import './login.css';

const HCAPTCHA_SITEKEY = '10000000-ffff-ffff-ffff-000000000001'; // Default test key that always passes in dev

export default function CustomerLoginPage() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [pwStrength, setPwStrength] = useState({ percent: 0, label: '', color: '#e05252' });

  // Common UI States
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('error');
  const [hcaptchaToken, setHcaptchaToken] = useState('');

  const hcaptchaContainerRef = useRef(null);
  const widgetIdRef = useRef(null);

  // Check existing session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/user-auth');
        const data = await res.json();
        if (data?.user) {
          window.location.href = '/dashboard';
        }
      } catch (err) {
        console.warn('Session check failed:', err);
      }
    };
    checkSession();
  }, []);

  // Password strength calculation
  const handleRegPasswordChange = (val) => {
    setRegPassword(val);
    if (!val) {
      setPwStrength({ percent: 0, label: '', color: '#e05252' });
      return;
    }
    let score = 0;
    if (val.length >= 8) score++;
    if (val.length >= 12) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const percent = Math.min(100, (score / 5) * 100);
    const colors = ['#e05252', '#e08652', '#e0c452', '#52c87d', '#2ea85f'];
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

    setPwStrength({
      percent,
      label: labels[score - 1] || '',
      color: colors[score - 1] || '#e05252'
    });
  };

  const handleHcaptchaLoad = () => {
    if (window.hcaptcha && hcaptchaContainerRef.current && !widgetIdRef.current) {
      const widgetId = window.hcaptcha.render(hcaptchaContainerRef.current, {
        sitekey: HCAPTCHA_SITEKEY,
        theme: 'dark',
        callback: (token) => {
          setHcaptchaToken(token);
        },
        'expired-callback': () => {
          setHcaptchaToken('');
        }
      });
      widgetIdRef.current = widgetId;
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/user-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      setMessageType('success');
      setMessage('Welcome back! Logging you in...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      setMessageType('error');
      setMessage(err.message);
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (regPassword.length < 8) {
      setMessageType('error');
      setMessage('Password must be at least 8 characters long.');
      return;
    }

    if (!hcaptchaToken) {
      setMessageType('error');
      setMessage('Please complete the hCaptcha security check.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/user-auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phone: regPhone,
          password: regPassword,
          hcaptchaToken: hcaptchaToken,
          website: '', // honeypot
          _hp: '', // honeypot
          phone_confirm: '' // honeypot
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setMessageType('success');
      setMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      setMessageType('error');
      setMessage(err.message);
      setIsLoading(false);

      if (window.hcaptcha && widgetIdRef.current) {
        window.hcaptcha.reset(widgetIdRef.current);
        setHcaptchaToken('');
      }
    }
  };

  return (
    <>
      <Script src="https://js.hcaptcha.com/1/api.js?render=explicit" onLoad={handleHcaptchaLoad} />

      {/* Animated background */}
      <div className="auth-bg">
        <div className="auth-bg-orb orb-1"></div>
        <div className="auth-bg-orb orb-2"></div>
        <div className="auth-bg-orb orb-3"></div>
      </div>

      {/* Back to site */}
      <Link href="/" className="auth-back" aria-label="Back to SoulfullBites">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        SoulfullBites
      </Link>

      <main className="auth-shell">
        {/* Left: Branding panel */}
        <aside className="auth-brand-panel" aria-hidden="true">
          <div className="auth-brand-content">
            <div className="auth-logo">
              <span className="auth-logo-mark">✦</span>
              SoulfullBites
            </div>
            <h1 className="auth-brand-headline">Crafted with <em>cocoa &amp; care.</em></h1>
            <p className="auth-brand-sub">Join thousands of chocolate lovers who have found their perfect bar. Track orders, save favourites, and be first to hear about new releases.</p>

            <div className="auth-perks">
              <div className="auth-perk">
                <span className="auth-perk-icon">📦</span>
                <div>
                  <strong>Live order tracking</strong>
                  <span>Watch your box travel from studio to doorstep.</span>
                </div>
              </div>
              <div className="auth-perk">
                <span className="auth-perk-icon">❤️</span>
                <div>
                  <strong>Personal wishlist</strong>
                  <span>Save your favourites across devices.</span>
                </div>
              </div>
              <div className="auth-perk">
                <span className="auth-perk-icon">🏠</span>
                <div>
                  <strong>Saved addresses</strong>
                  <span>Checkout in seconds with pre-filled details.</span>
                </div>
              </div>
              <div className="auth-perk">
                <span className="auth-perk-icon">🎁</span>
                <div>
                  <strong>Exclusive offers</strong>
                  <span>Members-only drops &amp; early access.</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right: Form panel */}
        <section className="auth-form-panel">
          <div className="auth-form-inner">
            {/* Tab switcher */}
            <div className={`auth-tabs ${activeTab === 'register' ? 'on-register' : ''}`} role="tablist">
              <button onClick={() => { setActiveTab('login'); setMessage(null); }} className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'login'} aria-controls="panel-login">Sign In</button>
              <button onClick={() => { setActiveTab('register'); setMessage(null); }} className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'register'} aria-controls="panel-register">Create Account</button>
              <div className="auth-tab-indicator"></div>
            </div>

            {message && (
              <div className={`auth-message ${messageType}`} role="alert">
                {message}
              </div>
            )}

            {/* LOGIN PANEL */}
            {activeTab === 'login' && (
              <div id="panel-login" className="auth-panel active" role="tabpanel">
                <form onSubmit={handleLoginSubmit} className="auth-form" noValidate>
                  <div className="auth-field">
                    <label htmlFor="login-email">Email address</label>
                    <input id="login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" required />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="login-password">
                      Password
                      <button type="button" className="auth-forgot-link">Forgot password?</button>
                    </label>
                    <div className="auth-password-wrap">
                      <input id="login-password" type={showLoginPassword ? 'text' : 'password'} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" required />
                      <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="auth-toggle-pw" aria-label={showLoginPassword ? 'Hide password' : 'Show password'}>
                        {showLoginPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading} className="auth-submit-btn">
                    {isLoading && <span className="auth-btn-spinner"></span>}
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
              </div>
            )}

            {/* REGISTER PANEL */}
            {activeTab === 'register' && (
              <div id="panel-register" className="auth-panel active" role="tabpanel">
                <form onSubmit={handleRegisterSubmit} className="auth-form" noValidate>
                  <div className="auth-field">
                    <label htmlFor="reg-name">Full name</label>
                    <input id="reg-name" type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Ashutosh" required />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="reg-email">Email address</label>
                    <input id="reg-email" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="you@example.com" required />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="reg-phone">Phone number</label>
                    <input id="reg-phone" type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="9999999999" />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="reg-password">Password (min. 8 characters)</label>
                    <div className="auth-password-wrap">
                      <input id="reg-password" type={showRegPassword ? 'text' : 'password'} value={regPassword} onChange={(e) => handleRegPasswordChange(e.target.value)} placeholder="••••••••" required />
                      <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="auth-toggle-pw" aria-label={showRegPassword ? 'Hide password' : 'Show password'}>
                        {showRegPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    {regPassword && (
                      <div className="auth-pw-strength">
                        <div className="auth-pw-bar">
                          <div id="pw-bar-fill" style={{ width: `${pwStrength.percent}%`, backgroundColor: pwStrength.color }}></div>
                        </div>
                        <span id="pw-strength-label">{pwStrength.label}</span>
                      </div>
                    )}
                  </div>

                  <div ref={hcaptchaContainerRef} style={{ margin: '1rem 0' }}></div>

                  <button type="submit" disabled={isLoading} className="auth-submit-btn">
                    {isLoading && <span className="auth-btn-spinner"></span>}
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
