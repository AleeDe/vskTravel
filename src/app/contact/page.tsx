export const metadata = {
  title: 'Contact Us - VSK Travel',
  description: 'Get in touch with VSK Travel support team.',
}

export default function ContactPage() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px', maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '12px' }}>Contact Us</h1>
      <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginBottom: '40px' }}>
        We'd love to hear from you. Get in touch with our team.
      </p>

      <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>📧 Email</h3>
          <a href="mailto:support@vsktravel.pk" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
            support@vsktravel.pk
          </a>
        </div>
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>📱 Phone</h3>
          <a href="tel:+92300123456" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
            +92 300 123456
          </a>
        </div>
        <div>
          <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>⏰ Support Hours</h3>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            Monday - Sunday: 9 AM to 11 PM (PKT)
          </p>
        </div>
      </div>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '14px' }}>Name</label>
          <input type="text" placeholder="Your name" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '14px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '14px' }}>Email</label>
          <input type="email" placeholder="your@email.com" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '14px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '14px' }}>Message</label>
          <textarea placeholder="Your message..." rows={5} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontFamily: 'inherit' }} />
        </div>
        <button className="btn btn--primary" style={{ marginTop: '12px' }}>Send Message</button>
      </form>
    </div>
  )
}
