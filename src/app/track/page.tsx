'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

export default function TrackPage() {
  const [orderId, setOrderId] = useState('')

  return (
    <div style={{ paddingTop: '60px', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '16px' }}>Track Your Booking</h1>
        <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginBottom: '40px' }}>
          Enter your order number to see booking status and updates
        </p>

        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Enter Order ID (e.g., VSK-ABC123)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
              }}
            />
            <button className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Search size={16} /> Track
            </button>
          </div>

          <div style={{ color: 'var(--color-text-muted)', fontSize: '14px', textAlign: 'left' }}>
            <p style={{ marginBottom: '12px' }}>📝 <strong>How to find your Order ID:</strong></p>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Check your confirmation email</li>
              <li>Visit your account dashboard</li>
              <li>Look for "Order #" in your receipt</li>
            </ul>
          </div>
        </div>

        <p style={{ marginTop: '32px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
          Not finding your booking? <a href="/contact" style={{ color: 'var(--color-primary)' }}>Contact Support</a>
        </p>
      </div>
    </div>
  )
}
