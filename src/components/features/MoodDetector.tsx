"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  Sun,
  Heart,
  Zap,
  Moon,
  Coffee,
  Loader2,
} from "lucide-react";
import { aiService, MoodAnalysis } from "@/lib/ai-services";
import { Movie } from "@/types";
import { MediaCard } from "@/components/media/MediaCard";

const moodSuggestions = [
  { text: "Uplifting and lighthearted", icon: Sun },
  { text: "Emotional and comforting", icon: Heart },
  { text: "Fast-paced adrenaline thriller", icon: Zap },
  { text: "Atmospheric, slow-burn mystery", icon: Moon },
  { text: "Cozy rainy-evening indie", icon: Coffee },
];

export function MoodDetector() {
  const [moodInput, setMoodInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);

  const handleMoodAnalysis = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!moodInput.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await aiService.detectMoodAndRecommend(moodInput);
      setAnalysis(result.analysis);
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error("Mood analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Movie Mood Matcher
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Describe how you feel or the exact atmosphere you want to watch
          tonight.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleMoodAnalysis} className="space-y-4">
        <div className="relative">
          <textarea
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            placeholder="e.g., 'I want a visually stunning sci-fi with a haunting score' or 'Something clever and warm after a long week'"
            rows={3}
            className="w-full rounded-xl border border-border bg-secondary/50 p-4 pr-36 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
          <button
            type="submit"
            disabled={!moodInput.trim() || isAnalyzing}
            className="btn-cinema absolute bottom-3 right-3 px-4 py-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Matching...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Match</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Presets:</span>
          {moodSuggestions.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.text}
                type="button"
                onClick={() => setMoodInput(s.text)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span>{s.text}</span>
              </button>
            );
          })}
        </div>
      </form>

      {/* Mood Breakdown */}
      {analysis && (
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Detected Profile</span>
            </div>
            <p className="text-base font-bold text-foreground capitalize">
              {analysis.primaryMood} ·{" "}
              <span className="font-normal text-muted-foreground">
                {analysis.suggestedTone} tone
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {analysis.recommendedGenres.slice(0, 3).map((g, i) => (
              <span
                key={i}
                className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground"
              >
                {g}
              </span>
            ))}
            <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-400">
              {Math.round(analysis.confidence * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Matched Movies */}
      {recommendations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recommendations.map((movie) => (
            <MediaCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              mediaType="movie"
              imagePath={movie.poster_path}
              rating={movie.vote_average}
              year={movie.release_date}
              badge="Mood Pick"
            />
          ))}
        </div>
      )}
    </div>
  );
}
