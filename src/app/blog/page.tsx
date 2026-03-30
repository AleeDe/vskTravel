export const metadata = { title: 'Blog - VSK Travel' }

export default function BlogPage() {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
      <h1 style={{ marginBottom: '12px' }}>Travel Blog</h1>
      <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginBottom: '40px' }}>
        Tips, guides, and stories from travel enthusiasts
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {[
          { title: 'Top 5 Mountain Destinations in Northern Pakistan', excerpt: 'Discover breathtaking peaks and valleys...', date: 'Mar 15, 2026' },
          { title: 'Budget Travel Guide: Travel Pakistan on PKR 500/day', excerpt: 'Tips for experiencing Pakistan without breaking the bank...', date: 'Mar 10, 2026' },
          { title: 'Honeymoon Destinations for Pakistani Couples', excerpt: 'Romance awaits in these stunning locations...', date: 'Mar 5, 2026' },
        ].map((post) => (
          <div key={post.title} className="card" style={{ padding: '24px', cursor: 'pointer' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>{post.title}</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>{post.excerpt}</p>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{post.date}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>More posts coming soon!</p>
      </div>
    </div>
  )
}
