'use client'

import { useState } from 'react'
import { Search, Check, X, Eye, Edit2, DollarSign } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const PARTNERS = [
  { id: '1', business_name: 'Ali Travel Agency', owner: 'Muhammad Ali', email: 'ali@alitravels.pk', city: 'Lahore', type: 'Travel Agency', status: 'approved', commission_rate: 10, total_orders: 45, total_revenue: 285000, rating: 4.9, created_at: '2025-10-15' },
  { id: '2', business_name: 'Hunza Adventures', owner: 'Karim Shah', email: 'karim@hunzaadv.com', city: 'Gilgit', type: 'Tour Operator', status: 'approved', commission_rate: 10, total_orders: 38, total_revenue: 242000, rating: 4.8, created_at: '2025-11-02' },
  { id: '3', business_name: 'Karachi Tours Co.', owner: 'Ahmed Raza', email: 'ahmed@kartoursco.pk', city: 'Karachi', type: 'Travel Agency', status: 'pending', commission_rate: 10, total_orders: 0, total_revenue: 0, rating: 0, created_at: '2026-03-24' },
  { id: '4', business_name: 'Sky Visa Services', owner: 'Sara Khan', email: 'sara@skyvisa.pk', city: 'Islamabad', type: 'Visa Consultant', status: 'approved', commission_rate: 8, total_orders: 28, total_revenue: 145000, rating: 4.9, created_at: '2025-12-10' },
  { id: '5', business_name: 'Northern Lights Travel', owner: 'Bilal Hussain', email: 'bilal@nltravel.pk', city: 'Peshawar', type: 'Tour Operator', status: 'pending', commission_rate: 10, total_orders: 0, total_revenue: 0, rating: 0, created_at: '2026-03-26' },
  { id: '6', business_name: 'Old Roads Rentals', owner: 'Zara Malik', email: 'zara@oldroads.pk', city: 'Rawalpindi', type: 'Car Rental', status: 'rejected', commission_rate: 10, total_orders: 0, total_revenue: 0, rating: 0, created_at: '2026-03-10' },
]

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'primary'> = {
  approved: 'success', pending: 'warning', rejected: 'error', suspended: 'error',
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState(PARTNERS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<typeof PARTNERS[0] | null>(null)
  const [commissionModal, setCommissionModal] = useState<typeof PARTNERS[0] | null>(null)
  const [newRate, setNewRate] = useState('')

  const filtered = partners.filter(p => {
    const matchSearch = p.business_name.toLowerCase().includes(search.toLowerCase()) || p.owner.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  function updateStatus(id: string, status: string) {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    toast.success(`Partner status updated to ${status}`)
    setSelected(null)
  }

  function updateCommission() {
    if (!newRate || isNaN(Number(newRate))) { toast.error('Enter valid rate'); return }
    setPartners(prev => prev.map(p => p.id === commissionModal?.id ? { ...p, commission_rate: Number(newRate) } : p))
    toast.success(`Commission rate updated to ${newRate}%`)
    setCommissionModal(null)
    setNewRate('')
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Partners</h1>
        <p>Manage partner applications, approvals and commission rates</p>
      </div>

      {/* Pending alert */}
      {partners.filter(p => p.status === 'pending').length > 0 && (
        <div style={{ padding: '14px 18px', background: 'var(--color-warning-light)', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-md)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 700, color: 'var(--color-warning)' }}>⚠️ {partners.filter(p => p.status === 'pending').length} partner applications pending review</span>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '8px 12px', flex: 1, minWidth: '200px', background: 'white' }}>
          <Search size={16} color="var(--color-text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search partners…" style={{ border: 'none', fontSize: '14px', flex: 1 }} />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'pending', 'approved', 'rejected', 'suspended'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 600, border: '1px solid', borderColor: filter === s ? 'var(--color-primary)' : 'var(--color-border)', background: filter === s ? 'var(--color-primary)' : 'white', color: filter === s ? 'white' : 'var(--color-text-secondary)', cursor: 'pointer', textTransform: 'capitalize' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                {['Business', 'Type', 'City', 'Orders', 'Revenue', 'Commission', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <p style={{ fontWeight: 600, fontSize: '14px' }}>{p.business_name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{p.owner} • {p.email}</p>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>{p.type}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px' }}>{p.city}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600 }}>{p.total_orders}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>{p.total_revenue > 0 ? formatCurrency(p.total_revenue) : '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => { setCommissionModal(p); setNewRate(String(p.commission_rate)) }} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {p.commission_rate}% <Edit2 size={12} />
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px' }}><Badge variant={statusVariant[p.status]}>{p.status}</Badge></td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => setSelected(p)} className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px' }} title="View"><Eye size={15} /></button>
                      {p.status === 'pending' && <>
                        <button onClick={() => updateStatus(p.id, 'approved')} className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px', color: 'var(--color-success)' }} title="Approve"><Check size={15} /></button>
                        <button onClick={() => updateStatus(p.id, 'rejected')} className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px', color: 'var(--color-error)' }} title="Reject"><X size={15} /></button>
                      </>}
                      {p.status === 'approved' && (
                        <button onClick={() => updateStatus(p.id, 'suspended')} className="btn btn--ghost btn--icon" style={{ width: '32px', height: '32px', color: 'var(--color-warning)' }} title="Suspend"><X size={15} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Partner Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.business_name} size="md">
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Owner', value: selected.owner },
                { label: 'Email', value: selected.email },
                { label: 'City', value: selected.city },
                { label: 'Business Type', value: selected.type },
                { label: 'Member Since', value: formatDate(selected.created_at) },
                { label: 'Commission Rate', value: `${selected.commission_rate}%` },
                { label: 'Total Orders', value: String(selected.total_orders) },
                { label: 'Total Revenue', value: selected.total_revenue > 0 ? formatCurrency(selected.total_revenue) : '—' },
              ].map(item => (
                <div key={item.label} style={{ padding: '12px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>{item.label}</p>
                  <p style={{ fontWeight: 600, fontSize: '14px' }}>{item.value}</p>
                </div>
              ))}
            </div>
            {selected.status === 'pending' && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => updateStatus(selected.id, 'approved')} className="btn btn--primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Check size={16} /> Approve Partner
                </button>
                <button onClick={() => updateStatus(selected.id, 'rejected')} className="btn btn--secondary" style={{ flex: 1, color: 'var(--color-error)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <X size={16} /> Reject
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Commission Modal */}
      <Modal open={!!commissionModal} onClose={() => setCommissionModal(null)} title="Edit Commission Rate" size="sm">
        {commissionModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '14px' }}>Set commission rate for <strong>{commissionModal.business_name}</strong></p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="number" value={newRate} onChange={e => setNewRate(e.target.value)} min="0" max="50" step="0.5" style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '16px' }} />
              <DollarSign size={18} color="var(--color-text-muted)" />
              <span style={{ fontWeight: 600 }}>%</span>
            </div>
            <button onClick={updateCommission} className="btn btn--primary">Save Rate</button>
          </div>
        )}
      </Modal>
    </div>
  )
}
