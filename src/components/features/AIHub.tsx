"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  ScanSearch,
  FileText,
  Layers,
} from "lucide-react";

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

const features = [
  {
    id: "recommendations" as AIFeature,
    title: "Recommendations",
    description: "Calibrated picks for your taste",
    icon: Brain,
    component: SmartRecommendations,
  },
  {
    id: "mood" as AIFeature,
    title: "Mood Matcher",
    description: "Natural-language vibe search",
    icon: Sparkles,
    component: MoodDetector,
  },
  {
    id: "visual" as AIFeature,
    title: "Visual Search",
    description: "Identify titles from stills",
    icon: ScanSearch,
    component: VisualSearch,
  },
  {
    id: "reviews" as AIFeature,
    title: "Review Synthesis",
    description: "Instant critic & audience digest",
    icon: FileText,
    component: AIReviewsSummary,
  },
  {
    id: "collections" as AIFeature,
    title: "Collections",
    description: "Curated thematic playlists",
    icon: Layers,
    component: IntelligentCollections,
  },
];

export function AIHub() {
  const [activeFeature, setActiveFeature] =
    useState<AIFeature>("recommendations");

  const ActiveComponent = features.find(
    (f) => f.id === activeFeature
  )?.component;

  return (
    <div className="w-full space-y-8">
      {/* Feature Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeFeature === feature.id;

          return (
            <button
              key={feature.id}
              type="button"
              onClick={() => setActiveFeature(feature.id)}
              className={`group flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-card hover:border-foreground/20 hover:bg-accent/40"
              }`}
            >
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-secondary text-foreground group-hover:border-primary/40 group-hover:text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-bold text-foreground">
                {feature.title}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                {feature.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Studio Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFeature}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="surface-card p-6 sm:p-8"
        >
          {ActiveComponent && <ActiveComponent />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
