"use client";

import React from "react";
import ThemeSelector, { QuickThemeToggle } from "@/components/ui/ThemeSelector";
import { useThemeStore } from "@/stores";
import { PageHeader } from "@/components/media/PageHeader";

export default function ThemeTestPage() {
  const { theme, isDark } = useThemeStore();

  return (
    <div className="min-h-screen w-full">
      <PageHeader
        eyebrow="Design System"
        title="Theme"
        accentWord="Preview"
        description="Inspect Cinetron's Cinema Editorial Dark and Editorial Light surface tokens and interactive states."
      >
        <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2 text-xs">
          <span className="text-muted-foreground">Active:</span>
          <code className="font-mono font-semibold text-primary">{theme}</code>
          <span className="text-muted-foreground">
            ({isDark ? "Dark" : "Light"})
          </span>
          <QuickThemeToggle size="sm" />
        </div>
      </PageHeader>

      <section className="py-10">
        <div className="container-cinema max-w-4xl space-y-8">
          <div className="surface-card p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Theme Selector</h2>
            <ThemeSelector />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="surface-card p-6 space-y-4">
              <h3 className="text-base font-bold text-foreground">
                Brand &amp; Semantic Tokens
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-primary" />
                  <span>Primary Crimson</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-amber-400" />
                  <span>Rating Gold</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-card border border-border" />
                  <span>Card Surface</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-secondary border border-border" />
                  <span>Subtle Surface</span>
                </div>
              </div>
            </div>

            <div className="surface-card p-6 space-y-4">
              <h3 className="text-base font-bold text-foreground">
                Button Hierarchy
              </h3>
              <div className="flex flex-wrap gap-3">
                <button type="button" className="btn-cinema">
                  Primary Action
                </button>
                <button type="button" className="btn-cinema-outline">
                  Secondary Action
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
