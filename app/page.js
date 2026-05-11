'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

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

    // 2. Start 3D Experience
    const init3D = async () => {
      const { startHomeExperience } = await import('../home-scene.js');
      startHomeExperience();
    };

    fetchContent().then(() => {
      init3D();
      setLoading(false);
    });

    // 3. Simple Form Handling (Restored from main.js)
    const form = document.getElementById('waitlist-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const email = document.getElementById('email-input')?.value;
        if (btn) { btn.textContent = 'Joining...'; btn.disabled = true; }
        
        try {
          await fetch('/api/checkout/waitlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_email: email, source: 'Home Waitlist' })
          });
          if (btn) btn.textContent = 'Joined ✓';
        } catch (err) {
          if (btn) { btn.textContent = 'Try Again'; btn.disabled = false; }
        }
      });
    }

  }, []);

  // Helper for CMS content
  const t = (key, fallback) => content[key] || fallback;

  return (
    <>
      {/* LOADER */}
      <div id="loader">
        <div className="loader-inner">
          <span className="loader-brand">{t('site_title', 'SoulfullBites')}</span>
          <div className="loader-line">
            <div className="loader-progress"></div>
          </div>
          <span className="loader-hint">Melting the finest cocoa...</span>
        </div>
      </div>

      {/* FIXED 3D CANVAS */}
      <canvas id="main-canvas"></canvas>

      {/* NAV */}
      <nav id="main-nav">
        <div className="nav-left">
          <Link href="/" className="nav-brand">{t('site_title', 'SoulfullBites')}</Link>
        </div>
        <div className="nav-links">
          <Link href="/about" className="nav-link">Our Story</Link>
          <Link href="/shop" className="nav-link">Shop</Link>
          <Link href="/inspiration" className="nav-link">Inspiration</Link>
          <Link href="/faq" className="nav-link">FAQ</Link>
        </div>
        <div className="nav-right">
          <span className="nav-station" id="station-label">THE ORIGIN</span>
          <a href={t('insta_link', 'https://www.instagram.com/soulfulbitesofficial/')} target="_blank" rel="noopener noreferrer" className="nav-insta">
            {t('insta_label', 'Instagram ↗')}
          </a>
        </div>
      </nav>

      {/* SCROLL SECTIONS */}
      <div id="scroll-root">
        {/* SECTION 1: HERO */}
        <section className="scroll-section" id="sec-hero">
          <div className="label-wrap center">
            <p className="label-tag">Est. 2026 · Handmade</p>
            <h1>
              {content.home_h1 ? (
                <span dangerouslySetInnerHTML={{ __html: content.home_h1.replace(/\n/g, '<br>') }} />
              ) : (
                <>Soulfull<br /><em>Bites.</em></>
              )}
            </h1>
            <p>{t('home_p', 'Artisanal, small-batch chocolates made with organic mountain botanicals. Every bite is a story told in cacao.')}</p>
            <div className="hero-btns" style={{ marginTop: '3rem' }}>
              <Link href="/shop" className="btn-primary">{t('home_cta', 'Shop the Collection')}</Link>
            </div>
          </div>
        </section>

        {/* SECTION 2: MOUNTAIN (ORIGIN) */}
        <section className="scroll-section" id="sec-origin">
          <div className="label-wrap left">
            <span className="label-tag">The Origin</span>
            <h2>
              {content.home_origin_h ? (
                <span dangerouslySetInnerHTML={{ __html: content.home_origin_h.replace(/\n/g, '<br>') }} />
              ) : (
                <>Carved by<br /><em>Mountain Air.</em></>
              )}
            </h2>
            <p>{t('home_origin_p', 'We believe chocolate should be more than a confection. It is an alchemy of high-altitude cream, wild botanicals, and unrefined cacao—crafted in the silence of the hills.')}</p>
          </div>
        </section>

        {/* SECTION 3: OUR STORY */}
        <section className="scroll-section" id="sec-story">
          <div className="label-wrap right">
            <span className="label-tag">The Story</span>
            <h2>
              {content.home_story_h ? (
                <span dangerouslySetInnerHTML={{ __html: content.home_story_h.replace(/\n/g, '<br>') }} />
              ) : (
                <>Small Batch,<br /><em>Big Soul.</em></>
              )}
            </h2>
            <p>{t('home_story_p', 'In our mountain kitchen, speed is the enemy of soul. We stone-grind our cacao for 72 hours, allowing the complex notes of the soil to bloom at their own pace.')}</p>
            <div className="quote-box">
              <p>{t('home_story_quote', '"Our mission is simple: to make chocolate that makes you feel exactly where you are."')}</p>
            </div>
          </div>
        </section>

        {/* SECTION 4: CRAFT */}
        <section className="scroll-section" id="sec-craft">
          <div className="label-wrap left">
            <span className="label-tag">03. The Craft</span>
            <h2>
              {content.home_craft_h ? (
                <span dangerouslySetInnerHTML={{ __html: content.home_craft_h.replace(/\n/g, '<br>') }} />
              ) : (
                <>Hand-tempered.<br /><em>Perfected.</em></>
              )}
            </h2>
            <p>{t('home_craft_p', 'Every bar is hand-tempered in small batches by our artisans, ensuring a snap, a shimmer, and a melt unlike any other.')}</p>
          </div>
        </section>

        {/* SECTION 5: FLAVORS */}
        <section className="scroll-section" id="sec-flavors">
          <div className="label-wrap center">
            <span className="label-tag">04. The Flavours</span>
            <h2>Three ways to<br /><em>feel something.</em></h2>
            <div className="flavor-cards">
              <div className="flavor-card">
                <span className="flavor-icon">🖤</span>
                <strong>Dark & Bold</strong>
                <p>75% single-origin cacao. Intense, earthy, and unapologetically deep.</p>
              </div>
              <div className="flavor-card">
                <span className="flavor-icon">🤎</span>
                <strong>Milk & Velvet</strong>
                <p>Creamy, slow-roasted milk chocolate with caramelised notes and a silky finish.</p>
              </div>
              <div className="flavor-card">
                <span className="flavor-icon">🌹</span>
                <strong>White & Rose</strong>
                <p>Delicate white chocolate kissed with dry rose petals and a touch of sea salt.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: THE PROMISE */}
        <section className="scroll-section" id="sec-promise">
          <div className="label-wrap center">
            <span className="label-tag">Our Promise</span>
            <h2>{t('promises_h2', 'Honest Ingredients. No Shortcuts.')}</h2>
          </div>
          <div className="promises-grid">
            <div className="promise-item">
              <span>🌿</span>
              <strong>{t('promise_1_h', '100% Natural')}</strong>
              <p>{t('promise_1_p', 'No artificial flavours, colours or preservatives. Pure and honest.')}</p>
            </div>
            <div className="promise-item">
              <span>📦</span>
              <strong>{t('promise_2_h', 'Small Batch')}</strong>
              <p>{t('promise_2_p', 'Made weekly in limited quantities to guarantee peak freshness.')}</p>
            </div>
            <div className="promise-item">
              <span>🌍</span>
              <strong>{t('promise_4_h', 'Ethically Sourced')}</strong>
              <p>{t('promise_4_p', 'We partner with fair-trade certified farms that pay fair wages.')}</p>
            </div>
          </div>
        </section>

        {/* SECTION 8: CTA */}
        <section className="scroll-section" id="sec-cta">
          <div className="label-wrap center">
            <span className="label-tag">The Inner Circle</span>
            <h2>{t('home_newsletter_h', 'Stay close to every new batch.')}</h2>
            <p>{t('home_newsletter_p', 'Get first access to limited drops, gifting releases, and tasting notes.')}</p>
            <form id="waitlist-form">
              <input type="email" id="email-input" placeholder="Your email address" required />
              <button type="submit">{t('home_newsletter_cta', 'Join the Insider List')}</button>
            </form>
          </div>
        </section>
      </div>

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
                <li><Link href="/" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7 }}>Home</Link></li>
                <li><Link href="/about" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7 }}>Our Story</Link></li>
                <li><Link href="/shop" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7 }}>Shop</Link></li>
                <li><Link href="/faq" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7 }}>FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.2rem', fontSize: '0.8rem', letterSpacing: '0.2rem', textTransform: 'uppercase' }}>Follow Us</h4>
              <a href={t('insta_link', '#')} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7 }}>
                {t('insta_label', 'Instagram ↗')}
              </a>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.4, fontSize: '0.7rem', letterSpacing: '0.1rem', textTransform: 'uppercase' }}>
            <p>{t('footer_copy', '© 2026 SoulfullBites.')}</p>
            <p>Made with &hearts; in the Mountains.</p>
          </div>
        </div>
      </footer>

      {/* SIDE DOTS */}
      <div id="side-dots">
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} className={`dot ${i === 0 ? 'active' : ''}`} data-idx={i}></div>
        ))}
      </div>
    </>
  );
}
