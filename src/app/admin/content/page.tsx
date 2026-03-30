'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

type Banner = { id: string; title: string; subtitle: string; position: string; is_active: boolean; link_url: string }

const BANNERS_INITIAL: Banner[] = [
  { id: '1', title: 'Summer Sale — Up to 30% Off', subtitle: 'Book tour packages before June 30', position: 'hero', is_active: true, link_url: '/services?category=tour-packages' },
  { id: '2', title: 'New: Visa Assistance Services', subtitle: 'Fast, reliable visa processing', position: 'promo', is_active: true, link_url: '/services?category=visa-assistance' },
  { id: '3', title: 'Travel Gear Sale', subtitle: 'Up to 20% off on luggage & bags', position: 'promo', is_active: false, link_url: '/products?category=luggage' },
]

const ANNOUNCEMENT_DEFAULT = '✈️ Summer Sale: Up to 30% off on all tour packages! Use code SUMMER30'

export default function AdminContentPage() {
  const [banners, setBanners] = useState(BANNERS_INITIAL)
  const [announcement, setAnnouncement] = useState(ANNOUNCEMENT_DEFAULT)
  const [editingAnnouncement, setEditingAnnouncement] = useState(false)
  const [showAddBanner, setShowAddBanner] = useState(false)
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', position: 'hero', link_url: '' })

  function toggleBanner(id: string) {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, is_active: !b.is_active } : b))
    toast.success('Banner updated')
  }

  function deleteBanner(id: string) {
    setBanners(prev => prev.filter(b => b.id !== id))
    toast.success('Banner deleted')
  }

  function addBanner() {
    if (!newBanner.title) { toast.error('Title required'); return }
    setBanners(prev => [...prev, { ...newBanner, id: String(Date.now()), is_active: true }])
    setNewBanner({ title: '', subtitle: '', position: 'hero', link_url: '' })
    setShowAddBanner(false)
    toast.success('Banner added')
  }

  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '14px' }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Content Management</h1>
        <p>Manage banners, announcements and featured items</p>
      </div>

      {/* Announcement Bar */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px' }}>Announcement Bar</h3>
          {!editingAnnouncement && (
            <button onClick={() => setEditingAnnouncement(true)} className="btn btn--secondary btn--sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Edit2 size={14} /> Edit
            </button>
          )}
        </div>
        <div style={{ padding: '12px 16px', background: '#0066FF', borderRadius: 'var(--radius-md)', marginBottom: '12px' }}>
          <p style={{ color: 'white', fontSize: '14px', textAlign: 'center' }}>{announcement}</p>
        </div>
        {editingAnnouncement && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <input value={announcement} onChange={e => setAnnouncement(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <button onClick={() => { setEditingAnnouncement(false); toast.success('Announcement saved') }} className="btn btn--primary btn--sm">Save</button>
            <button onClick={() => setEditingAnnouncement(false)} className="btn btn--ghost btn--sm">Cancel</button>
          </div>
        )}
      </div>

      {/* Banners */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px' }}>Banners & Promotions</h3>
          <button onClick={() => setShowAddBanner(s => !s)} className="btn btn--primary btn--sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Plus size={14} /> Add Banner
          </button>
        </div>

        {showAddBanner && (
          <div style={{ padding: '16px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Title *</label>
                <input value={newBanner.title} onChange={e => setNewBanner(b => ({ ...b, title: e.target.value }))} placeholder="Banner title" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Subtitle</label>
                <input value={newBanner.subtitle} onChange={e => setNewBanner(b => ({ ...b, subtitle: e.target.value }))} placeholder="Short description" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Position</label>
                <select value={newBanner.position} onChange={e => setNewBanner(b => ({ ...b, position: e.target.value }))} style={inputStyle}>
                  <option value="hero">Hero</option>
                  <option value="promo">Promo</option>
                  <option value="sidebar">Sidebar</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Link URL</label>
                <input value={newBanner.link_url} onChange={e => setNewBanner(b => ({ ...b, link_url: e.target.value }))} placeholder="/services?category=..." style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={addBanner} className="btn btn--primary btn--sm">Add Banner</button>
              <button onClick={() => setShowAddBanner(false)} className="btn btn--ghost btn--sm">Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {banners.map(b => (
            <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', opacity: b.is_active ? 1 : 0.6, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <p style={{ fontWeight: 700, fontSize: '15px' }}>{b.title}</p>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px', background: 'var(--color-primary-50)', color: 'var(--color-primary)', textTransform: 'uppercase' }}>{b.position}</span>
                  {!b.is_active && <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)' }}>INACTIVE</span>}
                </div>
                {b.subtitle && <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{b.subtitle}</p>}
                {b.link_url && <p style={{ fontSize: '12px', color: 'var(--color-primary)', marginTop: '2px' }}>{b.link_url}</p>}
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => toggleBanner(b.id)} className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px', color: b.is_active ? 'var(--color-success)' : 'var(--color-text-muted)' }} title={b.is_active ? 'Deactivate' : 'Activate'}>
                  {b.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => deleteBanner(b.id)} className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px', color: 'var(--color-error)' }}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
