"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Star,
  Shield,
  Search,
} from "lucide-react";
import { aiService, ReviewSummary } from "@/lib/ai-services";

export function AIReviewsSummary() {
  const [movieTitle, setMovieTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeReviews = async () => {
    if (!movieTitle.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await aiService.summarizeReviews();
      setSummary(result);
    } catch (err) {
      setError("Failed to analyze reviews. Please try again.");
      console.error("Reviews analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment: ReviewSummary["overallSentiment"]) => {
    switch (sentiment) {
      case "positive":
        return "from-green-500 to-emerald-500";
      case "negative":
        return "from-red-500 to-rose-500";
      case "mixed":
        return "from-yellow-500 to-orange-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getSentimentIcon = (sentiment: ReviewSummary["overallSentiment"]) => {
    switch (sentiment) {
      case "positive":
        return TrendingUp;
      case "negative":
        return TrendingDown;
      case "mixed":
        return Minus;
      default:
        return Minus;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          📝 AI Reviews Summary
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Get AI-powered insights from hundreds of movie reviews in seconds
        </p>
      </div>

      {/* Movie Search */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
            placeholder="Enter movie title to analyze reviews... (e.g., 'Inception', 'The Dark Knight')"
            className="w-full p-4 pr-16 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            onKeyPress={(e) => e.key === "Enter" && handleAnalyzeReviews()}
          />
          <button
            onClick={handleAnalyzeReviews}
            disabled={!movieTitle.trim() || isAnalyzing}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all duration-300 ${
              movieTitle.trim() && !isAnalyzing
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
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
              <Search className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Popular Movies Quick Select */}
        <div className="mt-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            💡 Try these popular movies:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "The Dark Knight",
              "Inception",
              "Interstellar",
              "Parasite",
              "Avengers: Endgame",
              "Joker",
            ].map((movie) => (
              <button
                key={movie}
                onClick={() => setMovieTitle(movie)}
                className="px-3 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-600 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
              >
                {movie}
              </button>
            ))}
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
            className="w-20 h-20 mx-auto mb-6 p-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl shadow-xl"
          >
            <FileText className="w-10 h-10 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Analyzing thousands of reviews...
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Our AI is processing and summarizing all available reviews
          </p>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 p-4 bg-red-500/20 rounded-2xl">
            <FileText className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Analysis Failed
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <button
            onClick={handleAnalyzeReviews}
            className="btn-cinema px-6 py-3"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Summary Results */}
      {summary && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Overall Sentiment */}
          <div
            className={`bg-gradient-to-r ${getSentimentColor(
              summary.overallSentiment
            )}/10 rounded-2xl p-6 border border-current/20`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${getSentimentColor(
                  summary.overallSentiment
                )} rounded-2xl flex items-center justify-center`}
              >
                {React.createElement(
                  getSentimentIcon(summary.overallSentiment),
                  {
                    className: "w-6 h-6 text-white",
                  }
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Overall Sentiment:{" "}
                  {summary.overallSentiment.charAt(0).toUpperCase() +
                    summary.overallSentiment.slice(1)}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {summary.rating.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Trust Score: {(summary.trustScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Points */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Positive Points */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="font-bold text-green-800 dark:text-green-400">
                  What Critics Love
                </h4>
              </div>
              <ul className="space-y-2">
                {summary.keyPoints.positive.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300"
                  >
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Neutral Points */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-4">
                <Minus className="w-5 h-5 text-yellow-600" />
                <h4 className="font-bold text-yellow-800 dark:text-yellow-400">
                  Worth Noting
                </h4>
              </div>
              <ul className="space-y-2">
                {summary.keyPoints.neutral.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="flex items-start gap-2 text-sm text-yellow-700 dark:text-yellow-300"
                  >
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Negative Points */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <h4 className="font-bold text-red-800 dark:text-red-400">
                  Common Criticisms
                </h4>
              </div>
              <ul className="space-y-2">
                {summary.keyPoints.negative.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.6 }}
                    className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300"
                  >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Themes */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">
              🎭 Common Themes in Reviews
            </h4>
            <div className="flex flex-wrap gap-2">
              {summary.themes.map((theme, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-sm text-purple-700 dark:text-purple-300 capitalize"
                >
                  #{theme}
                </motion.span>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">
                AI Insights
              </h4>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Based on the analysis of multiple review sources, this movie shows
              a {summary.overallSentiment} reception with a trust score of{" "}
              {(summary.trustScore * 100).toFixed(0)}%. The AI has processed
              sentiment patterns, recurring themes, and critical consensus to
              provide this comprehensive summary.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
