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
 * Returns daytime or nighttime background photo based on local time.
 * Morning, Noon, Afternoon (5:00 AM - 5:59 PM) -> /back-day.png
 * Evening, Night (6:00 PM - 4:59 AM) -> /back-night.png
 */
export function getTimeBasedHeroImage(): string {
  const hour = new Date().getHours();
  const isDay = hour >= 5 && hour < 18;
  return isDay ? APP_CONFIG.heroDayImage : APP_CONFIG.heroNightImage;
}
