'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, getProductItems, getServiceItems } = useCartStore()

  const productItems = getProductItems()
  const serviceItems = getServiceItems()
  const total = getTotal()

  if (items.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px', textAlign: 'center' }}>
        <ShoppingBag size={64} color="var(--color-text-muted)" style={{ margin: '0 auto 24px' }} />
        <h2 style={{ marginBottom: '12px' }}>Your cart is empty</h2>
        <p style={{ marginBottom: '32px' }}>Start exploring services and products to add them here</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href={ROUTES.services} className="btn btn--primary">Browse Services</Link>
          <Link href={ROUTES.products} className="btn btn--secondary">Shop Products</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '32px' }}>Your Cart ({items.length} items)</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(0, 340px)', gap: '32px', alignItems: 'start' }}>
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Service Bookings */}
          {serviceItems.length > 0 && (
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ✈️ Service Bookings ({serviceItems.length})
              </h3>
              {serviceItems.map(item => (
                <CartItemRow key={item.id} item={item} onRemove={removeItem} onQtyChange={updateQuantity} />
              ))}
            </div>
          )}

          {/* Products */}
          {productItems.length > 0 && (
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🛍️ Products ({productItems.length})
              </h3>
              {productItems.map(item => (
                <CartItemRow key={item.id} item={item} onRemove={removeItem} onQtyChange={updateQuantity} />
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="card" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
          <h3 style={{ marginBottom: '20px' }}>Order Summary</h3>

          {serviceItems.length > 0 && (
            <div style={{ marginBottom: '12px', padding: '12px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Services subtotal</span>
                <span>{formatCurrency(serviceItems.reduce((s, i) => s + i.price * i.quantity, 0))}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Pay at venue</p>
            </div>
          )}

          {productItems.length > 0 && (
            <div style={{ marginBottom: '12px', padding: '12px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Products subtotal</span>
                <span>{formatCurrency(productItems.reduce((s, i) => s + i.price * i.quantity, 0))}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Paid online via Stripe</p>
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '16px' }}>Total</span>
              <span className="price" style={{ fontSize: '24px', color: 'var(--color-primary)' }}>{formatCurrency(total)}</span>
            </div>
          </div>

          <Link href={ROUTES.checkout} className="btn btn--primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            Proceed to Checkout <ArrowRight size={18} />
          </Link>
          <Link href={ROUTES.services} className="btn btn--ghost" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
            Continue Browsing
          </Link>
        </div>
      </div>
    </div>
  )
}

import type { CartItem as StoreCartItem } from '@/store/cartStore'
type CartItemType = StoreCartItem

function CartItemRow({ item, onRemove, onQtyChange }: { item: CartItemType; onRemove: (id: string) => void; onQtyChange: (id: string, qty: number) => void }) {
  return (
    <div className="card" style={{ padding: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '12px' }}>
      {item.image && (
        <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
          <Image src={item.image} alt={item.title} width={80} height={80} style={{ objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 600, marginBottom: '4px', fontSize: '15px' }}>{item.title}</p>
        {item.variant && <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{item.variant}</p>}
        {item.serviceDate && <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>📅 {item.serviceDate} • {item.travelers} traveler{(item.travelers ?? 1) > 1 ? 's' : ''}</p>}
        <p style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '16px' }}>{formatCurrency(item.price)}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        <button onClick={() => onRemove(item.id)} className="btn btn--ghost btn--icon" style={{ color: 'var(--color-error)', width: '32px', height: '32px' }}>
          <Trash2 size={15} />
        </button>
        {item.type === 'product' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={() => onQtyChange(item.id, item.quantity - 1)} className="btn btn--secondary btn--icon" style={{ width: '28px', height: '28px' }}><Minus size={12} /></button>
            <span style={{ fontSize: '14px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
            <button onClick={() => onQtyChange(item.id, item.quantity + 1)} className="btn btn--secondary btn--icon" style={{ width: '28px', height: '28px' }}><Plus size={12} /></button>
          </div>
        )}
      </div>
    </div>
  )
}
