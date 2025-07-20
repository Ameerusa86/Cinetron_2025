"use client";

import React from "react";
import ThemeSelector, { QuickThemeToggle } from "@/components/ui/ThemeSelector";
import { useThemeStore } from "@/stores";

export default function ThemeTestPage() {
  const { theme, isDark } = useThemeStore();

  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-premium">
            Theme System Test
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Test all theme variations and components
          </p>
          <div className="inline-flex items-center space-x-4 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <span className="text-sm font-medium">Current Theme:</span>
            <code className="text-blue-600 dark:text-blue-400 font-mono">
              {theme}
            </code>
            <span className="text-xs text-slate-500">
              ({isDark ? "Dark" : "Light"} Mode)
            </span>
          </div>
        </div>

        {/* Quick Theme Toggle */}
        <div className="flex items-center justify-center space-x-4">
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            Quick Toggle:
          </span>
          <QuickThemeToggle size="sm" />
          <QuickThemeToggle size="md" />
          <QuickThemeToggle size="lg" />
        </div>

        {/* Full Theme Selector */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
            Full Theme Selector
          </h2>
          <ThemeSelector />
        </div>

        {/* Color Palette Test */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Colors */}
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
              Primary Colors
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-cinema rounded-lg shadow-lg"></div>
                <span className="text-slate-700 dark:text-slate-300">
                  Cinema Gradient
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500 rounded-lg shadow-lg"></div>
                <span className="text-slate-700 dark:text-slate-300">
                  Orange 500
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg shadow-lg"></div>
                <span className="text-slate-700 dark:text-slate-300">
                  Blue 500
                </span>
              </div>
            </div>
          </div>

          {/* Surface Colors */}
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
              Surface Colors
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700"></div>
                <span className="text-slate-700 dark:text-slate-300">
                  Surface
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600"></div>
                <span className="text-slate-700 dark:text-slate-300">
                  Surface Variant
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700"></div>
                <span className="text-slate-700 dark:text-slate-300">
                  Background
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Button Test */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
            Button Styles
          </h3>
          <div className="flex flex-wrap gap-4">
            <button className="btn-cinema">Cinema Button</button>
            <button className="btn-cinema-outline">Cinema Outline</button>
            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              Primary Button
            </button>
            <button className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg transition-colors">
              Secondary Button
            </button>
          </div>
        </div>

        {/* Card Test */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 group"
            >
              <div className="w-full h-32 bg-gradient-cinema rounded-lg mb-4 group-hover:shadow-glow transition-all duration-300"></div>
              <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                Test Card {i}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                This is a test card to show how different elements look with the
                current theme.
              </p>
            </div>
          ))}
        </div>

        {/* Text Styles Test */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
            Typography
          </h3>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gradient-premium">
              Heading 1 - Gradient
            </h1>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
              Heading 2 - Standard
            </h2>
            <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">
              Heading 3 - Semibold
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Large paragraph text with good contrast
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Regular paragraph text that should be readable in both light and
              dark modes.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Small text like captions or metadata
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
