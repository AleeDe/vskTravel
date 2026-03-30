'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={e => { if (e.target === overlayRef.current) onClose() }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--color-overlay)',
            backdropFilter: 'blur(4px)',
            zIndex: 'var(--z-modal)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              width: '100%',
              maxWidth: '420px',
              height: '100%',
              background: 'white',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-2xl)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={20} color="var(--color-primary)" />
                <h3 style={{ margin: 0 }}>Cart ({items.length})</h3>
              </div>
              <button onClick={onClose} className="btn btn--ghost btn--icon" aria-label="Close cart">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: '60px' }}>
                  <ShoppingBag size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 16px' }} />
                  <p style={{ color: 'var(--color-text-muted)' }}>Your cart is empty</p>
                  <button onClick={onClose} className="btn btn--primary" style={{ marginTop: '16px' }}>
                    Browse Services
                  </button>
                </div>
              ) : items.map(item => (
                <div key={item.id} className="card" style={{ padding: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  {item.image && (
                    <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                      <Image src={item.image} alt={item.title} width={64} height={64} style={{ objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </p>
                    {item.variant && <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>{item.variant}</p>}
                    {item.serviceDate && <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>📅 {item.serviceDate}</p>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '14px' }}>
                        {formatCurrency(item.price)}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {item.type === 'product' && (
                          <>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="btn btn--ghost btn--icon"
                              style={{ width: 28, height: 28 }}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ fontSize: '14px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="btn btn--ghost btn--icon"
                              style={{ width: 28, height: 28 }}
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="btn btn--ghost btn--icon"
                          style={{ width: 28, height: 28, color: 'var(--color-error)' }}
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: '20px 24px', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 600 }}>Total</span>
                  <span className="price" style={{ fontSize: '20px' }}>{formatCurrency(getTotal())}</span>
                </div>
                <Link href={ROUTES.checkout} onClick={onClose} className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Proceed to Checkout
                </Link>
                <Link href={ROUTES.cart} onClick={onClose} className="btn btn--ghost" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
