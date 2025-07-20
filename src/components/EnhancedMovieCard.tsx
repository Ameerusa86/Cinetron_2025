"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Star, Calendar } from "lucide-react";
import { Movie } from "@/types";
import { createMovieSlug } from "@/lib/slug-utils";
import MoviePoster3D from "./3d/MoviePoster3D";
import MoviePoster360 from "./3d/MoviePoster360";
import MovieTrailer, { TrailerThumbnail } from "./effects/MovieTrailer";

interface EnhancedMovieCardProps {
  movie: Movie;
  imageUrl: string;
  mode?: "3d" | "360" | "trailer" | "standard";
  autoRotate?: boolean;
  showTrailer?: boolean;
  trailerKey?: string;
  className?: string;
}

// Loading skeleton for 3D components
function MovieCardSkeleton() {
  return (
    <div className="aspect-[2/3] bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 rounded-xl animate-pulse">
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent" />
      </div>
    </div>
  );
}

// Standard 2D Movie Card
function StandardMovieCard({
  movie,
  imageUrl,
  trailerKey,
  showTrailer = false,
}: {
  movie: Movie;
  imageUrl: string;
  trailerKey?: string;
  showTrailer?: boolean;
}) {
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const displayImage = imageError ? "/placeholder-poster.svg" : imageUrl;

  return (
    <>
      <Link
        href={`/movie/${createMovieSlug(movie.title, movie.id)}`}
        className="block group relative"
      >
        <motion.div
          className="aspect-[2/3] relative overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Image
            src={displayImage}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
            <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <Star size={12} className="text-yellow-400 fill-current" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* Trailer Play Button */}
          {showTrailer && trailerKey && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowTrailerModal(true);
              }}
              className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-orange-500 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <Play size={16} className="text-white fill-current ml-0.5" />
            </button>
          )}

          {/* Rating Badge */}
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        </motion.div>
      </Link>

      {/* Trailer Modal */}
      {showTrailerModal && trailerKey && (
        <MovieTrailer
          movie={movie}
          videoKey={trailerKey}
          isOpen={showTrailerModal}
          onClose={() => setShowTrailerModal(false)}
          autoPlay={true}
        />
      )}
    </>
  );
}

// Main Enhanced Movie Card Component
export default function EnhancedMovieCard({
  movie,
  imageUrl,
  mode = "standard",
  autoRotate = true,
  showTrailer = false,
  trailerKey,
  className = "",
}: EnhancedMovieCardProps) {
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  const cardContent = () => {
    switch (mode) {
      case "3d":
        return (
          <Suspense fallback={<MovieCardSkeleton />}>
            <MoviePoster3D
              movie={movie}
              imageUrl={imageUrl}
              onClick={() => {
                // Handle click - could navigate or show details
                window.location.href = `/movie/${createMovieSlug(
                  movie.title,
                  movie.id
                )}`;
              }}
            />
          </Suspense>
        );

      case "360":
        return (
          <Suspense fallback={<MovieCardSkeleton />}>
            <MoviePoster360
              movie={movie}
              imageUrl={imageUrl}
              autoRotate={autoRotate}
              controls={true}
              className="aspect-[2/3]"
            />
          </Suspense>
        );

      case "trailer":
        return trailerKey ? (
          <TrailerThumbnail
            movie={movie}
            videoKey={trailerKey}
            onClick={() => setShowTrailerModal(true)}
            className="aspect-[16/9]"
          />
        ) : (
          <StandardMovieCard
            movie={movie}
            imageUrl={imageUrl}
            trailerKey={trailerKey}
            showTrailer={showTrailer}
          />
        );

      default:
        return (
          <StandardMovieCard
            movie={movie}
            imageUrl={imageUrl}
            trailerKey={trailerKey}
            showTrailer={showTrailer}
          />
        );
    }
  };

  return (
    <div className={`relative ${className}`}>
      {cardContent()}

      {/* Enhanced Info Panel */}
      <motion.div
        className="mt-3 space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link href={`/movie/${createMovieSlug(movie.title, movie.id)}`}>
          <h3 className="font-semibold text-sm line-clamp-2 text-slate-900 dark:text-white hover:text-orange-500 transition-colors">
            {movie.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>{new Date(movie.release_date).getFullYear()}</span>
            </div>
          </div>

          {/* Mode Indicator */}
          <div className="flex items-center space-x-1 text-orange-500">
            {mode === "3d" && <span>🎭</span>}
            {mode === "360" && <span>🔄</span>}
            {mode === "trailer" && <span>🎬</span>}
          </div>
        </div>

        {/* Genre Tags */}
        {movie.genre_ids && movie.genre_ids.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {movie.genre_ids.slice(0, 2).map((genreId) => (
              <span
                key={genreId}
                className="px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs"
              >
                {getGenreName(genreId)}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Trailer Modal */}
      {showTrailerModal && trailerKey && (
        <MovieTrailer
          movie={movie}
          videoKey={trailerKey}
          isOpen={showTrailerModal}
          onClose={() => setShowTrailerModal(false)}
          autoPlay={true}
        />
      )}
    </div>
  );
}

// Helper function for genre names (you can expand this)
function getGenreName(genreId: number): string {
  const genres: { [key: number]: string } = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  return genres[genreId] || "Unknown";
}
