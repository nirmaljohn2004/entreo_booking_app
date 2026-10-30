import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

interface PlaceholderPageProps {
  title: string;
  phase: string;
  description: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  phase,
  description,
}) => {
  const { lang } = useStore();

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-entreo-chip text-entreo-red text-xs font-bold uppercase tracking-wider">
        <Clock className="w-3.5 h-3.5" />
        <span>{phase}</span>
      </div>
      <h1 className="font-serif text-3xl font-bold text-entreo-ink">{title}</h1>
      <p className="text-sm text-entreo-muted leading-relaxed">{description}</p>
      <div className="pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-entreo-red hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'DE' ? 'Zurück zur Startseite' : 'Back to homepage'}</span>
        </Link>
      </div>
    </div>
  );
};

