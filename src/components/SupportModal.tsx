import { useEffect, useRef } from 'react';
import { X, Coffee } from 'lucide-react';
import { APP_CONFIG } from '../data/mockData';

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

export function SupportModal({ open, onClose }: SupportModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const upiUri = `upi://pay?pa=${APP_CONFIG.supportUpi}&pn=Devi%20Aradhana&am=20&cu=INR`;

  // Crisp high-resolution QR vector SVG
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=10&format=svg&data=${encodeURIComponent(
    upiUri,
  )}`;

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
          padding: '30px 24px 24px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          borderRadius: '26px',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            transition: 'color 0.2s, background 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Coffee size={25} color="#ffffffff" />
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            Buy Me A Chai
          </h3>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '12.5px',
            color: 'rgba(255, 255, 255, 0.65)',
            lineHeight: 1.45,
            margin: '0 0 20px 0',
            maxWidth: '320px',
          }}
        >
          Liked the Pujo vibes? Treat us to a cup of chai. You bring the cha, we’ll bring more Pujo vibes, gaan, and adda.
        </p>

        {/* ── PREMIUM QR CODE CARD ── */}
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            padding: '14px',
            borderRadius: '20px',
            boxShadow:
              '0 20px 48px -8px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.9), 0 0 30px rgba(240, 192, 64, 0.18)',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            src={qrCodeUrl}
            alt="QR Code"
            style={{
              width: '190px',
              height: '190px',
              display: 'block',
              borderRadius: '10px',
            }}
          />
        </div>

        {/* Footer Note */}
        <div>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)', letterSpacing: '0.02em' }}>
            Scan with any UPI App.
          </span>
        </div>
      </div>
    </div>
  );
}
