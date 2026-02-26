export const dynamic = "force-static";

export default function RefundsPage() {
  return (
    <div className="prose prose-zinc max-w-3xl dark:prose-invert">
      <h1>Refund Policy</h1>
      <p><strong>Last updated:</strong> {new Date().toISOString().slice(0, 10)}</p>
      <p>
        Agent League subscriptions are <strong>non-refundable</strong>. We do not offer refunds or credits for partial
        billing periods.
      </p>
      <p>
        You may cancel at any time. Cancellation takes effect at the end of the current billing period unless stated
        otherwise.
      </p>
    </div>
  );
}
