
# Firebase Studio - HealthZen

This is a Next.js starter app created in Firebase Studio. It features user authentication, a wellness-focused dashboard, AI-powered features like a symptom checker and chat buddy, and community interaction.

## Getting Started

To run the application locally, first install the dependencies:
```bash
npm install
```
Then, run the development server:
```bash
npm run dev
```
Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Required Environment Variables

For the application to function, you must have a `.env` file in the root of your project with the following keys. This file is created for you, but you need to fill in the values.

```
# Firebase App Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Genkit/Gemini AI Configuration
GEMINI_API_KEY=
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
