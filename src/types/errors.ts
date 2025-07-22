// Custom error types for AI services

export class AIQuotaExceededError extends Error {
  constructor(
    message: string = "AI service quota exceeded. Please try again later.",
    public retryAfterSeconds?: number
  ) {
    super(message);
    this.name = "AIQuotaExceededError";
  }
}

export class AIServiceUnavailableError extends Error {
  constructor(
    message: string = "AI service is temporarily unavailable.",
    public fallbackAvailable: boolean = true
  ) {
    super(message);
    this.name = "AIServiceUnavailableError";
  }
}

export class AIInvalidAPIKeyError extends Error {
  constructor(message: string = "Invalid or missing AI API key.") {
    super(message);
    this.name = "AIInvalidAPIKeyError";
  }
}

export type AIError =
  | AIQuotaExceededError
  | AIServiceUnavailableError
  | AIInvalidAPIKeyError;

export function parseAIError(error: unknown): AIError {
  const errorMessage = error instanceof Error ? error.message : String(error);

  // Check for quota exceeded errors
  if (
    errorMessage.includes("429") ||
    errorMessage.includes("quota") ||
    errorMessage.includes("rate limit") ||
    errorMessage.includes("exceeded your current quota")
  ) {
    // Try to extract retry delay from error
    const retryMatch = errorMessage.match(/retryDelay['":\s]*(\d+)/);
    const retrySeconds = retryMatch ? parseInt(retryMatch[1]) : 60;

    return new AIQuotaExceededError(
      "You've reached the daily AI quota limit. Try again tomorrow or consider upgrading to a premium plan.",
      retrySeconds
    );
  }

  // Check for API key errors
  if (
    errorMessage.includes("401") ||
    errorMessage.includes("unauthorized") ||
    errorMessage.includes("invalid api key")
  ) {
    return new AIInvalidAPIKeyError();
  }

  // Check for service unavailable
  if (
    errorMessage.includes("503") ||
    errorMessage.includes("service unavailable") ||
    errorMessage.includes("temporarily unavailable")
  ) {
    return new AIServiceUnavailableError();
  }

  // Generic AI service error
  return new AIServiceUnavailableError(
    "AI service encountered an error. Please try again or use the fallback option.",
    true
  );
}
