# Doomagotchi

**A digital pet that dies when you doomscroll.**

Doomagotchi is a cross-platform mobile application that helps users reduce excessive social media usage through a virtual pet. The pet’s health declines when the user scrolls too much and recovers when usage is reduced. If the user continues to exceed their limit, the pet dies.

This project was built as a university submission using Expo (React Native) and Firebase.

---

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

**Note:** Scroll time is currently mocked. Real usage tracking is not implemented yet. Use the `Main` branch for the latest work.

---

## 1. Project Overview

### Problem
Doomscrolling is common among Gen Z and younger Millennials. Most screen-time tools only show reports or soft limits that are easy to ignore. There is little emotional consequence that actually motivates people to change the habit.

### Solution
The app links the user’s scrolling behaviour directly to a digital pet:

- Too much scrolling → health and happiness drop
- Less scrolling → the pet recovers
- Continued excess → the pet dies and is moved to the graveyard
- Challenges and badges reward streaks of better behaviour

The experience is intentionally strict. The cost of the habit is meant to feel real.

### Target Users
- Gen Z and younger Millennials (roughly 18–32)
- Students and early-career users
- People who spend a lot of time on Instagram, TikTok, Reels, and similar apps

---

## 2. Scope

### Included
- Cross-platform mobile app (Expo)
- Email authentication
- Pet selection, naming, and saving to the cloud
- Health and happiness system driven by scroll time
- Pet visual states (happy / sick / dead) with animations
- Challenge system
- Badge collection
- Graveyard for dead pets
- Portrait and landscape layouts on the main screens

### Not included
- Real device screen-time tracking (currently mocked)
- Push notifications
- In-app purchases

---

## 3. Features

### Authentication
- Email sign-up and login
- Firebase Authentication
- Session kept with AsyncStorage
- Logout from the home menu

### Pets
- Selectable pets including Nugget, Waddles, Spino, and Panda
- User can give the pet a name
- Pet data is stored per user in Firestore
- Health and happiness values
- Animation states: happy, sick, dead
- “Lay to Rest” flow when health reaches zero

### Health System
- Currently driven by mocked scroll minutes
- Health and happiness decrease when the daily limit is exceeded
- Small recovery on a new day when under the limit
- Logic is in `services/health.ts`

### Challenges
- Set of challenges focused on protecting the pet and reducing scrolling
- States: Locked, Available / In Progress, Completed, Failed
- Failed challenges reset
- First four challenges shown by default, with option to expand the full list
- Custom icons for some challenges

### Badges
- Collection unlocked by completing challenges
- Unlock thresholds based on number of completed challenges
- Locked badges show a lock icon

### Graveyard
- Dead pets are saved under the user in Firestore
- Shows days lived, cause of death, and epitaph
- Summary stats (total souls, best streak)

### Interface
- Cream / coral / gold colour palette
- Press Start 2P font for titles and level text
- Styles kept in separate files per screen
- Portrait and landscape support on core screens

---

## 4. Technical Stack

| Layer             | Technology                                |
|-------------------|-------------------------------------------|
| Framework         | Expo SDK 54                               |
| Language          | TypeScript                                |
| UI                | React Native                              |
| Navigation        | expo-router                               |
| Backend           | Firebase (Auth + Firestore)               |
| Local storage     | AsyncStorage                              |
| Animations        | react-native-reanimated, gesture-handler  |
| Images            | expo-image                                |
| Fonts             | Press Start 2P                            |

### Main folders

```
app/
  (auth)/          login & signup
  (tabs)/          home, stats, graveyard
  petselection.tsx
  rest.tsx         lay-to-rest flow

assets/
  images/          icons, badges, splash
  pets/            pet animation sets

components/
context/           AuthContext
services/          firebase, health, graveyard
styles/            one styles file per screen
```

### Data
- `users/{uid}` — current pet and health state
- `users/{uid}/graveyard/{petId}` — deceased pets

---

## 5. What Has Been Done

- Expo + TypeScript project setup with file-based routing
- Firebase email auth and session persistence
- Pet selection with naming and cloud save
- Home screen with health/happiness, challenges, and badges
- Mock health system
- Lay-to-rest flow and graveyard
- Animations for the available pets
- Portrait and landscape layouts
- Challenge list with locked/completed states and expand/collapse
- Badge collection tied to challenge completion
- Custom icons for selected challenges and badges
- Consistent styling and colour system

---

## 6. What Still Needs to Be Done

- Replace mocked scroll time with real usage data
- Drive challenge progress from actual behaviour instead of mock values
- Reliable daily reset for limits and challenges
- Finish any remaining animation coverage across all pets
- Profile / settings screens if required for submission

---

## 7. Design Choices

- No easy recovery power-ups — they would weaken the core loop of consequences.
- Challenges reset when failed so consistency matters.
- Badges unlock from completing a number of challenges rather than one-to-one mapping.
- Mock data was used first so the full loop (select pet → health change → death → graveyard) could be built and tested before platform usage APIs.

---

## 8. Repository

- Private repo: `DavidGolding200238/Doomagotchi`
- Active development branch: `Main`

---

## 9. Submission Note

This README describes the current state of Doomagotchi for university assessment. It covers the problem, scope, implementation, how to run the app, completed work, and remaining tasks.

The app runs as a working prototype with mocked scroll data. The main experience — choosing a pet, watching its health respond, completing challenges, and using the graveyard — is implemented.

---

## Learn more (Expo)

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
```
