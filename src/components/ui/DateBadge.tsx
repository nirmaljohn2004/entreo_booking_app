import React from 'react';
import { useStore } from '../../store/useStore';

interface DateBadgeProps {
  dateString: string; // ISO date
  className?: string;
  size?: 'sm' | 'md';
}

export const DateBadge: React.FC<DateBadgeProps> = ({
  dateString,
  className = '',
  size = 'md',
}) => {
  const { lang } = useStore();
  const date = new Date(dateString);

  // Force Europe/Berlin timezone formatting
  const formatter = new Intl.DateTimeFormat(lang === 'DE' ? 'de-DE' : 'en-US', {
    timeZone: 'Europe/Berlin',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

  const parts = formatter.formatToParts(date);
  const partMap: Record<string, string> = {};
  parts.forEach((p) => {
    partMap[p.type] = p.value;
  });

  // Uppercase clean 2-char weekday and 3-char month
  let weekday = (partMap.weekday || '').replace('.', '').toUpperCase().slice(0, 2);
  const day = partMap.day || '01';
  let month = (partMap.month || '').replace('.', '').toUpperCase().slice(0, 3);

  // Match Friday in English/German: FR
  if (weekday === 'FR' || weekday === 'FR') weekday = 'FR';
  if (weekday === 'SA') weekday = 'SA';

  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex flex-col items-center justify-center bg-white rounded-lg shadow-sm border border-black/10 text-entreo-ink select-none ${
        isSmall ? 'w-9 h-11 p-1' : 'w-11 h-13 p-1.5'
      } ${className}`}
      aria-label={`${weekday}, ${day}. ${month}`}
    >
      <span className={`font-bold tracking-wider text-entreo-ink/80 ${isSmall ? 'text-[9px]' : 'text-[10px]'}`}>
        {weekday}
      </span>
      <span className={`font-extrabold text-entreo-ink leading-tight ${isSmall ? 'text-base my-0.5' : 'text-lg my-0.5'}`}>
        {day}
      </span>
      <span className={`font-bold tracking-wider text-entreo-ink/80 ${isSmall ? 'text-[9px]' : 'text-[10px]'}`}>
        {month}
      </span>
    </div>
  );
};
