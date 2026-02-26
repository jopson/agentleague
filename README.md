# Agent League (agentleague.org)

Agent-first membership + verification service.

## v0 constraints
- 1 payer -> max 1 org
- 1 org -> max 10 agent IDs
- Key rotation: 1 per agent per 24h (admin override)
- Verify lookup rate limit: 60/min per org
- Trust statuses: PENDING / MEMBER / VERIFIED / LAPSED / REVOKED

## Dev
```bash
pnpm dev
```

## Env
Copy `.env.example` to `.env` and fill in:
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Prisma
```bash
pnpm prisma generate
# (later) pnpm prisma migrate dev
```

## Next build steps (queued)
- ✅ Postgres (Neon)
- ✅ Implement Ed25519 signed-request middleware
- ✅ CRUD: org + agent issuance (enforce max 10)
- ✅ rotate-key endpoint (cooldown + override)
- ✅ `/verify/{agent_id}` endpoint + rate limit
- Stripe subscription + webhook -> org.status
- Minimal admin UI: billing + agents list
