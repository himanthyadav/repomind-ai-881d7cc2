import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useRef, useEffect } from "react";
import {
  Star,
  GitFork,
  ExternalLink,
  Send,
  Loader2,
  Folder,
  Code2,
  Workflow,
  Rocket,
  Sparkles,
  ArrowLeft,
  Gauge,
} from "lucide-react";
import { toast } from "sonner";
import { getAnalysis, chatWithRepo } from "@/lib/repomind.functions";

export const Route = createFileRoute("/analysis/$id")({
  component: AnalysisPage,
});

function AnalysisPage() {
  const { id } = Route.useParams();
  const get = useServerFn(getAnalysis);
  const chat = useServerFn(chatWithRepo);
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["analysis", id],
    queryFn: () => get({ data: { id } }),
  });

  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [data?.messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim() || sending) return;
    const text = msg.trim();
    setMsg("");
    setSending(true);
    try {
      await chat({ data: { analysisId: id, message: text } });
      qc.invalidateQueries({ queryKey: ["analysis", id] });
    } catch (err: any) {
      toast.error(err?.message || "Chat failed");
      setMsg(text);
    } finally {
      setSending(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary-glow" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-muted-foreground">Could not load analysis.</p>
        <Link to="/dashboard" className="text-primary-glow hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const a = data.analysis;
  const techStack: Array<{ name: string; category?: string }> = Array.isArray(a.tech_stack) ? a.tech_stack : [];
  const folders: Array<{ path: string; explanation: string }> = Array.isArray(a.folder_explanations) ? a.folder_explanations : [];
  const languages: Record<string, number> = (a.languages as any) || {};
  const langTotal = Object.values(languages).reduce((s, n) => s + (n as number), 0) || 1;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>

      {/* Banner */}
      <div className="relative overflow-hidden glass-strong rounded-3xl p-8 md:p-10 shadow-elegant">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="relative">
          <div className="text-xs font-mono text-primary-glow">{a.owner}/</div>
          <h1 className="text-3xl md:text-5xl font-display font-bold mt-1">{a.repo}</h1>
          {a.description && <p className="mt-3 text-muted-foreground max-w-2xl">{a.description}</p>}
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Star className="h-4 w-4" />{(a.stars || 0).toLocaleString()}</span>
            <span className="flex items-center gap-1.5"><GitFork className="h-4 w-4" />{(a.forks || 0).toLocaleString()}</span>
            {a.language && <span className="flex items-center gap-1.5"><Code2 className="h-4 w-4" />{a.language}</span>}
            {a.difficulty_score && (
              <span className="flex items-center gap-1.5"><Gauge className="h-4 w-4" />Difficulty {a.difficulty_score}/10</span>
            )}
            <a href={a.repo_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary-glow hover:underline">
              <ExternalLink className="h-4 w-4" /> View on GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        {/* Left: content */}
        <div className="lg:col-span-2 space-y-6">
          <Section icon={Sparkles} title="AI Summary">
            <p className="text-base leading-relaxed">{a.summary}</p>
            {a.beginner_explanation && (
              <div className="mt-5 pt-5 border-t border-border/60">
                <div className="text-xs uppercase tracking-widest text-primary-glow mb-2">Explain like I'm new</div>
                <p className="text-base leading-relaxed text-foreground/90">{a.beginner_explanation}</p>
              </div>
            )}
          </Section>

          {techStack.length > 0 && (
            <Section icon={Code2} title="Tech stack">
              <div className="flex flex-wrap gap-2">
                {techStack.map((t, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg glass text-sm gradient-border">
                    <span className="font-medium">{t.name}</span>
                    {t.category && <span className="text-muted-foreground ml-2 text-xs">{t.category}</span>}
                  </span>
                ))}
              </div>
              {Object.keys(languages).length > 0 && (
                <div className="mt-5">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Languages</div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-surface">
                    {Object.entries(languages).slice(0, 6).map(([lang, bytes], i) => (
                      <div
                        key={lang}
                        title={`${lang} ${(((bytes as number) / langTotal) * 100).toFixed(1)}%`}
                        style={{ width: `${((bytes as number) / langTotal) * 100}%`, background: `hsl(${i * 55} 70% 60%)` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Section>
          )}

          {a.architecture && (
            <Section icon={Workflow} title="Architecture">
              <Markdown text={a.architecture} />
            </Section>
          )}

          {folders.length > 0 && (
            <Section icon={Folder} title="Folder explorer">
              <div className="space-y-3">
                {folders.map((f, i) => (
                  <div key={i} className="rounded-xl bg-surface/50 p-4 border border-border/50">
                    <div className="font-mono text-sm text-primary-glow">{f.path}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{f.explanation}</div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {a.setup_guide && (
            <Section icon={Rocket} title="Setup guide">
              <Markdown text={a.setup_guide} />
            </Section>
          )}
        </div>

        {/* Right: chat */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="glass-strong rounded-2xl flex flex-col h-[70vh] shadow-card">
            <div className="p-4 border-b border-border/50 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-glow" />
              <div className="font-medium">Chat with this repo</div>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {data.messages.length === 0 && (
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Try asking:</p>
                  <ul className="space-y-1">
                    {["How does authentication work?", "What is the entry point?", "How do I run this locally?"].map((q) => (
                      <li key={q}>
                        <button
                          onClick={() => setMsg(q)}
                          className="text-left text-primary-glow hover:underline"
                        >
                          → {q}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {data.messages.map((m: any) => (
                <div
                  key={m.id}
                  className={`rounded-xl px-3.5 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-gradient-primary text-primary-foreground ml-8"
                      : "bg-surface mr-8"
                  }`}
                >
                  {m.role === "assistant" ? <Markdown text={m.content} compact /> : m.content}
                </div>
              ))}
              {sending && (
                <div className="bg-surface mr-8 rounded-xl px-3.5 py-2.5 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                </div>
              )}
            </div>
            <form onSubmit={send} className="p-3 border-t border-border/50 flex gap-2">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Ask anything about this repo…"
                className="flex-1 bg-surface rounded-lg px-3 h-10 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !msg.trim()}
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-primary/15"><Icon className="h-4 w-4 text-primary-glow" /></div>
        <h2 className="font-display font-semibold text-lg">{title}</h2>
      </div>
      {children}
    </section>
  );
}

// Tiny markdown renderer (headings, bold, code, lists)
function Markdown({ text, compact }: { text: string; compact?: boolean }) {
  const lines = text.split("\n");
  return (
    <div className={compact ? "space-y-1 text-sm" : "space-y-2 text-sm leading-relaxed"}>
      {lines.map((line, i) => {
        if (/^#{1,3}\s/.test(line)) {
          const level = line.match(/^#+/)?.[0].length || 2;
          const Tag = (`h${Math.min(level + 2, 6)}`) as any;
          return <Tag key={i} className="font-display font-semibold mt-2">{line.replace(/^#+\s/, "")}</Tag>;
        }
        if (/^\s*[-*]\s/.test(line)) {
          return <div key={i} className="flex gap-2"><span className="text-primary-glow">•</span><span>{inline(line.replace(/^\s*[-*]\s/, ""))}</span></div>;
        }
        if (/^\s*\d+\.\s/.test(line)) {
          return <div key={i} className="flex gap-2"><span className="text-primary-glow font-mono">{line.match(/^\s*(\d+)\./)?.[1]}.</span><span>{inline(line.replace(/^\s*\d+\.\s/, ""))}</span></div>;
        }
        if (line.trim() === "") return <div key={i} className="h-1" />;
        return <p key={i}>{inline(line)}</p>;
      })}
    </div>
  );
}

function inline(s: string): React.ReactNode {
  // Replace `code` and **bold**
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(s))) {
    if (m.index > last) parts.push(s.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("`")) parts.push(<code key={key++} className="font-mono text-xs px-1.5 py-0.5 rounded bg-surface text-primary-glow">{tok.slice(1, -1)}</code>);
    else parts.push(<strong key={key++} className="font-semibold">{tok.slice(2, -2)}</strong>);
    last = m.index + tok.length;
  }
  if (last < s.length) parts.push(s.slice(last));
  return parts;
}
