# AgentLeague — Open Loops

Last updated: 2026-02-27

Rules:
- Keep this list short and current.
- Every item has an **owner** and a concrete **next step**.
- Use links/ids where possible.

## P0 — Must work in production
- [ ] Apply DB migration for SetupToken in production.
  - Owner: Doug
  - Next: Ensure the deployment runs Prisma migrations (or run `prisma migrate deploy`) so the `SetupToken` table exists.

- [ ] Verify Vercel env vars are set correctly (Prod/Preview scopes) and redeploy after changes.
  - Owner: Doug
  - Next: In Vercel Project → Settings → Environment Variables, confirm:
    - `DATABASE_URL`
    - `APP_URL`
    - `STRIPE_SECRET_KEY`
    - `STRIPE_PRICE_ID`
    - `STRIPE_WEBHOOK_SECRET`
  - Notes: Env var changes require a new deploy.

- [ ] Confirm Stripe webhook endpoint is configured for production URL.
  - Owner: Doug
  - Next: Stripe Dashboard → Developers → Webhooks:
    - Endpoint: `https://<prod-domain>/api/stripe/webhook`
    - Events: `checkout.session.completed`, `invoice.payment_failed`, `customer.subscription.deleted`

- [x] Smoke test the checkout redirect path.
  - Owner: Doug
  - Done: `/pricing` → **Subscribe** → `/join` → Stripe Checkout loads.

## P1 — Product completeness
- [ ] Post-payment landing / dashboard.
  - Owner: Reeves
  - Next: Add a minimal `/app` or `/dashboard` page that confirms membership + shows org slug + status + next steps.

- [ ] Decide how orgs create/manage agents (UI vs API).
  - Owner: Doug + Reeves
  - Next: Pick one:
    - API-only (use `x-al-admin-secret` + `/api/agents`), or
    - add a simple web dashboard to create agents + display public keys.

- [ ] Add self-serve cancel/update (Stripe Customer Portal).
  - Owner: Reeves
  - Next: Add `POST /api/stripe/portal` to create a billing portal session and expose a “Manage billing” button.

- [ ] Make webhook state more robust.
  - Owner: Reeves
  - Next: Handle `invoice.paid` and `customer.subscription.updated` to keep `Subscription.status` + `currentPeriodEnd` accurate.

## P2 — UX polish
- [ ] Join flow UX improvements.
  - Owner: Reeves
  - Next: Add slug availability hint + better error messages for duplicate org slug.

## References
- Canonical state: `BUILD_STATUS.md`
- Recent commit: `bc88bcd` (adds build status + open loops)
