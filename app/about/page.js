'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [content, setContent] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      const { startAboutExperience } = await import('../../about-scene.js');
      startAboutExperience();
    };

    fetchContent().then(() => {
      init3D();
      setLoading(false);
    });
  }, []);

  const t = (key, fallback) => content[key] || fallback;

  return (
    <>
      {/* 3D CANVAS */}
      <canvas id="about-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none', opacity: 0.6 }}></canvas>

      {/* LOADER */}
      <div id="loader">
        <div className="loader-inner">
          <span className="loader-brand">{t('site_title', 'SoulfullBites')}</span>
          <div className="loader-line">
            <div className="loader-progress"></div>
          </div>
          <span className="loader-hint">Infusing soul into every bean...</span>
        </div>
      </div>

      {/* NAV */}
      <nav id="main-nav">
        <div className="nav-left">
          <Link href="/" className="nav-brand">{t('site_title', 'SoulfullBites')}</Link>
        </div>
        <div className="nav-links">
          <Link href="/about" className="nav-link active">Our Story</Link>
          <Link href="/shop" className="nav-link">Shop</Link>
          <Link href="/inspiration" className="nav-link">Inspiration</Link>
          <Link href="/faq" className="nav-link">FAQ</Link>
          <Link href={user ? "/dashboard" : "/login"} className="nav-link">
            {user ? 'Account' : 'Login'}
          </Link>
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
          <header className="hero-small" style={{ marginTop: '-5rem' }}>
            <span className="label-tag" style={{ animation: 'fadeInUp 0.8s forwards' }}>The Essence of Us</span>
            <h1 style={{ transform: 'translateY(20px)', opacity: 0, animation: 'fadeInUp 1s 0.2s forwards', lineHeight: 0.9 }}>
              {content.about_h1 ? (
                <span dangerouslySetInnerHTML={{ __html: content.about_h1.replace(/\n/g, '<br>') }} />
              ) : (
                <>Crafted with<br /><em style={{ fontSize: '1.2em' }}>Intention.</em></>
              )}
            </h1>
            <p style={{ maxWidth: '600px', margin: '2rem auto', opacity: 0.7, fontSize: '1.2rem', transform: 'translateY(20px)', animation: 'fadeInUp 1s 0.4s forwards' }}>
              {t('about_p', "Beyond the sugar and cocoa lies a story of heritage, mindfulness, and the pursuit of nature's purest joy.")}
            </p>
          </header>

          {/* STATS SECTION */}
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', margin: '8rem 0', textAlign: 'center' }}>
            <div className="stat-item">
              <span style={{ fontSize: '3rem', fontFamily: "'Cormorant Garamond', serif", color: 'var(--gold)' }}>72hr</span>
              <p style={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.2rem' }}>Stone Ground</p>
            </div>
            <div className="stat-item">
              <span style={{ fontSize: '3rem', fontFamily: "'Cormorant Garamond', serif", color: 'var(--gold)' }}>100%</span>
              <p style={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.2rem' }}>Ethical Sourcing</p>
            </div>
            <div className="stat-item">
              <span style={{ fontSize: '3rem', fontFamily: "'Cormorant Garamond', serif", color: 'var(--gold)' }}>0%</span>
              <p style={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.2rem' }}>Industrial Fillers</p>
            </div>
          </div>

          {/* THE STORY SECTION */}
          <div className="grid-2" style={{ marginBottom: '12rem' }}>
            <div className="story-text">
              <span className="label-tag">Chapter One</span>
              <h2 style={{ fontSize: '4rem', marginTop: '1rem' }}>
                {content.about_chap1_h2 ? (
                  <span dangerouslySetInnerHTML={{ __html: content.about_chap1_h2.replace(/\n/g, '<br>') }} />
                ) : (
                  <>The Hillside<br /><em>Beginning.</em></>
                )}
              </h2>
              <div>
                {content.about_chap1_p ? (
                  <div dangerouslySetInnerHTML={{ __html: content.about_chap1_p }} />
                ) : (
                  <>
                    <p>SoulfullBites was born out of a simple desire: to bring back the "soul" in everyday treats. In a world of mass-produced, industrial confectionery, we chose a different path.</p>
                    <p>Our journey began in a small hillside kitchen, where the aroma of roasting cocoa beans filled the air. We believe that chocolate is not just food; it's a medium for connection, a slow-release of joy, and a return to nature's purest gifts.</p>
                  </>
                )}
              </div>
              <blockquote style={{ margin: '3rem 0', fontSize: '1.4rem' }}>
                {t('about_quote', '"We don\'t just make chocolate; we create moments of deep, delicious mindfulness."')}
              </blockquote>
            </div>
            <div className="story-image" style={{ transform: 'rotate(2deg)', outline: '1px solid var(--gold)', outlineOffset: '15px' }}>
              <img src="/assets/maker.png" alt="Our Artisan Craft" />
            </div>
          </div>

          {/* THE RAW SPIRIT */}
          <section style={{ margin: '15rem 0', textAlign: 'center' }}>
            <h2 style={{ fontSize: '5rem', marginBottom: '4rem' }}>
              {content.about_raw_h2 ? (
                <span dangerouslySetInnerHTML={{ __html: content.about_raw_h2.replace(/\n/g, '<br>') }} />
              ) : (
                <>The Raw <em>Spirit.</em></>
              )}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
              <div style={{ padding: '3rem', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)', borderRadius: '2rem', border: '1px solid rgba(201, 147, 106, 0.1)' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{t('about_raw_1_h', 'Terroir Driven')}</h3>
                <p style={{ opacity: 0.8 }}>{t('about_raw_1_p', 'We celebrate the unique volcanic soils of Madagascar and the lush forests of Kerala. Every batch reflects the season it was harvested.')}</p>
              </div>
              <div style={{ padding: '3rem', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)', borderRadius: '2rem', border: '1px solid rgba(201, 147, 106, 0.1)' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{t('about_raw_2_h', 'Patient Craft')}</h3>
                <p style={{ opacity: 0.8 }}>{t('about_raw_2_p', 'Curing beans for 7 days, roasting in small batches, and stone-grinding for 72 hours. We never rush the soul.')}</p>
              </div>
              <div style={{ padding: '3rem', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)', borderRadius: '2rem', border: '1px solid rgba(201, 147, 106, 0.1)' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{t('about_raw_3_h', 'Direct Trade')}</h3>
                <p style={{ opacity: 0.8 }}>{t('about_raw_3_p', 'Bypassing middlemen to ensure more value goes directly to the hands that harvest the beans. A fair life for every farmer.')}</p>
              </div>
            </div>
          </section>

          {/* THE PROCESS SECTION */}
          <div className="grid-2" style={{ marginBottom: '12rem' }}>
            <div className="story-image" style={{ transform: 'rotate(-2deg)', outline: '1px solid var(--gold)', outlineOffset: '15px' }}>
              <img src="/assets/cocoa_beans.png" alt="Ethical Sourcing" />
            </div>
            <div className="story-text">
              <span className="label-tag">The Philosophy</span>
              <h2 style={{ fontSize: '4rem', marginTop: '1rem' }}>
                {content.about_philo_h2 ? (
                  <span dangerouslySetInnerHTML={{ __html: content.about_philo_h2.replace(/\n/g, '<br>') }} />
                ) : (
                  <>Ethically<br /><em>Sourced.</em></>
                )}
              </h2>
              <div>
                {content.about_philo_p ? (
                  <div dangerouslySetInnerHTML={{ __html: content.about_philo_p }} />
                ) : (
                  <>
                    <p>We work directly with family-owned farms. By bypassing large industrial brokers, we ensure that every farmer is paid a wage that honors their craft and protects their land.</p>
                    <p>Every bean is hand-sorted, slow-roasted, and stone-ground to achieve that signature silky melt that our community loves.</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* SUSTAINABILITY */}
          <section style={{ margin: '12rem 0' }}>
            <div className="grid-2">
              <div className="story-text">
                <span className="label-tag">Beyond the Bar</span>
                <h2 style={{ fontSize: '4rem', marginTop: '1rem' }}>
                  {content.about_impact_h2 ? (
                    <span dangerouslySetInnerHTML={{ __html: content.about_impact_h2.replace(/\n/g, '<br>') }} />
                  ) : (
                    <>Community<br /><em>Impact.</em></>
                  )}
                </h2>
                <div>
                  {content.about_impact_p ? (
                    <div dangerouslySetInnerHTML={{ __html: content.about_impact_p }} />
                  ) : (
                    <>
                      <p>Our commitment goes beyond the flavor. We reinvest 5% of our profits into local education programs for the children of cocoa farmers in Kerala.</p>
                      <p>By providing scholarships and school supplies, we aim to ensure that the next generation has as many opportunities as the beans they help cultivate.</p>
                    </>
                  )}
                </div>
                <ul style={{ listStyle: 'none', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: 'var(--gold)' }}>✔</span> Zero-Waste Compostable Packaging
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: 'var(--gold)' }}>✔</span> Renewable Energy Powered Kitchens
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: 'var(--gold)' }}>✔</span> Direct Farmer Education Workshops
                  </li>
                </ul>
              </div>
              <div className="impact-visual" style={{ background: 'rgba(139, 94, 60, 0.05)', padding: '4rem', borderRadius: '3rem', textAlign: 'center', border: '1px dashed var(--choc-light)' }}>
                <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>🌱</div>
                <h3 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>1,200+</h3>
                <p style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.2rem', color: 'var(--text-light)' }}>Trees Planted This Year</p>
              </div>
            </div>
          </section>

          {/* CALL TO ACTION */}
          <div style={{ textAlign: 'center', margin: '10rem 0 5rem' }}>
            <Link href="/shop" className="btn-ins-more" style={{ padding: '1.5rem 4rem', borderRadius: '4rem', fontSize: '1rem', display: 'inline-block', textDecoration: 'none' }}>
              Experience the Soul
            </Link>
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
    </>
  );
}
