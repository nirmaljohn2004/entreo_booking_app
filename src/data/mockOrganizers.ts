import { Organizer } from '../types';

export const INITIAL_ORGANIZERS: Organizer[] = [
  {
    id: 'org-koll-berlin',
    brandName: 'SpreeLive Kultur GmbH',
    legalEntity: 'SpreeLive Kultur Veranstaltungsgesellschaft mbH',
    taxId: 'DE301948291',
    email: 'hallo@spreelive-berlin.de',
    phone: '+49 30 99887766',
    address: 'Köpenicker Str. 124, 10179 Berlin',
    verificationStatus: 'verified',
    verificationNotes: 'Handelsregisterauszug B 19482 B Amtsgericht Charlottenburg verifiziert.',
    payoutOnboarded: true,
    registeredAt: '2025-04-12T09:00:00Z'
  },
  {
    id: 'org-elbbeats',
    brandName: 'Hanseatic Club Works',
    legalEntity: 'Hanseatic Club Works UG (haftungsbeschränkt)',
    taxId: 'DE284719203',
    email: 'booking@hanseatic-clubworks.de',
    phone: '+49 40 33221100',
    address: 'Reeperbahn 88, 20359 Hamburg',
    verificationStatus: 'verified',
    verificationNotes: 'Gewerbeanmeldung und Ausweiskopie bestätigt.',
    payoutOnboarded: true,
    registeredAt: '2025-06-20T11:30:00Z'
  },
  {
    id: 'org-punchline-cologne',
    brandName: 'Rhine Comedy Productions',
    legalEntity: 'Rhine Comedy Events GmbH',
    taxId: 'DE328190472',
    email: 'contact@rhinecomedy.de',
    phone: '+49 221 44556677',
    address: 'Aachener Str. 500, 50933 Köln',
    verificationStatus: 'verified',
    verificationNotes: 'USt-IdNr und Bankverbindung vollständig validiert.',
    payoutOnboarded: true,
    registeredAt: '2025-08-15T15:20:00Z'
  },
  {
    id: 'org-new-soundscapes',
    brandName: 'Soundscapes Underground',
    legalEntity: 'Felix Berger Einzelunternehmen',
    taxId: '14/234/56789',
    email: 'info@soundscapes-underground.de',
    phone: '+49 170 1234567',
    address: 'Sonnenallee 42, 12045 Berlin',
    verificationStatus: 'under_review',
    verificationNotes: 'Gewerbeschein eingereicht, Identitätsnachweis in Prüfung.',
    payoutOnboarded: false,
    registeredAt: '2026-10-15T08:45:00Z'
  },
  {
    id: 'org-alps-fest',
    brandName: 'AlpenBeat Events',
    legalEntity: 'AlpenBeat Gastronomie & Event GbR',
    taxId: '',
    email: 'servus@alpenbeat-festival.de',
    phone: '+49 89 77665544',
    address: 'Leopoldstraße 108, 80802 München',
    verificationStatus: 'info_needed',
    verificationNotes: 'Steuernummer und Gesellschaftervertrag noch erforderlich.',
    payoutOnboarded: false,
    registeredAt: '2026-10-22T14:10:00Z'
  }
];

