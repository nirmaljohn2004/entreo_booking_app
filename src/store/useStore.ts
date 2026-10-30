import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AdminRole, 
  AuditLogEntry, 
  CityName, 
  ConsentSettings, 
  EventItem, 
  EventStatus, 
  Order, 
  Organizer, 
  PixelEventLog, 
  ProductionEnquiry 
} from '../types';
import { INITIAL_EVENTS } from '../data/mockEvents';
import { INITIAL_ORGANIZERS } from '../data/mockOrganizers';
import { INITIAL_ORDERS, INITIAL_ENQUIRIES } from '../data/mockOrders';
import { Language } from '../i18n/translations';

interface StoreState {
  // Locale
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;

  // Events
  events: EventItem[];
  savedEventIds: string[];
  toggleSavedEvent: (id: string) => void;
  addEvent: (event: EventItem) => void;
  updateEventStatus: (id: string, status: EventStatus, notes?: string) => void;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;

  // Organizers
  organizers: Organizer[];
  currentOrganizerId: string;
  updateOrganizerStatus: (id: string, status: Organizer['verificationStatus'], notes?: string) => void;
  saveOrganizerProfile: (profile: Partial<Organizer>) => void;

  // Orders
  orders: Order[];
  createOrder: (order: Order) => void;
  refundOrder: (orderId: string, reason?: string) => void;

  // Production Enquiries
  enquiries: ProductionEnquiry[];
  submitEnquiry: (enquiry: Omit<ProductionEnquiry, 'id' | 'createdAt'>) => void;
  updateEnquiryStatus: (id: string, status: ProductionEnquiry['status']) => void;

  // Admin Governance
  adminRole: AdminRole;
  setAdminRole: (role: AdminRole) => void;
  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;

  // Consent & Tracking
  consent: ConsentSettings;
  updateConsent: (settings: Partial<ConsentSettings>) => void;
  pixelLogs: PixelEventLog[];
  logPixelEvent: (eventName: string, payload: Record<string, unknown>) => void;
  clearPixelLogs: () => void;

  // Dev tools
  isDevDrawerOpen: boolean;
  toggleDevDrawer: () => void;
  resetAllData: () => void;
}

const DEFAULT_CONSENT: ConsentSettings = {
  necessary: true,
  analytics: false,
  marketing: false,
  updatedAt: new Date().toISOString(),
  hasConsented: false,
};

const DEFAULT_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-seed-1',
    timestamp: '2026-09-02T10:15:00Z',
    role: 'Reviewer',
    actor: 'admin.schmidt@entreo.de',
    action: 'APPROVED_EVENT',
    targetType: 'event',
    targetId: 'evt-lea-berlin',
    targetName: 'LEA — Büchertour 2026',
    notes: 'Artwork resolution and venue accessibility confirmed.'
  },
  {
    id: 'log-seed-2',
    timestamp: '2026-09-12T16:00:00Z',
    role: 'Reviewer',
    actor: 'admin.schmidt@entreo.de',
    action: 'APPROVED_EVENT',
    targetType: 'event',
    targetId: 'evt-klangkollektiv-hamburg',
    targetName: 'KlangKollektiv All-Night',
    notes: 'Age restriction (18+) verified for venue license.'
  }
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Locale
      lang: 'EN',
      setLang: (lang) => set({ lang }),
      toggleLang: () => set((state) => ({ lang: state.lang === 'DE' ? 'EN' : 'DE' })),

      // Events
      events: INITIAL_EVENTS,
      savedEventIds: ['evt-lea-berlin'],
      toggleSavedEvent: (id) =>
        set((state) => ({
          savedEventIds: state.savedEventIds.includes(id)
            ? state.savedEventIds.filter((item) => item !== id)
            : [...state.savedEventIds, id],
        })),
      addEvent: (event) =>
        set((state) => ({
          events: [event, ...state.events],
        })),
      updateEventStatus: (id, status, notes) => {
        set((state) => {
          const updatedEvents = state.events.map((e) => {
            if (e.id === id) {
              const currentNotes = e.reviewNotes || [];
              return {
                ...e,
                status,
                reviewNotes: notes ? [...currentNotes, notes] : currentNotes,
              };
            }
            return e;
          });

          // Log to audit
          const targetEvent = state.events.find((e) => e.id === id);
          if (targetEvent) {
            get().addAuditLog({
              role: state.adminRole,
              actor: `${state.adminRole.toLowerCase()}@entreo.de`,
              action: `STATUS_CHANGE_TO_${status.toUpperCase()}`,
              targetType: 'event',
              targetId: id,
              targetName: targetEvent.title,
              notes,
            });
          }

          return { events: updatedEvents };
        });
      },
      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),

      // Organizers
      organizers: INITIAL_ORGANIZERS,
      currentOrganizerId: 'org-koll-berlin',
      updateOrganizerStatus: (id, status, notes) => {
        set((state) => {
          const updated = state.organizers.map((org) => {
            if (org.id === id) {
              return {
                ...org,
                verificationStatus: status,
                verificationNotes: notes || org.verificationNotes,
              };
            }
            return org;
          });

          const targetOrg = state.organizers.find((o) => o.id === id);
          if (targetOrg) {
            get().addAuditLog({
              role: state.adminRole,
              actor: `${state.adminRole.toLowerCase()}@entreo.de`,
              action: `KYC_STATUS_${status.toUpperCase()}`,
              targetType: 'organizer',
              targetId: id,
              targetName: targetOrg.brandName,
              notes,
            });
          }

          return { organizers: updated };
        });
      },
      saveOrganizerProfile: (profile) =>
        set((state) => {
          const existing = state.organizers.find((o) => o.id === state.currentOrganizerId);
          if (existing) {
            return {
              organizers: state.organizers.map((o) =>
                o.id === state.currentOrganizerId ? { ...o, ...profile } : o
              ),
            };
          } else {
            const newOrg: Organizer = {
              id: state.currentOrganizerId || `org-${Date.now()}`,
              brandName: profile.brandName || 'Neuer Veranstalter',
              legalEntity: profile.legalEntity || '',
              taxId: profile.taxId || '',
              email: profile.email || '',
              phone: profile.phone || '',
              address: profile.address || '',
              verificationStatus: 'under_review',
              payoutOnboarded: false,
              registeredAt: new Date().toISOString(),
              ...profile,
            };
            return { organizers: [...state.organizers, newOrg] };
          }
        }),

      // Orders
      orders: INITIAL_ORDERS,
      createOrder: (order) => {
        set((state) => {
          // Decrement ticket availability
          const updatedEvents = state.events.map((evt) => {
            if (evt.id === order.eventId) {
              const updatedTickets = evt.tickets.map((t) => {
                const orderedItem = order.items.find((item) => item.tierId === t.id);
                if (orderedItem) {
                  return {
                    ...t,
                    available: Math.max(0, t.available - orderedItem.quantity),
                  };
                }
                return t;
              });
              return { ...evt, tickets: updatedTickets };
            }
            return evt;
          });

          return {
            orders: [order, ...state.orders],
            events: updatedEvents,
          };
        });

        // Track purchase event in Dev Pixel bus
        get().logPixelEvent('Purchase', {
          value: order.total,
          currency: 'EUR',
          orderId: order.orderNumber,
          num_items: order.items.reduce((acc, i) => acc + i.quantity, 0),
          eventTitle: order.eventTitle,
        });
      },
      refundOrder: (orderId, reason) => {
        set((state) => {
          const target = state.orders.find((o) => o.id === orderId);
          if (!target) return state;

          // Restock ticket availability
          const updatedEvents = state.events.map((evt) => {
            if (evt.id === target.eventId) {
              const updatedTickets = evt.tickets.map((t) => {
                const refundedItem = target.items.find((item) => item.tierId === t.id);
                if (refundedItem) {
                  return {
                    ...t,
                    available: Math.min(t.capacity, t.available + refundedItem.quantity),
                  };
                }
                return t;
              });
              return { ...evt, tickets: updatedTickets };
            }
            return evt;
          });

          const updatedOrders = state.orders.map((o) =>
            o.id === orderId ? { ...o, paymentStatus: 'refunded' as const } : o
          );

          get().addAuditLog({
            role: state.adminRole,
            actor: `${state.adminRole.toLowerCase()}@entreo.de`,
            action: 'ORDER_REFUNDED',
            targetType: 'order',
            targetId: orderId,
            targetName: target.orderNumber,
            notes: reason || 'Mock refund processed via admin backstage.',
          });

          return { orders: updatedOrders, events: updatedEvents };
        });
      },

      // Production Enquiries
      enquiries: INITIAL_ENQUIRIES,
      submitEnquiry: (enquiryData) =>
        set((state) => ({
          enquiries: [
            {
              id: `enq-${Date.now()}`,
              ...enquiryData,
              createdAt: new Date().toISOString(),
            },
            ...state.enquiries,
          ],
        })),
      updateEnquiryStatus: (id, status) =>
        set((state) => ({
          enquiries: state.enquiries.map((enq) => (enq.id === id ? { ...enq, status } : enq)),
        })),

      // Admin
      adminRole: 'Reviewer',
      setAdminRole: (role) => set({ adminRole: role }),
      auditLogs: DEFAULT_AUDIT_LOGS,
      addAuditLog: (entry) =>
        set((state) => ({
          auditLogs: [
            {
              id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              timestamp: new Date().toISOString(),
              ...entry,
            },
            ...state.auditLogs,
          ],
        })),

      // Consent & Tracking
      consent: DEFAULT_CONSENT,
      updateConsent: (settings) =>
        set((state) => ({
          consent: {
            ...state.consent,
            ...settings,
            updatedAt: new Date().toISOString(),
            hasConsented: true,
          },
        })),
      pixelLogs: [],
      logPixelEvent: (eventName, payload) => {
        const { consent } = get();
        const isMarketingAllowed = consent.marketing;

        const newLog: PixelEventLog = {
          id: `px-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: new Date().toLocaleTimeString('de-DE', { hour12: false }),
          eventName,
          payload,
          consented: isMarketingAllowed,
        };

        set((state) => ({
          pixelLogs: [newLog, ...state.pixelLogs].slice(0, 50),
        }));
      },
      clearPixelLogs: () => set({ pixelLogs: [] }),

      // Dev tools
      isDevDrawerOpen: false,
      toggleDevDrawer: () => set((state) => ({ isDevDrawerOpen: !state.isDevDrawerOpen })),

      resetAllData: () => {
        localStorage.removeItem('entreo-storage-v3');
        localStorage.removeItem('entreo-storage-v2');
        localStorage.removeItem('entreo-storage');
        set({
          lang: 'DE',
          events: INITIAL_EVENTS,
          savedEventIds: ['evt-lea-berlin'],
          organizers: INITIAL_ORGANIZERS,
          orders: INITIAL_ORDERS,
          enquiries: INITIAL_ENQUIRIES,
          adminRole: 'Reviewer',
          auditLogs: DEFAULT_AUDIT_LOGS,
          consent: DEFAULT_CONSENT,
          pixelLogs: [],
        });
      },
    }),
    {
      name: 'entreo-storage-v3',
      partialize: (state) => ({
        lang: state.lang,
        events: state.events,
        savedEventIds: state.savedEventIds,
        organizers: state.organizers,
        orders: state.orders,
        enquiries: state.enquiries,
        adminRole: state.adminRole,
        auditLogs: state.auditLogs,
        consent: state.consent,
        pixelLogs: state.pixelLogs,
      }),
    }
  )
);
