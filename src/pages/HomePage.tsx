import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { PopularCities } from '../components/home/PopularCities';
import { FeaturedEvents } from '../components/home/FeaturedEvents';
import { CityScenes } from '../components/home/CityScenes';
import { OrganizerSection } from '../components/home/OrganizerSection';

export const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <PopularCities />
      <FeaturedEvents />
      <CityScenes />
      <OrganizerSection />
    </main>
  );
};

