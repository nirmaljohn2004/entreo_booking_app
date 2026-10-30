import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { ImpressumPage } from './pages/legal/ImpressumPage';
import { DatenschutzPage } from './pages/legal/DatenschutzPage';
import { AgbPage } from './pages/legal/AgbPage';
import { CreateEventPage } from './pages/organizer/CreateEventPage';
import { OrganizerPortalPage } from './pages/organizer/OrganizerPortalPage';
import { EventTrackingPage } from './pages/organizer/EventTrackingPage';
import { DoorScannerPage } from './pages/scanner/DoorScannerPage';
import { AdminBackstagePage } from './pages/admin/AdminBackstagePage';
import { CookieBanner } from './components/consent/CookieBanner';
import { CookieSettingsModal } from './components/consent/CookieSettingsModal';
import { DevToolbar } from './components/dev/DevToolbar';
import { DevPixelConsole } from './components/dev/DevPixelConsole';

const AppLayout: React.FC = () => {
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const location = useLocation();

  const isScannerView = location.pathname.startsWith('/scan');

  if (isScannerView) {
    return (
      <main className="min-h-screen bg-black">
        <Routes>
          <Route path="/scan/:eventId" element={<DoorScannerPage />} />
        </Routes>
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-entreo-cream text-entreo-ink selection:bg-entreo-red selection:text-white">
      <Header />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<DiscoveryPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/checkout/:eventId" element={<CheckoutPage />} />
          <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/organizer" element={<OrganizerPortalPage />} />
          <Route path="/organizer/create" element={<CreateEventPage />} />
          <Route path="/organizer/events/:id" element={<EventTrackingPage />} />
          <Route path="/scan/:eventId" element={<DoorScannerPage />} />
          <Route path="/admin" element={<AdminBackstagePage />} />
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/datenschutz" element={<DatenschutzPage />} />
          <Route path="/agb" element={<AgbPage />} />
        </Routes>
      </div>

      <Footer onOpenCookieSettings={() => setIsCookieModalOpen(true)} />

      {/* Global Overlays & Dev Tools */}
      <CookieBanner onOpenSettings={() => setIsCookieModalOpen(true)} />
      <CookieSettingsModal
        isOpen={isCookieModalOpen}
        onClose={() => setIsCookieModalOpen(false)}
      />
      <DevToolbar />
      <DevPixelConsole />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
