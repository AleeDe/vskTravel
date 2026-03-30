'use client'

import Link from 'next/link'
import { MapPin, Star, Clock, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Placeholder deals — will be replaced with Supabase data in Phase 6
const deals = [
  {
    id: '1',
    slug: 'hunza-valley-5day-tour',
    title: 'Hunza Valley 5-Day Tour',
    category: 'Tour Packages',
    location: 'Hunza, Gilgit-Baltistan',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
    price: 45000,
    salePrice: 35000,
    rating: 4.8,
    reviews: 124,
    duration: '5 Days / 4 Nights',
    badge: 'Hot Deal',
  },
  {
    id: '2',
    slug: 'swat-valley-honeymoon',
    title: 'Swat Valley Honeymoon Package',
    category: 'Tour Packages',
    location: 'Swat, KPK',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    price: 60000,
    salePrice: 48000,
    rating: 4.9,
    reviews: 87,
    duration: '6 Days / 5 Nights',
    badge: 'Trending',
  },
  {
    id: '3',
    slug: 'skardu-k2-base-camp',
    title: 'Skardu & K2 Base Camp Trek',
    category: 'Tour Packages',
    location: 'Skardu, Gilgit-Baltistan',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    price: 85000,
    salePrice: 72000,
    rating: 4.7,
    reviews: 56,
    duration: '10 Days / 9 Nights',
    badge: 'Adventure',
  },
  {
    id: '4',
    slug: 'lahore-city-explorer',
    title: 'Lahore Heritage City Explorer',
    category: 'Tour Packages',
    location: 'Lahore, Punjab',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
    price: 25000,
    salePrice: 18000,
    rating: 4.6,
    reviews: 203,
    duration: '3 Days / 2 Nights',
    badge: 'Best Value',
  },
]

const badgeColors: Record<string, { bg: string; color: string }> = {
  'Hot Deal': { bg: '#FEE2E2', color: '#EF4444' },
  'Trending': { bg: '#EDE9FE', color: '#8B5CF6' },
  'Adventure': { bg: '#D1FAE5', color: '#10B981' },
  'Best Value': { bg: '#FEF3C7', color: '#F59E0B' },
}

export default function FeaturedDeals() {
  return (
    <section className="section" style={{ background: 'var(--color-bg-subtle)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="label">Limited Time Offers</span>
            <h2 className="section-title">Featured Deals</h2>
            <p className="section-subtitle">Handpicked packages at unbeatable prices</p>
          </div>
          <Link href="/services" className="btn btn--secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {deals.map(deal => (
            <Link key={deal.id} href={`/services/${deal.slug}`} className="card" style={{ display: 'block', textDecoration: 'none' }}>
              {/* Image */}
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={deal.image}
                  alt={deal.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-slow)' }}
                  onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)' }}
                  onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)' }}
                />
                {/* Badge */}
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: badgeColors[deal.badge]?.bg,
                  color: badgeColors[deal.badge]?.color,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                }}>
                  {deal.badge}
                </span>
                {/* Discount */}
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'var(--color-error)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                }}>
                  {Math.round((1 - deal.salePrice / deal.price) * 100)}% OFF
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: '16px' }}>
                <p style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '4px' }}>{deal.category}</p>
                <h3 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--color-text)' }}>{deal.title}</h3>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    <MapPin size={13} /> {deal.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    <Clock size={13} /> {deal.duration}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <span className="stars" style={{ fontSize: '13px' }}>★</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{deal.rating}</span>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>({deal.reviews} reviews)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span className="price--lg price" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>
                      {formatCurrency(deal.salePrice)}
                    </span>
                    <span className="price__old">{formatCurrency(deal.price)}</span>
                  </div>
                  <span className="btn btn--primary btn--sm">Book Now</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
