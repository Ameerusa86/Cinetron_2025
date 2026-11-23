"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clapperboard,
  Clock,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Play,
} from "lucide-react";
import tmdbClient from "@/lib/tmdb-client";
import type { MovieDetails } from "@/types";
import { PageHeader } from "@/components/media/PageHeader";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  movie: MovieDetails;
  type: "year" | "genre" | "plot";
}

type Difficulty = "easy" | "medium" | "hard";

const difficulties: {
  id: Difficulty;
  label: string;
  time: number;
  description: string;
}[] = [
  {
    id: "easy",
    label: "Casual",
    time: 30,
    description: "30s per question · wider year intervals",
  },
  {
    id: "medium",
    label: "Cinephile",
    time: 20,
    description: "20s per question · tighter distractors",
  },
  {
    id: "hard",
    label: "Auteur",
    time: 12,
    description: "12s per question · precision recall",
  },
];

function shuffleWithCorrect(correct: string, distractors: string[]) {
  const uniqueDistractors = Array.from(
    new Set(distractors.filter((d) => d && d !== correct))
  ).slice(0, 3);
  const options = [correct, ...uniqueDistractors];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return {
    options,
    correctAnswer: options.indexOf(correct),
  };
}

export default function MovieQuizGenerator() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [timeLeft, setTimeLeft] = useState(20);
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timePerQuestion =
    difficulties.find((d) => d.id === difficulty)?.time ?? 20;

  const advanceQuestion = useCallback(() => {
    setSelectedOption(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(timePerQuestion);
    } else {
      setShowResult(true);
    }
  }, [currentIndex, questions.length, timePerQuestion]);

  // Clean timer effect with proper cleanup
  useEffect(() => {
    if (!gameStarted || showResult || selectedOption !== null) return;
    if (timeLeft <= 0) {
      advanceQuestion();
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [gameStarted, showResult, selectedOption, timeLeft, advanceQuestion]);

  const generateQuiz = async (chosenDifficulty: Difficulty) => {
    setDifficulty(chosenDifficulty);
    setIsGenerating(true);
    setError(null);
    const seconds =
      difficulties.find((d) => d.id === chosenDifficulty)?.time ?? 20;

    try {
      const page = Math.floor(Math.random() * 3) + 1;
      const popular = await tmdbClient.getPopularMovies(page);
      const pool = popular.results
        .filter((m) => m.release_date && m.overview && m.overview.length > 40)
        .slice(0, 10);

      const detailed = await Promise.all(
        pool.slice(0, 5).map((m) => tmdbClient.getMovieDetails(m.id))
      );

      const allTitles = pool.map((m) => m.title);
      const fallbackGenres = [
        "Action",
        "Comedy",
        "Drama",
        "Horror",
        "Sci-Fi",
        "Thriller",
        "Romance",
        "Animation",
      ];

      const built: QuizQuestion[] = detailed.map((movie, idx) => {
        const types: QuizQuestion["type"][] = ["year", "genre", "plot"];
        const type = types[idx % types.length];

        if (type === "year") {
          const year = new Date(movie.release_date).getFullYear();
          const step =
            chosenDifficulty === "easy"
              ? 4
              : chosenDifficulty === "medium"
              ? 2
              : 1;
          const { options, correctAnswer } = shuffleWithCorrect(String(year), [
            String(year - step),
            String(year + step),
            String(year - step * 2),
          ]);
          return {
            id: idx,
            question: `In which year was "${movie.title}" released?`,
            options,
            correctAnswer,
            movie,
            type,
          };
        }

        if (type === "genre" && movie.genres && movie.genres.length > 0) {
          const primaryGenre = movie.genres[0].name;
          const movieGenreNames = new Set(movie.genres.map((g) => g.name));
          const wrongGenres = fallbackGenres.filter(
            (g) => !movieGenreNames.has(g)
          );
          const { options, correctAnswer } = shuffleWithCorrect(
            primaryGenre,
            wrongGenres
          );
          return {
            id: idx,
            question: `Which primary genre belongs to "${movie.title}"?`,
            options,
            correctAnswer,
            movie,
            type,
          };
        }

        const otherTitles = allTitles.filter((t) => t !== movie.title);
        const { options, correctAnswer } = shuffleWithCorrect(
          movie.title,
          otherTitles
        );
        return {
          id: idx,
          question: `Which film matches this synopsis: "${movie.overview.slice(
            0,
            135
          )}..."?`,
          options,
          correctAnswer,
          movie,
          type: "plot",
        };
      });

      setQuestions(built);
      setCurrentIndex(0);
      setScore(0);
      setSelectedOption(null);
      setShowResult(false);
      setTimeLeft(seconds);
      setGameStarted(true);
    } catch (err) {
      console.error("Error generating quiz:", err);
      setError("Could not load movies for the quiz. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    const currentQ = questions[currentIndex];
    if (optionIdx === currentQ.correctAnswer) {
      setScore((s) => s + 1);
    }
    setTimeout(() => advanceQuestion(), 1100);
  };

  const resetQuiz = () => {
    setGameStarted(false);
    setShowResult(false);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen w-full">
      <PageHeader
        eyebrow="Cinema Games"
        title="Movie Quiz"
        accentWord="Generator"
        description="Five rapid-fire questions generated dynamically from live TMDB film data."
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
        <div className="container-cinema max-w-3xl">
          {error && (
            <div className="mb-6 rounded-xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm text-rose-400">
              {error}
            </div>
          )}

          {/* Setup Screen */}
          {!gameStarted && (
            <div className="surface-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
                  <Clapperboard className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Choose Difficulty
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Select your pace to generate a fresh 5-question quiz
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {difficulties.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    disabled={isGenerating}
                    onClick={() => generateQuiz(d.id)}
                    className="group surface-card-interactive p-5 text-left flex flex-col justify-between cursor-pointer disabled:opacity-50"
                  >
                    <div>
                      <span className="font-mono text-xs font-semibold text-primary">
                        {d.time}s / Q
                      </span>
                      <h3 className="mt-1 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {d.label}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {d.description}
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-primary">
                      <Play className="h-3.5 w-3.5" />
                      Start
                    </span>
                  </button>
                ))}
              </div>

              {isGenerating && (
                <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Generating fresh questions from TMDB...</span>
                </div>
              )}
            </div>
          )}

          {/* Active Question */}
          {gameStarted && !showResult && currentQuestion && (
            <div className="surface-card p-6 sm:p-8 space-y-6">
              {/* Top Bar */}
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  QUESTION {currentIndex + 1} / {questions.length}
                </span>
                <div className="flex items-center gap-3">
                  <span className="rounded-lg border border-border bg-secondary px-2.5 py-1 font-mono text-xs font-semibold text-foreground">
                    Score: {score}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 font-mono text-xs font-bold ${
                      timeLeft <= 5
                        ? "border-rose-500/40 bg-rose-500/15 text-rose-400"
                        : "border-border bg-secondary text-foreground"
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    {timeLeft}s
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question + Optional Poster Hint for non-plot questions */}
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {currentQuestion.type !== "plot" &&
                  currentQuestion.movie.poster_path && (
                    <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                      <Image
                        src={
                          tmdbClient.getImageUrl(
                            currentQuestion.movie.poster_path,
                            "w185"
                          ) || ""
                        }
                        alt={currentQuestion.movie.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  )}
                <h2 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((opt, idx) => {
                  const isChosen = selectedOption === idx;
                  const isRight = idx === currentQuestion.correctAnswer;
                  let style =
                    "border-border bg-secondary/50 text-foreground hover:border-foreground/30 hover:bg-secondary";

                  if (selectedOption !== null) {
                    if (isRight) {
                      style =
                        "border-emerald-500/50 bg-emerald-500/15 text-emerald-300";
                    } else if (isChosen) {
                      style =
                        "border-rose-500/50 bg-rose-500/15 text-rose-300";
                    } else {
                      style = "border-border bg-secondary/20 text-muted-foreground opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={selectedOption !== null}
                      onClick={() => handleAnswer(idx)}
                      className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-all cursor-pointer ${style}`}
                    >
                      <span>{opt}</span>
                      {selectedOption !== null && isRight && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      )}
                      {selectedOption !== null && isChosen && !isRight && (
                        <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results Screen */}
          {showResult && (
            <div className="surface-card p-8 text-center space-y-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/15 text-amber-400">
                <Trophy className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Quiz Complete
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  You scored{" "}
                  <span className="font-mono font-bold text-foreground">
                    {score} / {questions.length}
                  </span>{" "}
                  ({Math.round((score / Math.max(1, questions.length)) * 100)}%)
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => generateQuiz(difficulty)}
                  className="btn-cinema"
                >
                  <RotateCcw className="h-4 w-4" />
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={resetQuiz}
                  className="btn-cinema-outline"
                >
                  Change Difficulty
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
