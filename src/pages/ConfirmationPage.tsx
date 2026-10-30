import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  QrCode, 
  Calendar, 
  Download, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Ticket,
  Printer
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { downloadCalendarEvent } from '../utils/calendarExport';

export const ConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, events, lang } = useStore();

  const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  const event = order ? events.find((e) => e.id === order.eventId) : undefined;

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-3">
        <h2 className="font-serif text-2xl font-bold text-entreo-ink">
          {lang === 'DE' ? 'Bestellung nicht gefunden' : 'Order not found'}
        </h2>
        <Link to="/" className="text-xs text-entreo-red font-semibold hover:underline">
          {lang === 'DE' ? 'Zur Startseite' : 'Return home'}
        </Link>
      </div>
    );
  }

  const handleDownloadCalendar = () => {
    if (event) {
      downloadCalendarEvent(event, order.orderNumber);
    }
  };

  const handleDownloadTicketPass = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const formattedDate = new Intl.DateTimeFormat(lang === 'DE' ? 'de-DE' : 'en-US', {
    timeZone: 'Europe/Berlin',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(order.eventDate));

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      {/* Success Hero Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 ring-8 ring-emerald-50">
          <CheckCircle className="w-8 h-8" />
        </div>
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-entreo-red">
          {lang === 'DE' ? 'BUCHUNG ERFOLGREICH BESTÄTIGT' : 'BOOKING CONFIRMED'}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-entreo-ink">
          {lang === 'DE' ? 'Vielen Dank für deine Buchung!' : 'You’re all set for the show!'}
        </h1>
        <p className="text-xs sm:text-sm text-entreo-muted max-w-md mx-auto">
          {lang === 'DE'
            ? `Bestellbestätigung und Eintrittskarten wurden an ${order.customer.email} gesendet.`
            : `Order confirmation and entry pass sent to ${order.customer.email}.`}
        </p>
      </div>

      {/* Main Ticket Pass Component (Editorial Ticket Stub) */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-search-pill border border-entreo-border">
        {/* Ticket Header Banner */}
        <div className="bg-entreo-red p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-serif text-xl font-bold tracking-tight">ENTRÉO</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-pill">
                Official Entry Pass
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">{order.eventTitle}</h2>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="block text-[11px] text-white/80 uppercase tracking-wider font-semibold">
              {lang === 'DE' ? 'Bestellnummer' : 'Order Reference'}
            </span>
            <span className="font-mono text-lg font-bold tracking-wider">{order.orderNumber}</span>
          </div>
        </div>

        {/* Ticket Body: QR Code & Specifications */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left QR Pass Simulation */}
          <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-entreo-cream/50 rounded-2xl border border-entreo-border/60 text-center">
            {/* SVG High-contrast QR simulation */}
            <div className="w-40 h-40 bg-white p-3 rounded-xl shadow-sm border border-black/5 flex items-center justify-center relative">
              <svg className="w-full h-full text-entreo-ink" viewBox="0 0 100 100" fill="currentColor">
                {/* 3 Corner detection patterns */}
                <rect x="5" y="5" width="26" height="26" />
                <rect x="9" y="9" width="18" height="18" fill="white" />
                <rect x="13" y="13" width="10" height="10" />

                <rect x="69" y="5" width="26" height="26" />
                <rect x="73" y="9" width="18" height="18" fill="white" />
                <rect x="77" y="13" width="10" height="10" />

                <rect x="5" y="69" width="26" height="26" />
                <rect x="9" y="73" width="18" height="18" fill="white" />
                <rect x="13" y="13" width="10" height="10" />

                {/* Data modules */}
                <rect x="36" y="8" width="6" height="6" />
                <rect x="48" y="12" width="10" height="6" />
                <rect x="38" y="24" width="8" height="8" />
                <rect x="54" y="26" width="6" height="6" />
                <rect x="8" y="38" width="8" height="8" />
                <rect x="22" y="44" width="6" height="8" />
                <rect x="36" y="40" width="12" height="12" />
                <rect x="56" y="38" width="8" height="6" />
                <rect x="72" y="44" width="12" height="8" />
                <rect x="88" y="38" width="6" height="12" />
                <rect x="38" y="60" width="8" height="6" />
                <rect x="54" y="56" width="8" height="8" />
                <rect x="40" y="76" width="8" height="8" />
                <rect x="56" y="72" width="10" height="6" />
                <rect x="74" y="68" width="8" height="12" />
                <rect x="88" y="76" width="6" height="8" />
              </svg>
            </div>
            <p className="text-[10px] font-mono text-entreo-muted mt-2">
              Scan at Venue Turnstile
            </p>
            <p className="text-[11px] font-bold text-entreo-ink mt-0.5">
              {order.customer.firstName} {order.customer.lastName}
            </p>
          </div>

          {/* Center Details */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-entreo-muted block">
                  {lang === 'DE' ? 'Datum & Uhrzeit' : 'Date & Time'}
                </span>
                <span className="font-bold text-entreo-ink block mt-0.5">{formattedDate}</span>
                <span className="text-entreo-muted block">Einlass: {order.doorsTime} Uhr • Start: {order.startTime} Uhr</span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-entreo-muted block">
                  {lang === 'DE' ? 'Veranstaltungsort' : 'Location'}
                </span>
                <span className="font-bold text-entreo-ink block mt-0.5">{order.venueName}</span>
                <span className="text-entreo-muted block">{order.venueAddress}</span>
              </div>
            </div>

            {/* Booked Tickets List */}
            <div className="p-3 bg-entreo-cream/60 rounded-xl border border-entreo-border/60 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-entreo-muted block mb-1">
                {lang === 'DE' ? 'Gebuchte Tickets' : 'Booked Tickets'}
              </span>
              {order.items.map((item) => (
                <div key={item.tierId} className="flex justify-between items-center">
                  <span className="font-medium text-entreo-ink">
                    {item.quantity}x {item.tierName}
                  </span>
                  <span className="font-bold text-entreo-ink">
                    € {(item.quantity * item.unitPrice).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-entreo-border/60 flex justify-between font-extrabold text-sm text-entreo-ink">
                <span>{lang === 'DE' ? 'Gesamt gezahlt' : 'Total Paid'}</span>
                <span className="text-entreo-red">€ {order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Fast Action Buttons */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleDownloadTicketPass}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadSuccess ? (lang === 'DE' ? 'Pass gespeichert!' : 'Pass Saved!') : 'Apple / Google Wallet'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadCalendar}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill bg-entreo-chip hover:bg-entreo-chip-hover text-entreo-ink text-xs font-semibold transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-entreo-red" />
                <span>{lang === 'DE' ? 'Kalender (.ics) exportieren' : 'Export (.ics) Calendar'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill border border-entreo-border bg-white text-entreo-ink text-xs font-semibold hover:bg-entreo-cream transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'DE' ? 'Drucken' : 'Print'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* German Venue Entry Instructions Card */}
      <div className="bg-white rounded-2xl p-6 shadow-soft-card border border-entreo-border space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-entreo-red" />
          <h3 className="font-serif text-lg font-bold text-entreo-ink">
            {lang === 'DE' ? 'Wichtige Einlass- & Zutrittshinweise' : 'Important Venue Entry Guidelines'}
          </h3>
        </div>

        <ul className="text-xs text-entreo-muted space-y-2 list-disc pl-5 leading-relaxed">
          <li>
            <strong>{lang === 'DE' ? 'Ausweiskontrolle:' : 'Valid Photo ID:'}</strong>{' '}
            {lang === 'DE'
              ? 'Bitte halten Sie am Einlass einen amtlichen Lichtbildausweis bereit (Personalausweis, Reisepass).'
              : 'Please present official photo ID matching the attendee name at turnstiles.'}
          </li>
          <li>
            <strong>{lang === 'DE' ? 'Taschenregelung (DIN A4):' : 'Bag Policy (DIN A4):'}</strong>{' '}
            {lang === 'DE'
              ? 'Aus Sicherheitsgründen sind nur Taschen bis maximal DIN A4 Format (ca. 21 x 30 cm) zugelassen.'
              : 'For security reasons, only bags smaller than DIN A4 size (approx 21 x 30cm) are permitted.'}
          </li>
          <li>
            <strong>{lang === 'DE' ? 'Kontaktloser Einlass:' : 'Contactless Entry:'}</strong>{' '}
            {lang === 'DE'
              ? 'Der QR-Code kann direkt von Ihrem Smartphone-Display gescannt werden. Display-Helligkeit bitte erhöhen.'
              : 'Scan the QR pass directly from your mobile device. Turn up screen brightness.'}
          </li>
        </ul>
      </div>

      {/* Wallet Navigation Bar */}
      <div className="flex items-center justify-between pt-4">
        <Link
          to="/events"
          className="text-xs font-semibold text-entreo-muted hover:text-entreo-ink"
        >
          {lang === 'DE' ? '← Weitere Events entdecken' : '← Discover more events'}
        </Link>
        <Link
          to="/my-tickets"
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 rounded-pill bg-entreo-red text-white hover:bg-entreo-red-hover transition-colors shadow-xs"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>{lang === 'DE' ? 'Zu meinen Tickets' : 'View in My Tickets'}</span>
        </Link>
      </div>
    </main>
  );
};

