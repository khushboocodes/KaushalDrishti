import { NavRouteId } from '../types';
import { UserRoleType } from '../utils/rbac';

export interface BarDataPoint {
  year: string;
  demand: number;
  trained: number;
  demandLabel: string;
  trainedLabel: string;
}

export interface DashboardDataset {
  periodBadge: string;
  scopeNote: string;
  kpis: {
    demand: { value: string; trend: string; trendLabel: string };
    trained: { value: string; trend: string; trendLabel: string };
    gap: { value: string; status: string; isShortage: boolean };
    highGrowth: { value: string; note: string };
  };
  chart: {
    yMax: number;
    gridLabels: { y: number; label: string }[];
    bars: {
      Yearly: BarDataPoint[];
      Quarterly: BarDataPoint[];
    };
  };
  donut: {
    totalTrades: string;
    undersupplyPct: number;
    balancedPct: number;
    oversupplyPct: number;
  };
  quickInsights: Array<{
    id: string;
    title: string;
    subtitle: string;
    highlight?: string;
    icon: 'heart' | 'leaf' | 'monitor' | 'crane';
    tone: 'coral' | 'sage' | 'blue' | 'amber';
    route: NavRouteId;
  }>;
}

const DASHBOARD_METRICS_REGISTRY: Record<
  UserRoleType,
  Record<string, DashboardDataset>
> = {
  ADMIN: {
    'Last 1 Year': {
      periodBadge: 'Past 12 Months Actuals & Baseline',
      scopeNote: 'All States & Apex Sanctions',
      kpis: {
        demand: { value: '1.24 Cr', trend: '↗ +18%', trendLabel: 'vs. previous year' },
        trained: { value: '1.08 Cr', trend: '↗ +12%', trendLabel: 'Across NSQF trades' },
        gap: { value: '+16 Lakh', status: 'Undersupply (overall)', isShortage: true },
        highGrowth: { value: '28', note: '> 20% expected growth' },
      },
      chart: {
        yMax: 150,
        gridLabels: [
          { y: 20, label: '1.5Cr' },
          { y: 65, label: '1Cr' },
          { y: 110, label: '50L' },
          { y: 155, label: '0' },
        ],
        bars: {
          Yearly: [
            { year: '2022', demand: 92, trained: 82, demandLabel: '0.92 Cr', trainedLabel: '0.82 Cr' },
            { year: '2023', demand: 98, trained: 88, demandLabel: '0.98 Cr', trainedLabel: '0.88 Cr' },
            { year: '2024', demand: 108, trained: 94, demandLabel: '1.08 Cr', trainedLabel: '0.94 Cr' },
            { year: '2025', demand: 118, trained: 102, demandLabel: '1.18 Cr', trainedLabel: '1.02 Cr' },
            { year: '2026 (F)', demand: 124, trained: 108, demandLabel: '1.24 Cr', trainedLabel: '1.08 Cr' },
          ],
          Quarterly: [
            { year: 'Q1 FY26', demand: 114, trained: 99, demandLabel: '1.14 Cr', trainedLabel: '0.99 Cr' },
            { year: 'Q2 FY26', demand: 117, trained: 101, demandLabel: '1.17 Cr', trainedLabel: '1.01 Cr' },
            { year: 'Q3 FY26', demand: 120, trained: 105, demandLabel: '1.20 Cr', trainedLabel: '1.05 Cr' },
            { year: 'Q4 FY26', demand: 122, trained: 106, demandLabel: '1.22 Cr', trainedLabel: '1.06 Cr' },
            { year: 'Q1 FY27 (F)', demand: 124, trained: 108, demandLabel: '1.24 Cr', trainedLabel: '1.08 Cr' },
          ],
        },
      },
      donut: {
        totalTrades: '1,245',
        undersupplyPct: 38,
        balancedPct: 42,
        oversupplyPct: 20,
      },
      quickInsights: [
        {
          id: 'healthcare',
          title: 'Healthcare',
          subtitle: 'High demand in 14 districts',
          highlight: '',
          icon: 'heart',
          tone: 'coral',
          route: 'sectors',
        },
        {
          id: 'green-jobs',
          title: 'Green Jobs',
          subtitle: 'projected growth',
          highlight: '32%',
          icon: 'leaf',
          tone: 'sage',
          route: 'forecasting',
        },
        {
          id: 'it-ites',
          title: 'IT/ITeS',
          subtitle: 'Consistent demand',
          highlight: '',
          icon: 'monitor',
          tone: 'blue',
          route: 'sectors',
        },
        {
          id: 'construction',
          title: 'Construction',
          subtitle: 'Shortage risk in 8 states',
          highlight: '',
          icon: 'crane',
          tone: 'amber',
          route: 'geographic',
        },
      ],
    },
    'FY 2026–27': {
      periodBadge: 'Upcoming Fiscal Year Targets (FY 2026–27)',
      scopeNote: 'Sanctioned Seat Plan & Budget Allocations',
      kpis: {
        demand: { value: '1.48 Cr', trend: '↗ +19.4%', trendLabel: 'Projected target demand' },
        trained: { value: '1.21 Cr', trend: '↗ +12.0%', trendLabel: 'Planned admissions intake' },
        gap: { value: '+27 Lakh', status: 'Anticipated deficit (+68%)', isShortage: true },
        highGrowth: { value: '34', note: 'EV, Green H2, Solar & AI' },
      },
      chart: {
        yMax: 180,
        gridLabels: [
          { y: 20, label: '1.8Cr' },
          { y: 65, label: '1.2Cr' },
          { y: 110, label: '60L' },
          { y: 155, label: '0' },
        ],
        bars: {
          Yearly: [
            { year: 'FY24', demand: 108, trained: 94, demandLabel: '1.08 Cr', trainedLabel: '0.94 Cr' },
            { year: 'FY25', demand: 118, trained: 102, demandLabel: '1.18 Cr', trainedLabel: '1.02 Cr' },
            { year: 'FY26', demand: 124, trained: 108, demandLabel: '1.24 Cr', trainedLabel: '1.08 Cr' },
            { year: 'FY27 (P)', demand: 148, trained: 121, demandLabel: '1.48 Cr', trainedLabel: '1.21 Cr' },
            { year: 'FY28 (P)', demand: 162, trained: 130, demandLabel: '1.62 Cr', trainedLabel: '1.30 Cr' },
          ],
          Quarterly: [
            { year: 'Q1 FY27', demand: 132, trained: 112, demandLabel: '1.32 Cr', trainedLabel: '1.12 Cr' },
            { year: 'Q2 FY27', demand: 138, trained: 115, demandLabel: '1.38 Cr', trainedLabel: '1.15 Cr' },
            { year: 'Q3 FY27', demand: 144, trained: 118, demandLabel: '1.44 Cr', trainedLabel: '1.18 Cr' },
            { year: 'Q4 FY27', demand: 148, trained: 121, demandLabel: '1.48 Cr', trainedLabel: '1.21 Cr' },
            { year: 'Q1 FY28', demand: 152, trained: 124, demandLabel: '1.52 Cr', trainedLabel: '1.24 Cr' },
          ],
        },
      },
      donut: {
        totalTrades: '1,380',
        undersupplyPct: 45,
        balancedPct: 39,
        oversupplyPct: 16,
      },
      quickInsights: [
        {
          id: 'healthcare',
          title: 'Healthcare',
          subtitle: 'Target 2.4L new admissions in GDA',
          highlight: '+42%',
          icon: 'heart',
          tone: 'coral',
          route: 'sectors',
        },
        {
          id: 'green-jobs',
          title: 'Green Jobs',
          subtitle: 'Expansion in Solar PV & EV Technicians',
          highlight: '48%',
          icon: 'leaf',
          tone: 'sage',
          route: 'forecasting',
        },
        {
          id: 'it-ites',
          title: 'IT/ITeS',
          subtitle: 'AI/ML & Cybersecurity fast-track',
          highlight: '+26%',
          icon: 'monitor',
          tone: 'blue',
          route: 'sectors',
        },
        {
          id: 'construction',
          title: 'Construction',
          subtitle: 'BIM & Precast infrastructure trades',
          highlight: '',
          icon: 'crane',
          tone: 'amber',
          route: 'geographic',
        },
      ],
    },
    'Next 3 Years': {
      periodBadge: 'Medium-Term Strategic Outlook (2026–2029)',
      scopeNote: 'Multi-Year Capacity Ramp & Industrial Clusters',
      kpis: {
        demand: { value: '4.85 Cr', trend: '↗ +24.6%', trendLabel: 'Cumulative 36-mo demand' },
        trained: { value: '3.92 Cr', trend: '↗ +16.2%', trendLabel: 'Projected NSQF pass-outs' },
        gap: { value: '+93 Lakh', status: '3-Year cumulative skilling gap', isShortage: true },
        highGrowth: { value: '52', note: 'Priority emerging trades' },
      },
      chart: {
        yMax: 220,
        gridLabels: [
          { y: 20, label: '2.2Cr' },
          { y: 65, label: '1.5Cr' },
          { y: 110, label: '70L' },
          { y: 155, label: '0' },
        ],
        bars: {
          Yearly: [
            { year: '2025', demand: 118, trained: 102, demandLabel: '1.18 Cr', trainedLabel: '1.02 Cr' },
            { year: '2026 (F)', demand: 124, trained: 108, demandLabel: '1.24 Cr', trainedLabel: '1.08 Cr' },
            { year: '2027 (F)', demand: 148, trained: 121, demandLabel: '1.48 Cr', trainedLabel: '1.21 Cr' },
            { year: '2028 (F)', demand: 176, trained: 139, demandLabel: '1.76 Cr', trainedLabel: '1.39 Cr' },
            { year: '2029 (F)', demand: 205, trained: 158, demandLabel: '2.05 Cr', trainedLabel: '1.58 Cr' },
          ],
          Quarterly: [
            { year: 'FY26', demand: 124, trained: 108, demandLabel: '1.24 Cr', trainedLabel: '1.08 Cr' },
            { year: 'FY27', demand: 148, trained: 121, demandLabel: '1.48 Cr', trainedLabel: '1.21 Cr' },
            { year: 'FY28', demand: 176, trained: 139, demandLabel: '1.76 Cr', trainedLabel: '1.39 Cr' },
            { year: 'FY29', demand: 205, trained: 158, demandLabel: '2.05 Cr', trainedLabel: '1.58 Cr' },
            { year: 'FY30', demand: 230, trained: 175, demandLabel: '2.30 Cr', trainedLabel: '1.75 Cr' },
          ],
        },
      },
      donut: {
        totalTrades: '1,520',
        undersupplyPct: 51,
        balancedPct: 35,
        oversupplyPct: 14,
      },
      quickInsights: [
        {
          id: 'healthcare',
          title: 'Healthcare',
          subtitle: '3.4L cumulative shortage by 2029',
          highlight: 'Severe',
          icon: 'heart',
          tone: 'coral',
          route: 'sectors',
        },
        {
          id: 'green-jobs',
          title: 'Green Jobs',
          subtitle: 'Clean Energy transition net addition',
          highlight: '+58%',
          icon: 'leaf',
          tone: 'sage',
          route: 'forecasting',
        },
        {
          id: 'it-ites',
          title: 'IT/ITeS',
          subtitle: 'Cloud architecture & IoT skill overhaul',
          highlight: '',
          icon: 'monitor',
          tone: 'blue',
          route: 'sectors',
        },
        {
          id: 'construction',
          title: 'Construction',
          subtitle: 'Major freight & urban transit pipeline',
          highlight: '+35%',
          icon: 'crane',
          tone: 'amber',
          route: 'geographic',
        },
      ],
    },
  },

  DSO: {
    'Last 1 Year': {
      periodBadge: 'Pune District 12-Month Performance (DSC)',
      scopeNote: 'Pune District Command (MH-492)',
      kpis: {
        demand: { value: '4.82 Lakh', trend: '↗ +14%', trendLabel: 'Pune district industries' },
        trained: { value: '4.15 Lakh', trend: '↗ +9%', trendLabel: 'Local ITI & polytechnic' },
        gap: { value: '+67,000', status: 'Local undersupply (Pune)', isShortage: true },
        highGrowth: { value: '14', note: 'Auto EV, CNC & Electronics' },
      },
      chart: {
        yMax: 60,
        gridLabels: [
          { y: 20, label: '6.0L' },
          { y: 65, label: '4.0L' },
          { y: 110, label: '2.0L' },
          { y: 155, label: '0' },
        ],
        bars: {
          Yearly: [
            { year: '2022', demand: 36, trained: 31, demandLabel: '3.60 L', trainedLabel: '3.10 L' },
            { year: '2023', demand: 40, trained: 34, demandLabel: '4.00 L', trainedLabel: '3.40 L' },
            { year: '2024', demand: 43, trained: 37, demandLabel: '4.30 L', trainedLabel: '3.70 L' },
            { year: '2025', demand: 46, trained: 39, demandLabel: '4.60 L', trainedLabel: '3.90 L' },
            { year: '2026 (F)', demand: 48.2, trained: 41.5, demandLabel: '4.82 L', trainedLabel: '4.15 L' },
          ],
          Quarterly: [
            { year: 'Q1 FY26', demand: 44, trained: 38, demandLabel: '4.40 L', trainedLabel: '3.80 L' },
            { year: 'Q2 FY26', demand: 45, trained: 39, demandLabel: '4.50 L', trainedLabel: '3.90 L' },
            { year: 'Q3 FY26', demand: 47, trained: 40, demandLabel: '4.70 L', trainedLabel: '4.00 L' },
            { year: 'Q4 FY26', demand: 48, trained: 41, demandLabel: '4.80 L', trainedLabel: '4.10 L' },
            { year: 'Q1 FY27 (F)', demand: 48.2, trained: 41.5, demandLabel: '4.82 L', trainedLabel: '4.15 L' },
          ],
        },
      },
      donut: {
        totalTrades: '142',
        undersupplyPct: 44,
        balancedPct: 40,
        oversupplyPct: 16,
      },
      quickInsights: [
        {
          id: 'healthcare',
          title: 'Healthcare',
          subtitle: 'Shortage of 2,400 nursing aides in Pune East',
          highlight: '',
          icon: 'heart',
          tone: 'coral',
          route: 'sectors',
        },
        {
          id: 'green-jobs',
          title: 'Green Jobs',
          subtitle: 'Bhosari & Chakan EV technician surge',
          highlight: '45%',
          icon: 'leaf',
          tone: 'sage',
          route: 'forecasting',
        },
        {
          id: 'it-ites',
          title: 'IT/ITeS',
          subtitle: 'Hinjawadi entry-level QA testing saturation',
          highlight: '',
          icon: 'monitor',
          tone: 'blue',
          route: 'sectors',
        },
        {
          id: 'construction',
          title: 'Construction',
          subtitle: 'Pune Metro Line 3 heavy plant operators',
          highlight: '',
          icon: 'crane',
          tone: 'amber',
          route: 'geographic',
        },
      ],
    },
    'FY 2026–27': {
      periodBadge: 'Pune DSDP Annual Target (FY 2026–27)',
      scopeNote: 'District Skill Committee Sanction Plan',
      kpis: {
        demand: { value: '5.64 Lakh', trend: '↗ +17.0%', trendLabel: 'Chakan & Bhosari clusters' },
        trained: { value: '4.62 Lakh', trend: '↗ +11.3%', trendLabel: 'Sanctioned ITI capacity' },
        gap: { value: '+1.02 Lakh', status: 'Industrial cluster deficit', isShortage: true },
        highGrowth: { value: '18', note: 'Smart factory & Mechatronics' },
      },
      chart: {
        yMax: 70,
        gridLabels: [
          { y: 20, label: '7.0L' },
          { y: 65, label: '4.5L' },
          { y: 110, label: '2.0L' },
          { y: 155, label: '0' },
        ],
        bars: {
          Yearly: [
            { year: 'FY24', demand: 43, trained: 37, demandLabel: '4.30 L', trainedLabel: '3.70 L' },
            { year: 'FY25', demand: 46, trained: 39, demandLabel: '4.60 L', trainedLabel: '3.90 L' },
            { year: 'FY26', demand: 48.2, trained: 41.5, demandLabel: '4.82 L', trainedLabel: '4.15 L' },
            { year: 'FY27 (P)', demand: 56.4, trained: 46.2, demandLabel: '5.64 L', trainedLabel: '4.62 L' },
            { year: 'FY28 (P)', demand: 62, trained: 50, demandLabel: '6.20 L', trainedLabel: '5.00 L' },
          ],
          Quarterly: [
            { year: 'Q1 FY27', demand: 50, trained: 42, demandLabel: '5.00 L', trainedLabel: '4.20 L' },
            { year: 'Q2 FY27', demand: 52, trained: 43, demandLabel: '5.20 L', trainedLabel: '4.30 L' },
            { year: 'Q3 FY27', demand: 55, trained: 45, demandLabel: '5.50 L', trainedLabel: '4.50 L' },
            { year: 'Q4 FY27', demand: 56.4, trained: 46.2, demandLabel: '5.64 L', trainedLabel: '4.62 L' },
            { year: 'Q1 FY28', demand: 58, trained: 47, demandLabel: '5.80 L', trainedLabel: '4.70 L' },
          ],
        },
      },
      donut: {
        totalTrades: '158',
        undersupplyPct: 49,
        balancedPct: 36,
        oversupplyPct: 15,
      },
      quickInsights: [
        {
          id: 'healthcare',
          title: 'Healthcare',
          subtitle: 'Hadapsar health cluster +38% caregiver surge',
          highlight: '+38%',
          icon: 'heart',
          tone: 'coral',
          route: 'sectors',
        },
        {
          id: 'green-jobs',
          title: 'Green Jobs',
          subtitle: 'Solar rooftop installers in Shirur & Baramati',
          highlight: '52%',
          icon: 'leaf',
          tone: 'sage',
          route: 'forecasting',
        },
        {
          id: 'it-ites',
          title: 'IT/ITeS',
          subtitle: 'Cloud infra support in Magarpatta tech parks',
          highlight: '',
          icon: 'monitor',
          tone: 'blue',
          route: 'sectors',
        },
        {
          id: 'construction',
          title: 'Construction',
          subtitle: 'Heavy crane certification drive in Talegaon',
          highlight: '',
          icon: 'crane',
          tone: 'amber',
          route: 'geographic',
        },
      ],
    },
    'Next 3 Years': {
      periodBadge: 'Pune 3-Year District Trajectory (2026–2029)',
      scopeNote: 'Industrial Expansion & MSME Cluster Roadmap',
      kpis: {
        demand: { value: '18.2 Lakh', trend: '↗ +22.4%', trendLabel: '3-Year Pune DSDP demand' },
        trained: { value: '14.8 Lakh', trend: '↗ +14.1%', trendLabel: 'Projected ITI output' },
        gap: { value: '+3.40 Lakh', status: 'Cumulative Pune district gap', isShortage: true },
        highGrowth: { value: '24', note: 'Auto EV, Automation & Biotech' },
      },
      chart: {
        yMax: 90,
        gridLabels: [
          { y: 20, label: '9.0L' },
          { y: 65, label: '6.0L' },
          { y: 110, label: '3.0L' },
          { y: 155, label: '0' },
        ],
        bars: {
          Yearly: [
            { year: '2025', demand: 46, trained: 39, demandLabel: '4.60 L', trainedLabel: '3.90 L' },
            { year: '2026 (F)', demand: 48.2, trained: 41.5, demandLabel: '4.82 L', trainedLabel: '4.15 L' },
            { year: '2027 (F)', demand: 56.4, trained: 46.2, demandLabel: '5.64 L', trainedLabel: '4.62 L' },
            { year: '2028 (F)', demand: 66, trained: 53, demandLabel: '6.60 L', trainedLabel: '5.30 L' },
            { year: '2029 (F)', demand: 76, trained: 60, demandLabel: '7.60 L', trainedLabel: '6.00 L' },
          ],
          Quarterly: [
            { year: 'FY26', demand: 48.2, trained: 41.5, demandLabel: '4.82 L', trainedLabel: '4.15 L' },
            { year: 'FY27', demand: 56.4, trained: 46.2, demandLabel: '5.64 L', trainedLabel: '4.62 L' },
            { year: 'FY28', demand: 66, trained: 53, demandLabel: '6.60 L', trainedLabel: '5.30 L' },
            { year: 'FY29', demand: 76, trained: 60, demandLabel: '7.60 L', trainedLabel: '6.00 L' },
            { year: 'FY30', demand: 85, trained: 66, demandLabel: '8.50 L', trainedLabel: '6.60 L' },
          ],
        },
      },
      donut: {
        totalTrades: '176',
        undersupplyPct: 54,
        balancedPct: 32,
        oversupplyPct: 14,
      },
      quickInsights: [
        {
          id: 'healthcare',
          title: 'Healthcare',
          subtitle: 'Pune rural primary health worker expansion',
          highlight: 'Urgent',
          icon: 'heart',
          tone: 'coral',
          route: 'sectors',
        },
        {
          id: 'green-jobs',
          title: 'Green Jobs',
          subtitle: 'Automotive EV battery recycling hubs',
          highlight: '+64%',
          icon: 'leaf',
          tone: 'sage',
          route: 'forecasting',
        },
        {
          id: 'it-ites',
          title: 'IT/ITeS',
          subtitle: 'Robotics process automation in manufacturing',
          highlight: '',
          icon: 'monitor',
          tone: 'blue',
          route: 'sectors',
        },
        {
          id: 'construction',
          title: 'Construction',
          subtitle: 'Ring Road & Greenfield airport logistics staff',
          highlight: '',
          icon: 'crane',
          tone: 'amber',
          route: 'geographic',
        },
      ],
    },
  },

  NCVET: {
    'Last 1 Year': {
      periodBadge: 'National Standards & NSQF Accreditation (Past 12M)',
      scopeNote: 'National Occupational Standards (NOS)',
      kpis: {
        demand: { value: '1.24 Cr', trend: '↗ +18%', trendLabel: 'National QP requirements' },
        trained: { value: '1.08 Cr', trend: '↗ +12%', trendLabel: 'NSQF certified candidates' },
        gap: { value: '+16 Lakh', status: 'Accreditation gap', isShortage: true },
        highGrowth: { value: '28', note: 'QPs currently under revision' },
      },
      chart: {
        yMax: 150,
        gridLabels: [
          { y: 20, label: '1.5Cr' },
          { y: 65, label: '1Cr' },
          { y: 110, label: '50L' },
          { y: 155, label: '0' },
        ],
        bars: {
          Yearly: [
            { year: '2022', demand: 92, trained: 82, demandLabel: '0.92 Cr', trainedLabel: '0.82 Cr' },
            { year: '2023', demand: 98, trained: 88, demandLabel: '0.98 Cr', trainedLabel: '0.88 Cr' },
            { year: '2024', demand: 108, trained: 94, demandLabel: '1.08 Cr', trainedLabel: '0.94 Cr' },
            { year: '2025', demand: 118, trained: 102, demandLabel: '1.18 Cr', trainedLabel: '1.02 Cr' },
            { year: '2026 (F)', demand: 124, trained: 108, demandLabel: '1.24 Cr', trainedLabel: '1.08 Cr' },
          ],
          Quarterly: [
            { year: 'Q1 FY26', demand: 114, trained: 99, demandLabel: '1.14 Cr', trainedLabel: '0.99 Cr' },
            { year: 'Q2 FY26', demand: 117, trained: 101, demandLabel: '1.17 Cr', trainedLabel: '1.01 Cr' },
            { year: 'Q3 FY26', demand: 120, trained: 105, demandLabel: '1.20 Cr', trainedLabel: '1.05 Cr' },
            { year: 'Q4 FY26', demand: 122, trained: 106, demandLabel: '1.22 Cr', trainedLabel: '1.06 Cr' },
            { year: 'Q1 FY27 (F)', demand: 124, trained: 108, demandLabel: '1.24 Cr', trainedLabel: '1.08 Cr' },
          ],
        },
      },
      donut: {
        totalTrades: '1,245',
        undersupplyPct: 38,
        balancedPct: 42,
        oversupplyPct: 20,
      },
      quickInsights: [
        {
          id: 'healthcare',
          title: 'Healthcare',
          subtitle: 'NSQF Level 4 GDA curriculum revised',
          highlight: 'Updated',
          icon: 'heart',
          tone: 'coral',
          route: 'sectors',
        },
        {
          id: 'green-jobs',
          title: 'Green Jobs',
          subtitle: '5 New QPs accredited in Hydrogen energy',
          highlight: 'New',
          icon: 'leaf',
          tone: 'sage',
          route: 'forecasting',
        },
        {
          id: 'it-ites',
          title: 'IT/ITeS',
          subtitle: 'Draft QP for Prompt Engineering & AI Ops',
          highlight: 'Draft',
          icon: 'monitor',
          tone: 'blue',
          route: 'sectors',
        },
        {
          id: 'construction',
          title: 'Construction',
          subtitle: 'Workplace safety standards harmonized with ISO',
          highlight: '',
          icon: 'crane',
          tone: 'amber',
          route: 'training',
        },
      ],
    },
    'FY 2026–27': {
      periodBadge: 'National Qualification Rollout Plan (FY 2026–27)',
      scopeNote: 'Awarding Body & Training Provider Accreditation',
      kpis: {
        demand: { value: '1.48 Cr', trend: '↗ +19.4%', trendLabel: 'Projected industry QP needs' },
        trained: { value: '1.21 Cr', trend: '↗ +12.0%', trendLabel: 'Awarding body targets' },
        gap: { value: '+27 Lakh', status: 'Standards alignment gap', isShortage: true },
        highGrowth: { value: '34', note: 'Fast-track qualification packs' },
      },
      chart: {
        yMax: 180,
        gridLabels: [
          { y: 20, label: '1.8Cr' },
          { y: 65, label: '1.2Cr' },
          { y: 110, label: '60L' },
          { y: 155, label: '0' },
        ],
        bars: {
          Yearly: [
            { year: 'FY24', demand: 108, trained: 94, demandLabel: '1.08 Cr', trainedLabel: '0.94 Cr' },
            { year: 'FY25', demand: 118, trained: 102, demandLabel: '1.18 Cr', trainedLabel: '1.02 Cr' },
            { year: 'FY26', demand: 124, trained: 108, demandLabel: '1.24 Cr', trainedLabel: '1.08 Cr' },
            { year: 'FY27 (P)', demand: 148, trained: 121, demandLabel: '1.48 Cr', trainedLabel: '1.21 Cr' },
            { year: 'FY28 (P)', demand: 162, trained: 130, demandLabel: '1.62 Cr', trainedLabel: '1.30 Cr' },
          ],
          Quarterly: [
            { year: 'Q1 FY27', demand: 132, trained: 112, demandLabel: '1.32 Cr', trainedLabel: '1.12 Cr' },
            { year: 'Q2 FY27', demand: 138, trained: 115, demandLabel: '1.38 Cr', trainedLabel: '1.15 Cr' },
            { year: 'Q3 FY27', demand: 144, trained: 118, demandLabel: '1.44 Cr', trainedLabel: '1.18 Cr' },
            { year: 'Q4 FY27', demand: 148, trained: 121, demandLabel: '1.48 Cr', trainedLabel: '1.21 Cr' },
            { year: 'Q1 FY28', demand: 152, trained: 124, demandLabel: '1.52 Cr', trainedLabel: '1.24 Cr' },
          ],
        },
      },
      donut: {
        totalTrades: '1,380',
        undersupplyPct: 45,
        balancedPct: 39,
        oversupplyPct: 16,
      },
      quickInsights: [
        {
          id: 'healthcare',
          title: 'Healthcare',
          subtitle: 'Allied Health Council credit framework sync',
          highlight: 'Active',
          icon: 'heart',
          tone: 'coral',
          route: 'sectors',
        },
        {
          id: 'green-jobs',
          title: 'Green Jobs',
          subtitle: 'Electric Mobility NOS rollout across 18 states',
          highlight: 'Priority',
          icon: 'leaf',
          tone: 'sage',
          route: 'forecasting',
        },
        {
          id: 'it-ites',
          title: 'IT/ITeS',
          subtitle: 'Generative AI micro-credentials notified',
          highlight: 'New',
          icon: 'monitor',
          tone: 'blue',
          route: 'sectors',
        },
        {
          id: 'construction',
          title: 'Construction',
          subtitle: 'Green building certification standards',
          highlight: '',
          icon: 'crane',
          tone: 'amber',
          route: 'training',
        },
      ],
    },
    'Next 3 Years': {
      periodBadge: 'National 3-Year Standardisation Roadmap (2026–2029)',
      scopeNote: 'Future-Skills & Digital Credentials Ecosystem',
      kpis: {
        demand: { value: '4.85 Cr', trend: '↗ +24.6%', trendLabel: '3-Year National NOS scope' },
        trained: { value: '3.92 Cr', trend: '↗ +16.2%', trendLabel: 'Accredited capacity output' },
        gap: { value: '+93 Lakh', status: 'Cumulative standardisation gap', isShortage: true },
        highGrowth: { value: '52', note: 'Future-skills QPs prioritized' },
      },
      chart: {
        yMax: 220,
        gridLabels: [
          { y: 20, label: '2.2Cr' },
          { y: 65, label: '1.5Cr' },
          { y: 110, label: '70L' },
          { y: 155, label: '0' },
        ],
        bars: {
          Yearly: [
            { year: '2025', demand: 118, trained: 102, demandLabel: '1.18 Cr', trainedLabel: '1.02 Cr' },
            { year: '2026 (F)', demand: 124, trained: 108, demandLabel: '1.24 Cr', trainedLabel: '1.08 Cr' },
            { year: '2027 (F)', demand: 148, trained: 121, demandLabel: '1.48 Cr', trainedLabel: '1.21 Cr' },
            { year: '2028 (F)', demand: 176, trained: 139, demandLabel: '1.76 Cr', trainedLabel: '1.39 Cr' },
            { year: '2029 (F)', demand: 205, trained: 158, demandLabel: '2.05 Cr', trainedLabel: '1.58 Cr' },
          ],
          Quarterly: [
            { year: 'FY26', demand: 124, trained: 108, demandLabel: '1.24 Cr', trainedLabel: '1.08 Cr' },
            { year: 'FY27', demand: 148, trained: 121, demandLabel: '1.48 Cr', trainedLabel: '1.21 Cr' },
            { year: 'FY28', demand: 176, trained: 139, demandLabel: '1.76 Cr', trainedLabel: '1.39 Cr' },
            { year: 'FY29', demand: 205, trained: 158, demandLabel: '2.05 Cr', trainedLabel: '1.58 Cr' },
            { year: 'FY30', demand: 230, trained: 175, demandLabel: '2.30 Cr', trainedLabel: '1.75 Cr' },
          ],
        },
      },
      donut: {
        totalTrades: '1,520',
        undersupplyPct: 51,
        balancedPct: 35,
        oversupplyPct: 14,
      },
      quickInsights: [
        {
          id: 'healthcare',
          title: 'Healthcare',
          subtitle: 'Telemedicine & robotic surgery tech standards',
          highlight: 'Future',
          icon: 'heart',
          tone: 'coral',
          route: 'sectors',
        },
        {
          id: 'green-jobs',
          title: 'Green Jobs',
          subtitle: 'Decarbonisation cross-sector skills framework',
          highlight: '+72%',
          icon: 'leaf',
          tone: 'sage',
          route: 'forecasting',
        },
        {
          id: 'it-ites',
          title: 'IT/ITeS',
          subtitle: 'Quantum computing & cyber resilience NOS',
          highlight: 'NOS',
          icon: 'monitor',
          tone: 'blue',
          route: 'sectors',
        },
        {
          id: 'construction',
          title: 'Construction',
          subtitle: 'Smart city modular infrastructure trades',
          highlight: '',
          icon: 'crane',
          tone: 'amber',
          route: 'training',
        },
      ],
    },
  },
};

export const getDashboardDataset = (
  roleType: UserRoleType = 'ADMIN',
  dateRange: string = 'Last 1 Year'
): DashboardDataset => {
  const roleGroup = DASHBOARD_METRICS_REGISTRY[roleType] || DASHBOARD_METRICS_REGISTRY.ADMIN;
  return roleGroup[dateRange] || roleGroup['Last 1 Year'] || DASHBOARD_METRICS_REGISTRY.ADMIN['Last 1 Year'];
};

export interface HorizonConfig {
  dateRange: string;
  label: string;
  demandMultiplier: number;
  supplyMultiplier: number;
  gapMultiplier: number;
  demandCr: string;
  supplyCr: string;
  undersupplyTrades: number;
  oversupplyTrades: number;
  availableSeatsLakh: string;
  allocatedSeatsLakh: string;
  completionRate: string;
}

export const getHorizonConfig = (dateRange: string = 'Last 1 Year'): HorizonConfig => {
  if (dateRange === 'FY 2026–27') {
    return {
      dateRange: 'FY 2026–27',
      label: 'Upcoming Fiscal Year Targets (FY 2026–27)',
      demandMultiplier: 1.194,
      supplyMultiplier: 1.12,
      gapMultiplier: 1.68,
      demandCr: '1.48 Cr',
      supplyCr: '1.21 Cr',
      undersupplyTrades: 621,
      oversupplyTrades: 221,
      availableSeatsLakh: '17.6 Lakh',
      allocatedSeatsLakh: '15.8 Lakh',
      completionRate: '84.2%',
    };
  }
  if (dateRange === 'Next 3 Years') {
    return {
      dateRange: 'Next 3 Years',
      label: 'Medium-Term Strategic Outlook (2026–2029)',
      demandMultiplier: 3.91,
      supplyMultiplier: 3.63,
      gapMultiplier: 5.81,
      demandCr: '4.85 Cr',
      supplyCr: '3.92 Cr',
      undersupplyTrades: 775,
      oversupplyTrades: 213,
      availableSeatsLakh: '54.2 Lakh',
      allocatedSeatsLakh: '48.1 Lakh',
      completionRate: '86.5%',
    };
  }
  return {
    dateRange: 'Last 1 Year',
    label: 'Past 12 Months Baseline (FY 2025–26)',
    demandMultiplier: 1.0,
    supplyMultiplier: 1.0,
    gapMultiplier: 1.0,
    demandCr: '1.24 Cr',
    supplyCr: '1.08 Cr',
    undersupplyTrades: 473,
    oversupplyTrades: 249,
    availableSeatsLakh: '14.8 Lakh',
    allocatedSeatsLakh: '12.9 Lakh',
    completionRate: '81.6%',
  };
};
