import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  Layout,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
        <Activity className="h-5 w-5 text-emerald-400" />
      </div>
      <span className="text-xl font-bold tracking-tight">
        Odds<span className="text-emerald-400">IQ</span>
      </span>
    </div>
  );
}

const FEATURES = [
  {
    icon: Brain,
    title: "Edge Detection",
    desc: "Our models scan prediction markets 24/7, surfacing contracts where the odds are mispriced.",
  },
  {
    icon: Layout,
    title: "Boards",
    desc: "Curate market collections by theme, strategy, or thesis. Track everything in one view.",
  },
  {
    icon: TrendingUp,
    title: "Auto-Trading",
    desc: "Set risk limits, pick a strategy, and let OddsIQ execute trades on Kalshi automatically.",
  },
  {
    icon: Shield,
    title: "Risk Controls",
    desc: "Per-board risk limits, daily exposure caps, concentration guards. Paper mode included.",
  },
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    desc: "Real-time P&L, win rates, and performance breakdowns across all your positions.",
  },
  {
    icon: Zap,
    title: "Paper Mode",
    desc: "Test strategies risk-free before going live. Every board starts in paper mode by default.",
  },
];

const EDGE_EXAMPLES = [
  { market: "Fed cuts rates at March meeting?", edge: "+18.5%", confidence: "82%", direction: "YES" },
  { market: "BTC above $100K on March 1st?", edge: "+12.3%", confidence: "71%", direction: "YES" },
  { market: "Approval rating above 45% in next poll?", edge: "+22.4%", confidence: "88%", direction: "YES" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-400">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm text-emerald-400">
              <Zap className="h-3.5 w-3.5" />
              Powered by Kalshi
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Where the odds are{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                wrong
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
              OddsIQ finds mispriced prediction markets, builds your edge, and
              trades automatically. You set the rules — we execute.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/30">
                    Start Finding Edge
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-8 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-accent">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      </section>

      {/* Live Edge Preview */}
      <section className="border-y border-border/40 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Live Edge Feed
            </h2>
            <p className="mt-2 text-muted-foreground">
              Markets where our models see the biggest mispricing right now
            </p>
          </div>

          <div className="mx-auto max-w-2xl space-y-3">
            {EDGE_EXAMPLES.map((ex) => (
              <div
                key={ex.market}
                className="flex items-center justify-between rounded-xl border border-border/50 bg-background/60 px-5 py-4 backdrop-blur-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{ex.market}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Confidence {ex.confidence} · {ex.direction}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-lg font-bold text-emerald-400">{ex.edge}</p>
                  <p className="text-xs text-muted-foreground">edge</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-14 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Everything you need to trade smarter
          </h2>
          <p className="mt-2 text-muted-foreground">
            From signal detection to execution — one platform.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-xl border border-border/50 bg-card/50 p-6 transition-colors hover:border-emerald-500/30 hover:bg-card"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20 transition-colors group-hover:bg-emerald-500/15">
                <Icon className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="mb-2 font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border/40 bg-card/20">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-14 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Three steps to edge
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Connect Kalshi",
                desc: "Link your account with an API key. Takes 30 seconds.",
              },
              {
                step: "02",
                title: "Build a Board",
                desc: "Curate markets, set risk limits, choose paper or live mode.",
              },
              {
                step: "03",
                title: "Let It Run",
                desc: "OddsIQ monitors edge and executes trades within your rules.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-lg font-bold text-emerald-400 ring-1 ring-emerald-500/20">
                  {step}
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-background to-background p-10 text-center sm:p-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
            Stop guessing. Start finding edge.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Join OddsIQ and let our models do the heavy lifting while you set the strategy.
          </p>
          <div className="mt-8">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/30">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} OddsIQ. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
