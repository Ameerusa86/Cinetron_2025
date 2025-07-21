"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Image, FileText, Layers, Zap } from "lucide-react";

// Sub-components for different AI features
import { SmartRecommendations } from "./SmartRecommendations";
import { MoodDetector } from "./MoodDetector";
import { VisualSearch } from "./VisualSearch";
import { AIReviewsSummary } from "./AIReviewsSummary";
import { IntelligentCollections } from "./IntelligentCollections";

type AIFeature =
  | "recommendations"
  | "mood"
  | "visual"
  | "reviews"
  | "collections";

export function AIHub() {
  const [activeFeature, setActiveFeature] =
    useState<AIFeature>("recommendations");

  const features = [
    {
      id: "recommendations" as AIFeature,
      title: "Smart Recommendations",
      description: "AI that learns from your viewing patterns",
      icon: Brain,
      color: "from-blue-500 to-purple-600",
      component: SmartRecommendations,
    },
    {
      id: "mood" as AIFeature,
      title: "Movie Mood Detector",
      description: "Find movies for your current mood",
      icon: Sparkles,
      color: "from-pink-500 to-rose-600",
      component: MoodDetector,
    },
    {
      id: "visual" as AIFeature,
      title: "Visual Search",
      description: "Upload a scene to find the movie",
      icon: Image,
      color: "from-green-500 to-emerald-600",
      component: VisualSearch,
    },
    {
      id: "reviews" as AIFeature,
      title: "AI Reviews Summary",
      description: "Key points from hundreds of reviews",
      icon: FileText,
      color: "from-orange-500 to-red-600",
      component: AIReviewsSummary,
    },
    {
      id: "collections" as AIFeature,
      title: "Intelligent Collections",
      description: "Auto-generated themed collections",
      icon: Layers,
      color: "from-indigo-500 to-blue-600",
      component: IntelligentCollections,
    },
  ];

  const ActiveComponent = features.find(
    (f) => f.id === activeFeature
  )?.component;

  return (
    <div className="w-full">
      {/* AI Hub Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border border-purple-500/30">
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-gradient-premium">
            AI-Powered Features
          </h1>
          <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-blue-500/30">
            <Zap className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Experience the future of movie discovery with our cutting-edge AI
          technology
        </p>
      </motion.div>

      {/* Feature Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isActive = activeFeature === feature.id;

          return (
            <motion.button
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveFeature(feature.id)}
              className={`relative p-6 rounded-2xl transition-all duration-500 group ${
                isActive
                  ? "bg-white dark:bg-slate-800 shadow-2xl scale-105 border-2 border-purple-500/50"
                  : "bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 shadow-lg hover:shadow-xl hover:scale-102 border border-slate-200 dark:border-slate-700"
              }`}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Icon */}
              <div
                className={`w-12 h-12 mx-auto mb-4 p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <h3
                className={`font-semibold text-lg mb-2 transition-colors duration-300 ${
                  isActive
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {feature.description}
              </p>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeFeature"
                  className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Zap className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Active Feature Component */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFeature}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="bg-white dark:bg-slate-800/50 rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-slate-200 dark:border-slate-700"
        >
          {ActiveComponent && <ActiveComponent />}
        </motion.div>
      </AnimatePresence>

      {/* AI Status Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm rounded-full px-4 py-2 text-white shadow-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium">AI Online</span>
        </div>
      </motion.div>
    </div>
  );
}
