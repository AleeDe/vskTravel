'use client'

import { Toaster } from 'sonner'

export default function ClientToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          fontFamily: 'var(--font-inter), sans-serif',
        },
      }}
    />
  )
}
