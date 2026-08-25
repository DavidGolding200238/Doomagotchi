# Doomagotchi <img src="assets/images/Logo Skull.png" alt="Skull logo" width="52" />

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

Three selectable pets. Each has happy, sick and dead animations. Idle states are shown below.

<div align="center">

| Nugget | Waddles | Spino |
|:---:|:---:|:---:|
| <img src="assets/pets/Panda/Panda Idle.gif" alt="Nugget" width="120" /> | <img src="assets/pets/Duck/Duck Idle.gif" alt="Waddles" width="120" /> | <img src="assets/pets/Spinosaurus/Idle Spino.gif" alt="Spino" width="120" /> |

</div>

The user names the pet. Pet data is stored per user in Firestore.

### Real usage tracking

Uses Android Usage Access (PACKAGE_USAGE_STATS). Tracks selected social apps: Instagram, TikTok, X, YouTube, Facebook, Messenger, Reddit and Snapchat. The user can turn individual apps on or off in Settings. Default daily scroll limit is 45 minutes. Only new over limit minutes damage the pet.

### Health system

Health and happiness drop when the daily limit is exceeded. Small recovery occurs when under the limit or on a new day. Once health reaches zero the pet stays dead. There is no easy recovery path.

### Challenges

Challenges unlock one after another. On the pet's first UTC day all challenges stay locked by design.

| Icon | Name | Goal |
|:---:|------|------|
| <img src="assets/Icons/First Light.png" alt="First Light" width="40" /> | First Light | Stay under the scroll limit for 1 full day |
| <img src="assets/Icons/No Reels Night.png" alt="No Scroll Night" width="40" /> | No Scroll Night | Zero social apps between 21:00 and 07:00 UTC |
| <img src="assets/Icons/Two-Day Streak.png" alt="Two-Day Streak" width="40" /> | Two-Day Streak | Keep the pet healthy for 2 consecutive days |
| <img src="assets/Icons/Scroll Fast.png" alt="Scroll Fast" width="40" /> | Scroll Fast | Stay under 50 percent of the daily limit |
| <img src="assets/Icons/Three-Day Streak.png" alt="Three-Day Streak" width="40" /> | Three-Day Streak | 3 consecutive healthy days |
| <img src="assets/Icons/Morning Mute.png" alt="Morning Mute" width="40" /> | Morning Mute | No social apps before 10:00 UTC |
| <img src="assets/Icons/Five-Day Guardian.png" alt="Five-Day Guardian" width="40" /> | Five-Day Guardian | 5 consecutive days under the limit |
| <img src="assets/Icons/Weekend Warrior.png" alt="Weekend Warrior" width="40" /> | Weekend Warrior | Both Saturday and Sunday under the limit (UTC) |
| <img src="assets/Icons/Week of Focus.png" alt="Week of Focus" width="40" /> | Week of Focus | 7 consecutive healthy days |
| <img src="assets/Icons/Pet Protector.png" alt="Pet Protector" width="40" /> | Pet Protector | Keep the same pet alive for 14 days total |

### Badges

Badges unlock based on the number of completed challenges.

| Badge | Name | Requirement |
|:---:|------|-------------|
| <img src="assets/Badges/Sun Gazer.png" alt="Sun Gazer" width="48" /> | Sun Gazer | Complete 2 challenges |
| <img src="assets/Badges/Focus King.png" alt="Focus King" width="48" /> | Focus King | Complete 4 challenges |
| <img src="assets/Badges/Deep Sleeper.png" alt="Deep Sleeper" width="48" /> | Deep Sleeper | Complete 6 challenges |
| <img src="assets/Badges/Book Worm.png" alt="Book Worm" width="48" /> | Book Worm | Complete all 10 challenges |

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

An Android phone. Permission to install apps from unknown sources when installing the APK.

### Steps

1. Download the APK from the EAS build page (preview or development build for this project).
2. On the Android device, open the downloaded APK file.
3. If prompted, allow install from unknown sources for the browser or file manager you used.
4. Confirm the install and wait until it finishes.
5. Open Doomagotchi from the app drawer (or from the install success screen).
6. When the app asks for Usage Access, tap through to the system screen and enable access for Doomagotchi. You can also do this later under Settings, Apps, Special app access, Usage access, Doomagotchi. Without this permission the app cannot read real scroll time.
7. Allow notifications if prompted (optional but recommended).
8. Sign up with email and password, or log in if you already have an account.
9. Choose a pet, give it a name, and start using the app.

After that the home screen shows your pet, health, happiness, today's scroll time, challenges and badges. Usage is read from the device and updates the pet live.

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

Install the resulting APK on a device. For a preview build, open the app directly from the app drawer. For a development client build, start the Metro server then open the app:

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

## 7. Screens, mockups and demo videos

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

### Mockups

| Screen | Screenshot |
|--------|------------|
| Login | ![Login](Mock%20ups/Login%20Page%201.png) |
| Main Page | ![Main Page](Mock%20ups/Main%20Page.png) |
| Stats | ![Stats](Mock%20ups/Stats%20Page.png) |
| Settings | ![Settings](Mock%20ups/Setting%20Page.png) |
| Cemetery | ![Cemetery](Mock%20ups/Cemetry.png) |
| Gravestone | ![Gravestone](Mock%20ups/Gravestone.png) |

### Demo videos

Natural student walkthroughs recorded on a real Android device with live usage tracking.

**Part 1 – New account (full flow)**  
Pet selection → naming → home → settings → challenges → stats → empty graveyard → landscape.  
[Watch / Download Demo Part 1](Demo%20Videos/Demo%20Part%201.mp4)

**Part 2 – Death & Graveyard**  
Dead pet → Lay to rest → drag to bury → write epitaph → Graveyard with history → choose new pet.  
[Watch / Download Demo Part 2](Demo%20Videos/Demo%20Part%202.mp4)

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
```
