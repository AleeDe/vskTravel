'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star, Clock, SlidersHorizontal, Grid, List } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { SORT_OPTIONS } from '@/lib/constants'

// Placeholder data — replaced by Supabase queries in Phase 6
const ALL_SERVICES = [
  { id: '1', slug: 'hunza-valley-5day-tour', title: 'Hunza Valley 5-Day Tour', category: 'tour-packages', location: 'Hunza', price: 35000, rating: 4.8, reviews: 124, duration: '5 Days', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80' },
  { id: '2', slug: 'swat-valley-honeymoon', title: 'Swat Valley Honeymoon Package', category: 'tour-packages', location: 'Swat', price: 48000, rating: 4.9, reviews: 87, duration: '6 Days', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
  { id: '3', slug: 'skardu-k2-base-camp', title: 'Skardu & K2 Base Camp Trek', category: 'tour-packages', location: 'Skardu', price: 72000, rating: 4.7, reviews: 56, duration: '10 Days', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80' },
  { id: '4', slug: 'lahore-city-explorer', title: 'Lahore Heritage Explorer', category: 'tour-packages', location: 'Lahore', price: 18000, rating: 4.6, reviews: 203, duration: '3 Days', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80' },
  { id: '5', slug: 'karachi-dubai-flight', title: 'Karachi → Dubai Economy Flight', category: 'flights', location: 'Karachi', price: 55000, rating: 4.5, reviews: 312, duration: '3h 30m', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80' },
  { id: '6', slug: 'pearl-continental-lahore', title: 'Pearl Continental Lahore', category: 'hotels', location: 'Lahore', price: 22000, rating: 4.8, reviews: 445, duration: 'Per Night', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80' },
  { id: '7', slug: 'dubai-visa-assistance', title: 'UAE Tourist Visa Assistance', category: 'visa-assistance', location: 'Online', price: 8000, rating: 4.9, reviews: 678, duration: '3-5 Days', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { id: '8', slug: 'islamabad-rent-a-car', title: 'Islamabad Airport Car Rental', category: 'car-rentals', location: 'Islamabad', price: 4500, rating: 4.4, reviews: 89, duration: 'Per Day', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80' },
]

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'flights', label: 'Flights' },
  { value: 'hotels', label: 'Hotels' },
  { value: 'tour-packages', label: 'Tour Packages' },
  { value: 'visa-assistance', label: 'Visa Assistance' },
  { value: 'car-rentals', label: 'Car Rentals' },
  { value: 'travel-insurance', label: 'Travel Insurance' },
]

export default function ServicesListClient() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sort, setSort] = useState('newest')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setCategory(searchParams.get('category') ?? '')
  }, [searchParams])

  let results = ALL_SERVICES
  if (category) results = results.filter(s => s.category === category)
  if (minPrice) results = results.filter(s => s.price >= Number(minPrice))
  if (maxPrice) results = results.filter(s => s.price <= Number(maxPrice))

  const q = searchParams.get('q')
  if (q) results = results.filter(s => s.title.toLowerCase().includes(q.toLowerCase()) || s.location.toLowerCase().includes(q.toLowerCase()))

  if (sort === 'price_asc') results = [...results].sort((a, b) => a.price - b.price)
  else if (sort === 'price_desc') results = [...results].sort((a, b) => b.price - a.price)
  else if (sort === 'rating') results = [...results].sort((a, b) => b.rating - a.rating)

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setShowFilters(f => !f)} className="btn btn--secondary btn--sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SlidersHorizontal size={15} /> Filters
          </button>
          <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{results.length} results</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '14px', background: 'white' }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button onClick={() => setViewMode('grid')} style={{ padding: '8px 10px', background: viewMode === 'grid' ? 'var(--color-primary)' : 'white', color: viewMode === 'grid' ? 'white' : 'var(--color-text-muted)', border: 'none', cursor: 'pointer' }}>
              <Grid size={16} />
            </button>
            <button onClick={() => setViewMode('list')} style={{ padding: '8px 10px', background: viewMode === 'list' ? 'var(--color-primary)' : 'white', color: viewMode === 'list' ? 'white' : 'var(--color-text-muted)', border: 'none', cursor: 'pointer' }}>
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card" style={{ padding: '20px', marginBottom: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '180px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '14px' }}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Min Price (PKR)</label>
            <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="0" style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '14px', width: '130px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>Max Price (PKR)</label>
            <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Any" style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '14px', width: '130px' }} />
          </div>
          <button onClick={() => { setCategory(''); setMinPrice(''); setMaxPrice('') }} className="btn btn--ghost btn--sm">Clear Filters</button>
        </div>
      )}

      {/* Results */}
      {results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--color-text-muted)' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
          <h3>No services found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {results.map(s => <ServiceCard key={s.id} service={s} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {results.map(s => <ServiceRow key={s.id} service={s} />)}
        </div>
      )}
    </div>
  )
}

type Service = typeof ALL_SERVICES[0]

function ServiceCard({ service: s }: { service: Service }) {
  return (
    <Link href={`/services/${s.slug}`} className="card" style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{ height: '180px', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600 }}>{s.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '13px', fontWeight: 600 }}>
            <Star size={12} fill="#FBBF24" color="#FBBF24" /> {s.rating}
          </span>
        </div>
        <h3 style={{ fontSize: '15px', marginBottom: '8px', color: 'var(--color-text)' }}>{s.title}</h3>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text-muted)' }}><MapPin size={12} />{s.location}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text-muted)' }}><Clock size={12} />{s.duration}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="price" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>{formatCurrency(s.price)}</span>
          <span className="btn btn--primary btn--sm">View</span>
        </div>
      </div>
    </Link>
  )
}

function ServiceRow({ service: s }: { service: Service }) {
  return (
    <Link href={`/services/${s.slug}`} className="card" style={{ display: 'flex', textDecoration: 'none', gap: '0' }}>
      <div style={{ width: '200px', flexShrink: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '4px' }}>{s.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
          <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>{s.title}</h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-text-muted)' }}><MapPin size={13} />{s.location}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-text-muted)' }}><Clock size={13} />{s.duration}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}><Star size={13} fill="#FBBF24" color="#FBBF24" />{s.rating} ({s.reviews})</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
          <span className="price" style={{ fontSize: '22px', color: 'var(--color-primary)' }}>{formatCurrency(s.price)}</span>
          <span className="btn btn--primary">Book Now</span>
        </div>
      </div>
    </Link>
  )
}
