import { EventItem } from '../types';

export function downloadCalendarEvent(event: EventItem, orderNumber: string) {
  const startDate = new Date(event.startDate);
  // Assume 3 hours duration if no end time
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

  const formatIcsDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ENTRÉO Events Germany//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:order-${orderNumber}@entreo.de`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${event.title} — ${event.venue.name}`,
    `DESCRIPTION:${event.subtitle || event.title}\\nOrder: ${orderNumber}\\nDoors: ${event.doorsTime} Uhr\\nCurated by ENTRÉO`,
    `LOCATION:${event.venue.name}, ${event.venue.address}, ${event.venue.postalCode} ${event.venue.city}, Germany`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `entreo-${event.slug}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

