"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react";
import Image from "next/image";
import { Movie } from "@/types";

// Extend Window interface for YouTube API
declare global {
  interface Window {
    YT?: unknown;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface MovieTrailerProps {
  movie: Movie;
  videoKey?: string;
  isOpen: boolean;
  onClose: () => void;
  autoPlay?: boolean;
  showControls?: boolean;
}

interface TrailerPlayerProps {
  videoKey: string;
  title: string;
  autoPlay?: boolean;
  muted?: boolean;
  onReady?: () => void;
  onError?: () => void;
}

// YouTube Trailer Player Component
function YouTubePlayer({
  videoKey,
  title,
  autoPlay = true,
  muted = true,
  onReady,
  onError,
}: TrailerPlayerProps) {
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        setPlayerReady(true);
        onReady?.();
      };
    } else {
      setPlayerReady(true);
      onReady?.();
    }

    return () => {
      if (window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = undefined;
      }
    };
  }, [onReady]);

  const embedUrl = `https://www.youtube.com/embed/${videoKey}?${new URLSearchParams(
    {
      autoplay: autoPlay ? "1" : "0",
      mute: muted ? "1" : "0",
      controls: "1",
      modestbranding: "1",
      rel: "0",
      showinfo: "0",
      fs: "1",
      enablejsapi: "1",
      origin: window.location.origin,
    }
  ).toString()}`;

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {!playerReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4" />
            <p className="text-white text-sm">Loading trailer...</p>
          </div>
        </div>
      )}

      <iframe
        src={embedUrl}
        title={`${title} - Official Trailer`}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setPlayerReady(true)}
        onError={() => onError?.()}
      />
    </div>
  );
}

// Vimeo Trailer Player Component
function VimeoPlayer({
  videoKey,
  title,
  autoPlay = true,
  muted = true,
  onReady,
  onError,
}: TrailerPlayerProps) {
  const embedUrl = `https://player.vimeo.com/video/${videoKey}?${new URLSearchParams(
    {
      autoplay: autoPlay ? "1" : "0",
      muted: muted ? "1" : "0",
      controls: "1",
      title: "0",
      byline: "0",
      portrait: "0",
    }
  ).toString()}`;

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <iframe
        src={embedUrl}
        title={`${title} - Official Trailer`}
        className="w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        onLoad={() => onReady?.()}
        onError={() => onError?.()}
      />
    </div>
  );
}

// Main Movie Trailer Modal Component
export default function MovieTrailer({
  movie,
  videoKey,
  isOpen,
  onClose,
  autoPlay = true,
  showControls = true,
}: MovieTrailerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playerType, setPlayerType] = useState<"youtube" | "vimeo">("youtube");
  const [hasError, setHasError] = useState(false);

  // Determine player type based on video key format
  useEffect(() => {
    if (videoKey) {
      // YouTube video IDs are typically 11 characters
      // Vimeo video IDs are typically numeric
      if (/^\d+$/.test(videoKey)) {
        setPlayerType("vimeo");
      } else {
        setPlayerType("youtube");
      }
    }
  }, [videoKey]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Handle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!videoKey) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl ${
              isFullscreen
                ? "w-full h-full"
                : "w-full max-w-6xl aspect-video max-h-[80vh]"
            }`}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h3 className="font-semibold text-lg truncate">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-slate-300">Official Trailer</p>
                </div>

                {showControls && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
                    >
                      {isFullscreen ? (
                        <Minimize2 size={20} />
                      ) : (
                        <Maximize2 size={20} />
                      )}
                    </button>

                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg bg-red-500/80 hover:bg-red-500 transition-colors text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Video Player */}
            <div className="w-full h-full">
              {hasError ? (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-800 to-slate-900 text-white">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <h3 className="text-xl font-semibold mb-2">
                      Trailer Unavailable
                    </h3>
                    <p className="text-slate-400">
                      Sorry, the trailer for this movie is not available.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {playerType === "youtube" ? (
                    <YouTubePlayer
                      videoKey={videoKey}
                      title={movie.title}
                      autoPlay={autoPlay}
                      muted={isMuted}
                      onError={() => setHasError(true)}
                    />
                  ) : (
                    <VimeoPlayer
                      videoKey={videoKey}
                      title={movie.title}
                      autoPlay={autoPlay}
                      muted={isMuted}
                      onError={() => setHasError(true)}
                    />
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Trailer Preview Thumbnail Component
export function TrailerThumbnail({
  movie,
  videoKey,
  onClick,
  className = "",
}: {
  movie: Movie;
  videoKey: string;
  onClick: () => void;
  className?: string;
}) {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoKey}/maxresdefault.jpg`;

  return (
    <motion.div
      className={`relative group cursor-pointer rounded-xl overflow-hidden ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Image
        src={thumbnailUrl}
        alt={`${movie.title} trailer`}
        className="w-full h-full object-cover"
        fill
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder-video.svg";
        }}
      />

      {/* Play Button Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
        <motion.div
          className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Play fill="white" color="white" size={24} className="ml-1" />
        </motion.div>
      </div>

      {/* Duration Badge */}
      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 text-white text-sm">
        Trailer
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
