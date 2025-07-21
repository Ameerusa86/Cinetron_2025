"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { QuickThemeToggle } from "./ui/ThemeSelector";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/movies", label: "Movies", icon: "🎬" },
  { href: "/tv-shows", label: "TV Shows", icon: "📺" },
  { href: "/trending", label: "Trending", icon: "🔥" },
  { href: "/discover", label: "Discover", icon: "🔍" },
  { href: "/ai", label: "AI Features", icon: "🤖" },
  { href: "/watchlist", label: "Watchlist", icon: "📋" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Premium Backdrop Blur */}
      <div className="fixed top-0 left-0 right-0 z-40 h-20 lg:h-24 bg-gradient-to-b from-black/80 via-slate-900/60 to-transparent backdrop-blur-xl" />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? "bg-slate-900/90 backdrop-blur-2xl shadow-2xl border-b border-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20"
            : "bg-transparent"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Premium Logo */}
            <Link href="/" className="flex items-center space-x-4 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 relative">
                    <svg viewBox="0 0 80 80" className="w-full h-full">
                      <defs>
                        <linearGradient
                          id="clapperGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="50%" stopColor="#EC4899" />
                          <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                      </defs>
                      <rect
                        x="10"
                        y="30"
                        width="50"
                        height="35"
                        fill="url(#clapperGradient)"
                        rx="3"
                      />
                      <rect
                        x="10"
                        y="30"
                        width="50"
                        height="6"
                        fill="white"
                        opacity="0.9"
                      />
                      <path
                        d="M 15 15 L 65 25 L 65 35 L 15 25 Z"
                        fill="url(#clapperGradient)"
                      />
                      <rect x="18" y="17" width="6" height="5" fill="white" />
                      <rect x="28" y="18" width="6" height="5" fill="black" />
                      <rect x="38" y="19" width="6" height="5" fill="white" />
                      <rect x="48" y="20" width="6" height="5" fill="black" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-col">
                <motion.span
                  className="text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight"
                  style={{
                    background:
                      "linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #3B82F6 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 30px rgba(139, 92, 246, 0.3)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  MOVIESENSE
                </motion.span>
                <span className="text-xs lg:text-sm text-slate-400 font-medium tracking-wider uppercase">
                  Your Movie Companion
                </span>
              </div>
            </Link>

            {/* Premium Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={item.href}
                    className="group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
                  >
                    <div
                      className={`flex items-center space-x-2 relative z-10 ${
                        pathname === item.href
                          ? "text-white"
                          : "text-slate-300 group-hover:text-white"
                      }`}
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {/* Active/Hover Background */}
                    <div
                      className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                        pathname === item.href
                          ? "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 border border-white/10"
                          : "bg-transparent group-hover:bg-white/5 group-hover:border group-hover:border-white/10"
                      }`}
                    />

                    {/* Premium Glow Effect */}
                    {pathname === item.href && (
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl blur opacity-20"
                        animate={{ opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Premium Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Premium Search */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-3 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <svg
                  className="w-5 h-5 lg:w-6 lg:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl blur opacity-0 hover:opacity-30 transition-opacity duration-300" />
              </motion.button>

              {/* Theme Toggle */}
              <QuickThemeToggle size="lg" />

              {/* Premium User Actions */}
              <div className="hidden md:flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-6 py-2.5 lg:px-8 lg:py-3 rounded-xl bg-transparent border border-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-medium transition-all duration-300 overflow-hidden group"
                >
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 group-hover:from-purple-500/20 group-hover:via-pink-500/20 group-hover:to-blue-500/20 transition-all duration-300" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-6 py-2.5 lg:px-8 lg:py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium transition-all duration-300 overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-purple-500/25"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>✨</span>
                    <span>Premium</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-blue-400 transition-all duration-300" />
                </motion.button>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden relative p-3 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl blur opacity-0 hover:opacity-30 transition-opacity duration-300" />
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
                  <input
                    type="text"
                    placeholder="Search for movies, shows, actors..."
                    className="w-full px-6 py-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800/70 transition-all duration-300"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <kbd className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-lg text-xs text-slate-400">
                      Enter
                    </kbd>
                  </div>
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
                <div className="px-4 py-6 space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-4 px-6 py-4 rounded-xl transition-all duration-300 group ${
                          pathname === item.href
                            ? "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 text-white border border-white/10"
                            : "text-slate-300 hover:text-white hover:bg-white/5"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </span>
                        <span className="font-medium text-lg">
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}

                  {/* Mobile Actions */}
                  <div className="flex flex-col space-y-3 pt-6 border-t border-white/10">
                    <button className="w-full py-4 bg-transparent border border-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-medium rounded-xl transition-all duration-300">
                      Sign In
                    </button>
                    <button className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg">
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
