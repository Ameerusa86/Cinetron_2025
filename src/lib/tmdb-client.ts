import axios, { AxiosInstance } from "axios";
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
  PersonResponse,
  Genre,
  MultiSearchResult,
  TMDBResponse,
  MultiSearchResponse,
  WatchProvidersResponse,
} from "@/types";

export interface DiscoverMoviesOptions {
  page?: number;
  sort_by?: string;
  genre?: number[];
  with_genres?: number | string;
  year?: number;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  "vote_count.gte"?: number;
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
}

export interface DiscoverTVOptions {
  page?: number;
  sort_by?: string;
  with_genres?: number | string;
  "first_air_date.gte"?: string;
  "first_air_date.lte"?: string;
  "vote_average.gte"?: number;
  "vote_count.gte"?: number;
  language?: string;
  include_adult?: boolean;
  with_original_language?: string;
}

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

    if (!this.apiKey && process.env.NODE_ENV === "development") {
      console.warn(
        "TMDB API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file"
      );
    }

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      params: {
        api_key: this.apiKey,
      },
    });
  }

  /**
   * Get image URL with specified size
   */
  getImageUrl(path: string | null | undefined, size: string = "w500"): string | null {
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

  async getTrendingMovies(
    timeWindow: "day" | "week" = "day",
    page: number = 1
  ): Promise<MovieResponse> {
    const response = await this.api.get<MovieResponse>(
      `/trending/movie/${timeWindow}`,
      { params: { page } }
    );
    return response.data;
  }

  async getTrendingTVShows(
    timeWindow: "day" | "week" = "day",
    page: number = 1
  ): Promise<TVShowResponse> {
    const response = await this.api.get<TVShowResponse>(
      `/trending/tv/${timeWindow}`,
      { params: { page } }
    );
    return response.data;
  }

  async getTrendingPeople(
    timeWindow: "day" | "week" = "day",
    page: number = 1
  ): Promise<PersonResponse> {
    const response = await this.api.get<PersonResponse>(
      `/trending/person/${timeWindow}`,
      { params: { page } }
    );
    return response.data;
  }

  async getPopularMovies(page: number = 1): Promise<MovieResponse> {
    const response = await this.api.get<MovieResponse>("/movie/popular", {
      params: { page },
    });
    return response.data;
  }

  async getPopularTVShows(page: number = 1): Promise<TVShowResponse> {
    const response = await this.api.get<TVShowResponse>("/tv/popular", {
      params: { page },
    });
    return response.data;
  }

  async getTopRatedTVShows(page: number = 1): Promise<TVShowResponse> {
    const response = await this.api.get<TVShowResponse>("/tv/top_rated", {
      params: { page },
    });
    return response.data;
  }

  async getOnTheAirTVShows(page: number = 1): Promise<TVShowResponse> {
    const response = await this.api.get<TVShowResponse>("/tv/on_the_air", {
      params: { page },
    });
    return response.data;
  }

  async getTVShowDetails(
    tvId: number,
    appendToResponse: string[] = []
  ): Promise<TVShowDetails> {
    const params: Record<string, string> = {};
    if (appendToResponse.length > 0) {
      params.append_to_response = appendToResponse.join(",");
    }
    const response = await this.api.get<TVShowDetails>(`/tv/${tvId}`, {
      params,
    });
    return response.data;
  }

  async getTVWatchProviders(tvId: number): Promise<WatchProvidersResponse> {
    const response = await this.api.get<WatchProvidersResponse>(
      `/tv/${tvId}/watch/providers`
    );
    return response.data;
  }

  async getTVReviews(tvId: number, page: number = 1): Promise<ReviewResponse> {
    const response = await this.api.get<ReviewResponse>(
      `/tv/${tvId}/reviews`,
      { params: { page } }
    );
    return response.data;
  }

  async getTopRatedMovies(page: number = 1): Promise<MovieResponse> {
    const response = await this.api.get<MovieResponse>("/movie/top_rated", {
      params: { page },
    });
    return response.data;
  }

  async getUpcomingMovies(page: number = 1): Promise<MovieResponse> {
    const response = await this.api.get<MovieResponse>("/movie/upcoming", {
      params: { page },
    });
    return response.data;
  }

  async getNowPlayingMovies(page: number = 1): Promise<MovieResponse> {
    const response = await this.api.get<MovieResponse>("/movie/now_playing", {
      params: { page },
    });
    return response.data;
  }

  async discoverMovies(options: DiscoverMoviesOptions = {}): Promise<MovieResponse> {
    const params: Record<string, unknown> = { page: 1 };

    for (const [key, value] of Object.entries(options)) {
      if (value === undefined || value === null || value === "") continue;
      if (key === "genre" && Array.isArray(value)) {
        params.with_genres = value.join(",");
      } else if (key === "vote_average_gte") {
        params["vote_average.gte"] = value;
      } else if (key === "vote_average_lte") {
        params["vote_average.lte"] = value;
      } else if (key === "with_runtime_gte") {
        params["with_runtime.gte"] = value;
      } else if (key === "with_runtime_lte") {
        params["with_runtime.lte"] = value;
      } else if (Array.isArray(value)) {
        params[key] = value.join(",");
      } else {
        params[key] = value;
      }
    }

    const response = await this.api.get<MovieResponse>("/discover/movie", {
      params,
    });
    return response.data;
  }

  async discoverTVShows(options: DiscoverTVOptions = {}): Promise<TVShowResponse> {
    const params: Record<string, unknown> = { page: 1 };

    for (const [key, value] of Object.entries(options)) {
      if (value === undefined || value === null || value === "") continue;
      params[key] = value;
    }

    const response = await this.api.get<TVShowResponse>("/discover/tv", {
      params,
    });
    return response.data;
  }

  // ======================
  // MOVIE DETAILS
  // ======================

  async getMovieDetails(
    movieId: number,
    appendToResponse?: string[]
  ): Promise<MovieDetails> {
    const params: Record<string, string> = {};
    if (appendToResponse && appendToResponse.length > 0) {
      params.append_to_response = appendToResponse.join(",");
    }

    const response = await this.api.get<MovieDetails>(`/movie/${movieId}`, {
      params,
    });
    return response.data;
  }

  async getMovieCredits(movieId: number): Promise<Credits> {
    const response = await this.api.get<Credits>(`/movie/${movieId}/credits`);
    return response.data;
  }

  async getMovieVideos(movieId: number): Promise<VideoResponse> {
    const response = await this.api.get<VideoResponse>(
      `/movie/${movieId}/videos`
    );
    return response.data;
  }

  async getMovieReviews(
    movieId: number,
    page: number = 1
  ): Promise<ReviewResponse> {
    const response = await this.api.get<ReviewResponse>(
      `/movie/${movieId}/reviews`,
      { params: { page } }
    );
    return response.data;
  }

  async getSimilarMovies(
    movieId: number,
    page: number = 1
  ): Promise<MovieResponse> {
    const response = await this.api.get<MovieResponse>(
      `/movie/${movieId}/similar`,
      { params: { page } }
    );
    return response.data;
  }

  async getMovieRecommendations(
    movieId: number,
    page: number = 1
  ): Promise<MovieResponse> {
    const response = await this.api.get<MovieResponse>(
      `/movie/${movieId}/recommendations`,
      { params: { page } }
    );
    return response.data;
  }

  async getMovieWatchProviders(movieId: number): Promise<WatchProvidersResponse> {
    const response = await this.api.get<WatchProvidersResponse>(
      `/movie/${movieId}/watch/providers`
    );
    return response.data;
  }

  // ======================
  // SEARCH
  // ======================

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

  async searchTVShows(
    query: string,
    page: number = 1,
    options?: {
      include_adult?: boolean;
      language?: string;
      first_air_date_year?: number;
    }
  ): Promise<TVShowResponse> {
    const response = await this.api.get<TVShowResponse>("/search/tv", {
      params: { query, page, ...options },
    });
    return response.data;
  }

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

  async searchPeople(
    query: string,
    page: number = 1,
    options?: {
      include_adult?: boolean;
      language?: string;
    }
  ): Promise<TMDBResponse<Person>> {
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

  async getMovieGenres(): Promise<{ genres: Genre[] }> {
    const response = await this.api.get<{ genres: Genre[] }>(
      "/genre/movie/list"
    );
    return response.data;
  }

  async getTVGenres(): Promise<{ genres: Genre[] }> {
    const response = await this.api.get<{ genres: Genre[] }>("/genre/tv/list");
    return response.data;
  }

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

  async getPersonDetails(personId: number): Promise<PersonDetails> {
    const response = await this.api.get(`/person/${personId}`);
    return response.data;
  }

  async getPersonMovieCredits(personId: number): Promise<{
    cast: (Movie & { character: string; credit_id: string; order: number })[];
    crew: (Movie & { department: string; job: string; credit_id: string })[];
  }> {
    const response = await this.api.get(`/person/${personId}/movie_credits`);
    return response.data;
  }

  async getPersonTVCredits(personId: number): Promise<{
    cast: (TVShow & {
      character: string;
      credit_id: string;
      episode_count: number;
    })[];
    crew: (TVShow & {
      department: string;
      job: string;
      credit_id: string;
      episode_count: number;
    })[];
  }> {
    const response = await this.api.get(`/person/${personId}/tv_credits`);
    return response.data;
  }

  // ======================
  // COLLECTIONS
  // ======================

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

  async getCountries(): Promise<
    { iso_3166_1: string; english_name: string; native_name: string }[]
  > {
    const response = await this.api.get("/configuration/countries");
    return response.data;
  }

  async getLanguages(): Promise<
    { iso_639_1: string; english_name: string; name: string }[]
  > {
    const response = await this.api.get("/configuration/languages");
    return response.data;
  }

  async getSeasonDetails(
    tvId: number,
    seasonNumber: number
  ): Promise<{
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    air_date: string;
    episode_count: number;
    episodes: {
      id: number;
      name: string;
      overview: string;
      episode_number: number;
      season_number: number;
      air_date: string;
      runtime: number | null;
      still_path: string | null;
      vote_average: number;
      vote_count: number;
      crew: {
        id: number;
        name: string;
        job: string;
        department: string;
        profile_path: string | null;
      }[];
      guest_stars: {
        id: number;
        name: string;
        character: string;
        profile_path: string | null;
        order: number;
      }[];
    }[];
    credits?: Credits;
  }> {
    const response = await this.api.get(`/tv/${tvId}/season/${seasonNumber}`, {
      params: {
        append_to_response: "credits",
      },
    });
    return response.data;
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.api.get("/configuration");
      return true;
    } catch {
      return false;
    }
  }
}

const tmdbClient = new TMDBClient();
export default tmdbClient;

export { TMDBClient };
