import React, { useState, useId } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  Image as ImageIcon, 
  Ticket, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Sparkles, 
  Info, 
  Check, 
  Eye, 
  FileText,
  BadgeAlert,
  Percent,
  Layers,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { EventCard } from '../../components/events/EventCard';
import { ProductionModal } from '../../components/organizer/ProductionModal';
import { 
  CityName, 
  EventCategory, 
  EventItem, 
  OrganizerVerificationStatus, 
  TicketTier 
} from '../../types';

const GERMAN_CITIES: CityName[] = ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Düsseldorf'];

const PRESET_ARTWORKS = [
  { label: 'Indie & Pop Stage (LEA)', url: '/images/events/lea.png' },
  { label: 'Techno Lasers (KlangKollektiv)', url: '/images/events/klangkollektiv.png' },
  { label: 'Comedy Spotlight', url: '/images/events/felix-lobrecht.png' },
  { label: 'Classical & Symphony Hall', url: '/images/events/isar-symphony.jpg' },
  { label: 'Underground Groove Club', url: '/images/events/underground-groove.jpg' },
  { label: 'Acoustic Guitar Session', url: '/images/events/acoustic-collective.jpg' },
  { label: 'Kerala Chenda Melam Percussion', url: '/images/events/chenda-melam.jpg' },
  { label: 'Malabar Indie Rock Concert', url: '/images/events/malabar-rock.jpg' },
  { label: 'World Cultural Dance', url: '/images/events/cultural-dance.png' },
];

const PRESET_GENRES: Record<EventCategory, string[]> = {
  concert: ['Indie Pop', 'Deutschpop', 'Singer-Songwriter', 'Rock', 'Acoustic', 'Folk', 'Neo-Classical', 'Kerala Percussion', 'World Music'],
  clubbing: ['Techno', 'Melodic House', 'Underground', 'Modular Synth', 'Deep House', 'Electro', 'Ambient'],
  comedy: ['Stand-up Comedy', 'Satire', 'Storytelling', 'Improv', 'Live Podcast', 'Solo Special'],
  theatre: ['Modern Drama', 'Performance Art', 'Contemporary Dance', 'Musical', 'Classical Theatre'],
  festival: ['Multi-Genre', 'Open-Air Festival', 'Street Food & Arts', 'Electronic Weekender', 'Cultural Celebration'],
};

export const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    lang, 
    organizers, 
    currentOrganizerId, 
    saveOrganizerProfile, 
    updateOrganizerStatus,
    addEvent, 
    addAuditLog, 
    logPixelEvent 
  } = useStore();

  const currentOrg = organizers.find((o) => o.id === currentOrganizerId) || organizers[0];

  // Wizard Step: 1 | 2 | 3 | 4 | 5 | 6 (submitted success)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);

  // Form State: Step 1 - Organizer Account & KYC
  const [orgBrandName, setOrgBrandName] = useState(currentOrg?.brandName || 'SpreeLive Kultur GmbH');
  const [orgLegalEntity, setOrgLegalEntity] = useState(currentOrg?.legalEntity || 'SpreeLive Kultur Veranstaltungsgesellschaft mbH');
  const [orgTaxId, setOrgTaxId] = useState(currentOrg?.taxId || 'DE301948291');
  const [orgEmail, setOrgEmail] = useState(currentOrg?.email || 'hallo@spreelive-berlin.de');
  const [orgPhone, setOrgPhone] = useState(currentOrg?.phone || '+49 30 99887766');
  const [orgAddress, setOrgAddress] = useState(currentOrg?.address || 'Köpenicker Str. 124, 10179 Berlin');
  const [kycStatus, setKycStatus] = useState<OrganizerVerificationStatus>(currentOrg?.verificationStatus || 'verified');
  const [payoutOnboarded, setPayoutOnboarded] = useState(currentOrg?.payoutOnboarded ?? true);
  const [legalDeclarationChecked, setLegalDeclarationChecked] = useState(true);

  // Form State: Step 2 - Event Details
  const [title, setTitle] = useState('Spree Sessions: Acoustic Sunset & Live Sets');
  const [subtitle, setSubtitle] = useState('An intimate evening of indie songwriters and warm analog acoustics');
  const [category, setCategory] = useState<EventCategory>('concert');
  const [city, setCity] = useState<CityName>('Berlin');
  const [venueName, setVenueName] = useState('Spreeufer Pavillon');
  const [venueAddress, setVenueAddress] = useState('Schlesische Str. 38');
  const [venuePostalCode, setVenuePostalCode] = useState('10997');
  const [accessibilityNotes, setAccessibilityNotes] = useState('Rollstuhlgerechter Eingang stufenlos über Holzrampe, barrierefreie Toiletten im Erdgeschoss, Begleitperson frei (B-Schein).');
  const [startDate, setStartDate] = useState('2026-11-20');
  const [doorsTime, setDoorsTime] = useState('18:30');
  const [startTime, setStartTime] = useState('19:30');
  const [endTime, setEndTime] = useState('22:45');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Indie Pop', 'Acoustic', 'Singer-Songwriter']);
  const [customGenre, setCustomGenre] = useState('');
  const [ageRestriction, setAgeRestriction] = useState('16+ (unter 16 Jahren nur in Begleitung eines Erziehungsberechtigten)');
  const [eventLanguage, setEventLanguage] = useState<'DE' | 'EN' | 'Bilingual'>('Bilingual');
  const [descriptionDE, setDescriptionDE] = useState(
    'Erleben Sie die magische Abendstimmung am Berliner Spreeufer mit handverlesenen Acoustic-Acts, warmen Röhrenverstärkern und entspannter Clubatmosphäre. Ein exklusives Konzertformat für Musikliebhaber, das Intimität und erstklassigen Live-Klang verbindet.'
  );
  const [descriptionEN, setDescriptionEN] = useState(
    'Experience an enchanting sunset along the Berlin riverfront with handpicked acoustic songwriters, vintage analog sound, and relaxed ambient lighting. An intimate concert experience designed for discerning music lovers.'
  );

  // Form State: Step 3 - Artwork & Media
  const [artworkUrl, setArtworkUrl] = useState('/images/events/acoustic-collective.jpg');
  const [altText, setAltText] = useState('Acoustic live concert with warm amber stage lighting and guitar performance');
  const [copyrightDeclaration, setCopyrightDeclaration] = useState(true);

  // Form State: Step 4 - Tickets & Capacity
  const [tickets, setTickets] = useState<TicketTier[]>([
    {
      id: 'tier-early-bird',
      name: 'Early Bird Stehplatz (Early Entry)',
      price: 29.00,
      fee: 2.50,
      capacity: 100,
      available: 100,
      description: 'Bevorzugter Einlass ab 18:00 Uhr, freie Platzwahl im Innenraum.',
      maxPerOrder: 4,
    },
    {
      id: 'tier-general',
      name: 'Regulärer Stehplatz (General Admission)',
      price: 36.00,
      fee: 2.80,
      capacity: 250,
      available: 250,
      description: 'Einlass ab 18:30 Uhr, freie Platzwahl.',
      maxPerOrder: 6,
    },
    {
      id: 'tier-vip-table',
      name: 'Balkon Logenplatz (Seated VIP + Drink)',
      price: 54.00,
      fee: 3.50,
      capacity: 50,
      available: 50,
      description: 'Reservierter Sitzplatz auf der Empore mit bester Sicht und Begrüßungsgetränk.',
      maxPerOrder: 4,
    },
  ]);
  const [refundPolicy, setRefundPolicy] = useState<'flexible' | 'standard' | 'non_refundable'>('standard');
  const [promoCodeInput, setPromoCodeInput] = useState('SPREE10');
  const [promoDiscountApplied, setPromoDiscountApplied] = useState(false);
  const [collectAttendeeQuestions, setCollectAttendeeQuestions] = useState(false);

  // Validation errors
  const [stepErrors, setStepErrors] = useState<string[]>([]);

  // Step 1: Save organizer changes
  const handleUpdateOrganizer = (newStatus?: OrganizerVerificationStatus) => {
    const statusToUse = newStatus || kycStatus;
    saveOrganizerProfile({
      brandName: orgBrandName,
      legalEntity: orgLegalEntity,
      taxId: orgTaxId,
      email: orgEmail,
      phone: orgPhone,
      address: orgAddress,
      verificationStatus: statusToUse,
      payoutOnboarded,
    });
    if (newStatus && currentOrg) {
      updateOrganizerStatus(currentOrg.id, newStatus, 'Status simulated via Create Event Wizard.');
    }
  };

  // Helper calculation
  const totalCapacity = tickets.reduce((acc, t) => acc + t.capacity, 0);
  const totalGrossValue = tickets.reduce((acc, t) => acc + t.capacity * t.price, 0);
  const totalBookingFees = tickets.reduce((acc, t) => acc + t.capacity * t.fee, 0);
  const vat19Estimated = totalGrossValue * (19 / 119);
  const minTicketPrice = tickets.length > 0 ? Math.min(...tickets.map((t) => t.price)) : 0;

  // Genre tag toggle
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleAddCustomGenre = () => {
    if (customGenre.trim() && !selectedGenres.includes(customGenre.trim())) {
      setSelectedGenres([...selectedGenres, customGenre.trim()]);
      setCustomGenre('');
    }
  };

  // Ticket tier actions
  const handleAddTicketTier = () => {
    const newTier: TicketTier = {
      id: `tier-${Date.now()}`,
      name: `Neues Ticket-Kontingent ${tickets.length + 1}`,
      price: 35.00,
      fee: 2.50,
      capacity: 100,
      available: 100,
      description: 'Freie Platzwahl, inklusive Garderobe.',
      maxPerOrder: 6,
    };
    setTickets([...tickets, newTier]);
  };

  const handleUpdateTicketTier = (index: number, updates: Partial<TicketTier>) => {
    setTickets(tickets.map((t, i) => (i === index ? { ...t, ...updates } : t)));
  };

  const handleRemoveTicketTier = (index: number) => {
    if (tickets.length <= 1) {
      alert(lang === 'DE' ? 'Mindestens eine Ticketkategorie ist erforderlich.' : 'At least one ticket tier is required.');
      return;
    }
    setTickets(tickets.filter((_, i) => i !== index));
  };

  // Step validation
  const validateCurrentStep = (): boolean => {
    const errors: string[] = [];

    if (currentStep === 1) {
      if (!orgBrandName.trim()) errors.push(lang === 'DE' ? 'Veranstalter-Markenname ist erforderlich.' : 'Brand name is required.');
      if (!orgLegalEntity.trim()) errors.push(lang === 'DE' ? 'Rechtliche Unternehmensbezeichnung ist erforderlich.' : 'Legal entity name is required.');
      if (!orgTaxId.trim()) errors.push(lang === 'DE' ? 'Steuernummer oder USt-IdNr ist erforderlich.' : 'Tax ID or VAT number is required.');
      if (!orgEmail.trim() || !orgEmail.includes('@')) errors.push(lang === 'DE' ? 'Gültige geschäftliche E-Mail ist erforderlich.' : 'Valid contact email is required.');
      if (!legalDeclarationChecked) errors.push(lang === 'DE' ? 'Bitte bestätigen Sie die Vertretungsberechtigung.' : 'Please confirm authorization to represent the legal entity.');
    } else if (currentStep === 2) {
      if (!title.trim()) errors.push(lang === 'DE' ? 'Event-Titel ist erforderlich.' : 'Event title is required.');
      if (!venueName.trim()) errors.push(lang === 'DE' ? 'Name der Spielstätte/Venue ist erforderlich.' : 'Venue name is required.');
      if (!venueAddress.trim()) errors.push(lang === 'DE' ? 'Adresse der Spielstätte ist erforderlich.' : 'Venue address is required.');
      if (!startDate) errors.push(lang === 'DE' ? 'Datum ist erforderlich.' : 'Event date is required.');
      if (!doorsTime || !startTime) errors.push(lang === 'DE' ? 'Einlass- und Beginnzeit sind erforderlich.' : 'Doors and start times are required.');
      if (!descriptionDE.trim()) errors.push(lang === 'DE' ? 'Deutsche Beschreibung ist erforderlich.' : 'German event description is required.');
    } else if (currentStep === 3) {
      if (!artworkUrl.trim()) errors.push(lang === 'DE' ? 'Titelbild ist erforderlich.' : 'Artwork image is required.');
      if (!copyrightDeclaration) errors.push(lang === 'DE' ? 'Urheberrechtserklärung gemäß UrhG § 72 erforderlich.' : 'Copyright declaration under German UrhG is required.');
    } else if (currentStep === 4) {
      if (tickets.length === 0) errors.push(lang === 'DE' ? 'Mindestens eine Ticketkategorie erforderlich.' : 'At least one ticket tier is required.');
      if (tickets.some((t) => t.price <= 0)) errors.push(lang === 'DE' ? 'Ticketpreise müssen größer als 0 € sein.' : 'Ticket gross prices must be greater than 0 €.');
      if (tickets.some((t) => t.capacity <= 0)) errors.push(lang === 'DE' ? 'Kapazität muss größer als 0 sein.' : 'Capacity must be greater than 0.');
    }

    setStepErrors(errors);
    return errors.length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep === 1) {
        handleUpdateOrganizer();
      }
      setCurrentStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setStepErrors([]);
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Construct draft or final event object
  const constructEventObject = (status: 'draft' | 'submitted'): EventItem => {
    const generatedId = `evt-${title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24)}-${Date.now().toString().slice(-4)}`;
    const fullIsoDate = `${startDate}T${startTime}:00+01:00`;

    return {
      id: generatedId,
      slug: `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${city.toLowerCase()}`,
      title,
      subtitle: subtitle || undefined,
      category,
      genreTags: selectedGenres.length > 0 ? selectedGenres : ['Live Music'],
      city,
      venue: {
        name: venueName,
        address: venueAddress,
        postalCode: venuePostalCode,
        city,
        accessibilityNotes,
      },
      startDate: fullIsoDate,
      doorsTime,
      startTime,
      endTime: endTime || undefined,
      image: artworkUrl,
      featured: false,
      status, // HARD RULE: Always 'draft' or 'submitted', never instant-published!
      organizerId: currentOrg?.id || 'org-koll-berlin',
      organizerName: orgBrandName,
      minPrice: minTicketPrice,
      ageRestriction,
      language: eventLanguage,
      refundPolicy,
      descriptionDE,
      descriptionEN: descriptionEN || descriptionDE,
      tickets,
      reviewNotes: [
        `Submitted via 5-step organizer wizard on ${new Date().toLocaleDateString('de-DE')}.`,
        'Urheberrechtserklärung UrhG § 72 bestätigt.',
        `USt-IdNr / Steuernummer: ${orgTaxId}`,
      ],
      createdAt: new Date().toISOString(),
    };
  };

  // Save as Draft
  const handleSaveDraft = () => {
    const draftEvent = constructEventObject('draft');
    addEvent(draftEvent);
    addAuditLog({
      role: 'Reviewer',
      actor: orgEmail,
      action: 'EVENT_SAVED_DRAFT',
      targetType: 'event',
      targetId: draftEvent.id,
      targetName: draftEvent.title,
      notes: 'Organizer saved incomplete or tentative event draft.',
    });
    alert(lang === 'DE' ? 'Entwurf erfolgreich im Speicher gesichert! Sie können ihn jederzeit weiterbearbeiten.' : 'Draft successfully saved! You can resume editing anytime.');
    navigate('/events');
  };

  // Submit for Human Review
  const handleSubmitForReview = () => {
    if (!validateCurrentStep()) return;

    const submittedEvent = constructEventObject('submitted');
    addEvent(submittedEvent);
    setCreatedEventId(submittedEvent.id);

    // Audit log
    addAuditLog({
      role: 'Reviewer',
      actor: orgEmail,
      action: 'EVENT_SUBMITTED_FOR_REVIEW',
      targetType: 'event',
      targetId: submittedEvent.id,
      targetName: submittedEvent.title,
      notes: `Event submitted by ${orgBrandName} for human curation. Status set to 'submitted' (never instant-published).`,
    });

    // Dev Pixel Tracking
    logPixelEvent('SubmitApplication', {
      eventId: submittedEvent.id,
      title: submittedEvent.title,
      city: submittedEvent.city,
      category: submittedEvent.category,
      totalCapacity,
      grossValue: totalGrossValue,
      status: 'submitted',
    });

    // Advance to post-submission success view
    setCurrentStep(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Live preview mockup item for Step 5
  const livePreviewEvent: EventItem = {
    id: 'evt-preview-mockup',
    slug: 'preview',
    title: title || 'Event Title',
    subtitle,
    category,
    genreTags: selectedGenres,
    city,
    venue: {
      name: venueName || 'Venue Name',
      address: venueAddress || 'Address',
      postalCode: venuePostalCode || '10115',
      city,
      accessibilityNotes,
    },
    startDate: `${startDate || '2026-11-20'}T${startTime || '20:00'}:00+01:00`,
    doorsTime: doorsTime || '19:00',
    startTime: startTime || '20:00',
    endTime,
    image: artworkUrl,
    featured: false,
    status: 'submitted',
    organizerId: currentOrg?.id || 'org-mock',
    organizerName: orgBrandName,
    minPrice: minTicketPrice,
    ageRestriction,
    language: eventLanguage,
    refundPolicy,
    descriptionDE,
    descriptionEN,
    tickets,
    createdAt: new Date().toISOString(),
  };

  const stepLabels = [
    { num: 1, labelDE: 'Veranstalter & KYC', labelEN: 'Organizer & KYC', icon: Building2 },
    { num: 2, labelDE: 'Event-Details & Ort', labelEN: 'Details & Venue', icon: Calendar },
    { num: 3, labelDE: 'Artwork & Medien', labelEN: 'Artwork & Media', icon: ImageIcon },
    { num: 4, labelDE: 'Tickets & Kontingente', labelEN: 'Tickets & Pricing', icon: Ticket },
    { num: 5, labelDE: 'Prüfung & Einreichung', labelEN: 'Review & Submit', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F7] pb-24">
      {/* Top Banner & Stepper Header */}
      <div className="bg-white border-b border-entreo-border/70 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-entreo-red mb-1">
                <span className="w-2 h-2 rounded-full bg-entreo-red inline-block"></span>
                <span>{lang === 'DE' ? 'Veranstalter-Portal • Phase 4' : 'Organizer Portal • Phase 4'}</span>
              </div>
              <h1 className="font-serif text-2xl font-bold text-entreo-ink">
                {lang === 'DE' ? 'Neues Event erstellen' : 'Create a New Event'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-entreo-muted hidden sm:inline-flex items-center gap-1.5 bg-entreo-chip/80 px-3 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5 text-entreo-muted" />
                <span>{lang === 'DE' ? 'Entwurf wird im Browser gesichert' : 'Auto-saving to browser storage'}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                className="text-xs"
              >
                {lang === 'DE' ? 'Entwurf sichern' : 'Save Draft'}
              </Button>
              <Link to="/" className="text-xs text-entreo-muted hover:text-entreo-ink">
                {lang === 'DE' ? 'Abbrechen' : 'Cancel'}
              </Link>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          {currentStep <= 5 && (
            <div className="mt-6 pt-4 border-t border-entreo-border/40">
              <div className="grid grid-cols-5 gap-2 sm:gap-4">
                {stepLabels.map((s) => {
                  const Icon = s.icon;
                  const isActive = currentStep === s.num;
                  const isCompleted = currentStep > s.num;

                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => {
                        if (isCompleted || s.num <= currentStep) {
                          setCurrentStep(s.num);
                        }
                      }}
                      disabled={s.num > currentStep && !isCompleted}
                      className={`flex flex-col sm:flex-row items-center sm:items-start gap-2 text-left group transition-all duration-200 ${
                        isActive
                          ? 'opacity-100'
                          : isCompleted
                          ? 'opacity-80 hover:opacity-100 cursor-pointer'
                          : 'opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-entreo-red text-white shadow-sm ring-4 ring-entreo-red/10'
                            : isCompleted
                            ? 'bg-entreo-ink text-white'
                            : 'bg-entreo-chip text-entreo-muted'
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                      </div>
                      <div className="hidden sm:block">
                        <p className={`text-xs font-bold tracking-tight ${isActive ? 'text-entreo-red' : 'text-entreo-ink'}`}>
                          Step {s.num}
                        </p>
                        <p className="text-[11px] text-entreo-muted truncate max-w-[120px]">
                          {lang === 'DE' ? s.labelDE : s.labelEN}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* Error notification banner */}
        {stepErrors.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{lang === 'DE' ? 'Bitte prüfen Sie folgende Angaben:' : 'Please check the following items:'}</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs text-red-800">
                {stepErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* STEP 1: ORGANIZER & KYC */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft-card border border-entreo-border/70 space-y-8 animate-fadeIn">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-entreo-cream text-entreo-red text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{lang === 'DE' ? 'Schritt 1 von 5 • Gesetzliche Sorgfaltspflicht (KYC)' : 'Step 1 of 5 • KYC & Legal Entity'}</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-entreo-ink">
                {lang === 'DE' ? 'Veranstalter-Verifikation & Abrechnung' : 'Organizer Verification & Payout Details'}
              </h2>
              <p className="text-sm text-entreo-muted mt-1 leading-relaxed">
                {lang === 'DE'
                  ? 'Gemäß deutschem Handelsgesetzbuch (HGB) und Geldwäschegesetz (GwG) benötigt ENTRÉO verifizierte Daten, bevor Tickets verkauft und Erlöse ausgezahlt werden.'
                  : 'Under German commercial law (HGB) and compliance protocols, ENTRÉO requires verified legal and tax details before ticket revenue can be settled.'}
              </p>
            </div>

            {/* KYC Status Simulation Chip */}
            <div className="p-4 rounded-xl bg-[#FAF4F2] border border-entreo-red/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  kycStatus === 'verified' ? 'bg-emerald-500' :
                  kycStatus === 'under_review' ? 'bg-amber-500 animate-pulse' :
                  kycStatus === 'info_needed' ? 'bg-blue-500' : 'bg-red-500'
                }`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-entreo-ink">
                      {lang === 'DE' ? 'Verifikationsstatus (KYC):' : 'Verification Status (KYC):'}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      kycStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                      kycStatus === 'under_review' ? 'bg-amber-100 text-amber-800' :
                      kycStatus === 'info_needed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {kycStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-entreo-muted mt-0.5">
                    {kycStatus === 'verified'
                      ? (lang === 'DE' ? 'Identität & Steuernummer validiert. Direktes Payout aktiv.' : 'Identity & Tax ID verified. Direct payouts enabled.')
                      : (lang === 'DE' ? 'Eingereichte Dokumente befinden sich in manueller Prüfung.' : 'Submitted documents are undergoing manual review.')}
                  </p>
                </div>
              </div>

              {/* Status Simulation Selector for demo purposes */}
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-semibold text-entreo-muted uppercase tracking-wider">
                  {lang === 'DE' ? 'Status simulieren:' : 'Simulate Status:'}
                </label>
                <select
                  value={kycStatus}
                  onChange={(e) => {
                    const next = e.target.value as OrganizerVerificationStatus;
                    setKycStatus(next);
                    handleUpdateOrganizer(next);
                  }}
                  className="text-xs bg-white border border-entreo-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-entreo-red"
                >
                  <option value="verified">Verified (Freigegeben)</option>
                  <option value="under_review">Under Review (In Prüfung)</option>
                  <option value="info_needed">Info Needed (Nachforderung)</option>
                  <option value="action_required">Action Required (Aktion nötig)</option>
                  <option value="not_started">Not Started (Neu)</option>
                </select>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Öffentlicher Markenname' : 'Public Brand / Promoter Name'} *
                </label>
                <input
                  type="text"
                  value={orgBrandName}
                  onChange={(e) => setOrgBrandName(e.target.value)}
                  placeholder="z. B. SpreeLive Kultur GmbH"
                  className="w-full px-4 py-2.5 text-sm bg-entreo-cream/50 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red transition-all"
                />
                <p className="text-[11px] text-entreo-muted mt-1">
                  {lang === 'DE' ? 'Wird auf der Event-Detailseite und dem Ticketpass angezeigt.' : 'Displayed on public event pages and attendee tickets.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Rechtliche Unternehmensform' : 'Legal Entity Name'} *
                </label>
                <input
                  type="text"
                  value={orgLegalEntity}
                  onChange={(e) => setOrgLegalEntity(e.target.value)}
                  placeholder="z. B. SpreeLive Kultur Veranstaltungsgesellschaft mbH"
                  className="w-full px-4 py-2.5 text-sm bg-entreo-cream/50 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red transition-all"
                />
                <p className="text-[11px] text-entreo-muted mt-1">
                  {lang === 'DE' ? 'Offizieller Name laut Handelsregister / Gewerbeschein.' : 'Official name as registered in the German commercial register.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'USt-IdNr oder Steuernummer' : 'Tax ID or German USt-IdNr'} *
                </label>
                <input
                  type="text"
                  value={orgTaxId}
                  onChange={(e) => setOrgTaxId(e.target.value)}
                  placeholder="DE301948291 oder 14/234/56789"
                  className="w-full px-4 py-2.5 text-sm bg-entreo-cream/50 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red transition-all font-mono"
                />
                <p className="text-[11px] text-entreo-muted mt-1">
                  {lang === 'DE' ? 'Erforderlich für ordnungsgemäße USt-Gutschriften (19%).' : 'Mandatory for transparent VAT settlement under German law.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Offizielle Kontakt-E-Mail' : 'Official Contact Email'} *
                </label>
                <input
                  type="email"
                  value={orgEmail}
                  onChange={(e) => setOrgEmail(e.target.value)}
                  placeholder="hallo@veranstalter.de"
                  className="w-full px-4 py-2.5 text-sm bg-entreo-cream/50 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red transition-all"
                />
                <p className="text-[11px] text-entreo-muted mt-1">
                  {lang === 'DE' ? 'Hierhin senden wir Status-Updates und Prüfberichte.' : 'Where we send curator feedback and review approvals.'}
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Geschäftsanschrift (Straße, Nr., PLZ, Ort)' : 'Registered Business Address'}
                </label>
                <input
                  type="text"
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                  placeholder="Köpenicker Str. 124, 10179 Berlin"
                  className="w-full px-4 py-2.5 text-sm bg-entreo-cream/50 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red transition-all"
                />
              </div>
            </div>

            {/* SEPA Payout Toggle */}
            <div className="pt-4 border-t border-entreo-border/60">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={payoutOnboarded}
                  onChange={(e) => setPayoutOnboarded(e.target.checked)}
                  className="w-4 h-4 rounded text-entreo-red focus:ring-entreo-red border-entreo-border"
                />
                <span className="text-sm font-medium text-entreo-ink">
                  {lang === 'DE'
                    ? 'SEPA-Geschäftskonto für wöchentliche Ticketauszahlungen hinterlegt'
                    : 'SEPA business bank account connected for automated ticket payouts'}
                </span>
              </label>
            </div>

            {/* Legal HGB Declaration */}
            <div className="p-4 rounded-xl bg-entreo-cream/80 border border-entreo-border">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={legalDeclarationChecked}
                  onChange={(e) => setLegalDeclarationChecked(e.target.checked)}
                  className="w-4 h-4 rounded text-entreo-red focus:ring-entreo-red border-entreo-border mt-0.5"
                />
                <span className="text-xs text-entreo-ink leading-relaxed">
                  {lang === 'DE'
                    ? 'Ich bestätige an Eides statt, dass ich vertretungsberechtigt für das angegebene Unternehmen bin und alle steuerlichen Angaben wahrheitsgemäß erfolgen (§ 263 StGB, § 370 AO).'
                    : 'I solemnly confirm that I am legally authorized to represent this entity and that all tax and commercial registrations are accurate.'}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 2: EVENT DETAILS & VENUE */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft-card border border-entreo-border/70 space-y-8 animate-fadeIn">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-entreo-cream text-entreo-red text-xs font-bold mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{lang === 'DE' ? 'Schritt 2 von 5 • Stammdaten & Ort' : 'Step 2 of 5 • Event Details & Venue'}</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-entreo-ink">
                {lang === 'DE' ? 'Event-Details & Spielstätte' : 'Event Details & Venue Information'}
              </h2>
              <p className="text-sm text-entreo-muted mt-1 leading-relaxed">
                {lang === 'DE'
                  ? 'Geben Sie die Basisdaten Ihres Events an. Alle Zeitangaben erfolgen in der Zeitzone Europe/Berlin.'
                  : 'Define your event parameters. All times are strictly calibrated to Europe/Berlin timezone.'}
              </p>
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-3">
                {lang === 'DE' ? 'Kategorie auswählen' : 'Select Category'} *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { id: 'concert', labelDE: 'Konzert / Live', labelEN: 'Concert' },
                  { id: 'clubbing', labelDE: 'Club / Techno', labelEN: 'Clubbing' },
                  { id: 'comedy', labelDE: 'Stand-Up / Comedy', labelEN: 'Comedy' },
                  { id: 'theatre', labelDE: 'Theater / Tanz', labelEN: 'Theatre' },
                  { id: 'festival', labelDE: 'Festival / Open-Air', labelEN: 'Festival' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id as EventCategory);
                      setSelectedGenres(PRESET_GENRES[cat.id as EventCategory].slice(0, 3));
                    }}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      category === cat.id
                        ? 'border-entreo-red bg-entreo-red/5 text-entreo-red font-bold shadow-xs'
                        : 'border-entreo-border bg-white text-entreo-ink hover:border-entreo-ink/30'
                    }`}
                  >
                    <span className="text-xs">{lang === 'DE' ? cat.labelDE : cat.labelEN}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Titel des Events' : 'Event Title'} *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="z. B. Spree Sessions: Acoustic Sunset"
                  className="w-full px-4 py-2.5 text-base bg-entreo-cream/50 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red font-serif font-bold transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Untertitel / Tagline' : 'Subtitle / Tagline'}
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="z. B. Live at Spreeufer Berlin — An intimate singer-songwriter session"
                  className="w-full px-4 py-2 text-sm bg-entreo-cream/50 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red transition-all"
                />
              </div>
            </div>

            {/* City & Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Stadt' : 'City'} *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as CityName)}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-entreo-border rounded-xl focus:outline-none focus:ring-2 focus:ring-entreo-red"
                >
                  {GERMAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Name der Spielstätte / Venue' : 'Venue Name'} *
                </label>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="z. B. Uber Eats Music Hall, Docks Hamburg"
                  className="w-full px-4 py-2.5 text-sm bg-entreo-cream/50 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Straße & Hausnummer' : 'Street & Number'} *
                </label>
                <input
                  type="text"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="z. B. Schlesische Str. 38"
                  className="w-full px-4 py-2.5 text-sm bg-entreo-cream/50 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Postleitzahl (PLZ)' : 'Postal Code (PLZ)'}
                </label>
                <input
                  type="text"
                  value={venuePostalCode}
                  onChange={(e) => setVenuePostalCode(e.target.value)}
                  placeholder="z. B. 10997"
                  className="w-full px-4 py-2.5 text-sm bg-entreo-cream/50 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red transition-all font-mono"
                />
              </div>
            </div>

            {/* Date & Time in Europe/Berlin */}
            <div className="p-4 rounded-xl bg-[#FAF9F7] border border-entreo-border space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-entreo-ink uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-entreo-red" />
                <span>{lang === 'DE' ? 'Zeiten (Europe / Berlin Zeitzone)' : 'Schedule (Europe / Berlin Timezone)'}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-entreo-muted mb-1">
                    {lang === 'DE' ? 'Datum' : 'Date'} *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-entreo-border rounded-lg focus:outline-none focus:ring-2 focus:ring-entreo-red"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-entreo-muted mb-1">
                    {lang === 'DE' ? 'Einlass (Doors)' : 'Doors Open'} *
                  </label>
                  <input
                    type="time"
                    value={doorsTime}
                    onChange={(e) => setDoorsTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-entreo-border rounded-lg focus:outline-none focus:ring-2 focus:ring-entreo-red font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-entreo-muted mb-1">
                    {lang === 'DE' ? 'Beginn (Showtime)' : 'Show Start'} *
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-entreo-border rounded-lg focus:outline-none focus:ring-2 focus:ring-entreo-red font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-entreo-muted mb-1">
                    {lang === 'DE' ? 'Curfew / Ende' : 'End Time'}
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-entreo-border rounded-lg focus:outline-none focus:ring-2 focus:ring-entreo-red font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Genre Chips */}
            <div>
              <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                {lang === 'DE' ? 'Genre-Tags (für Filterung & Empfehlungen)' : 'Genre Tags'}
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_GENRES[category].map((genre) => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        isSelected
                          ? 'bg-entreo-red text-white border-entreo-red shadow-xs'
                          : 'bg-white text-entreo-ink border-entreo-border hover:border-entreo-ink/40'
                      }`}
                    >
                      {isSelected ? `✓ ${genre}` : `+ ${genre}`}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  value={customGenre}
                  onChange={(e) => setCustomGenre(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomGenre())}
                  placeholder={lang === 'DE' ? 'Weiteren Tag ergänzen...' : 'Add custom tag...'}
                  className="px-3 py-1.5 text-xs bg-white border border-entreo-border rounded-lg focus:outline-none focus:ring-2 focus:ring-entreo-red flex-1"
                />
                <Button size="sm" variant="outline" type="button" onClick={handleAddCustomGenre} className="text-xs">
                  {lang === 'DE' ? 'Hinzufügen' : 'Add'}
                </Button>
              </div>
            </div>

            {/* Age Restrictions & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Altersbeschränkung (Jugendschutzgesetz)' : 'Age Restriction'}
                </label>
                <select
                  value={ageRestriction}
                  onChange={(e) => setAgeRestriction(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-entreo-border rounded-xl focus:outline-none focus:ring-2 focus:ring-entreo-red"
                >
                  <option value={lang === 'DE' ? 'All ages (Ohne Altersbeschränkung)' : 'All ages (No restrictions)'}>
                    {lang === 'DE' ? 'All ages (Ohne Altersbeschränkung)' : 'All ages (No restrictions)'}
                  </option>
                  <option value={lang === 'DE' ? '6+ (unter 14 Jahren nur in Begleitung)' : '6+ (under 14 with adult)'}>
                    {lang === 'DE' ? '6+ (unter 14 Jahren nur in Begleitung)' : '6+ (under 14 with adult)'}
                  </option>
                  <option value={lang === 'DE' ? '16+ (unter 16 Jahren nur mit Begleitperson)' : '16+ (under 16 with guardian)'}>
                    {lang === 'DE' ? '16+ (unter 16 Jahren nur mit Begleitperson)' : '16+ (under 16 with guardian)'}
                  </option>
                  <option value={lang === 'DE' ? '18+ strictly enforced (Einlass strikt ab 18)' : '18+ strictly enforced'}>
                    {lang === 'DE' ? '18+ strictly enforced (Einlass strikt ab 18)' : '18+ strictly enforced'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Event-Sprache' : 'Event Language'}
                </label>
                <select
                  value={eventLanguage}
                  onChange={(e) => setEventLanguage(e.target.value as 'DE' | 'EN' | 'Bilingual')}
                  className="w-full px-3 py-2 text-xs bg-white border border-entreo-border rounded-xl focus:outline-none focus:ring-2 focus:ring-entreo-red"
                >
                  <option value="DE">Deutsch (DE)</option>
                  <option value="EN">English (EN)</option>
                  <option value="Bilingual">Bilingual (DE / EN)</option>
                </select>
              </div>
            </div>

            {/* Accessibility Notes (Barrierefreiheit) */}
            <div>
              <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                {lang === 'DE' ? 'Barrierefreiheit & Inklusion (Barrierefreiheitsstärkungsgesetz)' : 'Accessibility Notes'}
              </label>
              <textarea
                rows={2}
                value={accessibilityNotes}
                onChange={(e) => setAccessibilityNotes(e.target.value)}
                placeholder="z. B. Rollstuhlgerechter Eingang stufenlos, rollstuhlgerechte Toiletten, Begleitperson frei."
                className="w-full px-4 py-2 text-xs bg-entreo-cream/50 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red transition-all"
              />
            </div>

            {/* Event Descriptions (Bilingual) */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Event-Beschreibung (Deutsch)' : 'German Description'} *
                </label>
                <textarea
                  rows={4}
                  value={descriptionDE}
                  onChange={(e) => setDescriptionDE(e.target.value)}
                  placeholder="Geben Sie eine ansprechende Beschreibung für das deutsche Publikum ein..."
                  className="w-full px-4 py-3 text-xs bg-entreo-cream/50 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red transition-all leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Event-Beschreibung (Englisch / International)' : 'English Description'}
                </label>
                <textarea
                  rows={3}
                  value={descriptionEN}
                  onChange={(e) => setDescriptionEN(e.target.value)}
                  placeholder="Provide an English description for international attendees and tourists..."
                  className="w-full px-4 py-3 text-xs bg-entreo-cream/50 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red transition-all leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ARTWORK & MEDIA */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft-card border border-entreo-border/70 space-y-8 animate-fadeIn">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-entreo-cream text-entreo-red text-xs font-bold mb-2">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{lang === 'DE' ? 'Schritt 3 von 5 • Bildmaterial & Urheberrecht' : 'Step 3 of 5 • Visual Artwork & UrhG'}</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-entreo-ink">
                {lang === 'DE' ? 'Artwork & Medien-Upload' : 'Artwork & Media Assets'}
              </h2>
              <p className="text-sm text-entreo-muted mt-1 leading-relaxed">
                {lang === 'DE'
                  ? 'Wählen Sie ein hochauflösendes 16:10 Titelbild. Wir bieten kuratierte Festival-Vorlagen oder Sie verwenden ein eigenes Motiv.'
                  : 'Select high-resolution 16:10 artwork. Choose from our curated collection or input your own creative asset.'}
              </p>
            </div>

            {/* Live 16:10 Aspect Ratio Preview Card */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider">
                {lang === 'DE' ? 'Live-Vorschau (16:10 Titelbild)' : 'Live 16:10 Aspect Ratio Preview'}
              </label>
              <div className="relative aspect-[16/10] max-w-xl mx-auto rounded-2xl overflow-hidden border-2 border-dashed border-entreo-border bg-entreo-chip group shadow-sm">
                <img
                  src={artworkUrl}
                  alt={altText}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-entreo-red px-2 py-0.5 rounded-full">
                      {category.toUpperCase()}
                    </span>
                    <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full">
                      {city}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                    {title || 'Event Title'}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                    {subtitle || 'Intimate live experience'}
                  </p>
                </div>
              </div>
            </div>

            {/* Curated Preset Picker */}
            <div>
              <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-3">
                {lang === 'DE' ? 'Kuratierte Vorlagen zur Schnellauswahl' : 'Curated Preset Library'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_ARTWORKS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setArtworkUrl(preset.url)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all text-left p-1 ${
                      artworkUrl === preset.url
                        ? 'border-entreo-red ring-2 ring-entreo-red/20'
                        : 'border-transparent hover:border-entreo-border'
                    }`}
                  >
                    <div className="aspect-[16/10] rounded-lg overflow-hidden bg-entreo-chip">
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[11px] font-medium text-entreo-ink mt-1.5 px-1 truncate">
                      {preset.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL & Alt Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Bild-URL (oder Pfad)' : 'Custom Image URL / Path'} *
                </label>
                <input
                  type="text"
                  value={artworkUrl}
                  onChange={(e) => setArtworkUrl(e.target.value)}
                  placeholder="/images/events/custom.jpg oder https://..."
                  className="w-full px-4 py-2.5 text-xs bg-entreo-cream/50 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Alt-Text (Barrierefreiheit)' : 'Alt Text (Accessibility)'}
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Beschreiben Sie das Bild für Screenreader..."
                  className="w-full px-4 py-2.5 text-xs bg-entreo-cream/50 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red transition-all"
                />
              </div>
            </div>

            {/* Urheberrecht (UrhG § 72) Compliance Box */}
            <div className="p-4 rounded-xl bg-entreo-cream/80 border border-entreo-border">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={copyrightDeclaration}
                  onChange={(e) => setCopyrightDeclaration(e.target.checked)}
                  className="w-4 h-4 rounded text-entreo-red focus:ring-entreo-red border-entreo-border mt-0.5"
                />
                <span className="text-xs text-entreo-ink leading-relaxed">
                  {lang === 'DE'
                    ? 'Ich bestätige, dass ich sämtliche Nutzungs- und Bildrechte (§ 72 UrhG) an diesem Artwork besitze und ENTRÉO berechtigt ist, das Bild online, im Ticketpass und auf Werbekanälen darzustellen.'
                    : 'I certify that I hold full commercial rights or licensing for this visual asset under German copyright law (UrhG) and authorize ENTRÉO to display it across all promotional channels.'}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 4: TICKETS & CAPACITY */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft-card border border-entreo-border/70 space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-entreo-cream text-entreo-red text-xs font-bold mb-2">
                  <Ticket className="w-3.5 h-3.5" />
                  <span>{lang === 'DE' ? 'Schritt 4 von 5 • Preiskalkulation & Kapazität' : 'Step 4 of 5 • Tickets & Capacity'}</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-entreo-ink">
                  {lang === 'DE' ? 'Ticket-Kategorien & Kontingente' : 'Ticket Tiers & Capacity'}
                </h2>
                <p className="text-sm text-entreo-muted mt-1 leading-relaxed">
                  {lang === 'DE'
                    ? 'Alle Endkundenpreise verstehen sich inklusive 19% deutscher Mehrwertsteuer. Gebühren werden transparent aufgeführt.'
                    : 'All consumer ticket prices include 19% German VAT. ENTRÉO booking fees are transparently itemized.'}
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={handleAddTicketTier}
                className="text-xs shrink-0"
              >
                <Plus className="w-4 h-4 mr-1 text-entreo-red" />
                <span>{lang === 'DE' ? 'Kategorie hinzufügen' : 'Add Ticket Tier'}</span>
              </Button>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#FAF9F7] border border-entreo-border">
              <div>
                <p className="text-[11px] font-semibold text-entreo-muted uppercase tracking-wider">
                  {lang === 'DE' ? 'Gesamtkapazität' : 'Total Capacity'}
                </p>
                <p className="font-serif text-xl font-bold text-entreo-ink mt-0.5">
                  {totalCapacity.toLocaleString('de-DE')} <span className="text-xs font-sans text-entreo-muted font-normal">Tickets</span>
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-entreo-muted uppercase tracking-wider">
                  {lang === 'DE' ? 'Potenzieller Brutto-Umsatz' : 'Potential Gross Sales'}
                </p>
                <p className="font-serif text-xl font-bold text-entreo-red mt-0.5">
                  {totalGrossValue.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-entreo-muted uppercase tracking-wider">
                  {lang === 'DE' ? 'Darin enth. 19% USt' : 'Incl. 19% VAT'}
                </p>
                <p className="font-serif text-xl font-bold text-entreo-ink mt-0.5">
                  {vat19Estimated.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-entreo-muted uppercase tracking-wider">
                  {lang === 'DE' ? 'Kategorien' : 'Active Tiers'}
                </p>
                <p className="font-serif text-xl font-bold text-entreo-ink mt-0.5">
                  {tickets.length}
                </p>
              </div>
            </div>

            {/* Ticket Tier List */}
            <div className="space-y-4">
              {tickets.map((tier, idx) => (
                <div
                  key={tier.id}
                  className="p-5 rounded-xl border border-entreo-border/80 bg-white hover:border-entreo-red/30 transition-all space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-bold text-entreo-red bg-entreo-cream px-2.5 py-0.5 rounded-full">
                      Tier #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTicketTier(idx)}
                      className="text-xs text-entreo-muted hover:text-red-600 transition-colors inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{lang === 'DE' ? 'Entfernen' : 'Remove'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-entreo-ink uppercase tracking-wider mb-1">
                        {lang === 'DE' ? 'Name der Kategorie' : 'Tier Name'} *
                      </label>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => handleUpdateTicketTier(idx, { name: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-entreo-cream/40 border border-entreo-border rounded-lg focus:outline-none focus:ring-2 focus:ring-entreo-red font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-entreo-ink uppercase tracking-wider mb-1">
                        {lang === 'DE' ? 'Bruttopreis (€ inkl. 19% USt)' : 'Gross Price (€)'} *
                      </label>
                      <input
                        type="number"
                        step="0.50"
                        min="1"
                        value={tier.price}
                        onChange={(e) => handleUpdateTicketTier(idx, { price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-xs bg-entreo-cream/40 border border-entreo-border rounded-lg focus:outline-none focus:ring-2 focus:ring-entreo-red font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-entreo-ink uppercase tracking-wider mb-1">
                        {lang === 'DE' ? 'Kontingent (Kapazität)' : 'Capacity'} *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={tier.capacity}
                        onChange={(e) => {
                          const cap = parseInt(e.target.value, 10) || 0;
                          handleUpdateTicketTier(idx, { capacity: cap, available: cap });
                        }}
                        className="w-full px-3 py-2 text-xs bg-entreo-cream/40 border border-entreo-border rounded-lg focus:outline-none focus:ring-2 focus:ring-entreo-red font-mono"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-entreo-ink uppercase tracking-wider mb-1">
                        {lang === 'DE' ? 'Leistungsbeschreibung (wird auf Ticket gedruckt)' : 'Description'}
                      </label>
                      <input
                        type="text"
                        value={tier.description}
                        onChange={(e) => handleUpdateTicketTier(idx, { description: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-entreo-cream/40 border border-entreo-border rounded-lg focus:outline-none focus:ring-2 focus:ring-entreo-red"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-entreo-ink uppercase tracking-wider mb-1">
                        {lang === 'DE' ? 'Max. pro Bestellung' : 'Max / Order'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={tier.maxPerOrder}
                        onChange={(e) => handleUpdateTicketTier(idx, { maxPerOrder: parseInt(e.target.value, 10) || 6 })}
                        className="w-full px-3 py-2 text-xs bg-entreo-cream/40 border border-entreo-border rounded-lg focus:outline-none focus:ring-2 focus:ring-entreo-red font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Refund Policy & Promo Simulation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-entreo-border/60">
              <div>
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Stornierungs- & Erstattungsrichtlinie' : 'Refund & Cancellation Policy'}
                </label>
                <select
                  value={refundPolicy}
                  onChange={(e) => setRefundPolicy(e.target.value as 'standard' | 'flexible' | 'non_refundable')}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-entreo-border rounded-xl focus:outline-none focus:ring-2 focus:ring-entreo-red"
                >
                  <option value="standard">Standard: Volle Erstattung bis 14 Tage vor Beginn</option>
                  <option value="flexible">Flexibel: Erstattung bis 48 Stunden vor Event</option>
                  <option value="non_refundable">Nicht erstattungsfähig (Weiterverkauf via Fan-to-Fan)</option>
                </select>
                <p className="text-[11px] text-entreo-muted mt-1">
                  {lang === 'DE'
                    ? 'Wird dem Käufer im Checkout transparent vor der Zahlung angezeigt.'
                    : 'Transparently disclosed to attendees prior to payment authorization.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-entreo-ink uppercase tracking-wider mb-2">
                  {lang === 'DE' ? 'Promo-Code Simulation' : 'Promo Code Simulation'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    placeholder="z. B. EARLYBIRD10"
                    className="flex-1 px-3 py-2 text-xs bg-entreo-cream/50 border border-entreo-border rounded-lg focus:outline-none focus:ring-2 focus:ring-entreo-red font-mono"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setPromoDiscountApplied(true);
                      alert(lang === 'DE' ? `Promo-Code ${promoCodeInput} (10% Rabatt) erfolgreich simuliert!` : `Promo code ${promoCodeInput} (10% off) validated!`);
                    }}
                    className="text-xs"
                  >
                    {lang === 'DE' ? 'Testen' : 'Validate'}
                  </Button>
                </div>
                {promoDiscountApplied && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    ✓ Code {promoCodeInput} aktiv: 10% Rabatt auf reguläre Tickets hinterlegt.
                  </p>
                )}
              </div>
            </div>

            {/* DSGVO Data Minimization Toggle */}
            <div className="p-4 rounded-xl bg-entreo-cream/60 border border-entreo-border">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={collectAttendeeQuestions}
                  onChange={(e) => setCollectAttendeeQuestions(e.target.checked)}
                  className="w-4 h-4 rounded text-entreo-red focus:ring-entreo-red border-entreo-border mt-0.5"
                />
                <span className="text-xs text-entreo-ink leading-relaxed">
                  {lang === 'DE'
                    ? 'DSGVO-Datenminimierung standardmäßig aktiv: Wir erfassen lediglich Name und E-Mail für die Ticketzustellung. Zusätzliche Teilnehmerabfragen deaktiviert.'
                    : 'GDPR Data Minimization Principle: We strictly collect attendee name and email only for ticket delivery.'}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & SUBMIT */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-fadeIn">
            {/* HARD RULE BANNER: NO INSTANT PUBLISH */}
            <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                <BadgeAlert className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-serif text-lg font-bold text-amber-950">
                  {lang === 'DE' ? 'Keine Sofort-Veröffentlichung (Human Review Protocol)' : 'No Instant-Publish Policy (Human Review Protocol)'}
                </h4>
                <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                  {lang === 'DE'
                    ? 'Zum Schutz vor Fake-Events, GEMA-Konflikten und unlauterem Ticketweiterverkauf wird jedes eingereichte Event manuell durch das ENTRÉO Kuratoren-Team geprüft. Ihr Event wird mit dem Status „In Prüfung“ (submitted) gesichert.'
                    : 'To safeguard against fraudulent listings and copyright infringement, all events undergo rigorous human curator inspection before publication. Your submission will enter status "Submitted for review" (submitted).'}
                </p>
              </div>
              <span className="text-xs font-mono font-bold uppercase bg-amber-200 text-amber-900 px-3 py-1 rounded-full shrink-0">
                STATUS: SUBMITTED
              </span>
            </div>

            {/* WYSIWYG Public Card & Summary Sheet */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Event Card Preview (Left 5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-entreo-ink uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-entreo-red" />
                    <span>{lang === 'DE' ? 'Vorschau Entdeckungs-Karte' : 'Public Event Card Preview'}</span>
                  </span>
                  <span className="text-[11px] text-entreo-muted">
                    {lang === 'DE' ? 'So sehen Käufer Ihr Event' : 'As seen by ticket buyers'}
                  </span>
                </div>

                <div className="pointer-events-none">
                  <EventCard event={livePreviewEvent} />
                </div>
              </div>

              {/* Event Data Sheet (Right 7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-soft-card border border-entreo-border space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-entreo-ink">
                    {title}
                  </h3>
                  <p className="text-xs text-entreo-muted mt-0.5">
                    {subtitle}
                  </p>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 gap-4 text-xs border-y border-entreo-border/60 py-4">
                  <div>
                    <span className="text-entreo-muted block text-[11px] uppercase font-bold tracking-wider">
                      {lang === 'DE' ? 'Veranstalter' : 'Organizer'}
                    </span>
                    <span className="font-semibold text-entreo-ink">{orgBrandName}</span>
                    <span className="text-[11px] text-entreo-muted block">{orgTaxId}</span>
                  </div>

                  <div>
                    <span className="text-entreo-muted block text-[11px] uppercase font-bold tracking-wider">
                      {lang === 'DE' ? 'Kategorie & Stadt' : 'Category & City'}
                    </span>
                    <span className="font-semibold text-entreo-ink">{category.toUpperCase()} • {city}</span>
                    <span className="text-[11px] text-entreo-muted block">{venueName}</span>
                  </div>

                  <div>
                    <span className="text-entreo-muted block text-[11px] uppercase font-bold tracking-wider">
                      {lang === 'DE' ? 'Datum & Zeiten' : 'Schedule'}
                    </span>
                    <span className="font-semibold text-entreo-ink">{startDate}</span>
                    <span className="text-[11px] text-entreo-muted block">Einlass: {doorsTime} | Beginn: {startTime}</span>
                  </div>

                  <div>
                    <span className="text-entreo-muted block text-[11px] uppercase font-bold tracking-wider">
                      {lang === 'DE' ? 'Kapazität & Preise' : 'Capacity & Pricing'}
                    </span>
                    <span className="font-semibold text-entreo-ink">{totalCapacity} Tickets gesamt</span>
                    <span className="text-[11px] text-entreo-muted block">Ab {minTicketPrice.toFixed(2)} € brutto</span>
                  </div>
                </div>

                {/* Pre-Submission German Compliance Checklist */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-entreo-ink uppercase tracking-wider">
                    {lang === 'DE' ? 'Compliance-Prüfliste vor Einreichung' : 'German Compliance Checklist'}
                  </p>
                  <div className="space-y-1.5 text-xs text-entreo-ink">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{lang === 'DE' ? 'Veranstalteridentität & USt-IdNr hinterlegt' : 'Organizer legal entity & tax ID registered'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{lang === 'DE' ? 'Bildrechte gemäß § 72 UrhG erklärt' : 'Image rights confirmed under UrhG § 72'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{lang === 'DE' ? 'Zeitzone Europe/Berlin und Altersfreigabe validiert' : 'Europe/Berlin timezone & age policy configured'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{lang === 'DE' ? 'Endkundenpreise inkl. 19% deutscher USt ausgewiesen' : 'Gross ticket prices transparently include 19% VAT'}</span>
                    </div>
                  </div>
                </div>

                {/* Submission CTA box */}
                <div className="pt-4 border-t border-entreo-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs"
                  >
                    {lang === 'DE' ? 'Angaben bearbeiten' : 'Edit Details'}
                  </Button>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleSaveDraft}
                      className="text-xs flex-1 sm:flex-none"
                    >
                      {lang === 'DE' ? 'Als Entwurf speichern' : 'Save as Draft'}
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleSubmitForReview}
                      className="text-xs flex-1 sm:flex-none bg-entreo-red font-bold"
                    >
                      <span>{lang === 'DE' ? 'Zur Prüfung einreichen' : 'Submit for Human Review'}</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: POST-SUBMISSION CONFIRMATION & CREATIVE SERVICES */}
        {currentStep === 6 && (
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-soft-card border border-entreo-border/80 text-center space-y-8 animate-fadeIn max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto ring-8 ring-amber-50">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block"></span>
                <span>{lang === 'DE' ? 'In Prüfung (Submitted for Review)' : 'Submitted for Human Review'}</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-entreo-ink">
                {lang === 'DE' ? 'Event erfolgreich zur Prüfung eingereicht!' : 'Event Successfully Submitted for Review!'}
              </h2>
              <p className="text-sm text-entreo-muted mt-2 max-w-lg mx-auto leading-relaxed">
                {lang === 'DE'
                  ? 'Vielen Dank! Ihre Einreichung wurde unter folgender Vorgangsnummer registriert und liegt unserem Kuratoren-Team vor:'
                  : 'Thank you! Your submission has been registered and is now in our human curation queue:'}
              </p>
              <div className="inline-block mt-3 px-4 py-2 bg-entreo-cream rounded-xl border border-entreo-border font-mono text-xs font-bold text-entreo-ink">
                {createdEventId || 'ENT-REV-2026-9841'}
              </div>
            </div>

            {/* SLA Callout */}
            <div className="p-4 rounded-xl bg-entreo-cream/60 border border-entreo-border text-xs text-entreo-ink leading-relaxed">
              <p className="font-semibold">
                {lang === 'DE' ? 'Geschätzte Bearbeitungszeit:' : 'Review SLA Timeline:'}
              </p>
              <p className="text-entreo-muted mt-0.5">
                {lang === 'DE'
                  ? 'Unsere Kuratoren prüfen Werbemittel, Altersfreigabe und Venue-Daten innerhalb von 4–12 Werktagsstunden (Mo–Fr 09:00–18:00 Uhr MEZ). Sie erhalten eine E-Mail an '
                  : 'Our curators inspect venue permits, artwork licensing and age policies within 4–12 business hours. Confirmation will be sent to '}
                <span className="font-mono font-medium text-entreo-ink">{orgEmail}</span>.
              </p>
            </div>

            {/* Creative Production Services Teaser Modal Trigger */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FAF4F2] to-[#FFF1F0] border border-entreo-red/20 text-left flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-entreo-red uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'DE' ? 'ENTRÉO Creative Suite' : 'ENTRÉO Creative Suite'}</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-entreo-ink">
                  {lang === 'DE' ? 'Plakate, Video oder Fotografie benötigt?' : 'Need Posters, Video, or Concert Photography?'}
                </h4>
                <p className="text-xs text-entreo-muted leading-relaxed max-w-md">
                  {lang === 'DE'
                    ? 'Unser hauseigenes Kreativkollektiv gestaltet DIN A0 Plakatserien, 4K Konzert-Recaps und Social-Media Motion-Kits für Ihr Event.'
                    : 'Our in-house creative team designs high-impact DIN A0 posters, 4K recap films, and social assets to boost your sell-out velocity.'}
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsProductionModalOpen(true)}
                className="shrink-0 text-xs bg-entreo-red font-bold"
              >
                {lang === 'DE' ? 'Produktion anfragen' : 'Talk to our team'}
              </Button>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-entreo-border/60">
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/admin')}
                className="text-xs w-full sm:w-auto"
              >
                <span>{lang === 'DE' ? 'Im Admin-Backstage einsehen' : 'View in Admin Backstage'}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-entreo-muted" />
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setCurrentStep(1);
                  setCreatedEventId(null);
                }}
                className="text-xs w-full sm:w-auto"
              >
                {lang === 'DE' ? 'Weiteres Event anlegen' : 'Create Another Event'}
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => navigate('/')}
                className="text-xs w-full sm:w-auto"
              >
                {lang === 'DE' ? 'Zurück zur Startseite' : 'Back to Homepage'}
              </Button>
            </div>
          </div>
        )}

        {/* Wizard Bottom Navigation (Steps 1–4) */}
        {currentStep <= 4 && (
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="text-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>{lang === 'DE' ? 'Zurück' : 'Back'}</span>
            </Button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-entreo-muted hidden sm:inline">
                {lang === 'DE' ? `Schritt ${currentStep} von 5` : `Step ${currentStep} of 5`}
              </span>
              <Button
                variant="primary"
                size="md"
                type="button"
                onClick={handleNextStep}
                className="text-xs font-semibold"
              >
                <span>{lang === 'DE' ? 'Weiter zu Schritt' : 'Continue to Step'} {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Production Modal */}
      <ProductionModal
        isOpen={isProductionModalOpen}
        onClose={() => setIsProductionModalOpen(false)}
        eventId={createdEventId || undefined}
        eventTitle={title}
      />
    </div>
  );
};

