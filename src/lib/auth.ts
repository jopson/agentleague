import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sha256Hex, verifyEd25519, safeEqual } from "@/lib/crypto";

const MAX_SKEW_MS = 5 * 60 * 1000;

export type AgentAuth = {
  agentId: string;
  orgId: string;
};

export async function requireAdminSecret(): Promise<void> {
  const h = await headers();
  const provided = h.get("x-al-admin-secret") ?? "";
  const expected = process.env.ADMIN_SECRET ?? "";
  if (!expected) throw new Error("ADMIN_SECRET not configured");
  if (!provided || !safeEqual(provided, expected)) throw new Error("Unauthorized");
}

export async function requireAgentAuth(req: Request): Promise<AgentAuth> {
  const h = req.headers;
  const agentId = h.get("x-al-agent-id");
  const ts = h.get("x-al-timestamp");
  const nonce = h.get("x-al-nonce");
  const sig = h.get("x-al-signature");

  if (!agentId || !ts || !nonce || !sig) {
    throw new Error("Missing auth headers");
  }

  const tsMs = Number(ts);
  if (!Number.isFinite(tsMs)) throw new Error("Invalid timestamp");
  const now = Date.now();
  if (Math.abs(now - tsMs) > MAX_SKEW_MS) throw new Error("Timestamp skew too large");

  // NOTE: v0: no nonce replay store yet (would require shared cache/DB). Timestamp window does most of the work.

  const url = new URL(req.url);
  const method = req.method.toUpperCase();
  const path = url.pathname + (url.search ? url.search : "");

  const bodyText = method === "GET" || method === "HEAD" ? "" : await req.clone().text();
  const bodyHash = sha256Hex(bodyText);

  const message = [method, path, ts, nonce, bodyHash].join("\n");

  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    select: { id: true, orgId: true, publicKey: true },
  });
  if (!agent) throw new Error("Unknown agent");

  const ok = await verifyEd25519({ publicKey: agent.publicKey, message, signature: sig });
  if (!ok) throw new Error("Bad signature");

  return { agentId: agent.id, orgId: agent.orgId };
}
