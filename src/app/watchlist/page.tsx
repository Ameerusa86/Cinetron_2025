"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/stores";
import { useWatchlistDetails } from "@/hooks";
import { createMovieSlug, createTVShowSlug } from "@/lib/slug-utils";
import tmdbClient from "@/lib/tmdb-client";
import { WatchlistItem } from "@/types";

export default function WatchlistPage() {
  const { user, updateWatchlistItem, removeFromWatchlist } = useUserStore();
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");
  const [statusFilter, setStatusFilter] = useState<
    WatchlistItem["status"] | "all"
  >("all");
  const [sortBy, setSortBy] = useState<"added" | "title" | "rating">("added");

  // Extract IDs from watchlist items for the details hook
  const watchlistIds = user?.watchlist?.map((item) => item.id) || [];

  // Get detailed data for watchlist items
  const { data: mediaDetails, isLoading } = useWatchlistDetails(watchlistIds);

  // Combine watchlist items with their media details
  const watchlistWithDetails = React.useMemo(() => {
    if (!user?.watchlist || !mediaDetails) return [];

    return user.watchlist
      .map((watchlistItem) => {
        const details = mediaDetails.find(
          (media) => media.id === watchlistItem.id
        );
        return {
          watchlistItem,
          details,
        };
      })
      .filter((item) => item.details); // Only include items with valid details
  }, [user?.watchlist, mediaDetails]);

  // Filter and sort watchlist
  const filteredWatchlist = React.useMemo(() => {
    if (!watchlistWithDetails) return [];

    const filtered = watchlistWithDetails.filter((item) => {
      if (filter !== "all" && item.watchlistItem.type !== filter) return false;
      if (statusFilter !== "all" && item.watchlistItem.status !== statusFilter)
        return false;
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          const titleA =
            "title" in a.details! ? a.details.title : a.details!.name;
          const titleB =
            "title" in b.details! ? b.details.title : b.details!.name;
          return titleA.localeCompare(titleB);
        case "rating":
          return (
            (b.details!.vote_average || 0) - (a.details!.vote_average || 0)
          );
        case "added":
        default:
          return (
            new Date(b.watchlistItem.addedAt).getTime() -
            new Date(a.watchlistItem.addedAt).getTime()
          );
      }
    });

    return filtered;
  }, [watchlistWithDetails, filter, statusFilter, sortBy]);

  // Helper function to get title from either movie or TV show
  type MovieDetails = {
    id: number;
    title: string;
    release_date?: string;
    poster_path?: string | null;
    vote_average?: number;
  };

  type TVShowDetails = {
    id: number;
    name: string;
    first_air_date?: string;
    poster_path?: string | null;
    vote_average?: number;
  };

  type MediaDetails = MovieDetails | TVShowDetails;

  const getTitle = (details: MediaDetails): string => {
    return "title" in details ? details.title : details.name || "Unknown Title";
  };

  // Helper function to get release year
  const getReleaseYear = (details: MediaDetails): string => {
    if ("release_date" in details && details.release_date) {
      return new Date(details.release_date).getFullYear().toString();
    }
    if ("first_air_date" in details && details.first_air_date) {
      return new Date(details.first_air_date).getFullYear().toString();
    }
    return "Unknown";
  };

  const getStatusColor = (status: WatchlistItem["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "watching":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "plan-to-watch":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "dropped":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "on-hold":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPriorityColor = (priority: WatchlistItem["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      case "low":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleStatusChange = (
    id: number,
    newStatus: WatchlistItem["status"]
  ) => {
    updateWatchlistItem(id, { status: newStatus });
  };

  const handlePriorityChange = (
    id: number,
    newPriority: WatchlistItem["priority"]
  ) => {
    updateWatchlistItem(id, { priority: newPriority });
  };

  const handleRemove = (id: number) => {
    removeFromWatchlist(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 lg:pt-28 w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Loading your watchlist...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full bg-gradient-to-br from-slate-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
            📚 My Watchlist
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Track and manage your movies and TV shows
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Type
              </label>
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as "all" | "movie" | "tv")
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as WatchlistItem["status"] | "all"
                  )
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="plan-to-watch">Plan to Watch</option>
                <option value="watching">Currently Watching</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "added" | "title" | "rating")
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="added">Date Added</option>
                <option value="title">Title</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Stats */}
            <div className="flex flex-col justify-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Total Items:{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {filteredWatchlist.length}
                </span>
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Movies:{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {
                    filteredWatchlist.filter(
                      (item) => item.watchlistItem.type === "movie"
                    ).length
                  }
                </span>
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                TV Shows:{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {
                    filteredWatchlist.filter(
                      (item) => item.watchlistItem.type === "tv"
                    ).length
                  }
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Watchlist Items */}
        {filteredWatchlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">�</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {user?.watchlist?.length === 0
                ? "Your watchlist is empty"
                : "No items match your filters"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {user?.watchlist?.length === 0
                ? "Start adding movies and TV shows to keep track of what you want to watch!"
                : "Try adjusting your filters to see more items."}
            </p>
            {user?.watchlist?.length === 0 && (
              <Link
                href="/movies"
                className="btn-cinema inline-flex items-center gap-2 px-6 py-3"
              >
                🎬 Browse Movies
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWatchlist.map((item) => {
              const { watchlistItem, details } = item;
              if (!details) return null;

              const title = getTitle(details);
              const releaseYear = getReleaseYear(details);

              return (
                <div
                  key={watchlistItem.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Poster and Quick Actions */}
                  <div className="relative">
                    <div className="aspect-[2/3] w-full max-w-[200px] mx-auto relative overflow-hidden">
                      <Image
                        src={
                          tmdbClient.getImageUrl(
                            details.poster_path || null,
                            "w500"
                          ) || "/placeholder-poster.svg"
                        }
                        alt={title}
                        width={200}
                        height={300}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-poster.svg";
                        }}
                      />
                    </div>

                    {/* Quick Remove Button */}
                    <button
                      onClick={() => handleRemove(watchlistItem.id)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200"
                      title="Remove from watchlist"
                    >
                      ❌
                    </button>

                    {/* Priority Indicator */}
                    <div
                      className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        watchlistItem.priority
                      )}`}
                    >
                      {watchlistItem.priority.toUpperCase()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <Link
                        href={
                          watchlistItem.type === "movie"
                            ? `/movie/${createMovieSlug(
                                title,
                                watchlistItem.id
                              )}`
                            : `/tv/${createTVShowSlug(title, watchlistItem.id)}`
                        }
                        className="text-xl font-bold text-slate-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 line-clamp-2"
                      >
                        {title}
                      </Link>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {watchlistItem.type === "movie"
                          ? "🎬 Movie"
                          : "📺 TV Show"}{" "}
                        • {releaseYear}
                      </p>
                      {details.vote_average && details.vote_average > 0 && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          ⭐ {details.vote_average.toFixed(1)}/10
                        </p>
                      )}
                    </div>

                    {/* Status Control */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Status
                      </label>
                      <select
                        value={watchlistItem.status}
                        onChange={(e) =>
                          handleStatusChange(
                            watchlistItem.id,
                            e.target.value as WatchlistItem["status"]
                          )
                        }
                        className={`w-full px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor(
                          watchlistItem.status
                        )}`}
                      >
                        <option value="plan-to-watch">Plan to Watch</option>
                        <option value="watching">Currently Watching</option>
                        <option value="completed">Completed</option>
                        <option value="on-hold">On Hold</option>
                        <option value="dropped">Dropped</option>
                      </select>
                    </div>

                    {/* Priority Control */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={watchlistItem.priority}
                        onChange={(e) =>
                          handlePriorityChange(
                            watchlistItem.id,
                            e.target.value as WatchlistItem["priority"]
                          )
                        }
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>

                    {/* Episode Progress for TV Shows */}
                    {watchlistItem.type === "tv" &&
                      watchlistItem.episodeProgress && (
                        <div className="mb-4">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Progress: Season{" "}
                            {watchlistItem.episodeProgress.season}, Episode{" "}
                            {watchlistItem.episodeProgress.episode}
                          </p>
                        </div>
                      )}

                    {/* Notes */}
                    {watchlistItem.notes && (
                      <div className="mb-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                          &ldquo;{watchlistItem.notes}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Added Date */}
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Added{" "}
                      {new Date(watchlistItem.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
