import { APP_CONFIG } from '../data/mockData';

/** Format seconds to mm:ss */
export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Calculate days until a date */
export function daysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/** Pad track number with leading zero */
export function trackNum(n: number): string {
  return n.toString().padStart(2, '0');
}

/**
 * Returns daytime or nighttime background photo based on local time and alternating days.
 * - Day 1 (even day count): Daytime -> back-day.png, Nighttime -> back-night.png
 * - Day 2 (odd day count):  Daytime -> back1-day.png, Nighttime -> back1-night.png
 * Daytime is 5:00 AM - 5:59 PM (hours 5 to 17), Nighttime is 6:00 PM - 4:59 AM.
 */
export function getTimeBasedHeroImage(): string {
  const now = new Date();
  const hour = now.getHours();
  const isDay = hour >= 5 && hour < 18;

  // Calculate day index based on local calendar day (days since epoch in local time)
  const localMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dayIndex = Math.floor(localMidnight / (1000 * 60 * 60 * 24));
  const isAlternateDay = Math.abs(dayIndex) % 2 === 1;

  if (isAlternateDay) {
    return isDay ? APP_CONFIG.heroDayImageAlt : APP_CONFIG.heroNightImageAlt;
  }

  return isDay ? APP_CONFIG.heroDayImage : APP_CONFIG.heroNightImage;
}
