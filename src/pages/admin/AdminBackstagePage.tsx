import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Building2, 
  Ticket, 
  Sparkles, 
  FileText, 
  RotateCcw, 
  Search, 
  Filter, 
  Eye, 
  ArrowRight, 
  ExternalLink, 
  UserCheck, 
  UserX, 
  CreditCard, 
  Receipt, 
  HelpCircle,
  TrendingUp,
  MapPin,
  Check,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { AdminRole, EventItem, EventStatus, Organizer, OrganizerVerificationStatus, Order, ProductionEnquiry } from '../../types';

export const AdminBackstagePage: React.FC = () => {
  const { 
    lang, 
    adminRole, 
    setAdminRole, 
    events, 
    updateEventStatus, 
    organizers, 
    updateOrganizerStatus, 
    orders, 
    refundOrder, 
    enquiries, 
    updateEnquiryStatus, 
    auditLogs 
  } = useStore();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'curation' | 'organizers' | 'orders' | 'enquiries' | 'audit'>('curation');

  // Selected event for detailed curation modal
  const [inspectingEvent, setInspectingEvent] = useState<EventItem | null>(null);
  const [curationNotes, setCurationNotes] = useState('');
  const [checklist, setChecklist] = useState({
    identity: true,
    venue: true,
    rights: true,
    youth: true,
    vat: true,
  });

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Orders Tab Filters & State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'paid' | 'refunded'>('all');

  // Format tier name for English/German UI
  const formatTierName = (rawName: string, language: 'DE' | 'EN') => {
    if (language === 'DE') {
      if (rawName.includes('General Admission') || rawName.includes('Stehplatz')) return 'Stehplatz Innenraum';
      if (rawName.includes('Reserved') || rawName.includes('Sitzplatz')) return 'Sitzplatz Unterrang';
      if (rawName.includes('VIP')) return 'VIP Soundcheck Paket';
      return rawName;
    } else {
      if (rawName.includes('Stehplatz') || rawName.includes('General Admission')) return 'General Admission (Floor)';
      if (rawName.includes('Sitzplatz') || rawName.includes('Reserved')) return 'Reserved Seating (Lower Tier)';
      if (rawName.includes('VIP')) return 'VIP Soundcheck Package';
      return rawName;
    }
  };

  const formatPaymentMethod = (method: string) => {
    switch (method.toLowerCase()) {
      case 'applepay':
        return 'Apple Pay';
      case 'card':
        return 'Credit Card';
      case 'sepa':
        return 'SEPA Direct Debit';
      case 'giropay':
        return 'Giropay';
      case 'klarna':
        return 'Klarna';
      default:
        return method.toUpperCase();
    }
  };

  // Statistics
  const pendingEvents = events.filter((e) => e.status === 'submitted');
  const publishedEvents = events.filter((e) => e.status === 'published');
  const pendingOrganizers = organizers.filter((o) => o.verificationStatus === 'under_review' || o.verificationStatus === 'info_needed');
  const totalRevenue = orders.reduce((sum, o) => (o.paymentStatus === 'paid' ? sum + o.total : sum), 0);

  // Filtered Events
  const filteredEvents = events.filter((evt) => {
    const matchesStatus = statusFilter === 'all' || evt.status === statusFilter;
    const matchesQuery = !searchQuery || 
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.organizerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  // Curation Action Handlers
  const handleApproveEvent = (evt: EventItem) => {
    updateEventStatus(evt.id, 'published', curationNotes || 'Approved by human curator: All compliance checks verified.');
    setInspectingEvent(null);
    setCurationNotes('');
  };

  const handleRequestChanges = (evt: EventItem) => {
    const note = curationNotes.trim() || 'Please update artwork resolution and clarify venue accessibility notes.';
    updateEventStatus(evt.id, 'changes_requested', note);
    setInspectingEvent(null);
    setCurationNotes('');
  };

  const handleRejectEvent = (evt: EventItem) => {
    const reason = curationNotes.trim() || 'Rejected due to licensing non-compliance or venue permit discrepancy.';
    updateEventStatus(evt.id, 'rejected', reason);
    setInspectingEvent(null);
    setCurationNotes('');
  };

  // Organizer KYC Action Handlers
  const handleSetOrganizerKyc = (orgId: string, status: OrganizerVerificationStatus) => {
    const note = status === 'verified' 
      ? 'Gewerbeanmeldung und Steuernummer verifiziert.' 
      : status === 'info_needed' 
      ? 'Nachforderung: Gültiger Handelsregisterauszug benötigt.' 
      : 'KYC status updated by admin.';
    updateOrganizerStatus(orgId, status, note);
  };

  // Refund Order Handler
  const handleRefund = (orderId: string, orderNumber: string) => {
    if (window.confirm(`Are you sure you want to process a full refund for ${orderNumber}?`)) {
      refundOrder(orderId, 'Customer support refund processed via Admin Backstage.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] pb-24">
      {/* Top Header & Role Switcher — Clean Red & White Architectural Executive Bar */}
      <div className="bg-white border-b border-neutral-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-entreo-red/10 text-entreo-red border border-entreo-red/20 mb-2">
                <Shield className="w-3.5 h-3.5 text-entreo-red" />
                <span>{lang === 'DE' ? 'ENTRÉO Backstage • Governance & Curation' : 'ENTRÉO Backstage • Governance & Curation'}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-entreo-ink">
                {lang === 'DE' ? 'Admin-Leitstand & Kuratoren-Zentrale' : 'Admin Operations Control'}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl leading-relaxed">
                {lang === 'DE' 
                  ? 'Manuelle Event-Kuratierung, KYC-Identitätsprüfung, Support-Erstattungen und Prüfpfad.'
                  : 'Human event curation queue, organizer KYC verification, support refunds, and regulatory audits.'}
              </p>
            </div>

            {/* Role Switcher Pill */}
            <div className="flex items-center gap-1.5 bg-neutral-100/90 p-1.5 rounded-2xl border border-neutral-200/80 self-start md:self-auto shadow-2xs">
              <span className="text-xs font-semibold text-neutral-500 px-2.5">
                {lang === 'DE' ? 'Aktive Rolle:' : 'Active Role:'}
              </span>
              {(['Reviewer', 'Support', 'Finance'] as AdminRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setAdminRole(r)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                    adminRole === r
                      ? 'bg-entreo-red text-white shadow-xs ring-2 ring-entreo-red/25'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/80'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-neutral-100">
            {/* KPI 1: Pending Review */}
            <div className="bg-neutral-50/80 hover:bg-white p-4 rounded-2xl border border-neutral-200/80 transition-all hover:shadow-xs group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                  Pending Review
                </span>
                <div className="w-7 h-7 rounded-lg bg-amber-100/80 text-amber-700 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="font-serif text-3xl font-bold text-neutral-900 mt-2">{pendingEvents.length}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">Awaiting human curation</p>
            </div>

            {/* KPI 2: Live Published */}
            <div className="bg-neutral-50/80 hover:bg-white p-4 rounded-2xl border border-neutral-200/80 transition-all hover:shadow-xs group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Live Published
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="font-serif text-3xl font-bold text-neutral-900 mt-2">{publishedEvents.length}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">Active on ENTRÉO</p>
            </div>

            {/* KPI 3: KYC In Review */}
            <div className="bg-neutral-50/80 hover:bg-white p-4 rounded-2xl border border-neutral-200/80 transition-all hover:shadow-xs group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                  KYC In Review
                </span>
                <div className="w-7 h-7 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="font-serif text-3xl font-bold text-neutral-900 mt-2">{pendingOrganizers.length}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">Identity & tax validation</p>
            </div>

            {/* KPI 4: Settled Gross Sales */}
            <div className="bg-neutral-50/80 hover:bg-white p-4 rounded-2xl border border-neutral-200/80 transition-all hover:shadow-xs group">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-entreo-red uppercase tracking-wider">
                  Settled Gross Sales
                </span>
                <div className="w-7 h-7 rounded-lg bg-entreo-red/10 text-entreo-red flex items-center justify-center">
                  <Receipt className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="font-serif text-3xl font-bold text-entreo-red mt-2">
                {totalRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">Processed orders to date</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-neutral-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5">
            {[
              { id: 'curation', label: lang === 'DE' ? 'Event-Kuratierung' : 'Event Curation Queue', badge: pendingEvents.length, icon: Calendar },
              { id: 'organizers', label: lang === 'DE' ? 'Veranstalter-KYC' : 'Organizer Verification', badge: pendingOrganizers.length, icon: Building2 },
              { id: 'orders', label: lang === 'DE' ? 'Bestellungen & Support' : 'Orders & Refunds', badge: orders.length, icon: Ticket },
              { id: 'enquiries', label: lang === 'DE' ? 'Produktions-Anfragen' : 'Creative Enquiries', badge: enquiries.length, icon: Sparkles },
              { id: 'audit', label: lang === 'DE' ? 'Audit-Prüfpfad' : 'Compliance Audit Log', badge: auditLogs.length, icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-entreo-red text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-neutral-200/80 text-neutral-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Tab View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">

        {/* TAB 1: EVENT CURATION QUEUE */}
        {activeTab === 'curation' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-entreo-border/70 shadow-soft-card flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-entreo-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'DE' ? 'Events, Veranstalter oder Städte filtern...' : 'Filter events, promoters, cities...'}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-entreo-cream/40 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs text-entreo-muted font-semibold whitespace-nowrap">Status:</span>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'submitted', label: 'Pending Review' },
                  { id: 'published', label: 'Published' },
                  { id: 'changes_requested', label: 'Changes Req.' },
                  { id: 'draft', label: 'Draft' },
                  { id: 'rejected', label: 'Rejected' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatusFilter(s.id)}
                    className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                      statusFilter === s.id
                        ? 'bg-entreo-red text-white shadow-xs'
                        : 'bg-entreo-cream text-entreo-ink hover:bg-entreo-border/50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Event List Table */}
            <div className="bg-white rounded-2xl border border-entreo-border/70 shadow-soft-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-entreo-ink">
                  <thead className="bg-[#FAF9F7] border-b border-entreo-border/70 uppercase font-bold text-entreo-muted text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Event & Title</th>
                      <th className="py-3.5 px-4">Category & City</th>
                      <th className="py-3.5 px-4">Schedule (Europe/Berlin)</th>
                      <th className="py-3.5 px-4">Organizer</th>
                      <th className="py-3.5 px-4">Pricing & Capacity</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-entreo-border/50">
                    {filteredEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-entreo-cream/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={evt.image}
                              alt={evt.title}
                              className="w-12 h-9 object-cover rounded-md bg-entreo-chip shrink-0"
                            />
                            <div>
                              <p className="font-bold text-entreo-ink">{evt.title}</p>
                              <p className="text-[11px] text-entreo-muted truncate max-w-xs">{evt.subtitle || evt.venue.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-entreo-red uppercase">{evt.category}</span>
                          <span className="text-entreo-muted block text-[11px]">{evt.city}</span>
                        </td>
                        <td className="py-4 px-4 font-mono text-[11px]">
                          <div>{new Date(evt.startDate).toLocaleDateString(lang === 'DE' ? 'de-DE' : 'en-GB')}</div>
                          <div className="text-entreo-muted">{evt.doorsTime} Doors • {evt.startTime} Show</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-entreo-ink">{evt.organizerName}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-mono font-bold text-entreo-ink">{lang === 'DE' ? 'Ab' : 'From'} {evt.minPrice} €</span>
                          <span className="text-entreo-muted block text-[11px]">
                            {evt.tickets.reduce((sum, t) => sum + t.capacity, 0)} {lang === 'DE' ? 'Plätze' : 'tickets'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            evt.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                            evt.status === 'submitted' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                            evt.status === 'changes_requested' ? 'bg-blue-100 text-blue-800' :
                            evt.status === 'draft' ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-800'
                          }`}>
                            {evt.status === 'submitted' ? 'Pending Review' : evt.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {evt.status === 'published' && (
                              <Link
                                to={`/organizer/events/${evt.id}`}
                                className="text-xs px-2.5 py-1 rounded-lg bg-entreo-cream text-entreo-ink hover:text-entreo-red border border-entreo-border inline-flex items-center gap-1 font-semibold"
                                title="Open Live Sales & Attendee Tracking"
                              >
                                <TrendingUp className="w-3.5 h-3.5 text-entreo-red" />
                                <span>Sales ({evt.tickets.reduce((s, t) => s + Math.max(0, t.capacity - t.available), 0)})</span>
                              </Link>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setInspectingEvent(evt);
                                setCurationNotes(evt.reviewNotes?.[evt.reviewNotes.length - 1] || '');
                              }}
                              className="text-xs"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              <span>Inspect</span>
                            </Button>
                            {evt.status === 'submitted' && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleApproveEvent(evt)}
                                className="text-xs bg-emerald-600 hover:bg-emerald-700 font-bold"
                              >
                                <span>Approve</span>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORGANIZER VERIFICATION (KYC) */}
        {activeTab === 'organizers' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-entreo-border/70 shadow-soft-card">
              <h2 className="font-serif text-xl font-bold text-entreo-ink mb-1">
                {lang === 'DE' ? 'Gewerbliche Veranstalter-Prüfung (KYC / GwG)' : 'Commercial Promoter Compliance (KYC)'}
              </h2>
              <p className="text-xs text-entreo-muted leading-relaxed max-w-2xl">
                {lang === 'DE'
                  ? 'Prüfung von Handelsregisterauszügen, Steuernummern und SEPA-Kontoinhabern gemäß deutschem Geldwäschegesetz vor Freigabe von Ticket-Auszahlungen.'
                  : 'Verification of commercial registration, German tax numbers, and SEPA payout accounts under German compliance.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {organizers.map((org) => (
                <div
                  key={org.id}
                  className="bg-white rounded-2xl p-6 border border-entreo-border/70 shadow-soft-card space-y-4 hover:border-entreo-red/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg font-bold text-entreo-ink">{org.brandName}</h3>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          org.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                          org.verificationStatus === 'under_review' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                          org.verificationStatus === 'info_needed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {org.verificationStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-entreo-muted mt-0.5">{org.legalEntity}</p>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-entreo-cream text-entreo-ink flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-entreo-red" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs border-y border-entreo-border/50 py-3">
                    <div>
                      <span className="text-entreo-muted text-[11px] block uppercase font-bold">{lang === 'DE' ? 'USt-IdNr / Steuer:' : 'Tax ID / VAT:'}</span>
                      <span className="font-mono font-semibold text-entreo-ink">{org.taxId || (lang === 'DE' ? 'Fehlt' : 'Missing')}</span>
                    </div>
                    <div>
                      <span className="text-entreo-muted text-[11px] block uppercase font-bold">SEPA Payout:</span>
                      <span className={`font-semibold ${org.payoutOnboarded ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {org.payoutOnboarded ? '✓ Connected' : '⚠ Pending'}
                      </span>
                    </div>
                    <div>
                      <span className="text-entreo-muted text-[11px] block uppercase font-bold">E-Mail:</span>
                      <span className="text-entreo-ink truncate block">{org.email}</span>
                    </div>
                    <div>
                      <span className="text-entreo-muted text-[11px] block uppercase font-bold">Phone:</span>
                      <span className="text-entreo-ink truncate block">{org.phone || '—'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-entreo-muted text-[11px] block uppercase font-bold">Address:</span>
                      <span className="text-entreo-ink">{org.address}</span>
                    </div>
                  </div>

                  {org.verificationNotes && (
                    <p className="text-[11px] bg-entreo-cream/60 p-2.5 rounded-lg text-entreo-muted italic">
                      "{org.verificationNotes}"
                    </p>
                  )}

                  {/* KYC Controls */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-entreo-muted">Set KYC Status:</span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant={org.verificationStatus === 'verified' ? 'primary' : 'outline'}
                        onClick={() => handleSetOrganizerKyc(org.id, 'verified')}
                        className={`text-xs ${org.verificationStatus === 'verified' ? 'bg-emerald-600' : ''}`}
                      >
                        <UserCheck className="w-3.5 h-3.5 mr-1" />
                        <span>Verify</span>
                      </Button>
                      <Button
                        size="sm"
                        variant={org.verificationStatus === 'info_needed' ? 'primary' : 'outline'}
                        onClick={() => handleSetOrganizerKyc(org.id, 'info_needed')}
                        className="text-xs"
                      >
                        <span>Need Info</span>
                      </Button>
                      <Button
                        size="sm"
                        variant={org.verificationStatus === 'action_required' ? 'primary' : 'outline'}
                        onClick={() => handleSetOrganizerKyc(org.id, 'action_required')}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        <UserX className="w-3.5 h-3.5 mr-1" />
                        <span>Flag</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS & CUSTOMER SUPPORT */}
        {activeTab === 'orders' && (() => {
          const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
          const refundedOrders = orders.filter((o) => o.paymentStatus === 'refunded');
          const grossSettled = paidOrders.reduce((sum, o) => sum + o.total, 0);
          const grossRefunded = refundedOrders.reduce((sum, o) => sum + o.total, 0);

          const displayedOrders = orders.filter((ord) => {
            const matchesStatus = orderStatusFilter === 'all' || ord.paymentStatus === orderStatusFilter;
            const matchesSearch = !orderSearch ||
              ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
              ord.customer.firstName.toLowerCase().includes(orderSearch.toLowerCase()) ||
              ord.customer.lastName.toLowerCase().includes(orderSearch.toLowerCase()) ||
              ord.customer.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
              ord.eventTitle.toLowerCase().includes(orderSearch.toLowerCase()) ||
              ord.city.toLowerCase().includes(orderSearch.toLowerCase());
            return matchesStatus && matchesSearch;
          });

          return (
            <div className="space-y-6">
              {/* 3 Metric Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-entreo-border/70 shadow-soft-card space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-entreo-muted flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-entreo-red" />
                    <span>{lang === 'DE' ? 'Gesamtbuchungen' : 'Total Bookings'}</span>
                  </span>
                  <p className="font-serif text-3xl font-bold text-entreo-ink">
                    {orders.length}
                  </p>
                  <p className="text-[11px] text-entreo-muted">
                    {paidOrders.length} {lang === 'DE' ? 'bezahlt & aktiv' : 'paid & confirmed'} · {refundedOrders.length} {lang === 'DE' ? 'storniert' : 'refunded'}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-entreo-border/70 shadow-soft-card space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-entreo-muted flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'DE' ? 'Abgerechneter Bruttoumsatz' : 'Settled Gross Volume'}</span>
                  </span>
                  <p className="font-serif text-3xl font-bold text-entreo-ink">
                    {grossSettled.toLocaleString(lang === 'DE' ? 'de-DE' : 'en-US', { minimumFractionDigits: 2 })} €
                  </p>
                  <p className="text-[11px] text-entreo-muted">
                    {lang === 'DE' ? 'Darin 19% deutsche USt ausgewiesen' : 'Includes 19% German VAT itemization'}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-entreo-border/70 shadow-soft-card space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-entreo-muted flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    <span>{lang === 'DE' ? 'Erstattungs-Quote' : 'Refund Volume'}</span>
                  </span>
                  <p className="font-serif text-3xl font-bold text-entreo-ink">
                    {grossRefunded.toLocaleString(lang === 'DE' ? 'de-DE' : 'en-US', { minimumFractionDigits: 2 })} €
                  </p>
                  <p className="text-[11px] text-entreo-muted">
                    {refundedOrders.length} {lang === 'DE' ? 'Stornierungen mit Kontingentfreigabe' : 'order cancellations processed'}
                  </p>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-entreo-border/70 shadow-soft-card flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 text-entreo-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder={lang === 'DE' ? 'Bestellnummer, Name, E-Mail oder Event suchen...' : 'Search order ID (ENT-...), buyer name, or email...'}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-entreo-cream/40 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red"
                  />
                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  {[
                    { id: 'all', label: lang === 'DE' ? 'Alle Bestellungen' : 'All Orders', count: orders.length },
                    { id: 'paid', label: lang === 'DE' ? 'Bezahlt' : 'Paid', count: paidOrders.length },
                    { id: 'refunded', label: lang === 'DE' ? 'Erstattet' : 'Refunded', count: refundedOrders.length },
                  ].map((filterTab) => (
                    <button
                      key={filterTab.id}
                      type="button"
                      onClick={() => setOrderStatusFilter(filterTab.id as typeof orderStatusFilter)}
                      className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        orderStatusFilter === filterTab.id
                          ? 'bg-entreo-ink text-white shadow-xs font-bold'
                          : 'bg-entreo-cream text-entreo-muted hover:text-entreo-ink border border-entreo-border'
                      }`}
                    >
                      <span>{filterTab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        orderStatusFilter === filterTab.id ? 'bg-white/20 text-white' : 'bg-entreo-chip text-entreo-muted'
                      }`}>
                        {filterTab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Data Table */}
              <div className="bg-white rounded-2xl border border-entreo-border/70 shadow-soft-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-entreo-ink table-fixed min-w-[980px]">
                    <thead className="bg-[#FAF9F7] border-b border-entreo-border/70 uppercase font-bold text-entreo-muted text-[11px] tracking-wider">
                      <tr>
                        <th className="w-[160px] py-3.5 px-4">{lang === 'DE' ? 'Bestell-ID & Datum' : 'Order ID & Date'}</th>
                        <th className="w-[240px] py-3.5 px-4">{lang === 'DE' ? 'Event & Spielstätte' : 'Event & Venue'}</th>
                        <th className="w-[210px] py-3.5 px-4">{lang === 'DE' ? 'Käuferdaten' : 'Buyer Details'}</th>
                        <th className="w-[200px] py-3.5 px-4">{lang === 'DE' ? 'Tickets / Kategorie' : 'Reserved Tickets'}</th>
                        <th className="w-[160px] py-3.5 px-4 text-right">{lang === 'DE' ? 'Gesamt (19% USt)' : 'Total (Gross / VAT)'}</th>
                        <th className="w-[160px] py-3.5 px-4 text-center">{lang === 'DE' ? 'Zahlung & Status' : 'Payment & Status'}</th>
                        <th className="w-[130px] py-3.5 px-4 text-right">{lang === 'DE' ? 'Kundenservice' : 'Support Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-entreo-border/50">
                      {displayedOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-entreo-muted">
                            <p className="text-sm font-semibold">{lang === 'DE' ? 'Keine Buchungen gefunden' : 'No matching bookings found'}</p>
                            <p className="text-xs mt-1 text-neutral-400">{lang === 'DE' ? 'Passen Sie Ihre Suche oder Filterkriterien an.' : 'Try adjusting your search terms or filter selection.'}</p>
                          </td>
                        </tr>
                      ) : (
                        displayedOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-entreo-cream/40 transition-colors">
                            {/* Order ID & Date */}
                            <td className="py-4 px-4 align-middle">
                              <span className="font-mono font-bold text-entreo-ink bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200/80 text-xs inline-block">
                                {ord.orderNumber}
                              </span>
                              <span className="text-entreo-muted flex items-center gap-1 text-[11px] mt-1 font-sans">
                                <Clock className="w-3 h-3 text-neutral-400 shrink-0" />
                                <span>
                                  {new Date(ord.createdAt).toLocaleDateString(lang === 'DE' ? 'de-DE' : 'en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
                              </span>
                            </td>

                            {/* Event & Venue */}
                            <td className="py-4 px-4 align-middle">
                              <p className="font-semibold text-entreo-ink line-clamp-1 text-xs" title={ord.eventTitle}>
                                {lang === 'EN' && ord.eventTitle.includes('Büchertour')
                                  ? 'LEA — Live in Concert 2026'
                                  : ord.eventTitle}
                              </p>
                              <p className="text-[11px] text-entreo-muted flex items-center gap-1 mt-0.5 line-clamp-1">
                                <MapPin className="w-3 h-3 text-entreo-red shrink-0" />
                                <span>{ord.venueName}, {ord.city}</span>
                              </p>
                            </td>

                            {/* Customer Details */}
                            <td className="py-4 px-4 align-middle">
                              <p className="font-semibold text-entreo-ink text-xs">
                                {ord.customer.firstName} {ord.customer.lastName}
                              </p>
                              <a
                                href={`mailto:${ord.customer.email}`}
                                className="text-[11px] text-entreo-muted hover:text-entreo-red transition-colors block truncate mt-0.5"
                                title={ord.customer.email}
                              >
                                {ord.customer.email}
                              </a>
                            </td>

                            {/* Reserved Tickets */}
                            <td className="py-4 px-4 align-middle">
                              <div className="space-y-1">
                                {ord.items.map((it, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 text-neutral-800 text-[11px] font-medium border border-neutral-200/80 shadow-2xs"
                                  >
                                    <Ticket className="w-3 h-3 text-entreo-red shrink-0" />
                                    <span>{it.quantity}x {formatTierName(it.tierName, lang)}</span>
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Total (Gross & VAT) */}
                            <td className="py-4 px-4 align-middle text-right">
                              <p className="font-mono text-sm font-bold text-entreo-ink tabular-nums">
                                {ord.total.toFixed(2)} €
                              </p>
                              <p className="text-[10px] text-entreo-muted font-sans mt-0.5">
                                {lang === 'DE' ? 'Inkl. 19% USt:' : 'VAT (19%):'} {ord.vatAmount.toFixed(2)} €
                              </p>
                            </td>

                            {/* Payment & Status */}
                            <td className="py-4 px-4 align-middle text-center">
                              <div className="inline-flex flex-col items-center gap-1">
                                <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                  ord.paymentStatus === 'paid'
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200/80'
                                }`}>
                                  {ord.paymentStatus === 'paid' ? (
                                    <>
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>{lang === 'DE' ? 'Bezahlt' : 'Paid'}</span>
                                    </>
                                  ) : (
                                    <>
                                      <RotateCcw className="w-3 h-3 text-amber-600" />
                                      <span>{lang === 'DE' ? 'Erstattet' : 'Refunded'}</span>
                                    </>
                                  )}
                                </span>
                                <span className="text-[11px] text-entreo-muted flex items-center gap-1 font-medium">
                                  <CreditCard className="w-3 h-3 text-neutral-400" />
                                  <span>{formatPaymentMethod(ord.paymentMethod)}</span>
                                </span>
                              </div>
                            </td>

                            {/* Support Action */}
                            <td className="py-4 px-4 align-middle text-right">
                              {ord.paymentStatus === 'paid' ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRefund(ord.id, ord.orderNumber)}
                                  className="text-xs text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600 border-red-200 shadow-2xs transition-all font-semibold"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                                  <span>{lang === 'DE' ? 'Erstatten' : 'Refund'}</span>
                                </Button>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400 italic font-medium">
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{lang === 'DE' ? 'Erstattet' : 'Refunded'}</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 4: CREATIVE PRODUCTION ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-entreo-border/70 shadow-soft-card">
              <h2 className="font-serif text-xl font-bold text-entreo-ink mb-1">
                {lang === 'DE' ? 'ENTRÉO Production Suite • Anfragen-Pipeline' : 'Production Suite Inquiries Pipeline'}
              </h2>
              <p className="text-xs text-entreo-muted">
                {lang === 'DE'
                  ? 'Eingegangene Anfragen für Plakatdesign (DIN A1/A0), 4K Konzertrecap-Filme, Eventfotografie und Motion-Kits.'
                  : 'Organizer leads requesting poster printing, video recaps, and concert photography.'}
              </p>
            </div>

            <div className="space-y-4">
              {enquiries.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-entreo-border text-entreo-muted text-sm">
                  No production enquiries received yet.
                </div>
              ) : (
                enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="bg-white p-6 rounded-2xl border border-entreo-border/70 shadow-soft-card flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-lg font-bold text-entreo-ink">{enq.organizerName}</span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          enq.status === 'new' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                          enq.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          enq.status === 'quoted' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {enq.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-entreo-muted">
                        Email: <span className="text-entreo-ink font-medium">{enq.organizerEmail}</span> • Target Event: <span className="text-entreo-ink font-medium">{enq.eventTitle || 'General Campaign'}</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {enq.services.map((srv) => (
                          <span key={srv} className="text-[10px] bg-entreo-cream text-entreo-red font-bold px-2.5 py-0.5 rounded-full border border-entreo-border">
                            {srv.replace('_', ' ').toUpperCase()}
                          </span>
                        ))}
                        <span className="text-[10px] bg-neutral-100 text-neutral-700 font-mono px-2 py-0.5 rounded-full">
                          Budget: {enq.estimatedBudget}
                        </span>
                      </div>
                      {enq.notes && (
                        <p className="text-xs text-entreo-ink bg-[#FAF9F7] p-3 rounded-xl border border-entreo-border/60">
                          "{enq.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                      <select
                        value={enq.status}
                        onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as ProductionEnquiry['status'])}
                        className="text-xs bg-white border border-entreo-border rounded-xl px-3 py-2 focus:ring-2 focus:ring-entreo-red"
                      >
                        <option value="new">New (Neu)</option>
                        <option value="contacted">Contacted (Kontaktiert)</option>
                        <option value="quoted">Quoted (Angebot vorliegend)</option>
                        <option value="closed">Closed (Abgeschlossen)</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: COMPLIANCE AUDIT LOG */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-entreo-border/70 shadow-soft-card flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-entreo-ink mb-1">
                  {lang === 'DE' ? 'Unveränderlicher Revisions- & Prüfpfad' : 'Immutable Regulatory Audit Trail'}
                </h2>
                <p className="text-xs text-entreo-muted">
                  {lang === 'DE'
                    ? 'Lückenlose Dokumentation aller Freigaben, Statusänderungen und KYC-Aktionen für Behörden und Finanzprüfung.'
                    : 'Full transparent record of curator approvals, status transitions, and role actions.'}
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-entreo-cream px-3 py-1.5 rounded-xl border border-entreo-border">
                {auditLogs.length} Logged Events
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-entreo-border/70 shadow-soft-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-entreo-ink">
                  <thead className="bg-[#FAF9F7] border-b border-entreo-border/70 uppercase font-bold text-entreo-muted text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Timestamp (UTC)</th>
                      <th className="py-3 px-4">Role & Actor</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Target Entity</th>
                      <th className="py-3 px-4">Compliance Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-entreo-border/50 font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-entreo-cream/30 transition-colors">
                        <td className="py-3 px-4 text-neutral-500">
                          {new Date(log.timestamp).toLocaleString('de-DE')}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-entreo-red font-bold font-sans">[{log.role}]</span> {log.actor}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-entreo-cream text-entreo-ink px-2 py-0.5 rounded font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-sans font-semibold text-entreo-ink">
                          {log.targetName} <span className="text-entreo-muted font-mono text-[10px]">({log.targetType})</span>
                        </td>
                        <td className="py-3 px-4 font-sans text-entreo-muted italic">
                          {log.notes || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DETAILED CURATION INSPECTOR MODAL */}
      {inspectingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-entreo-border">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-entreo-red bg-entreo-cream px-2.5 py-0.5 rounded-full">
                  Curator Inspection • {inspectingEvent.category.toUpperCase()}
                </span>
                <h3 className="font-serif text-2xl font-bold text-entreo-ink mt-2">
                  {inspectingEvent.title}
                </h3>
                <p className="text-xs text-entreo-muted">{inspectingEvent.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setInspectingEvent(null)}
                className="text-neutral-400 hover:text-neutral-900 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Media & Venue Overview */}
            <div className="flex gap-4 items-center p-3 rounded-xl bg-entreo-cream/60 border border-entreo-border">
              <img
                src={inspectingEvent.image}
                alt={inspectingEvent.title}
                className="w-24 h-16 object-cover rounded-lg bg-entreo-chip shrink-0"
              />
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-entreo-ink">{inspectingEvent.venue.name}, {inspectingEvent.city}</p>
                <p className="text-entreo-muted">{inspectingEvent.venue.address}, {inspectingEvent.venue.postalCode}</p>
                <p className="text-entreo-muted">
                  Schedule: {inspectingEvent.doorsTime} Doors / {inspectingEvent.startTime} Show (Europe/Berlin)
                </p>
                <p className="text-entreo-red font-semibold">Age: {inspectingEvent.ageRestriction}</p>
              </div>
            </div>

            {/* Interactive Curator Checklist */}
            <div className="space-y-2 p-4 rounded-xl bg-[#FAF9F7] border border-entreo-border">
              <p className="text-xs font-bold uppercase tracking-wider text-entreo-ink">
                Mandatory Curation Verification Checklist:
              </p>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.identity}
                    onChange={(e) => setChecklist({ ...checklist, identity: e.target.checked })}
                    className="w-4 h-4 rounded text-entreo-red focus:ring-entreo-red"
                  />
                  <span>Promoter legal entity identity and German tax ID match commercial registry.</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.venue}
                    onChange={(e) => setChecklist({ ...checklist, venue: e.target.checked })}
                    className="w-4 h-4 rounded text-entreo-red focus:ring-entreo-red"
                  />
                  <span>Venue capacity ({inspectingEvent.tickets.reduce((s, t) => s + t.capacity, 0)}) confirmed with local hall limits.</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.rights}
                    onChange={(e) => setChecklist({ ...checklist, rights: e.target.checked })}
                    className="w-4 h-4 rounded text-entreo-red focus:ring-entreo-red"
                  />
                  <span>UrhG § 72 visual rights and GEMA event notification acknowledged.</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.youth}
                    onChange={(e) => setChecklist({ ...checklist, youth: e.target.checked })}
                    className="w-4 h-4 rounded text-entreo-red focus:ring-entreo-red"
                  />
                  <span>German Youth Protection Act (JuSchG) age restriction properly assigned.</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.vat}
                    onChange={(e) => setChecklist({ ...checklist, vat: e.target.checked })}
                    className="w-4 h-4 rounded text-entreo-red focus:ring-entreo-red"
                  />
                  <span>Consumer prices transparently include 19% German VAT and booking fee.</span>
                </label>
              </div>
            </div>

            {/* Curation Review Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-entreo-ink mb-1.5">
                Curator Notes / Reason (Sent to Organizer):
              </label>
              <textarea
                rows={3}
                value={curationNotes}
                onChange={(e) => setCurationNotes(e.target.value)}
                placeholder="Enter feedback or approval notes..."
                className="w-full px-3 py-2 text-xs bg-entreo-cream/40 border border-entreo-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-entreo-red"
              />
            </div>

            {/* Decision Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-entreo-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRejectEvent(inspectingEvent)}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 w-full sm:w-auto"
              >
                <XCircle className="w-3.5 h-3.5 mr-1" />
                <span>Reject Event</span>
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRequestChanges(inspectingEvent)}
                  className="text-xs text-amber-700 hover:bg-amber-50 border-amber-300 w-full sm:w-auto"
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  <span>Request Changes</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApproveEvent(inspectingEvent)}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto font-bold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  <span>Approve & Publish</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

