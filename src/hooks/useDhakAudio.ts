import { useState, useEffect, useRef, useCallback } from 'react';
import { resolveR2Url } from '../services/r2Service';
import { APP_CONFIG } from '../data/mockData';
import { usePlayerStore } from '../store/playerStore';

const DHAK_CANDIDATE_PATHS = [
  APP_CONFIG.dhakAudioUrl,
  'audio/dhak.mp3',
  'audio/dhak.flac',
  'audio/dhak.wav',
  'dhak.mp3',
  'dhak.flac',
  'dhak.wav',
  'audio/Dhak.mp3',
  'audio/Dhak.flac',
  'audio/Dhak.wav',
  'Dhak.mp3',
  'Dhak.flac',
  'Dhak.wav',
].filter(Boolean) as string[];

export function useDhakAudio() {
  const [isPlayingDhak, setIsPlayingDhak] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const candidateIndexRef = useRef<number>(0);
  // Whether the user wants the Dhak playing; read by the error fallback, which outlives any render
  const wantsPlayRef = useRef(false);

  useEffect(() => {
    candidateIndexRef.current = 0;
    const initialUrl = resolveR2Url(DHAK_CANDIDATE_PATHS[0]);
    const audio = new Audio(initialUrl);
    audio.preload = 'auto';
    audio.loop = true;
    audioRef.current = audio;

    const onPlay = () => setIsPlayingDhak(true);
    const onPause = () => setIsPlayingDhak(false);

    const onError = () => {
      // Try next pure Dhak candidate path on Cloudflare R2
      candidateIndexRef.current += 1;
      if (candidateIndexRef.current < DHAK_CANDIDATE_PATHS.length) {
        const nextUrl = resolveR2Url(DHAK_CANDIDATE_PATHS[candidateIndexRef.current]);
        audio.src = nextUrl;
        audio.load();
        if (wantsPlayRef.current) {
          audio.play().catch(() => {});
        }
      } else {
        wantsPlayRef.current = false;
        setIsPlayingDhak(false);
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    // Stop the Dhak whenever a song starts so the two never play over each other
    const unsubscribe = usePlayerStore.subscribe((state, prev) => {
      if (state.isPlaying && !prev.isPlaying) {
        wantsPlayRef.current = false;
        audio.pause();
      }
    });

    return () => {
      unsubscribe();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggleDhak = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlayingDhak) {
      wantsPlayRef.current = false;
      audio.pause();
      setIsPlayingDhak(false);
    } else {
      // Pause music player song so Dhak beats play with full clarity
      usePlayerStore.getState().pause();
      wantsPlayRef.current = true;

      audio.play().then(() => {
        setIsPlayingDhak(true);
      }).catch((err) => {
        // A source change aborts the pending play; the error listener is already trying the next candidate
        if (err.name === 'AbortError' || candidateIndexRef.current < DHAK_CANDIDATE_PATHS.length) return;
        console.warn('Dhak audio play error:', err);
        // Every candidate failed earlier, so start over from the first one
        candidateIndexRef.current = 0;
        const nextUrl = resolveR2Url(DHAK_CANDIDATE_PATHS[0]);
        audio.src = nextUrl;
        audio.load();
        audio.play().then(() => setIsPlayingDhak(true)).catch(() => {});
      });
    }
  }, [isPlayingDhak]);

  return { isPlayingDhak, toggleDhak };
}


