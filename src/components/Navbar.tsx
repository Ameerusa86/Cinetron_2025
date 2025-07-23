"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TMDBClient } from "@/lib/tmdb-client";
import { Movie, MultiSearchResult } from "@/types";
import Image from "next/image";
import ClerkAuthButton from "@/components/ui/ClerkAuthButton";

const tmdbClient = new TMDBClient();

const navItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/movies", label: "Movies", icon: "🎬" },
  { href: "/tv-shows", label: "TV Shows", icon: "📺" },
  { href: "/trending", label: "Trending", icon: "🔥" },
  { href: "/discover", label: "Discover", icon: "🔍" },
  { href: "/games", label: "Games", icon: "🎮" },
  { href: "/ai", label: "AI Features", icon: "🤖" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MultiSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Enhanced search function for all content types
  const performSearch = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await tmdbClient.multiSearch(query, 1);
      setSearchResults(results.results.slice(0, 6)); // Show top 6 results
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Helper functions for handling different content types
  const getTitle = (result: MultiSearchResult): string => {
    if ("title" in result) return result.title; // Movie
    if ("name" in result) return result.name; // TV Show or Person
    return "Unknown";
  };

  const getYear = (result: MultiSearchResult): string => {
    if ("release_date" in result && result.release_date) {
      return new Date(result.release_date).getFullYear().toString();
    }
    if ("first_air_date" in result && result.first_air_date) {
      return new Date(result.first_air_date).getFullYear().toString();
    }
    return "N/A";
  };

  const getPosterPath = (result: MultiSearchResult): string | null => {
    if ("poster_path" in result) return result.poster_path || null;
    if ("profile_path" in result) return result.profile_path || null;
    return null;
  };

  const getRating = (result: MultiSearchResult): number => {
    if ("vote_average" in result) return result.vote_average;
    return 0;
  };

  const getMediaType = (result: MultiSearchResult): string => {
    if ("media_type" in result) return result.media_type;
    if ("title" in result) return "movie";
    if ("name" in result && "known_for_department" in result) return "person";
    if ("name" in result) return "tv";
    return "unknown";
  };

  const getMediaIcon = (result: MultiSearchResult): string => {
    const mediaType = getMediaType(result);
    switch (mediaType) {
      case "movie":
        return "🎬";
      case "tv":
        return "📺";
      case "person":
        return "👤";
      default:
        return "❓";
    }
  };

  // Handle result click with proper typing
  const handleResultClick = (result: MultiSearchResult) => {
    const mediaType = getMediaType(result);
    if (mediaType === "movie") {
      router.push(`/movie/${result.id}`);
    } else if (mediaType === "tv") {
      router.push(`/tv/${result.id}`);
    } else if (mediaType === "person") {
      router.push(`/person/${result.id}`);
    }
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Close search on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Enhanced Premium Backdrop with Dynamic Gradient */}
      <div className="fixed top-0 left-0 right-0 z-40 h-16 sm:h-20 lg:h-24">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-slate-900/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20" />
        <div className="absolute inset-0 backdrop-blur-xl" />
        {/* Animated particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse" />
          <div className="absolute top-4 right-1/3 w-1 h-1 bg-pink-400/40 rounded-full animate-bounce" />
          <div className="absolute top-2 left-2/3 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-ping" />
        </div>
      </div>

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-3xl shadow-2xl border-b border-gradient-to-r from-purple-500/30 via-pink-500/20 to-blue-500/30"
            : "bg-transparent"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
            {/* Enhanced Premium Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 sm:space-x-4 group"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="relative"
              >
                {/* Multiple glow layers for depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-2xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300" />

                <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-2xl flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-all duration-300 shadow-2xl">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 relative">
                    <svg
                      viewBox="0 0 80 80"
                      className="w-full h-full drop-shadow-lg"
                    >
                      <defs>
                        <linearGradient
                          id="clapperGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#A855F7" />
                          <stop offset="30%" stopColor="#EC4899" />
                          <stop offset="70%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur
                            stdDeviation="2"
                            result="coloredBlur"
                          />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <rect
                        x="10"
                        y="30"
                        width="50"
                        height="35"
                        fill="url(#clapperGradient)"
                        rx="4"
                        filter="url(#glow)"
                      />
                      <rect
                        x="10"
                        y="30"
                        width="50"
                        height="7"
                        fill="white"
                        opacity="0.95"
                      />
                      <path
                        d="M 15 15 L 65 25 L 65 35 L 15 25 Z"
                        fill="url(#clapperGradient)"
                        filter="url(#glow)"
                      />
                      <rect
                        x="18"
                        y="17"
                        width="6"
                        height="5"
                        fill="white"
                        opacity="0.9"
                      />
                      <rect
                        x="28"
                        y="18"
                        width="6"
                        height="5"
                        fill="rgba(0,0,0,0.8)"
                      />
                      <rect
                        x="38"
                        y="19"
                        width="6"
                        height="5"
                        fill="white"
                        opacity="0.9"
                      />
                      <rect
                        x="48"
                        y="20"
                        width="6"
                        height="5"
                        fill="rgba(0,0,0,0.8)"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-col">
                <motion.span
                  className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight"
                  style={{
                    background:
                      "linear-gradient(135deg, #A855F7 0%, #EC4899 25%, #3B82F6 50%, #06B6D4 75%, #A855F7 100%)",
                    backgroundSize: "200% 200%",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 40px rgba(139, 92, 246, 0.4)",
                    animation: "gradient-shift 4s ease-in-out infinite",
                  }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Cinetron
                </motion.span>
                <motion.span
                  className="hidden sm:block text-xs lg:text-sm text-slate-400 font-medium tracking-wider uppercase"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Your Movie Companion
                </motion.span>
              </div>
            </Link>

            {/* Enhanced Premium Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                >
                  <Link
                    href={item.href}
                    className="group relative px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-500 hover:scale-105"
                  >
                    <div
                      className={`flex items-center space-x-2.5 relative z-10 ${
                        pathname === item.href
                          ? "text-white"
                          : "text-slate-300 group-hover:text-white"
                      }`}
                    >
                      <motion.span
                        className="text-lg group-hover:scale-125 transition-all duration-300"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        {item.icon}
                      </motion.span>
                      <span className="tracking-wide">{item.label}</span>
                    </div>

                    {/* Enhanced Active/Hover Background - Removed for cleaner look */}
                    <div
                      className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                        pathname === item.href
                          ? ""
                          : "bg-transparent group-hover:bg-gradient-to-r group-hover:from-purple-500/5 group-hover:via-pink-500/5 group-hover:to-blue-500/5"
                      }`}
                    />

                    {/* Premium Bottom Glow Line for Active State */}
                    {pathname === item.href && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "80%", opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <div className="h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full" />
                        <motion.div
                          className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full blur-sm opacity-60 -mt-1"
                          animate={{
                            opacity: [0.4, 0.8, 0.4],
                            scaleX: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </motion.div>
                    )}

                    {/* Enhanced Premium Glow Effect - Reduced for cleaner look */}
                    {pathname === item.href && (
                      <motion.div
                        className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-2xl blur-lg opacity-50"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}

                    {/* Hover Glow Effect */}
                    <motion.div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Premium Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Enhanced Premium Search */}
              <motion.button
                whileHover={{ scale: 1.08, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="relative p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-black/90 border border-white/20 text-slate-300 hover:text-white hover:border-white/40 transition-all duration-300 backdrop-blur-sm shadow-xl group"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </motion.svg>

                {/* Multi-layer glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-2xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300" />

                {/* Search indicator */}
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>

              {/* Enhanced Premium User Actions - XL screens */}
              <div className="hidden xl:flex items-center space-x-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <ClerkAuthButton />
                </motion.div>
              </div>

              {/* Enhanced Compact Actions - Medium screens */}
              <div className="hidden md:flex xl:hidden items-center space-x-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <ClerkAuthButton />
                </motion.div>
              </div>

              {/* Enhanced Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.08, rotate: isMobileMenuOpen ? 0 : 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="lg:hidden relative p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-slate-800/90 via-slate-900/80 to-black/90 border border-white/20 text-slate-300 hover:text-white hover:border-white/40 transition-all duration-300 backdrop-blur-sm shadow-xl group"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <motion.svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </motion.svg>

                {/* Enhanced glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-2xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              </motion.button>
            </div>
          </div>

          {/* Premium Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="py-4 border-t border-white/10"
              >
                <div className="relative max-w-2xl mx-auto">
                  <form onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search for movies, shows, actors..."
                      className="w-full px-6 py-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800/70 transition-all duration-300"
                      autoFocus
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      {isSearching && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4"
                        >
                          <svg
                            className="w-4 h-4 text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        </motion.div>
                      )}
                      <kbd className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-lg text-xs text-slate-400">
                        Enter
                      </kbd>
                    </div>
                  </form>

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-2 border-b border-white/10">
                        <span className="text-sm text-slate-400 font-medium">
                          Search Results ({searchResults.length})
                        </span>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {searchResults.map((result, index) => {
                          const posterPath = getPosterPath(result);
                          const title = getTitle(result);
                          const year = getYear(result);
                          const rating = getRating(result);
                          const mediaIcon = getMediaIcon(result);

                          return (
                            <motion.div
                              key={result.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleResultClick(result)}
                              className="flex items-center space-x-4 px-4 py-3 hover:bg-white/5 cursor-pointer transition-all duration-200"
                            >
                              <div className="w-12 h-16 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                                {posterPath ? (
                                  <Image
                                    src={`https://image.tmdb.org/t/p/w92${posterPath}`}
                                    alt={title}
                                    width={48}
                                    height={64}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-2xl">
                                    {mediaIcon}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium truncate">
                                  {title}
                                </h4>
                                <p className="text-slate-400 text-sm">
                                  {year} • {getMediaType(result)}
                                </p>
                                {rating > 0 && (
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-yellow-400 text-xs">
                                      ★
                                    </span>
                                    <span className="text-slate-400 text-xs">
                                      {rating.toFixed(1)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <svg
                                className="w-5 h-5 text-slate-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </motion.div>
                          );
                        })}
                      </div>
                      <div className="px-4 py-3 border-t border-white/10 bg-slate-800/50">
                        <button
                          onClick={handleSearchSubmit}
                          className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
                        >
                          View all results for &ldquo;{searchQuery}&rdquo;
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-slate-900/98 to-slate-800/98 backdrop-blur-2xl border-t border-white/10 shadow-2xl"
              >
                <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 sm:space-x-4 px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-300 group ${
                          pathname === item.href
                            ? "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 text-white border border-white/10"
                            : "text-slate-300 hover:text-white hover:bg-white/5"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </span>
                        <span className="font-medium text-base sm:text-lg">
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}

                  {/* Mobile Actions - More compact */}
                  <div className="flex flex-col space-y-3 pt-6 border-t border-white/10">
                    <div className="w-full">
                      <ClerkAuthButton />
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg text-sm">
                      ✨ Get Premium
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
}
