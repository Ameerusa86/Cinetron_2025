"use client";

import React from "react";
import { useNotificationStore } from "@/stores";

export default function NotificationToast() {
  const { notifications, removeNotification } = useNotificationStore();

  // Only show the most recent 3 notifications
  const visibleNotifications = notifications.slice(0, 3);

  if (visibleNotifications.length === 0) return null;

  const getNotificationIcon = (
    type: "info" | "success" | "warning" | "error"
  ) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
      default:
        return "ℹ️";
    }
  };

  const getNotificationColors = (
    type: "info" | "success" | "warning" | "error"
  ) => {
    switch (type) {
      case "success":
        return "bg-green-500/90 border-green-400 text-white";
      case "error":
        return "bg-red-500/90 border-red-400 text-white";
      case "warning":
        return "bg-yellow-500/90 border-yellow-400 text-white";
      case "info":
      default:
        return "bg-blue-500/90 border-blue-400 text-white";
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            ${getNotificationColors(notification.type)}
            backdrop-blur-xl border-2 rounded-xl p-4 shadow-lg
            transform transition-all duration-300 ease-in-out
            animate-slide-in-right hover:scale-105
          `}
          onClick={() => removeNotification(notification.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              removeNotification(notification.id);
            }
          }}
        >
          <div className="flex items-start space-x-3">
            <div className="text-2xl flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold truncate">
                {notification.title}
              </h4>
              <p className="text-sm mt-1 opacity-90 line-clamp-2">
                {notification.message}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
              className="text-white/70 hover:text-white flex-shrink-0 ml-2"
              aria-label="Close notification"
            >
              ❌
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
