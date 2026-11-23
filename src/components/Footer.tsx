import Link from "next/link";
import { Film, Sparkles, Compass, Tv, Flame, Gamepad2, Bookmark, Search } from "lucide-react";

const exploreLinks = [
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/tv-shows", label: "TV Shows", icon: Tv },
  { href: "/trending", label: "Trending", icon: Flame },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/search", label: "Search Catalog", icon: Search },
];

const experienceLinks = [
  { href: "/ai", label: "AI Studio", icon: Sparkles },
  { href: "/games", label: "Cinema Games", icon: Gamepad2 },
  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
  { href: "/profile", label: "My Profile", icon: Film },
];

export default function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-border bg-card/60 backdrop-blur-sm">
      <div className="container-cinema py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border">
          {/* Brand */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-sm shadow-primary/30 transition-transform duration-200 group-hover:scale-105">
                <Film className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-[0.14em] uppercase text-foreground leading-none">
                  CINETRON
                </span>
                <span className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mt-1">
                  Cinema Editorial
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Curated film and television discovery powered by TMDB and AI
              intelligence. Track watchlists, explore filmographies, and find
              what to watch tonight.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://github.com/Ameerusa86"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/ameerdev/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Experience
            </h3>
            <ul className="space-y-2.5">
              {experienceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Attribution */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Data Source
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This product uses the TMDB API but is not endorsed or certified by
              TMDB. Streaming availability powered by JustWatch.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Cinetron. Crafted by{" "}
            <a
              href="https://github.com/Ameerusa86"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-medium hover:text-primary transition-colors"
            >
              Ameer Hasan
            </a>
            .
          </p>
          <div className="flex items-center gap-4">
            <span>Next.js 16</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>TMDB API</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
