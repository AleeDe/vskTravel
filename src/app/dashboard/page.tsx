import Link from 'next/link'
import { ShoppingBag, Calendar, Heart, User } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

// In production: fetch from Supabase using server component
export const metadata = { title: 'My Dashboard' }

export default function DashboardPage() {
  // Placeholder stats — replaced with Supabase data in Phase 6
  const stats = [
    { label: 'Total Orders', value: '3', icon: <ShoppingBag size={22} />, color: '#0066FF', bg: '#EBF2FF', href: ROUTES.orders },
    { label: 'Upcoming Trips', value: '1', icon: <Calendar size={22} />, color: '#10B981', bg: '#D1FAE5', href: ROUTES.orders },
    { label: 'Saved Items', value: '5', icon: <Heart size={22} />, color: '#EF4444', bg: '#FEE2E2', href: '#' },
  ]

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Welcome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700 }}>
          M
        </div>
        <div>
          <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', marginBottom: '4px' }}>Welcome back!</h1>
          <p>Manage your bookings, trips and profile</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {stats.map(s => (
          <Link key={s.label} href={s.href} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>{s.value}</p>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px' }}>Recent Orders</h2>
          <Link href={ROUTES.orders} style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: 600 }}>View All →</Link>
        </div>

        {[
          { id: 'VSK-1234-ABCD', title: 'Hunza Valley 5-Day Tour', status: 'Confirmed', amount: 35000, date: 'Mar 10, 2026' },
          { id: 'VSK-1235-EFGH', title: 'Samsonite Cabin Trolley', status: 'Delivered', amount: 22000, date: 'Feb 20, 2026' },
        ].map(order => (
          <div key={order.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '14px' }}>{order.title}</p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{order.id} • {order.date}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: order.status === 'Delivered' ? 'var(--color-success)' : 'var(--color-primary)' }}>{order.status}</span>
              <span style={{ fontWeight: 700 }}>{formatCurrency(order.amount)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Edit Profile', href: '#', icon: <User size={18} /> },
            { label: 'Browse Services', href: ROUTES.services, icon: <Calendar size={18} /> },
            { label: 'Shop Products', href: ROUTES.products, icon: <ShoppingBag size={18} /> },
          ].map(action => (
            <Link key={action.label} href={action.href} className="btn btn--secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              {action.icon} {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
