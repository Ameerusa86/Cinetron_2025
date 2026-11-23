import React from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  accentWord?: string;
  description?: string;
  children?: React.ReactNode;
  align?: "left" | "center";
}

export function PageHeader({
  eyebrow,
  title,
  accentWord,
  description,
  children,
  align = "left",
}: PageHeaderProps) {
  const isCenter = align === "center";

  return (
    <section className="relative overflow-hidden border-b border-border pt-24 pb-10 sm:pt-28 sm:pb-12">
      {/* Subtle Cinema Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_-10%,rgba(229,9,20,0.12),transparent_70%)]"
      />

      <div className="container-cinema relative z-10">
        <div className={isCenter ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
          {eyebrow && (
            <div
              className={`mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary ${
                isCenter ? "justify-center" : ""
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{eyebrow}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            {title}{" "}
            {accentWord && (
              <span className="font-display italic font-semibold text-primary">
                {accentWord}
              </span>
            )}
          </h1>

          {description && (
            <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}
