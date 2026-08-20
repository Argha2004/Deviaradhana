import type { Song } from '../store/playerStore';

export interface R2Manifest {
  version?: string;
  updatedAt?: string;
  playlists: {
    durga?: R2SongInput[];
    mahalaya?: R2SongInput[];
    'mahalaya-songs'?: R2SongInput[];
    [key: string]: R2SongInput[] | undefined;
  };
}

export interface R2SongInput {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  coverArt?: string;
  audioUrl?: string;
  trackNumber?: number;
}

const R2_BASE_URL = (
  import.meta.env.VITE_R2_PUBLIC_URL || 'https://pub-3ec651b4d390400ebaeed267d6f69722.r2.dev'
).replace(/\/+$/, '');
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

/**
 * Resolves a key/path to a fully encoded Cloudflare R2 or CDN URL.
 * Properly percent-encodes spaces, parentheses, quotes, and special characters.
 */
export function resolveR2Url(pathOrUrl?: string): string {
  if (!pathOrUrl) return '';

  // Already a full HTTP or Data URL
  if (
    pathOrUrl.startsWith('http://') ||
    pathOrUrl.startsWith('https://') ||
    pathOrUrl.startsWith('data:')
  ) {
    try {
      const url = new URL(pathOrUrl);
      // Clean and encode the pathname while preserving domain
      const encodedPath = url.pathname
        .split('/')
        .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
        .join('/');
      return `${url.origin}${encodedPath}${url.search}`;
    } catch {
      return pathOrUrl;
    }
  }

  // Relative path to R2 bucket
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl.slice(1) : pathOrUrl;
  const encodedPath = cleanPath
    .split('/')
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join('/');

  if (!R2_BASE_URL) {
    return `/${encodedPath}`;
  }

  return `${R2_BASE_URL}/${encodedPath}`;
}

/**
 * Normalizes an R2 song object into our internal Song format with properly encoded URLs.
 */
export function formatR2Song(item: R2SongInput, index: number): Song {
  return {
    id: item.id || `r2-song-${index + 1}`,
    title: item.title || 'Untitled Track',
    artist: item.artist || 'Unknown Artist',
    duration: item.duration || 0,
    coverArt: resolveR2Url(item.coverArt),
    audioUrl: resolveR2Url(item.audioUrl),
    trackNumber: item.trackNumber ?? index + 1,
  };
}

/**
 * Fetches real playlist songs strictly from Cloudflare R2 bucket or backend API.
 */
export async function fetchR2Playlists(): Promise<{
  durga: Song[];
  mahalaya: Song[];
  'mahalaya-songs': Song[];
}> {
  // 1. If backend API is configured, fetch from API
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/playlists`);
      if (res.ok) {
        const data = await res.json();
        return {
          durga: (data.durga || []).map(formatR2Song),
          mahalaya: (data.mahalaya || []).map(formatR2Song),
          'mahalaya-songs': (data['mahalaya-songs'] || []).map(formatR2Song),
        };
      }
    } catch (err) {
      console.warn('Backend API request failed:', err);
    }
  }

  // 2. Fetch directly from Cloudflare R2 manifest (with Vercel CDN and dev proxy fallbacks)
  const timestamp = Date.now();
  const candidateUrls = [
    `${R2_BASE_URL}/manifest.json?t=${timestamp}`,
    `/manifest.json?t=${timestamp}`,
    `/r2-proxy/manifest.json?t=${timestamp}`,
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
      if (res.ok) {
        const manifest: R2Manifest = await res.json();
        const playlists = manifest.playlists || {};
        return {
          durga: (playlists.durga || []).map(formatR2Song),
          mahalaya: (playlists.mahalaya || []).map(formatR2Song),
          'mahalaya-songs': (playlists['mahalaya-songs'] || []).map(formatR2Song),
        };
      }
    } catch (e) {
      console.warn(`Fetch from ${url} failed, trying fallback...`, e);
    }
  }

  return { durga: [], mahalaya: [], 'mahalaya-songs': [] };
}
