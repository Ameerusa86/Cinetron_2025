import React from "react";

/**
 * Shared Clerk appearance configuration for Cinetron Cinema Editorial Dark
 */
export const clerkPremiumTheme = {
  elements: {
    rootBox: "mx-auto w-full",
    card: "bg-card border border-border shadow-2xl rounded-2xl p-6 sm:p-8",
    headerTitle: "text-foreground text-xl font-bold text-center mb-1",
    headerSubtitle: "text-muted-foreground text-sm text-center mb-6",
    socialButtonsBlockButton:
      "bg-secondary border border-border text-foreground hover:bg-accent transition-colors rounded-xl h-11 font-medium",
    socialButtonsBlockButtonText: "text-foreground font-medium text-sm",
    dividerLine: "bg-border",
    dividerText: "text-muted-foreground text-xs uppercase tracking-wider",
    formButtonPrimary:
      "bg-primary hover:bg-primary-600 text-white font-semibold h-11 rounded-xl transition-colors shadow-sm",
    formFieldInput:
      "bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-11 transition-colors",
    formFieldLabel: "text-foreground text-sm font-medium mb-1.5",
    formFieldAction: "text-primary hover:underline text-sm font-medium",
    footerActionText: "text-muted-foreground text-sm",
    footerActionLink: "text-primary hover:underline font-semibold text-sm",
    identityPreviewText: "text-foreground text-sm",
    identityPreviewEditButton: "text-primary hover:underline text-sm",
    formHeaderTitle: "text-foreground text-lg font-bold",
    formHeaderSubtitle: "text-muted-foreground text-sm",
    otpCodeFieldInput:
      "bg-secondary border border-border text-foreground focus:border-primary rounded-lg",
    formResendCodeLink: "text-primary hover:underline text-sm font-medium",
    alertText: "text-rose-400 text-sm",
    formFieldSuccessText: "text-emerald-400 text-xs",
    formFieldErrorText: "text-rose-400 text-xs",
    formFieldWarningText: "text-amber-400 text-xs",
    profileSectionTitle: "text-foreground text-lg font-bold",
    profileSectionContent: "text-muted-foreground text-sm",
    breadcrumbsLink: "text-primary hover:underline",
    navbarButton:
      "text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors",
    profileSection: "bg-secondary/40 border border-border rounded-xl p-5",
    profileSectionPrimaryButton:
      "bg-primary hover:bg-primary-600 text-white font-medium rounded-lg",
    formButtonReset: "text-muted-foreground hover:text-foreground",
    badge:
      "bg-primary/15 border border-primary/25 text-primary text-xs font-medium",
    avatarBox: "ring-1 ring-border",
  },
};

export function ClerkPremiumBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background pt-20 pb-16 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(229,9,20,0.12),transparent_70%)]"
      />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
