'use client'

import { useState } from 'react'
import { Star, ShoppingCart, Heart, Share2, Check, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'

const PRODUCT = {
  id: '1',
  slug: 'samsonite-cabin-trolley',
  title: 'Samsonite Cabin Trolley 55cm',
  category: 'Luggage & Bags',
  description: 'The perfect carry-on companion for frequent travelers. Lightweight polycarbonate shell with 4-wheel spinner system for effortless maneuverability. TSA-approved lock included.',
  price: 22000,
  originalPrice: 28000,
  rating: 4.7,
  reviews: 89,
  stock: 15,
  images: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    'https://images.unsplash.com/photo-1581553673739-c4906b5d0de8?w=800&q=80',
  ],
  variants: [
    { id: 'black', label: 'Midnight Black', available: true },
    { id: 'navy', label: 'Navy Blue', available: true },
    { id: 'rose', label: 'Rose Gold', available: false },
  ],
  features: ['Polycarbonate hardshell', '4-wheel spinner system', 'TSA-approved lock', 'Expandable design', 'Interior organizer pockets', '55cm cabin-approved size'],
}

export default function ProductDetailPage() {
  const { addItem } = useCartStore()
  const [activeImage, setActiveImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(PRODUCT.variants[0].id)
  const [quantity, setQuantity] = useState(1)

  const product = PRODUCT

  function handleAddToCart() {
    addItem({
      id: `${product.id}-${selectedVariant}`,
      type: 'product',
      title: product.title,
      image: product.images[0],
      price: product.price,
      quantity,
      variant: PRODUCT.variants.find(v => v.id === selectedVariant)?.label,
    })
    toast.success('Added to cart!')
  }

  const discount = Math.round((1 - product.price / product.originalPrice) * 100)

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
        {/* Images */}
        <div>
          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: '420px', marginBottom: '12px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.images[activeImage]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)} style={{ width: '72px', height: '72px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: i === activeImage ? '2px solid var(--color-primary)' : '2px solid transparent', cursor: 'pointer' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '8px' }}>{product.category}</p>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', marginBottom: '12px' }}>{product.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <div className="stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill={i < Math.floor(product.rating) ? '#FBBF24' : 'none'} color="#FBBF24" />)}</div>
            <span style={{ fontWeight: 600 }}>{product.rating}</span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>({product.reviews} reviews)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
            <span className="price" style={{ fontSize: '32px', color: 'var(--color-primary)' }}>{formatCurrency(product.price)}</span>
            <span className="price__old">{formatCurrency(product.originalPrice)}</span>
            <span style={{ background: 'var(--color-error-light)', color: 'var(--color-error)', padding: '3px 10px', borderRadius: '9999px', fontSize: '13px', fontWeight: 700 }}>{discount}% OFF</span>
          </div>

          <p style={{ marginBottom: '24px', lineHeight: 1.8 }}>{product.description}</p>

          {/* Variants */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Color: <span style={{ fontWeight: 400 }}>{PRODUCT.variants.find(v => v.id === selectedVariant)?.label}</span></p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {product.variants.map(v => (
                <button
                  key={v.id}
                  onClick={() => v.available && setSelectedVariant(v.id)}
                  disabled={!v.available}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: selectedVariant === v.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    color: !v.available ? 'var(--color-text-muted)' : selectedVariant === v.id ? 'var(--color-primary)' : 'var(--color-text)',
                    background: selectedVariant === v.id ? 'var(--color-primary-50)' : 'white',
                    cursor: v.available ? 'pointer' : 'not-allowed',
                    opacity: v.available ? 1 : 0.5,
                    textDecoration: v.available ? 'none' : 'line-through',
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Quantity</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="btn btn--secondary btn--icon"><Minus size={14} /></button>
              <span style={{ fontSize: '18px', fontWeight: 700, minWidth: '32px', textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="btn btn--secondary btn--icon"><Plus size={14} /></button>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{product.stock} in stock</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <button onClick={handleAddToCart} className="btn btn--primary btn--lg" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button className="btn btn--secondary btn--icon btn--lg" aria-label="Save"><Heart size={18} /></button>
            <button className="btn btn--secondary btn--icon btn--lg" aria-label="Share"><Share2 size={18} /></button>
          </div>

          {/* Features */}
          <div className="card" style={{ padding: '16px' }}>
            <p style={{ fontWeight: 600, marginBottom: '12px', fontSize: '14px' }}>Key Features</p>
            <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {product.features.map((f, i) => (
                <li key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  <Check size={14} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />{f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
