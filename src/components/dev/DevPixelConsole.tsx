import React from 'react';
import { X, Activity, ShieldCheck, ShieldAlert, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const DevPixelConsole: React.FC = () => {
  const { isDevDrawerOpen, toggleDevDrawer, pixelLogs, clearPixelLogs, consent } = useStore();

  if (!isDevDrawerOpen) return null;

  return (
    <div className="fixed bottom-14 right-4 sm:right-6 w-[94vw] sm:w-[480px] max-h-[500px] z-50 bg-neutral-900 text-neutral-100 rounded-2xl shadow-2xl border border-neutral-700 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Header */}
      <div className="px-4 py-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-entreo-red" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-200">
            ENTRÉO Event Bus & Meta Pixel Mock
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearPixelLogs}
            title="Clear logs"
            className="p-1 text-neutral-400 hover:text-white rounded"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleDevDrawer}
            className="p-1 text-neutral-400 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Consent Status Strip */}
      <div className="px-4 py-2 bg-neutral-800/80 text-[11px] font-mono border-b border-neutral-700 flex items-center justify-between">
        <span>Marketing Consent:</span>
        {consent.marketing ? (
          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> GRANTED (Active)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
            <ShieldAlert className="w-3.5 h-3.5" /> DENIED (Suppressed)
          </span>
        )}
      </div>

      {/* Log list */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3 font-mono text-xs">
        {pixelLogs.length === 0 ? (
          <div className="py-8 text-center text-neutral-500 text-xs">
            No mock pixel events dispatched yet.<br />
            Complete a ticket checkout to test trigger.
          </div>
        ) : (
          pixelLogs.map((log) => (
            <div
              key={log.id}
              className={`p-2.5 rounded-lg border text-[11px] ${
                log.consented
                  ? 'bg-neutral-950/80 border-emerald-900/60 text-emerald-200'
                  : 'bg-neutral-950/80 border-amber-900/60 text-amber-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white">
                  fbq('track', '{log.eventName}')
                </span>
                <span className="text-[10px] text-neutral-400">{log.timestamp}</span>
              </div>
              <p className="text-[10px] text-neutral-400 mb-1">
                Status: {log.consented ? '✅ Dispatched to Meta Pixel' : '⚠️ Suppressed: Marketing consent was denied'}
              </p>
              <pre className="text-[10px] bg-black/50 p-1.5 rounded overflow-x-auto text-neutral-300">
                {JSON.stringify(log.payload, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-neutral-950 border-t border-neutral-800 text-[10px] text-neutral-500 font-mono">
        Strict GDPR Compliance: No real external network requests are made.
      </div>
    </div>
  );
};

