"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface TrailerModalProps {
  videoKey: string | null;
  title?: string;
  onClose: () => void;
}

export function TrailerModal({
  videoKey,
  title = "Trailer",
  onClose,
}: TrailerModalProps) {
  useEffect(() => {
    if (!videoKey) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [videoKey, onClose]);

  if (!videoKey) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-300 truncate pr-4">
            {title}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close trailer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
            title={title}
            className="h-full w-full"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        </div>
      </div>
    </div>
  );
}
