import Stripe from "stripe";

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe(key, {
    // Pin to the version expected by the installed stripe SDK typings
    apiVersion: "2026-01-28.clover",
    typescript: true,
  });
}
