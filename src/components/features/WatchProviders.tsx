"use client";

import React from "react";
import Image from "next/image";
import { useMovieWatchProviders } from "@/hooks";
import tmdbClient from "@/lib/tmdb-client";

interface WatchProvidersProps {
  movieId: number;
}

export function WatchProviders({ movieId }: WatchProvidersProps) {
  const { data: providersData, isLoading } = useMovieWatchProviders(movieId);

  if (isLoading || !providersData) return null;

  // Let's default to US providers
  const usProviders = providersData.results["US"];

  if (!usProviders || (!usProviders.flatrate && !usProviders.rent && !usProviders.buy)) {
    return null;
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-10 shadow-2xl mt-8">
      <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3 mb-8">
        <span>🍿</span> Where to Watch
      </h2>

      <div className="space-y-6">
        {usProviders.flatrate && (
          <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-4">Stream</h3>
            <div className="flex flex-wrap gap-4">
              {usProviders.flatrate.map((provider) => (
                <div key={provider.provider_id} className="group relative w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={tmdbClient.getImageUrl(provider.logo_path, "w154") || ""}
                    alt={provider.provider_name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <span className="text-[10px] text-white text-center font-bold px-1 leading-tight">
                      {provider.provider_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {usProviders.rent && (
          <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-4">Rent</h3>
            <div className="flex flex-wrap gap-4">
              {usProviders.rent.map((provider) => (
                <div key={provider.provider_id} className="group relative w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={tmdbClient.getImageUrl(provider.logo_path, "w154") || ""}
                    alt={provider.provider_name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <span className="text-[10px] text-white text-center font-bold px-1 leading-tight">
                      {provider.provider_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {usProviders.buy && (
          <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-4">Buy</h3>
            <div className="flex flex-wrap gap-4">
              {usProviders.buy.map((provider) => (
                <div key={provider.provider_id} className="group relative w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={tmdbClient.getImageUrl(provider.logo_path, "w154") || ""}
                    alt={provider.provider_name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <span className="text-[10px] text-white text-center font-bold px-1 leading-tight">
                      {provider.provider_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <p className="text-slate-500 text-xs mt-6">
        Data provided by JustWatch via TMDB.
      </p>
    </div>
  );
}
