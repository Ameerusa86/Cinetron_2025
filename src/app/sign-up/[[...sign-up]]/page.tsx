import { SignUp } from "@clerk/nextjs";
import { ClerkPremiumBackground, clerkPremiumTheme } from "@/lib/clerk-theme";

export default function SignUpPage() {
  return (
    <ClerkPremiumBackground>
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-2xl">
            <span className="text-3xl">🎬</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Join{" "}
            <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Cinetron
            </span>
          </h1>
          <p className="text-slate-300 text-lg font-medium max-w-md mx-auto">
            Start your premium movie experience with exclusive features
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Sign Up Form */}
          <div>
            <SignUp appearance={clerkPremiumTheme} />
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Premium Features
            </h2>

            <div className="space-y-4">
              {[
                {
                  icon: "🎪",
                  title: "3D Movie Experience",
                  description:
                    "Immerse yourself with interactive 3D movie posters and environments",
                },
                {
                  icon: "🤖",
                  title: "AI Recommendations",
                  description:
                    "Get personalized movie suggestions powered by machine learning",
                },
                {
                  icon: "🎭",
                  title: "Social Watch Parties",
                  description:
                    "Watch movies with friends in real-time with synchronized playback",
                },
                {
                  icon: "🎙️",
                  title: "Voice Commands",
                  description:
                    "Navigate and search using advanced voice recognition",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/[0.05] transition-all duration-300"
                >
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">🔒</span>
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">⚡</span>
                  <span>Lightning Fast</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">🌟</span>
                  <span>Premium Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClerkPremiumBackground>
  );
}
