import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  withArrow?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  withArrow = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-entreo-red focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 rounded-pill gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-pill gap-2',
    lg: 'text-base px-7 py-3 rounded-pill gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-entreo-red hover:bg-entreo-red-hover text-white shadow-sm hover:shadow active:scale-[0.98]',
    secondary: 'bg-entreo-ink hover:bg-black text-white active:scale-[0.98]',
    outline: 'border border-entreo-border bg-white text-entreo-ink hover:border-entreo-ink hover:bg-entreo-cream active:scale-[0.98]',
    ghost: 'text-entreo-ink hover:bg-entreo-chip active:scale-[0.98]',
    icon: 'p-2.5 rounded-full bg-entreo-red text-white hover:bg-entreo-red-hover active:scale-[0.95]',
  };

  if (variant === 'icon') {
    return (
      <button
        className={`${baseClasses} ${variantClasses.icon} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
      </button>
    );
  }

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{children}</span>
      {withArrow && !isLoading && (
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      )}
    </button>
  );
};

