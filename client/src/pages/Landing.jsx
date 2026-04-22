import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ─── Scroll Reveal Hook ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ─── Counter Hook ─── */
function useCounter(end, duration = 2000, start) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0 = null;
    const step = (ts) => { if (!t0) t0 = ts; const p = Math.min((ts - t0) / duration, 1); setVal(Math.floor(p * end)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [start, end, duration]);
  return val;
}

/* ═══════════════════════════════════════════════════════
   NAVBAR — Glass, minimal, sticky
   ═══════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav className="landing-nav" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? '12px 48px' : '20px 48px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(255,255,255,0.7)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px) saturate(1.8)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.8)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(226,232,240,0.4)' : '1px solid transparent',
      transition: 'all 0.5s cubic-bezier(.4,0,.2,1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 18, color: scrolled ? '#0f172a' : '#fff', transition: 'color 0.4s', letterSpacing: '-0.01em' }}>AuditArch</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <a href="#features" style={{ fontSize: 13, fontWeight: 600, color: scrolled ? '#64748b' : 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>Features</a>
        <a href="#how" style={{ fontSize: 13, fontWeight: 600, color: scrolled ? '#64748b' : 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>How it Works</a>
        <Link to="/login" style={{ fontSize: 13, fontWeight: 600, color: scrolled ? '#0f172a' : '#fff', textDecoration: 'none', transition: 'color 0.3s' }}>Sign In</Link>
        <Link to="/signup" className="liquid-btn-primary" style={{ padding: '10px 28px', fontSize: 13 }}>Get Started</Link>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO — ENHANCED — Dark gradient, tons of floating elements
   ═══════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="hero-section">
      {/* Gradient Background */}
      <div className="hero-bg" />

      {/* Animated Grid Pattern */}
      <div className="hero-grid-pattern" />

      {/* Decorative Orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />
      <div className="hero-orb hero-orb-4" />

      {/* ── ATMOSPHERIC LAYER: FADED GRID & PARTICLES ── */}
      <div className="hero-faded-grid" />
      <div className="hero-atmosphere">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="hero-particle" />
        ))}
      </div>

      {/* ── LEFT FLOATING SIDEBAR ── */}
      <div className="hero-sidebar hero-fade-in" style={{ animationDelay: '0.9s' }}>
        <div className="hsb-icon hsb-icon-active">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
        </div>
        <div className="hsb-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        </div>
        <div className="hsb-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
        </div>
        <div className="hsb-divider" />
        <div className="hsb-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </div>
        <div className="hsb-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        </div>
      </div>

      {/* ── FLOATING NOTIFICATION BELL ── */}
      <div className="hero-float-notif hero-fade-in" style={{ animationDelay: '1.1s', animation: 'floatSlow 9s ease-in-out infinite 2s' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4c40e6" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
        <span className="hero-notif-badge">3</span>
      </div>



      {/* ── HERO CONTENT ── */}

      <div className="hero-content">
        {/* Badge */}
        <div className="hero-badge hero-fade-in" style={{ animationDelay: '0.1s' }}>
          <span className="hero-badge-dot" />
          Built for Chartered Accountants
        </div>

        {/* Headline */}
        <h1 className="hero-headline hero-fade-in" style={{ animationDelay: '0.25s' }}>
          Simplified Billing for<br />
          <span className="hero-headline-accent">Modern Accountants</span>
        </h1>

        {/* Subtext */}
        <p className="hero-subtext hero-fade-in" style={{ animationDelay: '0.4s' }}>
          The professional suite designed for CA practices. Manage clients, log services,
          and generate formal PDF invoices with automated TDS logic and service tracking.
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta hero-fade-in" style={{ animationDelay: '0.55s' }}>
          <Link to="/signup" className="liquid-btn-primary">Start Your Practice</Link>
          <Link to="/login" className="liquid-btn-secondary">Explore Features</Link>
        </div>

        {/* ═══ FLOATING HERO CARDS — REFERENCE MATCH ═══ */}
        <div className="hero-cards hero-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="fc-horizontal-row">
            {/* Card 1: Client Billing (Left) */}
            <div className="float-card fc-ref-left" style={{ animation: 'floatSlow 7s ease-in-out infinite' }}>
              <div className="fc-icon-rounded icon-cyan">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              </div>
              <span className="fc-label-tr">Client Billing</span>
              <div className="fc-value-large">₹8,500</div>
              <div className="fc-meta-pill">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                <span>TDS Auto-Computed</span>
              </div>
              <div className="fc-footer-bar" />
            </div>

            {/* Card 2: Practice Growth (Center) */}
            <div className="float-card fc-ref-center" style={{ animation: 'floatSlow 6s ease-in-out infinite 0.5s' }}>
              <div className="fc-icon-rounded icon-blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <span className="fc-label-tr">Practitioner Growth</span>
              <div className="fc-value-xl">124</div>
              <div className="fc-avatar-row">
                <div className="fc-avatar" style={{ background: '#1e293b' }}><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" alt="" /></div>
                <div className="fc-avatar" style={{ background: '#334155', marginLeft: -10 }}><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" alt="" /></div>
                <div className="fc-avatar" style={{ background: '#475569', marginLeft: -10 }}><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" alt="" /></div>
                <div className="fc-avatar-plus">+12</div>
              </div>
              <div className="fc-pill-btn">Manage Records</div>
            </div>

            {/* Card 3: Revenue Insights (Right) */}
            <div className="float-card fc-ref-right" style={{ animation: 'floatSlow 8s ease-in-out infinite 1s' }}>
              <div className="fc-icon-rounded icon-magenta">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              </div>
              <div className="fc-label-badge">Monthly Revenue</div>
              <div className="fc-chart-box">
                {[30, 50, 40, 70, 60].map((h, i) => (
                  <div key={i} className="fc-chart-bar" style={{ height: `${h}%`, opacity: 0.4 + (i * 0.15) }} />
                ))}
              </div>
              <div className="fc-value-footer">
                <span className="fc-value-sm">₹4.8L</span>
                <span className="fc-label-xs">Current Month</span>
              </div>
              <div className="float-card-add-ref">+</div>
            </div>
          </div>

          {/* Mini: Compliance Shield */}
          <div className="float-mini-shield" style={{ animation: 'floatSlow 11s ease-in-out infinite 0.8s', left: '15%', top: '-40px' }}>🛡️</div>

          {/* Mini: Activity Sparkline */}
          <div className="float-mini-spark" style={{ animation: 'floatSlow 10s ease-in-out infinite 1.2s', right: '15%', top: '-20px' }}>
            <svg viewBox="0 0 60 20" style={{ width: 60, height: 20 }}>
              <polyline points="0,18 8,12 16,15 24,6 32,10 40,4 48,8 60,2" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
}



/* ═══════════════════════════════════════════════════════
   FEATURES — WORLD CLASS — Rich interactive cards
   ═══════════════════════════════════════════════════════ */
function FeaturesSection() {
  const [ref, vis] = useReveal();
  return (
    <section id="features" ref={ref} className="features-section">
      <div className="section-center" style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(.4,0,.2,1)' }}>
        <h2 className="section-title">Built Specially for<br /><span className="text-accent">Chartered Accountants</span></h2>
        <p className="section-desc">Every module is designed to handle the complexities of a CA practice,<br />from TDS logic to financial year tracking.</p>
      </div>
      <div className="features-grid">
        <SmartBillingCard vis={vis} />
        <ClientManagementCard vis={vis} />
        <AuditGradeCard vis={vis} />
        <InstantSettlementCard vis={vis} />
        <PredictiveFluxCard vis={vis} />
        <InstantPDFCard vis={vis} />
      </div>
    </section>
  );
}

/* ── Feature 1: Smart Billing ── */
function SmartBillingCard({ vis }) {
  const [ref, v] = useReveal(0.1);
  return (
    <div ref={ref} className="feature-card-glass" style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.7s cubic-bezier(.4,0,.2,1) 0s' }}>
      <div className="feature-icon-box">⬡</div>
      <h3 className="feature-title">GST & ITR Logging</h3>
      <p className="feature-desc">Easily log services for professional fees and out-of-pocket expenses with seamless TDS deductions.</p>
      {/* ── Mini Invoice Preview ── */}
      <div className="feat-mini-ui">
        <div className="feat-invoice-row feat-shimmer">
          <span>GST Return Filing</span>
          <span className="feat-amount">₹8,000</span>
        </div>
        <div className="feat-invoice-row feat-shimmer">
          <span>ITR Assessment</span>
          <span className="feat-amount">₹5,500</span>
        </div>
        <div className="feat-invoice-row feat-total-row">
          <span>Total Due</span>
          <span className="feat-amount feat-total-val" style={{ animation: 'glowPulse 2s infinite' }}>₹13,500</span>
        </div>
        <div className="feat-tds-strip">
          <span>Less: TDS @ 10%</span>
          <span style={{ color: '#ef4444', fontWeight: 700 }}>-₹800</span>
        </div>
        <div className="feat-net-row feat-shimmer">
          <span>Net Payable</span>
          <span>₹12,700</span>
        </div>
      </div>
    </div>
  );
}

/* ── Feature 2: Client Management ── */
function ClientManagementCard({ vis }) {
  const [ref, v] = useReveal(0.1);
  const clients = [
    { name: 'Sharma & Co.', services: 4, color: '#4c40e6' },
    { name: 'Patel Industries', services: 6, color: '#10b981' },
    { name: 'Mehta Finance', services: 3, color: '#f59e0b' },
  ];
  return (
    <div ref={ref} className="feature-card-glass" style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.7s cubic-bezier(.4,0,.2,1) 0.1s' }}>
      <div className="feature-icon-box">✦</div>
      <h3 className="feature-title">Client Directory</h3>
      <p className="feature-desc">A centralized vault for all your clients, featuring firm details, contact info, and complete service history.</p>
      {/* ── Client List Preview ── */}
      <div className="feat-mini-ui">
        {clients.map((c, i) => (
          <div key={i} className="feat-client-row feat-stagger-in" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
            <div className="feat-client-avatar feat-avatar-float" style={{ background: c.color, animationDelay: `${i * 0.5}s` }}>{c.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div className="feat-client-name">{c.name}</div>
              <div className="feat-client-meta">{c.services} active services</div>
            </div>
            <div className="feat-client-badge">{c.services}</div>
          </div>
        ))}
        <div className="feat-add-client" style={{ animation: 'rowReveal 0.6s both 0.6s' }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>+</span>
          <span style={{ fontSize: 11, fontWeight: 600 }}>Add Client</span>
        </div>
      </div>
    </div>
  );
}

/* ── Feature 3: Military Grade Audit ── */
function AuditGradeCard({ vis }) {
  const [ref, v] = useReveal(0.1);
  return (
    <div ref={ref} className="feature-card-glass" style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.7s cubic-bezier(.4,0,.2,1) 0.2s' }}>
      <div className="feature-icon-box">⊞</div>
      <h3 className="feature-title">Professional Dashboards</h3>
      <p className="feature-desc">Get a high-level view of your practice's monthly and annual revenue through intuitive analytics.</p>
      {/* ── Security Dashboard ── */}
      <div className="feat-mini-ui">
        <div className="feat-shield-row feat-shimmer">
          <div className="feat-shield" style={{ animation: 'avatarFloat 3s infinite' }}>🛡️</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>Encryption Active</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>AES-256 • End-to-end</div>
          </div>
          <div className="feat-status-dot feat-status-green" />
        </div>
        <div className="feat-compliance-grid">
          {['SOC2', 'GDPR', 'ISO 27001', 'SSL/TLS'].map((text, i) => (
            <div key={text} className="feat-compliance-badge feat-stagger-in" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
              <div className="feat-check">✓</div>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="feat-progress-row">
          <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>THREAT LEVEL</span>
          <div className="feat-progress-bar">
            <div className="feat-progress-fill" style={{ width: vis ? '12%' : '0%', background: '#10b981', transition: 'width 1.5s cubic-bezier(.4,0,.2,1) 0.5s' }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#10b981' }}>LOW</span>
        </div>
      </div>
    </div>
  );
}

/* ── Feature 4: Instant Settlement ── */
function InstantSettlementCard({ vis }) {
  const [ref, v] = useReveal(0.1);
  return (
    <div ref={ref} className="feature-card-glass" style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.7s cubic-bezier(.4,0,.2,1) 0.3s' }}>
      <div className="feature-icon-box">⚡</div>
      <h3 className="feature-title">Service Tracking</h3>
      <p className="feature-desc">Monitor every service from draft to final bill, ensuring no billable work goes unnoticed.</p>
      {/* ── Payment Timeline ── */}
      <div className="feat-mini-ui">
        {[
          { label: 'Payment Received', meta: 'Sharma & Co. • ₹42,000', time: '2m ago', color: '#10b981' },
          { label: 'Invoice Sent', meta: 'Patel Industries • ₹18,500', time: '1hr ago', color: '#f59e0b' },
          { label: 'TDS Deducted', meta: 'Auto-reconciled • ₹4,200', time: '3hr ago', color: '#4c40e6' }
        ].map((item, i) => (
          <div key={i} className="feat-timeline-item feat-stagger-in" style={{ animationDelay: `${0.4 + i * 0.15}s` }}>
            <div className="feat-tl-dot" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}66` }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{item.label}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>{item.meta}</div>
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>{item.time}</div>
          </div>
        ))}
        <div className="feat-live-pulse" style={{ animation: 'rowReveal 0.6s both 1s' }}>
          <span className="feat-live-dot" />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981' }}>LIVE TRACKING</span>
        </div>
      </div>
    </div>
  );
}

/* ── Feature 5: Predictive Flux ── */
function PredictiveFluxCard({ vis }) {
  const [ref, v] = useReveal(0.1);
  const bars = [35, 55, 40, 70, 85, 60, 92, 78, 65, 88, 72, 95];
  return (
    <div ref={ref} className="feature-card-glass" style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.7s cubic-bezier(.4,0,.2,1) 0.4s' }}>
      <div className="feature-icon-box">◈</div>
      <h3 className="feature-title">Past Records History</h3>
      <p className="feature-desc">A comprehensive history of all invoices with advanced filtering by client, date, or amount.</p>
      {/* ── Analytics Chart ── */}
      <div className="feat-mini-ui">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>₹4.2L</span>
          <span className="feat-trend-up" style={{ animation: 'glowPulse 2s infinite' }}>↑ 24.5%</span>
        </div>
        <div className="feat-bar-chart">
          {bars.map((h, i) => (
            <div
              key={i}
              className="feat-bar"
              style={{
                height: v ? `${h}%` : '0%',
                background: i >= 8 ? 'rgba(76,64,230,0.2)' : 'linear-gradient(180deg, #4c40e6, #6366f1)',
                transition: `height 1s cubic-bezier(.4,0,.2,1) ${0.5 + i * 0.05}s`,
                opacity: i >= 8 ? 0.4 : 1
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>Jan</span>
          <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>Jun</span>
          <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>Dec</span>
        </div>
        <div className="feat-forecast-strip" style={{ animation: 'rowReveal 0.6s both 1.2s' }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#4c40e6' }}>◈ AI FORECAST</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#64748b' }}>Next Quarter: ₹5.1L</span>
        </div>
      </div>
    </div>
  );
}

/* ── Feature 6: Instant PDF ── */
function InstantPDFCard({ vis }) {
  const [ref, v] = useReveal(0.1);
  return (
    <div ref={ref} className="feature-card-glass" style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.7s cubic-bezier(.4,0,.2,1) 0.5s' }}>
      <div className="feature-icon-box">⟡</div>
      <h3 className="feature-title">Instant PDF</h3>
      <p className="feature-desc">Professional, print-ready invoices generated instantly. Share via email or download on the spot.</p>
      {/* ── PDF Preview ── */}
      <div className="feat-mini-ui">
        <div className="feat-pdf-preview">
          <div className="feat-scan-line" />
          <div className="feat-pdf-header">
            <div className="feat-pdf-lines">
              <div style={{ width: '60%', height: 5, background: '#0f172a', borderRadius: 2 }} />
              <div style={{ width: '40%', height: 3, background: '#94a3b8', borderRadius: 2 }} />
            </div>
            <div className="feat-pdf-logo-box feat-shimmer" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 8 }}>
            <div style={{ width: '35%', height: 3, background: '#e2e8f0', borderRadius: 2 }} />
            <div style={{ width: '50%', height: 3, background: '#e2e8f0', borderRadius: 2 }} />
          </div>
          <div className="feat-pdf-table">
            <div className="feat-pdf-table-row feat-pdf-table-head">
              <div style={{ width: '40%', height: 3, background: '#94a3b8', borderRadius: 2 }} />
              <div style={{ width: '20%', height: 3, background: '#94a3b8', borderRadius: 2 }} />
            </div>
            <div className="feat-pdf-table-row feat-shimmer">
              <div style={{ width: '50%', height: 2, background: '#e2e8f0', borderRadius: 2 }} />
              <div style={{ width: '15%', height: 2, background: '#e2e8f0', borderRadius: 2 }} />
            </div>
            <div className="feat-pdf-table-row feat-shimmer">
              <div style={{ width: '45%', height: 2, background: '#e2e8f0', borderRadius: 2 }} />
              <div style={{ width: '18%', height: 2, background: '#e2e8f0', borderRadius: 2 }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
            <div style={{ width: '30%', height: 4, background: '#4c40e6', borderRadius: 2, animation: 'glowPulse 2s infinite' }} />
          </div>
        </div>
        <div className="feat-pdf-actions">
          <div className="feat-pdf-btn">📥 Download</div>
          <div className="feat-pdf-btn feat-pdf-btn-alt">📧 Email</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HOW IT WORKS
   ═══════════════════════════════════════════════════════ */
const steps = [
  { num: '01', title: 'Add Clients', desc: 'Create client profiles with firm details and address in seconds.', icon: '👤' },
  { num: '02', title: 'Add Services', desc: 'Log services like GST, ITR, Audit with amounts and financial year.', icon: '⚡' },
  { num: '03', title: 'Preview Bill', desc: 'See your invoice exactly as it will appear. Edit anything you want.', icon: '👁️' },
  { num: '04', title: 'Generate PDF', desc: 'One click. Professional invoice. Ready to share or print.', icon: '📨' },
];

function HowItWorks() {
  const [ref, vis] = useReveal();
  return (
    <section id="how" ref={ref} className="how-section">
      <div className="section-center" style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s' }}>
        <h2 className="section-title">The Simplest Path to a<br /><span className="text-accent">Formal Invoice.</span></h2>
      </div>
      <div className="how-grid">
        <div className="how-line" />
        {steps.map((s, i) => (
          <StepCard key={i} {...s} index={i} />
        ))}
      </div>
    </section>
  );
}

function StepCard({ num, title, desc, icon, index }) {
  const [ref, vis] = useReveal(0.1);
  return (
    <div ref={ref} className="step-card" style={{
      opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(40px)',
      transition: `all 0.7s cubic-bezier(.4,0,.2,1) ${index * 0.15}s`
    }}>
      <div className="step-icon-box">{icon}</div>
      <div className="step-num">{num}</div>
      <h3 className="step-title">{title}</h3>
      <p className="step-desc">{desc}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STATS — Bottom bar with animated counters
   ═══════════════════════════════════════════════════════ */
function StatsBar() {
  const [ref, vis] = useReveal();
  const c1 = useCounter(50, 2000, vis);
  const c3 = useCounter(12, 2400, vis);

  return (
    <section ref={ref} className="stats-bar">
      <div className="stats-grid">
        <div className="stat-item" style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s 0s' }}>
          <div className="stat-value">{c1}0+</div>
          <div className="stat-label">CAs Trust Us</div>
        </div>
        <div className="stat-item" style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s 0.15s' }}>
          <div className="stat-value">100%</div>
          <div className="stat-label">Secure Practice Data</div>
        </div>
        <div className="stat-item" style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s 0.3s' }}>
          <div className="stat-value">2.5K+</div>
          <div className="stat-label">Invoices Generated</div>
        </div>
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s 0.45s' }}>
          <Link to="/signup" className="liquid-btn-primary" style={{ fontSize: 13, padding: '12px 32px' }}>Start Your Practice</Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="landing-footer">
      <div className="footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 16, color: '#0f172a' }}>AuditArch</span>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          <a href="#" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</a>
          <a href="#" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>Terms of Service</a>
          <a href="#" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>About Us</a>
        </div>
      </div>
      <div className="footer-copy">
        © {new Date().getFullYear()} AuditArch. Official CA Practice Management.<br />
        <span style={{ opacity: 0.6 }}>The professional standard for CA billing and client records.</span>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN LANDING EXPORT
   ═══════════════════════════════════════════════════════ */
export default function Landing() {
  return (
    <div className="landing-root">
      <LandingStyles />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <StatsBar />
      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ALL STYLES — Scoped to Landing
   ═══════════════════════════════════════════════════════ */
function LandingStyles() {
  return (
    <style>{`
      /* ── ROOT ── */
      .landing-root {
        min-height: 100vh;
        background: #f8faff;
        overflow-x: hidden;
      }

      /* ── KEYFRAMES ── */
      @keyframes floatSlow { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
      @keyframes heroIn { from { opacity:0; transform: translateY(36px); } to { opacity:1; transform: translateY(0); } }
      @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
      @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 20px rgba(76,64,230,0.2); } 50% { box-shadow: 0 0 40px rgba(76,64,230,0.35); } }
      @keyframes fadePulse { 
        0%, 100% { opacity: 0; transform: scale(0.5) translate(0, 0); }
        50% { opacity: 0.6; transform: scale(1.2) translate(10px, -15px); }
      }
      @keyframes gridFade {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.5; }
      }

      .hero-fade-in { animation: heroIn 0.9s cubic-bezier(.4,0,.2,1) both; }

      /* ── FEATURE LIVELINESS KEYFRAMES ── */
      @keyframes chartGrow { from { height: 0; opacity: 0; } to { height: 100%; opacity: 1; } }
      @keyframes rowReveal { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
      @keyframes pdfScan { 0% { top: -10%; } 100% { top: 110%; } }
      @keyframes avatarFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      @keyframes glowPulse { 0%,100% { text-shadow: 0 0 5px rgba(76,64,230,0); } 50% { text-shadow: 0 0 12px rgba(76,64,230,0.4); } }

      .feat-stagger-in { animation: rowReveal 0.6s cubic-bezier(.4,0,.2,1) both; }
      .feat-avatar-float { animation: avatarFloat 3s ease-in-out infinite; }
      .feat-shimmer {
        position: relative; overflow: hidden;
      }
      .feat-shimmer::after {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        background-size: 200% 100%;
        animation: shimmer 3s infinite linear;
      }


      /* ════════════════════════════════
         LIQUID GLASS BUTTONS
         ════════════════════════════════ */
      .liquid-btn-primary {
        display: inline-flex; align-items: center; justify-content: center;
        padding: 14px 36px;
        background: linear-gradient(145deg, #6366f1 0%, #4c40e6 40%, #3b31c2 100%);
        color: #fff; font-weight: 700; font-size: 14px;
        border: none; border-radius: 50px; cursor: pointer;
        text-decoration: none;
        box-shadow:
          0 2px 0 0 rgba(255,255,255,0.25) inset,
          0 -2px 6px 0 rgba(59,49,194,0.3) inset,
          0 8px 24px -4px rgba(76,64,230,0.4),
          0 2px 8px rgba(76,64,230,0.2);
        transition: all 0.3s cubic-bezier(.4,0,.2,1);
        position: relative;
        overflow: hidden;
        text-shadow: 0 1px 2px rgba(0,0,0,0.15);
      }
      .liquid-btn-primary::before {
        content: '';
        position: absolute; top: 1px; left: 10%; right: 10%; height: 40%;
        background: linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%);
        border-radius: 50px;
        pointer-events: none;
      }
      .liquid-btn-primary:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow:
          0 2px 0 0 rgba(255,255,255,0.3) inset,
          0 -2px 6px 0 rgba(59,49,194,0.4) inset,
          0 14px 36px -4px rgba(76,64,230,0.45),
          0 4px 12px rgba(76,64,230,0.25);
      }

      .liquid-btn-secondary {
        display: inline-flex; align-items: center; justify-content: center;
        padding: 14px 36px;
        background: rgba(255,255,255,0.12);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        color: #fff; font-weight: 700; font-size: 14px;
        border: 1px solid rgba(255,255,255,0.25);
        border-radius: 50px; cursor: pointer;
        text-decoration: none;
        box-shadow:
          0 1px 0 0 rgba(255,255,255,0.15) inset,
          0 4px 16px -2px rgba(0,0,0,0.1);
        transition: all 0.3s cubic-bezier(.4,0,.2,1);
        position: relative;
        overflow: hidden;
      }
      .liquid-btn-secondary::before {
        content: '';
        position: absolute; top: 1px; left: 10%; right: 10%; height: 35%;
        background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
        border-radius: 50px;
        pointer-events: none;
      }
      .liquid-btn-secondary:hover {
        background: rgba(255,255,255,0.2);
        transform: translateY(-2px) scale(1.02);
        box-shadow:
          0 1px 0 0 rgba(255,255,255,0.25) inset,
          0 8px 24px -4px rgba(0,0,0,0.15);
      }

      .liquid-btn-mini {
        display: inline-flex; align-items: center; justify-content: center;
        padding: 8px 20px;
        background: linear-gradient(145deg, #4c40e6, #6366f1);
        color: #fff; font-weight: 700; font-size: 11px;
        border: none; border-radius: 50px;
        box-shadow: 0 1px 0 rgba(255,255,255,0.2) inset, 0 4px 12px rgba(76,64,230,0.3);
        cursor: pointer;
        position: relative; overflow: hidden;
      }
      .liquid-btn-mini::before {
        content: '';
        position: absolute; top: 1px; left: 15%; right: 15%; height: 40%;
        background: linear-gradient(180deg, rgba(255,255,255,0.3), transparent);
        border-radius: 50px; pointer-events: none;
      }

      /* ════════════════════════════════
         HERO SECTION
         ════════════════════════════════ */
      .hero-section {
        position: relative;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 140px 48px 80px;
        overflow: hidden;
      }

      .hero-bg {
        position: absolute; inset: 0;
        background: linear-gradient(175deg,
          #0c0a1a 0%,
          #151030 15%,
          #1e1548 30%,
          #2d1f6e 45%,
          #4838a0 58%,
          #7c6fe0 68%,
          #c4befa 78%,
          #e8e4ff 86%,
          #f0eeff 92%,
          #f8faff 100%
        );
        z-index: 0;
      }

      .hero-orb {
        position: absolute; border-radius: 50%;
        filter: blur(80px);
        z-index: 1;
        pointer-events: none;
      }
      .hero-orb-1 { width: 500px; height: 500px; top: -100px; right: -100px; background: rgba(99,102,241,0.15); }
      .hero-orb-2 { width: 400px; height: 400px; bottom: 10%; left: -80px; background: rgba(76,64,230,0.1); }
      .hero-orb-3 { width: 300px; height: 300px; top: 40%; left: 50%; background: rgba(167,243,208,0.06); }

      .hero-content {
        position: relative; z-index: 2;
        max-width: 900px; width: 100%;
        display: flex; flex-direction: column; align-items: center;
      }

      .hero-badge {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 6px 20px;
        background: rgba(255,255,255,0.08);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 99px;
        font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.8);
        text-transform: uppercase; letter-spacing: 0.5px;
        margin-bottom: 28px;
      }
      .hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #a7f3d0; }

      .hero-headline {
        font-family: 'Manrope', sans-serif;
        font-size: 64px; font-weight: 800;
        line-height: 1.05; letter-spacing: -0.035em;
        color: #fff;
        margin-bottom: 24px;
      }
      .hero-headline-accent {
        background: linear-gradient(135deg, #c4befa 0%, #a78bfa 30%, #818cf8 60%, #6366f1 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text;
        font-style: italic;
      }

      .hero-subtext {
        font-size: 15px; color: rgba(255,255,255,0.55);
        line-height: 1.8; max-width: 520px;
        margin-bottom: 36px;
        font-weight: 400;
      }

      .hero-cta { display: flex; gap: 16px; margin-bottom: 64px; }

      /* ── HERO CARDS ROW ── */
      .hero-cards {
        position: relative;
        width: 100%; max-width: 1200px;
        margin-top: 60px;
        z-index: 2;
      }

      .fc-horizontal-row {
        display: flex;
        justify-content: center;
        align-items: stretch;
        gap: 32px;
        position: relative;
        z-index: 10;
        width: 100%;
      }

      .float-card {
        position: relative;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(226, 232, 240, 0.6);
        border-radius: 32px;
        padding: 28px;
        box-shadow: 
          0 20px 48px -12px rgba(15, 23, 42, 0.1),
          0 8px 20px -6px rgba(15, 23, 42, 0.05);
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        overflow: hidden;
      }

      .fc-icon-rounded {
        width: 44px; height: 44px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 24px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      }
      .icon-cyan { background: #06b6d4; color: #fff; }
      .icon-blue { background: #4c40e6; color: #fff; }
      .icon-magenta { background: #d946ef; color: #fff; }

      .fc-label-tr {
        position: absolute; top: 28px; right: 28px;
        font-size: 10px; font-weight: 800; color: #94a3b8; 
        text-transform: uppercase; letter-spacing: 0.1em;
      }

      .fc-value-large {
        font-family: 'Manrope', sans-serif; font-size: 32px; 
        font-weight: 800; color: #0f172a; letter-spacing: -0.02em;
      }
      .fc-value-xl {
        font-family: 'Manrope', sans-serif; font-size: 48px; 
        font-weight: 800; color: #0f172a; letter-spacing: -0.04em;
        line-height: 1; margin-bottom: 16px;
      }

      .fc-meta-pill {
        display: flex; align-items: center; gap: 6px;
        font-size: 11px; font-weight: 700; color: #10b981;
        margin-top: 8px;
      }

      .fc-footer-bar {
        position: absolute; bottom: 0; left: 0; right: 0;
        height: 6px; background: #4c40e6;
      }

      .fc-avatar-row { display: flex; align-items: center; margin-bottom: 24px; }
      .fc-avatar {
        width: 32px; height: 32px; border-radius: 50%;
        border: 2px solid #fff; overflow: hidden;
      }
      .fc-avatar img { width: 100%; height: 100%; object-fit: cover; }
      .fc-avatar-plus {
        width: 32px; height: 32px; border-radius: 50%;
        background: #f1f5f9; border: 2px solid #fff; margin-left: -10px;
        display: flex; align-items: center; justify-content: center;
        font-size: 9px; font-weight: 800; color: #4c40e6;
      }

      .fc-pill-btn {
        background: #f8faff; color: #4c40e6;
        padding: 12px 24px; border-radius: 100px;
        font-size: 12px; font-weight: 800; text-align: center;
        border: 1px solid rgba(76,64,230,0.1);
        cursor: pointer; transition: all 0.3s;
      }
      .fc-pill-btn:hover { background: #4c40e6; color: #fff; transform: translateY(-2px); }

      .fc-label-badge {
        position: absolute; top: 28px; right: 28px;
        background: rgba(226, 232, 240, 0.4);
        padding: 4px 10px; border-radius: 8px;
        font-size: 9px; font-weight: 800; color: #64748b;
        text-transform: uppercase;
      }

      .fc-chart-box {
        display: flex; align-items: flex-end; gap: 8px;
        height: 80px; margin: 24px 0;
      }
      .fc-chart-bar {
        flex: 1; background: #6366f1; border-radius: 6px 6px 2px 2px;
        transition: height 1s ease-out;
      }

      .fc-value-footer { display: flex; align-items: baseline; gap: 8px; }
      .fc-value-sm { font-size: 20px; font-weight: 800; color: #0f172a; }
      .fc-label-xs { font-size: 10px; font-weight: 700; color: #94a3b8; }

      .float-card-add-ref {
        position: absolute; bottom: 20px; right: 20px;
        width: 44px; height: 44px; border-radius: 50%;
        background: #4c40e6; color: #fff;
        display: flex; align-items: center; justify-content: center;
        font-size: 24px; font-weight: 600;
        box-shadow: 0 8px 24px rgba(76,64,230,0.3);
        cursor: pointer; transition: all 0.3s;
      }
      .float-card-add-ref:hover { transform: scale(1.1) rotate(90deg); }

      /* Positions for Horizontal Reference Layout */
      .fc-ref-left { width: 300px; z-index: 5; }
      .fc-ref-center { width: 340px; z-index: 10; }
      .fc-ref-right { width: 310px; z-index: 5; }

      .float-card-add {
        position: absolute; bottom: 20px; right: 20px;
        width: 36px; height: 36px; border-radius: 12px;
        background: linear-gradient(135deg, #4c40e6, #6366f1);
        color: #fff; display: flex; align-items: center; justify-content: center;
        font-size: 20px; font-weight: 700;
        box-shadow: 0 4px 16px rgba(76, 64, 230, 0.3);
        cursor: pointer; transition: all 0.3s;
      }
      .float-card-add:hover { transform: scale(1.1) rotate(90deg); }

      /* ── HERO GRID PATTERN ── */
      .hero-grid-pattern {
        position: absolute; inset: 0;
        background-image: radial-gradient(rgba(76,64,230,0.15) 1px, transparent 1px);
        background-size: 40px 40px;
        opacity: 0.4;
        z-index: 1;
        mask-image: radial-gradient(circle at center, black 0%, transparent 80%);
        -webkit-mask-image: radial-gradient(circle at center, black 0%, transparent 80%);
        animation: gridMove 20s linear infinite;
      }

      .hero-faded-grid {
        position: absolute; inset: 0;
        background-image: 
          linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
        background-size: 80px 80px;
        z-index: 1;
        mask-image: linear-gradient(to bottom, black 0%, transparent 80%);
        -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 80%);
        animation: gridFade 8s ease-in-out infinite;
      }

      /* ── HERO ATMOSPHERE (PARTICLES) ── */
      .hero-atmosphere {
        position: absolute; inset: 0;
        pointer-events: none; z-index: 2;
        overflow: hidden;
      }
      .hero-particle {
        position: absolute;
        width: 4px; height: 4px; border-radius: 50%;
        background: rgba(255,255,255,0.3);
        box-shadow: 0 0 10px rgba(255,255,255,0.2);
        animation: fadePulse 6s ease-in-out infinite;
      }

      .hero-particle:nth-child(1) { top: 15%; left: 10%; animation-delay: 0s; }
      .hero-particle:nth-child(2) { top: 40%; left: 85%; animation-delay: 1s; width: 6px; height: 6px; }
      .hero-particle:nth-child(3) { top: 75%; left: 20%; animation-delay: 2s; }
      .hero-particle:nth-child(4) { top: 20%; left: 70%; animation-delay: 3s; width: 3px; height: 3px; }
      .hero-particle:nth-child(5) { top: 60%; left: 15%; animation-delay: 1.5s; }
      .hero-particle:nth-child(6) { top: 10%; left: 45%; animation-delay: 4.5s; }
      .hero-particle:nth-child(7) { top: 85%; left: 60%; animation-delay: 0.5s; width: 5px; height: 5px; }
      .hero-particle:nth-child(8) { top: 30%; left: 25%; animation-delay: 2.5s; }
      .hero-particle:nth-child(9) { top: 50%; left: 50%; animation-delay: 5s; opacity: 0.4; }
      .hero-particle:nth-child(10) { top: 65%; left: 80%; animation-delay: 3.5s; }
      .hero-particle:nth-child(11) { top: 5%; left: 90%; animation-delay: 1.2s; width: 2px; height: 2px; }
      .hero-particle:nth-child(12) { top: 90%; left: 5%; animation-delay: 4s; }

      @keyframes gridMove {
        0% { background-position: 0 0; }
        100% { background-position: 40px 40px; }
      }

      .hero-orb-4 { width: 600px; height: 600px; bottom: -100px; right: 20%; background: rgba(76,64,230,0.05); }

      /* ── HERO SIDEBAR ── */
      .hero-sidebar {
        position: absolute; left: 40px; top: 50%; transform: translateY(-50%);
        width: 54px; padding: 20px 0;
        background: rgba(255,255,255,0.06);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 100px;
        display: flex; flex-direction: column; align-items: center; gap: 24px;
        z-index: 5;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      }
      .hsb-icon {
        width: 32px; height: 32px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: rgba(255,255,255,0.4); cursor: pointer;
        transition: all 0.3s;
      }
      .hsb-icon:hover { color: #fff; background: rgba(255,255,255,0.1); }
      .hsb-icon-active { color: #4c40e6 !important; background: #fff !important; box-shadow: 0 4px 12px rgba(255,255,255,0.3); }
      .hsb-divider { width: 20px; height: 1px; background: rgba(255,255,255,0.1); }

      /* ── HERO FLOATING ELEMENTS ── */
      .hero-float-notif {
        position: absolute; top: 120px; right: 15%;
        background: #fff; padding: 10px; border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        display: flex; align-items: center; justify-content: center;
        z-index: 5;
      }
      .hero-notif-badge {
        position: absolute; top: -5px; right: -5px;
        width: 16px; height: 16px; border-radius: 50%;
        background: #ef4444; color: #fff; font-size: 9px; font-weight: 800;
        display: flex; align-items: center; justify-content: center;
        border: 2px solid #fff;
      }

      .hero-float-pill {
        position: absolute; top: 140px; left: 20%;
        background: rgba(255,255,255,0.08);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 100px; padding: 6px 14px;
        display: flex; align-items: center; gap: 8px;
        color: #fff; font-size: 10px; font-weight: 700;
        z-index: 5;
      }
      .hfp-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; }

      .hero-float-tag {
        position: absolute;
        background: rgba(255,255,255,0.05);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px; padding: 6px 12px;
        color: rgba(255,255,255,0.5); font-size: 10px; font-weight: 800;
        z-index: 3;
      }
      .hero-float-tag-1 { top: 25%; left: 15%; }
      .hero-float-tag-2 { bottom: 30%; left: 25%; }
      .hero-float-tag-3 { top: 35%; right: 20%; }

      /* ── EXTRA FLOATING CARDS ── */
      .fc-client { left: 10%; bottom: -60px; width: 200px; z-index: 3; }
      .fc-month { right: 12%; bottom: -30px; width: 200px; z-index: 3; }

      /* ── MICRO ELEMENTS ── */
      .float-mini-shield {
        position: absolute; top: -30px; left: 100px;
        width: 40px; height: 40px; border-radius: 12px;
        background: #fff; box-shadow: 0 8px 20px rgba(0,0,0,0.06);
        display: flex; align-items: center; justify-content: center;
        font-size: 20px; z-index: 4;
      }
      .float-mini-spark {
        position: absolute; top: -10px; right: 40px;
        background: #fff; padding: 8px; border-radius: 10px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.06);
        z-index: 4;
      }
      .float-mini-avatars {
        position: absolute; bottom: -10px; left: 40px;
        background: rgba(15,23,42,0.8); backdrop-filter: blur(8px);
        padding: 6px 10px; border-radius: 20px;
        display: flex; align-items: center;
        z-index: 4;
      }
      .fma-dot {
        width: 16px; height: 16px; border-radius: 50%;
        border: 2px solid rgba(15,23,42,1);
      }

      /* ════════════════════════════════
         FEATURES SECTION
         ════════════════════════════════ */
      .features-section { padding: 120px 48px; max-width: 1100px; margin: 0 auto; }

      .section-center { text-align: center; margin-bottom: 64px; }
      .section-title {
        font-family: 'Manrope', sans-serif;
        font-size: 40px; font-weight: 800;
        color: #0f172a; letter-spacing: -0.03em;
        margin-bottom: 16px; line-height: 1.15;
      }
      .text-accent { color: #4c40e6; font-style: italic; }
      .section-desc { font-size: 14px; color: #94a3b8; line-height: 1.8; }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }

      .feature-card-glass {
        background: rgba(255,255,255,0.6);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(226,232,240,0.6);
        border-radius: 24px;
        padding: 32px 28px;
        transition: all 0.4s cubic-bezier(.4,0,.2,1);
        position: relative;
        overflow: hidden;
      }
      .feature-card-glass::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
      }
      .feature-card-glass:hover {
        transform: translateY(-6px);
        box-shadow: 0 24px 48px rgba(76,64,230,0.08);
        border-color: rgba(76,64,230,0.15);
      }

      .feature-icon-box {
        width: 48px; height: 48px;
        background: linear-gradient(135deg, #f0eeff, #e8e4ff);
        border: 1px solid rgba(76,64,230,0.08);
        border-radius: 14px;
        display: flex; align-items: center; justify-content: center;
        font-size: 20px; color: #4c40e6;
        margin-bottom: 20px;
      }

      .feature-title { font-family: 'Manrope', sans-serif; font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
      .feature-desc { font-size: 13px; color: #64748b; line-height: 1.7; margin-bottom: 16px; }

      /* ── MINI UI SHARED ── */
      .feat-mini-ui {
        background: rgba(248,250,255,0.8);
        border: 1px solid rgba(226,232,240,0.5);
        border-radius: 14px;
        padding: 14px;
        margin-top: 4px;
      }

      /* ── Smart Billing: Invoice rows ── */
      .feat-invoice-row {
        display: flex; justify-content: space-between; align-items: center;
        padding: 6px 0; font-size: 12px; color: #64748b;
        border-bottom: 1px solid rgba(226,232,240,0.4);
      }
      .feat-invoice-row:last-of-type { border-bottom: none; }
      .feat-amount { font-weight: 700; color: #0f172a; font-size: 12px; }
      .feat-total-row { border-top: 1px dashed rgba(76,64,230,0.2); padding-top: 8px; margin-top: 4px; }
      .feat-total-val { color: #4c40e6 !important; font-size: 13px !important; }
      .feat-tds-strip {
        display: flex; justify-content: space-between;
        font-size: 11px; color: #94a3b8; padding: 4px 0;
        border-top: 1px dotted rgba(226,232,240,0.5);
      }
      .feat-net-row {
        display: flex; justify-content: space-between;
        font-size: 12px; font-weight: 800; color: #10b981;
        padding-top: 6px; border-top: 1px solid rgba(16,185,129,0.15);
      }

      /* ── Client Management: client list ── */
      .feat-client-row {
        display: flex; align-items: center; gap: 10px;
        padding: 8px 0;
        border-bottom: 1px solid rgba(226,232,240,0.3);
      }
      .feat-client-row:last-of-type { border-bottom: none; }
      .feat-client-avatar {
        width: 28px; height: 28px; border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        color: #fff; font-weight: 800; font-size: 12px; flex-shrink: 0;
      }
      .feat-client-name { font-size: 12px; font-weight: 700; color: #0f172a; }
      .feat-client-meta { font-size: 10px; color: #94a3b8; }
      .feat-client-badge {
        width: 22px; height: 22px; border-radius: 6px;
        background: rgba(76,64,230,0.08); color: #4c40e6;
        font-size: 10px; font-weight: 800;
        display: flex; align-items: center; justify-content: center;
      }
      .feat-add-client {
        display: flex; align-items: center; justify-content: center; gap: 6px;
        margin-top: 8px; padding: 8px;
        border: 1px dashed rgba(76,64,230,0.2); border-radius: 10px;
        color: #4c40e6; cursor: pointer;
        transition: all 0.2s;
      }
      .feat-add-client:hover { background: rgba(76,64,230,0.04); }

      /* ── Security: shield + compliance ── */
      .feat-shield-row {
        display: flex; align-items: center; gap: 10px;
        padding-bottom: 10px; margin-bottom: 10px;
        border-bottom: 1px solid rgba(226,232,240,0.4);
      }
      .feat-shield { font-size: 24px; }
      .feat-status-dot { width: 8px; height: 8px; border-radius: 50%; margin-left: auto; }
      .feat-status-green { background: #10b981; box-shadow: 0 0 8px rgba(16,185,129,0.5); animation: pulseGlow 2s infinite; }
      @keyframes pulseGreen { 0%,100% { box-shadow: 0 0 6px rgba(16,185,129,0.3); } 50% { box-shadow: 0 0 14px rgba(16,185,129,0.6); } }
      .feat-compliance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px; }
      .feat-compliance-badge {
        display: flex; align-items: center; gap: 6px;
        padding: 6px 10px; border-radius: 8px;
        background: rgba(16,185,129,0.06); font-size: 11px; font-weight: 700; color: #0f172a;
      }
      .feat-check {
        width: 16px; height: 16px; border-radius: 4px;
        background: #10b981; color: #fff; font-size: 9px; font-weight: 800;
        display: flex; align-items: center; justify-content: center;
      }
      .feat-progress-row { display: flex; align-items: center; gap: 8px; }
      .feat-progress-bar { flex: 1; height: 4px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
      .feat-progress-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }

      /* ── Instant Settlement: timeline ── */
      .feat-timeline-item {
        display: flex; align-items: center; gap: 10px;
        padding: 8px 0;
        border-bottom: 1px solid rgba(226,232,240,0.3);
      }
      .feat-timeline-item:last-of-type { border-bottom: none; }
      .feat-tl-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
      .feat-live-pulse {
        display: flex; align-items: center; gap: 6px;
        margin-top: 8px; padding-top: 8px;
        border-top: 1px dashed rgba(16,185,129,0.2);
      }
      .feat-live-dot {
        width: 6px; height: 6px; border-radius: 50%; background: #10b981;
        animation: featPulse 1.5s infinite;
      }
      @keyframes featPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }

      /* ── Predictive Flux: bar chart ── */
      .feat-trend-up { font-size: 12px; font-weight: 700; color: #10b981; }
      .feat-bar-chart {
        display: flex; align-items: flex-end; gap: 3px; height: 60px;
      }
      .feat-bar {
        flex: 1; border-radius: 3px 3px 0 0;
        transition: height 0.6s cubic-bezier(.4,0,.2,1);
      }
      .feat-forecast-strip {
        display: flex; justify-content: space-between; align-items: center;
        margin-top: 8px; padding-top: 6px;
        border-top: 1px dashed rgba(76,64,230,0.15);
      }

      /* ── Instant PDF: document preview ── */
      .feat-pdf-preview {
        background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
        padding: 12px; margin-bottom: 10px;
        position: relative; overflow: hidden;
      }
      .feat-scan-line {
        position: absolute; left: 0; right: 0; height: 30%;
        background: linear-gradient(180deg, transparent, rgba(76,64,230,0.08), transparent);
        z-index: 2;
        pointer-events: none;
        animation: pdfScan 4s infinite ease-in-out;
      }
      .feat-pdf-header {
        display: flex; justify-content: space-between; align-items: flex-start;
        margin-bottom: 10px;
      }
      .feat-pdf-lines { display: flex; flex-direction: column; gap: 4px; }
      .feat-pdf-logo-box { width: 20px; height: 20px; border-radius: 4px; background: #e2e8f0; }
      .feat-pdf-table { display: flex; flex-direction: column; gap: 4px; }
      .feat-pdf-table-row {
        display: flex; justify-content: space-between; align-items: center;
        padding: 3px 0;
      }
      .feat-pdf-table-head { border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
      .feat-pdf-actions { display: flex; gap: 6px; }
      .feat-pdf-btn {
        flex: 1; padding: 6px 8px; border-radius: 8px;
        background: rgba(76,64,230,0.06); color: #4c40e6;
        font-size: 10px; font-weight: 700; text-align: center;
        cursor: pointer; transition: all 0.2s;
      }
      .feat-pdf-btn:hover { background: rgba(76,64,230,0.12); }
      .feat-pdf-btn-alt { background: rgba(16,185,129,0.06); color: #10b981; }
      .feat-pdf-btn-alt:hover { background: rgba(16,185,129,0.12); }

      /* ════════════════════════════════
         HOW IT WORKS
         ════════════════════════════════ */
      .how-section { padding: 120px 48px; background: linear-gradient(180deg, #f8faff, #f1f5f9); }
      .how-grid { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; position: relative; }
      .how-line { position: absolute; top: 44px; left: 12.5%; right: 12.5%; height: 2px; background: linear-gradient(90deg, rgba(76,64,230,0.05), rgba(76,64,230,0.2), rgba(76,64,230,0.05)); z-index: 0; }

      .step-card { text-align: center; position: relative; z-index: 1; }
      .step-icon-box {
        width: 80px; height: 80px; border-radius: 24px;
        background: rgba(255,255,255,0.8);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(226,232,240,0.6);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 16px; font-size: 28px;
        box-shadow: 0 4px 20px rgba(76,64,230,0.06);
        transition: all 0.3s;
      }
      .step-card:hover .step-icon-box { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(76,64,230,0.1); }
      .step-num { font-size: 11px; font-weight: 800; color: #4c40e6; letter-spacing: 2px; margin-bottom: 8px; }
      .step-title { font-family: 'Manrope', sans-serif; font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
      .step-desc { font-size: 12px; color: #64748b; line-height: 1.6; padding: 0 8px; }

      /* ════════════════════════════════
         STATS BAR
         ════════════════════════════════ */
      .stats-bar { padding: 60px 48px; border-top: 1px solid #e2e8f0; background: #fff; }
      .stats-grid { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
      .stat-item { }
      .stat-value { font-family: 'Manrope', sans-serif; font-size: 32px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
      .stat-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

      /* ════════════════════════════════
         FOOTER
         ════════════════════════════════ */
      .landing-footer { padding: 48px 48px 32px; border-top: 1px solid #e2e8f0; }
      .footer-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
      .footer-copy { max-width: 1100px; margin: 0 auto; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.6; }

      /* ════════════════════════════════
         RESPONSIVE
         ════════════════════════════════ */
      @media (max-width: 900px) {
        .hero-headline { font-size: 40px !important; }
        .hero-cards { display: none; }
        .features-grid { grid-template-columns: 1fr !important; }
        .how-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .how-line { display: none; }
        .stats-grid { flex-direction: column; gap: 32px; text-align: center; }
        .landing-nav { padding: 12px 20px !important; }
        .hero-section { padding: 120px 20px 60px !important; }
        .features-section, .how-section, .stats-bar { padding-left: 20px !important; padding-right: 20px !important; }
        .section-title { font-size: 28px !important; }
        .footer-inner { flex-direction: column; gap: 20px; }
      }
      @media (max-width: 600px) {
        .hero-headline { font-size: 32px !important; }
        .hero-subtext { font-size: 13px !important; }
        .hero-cta { flex-direction: column; align-items: center; }
        .how-grid { grid-template-columns: 1fr !important; }
        .landing-nav > div:first-child + div a:not(.liquid-btn-primary) { display: none; }
      }
    `}</style>
  );
}
