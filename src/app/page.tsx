import HeroSection from '@/components/home/HeroSection'
import CategoryScroller from '@/components/home/CategoryScroller'
import FeaturedDeals from '@/components/home/FeaturedDeals'
import ProductTeaser from '@/components/home/ProductTeaser'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import NewsletterSection from '@/components/home/NewsletterSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryScroller />
      <FeaturedDeals />
      <ProductTeaser />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  )
}
