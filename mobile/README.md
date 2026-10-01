# TauTrip — iOS app

React Native · Expo SDK 57 · TypeScript. iPhone app for Almaty hikers.

## Run on your iPhone (no Xcode needed)

**You need:**
- Node.js **22.13+** (`node -v`). With nvm: `nvm install` inside `mobile/` (reads `.nvmrc`).
- The **Expo Go** app on your iPhone (App Store).
- iPhone and computer on the **same Wi-Fi**.

**1. Start the backend** so the phone can reach it (from the repo root):

```bash
cd backend
make run-lan
```

**2. Start the app** (in a second terminal):

```bash
cd mobile
npm install
npm start
```

**3.** Scan the QR code with the iPhone **Camera** → it opens in Expo Go.

You should see the **Sign in** screen. Tap **Sign up**, and in development the 6-digit code is shown on the screen (the backend has no email set up yet). Edit any file in `src/` and save — the phone updates instantly.

### If it shows ❌

| Problem | Fix |
|---------|-----|
| Backend started with `make run` | Use `make run-lan` (it listens on all networks, not only this computer) |
| macOS firewall blocks Python (check: `/usr/libexec/ApplicationFirewall/socketfilterfw --listapps`) | **System Settings → Network → Firewall → Options…** → find **Python** → set **Allow incoming connections**. If macOS shows a pop-up for Python, click **Allow** |
| Different Wi-Fi / university Wi-Fi blocks devices | Connect the computer to the iPhone's hotspot |
| Port 8000 is busy (another project) | Set `PORT=8001` in `backend/.env` and `EXPO_PUBLIC_API_URL=http://<computer-ip>:8001` in `mobile/.env` |

## Preview in a browser

```bash
npm run web      # → http://localhost:8081
```

Handy for quick UI checks and for teammates without an iPhone. The real target is iOS — always check on the phone.

## Commands

| Command | What it does |
|---------|--------------|
| `npm start`         | Start the dev server (QR code for Expo Go) |
| `npm run web`       | Open the app in a browser |
| `npm run ios`       | Open in iOS Simulator (requires Xcode) |
| `npm run typecheck` | TypeScript check |

## Configuration (`mobile/.env`, optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `EXPO_PUBLIC_API_URL` | `http://<your computer IP>:8000` (detected automatically in dev) | Backend address |

## What's inside

- **Sign in / Sign up / Forgot password** — following the Figma wireframes. Sign-up has 3 steps: email + @tag + password → 6-digit email code → name, birthday, gender, hiking preferences. Facebook / Apple buttons are placeholders for now.
- **Tabs:** Home (mountain cards, search, sort, filter) · Routes (stages, packing checklist) · Favorites (♡) · Profile (photo, language, log out).
- **3 languages:** Қазақша / Русский / English — switch on the auth screens or in Profile. All texts live in `src/i18n/strings.ts`.
- The login token is stored in the iPhone Keychain (`expo-secure-store`). Favorites and the profile photo are stored on the phone for now.
- Mountains and routes are demo data in `src/data/` until the backend has `/mountains` and `/routes`.

## Project structure

```
mobile/
├── app.json               # Expo config: name, bundle id, icons, plugins
├── src/
│   ├── app/               # screens (Expo Router: every file is a screen)
│   │   ├── _layout.tsx    # providers + guard: guests see (auth), users see (tabs)
│   │   ├── (auth)/        # login, register (3 steps), forgot
│   │   ├── (tabs)/        # index (Home), routes, favorites, profile
│   │   ├── mountain/[id].tsx
│   │   └── route/[id].tsx
│   ├── components/        # cards, inputs, chips, code input, sheets…
│   ├── api/               # backend calls (client.ts, auth.ts)
│   ├── state/             # auth session, favorites, validation helpers
│   ├── i18n/              # kk / ru / en texts
│   ├── data/              # demo mountains and routes
│   ├── config.ts          # API_URL
│   └── theme.ts           # colors (from the wireframes)
└── assets/                # icon, splash
```

Add a text: put the key in all three languages in `src/i18n/strings.ts`, then use `t('your.key')`.

Add packages with `npx expo install <package>` (not `npm install`) — it picks versions that match the Expo SDK.

## Later: TestFlight

Builds for real testers go through EAS (cloud build, no Xcode): `npx eas-cli@latest build --platform ios`. Requires an Apple Developer account.
