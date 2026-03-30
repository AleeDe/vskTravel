export const metadata = { title: 'Refund Policy - VSK Travel' }

export default function RefundPolicyPage() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '32px' }}>Refund Policy</h1>
      <div className="card" style={{ padding: '32px', lineHeight: 1.8 }}>
        <h2 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '16px' }}>General Refund Policy</h2>
        <p>We offer refunds for cancellations made in accordance with the service provider's cancellation policy. Refunds are processed within 7-10 business days.</p>

        <h2 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '16px' }}>Service Cancellations</h2>
        <p>Services (flights, hotels, tours) can be cancelled based on the provider's policy. Some services may have non-refundable components.</p>

        <h2 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '16px' }}>Product Returns</h2>
        <p>Products can be returned within 14 days of delivery for a full refund, provided they are in original condition.</p>

        <h2 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '16px' }}>No-Show Policy</h2>
        <p>If you don't show up for a service, you forfeit your payment. No refund will be issued for no-shows.</p>

        <h2 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '16px' }}>How to Request a Refund</h2>
        <p>Contact our support team at support@vsktravel.pk within 30 days of your booking with proof of cancellation.</p>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '32px' }}>
          Last updated: March 2026
        </p>
      </div>
    </div>
  )
}
