'use client'

import Link from 'next/link'
import { Plus, Edit2, Eye, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const SERVICES = [
  { id: '1', title: 'Hunza Valley 5-Day Tour', category: 'Tour Packages', price: 35000, status: 'active', bookings: 24, rating: 4.8, created_at: '2026-01-10' },
  { id: '2', title: 'Swat Valley Honeymoon Package', category: 'Tour Packages', price: 48000, status: 'active', bookings: 12, rating: 4.9, created_at: '2026-01-15' },
  { id: '3', title: 'UAE Tourist Visa Assistance', category: 'Visa Assistance', price: 8000, status: 'pending', bookings: 0, rating: 0, created_at: '2026-03-20' },
  { id: '4', title: 'Karachi Airport Transfer', category: 'Car Rentals', price: 3500, status: 'archived', bookings: 8, rating: 4.2, created_at: '2025-12-01' },
]

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'primary'> = {
  active: 'success',
  pending: 'warning',
  rejected: 'error',
  archived: 'default' as 'primary',
  draft: 'primary',
}

export default function PartnerServicesPage() {
  const [services, setServices] = useState(SERVICES)

  function toggleStatus(id: string) {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'archived' : 'active' } : s))
    toast.success('Service status updated')
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>My Services</h1>
          <p>Manage your travel service listings</p>
        </div>
        <Link href="/partner/services/new" className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Add New Service
        </Link>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total', value: services.length, color: 'var(--color-text)' },
          { label: 'Active', value: services.filter(s => s.status === 'active').length, color: 'var(--color-success)' },
          { label: 'Pending', value: services.filter(s => s.status === 'pending').length, color: 'var(--color-warning)' },
          { label: 'Archived', value: services.filter(s => s.status === 'archived').length, color: 'var(--color-text-muted)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px', textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 800, color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</p>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                {['Service', 'Category', 'Price', 'Bookings', 'Rating', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <p style={{ fontWeight: 600, fontSize: '14px' }}>{s.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Added {formatDate(s.created_at)}</p>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>{s.category}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(s.price)}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600 }}>{s.bookings}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px' }}>{s.rating > 0 ? `★ ${s.rating}` : '—'}</td>
                  <td style={{ padding: '14px 16px' }}><Badge variant={statusVariant[s.status]}>{s.status}</Badge></td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <Link href={`/services/${s.id}`} className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px' }} title="Preview"><Eye size={15} /></Link>
                      <Link href={`/partner/services/${s.id}/edit`} className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px' }} title="Edit"><Edit2 size={15} /></Link>
                      <button onClick={() => toggleStatus(s.id)} className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px', color: s.status === 'active' ? 'var(--color-success)' : 'var(--color-text-muted)' }} title="Toggle">
                        {s.status === 'active' ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                      </button>
                      <button className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px', color: 'var(--color-error)' }} title="Delete" onClick={() => toast.error('Delete confirmation needed')}><Trash2 size={15} /></button>
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
