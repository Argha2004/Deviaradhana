import { useCallback, useEffect, useRef } from 'react';
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Repeat1,
  Music,
} from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { formatTime } from '../utils/helpers';

export function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isShuffle,
    repeatMode,
    togglePlay,
    next,
    previous,
    toggleShuffle,
    cycleRepeat,
    seek,
    setCurrentTime,
    setDuration,
  } = usePlayerStore();

  // Set duration from song data when song changes
  useEffect(() => {
    if (currentSong) {
      if (currentSong.duration) {
        setDuration(currentSong.duration);
      }
      seek(0);
      setCurrentTime(0);
    }
  }, [currentSong?.id]);

  // Simulate playback tick if audioUrl is missing or fallback
  const simRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (simRef.current) clearInterval(simRef.current);
    if (isPlaying && duration > 0 && !currentSong?.audioUrl) {
      simRef.current = setInterval(() => {
        const s = usePlayerStore.getState();
        if (!s.isPlaying) return;
        if (s.currentTime >= s.duration) {
          s.next();
        } else {
          s.setCurrentTime(s.currentTime + 0.25);
        }
      }, 250);
    }
    return () => {
      if (simRef.current) clearInterval(simRef.current);
    };
  }, [isPlaying, currentSong?.id, duration]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      const t = (val / 100) * duration;
      seek(t);
      setCurrentTime(t);
    },
    [duration, seek, setCurrentTime],
  );

  // ── Idle state — no song loaded ──
  if (!currentSong) {
    return (
      <div
        className="player-luxury-surface"
        style={{
          width: '100%',
          padding: '16px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          opacity: 0.65,
        }}
      >
        <Music size={16} className="text-amber-300 opacity-60" />
        <span
          style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.45)',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}
        >
          Select a song from Puja Radio or Mahalaya
        </span>
      </div>
    );
  }

  const artFallback =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><rect width="56" height="56" fill="#3a2a1a" rx="12"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="24">♪</text></svg>',
    );

  return (
    <div
      className="player-luxury-surface"
      style={{
        width: '100%',
        padding: '14px 18px 12px 14px',
      }}
    >
      {/* ── Top Row: Album Art + Song Metadata + Modern Minimalist Lossless Badge ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Album Artwork */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={currentSong.coverArt}
            alt={currentSong.title}
            loading="eager"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).src = artFallback;
            }}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '10px',
              objectFit: 'cover',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          />
        </div>

        {/* Title, Artist & Modern Apple-style Lossless Badge */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#ffffff',
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                letterSpacing: '0.01em',
              }}
            >
              {currentSong.title}
            </div>

            {/* MODERN MINIMALIST LOSSLESS BADGE */}
            <div
              className="lossless-badge"
              title="Lossless FLAC Master Quality Audio"
            >
              LOSSLESS
            </div>
          </div>

          <div style={{ marginTop: '3px' }}>
            <span
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.55)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: 400,
                display: 'block',
              }}
            >
              {currentSong.artist}
            </span>
          </div>
        </div>
      </div>

      {/* ── Middle: Golden Progress Bar & Timestamps ── */}
      <div style={{ marginTop: '10px', padding: '0 2px' }}>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          className="progress-bar"
          aria-label="Seek track position"
          style={{
            background: `linear-gradient(to right, #f59e0b 0%, #fbbf24 ${progress}%, rgba(255, 255, 255, 0.12) ${progress}%)`,
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '3px',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.40)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatTime(currentTime)}
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.40)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {duration > 0 ? formatTime(duration) : '--:--'}
          </span>
        </div>
      </div>

      {/* ── Bottom Controls: Shuffle / Prev / Play / Next / Repeat ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '6px',
        }}
      >
        <button
          className={`ctrl-btn ${isShuffle ? 'active' : ''}`}
          onClick={toggleShuffle}
          title={isShuffle ? 'Shuffle active' : 'Shuffle'}
          aria-label="Toggle shuffle"
        >
          <Shuffle size={15} />
        </button>

        <button
          className="ctrl-btn"
          onClick={previous}
          title="Previous track"
          aria-label="Previous track"
        >
          <SkipBack size={18} />
        </button>

        <button
          className="play-luxury-btn"
          onClick={togglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={18} fill="#1a1510" />
          ) : (
            <Play size={18} fill="#1a1510" style={{ marginLeft: '2px' }} />
          )}
        </button>

        <button
          className="ctrl-btn"
          onClick={next}
          title="Next track"
          aria-label="Next track"
        >
          <SkipForward size={18} />
        </button>

        <button
          className={`ctrl-btn ${repeatMode !== 'off' ? 'active' : ''}`}
          onClick={cycleRepeat}
          title={`Repeat: ${repeatMode}`}
          aria-label="Toggle repeat"
        >
          {repeatMode === 'one' ? <Repeat1 size={15} /> : <Repeat size={15} />}
        </button>
      </div>
    </div>
  );
}
