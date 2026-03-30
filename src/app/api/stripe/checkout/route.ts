import Stripe from 'stripe'
import { NextRequest } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2026-03-25.dahlia',
})

export interface CheckoutLineItem {
  title: string
  price: number // in PKR (smallest unit handled below)
  quantity: number
  image?: string
}

export async function POST(request: NextRequest) {
  try {
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
