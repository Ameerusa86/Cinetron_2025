"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Bookmark, Check, Film, Tv, User } from "lucide-react";
import tmdbClient from "@/lib/tmdb-client";
import {
  createMovieSlug,
  createPersonSlug,
  createTVShowSlug,
} from "@/lib/slug-utils";
import { useNotificationStore, useUserStore } from "@/stores";

export interface MediaCardProps {
  id: number;
  title: string;
  mediaType: "movie" | "tv" | "person";
  imagePath?: string | null;
  rating?: number;
  year?: string | number | null;
  subtitle?: string;
  rank?: number;
  badge?: string;
  showWatchlistAction?: boolean;
  className?: string;
}

export function MediaCard({
  id,
  title,
  mediaType,
  imagePath,
  rating,
  year,
  subtitle,
  rank,
  badge,
  showWatchlistAction = true,
  className = "",
}: MediaCardProps) {
  const [imgError, setImgError] = useState(false);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useUserStore();
  const { addNotification } = useNotificationStore();

  const href =
    mediaType === "movie"
      ? `/movie/${createMovieSlug(title, id)}`
      : mediaType === "tv"
      ? `/tv/${createTVShowSlug(title, id)}`
      : `/person/${createPersonSlug(title, id)}`;

  const imageUrl = !imgError
    ? tmdbClient.getImageUrl(imagePath || null, "w500")
    : null;

  const inWatchlist = mediaType !== "person" && isInWatchlist(id);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (mediaType === "person") return;

    if (inWatchlist) {
      removeFromWatchlist(id);
      addNotification({
        type: "info",
        title: "Removed from Watchlist",
        message: `"${title}" removed from your watchlist.`,
        read: false,
      });
    } else {
      addToWatchlist({ id, type: mediaType });
      addNotification({
        type: "success",
        title: "Added to Watchlist",
        message: `"${title}" saved to your watchlist.`,
        read: false,
      });
    }
  };

  const formattedYear =
    typeof year === "string" && year.length >= 4
      ? year.slice(0, 4)
      : typeof year === "number"
      ? String(year)
      : null;

  return (
    <Link
      href={href}
      className={`group flex flex-col focus-visible:outline-none ${className}`}
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-secondary border border-border transition-all duration-300 group-hover:border-foreground/25 group-hover:shadow-xl group-hover:shadow-black/30">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 18vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-secondary text-muted-foreground p-4 text-center">
            {mediaType === "movie" ? (
              <Film className="h-8 w-8 opacity-40" />
            ) : mediaType === "tv" ? (
              <Tv className="h-8 w-8 opacity-40" />
            ) : (
              <User className="h-8 w-8 opacity-40" />
            )}
            <span className="text-xs font-medium line-clamp-2 opacity-60">
              {title}
            </span>
          </div>
        )}

        {/* Subtle bottom vignette on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Top-left badge (Rank or Custom) */}
        {rank !== undefined ? (
          <div className="absolute top-2.5 left-2.5 z-10 flex h-7 min-w-7 items-center justify-center rounded-md bg-black/80 px-2 font-mono text-xs font-bold text-white backdrop-blur-md border border-white/15">
            #{rank}
          </div>
        ) : badge ? (
          <div className="absolute top-2.5 left-2.5 z-10 rounded-md bg-primary/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
            {badge}
          </div>
        ) : null}

        {/* Top-right Rating Pill */}
        {mediaType !== "person" && rating !== undefined && rating > 0 && (
          <div className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 rounded-md bg-black/75 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-mono">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Quick Watchlist Toggle on Hover */}
        {showWatchlistAction && mediaType !== "person" && (
          <button
            type="button"
            onClick={handleWatchlistToggle}
            aria-label={
              inWatchlist ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`
            }
            className={`absolute bottom-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-lg border backdrop-blur-md transition-all duration-200 cursor-pointer ${
              inWatchlist
                ? "bg-primary border-primary text-white opacity-100"
                : "bg-black/75 border-white/15 text-white opacity-0 group-hover:opacity-100 hover:bg-primary hover:border-primary"
            }`}
          >
            {inWatchlist ? (
              <Check className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Clean Editorial Metadata Below Poster */}
      <div className="mt-2.5 space-y-0.5 px-0.5">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {subtitle ? (
            <span className="truncate">{subtitle}</span>
          ) : (
            <>
              {formattedYear && <span className="font-mono">{formattedYear}</span>}
              {formattedYear && <span className="opacity-40">·</span>}
              <span className="capitalize">
                {mediaType === "tv" ? "Series" : mediaType}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export function MediaCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-[2/3] w-full rounded-xl bg-secondary skeleton-shimmer border border-border" />
      <div className="mt-2.5 space-y-1.5 px-0.5">
        <div className="h-4 w-4/5 rounded bg-secondary skeleton-shimmer" />
        <div className="h-3 w-2/5 rounded bg-secondary skeleton-shimmer" />
      </div>
    </div>
  );
}

export function MediaGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  );
}
