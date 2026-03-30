'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, MapPin, Plane, Hotel, Map, Globe } from 'lucide-react'

const tabs = [
  { label: 'Flights', icon: <Plane size={16} />, category: 'flights' },
  { label: 'Hotels', icon: <Hotel size={16} />, category: 'hotels' },
  { label: 'Tours', icon: <Map size={16} />, category: 'tour-packages' },
  { label: 'Visa', icon: <Globe size={16} />, category: 'visa-assistance' },
]

const popularDestinations = ['Swat', 'Hunza', 'Murree', 'Skardu', 'Naran', 'Lahore']

export default function HeroSection() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)
  const [query, setQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    params.set('category', tabs[activeTab].category)
    if (query) params.set('q', query)
    router.push(`/services?${params.toString()}`)
  }

  return (
    <section style={{
      position: 'relative',
      minHeight: '580px',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #0033a0 0%, #0066FF 50%, #0099ff 100%)',
      overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-30%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '60px', paddingBottom: '60px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '20px',
          }}>
            ✈️ Pakistan&apos;s Trusted Travel Marketplace
          </span>
          <h1 style={{ color: 'white', marginBottom: '16px', fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>
            Explore the World,<br />Start from Pakistan
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', maxWidth: '540px', margin: '0 auto' }}>
            Flights, hotels, tour packages, visa assistance — all from verified partners
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-2xl)',
            maxWidth: '720px',
            margin: '0 auto',
            overflow: 'hidden',
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
            {tabs.map((tab, i) => (
              <button
                key={tab.category}
                onClick={() => setActiveTab(i)}
                style={{
                  flex: 1,
                  padding: '14px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: activeTab === i ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  borderBottom: activeTab === i ? '2px solid var(--color-primary)' : '2px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  marginBottom: '-1px',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} style={{ padding: '20px 24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
              <MapPin size={18} color="var(--color-text-muted)" />
              <input
                type="text"
                placeholder={`Where do you want to ${tabs[activeTab].label.toLowerCase()}?`}
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ flex: 1, fontSize: '15px', color: 'var(--color-text)', background: 'transparent' }}
              />
            </div>
            <button type="submit" className="btn btn--primary btn--lg" style={{ flexShrink: 0 }}>
              <Search size={18} /> Search
            </button>
          </form>

          {/* Popular */}
          <div style={{ padding: '0 24px 16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Popular:</span>
            {popularDestinations.map(dest => (
              <button
                key={dest}
                onClick={() => { setQuery(dest); router.push(`/services?category=${tabs[activeTab].category}&q=${dest}`) }}
                style={{
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 500,
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  background: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)' }}
              >
                {dest}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '40px', flexWrap: 'wrap' }}
        >
          {[
            { label: 'Verified Partners', value: '500+' },
            { label: 'Happy Customers', value: '50K+' },
            { label: 'Tour Packages', value: '1200+' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
