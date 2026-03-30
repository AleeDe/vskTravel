'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const ORDERS = [
  { id: 'VSK-1234', customer: 'Ayesha Malik', phone: '+92 300 1234567', item: 'Hunza Valley 5-Day Tour', type: 'service', amount: 35000, commission: 3500, status: 'confirmed', date: '2026-03-25', travelers: 2, bookingDate: '2026-04-15' },
  { id: 'VSK-1235', customer: 'Hassan Raza', phone: '+92 321 9876543', item: 'Swat Honeymoon Package', type: 'service', amount: 48000, commission: 4800, status: 'pending', date: '2026-03-24', travelers: 2, bookingDate: '2026-04-20' },
  { id: 'VSK-1236', customer: 'Sara Ahmed', phone: '+92 333 5555555', item: '65L Trekking Backpack', type: 'product', amount: 9500, commission: 950, status: 'processing', date: '2026-03-22', travelers: null, bookingDate: null },
  { id: 'VSK-1237', customer: 'Ali Khan', phone: '+92 312 4444444', item: 'Skardu K2 Base Camp Trek', type: 'service', amount: 72000, commission: 7200, status: 'completed', date: '2026-03-10', travelers: 4, bookingDate: '2026-03-28' },
]

const STATUS_ACTIONS: Record<string, string[]> = {
  pending: ['confirm', 'cancel'],
  confirmed: ['mark_processing', 'cancel'],
  processing: ['mark_completed'],
  completed: [],
  cancelled: [],
}

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'primary'> = {
  pending: 'warning', confirmed: 'primary', processing: 'primary', completed: 'success', cancelled: 'error',
}

export default function PartnerOrdersPage() {
  const [orders, setOrders] = useState(ORDERS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = orders.filter(o => {
    const matchSearch = o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase()) || o.item.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || o.status === filter
    return matchSearch && matchFilter
  })

  function updateStatus(id: string, newStatus: string) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
    toast.success(`Order ${id} status updated to ${newStatus}`)
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Orders</h1>
        <p>Manage and track all your customer orders</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '8px 12px', flex: 1, minWidth: '200px', background: 'white' }}>
          <Search size={16} color="var(--color-text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders…" style={{ border: 'none', fontSize: '14px', flex: 1 }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'confirmed', 'processing', 'completed', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 600, border: '1px solid',
              borderColor: filter === s ? 'var(--color-primary)' : 'var(--color-border)',
              background: filter === s ? 'var(--color-primary)' : 'white',
              color: filter === s ? 'white' : 'var(--color-text-secondary)',
              cursor: 'pointer', textTransform: 'capitalize',
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No orders found</div>
        ) : filtered.map(order => (
          <div key={order.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {/* Header Row */}
            <div
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', flexWrap: 'wrap', gap: '10px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '14px' }}>{order.id}</span>
                <span style={{ fontSize: '14px' }}>{order.customer}</span>
                <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.item}</span>
                <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(order.amount)}</span>
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{formatDate(order.date)}</span>
              </div>
            </div>

            {/* Expanded Details */}
            {expanded === order.id && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-subtle)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div><p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>CUSTOMER PHONE</p><p style={{ fontWeight: 600 }}>{order.phone}</p></div>
                  <div><p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>TYPE</p><p style={{ fontWeight: 600, textTransform: 'capitalize' }}>{order.type}</p></div>
                  {order.travelers && <div><p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>TRAVELERS</p><p style={{ fontWeight: 600 }}>{order.travelers}</p></div>}
                  {order.bookingDate && <div><p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>BOOKING DATE</p><p style={{ fontWeight: 600 }}>{formatDate(order.bookingDate)}</p></div>}
                  <div><p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>YOUR EARNINGS</p><p style={{ fontWeight: 700, color: 'var(--color-success)' }}>{formatCurrency(order.amount - order.commission)}</p></div>
                  <div><p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>VSK COMMISSION (10%)</p><p style={{ fontWeight: 600, color: 'var(--color-error)' }}>−{formatCurrency(order.commission)}</p></div>
                </div>
                {STATUS_ACTIONS[order.status]?.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {STATUS_ACTIONS[order.status].map(action => (
                      <button key={action} onClick={() => updateStatus(order.id, action.replace('mark_', ''))}
                        className={action === 'cancel' ? 'btn btn--secondary btn--sm' : 'btn btn--primary btn--sm'}
                        style={action === 'cancel' ? { color: 'var(--color-error)' } : {}}
                      >
                        {action === 'confirm' ? 'Confirm Order' : action === 'mark_processing' ? 'Mark Processing' : action === 'mark_completed' ? 'Mark Completed' : 'Cancel'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
