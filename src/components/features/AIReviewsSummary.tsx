"use client";

import React, { useState } from "react";
import {
  Search,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { aiService, ReviewSummary } from "@/lib/ai-services";

const sampleMovies = [
  "The Dark Knight",
  "Inception",
  "Interstellar",
  "Dune: Part Two",
  "Parasite",
  "Oppenheimer",
];

export function AIReviewsSummary() {
  const [movieTitle, setMovieTitle] = useState("");
  const [analyzedTitle, setAnalyzedTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeReviews = async (titleOverride?: string) => {
    const query = (titleOverride ?? movieTitle).trim();
    if (!query) return;
    if (titleOverride) setMovieTitle(titleOverride);

    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await aiService.summarizeReviews(query);
      setSummary(result);
      setAnalyzedTitle(query);
    } catch (err) {
      setError("Failed to synthesize reviews. Please try again.");
      console.error("Reviews analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sentimentBadge = (sentiment: ReviewSummary["overallSentiment"]) => {
    if (sentiment === "positive") {
      return {
        icon: TrendingUp,
        style: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      };
    }
    if (sentiment === "negative") {
      return {
        icon: TrendingDown,
        style: "border-rose-500/30 bg-rose-500/10 text-rose-400",
      };
    }
    return {
      icon: Minus,
      style: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    };
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          AI Review Synthesis
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Distill critical consensus, audience praise, and recurring themes for
          any film.
        </p>
      </div>

      {/* Input Bar */}
      <div className="max-w-2xl space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyzeReviews();
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              placeholder="Enter a film title (e.g., Dune: Part Two, Parasite)"
              className="w-full rounded-xl border border-border bg-secondary/50 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <button
            type="submit"
            disabled={!movieTitle.trim() || isAnalyzing}
            className="btn-cinema px-5 shrink-0"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Popular:</span>
          {sampleMovies.map((title) => (
            <button
              key={title}
              type="button"
              onClick={() => handleAnalyzeReviews(title)}
              className="rounded-lg border border-border bg-secondary/60 px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm text-rose-400">
          {error}
        </div>
      )}

      {/* Results */}
      {summary && (
        <div className="space-y-6 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-foreground">
              Consensus for &ldquo;{analyzedTitle}&rdquo;
            </h3>

            <div className="flex flex-wrap items-center gap-2.5">
              {(() => {
                const badge = sentimentBadge(summary.overallSentiment);
                const Icon = badge.icon;
                return (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold capitalize ${badge.style}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {summary.overallSentiment}
                  </span>
                );
              })()}
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1 font-mono text-xs font-semibold text-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Trust {Math.round(summary.trustScore * 100)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-border bg-secondary/40 p-5 space-y-3">
              <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                Key Strengths
              </h4>
              <ul className="space-y-2">
                {summary.keyPoints.positive.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-secondary/40 p-5 space-y-3">
              <h4 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
                <ThumbsDown className="h-4 w-4" />
                Common Criticisms
              </h4>
              <ul className="space-y-2">
                {summary.keyPoints.negative.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {summary.themes.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recurring Themes:
              </span>
              {summary.themes.map((theme, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {theme}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
