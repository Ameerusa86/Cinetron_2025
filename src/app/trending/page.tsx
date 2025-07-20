"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTrendingMovies, usePopularTVShows } from "@/hooks";
import tmdbClient from "@/lib/tmdb-client";

const timeWindows = [
  { id: "day", label: "Today", icon: "📅" },
  { id: "week", label: "This Week", icon: "📆" },
];

const contentTypes = [
  { id: "all", label: "All", icon: "🌟" },
  { id: "movie", label: "Movies", icon: "🎬" },
  { id: "tv", label: "TV Shows", icon: "📺" },
  { id: "person", label: "People", icon: "👤" },
];

export default function TrendingPage() {
  const [selectedTimeWindow, setSelectedTimeWindow] = useState("week");
  const [selectedContentType, setSelectedContentType] = useState("all");

  const {
    data: trendingMovies,
    isLoading: moviesLoading,
    error: moviesError,
  } = useTrendingMovies();
  const {
    data: trendingTVShows,
    isLoading: tvLoading,
    error: tvError,
  } = usePopularTVShows();

  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full">
      {/* Hero Section - Trending */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-orange-800 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(239,68,68,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] animate-pulse" />

        <div className="relative z-10 text-center w-full">
          <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              🔥 Trending
            </span>
          </h1>
          <p className="text-xl lg:text-2xl xl:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto">
            Discover what&apos;s hot right now - the most popular movies, TV
            shows, and stars everyone&apos;s talking about
          </p>

          {/* Time Window Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {timeWindows.map((window) => (
              <button
                key={window.id}
                onClick={() => setSelectedTimeWindow(window.id)}
                className={`flex items-center space-x-2 px-6 py-3 lg:px-8 lg:py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                  selectedTimeWindow === window.id
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/25"
                    : "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20"
                }`}
              >
                <span className="text-xl">{window.icon}</span>
                <span>{window.label}</span>
              </button>
            ))}
          </div>

          {/* Content Type Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedContentType(type.id)}
                className={`flex items-center space-x-2 px-4 py-2 lg:px-6 lg:py-3 rounded-xl text-sm lg:text-base font-medium transition-all duration-300 ${
                  selectedContentType === type.id
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
                    : "bg-white/10 backdrop-blur-xl border border-white/20 text-slate-300 hover:text-white hover:bg-white/20"
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Content */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
        <div className="w-full">
          {/* Trending Movies Section */}
          {(selectedContentType === "all" ||
            selectedContentType === "movie") && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white">
                  🎬 Trending Movies
                </h2>
                <Link
                  href="/movies"
                  className="text-orange-500 hover:text-orange-600 font-medium text-lg transition-colors duration-300"
                >
                  View All →
                </Link>
              </div>

              {moviesLoading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent"></div>
                </div>
              )}

              {moviesError && (
                <div className="text-center py-12">
                  <p className="text-red-500 text-lg">
                    ⚠️ Unable to load trending movies.
                  </p>
                </div>
              )}

              {trendingMovies && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
                  {trendingMovies.results.slice(0, 16).map((movie) => (
                    <div
                      key={movie.id}
                      className="card-premium group cursor-pointer relative overflow-hidden"
                    >
                      {/* Trending Badge */}
                      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        🔥 #{trendingMovies.results.indexOf(movie) + 1}
                      </div>

                      <div className="aspect-[2/3] relative overflow-hidden rounded-xl">
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
                          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                            {movie.title}
                          </h3>
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

          {/* Trending TV Shows Section */}
          {(selectedContentType === "all" || selectedContentType === "tv") && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white">
                  📺 Trending TV Shows
                </h2>
                <Link
                  href="/tv-shows"
                  className="text-purple-500 hover:text-purple-600 font-medium text-lg transition-colors duration-300"
                >
                  View All →
                </Link>
              </div>

              {tvLoading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
                </div>
              )}

              {tvError && (
                <div className="text-center py-12">
                  <p className="text-red-500 text-lg">
                    ⚠️ Unable to load trending TV shows.
                  </p>
                </div>
              )}

              {trendingTVShows && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
                  {trendingTVShows.results.slice(0, 16).map((show) => (
                    <div
                      key={show.id}
                      className="card-premium group cursor-pointer relative overflow-hidden"
                    >
                      {/* Trending Badge */}
                      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        🔥 #{trendingTVShows.results.indexOf(show) + 1}
                      </div>

                      <div className="aspect-[2/3] relative overflow-hidden rounded-xl">
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
                          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                            {show.name}
                          </h3>
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

          {/* Trending Stats Section */}
          <div className="mt-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white mb-8 text-center">
              📊 Trending Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="card-cinema p-6 sm:p-8 text-center">
                <div className="text-4xl sm:text-5xl mb-4">🎬</div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold mb-2 text-gradient-cinema">
                  {trendingMovies?.results?.length || 0}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Trending Movies
                </p>
              </div>

              <div className="card-cinema p-6 sm:p-8 text-center">
                <div className="text-4xl sm:text-5xl mb-4">📺</div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold mb-2 text-gradient-cinema">
                  {trendingTVShows?.results?.length || 0}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Trending TV Shows
                </p>
              </div>

              <div className="card-cinema p-6 sm:p-8 text-center">
                <div className="text-4xl sm:text-5xl mb-4">🔥</div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold mb-2 text-gradient-cinema">
                  Live
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Real-time Updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
