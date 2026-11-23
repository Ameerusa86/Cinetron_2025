"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Film,
  Tv,
  Trash2,
  Star,
  Plus,
  Compass,
  User,
  Calendar,
} from "lucide-react";
import { useUserStore, useNotificationStore } from "@/stores";
import { useWatchlistDetails } from "@/hooks";
import { createMovieSlug, createTVShowSlug } from "@/lib/slug-utils";
import tmdbClient from "@/lib/tmdb-client";
import type { WatchlistItem, MovieDetails, TVShowDetails } from "@/types";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProfileBreadcrumb } from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/media/PageHeader";

type MediaDetails = MovieDetails | TVShowDetails;

function WatchlistContent() {
  const { user, updateWatchlistItem, removeFromWatchlist } = useUserStore();
  const { addNotification } = useNotificationStore();

  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");
  const [statusFilter, setStatusFilter] = useState<
    WatchlistItem["status"] | "all"
  >("all");
  const [sortBy, setSortBy] = useState<"added" | "title" | "rating">("added");

  const watchlistItems = useMemo(() => user?.watchlist || [], [user?.watchlist]);
  const { data: mediaDetails, isLoading } = useWatchlistDetails(watchlistItems);

  const watchlistWithDetails = useMemo(() => {
    if (!watchlistItems.length || !mediaDetails) return [];

    return watchlistItems
      .map((watchlistItem) => {
        const details = mediaDetails.find((m) => {
          if (m.id !== watchlistItem.id) return false;
          const isMovie = "title" in m;
          return watchlistItem.type === "movie" ? isMovie : !isMovie;
        });
        return { watchlistItem, details };
      })
      .filter((entry): entry is { watchlistItem: WatchlistItem; details: MediaDetails } =>
        Boolean(entry.details)
      );
  }, [watchlistItems, mediaDetails]);

  const filteredWatchlist = useMemo(() => {
    const filtered = watchlistWithDetails.filter((item) => {
      if (filter !== "all" && item.watchlistItem.type !== filter) return false;
      if (statusFilter !== "all" && item.watchlistItem.status !== statusFilter)
        return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "title") {
        const titleA = "title" in a.details ? a.details.title : a.details.name;
        const titleB = "title" in b.details ? b.details.title : b.details.name;
        return titleA.localeCompare(titleB);
      }
      if (sortBy === "rating") {
        return (b.details.vote_average || 0) - (a.details.vote_average || 0);
      }
      return (
        new Date(b.watchlistItem.addedAt).getTime() -
        new Date(a.watchlistItem.addedAt).getTime()
      );
    });
  }, [watchlistWithDetails, filter, statusFilter, sortBy]);

  const getStatusBadge = (status: WatchlistItem["status"]) => {
    switch (status) {
      case "completed":
        return "border-emerald-500/35 bg-emerald-500/10 text-emerald-400";
      case "watching":
        return "border-sky-500/35 bg-sky-500/10 text-sky-400";
      case "plan-to-watch":
        return "border-amber-500/35 bg-amber-500/10 text-amber-400";
      case "dropped":
        return "border-rose-500/35 bg-rose-500/10 text-rose-400";
      default:
        return "border-border bg-secondary text-muted-foreground";
    }
  };

  const handleRemove = (id: number, title: string) => {
    removeFromWatchlist(id);
    addNotification({
      type: "info",
      title: "Removed from Watchlist",
      message: `"${title}" was removed from your watchlist.`,
      read: false,
    });
  };

  return (
    <div className="min-h-screen w-full">
      <PageHeader
        eyebrow="Personal Library"
        title="My"
        accentWord="Watchlist"
        description="Organize what you plan to watch, track current series, and archive completed films."
      >
        <ProfileBreadcrumb currentPage="Watchlist" />
        <div className="flex flex-wrap gap-2.5">
          <Link href="/movies" className="btn-cinema">
            <Plus className="h-4 w-4" />
            <span>Add Movies</span>
          </Link>
          <Link href="/tv-shows" className="btn-cinema-outline">
            <Tv className="h-4 w-4" />
            <span>Add TV Shows</span>
          </Link>
          <Link href="/discover" className="btn-cinema-outline">
            <Compass className="h-4 w-4" />
            <span>Discover</span>
          </Link>
          <Link href="/profile" className="btn-cinema-outline">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </div>
      </PageHeader>

      <section className="py-10">
        <div className="container-cinema space-y-8">
          {/* Controls & Stats */}
          <div className="surface-card p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Media Type
              </label>
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as "all" | "movie" | "tv")
                }
                className="w-full rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="all">All Types</option>
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Watch Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as WatchlistItem["status"] | "all"
                  )
                }
                className="w-full rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="all">All Statuses</option>
                <option value="plan-to-watch">Plan to Watch</option>
                <option value="watching">Currently Watching</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Sort Order
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "added" | "title" | "rating")
                }
                className="w-full rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="added">Recently Added</option>
                <option value="title">Title (A–Z)</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="flex items-center justify-between sm:justify-around rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-center">
              <div>
                <p className="font-mono text-lg font-bold text-foreground">
                  {filteredWatchlist.length}
                </p>
                <p className="text-[11px] text-muted-foreground">Showing</p>
              </div>
              <div className="h-7 w-px bg-border" />
              <div>
                <p className="font-mono text-lg font-bold text-foreground">
                  {
                    filteredWatchlist.filter(
                      (i) => i.watchlistItem.type === "movie"
                    ).length
                  }
                </p>
                <p className="text-[11px] text-muted-foreground">Movies</p>
              </div>
              <div className="h-7 w-px bg-border" />
              <div>
                <p className="font-mono text-lg font-bold text-foreground">
                  {
                    filteredWatchlist.filter(
                      (i) => i.watchlistItem.type === "tv"
                    ).length
                  }
                </p>
                <p className="text-[11px] text-muted-foreground">Series</p>
              </div>
            </div>
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 rounded-2xl bg-secondary skeleton-shimmer"
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredWatchlist.length === 0 && (
            <div className="surface-card p-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary text-primary">
                <Bookmark className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {watchlistItems.length === 0
                    ? "Your watchlist is empty"
                    : "No items match these filters"}
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto">
                  {watchlistItems.length === 0
                    ? "Bookmark movies and series across Cinetron to build your personal queue."
                    : "Try clearing one of the active type or status filters."}
                </p>
              </div>
              <div className="pt-2">
                {watchlistItems.length === 0 ? (
                  <Link href="/movies" className="btn-cinema">
                    <Film className="h-4 w-4" />
                    <span>Browse Movies</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setFilter("all");
                      setStatusFilter("all");
                    }}
                    className="btn-cinema-outline"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Watchlist Cards */}
          {!isLoading && filteredWatchlist.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredWatchlist.map(({ watchlistItem, details }) => {
                const title =
                  "title" in details ? details.title : details.name;
                const dateStr =
                  "release_date" in details
                    ? details.release_date
                    : details.first_air_date;
                const year = dateStr ? dateStr.slice(0, 4) : "TBA";
                const poster = tmdbClient.getImageUrl(
                  details.poster_path || null,
                  "w342"
                );
                const href =
                  watchlistItem.type === "movie"
                    ? `/movie/${createMovieSlug(title, watchlistItem.id)}`
                    : `/tv/${createTVShowSlug(title, watchlistItem.id)}`;

                return (
                  <article
                    key={`${watchlistItem.type}-${watchlistItem.id}`}
                    className="surface-card p-4 flex gap-4"
                  >
                    {/* Poster */}
                    <Link
                      href={href}
                      className="relative h-44 w-28 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary"
                    >
                      {poster ? (
                        <Image
                          src={poster}
                          alt={title}
                          fill
                          sizes="112px"
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          {watchlistItem.type === "movie" ? (
                            <Film className="h-6 w-6 opacity-40" />
                          ) : (
                            <Tv className="h-6 w-6 opacity-40" />
                          )}
                        </div>
                      )}
                    </Link>

                    {/* Controls & Info */}
                    <div className="min-w-0 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={href}
                            className="text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {title}
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleRemove(watchlistItem.id, title)}
                            aria-label={`Remove ${title}`}
                            className="rounded-lg p-1.5 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
                          <span className="capitalize font-sans">
                            {watchlistItem.type === "tv" ? "Series" : "Movie"}
                          </span>
                          <span>·</span>
                          <span>{year}</span>
                          {details.vote_average > 0 && (
                            <>
                              <span>·</span>
                              <span className="inline-flex items-center gap-1 text-foreground">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                {details.vote_average.toFixed(1)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          aria-label="Watch status"
                          value={watchlistItem.status}
                          onChange={(e) =>
                            updateWatchlistItem(watchlistItem.id, {
                              status: e.target.value as WatchlistItem["status"],
                            })
                          }
                          className={`w-full rounded-lg border px-2 py-1.5 text-xs font-semibold focus:outline-none ${getStatusBadge(
                            watchlistItem.status
                          )}`}
                        >
                          <option value="plan-to-watch">Plan to Watch</option>
                          <option value="watching">Watching</option>
                          <option value="completed">Completed</option>
                          <option value="on-hold">On Hold</option>
                          <option value="dropped">Dropped</option>
                        </select>

                        <select
                          aria-label="Priority"
                          value={watchlistItem.priority}
                          onChange={(e) =>
                            updateWatchlistItem(watchlistItem.id, {
                              priority: e.target
                                .value as WatchlistItem["priority"],
                            })
                          }
                          className="w-full rounded-lg border border-border bg-secondary px-2 py-1.5 text-xs font-medium text-foreground focus:outline-none"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium</option>
                          <option value="high">High Priority</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Added{" "}
                          {new Date(watchlistItem.addedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function WatchlistPage() {
  return (
    <ProtectedRoute>
      <WatchlistContent />
    </ProtectedRoute>
  );
}
