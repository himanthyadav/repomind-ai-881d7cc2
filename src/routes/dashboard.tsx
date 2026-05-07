import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Star, GitFork, Clock } from "lucide-react";
import { RepoUrlForm } from "@/components/repomind/RepoUrlForm";
import { listRecentAnalyses } from "@/lib/repomind.functions";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — RepoMind AI" }] }),
});

function Dashboard() {
  const list = useServerFn(listRecentAnalyses);
  const { data, isLoading } = useQuery({
    queryKey: ["recent-analyses"],
    queryFn: () => list(),
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-display font-bold">Dashboard</h1>
        <p className="mt-3 text-muted-foreground">
          Analyze a new repo or browse what the community has been exploring.
        </p>
        <div className="mt-8">
          <RepoUrlForm size="lg" />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-xl font-display font-semibold mb-6">Recent analyses</h2>
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 h-44 animate-shimmer" />
            ))}
          </div>
        ) : data?.analyses.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
            No analyses yet — be the first to paste a repo above.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.analyses.map((a: any) => (
              <Link
                key={a.id}
                to="/analysis/$id"
                params={{ id: a.id }}
                className="glass rounded-2xl p-6 hover:bg-surface-elevated/40 transition-colors group"
              >
                <div className="text-xs font-mono text-primary-glow">{a.owner}/</div>
                <div className="text-lg font-semibold group-hover:text-gradient-primary transition-colors">
                  {a.repo}
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {a.summary || a.description || "No summary"}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  {a.language && <span>{a.language}</span>}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(a.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
