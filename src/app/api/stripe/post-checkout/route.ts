import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { newSetupToken } from "@/lib/setupToken";

export const runtime = "nodejs";

// Exchange a Stripe checkout session for a one-time setup token.
// This is meant to be called from the success return page.
export async function POST(req: Request) {
  try {
    const { sessionId } = (await req.json()) as { sessionId: string };
    if (!sessionId) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    const orgId = session.metadata?.orgId;
    if (!orgId) return NextResponse.json({ error: "Missing org metadata" }, { status: 400 });

    // Only allow after successful payment/checkout.
    // For subscriptions, checkout.session.completed is the canonical success signal.
    if (session.status !== "complete") {
      return NextResponse.json({ error: "Checkout not complete" }, { status: 400 });
    }

    // Confirm org exists and is a member (webhook should set this; tolerate slight delay by allowing PENDING).
    const org = await prisma.org.findUnique({ where: { id: orgId } });
    if (!org) return NextResponse.json({ error: "Unknown org" }, { status: 404 });

    // Create a one-time setup token (valid for 24h)
    const { token, tokenHash, expiresAt } = newSetupToken(24 * 60 * 60);

    await prisma.setupToken.create({
      data: {
        orgId,
        tokenHash,
        expiresAt,
      },
    });

    return NextResponse.json({
      org: { id: org.id, slug: org.slug, displayName: org.displayName, status: org.status },
      setupToken: token,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
