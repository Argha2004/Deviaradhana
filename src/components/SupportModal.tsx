import { useEffect, useRef, useState } from 'react';
import { X, Heart, Copy, Check, Share2, Sparkles } from 'lucide-react';
import { APP_CONFIG } from '../data/mockData';

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

export function SupportModal({ open, onClose }: SupportModalProps) {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [shared, setShared] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const upiId = (APP_CONFIG as any).supportUpi || 'arghadeeppakhira@okaxis';

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

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2200);
    } catch {}
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Devi Pakhsa - Durga Puja FLAC Lossless Music',
      text: 'Listen to Durga Puja & Mahalaya songs in original FLAC lossless audio!',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2200);
      }
    } catch {}
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
          maxWidth: '480px',
          padding: '28px 24px 24px',
          position: 'relative',
        }}
      >
        {/* Close Button */}
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
            padding: '6px',
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
          <X size={17} />
        </button>

        {/* Top Heart Icon Badge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(240, 192, 64, 0.15)',
              border: '1.5px solid rgba(240, 192, 64, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f0c040',
              marginBottom: '12px',
              boxShadow: '0 0 24px rgba(240, 192, 64, 0.25)',
            }}
          >
            <Heart size={22} fill="rgba(240, 192, 64, 0.4)" strokeWidth={2.2} />
          </div>

          <h3
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 6px 0',
              letterSpacing: '-0.01em',
            }}
          >
            Support Devi Pakhsa
          </h3>

          <p
            style={{
              fontSize: '12.5px',
              color: 'rgba(255, 255, 255, 0.65)',
              lineHeight: 1.45,
              margin: 0,
              maxWidth: '380px',
            }}
          >
            Devi Pakhsa is a non-profit passion project created with love to bring high-fidelity lossless Durga Puja music to everyone. Your support helps keep servers running.
          </p>
        </div>

        {/* Support Options Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {/* UPI Option */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'rgba(74, 222, 128, 0.15)',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4ade80',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={16} />
              </div>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', display: 'block' }}>
                  UPI ID (GPay / PhonePe / Paytm)
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                  }}
                >
                  {upiId}
                </span>
              </div>
            </div>

            <button
              className={`copy-btn-inner ${copiedUpi ? 'copied' : ''}`}
              onClick={handleCopyUpi}
              style={{ flexShrink: 0 }}
              aria-label="Copy UPI ID"
            >
              {copiedUpi ? <Check size={12} /> : <Copy size={12} />}
              {copiedUpi ? 'COPIED' : 'COPY'}
            </button>
          </div>

          {/* Share with Friends */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'rgba(96, 165, 250, 0.15)',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60a5fa',
                  flexShrink: 0,
                }}
              >
                <Share2 size={16} />
              </div>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', display: 'block' }}>
                  Share with Family & Friends
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', display: 'block' }}>
                  Spread the festive joy of Durga Puja
                </span>
              </div>
            </div>

            <button
              className={`copy-btn-inner ${shared ? 'copied' : ''}`}
              onClick={handleShare}
              style={{ flexShrink: 0 }}
              aria-label="Share site"
            >
              {shared ? <Check size={12} /> : <Share2 size={12} />}
              {shared ? 'COPIED' : 'SHARE'}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)' }}>
            শুভ শারদীয়া ও শারদীয়ার প্রীতি ও শুভেচ্ছা! 🌸
          </span>
        </div>
      </div>
    </div>
  );
}
