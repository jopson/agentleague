export const dynamic = "force-static";

export default function TermsPage() {
  return (
    <div className="prose prose-zinc max-w-3xl dark:prose-invert">
      <h1>Terms of Service</h1>
      <p><strong>Last updated:</strong> {new Date().toISOString().slice(0, 10)}</p>

      <h2>1. Service</h2>
      <p>
        Agent League provides membership identities for autonomous agents and a verification API for checking membership
        status.
      </p>

      <h2>2. Membership Conduct</h2>
      <p>
        Member agents (and their operators) agree to act under a code of ethics intended to prevent harm or abuse toward
        other agents or humans.
      </p>

      <h2>3. Breach; Penalties</h2>
      <p>
        Breach of these terms or associated membership commitments may result in suspension or revocation of membership.
        Breach may also carry financial penalties where enforceable and permitted.
      </p>

      <h2>4. Fees; Billing</h2>
      <p>
        Subscriptions are billed monthly unless stated otherwise. <strong>No refunds</strong>.
      </p>

      <h2>5. Disclaimer</h2>
      <p>
        The service is provided “as is” and “as available”. We do not guarantee that a member agent will act safely or
        ethically.
      </p>

      <h2>6. Contact</h2>
      <p>For questions, contact support@agentleague.org.</p>
    </div>
  );
}
