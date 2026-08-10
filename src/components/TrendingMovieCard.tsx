"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Movie } from "@/types";

interface TrendingMovieCardProps {
  movie: Movie;
  index: number;
}

export default function TrendingMovieCard({
  movie,
  index,
}: TrendingMovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder-movie.svg";

  const handleCardClick = () => {
    router.push(`/movie/${movie.id}`);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8.0) return "text-emerald-400";
    if (rating >= 7.0) return "text-green-400";
    if (rating >= 6.0) return "text-yellow-400";
    if (rating >= 5.0) return "text-orange-400";
    return "text-red-400";
  };

  const getRatingBadgeStyle = (rating: number) => {
    if (rating >= 8.0) return "bg-emerald-500/20 border-emerald-400/30";
    if (rating >= 7.0) return "bg-green-500/20 border-green-400/30";
    if (rating >= 6.0) return "bg-yellow-500/20 border-yellow-400/30";
    if (rating >= 5.0) return "bg-orange-500/20 border-orange-400/30";
    return "bg-red-500/20 border-red-400/30";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <motion.div
        whileHover={{ scale: 1.05, zIndex: 10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative bg-black rounded overflow-hidden transition-all duration-300 shadow-lg group-hover:shadow-black"
      >
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={movie.title || "Movie poster"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 20vw"
          />

          {/* Enhanced Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Movie Info Overlay - Shows on Hover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 20,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 p-4 text-white"
          >
            <h3 className="font-bold text-lg mb-1 line-clamp-2 drop-shadow-lg">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-200 font-medium">
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "TBA"}
              </span>
              <div className="flex items-center gap-1 bg-black/80 px-2 rounded font-bold">
                <span className="text-primary-500 text-sm">★</span>
                <span className="text-white text-sm">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                </span>
              </div>
            </div>
          </motion.div>

          {movie.vote_average && movie.vote_average > 7.5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="absolute top-2 right-2 bg-primary-500 text-white font-bold text-xs px-2 py-1 rounded shadow-lg"
            >
              TOP RATED
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
