// AI Services for Movie App
import { Movie } from "@/types";
import tmdbClient from "@/lib/tmdb-client";

export interface UserPreferences {
  favoriteGenres: number[];
  preferredActors: number[];
  watchedMovies: number[];
  ratedMovies: { id: number; rating: number; timestamp: Date }[];
  moodHistory: { mood: string; movies: number[]; timestamp: Date }[];
  searchHistory: string[];
}

export interface AIRecommendation {
  movie: Movie;
  confidence: number;
  reasons: string[];
  category:
    | "genre_match"
    | "actor_preference"
    | "mood_based"
    | "similar_users"
    | "trending";
}

export interface MoodAnalysis {
  primaryMood: string;
  confidence: number;
  recommendedGenres: string[];
  suggestedTone: "light" | "serious" | "adventurous" | "romantic" | "thrilling";
}

export interface ReviewSummary {
  overallSentiment: "positive" | "negative" | "mixed";
  keyPoints: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
  themes: string[];
  rating: number;
  trustScore: number;
}

export interface IntelligentCollection {
  id: string;
  name: string;
  description: string;
  movies: Movie[];
  theme: string;
  generatedAt: Date;
  confidence: number;
}

export interface VisualSearchResult {
  movie: Movie;
  confidence: number;
  matchedScene?: string;
  timestamp?: string;
}

export interface UserInteraction {
  type: "watch" | "rate" | "search" | "mood";
  data: {
    movieId?: number;
    rating?: number;
    query?: string;
  };
}

// Mock AI Service Implementation
export class AIMovieService {
  private static instance: AIMovieService;
  private userPreferences: UserPreferences = {
    favoriteGenres: [],
    preferredActors: [],
    watchedMovies: [],
    ratedMovies: [],
    moodHistory: [],
    searchHistory: [],
  };

  static getInstance(): AIMovieService {
    if (!AIMovieService.instance) {
      AIMovieService.instance = new AIMovieService();
    }
    return AIMovieService.instance;
  }

  // Smart Recommendations
  async getSmartRecommendations(): Promise<AIRecommendation[]> {
    // Simulate AI processing
    await this.delay(1500);

    try {
      // Get various movie lists from TMDB to create diverse recommendations
      const [popularMovies, topRatedMovies, trendingMovies] = await Promise.all(
        [
          tmdbClient.getPopularMovies(1),
          tmdbClient.getTopRatedMovies(1),
          tmdbClient.getTrendingMovies("week"),
        ]
      );

      // Create AI recommendations from real TMDB data
      const recommendations: AIRecommendation[] = [];

      // Add top rated movie as genre match
      if (topRatedMovies.results.length > 0) {
        const movie = topRatedMovies.results[0];
        recommendations.push({
          movie,
          confidence: 0.92,
          reasons: [
            "Matches your preference for high-quality cinema",
            "Critically acclaimed with exceptional ratings",
            "Popular among users with sophisticated taste",
          ],
          category: "genre_match",
        });
      }

      // Add popular movie as similar users recommendation
      if (popularMovies.results.length > 1) {
        const movie = popularMovies.results[1];
        recommendations.push({
          movie,
          confidence: 0.89,
          reasons: [
            "Popular among users with similar viewing patterns",
            "High audience engagement and ratings",
            "Trending in your preferred genres",
          ],
          category: "similar_users",
        });
      }

      // Add trending movie
      if (trendingMovies.results.length > 0) {
        const movie = trendingMovies.results[2] || trendingMovies.results[0];
        recommendations.push({
          movie,
          confidence: 0.85,
          reasons: [
            "Currently trending and highly discussed",
            "Matches current viewing trends",
            "Recommended by AI based on popularity surge",
          ],
          category: "trending",
        });
      }

      return recommendations;
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
      // Fallback to empty array if TMDB fails
      return [];
    }
  }

  // Movie Mood Detector
  async detectMoodAndRecommend(moodDescription: string): Promise<{
    analysis: MoodAnalysis;
    recommendations: Movie[];
  }> {
    await this.delay(2000);

    // Simple mood analysis (in real app, this would use NLP)
    const moodKeywords = {
      happy: ["happy", "joy", "cheerful", "upbeat", "fun", "comedy"],
      sad: ["sad", "depressed", "melancholy", "crying", "emotional"],
      excited: ["excited", "thrilled", "pumped", "energetic", "action"],
      romantic: ["romantic", "love", "date night", "relationship", "heart"],
      adventurous: ["adventure", "explore", "journey", "travel", "epic"],
    };

    let detectedMood = "neutral";
    let confidence = 0.5;

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      const matches = keywords.filter((keyword) =>
        moodDescription.toLowerCase().includes(keyword)
      );
      if (matches.length > 0) {
        detectedMood = mood;
        confidence = Math.min(0.95, 0.6 + matches.length * 0.1);
        break;
      }
    }

    const analysis: MoodAnalysis = {
      primaryMood: detectedMood,
      confidence,
      recommendedGenres: this.getMoodGenres(detectedMood),
      suggestedTone: this.getMoodTone(detectedMood),
    };

    // Get mood-based recommendations from TMDB
    let recommendations: Movie[] = [];
    try {
      // Based on detected mood, get appropriate movie recommendations
      let movieList;

      if (detectedMood === "happy" || detectedMood === "excited") {
        // Get popular action/adventure movies for happy/excited moods
        movieList = await tmdbClient.getPopularMovies(1);
      } else if (detectedMood === "sad") {
        // Get top-rated dramas for sad moods
        movieList = await tmdbClient.getTopRatedMovies(1);
      } else if (detectedMood === "romantic") {
        // Get trending movies (likely to have romance)
        movieList = await tmdbClient.getTrendingMovies("week");
      } else if (detectedMood === "adventurous") {
        // Get popular movies for adventure
        movieList = await tmdbClient.getPopularMovies(1);
      } else {
        // Default to trending
        movieList = await tmdbClient.getTrendingMovies("day");
      }

      // Filter and select appropriate movies (take first 3)
      recommendations = movieList.results.slice(0, 3).map((movie) => ({
        ...movie,
        overview: `Perfect match for your ${detectedMood} mood`,
      }));
    } catch (error) {
      console.error("Error fetching mood-based recommendations:", error);
      // Fallback to empty array if TMDB fails
      recommendations = [];
    }

    // Store mood history
    this.userPreferences.moodHistory.push({
      mood: detectedMood,
      movies: recommendations.map((m) => m.id),
      timestamp: new Date(),
    });

    return { analysis, recommendations };
  }

  // Visual Search (Mock implementation)
  async searchByImage(): Promise<VisualSearchResult[]> {
    await this.delay(3000);

    try {
      // In a real implementation, this would use computer vision API
      // For demo purposes, we'll return some popular/trending movies as "matches"
      const searchResults = await tmdbClient.getTrendingMovies("day");

      if (searchResults.results.length > 0) {
        // Return first few results as potential matches
        return searchResults.results.slice(0, 2).map((movie, index) => ({
          movie: {
            ...movie,
            overview: "Visual match found in uploaded scene",
          },
          confidence: 0.87 - index * 0.1, // Decreasing confidence for subsequent results
          matchedScene:
            index === 0 ? "Action sequence" : "Character dialogue scene",
          timestamp: index === 0 ? "1:23:45" : "0:45:12",
        }));
      }

      return [];
    } catch (error) {
      console.error("Error in visual search:", error);
      return [];
    }
  }

  // AI Reviews Summary
  async summarizeReviews(): Promise<ReviewSummary> {
    await this.delay(1200);

    // Mock summary - in real app, this would analyze actual reviews
    return {
      overallSentiment: "positive",
      keyPoints: {
        positive: [
          "Outstanding cinematography and visual effects",
          "Compelling character development and performances",
          "Innovative storytelling approach",
        ],
        negative: [
          "Pacing issues in the second act",
          "Some plot points feel underdeveloped",
        ],
        neutral: [
          "Runtime of 2.5 hours may not suit all viewers",
          "Complex narrative requires attention",
        ],
      },
      themes: ["heroism", "sacrifice", "redemption", "justice"],
      rating: 8.7,
      trustScore: 0.85,
    };
  }

  // Intelligent Collections Generator
  async generateIntelligentCollections(): Promise<IntelligentCollection[]> {
    await this.delay(2500);

    try {
      // Get different types of movie lists to create diverse collections
      const [popularMovies, topRatedMovies, trendingMovies] = await Promise.all(
        [
          tmdbClient.getPopularMovies(1),
          tmdbClient.getTopRatedMovies(1),
          tmdbClient.getTrendingMovies("week"),
        ]
      );

      return [
        {
          id: "hidden-gems-2024",
          name: "Hidden Gems You Missed",
          description: "Underrated masterpieces based on your viewing patterns",
          movies: topRatedMovies.results.slice(5, 10), // Use less popular top-rated movies as hidden gems
          theme: "discovery",
          generatedAt: new Date(),
          confidence: 0.91,
        },
        {
          id: "mood-booster",
          name: "Your Personal Mood Boosters",
          description:
            "Films that consistently improve your mood based on past reactions",
          movies: popularMovies.results.slice(0, 5), // Use popular movies as mood boosters
          theme: "wellness",
          generatedAt: new Date(),
          confidence: 0.88,
        },
        {
          id: "weekend-binge",
          name: "Perfect Weekend Binge",
          description:
            "Curated series and trilogies matching your weekend viewing habits",
          movies: trendingMovies.results.slice(0, 6), // Use trending movies for binge watching
          theme: "binge-worthy",
          generatedAt: new Date(),
          confidence: 0.94,
        },
        {
          id: "critics-choice",
          name: "Critics' Choice Collection",
          description: "Critically acclaimed films selected by our AI",
          movies: topRatedMovies.results.slice(0, 4), // Top rated movies for critics choice
          theme: "discovery",
          generatedAt: new Date(),
          confidence: 0.96,
        },
      ];
    } catch (error) {
      console.error("Error generating intelligent collections:", error);
      // Fallback to empty collections if TMDB fails
      return [
        {
          id: "empty-collection",
          name: "Collections Unavailable",
          description: "Unable to generate collections at this time",
          movies: [],
          theme: "discovery",
          generatedAt: new Date(),
          confidence: 0.0,
        },
      ];
    }
  }

  // Update user preferences based on interactions
  updateUserPreferences(interaction: UserInteraction) {
    switch (interaction.type) {
      case "watch":
        if (interaction.data.movieId) {
          this.userPreferences.watchedMovies.push(interaction.data.movieId);
        }
        break;
      case "rate":
        if (interaction.data.movieId && interaction.data.rating) {
          this.userPreferences.ratedMovies.push({
            id: interaction.data.movieId,
            rating: interaction.data.rating,
            timestamp: new Date(),
          });
        }
        break;
      case "search":
        if (interaction.data.query) {
          this.userPreferences.searchHistory.push(interaction.data.query);
        }
        break;
    }
  }

  private getMoodGenres(mood: string): string[] {
    const genreMap: Record<string, string[]> = {
      happy: ["Comedy", "Animation", "Family", "Musical"],
      sad: ["Drama", "Romance", "Biography"],
      excited: ["Action", "Adventure", "Thriller", "Science Fiction"],
      romantic: ["Romance", "Drama", "Comedy"],
      adventurous: ["Adventure", "Action", "Fantasy", "Science Fiction"],
    };
    return genreMap[mood] || ["Drama", "Comedy"];
  }

  private getMoodTone(
    mood: string
  ): "light" | "serious" | "adventurous" | "romantic" | "thrilling" {
    const toneMap: Record<
      string,
      "light" | "serious" | "adventurous" | "romantic" | "thrilling"
    > = {
      happy: "light",
      sad: "serious",
      excited: "thrilling",
      romantic: "romantic",
      adventurous: "adventurous",
    };
    return toneMap[mood] || "light";
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const aiService = AIMovieService.getInstance();
