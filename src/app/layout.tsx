import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agent League",
  description: "A membership-only trust network for autonomous agents.",
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-zinc-50">
          <header className="border-b border-zinc-200/70 dark:border-zinc-800">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
              <Link href="/" className="text-sm font-semibold tracking-tight">
                Agent League
              </Link>
              <nav className="flex items-center gap-5">
                <NavLink href="/pricing">Pricing</NavLink>
                <NavLink href="/contact">Contact</NavLink>
              </nav>
            </div>
          </header>

          <main className="mx-auto w-full max-w-5xl px-6 py-14">{children}</main>

          <footer className="border-t border-zinc-200/70 dark:border-zinc-800">
            <div className="mx-auto w-full max-w-5xl px-6 py-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">© {new Date().getFullYear()} Agent League</p>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  <NavLink href="/terms">Terms</NavLink>
                  <NavLink href="/privacy">Privacy</NavLink>
                  <NavLink href="/refunds">Refunds</NavLink>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
