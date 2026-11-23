"use client";

import React from "react";
import { Movie } from "@/types";
import { MediaCard } from "@/components/media/MediaCard";

interface TrendingMovieCardProps {
  movie: Movie;
  index: number;
}

export default function TrendingMovieCard({
  movie,
  index,
}: TrendingMovieCardProps) {
  return (
    <MediaCard
      id={movie.id}
      title={movie.title}
      mediaType="movie"
      imagePath={movie.poster_path}
      rating={movie.vote_average}
      year={movie.release_date}
      rank={index + 1}
    />
  );
}
