import { EventItem } from '../types';

// Unique SVG artwork data-URIs per event — always crisp, no blur, no JPEG artifacts
// Each encodes a distinct mood matching the event category

// LEA — warm amber concert stage, singer silhouette
const imgLea = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='300'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23200a02'/%3E%3Cstop offset='40%25' stop-color='%23600e06'/%3E%3Cstop offset='100%25' stop-color='%23100402'/%3E%3C/linearGradient%3E%3CradialGradient id='spot' cx='0.5' cy='0.35' r='0.55'%3E%3Cstop offset='0%25' stop-color='%23ffb830' stop-opacity='0.9'/%3E%3Cstop offset='60%25' stop-color='%23e05010' stop-opacity='0.4'/%3E%3Cstop offset='100%25' stop-color='%23000' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='480' height='300' fill='url(%23bg)'/%3E%3Cellipse cx='240' cy='105' rx='180' ry='100' fill='url(%23spot)'/%3E%3C!-- Stage lights --%3E%3Ccircle cx='100' cy='20' r='12' fill='%23ffd060' opacity='0.5'/%3E%3Ccircle cx='200' cy='15' r='15' fill='%23ffb020' opacity='0.6'/%3E%3Ccircle cx='300' cy='15' r='15' fill='%23ffb020' opacity='0.6'/%3E%3Ccircle cx='390' cy='20' r='12' fill='%23ffd060' opacity='0.5'/%3E%3C!-- Singer silhouette --%3E%3Ccircle cx='240' cy='125' r='28' fill='%23120604' opacity='0.95'/%3E%3Crect x='225' y='153' width='30' height='70' rx='8' fill='%230e0402' opacity='0.9'/%3E%3C!-- Microphone arm --%3E%3Crect x='245' y='130' width='3' height='35' rx='1.5' fill='%23f0c060' opacity='0.8' transform='rotate(-15 246 130)'/%3E%3C!-- Crowd silhouettes --%3E%3Cellipse cx='60' cy='285' rx='55' ry='22' fill='%230e0402'/%3E%3Cellipse cx='180' cy='285' rx='65' ry='20' fill='%23120604'/%3E%3Cellipse cx='320' cy='285' rx='65' ry='20' fill='%23100402'/%3E%3Cellipse cx='440' cy='285' rx='55' ry='22' fill='%230e0402'/%3E%3Cellipse cx='240' cy='278' rx='100' ry='16' fill='%230a0200'/%3E%3C/svg%3E`;

// KlangKollektiv — deep red laser techno club
const imgKlang = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='300'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23080010'/%3E%3Cstop offset='100%25' stop-color='%23020006'/%3E%3C/linearGradient%3E%3CradialGradient id='laser' cx='0.5' cy='0.3' r='0.5'%3E%3Cstop offset='0%25' stop-color='%23ff0030' stop-opacity='1'/%3E%3Cstop offset='70%25' stop-color='%23800018' stop-opacity='0.4'/%3E%3Cstop offset='100%25' stop-color='%23000' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='480' height='300' fill='url(%23bg)'/%3E%3Cellipse cx='240' cy='90' rx='200' ry='90' fill='url(%23laser)'/%3E%3C!-- Laser beams --%3E%3Cline x1='240' y1='60' x2='0' y2='200' stroke='%23ff0040' stroke-width='1.5' opacity='0.7'/%3E%3Cline x1='240' y1='60' x2='80' y2='230' stroke='%23ff0040' stroke-width='1.5' opacity='0.6'/%3E%3Cline x1='240' y1='60' x2='160' y2='240' stroke='%23ff2050' stroke-width='1.5' opacity='0.8'/%3E%3Cline x1='240' y1='60' x2='320' y2='240' stroke='%23ff2050' stroke-width='1.5' opacity='0.8'/%3E%3Cline x1='240' y1='60' x2='400' y2='230' stroke='%23ff0040' stroke-width='1.5' opacity='0.6'/%3E%3Cline x1='240' y1='60' x2='480' y2='200' stroke='%23ff0040' stroke-width='1.5' opacity='0.7'/%3E%3C!-- DJ booth glow --%3E%3Cellipse cx='240' cy='200' rx='60' ry='18' fill='%23400010' opacity='0.9'/%3E%3Crect x='200' y='182' width='80' height='20' rx='4' fill='%23300008' opacity='0.95'/%3E%3C!-- Crowd --%3E%3Crect x='0' y='230' width='480' height='70' fill='%23080010'/%3E%3Cellipse cx='120' cy='235' rx='80' ry='18' fill='%230c0018' opacity='0.9'/%3E%3Cellipse cx='360' cy='235' rx='80' ry='18' fill='%230c0018' opacity='0.9'/%3E%3C/svg%3E`;

// Felix Lobrecht — warm comedy spotlight, solo mic stand centre stage
const imgFelix = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='300'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23180c04'/%3E%3Cstop offset='100%25' stop-color='%230a0602'/%3E%3C/linearGradient%3E%3CradialGradient id='spot' cx='0.5' cy='0.25' r='0.4'%3E%3Cstop offset='0%25' stop-color='%23ffe8a0' stop-opacity='0.95'/%3E%3Cstop offset='50%25' stop-color='%23e08020' stop-opacity='0.5'/%3E%3Cstop offset='100%25' stop-color='%23000' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='480' height='300' fill='url(%23bg)'/%3E%3Cellipse cx='240' cy='80' rx='130' ry='80' fill='url(%23spot)'/%3E%3C!-- Microphone stand --%3E%3Crect x='237' y='100' width='6' height='110' rx='3' fill='%23d0b060' opacity='0.9'/%3E%3Cellipse cx='240' cy='100' rx='12' ry='5' fill='%23c0a050' opacity='0.9'/%3E%3Crect x='215' y='205' width='50' height='5' rx='2.5' fill='%23b09040' opacity='0.8'/%3E%3C!-- Comedian silhouette --%3E%3Ccircle cx='240' cy='138' r='22' fill='%23120800' opacity='0.92'/%3E%3Crect x='228' y='160' width='24' height='58' rx='6' fill='%230e0604'/%3E%3C!-- Arm reaching to mic --%3E%3Cpath d='M228 168 Q218 145 232 102' stroke='%230e0604' stroke-width='8' fill='none' stroke-linecap='round'/%3E%3C!-- Curtain edges --%3E%3Crect x='0' y='0' width='60' height='300' fill='%23100804' opacity='0.7'/%3E%3Crect x='420' y='0' width='60' height='300' fill='%23100804' opacity='0.7'/%3E%3C!-- Crowd --%3E%3Cellipse cx='240' cy='285' rx='200' ry='18' fill='%230c0602'/%3E%3C/svg%3E`;

// Isar Symphony — cool blue neo-classical concert hall interior
const imgIsar = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='300'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%230a1830'/%3E%3Cstop offset='100%25' stop-color='%23040c18'/%3E%3C/linearGradient%3E%3CradialGradient id='glow' cx='0.5' cy='0.4' r='0.45'%3E%3Cstop offset='0%25' stop-color='%23a0c8f0' stop-opacity='0.7'/%3E%3Cstop offset='100%25' stop-color='%230a1830' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='480' height='300' fill='url(%23bg)'/%3E%3Cellipse cx='240' cy='120' rx='160' ry='100' fill='url(%23glow)'/%3E%3C!-- Concert hall arch --%3E%3Cpath d='M80 280 Q80 80 240 60 Q400 80 400 280' stroke='%23506080' stroke-width='3' fill='none' opacity='0.6'/%3E%3Cpath d='M120 280 Q120 110 240 90 Q360 110 360 280' stroke='%23607090' stroke-width='2' fill='none' opacity='0.4'/%3E%3C!-- Chandelier --%3E%3Ccircle cx='240' cy='55' r='25' fill='none' stroke='%23d0e8ff' stroke-width='2' opacity='0.6'/%3E%3Ccircle cx='240' cy='55' r='15' fill='%23e8f4ff' opacity='0.5'/%3E%3Ccircle cx='240' cy='55' r='6' fill='%23ffffff' opacity='0.8'/%3E%3C!-- Orchestra silhouettes --%3E%3Cellipse cx='240' cy='220' rx='160' ry='30' fill='%230a1020' opacity='0.9'/%3E%3C!-- String players --%3E%3Crect x='130' y='200' width='8' height='30' rx='3' fill='%23101828' opacity='0.9'/%3E%3Crect x='155' y='198' width='8' height='32' rx='3' fill='%230c1420'/%3E%3Crect x='180' y='202' width='8' height='28' rx='3' fill='%23101828'/%3E%3Crect x='205' y='200' width='8' height='30' rx='3' fill='%230c1420'/%3E%3Crect x='270' y='200' width='8' height='30' rx='3' fill='%23101828'/%3E%3Crect x='295' y='198' width='8' height='32' rx='3' fill='%230c1420'/%3E%3Crect x='320' y='202' width='8' height='28' rx='3' fill='%23101828'/%3E%3C/svg%3E`;

// Mainhattan Underground Groove — deep purple house floor Frankfurt
const imgGroove = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='300'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%230c0618'/%3E%3Cstop offset='100%25' stop-color='%23040210'/%3E%3C/linearGradient%3E%3CradialGradient id='floor' cx='0.5' cy='0.9' r='0.6'%3E%3Cstop offset='0%25' stop-color='%234020a0' stop-opacity='0.9'/%3E%3Cstop offset='100%25' stop-color='%23000' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='light1' cx='0.3' cy='0.2' r='0.3'%3E%3Cstop offset='0%25' stop-color='%2300c8ff' stop-opacity='0.7'/%3E%3Cstop offset='100%25' stop-color='%23000' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='light2' cx='0.7' cy='0.2' r='0.3'%3E%3Cstop offset='0%25' stop-color='%23a000ff' stop-opacity='0.6'/%3E%3Cstop offset='100%25' stop-color='%23000' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='480' height='300' fill='url(%23bg)'/%3E%3Cellipse cx='240' cy='270' rx='240' ry='80' fill='url(%23floor)'/%3E%3Cellipse cx='144' cy='60' rx='140' ry='80' fill='url(%23light1)'/%3E%3Cellipse cx='336' cy='60' rx='140' ry='80' fill='url(%23light2)'/%3E%3C!-- Disco lights --%3E%3Ccircle cx='240' cy='25' r='18' fill='%23200840' opacity='0.8'/%3E%3Ccircle cx='240' cy='25' r='10' fill='%23401080' opacity='0.9'/%3E%3C!-- Light rays --%3E%3Cline x1='240' y1='40' x2='80' y2='180' stroke='%2300c0ff' stroke-width='1' opacity='0.4'/%3E%3Cline x1='240' y1='40' x2='160' y2='200' stroke='%23a000ff' stroke-width='1' opacity='0.4'/%3E%3Cline x1='240' y1='40' x2='320' y2='200' stroke='%2300c0ff' stroke-width='1' opacity='0.4'/%3E%3Cline x1='240' y1='40' x2='400' y2='180' stroke='%23a000ff' stroke-width='1' opacity='0.4'/%3E%3C!-- Dance floor crowd --%3E%3Cellipse cx='240' cy='285' rx='220' ry='20' fill='%230a0214'/%3E%3C/svg%3E`;

// Rheinland Acoustic Collective — warm earthy folk candlelit venue
const imgAcoustic = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='300'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%231a0e06'/%3E%3Cstop offset='100%25' stop-color='%230a0602'/%3E%3C/linearGradient%3E%3CradialGradient id='candle1' cx='0.3' cy='0.5' r='0.3'%3E%3Cstop offset='0%25' stop-color='%23ffcc60' stop-opacity='0.8'/%3E%3Cstop offset='100%25' stop-color='%23000' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='candle2' cx='0.7' cy='0.5' r='0.3'%3E%3Cstop offset='0%25' stop-color='%23ffb840' stop-opacity='0.7'/%3E%3Cstop offset='100%25' stop-color='%23000' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='centre' cx='0.5' cy='0.35' r='0.35'%3E%3Cstop offset='0%25' stop-color='%23e89040' stop-opacity='0.6'/%3E%3Cstop offset='100%25' stop-color='%23000' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='480' height='300' fill='url(%23bg)'/%3E%3Cellipse cx='144' cy='150' rx='140' ry='100' fill='url(%23candle1)'/%3E%3Cellipse cx='336' cy='150' rx='140' ry='100' fill='url(%23candle2)'/%3E%3Cellipse cx='240' cy='105' rx='140' ry='90' fill='url(%23centre)'/%3E%3C!-- Guitar body silhouette --%3E%3Cellipse cx='240' cy='165' rx='38' ry='45' fill='%230e0804' opacity='0.9'/%3E%3Cellipse cx='240' cy='135' rx='26' ry='30' fill='%230c0602' opacity='0.92'/%3E%3Crect x='238' y='95' width='4' height='50' rx='2' fill='%230a0502' opacity='0.9'/%3E%3C!-- Strings --%3E%3Cline x1='239' y1='100' x2='239' y2='185' stroke='%23c0a060' stroke-width='0.8' opacity='0.6'/%3E%3Cline x1='241' y1='100' x2='241' y2='185' stroke='%23c0a060' stroke-width='0.8' opacity='0.6'/%3E%3C!-- Candle flames --%3E%3Cellipse cx='144' cy='150' rx='4' ry='8' fill='%23ffee80' opacity='0.9'/%3E%3Cellipse cx='336' cy='148' rx='4' ry='7' fill='%23ffee80' opacity='0.9'/%3E%3C/svg%3E`;

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-lea-berlin',
    slug: 'lea-uber-eats-music-hall',
    title: 'LEA',
    subtitle: 'Büchertour & Neue Kapitel 2026',
    category: 'concert',
    genreTags: ['Pop', 'Indie', 'Deutschpop'],
    city: 'Berlin',
    venue: {
      name: 'Uber Eats Music Hall',
      address: 'Mercedes-Platz 2',
      postalCode: '10243',
      city: 'Berlin',
      accessibilityNotes: 'Barrierefreier Zugang über Aufzüge, rollstuhlgerechte Sanitäranlagen, induktive Höranlage vorhanden.'
    },
    startDate: '2026-11-13T20:00:00+01:00',
    doorsTime: '18:30',
    startTime: '20:00',
    endTime: '22:30',
    image: '/images/events/lea.png',
    featured: true,
    status: 'published',
    organizerId: 'org-koll-berlin',
    organizerName: 'SpreeLive Kultur GmbH',
    minPrice: 49,
    ageRestriction: '6+ (unter 14 Jahren nur in Begleitung eines Erziehungsberechtigten)',
    language: 'DE',
    refundPolicy: 'standard',
    descriptionDE: 'Erleben Sie LEA live in der intimen Atmosphäre der Uber Eats Music Hall in Berlin. Mit gefühlvollen Balladen, authentischen Texten und mitreißenden Hymnen verzaubert sie ihr Publikum auf dieser exklusiven Herbsttournee.',
    descriptionEN: 'Experience LEA live in the intimate acoustics of the Uber Eats Music Hall in Berlin. With heartfelt ballads, deeply authentic lyrics, and soaring indie-pop anthems, she captivates crowds across Germany.',
    tickets: [
      {
        id: 't-lea-ga',
        name: 'Stehplatz Innenraum (General Admission)',
        price: 49.00,
        fee: 3.50,
        capacity: 1200,
        available: 340,
        description: 'Freie Platzwahl im Innenraum direkt vor der Bühne.',
        maxPerOrder: 6
      },
      {
        id: 't-lea-seat',
        name: 'Sitzplatz Unterrang (Premium Seating)',
        price: 69.00,
        fee: 4.50,
        capacity: 800,
        available: 115,
        description: 'Reservierter Sitzplatz mit bester Akustik und direkter Sicht.',
        maxPerOrder: 4
      },
      {
        id: 't-lea-vip',
        name: 'VIP Soundcheck Package',
        price: 119.00,
        fee: 7.00,
        capacity: 100,
        available: 14,
        description: 'Früher Einlass (17:30), exklusiver Soundcheck-Zugang, Tour-Merch-Bundle und Fast-Lane Ticket.',
        maxPerOrder: 2
      }
    ],
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'evt-klangkollektiv-hamburg',
    slug: 'klangkollektiv-docks-hamburg',
    title: 'KlangKollektiv',
    subtitle: 'All Night Long: Hypnotic Techno & Modular Live Sets',
    category: 'clubbing',
    genreTags: ['Techno', 'Electronic'],
    city: 'Hamburg',
    venue: {
      name: 'Docks',
      address: 'Spielbudenplatz 19',
      postalCode: '20359',
      city: 'Hamburg',
      accessibilityNotes: 'Erdgeschoss stufenlos erreichbar. Bitte Support vorab kontaktieren für Begleitpersonen.'
    },
    startDate: '2026-11-28T23:00:00+01:00',
    doorsTime: '23:00',
    startTime: '23:59',
    endTime: '07:00',
    image: '/images/events/klangkollektiv.png',
    featured: true,
    status: 'published',
    organizerId: 'org-elbbeats',
    organizerName: 'Hanseatic Club Works',
    minPrice: 32,
    ageRestriction: '18+ (Ausweiskontrolle am Einlass strictly enforced)',
    language: 'Bilingual',
    refundPolicy: 'flexible',
    descriptionDE: 'Das KlangKollektiv kehrt nach Hamburg zurück: 8 Stunden kompromissloser Sound, immersives Lichtkonzept und handverlesene internationale Resident-DJs auf St. Paulis traditionsreichster Bühne.',
    descriptionEN: 'KlangKollektiv returns to Hamburg: 8 hours of uncompromising modular techno, cutting-edge red laser visuals, and handpicked underground selectors on St. Pauli’s most legendary dancefloor.',
    tickets: [
      {
        id: 't-kk-early',
        name: 'Early Bird Ticket',
        price: 32.00,
        fee: 2.50,
        capacity: 300,
        available: 48,
        description: 'Gültig für Einlass vor 01:00 Uhr.',
        maxPerOrder: 4
      },
      {
        id: 't-kk-regular',
        name: 'Regular All-Night Admission',
        price: 39.00,
        fee: 3.00,
        capacity: 900,
        available: 420,
        description: 'Flexibler Einlass die ganze Nacht inklusive Garderobe.',
        maxPerOrder: 6
      }
    ],
    createdAt: '2026-09-10T14:30:00Z'
  },
  {
    id: 'evt-felix-lobrecht-koeln',
    slug: 'felix-lobrecht-hype-koeln',
    title: 'Felix Lobrecht',
    subtitle: 'HYPE — Neues Stand-up Soloprogramm',
    category: 'comedy',
    genreTags: ['Stand-up', 'Comedy'],
    city: 'Köln',
    venue: {
      name: 'Lanxess Arena',
      address: 'Willy-Brandt-Platz 3',
      postalCode: '50679',
      city: 'Köln',
      accessibilityNotes: 'Vollständig barrierefreie Arena. Rollstuhlplätze im Unterrang mit Begleitperson.'
    },
    startDate: '2026-12-04T20:00:00+01:00',
    doorsTime: '18:00',
    startTime: '20:00',
    endTime: '22:15',
    image: '/images/events/felix-lobrecht.png',
    featured: true,
    status: 'published',
    organizerId: 'org-punchline-cologne',
    organizerName: 'Rhine Comedy Productions',
    minPrice: 45,
    ageRestriction: '16+ empfohlen (explizite Sprache)',
    language: 'DE',
    refundPolicy: 'standard',
    descriptionDE: 'Felix Lobrecht kommt mit seinem brandneuen Stand-up-Programm nach Köln. Scharfzüngig, ungeschönt und mit unverwechselbarem Berliner Witz nimmt er Alltag, Gesellschaft und Popkultur auseinander.',
    descriptionEN: 'Germany’s premier comedian brings his brand new stand-up show to Cologne’s Lanxess Arena. Sharp, raw, and delightfully unfiltered observational humor at maximum arena scale.',
    tickets: [
      {
        id: 't-fl-cat2',
        name: 'Kategorie 2 — Oberrang',
        price: 45.00,
        fee: 3.50,
        capacity: 2500,
        available: 310,
        description: 'Sitzplatz im Oberrang mit gutem Überblick.',
        maxPerOrder: 4
      },
      {
        id: 't-fl-cat1',
        name: 'Kategorie 1 — Unterrang Bestplatz',
        price: 62.00,
        fee: 4.50,
        capacity: 3500,
        available: 84,
        description: 'Beste Sichtlinien im Unterrang, nah an der Center Stage.',
        maxPerOrder: 4
      }
    ],
    createdAt: '2026-09-12T09:15:00Z'
  },
  {
    id: 'evt-nritya-heritage-muenchen',
    slug: 'nritya-heritage-dance-spectacle',
    title: 'Nritya Heritage',
    subtitle: 'Rhythms of Celebration: Live Dance & Percussion Ensemble',
    category: 'concert',
    genreTags: ['Dance', 'World Music', 'Live Folk'],
    city: 'München',
    venue: {
      name: 'Deutsches Theater München',
      address: 'Schwanthalerstraße 13',
      postalCode: '80336',
      city: 'München',
      accessibilityNotes: 'Historisches Theater barrierefrei ausgebaut. Rollstuhlpodeste und barrierefreie Sanitäranlagen im Erdgeschoss.'
    },
    startDate: '2026-12-10T19:30:00+01:00',
    doorsTime: '18:30',
    startTime: '19:30',
    endTime: '22:00',
    image: '/images/events/cultural-dance.png',
    featured: true,
    status: 'published',
    organizerId: 'org-world-arts-bavaria',
    organizerName: 'Bavarian Arts Society',
    minPrice: 36,
    ageRestriction: 'All ages (Empfohlen für die ganze Familie)',
    language: 'Bilingual',
    refundPolicy: 'flexible',
    descriptionDE: 'Ein mitreißendes Fest der Sinne: Meisterhafte Tänzerinnen, virtuose Dholak- und Tabla-Rhythmen sowie traditionelle Melodien verschmelzen zu einer farbenprächtigen Bühnenshow.',
    descriptionEN: 'A breathtaking cultural celebration: master dancers, soaring traditional melodies, and thunderous percussion bring ancient heritage to life on Munich’s premier stage.',
    tickets: [
      {
        id: 't-nh-parkett',
        name: 'Parkett Mitte Bestplatz',
        price: 52.00,
        fee: 4.00,
        capacity: 500,
        available: 160,
        description: 'Beste Sicht auf Tanzchoreografien und Live-Orchester.',
        maxPerOrder: 6
      },
      {
        id: 't-nh-rang',
        name: 'Rang Standard',
        price: 36.00,
        fee: 3.00,
        capacity: 400,
        available: 125,
        description: 'Klassische Theaterakustik mit erhabenem Panoramablick.',
        maxPerOrder: 6
      }
    ],
    createdAt: '2026-09-14T11:00:00Z'
  },
  {
    id: 'evt-chenda-melam-frankfurt',
    slug: 'kerala-chenda-melam-frankfurt',
    title: 'Thaalam',
    subtitle: 'Panchari Melam & Kerala Percussion Symphony',
    category: 'concert',
    genreTags: ['Chenda Melam', 'Kerala Fusion', 'World Music'],
    city: 'Frankfurt',
    venue: {
      name: 'Jahrhunderthalle Frankfurt',
      address: 'Pfaffenwiese 301',
      postalCode: '65929',
      city: 'Frankfurt',
      accessibilityNotes: 'Ebenerdige Zugänge, Aufzüge und reservierte Rollstuhlplätze im Kuppelsaal.'
    },
    startDate: '2026-12-18T19:00:00+01:00',
    doorsTime: '18:00',
    startTime: '19:00',
    endTime: '22:00',
    image: '/images/events/chenda-melam.jpg',
    featured: true,
    status: 'published',
    organizerId: 'org-kerala-cultural-de',
    organizerName: 'Kerala Cultural Forum e.V.',
    minPrice: 34,
    ageRestriction: 'All ages (Kultur- & Familienfreundlich)',
    language: 'Bilingual',
    refundPolicy: 'flexible',
    descriptionDE: 'Erleben Sie die kraftvolle Rhythmuswucht Keralas live in Frankfurt: Ein 25-köpfiges Ensemble aus Meistertrommlern präsentiert traditionellen Panchari Melam, mitreißende Chenda-Rhythmen und virtuose Elathalam-Becken.',
    descriptionEN: 'Experience the thunderous cultural percussion of Kerala live in Frankfurt: A 25-piece master drum ensemble presents traditional Panchari Melam, soaring Chenda beats, and captivating South Indian rhythm symphonies.',
    tickets: [
      {
        id: 't-tm-cat1',
        name: 'Kategorie 1 — Gold Seating',
        price: 48.00,
        fee: 3.50,
        capacity: 600,
        available: 180,
        description: 'Beste Akustik und zentrale Sicht auf das Percussion-Orchester.',
        maxPerOrder: 6
      },
      {
        id: 't-tm-cat2',
        name: 'Kategorie 2 — Standard',
        price: 34.00,
        fee: 2.50,
        capacity: 800,
        available: 310,
        description: 'Gute Sicht und volle Akustik im Saal.',
        maxPerOrder: 6
      }
    ],
    createdAt: '2026-09-16T12:00:00Z'
  },
  {
    id: 'evt-malabar-rock-berlin',
    slug: 'malabar-indie-sessions-berlin',
    title: 'Malabar Indie',
    subtitle: 'Malayalam Alternative Rock & Electro-Folk Live',
    category: 'concert',
    genreTags: ['Malayalam Rock', 'Indie', 'Electro-Folk'],
    city: 'Berlin',
    venue: {
      name: 'Astra Kulturhaus Berlin',
      address: 'Revaler Str. 99',
      postalCode: '10245',
      city: 'Berlin',
      accessibilityNotes: 'Barrierefreier Zugang über Hof, rollstuhlgerechte Sanitäranlagen vorhanden.'
    },
    startDate: '2027-01-08T20:30:00+01:00',
    doorsTime: '19:30',
    startTime: '20:30',
    endTime: '23:30',
    image: '/images/events/malabar-rock.jpg',
    featured: true,
    status: 'published',
    organizerId: 'org-indie-sound-berlin',
    organizerName: 'South Asian Wave Berlin',
    minPrice: 38,
    ageRestriction: '16+ (unter 16 nur mit Erziehungsberechtigten)',
    language: 'Bilingual',
    refundPolicy: 'standard',
    descriptionDE: 'Kochis legendärer Indie-Sound erreicht Berlin: Kraftvoller Malayalam Alternative Rock verschmilzt mit progressiven Gitarrenriffs, Malayalam-Folklore und pulsierenden Synth-Soundscapes.',
    descriptionEN: 'Kochi’s revolutionary indie rock movement lands in Berlin: High-energy Malayalam alternative rock featuring soaring vocals, heavy guitar riffs, and hypnotic electro-folk grooves live at Astra.',
    tickets: [
      {
        id: 't-mr-ga',
        name: 'Stehplatz Innenraum (Live Floor)',
        price: 38.00,
        fee: 3.00,
        capacity: 900,
        available: 240,
        description: 'Freie Platzwahl auf dem Dancefloor direkt vor der Bühne.',
        maxPerOrder: 6
      },
      {
        id: 't-mr-vip',
        name: 'VIP Balcony & Band Meet',
        price: 75.00,
        fee: 5.00,
        capacity: 120,
        available: 28,
        description: 'Exklusiver Zugang zur Galerie, Fast-Track Einlass und Meet & Greet.',
        maxPerOrder: 4
      }
    ],
    createdAt: '2026-09-17T15:00:00Z'
  },
  {
    id: 'evt-isar-symphony-muenchen',
    slug: 'isar-symphony-sessions-muenchen',
    title: 'Isar Symphony Sessions',
    subtitle: 'Neo-Classical Strings & Ambient Soundscapes',
    category: 'concert',
    genreTags: ['Classical', 'Neo-Classical', 'Ambient'],
    city: 'München',
    venue: {
      name: 'Isarphilharmonie',
      address: 'Hans-Preißinger-Straße 8',
      postalCode: '81379',
      city: 'München',
      accessibilityNotes: 'Moderne Barrierefreiheit, stufenlose Zugänge zu allen Rängen, Aufzüge und Rollstuhlpodeste.'
    },
    startDate: '2026-12-12T19:30:00+01:00',
    doorsTime: '18:30',
    startTime: '19:30',
    endTime: '21:45',
    image: imgIsar,
    featured: false,
    status: 'published',
    organizerId: 'org-bavarian-arts',
    organizerName: 'Bavarian Arts Society',
    minPrice: 38,
    ageRestriction: 'All ages (Empfehlung ab 10 Jahren)',
    language: 'Bilingual',
    refundPolicy: 'flexible',
    descriptionDE: 'Ein Abend voller klanglicher Tiefe: Ein 40-köpfiges Kammerensemble trifft auf modulare Synthesizer und minimalistische Kompositionen in der atemberaubenden Holzarchitektur der Isarphilharmonie.',
    descriptionEN: 'An evening of profound acoustic richness: A 40-piece chamber ensemble merges with analog synthesizers in the sublime timber acoustics of Munich’s Isarphilharmonie.',
    tickets: [
      {
        id: 't-iss-parkett',
        name: 'Parkett Mitte',
        price: 54.00,
        fee: 4.00,
        capacity: 600,
        available: 140,
        description: 'Zentrale Bestplatz-Kategorie im Parkett.',
        maxPerOrder: 4
      },
      {
        id: 't-iss-rang',
        name: 'Rang Links/Rechts',
        price: 38.00,
        fee: 3.00,
        capacity: 400,
        available: 92,
        description: 'Exzellente Akustik mit leicht erhöhtem Blickwinkel.',
        maxPerOrder: 4
      }
    ],
    createdAt: '2026-09-18T11:00:00Z'
  },
  {
    id: 'evt-underground-frankfurt',
    slug: 'mainhattan-underground-groove',
    title: 'Mainhattan Underground Groove',
    subtitle: 'Deep House & Melodic Journey across 3 Floors',
    category: 'clubbing',
    genreTags: ['House', 'Melodic Techno', 'Club'],
    city: 'Frankfurt',
    venue: {
      name: 'Tanzhaus West',
      address: 'Gutleutstraße 294',
      postalCode: '60327',
      city: 'Frankfurt',
      accessibilityNotes: 'Industrieareal mit befestigten Wegen, Hof ebenerdig zugänglich.'
    },
    startDate: '2026-12-19T23:00:00+01:00',
    doorsTime: '23:00',
    startTime: '23:30',
    endTime: '08:00',
    image: imgGroove,
    featured: false,
    status: 'published',
    organizerId: 'org-main-groove',
    organizerName: 'Main Groove Collective',
    minPrice: 24,
    ageRestriction: '18+',
    language: 'Bilingual',
    refundPolicy: 'flexible',
    descriptionDE: 'Das legendäre Jahresabschluss-Gathering im Tanzhaus West. Drei Floors mit treibendem Melodic Techno, soulful Deep House und einem beheizten Open-Air Wintergarten.',
    descriptionEN: 'Frankfurt’s signature end-of-year club night across three floors of evocative melodic house, hypnotic rhythms, and a heated winter garden courtyard.',
    tickets: [
      {
        id: 't-mug-reg',
        name: 'Standard Ticket',
        price: 24.00,
        fee: 2.00,
        capacity: 800,
        available: 230,
        description: 'Zugang zu allen drei Floors.',
        maxPerOrder: 6
      }
    ],
    createdAt: '2026-09-20T16:00:00Z'
  },
  {
    id: 'evt-acoustic-dusseldorf',
    slug: 'rheinland-acoustic-collective',
    title: 'Rheinland Acoustic Collective',
    subtitle: 'Intimate Songwriter Night & Storytelling',
    category: 'concert',
    genreTags: ['Folk', 'Acoustic', 'Indie'],
    city: 'Düsseldorf',
    venue: {
      name: 'Zakk Düsseldorf',
      address: 'Fichtenstraße 40',
      postalCode: '40233',
      city: 'Düsseldorf',
      accessibilityNotes: 'Komplett barrierefreies Kulturzentrum, rollstuhlgerechte Toiletten.'
    },
    startDate: '2027-01-14T19:30:00+01:00',
    doorsTime: '18:30',
    startTime: '19:30',
    endTime: '22:00',
    image: imgAcoustic,
    featured: false,
    status: 'published',
    organizerId: 'org-rhine-folk',
    organizerName: 'Zentrum für Aktion und Kultur',
    minPrice: 28,
    ageRestriction: 'All ages',
    language: 'DE',
    refundPolicy: 'standard',
    descriptionDE: 'Vier handverlesene Songwriter teilen sich die intime Bühne des Zakk. Warme Gitarrenklänge, authentische Lebensgeschichten und ein exklusiver Akustik-Abend.',
    descriptionEN: 'Four celebrated European singer-songwriters share an intimate stage at Zakk Düsseldorf for an evening of acoustic storytelling and stripped-down melodies.',
    tickets: [
      {
        id: 't-rac-standard',
        name: 'Freie Platzwahl (Sitz- & Stehplätze)',
        price: 28.00,
        fee: 2.50,
        capacity: 350,
        available: 120,
        description: 'Einlass inklusive Garderobe.',
        maxPerOrder: 4
      }
    ],
    createdAt: '2026-09-25T12:00:00Z'
  }
];
