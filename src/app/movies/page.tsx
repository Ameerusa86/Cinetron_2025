"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePopularMovies, useSearchMovies } from "@/hooks";
import tmdbClient from "@/lib/tmdb-client";
import { createMovieSlug } from "@/lib/slug-utils";
import type { Movie } from "@/types";

const genres = [
  { id: 28, name: "Action", icon: "🎬" },
  { id: 35, name: "Comedy", icon: "😂" },
  { id: 18, name: "Drama", icon: "🎭" },
  { id: 27, name: "Horror", icon: "👻" },
  { id: 10749, name: "Romance", icon: "💕" },
  { id: 878, name: "Sci-Fi", icon: "🚀" },
  { id: 53, name: "Thriller", icon: "🔪" },
  { id: 16, name: "Animation", icon: "🎨" },
];

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("popularity.desc");

  const { data: popularMovies, isLoading, error } = usePopularMovies();
  const { data: searchResults, isLoading: isSearching } =
    useSearchMovies(searchQuery);

  const displayMovies = searchQuery
    ? searchResults?.results
    : popularMovies?.results;

  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full">
      {/* Hero Section - Full Width */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(244,110,12,0.3),transparent)]" />

        <div className="relative z-10 text-center w-full">
          <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-white mb-6">
            <span className="text-gradient-premium">Discover</span>{" "}
            <span className="text-white">Movies</span>
          </h1>
          <p className="text-xl lg:text-2xl xl:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto">
            Explore thousands of movies from every genre, decade, and corner of
            the world
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-slate-300 text-lg lg:text-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
            />
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 lg:w-7 lg:h-7 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Filters Section - Full Width */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 xl:px-12 bg-slate-50 dark:bg-slate-900/50 w-full">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Genre Filter */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedGenre(null)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedGenre === null
                    ? "bg-gradient-cinema text-white shadow-glow"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                All Genres
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                    selectedGenre === genre.id
                      ? "bg-gradient-cinema text-white shadow-glow"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <span>{genre.icon}</span>
                  <span>{genre.name}</span>
                </button>
              ))}
            </div>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="release_date.desc">Newest First</option>
              <option value="revenue.desc">Highest Grossing</option>
            </select>
          </div>
        </div>
      </section>

      {/* Movies Grid - Full Width */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
        <div className="w-full">
          {(isLoading || isSearching) && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">
                ⚠️ Unable to load movies. Please try again later.
              </p>
            </div>
          )}

          {displayMovies && displayMovies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">
                No movies found. Try adjusting your search or filters.
              </p>
            </div>
          )}

          {displayMovies && displayMovies.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
              {displayMovies.map((movie: Movie) => (
                <Link
                  key={movie.id}
                  href={`/movie/${createMovieSlug(movie.title, movie.id)}`}
                  className="card-premium group cursor-pointer"
                >
                  <div className="aspect-[2/3] relative overflow-hidden rounded-xl">
                    <Image
                      src={
                        tmdbClient.getImageUrl(movie.poster_path, "w500") ||
                        "/placeholder-poster.svg"
                      }
                      alt={movie.title}
                      width={400}
                      height={600}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                    {/* Content */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                        {movie.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
                        <span className="flex items-center">
                          <span className="text-yellow-400 mr-1">⭐</span>
                          {movie.vote_average.toFixed(1)}
                        </span>
                        <span>
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm line-clamp-3">
                        {movie.overview}
                      </p>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <div className="flex items-center text-xs text-white">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        {movie.vote_average.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {displayMovies && displayMovies.length > 0 && (
            <div className="text-center mt-12">
              <button className="btn-cinema-outline px-8 py-3 text-lg">
                Load More Movies
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
