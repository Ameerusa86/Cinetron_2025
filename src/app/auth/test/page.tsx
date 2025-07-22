import { auth } from "@/auth";

export default async function AuthTestPage() {
  const session = await auth();

  return (
    <div className="min-h-screen p-8 bg-slate-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Page</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Environment Check:</h2>
          <ul className="ml-4 text-sm">
            <li>
              Google ID: {process.env.AUTH_GOOGLE_ID ? "✅ Set" : "❌ Missing"}
            </li>
            <li>
              Google Secret:{" "}
              {process.env.AUTH_GOOGLE_SECRET ? "✅ Set" : "❌ Missing"}
            </li>
            <li>
              GitHub ID: {process.env.AUTH_GITHUB_ID ? "✅ Set" : "❌ Missing"}
            </li>
            <li>
              GitHub Secret:{" "}
              {process.env.AUTH_GITHUB_SECRET ? "✅ Set" : "❌ Missing"}
            </li>
            <li>
              Supabase URL:{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
            </li>
            <li>
              Supabase Key:{" "}
              {process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing"}
            </li>
            <li>
              Auth Secret: {process.env.AUTH_SECRET ? "✅ Set" : "❌ Missing"}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Session Status:</h2>
          <pre className="bg-slate-800 p-4 rounded text-sm">
            {JSON.stringify(session, null, 2) || "No session"}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Test Links:</h2>
          <div className="space-x-4">
            <a
              href="/api/auth/signin/google"
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Test Google Auth
            </a>
            <a
              href="/api/auth/signin/github"
              className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
            >
              Test GitHub Auth
            </a>
            <a
              href="/api/auth/signout"
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Sign Out
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
