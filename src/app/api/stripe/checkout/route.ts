import Stripe from 'stripe'
import { NextRequest } from 'next/server'

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return new Stripe(key, { apiVersion: '2023-10-16' })
}

export const dynamic = 'force-dynamic'

export interface CheckoutLineItem {
  title: string
  price: number // in PKR (smallest unit handled below)
  quantity: number
  image?: string
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    if (!stripe) {
      // Avoid failing build/imports; allow frontend to handle stub flow
      return Response.json({ error: 'Stripe not configured', stub: true }, { status: 200 })
    }

    const body = await request.json() as {
      items: CheckoutLineItem[]
      orderId: string
      customerEmail?: string
      successUrl: string
      cancelUrl: string
    }

    const { items, orderId, customerEmail, successUrl, cancelUrl } = body

    if (!items?.length) {
      return Response.json({ error: 'No items provided' }, { status: 400 })
    }

    // Convert PKR amounts to paisa (×100) for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      price_data: {
        currency: 'pkr',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.title,
          ...(item.image ? { images: [item.image] } : {}),
        },
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      metadata: { orderId },
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: cancelUrl,
      payment_method_types: ['card'],
    })

    return Response.json({ sessionId: session.id, url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}
