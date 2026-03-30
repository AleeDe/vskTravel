import { Suspense } from 'react'
import ServicesListClient from './ServicesListClient'
import { SkeletonCard } from '@/components/ui/Skeleton'

export const metadata = {
  title: 'Travel Services',
  description: 'Browse flights, hotels, tour packages, visa assistance and more.',
}

export default function ServicesPage() {
  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '8px' }}>Travel Services</h1>
        <p>Find the best flights, hotels, tour packages and more from verified partners</p>
      </div>
      <Suspense fallback={
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      }>
        <ServicesListClient />
      </Suspense>
    </div>
  )
}
