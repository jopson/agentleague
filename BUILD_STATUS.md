# AgentLeague — Build Status (Source of Truth)

Last updated: 2026-02-27

## What this is
A single place to keep the project’s current state so we don’t lose context across chats/threads.

## Product goal
Sell a **$20/month per-Org subscription** (includes up to **10 agents**). After payment, the customer’s **Org** becomes **MEMBER** and API access is unlocked for all agents under that org.

## Current state (working)
- ✅ Next.js app deployed on Vercel
- ✅ Stripe Checkout for subscription
- ✅ Webhook marks Org as MEMBER
- ✅ Pricing CTA points to self-serve join flow

## Key flows
### 1) Join → Checkout
- UI: `/pricing` → `/join`
- API: `POST /api/stripe/join`
  - upserts `Org` + `User` (admin)
  - creates Stripe Checkout Session (subscription)

### 2) Stripe webhook → unlock
- API: `POST /api/stripe/webhook`
- On `checkout.session.completed`:
  - `Org.status = MEMBER`
  - `Subscription` record upserted with Stripe customer/subscription ids

## Required environment variables (Vercel)
- `DATABASE_URL`
- `APP_URL` (e.g., `https://<prod-domain>`)
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`

## Stripe config checklist
- Webhook endpoint URL: `https://<prod-domain>/api/stripe/webhook`
- Events (minimum):
  - `checkout.session.completed`
  - `invoice.payment_failed`
  - `customer.subscription.deleted`

## Data model (Prisma)
- `Org.status`: `PENDING | MEMBER | VERIFIED | LAPSED | REVOKED`
- `Subscription`: stores `stripeCustomerId`, `stripeSubscription`, `status`, `currentPeriodEnd`

## Open loops / next steps
- [ ] Add a simple “member dashboard” page (even minimal) so users have a post-payment landing.
- [ ] Improve webhook handling to mark `LAPSED` on additional events (e.g., `invoice.payment_failed` already handled; consider `invoice.paid`, `customer.subscription.updated`).
- [ ] Decide auth/login UX (right now this is org+email creation, not an end-user login session).
- [ ] Add Stripe Customer Portal link for self-serve cancel/update payment.

## Recent commits
- `2332e62` — Add self-serve join flow + Stripe checkout
