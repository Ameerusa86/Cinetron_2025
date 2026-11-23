"use client";

import React, { useState, useEffect } from "react";
import { Layers, RefreshCw, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { aiService, IntelligentCollection } from "@/lib/ai-services";
import { MediaCard } from "@/components/media/MediaCard";

export function IntelligentCollections() {
  const [collections, setCollections] = useState<IntelligentCollection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCollections = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await aiService.generateIntelligentCollections();
      setCollections(result);
    } catch (err) {
      setError("Failed to generate collections. Please try again.");
      console.error("Collections generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateCollections();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Intelligent Collections
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Thematic film playlists automatically assembled by AI curation.
          </p>
        </div>

        <button
          type="button"
          onClick={generateCollections}
          disabled={isGenerating}
          className="btn-cinema-outline self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
          <span>Regenerate</span>
        </button>
      </div>

      {isGenerating && collections.length === 0 && (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-medium text-foreground">
            Curating thematic collections...
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 p-6 text-center space-y-3">
          <AlertCircle className="h-6 w-6 text-rose-400 mx-auto" />
          <p className="text-sm text-foreground">{error}</p>
          <button
            type="button"
            onClick={generateCollections}
            className="btn-cinema"
          >
            Try Again
          </button>
        </div>
      )}

      {collections.length > 0 && (
        <div className="space-y-10">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="rounded-2xl border border-border bg-secondary/30 p-5 sm:p-6 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{collection.theme}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {collection.description}
                  </p>
                </div>

                <span className="self-start sm:self-auto rounded-lg border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground">
                  {collection.movies.length} films ·{" "}
                  {Math.round(collection.confidence * 100)}% fit
                </span>
              </div>

              {collection.movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {collection.movies.slice(0, 6).map((movie) => (
                    <MediaCard
                      key={movie.id}
                      id={movie.id}
                      title={movie.title}
                      mediaType="movie"
                      imagePath={movie.poster_path}
                      rating={movie.vote_average}
                      year={movie.release_date}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span>No films loaded for this collection.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
