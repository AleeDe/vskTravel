'use client'

import Link from 'next/link'
import { TrendingUp, ShoppingBag, Star, DollarSign, Plus, ArrowRight, ArrowUp } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

// Placeholder — Supabase data in Phase 6
const stats = [
  { label: 'Total Revenue', value: 285000, prev: 240000, icon: <DollarSign size={22} />, color: '#0066FF', bg: '#EBF2FF', format: true },
  { label: 'Total Orders', value: 24, prev: 18, icon: <ShoppingBag size={22} />, color: '#10B981', bg: '#D1FAE5', format: false },
  { label: 'Avg Rating', value: 4.8, prev: 4.6, icon: <Star size={22} />, color: '#F59E0B', bg: '#FEF3C7', format: false },
  { label: 'This Month', value: 48000, prev: 38000, icon: <TrendingUp size={22} />, color: '#8B5CF6', bg: '#EDE9FE', format: true },
]

const recentOrders = [
  { id: 'VSK-1234', customer: 'Ayesha Malik', item: 'Hunza Valley 5-Day Tour', amount: 35000, status: 'confirmed', date: '2026-03-25' },
  { id: 'VSK-1235', customer: 'Hassan Raza', item: 'Swat Honeymoon Package', amount: 48000, status: 'pending', date: '2026-03-24' },
  { id: 'VSK-1236', customer: 'Sara Ahmed', item: 'UAE Visa Assistance', amount: 8000, status: 'completed', date: '2026-03-22' },
  { id: 'VSK-1237', customer: 'Ali Khan', item: 'Skardu K2 Trek', amount: 72000, status: 'processing', date: '2026-03-20' },
]

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'primary'> = {
  pending: 'warning',
  confirmed: 'primary',
  processing: 'primary',
  completed: 'success',
  cancelled: 'error',
}

// Simple bar chart using divs
const revenueData = [
  { month: 'Oct', amount: 32000 },
  { month: 'Nov', amount: 45000 },
  { month: 'Dec', amount: 58000 },
  { month: 'Jan', amount: 41000 },
  { month: 'Feb', amount: 38000 },
  { month: 'Mar', amount: 48000 },
]
const maxRevenue = Math.max(...revenueData.map(d => d.amount))

export default function PartnerDashboardPage() {
  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Partner Dashboard</h1>
          <p>Welcome back! Here&apos;s your business overview.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/partner/services/new" className="btn btn--secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Add Service
          </Link>
          <Link href="/partner/products/new" className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map(s => {
          const growth = Math.round(((s.value as number) - (s.prev as number)) / (s.prev as number) * 100)
          return (
            <div key={s.label} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                  {s.icon}
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', fontWeight: 700, color: 'var(--color-success)', background: 'var(--color-success-light)', padding: '3px 8px', borderRadius: '9999px' }}>
                  <ArrowUp size={11} /> {growth}%
                </span>
              </div>
              <p style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-text)', marginBottom: '2px' }}>
                {s.format ? formatCurrency(s.value as number) : s.value}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{s.label}</p>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(0, 360px)', gap: '24px', alignItems: 'start' }}>
        {/* Revenue Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '16px' }}>Revenue — Last 6 Months</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '160px' }}>
            {revenueData.map(d => (
              <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {formatCurrency(d.amount).replace('PKR ', '').replace(',000', 'K')}
                </span>
                <div style={{
                  width: '100%',
                  height: `${(d.amount / maxRevenue) * 120}px`,
                  background: d.month === 'Mar' ? 'var(--color-primary)' : 'var(--color-primary-100)',
                  borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                  transition: 'height var(--transition-base)',
                }} />
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Quick Overview</h3>
          {[
            { label: 'Active Services', value: '5', color: 'var(--color-primary)' },
            { label: 'Active Products', value: '3', color: 'var(--color-accent)' },
            { label: 'Pending Orders', value: '2', color: 'var(--color-warning)' },
            { label: 'Commission Rate', value: '10%', color: 'var(--color-success)' },
            { label: 'Avg Response Time', value: '2h', color: 'var(--color-text-muted)' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-border-light)' }}>
              <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{item.label}</span>
              <span style={{ fontWeight: 700, color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px' }}>Recent Orders</h3>
          <Link href="/partner/orders" style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Order ID', 'Customer', 'Item', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <td style={{ padding: '12px', fontSize: '13px', fontFamily: 'monospace', fontWeight: 600 }}>{order.id}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{order.customer}</td>
                  <td style={{ padding: '12px', fontSize: '14px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.item}</td>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(order.amount)}</td>
                  <td style={{ padding: '12px' }}><Badge variant={statusVariant[order.status] ?? 'default'}>{order.status}</Badge></td>
                  <td style={{ padding: '12px', fontSize: '13px', color: 'var(--color-text-muted)' }}>{formatDate(order.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
