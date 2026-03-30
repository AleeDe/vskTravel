import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import HeaderServer from '@/components/layout/HeaderServer';
import Footer from '@/components/layout/Footer';
import ClientToaster from '@/components/ClientToaster';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'VSK Travel – Your Trusted Travel Partner',
    template: '%s | VSK Travel',
  },
  description:
    'VSK Travel is Pakistan\'s leading travel marketplace. Book flights, hotels, tour packages, get visa assistance, and complete travel solutions.',
  keywords: [
    'travel agency Pakistan',
    'flight booking',
    'hotel reservations',
    'tour packages',
    'visa assistance',
    'travel gear',
    'honeymoon packages',
    'Northern Pakistan tours',
    'VSK Travel',
  ],
  authors: [{ name: 'BabulTech', url: 'https://babultech.com' }],
  creator: 'BabulTech',
  publisher: 'VSK Travel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vsktravel.pk'),
  alternates: {
    canonical: 'https://vsktravel.pk',
  },
  openGraph: {
    title: 'VSK Travel – Your Trusted Travel Partner',
    description:
      'Pakistan\'s leading travel marketplace. Book flights, hotels, tours, visa assistance & more.',
    url: 'https://vsktravel.pk',
    siteName: 'VSK Travel',
    locale: 'en_PK',
    type: 'website',
    images: [
      {
        url: 'https://vsktravel.pk/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VSK Travel - Travel Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VSK Travel – Your Trusted Travel Partner',
    description: 'Book your perfect trip with VSK Travel',
    images: ['https://vsktravel.pk/twitter-image.jpg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'VSK Travel',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TravelAgency',
              name: 'VSK Travel',
              url: 'https://vsktravel.pk',
              logo: 'https://vsktravel.pk/logo.png',
              description:
                "Pakistan's leading travel marketplace for flights, hotels, tours, visa assistance and travel gear.",
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'VSK Travel Office',
                addressLocality: 'Karachi',
                addressRegion: 'Sindh',
                postalCode: '75500',
                addressCountry: 'PK',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Support',
                telephone: '+92-300-XXXXXXX',
                email: 'support@vsktravel.pk',
              },
              sameAs: [
                'https://facebook.com/vsktravel',
                'https://instagram.com/vsktravel',
              ],
              priceRange: 'PKR 1000 - PKR 1000000',
            }),
          }}
        />

        {/* Accessibility meta tags */}
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#0066FF" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body>
        <HeaderServer />
        <main id="main-content" role="main">
          {children}
        </main>
        <Footer />
        <ClientToaster />
      </body>
    </html>
  );
}
