'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'

const PRODUCT_CATEGORIES = ['Luggage & Bags', 'Travel Gear', 'Accessories', 'Travel Clothing', 'Electronics']

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', category: '', description: '', shortDescription: '', basePrice: '', salePrice: '', sku: '', stock: '', weight: '' })
  const [variants, setVariants] = useState<{ name: string; options: string }[]>([])

  function setField(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }

  async function handleSubmit(status: 'draft' | 'pending') {
    if (!form.title || !form.category || !form.basePrice) { toast.error('Title, category and price required'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success(status === 'draft' ? 'Saved as draft' : 'Submitted for review!')
    router.push('/partner/products')
  }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '15px' }
  const labelStyle = { fontSize: '13px', fontWeight: 600 as const, display: 'block' as const, marginBottom: '6px' }

  return (
    <div style={{ padding: '32px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Add New Product</h1>
        <p>List a travel product on VSK Travel store</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Basic Info */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '15px', color: 'var(--color-primary)' }}>Product Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Product Title *</label>
              <input value={form.title} onChange={e => setField('title', e.target.value)} placeholder="e.g. Samsonite Cabin Trolley 55cm" style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Category *</label>
                <select value={form.category} onChange={e => setField('category', e.target.value)} style={inputStyle}>
                  <option value="">Select category…</option>
                  {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>SKU</label>
                <input value={form.sku} onChange={e => setField('sku', e.target.value)} placeholder="e.g. SAM-55-BLK" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Short Description</label>
              <input value={form.shortDescription} onChange={e => setField('shortDescription', e.target.value)} placeholder="One-line summary" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Full Description *</label>
              <textarea value={form.description} onChange={e => setField('description', e.target.value)} rows={5} placeholder="Detailed product description…" style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '15px', color: 'var(--color-primary)' }}>Pricing & Inventory</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Base Price (PKR) *</label>
              <input type="number" value={form.basePrice} onChange={e => setField('basePrice', e.target.value)} placeholder="22000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Sale Price (optional)</label>
              <input type="number" value={form.salePrice} onChange={e => setField('salePrice', e.target.value)} placeholder="Leave blank if no discount" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Stock Quantity *</label>
              <input type="number" value={form.stock} onChange={e => setField('stock', e.target.value)} placeholder="15" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Weight (kg)</label>
              <input type="number" value={form.weight} onChange={e => setField('weight', e.target.value)} placeholder="2.5" style={inputStyle} step="0.1" />
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', color: 'var(--color-primary)' }}>Product Variants</h3>
            <button onClick={() => setVariants(v => [...v, { name: '', options: '' }])} className="btn btn--secondary btn--sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={14} /> Add Variant
            </button>
          </div>
          {variants.length === 0 ? (
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>No variants added. Click &quot;Add Variant&quot; to add sizes, colors etc.</p>
          ) : variants.map((v, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '10px', marginBottom: '10px', alignItems: 'flex-end' }}>
              <div>
                <label style={labelStyle}>Variant Type</label>
                <input value={v.name} onChange={e => { const u = [...variants]; u[i].name = e.target.value; setVariants(u) }} placeholder="e.g. Color" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Options (comma separated)</label>
                <input value={v.options} onChange={e => { const u = [...variants]; u[i].options = e.target.value; setVariants(u) }} placeholder="e.g. Black, Navy, Red" style={inputStyle} />
              </div>
              <button onClick={() => setVariants(variants.filter((_, j) => j !== i))} className="btn btn--ghost btn--icon" style={{ color: 'var(--color-error)' }}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>

        {/* Images */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '15px', color: 'var(--color-primary)' }}>Product Images</h3>
          <div style={{ border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '40px', textAlign: 'center', cursor: 'pointer' }}>
            <Upload size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Click to upload or drag & drop</p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>PNG, JPG, WebP up to 5MB each (max 10 images)</p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => router.push('/partner/products')} className="btn btn--ghost">Cancel</button>
          <button onClick={() => handleSubmit('draft')} disabled={loading} className="btn btn--secondary">Save as Draft</button>
          <button onClick={() => handleSubmit('pending')} disabled={loading} className="btn btn--primary">
            {loading ? 'Submitting…' : 'Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  )
}
