"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Send,
  Brain,
  Heart,
  Zap,
  Sun,
  Moon,
  Coffee,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { aiService, MoodAnalysis } from "@/lib/ai-services";
import { Movie } from "@/types";
import tmdbClient from "@/lib/tmdb-client";
import { createMovieSlug } from "@/lib/slug-utils";

const moodSuggestions = [
  { emoji: "😊", text: "happy and energetic", icon: Sun },
  { emoji: "😢", text: "sad and looking for comfort", icon: Heart },
  { emoji: "⚡", text: "excited and want action", icon: Zap },
  { emoji: "🌙", text: "relaxed and contemplative", icon: Moon },
  { emoji: "☕", text: "cozy evening at home", icon: Coffee },
];

export function MoodDetector() {
  const [moodInput, setMoodInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);

  const handleMoodAnalysis = async () => {
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

  const handleSuggestionClick = (suggestion: string) => {
    setMoodInput(suggestion);
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          ✨ Movie Mood Detector
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Tell us how you&apos;re feeling, and our AI will find the perfect
          movies to match your mood
        </p>
      </div>

      {/* Mood Input */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <textarea
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            placeholder="Describe your current mood... (e.g., 'I'm feeling nostalgic and want something heartwarming' or 'I need an adrenaline rush!')"
            className="w-full p-4 pr-16 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            rows={4}
          />
          <button
            onClick={handleMoodAnalysis}
            disabled={!moodInput.trim() || isAnalyzing}
            className={`absolute bottom-4 right-4 p-3 rounded-xl transition-all duration-300 ${
              moodInput.trim() && !isAnalyzing
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
                : "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            }`}
          >
            {isAnalyzing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-5 h-5" />
              </motion.div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mood Suggestions */}
        <div className="mt-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            💡 Quick suggestions:
          </p>
          <div className="flex flex-wrap gap-2">
            {moodSuggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <button
                  key={index}
                  onClick={() =>
                    handleSuggestionClick(`I'm feeling ${suggestion.text}`)
                  }
                  className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-600 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                  <span>{suggestion.emoji}</span>
                  <span>{suggestion.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Analysis Loading */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-6 p-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-xl"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Analyzing your mood...
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Our AI is processing your feelings and finding the perfect movies
          </p>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysis && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Mood Analysis Card */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Mood Analysis Results
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  AI Confidence: {(analysis.confidence * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Detected Mood
                </h4>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <span className="text-lg font-medium text-purple-600 dark:text-purple-400 capitalize">
                    {analysis.primaryMood}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Recommended Tone
                </h4>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <span className="text-lg font-medium text-pink-600 dark:text-pink-400 capitalize">
                    {analysis.suggestedTone}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Perfect Genres for You
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.recommendedGenres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-sm text-purple-700 dark:text-purple-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Movie Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                🎬 Perfect Movies for Your Mood
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Link
                      href={`/movie/${createMovieSlug(movie.title, movie.id)}`}
                    >
                      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                        <div className="aspect-[2/3] relative overflow-hidden">
                          <Image
                            src={
                              tmdbClient.getImageUrl(
                                movie.poster_path,
                                "w500"
                              ) || "/placeholder-poster.svg"
                            }
                            alt={movie.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                            {movie.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                            {movie.overview}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <span>⭐ {movie.vote_average.toFixed(1)}</span>
                            <span>•</span>
                            <span>
                              {new Date(movie.release_date).getFullYear()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
