import { FESTIVAL_DATE } from './pujaCalendar';

// Admin-configurable settings (songs come from the R2 manifest, Puja dates from pujaCalendar.ts)
export const APP_CONFIG = {
  heroTitle: 'পুজো\nআসছে',
  heroDayImage: '/back-day.png',
  heroNightImage: '/back-night.png',
  heroDayImageAlt: '/back1-day.png',
  heroNightImageAlt: '/back1-night.png',
  heroImage: '/back-night.png', // fallback
  dhakAudioUrl: 'audio/Dashami - Instrumental - Phani Natta.flac',
  festivalDate: FESTIVAL_DATE,
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
