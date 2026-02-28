import crypto from "crypto";

export type SetupTokenPlain = {
  token: string;
  tokenHash: string;
  expiresAt: Date;
};

export function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function newSetupToken(ttlSeconds: number): SetupTokenPlain {
  const token = `al_setup_${crypto.randomBytes(24).toString("base64url")}`;
  const tokenHash = sha256Hex(token);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  return { token, tokenHash, expiresAt };
}
