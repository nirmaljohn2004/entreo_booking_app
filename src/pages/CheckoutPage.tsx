import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Lock, 
  Clock, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Tag, 
  Loader2,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Order, OrderItem } from '../types';

export const CheckoutPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { events, createOrder, lang } = useStore();

  const event = events.find((e) => e.id === eventId || e.slug === eventId);

  // Parse tiers from URL query: e.g. tiers=t-lea-ga:2,t-lea-seat:1
  const [tierQuantities, setTierQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!event) return;
    const tiersParam = searchParams.get('tiers');
    const initialQtys: Record<string, number> = {};

    if (tiersParam) {
      tiersParam.split(',').forEach((pair) => {
        const [tierId, qtyStr] = pair.split(':');
        const qty = parseInt(qtyStr, 10);
        if (tierId && !isNaN(qty) && qty > 0) {
          initialQtys[tierId] = qty;
        }
      });
    }

    // Fallback: If no tiers selected, default to 1 of first available tier
    if (Object.keys(initialQtys).length === 0) {
      const firstAvailable = event.tickets.find((t) => t.available > 0) || event.tickets[0];
      if (firstAvailable) {
        initialQtys[firstAvailable.id] = 1;
      }
    }

    setTierQuantities(initialQtys);
  }, [event, searchParams]);

  // Attendee Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sepa' | 'giropay' | 'applepay'>('applepay');
  const [iban, setIban] = useState('DE89 3704 0044 0532 0130 00');
  const [accountHolder, setAccountHolder] = useState('');

  // Promo Code
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState('');

  // Simulation controls
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentErrorMsg, setPaymentErrorMsg] = useState('');

  // 10-Minute Ticket Reservation Timer
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-3">
        <h2 className="font-serif text-2xl font-bold text-entreo-ink">
          {lang === 'DE' ? 'Event nicht gefunden' : 'Event not found'}
        </h2>
        <Link to="/events" className="text-xs text-entreo-red font-semibold hover:underline">
          {lang === 'DE' ? 'Zurück zum Kalender' : 'Back to event calendar'}
        </Link>
      </div>
    );
  }

  // Handle tier quantity change
  const handleQuantityChange = (tierId: string, delta: number) => {
    const tier = event.tickets.find((t) => t.id === tierId);
    if (!tier) return;
    const current = tierQuantities[tierId] || 0;
    const maxAllowed = Math.min(tier.maxPerOrder, tier.available);
    const updated = Math.max(0, Math.min(maxAllowed, current + delta));
    setTierQuantities((prev) => ({ ...prev, [tierId]: updated }));
  };

  // Pricing calculations
  const selectedItems: OrderItem[] = event.tickets
    .filter((t) => (tierQuantities[t.id] || 0) > 0)
    .map((t) => ({
      tierId: t.id,
      tierName: t.name,
      quantity: tierQuantities[t.id],
      unitPrice: t.price,
      fee: t.fee,
    }));

  const totalTickets = selectedItems.reduce((acc, i) => acc + i.quantity, 0);

  const subtotal = selectedItems.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0);
  const totalFees = selectedItems.reduce((acc, i) => acc + i.quantity * i.fee, 0);
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const grandTotal = Math.max(0, subtotal - discountAmount + totalFees);
  const vatAmount = (grandTotal * 0.19) / 1.19; // 19% included

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'ENTREO10') {
      setAppliedDiscount(10);
    } else {
      setPromoError(lang === 'DE' ? 'Ungültiger Rabattcode (Tipp: ENTREO10)' : 'Invalid code (Try: ENTREO10)');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = lang === 'DE' ? 'Vorname ist erforderlich' : 'First name required';
    if (!lastName.trim()) newErrors.lastName = lang === 'DE' ? 'Nachname ist erforderlich' : 'Last name required';
    if (!email.trim() || !email.includes('@')) newErrors.email = lang === 'DE' ? 'Gültige E-Mail erforderlich' : 'Valid email required';
    if (!termsAccepted) newErrors.terms = lang === 'DE' ? 'Bitte AGB bestätigen' : 'Please accept terms';
    if (totalTickets === 0) newErrors.tickets = lang === 'DE' ? 'Mindestens 1 Ticket auswählen' : 'Select at least 1 ticket';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentErrorMsg('');

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment gateway latency
    setTimeout(() => {
      setIsProcessing(false);

      if (simulateFailure) {
        setPaymentErrorMsg(
          lang === 'DE'
            ? 'Zahlung fehlgeschlagen: Die Bank hat die Autorisierung verweigert (Test-Simulation aktiv). Bitte eine andere Bezahlmethode wählen.'
            : 'Payment failed: The bank declined the test transaction (Simulation active). Please try another method.'
        );
        return;
      }

      // Generate order
      const randomOrderNum = `ENT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: randomOrderNum,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.startDate,
        doorsTime: event.doorsTime,
        startTime: event.startTime,
        venueName: event.venue.name,
        venueAddress: `${event.venue.address}, ${event.venue.postalCode} ${event.venue.city}`,
        city: event.city,
        items: selectedItems,
        subtotal,
        bookingFee: totalFees,
        vatAmount,
        total: grandTotal,
        customer: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
        },
        paymentMethod,
        paymentStatus: 'paid',
        qrCodeSeed: `${randomOrderNum}-${event.slug}`,
        createdAt: new Date().toISOString(),
      };

      createOrder(newOrder);
      navigate(`/confirmation/${newOrder.id}`);
    }, 1200);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Top Breadcrumb & Reservation Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-entreo-border gap-3">
        <Link
          to={`/events/${event.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-entreo-muted hover:text-entreo-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'DE' ? 'Zurück zur Eventseite' : 'Back to event'}</span>
        </Link>

        {/* 10 Min Hold Timer */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-pill text-xs font-medium self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
          <span>
            {lang === 'DE' ? 'Tickets reserviert für:' : 'Tickets held for:'}{' '}
            <strong className="font-mono font-bold text-amber-950">{formatTimer(timeLeft)}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 Cols): Ticket Review, Attendee Form, Payment Methods */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Ticket Quantity Review */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-soft-card border border-entreo-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-entreo-ink">
                1. {lang === 'DE' ? 'Ausgewählte Tickets überprüfen' : 'Review Selected Tickets'}
              </h2>
              <span className="text-xs text-entreo-muted">
                {totalTickets} {totalTickets === 1 ? 'Ticket' : 'Tickets'}
              </span>
            </div>

            {errors.tickets && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.tickets}</span>
              </div>
            )}

            <div className="space-y-3">
              {event.tickets.map((tier) => {
                const qty = tierQuantities[tier.id] || 0;
                return (
                  <div
                    key={tier.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-colors ${
                      qty > 0 ? 'border-entreo-red bg-entreo-red-light/30' : 'border-entreo-border/60 bg-neutral-50/50'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-entreo-ink">{tier.name}</h4>
                      <p className="text-[11px] text-entreo-muted">
                        € {tier.price.toFixed(2)} + € {tier.fee.toFixed(2)} Gebühr
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(tier.id, -1)}
                        disabled={qty === 0}
                        className="w-7 h-7 rounded-full border border-entreo-border bg-white text-entreo-ink font-bold hover:bg-entreo-chip disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-entreo-ink">{qty}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(tier.id, 1)}
                        disabled={qty >= Math.min(tier.maxPerOrder, tier.available)}
                        className="w-7 h-7 rounded-full border border-entreo-border bg-white text-entreo-ink font-bold hover:bg-entreo-chip disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Attendee Information */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-soft-card border border-entreo-border space-y-4">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-entreo-ink">
              2. {lang === 'DE' ? 'Angaben zum Ticketinhaber' : 'Attendee Information'}
            </h2>
            <p className="text-xs text-entreo-muted leading-relaxed">
              {lang === 'DE'
                ? 'Die Tickets werden per E-Mail versandt und direkt in Ihrem ENTRÉO-Wallet hinterlegt.'
                : 'Tickets will be sent to this email address and saved directly to your ENTRÉO wallet.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-entreo-ink mb-1.5">
                  {lang === 'DE' ? 'Vorname' : 'First Name'} *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Sophie"
                  className={`w-full text-xs sm:text-sm p-2.5 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-entreo-red ${
                    errors.firstName ? 'border-red-500 bg-red-50/50' : 'border-entreo-border'
                  }`}
                />
                {errors.firstName && <p className="text-[10px] text-red-600 mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-entreo-ink mb-1.5">
                  {lang === 'DE' ? 'Nachname' : 'Last Name'} *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Müller"
                  className={`w-full text-xs sm:text-sm p-2.5 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-entreo-red ${
                    errors.lastName ? 'border-red-500 bg-red-50/50' : 'border-entreo-border'
                  }`}
                />
                {errors.lastName && <p className="text-[10px] text-red-600 mt-1">{errors.lastName}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-entreo-ink mb-1.5">
                  {lang === 'DE' ? 'E-Mail-Adresse für Ticketempfang' : 'Email Address for Tickets'} *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sophie.mueller@beispiel.de"
                  className={`w-full text-xs sm:text-sm p-2.5 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-entreo-red ${
                    errors.email ? 'border-red-500 bg-red-50/50' : 'border-entreo-border'
                  }`}
                />
                {errors.email && <p className="text-[10px] text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-entreo-ink mb-1.5">
                  {lang === 'DE' ? 'Mobilnummer (Optional für SMS-Updates)' : 'Mobile Phone (Optional for SMS)'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 170 1234567"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-entreo-border bg-white focus:outline-none focus:ring-1 focus:ring-entreo-red"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Mock Payment Methods */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-soft-card border border-entreo-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-entreo-ink">
                3. {lang === 'DE' ? 'Sichere Bezahlung (Mock Gateway)' : 'Secure Payment (Mock Gateway)'}
              </h2>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                <Lock className="w-3 h-3" />
                <span>SSL 256-Bit Mock</span>
              </div>
            </div>

            <p className="text-xs text-entreo-muted leading-relaxed">
              {lang === 'DE'
                ? 'Dies ist ein interaktiver Design-Prototyp. Es werden keine echten Bank- oder Kreditkartendaten erfasst oder belastet.'
                : 'Prototype simulation: No actual financial charges or real bank information is collected.'}
            </p>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'applepay', label: 'Apple Pay / Google Pay' },
                { id: 'card', label: 'Kreditkarte (Mock)' },
                { id: 'sepa', label: 'SEPA-Lastschrift' },
                { id: 'giropay', label: 'Giropay / Sofort' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as typeof paymentMethod)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    paymentMethod === m.id
                      ? 'border-entreo-red bg-entreo-red-light text-entreo-red ring-1 ring-entreo-red'
                      : 'border-entreo-border bg-white text-entreo-muted hover:border-entreo-ink/30'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Method Details Box */}
            <div className="p-4 bg-entreo-cream/60 rounded-xl border border-entreo-border/60 text-xs space-y-3">
              {paymentMethod === 'applepay' && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm">
                    Pay
                  </div>
                  <div>
                    <p className="font-bold text-entreo-ink">Apple Pay / Google Wallet Express</p>
                    <p className="text-entreo-muted text-[11px]">
                      {lang === 'DE' ? 'Direkte 1-Klick-Autorisierung ohne Karteneingabe.' : 'Instant 1-click authorization.'}
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-2">
                  <p className="font-semibold text-entreo-ink">
                    {lang === 'DE' ? 'Simulierte Kreditkarte auswählen:' : 'Select Mock Test Card:'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-entreo-border text-xs cursor-pointer">
                      <input type="radio" name="mockcard" defaultChecked className="accent-entreo-red" />
                      <span>Mastercard •••• 4242 (Erfolgreich)</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-entreo-border text-xs cursor-pointer">
                      <input type="radio" name="mockcard" className="accent-entreo-red" />
                      <span>Visa •••• 8819 (Erfolgreich)</span>
                    </label>
                  </div>
                </div>
              )}

              {paymentMethod === 'sepa' && (
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-entreo-ink">
                    {lang === 'DE' ? 'Simulierte deutsche IBAN' : 'Simulated German IBAN'}
                  </label>
                  <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 rounded-lg border border-entreo-border bg-white"
                  />
                  <p className="text-[10px] text-entreo-muted">
                    {lang === 'DE' ? 'Einzug durch ENTRÉO GmbH (Gläubiger-ID: DE98ZZZ0000293841)' : 'Direct debit mandate simulation.'}
                  </p>
                </div>
              )}

              {paymentMethod === 'giropay' && (
                <div className="text-xs text-entreo-muted leading-relaxed">
                  {lang === 'DE'
                    ? 'Sie werden nach Klick auf „Zahlungspflichtig buchen“ kurz zu Ihrem simulierten Online-Banking weitergeleitet.'
                    : 'You will be briefly redirected to your simulated online banking.'}
                </div>
              )}
            </div>

            {/* Test Simulation Controls Strip */}
            <div className="p-3 bg-neutral-100 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-entreo-ink">
                🧪 {lang === 'DE' ? 'Test-Option: Zahlungsfehler simulieren' : 'Test Mode: Simulate payment failure'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-entreo-red"></div>
              </label>
            </div>

            {paymentErrorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>{lang === 'DE' ? 'Zahlungsfehler aufgetreten' : 'Payment Error'}</span>
                </p>
                <p>{paymentErrorMsg}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Order Summary & Final Submit Button */}
        <div className="space-y-6 sticky top-20">
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-search-pill border border-entreo-border space-y-5">
            <h3 className="font-serif text-lg font-bold text-entreo-ink border-b border-entreo-border pb-3">
              {lang === 'DE' ? 'Bestellübersicht' : 'Order Summary'}
            </h3>

            {/* Event Miniature */}
            <div className="flex gap-3 items-center">
              <img
                src={event.image}
                alt={event.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-entreo-ink line-clamp-1">
                  {event.title}
                </h4>
                <p className="text-[11px] text-entreo-muted mt-0.5 line-clamp-1">
                  {event.venue.name}, {event.city}
                </p>
                <p className="text-[10px] text-entreo-red font-semibold mt-0.5">
                  {event.doorsTime} Uhr Einlass
                </p>
              </div>
            </div>

            {/* Itemized tickets */}
            <div className="space-y-2 pt-2 border-t border-entreo-border/60 text-xs">
              {selectedItems.map((item) => (
                <div key={item.tierId} className="flex justify-between">
                  <span className="text-entreo-muted">
                    {item.quantity}x {item.tierName}
                  </span>
                  <span className="font-medium text-entreo-ink">
                    € {(item.quantity * item.unitPrice).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="pt-2 border-t border-entreo-border/60">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Rabattcode (z.B. ENTREO10)"
                  className="flex-1 text-xs p-2 rounded-lg border border-entreo-border uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-entreo-red"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-entreo-chip hover:bg-entreo-chip-hover text-entreo-ink text-xs font-semibold rounded-lg transition-colors"
                >
                  {lang === 'DE' ? 'Anwenden' : 'Apply'}
                </button>
              </div>
              {appliedDiscount > 0 && (
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  ✓ {appliedDiscount}% Rabatt erfolgreich angewendet!
                </p>
              )}
              {promoError && <p className="text-[11px] text-red-600 mt-1">{promoError}</p>}
            </form>

            {/* Cost Breakdown */}
            <div className="space-y-1.5 pt-2 border-t border-entreo-border/60 text-xs text-entreo-muted">
              <div className="flex justify-between">
                <span>{lang === 'DE' ? 'Zwischensumme' : 'Subtotal'}</span>
                <span>€ {subtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Rabatt ({appliedDiscount}%)</span>
                  <span>- € {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{lang === 'DE' ? 'Buchungs- & Systemgebühren' : 'Booking fees'}</span>
                <span>€ {totalFees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>{lang === 'DE' ? 'Darin enthaltene MwSt. (19%)' : 'Incl. 19% German VAT'}</span>
                <span>€ {vatAmount.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-entreo-border flex justify-between text-base font-extrabold text-entreo-ink">
                <span>{lang === 'DE' ? 'Gesamtbetrag' : 'Total Payable'}</span>
                <span className="text-entreo-red text-lg">€ {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-2 space-y-2">
              <label className="flex items-start gap-2 text-[11px] text-entreo-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 accent-entreo-red rounded"
                />
                <span>
                  {lang === 'DE'
                    ? 'Ich akzeptiere die AGB, die Widerrufsbelehrung für Freizeitveranstaltungen sowie die Datenschutzbestimmungen.'
                    : 'I agree to the Terms of Service, refund conditions and Privacy Policy.'}
                </span>
              </label>
              {errors.terms && <p className="text-[10px] text-red-600">{errors.terms}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={isProcessing || totalTickets === 0}
              className="w-full bg-entreo-red hover:bg-entreo-red-hover text-white font-semibold py-3.5 px-6 rounded-pill flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-entreo-red"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{lang === 'DE' ? 'Zahlung wird verarbeitet...' : 'Processing Payment...'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {lang === 'DE'
                      ? `Zahlungspflichtig buchen (€ ${grandTotal.toFixed(2)})`
                      : `Complete Booking (€ ${grandTotal.toFixed(2)})`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

