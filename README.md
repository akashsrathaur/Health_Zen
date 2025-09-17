
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deploying Firestore Rules & Fixing Permissions

To allow users to create and access their profiles, you must deploy the Firestore security rules and set the correct IAM permissions for your project.

### 1. Set IAM Permissions (Crucial Step for Firestore to Work)

The service account running your app needs permission to create tokens to talk to Google Cloud services like Firestore.

a. **Find your Service Account Email**: In the Google Cloud Console, go to the "App Hosting" page for your project. In the "Backends" tab, find your backend and copy the "Service account" email address. It will look like `[backend-id]@gcp-sa-apphosting.iam.gserviceaccount.com`.

b. **Enable the IAM Service Account Credentials API**:
    - Go to the "APIs & Services" > "Enabled APIs & services" page.
    - Click "+ ENABLE APIS AND SERVICES".
    - Search for "**IAM Service Account Credentials API**" and enable it for your project.

c. **Grant the "Service Account Token Creator" Role**:
    - Go to the "IAM & Admin" > "IAM" page.
    - Click "**GRANT ACCESS**".
    - In the "New principals" field, paste the service account email you copied earlier.
    - In the "Assign roles" dropdown, search for and select the "**Service Account Token Creator**" role.
    - Click "Save".

Your app should now be able to connect to Firestore without the `Could not retrieve user profile` error.

### 2. Deploy Firestore Rules

These commands tell Firebase what security rules to apply to your database.

a. **Install the Firebase CLI**:
If you don't have it, run: `npm install -g firebase-tools`

b. **Log in to Firebase**:
Run: `firebase login`

c. **Deploy the rules**:
Run: `firebase deploy --only firestore:rules`
