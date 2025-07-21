"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Camera,
  Image as ImageIcon,
  Search,
  Zap,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { aiService, VisualSearchResult } from "@/lib/ai-services";
import tmdbClient from "@/lib/tmdb-client";
import { createMovieSlug } from "@/lib/slug-utils";

export function VisualSearch() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<VisualSearchResult[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);

    // Start AI analysis
    setIsAnalyzing(true);
    try {
      const searchResults = await aiService.searchByImage();
      setResults(searchResults);
    } catch (error) {
      console.error("Visual search error:", error);
      alert("Failed to analyze image. Please try again.");
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

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  };

  const clearImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setResults([]);
    setIsAnalyzing(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          📷 Visual Search
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Upload a movie scene screenshot and our AI will identify the movie for
          you
        </p>
      </div>

      {/* Upload Area */}
      <div className="max-w-2xl mx-auto mb-8">
        {!selectedImage ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? "border-purple-500 bg-purple-500/10"
                : "border-slate-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-white" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Upload Movie Scene
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Drag and drop an image here, or click to browse
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Upload className="w-5 h-5" />
                  Browse Files
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Camera className="w-5 h-5" />
                  Take Photo
                </button>
              </div>

              <div className="text-sm text-slate-500 dark:text-slate-400">
                Supported formats: JPG, PNG, GIF (Max 10MB)
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="aspect-video relative rounded-2xl overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-800">
              <Image
                src={selectedImage}
                alt="Uploaded scene"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Clear button */}
              <button
                onClick={clearImage}
                className="absolute top-4 right-4 p-2 bg-red-500/80 backdrop-blur-sm text-white rounded-full shadow-lg hover:bg-red-500 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Analysis overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center text-white">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-16 h-16 mx-auto mb-4 p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl"
                    >
                      <Search className="w-8 h-8" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">
                      Analyzing image...
                    </h3>
                    <p className="text-slate-300">
                      AI is scanning the scene for movie matches
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {results.length > 0 && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center">
            🎯 Visual Search Results
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((result, index) => (
              <motion.div
                key={result.movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex gap-4">
                  {/* Movie Poster */}
                  <Link
                    href={`/movie/${createMovieSlug(
                      result.movie.title,
                      result.movie.id
                    )}`}
                    className="flex-shrink-0 group"
                  >
                    <div className="w-24 h-36 relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                      <Image
                        src={
                          tmdbClient.getImageUrl(
                            result.movie.poster_path,
                            "w300"
                          ) || "/placeholder-poster.svg"
                        }
                        alt={result.movie.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="96px"
                      />
                    </div>
                  </Link>

                  {/* Movie Details */}
                  <div className="flex-1 min-w-0">
                    {/* Title and Confidence */}
                    <div className="flex items-start justify-between mb-3">
                      <Link
                        href={`/movie/${createMovieSlug(
                          result.movie.title,
                          result.movie.id
                        )}`}
                        className="group"
                      >
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 line-clamp-2">
                          {result.movie.title}
                        </h3>
                      </Link>
                      <div className="flex-shrink-0 ml-2 p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                        <Zap className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Confidence Score */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Match Confidence:
                      </span>
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        />
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        {(result.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    {/* Match Details */}
                    {result.matchedScene && (
                      <div className="mb-3 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            Matched Scene:
                          </span>
                          <span className="ml-2 text-slate-600 dark:text-slate-400">
                            {result.matchedScene}
                          </span>
                        </div>
                        {result.timestamp && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Timestamp: {result.timestamp}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Movie Stats */}
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span>{result.movie.vote_average.toFixed(1)}</span>
                      </div>
                      <div>
                        {new Date(result.movie.release_date).getFullYear()}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Try Again Button */}
          <div className="text-center">
            <button onClick={clearImage} className="btn-glass px-6 py-3">
              Try Another Image
            </button>
          </div>
        </motion.div>
      )}

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20"
      >
        <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
          💡 Tips for better results:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span>Use clear, high-quality images</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            <span>Include recognizable characters or scenes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span>Avoid heavily filtered or edited images</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
            <span>Screenshots work better than promotional images</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
