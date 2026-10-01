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

You should see **«Сервер жұмыс істеп тұр ✅»**. Edit `App.tsx` and save — the phone updates instantly.

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

## Project structure

```
mobile/
├── App.tsx            # home screen (server status for now)
├── index.ts           # entry point
├── app.json           # Expo config: name, bundle id, icons
├── src/
│   ├── config.ts      # API_URL
│   └── api/
│       └── health.ts  # GET /health
└── assets/            # icon, splash
```

Add packages with `npx expo install <package>` (not `npm install`) — it picks versions that match the Expo SDK.

## Later: TestFlight

Builds for real testers go through EAS (cloud build, no Xcode): `npx eas-cli@latest build --platform ios`. Requires an Apple Developer account.
