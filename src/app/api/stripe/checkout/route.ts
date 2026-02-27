import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// v0: create checkout for an existing org (by slug)
export async function POST(req: Request) {
  try {
    const { orgSlug, email } = (await req.json()) as { orgSlug: string; email?: string };
    if (!orgSlug) return NextResponse.json({ error: "Missing orgSlug" }, { status: 400 });

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) return NextResponse.json({ error: "STRIPE_PRICE_ID not configured" }, { status: 500 });

    const appUrl = process.env.APP_URL || "http://localhost:3000";

    const org = await prisma.org.findUnique({
      where: { slug: orgSlug },
      include: { subscription: true },
    });
    if (!org) return NextResponse.json({ error: "Unknown org" }, { status: 404 });

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: `${appUrl}/pricing?success=1`,
      cancel_url: `${appUrl}/pricing?canceled=1`,
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      subscription_data: {
        metadata: { orgId: org.id },
      },
      metadata: { orgId: org.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
