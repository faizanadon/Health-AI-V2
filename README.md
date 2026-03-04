# HealthAI — AI Healthcare Management System
> FYP Project · Lahore Garrison University · BSCS

## Features
- 🤖 AI Symptom Checker (Claude AI)
- 👨‍⚕️ Doctor Booking with Slot Selection
- 💊 Pharmacy & Medicine Search
- 🩸 Blood Bank & Donor Finder
- 📍 Nearby Hospitals & Pharmacies

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API Key
Open `App.js` and find the `callAI` function.
Replace `YOUR_ANTHROPIC_API_KEY_HERE` with your key from https://console.anthropic.com

### 3. Run
```bash
npx expo start
```
Scan QR code with Expo Go app on your Android phone.

### 4. Build APK
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

## Tech Stack
- React Native (Expo)
- React Navigation (Bottom Tabs)
- Expo Linear Gradient
- Anthropic Claude API
# Health-AI-V2
