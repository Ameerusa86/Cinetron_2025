"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePopularMovies, usePopularTVShows } from "@/hooks";
import tmdbClient from "@/lib/tmdb-client";

const genres = [
  { id: 28, name: "Action", icon: "⚡", color: "from-red-500 to-orange-500" },
  {
    id: 35,
    name: "Comedy",
    icon: "😂",
    color: "from-yellow-500 to-orange-500",
  },
  { id: 18, name: "Drama", icon: "🎭", color: "from-blue-500 to-purple-500" },
  { id: 27, name: "Horror", icon: "👻", color: "from-gray-800 to-black" },
  { id: 10749, name: "Romance", icon: "💕", color: "from-pink-500 to-red-500" },
  { id: 878, name: "Sci-Fi", icon: "🚀", color: "from-cyan-500 to-blue-500" },
  {
    id: 53,
    name: "Thriller",
    icon: "🔪",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: 16,
    name: "Animation",
    icon: "🎨",
    color: "from-green-500 to-teal-500",
  },
  {
    id: 12,
    name: "Adventure",
    icon: "🗺️",
    color: "from-emerald-500 to-green-500",
  },
  {
    id: 14,
    name: "Fantasy",
    icon: "🧙‍♂️",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: 36,
    name: "History",
    icon: "📜",
    color: "from-amber-600 to-yellow-600",
  },
  {
    id: 9648,
    name: "Mystery",
    icon: "🔍",
    color: "from-slate-600 to-gray-600",
  },
];

const yearRanges = [
  { id: "2024", name: "2024", range: [2024, 2024] },
  { id: "2020s", name: "2020s", range: [2020, 2024] },
  { id: "2010s", name: "2010s", range: [2010, 2019] },
  { id: "2000s", name: "2000s", range: [2000, 2009] },
  { id: "90s", name: "90s", range: [1990, 1999] },
  { id: "classics", name: "Classics", range: [1970, 1989] },
];

const sortOptions = [
  { id: "popularity", name: "Most Popular", icon: "🔥" },
  { id: "rating", name: "Highest Rated", icon: "⭐" },
  { id: "release_date", name: "Latest Release", icon: "📅" },
  { id: "vote_count", name: "Most Reviewed", icon: "👥" },
  { id: "revenue", name: "Highest Grossing", icon: "💰" },
];

const discoveryModes = [
  {
    id: "movies",
    name: "Movies",
    icon: "🎬",
    description: "Discover amazing films",
  },
  {
    id: "tv",
    name: "TV Shows",
    icon: "📺",
    description: "Find your next binge-watch",
  },
  {
    id: "mixed",
    name: "Mixed",
    icon: "🎭",
    description: "Movies and TV shows together",
  },
];

export default function DiscoverPage() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState("popularity");
  const [discoveryMode, setDiscoveryMode] = useState("mixed");

  const { data: movies, isLoading: moviesLoading } = usePopularMovies();
  const { data: tvShows, isLoading: tvLoading } = usePopularTVShows();

  const selectedGenreInfo = genres.find((g) => g.id === selectedGenre);

  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full">
      {/* Hero Section - Discover */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.03),transparent)] animate-pulse" />

        <div className="relative z-10 text-center w-full">
          <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              🔍 Discover
            </span>
          </h1>
          <p className="text-xl lg:text-2xl xl:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto">
            Explore the infinite universe of cinema with AI-powered discovery
            and smart filters
          </p>

          {/* Discovery Mode Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {discoveryModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setDiscoveryMode(mode.id)}
                className={`group relative overflow-hidden px-8 py-4 lg:px-10 lg:py-5 rounded-2xl text-lg font-medium transition-all duration-500 ${
                  discoveryMode === mode.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/25 scale-105"
                    : "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:scale-102"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-2xl lg:text-3xl">{mode.icon}</span>
                  <span className="font-bold">{mode.name}</span>
                  <span className="text-sm opacity-80">{mode.description}</span>
                </div>
                {discoveryMode === mode.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 animate-pulse rounded-2xl" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Filters Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 xl:px-12 bg-slate-50 dark:bg-slate-900/50 w-full">
        <div className="w-full">
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-slate-900 dark:text-white mb-8 text-center">
            🎯 Advanced Discovery Filters
          </h2>

          {/* Genre Filter */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
              🎭 Genres
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() =>
                    setSelectedGenre(
                      selectedGenre === genre.id ? null : genre.id
                    )
                  }
                  className={`relative overflow-hidden p-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedGenre === genre.id
                      ? `bg-gradient-to-r ${genre.color} text-white shadow-lg transform scale-105`
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-102 shadow-md hover:shadow-lg"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">{genre.icon}</span>
                    <span className="font-medium">{genre.name}</span>
                  </div>
                  {selectedGenre === genre.id && (
                    <div className="absolute inset-0 bg-white/10 animate-pulse rounded-xl" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Year Range Filter */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
              📅 Release Period
            </h3>
            <div className="flex flex-wrap gap-3">
              {yearRanges.map((year) => (
                <button
                  key={year.id}
                  onClick={() =>
                    setSelectedYear(selectedYear === year.id ? null : year.id)
                  }
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedYear === year.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {year.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
              📊 Sort By
            </h3>
            <div className="flex flex-wrap gap-3">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedSort(option.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedSort === option.id
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <span>{option.icon}</span>
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {(selectedGenre || selectedYear || selectedSort !== "popularity") && (
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-4 mb-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Active Filters:
                </span>
                {selectedGenreInfo && (
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {selectedGenreInfo.icon} {selectedGenreInfo.name}
                  </span>
                )}
                {selectedYear && (
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    📅 {yearRanges.find((y) => y.id === selectedYear)?.name}
                  </span>
                )}
                {selectedSort !== "popularity" && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {sortOptions.find((s) => s.id === selectedSort)?.icon}{" "}
                    {sortOptions.find((s) => s.id === selectedSort)?.name}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedGenre(null);
                    setSelectedYear(null);
                    setSelectedSort("popularity");
                  }}
                  className="text-red-500 hover:text-red-600 text-sm font-medium ml-2"
                >
                  Clear All ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Discovered Content */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
        <div className="w-full">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white mb-8 text-center">
            ✨ Discovered for You
          </h2>

          {/* Movies Section */}
          {(discoveryMode === "movies" || discoveryMode === "mixed") && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl lg:text-3xl font-display font-bold text-slate-900 dark:text-white">
                  🎬 Movies
                  {selectedGenreInfo && (
                    <span className="ml-3 text-lg text-slate-600 dark:text-slate-400">
                      · {selectedGenreInfo.name}
                    </span>
                  )}
                </h3>
                <Link
                  href="/movies"
                  className="text-emerald-500 hover:text-emerald-600 font-medium transition-colors"
                >
                  Explore More →
                </Link>
              </div>

              {moviesLoading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent"></div>
                </div>
              )}

              {movies && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
                  {movies.results.slice(0, 16).map((movie, index) => (
                    <div
                      key={movie.id}
                      className="card-premium group cursor-pointer"
                    >
                      <div className="aspect-[2/3] relative overflow-hidden rounded-xl">
                        {/* Discovery Rank Badge */}
                        <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          #{index + 1}
                        </div>

                        <Image
                          src={
                            tmdbClient.getImageUrl(movie.poster_path, "w500") ||
                            "/placeholder-poster.svg"
                          }
                          alt={movie.title}
                          width={300}
                          height={450}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-poster.svg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                          <h4 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                            {movie.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-slate-300">
                            <div className="flex items-center gap-1">
                              <span>⭐</span>
                              <span>{movie.vote_average.toFixed(1)}</span>
                            </div>
                            <span>
                              {new Date(movie.release_date).getFullYear()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TV Shows Section */}
          {(discoveryMode === "tv" || discoveryMode === "mixed") && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl lg:text-3xl font-display font-bold text-slate-900 dark:text-white">
                  📺 TV Shows
                  {selectedGenreInfo && (
                    <span className="ml-3 text-lg text-slate-600 dark:text-slate-400">
                      · {selectedGenreInfo.name}
                    </span>
                  )}
                </h3>
                <Link
                  href="/tv-shows"
                  className="text-purple-500 hover:text-purple-600 font-medium transition-colors"
                >
                  Explore More →
                </Link>
              </div>

              {tvLoading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
                </div>
              )}

              {tvShows && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
                  {tvShows.results.slice(0, 16).map((show, index) => (
                    <div
                      key={show.id}
                      className="card-premium group cursor-pointer"
                    >
                      <div className="aspect-[2/3] relative overflow-hidden rounded-xl">
                        {/* Discovery Rank Badge */}
                        <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          #{index + 1}
                        </div>

                        <Image
                          src={
                            tmdbClient.getImageUrl(
                              show.poster_path || null,
                              "w500"
                            ) || "/placeholder-poster.svg"
                          }
                          alt={show.name}
                          width={300}
                          height={450}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-poster.svg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                          <h4 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                            {show.name}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-slate-300">
                            <div className="flex items-center gap-1">
                              <span>⭐</span>
                              <span>{show.vote_average.toFixed(1)}</span>
                            </div>
                            <span>
                              {new Date(show.first_air_date).getFullYear()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
