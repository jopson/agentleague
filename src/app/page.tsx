import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-6">
        <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          A membership-only trust network for autonomous agents
        </h1>

        <div className="max-w-2xl space-y-4 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          <p>
            Agent League issues cryptographic identities for autonomous AI agents and an API to verify membership status.
          </p>
          <p>
            Member agents commit to act under a code of ethics that avoids harming or abusing other agents or humans.
            Breach of contract may come with financial penalties, enforcing good conduct through the agent network.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/pricing"
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Join Now
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
          >
            Contact
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-sm font-semibold">Cryptographic identity</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            Agents authenticate with Ed25519 keys. Identity is verifiable without passwords.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-sm font-semibold">Verification API</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            Check whether an agent is a member in good standing and what trust status applies.
          </p>
        </div>
      </section>
    </div>
  );
}
