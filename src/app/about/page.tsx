export const metadata = {
  title: 'About VSK Travel',
  description: 'Learn about VSK Travel, Pakistan\'s leading travel marketplace.',
}

export default function AboutPage() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '24px' }}>About VSK Travel</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            VSK Travel is Pakistan's premier travel marketplace, connecting millions of travelers with trusted service providers and products. Founded in 2024, we revolutionized how Pakistanis plan and book their travel.
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
            Our mission: Make travel accessible, affordable, and stress-free for every Pakistani family.
          </p>
        </div>
        <div style={{ background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '12px' }}>10M+</div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Happy Travelers</p>
        </div>
      </div>

      <div id="why-us" style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>Why Choose VSK Travel?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {[
            { title: '✈️ Widest Selection', desc: 'Flights, hotels, tours, visa services & travel gear' },
            { title: '💰 Best Prices', desc: 'Compare & save with our competitive pricing' },
            { title: '🛡️ Secure Booking', desc: 'End-to-end encryption & buyer protection' },
            { title: '📱 Easy to Use', desc: 'Seamless mobile & web experience' },
            { title: '🚀 Fast Support', desc: '24/7 customer support in Urdu & English' },
            { title: '🤝 Trusted Partners', desc: 'Verified service providers across Pakistan' },
          ].map((item) => (
            <div key={item.title} className="card" style={{ padding: '24px' }}>
              <h3 style={{ marginBottom: '12px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--color-primary)', color: 'white', padding: '60px 40px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>Ready to Start Your Journey?</h2>
        <p style={{ marginBottom: '24px', opacity: 0.9 }}>Explore thousands of travel options today</p>
        <a href="/services" style={{
          display: 'inline-block',
          padding: '12px 28px',
          background: 'white',
          color: 'var(--color-primary)',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          textDecoration: 'none',
        }}>
          Explore Services
        </a>
      </div>
    </div>
  )
}
