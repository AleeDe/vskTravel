import Stripe from 'stripe'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  // Use library default API version to avoid TS literal mismatches
  return new Stripe(key)
}

// Supabase admin client (service role — bypasses RLS)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  )
}

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const stripe = getStripe()
  if (!stripe) {
    return Response.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? '',
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
    console.error('[Stripe Webhook] Signature error:', message)
    return Response.json({ error: message }, { status: 400 })
  }

  const supabase = getAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.orderId

      if (orderId) {
        const { error } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            stripe_session_id: session.id,
            stripe_payment_intent: session.payment_intent as string | null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId)

        if (error) {
          console.error('[Stripe Webhook] Failed to update order:', error.message)
          return Response.json({ error: 'DB update failed' }, { status: 500 })
        }
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent
      const sessionList = await stripe.checkout.sessions.list({
        payment_intent: intent.id,
        limit: 1,
      })
      const orderId = sessionList.data[0]?.metadata?.orderId
      if (orderId) {
        await supabase
          .from('orders')
          .update({ payment_status: 'failed', updated_at: new Date().toISOString() })
          .eq('id', orderId)
      }
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const intent = charge.payment_intent as string | null
      if (intent) {
        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: intent,
          limit: 1,
        })
        const orderId = sessionList.data[0]?.metadata?.orderId
        if (orderId) {
          await supabase
            .from('orders')
            .update({ payment_status: 'refunded', status: 'refunded', updated_at: new Date().toISOString() })
            .eq('id', orderId)
        }
      }
      break
    }

    default:
      // Unhandled event types are silently ignored
      break
  }

  return Response.json({ received: true })
}
