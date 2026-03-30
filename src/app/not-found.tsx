import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
      padding: '20px',
    }}>
      <div style={{ textAlign: 'center', color: 'white', maxWidth: '500px' }}>
        <div style={{ fontSize: '100px', fontWeight: 800, lineHeight: 1, marginBottom: '16px' }}>
          404
        </div>
        <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Page Not Found</h1>
        <p style={{ fontSize: '16px', marginBottom: '32px', opacity: 0.9 }}>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            padding: '12px 24px',
            background: 'white',
            color: 'var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'transform 0.2s',
          }}>
            Back to Home
          </Link>
          <Link href="/services" style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-block',
            border: '1px solid white',
          }}>
            Browse Services
          </Link>
        </div>

        <p style={{ fontSize: '13px', marginTop: '32px', opacity: 0.7 }}>
          Contact support@vsktravel.pk if you think this is a mistake
        </p>
      </div>
    </div>
  )
}
