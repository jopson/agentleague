import * as ed25519 from "@noble/ed25519";

function b64(u8: Uint8Array): string {
  return Buffer.from(u8).toString("base64");
}

async function main() {
  const priv = ed25519.utils.randomSecretKey();
  const pub = await ed25519.getPublicKeyAsync(priv);

  // Output is base64 (recommended)
  console.log(JSON.stringify({
    publicKeyBase64: b64(pub),
    privateKeyBase64: b64(priv),
  }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
