import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  online?: boolean
  className?: string
}

const sizeMap = {
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
}

const fontSizeMap = {
  sm: '11px',
  md: '13px',
  lg: '16px',
  xl: '22px',
}

export default function Avatar({ src, name = '', size = 'md', online, className }: AvatarProps) {
  const px = sizeMap[size]
  return (
    <div className={cn('', className)} style={{ position: 'relative', display: 'inline-flex' }}>
      <div style={{
        width: px,
        height: px,
        borderRadius: '50%',
        overflow: 'hidden',
        background: 'var(--color-primary-100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {src ? (
          <Image src={src} alt={name} width={px} height={px} style={{ objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: fontSizeMap[size], fontWeight: 700, color: 'var(--color-primary)' }}>
            {getInitials(name)}
          </span>
        )}
      </div>
      {online !== undefined && (
        <span style={{
          position: 'absolute',
          bottom: 1,
          right: 1,
          width: size === 'sm' ? 7 : 10,
          height: size === 'sm' ? 7 : 10,
          borderRadius: '50%',
          background: online ? 'var(--color-success)' : 'var(--color-text-muted)',
          border: '2px solid white',
        }} />
      )}
    </div>
  )
}
