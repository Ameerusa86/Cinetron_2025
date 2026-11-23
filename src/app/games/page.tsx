"use client";

import React from "react";
import Link from "next/link";
import {
  Clapperboard,
  Grid3X3,
  TrendingUp,
  Brain,
  ArrowRight,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/media/PageHeader";

const games = [
  {
    id: "quiz",
    title: "Movie Quiz Generator",
    description:
      "Test your cinema knowledge with timed, multi-difficulty quizzes generated from real TMDB film metadata.",
    icon: Clapperboard,
    href: "/games/quiz",
    difficulty: "Easy · Medium · Hard",
    players: "Single Player",
  },
  {
    id: "bingo",
    title: "Movie Night Bingo",
    description:
      "Interactive 5×5 trope boards for Action, Horror, Comedy, Sci-Fi, and Romance movie nights.",
    icon: Grid3X3,
    href: "/games/bingo",
    difficulty: "All Levels",
    players: "Solo or Group",
  },
  {
    id: "prediction",
    title: "Box Office & Awards Predictions",
    description:
      "Forecast opening weekends, critical consensus, and awards outcomes for upcoming theatrical releases.",
    icon: TrendingUp,
    href: "/games/prediction",
    difficulty: "Strategic",
    players: "Competitive",
  },
  {
    id: "trivia",
    title: "Daily Cinema Trivia",
    description:
      "AI-crafted trivia spanning iconic quotes, film history, directors, and behind-the-scenes craft.",
    icon: Brain,
    href: "/games/trivia",
    difficulty: "Adaptive",
    players: "Daily Streaks",
  },
];

const highlights = [
  {
    icon: Sparkles,
    title: "Live Cinema Data",
    description:
      "Quizzes and predictions pull directly from up-to-date TMDB releases and Gemini AI.",
  },
  {
    icon: Trophy,
    title: "Instant Scoring",
    description:
      "Track streaks, win lines, accuracy percentages, and prediction confidence effortlessly.",
  },
  {
    icon: Users,
    title: "Built for Movie Nights",
    description:
      "Play solo during credits or cast Bingo and Trivia on the living-room screen with friends.",
  },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen w-full">
      <PageHeader
        eyebrow="Interactive Hub"
        title="Cinema"
        accentWord="Games"
        description="Challenge your film instincts with timed quizzes, movie-night bingo boards, live slate predictions, and daily trivia."
      />

      {/* Games Grid */}
      <section className="py-12">
        <div className="container-cinema space-y-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => {
              const Icon = game.icon;
              return (
                <Link
                  key={game.id}
                  href={game.href}
                  className="group surface-card-interactive p-7 flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-secondary text-foreground group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {game.difficulty}
                        </span>
                        <span className="rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {game.players}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {game.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      Launch Game
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Highlights */}
          <div className="border-t border-border pt-12">
            <div className="mb-8 max-w-xl">
              <h2 className="text-2xl font-bold text-foreground">
                Designed for Cinephiles
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Fast, responsive game modes built right into your Cinetron
                catalog.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="surface-card p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
