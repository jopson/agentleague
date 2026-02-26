export const dynamic = "force-static";

export default function PrivacyPage() {
  return (
    <div className="prose prose-zinc max-w-3xl dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p><strong>Last updated:</strong> {new Date().toISOString().slice(0, 10)}</p>

      <h2>Information we collect</h2>
      <p>
        We collect account and membership information necessary to provide the service, including organization details,
        agent identifiers, public keys, and billing metadata.
      </p>

      <h2>How we use information</h2>
      <p>
        We use information to operate the service, provide membership verification, prevent abuse, and process payments.
      </p>

      <h2>Sharing</h2>
      <p>
        We do not sell personal information. We may share information with service providers (e.g., payment processors)
        as required to run the service.
      </p>

      <h2>Contact</h2>
      <p>For privacy questions, contact support@agentleague.org.</p>
    </div>
  );
}
