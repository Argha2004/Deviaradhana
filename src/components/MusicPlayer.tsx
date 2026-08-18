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

  useEffect(() => {
    if (currentSong) {
      if (currentSong.duration) setDuration(currentSong.duration);
      seek(0);
      setCurrentTime(0);
    }
  }, [currentSong?.id]);

  const simRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (simRef.current) clearInterval(simRef.current);
    if (isPlaying && duration > 0 && !currentSong?.audioUrl) {
      simRef.current = setInterval(() => {
        const s = usePlayerStore.getState();
        if (!s.isPlaying) return;
        if (s.currentTime >= s.duration) s.next();
        else s.setCurrentTime(s.currentTime + 0.25);
      }, 250);
    }
    return () => { if (simRef.current) clearInterval(simRef.current); };
  }, [isPlaying, currentSong?.id, duration]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const pct = x / rect.width;
      const t = pct * duration;
      seek(t);
      setCurrentTime(t);
    },
    [duration, seek, setCurrentTime],
  );

  // Idle state
  if (!currentSong) {
    return (
      <div className="np-surface" style={{ justifyContent: 'center', gap: '10px', opacity: 0.55 }}>
        <Music size={15} style={{ color: 'rgba(255,255,255,0.4)' }} />
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
          Select a song to play
        </span>
      </div>
    );
  }

  const artFallback =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><rect width="56" height="56" fill="#3a2a1a" rx="8"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="22">♪</text></svg>',
    );

  return (
    <div className="np-surface">
      {/* Progress track — thin bar at bottom */}
      <div
        className="np-progress-track"
        onClick={handleSeek}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="np-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Artwork */}
      <img
        src={currentSong.coverArt}
        alt={currentSong.title}
        className="np-art"
        loading="eager"
        decoding="async"
        onError={(e) => { (e.target as HTMLImageElement).src = artFallback; }}
      />

      {/* Song info */}
      <div className="np-info">
        <div className="np-title">{currentSong.title}</div>
        <div className="np-meta">
          <span className="np-artist">{currentSong.artist}</span>
        </div>
        <div className="np-time">
          {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : '--:--'}
        </div>
      </div>

      {/* Controls */}
      <div className="np-controls">
        <button
          className={`np-ctrl ${isShuffle ? 'on' : ''}`}
          onClick={toggleShuffle}
          aria-label="Shuffle"
        >
          <Shuffle size={16} />
        </button>
        <button className="np-ctrl" onClick={previous} aria-label="Previous">
          <SkipBack size={18} />
        </button>
        <button className="np-play" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: '2px' }} />}
        </button>
        <button className="np-ctrl" onClick={next} aria-label="Next">
          <SkipForward size={18} />
        </button>
        <button
          className={`np-ctrl ${repeatMode !== 'off' ? 'on' : ''}`}
          onClick={cycleRepeat}
          aria-label="Repeat"
        >
          {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
        </button>
      </div>
    </div>
  );
}
