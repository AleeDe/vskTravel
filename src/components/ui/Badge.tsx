import { cn } from '@/lib/utils'

type BadgeVariant = 'success' | 'warning' | 'error' | 'primary' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const variantClass: Record<BadgeVariant, string> = {
  success: 'badge--success',
  warning: 'badge--warning',
  error: 'badge--error',
  primary: 'badge--primary',
  default: '',
}

export default function Badge({ variant = 'default', children, className, dot }: BadgeProps) {
  return (
    <span className={cn('badge', variantClass[variant], className)}>
      {dot && (
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'currentColor',
          display: 'inline-block',
        }} />
      )}
      {children}
    </span>
  )
}
