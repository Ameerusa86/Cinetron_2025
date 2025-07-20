"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useTVShowDetailsBySlug } from "@/hooks";
import tmdbClient from "@/lib/tmdb-client";
import { createTVShowSlug, createPersonSlug } from "@/lib/slug-utils";

interface TVShowDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function TVShowDetailPage({ params }: TVShowDetailPageProps) {
  const { slug } = React.use(params);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const { data: tvShow, isLoading, error } = useTVShowDetailsBySlug(slug);

  if (isLoading) {
    return <TVShowDetailSkeleton />;
  }

  if (error || !tvShow) {
    notFound();
  }

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
      {/* Hero Section with Backdrop */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Backdrop Image */}
        {tvShow.backdrop_path && (
          <div className="absolute inset-0">
            <Image
              src={
                tmdbClient.getImageUrl(tvShow.backdrop_path, "original") || ""
              }
              alt={tvShow.name}
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

        {/* TV Show Information */}
        <div className="relative z-10 h-full flex items-center px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Poster */}
            <div className="lg:col-span-2">
              <div className="aspect-[2/3] w-full max-w-md mx-auto lg:max-w-none relative overflow-hidden rounded-2xl shadow-2xl">
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

            {/* TV Show Details */}
            <div className="lg:col-span-3 text-white text-center lg:text-left">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-4">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {tvShow.name}
                    </span>
                  </h1>
                  {tvShow.tagline && (
                    <p className="text-xl lg:text-2xl text-slate-300 italic">
                      &ldquo;{tvShow.tagline}&rdquo;
                    </p>
                  )}
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-lg">
                  <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full">
                    <span>⭐</span>
                    <span className="font-bold text-yellow-400">
                      {tvShow.vote_average.toFixed(1)}
                    </span>
                    <span className="text-slate-300">
                      ({tvShow.vote_count.toLocaleString()})
                    </span>
                  </div>
                  <div className="bg-black/50 px-4 py-2 rounded-full">
                    <span>
                      🕐 {formatEpisodeRuntime(tvShow.episode_run_time)}
                    </span>
                  </div>
                  <div className="bg-black/50 px-4 py-2 rounded-full">
                    <span>
                      📅 {new Date(tvShow.first_air_date).getFullYear()}
                    </span>
                    {tvShow.last_air_date && tvShow.status === "Ended" && (
                      <span>
                        {" "}
                        - {new Date(tvShow.last_air_date).getFullYear()}
                      </span>
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-white text-sm font-medium ${getStatusColor(
                      tvShow.status
                    )}`}
                  >
                    {tvShow.status}
                  </div>
                </div>

                {/* Series Info */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-lg">
                  <div className="bg-purple-600/20 border border-purple-400/30 px-4 py-2 rounded-full text-purple-300">
                    🎬 {tvShow.number_of_seasons} Season
                    {tvShow.number_of_seasons > 1 ? "s" : ""}
                  </div>
                  <div className="bg-pink-600/20 border border-pink-400/30 px-4 py-2 rounded-full text-pink-300">
                    📺 {tvShow.number_of_episodes} Episodes
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {tvShow.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 px-4 py-2 rounded-full text-purple-300 text-sm font-medium backdrop-blur-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <div className="max-w-3xl">
                  <p className="text-lg lg:text-xl text-slate-200 leading-relaxed">
                    {tvShow.overview}
                  </p>
                </div>

                {/* Creators */}
                {creators.length > 0 && (
                  <div>
                    <p className="text-slate-300">
                      <span className="font-semibold">Created by:</span>{" "}
                      <span className="text-white">
                        {creators.map((creator) => creator.name).join(", ")}
                      </span>
                    </p>
                  </div>
                )}

                {/* Networks */}
                {tvShow.networks && tvShow.networks.length > 0 && (
                  <div>
                    <p className="text-slate-300">
                      <span className="font-semibold">Network:</span>{" "}
                      <span className="text-white">
                        {tvShow.networks
                          .map((network) => network.name)
                          .join(", ")}
                      </span>
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {trailer && (
                    <button
                      onClick={() => setSelectedVideo(trailer.key)}
                      className="btn-cinema flex items-center justify-center gap-2 text-lg px-8 py-4"
                    >
                      ▶️ Watch Trailer
                    </button>
                  )}
                  <button className="btn-cinema-outline flex items-center justify-center gap-2 text-lg px-8 py-4">
                    ➕ Add to Watchlist
                  </button>
                  <button className="btn-glass flex items-center justify-center gap-2 text-lg px-8 py-4">
                    💝 Add to Favorites
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
