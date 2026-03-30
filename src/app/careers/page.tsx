export const metadata = { title: 'Careers - VSK Travel' }

export default function CareersPage() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
      <h1 style={{ marginBottom: '32px' }}>Join Our Team</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '16px', lineHeight: 1.8, marginBottom: '16px', color: 'var(--color-text-secondary)' }}>
            We're building the future of travel in Pakistan. Join us and help millions of travelers discover amazing experiences.
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
            We're looking for talented engineers, designers, and travel enthusiasts to grow with us.
          </p>
        </div>
        <div className="card" style={{ padding: '32px', background: 'var(--color-bg-subtle)' }}>
          <h3 style={{ marginBottom: '16px' }}>Open Positions</h3>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Coming soon! Check back later for job openings.</p>
          <a href="mailto:careers@vsktravel.pk" style={{
            display: 'inline-block',
            padding: '10px 16px',
            background: 'var(--color-primary)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
          }}>
            Email Us
          </a>
        </div>
      </div>
    </div>
  )
}
