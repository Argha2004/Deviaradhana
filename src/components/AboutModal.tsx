import { useEffect, useRef, useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { APP_CONFIG } from '../data/mockData';

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

/* ── Social Icons ──────────────────────────────────────────── */
const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

/* ── Creator Card ──────────────────────────────────────────── */
function CreatorCard({ creator }: { creator: typeof APP_CONFIG.creators[0] }) {
  const artFallback =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72"><rect width="72" height="72" fill="#3a3a3a" rx="36"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="30">👤</text></svg>',
    );

  return (
    <div
      className="creator-card"
      style={{
        width: '100%',
        maxWidth: APP_CONFIG.creators.length === 1 ? '220px' : '150px',
        margin: '0 auto',
      }}
    >
      <img
        src={creator.photo}
        alt={creator.name}
        onError={(e) => {
          (e.target as HTMLImageElement).src = artFallback;
        }}
        style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid rgba(255,255,255,0.12)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          background: 'rgba(255,255,255,0.05)',
        }}
      />
      <span
        style={{
          fontSize: '13.5px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.92)',
          textAlign: 'center',
          letterSpacing: '0.01em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}
      >
        {creator.name}
      </span>
      <div style={{ display: 'flex', gap: '8px' }}>
        {creator.linkedin && (
          <a
            href={creator.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
            aria-label={`${creator.name} LinkedIn`}
          >
            <LinkedInIcon />
          </a>
        )}
        {creator.instagram && (
          <a
            href={creator.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
            aria-label={`${creator.name} Instagram`}
          >
            <InstagramIcon />
          </a>
        )}
      </div>
    </div>
  );
}

/* ── About Modal ───────────────────────────────────────────── */
export function AboutModal({ open, onClose }: AboutModalProps) {
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(APP_CONFIG.contactEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* fallback */
    }
  };

  if (!open) return null;

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
          maxWidth: '400px',
          padding: '28px 22px 22px',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
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

        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.16em',
            color: 'rgba(255,255,255,0.48)',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          Made with Bhalobasha by
        </div>

        {/* Creator cards - Centered layout */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '22px',
            flexWrap: 'wrap',
          }}
        >
          {APP_CONFIG.creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>

        {/* Separator */}
        <div
          style={{
            width: '40px',
            height: '1px',
            background: 'rgba(255,255,255,0.08)',
            margin: '0 auto 18px',
          }}
        />

        {/* Contact */}
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: '12.5px',
              color: 'rgba(255,255,255,0.40)',
              marginBottom: '12px',
              fontWeight: 400,
            }}
          >
            Want to get in touch?
          </p>
          <div
            className="copy-row"
            style={{ maxWidth: '340px', width: '100%', margin: '0 auto' }}
          >
            <span className="copy-email">{APP_CONFIG.contactEmail}</span>
            <button
              className={`copy-btn-inner ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              aria-label="Copy email address"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'COPY'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
