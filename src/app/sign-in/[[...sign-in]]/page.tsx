import { SignIn } from "@clerk/nextjs";
import { Film } from "lucide-react";
import { ClerkPremiumBackground, clerkPremiumTheme } from "@/lib/clerk-theme";

export default function SignInPage() {
  return (
    <ClerkPremiumBackground>
      <div className="mx-auto w-full max-w-md px-4 py-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/30">
            <Film className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome Back
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to access your watchlist, favorites, and AI picks.
          </p>
        </div>

        <SignIn appearance={clerkPremiumTheme} />
      </div>
    </ClerkPremiumBackground>
  );
}
