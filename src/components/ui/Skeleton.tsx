import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className, style }: SkeletonProps) {
  return <div className={cn('skeleton', className)} style={style} />
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <Skeleton style={{ height: '200px', borderRadius: '0' }} />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Skeleton style={{ height: '14px', width: '60%' }} />
        <Skeleton style={{ height: '20px', width: '90%' }} />
        <Skeleton style={{ height: '14px', width: '40%' }} />
        <Skeleton style={{ height: '36px', marginTop: '8px' }} />
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} style={{ height: '14px', width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  )
}
