import { Order, ProductionEnquiry } from '../types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-883921',
    orderNumber: 'ENT-2026-8842',
    eventId: 'evt-lea-berlin',
    eventTitle: 'LEA — Live in Concert 2026',
    eventDate: '2026-11-13T20:00:00+01:00',
    doorsTime: '18:30',
    startTime: '20:00',
    venueName: 'Uber Eats Music Hall',
    venueAddress: 'Mercedes-Platz 2, 10243 Berlin',
    city: 'Berlin',
    items: [
      {
        tierId: 't-lea-ga',
        tierName: 'General Admission (Floor)',
        quantity: 2,
        unitPrice: 49.00,
        fee: 3.50
      }
    ],
    subtotal: 98.00,
    bookingFee: 7.00,
    vatAmount: 16.76, // 19% incl.
    total: 105.00,
    customer: {
      firstName: 'Sophie',
      lastName: 'Müller',
      email: 'sophie.mueller@berlin-mail.de',
      phone: '+49 176 99887766'
    },
    paymentMethod: 'applepay',
    paymentStatus: 'paid',
    qrCodeSeed: 'ENT-8842-LEA-BERLIN-2026',
    createdAt: '2026-10-20T17:42:00Z'
  }
];

export const INITIAL_ENQUIRIES: ProductionEnquiry[] = [
  {
    id: 'enq-001',
    organizerId: 'org-koll-berlin',
    organizerName: 'SpreeLive Kultur GmbH',
    organizerEmail: 'hallo@spreelive-berlin.de',
    eventId: 'evt-lea-berlin',
    eventTitle: 'LEA — Büchertour & Neue Kapitel 2026',
    services: ['posters', 'social_assets', 'recap_video'],
    estimatedBudget: '2.500 € – 5.000 €',
    notes: 'Benötigen DIN A1 Plakate für Berlin City Light Säulen sowie einen cinematischen 60-Sekunden Aftermovie für Social Media.',
    status: 'in_progress' as unknown as 'new', // or 'quoted'
    createdAt: '2026-10-18T11:20:00Z'
  }
];

