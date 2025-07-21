"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
  Clock,
  Zap,
  Heart,
  TrendingUp,
} from "lucide-react";
import { aiService, IntelligentCollection } from "@/lib/ai-services";

const collectionIcons = {
  discovery: Eye,
  wellness: Heart,
  "binge-worthy": Clock,
  trending: TrendingUp,
  adventure: Zap,
  romance: Heart,
  thriller: Zap,
};

const collectionColors = {
  discovery: "from-purple-500 to-indigo-600",
  wellness: "from-pink-500 to-rose-600",
  "binge-worthy": "from-blue-500 to-cyan-600",
  trending: "from-orange-500 to-red-600",
  adventure: "from-green-500 to-emerald-600",
  romance: "from-pink-500 to-purple-600",
  thriller: "from-red-500 to-orange-600",
};

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

  const getCollectionIcon = (theme: string) => {
    return collectionIcons[theme as keyof typeof collectionIcons] || Layers;
  };

  const getCollectionColor = (theme: string) => {
    return (
      collectionColors[theme as keyof typeof collectionColors] ||
      "from-gray-500 to-slate-600"
    );
  };

  if (isGenerating && collections.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-6 p-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-xl"
        >
          <Layers className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          AI is creating personalized collections...
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Analyzing your preferences to curate the perfect movie collections
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 p-4 bg-red-500/20 rounded-2xl">
          <Layers className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">
          Generation Failed
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
        <button onClick={generateCollections} className="btn-cinema px-6 py-3">
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
            🗂️ Intelligent Collections
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            AI-curated movie collections tailored specifically for your taste
          </p>
        </div>
        <button
          onClick={generateCollections}
          disabled={isGenerating}
          className="btn-glass flex items-center gap-2 px-4 py-2 text-sm"
        >
          <RefreshCw
            className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
          />
          Regenerate
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection, index) => {
          const Icon = getCollectionIcon(collection.theme);
          const colorClass = getCollectionColor(collection.theme);

          return (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 dark:border-slate-700"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Content */}
              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* AI Confidence Badge */}
                  <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {(collection.confidence * 100).toFixed(0)}% match
                    </span>
                  </div>
                </div>

                {/* Collection Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                    {collection.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                    {collection.description}
                  </p>
                </div>

                {/* Collection Stats */}
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Layers className="w-4 h-4" />
                    <span>{collection.movies.length} movies</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Fresh</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      AI Curation Progress
                    </span>
                    <span className="text-xs text-slate-500">
                      {(collection.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${collection.confidence * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-1.5 bg-gradient-to-r ${colorClass} rounded-full`}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105">
                    View Collection
                  </button>
                  <button
                    className={`px-4 py-2 bg-gradient-to-r ${colorClass} text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                  >
                    Explore
                  </button>
                </div>

                {/* Generated Time */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Generated by AI</span>
                    <span>
                      {new Date(collection.generatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          );
        })}
      </div>

      {/* AI Learning Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 space-y-6"
      >
        {/* How It Works */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">
              How AI Creates Your Collections
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-slate-900 dark:text-white">
                  Analyze Patterns:
                </span>
                <span className="text-slate-600 dark:text-slate-400 ml-1">
                  Studies your viewing history and preferences
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-slate-900 dark:text-white">
                  Find Connections:
                </span>
                <span className="text-slate-600 dark:text-slate-400 ml-1">
                  Discovers hidden relationships between movies
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <span className="font-medium text-slate-900 dark:text-white">
                  Curate Collections:
                </span>
                <span className="text-slate-600 dark:text-slate-400 ml-1">
                  Creates themed collections just for you
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Themes */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">
            🎨 Collection Themes Available
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(collectionIcons).map(([theme, Icon]) => (
              <div
                key={theme}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-700"
              >
                <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                  {theme.replace("-", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
