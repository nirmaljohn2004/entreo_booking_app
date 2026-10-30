import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SectionHeaderProps {
  eyebrow: string;
  title?: React.ReactNode;
  actionText?: string;
  actionHref?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  actionText,
  actionHref,
  className = '',
}) => {
  return (
    <div className={`flex items-end justify-between mb-4 ${className}`}>
      <div>
        <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-1">
          {eyebrow}
        </p>
        {title && (
          <h2 className="font-serif text-2xl md:text-3xl text-entreo-ink font-bold tracking-tight leading-tight">
            {title}
          </h2>
        )}
      </div>
      {actionText && actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-neutral-600 hover:text-entreo-ink shrink-0 pb-0.5 group transition-colors"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
};

