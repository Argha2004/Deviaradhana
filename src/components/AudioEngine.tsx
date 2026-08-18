import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/playerStore';

/**
 * AudioEngine - Mounts once at the app root.
 * Syncs the HTML <audio> element with the Zustand player store for Cloudflare R2 streaming.
 * Integrates Web Media Session API for native Android, iOS, Windows, and macOS system notifications & lock screens.
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
    previous,
    togglePlay,
    seek,
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

  // ── Native Media Session API (Android, iOS, Windows Notifications & Lock Screen) ──
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    if (currentSong) {
      // Build absolute artwork URL for native mobile/desktop notification display
      const artUrl = currentSong.coverArt
        ? new URL(currentSong.coverArt, window.location.href).href
        : new URL('/icon-512.png', window.location.href).href;

      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album || 'Devi Pakhsa • Durga Puja',
        artwork: [
          { src: artUrl, sizes: '96x96', type: 'image/png' },
          { src: artUrl, sizes: '128x128', type: 'image/png' },
          { src: artUrl, sizes: '192x192', type: 'image/png' },
          { src: artUrl, sizes: '256x256', type: 'image/png' },
          { src: artUrl, sizes: '384x384', type: 'image/png' },
          { src: artUrl, sizes: '512x512', type: 'image/png' },
        ],
      });
    }

    // Register Native System Notification Action Handlers
    try {
      navigator.mediaSession.setActionHandler('play', () => {
        const audio = audioRef.current;
        if (audio && !isPlaying) {
          togglePlay();
        }
      });
    } catch {}

    try {
      navigator.mediaSession.setActionHandler('pause', () => {
        const audio = audioRef.current;
        if (audio && isPlaying) {
          togglePlay();
        }
      });
    } catch {}

    try {
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        previous();
      });
    } catch {}

    try {
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        next();
      });
    } catch {}

    try {
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && details.seekTime !== null) {
          seek(details.seekTime);
        }
      });
    } catch {}

    try {
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const audio = audioRef.current;
        if (audio) {
          const skip = details.seekOffset || 10;
          seek(Math.max(0, audio.currentTime - skip));
        }
      });
    } catch {}

    try {
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const audio = audioRef.current;
        if (audio) {
          const skip = details.seekOffset || 10;
          seek(Math.min(audio.duration || 9999, audio.currentTime + skip));
        }
      });
    } catch {}

    return () => {
      // Clear handlers
      try {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('seekto', null);
        navigator.mediaSession.setActionHandler('seekbackward', null);
        navigator.mediaSession.setActionHandler('seekforward', null);
      } catch {}
    };
  }, [currentSong?.id, currentSong?.title, currentSong?.artist, isPlaying]);

  // Update Media Session playback state
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [isPlaying]);

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

        // Update system notification progress position
        if (
          'mediaSession' in navigator &&
          'setPositionState' in navigator.mediaSession &&
          audio.duration &&
          !isNaN(audio.duration) &&
          isFinite(audio.duration) &&
          audio.duration > 0
        ) {
          try {
            navigator.mediaSession.setPositionState({
              duration: audio.duration,
              playbackRate: audio.playbackRate || 1.0,
              position: Math.min(audio.currentTime, audio.duration),
            });
          } catch {}
        }
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
