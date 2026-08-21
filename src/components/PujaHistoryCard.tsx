import { useEffect, useState } from 'react';
import { get2HourRotatedFact, PUJA_HISTORY_FACTS, type PujaFact } from '../data/pujaHistoryFacts';

export function PujaHistoryCard() {
  const [activeSlot, setActiveSlot] = useState(() => get2HourRotatedFact());
  const [manualIndex, setManualIndex] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);

  // Auto-sync every 2 hours and on tab focus
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    const syncSlot = () => {
      const current = get2HourRotatedFact();
      setIsFading(true);
      setTimeout(() => {
        setActiveSlot(current);
        setManualIndex(null);
        setIsFading(false);
      }, 300);

      timerId = setTimeout(syncSlot, Math.max(5000, current.nextRotationMs));
    };

    const initial = get2HourRotatedFact();
    timerId = setTimeout(syncSlot, Math.max(5000, initial.nextRotationMs));

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const latest = get2HourRotatedFact();
        setActiveSlot((prev) => (prev.index !== latest.index ? latest : prev));
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, []);

  const currentFact: PujaFact =
    manualIndex !== null ? PUJA_HISTORY_FACTS[manualIndex] : activeSlot.fact;

  const handleNextFact = () => {
    setIsFading(true);
    setTimeout(() => {
      const currIdx = manualIndex !== null ? manualIndex : activeSlot.index;
      const nextIdx = (currIdx + 1) % PUJA_HISTORY_FACTS.length;
      setManualIndex(nextIdx);
      setIsFading(false);
    }, 200);
  };

  return (
    <div
      className="puja-history-section desktop-only"
      onClick={handleNextFact}
      title="ক্লিক করে পরের ইতিহাস দেখুন (প্রতি ২ ঘণ্টায় পরিবর্তিত হয়)"
      style={{
        width: '100%',
        maxWidth: '560px',
        margin: '0 auto 6px',
        padding: '0 12px',
        cursor: 'pointer',
        userSelect: 'none',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3px',
      }}
    >
      <div
        style={{
          opacity: isFading ? 0 : 1,
          transform: isFading ? 'translateY(2px)' : 'translateY(0)',
          transition: 'opacity 0.22s ease, transform 0.22s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          width: '100%',
        }}
      >
        {/* Subtle refined golden tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '10px',
            letterSpacing: '0.08em',
            color: '#f0c040',
            fontWeight: 600,
            textTransform: 'uppercase',
            textShadow: '0 2px 10px rgba(0,0,0,0.95)',
          }}
        >
          <span>ইতিহাসের পাতা থেকে</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>{currentFact.tag}</span>
        </div>

        {/* Unified harmonious text line */}
        <p
          style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.88)',
            margin: 0,
            lineHeight: 1.5,
            fontWeight: 400,
            textAlign: 'center',
            textShadow:
              '0 2px 12px rgba(0, 0, 0, 0.95), 0 0 20px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0,0,0,1)',
            maxWidth: '520px',
          }}
        >
          <strong style={{ color: '#ffffff', fontWeight: 600 }}>
            {currentFact.headline}
          </strong>
          <span style={{ opacity: 0.6, margin: '0 4px' }}>—</span>
          <span>{currentFact.story}</span>
        </p>
      </div>
    </div>
  );
}
