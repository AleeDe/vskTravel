'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Plane,
  Hotel,
  Map,
  Package,
  Globe,
  Heart,
  Phone,
  LogOut,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { createClient } from '@/lib/supabase/client';
import styles from './Header.module.css';

const navLinks = [
  {
    label: 'Services',
    href: '/services',
    icon: <Globe size={18} />,
    submenu: [
      { label: 'Flights', href: '/services?category=flights', icon: <Plane size={16} /> },
      { label: 'Hotels', href: '/services?category=hotels', icon: <Hotel size={16} /> },
      { label: 'Tour Packages', href: '/services?category=tours', icon: <Map size={16} /> },
      { label: 'Visa Assistance', href: '/services?category=visa', icon: <Globe size={16} /> },
    ],
  },
  { label: 'Products', href: '/products', icon: <Package size={18} /> },
  { label: 'Deals', href: '/deals', icon: <Heart size={18} /> },
  { label: 'Contact', href: '/contact', icon: <Phone size={18} /> },
];

export default function Header({ initialEmail = null, initialRole = null }: { initialEmail?: string | null; initialRole?: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(initialEmail ? { email: initialEmail } : null);
  const [userRole, setUserRole] = useState<string | null>(initialRole);
  const [userDropdown, setUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartCount = useCartStore((s) => s.items.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Check user auth status and get role (cookie fallback only; no separate API calls)
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // 1) Fast fallback from role cookie (set by middleware)
        try {
          const cookie = document.cookie.split('; ').find(c => c.startsWith('app_role='));
          const cookieRole = cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
          if (cookieRole) {
            setUserRole(cookieRole);
            console.log('Header - User:', user.email, 'Role (cookie):', cookieRole);
          }
        } catch { }


        // Note: role may also be provided via initialRole prop from Server Component
      }
    }
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        // Re-read the cookie after auth changes
        try {
          const cookie = document.cookie.split('; ').find(c => c.startsWith('app_role='));
          const cookieRole = cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
          if (cookieRole) {
            setUserRole(cookieRole);
            console.log('Auth changed - User:', session.user.email, 'Role (cookie):', session.user.role?.normalize());
          }
        } catch {
          // ignore
        }
      } else {
        setUserRole(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  }

  return (
    <>
      {/* Skip to main content */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          top: '-40px',
          left: '0',
          background: 'var(--color-primary)',
          color: 'white',
          padding: '8px 8px',
          textDecoration: 'none',
          zIndex: 100,
        }}
        onFocus={(e) => (e.target as HTMLElement).style.top = '0'}
        onBlur={(e) => (e.target as HTMLElement).style.top = '-40px'}
      >
        Skip to main content
      </a>

      {/* Top announcement bar */}
      <div className={styles.announcementBar} role="region" aria-label="Announcement">
        <div className="container">
          <p>✈️ Summer Sale: Up to <strong>30% off</strong> on all tour packages! <Link href="/deals">View Deals →</Link></p>
        </div>
      </div>

      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`} role="banner">
        <div className={`container ${styles.headerInner}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Plane size={22} />
            </div>
            <span className={styles.logoText}>
              VSK<span className={styles.logoAccent}>Travel</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.desktopNav} ref={dropdownRef} aria-label="Main navigation">
            {navLinks.map((link) => (
              <div key={link.label} className={styles.navItem}>
                {link.submenu ? (
                  <>
                    <button
                      className={`${styles.navLink} ${pathname.startsWith(link.href) ? styles.active : ''}`}
                      onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                    >
                      {link.icon}
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`${styles.chevron} ${activeDropdown === link.label ? styles.chevronOpen : ''}`}
                      />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          className={styles.dropdown}
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2 }}
                        >
                          {link.submenu.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className={styles.dropdownLink}
                              onClick={() => setActiveDropdown(null)}
                            >
                              {sub.icon}
                              {sub.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className={styles.actions}>
            {/* Search Toggle */}
            <button
              className={`${styles.actionBtn} ${searchOpen ? styles.actionActive : ''}`}
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link href="/cart" className={styles.actionBtn} aria-label="Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <motion.span
                  className={styles.cartBadge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* Account */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className={styles.actionBtn}
                  title={user.email}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                  }}>
                    {user.email?.[0].toUpperCase() || 'U'}
                  </div>
                </button>
                {userDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      background: 'white',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-lg)',
                      minWidth: '200px',
                      zIndex: 1000,
                    }}
                  >
                    <div style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
                      <p style={{ padding: '0 16px', fontSize: '13px', color: 'var(--color-text-muted)' }}>Signed in as</p>
                      <p style={{ padding: '4px 16px', fontSize: '14px', fontWeight: 600 }}>{user.email}</p>
                      {userRole && <p style={{ padding: '2px 16px', fontSize: '12px', color: 'var(--color-primary)', textTransform: 'capitalize' }}>Role: {userRole}</p>}
                    </div>

                    {userRole === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserDropdown(false)}
                        style={{
                          display: 'block',
                          padding: '12px 16px',
                          fontSize: '14px',
                          color: 'var(--color-primary)',
                          textDecoration: 'none',
                          borderBottom: '1px solid var(--color-border)',
                          fontWeight: 600,
                        }}
                      >
                        🔐 Admin Dashboard
                      </Link>
                    )}

                    {userRole === 'partner' && (
                      <Link
                        href="/partner/dashboard"
                        onClick={() => setUserDropdown(false)}
                        style={{
                          display: 'block',
                          padding: '12px 16px',
                          fontSize: '14px',
                          color: 'var(--color-primary)',
                          textDecoration: 'none',
                          borderBottom: '1px solid var(--color-border)',
                          fontWeight: 600,
                        }}
                      >
                        💼 Partner Dashboard
                      </Link>
                    )}

                    {userRole === 'customer' && (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdown(false)}
                          style={{
                            display: 'block',
                            padding: '12px 16px',
                            fontSize: '14px',
                            color: 'var(--color-text)',
                            textDecoration: 'none',
                            borderBottom: '1px solid var(--color-border)',
                          }}
                        >
                          📊 My Dashboard
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setUserDropdown(false)}
                          style={{
                            display: 'block',
                            padding: '12px 16px',
                            fontSize: '14px',
                            color: 'var(--color-text)',
                            textDecoration: 'none',
                            borderBottom: '1px solid var(--color-border)',
                          }}
                        >
                          📦 My Orders
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => { handleLogout(); setUserDropdown(false); }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: 'var(--color-error)',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className={`btn btn--primary btn--sm ${styles.loginBtn}`}>
                <User size={16} />
                <span className="hide-mobile">Sign In</span>
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              className={`${styles.actionBtn} ${styles.mobileToggle}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className={styles.searchBar}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="container">
                <div className={styles.searchInputWrap}>
                  <Search size={18} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search destinations, services, products..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button
                    className={styles.searchClose}
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    aria-label="Close search"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className={styles.mobileDrawer}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className={styles.mobileDrawerHeader}>
                <span className={styles.logoText}>
                  VSK<span className={styles.logoAccent}>Travel</span>
                </span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X size={22} />
                </button>
              </div>
              <nav className={styles.mobileNav}>
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <Link href={link.href} className={styles.mobileNavLink}>
                      {link.icon}
                      {link.label}
                    </Link>
                    {link.submenu && (
                      <div className={styles.mobileSubmenu}>
                        {link.submenu.map((sub) => (
                          <Link key={sub.label} href={sub.href} className={styles.mobileSubLink}>
                            {sub.icon}
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              <div className={styles.mobileDrawerFooter}>
                {user ? (
                  <>
                    <Link href="/dashboard" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
                      📊 My Dashboard
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="btn btn--secondary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="btn btn--primary" style={{ width: '100%' }} onClick={() => setMobileOpen(false)}>
                      <User size={18} />
                      Sign In / Register
                    </Link>
                    <Link href="/partner/onboarding" className="btn btn--secondary" style={{ width: '100%' }} onClick={() => setMobileOpen(false)}>
                      Become a Partner
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
