import React from 'react';

export const EventSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-soft-card border border-entreo-border/60 animate-pulse flex flex-col">
      <div className="aspect-[16/10] bg-neutral-200" />
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-neutral-200 rounded w-3/4" />
          <div className="h-3 bg-neutral-200 rounded w-1/2" />
          <div className="flex gap-2 pt-1">
            <div className="h-4 bg-neutral-200 rounded-full w-12" />
            <div className="h-4 bg-neutral-200 rounded-full w-14" />
          </div>
        </div>
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="h-4 bg-neutral-200 rounded w-16" />
          <div className="w-8 h-8 rounded-full bg-neutral-200" />
        </div>
      </div>
    </div>
  );
};

