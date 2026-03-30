# VSK Travel - Deployment Guide

Complete guide to deploy VSK Travel to production.

---

## Prerequisites

- Node.js 18+ installed
- Git configured with SSH or HTTPS
- Supabase project created
- Domain name (vsktravel.pk or custom)

---

## Phase 1: Local Preparation

### 1. Copy environment template
```bash
cp .env.example .env.local
```

### 2. Fill in all required variables
See `.env.example` for complete list. **At minimum**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_PUBLISHABLE_KEY` (if using Stripe)
- `STRIPE_SECRET_KEY`

### 3. Test locally
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### 4. Verify Supabase connection
- Signup works → check Supabase Auth
- Orders can be created → check Supabase Database
- Environment is validated → `src/lib/env.ts`

### 5. Run TypeScript check
```bash
npm run type-check
# Should output: 0 errors
```

---

## Phase 2: Deploy Supabase Edge Functions

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Link your project
```bash
supabase link --project-ref <your-project-id>
```

Get project ID from: Supabase Dashboard → Settings → General

### 4. Deploy all functions
```bash
supabase functions deploy
```

This deploys all functions from `supabase/functions/` folder.

### 5. Set function secrets
```bash
supabase secrets set STRIPE_SECRET_KEY="sk_live_..."
supabase secrets set STRIPE_WEBHOOK_SECRET="whsec_..."
supabase secrets set RESEND_API_KEY="re_..."
# ... all other secrets
```

Or set via Supabase Dashboard → Project → Settings → Secrets

### 6. Configure Stripe Webhook
In Stripe Dashboard:
1. Go to: Developers → Webhooks
2. Add Endpoint
3. URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
4. Events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy webhook secret → Add to `STRIPE_WEBHOOK_SECRET`

---

## Phase 3: Deploy to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Production ready - Phase 8"
git push origin main
```

### 2. Import on Vercel
1. Visit: https://vercel.com/new
2. Import your GitHub repository
3. Select project root (should auto-detect)

### 3. Add environment variables in Vercel
Vercel Dashboard → Project → Settings → Environment Variables

Copy all from `.env.local` (except local-only ones like `localhost` URLs):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL=https://yourdomain.com` (important!)
- All payment gateway secrets

### 4. Deploy
```bash
vercel --prod
# OR click "Deploy" button in dashboard
```

### 5. Verify deployment
- Visit your Vercel URL
- Test signup/login
- Test adding to cart
- Check console for errors

---

## Phase 4: Configure Custom Domain

### 1. In Vercel
1. Project → Settings → Domains
2. Add domain
3. Follow DNS instructions for your registrar

### 2. Update Supabase allowed URLs
Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://yourdomain.com`
- Redirect URLs:
  - `https://yourdomain.com/auth/callback`
  - `https://yourdomain.com/api/auth/callback`

### 3. Update OAuth providers
If using Google OAuth:
1. Google Cloud Console → APIs & Services → Credentials
2. OAuth 2.0 Client IDs → Edit
3. Authorized redirect URIs: Add `https://yourdomain.com/api/auth/callback`

---

## Phase 5: Database & Migrations

### 1. Run SQL schema
Supabase Dashboard → SQL Editor:
1. Create new query
2. Paste contents of `supabase/schema.sql`
3. Run
4. Verify tables created

### 2. Create additional tables (Phase 8)
```sql
CREATE TABLE partner_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id),
  month TEXT,
  total_commission DECIMAL,
  total_gross DECIMAL,
  transaction_count INT,
  status TEXT DEFAULT 'pending',
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

### 3. Enable RLS (Row Level Security)
Run for each table that needs protection:
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
```

Existing RLS policies are in `supabase/schema.sql`.

---

## Phase 6: DNS & Email Configuration

### 1. Setup email provider (Resend)
1. Visit: https://resend.com
2. Create account
3. Add domain (optional but recommended for deliverability)
4. Get API key → `RESEND_API_KEY`

### 2. Setup SMS (Twilio or Noor)
**Twilio:**
1. Visit: https://www.twilio.com
2. Create account
3. Get: Account SID, Auth Token, Phone Number

**Noor SMS:**
1. Visit: https://noorsms.com (Pakistan)
2. Create merchant account
3. Get: API Key

---

## Phase 7: Monitor & Maintain

### 1. Vercel Analytics
Vercel Dashboard → Analytics
- Monitor page load times
- Check error rates
- View usage

### 2. Supabase Logs
Supabase Dashboard → Logs
- Check function execution
- Monitor database activity
- Alert on errors

### 3. Error Tracking
Consider adding:
- Sentry (error tracking)
- LogRocket (session replay)
- Google Analytics 4

```bash
npm install @sentry/nextjs
# Configure in next.config.js
```

---

## Phase 8: Security Checklist

- [ ] All `.env` secrets set (no hardcoded secrets)
- [ ] Supabase RLS policies enabled
- [ ] CORS configured (Vercel → Supabase)
- [ ] Rate limiting enabled on APIs
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] CSP headers configured
- [ ] HSTS enabled (Vercel handles)
- [ ] SQL injection prevention (Supabase handles)
- [ ] XSS prevention (React built-in)
- [ ] CSRF tokens for forms (check `next-csrf`)

---

## Common Issues & Fixes

### "SUPABASE_URL is undefined"
- Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL`
- Verify Vercel environment variables
- Run `vercel env pull` to sync

### "Stripe webhook failing"
- Verify webhook URL is accessible
- Check `STRIPE_WEBHOOK_SECRET` is correct
- View webhook logs in Stripe Dashboard

### "Functions not deploying"
```bash
supabase functions delete <function-name>
supabase functions deploy
```

### "RLS prevents inserts"
- Check user is authenticated (auth token valid)
- Verify RLS policy allows insert for user role
- Use service role key for admin operations

---

## Rollback Plan

### If something breaks after deploy:
1. **Immediate:** Revert to previous Vercel deployment
   - Vercel Dashboard → Deployments → Select previous → "Promote to Production"

2. **Database issue:** Restore from backup
   - Supabase Dashboard → Database → Backups
   - Restore to point-in-time

3. **Environment variable:** Disable feature
   - Vercel: Remove env var or set to empty
   - Restart deployment

---

## Performance Optimization (Optional)

### 1. Enable caching
- Vercel: Add `.vercelignore`
- Configure cache headers in `vercel.json`

### 2. Image optimization
- Replace `<img>` with `<Image>` from next/image
- Already done in most components

### 3. Database indexing
```sql
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

### 4. CDN configuration
- Vercel automatically serves from ~280 edge locations
- Add Cache-Control headers for static assets

---

## Go-Live Checklist

Before flipping traffic:
- [ ] All tests pass locally
- [ ] Staging deployment works
- [ ] Database backups configured
- [ ] Error monitoring setup
- [ ] Email/SMS tested
- [ ] Payment processor tested
- [ ] All env vars set in production
- [ ] SSL certificate valid (Vercel handles)
- [ ] Domain DNS propagated (test with `nslookup yourdomain.com`)
- [ ] Analytics configured
- [ ] Support email monitored

---

## Support

For issues:
1. Check Vercel logs: `vercel logs`
2. Check Supabase logs: Dashboard → Logs
3. Check browser console (F12)
4. Email: support@vsktravel.pk

---

**Deployment Date:** ___________
**Deployed By:** ___________
**Status:** [ ] Staging [ ] Production
