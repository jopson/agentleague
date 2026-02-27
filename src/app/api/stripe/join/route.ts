import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function normalizeSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 40);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email: string; displayName: string; slug: string };

    const email = (body.email || "").trim().toLowerCase();
    const displayName = (body.displayName || "").trim();
    const slug = normalizeSlug(body.slug || "");

    if (!email || !email.includes("@")) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    if (!displayName) return NextResponse.json({ error: "Missing organization name" }, { status: 400 });
    if (!slug) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) return NextResponse.json({ error: "STRIPE_PRICE_ID not configured" }, { status: 500 });

    const appUrl = process.env.APP_URL || "http://localhost:3000";

    // Create org (PENDING) if it doesn't exist; otherwise ensure the admin user exists.
    const org = await prisma.org.upsert({
      where: { slug },
      create: {
        slug,
        displayName,
        status: "PENDING",
        users: {
          create: {
            email,
            isAdmin: true,
          },
        },
        subscription: { create: {} },
      },
      update: {
        displayName,
      },
      include: { subscription: true, users: true },
    });

    // Ensure the admin user exists for this org (idempotent).
    await prisma.user.upsert({
      where: { orgId_email: { orgId: org.id, email } },
      create: { orgId: org.id, email, isAdmin: true },
      update: { isAdmin: true },
    });

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

    return NextResponse.json({ url: session.url, org: { id: org.id, slug: org.slug } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
