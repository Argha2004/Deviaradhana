import { useEffect, useRef } from 'react';
import { X, QrCode } from 'lucide-react';

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

export function SupportModal({ open, onClose }: SupportModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const upiUri = 'upi://pay?pa=arghadeeppakhira-1@oksbi&pn=Devi%20Aradhana&am=20&cu=INR';

  // Generate crisp QR code SVG via reliable generator API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&format=svg&data=${encodeURIComponent(
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
          maxWidth: '420px',
          padding: '32px 24px 28px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
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

        {/* Header Title */}
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#ffffff',
            margin: '0 0 8px 0',
            letterSpacing: '-0.01em',
          }}
        >
          Buy Me A Chai
        </h3>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.65)',
            lineHeight: 1.45,
            margin: '0 0 22px 0',
            maxWidth: '340px',
          }}
        >
          Liked the Pujo vibes? Treat us to a cup of chai. You bring the cha, we’ll bring more Pujo, gaan, and adda.
        </p>

        {/* ── QR CODE CARD ── */}
        <div
          style={{
            background: '#ffffff',
            padding: '14px',
            borderRadius: '20px',
            boxShadow: '0 10px 36px rgba(0, 0, 0, 0.55), 0 0 24px rgba(240, 192, 64, 0.12)',
            border: '2px solid rgba(255, 255, 255, 0.9)',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            src={qrCodeUrl}
            alt="Scan and Pay QR Code"
            style={{
              width: '190px',
              height: '190px',
              display: 'block',
              borderRadius: '8px',
            }}
          />

          <div
            style={{
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '0.02em',
            }}
          >
            <QrCode size={14} color="#0284c7" />
            <span>Scan and Pay</span>
          </div>
        </div>

        {/* Footer Note */}
        <div>
          <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.40)' }}>
            শুভ শারদীয়া ও শারদীয়ার প্রীতি ও শুভেচ্ছা! 🌸
          </span>
        </div>
      </div>
    </div>
  );
}
