export const metadata = { title: 'Terms & Conditions - VSK Travel' }

export default function TermsPage() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '32px' }}>Terms & Conditions</h1>
      <div className="card" style={{ padding: '32px', lineHeight: 1.8 }}>
        <h2 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '16px' }}>1. Agreement to Terms</h2>
        <p>By using VSK Travel, you agree to these terms and conditions. If you don't agree, please don't use our service.</p>

        <h2 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '16px' }}>2. User Responsibilities</h2>
        <p>You are responsible for maintaining confidentiality of your account and for all activities under your account.</p>

        <h2 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '16px' }}>3. Booking Policies</h2>
        <p>All bookings are subject to service provider availability and confirmation. Cancellations must follow the stated policy.</p>

        <h2 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '16px' }}>4. Limitation of Liability</h2>
        <p>VSK Travel is not liable for any indirect, incidental, or consequential damages arising from your use of our service.</p>

        <h2 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '16px' }}>5. Changes to Terms</h2>
        <p>We reserve the right to modify these terms. Continued use constitutes acceptance of changes.</p>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '32px' }}>
          Last updated: March 2026
        </p>
      </div>
    </div>
  )
}
