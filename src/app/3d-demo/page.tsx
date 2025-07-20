"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  MoviePoster3D,
  MoviePoster360,
  CinematicParallax,
  ParticleEffects,
  FloatingMovieElements,
  InteractiveParticles,
  MovieTrailer,
  TrailerThumbnail,
  EnhancedMovieCard,
} from "@/components/3d-effects";
import { Movie } from "@/types";

// Sample movie data for demo
const sampleMovies: Movie[] = [
  {
    id: 1,
    title: "Avatar: The Way of Water",
    original_title: "Avatar: The Way of Water",
    overview: "Set more than a decade after the events of the first film...",
    poster_path:
      "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdrop_path:
      "https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    release_date: "2022-12-16",
    vote_average: 7.6,
    genre_ids: [28, 12, 878],
    adult: false,
    original_language: "en",
    popularity: 2500.0,
    vote_count: 8000,
    video: false,
  },
  {
    id: 2,
    title: "Top Gun: Maverick",
    original_title: "Top Gun: Maverick",
    overview:
      "After more than thirty years of service as one of the Navy's top aviators...",
    poster_path:
      "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    backdrop_path:
      "https://image.tmdb.org/t/p/original/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
    release_date: "2022-05-27",
    vote_average: 8.3,
    genre_ids: [28, 18],
    adult: false,
    original_language: "en",
    popularity: 3000.0,
    vote_count: 12000,
    video: false,
  },
  {
    id: 3,
    title: "Black Panther: Wakanda Forever",
    original_title: "Black Panther: Wakanda Forever",
    overview: "Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje...",
    poster_path:
      "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    backdrop_path:
      "https://image.tmdb.org/t/p/original/yYrvN5WFeGYjJnRzhY0QXuo4Isw.jpg",
    release_date: "2022-11-11",
    vote_average: 7.3,
    genre_ids: [28, 12, 18, 878],
    adult: false,
    original_language: "en",
    popularity: 2200.0,
    vote_count: 9500,
    video: false,
  },
];

export default function EffectsDemoPage() {
  const [showTrailer, setShowTrailer] = useState(false);

  const demoSections = [
    {
      id: "3d-posters",
      title: "🎭 3D Movie Posters",
      description:
        "Interactive 3D movie posters with hover effects and floating animations",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "360-posters",
      title: "🔄 360° Movie Posters",
      description:
        "Rotating movie posters with full 360° view and interactive controls",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "parallax",
      title: "🌊 Parallax Scrolling",
      description: "Immersive parallax scrolling effects with multiple layers",
      color: "from-green-500 to-teal-500",
    },
    {
      id: "particles",
      title: "✨ Particle Effects",
      description: "Dynamic particle systems and floating movie elements",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "trailers",
      title: "🎬 Movie Trailers",
      description: "Embedded YouTube/Vimeo players with custom controls",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "enhanced-cards",
      title: "🎪 Enhanced Movie Cards",
      description:
        "Combination of all effects in enhanced movie card components",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Interactive Background Particles */}
      <InteractiveParticles className="fixed inset-0 opacity-20" />

      {/* Floating Movie Elements */}
      <FloatingMovieElements
        elements={10}
        className="fixed inset-0 opacity-10"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              🎭 3D Effects Demo
            </h1>
            <div className="w-24" /> {/* Spacer */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <ParticleEffects
          count={300}
          color="#ff6b35"
          size={0.02}
          speed={0.3}
          className="absolute inset-0 opacity-20"
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gradient-premium">Interactive</span> 3D
            Effects
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience the future of movie websites with immersive 3D
            visualizations, interactive animations, and stunning visual effects.
          </motion.p>
        </div>
      </section>

      {/* Demo Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {demoSections.map((section, index) => (
              <motion.div
                key={section.id}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${section.color} text-white cursor-pointer group overflow-hidden`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3">{section.title}</h3>
                  <p className="text-white/90 mb-4">{section.description}</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <Sparkles size={16} />
                    <span>Click to view demo</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Sections */}
      <div className="container mx-auto px-4 space-y-20">
        {/* 3D Posters Demo */}
        <section id="3d-posters" className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            🎭 Interactive 3D Movie Posters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {sampleMovies.map((movie) => (
              <div key={movie.id} className="aspect-[2/3]">
                <MoviePoster3D
                  movie={movie}
                  imageUrl={movie.poster_path || "/placeholder-poster.svg"}
                  onClick={() => {}}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 360° Posters Demo */}
        <section
          id="360-posters"
          className="py-16 bg-slate-100/50 dark:bg-slate-900/50 rounded-3xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            🔄 360° Rotating Movie Posters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {sampleMovies.slice(0, 2).map((movie) => (
              <div key={movie.id} className="aspect-[3/4]">
                <MoviePoster360
                  movie={movie}
                  imageUrl={movie.poster_path || "/placeholder-poster.svg"}
                  backImageUrl={movie.backdrop_path || undefined}
                  autoRotate={true}
                  controls={true}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Parallax Demo */}
        <section id="parallax" className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            🌊 Parallax Scrolling Effects
          </h2>
          <CinematicParallax
            backgroundImage={sampleMovies[0].backdrop_path || undefined}
            overlayImage={sampleMovies[1].backdrop_path || undefined}
            className="rounded-3xl min-h-[60vh]"
          >
            <div className="text-center text-white">
              <h3 className="text-4xl md:text-6xl font-bold mb-4">
                Cinematic Experience
              </h3>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                Immersive parallax scrolling brings your movie experience to
                life
              </p>
            </div>
          </CinematicParallax>
        </section>

        {/* Particle Effects Demo */}
        <section id="particles" className="py-16 relative">
          <ParticleEffects
            count={500}
            color="#ffffff"
            size={0.03}
            speed={0.4}
            className="absolute inset-0 opacity-40"
          />
          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-900 dark:text-white">
              ✨ Dynamic Particle Systems
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Interactive particle effects that respond to user interaction and
              create immersive atmospheric backgrounds for your movie website.
            </p>
          </div>
        </section>

        {/* Enhanced Cards Demo */}
        <section id="enhanced-cards" className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            🎪 Enhanced Movie Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleMovies.map((movie, index) => {
              const modes = ["3d", "360", "standard"] as const;
              return (
                <EnhancedMovieCard
                  key={movie.id}
                  movie={movie}
                  imageUrl={movie.poster_path || "/placeholder-poster.svg"}
                  mode={modes[index]}
                  autoRotate={index === 1}
                  showTrailer={true}
                  trailerKey="uYPbbksJxIg" // Sample trailer key
                />
              );
            })}
          </div>
        </section>

        {/* Trailer Demo */}
        <section
          id="trailers"
          className="py-16 bg-slate-900 rounded-3xl text-white"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              🎬 Immersive Movie Trailers
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              Watch movie trailers with our custom video player featuring
              full-screen mode, controls, and seamless integration.
            </p>
            <button
              onClick={() => setShowTrailer(true)}
              className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
            >
              <Play size={20} />
              <span>Watch Sample Trailer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {sampleMovies.map((movie) => (
              <TrailerThumbnail
                key={movie.id}
                movie={movie}
                videoKey="uYPbbksJxIg" // Sample YouTube video ID
                onClick={() => setShowTrailer(true)}
                className="aspect-video"
              />
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Experience the Future?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            These cutting-edge 3D effects and interactive features represent the
            next generation of movie website experiences. Every effect is
            optimized for performance and designed for maximum user engagement.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            <span>Explore the Full Experience</span>
            <ArrowLeft className="rotate-180" size={20} />
          </Link>
        </div>
      </footer>

      {/* Sample Trailer Modal */}
      {showTrailer && (
        <MovieTrailer
          movie={sampleMovies[0]}
          videoKey="uYPbbksJxIg"
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          autoPlay={true}
        />
      )}
    </div>
  );
}
