'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { Package, ArrowRight } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ORDER_STATUS_LABELS } from '@/lib/constants'

// Placeholder — fetched from Supabase in Phase 6
const SAMPLE_ORDERS = [
  { id: 'ord-1', order_number: 'VSK-1234-ABCD', status: 'confirmed', total_amount: 35000, created_at: '2026-03-10', items: [{ title: 'Hunza Valley 5-Day Tour', type: 'service' }] },
  { id: 'ord-2', order_number: 'VSK-1235-EFGH', status: 'delivered', total_amount: 22000, created_at: '2026-02-20', items: [{ title: 'Samsonite Cabin Trolley', type: 'product' }] },
  { id: 'ord-3', order_number: 'VSK-1236-IJKL', status: 'pending', total_amount: 8000, created_at: '2026-03-25', items: [{ title: 'UAE Tourist Visa Assistance', type: 'service' }] },
]

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'primary'> = {
  pending: 'warning',
  confirmed: 'primary',
  processing: 'primary',
  shipped: 'primary',
  delivered: 'success',
  completed: 'success',
  cancelled: 'error',
  refunded: 'error',
}

function OrdersContent() {
  const searchParams = useSearchParams()
  const newOrder = searchParams.get('new')

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '8px' }}>My Orders</h1>
      <p style={{ marginBottom: '32px' }}>Track and manage your bookings and purchases</p>

      {newOrder && (
        <div style={{ padding: '16px 20px', background: 'var(--color-success-light)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>✅</span>
          <div>
            <p style={{ fontWeight: 700, color: 'var(--color-success)' }}>Order Placed Successfully!</p>
            <p style={{ fontSize: '14px' }}>Order <strong>{newOrder}</strong> is confirmed. You will receive a confirmation email shortly.</p>
          </div>
        </div>
      )}

      {SAMPLE_ORDERS.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <Package size={64} color="var(--color-text-muted)" style={{ margin: '0 auto 24px' }} />
          <h2 style={{ marginBottom: '12px' }}>No orders yet</h2>
          <p style={{ marginBottom: '24px' }}>Browse services and products to make your first booking</p>
          <Link href="/services" className="btn btn--primary">Explore Services</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {SAMPLE_ORDERS.map(order => (
            <div key={order.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '14px' }}>{order.order_number}</span>
                    <Badge variant={statusVariant[order.status] ?? 'default'}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </Badge>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Placed on {formatDate(order.created_at)}</p>
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                        <span>{item.type === 'service' ? '✈️' : '📦'}</span>
                        <span>{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="price" style={{ fontSize: '22px', color: 'var(--color-primary)', display: 'block', marginBottom: '8px' }}>
                    {formatCurrency(order.total_amount)}
                  </span>
                  <button className="btn btn--secondary btn--sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="container" style={{ paddingTop: '80px' }}>Loading orders…</div>}>
      <OrdersContent />
    </Suspense>
  )
}
