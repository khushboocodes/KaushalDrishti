import React, { useState } from 'react';
import { X, ShieldCheck, Lock, UserCheck, KeyRound, Building } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './DesignSystemUI';
import { MandalaPattern, LogoSquare } from './Assets';

export type UserRoleType = 'ADMIN' | 'DSO' | 'NCVET';

export interface UserSession {
  name: string;
  role: string;
  roleType?: UserRoleType;
  designation: string;
  department: string;
  badge: string;
  jurisdiction?: string;
  clearanceLevel?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [role, setRole] = useState<'DSO' | 'SSDM' | 'NCVET'>('SSDM');
  const [email, setEmail] = useState<string>('rajesh.varma@gov.in');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [pin, setPin] = useState<string>('4892');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      let session: UserSession;
      if (role === 'DSO') {
        session = {
          name: 'Smt. Anjali Deshmukh',
          role: 'District Skill Officer (DSO)',
          roleType: 'DSO',
          designation: 'District Skill Committee Lead',
          department: 'Pune District, Maharashtra',
          badge: 'DSO-MH-492',
          jurisdiction: 'Pune District, Maharashtra (Locked)',
          clearanceLevel: 'Operational District Command (DSC Lead)',
        };
      } else if (role === 'NCVET') {
        session = {
          name: 'Shri Vikramaditya Sen',
          role: 'NCVET Accreditation Admin',
          roleType: 'NCVET',
          designation: 'Director of Qualifications & Standards',
          department: 'NCVET National HQ, New Delhi',
          badge: 'NCVET-ADM-01',
          jurisdiction: 'National Qualifications & NSQF Standards',
          clearanceLevel: 'Regulatory Qualifications & Standards',
        };
      } else {
        session = {
          name: 'Dr. Rajesh Varma, IES',
          role: 'State SSDM Director',
          roleType: 'ADMIN',
          designation: 'Director, State Skill Development Mission',
          department: 'MSDE Government of India',
          badge: 'MSDE-SSDM-DIR',
          jurisdiction: 'All States & Apex Sanctions',
          clearanceLevel: 'Apex State Directorate (Full Clearance)',
        };
      }
      onLoginSuccess(session);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#FFFEFB] border border-[#E9E0D3] rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Subtle Watermark Decoration */}
        <MandalaPattern className="absolute -top-10 -right-10 w-44 h-44 opacity-25 pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64716D] hover:bg-[#F5F0E7] hover:text-[#173F35] cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center pb-4 border-b border-[#E9E0D3]">
          <div className="flex justify-center mb-2.5">
            <LogoSquare size={46} />
          </div>
          <h2 className="font-serif-heading text-lg font-bold text-[#173F35]">
            MSDE Government Officer Portal
          </h2>
          <p className="text-xs text-[#64716D] mt-0.5">
            Authorized credentials for Labour Market Intelligence &amp; Target Allocation
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#F5F0E7] rounded-lg my-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => setRole('DSO')}
            className={`py-1.5 px-2 rounded-md transition-colors cursor-pointer text-center ${
              role === 'DSO'
                ? 'bg-[#FFFEFB] text-[#173F35] font-bold shadow-2xs'
                : 'text-[#64716D] hover:text-[#173F35]'
            }`}
          >
            District DSO
          </button>
          <button
            type="button"
            onClick={() => setRole('SSDM')}
            className={`py-1.5 px-2 rounded-md transition-colors cursor-pointer text-center ${
              role === 'SSDM'
                ? 'bg-[#FFFEFB] text-[#173F35] font-bold shadow-2xs'
                : 'text-[#64716D] hover:text-[#173F35]'
            }`}
          >
            State SSDM
          </button>
          <button
            type="button"
            onClick={() => setRole('NCVET')}
            className={`py-1.5 px-2 rounded-md transition-colors cursor-pointer text-center ${
              role === 'NCVET'
                ? 'bg-[#FFFEFB] text-[#173F35] font-bold shadow-2xs'
                : 'text-[#64716D] hover:text-[#173F35]'
            }`}
          >
            NCVET HQ
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[#173F35] font-semibold mb-1">
              Official NIC / Govt Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer.name@gov.in"
                className="w-full bg-[#FAF7F2] border border-[#E9E0D3] rounded-lg px-3 py-2 text-[#173F35] focus:outline-none focus:border-[#17604D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#173F35] font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E9E0D3] rounded-lg px-3 py-2 text-[#173F35] focus:outline-none focus:border-[#17604D]"
              />
            </div>

            <div>
              <label className="block text-[#173F35] font-semibold mb-1">
                Security PIN
              </label>
              <input
                type="password"
                maxLength={6}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E9E0D3] rounded-lg px-3 py-2 text-[#173F35] font-mono focus:outline-none focus:border-[#17604D]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <SecondaryButton tone="warm" onClick={onClose} type="button">
              <span>Cancel</span>
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={loading} className="flex-1 justify-center">
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In as Officer'}</span>
            </PrimaryButton>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-[#F2ECE1] text-[11px] text-[#64716D] text-center flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-[#17604D]" />
          <span>256-bit TLS Encrypted · DPDP Act (2023) Compliant</span>
        </div>
      </div>
    </div>
  );
};
