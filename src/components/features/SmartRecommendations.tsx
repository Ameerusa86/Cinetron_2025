"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Star, Users, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
      setError("Failed to fetch AI recommendations. Please try again.");
      console.error("AI Recommendations error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const getCategoryIcon = (category: AIRecommendation["category"]) => {
    const icons = {
      genre_match: Star,
      actor_preference: Users,
      mood_based: Sparkles,
      similar_users: Users,
      trending: TrendingUp,
    };
    return icons[category] || Brain;
  };

  const getCategoryColor = (category: AIRecommendation["category"]) => {
    const colors = {
      genre_match: "from-yellow-500 to-orange-500",
      actor_preference: "from-blue-500 to-indigo-500",
      mood_based: "from-pink-500 to-purple-500",
      similar_users: "from-green-500 to-emerald-500",
      trending: "from-red-500 to-rose-500",
    };
    return colors[category] || "from-gray-500 to-slate-500";
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-4 p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl"
        >
          <Brain className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          AI is analyzing your preferences...
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          This may take a few moments while we process your viewing patterns
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 p-4 bg-red-500/20 rounded-2xl">
          <Brain className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
        <button onClick={fetchRecommendations} className="btn-cinema px-6 py-3">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            🧠 Smart Recommendations
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Personalized movie suggestions powered by AI learning from your
            viewing patterns
          </p>
        </div>
        <button
          onClick={fetchRecommendations}
          disabled={isLoading}
          className="btn-glass flex items-center gap-2 px-4 py-2 text-sm"
        >
          <Brain className="w-4 h-4" />
          Refresh AI
        </button>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((recommendation, index) => {
          const CategoryIcon = getCategoryIcon(recommendation.category);

          return (
            <motion.div
              key={recommendation.movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex gap-4">
                {/* Movie Poster */}
                <Link
                  href={`/movie/${createMovieSlug(
                    recommendation.movie.title,
                    recommendation.movie.id
                  )}`}
                  className="flex-shrink-0 group"
                >
                  <div className="w-24 h-36 relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <Image
                      src={
                        tmdbClient.getImageUrl(
                          recommendation.movie.poster_path,
                          "w300"
                        ) || "/placeholder-poster.svg"
                      }
                      alt={recommendation.movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="96px"
                    />
                  </div>
                </Link>

                {/* Movie Details */}
                <div className="flex-1 min-w-0">
                  {/* Title and Category */}
                  <div className="flex items-start justify-between mb-3">
                    <Link
                      href={`/movie/${createMovieSlug(
                        recommendation.movie.title,
                        recommendation.movie.id
                      )}`}
                      className="group"
                    >
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 line-clamp-2">
                        {recommendation.movie.title}
                      </h3>
                    </Link>
                    <div
                      className={`flex-shrink-0 ml-2 p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(
                        recommendation.category
                      )} text-white shadow-lg`}
                    >
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      AI Confidence:
                    </span>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${recommendation.confidence * 100}%`,
                        }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                      />
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {(recommendation.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  {/* AI Reasons */}
                  <div className="space-y-1 mb-3">
                    {recommendation.reasons
                      .slice(0, 2)
                      .map((reason, reasonIndex) => (
                        <div
                          key={reasonIndex}
                          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                        >
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0" />
                          <span className="line-clamp-1">{reason}</span>
                        </div>
                      ))}
                  </div>

                  {/* Movie Stats */}
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>
                        {recommendation.movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                    <div>
                      {new Date(
                        recommendation.movie.release_date
                      ).getFullYear()}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Learning Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              AI Learning Progress
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              The more you interact with movies, the smarter our recommendations
              become!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
