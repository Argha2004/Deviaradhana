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
  heroImage: '/back-night.png', // fallback
  dhakAudioUrl: 'audio/Dashami - Instrumental - Phani Natta.flac',
  festivalDate: new Date('2026-10-17T00:00:00'),
  onlineCount: 0,
  contactEmail: 'arghadeeppakhira@gmail.com',
  creators: [
    {
      id: 'c1',
      name: 'Arghadeep Pakhira',
      photo: '/Photo new.jpg',
      linkedin: 'https://linkedin.com/in/arghadeep-pakhira/',
      instagram: 'https://www.instagram.com/ignore.py?igsh=eDltZGt2ZmEwc280',
    },
    // {
    //   id: 'c2',
    //   name: 'Ankita Chanda',
    //   photo: '/Ankita.png',
    //   linkedin: 'https://www.linkedin.com/in/ankita-chanda-b43b81359/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B9pvTVKUHRqqHl7MhHOAloQ%3D%3D',
    //   instagram: 'https://www.instagram.com/ankita_chanda2233/',
    // },
    // {
    //   id: 'c3',
    //   name: 'Shubham Bhunia',
    //   photo: '/shubham.jpeg',
    //   linkedin: 'https://www.linkedin.com/in/shubham-bhunia',
    //   instagram: 'https://www.instagram.com/the_foliage_4?igsh=OGVkMHZwemxodWlu',
    // },
  ],
};
