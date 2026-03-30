/**
 * Environment variable validation
 * Ensures all required config is present at runtime
 */

interface RequiredEnv {
  supabaseUrl: string
  supabaseAnonKey: string
}

interface OptionalEnv {
  stripePublishableKey?: string
  resendApiKey?: string
  nextPublicAnalyticsId?: string
}

export function validateEnv(): RequiredEnv {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const missing: string[] = []

  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  if (missing.length > 0) {
    const vars = missing.join(', ')
    throw new Error(
      `Missing required environment variables: ${vars}\n` +
      'Check your .env.local file and ensure all required variables are set.'
    )
  }

  return {
    supabaseUrl: supabaseUrl as string,
    supabaseAnonKey: supabaseAnonKey as string,
  }
}

export function getOptionalEnv(): OptionalEnv {
  return {
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    resendApiKey: process.env.RESEND_API_KEY,
    nextPublicAnalyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  }
}

export function logEnvStatus(): void {
  if (typeof window === 'undefined') {
    // Server-side only
    console.log('[Env Status]')
    console.log('✓ Supabase:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('✓ Stripe:', !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    console.log('✓ Resend:', !!process.env.RESEND_API_KEY)
  }
}
