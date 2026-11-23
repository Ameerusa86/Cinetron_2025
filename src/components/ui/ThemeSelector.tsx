"use client";

import React from "react";
import { Sun, Moon, Monitor, Film, Clapperboard, Check } from "lucide-react";
import { useThemeStore } from "@/stores";
import type { Theme } from "@/types";

interface ThemeOption {
  value: Theme;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const themeOptions: ThemeOption[] = [
  {
    value: "dark",
    label: "Cinema Dark",
    icon: Moon,
    description: "Obsidian editorial default",
  },
  {
    value: "light",
    label: "Editorial Light",
    icon: Sun,
    description: "Crisp high-contrast daylight",
  },
  {
    value: "cinema-dark",
    label: "Theater Mode",
    icon: Clapperboard,
    description: "Deep low-glare cinema dark",
  },
  {
    value: "system",
    label: "System",
    icon: Monitor,
    description: "Match OS appearance",
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

  const padding =
    size === "sm" ? "p-3" : size === "lg" ? "p-5" : "p-4";

  return (
    <div className="space-y-3">
      <div
        className={`grid gap-3 ${
          layout === "grid" ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const active =
            theme === option.value ||
            (option.value === "system" && theme === "auto") ||
            (option.value === "light" && theme === "cinema");

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={`${padding} relative flex items-start gap-3 rounded-xl border text-left transition-all cursor-pointer ${
                active
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-foreground/20"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                  active
                    ? "border-primary/40 bg-primary text-white"
                    : "border-border bg-card text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {option.label}
                  </span>
                  {active && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </div>
                {showDescription && (
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                    {option.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {(theme === "system" || theme === "auto") && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Film className="h-3.5 w-3.5 text-primary" />
          Following system preference — currently{" "}
          <span className="font-medium text-foreground">
            {isDark ? "Dark" : "Light"}
          </span>
          .
        </p>
      )}
    </div>
  );
}

export function QuickThemeToggle({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const { toggleTheme, isDark } = useThemeStore();

  const dim =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-10 w-10" : "h-9 w-9";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`${dim} inline-flex items-center justify-center rounded-lg border border-border bg-secondary/70 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors cursor-pointer`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
