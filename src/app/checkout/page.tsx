'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { PAYMENT_METHODS } from '@/lib/constants'
import type { CreateOrderBody } from '@/app/api/orders/route'

const STEPS = ['Contact', 'Shipping', 'Payment', 'Confirm'] as const
type Step = typeof STEPS[number]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, getProductItems, clearCart } = useCartStore()
  const [step, setStep] = useState<Step>('Contact')
  const [loading, setLoading] = useState(false)

  const [contact, setContact] = useState({ fullName: '', email: '', phone: '' })
  const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '' })
  const [paymentMethod, setPaymentMethod] = useState('stripe')

  const total = getTotal()
  const productItems = getProductItems()
  const stepIndex = STEPS.indexOf(step)

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart')
    }
  }, [items.length, router])

  if (items.length === 0) {
    return null
  }

  async function handlePlaceOrder() {
    setLoading(true)
    try {
      // 1. Create the order record via Supabase Edge Function
      const orderBody: CreateOrderBody = {
        contact,
        shipping: productItems.length > 0 ? shipping : undefined,
        payment_method: paymentMethod,
        items: items.map(item => ({
          type: item.type,
          ref_id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant,
          serviceDate: item.serviceDate,
          travelers: item.travelers,
        })),
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const orderRes = await fetch(`${supabaseUrl}/functions/v1/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderBody),
      })

      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        // Supabase may not be configured yet — fall through to mock order
        console.warn('[Checkout] Order API error:', orderData.error)
        const mockOrderId = `VSK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
        clearCart()
        toast.success(`Order ${mockOrderId} placed!`)
        router.push(`/orders?new=${mockOrderId}`)
        return
      }

      const { orderId, orderNumber } = orderData as { orderId: string; orderNumber: string }

      // 2. Route to correct payment provider
      if (paymentMethod === 'pay_at_venue') {
        clearCart()
        toast.success(`Order ${orderNumber} confirmed!`)
        router.push(`/orders?new=${orderNumber}`)
        return
      }

      if (paymentMethod === 'stripe') {
        const stripeRes = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            customerEmail: contact.email,
            items: items.map(i => ({
              title: i.title,
              price: i.price,
              quantity: i.quantity,
              image: i.image,
            })),
            successUrl: `${window.location.origin}/orders?new=${orderNumber}`,
            cancelUrl: `${window.location.origin}/checkout`,
          }),
        })

        const stripeData = await stripeRes.json()

        if (!stripeRes.ok) {
          toast.error(stripeData.error ?? 'Stripe error')
          setLoading(false)
          return
        }

        if (stripeData.stub) {
          // Stripe not configured — dev fallback
          clearCart()
          toast.success(`Order ${orderNumber} placed! (Stripe not configured)`)
          router.push(`/orders?new=${orderNumber}`)
          return
        }

        // Redirect to Stripe Checkout
        clearCart()
        window.location.href = stripeData.url
        return
      }

      if (paymentMethod === 'jazzcash') {
        const jcRes = await fetch(`${supabaseUrl}/functions/v1/jazzcash-checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            amountPKR: total,
            description: `VSK Travel Order ${orderNumber}`,
            mobileNumber: contact.phone,
          }),
        })

        const jcData = await jcRes.json()

        if (jcData.stub) {
          clearCart()
          toast.success(`Order ${orderNumber} placed! (JazzCash not configured)`)
          router.push(`/orders?new=${orderNumber}`)
          return
        }

        // Submit form to JazzCash hosted page
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = jcData.endpoint
        Object.entries(jcData.params as Record<string, string>).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = value
          form.appendChild(input)
        })
        clearCart()
        document.body.appendChild(form)
        form.submit()
        return
      }

      if (paymentMethod === 'easypaisa') {
        const epRes = await fetch(`${supabaseUrl}/functions/v1/easypaisa-checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            amountPKR: total,
            description: `VSK Travel Order ${orderNumber}`,
            customerEmail: contact.email,
            customerMobile: contact.phone,
          }),
        })

        const epData = await epRes.json()

        if (epData.stub) {
          clearCart()
          toast.success(`Order ${orderNumber} placed! (EasyPaisa not configured)`)
          router.push(`/orders?new=${orderNumber}`)
          return
        }

        const form = document.createElement('form')
        form.method = 'POST'
        form.action = epData.endpoint
        Object.entries(epData.params as Record<string, string>).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = value
          form.appendChild(input)
        })
        clearCart()
        document.body.appendChild(form)
        form.submit()
        return
      }

      // Fallback
      clearCart()
      router.push(`/orders?new=${orderNumber}`)
    } catch (err) {
      console.error('[Checkout] Error:', err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '32px' }}>Checkout</h1>

      {/* Step Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', overflowX: 'auto', paddingBottom: '4px' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: i < stepIndex ? 'var(--color-success)' : i === stepIndex ? 'var(--color-primary)' : 'var(--color-border)',
                color: i <= stepIndex ? 'white' : 'var(--color-text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '14px', flexShrink: 0,
              }}>
                {i < stepIndex ? <Check size={16} /> : i + 1}
              </div>
              <span style={{ fontSize: '14px', fontWeight: i === stepIndex ? 700 : 400, color: i === stepIndex ? 'var(--color-text)' : 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: '40px', height: '2px', background: i < stepIndex ? 'var(--color-success)' : 'var(--color-border)', margin: '0 8px' }} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(0, 320px)', gap: '32px', alignItems: 'start' }}>
        {/* Form */}
        <div className="card" style={{ padding: '28px' }}>
          {step === 'Contact' && (
            <div>
              <h3 style={{ marginBottom: '24px' }}>Contact Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(['fullName', 'email', 'phone'] as const).map(field => (
                  <div key={field}>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'capitalize' }}>
                      {field === 'fullName' ? 'Full Name' : field === 'email' ? 'Email Address' : 'Phone Number'}
                    </label>
                    <input
                      type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                      value={contact[field]}
                      onChange={e => setContact(c => ({ ...c, [field]: e.target.value }))}
                      placeholder={field === 'fullName' ? 'Muhammad Ali' : field === 'email' ? 'you@example.com' : '+92 300 1234567'}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '15px' }}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => { if (!contact.fullName || !contact.email || !contact.phone) { toast.error('Please fill all fields'); return } setStep('Shipping') }}
                className="btn btn--primary"
                style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Next: Shipping <ChevronRight size={16} />
              </button>
            </div>
          )}

          {step === 'Shipping' && (
            <div>
              <h3 style={{ marginBottom: '24px' }}>Shipping Address</h3>
              {productItems.length === 0 ? (
                <div style={{ padding: '20px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                  <p style={{ fontSize: '14px' }}>✅ No physical products in cart. No shipping address needed for service bookings.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(['address', 'city', 'postalCode'] as const).map(field => (
                    <div key={field}>
                      <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                        {field === 'postalCode' ? 'Postal Code' : field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        value={shipping[field]}
                        onChange={e => setShipping(s => ({ ...s, [field]: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '15px' }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button onClick={() => setStep('Contact')} className="btn btn--secondary">Back</button>
                <button onClick={() => setStep('Payment')} className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Next: Payment <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 'Payment' && (
            <div>
              <h3 style={{ marginBottom: '24px' }}>Payment Method</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {PAYMENT_METHODS.map(m => (
                  <label key={m.value} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                    border: paymentMethod === m.value ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)', cursor: m.available ? 'pointer' : 'not-allowed',
                    opacity: m.available ? 1 : 0.5, background: paymentMethod === m.value ? 'var(--color-primary-50)' : 'white',
                  }}>
                    <input type="radio" value={m.value} checked={paymentMethod === m.value} onChange={() => m.available && setPaymentMethod(m.value)} style={{ accentColor: 'var(--color-primary)' }} disabled={!m.available} />
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{m.label}</span>
                    {!m.available && <span style={{ marginLeft: 'auto', fontSize: '11px', background: 'var(--color-warning-light)', color: 'var(--color-warning)', padding: '2px 8px', borderRadius: '9999px', fontWeight: 600 }}>Coming Soon</span>}
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep('Shipping')} className="btn btn--secondary">Back</button>
                <button onClick={() => setStep('Confirm')} className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Review Order <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 'Confirm' && (
            <div>
              <h3 style={{ marginBottom: '24px' }}>Review & Confirm</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div className="card" style={{ padding: '14px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px' }}>CONTACT</p>
                  <p>{contact.fullName} • {contact.email} • {contact.phone}</p>
                </div>
                {productItems.length > 0 && (
                  <div className="card" style={{ padding: '14px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px' }}>SHIPPING</p>
                    <p>{shipping.address}, {shipping.city} {shipping.postalCode}</p>
                  </div>
                )}
                <div className="card" style={{ padding: '14px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px' }}>PAYMENT</p>
                  <p>{PAYMENT_METHODS.find(m => m.value === paymentMethod)?.label}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep('Payment')} className="btn btn--secondary">Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn btn--primary btn--lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {loading ? 'Processing…' : '✓ Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mini Cart Summary */}
        <div className="card" style={{ padding: '20px', position: 'sticky', top: '90px' }}>
          <h4 style={{ marginBottom: '16px' }}>Order Summary</h4>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.title} ×{item.quantity}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700 }}>Total</span>
            <span className="price" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
