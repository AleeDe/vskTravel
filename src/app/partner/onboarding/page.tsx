'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronRight, Building2, Phone, CreditCard, FileCheck } from 'lucide-react'
import { toast } from 'sonner'
import { PAKISTAN_CITIES } from '@/lib/constants'

const STEPS = [
  { label: 'Business Info', icon: <Building2 size={18} /> },
  { label: 'Contact', icon: <Phone size={18} /> },
  { label: 'Banking', icon: <CreditCard size={18} /> },
  { label: 'Review', icon: <FileCheck size={18} /> },
]

export default function PartnerOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [business, setBusiness] = useState({ name: '', type: '', description: '' })
  const [contact, setContact] = useState({ phone: '', address: '', city: '', cnic: '' })
  const [banking, setBanking] = useState({ bankName: '', accountNumber: '' })

  const businessTypes = ['Travel Agency', 'Hotel / Accommodation', 'Tour Operator', 'Visa Consultant', 'Car Rental', 'Other']

  async function handleSubmit() {
    setLoading(true)
    // TODO: Insert into partners table via Supabase
    await new Promise(r => setTimeout(r, 1500))
    toast.success('Application submitted! We will review and approve within 24-48 hours.')
    router.push('/partner/dashboard')
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '640px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="label">Partner Program</span>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Become a VSK Partner</h1>
          <p>List your services and products to thousands of travelers</p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
          {STEPS.map((s, i) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: i < step ? 'var(--color-success)' : i === step ? 'var(--color-primary)' : 'var(--color-border)',
                  color: i <= step ? 'white' : 'var(--color-text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {i < step ? <Check size={18} /> : s.icon}
                </div>
                <span style={{ fontSize: '11px', fontWeight: i === step ? 700 : 400, color: i === step ? 'var(--color-text)' : 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ width: '60px', height: '2px', background: i < step ? 'var(--color-success)' : 'var(--color-border)', margin: '0 4px', marginBottom: '20px' }} />}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '32px' }}>
          {/* Step 0: Business Info */}
          {step === 0 && (
            <div>
              <h3 style={{ marginBottom: '24px' }}>Business Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Business Name *</label>
                  <input value={business.name} onChange={e => setBusiness(b => ({ ...b, name: e.target.value }))} placeholder="e.g. Ali Travel Agency" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '15px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Business Type *</label>
                  <select value={business.type} onChange={e => setBusiness(b => ({ ...b, type: e.target.value }))} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '15px' }}>
                    <option value="">Select type…</option>
                    {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Business Description *</label>
                  <textarea value={business.description} onChange={e => setBusiness(b => ({ ...b, description: e.target.value }))} rows={4} placeholder="Describe your services, experience and what makes you unique…" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '15px', resize: 'vertical' }} />
                </div>
              </div>
              <button
                onClick={() => { if (!business.name || !business.type || !business.description) { toast.error('Please fill all fields'); return } setStep(1) }}
                className="btn btn--primary"
                style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Step 1: Contact */}
          {step === 1 && (
            <div>
              <h3 style={{ marginBottom: '24px' }}>Contact Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Phone Number *</label>
                  <input value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} placeholder="+92 300 1234567" type="tel" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '15px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>City *</label>
                  <select value={contact.city} onChange={e => setContact(c => ({ ...c, city: e.target.value }))} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '15px' }}>
                    <option value="">Select city…</option>
                    {PAKISTAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Address</label>
                  <input value={contact.address} onChange={e => setContact(c => ({ ...c, address: e.target.value }))} placeholder="Street address" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '15px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>CNIC</label>
                  <input value={contact.cnic} onChange={e => setContact(c => ({ ...c, cnic: e.target.value }))} placeholder="12345-1234567-1" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '15px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button onClick={() => setStep(0)} className="btn btn--secondary">Back</button>
                <button onClick={() => { if (!contact.phone || !contact.city) { toast.error('Phone and city required'); return } setStep(2) }} className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Banking */}
          {step === 2 && (
            <div>
              <h3 style={{ marginBottom: '8px' }}>Banking Details</h3>
              <p style={{ marginBottom: '24px', fontSize: '14px' }}>For receiving your earnings from VSK Travel</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Bank Name</label>
                  <select value={banking.bankName} onChange={e => setBanking(b => ({ ...b, bankName: e.target.value }))} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '15px' }}>
                    <option value="">Select bank…</option>
                    {['HBL', 'MCB', 'UBL', 'Meezan Bank', 'Allied Bank', 'Standard Chartered', 'Bank Alfalah', 'Askari Bank', 'EasyPaisa', 'JazzCash'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Account Number / IBAN</label>
                  <input value={banking.accountNumber} onChange={e => setBanking(b => ({ ...b, accountNumber: e.target.value }))} placeholder="PK36SCBL0000001123456702" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '15px' }} />
                </div>
                <div style={{ padding: '14px', background: 'var(--color-warning-light)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  ⚠️ Banking details can be updated later. You can skip this step for now.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button onClick={() => setStep(1)} className="btn btn--secondary">Back</button>
                <button onClick={() => setStep(3)} className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div>
              <h3 style={{ marginBottom: '24px' }}>Review & Submit</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div className="card" style={{ padding: '14px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px' }}>BUSINESS</p>
                  <p style={{ fontWeight: 600 }}>{business.name}</p>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{business.type}</p>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{business.description}</p>
                </div>
                <div className="card" style={{ padding: '14px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px' }}>CONTACT</p>
                  <p style={{ fontSize: '14px' }}>{contact.phone} • {contact.city}</p>
                  {contact.address && <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{contact.address}</p>}
                </div>
                {banking.bankName && (
                  <div className="card" style={{ padding: '14px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px' }}>BANKING</p>
                    <p style={{ fontSize: '14px' }}>{banking.bankName} — {banking.accountNumber}</p>
                  </div>
                )}
                <div style={{ padding: '14px', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-md)', fontSize: '14px' }}>
                  ✅ Your application will be reviewed within <strong>24-48 hours</strong>. You will receive an email once approved.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep(2)} className="btn btn--secondary">Back</button>
                <button onClick={handleSubmit} disabled={loading} className="btn btn--primary btn--lg">
                  {loading ? 'Submitting…' : '🚀 Submit Application'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
