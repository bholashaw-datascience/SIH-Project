import { useState, useMemo, useEffect } from 'react'
import './StudentInternships.css'

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

// Date & Time formatting helper for internship postings
// Example output: "Posted 18 Sep 2026, 6:30 PM"
export function formatPostedDateTime(dateInput, postedDaysAgo = 0) {
  let date
  if (!dateInput) {
    // Deterministic realistic time anchored to simulated today: 18 Sep 2026
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
// - If > 2 days away: normal date e.g. "Closes 20 Oct 2026"
// - If <= 2 days away: compact live countdown e.g. "Closes in 1d 8h" or "Closes in 6h 25m"
// - If today: remaining hours/minutes e.g. "Closes in 4h 29m"
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

  if (diffMs <= 0) {
    return 'Closed'
  }

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(totalHours / 24)
  const remainingHours = totalHours % 24
  const remainingMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  // 2 days or less remain (<= 48 hours)
  if (diffMs <= 2 * 24 * 60 * 60 * 1000) {
    if (diffDays >= 1) {
      return `Closes in ${diffDays}d ${remainingHours}h`
    }
    if (remainingHours >= 1) {
      return `Closes in ${remainingHours}h ${remainingMinutes}m`
    }
    return `Closes in ${remainingMinutes}m`
  }

  // More than 2 days away: Show normal formatted date, e.g. "Closes 20 Oct 2026"
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


// Comprehensive Verified Opportunities across ALL Academic Engineering Departments
const INITIAL_INTERNSHIPS = [
  // 1. MECHANICAL
  {
    id: 'int_mech_01',
    postedAt: '2026-09-17T16:45:00+05:30',
    postedDateTime: 'Posted 17 Sep 2026, 4:45 PM',
    company: 'Tata Motors',
    companyLogoBg: '#0f4c81',
    companyLogoText: 'TM',
    verifiedCompany: true,
    role: 'Mechanical Design & CAE Simulation Intern',
    department: 'Mechanical',
    duration: '6 Months',
    durationMonths: 6,
    stipend: '₹35,000 / month',
    stipendAmount: 35000,
    type: 'On-site',
    location: 'Pune, Maharashtra',
    requiredSkills: ['SolidWorks', 'CATIA', 'ANSYS', 'FEA', 'GD&T', 'Thermodynamics'],
    postedDate: '1 day ago',
    postedDaysAgo: 1,
    deadline: '2026-10-22',
    displayDeadline: '22 Oct 2026',
    isUrgent: false,
    openings: 10,
    eligibility: 'B.Tech / B.E. in Mechanical or Production Engineering with CGPA ≥ 7.2',
    minCgpa: 7.2,
    overview: 'Work with the Vehicle Engineering Group at Tata Motors to conduct Finite Element Analysis (FEA), structural rigidity assessments, and 3D parametric CAD modeling for modern commercial vehicle chassis.',
    responsibilities: [
      'Perform static and dynamic structural FEA simulations using ANSYS Workbench.',
      'Generate production-ready 2D manufacturing drawings with strict GD&T tolerances.',
      'Collaborate with manufacturing line engineers during prototype assembly validation.',
      'Conduct thermal dissipation checks on vehicle powertrain enclosures.'
    ],
    perks: ['Pre-Placement Offer (PPO) potential', 'Direct industrial CAD workstation access', 'Official Institutional NOC & Certificate', 'Subsidized campus accommodation in Pune'],
    selectionProcess: 'Profile Screening → Mechanical CAD & Mechanics Test → Technical Interview → HR Onboarding'
  },
  {
    id: 'int_mech_02',
    postedAt: '2026-09-15T11:20:00+05:30',
    postedDateTime: 'Posted 15 Sep 2026, 11:20 AM',
    company: 'Thermax Global',
    companyLogoBg: '#c2410c',
    companyLogoText: 'TX',
    verifiedCompany: true,
    role: 'Thermal Systems & Energy Engineering Intern',
    department: 'Mechanical',
    duration: '3 Months',
    durationMonths: 3,
    stipend: '₹30,000 / month',
    stipendAmount: 30000,
    type: 'On-site',
    location: 'Pune, Maharashtra',
    requiredSkills: ['Thermal Engineering', 'CFD', 'Fluid Dynamics', 'AutoCAD', 'Heat Transfer'],
    postedDate: '3 days ago',
    postedDaysAgo: 3,
    deadline: '2026-11-05',
    displayDeadline: '05 Nov 2026',
    isUrgent: false,
    openings: 6,
    eligibility: 'B.Tech in Mechanical, Energy, or Chemical Engineering with CGPA ≥ 7.0',
    minCgpa: 7.0,
    overview: 'Design industrial heat exchangers, waste-heat recovery units, and sustainable boiler subsystems supporting clean energy transition across heavy industrial plants.',
    responsibilities: [
      'Model fluid flow and thermal gradients in heat exchange tubes using CFD software.',
      'Prepare P&ID and thermodynamic mass and heat balance calculations.',
      'Participate in energy efficiency audits for institutional client installations.'
    ],
    perks: ['Hands-on laboratory & plant trials', 'Mentorship by Chief Thermal Architect', 'Institutional Credit Sign-off'],
    selectionProcess: 'Academic Review → Fluid & Thermal Concepts Assessment → Technical Discussion'
  },

  // 2. ELECTRICAL / ELECTRONICS
  {
    id: 'int_elec_01',
    postedAt: '2026-09-16T14:30:00+05:30',
    postedDateTime: 'Posted 16 Sep 2026, 2:30 PM',
    company: 'Texas Instruments India',
    companyLogoBg: '#cc0000',
    companyLogoText: 'TI',
    verifiedCompany: true,
    role: 'Analog & Digital VLSI Design Intern',
    department: 'Electrical / Electronics',
    duration: '6 Months',
    durationMonths: 6,
    stipend: '₹90,000 / month',
    stipendAmount: 90000,
    type: 'On-site',
    location: 'Bengaluru, Karnataka',
    requiredSkills: ['Verilog', 'VLSI', 'Cadence', 'CMOS Analog', 'Circuit Design', 'FPGA'],
    postedDate: '2 days ago',
    postedDaysAgo: 2,
    deadline: '2026-10-18',
    displayDeadline: '18 Oct 2026',
    isUrgent: false,
    openings: 8,
    eligibility: 'B.Tech/M.Tech in ECE, EEE, Microelectronics with CGPA ≥ 8.0, 0 active backlogs',
    minCgpa: 8.0,
    overview: 'Join the Semiconductor Design Unit to simulate low-power CMOS mixed-signal integrated circuits, perform timing verification, and assist in silicon tape-out validation.',
    responsibilities: [
      'Write synthesizable RTL in SystemVerilog for high-speed serial bus controllers.',
      'Simulate analog operational amplifiers and voltage regulators in Cadence Virtuoso.',
      'Execute static timing analysis (STA) and formal functional verification testbenches.',
      'Debug test chip silicon prototypes using high-bandwidth digital oscilloscopes.'
    ],
    perks: ['Fast-track PPO evaluation (CTC ₹28+ LPA)', 'High-performance compute cluster access', 'Dedicated Senior Silicon Mentor', 'Full wellness stipend'],
    selectionProcess: 'Profile Screening → TI Online Aptitude & Circuit Test → Technical Interview (2 rounds) → HR Alignment'
  },
  {
    id: 'int_elec_02',
    postedAt: '2026-09-14T10:15:00+05:30',
    postedDateTime: 'Posted 14 Sep 2026, 10:15 AM',
    company: 'Schneider Electric',
    companyLogoBg: '#059669',
    companyLogoText: 'SE',
    verifiedCompany: true,
    role: 'Power Systems & Smart Grid Automation Intern',
    department: 'Electrical / Electronics',
    duration: '3 Months',
    durationMonths: 3,
    stipend: '₹38,000 / month',
    stipendAmount: 38000,
    type: 'Hybrid',
    location: 'Vadodara / Bengaluru',
    requiredSkills: ['Power Systems', 'MATLAB/Simulink', 'PLC', 'SCADA', 'Switchgear'],
    postedDate: '4 days ago',
    postedDaysAgo: 4,
    deadline: '2026-10-28',
    displayDeadline: '28 Oct 2026',
    isUrgent: false,
    openings: 7,
    eligibility: 'B.Tech in Electrical & Electronics Engineering (EEE) or Power Systems with CGPA ≥ 7.2',
    minCgpa: 7.2,
    overview: 'Develop automation logic for smart substations, microgrid telemetry gateways, and numerical protection relays driving industrial decarbonization.',
    responsibilities: [
      'Simulate microgrid stability and load shedding sequences using MATLAB/Simulink.',
      'Configure Modbus and IEC 61850 communication profiles for smart energy meters.',
      'Assist in commissioning switchgear protection panels at customer demonstration sites.'
    ],
    perks: ['Smart Grid Certification Voucher', 'PPO Opportunity', 'Corporate mentorship by Power Systems Lead'],
    selectionProcess: 'Application Review → Technical Quiz on Power Electronics → Technical Interview'
  },

  // 3. CIVIL
  {
    id: 'int_civil_01',
    postedAt: '2026-09-15T15:00:00+05:30',
    postedDateTime: 'Posted 15 Sep 2026, 3:00 PM',
    company: 'Larsen & Toubro (L&T Construction)',
    companyLogoBg: '#1e3a8a',
    companyLogoText: 'LT',
    verifiedCompany: true,
    role: 'Structural Design & Site Engineering Intern',
    department: 'Civil',
    duration: '6 Months',
    durationMonths: 6,
    stipend: '₹32,000 / month',
    stipendAmount: 32000,
    type: 'On-site',
    location: 'Mumbai / Chennai',
    requiredSkills: ['STAAD.Pro', 'AutoCAD', 'ETABS', 'Concrete Technology', 'Quantity Surveying', 'GIS'],
    postedDate: '3 days ago',
    postedDaysAgo: 3,
    deadline: '2026-10-24',
    displayDeadline: '24 Oct 2026',
    isUrgent: false,
    openings: 15,
    eligibility: 'B.Tech in Civil Engineering with CGPA ≥ 7.0, sound structural analysis fundamentals',
    minCgpa: 7.0,
    overview: 'Participate in the structural modeling, rebar detailing, and on-site quality compliance monitoring for high-speed transit viaducts and smart-city commercial infrastructure.',
    responsibilities: [
      'Perform structural finite element load analysis using STAAD.Pro and ETABS.',
      'Review BBS (Bar Bending Schedules) and shop drawings against IS 456 / Eurocodes.',
      'Conduct non-destructive testing (NDT) of high-performance reinforced concrete structures.',
      'Track physical project milestones using Primavera and Building Information Modeling (BIM).'
    ],
    perks: ['L&T Build India Scholarship evaluation', 'Site safety and BIM certifications', 'Official institutional credit accreditation', 'On-site accommodation and mess allowance'],
    selectionProcess: 'Institutional Nomination → Structural Engineering Aptitude Test → Panel Interview'
  },
  {
    id: 'int_civil_02',
    postedAt: '2026-09-13T09:30:00+05:30',
    postedDateTime: 'Posted 13 Sep 2026, 9:30 AM',
    company: 'Afcons Infrastructure',
    companyLogoBg: '#b45309',
    companyLogoText: 'AF',
    verifiedCompany: true,
    role: 'Geotechnical & Highway Infrastructure Intern',
    department: 'Civil',
    duration: '3 Months',
    durationMonths: 3,
    stipend: '₹28,000 / month',
    stipendAmount: 28000,
    type: 'On-site',
    location: 'Kolkata / Delhi NCR',
    requiredSkills: ['Soil Mechanics', 'Total Station', 'Highway Engineering', 'MS Project', 'Surveying'],
    postedDate: '5 days ago',
    postedDaysAgo: 5,
    deadline: '2026-11-10',
    displayDeadline: '10 Nov 2026',
    isUrgent: false,
    openings: 9,
    eligibility: 'B.Tech / Diploma in Civil Engineering with CGPA ≥ 6.8',
    minCgpa: 6.8,
    overview: 'Analyze soil bearing capacity, slope stability, and pavement design parameters for elevated expressway and urban tunneling projects.',
    responsibilities: [
      'Collect and log soil core samples for standard penetration tests (SPT).',
      'Compute pavement layer thickness using IRC standards and geotechnical software.',
      'Assist senior surveyors in setting out alignment curves using robotic Total Stations.'
    ],
    perks: ['Hands-on geotechnical laboratory exposure', 'Direct project recommendation letter', 'PPO consideration'],
    selectionProcess: 'Profile Review → Geotechnical Fundamentals Test → Video Interview'
  },

  // 4. CHEMICAL
  {
    id: 'int_chem_01',
    postedAt: '2026-09-17T18:30:00+05:30',
    postedDateTime: 'Posted 17 Sep 2026, 6:30 PM',
    company: 'Reliance Industries Limited (RIL)',
    companyLogoBg: '#0f766e',
    companyLogoText: 'RL',
    verifiedCompany: true,
    role: 'Process Engineering & Petrochemical Refining Intern',
    department: 'Chemical',
    duration: '6 Months',
    durationMonths: 6,
    stipend: '₹42,000 / month',
    stipendAmount: 42000,
    type: 'On-site',
    location: 'Jamnagar / Hazira, Gujarat',
    requiredSkills: ['Aspen Plus', 'Heat & Mass Transfer', 'Process Safety (HAZOP)', 'Distillation', 'MATLAB'],
    postedDate: 'Yesterday',
    postedDaysAgo: 1,
    deadline: '2026-10-20',
    displayDeadline: '20 Oct 2026',
    isUrgent: true,
    openings: 12,
    eligibility: 'B.Tech in Chemical Engineering or Petrochemical Technology with CGPA ≥ 7.5',
    minCgpa: 7.5,
    overview: 'Work in the world’s largest refining and petrochemical complex to simulate continuous distillation columns, optimize mass transfer kinetics, and model carbon-capture streams in Aspen Plus.',
    responsibilities: [
      'Build steady-state flowsheet simulations for cracking and fractionation units in Aspen Plus.',
      'Calculate pressure drop across catalyst beds, control valves, and heat exchanger trains.',
      'Participate in safety and environmental HAZOP reviews for new unit installations.',
      'Collect pilot plant samples and analyze chemical composition with gas chromatography.'
    ],
    perks: ['PPO Opportunity for 2027 batch', 'Free township accommodation and sports access', 'Reliance Innovation Credential', 'Mentorship by Chief Process Technologist'],
    selectionProcess: 'Academic Merit Screening → Chemical Process Assessment → Technical Panel Interview'
  },
  {
    id: 'int_chem_02',
    postedAt: '2026-09-12T13:45:00+05:30',
    postedDateTime: 'Posted 12 Sep 2026, 1:45 PM',
    company: 'Aarti Industries Limited',
    companyLogoBg: '#7c3aed',
    companyLogoText: 'AI',
    verifiedCompany: true,
    role: 'Specialty Chemicals & Reaction Engineering Intern',
    department: 'Chemical',
    duration: '3 Months',
    durationMonths: 3,
    stipend: '₹30,000 / month',
    stipendAmount: 30000,
    type: 'On-site',
    location: 'Vapi, Gujarat',
    requiredSkills: ['Chemical Kinetics', 'Unit Operations', 'Industrial Safety', 'P&ID', 'Quality Control'],
    postedDate: '6 days ago',
    postedDaysAgo: 6,
    deadline: '2026-11-02',
    displayDeadline: '02 Nov 2026',
    isUrgent: false,
    openings: 5,
    eligibility: 'B.Tech in Chemical Engineering or Industrial Chemistry with CGPA ≥ 7.0',
    minCgpa: 7.0,
    overview: 'Formulate specialty intermediates, scale continuous batch reactors, and optimize crystallization yields in compliant pharmaceutical and agrochemical production lines.',
    responsibilities: [
      'Optimize temperature and pressure profiles for multi-step exothermic chlorination reactions.',
      'Evaluate material balances and solvent recovery efficiencies to reduce carbon footprints.',
      'Draft Standard Operating Procedures (SOP) according to OSHA and cGMP guidelines.'
    ],
    perks: ['Specialty chemical plant training', 'Institutional NOC sign-off', 'Safety certification voucher'],
    selectionProcess: 'Profile Evaluation → Organic Reaction Kinetics Test → Technical Discussion'
  },

  // 5. INSTRUMENTATION
  {
    id: 'int_inst_01',
    postedAt: '2026-09-16T16:00:00+05:30',
    postedDateTime: 'Posted 16 Sep 2026, 4:00 PM',
    company: 'Honeywell Automation',
    companyLogoBg: '#dc2626',
    companyLogoText: 'HW',
    verifiedCompany: true,
    role: 'Industrial Process Instrumentation & Control Intern',
    department: 'Instrumentation',
    duration: '6 Months',
    durationMonths: 6,
    stipend: '₹45,000 / month',
    stipendAmount: 45000,
    type: 'Hybrid',
    location: 'Pune / Bengaluru',
    requiredSkills: ['PLC/SCADA', 'DCS', 'Process Control', 'Sensors & Transducers', 'LabVIEW', 'Industrial IoT'],
    postedDate: '2 days ago',
    postedDaysAgo: 2,
    deadline: '2026-10-26',
    displayDeadline: '26 Oct 2026',
    isUrgent: false,
    openings: 8,
    eligibility: 'B.Tech in Instrumentation, Electronics & Instrumentation, or Mechatronics with CGPA ≥ 7.2',
    minCgpa: 7.2,
    overview: 'Program Distributed Control Systems (DCS) and safety-critical PLC logic for refineries, pharmaceutical plants, and smart building energy management systems.',
    responsibilities: [
      'Configure Experion PKS DCS loop algorithms, PID tuning constants, and alarms.',
      'Calibrate smart pressure, temperature, and Coriolis mass flow transducers.',
      'Design Human-Machine Interface (HMI) graphics for real-time plant telemetry monitoring.',
      'Integrate OPC UA protocols to transfer edge instrument data to cloud analytics.'
    ],
    perks: ['Honeywell Connected Enterprise Credential', 'Fast-track PPO evaluation', 'Hybrid work setup stipend', 'Official Academic NOC'],
    selectionProcess: 'Resume Audit → Instrumentation & Logic Quiz → Technical Interview with DCS Lead'
  },
  {
    id: 'int_06',
    postedAt: '2026-09-14T11:30:00+05:30',
    postedDateTime: 'Posted 14 Sep 2026, 11:30 AM',
    company: 'Siemens Healthineers',
    companyLogoBg: '#0d9488',
    companyLogoText: 'SH',
    verifiedCompany: true,
    role: 'Embedded Systems & Biomedical Instrumentation Intern',
    department: 'Instrumentation',
    duration: '6 Months',
    durationMonths: 6,
    stipend: '₹35,000 / month',
    stipendAmount: 35000,
    type: 'On-site',
    location: 'Bengaluru, Karnataka',
    requiredSkills: ['Embedded C', 'C++', 'RTOS', 'Microcontrollers', 'IoT Protocols', 'Sensors & Transducers'],
    postedDate: '4 days ago',
    postedDaysAgo: 4,
    deadline: '2026-11-01',
    displayDeadline: '01 Nov 2026',
    isUrgent: false,
    openings: 5,
    eligibility: 'B.Tech/B.E. in Instrumentation, ECE, EEE, or Biomedical Engineering. CGPA ≥ 7.2.',
    minCgpa: 7.2,
    overview: 'Work on cutting-edge diagnostic equipment firmware, embedded telemetry sensors, and safety-critical RTOS routines that power medical imaging and patient monitors.',
    responsibilities: [
      'Develop embedded device drivers for SPI, I2C, and UART serial peripherals.',
      'Write low-level firmware in Embedded C adhering to ISO medical safety standards.',
      'Debug hardware-firmware timing interfaces using digital oscilloscopes and logic analyzers.',
      'Participate in hardware-in-the-loop (HIL) automated validation suites.'
    ],
    perks: ['Hands-on laboratory access with medical-grade hardware', 'Published institutional project credit', 'PPO Consideration', 'Full health insurance coverage'],
    selectionProcess: 'Resume Screening → Embedded C Technical Quiz → Lab Simulation Assessment → Panel Interview'
  },

  // 6. AUTOMOBILE
  {
    id: 'int_auto_01',
    postedAt: '2026-09-15T12:15:00+05:30',
    postedDateTime: 'Posted 15 Sep 2026, 12:15 PM',
    company: 'Mahindra & Mahindra EV Division',
    companyLogoBg: '#be123c',
    companyLogoText: 'MM',
    verifiedCompany: true,
    role: 'Electric Vehicle Powertrain & Battery Systems Intern',
    department: 'Automobile',
    duration: '6 Months',
    durationMonths: 6,
    stipend: '₹40,000 / month',
    stipendAmount: 40000,
    type: 'On-site',
    location: 'Chennai, Tamil Nadu',
    requiredSkills: ['BMS', 'EV Powertrain', 'MATLAB/Simulink', 'Vehicle Dynamics', 'CAN Protocol', 'Motor Drives'],
    postedDate: '3 days ago',
    postedDaysAgo: 3,
    deadline: '2026-10-30',
    displayDeadline: '30 Oct 2026',
    isUrgent: false,
    openings: 10,
    eligibility: 'B.Tech in Automobile, Mechanical, or Electrical Engineering with CGPA ≥ 7.2',
    minCgpa: 7.2,
    overview: 'Architect Battery Management System (BMS) cell balancing algorithms, model regenerative braking kinematics, and evaluate thermal runaway mitigation for next-gen electric SUVs.',
    responsibilities: [
      'Simulate high-voltage Li-ion battery pack discharge curves in MATLAB/Simulink.',
      'Develop CAN communication nodes for motor controller and battery pack sensors.',
      'Conduct dynamometer test runs on prototype permanent magnet synchronous motors (PMSM).',
      'Analyze vehicle crash test kinematics and battery enclosure deformation profiles.'
    ],
    perks: ['Hands-on exposure to Mahindra EV test tracks in MRV Chennai', 'PPO Opportunity', 'Hostel accommodation allowance', 'Mentorship by Chief EV Architect'],
    selectionProcess: 'Profile Evaluation → EV Engineering Fundamentals Test → Technical Interview'
  },
  {
    id: 'int_auto_02',
    postedAt: '2026-09-14T15:45:00+05:30',
    postedDateTime: 'Posted 14 Sep 2026, 3:45 PM',
    company: 'Bosch Mobility Solutions',
    companyLogoBg: '#1e293b',
    companyLogoText: 'BS',
    verifiedCompany: true,
    role: 'ADAS & Automotive Embedded Testing Intern',
    department: 'Automobile',
    duration: '6 Months',
    durationMonths: 6,
    stipend: '₹48,000 / month',
    stipendAmount: 48000,
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    requiredSkills: ['AUTOSAR', 'CANoe', 'Automotive Ethernet', 'Python', 'Chassis Control', 'ADAS Sensors'],
    postedDate: '4 days ago',
    postedDaysAgo: 4,
    deadline: '2026-10-16',
    displayDeadline: '16 Oct 2026',
    isUrgent: true,
    openings: 7,
    eligibility: 'B.Tech in Automobile, ECE, or Computer Engineering with CGPA ≥ 7.5',
    minCgpa: 7.5,
    overview: 'Develop automated test scripts for Advanced Driver Assistance Systems (ADAS), automated emergency braking, and automotive radar/camera fusion modules.',
    responsibilities: [
      'Execute software-in-the-loop (SIL) test cases using Vector CANoe and Python automation.',
      'Validate radar sensor calibration and lane keep assist trigger algorithms on test benches.',
      'Analyze vehicle bus trace logs for latency and functional safety compliance (ISO 26262).'
    ],
    perks: ['Bosch Automotive Engineering Certificate', 'Pre-Placement Offer track', 'State-of-the-art ADAS testing lab access'],
    selectionProcess: 'Application Review → Automotive Electronics Test → Technical Video Interview'
  },

  // 7. BIOTECHNOLOGY
  {
    id: 'int_bio_01',
    postedAt: '2026-09-13T10:00:00+05:30',
    postedDateTime: 'Posted 13 Sep 2026, 10:00 AM',
    company: 'Biocon Biologics',
    companyLogoBg: '#047857',
    companyLogoText: 'BB',
    verifiedCompany: true,
    role: 'Bioprocess Development & Fermentation Intern',
    department: 'Biotechnology',
    duration: '6 Months',
    durationMonths: 6,
    stipend: '₹36,000 / month',
    stipendAmount: 36000,
    type: 'On-site',
    location: 'Bengaluru, Karnataka',
    requiredSkills: ['Bioreactors', 'Fermentation', 'Downstream Processing', 'HPLC', 'GMP Protocols', 'Bio-analytics'],
    postedDate: '5 days ago',
    postedDaysAgo: 5,
    deadline: '2026-10-29',
    displayDeadline: '29 Oct 2026',
    isUrgent: false,
    openings: 6,
    eligibility: 'B.Tech / M.Tech in Biotechnology, Biochemical Engineering, or Bioinformatics with CGPA ≥ 7.5',
    minCgpa: 7.5,
    overview: 'Operate pilot-scale microbial and mammalian cell culture bioreactors, optimize monoclonal antibody titers, and conduct chromatography purification in a cGMP facility.',
    responsibilities: [
      'Monitor pH, dissolved oxygen, and nutrient feed rates during batch fermentation cycles.',
      'Purify recombinant proteins using affinity chromatography and tangential flow filtration (TFF).',
      'Analyze sample purity and protein aggregation using HPLC and SDS-PAGE assays.',
      'Document experimental runs in compliant Electronic Lab Notebooks (ELN).'
    ],
    perks: ['Biocon Academy Certification', 'PPO Track for 2027 graduates', 'Hands-on cleanroom training', 'Institutional NOC accreditation'],
    selectionProcess: 'Academic Review → Biochemical & Molecular Biology Assessment → Scientist Panel Interview'
  },
  {
    id: 'int_bio_02',
    postedAt: '2026-09-11T14:30:00+05:30',
    postedDateTime: 'Posted 11 Sep 2026, 2:30 PM',
    company: 'Serum Institute of India',
    companyLogoBg: '#0284c7',
    companyLogoText: 'SI',
    verifiedCompany: true,
    role: 'Immunology & Quality Assurance Testing Intern',
    department: 'Biotechnology',
    duration: '3 Months',
    durationMonths: 3,
    stipend: '₹34,000 / month',
    stipendAmount: 34000,
    type: 'On-site',
    location: 'Pune, Maharashtra',
    requiredSkills: ['Microbiology', 'Cell Culture', 'PCR', 'ELISA', 'Bio-Safety', 'Documentation'],
    postedDate: '1 week ago',
    postedDaysAgo: 7,
    deadline: '2026-11-08',
    displayDeadline: '08 Nov 2026',
    isUrgent: false,
    openings: 8,
    eligibility: 'B.Tech/M.Sc in Biotechnology, Microbiology, or Life Sciences with CGPA ≥ 7.0',
    minCgpa: 7.0,
    overview: 'Conduct antibody titer quantification, sterility validation, and real-time PCR diagnostic assays for international vaccine manufacturing pipelines.',
    responsibilities: [
      'Execute high-throughput ELISA assays and spectrophotometric concentration measurements.',
      'Maintain primary mammalian cell lines under BSL-2 laminar air flow hoods.',
      'Prepare validation protocols for automated clean-in-place (CIP) autoclave sterilization.'
    ],
    perks: ['Global vaccine production facility exposure', 'Official Institutional Training Credential', 'Subsidized campus meals'],
    selectionProcess: 'Profile Screening → Biotechnology Knowledge Assessment → Technical Q&A'
  },

  // 8. COMPUTER SCIENCE / IT
  {
    id: 'int_01',
    postedAt: '2026-09-16T09:30:00+05:30',
    postedDateTime: 'Posted 16 Sep 2026, 9:30 AM',
    company: 'Microsoft India',
    companyLogoBg: '#0078d4',
    companyLogoText: 'MS',
    verifiedCompany: true,
    role: 'Software Engineering Intern',
    department: 'Computer Science / IT',
    duration: '3 Months',
    durationMonths: 3,
    stipend: '₹85,000 / month',
    stipendAmount: 85000,
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'Azure', 'Data Structures'],
    postedDate: '2 days ago',
    postedDaysAgo: 2,
    deadline: '2026-10-15',
    displayDeadline: '15 Oct 2026',
    isUrgent: false,
    openings: 12,
    eligibility: 'B.Tech / M.Tech in CSE, IT, ECE with CGPA ≥ 8.0, 0 active backlogs',
    minCgpa: 8.0,
    overview: 'Join the Core Cloud Platform team to design scalable distributed microservices, enhance Azure customer telemetry pipelines, and build resilient web frontends using modern React and TypeScript.',
    responsibilities: [
      'Collaborate with Senior Engineers to build resilient APIs and data ingest pipelines.',
      'Design modern, accessible UI components using React and Fluent UI.',
      'Write comprehensive unit, integration, and end-to-end performance tests.',
      'Participate in design reviews, daily agile standups, and institutional mentoring sessions.'
    ],
    perks: ['Pre-Placement Offer (PPO) potential', 'Health & Wellness stipend', 'Dedicated 1:1 Principal Engineer Mentor', 'Official Certificate of Academic Excellence'],
    selectionProcess: 'Profile Screening → Online Technical Assessment → Technical Interview (2 rounds) → HR Alignment'
  },
  {
    id: 'int_02',
    postedAt: '2026-09-17T17:15:00+05:30',
    postedDateTime: 'Posted 17 Sep 2026, 5:15 PM',
    company: 'Google India',
    companyLogoBg: '#ea4335',
    companyLogoText: 'G',
    verifiedCompany: true,
    role: 'AI & Machine Learning Research Intern',
    department: 'Computer Science / IT',
    duration: '6 Months',
    durationMonths: 6,
    stipend: '₹1,15,000 / month',
    stipendAmount: 115000,
    type: 'Hybrid',
    location: 'Bengaluru / Hyderabad',
    requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision'],
    postedDate: 'Yesterday',
    postedDaysAgo: 1,
    deadline: '2026-09-30',
    displayDeadline: '30 Sep 2026',
    isUrgent: true,
    openings: 6,
    eligibility: 'Pre-final & Final year B.Tech/Dual Degree with CGPA ≥ 8.5. Proven project work in ML/AI.',
    minCgpa: 8.5,
    overview: 'Work with world-class research scientists on multilingual language models, agricultural computer vision, and healthcare diagnostics AI for underserved communities.',
    responsibilities: [
      'Implement deep learning model architectures and evaluate on benchmark datasets.',
      'Clean, preprocess, and augment large-scale multimodal academic datasets.',
      'Contribute to research papers and open-source scientific toolkits.',
      'Profile and optimize model training throughput using distributed GPU/TPU clusters.'
    ],
    perks: ['Research Paper Co-authorship opportunity', 'Global Mentorship Network', 'Hardware Reimbursement', 'Fast-Track PPO Evaluation'],
    selectionProcess: 'Profile Audit → Coding & Math Assessment → Research Deep-Dive Interview → Final Committee Review'
  },
  {
    id: 'int_03',
    postedAt: '2026-09-15T16:45:00+05:30',
    postedDateTime: 'Posted 15 Sep 2026, 4:45 PM',
    company: 'Razorpay Technologies',
    companyLogoBg: '#0c2340',
    companyLogoText: 'RZ',
    verifiedCompany: true,
    role: 'Full Stack Web Developer Intern',
    department: 'Computer Science / IT',
    duration: '3 Months',
    durationMonths: 3,
    stipend: '₹45,000 / month',
    stipendAmount: 45000,
    type: 'Remote',
    location: 'Remote - India',
    requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    postedDate: '3 days ago',
    postedDaysAgo: 3,
    deadline: '2026-10-10',
    displayDeadline: '10 Oct 2026',
    isUrgent: false,
    openings: 8,
    eligibility: 'All Engineering disciplines with CGPA ≥ 7.0 and solid knowledge of Web Standards.',
    minCgpa: 7.0,
    overview: 'Help architect next-generation checkout interfaces and merchant settlement dashboard workflows that process millions of daily secure transactions across India.',
    responsibilities: [
      'Build responsive client interfaces with React, Next.js, and CSS modular systems.',
      'Develop secure, low-latency RESTful and GraphQL backend endpoints in Node.js.',
      'Work closely with Product Managers and UI/UX designers to implement pixel-perfect flows.',
      'Monitor error tracking pipelines and write automated regression test suites.'
    ],
    perks: ['100% Remote flexibility', 'Home-office setup allowance', 'PPO Opportunity for 2027 batch', 'Weekly tech talks with founding engineers'],
    selectionProcess: 'Application Review → Take-home Coding Challenge → Technical Discussion → Culture Fit'
  },
  {
    id: 'int_04',
    postedAt: '2026-09-13T14:00:00+05:30',
    postedDateTime: 'Posted 13 Sep 2026, 2:00 PM',
    company: 'Tata Consultancy Services (TCS)',
    companyLogoBg: '#1e3a8a',
    companyLogoText: 'TCS',
    verifiedCompany: true,
    role: 'Cloud Infrastructure & DevOps Intern',
    department: 'Computer Science / IT',
    duration: '6 Months',
    durationMonths: 6,
    stipend: '₹30,000 / month',
    stipendAmount: 30000,
    type: 'On-site',
    location: 'Pune, Maharashtra',
    requiredSkills: ['AWS', 'Linux', 'Docker', 'Kubernetes', 'Python', 'CI/CD'],
    postedDate: '5 days ago',
    postedDaysAgo: 5,
    deadline: '2026-10-25',
    displayDeadline: '25 Oct 2026',
    isUrgent: false,
    openings: 20,
    eligibility: 'B.Tech in CSE, IT, Electronics, Mechanical, Electrical with CGPA ≥ 7.0',
    minCgpa: 7.0,
    overview: 'Gain hands-on exposure to hyperscale enterprise cloud architecture, automated CI/CD deployment pipelines, container orchestration, and multi-region failover setups.',
    responsibilities: [
      'Assist in provisioning infrastructure as code (IaC) using Terraform and CloudFormation.',
      'Containerize enterprise Java and Python microservices using Docker and Helm.',
      'Configure Prometheus and Grafana alerts for real-time cluster health monitoring.',
      'Implement enterprise security compliance baselines and secret rotations.'
    ],
    perks: ['Formal TCS Digital Internship Credential', 'Dedicated Corporate Mentorship', 'Campus Placement Advantage', 'Free Cloud Certification Vouchers'],
    selectionProcess: 'Institutional Nomination → National Qualifier Test (NQT) → Technical Interview'
  },

  // 9. MULTIDISCIPLINARY / AEROSPACE
  {
    id: 'int_08',
    postedAt: '2026-09-11T11:00:00+05:30',
    postedDateTime: 'Posted 11 Sep 2026, 11:00 AM',
    company: 'ISRO Telemetry & Space Center',
    companyLogoBg: '#ea580c',
    companyLogoText: 'IS',
    verifiedCompany: true,
    role: 'Satellite Data & Remote Sensing Intern',
    department: 'Aerospace / Multidisciplinary',
    duration: '6 Months',
    durationMonths: 6,
    stipend: '₹25,000 / month',
    stipendAmount: 25000,
    type: 'On-site',
    location: 'Hyderabad, Telangana',
    requiredSkills: ['Python', 'NumPy', 'GIS', 'Remote Sensing', 'Data Analysis', 'SQL'],
    postedDate: '1 week ago',
    postedDaysAgo: 7,
    deadline: '2026-10-31',
    displayDeadline: '31 Oct 2026',
    isUrgent: false,
    openings: 7,
    eligibility: 'Pre-final or Final year B.Tech/M.Sc across all disciplines with strong math and programming. CGPA ≥ 7.5.',
    minCgpa: 7.5,
    overview: 'Participate in analyzing satellite imagery, atmospheric sensor telemetry, and geospatial GIS databases supporting national meteorological and resource planning missions.',
    responsibilities: [
      'Process high-resolution multispectral remote sensing raster files.',
      'Build statistical algorithms in Python for terrain classification and anomaly detection.',
      'Optimize geospatial queries using PostGIS and spatial index structures.',
      'Present findings in scientific progress reports for division scientists.'
    ],
    perks: ['Prestige of contributing to National Space Mission telemetry', 'Official Institutional Research Certificate', 'Hostel accommodation allowance', 'Mentorship by Space Scientists'],
    selectionProcess: 'Academic Merit Screening → Institute Recommendation Letter Audit → Technical Video Interview'
  }
]

// Department styling class helper
export const getDepartmentClass = (dept) => {
  if (!dept) return 'si-dept-default'
  const d = dept.toLowerCase()
  if (d.includes('mech')) return 'si-dept-mech'
  if (d.includes('elec')) return 'si-dept-elec'
  if (d.includes('civil')) return 'si-dept-civil'
  if (d.includes('chem')) return 'si-dept-chem'
  if (d.includes('inst')) return 'si-dept-inst'
  if (d.includes('auto')) return 'si-dept-auto'
  if (d.includes('bio')) return 'si-dept-bio'
  if (d.includes('comp') || d.includes('it')) return 'si-dept-cs'
  if (d.includes('aero') || d.includes('space')) return 'si-dept-aero'
  return 'si-dept-default'
}

export default function StudentInternships({ student = {}, onBack, onNavigateHome }) {
  // Navigation & View mode
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'remote' | 'on-site' | 'hybrid' | 'status'
  const [sortOption, setSortOption] = useState('latest') // 'latest' | 'stipend_high' | 'deadline_soon'

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
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedSkill, setSelectedSkill] = useState('all')
  const [selectedDuration, setSelectedDuration] = useState('all')
  const [selectedStipend, setSelectedStipend] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedPostedDate, setSelectedPostedDate] = useState('all')
  const [selectedDeadline, setSelectedDeadline] = useState('all')
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  // Company Published Internships (persisted in localStorage)
  const [customInternships, setCustomInternships] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_company_published_internships')
      if (saved) return JSON.parse(saved)
    } catch {}
    return []
  })

  // Sync custom published internships to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('udaan_company_published_internships', JSON.stringify(customInternships))
    } catch {}
  }, [customInternships])

  // Merge custom published internships with initial catalog
  const allInternships = useMemo(() => {
    return [...customInternships, ...INITIAL_INTERNSHIPS]
  }, [customInternships])

  // Company Publish Internship Modal State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)

  const [publishForm, setPublishForm] = useState({
    company: '',
    role: '',
    department: 'Computer Science / IT',
    duration: '3 Months',
    stipend: '₹35,000 / month',
    type: 'On-site',
    location: '',
    deadline: '2026-10-31',
    requiredSkills: '',
    openings: '5',
    eligibility: '',
    overview: '',
    responsibilities: '',
  })
  const [publishError, setPublishError] = useState('')

  const handlePublishInternship = (e) => {
    e.preventDefault()
    if (!publishForm.company.trim() || !publishForm.role.trim() || !publishForm.location.trim()) {
      setPublishError('Please fill in Company Name, Role Title, and Location.')
      return
    }

    const now = new Date()
    const postedAt = now.toISOString()
    const postedDateTime = formatPostedDateTime(now)

    let displayDeadline = '31 Oct 2026'
    if (publishForm.deadline) {
      try {
        const d = new Date(publishForm.deadline)
        const day = d.getDate().toString().padStart(2, '0')
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        displayDeadline = `${day} ${months[d.getMonth()]} ${d.getFullYear()}`
      } catch {}
    }

    const skillsArray = publishForm.requiredSkills
      ? publishForm.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Problem Solving', 'Communication', 'Technical Fundamentals']

    const respArray = publishForm.responsibilities
      ? publishForm.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean)
      : [
          'Collaborate on core engineering assignments and system improvements.',
          'Document engineering workflows and contribute to agile deliverables.',
          'Work under senior engineering and departmental mentorship.'
        ]

    const durationNum = parseInt(publishForm.duration, 10) || 3
    const stipendNum = parseInt(publishForm.stipend.replace(/[^0-9]/g, ''), 10) || 0

    const initials = publishForm.company
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'CO'

    const brandColors = ['#0f4c81', '#1e3a8a', '#059669', '#c2410c', '#7c3aed', '#0d9488', '#be123c', '#0f766e']
    const logoBg = brandColors[Math.abs(publishForm.company.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % brandColors.length]

    const newInternship = {
      id: `int_pub_${Date.now()}`,
      company: publishForm.company.trim(),
      companyLogoBg: logoBg,
      companyLogoText: initials,
      verifiedCompany: true,
      role: publishForm.role.trim(),
      department: publishForm.department,
      duration: publishForm.duration,
      durationMonths: durationNum,
      stipend: publishForm.stipend.includes('₹') ? publishForm.stipend : `₹${publishForm.stipend}`,
      stipendAmount: stipendNum,
      type: publishForm.type,
      location: publishForm.location.trim(),
      requiredSkills: skillsArray,
      postedAt,
      postedDateTime,
      postedDate: 'Just now',
      postedDaysAgo: 0,
      deadline: publishForm.deadline || '2026-10-31',
      displayDeadline,
      isUrgent: false,
      openings: parseInt(publishForm.openings, 10) || 5,
      eligibility: publishForm.eligibility.trim() || `B.Tech / B.E. in ${publishForm.department} with CGPA ≥ 7.0`,
      minCgpa: 7.0,
      overview: publishForm.overview.trim() || `Accredited internship opportunity at ${publishForm.company.trim()} for ${publishForm.department} candidates.`,
      responsibilities: respArray,
      perks: ['Official Institutional NOC & Certificate', 'Pre-Placement Offer (PPO) potential', 'Direct corporate mentor guidance'],
      selectionProcess: 'Profile Screening → Technical Assessment → Recruiter Alignment'
    }

    setCustomInternships((prev) => [newInternship, ...prev])
    setToastMessage(`Internship "${newInternship.role}" published successfully!`)
    setIsPublishModalOpen(false)
    setPublishError('')
    setPublishForm({
      company: '',
      role: '',
      department: 'Computer Science / IT',
      duration: '3 Months',
      stipend: '₹35,000 / month',
      type: 'On-site',
      location: '',
      deadline: '2026-10-31',
      requiredSkills: '',
      openings: '5',
      eligibility: '',
      overview: '',
      responsibilities: '',
    })
  }

  // Modals
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

  // Verified items from localStorage
  const [verifiedSkills, setVerifiedSkills] = useState([])
  const [verifiedProjects, setVerifiedProjects] = useState([])
  const [verifiedInternships, setVerifiedInternships] = useState([])

  // Applications & Saved state from localStorage
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_internship_applications')
      if (saved) return JSON.parse(saved)
    } catch {}
    return [
      {
        internshipId: 'int_mech_01',
        company: 'Tata Motors',
        role: 'Mechanical Design & CAE Simulation Intern',
        department: 'Mechanical',
        stipend: '₹35,000 / month',
        type: 'On-site',
        location: 'Pune, Maharashtra',
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'applied', // 'applied' | 'shortlisted' | 'selected' | 'offer'
        statusLabel: 'Application Under Review',
        feedback: 'Your verified academic credentials and CAD portfolio are currently being reviewed by the chassis engineering recruitment team.'
      }
    ]
  })

  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_saved_internships')
      if (saved) return JSON.parse(saved)
    } catch {}
    return ['int_mech_01', 'int_elec_01']
  })

  // Load verified student credentials
  useEffect(() => {
    try {
      const skills = JSON.parse(localStorage.getItem('udaan_student_skills') || '[]')
      const projects = JSON.parse(localStorage.getItem('udaan_student_projects') || '[]')
      const internships = JSON.parse(localStorage.getItem('udaan_student_internships') || '[]')
      setVerifiedSkills(skills)
      setVerifiedProjects(projects)
      setVerifiedInternships(internships)
    } catch {}
  }, [])

  // Sync applications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('udaan_student_internship_applications', JSON.stringify(applications))
    } catch {}
  }, [applications])

  // Sync saved IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('udaan_student_saved_internships', JSON.stringify(savedIds))
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
      setToastMessage(exists ? 'Internship removed from saved bookmarks.' : 'Internship saved to your bookmarks!')
      return next
    })
  }

  // Check if an internship is applied
  const isApplied = (id) => applications.some((app) => app.internshipId === id)

  // Approved offer letters issued by companies
  const approvedOffers = useMemo(() => {
    return applications.filter(
      (app) => app.status === 'offer' || app.offerLetter || app.offerLetterUrl || (app.status === 'selected' && app.hasOfferLetter)
    )
  }, [applications])

  // Metrics Count
  const metrics = useMemo(() => {
    const appliedCount = applications.filter((a) => a.status === 'applied').length
    const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length
    const selectedCount = applications.filter((a) => a.status === 'selected').length
    const offerCount = approvedOffers.length
    return {
      applied: appliedCount,
      shortlisted: shortlistedCount,
      selected: selectedCount,
      offers: offerCount,
      total: applications.length,
    }
  }, [applications, approvedOffers])

  // Download official offer letter issued by the company
  const handleDownloadOfferLetter = (app) => {
    if (!app) return
    const offer = app.offerLetter || {}
    const company = app.company || offer.company || 'Company'
    const role = app.role || offer.role || 'Intern'
    const stipend = app.stipend || offer.stipend || 'Accredited Monthly Stipend'
    const docUrl = offer.documentUrl || app.offerLetterUrl

    if (docUrl) {
      const a = document.createElement('a')
      a.href = docUrl
      a.download = offer.fileName || `${company.replace(/\s+/g, '_')}_Offer_Letter.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      const letterContent = `
================================================================================
                    OFFICIAL INTERNSHIP OFFER LETTER
               ACCREDITED BY IAS INSTITUTIONAL NETWORK
================================================================================

Date: ${offer.issueDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
Reference ID: ${offer.letterId || `IAS-OFF-${app.internshipId ? app.internshipId.toUpperCase() : '2026'}-${Date.now().toString().slice(-4)}`}

To:
Candidate: ${studentName}
Roll / Enrollment ID: ${studentRoll}
Institution: ${studentCollege}
Branch / Discipline: ${studentBranch}
Verified CGPA: ${studentCgpa} / 10.0

Subject: Offer of Internship for the position of ${role}

Dear ${studentName},

We are pleased to offer you an appointment as ${role} at ${company}.
This selection has been approved following the successful verification of your
institutional academic portfolio and faculty credentials via the IAS Collaboration Network.

Key Internship Terms:
--------------------------------------------------------------------------------
• Company / Organization: ${company}
• Department / Division: ${app.department || offer.department || 'Engineering'}
• Position / Role: ${role}
• Work Arrangement: ${app.type || offer.type || 'Accredited Internship'}
• Primary Location: ${app.location || offer.location || 'India'}
• Monthly Stipend: ${stipend}
• Academic Accreditation: Eligible for institutional credits & NOC sign-off
--------------------------------------------------------------------------------

Please retain this official communication as your verified institutional offer.
Upon departmental coordinator verification, an institutional No Objection Certificate (NOC)
will be issued for your internship tenure.

Authorized by:
Campus Recruitment & Talent Acquisition Group
${company}
[IAS Verified Institutional Partner]
================================================================================
`
      const blob = new Blob([letterContent.trim()], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${company.replace(/\s+/g, '_')}_Offer_Letter.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    setToastMessage(`Offer letter downloaded for ${company}!`)
  }

  // Filter & Search Logic across ALL Engineering Departments
  const filteredInternships = useMemo(() => {
    return allInternships.filter((item) => {
      // 1. Tab / Category Filter
      if (activeTab === 'remote' && item.type.toLowerCase() !== 'remote') return false
      if (activeTab === 'on-site' && item.type.toLowerCase() !== 'on-site') return false
      if (activeTab === 'hybrid' && item.type.toLowerCase() !== 'hybrid') return false

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

      // 4. Role Filter
      if (selectedRole !== 'all') {
        if (!item.role.toLowerCase().includes(selectedRole.toLowerCase())) return false
      }

      // 5. Skills Filter
      if (selectedSkill !== 'all') {
        if (!item.requiredSkills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase())) return false
      }

      // 6. Duration Filter
      if (selectedDuration !== 'all') {
        if (selectedDuration === '2' && item.durationMonths !== 2) return false
        if (selectedDuration === '3' && item.durationMonths !== 3) return false
        if (selectedDuration === '6' && item.durationMonths !== 6) return false
      }

      // 7. Stipend Filter
      if (selectedStipend !== 'all') {
        const minStipend = parseInt(selectedStipend, 10) || 0
        if (item.stipendAmount < minStipend) return false
      }

      // 8. Work Type Filter
      if (selectedType !== 'all') {
        if (item.type.toLowerCase() !== selectedType.toLowerCase()) return false
      }

      // 9. Location Filter
      if (selectedLocation !== 'all') {
        if (!item.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false
      }

      // 10. Posted Date Filter
      if (selectedPostedDate !== 'all') {
        const maxDays = parseInt(selectedPostedDate, 10)
        if (item.postedDaysAgo > maxDays) return false
      }

      // 11. Application Deadline Filter
      if (selectedDeadline !== 'all') {
        if (selectedDeadline === 'urgent' && !item.isUrgent) return false
        if (selectedDeadline === '15days') {
          const daysLeft = Math.ceil((new Date(item.deadline) - new Date('2026-09-18')) / (1000 * 60 * 60 * 24))
          if (daysLeft > 15 || daysLeft < 0) return false
        }
      }

      return true
    }).sort((a, b) => {
      if (sortOption === 'stipend_high') {
        return b.stipendAmount - a.stipendAmount
      }
      if (sortOption === 'deadline_soon') {
        return new Date(a.deadline) - new Date(b.deadline)
      }
      // 'latest' default: newest timestamps first
      if (a.postedAt && b.postedAt) {
        return new Date(b.postedAt) - new Date(a.postedAt)
      }
      return a.postedDaysAgo - b.postedDaysAgo
    })
  }, [
    activeTab,
    selectedDepartment,
    searchQuery,
    selectedRole,
    selectedSkill,
    selectedDuration,
    selectedStipend,
    selectedType,
    selectedLocation,
    selectedPostedDate,
    selectedDeadline,
    sortOption,
    allInternships,
  ])

  // Clear / Reset All Filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedDepartment('All Departments')
    setSelectedRole('all')
    setSelectedSkill('all')
    setSelectedDuration('all')
    setSelectedStipend('all')
    setSelectedType('all')
    setSelectedLocation('all')
    setSelectedPostedDate('all')
    setSelectedDeadline('all')
  }

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedDepartment !== 'All Departments' ||
    selectedRole !== 'all' ||
    selectedSkill !== 'all' ||
    selectedDuration !== 'all' ||
    selectedStipend !== 'all' ||
    selectedType !== 'all' ||
    selectedLocation !== 'all' ||
    selectedPostedDate !== 'all' ||
    selectedDeadline !== 'all'
  )

  // Submit Direct Application (No CV upload required)
  const handleConfirmApplication = () => {
    if (!applyModalItem) return
    setIsApplying(true)

    setTimeout(() => {
      const newApp = {
        internshipId: applyModalItem.id,
        company: applyModalItem.company,
        role: applyModalItem.role,
        department: applyModalItem.department,
        stipend: applyModalItem.stipend,
        type: applyModalItem.type,
        location: applyModalItem.location,
        appliedAt: new Date().toISOString(),
        status: 'applied',
        statusLabel: 'Application Submitted',
        note: applicationNote.trim(),
        verifiedCgpa: studentCgpa,
        feedback: `Your verified institutional credentials and profile have been transmitted to the ${applyModalItem.company} recruiting coordinator.`
      }

      setApplications((prev) => [newApp, ...prev.filter((a) => a.internshipId !== applyModalItem.id)])

      // Also add student notification
      try {
        const notifs = JSON.parse(localStorage.getItem('udaan_student_notifications') || '[]')
        const newNotif = {
          id: `n_int_${Date.now()}`,
          type: 'success',
          title: `Application Sent: ${applyModalItem.company}`,
          message: `Your verified institutional application for "${applyModalItem.role}" was submitted successfully.`,
          timestamp: 'Just now',
          read: false,
        }
        localStorage.setItem('udaan_student_notifications', JSON.stringify([newNotif, ...notifs]))
      } catch {}

      setIsApplying(false)
      setApplyModalItem(null)
      setApplicationNote('')
      setToastMessage(`Application submitted to ${applyModalItem.company} with verified credentials!`)
    }, 600)
  }

  return (
    <div className="si-page-wrapper">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="si-toast-notice" role="status">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage('')} className="si-toast-close" aria-label="Close notification">✕</button>
        </div>
      )}

      {/* TOP NAVBAR */}
      <header className="si-top-navbar" aria-label="Portal Header">
        <div className="si-nav-left">
          <button
            type="button"
            className="si-nav-back-btn"
            onClick={onBack}
            title="Return to Student Dashboard"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Dashboard
          </button>

          <div className="si-nav-brand">
            <span className="si-nav-brand-bold">IAS Collaboration Portal</span>
            <span className="si-nav-slash">/</span>
            <span>Student Portal</span>
            <span className="si-nav-slash">/</span>
            <span className="si-nav-active-tag">Internships</span>
          </div>
        </div>

        <div className="si-nav-right">
          <div className="si-nav-user-chip">
            {s.profilePic ? (
              <img src={s.profilePic} alt={studentName} className="si-nav-avatar" />
            ) : (
              <div className="si-nav-avatar">
                {studentName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="si-nav-user-meta">
              <span className="si-nav-user-name">{studentName}</span>
              <span className="si-nav-user-sub">{studentBranch}</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="si-main-content">
        {/* COMPACT PAGE HEADER */}
        <div className="si-page-header">
          <div className="si-header-info">
            <h1 className="si-page-title">Internships</h1>
            <p className="si-page-subtitle">
              Discover accredited internship opportunities across all institutional academic departments.
            </p>
          </div>
        </div>

        {/* CONDITIONAL VIEW: MY APPLICATIONS TAB */}
        {activeTab === 'status' ? (
          <section className="si-applications-view">
            <div className="si-applications-header">
              <div>
                <h2 className="si-section-title">My Internship Applications</h2>
                <p className="si-section-sub">
                  Track the real-time status of your verified institutional applications.
                </p>
              </div>
              <button
                type="button"
                className="si-btn-secondary"
                onClick={() => setActiveTab('all')}
              >
                ← Back to Opportunity Listings
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="si-empty-state">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <h3>No Applications Submitted Yet</h3>
                <p>Browse the verified internship directory below and apply directly using your verified institutional profile.</p>
                <button type="button" className="si-btn-primary" onClick={() => setActiveTab('all')}>
                  Browse Opportunities
                </button>
              </div>
            ) : (
              <div className="si-applications-grid">
                {applications.map((app) => (
                  <div key={app.internshipId} className="si-app-card">
                    <div className="si-app-top">
                      <div>
                        <div className="si-app-company-row">
                          <span className="si-app-company">{app.company}</span>
                          {app.department && (
                            <span className={`si-dept-badge ${getDepartmentClass(app.department)}`}>
                              {app.department}
                            </span>
                          )}
                        </div>
                        <h3 className="si-app-role">{app.role}</h3>
                      </div>
                      <span className={`si-app-status-badge ${app.status}`}>
                        {app.status === 'applied' && '● Under Review'}
                        {app.status === 'shortlisted' && '★ Shortlisted'}
                        {app.status === 'selected' && '✓ Selected'}
                        {app.status === 'offer' && '🏆 Offer Received'}
                      </span>
                    </div>

                    <div className="si-app-meta">
                      <span><strong>Stipend:</strong> {app.stipend}</span>
                      <span>•</span>
                      <span><strong>Mode:</strong> {app.type}</span>
                      <span>•</span>
                      <span><strong>Location:</strong> {app.location}</span>
                    </div>

                    <p className="si-app-feedback">
                      <strong>Status Update:</strong> {app.feedback || 'Your verified academic credentials have been received by the hiring team.'}
                    </p>

                    <div className="si-app-bottom">
                      <span className="si-app-date">
                        Applied: {new Date(app.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <button
                        type="button"
                        className="si-btn-outline"
                        onClick={() => {
                          const item = allInternships.find((i) => i.id === app.internshipId)
                          if (item) setDetailsModalItem(item)
                        }}
                      >
                        View Job Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* WORKSPACE 2-COLUMN LAYOUT (Desktop: Listings + Right-Side Panel) */
          <div className="si-workspace-layout">
            {/* LEFT COLUMN: LISTINGS & FILTERS */}
            <div className="si-main-feed">
              {/* SEARCH & DEPARTMENT FILTER BAR */}
              <section className="si-filter-card">
                <div className="si-search-row">
                  {/* Keyword Search */}
                  <div className="si-search-input-wrap">
                    <svg className="si-search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      className="si-search-input"
                      placeholder="Search company, role, skill (e.g. SolidWorks, VLSI, React, Aspen, FEA)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="si-search-clear-btn"
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search query"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Primary Department Selector */}
                  <div className="si-dept-select-wrap">
                    <label htmlFor="si-primary-dept" className="si-sr-only">Filter by Department</label>
                    <select
                      id="si-primary-dept"
                      className="si-dept-select"
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
                  <div className="si-search-actions">
                    <button
                      type="button"
                      className={`si-filter-toggle-btn ${isFilterDrawerOpen ? 'active' : ''}`}
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
                        className="si-filter-reset-btn"
                        onClick={handleResetFilters}
                        title="Clear all filters"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Collapsible Advanced Filters Drawer */}
                <div className={`si-filters-grid ${isFilterDrawerOpen ? 'is-open' : ''}`}>
                  {/* Department in Drawer */}
                  <div className="si-filter-col">
                    <label className="si-filter-label" htmlFor="si-f-dept">Department</label>
                    <select
                      id="si-f-dept"
                      className="si-filter-select"
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter: Role Title */}
                  <div className="si-filter-col">
                    <label className="si-filter-label" htmlFor="si-f-role">Role Discipline</label>
                    <select
                      id="si-f-role"
                      className="si-filter-select"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      <option value="Mechanical">Mechanical &amp; CAE</option>
                      <option value="VLSI">VLSI &amp; Circuit Design</option>
                      <option value="Power">Power Systems &amp; Smart Grid</option>
                      <option value="Structural">Civil &amp; Structural</option>
                      <option value="Chemical">Chemical &amp; Process</option>
                      <option value="Instrumentation">Instrumentation &amp; Control</option>
                      <option value="Automobile">Automobile &amp; EV</option>
                      <option value="Biotechnology">Bioprocess &amp; Biotech</option>
                      <option value="Software">Software Engineering</option>
                      <option value="Machine Learning">AI &amp; Data Science</option>
                    </select>
                  </div>

                  {/* Filter: Required Skill */}
                  <div className="si-filter-col">
                    <label className="si-filter-label" htmlFor="si-f-skills">Required Skill</label>
                    <select
                      id="si-f-skills"
                      className="si-filter-select"
                      value={selectedSkill}
                      onChange={(e) => setSelectedSkill(e.target.value)}
                    >
                      <option value="all">All Skills</option>
                      <option value="SolidWorks">SolidWorks</option>
                      <option value="ANSYS">ANSYS / FEA</option>
                      <option value="Verilog">Verilog / VLSI</option>
                      <option value="MATLAB/Simulink">MATLAB / Simulink</option>
                      <option value="STAAD.Pro">STAAD.Pro / AutoCAD</option>
                      <option value="Aspen Plus">Aspen Plus</option>
                      <option value="PLC/SCADA">PLC / SCADA</option>
                      <option value="BMS">BMS / EV Powertrain</option>
                      <option value="Bioreactors">Bioreactors / Fermentation</option>
                      <option value="React">React / TypeScript</option>
                      <option value="Python">Python / AI</option>
                    </select>
                  </div>

                  {/* Filter: Duration */}
                  <div className="si-filter-col">
                    <label className="si-filter-label" htmlFor="si-f-duration">Duration</label>
                    <select
                      id="si-f-duration"
                      className="si-filter-select"
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                    >
                      <option value="all">Any Duration</option>
                      <option value="3">3 Months (Semester Summer)</option>
                      <option value="6">6 Months (Comprehensive)</option>
                    </select>
                  </div>

                  {/* Filter: Min Stipend */}
                  <div className="si-filter-col">
                    <label className="si-filter-label" htmlFor="si-f-stipend">Min. Stipend</label>
                    <select
                      id="si-f-stipend"
                      className="si-filter-select"
                      value={selectedStipend}
                      onChange={(e) => setSelectedStipend(e.target.value)}
                    >
                      <option value="all">All Stipends</option>
                      <option value="25000">₹25,000+ / mo</option>
                      <option value="35000">₹35,000+ / mo</option>
                      <option value="45000">₹45,000+ / mo</option>
                      <option value="80000">₹80,000+ / mo</option>
                    </select>
                  </div>

                  {/* Filter: Work Type */}
                  <div className="si-filter-col">
                    <label className="si-filter-label" htmlFor="si-f-type">Work Type</label>
                    <select
                      id="si-f-type"
                      className="si-filter-select"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="On-site">On-site / Plant / Lab</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  {/* Filter: Location */}
                  <div className="si-filter-col">
                    <label className="si-filter-label" htmlFor="si-f-loc">Location</label>
                    <select
                      id="si-f-loc"
                      className="si-filter-select"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="all">All Locations</option>
                      <option value="Pune">Pune</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Gujarat">Gujarat (Jamnagar/Vapi/Vadodara)</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Remote">Remote India</option>
                    </select>
                  </div>

                  {/* Filter: Deadline */}
                  <div className="si-filter-col">
                    <label className="si-filter-label" htmlFor="si-f-deadline">Deadline</label>
                    <select
                      id="si-f-deadline"
                      className="si-filter-select"
                      value={selectedDeadline}
                      onChange={(e) => setSelectedDeadline(e.target.value)}
                    >
                      <option value="all">All Deadlines</option>
                      <option value="urgent">Closing Soon (&lt; 15 Days)</option>
                      <option value="15days">Within 15 Days</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* TABS & SORT BAR */}
              <div className="si-sub-bar">
                <div className="si-tabs-row" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'all'}
                    className={`si-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All Opportunities
                    <span className="si-tab-count">{allInternships.length}</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'on-site'}
                    className={`si-tab-btn ${activeTab === 'on-site' ? 'active' : ''}`}
                    onClick={() => setActiveTab('on-site')}
                  >
                    On-site / Lab
                    <span className="si-tab-count">
                      {allInternships.filter((i) => i.type === 'On-site').length}
                    </span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'hybrid'}
                    className={`si-tab-btn ${activeTab === 'hybrid' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hybrid')}
                  >
                    Hybrid
                    <span className="si-tab-count">
                      {allInternships.filter((i) => i.type === 'Hybrid').length}
                    </span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'remote'}
                    className={`si-tab-btn ${activeTab === 'remote' ? 'active' : ''}`}
                    onClick={() => setActiveTab('remote')}
                  >
                    Remote
                    <span className="si-tab-count">
                      {allInternships.filter((i) => i.type === 'Remote').length}
                    </span>
                  </button>
                </div>

                <div className="si-sort-wrap">
                  <label htmlFor="si-sort-select" className="si-sort-label">Sort by:</label>
                  <select
                    id="si-sort-select"
                    className="si-sort-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="latest">Latest Posted</option>
                    <option value="stipend_high">Highest Stipend</option>
                    <option value="deadline_soon">Deadline (Soonest)</option>
                  </select>
                </div>
              </div>

              {/* COMPACT HORIZONTAL OPPORTUNITY LISTINGS (PROTOTYPE LAYOUT) */}
              <div className="si-listings-container">
                {filteredInternships.length === 0 ? (
                  <div className="si-empty-state">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <h3>No internships found matching your filters</h3>
                    <p>Try switching the academic department, clearing your search keywords, or resetting filters.</p>
                    <button type="button" className="si-btn-secondary" onClick={handleResetFilters}>
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  filteredInternships.map((item) => {
                    const alreadyApplied = isApplied(item.id)
                    const isSaved = savedIds.includes(item.id)

                    return (
                      <article key={item.id} className="si-listing-row">
                        {/* Main Content Area */}
                        <div className="si-row-main">
                          {/* Row Header: Company Logo, Name, Verified, Department, Bookmark */}
                          <div className="si-row-header">
                            <div className="si-row-comp-wrap">
                              <div
                                className="si-comp-avatar"
                                style={{ backgroundColor: item.companyLogoBg }}
                                aria-hidden="true"
                              >
                                {item.companyLogoText}
                              </div>
                              <div className="si-comp-titles">
                                <div className="si-row-comp-names">
                                  <span className="si-comp-name">{item.company}</span>
                                  {item.verifiedCompany && (
                                    <span className="si-verified-pill" title="Verified Institutional Recruiter Partner">
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                      </svg>
                                      Verified
                                    </span>
                                  )}
                                  <span className={`si-dept-badge ${getDepartmentClass(item.department)}`}>
                                    {item.department}
                                  </span>
                                </div>
                                <h3 className="si-row-title">{item.role}</h3>
                              </div>
                            </div>

                            {/* Bookmark button */}
                            <button
                              type="button"
                              className={`si-bookmark-btn ${isSaved ? 'is-saved' : ''}`}
                              onClick={(e) => handleToggleSave(e, item.id)}
                              title={isSaved ? 'Remove from saved' : 'Save internship'}
                              aria-label={isSaved ? 'Remove from saved' : 'Save internship'}
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                              </svg>
                            </button>
                          </div>

                          {/* Specification Pills Row */}
                          <div className="si-row-specs">
                            <span className="si-spec-item duration" title="Duration">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              {item.duration}
                            </span>

                            <span className="si-spec-item stipend" title="Monthly Stipend">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <line x1="12" y1="1" x2="12" y2="23" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                              </svg>
                              {item.stipend}
                            </span>

                            <span className={`si-spec-item type ${item.type.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} title="Work Mode">
                              {item.type}
                            </span>

                            <span className="si-spec-item location" title="Location">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              {item.location}
                            </span>

                            {/* 1. Posted Date and Time first */}
                            <span className="si-spec-item posted-time" title="Posting Date and Time">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 14 14" />
                              </svg>
                              {formatPostedDateTime(item.postedAt, item.postedDaysAgo) || item.postedDateTime || `Posted ${item.postedDate}`}
                            </span>

                            {/* 2. Application Closing Deadline after it (compact live countdown when <= 2 days) */}
                            <span
                              className={`si-spec-item deadline ${isUrgentDeadline(item.deadline, currentTime) || item.isUrgent ? 'urgent' : ''}`}
                              title="Application Closing Deadline"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                              </svg>
                              {formatClosingDeadline(item.deadline, item.displayDeadline, currentTime)}
                            </span>
                          </div>

                          {/* Skills List */}
                          <div className="si-row-skills">
                            <span className="si-skills-label">Skills:</span>
                            {item.requiredSkills.map((sk) => (
                              <span key={sk} className="si-skill-tag">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons Column */}
                        <div className="si-row-actions">
                          <button
                            type="button"
                            className="si-btn-view"
                            onClick={() => setDetailsModalItem(item)}
                          >
                            View Details
                          </button>

                          {alreadyApplied ? (
                            <button
                              type="button"
                              className="si-btn-applied"
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
                              className="si-btn-apply"
                              onClick={() => setApplyModalItem(item)}
                            >
                              Apply Now
                            </button>
                          )}
                        </div>
                      </article>
                    )
                  })
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: PROTOTYPE-STYLE SIDEBAR (STATUS & TIPS) */}
            <aside className="si-sidebar" aria-label="Internship Tracker and Tips">
              {/* 1. MY INTERNSHIP STATUS WIDGET */}
              <div className="si-side-panel status-panel">
                <div className="si-side-header">
                  <div className="si-side-title-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b3881e" strokeWidth="2.4">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <h3 className="si-side-title">My Internship Status</h3>
                  </div>
                  <button
                    type="button"
                    className="si-side-link-btn"
                    onClick={() => setActiveTab('status')}
                  >
                    View All
                  </button>
                </div>

                <div className="si-status-vertical-list">
                  {/* Status Item 1: Applied */}
                  <div
                    className="si-status-row"
                    onClick={() => setActiveTab('status')}
                    title="View Applied Internships"
                  >
                    <div className="si-status-mini-icon applied">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                    </div>
                    <div className="si-status-text">
                      <span className="si-status-name">Applied</span>
                      <span className="si-status-subtext">Under review by coordinators</span>
                    </div>
                    <div className="si-status-badge applied">{metrics.applied}</div>
                  </div>

                  {/* Status Item 2: Shortlisted */}
                  <div
                    className="si-status-row"
                    onClick={() => setActiveTab('status')}
                    title="View Shortlisted Applications"
                  >
                    <div className="si-status-mini-icon shortlisted">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <div className="si-status-text">
                      <span className="si-status-name">Shortlisted</span>
                      <span className="si-status-subtext">Active interview rounds</span>
                    </div>
                    <div className="si-status-badge shortlisted">{metrics.shortlisted}</div>
                  </div>

                  {/* Status Item 3: Selected */}
                  <div
                    className="si-status-row"
                    onClick={() => setActiveTab('status')}
                    title="View Selected Applications"
                  >
                    <div className="si-status-mini-icon selected">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div className="si-status-text">
                      <span className="si-status-name">Selected</span>
                      <span className="si-status-subtext">Recruiter confirmed</span>
                    </div>
                    <div className="si-status-badge selected">{metrics.selected}</div>
                  </div>

                  {/* Status Item 4: Offer Letters */}
                  <div
                    className={`si-status-row ${approvedOffers.length > 0 ? 'has-offers' : ''}`}
                    onClick={() => setActiveTab('status')}
                    title={approvedOffers.length > 0 ? 'View Approved Offer Letters' : 'No Offer Letters Issued Yet'}
                  >
                    <div className="si-status-mini-icon offer">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div className="si-status-text">
                      <span className="si-status-name">Offer Letters</span>
                      <span className="si-status-subtext">
                        {approvedOffers.length > 0
                          ? `${approvedOffers.length} letter${approvedOffers.length > 1 ? 's' : ''} available`
                          : 'Institutional NOC ready'}
                      </span>
                    </div>
                    <div className="si-status-badge offer">{metrics.offers}</div>
                  </div>

                  {/* Issued Offer Letters list (Generated/provided by company upon approval) */}
                  {approvedOffers.length > 0 && (
                    <div className="si-offer-letters-sublist">
                      {approvedOffers.map((offer) => (
                        <div key={offer.internshipId} className="si-offer-letter-item">
                          <div className="si-oli-header">
                            <div className="si-oli-comp-wrap">
                              <span className="si-oli-comp">{offer.company}</span>
                              <span className="si-oli-role">{offer.role}</span>
                            </div>
                            <span className="si-oli-badge">Approved ✓</span>
                          </div>

                          <div className="si-oli-actions">
                            <button
                              type="button"
                              className="si-btn-view-letter"
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
                              className="si-btn-download-letter"
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
              </div>

              {/* 2. APPLICATION TIPS WIDGET (Moved Upward alongside listings) */}
              <div className="si-side-panel tips-panel">
                <div className="si-side-header">
                  <div className="si-side-title-row">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b3881e" strokeWidth="2.4">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <h3 className="si-side-title">Application Tips</h3>
                  </div>
                </div>

                <div className="si-side-tips-list">
                  <div className="si-side-tip-item">
                    <span className="si-tip-bubble">1</span>
                    <div>
                      <strong className="si-tip-heading">Verified Profile Priority</strong>
                      <p className="si-tip-desc">Recruiters screen verified CGPA, institutional records, and faculty-approved capstone projects first.</p>
                    </div>
                  </div>

                  <div className="si-side-tip-item">
                    <span className="si-tip-bubble">2</span>
                    <div>
                      <strong className="si-tip-heading">No CV Upload Needed</strong>
                      <p className="si-tip-desc">Your verified portal credentials and academic transcripts are transmitted directly with one click.</p>
                    </div>
                  </div>

                  <div className="si-side-tip-item">
                    <span className="si-tip-bubble">3</span>
                    <div>
                      <strong className="si-tip-heading">All Academic Disciplines</strong>
                      <p className="si-tip-desc">Opportunities support Mechanical, Civil, Chemical, Electrical, Biotech, Automobile, Instrumentation &amp; CS/IT.</p>
                    </div>
                  </div>

                  <div className="si-side-tip-item">
                    <span className="si-tip-bubble">4</span>
                    <div>
                      <strong className="si-tip-heading">Institutional NOC &amp; Credits</strong>
                      <p className="si-tip-desc">Verified internships qualify for official semester credits upon departmental coordinator sign-off.</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* ====================================================================
          MODAL 1: INTERNSHIP DETAILS MODAL
          ==================================================================== */}
      {detailsModalItem && (
        <div className="si-modal-overlay" onClick={() => setDetailsModalItem(null)} role="dialog" aria-modal="true">
          <div className="si-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="si-modal-header">
              <div className="si-modal-comp">
                <div
                  className="si-comp-avatar lg"
                  style={{ backgroundColor: detailsModalItem.companyLogoBg }}
                >
                  {detailsModalItem.companyLogoText}
                </div>
                <div>
                  <div className="si-comp-name-row">
                    <h2 className="si-modal-title">{detailsModalItem.role}</h2>
                    {detailsModalItem.verifiedCompany && (
                      <span className="si-verified-pill">
                        Verified Partner
                      </span>
                    )}
                    <span className={`si-dept-badge ${getDepartmentClass(detailsModalItem.department)}`}>
                      {detailsModalItem.department}
                    </span>
                  </div>
                  <span className="si-modal-sub">
                    {detailsModalItem.company} • Department: {detailsModalItem.department}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="si-modal-close-btn"
                onClick={() => setDetailsModalItem(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="si-modal-body">
              {/* Core Parameters Row */}
              <div className="si-detail-chips-row">
                <div className="si-detail-chip">
                  <span className="si-dc-label">Stipend</span>
                  <strong className="si-dc-val">{detailsModalItem.stipend}</strong>
                </div>
                <div className="si-detail-chip">
                  <span className="si-dc-label">Duration</span>
                  <strong className="si-dc-val">{detailsModalItem.duration}</strong>
                </div>
                <div className="si-detail-chip">
                  <span className="si-dc-label">Work Mode</span>
                  <strong className="si-dc-val">{detailsModalItem.type}</strong>
                </div>
                <div className="si-detail-chip">
                  <span className="si-dc-label">Location</span>
                  <strong className="si-dc-val">{detailsModalItem.location}</strong>
                </div>
                <div className="si-detail-chip">
                  <span className="si-dc-label">Posted</span>
                  <strong className="si-dc-val">
                    {formatPostedDateTime(detailsModalItem.postedAt, detailsModalItem.postedDaysAgo) || detailsModalItem.postedDateTime || `Posted ${detailsModalItem.postedDate}`}
                  </strong>
                </div>
                <div className="si-detail-chip">
                  <span className="si-dc-label">Deadline</span>
                  <strong className="si-dc-val">
                    {formatClosingDeadline(detailsModalItem.deadline, detailsModalItem.displayDeadline, currentTime)}
                  </strong>
                </div>
              </div>

              {/* Section: Overview */}
              <div className="si-detail-section">
                <h4 className="si-ds-title">Role Overview</h4>
                <p className="si-ds-text">{detailsModalItem.overview}</p>
              </div>

              {/* Section: Responsibilities */}
              <div className="si-detail-section">
                <h4 className="si-ds-title">Key Responsibilities</h4>
                <ul className="si-ds-list">
                  {detailsModalItem.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Section: Required Skills */}
              <div className="si-detail-section">
                <h4 className="si-ds-title">Target Skills &amp; Competencies</h4>
                <div className="si-skills-row">
                  {detailsModalItem.requiredSkills.map((sk) => (
                    <span key={sk} className="si-skill-tag">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Section: Academic Eligibility */}
              <div className="si-detail-section">
                <h4 className="si-ds-title">Academic Eligibility</h4>
                <p className="si-ds-text">{detailsModalItem.eligibility}</p>
              </div>

              {/* Section: Perks & Mentorship */}
              <div className="si-detail-section">
                <h4 className="si-ds-title">Mentorship &amp; Institutional Perks</h4>
                <ul className="si-ds-list">
                  {detailsModalItem.perks.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              {/* Section: Selection Process */}
              <div className="si-detail-section">
                <h4 className="si-ds-title">Selection Stages</h4>
                <p className="si-ds-text" style={{ fontStyle: 'italic' }}>
                  {detailsModalItem.selectionProcess}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="si-modal-footer">
              <button
                type="button"
                className="si-btn-secondary"
                onClick={() => setDetailsModalItem(null)}
              >
                Close
              </button>

              {isApplied(detailsModalItem.id) ? (
                <button type="button" className="si-btn-applied" disabled>
                  ✓ Already Applied
                </button>
              ) : (
                <button
                  type="button"
                  className="si-btn-primary"
                  onClick={() => {
                    const item = detailsModalItem
                    setDetailsModalItem(null)
                    setApplyModalItem(item)
                  }}
                >
                  Apply with Verified Profile →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: STUDENT DIRECT APPLICATION FLOW (NO CV UPLOAD)
          ==================================================================== */}
      {applyModalItem && (
        <div className="si-modal-overlay" onClick={() => !isApplying && setApplyModalItem(null)} role="dialog" aria-modal="true">
          <div className="si-modal-card apply-modal" onClick={(e) => e.stopPropagation()}>
            <div className="si-modal-header">
              <div>
                <div className="si-verified-header-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  Verified Institutional Profile Application
                </div>
                <h2 className="si-modal-title" style={{ marginTop: 4 }}>
                  Apply to {applyModalItem.company}
                </h2>
                <span className="si-modal-sub">
                  Role: <strong>{applyModalItem.role}</strong> ({applyModalItem.department}) • {applyModalItem.stipend}
                </span>
              </div>

              <button
                type="button"
                className="si-modal-close-btn"
                onClick={() => !isApplying && setApplyModalItem(null)}
                disabled={isApplying}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="si-modal-body">
              {/* Explanatory Banner: No CV needed */}
              <div className="si-apply-banner">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.4">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <div>
                  <strong>No Resume Upload Required:</strong>
                  <span> The hiring coordinator will review your official, Portal-Admin verified student credentials, academic standing, and audited projects directly from your institutional portal profile.</span>
                </div>
              </div>

              {/* Summary of Student Verified Profile being transmitted */}
              <div className="si-profile-preview-card">
                <h4 className="si-pp-heading">Verified Profile Data to be Shared:</h4>

                <div className="si-pp-grid">
                  <div className="si-pp-row">
                    <span className="si-pp-label">Candidate Name:</span>
                    <strong className="si-pp-val">{studentName}</strong>
                  </div>
                  <div className="si-pp-row">
                    <span className="si-pp-label">Roll / Enrollment:</span>
                    <strong className="si-pp-val">{studentRoll}</strong>
                  </div>
                  <div className="si-pp-row">
                    <span className="si-pp-label">Institution:</span>
                    <strong className="si-pp-val">{studentCollege}</strong>
                  </div>
                  <div className="si-pp-row">
                    <span className="si-pp-label">Branch &amp; Course:</span>
                    <strong className="si-pp-val">{studentBranch}</strong>
                  </div>
                  <div className="si-pp-row">
                    <span className="si-pp-label">Verified CGPA:</span>
                    <strong className="si-pp-val" style={{ color: '#15803d' }}>
                      {studentCgpa} / 10.0 (Officially Verified)
                    </strong>
                  </div>
                  <div className="si-pp-row">
                    <span className="si-pp-label">Verified Skills:</span>
                    <span className="si-pp-val">
                      {verifiedSkills.length > 0
                        ? verifiedSkills.map((s) => s.name).slice(0, 5).join(', ')
                        : 'Institutional Technical Skill Badges Included'}
                    </span>
                  </div>
                  <div className="si-pp-row">
                    <span className="si-pp-label">Audited Projects:</span>
                    <span className="si-pp-val">
                      {verifiedProjects.length > 0
                        ? `${verifiedProjects.length} Verified Projects Included`
                        : 'Faculty-Approved Capstone Records Transmitted'}
                    </span>
                  </div>
                  <div className="si-pp-row">
                    <span className="si-pp-label">Prior Training:</span>
                    <span className="si-pp-val">
                      {verifiedInternships.length > 0
                        ? `${verifiedInternships.length} Prior Verified Experiences`
                        : 'Institutional Practical Training Credentials'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Optional Cover Note / Message to Recruiter */}
              <div className="si-form-group">
                <label htmlFor="si-cover-note" className="si-form-label">
                  Note to Recruitment Coordinator <span style={{ fontWeight: 400, color: '#64748b' }}>(Optional)</span>
                </label>
                <textarea
                  id="si-cover-note"
                  className="si-form-textarea"
                  rows={3}
                  placeholder="Mention your departmental focus, project milestones, or availability dates..."
                  value={applicationNote}
                  onChange={(e) => setApplicationNote(e.target.value)}
                  disabled={isApplying}
                />
              </div>
            </div>

            <div className="si-modal-footer">
              <button
                type="button"
                className="si-btn-secondary"
                onClick={() => setApplyModalItem(null)}
                disabled={isApplying}
              >
                Cancel
              </button>

              <button
                type="button"
                className="si-btn-primary"
                onClick={handleConfirmApplication}
                disabled={isApplying}
              >
                {isApplying ? (
                  <>Submitting Application...</>
                ) : (
                  <>Confirm &amp; Submit Application →</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 3: OFFICIAL ISSUED OFFER LETTER PREVIEW MODAL
          ==================================================================== */}

      {/* ====================================================================
          MODAL 3: COMPANY PUBLISH INTERNSHIP MODAL
          ==================================================================== */}
      {isPublishModalOpen && (
        <div className="si-modal-overlay" onClick={() => setIsPublishModalOpen(false)} role="dialog" aria-modal="true">
          <div className="si-modal-card publish-modal" onClick={(e) => e.stopPropagation()}>
            <div className="si-modal-header">
              <div>
                <div className="si-verified-header-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  Enterprise &amp; Institutional Gateway
                </div>
                <h2 className="si-modal-title" style={{ marginTop: 4 }}>
                  Publish Internship Opportunity
                </h2>
              </div>

              <button
                type="button"
                className="si-modal-close-btn"
                onClick={() => setIsPublishModalOpen(false)}
                aria-label="Close publish modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishInternship} className="si-publish-form">
              <div className="si-modal-body">
                {publishError && (
                  <div className="si-publish-alert-error" role="alert">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{publishError}</span>
                  </div>
                )}

                <div className="si-publish-grid">
                  <div className="si-publish-field">
                    <label className="si-publish-label">
                      Company Name <span className="si-req-star">*</span>
                    </label>
                    <input
                      type="text"
                      className="si-publish-input"
                      placeholder="e.g. Tata Motors / Microsoft India"
                      value={publishForm.company}
                      onChange={(e) => {
                        setPublishForm({ ...publishForm, company: e.target.value })
                        if (publishError) setPublishError('')
                      }}
                      required
                    />
                  </div>

                  <div className="si-publish-field">
                    <label className="si-publish-label">
                      Role / Position Title <span className="si-req-star">*</span>
                    </label>
                    <input
                      type="text"
                      className="si-publish-input"
                      placeholder="e.g. Mechanical Design & CAE Simulation Intern"
                      value={publishForm.role}
                      onChange={(e) => {
                        setPublishForm({ ...publishForm, role: e.target.value })
                        if (publishError) setPublishError('')
                      }}
                      required
                    />
                  </div>

                  <div className="si-publish-field">
                    <label className="si-publish-label">
                      Department <span className="si-req-star">*</span>
                    </label>
                    <select
                      className="si-publish-select"
                      value={publishForm.department}
                      onChange={(e) => setPublishForm({ ...publishForm, department: e.target.value })}
                    >
                      {DEPARTMENTS.filter((d) => d !== 'All Departments').map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="si-publish-field">
                    <label className="si-publish-label">
                      Work Mode <span className="si-req-star">*</span>
                    </label>
                    <select
                      className="si-publish-select"
                      value={publishForm.type}
                      onChange={(e) => setPublishForm({ ...publishForm, type: e.target.value })}
                    >
                      <option value="On-site">On-site / Lab / Plant</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  <div className="si-publish-field">
                    <label className="si-publish-label">
                      Primary Location <span className="si-req-star">*</span>
                    </label>
                    <input
                      type="text"
                      className="si-publish-input"
                      placeholder="e.g. Pune, Maharashtra / Bengaluru"
                      value={publishForm.location}
                      onChange={(e) => {
                        setPublishForm({ ...publishForm, location: e.target.value })
                        if (publishError) setPublishError('')
                      }}
                      required
                    />
                  </div>

                  <div className="si-publish-field">
                    <label className="si-publish-label">Duration</label>
                    <select
                      className="si-publish-select"
                      value={publishForm.duration}
                      onChange={(e) => setPublishForm({ ...publishForm, duration: e.target.value })}
                    >
                      <option value="3 Months">3 Months (Summer)</option>
                      <option value="6 Months">6 Months (Semester / Comprehensive)</option>
                      <option value="2 Months">2 Months (Intensive)</option>
                    </select>
                  </div>

                  <div className="si-publish-field">
                    <label className="si-publish-label">Monthly Stipend</label>
                    <input
                      type="text"
                      className="si-publish-input"
                      placeholder="e.g. ₹35,000 / month"
                      value={publishForm.stipend}
                      onChange={(e) => setPublishForm({ ...publishForm, stipend: e.target.value })}
                    />
                  </div>

                  <div className="si-publish-field">
                    <label className="si-publish-label">Application Deadline</label>
                    <input
                      type="date"
                      className="si-publish-input"
                      value={publishForm.deadline}
                      onChange={(e) => setPublishForm({ ...publishForm, deadline: e.target.value })}
                    />
                  </div>

                  <div className="si-publish-field">
                    <label className="si-publish-label">Number of Openings</label>
                    <input
                      type="number"
                      className="si-publish-input"
                      min="1"
                      value={publishForm.openings}
                      onChange={(e) => setPublishForm({ ...publishForm, openings: e.target.value })}
                    />
                  </div>

                  <div className="si-publish-field">
                    <label className="si-publish-label">Academic Eligibility</label>
                    <input
                      type="text"
                      className="si-publish-input"
                      placeholder="e.g. B.Tech / B.E. with CGPA ≥ 7.2"
                      value={publishForm.eligibility}
                      onChange={(e) => setPublishForm({ ...publishForm, eligibility: e.target.value })}
                    />
                  </div>

                  <div className="si-publish-field full-width">
                    <label className="si-publish-label">Required Skills (comma separated)</label>
                    <input
                      type="text"
                      className="si-publish-input"
                      placeholder="e.g. SolidWorks, ANSYS, FEA, GD&T"
                      value={publishForm.requiredSkills}
                      onChange={(e) => setPublishForm({ ...publishForm, requiredSkills: e.target.value })}
                    />
                    <span className="si-publish-hint">Skills will appear as searchable tags on the internship card.</span>
                  </div>

                  <div className="si-publish-field full-width">
                    <label className="si-publish-label">Role Overview &amp; Mission</label>
                    <textarea
                      className="si-publish-textarea"
                      placeholder="Describe the department, project goals, and what the intern will learn..."
                      value={publishForm.overview}
                      onChange={(e) => setPublishForm({ ...publishForm, overview: e.target.value })}
                    />
                  </div>

                  <div className="si-publish-field full-width">
                    <label className="si-publish-label">Key Responsibilities (one per line)</label>
                    <textarea
                      className="si-publish-textarea"
                      placeholder="Perform static and dynamic simulations using ANSYS...&#10;Generate production-ready drawings...&#10;Collaborate with manufacturing line engineers..."
                      value={publishForm.responsibilities}
                      onChange={(e) => setPublishForm({ ...publishForm, responsibilities: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="si-modal-footer">
                <button
                  type="button"
                  className="si-btn-secondary"
                  onClick={() => setIsPublishModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="si-btn-primary"
                  id="si-submit-publish-btn"
                >
                  Publish Internship Opportunity →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingOfferLetter && (
        <div className="si-modal-overlay" onClick={() => setViewingOfferLetter(null)} role="dialog" aria-modal="true">
          <div className="si-modal-card si-offer-letter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="si-modal-header" style={{ background: 'linear-gradient(135deg, #112233 0%, #1a3956 100%)' }}>
              <div>
                <div className="si-verified-header-badge" style={{ background: 'rgba(217, 119, 6, 0.2)', color: '#fcd34d', borderColor: 'rgba(251, 191, 36, 0.4)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  Official Institutional Internship Offer Letter
                </div>
                <h2 className="si-modal-title" style={{ marginTop: 4 }}>
                  {viewingOfferLetter.company}
                </h2>
                <span className="si-modal-sub">
                  Role: <strong>{viewingOfferLetter.role}</strong> • {viewingOfferLetter.stipend}
                </span>
              </div>

              <button
                type="button"
                className="si-modal-close-btn"
                onClick={() => setViewingOfferLetter(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="si-modal-body">
              {/* Formal Letterhead Container */}
              <div className="si-letterhead-card">
                <div className="si-lh-top">
                  <div>
                    <span className="si-lh-institution">IAS COLLABORATION NETWORK • CAMPUS RECRUITMENT</span>
                    <h3 className="si-lh-title">Formal Appointment &amp; Internship Offer</h3>
                  </div>
                  <div className="si-lh-ref">
                    <span>Reference ID:</span>
                    <strong>{viewingOfferLetter.offerLetter?.letterId || `IAS-OFF-${viewingOfferLetter.internshipId ? viewingOfferLetter.internshipId.toUpperCase() : '2026'}-7721`}</strong>
                  </div>
                </div>

                <div className="si-lh-meta-grid">
                  <div className="si-lh-field">
                    <span className="si-lh-label">Candidate Name:</span>
                    <strong className="si-lh-val">{studentName}</strong>
                  </div>
                  <div className="si-lh-field">
                    <span className="si-lh-label">Enrollment / Roll:</span>
                    <strong className="si-lh-val">{studentRoll}</strong>
                  </div>
                  <div className="si-lh-field">
                    <span className="si-lh-label">Academic Institution:</span>
                    <strong className="si-lh-val">{studentCollege}</strong>
                  </div>
                  <div className="si-lh-field">
                    <span className="si-lh-label">Branch &amp; Discipline:</span>
                    <strong className="si-lh-val">{studentBranch}</strong>
                  </div>
                </div>

                <div className="si-lh-body-text">
                  <p>
                    Dear <strong>{studentName}</strong>,
                  </p>
                  <p>
                    Following the review and institutional approval of your verified academic profile and credentials, we are pleased to confirm that <strong>{viewingOfferLetter.company}</strong> has approved your internship application for the role of <strong>{viewingOfferLetter.role}</strong>.
                  </p>
                  <p>
                    This position offers a monthly stipend of <strong>{viewingOfferLetter.stipend}</strong>. Your appointment is officially registered with the institutional training cell and is eligible for faculty NOC sign-off and semester credits upon commencement.
                  </p>
                </div>

                <div className="si-lh-footer-strip">
                  <div>
                    <span className="si-lh-label">Issuing Authority</span>
                    <strong className="si-lh-signatory">Talent Acquisition Group, {viewingOfferLetter.company}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="si-lh-label">Accreditation Status</span>
                    <span className="si-lh-approved-tag">Institutional NOC Approved ✓</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="si-modal-footer">
              <button
                type="button"
                className="si-btn-secondary"
                onClick={() => setViewingOfferLetter(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="si-btn-primary"
                onClick={() => handleDownloadOfferLetter(viewingOfferLetter)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ marginRight: 6 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Offer Letter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
