import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Accessibility, 
  Users, 
  Heart, 
  Share2, 
  Check, 
  AlertCircle, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { DateBadge } from '../components/ui/DateBadge';
import { GenreChip } from '../components/ui/GenreChip';
import { VenueMapMock } from '../components/events/VenueMapMock';
import { TicketTier } from '../types';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, savedEventIds, toggleSavedEvent, lang } = useStore();

  const event = events.find((e) => e.id === id || e.slug === id);

  // Selected quantities for each ticket tier: tierId -> quantity
  const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({});
  const [isCopied, setIsCopied] = useState(false);

  if (!event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-entreo-ink">
          {lang === 'DE' ? 'Event nicht gefunden' : 'Event not found'}
        </h2>
        <p className="text-xs text-entreo-muted">
          {lang === 'DE' ? 'Diese Veranstaltung existiert leider nicht.' : 'This event could not be found.'}
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-entreo-red hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'DE' ? 'Zurück zu allen Events' : 'Back to all events'}</span>
        </Link>
      </div>
    );
  }

  const isSaved = savedEventIds.includes(event.id);

  const handleQuantityChange = (tierId: string, delta: number, max: number, available: number) => {
    const current = ticketQuantities[tierId] || 0;
    const maxAllowed = Math.min(max, available);
    const nextVal = Math.max(0, Math.min(maxAllowed, current + delta));
    setTicketQuantities((prev) => ({ ...prev, [tierId]: nextVal }));
  };

  const totalTicketsSelected = Object.values(ticketQuantities).reduce((a, b) => a + b, 0);

  const selectedTierItems = event.tickets.filter((t) => (ticketQuantities[t.id] || 0) > 0);

  const subtotalPrice = selectedTierItems.reduce(
    (sum, t) => sum + (ticketQuantities[t.id] || 0) * t.price,
    0
  );

  const totalFees = selectedTierItems.reduce(
    (sum, t) => sum + (ticketQuantities[t.id] || 0) * t.fee,
    0
  );

  const payableTotal = subtotalPrice + totalFees;

  const handleProceedToCheckout = () => {
    // If no specific ticket selected, default to 1 of the first available tier
    let queryParams = '';
    if (totalTicketsSelected > 0) {
      const itemsParam = selectedTierItems
        .map((t) => `${t.id}:${ticketQuantities[t.id]}`)
        .join(',');
      queryParams = `?tiers=${encodeURIComponent(itemsParam)}`;
    } else {
      const firstAvailable = event.tickets.find((t) => t.available > 0) || event.tickets[0];
      queryParams = `?tiers=${encodeURIComponent(`${firstAvailable.id}:1`)}`;
    }

    navigate(`/checkout/${event.id}${queryParams}`);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const scrollToTickets = () => {
    const el = document.getElementById('ticket-selection-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Format date in Europe/Berlin
  const eventDateFormatted = new Intl.DateTimeFormat(lang === 'DE' ? 'de-DE' : 'en-US', {
    timeZone: 'Europe/Berlin',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(event.startDate));

  return (
    <main className="min-h-screen pb-24 md:pb-16">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-xs text-entreo-muted">
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-entreo-ink hover:text-entreo-red font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'DE' ? 'Zurück zu allen Events' : 'Back to all events'}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            aria-label="Share event"
            className="p-2 rounded-full hover:bg-entreo-chip text-entreo-ink transition-colors flex items-center gap-1"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline text-[11px] font-semibold">
              {isCopied ? (lang === 'DE' ? 'Kopiert!' : 'Copied!') : (lang === 'DE' ? 'Teilen' : 'Share')}
            </span>
          </button>
          <button
            onClick={() => toggleSavedEvent(event.id)}
            aria-label={isSaved ? 'Von Merkliste entfernen' : 'Auf Merkliste speichern'}
            className="p-2 rounded-full hover:bg-entreo-chip text-entreo-ink transition-colors flex items-center gap-1"
          >
            <Heart
              className={`w-4 h-4 ${isSaved ? 'fill-entreo-red text-entreo-red' : 'text-entreo-ink'}`}
            />
            <span className="hidden sm:inline text-[11px] font-semibold">
              {isSaved ? (lang === 'DE' ? 'Gemerkt' : 'Saved') : (lang === 'DE' ? 'Merken' : 'Save')}
            </span>
          </button>
        </div>
      </div>

      {/* Hero Artwork Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative rounded-3xl overflow-hidden shadow-soft-card border border-entreo-border bg-black aspect-[21/9] min-h-[260px] max-h-[480px]">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover object-center brightness-[0.9]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Floating Date Badge */}
          <div className="absolute top-4 left-4 z-10">
            <DateBadge dateString={event.startDate} />
          </div>

          {/* Hero Content Overlay at Bottom */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-pill text-[10px] font-bold uppercase tracking-wider bg-entreo-red text-white">
                {event.category}
              </span>
              {event.genreTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-pill text-[10px] font-medium bg-white/20 backdrop-blur-xs text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight drop-shadow-sm">
              {event.title}
            </h1>
            {event.subtitle && (
              <p className="text-xs sm:text-base text-white/90 mt-1 max-w-2xl drop-shadow-xs">
                {event.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Event Specs, Timetable, About, Venue Map */}
        <div className="lg:col-span-2 space-y-8">
          {/* Schedule & Key Specs Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-soft-card border border-entreo-border grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Timetable */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-entreo-red">
                <Clock className="w-3.5 h-3.5" />
                <span>{lang === 'DE' ? 'Ablauf (Berlin Zeit)' : 'Europe/Berlin Time'}</span>
              </div>
              <p className="text-xs text-entreo-ink font-semibold">{eventDateFormatted}</p>
              <div className="text-xs text-entreo-muted space-y-0.5 pt-1">
                <p>{lang === 'DE' ? 'Einlass:' : 'Doors:'} <span className="font-medium text-entreo-ink">{event.doorsTime} {lang === 'DE' ? 'Uhr' : ''}</span></p>
                <p>{lang === 'DE' ? 'Beginn:' : 'Show:'} <span className="font-medium text-entreo-ink">{event.startTime} {lang === 'DE' ? 'Uhr' : ''}</span></p>
                {event.endTime && <p>{lang === 'DE' ? 'Ende:' : 'Curfew:'} <span className="font-medium text-entreo-ink">{event.endTime} {lang === 'DE' ? 'Uhr' : ''}</span></p>}
              </div>
            </div>

            {/* Venue & Location */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-entreo-red">
                <MapPin className="w-3.5 h-3.5" />
                <span>{lang === 'DE' ? 'Veranstaltungsort' : 'Venue'}</span>
              </div>
              <p className="text-xs text-entreo-ink font-bold">{event.venue.name}</p>
              <p className="text-xs text-entreo-muted leading-relaxed">
                {event.venue.address}<br />
                {event.venue.postalCode} {event.venue.city}
              </p>
            </div>

            {/* Age & Accessibility */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-entreo-red">
                <Accessibility className="w-3.5 h-3.5" />
                <span>{lang === 'DE' ? 'Zutritt & Barrierefreiheit' : 'Entry & Accessibility'}</span>
              </div>
              <div className="text-xs text-entreo-ink space-y-1">
                <p className="inline-block bg-entreo-chip px-2 py-0.5 rounded font-medium">
                  {event.ageRestriction}
                </p>
                <p className="text-xs text-entreo-muted leading-relaxed line-clamp-3">
                  {event.venue.accessibilityNotes}
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Description */}
          <div className="bg-white rounded-2xl p-6 shadow-soft-card border border-entreo-border space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-entreo-ink">
              {lang === 'DE' ? 'Über das Event' : 'About the Experience'}
            </h2>
            <div className="text-xs sm:text-sm text-entreo-muted leading-relaxed space-y-3">
              <p>{lang === 'DE' ? event.descriptionDE : event.descriptionEN}</p>
              <p>
                {lang === 'DE'
                  ? 'ENTRÉO garantiert verifizierte Tickets mit direktem Einlass über den mobilen QR-Pass. Keine versteckten Zusatzkosten beim Einlass.'
                  : 'ENTRÉO guarantees verified tickets with seamless contactless entry via mock QR pass. All fees explicitly itemized.'}
              </p>
            </div>

            {/* Organizer Verified Strip */}
            <div className="pt-4 border-t border-entreo-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-entreo-ink">{event.organizerName}</span>
                  <span className="text-entreo-muted ml-2">
                    {lang === 'DE' ? 'Verifizierter Veranstalter' : 'Verified Promoter'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert(`Kontakt zum Veranstalter: ${event.organizerName}\nE-Mail: kontakt@entreo.de`)}
                className="text-entreo-red hover:underline font-semibold text-left"
              >
                {lang === 'DE' ? 'Veranstalter kontaktieren' : 'Contact Organizer'}
              </button>
            </div>
          </div>

          {/* Interactive Venue Map */}
          <div>
            <h3 className="font-serif text-lg font-bold text-entreo-ink mb-3">
              {lang === 'DE' ? 'Anfahrt & Lageplan' : 'Location & Transit'}
            </h3>
            <VenueMapMock
              venueName={event.venue.name}
              address={event.venue.address}
              postalCode={event.venue.postalCode}
              city={event.venue.city}
            />
          </div>
        </div>

        {/* Right Column (1 Col): Ticket Selection Section */}
        <div id="ticket-selection-section" className="space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-search-pill border border-entreo-border sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-entreo-red">
                  {lang === 'DE' ? 'TICKETAUSWAHL' : 'TICKET SELECTION'}
                </p>
                <h3 className="font-serif text-xl font-bold text-entreo-ink">
                  {lang === 'DE' ? 'Kategorien & Plätze' : 'Categories & Tiers'}
                </h3>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded">
                {lang === 'DE' ? 'Offizieller Vorverkauf' : 'Official Pre-sale'}
              </span>
            </div>

            {/* Ticket Tier Cards */}
            <div className="space-y-3 mb-6">
              {event.tickets.map((tier) => {
                const qty = ticketQuantities[tier.id] || 0;
                const isSoldOut = tier.available <= 0;

                return (
                  <div
                    key={tier.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      qty > 0
                        ? 'border-entreo-red bg-entreo-red-light/40 shadow-xs'
                        : isSoldOut
                        ? 'border-entreo-border/40 bg-neutral-50 opacity-60'
                        : 'border-entreo-border hover:border-entreo-ink/30 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-entreo-ink leading-snug">
                          {tier.name}
                        </h4>
                        <p className="text-[11px] text-entreo-muted mt-0.5 leading-relaxed">
                          {tier.description}
                        </p>
                        <p className="text-[10px] text-entreo-muted mt-1">
                          {isSoldOut ? (
                            <span className="text-entreo-red font-bold">
                              {lang === 'DE' ? 'Ausverkauft' : 'Sold Out'}
                            </span>
                          ) : (
                            <span>
                              {lang === 'DE' ? 'Verfügbar:' : 'Available:'}{' '}
                              <strong className="text-entreo-ink">{tier.available}</strong>
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-sm sm:text-base text-entreo-ink block">
                          € {tier.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-entreo-muted block">
                          + € {tier.fee.toFixed(2)} {lang === 'DE' ? 'Gebühr' : 'fee'}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    {!isSoldOut && (
                      <div className="mt-3 pt-2.5 border-t border-entreo-border/50 flex items-center justify-between">
                        <span className="text-[11px] text-entreo-muted">
                          {lang === 'DE' ? 'Anzahl (max. ' : 'Quantity (max. '}
                          {tier.maxPerOrder})
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(tier.id, -1, tier.maxPerOrder, tier.available)}
                            disabled={qty === 0}
                            className="w-7 h-7 rounded-full border border-entreo-border bg-white text-entreo-ink font-bold flex items-center justify-center hover:bg-entreo-chip disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-bold text-xs text-entreo-ink">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(tier.id, 1, tier.maxPerOrder, tier.available)}
                            disabled={qty >= Math.min(tier.maxPerOrder, tier.available)}
                            className="w-7 h-7 rounded-full border border-entreo-border bg-white text-entreo-ink font-bold flex items-center justify-center hover:bg-entreo-chip disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Price Breakdown Summary */}
            <div className="p-3.5 bg-entreo-cream rounded-xl space-y-1.5 text-xs text-entreo-muted mb-5">
              <div className="flex justify-between">
                <span>{lang === 'DE' ? 'Zwischensumme' : 'Subtotal'}</span>
                <span className="font-semibold text-entreo-ink">
                  € {subtotalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'DE' ? 'Buchungsgebühren' : 'Booking Fees'}</span>
                <span className="font-semibold text-entreo-ink">
                  € {totalFees.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-entreo-border flex justify-between text-sm font-extrabold text-entreo-ink">
                <span>{lang === 'DE' ? 'Gesamtbetrag (inkl. 19% MwSt.)' : 'Total (incl. 19% VAT)'}</span>
                <span className="text-entreo-red text-base">
                  € {payableTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Refund Policy Summary */}
            <div className="flex items-start gap-2 p-2.5 bg-neutral-50 rounded-lg text-[11px] text-entreo-muted mb-5">
              <Info className="w-4 h-4 text-entreo-muted shrink-0 mt-0.5" />
              <p>
                {lang === 'DE'
                  ? 'Stornierungsbedingungen: Bei Konzertabsage automatische Vollerstattung. Übertragbarkeit auf andere Personen uneingeschränkt möglich.'
                  : 'Refund policy: 100% refund in case of cancellation. Tickets are fully transferable.'}
              </p>
            </div>

            {/* Select Tickets CTA */}
            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full bg-entreo-red hover:bg-entreo-red-hover text-white font-semibold py-3 px-6 rounded-pill flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-entreo-red"
            >
              <span>{lang === 'DE' ? 'Tickets buchen' : 'Select tickets'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-entreo-border px-4 py-3 flex items-center justify-between shadow-2xl">
        <div>
          <span className="block text-[10px] text-entreo-muted uppercase font-bold">
            {lang === 'DE' ? 'Ab' : 'From'}
          </span>
          <span className="text-lg font-extrabold text-entreo-ink">
            € {event.minPrice}
          </span>
        </div>
        <button
          type="button"
          onClick={scrollToTickets}
          className="bg-entreo-red hover:bg-entreo-red-hover text-white text-xs font-semibold px-5 py-2.5 rounded-pill flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <span>{lang === 'DE' ? 'Tickets wählen' : 'Select tickets'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </main>
  );
};

