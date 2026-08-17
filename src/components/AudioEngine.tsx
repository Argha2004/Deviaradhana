import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/playerStore';

/**
 * AudioEngine - Mounts once at the app root.
 * Syncs the HTML <audio> element with the Zustand player store for Cloudflare R2 streaming.
 */
export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    currentSong,
    isPlaying,
    volume,
    isMuted,
    repeatMode,
    seekTarget,
    clearSeekTarget,
    setCurrentTime,
    setDuration,
    next,
  } = usePlayerStore();

  // Create audio element once with optimal streaming attributes
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.autoplay = false;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Sync src when song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentSong?.audioUrl) {
      // Pause any ongoing playback first before setting new source
      audio.pause();
      audio.src = currentSong.audioUrl;
      audio.load();

      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            // Ignore abort errors caused by rapid track switching
            if (err.name !== 'AbortError') {
              console.warn('Playback error on track change:', err);
            }
          });
        }
      }
    } else {
      audio.pause();
      audio.src = '';
      if (currentSong?.duration) {
        setDuration(currentSong.duration);
      }
    }
  }, [currentSong?.id, currentSong?.audioUrl]);

  // Play / Pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== 'AbortError') {
            console.warn('Playback error:', err);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Volume / Mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // Seeking
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || seekTarget === null) return;

    if (isFinite(seekTarget) && audio.duration) {
      audio.currentTime = Math.min(Math.max(0, seekTarget), audio.duration);
    }
    clearSeekTarget();
  }, [seekTarget]);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (audio.currentTime !== undefined) {
        setCurrentTime(audio.currentTime);
      }
    };

    const onDurationChange = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        next();
      }
    };

    const onError = () => {
      if (audio.error && audio.src) {
        console.warn('Audio stream error code:', audio.error.code, audio.error.message);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('loadedmetadata', onDurationChange);
    audio.addEventListener('canplay', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('loadedmetadata', onDurationChange);
      audio.removeEventListener('canplay', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [repeatMode]);

  return null;
}
