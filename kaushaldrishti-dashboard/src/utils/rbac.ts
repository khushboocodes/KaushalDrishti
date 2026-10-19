import { NavRouteId } from '../types';
import { UserSession } from '../components/AuthModal';

export type UserRoleType = 'ADMIN' | 'DSO' | 'NCVET';

export interface RoleConfig {
  roleType: UserRoleType;
  title: string;
  badgeLabel: string;
  jurisdiction: string;
  clearanceLevel: string;
  governanceScope: string;
  allowedRoutes: NavRouteId[];
  canSanctionSeats: boolean;
  canReviseCurriculum: boolean;
  canGenerateApiKeys: boolean;
  canEditSystemSettings: boolean;
  isDistrictLocked: boolean;
  assignedDistrictId: string;
  assignedDistrictName: string;
  assignedStateName: string;
  defaultRoute: NavRouteId;
}

export const ROLE_CONFIGS: Record<UserRoleType, RoleConfig> = {
  ADMIN: {
    roleType: 'ADMIN',
    title: 'State SSDM Director',
    badgeLabel: 'Apex Authority (Level 1)',
    jurisdiction: 'All States & Apex Sanctions',
    clearanceLevel: 'Full Administrative & Budgetary Clearance',
    governanceScope: 'State-wide policy, budget allocation, cross-district reallocations, and inter-state analytics.',
    allowedRoutes: [
      'dashboard',
      'demand-supply',
      'forecasting',
      'sectors',
      'geographic',
      'training',
      'policy-sandbox',
      'alerts',
      'recommendations',
      'reports',
      'data-explorer',
      'settings',
    ],
    canSanctionSeats: true,
    canReviseCurriculum: true,
    canGenerateApiKeys: true,
    canEditSystemSettings: true,
    isDistrictLocked: false,
    assignedDistrictId: 'all',
    assignedDistrictName: 'All Districts',
    assignedStateName: 'Maharashtra',
    defaultRoute: 'dashboard',
  },
  DSO: {
    roleType: 'DSO',
    title: 'District Skill Officer',
    badgeLabel: 'District Operational (Level 2)',
    jurisdiction: 'Pune District, Maharashtra (Locked)',
    clearanceLevel: 'District Skill Committee (DSC) Execution Lead',
    governanceScope: 'Hyper-local ITI seat utilization, local MSME cluster hiring, and District Skill Development Plan (DSDP) drafting.',
    allowedRoutes: [
      'dashboard',
      'geographic',
      'training',
      'policy-sandbox',
      'demand-supply',
      'alerts',
      'recommendations',
      'reports',
      'data-explorer',
    ],
    canSanctionSeats: false,
    canReviseCurriculum: false,
    canGenerateApiKeys: false,
    canEditSystemSettings: false,
    isDistrictLocked: true,
    assignedDistrictId: 'pune',
    assignedDistrictName: 'Pune',
    assignedStateName: 'Maharashtra',
    defaultRoute: 'dashboard',
  },
  NCVET: {
    roleType: 'NCVET',
    title: 'NCVET Accreditation Admin',
    badgeLabel: 'Standards & Regulatory (Level 2)',
    jurisdiction: 'National Qualifications & NSQF Standards',
    clearanceLevel: 'National Occupational Standards (NOS) Directorate',
    governanceScope: 'Curriculum obsolescence monitoring, Qualification Packs (QPs), NSQF alignment, and training provider accreditation.',
    allowedRoutes: [
      'dashboard',
      'sectors',
      'demand-supply',
      'forecasting',
      'alerts',
      'training',
      'policy-sandbox',
      'reports',
      'data-explorer',
    ],
    canSanctionSeats: false,
    canReviseCurriculum: true,
    canGenerateApiKeys: false,
    canEditSystemSettings: false,
    isDistrictLocked: false,
    assignedDistrictId: 'all',
    assignedDistrictName: 'National Scope',
    assignedStateName: 'National',
    defaultRoute: 'sectors',
  },
};

export const DEMO_PROFILES: Record<UserRoleType, UserSession> = {
  ADMIN: {
    name: 'Dr. Rajesh Varma, IES',
    role: 'State SSDM Director',
    roleType: 'ADMIN',
    designation: 'Director, State Skill Development Mission',
    department: 'MSDE Government of India',
    badge: 'MSDE-SSDM-DIR',
    jurisdiction: 'All States & Apex Sanctions',
    clearanceLevel: 'Apex State Directorate (Full Clearance)',
  },
  DSO: {
    name: 'Smt. Anjali Deshmukh',
    role: 'District Skill Officer (DSO)',
    roleType: 'DSO',
    designation: 'District Skill Committee Lead',
    department: 'Pune District, Maharashtra',
    badge: 'DSO-MH-492',
    jurisdiction: 'Pune District, Maharashtra',
    clearanceLevel: 'Operational District Command (DSC Lead)',
  },
  NCVET: {
    name: 'Shri Vikramaditya Sen',
    role: 'NCVET Accreditation Admin',
    roleType: 'NCVET',
    designation: 'Director of Qualifications & Standards',
    department: 'NCVET National HQ, New Delhi',
    badge: 'NCVET-ADM-01',
    jurisdiction: 'National (NSQF & Standards)',
    clearanceLevel: 'Regulatory Qualifications & Standards',
  },
};

export const getUserRoleType = (session?: UserSession | null): UserRoleType => {
  if (!session) return 'ADMIN';
  if (session.roleType) return session.roleType;
  const str = `${session.role} ${session.department} ${session.badge}`.toLowerCase();
  if (str.includes('dso') || str.includes('district') || str.includes('anjali')) return 'DSO';
  if (str.includes('ncvet') || str.includes('sen') || str.includes('standards')) return 'NCVET';
  return 'ADMIN';
};

export const getRoleConfig = (session?: UserSession | null): RoleConfig => {
  const roleType = getUserRoleType(session);
  return ROLE_CONFIGS[roleType];
};

export const isRouteAllowedForSession = (session: UserSession | null, route: NavRouteId): boolean => {
  const config = getRoleConfig(session);
  return config.allowedRoutes.includes(route);
};
