"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useMovieDetailsBySlug } from "@/hooks";
import { useUserStore } from "@/stores";
import { useNotificationStore } from "@/stores";
import tmdbClient from "@/lib/tmdb-client";
import { createMovieSlug, createPersonSlug } from "@/lib/slug-utils";

interface MovieDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { slug } = React.use(params);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const { data: movie, isLoading, error } = useMovieDetailsBySlug(slug);

  // Watchlist and favorites functionality
  const {
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    isInWatchlist,
    isInFavorites,
  } = useUserStore();

  const { addNotification } = useNotificationStore();

  if (isLoading) {
    return <MovieDetailSkeleton />;
  }

  if (error || !movie) {
    notFound();
  }

  const inWatchlist = isInWatchlist(movie.id);
  const inFavorites = isInFavorites(movie.id);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
      addNotification({
        type: "success",
        title: "Removed from Watchlist",
        message: `"${movie.title}" has been removed from your watchlist.`,
        read: false,
      });
    } else {
      addToWatchlist({
        id: movie.id,
        type: "movie",
        status: "plan-to-watch",
        priority: "medium",
      });
      addNotification({
        type: "success",
        title: "Added to Watchlist",
        message: `"${movie.title}" has been added to your watchlist.`,
        read: false,
      });
    }
  };

  const handleFavoritesToggle = () => {
    if (inFavorites) {
      removeFromFavorites(movie.id);
      addNotification({
        type: "info",
        title: "Removed from Favorites",
        message: `"${movie.title}" has been removed from your favorites.`,
        read: false,
      });
    } else {
      addToFavorites(movie.id);
      addNotification({
        type: "success",
        title: "Added to Favorites",
        message: `"${movie.title}" has been added to your favorites.`,
        read: false,
      });
    }
  };

  // Get videos
  const videos =
    movie.videos?.results?.filter((video) => video.site === "YouTube") || [];

  // Get director and main cast
  const director = movie.credits?.crew.find(
    (person) => person.job === "Director"
  );
  const mainCast = movie.credits?.cast.slice(0, 10) || [];

  // Format runtime
  const formatRuntime = (minutes?: number) => {
    if (!minutes) return "Unknown";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Format budget/revenue
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
    }).format(amount);
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full">
      {/* Hero Section with Backdrop */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Backdrop Image */}
        {movie.backdrop_path && (
          <div className="absolute inset-0">
            <Image
              src={
                tmdbClient.getImageUrl(movie.backdrop_path, "original") || ""
              }
              alt={movie.title}
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
              priority
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />
          </div>
        )}

        {/* Movie Information */}
        <div className="relative z-10 h-full flex items-center px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Poster */}
            <div className="lg:col-span-2">
              <div className="aspect-[2/3] w-full max-w-md mx-auto lg:max-w-none relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={
                    tmdbClient.getImageUrl(movie.poster_path, "w500") ||
                    "/placeholder-poster.svg"
                  }
                  alt={movie.title}
                  width={400}
                  height={600}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-poster.svg";
                  }}
                />
                {/* 3D Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 opacity-0 hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            {/* Movie Details */}
            <div className="lg:col-span-3 text-white text-center lg:text-left">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-gradient-premium mb-4">
                    {movie.title}
                  </h1>
                  {movie.tagline && (
                    <p className="text-xl lg:text-2xl text-slate-300 italic">
                      &ldquo;{movie.tagline}&rdquo;
                    </p>
                  )}
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-lg">
                  <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full">
                    <span>⭐</span>
                    <span className="font-bold text-yellow-400">
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-slate-300">
                      ({movie.vote_count.toLocaleString()})
                    </span>
                  </div>
                  <div className="bg-black/50 px-4 py-2 rounded-full">
                    <span>🕐 {formatRuntime(movie.runtime)}</span>
                  </div>
                  <div className="bg-black/50 px-4 py-2 rounded-full">
                    <span>📅 {new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  <div className="bg-black/50 px-4 py-2 rounded-full">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        movie.adult ? "bg-red-600" : "bg-green-600"
                      }`}
                    >
                      {movie.adult ? "R" : "PG"}
                    </span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 px-4 py-2 rounded-full text-orange-300 text-sm font-medium backdrop-blur-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <div className="max-w-3xl">
                  <p className="text-lg lg:text-xl text-slate-200 leading-relaxed">
                    {movie.overview}
                  </p>
                </div>

                {/* Director */}
                {director && (
                  <div>
                    <p className="text-slate-300">
                      <span className="font-semibold">Directed by:</span>{" "}
                      <span className="text-white">{director.name}</span>
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={handleWatchlistToggle}
                    className={`${
                      inWatchlist ? "btn-cinema" : "btn-cinema-outline"
                    } flex items-center justify-center gap-2 text-lg px-8 py-4 transition-all duration-300`}
                  >
                    {inWatchlist ? "✅" : "➕"}{" "}
                    {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  </button>
                  <button
                    onClick={handleFavoritesToggle}
                    className={`${
                      inFavorites
                        ? "btn-glass bg-red-500/20 border-red-500/30"
                        : "btn-glass"
                    } flex items-center justify-center gap-2 text-lg px-8 py-4 transition-all duration-300`}
                  >
                    {inFavorites ? "❤️" : "💝"}{" "}
                    {inFavorites ? "Favorited" : "Add to Favorites"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Details Sections */}
      <div className="w-full">
        {/* Cast Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="w-full">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white mb-8">
              🎭 Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
              {mainCast.map((person) => (
                <Link
                  key={person.id}
                  href={`/person/${createPersonSlug(person.name, person.id)}`}
                  className="group text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className="aspect-square relative overflow-hidden rounded-full mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Image
                      src={
                        tmdbClient.getImageUrl(
                          person.profile_path || null,
                          "w300"
                        ) || "/placeholder-avatar.svg"
                      }
                      alt={person.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-avatar.svg";
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 mb-1">
                    {person.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {person.character}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Videos Section */}
        {videos.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="w-full">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white mb-8">
                🎬 Videos & Trailers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.slice(0, 6).map((video) => (
                  <div
                    key={video.id}
                    className="group relative aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    onClick={() => setSelectedVideo(video.key)}
                  >
                    {/* YouTube Thumbnail */}
                    <Image
                      src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                      alt={video.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105 z-10"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      onError={(e) => {
                        // Fallback to medium quality thumbnail if hq fails
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes("hqdefault")) {
                          target.src = `https://img.youtube.com/vi/${video.key}/mqdefault.jpg`;
                        } else if (target.src.includes("mqdefault")) {
                          target.src = `https://img.youtube.com/vi/${video.key}/default.jpg`;
                        } else {
                          // Hide the image completely to show CSS fallback
                          target.style.display = "none";
                          // Also hide the parent container's background
                          const container = target.closest(".group");
                          if (container) {
                            container.classList.add("show-fallback");
                          }
                        }
                      }}
                    />

                    {/* CSS Fallback Background - only shows when image fails completely */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center opacity-0 group-[.show-fallback]:opacity-100 z-5">
                      <div className="text-center text-white/80">
                        <div className="text-4xl mb-2">🎬</div>
                        <div className="text-sm font-medium">Video Preview</div>
                        <div className="text-xs mt-1 opacity-75">
                          {video.type}
                        </div>
                      </div>
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 z-20" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      <div className="w-16 h-16 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg hover:bg-red-500">
                        <svg
                          className="w-6 h-6 text-white ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Video Type Badge */}
                    <div className="absolute top-3 right-3 bg-black/80 text-white text-xs px-3 py-1 rounded-full z-30">
                      {video.type === "Trailer"
                        ? "TRAILER"
                        : video.type.toUpperCase()}
                    </div>

                    {/* Title and Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 z-30">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 drop-shadow-lg mb-1">
                        {video.name}
                      </h3>
                      <p className="text-slate-200 text-xs capitalize opacity-90">
                        {video.type} •{" "}
                        {video.published_at &&
                          new Date(video.published_at).getFullYear()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Movie Stats */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="w-full">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white mb-8">
              📊 Movie Statistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-cinema p-6 text-center">
                <div className="text-3xl mb-3">💰</div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {formatCurrency(movie.budget)}
                </div>
                <div className="text-slate-600 dark:text-slate-400">Budget</div>
              </div>

              <div className="card-cinema p-6 text-center">
                <div className="text-3xl mb-3">💎</div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatCurrency(movie.revenue)}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Revenue
                </div>
              </div>

              <div className="card-cinema p-6 text-center">
                <div className="text-3xl mb-3">⭐</div>
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {movie.vote_average.toFixed(1)}/10
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  {movie.vote_count.toLocaleString()} votes
                </div>
              </div>

              <div className="card-cinema p-6 text-center">
                <div className="text-3xl mb-3">🌍</div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {movie.popularity.toFixed(0)}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Popularity
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Similar Movies */}
        {movie.similar && movie.similar.results.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="w-full">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white mb-8">
                🎯 Similar Movies
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
                {movie.similar.results.slice(0, 8).map((similarMovie) => (
                  <Link
                    key={similarMovie.id}
                    href={`/movie/${createMovieSlug(
                      similarMovie.title,
                      similarMovie.id
                    )}`}
                    className="group"
                  >
                    <div className="aspect-[2/3] relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <Image
                        src={
                          tmdbClient.getImageUrl(
                            similarMovie.poster_path,
                            "w300"
                          ) || "/placeholder-poster.svg"
                        }
                        alt={similarMovie.title}
                        width={200}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-poster.svg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-3 left-3 right-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                          {similarMovie.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <span>⭐ {similarMovie.vote_average.toFixed(1)}</span>
                          <span>•</span>
                          <span>
                            {new Date(similarMovie.release_date).getFullYear()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative w-full max-w-4xl aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="Video Player"
              className="w-full h-full rounded-xl"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-red-400 text-2xl transition-colors duration-200"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading skeleton component
function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full animate-pulse">
      <div className="h-screen w-full bg-slate-200 dark:bg-slate-800 flex items-center px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-2">
            <div className="aspect-[2/3] w-full max-w-md mx-auto lg:max-w-none bg-slate-300 dark:bg-slate-700 rounded-2xl" />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <div className="h-12 bg-slate-300 dark:bg-slate-700 rounded-lg w-3/4" />
            <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded-lg w-1/2" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full" />
              <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full" />
              <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
