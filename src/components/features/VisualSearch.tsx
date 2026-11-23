"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  ScanSearch,
  X,
  Loader2,
  Star,
  Clock,
  Film,
} from "lucide-react";
import { aiService, VisualSearchResult } from "@/lib/ai-services";
import tmdbClient from "@/lib/tmdb-client";
import { createMovieSlug } from "@/lib/slug-utils";
import { useNotificationStore } from "@/stores";

export function VisualSearch() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<VisualSearchResult[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotificationStore();

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      addNotification({
        type: "error",
        title: "Unsupported File",
        message: "Please upload a valid PNG, JPG, or WebP image.",
        read: false,
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);
    setIsAnalyzing(true);

    try {
      const searchResults = await aiService.searchByImage();
      setResults(searchResults);
    } catch (error) {
      console.error("Visual search error:", error);
      addNotification({
        type: "error",
        title: "Analysis Failed",
        message: "Unable to analyze this image right now. Please try again.",
        read: false,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  const clearImage = () => {
    if (selectedImage) URL.revokeObjectURL(selectedImage);
    setSelectedImage(null);
    setResults([]);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Visual Scene Search
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Upload a frame, still, or movie poster to identify matching films.
        </p>
      </div>

      {/* Upload Dropzone */}
      <div className="max-w-2xl">
        {!selectedImage ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/10"
                : "border-border bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              className="hidden"
            />
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-primary">
              <Upload className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              Drop a movie frame here or click to browse
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Supports PNG, JPG, and WebP screenshots
            </p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary">
            <div className="relative aspect-video w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt="Uploaded movie scene"
                className="h-full w-full object-contain bg-black"
              />
            </div>
            <button
              type="button"
              onClick={clearImage}
              aria-label="Remove image"
              className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black/80 text-white hover:bg-primary transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm text-white">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-sm font-semibold">Analyzing scene...</p>
                <p className="text-xs text-zinc-300 mt-0.5">
                  Comparing visual signatures
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Match Results */}
      {!isAnalyzing && results.length > 0 && (
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ScanSearch className="h-3.5 w-3.5" />
            <span>Identified Matches ({results.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((res, idx) => {
              const poster = tmdbClient.getImageUrl(
                res.movie.poster_path,
                "w342"
              );
              return (
                <Link
                  key={`${res.movie.id}-${idx}`}
                  href={`/movie/${createMovieSlug(res.movie.title, res.movie.id)}`}
                  className="group flex gap-4 rounded-xl border border-border bg-secondary/40 p-4 hover:border-foreground/20 transition-all"
                >
                  <div className="relative h-32 w-22 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                    {poster ? (
                      <Image
                        src={poster}
                        alt={res.movie.title}
                        fill
                        sizes="88px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Film className="h-6 w-6 opacity-40" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {res.movie.title}
                      </h3>
                      <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400 shrink-0">
                        {Math.round(res.confidence * 100)}%
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
                      {res.movie.vote_average > 0 && (
                        <span className="inline-flex items-center gap-1 text-foreground">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {res.movie.vote_average.toFixed(1)}
                        </span>
                      )}
                      {res.timestamp && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {res.timestamp}
                        </span>
                      )}
                    </div>

                    {res.matchedScene && (
                      <p className="text-xs text-muted-foreground">
                        Scene context:{" "}
                        <span className="text-foreground">
                          {res.matchedScene}
                        </span>
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
