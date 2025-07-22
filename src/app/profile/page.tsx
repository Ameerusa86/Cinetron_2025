"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ClerkPremiumBackground } from "@/lib/clerk-theme";
import { useUserStore } from "@/stores";
import { useClerkUserSync } from "@/hooks/useClerkUserSync";
import { TMDBClient } from "@/lib/tmdb-client";
import {
  Heart,
  Clock,
  Star,
  Settings,
  User,
  Film,
  Tv,
  TrendingUp,
  Eye,
  BookmarkPlus,
  Play,
  Plus,
  Search,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import type { WatchlistItem, MovieDetails, TVShowDetails } from "@/types";

const tmdbClient = new TMDBClient();

const tabVariants = {
  active: { borderBottomColor: "#f97316", color: "#ffffff" },
  inactive: { borderBottomColor: "transparent", color: "#94a3b8" },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

interface EnrichedWatchlistItem extends WatchlistItem {
  details?: MovieDetails | TVShowDetails;
  loading?: boolean;
}

interface EnrichedFavoriteItem {
  id: number;
  type: "movie";
  details?: MovieDetails;
}

function ProfileContent() {
  const { user: clerkUser } = useUser();
  const { user: appUser } = useUserStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [enrichedWatchlist, setEnrichedWatchlist] = useState<
    EnrichedWatchlistItem[]
  >([]);
  const [enrichedFavorites, setEnrichedFavorites] = useState<
    EnrichedFavoriteItem[]
  >([]);
  const [recentlyWatched, setRecentlyWatched] = useState<
    EnrichedWatchlistItem[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Sync Clerk user with app user
  useClerkUserSync();

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "watchlist", label: "Watchlist", icon: Clock },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "history", label: "Recently Watched", icon: Eye },
    { id: "reviews", label: "My Reviews", icon: Star },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Get user statistics - filter out completed items from watchlist count
  const getFilteredStats = () => {
    if (!appUser?.watchlist) return { movies: 0, tvShows: 0, completed: 0 };

    // Separate active watchlist (not completed) from completed items
    const activeWatchlist = appUser.watchlist.filter(
      (item) => item.status !== "completed"
    );
    const completedItems = appUser.watchlist.filter(
      (item) => item.status === "completed"
    );

    return {
      movies: activeWatchlist.filter((item) => item.type === "movie").length,
      tvShows: activeWatchlist.filter((item) => item.type === "tv").length,
      completed: completedItems.length,
    };
  };

  const stats = getFilteredStats();
  const totalRatings = appUser?.ratings
    ? Object.keys(appUser.ratings).length
    : 0;

  const userStats = [
    {
      label: "Movies in Watchlist",
      value: stats.movies.toString(),
      icon: Film,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "TV Shows in Watchlist",
      value: stats.tvShows.toString(),
      icon: Tv,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Completed",
      value: stats.completed.toString(),
      icon: Clock,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Ratings Given",
      value: totalRatings.toString(),
      icon: Star,
      color: "from-orange-500 to-orange-600",
    },
  ];

  // Fetch details for watchlist items
  useEffect(() => {
    const fetchWatchlistDetails = async () => {
      if (!appUser?.watchlist?.length) {
        setLoading(false);
        return;
      }

      // Filter out completed items from watchlist - they should only appear in history
      const activeWatchlistItems = appUser.watchlist.filter(
        (item) => item.status !== "completed"
      );

      const enriched = await Promise.all(
        activeWatchlistItems
          .slice(0, 10)
          .map(async (item): Promise<EnrichedWatchlistItem> => {
            try {
              const details =
                item.type === "movie"
                  ? await tmdbClient.getMovieDetails(item.id)
                  : await tmdbClient.getTVShowDetails(item.id);
              return { ...item, details };
            } catch (error) {
              console.error(
                `Failed to fetch details for ${item.type} ${item.id}:`,
                error
              );
              return { ...item, details: undefined };
            }
          })
      );

      setEnrichedWatchlist(enriched);
    };

    const fetchFavoritesDetails = async () => {
      if (!appUser?.favorites?.length) return;

      const enriched = await Promise.all(
        appUser.favorites.slice(0, 10).map(async (movieId) => {
          try {
            const details = await tmdbClient.getMovieDetails(movieId);
            return { id: movieId, type: "movie" as const, details };
          } catch (error) {
            console.error(
              `Failed to fetch details for movie ${movieId}:`,
              error
            );
            return { id: movieId, type: "movie" as const, details: undefined };
          }
        })
      );

      setEnrichedFavorites(enriched);
    };

    const fetchRecentlyWatched = async () => {
      if (!appUser?.watchlist?.length) return;

      // Get completed items, sorted by completion date
      const completed = appUser.watchlist
        .filter((item) => item.status === "completed" && item.completedAt)
        .sort(
          (a, b) =>
            new Date(b.completedAt!).getTime() -
            new Date(a.completedAt!).getTime()
        )
        .slice(0, 8);

      const enriched = await Promise.all(
        completed.map(async (item): Promise<EnrichedWatchlistItem> => {
          try {
            const details =
              item.type === "movie"
                ? await tmdbClient.getMovieDetails(item.id)
                : await tmdbClient.getTVShowDetails(item.id);
            return { ...item, details };
          } catch (error) {
            console.error(
              `Failed to fetch details for ${item.type} ${item.id}:`,
              error
            );
            return { ...item, details: undefined };
          }
        })
      );

      setRecentlyWatched(enriched);
    };

    Promise.all([
      fetchWatchlistDetails(),
      fetchFavoritesDetails(),
      fetchRecentlyWatched(),
    ]).finally(() => setLoading(false));
  }, [appUser?.watchlist, appUser?.favorites]);

  const renderMovieCard = (
    item: EnrichedWatchlistItem | EnrichedFavoriteItem,
    showStatus = false
  ) => {
    const details = item.details;

    // Type-safe title extraction
    const title =
      details && "title" in details
        ? details.title
        : details && "name" in details
        ? details.name
        : "Unknown Title";

    // Type-safe year extraction
    const year =
      details && "release_date" in details
        ? details.release_date?.split("-")[0]
        : details && "first_air_date" in details
        ? details.first_air_date?.split("-")[0]
        : "N/A";

    const rating = details?.vote_average?.toFixed(1) || "N/A";
    const posterPath = details?.poster_path;

    // Check if item has status (only watchlist items have status)
    const hasStatus = "status" in item && item.status;

    // Click handlers
    const handleCardClick = () => {
      // Navigate to movie/TV show details page
      const detailPath =
        item.type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
      router.push(detailPath);
    };

    const handleWatchlistClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card click

      // Context-aware watchlist button behavior
      if (activeTab === "watchlist") {
        // If we're on watchlist tab, navigate to the full watchlist page
        router.push("/watchlist");
      } else if (activeTab === "history") {
        // If we're on history tab, go back to watchlist to see current items
        setActiveTab("watchlist");
      } else {
        // From other tabs, switch to watchlist tab
        setActiveTab("watchlist");
      }
    };

    const handleDetailsClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card click
      const detailPath =
        item.type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
      router.push(detailPath);
    };

    return (
      <motion.div
        key={item.id}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden group cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative aspect-[2/3] bg-gradient-to-br from-slate-800 to-slate-900">
          {posterPath ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${posterPath}`}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Film className="w-8 h-8 text-slate-500" />
            </div>
          )}

          {showStatus && hasStatus && (
            <div className="absolute top-2 left-2">
              <div className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                <span className="text-white text-xs font-medium capitalize">
                  {(item as EnrichedWatchlistItem).status?.replace("-", " ")}
                </span>
              </div>
            </div>
          )}

          <div className="absolute top-2 right-2">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              <span className="text-yellow-400 text-xs font-medium">
                ⭐ {rating}
              </span>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              <button
                className="flex-1 bg-white/20 backdrop-blur-sm text-white py-2 px-3 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                onClick={handleDetailsClick}
              >
                <Play className="w-4 h-4" />
                Details
              </button>
              {showStatus && (
                <button
                  className="flex-1 bg-orange-500/20 backdrop-blur-sm text-orange-300 py-2 px-3 rounded-lg font-medium hover:bg-orange-500/30 transition-colors flex items-center justify-center gap-2"
                  onClick={handleWatchlistClick}
                >
                  {activeTab === "watchlist" ? (
                    <>
                      <Eye className="w-4 h-4" />
                      Manage
                    </>
                  ) : activeTab === "history" ? (
                    <>
                      <Clock className="w-4 h-4" />
                      Watchlist
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      Watchlist
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold truncate">{title}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-slate-400 text-sm">{year}</span>
            <div className="flex items-center gap-1">
              {item.type === "movie" ? (
                <Film className="w-4 h-4 text-slate-400" />
              ) : (
                <Tv className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-slate-400 text-xs capitalize">
                {item.type}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* User Info Card */}
      <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            {clerkUser?.imageUrl ? (
              <Image
                src={clerkUser.imageUrl}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-2xl shadow-2xl"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-slate-900 flex items-center justify-center">
              <span className="text-xs">✓</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {clerkUser?.firstName} {clerkUser?.lastName || "Movie Enthusiast"}
            </h2>
            <p className="text-slate-300 mb-2">
              {clerkUser?.primaryEmailAddress?.emailAddress}
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 px-3 py-1 rounded-full border border-white/10">
                <span className="text-orange-400 text-sm font-medium">
                  🎬 Premium Member
                </span>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 px-3 py-1 rounded-full border border-white/10">
                <span className="text-blue-400 text-sm font-medium">
                  ⚡ Member since{" "}
                  {new Date(clerkUser?.createdAt || "").getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {userStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/[0.05] transition-all"
          >
            <div
              className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
            >
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8">
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Search,
              label: "Find Movies",
              color: "from-blue-500 to-blue-600",
              action: () => router.push("/discover"),
            },
            {
              icon: Clock,
              label: "Manage Watchlist",
              color: "from-green-500 to-green-600",
              action: () => router.push("/watchlist"),
            },
            {
              icon: BookmarkPlus,
              label: "Add to Watchlist",
              color: "from-orange-500 to-orange-600",
              action: () => router.push("/movies"),
            },
            {
              icon: TrendingUp,
              label: "Trending Now",
              color: "from-purple-500 to-purple-600",
              action: () => router.push("/trending"),
            },
          ].map((action) => (
            <motion.button
              key={action.label}
              onClick={action.action}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-center transition-all group"
            >
              <div
                className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}
              >
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-slate-300 text-sm font-medium">
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderList = (
    items: (EnrichedWatchlistItem | EnrichedFavoriteItem)[],
    title: string,
    emptyMessage: string,
    showStatus = false,
    addNewUrl = "/movies"
  ) => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <button
          onClick={() => router.push(addNewUrl)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-4 py-2 rounded-lg text-white font-medium transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Film className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No items yet
          </h3>
          <p className="text-slate-400 mb-6">{emptyMessage}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/discover")}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-6 py-3 rounded-lg text-white font-medium transition-all hover:scale-105 active:scale-95"
            >
              Browse Movies & TV Shows
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-lg text-white font-medium transition-all hover:scale-105 active:scale-95"
            >
              Back to Overview
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {items.map((item) => renderMovieCard(item, showStatus))}
          </div>
          {items.length >= 10 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => {
                  // Navigate to appropriate page based on current tab
                  if (title.includes("Watchlist")) setActiveTab("watchlist");
                  else if (title.includes("Favorites"))
                    setActiveTab("favorites");
                  else if (title.includes("Recently")) setActiveTab("history");
                }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-lg text-white font-medium transition-all hover:scale-105 active:scale-95"
              >
                View All ({title})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "watchlist":
        return renderList(
          enrichedWatchlist,
          `My Watchlist (${enrichedWatchlist.length} active)`,
          "Add movies and TV shows you want to watch! Completed items will automatically move to your viewing history.",
          true,
          "/movies"
        );
      case "favorites":
        return renderList(
          enrichedFavorites,
          "My Favorites",
          "Mark movies and shows as favorites to see them here!",
          false,
          "/movies"
        );
      case "history":
        return renderList(
          recentlyWatched,
          `Recently Watched (${recentlyWatched.length} completed)`,
          "Your completed movies and TV shows will appear here. Mark items as 'completed' in your watchlist to see them here!",
          false,
          "/watchlist"
        );
      case "reviews":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">My Reviews</h3>
              <button
                onClick={() => router.push("/movies")}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-4 py-2 rounded-lg text-white font-medium transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Write Review
              </button>
            </div>
            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
              <Star className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No reviews yet
              </h3>
              <p className="text-slate-400 mb-6">
                Share your thoughts about movies and TV shows!
              </p>
              <button
                onClick={() => router.push("/movies")}
                className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-6 py-3 rounded-lg text-white font-medium transition-all hover:scale-105 active:scale-95"
              >
                Write Your First Review
              </button>
            </div>
          </div>
        );
      case "settings":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Account Settings
              </h3>
              <button
                onClick={() => {
                  // Here you could implement save functionality
                  alert("Settings saved!");
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-4 py-2 rounded-lg text-white font-medium transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <Settings className="w-4 h-4" />
                Save Changes
              </button>
            </div>
            <div className="space-y-6">
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Preferences
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-slate-300 text-sm font-medium">
                      Language
                    </label>
                    <select className="mt-1 block w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm font-medium">
                      Country
                    </label>
                    <select className="mt-1 block w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Notifications
                </h4>
                <div className="space-y-4">
                  {[
                    "New releases from favorite actors",
                    "Watchlist reminders",
                    "Friend activity updates",
                    "Weekly recommendations",
                  ].map((setting) => (
                    <div
                      key={setting}
                      className="flex items-center justify-between"
                    >
                      <span className="text-slate-300">{setting}</span>
                      <button className="relative w-12 h-6 bg-orange-500 rounded-full transition-colors">
                        <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <ClerkPremiumBackground>
      <div className="relative z-10 min-h-screen pt-20 lg:pt-28 w-full">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 pb-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                My Profile
              </span>
            </h1>
            <p className="text-slate-300 text-lg lg:text-xl max-w-2xl mx-auto">
              Your personal cinema experience dashboard
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-2 max-w-4xl mx-auto">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                variants={tabVariants}
                animate={activeTab === tab.id ? "active" : "inactive"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all hover:bg-white/10"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="max-w-7xl mx-auto"
          >
            {activeTab === "watchlist" && recentlyWatched.length > 0 && (
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-300 font-medium">
                      You have {recentlyWatched.length} completed item
                      {recentlyWatched.length !== 1 ? "s" : ""} in your viewing
                      history
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab("history")}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  >
                    View History →
                  </button>
                </div>
              </div>
            )}

            {activeTab === "history" && enrichedWatchlist.length > 0 && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-medium">
                      You have {enrichedWatchlist.length} active item
                      {enrichedWatchlist.length !== 1 ? "s" : ""} in your
                      watchlist
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab("watchlist")}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Watchlist →
                  </button>
                </div>
              </div>
            )}

            {renderContent()}
          </motion.div>
        </div>
      </div>
    </ClerkPremiumBackground>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
