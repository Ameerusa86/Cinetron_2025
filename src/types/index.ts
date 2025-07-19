// ===========================
// TMDB API TYPES - SUPER PREMIUM MOVIE WEBSITE
// ===========================

// Base TMDB Response
export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Movie Types
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
  vote_count: number;
  vote_average: number;
  video: boolean;
}

export interface MovieDetails extends Omit<Movie, "genre_ids"> {
  belongs_to_collection?: Collection | null;
  budget: number;
  genres: Genre[];
  homepage?: string;
  imdb_id?: string;
  origin_country: string[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime?: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path?: string;
  backdrop_path?: string;
}

export interface ProductionCompany {
  id: number;
  logo_path?: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// Credits Types
export interface Credits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  credit_id: string;
  order: number;
  profile_path?: string;
  adult: boolean;
  gender: number;
  known_for_department: string;
  original_name: string;
  popularity: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  credit_id: string;
  profile_path?: string;
  adult: boolean;
  gender: number;
  known_for_department: string;
  original_name: string;
  popularity: number;
}

// Video Types
export interface VideoResponse {
  id: number;
  results: Video[];
}

export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

// Review Types
export interface Review {
  id: string;
  author: string;
  author_details: AuthorDetails;
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

export interface AuthorDetails {
  name: string;
  username: string;
  avatar_path?: string;
  rating?: number;
}

// Person Types
export interface Person {
  id: number;
  name: string;
  profile_path?: string;
  adult: boolean;
  gender: number;
  known_for_department: string;
  original_name: string;
  popularity: number;
  known_for: Movie[];
}

export interface PersonDetails extends Person {
  biography?: string;
  birthday?: string;
  deathday?: string;
  place_of_birth?: string;
  homepage?: string;
  imdb_id?: string;
  also_known_as: string[];
}

// TV Show Types
export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  first_air_date: string;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
  vote_count: number;
  vote_average: number;
  origin_country: string[];
  media_type: "tv";
}

// Search Types
export type MultiSearchResult = Movie | Person | TVShow;

// Response Types
export type MovieResponse = TMDBResponse<Movie>;
export type TVShowResponse = TMDBResponse<TVShow>;
export type PersonResponse = TMDBResponse<Person>;
export type MultiSearchResponse = TMDBResponse<MultiSearchResult>;
export type ReviewResponse = TMDBResponse<Review>;

// ===========================
// APPLICATION TYPES
// ===========================

// Theme Types
export type Theme = "cinema" | "cinema-dark" | "system";

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
  watchlist: number[];
  favorites: number[];
  ratings: Record<number, number>;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  language: string;
  country: string;
  genres: number[];
  adultContent: boolean;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  newReleases: boolean;
  recommendations: boolean;
  social: boolean;
}

export interface PrivacySettings {
  profileVisibility: "public" | "friends" | "private";
  watchlistVisibility: "public" | "friends" | "private";
  activityVisibility: "public" | "friends" | "private";
}

// UI State Types
export interface ModalState {
  searchModal: boolean;
  movieModal: boolean;
  settingsModal: boolean;
  loginModal: boolean;
  shareModal: boolean;
  trailerModal: boolean;
  selectedMovieId?: number;
  setSearchModal: (open: boolean) => void;
  setMovieModal: (open: boolean, movieId?: number) => void;
  setSettingsModal: (open: boolean) => void;
  setLoginModal: (open: boolean) => void;
  setShareModal: (open: boolean) => void;
  setTrailerModal: (open: boolean) => void;
}

// Cache Types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export interface CacheState {
  movies: Record<string, CacheEntry<MovieResponse>>;
  movieDetails: Record<number, CacheEntry<MovieDetails>>;
  genres: CacheEntry<Genre[]> | null;
  addMovies: (key: string, data: MovieResponse) => void;
  addMovieDetails: (id: number, data: MovieDetails) => void;
  addGenres: (data: Genre[]) => void;
  getMovies: (key: string) => MovieResponse | null;
  getMovieDetails: (id: number) => MovieDetails | null;
  getGenres: () => Genre[] | null;
  clearExpired: () => void;
}

// Search Types
export interface SearchState {
  query: string;
  results: MultiSearchResult[];
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;
  history: string[];
  setQuery: (query: string) => void;
  setResults: (results: MultiSearchResult[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: SearchFilters) => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
}

export interface SearchFilters {
  mediaType: "all" | "movie" | "person" | "tv";
  genre?: number;
  year?: number;
  rating?: [number, number];
  sortBy: "popularity" | "release_date" | "vote_average" | "revenue";
  sortOrder: "asc" | "desc";
}

// Social Types
export interface SocialFeatures {
  watchParties: WatchParty[];
  reviews: UserReview[];
  discussions: Discussion[];
  friends: Friend[];
}

export interface WatchParty {
  id: string;
  movieId: number;
  hostId: string;
  participants: string[];
  scheduledAt: string;
  status: "scheduled" | "live" | "ended";
  chatMessages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  type: "message" | "reaction" | "system";
}

export interface UserReview {
  id: string;
  userId: string;
  movieId: number;
  rating: number;
  title: string;
  content: string;
  spoilers: boolean;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Discussion {
  id: string;
  movieId: number;
  title: string;
  content: string;
  authorId: string;
  replies: DiscussionReply[];
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionReply {
  id: string;
  discussionId: string;
  authorId: string;
  content: string;
  parentReplyId?: string;
  likes: number;
  createdAt: string;
}

export interface Friend {
  id: string;
  username: string;
  avatar?: string;
  status: "pending" | "accepted" | "blocked";
  connectedAt: string;
  lastActivity: string;
}

// Premium Features Types
export interface AIRecommendation {
  movieId: number;
  score: number;
  reason: string;
  category: "trending" | "personalized" | "similar" | "mood-based";
  metadata: {
    genres: string[];
    mood: string;
    confidence: number;
  };
}

export interface MovieStatistics {
  movieId: number;
  views: number;
  likes: number;
  shares: number;
  watchlistAdds: number;
  averageRating: number;
  trendingScore: number;
  peakPopularityDate: string;
  demographicBreakdown: DemographicData;
  realTimeData: RealTimeStats;
}

export interface DemographicData {
  ageGroups: Record<string, number>;
  genders: Record<string, number>;
  countries: Record<string, number>;
  languages: Record<string, number>;
}

export interface RealTimeStats {
  currentViewers: number;
  recentActivity: Activity[];
  trendingTopics: TrendingTopic[];
  socialMentions: number;
}

export interface Activity {
  type: "view" | "like" | "share" | "watchlist" | "review";
  timestamp: string;
  count: number;
}

export interface TrendingTopic {
  keyword: string;
  mentions: number;
  sentiment: "positive" | "negative" | "neutral";
  change: number; // percentage change
}

// 3D & VR Types
export interface Movie3DScene {
  movieId: number;
  posterModel: string;
  environment: string;
  animations: Animation3D[];
  interactiveElements: InteractiveElement[];
}

export interface Animation3D {
  name: string;
  type: "rotation" | "float" | "scale" | "morph";
  duration: number;
  easing: string;
  loop: boolean;
}

export interface InteractiveElement {
  id: string;
  type: "button" | "hotspot" | "trigger";
  position: [number, number, number];
  action: string;
  tooltip?: string;
}

// Voice Command Types
export interface VoiceCommand {
  command: string;
  action: string;
  parameters?: Record<string, unknown>;
  confidence: number;
}

export interface VoiceSettings {
  enabled: boolean;
  language: string;
  sensitivity: number;
  commands: VoiceCommand[];
}

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  sessionId: string;
}

export interface UserBehavior {
  userId: string;
  preferences: GenrePreference[];
  viewingPatterns: ViewingPattern[];
  searchHistory: SearchHistory[];
  interactionData: InteractionData;
}

export interface GenrePreference {
  genreId: number;
  score: number;
  lastUpdated: string;
}

export interface ViewingPattern {
  timeOfDay: string;
  dayOfWeek: string;
  duration: number;
  deviceType: string;
  frequency: number;
}

export interface SearchHistory {
  query: string;
  timestamp: string;
  resultClicked?: number;
  filters: SearchFilters;
}

export interface InteractionData {
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  averageSessionDuration: number;
  favoriteGenres: number[];
  devicePreference: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  read: boolean;
  createdAt: string;
  expiresAt?: string;
}

// API Response Types
export interface APIError {
  status_code: number;
  status_message: string;
  success: false;
}

export interface APISuccess<T> {
  success: true;
  data: T;
  meta?: {
    page: number;
    total_pages: number;
    total_results: number;
  };
}

export type APIResponse<T> = APISuccess<T> | APIError;

// Component Props Types
export interface MovieCardProps {
  movie: Movie;
  variant?: "default" | "large" | "small" | "featured" | "3d";
  showOverlay?: boolean;
  className?: string;
  onClick?: (movie: Movie) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSubmit?: () => void;
}

// Export all types
export type * from "./index";
