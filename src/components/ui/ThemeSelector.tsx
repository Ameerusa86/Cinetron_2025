"use client";

import React from "react";
import { useThemeStore } from "@/stores";
import type { Theme } from "@/types";

interface ThemeOption {
  value: Theme;
  label: string;
  icon: string;
  description: string;
  gradient?: string;
}

const themeOptions: ThemeOption[] = [
  {
    value: "light",
    label: "Light",
    icon: "☀️",
    description: "Clean and bright interface",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    value: "dark",
    label: "Dark",
    icon: "🌙",
    description: "Easy on the eyes",
    gradient: "from-blue-600 to-purple-600",
  },
  {
    value: "cinema",
    label: "Cinema Light",
    icon: "🎬",
    description: "Premium movie experience",
    gradient: "from-red-500 to-yellow-500",
  },
  {
    value: "cinema-dark",
    label: "Cinema Dark",
    icon: "🎭",
    description: "Immersive theater mode",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    value: "system",
    label: "System",
    icon: "🖥️",
    description: "Follow system preference",
    gradient: "from-gray-500 to-gray-700",
  },
  {
    value: "auto",
    label: "Auto",
    icon: "🔄",
    description: "Adapts automatically",
    gradient: "from-teal-500 to-blue-500",
  },
];

interface ThemeSelectorProps {
  showDescription?: boolean;
  layout?: "grid" | "list";
  size?: "sm" | "md" | "lg";
}

export default function ThemeSelector({
  showDescription = true,
  layout = "grid",
  size = "md",
}: ThemeSelectorProps) {
  const { theme, setTheme, isDark } = useThemeStore();

  const sizeClasses = {
    sm: "text-xs p-3",
    md: "text-sm p-4",
    lg: "text-base p-5",
  };

  const iconSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Theme Preference
        </h3>
        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
          <span>Current:</span>
          <div className="flex items-center space-x-1">
            <span>{themeOptions.find((opt) => opt.value === theme)?.icon}</span>
            <span className="font-medium">
              {themeOptions.find((opt) => opt.value === theme)?.label}
            </span>
            {(theme === "system" || theme === "auto") && (
              <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                {isDark ? "Dark" : "Light"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        className={`
        grid gap-3
        ${layout === "grid" ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"}
      `}
      >
        {themeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`
              ${sizeClasses[size]}
              group relative overflow-hidden rounded-xl border-2 transition-all duration-300 text-left
              ${
                theme === option.value
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg scale-105"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-25 dark:hover:bg-purple-900/10 hover:scale-102"
              }
            `}
          >
            {/* Background gradient overlay */}
            <div
              className={`
              absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300
              bg-gradient-to-br ${option.gradient}
            `}
            />

            {/* Content */}
            <div className="relative z-10 flex items-start space-x-3">
              <div
                className={`
                ${
                  iconSizes[size]
                } transition-transform duration-300 group-hover:scale-110
                ${theme === option.value ? "animate-pulse" : ""}
              `}
              >
                {option.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4
                    className={`
                    font-semibold text-slate-900 dark:text-white
                    ${
                      theme === option.value
                        ? "text-purple-700 dark:text-purple-300"
                        : ""
                    }
                  `}
                  >
                    {option.label}
                  </h4>

                  {theme === option.value && (
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  )}
                </div>

                {showDescription && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {option.description}
                  </p>
                )}
              </div>
            </div>

            {/* Ripple effect on click */}
            <div className="absolute inset-0 opacity-0 group-active:opacity-20 bg-purple-500 transition-opacity duration-150" />
          </button>
        ))}
      </div>

      {/* System preference info */}
      {(theme === "system" || theme === "auto") && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 mt-0.5">ℹ️</span>
            <div className="text-sm">
              <p className="text-blue-700 dark:text-blue-300 font-medium">
                Following system preference
              </p>
              <p className="text-blue-600 dark:text-blue-400 mt-1">
                Your system is currently set to{" "}
                <strong>{isDark ? "dark" : "light"}</strong> mode. The theme
                will automatically change when you update your system
                preferences.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview section for cinema themes */}
      {(theme === "cinema" || theme === "cinema-dark") && (
        <div className="bg-gradient-to-r from-red-50 to-yellow-50 dark:from-red-900/20 dark:to-yellow-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <span className="text-red-500 mt-0.5">🎬</span>
            <div className="text-sm">
              <p className="text-red-700 dark:text-red-300 font-medium">
                Premium Cinema Experience
              </p>
              <p className="text-red-600 dark:text-red-400 mt-1">
                Enjoy enhanced colors and movie-theater-inspired design elements
                for the ultimate viewing experience.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick theme toggle component for headers/navbars
export function QuickThemeToggle({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const { theme, toggleTheme, isDark } = useThemeStore();

  const sizeClasses = {
    sm: "p-1.5 text-sm",
    md: "p-2 text-base",
    lg: "p-3 text-lg",
  };

  const currentTheme = themeOptions.find((opt) => opt.value === theme);

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300
        hover:bg-slate-200 dark:hover:bg-slate-700 
        hover:text-slate-900 dark:hover:text-white
        transition-all duration-300 group relative
      `}
      title={`Current: ${currentTheme?.label}${
        theme === "system" || theme === "auto"
          ? ` (${isDark ? "Dark" : "Light"})`
          : ""
      } - Click to toggle`}
    >
      <span className="transition-transform duration-300 group-hover:scale-110 block">
        {currentTheme?.icon || "🌓"}
      </span>
    </button>
  );
}
