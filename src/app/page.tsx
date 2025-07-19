"use client";

import React from "react";
import Image from "next/image";
import { useTrendingMovies } from "@/hooks";
import tmdbClient from "@/lib/tmdb-client";

export default function HomePage() {
  const { data: trendingMovies, isLoading, error } = useTrendingMovies();

  return (
    <div className="w-full min-h-screen">
      {/* Premium Hero Section - Full Screen */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950" />

        {/* Premium Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(244,110,12,0.3),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)]" />
        </div>

        {/* Content - Full Width Responsive */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-white mb-4 sm:mb-6">
            <span className="text-gradient-premium">Cinema</span>
            <span className="text-white">Vault</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-300 mb-8 sm:mb-12 leading-relaxed px-4 max-w-5xl mx-auto">
            Experience movies like never before with our premium collection,
            AI-powered recommendations, and immersive 3D previews.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
            <button className="btn-cinema text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 w-full sm:w-auto">
              🎬 Explore Movies
            </button>
            <button className="btn-cinema-outline text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 w-full sm:w-auto">
              ✨ Try Premium Features
            </button>
          </div>
        </div>

        {/* Floating Elements - Responsive */}
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-r from-orange-500/30 to-orange-600/30 rounded-full blur-xl animate-float" />
        <div
          className="absolute bottom-20 sm:bottom-40 right-16 sm:right-32 w-12 h-12 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 right-10 sm:right-20 w-10 h-10 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </section>

      {/* Trending Section - Full Width Responsive */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
        <div className="w-full">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white mb-4">
              🔥 Trending Now
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400">
              Discover what everyone is watching
            </p>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">
                ⚠️ Unable to load trending movies. Please check your TMDB API
                key in .env.local
              </p>
            </div>
          )}

          {trendingMovies && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
              {trendingMovies.results.slice(0, 16).map((movie) => (
                <div
                  key={movie.id}
                  className="card-premium group cursor-pointer"
                >
                  <div className="aspect-[2/3] relative overflow-hidden rounded-xl">
                    <Image
                      src={
                        tmdbClient.getImageUrl(movie.poster_path, "w500") ||
                        "/placeholder-poster.svg"
                      }
                      alt={movie.title}
                      width={300}
                      height={450}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-poster.svg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span>⭐ {movie.vote_average.toFixed(1)}</span>
                        <span>•</span>
                        <span>
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section - Full Width Responsive */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 xl:px-12 bg-slate-50 dark:bg-slate-900/50 w-full">
        <div className="w-full text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white mb-4">
            ✨ Premium Features
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-12">
            Experience cinema like never before
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="card-cinema p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl mb-4">🎭</div>
              <h3 className="text-xl sm:text-2xl font-display font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">
                3D Movie Posters
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Interactive 3D movie posters with immersive hover effects and
                animations.
              </p>
            </div>

            <div className="card-cinema p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl mb-4">🤖</div>
              <h3 className="text-xl sm:text-2xl font-display font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">
                AI Recommendations
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Personalized movie suggestions powered by advanced machine
                learning algorithms.
              </p>
            </div>

            <div className="card-cinema p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl mb-4">🎪</div>
              <h3 className="text-xl sm:text-2xl font-display font-semibold mb-3 sm:mb-4 text-slate-900 dark:text-white">
                Social Cinema
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Watch parties, real-time discussions, and social movie
                experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Full Width Responsive */}
      <footer className="bg-slate-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
        <div className="w-full text-center">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold mb-3 sm:mb-4 text-gradient-premium">
            CinemaVault Premium
          </h3>
          <p className="text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
            The future of movie discovery is here
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm lg:text-base text-slate-500">
            <span>Powered by TMDB API</span>
            <span className="hidden sm:inline">•</span>
            <span>Built with Next.js 15</span>
            <span className="hidden sm:inline">•</span>
            <span>Premium Experience</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
