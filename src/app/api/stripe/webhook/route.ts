import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();

  const sig = (await headers()).get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET not configured" }, { status: 500 });

  const body = await req.text();

  let event: unknown;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  try {
    if (typeof event !== "object" || event === null || !("type" in event)) {
      return NextResponse.json({ error: "Malformed event" }, { status: 400 });
    }

    const evt = event as { type: string; data: { object: unknown } };

    switch (evt.type) {
      case "checkout.session.completed": {
        const session = evt.data.object as { metadata?: Record<string, string>; customer?: string; subscription?: string };
        const orgId = session.metadata?.orgId;
        if (orgId) {
          await prisma.org.update({ where: { id: orgId }, data: { status: "MEMBER" } });
          await prisma.subscription.upsert({
            where: { orgId },
            create: {
              orgId,
              stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
              stripeSubscription: typeof session.subscription === "string" ? session.subscription : undefined,
              status: "active",
            },
            update: {
              stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
              stripeSubscription: typeof session.subscription === "string" ? session.subscription : undefined,
              status: "active",
            },
          });
        }
        break;
      }
      case "invoice.payment_failed":
      case "customer.subscription.deleted": {
        // Best-effort: mark org LAPSED by subscription id
        const obj = evt.data.object as { id?: unknown };
        const subId = typeof obj.id === "string" ? obj.id : undefined;
        if (subId) {
          const sub = await prisma.subscription.findFirst({ where: { stripeSubscription: subId } });
          if (sub) await prisma.org.update({ where: { id: sub.orgId }, data: { status: "LAPSED" } });
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Webhook handling error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
