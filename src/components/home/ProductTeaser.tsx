'use client'

import Link from 'next/link'
import { ShoppingBag, ArrowRight, Star } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const products = [
  {
    id: '1',
    slug: 'samsonite-cabin-trolley',
    title: 'Samsonite Cabin Trolley',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    price: 28000,
    salePrice: 22000,
    rating: 4.7,
    category: 'Luggage & Bags',
  },
  {
    id: '2',
    slug: 'trekking-backpack-65l',
    title: '65L Trekking Backpack',
    image: 'https://images.unsplash.com/photo-1622260614927-904f83f7a26f?w=400&q=80',
    price: 12000,
    salePrice: 9500,
    rating: 4.5,
    category: 'Travel Gear',
  },
  {
    id: '3',
    slug: 'travel-neck-pillow',
    title: 'Memory Foam Neck Pillow',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
    price: 3500,
    salePrice: 2800,
    rating: 4.4,
    category: 'Accessories',
  },
]

export default function ProductTeaser() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="label"><ShoppingBag size={13} style={{ display: 'inline' }} /> Travel Store</span>
            <h2 className="section-title">Gear Up for Your Trip</h2>
            <p className="section-subtitle">Quality travel products from verified sellers</p>
          </div>
          <Link href="/products" className="btn btn--secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Shop All <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {products.map(p => (
            <Link key={p.id} href={`/products/${p.slug}`} className="card" style={{ display: 'block', textDecoration: 'none' }}>
              <div style={{ height: '200px', overflow: 'hidden', background: 'var(--color-bg-subtle)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px' }}>
                <p style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '4px' }}>{p.category}</p>
                <p style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--color-text)', fontSize: '15px' }}>{p.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                  <Star size={13} fill="#FBBF24" color="#FBBF24" />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{p.rating}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span className="price" style={{ fontSize: '17px', color: 'var(--color-primary)' }}>{formatCurrency(p.salePrice)}</span>
                    <span className="price__old">{formatCurrency(p.price)}</span>
                  </div>
                  <span className="btn btn--secondary btn--sm">Add to Cart</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
