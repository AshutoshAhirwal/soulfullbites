'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FAQPage() {
  const [content, setContent] = useState({});
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaqId, setActiveFaqId] = useState(null);

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

    // 2. Fetch FAQs
    const fetchFaqs = async () => {
      try {
        const res = await fetch('/api/content?section=faq');
        const data = await res.json();
        setFaqs(data || []);
      } catch (err) {
        console.warn('FAQs Fetch failed:', err);
      }
    };

    // 3. Start 3D Experience
    const init3D = async () => {
      const { startFAQExperience } = await import('../../faq-scene.js');
      startFAQExperience();
    };

    Promise.all([fetchContent(), fetchFaqs()]).then(() => {
      init3D();
      setLoading(false);
    });
  }, []);

  const toggleFaq = (id) => {
    setActiveFaqId(activeFaqId === id ? null : id);
  };

  // Group FAQs by category
  const categories = Array.from(new Set(faqs.map(f => f.category || 'General')));

  const t = (key, fallback) => content[key] || fallback;

  return (
    <>
      <style>{`
        :root {
          --archive-bg: #f8f1e9;
          --archive-accent: #c9993a;
        }

        .archive-page-body {
          background: var(--archive-bg) !important;
          color: var(--choc-dark) !important;
          overflow-x: hidden;
        }

        #faq-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
          opacity: 0.5;
        }

        .archive-hero {
          padding: 15vh 5% 5vh;
          text-align: center;
        }

        .archive-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 10vw, 7rem);
          font-style: italic;
          margin-bottom: 2rem;
          line-height: 0.9;
        }

        .archive-hero p {
          font-size: 1.1rem;
          opacity: 0.6;
          max-width: 500px;
          margin: 0 auto;
        }

        /* ---- ACCORDION ---- */
        .faq-accordion {
          max-width: 900px;
          margin: 10vh auto;
          padding: 0 5%;
        }

        .faq-section {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 2rem;
          padding: 1.5rem;
          margin-bottom: 4rem;
          box-shadow: 0 40px 100px rgba(74, 44, 26, 0.05);
          text-align: left;
        }

        .faq-section-title {
          font-size: 0.7rem;
          letter-spacing: 0.4rem;
          text-transform: uppercase;
          color: var(--archive-accent);
          margin-bottom: 2.5rem;
          padding-left: 2rem;
        }

        .faq-item {
          border-bottom: 1px solid rgba(74, 44, 26, 0.05);
          padding: 1.5rem 2rem;
          cursor: pointer;
          transition: all 0.4s ease;
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .faq-question h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 400;
          margin: 0;
          transition: color 0.3s;
          color: var(--choc-dark);
        }

        .faq-item:hover .faq-question h3 {
          color: var(--archive-accent);
        }

        .faq-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(74, 44, 26, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s;
        }

        .faq-item.active .faq-icon {
          background: var(--archive-accent);
          border-color: var(--archive-accent);
          transform: rotate(45deg);
        }

        .faq-icon svg {
          width: 14px;
          height: 14px;
          stroke: var(--choc-dark);
          transition: stroke 0.4s;
        }

        .faq-item.active .faq-icon svg {
          stroke: #fff;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .faq-item.active .faq-answer {
          max-height: 300px;
          padding-top: 1.5rem;
        }

        .faq-answer p {
          font-size: 1.1rem;
          line-height: 1.8;
          opacity: 0.7;
          max-width: 600px;
          margin: 0;
          color: var(--choc-dark);
        }
      `}</style>

      <div className="archive-page-body">
        <canvas id="faq-canvas"></canvas>

        {/* LOADER */}
        <div id="loader">
          <div className="loader-inner">
            <span className="loader-brand">{t('site_title', 'SoulfullBites')}</span>
            <div className="loader-line">
              <div className="loader-progress"></div>
            </div>
            <span className="loader-hint">Unveiling the archive...</span>
          </div>
        </div>

        {/* NAV */}
        <nav id="main-nav">
          <div className="nav-left">
            <Link href="/" className="nav-brand">{t('site_title', 'SoulfullBites')}</Link>
          </div>
          <div className="nav-links">
            <Link href="/about" className="nav-link">Our Story</Link>
            <Link href="/shop" className="nav-link">Shop</Link>
            <Link href="/inspiration" className="nav-link">Inspiration</Link>
            <Link href="/faq" className="nav-link active">FAQ</Link>
          </div>
          <div className="nav-right">
            <a href={t('insta_link', 'https://www.instagram.com/soulfulbitesofficial/')} target="_blank" rel="noopener noreferrer" className="nav-insta">
              {t('insta_label', 'Instagram ↗')}
            </a>
          </div>
        </nav>

        <main className="content-pg" style={{ background: 'transparent' }}>
          <div className="container">
            {/* HERO SECTION */}
            <header className="archive-hero">
              <span className="label-tag">Archive of Intent</span>
              <h1>
                {content.faq_h1 ? (
                  <span dangerouslySetInnerHTML={{ __html: content.faq_h1.replace(/\n/g, '<br>') }} />
                ) : (
                  <>Archive of<br /><em>Intent.</em></>
                )}
              </h1>
              <p>{t('faq_p', 'Find answers about SoulfullBites ordering, shipping, ingredients, gifting, and handcrafted chocolate care.')}</p>
            </header>

            {/* ACCORDION */}
            <div className="faq-accordion">
              {categories.map((cat, idx) => (
                <div key={idx} className="faq-section">
                  <div className="faq-section-title">{cat}</div>
                  {faqs
                    .filter(f => (f.category || 'General') === cat && f.is_active !== false)
                    .map(item => (
                      <div key={item.id} onClick={() => toggleFaq(item.id)} className={`faq-item ${activeFaqId === item.id ? 'active' : ''}`}>
                        <div className="faq-question">
                          <h3>{item.question}</h3>
                          <div className="faq-icon">
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </div>
                        </div>
                        <div className="faq-answer">
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
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
      </div>
    </>
  );
}
