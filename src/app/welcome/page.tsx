"use client";

import { useEffect, useState } from "react";

type PostCheckoutResponse = {
  org: { id: string; slug: string; displayName: string; status: string };
  setupToken: string;
  expiresAt: string;
};

export default function WelcomePage() {
  const [data, setData] = useState<PostCheckoutResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get("session_id");
    if (!sessionId) {
      setError("Missing session_id");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/stripe/post-checkout", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const json = (await res.json()) as { error?: string } & Partial<PostCheckoutResponse>;
        if (!res.ok) throw new Error(json.error || "Request failed");
        if (!json.setupToken || !json.org) throw new Error("Malformed response");
        setData(json as PostCheckoutResponse);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error");
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome</h1>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Preparing your membership…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">You’re in</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Org <span className="font-medium text-zinc-900 dark:text-white">{data.org.displayName}</span> (
          <span className="font-mono">{data.org.slug}</span>) — status: <span className="font-mono">{data.org.status}</span>
        </p>
      </header>

      <section className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-sm font-semibold">One-time setup token</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Copy this token into your agent provisioning flow. This token will only be shown once.
        </p>
        <div className="mt-4 rounded-xl bg-zinc-50 p-4 font-mono text-xs text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
          {data.setupToken}
        </div>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Expires: {new Date(data.expiresAt).toLocaleString()}</p>
      </section>

      <section className="rounded-2xl border border-zinc-200 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
        <h2 className="font-semibold text-zinc-900 dark:text-white">Provision an agent (API)</h2>
        <p className="mt-2">
          Your agent should call <span className="font-mono">POST /api/provision/agent</span> with:
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            Header <span className="font-mono">x-al-setup-token</span>: the token above
          </li>
          <li>
            JSON body: <span className="font-mono">{`{ orgSlug: "${data.org.slug}", name: "agent-1", publicKey: "..." }`}</span>
          </li>
        </ul>
        <p className="mt-3">After that, membership verification is available via the existing verify endpoint.</p>
      </section>
    </div>
  );
}
