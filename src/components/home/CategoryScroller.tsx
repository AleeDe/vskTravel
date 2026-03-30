import Link from 'next/link'
import { Plane, Hotel, Map, Globe, Car, Shield } from 'lucide-react'

const categories = [
  { label: 'Flights', slug: 'flights', icon: <Plane size={28} />, color: '#0066FF', bg: '#EBF2FF', count: '200+ routes' },
  { label: 'Hotels', slug: 'hotels', icon: <Hotel size={28} />, color: '#10B981', bg: '#D1FAE5', count: '500+ hotels' },
  { label: 'Tour Packages', slug: 'tour-packages', icon: <Map size={28} />, color: '#F59E0B', bg: '#FEF3C7', count: '120+ packages' },
  { label: 'Visa Assistance', slug: 'visa-assistance', icon: <Globe size={28} />, color: '#8B5CF6', bg: '#EDE9FE', count: '50+ countries' },
  { label: 'Car Rentals', slug: 'car-rentals', icon: <Car size={28} />, color: '#EF4444', bg: '#FEE2E2', count: '80+ vehicles' },
  { label: 'Travel Insurance', slug: 'travel-insurance', icon: <Shield size={28} />, color: '#06B6D4', bg: '#CFFAFE', count: '10+ plans' },
]

export default function CategoryScroller() {
  return (
    <section className="section section--sm">
      <div className="container">
        <div className="section-header--center" style={{ marginBottom: '32px' }}>
          <span className="label">Browse by Category</span>
          <h2 className="section-title">What are you looking for?</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
        }}>
          {categories.map(cat => (
            <Link
              key={cat.slug}
              href={`/services?category=${cat.slug}`}
              className="card"
              style={{
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-lg)',
                background: cat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: cat.color,
              }}>
                {cat.icon}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-text)', marginBottom: '2px' }}>{cat.label}</p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
