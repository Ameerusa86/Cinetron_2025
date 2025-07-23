"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTrendingMovies } from "@/hooks";
import {
  ParticleEffects,
  FloatingMovieElements,
  InteractiveParticles,
} from "@/components/3d-effects";
import TrendingMovieCard from "@/components/TrendingMovieCard";
import { AIFeaturesShowcase } from "@/components/sections/AIFeaturesShowcase";

export default function HomePage() {
  const { data: trendingMovies, isLoading, error } = useTrendingMovies();

  return (
    <div className="w-full min-h-screen">
      {/* Premium Hero Section - Full Screen */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950">
        {/* Interactive Particle Background */}
        <InteractiveParticles className="opacity-30" />

        {/* Floating Movie Elements */}
        <FloatingMovieElements elements={15} className="opacity-20" />

        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-slate-200/50 dark:from-slate-900/50 dark:to-slate-950/50" />

        {/* Premium Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(244,110,12,0.3),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)]" />
        </div>

        {/* Content - Full Width Responsive */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
            <span className="text-gradient-premium">Cinema</span>
            <span className="text-slate-800 dark:text-white">Vault</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 mb-8 sm:mb-12 leading-relaxed px-4 max-w-5xl mx-auto">
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

      {/* AI Features Showcase */}
      <AIFeaturesShowcase />

      {/* Interactive Games Section */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 xl:px-12 w-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="w-full relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white mb-4">
              🎮 Interactive Games
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Challenge your movie knowledge with our premium game collection
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                title: "Movie Quiz",
                icon: "🎭",
                description: "AI-generated quizzes from popular films",
                href: "/games/quiz",
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "Movie Bingo",
                icon: "🎯",
                description: "Interactive bingo for movie nights",
                href: "/games/bingo",
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Predictions",
                icon: "🔮",
                description: "Predict box office and awards",
                href: "/games/prediction",
                color: "from-green-500 to-emerald-500",
              },
              {
                title: "Trivia Challenge",
                icon: "🧠",
                description: "Daily movie trivia challenges",
                href: "/games/trivia",
                color: "from-orange-500 to-red-500",
              },
            ].map((game) => (
              <a
                key={game.title}
                href={game.href}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {game.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 group-hover:bg-clip-text transition-all duration-300">
                  {game.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {game.description}
                </p>
                <div
                  className={`mt-4 w-full h-1 bg-gradient-to-r ${game.color} rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
              </a>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/games"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <span>Explore All Games</span>
              <span>🚀</span>
            </a>
          </div>
        </div>
      </section>

      {/* Trending Section - Modern Card Layout */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-12 w-full relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
        {/* Particle Effects Background */}
        <ParticleEffects
          count={150}
          color="#f97316"
          size={0.015}
          speed={0.15}
          className="opacity-20"
        />

        {/* Floating Movie Elements */}
        <FloatingMovieElements elements={8} className="opacity-10" />

        <div className="w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6"
              style={{
                background:
                  "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              🔥 Trending Now
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto"
            >
              Discover the hottest movies everyone&apos;s talking about
            </motion.p>
          </motion.div>

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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6 lg:gap-8">
              {trendingMovies.results.slice(0, 14).map((movie, index) => (
                <TrendingMovieCard key={movie.id} movie={movie} index={index} />
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
            MovieSense Premium
          </h3>
          <p className="text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
            The future of movie discovery is here
          </p>

          {/* Social Links */}
          <div className="flex justify-center items-center space-x-6 mb-6 sm:mb-8">
            <motion.a
              href="https://github.com/Ameerusa86"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200 group"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-sm sm:text-base font-medium">GitHub</span>
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/ameerdev/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-colors duration-200 group"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="text-sm sm:text-base font-medium">LinkedIn</span>
            </motion.a>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm lg:text-base text-slate-500">
            <span>Powered by TMDB API</span>
            <span className="hidden sm:inline">•</span>
            <span>Built with Next.js 15</span>
            <span className="hidden sm:inline">•</span>
            <span>Premium Experience</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-xs sm:text-sm text-slate-500">
              Created by{" "}
              <span className="text-orange-400 font-medium">Ameer Hasan</span> •
              © 2025 MovieSense Premium
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
