'use client';

import Link from 'next/link';
import {
  Plane,
  Phone,
  Mail,
  MapPin,
  Share2,
  Camera,
  MessageCircle,
  Play,
  ArrowRight,
  Shield,
  CreditCard,
  HeadphonesIcon,
} from 'lucide-react';
import styles from './Footer.module.css';

const footerLinks = {
  services: [
    { label: 'Flight Booking', href: '/services?category=flights' },
    { label: 'Hotel Reservations', href: '/services?category=hotels' },
    { label: 'Tour Packages', href: '/services?category=tours' },
    { label: 'Visa Assistance', href: '/services?category=visa' },
    { label: 'Travel Insurance', href: '/services?category=insurance' },
    { label: 'Group Tours', href: '/services?category=group' },
  ],
  company: [
    { label: 'About VSK Travel', href: '/about' },
    { label: 'Why Choose Us', href: '/about#why-us' },
    { label: 'Partners', href: '/partner/onboarding' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Press', href: '/press' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Help Center', href: '/help' },
    { label: 'Track Booking', href: '/track' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
};

const trustBadges = [
  { icon: <Shield size={20} />, label: 'Secure Payments' },
  { icon: <CreditCard size={20} />, label: 'Easy Refunds' },
  { icon: <HeadphonesIcon size={20} />, label: '24/7 Support' },
];

const socialLinks = [
  { icon: <Share2 size={18} />, href: '#', label: 'Facebook' },
  { icon: <Camera size={18} />, href: '#', label: 'Instagram' },
  { icon: <MessageCircle size={18} />, href: '#', label: 'Twitter' },
  { icon: <Play size={18} />, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Trust Bar */}
      <div className={styles.trustBar}>
        <div className="container">
          <div className={styles.trustGrid}>
            {trustBadges.map((badge) => (
              <div key={badge.label} className={styles.trustBadge}>
                <div className={styles.trustIcon}>{badge.icon}</div>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand Column */}
            <div className={styles.brandCol}>
              <Link href="/" className={styles.logo}>
                <div className={styles.logoIcon}>
                  <Plane size={20} />
                </div>
                <span className={styles.logoText}>
                  VSK<span className={styles.logoAccent}>Travel</span>
                </span>
              </Link>
              <p className={styles.brandDesc}>
                Your trusted travel partner for unforgettable journeys. 
                From flights to full vacation packages — we make travel effortless.
              </p>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <Phone size={14} />
                  <a href="tel:+923001234567">+92 300 123 4567</a>
                </div>
                <div className={styles.contactItem}>
                  <Mail size={14} />
                  <a href="mailto:info@vsktravel.com">info@vsktravel.com</a>
                </div>
                <div className={styles.contactItem}>
                  <MapPin size={14} />
                  <span>Lahore, Pakistan</span>
                </div>
              </div>
              <div className={styles.social}>
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} className={styles.socialLink} aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            <div className={styles.linkCol}>
              <h4 className={styles.linkTitle}>Services</h4>
              <ul className={styles.linkList}>
                {footerLinks.services.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className={styles.linkItem}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkCol}>
              <h4 className={styles.linkTitle}>Company</h4>
              <ul className={styles.linkList}>
                {footerLinks.company.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className={styles.linkItem}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkCol}>
              <h4 className={styles.linkTitle}>Support</h4>
              <ul className={styles.linkList}>
                {footerLinks.support.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className={styles.linkItem}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className={styles.newsletterCol}>
              <h4 className={styles.linkTitle}>Stay Updated</h4>
              <p className={styles.newsletterDesc}>
                Get exclusive deals and travel inspiration delivered to your inbox.
              </p>
              <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={styles.newsletterInput}
                />
                <button type="submit" className={styles.newsletterBtn}>
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} VSK Travel. All rights reserved. 
              Built by <a href="https://babultech.com" target="_blank" rel="noopener noreferrer">BabulTech</a>.
            </p>
            <div className={styles.bottomLinks}>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/cookies">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
