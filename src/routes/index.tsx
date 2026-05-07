import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  GitBranch,
  Brain,
  Zap,
  MessageSquare,
  FileCode2,
  Workflow,
  ShieldCheck,
  ArrowRight,
  Star,
  Boxes,
  Code2,
} from "lucide-react";
import { RepoUrlForm } from "@/components/repomind/RepoUrlForm";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  {
    icon: Brain,
    title: "Beginner-friendly explanations",
    desc: "Plain-English summaries so anyone can grok the project — even on day one.",
  },
  {
    icon: Workflow,
    title: "Architecture overview",
    desc: "AI maps the data flow, layers, and how the pieces fit together.",
  },
  {
    icon: FileCode2,
    title: "Folder-by-folder guide",
    desc: "Know exactly what lives where — controllers, components, routes, configs.",
  },
  {
    icon: Zap,
    title: "Setup in seconds",
    desc: "Auto-generated install + run instructions tailored to the actual stack.",
  },
  {
    icon: MessageSquare,
    title: "Chat with the repo",
    desc: "Ask “where does auth happen?” or “how do I add a new page?”. Get answers.",
  },
  {
    icon: ShieldCheck,
    title: "Production-grade",
    desc: "Cached analyses, edge-served, secure by default. Built to scale.",
  },
];

const steps = [
  { n: "01", title: "Paste a GitHub URL", desc: "Public repos work out of the box. No login needed." },
  { n: "02", title: "AI parses everything", desc: "We fetch metadata, README, languages, and the file tree." },
  { n: "03", title: "Get a clear briefing", desc: "Summary, architecture, setup, and folder map — instantly." },
  { n: "04", title: "Ask anything", desc: "Chat with an AI that already understands the repo." },
];

const faqs = [
  {
    q: "What kinds of repositories work?",
    a: "Any public GitHub repository. From tiny scripts to massive monorepos like Next.js or VS Code.",
  },
  {
    q: "Is the analysis cached?",
    a: "Yes — we cache results for 24 hours so popular repos load instantly the second time.",
  },
  {
    q: "Do I need a GitHub token?",
    a: "Not for casual use. Heavy usage benefits from a token to lift GitHub's anonymous rate limits.",
  },
  {
    q: "Which AI model powers RepoMind?",
    a: "Google Gemini via the Lovable AI Gateway. We optimize prompts for code understanding.",
  },
];

function Landing() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative bg-gradient-hero">
        <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="container mx-auto px-4 sm:px-6 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-6">
              <Sparkles className="h-3 w-3 text-primary-glow" />
              Powered by Gemini · GitHub-native
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Understand any{" "}
              <span className="text-gradient-primary">GitHub repository</span> with AI
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              RepoMind AI turns complex codebases into beginner-friendly explanations,
              setup guides, architecture overviews, and an AI chat — in seconds.
            </p>

            <div className="mt-10 max-w-2xl mx-auto">
              <RepoUrlForm size="lg" />
              <p className="mt-3 text-xs text-muted-foreground">
                Try:{" "}
                <code className="font-mono text-foreground/80">github.com/vercel/next.js</code>{" "}
                ·{" "}
                <code className="font-mono text-foreground/80">github.com/shadcn-ui/ui</code>
              </p>
            </div>
          </div>

          {/* Floating preview cards */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="relative grid md:grid-cols-3 gap-4">
              <PreviewCard
                icon={Boxes}
                title="Tech stack detected"
                items={["Next.js 14", "TypeScript", "Tailwind", "Prisma"]}
                tilt="-rotate-2"
              />
              <PreviewCard
                icon={Workflow}
                title="Architecture"
                items={["App Router", "Server Actions", "Edge Functions", "Postgres"]}
                tilt=""
                highlighted
              />
              <PreviewCard
                icon={MessageSquare}
                title="AI chat"
                items={['"Where is auth?"', "→ middleware.ts", '"How to deploy?"', "→ vercel.json"]}
                tilt="rotate-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { k: "10s", v: "Avg analysis time" },
            { k: "100M+", v: "Repos compatible" },
            { k: "8", v: "AI insights per repo" },
            { k: "24h", v: "Smart cache window" },
          ].map((s) => (
            <div key={s.v} className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-gradient">{s.k}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-widest text-primary-glow mb-3">Features</div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            Everything you need to <span className="text-gradient-primary">grok any repo</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative glass rounded-2xl p-6 hover:bg-surface-elevated/40 transition-colors"
            >
              <div className="inline-flex p-2.5 rounded-xl bg-gradient-primary/20 border border-primary/20 mb-4">
                <f.icon className="h-5 w-5 text-primary-glow" />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-widest text-primary-glow mb-3">How it works</div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            From URL to <span className="text-gradient-primary">understanding</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => (
            <div key={s.n} className="relative glass rounded-2xl p-6">
              <div className="font-mono text-sm text-primary-glow">{s.n}</div>
              <div className="mt-3 font-semibold">{s.title}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-widest text-primary-glow mb-3">Pricing</div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            Free for builders. <span className="text-gradient-primary">Forever.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Generous free tier, paid plans for teams analyzing private monorepos.
          </p>
          <Link
            to="/pricing"
            className="mt-6 inline-flex items-center gap-1 text-primary-glow hover:underline text-sm"
          >
            See plans <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-widest text-primary-glow mb-3">FAQ</div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">Questions, answered</h2>
        </div>
        <div className="max-w-3xl mx-auto grid gap-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="glass rounded-xl p-5 group [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="cursor-pointer flex items-center justify-between font-medium">
                {f.q}
                <span className="text-muted-foreground group-open:rotate-45 transition-transform text-xl leading-none">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="relative overflow-hidden glass-strong rounded-3xl p-10 md:p-16 text-center shadow-elegant">
          <div className="absolute inset-0 bg-gradient-hero opacity-60" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Stop scrolling READMEs. <br />
              <span className="text-gradient-primary">Start understanding code.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Drop in a GitHub URL and let RepoMind do the heavy lifting.
            </p>
            <div className="mt-8 max-w-xl mx-auto">
              <RepoUrlForm size="lg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PreviewCard({
  icon: Icon,
  title,
  items,
  tilt,
  highlighted,
}: {
  icon: any;
  title: string;
  items: string[];
  tilt: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`glass-strong rounded-2xl p-5 shadow-card transform transition hover:rotate-0 ${tilt} ${
        highlighted ? "shadow-glow gradient-border animate-float" : ""
      }`}
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Icon className="h-3.5 w-3.5 text-primary-glow" />
        {title}
      </div>
      <ul className="space-y-2 text-sm">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-2 font-mono text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
            <span className="text-foreground/80">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
