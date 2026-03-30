import PartnerSidebar from '@/components/partner/PartnerSidebar'

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      <PartnerSidebar />
      <main style={{ flex: 1, background: 'var(--color-bg-subtle)', overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  )
}
