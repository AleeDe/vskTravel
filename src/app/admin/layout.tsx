import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, background: 'var(--color-bg-subtle)', overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  )
}
