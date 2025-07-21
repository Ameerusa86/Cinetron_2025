"use client";

import React from "react";
import { AIHub } from "@/components/features/AIHub";

export default function AIFeaturesPage() {
  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <AIHub />
        </div>
      </div>
    </div>
  );
}
