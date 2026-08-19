import { useEffect, useState } from 'react';
import { Menu, Users, Disc, Coffee } from 'lucide-react';
import { APP_CONFIG } from '../data/mockData';
import { daysUntil, getTimeBasedHeroImage } from '../utils/helpers';
import { useOnlinePresence } from '../hooks/useOnlinePresence';
import { useDynamicTheme } from '../hooks/useDynamicTheme';
import { useDhakAudio } from '../hooks/useDhakAudio';
import { MusicPlayer } from '../components/MusicPlayer';
import { PlaylistModal } from '../components/PlaylistModal';
import { AboutModal } from '../components/AboutModal';
import { SupportModal } from '../components/SupportModal';
import { CalendarModal } from '../components/CalendarModal';

/* ─── Clock (PC Desktop Top Left) ────────────────────────── */
function Clock({ onClick }: { onClick?: () => void }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'pm' : 'am';
      const h12 = h % 12 || 12;
      setTime(`${h12}:${m} ${ampm}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <button
      onClick={onClick}
      className="glass-pill select-none desktop-only"
      title="Durga Puja 2026 Calendar"
      aria-label="Durga Puja Calendar"
      style={{
        fontSize: '13.5px',
        fontWeight: 600,
        color: '#ffffff',
        letterSpacing: '0.03em',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        whiteSpace: 'nowrap',
        padding: '7px 18px',
        cursor: 'pointer',
        border: '1.5px solid var(--dyn-glass-border)',
        background: 'var(--dyn-glass-pill)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <span>{time}</span>
    </button>
  );
}

/* ─── Online Badge (Mobile Top Left) ──────────────────────── */
function OnlineBadge({ onClick }: { onClick?: () => void }) {
  const onlineCount = useOnlinePresence();

  return (
    <button
      onClick={onClick}
      className="glass-pill mobile-only select-none"
      title="Durga Puja 2026 Calendar"
      aria-label="Durga Puja Calendar"
      style={{
        display: 'none',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 0.90)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
        padding: '6px 12px',
        cursor: 'pointer',
        border: '1.5px solid var(--dyn-glass-border)',
        background: 'var(--dyn-glass-pill)',
      }}
    >
      <span
        className="pulse-dot"
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: '#4ade80',
          display: 'inline-block',
          flexShrink: 0,
          boxShadow: '0 0 6px rgba(74, 222, 128, 0.6)',
        }}
      />
      <span>{onlineCount} online</span>
    </button>
  );
}

/* ─── Status Pill (PC Desktop Top Center) ─────────────────── */
function StatusPill() {
  const days = daysUntil(APP_CONFIG.festivalDate);
  const onlineCount = useOnlinePresence();

  return (
    <div
      className="glass-pill select-none desktop-only"
      style={{
        alignItems: 'center',
        gap: '12px',
        fontSize: '13.5px',
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 0.90)',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
        padding: '8px 22px',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <span
          className="pulse-dot"
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#4ade80',
            display: 'inline-block',
            flexShrink: 0,
            boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)',
          }}
        />
        <span>{onlineCount} online</span>
      </span>
      <span style={{ color: 'rgba(255, 255, 255, 0.25)' }}>|</span>
      <span>{days} days until Durga Pujo</span>
    </div>
  );
}

/* ─── Top Right Controls ─────────────────────────────────── */
function TopControls({
  onPlaylist,
  onSupport,
  onAbout,
}: {
  onPlaylist: () => void;
  onSupport: () => void;
  onAbout: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexShrink: 0,
      }}
    >
      <button
        className="icon-circle"
        onClick={onPlaylist}
        title="Playlists"
        aria-label="Open playlists"
      >
        <Menu size={18} strokeWidth={2.2} />
      </button>

      {/* Merged Profile & Chai Support Pill */}
      <div
        className="profile-support-pill"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          height: '38px',
          padding: '0 16px',
          background: 'var(--dyn-glass-pill)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '2px solid var(--dyn-glass-border)',
          borderRadius: '999px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
        }}
      >
        <button
          onClick={onAbout}
          title="About & Creators"
          aria-label="About"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'rgba(255, 255, 255, 0.90)',
            transition: 'color 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'scale(1.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.90)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Users size={18} strokeWidth={2.2} />
        </button>

        <button
          onClick={onSupport}
          title="Buy Me A Chai"
          aria-label="Buy Me A Chai"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'rgba(255, 255, 255, 0.90)',
            transition: 'color 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f0c040';
            e.currentTarget.style.transform = 'scale(1.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.90)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Coffee size={18} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}

/* ─── Unified Top Navbar (PC 3-Column / Mobile 2-Sided) ──── */
function TopNavbar({
  onPlaylist,
  onSupport,
  onAbout,
  onCalendar,
}: {
  onPlaylist: () => void;
  onSupport: () => void;
  onAbout: () => void;
  onCalendar: () => void;
}) {
  return (
    <header className="top-navbar animate-slide-up">
      {/* Left Item: Clock on PC, OnlineBadge on Mobile */}
      <div className="top-navbar-left">
        <Clock onClick={onCalendar} />
        <OnlineBadge onClick={onCalendar} />
      </div>

      {/* Center Item: Status Pill on PC Desktop */}
      <div className="top-navbar-center">
        <StatusPill />
      </div>

      {/* Right Item: Playlist, Support & About buttons */}
      <div className="top-navbar-right">
        <TopControls onPlaylist={onPlaylist} onSupport={onSupport} onAbout={onAbout} />
      </div>
    </header>
  );
}

/* ─── Bengali Hero Title (With Mobile Countdown & Audio Disclaimer) ─ */
function HeroTitle() {
  const lines = APP_CONFIG.heroTitle.split('\n');
  const days = daysUntil(APP_CONFIG.festivalDate);

  return (
    <div
      className="hero-title-container"
      style={{
        textAlign: 'center',
        userSelect: 'none',
        width: '100%',
        maxWidth: '1800px',
        padding: '8px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className="hero-title-text font-bengali animate-slide-up"
          style={{
            fontSize: 'clamp(56px, 14.5vw, 118px)',
            fontWeight: 400,
            color: '#f0c040',
            lineHeight: 1.1,
            letterSpacing: '0.01em',
            textShadow:
              '0 4px 30px rgba(0, 0, 0, 0.55), 0 2px 12px rgba(0, 0, 0, 0.75), 0 0 40px rgba(240, 192, 64, 0.35)',
            animationDelay: `${i * 0.08}s`,
          }}
        >
          {line}
        </div>
      ))}

      {/* Countdown Text directly beneath title — Mobile Only */}
      <p
        className="mobile-only animate-slide-up"
        style={{
          marginTop: '6px',
          fontSize: '14px',
          letterSpacing: '0.02em',
          animationDelay: '0.18s',
          textShadow: '0 2px 12px rgba(0, 0, 0, 0.85)',
          color: 'rgba(255, 255, 255, 0.90)',
        }}
      >
        <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '15px' }}>{days}</span>
        <span>&nbsp;days until Durga Pujo</span>
      </p>
    </div>
  );
}

/* ─── Bottom Controls Block (Responsive Bottom Center) ────── */
function BottomBlock({
  onPlaylist,
  isPlayingDhak,
  onToggleDhak,
}: {
  onPlaylist: () => void;
  isPlayingDhak: boolean;
  onToggleDhak: () => void;
}) {
  return (
    <div
      className="bottom-block-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        maxWidth: '540px',
        margin: '0 auto',
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      {/* Audio Quality Disclaimer (No container background) */}
      <p
        className="audio-flac-disclaimer"
        style={{
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.65)',
          letterSpacing: '0.02em',
          textAlign: 'center',
          margin: 0,
          padding: '0 12px',
          lineHeight: 1.35,
          textShadow: '0 1px 8px rgba(0, 0, 0, 0.85), 0 2px 16px rgba(0, 0, 0, 0.7)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        All songs are fetched from self-hosted server &bull; Original FLAC 44.1kHz 16-Bit
      </p>

      {/* Action pill buttons */}
      <div className="bottom-pills-row" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          className="pill-btn"
          onClick={onPlaylist}
          aria-label="Open Puja Radio playlist"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          DURGA PUJA
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* DHAK Button: Streams Cloudflare R2 Dhak Beat (Visible on Desktop) */}
        <button
          className={`pill-btn pill-btn-dhak-top ${isPlayingDhak ? 'active' : ''}`}
          onClick={onToggleDhak}
          title={isPlayingDhak ? 'Pause Dhak' : 'Play Dhak sound'}
          aria-label="Festive Dhak Percussion"
          style={
            isPlayingDhak
              ? {
                background: 'rgba(240, 192, 64, 0.28)',
                borderColor: 'rgba(240, 192, 64, 0.75)',
                color: '#ffffff',
                boxShadow: '0 0 20px rgba(240, 192, 64, 0.45)',
              }
              : undefined
          }
        >
          <Disc
            size={13}
            strokeWidth={2.2}
            className={isPlayingDhak ? 'animate-spin text-amber-300' : ''}
          />
          {isPlayingDhak ? 'DHAK PLAYING' : 'DHAK'}
        </button>
      </div>

      {/* Music player */}
      <MusicPlayer isPlayingDhak={isPlayingDhak} onToggleDhak={onToggleDhak} />
    </div>
  );
}

/* ─── HomePage ────────────────────────────────────────────── */
export function HomePage() {
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [heroImage, setHeroImage] = useState(() => getTimeBasedHeroImage());
  const { isPlayingDhak, toggleDhak } = useDhakAudio();

  // Periodically check and update hero image on day/night transitions
  useEffect(() => {
    const update = () => {
      const current = getTimeBasedHeroImage();
      setHeroImage((prev) => (prev !== current ? current : prev));
    };
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  // Initialize dynamic theme extraction for background glass tints matching active day/night hero image
  useDynamicTheme(heroImage);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        minHeight: '100dvh',
        overflow: 'hidden',
      }}
    >
      {/* Hero background (Day/Night time-based) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
          transition: 'background-image 0.8s ease-in-out',
        }}
      />

      {/* Atmospheric Dark & Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(10,8,6,0.12) 0%, rgba(10,8,6,0.38) 100%)',
          zIndex: 1,
        }}
      />

      {/* Fully Responsive Main UI Layer */}
      <div
        className="app-main-layout"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding:
            'max(14px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(18px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Navbar */}
        <TopNavbar
          onPlaylist={() => setPlaylistOpen(true)}
          onSupport={() => setSupportOpen(true)}
          onAbout={() => setAboutOpen(true)}
          onCalendar={() => setCalendarOpen(true)}
        />

        {/* Center Hero Section (Elevated Upper Sky Position) */}
        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            minHeight: '0',
            width: '100%',
            paddingTop: 'clamp(10px, 3.5vh, 48px)',
          }}
        >
          <HeroTitle />
        </div>

        {/* Bottom Actions & Player */}
        <BottomBlock
          onPlaylist={() => setPlaylistOpen(true)}
          isPlayingDhak={isPlayingDhak}
          onToggleDhak={toggleDhak}
        />
      </div>

      {/* Modals */}
      <PlaylistModal open={playlistOpen} onClose={() => setPlaylistOpen(false)} />
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <CalendarModal open={calendarOpen} onClose={() => setCalendarOpen(false)} />
    </div>
  );
}
