import React from 'react';
import { X } from 'lucide-react';
import { EmptyStateIllustration } from './Assets';

/**
 * Reusable KaushalDrishti Design System Components
 * Palette:
 * - Warm ivory: #F8F5EF
 * - Warm white: #FFFEFB
 * - Cream: #F5F0E7
 * - Forest green: #173F35
 * - Deep green: #17604D
 * - Terracotta: #D96843
 * - Soft coral: #F5D7CC
 * - Sage: #DCE9D9
 * - Saffron: #F2B968
 * - Muted slate: #64716D
 * - Warm border: #E9E0D3
 */

export const SurfaceCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => (
  <div
    onClick={onClick}
    className={`bg-[#FFFEFB] border border-[#E9E0D3] rounded-xl p-4 transition-colors ${
      onClick ? 'cursor-pointer hover:border-[#D5C7B4]' : ''
    } ${className}`}
  >
    {children}
  </div>
);

export const PrimaryButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}> = ({ children, onClick, className = '', disabled = false, type = 'button' }) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#1B2B44] hover:bg-[#173F35] active:scale-[0.99] transition-all whitespace-nowrap shrink-0 disabled:opacity-50 cursor-pointer ${className}`}
  >
    {children}
  </button>
);

export const SecondaryButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  tone?: 'warm' | 'outline';
}> = ({ children, onClick, className = '', tone = 'warm' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
      tone === 'warm'
        ? 'bg-[#F7E8D8] text-[#B8532E] hover:bg-[#F2DAC2]'
        : 'bg-[#FFFEFB] border border-[#E9E0D3] text-[#173F35] hover:bg-[#F5F0E7]'
    } ${className}`}
  >
    {children}
  </button>
);

export const SelectControl: React.FC<{
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  className?: string;
  compact?: boolean;
  disabled?: boolean;
}> = ({ label, value, options, onChange, className = '', compact = false, disabled = false }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-[11px] font-medium text-[#64716D]">{label}</label>}
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full appearance-none bg-[#FFFEFB] border border-[#E9E0D3] hover:border-[#D4C6B4] focus:border-[#17604D] focus:outline-none rounded-lg text-[#173F35] font-medium pr-8 transition-colors ${
          disabled ? 'opacity-75 bg-[#F5F0E7] cursor-not-allowed' : 'cursor-pointer'
        } ${compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        className="w-3.5 h-3.5 text-[#64716D] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
);

export const FilterTabButton: React.FC<{
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}> = ({ active, label, count, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
      active
        ? 'bg-[#1B2B44] text-white'
        : 'bg-[#F5F0E7] text-[#173F35] hover:bg-[#EAE1D3] border border-[#E9E0D3]'
    }`}
  >
    {label}
    {typeof count === 'number' ? ` (${count})` : ''}
  </button>
);

export const EmptyStateCard: React.FC<{
  variant: 'search' | 'data' | 'analysis' | 'map' | 'training' | 'reports' | 'construction';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ variant, title, description, actionLabel, onAction }) => (
  <div className="bg-[#FFFEFB] border border-[#E9E0D3] rounded-xl p-8 flex flex-col items-center justify-center text-center">
    <EmptyStateIllustration variant={variant} className="w-44 h-32 mb-3" />
    <h3 className="font-serif-heading text-base font-semibold text-[#173F35]">{title}</h3>
    <p className="text-xs text-[#64716D] max-w-md mt-1 mb-4">{description}</p>
    {actionLabel && onAction && (
      <SecondaryButton onClick={onAction} tone="outline">
        {actionLabel}
      </SecondaryButton>
    )}
  </div>
);

export const DetailModal: React.FC<{
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, title, subtitle, onClose, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-[#173F35]/35 backdrop-blur-[1px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFEFB] border border-[#E9E0D3] rounded-xl max-w-xl w-full p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#E9E0D3]">
          <div>
            <h3 className="font-serif-heading text-lg font-bold text-[#173F35]">{title}</h3>
            {subtitle && <p className="text-xs text-[#64716D] mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64716D] hover:text-[#173F35] hover:bg-[#F5F0E7] cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};
