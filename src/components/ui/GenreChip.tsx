import React from 'react';

interface GenreChipProps {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export const GenreChip: React.FC<GenreChipProps> = ({
  label,
  onClick,
  active = false,
}) => {
  return (
    <span
      onClick={onClick}
      className={`inline-block text-[11px] font-medium px-2.5 py-1 rounded-pill transition-colors ${
        active
          ? 'bg-entreo-red text-white'
          : 'bg-entreo-chip text-entreo-muted hover:bg-entreo-chip-hover'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {label}
    </span>
  );
};

