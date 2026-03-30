'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, SlidersHorizontal, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { SORT_OPTIONS } from '@/lib/constants'

const ALL_PRODUCTS = [
  { id: '1', slug: 'samsonite-cabin-trolley', title: 'Samsonite Cabin Trolley 55cm', category: 'luggage', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', price: 22000, originalPrice: 28000, rating: 4.7, reviews: 89, stock: 15 },
  { id: '2', slug: 'trekking-backpack-65l', title: '65L Trekking Backpack', category: 'travel-gear', image: 'https://images.unsplash.com/photo-1622260614927-904f83f7a26f?w=400&q=80', price: 9500, originalPrice: 12000, rating: 4.5, reviews: 45, stock: 8 },
  { id: '3', slug: 'travel-neck-pillow', title: 'Memory Foam Neck Pillow', category: 'accessories', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80', price: 2800, originalPrice: 3500, rating: 4.4, reviews: 123, stock: 50 },
  { id: '4', slug: 'waterproof-jacket', title: 'Men\'s Waterproof Hiking Jacket', category: 'clothing', image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=400&q=80', price: 8500, originalPrice: 11000, rating: 4.6, reviews: 67, stock: 22 },
  { id: '5', slug: 'gopro-hero12', title: 'Action Camera 4K Waterproof', category: 'electronics', image: 'https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=400&q=80', price: 45000, originalPrice: 52000, rating: 4.8, reviews: 34, stock: 6 },
  { id: '6', slug: 'packing-cubes-set', title: 'Travel Packing Cubes Set (6pc)', category: 'accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', price: 3200, originalPrice: 4000, rating: 4.3, reviews: 201, stock: 40 },
]

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'luggage', label: 'Luggage & Bags' },
  { value: 'travel-gear', label: 'Travel Gear' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'clothing', label: 'Travel Clothing' },
  { value: 'electronics', label: 'Electronics' },
]

export default function ProductsListClient() {
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const { addItem } = useCartStore()

  let results = ALL_PRODUCTS
  if (category) results = results.filter(p => p.category === category)
  if (sort === 'price_asc') results = [...results].sort((a, b) => a.price - b.price)
  else if (sort === 'price_desc') results = [...results].sort((a, b) => b.price - a.price)
  else if (sort === 'rating') results = [...results].sort((a, b) => b.rating - a.rating)

  function handleAddToCart(p: typeof ALL_PRODUCTS[0]) {
    addItem({ id: p.id, type: 'product', title: p.title, image: p.image, price: p.price, quantity: 1 })
    toast.success(`${p.title} added to cart!`)
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setShowFilters(f => !f)} className="btn btn--secondary btn--sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SlidersHorizontal size={15} /> Filters
          </button>
          <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{results.length} products</span>
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '14px' }}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {showFilters && (
        <div className="card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '14px' }}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <button onClick={() => setCategory('')} className="btn btn--ghost btn--sm">Clear</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
        {results.map(p => (
          <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <Link href={`/products/${p.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {p.stock <= 5 && (
                  <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--color-error)', color: 'white', padding: '3px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>
                    Only {p.stock} left!
                  </span>
                )}
              </div>
            </Link>
            <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '4px', textTransform: 'capitalize' }}>
                {p.category.replace(/-/g, ' ')}
              </p>
              <Link href={`/products/${p.slug}`} style={{ textDecoration: 'none' }}>
                <p style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-text)', marginBottom: '8px' }}>{p.title}</p>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                <Star size={13} fill="#FBBF24" color="#FBBF24" />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{p.rating}</span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>({p.reviews})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <div>
                  <span className="price" style={{ fontSize: '17px', color: 'var(--color-primary)' }}>{formatCurrency(p.price)}</span>
                  <span className="price__old">{formatCurrency(p.originalPrice)}</span>
                </div>
                <button onClick={() => handleAddToCart(p)} className="btn btn--primary btn--sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShoppingCart size={14} /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
