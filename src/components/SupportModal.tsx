import { useEffect, useRef, useState } from 'react';
import { X, Copy, Check, Share2, ExternalLink, QrCode, Sparkles } from 'lucide-react';

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

export function SupportModal({ open, onClose }: SupportModalProps) {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [shared, setShared] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const upiUri = 'upi://pay?pa=arghadeeppakhira-1@oksbi&pn=Devi%20Paksha&am=20&cu=INR';
  const upiId = 'arghadeeppakhira-1@oksbi';

  // Generate crisp QR code SVG via reliable generator API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=6&format=svg&data=${encodeURIComponent(
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
          maxWidth: '440px',
          padding: '28px 22px 22px',
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

        {/* Chai / Coffee Header */}
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'rgba(240, 192, 64, 0.15)',
            border: '1.5px solid rgba(240, 192, 64, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            marginBottom: '10px',
            boxShadow: '0 0 24px rgba(240, 192, 64, 0.25)',
          }}
        >
          ☕
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
          Buy Me A Chai
        </h3>

        <p
          style={{
            fontSize: '12.5px',
            color: 'rgba(255, 255, 255, 0.65)',
            lineHeight: 1.45,
            margin: '0 0 18px 0',
            maxWidth: '360px',
          }}
        >
          Liked the Pujo vibes? Treat us to a cup of chai. You bring the cha, we’ll bring more Pujo, gaan, and adda.
        </p>

        {/* ── QR CODE CARD ── */}
        <div
          style={{
            background: '#ffffff',
            padding: '12px',
            borderRadius: '18px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(240, 192, 64, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            marginBottom: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            src={qrCodeUrl}
            alt="Devi Paksha UPI QR Code"
            style={{
              width: '180px',
              height: '180px',
              display: 'block',
              borderRadius: '8px',
            }}
          />

          <div
            style={{
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#1e293b',
              letterSpacing: '0.02em',
            }}
          >
            <QrCode size={13} color="#0284c7" />
            <span>Scan with any UPI App (₹20)</span>
          </div>
        </div>

        {/* Mobile Direct Pay Button (Opens GPay / PhonePe / Paytm / BHIM) */}
        <a
          href={upiUri}
          className="pill-btn"
          style={{
            width: '100%',
            maxWidth: '280px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: 'rgba(240, 192, 64, 0.22)',
            border: '1.5px solid rgba(240, 192, 64, 0.65)',
            borderRadius: '999px',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '12.5px',
            textDecoration: 'none',
            marginBottom: '14px',
            boxShadow: '0 4px 18px rgba(240, 192, 64, 0.25)',
          }}
        >
          <Sparkles size={14} color="#f0c040" />
          <span>Pay ₹20 via UPI App</span>
          <ExternalLink size={13} color="rgba(255,255,255,0.7)" />
        </a>

        {/* UPI Copy Box & Share */}
        <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '340px', marginBottom: '14px' }}>
          <div
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '12px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.85)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontFamily: 'monospace',
              }}
            >
              {upiId}
            </span>
            <button
              className={`copy-btn-inner ${copiedUpi ? 'copied' : ''}`}
              onClick={handleCopyUpi}
              style={{ padding: '3px 7px', fontSize: '9.5px', flexShrink: 0 }}
              aria-label="Copy UPI ID"
            >
              {copiedUpi ? <Check size={10} /> : <Copy size={10} />}
              {copiedUpi ? 'COPIED' : 'COPY'}
            </button>
          </div>

          <button
            className={`copy-btn-inner ${shared ? 'copied' : ''}`}
            onClick={handleShare}
            style={{
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            aria-label="Share site"
          >
            {shared ? <Check size={12} /> : <Share2 size={12} />}
            {shared ? 'COPIED' : 'SHARE'}
          </button>
        </div>

        {/* Footer Note */}
        <div>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)' }}>
            শুভ শারদীয়া ও শারদীয়ার প্রীতি ও শুভেচ্ছা! 🌸
          </span>
        </div>
      </div>
    </div>
  );
}
