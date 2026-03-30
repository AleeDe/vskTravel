'use client'

import { useState } from 'react'
import { Search, Star, Check, X, Eye } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const LISTINGS = [
  { id: '1', title: 'Hunza Valley 5-Day Tour', partner: 'Ali Travel Agency', type: 'service', category: 'Tour Packages', price: 35000, status: 'active', featured: true, rating: 4.8, created_at: '2026-01-10' },
  { id: '2', title: 'Swat Honeymoon Package', partner: 'Northern Trails', type: 'service', category: 'Tour Packages', price: 48000, status: 'pending', featured: false, rating: 0, created_at: '2026-03-24' },
  { id: '3', title: 'Samsonite Cabin Trolley', partner: 'Travel Gear PK', type: 'product', category: 'Luggage & Bags', price: 22000, status: 'active', featured: false, rating: 4.7, created_at: '2026-01-05' },
  { id: '4', title: 'UAE Tourist Visa Service', partner: 'Sky Visa Services', type: 'service', category: 'Visa Assistance', price: 8000, status: 'active', featured: true, rating: 4.9, created_at: '2025-12-15' },
  { id: '5', title: 'New Trekking Backpack', partner: 'Northern Trails', type: 'product', category: 'Travel Gear', price: 9500, status: 'pending', featured: false, rating: 0, created_at: '2026-03-25' },
  { id: '6', title: 'Karachi Hotel Package', partner: 'Pearl Hospitality', type: 'service', category: 'Hotels', price: 15000, status: 'rejected', featured: false, rating: 0, created_at: '2026-03-20' },
]

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'primary'> = {
  active: 'success', pending: 'warning', rejected: 'error', archived: 'primary', draft: 'primary',
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState(LISTINGS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = listings.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.partner.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filter === 'all' || l.status === filter
    const matchType = typeFilter === 'all' || l.type === typeFilter
    return matchSearch && matchStatus && matchType
  })

  function updateStatus(id: string, status: string) {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    toast.success(`Listing ${status}`)
  }

  function toggleFeatured(id: string) {
    setListings(prev => prev.map(l => l.id === id ? { ...l, featured: !l.featured } : l))
    toast.success('Featured status updated')
  }

  const pendingCount = listings.filter(l => l.status === 'pending').length

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Listings</h1>
        <p>Approve, feature and manage all services and products</p>
      </div>

      {pendingCount > 0 && (
        <div style={{ padding: '14px 18px', background: 'var(--color-warning-light)', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
          <span style={{ fontWeight: 700, color: 'var(--color-warning)' }}>⚠️ {pendingCount} listings awaiting approval</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '8px 12px', flex: 1, minWidth: '200px', background: 'white' }}>
          <Search size={16} color="var(--color-text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings…" style={{ border: 'none', fontSize: '14px', flex: 1 }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'active', 'rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 600, border: '1px solid', borderColor: filter === s ? 'var(--color-primary)' : 'var(--color-border)', background: filter === s ? 'var(--color-primary)' : 'white', color: filter === s ? 'white' : 'var(--color-text-secondary)', cursor: 'pointer', textTransform: 'capitalize' }}>
              {s}
            </button>
          ))}
          <div style={{ width: '1px', background: 'var(--color-border)' }} />
          {['all', 'service', 'product'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 600, border: '1px solid', borderColor: typeFilter === t ? 'var(--color-accent)' : 'var(--color-border)', background: typeFilter === t ? 'var(--color-accent)' : 'white', color: typeFilter === t ? 'white' : 'var(--color-text-secondary)', cursor: 'pointer', textTransform: 'capitalize' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                {['Title', 'Partner', 'Type', 'Category', 'Price', 'Rating', 'Featured', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <p style={{ fontWeight: 600, fontSize: '14px' }}>{l.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{formatDate(l.created_at)}</p>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>{l.partner}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 8px', borderRadius: '9999px', background: l.type === 'service' ? 'var(--color-primary-50)' : 'var(--color-warning-light)', color: l.type === 'service' ? 'var(--color-primary)' : 'var(--color-warning)', textTransform: 'capitalize' }}>
                      {l.type}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>{l.category}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(l.price)}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px' }}>{l.rating > 0 ? <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Star size={13} fill="#FBBF24" color="#FBBF24" />{l.rating}</span> : '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => toggleFeatured(l.id)} style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer' }} title="Toggle featured">
                      {l.featured ? '⭐' : '☆'}
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px' }}><Badge variant={statusVariant[l.status]}>{l.status}</Badge></td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px' }} title="View"><Eye size={15} /></button>
                      {l.status === 'pending' && <>
                        <button onClick={() => updateStatus(l.id, 'active')} className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px', color: 'var(--color-success)' }} title="Approve"><Check size={15} /></button>
                        <button onClick={() => updateStatus(l.id, 'rejected')} className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px', color: 'var(--color-error)' }} title="Reject"><X size={15} /></button>
                      </>}
                      {l.status === 'active' && (
                        <button onClick={() => updateStatus(l.id, 'archived')} className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px', color: 'var(--color-text-muted)' }} title="Archive"><X size={15} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
