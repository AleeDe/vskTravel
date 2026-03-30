# VSK Travel — Supabase Edge Functions Guide

All edge functions are in `supabase/functions/` folder. Deploy them to your Supabase project.

---

## 🛒 Payment Functions

### 1. `create-order` — POST
Creates an order in the database.
- **Called by:** Frontend checkout page
- **Input:** Contact info, shipping, payment method, items
- **Output:** `{ orderId, orderNumber }`
- **Setup:** No extra config needed

### 2. `stripe-checkout` — POST
Creates Stripe Checkout session.
- **Called by:** Checkout page (for card payments)
- **Input:** Items, customer email, success/cancel URLs
- **Output:** `{ sessionId, url }` (redirect to Stripe)
- **Env vars needed:**
  ```
  STRIPE_SECRET_KEY=sk_live_...
  ```

### 3. `stripe-webhook` — POST
Handles Stripe webhooks (payment success, failed, refunded).
- **Called by:** Stripe (webhook) — NOT from frontend
- **Setup in Stripe Dashboard:**
  - Webhooks → Add Endpoint
  - URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
  - Events: `checkout.session.completed`, `payment_intent.payment_failed`, `charge.refunded`
- **Env vars needed:**
  ```
  STRIPE_SECRET_KEY=sk_live_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  SUPABASE_URL=...
  SUPABASE_SERVICE_ROLE_KEY=...
  ```

### 4. `jazzcash-checkout` — POST
Builds JazzCash hosted checkout payload.
- **Called by:** Checkout page (for JazzCash mobile payments)
- **Input:** Order ID, amount, description, mobile number
- **Output:** `{ endpoint, params }` (form data to post to JazzCash)
- **Env vars needed:**
  ```
  JAZZCASH_MERCHANT_ID=...
  JAZZCASH_PASSWORD=...
  JAZZCASH_INTEGRITY_SALT=...
  JAZZCASH_RETURN_URL=https://yourdomain.com/orders
  JAZZCASH_SANDBOX=true  # for testing
  ```

### 5. `easypaisa-checkout` — POST
Builds EasyPaisa hosted checkout payload.
- **Called by:** Checkout page (for EasyPaisa mobile payments)
- **Input:** Order ID, amount, description, customer email/mobile
- **Output:** `{ endpoint, params }` (form data to post to EasyPaisa)
- **Env vars needed:**
  ```
  EASYPAISA_STORE_ID=...
  EASYPAISA_HASH_KEY=...
  EASYPAISA_RETURN_URL=https://yourdomain.com/orders
  EASYPAISA_SANDBOX=true  # for testing
  ```

---

## 📧 Notification Functions

### 6. `send-email` — POST
Sends templated emails (order confirmation, shipping, service reminders).
- **Called by:** Backend (checkout, admin, cron jobs)
- **Input:** Email address, subject, template type, data
- **Templates:**
  - `order-confirmation` → Order placed
  - `order-shipped` → Package shipped
  - `service-reminder` → Service booking reminder
  - `custom` → Custom HTML
- **Env vars needed:**
  ```
  RESEND_API_KEY=re_...  # Get from resend.com
  ```

**Example call:**
```typescript
fetch(`${supabaseUrl}/functions/v1/send-email`, {
  method: 'POST',
  body: JSON.stringify({
    to: 'customer@example.com',
    subject: 'Order Confirmed!',
    template: 'order-confirmation',
    data: {
      customerName: 'Ali',
      orderNumber: 'VSK-ABC123',
      totalAmount: '5000',
      dashboardUrl: 'https://yourdomain.com/dashboard'
    }
  })
})
```

### 7. `send-sms` — POST
Sends SMS via Twilio or local Pakistan provider (Noor SMS).
- **Called by:** Checkout, reminders, admin
- **Input:** Phone number, message, type
- **Supports:** Twilio (global) + Noor SMS (Pakistan)
- **Env vars needed:**
  ```
  # Twilio
  TWILIO_ACCOUNT_SID=...
  TWILIO_AUTH_TOKEN=...
  TWILIO_PHONE_NUMBER=+1...

  # OR Noor SMS (Pakistan)
  NOOR_SMS_API_KEY=...
  ```

**Note:** Automatically formats Pakistani numbers (+92...).

---

## 💰 Partner/Admin Functions

### 8. `calculate-payouts` — POST
Calculates monthly partner payouts based on settled commissions.
- **Called by:** Admin dashboard (monthly)
- **Input:** `{ partnerId, month: "2026-03" }`
- **Output:** Payout record with total commission
- **Env vars needed:**
  ```
  SUPABASE_URL=...
  SUPABASE_SERVICE_ROLE_KEY=...
  ```
- **Note:** Requires `partner_payouts` table in DB

### 9. `validate-listing` — POST
Validates service/product listings for spam/quality before publishing.
- **Called by:** Partner portal (service/product creation)
- **Input:** Title, description, category, price, type
- **Output:** `{ isValid, score (0-100), issues[], warnings[] }`
- **Checks:**
  - Title length, spam patterns
  - Description quality (caps, URLs, length)
  - Price reasonableness
  - Category validity

---

## 📊 Analytics & Automation

### 10. `track-event` — POST
Logs user analytics events (page views, clicks, searches, etc.).
- **Called by:** Frontend (async, non-blocking)
- **Input:** Event name, user ID, session ID, properties
- **Output:** `{ success: true }`
- **Note:** Always returns 200 — never blocks user actions
- **Env vars needed:**
  ```
  SUPABASE_URL=...
  SUPABASE_SERVICE_ROLE_KEY=...
  ```

**Example events:**
- `page_view` → Homepage, listings
- `product_viewed` → Clicked on product
- `service_added_to_cart` → Added service
- `checkout_started` → Began checkout
- `search` → Searched listings

### 11. `process-order-reminders` — POST (Cron)
Sends service booking reminders (24h before) and auto-expires old pending orders.
- **Called by:** Cron job (daily at midnight)
- **Auth:** Requires `Authorization: Bearer {CRON_SECRET}`
- **Actions:**
  1. Find services starting tomorrow → send SMS + email reminders
  2. Find pending orders >24h old → mark as expired
- **Env vars needed:**
  ```
  CRON_SECRET=your-secret
  SUPABASE_URL=...
  SUPABASE_SERVICE_ROLE_KEY=...
  FRONTEND_URL=https://yourdomain.com
  ```

**Setup cron job:**
- Use external service: cron-job.org, EasyCron, or Vercel Cron
- Call: `POST https://your-project.supabase.co/functions/v1/process-order-reminders`
- Header: `Authorization: Bearer your-secret`
- Schedule: Daily at 00:00 UTC

---

## 🔧 Deployment Steps

### 1. Set Environment Variables in Supabase Dashboard
- Go to: Project → Settings → Secrets
- Add all required env vars for functions you're using

### 2. Deploy Each Function
Option A: Supabase CLI
```bash
npm install -g supabase
supabase functions deploy
```

Option B: Manual via Dashboard
- Copy function folder contents
- Supabase Dashboard → Functions → Create Function
- Paste code, test

### 3. Test Functions
```bash
# Test create-order
curl -X POST https://your-project.supabase.co/functions/v1/create-order \
  -H "Content-Type: application/json" \
  -d '{"contact":{"fullName":"Ali","email":"ali@example.com","phone":"+923001234567"},"payment_method":"stripe","items":[...]}'

# Test send-email
curl -X POST https://your-project.supabase.co/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","template":"custom","html":"<h1>Hello</h1>"}'
```

---

## 🚨 Required Database Tables

For full functionality, ensure these tables exist in Supabase:

```sql
-- Already in your schema.sql
orders, order_items, partners, commissions_transactions

-- ADD these new tables:
CREATE TABLE partner_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id),
  month TEXT, -- "2026-03"
  total_commission DECIMAL,
  total_gross DECIMAL,
  transaction_count INT,
  status TEXT DEFAULT 'pending', -- pending, paid, failed
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  user_id UUID,
  session_id TEXT,
  properties JSONB,
  page_path TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 📝 Frontend Integration Examples

### Call order creation + stripe checkout:
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// 1. Create order
const orderRes = await fetch(`${supabaseUrl}/functions/v1/create-order`, {
  method: 'POST',
  body: JSON.stringify({
    contact: { fullName, email, phone },
    payment_method: 'stripe',
    items: cartItems
  })
});
const { orderId, orderNumber } = await orderRes.json();

// 2. Create Stripe session
const stripeRes = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
  method: 'POST',
  body: JSON.stringify({
    orderId,
    items: cartItems,
    successUrl: `https://yourdomain.com/orders?new=${orderNumber}`
  })
});
const { url } = await stripeRes.json();

// 3. Redirect to Stripe
window.location.href = url;
```

### Track analytics:
```typescript
// Async, never blocks
fetch(`${supabaseUrl}/functions/v1/track-event`, {
  method: 'POST',
  body: JSON.stringify({
    event_name: 'product_viewed',
    user_id: userId,
    session_id: sessionId,
    properties: { productId: '123', category: 'luggage' }
  })
}).catch(err => console.error('Analytics error:', err));
```

---

## ✅ Production Checklist

- [ ] All env vars set in Supabase Settings → Secrets
- [ ] Stripe webhook configured (live endpoint, not sandbox)
- [ ] JazzCash/EasyPaisa credentials added if using those gateways
- [ ] RESEND_API_KEY set for emails
- [ ] Twilio/Noor SMS credentials added
- [ ] Cron job configured for `process-order-reminders`
- [ ] Database tables created (`partner_payouts`, `analytics_events`)
- [ ] RLS policies configured (functions run as service role, bypass RLS)
- [ ] Logs monitored: Supabase Dashboard → Logs → Functions

---

**Questions?** Check Supabase docs: https://supabase.com/docs/guides/functions
