import { NextRequest } from 'next/server'
import crypto from 'crypto'

// EasyPaisa MA (Merchant Account) Hosted Payment stub
// Full integration requires EasyPaisa merchant credentials from Telenor/EasyPaisa.
// Reference: https://easypay.easypaisa.com.pk/

const EASYPAISA_STORE_ID = process.env.EASYPAISA_STORE_ID ?? ''
const EASYPAISA_HASH_KEY = process.env.EASYPAISA_HASH_KEY ?? ''
const EASYPAISA_RETURN_URL = process.env.EASYPAISA_RETURN_URL ?? ''

const EASYPAISA_ENDPOINT = process.env.EASYPAISA_SANDBOX === 'true'
  ? 'https://easypay.easypaisa.com.pk/easypay-sandbox/index.jsf'
  : 'https://easypay.easypaisa.com.pk/easypay/index.jsf'

function hashPayload(data: string): string {
  return crypto.createHmac('sha256', EASYPAISA_HASH_KEY).update(data).digest('base64')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      orderId: string
      amountPKR: number
      description: string
      customerEmail?: string
      customerMobile?: string
    }

    const { orderId, amountPKR, description, customerEmail, customerMobile } = body

    if (!orderId || !amountPKR) {
      return Response.json({ error: 'orderId and amountPKR are required' }, { status: 400 })
    }

    if (!EASYPAISA_STORE_ID || !EASYPAISA_HASH_KEY) {
      return Response.json({
        stub: true,
        message: 'EasyPaisa credentials not configured. Set EASYPAISA_STORE_ID and EASYPAISA_HASH_KEY in .env.local',
        endpoint: EASYPAISA_ENDPOINT,
      })
    }

    const expiryDate = new Date(Date.now() + 60 * 60 * 1000)
      .toISOString().replace('T', ' ').slice(0, 19)

    const amount = amountPKR.toFixed(2)

    // EasyPaisa hash string: amount + expiryDate + orderId + paymentMethod + postBackURL + storeId
    const hashString = `${amount}${expiryDate}${orderId}MA${EASYPAISA_RETURN_URL}${EASYPAISA_STORE_ID}`
    const hash = hashPayload(hashString)

    const params: Record<string, string> = {
      storeId: EASYPAISA_STORE_ID,
      orderId,
      transactionAmount: amount,
      mobileAccountNo: customerMobile ?? '',
      emailAddress: customerEmail ?? '',
      transactionType: 'MA',
      tokenExpiry: expiryDate,
      merchantPaymentMethod: '',
      description: description.slice(0, 100),
      successUrl: EASYPAISA_RETURN_URL,
      failureUrl: EASYPAISA_RETURN_URL,
      hashValue: hash,
    }

    return Response.json({ endpoint: EASYPAISA_ENDPOINT, params })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}
