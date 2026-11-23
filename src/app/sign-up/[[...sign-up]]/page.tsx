import { SignUp } from "@clerk/nextjs";
import {
  Film,
  Sparkles,
  Bookmark,
  Gamepad2,
  ShieldCheck,
  Zap,
  Globe,
} from "lucide-react";
import { ClerkPremiumBackground, clerkPremiumTheme } from "@/lib/clerk-theme";

const benefits = [
  {
    icon: Sparkles,
    title: "AI-Powered Discovery",
    description:
      "Match films to your exact mood and generate curated double-feature collections.",
  },
  {
    icon: Bookmark,
    title: "Unified Watchlist & Log",
    description:
      "Track movies and series across Plan to Watch, Watching, and Completed queues.",
  },
  {
    icon: Gamepad2,
    title: "Interactive Cinema Games",
    description:
      "Challenge friends with Movie Night Bingo, timed quizzes, and box office forecasts.",
  },
];

export default function SignUpPage() {
  return (
    <ClerkPremiumBackground>
      <div className="container-cinema max-w-5xl py-8">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/30">
            <Film className="h-6 w-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Join{" "}
            <span className="font-display italic font-semibold text-primary">
              Cinetron
            </span>
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Create your account to sync watchlists, favorites, and personalized
            recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <SignUp appearance={clerkPremiumTheme} />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="surface-card p-6 sm:p-8 space-y-5">
              <h2 className="text-lg font-bold text-foreground">
                Included with your account
              </h2>

              <div className="space-y-4">
                {benefits.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-4 rounded-xl border border-border bg-secondary/40 p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Private by default
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  Live TMDB sync
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-sky-400" />
                  Global catalog
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClerkPremiumBackground>
  );
}
