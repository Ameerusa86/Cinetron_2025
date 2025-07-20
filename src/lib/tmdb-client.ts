import axios, { AxiosInstance, AxiosResponse } from "axios";
import type {
  Movie,
  MovieDetails,
  MovieResponse,
  TVShow,
  TVShowResponse,
  TVShowDetails,
  Credits,
  VideoResponse,
  ReviewResponse,
  Person,
  PersonDetails,
  Genre,
  MultiSearchResult,
  TMDBResponse,
  PersonResponse,
  MultiSearchResponse,
} from "@/types";

class TMDBClient {
  private api: AxiosInstance;
  private readonly baseURL: string;
  private readonly imageBaseURL: string;
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
    this.baseURL =
      process.env.NEXT_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3";
    this.imageBaseURL =
      process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL ||
      "https://image.tmdb.org/t/p";

    if (!this.apiKey) {
      console.warn(
        "⚠️ TMDB API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file"
      );
    }

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      params: {
        api_key: this.apiKey,
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(
          `🎬 [TMDB API] ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("❌ [TMDB API] Request error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(
          `✅ [TMDB API] Response received for ${response.config.url}`
        );
        return response;
      },
      (error) => {
        console.error(
          "❌ [TMDB API] Response error:",
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get image URL with specified size
   */
  getImageUrl(path: string | null, size: string = "w500"): string | null {
    if (!path) return null;
    return `${this.imageBaseURL}/${size}${path}`;
  }

  /**
   * Get multiple image sizes for a path
   */
  getImageSizes(path: string | null): { [key: string]: string | null } {
    return {
      thumbnail: this.getImageUrl(path, "w154"),
      small: this.getImageUrl(path, "w300"),
      medium: this.getImageUrl(path, "w500"),
      large: this.getImageUrl(path, "w780"),
      original: this.getImageUrl(path, "original"),
    };
  }

  // ======================
  // DISCOVER & TRENDING
  // ======================

  /**
   * Get trending movies
   */
  async getTrendingMovies(
    timeWindow: "day" | "week" = "day"
  ): Promise<MovieResponse> {
    const response = await this.api.get<MovieResponse>(
      `/trending/movie/${timeWindow}`
    );
    return response.data;
  }

  /**
   * Get popular movies
   */
  async getPopularMovies(page: number = 1): Promise<MovieResponse> {
    const response = await this.api.get<MovieResponse>("/movie/popular", {
      params: { page },
    });
    return response.data;
  }

  /**
   * Get popular TV shows
   */
  async getPopularTVShows(page: number = 1): Promise<TVShowResponse> {
    const response = await this.api.get<TVShowResponse>("/tv/popular", {
      params: { page },
    });
    return response.data;
  }

  /**
   * Get TV show details
   */
  async getTVShowDetails(
    tvId: number,
    appendToResponse: string[] = []
  ): Promise<TVShowDetails> {
    const response = await this.api.get<TVShowDetails>(`/tv/${tvId}`, {
      params: {
        append_to_response: appendToResponse.join(","),
      },
    });
    return response.data;
  }

  /**
   * Get top rated movies
   */
  async getTopRatedMovies(page: number = 1): Promise<MovieResponse> {
    const response = await this.api.get<MovieResponse>("/movie/top_rated", {
      params: { page },
    });
    return response.data;
  }

  /**
   * Get upcoming movies
   */
  async getUpcomingMovies(page: number = 1): Promise<MovieResponse> {
    const response = await this.api.get<MovieResponse>("/movie/upcoming", {
      params: { page },
    });
    return response.data;
  }

  /**
   * Get now playing movies
   */
  async getNowPlayingMovies(page: number = 1): Promise<MovieResponse> {
    const response = await this.api.get<MovieResponse>("/movie/now_playing", {
      params: { page },
    });
    return response.data;
  }

  /**
   * Discover movies with advanced filters
   */
  async discoverMovies(
    options: {
      page?: number;
      sort_by?: string;
      genre?: number[];
      year?: number;
      vote_average_gte?: number;
      vote_average_lte?: number;
      with_runtime_gte?: number;
      with_runtime_lte?: number;
      with_companies?: number[];
      with_keywords?: number[];
      language?: string;
      include_adult?: boolean;
      certification?: string;
      certification_country?: string;
      with_original_language?: string;
      without_genres?: number[];
    } = {}
  ): Promise<MovieResponse> {
    const params: Record<string, unknown> = { page: 1, ...options };

    // Convert arrays to comma-separated strings
    if (options.genre) params.with_genres = options.genre.join(",");
    if (options.with_companies)
      params.with_companies = options.with_companies.join(",");
    if (options.with_keywords)
      params.with_keywords = options.with_keywords.join(",");
    if (options.without_genres)
      params.without_genres = options.without_genres.join(",");

    const response = await this.api.get<MovieResponse>("/discover/movie", {
      params,
    });
    return response.data;
  }

  // ======================
  // MOVIE DETAILS
  // ======================

  /**
   * Get movie details by ID
   */
  async getMovieDetails(
    movieId: number,
    appendToResponse?: string[]
  ): Promise<MovieDetails> {
    const params: Record<string, string> = {};
    if (appendToResponse) {
      params.append_to_response = appendToResponse.join(",");
    }

    const response = await this.api.get<MovieDetails>(`/movie/${movieId}`, {
      params,
    });
    return response.data;
  }

  /**
   * Get movie credits (cast and crew)
   */
  async getMovieCredits(movieId: number): Promise<Credits> {
    const response = await this.api.get<Credits>(`/movie/${movieId}/credits`);
    return response.data;
  }

  /**
   * Get movie videos (trailers, teasers, etc.)
   */
  async getMovieVideos(movieId: number): Promise<VideoResponse> {
    const response = await this.api.get<VideoResponse>(
      `/movie/${movieId}/videos`
    );
    return response.data;
  }

  /**
   * Get movie reviews
   */
  async getMovieReviews(
    movieId: number,
    page: number = 1
  ): Promise<ReviewResponse> {
    const response = await this.api.get<ReviewResponse>(
      `/movie/${movieId}/reviews`,
      {
        params: { page },
      }
    );
    return response.data;
  }

  /**
   * Get similar movies
   */
  async getSimilarMovies(
    movieId: number,
    page: number = 1
  ): Promise<MovieResponse> {
    const response = await this.api.get<MovieResponse>(
      `/movie/${movieId}/similar`,
      {
        params: { page },
      }
    );
    return response.data;
  }

  /**
   * Get movie recommendations
   */
  async getMovieRecommendations(
    movieId: number,
    page: number = 1
  ): Promise<MovieResponse> {
    const response = await this.api.get<MovieResponse>(
      `/movie/${movieId}/recommendations`,
      {
        params: { page },
      }
    );
    return response.data;
  }

  // ======================
  // SEARCH
  // ======================

  /**
   * Search for movies
   */
  async searchMovies(
    query: string,
    page: number = 1,
    options?: {
      include_adult?: boolean;
      language?: string;
      year?: number;
      primary_release_year?: number;
      region?: string;
    }
  ): Promise<MovieResponse> {
    const response = await this.api.get<MovieResponse>("/search/movie", {
      params: { query, page, ...options },
    });
    return response.data;
  }

  /**
   * Multi search (movies, TV shows, people)
   */
  async multiSearch(
    query: string,
    page: number = 1,
    options?: {
      include_adult?: boolean;
      language?: string;
    }
  ): Promise<MultiSearchResponse> {
    const response = await this.api.get<TMDBResponse<MultiSearchResult>>(
      "/search/multi",
      {
        params: { query, page, ...options },
      }
    );
    return response.data;
  }

  /**
   * Search for people
   */
  async searchPeople(
    query: string,
    page: number = 1,
    options?: {
      include_adult?: boolean;
      language?: string;
    }
  ): Promise<PersonResponse> {
    const response = await this.api.get<TMDBResponse<Person>>(
      "/search/person",
      {
        params: { query, page, ...options },
      }
    );
    return response.data;
  }

  // ======================
  // GENRES
  // ======================

  /**
   * Get list of movie genres
   */
  async getMovieGenres(): Promise<{ genres: Genre[] }> {
    const response = await this.api.get<{ genres: Genre[] }>(
      "/genre/movie/list"
    );
    return response.data;
  }

  /**
   * Get movies by genre
   */
  async getMoviesByGenre(
    genreId: number,
    page: number = 1
  ): Promise<MovieResponse> {
    const response = await this.api.get<MovieResponse>("/discover/movie", {
      params: { with_genres: genreId, page },
    });
    return response.data;
  }

  // ======================
  // PERSON
  // ======================

  /**
   * Get person details
   */
  async getPersonDetails(personId: number): Promise<PersonDetails> {
    const response = await this.api.get(`/person/${personId}`);
    return response.data;
  }

  /**
   * Get person movie credits
   */
  async getPersonMovieCredits(personId: number): Promise<{
    cast: (Movie & { character: string; credit_id: string; order: number })[];
    crew: (Movie & { department: string; job: string; credit_id: string })[];
  }> {
    const response = await this.api.get(`/person/${personId}/movie_credits`);
    return response.data;
  }

  /**
   * Get person TV credits
   */
  async getPersonTVCredits(personId: number): Promise<{
    cast: (TVShow & { character: string; credit_id: string; episode_count: number })[];
    crew: (TVShow & { department: string; job: string; credit_id: string; episode_count: number })[];
  }> {
    const response = await this.api.get(`/person/${personId}/tv_credits`);
    return response.data;
  }

  // ======================
  // COLLECTIONS
  // ======================

  /**
   * Get collection details
   */
  async getCollectionDetails(collectionId: number): Promise<{
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    parts: Movie[];
  }> {
    const response = await this.api.get(`/collection/${collectionId}`);
    return response.data;
  }

  // ======================
  // UTILITY METHODS
  // ======================

  /**
   * Get configuration
   */
  async getConfiguration(): Promise<{
    images: {
      base_url: string;
      secure_base_url: string;
      backdrop_sizes: string[];
      logo_sizes: string[];
      poster_sizes: string[];
      profile_sizes: string[];
      still_sizes: string[];
    };
    change_keys: string[];
  }> {
    const response = await this.api.get("/configuration");
    return response.data;
  }

  /**
   * Get available countries
   */
  async getCountries(): Promise<
    { iso_3166_1: string; english_name: string; native_name: string }[]
  > {
    const response = await this.api.get("/configuration/countries");
    return response.data;
  }

  /**
   * Get available languages
   */
  async getLanguages(): Promise<
    { iso_639_1: string; english_name: string; name: string }[]
  > {
    const response = await this.api.get("/configuration/languages");
    return response.data;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.api.get("/configuration");
      return true;
    } catch {
      return false;
    }
  }
}

// Create and export singleton instance
const tmdbClient = new TMDBClient();
export default tmdbClient;

// Export class for testing
export { TMDBClient };
