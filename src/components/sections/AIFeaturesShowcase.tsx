"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  Image,
  FileText,
  Layers,
  ArrowRight,
} from "lucide-react";
import { AIDemo } from "@/components/demo/AIDemo";

const aiFeatures = [
  {
    icon: Brain,
    title: "Smart Recommendations",
    description: "AI learns your taste for perfect movie suggestions",
    color: "from-blue-500 to-purple-600",
  },
  {
    icon: Sparkles,
    title: "Mood Detection",
    description: "Find movies that match your current mood",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Image,
    title: "Visual Search",
    description: "Upload screenshots to identify any movie",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: FileText,
    title: "AI Reviews",
    description: "Instant summaries of thousands of reviews",
    color: "from-orange-500 to-red-600",
  },
  {
    icon: Layers,
    title: "Smart Collections",
    description: "Auto-curated themed movie collections",
    color: "from-indigo-500 to-blue-600",
  },
];

export function AIFeaturesShowcase() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 xl:px-12 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-blue-500/30">
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
              AI-Powered Features
            </h2>
            <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-purple-500/30">
              <Sparkles className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Experience the future of movie discovery with cutting-edge AI
            technology that understands your preferences
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {aiFeatures.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} p-3 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 text-center group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center line-clamp-2">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section with Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AIDemo />
          </motion.div>

          {/* CTA Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:pt-8"
          >
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl p-8 border border-purple-500/20 backdrop-blur-sm h-full flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Ready to Experience AI-Powered Movie Discovery?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg leading-relaxed">
                Join thousands of users who have discovered their new favorite
                movies through our advanced AI recommendation system. Get
                started in seconds!
              </p>

              {/* Feature Highlights */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Personalized recommendations with 95% accuracy
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Mood-based movie discovery
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Visual search and AI review summaries
                  </span>
                </div>
              </div>

              <Link href="/ai">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-cinema inline-flex items-center gap-2 text-lg px-8 py-4 w-full sm:w-auto justify-center sm:justify-start"
                >
                  <Brain className="w-5 h-5" />
                  Try AI Features Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}
