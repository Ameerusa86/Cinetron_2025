"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, RefreshCw, Zap, Coffee } from "lucide-react";
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
        title: "AI Quota Exceeded",
        message: error.message,
        color: "orange",
        showRetry: false,
        retryText: `Try again in ${error.retryAfterSeconds || 60}s`,
      };
    }

    if (error instanceof AIInvalidAPIKeyError) {
      return {
        icon: AlertTriangle,
        title: "AI Service Configuration Issue",
        message: "Please check your API configuration or contact support.",
        color: "red",
        showRetry: false,
      };
    }

    if (error instanceof AIServiceUnavailableError) {
      return {
        icon: RefreshCw,
        title: "AI Service Unavailable",
        message: error.message,
        color: "blue",
        showRetry: true,
        retryText: "Try Again",
      };
    }

    return {
      icon: AlertTriangle,
      title: "AI Service Error",
      message: "Something went wrong with the AI service.",
      color: "red",
      showRetry: true,
      retryText: "Try Again",
    };
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-3 p-3 rounded-lg border border-${config.color}-500/20 bg-${config.color}-500/10 ${className}`}
      >
        <Icon className={`w-5 h-5 text-${config.color}-500`} />
        <div className="flex-1">
          <p className="text-sm text-slate-300">{error.message}</p>
        </div>
        {config.showRetry && onRetry && (
          <button
            onClick={onRetry}
            className={`text-xs px-3 py-1 rounded-md bg-${config.color}-500/20 text-${config.color}-400 hover:bg-${config.color}-500/30 transition-colors`}
          >
            {config.retryText}
          </button>
        )}
        {onUseFallback && (
          <button
            onClick={onUseFallback}
            className="text-xs px-3 py-1 rounded-md bg-slate-500/20 text-slate-400 hover:bg-slate-500/30 transition-colors"
          >
            Use Fallback
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-${config.color}-500/20 text-center ${className}`}
    >
      {/* Icon and Title */}
      <div className="flex items-center justify-center mb-4">
        <div
          className={`p-3 rounded-2xl bg-${config.color}-500/20 border border-${config.color}-500/30`}
        >
          <Icon className={`w-8 h-8 text-${config.color}-500`} />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{config.title}</h3>
      <p className="text-slate-300 mb-6">{error.message}</p>

      {/* Special message for quota exceeded */}
      {error instanceof AIQuotaExceededError && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coffee className="w-5 h-5 text-orange-400" />
            <span className="text-orange-400 font-medium">Take a Break!</span>
          </div>
          <p className="text-sm text-orange-300">
            The free AI service has a daily limit of 50 requests. Your quota
            will reset tomorrow, or you can upgrade to premium for unlimited AI
            features.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {config.showRetry && onRetry && (
          <button
            onClick={onRetry}
            className={`px-6 py-3 bg-${config.color}-600 text-white rounded-xl font-medium hover:bg-${config.color}-500 transition-all duration-300 flex items-center justify-center gap-2`}
          >
            <RefreshCw className="w-4 h-4" />
            {config.retryText}
          </button>
        )}

        {onUseFallback && (
          <button
            onClick={onUseFallback}
            className="px-6 py-3 bg-slate-600 text-slate-300 rounded-xl font-medium hover:bg-slate-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Use Sample Questions
          </button>
        )}
      </div>

      {/* Premium upgrade hint for quota exceeded */}
      {error instanceof AIQuotaExceededError && (
        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-sm text-slate-400 mb-3">
            Want unlimited AI features?
          </p>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-500 hover:to-blue-500 transition-all duration-300 text-sm flex items-center gap-2 mx-auto">
            <Zap className="w-4 h-4" />
            Upgrade to Premium
          </button>
        </div>
      )}
    </motion.div>
  );
}
