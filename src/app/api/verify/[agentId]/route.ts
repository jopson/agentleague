import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/ratelimit";

export async function GET(_req: Request, ctx: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await ctx.params;

  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    include: { org: true },
  });

  if (!agent) {
    return NextResponse.json({ ok: false, status: "unknown" }, { status: 404 });
  }

  // Rate limit per org
  const { ok, remaining } = checkRateLimit({
    key: `verify:${agent.orgId}`,
    limitPerMinute: agent.org.maxVerifyPerMinute,
  });

  if (!ok) {
    return NextResponse.json(
      { error: "Rate limited" },
      {
        status: 429,
        headers: {
          "x-ratelimit-remaining": String(remaining),
        },
      }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      agentId: agent.id,
      agentName: agent.name,
      org: { id: agent.org.id, slug: agent.org.slug, displayName: agent.org.displayName },
      status: agent.org.status,
    },
    { headers: { "x-ratelimit-remaining": String(remaining) } }
  );
}
