import { UserProfile } from "@clerk/nextjs";
import { User } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ClerkPremiumBackground, clerkPremiumTheme } from "@/lib/clerk-theme";

function UserProfileContent() {
  return (
    <ClerkPremiumBackground>
      <div className="container-cinema max-w-4xl py-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/30">
            <User className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Account Security
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Manage your authentication, email addresses, and connected devices.
          </p>
        </div>

        <UserProfile appearance={clerkPremiumTheme} />
      </div>
    </ClerkPremiumBackground>
  );
}

export default function UserProfilePage() {
  return (
    <ProtectedRoute>
      <UserProfileContent />
    </ProtectedRoute>
  );
}
