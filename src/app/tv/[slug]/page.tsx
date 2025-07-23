"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useTVShowDetailsBySlug } from "@/hooks";
import tmdbClient from "@/lib/tmdb-client";
import { createTVShowSlug, createPersonSlug } from "@/lib/slug-utils";
import { useUserStore } from "@/stores";
import { useNotificationStore } from "@/stores";
import { Heart, Play, Share2 } from "lucide-react";

interface TVShowDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function TVShowDetailPage({ params }: TVShowDetailPageProps) {
  const { slug } = React.use(params);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const { data: tvShow, isLoading, error } = useTVShowDetailsBySlug(slug);

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
    return <TVShowDetailSkeleton />;
  }

  if (error || !tvShow) {
    notFound();
  }

  const inWatchlist = isInWatchlist(tvShow.id);
  const inFavorites = isInFavorites(tvShow.id);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(tvShow.id);
      addNotification({
        type: "success",
        title: "Removed from Watchlist",
        message: `"${tvShow.name}" has been removed from your watchlist.`,
        read: false,
      });
    } else {
      addToWatchlist({
        id: tvShow.id,
        type: "tv",
        status: "plan-to-watch",
        priority: "medium",
      });
      addNotification({
        type: "success",
        title: "Added to Watchlist",
        message: `"${tvShow.name}" has been added to your watchlist.`,
        read: false,
      });
    }
  };

  const handleFavoritesToggle = () => {
    if (inFavorites) {
      removeFromFavorites(tvShow.id);
      addNotification({
        type: "info",
        title: "Removed from Favorites",
        message: `"${tvShow.name}" has been removed from your favorites.`,
        read: false,
      });
    } else {
      addToFavorites(tvShow.id);
      addNotification({
        type: "success",
        title: "Added to Favorites",
        message: `"${tvShow.name}" has been added to your favorites.`,
        read: false,
      });
    }
  };

  // Get trailer or first video
  const trailer = tvShow.videos?.results?.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );
  const videos =
    tvShow.videos?.results?.filter((video) => video.site === "YouTube") || [];

  // Get creator and main cast
  const creators = tvShow.created_by || [];
  const mainCast = tvShow.credits?.cast.slice(0, 10) || [];

  // Format episode runtime
  const formatEpisodeRuntime = (runtime: number[]) => {
    if (!runtime || runtime.length === 0) return "Unknown";
    if (runtime.length === 1) return `${runtime[0]}min`;
    const min = Math.min(...runtime);
    const max = Math.max(...runtime);
    return min === max ? `${min}min` : `${min}-${max}min`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "returning series":
      case "in production":
        return "bg-green-600";
      case "ended":
        return "bg-red-600";
      case "canceled":
        return "bg-gray-600";
      default:
        return "bg-blue-600";
    }
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full">
      {/* Enhanced Premium Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Dynamic Background with Parallax Effect */}
        {tvShow.backdrop_path && (
          <div className="absolute inset-0">
            <Image
              src={
                tmdbClient.getImageUrl(tvShow.backdrop_path, "original") || ""
              }
              alt={tvShow.name}
              width={1920}
              height={1080}
              className="w-full h-full object-cover scale-110 hover:scale-105 transition-transform duration-[3s] ease-out"
              priority
            />
            {/* Enhanced Multi-Layer Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/20 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-cyan-900/20" />

            {/* Animated Overlay Effects */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400/60 rounded-full animate-pulse" />
              <div className="absolute top-40 right-32 w-1 h-1 bg-cyan-400/70 rounded-full animate-bounce" />
              <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-ping" />
              <div className="absolute top-60 left-1/3 w-1 h-1 bg-pink-400/60 rounded-full animate-pulse" />
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
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-blue-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <Image
                      src={
                        tmdbClient.getImageUrl(
                          tvShow.poster_path || null,
                          "w500"
                        ) || "/placeholder-poster.svg"
                      }
                      alt={tvShow.name}
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
                          {tvShow.vote_average.toFixed(1)}
                        </span>
                      </div>
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur-md opacity-60 -z-10"></div>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-2xl text-white font-semibold text-sm shadow-xl backdrop-blur-sm border border-white/20 ${getStatusColor(
                        tvShow.status
                      )}`}
                    >
                      {tvShow.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced TV Show Details Section */}
              <div className="lg:col-span-8 xl:col-span-9 text-white">
                <div className="space-y-8 max-w-5xl">
                  {/* Enhanced Title Section */}
                  <div className="space-y-4">
                    <h1 className="text-xl sm:text-3xl lg:text-4xl xl:text-6xl font-black leading-tight">
                      <span
                        className="bg-gradient-to-r from-purple-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent drop-shadow-2xl"
                        style={{
                          textShadow: "0 0 40px rgba(168, 85, 247, 0.4)",
                        }}
                      >
                        {tvShow.name}
                      </span>
                    </h1>

                    {tvShow.tagline && (
                      <p className="text-xl lg:text-2xl xl:text-3xl text-slate-300 italic font-light tracking-wide">
                        &ldquo;{tvShow.tagline}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Compact Transparent Meta Information Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-black/30 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-center transition-all duration-300 hover:bg-black/40">
                      <div className="text-lg mb-0.5">📺</div>
                      <div className="font-semibold text-sm">
                        {tvShow.number_of_seasons}
                      </div>
                      <div className="text-[10px] text-slate-400">Seasons</div>
                    </div>

                    <div className="bg-black/30 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-center transition-all duration-300 hover:bg-black/40">
                      <div className="text-lg mb-0.5">🎬</div>
                      <div className="font-semibold text-sm">
                        {tvShow.number_of_episodes}
                      </div>
                      <div className="text-[10px] text-slate-400">Episodes</div>
                    </div>

                    <div className="bg-black/30 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-center transition-all duration-300 hover:bg-black/40">
                      <div className="text-lg mb-0.5">🕐</div>
                      <div className="font-semibold text-sm">
                        {formatEpisodeRuntime(tvShow.episode_run_time)}
                      </div>
                      <div className="text-[10px] text-slate-400">Runtime</div>
                    </div>

                    <div className="bg-black/30 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-center transition-all duration-300 hover:bg-black/40">
                      <div className="text-lg mb-0.5">👥</div>
                      <div className="font-semibold text-sm">
                        {tvShow.vote_count.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">Votes</div>
                    </div>
                  </div>

                  {/* Compact Show Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-black/30 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-black/40">
                      <div className="text-slate-400 text-xs mb-1">
                        First Aired
                      </div>
                      <div className="text-sm font-semibold">
                        {new Date(tvShow.first_air_date).toLocaleDateString()}
                      </div>
                    </div>

                    {tvShow.last_air_date && (
                      <div className="bg-black/30 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-black/40">
                        <div className="text-slate-400 text-xs mb-1">
                          Last Aired
                        </div>
                        <div className="text-sm font-semibold">
                          {new Date(tvShow.last_air_date).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Compact Transparent Genres Grid */}
                  {tvShow.genres.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-slate-300">
                        Genres
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {tvShow.genres.map((genre, index) => (
                          <span
                            key={genre.id}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-300 hover:scale-105 ${
                              index % 3 === 0
                                ? "bg-purple-600/20 border-purple-400/30 text-purple-300 hover:bg-purple-600/30"
                                : index % 3 === 1
                                ? "bg-cyan-600/20 border-cyan-400/30 text-cyan-300 hover:bg-cyan-600/30"
                                : "bg-blue-600/20 border-blue-400/30 text-blue-300 hover:bg-blue-600/30"
                            }`}
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Compact Transparent Description */}
                {tvShow.overview && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-300">
                      Overview
                    </h3>
                    <p className="text-sm lg:text-base text-slate-200 leading-relaxed bg-black/30 backdrop-blur-md border border-white/10 p-4 rounded-xl transition-all duration-300 hover:bg-black/40">
                      {tvShow.overview}
                    </p>
                  </div>
                )}

                {/* Compact Transparent Creators */}
                {creators.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-300">
                      Created By
                    </h3>
                    <div className="bg-black/30 backdrop-blur-md border border-white/10 p-3 rounded-xl transition-all duration-300 hover:bg-black/40">
                      <p className="text-sm text-white font-medium">
                        {creators.map((creator) => creator.name).join(", ")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Compact Transparent Networks */}
                {tvShow.networks && tvShow.networks.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-300">
                      Network
                    </h3>
                    <div className="bg-black/30 backdrop-blur-md border border-white/10 p-3 rounded-xl transition-all duration-300 hover:bg-black/40">
                      <p className="text-sm text-white font-medium">
                        {tvShow.networks
                          .map((network) => network.name)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Premium Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  {trailer && (
                    <button
                      onClick={() => setSelectedVideo(trailer.key)}
                      className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Play className="w-5 h-5" />
                        Watch Trailer
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  )}

                  <button
                    onClick={handleWatchlistToggle}
                    className={`group relative overflow-hidden backdrop-blur-xl border transition-all duration-300 hover:scale-105 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl ${
                      inWatchlist
                        ? "bg-gradient-to-r from-green-600/20 to-green-700/20 border-green-400/30 hover:bg-green-600/30"
                        : "bg-slate-800/80 hover:bg-slate-700/80 border-white/20 hover:border-white/30"
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      {inWatchlist ? "In Watchlist" : "Add to List"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>

                  <button
                    onClick={handleFavoritesToggle}
                    className={`group relative overflow-hidden backdrop-blur-xl border transition-all duration-300 hover:scale-105 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl ${
                      inFavorites
                        ? "bg-gradient-to-r from-red-600/20 to-red-700/20 border-red-400/30 hover:bg-red-600/30"
                        : "bg-slate-800/80 hover:bg-slate-700/80 border-white/20 hover:border-white/30"
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      {inFavorites ? "Favorited" : "Add to Favorites"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>

                  <button className="group relative overflow-hidden bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-xl border border-white/20 hover:border-white/30 text-white px-6 py-4 rounded-2xl font-semibold shadow-xl transition-all duration-300 hover:scale-105">
                    <span className="relative z-10 flex items-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Share
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TV Show Details Sections */}
      <div className="w-full">
        {/* Seasons Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="w-full">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white mb-8">
              📺 Seasons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tvShow.seasons
                .filter((season) => season.season_number > 0) // Filter out "Specials" (season 0)
                .map((season) => (
                  <Link
                    key={season.id}
                    href={`/tv/${slug}/season/${season.season_number}`}
                    className="card-premium group cursor-pointer hover:scale-105 transition-all duration-300"
                  >
                    <div className="aspect-[2/3] relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src={
                          tmdbClient.getImageUrl(
                            season.poster_path || null,
                            "w300"
                          ) || "/placeholder-poster.svg"
                        }
                        alt={season.name}
                        width={200}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-poster.svg";
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Season {season.season_number}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Click Indicator */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <span className="text-white text-lg">
                            👁️ View Episodes
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                        {season.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {season.episode_count} Episode
                        {season.episode_count > 1 ? "s" : ""}
                      </p>
                      {season.air_date && (
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Aired: {new Date(season.air_date).getFullYear()}
                        </p>
                      )}
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 line-clamp-3">
                        {season.overview || "No overview available."}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>

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
                      src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                      alt={video.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      onError={(e) => {
                        // Fallback to high quality thumbnail if maxres fails
                        e.currentTarget.src = `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`;
                      }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-purple-600/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:bg-purple-500">
                        <span className="text-white text-2xl ml-1">▶</span>
                      </div>
                    </div>

                    {/* Video Duration Badge (if available) */}
                    <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.type === "Trailer"
                        ? "TRAILER"
                        : video.type.toUpperCase()}
                    </div>

                    {/* Title and Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
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

        {/* TV Show Stats */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="w-full">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white mb-8">
              📊 Show Statistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-cinema p-6 text-center">
                <div className="text-3xl mb-3">📺</div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {tvShow.number_of_episodes}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Total Episodes
                </div>
              </div>

              <div className="card-cinema p-6 text-center">
                <div className="text-3xl mb-3">🎬</div>
                <div className="text-2xl font-bold text-pink-600 mb-1">
                  {tvShow.number_of_seasons}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Seasons
                </div>
              </div>

              <div className="card-cinema p-6 text-center">
                <div className="text-3xl mb-3">⭐</div>
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {tvShow.vote_average.toFixed(1)}/10
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  {tvShow.vote_count.toLocaleString()} votes
                </div>
              </div>

              <div className="card-cinema p-6 text-center">
                <div className="text-3xl mb-3">🌍</div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {tvShow.popularity.toFixed(0)}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Popularity
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Similar TV Shows */}
        {tvShow.similar && tvShow.similar.results.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="w-full">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white mb-8">
                🎯 Similar Shows
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
                {tvShow.similar.results.slice(0, 8).map((similarShow) => (
                  <Link
                    key={similarShow.id}
                    href={`/tv/${createTVShowSlug(
                      similarShow.name,
                      similarShow.id
                    )}`}
                    className="group"
                  >
                    <div className="aspect-[2/3] relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <Image
                        src={
                          tmdbClient.getImageUrl(
                            similarShow.poster_path || null,
                            "w300"
                          ) || "/placeholder-poster.svg"
                        }
                        alt={similarShow.name}
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
                          {similarShow.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <span>⭐ {similarShow.vote_average.toFixed(1)}</span>
                          <span>•</span>
                          <span>
                            {new Date(similarShow.first_air_date).getFullYear()}
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
              className="absolute -top-12 right-0 text-white hover:text-purple-400 text-2xl transition-colors duration-200"
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
function TVShowDetailSkeleton() {
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
