import json
from pathlib import Path
from backend.config import settings

def build_lgd_master():
    """Compiles canonical LGD district records with coordinates, state parents, and historical aliases."""
    districts = [
        # --- UTTAR PRADESH (State LGD: 9) ---
        {
            "district_lgd_code": 158, "district_name": "Kanpur Nagar", "state_lgd_code": 9, "state_name": "Uttar Pradesh",
            "latitude": 26.4499, "longitude": 80.3319, "tier": "Tier-2", "cluster_type": "Manufacturing, Leather & Solar Hub",
            "aliases": ["kanpur", "cawnpore", "kanpur city", "kanpur nagar"]
        },
        {
            "district_lgd_code": 160, "district_name": "Lucknow", "state_lgd_code": 9, "state_name": "Uttar Pradesh",
            "latitude": 26.8467, "longitude": 80.9462, "tier": "Tier-1", "cluster_type": "State Capital, IT-ITeS & Healthcare",
            "aliases": ["lko", "lucknow", "laxmanpuri"]
        },
        {
            "district_lgd_code": 184, "district_name": "Varanasi", "state_lgd_code": 9, "state_name": "Uttar Pradesh",
            "latitude": 25.3176, "longitude": 82.9739, "tier": "Tier-2", "cluster_type": "Handloom, Tourism & Micro-solar",
            "aliases": ["kashi", "banaras", "benares", "varanasi"]
        },
        {
            "district_lgd_code": 148, "district_name": "Gautam Buddha Nagar", "state_lgd_code": 9, "state_name": "Uttar Pradesh",
            "latitude": 28.5355, "longitude": 77.3910, "tier": "Tier-1", "cluster_type": "Electronics, EV & Software Hub",
            "aliases": ["noida", "greater noida", "gb nagar", "gautam budh nagar"]
        },
        {
            "district_lgd_code": 149, "district_name": "Ghaziabad", "state_lgd_code": 9, "state_name": "Uttar Pradesh",
            "latitude": 28.6692, "longitude": 77.4538, "tier": "Tier-2", "cluster_type": "Heavy Engineering & Automotive Spares",
            "aliases": ["ghaziabad", "gzb"]
        },
        {
            "district_lgd_code": 126, "district_name": "Prayagraj", "state_lgd_code": 9, "state_name": "Uttar Pradesh",
            "latitude": 25.4358, "longitude": 81.8463, "tier": "Tier-2", "cluster_type": "Education, Services & Agro-processing",
            "aliases": ["allahabad", "prayag", "prayagraj"]
        },
        {
            "district_lgd_code": 124, "district_name": "Agra", "state_lgd_code": 9, "state_name": "Uttar Pradesh",
            "latitude": 27.1767, "longitude": 78.0081, "tier": "Tier-2", "cluster_type": "Footwear, Foundries & Hospitality",
            "aliases": ["agra", "taj city"]
        },
        {
            "district_lgd_code": 163, "district_name": "Meerut", "state_lgd_code": 9, "state_name": "Uttar Pradesh",
            "latitude": 28.9845, "longitude": 77.7064, "tier": "Tier-2", "cluster_type": "Sports Goods, Auto Ancillary & Textiles",
            "aliases": ["meerut"]
        },
        {
            "district_lgd_code": 151, "district_name": "Gorakhpur", "state_lgd_code": 9, "state_name": "Uttar Pradesh",
            "latitude": 26.7606, "longitude": 83.3732, "tier": "Tier-2", "cluster_type": "Industrial Corridor, Logistics & Health",
            "aliases": ["gorakhpur", "gkp"]
        },
        {
            "district_lgd_code": 180, "district_name": "Sonbhadra", "state_lgd_code": 9, "state_name": "Uttar Pradesh",
            "latitude": 24.6850, "longitude": 83.0683, "tier": "Tier-3", "cluster_type": "Power Generation, Mining & Solar Parks",
            "aliases": ["sonbhadra", "sonebhadra"]
        },
        {
            "district_lgd_code": 155, "district_name": "Jhansi", "state_lgd_code": 9, "state_name": "Uttar Pradesh",
            "latitude": 25.4484, "longitude": 78.5685, "tier": "Tier-3", "cluster_type": "Defense Corridor & Heavy Machinery",
            "aliases": ["jhansi"]
        },
        {
            "district_lgd_code": 125, "district_name": "Aligarh", "state_lgd_code": 9, "state_name": "Uttar Pradesh",
            "latitude": 27.8974, "longitude": 78.0880, "tier": "Tier-2", "cluster_type": "Lock Hardware, Metal Casting & Education",
            "aliases": ["aligarh"]
        },
        {
            "district_lgd_code": 132, "district_name": "Bareilly", "state_lgd_code": 9, "state_name": "Uttar Pradesh",
            "latitude": 28.3670, "longitude": 79.4304, "tier": "Tier-2", "cluster_type": "Wood Craft, Zari Zardozi & Agro",
            "aliases": ["bareilly"]
        },
        {
            "district_lgd_code": 165, "district_name": "Mirzapur", "state_lgd_code": 9, "state_name": "Uttar Pradesh",
            "latitude": 25.1337, "longitude": 82.5644, "tier": "Tier-3", "cluster_type": "Carpet Weaving, Brassware & Green Jobs",
            "aliases": ["mirzapur"]
        },
        {
            "district_lgd_code": 145, "district_name": "Ayodhya", "state_lgd_code": 9, "state_name": "Uttar Pradesh",
            "latitude": 26.7922, "longitude": 82.1998, "tier": "Tier-2", "cluster_type": "Hospitality, Logistics & Solar City",
            "aliases": ["faizabad", "ayodhya"]
        },

        # --- MAHARASHTRA (State LGD: 27) ---
        {
            "district_lgd_code": 492, "district_name": "Pune", "state_lgd_code": 27, "state_name": "Maharashtra",
            "latitude": 18.5204, "longitude": 73.8567, "tier": "Tier-1", "cluster_type": "Automotive, EV Manufacturing & IT",
            "aliases": ["pune", "poona", "punyanagari"]
        },
        {
            "district_lgd_code": 485, "district_name": "Mumbai", "state_lgd_code": 27, "state_name": "Maharashtra",
            "latitude": 18.9388, "longitude": 72.8354, "tier": "Tier-1", "cluster_type": "Finance, Ports, Healthcare & Services",
            "aliases": ["mumbai", "bombay", "mumbai city"]
        },
        {
            "district_lgd_code": 486, "district_name": "Mumbai Suburban", "state_lgd_code": 27, "state_name": "Maharashtra",
            "latitude": 19.1136, "longitude": 72.8697, "tier": "Tier-1", "cluster_type": "Media, IT-ITeS & Retail Logistics",
            "aliases": ["mumbai suburban", "suburban mumbai"]
        },
        {
            "district_lgd_code": 497, "district_name": "Thane", "state_lgd_code": 27, "state_name": "Maharashtra",
            "latitude": 19.2183, "longitude": 72.9781, "tier": "Tier-1", "cluster_type": "Chemicals, Precision Engineering & Logistics",
            "aliases": ["thane", "thana"]
        },
        {
            "district_lgd_code": 488, "district_name": "Nagpur", "state_lgd_code": 27, "state_name": "Maharashtra",
            "latitude": 21.1458, "longitude": 79.0882, "tier": "Tier-2", "cluster_type": "MIHAN Cargo, Defense & Electronics",
            "aliases": ["nagpur", "orange city"]
        },
        {
            "district_lgd_code": 490, "district_name": "Nashik", "state_lgd_code": 27, "state_name": "Maharashtra",
            "latitude": 19.9975, "longitude": 73.7898, "tier": "Tier-2", "cluster_type": "Auto Ancillary, Electrical Equipment & Agro",
            "aliases": ["nashik", "nasik"]
        },
        {
            "district_lgd_code": 467, "district_name": "Chhatrapati Sambhaji Nagar", "state_lgd_code": 27, "state_name": "Maharashtra",
            "latitude": 19.8762, "longitude": 75.3433, "tier": "Tier-2", "cluster_type": "AURIC Smart City, Auto & Pharma",
            "aliases": ["aurangabad", "chhatrapati sambhaji nagar", "sambhajinagar"]
        },
        {
            "district_lgd_code": 479, "district_name": "Kolhapur", "state_lgd_code": 27, "state_name": "Maharashtra",
            "latitude": 16.7050, "longitude": 74.2433, "tier": "Tier-2", "cluster_type": "Foundry, Auto Forging & Sugar Processing",
            "aliases": ["kolhapur"]
        },
        {
            "district_lgd_code": 496, "district_name": "Solapur", "state_lgd_code": 27, "state_name": "Maharashtra",
            "latitude": 17.6599, "longitude": 75.9064, "tier": "Tier-2", "cluster_type": "Textiles, Garments & Solar Energy",
            "aliases": ["solapur", "sholapur"]
        },
        {
            "district_lgd_code": 475, "district_name": "Gadchiroli", "state_lgd_code": 27, "state_name": "Maharashtra",
            "latitude": 20.1809, "longitude": 80.0022, "tier": "Tier-3", "cluster_type": "Mining, Forest Produce & Tribal Crafts",
            "aliases": ["gadchiroli"]
        },
        {
            "district_lgd_code": 465, "district_name": "Ahilyanagar", "state_lgd_code": 27, "state_name": "Maharashtra",
            "latitude": 19.0948, "longitude": 74.7480, "tier": "Tier-3", "cluster_type": "Agro-processing, Wind & Solar Power",
            "aliases": ["ahmednagar", "ahilyanagar"]
        },
        {
            "district_lgd_code": 491, "district_name": "Raigad", "state_lgd_code": 27, "state_name": "Maharashtra",
            "latitude": 18.5158, "longitude": 73.1822, "tier": "Tier-2", "cluster_type": "Steel, Ports (JNPT), Petrochemicals",
            "aliases": ["raigad", "raigarh maharashtra"]
        },

        # --- ODISHA (State LGD: 21) ---
        {
            "district_lgd_code": 365, "district_name": "Khordha", "state_lgd_code": 21, "state_name": "Odisha",
            "latitude": 20.1812, "longitude": 85.6170, "tier": "Tier-2", "cluster_type": "State Capital (Bhubaneswar), IT & Healthcare",
            "aliases": ["khordha", "bhubaneswar", "khurda", "bbsr"]
        },
        {
            "district_lgd_code": 354, "district_name": "Cuttack", "state_lgd_code": 21, "state_name": "Odisha",
            "latitude": 20.4625, "longitude": 85.8828, "tier": "Tier-2", "cluster_type": "Logistics, Silver Filigree, Heavy Spares",
            "aliases": ["cuttack", "katak"]
        },
        {
            "district_lgd_code": 376, "district_name": "Sundargarh", "state_lgd_code": 21, "state_name": "Odisha",
            "latitude": 22.1200, "longitude": 84.0300, "tier": "Tier-2", "cluster_type": "Steel (Rourkela Steel Plant), Mining & Metal",
            "aliases": ["sundargarh", "rourkela", "sundergarh"]
        },
        {
            "district_lgd_code": 359, "district_name": "Ganjam", "state_lgd_code": 21, "state_name": "Odisha",
            "latitude": 19.3800, "longitude": 84.9900, "tier": "Tier-3", "cluster_type": "Gopalpur Port, Rare Earths & Fisheries",
            "aliases": ["ganjam", "berhampur", "brahmapur"]
        },
        {
            "district_lgd_code": 374, "district_name": "Sambalpur", "state_lgd_code": 21, "state_name": "Odisha",
            "latitude": 21.4669, "longitude": 83.9812, "tier": "Tier-2", "cluster_type": "Aluminium (MCL), Handloom & Power",
            "aliases": ["sambalpur"]
        },
        {
            "district_lgd_code": 348, "district_name": "Angul", "state_lgd_code": 21, "state_name": "Odisha",
            "latitude": 20.8400, "longitude": 85.1000, "tier": "Tier-3", "cluster_type": "Thermal Power (NTPC), Aluminium & Coal",
            "aliases": ["angul", "anugul"]
        },
        {
            "district_lgd_code": 363, "district_name": "Jajpur", "state_lgd_code": 21, "state_name": "Odisha",
            "latitude": 20.8500, "longitude": 86.3300, "tier": "Tier-2", "cluster_type": "Kalinganagar Steel Hub, Ferro-alloys",
            "aliases": ["jajpur", "kalinganagar"]
        },
        {
            "district_lgd_code": 349, "district_name": "Balasore", "state_lgd_code": 21, "state_name": "Odisha",
            "latitude": 21.4934, "longitude": 86.9135, "tier": "Tier-3", "cluster_type": "Missile Testing (ITR), Plastics & Sea Food",
            "aliases": ["balasore", "baleswar"]
        },
        {
            "district_lgd_code": 366, "district_name": "Kendujhar", "state_lgd_code": 21, "state_name": "Odisha",
            "latitude": 21.6300, "longitude": 85.5800, "tier": "Tier-3", "cluster_type": "Iron Ore Mining, Heavy Earthmoving Spares",
            "aliases": ["keonjhar", "kendujhar"]
        },
        {
            "district_lgd_code": 364, "district_name": "Jharsuguda", "state_lgd_code": 21, "state_name": "Odisha",
            "latitude": 21.8500, "longitude": 84.0000, "tier": "Tier-3", "cluster_type": "Aluminium Smelters (Vedanta), Power, Rail",
            "aliases": ["jharsuguda"]
        },
        {
            "district_lgd_code": 367, "district_name": "Koraput", "state_lgd_code": 21, "state_name": "Odisha",
            "latitude": 18.8100, "longitude": 82.7100, "tier": "Tier-3", "cluster_type": "Aero-engines (HAL Sunabeda), Bauxite (NALCO)",
            "aliases": ["koraput", "sunabeda"]
        },

        # --- NATIONAL BENCHMARK METROS (Macro Context) ---
        {
            "district_lgd_code": 85, "district_name": "New Delhi", "state_lgd_code": 7, "state_name": "Delhi",
            "latitude": 28.6139, "longitude": 77.2090, "tier": "Tier-1", "cluster_type": "National Capital, Commercial Services & Policy",
            "aliases": ["delhi", "new delhi", "nct of delhi"]
        },
        {
            "district_lgd_code": 533, "district_name": "Bengaluru Urban", "state_lgd_code": 29, "state_name": "Karnataka",
            "latitude": 12.9716, "longitude": 77.5946, "tier": "Tier-1", "cluster_type": "Software, Aerospace & Deep Tech",
            "aliases": ["bangalore", "bengaluru", "bengaluru urban"]
        },
        {
            "district_lgd_code": 500, "district_name": "Hyderabad", "state_lgd_code": 36, "state_name": "Telangana",
            "latitude": 17.3850, "longitude": 78.4867, "tier": "Tier-1", "cluster_type": "Pharma, Biotech & IT Services",
            "aliases": ["hyderabad", "hyd", "cyberabad"]
        }
    ]

    out_file = settings.MASTER_DATA_PATH / "lgd_districts.json"
    out_file.parent.mkdir(parents=True, exist_ok=True)
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({"total_districts": len(districts), "districts": districts}, f, indent=2)
    print(f"Generated LGD master: {len(districts)} districts -> {out_file}")

def build_nco_catalog():
    """Compiles canonical NCO-2015 8-digit occupational codes across the 4 pilot sectors."""
    occupations = [
        # --- SECTOR 1: GREEN ENERGY & SOLAR PV (SCGJ) ---
        {
            "nco_code": "7411.0101",
            "title": "Solar PV Installation & Maintenance Technician",
            "division_code": "7", "division_name": "Craft and Related Trades Workers",
            "sub_division": "74", "sub_division_name": "Electrical and Electronic Trades Workers",
            "sector_name": "Green Energy & Solar PV",
            "nsqf_level": 4,
            "description": "Assembles, mounts, wires, tests, and commissions rooftop and utility-scale solar photovoltaic panels, inverters, and battery storage systems.",
            "core_competencies": ["PV Module Mounting", "Inverter Wiring", "Grid Synchronization", "Earthing & Surge Protection", "I-V Curve Testing"],
            "growth_category": "Sunrise / High Demand"
        },
        {
            "nco_code": "7411.0102",
            "title": "Rooftop Solar Plant Assembler",
            "division_code": "7", "division_name": "Craft and Related Trades Workers",
            "sub_division": "74", "sub_division_name": "Electrical and Electronic Trades Workers",
            "sector_name": "Green Energy & Solar PV",
            "nsqf_level": 3,
            "description": "Performs mechanical racking, structure anchoring, and conduit runs for domestic and commercial rooftop solar installations.",
            "core_competencies": ["Roof Penetration Waterproofing", "Clamp Fixing", "Conduit Bending", "Safety Harness Handling"],
            "growth_category": "Sunrise / High Demand"
        },
        {
            "nco_code": "3131.0201",
            "title": "Microgrid & Solar Sub-Station Operator",
            "division_code": "3", "division_name": "Technicians and Associate Professionals",
            "sub_division": "31", "sub_division_name": "Science and Engineering Associate Professionals",
            "sector_name": "Green Energy & Solar PV",
            "nsqf_level": 5,
            "description": "Operates centralized SCADA panels, load switchgear, and battery management systems in decentralized microgrids.",
            "core_competencies": ["SCADA Monitoring", "Battery Energy Storage Systems (BESS)", "Fault Isolation", "Load Shedding Logic"],
            "growth_category": "Sunrise / High Demand"
        },
        {
            "nco_code": "7126.0301",
            "title": "Solar Thermal & Pump Installer",
            "division_code": "7", "division_name": "Craft and Related Trades Workers",
            "sub_division": "71", "sub_division_name": "Building and Related Trades Workers",
            "sector_name": "Green Energy & Solar PV",
            "nsqf_level": 4,
            "description": "Installs solar-powered agricultural water pump sets, evacuated tube collectors, and solar water heating infrastructure.",
            "core_competencies": ["Solar Pump VFD Configuration", "Piping & Hydraulics", "Controller Troubleshooting"],
            "growth_category": "Moderate Growth"
        },

        # --- SECTOR 2: AUTOMOTIVE & EV DIAGNOSTICS (ASDC) ---
        {
            "nco_code": "7231.0102",
            "title": "Automotive Service Technician (Electric Vehicle)",
            "division_code": "7", "division_name": "Craft and Related Trades Workers",
            "sub_division": "72", "sub_division_name": "Metal, Machinery and Related Trades Workers",
            "sector_name": "Automotive & EV Diagnostics",
            "nsqf_level": 4,
            "description": "Diagnoses, services, and repairs high-voltage powertrain, lithium-ion battery modules, motor controllers, and regenerative braking in EVs.",
            "core_competencies": ["High Voltage Safety (OSHA/IS)", "CAN Bus Telematics", "BMS Diagnostic Scanning", "Electric Motor Insulation Test"],
            "growth_category": "Sunrise / High Demand"
        },
        {
            "nco_code": "7223.0501",
            "title": "CNC Machinist & Precision Operator",
            "division_code": "7", "division_name": "Craft and Related Trades Workers",
            "sub_division": "72", "sub_division_name": "Metal, Machinery and Related Trades Workers",
            "sector_name": "Automotive & EV Diagnostics",
            "nsqf_level": 4,
            "description": "Sets up, programs, and operates computer numerical control (CNC) multi-axis milling and turning centers to produce precision automotive components.",
            "core_competencies": ["G-Code / M-Code Programming", "Micrometer & Vernier Caliper Metrology", "Tool Offset Setting", "Surface Finish Inspection"],
            "growth_category": "Steady Industrial Demand"
        },
        {
            "nco_code": "7212.0100",
            "title": "Automotive Robotic Welding Operator",
            "division_code": "7", "division_name": "Craft and Related Trades Workers",
            "sub_division": "72", "sub_division_name": "Metal, Machinery and Related Trades Workers",
            "sector_name": "Automotive & EV Diagnostics",
            "nsqf_level": 4,
            "description": "Monitors and operates robotic spot and MIG welding fixtures on high-speed vehicle assembly lines.",
            "core_competencies": ["Teach Pendant Robot Jogging", "Weld Seam Quality Audit", "Shielding Gas Regulation", "Electrode Dressing"],
            "growth_category": "High Demand"
        },
        {
            "nco_code": "7231.0100",
            "title": "Four-Wheeler Conventional Mechanic",
            "division_code": "7", "division_name": "Craft and Related Trades Workers",
            "sub_division": "72", "sub_division_name": "Metal, Machinery and Related Trades Workers",
            "sector_name": "Automotive & EV Diagnostics",
            "nsqf_level": 3,
            "description": "Services traditional internal combustion engine (ICE) cooling, lubrication, fuel injection, and clutch systems.",
            "core_competencies": ["Engine Overhaul", "Carburetor / Injector Cleaning", "Brake Bleeding", "Gearbox Dismantling"],
            "growth_category": "Transitioning / Low Growth"
        },

        # --- SECTOR 3: HEALTHCARE & ALLIED CARE (HSSC) ---
        {
            "nco_code": "5321.0100",
            "title": "General Duty Assistant (GDA)",
            "division_code": "5", "division_name": "Services and Sales Workers",
            "sub_division": "53", "sub_division_name": "Personal Care Workers",
            "sector_name": "Healthcare & Allied Care",
            "nsqf_level": 4,
            "description": "Assists registered nurses and physicians in patient transport, vital sign monitoring, bed-side care, and clinical hygiene in hospitals.",
            "core_competencies": ["Vital Signs Recording (BP, SpO2, Pulse)", "Infection Prevention & Sterilization", "Patient Mobility Support", "Biomedical Waste Disposal"],
            "growth_category": "Critical Shortage / High Demand"
        },
        {
            "nco_code": "5322.0101",
            "title": "Home Health Aide & Geriatric Caregiver",
            "division_code": "5", "division_name": "Services and Sales Workers",
            "sub_division": "53", "sub_division_name": "Personal Care Workers",
            "sector_name": "Healthcare & Allied Care",
            "nsqf_level": 4,
            "description": "Provides specialized geriatric home-based rehabilitation, medication compliance monitoring, and palliative assistance for elderly citizens.",
            "core_competencies": ["Geriatric Fall Prevention", "Enteral Feeding Assistance", "Dementia Patient Communication", "First Aid & CPR"],
            "growth_category": "High Demand"
        },
        {
            "nco_code": "3212.0100",
            "title": "Medical Laboratory Technician",
            "division_code": "3", "division_name": "Technicians and Associate Professionals",
            "sub_division": "32", "sub_division_name": "Health Associate Professionals",
            "sector_name": "Healthcare & Allied Care",
            "nsqf_level": 5,
            "description": "Performs diagnostic biochemistry, hematology, and microbiological sampling and automated analyzer operation in clinical diagnostic labs.",
            "core_competencies": ["Phlebotomy Sampling", "Automated Hematology Analyzer", "Microscopy Staining", "NABL Quality Control Logs"],
            "growth_category": "High Demand"
        },
        {
            "nco_code": "3258.0100",
            "title": "Emergency Medical Technician (EMT)",
            "division_code": "3", "division_name": "Technicians and Associate Professionals",
            "sub_division": "32", "sub_division_name": "Health Associate Professionals",
            "sector_name": "Healthcare & Allied Care",
            "nsqf_level": 5,
            "description": "Operates Advanced Life Support (ALS) ambulances, stabilizes trauma patients, and administers emergency oxygen therapy.",
            "core_competencies": ["Defibrillator (AED) Operation", "Cervical Collar Spinal Immobilization", "Oxygen Delivery Systems", "Triage Assessment"],
            "growth_category": "High Demand"
        },

        # --- SECTOR 4: IT-ITeS & DIGITAL SERVICES (NASSCOM) ---
        {
            "nco_code": "4132.0100",
            "title": "Domestic Data Entry Operator (DEO)",
            "division_code": "4", "division_name": "Clerical Support Workers",
            "sub_division": "41", "sub_division_name": "General and Keyboard Clerks",
            "sector_name": "IT-ITeS & Digital Services",
            "nsqf_level": 3,
            "description": "Enters alphabetic and numeric data into computer terminal databases from physical ledgers and forms with basic accuracy checks.",
            "core_competencies": ["Typing Speed 30 WPM", "MS Word / Excel Entry", "Basic Office Filing", "Data Verification"],
            "growth_category": "Severe Oversupply / Saturated"
        },
        {
            "nco_code": "3512.0101",
            "title": "Cloud Computing Infrastructure Support Associate",
            "division_code": "3", "division_name": "Technicians and Associate Professionals",
            "sub_division": "35", "sub_division_name": "Information and Communications Technology Technicians",
            "sector_name": "IT-ITeS & Digital Services",
            "nsqf_level": 5,
            "description": "Monitors virtual servers, storage containers, identity access permissions, and ticket escalations on cloud platforms.",
            "core_competencies": ["Linux CLI Operations", "Cloud IAM Configuration", "Virtual Network Troubleshooting", "SLA Incident Escalation"],
            "growth_category": "High Demand"
        },
        {
            "nco_code": "3513.0100",
            "title": "Cybersecurity SOC Analyst (L1)",
            "division_code": "3", "division_name": "Technicians and Associate Professionals",
            "sub_division": "35", "sub_division_name": "Information and Communications Technology Technicians",
            "sector_name": "IT-ITeS & Digital Services",
            "nsqf_level": 5,
            "description": "Triages Security Information and Event Management (SIEM) alerts, detects phishing attempts, and reports firewall anomalies.",
            "core_competencies": ["SIEM Log Analysis", "Phishing Header Inspection", "Firewall Rule Checking", "Endpoint Threat Isolation"],
            "growth_category": "Critical Shortage / High Demand"
        },
        {
            "nco_code": "3514.0201",
            "title": "AI Model Data Annotator & Prompt Verifier",
            "division_code": "3", "division_name": "Technicians and Associate Professionals",
            "sub_division": "35", "sub_division_name": "Information and Communications Technology Technicians",
            "sector_name": "IT-ITeS & Digital Services",
            "nsqf_level": 4,
            "description": "Tags complex multimodal image bounding boxes, annotates named entity tokens, and verifies safety and factual alignment for AI models.",
            "core_competencies": ["Semantic Segmentation Tagging", "RLHF Feedback Scoring", "NER Entity Labeling", "Factual Consistency Check"],
            "growth_category": "Sunrise / High Demand"
        }
    ]

    out_file = settings.MASTER_DATA_PATH / "nco_catalog.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({"total_occupations": len(occupations), "occupations": occupations}, f, indent=2)
    print(f"Generated NCO catalog: {len(occupations)} occupations -> {out_file}")

def build_nsqf_crosswalk():
    """Generates crosswalk linking NCO, NSQF, Sector Skill Councils, Qualification Packs (QP), and DGT CTS courses."""
    crosswalk = [
        # Solar PV
        {
            "nco_code": "7411.0101",
            "trade_name": "Solar PV Installation & Maintenance Technician",
            "nsqf_level": 4,
            "sector_code": "SEC_GREEN_JOBS",
            "sector_name": "Green Energy & Solar PV",
            "ssc_code": "SCGJ",
            "ssc_name": "Skill Council for Green Jobs",
            "qp_code": "SGJ/Q0101",
            "qp_name": "Suryamitra (Solar PV Installer - Electrical)",
            "dgt_cts_code": "DGT/1084",
            "training_type": "Short-Term & Long-Term ITI",
            "duration_hours": 300,
            "common_cost_norm_category": "Category-I (Technical)"
        },
        {
            "nco_code": "7411.0102",
            "trade_name": "Rooftop Solar Plant Assembler",
            "nsqf_level": 3,
            "sector_code": "SEC_GREEN_JOBS",
            "sector_name": "Green Energy & Solar PV",
            "ssc_code": "SCGJ",
            "ssc_name": "Skill Council for Green Jobs",
            "qp_code": "SGJ/Q0102",
            "qp_name": "Rooftop Solar Assembler",
            "dgt_cts_code": "DGT/1085",
            "training_type": "Short-Term STT",
            "duration_hours": 200,
            "common_cost_norm_category": "Category-I (Technical)"
        },
        {
            "nco_code": "3131.0201",
            "trade_name": "Microgrid & Solar Sub-Station Operator",
            "nsqf_level": 5,
            "sector_code": "SEC_GREEN_JOBS",
            "sector_name": "Green Energy & Solar PV",
            "ssc_code": "SCGJ",
            "ssc_name": "Skill Council for Green Jobs",
            "qp_code": "SGJ/Q0201",
            "qp_name": "Solar Sub-Station Operator",
            "dgt_cts_code": "DGT/1090",
            "training_type": "Diploma & ITI Advanced",
            "duration_hours": 450,
            "common_cost_norm_category": "Category-I (Technical)"
        },

        # Automotive & EV
        {
            "nco_code": "7231.0102",
            "trade_name": "Automotive Service Technician (Electric Vehicle)",
            "nsqf_level": 4,
            "sector_code": "SEC_AUTOMOTIVE",
            "sector_name": "Automotive & EV Diagnostics",
            "ssc_code": "ASDC",
            "ssc_name": "Automotive Skills Development Council",
            "qp_code": "ASC/Q1411",
            "qp_name": "Automotive Electric Vehicle Service Technician",
            "dgt_cts_code": "DGT/1120",
            "training_type": "ITI 1-Year CTS & STT",
            "duration_hours": 400,
            "common_cost_norm_category": "Category-I (Technical)"
        },
        {
            "nco_code": "7223.0501",
            "trade_name": "CNC Machinist & Precision Operator",
            "nsqf_level": 4,
            "sector_code": "SEC_AUTOMOTIVE",
            "sector_name": "Automotive & EV Diagnostics",
            "ssc_code": "CGSC",
            "ssc_name": "Capital Goods & Automotive SSC",
            "qp_code": "CSC/Q0115",
            "qp_name": "CNC Operator - Turning & Milling",
            "dgt_cts_code": "DGT/0224",
            "training_type": "ITI 2-Year CTS (Machinist)",
            "duration_hours": 1200,
            "common_cost_norm_category": "Category-I (Technical)"
        },

        # Healthcare
        {
            "nco_code": "5321.0100",
            "trade_name": "General Duty Assistant (GDA)",
            "nsqf_level": 4,
            "sector_code": "SEC_HEALTHCARE",
            "sector_name": "Healthcare & Allied Care",
            "ssc_code": "HSSC",
            "ssc_name": "Healthcare Sector Skill Council",
            "qp_code": "HSS/Q5101",
            "qp_name": "General Duty Assistant",
            "dgt_cts_code": "DGT/2041",
            "training_type": "PMKVY STT & ITI Health Sanitary",
            "duration_hours": 360,
            "common_cost_norm_category": "Category-II (Services)"
        },
        {
            "nco_code": "5322.0101",
            "trade_name": "Home Health Aide & Geriatric Caregiver",
            "nsqf_level": 4,
            "sector_code": "SEC_HEALTHCARE",
            "sector_name": "Healthcare & Allied Care",
            "ssc_code": "HSSC",
            "ssc_name": "Healthcare Sector Skill Council",
            "qp_code": "HSS/Q5102",
            "qp_name": "Home Health Aide",
            "dgt_cts_code": "DGT/2045",
            "training_type": "PMKVY STT",
            "duration_hours": 300,
            "common_cost_norm_category": "Category-II (Services)"
        },
        {
            "nco_code": "3212.0100",
            "trade_name": "Medical Laboratory Technician",
            "nsqf_level": 5,
            "sector_code": "SEC_HEALTHCARE",
            "sector_name": "Healthcare & Allied Care",
            "ssc_code": "HSSC",
            "ssc_name": "Healthcare Sector Skill Council",
            "qp_code": "HSS/Q0301",
            "qp_name": "Medical Laboratory Technician",
            "dgt_cts_code": "DGT/2050",
            "training_type": "Diploma & ITI Allied Health",
            "duration_hours": 600,
            "common_cost_norm_category": "Category-I (Technical)"
        },

        # IT-ITeS
        {
            "nco_code": "4132.0100",
            "trade_name": "Domestic Data Entry Operator (DEO)",
            "nsqf_level": 3,
            "sector_code": "SEC_IT_ITES",
            "sector_name": "IT-ITeS & Digital Services",
            "ssc_code": "NASSCOM",
            "ssc_name": "IT-ITeS Sector Skill Council",
            "qp_code": "SSC/Q2212",
            "qp_name": "Domestic Data Entry Operator",
            "dgt_cts_code": "DGT/0150",
            "training_type": "PMKVY STT & COPA ITI",
            "duration_hours": 200,
            "common_cost_norm_category": "Category-II (Services)"
        },
        {
            "nco_code": "3514.0201",
            "trade_name": "AI Model Data Annotator & Prompt Verifier",
            "nsqf_level": 4,
            "sector_code": "SEC_IT_ITES",
            "sector_name": "IT-ITeS & Digital Services",
            "ssc_code": "NASSCOM",
            "ssc_name": "IT-ITeS Sector Skill Council",
            "qp_code": "SSC/Q8102",
            "qp_name": "AI Data Associate",
            "dgt_cts_code": "DGT/0158",
            "training_type": "STT & FutureSkills Prime",
            "duration_hours": 240,
            "common_cost_norm_category": "Category-II (Services)"
        },
        {
            "nco_code": "3513.0100",
            "trade_name": "Cybersecurity SOC Analyst (L1)",
            "nsqf_level": 5,
            "sector_code": "SEC_IT_ITES",
            "sector_name": "IT-ITeS & Digital Services",
            "ssc_code": "NASSCOM",
            "ssc_name": "IT-ITeS Sector Skill Council",
            "qp_code": "SSC/Q0901",
            "qp_name": "Associate Analyst - SOC",
            "dgt_cts_code": "DGT/0160",
            "training_type": "Advanced STT",
            "duration_hours": 400,
            "common_cost_norm_category": "Category-I (Technical)"
        }
    ]

    out_file = settings.MASTER_DATA_PATH / "nsqf_crosswalk.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({"total_crosswalks": len(crosswalk), "crosswalks": crosswalk}, f, indent=2)
    print(f"Generated NSQF crosswalk: {len(crosswalk)} mappings -> {out_file}")

if __name__ == "__main__":
    build_lgd_master()
    build_nco_catalog()
    build_nsqf_crosswalk()
