'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { MapPin, Star, Clock, Users, Check, X, Share2, Heart, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'

// Placeholder — will be Supabase fetch in Phase 6
const SERVICE = {
  id: 'hunza-valley-5day-tour',
  slug: 'hunza-valley-5day-tour',
  title: 'Hunza Valley 5-Day Tour',
  category: 'Tour Packages',
  location: 'Hunza, Gilgit-Baltistan',
  duration: '5 Days / 4 Nights',
  maxCapacity: 20,
  price: 35000,
  originalPrice: 45000,
  rating: 4.8,
  reviews: 124,
  images: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  ],
  description: 'Experience the breathtaking beauty of Hunza Valley on this 5-day tour. Visit the famous Baltit Fort, Attabad Lake, Passu Cones, and enjoy the warm hospitality of the Hunza people.',
  includes: ['Hotel accommodation (4 nights)', 'Transport from Islamabad', 'Breakfast & dinner daily', 'Professional guide', 'All sightseeing entry fees'],
  excludes: ['Airfare', 'Lunch', 'Personal expenses', 'Travel insurance'],
  itinerary: [
    { day: 1, title: 'Departure from Islamabad', description: 'Early morning departure via Karakoram Highway. Lunch stop at Chilas. Arrive Hunza by evening.' },
    { day: 2, title: 'Baltit Fort & Karimabad', description: 'Morning visit to Baltit Fort, afternoon explore Karimabad bazaar and Ganish village.' },
    { day: 3, title: 'Attabad Lake & Gojal', description: 'Full day excursion to the stunning turquoise Attabad Lake and Gojal Valley.' },
    { day: 4, title: 'Passu & Hussaini Bridge', description: 'Visit Passu Cones glacier, cross the famous Hussaini suspension bridge.' },
    { day: 5, title: 'Return to Islamabad', description: 'After breakfast, depart for Islamabad. Arrive by late evening.' },
  ],
}

export default function ServiceDetailPage() {
  const params = useParams()
  const { addItem } = useCartStore()
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'reviews'>('overview')
  const [travelers, setTravelers] = useState(1)
  const [bookingDate, setBookingDate] = useState('')

  // In production: fetch service by params.slug from Supabase
  const service = SERVICE

  function handleAddToCart() {
    if (!bookingDate) { toast.error('Please select a travel date'); return }
    addItem({
      id: service.id,
      type: 'service',
      title: service.title,
      image: service.images[0],
      price: service.price,
      quantity: 1,
      serviceDate: bookingDate,
      travelers,
    })
    toast.success('Added to cart!')
  }

  const tabs = ['overview', 'itinerary', 'reviews'] as const

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(0, 340px)', gap: '32px', alignItems: 'start' }}>
        {/* Left */}
        <div>
          {/* Image Gallery */}
          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: '8px', height: '400px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={service.images[activeImage]} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            {service.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)} style={{ width: '80px', height: '60px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: i === activeImage ? '2px solid var(--color-primary)' : '2px solid transparent', cursor: 'pointer', flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>

          {/* Title + Meta */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <span className="label" style={{ margin: 0 }}>{service.category}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn--ghost btn--icon" aria-label="Save"><Heart size={18} /></button>
                <button className="btn btn--ghost btn--icon" aria-label="Share"><Share2 size={18} /></button>
              </div>
            </div>
            <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '12px' }}>{service.title}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', color: 'var(--color-text-muted)' }}><MapPin size={14} />{service.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', color: 'var(--color-text-muted)' }}><Clock size={14} />{service.duration}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', color: 'var(--color-text-muted)' }}><Users size={14} />Max {service.maxCapacity} people</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', fontWeight: 600 }}>
                <Star size={14} fill="#FBBF24" color="#FBBF24" />{service.rating} ({service.reviews} reviews)
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '24px', gap: '4px' }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 600,
                color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
                background: 'none',
                cursor: 'pointer',
                marginBottom: '-1px',
                textTransform: 'capitalize',
              }}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div>
              <p style={{ marginBottom: '24px', lineHeight: 1.8 }}>{service.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--color-success)' }}>✓ What&apos;s Included</h3>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {service.includes.map((item, i) => (
                      <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                        <Check size={16} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '1px' }} />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--color-error)' }}>✗ Not Included</h3>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {service.excludes.map((item, i) => (
                      <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                        <X size={16} color="var(--color-error)" style={{ flexShrink: 0, marginTop: '1px' }} />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {service.itinerary.map((day, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                      {day.day}
                    </div>
                    {i < service.itinerary.length - 1 && <div style={{ width: '2px', flex: 1, background: 'var(--color-border)', minHeight: '24px' }} />}
                  </div>
                  <div className="card" style={{ padding: '16px', flex: 1, marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '15px', marginBottom: '6px' }}>Day {day.day}: {day.title}</h4>
                    <p style={{ fontSize: '14px' }}>{day.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
              <p>Reviews will be loaded from Supabase in Phase 6</p>
            </div>
          )}
        </div>

        {/* Booking Card */}
        <div className="card" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
              <span className="price" style={{ fontSize: '28px', color: 'var(--color-primary)' }}>{formatCurrency(service.price)}</span>
              <span className="price__old">{formatCurrency(service.originalPrice)}</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>per person</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Travel Date</label>
              <input
                type="date"
                value={bookingDate}
                onChange={e => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Travelers</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => setTravelers(t => Math.max(1, t - 1))} className="btn btn--secondary btn--icon" style={{ width: '36px', height: '36px' }}>−</button>
                <span style={{ fontWeight: 700, fontSize: '18px', minWidth: '24px', textAlign: 'center' }}>{travelers}</span>
                <button onClick={() => setTravelers(t => Math.min(service.maxCapacity, t + 1))} className="btn btn--secondary btn--icon" style={{ width: '36px', height: '36px' }}>+</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', padding: '12px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '14px' }}>{formatCurrency(service.price)} × {travelers}</span>
            <span style={{ fontWeight: 700 }}>{formatCurrency(service.price * travelers)}</span>
          </div>

          <button onClick={handleAddToCart} className="btn btn--primary" style={{ width: '100%', marginBottom: '10px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <ShoppingCart size={18} /> Add to Cart
          </button>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
            No upfront payment • Pay at venue
          </p>
        </div>
      </div>
    </div>
  )
}
