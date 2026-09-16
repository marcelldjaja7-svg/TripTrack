# TripTrack

Strava-style trip tracker for mobile (Expo / React Native).

## Features (MVP)

- **Record trips** — live distance, current/average speed, duration, and GPS route
- **Trip feed** — home list with route previews and key metrics
- **Share designer** — customizable templates (Sunset, Night, Minimal, Postcard, Trail), accents, captions, and metric toggles
- **Export** — share card image via the system share sheet (or download on web)

Trips are stored locally on device with AsyncStorage. No accounts or social feed in this MVP.

## Run

```bash
npm install
npx expo start
```

Then open in Expo Go (iOS/Android), or press `w` for web. On web / when location permission is denied, Record uses a **demo GPS path** so you can still try tracking and share designs.

## Project layout

- `src/hooks/useTripTracker.ts` — GPS + simulation recording
- `src/screens/` — Home, Record, You, Trip detail, Share designer
- `src/components/ShareCardCanvas.tsx` — exportable share card
- `src/storage/trips.ts` — local persistence
