import { useState, useMemo, useEffect } from 'react'
import './StudentPlacements.css'

// Supported Institutional Academic Departments
export const DEPARTMENTS = [
  'All Departments',
  'Computer Science / IT',
  'Mechanical',
  'Electrical / Electronics',
  'Civil',
  'Chemical',
  'Instrumentation',
  'Automobile',
  'Biotechnology',
  'Aerospace / Multidisciplinary'
]

// Date & Time formatting helper for placement postings
export function formatPostedDateTime(dateInput, postedDaysAgo = 0) {
  let date
  if (!dateInput) {
    const base = new Date('2026-09-18T18:30:00+05:30')
    date = new Date(base.getTime() - (postedDaysAgo || 0) * 86400000)
  } else {
    date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput
  }
  if (isNaN(date.getTime())) return ''

  const day = date.getDate()
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12

  return `Posted ${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`
}

// Application closing deadline formatting helper
export function formatClosingDeadline(deadlineStr, displayDeadline, now = new Date()) {
  if (!deadlineStr) return displayDeadline ? `Closes ${displayDeadline.replace(/^Closes:?\s*/i, '')}` : ''

  let deadlineDate
  if (deadlineStr.includes('T')) {
    deadlineDate = new Date(deadlineStr)
  } else {
    deadlineDate = new Date(`${deadlineStr}T23:59:59`)
  }

  if (isNaN(deadlineDate.getTime())) {
    return displayDeadline ? `Closes ${displayDeadline.replace(/^Closes:?\s*/i, '')}` : ''
  }

  const diffMs = deadlineDate.getTime() - now.getTime()
  if (diffMs <= 0) return 'Closed'

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(totalHours / 24)
  const remainingHours = totalHours % 24
  const remainingMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffMs <= 2 * 24 * 60 * 60 * 1000) {
    if (diffDays >= 1) {
      return `Closes in ${diffDays}d ${remainingHours}h`
    }
    if (remainingHours >= 1) {
      return `Closes in ${remainingHours}h ${remainingMinutes}m`
    }
    return `Closes in ${remainingMinutes}m`
  }

  if (displayDeadline) {
    const cleanDisplay = displayDeadline.replace(/^Closes:?\s*/i, '')
    return `Closes ${cleanDisplay}`
  }

  const day = deadlineDate.getDate().toString().padStart(2, '0')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `Closes ${day} ${months[deadlineDate.getMonth()]} ${deadlineDate.getFullYear()}`
}

export function isUrgentDeadline(deadlineStr, now = new Date()) {
  if (!deadlineStr) return false
  const deadlineDate = deadlineStr.includes('T') ? new Date(deadlineStr) : new Date(`${deadlineStr}T23:59:59`)
  if (isNaN(deadlineDate.getTime())) return false
  const diffMs = deadlineDate.getTime() - now.getTime()
  return diffMs > 0 && diffMs <= 2 * 24 * 60 * 60 * 1000
}

// Comprehensive Verified Campus Placements across ALL Academic Engineering Departments
const INITIAL_PLACEMENTS = [
  {
    id: 'plc_mech_01',
    postedAt: '2026-09-17T14:30:00+05:30',
    postedDateTime: 'Posted 17 Sep 2026, 2:30 PM',
    company: 'Tata Motors',
    companyLogoBg: '#0f4c81',
    companyLogoText: 'TM',
    verifiedCompany: true,
    role: 'Graduate Engineer Trainee (GET) - Mechanical & Robotics',
    department: 'Mechanical',
    category: 'Core Engineering',
    package: '₹12.5 LPA',
    packageAmount: 12.5,
    packageBreakdown: {
      base: '₹10.2 LPA Base Salary',
      variable: '₹1.5 LPA Annual Performance Bonus',
      perks: '₹80,000 Relocation & Retention Bonus'
    },
    type: 'On-site',
    driveType: 'Day 1 Drive',
    location: 'Pune / Jamshedpur / Bengaluru',
    deadline: '2026-10-15',
    displayDeadline: '15 Oct 2026',
    isUrgent: false,
    minCgpa: 7.0,
    openings: 18,
    bond: 'None',
    eligibility: 'B.Tech / B.E. Mechanical / Automobile with CGPA ≥ 7.0, Max 1 backlog cleared',
    requiredSkills: ['SolidWorks', 'ANSYS', 'GD&T', 'Automotive Dynamics', 'Robotics Basics'],
    selectionRounds: [
      'Round 1: Online Technical Aptitude & Core Engineering Assessment (60 mins)',
      'Round 2: Technical Domain Interview (Design & Thermal Analysis)',
      'Round 3: Behavioral & Management Round with Plant Leadership'
    ],
    overview: 'Tata Motors is recruiting passionate Graduate Engineer Trainees to join our advanced commercial and electric vehicle engineering teams at our Pune engineering center.',
    responsibilities: [
      'Participate in chassis simulation, crash-safety modeling, and CAD component modeling.',
      'Assist production and testing engineers during physical prototype road trials.',
      'Optimize component durability and analyze structural stress matrices using ANSYS FEA.'
    ],
    benefits: [
      'Comprehensive medical insurance for self and dependents',
      'Direct factory floor rotation and executive engineering mentorship',
      'Accelerated promotion track for high-performing GET cohorts'
    ]
  },
  {
    id: 'plc_cse_01',
    postedAt: '2026-09-18T10:00:00+05:30',
    postedDateTime: 'Posted 18 Sep 2026, 10:00 AM',
    company: 'Microsoft India Development Center',
    companyLogoBg: '#0078d4',
    companyLogoText: 'MS',
    verifiedCompany: true,
    role: 'Software Development Engineer - I (Full-Time)',
    department: 'Computer Science / IT',
    category: 'Software & IT',
    package: '₹44.0 LPA',
    packageAmount: 44.0,
    packageBreakdown: {
      base: '₹18.0 LPA Fixed Base',
      variable: '₹16.0 LPA Stock Units (RSUs over 4 yrs)',
      perks: '₹10.0 LPA Joining, Relocation & Benefits'
    },
    type: 'Hybrid',
    driveType: 'Day 0 Drive',
    location: 'Hyderabad / Bengaluru / Noida',
    deadline: '2026-09-20',
    displayDeadline: '20 Sep 2026',
    isUrgent: true,
    minCgpa: 7.5,
    openings: 25,
    bond: 'None',
    eligibility: 'B.Tech CSE / IT / ECE with CGPA ≥ 7.5, 0 active backlogs',
    requiredSkills: ['Data Structures & Algorithms', 'C++', 'Java / C#', 'Distributed Systems', 'Cloud (Azure)'],
    selectionRounds: [
      'Round 1: Proctored Online Coding Assessment (3 Algorithmic Problems, 90 mins)',
      'Round 2: Technical Problem Solving & System Architecture (Virtual 1:1)',
      'Round 3: Advanced Data Structures & Code Optimization (Virtual 1:1)',
      'Round 4: Engineering Manager & Values Alignment'
    ],
    overview: 'Microsoft IDC is hosting our flagship on-campus Day 0 recruitment drive for graduating engineers to build global cloud infrastructure and AI-driven platforms.',
    responsibilities: [
      'Design, implement, and ship scalable microservices powering Azure and Microsoft 365.',
      'Write highly maintainable, test-driven code with sub-millisecond latency requirements.',
      'Collaborate across product managers, security auditors, and site reliability teams.'
    ],
    benefits: [
      'Top-tier comprehensive healthcare, parental leave, and wellness reimbursements',
      'Annual equity refreshers, patent filing bonuses, and conference sponsorships',
      'Flexible hybrid work policy with home office ergonomics allowance'
    ]
  },
  {
    id: 'plc_elec_01',
    postedAt: '2026-09-16T11:20:00+05:30',
    postedDateTime: 'Posted 16 Sep 2026, 11:20 AM',
    company: 'Texas Instruments',
    companyLogoBg: '#cc0000',
    companyLogoText: 'TI',
    verifiedCompany: true,
    role: 'Hardware & Analog Systems Design Engineer',
    department: 'Electrical / Electronics',
    category: 'Core Engineering',
    package: '₹22.0 LPA',
    packageAmount: 22.0,
    packageBreakdown: {
      base: '₹17.5 LPA Base',
      variable: '₹3.0 LPA Annual Incentive',
      perks: '₹1.5 LPA Sign-on Bonus'
    },
    type: 'On-site',
    driveType: 'Day 0 Drive',
    location: 'Bengaluru, Karnataka',
    deadline: '2026-10-18',
    displayDeadline: '18 Oct 2026',
    isUrgent: false,
    minCgpa: 7.2,
    openings: 12,
    bond: 'None',
    eligibility: 'B.Tech Electrical / Electronics / Instrumentation with CGPA ≥ 7.2',
    requiredSkills: ['Analog Circuit Design', 'Verilog / VHDL', 'SPICE Simulation', 'PCB Layout', 'Oscilloscopes'],
    selectionRounds: [
      'Round 1: Written Core Electronics & Aptitude Test (75 mins)',
      'Round 2: Analog Circuit Debugging & Schematic Analysis Interview',
      'Round 3: Digital Electronics & Embedded Systems Interview',
      'Round 4: HR Discussion & Offer Rollout'
    ],
    overview: 'Texas Instruments India is hiring Graduate Hardware Engineers to design next-generation semiconductor chips, power management ICs, and automotive radar modules.',
    responsibilities: [
      'Model and simulate high-frequency analog and mixed-signal circuits using Cadence tools.',
      'Perform hardware silicon validation and thermal characterization in Bengaluru labs.',
      'Collaborate with global fab and packaging teams to ensure silicon yield excellence.'
    ],
    benefits: [
      'Global semiconductor patent incentive awards',
      'Tuition reimbursement for sponsored M.Tech / MS programs',
      'Subsidized campus meals and comprehensive health coverage'
    ]
  },
  {
    id: 'plc_civil_01',
    postedAt: '2026-09-15T09:00:00+05:30',
    postedDateTime: 'Posted 15 Sep 2026, 9:00 AM',
    company: 'Larsen & Toubro (L&T) Construction',
    companyLogoBg: '#1e3a8a',
    companyLogoText: 'LT',
    verifiedCompany: true,
    role: 'Graduate Engineer Trainee (GET) - Structural & Infrastructure',
    department: 'Civil',
    category: 'Core Engineering',
    package: '₹9.5 LPA',
    packageAmount: 9.5,
    packageBreakdown: {
      base: '₹8.0 LPA Base',
      variable: '₹1.0 LPA Site Performance Allowance',
      perks: '₹50,000 Retention Bonus'
    },
    type: 'On-site',
    driveType: 'Day 1 Drive',
    location: 'Mumbai / Chennai / Delhi NCR',
    deadline: '2026-10-25',
    displayDeadline: '25 Oct 2026',
    isUrgent: false,
    minCgpa: 6.8,
    openings: 22,
    bond: 'No Bond',
    eligibility: 'B.Tech Civil Engineering with CGPA ≥ 6.8, All academic semesters cleared',
    requiredSkills: ['AutoCAD', 'STAAD.Pro', 'Revit BIM', 'Structural Concrete Analysis', 'Project Estimation'],
    selectionRounds: [
      'Round 1: L&T National Aptitude & Technical Assessment (60 mins)',
      'Round 2: Subject Matter Expert Interview (Structural & Geo-technical)',
      'Round 3: Leadership & Behavioral Interview'
    ],
    overview: 'L&T Construction, India’s largest infrastructure conglomerate, invites graduating civil engineers to engineer landmark high-speed rail, bridge, and metro projects.',
    responsibilities: [
      'Prepare structural load calculations and compliance blueprints using STAAD.Pro and BIM.',
      'Oversee quality assurance checks, concrete mix ratios, and site safety standards.',
      'Interface with municipal planning authorities and project management consultants.'
    ],
    benefits: [
      'Fully furnished executive accommodation at mega project sites',
      'Continuous leadership certifications through L&T Leadership Academy',
      'Gratuity, PF, and comprehensive health insurance from day one'
    ]
  },
  {
    id: 'plc_chem_01',
    postedAt: '2026-09-17T11:00:00+05:30',
    postedDateTime: 'Posted 17 Sep 2026, 11:00 AM',
    company: 'Reliance Industries Limited',
    companyLogoBg: '#c2410c',
    companyLogoText: 'RIL',
    verifiedCompany: true,
    role: 'Process Operations & Chemical Refining Engineer',
    department: 'Chemical',
    category: 'Core Engineering',
    package: '₹14.0 LPA',
    packageAmount: 14.0,
    packageBreakdown: {
      base: '₹11.8 LPA Base',
      variable: '₹1.7 LPA Performance Payout',
      perks: '₹50,000 Relocation Allowance'
    },
    type: 'On-site',
    driveType: 'Day 1 Drive',
    location: 'Jamnagar, Gujarat / Vadodara',
    deadline: '2026-10-28',
    displayDeadline: '28 Oct 2026',
    isUrgent: false,
    minCgpa: 7.0,
    openings: 15,
    bond: 'None',
    eligibility: 'B.Tech Chemical / Petroleum / Polymer Engineering with CGPA ≥ 7.0',
    requiredSkills: ['Aspen Plus', 'Thermodynamics', 'Process Flow Diagrams (PFD)', 'Hazard & Operability (HAZOP)'],
    selectionRounds: [
      'Round 1: RIL Technical & Analytical Test (60 mins)',
      'Round 2: Technical Panel Interview with Refinery Chief Engineers',
      'Round 3: HR Round & Medical Fitness Verification'
    ],
    overview: 'Join the world’s largest refining complex at Jamnagar. Work on green energy transitions, petrochemical unit optimization, and advanced process safety systems.',
    responsibilities: [
      'Monitor distillation columns, heat exchangers, and continuous reactor kinetics.',
      'Optimize chemical yield and reduce energy consumption across refining trains.',
      'Execute safety audits and process hazard reviews in compliance with global standards.'
    ],
    benefits: [
      'World-class gated township housing with recreational and sports complexes',
      'Free specialized corporate bus transport and medical clinic access',
      'Long-term employee equity incentive options'
    ]
  },
  {
    id: 'plc_inst_01',
    postedAt: '2026-09-16T15:10:00+05:30',
    postedDateTime: 'Posted 16 Sep 2026, 3:10 PM',
    company: 'Honeywell Automation',
    companyLogoBg: '#e11d48',
    companyLogoText: 'HW',
    verifiedCompany: true,
    role: 'Industrial Automation & SCADA Systems Engineer',
    department: 'Instrumentation',
    category: 'Core Engineering',
    package: '₹13.2 LPA',
    packageAmount: 13.2,
    packageBreakdown: {
      base: '₹11.0 LPA Base',
      variable: '₹1.5 LPA Performance Bonus',
      perks: '₹70,000 Certification Allowance'
    },
    type: 'On-site',
    driveType: 'Open On-Campus',
    location: 'Pune / Bengaluru / Hyderabad',
    deadline: '2026-10-20',
    displayDeadline: '20 Oct 2026',
    isUrgent: false,
    minCgpa: 7.0,
    openings: 10,
    bond: 'None',
    eligibility: 'B.Tech Instrumentation / Electrical / Electronics with CGPA ≥ 7.0',
    requiredSkills: ['PLC Programming', 'SCADA', 'DCS Systems', 'Industrial IoT', 'Sensors & Actuators'],
    selectionRounds: [
      'Round 1: Honeywell National Online Technical Assessment',
      'Round 2: Hands-on Logic & Circuit Troubleshooting Interview',
      'Round 3: Culture & Managerial Round'
    ],
    overview: 'Honeywell Industrial Automation builds digital solutions for airports, smart buildings, and critical industrial plants. We are seeking talented instrumentation engineers.',
    responsibilities: [
      'Configure Distributed Control Systems (DCS) and industrial PLC ladder logic.',
      'Calibrate precision smart sensors and fieldbus communication networks.',
      'Deploy real-time SCADA telemetry dashboards for industrial automation clients.'
    ],
    benefits: [
      'Comprehensive insurance covering parents and spouse',
      'Honeywell Technical Career Ladder mentorship program',
      'Sponsorship for global ISA automation certifications'
    ]
  },
  {
    id: 'plc_auto_01',
    postedAt: '2026-09-17T17:00:00+05:30',
    postedDateTime: 'Posted 17 Sep 2026, 5:00 PM',
    company: 'Bosch Automotive',
    companyLogoBg: '#ea580c',
    companyLogoText: 'BOS',
    verifiedCompany: true,
    role: 'EV Powertrain & Autonomous Driving Systems Engineer',
    department: 'Automobile',
    category: 'Core Engineering',
    package: '₹16.0 LPA',
    packageAmount: 16.0,
    packageBreakdown: {
      base: '₹13.5 LPA Base',
      variable: '₹1.8 LPA Incentive',
      perks: '₹70,000 Joining Bonus'
    },
    type: 'On-site',
    driveType: 'Day 1 Drive',
    location: 'Bengaluru / Coimbatore / Pune',
    deadline: '2026-10-22',
    displayDeadline: '22 Oct 2026',
    isUrgent: false,
    minCgpa: 7.2,
    openings: 14,
    bond: 'None',
    eligibility: 'B.Tech Automobile / Mechanical / Electrical with CGPA ≥ 7.2',
    requiredSkills: ['Electric Powertrain', 'Battery Management Systems (BMS)', 'CAN Bus', 'MATLAB / Simulink', 'Embedded C'],
    selectionRounds: [
      'Round 1: Bosch Online Assessment (Core Automotive + Coding Basics)',
      'Round 2: Technical Interview (BMS & Power Electronics)',
      'Round 3: Behavioral & HR Interview'
    ],
    overview: 'Bosch is engineering the future of clean electric mobility. Join our EV solutions group to develop next-generation motor controllers and smart battery systems.',
    responsibilities: [
      'Develop control algorithms for battery management systems and regenerative braking.',
      'Analyze vehicle telemetry data and test hardware-in-the-loop (HIL) simulators.',
      'Coordinate with global automotive OEMs on vehicle integration testing.'
    ],
    benefits: [
      'Flexible work hours and modern campus facilities',
      'International assignment opportunities after 2 years tenure',
      'Subsidized lease car program and health benefits'
    ]
  },
  {
    id: 'plc_bio_01',
    postedAt: '2026-09-15T12:00:00+05:30',
    postedDateTime: 'Posted 15 Sep 2026, 12:00 PM',
    company: 'Biocon Biologics',
    companyLogoBg: '#059669',
    companyLogoText: 'BIO',
    verifiedCompany: true,
    role: 'Bioprocess Development & Quality Assurance Associate',
    department: 'Biotechnology',
    category: 'Core Engineering',
    package: '₹11.0 LPA',
    packageAmount: 11.0,
    packageBreakdown: {
      base: '₹9.2 LPA Base',
      variable: '₹1.3 LPA Performance Award',
      perks: '₹50,000 Relocation'
    },
    type: 'On-site',
    driveType: 'Open On-Campus',
    location: 'Bengaluru, Karnataka',
    deadline: '2026-10-30',
    displayDeadline: '30 Oct 2026',
    isUrgent: false,
    minCgpa: 7.0,
    openings: 8,
    bond: 'None',
    eligibility: 'B.Tech / M.Tech Biotechnology / Biochemical Engineering with CGPA ≥ 7.0',
    requiredSkills: ['Fermentation Technology', 'Chromatography (HPLC)', 'cGMP Compliance', 'Bioreactor Operations'],
    selectionRounds: [
      'Round 1: Biocon Technical & Scientific Knowledge Test',
      'Round 2: Technical Panel Interview (Upstream & Downstream Processing)',
      'Round 3: HR Alignment & Campus Placement Offer'
    ],
    overview: 'Biocon Biologics is hiring graduates to advance affordable biosimilar therapeutics. Work inside state-of-the-art biological manufacturing facilities.',
    responsibilities: [
      'Operate pilot-scale bioreactors and optimize recombinant cell culture conditions.',
      'Perform downstream purification using ultrafiltration and column chromatography.',
      'Maintain rigorous electronic batch records in compliance with US-FDA guidelines.'
    ],
    benefits: [
      'Free campus meals and comprehensive health insurance',
      'Biocon Academy continuing scientific education support',
      'Patent publication reward program'
    ]
  },
  {
    id: 'plc_aero_01',
    postedAt: '2026-09-16T16:00:00+05:30',
    postedDateTime: 'Posted 16 Sep 2026, 4:00 PM',
    company: 'Airbus India',
    companyLogoBg: '#0369a1',
    companyLogoText: 'AIR',
    verifiedCompany: true,
    role: 'Aerospace Structures & Flight Physics Trainee Engineer',
    department: 'Aerospace / Multidisciplinary',
    category: 'Core Engineering',
    package: '₹15.5 LPA',
    packageAmount: 15.5,
    packageBreakdown: {
      base: '₹13.0 LPA Base',
      variable: '₹1.8 LPA Incentive',
      perks: '₹70,000 Relocation'
    },
    type: 'On-site',
    driveType: 'Day 1 Drive',
    location: 'Bengaluru, Karnataka',
    deadline: '2026-10-24',
    displayDeadline: '24 Oct 2026',
    isUrgent: false,
    minCgpa: 7.5,
    openings: 10,
    bond: 'None',
    eligibility: 'B.Tech Aerospace / Mechanical / Multidisciplinary with CGPA ≥ 7.5',
    requiredSkills: ['CATIA V5', 'Aerodynamics', 'Nastran / Patran', 'Structural Composites', 'CFD'],
    selectionRounds: [
      'Round 1: Airbus Technical Aptitude & Core Aerodynamics Assessment',
      'Round 2: Structural Mechanics & Stress Calculation Interview',
      'Round 3: HR & Management Alignment'
    ],
    overview: 'Airbus India Customer & Engineering Center is expanding its engineering design teams for commercial aircraft cabin architectures and wing structural optimization.',
    responsibilities: [
      'Perform static, fatigue, and damage tolerance stress analysis for aircraft structures.',
      'Build 3D models of fuselage sections and control surfaces using CATIA V5.',
      'Coordinate technical documentation with engineering headquarters in Toulouse.'
    ],
    benefits: [
      'Global aerospace training opportunities and flight simulator access',
      'Top-tier wellness allowance and family healthcare coverage',
      'Subsidized corporate transport across Bengaluru'
    ]
  },
  {
    id: 'plc_cloud_01',
    postedAt: '2026-09-18T12:30:00+05:30',
    postedDateTime: 'Posted 18 Sep 2026, 12:30 PM',
    company: 'Amazon Web Services (AWS)',
    companyLogoBg: '#ff9900',
    companyLogoText: 'AWS',
    verifiedCompany: true,
    role: 'Cloud Support & DevOps Engineer (Campus)',
    department: 'Computer Science / IT',
    category: 'Software & IT',
    package: '₹28.5 LPA',
    packageAmount: 28.5,
    packageBreakdown: {
      base: '₹16.5 LPA Base',
      variable: '₹8.0 LPA AWS Stocks (RSU)',
      perks: '₹4.0 LPA Sign-on Bonus'
    },
    type: 'Hybrid',
    driveType: 'Day 1 Drive',
    location: 'Bengaluru / Hyderabad / Gurugram',
    deadline: '2026-10-10',
    displayDeadline: '10 Oct 2026',
    isUrgent: false,
    minCgpa: 7.0,
    openings: 30,
    bond: 'None',
    eligibility: 'B.Tech All Engineering Streams with CGPA ≥ 7.0, 0 Active Backlogs',
    requiredSkills: ['Linux Internals', 'Networking (TCP/IP)', 'Python / Go', 'Cloud Architecture', 'Troubleshooting'],
    selectionRounds: [
      'Round 1: Online Technical Assessment (Algorithms, Linux, Networking)',
      'Round 2: Technical Interview 1 (System Administration & Scripting)',
      'Round 3: Technical Interview 2 (Cloud Solutions & Network Diagnostics)',
      'Round 4: Amazon Leadership Principles (Bar Raiser Round)'
    ],
    overview: 'AWS is hiring graduating engineers to build and support world-class infrastructure for millions of active cloud customers worldwide.',
    responsibilities: [
      'Architect highly available, fault-tolerant cloud solutions using AWS services.',
      'Debug distributed network bottlenecks and configure automated CI/CD pipelines.',
      'Act as technical consultant to enterprise customers resolving mission-critical workloads.'
    ],
    benefits: [
      'Relocation assistance and home broadband reimbursement',
      'Comprehensive medical insurance and employee stock purchase plan',
      'Unlimited access to all official AWS certification exams and learning paths'
    ]
  }
]

export default function StudentPlacements({ student = {}, onBack, onNavigateHome }) {
  // Navigation & View mode
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'core' | 'software' | 'consulting' | 'day0' | 'status'
  const [sortOption, setSortOption] = useState('highest_package')

  // Live auto-updating time ticker for compact countdowns
  const [currentTime, setCurrentTime] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [selectedPackage, setSelectedPackage] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDriveType, setSelectedDriveType] = useState('all')
  const [selectedMinCgpa, setSelectedMinCgpa] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  // Modals state
  const [detailsModalItem, setDetailsModalItem] = useState(null)
  const [applyModalItem, setApplyModalItem] = useState(null)
  const [applicationNote, setApplicationNote] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [viewingOfferLetter, setViewingOfferLetter] = useState(null)

  // Student Profile Data
  const s = student || {}
  const studentName = s.name || 'Student Member'
  const studentBranch = s.branch || s.course || 'B.Tech - Engineering Student'
  const studentCgpa = parseFloat(s.cgpa) || 8.4
  const studentRoll = s.rollNo || s.roll || '2023-ENG-1048'
  const studentCollege = s.institution || s.college || 'Indian Institute of Engineering & Technology'

  // Applications & Saved state from localStorage
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_placement_applications')
      if (saved) return JSON.parse(saved)
    } catch {}
    return [
      {
        placementId: 'plc_mech_01',
        company: 'Tata Motors',
        role: 'Graduate Engineer Trainee (GET) - Mechanical & Robotics',
        department: 'Mechanical',
        package: '₹12.5 LPA',
        location: 'Pune, Maharashtra',
        appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'shortlisted', // 'applied' | 'shortlisted' | 'interview' | 'selected'
        statusLabel: 'Technical Interview Scheduled',
        feedback: 'Your academic CGPA (8.4) and CAD portfolio passed initial screening. Technical panel round scheduled with chassis engineering lead.'
      }
    ]
  })

  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_saved_placements')
      if (saved) return JSON.parse(saved)
    } catch {}
    return ['plc_mech_01', 'plc_cse_01']
  })

  // Sync applications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('udaan_student_placement_applications', JSON.stringify(applications))
    } catch {}
  }, [applications])

  // Sync saved IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('udaan_student_saved_placements', JSON.stringify(savedIds))
    } catch {}
  }, [savedIds])

  // Toast auto-hide
  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(''), 4000)
    return () => clearTimeout(timer)
  }, [toastMessage])

  // Toggle Bookmark
  const handleToggleSave = (e, id) => {
    e.stopPropagation()
    setSavedIds((prev) => {
      const exists = prev.includes(id)
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id]
      setToastMessage(exists ? 'Removed from saved placements.' : 'Placement saved to bookmarks!')
      return next
    })
  }

  // Check application status
  const isApplied = (id) => applications.some((app) => app.placementId === id)

  // Apply Action via Training & Placement Cell
  const handleConfirmApply = () => {
    if (!applyModalItem) return
    setIsApplying(true)

    setTimeout(() => {
      const newApp = {
        placementId: applyModalItem.id,
        company: applyModalItem.company,
        role: applyModalItem.role,
        department: applyModalItem.department,
        package: applyModalItem.package,
        location: applyModalItem.location,
        appliedAt: new Date().toISOString(),
        status: 'applied',
        statusLabel: 'Application Forwarded to T&P Cell',
        feedback: 'Your verified academic transcript and credentials have been forwarded to the corporate recruitment team.',
        studentNote: applicationNote.trim()
      }

      setApplications((prev) => [newApp, ...prev])
      setIsApplying(false)
      setApplyModalItem(null)
      setApplicationNote('')
      setToastMessage(`Application successfully submitted for ${applyModalItem.company}!`)
    }, 600)
  }

  // Download Official Campus Placement Offer Letter
  const handleDownloadOfferLetter = (offer) => {
    if (!offer) return
    const company = offer.company || 'Placement Partner'
    const role = offer.role || 'Associate Engineer'
    const pkg = offer.package || 'Competitive CTC'

    const letterContent = `
================================================================================
OFFICIAL CAMPUS PLACEMENT SELECTION LETTER
IAS COLLABORATION PLATFORM - TRAINING & PLACEMENT CELL
================================================================================

Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
Reference ID: IAS-PLC-${(offer.placementId || '2026').toUpperCase()}-${Date.now().toString().slice(-4)}

To:
Candidate: ${studentName}
Roll / Enrollment ID: ${studentRoll}
Institution: ${studentCollege}
Department / Discipline: ${offer.department || studentBranch}
Cumulative CGPA: ${studentCgpa} / 10.0

Subject: Formal Letter of Selection - Campus Recruitment Drive

Dear ${studentName},

We are pleased to inform you that based on your exceptional performance in the
institutional campus recruitment evaluation and verification of your academic credentials
via the IAS Collaboration Network, you have been selected for employment at ${company}.

Employment & Compensation Details:
--------------------------------------------------------------------------------
• Hiring Organization: ${company}
• Department / Division: ${offer.department || studentBranch}
• Designation / Role: ${role}
• Work Arrangement: ${offer.type || 'Full-time On-site'}
• Primary Location: ${offer.location || 'India'}
• Annual CTC Compensation: ${pkg}
• Drive Category: ${offer.driveType || 'Institutional Campus Drive'}
--------------------------------------------------------------------------------

Please retain this verified document as your institutional selection record.
Formal joining guidelines, onboarding instructions, and pre-joining formalities will
be coordinated through the institutional Training & Placement cell.

Authorized by:
Office of Campus Recruitment & Talent Acquisition
${company}
[IAS Verified Institutional Recruitment Partner]
================================================================================
`
    const blob = new Blob([letterContent.trim()], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${company.replace(/\s+/g, '_')}_Placement_Offer_Letter.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setToastMessage(`Placement offer letter downloaded for ${company}!`)
  }

  // Placement metrics for sidebar
  const metrics = useMemo(() => {
    const appliedCount = applications.length
    const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length
    const interviewCount = applications.filter((a) => a.status === 'interview' || a.status === 'shortlisted').length
    const selectedCount = applications.filter((a) => a.status === 'selected' || a.status === 'offer').length
    return {
      applied: appliedCount,
      shortlisted: shortlistedCount,
      interviews: interviewCount,
      offers: selectedCount
    }
  }, [applications])

  // Approved offers list
  const approvedOffers = useMemo(() => {
    return applications.filter((a) => a.status === 'selected' || a.status === 'offer')
  }, [applications])

  // Filter & Search Logic across ALL Engineering Departments
  const filteredPlacements = useMemo(() => {
    return INITIAL_PLACEMENTS.filter((item) => {
      // 1. Tab Filter
      if (activeTab === 'core' && item.category !== 'Core Engineering') return false
      if (activeTab === 'software' && item.category !== 'Software & IT') return false
      if (activeTab === 'consulting' && item.category !== 'Consulting & Analytics') return false
      if (activeTab === 'day0' && item.driveType !== 'Day 0 Drive') return false

      // 2. Department Filter (CRITICAL REQUIREMENT)
      if (selectedDepartment !== 'All Departments') {
        const itemDept = item.department.toLowerCase()
        const selDept = selectedDepartment.toLowerCase()
        if (!itemDept.includes(selDept) && !selDept.includes(itemDept)) {
          return false
        }
      }

      // 3. Keyword Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchComp = item.company.toLowerCase().includes(q)
        const matchRole = item.role.toLowerCase().includes(q)
        const matchDept = item.department.toLowerCase().includes(q)
        const matchLoc = item.location.toLowerCase().includes(q)
        const matchSkills = item.requiredSkills.some((s) => s.toLowerCase().includes(q))
        if (!matchComp && !matchRole && !matchDept && !matchLoc && !matchSkills) return false
      }

      // 4. Package Range Filter
      if (selectedPackage !== 'all') {
        if (selectedPackage === '20plus' && item.packageAmount < 20) return false
        if (selectedPackage === '12to20' && (item.packageAmount < 12 || item.packageAmount >= 20)) return false
        if (selectedPackage === '8to12' && (item.packageAmount < 8 || item.packageAmount >= 12)) return false
        if (selectedPackage === 'under8' && item.packageAmount >= 8) return false
      }

      // 5. Work Type Filter
      if (selectedType !== 'all') {
        if (item.type.toLowerCase() !== selectedType.toLowerCase()) return false
      }

      // 6. Drive Type Filter
      if (selectedDriveType !== 'all') {
        if (item.driveType.toLowerCase() !== selectedDriveType.toLowerCase()) return false
      }

      // 7. Min CGPA Filter
      if (selectedMinCgpa !== 'all') {
        const reqCgpa = parseFloat(selectedMinCgpa)
        if (item.minCgpa > reqCgpa) return false
      }

      // 8. Location Filter
      if (selectedLocation !== 'all') {
        if (!item.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false
      }

      return true
    }).sort((a, b) => {
      if (sortOption === 'highest_package') {
        return b.packageAmount - a.packageAmount
      }
      if (sortOption === 'deadline_soon') {
        return new Date(a.deadline) - new Date(b.deadline)
      }
      if (sortOption === 'company_az') {
        return a.company.localeCompare(b.company)
      }
      // 'latest' default
      return new Date(b.postedAt) - new Date(a.postedAt)
    })
  }, [
    activeTab,
    selectedDepartment,
    searchQuery,
    selectedPackage,
    selectedType,
    selectedDriveType,
    selectedMinCgpa,
    selectedLocation,
    sortOption
  ])

  const hasActiveFilters =
    selectedDepartment !== 'All Departments' ||
    selectedPackage !== 'all' ||
    selectedType !== 'all' ||
    selectedDriveType !== 'all' ||
    selectedMinCgpa !== 'all' ||
    selectedLocation !== 'all' ||
    searchQuery.trim() !== ''

  const handleResetFilters = () => {
    setSelectedDepartment('All Departments')
    setSelectedPackage('all')
    setSelectedType('all')
    setSelectedDriveType('all')
    setSelectedMinCgpa('all')
    setSelectedLocation('all')
    setSearchQuery('')
    setActiveTab('all')
  }

  return (
    <div className="sp-page-wrapper">
      {/* TOP NAVIGATION NAVBAR */}
      <header className="sp-top-navbar">
        <div className="sp-nav-left">
          <div className="sp-nav-brand">
            <span
              className="sp-nav-brand-bold"
              onClick={onNavigateHome}
              style={{ cursor: onNavigateHome ? 'pointer' : 'default' }}
              title={onNavigateHome ? 'Return to Portal Home' : ''}
            >
              IAS Collaboration Portal
            </span>
            <span className="sp-nav-slash">/</span>
            <span
              onClick={onBack}
              style={{ cursor: onBack ? 'pointer' : 'default' }}
              title={onBack ? 'Return to Student Dashboard' : ''}
            >
              Student Portal
            </span>
            <span className="sp-nav-slash">/</span>
            <span className="sp-nav-active-tag">Campus Placements</span>
          </div>
        </div>

        <div className="sp-nav-right">
          <div className="sp-nav-user-chip">
            {s.profilePic ? (
              <img src={s.profilePic} alt={studentName} className="sp-nav-avatar" />
            ) : (
              <div className="sp-nav-avatar">
                {studentName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="sp-nav-user-meta">
              <span className="sp-nav-user-name">{studentName}</span>
              <span className="sp-nav-user-sub">{studentBranch}</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="sp-main-content">
        {/* COMPACT PAGE HEADER */}
        <div className="sp-page-header">
          <div className="sp-header-info">
            <h1 className="sp-page-title">Campus Placements &amp; Career Drives</h1>
            <p className="sp-page-subtitle">
              Verified full-time recruitment drives, CTC packages, and corporate career opportunities across all academic engineering departments.
            </p>
          </div>

          <div className="sp-header-badges">
            <span className="sp-header-pill accent">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Direct 1-Click Verification • No CV Upload
            </span>
            <span className="sp-header-pill">
              Academic Eligibility: CGPA ≥ 7.0 Standard
            </span>
          </div>
        </div>

        {/* CONDITIONAL VIEW: MY APPLICATIONS TAB */}
        {activeTab === 'status' ? (
          <section className="sp-applications-view">
            <div className="sp-apps-header-row">
              <div>
                <h2 className="sp-apps-title">My Placement Applications &amp; Drive Status</h2>
                <p className="sp-apps-subtitle">
                  Real-time status updates tracked directly through the Office of Training &amp; Placement Cell.
                </p>
              </div>
              <button
                type="button"
                className="sp-btn-view"
                onClick={() => setActiveTab('all')}
              >
                ← Back to Opportunity Listings
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="sp-empty-state">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <h3 className="sp-empty-title">No Placement Applications Submitted Yet</h3>
                <p className="sp-empty-desc">
                  Browse the verified campus drive directory and apply directly using your authenticated academic profile and credentials.
                </p>
                <button type="button" className="sp-btn-apply" onClick={() => setActiveTab('all')}>
                  Browse Opportunities
                </button>
              </div>
            ) : (
              <div className="sp-apps-grid">
                {applications.map((app) => (
                  <div key={app.placementId} className="sp-app-item-card">
                    <div className="sp-app-item-top">
                      <div>
                        <div className="sp-app-company">{app.company}</div>
                        <div className="sp-app-role">{app.role} • {app.department}</div>
                      </div>
                      <div className="sp-spec-pill package">{app.package}</div>
                      <span className={`sp-app-status-badge ${app.status}`}>
                        ● {app.statusLabel || app.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="sp-app-feedback-box">
                      <strong>T&amp;P Cell Status Note:</strong> {app.feedback}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: '#64748b' }}>
                      <span>Applied on: {new Date(app.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>Location: {app.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* WORKSPACE 2-COLUMN LAYOUT (Desktop: Listings + Right-Side Panel) */
          <div className="sp-workspace-layout">
            {/* LEFT COLUMN: LISTINGS & FILTERS */}
            <div className="sp-main-feed">
              {/* SEARCH & DEPARTMENT FILTER BAR */}
              <section className="sp-filter-card">
                <div className="sp-search-row">
                  {/* Keyword Search */}
                  <div className="sp-search-input-wrap">
                    <svg className="sp-search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      className="sp-search-input"
                      placeholder="Search company, role, package, skills (e.g. Microsoft, GET, CAD, Python, 12 LPA)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="sp-search-clear-btn"
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search query"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Primary Department Selector */}
                  <div className="sp-dept-select-wrap">
                    <label htmlFor="sp-primary-dept" className="sp-sr-only">Filter by Department</label>
                    <select
                      id="sp-primary-dept"
                      className="sp-dept-select"
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      title="Filter by Academic Department"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept === 'All Departments' ? 'All Academic Departments' : dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Toggle Advanced Filters Button */}
                  <div className="sp-search-actions">
                    <button
                      type="button"
                      className={`sp-filter-toggle-btn ${isFilterDrawerOpen ? 'active' : ''}`}
                      onClick={() => setIsFilterDrawerOpen((prev) => !prev)}
                      title="Toggle detailed filters"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                      </svg>
                      <span>Filters {hasActiveFilters && '●'}</span>
                    </button>

                    {hasActiveFilters && (
                      <button
                        type="button"
                        className="sp-filter-reset-btn"
                        onClick={handleResetFilters}
                        title="Clear all filters"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Quick Tabs */}
                <div className="sp-quick-tabs">
                  <button
                    type="button"
                    className={`sp-quick-tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All Opportunities ({INITIAL_PLACEMENTS.length})
                  </button>
                  <button
                    type="button"
                    className={`sp-quick-tab ${activeTab === 'core' ? 'active' : ''}`}
                    onClick={() => setActiveTab('core')}
                  >
                    Core Engineering
                  </button>
                  <button
                    type="button"
                    className={`sp-quick-tab ${activeTab === 'software' ? 'active' : ''}`}
                    onClick={() => setActiveTab('software')}
                  >
                    Software &amp; IT
                  </button>
                  <button
                    type="button"
                    className={`sp-quick-tab ${activeTab === 'day0' ? 'active' : ''}`}
                    onClick={() => setActiveTab('day0')}
                  >
                    Day 0 / High CTC Drives
                  </button>
                  <button
                    type="button"
                    className={`sp-quick-tab ${activeTab === 'status' ? 'active' : ''}`}
                    onClick={() => setActiveTab('status')}
                  >
                    My Applications ({applications.length})
                  </button>
                </div>

                {/* Collapsible Advanced Filters Drawer */}
                <div className={`sp-filters-grid ${isFilterDrawerOpen ? 'is-open' : ''}`}>
                  <div className="sp-filter-col">
                    <label className="sp-filter-label" htmlFor="sp-f-pkg">Annual CTC Package</label>
                    <select
                      id="sp-f-pkg"
                      className="sp-filter-select"
                      value={selectedPackage}
                      onChange={(e) => setSelectedPackage(e.target.value)}
                    >
                      <option value="all">All CTC Packages</option>
                      <option value="20plus">₹20+ LPA (Dream / Day 0)</option>
                      <option value="12to20">₹12 - ₹20 LPA (Super Dream)</option>
                      <option value="8to12">₹8 - ₹12 LPA (Core Premium)</option>
                      <option value="under8">&lt; ₹8 LPA (Standard Entry)</option>
                    </select>
                  </div>

                  <div className="sp-filter-col">
                    <label className="sp-filter-label" htmlFor="sp-f-type">Work Mode</label>
                    <select
                      id="sp-f-type"
                      className="sp-filter-select"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="all">All Work Modes</option>
                      <option value="on-site">On-site / Plant / R&amp;D</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>

                  <div className="sp-filter-col">
                    <label className="sp-filter-label" htmlFor="sp-f-drive">Drive Classification</label>
                    <select
                      id="sp-f-drive"
                      className="sp-filter-select"
                      value={selectedDriveType}
                      onChange={(e) => setSelectedDriveType(e.target.value)}
                    >
                      <option value="all">All Drive Tiers</option>
                      <option value="day 0 drive">Day 0 Drive</option>
                      <option value="day 1 drive">Day 1 Drive</option>
                      <option value="open on-campus">Open On-Campus</option>
                    </select>
                  </div>

                  <div className="sp-filter-col">
                    <label className="sp-filter-label" htmlFor="sp-f-cgpa">Eligibility Cutoff</label>
                    <select
                      id="sp-f-cgpa"
                      className="sp-filter-select"
                      value={selectedMinCgpa}
                      onChange={(e) => setSelectedMinCgpa(e.target.value)}
                    >
                      <option value="all">All Cutoffs</option>
                      <option value="7.0">CGPA ≥ 7.0</option>
                      <option value="7.2">CGPA ≥ 7.2</option>
                      <option value="7.5">CGPA ≥ 7.5</option>
                    </select>
                  </div>

                  <div className="sp-filter-col">
                    <label className="sp-filter-label" htmlFor="sp-f-loc">Hiring Location</label>
                    <select
                      id="sp-f-loc"
                      className="sp-filter-select"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="all">All Locations</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Pune">Pune</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Mumbai">Mumbai</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* FEED TOOLBAR (Counts & Sorting) */}
              <div className="sp-feed-toolbar">
                <span className="sp-results-count">
                  Showing <strong>{filteredPlacements.length}</strong> placement opportunities
                  {selectedDepartment !== 'All Departments' && ` in ${selectedDepartment}`}
                </span>

                <div className="sp-sort-group">
                  <label htmlFor="sp-sort-select" className="sp-sort-label">Sort by:</label>
                  <select
                    id="sp-sort-select"
                    className="sp-sort-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="highest_package">Highest CTC Package (LPA)</option>
                    <option value="latest">Recently Added</option>
                    <option value="deadline_soon">Closing Deadline Soonest</option>
                    <option value="company_az">Company Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* OPPORTUNITY CARDS LIST */}
              {filteredPlacements.length === 0 ? (
                <div className="sp-empty-state">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <h3 className="sp-empty-title">No Placement Opportunities Found</h3>
                  <p className="sp-empty-desc">
                    No active campus recruitment drives matched your current filter combinations. Try resetting your filters to explore opportunities across other academic departments.
                  </p>
                  <button type="button" className="sp-btn-apply" onClick={handleResetFilters}>
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="sp-cards-list">
                  {filteredPlacements.map((item) => {
                    const alreadyApplied = isApplied(item.id)
                    const isSaved = savedIds.includes(item.id)

                    return (
                      <article key={item.id} className="sp-placement-card">
                        <div className="sp-card-main-row">
                          <div
                            className="sp-company-logo"
                            style={{ backgroundColor: item.companyLogoBg || '#112233' }}
                          >
                            {item.companyLogoText || item.company.slice(0, 2).toUpperCase()}
                          </div>

                          <div className="sp-card-details">
                            <div className="sp-card-title-row">
                              <div className="sp-company-name-group">
                                <span className="sp-company-name">{item.company}</span>
                                {item.verifiedCompany && (
                                  <span className="sp-verified-badge" title="Official Verified Campus Recruitment Partner">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Accredited Partner
                                  </span>
                                )}
                                <span className="sp-drive-badge">{item.driveType}</span>
                              </div>

                              <button
                                type="button"
                                className={`sp-bookmark-btn ${isSaved ? 'is-saved' : ''}`}
                                onClick={(e) => handleToggleSave(e, item.id)}
                                title={isSaved ? 'Remove from saved' : 'Save placement drive'}
                                aria-label={isSaved ? 'Remove from saved' : 'Save placement drive'}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                </svg>
                              </button>
                            </div>

                            <h3 className="sp-role-title">{item.role}</h3>

                            {/* Specification Pills Row */}
                            <div className="sp-specs-row">
                              <span className="sp-spec-pill package" title="Annual CTC Package">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <line x1="12" y1="1" x2="12" y2="23" />
                                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                                {item.package}
                              </span>

                              <span className="sp-spec-pill dept" title="Academic Department">
                                {item.department}
                              </span>

                              <span className="sp-spec-pill" title="Work Mode">
                                {item.type}
                              </span>

                              <span className="sp-spec-pill" title="Hiring Location">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                {item.location}
                              </span>

                              {/* Posted Date and Time */}
                              <span className="sp-spec-pill" title="Posting Date and Time">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <circle cx="12" cy="12" r="10" />
                                  <polyline points="12 6 12 12 14 14" />
                                </svg>
                                {item.postedDateTime || formatPostedDateTime(item.postedAt)}
                              </span>

                              {/* Application Closing Deadline */}
                              <span
                                className={`sp-spec-pill deadline ${isUrgentDeadline(item.deadline, currentTime) || item.isUrgent ? 'urgent' : ''}`}
                                title="Application Closing Deadline"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                  <line x1="16" y1="2" x2="16" y2="6" />
                                  <line x1="8" y1="2" x2="8" y2="6" />
                                  <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                {formatClosingDeadline(item.deadline, item.displayDeadline, currentTime)}
                              </span>
                            </div>

                            {/* Skills list */}
                            <div className="sp-skills-row">
                              <span className="sp-skills-label">Evaluated Competencies:</span>
                              {item.requiredSkills.map((sk) => (
                                <span key={sk} className="sp-skill-tag">{sk}</span>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons Column */}
                          <div className="sp-card-actions">
                            <button
                              type="button"
                              className="sp-btn-view"
                              onClick={() => setDetailsModalItem(item)}
                            >
                              View Details
                            </button>

                            {alreadyApplied ? (
                              <button
                                type="button"
                                className="sp-btn-applied"
                                disabled
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Applied
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="sp-btn-apply"
                                onClick={() => setApplyModalItem(item)}
                              >
                                Apply Now →
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR: MY PLACEMENT STATUS & TIPS */}
            <aside className="sp-sidebar" aria-label="Placement Status and Application Tips">
              {/* 1. MY PLACEMENT STATUS WIDGET */}
              <div className="sp-side-card">
                <div className="sp-side-header">
                  <div className="sp-side-title-group">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.4">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      <line x1="12" y1="11" x2="12" y2="17" />
                      <line x1="9" y1="14" x2="15" y2="14" />
                    </svg>
                    <h3 className="sp-side-title">My Placement Status</h3>
                  </div>
                  <button
                    type="button"
                    className="sp-side-link-btn"
                    onClick={() => setActiveTab('status')}
                  >
                    View All
                  </button>
                </div>

                <div className="sp-status-list">
                  <div className="sp-status-row">
                    <div className="sp-status-left">
                      <div className="sp-status-icon-box applied">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                      </div>
                      <div className="sp-status-info">
                        <span className="sp-status-title">Applied Drives</span>
                        <span className="sp-status-subtitle">Profiles sent to recruiters</span>
                      </div>
                    </div>
                    <span className="sp-status-count applied">{metrics.applied}</span>
                  </div>

                  <div className="sp-status-row">
                    <div className="sp-status-left">
                      <div className="sp-status-icon-box shortlisted">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                      <div className="sp-status-info">
                        <span className="sp-status-title">Shortlisted / Tests</span>
                        <span className="sp-status-subtitle">Online test link active</span>
                      </div>
                    </div>
                    <span className="sp-status-count shortlisted">{metrics.shortlisted}</span>
                  </div>

                  <div className="sp-status-row">
                    <div className="sp-status-left">
                      <div className="sp-status-icon-box interview">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </div>
                      <div className="sp-status-info">
                        <span className="sp-status-title">Technical Interviews</span>
                        <span className="sp-status-subtitle">Panel rounds in progress</span>
                      </div>
                    </div>
                    <span className="sp-status-count interview">{metrics.interviews}</span>
                  </div>

                  <div className={`sp-status-row ${approvedOffers.length > 0 ? 'has-offers' : ''}`}>
                    <div className="sp-status-left">
                      <div className="sp-status-icon-box offers">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <div className="sp-status-info">
                        <span className="sp-status-title">Offer Letters</span>
                        <span className="sp-status-subtitle">
                          {approvedOffers.length > 0
                            ? `${approvedOffers.length} letter${approvedOffers.length > 1 ? 's' : ''} available`
                            : 'Final selection confirmed'}
                        </span>
                      </div>
                    </div>
                    <span className="sp-status-count offers">{metrics.offers}</span>
                  </div>
                </div>

                {approvedOffers.length > 0 && (
                  <div className="sp-offers-sublist">
                    {approvedOffers.map((offer) => (
                      <div key={offer.placementId} className="sp-offer-item">
                        <div className="sp-offer-item-header">
                          <div className="sp-oli-comp-wrap">
                            <span className="sp-offer-company">{offer.company}</span>
                            <span className="sp-offer-role">{offer.role}</span>
                          </div>
                          <span className="sp-offer-package">{offer.package}</span>
                        </div>
                        <div className="sp-offer-actions">
                          <button
                            type="button"
                            className="sp-btn-offer-view"
                            onClick={(e) => {
                              e.stopPropagation()
                              setViewingOfferLetter(offer)
                            }}
                            title="View official offer letter preview"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            View
                          </button>
                          <button
                            type="button"
                            className="sp-btn-offer-download"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadOfferLetter(offer)
                            }}
                            title="Download official offer letter"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download Offer Letter
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. PLACEMENT APPLICATION TIPS WIDGET */}
              <div className="sp-side-card">
                <div className="sp-side-header">
                  <div className="sp-side-title-group">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b3881e" strokeWidth="2.4">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <h3 className="sp-side-title">Placement Application Tips</h3>
                  </div>
                </div>

                <div className="sp-tips-list">
                  <div className="sp-tip-item">
                    <span className="sp-tip-num">1</span>
                    <div className="sp-tip-content">
                      <strong className="sp-tip-title">Verified Institutional Records</strong>
                      <p className="sp-tip-text">
                        Visiting recruiters and HR teams screen your authenticated CGPA, academic transcripts, and official backlogs ledger directly.
                      </p>
                    </div>
                  </div>

                  <div className="sp-tip-item">
                    <span className="sp-tip-num">2</span>
                    <div className="sp-tip-content">
                      <strong className="sp-tip-title">Direct 1-Click Verification</strong>
                      <p className="sp-tip-text">
                        No manual CV upload needed. Your verified portal credentials, faculty-reviewed projects, and verified skill badges transmit automatically with your application.
                      </p>
                    </div>
                  </div>

                  <div className="sp-tip-item">
                    <span className="sp-tip-num">3</span>
                    <div className="sp-tip-content">
                      <strong className="sp-tip-title">All Academic Disciplines</strong>
                      <p className="sp-tip-text">
                        Accredited core drives are active across Mechanical, Civil, Electrical, Chemical, Biotechnology, Instrumentation, Automobile, and CS/IT departments.
                      </p>
                    </div>
                  </div>

                  <div className="sp-tip-item">
                    <span className="sp-tip-num">4</span>
                    <div className="sp-tip-content">
                      <strong className="sp-tip-title">Pre-Placement Talk (PPT) Mandate</strong>
                      <p className="sp-tip-text">
                        Attending the scheduled pre-placement presentation is mandatory for technical interview eligibility under institutional placement policies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* MODAL 1: VIEW DETAILS MODAL */}
      {detailsModalItem && (
        <div className="sp-modal-overlay" role="dialog" aria-modal="true">
          <div className="sp-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="sp-modal-header">
              <div className="sp-modal-header-info">
                <div
                  className="sp-company-logo"
                  style={{ width: 38, height: 38, fontSize: '0.9rem', backgroundColor: detailsModalItem.companyLogoBg || '#112233' }}
                >
                  {detailsModalItem.companyLogoText || detailsModalItem.company.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="sp-modal-title">{detailsModalItem.role}</h2>
                  <p className="sp-modal-subtitle">
                    {detailsModalItem.company} • {detailsModalItem.department} • {detailsModalItem.driveType}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="sp-modal-close-btn"
                onClick={() => setDetailsModalItem(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="sp-modal-body">
              {/* Key Summary Matrix */}
              <div className="sp-details-grid">
                <div className="sp-details-item">
                  <span className="sp-details-item-label">CTC Annual Package</span>
                  <span className="sp-details-item-val" style={{ color: '#047857' }}>{detailsModalItem.package}</span>
                </div>
                <div className="sp-details-item">
                  <span className="sp-details-item-label">Work Mode</span>
                  <span className="sp-details-item-val">{detailsModalItem.type}</span>
                </div>
                <div className="sp-details-item">
                  <span className="sp-details-item-label">Location</span>
                  <span className="sp-details-item-val">{detailsModalItem.location}</span>
                </div>
                <div className="sp-details-item">
                  <span className="sp-details-item-label">Minimum CGPA</span>
                  <span className="sp-details-item-val">{detailsModalItem.minCgpa}</span>
                </div>
                <div className="sp-details-item">
                  <span className="sp-details-item-label">Openings</span>
                  <span className="sp-details-item-val">{detailsModalItem.openings} positions</span>
                </div>
                <div className="sp-details-item">
                  <span className="sp-details-item-label">Service Agreement / Bond</span>
                  <span className="sp-details-item-val">{detailsModalItem.bond || 'None'}</span>
                </div>
              </div>

              {/* Compensation Breakdown */}
              {detailsModalItem.packageBreakdown && (
                <div className="sp-details-section">
                  <h4 className="sp-details-section-title">Compensation Breakdown</h4>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.82rem' }}>
                    <div><strong>Fixed Base Component:</strong> {detailsModalItem.packageBreakdown.base}</div>
                    <div><strong>Variable / Performance Component:</strong> {detailsModalItem.packageBreakdown.variable}</div>
                    <div><strong>Joining &amp; Perks:</strong> {detailsModalItem.packageBreakdown.perks}</div>
                  </div>
                </div>
              )}

              {/* Role Overview */}
              <div className="sp-details-section">
                <h4 className="sp-details-section-title">Role Overview &amp; Department Mission</h4>
                <p className="sp-details-text">{detailsModalItem.overview}</p>
              </div>

              {/* Responsibilities */}
              <div className="sp-details-section">
                <h4 className="sp-details-section-title">Key Engineering Responsibilities</h4>
                <ul className="sp-details-bullets">
                  {detailsModalItem.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Selection Process */}
              <div className="sp-details-section">
                <h4 className="sp-details-section-title">Selection &amp; Evaluation Rounds</h4>
                <div className="sp-rounds-list">
                  {detailsModalItem.selectionRounds.map((round, idx) => (
                    <div key={idx} className="sp-round-step">
                      <span className="sp-round-num">{idx + 1}</span>
                      <span>{round}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corporate Benefits */}
              {detailsModalItem.benefits && (
                <div className="sp-details-section">
                  <h4 className="sp-details-section-title">Corporate Perks &amp; Learning Benefits</h4>
                  <ul className="sp-details-bullets">
                    {detailsModalItem.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="sp-modal-footer">
              <button
                type="button"
                className="sp-btn-view"
                onClick={() => setDetailsModalItem(null)}
              >
                Close
              </button>

              {isApplied(detailsModalItem.id) ? (
                <button type="button" className="sp-btn-applied" disabled>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Already Applied
                </button>
              ) : (
                <button
                  type="button"
                  className="sp-btn-apply"
                  onClick={() => {
                    const item = detailsModalItem
                    setDetailsModalItem(null)
                    setApplyModalItem(item)
                  }}
                >
                  Apply via Placement Cell →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 1-CLICK VERIFIED APPLICATION MODAL (NO CV UPLOAD NEEDED) */}
      {applyModalItem && (
        <div className="sp-modal-overlay" role="dialog" aria-modal="true">
          <div className="sp-modal-container" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
            <div className="sp-modal-header">
              <div>
                <h2 className="sp-modal-title">Apply for Placement Opportunity</h2>
                <p className="sp-modal-subtitle">
                  {applyModalItem.company} • {applyModalItem.role} ({applyModalItem.package})
                </p>
              </div>
              <button
                type="button"
                className="sp-modal-close-btn"
                onClick={() => setApplyModalItem(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="sp-modal-body">
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.2" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <div style={{ fontSize: '0.8rem', color: '#166534', lineHeight: 1.45 }}>
                  <strong>Verified Institutional Transmission:</strong> No external resume upload is necessary. Your verified IAS portal academic records, CGPA, institutional transcripts, and approved project credentials will be transmitted directly with this application.
                </div>
              </div>

              {/* Student Verified Dossier Summary */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem' }}>
                <div style={{ fontWeight: 800, color: '#0f1d2f', borderBottom: '1px solid #e2e8f0', paddingBottom: 6 }}>
                  Verified Candidate Credentials
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  <div><strong>Student Name:</strong> {studentName}</div>
                  <div><strong>Roll / Enrolment ID:</strong> {studentRoll}</div>
                  <div><strong>Academic Department:</strong> {studentBranch}</div>
                  <div><strong>Cumulative CGPA:</strong> {studentCgpa} / 10.0</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Institution:</strong> {studentCollege}</div>
                </div>
              </div>

              {/* Optional Note for Placement Cell */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="sp-app-note" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                  Candidate Remarks / Core Specialization Focus (Optional)
                </label>
                <textarea
                  id="sp-app-note"
                  rows={3}
                  placeholder="e.g. Completed specialized coursework in Power Electronics & Embedded Systems. Actively prepared for Round 1 technical evaluation."
                  value={applicationNote}
                  onChange={(e) => setApplicationNote(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.82rem', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>
            </div>

            <div className="sp-modal-footer">
              <button
                type="button"
                className="sp-btn-view"
                onClick={() => setApplyModalItem(null)}
                disabled={isApplying}
              >
                Cancel
              </button>
              <button
                type="button"
                className="sp-btn-apply"
                onClick={handleConfirmApply}
                disabled={isApplying}
              >
                {isApplying ? 'Transmitting Credentials...' : 'Submit Application via T&P Cell →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: OFFICIAL OFFER LETTER PREVIEW MODAL */}
      {viewingOfferLetter && (
        <div className="sp-modal-overlay" role="dialog" aria-modal="true">
          <div className="sp-modal-container" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
            <div className="sp-modal-header">
              <div>
                <h2 className="sp-modal-title">Official Placement Selection Notice</h2>
                <p className="sp-modal-subtitle">{viewingOfferLetter.company} • {viewingOfferLetter.package}</p>
              </div>
              <button
                type="button"
                className="sp-modal-close-btn"
                onClick={() => setViewingOfferLetter(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="sp-modal-body" style={{ background: '#fdfbf7', padding: '24px 28px', border: '1px solid #e0c885', margin: 16, borderRadius: 6, fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 1.6 }}>
              <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '1rem', marginBottom: 12, color: '#0f1d2f' }}>
                OFFICE OF CAMPUS RECRUITMENT &amp; TALENT ACQUISITION
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#b3881e' }}>{viewingOfferLetter.company.toUpperCase()}</div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '12px 0' }} />
              <div><strong>Date:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div><strong>Candidate Name:</strong> {studentName}</div>
              <div><strong>Institution:</strong> {studentCollege}</div>
              <div><strong>Department:</strong> {viewingOfferLetter.department || studentBranch}</div>
              <div><strong>Designation:</strong> {viewingOfferLetter.role}</div>
              <div><strong>Annual Compensation (CTC):</strong> {viewingOfferLetter.package}</div>
              <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '12px 0' }} />
              <p>
                We are pleased to inform you that based on your performance in the on-campus recruitment drive and evaluation of your authenticated academic credentials through the IAS Collaboration Portal, you have been selected for full-time employment.
              </p>
              <p>
                Formal joining documentation, onboarding instructions, and medical guidelines will be dispatched through your institutional Training &amp; Placement coordinator.
              </p>
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <strong>Head of Talent Acquisition</strong><br />
                  {viewingOfferLetter.company}
                </div>
                <div style={{ textAlign: 'right', color: '#166534', fontWeight: 700 }}>
                  [AUTHENTICATED DIGITAL RECORD]
                </div>
              </div>
            </div>

            <div className="sp-modal-footer">
              <button
                type="button"
                className="sp-btn-view"
                onClick={() => setViewingOfferLetter(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="sp-btn-offer-download"
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                onClick={() => handleDownloadOfferLetter(viewingOfferLetter)}
                title="Download official offer letter"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Offer Letter
              </button>
              <button
                type="button"
                className="sp-btn-apply"
                onClick={() => {
                  window.print()
                }}
              >
                Print / Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST MESSAGE */}
      {toastMessage && (
        <div className="sp-toast" role="status">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
