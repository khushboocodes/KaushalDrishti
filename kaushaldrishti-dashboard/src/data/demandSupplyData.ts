import { ExplorerRecord, SupplyStatus } from '../types';

export const ALL_SECTORS_LIST: string[] = [
  'IT/ITeS',
  'Green Jobs',
  'Manufacturing',
  'Healthcare',
  'Agriculture',
  'Logistics',
  'Hospitality',
  'Construction',
  'Retail',
  'Automotive',
  'Electronics',
];

interface StateProfile {
  name: string;
  code: string;
  primaryDistrict: string;
  secondaryDistrict?: string;
  scaleFactor: number;
}

const STATE_PROFILES: StateProfile[] = [
  { name: 'Maharashtra', code: 'MH', primaryDistrict: 'Pune', secondaryDistrict: 'Mumbai Suburban', scaleFactor: 1.25 },
  { name: 'Karnataka', code: 'KA', primaryDistrict: 'Bengaluru Urban', secondaryDistrict: 'Mysuru', scaleFactor: 1.15 },
  { name: 'Gujarat', code: 'GJ', primaryDistrict: 'Ahmedabad', secondaryDistrict: 'Surat', scaleFactor: 1.10 },
  { name: 'Tamil Nadu', code: 'TN', primaryDistrict: 'Chennai', secondaryDistrict: 'Coimbatore', scaleFactor: 1.12 },
  { name: 'Uttar Pradesh', code: 'UP', primaryDistrict: 'Lucknow', secondaryDistrict: 'Kanpur Nagar', scaleFactor: 1.20 },
  { name: 'Rajasthan', code: 'RJ', primaryDistrict: 'Jaipur', secondaryDistrict: 'Jodhpur', scaleFactor: 0.95 },
  { name: 'Telangana', code: 'TS', primaryDistrict: 'Hyderabad', secondaryDistrict: 'Warangal', scaleFactor: 1.05 },
  { name: 'Madhya Pradesh', code: 'MP', primaryDistrict: 'Bhopal', secondaryDistrict: 'Indore', scaleFactor: 0.90 },
  { name: 'West Bengal', code: 'WB', primaryDistrict: 'Kolkata', secondaryDistrict: 'Howrah', scaleFactor: 0.98 },
  { name: 'Bihar', code: 'BR', primaryDistrict: 'Patna', secondaryDistrict: 'Muzaffarpur', scaleFactor: 0.88 },
  { name: 'Odisha', code: 'OR', primaryDistrict: 'Khordha', secondaryDistrict: 'Paradip', scaleFactor: 0.85 },
  { name: 'Punjab', code: 'PB', primaryDistrict: 'Ludhiana', secondaryDistrict: 'Amritsar', scaleFactor: 0.82 },
  { name: 'Haryana', code: 'HR', primaryDistrict: 'Gurugram', secondaryDistrict: 'Faridabad', scaleFactor: 0.92 },
  { name: 'Kerala', code: 'KL', primaryDistrict: 'Ernakulam', secondaryDistrict: 'Thiruvananthapuram', scaleFactor: 0.84 },
  { name: 'Assam', code: 'AS', primaryDistrict: 'Kamrup Metropolitan', secondaryDistrict: 'Dibrugarh', scaleFactor: 0.72 },
  { name: 'Jharkhand', code: 'JH', primaryDistrict: 'Ranchi', secondaryDistrict: 'Jamshedpur', scaleFactor: 0.75 },
  { name: 'Chhattisgarh', code: 'CG', primaryDistrict: 'Raipur', secondaryDistrict: 'Bhilai', scaleFactor: 0.74 },
  { name: 'Andhra Pradesh', code: 'AP', primaryDistrict: 'Visakhapatnam', secondaryDistrict: 'Vijayawada', scaleFactor: 0.88 },
  { name: 'Uttarakhand', code: 'UK', primaryDistrict: 'Dehradun', secondaryDistrict: 'Haridwar', scaleFactor: 0.65 },
  { name: 'Himachal Pradesh', code: 'HP', primaryDistrict: 'Shimla', secondaryDistrict: 'Kangra', scaleFactor: 0.58 },
  { name: 'Jammu & Kashmir', code: 'JK', primaryDistrict: 'Srinagar', secondaryDistrict: 'Jammu', scaleFactor: 0.55 },
  { name: 'Ladakh', code: 'LA', primaryDistrict: 'Leh', secondaryDistrict: 'Kargil', scaleFactor: 0.35 },
  { name: 'NCT of Delhi', code: 'DL', primaryDistrict: 'New Delhi', secondaryDistrict: 'South Delhi', scaleFactor: 1.10 },
  { name: 'Goa', code: 'GA', primaryDistrict: 'North Goa', secondaryDistrict: 'South Goa', scaleFactor: 0.48 },
  { name: 'Arunachal Pradesh', code: 'AR', primaryDistrict: 'Itanagar', secondaryDistrict: 'Papum Pare', scaleFactor: 0.38 },
  { name: 'Manipur', code: 'MN', primaryDistrict: 'Imphal West', secondaryDistrict: 'Imphal East', scaleFactor: 0.40 },
  { name: 'Meghalaya', code: 'ML', primaryDistrict: 'East Khasi Hills', secondaryDistrict: 'Ri Bhoi', scaleFactor: 0.42 },
  { name: 'Mizoram', code: 'MZ', primaryDistrict: 'Aizawl', secondaryDistrict: 'Lunglei', scaleFactor: 0.36 },
  { name: 'Nagaland', code: 'NL', primaryDistrict: 'Kohima', secondaryDistrict: 'Dimapur', scaleFactor: 0.38 },
  { name: 'Sikkim', code: 'SK', primaryDistrict: 'East Sikkim', secondaryDistrict: 'Namchi', scaleFactor: 0.35 },
  { name: 'Tripura', code: 'TR', primaryDistrict: 'West Tripura', secondaryDistrict: 'Gomati', scaleFactor: 0.42 },
  { name: 'Chandigarh', code: 'CH', primaryDistrict: 'Chandigarh', scaleFactor: 0.50 },
  { name: 'Puducherry', code: 'PY', primaryDistrict: 'Puducherry', secondaryDistrict: 'Karaikal', scaleFactor: 0.45 },
  { name: 'Andaman & Nicobar Island', code: 'AN', primaryDistrict: 'South Andaman', scaleFactor: 0.32 },
  { name: 'Dadara & Nagar Havelli', code: 'DN', primaryDistrict: 'Silvassa', scaleFactor: 0.36 },
  { name: 'Daman & Diu', code: 'DD', primaryDistrict: 'Daman', secondaryDistrict: 'Diu', scaleFactor: 0.34 },
  { name: 'Lakshadweep', code: 'LD', primaryDistrict: 'Kavaratti', scaleFactor: 0.25 },
];

interface SectorTradeTemplate {
  tradeName: string;
  ncoCode: string;
  nsqfLevel: number;
  baseDemand: number;
  baseSupplyRatio: number; // e.g. 0.72 = 72% of demand is trained (undersupply)
  source: 'NSDC Skill India' | 'PLFS Microdata' | 'EPFO Payroll' | 'NCS Portal';
}

const SECTOR_TRADE_TEMPLATES: Record<string, SectorTradeTemplate[]> = {
  'IT/ITeS': [
    { tradeName: 'Software Developer', ncoCode: '2512.01', nsqfLevel: 6, baseDemand: 6800, baseSupplyRatio: 0.65, source: 'NCS Portal' },
    { tradeName: 'Data Analyst & BI Specialist', ncoCode: '2511.01', nsqfLevel: 6, baseDemand: 5200, baseSupplyRatio: 0.68, source: 'EPFO Payroll' },
    { tradeName: 'AI Model Data Annotator', ncoCode: '3514.02', nsqfLevel: 4, baseDemand: 4100, baseSupplyRatio: 0.75, source: 'NSDC Skill India' },
    { tradeName: 'Cyber Security Assistant', ncoCode: '2529.01', nsqfLevel: 5, baseDemand: 3800, baseSupplyRatio: 0.58, source: 'PLFS Microdata' },
  ],
  'Green Jobs': [
    { tradeName: 'Solar PV Rooftop Technician', ncoCode: '7412.03', nsqfLevel: 4, baseDemand: 5600, baseSupplyRatio: 0.60, source: 'NSDC Skill India' },
    { tradeName: 'Green Hydrogen Plant Operator', ncoCode: '3131.02', nsqfLevel: 5, baseDemand: 3200, baseSupplyRatio: 0.52, source: 'EPFO Payroll' },
    { tradeName: 'Wind Turbine Maintenance Tech', ncoCode: '7412.04', nsqfLevel: 5, baseDemand: 2800, baseSupplyRatio: 0.66, source: 'NCS Portal' },
    { tradeName: 'Biogas & Biofuel Plant Operator', ncoCode: '3132.01', nsqfLevel: 4, baseDemand: 2200, baseSupplyRatio: 0.78, source: 'PLFS Microdata' },
  ],
  'Manufacturing': [
    { tradeName: 'CNC Operator / Programmer', ncoCode: '7223.03', nsqfLevel: 4, baseDemand: 4800, baseSupplyRatio: 0.70, source: 'EPFO Payroll' },
    { tradeName: 'Industrial Robotics & Automation Tech', ncoCode: '7412.07', nsqfLevel: 5, baseDemand: 3400, baseSupplyRatio: 0.55, source: 'NCS Portal' },
    { tradeName: 'Tool & Die Maker', ncoCode: '7222.01', nsqfLevel: 5, baseDemand: 3100, baseSupplyRatio: 0.62, source: 'NSDC Skill India' },
    { tradeName: 'Advanced Welder & Arc Specialist', ncoCode: '7212.01', nsqfLevel: 3, baseDemand: 4200, baseSupplyRatio: 0.88, source: 'PLFS Microdata' },
  ],
  'Healthcare': [
    { tradeName: 'Geriatric Care Assistant', ncoCode: '5322.01', nsqfLevel: 4, baseDemand: 4500, baseSupplyRatio: 0.65, source: 'NSDC Skill India' },
    { tradeName: 'General Duty Hospital Assistant', ncoCode: '5321.01', nsqfLevel: 4, baseDemand: 5100, baseSupplyRatio: 0.82, source: 'PLFS Microdata' },
    { tradeName: 'Dialysis & Critical Care Tech', ncoCode: '3211.02', nsqfLevel: 5, baseDemand: 2600, baseSupplyRatio: 0.60, source: 'EPFO Payroll' },
    { tradeName: 'Emergency Medical Technician (EMT)', ncoCode: '3258.01', nsqfLevel: 5, baseDemand: 2900, baseSupplyRatio: 0.68, source: 'NCS Portal' },
  ],
  'Agriculture': [
    { tradeName: 'Agri Drone Pilot & Survey Operator', ncoCode: '8341.02', nsqfLevel: 4, baseDemand: 3600, baseSupplyRatio: 0.72, source: 'NSDC Skill India' },
    { tradeName: 'Micro-Irrigation & Drip Automation Tech', ncoCode: '7126.02', nsqfLevel: 3, baseDemand: 2900, baseSupplyRatio: 0.85, source: 'PLFS Microdata' },
    { tradeName: 'Cold Storage Facility Operator', ncoCode: '3131.05', nsqfLevel: 4, baseDemand: 3200, baseSupplyRatio: 0.68, source: 'EPFO Payroll' },
    { tradeName: 'Organic Farming & Soil Health Tech', ncoCode: '6111.01', nsqfLevel: 4, baseDemand: 2500, baseSupplyRatio: 0.92, source: 'NCS Portal' },
  ],
  'Logistics': [
    { tradeName: 'Warehouse Logistics Associate', ncoCode: '9621.01', nsqfLevel: 3, baseDemand: 4900, baseSupplyRatio: 0.88, source: 'NCS Portal' },
    { tradeName: 'Cold Chain Fleet Operator', ncoCode: '8332.01', nsqfLevel: 4, baseDemand: 3300, baseSupplyRatio: 0.70, source: 'EPFO Payroll' },
    { tradeName: 'Supply Chain Inventory Coordinator', ncoCode: '4321.01', nsqfLevel: 4, baseDemand: 3700, baseSupplyRatio: 0.76, source: 'NSDC Skill India' },
    { tradeName: 'Forklift & Reach Truck Operator', ncoCode: '8344.01', nsqfLevel: 3, baseDemand: 2800, baseSupplyRatio: 0.84, source: 'PLFS Microdata' },
  ],
  'Hospitality': [
    { tradeName: 'Hospitality Operations Associate', ncoCode: '5123.02', nsqfLevel: 4, baseDemand: 4400, baseSupplyRatio: 0.80, source: 'PLFS Microdata' },
    { tradeName: 'Commis Chef & Culinary Assistant', ncoCode: '5122.01', nsqfLevel: 4, baseDemand: 3600, baseSupplyRatio: 0.75, source: 'NSDC Skill India' },
    { tradeName: 'Food & Beverage Service Steward', ncoCode: '5131.01', nsqfLevel: 3, baseDemand: 4200, baseSupplyRatio: 0.90, source: 'NCS Portal' },
    { tradeName: 'Ecotourism & Heritage Travel Guide', ncoCode: '5113.01', nsqfLevel: 4, baseDemand: 2400, baseSupplyRatio: 0.82, source: 'EPFO Payroll' },
  ],
  'Construction': [
    { tradeName: 'Construction Electrician & Wireman', ncoCode: '7411.01', nsqfLevel: 4, baseDemand: 5200, baseSupplyRatio: 0.78, source: 'NCS Portal' },
    { tradeName: 'BIM Modeler & Digital Draughtsman', ncoCode: '3118.01', nsqfLevel: 5, baseDemand: 3100, baseSupplyRatio: 0.58, source: 'EPFO Payroll' },
    { tradeName: 'Heavy Equipment Operator', ncoCode: '8342.01', nsqfLevel: 4, baseDemand: 3700, baseSupplyRatio: 0.72, source: 'NSDC Skill India' },
    { tradeName: 'HVAC & Ducting Technician', ncoCode: '7127.01', nsqfLevel: 4, baseDemand: 3400, baseSupplyRatio: 0.70, source: 'PLFS Microdata' },
  ],
  'Retail': [
    { tradeName: 'Retail Sales & Customer Associate', ncoCode: '5223.01', nsqfLevel: 3, baseDemand: 5500, baseSupplyRatio: 0.95, source: 'PLFS Microdata' },
    { tradeName: 'E-Commerce Merchandising Associate', ncoCode: '5244.01', nsqfLevel: 4, baseDemand: 3800, baseSupplyRatio: 0.74, source: 'EPFO Payroll' },
    { tradeName: 'Visual Merchandiser & Store Stylist', ncoCode: '5249.01', nsqfLevel: 4, baseDemand: 2600, baseSupplyRatio: 0.80, source: 'NSDC Skill India' },
    { tradeName: 'Store Operations Supervisor', ncoCode: '5222.01', nsqfLevel: 5, baseDemand: 2900, baseSupplyRatio: 0.85, source: 'NCS Portal' },
  ],
  'Automotive': [
    { tradeName: 'EV Automotive Service Technician', ncoCode: '7231.01', nsqfLevel: 5, baseDemand: 5800, baseSupplyRatio: 0.62, source: 'EPFO Payroll' },
    { tradeName: 'Automotive Mechatronics Specialist', ncoCode: '7231.02', nsqfLevel: 5, baseDemand: 3500, baseSupplyRatio: 0.60, source: 'NCS Portal' },
    { tradeName: 'EV Battery Testing & Assembly Tech', ncoCode: '7412.06', nsqfLevel: 4, baseDemand: 3900, baseSupplyRatio: 0.55, source: 'NSDC Skill India' },
    { tradeName: 'Commercial Vehicle Fleet Mechanic', ncoCode: '7231.03', nsqfLevel: 4, baseDemand: 4100, baseSupplyRatio: 0.82, source: 'PLFS Microdata' },
  ],
  'Electronics': [
    { tradeName: 'Semiconductor Assembly & Test Tech', ncoCode: '8212.01', nsqfLevel: 5, baseDemand: 4600, baseSupplyRatio: 0.48, source: 'EPFO Payroll' },
    { tradeName: 'PCB Surface Mount Tech Operator', ncoCode: '8212.02', nsqfLevel: 4, baseDemand: 3900, baseSupplyRatio: 0.65, source: 'NCS Portal' },
    { tradeName: 'Smart Consumer Device Repair Tech', ncoCode: '7422.01', nsqfLevel: 4, baseDemand: 3700, baseSupplyRatio: 0.78, source: 'NSDC Skill India' },
    { tradeName: 'IoT Device & Sensor Specialist', ncoCode: '3114.01', nsqfLevel: 5, baseDemand: 2800, baseSupplyRatio: 0.58, source: 'PLFS Microdata' },
  ],
};

const UPDATE_TIMESTAMPS = ['2 hours ago', '4 hours ago', '6 hours ago', '1 day ago', '2 days ago', '3 days ago'];

/**
 * Builds the comprehensive dataset ensuring that EVERY state and EVERY sector combination
 * is guaranteed to have rich, valid data records.
 */
function buildDemandSupplyCatalog(): ExplorerRecord[] {
  const records: ExplorerRecord[] = [];
  let recordCounter = 1;

  STATE_PROFILES.forEach((st) => {
    ALL_SECTORS_LIST.forEach((sectorName) => {
      const templates = SECTOR_TRADE_TEMPLATES[sectorName] || [];
      if (templates.length === 0) return;

      // Primary trade for this state + sector combination
      const t1 = templates[0];
      const demand1 = Math.max(250, Math.round(t1.baseDemand * st.scaleFactor));
      const trained1 = Math.max(180, Math.round(demand1 * t1.baseSupplyRatio));
      const gap1 = demand1 - trained1;
      let status1: SupplyStatus = 'Balanced';
      if (gap1 > 1500) status1 = 'Undersupply'; // Acute Undersupply
      else if (gap1 > 300) status1 = 'Undersupply';
      else if (gap1 < -300) status1 = 'Oversupply';

      const updateTs1 = UPDATE_TIMESTAMPS[recordCounter % UPDATE_TIMESTAMPS.length];

      records.push({
        id: `rec-${recordCounter++}`,
        ncoCode: t1.ncoCode,
        tradeName: t1.tradeName,
        nsqfLevel: t1.nsqfLevel,
        sector: sectorName,
        state: st.name,
        district: st.primaryDistrict,
        annualDemand: demand1,
        annualTrained: trained1,
        gap: gap1,
        status: status1,
        source: t1.source,
        lastUpdated: updateTs1,
      });

      // For larger states (scaleFactor >= 0.85), provide a secondary trade in the same sector
      if (st.scaleFactor >= 0.85 && templates.length > 1) {
        const t2 = templates[1];
        const district2 = st.secondaryDistrict || st.primaryDistrict;
        const demand2 = Math.max(200, Math.round(t2.baseDemand * st.scaleFactor * 0.85));
        const trained2 = Math.max(150, Math.round(demand2 * (t2.baseSupplyRatio + 0.05)));
        const gap2 = demand2 - trained2;
        let status2: SupplyStatus = 'Balanced';
        if (gap2 > 1500) status2 = 'Undersupply';
        else if (gap2 > 300) status2 = 'Undersupply';
        else if (gap2 < -300) status2 = 'Oversupply';

        const updateTs2 = UPDATE_TIMESTAMPS[(recordCounter + 2) % UPDATE_TIMESTAMPS.length];

        records.push({
          id: `rec-${recordCounter++}`,
          ncoCode: t2.ncoCode,
          tradeName: t2.tradeName,
          nsqfLevel: t2.nsqfLevel,
          sector: sectorName,
          state: st.name,
          district: district2,
          annualDemand: demand2,
          annualTrained: trained2,
          gap: gap2,
          status: status2,
          source: t2.source,
          lastUpdated: updateTs2,
        });
      }
    });
  });

  return records;
}

export const COMPREHENSIVE_DEMAND_SUPPLY_RECORDS: ExplorerRecord[] = buildDemandSupplyCatalog();

/**
 * Filter helper that supports any state, sector, and free-text search combination
 */
export function filterDemandSupplyRecords(
  records: ExplorerRecord[],
  stateFilter: string,
  sectorFilter: string,
  searchQuery: string = ''
): ExplorerRecord[] {
  const q = searchQuery.trim().toLowerCase();

  return records.filter((rec) => {
    const matchesState = stateFilter === 'All States' || rec.state === stateFilter;
    const matchesSector = sectorFilter === 'All Sectors' || rec.sector === sectorFilter;
    const matchesSearch =
      !q ||
      rec.tradeName.toLowerCase().includes(q) ||
      rec.district.toLowerCase().includes(q) ||
      rec.state.toLowerCase().includes(q) ||
      rec.sector.toLowerCase().includes(q) ||
      rec.ncoCode.includes(q);

    return matchesState && matchesSector && matchesSearch;
  });
}
