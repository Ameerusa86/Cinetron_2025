"use client";

import React from "react";
import { AlertTriangle, Clock, RefreshCw, Sparkles } from "lucide-react";
import {
  AIError,
  AIQuotaExceededError,
  AIServiceUnavailableError,
  AIInvalidAPIKeyError,
} from "@/types/errors";

interface AIErrorDisplayProps {
  error: AIError;
  onRetry?: () => void;
  onUseFallback?: () => void;
  className?: string;
  compact?: boolean;
}

const toneClasses = {
  amber: {
    box: "border-amber-500/25 bg-amber-500/10",
    iconWrap: "bg-amber-500/15 border-amber-500/30 text-amber-400",
    icon: "text-amber-400",
    btn: "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30",
  },
  rose: {
    box: "border-rose-500/25 bg-rose-500/10",
    iconWrap: "bg-rose-500/15 border-rose-500/30 text-rose-400",
    icon: "text-rose-400",
    btn: "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30",
  },
  sky: {
    box: "border-sky-500/25 bg-sky-500/10",
    iconWrap: "bg-sky-500/15 border-sky-500/30 text-sky-400",
    icon: "text-sky-400",
    btn: "bg-sky-500/20 text-sky-300 hover:bg-sky-500/30",
  },
};

export function AIErrorDisplay({
  error,
  onRetry,
  onUseFallback,
  className = "",
  compact = false,
}: AIErrorDisplayProps) {
  const getErrorConfig = () => {
    if (error instanceof AIQuotaExceededError) {
      return {
        icon: Clock,
        title: "AI Quota Reached",
        message: error.message,
        tone: toneClasses.amber,
        showRetry: false,
        retryText: `Try again in ${error.retryAfterSeconds || 60}s`,
      };
    }

    if (error instanceof AIInvalidAPIKeyError) {
      return {
        icon: AlertTriangle,
        title: "AI Configuration Required",
        message: "Gemini API key is missing or invalid. You can continue using built-in curated questions.",
        tone: toneClasses.rose,
        showRetry: false,
        retryText: "Retry",
      };
    }

    if (error instanceof AIServiceUnavailableError) {
      return {
        icon: RefreshCw,
        title: "AI Service Temporarily Unavailable",
        message: error.message,
        tone: toneClasses.sky,
        showRetry: true,
        retryText: "Try Again",
      };
    }

    return {
      icon: AlertTriangle,
      title: "Unable to Reach AI Service",
      message:
        (error as Error)?.message || "Something went wrong with the AI request.",
      tone: toneClasses.rose,
      showRetry: true,
      retryText: "Try Again",
    };
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  if (compact) {
    return (
      <div
        className={`flex flex-wrap items-center gap-3 rounded-xl border p-3.5 ${config.tone.box} ${className}`}
      >
        <Icon className={`h-4 w-4 shrink-0 ${config.tone.icon}`} />
        <p className="flex-1 text-xs sm:text-sm text-foreground">
          {config.message}
        </p>
        <div className="flex items-center gap-2">
          {config.showRetry && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${config.tone.btn}`}
            >
              {config.retryText}
            </button>
          )}
          {onUseFallback && (
            <button
              type="button"
              onClick={onUseFallback}
              className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              Use Curated Set
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border bg-card p-6 sm:p-8 text-center ${config.tone.box} ${className}`}
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border bg-background">
        <Icon className={`h-6 w-6 ${config.tone.icon}`} />
      </div>

      <h3 className="text-lg font-bold text-foreground mb-1.5">
        {config.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
        {config.message}
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {config.showRetry && onRetry && (
          <button type="button" onClick={onRetry} className="btn-cinema">
            <RefreshCw className="h-4 w-4" />
            {config.retryText}
          </button>
        )}

        {onUseFallback && (
          <button
            type="button"
            onClick={onUseFallback}
            className="btn-cinema-outline"
          >
            <Sparkles className="h-4 w-4" />
            Use Curated Questions
          </button>
        )}
      </div>
    </div>
  );
}
