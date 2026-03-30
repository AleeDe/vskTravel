'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Ayesha Malik',
    city: 'Lahore',
    rating: 5,
    text: 'VSK Travel made our honeymoon to Hunza absolutely magical. The hotel arrangements, transport, and guide were all perfect. Highly recommend!',
    avatar: 'AM',
    trip: 'Hunza Valley Honeymoon Package',
  },
  {
    id: 2,
    name: 'Hassan Raza',
    city: 'Karachi',
    rating: 5,
    text: 'Booked the K2 Base Camp Trek through VSK. The partner was very professional, all permits handled smoothly. Best trekking experience of my life!',
    avatar: 'HR',
    trip: 'K2 Base Camp Trek',
  },
  {
    id: 3,
    name: 'Sara Ahmed',
    city: 'Islamabad',
    rating: 5,
    text: 'Visa assistance for Dubai was handled in just 3 days. The team was responsive and guided me through every step. Absolutely reliable service.',
    avatar: 'SA',
    trip: 'UAE Visa Assistance',
  },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  function prev() { setCurrent(i => (i === 0 ? testimonials.length - 1 : i - 1)) }
  function next() { setCurrent(i => (i === testimonials.length - 1 ? 0 : i + 1)) }

  const t = testimonials[current]

  return (
    <section className="section section--sm" style={{ background: 'linear-gradient(135deg, #EBF2FF 0%, #F0FDF4 100%)' }}>
      <div className="container">
        <div className="section-header--center" style={{ marginBottom: '40px' }}>
          <span className="label">Testimonials</span>
          <h2 className="section-title">What Our Travelers Say</h2>
        </div>

        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card" style={{ padding: '36px 32px' }}>
                <div style={{ fontSize: '36px', marginBottom: '20px' }}>{"★".repeat(t.rating)}</div>
                <p style={{ fontSize: '17px', lineHeight: 1.7, color: 'var(--color-text)', fontStyle: 'italic', marginBottom: '24px' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '16px',
                  }}>
                    {t.avatar}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '2px' }}>{t.name}</p>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{t.city} • {t.trip}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
            <button onClick={prev} className="btn btn--secondary btn--icon" aria-label="Previous">
              <ChevronLeft size={18} />
            </button>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  background: i === current ? 'var(--color-primary)' : 'var(--color-border-strong)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
            <button onClick={next} className="btn btn--secondary btn--icon" aria-label="Next">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
