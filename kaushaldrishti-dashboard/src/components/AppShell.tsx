import React, { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  X,
  LayoutGrid,
  Maximize2,
  Palette,
} from 'lucide-react';
import {
  LogoHorizontal,
  SidebarBottomIllustration,
  AssetOutlineIcon,
} from './Assets';
import { NavRouteId } from '../types';
import { ALERTS_DATA } from '../data/mockData';
import { AuthModal, UserSession } from './AuthModal';
import { useLanguage } from '../context/LanguageContext';

const NAV_LABELS_HI: Record<string, string> = {
  'dashboard': 'डैशबोर्ड (कमान केंद्र)',
  'demand-supply': 'मांग एवं आपूर्ति',
  'forecasting': 'पूर्वानुमान इंजन',
  'sectors': 'क्षेत्र एवं व्यवसाय',
  'geographic': 'भौगोलिक विश्लेषण',
  'training': 'प्रशिक्षण क्षमता',
  'alerts': 'सचेतक एवं अंतर्दृष्टि',
  'recommendations': 'योजना सिफारिशें',
  'reports': 'रिपोर्ट एवं निर्यात',
  'data-explorer': 'डेटा अन्वेषक',
  'api-access': 'एपीआई एकीकरण',
  'settings': 'सिस्टम सेटिंग्स',
  'design-system': 'डिजाइन सिस्टम',
};

interface AppShellProps {
  activeRoute: NavRouteId;
  onSelectRoute: (route: NavRouteId) => void;
  canvasMode: 'single' | 'six-grid';
  onToggleCanvasMode: (mode: 'single' | 'six-grid') => void;
  globalSearch: string;
  onGlobalSearchChange: (q: string) => void;
  dateRange: string;
  onDateRangeChange: (d: string) => void;
  userSession?: UserSession | null;
  onUserSessionChange?: (session: UserSession | null) => void;
  onLogout?: () => void;
  children: React.ReactNode;
}

export const SIDEBAR_NAV_ITEMS: {
  id: NavRouteId;
  label: string;
  icon: string;
  frameBadge?: string;
}[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', frameBadge: '01' },
  { id: 'demand-supply', label: 'Demand & Supply', icon: 'demand' },
  { id: 'forecasting', label: 'Forecasting', icon: 'forecast', frameBadge: '04' },
  { id: 'sectors', label: 'Sectors & Trades', icon: 'sectors', frameBadge: '03' },
  { id: 'geographic', label: 'Geographic View', icon: 'map', frameBadge: '02' },
  { id: 'training', label: 'Training Capacity', icon: 'training' },
  { id: 'alerts', label: 'Alerts & Insights', icon: 'alerts', frameBadge: '05' },
  { id: 'recommendations', label: 'Recommendations', icon: 'recommendations', frameBadge: '06' },
  { id: 'reports', label: 'Reports', icon: 'reports' },
  { id: 'data-explorer', label: 'Data Explorer', icon: 'data' },
  { id: 'api-access', label: 'API Access', icon: 'api' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export const AppShell: React.FC<AppShellProps> = ({
  activeRoute,
  onSelectRoute,
  canvasMode,
  onToggleCanvasMode,
  globalSearch,
  onGlobalSearchChange,
  dateRange,
  onDateRangeChange,
  userSession: propUserSession,
  onUserSessionChange,
  onLogout,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [notifOpen, setNotifOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const { language, toggleLanguage } = useLanguage();
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [localSession, setLocalSession] = useState<UserSession | null>(null);

  const userSession = propUserSession !== undefined ? propUserSession : localSession;
  const setUserSession = (session: UserSession | null) => {
    setLocalSession(session);
    if (onUserSessionChange) onUserSessionChange(session);
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between bg-[#F5F0E7] border-r border-[#E9E0D3] w-[205px] shrink-0 select-none">
      {/* Top Brand Logo & Wordmark */}
      <div>
        <div className="px-3.5 pt-4 pb-3 border-b border-[#E9E0D3]/60">
          <button
            type="button"
            onClick={() => {
              onToggleCanvasMode('single');
              onSelectRoute('dashboard');
            }}
            className="text-left cursor-pointer focus:outline-none"
          >
            <LogoHorizontal compact />
          </button>
        </div>

        {/* Vertically Stacked Navigation Items */}
        <nav className="px-2.5 py-2.5 space-y-0.5" aria-label="Main Sidebar Navigation">
          {SIDEBAR_NAV_ITEMS.map((item) => {
            const isActive =
              canvasMode === 'single' && activeRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onToggleCanvasMode('single');
                  onSelectRoute(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#F5D7CC] text-[#9E3B22] font-bold'
                    : 'text-[#173F35] hover:bg-[#ECE4D7] font-medium'
                }`}
              >
                <span className="inline-flex items-center gap-2.5 truncate">
                  <AssetOutlineIcon
                    name={item.icon}
                    active={isActive}
                    className="w-4 h-4 shrink-0"
                  />
                  <span className="truncate">
                    {language === 'HI' ? (NAV_LABELS_HI[item.id] || item.label) : item.label}
                  </span>
                </span>
                {item.frameBadge && (
                  <span
                    className={`text-[10px] font-mono tabular-nums ${
                      isActive ? 'text-[#9E3B22]' : 'text-[#64716D]/75'
                    }`}
                  >
                    {item.frameBadge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Design System & Asset Sheet Catalogue Route */}
          <div className="pt-1.5 mt-1.5 border-t border-[#E9E0D3]">
            <button
              type="button"
              onClick={() => {
                onToggleCanvasMode('single');
                onSelectRoute('design-system');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap ${
                canvasMode === 'single' && activeRoute === 'design-system'
                  ? 'bg-[#F5D7CC] text-[#9E3B22] font-bold'
                  : 'text-[#64716D] hover:bg-[#ECE4D7] hover:text-[#173F35] font-medium'
              }`}
            >
              <Palette className="w-4 h-4 shrink-0" />
              <span>Design System &amp; Assets</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Bottom Decorative Illustration & "Skilled India / Stronger India" Motif */}
      <div className="mt-2 pt-2 relative overflow-hidden">
        <div className="text-center px-3 mb-1">
          <div className="text-[11px] font-bold text-[#173F35] leading-tight">
            Skilled India
          </div>
          <div className="text-[11px] font-bold text-[#17604D] leading-tight">
            Stronger India
          </div>
        </div>
        <SidebarBottomIllustration className="w-full h-24 block" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F8F5EF] text-[#173F35]">
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block sticky top-0 h-screen">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#173F35]/40 md:hidden flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="relative h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-3 right-2.5 z-10 p-1.5 rounded-lg bg-[#FFFEFB] text-[#173F35]"
              aria-label="Close navigation menu"
            >
              <X className="w-4 h-4" />
            </button>
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Main Column: Shared Top Header + Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Shared Top Header (64px height, warm-white background, subtle bottom border) */}
        <header className="h-16 bg-[#FFFEFB] border-b border-[#E9E0D3] px-4 lg:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          {/* Left Zone: Mobile Menu Trigger + Global Search Field */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg border border-[#E9E0D3] text-[#173F35] hover:bg-[#F5F0E7] cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (globalSearch.trim()) {
                  onToggleCanvasMode('single');
                  onSelectRoute('data-explorer');
                }
              }}
              className="relative w-full"
            >
              <Search className="w-3.5 h-3.5 text-[#64716D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={globalSearch}
                onChange={(e) => onGlobalSearchChange(e.target.value)}
                placeholder="Search sector, trade, district..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8F5EF] border border-[#E9E0D3] rounded-lg text-[#173F35] placeholder:text-[#64716D] focus:outline-none focus:bg-[#FFFEFB] focus:border-[#17604D] transition-colors"
              />
            </form>
          </div>

          {/* Right Zone: Frame Mode Switcher, Date-Range Selector, Language, Notifications, Admin Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Interactive Canvas Switcher: Single Screen vs 6-Frame Reference Overview */}
            <div className="hidden xl:flex items-center bg-[#F5F0E7] p-0.5 rounded-lg border border-[#E9E0D3]">
              <button
                type="button"
                onClick={() => onToggleCanvasMode('single')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  canvasMode === 'single'
                    ? 'bg-[#FFFEFB] text-[#173F35] shadow-2xs'
                    : 'text-[#64716D] hover:text-[#173F35]'
                }`}
              >
                <Maximize2 className="w-3 h-3" />
                <span>Interactive View</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleCanvasMode('six-grid')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  canvasMode === 'six-grid'
                    ? 'bg-[#FFFEFB] text-[#173F35] shadow-2xs'
                    : 'text-[#64716D] hover:text-[#173F35]'
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>6-Page Reference Grid</span>
              </button>
            </div>

            {/* Date-Range Selector matching Reference Image 1 ("Last 1 Year") */}
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => onDateRangeChange(e.target.value)}
                aria-label="Select date range"
                className="appearance-none bg-[#FFFEFB] border border-[#E9E0D3] hover:border-[#D4C6B4] rounded-lg pl-3 pr-7 py-1.5 text-xs font-medium text-[#173F35] cursor-pointer focus:outline-none"
              >
                <option value="Last 1 Year">Last 1 Year</option>
                <option value="FY 2026–27">FY 2026–27</option>
                <option value="Next 3 Years">Next 3 Years</option>
              </select>
              <svg
                className="w-3.5 h-3.5 text-[#64716D] pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
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

            {/* Compact Language Selector */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="hidden sm:inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg border border-[#E9E0D3] bg-[#FFFEFB] hover:bg-[#F5F0E7] text-xs font-semibold text-[#173F35] cursor-pointer"
              title="Switch Interface Language (English / हिन्दी)"
            >
              {language === 'EN' ? 'EN' : 'हिं'}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                className="p-2 rounded-lg border border-[#E9E0D3] bg-[#FFFEFB] hover:bg-[#F5F0E7] text-[#173F35] cursor-pointer relative"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#FFFEFB] border border-[#E9E0D3] rounded-xl shadow-lg p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E9E0D3]">
                    <span className="text-xs font-bold text-[#173F35]">
                      Recent Skill Shortage Alerts
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setNotifOpen(false);
                        onToggleCanvasMode('single');
                        onSelectRoute('alerts');
                      }}
                      className="text-[11px] font-semibold text-[#17604D] hover:underline cursor-pointer"
                    >
                      View all
                    </button>
                  </div>
                  <div className="divide-y divide-[#F2ECE1] mt-1">
                    {ALERTS_DATA.slice(0, 3).map((al) => (
                      <button
                        key={al.id}
                        type="button"
                        onClick={() => {
                          setNotifOpen(false);
                          onToggleCanvasMode('single');
                          onSelectRoute('alerts');
                        }}
                        className="w-full text-left py-2 hover:bg-[#F8F5EF] px-1.5 rounded transition-colors cursor-pointer"
                      >
                        <div className="text-xs font-semibold text-[#173F35] truncate">
                          {al.tradeName} ({al.ncoCode})
                        </div>
                        <div className="text-[11px] text-[#64716D] truncate">
                          {al.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin / MSDE Officer Profile */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-[#F5F0E7] transition-colors cursor-pointer text-left"
                title="Click to view Government Officer details or sign out"
              >
                <div className="w-8 h-8 rounded-full bg-[#1B2B44] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {userSession ? userSession.name.charAt(0) : 'A'}
                </div>
                <div className="hidden sm:block leading-tight">
                  <div className="text-xs font-bold text-[#173F35]">
                    {userSession ? userSession.name : 'Officer Sign In'}
                  </div>
                  <div className="text-[10px] text-[#64716D] font-medium">
                    {userSession ? userSession.role : 'MSDE / NCVET'}
                  </div>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#FFFEFB] border border-[#E9E0D3] rounded-xl shadow-xl p-3 z-50 text-xs">
                  <div className="pb-2.5 mb-2.5 border-b border-[#E9E0D3]">
                    <div className="font-bold text-[#173F35] text-sm">
                      {userSession ? userSession.name : 'Government Officer'}
                    </div>
                    <div className="text-[11px] text-[#17604D] font-medium mt-0.5">
                      {userSession ? userSession.designation : 'Labour Market Intelligence Portal'}
                    </div>
                    <div className="text-[10px] text-[#64716D] mt-0.5">
                      {userSession ? userSession.department : 'MSDE National Portal'}
                    </div>
                    {userSession?.badge && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded bg-[#F5F0E7] text-[#173F35] font-mono text-[10px] font-semibold">
                        Badge: {userSession.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        setAuthModalOpen(true);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-[#173F35] hover:bg-[#F5F0E7] transition-colors cursor-pointer font-medium"
                    >
                      Switch Officer Role / Credentials
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        if (onLogout) {
                          onLogout();
                        } else {
                          setUserSession(null);
                        }
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-[#D96843] hover:bg-[#FDF2F0] transition-colors cursor-pointer font-medium flex items-center justify-between"
                    >
                      <span>Sign Out to Login Page</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 lg:p-5 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* MSDE Government Officer Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(session) => setUserSession(session)}
      />
    </div>
  );
};
