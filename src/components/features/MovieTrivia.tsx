"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  generateTriviaQuestions,
  generateDailyChallenge,
} from "@/lib/gemini-ai";
import { AIError, parseAIError } from "@/types/errors";
import { AIErrorDisplay } from "@/components/ui/AIErrorDisplay";

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

interface DailyChallenge {
  id: string;
  date: string;
  questions: TriviaQuestion[];
  theme: string;
  bonusMultiplier: number;
}

const triviaCategories = {
  general: {
    name: "General Knowledge",
    icon: "🎬",
    color: "from-blue-500 to-cyan-500",
  },
  quotes: {
    name: "Famous Quotes",
    icon: "💬",
    color: "from-purple-500 to-pink-500",
  },
  cast: {
    name: "Cast & Crew",
    icon: "👥",
    color: "from-green-500 to-emerald-500",
  },
  trivia: {
    name: "Behind the Scenes",
    icon: "🎭",
    color: "from-orange-500 to-red-500",
  },
  tech: {
    name: "Technical",
    icon: "🎥",
    color: "from-indigo-500 to-purple-500",
  },
};

const sampleQuestions: TriviaQuestion[] = [
  {
    id: "1",
    question: "Which movie won the Academy Award for Best Picture in 2023?",
    options: [
      "Everything Everywhere All at Once",
      "Top Gun: Maverick",
      "Avatar: The Way of Water",
      "The Banshees of Inisherin",
    ],
    correctAnswer: 0,
    category: "general",
    difficulty: "easy",
    points: 10,
    explanation:
      "Everything Everywhere All at Once swept the 2023 Oscars, winning 7 awards including Best Picture.",
  },
  {
    id: "2",
    question: '"I\'ll be back" is a famous quote from which movie?',
    options: [
      "Predator",
      "The Terminator",
      "Total Recall",
      "Conan the Barbarian",
    ],
    correctAnswer: 1,
    category: "quotes",
    difficulty: "easy",
    points: 10,
    explanation:
      "Arnold Schwarzenegger's iconic line from The Terminator (1984) became one of the most quoted movie lines ever.",
  },
  {
    id: "3",
    question: 'Who directed the movie "Inception"?',
    options: [
      "Steven Spielberg",
      "Christopher Nolan",
      "Denis Villeneuve",
      "Ridley Scott",
    ],
    correctAnswer: 1,
    category: "cast",
    difficulty: "medium",
    points: 15,
    explanation:
      "Christopher Nolan wrote and directed Inception (2010), known for its complex narrative structure.",
  },
  {
    id: "4",
    question:
      "What technique was used to create the bullet-time effect in The Matrix?",
    options: [
      "CGI Animation",
      "Time-lapse Photography",
      "Slow Motion Cameras",
      "Multiple Camera Array",
    ],
    correctAnswer: 3,
    category: "tech",
    difficulty: "hard",
    points: 25,
    explanation:
      "The bullet-time effect used an array of 120 still cameras and two film cameras to create the rotating slow-motion effect.",
  },
  {
    id: "5",
    question:
      'Which movie features a character named "Red" who is imprisoned for murder?',
    options: [
      "The Green Mile",
      "The Shawshank Redemption",
      "Dead Man Walking",
      "American History X",
    ],
    correctAnswer: 1,
    category: "trivia",
    difficulty: "medium",
    points: 15,
    explanation:
      'Ellis "Red" Redding, played by Morgan Freeman, is Andy Dufresne\'s friend in The Shawshank Redemption.',
  },
];

const dailyChallenges: DailyChallenge[] = [
  {
    id: "daily-1",
    date: "2024-01-15",
    theme: "90s Action Movies",
    questions: sampleQuestions.slice(0, 3),
    bonusMultiplier: 2.0,
  },
  {
    id: "daily-2",
    date: "2024-01-14",
    theme: "Oscar Winners",
    questions: sampleQuestions.slice(1, 4),
    bonusMultiplier: 1.5,
  },
];

export default function MovieTrivia() {
  const [activeMode, setActiveMode] = useState<
    "daily" | "practice" | "leaderboard"
  >("daily");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<"playing" | "finished" | "review">(
    "playing"
  );
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof triviaCategories>("general");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("medium");

  // AI-generated questions state
  const [aiQuestions, setAiQuestions] = useState<TriviaQuestion[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(
    null
  );
  const [questionsSource, setQuestionsSource] = useState<"sample" | "ai">(
    "sample"
  );
  const [aiError, setAiError] = useState<AIError | null>(null);

  const currentQuestions =
    activeMode === "daily"
      ? dailyChallenge?.questions || dailyChallenges[0].questions
      : questionsSource === "ai"
      ? aiQuestions
      : sampleQuestions;
  const question = currentQuestions[currentQuestion];

  // Generate AI questions for practice mode
  const generateAIQuestions = async () => {
    setIsGeneratingQuestions(true);
    setAiError(null);

    try {
      const questions = await generateTriviaQuestions(
        selectedCategory,
        selectedDifficulty,
        5
      );
      setAiQuestions(questions);
      setQuestionsSource("ai");
    } catch (error) {
      console.error("Failed to generate AI questions:", error);
      const aiError = parseAIError(error);
      setAiError(aiError);
      // Don't automatically fallback - let user choose
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Handle fallback to sample questions
  const useSampleQuestions = () => {
    setAiError(null);
    setQuestionsSource("sample");
  };

  // Generate daily challenge with AI
  const generateDailyChallengeWithAI = async () => {
    setIsGeneratingQuestions(true);
    setAiError(null);

    try {
      const challenge = await generateDailyChallenge(
        "Movie Masterpiece Monday"
      );
      setDailyChallenge(challenge);
    } catch (error) {
      console.error("Failed to generate daily challenge:", error);
      const aiError = parseAIError(error);
      setAiError(aiError);
      // Use fallback daily challenge
      setDailyChallenge(dailyChallenges[0]);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Load daily challenge on component mount
  useEffect(() => {
    if (activeMode === "daily" && !dailyChallenge) {
      generateDailyChallengeWithAI();
    }
  }, [activeMode, dailyChallenge]);

  const handleAnswer = useCallback(
    (answer: number | null) => {
      setSelectedAnswer(answer);

      const newAnswers = [...userAnswers];
      newAnswers[currentQuestion] = answer ?? -1;
      setUserAnswers(newAnswers);

      // Calculate score
      if (answer === question.correctAnswer) {
        const timeBonus = Math.floor(timeLeft / 3);
        const newScore = score + question.points + timeBonus;
        setScore(newScore);
        setStreak(streak + 1);
      } else {
        setStreak(0);
      }

      // Move to next question or finish
      setTimeout(() => {
        if (currentQuestion + 1 < currentQuestions.length) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setTimeLeft(30);
        } else {
          setGameState("finished");
        }
      }, 2000);
    },
    [
      userAnswers,
      currentQuestion,
      question.correctAnswer,
      timeLeft,
      question.points,
      score,
      streak,
      currentQuestions.length,
    ]
  );

  // Timer effect
  useEffect(() => {
    const handleTimeUp = () => {
      handleAnswer(null);
    };

    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [timeLeft, gameState, handleAnswer]);

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(30);
    setGameState("playing");
    setUserAnswers([]);
    setStreak(0);
  };

  const renderQuestion = () => (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20"
    >
      {/* Progress and Stats */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-slate-300">
            Question {currentQuestion + 1} of {currentQuestions.length}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔥</span>
            <span className="text-orange-400 font-bold">{streak}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-400">{score}</div>
            <div className="text-sm text-slate-400">points</div>
          </div>

          <div
            className={`text-2xl font-bold ${
              timeLeft <= 10 ? "text-red-400" : "text-blue-400"
            }`}
          >
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${
              ((currentQuestion + 1) / currentQuestions.length) * 100
            }%`,
          }}
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
        />
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">
            {triviaCategories[question.category].icon}
          </span>
          <span className="text-sm text-slate-400 uppercase tracking-wider">
            {triviaCategories[question.category].name}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs font-bold ${
              question.difficulty === "easy"
                ? "bg-green-500/20 text-green-400"
                : question.difficulty === "medium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {question.difficulty.toUpperCase()} • {question.points} PTS
          </span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">
          {question.question}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="grid md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectedAnswer === null && handleAnswer(index)}
            disabled={selectedAnswer !== null}
            className={`p-4 rounded-xl text-left transition-all duration-300 border-2 ${
              selectedAnswer === null
                ? "border-slate-600 bg-slate-700/50 hover:border-purple-500 hover:bg-purple-500/10"
                : selectedAnswer === index
                ? index === question.correctAnswer
                  ? "border-green-500 bg-green-500/20 text-green-400"
                  : "border-red-500 bg-red-500/20 text-red-400"
                : index === question.correctAnswer
                ? "border-green-500 bg-green-500/20 text-green-400"
                : "border-slate-600 bg-slate-700/30 opacity-50"
            }`}
          >
            <span className="font-bold text-lg">
              {String.fromCharCode(65 + index)}.
            </span>
            <span className="ml-2">{option}</span>
          </motion.button>
        ))}
      </div>

      {/* Explanation */}
      {selectedAnswer !== null && question.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"
        >
          <h3 className="text-blue-400 font-bold mb-2">💡 Explanation</h3>
          <p className="text-slate-300">{question.explanation}</p>
        </motion.div>
      )}
    </motion.div>
  );

  const renderResults = () => {
    const accuracy = Math.round(
      (userAnswers.filter(
        (answer, index) => answer === currentQuestions[index].correctAnswer
      ).length /
        currentQuestions.length) *
        100
    );

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20 text-center"
      >
        <div className="text-6xl mb-4">
          {accuracy >= 80 ? "🎉" : accuracy >= 60 ? "👏" : "💪"}
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          {accuracy >= 80
            ? "Excellent!"
            : accuracy >= 60
            ? "Good Job!"
            : "Keep Practicing!"}
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-4">
            <div className="text-3xl font-bold text-purple-400">{score}</div>
            <div className="text-slate-300">Total Score</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4">
            <div className="text-3xl font-bold text-green-400">{accuracy}%</div>
            <div className="text-slate-300">Accuracy</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-4">
            <div className="text-3xl font-bold text-orange-400">
              {
                userAnswers.filter(
                  (answer, index) =>
                    answer === currentQuestions[index].correctAnswer
                ).length
              }
            </div>
            <div className="text-slate-300">Best Streak</div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
          >
            Play Again
          </button>

          {questionsSource === "ai" && (
            <button
              onClick={async () => {
                await generateAIQuestions();
                resetGame();
              }}
              disabled={isGeneratingQuestions}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold hover:from-pink-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingQuestions
                ? "🤖 Generating..."
                : "🔄 New AI Questions"}
            </button>
          )}

          <button
            onClick={() => setGameState("review")}
            className="px-6 py-3 bg-slate-700 text-slate-300 rounded-xl font-bold hover:bg-slate-600 transition-all duration-300"
          >
            Review Answers
          </button>
        </div>
      </motion.div>
    );
  };

  const renderReviewAnswers = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            📝 Review Answers
          </h2>
          <div className="flex justify-center space-x-6 text-center">
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg px-4 py-2">
              <div className="text-green-400 font-bold">
                {
                  userAnswers.filter(
                    (answer, index) =>
                      answer === currentQuestions[index].correctAnswer
                  ).length
                }
              </div>
              <div className="text-green-300 text-sm">Correct</div>
            </div>
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2">
              <div className="text-red-400 font-bold">
                {
                  userAnswers.filter(
                    (answer, index) =>
                      answer !== currentQuestions[index].correctAnswer
                  ).length
                }
              </div>
              <div className="text-red-300 text-sm">Incorrect</div>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          {currentQuestions.map((question, questionIndex) => {
            const userAnswer = userAnswers[questionIndex];
            const isCorrect = userAnswer === question.correctAnswer;
            const wasAnswered = userAnswer !== -1;

            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: questionIndex * 0.1 }}
                className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border-2 ${
                  isCorrect
                    ? "border-green-500/50"
                    : wasAnswered
                    ? "border-red-500/50"
                    : "border-yellow-500/50"
                }`}
              >
                {/* Question Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {isCorrect ? "✅" : wasAnswered ? "❌" : "⏰"}
                    </span>
                    <span className="text-slate-400 font-medium">
                      Question {questionIndex + 1}
                    </span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isCorrect
                        ? "bg-green-500/20 text-green-400"
                        : wasAnswered
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {isCorrect
                      ? "Correct"
                      : wasAnswered
                      ? "Incorrect"
                      : "Time Up"}
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-xl font-bold text-white mb-6">
                  {question.question}
                </h3>

                {/* Answer Options */}
                <div className="grid gap-3 mb-6">
                  {question.options.map((option, optionIndex) => {
                    const isUserAnswer = userAnswer === optionIndex;
                    const isCorrectAnswer =
                      question.correctAnswer === optionIndex;

                    return (
                      <div
                        key={optionIndex}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          isCorrectAnswer
                            ? "border-green-500 bg-green-500/20 text-green-300"
                            : isUserAnswer && !isCorrectAnswer
                            ? "border-red-500 bg-red-500/20 text-red-300"
                            : "border-slate-600 bg-slate-700/30 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span
                              className={`font-bold text-lg ${
                                isCorrectAnswer
                                  ? "text-green-400"
                                  : isUserAnswer && !isCorrectAnswer
                                  ? "text-red-400"
                                  : "text-slate-400"
                              }`}
                            >
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            <span>{option}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isCorrectAnswer && (
                              <span className="text-green-400">✓</span>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <span className="text-red-400">✗</span>
                            )}
                            {isUserAnswer && (
                              <span className="text-sm text-slate-400 bg-slate-600/50 px-2 py-1 rounded">
                                Your answer
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {question.explanation && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-blue-400">💡</span>
                      <h4 className="text-blue-400 font-bold">Explanation</h4>
                    </div>
                    <p className="text-slate-300">{question.explanation}</p>
                  </div>
                )}

                {/* Points Info */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-600">
                  <div className="text-slate-400">
                    <span className="text-sm">Category: </span>
                    <span className="capitalize">{question.category}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-slate-400">
                      <span className="text-sm">Difficulty: </span>
                      <span
                        className={`capitalize font-medium ${
                          question.difficulty === "easy"
                            ? "text-green-400"
                            : question.difficulty === "medium"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {question.difficulty}
                      </span>
                    </div>
                    <div
                      className={`text-sm ${
                        isCorrect ? "text-green-400" : "text-slate-400"
                      }`}
                    >
                      <span>
                        {isCorrect ? "+" : ""}
                        {isCorrect ? question.points : 0} points
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Back to Results Button */}
        <div className="text-center mt-8">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setGameState("finished")}
              className="px-8 py-3 bg-slate-700 text-slate-300 rounded-xl font-bold hover:bg-slate-600 transition-all duration-300"
            >
              ← Back to Results
            </button>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
            >
              Play Again
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full">
      {/* Hero Section - Full Width */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(168,85,247,0.3),transparent)]" />

        <div className="relative z-10 text-center w-full">
          <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-white mb-6">
            🧠 <span className="text-gradient-premium">Movie</span>{" "}
            <span className="text-white">Trivia Challenge</span>
          </h1>
          <p className="text-xl lg:text-2xl xl:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto">
            Test your movie knowledge with daily challenges and practice rounds!
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-2">
              {(["daily", "practice", "leaderboard"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeMode === mode
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Challenge */}
          {activeMode === "daily" && gameState === "playing" && (
            <>
              {isGeneratingQuestions ? (
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-16 h-16 mx-auto mb-6 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
                  />
                  <h2 className="text-2xl font-bold text-white mb-4">
                    🤖 AI Generating Today&apos;s Challenge
                  </h2>
                  <p className="text-slate-300">
                    Creating personalized trivia questions just for you...
                  </p>
                </div>
              ) : aiError ? (
                <AIErrorDisplay
                  error={aiError}
                  onRetry={generateDailyChallengeWithAI}
                  onUseFallback={() => {
                    setAiError(null);
                    setDailyChallenge(dailyChallenges[0]);
                  }}
                />
              ) : (
                <>
                  {/* AI Challenge Header */}
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 mb-6">
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-3xl">🤖</span>
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-white">
                          AI-Powered Daily Challenge
                        </h3>
                        <p className="text-purple-300">
                          Fresh questions generated by Gemini AI
                        </p>
                      </div>
                      <span className="text-3xl">✨</span>
                    </div>
                  </div>
                  {renderQuestion()}
                </>
              )}
            </>
          )}
          {activeMode === "daily" &&
            gameState === "finished" &&
            renderResults()}

          {/* Practice Mode Setup */}
          {activeMode === "practice" &&
            gameState === "playing" &&
            currentQuestion === 0 && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Practice Mode
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">
                      Select Category
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(triviaCategories).map(
                        ([key, category]) => (
                          <button
                            key={key}
                            onClick={() =>
                              setSelectedCategory(
                                key as keyof typeof triviaCategories
                              )
                            }
                            className={`w-full p-3 rounded-xl text-left transition-all duration-300 border-2 ${
                              selectedCategory === key
                                ? "border-purple-500 bg-purple-500/20"
                                : "border-slate-600 bg-slate-700/30 hover:border-slate-500"
                            }`}
                          >
                            <span className="text-xl mr-3">
                              {category.icon}
                            </span>
                            {category.name}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">
                      Select Difficulty
                    </h3>
                    <div className="space-y-2">
                      {(["easy", "medium", "hard"] as const).map(
                        (difficulty) => (
                          <button
                            key={difficulty}
                            onClick={() => setSelectedDifficulty(difficulty)}
                            className={`w-full p-3 rounded-xl text-left transition-all duration-300 border-2 ${
                              selectedDifficulty === difficulty
                                ? "border-purple-500 bg-purple-500/20"
                                : "border-slate-600 bg-slate-700/30 hover:border-slate-500"
                            }`}
                          >
                            <span
                              className={`text-lg mr-3 ${
                                difficulty === "easy"
                                  ? "🟢"
                                  : difficulty === "medium"
                                  ? "🟡"
                                  : "🔴"
                              }`}
                            ></span>
                            {difficulty.charAt(0).toUpperCase() +
                              difficulty.slice(1)}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Question Source Selection */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-white mb-4 text-center">
                    Choose Question Type
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setQuestionsSource("sample")}
                      className={`p-4 rounded-xl text-center transition-all duration-300 border-2 ${
                        questionsSource === "sample"
                          ? "border-blue-500 bg-blue-500/20"
                          : "border-slate-600 bg-slate-700/30 hover:border-slate-500"
                      }`}
                    >
                      <div className="text-3xl mb-2">📚</div>
                      <h4 className="font-bold text-white mb-1">
                        Sample Questions
                      </h4>
                      <p className="text-sm text-slate-300">
                        Curated trivia questions
                      </p>
                    </button>

                    <button
                      onClick={() => setQuestionsSource("ai")}
                      className={`p-4 rounded-xl text-center transition-all duration-300 border-2 ${
                        questionsSource === "ai"
                          ? "border-purple-500 bg-purple-500/20"
                          : "border-slate-600 bg-slate-700/30 hover:border-slate-500"
                      }`}
                    >
                      <div className="text-3xl mb-2">🤖</div>
                      <h4 className="font-bold text-white mb-1">
                        AI Generated
                      </h4>
                      <p className="text-sm text-slate-300">
                        Fresh questions powered by Gemini AI
                      </p>
                    </button>
                  </div>
                </div>

                <div className="text-center mt-8">
                  {aiError && questionsSource === "ai" ? (
                    <div className="mb-6">
                      <AIErrorDisplay
                        error={aiError}
                        onRetry={generateAIQuestions}
                        onUseFallback={useSampleQuestions}
                        compact
                      />
                    </div>
                  ) : null}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={async () => {
                      if (questionsSource === "ai") {
                        await generateAIQuestions();
                      }
                      if (!aiError) {
                        setCurrentQuestion(1);
                      }
                    }}
                    disabled={isGeneratingQuestions}
                    className={`px-12 py-4 font-bold text-xl rounded-2xl transition-all duration-300 ${
                      isGeneratingQuestions
                        ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                        : questionsSource === "ai"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500"
                        : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500"
                    }`}
                  >
                    {isGeneratingQuestions ? (
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-6 h-6 border-2 border-slate-400 border-t-white rounded-full"
                        />
                        <span>Generating Questions...</span>
                      </div>
                    ) : (
                      `Start ${
                        questionsSource === "ai" ? "AI-Powered" : "Sample"
                      } Practice`
                    )}
                  </motion.button>
                </div>
              </div>
            )}

          {activeMode === "practice" &&
            currentQuestion > 0 &&
            gameState === "playing" && (
              <>
                {questionsSource === "ai" && (
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30 mb-6">
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-2xl">🤖</span>
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-white">
                          AI-Generated Practice Questions
                        </h3>
                        <p className="text-purple-300 text-sm">
                          Powered by Gemini AI • {selectedCategory} •{" "}
                          {selectedDifficulty}
                        </p>
                      </div>
                      <span className="text-2xl">⚡</span>
                    </div>
                  </div>
                )}
                {renderQuestion()}
              </>
            )}
          {activeMode === "practice" &&
            gameState === "finished" &&
            renderResults()}

          {/* Review Answers Section */}
          {(activeMode === "daily" || activeMode === "practice") &&
            gameState === "review" &&
            renderReviewAnswers()}

          {/* Leaderboard */}
          {activeMode === "leaderboard" && (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                🏆 Daily Challenge Leaderboard
              </h2>

              <div className="space-y-4">
                {[
                  { rank: 1, name: "TriviaGuru2024", score: 2450, streak: 15 },
                  { rank: 2, name: "MovieBuffMaster", score: 2380, streak: 12 },
                  { rank: 3, name: "CinemaScholar", score: 2290, streak: 8 },
                  { rank: 4, name: "FilmFanatic", score: 2150, streak: 6 },
                  { rank: 5, name: "QuizQueen", score: 2080, streak: 4 },
                ].map((player) => (
                  <motion.div
                    key={player.rank}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                      player.rank === 1
                        ? "border-yellow-500 bg-yellow-500/20"
                        : player.rank === 2
                        ? "border-gray-400 bg-gray-400/20"
                        : player.rank === 3
                        ? "border-orange-500 bg-orange-500/20"
                        : "border-slate-600 bg-slate-700/30"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold text-white">
                        #{player.rank}
                      </span>
                      <div>
                        <h3 className="font-bold text-white">{player.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-orange-400">🔥</span>
                          <span className="text-slate-400 text-sm">
                            {player.streak} day streak
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-purple-400">
                        {player.score}
                      </span>
                      <p className="text-slate-300 text-sm">total points</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
