import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
  head: () => ({ meta: [{ title: "Pricing — RepoMind AI" }] }),
});

const tiers = [
  { name: "Free", price: "$0", desc: "For curious devs and students.", features: ["Unlimited public repo analyses", "AI chat (50 messages/day)", "24h smart cache", "Community support"], cta: "Start free" },
  { name: "Pro", price: "$19", desc: "For power users and freelancers.", features: ["Everything in Free", "Unlimited AI chat", "Private repo support", "Export as PDF / Markdown", "Priority AI models"], cta: "Go Pro", featured: true },
  { name: "Team", price: "$49", desc: "For engineering teams.", features: ["Everything in Pro", "Shared workspace", "SSO + audit logs", "Custom rate limits", "Dedicated support"], cta: "Contact sales" },
];

function Pricing() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-display font-bold">Simple, <span className="text-gradient-primary">honest pricing</span></h1>
        <p className="mt-4 text-muted-foreground">Free for public repos. Upgrade when you need more.</p>
      </div>
      <div className="mt-14 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {tiers.map((t) => (
          <div key={t.name} className={`relative rounded-2xl p-8 ${t.featured ? "glass-strong shadow-glow gradient-border" : "glass"}`}>
            {t.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-primary text-xs font-medium text-primary-foreground">Most popular</div>}
            <div className="text-sm text-muted-foreground">{t.name}</div>
            <div className="mt-2 flex items-baseline gap-1"><span className="text-4xl font-display font-bold">{t.price}</span><span className="text-muted-foreground text-sm">/mo</span></div>
            <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {t.features.map((f) => <li key={f} className="flex items-start gap-2"><Check className="h-4 w-4 text-primary-glow mt-0.5 shrink-0" />{f}</li>)}
            </ul>
            <Link to="/dashboard" className={`mt-8 inline-flex w-full items-center justify-center h-10 rounded-lg font-medium transition ${t.featured ? "bg-gradient-primary text-primary-foreground" : "bg-surface hover:bg-surface-elevated"}`}>{t.cta}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
