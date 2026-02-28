import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sha256Hex } from "@/lib/setupToken";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("x-al-setup-token") ?? "";
    if (!token) return NextResponse.json({ error: "Missing setup token" }, { status: 401 });

    const body = (await req.json()) as { orgSlug: string; name: string; publicKey: string };
    const orgSlug = (body.orgSlug || "").trim().toLowerCase();
    const name = (body.name || "").trim();
    const publicKey = (body.publicKey || "").trim();

    if (!orgSlug || !name || !publicKey) {
      return NextResponse.json({ error: "Missing orgSlug/name/publicKey" }, { status: 400 });
    }

    const org = await prisma.org.findUnique({ where: { slug: orgSlug } });
    if (!org) return NextResponse.json({ error: "Unknown org" }, { status: 404 });
    if (org.status !== "MEMBER" && org.status !== "VERIFIED") {
      return NextResponse.json({ error: "Org is not an active member" }, { status: 403 });
    }

    const tokenHash = sha256Hex(token);
    const rec = await prisma.setupToken.findUnique({ where: { tokenHash } });
    if (!rec || rec.orgId !== org.id) {
      return NextResponse.json({ error: "Invalid setup token" }, { status: 401 });
    }

    if (rec.usedAt) return NextResponse.json({ error: "Setup token already used" }, { status: 401 });
    if (rec.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "Setup token expired" }, { status: 401 });
    }

    // Mark token used (one-time)
    await prisma.setupToken.update({ where: { id: rec.id }, data: { usedAt: new Date() } });

    // Enforce entitlement cap
    const agentCount = await prisma.agent.count({ where: { orgId: org.id } });
    if (agentCount >= org.maxAgents) {
      return NextResponse.json({ error: "Agent limit reached" }, { status: 403 });
    }

    const agent = await prisma.agent.create({
      data: {
        orgId: org.id,
        name,
        publicKey,
      },
      select: { id: true, name: true, orgId: true },
    });

    return NextResponse.json({ agent });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    const status = msg.includes("Unique constraint") ? 409 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
