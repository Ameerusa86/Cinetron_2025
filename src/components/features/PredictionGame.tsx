"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  DollarSign,
  Star,
  Award,
  TrendingUp,
  CheckCircle2,
  Film,
  Send,
} from "lucide-react";
import { useUpcomingMovies } from "@/hooks";
import tmdbClient from "@/lib/tmdb-client";
import { useNotificationStore } from "@/stores";
import { PageHeader } from "@/components/media/PageHeader";

type Category = "box-office" | "ratings" | "awards";

interface SubmittedPrediction {
  id: string;
  movieTitle: string;
  category: Category;
  summary: string;
  confidence: number;
  createdAt: string;
}

const categories: {
  id: Category;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "box-office",
    label: "Box Office",
    description: "Forecast opening weekend & global gross",
    icon: DollarSign,
  },
  {
    id: "ratings",
    label: "Critic & Audience",
    description: "Predict TMDB & review consensus scores",
    icon: Star,
  },
  {
    id: "awards",
    label: "Awards Season",
    description: "Predict nominations & major wins",
    icon: Award,
  },
];

export default function PredictionGame() {
  const { data: upcomingData, isLoading } = useUpcomingMovies(1);
  const { addNotification } = useNotificationStore();

  const upcomingMovies = upcomingData?.results?.slice(0, 8) || [];

  const [selectedCategory, setSelectedCategory] =
    useState<Category>("box-office");
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(70);

  // Inputs
  const [openingWeekend, setOpeningWeekend] = useState("65");
  const [worldwideGross, setWorldwideGross] = useState("350");
  const [predictedRating, setPredictedRating] = useState("7.8");
  const [rtScore, setRtScore] = useState("84");
  const [nominations, setNominations] = useState("4");
  const [wins, setWins] = useState("1");

  const [predictions, setPredictions] = useState<SubmittedPrediction[]>([]);

  const activeMovie =
    upcomingMovies.find((m) => m.id === selectedMovieId) || upcomingMovies[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMovie) return;

    const summary =
      selectedCategory === "box-office"
        ? `$${openingWeekend}M opening · $${worldwideGross}M worldwide`
        : selectedCategory === "ratings"
        ? `${predictedRating}/10 audience · ${rtScore}% critics`
        : `${nominations} nominations · ${wins} wins`;

    const entry: SubmittedPrediction = {
      id: `${Date.now()}`,
      movieTitle: activeMovie.title,
      category: selectedCategory,
      summary,
      confidence,
      createdAt: "Just now",
    };

    setPredictions((prev) => [entry, ...prev]);
    addNotification({
      type: "success",
      title: "Prediction Locked In",
      message: `${activeMovie.title} (${summary})`,
      read: false,
    });
  };

  return (
    <div className="min-h-screen w-full">
      <PageHeader
        eyebrow="Cinema Games"
        title="Slate"
        accentWord="Predictions"
        description="Lock in your box office, review score, and awards forecasts on live upcoming releases."
      >
        <Link
          href="/games"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Games
        </Link>
      </PageHeader>

      <section className="py-10">
        <div className="container-cinema grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Prediction Builder */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Select Upcoming Film */}
            <div className="surface-card p-6 space-y-4">
              <h2 className="text-base font-bold text-foreground">
                1. Choose an Upcoming Release
              </h2>

              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-28 rounded-xl bg-secondary skeleton-shimmer"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {upcomingMovies.map((movie) => {
                    const isSelected = activeMovie?.id === movie.id;
                    const poster = tmdbClient.getImageUrl(
                      movie.poster_path,
                      "w185"
                    );
                    return (
                      <button
                        key={movie.id}
                        type="button"
                        onClick={() => setSelectedMovieId(movie.id)}
                        className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border bg-secondary/40 hover:border-foreground/20"
                        }`}
                      >
                        <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                          {poster ? (
                            <Image
                              src={poster}
                              alt={movie.title}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              <Film className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">
                            {movie.title}
                          </p>
                          {movie.release_date && (
                            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                              {movie.release_date}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 2: Category & Forecast */}
            <form
              onSubmit={handleSubmit}
              className="surface-card p-6 space-y-6"
            >
              <div className="space-y-3">
                <h2 className="text-base font-bold text-foreground">
                  2. Select Forecast Category
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const active = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                          active
                            ? "border-primary bg-primary/10"
                            : "border-border bg-secondary/40 hover:border-foreground/20"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 mb-2 ${
                            active ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <p className="text-sm font-bold text-foreground">
                          {cat.label}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {cat.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                {selectedCategory === "box-office" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Opening Weekend ($ Millions)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={openingWeekend}
                        onChange={(e) => setOpeningWeekend(e.target.value)}
                        className="w-full rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Total Worldwide Gross ($ Millions)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={worldwideGross}
                        onChange={(e) => setWorldwideGross(e.target.value)}
                        className="w-full rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  </>
                )}

                {selectedCategory === "ratings" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        TMDB / IMDb Score (1.0 – 10.0)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="10"
                        value={predictedRating}
                        onChange={(e) => setPredictedRating(e.target.value)}
                        className="w-full rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Critics Consensus (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={rtScore}
                        onChange={(e) => setRtScore(e.target.value)}
                        className="w-full rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  </>
                )}

                {selectedCategory === "awards" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Major Nominations
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={nominations}
                        onChange={(e) => setNominations(e.target.value)}
                        className="w-full rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Major Wins
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={wins}
                        onChange={(e) => setWins(e.target.value)}
                        className="w-full rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Confidence Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground">
                    Confidence Level
                  </span>
                  <span className="font-mono font-bold text-primary">
                    {confidence}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={confidence}
                  onChange={(e) => setConfidence(parseInt(e.target.value, 10))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={!activeMovie}
                className="btn-cinema w-full py-3"
              >
                <Send className="h-4 w-4" />
                <span>
                  Lock Prediction for {activeMovie?.title || "Selected Film"}
                </span>
              </button>
            </form>
          </div>

          {/* Right: Locked Predictions Slip */}
          <div className="lg:col-span-4">
            <div className="surface-card p-6 space-y-4 sticky top-24">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Your Predictions</span>
                </div>
                <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
                  {predictions.length}
                </span>
              </div>

              {predictions.length === 0 ? (
                <div className="py-10 text-center text-xs text-muted-foreground">
                  No predictions locked yet. Choose a film and forecast its
                  performance to build your slip.
                </div>
              ) : (
                <div className="space-y-3">
                  {predictions.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-xl border border-border bg-secondary/40 p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-foreground truncate">
                          {p.movieTitle}
                        </span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        {p.summary}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                        <span className="capitalize">{p.category}</span>
                        <span className="font-mono text-primary">
                          {p.confidence}% conf.
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
