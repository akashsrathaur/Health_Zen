
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## ❗ CRITICAL: How to Fix the "Could not retrieve user profile" Error

If your app loads but shows "Welcome back, Guest User" instead of your name, it means your app's backend is missing the necessary permissions to access Firestore.

**You must perform the following steps in your Google Cloud project to fix this.**

### Step 1: Find Your Service Account Email

1.  Open the [Google Cloud Console](https://console.cloud.google.com/) for your project.
2.  In the main navigation menu (`☰`), go to **App Hosting**.
3.  You will see a list of your backends. Find your backend (its name usually ends in `-backend`) and look for the **Service account** column.
4.  Copy the full service account email address. It will look similar to this: `firebase-app-hosting-compute@[your-project-id].iam.gserviceaccount.com`.

### Step 2: Enable the Required API

1.  While still in the Google Cloud Console, go to the **APIs & Services > Library** page.
2.  In the search bar, type `IAM Service Account Credentials API` and press Enter.
3.  Click on the result for "IAM Service Account Credentials API" and **enable it** for your project if it's not already enabled.

### Step 3: Grant the "Service Account Token Creator" Role

1.  In the Google Cloud Console, go to the **IAM & Admin > IAM** page.
2.  Click the **+ GRANT ACCESS** button at the top of the page.
3.  In the "New principals" field, paste the service account email you copied in Step 1.
4.  In the "Assign roles" dropdown, search for and select the "**Service Account Token Creator**" role.
5.  Click **Save**.

After a minute or two for the permissions to apply, your app should be able to connect to Firestore and fetch user data correctly. Refresh your application to see the change.

---

## Deploying Firestore Rules

These commands tell Firebase what security rules to apply to your database. This is a separate step from the permissions fix above.

a. **Install the Firebase CLI**:
If you don't have it, run: `npm install -g firebase-tools`

b. **Log in to Firebase**:
Run: `firebase login`

c. **Deploy the rules**:
Run: `firebase deploy --only firestore:rules`
