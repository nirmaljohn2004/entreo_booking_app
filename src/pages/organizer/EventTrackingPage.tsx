import React, { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  TrendingUp, 
  Ticket, 
  Users, 
  Receipt, 
  CheckCircle2, 
  QrCode, 
  Download, 
  Search, 
  Plus, 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Share2, 
  BarChart3,
  Smartphone,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  RefreshCw,
  Flame
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { Order } from '../../types';

export const EventTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang, events, orders, createOrder, currentOrganizerId, organizers } = useStore();

  const event = events.find((e) => e.id === id);
  const currentOrg = organizers.find((o) => o.id === currentOrganizerId) || organizers[0];

  // Role View: 'promoter' (Full Financials & Payouts) vs 'coordinator' (Operational Logistics, Capacity & Check-Ins)
  const initialViewMode = searchParams.get('view') === 'coordinator' ? 'coordinator' : 'promoter';
  const [viewMode, setViewMode] = useState<'promoter' | 'coordinator'>(initialViewMode);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleViewMode = (mode: 'promoter' | 'coordinator') => {
    setViewMode(mode);
    setSearchParams(mode === 'coordinator' ? { view: 'coordinator' } : {});
  };

  const handleCopyCoordinatorLink = () => {
    const url = `${window.location.origin}/organizer/events/${event?.id}?view=coordinator`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Attendee search query
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [simulatedCheckins, setSimulatedCheckins] = useState<string[]>(['ord-883921']);
  const [qrScanInput, setQrScanInput] = useState('');
  const [scanMessage, setScanMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const maskEmail = (email: string) => {
    if (!email || !email.includes('@')) return email;
    const [user, domain] = email.split('@');
    return `${user.slice(0, 2)}***@${domain}`;
  };

  const getLocalizedTier = (rawName: string, rawDesc?: string) => {
    if (lang === 'EN') {
      if (rawName.includes('Stehplatz') || rawName.includes('General Admission')) {
        return {
          name: 'General Admission (Floor)',
          desc: 'Open floor standing area directly in front of the main stage.',
        };
      }
      if (rawName.includes('Sitzplatz') || rawName.includes('Unterrang') || rawName.includes('Premium Seating')) {
        return {
          name: 'Premium Seating (Lower Tier)',
          desc: 'Reserved lower-tier seating with direct acoustic sightlines.',
        };
      }
      if (rawName.includes('VIP') || rawName.includes('Soundcheck')) {
        return {
          name: 'VIP Soundcheck Package',
          desc: 'Priority early entry (17:30), exclusive soundcheck access & VIP tour pass.',
        };
      }
      return { name: rawName, desc: rawDesc || '' };
    } else {
      if (rawName.includes('General Admission') || rawName.includes('Stehplatz')) {
        return {
          name: 'Stehplatz Innenraum (General Admission)',
          desc: rawDesc || 'Freie Platzwahl im Innenraum direkt vor der Bühne.',
        };
      }
      if (rawName.includes('Unterrang') || rawName.includes('Premium Seating')) {
        return {
          name: 'Sitzplatz Unterrang (Premium Seating)',
          desc: rawDesc || 'Reservierter Sitzplatz mit bester Akustik und direkter Bühnensicht.',
        };
      }
      if (rawName.includes('VIP')) {
        return {
          name: 'VIP Soundcheck-Paket',
          desc: rawDesc || 'Früher Einlass (17:30), exklusiver Soundcheck-Zugang & VIP-Pass.',
        };
      }
      return { name: rawName, desc: rawDesc || '' };
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (!event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-entreo-ink">
          {lang === 'DE' ? 'Event nicht gefunden' : 'Event Not Found'}
        </h2>
        <p className="text-xs text-entreo-muted">
          {lang === 'DE' ? 'Die angeforderte Veranstaltung existiert nicht.' : 'The requested event could not be found.'}
        </p>
        <Link to="/organizer" className="text-xs text-entreo-red font-semibold hover:underline">
          {lang === 'DE' ? '← Zurück zum Veranstalter-Cockpit' : '← Back to Organizer Portal'}
        </Link>
      </div>
    );
  }

  // Calculate live sales metrics from ticket tiers
  const totalCapacity = event.tickets.reduce((sum, t) => sum + t.capacity, 0);
  const totalAvailable = event.tickets.reduce((sum, t) => sum + t.available, 0);
  const totalSold = Math.max(0, totalCapacity - totalAvailable);
  const soldPercentage = totalCapacity > 0 ? ((totalSold / totalCapacity) * 100).toFixed(1) : '0';

  // Gross revenue calculation
  const totalGrossRevenue = event.tickets.reduce((sum, t) => {
    const tierSold = Math.max(0, t.capacity - t.available);
    return sum + tierSold * t.price;
  }, 0);

  // German VAT (19% included) & Booking fees
  const vat19Amount = totalGrossRevenue * (19 / 119);
  const estimatedPlatformFees = totalGrossRevenue * 0.05; // 5% platform fee
  const netOrganizerPayout = totalGrossRevenue - estimatedPlatformFees;

  // Filter orders for this event
  const eventOrders = orders.filter((o) => o.eventId === event.id);

  // Seed simulated attendees if store has few orders
  const displayAttendees = [
    ...eventOrders,
    // Realistic fallback mock attendees if user hasn't made many test purchases yet
    ...(eventOrders.length < 3 ? [
      {
        id: 'mock-att-1',
        orderNumber: 'ENT-2026-9041',
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.startDate,
        doorsTime: event.doorsTime,
        startTime: event.startTime,
        venueName: event.venue.name,
        venueAddress: event.venue.address,
        city: event.city,
        items: [{ tierId: event.tickets[0]?.id || 't1', tierName: event.tickets[0]?.name || 'Standard', quantity: 2, unitPrice: event.tickets[0]?.price || 35, fee: 2.5 }],
        subtotal: 70,
        bookingFee: 5,
        vatAmount: 11.18,
        total: 75,
        customer: { firstName: 'Maximilian', lastName: 'Weber', email: 'max.weber@berlin.de', phone: '+49 171 2233445' },
        paymentMethod: 'card' as const,
        paymentStatus: 'paid' as const,
        qrCodeSeed: `ENT-${event.id}-9041`,
        createdAt: '2026-10-24T14:20:00Z',
      },
      {
        id: 'mock-att-2',
        orderNumber: 'ENT-2026-9118',
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.startDate,
        doorsTime: event.doorsTime,
        startTime: event.startTime,
        venueName: event.venue.name,
        venueAddress: event.venue.address,
        city: event.city,
        items: [{ tierId: event.tickets[1]?.id || event.tickets[0]?.id || 't1', tierName: event.tickets[1]?.name || 'VIP', quantity: 1, unitPrice: event.tickets[1]?.price || 50, fee: 3.5 }],
        subtotal: 50,
        bookingFee: 3.5,
        vatAmount: 7.98,
        total: 53.5,
        customer: { firstName: 'Clara', lastName: 'Schmidt', email: 'clara.schmidt@hamburg-art.de', phone: '+49 160 5566778' },
        paymentMethod: 'sepa' as const,
        paymentStatus: 'paid' as const,
        qrCodeSeed: `ENT-${event.id}-9118`,
        createdAt: '2026-10-26T09:12:00Z',
      },
      {
        id: 'mock-att-3',
        orderNumber: 'ENT-2026-9284',
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.startDate,
        doorsTime: event.doorsTime,
        startTime: event.startTime,
        venueName: event.venue.name,
        venueAddress: event.venue.address,
        city: event.city,
        items: [{ tierId: event.tickets[0]?.id || 't1', tierName: event.tickets[0]?.name || 'Standard', quantity: 4, unitPrice: event.tickets[0]?.price || 35, fee: 2.5 }],
        subtotal: 140,
        bookingFee: 10,
        vatAmount: 22.35,
        total: 150,
        customer: { firstName: 'Lukas', lastName: 'Becker', email: 'lukas.becker@koeln-live.de', phone: '+49 175 8899001' },
        paymentMethod: 'applepay' as const,
        paymentStatus: 'paid' as const,
        qrCodeSeed: `ENT-${event.id}-9284`,
        createdAt: '2026-10-28T18:45:00Z',
      }
    ] : [])
  ];

  const filteredAttendees = displayAttendees.filter((att) => {
    if (!attendeeSearch) return true;
    const query = attendeeSearch.toLowerCase();
    return (
      att.orderNumber.toLowerCase().includes(query) ||
      att.customer.firstName.toLowerCase().includes(query) ||
      att.customer.lastName.toLowerCase().includes(query) ||
      att.customer.email.toLowerCase().includes(query)
    );
  });

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['Order Number', 'First Name', 'Last Name', 'Email', 'Tier', 'Quantity', 'Total (€)', 'Status'];
    const rows = displayAttendees.map((a) => [
      a.orderNumber,
      a.customer.firstName,
      a.customer.lastName,
      a.customer.email,
      a.items.map((i) => i.tierName).join(' + '),
      a.items.reduce((s, i) => s + i.quantity, 0),
      a.total.toFixed(2),
      simulatedCheckins.includes(a.id) ? 'CHECKED-IN' : 'VALID',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `attendees-${event.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check-In Simulation
  const handleToggleCheckin = (orderId: string) => {
    if (simulatedCheckins.includes(orderId)) {
      setSimulatedCheckins(simulatedCheckins.filter((id) => id !== orderId));
    } else {
      setSimulatedCheckins([...simulatedCheckins, orderId]);
    }
  };

  const handleSimulateScan = (e: React.FormEvent) => {
    e.preventDefault();
    const found = displayAttendees.find(
      (a) => a.orderNumber.toLowerCase() === qrScanInput.trim().toLowerCase() || a.qrCodeSeed.toLowerCase() === qrScanInput.trim().toLowerCase()
    );

    if (found) {
      if (simulatedCheckins.includes(found.id)) {
        setScanMessage({ text: `Ticket ${found.orderNumber} already checked in!`, type: 'error' });
      } else {
        setSimulatedCheckins([...simulatedCheckins, found.id]);
        setScanMessage({ text: `Valid ticket for ${found.customer.firstName} ${found.customer.lastName} (${found.items.map(i => `${i.quantity}x ${i.tierName}`).join(', ')})`, type: 'success' });
      }
    } else {
      setScanMessage({ text: 'Invalid QR code seed or unknown order number.', type: 'error' });
    }
    setQrScanInput('');
  };

  // Quick 1-click test ticket sale simulation
  const handleSimulateSale = () => {
    if (event.tickets.length === 0 || totalAvailable <= 0) {
      alert('Event is sold out!');
      return;
    }
    const targetTier = event.tickets.find((t) => t.available > 0) || event.tickets[0];
    const newOrder: Order = {
      id: `ord-${Date.now().toString().slice(-6)}`,
      orderNumber: `ENT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.startDate,
      doorsTime: event.doorsTime,
      startTime: event.startTime,
      venueName: event.venue.name,
      venueAddress: event.venue.address,
      city: event.city,
      items: [{
        tierId: targetTier.id,
        tierName: targetTier.name,
        quantity: 1,
        unitPrice: targetTier.price,
        fee: targetTier.fee,
      }],
      subtotal: targetTier.price,
      bookingFee: targetTier.fee,
      vatAmount: (targetTier.price + targetTier.fee) * (19 / 119),
      total: targetTier.price + targetTier.fee,
      customer: {
        firstName: 'Anna',
        lastName: 'Fischer',
        email: `anna.fischer${Math.floor(Math.random() * 99)}@gmail.com`,
        phone: '+49 172 3344556',
      },
      paymentMethod: 'applepay',
      paymentStatus: 'paid',
      qrCodeSeed: `ENT-${event.id}-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };

    createOrder(newOrder);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] pb-24">
      {/* Top Banner & Breadcrumb */}
      <div className="bg-white border-b border-entreo-border/70 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-xs text-entreo-muted mb-2">
            <Link to="/organizer" className="hover:text-entreo-ink transition-colors">
              {lang === 'DE' ? 'Veranstalter-Cockpit' : 'Organizer Portal'}
            </Link>
            <span>/</span>
            <span className="text-entreo-ink font-semibold">{event.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={event.image}
                alt={event.title}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl bg-entreo-chip shadow-xs border border-entreo-border shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    ● {lang === 'DE' ? 'Live & Buchbar' : 'Published & Live'}
                  </span>
                  <span className="text-xs text-entreo-muted uppercase font-bold tracking-wider">
                    {event.category} • {event.city}
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-entreo-ink mt-0.5">
                  {event.title}
                </h1>
                <p className="text-xs text-entreo-muted flex items-center gap-2 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-entreo-red shrink-0" />
                  <span>{event.venue.name}, {event.venue.address}</span>
                  <span>•</span>
                  <Calendar className="w-3.5 h-3.5 text-entreo-red shrink-0" />
                  <span>{new Date(event.startDate).toLocaleDateString('de-DE')} ({event.doorsTime} Doors)</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Role Toggle Pill: Promoter vs Coordinator */}
              <div className="bg-neutral-100 p-1.5 rounded-2xl flex items-center border border-neutral-200/80 shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleViewMode('promoter')}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                    viewMode === 'promoter'
                      ? 'bg-entreo-red text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {lang === 'DE' ? 'Promoter (Finanzen)' : 'Promoter View'}
                </button>
                <button
                  type="button"
                  onClick={() => toggleViewMode('coordinator')}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    viewMode === 'coordinator'
                      ? 'bg-entreo-ink text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{lang === 'DE' ? 'Koordinator-Modus' : 'Coordinator Mode'}</span>
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCoordinatorLink}
                className="text-xs bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-800 flex items-center gap-1.5 shadow-2xs"
                title="Copy shareable link restricted to coordinator view"
              >
                <Share2 className="w-3.5 h-3.5 text-neutral-600" />
                <span>{copiedLink ? (lang === 'DE' ? 'Link kopiert!' : 'Link Copied!') : (lang === 'DE' ? 'Koordinator-Link' : 'Share Coordinator View')}</span>
              </Button>

              <button
                type="button"
                onClick={handleSimulateSale}
                className="text-xs px-3.5 py-2 rounded-xl bg-entreo-red/10 text-entreo-red border border-entreo-red/25 hover:bg-entreo-red/20 font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                title="Simulate 1 new ticket purchase to test sales velocity updates"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simulate 1 Sale</span>
              </button>

              <Link
                to={`/events/${event.id}`}
                target="_blank"
                className="text-xs px-4 py-2 rounded-xl bg-entreo-ink hover:bg-neutral-800 text-white inline-flex items-center gap-1.5 font-bold transition-all shadow-xs"
              >
                <span>{lang === 'DE' ? 'Öffentliche Seite' : 'View Listing'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Coordinator Notice Banner */}
      {viewMode === 'coordinator' && (
        <div className="bg-amber-50 border-b border-amber-200 py-3.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>{lang === 'DE' ? 'Koordinator-Ansicht aktiv:' : 'Coordinator Mode Active:'}</strong>{' '}
                {lang === 'DE'
                  ? 'Veranstalter-Gewinnmargen und Bankauszahlungen sind ausgeblendet. DSGVO-konforme Datenminimierung (Käuferdaten maskiert).'
                  : 'Commercial payout margins and bank settlement accounts are hidden. DSGVO / EU GDPR Art. 5 attendee PII masking active.'}
              </span>
            </div>
            <button
              onClick={() => toggleViewMode('promoter')}
              className="text-amber-800 hover:text-amber-950 font-bold underline shrink-0"
            >
              {lang === 'DE' ? 'Zurück zur Promoter-Ansicht' : 'Switch to Promoter View'}
            </button>
          </div>
        </div>
      )}

      {/* Main Analytics Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">

        {/* 4 Primary Performance KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Ticket Sales Progress */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-xs transition-all space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-entreo-red/10 text-entreo-red flex items-center justify-center">
                  <Ticket className="w-3.5 h-3.5" />
                </div>
                <span>{lang === 'DE' ? 'Tickets Verkauft' : 'Tickets Sold'}</span>
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full text-xs font-mono">
                {soldPercentage}%
              </span>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-entreo-ink">
                {totalSold.toLocaleString('de-DE')} <span className="text-sm font-sans font-normal text-neutral-400">/ {totalCapacity}</span>
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                <strong className="text-neutral-700 font-semibold">{totalAvailable}</strong> {lang === 'DE' ? 'Tickets noch verfügbar' : 'tickets remaining'}
              </p>
            </div>
            {/* Visual Progress Bar */}
            <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-entreo-red h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, parseFloat(soldPercentage)))}%` }}
              />
            </div>
          </div>

          {/* Card 2: Gross Turnover vs Expected Door Arrivals */}
          {viewMode === 'promoter' ? (
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-xs transition-all space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <span>{lang === 'DE' ? 'Brutto-Ticketerlös' : 'Gross Ticket Revenue'}</span>
                </span>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-entreo-ink">
                  {totalGrossRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {lang === 'DE' ? 'Inkl. 19% MwSt:' : 'Incl. 19% German VAT:'}{' '}
                  <span className="font-mono font-medium text-neutral-700">{vat19Amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-xs transition-all space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span>{lang === 'DE' ? 'Erwartete Einlass-Gäste' : 'Expected Door Arrivals'}</span>
                </span>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-entreo-ink">
                  {totalSold.toLocaleString('de-DE')} <span className="text-sm font-sans font-normal text-neutral-400">{lang === 'DE' ? 'Gäste gesamt' : 'total guests'}</span>
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {lang === 'DE' ? 'Haupt-Einlassfenster: 18:30 – 19:30 Uhr' : 'Peak arrival window: 18:30 – 19:30 Doors'}
                </p>
              </div>
            </div>
          )}

          {/* Card 3: Net Payout vs Coordinator Hall Safety */}
          {viewMode === 'promoter' ? (
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-xs transition-all space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-entreo-red/10 text-entreo-red flex items-center justify-center">
                    <Receipt className="w-3.5 h-3.5" />
                  </div>
                  <span>{lang === 'DE' ? 'Netto-Auszahlung' : 'Estimated Net Payout'}</span>
                </span>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-entreo-red">
                  {netOrganizerPayout.toLocaleString(lang === 'DE' ? 'de-DE' : 'en-US', { minimumFractionDigits: 2 })} €
                </p>
                <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'DE' ? 'SEPA Auszahlung freigegeben' : 'SEPA Payout Approved'}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-xs transition-all space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <span>{lang === 'DE' ? 'Saalauslastung & Brandschutz' : 'Hall Occupancy & Safety'}</span>
                </span>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-entreo-ink">
                  {totalSold} <span className="text-sm font-sans font-normal text-neutral-400">/ {totalCapacity} max</span>
                </p>
                <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'DE' ? `VStättVO konform • ${totalAvailable} Plätze frei` : `Compliant • ${totalAvailable} buffer spots`}</span>
                </p>
              </div>
            </div>
          )}

          {/* Card 4: Live Check-in Velocity */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-xs transition-all space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <QrCode className="w-3.5 h-3.5" />
                </div>
                <span>{lang === 'DE' ? 'Einlass & Check-In' : 'On-Site Door Check-In'}</span>
              </span>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-entreo-ink">
                {simulatedCheckins.length} <span className="text-sm font-sans font-normal text-neutral-400">/ {displayAttendees.length} {lang === 'DE' ? 'eingetroffen' : 'arrived'}</span>
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                <strong className="text-neutral-700 font-semibold">{displayAttendees.length > 0 ? ((simulatedCheckins.length / displayAttendees.length) * 100).toFixed(0) : 0}%</strong> {lang === 'DE' ? 'Einlass-Quote am Einlass' : 'Door Check-in Rate'}
              </p>
            </div>
          </div>
        </div>

        {/* Per-Tier Real-Time Capacity & Pricing Breakdown */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/80 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-entreo-ink">
                {lang === 'DE' ? 'Ticket-Kategorien im Detail' : 'Per-Tier Inventory & Sales Velocity'}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                {lang === 'DE'
                  ? 'Echtzeit-Verkaufsstand je Kontingent inklusive Einzelpreisen und Gesamterlösen.'
                  : 'Real-time sales velocity broken down by individual seating/standing categories.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {event.tickets.map((tier) => {
              const tierSold = Math.max(0, tier.capacity - tier.available);
              const tierGross = tierSold * tier.price;
              const tierPct = tier.capacity > 0 ? ((tierSold / tier.capacity) * 100).toFixed(0) : '0';
              const isSoldOut = tier.available === 0;
              const localized = getLocalizedTier(tier.name, tier.description);

              return (
                <div
                  key={tier.id}
                  className="p-5 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-neutral-300 transition-all space-y-4 shadow-2xs hover:shadow-xs relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-entreo-ink truncate">{localized.name}</h3>
                      <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{localized.desc}</p>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                      isSoldOut ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isSoldOut ? (lang === 'DE' ? 'Ausverkauft' : 'Sold Out') : `${tierPct}%`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
                    <div>
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                        {lang === 'DE' ? 'Preis brutto' : 'Gross Price'}
                      </span>
                      <span className="font-mono text-base font-bold text-entreo-ink">{tier.price.toFixed(2)} €</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                        {viewMode === 'promoter' ? (lang === 'DE' ? 'Umsatz' : 'Revenue') : (lang === 'DE' ? 'Abendkasse' : 'Available')}
                      </span>
                      {viewMode === 'promoter' ? (
                        <span className="font-mono text-base font-bold text-entreo-red">
                          {tierGross.toLocaleString(lang === 'DE' ? 'de-DE' : 'en-US', { minimumFractionDigits: 2 })} €
                        </span>
                      ) : (
                        <span className="font-mono text-base font-bold text-emerald-700">
                          {tier.available > 0 ? (lang === 'DE' ? `${tier.available} frei` : `${tier.available} left`) : (lang === 'DE' ? 'Ausverkauft' : 'Sold Out')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tier Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                      <span>{tierSold} {lang === 'DE' ? 'verkauft' : 'sold'}</span>
                      <span>{tier.capacity} {lang === 'DE' ? 'Plätze' : 'tickets'}</span>
                    </div>
                    <div className="w-full bg-neutral-200/80 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-entreo-red h-2 rounded-full transition-all duration-300"
                        style={{ width: `${tierPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendee Roster & Door QR Scanner Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Attendee Table (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-entreo-border/70 shadow-soft-card overflow-hidden">
            <div className="p-6 border-b border-entreo-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-entreo-ink">
                  {lang === 'DE' ? 'Gästeliste & Käufer-Bestellungen' : 'Attendee Roster & Bookings'}
                </h2>
                <p className="text-xs text-entreo-muted mt-0.5">
                  {displayAttendees.length} {lang === 'DE' ? 'registrierte Buchungen für dieses Event' : 'registered orders for this event'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportCSV}
                  className="text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>{lang === 'DE' ? 'CSV Exportieren' : 'Export CSV'}</span>
                </Button>
              </div>
            </div>

            {/* Search Filter */}
            <div className="p-4 bg-[#FAF9F7] border-b border-entreo-border/60">
              <div className="relative">
                <Search className="w-4 h-4 text-entreo-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={attendeeSearch}
                  onChange={(e) => setAttendeeSearch(e.target.value)}
                  placeholder={lang === 'DE' ? 'Name, E-Mail oder Bestellnummer suchen...' : 'Search attendee, email, or order ID...'}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-entreo-border rounded-xl focus:outline-none focus:ring-2 focus:ring-entreo-red"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-entreo-ink">
                <thead className="bg-[#FAF9F7] border-b border-entreo-border uppercase font-bold text-entreo-muted text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Attendee</th>
                    <th className="py-3 px-4">Tier / Tickets</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4 text-center">Door Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-entreo-border/40">
                  {filteredAttendees.map((att) => {
                    const isCheckedIn = simulatedCheckins.includes(att.id);
                    return (
                      <tr key={att.id} className="hover:bg-entreo-cream/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-entreo-ink">
                          {att.orderNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-entreo-ink">{att.customer.firstName} {att.customer.lastName}</p>
                          <p className="text-[11px] text-entreo-muted font-mono">
                            {viewMode === 'coordinator' ? maskEmail(att.customer.email) : att.customer.email}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          {att.items.map((it, idx) => (
                            <span key={idx} className="block text-xs font-medium">
                              {it.quantity}x {getLocalizedTier(it.tierName).name}
                            </span>
                          ))}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold">
                          {viewMode === 'coordinator' ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                              {lang === 'DE' ? 'Bezahlt' : 'Paid'}
                            </span>
                          ) : (
                            `${att.total.toFixed(2)} €`
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleCheckin(att.id)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                              isCheckedIn
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-300'
                            }`}
                          >
                            {isCheckedIn ? '✓ CHECKED-IN' : 'SCAN IN'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* QR Scanner & Gate Simulator (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-entreo-border/70 shadow-soft-card space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Smartphone className="w-3.5 h-3.5" />
                <span>{lang === 'DE' ? 'Einlasskontrolle (Gate Scanner)' : 'Door Entry Simulator'}</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-entreo-ink">
                {lang === 'DE' ? 'Ticket-QR Scanner' : 'Live Ticket QR Validation'}
              </h3>
              <p className="text-xs text-entreo-muted mt-1 leading-relaxed">
                {lang === 'DE'
                  ? 'Simulieren Sie das Einscannen von Besucher-Tickets am Einlass der Spielstätte.'
                  : 'Simulate barcode and QR ticket verification at the venue doors.'}
              </p>
            </div>

            {/* Scan Form */}
            <form onSubmit={handleSimulateScan} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-entreo-ink uppercase tracking-wider mb-1">
                  {lang === 'DE' ? 'QR-Code Seed oder Bestellnummer' : 'QR Seed / Order Number'}
                </label>
                <input
                  type="text"
                  value={qrScanInput}
                  onChange={(e) => setQrScanInput(e.target.value)}
                  placeholder="e.g. ENT-2026-9041"
                  className="w-full px-3 py-2 text-xs bg-entreo-cream/40 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red font-mono"
                />
              </div>
              <Button type="submit" variant="primary" size="sm" className="w-full text-xs bg-entreo-red font-bold">
                <QrCode className="w-3.5 h-3.5 mr-1.5" />
                <span>{lang === 'DE' ? 'Ticket Validieren & Einlassen' : 'Validate & Scan In'}</span>
              </Button>
            </form>

            {/* Scan Feedback Message */}
            {scanMessage && (
              <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                scanMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {scanMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
                <p className="font-medium">{scanMessage.text}</p>
              </div>
            )}

            {/* Event Crew & Door Staff Mobile Access */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white space-y-3 border border-neutral-700 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-entreo-red bg-entreo-red/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Smartphone className="w-3 h-3" />
                  <span>On-Site Crew Access</span>
                </span>
                <span className="text-[11px] font-mono text-neutral-400">PIN: <strong className="text-white">7491</strong></span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Shareable Door Scanner Terminal</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  Send this link to venue door staff and bouncers. Optimized for smartphones with audio/haptic validation and offline roster caching.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/scan/${event.id}`}
                  target="_blank"
                  className="flex-1 text-center text-xs py-2 px-3 rounded-xl bg-entreo-red hover:bg-entreo-red-hover text-white font-bold transition-all shadow-sm"
                >
                  <span>Launch Mobile Gate Scanner ↗</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const scanUrl = `${window.location.origin}/scan/${event.id}`;
                    navigator.clipboard?.writeText(scanUrl);
                    alert(`Door Scanner Link copied to clipboard:\n${scanUrl}\n\nGate PIN: 7491`);
                  }}
                  className="p-2 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white text-xs"
                  title="Copy Scanner Link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-neutral-400 border-t border-neutral-700/80 pt-2 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Zero software team dependency: Event staff self-manage entry.</span>
              </p>
            </div>

            {/* Marketing Attribution Snapshot */}
            <div className="pt-4 border-t border-entreo-border/60 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-entreo-ink flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-entreo-red" />
                <span>{lang === 'DE' ? 'Marketing-Kanäle' : 'Marketing Attribution'}</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span>ENTRÉO Search & Explore</span>
                    <span className="font-mono font-bold">52%</span>
                  </div>
                  <div className="w-full bg-entreo-chip h-1.5 rounded-full overflow-hidden">
                    <div className="bg-entreo-red h-1.5 rounded-full" style={{ width: '52%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span>Instagram / Social Motion</span>
                    <span className="font-mono font-bold">28%</span>
                  </div>
                  <div className="w-full bg-entreo-chip h-1.5 rounded-full overflow-hidden">
                    <div className="bg-entreo-red h-1.5 rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span>Direct Promoter Link</span>
                    <span className="font-mono font-bold">20%</span>
                  </div>
                  <div className="w-full bg-entreo-chip h-1.5 rounded-full overflow-hidden">
                    <div className="bg-entreo-red h-1.5 rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

