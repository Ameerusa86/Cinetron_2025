# MovieSense - Premium Movie Discovery App

A modern, premium movie discovery application built with Next.js 15, TypeScript, and Clerk authentication.

## 🚀 Features

- **Authentication**: Secure user authentication with Clerk
- **Movie Discovery**: Trending movies and TV shows via TMDB API
- **AI Integration**: Google Gemini AI for enhanced recommendations
- **Interactive Games**: Movie quizzes, trivia, and prediction games
- **User Profiles**: Personalized watchlists and favorites
- **Premium UI**: Glassmorphism design with smooth animations

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **Authentication**: Clerk
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Animations**: Framer Motion
- **Database**: TMDB API integration

## 📦 Deployment on Vercel

### Environment Variables

Set up the following environment variables in your Vercel dashboard:

```bash
# TMDB API Configuration
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-app-domain.vercel.app
NEXT_PUBLIC_APP_NAME=MovieSense

# Google Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Clerk Auth Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Clerk Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### Deployment Steps

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Environment Variables**: Add all the environment variables listed above
3. **Deploy**: Vercel will automatically build and deploy your application

### Build Verification

The application has been tested and verified to build successfully:

```bash
npm run build  # ✅ Builds successfully
npm run lint   # ✅ No ESLint warnings or errors
```

## 🔑 API Keys Required

### TMDB API Key

1. Visit [TMDB API](https://www.themoviedb.org/settings/api)
2. Create an account and request an API key
3. Add the key to `NEXT_PUBLIC_TMDB_API_KEY`

### Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to `NEXT_PUBLIC_GEMINI_API_KEY`

### Clerk Authentication

1. Visit [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy the publishable key and secret key
4. Add them to the respective environment variables

## 🏗️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📱 Features Overview

- **Home Page**: Trending movies and personalized recommendations
- **Discover**: Advanced filtering and search capabilities
- **Profile**: User watchlists, favorites, and viewing history
- **Games**: Interactive movie-related games and quizzes
- **AI Chat**: Movie recommendations powered by Google Gemini

## 🎨 Design System

- Premium glassmorphism effects
- Responsive design for all screen sizes
- Dark theme with orange accent colors
- Smooth animations and transitions
- Accessibility-focused components

## 📄 License

This project is private and proprietary.
