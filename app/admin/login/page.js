'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/user-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Check if user has management permissions
      if (!['ashu', 'staff'].includes(data.user.role)) {
        throw new Error('Access denied. Management roles only.');
      }

      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-full" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f0e8'
    }}>
      <div className="admin-login-box" style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '2.5rem',
        border: '1px solid rgba(74,44,26,0.12)',
        width: '100%',
        maxLength: '380px',
        boxShadow: '0 8px 40px rgba(74,44,26,0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.6rem',
            color: '#3d2518',
            fontWeight: '600'
          }}>SoulfullBites</div>
          <div style={{
            fontSize: '0.8rem',
            color: '#9a8678',
            marginTop: '0.25rem'
          }}>Store Console · Secure Access</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#9a8678', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@soulfullbites.dev"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(74,44,26,0.15)',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#9a8678', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(74,44,26,0.15)',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {error && (
            <div style={{
              color: '#9d3030',
              fontSize: '0.8rem',
              background: 'rgba(157,48,48,0.05)',
              padding: '0.75rem',
              borderRadius: '6px',
              marginBottom: '1rem',
              border: '1px solid rgba(157,48,48,0.1)'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: '#3d2518',
              color: '#f7ede0',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s'
            }}
          >
            {loading ? 'Authenticating...' : 'Open Dashboard →'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <a href="/" style={{ fontSize: '0.75rem', color: '#9a8678', textDecoration: 'none' }}>← Back to Storefront</a>
        </div>
      </div>
    </div>
  );
}
