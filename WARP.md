# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

HealthZen is a Next.js wellness application that combines modern health tracking with AI-powered features for holistic wellness management. It uses Firebase for authentication and data storage, Google's Genkit AI for intelligent health suggestions, and follows a component-based architecture.

## Essential Commands

### Development
```bash
npm run dev               # Start development server on port 9002 with Turbopack
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript type checking
```

### AI Development
```bash
npm run genkit:dev       # Start Genkit AI development server
npm run genkit:watch     # Start Genkit AI development server with watch mode
```

### Firebase
```bash
firebase login                        # Authenticate with Firebase
firebase deploy --only firestore:rules  # Deploy Firestore security rules
```

## Architecture

### Core Structure
- **App Router**: Uses Next.js 15 App Router with route groups `(app)` and `(auth)`
- **AI Integration**: Google Genkit AI with Gemini 2.5-flash model for health suggestions
- **Database**: Firebase Firestore with authentication
- **UI Framework**: Tailwind CSS + shadcn/ui components + Framer Motion animations
- **State Management**: React Context (Auth, Notifications) + Zustand for user store

### Key Directories
- `src/app/` - Next.js App Router pages and layouts
- `src/ai/` - AI flows and Genkit configuration
- `src/actions/` - Server actions for data operations
- `src/components/` - React components including shadcn/ui
- `src/lib/` - Utilities, Firebase config, and data types
- `src/hooks/` - Custom React hooks

### AI Architecture
The app uses Google Genkit for AI-powered features:
- **Symptom Checker**: Analyzes user symptoms and provides homeopathic, Ayurvedic, and modern remedies
- **HealthSnap AI**: Processes uploaded images to suggest wellness tips
- **Chat Buddy**: Interactive AI assistant for health questions
- All AI flows are defined in `src/ai/flows/` with structured input/output schemas using Zod

### Authentication Flow
- Firebase Auth integration with React Context
- `AuthGuard` component protects authenticated routes
- User data stored in Firestore `userData` collection
- Auth state managed globally via `AuthProvider`

### Component Architecture
- **shadcn/ui**: Base UI components in `src/components/ui/`
- **Layout Components**: Sidebar navigation with collapsible states
- **Feature Components**: Dedicated components for core features (ChatBuddy, HealthSnap, etc.)
- **Responsive Design**: Mobile-first approach with sidebar responsive behavior

## Environment Setup

Required environment variables in `.env`:
```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# AI Configuration
GEMINI_API_KEY=
```

## Development Patterns

### Server Actions
- All data operations use Next.js server actions in `src/actions/`
- Actions are marked with `'use server'` directive
- Firebase operations wrapped in try/catch with proper error handling

### AI Flow Development
- AI flows defined using Genkit's `defineFlow` API
- Input/output schemas defined with Zod for type safety
- Prompts are structured and reusable via `definePrompt`
- All AI functions are server-side only

### Component Patterns
- Client components marked with `'use client'` directive
- Custom hooks for reusable logic (mobile detection, notifications, etc.)
- Context providers for global state management
- UI components follow shadcn/ui patterns with variant-based styling

### Route Structure
- Auth routes: `/login`, `/signup` (grouped under `(auth)`)
- App routes: `/dashboard`, `/health-snap`, `/symptom-check`, `/community`, etc. (grouped under `(app)`)
- API routes for AI endpoints integrated with Genkit

## Key Files to Understand

- `src/ai/genkit.ts` - AI configuration and model setup
- `src/lib/firebase.ts` - Firebase initialization with fallback handling
- `src/app/layout.tsx` - Root layout with providers
- `src/app/(app)/layout.tsx` - Authenticated app layout with sidebar
- `src/components/main-nav.tsx` - Navigation configuration
- `firebase.json` - Firebase project configuration
- `components.json` - shadcn/ui configuration

## Design System

### Colors & Styling
- Primary: Soft Lavender (#D0B4DE) for wellness-focused feel
- Background: Very light grey (#F5F5F5) for clean look
- Accent: Pale green (#A0D6B4) for CTAs and natural health representation
- Typography: Inter font family for modern aesthetic

### Component Library
- Uses shadcn/ui for consistent, accessible components
- Custom theme with CSS variables for dark/light mode support
- Lucide React for icons
- Framer Motion for animations and micro-interactions

## Firebase Configuration

### Firestore Structure
- `userData` collection stores user-specific data (daily vibes, progress tracking)
- Security rules defined in `firestore.rules`
- Collections designed for real-time updates and offline support

### Authentication
- Firebase Auth with email/password
- User context provides authentication state across the app
- Protected routes handled by `AuthGuard` component