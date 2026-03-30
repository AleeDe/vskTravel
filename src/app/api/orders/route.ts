import { NextRequest } from 'next/server'
import { requireRole, getSupabaseServer } from '../../../lib/auth/guard'

export const dynamic = 'force-dynamic'

export interface CreateOrderBody {
  customer_id?: string
  contact: { fullName: string; email: string; phone: string }
  shipping?: { address: string; city: string; postalCode: string }
  payment_method: string // 'stripe' | 'jazzcash' | 'easypaisa' | 'pay_at_venue'
  items: Array<{
    type: 'product' | 'service'
    ref_id: string
    title: string
    price: number
    quantity: number
    variant?: string
    serviceDate?: string
    travelers?: number
  }>
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateOrderBody
    const { contact, shipping, payment_method, items, notes } = body

    if (!items?.length) {
      return Response.json({ error: 'No items provided' }, { status: 400 })
    }
    // Require any authenticated user
    const auth = await requireRole('any')
    if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status })

    const supabase = await getSupabaseServer()

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const discount_amount = 0
    const shipping_amount = 0
    const tax_amount = 0
    const total_amount = subtotal - discount_amount + shipping_amount + tax_amount

    // Generate order number: VSK-XXXXXXXX
    const orderNumber = `VSK-${Math.random().toString(36).slice(2, 10).toUpperCase()}`

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: auth.user.id,
        shipping_address: shipping ?? null,
        payment_method,
        payment_status: 'pending',
        status: 'pending',
        subtotal,
        discount_amount,
        shipping_amount,
        tax_amount,
        total_amount,
        notes: notes ?? null,
      })
      .select('id, order_number')
      .single()

    if (orderErr || !order) {
      console.error('[Orders API] Insert error:', orderErr?.message)
      return Response.json({ error: orderErr?.message ?? 'Failed to create order' }, { status: 500 })
    }

    // Resolve partner and commission for each item
    const serviceIds = items.filter(i => i.type === 'service').map(i => i.ref_id)
    const productIds = items.filter(i => i.type === 'product').map(i => i.ref_id)

    const [{ data: svcRows }, { data: prodRows }] = await Promise.all([
      serviceIds.length
        ? supabase.from('services').select('id, partner_id').in('id', serviceIds)
        : Promise.resolve({ data: [] as { id: string; partner_id: string }[] }),
      productIds.length
        ? supabase.from('products').select('id, partner_id').in('id', productIds)
        : Promise.resolve({ data: [] as { id: string; partner_id: string }[] }),
    ])

    const partnerIds = Array.from(new Set([
      ...(svcRows ?? []).map(r => r.partner_id),
      ...(prodRows ?? []).map(r => r.partner_id),
    ]))

    const { data: partnersRows } = partnerIds.length
      ? await supabase.from('partners').select('id, commission_rate').in('id', partnerIds)
      : { data: [] as { id: string; commission_rate: number }[] }

    const svcMap = new Map((svcRows ?? []).map(r => [r.id, r.partner_id]))
    const prodMap = new Map((prodRows ?? []).map(r => [r.id, r.partner_id]))
    const rateMap = new Map((partnersRows ?? []).map(r => [r.id, Number(r.commission_rate) || 10]))

    const orderItems = items.map((item) => {
      const partner_id = item.type === 'service'
        ? svcMap.get(item.ref_id) ?? null
        : prodMap.get(item.ref_id) ?? null
      const unit_price = item.price
      const quantity = item.quantity
      const total_price = unit_price * quantity
      const commission_rate = partner_id ? (rateMap.get(partner_id) ?? 10) : 10
      const commission_amount = partner_id ? ((total_price * commission_rate) / 100) : 0

      return {
        order_id: order.id,
        partner_id,
        item_type: item.type,
        service_id: item.type === 'service' ? item.ref_id : null,
        product_id: item.type === 'product' ? item.ref_id : null,
        title: item.title,
        image_url: null,
        quantity,
        unit_price,
        total_price,
        variant_info: item.variant ? { value: item.variant } : null,
        booking_date: item.serviceDate ? new Date(item.serviceDate) : null,
        booking_time: null,
        travelers_count: item.travelers ?? null,
        commission_rate,
        commission_amount,
        status: 'pending',
      }
    })

    const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)

    if (itemsErr) {
      console.error('[Orders API] Items insert error:', itemsErr.message)
      // Order created but items failed — still return order id so UI can handle
    }

    return Response.json({ orderId: order.id, orderNumber: order.order_number }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}
