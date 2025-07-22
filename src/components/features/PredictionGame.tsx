"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface PredictionGame {
  id: string;
  title: string;
  category: "box-office" | "ratings" | "awards";
  deadline: string;
  status: "active" | "closed" | "completed";
}

type PredictionData = {
  openingWeekend?: number;
  totalDomestic?: number;
  totalWorldwide?: number;
  numberOfWeeks?: number;
  imdbScore?: number;
  rottenTomatoesScore?: number;
  metacriticScore?: number;
  audienceScore?: number;
  oscarNominations?: number;
  oscarWins?: number;
  goldenGlobeNominations?: number;
  goldenGlobeWins?: number;
  categories?: string[];
};

const predictionCategories = {
  "box-office": {
    name: "Box Office Performance",
    icon: "💰",
    description: "Predict how much a movie will earn",
    color: "from-green-500 to-emerald-600",
  },
  ratings: {
    name: "Critical & Audience Ratings",
    icon: "⭐",
    description: "Predict review scores across platforms",
    color: "from-yellow-500 to-orange-600",
  },
  awards: {
    name: "Awards & Recognition",
    icon: "🏆",
    description: "Predict award nominations and wins",
    color: "from-purple-500 to-pink-600",
  },
};

const sampleGames: PredictionGame[] = [
  {
    id: "1",
    title: "Dune: Part Three Box Office",
    category: "box-office",
    deadline: "2024-12-31",
    status: "active",
  },
  {
    id: "2",
    title: "Marvel's Next Phase Ratings",
    category: "ratings",
    deadline: "2024-11-30",
    status: "active",
  },
  {
    id: "3",
    title: "2025 Oscar Predictions",
    category: "awards",
    deadline: "2025-02-28",
    status: "active",
  },
];

const upcomingMovies = [
  { id: 1, title: "Avatar 3", releaseDate: "2025-12-19", genre: "Sci-Fi" },
  { id: 2, title: "The Batman 2", releaseDate: "2025-10-03", genre: "Action" },
  { id: 3, title: "Blade", releaseDate: "2025-11-07", genre: "Action" },
  {
    id: 4,
    title: "Fantastic Four",
    releaseDate: "2025-07-25",
    genre: "Superhero",
  },
];

export default function PredictionGame() {
  const [activeTab, setActiveTab] = useState<
    "participate" | "create" | "leaderboard"
  >("participate");
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof predictionCategories>("box-office");
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [userPredictions, setUserPredictions] = useState<PredictionData>({});
  const [confidence, setConfidence] = useState(50);

  const renderBoxOfficePrediction = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">
        Box Office Prediction
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Opening Weekend (Domestic)
          </label>
          <input
            type="number"
            placeholder="$50,000,000"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            onChange={(e) =>
              setUserPredictions({
                ...userPredictions,
                openingWeekend: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Total Domestic Box Office
          </label>
          <input
            type="number"
            placeholder="$200,000,000"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            onChange={(e) =>
              setUserPredictions({
                ...userPredictions,
                totalDomestic: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Worldwide Total
          </label>
          <input
            type="number"
            placeholder="$500,000,000"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            onChange={(e) =>
              setUserPredictions({
                ...userPredictions,
                totalWorldwide: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Weeks in Top 10
          </label>
          <input
            type="number"
            placeholder="8"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            onChange={(e) =>
              setUserPredictions({
                ...userPredictions,
                numberOfWeeks: Number(e.target.value),
              })
            }
          />
        </div>
      </div>
    </div>
  );

  const renderRatingsPrediction = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Ratings Prediction</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            IMDb Score (1-10)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            step="0.1"
            placeholder="7.5"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            onChange={(e) =>
              setUserPredictions({
                ...userPredictions,
                imdbScore: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Rotten Tomatoes (0-100%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="85"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            onChange={(e) =>
              setUserPredictions({
                ...userPredictions,
                rottenTomatoesScore: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Metacritic Score (0-100)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="75"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            onChange={(e) =>
              setUserPredictions({
                ...userPredictions,
                metacriticScore: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Audience Score (0-100%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="90"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            onChange={(e) =>
              setUserPredictions({
                ...userPredictions,
                audienceScore: Number(e.target.value),
              })
            }
          />
        </div>
      </div>
    </div>
  );

  const renderAwardsPrediction = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Awards Prediction</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Oscar Nominations
          </label>
          <input
            type="number"
            min="0"
            max="15"
            placeholder="8"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            onChange={(e) =>
              setUserPredictions({
                ...userPredictions,
                oscarNominations: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Oscar Wins
          </label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="3"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            onChange={(e) =>
              setUserPredictions({
                ...userPredictions,
                oscarWins: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Golden Globe Nominations
          </label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="5"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            onChange={(e) =>
              setUserPredictions({
                ...userPredictions,
                goldenGlobeNominations: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Golden Globe Wins
          </label>
          <input
            type="number"
            min="0"
            max="5"
            placeholder="2"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            onChange={(e) =>
              setUserPredictions({
                ...userPredictions,
                goldenGlobeWins: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Likely Award Categories
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            "Best Picture",
            "Best Director",
            "Best Actor",
            "Best Actress",
            "Best Supporting Actor",
            "Best Supporting Actress",
            "Best Screenplay",
            "Best Cinematography",
            "Best Visual Effects",
            "Best Sound",
            "Best Production Design",
            "Best Costume Design",
          ].map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-purple-600 rounded"
                onChange={(e) => {
                  const currentCategories = userPredictions.categories || [];
                  const newCategories = e.target.checked
                    ? [...currentCategories, category]
                    : currentCategories.filter((c: string) => c !== category);
                  setUserPredictions({
                    ...userPredictions,
                    categories: newCategories,
                  });
                }}
              />
              <span className="text-sm text-slate-300">{category}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPredictionForm = () => {
    switch (selectedCategory) {
      case "box-office":
        return renderBoxOfficePrediction();
      case "ratings":
        return renderRatingsPrediction();
      case "awards":
        return renderAwardsPrediction();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full">
      {/* Hero Section - Full Width */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.3),transparent)]" />

        <div className="relative z-10 text-center w-full">
          <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-white mb-6">
            🔮 <span className="text-gradient-premium">Movie</span>{" "}
            <span className="text-white">Prediction Game</span>
          </h1>
          <p className="text-xl lg:text-2xl xl:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto">
            Test your movie industry knowledge! Predict box office numbers,
            ratings, and awards for upcoming movies.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-2">
              {(["participate", "create", "leaderboard"] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Content */}
          {activeTab === "participate" && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Movie Selection */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Select Movie
                </h2>
                <div className="space-y-4">
                  {upcomingMovies.map((movie) => (
                    <motion.div
                      key={movie.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedMovie(movie.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedMovie === movie.id
                          ? "border-purple-500 bg-purple-500/20"
                          : "border-slate-600 bg-slate-700/30 hover:border-slate-500"
                      }`}
                    >
                      <h3 className="font-bold text-white">{movie.title}</h3>
                      <p className="text-slate-400 text-sm">{movie.genre}</p>
                      <p className="text-slate-300 text-sm">
                        {movie.releaseDate}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Prediction Categories */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Prediction Type
                </h2>
                <div className="space-y-4">
                  {Object.entries(predictionCategories).map(
                    ([key, category]) => (
                      <motion.div
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        onClick={() =>
                          setSelectedCategory(
                            key as keyof typeof predictionCategories
                          )
                        }
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          selectedCategory === key
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-slate-600 bg-slate-700/30 hover:border-slate-500"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <h3 className="font-bold text-white">
                              {category.name}
                            </h3>
                            <p className="text-slate-400 text-sm">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              </div>

              {/* Active Games */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Active Games
                </h2>
                <div className="space-y-4">
                  {sampleGames.map((game) => (
                    <div
                      key={game.id}
                      className="p-4 rounded-xl bg-slate-700/30 border border-slate-600"
                    >
                      <h3 className="font-bold text-white text-sm">
                        {game.title}
                      </h3>
                      <p className="text-slate-400 text-xs">
                        {predictionCategories[game.category].name}
                      </p>
                      <p className="text-slate-300 text-xs">
                        Deadline: {game.deadline}
                      </p>
                      <span className="inline-block mt-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                        {game.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Prediction Form */}
          {activeTab === "participate" && selectedMovie && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20"
            >
              {renderPredictionForm()}

              {/* Confidence Slider */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confidence Level: {confidence}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Submit Button */}
              <div className="mt-8 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    selectedMovie
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500"
                      : "bg-slate-600 text-slate-400 cursor-not-allowed"
                  }`}
                  disabled={!selectedMovie}
                >
                  Submit Prediction
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Leaderboard */}
          {activeTab === "leaderboard" && (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                🏆 Leaderboard
              </h2>

              <div className="space-y-4">
                {[
                  {
                    rank: 1,
                    name: "MovieMaster2024",
                    score: 95,
                    predictions: 47,
                  },
                  {
                    rank: 2,
                    name: "CinephileGuru",
                    score: 89,
                    predictions: 52,
                  },
                  {
                    rank: 3,
                    name: "BoxOfficeBoss",
                    score: 87,
                    predictions: 38,
                  },
                  {
                    rank: 4,
                    name: "RatingPredictor",
                    score: 82,
                    predictions: 44,
                  },
                  { rank: 5, name: "OscarOracle", score: 79, predictions: 29 },
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
                        <p className="text-slate-400 text-sm">
                          {player.predictions} predictions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-purple-400">
                        {player.score}%
                      </span>
                      <p className="text-slate-300 text-sm">accuracy</p>
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
