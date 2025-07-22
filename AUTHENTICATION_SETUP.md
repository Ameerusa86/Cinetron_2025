# 🎬 MovieSense Premium - Authentication Setup Guide

## Auth.js (NextAuth.js v5) Integration

This project uses **Auth.js v5** with **Supabase** as the database adapter for authentication.

## 🚀 Quick Setup

### 1. Environment Variables

Make sure your `.env.local` file contains:

```bash
# Auth.js Configuration
AUTH_SECRET="your-generated-secret-here"
AUTH_TRUST_HOST=true

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OAuth Providers
AUTH_GOOGLE_ID=your-google-oauth-client-id
AUTH_GOOGLE_SECRET=your-google-oauth-client-secret
AUTH_GITHUB_ID=your-github-oauth-client-id
AUTH_GITHUB_SECRET=your-github-oauth-client-secret
```

### 2. Generate AUTH_SECRET

Run this command to generate a secure secret:

```bash
npx auth secret
```

Or use any secure random string generator.

### 3. Supabase Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and service role key from Settings > API

#### Database Schema

Auth.js will automatically create the required tables when you first sign in. The tables include:

- `accounts`
- `sessions`
- `users`
- `verification_tokens`

### 4. OAuth Provider Setup

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

#### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `http://localhost:3000/api/auth/callback/github` (development)
   - `https://yourdomain.com/api/auth/callback/github` (production)

## 🔧 How It Works

### File Structure

```
src/
├── auth.ts                     # Auth.js configuration
├── middleware.ts              # Auth middleware
├── app/
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts          # Auth API routes
│   └── auth/
│       ├── signin/page.tsx   # Custom sign-in page
│       └── error/page.tsx    # Auth error page
├── components/
│   ├── ui/AuthButton.tsx     # Authentication UI component
│   └── providers/
│       └── AuthProvider.tsx  # Session provider wrapper
```

### Key Components

#### AuthButton Component

- Displays user avatar and dropdown when signed in
- Shows sign-in options when not authenticated
- Responsive design with mobile-friendly interface

#### Auth Pages

- **Sign In**: Custom styled sign-in page with Google and GitHub options
- **Error**: Handles authentication errors with user-friendly messages

### Session Management

- Uses database sessions for security
- Automatically handles session renewal
- Provides session data via `useSession()` hook

## 🎯 Usage

### Client Components

```tsx
import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Not signed in</p>;

  return <p>Signed in as {session.user.email}</p>;
}
```

### Server Components

```tsx
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  if (!session?.user) return <p>Not signed in</p>;

  return <p>Signed in as {session.user.email}</p>;
}
```

### Protecting Routes

The middleware automatically protects routes. You can customize protection in `middleware.ts`:

```tsx
import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    const newUrl = new URL("/auth/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});
```

## 🔐 Security Features

- **Database Sessions**: More secure than JWT tokens
- **CSRF Protection**: Built-in protection against CSRF attacks
- **Secure Cookies**: HTTPOnly and Secure cookie attributes
- **Automatic Token Refresh**: Handles token renewal automatically
- **Rate Limiting**: Built-in protection against brute force attacks

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid CSRF token"**

   - Make sure `AUTH_TRUST_HOST=true` in production
   - Check that your domain is correctly configured

2. **"Database connection error"**

   - Verify Supabase URL and service role key
   - Ensure Supabase project is active

3. **OAuth errors**

   - Check redirect URIs in OAuth provider settings
   - Verify client ID and secret are correct

4. **Session not persisting**
   - Check that cookies are enabled
   - Verify AUTH_SECRET is set and consistent

### Debug Mode

Set `debug: true` in `auth.ts` to see detailed logs:

```tsx
export const { handlers, auth, signIn, signOut } = NextAuth({
  // ... other config
  debug: process.env.NODE_ENV === "development",
});
```

## 🚀 Deployment

### Vercel (Recommended)

1. Add environment variables in Vercel dashboard
2. Update OAuth redirect URIs to your production domain
3. Deploy!

### Other Platforms

1. Set `AUTH_TRUST_HOST=true` for production
2. Update `AUTH_URL` if needed
3. Configure OAuth providers with production URLs

---

## 📝 Notes

- This setup uses Auth.js v5 (beta), which is the future of NextAuth.js
- Database sessions are more secure but require a database
- The UI components are built with Tailwind CSS and DaisyUI
- All authentication flows are handled automatically

For more information, visit the [Auth.js documentation](https://authjs.dev).
