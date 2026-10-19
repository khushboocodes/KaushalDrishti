import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { AppShell } from './components/AppShell';
import { LoginPage } from './components/LoginPage';
import { UserSession } from './components/AuthModal';
import {
  DashboardOverviewPage,
  GeographicViewPage,
  SectorsAndTradesPage,
  SkillForecastingPage,
  AlertsAndInsightsPage,
  PlanningRecommendationsPage,
} from './components/PrimaryPages';
import {
  DemandSupplyPage,
  TrainingCapacityPage,
  ReportsAndRecommendationsPage,
  DataExplorerPage,
  SettingsPage,
} from './components/SupportingPages';
import { NavRouteId } from './types';
import { LanguageProvider } from './context/LanguageContext';
import {
  getUserRoleType,
  getRoleConfig,
  isRouteAllowedForSession,
  DEMO_PROFILES,
} from './utils/rbac';

function AppContent() {
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved =
          localStorage.getItem('kd_user_session') ||
          sessionStorage.getItem('kd_user_session');
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [activeRoute, setActiveRoute] = useState<NavRouteId>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved =
          localStorage.getItem('kd_user_session') ||
          sessionStorage.getItem('kd_user_session');
        if (saved && JSON.parse(saved)) {
          return 'dashboard';
        }
      } catch {
        // ignore
      }
    }
    return 'login';
  });

  const userSessionRef = useRef<UserSession | null>(userSession);
  useEffect(() => {
    userSessionRef.current = userSession;
    if (userSession) {
      try {
        localStorage.setItem('kd_user_session', JSON.stringify(userSession));
        sessionStorage.setItem('kd_user_session', JSON.stringify(userSession));
      } catch {
        // ignore
      }
    }
  }, [userSession]);

  // If switched role is not allowed on current route, smoothly return to dashboard
  useEffect(() => {
    if (userSession && !isRouteAllowedForSession(userSession, activeRoute)) {
      setActiveRoute('dashboard');
    }
  }, [userSession, activeRoute]);

  const [canvasMode, setCanvasMode] = useState<'single' | 'six-grid'>('single');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('Last 1 Year');

  // Disable browser's automatic scroll restoration so page transitions always start cleanly from the top
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Whenever activeRoute changes, immediately scroll window and viewport to the very top
  useLayoutEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.scrollTop = 0;
      }
    };

    scrollToTop();
    const rafId = requestAnimationFrame(scrollToTop);
    const timeoutId = setTimeout(scrollToTop, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [activeRoute]);

  // Lock and block browser Back button when user is logged into the dashboard
  useEffect(() => {
    if (!userSession) return;

    // Clean hash from #/login if present while authenticated
    if (window.location.hash === '#/login' || window.location.hash === '#login') {
      try {
        window.history.replaceState({ kd_lock: true }, '', window.location.pathname);
      } catch {
        // ignore
      }
    }

    // Push an anti-back lock barrier onto browser history
    window.history.pushState({ kd_lock: true, route: activeRoute }, '', window.location.href);

    const handlePopState = () => {
      // If user is authenticated, intercept and block the Back button navigation:
      if (userSessionRef.current) {
        // Neutralize back button by immediately re-pushing current state
        window.history.pushState({ kd_lock: true, route: activeRoute }, '', window.location.href);

        if (window.location.hash === '#/login' || window.location.hash === '#login') {
          try {
            window.history.replaceState({ kd_lock: true }, '', window.location.pathname);
          } catch {
            // ignore
          }
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [userSession, activeRoute]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/login' || window.location.hash === '#login') {
        if (userSessionRef.current) {
          // Block navigating to login screen via hash while authenticated
          try {
            window.history.replaceState({ kd_lock: true }, '', window.location.pathname);
          } catch {
            // ignore
          }
          if (activeRoute === 'login') {
            setActiveRoute('dashboard');
          }
        } else {
          setActiveRoute('login');
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeRoute]);

  const handleLogout = () => {
    setUserSession(null);
    userSessionRef.current = null;
    try {
      localStorage.removeItem('kd_user_session');
      sessionStorage.removeItem('kd_user_session');
    } catch {
      // ignore
    }
    setActiveRoute('login');
    try {
      window.history.replaceState(null, '', '#/login');
    } catch {
      window.location.hash = '/login';
    }
  };



  const renderActivePage = () => {
    // Check if the current route is allowed for the active role:
    if (!isRouteAllowedForSession(userSession, activeRoute)) {
      const roleConfig = getRoleConfig(userSession);
      const roleType = getUserRoleType(userSession);
      return (
        <div className="bg-[#FFFEFB] border border-[#E9E0D3] rounded-2xl p-8 max-w-xl mx-auto my-12 text-center shadow-xs">
          <div className="w-12 h-12 bg-[#FDF2F0] text-[#D96843] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#FBE5DE] text-[#C8432B] font-mono">
            RBAC ACCESS RESTRICTION
          </span>
          <h2 className="text-lg font-bold text-[#173F35] mt-2">
            Module Access Restricted
          </h2>
          <p className="text-xs text-[#64716D] mt-2 leading-relaxed">
            {roleType === 'DSO'
              ? `The '${activeRoute}' module is restricted to Apex State Directorate (State SSDM Director). District Skill Officers operate within territorial DSDP and ground ITI execution parameters.`
              : `The '${activeRoute}' module is restricted. Your current credential (${roleConfig.title}) is authorized for National Qualifications & Standards.`}
          </p>
          <div className="mt-4 p-3 bg-[#F8F5EF] border border-[#E9E0D3] rounded-xl text-left text-xs">
            <div className="text-[11px] text-[#64716D]">
              <strong>Active Officer:</strong> {userSession?.name} ({roleConfig.badgeLabel})
            </div>
            <div className="text-[11px] text-[#64716D] mt-0.5">
              <strong>Jurisdiction:</strong> {roleConfig.jurisdiction}
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setActiveRoute('dashboard')}
              className="px-4 py-2 bg-[#F5F0E7] hover:bg-[#EAE1D2] text-[#173F35] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Return to Dashboard
            </button>
            <button
              type="button"
              onClick={() => setUserSession(DEMO_PROFILES.ADMIN)}
              className="px-4 py-2 bg-[#17604D] hover:bg-[#124B3B] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Simulate Admin Clearance
            </button>
          </div>
        </div>
      );
    }

    switch (activeRoute) {
      case 'dashboard':
        return (
          <DashboardOverviewPage
            onNavigate={setActiveRoute}
            userSession={userSession}
            dateRange={dateRange}
            searchQuery={globalSearch}
          />
        );
      case 'geographic':
        return (
          <GeographicViewPage
            userSession={userSession}
            dateRange={dateRange}
            searchQuery={globalSearch}
          />
        );
      case 'sectors':
        return (
          <SectorsAndTradesPage
            userSession={userSession}
            dateRange={dateRange}
            searchQuery={globalSearch}
          />
        );
      case 'forecasting':
        return (
          <SkillForecastingPage
            userSession={userSession}
            dateRange={dateRange}
            searchQuery={globalSearch}
          />
        );
      case 'alerts':
        return (
          <AlertsAndInsightsPage
            onNavigate={setActiveRoute}
            userSession={userSession}
            dateRange={dateRange}
            searchQuery={globalSearch}
          />
        );
      case 'recommendations':
        return (
          <PlanningRecommendationsPage
            userSession={userSession}
            dateRange={dateRange}
            searchQuery={globalSearch}
          />
        );
      case 'demand-supply':
        return (
          <DemandSupplyPage
            userSession={userSession}
            dateRange={dateRange}
            searchQuery={globalSearch}
          />
        );
      case 'training':
        return (
          <TrainingCapacityPage
            userSession={userSession}
            dateRange={dateRange}
            searchQuery={globalSearch}
          />
        );
      case 'reports':
        return (
          <ReportsAndRecommendationsPage
            userSession={userSession}
            dateRange={dateRange}
            searchQuery={globalSearch}
          />
        );
      case 'data-explorer':
        return (
          <DataExplorerPage
            userSession={userSession}
            dateRange={dateRange}
            searchQuery={globalSearch}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            userSession={userSession}
            onUserSessionChange={setUserSession}
          />
        );
      default:
        return (
          <DashboardOverviewPage
            onNavigate={setActiveRoute}
            userSession={userSession}
            dateRange={dateRange}
            searchQuery={globalSearch}
          />
        );
    }
  };

  if (!userSession) {
    return (
      <LoginPage
        onLoginSuccess={(session) => {
          setUserSession(session);
          userSessionRef.current = session;
          setActiveRoute('dashboard');
          try {
            window.history.replaceState({ kd_lock: true }, '', window.location.pathname);
            window.history.pushState({ kd_lock: true }, '', window.location.pathname);
          } catch {
            if (window.location.hash === '#/login') {
              window.location.hash = '';
            }
          }
        }}
      />
    );
  }

  return (
    <AppShell
      activeRoute={activeRoute}
      onSelectRoute={setActiveRoute}
      canvasMode={canvasMode}
      onToggleCanvasMode={setCanvasMode}
      globalSearch={globalSearch}
      onGlobalSearchChange={setGlobalSearch}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      userSession={userSession}
      onUserSessionChange={setUserSession}
      onLogout={handleLogout}
    >
      {renderActivePage()}
    </AppShell>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
