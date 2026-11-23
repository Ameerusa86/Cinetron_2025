"use client";

import React, { useEffect, useState } from "react";
import { X, Palette, Bell, Shield, Sliders, Check } from "lucide-react";
import { useModalStore, useUserStore, useNotificationStore } from "@/stores";
import ThemeSelector from "../ui/ThemeSelector";

export default function SettingsModal() {
  const { settingsModal, setSettingsModal } = useModalStore();
  const { user, updatePreferences } = useUserStore();
  const { addNotification } = useNotificationStore();

  const [newReleases, setNewReleases] = useState(
    user?.preferences?.notifications?.newReleases ?? true
  );
  const [recommendations, setRecommendations] = useState(
    user?.preferences?.notifications?.recommendations ?? true
  );
  const [socialNotifs, setSocialNotifs] = useState(
    user?.preferences?.notifications?.social ?? false
  );
  const [publicWatchlist, setPublicWatchlist] = useState(
    user?.preferences?.privacy?.watchlistVisibility === "public"
  );
  const [publicActivity, setPublicActivity] = useState(
    user?.preferences?.privacy?.activityVisibility === "public"
  );
  const [language, setLanguage] = useState(user?.preferences?.language || "en");
  const [country, setCountry] = useState(user?.preferences?.country || "US");

  useEffect(() => {
    if (!settingsModal) return;
    setNewReleases(user?.preferences?.notifications?.newReleases ?? true);
    setRecommendations(user?.preferences?.notifications?.recommendations ?? true);
    setSocialNotifs(user?.preferences?.notifications?.social ?? false);
    setPublicWatchlist(user?.preferences?.privacy?.watchlistVisibility === "public");
    setPublicActivity(user?.preferences?.privacy?.activityVisibility === "public");
    setLanguage(user?.preferences?.language || "en");
    setCountry(user?.preferences?.country || "US");

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSettingsModal(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [settingsModal, user, setSettingsModal]);

  if (!settingsModal) return null;

  const handleSave = () => {
    updatePreferences({
      language,
      country,
      notifications: {
        email: user?.preferences?.notifications?.email ?? false,
        push: user?.preferences?.notifications?.push ?? false,
        newReleases,
        recommendations,
        social: socialNotifs,
      },
      privacy: {
        profileVisibility: user?.preferences?.privacy?.profileVisibility || "private",
        watchlistVisibility: publicWatchlist ? "public" : "private",
        activityVisibility: publicActivity ? "public" : "private",
      },
    });
    addNotification({
      type: "success",
      title: "Preferences Saved",
      message: "Your display and notification preferences have been updated.",
      read: false,
    });
    setSettingsModal(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Application settings"
    >
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={() => setSettingsModal(false)}
      />

      <div className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl border border-border bg-card text-card-foreground shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur-md px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Preferences</h2>
            <p className="text-xs text-muted-foreground">
              Customize appearance, alerts, and region settings
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSettingsModal(false)}
            aria-label="Close settings"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Theme Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Palette className="h-4 w-4 text-primary" />
              <span>Appearance</span>
            </div>
            <ThemeSelector size="sm" />
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Bell className="h-4 w-4 text-primary" />
              <span>Notifications</span>
            </div>
            <div className="divide-y divide-border rounded-xl border border-border bg-secondary/40">
              {[
                {
                  label: "New theatrical & streaming releases",
                  checked: newReleases,
                  onChange: setNewReleases,
                },
                {
                  label: "Personalized AI recommendations",
                  checked: recommendations,
                  onChange: setRecommendations,
                },
                {
                  label: "Community & review activity",
                  checked: socialNotifs,
                  onChange: setSocialNotifs,
                },
              ].map((item) => (
                <label
                  key={item.label}
                  className="flex items-center justify-between px-4 py-3 text-sm cursor-pointer"
                >
                  <span className="text-foreground">{item.label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={item.checked}
                    onClick={() => item.onChange(!item.checked)}
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
                </label>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>Privacy</span>
            </div>
            <div className="divide-y divide-border rounded-xl border border-border bg-secondary/40">
              {[
                {
                  label: "Public watchlist",
                  checked: publicWatchlist,
                  onChange: setPublicWatchlist,
                },
                {
                  label: "Share viewing activity on profile",
                  checked: publicActivity,
                  onChange: setPublicActivity,
                },
              ].map((item) => (
                <label
                  key={item.label}
                  className="flex items-center justify-between px-4 py-3 text-sm cursor-pointer"
                >
                  <span className="text-foreground">{item.label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={item.checked}
                    onClick={() => item.onChange(!item.checked)}
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
                </label>
              ))}
            </div>
          </div>

          {/* Region & Language */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sliders className="h-4 w-4 text-primary" />
              <span>Region & Language</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Display Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Streaming Region
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-2.5 border-t border-border bg-card/95 backdrop-blur-md px-6 py-4">
          <button
            type="button"
            onClick={() => setSettingsModal(false)}
            className="btn-cinema-outline"
          >
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="btn-cinema">
            <Check className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
