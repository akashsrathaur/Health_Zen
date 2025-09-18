
# HealthZen - Wellness Companion App 🌿

A comprehensive wellness platform built with Next.js, featuring AI-powered health insights, community engagement, and personalized wellness tracking. Built for modern wellness enthusiasts with a focus on both traditional and modern health practices.

## ✨ Features

- **🤖 HealthSnap AI**: AI-powered image analysis for health suggestions using Gemini AI
- **💬 Symptom Checker**: Intelligent symptom analysis with personalized recommendations  
- **👥 Community Feed**: Social wellness sharing with emoji reactions and community support
- **📊 Progress Tracker**: Daily streaks, water intake, sleep tracking with visual charts
- **🎯 Gamified Dashboard**: Achievements, progress bars, and motivational streaks
- **🌱 Remedies Library**: Curated collection of modern and Ayurvedic wellness remedies
- **📱 PWA Support**: Offline-capable progressive web app experience
- **🔒 Secure Authentication**: Firebase Auth with personalized user profiles

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom wellness theme
- **UI Components**: shadcn/ui + Radix UI primitives  
- **Authentication**: Firebase Auth
- **Database**: Firestore with security rules
- **AI**: Google Gemini AI via Genkit
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🎨 Design System

- **Primary**: Soft Lavender (#D0B4DE) - Calming wellness focus
- **Background**: Light Grey (#F5F5F5) - Clean, modern aesthetic  
- **Accent**: Pale Green (#A0D6B4) - Natural health representation
- **Typography**: Inter - Clean, readable sans-serif
- **Mobile-first responsive design** with dark mode support

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- Firebase project
- Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd HealthZen
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com  
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:9002](http://localhost:9002)

## 🔧 Firebase Setup

### 1. Create Firebase Project
```bash
firebase login
firebase projects:create your-project-name
```

### 2. Enable Services
- **Authentication**: Enable Email/Password authentication
- **Firestore**: Create database in test mode, then deploy security rules

### 3. Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

### How to Get Your Keys

1.  **Firebase Keys**: You can get these by creating a Firebase project and a Web App within that project. In the Firebase console, go to **Project Settings** > **General**, and under "Your apps", you will find the Firebase SDK snippet with your configuration.

2.  **GEMINI_API_KEY**: You can get this for free from Google AI Studio.
    *   Go to [aistudio.google.com](https://aistudio.google.com/).
    *   Sign in and click **"Get API key"** in the top left.
    *   Click **"Create API key in new project"**.
    *   Copy the generated key.

## Deploying to Vercel

When you deploy your application to a hosting provider like Vercel, you must add the environment variables from your `.env` file to your Vercel project settings. **Your application will not build successfully without them.**

1.  **Go to your Vercel Project**: Open your project in the Vercel dashboard.
2.  **Navigate to Settings**: Click on the "Settings" tab.
3.  **Go to Environment Variables**: In the left-hand menu, click on "Environment Variables".
4.  **Add Your Keys**: For each variable in your `.env` file (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`, `GEMINI_API_KEY`), add it to Vercel.
    -   Copy the name (like `NEXT_PUBLIC_FIREBASE_API_KEY`).
    -   Copy the corresponding value.
    -   Click "Save".
5.  **Redeploy**: After adding all the variables, trigger a new deployment from the "Deployments" tab in Vercel. Your app will then build successfully with the correct keys.

## Securing Firestore

To secure your database, you should deploy the included security rules. This is a critical step to prevent unauthorized access to your data.

1.  **Install the Firebase CLI**: If you don't have it, run:
    ```bash
    npm install -g firebase-tools
    ```
2.  **Log in to Firebase**:
    ```bash
    firebase login
    ```
3.  **Deploy the rules**: From your project directory, run:
    ```bash
    firebase deploy --only firestore:rules
    ```
