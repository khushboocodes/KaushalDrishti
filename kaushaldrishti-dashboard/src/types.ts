export type NavRouteId =
  | 'login'
  | 'dashboard'
  | 'demand-supply'
  | 'forecasting'
  | 'sectors'
  | 'geographic'
  | 'training'
  | 'policy-sandbox'
  | 'alerts'
  | 'recommendations'
  | 'reports'
  | 'data-explorer'
  | 'telemetry-upload'
  | 'settings';

export type SupplyStatus = 'Undersupply' | 'Balanced' | 'Oversupply' | 'Moderate';

export interface DistrictData {
  id: string;
  name: string;
  state: string;
  demand: number;
  trained: number;
  gap: number;
  status: SupplyStatus;
  topTrades: {
    name: string;
    ncoCode: string;
    demand: number;
    sector: string;
  }[];
  centresCount: number;
  seatUtilization: number;
}

export interface StateOverviewData {
  state: string;
  code: string;
  totalDemandLabel: string;
  totalTrainedLabel: string;
  gapLabel: string;
  demandNum: number;
  trainedNum: number;
  gapNum: number;
  status: SupplyStatus;
  districts: DistrictData[];
  pathD: string;
  labelX: number;
  labelY: number;
}

export interface SectorMetric {
  id: string;
  name: string;
  demandLabel: string;
  demandK: number;
  trainedK: number;
  growth: string;
  growthNum: number;
  status: SupplyStatus;
  iconKey: string;
}

export interface TradeGrowthItem {
  rank: number;
  name: string;
  ncoCode: string;
  sector: string;
  growth: string;
  growthNum: number;
  currentDemand: number;
  projectedDemand: number;
  recommendedSeats: number;
  expectedGap: number;
  status: SupplyStatus;
  yearlySeries: {
    year: string;
    historical?: number;
    forecast?: number;
  }[];
  factors: string[];
  confidence: number;
}

export interface AlertItem {
  id: string;
  category: 'Undersupply' | 'Oversupply' | 'High Growth';
  title: string;
  tradeName: string;
  ncoCode: string;
  description: string;
  sector: string;
  districtsCount: number;
  affectedDistricts: string[];
  timestamp: string;
  recommendedAction: string;
  projectedGap: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  summary: string;
  priority: 'High' | 'Medium' | 'Low';
  iconType: 'capacity' | 'curriculum' | 'centres';
  details: {
    rationale: string;
    targetTrades: string[];
    targetDistricts: string[];
    estimatedBudget: string;
    timeline: string;
    policyNote: string;
  };
}

export interface GeneratedReport {
  id: string;
  title: string;
  category: 'State Skill Gap' | 'Sector Forecast' | 'NSQF Curriculum' | 'ITI Capacity';
  generatedDate: string;
  period: string;
  format: 'PDF' | 'XLSX' | 'CSV';
  size: string;
  author: string;
}

export interface ExplorerRecord {
  id: string;
  ncoCode: string;
  tradeName: string;
  nsqfLevel: number;
  sector: string;
  state: string;
  district: string;
  annualDemand: number;
  annualTrained: number;
  gap: number;
  status: SupplyStatus;
  source: 'NSDC Skill India' | 'PLFS Microdata' | 'EPFO Payroll' | 'NCS Portal';
  lastUpdated: string;
}
