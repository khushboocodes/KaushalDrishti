import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, UserCheck, KeyRound, Building } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './DesignSystemUI';
import { MandalaPattern, LogoSquare } from './Assets';
import { useLanguage } from '../context/LanguageContext';

export type UserRoleType = 'ADMIN' | 'DSO' | 'NCVET';
export type AuthModalRoleTab = 'DSO' | 'SSDM' | 'NCVET';

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

export const ROLE_PRESETS: Record<
  AuthModalRoleTab,
  {
    email: string;
    pin: string;
    session: UserSession;
  }
> = {
  DSO: {
    email: 'anjali.deshmukh@gov.in',
    pin: '1492',
    session: {
      name: 'Smt. Anjali Deshmukh',
      role: 'District Skill Officer (DSO)',
      roleType: 'DSO',
      designation: 'District Skill Committee Lead',
      department: 'Pune District, Maharashtra',
      badge: 'DSO-MH-492',
      jurisdiction: 'Pune District, Maharashtra (Locked)',
      clearanceLevel: 'Operational District Command (DSC Lead)',
    },
  },
  SSDM: {
    email: 'rajesh.varma@gov.in',
    pin: '4892',
    session: {
      name: 'Dr. Rajesh Varma, IES',
      role: 'State SSDM Director',
      roleType: 'ADMIN',
      designation: 'Director, State Skill Development Mission',
      department: 'MSDE Government of India',
      badge: 'MSDE-SSDM-DIR',
      jurisdiction: 'All States & Apex Sanctions',
      clearanceLevel: 'Apex State Directorate (Full Clearance)',
    },
  },
  NCVET: {
    email: 'vikramaditya.sen@gov.in',
    pin: '8801',
    session: {
      name: 'Shri Vikramaditya Sen',
      role: 'NCVET Accreditation Admin',
      roleType: 'NCVET',
      designation: 'Director of Qualifications & Standards',
      department: 'NCVET National HQ, New Delhi',
      badge: 'NCVET-ADM-01',
      jurisdiction: 'National Qualifications & NSQF Standards',
      clearanceLevel: 'Regulatory Qualifications & Standards',
    },
  },
};

export const getInitialRoleFromSession = (session?: UserSession | null): AuthModalRoleTab => {
  if (!session) return 'SSDM';
  if (session.roleType === 'DSO') return 'DSO';
  if (session.roleType === 'NCVET') return 'NCVET';
  if (session.roleType === 'ADMIN') return 'SSDM';

  const str = `${session.role || ''} ${session.department || ''} ${session.badge || ''} ${session.name || ''}`.toLowerCase();
  if (str.includes('dso') || str.includes('district') || str.includes('anjali')) return 'DSO';
  if (str.includes('ncvet') || str.includes('sen') || str.includes('standards')) return 'NCVET';
  return 'SSDM';
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
  currentSession?: UserSession | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentSession,
}) => {
  const { t } = useLanguage();
  const initialRole = getInitialRoleFromSession(currentSession);
  const [role, setRole] = useState<AuthModalRoleTab>(initialRole);
  const [email, setEmail] = useState<string>(ROLE_PRESETS[initialRole].email);
  const [password, setPassword] = useState<string>('••••••••••••');
  const [pin, setPin] = useState<string>(ROLE_PRESETS[initialRole].pin);
  const [loading, setLoading] = useState<boolean>(false);

  // Synchronize active role and credentials whenever the modal opens or currentSession changes
  useEffect(() => {
    if (isOpen) {
      const activeRole = getInitialRoleFromSession(currentSession);
      setRole(activeRole);
      setEmail(ROLE_PRESETS[activeRole].email);
      setPin(ROLE_PRESETS[activeRole].pin);
      setPassword('••••••••••••');
      setLoading(false);
    }
  }, [isOpen, currentSession]);

  const handleRoleSelect = (targetRole: AuthModalRoleTab) => {
    setRole(targetRole);
    setEmail(ROLE_PRESETS[targetRole].email);
    setPin(ROLE_PRESETS[targetRole].pin);
    setPassword('••••••••••••');
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const session = ROLE_PRESETS[role].session;
      try {
        sessionStorage.setItem('kd_user_session', JSON.stringify(session));
        localStorage.setItem('kd_user_session', JSON.stringify(session));
      } catch {
        // ignore
      }
      onLoginSuccess(session);
      onClose();
    }, 450);
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
            {t('MSDE Government Officer Portal')}
          </h2>
          <p className="text-xs text-[#64716D] mt-0.5">
            {t('Authorized credentials for Labour Market Intelligence & Target Allocation')}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#F5F0E7] rounded-lg my-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => handleRoleSelect('DSO')}
            className={`py-1.5 px-2 rounded-md transition-colors cursor-pointer text-center ${
              role === 'DSO'
                ? 'bg-[#FFFEFB] text-[#173F35] font-bold shadow-2xs'
                : 'text-[#64716D] hover:text-[#173F35]'
            }`}
          >
            {t('District DSO')}
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('SSDM')}
            className={`py-1.5 px-2 rounded-md transition-colors cursor-pointer text-center ${
              role === 'SSDM'
                ? 'bg-[#FFFEFB] text-[#173F35] font-bold shadow-2xs'
                : 'text-[#64716D] hover:text-[#173F35]'
            }`}
          >
            {t('State SSDM')}
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('NCVET')}
            className={`py-1.5 px-2 rounded-md transition-colors cursor-pointer text-center ${
              role === 'NCVET'
                ? 'bg-[#FFFEFB] text-[#173F35] font-bold shadow-2xs'
                : 'text-[#64716D] hover:text-[#173F35]'
            }`}
          >
            {t('NCVET HQ')}
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[#173F35] font-semibold mb-1">
              {t('Official NIC / Govt Email')}
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
                {t('Password')}
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
                {t('Security PIN')}
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
              <span>{t('Cancel')}</span>
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={loading} className="flex-1 justify-center">
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? t('Authenticating...') : t('Sign In as Officer')}</span>
            </PrimaryButton>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-[#F2ECE1] text-[11px] text-[#64716D] text-center flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-[#17604D]" />
          <span>{t('256-bit TLS Encrypted · DPDP Act (2023) Compliant')}</span>
        </div>
      </div>
    </div>
  );
};
