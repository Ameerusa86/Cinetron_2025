<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# 🎬 SUPER PREMIUM MOVIE WEBSITE - Copilot Instructions

## Project Overview

This is a SUPER PREMIUM and UNIQUE movie website built with Next.js 15, TypeScript, Tailwind CSS, and DaisyUI. The goal is to create the most innovative and immersive movie experience on the web.

## Architecture & Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + DaisyUI
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Animations**: Framer Motion
- **3D Graphics**: Three.js with React Three Fiber
- **API**: TMDB (The Movie Database)
- **Icons**: Lucide React + Heroicons

## Coding Standards & Best Practices

### TypeScript

- Use strict TypeScript with proper type definitions
- Create comprehensive interfaces for all API responses
- Prefer type over interface for simple types
- Use proper generic types for reusable components

### Component Architecture

- Use functional components with hooks
- Implement proper error boundaries
- Create reusable UI components in `/components/ui`
- Use compound component patterns for complex UI
- Implement proper loading states and skeletons

### State Management

- Use Zustand for global state (theme, user preferences, etc.)
- Use React Query for server state and caching
- Keep local state minimal with useState/useReducer
- Implement proper state persistence where needed

### Styling Guidelines

- Use DaisyUI components as the foundation
- Implement custom themes with CSS variables
- Create responsive designs mobile-first
- Use semantic color tokens
- Implement dark/light mode support
- Add smooth transitions and micro-interactions

### Performance

- Implement proper code splitting and lazy loading
- Use React.memo for expensive components
- Optimize images with Next.js Image component
- Implement proper caching strategies
- Use Intersection Observer for infinite scroll

### Premium Features to Implement

- 3D movie poster animations
- AI-powered movie recommendations
- Voice search capabilities
- Immersive theater mode
- Social features (watch parties, reviews)
- AR/VR preview experiences
- Real-time statistics and analytics
- Advanced filtering and search
- Personalized dashboards
- Cinematic UI transitions

### Code Organization

```
src/
├── app/                 # Next.js 15 app directory
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   ├── 3d/             # Three.js components
│   └── features/       # Feature-specific components
├── lib/                # Utilities and configurations
├── hooks/              # Custom React hooks
├── stores/             # Zustand stores
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

### API Integration

- Create typed API clients for TMDB
- Implement proper error handling
- Add request/response interceptors
- Use React Query for caching and background updates
- Implement offline support where possible

## Unique Features to Focus On

1. **3D Movie Experience**: Interactive 3D movie posters and environments
2. **AI Recommendations**: Machine learning-based suggestions
3. **Social Integration**: Real-time chat, watch parties, and social features
4. **Voice Commands**: Speech recognition for navigation and search
5. **Immersive UI**: Cinematic transitions and effects
6. **AR/VR Support**: Cutting-edge preview experiences
7. **Real-time Data**: Live statistics and trending information
8. **Advanced Personalization**: User behavior analysis and customization

## Testing & Quality

- Write unit tests for utilities and hooks
- Implement integration tests for critical user flows
- Use accessibility best practices (ARIA, semantic HTML)
- Ensure proper SEO optimization
- Implement proper error tracking and logging

Remember: This project should be absolutely UNIQUE and PREMIUM - think outside the box and create innovative features that have never been seen before in movie websites!
