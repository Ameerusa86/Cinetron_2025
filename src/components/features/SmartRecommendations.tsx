"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Brain,
  RefreshCw,
  Star,
  Sparkles,
  TrendingUp,
  Users,
  AlertCircle,
  Loader2,
  Film,
} from "lucide-react";
import { aiService, AIRecommendation } from "@/lib/ai-services";
import tmdbClient from "@/lib/tmdb-client";
import { createMovieSlug } from "@/lib/slug-utils";

export function SmartRecommendations() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await aiService.getSmartRecommendations();
      setRecommendations(results);
    } catch (err) {
      setError("Failed to generate AI recommendations. Please try again.");
      console.error("AI Recommendations error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const getCategoryMeta = (category: AIRecommendation["category"]) => {
    switch (category) {
      case "genre_match":
        return { label: "Genre Match", icon: Star };
      case "actor_preference":
        return { label: "Cast Affinity", icon: Users };
      case "mood_based":
        return { label: "Tone Match", icon: Sparkles };
      case "similar_users":
        return { label: "Audience Match", icon: Users };
      default:
        return { label: "Trending Pick", icon: TrendingUp };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Smart Recommendations
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Curated picks calibrated from viewing trends and taste patterns.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchRecommendations}
          disabled={isLoading}
          className="btn-cinema-outline self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Picks</span>
        </button>
      </div>

      {isLoading && (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-medium text-foreground">
            Analyzing viewing patterns...
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Curating personalized film matches
          </p>
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 p-6 text-center space-y-3">
          <AlertCircle className="h-6 w-6 text-rose-400 mx-auto" />
          <p className="text-sm text-foreground">{error}</p>
          <button
            type="button"
            onClick={fetchRecommendations}
            className="btn-cinema"
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !error && recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.map((rec) => {
            const meta = getCategoryMeta(rec.category);
            const Icon = meta.icon;
            const poster = tmdbClient.getImageUrl(rec.movie.poster_path, "w342");

            return (
              <Link
                key={rec.movie.id}
                href={`/movie/${createMovieSlug(rec.movie.title, rec.movie.id)}`}
                className="group flex gap-4 rounded-xl border border-border bg-secondary/40 p-4 hover:border-foreground/20 hover:bg-secondary/70 transition-all"
              >
                <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                  {poster ? (
                    <Image
                      src={poster}
                      alt={rec.movie.title}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Film className="h-6 w-6 opacity-40" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        <Icon className="h-3 w-3" />
                        {meta.label}
                      </span>
                      <span className="font-mono text-xs font-semibold text-emerald-400">
                        {Math.round(rec.confidence * 100)}% match
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {rec.movie.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                      {rec.movie.vote_average > 0 && (
                        <span className="inline-flex items-center gap-1 text-foreground">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {rec.movie.vote_average.toFixed(1)}
                        </span>
                      )}
                      {rec.movie.release_date && (
                        <span>{rec.movie.release_date.slice(0, 4)}</span>
                      )}
                    </div>

                    {rec.reasons[0] && (
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {rec.reasons[0]}
                      </p>
                    )}
                  </div>

                  <span className="mt-2 text-xs font-semibold text-primary">
                    View details →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {!isLoading && !error && recommendations.length === 0 && (
        <div className="py-12 text-center">
          <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No recommendations available right now. Click Refresh Picks to try
            again.
          </p>
        </div>
      )}
    </div>
  );
}
