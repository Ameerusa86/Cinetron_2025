"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Tv,
  Calendar,
  Clock,
  Star,
  User,
  Home,
} from "lucide-react";
import { useSeasonDetails, useTVShowDetailsBySlug } from "@/hooks";
import tmdbClient from "@/lib/tmdb-client";
import { createPersonSlug } from "@/lib/slug-utils";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

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

  const posterUrl = tmdbClient.getImageUrl(
    season.poster_path || tvShow.poster_path || null,
    "w500"
  );

  return (
    <div className="min-h-screen w-full">
      {/* Season Header */}
      <section className="relative border-b border-border bg-card/40 pt-24 pb-12 lg:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(229,9,20,0.1),transparent_70%)]"
        />

        <div className="container-cinema relative z-10">
          <Breadcrumb
            items={[
              { label: "Home", href: "/", icon: Home },
              { label: "TV Shows", href: "/tv-shows", icon: Tv },
              { label: tvShow.name, href: `/tv/${slug}` },
              { label: season.name },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Poster */}
            <div className="lg:col-span-3">
              <div className="relative aspect-[2/3] w-52 lg:w-full mx-auto lg:mx-0 overflow-hidden rounded-2xl border border-border bg-secondary shadow-xl">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={season.name}
                    fill
                    sizes="(max-width: 1024px) 208px, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <Tv className="h-10 w-10 opacity-40" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-9 space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono font-semibold text-primary">
                  SEASON {String(season.season_number).padStart(2, "0")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1 font-mono text-foreground">
                  <Tv className="h-3.5 w-3.5 text-muted-foreground" />
                  {season.episodes?.length || season.episode_count} Episodes
                </span>
                {season.air_date && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1 font-mono text-foreground">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {season.air_date.slice(0, 4)}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                  {season.name}
                </h1>
                <p className="mt-1.5 text-base text-muted-foreground">
                  <Link
                    href={`/tv/${slug}`}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {tvShow.name}
                  </Link>
                </p>
              </div>

              {season.overview && (
                <p className="max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {season.overview}
                </p>
              )}

              {/* Quick Season Switcher */}
              {tvShow.seasons && tvShow.seasons.filter((s) => s.season_number > 0).length > 1 && (
                <div className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Jump to Season
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tvShow.seasons
                      .filter((s) => s.season_number > 0)
                      .map((s) => (
                        <Link
                          key={s.id}
                          href={`/tv/${slug}/season/${s.season_number}`}
                          className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold border transition-colors ${
                            s.season_number === seasonNum
                              ? "border-primary bg-primary text-white"
                              : "border-border bg-card text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          S{String(s.season_number).padStart(2, "0")}
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Episodes List */}
      <section className="py-12">
        <div className="container-cinema space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Episodes
            </h2>
            <div className="space-y-4">
              {season.episodes.map((episode) => {
                const stillUrl = tmdbClient.getImageUrl(
                  episode.still_path,
                  "w500"
                );
                return (
                  <article
                    key={episode.id}
                    className="surface-card overflow-hidden grid grid-cols-1 md:grid-cols-12"
                  >
                    {/* Still Frame */}
                    <div className="md:col-span-4 lg:col-span-3 relative aspect-video md:aspect-auto md:min-h-[168px] bg-secondary">
                      {stillUrl ? (
                        <Image
                          src={stillUrl}
                          alt={episode.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <Tv className="h-7 w-7 opacity-40" />
                        </div>
                      )}
                      <div className="absolute top-2.5 left-2.5 rounded-md bg-black/80 px-2 py-0.5 font-mono text-xs font-bold text-white backdrop-blur-md">
                        E{String(episode.episode_number).padStart(2, "0")}
                      </div>
                    </div>

                    {/* Episode Content */}
                    <div className="md:col-span-8 lg:col-span-9 p-5 flex flex-col justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-foreground">
                            {episode.episode_number}. {episode.name}
                          </h3>
                          {episode.vote_average > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-amber-400 shrink-0">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {episode.vote_average.toFixed(1)}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
                          {episode.runtime && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {episode.runtime}m
                            </span>
                          )}
                          {episode.air_date && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(episode.air_date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          )}
                        </div>

                        {episode.overview && (
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {episode.overview}
                          </p>
                        )}
                      </div>

                      {episode.guest_stars && episode.guest_stars.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Guest:
                          </span>
                          {episode.guest_stars.slice(0, 4).map((guest) => (
                            <Link
                              key={`${episode.id}-${guest.id}`}
                              href={`/person/${createPersonSlug(
                                guest.name,
                                guest.id
                              )}`}
                              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-2.5 py-1 text-xs text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                            >
                              <span>{guest.name}</span>
                              {guest.character && (
                                <span className="text-muted-foreground">
                                  · {guest.character}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Season Cast */}
          {season.credits?.cast && season.credits.cast.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Season Cast
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {season.credits.cast.slice(0, 12).map((person) => {
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
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SeasonDetailSkeleton() {
  return (
    <div className="min-h-screen pt-28 pb-16 container-cinema">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 aspect-[2/3] rounded-2xl bg-secondary skeleton-shimmer" />
        <div className="lg:col-span-9 space-y-4">
          <div className="h-10 w-1/2 rounded-xl bg-secondary skeleton-shimmer" />
          <div className="h-4 w-full rounded bg-secondary skeleton-shimmer" />
          <div className="h-4 w-3/4 rounded bg-secondary skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
