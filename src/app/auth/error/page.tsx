import Link from "next/link";

export default async function AuthError({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-md w-full space-y-8 p-8 bg-slate-900/50 rounded-2xl border border-white/10 backdrop-blur-sm text-center">
        <div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Something went wrong during authentication
          </p>
        </div>

        <div className="mt-8">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-300 text-sm">
              {error === "OAuthSignin" &&
                "Error constructing authorization URL"}
              {error === "OAuthCallback" && "Error in OAuth callback handler"}
              {error === "OAuthCreateAccount" && "Could not create account"}
              {error === "EmailCreateAccount" && "Could not create account"}
              {error === "Callback" && "OAuth callback error"}
              {error === "OAuthAccountNotLinked" && "Account not linked"}
              {error === "EmailSignin" && "Check your email address"}
              {error === "CredentialsSignin" && "Invalid credentials"}
              {error === "SessionRequired" && "Session required"}
              {!error && "Unknown authentication error"}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/auth/signin"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            Try Again
          </Link>

          <Link
            href="/"
            className="mt-4 group relative w-full flex justify-center py-3 px-4 border border-slate-600 text-sm font-medium rounded-lg text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
