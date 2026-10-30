import { CityInfo } from '../types';

// SVG gradient city artworks — unique warm-toned skyline gradients per city
// Used as data URIs so they are always sharp at any resolution (no JPEG blur)
const berlinSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='264'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23FF6B35'/%3E%3Cstop offset='40%25' stop-color='%23C0392B'/%3E%3Cstop offset='100%25' stop-color='%231a0a05'/%3E%3C/linearGradient%3E%3ClinearGradient id='glow' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23FFD700' stop-opacity='0.4'/%3E%3Cstop offset='100%25' stop-color='%23FF8C00' stop-opacity='0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='264' fill='url(%23sky)'/%3E%3Cellipse cx='200' cy='90' rx='180' ry='60' fill='url(%23glow)'/%3E%3C!-- TV Tower --%3E%3Crect x='193' y='30' width='14' height='140' fill='%23d4c5b0' opacity='0.9'/%3E%3Cellipse cx='200' cy='75' rx='18' ry='18' fill='%23c8baa8' opacity='0.95'/%3E%3Crect x='198' y='55' width='4' height='80' fill='%23a09080' opacity='0.8'/%3E%3C!-- Skyline buildings --%3E%3Crect x='0' y='160' width='50' height='104' fill='%23180e08' opacity='0.9'/%3E%3Crect x='45' y='140' width='35' height='124' fill='%231e1008' opacity='0.85'/%3E%3Crect x='75' y='155' width='45' height='109' fill='%23180e06' opacity='0.9'/%3E%3Crect x='115' y='145' width='30' height='119' fill='%231c1008' opacity='0.88'/%3E%3Crect x='240' y='148' width='40' height='116' fill='%231e1008' opacity='0.88'/%3E%3Crect x='275' y='138' width='50' height='126' fill='%231a0e06' opacity='0.9'/%3E%3Crect x='320' y='150' width='40' height='114' fill='%231c1008' opacity='0.88'/%3E%3Crect x='355' y='143' width='45' height='121' fill='%23180e06' opacity='0.9'/%3E%3C!-- Ground --%3E%3Crect x='0' y='210' width='400' height='54' fill='%230d0704'/%3E%3C/svg%3E`;

const hamburgSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='264'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%231a2a4a'/%3E%3Cstop offset='50%25' stop-color='%232d5986'/%3E%3Cstop offset='100%25' stop-color='%230a1520'/%3E%3C/linearGradient%3E%3ClinearGradient id='water' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23103050'/%3E%3Cstop offset='100%25' stop-color='%23050f1a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='264' fill='url(%23sky)'/%3E%3C!-- Elbphilharmonie --%3E%3Crect x='140' y='100' width='120' height='100' fill='%23c8d8e8' opacity='0.85'/%3E%3Cpath d='M140 100 Q200 60 260 100' fill='%23dce8f0' opacity='0.9'/%3E%3Crect x='155' y='105' width='10' height='95' fill='%23b0c4d8' opacity='0.7'/%3E%3Crect x='175' y='110' width='10' height='90' fill='%23b0c4d8' opacity='0.7'/%3E%3Crect x='215' y='110' width='10' height='90' fill='%23b0c4d8' opacity='0.7'/%3E%3Crect x='235' y='105' width='10' height='95' fill='%23b0c4d8' opacity='0.7'/%3E%3C!-- Port cranes --%3E%3Crect x='20' y='120' width='6' height='80' fill='%23f0a020' opacity='0.8'/%3E%3Crect x='10' y='120' width='26' height='6' fill='%23f0a020' opacity='0.8'/%3E%3Crect x='55' y='130' width='6' height='70' fill='%23f0a020' opacity='0.75'/%3E%3Crect x='45' y='130' width='26' height='5' fill='%23f0a020' opacity='0.75'/%3E%3C!-- Water reflection --%3E%3Crect x='0' y='200' width='400' height='64' fill='url(%23water)'/%3E%3Cellipse cx='200' cy='205' rx='120' ry='8' fill='%235080a0' opacity='0.25'/%3E%3C/svg%3E`;

const munichSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='264'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%234a6fa5'/%3E%3Cstop offset='45%25' stop-color='%237b9abf'/%3E%3Cstop offset='100%25' stop-color='%231c2d3e'/%3E%3C/linearGradient%3E%3ClinearGradient id='alps' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23e8eef4'/%3E%3Cstop offset='100%25' stop-color='%23a8b8c8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='264' fill='url(%23sky)'/%3E%3C!-- Alps --%3E%3Cpath d='M0 150 L60 90 L120 130 L180 70 L240 110 L310 60 L370 95 L400 80 L400 180 L0 180Z' fill='url(%23alps)' opacity='0.8'/%3E%3C!-- Snow caps --%3E%3Cpath d='M180 70 L195 85 L165 85Z' fill='white' opacity='0.9'/%3E%3Cpath d='M310 60 L328 78 L292 78Z' fill='white' opacity='0.9'/%3E%3C!-- Frauenkirche towers --%3E%3Crect x='155' y='100' width='22' height='100' fill='%23c8b89a' opacity='0.95'/%3E%3Cellipse cx='166' cy='100' rx='11' ry='18' fill='%23a89070' opacity='0.95'/%3E%3Crect x='183' y='105' width='22' height='95' fill='%23c4b495' opacity='0.95'/%3E%3Cellipse cx='194' cy='105' rx='11' ry='18' fill='%23a08c6e' opacity='0.95'/%3E%3C!-- Ground --%3E%3Crect x='0' y='200' width='400' height='64' fill='%230e1820'/%3E%3C/svg%3E`;

const cologneSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='264'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23e05520'/%3E%3Cstop offset='50%25' stop-color='%23a83010'/%3E%3Cstop offset='100%25' stop-color='%23200a04'/%3E%3C/linearGradient%3E%3ClinearGradient id='river' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%235a3020'/%3E%3Cstop offset='100%25' stop-color='%231a0c06'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='264' fill='url(%23sky)'/%3E%3C!-- Cathedral spires --%3E%3Crect x='168' y='20' width='18' height='170' fill='%23504030' opacity='0.92'/%3E%3Cpolygon points='168,20 177,5 186,20' fill='%23403020' opacity='0.95'/%3E%3Crect x='195' y='30' width='18' height='160' fill='%23504030' opacity='0.92'/%3E%3Cpolygon points='195,30 204,12 213,30' fill='%23403020' opacity='0.95'/%3E%3Crect x='140' y='100' width='100' height='90' fill='%23403025' opacity='0.88'/%3E%3C!-- Hohenzollern bridge arcs --%3E%3Cpath d='M0 195 Q100 170 200 190 Q300 210 400 195' stroke='%23806040' stroke-width='5' fill='none' opacity='0.7'/%3E%3C!-- Rhine --%3E%3Crect x='0' y='210' width='400' height='54' fill='url(%23river)'/%3E%3Cellipse cx='200' cy='215' rx='160' ry='6' fill='%23c05018' opacity='0.3'/%3E%3C/svg%3E`;

const frankfurtSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='264'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%230d1b2a'/%3E%3Cstop offset='50%25' stop-color='%23162540'/%3E%3Cstop offset='100%25' stop-color='%230a1018'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='264' fill='url(%23sky)'/%3E%3C!-- Commerzbank Tower --%3E%3Crect x='185' y='30' width='30' height='175' fill='%2330506a' opacity='0.92'/%3E%3Crect x='190' y='25' width='20' height='20' fill='%2340607a' opacity='0.9'/%3E%3C!-- Windows --%3E%3Crect x='190' y='40' width='5' height='5' fill='%23ffd060' opacity='0.7'/%3E%3Crect x='200' y='40' width='5' height='5' fill='%23ffd060' opacity='0.7'/%3E%3Crect x='190' y='55' width='5' height='5' fill='%23ffd060' opacity='0.5'/%3E%3Crect x='200' y='55' width='5' height='5' fill='%23ffd060' opacity='0.8'/%3E%3Crect x='190' y='70' width='5' height='5' fill='%23ffd060' opacity='0.6'/%3E%3Crect x='200' y='70' width='5' height='5' fill='%23ffd060' opacity='0.7'/%3E%3C!-- Skyline --%3E%3Crect x='60' y='110' width='40' height='94' fill='%23203040' opacity='0.9'/%3E%3Crect x='95' y='90' width='35' height='114' fill='%231a2838' opacity='0.88'/%3E%3Crect x='125' y='105' width='30' height='99' fill='%23203040' opacity='0.9'/%3E%3Crect x='250' y='95' width='35' height='109' fill='%231c2c3c' opacity='0.9'/%3E%3Crect x='280' y='85' width='40' height='119' fill='%23203040' opacity='0.88'/%3E%3Crect x='315' y='100' width='45' height='104' fill='%231a2838' opacity='0.9'/%3E%3C!-- Lights --%3E%3Ccircle cx='215' cy='32' r='3' fill='%23ff2020' opacity='0.9'/%3E%3Crect x='0' y='215' width='400' height='49' fill='%230a0e14'/%3E%3C/svg%3E`;

const dusseldorfSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='264'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23700020'/%3E%3Cstop offset='50%25' stop-color='%23a03040'/%3E%3Cstop offset='100%25' stop-color='%23300010'/%3E%3C/linearGradient%3E%3ClinearGradient id='glow' x1='0.5' y1='0' x2='0.5' y2='1'%3E%3Cstop offset='0%25' stop-color='%23ff8040' stop-opacity='0.5'/%3E%3Cstop offset='100%25' stop-color='%23ff4020' stop-opacity='0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='264' fill='url(%23sky)'/%3E%3Cellipse cx='200' cy='110' rx='200' ry='80' fill='url(%23glow)'/%3E%3C!-- Rhine Tower --%3E%3Crect x='190' y='40' width='20' height='170' fill='%23d0c0a0' opacity='0.88'/%3E%3Cellipse cx='200' cy='100' rx='28' ry='16' fill='%23e0d0b0' opacity='0.9'/%3E%3Ccircle cx='200' cy='88' r='12' fill='%23c8b890' opacity='0.92'/%3E%3Crect x='198' y='35' width='4' height='55' fill='%23a09070' opacity='0.85'/%3E%3Ccircle cx='200' cy='35' r='3' fill='%23ff3030' opacity='0.9'/%3E%3C!-- Skyline --%3E%3Crect x='0' y='155' width='60' height='109' fill='%23280810' opacity='0.9'/%3E%3Crect x='55' y='140' width='45' height='124' fill='%23300c10' opacity='0.88'/%3E%3Crect x='250' y='145' width='50' height='119' fill='%23300c10' opacity='0.88'/%3E%3Crect x='295' y='130' width='55' height='134' fill='%23280810' opacity='0.9'/%3E%3Crect x='345' y='148' width='55' height='116' fill='%23300c10' opacity='0.88'/%3E%3Crect x='0' y='210' width='400' height='54' fill='%231a0608'/%3E%3C/svg%3E`;

export const CITIES: CityInfo[] = [
  {
    name: 'Berlin',
    state: 'Berlin',
    image: '/images/cities/berlin.png',
    eventCount: 42,
    description: 'Germany\'s creative epicenter, vibrant nightlife, indie stages and legendary techno clubs.'
  },
  {
    name: 'Hamburg',
    state: 'Hamburg',
    image: '/images/cities/hamburg.png',
    eventCount: 28,
    description: 'Maritime flair, world-class acoustics at the Elbphilharmonie, and historic St. Pauli live venues.'
  },
  {
    name: 'München',
    state: 'Bayern',
    image: '/images/cities/munich.png',
    eventCount: 31,
    description: 'Bavarian cultural richness, open-air arena concerts, and intimate cabaret basements.'
  },
  {
    name: 'Köln',
    state: 'Nordrhein-Westfalen',
    image: '/images/cities/cologne.png',
    eventCount: 26,
    description: 'The Rhine metropolis with infectious warmth, massive arena tours, and thriving comedy scenes.'
  },
  {
    name: 'Frankfurt',
    state: 'Hessen',
    image: frankfurtSvg,
    eventCount: 19,
    description: 'High-energy electronic beats, jazz clubs along the Main, and grand festival stages.'
  },
  {
    name: 'Düsseldorf',
    state: 'Nordrhein-Westfalen',
    image: dusseldorfSvg,
    eventCount: 17,
    description: 'Avant-garde art institutions, electronic music heritage, and vibrant Altstadt culture.'
  }
];

