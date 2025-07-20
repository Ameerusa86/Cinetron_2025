"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  usePersonDetailsBySlug,
  usePersonMovieCredits,
  usePersonTVCredits,
} from "@/hooks";
import tmdbClient from "@/lib/tmdb-client";
import { createMovieSlug, createTVShowSlug } from "@/lib/slug-utils";

interface PersonDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function PersonDetailPage({ params }: PersonDetailPageProps) {
  const { slug } = React.use(params);
  const [activeTab, setActiveTab] = useState<"movies" | "tv">("movies");

  const {
    data: person,
    isLoading: personLoading,
    error: personError,
  } = usePersonDetailsBySlug(slug);
  const { data: movieCredits, isLoading: moviesLoading } =
    usePersonMovieCredits(slug);
  const { data: tvCredits, isLoading: tvLoading } = usePersonTVCredits(slug);

  if (personLoading) {
    return <PersonDetailSkeleton />;
  }

  if (personError || !person) {
    notFound();
  }

  // Calculate age
  const calculateAge = (birthday: string, deathday?: string) => {
    const birth = new Date(birthday);
    const death = deathday ? new Date(deathday) : new Date();
    const age = death.getFullYear() - birth.getFullYear();
    const monthDiff = death.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && death.getDate() < birth.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  // Get gender display
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

  // Sort and filter credits
  const sortedMovieCredits = movieCredits
    ? {
        cast: movieCredits.cast
          .sort(
            (a, b) =>
              new Date(b.release_date || "1900-01-01").getTime() -
              new Date(a.release_date || "1900-01-01").getTime()
          )
          .slice(0, 20),
        crew: movieCredits.crew
          .sort(
            (a, b) =>
              new Date(b.release_date || "1900-01-01").getTime() -
              new Date(a.release_date || "1900-01-01").getTime()
          )
          .slice(0, 20),
      }
    : null;

  const sortedTVCredits = tvCredits
    ? {
        cast: tvCredits.cast
          .sort(
            (a, b) =>
              new Date(b.first_air_date || "1900-01-01").getTime() -
              new Date(a.first_air_date || "1900-01-01").getTime()
          )
          .slice(0, 20),
        crew: tvCredits.crew
          .sort(
            (a, b) =>
              new Date(b.first_air_date || "1900-01-01").getTime() -
              new Date(a.first_air_date || "1900-01-01").getTime()
          )
          .slice(0, 20),
      }
    : null;

  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-purple-900 dark:via-purple-700 dark:to-pink-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-12 py-16 w-full">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
              {/* Profile Photo */}
              <div className="lg:col-span-1">
                <div className="aspect-[3/4] w-full max-w-sm mx-auto lg:max-w-none relative overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src={
                      tmdbClient.getImageUrl(
                        person.profile_path || null,
                        "h632"
                      ) || "/placeholder-avatar.svg"
                    }
                    alt={person.name}
                    width={400}
                    height={600}
                    className="w-full h-full object-cover"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-avatar.svg";
                    }}
                  />
                  {/* 3D Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
                </div>
              </div>

              {/* Person Details */}
              <div className="lg:col-span-2 text-slate-900 dark:text-white text-center lg:text-left">
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
                      <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                        {person.name}
                      </span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-purple-200">
                      {person.known_for_department}
                    </p>
                  </div>

                  {/* Personal Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {person.birthday && (
                      <div className="bg-slate-100/80 dark:bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-slate-600 dark:text-purple-200 font-semibold mb-1">
                          Birthday
                        </div>
                        <div className="text-slate-900 dark:text-white">
                          {new Date(person.birthday).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                          {!person.deathday && (
                            <span className="text-slate-600 dark:text-purple-200 ml-2">
                              (Age {calculateAge(person.birthday)})
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {person.deathday && (
                      <div className="bg-slate-100/80 dark:bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-slate-600 dark:text-purple-200 font-semibold mb-1">
                          Death
                        </div>
                        <div className="text-slate-900 dark:text-white">
                          {new Date(person.deathday).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                          {person.birthday && (
                            <span className="text-slate-600 dark:text-purple-200 ml-2">
                              (Age{" "}
                              {calculateAge(person.birthday, person.deathday)})
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="bg-slate-100/80 dark:bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-slate-600 dark:text-purple-200 font-semibold mb-1">
                        Gender
                      </div>
                      <div className="text-slate-900 dark:text-white">
                        {getGenderDisplay(person.gender)}
                      </div>
                    </div>

                    {person.place_of_birth && (
                      <div className="bg-slate-100/80 dark:bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="text-slate-600 dark:text-purple-200 font-semibold mb-1">
                          Place of Birth
                        </div>
                        <div className="text-slate-900 dark:text-white">
                          {person.place_of_birth}
                        </div>
                      </div>
                    )}

                    <div className="bg-slate-100/80 dark:bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-slate-600 dark:text-purple-200 font-semibold mb-1">
                        Popularity
                      </div>
                      <div className="text-slate-900 dark:text-white">
                        {person.popularity.toFixed(1)}
                      </div>
                    </div>

                    {person.also_known_as &&
                      person.also_known_as.length > 0 && (
                        <div className="bg-slate-100/80 dark:bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:col-span-2">
                          <div className="text-slate-600 dark:text-purple-200 font-semibold mb-1">
                            Also Known As
                          </div>
                          <div className="text-slate-900 dark:text-white text-sm">
                            {person.also_known_as.slice(0, 5).join(", ")}
                            {person.also_known_as.length > 5 && "..."}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Biography */}
                  {person.biography && (
                    <div className="bg-slate-100/60 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6">
                      <h2 className="text-xl font-semibold text-slate-700 dark:text-purple-200 mb-4">
                        Biography
                      </h2>
                      <div className="text-slate-700 dark:text-white/90 leading-relaxed space-y-4">
                        {person.biography
                          .split("\n\n")
                          .map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* External Links */}
                  <div className="flex flex-wrap gap-4">
                    {person.homepage && (
                      <a
                        href={person.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-glass px-6 py-3"
                      >
                        🌐 Official Website
                      </a>
                    )}
                    {person.imdb_id && (
                      <a
                        href={`https://www.imdb.com/name/${person.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-glass px-6 py-3"
                      >
                        🎬 IMDb Profile
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
        <div className="w-full">
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-1 flex">
              <button
                onClick={() => setActiveTab("movies")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === "movies"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                🎬 Movies
                {movieCredits && (
                  <span className="ml-2 text-sm opacity-75">
                    ({movieCredits.cast.length + movieCredits.crew.length})
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("tv")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === "tv"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                📺 TV Shows
                {tvCredits && (
                  <span className="ml-2 text-sm opacity-75">
                    ({tvCredits.cast.length + tvCredits.crew.length})
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Movie Credits */}
          {activeTab === "movies" && (
            <div className="space-y-12">
              {/* Acting Credits */}
              {sortedMovieCredits && sortedMovieCredits.cast.length > 0 && (
                <div>
                  <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-8">
                    🎭 Acting Credits
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedMovieCredits.cast.map((movie) => (
                      <Link
                        key={movie.credit_id}
                        href={`/movie/${createMovieSlug(
                          movie.title,
                          movie.id
                        )}`}
                        className="card-premium group cursor-pointer"
                      >
                        <div className="aspect-[2/3] relative overflow-hidden rounded-xl mb-4">
                          <Image
                            src={
                              tmdbClient.getImageUrl(
                                movie.poster_path || null,
                                "w300"
                              ) || "/placeholder-poster.svg"
                            }
                            alt={movie.title}
                            width={200}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-poster.svg";
                            }}
                          />
                          <div className="absolute top-3 right-3 bg-purple-600/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {new Date(
                              movie.release_date || "1900-01-01"
                            ).getFullYear()}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2">
                            {movie.title}
                          </h3>
                          <p className="text-sm text-purple-600 dark:text-purple-400 mb-2 font-medium">
                            as {movie.character}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <span>⭐ {movie.vote_average.toFixed(1)}</span>
                            <span>•</span>
                            <span>
                              {new Date(
                                movie.release_date || "1900-01-01"
                              ).getFullYear()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Crew Credits */}
              {sortedMovieCredits && sortedMovieCredits.crew.length > 0 && (
                <div>
                  <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-8">
                    🎬 Crew Credits
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedMovieCredits.crew.map((movie) => (
                      <Link
                        key={movie.credit_id}
                        href={`/movie/${createMovieSlug(
                          movie.title,
                          movie.id
                        )}`}
                        className="card-premium group cursor-pointer"
                      >
                        <div className="aspect-[2/3] relative overflow-hidden rounded-xl mb-4">
                          <Image
                            src={
                              tmdbClient.getImageUrl(
                                movie.poster_path || null,
                                "w300"
                              ) || "/placeholder-poster.svg"
                            }
                            alt={movie.title}
                            width={200}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-poster.svg";
                            }}
                          />
                          <div className="absolute top-3 right-3 bg-pink-600/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {new Date(
                              movie.release_date || "1900-01-01"
                            ).getFullYear()}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2">
                            {movie.title}
                          </h3>
                          <p className="text-sm text-pink-600 dark:text-pink-400 mb-2 font-medium">
                            {movie.job} ({movie.department})
                          </p>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <span>⭐ {movie.vote_average.toFixed(1)}</span>
                            <span>•</span>
                            <span>
                              {new Date(
                                movie.release_date || "1900-01-01"
                              ).getFullYear()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TV Credits */}
          {activeTab === "tv" && (
            <div className="space-y-12">
              {/* Acting Credits */}
              {sortedTVCredits && sortedTVCredits.cast.length > 0 && (
                <div>
                  <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-8">
                    🎭 Acting Credits
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedTVCredits.cast.map((show) => (
                      <Link
                        key={show.credit_id}
                        href={`/tv/${createTVShowSlug(show.name, show.id)}`}
                        className="card-premium group cursor-pointer"
                      >
                        <div className="aspect-[2/3] relative overflow-hidden rounded-xl mb-4">
                          <Image
                            src={
                              tmdbClient.getImageUrl(
                                show.poster_path || null,
                                "w300"
                              ) || "/placeholder-poster.svg"
                            }
                            alt={show.name}
                            width={200}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-poster.svg";
                            }}
                          />
                          <div className="absolute top-3 right-3 bg-purple-600/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {new Date(
                              show.first_air_date || "1900-01-01"
                            ).getFullYear()}
                          </div>
                          {show.episode_count > 1 && (
                            <div className="absolute top-3 left-3 bg-black/80 text-white text-xs px-2 py-1 rounded-full">
                              {show.episode_count} eps
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2">
                            {show.name}
                          </h3>
                          <p className="text-sm text-purple-600 dark:text-purple-400 mb-2 font-medium">
                            as {show.character}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <span>⭐ {show.vote_average.toFixed(1)}</span>
                            <span>•</span>
                            <span>
                              {new Date(
                                show.first_air_date || "1900-01-01"
                              ).getFullYear()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Crew Credits */}
              {sortedTVCredits && sortedTVCredits.crew.length > 0 && (
                <div>
                  <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-8">
                    📺 Crew Credits
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedTVCredits.crew.map((show) => (
                      <Link
                        key={show.credit_id}
                        href={`/tv/${createTVShowSlug(show.name, show.id)}`}
                        className="card-premium group cursor-pointer"
                      >
                        <div className="aspect-[2/3] relative overflow-hidden rounded-xl mb-4">
                          <Image
                            src={
                              tmdbClient.getImageUrl(
                                show.poster_path || null,
                                "w300"
                              ) || "/placeholder-poster.svg"
                            }
                            alt={show.name}
                            width={200}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-poster.svg";
                            }}
                          />
                          <div className="absolute top-3 right-3 bg-pink-600/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {new Date(
                              show.first_air_date || "1900-01-01"
                            ).getFullYear()}
                          </div>
                          {show.episode_count > 1 && (
                            <div className="absolute top-3 left-3 bg-black/80 text-white text-xs px-2 py-1 rounded-full">
                              {show.episode_count} eps
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2">
                            {show.name}
                          </h3>
                          <p className="text-sm text-pink-600 dark:text-pink-400 mb-2 font-medium">
                            {show.job} ({show.department})
                          </p>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <span>⭐ {show.vote_average.toFixed(1)}</span>
                            <span>•</span>
                            <span>
                              {new Date(
                                show.first_air_date || "1900-01-01"
                              ).getFullYear()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading States */}
          {(moviesLoading || tvLoading) && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Loading skeleton component
function PersonDetailSkeleton() {
  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-br from-slate-200 to-slate-300 dark:from-purple-900 dark:to-pink-800 px-4 sm:px-6 lg:px-8 xl:px-12 py-16 w-full">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] w-full max-w-sm mx-auto lg:max-w-none bg-slate-300/50 dark:bg-white/20 rounded-2xl" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="h-16 bg-slate-300/50 dark:bg-white/20 rounded-lg w-3/4" />
              <div className="h-6 bg-slate-300/50 dark:bg-white/20 rounded-lg w-1/2" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-slate-300/50 dark:bg-white/20 rounded-lg" />
                <div className="h-20 bg-slate-300/50 dark:bg-white/20 rounded-lg" />
              </div>
              <div className="h-32 bg-slate-300/50 dark:bg-white/20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
        <div className="w-full">
          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg w-48 mx-auto mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[2/3] bg-slate-200 dark:bg-slate-700 rounded-xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
