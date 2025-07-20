"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Play, Heart, BookmarkPlus } from "lucide-react";
import Image from "next/image";
import { Movie } from "@/types";
import MovieTrailer from "./effects/MovieTrailer";

interface EnhancedMovieCardProps {
  movie: Movie;
  mode?: "standard" | "trailer";
  className?: string;
}

export default function EnhancedMovieCard({
  movie,
  mode = "standard",
  className = "",
}: EnhancedMovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder-movie.jpg";

  return (
    <>
      <motion.div
        className={`relative group cursor-pointer ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Movie Card */}
        <div className="relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Movie Poster */}
          <div className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={imageUrl}
              alt={movie.title || "Movie poster"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay Actions */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center"
                >
                  <div className="flex gap-3">
                    {mode === "trailer" && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsTrailerOpen(true)}
                        className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                      >
                        <Play size={24} />
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`backdrop-blur-sm p-3 rounded-full transition-colors ${
                        isFavorite
                          ? "bg-red-500/80 text-white"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      <Heart
                        size={20}
                        fill={isFavorite ? "currentColor" : "none"}
                      />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsWatchlisted(!isWatchlisted)}
                      className={`backdrop-blur-sm p-3 rounded-full transition-colors ${
                        isWatchlisted
                          ? "bg-blue-500/80 text-white"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      <BookmarkPlus
                        size={20}
                        fill={isWatchlisted ? "currentColor" : "none"}
                      />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rating Badge */}
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1">
              <Star size={14} fill="currentColor" className="text-yellow-500" />
              <span className="text-sm font-medium">
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </span>
            </div>
          </div>

          {/* Movie Info */}
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
              {movie.title}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
              {movie.overview || "No description available."}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "TBA"}
              </span>
              <span className="flex items-center gap-1">
                <Star
                  size={12}
                  fill="currentColor"
                  className="text-yellow-500"
                />
                {movie.vote_count} votes
              </span>
            </div>
          </div>

          {/* Premium Hover Effect */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            animate={{
              background: isHovered
                ? "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)"
                : "transparent",
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Movie Trailer Modal */}
      {mode === "trailer" && (
        <MovieTrailer
          movie={movie}
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
        />
      )}
    </>
  );
}
