import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { translations } from '../../i18n/translations';
import { ProductionModal } from '../organizer/ProductionModal';

export const OrganizerSection: React.FC = () => {
  const { lang } = useStore();
  const t = translations[lang];
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        {/* Soft Blush Studio Card matching reference */}
        <div className="bg-[#FAF4F2] rounded-3xl border border-[#F0E5E1] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Editorial Copy & CTAs (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Eyebrow with dash */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  {lang === 'DE' ? 'FÜR VERANSTALTER' : 'FOR ORGANIZERS'}
                </span>
                <span className="w-8 h-px bg-neutral-300" />
              </div>

              {/* Headline */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-entreo-ink tracking-tight leading-[1.08]">
                {lang === 'DE' ? 'Erwecken Sie Ihr Event' : 'Bring your event'}
                <br />
                <span>{lang === 'DE' ? 'zum Leben mit ' : 'to life with '}</span>
                <span className="italic font-normal">
                  ENTRÉO.
                </span>
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-lg">
                {lang === 'DE'
                  ? 'Erstellen Sie Ihr Event, werden Sie entdeckt und lassen Sie sich von unserem Kreativteam mit professionellem Design, Fotografie und Videoproduktion begleiten — von der ersten Idee bis zum ausverkauften Saal.'
                  : 'Create your event, get discovered, and let our creative team support you with professional design, photography and video production — from first idea to sold-out show.'}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/organizer/create"
                  className="inline-flex items-center justify-center gap-2 bg-entreo-red hover:bg-entreo-red-hover text-white text-sm font-semibold px-6 py-3.5 rounded-full shadow-sm transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-entreo-red"
                >
                  <span>{lang === 'DE' ? 'Event erstellen' : 'Create an event'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-semibold px-5 py-3.5 rounded-full border border-neutral-300/80 shadow-2xs transition-colors"
                >
                  <span>{lang === 'DE' ? 'Produktion anfragen' : 'Talk to our team'}</span>
                </button>
              </div>

              {/* Trust Subtext below button */}
              <p className="text-xs text-neutral-500 pt-1 leading-normal max-w-md">
                {lang === 'DE'
                  ? 'Reichen Sie Ihre Eventdetails ein — unser Team prüft Ihre Angaben und begleitet Sie durch alle Schritte.'
                  : 'Submit your event details and our team will review and guide you through the next steps.'}
              </p>
            </div>

            {/* Right Column: 3-Card Creative Production Collage matching reference (6 cols) */}
            <div className="lg:col-span-6 relative flex justify-center items-center py-4 select-none">
              <div className="relative w-full max-w-[440px] h-[340px] sm:h-[380px]">
                
                {/* Card 1 (Left): Tilted Festival Poster Mockup */}
                <div className="absolute top-2 left-0 sm:left-4 z-20 w-40 sm:w-48 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-4 border-white transform -rotate-8 transition-transform hover:-rotate-4 duration-300 bg-neutral-900">
                  <img
                    src="/images/organizer/poster-mockup.jpg"
                    alt="City Lights Festival Poster Artwork"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Script annotation for Poster Design */}
                <div className="absolute top-12 left-[-10px] sm:left-[-18px] z-30 transform -rotate-12 pointer-events-none">
                  <p className="font-script text-sm sm:text-base font-bold text-neutral-800 leading-tight">
                    Poster<br />Design ⤹
                  </p>
                </div>

                {/* Card 2 (Center/Top-Right): Videographer on stage */}
                <div className="absolute top-4 right-8 sm:right-12 z-10 w-44 sm:w-52 aspect-[4/3] rounded-xl overflow-hidden shadow-xl border-4 border-white transform rotate-3 transition-transform hover:rotate-1 duration-300 bg-neutral-900">
                  <img
                    src="/images/organizer/videographer.jpg"
                    alt="Professional concert videographer filming on stage"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Script annotation for Event Photography */}
                <div className="absolute top-1 right-0 sm:right-2 z-30 transform rotate-6 pointer-events-none">
                  <p className="font-script text-xs sm:text-sm font-bold text-neutral-800 leading-tight text-right">
                    Event<br />Photography
                  </p>
                </div>

                {/* Card 3 (Bottom-Right): Crowd photo */}
                <div className="absolute bottom-2 right-4 sm:right-8 z-25 w-44 sm:w-52 aspect-[16/10] rounded-xl overflow-hidden shadow-2xl border-4 border-white transform rotate-6 transition-transform hover:rotate-3 duration-300 bg-neutral-900">
                  <img
                    src="/images/categories/concerts.jpg"
                    alt="Ecstatic concert crowd and stage lights"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Script annotation for Video Production */}
                <div className="absolute bottom-6 right-24 sm:right-28 z-30 transform -rotate-6 pointer-events-none">
                  <p className="font-script text-xs sm:text-sm font-bold text-neutral-800 leading-tight">
                    Video<br />Production ⤹
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Production Enquiry Modal */}
      <ProductionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

