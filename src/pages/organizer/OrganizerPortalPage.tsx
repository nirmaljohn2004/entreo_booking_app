import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Ticket,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { ProductionModal } from '../../components/organizer/ProductionModal';

export const OrganizerPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, organizers, currentOrganizerId, events } = useStore();
  const [isProductionOpen, setIsProductionOpen] = useState(false);

  const currentOrg = organizers.find((o) => o.id === currentOrganizerId) || organizers[0];
  const orgEvents = events.filter((e) => e.organizerId === currentOrg?.id || e.organizerName === currentOrg?.brandName);

  const publishedCount = orgEvents.filter((e) => e.status === 'published').length;
  const submittedCount = orgEvents.filter((e) => e.status === 'submitted').length;
  const draftCount = orgEvents.filter((e) => e.status === 'draft').length;

  return (
    <div className="min-h-screen bg-[#FAF9F7] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-entreo-border/70 shadow-soft-card">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-entreo-red">
                {lang === 'DE' ? 'Veranstalter-Cockpit' : 'Organizer Portal'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                currentOrg?.verificationStatus === 'verified'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {currentOrg?.verificationStatus.replace('_', ' ')}
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-entreo-ink">
              {currentOrg?.brandName || 'Veranstalter-Portal'}
            </h1>
            <p className="text-xs text-entreo-muted">
              {currentOrg?.legalEntity} • {lang === 'DE' ? 'Steuernummer:' : 'Tax ID:'} {currentOrg?.taxId || (lang === 'DE' ? 'Nicht hinterlegt' : 'Not registered')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsProductionOpen(true)}
              className="text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-entreo-red" />
              <span>{lang === 'DE' ? 'Produktion anfragen' : 'Creative Suite'}</span>
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/organizer/create')}
              className="text-xs font-semibold bg-entreo-red"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>{lang === 'DE' ? 'Neues Event erstellen' : 'Create an Event'}</span>
            </Button>
          </div>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-entreo-border/70 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-entreo-muted uppercase tracking-wider">
                {lang === 'DE' ? 'Live & Buchbar' : 'Published Events'}
              </p>
              <p className="font-serif text-2xl font-bold text-entreo-ink">{publishedCount}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-entreo-border/70 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-entreo-muted uppercase tracking-wider">
                {lang === 'DE' ? 'In Prüfung (Curation)' : 'Submitted for Review'}
              </p>
              <p className="font-serif text-2xl font-bold text-entreo-ink">{submittedCount}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-entreo-border/70 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-entreo-muted uppercase tracking-wider">
                {lang === 'DE' ? 'Gespeicherte Entwürfe' : 'Saved Drafts'}
              </p>
              <p className="font-serif text-2xl font-bold text-entreo-ink">{draftCount}</p>
            </div>
          </div>
        </div>

        {/* Events Table / List */}
        <div className="bg-white rounded-2xl border border-entreo-border/70 shadow-soft-card overflow-hidden">
          <div className="p-6 border-b border-entreo-border/60 flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-entreo-ink">
              {lang === 'DE' ? 'Ihre Veranstaltungen' : 'Your Events'}
            </h2>
            <Link
              to="/organizer/create"
              className="text-xs font-semibold text-entreo-red hover:underline inline-flex items-center gap-1"
            >
              <span>{lang === 'DE' ? 'Neues Event anlegen' : 'Create new event'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orgEvents.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <Calendar className="w-12 h-12 text-entreo-muted mx-auto opacity-50" />
              <p className="text-sm text-entreo-muted">
                {lang === 'DE' ? 'Noch keine Events eingereicht.' : 'No events created yet.'}
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/organizer/create')}
                className="text-xs"
              >
                {lang === 'DE' ? 'Erstes Event erstellen' : 'Create Your First Event'}
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-entreo-border/40">
              {orgEvents.map((evt) => (
                <div key={evt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-entreo-cream/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-16 h-12 object-cover rounded-lg bg-entreo-chip shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-entreo-ink">{evt.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          evt.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                          evt.status === 'submitted' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                          evt.status === 'draft' ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-800'
                        }`}>
                          {evt.status === 'submitted' ? (lang === 'DE' ? 'In Prüfung' : 'Submitted') : evt.status}
                        </span>
                      </div>
                      <p className="text-xs text-entreo-muted mt-0.5">
                        {evt.city} • {evt.venue.name} • {new Date(evt.startDate).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {evt.status === 'published' ? (
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/organizer/events/${evt.id}`}
                          className="text-xs px-3.5 py-1.5 rounded-pill bg-entreo-red text-white hover:bg-entreo-red-hover inline-flex items-center gap-1.5 font-bold shadow-xs transition-all"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{lang === 'DE' ? 'Tickets & Verkäufe tracken' : 'Track Sales & Tickets'}</span>
                        </Link>
                        <Link
                          to={`/events/${evt.id}`}
                          target="_blank"
                          className="text-xs px-3 py-1.5 rounded-pill border border-entreo-border hover:bg-entreo-cream inline-flex items-center gap-1 font-medium transition-colors"
                        >
                          <span>{lang === 'DE' ? 'Live ansehen' : 'View Live'}</span>
                          <ExternalLink className="w-3 h-3 text-entreo-muted" />
                        </Link>
                      </div>
                    ) : (
                      <span className="text-xs text-entreo-muted italic">
                        {lang === 'DE' ? 'Wartet auf Kuratoren-Freigabe' : 'Awaiting curator approval'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductionModal
        isOpen={isProductionOpen}
        onClose={() => setIsProductionOpen(false)}
      />
    </div>
  );
};

