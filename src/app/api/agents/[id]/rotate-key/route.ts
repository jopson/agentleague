import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSecret, requireAgentAuth } from "@/lib/auth";

const COOLDOWN_MS = 24 * 60 * 60 * 1000;

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const url = new URL(req.url);
  const override = url.searchParams.get("override") === "true";

  try {
    if (override) {
      await requireAdminSecret();
    } else {
      // Agent can rotate its own key (signed with current key)
      const auth = await requireAgentAuth(req);
      if (auth.agentId !== id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await req.json()) as { publicKey: string };
    if (!body.publicKey) return NextResponse.json({ error: "Missing publicKey" }, { status: 400 });

    const agent = await prisma.agent.findUnique({ where: { id } });
    if (!agent) return NextResponse.json({ error: "Unknown agent" }, { status: 404 });

    if (!override && agent.lastRotatedAt) {
      const elapsed = Date.now() - agent.lastRotatedAt.getTime();
      if (elapsed < COOLDOWN_MS) {
        return NextResponse.json({ error: "Rotation cooldown (24h)" }, { status: 429 });
      }
    }

    const updated = await prisma.agent.update({
      where: { id },
      data: {
        publicKey: body.publicKey,
        lastRotatedAt: new Date(),
      },
    });

    return NextResponse.json({ agent: updated });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
