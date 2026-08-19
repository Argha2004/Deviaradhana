import type { Song } from '../store/playerStore';

// ──────────────────────────────────────────────────────────────
// All playlists are empty — songs will be added from the backend.
// ──────────────────────────────────────────────────────────────

export const DURGA_PUJA_SONGS: Song[] = [];
export const MAHALAYA_FULL: Song[] = [];
export const MAHALAYA_SONGS: Song[] = [];

// Admin-configurable settings
export const APP_CONFIG = {
  heroTitle: 'পুজো\nআসছে',
  heroDayImage: '/back-day.png',
  heroNightImage: '/back-night.png',
  heroDayImageAlt: '/back1-day.png',
  heroNightImageAlt: '/back1-night.png',
  heroImage: '/back-night.png', // fallback
  dhakAudioUrl: 'audio/Dashami - Instrumental - Phani Natta.flac',
  festivalDate: new Date('2026-10-17T00:00:00'),
  onlineCount: 0,
  contactEmail: 'arghadeeppakhira@gmail.com',
  supportUpi: 'arghadeeppakhira-1@oksbi',
  creators: [
    {
      id: 'c1',
      name: 'Arghadeep Pakhira',
      photo: '/Photo new.jpg',
      linkedin: 'https://linkedin.com/in/arghadeep-pakhira/',
      instagram: 'https://www.instagram.com/ignore.py?igsh=eDltZGt2ZmEwc280',
    }
  ],
};
