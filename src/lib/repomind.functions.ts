import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const GH = "https://api.github.com";

function ghHeaders() {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "RepoMind-AI",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  try {
    const m = url.trim().match(/github\.com[/:]([^/]+)\/([^/#?\s]+?)(?:\.git)?(?:[/#?].*)?$/i);
    if (!m) return null;
    return { owner: m[1], repo: m[2].replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

async function ghFetch(path: string) {
  const res = await fetch(`${GH}${path}`, { headers: ghHeaders() });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Repository not found");
    if (res.status === 403) throw new Error("GitHub rate limit hit. Try again later.");
    throw new Error(`GitHub error ${res.status}`);
  }
  return res.json();
}

async function fetchReadme(owner: string, repo: string): Promise<string> {
  try {
    const data = await ghFetch(`/repos/${owner}/${repo}/readme`);
    if (data?.content) {
      // base64 decode
      const buf = Buffer.from(data.content, "base64");
      return buf.toString("utf-8").slice(0, 12000);
    }
  } catch {}
  return "";
}

async function fetchTree(owner: string, repo: string, branch: string) {
  try {
    const data = await ghFetch(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
    return (data?.tree || []).slice(0, 400);
  } catch {
    return [];
  }
}

async function callAI(messages: Array<{ role: string; content: string }>, opts: { json?: boolean } = {}) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

  const body: any = {
    model: "google/gemini-3-flash-preview",
    messages,
  };
  if (opts.json) body.response_format = { type: "json_object" };

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (res.status === 429) throw new Error("AI rate limit. Try again in a moment.");
  if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace Settings.");
  if (!res.ok) throw new Error(`AI gateway error ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content as string;
}

export const analyzeRepo = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ url: z.string().min(5).max(500) }).parse(d))
  .handler(async ({ data }) => {
    const parsed = parseRepoUrl(data.url);
    if (!parsed) throw new Error("Please enter a valid GitHub repository URL");
    const { owner, repo } = parsed;

    // Check cache (last 24h)
    const { data: cached } = await supabaseAdmin
      .from("analyses")
      .select("*")
      .eq("owner", owner)
      .eq("repo", repo)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (cached && Date.now() - new Date(cached.created_at).getTime() < 1000 * 60 * 60 * 24) {
      return { id: cached.id, cached: true };
    }

    const meta = await ghFetch(`/repos/${owner}/${repo}`);
    const [readme, languages, tree] = await Promise.all([
      fetchReadme(owner, repo),
      ghFetch(`/repos/${owner}/${repo}/languages`).catch(() => ({})),
      fetchTree(owner, repo, meta.default_branch || "main"),
    ]);

    const topPaths = tree
      .filter((t: any) => t.type === "blob" || t.type === "tree")
      .map((t: any) => `${t.type === "tree" ? "📁" : "📄"} ${t.path}`)
      .slice(0, 120)
      .join("\n");

    const prompt = `You are an expert software engineer. Analyze this GitHub repository and return STRICT JSON only.

Repository: ${owner}/${repo}
Description: ${meta.description || "(none)"}
Primary language: ${meta.language || "unknown"}
Languages used: ${Object.keys(languages).join(", ")}
Stars: ${meta.stars} | Forks: ${meta.forks_count}

README (truncated):
${readme || "(no README)"}

File structure (sample):
${topPaths}

Return JSON with this exact shape:
{
  "summary": "2-3 sentence high-level summary of what this repo does",
  "beginner_explanation": "4-6 sentence explanation in plain English a junior dev or non-engineer can understand. Use analogies.",
  "tech_stack": [{"name": "React", "category": "Frontend"}, ...],
  "setup_guide": "Markdown numbered steps for running locally. Be specific to this repo's stack.",
  "architecture": "2-3 paragraph markdown explaining the architecture/data flow.",
  "folder_explanations": [{"path": "src/", "explanation": "..."}, ...up to 8 most important folders/files],
  "difficulty_score": 1-10
}`;

    const aiContent = await callAI(
      [
        { role: "system", content: "You output ONLY valid JSON. No prose, no markdown fences." },
        { role: "user", content: prompt },
      ],
      { json: true },
    );

    let analysis: any = {};
    try {
      analysis = JSON.parse(aiContent);
    } catch {
      const m = aiContent.match(/\{[\s\S]*\}/);
      if (m) analysis = JSON.parse(m[0]);
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("analyses")
      .insert({
        owner,
        repo,
        repo_url: meta.html_url,
        description: meta.description,
        stars: meta.stargazers_count || 0,
        forks: meta.forks_count || 0,
        language: meta.language,
        languages: languages,
        tech_stack: analysis.tech_stack || [],
        summary: analysis.summary || "",
        beginner_explanation: analysis.beginner_explanation || "",
        setup_guide: analysis.setup_guide || "",
        architecture: analysis.architecture || "",
        folder_explanations: analysis.folder_explanations || [],
        difficulty_score: analysis.difficulty_score || null,
        raw: { default_branch: meta.default_branch, topics: meta.topics, open_issues: meta.open_issues_count },
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return { id: inserted!.id, cached: false };
  });

export const chatWithRepo = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ analysisId: z.string().uuid(), message: z.string().min(1).max(2000) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { data: a, error } = await supabaseAdmin
      .from("analyses")
      .select("*")
      .eq("id", data.analysisId)
      .single();
    if (error || !a) throw new Error("Analysis not found");

    const { data: history } = await supabaseAdmin
      .from("chat_messages")
      .select("role,content")
      .eq("analysis_id", data.analysisId)
      .order("created_at", { ascending: true })
      .limit(20);

    const context = `You are RepoMind AI, an expert assistant answering questions about the GitHub repo ${a.owner}/${a.repo}.

Repo summary: ${a.summary}
Tech stack: ${JSON.stringify(a.tech_stack)}
Architecture: ${a.architecture}
Setup: ${a.setup_guide}
Key folders: ${JSON.stringify(a.folder_explanations)}

Answer concisely in markdown. If you don't know, say so.`;

    const messages = [
      { role: "system", content: context },
      ...(history || []).map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: data.message },
    ];

    const reply = await callAI(messages);

    await supabaseAdmin.from("chat_messages").insert([
      { analysis_id: data.analysisId, role: "user", content: data.message },
      { analysis_id: data.analysisId, role: "assistant", content: reply },
    ]);

    return { reply };
  });

export const getAnalysis = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { data: a, error } = await supabaseAdmin
      .from("analyses")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error || !a) throw new Error("Not found");
    const { data: messages } = await supabaseAdmin
      .from("chat_messages")
      .select("*")
      .eq("analysis_id", data.id)
      .order("created_at", { ascending: true });
    return { analysis: a, messages: messages || [] };
  });

export const listRecentAnalyses = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await supabaseAdmin
    .from("analyses")
    .select("id,owner,repo,description,stars,language,summary,created_at,difficulty_score")
    .order("created_at", { ascending: false })
    .limit(12);
  return { analyses: data || [] };
});
