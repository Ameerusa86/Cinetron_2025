import { SignIn } from "@clerk/nextjs";
import { ClerkPremiumBackground, clerkPremiumTheme } from "@/lib/clerk-theme";

export default function SignInPage() {
  return (
    <ClerkPremiumBackground>
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Custom Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-2xl">
              <span className="text-3xl">🎬</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h1>
          <p className="text-slate-300 text-lg font-medium">
            Continue your premium movie experience
          </p>
        </div>

        {/* Clerk SignIn with Premium Theme */}
        <SignIn appearance={clerkPremiumTheme} />

        {/* Premium Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-full border border-white/10 backdrop-blur-sm">
            <span className="text-yellow-400">✨</span>
            <span className="text-white text-sm font-medium">
              Premium Experience
            </span>
          </div>
        </div>
      </div>
    </ClerkPremiumBackground>
  );
}
