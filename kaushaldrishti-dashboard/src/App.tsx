import React, { useState, useEffect } from 'react';
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
  ApiAccessPage,
  SettingsPage,
  DesignSystemCataloguePage,
} from './components/SupportingPages';
import { NavRouteId } from './types';
import { LanguageProvider } from './context/LanguageContext';

function AppContent() {
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    // If URL explicitly requests login via hash or query, force login
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#/login' || window.location.search.includes('login')) {
        return null;
      }
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
      if (window.location.hash === '#/login' || window.location.search.includes('login')) {
        return 'login';
      }
    }
    return 'login';
  });

  const [canvasMode, setCanvasMode] = useState<'single' | 'six-grid'>('single');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('Last 1 Year');

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/login') {
        setActiveRoute('login');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogout = () => {
    setUserSession(null);
    try {
      localStorage.removeItem('kd_user_session');
      sessionStorage.removeItem('kd_user_session');
    } catch {
      // ignore
    }
    setActiveRoute('login');
    if (window.location.hash !== '#/login') {
      window.location.hash = '/login';
    }
  };

  const primarySixFrames: {
    id: NavRouteId;
    frameCode: string;
    title: string;
  }[] = [
    { id: 'dashboard', frameCode: '01 — Dashboard Overview', title: 'Dashboard' },
    { id: 'geographic', frameCode: '02 — Geographic Intelligence', title: 'Geographic View' },
    { id: 'sectors', frameCode: '03 — Sector & Trade Analysis', title: 'Sectors & Trades' },
    { id: 'forecasting', frameCode: '04 — Skill Demand Forecasting', title: 'Forecasting' },
    { id: 'alerts', frameCode: '05 — Alerts & Insights', title: 'Alerts & Insights' },
    {
      id: 'recommendations',
      frameCode: '06 — Planning Recommendations',
      title: 'Planning Recommendations',
    },
  ];

  const renderActivePage = () => {
    switch (activeRoute) {
      case 'dashboard':
        return <DashboardOverviewPage onNavigate={setActiveRoute} />;
      case 'geographic':
        return <GeographicViewPage />;
      case 'sectors':
        return <SectorsAndTradesPage />;
      case 'forecasting':
        return <SkillForecastingPage />;
      case 'alerts':
        return <AlertsAndInsightsPage onNavigate={setActiveRoute} />;
      case 'recommendations':
        return <PlanningRecommendationsPage />;
      case 'demand-supply':
        return <DemandSupplyPage />;
      case 'training':
        return <TrainingCapacityPage />;
      case 'reports':
        return <ReportsAndRecommendationsPage />;
      case 'data-explorer':
        return <DataExplorerPage />;
      case 'api-access':
        return <ApiAccessPage />;
      case 'settings':
        return <SettingsPage />;
      case 'design-system':
        return <DesignSystemCataloguePage />;
      default:
        return <DashboardOverviewPage onNavigate={setActiveRoute} />;
    }
  };

  if (activeRoute === 'login' || !userSession) {
    return (
      <LoginPage
        onLoginSuccess={(session) => {
          setUserSession(session);
          setActiveRoute('dashboard');
          if (window.location.hash === '#/login') {
            window.location.hash = '';
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
      {/* Quick Reference Frame Bar for Seamless Jumping Across the 6 Primary Pages */}
      <div className="mb-4 pb-2.5 border-b border-[#E9E0D3] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={handleLogout}
            className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#FDF2F0] text-[#D96843] hover:bg-[#FBE8E4] transition-colors cursor-pointer whitespace-nowrap"
            title="Switch back to KaushalDrishti Login Screen"
          >
            🔒 Login Page
          </button>
          {primarySixFrames.map((frame) => {
            const isCurrent =
              canvasMode === 'single' && activeRoute === frame.id;
            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => {
                  setCanvasMode('single');
                  setActiveRoute(frame.id);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isCurrent
                    ? 'bg-[#173F35] text-[#FFFEFB] font-semibold'
                    : 'bg-[#F5F0E7] text-[#64716D] hover:text-[#173F35] hover:bg-[#EAE1D3]'
                }`}
              >
                {frame.frameCode}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() =>
            setCanvasMode((m) => (m === 'single' ? 'six-grid' : 'single'))
          }
          className="text-[11px] font-semibold text-[#17604D] hover:underline cursor-pointer whitespace-nowrap"
        >
          {canvasMode === 'single'
            ? 'View All 6 Reference Pages Together →'
            : '← Return to Single Page Mode'}
        </button>
      </div>

      {canvasMode === 'single' ? (
        renderActivePage()
      ) : (
        /* 6-Page Reference Grid Mode (mirrors Reference Image 1's 2x3 presentation) */
        <div className="space-y-6">
          <div className="bg-[#FFFEFB] border border-[#E9E0D3] rounded-xl p-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif-heading text-lg font-bold text-[#173F35]">
                KaushalDrishti — Complete 6-Frame Reference Overview
              </h2>
              <p className="text-xs text-[#64716D]">
                All six primary dashboard frames rendered side-by-side for design inspection. Click any frame header to open full-screen.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-[#F8F5EF] border-2 border-[#E9E0D3] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E9E0D3]">
                <span className="text-xs font-mono font-bold text-[#17604D]">
                  Frame 01 — Dashboard Overview
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCanvasMode('single');
                    setActiveRoute('dashboard');
                  }}
                  className="text-xs font-semibold text-[#D96843] hover:underline cursor-pointer"
                >
                  Open Full Frame →
                </button>
              </div>
              <DashboardOverviewPage onNavigate={setActiveRoute} />
            </div>

            <div className="bg-[#F8F5EF] border-2 border-[#E9E0D3] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E9E0D3]">
                <span className="text-xs font-mono font-bold text-[#17604D]">
                  Frame 02 — Geographic Intelligence
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCanvasMode('single');
                    setActiveRoute('geographic');
                  }}
                  className="text-xs font-semibold text-[#D96843] hover:underline cursor-pointer"
                >
                  Open Full Frame →
                </button>
              </div>
              <GeographicViewPage />
            </div>

            <div className="bg-[#F8F5EF] border-2 border-[#E9E0D3] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E9E0D3]">
                <span className="text-xs font-mono font-bold text-[#17604D]">
                  Frame 03 — Sector and Trade Analysis
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCanvasMode('single');
                    setActiveRoute('sectors');
                  }}
                  className="text-xs font-semibold text-[#D96843] hover:underline cursor-pointer"
                >
                  Open Full Frame →
                </button>
              </div>
              <SectorsAndTradesPage />
            </div>

            <div className="bg-[#F8F5EF] border-2 border-[#E9E0D3] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E9E0D3]">
                <span className="text-xs font-mono font-bold text-[#17604D]">
                  Frame 04 — Skill Demand Forecasting
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCanvasMode('single');
                    setActiveRoute('forecasting');
                  }}
                  className="text-xs font-semibold text-[#D96843] hover:underline cursor-pointer"
                >
                  Open Full Frame →
                </button>
              </div>
              <SkillForecastingPage />
            </div>

            <div className="bg-[#F8F5EF] border-2 border-[#E9E0D3] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E9E0D3]">
                <span className="text-xs font-mono font-bold text-[#17604D]">
                  Frame 05 — Alerts and Insights
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCanvasMode('single');
                    setActiveRoute('alerts');
                  }}
                  className="text-xs font-semibold text-[#D96843] hover:underline cursor-pointer"
                >
                  Open Full Frame →
                </button>
              </div>
              <AlertsAndInsightsPage onNavigate={setActiveRoute} />
            </div>

            <div className="bg-[#F8F5EF] border-2 border-[#E9E0D3] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E9E0D3]">
                <span className="text-xs font-mono font-bold text-[#17604D]">
                  Frame 06 — Planning Recommendations
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCanvasMode('single');
                    setActiveRoute('recommendations');
                  }}
                  className="text-xs font-semibold text-[#D96843] hover:underline cursor-pointer"
                >
                  Open Full Frame →
                </button>
              </div>
              <PlanningRecommendationsPage />
            </div>
          </div>
        </div>
      )}
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
