export const metadata = { title: 'Privacy Policy - VSK Travel' }

export default function PrivacyPage() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '32px' }}>Privacy Policy</h1>
      <div className="card" style={{ padding: '32px', lineHeight: 1.8 }}>
        <h2 style={{ fontSize: '18px', marginTop: '28px', marginBottom: '16px' }}>1. Information We Collect</h2>
        <p>We collect information you provide directly (name, email, phone, payment details) and automatically (usage data, cookies, IP address).</p>

        <h2 style={{ fontSize: '18px', marginTop: '28px', marginBottom: '16px' }}>2. How We Use Information</h2>
        <p>We use information to process bookings, send confirmations, improve services, and comply with legal obligations.</p>

        <h2 style={{ fontSize: '18px', marginTop: '28px', marginBottom: '16px' }}>3. Data Security</h2>
        <p>Your data is encrypted and stored securely. We use industry-standard security measures to protect your information.</p>

        <h2 style={{ fontSize: '18px', marginTop: '28px', marginBottom: '16px' }}>4. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal data. Contact us at support@vsktravel.pk to exercise these rights.</p>

        <h2 style={{ fontSize: '18px', marginTop: '28px', marginBottom: '16px' }}>5. Contact Us</h2>
        <p>For privacy questions, email: privacy@vsktravel.pk</p>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '32px' }}>
          Last updated: March 2026
        </p>
      </div>
    </div>
  )
}
