import { Suspense } from 'react'
import ProductsListClient from './ProductsListClient'
import { SkeletonCard } from '@/components/ui/Skeleton'

export const metadata = {
  title: 'Travel Products',
  description: 'Shop luggage, travel gear, accessories and more.',
}

export default function ProductsPage() {
  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '8px' }}>Travel Store</h1>
        <p>Quality travel products from verified sellers</p>
      </div>
      <Suspense fallback={
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      }>
        <ProductsListClient />
      </Suspense>
    </div>
  )
}
