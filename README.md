# ReliefTrack Mobile

ReliefTrack Mobile is the beneficiary companion to the Barangay ReliefTrack admin portal. Beneficiaries can view their account details, available relief packages, distribution history, and an issued QR pass.

## Run locally

Install dependencies, then start Expo:

    npm install
    npx expo start

The app reads EXPO_PUBLIC_API_URL for the Laravel API base URL, including the /api path. Keep this value in the ignored .env.local file:

    EXPO_PUBLIC_API_URL=http://192.168.1.10:8000/api

Replace the sample address with the server address reachable from the phone. A physical phone and the development computer need to be on a network that allows them to communicate. Use HTTPS for a deployed server.

If the API URL is not set during development, the app uses the Expo development host on port 8000, with the Android emulator fallback address 10.0.2.2.

## Beneficiary features

- Register and sign in with a beneficiary number and password.
- Keep the sign-in token in secure device storage on iOS and Android.
- Review beneficiary details, status, and household information.
- View relief packages currently marked available by the admin portal.
- Review distribution dates, statuses, and notes.
- Show the admin-issued beneficiary QR pass for identity checks.

The admin portal controls beneficiary record changes, package availability, QR issuance, and distribution records.
