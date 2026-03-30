'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Plus, Edit2, Eye, Trash2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const PRODUCTS = [
  { id: '1', title: 'Samsonite Cabin Trolley 55cm', category: 'Luggage & Bags', price: 22000, stock: 15, status: 'active', sold: 12, created_at: '2026-01-05' },
  { id: '2', title: '65L Trekking Backpack', category: 'Travel Gear', price: 9500, stock: 8, status: 'active', sold: 7, created_at: '2026-02-10' },
  { id: '3', title: 'Memory Foam Neck Pillow', category: 'Accessories', price: 2800, stock: 0, status: 'active', sold: 45, created_at: '2026-01-20' },
]

export default function PartnerProductsPage() {
  const [products] = useState(PRODUCTS)

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>My Products</h1>
          <p>Manage your travel product listings</p>
        </div>
        <Link href="/partner/products/new" className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Add New Product
        </Link>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '650px' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                {['Product', 'Category', 'Price', 'Stock', 'Sold', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <p style={{ fontWeight: 600, fontSize: '14px' }}>{p.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Added {formatDate(p.created_at)}</p>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>{p.category}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(p.price)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: p.stock === 0 ? 'var(--color-error)' : p.stock <= 5 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                      {p.stock === 0 ? 'Out of Stock' : p.stock}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600 }}>{p.sold}</td>
                  <td style={{ padding: '14px 16px' }}><Badge variant="success">{p.status}</Badge></td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <Link href={`/products/${p.id}`} className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px' }} title="Preview"><Eye size={15} /></Link>
                      <Link href={`/partner/products/${p.id}/edit`} className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px' }} title="Edit"><Edit2 size={15} /></Link>
                      <button className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px', color: 'var(--color-error)' }} title="Delete" onClick={() => toast.error('Delete confirmation needed')}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
