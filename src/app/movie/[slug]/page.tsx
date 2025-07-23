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
      {/* Enhanced Premium Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Dynamic Background with Parallax Effect */}
        {movie.backdrop_path && (
          <div className="absolute inset-0">
            <Image
              src={
                tmdbClient.getImageUrl(movie.backdrop_path, "original") || ""
              }
              alt={movie.title}
              width={1920}
              height={1080}
              className="w-full h-full object-cover scale-110 hover:scale-105 transition-transform duration-[3s] ease-out"
              priority
            />
            {/* Enhanced Multi-Layer Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/20 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/20" />

            {/* Animated Overlay Effects */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400/60 rounded-full animate-pulse" />
              <div className="absolute top-40 right-32 w-1 h-1 bg-pink-400/70 rounded-full animate-bounce" />
              <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-ping" />
              <div className="absolute top-60 left-1/3 w-1 h-1 bg-cyan-400/60 rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {/* Enhanced Content Container */}
        <div className="relative z-10 min-h-screen flex items-center px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
          <div className="w-full max-w-8xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              {/* Enhanced Poster Section */}
              <div className="lg:col-span-4 xl:col-span-3">
                <div className="group relative">
                  <div className="aspect-[2/3] w-full max-w-sm mx-auto lg:max-w-none relative overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-700 ease-out">
                    {/* Glow Effect Behind Poster */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <Image
                      src={
                        tmdbClient.getImageUrl(movie.poster_path, "w500") ||
                        "/placeholder-poster.svg"
                      }
                      alt={movie.title}
                      width={400}
                      height={600}
                      className="relative w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-poster.svg";
                      }}
                    />

                    {/* Premium Glass Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Enhanced Floating Rating Badge */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white font-bold text-sm px-3 py-2 rounded-2xl shadow-2xl backdrop-blur-sm border-2 border-yellow-300/50 transform hover:scale-110 transition-all duration-300">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-800">⭐</span>
                        <span className="font-black">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur-md opacity-60 -z-10"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Movie Details Section */}
              <div className="lg:col-span-8 xl:col-span-9 text-white">
                <div className="space-y-8 max-w-5xl">
                  {/* Enhanced Title Section */}
                  <div className="space-y-4">
                    <h1 className="text-xl sm:text-3xl lg:text-4xl xl:text-6xl font-black leading-tight">
                      <span
                        className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl"
                        style={{
                          textShadow: "0 0 40px rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        {movie.title}
                      </span>
                    </h1>

                    {movie.tagline && (
                      <p className="text-xl lg:text-2xl xl:text-3xl text-slate-300 italic font-light tracking-wide">
                        &ldquo;{movie.tagline}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Compact Transparent Meta Information Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-black/30 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-center transition-all duration-300 hover:bg-black/40">
                      <div className="text-lg mb-0.5">🕐</div>
                      <div className="font-semibold text-sm">
                        {formatRuntime(movie.runtime)}
                      </div>
                      <div className="text-[10px] text-slate-400">Runtime</div>
                    </div>

                    <div className="bg-black/30 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-center transition-all duration-300 hover:bg-black/40">
                      <div className="text-lg mb-0.5">📅</div>
                      <div className="font-semibold text-sm">
                        {new Date(movie.release_date).getFullYear()}
                      </div>
                      <div className="text-[10px] text-slate-400">Release</div>
                    </div>

                    <div className="bg-black/30 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-center transition-all duration-300 hover:bg-black/40">
                      <div className="text-lg mb-0.5">👥</div>
                      <div className="font-semibold text-sm">
                        {movie.vote_count.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">Votes</div>
                    </div>

                    <div className="bg-black/30 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-center transition-all duration-300 hover:bg-black/40">
                      <div className="text-lg mb-0.5">🎬</div>
                      <div
                        className={`inline-block px-2 py-0.5 rounded-lg text-xs font-semibold ${
                          movie.adult
                            ? "bg-red-500/30 text-red-300 border border-red-500/30"
                            : "bg-green-500/30 text-green-300 border border-green-500/30"
                        }`}
                      >
                        {movie.adult ? "R" : "PG"}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Rating
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Genres */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-300">
                      Genres
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {movie.genres.map((genre, index) => (
                        <span
                          key={genre.id}
                          className="group relative bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 border border-purple-500/30 px-6 py-3 rounded-2xl text-white font-medium backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer"
                          style={{
                            animationDelay: `${index * 100}ms`,
                          }}
                        >
                          <span className="relative z-10">{genre.name}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Compact Transparent Overview */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-300">
                      Overview
                    </h3>
                    <p className="text-sm lg:text-base text-slate-200 leading-relaxed bg-black/30 backdrop-blur-md border border-white/10 p-4 rounded-xl transition-all duration-300 hover:bg-black/40">
                      {movie.overview}
                    </p>
                  </div>

                  {/* Enhanced Director Section */}
                  {director && (
                    <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl">
                      <p className="text-slate-300">
                        <span className="font-semibold text-lg">
                          Directed by:
                        </span>{" "}
                        <span className="text-white text-xl font-medium">
                          {director.name}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      onClick={handleWatchlistToggle}
                      className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                        inWatchlist
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25"
                          : "bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {inWatchlist ? "✅" : "➕"}
                        {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                    <button
                      onClick={handleFavoritesToggle}
                      className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                        inFavorites
                          ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25"
                          : "bg-gradient-to-r from-slate-600 to-slate-700 text-white border border-white/20 shadow-lg"
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {inFavorites ? "❤️" : "❤️"}
                        {inFavorites ? "Favorited" : "Add to Favorites"}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Fade Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent" />
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
