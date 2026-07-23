'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function InspirationPage() {
  const [content, setContent] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    // 0. Check User Session
    fetch('/api/user-auth')
      .then(res => res.json())
      .then(data => { if (data?.user) setUser(data.user); })
      .catch(() => {});

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
      const { startInspirationExperience } = await import('../../inspiration-scene.js');
      startInspirationExperience();
    };

    fetchContent().then(() => {
      init3D();
      setLoading(false);
    });

    // 3. Scroll intersection & progress triggers
    const handleScroll = () => {
      const list = document.getElementById('inspo-discovery-list');
      const progressBar = document.getElementById('progress-bar');
      if (list && progressBar) {
        const rect = list.getBoundingClientRect();
        const totalHeight = rect.height - window.innerHeight;
        const scrolled = -rect.top;
        const percent = Math.min(100, Math.max(0, (scrolled / totalHeight) * 100));
        progressBar.style.height = `${percent}%`;
      }

      // Check visibility of items
      const items = document.querySelectorAll('.discovery-item');
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.6 && rect.bottom >= window.innerHeight * 0.4) {
          item.classList.add('visible');
          setActiveDot(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    setTimeout(handleScroll, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (idx) => {
    const item = document.getElementById(`item-sec-${idx}`);
    if (item) {
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const t = (key, fallback) => content[key] || fallback;

  return (
    <>
      <style>{`
        :root {
          --codex-dark: #1a0f08;
          --codex-accent: #c9993a;
        }

        .inspo-page-body {
          background: var(--codex-dark) !important;
          color: var(--cream) !important;
          overflow-x: hidden;
        }

        #inspiration-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
          opacity: 0.4;
        }

        /* ---- DISCOVERY LIST ---- */
        #inspo-discovery-list {
          position: relative;
          z-index: 10;
          padding: 15vh 5% 10vh;
        }

        .discovery-item {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-bottom: 15vh;
        }

        .discovery-item:nth-child(even) {
          flex-direction: row-reverse;
        }

        /* ---- CINEMATIC CONTENT ---- */
        .discovery-content {
          flex: 0 0 45%;
          padding: 4rem;
          z-index: 2;
          opacity: 0;
          transform: translateY(50px);
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .discovery-item.visible .discovery-content {
          opacity: 1;
          transform: translateY(0);
        }

        .discovery-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3.5rem, 8vw, 6rem);
          color: var(--cream);
          line-height: 0.85;
          margin-bottom: 2rem;
          font-style: italic;
          text-align: left;
        }

        .discovery-content h2 em {
          display: block;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.4em;
          letter-spacing: 0.5rem;
          text-transform: uppercase;
          color: var(--codex-accent);
          font-style: normal;
          margin-bottom: 1rem;
        }

        .discovery-content p {
          font-size: 1.2rem;
          line-height: 1.8;
          max-width: 450px;
          opacity: 0.7;
          text-align: left;
        }

        /* ---- FLOATING VISUAL ---- */
        .discovery-visual {
          flex: 0 0 50%;
          height: 70vh;
          position: relative;
          overflow: hidden;
          border-radius: 2rem;
          box-shadow: 0 50px 100px rgba(0,0,0,0.5);
          opacity: 0;
          transform: scale(0.9) rotate(3deg);
          transition: all 1.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .discovery-item.visible .discovery-visual {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }

        .discovery-visual img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 2s ease;
        }

        .discovery-item:hover .discovery-visual img {
          transform: scale(1.1);
        }

        /* ---- SCROLL PROGRESS BAR ---- */
        .scroll-progress-container {
          position: fixed;
          left: 3rem;
          top: 50%;
          transform: translateY(-50%);
          height: 40vh;
          width: 2px;
          background: rgba(255,255,255,0.1);
          z-index: 100;
        }

        .scroll-progress-bar {
          width: 100%;
          background: var(--codex-accent);
          height: 0%;
          transition: height 0.1s linear;
        }

        /* ---- NAVIGATION DOTS ---- */
        .discovery-nav {
          position: fixed;
          right: 4rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 2rem;
          z-index: 100;
        }

        .discovery-dot {
          width: 40px;
          height: 1px;
          background: rgba(255,255,255,0.2);
          transition: all 0.4s;
          cursor: pointer;
          position: relative;
        }

        .discovery-dot::after {
          content: attr(data-index);
          position: absolute;
          left: -3rem;
          top: -0.5rem;
          font-size: 0.7rem;
          opacity: 0;
          transition: opacity 0.4s;
          font-family: 'Outfit', sans-serif;
          color: var(--codex-accent);
        }

        .discovery-dot.active {
          width: 80px;
          background: var(--codex-accent);
        }

        .discovery-dot.active::after {
          opacity: 1;
        }

        @media (max-width: 900px) {
          .discovery-item, .discovery-item:nth-child(even) {
            flex-direction: column !important;
            padding: 10vh 5% !important;
          }
          .discovery-content, .discovery-visual {
            flex: none !important;
            width: 100% !important;
            padding: 2rem 0 !important;
          }
          .discovery-visual {
            height: 50vh !important;
          }
          .discovery-nav, .scroll-progress-container {
            display: none !important;
          }
        }
      `}</style>

      <div className="inspo-page-body">
        <canvas id="inspiration-canvas"></canvas>

        {/* LOADER */}
        <div id="loader">
          <div className="loader-inner">
            <span className="loader-brand" style={{ color: 'var(--cream)' }}>{t('site_title', 'SoulfullBites')}</span>
            <div className="loader-line">
              <div className="loader-progress"></div>
            </div>
            <span className="loader-hint">Unveiling the codex...</span>
          </div>
        </div>

        {/* NAV */}
        <nav id="main-nav">
          <div className="nav-left">
            <Link href="/" className="nav-brand" style={{ color: 'var(--cream)' }}>{t('site_title', 'SoulfullBites')}</Link>
          </div>
          <div className="nav-links">
            <Link href="/about" className="nav-link" style={{ color: 'var(--cream)' }}>Our Story</Link>
            <Link href="/shop" className="nav-link" style={{ color: 'var(--cream)' }}>Shop</Link>
            <Link href="/inspiration" className="nav-link active" style={{ color: 'var(--codex-accent)' }}>Inspiration</Link>
            <Link href="/faq" className="nav-link" style={{ color: 'var(--cream)' }}>FAQ</Link>
            <Link href={user ? "/dashboard" : "/login"} className="nav-link" style={{ color: 'var(--cream)' }}>
              {user ? 'Account' : 'Login'}
            </Link>
          </div>
          <div className="nav-right">
            <a href={t('insta_link', 'https://www.instagram.com/soulfulbitesofficial/')} target="_blank" rel="noopener noreferrer" className="nav-insta" style={{ color: 'var(--codex-accent)', borderColor: 'var(--codex-accent)' }}>
              {t('insta_label', 'Instagram ↗')}
            </a>
          </div>
        </nav>

        <div className="scroll-progress-container">
          <div className="scroll-progress-bar" id="progress-bar"></div>
        </div>

        <div className="discovery-nav" id="discovery-nav">
          {[0, 1, 2, 3].map(i => (
            <div key={i} onClick={() => scrollToSection(i)} className={`discovery-dot ${activeDot === i ? 'active' : ''}`} data-index={`0${i + 1}`}></div>
          ))}
        </div>

        <main id="inspo-discovery-list">
          {/* HERO ENTRY */}
          <section className="discovery-item visible" id="item-sec-0">
            <div className="discovery-content" style={{ textAlign: 'center', flex: '0 0 100%' }}>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.6rem', textTransform: 'uppercase', color: 'var(--codex-accent)', display: 'block', marginBottom: '2rem' }}>Volume 01</span>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(4rem, 15vw, 12rem)', color: 'var(--cream)', fontStyle: 'italic', lineHeight: 0.8 }}>
                {content.insp_h1 ? (
                  <span dangerouslySetInnerHTML={{ __html: content.insp_h1.replace(/\n/g, '<br>') }} />
                ) : (
                  <>The<br />Codex</>
                )}
              </h1>
              <p style={{ margin: '3rem auto', fontSize: '1.4rem' }}>
                {t('insp_p', 'A curated selection of artisanal rituals, mountain recipes, and soulful chocolate moments.')}
              </p>
              <div style={{ marginTop: '4rem', animation: 'float 2s infinite ease-in-out' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--codex-accent)" strokeWidth="1.5">
                  <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
              </div>
            </div>
          </section>

          {/* RITUAL 01 */}
          <section className="discovery-item" id="item-sec-1">
            <div className="discovery-content">
              <h2>
                {content.insp_item1_h ? (
                  <span dangerouslySetInnerHTML={{ __html: content.insp_item1_h.replace(/\n/g, '<br>') }} />
                ) : (
                  <><em>Ritual 01</em>Slow<br />Mornings</>
                )}
              </h2>
              <p>{t('insp_item1_p', 'Begin your day with a square of 72% dark chocolate and a moment of silence. Let the complexity of the beans awaken your senses before the world rushes in.')}</p>
              <a href="#" style={{ display: 'inline-block', marginTop: '3rem', color: 'var(--codex-accent)', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.3rem', textTransform: 'uppercase', fontWeight: 600 }}>Full Ritual ↗</a>
            </div>
            <div className="discovery-visual">
              <img src="/assets/inspiration_cupcakes.png" alt="Morning Ritual" />
            </div>
          </section>

          {/* RECIPE 02 */}
          <section className="discovery-item" id="item-sec-2">
            <div className="discovery-content">
              <h2>
                {content.insp_item2_h ? (
                  <span dangerouslySetInnerHTML={{ __html: content.insp_item2_h.replace(/\n/g, '<br>') }} />
                ) : (
                  <><em>Recipe 02</em>Mountain<br />Ganache</>
                )}
              </h2>
              <p>{t('insp_item2_p', 'Infuse your chocolate with local wild lavender and sea salt. A recipe crafted in the height of the mountain spring, designed for deep reflection.')}</p>
              <Link href="/recipe-mountain-ganache.html" style={{ display: 'inline-block', marginTop: '3rem', color: 'var(--codex-accent)', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.3rem', textTransform: 'uppercase', fontWeight: 600 }}>Recipe Details ↗</Link>
            </div>
            <div className="discovery-visual">
              <img src="/assets/inspiration_heart.png" alt="Mountain Ganache" />
            </div>
          </section>

          {/* GIFTING 03 */}
          <section className="discovery-item" id="item-sec-3">
            <div className="discovery-content">
              <h2>
                {content.insp_item3_h ? (
                  <span dangerouslySetInnerHTML={{ __html: content.insp_item3_h.replace(/\n/g, '<br>') }} />
                ) : (
                  <><em>Gifting 03</em>The Star<br />Table</>
                )}
              </h2>
              <p>{t('insp_item3_p', 'Transform a simple dinner into a celestial celebration. Hand-wrapped bars and scattered cocoa nibs create a landscape of shared intention.')}</p>
              <a href="#" style={{ display: 'inline-block', marginTop: '3rem', color: 'var(--codex-accent)', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.3rem', textTransform: 'uppercase', fontWeight: 600 }}>Styling Guide ↗</a>
            </div>
            <div className="discovery-visual">
              <img src="/assets/inspiration_star.png" alt="Star Table Setting" />
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="discovery-item" id="item-sec-4" style={{ minHeight: '80vh' }}>
            <div className="discovery-content" style={{ textAlign: 'center', flex: '0 0 100%' }}>
              <h2 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', textAlign: 'center' }}>Write your own<br /><em>Chapter.</em></h2>
              <Link href="/shop" style={{ display: 'inline-block', marginTop: '4rem', padding: '1.5rem 4rem', background: 'var(--codex-accent)', color: 'var(--codex-dark)', textDecoration: 'none', borderRadius: '4rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2rem', transition: 'transform 0.3s' }}>
                Shop the Collection
              </Link>
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
                  <li><Link href={user ? "/dashboard" : "/login"} style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7, fontSize: '0.9rem' }}>{user ? 'Account' : 'Login'}</Link></li>
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
      </div>
    </>
  );
}
