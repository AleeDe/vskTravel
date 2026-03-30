'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

const RATES = [
  { category: 'Flights', type: 'service', rate: 10, listings: 12, monthly_commission: 28000 },
  { category: 'Hotels', type: 'service', rate: 10, listings: 28, monthly_commission: 45000 },
  { category: 'Tour Packages', type: 'service', rate: 10, listings: 45, monthly_commission: 92000 },
  { category: 'Visa Assistance', type: 'service', rate: 8, listings: 8, monthly_commission: 12000 },
  { category: 'Car Rentals', type: 'service', rate: 10, listings: 6, monthly_commission: 8500 },
  { category: 'Luggage & Bags', type: 'product', rate: 12, listings: 18, monthly_commission: 22000 },
  { category: 'Travel Gear', type: 'product', rate: 12, listings: 12, monthly_commission: 14000 },
  { category: 'Electronics', type: 'product', rate: 15, listings: 9, monthly_commission: 31000 },
]

const TRANSACTIONS = [
  { id: '1', order_id: 'VSK-1234', partner: 'Ali Travel Agency', item: 'Hunza Valley Tour', gross: 35000, rate: 10, commission: 3500, status: 'settled', date: '2026-03-25' },
  { id: '2', order_id: 'VSK-1235', partner: 'Hunza Adventures', item: 'Swat Honeymoon', gross: 48000, rate: 10, commission: 4800, status: 'settled', date: '2026-03-24' },
  { id: '3', order_id: 'VSK-1236', partner: 'Travel Gear PK', item: 'Trekking Backpack', gross: 9500, rate: 12, commission: 1140, status: 'pending', date: '2026-03-24' },
  { id: '4', order_id: 'VSK-1237', partner: 'Sky Visa Services', item: 'UAE Visa Assistance', gross: 8000, rate: 8, commission: 640, status: 'pending', date: '2026-03-23' },
  { id: '5', order_id: 'VSK-1230', partner: 'Northern Trails', item: 'K2 Base Camp Trek', gross: 72000, rate: 10, commission: 7200, status: 'settled', date: '2026-03-15' },
]

const totalCommission = TRANSACTIONS.reduce((s, t) => s + t.commission, 0)
const settledCommission = TRANSACTIONS.filter(t => t.status === 'settled').reduce((s, t) => s + t.commission, 0)
const pendingCommission = TRANSACTIONS.filter(t => t.status === 'pending').reduce((s, t) => s + t.commission, 0)

export default function AdminCommissionsPage() {
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Commissions</h1>
        <p>Track commission rates, earnings and settlement status</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Commission Earned', value: totalCommission, color: '#0066FF', bg: '#EBF2FF' },
          { label: 'Settled', value: settledCommission, color: '#10B981', bg: '#D1FAE5' },
          { label: 'Pending Settlement', value: pendingCommission, color: '#F59E0B', bg: '#FEF3C7' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '20px' }}>
            <p style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: s.color, marginBottom: '4px' }}>{formatCurrency(s.value)}</p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Commission Rates by Category */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>Commission Rates by Category</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Category', 'Type', 'Rate', 'Listings', 'Monthly Commission'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RATES.map(r => (
                <tr key={r.category} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: '14px' }}>{r.category}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 8px', borderRadius: '9999px', background: r.type === 'service' ? 'var(--color-primary-50)' : 'var(--color-warning-light)', color: r.type === 'service' ? 'var(--color-primary)' : 'var(--color-warning)', textTransform: 'capitalize' }}>
                      {r.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-primary)' }}>{r.rate}%</td>
                  <td style={{ padding: '12px 14px', fontSize: '14px' }}>{r.listings}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-success)' }}>{formatCurrency(r.monthly_commission)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transactions */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>Recent Commission Transactions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {TRANSACTIONS.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{t.item}</p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t.order_id} • {t.partner} • {formatDate(t.date)}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>GROSS</p>
                  <p style={{ fontWeight: 600, fontSize: '14px' }}>{formatCurrency(t.gross)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>RATE</p>
                  <p style={{ fontWeight: 600, fontSize: '14px' }}>{t.rate}%</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>COMMISSION</p>
                  <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-primary)' }}>{formatCurrency(t.commission)}</p>
                </div>
                <Badge variant={t.status === 'settled' ? 'success' : 'warning'}>{t.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
