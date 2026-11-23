"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Grid3X3,
  Shuffle,
  RotateCcw,
  Trophy,
  Check,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/media/PageHeader";

interface BingoCell {
  id: number;
  text: string;
  completed: boolean;
  isFree?: boolean;
}

const bingoThemes = {
  action: {
    name: "Action Cinema",
    items: [
      "Car chase scene",
      "Huge explosion",
      "Hero saves the day",
      "Villain monologue",
      "Last-minute rescue",
      "Rooftop showdown",
      "Slow-motion leap",
      "Walks away from blast",
      "Villain falls from height",
      "Gadget malfunction",
      "Mentor sacrifice",
      "Training montage",
      "Surprise betrayal",
      "Final boss duel",
      "Presumed dead",
      "Comic relief quip",
      "Ticking countdown",
      "Unlikely alliance",
      "Hidden identity reveal",
      "Redemption arc",
      "Helicopter escape",
      "Glass window crash",
      "Out of ammo click",
      "Secret vault heist",
      "One-liner before punch",
    ],
  },
  horror: {
    name: "Horror Night",
    items: [
      "Sudden jump scare",
      "Power cuts out",
      "No cell reception",
      "First victim splits up",
      "Creaky floorboard",
      "Bathroom mirror scare",
      "False alarm cat jump",
      "Enters dark basement",
      "Car refuses to start",
      "Cryptic phone call",
      "Cursed artifact",
      "Final survivor stands",
      "Killer isn't dead yet",
      "Let's split up",
      "Library research scene",
      "Ancient ritual",
      "Abandoned asylum",
      "Flickering hallway light",
      "Creepy child singing",
      "Locked front door",
      "Ominous warning local",
      "Found footage glitch",
      "Stormy lightning flash",
      "Creaking rocking chair",
      "Twist final shot",
    ],
  },
  comedy: {
    name: "Comedy Classics",
    items: [
      "Mistaken identity",
      "Running callback gag",
      "Painfully awkward silence",
      "Major miscommunication",
      "Breaks the fourth wall",
      "Wild disguise plan",
      "Double take reaction",
      "Spit take moment",
      "Chaotic dinner party",
      "Improv-feeling banter",
      "Montage with upbeat pop",
      "Embarrassing speech",
      "Over-the-top rival",
      "Pet steals the scene",
      "Accidental hero",
      "Road trip detour",
      "Slow clap starts",
      "Wedding interruption",
      "Deadpan straight man",
      "Dance sequence finale",
      "Terrible lie spirals",
      "Slapstick tumble",
      "Freeze-frame narration",
      "Post-credits joke",
      "Sarcastic sidekick",
    ],
  },
  romance: {
    name: "Romance & Rom-Com",
    items: [
      "Classic meet-cute",
      "Kiss in the rain",
      "Airport sprint",
      "Public declaration",
      "Candlelit dinner",
      "Love triangle tension",
      "Third-act breakup",
      "Grand gesture",
      "Golden hour walk",
      "Slow dance together",
      "Handwritten letter",
      "Best friend pep talk",
      "Fake dating scheme",
      "Enemies to lovers",
      "Meeting the parents",
      "Coffee shop bump",
      "Missed train or flight",
      "Jealousy glance",
      "Acoustic needle drop",
      "Makeover montage",
      "Heartfelt apology",
      "Shared umbrella",
      "Sunset confession",
      "Happy ending kiss",
      "Wedding toast",
    ],
  },
};

type ThemeKey = keyof typeof bingoThemes;

const WIN_LINES = [
  // Rows
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // Columns
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // Diagonals
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

function buildCard(theme: ThemeKey): BingoCell[] {
  const pool = [...bingoThemes[theme].items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const picked = pool.slice(0, 24);
  const cells: BingoCell[] = [];
  let cursor = 0;

  for (let i = 0; i < 25; i++) {
    if (i === 12) {
      cells.push({ id: i, text: "FREE SPACE", completed: true, isFree: true });
    } else {
      cells.push({ id: i, text: picked[cursor++], completed: false });
    }
  }
  return cells;
}

export default function MovieBingo() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>("action");
  const [cells, setCells] = useState<BingoCell[]>(() => buildCard("action"));

  const handleThemeSelect = (theme: ThemeKey) => {
    setSelectedTheme(theme);
    setCells(buildCard(theme));
  };

  const toggleCell = (id: number) => {
    setCells((prev) =>
      prev.map((c) =>
        c.id === id && !c.isFree ? { ...c, completed: !c.completed } : c
      )
    );
  };

  const clearMarks = () => {
    setCells((prev) =>
      prev.map((c) => (c.isFree ? c : { ...c, completed: false }))
    );
  };

  const { winningLines, winningCellIds } = useMemo(() => {
    const completedSet = new Set(
      cells.filter((c) => c.completed).map((c) => c.id)
    );
    const lines = WIN_LINES.filter((line) =>
      line.every((idx) => completedSet.has(idx))
    );
    const cellIds = new Set(lines.flat());
    return { winningLines: lines.length, winningCellIds: cellIds };
  }, [cells]);

  const markedCount = cells.filter((c) => c.completed).length;

  return (
    <div className="min-h-screen w-full">
      <PageHeader
        eyebrow="Cinema Games"
        title="Movie Night"
        accentWord="Bingo"
        description="Spot classic genre tropes as you watch and complete a horizontal, vertical, or diagonal line."
      >
        <Link
          href="/games"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Games
        </Link>
      </PageHeader>

      <section className="py-10">
        <div className="container-cinema max-w-4xl space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(bingoThemes) as ThemeKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleThemeSelect(key)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold border transition-colors cursor-pointer ${
                    selectedTheme === key
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {bingoThemes[key].name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCells(buildCard(selectedTheme))}
                className="btn-cinema-outline px-3.5 py-2 text-xs"
              >
                <Shuffle className="h-3.5 w-3.5" />
                New Board
              </button>
              <button
                type="button"
                onClick={clearMarks}
                className="btn-cinema-outline px-3.5 py-2 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Marks
              </button>
            </div>
          </div>

          {/* Bingo Celebration Banner */}
          {winningLines > 0 && (
            <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    BINGO! {winningLines}{" "}
                    {winningLines === 1 ? "line" : "lines"} completed
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Keep going for a full blackout or generate a fresh board.
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400">
                {markedCount}/25
              </span>
            </div>
          )}

          {/* 5x5 Board */}
          <div className="surface-card p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Grid3X3 className="h-4 w-4 text-primary" />
                <span>{bingoThemes[selectedTheme].name}</span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {markedCount} / 25 marked
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {cells.map((cell) => {
                const isWinning = winningCellIds.has(cell.id);
                return (
                  <button
                    key={cell.id}
                    type="button"
                    onClick={() => toggleCell(cell.id)}
                    className={`relative aspect-square rounded-xl border p-2 sm:p-3 flex flex-col items-center justify-center text-center transition-all cursor-pointer select-none ${
                      cell.isFree
                        ? "border-primary/50 bg-primary/15 text-primary"
                        : isWinning
                        ? "border-amber-500/60 bg-amber-500/15 text-foreground shadow-sm"
                        : cell.completed
                        ? "border-primary/50 bg-primary text-white"
                        : "border-border bg-secondary/50 text-foreground hover:border-foreground/25 hover:bg-secondary"
                    }`}
                  >
                    {cell.isFree ? (
                      <Sparkles className="h-4 w-4 mb-1" />
                    ) : cell.completed ? (
                      <Check className="h-3.5 w-3.5 mb-1 shrink-0" />
                    ) : null}
                    <span className="text-[10px] sm:text-xs font-medium leading-tight line-clamp-3">
                      {cell.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
