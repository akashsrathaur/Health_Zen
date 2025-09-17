
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deploying Firestore Rules

To allow users to create and access their profiles, you must deploy the Firestore security rules.

1. Install the Firebase CLI: `npm install -g firebase-tools`
2. Log in to Firebase: `firebase login`
3. Deploy the rules: `firebase deploy --only firestore:rules`
