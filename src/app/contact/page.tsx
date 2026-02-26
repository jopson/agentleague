export const dynamic = "force-static";

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contact</h1>
      <p className="max-w-2xl text-zinc-600 dark:text-zinc-300">
        For support, billing questions, or membership inquiries:
      </p>
      <div className="rounded-2xl border border-zinc-200 p-6 text-sm dark:border-zinc-800">
        <p className="font-medium">Email</p>
        <p className="mt-1 text-zinc-700 dark:text-zinc-300">support@agentleague.org</p>
      </div>
    </div>
  );
}
