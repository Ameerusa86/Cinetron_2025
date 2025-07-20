"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useThemeStore } from "@/stores";
import { QuickThemeToggle } from "./ui/ThemeSelector";

const navItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/movies", label: "Movies", icon: "🎬" },
  { href: "/tv-shows", label: "TV Shows", icon: "📺" },
  { href: "/trending", label: "Trending", icon: "🔥" },
  { href: "/discover", label: "Discover", icon: "🔍" },
  { href: "/watchlist", label: "Watchlist", icon: "📋" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-xl shadow-premium"
          : "bg-transparent"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-cinema rounded-lg flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
              <span className="text-white font-bold text-xl lg:text-2xl">
                🎬
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl xl:text-3xl font-display font-bold text-gradient-premium">
                CinemaVault
              </span>
              <span className="text-xs lg:text-sm text-slate-400 -mt-1">
                Premium
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-5 py-3 lg:px-6 lg:py-4 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-cinema text-white shadow-glow"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <span className="text-lg lg:text-xl">{item.icon}</span>
                  <span className="font-medium text-sm lg:text-base">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Search Button */}
            <button className="p-2 lg:p-3 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300">
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
            </button>

            {/* Theme Toggle */}
            <QuickThemeToggle size="md" />
              onClick={toggleTheme}
              className="p-2 lg:p-3 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 group relative"
              title={`Current theme: ${theme} - Click to toggle`}
            >
              <span className="text-lg lg:text-xl transition-transform duration-300 group-hover:scale-110">
                {theme === "light" ? "☀️" : 
                 theme === "dark" ? "🌙" : 
                 theme === "cinema" ? "🎬" : 
                 theme === "cinema-dark" ? "�" : 
                 theme === "system" || theme === "auto" ? "🔄" : "�"}
              </span>
              
              {/* Theme indicator tooltip */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {theme === "light" ? "Light Mode" :
                 theme === "dark" ? "Dark Mode" :
                 theme === "cinema" ? "Cinema Light" :
                 theme === "cinema-dark" ? "Cinema Dark" :
                 theme === "system" ? "System" :
                 theme === "auto" ? "Auto" : "Theme"}
              </div>
            </button>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-3">
              <button className="btn-cinema-outline text-sm lg:text-base px-6 py-2 lg:px-8 lg:py-3">
                Sign In
              </button>
              <button className="btn-cinema text-sm lg:text-base px-6 py-2 lg:px-8 lg:py-3">
                Premium
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 lg:p-3 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
            >
              <svg
                className="w-6 h-6 lg:w-7 lg:h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-900/98 backdrop-blur-xl rounded-2xl mt-2 p-6 shadow-premium animate-fade-in-down">
            <div className="space-y-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-cinema text-white shadow-glow"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}

              <div className="border-t border-slate-700 pt-4 mt-4 space-y-3">
                <button className="btn-cinema-outline w-full text-sm py-3">
                  Sign In
                </button>
                <button className="btn-cinema w-full text-sm py-3">
                  Get Premium
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
