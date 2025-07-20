"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useSeasonDetails, useTVShowDetailsBySlug } from "@/hooks";
import tmdbClient from "@/lib/tmdb-client";
import { createPersonSlug } from "@/lib/slug-utils";

interface SeasonDetailPageProps {
  params: Promise<{
    slug: string;
    seasonNumber: string;
  }>;
}

export default function SeasonDetailPage({ params }: SeasonDetailPageProps) {
  const { slug, seasonNumber } = React.use(params);
  const seasonNum = parseInt(seasonNumber, 10);

  const {
    data: tvShow,
    isLoading: isLoadingShow,
    error: showError,
  } = useTVShowDetailsBySlug(slug);

  const {
    data: season,
    isLoading: isLoadingSeason,
    error: seasonError,
  } = useSeasonDetails(slug, seasonNum);

  if (isLoadingShow || isLoadingSeason) {
    return <SeasonDetailSkeleton />;
  }

  if (showError || seasonError || !tvShow || !season) {
    notFound();
  }

  const formatEpisodeRuntime = (runtime: number | null) => {
    if (!runtime) return "Unknown";
    return `${runtime}min`;
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full">
      {/* Season Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12 bg-gradient-to-br from-purple-900/20 via-slate-900/10 to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href={`/tv/${slug}`}
              className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              ← Back to {tvShow.name}
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
            {/* Season Poster */}
            <div className="lg:col-span-1">
              <div className="aspect-[2/3] relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={
                    tmdbClient.getImageUrl(season.poster_path, "w500") ||
                    "/placeholder-poster.svg"
                  }
                  alt={season.name}
                  width={400}
                  height={600}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-poster.svg";
                  }}
                />
              </div>
            </div>

            {/* Season Info */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gradient-premium mb-4">
                    {season.name}
                  </h1>
                  <p className="text-xl text-slate-300">
                    {tvShow.name} • Season {season.season_number}
                  </p>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-4 text-lg">
                  <div className="bg-black/50 px-4 py-2 rounded-full">
                    <span>📺 {season.episode_count} Episodes</span>
                  </div>
                  {season.air_date && (
                    <div className="bg-black/50 px-4 py-2 rounded-full">
                      <span>📅 {new Date(season.air_date).getFullYear()}</span>
                    </div>
                  )}
                </div>

                {/* Overview */}
                {season.overview && (
                  <div className="max-w-4xl">
                    <p className="text-lg lg:text-xl text-slate-200 leading-relaxed">
                      {season.overview}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Episodes Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white mb-8">
            📋 Episodes
          </h2>
          <div className="space-y-6">
            {season.episodes.map((episode) => (
              <div
                key={episode.id}
                className="card-premium group hover:shadow-2xl transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Episode Still */}
                  <div className="lg:col-span-1">
                    <div className="aspect-video relative overflow-hidden rounded-xl">
                      <Image
                        src={
                          tmdbClient.getImageUrl(episode.still_path, "w300") ||
                          "/placeholder-episode.svg"
                        }
                        alt={episode.name}
                        width={300}
                        height={169}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-episode.svg";
                        }}
                      />
                      {/* Episode Number Badge */}
                      <div className="absolute top-2 left-2 bg-purple-600 text-white text-sm font-bold px-2 py-1 rounded">
                        E{episode.episode_number}
                      </div>
                    </div>
                  </div>

                  {/* Episode Info */}
                  <div className="lg:col-span-3 p-4">
                    <div className="space-y-4">
                      {/* Title and Meta */}
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                          {episode.name}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span>Episode {episode.episode_number}</span>
                          <span>•</span>
                          <span>{formatEpisodeRuntime(episode.runtime)}</span>
                          {episode.air_date && (
                            <>
                              <span>•</span>
                              <span>
                                {new Date(
                                  episode.air_date
                                ).toLocaleDateString()}
                              </span>
                            </>
                          )}
                          {episode.vote_average > 0 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                ⭐ {episode.vote_average.toFixed(1)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Overview */}
                      {episode.overview && (
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                          {episode.overview}
                        </p>
                      )}

                      {/* Guest Stars */}
                      {episode.guest_stars &&
                        episode.guest_stars.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                              Guest Stars:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {episode.guest_stars.slice(0, 4).map((guest) => (
                                <Link
                                  key={guest.id}
                                  href={`/person/${createPersonSlug(
                                    guest.name,
                                    guest.id
                                  )}`}
                                  className="inline-flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full px-3 py-1 text-xs transition-colors duration-200"
                                >
                                  {guest.profile_path && (
                                    <Image
                                      src={
                                        tmdbClient.getImageUrl(
                                          guest.profile_path,
                                          "w45"
                                        ) || "/placeholder-avatar.svg"
                                      }
                                      alt={guest.name}
                                      width={16}
                                      height={16}
                                      className="w-4 h-4 rounded-full object-cover"
                                    />
                                  )}
                                  <span>{guest.name}</span>
                                  <span className="text-slate-500 dark:text-slate-400">
                                    as {guest.character}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Season Cast */}
      {season.credits?.cast && season.credits.cast.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white mb-8">
              🎭 Season Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
              {season.credits.cast.slice(0, 16).map((person) => (
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
      )}
    </div>
  );
}

// Loading skeleton component
function SeasonDetailSkeleton() {
  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full animate-pulse">
      <div className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="lg:col-span-1">
              <div className="aspect-[2/3] bg-slate-300 dark:bg-slate-700 rounded-2xl" />
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
    </div>
  );
}
