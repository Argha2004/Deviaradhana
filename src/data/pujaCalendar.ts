export interface PujaDay {
  id: string;
  nameBn: string;
  nameEn: string;
  date: Date;
  significance: string;
}

// ──────────────────────────────────────────────────────────────
// Update these dates once a year. The countdown, calendar title,
// weekdays and "In N days" badges are all derived from them.
// ──────────────────────────────────────────────────────────────

export const PUJA_DAYS: PujaDay[] = [
  {
    id: 'mahalaya',
    nameBn: 'মহালয়া',
    nameEn: 'Mahalaya',
    date: new Date('2026-10-11T00:00:00'),
    significance: 'দেবীপক্ষের সূচনা ও পিতৃ তর্পণ',
  },
  {
    id: 'sasthi',
    nameBn: 'মহা ষষ্ঠী',
    nameEn: 'Maha Sasthi',
    date: new Date('2026-10-17T00:00:00'),
    significance: 'দেবীর বোধন ও আমন্ত্রণ',
  },
  {
    id: 'saptami',
    nameBn: 'মহা সপ্তমী',
    nameEn: 'Maha Saptami',
    date: new Date('2026-10-18T00:00:00'),
    significance: 'নবপত্রিকা প্রবেশ ও প্রাণ প্রতিষ্ঠা',
  },
  {
    id: 'asthami',
    nameBn: 'মহা অষ্টমী',
    nameEn: 'Maha Ashtami',
    date: new Date('2026-10-19T00:00:00'),
    significance: 'সন্ধিপূজা ও কুমারী পূজা',
  },
  {
    id: 'nabami',
    nameBn: 'মহা নবমী',
    nameEn: 'Maha Nabami',
    date: new Date('2026-10-20T00:00:00'),
    significance: 'নবমী হোম ও আরতি',
  },
  {
    id: 'dasami',
    nameBn: 'বিজয়া দশমী',
    nameEn: 'Bijoya Dashami',
    date: new Date('2026-10-21T00:00:00'),
    significance: 'দেবী বিসর্জন ও বিজয়ার শুভেচ্ছা',
  },
];

export const PUJA_YEAR = PUJA_DAYS[0].date.getFullYear();

/** Maha Sasthi, the day the "days until Durga Pujo" countdown counts down to */
export const FESTIVAL_DATE = (PUJA_DAYS.find((day) => day.id === 'sasthi') ?? PUJA_DAYS[0]).date;
