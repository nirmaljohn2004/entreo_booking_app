export type CityName = 'Berlin' | 'Hamburg' | 'München' | 'Köln' | 'Frankfurt' | 'Düsseldorf';

export type EventCategory = 'concert' | 'clubbing' | 'comedy' | 'theatre' | 'festival';

export type EventStatus = 
  | 'draft' 
  | 'submitted' 
  | 'changes_requested' 
  | 'approved' 
  | 'published' 
  | 'rejected';

export type OrganizerVerificationStatus = 
  | 'not_started' 
  | 'info_needed' 
  | 'under_review' 
  | 'verified' 
  | 'action_required';

export type AdminRole = 'Reviewer' | 'Support' | 'Finance';

export interface TicketTier {
  id: string;
  name: string;
  price: number; // in EUR (incl. VAT)
  fee: number;   // booking fee in EUR
  capacity: number;
  available: number;
  description: string;
  maxPerOrder: number;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: EventCategory;
  genreTags: string[];
  city: CityName;
  venue: {
    name: string;
    address: string;
    postalCode: string;
    city: CityName;
    accessibilityNotes: string;
  };
  startDate: string; // ISO date string in Europe/Berlin
  doorsTime: string; // e.g. "19:00"
  startTime: string; // e.g. "20:00"
  endTime?: string;  // e.g. "23:00"
  image: string;
  featured: boolean;
  status: EventStatus;
  organizerId: string;
  organizerName: string;
  tickets: TicketTier[];
  minPrice: number;
  ageRestriction: string; // e.g. "18+", "16+ mit Begleitung", "All ages"
  language: 'DE' | 'EN' | 'Bilingual';
  refundPolicy: 'flexible' | 'standard' | 'non_refundable';
  descriptionDE: string;
  descriptionEN: string;
  reviewNotes?: string[];
  createdAt: string;
}

export interface CityInfo {
  name: CityName;
  state: string;
  image: string;
  eventCount: number;
  description: string;
}

export interface Organizer {
  id: string;
  brandName: string;
  legalEntity: string;
  taxId: string; // Steuernummer or USt-IdNr
  email: string;
  phone: string;
  address: string;
  verificationStatus: OrganizerVerificationStatus;
  verificationNotes?: string;
  payoutOnboarded: boolean;
  registeredAt: string;
}

export interface OrderItem {
  tierId: string;
  tierName: string;
  quantity: number;
  unitPrice: number;
  fee: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "ENT-2026-9481"
  eventId: string;
  eventTitle: string;
  eventDate: string;
  doorsTime: string;
  startTime: string;
  venueName: string;
  venueAddress: string;
  city: CityName;
  items: OrderItem[];
  subtotal: number;
  bookingFee: number;
  vatAmount: number; // 19% German VAT included
  total: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  paymentMethod: 'sepa' | 'giropay' | 'card' | 'applepay';
  paymentStatus: 'paid' | 'refunded';
  qrCodeSeed: string;
  createdAt: string;
}

export interface ProductionEnquiry {
  id: string;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  eventId?: string;
  eventTitle?: string;
  services: ('posters' | 'social_assets' | 'photography' | 'recap_video' | 'promotion')[];
  estimatedBudget: string;
  notes: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  createdAt: string;
}

export interface ConsentSettings {
  necessary: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  hasConsented: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  role: AdminRole;
  actor: string;
  action: string;
  targetType: 'event' | 'organizer' | 'order' | 'enquiry';
  targetId: string;
  targetName: string;
  notes?: string;
}

export interface PixelEventLog {
  id: string;
  timestamp: string;
  eventName: string;
  payload: Record<string, unknown>;
  consented: boolean;
}

