
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## ❗ CRITICAL: Fix for "Could not retrieve user profile" Error

If your application loads but shows "Welcome back, New!" instead of your name, it means your app's backend is missing the necessary permissions to access Firestore.

**You must perform the following steps in your Google Cloud project to fix this.**

### 1. Find Your Service Account Email

1.  Open the [Google Cloud Console](https://console.cloud.google.com/).
2.  Navigate to **App Hosting**.
3.  In the **Backends** tab, find your backend and copy the **Service account** email address. It will look like `[your-backend-id]@gcp-sa-apphosting.iam.gserviceaccount.com`.

### 2. Enable the Required API

1.  In the Google Cloud Console, go to the **APIs & Services > Enabled APIs & services** page.
2.  Click **+ ENABLE APIS AND SERVICES**.
3.  Search for "**IAM Service Account Credentials API**" and **enable it** for your project.

### 3. Grant the "Service Account Token Creator" Role

1.  In the Google Cloud Console, go to the **IAM & Admin > IAM** page.
2.  Click **GRANT ACCESS**.
3.  In the "New principals" field, paste the service account email you copied in step 1.
4.  In the "Assign roles" dropdown, search for and select the "**Service Account Token Creator**" role.
5.  Click **Save**.

Your app should now be able to connect to Firestore and fetch user data correctly.

## Deploying Firestore Rules

These commands tell Firebase what security rules to apply to your database. This is a separate step from the permissions fix above.

a. **Install the Firebase CLI**:
If you don't have it, run: `npm install -g firebase-tools`

b. **Log in to Firebase**:
Run: `firebase login`

c. **Deploy the rules**:
Run: `firebase deploy --only firestore:rules`

    