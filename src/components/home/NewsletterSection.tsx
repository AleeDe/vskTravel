'use client'

import { useState } from 'react'
import { Mail, Send } from 'lucide-react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: connect to Supabase or email service
    setSubmitted(true)
  }

  return (
    <section className="section section--sm" style={{ background: 'var(--color-primary)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-40%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.15)', marginBottom: '20px' }}>
          <Mail size={24} color="white" />
        </div>
        <h2 style={{ color: 'white', marginBottom: '12px' }}>Get Exclusive Travel Deals</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
          Subscribe to our newsletter and be the first to know about flash sales and new destinations.
        </p>

        {submitted ? (
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-lg)', padding: '16px 32px', display: 'inline-block', color: 'white', fontWeight: 600 }}>
            ✅ You&apos;re subscribed! Watch your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', maxWidth: '480px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              style={{
                flex: 1,
                minWidth: '240px',
                padding: '12px 18px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                fontSize: '15px',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                backdropFilter: 'blur(8px)',
              }}
            />
            <button type="submit" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'white',
              color: 'var(--color-primary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}>
              <Send size={16} /> Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
