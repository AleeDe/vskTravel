'use client'

import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'

const FEATURED_DEALS = [
  {
    id: '1',
    title: 'Hunza Valley 5-Day Tour',
    category: 'Tour Packages',
    originalPrice: 50000,
    dealPrice: 35000,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&q=80',
    partner: 'Ali Travel Agency',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Swat Honeymoon Package',
    category: 'Tour Packages',
    originalPrice: 65000,
    dealPrice: 48000,
    discount: 26,
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&q=80',
    partner: 'Northern Trails',
    rating: 4.7,
  },
  {
    id: '3',
    title: 'K2 Base Camp Trek',
    category: 'Adventure',
    originalPrice: 90000,
    dealPrice: 72000,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80',
    partner: 'Peak Adventures',
    rating: 4.9,
  },
  {
    id: '4',
    title: 'Samsonite Cabin Trolley',
    category: 'Luggage',
    originalPrice: 28000,
    dealPrice: 22000,
    discount: 21,
    image: 'https://images.unsplash.com/photo-1622260614927-904f83f7a26f?w=500&q=80',
    partner: 'Travel Gear PK',
    rating: 4.6,
  },
  {
    id: '5',
    title: 'Trekking Backpack 65L',
    category: 'Gear',
    originalPrice: 15000,
    dealPrice: 9500,
    discount: 37,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    partner: 'Adventure Gear Co',
    rating: 4.5,
  },
  {
    id: '6',
    title: 'UAE Tourist Visa Service',
    category: 'Visa',
    originalPrice: 12000,
    dealPrice: 8000,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=500&q=80',
    partner: 'Sky Visa Services',
    rating: 4.8,
  },
]

export default function DealsPage() {
  const { addItem } = useCartStore()
  const [favorites, setFavorites] = useState<string[]>([])

  function toggleFavorite(id: string) {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  function handleAddToCart(deal: typeof FEATURED_DEALS[0]) {
    addItem({
      id: deal.id,
      type: 'service',
      title: deal.title,
      price: deal.dealPrice,
      quantity: 1,
      image: deal.image,
    })
  }

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container">
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '12px' }}>
            🎉 Exclusive Deals
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }}>
            Limited time offers on tours, services, and travel gear
          </p>
        </div>

        {/* Filter/Sort */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button className="btn btn--primary" style={{ fontSize: '14px' }}>
            All Deals
          </button>
          <button className="btn btn--secondary" style={{ fontSize: '14px' }}>
            Tours
          </button>
          <button className="btn btn--secondary" style={{ fontSize: '14px' }}>
            Services
          </button>
          <button className="btn btn--secondary" style={{ fontSize: '14px' }}>
            Gear
          </button>
        </div>

        {/* Deals Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {FEATURED_DEALS.map(deal => (
            <div key={deal.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Image */}
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden', background: 'var(--color-bg-subtle)' }}>
                <img
                  src={deal.image}
                  alt={deal.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Discount Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'var(--color-error)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: 700,
                }}>
                  -{deal.discount}%
                </div>
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(deal.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <Heart
                    size={18}
                    fill={favorites.includes(deal.id) ? 'var(--color-error)' : 'none'}
                    color={favorites.includes(deal.id) ? 'var(--color-error)' : 'var(--color-text-muted)'}
                  />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600 }}>
                  {deal.category}
                </p>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', minHeight: '48px' }}>
                  {deal.title}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                  {deal.partner} • ⭐ {deal.rating}
                </p>

                {/* Price */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {formatCurrency(deal.dealPrice)}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                      {formatCurrency(deal.originalPrice)}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(deal)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: 'auto',
                  }}
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
