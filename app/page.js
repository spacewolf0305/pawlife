'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ===== Landing Page Styles ===== */
const styles = {
  /* --- Navbar --- */
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: '16px 0',
    transition: 'all 0.3s ease',
  },
  navScrolled: {
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 1px 20px rgba(0,0,0,0.06)',
  },
  navInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1.5rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    color: 'var(--primary)',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  navLink: {
    fontSize: '0.9375rem',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    transition: 'color 0.3s',
    cursor: 'pointer',
  },

  /* --- Hero --- */
  hero: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    background: 'var(--gradient-hero)',
    position: 'relative',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 70% 30%, rgba(255,107,53,0.15) 0%, transparent 60%), radial-gradient(circle at 30% 70%, rgba(0,180,216,0.1) 0%, transparent 60%)',
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '120px 24px 80px',
    position: 'relative',
    zIndex: 2,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
  },
  heroText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: 'var(--radius-full)',
    background: 'rgba(255,107,53,0.15)',
    color: '#FF8C5A',
    fontSize: '0.875rem',
    fontWeight: '600',
    width: 'fit-content',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    lineHeight: '1.1',
    color: '#FFFFFF',
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.03em',
  },
  heroTitleHighlight: {
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroDesc: {
    fontSize: '1.125rem',
    lineHeight: '1.7',
    color: 'rgba(255,255,255,0.7)',
    maxWidth: '500px',
  },
  heroCta: {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
  },
  heroStats: {
    display: 'flex',
    gap: '40px',
    marginTop: '16px',
  },
  heroStat: {
    display: 'flex',
    flexDirection: 'column',
  },
  heroStatNum: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'var(--font-display)',
  },
  heroStatLabel: {
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.5)',
  },
  heroVisual: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heroCard: {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.12)',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    maxWidth: '420px',
  },
  petPreview: {
    width: '100%',
    height: '200px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(0,180,216,0.2))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '5rem',
  },
  petPreviewInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petPreviewName: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  petPreviewBreed: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.5)',
  },
  petPreviewBadge: {
    padding: '6px 14px',
    borderRadius: 'var(--radius-full)',
    background: 'rgba(45,198,83,0.2)',
    color: '#2DC653',
    fontSize: '0.8125rem',
    fontWeight: '600',
  },

  /* --- Features --- */
  section: {
    padding: '100px 0',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  sectionLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: 'var(--radius-full)',
    background: 'rgba(255,107,53,0.08)',
    color: 'var(--primary)',
    fontSize: '0.8125rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    marginBottom: '16px',
    letterSpacing: '-0.02em',
  },
  sectionDesc: {
    fontSize: '1.0625rem',
    color: 'var(--text-secondary)',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.7',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
  },
  featureCard: {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-xl)',
    padding: '32px',
    border: '1px solid var(--border-light)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  },
  featureIcon: {
    width: '56px',
    height: '56px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.75rem',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '1.125rem',
    fontWeight: '700',
    marginBottom: '10px',
    fontFamily: 'var(--font-display)',
  },
  featureDesc: {
    fontSize: '0.9375rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },

  /* --- Pricing --- */
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 24px',
    alignItems: 'start',
  },
  pricingCard: {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-xl)',
    padding: '32px',
    border: '1px solid var(--border-light)',
    transition: 'all 0.3s',
    position: 'relative',
  },
  pricingCardPro: {
    background: 'var(--gradient-hero)',
    border: '1px solid rgba(255,107,53,0.3)',
    color: '#FFFFFF',
    transform: 'scale(1.05)',
    boxShadow: '0 20px 60px rgba(255,107,53,0.2)',
  },
  pricingBadge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '4px 16px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--gradient-primary)',
    color: '#FFFFFF',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  pricingName: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '8px',
  },
  pricingPrice: {
    fontSize: '3rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    lineHeight: '1',
    marginBottom: '4px',
  },
  pricingPeriod: {
    fontSize: '0.875rem',
    opacity: 0.6,
    marginBottom: '24px',
  },
  pricingFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  pricingFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.9375rem',
  },
  pricingCheck: {
    color: 'var(--success)',
    fontWeight: '700',
  },

  /* --- Testimonials --- */
  testimonialGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
  },
  testimonialCard: {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-xl)',
    padding: '28px',
    border: '1px solid var(--border-light)',
  },
  testimonialText: {
    fontSize: '0.9375rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.7',
    marginBottom: '20px',
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  testimonialAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
  },
  testimonialName: {
    fontWeight: '600',
    fontSize: '0.9375rem',
  },
  testimonialRole: {
    fontSize: '0.8125rem',
    color: 'var(--text-muted)',
  },

  /* --- CTA --- */
  ctaSection: {
    padding: '100px 0',
    background: 'var(--gradient-hero)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  ctaOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255,107,53,0.12) 0%, transparent 60%)',
  },
  ctaContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '600px',
    margin: '0 auto',
    padding: '0 24px',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'var(--font-display)',
    marginBottom: '16px',
  },
  ctaDesc: {
    fontSize: '1.0625rem',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '32px',
    lineHeight: '1.7',
  },

  /* --- Footer --- */
  footer: {
    background: '#0F1117',
    padding: '60px 0 24px',
    color: 'rgba(255,255,255,0.5)',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    marginBottom: '40px',
  },
  footerLogo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'var(--font-display)',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  footerDesc: {
    fontSize: '0.875rem',
    lineHeight: '1.6',
    maxWidth: '300px',
  },
  footerTitle: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '16px',
  },
  footerLink: {
    fontSize: '0.875rem',
    display: 'block',
    marginBottom: '10px',
    transition: 'color 0.3s',
    cursor: 'pointer',
  },
  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.08)',
    padding: '24px 24px 0',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8125rem',
  },
};

/* ===== Feature Data ===== */
const features = [
  {
    icon: '🐾',
    title: 'Pet Profiles',
    desc: 'Create beautiful digital profiles for all your pets with photos, breed info, and medical history.',
    bg: 'rgba(255,107,53,0.1)',
  },
  {
    icon: '💉',
    title: 'Health Tracker',
    desc: 'Track vaccinations, vet visits, medications, and get smart reminders so you never miss a dose.',
    bg: 'rgba(0,180,216,0.1)',
  },
  {
    icon: '📍',
    title: 'Lost & Found',
    desc: 'Report and find lost pets in your area. Location-based alerts help reunite pets with their families.',
    bg: 'rgba(239,71,111,0.1)',
  },
  {
    icon: '📸',
    title: 'Social Community',
    desc: 'Share adorable pet moments, connect with other pet parents, and get tips from the community.',
    bg: 'rgba(45,198,83,0.1)',
  },
  {
    icon: '🏥',
    title: 'Services Directory',
    desc: 'Find trusted vets, groomers, pet shops, and walkers near you — rated by real pet parents.',
    bg: 'rgba(255,182,39,0.1)',
  },
  {
    icon: '🛒',
    title: 'Pet Marketplace',
    desc: 'Shop premium pet food, toys, and accessories from trusted brands — all in one place.',
    bg: 'rgba(138,75,255,0.1)',
  },
];

const pricing = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    features: ['1 Pet Profile', 'Basic Health Tracking', 'Lost & Found Access', 'Community Feed', 'Ads Supported'],
    cta: 'Get Started',
    isPro: false,
  },
  {
    name: 'Pro',
    price: '₹199',
    period: 'per month',
    features: ['Unlimited Pets', 'Advanced Health Analytics', 'Priority Lost Alerts', 'No Advertisements', 'AI Symptom Checker', 'Export Health Reports'],
    cta: 'Start Free Trial',
    isPro: true,
  },
  {
    name: 'Business',
    price: '₹499',
    period: 'per month',
    features: ['Everything in Pro', 'Sponsored Listings', 'Priority Support', 'API Access', 'Team Management', 'Custom Branding'],
    cta: 'Contact Sales',
    isPro: false,
  },
];

const testimonials = [
  {
    text: "PawLife helped me track Max's vaccinations so easily. I never miss a vet appointment anymore!",
    name: 'Priya Sharma',
    role: 'Dog parent',
    avatar: '🐕',
    bg: 'rgba(255,107,53,0.15)',
  },
  {
    text: "Found my lost cat Luna within 2 hours thanks to the Lost & Found feature. Absolute lifesaver!",
    name: 'Arjun Patel',
    role: 'Cat parent',
    avatar: '🐈',
    bg: 'rgba(0,180,216,0.15)',
  },
  {
    text: "The community is amazing. Got so many helpful tips for raising my first puppy. Love this app!",
    name: 'Sneha Reddy',
    role: 'Puppy parent',
    avatar: '🐶',
    bg: 'rgba(45,198,83,0.15)',
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <div style={styles.navInner}>
          <div style={styles.logo}>🐾 PawLife</div>
          <div style={styles.navLinks} className="hide-mobile">
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#pricing" style={styles.navLink}>Pricing</a>
            <a href="#testimonials" style={styles.navLink}>Reviews</a>
            <Link href="/sign-in" style={styles.navLink}>Sign In</Link>
            <Link href="/sign-up" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <div style={styles.heroText} className="animate-fade-in-up">
            <span style={styles.heroBadge}>🚀 #1 Pet App in India</span>
            <h1 style={styles.heroTitle}>
              Your Pet&apos;s{' '}
              <span style={styles.heroTitleHighlight}>Digital Home</span>
            </h1>
            <p style={styles.heroDesc}>
              Track health, find lost pets, connect with the community, and discover
              nearby services — all in one beautifully designed platform.
            </p>
            <div style={styles.heroCta}>
              <Link href="/sign-up" className="btn btn-primary btn-lg">
                Get Started Free →
              </Link>
              <a href="#features" className="btn btn-secondary btn-lg" style={{ background: 'transparent', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}>
                Learn More
              </a>
            </div>
            <div style={styles.heroStats}>
              <div style={styles.heroStat}>
                <span style={styles.heroStatNum}>10K+</span>
                <span style={styles.heroStatLabel}>Pet Parents</span>
              </div>
              <div style={styles.heroStat}>
                <span style={styles.heroStatNum}>25K+</span>
                <span style={styles.heroStatLabel}>Pets Registered</span>
              </div>
              <div style={styles.heroStat}>
                <span style={styles.heroStatNum}>500+</span>
                <span style={styles.heroStatLabel}>Pets Reunited</span>
              </div>
            </div>
          </div>

          <div style={styles.heroVisual} className="animate-fade-in-up animate-delay-2">
            <div style={styles.heroCard}>
              <div style={styles.petPreview}>🐕</div>
              <div style={styles.petPreviewInfo}>
                <div>
                  <div style={styles.petPreviewName}>Max</div>
                  <div style={styles.petPreviewBreed}>Golden Retriever • 3 years</div>
                </div>
                <span style={styles.petPreviewBadge}>✓ Healthy</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem' }}>💉</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Vaccinated</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem' }}>⚖️</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>28 kg</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem' }}>🎂</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>3 yrs old</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>✨ Features</span>
          <h2 style={styles.sectionTitle}>Everything Your Pet Needs</h2>
          <p style={styles.sectionDesc}>
            From health tracking to community connections, PawLife has all the tools to keep your furry friend happy and healthy.
          </p>
        </div>
        <div style={styles.featuresGrid}>
          {features.map((f, i) => (
            <div
              key={i}
              style={styles.featureCard}
              className="animate-fade-in-up"
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}
            >
              <div style={{ ...styles.featureIcon, background: f.bg }}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" style={{ ...styles.section, background: 'var(--bg-sidebar)' }}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>💰 Pricing</span>
          <h2 style={styles.sectionTitle}>Simple, Transparent Pricing</h2>
          <p style={styles.sectionDesc}>
            Start free, upgrade when you&apos;re ready. No hidden fees, cancel anytime.
          </p>
        </div>
        <div style={styles.pricingGrid}>
          {pricing.map((p, i) => (
            <div
              key={i}
              style={{ ...styles.pricingCard, ...(p.isPro ? styles.pricingCardPro : {}) }}
            >
              {p.isPro && <span style={styles.pricingBadge}>Most Popular</span>}
              <div style={{ ...styles.pricingName, color: p.isPro ? '#FFF' : 'var(--text)' }}>{p.name}</div>
              <div style={{ ...styles.pricingPrice, color: p.isPro ? '#FFF' : 'var(--text)' }}>{p.price}</div>
              <div style={{ ...styles.pricingPeriod, color: p.isPro ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)' }}>{p.period}</div>
              <div style={styles.pricingFeatures}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ ...styles.pricingFeature, color: p.isPro ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)' }}>
                    <span style={{ ...styles.pricingCheck, color: p.isPro ? '#48CAE4' : 'var(--success)' }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
              <Link
                href="/sign-up"
                className={p.isPro ? 'btn btn-primary w-full' : 'btn btn-secondary w-full'}
                style={{ textAlign: 'center' }}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>💬 Testimonials</span>
          <h2 style={styles.sectionTitle}>Loved by Pet Parents</h2>
          <p style={styles.sectionDesc}>
            Join thousands of happy pet parents who trust PawLife with their fur babies.
          </p>
        </div>
        <div style={styles.testimonialGrid}>
          {testimonials.map((t, i) => (
            <div key={i} style={styles.testimonialCard}>
              <div style={{ color: 'var(--warning)', marginBottom: '12px' }}>★★★★★</div>
              <p style={styles.testimonialText}>&quot;{t.text}&quot;</p>
              <div style={styles.testimonialAuthor}>
                <div style={{ ...styles.testimonialAvatar, background: t.bg }}>{t.avatar}</div>
                <div>
                  <div style={styles.testimonialName}>{t.name}</div>
                  <div style={styles.testimonialRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaOverlay} />
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Give Your Pet the Best?</h2>
          <p style={styles.ctaDesc}>
            Join 10,000+ pet parents already using PawLife. Free forever, upgrade when you need more.
          </p>
          <Link href="/sign-up" className="btn btn-primary btn-lg">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={styles.footer}>
        <div style={styles.footerGrid}>
          <div>
            <div style={styles.footerLogo}>🐾 PawLife</div>
            <p style={styles.footerDesc}>
              The all-in-one platform for modern pet parents. Track health, find pets, build community.
            </p>
          </div>
          <div>
            <div style={styles.footerTitle}>Product</div>
            <a href="#features" style={styles.footerLink}>Features</a>
            <a href="#pricing" style={styles.footerLink}>Pricing</a>
            <a style={styles.footerLink}>Marketplace</a>
            <a style={styles.footerLink}>Mobile App</a>
          </div>
          <div>
            <div style={styles.footerTitle}>Company</div>
            <a style={styles.footerLink}>About Us</a>
            <a style={styles.footerLink}>Blog</a>
            <a style={styles.footerLink}>Careers</a>
            <a style={styles.footerLink}>Contact</a>
          </div>
          <div>
            <div style={styles.footerTitle}>Legal</div>
            <a style={styles.footerLink}>Privacy Policy</a>
            <a style={styles.footerLink}>Terms of Service</a>
            <a style={styles.footerLink}>Cookie Policy</a>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <span>© 2026 PawLife. All rights reserved.</span>
          <span>Made with ❤️ for pets</span>
        </div>
      </footer>
    </>
  );
}
