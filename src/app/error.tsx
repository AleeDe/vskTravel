'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[App Error]', error.message, error.digest)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FEE2E2 0%, #FEF3C7 100%)',
      padding: '20px',
    }}>
      <div style={{ maxWidth: '500px', textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>⚠️</div>
        <h1 style={{ fontSize: '32px', marginBottom: '12px', color: '#7F1D1D' }}>
          Oops! Something went wrong
        </h1>
        <p style={{ fontSize: '16px', marginBottom: '24px', color: '#5B2C2C', lineHeight: 1.6 }}>
          We encountered an unexpected error. Our team has been notified and is working on a fix.
        </p>

        {error.digest && (
          <p style={{
            fontSize: '12px',
            color: '#6B4423',
            marginBottom: '24px',
            fontFamily: 'monospace',
            background: 'rgba(255,255,255,0.5)',
            padding: '10px',
            borderRadius: '4px',
          }}>
            Error ID: {error.digest}
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              padding: '12px 24px',
              background: '#DC2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Try Again
          </button>
          <Link href="/" style={{
            padding: '12px 24px',
            background: 'white',
            color: '#DC2626',
            borderRadius: '6px',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-block',
            border: '1px solid #DC2626',
          }}>
            Back to Home
          </Link>
        </div>

        <p style={{ fontSize: '13px', marginTop: '24px', color: '#5B2C2C' }}>
          Need help? Email us at{' '}
          <a href="mailto:support@vsktravel.pk" style={{ color: '#DC2626', textDecoration: 'underline' }}>
            support@vsktravel.pk
          </a>
        </p>
      </div>
    </div>
  )
}
