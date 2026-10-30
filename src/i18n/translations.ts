export type Language = 'DE' | 'EN';

export interface Translations {
  nav: {
    search: string;
    events: string;
    organizers: string;
    createEvent: string;
    myTickets: string;
    admin: string;
    menu: string;
    close: string;
  };
  hero: {
    eyebrow: string;
    titlePart1: string;
    titlePart2: string;
    annotation: string;
    subtitle: string;
  };
  search: {
    keywordPlaceholder: string;
    allCities: string;
    anyDate: string;
    today: string;
    thisWeekend: string;
    nextWeekend: string;
    thisMonth: string;
    cta: string;
  };
  popularCities: {
    eyebrow: string;
    eventsSuffix: string;
  };
  featured: {
    eyebrow: string;
    title: string;
    highlight: string;
    seeAll: string;
    from: string;
    bookNow: string;
  };
  cityScenes: {
    eyebrow: string;
    title: string;
    viewAllCities: string;
  };
  organizers: {
    eyebrow: string;
    titlePart1: string;
    titlePart2: string;
    description: string;
    cta: string;
    annotation: string;
  };
  footer: {
    tagline: string;
    explore: string;
    organizersTitle: string;
    legalTitle: string;
    impressum: string;
    datenschutz: string;
    agb: string;
    cookies: string;
    rights: string;
    cityList: string[];
  };
  consent: {
    title: string;
    description: string;
    acceptAll: string;
    necessaryOnly: string;
    settings: string;
    save: string;
    necessary: string;
    necessaryDesc: string;
    analytics: string;
    analyticsDesc: string;
    marketing: string;
    marketingDesc: string;
  };
  dev: {
    resetData: string;
    resetSuccess: string;
    adminRole: string;
    pixelConsole: string;
    pixelEventsLogged: string;
  };
}

export const translations: Record<Language, Translations> = {
  DE: {
    nav: {
      search: 'Suchen',
      events: 'Events entdecken',
      organizers: 'Für Veranstalter',
      createEvent: 'Event erstellen',
      myTickets: 'Meine Tickets',
      admin: 'Admin Backstage',
      menu: 'Menü',
      close: 'Schließen',
    },
    hero: {
      eyebrow: 'LIVE EVENTS ACROSS GERMANY',
      titlePart1: 'Every event,',
      titlePart2: 'taken care of.',
      annotation: 'Music\nPeople\nMoments\nGermany',
      subtitle: 'Konzerte, Festivals, Comedy, Theater, Clubs und mehr — handverlesene Events in ganz Deutschland.',
    },
    search: {
      keywordPlaceholder: 'Events, Künstler oder Genres suchen',
      allCities: 'Alle Städte',
      anyDate: 'Beliebiges Datum',
      today: 'Heute',
      thisWeekend: 'Dieses Wochenende',
      nextWeekend: 'Nächstes Wochenende',
      thisMonth: 'Diesen Monat',
      cta: 'Events suchen',
    },
    popularCities: {
      eyebrow: 'POPULAR CITIES',
      eventsSuffix: 'Events',
    },
    featured: {
      eyebrow: 'FEATURED EVENTS',
      title: 'Unverzichtbare Events in',
      highlight: 'Deutschland',
      seeAll: 'Alle ansehen',
      from: 'Ab',
      bookNow: 'Tickets wählen',
    },
    cityScenes: {
      eyebrow: 'EXPLORE EVENTS BY CITY',
      title: 'Entdecke Deutschlands\nKulturszenen',
      viewAllCities: 'Alle Städte anzeigen',
    },
    organizers: {
      eyebrow: 'FOR ORGANIZERS',
      titlePart1: 'Großartige Events verdienen',
      titlePart2: 'großartige Produktion.',
      description: 'Von Plakatdesign und Eventfotografie bis hin zur Videoproduktion — wir unterstützen Künstler, Labels und Venues dabei, ihre Events perfekt zu inszenieren und mehr Tickets zu verkaufen.',
      cta: 'Team kontaktieren',
      annotation: 'Plakatdesign\nFotografie\nVideoproduktion\nMehr Ticketverkäufe',
    },
    footer: {
      tagline: 'Die kuratierte Plattform für unvergessliche Live-Momente in Deutschland.',
      explore: 'Entdecken',
      organizersTitle: 'Veranstalter',
      legalTitle: 'Rechtliches & Datenschutz',
      impressum: 'Impressum',
      datenschutz: 'Datenschutz',
      agb: 'AGB',
      cookies: 'Cookie-Einstellungen',
      rights: 'Alle Rechte vorbehalten. Made with pride in Germany.',
      cityList: ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Düsseldorf'],
    },
    consent: {
      title: 'Ihre Privatsphäre auf ENTRÉO',
      description: 'Wir nutzen Cookies und ähnliche Technologien, um Ihnen ein nahtloses Buchungserlebnis zu bieten und relevante Eventempfehlungen bereitzustellen. Entscheiden Sie selbst, welche Kategorien Sie zulassen möchten.',
      acceptAll: 'Alle akzeptieren',
      necessaryOnly: 'Nur essenzielle',
      settings: 'Einstellungen anpassen',
      save: 'Auswahl speichern',
      necessary: 'Technisch essenziell',
      necessaryDesc: 'Erforderlich für Navigation, Warenkorb, Ticketreservierung und sichere Zahlungsabwicklung.',
      analytics: 'Anonyme Reichweitenmessung',
      analyticsDesc: 'Hilft uns zu verstehen, welche Städte und Eventkategorien am meisten nachgefragt werden.',
      marketing: 'Marketing & Kampagnen (Meta Pixel Simulation)',
      marketingDesc: 'Ermöglicht die Messung von Ticketkampagnen. Nur bei Zustimmung werden Mock-Pixel-Events protokolliert.',
    },
    dev: {
      resetData: 'Demodaten zurücksetzen',
      resetSuccess: 'Alle Daten wurden auf den Seed-Zustand zurückgesetzt.',
      adminRole: 'Aktive Rolle',
      pixelConsole: 'Meta Pixel Dev-Console',
      pixelEventsLogged: 'Protokollierte Events',
    },
  },
  EN: {
    nav: {
      search: 'Search',
      events: 'Explore events',
      organizers: 'For organizers',
      createEvent: 'Create an event',
      myTickets: 'My Tickets',
      admin: 'Admin Backstage',
      menu: 'Menu',
      close: 'Close',
    },
    hero: {
      eyebrow: 'LIVE EVENTS ACROSS GERMANY',
      titlePart1: 'Every event,',
      titlePart2: 'taken care of.',
      annotation: 'Music\nPeople\nMoments\nGermany',
      subtitle: 'Concerts, festivals, comedy, theatre, clubs and more — handpicked events across Germany.',
    },
    search: {
      keywordPlaceholder: 'Search events, artists or keywords',
      allCities: 'All Cities',
      anyDate: 'Any date',
      today: 'Today',
      thisWeekend: 'This weekend',
      nextWeekend: 'Next weekend',
      thisMonth: 'This month',
      cta: 'Search events',
    },
    popularCities: {
      eyebrow: 'POPULAR CITIES',
      eventsSuffix: 'events',
    },
    featured: {
      eyebrow: 'FEATURED EVENTS',
      title: 'Unmissable events in',
      highlight: 'Germany',
      seeAll: 'See all',
      from: 'From',
      bookNow: 'Select tickets',
    },
    cityScenes: {
      eyebrow: 'EXPLORE EVENTS BY CITY',
      title: 'Discover Germany’s\nevent scenes',
      viewAllCities: 'View all cities',
    },
    organizers: {
      eyebrow: 'FOR ORGANIZERS',
      titlePart1: 'Great events',
      titlePart2: 'deserve great production.',
      description: 'From poster design and event photography to video production — we help artists, brands and venues bring their events to life and sell more tickets.',
      cta: 'Talk to our team',
      annotation: 'Poster Design\nPhotography\nVideo Production\nHigher Ticket Sales',
    },
    footer: {
      tagline: 'The curated live experience booking platform for Germany.',
      explore: 'Explore',
      organizersTitle: 'Organizers',
      legalTitle: 'Legal & Privacy',
      impressum: 'Imprint',
      datenschutz: 'Privacy Policy',
      agb: 'Terms of Service',
      cookies: 'Cookie Settings',
      rights: 'All rights reserved. Made with pride in Germany.',
      cityList: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Düsseldorf'],
    },
    consent: {
      title: 'Your privacy on ENTRÉO',
      description: 'We use cookies and similar technologies to ensure seamless ticketing and present relevant cultural experiences. You decide which categories to allow.',
      acceptAll: 'Accept all',
      necessaryOnly: 'Necessary only',
      settings: 'Customize settings',
      save: 'Save preferences',
      necessary: 'Technically Necessary',
      necessaryDesc: 'Required for session security, cart holding, and ticket checkout functionality.',
      analytics: 'Performance & Aggregated Analytics',
      analyticsDesc: 'Helps us analyze discovery patterns and venue demand across regions.',
      marketing: 'Marketing (Meta Pixel Architecture Simulation)',
      marketingDesc: 'Simulates conversion tracking. Strictly inactive unless explicit consent is granted.',
    },
    dev: {
      resetData: 'Reset Demo Data',
      resetSuccess: 'Data reset to initial seed state.',
      adminRole: 'Active Role',
      pixelConsole: 'Meta Pixel Dev Console',
      pixelEventsLogged: 'Logged Events',
    },
  },
};

