# Devi Aradhana

A Bengali Durga Puja music streaming site, live at [deviaradhana.in](https://deviaradhana.in/). It plays Durga Puja songs, Birendrakrishna Bhadra's Mahalaya and Dhak beats in original FLAC, streamed from a Cloudflare R2 bucket.

Built with React 19, TypeScript, Vite, Tailwind CSS 4, Zustand and TanStack Query, and deployed on Vercel.

## Getting started

```bash
npm install
cp .env.example .env   # optional, see below
npm run dev
```

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server                 |
| `npm run build`   | Type-check and build into `dist/`    |
| `npm run preview` | Serve the production build locally   |
| `npm run lint`    | Lint with oxlint                     |

### Environment variables

| Variable             | Purpose                                                                                |
| -------------------- | -------------------------------------------------------------------------------------- |
| `VITE_R2_PUBLIC_URL` | Public URL of the R2 bucket holding the audio, covers and `manifest.json`              |
| `VITE_API_URL`       | Optional backend; if set, playlists are fetched from `${VITE_API_URL}/playlists` first |

## Adding songs

Songs are listed in `manifest.json`. The app looks for it in this order:

1. `${VITE_API_URL}/playlists`, if a backend is configured
2. `manifest.json` in the R2 bucket
3. `public/manifest.json`, served by the site itself
4. `/r2-proxy/manifest.json`, which the dev server proxies to R2

Edit `public/manifest.json` and upload the same file to the bucket. Each entry looks like:

```json
{
  "id": "dp-1",
  "title": "Dugga Elo",
  "artist": "Monali Thakur, Kaushik-Guddu",
  "duration": 147,
  "coverArt": "covers/01. Dugga Elo.jpg",
  "audioUrl": "audio/01. Dugga Elo.flac",
  "trackNumber": 1
}
```

`coverArt` and `audioUrl` are paths inside the bucket; spaces and special characters are encoded for you. The playlists are `durga`, `mahalaya` and `mahalaya-songs`.

## Yearly updates

- **Puja dates:** edit `src/data/pujaCalendar.ts`. The countdown, calendar title and weekdays are all worked out from those dates.
- **Site settings** (wallpapers, Dhak track, contact email, UPI ID, creators): `APP_CONFIG` in `src/data/mockData.ts`.
- **History facts:** `src/data/pujaHistoryFacts.ts`.

## Project layout

```
src/
  pages/HomePage.tsx        Main screen: navbar, hero title, player, modals
  components/AudioEngine.tsx  Single <audio> element synced with the player store
  components/               Music player, playlist, calendar, about and support modals
  store/playerStore.ts      Queue, shuffle, repeat and seek state (Zustand)
  services/r2Service.ts     Manifest loading and R2 URL encoding
  hooks/                    Playlists, Dhak audio, online presence, dynamic theme
  data/                     Site settings, Puja calendar, history facts
public/                     Wallpapers, logo, manifest, sitemap, robots.txt
```
