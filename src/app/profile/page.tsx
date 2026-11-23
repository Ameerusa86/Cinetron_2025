"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Clock,
  Star,
  Settings,
  User,
  Film,
  Tv,
  TrendingUp,
  Eye,
  Bookmark,
  Plus,
  Search,
  Loader2,
  Check,
  ShieldCheck,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useUserStore, useNotificationStore } from "@/stores";
import { useClerkUserSync } from "@/hooks/useClerkUserSync";
import tmdbClient from "@/lib/tmdb-client";
import type { WatchlistItem, MovieDetails, TVShowDetails } from "@/types";
import { MediaCard } from "@/components/media/MediaCard";
import { PageHeader } from "@/components/media/PageHeader";

interface EnrichedWatchlistItem extends WatchlistItem {
  details?: MovieDetails | TVShowDetails;
}

interface EnrichedFavoriteItem {
  id: number;
  type: "movie";
  details?: MovieDetails;
}

function ProfileContent() {
  const { user: clerkUser } = useUser();
  const { user: appUser, updatePreferences } = useUserStore();
  const { addNotification } = useNotificationStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [enrichedWatchlist, setEnrichedWatchlist] = useState<
    EnrichedWatchlistItem[]
  >([]);
  const [enrichedFavorites, setEnrichedFavorites] = useState<
    EnrichedFavoriteItem[]
  >([]);
  const [recentlyWatched, setRecentlyWatched] = useState<
    EnrichedWatchlistItem[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Real Settings Form State
  const [prefLang, setPrefLang] = useState(
    appUser?.preferences?.language || "en"
  );
  const [prefCountry, setPrefCountry] = useState(
    appUser?.preferences?.country || "US"
  );
  const [notifNewReleases, setNotifNewReleases] = useState(
    appUser?.preferences?.notifications?.newReleases ?? true
  );
  const [notifRecs, setNotifRecs] = useState(
    appUser?.preferences?.notifications?.recommendations ?? true
  );
  const [notifSocial, setNotifSocial] = useState(
    appUser?.preferences?.notifications?.social ?? false
  );

  useClerkUserSync();

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "watchlist", label: "Watchlist", icon: Bookmark },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "history", label: "Watched", icon: Eye },
    { id: "settings", label: "Preferences", icon: Settings },
  ];

  const activeWatchlistCount =
    appUser?.watchlist?.filter((i) => i.status !== "completed") || [];
  const completedCount =
    appUser?.watchlist?.filter((i) => i.status === "completed").length || 0;
  const movieQueueCount = activeWatchlistCount.filter(
    (i) => i.type === "movie"
  ).length;
  const tvQueueCount = activeWatchlistCount.filter(
    (i) => i.type === "tv"
  ).length;
  const totalFavorites = appUser?.favorites?.length || 0;

  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      setLoading(true);
      try {
        const activeItems = (appUser?.watchlist || [])
          .filter((item) => item.status !== "completed")
          .slice(0, 12);

        const completedItems = (appUser?.watchlist || [])
          .filter((item) => item.status === "completed")
          .sort(
            (a, b) =>
              new Date(b.completedAt || b.addedAt).getTime() -
              new Date(a.completedAt || a.addedAt).getTime()
          )
          .slice(0, 12);

        const favIds = (appUser?.favorites || []).slice(0, 12);

        const [wRes, cRes, fRes] = await Promise.all([
          Promise.all(
            activeItems.map(async (item): Promise<EnrichedWatchlistItem> => {
              try {
                const details =
                  item.type === "movie"
                    ? await tmdbClient.getMovieDetails(item.id)
                    : await tmdbClient.getTVShowDetails(item.id);
                return { ...item, details };
              } catch {
                return { ...item, details: undefined };
              }
            })
          ),
          Promise.all(
            completedItems.map(async (item): Promise<EnrichedWatchlistItem> => {
              try {
                const details =
                  item.type === "movie"
                    ? await tmdbClient.getMovieDetails(item.id)
                    : await tmdbClient.getTVShowDetails(item.id);
                return { ...item, details };
              } catch {
                return { ...item, details: undefined };
              }
            })
          ),
          Promise.all(
            favIds.map(async (id): Promise<EnrichedFavoriteItem> => {
              try {
                const details = await tmdbClient.getMovieDetails(id);
                return { id, type: "movie", details };
              } catch {
                return { id, type: "movie", details: undefined };
              }
            })
          ),
        ]);

        if (!cancelled) {
          setEnrichedWatchlist(wRes.filter((x) => Boolean(x.details)));
          setRecentlyWatched(cRes.filter((x) => Boolean(x.details)));
          setEnrichedFavorites(fRes.filter((x) => Boolean(x.details)));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [appUser?.watchlist, appUser?.favorites]);

  const handleSaveSettings = () => {
    updatePreferences({
      language: prefLang,
      country: prefCountry,
      notifications: {
        email: appUser?.preferences?.notifications?.email ?? false,
        push: appUser?.preferences?.notifications?.push ?? false,
        newReleases: notifNewReleases,
        recommendations: notifRecs,
        social: notifSocial,
      },
    });
    addNotification({
      type: "success",
      title: "Preferences Saved",
      message: "Your profile preferences have been updated.",
      read: false,
    });
  };

  const renderMediaGrid = (
    items: (EnrichedWatchlistItem | EnrichedFavoriteItem)[],
    heading: string,
    emptyCopy: string,
    actionHref = "/movies",
    actionLabel = "Browse Catalog"
  ) => (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">{heading}</h2>
        <div className="flex items-center gap-2">
          {activeTab === "watchlist" && (
            <Link href="/watchlist" className="btn-cinema-outline text-xs py-2">
              Manage Full Queue
            </Link>
          )}
          <Link href={actionHref} className="btn-cinema text-xs py-2">
            <Plus className="h-3.5 w-3.5" />
            <span>{actionLabel}</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="surface-card p-12 text-center space-y-3">
          <Film className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-base font-bold text-foreground">Nothing here yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {emptyCopy}
          </p>
          <div className="pt-2">
            <Link href="/discover" className="btn-cinema">
              Discover Titles
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {items.map((item) => {
            const d = item.details;
            if (!d) return null;
            const title = "title" in d ? d.title : d.name;
            const dateStr =
              "release_date" in d ? d.release_date : d.first_air_date;
            return (
              <MediaCard
                key={`${item.type}-${item.id}`}
                id={item.id}
                title={title}
                mediaType={item.type}
                imagePath={d.poster_path}
                rating={d.vote_average}
                year={dateStr}
                badge={
                  "status" in item && item.status
                    ? item.status.replace("-", " ")
                    : undefined
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full">
      <PageHeader
        eyebrow="Member Dashboard"
        title="Your"
        accentWord="Profile"
        description="Track your cinema queue, favorites, viewing history, and regional preferences."
      >
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border transition-colors cursor-pointer ${
                  active
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </PageHeader>

      <section className="py-10">
        <div className="container-cinema">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Identity Banner */}
              <div className="surface-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-secondary">
                    {clerkUser?.imageUrl ? (
                      <Image
                        src={clerkUser.imageUrl}
                        alt="Profile avatar"
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <User className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary mb-1.5">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Cinetron Member</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      {clerkUser?.fullName ||
                        clerkUser?.firstName ||
                        "Cinephile"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {clerkUser?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>

                <Link href="/user-profile" className="btn-cinema-outline self-start sm:self-auto">
                  <Settings className="h-4 w-4" />
                  <span>Manage Account</span>
                </Link>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Movies Queued", value: movieQueueCount, icon: Film },
                  { label: "Series Queued", value: tvQueueCount, icon: Tv },
                  { label: "Completed", value: completedCount, icon: Clock },
                  { label: "Favorites", value: totalFavorites, icon: Heart },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="surface-card p-5">
                      <div className="flex items-center justify-between text-muted-foreground mb-2">
                        <span className="text-xs font-medium uppercase tracking-wider">
                          {stat.label}
                        </span>
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-2xl font-bold font-mono text-foreground">
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="surface-card p-6 space-y-4">
                <h3 className="text-base font-bold text-foreground">
                  Quick Navigation
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { href: "/discover", label: "Smart Discovery", icon: Search },
                    { href: "/watchlist", label: "Manage Watchlist", icon: Bookmark },
                    { href: "/trending", label: "Trending Charts", icon: TrendingUp },
                    { href: "/ai", label: "AI Cinema Studio", icon: Star },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4 hover:border-foreground/20 hover:bg-secondary transition-colors"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "watchlist" &&
            renderMediaGrid(
              enrichedWatchlist,
              `Active Watchlist (${enrichedWatchlist.length})`,
              "Add movies and series you want to watch next. Items marked Completed automatically move to Watched."
            )}

          {activeTab === "favorites" &&
            renderMediaGrid(
              enrichedFavorites,
              `Favorites (${enrichedFavorites.length})`,
              "Tap Favorite on any film page to curate your all-time favorites here."
            )}

          {activeTab === "history" &&
            renderMediaGrid(
              recentlyWatched,
              `Completed Titles (${recentlyWatched.length})`,
              "Mark items as Completed in your watchlist to build your viewing log.",
              "/watchlist",
              "Open Watchlist"
            )}

          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-6">
              <div className="surface-card p-6 space-y-5">
                <h2 className="text-lg font-bold text-foreground">
                  Regional Preferences
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Language
                    </label>
                    <select
                      value={prefLang}
                      onChange={(e) => setPrefLang(e.target.value)}
                      className="w-full rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Streaming Country
                    </label>
                    <select
                      value={prefCountry}
                      onChange={(e) => setPrefCountry(e.target.value)}
                      className="w-full rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="surface-card p-6 space-y-4">
                <h2 className="text-lg font-bold text-foreground">
                  Notifications
                </h2>
                <div className="divide-y divide-border">
                  {[
                    {
                      label: "New theatrical & streaming releases",
                      checked: notifNewReleases,
                      toggle: () => setNotifNewReleases((v) => !v),
                    },
                    {
                      label: "Weekly AI recommendations",
                      checked: notifRecs,
                      toggle: () => setNotifRecs((v) => !v),
                    },
                    {
                      label: "Community & review replies",
                      checked: notifSocial,
                      toggle: () => setNotifSocial((v) => !v),
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <span className="text-sm text-foreground">
                        {item.label}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={item.checked}
                        onClick={item.toggle}
                        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors cursor-pointer ${
                          item.checked ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform mt-0.5 ${
                            item.checked ? "translate-x-4.5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveSettings}
                className="btn-cinema px-6 py-3"
              >
                <Check className="h-4 w-4" />
                <span>Save Preferences</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
