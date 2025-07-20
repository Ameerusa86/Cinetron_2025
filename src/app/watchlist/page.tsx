"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTrendingMovies, usePopularTVShows } from "@/hooks";
import tmdbClient from "@/lib/tmdb-client";

const watchlistCategories = [
  { id: "all", name: "All", icon: "📋", color: "from-blue-500 to-purple-500" },
  {
    id: "movies",
    name: "Movies",
    icon: "🎬",
    color: "from-red-500 to-orange-500",
  },
  {
    id: "tv-shows",
    name: "TV Shows",
    icon: "📺",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "completed",
    name: "Completed",
    icon: "✅",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "watching",
    name: "Watching",
    icon: "👁️",
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "plan-to-watch",
    name: "Plan to Watch",
    icon: "📅",
    color: "from-cyan-500 to-blue-500",
  },
];

const sortOptions = [
  { id: "added", name: "Recently Added", icon: "🕐" },
  { id: "rating", name: "Highest Rated", icon: "⭐" },
  { id: "alphabetical", name: "A-Z", icon: "🔤" },
  { id: "release", name: "Release Date", icon: "📅" },
  { id: "priority", name: "Priority", icon: "🔝" },
];

const mockWatchlistStats = {
  total: 0,
  movies: 0,
  tvShows: 0,
  completed: 0,
  watching: 0,
  planToWatch: 0,
  totalWatchTime: "0h 0m",
};

export default function WatchlistPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("added");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Since this is a demo, we'll show some sample content
  const { data: sampleMovies } = useTrendingMovies();
  const { data: sampleTVShows } = usePopularTVShows();

  const isEmpty = true; // Simulating empty watchlist for new users

  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full">
      {/* Hero Section - Watchlist */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.03),transparent)] animate-pulse" />

        <div className="relative z-10 text-center w-full">
          <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              📋 Watchlist
            </span>
          </h1>
          <p className="text-xl lg:text-2xl xl:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto">
            Your personal cinema collection - organize, track, and never miss
            the perfect movie night
          </p>

          {/* Watchlist Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 lg:p-6">
              <div className="text-2xl lg:text-3xl font-bold text-white">
                {mockWatchlistStats.total}
              </div>
              <div className="text-sm lg:text-base text-slate-300">
                Total Items
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 lg:p-6">
              <div className="text-2xl lg:text-3xl font-bold text-red-400">
                {mockWatchlistStats.movies}
              </div>
              <div className="text-sm lg:text-base text-slate-300">Movies</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 lg:p-6">
              <div className="text-2xl lg:text-3xl font-bold text-purple-400">
                {mockWatchlistStats.tvShows}
              </div>
              <div className="text-sm lg:text-base text-slate-300">
                TV Shows
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 lg:p-6">
              <div className="text-2xl lg:text-3xl font-bold text-green-400">
                {mockWatchlistStats.completed}
              </div>
              <div className="text-sm lg:text-base text-slate-300">
                Completed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 xl:px-12 bg-slate-50 dark:bg-slate-900/50 w-full">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {watchlistCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 lg:px-6 lg:py-3 rounded-xl text-sm lg:text-base font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-102"
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Sort and View Options */}
            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.icon} {option.name}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-purple-500 text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-purple-500 text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  ☰
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Watchlist Content */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
        <div className="w-full">
          {isEmpty ? (
            /* Empty State */
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📋</span>
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">
                  Your Watchlist is Empty
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  Start building your personal cinema collection by adding
                  movies and TV shows you want to watch
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/movies" className="btn-cinema">
                    🎬 Browse Movies
                  </Link>
                  <Link href="/tv-shows" className="btn-cinema-outline">
                    📺 Browse TV Shows
                  </Link>
                  <Link href="/trending" className="btn-glass">
                    🔥 See What&apos;s Trending
                  </Link>
                </div>
              </div>

              {/* Quick Add Suggestions */}
              <div className="mt-16">
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-8">
                  ✨ Popular Right Now - Quick Add
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {sampleMovies?.results.slice(0, 8).map((movie) => (
                    <div
                      key={movie.id}
                      className="group relative cursor-pointer"
                    >
                      <div className="aspect-[2/3] relative overflow-hidden rounded-xl bg-gradient-to-t from-black/50 to-transparent">
                        <Image
                          src={
                            tmdbClient.getImageUrl(movie.poster_path, "w300") ||
                            "/placeholder-poster.svg"
                          }
                          alt={movie.title}
                          width={200}
                          height={300}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-poster.svg";
                          }}
                        />
                        {/* Quick Add Button */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:scale-105 transition-transform duration-200">
                            ➕ Add to Watchlist
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <h4 className="text-white text-xs font-medium line-clamp-2 drop-shadow-lg">
                            {movie.title}
                          </h4>
                        </div>
                      </div>
                    </div>
                  )) || []}
                </div>
              </div>
            </div>
          ) : (
            /* Watchlist Items - This would show when user has items */
            <div className="text-center py-20">
              <p className="text-slate-600 dark:text-slate-400">
                Watchlist items would appear here...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Watchlist Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12 bg-slate-50 dark:bg-slate-900/50 w-full">
        <div className="w-full text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
            🎯 Premium Watchlist Features
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-12">
            Take control of your viewing experience
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card-cinema p-8 text-center">
              <div className="text-5xl mb-6">🤖</div>
              <h3 className="text-2xl font-display font-semibold mb-4 text-slate-900 dark:text-white">
                Smart Recommendations
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                AI-powered suggestions based on your watchlist and viewing
                history
              </p>
            </div>

            <div className="card-cinema p-8 text-center">
              <div className="text-5xl mb-6">📊</div>
              <h3 className="text-2xl font-display font-semibold mb-4 text-slate-900 dark:text-white">
                Progress Tracking
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Track your progress through TV series and movie marathons
              </p>
            </div>

            <div className="card-cinema p-8 text-center">
              <div className="text-5xl mb-6">🔔</div>
              <h3 className="text-2xl font-display font-semibold mb-4 text-slate-900 dark:text-white">
                Smart Notifications
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Get notified about new episodes, releases, and perfect viewing
                times
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
