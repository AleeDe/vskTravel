'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react'
import { toast } from 'sonner'

type Category = { id: string; name: string; slug: string; icon: string; type: 'service' | 'product'; count: number; is_active: boolean }

const INITIAL: Category[] = [
  { id: '1', name: 'Flights', slug: 'flights', icon: '✈️', type: 'service', count: 12, is_active: true },
  { id: '2', name: 'Hotels', slug: 'hotels', icon: '🏨', type: 'service', count: 28, is_active: true },
  { id: '3', name: 'Tour Packages', slug: 'tour-packages', icon: '🗺️', type: 'service', count: 45, is_active: true },
  { id: '4', name: 'Visa Assistance', slug: 'visa-assistance', icon: '📋', type: 'service', count: 8, is_active: true },
  { id: '5', name: 'Car Rentals', slug: 'car-rentals', icon: '🚗', type: 'service', count: 6, is_active: true },
  { id: '6', name: 'Travel Insurance', slug: 'travel-insurance', icon: '🛡️', type: 'service', count: 3, is_active: false },
  { id: '7', name: 'Luggage & Bags', slug: 'luggage', icon: '🧳', type: 'product', count: 18, is_active: true },
  { id: '8', name: 'Travel Gear', slug: 'travel-gear', icon: '⛺', type: 'product', count: 12, is_active: true },
  { id: '9', name: 'Accessories', slug: 'accessories', icon: '🎒', type: 'product', count: 24, is_active: true },
  { id: '10', name: 'Electronics', slug: 'electronics', icon: '📱', type: 'product', count: 9, is_active: true },
]

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(INITIAL)
  const [tab, setTab] = useState<'service' | 'product'>('service')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editIcon, setEditIcon] = useState('')
  const [addName, setAddName] = useState('')
  const [addIcon, setAddIcon] = useState('')
  const [addSlug, setAddSlug] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = categories.filter(c => c.type === tab)

  function startEdit(c: Category) { setEditId(c.id); setEditName(c.name); setEditIcon(c.icon) }
  function saveEdit() {
    setCategories(prev => prev.map(c => c.id === editId ? { ...c, name: editName, icon: editIcon } : c))
    setEditId(null)
    toast.success('Category updated')
  }
  function toggleActive(id: string) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c))
  }
  function addCategory() {
    if (!addName || !addSlug) { toast.error('Name and slug required'); return }
    setCategories(prev => [...prev, { id: String(Date.now()), name: addName, slug: addSlug, icon: addIcon || '📌', type: tab, count: 0, is_active: true }])
    setAddName(''); setAddSlug(''); setAddIcon(''); setShowAdd(false)
    toast.success('Category added')
  }
  function deleteCategory(id: string) {
    setCategories(prev => prev.filter(c => c.id !== id))
    toast.success('Category deleted')
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Categories</h1>
          <p>Manage service and product categories</p>
        </div>
        <button onClick={() => setShowAdd(s => !s)} className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '24px', gap: '4px' }}>
        {(['service', 'product'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600, color: tab === t ? 'var(--color-primary)' : 'var(--color-text-muted)', borderBottom: tab === t ? '2px solid var(--color-primary)' : '2px solid transparent', background: 'none', cursor: 'pointer', marginBottom: '-1px', textTransform: 'capitalize' }}>
            {t} Categories ({categories.filter(c => c.type === t).length})
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="card" style={{ padding: '20px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Icon (emoji)</label>
            <input value={addIcon} onChange={e => setAddIcon(e.target.value)} placeholder="✈️" style={{ width: '60px', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '20px', textAlign: 'center' }} />
          </div>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Category Name *</label>
            <input value={addName} onChange={e => setAddName(e.target.value)} placeholder="e.g. Boat Tours" style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '14px' }} />
          </div>
          <div style={{ flex: 1, minWidth: '140px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Slug *</label>
            <input value={addSlug} onChange={e => setAddSlug(e.target.value)} placeholder="e.g. boat-tours" style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '14px' }} />
          </div>
          <button onClick={addCategory} className="btn btn--primary btn--sm"><Check size={14} /> Add</button>
          <button onClick={() => setShowAdd(false)} className="btn btn--ghost btn--sm"><X size={14} /></button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filtered.map(c => (
          <div key={c.id} className="card" style={{ padding: '18px', opacity: c.is_active ? 1 : 0.6 }}>
            {editId === c.id ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <input value={editIcon} onChange={e => setEditIcon(e.target.value)} style={{ width: '48px', fontSize: '20px', padding: '4px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }} />
                <input value={editName} onChange={e => setEditName(e.target.value)} style={{ flex: 1, padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '14px' }} />
                <button onClick={saveEdit} className="btn btn--primary btn--icon" style={{ width: '32px', height: '32px' }}><Check size={14} /></button>
                <button onClick={() => setEditId(null)} className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px' }}><X size={14} /></button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '32px' }}>{c.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '2px' }}>{c.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{c.count} listings • /{c.slug}</p>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => startEdit(c)} className="btn btn--ghost btn--icon" style={{ width: '30px', height: '30px' }}><Edit2 size={13} /></button>
                  <button onClick={() => toggleActive(c.id)} className="btn btn--ghost btn--icon" style={{ width: '30px', height: '30px', color: c.is_active ? 'var(--color-success)' : 'var(--color-text-muted)' }} title={c.is_active ? 'Deactivate' : 'Activate'}>
                    {c.is_active ? <Check size={13} /> : <X size={13} />}
                  </button>
                  <button onClick={() => deleteCategory(c.id)} className="btn btn--ghost btn--icon" style={{ width: '30px', height: '30px', color: 'var(--color-error)' }}><Trash2 size={13} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
