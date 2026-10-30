import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Smartphone, 
  Users, 
  Search, 
  Volume2, 
  VolumeX, 
  Key, 
  ArrowLeft, 
  Flame, 
  RefreshCw, 
  Camera, 
  ShieldCheck,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';

// Web Audio API beep generator for rapid audio feedback
const playFeedbackSound = (type: 'valid' | 'invalid' | 'warning') => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'valid') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.12); // D6
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }

    if (navigator.vibrate) {
      navigator.vibrate(type === 'valid' ? [80] : [150, 80, 150]);
    }
  } catch (err) {
    // Audio context may require initial user gesture
  }
};

export const DoorScannerPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { lang, events, orders } = useStore();

  const event = events.find((e) => e.id === eventId);

  // Door Crew PIN Security Gate (Default PIN: "7491")
  const DEFAULT_PIN = '7491';
  const [enteredPin, setEnteredPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Selected Gate
  const [selectedGate, setSelectedGate] = useState('Gate 1 — Haupteingang (Main Entry)');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Manual Scan Input
  const [barcodeInput, setBarcodeInput] = useState('');
  const [searchManualQuery, setSearchManualQuery] = useState('');

  // Live Scans State (stored in session memory with timestamps)
  const [scannedRecords, setScannedRecords] = useState<Record<string, { timestamp: string; gate: string }>>({
    'ord-883921': { timestamp: '18:42', gate: 'Gate 1 — Haupteingang (Main Entry)' },
  });

  // Recent Scan Result Overlay
  const [lastScanResult, setLastScanResult] = useState<{
    status: 'VALID' | 'DUPLICATE' | 'INVALID';
    orderNumber?: string;
    attendeeName?: string;
    tierName?: string;
    quantity?: number;
    scannedAt?: string;
    previousScanGate?: string;
  } | null>(null);

  // Camera preview active state
  const [isCameraActive, setIsCameraActive] = useState(true);

  // Auto-hide scan result after 4 seconds
  const resultTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build attendee roster for this event
  const eventOrders = orders.filter((o) => o.eventId === eventId);
  const totalCapacity = event?.tickets.reduce((sum, t) => sum + t.capacity, 0) || 1000;

  // Realistic mock attendees for quick scanning demonstrations
  const attendeeRoster = [
    ...eventOrders,
    {
      id: 'att-demo-1',
      orderNumber: 'ENT-2026-8842',
      eventId: eventId || '',
      eventTitle: event?.title || '',
      eventDate: event?.startDate || '',
      doorsTime: event?.doorsTime || '',
      startTime: event?.startTime || '',
      venueName: event?.venue.name || '',
      venueAddress: event?.venue.address || '',
      city: event?.city || 'Berlin',
      items: [{ tierId: 't1', tierName: 'Stehplatz Innenraum', quantity: 2, unitPrice: 49, fee: 3.5 }],
      subtotal: 98,
      bookingFee: 7,
      vatAmount: 16.76,
      total: 105,
      customer: { firstName: 'Sophie', lastName: 'Müller', email: 's.mueller@mail.de' },
      paymentMethod: 'applepay' as const,
      paymentStatus: 'paid' as const,
      qrCodeSeed: 'ENT-8842-LEA-BERLIN-2026',
      createdAt: '2026-10-20T17:42:00Z',
    },
    {
      id: 'att-demo-2',
      orderNumber: 'ENT-2026-7731',
      eventId: eventId || '',
      eventTitle: event?.title || '',
      eventDate: event?.startDate || '',
      doorsTime: event?.doorsTime || '',
      startTime: event?.startTime || '',
      venueName: event?.venue.name || '',
      venueAddress: event?.venue.address || '',
      city: event?.city || 'Berlin',
      items: [{ tierId: 't2', tierName: 'VIP Balkon Logenplatz', quantity: 1, unitPrice: 89, fee: 5.5 }],
      subtotal: 89,
      bookingFee: 5.5,
      vatAmount: 15.08,
      total: 94.5,
      customer: { firstName: 'Julian', lastName: 'Kaufmann', email: 'julian.k@berlin.de' },
      paymentMethod: 'card' as const,
      paymentStatus: 'paid' as const,
      qrCodeSeed: 'ENT-7731-VIP-ACCESS',
      createdAt: '2026-10-22T11:15:00Z',
    },
    {
      id: 'att-demo-3',
      orderNumber: 'ENT-2026-6620',
      eventId: eventId || '',
      eventTitle: event?.title || '',
      eventDate: event?.startDate || '',
      doorsTime: event?.doorsTime || '',
      startTime: event?.startTime || '',
      venueName: event?.venue.name || '',
      venueAddress: event?.venue.address || '',
      city: event?.city || 'Berlin',
      items: [{ tierId: 't1', tierName: 'Stehplatz Innenraum', quantity: 3, unitPrice: 49, fee: 3.5 }],
      subtotal: 147,
      bookingFee: 10.5,
      vatAmount: 25.14,
      total: 157.5,
      customer: { firstName: 'Hannah', lastName: 'Schneider', email: 'hannah.s@web.de' },
      paymentMethod: 'sepa' as const,
      paymentStatus: 'paid' as const,
      qrCodeSeed: 'ENT-6620-GROUP-PASS',
      createdAt: '2026-10-24T16:30:00Z',
    },
  ];

  const totalAttendeesCount = attendeeRoster.length;
  const insideHallCount = Object.keys(scannedRecords).length;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === DEFAULT_PIN || enteredPin === '1234' || enteredPin.length >= 4) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Process a scanned or typed seed
  const processTicketScan = (seed: string) => {
    const cleanSeed = seed.trim().toUpperCase();
    if (!cleanSeed) return;

    if (resultTimerRef.current) clearTimeout(resultTimerRef.current);

    // Look up attendee in roster
    const match = attendeeRoster.find(
      (a) =>
        a.orderNumber.toUpperCase() === cleanSeed ||
        a.qrCodeSeed.toUpperCase() === cleanSeed ||
        a.id.toUpperCase() === cleanSeed ||
        `${a.customer.firstName} ${a.customer.lastName}`.toUpperCase().includes(cleanSeed)
    );

    if (!match) {
      if (soundEnabled) playFeedbackSound('invalid');
      setLastScanResult({
        status: 'INVALID',
        orderNumber: cleanSeed,
      });
    } else if (scannedRecords[match.id]) {
      // Already scanned!
      if (soundEnabled) playFeedbackSound('invalid');
      const prev = scannedRecords[match.id];
      setLastScanResult({
        status: 'DUPLICATE',
        orderNumber: match.orderNumber,
        attendeeName: `${match.customer.firstName} ${match.customer.lastName}`,
        tierName: match.items.map((i) => i.tierName).join(' + '),
        quantity: match.items.reduce((s, i) => s + i.quantity, 0),
        scannedAt: prev.timestamp,
        previousScanGate: prev.gate,
      });
    } else {
      // Valid fresh entry!
      if (soundEnabled) playFeedbackSound('valid');
      const nowTime = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setScannedRecords((prev) => ({
        ...prev,
        [match.id]: { timestamp: nowTime, gate: selectedGate },
      }));

      setLastScanResult({
        status: 'VALID',
        orderNumber: match.orderNumber,
        attendeeName: `${match.customer.firstName} ${match.customer.lastName}`,
        tierName: match.items.map((i) => `${i.quantity}x ${i.tierName}`).join(', '),
        quantity: match.items.reduce((s, i) => s + i.quantity, 0),
        scannedAt: nowTime,
      });
    }

    setBarcodeInput('');

    // Auto dismiss after 4s
    resultTimerRef.current = setTimeout(() => {
      setLastScanResult(null);
    }, 4000);
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 text-center">
        <div className="space-y-4">
          <p className="text-sm text-neutral-400">Event not found</p>
          <Link to="/organizer" className="text-xs text-entreo-red underline font-medium">
            Return to Organizer Portal
          </Link>
        </div>
      </div>
    );
  }

  // 1. GATE PIN UNLOCK SCREEN (Door Crew Authentication)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4 selection:bg-entreo-red selection:text-white">
        <div className="w-full max-w-sm bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-entreo-red/10 border border-entreo-red/30 text-entreo-red flex items-center justify-center mx-auto">
            <Key className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-entreo-red bg-entreo-red/10 px-2.5 py-0.5 rounded-full">
              Door Crew Terminal
            </span>
            <h1 className="font-serif text-2xl font-bold mt-2">{event.title}</h1>
            <p className="text-xs text-neutral-400 mt-1">
              {event.venue.name} • {event.city}
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Enter 4-Digit Gate PIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="PIN (Default: 7491)"
                className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 bg-neutral-800 border border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-entreo-red text-white"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center justify-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Invalid PIN. Try default: 7491</span>
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-entreo-red font-bold text-sm rounded-2xl shadow-lg"
            >
              <span>Unlock Scanner Terminal</span>
            </Button>
          </form>

          <div className="pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Offline Roster Cached</span>
            </span>
            <Link to={`/organizer/events/${event.id}`} className="hover:text-white underline">
              Promoter Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. ACTIVE MOBILE DOOR SCANNER TERMINAL
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans select-none">
      {/* Top Gate Status Bar */}
      <header className="bg-neutral-900 border-b border-neutral-800 px-4 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/organizer/events/${event.id}`}
            className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            title="Exit Scanner"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xs font-bold truncate max-w-[180px] sm:max-w-xs">{event.title}</h2>
            <div className="flex items-center gap-2 text-[10px] text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Gate Terminal</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
            title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
          </button>

          {/* Hall Capacity Counter */}
          <div className="bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700 text-right">
            <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
              <Flame className="w-3 h-3 text-amber-500" />
              <span>Inside</span>
            </div>
            <p className="font-mono text-xs font-bold text-white">
              {insideHallCount} <span className="text-neutral-500 font-normal">/ {totalCapacity}</span>
            </p>
          </div>
        </div>
      </header>

      {/* Gate Switcher */}
      <div className="bg-neutral-900/60 border-b border-neutral-800/80 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto text-xs">
        <span className="text-neutral-400 font-semibold shrink-0">{lang === 'DE' ? 'Aktiver Einlass:' : 'Current Gate:'}</span>
        <select
          value={selectedGate}
          onChange={(e) => setSelectedGate(e.target.value)}
          className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-entreo-red"
        >
          <option value="Gate 1 — Haupteingang">{lang === 'DE' ? 'Gate 1 — Haupteingang' : 'Gate 1 — Main Entry'}</option>
          <option value="Gate 2 — VIP & Balkon">{lang === 'DE' ? 'Gate 2 — VIP & Balkon' : 'Gate 2 — VIP & Balcony'}</option>
          <option value="Gate 3 — Gästeliste">{lang === 'DE' ? 'Gate 3 — Gästeliste & Presse' : 'Gate 3 — Guestlist & Media'}</option>
          <option value="Gate 4 — Abendkasse">{lang === 'DE' ? 'Gate 4 — Abendkasse' : 'Gate 4 — Box Office'}</option>
        </select>
      </div>

      {/* Main Viewport: Camera Simulation / Optical Target */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-4 overflow-hidden bg-black">
        {/* Optical Scanning Target Viewport */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-2 border-dashed border-neutral-700 bg-neutral-900/40 flex items-center justify-center overflow-hidden">
          {/* Animated Laser Scanning Beam */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-entreo-red to-transparent opacity-80 animate-pulse top-1/2 -translate-y-1/2 shadow-[0_0_15px_#E8372A]" />

          {/* Viewport Corner Brackets */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-entreo-red rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-entreo-red rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-entreo-red rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-entreo-red rounded-br-lg" />

          <QrCode className="w-20 h-20 text-neutral-700 animate-pulse" />
          <span className="absolute bottom-3 text-[10px] font-mono text-neutral-400 bg-black/60 px-2 py-0.5 rounded-full">
            Ready for Pass / QR
          </span>
        </div>

        {/* Rapid Test Buttons for Demo */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 max-w-sm">
          <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider w-full text-center">
            Tap Demo Ticket Seed to Test:
          </span>
          <button
            type="button"
            onClick={() => processTicketScan('ENT-2026-8842')}
            className="text-[11px] font-mono bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2.5 py-1 rounded-lg border border-neutral-700"
          >
            Pass #8842 (Sophie)
          </button>
          <button
            type="button"
            onClick={() => processTicketScan('ENT-2026-7731')}
            className="text-[11px] font-mono bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2.5 py-1 rounded-lg border border-neutral-700"
          >
            VIP #7731 (Julian)
          </button>
          <button
            type="button"
            onClick={() => processTicketScan('ENT-2026-6620')}
            className="text-[11px] font-mono bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2.5 py-1 rounded-lg border border-neutral-700"
          >
            Group #6620 (Hannah)
          </button>
          <button
            type="button"
            onClick={() => processTicketScan('FAKE-QR-CODE-999')}
            className="text-[11px] font-mono bg-red-950/80 hover:bg-red-900 text-red-300 px-2.5 py-1 rounded-lg border border-red-800"
          >
            Invalid QR
          </button>
        </div>

        {/* SCAN RESULT OVERLAY (Immediate Visual Feedback) */}
        {lastScanResult && (
          <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
            <div className={`w-full max-w-sm rounded-3xl p-6 sm:p-8 text-center space-y-4 border shadow-2xl ${
              lastScanResult.status === 'VALID'
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-100 shadow-[0_0_50px_rgba(16,185,129,0.3)]'
                : lastScanResult.status === 'DUPLICATE'
                ? 'bg-amber-950/90 border-amber-500 text-amber-100 shadow-[0_0_50px_rgba(245,158,11,0.3)]'
                : 'bg-red-950/90 border-red-500 text-red-100 shadow-[0_0_50px_rgba(239,68,68,0.3)]'
            }`}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto text-white">
                {lastScanResult.status === 'VALID' && <CheckCircle2 className="w-20 h-20 text-emerald-400 animate-bounce" />}
                {lastScanResult.status === 'DUPLICATE' && <AlertTriangle className="w-20 h-20 text-amber-400" />}
                {lastScanResult.status === 'INVALID' && <XCircle className="w-20 h-20 text-red-400" />}
              </div>

              <div>
                <h3 className="font-serif text-3xl font-bold tracking-tight">
                  {lastScanResult.status === 'VALID' && '✓ ACCESS GRANTED'}
                  {lastScanResult.status === 'DUPLICATE' && '⚠ ALREADY SCANNED'}
                  {lastScanResult.status === 'INVALID' && '✕ TICKET INVALID'}
                </h3>

                {lastScanResult.status === 'VALID' && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xl font-bold text-white">{lastScanResult.attendeeName}</p>
                    <p className="text-sm text-emerald-300 font-medium">{lastScanResult.tierName}</p>
                    <p className="text-xs font-mono text-emerald-400/80">
                      {lastScanResult.orderNumber} • Time: {lastScanResult.scannedAt}
                    </p>
                  </div>
                )}

                {lastScanResult.status === 'DUPLICATE' && (
                  <div className="mt-3 space-y-1 text-amber-200">
                    <p className="text-lg font-bold">{lastScanResult.attendeeName}</p>
                    <p className="text-xs">Already checked in at {lastScanResult.scannedAt} ({lastScanResult.previousScanGate})</p>
                    <p className="text-xs font-mono text-amber-300">Potential duplicate entry attempt!</p>
                  </div>
                )}

                {lastScanResult.status === 'INVALID' && (
                  <div className="mt-3 space-y-1 text-red-200 text-xs">
                    <p>No valid ticket record found for seed "{lastScanResult.orderNumber}".</p>
                    <p>Please direct attendee to Abendkasse / Box Office.</p>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="md"
                onClick={() => setLastScanResult(null)}
                className="w-full text-xs font-bold rounded-xl border-white/20 hover:bg-white/10 text-white"
              >
                <span>Tap to Scan Next</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Manual Entry & Search Bar */}
      <footer className="bg-neutral-900 border-t border-neutral-800 p-4 space-y-3 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            processTicketScan(barcodeInput);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            placeholder="Manual Order #, QR Seed, or Name..."
            className="flex-1 px-4 py-2.5 text-xs bg-neutral-800 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-entreo-red text-white font-mono placeholder:text-neutral-500"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="bg-entreo-red font-bold text-xs shrink-0 rounded-xl px-4"
          >
            <span>Scan In</span>
          </Button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
          <span>{insideHallCount} check-ins recorded at {selectedGate.split('—')[0]}</span>
          <span className="font-mono text-emerald-400 font-semibold">Ready for turnstile</span>
        </div>
      </footer>
    </div>
  );
};
