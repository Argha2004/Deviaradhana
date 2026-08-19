import { useEffect, useRef } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';

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
      <div className="animate-modal modal-surface calendar-modal" style={{ position: 'relative' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.60)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
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
          <X size={15} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              marginBottom: '4px',
            }}
          >
            <CalendarIcon size={22} />
          </div>
          <h3
            className="calendar-header-title"
            style={{
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 3px 0',
              letterSpacing: '-0.01em',
            }}
          >
            দুর্গাপূজা ক্যালেন্ডার ২০২৬
          </h3>
          <p className="calendar-header-sub" style={{ color: 'rgba(255, 255, 255, 0.55)', margin: 0 }}>
            Durga Puja 2026 Dates & Schedule
          </p>
        </div>

        {/* Dates List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
          {PUJA_DAYS_2026.map((day) => {
            const rel = getRelativeStatus(day.date);

            return (
              <div key={day.id} className="calendar-day-row">
                {/* Left info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5px', minWidth: 0, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                    <span className="calendar-day-title-bn">{day.nameBn}</span>
                    <span className="calendar-day-title-en">• {day.nameEn}</span>
                  </div>
                  <span className="calendar-day-weekday">{day.weekday}</span>
                </div>

                {/* Right date & badge */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
                  <span className="calendar-day-date">{day.dateStr}</span>
                  <span
                    className="calendar-day-badge"
                    style={{
                      background: rel.isToday ? '#22c55e' : 'rgba(255, 255, 255, 0.10)',
                      color: rel.isToday ? '#ffffff' : 'rgba(255, 255, 255, 0.70)',
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
          <span className="calendar-footer-text" style={{ color: 'rgba(255,255,255,0.40)' }}>
            আসছে বছর আবার হবে • শারদীয়ার প্রীতি ও শুভেচ্ছা
          </span>
        </div>
      </div>
    </div>
  );
}
