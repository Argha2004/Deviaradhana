import { useEffect, useRef } from 'react';
import { X, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

interface CalendarModalProps {
  open: boolean;
  onClose: () => void;
}

interface PujaDay {
  id: string;
  nameBn: string;
  nameEn: string;
  dateStr: string;
  date: Date;
  weekday: string;
  significance: string;
}

const PUJA_DAYS_2026: PujaDay[] = [
  {
    id: 'mahalaya',
    nameBn: 'মহালয়া',
    nameEn: 'Mahalaya',
    dateStr: '11 Oct 2026',
    date: new Date('2026-10-11T00:00:00'),
    weekday: 'Sunday (রবিবার)',
    significance: 'দেবীপক্ষের সূচনা ও পিতৃ তর্পণ',
  },
  {
    id: 'sasthi',
    nameBn: 'মহা ষষ্ঠী',
    nameEn: 'Maha Sasthi',
    dateStr: '17 Oct 2026',
    date: new Date('2026-10-17T00:00:00'),
    weekday: 'Saturday (শনিবার)',
    significance: 'দেবীর বোধন ও আমন্ত্রণ',
  },
  {
    id: 'saptami',
    nameBn: 'মহা সপ্তমী',
    nameEn: 'Maha Saptami',
    dateStr: '18 Oct 2026',
    date: new Date('2026-10-18T00:00:00'),
    weekday: 'Sunday (রবিবার)',
    significance: 'নবপত্রিকা প্রবেশ ও প্রাণ প্রতিষ্ঠা',
  },
  {
    id: 'asthami',
    nameBn: 'মহা অষ্টমী',
    nameEn: 'Maha Ashtami',
    dateStr: '19 Oct 2026',
    date: new Date('2026-10-19T00:00:00'),
    weekday: 'Monday (সোমবার)',
    significance: 'সন্ধিপূজা ও কুমারী পূজা',
  },
  {
    id: 'nabami',
    nameBn: 'মহা নবমী',
    nameEn: 'Maha Nabami',
    dateStr: '20 Oct 2026',
    date: new Date('2026-10-20T00:00:00'),
    weekday: 'Tuesday (মঙ্গলবার)',
    significance: 'নবমী হোম ও আরতি',
  },
  {
    id: 'dasami',
    nameBn: 'বিজয়া দশমী',
    nameEn: 'Bijoya Dashami',
    dateStr: '21 Oct 2026',
    date: new Date('2026-10-21T00:00:00'),
    weekday: 'Wednesday (বুধবার)',
    significance: 'দেবী বিসর্জন ও বিজয়ার শুভেচ্ছা',
  },
];

function getRelativeStatus(targetDate: Date): { text: string; isPast: boolean; isToday: boolean } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
  const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { text: 'Today', isPast: false, isToday: true };
  if (diffDays < 0) return { text: 'Passed', isPast: true, isToday: false };
  if (diffDays === 1) return { text: 'Tomorrow', isPast: false, isToday: false };
  return { text: `In ${diffDays} days`, isPast: false, isToday: false };
}

export function CalendarModal({ open, onClose }: CalendarModalProps) {
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
          maxWidth: '430px',
          padding: '26px 22px 22px',
          position: 'relative',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.60)',
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
            e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.60)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: '#f0c040',
              marginBottom: '4px',
            }}
          >
            <CalendarIcon size={18} />
            <Sparkles size={14} />
          </div>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 4px 0',
              letterSpacing: '-0.01em',
            }}
          >
            দুর্গাপূজা ক্যালেন্ডার ২০২৬
          </h3>
          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)', margin: 0 }}>
            Durga Puja 2026 Dates & Schedule
          </p>
        </div>

        {/* Dates List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {PUJA_DAYS_2026.map((day) => {
            const rel = getRelativeStatus(day.date);
            const isHighlight = day.id === 'sasthi' || day.id === 'asthami';

            return (
              <div
                key={day.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  background: isHighlight ? 'rgba(240, 192, 64, 0.12)' : 'rgba(255, 255, 255, 0.08)',
                  border: isHighlight
                    ? '1.5px solid rgba(240, 192, 64, 0.35)'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  transition: 'transform 0.2s, background 0.2s',
                }}
              >
                {/* Left info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: isHighlight ? '#fef08a' : '#ffffff',
                      }}
                    >
                      {day.nameBn}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.50)' }}>
                      • {day.nameEn}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)' }}>
                    {day.weekday}
                  </span>
                </div>

                {/* Right date & badge */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: isHighlight ? '#f0c040' : '#ffffff',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {day.dateStr}
                  </span>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: '999px',
                      background: rel.isToday
                        ? '#22c55e'
                        : isHighlight
                        ? 'rgba(240, 192, 64, 0.25)'
                        : 'rgba(255, 255, 255, 0.10)',
                      color: rel.isToday ? '#ffffff' : isHighlight ? '#fef08a' : 'rgba(255, 255, 255, 0.70)',
                    }}
                  >
                    {rel.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)' }}>
            আসছে বছর আবার হবে • শারদীয়ার প্রীতি ও শুভেচ্ছা 🌸
          </span>
        </div>
      </div>
    </div>
  );
}
