/**
 * Shared Clerk appearance configuration for CinemaVault Premium
 * This provides consistent theming across all Clerk components
 */

export const clerkPremiumTheme = {
  elements: {
    rootBox: "mx-auto",
    card: `
      bg-white/[0.02] 
      backdrop-blur-xl 
      border 
      border-white/10 
      shadow-2xl 
      shadow-black/50 
      rounded-3xl 
      p-8 
      relative 
      overflow-hidden
      before:absolute 
      before:inset-0 
      before:bg-gradient-to-br 
      before:from-white/5 
      before:to-transparent 
      before:rounded-3xl
    `,
    headerTitle: "text-white text-2xl font-bold text-center mb-2 relative z-10",
    headerSubtitle: "text-slate-300 text-center mb-6 relative z-10",
    socialButtonsBlockButton: `
      bg-white/5 
      border 
      border-white/10 
      text-white 
      hover:bg-white/10 
      hover:border-white/20 
      transition-all 
      duration-300 
      rounded-xl 
      h-12 
      font-medium 
      relative 
      z-10
      backdrop-blur-sm
    `,
    socialButtonsBlockButtonText: "text-white font-medium",
    dividerLine: "bg-white/20",
    dividerText: "text-slate-300 text-sm font-medium",
    formButtonPrimary: `
      bg-gradient-to-r 
      from-orange-500 
      via-pink-500 
      to-purple-500 
      hover:from-orange-600 
      hover:via-pink-600 
      hover:to-purple-600 
      text-white 
      font-semibold 
      h-12 
      rounded-xl 
      transition-all 
      duration-300 
      shadow-lg 
      hover:shadow-xl 
      hover:scale-[1.02] 
      relative 
      z-10
    `,
    formFieldInput: `
      bg-white/5 
      border 
      border-white/10 
      text-white 
      placeholder:text-slate-400 
      focus:bg-white/10 
      focus:border-orange-500/50 
      focus:ring-2 
      focus:ring-orange-500/20 
      rounded-xl 
      h-12 
      transition-all 
      duration-300 
      relative 
      z-10
      backdrop-blur-sm
    `,
    formFieldLabel: "text-slate-300 font-medium mb-2 relative z-10",
    formFieldAction:
      "text-orange-400 hover:text-orange-300 font-medium relative z-10",
    footerActionText: "text-slate-300 relative z-10",
    footerActionLink:
      "text-orange-400 hover:text-orange-300 font-semibold relative z-10",
    identityPreviewText: "text-slate-300 relative z-10",
    identityPreviewEditButton:
      "text-orange-400 hover:text-orange-300 relative z-10",
    formHeaderTitle: "text-white text-xl font-bold relative z-10",
    formHeaderSubtitle: "text-slate-300 relative z-10",
    otpCodeFieldInput: `
      bg-white/5 
      border 
      border-white/10 
      text-white 
      focus:border-orange-500/50 
      rounded-lg 
      relative 
      z-10
    `,
    formResendCodeLink:
      "text-orange-400 hover:text-orange-300 font-medium relative z-10",
    alertText: "text-red-300 relative z-10",
    formFieldSuccessText: "text-green-300 relative z-10",
    formFieldErrorText: "text-red-300 relative z-10",
    formFieldWarningText: "text-yellow-300 relative z-10",
    // User Profile specific elements
    profileSectionTitle: "text-white text-xl font-bold relative z-10",
    profileSectionContent: "text-slate-300 relative z-10",
    breadcrumbsLink: "text-orange-400 hover:text-orange-300 relative z-10",
    navbarButton: `
      text-slate-300 
      hover:text-white 
      hover:bg-white/10 
      rounded-lg 
      transition-all 
      duration-300 
      relative 
      z-10
    `,
    pageScrollBox: "relative z-10",
    profileSection: `
      bg-white/[0.02] 
      border 
      border-white/10 
      rounded-2xl 
      p-6 
      backdrop-blur-sm 
      relative 
      z-10
    `,
    profileSectionPrimaryButton: `
      bg-gradient-to-r 
      from-orange-500 
      to-orange-600 
      hover:from-orange-600 
      hover:to-orange-700 
      text-white 
      font-medium 
      rounded-lg 
      relative 
      z-10
    `,
    formButtonReset: "text-slate-300 hover:text-white relative z-10",
    badge: `
      bg-gradient-to-r 
      from-orange-500/20 
      to-purple-500/20 
      border 
      border-white/10 
      text-orange-400 
      relative 
      z-10
    `,
    avatarBox: "border-2 border-orange-500/50 relative z-10",
  },
};

/**
 * Premium background component for Clerk pages
 */
export function ClerkPremiumBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,114,12,0.2),transparent_50%)] opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.15),transparent_50%)] opacity-60" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse" />
      <div
        className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {children}
    </div>
  );
}
