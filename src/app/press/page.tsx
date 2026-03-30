export const metadata = { title: 'Press - VSK Travel' }

export default function PressPage() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '32px' }}>Press & Media</h1>

      <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>About VSK Travel</h2>
        <p style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
          VSK Travel is Pakistan's leading travel marketplace, revolutionizing how millions of Pakistanis book flights, hotels, tour packages, and travel services. Founded in 2024, we connect travelers with trusted partners across the country.
        </p>
      </div>

      <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Key Milestones</h2>
        <ul style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)', paddingLeft: '20px' }}>
          <li>🚀 Launched in 2024</li>
          <li>✈️ 10M+ users</li>
          <li>🏆 10K+ verified partners</li>
          <li>🌍 Available across Pakistan</li>
        </ul>
      </div>

      <div className="card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Contact Media Team</h2>
        <p style={{ marginBottom: '12px' }}>For press inquiries, interview requests, or media kits:</p>
        <p>
          📧 <a href="mailto:press@vsktravel.pk" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>press@vsktravel.pk</a>
        </p>
      </div>
    </div>
  )
}
