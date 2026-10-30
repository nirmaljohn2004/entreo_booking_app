import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, Send } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { translations } from '../../i18n/translations';

interface ProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
  eventTitle?: string;
}

export const ProductionModal: React.FC<ProductionModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
}) => {
  const { lang, submitEnquiry, organizers, currentOrganizerId } = useStore();
  const t = translations[lang];

  const currentOrg = organizers.find((o) => o.id === currentOrganizerId) || organizers[0];

  const [services, setServices] = useState<string[]>(['posters', 'photography']);
  const [budget, setBudget] = useState('2.500 € – 5.000 €');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleToggleService = (srv: string) => {
    setServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitEnquiry({
      organizerId: currentOrg?.id || 'guest',
      organizerName: currentOrg?.brandName || 'Veranstalter',
      organizerEmail: currentOrg?.email || 'kontakt@veranstalter.de',
      eventId,
      eventTitle,
      services: services as ('posters' | 'social_assets' | 'photography' | 'recap_video' | 'promotion')[],
      estimatedBudget: budget,
      notes,
      status: 'new',
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2200);
  };

  const serviceOptions = [
    { id: 'posters', label: lang === 'DE' ? 'Plakatdesign (DIN A1 / A0)' : 'Poster Design (A1 / A0)' },
    { id: 'social_assets', label: lang === 'DE' ? 'Social Media Motion Kit' : 'Social Media Motion Kit' },
    { id: 'photography', label: lang === 'DE' ? 'Konzert- & Eventfotografie' : 'Live Concert Photography' },
    { id: 'recap_video', label: lang === 'DE' ? 'Aftermovie / Recap Video (4K)' : '4K Recap & Aftermovie Video' },
    { id: 'promotion', label: lang === 'DE' ? 'Gezielte Kampagnenpromotion' : 'Targeted Audience Promotion' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-entreo-cream rounded-2xl shadow-2xl border border-entreo-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-entreo-border bg-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-entreo-red" />
            <h3 className="font-serif text-xl font-bold text-entreo-ink">
              {lang === 'DE' ? 'ENTRÉO Creative Productions' : 'ENTRÉO Creative Productions'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-entreo-muted hover:text-entreo-ink hover:bg-entreo-chip transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-serif text-2xl font-bold text-entreo-ink">
              {lang === 'DE' ? 'Anfrage erhalten!' : 'Enquiry Received!'}
            </h4>
            <p className="text-sm text-entreo-muted max-w-sm mx-auto">
              {lang === 'DE'
                ? 'Unser Creative Director meldet sich innerhalb von 24 Stunden mit einem maßgeschneiderten Konzept bei Ihnen.'
                : 'Our creative team will review your specifications and get in touch within 24 hours.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-xs text-entreo-muted leading-relaxed">
              {lang === 'DE'
                ? 'Wir unterstützen Veranstalter mit High-End-Produktion: Plakatierung, Live-Fotografen vor Ort und Aftermovies. Unabhängig von Ihrer Ticketprüfung.'
                : 'We support promoters with high-end assets: poster runs, on-site photography, and cinema-grade recap videos. Operates independently from your ticket approval.'}
            </p>

            {/* Service Checkboxes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-entreo-ink mb-2">
                {lang === 'DE' ? 'Gewünschte Leistungen' : 'Desired Services'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {serviceOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium border cursor-pointer transition-all ${
                      services.includes(opt.id)
                        ? 'bg-entreo-red-light border-entreo-red text-entreo-ink'
                        : 'bg-white border-entreo-border text-entreo-muted hover:border-entreo-ink/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={services.includes(opt.id)}
                      onChange={() => handleToggleService(opt.id)}
                      className="accent-entreo-red rounded"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-entreo-ink mb-1.5">
                {lang === 'DE' ? 'Budgetrahmen' : 'Estimated Budget'}
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-entreo-border bg-white text-entreo-ink focus:outline-none focus:ring-1 focus:ring-entreo-red"
              >
                <option value="1.000 € – 2.500 €">1.000 € – 2.500 €</option>
                <option value="2.500 € – 5.000 €">2.500 € – 5.000 €</option>
                <option value="5.000 € – 10.000 €">5.000 € – 10.000 €</option>
                <option value="10.000 € +">10.000 € + (Full Festival Campaign)</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-entreo-ink mb-1.5">
                {lang === 'DE' ? 'Projektdetails / Besondere Wünsche' : 'Project Details & Goals'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder={
                  lang === 'DE'
                    ? 'z.B. Benötigen 2 Fotografen vor Ort und Social Media Teaser vor Tourstart...'
                    : 'e.g. Need 2 on-site photographers and a 30s social teaser...'
                }
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-entreo-border bg-white text-entreo-ink focus:outline-none focus:ring-1 focus:ring-entreo-red resize-none"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-entreo-muted hover:text-entreo-ink transition-colors"
              >
                {lang === 'DE' ? 'Abbrechen' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-entreo-red hover:bg-entreo-red-hover text-white text-xs font-semibold px-5 py-2.5 rounded-pill shadow-sm transition-transform active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'DE' ? 'Anfrage absenden' : 'Submit Enquiry'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

