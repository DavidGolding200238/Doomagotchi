# Doomagotchi

**A digital pet that dies when you doomscroll.**

Doomagotchi links your real social media usage to a virtual pet. Scroll too much and the pet gets sick and can die. Cut back and it recovers. Challenges and badges reward consistency.

Built with Expo (React Native), Firebase, and real Android usage tracking.

---

## 1. Overview

### Problem

Doomscrolling is common among Gen Z and younger Millennials. Most screen time tools only show reports or soft limits that are easy to ignore. There is little emotional consequence attached to the behaviour.

### Solution

The app makes the cost of the habit feel real.

Too much scrolling reduces the pet's health and happiness. Less scrolling lets the pet recover. Continued excess kills the pet and moves it to the Graveyard. Challenges and badges reward streaks of better behaviour.

### Target users

Gen Z and younger Millennials (roughly 18 to 32). Students and early career users. People who spend a lot of time on Instagram, TikTok, X, YouTube and similar apps.

### Platform

Android only. Real usage stats require Android. The app is distributed as an APK built with EAS. Expo Go is not supported.

---

## 2. Features

### Authentication

Email sign up and login through Firebase Authentication. Session persistence with AsyncStorage. Logout from the home menu.

### Pets

Three selectable pets:

| Pet | Species |
|-----|---------|
| Nugget | Panda |
| Waddles | Duck |
| Spino | Spinosaurus |

The user names the pet. Visual states are happy, sick and dead, each with animated GIFs. Pet data is stored per user in Firestore.

### Real usage tracking

Uses Android Usage Access (PACKAGE_USAGE_STATS). Tracks selected social apps: Instagram, TikTok, X, YouTube, Facebook, Messenger, Reddit and Snapchat. The user can turn individual apps on or off in Settings. Default daily scroll limit is 45 minutes. Only new over limit minutes damage the pet.

### Health system

Health and happiness drop when the daily limit is exceeded. Small recovery occurs when under the limit or on a new day. Once health reaches zero the pet stays dead. There is no easy recovery path.

### Challenges

Challenges unlock one after another. On the pet's first UTC day all challenges stay locked by design.

| ID | Name | Goal |
|----|------|------|
| 1 | First Light | Stay under the scroll limit for 1 full day |
| 2 | No Scroll Night | Zero social apps between 21:00 and 07:00 UTC |
| 3 | Two-Day Streak | Keep the pet healthy for 2 consecutive days |
| 4 | Scroll Fast | Stay under 50 percent of the daily limit |
| 5 | Three-Day Streak | 3 consecutive healthy days |
| 6 | Morning Mute | No social apps before 10:00 UTC |
| 7 | Five-Day Guardian | 5 consecutive days under the limit |
| 8 | Weekend Warrior | Both Saturday and Sunday under the limit (UTC) |
| 9 | Week of Focus | 7 consecutive healthy days |
| 10 | Pet Protector | Keep the same pet alive for 14 days total |

### Badges

Badges unlock based on the number of completed challenges.

| Badge | Requirement |
|-------|-------------|
| Sun Gazer | Complete 2 challenges |
| Focus King | Complete 4 challenges |
| Deep Sleeper | Complete 6 challenges |
| Book Worm | Complete all 10 challenges |

### Graveyard

Dead pets are saved with days lived, cause of death and an epitaph. Summary stats are shown for total souls and related totals.

### Notifications and background work

Local notifications fire for over limit, sick, getting sicker, near death, dead and full health states. A background health task runs roughly every 15 minutes so the pet continues to update even when the app is not open.

### Settings and profile

Settings cover usage permission and which apps are tracked. Profile covers account info, logout and account deletion. Portrait and landscape layouts are supported on the core screens.

---

## 3. Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Expo SDK 54 with expo-dev-client |
| Language | TypeScript |
| UI | React Native |
| Navigation | expo-router |
| Backend | Firebase Auth and Firestore |
| Usage tracking | expo-android-usagestats |
| Background work | expo-background-fetch and TaskManager |
| Notifications | expo-notifications |
| Builds | EAS Build |
| Android package | com.brohammer.Doomagotchi |

---

## 4. Installation (APK)

This is the normal way to run the current version of the app.

### Requirements

An Android phone or emulator. Permission to install apps from unknown sources when installing the APK.

### Steps

1. Download the latest EAS preview or development build APK for this project.
2. Open the APK on the device and install it. Allow install from unknown sources if the system asks.
3. Launch Doomagotchi.
4. Grant Usage Access. The app may prompt for it, or go to Settings, Apps, Special app access, Usage access, Doomagotchi, and allow access. Without this permission the app cannot read real scroll time.
5. Sign up or log in with email and password.
6. Choose a pet and give it a name.
7. Optionally allow notifications so the pet can warn you when it is getting sick.

The app is then running with live usage tracking.

---

## 5. Development setup

Only required if you need to build or change the code.

### Prerequisites

Node.js 18 or newer. npm. An Expo account and EAS CLI. An Android device or emulator. A Firebase project with Auth and Firestore configured for this app.

### Install dependencies

```bash
git clone <repo-url>
cd Doomagotchi
git checkout Main
npm install
```

### Build with EAS

Expo Go does not work because the native usage stats module is required.

```bash
npm install -g eas-cli
eas login

# Development client
eas build --profile development --platform android

# Preview APK for testers
eas build --profile preview --platform android
```

Install the resulting APK on a device, then start the dev client:

```bash
npx expo start --dev-client
```

### Permissions used

android.permission.PACKAGE_USAGE_STATS  
android.permission.POST_NOTIFICATIONS  
android.permission.RECEIVE_BOOT_COMPLETED  
android.permission.WAKE_LOCK

---

## 6. How the app works

1. The user installs the APK and grants Usage Access.
2. The user creates an account and selects a pet.
3. On every open, and via the background task, the app reads social app minutes for the current UTC day.
4. Minutes over the daily limit reduce health and happiness.
5. Time under the limit allows slow recovery.
6. When health reaches zero the pet is dead. The user can lay it to rest and it moves to the Graveyard.
7. Challenges are evaluated in sequence against real usage windows.
8. Badges unlock from the number of completed challenges.

All dates used for limits and challenges are UTC.

---

## 7. Screens and mockups

### Main screens

| Screen | Purpose |
|--------|---------|
| Login and Sign up | Email authentication |
| Pet selection | Choose and name the pet |
| Home | Pet display, health and happiness, today's scroll, challenges, badges |
| Stats | Usage history and activity |
| Graveyard | Fallen pets |
| Rest | Lay a dead pet to rest |
| Settings | Usage permission and tracked apps |
| Profile | Account info and logout |

### Design direction

Cream, coral and gold colour palette. Press Start 2P for titles. Pixel style pet animations for idle, sick, dead and walk states. Clean cards and soft corners. Portrait and landscape support on core screens. UI direction was guided by Visily wireframes covering onboarding, pet selection, dashboard, stats and graveyard.

### Assets in the repository

assets/pets holds full GIF sets for Duck, Panda and Spinosaurus.  
assets/Icons holds challenge icons.  
assets/Badges holds badge artwork.  
assets/images holds the logo, lock icon, app icon and splash.

### Mockups for review

Place device screenshots of Home, Pet selection, Graveyard, Stats and Settings in a docs/mockups folder and reference them here so reviewers can see the live UI without installing the APK.

---

## 8. Project structure

```
app/
  (auth)/             login and signup
  (tabs)/             home, stats, graveyard
  petselection.tsx
  rest.tsx
  _layout.tsx

assets/
  pets/               Duck, Panda, Spinosaurus GIFs
  Icons/              challenge icons
  Badges/             badge icons
  images/             logo, app icon, splash

components/           ProfileModal, SettingsModal, shared UI
context/              AuthContext
services/
  usage.ts            Android usage stats
  health.ts           health and happiness logic
  challenges.ts       sequential challenge evaluation
  background.ts       background health tick and notifications
  notifications.ts    local notification helpers
  graveyard.ts
  firebase.ts
styles/               one styles file per screen
```

### Firestore data

users/{uid} stores the current pet, health state, challenges, trackedAppIds and usageHistory.  
users/{uid}/graveyard/{petId} stores deceased pets.

---

## 9. Design choices

There are no easy recovery power ups. Paying or watching an ad to revive the pet would weaken the core loop of consequences.

Challenges stay locked on the pet's first UTC day so First Light requires a full finished day after creation.

Later challenges stay locked until earlier ones are completed.

Tracked apps are user controlled. Users can exclude apps they do not want counted toward the limit.

Challenge 2 (No Scroll Night) checks all tracked social apps, not only Instagram and TikTok.

UTC is used everywhere for daily limits and challenge windows to avoid timezone edge cases.

Real usage tracking is live. Mock scroll data is no longer used.

---

## 10. Repository

Private repository: DavidGolding200238/Doomagotchi  
Active branch: Main  
Older branch: master (outdated)

---

## 11. Notes for reviewers

The recommended way to evaluate the app is to install the EAS built APK on an Android device and grant Usage Access. Expo Go is not supported.

The full loop is implemented: select a pet, track real scroll time, watch health change, complete challenges, unlock badges, and move a dead pet to the Graveyard.
