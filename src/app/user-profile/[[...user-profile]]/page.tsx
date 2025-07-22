import { UserProfile } from "@clerk/nextjs";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ClerkPremiumBackground, clerkPremiumTheme } from "@/lib/clerk-theme";

function UserProfileContent() {
  return (
    <ClerkPremiumBackground>
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Custom Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-2xl">
              <span className="text-3xl">👤</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Your Profile
            </span>
          </h1>
          <p className="text-slate-300 text-lg font-medium">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <UserProfile appearance={clerkPremiumTheme} />
        </div>
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
