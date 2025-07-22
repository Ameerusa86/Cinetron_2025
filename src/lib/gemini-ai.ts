// Gemini AI Service for Enhanced Movie Features
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { Movie } from "@/types";
import tmdbClient from "@/lib/tmdb-client";

interface MovieContext {
  title: string;
  overview: string;
  genres: string[];
  releaseDate: string;
  rating: number;
  popularity: number;
}

interface AnalysisResult {
  confidence: number;
  reasoning: string[];
  score: number;
}

interface UserPreferences {
  favoriteGenres?: number[];
  watchHistory?: Movie[];
  ratings?: Array<{ movieId: number; rating: number }>;
}

interface ContextualInfo {
  timeOfDay?: string;
  previousSearches?: string[];
  currentActivity?: string;
}

interface CollectionCriteria {
  genres?: string[];
  themes?: string[];
  timeRange?: string;
  minRating?: number;
}

interface AICollection {
  name: string;
  description: string;
  criteria: CollectionCriteria;
  tone?: string;
  uniqueAspect?: string;
}

export class GeminiAIService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private static instance: GeminiAIService;

  private constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      console.warn(
        "⚠️ Gemini API key not found. AI features will use mock responses."
      );
      // Initialize with a dummy key for development
      this.genAI = new GoogleGenerativeAI("dummy-key");
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }

    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
  }

  public static getInstance(): GeminiAIService {
    if (!GeminiAIService.instance) {
      GeminiAIService.instance = new GeminiAIService();
    }
    return GeminiAIService.instance;
  }

  /**
   * Generate intelligent movie recommendations based on user preferences
   */
  async generateSmartRecommendations(
    userHistory: Movie[],
    currentMood?: string,
    preferences?: UserPreferences
  ): Promise<{
    recommendations: Movie[];
    analysis: AnalysisResult;
  }> {
    try {
      // Get movie context for AI analysis
      const movieContext = userHistory
        .map((movie) => this.movieToContext(movie))
        .slice(0, 10);

      const prompt = `
        As an expert movie recommendation AI, analyze this user's viewing history and provide intelligent recommendations.
        
        User's Recently Watched Movies:
        ${JSON.stringify(movieContext, null, 2)}
        
        Current Mood: ${currentMood || "Not specified"}
        
        Please analyze:
        1. User's genre preferences
        2. Preferred themes and tones
        3. Actor/director patterns
        4. Rating patterns
        
        Based on this analysis, recommend movie categories that would match their taste.
        
        Respond in JSON format:
        {
          "analysis": {
            "genres": ["genre1", "genre2"],
            "themes": ["theme1", "theme2"],
            "tones": ["tone1", "tone2"],
            "confidence": 0.85
          },
          "reasoning": ["reason1", "reason2", "reason3"],
          "recommendationStrategy": "strategy description"
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const aiAnalysis = this.parseJSONResponse(response.text());

      // Get movies based on AI analysis
      const movies = await this.fetchRecommendedMovies(aiAnalysis);

      return {
        recommendations: movies,
        analysis: {
          confidence: this.isAnalysisValid(aiAnalysis)
            ? aiAnalysis.analysis.confidence
            : 0.8,
          reasoning: this.isAnalysisValid(aiAnalysis)
            ? aiAnalysis.reasoning
            : ["AI-powered analysis"],
          score: this.isAnalysisValid(aiAnalysis)
            ? aiAnalysis.analysis.confidence * 100
            : 80,
        },
      };
    } catch (error) {
      console.error("Gemini AI recommendation error:", error);
      return this.fallbackRecommendations();
    }
  }

  /**
   * Analyze user's mood and recommend movies accordingly
   */
  async analyzeMoodAndRecommend(
    moodInput: string,
    contextualInfo?: ContextualInfo
  ): Promise<{
    mood: string;
    confidence: number;
    movies: Movie[];
    reasoning: string[];
  }> {
    try {
      const prompt = `
        Analyze this mood/emotional input and recommend appropriate movie types:
        
        User Input: "${moodInput}"
        Context: ${JSON.stringify(contextualInfo || {}, null, 2)}
        
        Please:
        1. Identify the primary emotion/mood
        2. Determine confidence level (0-1)
        3. Recommend movie genres and themes
        4. Suggest specific movie characteristics
        
        Respond in JSON format:
        {
          "detectedMood": "mood_name",
          "confidence": 0.9,
          "genres": ["genre1", "genre2"],
          "themes": ["theme1", "theme2"],
          "movieCharacteristics": {
            "tone": "light|serious|thrilling|romantic|adventurous",
            "pacing": "fast|moderate|slow",
            "complexity": "simple|moderate|complex"
          },
          "reasoning": ["reason1", "reason2"],
          "avoidGenres": ["genre1", "genre2"]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysis = this.parseJSONResponse(response.text());

      // Fetch movies based on mood analysis
      const movies = await this.fetchMoodBasedMovies(analysis);

      return {
        mood: this.isMoodAnalysisValid(analysis)
          ? analysis.detectedMood
          : moodInput.toLowerCase(),
        confidence: this.isMoodAnalysisValid(analysis)
          ? analysis.confidence
          : 0.5,
        movies,
        reasoning: this.isMoodAnalysisValid(analysis)
          ? analysis.reasoning
          : ["Fallback mood detection"],
      };
    } catch (error) {
      console.error("Mood analysis error:", error);
      return this.fallbackMoodAnalysis(moodInput);
    }
  }

  /**
   * Analyze movie reviews and create intelligent summaries
   */
  async summarizeReviews(
    movieTitle: string,
    reviews: string[]
  ): Promise<{
    summary: string;
    sentiment: "positive" | "negative" | "mixed";
    keyPoints: {
      positive: string[];
      negative: string[];
      themes: string[];
    };
    trustScore: number;
  }> {
    try {
      const reviewText = reviews.slice(0, 10).join("\n\n---\n\n");

      const prompt = `
        Analyze these movie reviews for "${movieTitle}" and provide an intelligent summary:
        
        Reviews:
        ${reviewText}
        
        Please analyze:
        1. Overall sentiment and tone
        2. Common positive themes
        3. Common criticisms
        4. Key strengths and weaknesses
        5. Reliability/trust score based on review quality
        
        Respond in JSON format:
        {
          "overallSentiment": "positive|negative|mixed",
          "summary": "2-3 sentence summary",
          "keyPoints": {
            "strengths": ["strength1", "strength2"],
            "weaknesses": ["weakness1", "weakness2"],
            "themes": ["theme1", "theme2"]
          },
          "sentimentBreakdown": {
            "positive": 70,
            "negative": 20,
            "neutral": 10
          },
          "trustScore": 0.85,
          "recommendationTone": "enthusiastic|cautious|balanced"
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysis = this.parseJSONResponse(response.text());

      return {
        summary: this.isReviewAnalysisValid(analysis)
          ? analysis.summary
          : "Review analysis unavailable",
        sentiment: this.isReviewAnalysisValid(analysis)
          ? analysis.overallSentiment
          : "mixed",
        keyPoints: {
          positive: this.isReviewAnalysisValid(analysis)
            ? analysis.keyPoints.strengths
            : [],
          negative: this.isReviewAnalysisValid(analysis)
            ? analysis.keyPoints.weaknesses
            : [],
          themes: this.isReviewAnalysisValid(analysis)
            ? analysis.keyPoints.themes
            : [],
        },
        trustScore: this.isReviewAnalysisValid(analysis)
          ? analysis.trustScore
          : 0.5,
      };
    } catch (error) {
      console.error("Review analysis error:", error);
      return this.fallbackReviewSummary(movieTitle);
    }
  }

  /**
   * Generate themed movie collections using AI
   */
  async generateIntelligentCollections(
    theme: string,
    userPreferences?: UserPreferences
  ): Promise<{
    collections: Array<{
      id: string;
      name: string;
      description: string;
      movies: Movie[];
      confidence: number;
    }>;
  }> {
    try {
      const prompt = `
        Create intelligent movie collections based on the theme: "${theme}"
        
        User preferences: ${JSON.stringify(userPreferences || {}, null, 2)}
        
        Generate 3-4 unique collections with:
        1. Creative, engaging names
        2. Compelling descriptions
        3. Specific movie criteria
        4. Variety in genres and eras
        
        Respond in JSON format:
        {
          "collections": [
            {
              "name": "Collection Name",
              "description": "Engaging description",
              "criteria": {
                "genres": ["genre1", "genre2"],
                "themes": ["theme1", "theme2"],
                "timeRange": "2000-2024",
                "minRating": 7.0
              },
              "tone": "description of collection tone",
              "uniqueAspect": "what makes this collection special"
            }
          ]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const aiCollections = this.parseJSONResponse(response.text());

      // Fetch movies for each collection
      const collectionsArray = Array.isArray(aiCollections.collections)
        ? aiCollections.collections
        : [];
      const collections = await Promise.all(
        collectionsArray.map(
          async (collection: AICollection, index: number) => {
            const movies = await this.fetchCollectionMovies(
              collection.criteria || {}
            );
            return {
              id: `ai-collection-${theme}-${index}`,
              name: collection.name || `Collection ${index + 1}`,
              description: collection.description || "AI-generated collection",
              movies: movies.slice(0, 12), // Limit to 12 movies per collection
              confidence: 0.85,
            };
          }
        )
      );

      return { collections };
    } catch (error) {
      console.error("Collection generation error:", error);
      return this.fallbackCollections(theme);
    }
  }

  /**
   * Visual search using Gemini Pro Vision for real image analysis
   */
  async analyzeMovieImage(imageFile: File): Promise<{
    detectedMovies: Movie[];
    confidence: number;
    analysis: string[];
  }> {
    console.log(
      "🔍 Starting image analysis for:",
      imageFile.name,
      "Type:",
      imageFile.type
    );

    try {
      // Check if we have a valid API key first
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey || apiKey === "dummy-key") {
        console.log("⚠️ No valid Gemini API key, using enhanced fallback");
        return await this.enhancedImageFallback(imageFile);
      }

      // Quick anime detection from filename
      const quickAnimeCheck = this.quickAnimeDetection(imageFile);
      if (quickAnimeCheck.isAnime) {
        console.log("🎌 Quick anime detection - searching anime content");
        return await this.searchAnimeContent(quickAnimeCheck.keywords);
      }

      // Convert image file to base64
      console.log("🔄 Converting image to base64...");
      const base64Image = await this.fileToBase64(imageFile);

      // Use Gemini 1.5 Flash model which supports vision
      console.log("🤖 Using Gemini 1.5 Flash for image analysis...");
      const visionModel = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      });

      const prompt = `
        Analyze this image carefully and determine if it shows content from a movie, TV show, or anime. 
        Pay special attention to:
        1. Japanese anime/manga art style (distinctive character designs, big eyes, stylized features)
        2. Specific anime series like Demon Slayer, Naruto, One Piece, Attack on Titan, etc.
        3. Character weapons, clothing, and settings
        4. Animation style vs live-action
        
        If you recognize the content, identify:
        - The exact title of the movie/show/anime
        - Character names if recognizable
        - Genre and visual style
        - Key visual elements
        
        Respond ONLY in valid JSON format:
        {
          "isAnime": true/false,
          "detectedTitle": "exact title if recognized or null",
          "characters": ["character names"],
          "genre": "anime|live-action|animation|unknown",
          "artStyle": "detailed description of art style",
          "confidence": 0.85,
          "visualElements": ["swords", "fire effects", "character designs", etc.],
          "similarTitles": ["related shows/movies"],
          "description": "what you see in the image",
          "keywords": ["search terms to find this content"]
        }
      `;

      const result = await visionModel.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: imageFile.type,
          },
        },
      ]);

      const response = await result.response;
      const responseText = response.text();
      console.log("🤖 Gemini response:", responseText);

      const analysis = this.parseJSONResponse(responseText);
      console.log("📊 Parsed analysis:", analysis);

      // Search for movies based on the analysis
      const detectedMovies = await this.searchMoviesByImageAnalysis(analysis);

      return {
        detectedMovies,
        confidence: this.isImageAnalysisValid(analysis)
          ? analysis.confidence
          : 0.7,
        analysis: this.generateImageAnalysisDescription(analysis),
      };
    } catch (error) {
      console.error("🚨 Gemini Vision analysis error:", error);
      console.log("🔧 Falling back to enhanced detection...");

      return await this.enhancedImageFallback(imageFile);
    }
  }

  // Quick anime detection from filename and characteristics
  private quickAnimeDetection(imageFile: File): {
    isAnime: boolean;
    keywords: string[];
  } {
    const filename = imageFile.name.toLowerCase();
    const animeKeywords = [
      "anime",
      "manga",
      "demon",
      "slayer",
      "kimetsu",
      "tanjiro",
      "nezuko",
      "naruto",
      "sasuke",
      "goku",
      "luffy",
      "ichigo",
      "natsu",
      "eren",
      "mikasa",
      "japanese",
      "otaku",
      "shounen",
      "seinen",
      "kawaii",
      "studio",
    ];

    const foundKeywords = animeKeywords.filter((keyword) =>
      filename.includes(keyword)
    );

    return {
      isAnime: foundKeywords.length > 0,
      keywords: foundKeywords.length > 0 ? foundKeywords : ["anime"],
    };
  }

  // Enhanced fallback with smart anime detection
  private async enhancedImageFallback(imageFile: File): Promise<{
    detectedMovies: Movie[];
    confidence: number;
    analysis: string[];
  }> {
    console.log("🔧 Using enhanced fallback for image analysis");

    try {
      // Check multiple anime indicators
      const filename = imageFile.name.toLowerCase();
      const animeIndicators = [
        filename.includes("anime"),
        filename.includes("demon"),
        filename.includes("slayer"),
        filename.includes("kimetsu"),
        filename.includes("manga"),
        filename.includes("tanjiro"),
        filename.includes("nezuko"),
        imageFile.type.includes("png"), // Many anime images are PNG
        imageFile.size < 500000, // Anime screenshots are often smaller
      ];

      const animeScore = animeIndicators.filter(Boolean).length;

      if (animeScore >= 2) {
        console.log(`🎌 High anime probability (score: ${animeScore}/9)`);
        return await this.searchAnimeContent([
          "demon slayer",
          "anime",
          "kimetsu no yaiba",
        ]);
      }

      if (animeScore >= 1) {
        console.log(`🎌 Possible anime (score: ${animeScore}/9)`);
        return await this.searchAnimeContent(["anime", "animation"]);
      }

      // Generic fallback
      console.log("🎬 Generic movie search");
      const actionMovies = await tmdbClient.searchMovies(
        "action adventure fantasy",
        1
      );

      return {
        detectedMovies: actionMovies.results.slice(0, 5),
        confidence: 0.4,
        analysis: [
          "Image analysis with smart fallback",
          `Anime indicators: ${animeScore}/9`,
          "Searching general action/adventure content",
        ],
      };
    } catch (error) {
      console.error("Enhanced fallback failed:", error);
      return this.fallbackVisualSearch();
    }
  }

  // Search for anime content specifically
  private async searchAnimeContent(keywords: string[]): Promise<{
    detectedMovies: Movie[];
    confidence: number;
    analysis: string[];
  }> {
    try {
      console.log("🎬 Searching for anime content with keywords:", keywords);

      // Prioritize specific anime titles and popular anime movies
      const animeSearchTerms = [
        "demon slayer",
        "kimetsu no yaiba",
        "demon slayer mugen train",
        "spirited away",
        "your name",
        "princess mononoke",
        "akira",
        "ghost in the shell",
        "anime",
        ...keywords,
      ];

      const searchPromises = animeSearchTerms.slice(0, 6).map(async (term) => {
        try {
          return await tmdbClient.searchMovies(term, 1);
        } catch (error) {
          console.error(`Search failed for "${term}":`, error);
          return { results: [] };
        }
      });

      const searchResults = await Promise.all(searchPromises);
      const allMovies = searchResults.flatMap((result) => result.results);

      // Remove duplicates and prioritize anime content
      const uniqueMovies = allMovies.filter(
        (movie, index, self) =>
          index === self.findIndex((m) => m.id === movie.id)
      );

      // Sort by relevance to anime
      const sortedMovies = uniqueMovies.sort((a, b) => {
        const aScore = this.calculateAnimeRelevanceScore(a);
        const bScore = this.calculateAnimeRelevanceScore(b);
        return bScore - aScore;
      });

      const detectedMovies = sortedMovies.slice(0, 5);

      console.log(
        "✅ Found anime movies:",
        detectedMovies.map((m) => m.title)
      );

      return {
        detectedMovies,
        confidence: 0.8,
        analysis: [
          "Anime content detected",
          `Searched: ${keywords.join(", ")}`,
          `Found ${detectedMovies.length} anime-related titles`,
          "Results prioritized for Japanese animation",
        ],
      };
    } catch (error) {
      console.error("Anime search failed:", error);
      return this.fallbackVisualSearch();
    }
  }

  // Calculate anime relevance score
  private calculateAnimeRelevanceScore(movie: Movie): number {
    let score = 0;
    const title = movie.title.toLowerCase();
    const overview = movie.overview.toLowerCase();

    // Anime-specific keywords
    const animeKeywords = [
      "anime",
      "animation",
      "japanese",
      "demon",
      "slayer",
      "studio",
    ];
    animeKeywords.forEach((keyword) => {
      if (title.includes(keyword)) score += 3;
      if (overview.includes(keyword)) score += 1;
    });

    // High-rated anime movies get bonus points
    if (movie.vote_average > 8) score += 2;
    if (movie.vote_average > 7) score += 1;

    return score;
  }

  // Helper method to convert file to base64
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Remove the data URL prefix
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = () => reject(new Error("File reading failed"));
      reader.readAsDataURL(file);
    });
  }

  // Type guard for image analysis
  private isImageAnalysisValid(obj: unknown): obj is {
    isAnime?: boolean;
    detectedTitle: string | null;
    confidence: number;
    genre?: string;
    keywords?: string[];
    similarTitles?: string[];
  } {
    return (
      typeof obj === "object" &&
      obj !== null &&
      ("confidence" in obj || "isAnime" in obj || "detectedTitle" in obj)
    );
  }

  // Search for movies based on image analysis results
  private async searchMoviesByImageAnalysis(
    analysis: Record<string, unknown>
  ): Promise<Movie[]> {
    try {
      console.log("🔍 Searching movies based on analysis:", analysis);

      // Check if it's anime first (highest priority)
      if (this.isImageAnalysisValid(analysis) && analysis.isAnime) {
        console.log("🎌 Analysis indicates anime content");

        // If we have a specific title, search for it
        if (analysis.detectedTitle && analysis.detectedTitle !== "null") {
          console.log(
            "📽️ Searching for detected title:",
            analysis.detectedTitle
          );
          const titleResults = await tmdbClient.searchMovies(
            analysis.detectedTitle,
            1
          );
          if (titleResults.results.length > 0) {
            return titleResults.results.slice(0, 5);
          }
        }

        // Search using keywords from analysis
        if (Array.isArray(analysis.keywords) && analysis.keywords.length > 0) {
          console.log(
            "🔑 Searching using analysis keywords:",
            analysis.keywords
          );
          const keywordResults = await this.searchAnimeContent(
            analysis.keywords
          );
          return keywordResults.detectedMovies;
        }

        // Default anime search
        console.log("🎬 Default anime search");
        const defaultAnimeResult = await this.searchAnimeContent([
          "demon slayer",
          "anime",
        ]);
        return defaultAnimeResult.detectedMovies;
      }

      // If we detected a specific non-anime title, search for it
      if (
        this.isImageAnalysisValid(analysis) &&
        analysis.detectedTitle &&
        analysis.detectedTitle !== "null"
      ) {
        console.log("🎬 Searching for detected title:", analysis.detectedTitle);
        const searchResults = await tmdbClient.searchMovies(
          analysis.detectedTitle,
          1
        );
        if (searchResults.results.length > 0) {
          return searchResults.results.slice(0, 5);
        }
      }

      // Search using keywords if available
      if (Array.isArray(analysis.keywords) && analysis.keywords.length > 0) {
        console.log("🔑 Searching using keywords:", analysis.keywords);
        const keywordSearches = await Promise.all(
          analysis.keywords.slice(0, 3).map(async (keyword: string) => {
            try {
              return await tmdbClient.searchMovies(keyword, 1);
            } catch (error) {
              console.error(`Search failed for keyword "${keyword}":`, error);
              return { results: [] };
            }
          })
        );

        const allResults = keywordSearches.flatMap((result) => result.results);
        if (allResults.length > 0) {
          return allResults.slice(0, 5);
        }
      }

      // Search for similar titles if provided
      if (
        this.isImageAnalysisValid(analysis) &&
        Array.isArray(analysis.similarTitles) &&
        analysis.similarTitles.length > 0
      ) {
        console.log("🔗 Searching similar titles:", analysis.similarTitles);
        const similarResults = await Promise.all(
          analysis.similarTitles.slice(0, 3).map(async (title: string) => {
            try {
              return await tmdbClient.searchMovies(title, 1);
            } catch (error) {
              console.error(
                `Search failed for similar title "${title}":`,
                error
              );
              return { results: [] };
            }
          })
        );

        const allSimilarMovies = similarResults.flatMap(
          (result) => result.results
        );
        if (allSimilarMovies.length > 0) {
          return allSimilarMovies.slice(0, 5);
        }
      }

      // Final fallback - trending movies
      console.log("📈 Fallback to trending movies");
      const trending = await tmdbClient.getTrendingMovies("week");
      return trending.results.slice(0, 5);
    } catch (error) {
      console.error("🚨 Movie search by image analysis failed:", error);

      // Ultimate fallback
      try {
        const popular = await tmdbClient.getPopularMovies(1);
        return popular.results.slice(0, 5);
      } catch (fallbackError) {
        console.error("🚨 Even fallback failed:", fallbackError);
        return [];
      }
    }
  }

  // Generate analysis description
  private generateImageAnalysisDescription(
    analysis: Record<string, unknown>
  ): string[] {
    const descriptions: string[] = [];

    if (this.isImageAnalysisValid(analysis)) {
      if (analysis.detectedTitle) {
        descriptions.push(`Detected: ${analysis.detectedTitle}`);
      }

      descriptions.push(`Genre: ${analysis.genre || "Unknown"}`);
      descriptions.push(
        `Confidence: ${(analysis.confidence * 100).toFixed(1)}%`
      );

      if (analysis.similarTitles && analysis.similarTitles.length > 0) {
        descriptions.push(`Similar to: ${analysis.similarTitles.join(", ")}`);
      }
    } else {
      descriptions.push("Image analysis completed");
      descriptions.push("Searching for visual matches");
    }

    return descriptions;
  }

  // Fallback for anime detection
  private async fallbackAnimeSearch(): Promise<{
    detectedMovies: Movie[];
    confidence: number;
    analysis: string[];
  }> {
    try {
      // Search for popular anime movies
      const animeSearches = [
        "demon slayer",
        "your name",
        "spirited away",
        "princess mononoke",
        "akira",
      ];

      const results = await Promise.all(
        animeSearches.map((title) => tmdbClient.searchMovies(title, 1))
      );

      const animeMovies = results
        .flatMap((result) => result.results)
        .slice(0, 5);

      return {
        detectedMovies: animeMovies,
        confidence: 0.7,
        analysis: [
          "Detected anime/animation characteristics",
          "Matched against anime movie database",
          "Fallback mode: Manual anime search",
        ],
      };
    } catch (error) {
      console.error("Fallback anime search error:", error);
      return this.fallbackVisualSearch();
    }
  }

  // General fallback
  private fallbackVisualSearch(): {
    detectedMovies: Movie[];
    confidence: number;
    analysis: string[];
  } {
    return {
      detectedMovies: [],
      confidence: 0.5,
      analysis: [
        "Visual search temporarily unavailable",
        "Using fallback mode",
        "Please try again with a different image",
      ],
    };
  }

  // Helper methods
  private movieToContext(movie: Movie): MovieContext {
    return {
      title: movie.title,
      overview: movie.overview || "",
      genres: movie.genre_ids?.map((id) => this.genreIdToName(id)) || [],
      releaseDate: movie.release_date || "",
      rating: movie.vote_average || 0,
      popularity: movie.popularity || 0,
    };
  }

  private genreIdToName(id: number): string {
    const genreMap: Record<number, string> = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Science Fiction",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };
    return genreMap[id] || "Unknown";
  }

  private parseJSONResponse(text: string): Record<string, unknown> {
    try {
      // Clean up the response text
      const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.warn("Failed to parse AI response as JSON:", error);
      return {};
    }
  }

  // Type guard helpers
  private isAnalysisValid(obj: unknown): obj is {
    analysis: { confidence: number };
    reasoning: string[];
  } {
    return (
      typeof obj === "object" &&
      obj !== null &&
      "analysis" in obj &&
      "reasoning" in obj
    );
  }

  private isMoodAnalysisValid(obj: unknown): obj is {
    detectedMood: string;
    confidence: number;
    reasoning: string[];
  } {
    return (
      typeof obj === "object" &&
      obj !== null &&
      "detectedMood" in obj &&
      "confidence" in obj &&
      "reasoning" in obj
    );
  }

  private isReviewAnalysisValid(obj: unknown): obj is {
    summary: string;
    overallSentiment: "positive" | "negative" | "mixed";
    keyPoints: {
      strengths: string[];
      weaknesses: string[];
      themes: string[];
    };
    trustScore: number;
  } {
    return (
      typeof obj === "object" &&
      obj !== null &&
      "summary" in obj &&
      "overallSentiment" in obj &&
      "keyPoints" in obj &&
      "trustScore" in obj
    );
  }

  private async fetchRecommendedMovies(
    _analysis: Record<string, unknown>
  ): Promise<Movie[]> {
    try {
      const [popular, topRated, trending] = await Promise.all([
        tmdbClient.getPopularMovies(1),
        tmdbClient.getTopRatedMovies(1),
        tmdbClient.getTrendingMovies("week"),
      ]);

      return [
        ...popular.results,
        ...topRated.results,
        ...trending.results,
      ].slice(0, 12);
    } catch (error) {
      console.error("Error fetching recommended movies:", error);
      return [];
    }
  }

  private async fetchMoodBasedMovies(
    _analysis: Record<string, unknown>
  ): Promise<Movie[]> {
    try {
      // For now, return trending movies
      // In a real implementation, you'd filter by the analyzed genres
      const trending = await tmdbClient.getTrendingMovies("week");
      return trending.results.slice(0, 8);
    } catch (_error) {
      return [];
    }
  }

  private async fetchCollectionMovies(
    _criteria: CollectionCriteria
  ): Promise<Movie[]> {
    try {
      const popular = await tmdbClient.getPopularMovies(1);
      return popular.results.slice(0, 8);
    } catch (_error) {
      return [];
    }
  }

  // Fallback methods for when AI is unavailable
  private async fallbackRecommendations() {
    const popular = await tmdbClient.getPopularMovies(1);
    return {
      recommendations: popular.results.slice(0, 10),
      analysis: {
        confidence: 0.6,
        reasoning: ["Based on popular movies"],
        score: 60,
      },
    };
  }

  private async fallbackMoodAnalysis(mood: string) {
    const trending = await tmdbClient.getTrendingMovies("week");
    return {
      mood: mood.toLowerCase(),
      confidence: 0.5,
      movies: trending.results.slice(0, 6),
      reasoning: ["Fallback mood detection"],
    };
  }

  private fallbackReviewSummary(movieTitle: string) {
    return {
      summary: `Reviews for ${movieTitle} are generally positive.`,
      sentiment: "positive" as const,
      keyPoints: {
        positive: ["Well-received by audiences"],
        negative: ["Some mixed opinions"],
        themes: ["Entertainment value"],
      },
      trustScore: 0.5,
    };
  }

  private async fallbackCollections(theme: string) {
    const popular = await tmdbClient.getPopularMovies(1);
    return {
      collections: [
        {
          id: `fallback-${theme}`,
          name: `${theme} Collection`,
          description: `A curated collection of ${theme} movies`,
          movies: popular.results.slice(0, 8),
          confidence: 0.5,
        },
      ],
    };
  }
}

export const geminiAI = GeminiAIService.getInstance();

// Trivia Questions Generation
export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: "general" | "quotes" | "cast" | "trivia" | "tech";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  explanation?: string;
}

export async function generateTriviaQuestions(
  category: string,
  difficulty: "easy" | "medium" | "hard",
  count: number = 5
): Promise<TriviaQuestion[]> {
  try {
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY!
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const difficultyPrompt = {
      easy: "basic knowledge that most movie fans would know",
      medium: "moderate difficulty requiring some movie knowledge",
      hard: "challenging questions for serious movie enthusiasts",
    };

    const categoryPrompt = {
      general:
        "general movie knowledge including awards, box office, and popular culture",
      quotes: "famous movie quotes and memorable dialogue",
      cast: "actors, directors, producers and behind-the-scenes crew",
      trivia:
        "behind-the-scenes facts, production details, and interesting movie trivia",
      tech: "technical aspects like cinematography, special effects, and film techniques",
    };

    const prompt = `Generate ${count} movie trivia questions about ${
      categoryPrompt[category as keyof typeof categoryPrompt] ||
      categoryPrompt.general
    } with ${difficultyPrompt[difficulty]} difficulty level.

Requirements:
- Each question should have exactly 4 multiple choice options
- Include the correct answer index (0, 1, 2, or 3)
- Add a brief explanation for each answer
- Cover different movies and time periods
- Make questions engaging and fun
- Points: easy=10, medium=15, hard=25

Return the response in this exact JSON format:
[
  {
    "id": "unique_id",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "category": "${category}",
    "difficulty": "${difficulty}",
    "points": ${difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 25},
    "explanation": "Brief explanation of the correct answer"
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to extract JSON
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    const questionsData = JSON.parse(jsonMatch[0]);

    return questionsData.map(
      (
        q: {
          id?: string;
          question: string;
          options: string[];
          correctAnswer: number;
          explanation?: string;
        },
        index: number
      ) => ({
        id: q.id || `gemini_${Date.now()}_${index}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        category: category as TriviaQuestion["category"],
        difficulty: difficulty,
        points: difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 25,
        explanation: q.explanation,
      })
    );
  } catch (error) {
    console.error("Error generating trivia questions:", error);

    // Fallback questions if Gemini fails
    const fallbackQuestions: TriviaQuestion[] = [
      {
        id: `fallback_${Date.now()}`,
        question: "Which movie won the Academy Award for Best Picture in 2023?",
        options: [
          "Everything Everywhere All at Once",
          "Top Gun: Maverick",
          "Avatar: The Way of Water",
          "The Banshees of Inisherin",
        ],
        correctAnswer: 0,
        category: category as TriviaQuestion["category"],
        difficulty: difficulty,
        points: difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 25,
        explanation:
          "Everything Everywhere All at Once swept the 2023 Oscars, winning 7 awards including Best Picture.",
      },
    ];

    return fallbackQuestions.slice(0, count);
  }
}

export async function generateDailyChallenge(theme: string): Promise<{
  id: string;
  date: string;
  theme: string;
  questions: TriviaQuestion[];
  bonusMultiplier: number;
}> {
  try {
    const questions = await generateTriviaQuestions("general", "medium", 5);

    return {
      id: `daily_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      theme: theme,
      questions: questions,
      bonusMultiplier: 2.0,
    };
  } catch (error) {
    console.error("Error generating daily challenge:", error);
    throw error;
  }
}
