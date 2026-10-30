import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Ticket, 
  QrCode, 
  Calendar, 
  Clock, 
  MapPin, 
  X, 
  AlertTriangle, 
  CheckCircle,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Order } from '../types';

export const MyTicketsPage: React.FC = () => {
  const { orders, refundOrder, lang } = useStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedOrderForQr, setSelectedOrderForQr] = useState<Order | null>(null);
  const [refundPromptOrder, setRefundPromptOrder] = useState<Order | null>(null);
  const [refundReason, setRefundReason] = useState('Terminkonflikt / Verhinderung');

  const now = new Date().getTime();

  const upcomingOrders = orders.filter((o) => new Date(o.eventDate).getTime() >= now - 86400000);
  const pastOrders = orders.filter((o) => new Date(o.eventDate).getTime() < now - 86400000);

  const displayedOrders = activeTab === 'upcoming' ? upcomingOrders : pastOrders;

  const handleConfirmRefund = () => {
    if (refundPromptOrder) {
      refundOrder(refundPromptOrder.id, refundReason);
      setRefundPromptOrder(null);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-entreo-border gap-4">
        <div>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-entreo-red mb-1">
            {lang === 'DE' ? 'KUNDENKONTO & WALLET' : 'CUSTOMER WALLET'}
          </p>
          <h1 className="font-serif text-3xl font-bold text-entreo-ink">
            {lang === 'DE' ? 'Meine Tickets' : 'My Tickets'}
          </h1>
          <p className="text-xs text-entreo-muted mt-0.5">
            {lang === 'DE'
              ? 'Verwalte deine gebuchten Events, rufe deinen mobilen QR-Pass ab oder storniere Tickets.'
              : 'Access your verified QR passes, timetable details and ticket cancellation options.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-white p-1 rounded-pill border border-entreo-border text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-1.5 rounded-pill transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-entreo-red text-white shadow-xs'
                : 'text-entreo-muted hover:text-entreo-ink'
            }`}
          >
            {lang === 'DE' ? 'Bevorstehend' : 'Upcoming'} ({upcomingOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('past')}
            className={`px-4 py-1.5 rounded-pill transition-colors ${
              activeTab === 'past'
                ? 'bg-entreo-red text-white shadow-xs'
                : 'text-entreo-muted hover:text-entreo-ink'
            }`}
          >
            {lang === 'DE' ? 'Vergangen' : 'Past'} ({pastOrders.length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-entreo-border p-8 space-y-3 max-w-md mx-auto">
          <Ticket className="w-12 h-12 text-entreo-muted mx-auto" />
          <h3 className="font-serif text-xl font-bold text-entreo-ink">
            {lang === 'DE' ? 'Keine Tickets in dieser Ansicht' : 'No tickets in this view'}
          </h3>
          <p className="text-xs text-entreo-muted">
            {lang === 'DE'
              ? 'Du hast aktuell keine Buchungen in dieser Kategorie.'
              : 'You have no confirmed orders matching this tab.'}
          </p>
          <div className="pt-2">
            <Link
              to="/events"
              className="inline-flex text-xs font-semibold px-4 py-2 rounded-pill bg-entreo-red text-white hover:bg-entreo-red-hover transition-colors"
            >
              {lang === 'DE' ? 'Events entdecken' : 'Explore events'}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const isRefunded = order.paymentStatus === 'refunded';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl p-5 shadow-soft-card border transition-all ${
                  isRefunded ? 'border-amber-300 bg-amber-50/20' : 'border-entreo-border'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-entreo-border/60">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-entreo-red">
                        {order.orderNumber}
                      </span>
                      {isRefunded ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          {lang === 'DE' ? 'Erstattet' : 'Refunded'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          {lang === 'DE' ? 'Gültig' : 'Confirmed'}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-entreo-ink">
                      {order.eventTitle}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="block text-sm font-extrabold text-entreo-ink">
                      € {order.total.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-entreo-muted">
                      {order.items.reduce((a, b) => a + b.quantity, 0)} {lang === 'DE' ? 'Ticket(s)' : 'ticket(s)'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-entreo-muted items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-entreo-red shrink-0" />
                    <span>
                      {new Intl.DateTimeFormat(lang === 'DE' ? 'de-DE' : 'en-US', {
                        timeZone: 'Europe/Berlin',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }).format(new Date(order.eventDate))}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-entreo-red shrink-0" />
                    <span>{lang === 'DE' ? `Einlass: ${order.doorsTime} Uhr` : `Doors: ${order.doorsTime}`}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-entreo-red shrink-0" />
                    <span className="truncate">{order.venueName}, {order.city}</span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-4 mt-3 border-t border-entreo-border/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-entreo-muted">
                    {order.items.map((i) => `${i.quantity}x ${i.tierName}`).join(' • ')}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isRefunded && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForQr(order)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill bg-entreo-ink hover:bg-black text-white text-xs font-semibold transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>QR Pass</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRefundPromptOrder(order)}
                          className="inline-flex items-center gap-1 text-xs text-entreo-muted hover:text-entreo-red font-semibold px-2 py-1 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{lang === 'DE' ? 'Stornieren' : 'Cancel / Refund'}</span>
                        </button>
                      </>
                    )}
                    {isRefunded && (
                      <span className="text-xs text-amber-800 italic">
                        {lang === 'DE' ? 'Erstattung wurde veranlasst.' : 'Refund completed.'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Pass Modal */}
      {selectedOrderForQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-entreo-border text-center space-y-4">
            <button
              onClick={() => setSelectedOrderForQr(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-entreo-muted hover:text-entreo-ink"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="font-serif text-lg font-bold text-entreo-red">ENTRÉO</span>
            <h3 className="font-serif text-xl font-bold text-entreo-ink">
              {selectedOrderForQr.eventTitle}
            </h3>

            {/* QR Visual */}
            <div className="w-48 h-48 bg-neutral-50 mx-auto p-4 rounded-2xl border border-entreo-border flex items-center justify-center">
              <QrCode className="w-full h-full text-entreo-ink" />
            </div>

            <div className="text-xs space-y-1">
              <p className="font-mono font-bold text-entreo-red text-sm">
                {selectedOrderForQr.orderNumber}
              </p>
              <p className="text-entreo-muted">
                {selectedOrderForQr.customer.firstName} {selectedOrderForQr.customer.lastName}
              </p>
              <p className="text-[10px] text-entreo-muted pt-2">
                {lang === 'DE' ? 'Displayhelligkeit maximieren für den Einlass-Scan.' : 'Maximize screen brightness for gate entry scanner.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Refund Confirmation Modal */}
      {refundPromptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-entreo-border space-y-4">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-serif text-lg font-bold text-entreo-ink">
                {lang === 'DE' ? 'Ticket-Rückerstattung bestätigen' : 'Confirm Ticket Refund'}
              </h3>
            </div>

            <p className="text-xs text-entreo-muted leading-relaxed">
              {lang === 'DE'
                ? `Möchtest du die Buchung ${refundPromptOrder.orderNumber} für „${refundPromptOrder.eventTitle}“ wirklich stornieren? Die freigegebenen Plätze werden sofort wieder dem Ticketkontingent gutgeschrieben.`
                : `Are you sure you want to refund order ${refundPromptOrder.orderNumber}? The tickets will immediately be restocked.`}
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-entreo-ink mb-1.5">
                {lang === 'DE' ? 'Stornierungsgrund' : 'Reason for cancellation'}
              </label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-entreo-border bg-white"
              >
                <option value="Terminkonflikt / Verhinderung">Terminkonflikt / Verhinderung</option>
                <option value="Krankheit">Krankheit</option>
                <option value="Versehentliche Doppelbuchung">Versehentliche Doppelbuchung</option>
                <option value="Sonstige Gründe">Sonstige Gründe</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRefundPromptOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-entreo-muted hover:text-entreo-ink"
              >
                {lang === 'DE' ? 'Abbrechen' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmRefund}
                className="px-4 py-2 bg-entreo-red hover:bg-entreo-red-hover text-white text-xs font-semibold rounded-pill"
              >
                {lang === 'DE' ? 'Jetzt erstatten (€ ' + refundPromptOrder.total.toFixed(2) + ')' : 'Process Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

