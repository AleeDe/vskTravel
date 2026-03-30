import { NextRequest } from 'next/server'
import crypto from 'crypto'

// JazzCash Hosted Checkout stub
// Full integration requires JazzCash merchant credentials and their SDK.
// This stub builds the POST payload for JazzCash's hosted payment page.
// Reference: https://sandbox.jazzcash.com.pk/merchant/

const JAZZCASH_MERCHANT_ID = process.env.JAZZCASH_MERCHANT_ID ?? ''
const JAZZCASH_PASSWORD = process.env.JAZZCASH_PASSWORD ?? ''
const JAZZCASH_INTEGRITY_SALT = process.env.JAZZCASH_INTEGRITY_SALT ?? ''
const JAZZCASH_RETURN_URL = process.env.JAZZCASH_RETURN_URL ?? ''

// JazzCash sandbox endpoint — switch to live URL in production
const JAZZCASH_ENDPOINT = process.env.JAZZCASH_SANDBOX === 'true'
  ? 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/'
  : 'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/'

function buildHMAC(params: Record<string, string>): string {
  const sorted = Object.keys(params).sort().map((k) => params[k]).join('&')
  const message = `${JAZZCASH_INTEGRITY_SALT}&${sorted}`
  return crypto.createHmac('sha256', JAZZCASH_INTEGRITY_SALT).update(message).digest('hex')
}

function getDateTimeString(): string {
  const now = new Date()
  return now.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      orderId: string
      amountPKR: number // whole rupees
      description: string
      mobileNumber?: string
    }

    const { orderId, amountPKR, description, mobileNumber } = body

    if (!orderId || !amountPKR) {
      return Response.json({ error: 'orderId and amountPKR are required' }, { status: 400 })
    }

    if (!JAZZCASH_MERCHANT_ID || !JAZZCASH_PASSWORD || !JAZZCASH_INTEGRITY_SALT) {
      // Credentials not configured — return stub response for dev environments
      return Response.json({
        stub: true,
        message: 'JazzCash credentials not configured. Set JAZZCASH_MERCHANT_ID, JAZZCASH_PASSWORD, JAZZCASH_INTEGRITY_SALT in .env.local',
        endpoint: JAZZCASH_ENDPOINT,
      })
    }

    const txnDateTime = getDateTimeString()
    const expiryDateTime = new Date(Date.now() + 60 * 60 * 1000)
      .toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)

    // JazzCash expects amount in paisa (×100)
    const amountPaisa = String(amountPKR * 100)

    const params: Record<string, string> = {
      pp_Version: '1.1',
      pp_TxnType: 'MWALLET',
      pp_Language: 'EN',
      pp_MerchantID: JAZZCASH_MERCHANT_ID,
      pp_Password: JAZZCASH_PASSWORD,
      pp_TxnRefNo: `T${orderId.replace(/-/g, '')}`,
      pp_Amount: amountPaisa,
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: txnDateTime,
      pp_BillReference: orderId,
      pp_Description: description.slice(0, 100),
      pp_TxnExpiryDateTime: expiryDateTime,
      pp_ReturnURL: JAZZCASH_RETURN_URL,
      ...(mobileNumber ? { pp_MobileNumber: mobileNumber } : {}),
    }

    const secureHash = buildHMAC(params)

    return Response.json({
      endpoint: JAZZCASH_ENDPOINT,
      params: { ...params, pp_SecureHash: secureHash },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}
