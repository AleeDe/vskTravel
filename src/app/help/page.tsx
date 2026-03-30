export const metadata = { title: 'Help Center - VSK Travel' }

export default function HelpPage() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '32px' }}>Help Center</h1>

      <div style={{ display: 'grid', gap: '24px', marginBottom: '40px' }}>
        {[
          { title: 'How to Book a Flight?', desc: 'Search destinations, compare prices, and complete checkout.' },
          { title: 'How to Cancel My Booking?', desc: 'Go to My Orders → Select booking → Click Cancel → Follow refund policy.' },
          { title: 'Is My Payment Secure?', desc: 'Yes! We use encrypted Stripe for all payment processing.' },
          { title: 'How Long for Refund?', desc: 'Refunds process within 7-10 business days after cancellation.' },
          { title: 'Can I Modify My Booking?', desc: 'Yes, modify at least 24 hours before service date.' },
          { title: 'What if I Lose Confirmation?', desc: 'Check your email or visit My Orders → View confirmation.' },
        ].map((faq) => (
          <div key={faq.title} className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{faq.title}</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{faq.desc}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '32px', background: 'var(--color-primary-50)' }}>
        <h2 style={{ marginBottom: '16px' }}>Still Need Help?</h2>
        <p style={{ marginBottom: '16px' }}>Contact our support team:</p>
        <p>📧 <a href="mailto:support@vsktravel.pk" style={{ color: 'var(--color-primary)' }}>support@vsktravel.pk</a></p>
        <p>📱 <a href="tel:+92300123456" style={{ color: 'var(--color-primary)' }}>+92 300 123456</a></p>
      </div>
    </div>
  )
}
