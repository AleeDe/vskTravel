'use client'

import { TrendingUp, Users, Globe, ShoppingBag, DollarSign, ArrowUp, ArrowDown, Activity } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

const kpis = [
  { label: 'Total Revenue', value: 1850000, prev: 1520000, icon: <DollarSign size={22} />, color: '#0066FF', bg: '#EBF2FF', format: true },
  { label: 'Total Orders', value: 342, prev: 289, icon: <ShoppingBag size={22} />, color: '#10B981', bg: '#D1FAE5', format: false },
  { label: 'Active Partners', value: 48, prev: 41, icon: <Users size={22} />, color: '#8B5CF6', bg: '#EDE9FE', format: false },
  { label: 'Active Listings', value: 186, prev: 154, icon: <Globe size={22} />, color: '#F59E0B', bg: '#FEF3C7', format: false },
]

const revenueData = [
  { month: 'Oct', revenue: 280000, orders: 48 },
  { month: 'Nov', revenue: 320000, orders: 55 },
  { month: 'Dec', revenue: 410000, orders: 71 },
  { month: 'Jan', revenue: 295000, orders: 51 },
  { month: 'Feb', revenue: 340000, orders: 58 },
  { month: 'Mar', revenue: 405000, orders: 69 },
]
const maxRevenue = Math.max(...revenueData.map(d => d.revenue))

const topPartners = [
  { name: 'Ali Travel Agency', orders: 45, revenue: 285000, rating: 4.9 },
  { name: 'Hunza Adventures', orders: 38, revenue: 242000, rating: 4.8 },
  { name: 'Pearl Hospitality', orders: 31, revenue: 198000, rating: 4.7 },
  { name: 'Sky Visa Services', orders: 28, revenue: 145000, rating: 4.9 },
  { name: 'Northern Trails', orders: 24, revenue: 132000, rating: 4.6 },
]

const recentActivity = [
  { type: 'new_partner', text: 'Karachi Tours applied for partner', time: '5 min ago', color: '#0066FF' },
  { type: 'new_order', text: 'Order VSK-1892 placed — ₨48,000', time: '12 min ago', color: '#10B981' },
  { type: 'listing_pending', text: 'New service listing awaiting approval', time: '28 min ago', color: '#F59E0B' },
  { type: 'order_completed', text: 'Order VSK-1887 marked completed', time: '1h ago', color: '#10B981' },
  { type: 'review', text: 'New 5★ review on Hunza Valley Tour', time: '2h ago', color: '#FBBF24' },
  { type: 'partner_approved', text: 'Northern Lights Travel approved', time: '3h ago', color: '#8B5CF6' },
]

const ordersByStatus = [
  { status: 'Pending', count: 24, color: '#F59E0B' },
  { status: 'Confirmed', count: 67, color: '#0066FF' },
  { status: 'Processing', count: 45, color: '#8B5CF6' },
  { status: 'Completed', count: 189, color: '#10B981' },
  { status: 'Cancelled', count: 17, color: '#EF4444' },
]
const totalOrders = ordersByStatus.reduce((s, o) => s + o.count, 0)

export default function AdminDashboardPage() {
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Admin Dashboard</h1>
        <p>Platform overview — VSK Travel Marketplace</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {kpis.map(k => {
          const growth = Math.round(((k.value as number) - (k.prev as number)) / (k.prev as number) * 100)
          const positive = growth >= 0
          return (
            <div key={k.label} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>
                  {k.icon}
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', fontWeight: 700, color: positive ? 'var(--color-success)' : 'var(--color-error)', background: positive ? 'var(--color-success-light)' : 'var(--color-error-light)', padding: '3px 8px', borderRadius: '9999px' }}>
                  {positive ? <ArrowUp size={11} /> : <ArrowDown size={11} />}{Math.abs(growth)}%
                </span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-text)', marginBottom: '2px' }}>
                {k.format ? formatCurrency(k.value as number) : k.value}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{k.label}</p>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Revenue Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px' }}>Revenue Trend — Last 6 Months</h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-success)', fontWeight: 600 }}>
              <TrendingUp size={14} /> +21% vs last period
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px' }}>
            {revenueData.map(d => (
              <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {(d.revenue / 1000).toFixed(0)}K
                </span>
                <div style={{ width: '100%', height: `${(d.revenue / maxRevenue) * 140}px`, background: d.month === 'Mar' ? 'var(--color-primary)' : 'var(--color-primary-100)', borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', transition: 'height var(--transition-base)' }} />
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Status (donut-style) */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>Orders by Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ordersByStatus.map(o => (
              <div key={o.status}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{o.status}</span>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{o.count} ({Math.round(o.count / totalOrders * 100)}%)</span>
                </div>
                <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(o.count / totalOrders) * 100}%`, background: o.color, borderRadius: '9999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Top Partners */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>Top Partners</h3>
          {topPartners.map((p, i) => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < topPartners.length - 1 ? '1px solid var(--color-border-light)' : 'none' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-primary-100)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '1px' }}>{p.name}</p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{p.orders} orders • ★ {p.rating}</p>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '14px' }}>{formatCurrency(p.revenue)}</span>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Activity size={16} color="var(--color-primary)" />
            <h3 style={{ fontSize: '16px' }}>Recent Activity</h3>
          </div>
          {recentActivity.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: i < recentActivity.length - 1 ? '1px solid var(--color-border-light)' : 'none' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: '6px' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', marginBottom: '2px' }}>{a.text}</p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
