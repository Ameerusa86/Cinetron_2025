"use client";

import React from "react";
import { AIHub } from "@/components/features/AIHub";
import { PageHeader } from "@/components/media/PageHeader";

export default function AIFeaturesPage() {
  return (
    <div className="min-h-screen w-full">
      <PageHeader
        eyebrow="Gemini Intelligence"
        title="AI Cinema"
        accentWord="Studio"
        description="Personalized recommendations, mood analysis, scene recognition, review synthesis, and auto-curated collections."
      />

      <section className="py-10">
        <div className="container-cinema">
          <AIHub />
        </div>
      </section>
    </div>
  );
}
