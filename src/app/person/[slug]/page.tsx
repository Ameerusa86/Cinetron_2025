"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Film,
  Tv,
  User,
  Calendar,
  MapPin,
  Globe,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import {
  usePersonDetailsBySlug,
  usePersonMovieCredits,
  usePersonTVCredits,
} from "@/hooks";
import tmdbClient from "@/lib/tmdb-client";
import { MediaCard, MediaGridSkeleton } from "@/components/media/MediaCard";

interface PersonDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function PersonDetailPage({ params }: PersonDetailPageProps) {
  const { slug } = React.use(params);
  const [activeTab, setActiveTab] = useState<"movies" | "tv">("movies");
  const [expandBio, setExpandBio] = useState(false);

  const {
    data: person,
    isLoading: personLoading,
    error: personError,
  } = usePersonDetailsBySlug(slug);
  const { data: movieCredits, isLoading: moviesLoading } =
    usePersonMovieCredits(slug);
  const { data: tvCredits, isLoading: tvLoading } = usePersonTVCredits(slug);

  const sortedMovieCredits = useMemo(() => {
    if (!movieCredits) return null;
    const sortByDateDesc = <T extends { release_date?: string }>(items: T[]) =>
      [...items].sort((a, b) => {
        const ta = a.release_date ? new Date(a.release_date).getTime() : 0;
        const tb = b.release_date ? new Date(b.release_date).getTime() : 0;
        return tb - ta;
      });

    return {
      cast: sortByDateDesc(movieCredits.cast).slice(0, 24),
      crew: sortByDateDesc(movieCredits.crew).slice(0, 24),
    };
  }, [movieCredits]);

  const sortedTVCredits = useMemo(() => {
    if (!tvCredits) return null;
    const sortByDateDesc = <T extends { first_air_date?: string }>(items: T[]) =>
      [...items].sort((a, b) => {
        const ta = a.first_air_date ? new Date(a.first_air_date).getTime() : 0;
        const tb = b.first_air_date ? new Date(b.first_air_date).getTime() : 0;
        return tb - ta;
      });

    return {
      cast: sortByDateDesc(tvCredits.cast).slice(0, 24),
      crew: sortByDateDesc(tvCredits.crew).slice(0, 24),
    };
  }, [tvCredits]);

  if (personLoading) return <PersonDetailSkeleton />;
  if (personError || !person) notFound();

  const calculateAge = (birthday: string, deathday?: string) => {
    const birth = new Date(birthday);
    const end = deathday ? new Date(deathday) : new Date();
    let age = end.getFullYear() - birth.getFullYear();
    const m = end.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) age--;
    return age;
  };

  const getGenderDisplay = (gender: number) => {
    switch (gender) {
      case 1:
        return "Female";
      case 2:
        return "Male";
      case 3:
        return "Non-binary";
      default:
        return "Not specified";
    }
  };

  const profileUrl = tmdbClient.getImageUrl(person.profile_path || null, "h632");
  const bioParagraphs = person.biography
    ? person.biography.split("\n\n").filter(Boolean)
    : [];
  const hasLongBio = bioParagraphs.length > 2;

  return (
    <div className="min-h-screen w-full">
      {/* Editorial Profile Header */}
      <section className="relative border-b border-border bg-card/40 pt-24 pb-14 lg:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(229,9,20,0.1),transparent_70%)]"
        />

        <div className="container-cinema relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Portrait */}
            <div className="lg:col-span-3">
              <div className="relative aspect-[3/4] w-56 sm:w-64 lg:w-full mx-auto lg:mx-0 overflow-hidden rounded-2xl border border-border bg-secondary shadow-2xl">
                {profileUrl ? (
                  <Image
                    src={profileUrl}
                    alt={person.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 256px, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <User className="h-14 w-14 opacity-40" />
                  </div>
                )}
              </div>
            </div>

            {/* Bio & Metadata */}
            <div className="lg:col-span-9 space-y-6">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{person.known_for_department || "Talent"}</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
                  {person.name}
                </h1>
              </div>

              {/* Personal Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {person.birthday && (
                  <div className="surface-card p-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>Born</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(person.birthday).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {!person.deathday && (
                        <span className="text-muted-foreground font-normal ml-1">
                          ({calculateAge(person.birthday)})
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {person.deathday && (
                  <div className="surface-card p-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Died</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(person.deathday).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {person.birthday && (
                        <span className="text-muted-foreground font-normal ml-1">
                          (Age {calculateAge(person.birthday, person.deathday)})
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {person.place_of_birth && (
                  <div className="surface-card p-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>Birthplace</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground line-clamp-1">
                      {person.place_of_birth}
                    </p>
                  </div>
                )}

                <div className="surface-card p-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    <span>Popularity · Gender</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground font-mono">
                    {person.popularity.toFixed(1)}{" "}
                    <span className="font-sans font-normal text-muted-foreground">
                      · {getGenderDisplay(person.gender)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Biography */}
              {bioParagraphs.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Biography
                  </h2>
                  <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-4xl">
                    {(expandBio ? bioParagraphs : bioParagraphs.slice(0, 2)).map(
                      (p, i) => (
                        <p key={i}>{p}</p>
                      )
                    )}
                  </div>
                  {hasLongBio && (
                    <button
                      type="button"
                      onClick={() => setExpandBio((prev) => !prev)}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      {expandBio ? "Show less" : "Read full biography"}
                    </button>
                  )}
                </div>
              )}

              {/* External Links */}
              {(person.homepage || person.imdb_id) && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {person.imdb_id && (
                    <a
                      href={`https://www.imdb.com/name/${person.imdb_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cinema-outline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>IMDb Profile</span>
                    </a>
                  )}
                  {person.homepage && (
                    <a
                      href={person.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cinema-outline"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Official Website</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filmography */}
      <section className="py-12">
        <div className="container-cinema">
          {/* Tabs */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-foreground">Filmography</h2>
            <div className="inline-flex rounded-xl border border-border bg-card p-1">
              <button
                type="button"
                onClick={() => setActiveTab("movies")}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "movies"
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Film className="h-4 w-4" />
                <span>Movies</span>
                {movieCredits && (
                  <span className="font-mono text-xs opacity-80">
                    ({movieCredits.cast.length + movieCredits.crew.length})
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tv")}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "tv"
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Tv className="h-4 w-4" />
                <span>TV Series</span>
                {tvCredits && (
                  <span className="font-mono text-xs opacity-80">
                    ({tvCredits.cast.length + tvCredits.crew.length})
                  </span>
                )}
              </button>
            </div>
          </div>

          {(moviesLoading || tvLoading) && <MediaGridSkeleton count={12} />}

          {/* Movie Credits */}
          {activeTab === "movies" && sortedMovieCredits && (
            <div className="space-y-12">
              {sortedMovieCredits.cast.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-5">
                    Acting Credits
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                    {sortedMovieCredits.cast.map((movie) => (
                      <MediaCard
                        key={movie.credit_id}
                        id={movie.id}
                        title={movie.title}
                        mediaType="movie"
                        imagePath={movie.poster_path}
                        rating={movie.vote_average}
                        subtitle={
                          movie.character
                            ? `${movie.release_date ? `${movie.release_date.slice(0, 4)} · ` : ""}as ${movie.character}`
                            : movie.release_date?.slice(0, 4) || "TBA"
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {sortedMovieCredits.crew.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-5">
                    Crew &amp; Directing Credits
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                    {sortedMovieCredits.crew.map((movie) => (
                      <MediaCard
                        key={movie.credit_id}
                        id={movie.id}
                        title={movie.title}
                        mediaType="movie"
                        imagePath={movie.poster_path}
                        rating={movie.vote_average}
                        subtitle={`${movie.release_date ? `${movie.release_date.slice(0, 4)} · ` : ""}${movie.job}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TV Credits */}
          {activeTab === "tv" && sortedTVCredits && (
            <div className="space-y-12">
              {sortedTVCredits.cast.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-5">
                    Acting Credits
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                    {sortedTVCredits.cast.map((show) => (
                      <MediaCard
                        key={show.credit_id}
                        id={show.id}
                        title={show.name}
                        mediaType="tv"
                        imagePath={show.poster_path}
                        rating={show.vote_average}
                        subtitle={
                          show.character
                            ? `${show.first_air_date ? `${show.first_air_date.slice(0, 4)} · ` : ""}as ${show.character}`
                            : show.first_air_date?.slice(0, 4) || "TBA"
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {sortedTVCredits.crew.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-5">
                    Crew Credits
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                    {sortedTVCredits.crew.map((show) => (
                      <MediaCard
                        key={show.credit_id}
                        id={show.id}
                        title={show.name}
                        mediaType="tv"
                        imagePath={show.poster_path}
                        rating={show.vote_average}
                        subtitle={`${show.first_air_date ? `${show.first_air_date.slice(0, 4)} · ` : ""}${show.job}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function PersonDetailSkeleton() {
  return (
    <div className="min-h-screen pt-28 pb-16 container-cinema">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3 aspect-[3/4] rounded-2xl bg-secondary skeleton-shimmer" />
        <div className="lg:col-span-9 space-y-5">
          <div className="h-12 w-1/2 rounded-xl bg-secondary skeleton-shimmer" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 rounded-xl bg-secondary skeleton-shimmer" />
            <div className="h-20 rounded-xl bg-secondary skeleton-shimmer" />
            <div className="h-20 rounded-xl bg-secondary skeleton-shimmer" />
          </div>
          <div className="h-32 rounded-xl bg-secondary skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
