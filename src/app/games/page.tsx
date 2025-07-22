"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const games = [
  {
    id: "quiz",
    title: "Movie Quiz Generator",
    description:
      "Test your movie knowledge with AI-generated quizzes based on popular films",
    icon: "🎭",
    href: "/games/quiz",
    color: "from-purple-500 to-pink-500",
    difficulty: "Easy to Expert",
    players: "Single Player",
  },
  {
    id: "bingo",
    title: "Movie Bingo",
    description:
      "Make movie nights interactive with custom bingo cards for different genres",
    icon: "🎯",
    href: "/games/bingo",
    color: "from-blue-500 to-cyan-500",
    difficulty: "All Levels",
    players: "Group Activity",
  },
  {
    id: "prediction",
    title: "Movie Prediction Game",
    description:
      "Predict box office numbers, ratings, and awards for upcoming movies",
    icon: "🔮",
    href: "/games/prediction",
    color: "from-green-500 to-emerald-500",
    difficulty: "Strategic",
    players: "Competitive",
  },
  {
    id: "trivia",
    title: "Movie Trivia Challenge",
    description:
      "Daily trivia challenges with movie facts, quotes, and behind-the-scenes info",
    icon: "🧠",
    href: "/games/trivia",
    color: "from-orange-500 to-red-500",
    difficulty: "Mixed",
    players: "Solo or Group",
  },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full">
      {/* Hero Section - Full Width */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(156,39,176,0.3),transparent)]" />

        <div className="relative z-10 text-center w-full">
          <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-white mb-6">
            🎮 <span className="text-gradient-premium">Movie</span>{" "}
            <span className="text-white">Games</span>
          </h1>
          <p className="text-xl lg:text-2xl xl:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto">
            Interactive movie experiences that make your cinema knowledge come
            alive! Challenge yourself and friends with our premium game
            collection.
          </p>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link href={game.href}>
                  <div className="relative h-full bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                    ></div>

                    {/* Content */}
                    <div className="relative p-8 h-full flex flex-col">
                      {/* Icon and Title */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="text-5xl">{game.icon}</div>
                        <div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                            {game.title}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-300 text-lg leading-relaxed mb-6 flex-grow">
                        {game.description}
                      </p>

                      {/* Game Info */}
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex space-x-4">
                          <span className="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-slate-300">
                            {game.difficulty}
                          </span>
                          <span className="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-slate-300">
                            {game.players}
                          </span>
                        </div>
                      </div>

                      {/* Play Button */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-4 bg-gradient-to-r ${game.color} rounded-2xl text-center font-bold text-white text-lg group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300`}
                      >
                        Play Now →
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 xl:px-12 bg-slate-50 dark:bg-slate-900/50 w-full">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Our Games Are Special
            </h2>
            <p className="text-xl text-slate-300">
              Premium interactive experiences designed for movie lovers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI-Powered",
                description:
                  "Smart algorithms generate unique content every time you play",
              },
              {
                icon: "🎨",
                title: "Premium Design",
                description:
                  "Beautiful animations and glass morphism effects for immersive gameplay",
              },
              {
                icon: "📊",
                title: "Progress Tracking",
                description:
                  "Detailed statistics, achievements, and leaderboards to track your growth",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
