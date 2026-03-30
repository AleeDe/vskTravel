'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Globe, Tag, DollarSign,
  ShoppingBag, Image, LogOut, ChevronRight, Shield,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Partners', href: '/admin/partners', icon: <Users size={18} /> },
  { label: 'Listings', href: '/admin/listings', icon: <Globe size={18} /> },
  { label: 'Categories', href: '/admin/categories', icon: <Tag size={18} /> },
  { label: 'Commissions', href: '/admin/commissions', icon: <DollarSign size={18} /> },
  { label: 'Orders', href: '/admin/orders', icon: <ShoppingBag size={18} /> },
  { label: 'Content', href: '/admin/content', icon: <Image size={18} /> },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside style={{ width: '240px', flexShrink: 0, background: '#0f172a', minHeight: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column', padding: '24px 0' }}>
      {/* Admin Badge */}
      <div style={{ padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={20} color="white" />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '14px', color: 'white' }}>Admin Panel</p>
            <p style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>● Super Admin</p>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '0 12px' }}>
        {navItems.map(item => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
              borderRadius: 'var(--radius-md)', marginBottom: '2px', fontSize: '14px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
              background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              textDecoration: 'none', transition: 'all var(--transition-fast)',
            }}>
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {isActive && <ChevronRight size={14} />}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '0 12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', marginTop: '8px' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-md)', width: '100%', fontSize: '14px', color: '#F87171', background: 'none', cursor: 'pointer', border: 'none' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
