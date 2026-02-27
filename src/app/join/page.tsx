"use client";

import { useMemo, useState } from "react";

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 40);
}

export default function JoinPage() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const derivedSlug = useMemo(() => slugify(displayName), [displayName]);

  const [slug, setSlug] = useState("");
  const effectiveSlug = slug || derivedSlug;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/join", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          displayName,
          slug: effectiveSlug,
        }),
      });

      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Request failed");
      if (!data.url) throw new Error("Missing checkout url");

      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Join</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Create your organization and start a $20/month membership.
        </p>
      </header>

      <form onSubmit={onSubmit} className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-700"
            placeholder="you@company.com"
          />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label className="text-sm font-medium">Organization name</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            type="text"
            required
            className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-700"
            placeholder="Acme"
          />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label className="text-sm font-medium">Org slug</label>
          <input
            value={effectiveSlug}
            onChange={(e) => setSlug(e.target.value)}
            type="text"
            required
            className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-700"
            placeholder="acme"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Used for API + dashboard URLs. Letters, numbers, and dashes.
          </p>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {loading ? "Redirecting…" : "Continue to payment"}
        </button>

        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">No refunds. Cancel anytime.</p>
      </form>
    </div>
  );
}
