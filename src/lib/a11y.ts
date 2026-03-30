/**
 * Accessibility (a11y) utilities
 */

// Skip to main content link
export const skipToMainContent = {
  href: '#main-content',
  ariaLabel: 'Skip to main content',
  style: {
    position: 'absolute' as const,
    top: '-40px',
    left: '0',
    background: 'var(--color-primary)',
    color: 'white',
    padding: '8px 8px',
    textDecoration: 'none',
    zIndex: 100,
  },
  onFocus: {
    top: '0',
  },
}

// ARIA live region announcements
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const div = document.createElement('div')
  div.setAttribute('role', 'status')
  div.setAttribute('aria-live', priority)
  div.setAttribute('aria-atomic', 'true')
  div.className = 'sr-only'
  div.textContent = message
  document.body.appendChild(div)
  setTimeout(() => div.remove(), 1000)
}

// Focus management
export function focusElement(selector: string): void {
  const el = document.querySelector(selector) as HTMLElement
  if (el) {
    el.focus()
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// Keyboard event helpers
export const KEY_CODES = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
} as const

export function isKeyboardEvent(
  event: React.KeyboardEvent,
  ...keys: string[]
): boolean {
  return keys.includes(event.key)
}

// Color contrast checker (WCAG AA)
export function getContrastRatio(rgb1: string, rgb2: string): number {
  const getLuminance = (rgb: string) => {
    const [r, g, b] = rgb.match(/\d+/g)?.map(Number) || [0, 0, 0]
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }
  const l1 = getLuminance(rgb1)
  const l2 = getLuminance(rgb2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// WCAG AA requires 4.5:1 for normal text, 3:1 for large text
export function isAccessibleContrast(ratio: number, largeText = false): boolean {
  return largeText ? ratio >= 3 : ratio >= 4.5
}
