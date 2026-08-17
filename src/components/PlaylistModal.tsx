import { useEffect, useRef, useState } from 'react';
import { X, Music, Loader2, RefreshCw } from 'lucide-react';
import type { Song } from '../store/playerStore';
import { usePlayerStore } from '../store/playerStore';
import { usePlaylists } from '../hooks/usePlaylists';
import { formatTime, trackNum } from '../utils/helpers';

type Tab = 'durga' | 'mahalaya' | 'mahalaya-songs';

interface PlaylistModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: Tab;
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'durga', label: 'DURGA PUJA' },
  { id: 'mahalaya', label: 'MAHALAYA' },
  { id: 'mahalaya-songs', label: 'MAHALAYA SONGS' },
];

const TAB_DESC: Record<Tab, string> = {
  durga: 'The main curated Durga Puja playlist fetched from Developer Storage.',
  mahalaya: 'The complete traditional Mahalaya broadcast, in full.',
  'mahalaya-songs': '19 sections of classic Mahalaya recordings.',
};

/* ── Song Row ─────────────────────────────────────────────── */
function SongRow({
  song,
  index,
  active,
  onClick,
}: {
  song: Song;
  index: number;
  active: boolean;
  onClick: () => void;
}) {
  const artFallback =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#3a2a1a" rx="8"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="17">♪</text></svg>',
    );

  return (
    <button
      className={`song-row ${active ? 'active' : ''}`}
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '9px 12px',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        textAlign: 'left',
        color: 'inherit',
        font: 'inherit',
        animationDelay: `${Math.min(index, 20) * 0.03}s`,
      }}
    >
      {/* Track # */}
      <span
        style={{
          width: '24px',
          textAlign: 'right',
          fontSize: '12px',
          fontWeight: 500,
          color: active ? 'var(--accent-gold-dim)' : 'rgba(255,255,255,0.28)',
          fontVariantNumeric: 'tabular-nums',
          flexShrink: 0,
        }}
      >
        {trackNum(index + 1)}
      </span>

      {/* Art */}
      <img
        src={song.coverArt}
        alt=""
        loading="lazy"
        decoding="async"
        onError={(e) => {
          (e.target as HTMLImageElement).src = artFallback;
        }}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          objectFit: 'cover',
          flexShrink: 0,
          background: 'rgba(255,255,255,0.06)',
        }}
      />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '13.5px',
            fontWeight: 500,
            color: active ? 'var(--accent-gold)' : 'rgba(255,255,255,0.88)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.3,
          }}
        >
          {song.title}
        </div>
        <div
          style={{
            fontSize: '11.5px',
            color: 'rgba(255,255,255,0.40)',
            marginTop: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {song.artist}
        </div>
      </div>

      {/* Duration */}
      <span
        style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.34)',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 400,
          flexShrink: 0,
        }}
      >
        {song.duration > 0 ? formatTime(song.duration) : '--:--'}
      </span>
    </button>
  );
}

/* ── Skeletons ────────────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 12px' }}>
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 0',
            opacity: 0.4,
          }}
        >
          <div style={{ width: '24px', height: '14px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
          <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ width: '60%', height: '14px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
            <div style={{ width: '35%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
          </div>
          <div style={{ width: '30px', height: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }} />
        </div>
      ))}
    </div>
  );
}

/* ── Empty & Error States ─────────────────────────────────── */
function EmptyState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <div className="empty-state">
      <Music size={28} />
      <p style={{ fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>No songs found</p>
      <p style={{ fontSize: '12px', opacity: 0.7, maxWidth: '280px', margin: '0 auto' }}>
        Contact with Developer for uploading Songs.
      </p>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="pill-btn"
          style={{ marginTop: '12px', padding: '6px 14px', fontSize: '11px' }}
        >
          <RefreshCw size={12} />
          Check Again
        </button>
      )}
    </div>
  );
}

/* ── Modal ────────────────────────────────────────────────── */
export function PlaylistModal({ open, onClose, initialTab = 'durga' }: PlaylistModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { currentSong, playSong } = usePlayerStore();
  const { data: playlists, isLoading, isError, refetch } = usePlaylists();

  useEffect(() => {
    if (open) setActiveTab(initialTab);
  }, [open, initialTab]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const currentList = playlists?.[activeTab] || [];

  return (
    <div
      ref={overlayRef}
      className="modal-overlay animate-overlay"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="animate-modal modal-surface"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '82vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: 'rgba(255,255,255,0.65)',
                textTransform: 'uppercase',
              }}
            >
              Playlists
            </span>
            {isLoading && <Loader2 size={12} className="animate-spin text-amber-400 opacity-60" />}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.40)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '50%',
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.40)';
              e.currentTarget.style.background = 'transparent';
            }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Tabs (Horizontally Scrollable on Mobile) ── */}
        <div className="modal-tabs-container" style={{ flexShrink: 0 }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Description ── */}
        <div
          style={{
            padding: '10px 20px 4px',
            fontSize: '11.5px',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.35)',
            lineHeight: 1.45,
            flexShrink: 0,
          }}
        >
          {TAB_DESC[activeTab]}
        </div>

        {/* ── Song list ── */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: '6px 8px 16px',
          }}
        >
          {isLoading ? (
            <LoadingSkeleton />
          ) : isError || currentList.length === 0 ? (
            <EmptyState onRefresh={() => refetch()} />
          ) : (
            currentList.map((song, i) => (
              <SongRow
                key={song.id}
                song={song}
                index={i}
                active={currentSong?.id === song.id}
                onClick={() => playSong(song, currentList, i)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
