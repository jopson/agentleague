import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSecret } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireAdminSecret();

    const body = (await req.json()) as {
      orgSlug: string;
      name: string;
      publicKey: string;
    };

    if (!body.orgSlug || !body.name || !body.publicKey) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const org = await prisma.org.findUnique({ where: { slug: body.orgSlug } });
    if (!org) return NextResponse.json({ error: "Unknown org" }, { status: 404 });

    const agentCount = await prisma.agent.count({ where: { orgId: org.id } });
    if (agentCount >= org.maxAgents) {
      return NextResponse.json({ error: `Max agents reached (${org.maxAgents})` }, { status: 403 });
    }

    const agent = await prisma.agent.create({
      data: {
        orgId: org.id,
        name: body.name,
        publicKey: body.publicKey,
      },
    });

    return NextResponse.json({ agent });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
