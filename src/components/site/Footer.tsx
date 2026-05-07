import { Link } from "@tanstack/react-router";
import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-24">
      <div className="container mx-auto px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-primary p-1.5 rounded-lg">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">RepoMind AI</span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-md">
            Understand any GitHub repository with AI. Beginner-friendly explanations, setup guides,
            architecture overviews, and an AI assistant — in seconds.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">Docs</a></li>
            <li><a href="#" className="hover:text-foreground">Changelog</a></li>
            <li><a href="#" className="hover:text-foreground">Status</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} RepoMind AI. Built for builders.</span>
          <span>Crafted with Lovable Cloud + AI</span>
        </div>
      </div>
    </footer>
  );
}
