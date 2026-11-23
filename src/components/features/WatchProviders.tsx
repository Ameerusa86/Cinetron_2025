"use client";

import React from "react";
import Image from "next/image";
import { Tv, ExternalLink } from "lucide-react";
import { useMovieWatchProviders, useTVWatchProviders } from "@/hooks";
import { useUserStore } from "@/stores";
import tmdbClient from "@/lib/tmdb-client";
import type { WatchProvider } from "@/types";

interface WatchProvidersProps {
  movieId?: number;
  tvId?: number;
}

function ProviderGroup({
  label,
  providers,
}: {
  label: string;
  providers: WatchProvider[];
}) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2.5">
        {providers.map((provider) => {
          const logo = tmdbClient.getImageUrl(provider.logo_path, "w154");
          return (
            <div
              key={provider.provider_id}
              title={provider.provider_name}
              className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-secondary/60 pr-3 overflow-hidden"
            >
              {logo && (
                <Image
                  src={logo}
                  alt={provider.provider_name}
                  width={36}
                  height={36}
                  className="h-9 w-9 object-cover shrink-0"
                />
              )}
              <span className="text-xs font-medium text-foreground">
                {provider.provider_name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WatchProviders({ movieId, tvId }: WatchProvidersProps) {
  const country = useUserStore((s) => s.user?.preferences?.country) || "US";

  const movieQuery = useMovieWatchProviders(movieId || 0, Boolean(movieId));
  const tvQuery = useTVWatchProviders(tvId || 0, Boolean(tvId && !movieId));

  const providersData = movieId ? movieQuery.data : tvQuery.data;
  const isLoading = movieId ? movieQuery.isLoading : tvQuery.isLoading;

  if (isLoading || !providersData?.results) return null;

  const regionCode = providersData.results[country]
    ? country
    : providersData.results["US"]
    ? "US"
    : Object.keys(providersData.results)[0];

  const regionData = regionCode ? providersData.results[regionCode] : undefined;

  if (
    !regionData ||
    (!regionData.flatrate?.length &&
      !regionData.free?.length &&
      !regionData.rent?.length &&
      !regionData.buy?.length)
  ) {
    return null;
  }

  return (
    <div className="surface-card p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
            <Tv className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Where to Watch
            </h2>
            <p className="text-xs text-muted-foreground">
              Region: <span className="font-mono text-foreground">{regionCode}</span> ·
              Availability via JustWatch
            </p>
          </div>
        </div>

        {regionData.link && (
          <a
            href={regionData.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span>View on TMDB</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      <div className="space-y-5">
        {regionData.flatrate && regionData.flatrate.length > 0 && (
          <ProviderGroup label="Stream" providers={regionData.flatrate} />
        )}
        {regionData.free && regionData.free.length > 0 && (
          <ProviderGroup label="Free" providers={regionData.free} />
        )}
        {regionData.rent && regionData.rent.length > 0 && (
          <ProviderGroup label="Rent" providers={regionData.rent} />
        )}
        {regionData.buy && regionData.buy.length > 0 && (
          <ProviderGroup label="Buy" providers={regionData.buy} />
        )}
      </div>
    </div>
  );
}
