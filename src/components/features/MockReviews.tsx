"use client";

import React, { useState } from "react";
import Image from "next/image";

interface MockReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
  likes: number;
}

const generateMockReviews = (movieId: number): MockReview[] => {
  // Use movieId as seed for consistent mock data
  const seed = movieId % 5;
  const reviewsList = [
    [
      {
        id: "1",
        author: "Sarah Jenkins",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        rating: 9,
        content: "Absolutely brilliant! The cinematography was breathtaking and the performances were top-notch. I couldn't look away for a single second.",
        date: "2 days ago",
        likes: 124
      },
      {
        id: "2",
        author: "Mike Ross",
        avatar: "https://i.pravatar.cc/150?u=mike",
        rating: 7,
        content: "A solid effort, but the pacing felt a bit off in the second act. Still worth watching for the stunning visual effects.",
        date: "1 week ago",
        likes: 45
      },
      {
        id: "3",
        author: "Elena Rodriguez",
        avatar: "https://i.pravatar.cc/150?u=elena",
        rating: 10,
        content: "A masterpiece. This will go down as one of the best films of the decade.",
        date: "3 weeks ago",
        likes: 312
      }
    ],
    [
      {
        id: "4",
        author: "David Chen",
        avatar: "https://i.pravatar.cc/150?u=david",
        rating: 8,
        content: "Really enjoyed the character development here. The ending was surprising but fitting.",
        date: "4 days ago",
        likes: 89
      },
      {
        id: "5",
        author: "Anna Smith",
        avatar: "https://i.pravatar.cc/150?u=anna",
        rating: 6,
        content: "It was okay. I felt like I've seen this story told better before, but the acting saved it.",
        date: "2 weeks ago",
        likes: 23
      }
    ]
  ];

  return reviewsList[seed % reviewsList.length];
};

interface MockReviewsProps {
  movieId: number;
}

export function MockReviews({ movieId }: MockReviewsProps) {
  const [reviews, setReviews] = useState<MockReview[]>(generateMockReviews(movieId));
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    const review: MockReview = {
      id: Date.now().toString(),
      author: "Guest User",
      avatar: "https://i.pravatar.cc/150?u=guest",
      rating,
      content: newReview,
      date: "Just now",
      likes: 0
    };

    setReviews([review, ...reviews]);
    setNewReview("");
    setRating(10);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-10 shadow-2xl mt-8">
      <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3 mb-8">
        <span>💬</span> Community Reviews
      </h2>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="mb-10 bg-black/40 p-6 rounded-2xl border border-white/5">
        <h3 className="text-xl font-semibold text-white mb-4">Write a Review</h3>
        <div className="mb-4">
          <label className="block text-slate-400 text-sm mb-2">Rating ({rating}/10)</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={rating} 
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="What did you think of the movie?"
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors mb-4 min-h-[100px]"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
        >
          Post Review
        </button>
      </form>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-white/10 pb-6 last:border-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Image 
                  src={review.avatar} 
                  alt={review.author} 
                  width={40} 
                  height={40} 
                  className="rounded-full"
                />
                <div>
                  <h4 className="text-white font-medium">{review.author}</h4>
                  <p className="text-slate-400 text-xs">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded font-bold text-sm">
                <span>⭐</span> {review.rating}/10
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              {review.content}
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <button className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                <span>👍</span> {review.likes}
              </button>
              <span>•</span>
              <button className="hover:text-emerald-400 transition-colors">Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
