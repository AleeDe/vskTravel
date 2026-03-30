'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

const TRANSACTIONS = [
  { id: '1', order_id: 'VSK-1237', item: 'Skardu K2 Base Camp Trek', order_amount: 72000, commission: 7200, earned: 64800, status: 'settled', date: '2026-03-15' },
  { id: '2', order_id: 'VSK-1230', item: 'Hunza Valley Tour', order_amount: 35000, commission: 3500, earned: 31500, status: 'settled', date: '2026-03-10' },
  { id: '3', order_id: 'VSK-1234', item: 'Hunza Valley 5-Day Tour', order_amount: 35000, commission: 3500, earned: 31500, status: 'pending', date: '2026-03-25' },
  { id: '4', order_id: 'VSK-1235', item: 'Swat Honeymoon Package', order_amount: 48000, commission: 4800, earned: 43200, status: 'pending', date: '2026-03-24' },
]

const revenueMonths = [
  { month: 'Oct 2025', orders: 3, gross: 95000, commission: 9500, net: 85500 },
  { month: 'Nov 2025', orders: 5, gross: 142000, commission: 14200, net: 127800 },
  { month: 'Dec 2025', orders: 7, gross: 198000, commission: 19800, net: 178200 },
  { month: 'Jan 2026', orders: 4, gross: 118000, commission: 11800, net: 106200 },
  { month: 'Feb 2026', orders: 3, gross: 93000, commission: 9300, net: 83700 },
  { month: 'Mar 2026', orders: 4, gross: 155000, commission: 15500, net: 139500 },
]

export default function PartnerEarningsPage() {
  const totalEarned = TRANSACTIONS.filter(t => t.status === 'settled').reduce((s, t) => s + t.earned, 0)
  const pendingEarnings = TRANSACTIONS.filter(t => t.status === 'pending').reduce((s, t) => s + t.earned, 0)
  const totalCommission = TRANSACTIONS.reduce((s, t) => s + t.commission, 0)

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Earnings</h1>
        <p>Track your revenue, commissions and payouts</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Earned', value: totalEarned, color: '#0066FF', bg: '#EBF2FF', note: 'Settled payments' },
          { label: 'Pending Earnings', value: pendingEarnings, color: '#F59E0B', bg: '#FEF3C7', note: 'Awaiting settlement' },
          { label: 'Total Commission Paid', value: totalCommission, color: '#EF4444', bg: '#FEE2E2', note: '10% of gross sales' },
          { label: 'Net This Month', value: 139500, color: '#10B981', bg: '#D1FAE5', note: 'March 2026' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '20px' }}>
            <p style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: s.color, marginBottom: '4px' }}>
              {formatCurrency(s.value)}
            </p>
            <p style={{ fontWeight: 600, marginBottom: '2px', fontSize: '14px' }}>{s.label}</p>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{s.note}</p>
          </div>
        ))}
      </div>

      {/* Monthly Breakdown */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Monthly Revenue Breakdown</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Month', 'Orders', 'Gross Revenue', 'Commission (10%)', 'Net Earnings'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {revenueMonths.map(row => (
                <tr key={row.month} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: '14px' }}>{row.month}</td>
                  <td style={{ padding: '12px 14px', fontSize: '14px' }}>{row.orders}</td>
                  <td style={{ padding: '12px 14px', fontSize: '14px' }}>{formatCurrency(row.gross)}</td>
                  <td style={{ padding: '12px 14px', fontSize: '14px', color: 'var(--color-error)' }}>−{formatCurrency(row.commission)}</td>
                  <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 700, color: 'var(--color-success)' }}>{formatCurrency(row.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transactions */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Commission Transactions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {TRANSACTIONS.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{t.item}</p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t.order_id} • {formatDate(t.date)}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Gross</p>
                  <p style={{ fontWeight: 600, fontSize: '14px' }}>{formatCurrency(t.order_amount)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Commission</p>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-error)' }}>−{formatCurrency(t.commission)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>You Earned</p>
                  <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-success)' }}>{formatCurrency(t.earned)}</p>
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
