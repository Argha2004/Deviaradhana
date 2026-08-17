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
        if (isPlayingDhak) {
          audio.play().catch(() => {});
        }
      } else {
        setIsPlayingDhak(false);
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    return () => {
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
      audio.pause();
      setIsPlayingDhak(false);
    } else {
      // Pause music player song so Dhak beats play with full clarity
      usePlayerStore.getState().pause();

      audio.play().then(() => {
        setIsPlayingDhak(true);
      }).catch((err) => {
        console.warn('Dhak audio play error:', err);
        // Try candidate paths
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


