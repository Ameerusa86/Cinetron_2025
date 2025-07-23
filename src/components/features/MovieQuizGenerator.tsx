"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TMDBClient } from "@/lib/tmdb-client";
import { Movie } from "@/types";

const tmdbClient = new TMDBClient();

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  movie: Movie;
  type: "year" | "director" | "genre" | "actor" | "plot";
}

interface QuizState {
  questions: QuizQuestion[];
  currentQuestion: number;
  score: number;
  answers: number[];
  showResult: boolean;
  timeLeft: number;
  difficulty: "easy" | "medium" | "hard";
}

export default function MovieQuizGenerator() {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestion: 0,
    score: 0,
    answers: [],
    showResult: false,
    timeLeft: 30,
    difficulty: "medium",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Generate quiz questions from popular movies
  const generateQuiz = async (difficulty: "easy" | "medium" | "hard") => {
    setIsGenerating(true);
    try {
      const popularMovies = await tmdbClient.getPopularMovies(1);
      const selectedMovies = popularMovies.results.slice(0, 10);

      const questions: QuizQuestion[] = await Promise.all(
        selectedMovies.map(async (movie, index) => {
          const details = await tmdbClient.getMovieDetails(movie.id);
          // Merge genre_ids from the original movie object into details
          const mergedMovie = { ...details, genre_ids: movie.genre_ids };
          return generateQuestionFromMovie(mergedMovie, index, difficulty);
        })
      );

      setQuizState((prev) => ({
        ...prev,
        questions: questions.slice(0, 5), // 5 questions per quiz
        difficulty,
        timeLeft:
          difficulty === "easy" ? 45 : difficulty === "medium" ? 30 : 20,
      }));

      setGameStarted(true);
      startTimer();
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate different types of questions based on movie data
  const generateQuestionFromMovie = (
    movie: Movie,
    index: number,
    difficulty: string
  ): QuizQuestion => {
    const questionTypes: QuizQuestion["type"][] = ["year", "genre", "plot"];
    const type = questionTypes[index % questionTypes.length];

    switch (type) {
      case "year":
        return {
          id: index,
          question: `In which year was "${movie.title}" released?`,
          options: generateYearOptions(movie.release_date, difficulty),
          correctAnswer: 0,
          movie,
          type,
        };

      case "genre":
        return {
          id: index,
          question: `What genre best describes "${movie.title}"?`,
          options: generateGenreOptions(),
          correctAnswer: 0,
          movie,
          type,
        };

      case "plot":
        return {
          id: index,
          question: `Which movie has this plot: "${movie.overview.slice(
            0,
            100
          )}..."?`,
          options: generateMovieOptions(movie.title),
          correctAnswer: 0,
          movie,
          type,
        };

      default:
        return {
          id: index,
          question: `What is the IMDb rating of "${movie.title}"?`,
          options: generateRatingOptions(movie.vote_average),
          correctAnswer: 0,
          movie,
          type: "year",
        };
    }
  };

  // Generate options for different question types
  const generateYearOptions = (
    releaseDate: string,
    difficulty: string
  ): string[] => {
    const year = new Date(releaseDate).getFullYear();
    const range = difficulty === "easy" ? 5 : difficulty === "medium" ? 3 : 1;

    const options = [
      year.toString(),
      (year - range).toString(),
      (year + range).toString(),
      (year - range * 2).toString(),
    ];

    return shuffleArray(options);
  };

  const generateGenreOptions = (): string[] => {
    const genres = [
      "Action",
      "Comedy",
      "Drama",
      "Horror",
      "Romance",
      "Sci-Fi",
      "Thriller",
    ];
    return shuffleArray(genres).slice(0, 4);
  };

  const generateMovieOptions = (correctTitle: string): string[] => {
    const options = [
      correctTitle,
      "The Dark Knight",
      "Inception",
      "Pulp Fiction",
    ];
    return shuffleArray(options);
  };

  const generateRatingOptions = (rating: number): string[] => {
    const options = [
      rating.toFixed(1),
      (rating - 1).toFixed(1),
      (rating + 1).toFixed(1),
      (rating - 0.5).toFixed(1),
    ];
    return shuffleArray(options);
  };

  const shuffleArray = (array: string[]): string[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Timer functionality
  const startTimer = () => {
    const timer = setInterval(() => {
      setQuizState((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          handleNextQuestion(); // Time's up, wrong answer
          return prev;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  // Handle answer selection
  const handleAnswer = (selectedAnswer: number) => {
    const isCorrect =
      selectedAnswer ===
      quizState.questions[quizState.currentQuestion].correctAnswer;

    setQuizState((prev) => ({
      ...prev,
      answers: [...prev.answers, selectedAnswer],
      score: isCorrect ? prev.score + 1 : prev.score,
    }));

    setTimeout(() => handleNextQuestion(), 1000);
  };

  // Move to next question or show results
  const handleNextQuestion = () => {
    if (quizState.currentQuestion < quizState.questions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        timeLeft:
          prev.difficulty === "easy"
            ? 45
            : prev.difficulty === "medium"
            ? 30
            : 20,
      }));
      startTimer();
    } else {
      setQuizState((prev) => ({ ...prev, showResult: true }));
    }
  };

  // Reset quiz
  const resetQuiz = () => {
    setQuizState({
      questions: [],
      currentQuestion: 0,
      score: 0,
      answers: [],
      showResult: false,
      timeLeft: 30,
      difficulty: "medium",
    });
    setGameStarted(false);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen pt-20 lg:pt-28 w-full">
        {/* Hero Section - Full Width */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(168,85,247,0.3),transparent)]" />

          <div className="relative z-10 text-center w-full">
            <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-white mb-6">
              🎭 <span className="text-gradient-premium">Movie</span>{" "}
              <span className="text-white">Quiz Generator</span>
            </h1>
            <p className="text-xl lg:text-2xl xl:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto">
              Test your movie knowledge with AI-generated quizzes based on
              popular films!
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Choose Your Difficulty
              </h2>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {["easy", "medium", "hard"].map((difficulty) => (
                  <motion.button
                    key={difficulty}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      generateQuiz(difficulty as "easy" | "medium" | "hard")
                    }
                    disabled={isGenerating}
                    className={`p-6 rounded-2xl text-center transition-all duration-300 ${
                      difficulty === "easy"
                        ? "bg-green-600/20 border-green-500/30 hover:bg-green-600/30"
                        : difficulty === "medium"
                        ? "bg-yellow-600/20 border-yellow-500/30 hover:bg-yellow-600/30"
                        : "bg-red-600/20 border-red-500/30 hover:bg-red-600/30"
                    } border backdrop-blur-sm`}
                  >
                    <div className="text-3xl mb-2">
                      {difficulty === "easy"
                        ? "😊"
                        : difficulty === "medium"
                        ? "🤔"
                        : "🔥"}
                    </div>
                    <h3 className="text-xl font-bold text-white capitalize mb-2">
                      {difficulty}
                    </h3>
                    <p className="text-sm text-slate-300">
                      {difficulty === "easy"
                        ? "45 seconds per question • Basic movie facts"
                        : difficulty === "medium"
                        ? "30 seconds per question • Moderate difficulty"
                        : "20 seconds per question • For movie experts"}
                    </p>
                  </motion.button>
                ))}
              </div>

              {isGenerating && (
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-12 h-12 mx-auto mb-4"
                  >
                    <div className="w-full h-full border-4 border-purple-500/30 border-t-purple-500 rounded-full"></div>
                  </motion.div>
                  <p className="text-white">
                    Generating your personalized movie quiz...
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  if (quizState.showResult) {
    const percentage = Math.round(
      (quizState.score / quizState.questions.length) * 100
    );

    return (
      <div className="min-h-screen pt-20 lg:pt-28 w-full">
        {/* Results Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 text-center"
            >
              <div className="text-6xl mb-6">
                {percentage >= 80
                  ? "🏆"
                  : percentage >= 60
                  ? "🎭"
                  : percentage >= 40
                  ? "🎬"
                  : "📚"}
              </div>
              <h1 className="text-4xl font-bold mb-4 text-white">
                Quiz Complete!
              </h1>
              <p className="text-2xl mb-6 text-slate-300">
                You scored{" "}
                <span className="text-purple-400 font-bold">
                  {quizState.score}/{quizState.questions.length}
                </span>
              </p>
              <p className="text-xl mb-8 text-slate-400">
                {percentage >= 80
                  ? "Movie Master! 🌟"
                  : percentage >= 60
                  ? "Great job! You know your movies! 🎉"
                  : percentage >= 40
                  ? "Not bad! Keep watching more movies! 💪"
                  : "Time to watch more movies! 📽️"}
              </p>

              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetQuiz}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                >
                  Play Again
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  const currentQ = quizState.questions[quizState.currentQuestion];

  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full">
      {/* Quiz Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300">
                Question {quizState.currentQuestion + 1} of{" "}
                {quizState.questions.length}
              </span>
              <span className="text-slate-300">Score: {quizState.score}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((quizState.currentQuestion + 1) /
                      quizState.questions.length) *
                    100
                  }%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Timer */}
          <motion.div
            className="text-center mb-8"
            animate={{ scale: quizState.timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
            transition={{
              duration: 0.5,
              repeat: quizState.timeLeft <= 10 ? Infinity : 0,
            }}
          >
            <div
              className={`text-4xl font-bold ${
                quizState.timeLeft <= 10 ? "text-red-400" : "text-purple-400"
              }`}
            >
              {quizState.timeLeft}s
            </div>
          </motion.div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={quizState.currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20"
            >
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                {currentQ.question}
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {currentQ.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(index)}
                    className="p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl text-white text-left transition-all duration-300 border border-slate-600/50 hover:border-purple-500/50"
                  >
                    <span className="font-semibold text-purple-400 mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
