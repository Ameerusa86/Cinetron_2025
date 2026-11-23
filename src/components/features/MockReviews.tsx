"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { MessageSquare, Star, ThumbsUp, Send, User } from "lucide-react";
import type { Review } from "@/types";
import { useNotificationStore } from "@/stores";

interface LocalReview {
  id: string;
  author: string;
  rating: number | null;
  content: string;
  date: string;
  source: "tmdb" | "community";
  likes: number;
  liked?: boolean;
}

interface MockReviewsProps {
  movieId: number;
  tmdbReviews?: Review[];
}

export function MockReviews({ tmdbReviews = [] }: MockReviewsProps) {
  const { user } = useUser();
  const { addNotification } = useNotificationStore();

  const initialTMDB: LocalReview[] = tmdbReviews.slice(0, 8).map((r) => ({
    id: r.id,
    author: r.author_details?.name || r.author || "TMDB Member",
    rating: r.author_details?.rating ?? null,
    content: r.content,
    date: r.created_at
      ? new Date(r.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Verified Review",
    source: "tmdb",
    likes: 0,
    liked: false,
  }));

  const [communityReviews, setCommunityReviews] = useState<LocalReview[]>([]);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(8);

  const allReviews = [...communityReviews, ...initialTMDB];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    const authorName =
      user?.fullName || user?.firstName || user?.username || "Guest Cinephile";

    const review: LocalReview = {
      id: `local-${Date.now()}`,
      author: authorName,
      rating,
      content: newReview.trim(),
      date: "Just now",
      source: "community",
      likes: 0,
      liked: false,
    };

    setCommunityReviews((prev) => [review, ...prev]);
    setNewReview("");
    setRating(8);

    addNotification({
      type: "success",
      title: "Review Posted",
      message: "Your review has been published to this title.",
      read: false,
    });
  };

  const toggleLike = (id: string) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="surface-card p-6 sm:p-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Audience &amp; Critic Reviews
            </h2>
            <p className="text-xs text-muted-foreground">
              {allReviews.length}{" "}
              {allReviews.length === 1 ? "review" : "reviews"} available
            </p>
          </div>
        </div>
      </div>

      {/* Write a Review Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-secondary/40 p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">
            Share Your Take
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Your Rating:</span>
            <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-mono text-xs font-bold text-foreground">
                {rating}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value, 10))}
              aria-label="Rating out of 10"
              className="w-28 accent-primary cursor-pointer"
            />
          </div>
        </div>

        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write your thoughts on direction, performances, pacing, or cinematography..."
          rows={3}
          required
          className="w-full rounded-xl border border-border bg-card p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
        />

        <div className="flex justify-end">
          <button type="submit" className="btn-cinema px-5 py-2">
            <Send className="h-3.5 w-3.5" />
            <span>Post Review</span>
          </button>
        </div>
      </form>

      {/* Reviews List */}
      {allReviews.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No TMDB reviews yet for this title. Be the first to share your take
          above.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {allReviews.map((review) => {
            const isLong = review.content.length > 360;
            const isExpanded = Boolean(expandedIds[review.id]);
            const isLiked = Boolean(likedIds[review.id]);

            return (
              <article key={review.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">
                          {review.author}
                        </h4>
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {review.source === "tmdb" ? "TMDB" : "Community"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {review.date}
                      </p>
                    </div>
                  </div>

                  {review.rating !== null && (
                    <div className="inline-flex items-center gap-1 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 shrink-0">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-mono">{review.rating}/10</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {isLong && !isExpanded
                    ? `${review.content.slice(0, 360)}...`
                    : review.content}
                </p>

                <div className="mt-3 flex items-center gap-4 text-xs">
                  {isLong && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedIds((prev) => ({
                          ...prev,
                          [review.id]: !prev[review.id],
                        }))
                      }
                      className="font-medium text-primary hover:underline cursor-pointer"
                    >
                      {isExpanded ? "Show less" : "Read full review"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleLike(review.id)}
                    className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isLiked
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>Helpful ({review.likes + (isLiked ? 1 : 0)})</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
