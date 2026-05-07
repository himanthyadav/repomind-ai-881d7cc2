import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Github } from "lucide-react";
import { toast } from "sonner";
import { analyzeRepo } from "@/lib/repomind.functions";

export function RepoUrlForm({ size = "default" }: { size?: "default" | "lg" }) {
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeRepo);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await analyze({ data: { url: url.trim() } });
      toast.success(res.cached ? "Loaded cached analysis" : "Analysis ready");
      navigate({ to: "/analysis/$id", params: { id: res.id } });
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const big = size === "lg";

  return (
    <form
      onSubmit={onSubmit}
      className={`relative gradient-border rounded-2xl glass-strong shadow-elegant ${
        big ? "p-2" : "p-1.5"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <div className="flex items-center flex-1 px-3 gap-2">
          <Github className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/vercel/next.js"
            className={`w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground/60 ${
              big ? "h-12 text-base" : "h-10 text-sm"
            }`}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground font-medium shadow-glow hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition ${
            big ? "h-12 px-6 text-base" : "h-10 px-4 text-sm"
          }`}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </div>
    </form>
  );
}
