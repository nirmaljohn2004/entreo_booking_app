import React from 'react';
import { RotateCcw, Activity, Shield } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AdminRole } from '../../types';

export const DevToolbar: React.FC = () => {
  const { 
    adminRole, 
    setAdminRole, 
    resetAllData, 
    toggleDevDrawer, 
    pixelLogs 
  } = useStore();

  const roles: AdminRole[] = ['Reviewer', 'Support', 'Finance'];

  const cycleRole = () => {
    const nextIdx = (roles.indexOf(adminRole) + 1) % roles.length;
    setAdminRole(roles[nextIdx]);
  };

  const handleReset = () => {
    if (window.confirm('Reset all ENTRÉO demo data to initial seed state?')) {
      resetAllData();
    }
  };

  return (
    <div
      id="dev-toolbar"
      className="fixed bottom-3 right-3 sm:right-6 z-40 flex items-center gap-1.5 sm:gap-2 bg-neutral-900/90 backdrop-blur-md text-white px-2.5 sm:px-3.5 py-1.5 rounded-full shadow-lg border border-neutral-700/80 text-xs select-none"
    >
      {/* Role Pill */}
      <button
        onClick={cycleRole}
        title="Click to cycle simulated admin role"
        className="flex items-center gap-1 text-[11px] font-medium bg-neutral-800 hover:bg-neutral-700 px-2 py-0.5 rounded-full transition-colors text-neutral-300"
      >
        <Shield className="w-3 h-3 text-entreo-red" />
        <span>Role: <strong className="text-white">{adminRole}</strong></span>
      </button>

      {/* Dev Console Trigger */}
      <button
        onClick={toggleDevDrawer}
        title="Open Meta Pixel Event Bus Console"
        className="flex items-center gap-1 text-[11px] font-medium bg-neutral-800 hover:bg-neutral-700 px-2 py-0.5 rounded-full transition-colors text-neutral-300"
      >
        <Activity className="w-3 h-3 text-emerald-400" />
        <span>Pixel ({pixelLogs.length})</span>
      </button>

      {/* 1-Click Reset Button */}
      <button
        onClick={handleReset}
        title="Reset all demo data in localStorage"
        className="flex items-center gap-1 text-[11px] font-medium text-amber-300 hover:text-amber-200 hover:bg-neutral-800 px-2 py-0.5 rounded-full transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        <span className="hidden sm:inline">Reset Demo</span>
      </button>
    </div>
  );
};
