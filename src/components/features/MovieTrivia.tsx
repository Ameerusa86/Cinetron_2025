"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Loader2,
  Flame,
  Calendar,
} from "lucide-react";
import {
  generateTriviaQuestions,
  generateDailyChallenge,
} from "@/lib/gemini-ai";
import { AIError, parseAIError } from "@/types/errors";
import { AIErrorDisplay } from "@/components/ui/AIErrorDisplay";
import { PageHeader } from "@/components/media/PageHeader";

interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: "general" | "quotes" | "cast" | "trivia" | "tech";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  explanation?: string;
}

const triviaCategories: {
  id: TriviaQuestion["category"];
  name: string;
}[] = [
  { id: "general", name: "General Cinema" },
  { id: "quotes", name: "Famous Quotes" },
  { id: "cast", name: "Cast & Directors" },
  { id: "trivia", name: "Behind the Scenes" },
  { id: "tech", name: "Cinematography" },
];

const curatedQuestions: TriviaQuestion[] = [
  {
    id: "q1",
    question: "Which film won the Academy Award for Best Picture at the 96th Oscars?",
    options: ["Oppenheimer", "Poor Things", "Killers of the Flower Moon", "Anatomy of a Fall"],
    correctAnswer: 0,
    category: "general",
    difficulty: "easy",
    points: 10,
    explanation: "Christopher Nolan's Oppenheimer won 7 Academy Awards, including Best Picture and Best Director.",
  },
  {
    id: "q2",
    question: 'Which director helmed "Inception", "Interstellar", and "Dunkirk"?',
    options: ["Denis Villeneuve", "Christopher Nolan", "Ridley Scott", "David Fincher"],
    correctAnswer: 1,
    category: "cast",
    difficulty: "easy",
    points: 10,
    explanation: "Christopher Nolan wrote and directed all three films, regularly collaborating with cinematographer Hoyte van Hoytema.",
  },
  {
    id: "q3",
    question: '"Here\'s looking at you, kid." is an iconic line from which classic film?',
    options: ["Citizen Kane", "Sunset Boulevard", "Casablanca", "The Maltese Falcon"],
    correctAnswer: 2,
    category: "quotes",
    difficulty: "easy",
    points: 10,
    explanation: "Humphrey Bogart delivered the line to Ingrid Bergman in Michael Curtiz's Casablanca (1942).",
  },
  {
    id: "q4",
    question: "Which South Korean film became the first non-English language movie to win Best Picture?",
    options: ["Oldboy", "Memories of Murder", "Minari", "Parasite"],
    correctAnswer: 3,
    category: "general",
    difficulty: "medium",
    points: 20,
    explanation: "Bong Joon-ho's Parasite made Academy Awards history in 2020 by winning four Oscars including Best Picture.",
  },
  {
    id: "q5",
    question: "Which cinematographer won consecutive Oscars for 'Blade Runner 2049' and '1917'?",
    options: ["Emmanuel Lubezki", "Roger Deakins", "Greig Fraser", "Janusz Kamiński"],
    correctAnswer: 1,
    category: "tech",
    difficulty: "hard",
    points: 30,
    explanation: "Sir Roger Deakins won his first Academy Award for Blade Runner 2049 and his second for 1917.",
  },
];

export default function MovieTrivia() {
  const [selectedCategory, setSelectedCategory] =
    useState<TriviaQuestion["category"]>("general");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("medium");
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiError, setAiError] = useState<AIError | null>(null);
  const [modeLabel, setModeLabel] = useState("Cinema Trivia");

  const startCurated = useCallback(() => {
    setAiError(null);
    setQuestions(curatedQuestions);
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setStreak(0);
    setFinished(false);
    setModeLabel("Curated Cinema Set");
  }, []);

  const startAITrivia = async () => {
    setIsLoading(true);
    setAiError(null);
    try {
      const generated = await generateTriviaQuestions(
        selectedCategory,
        selectedDifficulty,
        5
      );
      if (generated && generated.length > 0) {
        setQuestions(generated as TriviaQuestion[]);
        setCurrentIdx(0);
        setSelectedOption(null);
        setScore(0);
        setStreak(0);
        setFinished(false);
        setModeLabel(
          `${triviaCategories.find((c) => c.id === selectedCategory)?.name} · ${selectedDifficulty}`
        );
      } else {
        startCurated();
      }
    } catch (err) {
      setAiError(parseAIError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const startDaily = async () => {
    setIsLoading(true);
    setAiError(null);
    try {
      const daily = await generateDailyChallenge("Daily Cinema Challenge");
      if (daily?.questions && daily.questions.length > 0) {
        setQuestions(daily.questions as TriviaQuestion[]);
        setCurrentIdx(0);
        setSelectedOption(null);
        setScore(0);
        setStreak(0);
        setFinished(false);
        setModeLabel(daily.theme || "Daily Cinema Challenge");
      } else {
        startCurated();
      }
    } catch (err) {
      setAiError(parseAIError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const q = questions[currentIdx];
    if (idx === q.correctAnswer) {
      setScore((s) => s + (q.points || 10));
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
    } else {
      setFinished(true);
    }
  };

  const currentQuestion = questions[currentIdx];

  return (
    <div className="min-h-screen w-full">
      <PageHeader
        eyebrow="Cinema Games"
        title="Trivia"
        accentWord="Challenge"
        description="Test your knowledge of iconic quotes, directors, film history, and cinematography."
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
        <div className="container-cinema max-w-3xl space-y-6">
          {aiError && (
            <AIErrorDisplay
              error={aiError}
              onRetry={startAITrivia}
              onUseFallback={startCurated}
            />
          )}

          {/* Lobby / Setup */}
          {questions.length === 0 && !isLoading && (
            <div className="surface-card p-6 sm:p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {triviaCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`rounded-xl px-3.5 py-2 text-xs font-semibold border transition-colors cursor-pointer ${
                        selectedCategory === cat.id
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Difficulty
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["easy", "medium", "hard"] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize border transition-colors cursor-pointer ${
                        selectedDifficulty === diff
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={startAITrivia}
                  className="btn-cinema"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate AI Trivia
                </button>
                <button
                  type="button"
                  onClick={startDaily}
                  className="btn-cinema-outline"
                >
                  <Calendar className="h-4 w-4" />
                  Daily Challenge
                </button>
                <button
                  type="button"
                  onClick={startCurated}
                  className="btn-cinema-outline"
                >
                  <Brain className="h-4 w-4" />
                  Play Curated Set
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="surface-card p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">
                Crafting cinema trivia questions...
              </p>
            </div>
          )}

          {/* Active Question */}
          {!isLoading && currentQuestion && !finished && (
            <div className="surface-card p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {modeLabel} · Q{currentIdx + 1}/{questions.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg border border-border bg-secondary px-2.5 py-1 font-mono text-xs font-semibold text-foreground">
                    {score} pts
                  </span>
                  {streak > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-amber-400">
                      <Flame className="h-3.5 w-3.5" />
                      {streak}x
                    </span>
                  )}
                </div>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: `${((currentIdx + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                {currentQuestion.question}
              </h2>

              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const isChosen = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctAnswer;
                  let style =
                    "border-border bg-secondary/50 text-foreground hover:border-foreground/30 hover:bg-secondary";

                  if (selectedOption !== null) {
                    if (isCorrect) {
                      style =
                        "border-emerald-500/50 bg-emerald-500/15 text-emerald-300";
                    } else if (isChosen) {
                      style =
                        "border-rose-500/50 bg-rose-500/15 text-rose-300";
                    } else {
                      style =
                        "border-border bg-secondary/20 text-muted-foreground opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={selectedOption !== null}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full flex items-center justify-between gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-colors cursor-pointer ${style}`}
                    >
                      <span>{opt}</span>
                      {selectedOption !== null && isCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      )}
                      {selectedOption !== null && isChosen && !isCorrect && (
                        <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div className="space-y-4 pt-2 border-t border-border">
                  {currentQuestion.explanation && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-cinema"
                  >
                    {currentIdx + 1 < questions.length
                      ? "Next Question"
                      : "Finish Challenge"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Final Summary */}
          {finished && (
            <div className="surface-card p-8 text-center space-y-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/15 text-amber-400">
                <Trophy className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Challenge Complete
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Final Score:{" "}
                  <span className="font-mono font-bold text-foreground">
                    {score} points
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setQuestions([]);
                    setFinished(false);
                  }}
                  className="btn-cinema"
                >
                  <RotateCcw className="h-4 w-4" />
                  Play Another Round
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
