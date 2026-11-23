"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Film,
  Tv,
  Flame,
  Compass,
  Gamepad2,
  Sparkles,
  Search,
  Bookmark,
  Settings,
  Menu,
  X,
  ArrowRight,
  Star,
  User,
  Loader2,
  Sun,
  Moon,
  Clock,
  Home,
} from "lucide-react";
import tmdbClient from "@/lib/tmdb-client";
import {
  createMovieSlug,
  createPersonSlug,
  createTVShowSlug,
} from "@/lib/slug-utils";
import { MultiSearchResult } from "@/types";
import ClerkAuthButton from "@/components/ui/ClerkAuthButton";
import {
  useModalStore,
  useSearchStore,
  useThemeStore,
  useUserStore,
} from "@/stores";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/tv-shows", label: "TV Shows", icon: Tv },
  { href: "/trending", label: "Trending", icon: Flame },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/ai", label: "AI Studio", icon: Sparkles },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MultiSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { setSettingsModal } = useModalStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useUserStore();
  const { history, addToHistory } = useSearchStore();

  const watchlistCount = user?.watchlist?.length || 0;

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcuts (Cmd/Ctrl+K to open search, Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when search modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Debounced live search
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const res = await tmdbClient.multiSearch(trimmed, 1);
        if (!cancelled) {
          setSearchResults(res.results.slice(0, 6));
        }
      } catch {
        if (!cancelled) setSearchResults([]);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 260);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    addToHistory(trimmed);
    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const getResultMeta = (result: MultiSearchResult) => {
    if ("title" in result) {
      return {
        type: "movie" as const,
        label: "Movie",
        title: result.title,
        year: result.release_date?.slice(0, 4) || "",
        image: result.poster_path,
        rating: result.vote_average,
        href: `/movie/${createMovieSlug(result.title, result.id)}`,
      };
    }
    if ("known_for_department" in result) {
      return {
        type: "person" as const,
        label: result.known_for_department || "Person",
        title: result.name,
        year: "",
        image: result.profile_path || null,
        rating: 0,
        href: `/person/${createPersonSlug(result.name, result.id)}`,
      };
    }
    return {
      type: "tv" as const,
      label: "TV Series",
      title: result.name,
      year: result.first_air_date?.slice(0, 4) || "",
      image: result.poster_path || null,
      rating: result.vote_average,
      href: `/tv/${createTVShowSlug(result.name, result.id)}`,
    };
  };

  const isRouteActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-gradient-to-b from-background/90 via-background/50 to-transparent border-b border-transparent"
        }`}
      >
        <div className="container-cinema">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Brand Wordmark */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm shadow-primary/30 transition-transform duration-200 group-hover:scale-105">
                <Film className="h-4 w-4" strokeWidth={2.25} />
              </div>
              <span className="text-base font-bold tracking-[0.14em] uppercase text-foreground">
                CINETRON
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav
              aria-label="Primary navigation"
              className="hidden lg:flex items-center gap-1"
            >
              {navItems.map((item) => {
                const active = isRouteActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "text-foreground bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && (
                      <motion.span
                        layoutId="navbar-active-indicator"
                        className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Command Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search movies, TV shows, and people"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-secondary/70 px-2.5 sm:px-3 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span className="hidden xl:inline text-xs">Search...</span>
                <kbd className="hidden xl:inline-flex items-center rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  ⌘K
                </kbd>
              </button>

              {/* Watchlist Link */}
              <Link
                href="/watchlist"
                aria-label="Watchlist"
                className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                  pathname === "/watchlist"
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-secondary/70 text-muted-foreground hover:text-foreground hover:border-foreground/20"
                }`}
              >
                <Bookmark className="h-4 w-4" />
                {watchlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] font-bold text-white">
                    {watchlistCount > 99 ? "99+" : watchlistCount}
                  </span>
                )}
              </Link>

              {/* Quick Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/70 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors cursor-pointer"
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>

              {/* Settings Modal Trigger */}
              <button
                type="button"
                onClick={() => setSettingsModal(true)}
                aria-label="Open settings"
                className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/70 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors cursor-pointer"
              >
                <Settings className="h-4 w-4" />
              </button>

              {/* Auth */}
              <div className="hidden md:flex items-center pl-1">
                <ClerkAuthButton />
              </div>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/70 text-foreground hover:border-foreground/20 transition-colors cursor-pointer"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl"
            >
              <div className="container-cinema py-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isRouteActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground cursor-pointer"
                    >
                      {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                      {isDark ? "Light" : "Dark"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setSettingsModal(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground cursor-pointer"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      Settings
                    </button>
                  </div>
                  <ClerkAuthButton />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Command Search Palette Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 backdrop-blur-sm px-4 pt-20 sm:pt-28"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl"
            >
              {/* Search Form */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-3 border-b border-border px-4 py-3.5"
              >
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, TV series, actors, directors..."
                  className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                {isSearching && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
                )}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="rounded-md p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  ESC
                </kbd>
              </form>

              {/* Results or Recent Searches */}
              <div className="max-h-[60vh] overflow-y-auto">
                {searchQuery.trim().length < 2 ? (
                  <div className="p-4">
                    {history.length > 0 ? (
                      <div>
                        <p className="mb-2.5 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Recent Searches
                        </p>
                        <div className="flex flex-wrap gap-2 px-2">
                          {history.map((term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => {
                                setIsSearchOpen(false);
                                router.push(`/search?q=${encodeURIComponent(term)}`);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/70 px-3 py-1.5 text-xs font-medium text-foreground hover:border-foreground/20 transition-colors cursor-pointer"
                            >
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-sm text-muted-foreground">
                        Start typing to search across thousands of films, series,
                        and filmmakers.
                      </div>
                    )}
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    <div className="divide-y divide-border">
                      {searchResults.map((item) => {
                        const meta = getResultMeta(item);
                        const imgUrl = tmdbClient.getImageUrl(meta.image, "w92");
                        return (
                          <button
                            key={`${meta.type}-${item.id}`}
                            type="button"
                            onClick={() => {
                              addToHistory(searchQuery.trim());
                              setIsSearchOpen(false);
                              router.push(meta.href);
                            }}
                            className="flex w-full items-center gap-3.5 px-4 py-3 text-left hover:bg-secondary/70 transition-colors cursor-pointer"
                          >
                            <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-secondary border border-border">
                              {imgUrl ? (
                                <Image
                                  src={imgUrl}
                                  alt={meta.title}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                  {meta.type === "movie" ? (
                                    <Film className="h-4 w-4" />
                                  ) : meta.type === "tv" ? (
                                    <Tv className="h-4 w-4" />
                                  ) : (
                                    <User className="h-4 w-4" />
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {meta.title}
                              </p>
                              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                                  {meta.label}
                                </span>
                                {meta.year && (
                                  <span className="font-mono">{meta.year}</span>
                                )}
                                {meta.rating > 0 && (
                                  <span className="inline-flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    <span className="font-mono">
                                      {meta.rating.toFixed(1)}
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          </button>
                        );
                      })}
                    </div>

                    <div className="border-t border-border bg-secondary/40 px-4 py-3">
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline cursor-pointer"
                      >
                        <span>
                          View all results for &ldquo;{searchQuery.trim()}&rdquo;
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : !isSearching ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    No matches found for &ldquo;{searchQuery.trim()}&rdquo;.
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
