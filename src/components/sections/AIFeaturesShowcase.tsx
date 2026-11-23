"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Brain,
  Sparkles,
  ScanSearch,
  FileText,
  Layers,
  ArrowRight,
  Send,
} from "lucide-react";

const aiCapabilities = [
  {
    icon: Brain,
    title: "Smart Recommendations",
    description:
      "Tailored film picks calibrated from your watchlist and viewing history.",
    tag: "Personalization",
  },
  {
    icon: Sparkles,
    title: "Mood Discovery",
    description:
      "Describe your vibe in plain language and get matched with the right tone.",
    tag: "Natural Language",
  },
  {
    icon: ScanSearch,
    title: "Visual Scene Search",
    description:
      "Upload a frame or poster to identify titles and similar cinematography.",
    tag: "Vision",
  },
  {
    icon: FileText,
    title: "Review Synthesis",
    description:
      "Distill audience consensus, highlights, and recurring themes at a glance.",
    tag: "Analysis",
  },
  {
    icon: Layers,
    title: "Curated Collections",
    description:
      "Auto-assembled thematic double features and director-inspired lists.",
    tag: "Curation",
  },
];

const quickPrompts = [
  "Slow-burn neo-noir thriller",
  "Uplifting indie comedy",
  "Mind-bending sci-fi classic",
];

export function AIFeaturesShowcase() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = prompt.trim();
    if (!q) {
      router.push("/ai");
      return;
    }
    router.push(`/discover?mood=${encodeURIComponent(q)}`);
  };

  return (
    <section className="py-16 sm:py-20 border-y border-border bg-card/40">
      <div className="container-cinema">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Cinema Studio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Intelligent film discovery,{" "}
              <span className="font-display italic font-semibold text-primary">
                tuned to your mood
              </span>
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              Skip endless scrolling. Combine live TMDB metadata with Gemini AI
              to uncover hidden gems, synthesize reviews, and curate custom
              collections.
            </p>
          </div>

          <Link href="/ai" className="btn-cinema shrink-0 self-start md:self-auto">
            <span>Open AI Studio</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Interactive Mood Prompt Bar */}
        <div className="mb-10 rounded-2xl border border-border bg-card p-4 sm:p-5">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Sparkles className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask Cinetron AI — e.g. 'Atmospheric sci-fi with a great score for a rainy night'"
                className="w-full rounded-xl border border-border bg-secondary/70 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button type="submit" className="btn-cinema shrink-0 px-6">
              <Send className="h-4 w-4" />
              <span>Find Films</span>
            </button>
          </form>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {quickPrompts.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  router.push(`/discover?mood=${encodeURIComponent(item)}`)
                }
                className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {aiCapabilities.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href="/ai"
                className="group surface-card-interactive p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary text-foreground group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  <span>Launch</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
