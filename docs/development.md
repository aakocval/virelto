# Development

## Architecture

```
app/              Next.js App Router routes (thin — no PDF logic)
features/<tool>/  UI + hook per tool, composed from pdf-engine + shared
pdf-engine/client/ All PDF logic: pdf-lib operations, Web Worker, pdf.js
shared/ui/        shadcn primitives + shared components (theme, dropzone…)
shared/lib/       Query client, usage limits, file validation, downloads
shared/utils/     cn(), constants, tool registry
server/auth/      Supabase browser/server/admin clients, server actions
server/billing/   Stripe client, plan config, checkout/webhook/portal routes
server/db/        SQL schema + types for `profiles` / `subscriptions`
middleware.ts     Refreshes Supabase session, protects /dashboard
```

PDF bytes never leave `pdf-engine/client` — `features/` only orchestrates
UI state and calls into it. No PDF bytes ever touch `app/api/*`.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Copy environment variables**
   ```bash
   cp .env.example .env.local
   ```

3. **Supabase** (free tier is enough)
   - Create a project at [supabase.com](https://supabase.com).
   - Project Settings → API → copy the URL, anon key, and service role key
     into `.env.local`.
   - SQL Editor → paste and run [`server/db/schema.sql`](../server/db/schema.sql).
     This creates `profiles` + `subscriptions` tables with RLS and a trigger
     that provisions a free-plan row for every new signup.
   - Authentication → Providers → enable Email (magic link) and Google.
   - Authentication → URL Configuration → add
     `http://localhost:3000/auth/callback` (and your production URL) as a
     redirect URL.

4. **Stripe** (only needed to test billing)
   - Create a Product with a recurring monthly Price for "Pro" → copy the
     Price ID into `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`.
   - Developers → API keys → copy the secret key into `STRIPE_SECRET_KEY`.
   - Developers → Webhooks → add an endpoint at `/api/stripe/webhook`
     listening for `checkout.session.completed`,
     `customer.subscription.updated`, `customer.subscription.deleted` →
     copy the signing secret into `STRIPE_WEBHOOK_SECRET`. For local testing,
     use `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

5. **Run locally**
   ```bash
   npm run dev
   ```
   All 8 PDF tools work immediately, with no env vars required — auth and
   billing only activate once Supabase/Stripe keys are set.

## Deployment

Deploy to Vercel (or Cloudflare Pages): connect the repo, set the same
environment variables from `.env.local` in the project settings, and set
`NEXT_PUBLIC_SITE_URL` to your production domain. No other infrastructure is
required.

## Why this stays near $0/month

- **No compute cost for PDF processing** — it all runs in the visitor's
  browser via Web Workers, so there's no server CPU time or file storage to
  pay for, regardless of traffic.
- **Vercel/Cloudflare free tier** covers the thin Next.js app (routes,
  auth/billing API handlers) comfortably at low-to-moderate traffic.
- **Supabase free tier** covers auth + the two tiny metadata tables — no
  file data is ever stored there.
- **Stripe** only takes a percentage of real subscription revenue — no
  fixed cost.

## Guest mode & limits

Every tool works without an account. Daily usage is tracked client-side in
`localStorage` (see [`shared/lib/usage-limit.ts`](../shared/lib/usage-limit.ts)) —
this is a soft, UX-level limit consistent with the no-server-file-tracking
policy, not a hard server-enforced quota.
