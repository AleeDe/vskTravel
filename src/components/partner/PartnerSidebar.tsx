'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Globe,
  Package,
  ShoppingBag,
  DollarSign,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/partner/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Services', href: '/partner/services', icon: <Globe size={18} /> },
  { label: 'Products', href: '/partner/products', icon: <Package size={18} /> },
  { label: 'Orders', href: '/partner/orders', icon: <ShoppingBag size={18} /> },
  { label: 'Earnings', href: '/partner/earnings', icon: <DollarSign size={18} /> },
  { label: 'Settings', href: '/partner/settings', icon: <Settings size={18} /> },
]

export default function PartnerSidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: '240px',
      flexShrink: 0,
      background: 'white',
      borderRight: '1px solid var(--color-border)',
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
    }}>
      {/* Partner Badge */}
      <div style={{ padding: '0 20px 20px', borderBottom: '1px solid var(--color-border)', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px' }}>
            P
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '14px' }}>Partner Portal</p>
            <p style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600 }}>● Active</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {navItems.map(item => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '2px',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                background: isActive ? 'var(--color-primary-50)' : 'transparent',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {isActive && <ChevronRight size={14} />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '0 12px', borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '8px' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-md)', width: '100%', fontSize: '14px', color: 'var(--color-error)', background: 'none', cursor: 'pointer', border: 'none' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
