
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deploying Firestore Rules

To secure your database, you should deploy the included security rules.

a. **Install the Firebase CLI**:
If you don't have it, run: `npm install -g firebase-tools`

b. **Log in to Firebase**:
Run: `firebase login`

c. **Deploy the rules**:
From your project directory, run: `firebase deploy --only firestore:rules`
