/**
 * Utility functions for creating SEO-friendly slugs from movie/TV show titles
 */

/**
 * Convert a title to a URL-friendly slug
 * Example: "The Dark Knight" -> "the-dark-knight"
 * Example: "Spider-Man: No Way Home" -> "spider-man-no-way-home"
 */
export function createSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      // Replace special characters and spaces with hyphens
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      // Remove multiple consecutive hyphens
      .replace(/-+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}

/**
 * Convert a slug back to a readable title (for display purposes)
 * Example: "the-dark-knight" -> "The Dark Knight"
 */
export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Create a movie slug with ID for unique identification
 * Format: "title-movieid"
 * Example: "the-dark-knight-155"
 */
export function createMovieSlug(title: string, id: number): string {
  const titleSlug = createSlug(title);
  return `${titleSlug}-${id}`;
}

/**
 * Create a TV show slug with ID for unique identification
 * Format: "title-tvid"
 * Example: "breaking-bad-1396"
 */
export function createTVShowSlug(name: string, id: number): string {
  const nameSlug = createSlug(name);
  return `${nameSlug}-${id}`;
}

/**
 * Create a person slug with ID for unique identification
 * Format: "name-personid"
 * Example: "leonardo-dicaprio-6193"
 */
export function createPersonSlug(name: string, id: number): string {
  const nameSlug = createSlug(name);
  return `${nameSlug}-${id}`;
}

/**
 * Create a season slug for TV show seasons
 * Format: "season-seasonnumber"
 * Example: "season-1", "season-2"
 */
export function createSeasonSlug(seasonNumber: number): string {
  return `season-${seasonNumber}`;
}

/**
 * Extract ID from a slug
 * Example: "the-dark-knight-155" -> 155
 */
export function extractIdFromSlug(slug: string): number {
  const parts = slug.split("-");
  const lastPart = parts[parts.length - 1];
  const id = parseInt(lastPart, 10);

  if (isNaN(id)) {
    throw new Error(`Invalid slug format: ${slug}`);
  }

  return id;
}

/**
 * Extract title from a slug (without ID)
 * Example: "the-dark-knight-155" -> "the-dark-knight"
 */
export function extractTitleFromSlug(slug: string): string {
  const parts = slug.split("-");
  // Remove the last part (ID) and rejoin
  return parts.slice(0, -1).join("-");
}
