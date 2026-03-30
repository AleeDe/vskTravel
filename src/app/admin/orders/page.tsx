'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'

const ORDERS = [
  { id: 'VSK-1234', customer: 'Ayesha Malik', partner: 'Ali Travel Agency', item: 'Hunza Valley 5-Day Tour', type: 'service', amount: 35000, payment: 'pay_at_venue', payment_status: 'pending', status: 'confirmed', date: '2026-03-25' },
  { id: 'VSK-1235', customer: 'Hassan Raza', partner: 'Hunza Adventures', item: 'Swat Honeymoon Package', type: 'service', amount: 48000, payment: 'pay_at_venue', payment_status: 'pending', status: 'pending', date: '2026-03-24' },
  { id: 'VSK-1236', customer: 'Sara Ahmed', partner: 'Travel Gear PK', item: 'Samsonite Cabin Trolley', type: 'product', amount: 22000, payment: 'stripe', payment_status: 'paid', status: 'delivered', date: '2026-03-22' },
  { id: 'VSK-1237', customer: 'Ali Khan', partner: 'Northern Trails', item: 'K2 Base Camp Trek', type: 'service', amount: 72000, payment: 'pay_at_venue', payment_status: 'paid', status: 'completed', date: '2026-03-10' },
  { id: 'VSK-1238', customer: 'Fatima Noor', partner: 'Sky Visa Services', item: 'UAE Tourist Visa', type: 'service', amount: 8000, payment: 'stripe', payment_status: 'paid', status: 'processing', date: '2026-03-20' },
  { id: 'VSK-1239', customer: 'Umar Farooq', partner: 'Travel Gear PK', item: '65L Trekking Backpack', type: 'product', amount: 9500, payment: 'stripe', payment_status: 'paid', status: 'shipped', date: '2026-03-23' },
]

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'primary'> = {
  pending: 'warning', confirmed: 'primary', processing: 'primary',
  shipped: 'primary', delivered: 'success', completed: 'success',
  cancelled: 'error', refunded: 'error',
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = ORDERS.filter(o => {
    const matchSearch = o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase()) || o.partner.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || o.status === filter
    return matchSearch && matchFilter
  })

  const totalRevenue = ORDERS.reduce((s, o) => s + o.amount, 0)

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>All Orders</h1>
        <p>Monitor and manage all platform orders</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total Orders', value: ORDERS.length },
          { label: 'Total Value', value: formatCurrency(totalRevenue) },
          { label: 'Pending', value: ORDERS.filter(o => o.status === 'pending').length },
          { label: 'Completed', value: ORDERS.filter(o => o.status === 'completed' || o.status === 'delivered').length },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{s.value}</p>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '8px 12px', flex: 1, minWidth: '200px', background: 'white' }}>
          <Search size={16} color="var(--color-text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID, customer, partner…" style={{ border: 'none', fontSize: '14px', flex: 1 }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'confirmed', 'processing', 'completed', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 600, border: '1px solid', borderColor: filter === s ? 'var(--color-primary)' : 'var(--color-border)', background: filter === s ? 'var(--color-primary)' : 'white', color: filter === s ? 'white' : 'var(--color-text-secondary)', cursor: 'pointer', textTransform: 'capitalize' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                {['Order ID', 'Customer', 'Partner', 'Item', 'Amount', 'Payment', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 700, fontSize: '13px' }}>{o.id}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px' }}>{o.customer}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>{o.partner}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.item}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(o.amount)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div>
                      <span style={{ fontSize: '13px', textTransform: 'capitalize' }}>{o.payment.replace('_', ' ')}</span>
                      <br />
                      <Badge variant={o.payment_status === 'paid' ? 'success' : 'warning'}>{o.payment_status}</Badge>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}><Badge variant={statusVariant[o.status]}>{o.status}</Badge></td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--color-text-muted)' }}>{formatDate(o.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
