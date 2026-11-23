"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Play,
  Bookmark,
  Check,
  Heart,
  Share2,
  Star,
  Clock,
  Tv,
  Layers,
  Users,
  Calendar,
  ArrowRight,
  User,
} from "lucide-react";
import { useTVShowDetailsBySlug } from "@/hooks";
import tmdbClient from "@/lib/tmdb-client";
import { createPersonSlug } from "@/lib/slug-utils";
import { useUserStore, useNotificationStore } from "@/stores";
import { MediaCard } from "@/components/media/MediaCard";
import { TrailerModal } from "@/components/media/TrailerModal";
import { WatchProviders } from "@/components/features/WatchProviders";
import { MockReviews } from "@/components/features/MockReviews";

interface TVShowDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function TVShowDetailPage({ params }: TVShowDetailPageProps) {
  const { slug } = React.use(params);
  const [selectedVideo, setSelectedVideo] = useState<{
    key: string;
    name: string;
  } | null>(null);

  const { data: tvShow, isLoading, error } = useTVShowDetailsBySlug(slug);

  const {
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    isInWatchlist,
    isInFavorites,
  } = useUserStore();
  const { addNotification } = useNotificationStore();

  if (isLoading) return <TVShowDetailSkeleton />;
  if (error || !tvShow) notFound();

  const inWatchlist = isInWatchlist(tvShow.id);
  const inFavorites = isInFavorites(tvShow.id);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(tvShow.id);
      addNotification({
        type: "info",
        title: "Removed from Watchlist",
        message: `"${tvShow.name}" removed from your watchlist.`,
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
        message: `"${tvShow.name}" added to your watchlist.`,
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
        message: `"${tvShow.name}" removed from favorites.`,
        read: false,
      });
    } else {
      addToFavorites(tvShow.id);
      addNotification({
        type: "success",
        title: "Added to Favorites",
        message: `"${tvShow.name}" added to favorites.`,
        read: false,
      });
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({
          title: tvShow.name,
          text: tvShow.tagline || `Check out ${tvShow.name} on Cinetron`,
          url,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        addNotification({
          type: "success",
          title: "Link Copied",
          message: "Series link copied to your clipboard.",
          read: false,
        });
      }
    } catch {
      // User dismissed share sheet
    }
  };

  const videos =
    tvShow.videos?.results?.filter((v) => v.site === "YouTube") || [];
  const trailer =
    videos.find((v) => v.type === "Trailer" && v.official) ||
    videos.find((v) => v.type === "Trailer") ||
    videos[0];

  const creators = tvShow.created_by || [];
  const mainCast = tvShow.credits?.cast.slice(0, 12) || [];
  const regularSeasons =
    tvShow.seasons?.filter((s) => s.season_number > 0) || [];

  const formatEpisodeRuntime = (runtime: number[]) => {
    if (!runtime || runtime.length === 0) return "TBA";
    const min = Math.min(...runtime);
    const max = Math.max(...runtime);
    return min === max ? `${min}m` : `${min}–${max}m`;
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "returning series":
      case "in production":
        return "border-emerald-500/35 bg-emerald-500/15 text-emerald-300";
      case "ended":
        return "border-zinc-500/35 bg-zinc-500/15 text-zinc-300";
      case "canceled":
        return "border-rose-500/35 bg-rose-500/15 text-rose-300";
      default:
        return "border-sky-500/35 bg-sky-500/15 text-sky-300";
    }
  };

  const backdropUrl = tmdbClient.getImageUrl(tvShow.backdrop_path, "original");
  const posterUrl = tmdbClient.getImageUrl(tvShow.poster_path, "w500");

  return (
    <div className="min-h-screen w-full">
      {/* ============================================================
          CINEMATIC TV HERO
         ============================================================ */}
      <section className="relative w-full overflow-hidden bg-[#09090b] pt-24 pb-14 lg:pt-28 lg:pb-20">
        {backdropUrl && (
          <div className="absolute inset-0">
            <Image
              src={backdropUrl}
              alt={tvShow.name}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/75 to-[#09090b]/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/95 via-[#09090b]/60 to-transparent" />
          </div>
        )}

        <div className="container-cinema relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            {/* Poster */}
            <div className="lg:col-span-3">
              <div className="relative aspect-[2/3] w-56 sm:w-64 lg:w-full mx-auto lg:mx-0 overflow-hidden rounded-2xl border border-white/15 bg-zinc-900 shadow-2xl">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={tvShow.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 256px, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-500">
                    <Tv className="h-12 w-12" />
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-9 text-white space-y-6">
              {/* Top Meta Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {tvShow.status && (
                  <span
                    className={`rounded-lg border px-2.5 py-1 font-semibold ${getStatusStyle(
                      tvShow.status
                    )}`}
                  >
                    {tvShow.status}
                  </span>
                )}
                {tvShow.vote_average > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-500/15 px-2.5 py-1 font-semibold text-amber-300">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-mono">
                      {tvShow.vote_average.toFixed(1)}
                    </span>
                    <span className="text-amber-300/70 font-normal">
                      ({tvShow.vote_count.toLocaleString()})
                    </span>
                  </span>
                )}
                {tvShow.first_air_date && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-zinc-200 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    {tvShow.first_air_date.slice(0, 4)}
                    {tvShow.last_air_date &&
                    tvShow.last_air_date.slice(0, 4) !==
                      tvShow.first_air_date.slice(0, 4)
                      ? `–${tvShow.last_air_date.slice(0, 4)}`
                      : ""}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-zinc-200 font-mono">
                  <Layers className="h-3.5 w-3.5 text-zinc-400" />
                  {tvShow.number_of_seasons}{" "}
                  {tvShow.number_of_seasons === 1 ? "Season" : "Seasons"}
                </span>
                {tvShow.episode_run_time?.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-zinc-200 font-mono">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                    {formatEpisodeRuntime(tvShow.episode_run_time)}
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.06]">
                  {tvShow.name}
                </h1>
                {tvShow.tagline && (
                  <p className="mt-2.5 font-display italic text-lg sm:text-xl text-zinc-300">
                    &ldquo;{tvShow.tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Genres */}
              {tvShow.genres && tvShow.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tvShow.genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href="/tv-shows"
                      className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-zinc-100 hover:bg-white/20 transition-colors"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Overview */}
              {tvShow.overview && (
                <p className="max-w-3xl text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {tvShow.overview}
                </p>
              )}

              {/* Creators & Network */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
                {creators.length > 0 && (
                  <div>
                    Created by{" "}
                    <span className="font-semibold text-white">
                      {creators.map((c) => c.name).join(", ")}
                    </span>
                  </div>
                )}
                {tvShow.networks && tvShow.networks.length > 0 && (
                  <div>
                    Network:{" "}
                    <span className="font-semibold text-white">
                      {tvShow.networks.map((n) => n.name).join(", ")}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {trailer && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedVideo({ key: trailer.key, name: trailer.name })
                    }
                    className="btn-cinema px-6 py-3"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>Watch Trailer</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleWatchlistToggle}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold border transition-colors cursor-pointer ${
                    inWatchlist
                      ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                      : "border-white/15 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                  }`}
                >
                  {inWatchlist ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  <span>{inWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleFavoritesToggle}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold border transition-colors cursor-pointer ${
                    inFavorites
                      ? "border-rose-500/40 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                      : "border-white/15 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${inFavorites ? "fill-rose-400 text-rose-400" : ""}`}
                  />
                  <span>{inFavorites ? "Favorited" : "Favorite"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share TV show"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-colors cursor-pointer"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          TV SHOW BODY
         ============================================================ */}
      <div className="container-cinema py-12 space-y-14">
        {/* Show Metrics */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Seasons", value: String(tvShow.number_of_seasons), icon: Layers },
            { label: "Total Episodes", value: String(tvShow.number_of_episodes), icon: Tv },
            {
              label: "Audience Score",
              value: `${tvShow.vote_average.toFixed(1)} / 10`,
              sub: `${tvShow.vote_count.toLocaleString()} votes`,
              icon: Star,
            },
            { label: "Popularity", value: tvShow.popularity.toFixed(0), icon: Users },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="surface-card p-5">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-foreground">
                  {stat.value}
                </p>
                {stat.sub && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stat.sub}
                  </p>
                )}
              </div>
            );
          })}
        </section>

        {/* Seasons Grid */}
        {regularSeasons.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Seasons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {regularSeasons.map((season) => {
                const seasonPoster = tmdbClient.getImageUrl(
                  season.poster_path || tvShow.poster_path || null,
                  "w342"
                );
                return (
                  <Link
                    key={season.id}
                    href={`/tv/${slug}/season/${season.season_number}`}
                    className="group surface-card-interactive overflow-hidden flex flex-col"
                  >
                    <div className="relative aspect-[16/10] w-full bg-secondary overflow-hidden">
                      {seasonPoster ? (
                        <Image
                          src={seasonPoster}
                          alt={season.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <Tv className="h-8 w-8 opacity-40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 rounded-md bg-black/75 px-2.5 py-1 font-mono text-xs font-semibold text-white backdrop-blur-md">
                        S{String(season.season_number).padStart(2, "0")}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-200">
                        <span className="font-mono">
                          {season.episode_count}{" "}
                          {season.episode_count === 1 ? "Episode" : "Episodes"}
                        </span>
                        {season.air_date && (
                          <span className="font-mono">
                            {season.air_date.slice(0, 4)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {season.name}
                        </h3>
                        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {season.overview ||
                            `Explore all ${season.episode_count} episodes of ${season.name}.`}
                        </p>
                      </div>
                      <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        <span>View Episodes</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Series Cast */}
        {mainCast.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Series Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mainCast.map((person) => {
                const avatar = tmdbClient.getImageUrl(
                  person.profile_path || null,
                  "w300"
                );
                return (
                  <Link
                    key={person.credit_id || person.id}
                    href={`/person/${createPersonSlug(person.name, person.id)}`}
                    className="group surface-card-interactive overflow-hidden"
                  >
                    <div className="relative aspect-[3/4] w-full bg-secondary overflow-hidden">
                      {avatar ? (
                        <Image
                          src={avatar}
                          alt={person.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 18vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <User className="h-8 w-8 opacity-40" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {person.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {person.character}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Videos & Trailers */}
        {videos.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Videos &amp; Trailers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {videos.slice(0, 6).map((video) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() =>
                    setSelectedVideo({ key: video.key, name: video.name })
                  }
                  className="group relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-secondary text-left cursor-pointer"
                >
                  <Image
                    src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                    alt={video.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/15" />

                  <div className="absolute top-3 right-3 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    {video.type}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-white shadow-lg transition-transform duration-200 group-hover:scale-110">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3.5 right-3.5">
                    <p className="text-sm font-semibold text-white line-clamp-1">
                      {video.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Where to Watch (TV) */}
        <WatchProviders tvId={tvShow.id} />

        {/* Real TMDB + Community Reviews */}
        <MockReviews movieId={tvShow.id} tmdbReviews={tvShow.reviews?.results || []} />

        {/* Similar Series */}
        {tvShow.similar && tvShow.similar.results.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Similar Series
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {tvShow.similar.results.slice(0, 12).map((sim) => (
                <MediaCard
                  key={sim.id}
                  id={sim.id}
                  title={sim.name}
                  mediaType="tv"
                  imagePath={sim.poster_path}
                  rating={sim.vote_average}
                  year={sim.first_air_date}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <TrailerModal
        videoKey={selectedVideo?.key || null}
        title={selectedVideo?.name || `${tvShow.name} — Trailer`}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}

function TVShowDetailSkeleton() {
  return (
    <div className="min-h-screen w-full pt-24 pb-16">
      <div className="container-cinema">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-3">
            <div className="aspect-[2/3] w-56 lg:w-full mx-auto rounded-2xl bg-secondary skeleton-shimmer" />
          </div>
          <div className="lg:col-span-9 space-y-5">
            <div className="h-6 w-48 rounded-lg bg-secondary skeleton-shimmer" />
            <div className="h-12 w-3/4 rounded-xl bg-secondary skeleton-shimmer" />
            <div className="h-4 w-full max-w-2xl rounded bg-secondary skeleton-shimmer" />
            <div className="h-4 w-2/3 max-w-xl rounded bg-secondary skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
