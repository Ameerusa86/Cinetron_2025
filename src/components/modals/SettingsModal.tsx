"use client";

import React from "react";
import { useModalStore } from "@/stores";
import ThemeSelector from "../ui/ThemeSelector";

export default function SettingsModal() {
  const { settingsModal, setSettingsModal } = useModalStore();

  if (!settingsModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setSettingsModal(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <button
              onClick={() => setSettingsModal(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Theme Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span className="text-xl">🎨</span>
                <span>Theme</span>
              </h3>
              <p className="text-slate-400 text-sm">
                Choose your preferred theme or let the app follow your system
                preference.
              </p>
              <ThemeSelector />
            </div>

            {/* Other Settings Sections */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span className="text-xl">🔔</span>
                <span>Notifications</span>
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer">
                  <span className="text-white">New releases</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    defaultChecked
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer">
                  <span className="text-white">Watchlist updates</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    defaultChecked
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer">
                  <span className="text-white">Trending alerts</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span className="text-xl">🔒</span>
                <span>Privacy</span>
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer">
                  <span className="text-white">Public watchlist</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer">
                  <span className="text-white">Share viewing history</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span className="text-xl">🎬</span>
                <span>Preferences</span>
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <label className="block text-white mb-2">Default view</label>
                  <select className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600">
                    <option>Grid</option>
                    <option>List</option>
                    <option>Cards</option>
                  </select>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <label className="block text-white mb-2">
                    Items per page
                  </label>
                  <select className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600">
                    <option>20</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-800">
            <button
              onClick={() => setSettingsModal(false)}
              className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setSettingsModal(false)}
              className="btn-cinema px-6 py-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
