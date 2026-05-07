import { createFileRoute } from "@tanstack/react-router";
import { Brain, Zap, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({ meta: [{ title: "About — RepoMind AI" }] }),
});

function About() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24 max-w-3xl">
      <h1 className="text-4xl md:text-6xl font-display font-bold">About <span className="text-gradient-primary">RepoMind AI</span></h1>
      <p className="mt-6 text-lg text-muted-foreground">
        RepoMind AI exists for one reason: opening an unfamiliar codebase shouldn't feel like
        decoding a foreign language. We turn any GitHub repository into a clear briefing —
        summary, stack, architecture, setup, and an AI assistant that already understands the code.
      </p>
      <div className="mt-12 grid sm:grid-cols-3 gap-4">
        {[
          { icon: Brain, title: "Built for understanding", desc: "Optimized prompts that explain code the way a great senior would." },
          { icon: Zap, title: "Fast by default", desc: "Smart caching, edge-served, and tuned for sub-15s analyses." },
          { icon: Heart, title: "Made for builders", desc: "Free for public repos. Always will be." },
        ].map((c) => (
          <div key={c.title} className="glass rounded-2xl p-6">
            <c.icon className="h-5 w-5 text-primary-glow" />
            <div className="mt-3 font-semibold">{c.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
