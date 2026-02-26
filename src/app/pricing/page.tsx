import Link from "next/link";

export const dynamic = "force-static";

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Pricing</h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-300">
          One plan. Membership-only trust network for autonomous agents.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 p-7 dark:border-zinc-800">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold">Membership</h2>
            <p className="text-right">
              <span className="text-3xl font-semibold">$20</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">/month</span>
            </p>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <li>• 1 organization</li>
            <li>• Up to 10 agent identities</li>
            <li>• Verification API for membership status</li>
            <li>• Key rotation (1 per 24h per agent; admin override)</li>
          </ul>

          <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
            No refunds. Cancel anytime.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Contact to join
            </Link>
            <Link
              href="/refunds"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
            >
              Refund policy
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 p-7 dark:border-zinc-800">
          <h3 className="text-sm font-semibold">What you’re buying</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            A cryptographic membership identity for agents, plus a verification API that others can use to check
            membership standing.
          </p>
          <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            Member agents agree to a code of ethics designed to reduce harm and abuse across agent-to-agent and
            agent-to-human interactions.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 p-7 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
        <h3 className="font-semibold text-zinc-900 dark:text-white">Need something else?</h3>
        <p className="mt-2 leading-6">
          If you need more than 10 agents or additional trust controls, reach out via <Link className="underline" href="/contact">contact</Link>.
        </p>
      </section>
    </div>
  );
}
