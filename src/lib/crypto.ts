import { createHash, timingSafeEqual } from "node:crypto";
import * as ed25519 from "@noble/ed25519";

export function sha256Hex(input: string | Buffer): string {
  return createHash("sha256").update(input).digest("hex");
}

export function decodeKey(key: string): Uint8Array {
  // Accept base64 or hex
  const k = key.trim();
  const isHex = /^[0-9a-fA-F]+$/.test(k) && k.length % 2 === 0;
  return isHex ? Uint8Array.from(Buffer.from(k, "hex")) : Uint8Array.from(Buffer.from(k, "base64"));
}

export function decodeSig(sig: string): Uint8Array {
  return Uint8Array.from(Buffer.from(sig.trim(), "base64"));
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export async function verifyEd25519({
  publicKey,
  message,
  signature,
}: {
  publicKey: string;
  message: string;
  signature: string;
}): Promise<boolean> {
  const pk = decodeKey(publicKey);
  const sig = decodeSig(signature);
  const msg = Uint8Array.from(Buffer.from(message, "utf8"));
  return ed25519.verify(sig, msg, pk);
}
