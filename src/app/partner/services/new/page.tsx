'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { PAKISTAN_CITIES } from '@/lib/constants'

const SERVICE_CATEGORIES = ['Flights', 'Hotels', 'Tour Packages', 'Visa Assistance', 'Car Rentals', 'Travel Insurance']

export default function NewServicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', category: '', description: '', shortDescription: '',
    basePrice: '', salePrice: '', currency: 'PKR',
    location: '', city: '', duration: '', maxCapacity: '',
  })
  const [includes, setIncludes] = useState([''])
  const [excludes, setExcludes] = useState([''])
  const [highlights, setHighlights] = useState([''])

  function setField(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function updateList(list: string[], setList: (v: string[]) => void, index: number, value: string) {
    const updated = [...list]
    updated[index] = value
    setList(updated)
  }

  function addToList(list: string[], setList: (v: string[]) => void) {
    setList([...list, ''])
  }

  function removeFromList(list: string[], setList: (v: string[]) => void, index: number) {
    setList(list.filter((_, i) => i !== index))
  }

  async function handleSubmit(status: 'draft' | 'pending') {
    if (!form.title || !form.category || !form.basePrice) { toast.error('Title, category and price are required'); return }
    setLoading(true)
    // TODO: Insert into services table via Supabase
    await new Promise(r => setTimeout(r, 1000))
    toast.success(status === 'draft' ? 'Saved as draft' : 'Submitted for review!')
    router.push('/partner/services')
  }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '15px' }
  const labelStyle = { fontSize: '13px', fontWeight: 600 as const, display: 'block' as const, marginBottom: '6px' }

  return (
    <div style={{ padding: '32px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Add New Service</h1>
        <p>Fill in the details to list your service on VSK Travel</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Basic Info */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '15px', color: 'var(--color-primary)' }}>Basic Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Service Title *</label>
              <input value={form.title} onChange={e => setField('title', e.target.value)} placeholder="e.g. Hunza Valley 5-Day Tour" style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Category *</label>
                <select value={form.category} onChange={e => setField('category', e.target.value)} style={inputStyle}>
                  <option value="">Select category…</option>
                  {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Duration</label>
                <input value={form.duration} onChange={e => setField('duration', e.target.value)} placeholder="e.g. 5 Days / 4 Nights" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Short Description</label>
              <input value={form.shortDescription} onChange={e => setField('shortDescription', e.target.value)} placeholder="One-line summary (shown in listings)" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Full Description *</label>
              <textarea value={form.description} onChange={e => setField('description', e.target.value)} rows={5} placeholder="Detailed description of your service…" style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* Pricing & Location */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '15px', color: 'var(--color-primary)' }}>Pricing & Location</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Base Price (PKR) *</label>
              <input type="number" value={form.basePrice} onChange={e => setField('basePrice', e.target.value)} placeholder="35000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Sale Price (optional)</label>
              <input type="number" value={form.salePrice} onChange={e => setField('salePrice', e.target.value)} placeholder="Leave blank if no discount" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <select value={form.city} onChange={e => setField('city', e.target.value)} style={inputStyle}>
                <option value="">Select city…</option>
                {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Location / Landmark</label>
              <input value={form.location} onChange={e => setField('location', e.target.value)} placeholder="e.g. Karimabad, Hunza" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Max Capacity</label>
              <input type="number" value={form.maxCapacity} onChange={e => setField('maxCapacity', e.target.value)} placeholder="20" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Includes / Excludes */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '15px', color: 'var(--color-primary)' }}>Inclusions & Exclusions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={labelStyle}>What&apos;s Included</label>
              {includes.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  <input value={item} onChange={e => updateList(includes, setIncludes, i, e.target.value)} placeholder="e.g. Hotel accommodation" style={{ ...inputStyle, flex: 1 }} />
                  {includes.length > 1 && <button onClick={() => removeFromList(includes, setIncludes, i)} className="btn btn--ghost btn--icon" style={{ color: 'var(--color-error)' }}><Trash2 size={14} /></button>}
                </div>
              ))}
              <button onClick={() => addToList(includes, setIncludes)} className="btn btn--ghost btn--sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Plus size={14} /> Add Item</button>
            </div>
            <div>
              <label style={labelStyle}>What&apos;s Excluded</label>
              {excludes.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  <input value={item} onChange={e => updateList(excludes, setExcludes, i, e.target.value)} placeholder="e.g. Airfare" style={{ ...inputStyle, flex: 1 }} />
                  {excludes.length > 1 && <button onClick={() => removeFromList(excludes, setExcludes, i)} className="btn btn--ghost btn--icon" style={{ color: 'var(--color-error)' }}><Trash2 size={14} /></button>}
                </div>
              ))}
              <button onClick={() => addToList(excludes, setExcludes)} className="btn btn--ghost btn--sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Plus size={14} /> Add Item</button>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '15px', color: 'var(--color-primary)' }}>Images</h3>
          <div style={{ border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '40px', textAlign: 'center', cursor: 'pointer' }}>
            <Upload size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Click to upload or drag & drop</p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>PNG, JPG, WebP up to 5MB each (max 10 images)</p>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
            Image upload will be connected to Supabase Storage in Phase 6
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => router.push('/partner/services')} className="btn btn--ghost">Cancel</button>
          <button onClick={() => handleSubmit('draft')} disabled={loading} className="btn btn--secondary">Save as Draft</button>
          <button onClick={() => handleSubmit('pending')} disabled={loading} className="btn btn--primary">
            {loading ? 'Submitting…' : 'Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  )
}
