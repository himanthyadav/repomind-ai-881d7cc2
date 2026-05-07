import { Link } from "@tanstack/react-router";
import { Brain, Github } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gradient-primary p-1.5 rounded-lg">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            RepoMind <span className="text-gradient-primary">AI</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Dashboard</Link>
          <Link to="/pricing" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Pricing</Link>
          <Link to="/about" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>About</Link>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity"
          >
            Launch app
          </Link>
        </div>
      </div>
    </header>
  );
}
