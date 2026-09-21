import { useState, useMemo, useEffect } from 'react'
import './StudentSkillAssessments.css'

// Supported Institutional Academic Departments (Reused from Portal Convention)
const DEPARTMENTS = [
  'All Departments',
  'Computer Science / IT',
  'Mechanical',
  'Civil',
  'Electrical / Electronics',
  'Chemical',
  'Instrumentation',
  'Automobile',
  'Biotechnology',
  'Aerospace / Multidisciplinary',
]

// Common Multi-Department Technical and Professional Skills
const SKILL_OPTIONS = [
  'All Skills',
  'Programming / Software Development',
  'Data Structures & Algorithms',
  'Web Development',
  'Database Management',
  'Networking & Cloud',
  'AI / ML & Data Science',
  'CAD / Design',
  'Mechanical Design',
  'Thermodynamics',
  'Manufacturing Technology',
  'Electrical Systems',
  'Electronics & Circuits',
  'Embedded Systems',
  'Civil Design & AutoCAD',
  'Structural Engineering',
  'Surveying & Geotechnical',
  'Chemical Process Engineering',
  'Biotechnology / Life Sciences',
  'Aptitude & Logical Reasoning',
  'Quantitative Ability',
  'Technical Communication',
]

const TEST_TYPES = [
  'All Test Types',
  'Technical Assessment',
  'Domain Knowledge',
  'Cognitive & Aptitude',
  'Core Engineering Evaluation',
  'Practical Simulation & Coding',
]

const MODES = [
  'All Modes',
  'Online (Proctored Remote)',
  'Offline (CBT Centre)',
]

const FEE_TYPES = [
  'All Fee Types',
  'Free',
  'Paid',
  'Corporate Sponsored',
]

const DATES = [
  'All Dates',
  'Today',
  'This Week',
  'Upcoming (Next 15 Days)',
]

const TIME_SLOTS = [
  'All Slots',
  'Morning (09:30 AM - 11:30 AM)',
  'Afternoon (02:00 PM - 04:00 PM)',
  'Evening (05:30 PM - 07:30 PM)',
  'Flexible 24/7 (On-Demand)',
]

const CBT_CENTRES = [
  'All Centres / Online',
  'Online / Remote Proctored',
  'New Delhi CBT Testing Centre (Connaught Hub)',
  'Mumbai Digital Test Zone (Powai Centre)',
  'Bengaluru Central Testing Hub (Electronic City)',
  'Kolkata Eastern Regional CBT Lab (Salt Lake)',
  'Chennai IT Corridor Testing Facility (OMR)',
  'Hyderabad Digital Evaluation Centre (Hitec City)',
  'Pune National CBT Centre (Shivajinagar)',
]

// Department-Independent Assessment Catalog across all academic departments
const INITIAL_ASSESSMENTS = [
  {
    id: 'sa_cs_01',
    company: 'Tata Consultancy Services',
    companyLogoBg: '#1e3a5f',
    companyLogoText: 'TCS',
    testName: 'National Qualifier: Full-Stack & System Design Assessment',
    department: 'Computer Science / IT',
    categoryTab: 'software',
    skills: ['Programming / Software Development', 'Data Structures & Algorithms', 'Database Management'],
    duration: '90 Mins',
    questions: '45 Objective Technical Questions',
    codingTasks: '2 Algorithmic Coding Tasks',
    mode: 'Online (Proctored Remote)',
    modeCategory: 'Online (Proctored Remote)',
    date: '24 Sep 2026',
    dateCategory: 'This Week',
    time: '10:00 AM - 11:30 AM',
    timeCategory: 'Morning (09:30 AM - 11:30 AM)',
    cbtCentre: 'Online / Remote Proctored',
    feeType: 'Free',
    feeCategory: 'Free',
    lastRegDate: '22 Sep 2026',
    testType: 'Technical Assessment',
    overview: 'Standardized evaluation testing algorithmic efficiency, backend architecture, relational database indexing, and RESTful service design.',
    syllabus: 'Data structures (Trees, Graphs, DP), SQL query optimization, object-oriented concepts, and concurrency paradigms.',
    passingScore: '70%',
  },
  {
    id: 'sa_cloud_01',
    company: 'Amazon Web Services (AWS)',
    companyLogoBg: '#ff9900',
    companyLogoText: 'AWS',
    testName: 'AWS Certified Solutions Architect Associate (Academic Voucher)',
    department: 'Computer Science / IT',
    categoryTab: 'cert',
    skills: ['Networking & Cloud', 'Database Management', 'Programming / Software Development'],
    duration: '130 Mins',
    questions: '65 Scenario Questions',
    codingTasks: 'Architecture Design Simulation',
    mode: 'Online (Proctored Remote)',
    modeCategory: 'Online (Proctored Remote)',
    date: '02 Oct 2026',
    dateCategory: 'Upcoming (Next 15 Days)',
    time: 'Flexible 24/7 (On-Demand)',
    timeCategory: 'Flexible 24/7 (On-Demand)',
    cbtCentre: 'Online / Remote Proctored',
    feeType: 'Paid',
    feeCategory: 'Paid',
    lastRegDate: '30 Sep 2026',
    testType: 'Technical Assessment',
    overview: 'Official AWS academic voucher exam testing multi-tier architectures, VPC security, S3 storage tiers, and IAM access management.',
    syllabus: 'High availability systems, cost optimization, AWS KMS encryption, Lambda serverless, and database caching with Redis.',
    passingScore: '72%',
  },
  {
    id: 'sa_mech_01',
    company: 'Tata Motors',
    companyLogoBg: '#0f4c81',
    companyLogoText: 'TM',
    testName: 'Automotive Mechanical Design & CAE Simulation Evaluation',
    department: 'Mechanical',
    categoryTab: 'core',
    skills: ['Mechanical Design', 'CAD / Design', 'Thermodynamics'],
    duration: '75 Mins',
    questions: '50 Domain Technical MCQs',
    codingTasks: 'CAD Simulation Challenge',
    mode: 'Offline (CBT Centre)',
    modeCategory: 'Offline (CBT Centre)',
    date: '26 Sep 2026',
    dateCategory: 'This Week',
    time: '02:00 PM - 03:15 PM',
    timeCategory: 'Afternoon (02:00 PM - 04:00 PM)',
    cbtCentre: 'Pune National CBT Centre (Shivajinagar)',
    feeType: 'Free',
    feeCategory: 'Free',
    lastRegDate: '23 Sep 2026',
    testType: 'Core Engineering Evaluation',
    overview: 'Evaluates structural strength analysis, finite element basics, GD&T tolerance standards, and thermal dissipation systems.',
    syllabus: 'Mechanics of solids, machine design principles, kinematics, fluid dynamics, and 3D modeling validation.',
    passingScore: '65%',
  },
  {
    id: 'sa_cad_01',
    company: 'Dassault Systèmes',
    companyLogoBg: '#065f46',
    companyLogoText: 'DS',
    testName: 'Certified SolidWorks Mechanical Professional (CSWP Standard)',
    department: 'Mechanical',
    categoryTab: 'cert',
    skills: ['CAD / Design', 'Mechanical Design', 'Manufacturing Technology'],
    duration: '120 Mins',
    questions: '35 Engineering Problems',
    codingTasks: '3D Parametric Modeling Task',
    mode: 'Offline (CBT Centre)',
    modeCategory: 'Offline (CBT Centre)',
    date: '03 Oct 2026',
    dateCategory: 'Upcoming (Next 15 Days)',
    time: '10:00 AM - 12:00 PM',
    timeCategory: 'Morning (09:30 AM - 11:30 AM)',
    cbtCentre: 'Bengaluru Central Testing Hub (Electronic City)',
    feeType: 'Paid',
    feeCategory: 'Paid',
    lastRegDate: '01 Oct 2026',
    testType: 'Core Engineering Evaluation',
    overview: 'Industry gold standard CSWP credential validating parametric modeling, complex part configurations, assembly mates, and GD&T.',
    syllabus: 'Solid modeling, equation-driven dimensions, assembly collision analysis, drawing projection standards, and mass properties.',
    passingScore: '75%',
  },
  {
    id: 'sa_civil_01',
    company: 'Larsen & Toubro (L&T)',
    companyLogoBg: '#134e4a',
    companyLogoText: 'L&T',
    testName: 'Structural Analysis & Concrete Infrastructure Standard',
    department: 'Civil',
    categoryTab: 'core',
    skills: ['Structural Engineering', 'Civil Design & AutoCAD', 'Surveying & Geotechnical'],
    duration: '90 Mins',
    questions: '60 Objective Technical Questions',
    codingTasks: 'Structural Loading Model',
    mode: 'Offline (CBT Centre)',
    modeCategory: 'Offline (CBT Centre)',
    date: '28 Sep 2026',
    dateCategory: 'Upcoming (Next 15 Days)',
    time: '09:30 AM - 11:00 AM',
    timeCategory: 'Morning (09:30 AM - 11:30 AM)',
    cbtCentre: 'Mumbai Digital Test Zone (Powai Centre)',
    feeType: 'Corporate Sponsored',
    feeCategory: 'Corporate Sponsored',
    lastRegDate: '25 Sep 2026',
    testType: 'Core Engineering Evaluation',
    overview: 'National certification examining load distributions, reinforced concrete design (IS 456), foundation mechanics, and BIM coordination.',
    syllabus: 'Bending moment & shear force diagrams, prestressed concrete, soil bearing capacities, and geotechnical foundation design.',
    passingScore: '68%',
  },
  {
    id: 'sa_elec_01',
    company: 'Siemens Energy',
    companyLogoBg: '#047857',
    companyLogoText: 'SIE',
    testName: 'Smart Grid Power Systems & Industrial Drives Evaluation',
    department: 'Electrical / Electronics',
    categoryTab: 'core',
    skills: ['Electrical Systems', 'Electronics & Circuits', 'Manufacturing Technology'],
    duration: '80 Mins',
    questions: '40 Numerical & Technical Questions',
    codingTasks: 'Power Grid Converter Simulation',
    mode: 'Online (Proctored Remote)',
    modeCategory: 'Online (Proctored Remote)',
    date: '25 Sep 2026',
    dateCategory: 'This Week',
    time: '05:30 PM - 06:50 PM',
    timeCategory: 'Evening (05:30 PM - 07:30 PM)',
    cbtCentre: 'Online / Remote Proctored',
    feeType: 'Free',
    feeCategory: 'Free',
    lastRegDate: '23 Sep 2026',
    testType: 'Technical Assessment',
    overview: 'Benchmark certification for electrical power generation, relay protection systems, variable frequency drives, and grid synchronization.',
    syllabus: 'Transformer load analysis, synchronous machines, power electronics converters, and fault calculations.',
    passingScore: '70%',
  },
  {
    id: 'sa_ece_01',
    company: 'Robert Bosch',
    companyLogoBg: '#831843',
    companyLogoText: 'RB',
    testName: 'Embedded Systems Architecture & Microcontroller Design',
    department: 'Electrical / Electronics',
    categoryTab: 'core',
    skills: ['Embedded Systems', 'Electronics & Circuits', 'Programming / Software Development'],
    duration: '90 Mins',
    questions: '45 Questions',
    codingTasks: 'Firmware Logic Debugging',
    mode: 'Online (Proctored Remote)',
    modeCategory: 'Online (Proctored Remote)',
    date: '27 Sep 2026',
    dateCategory: 'Upcoming (Next 15 Days)',
    time: 'Flexible 24/7 (On-Demand)',
    timeCategory: 'Flexible 24/7 (On-Demand)',
    cbtCentre: 'Online / Remote Proctored',
    feeType: 'Corporate Sponsored',
    feeCategory: 'Corporate Sponsored',
    lastRegDate: '26 Sep 2026',
    testType: 'Practical Simulation & Coding',
    overview: 'Rigorous assessment in ARM Cortex firmware development, CAN/SPI/I2C communication protocols, and RTOS task scheduling.',
    syllabus: 'Interrupt latency management, pointer arithmetic in Embedded C, sensor interface hardware, and digital filters.',
    passingScore: '72%',
  },
  {
    id: 'sa_chem_01',
    company: 'Thermax Global',
    companyLogoBg: '#9a3412',
    companyLogoText: 'THX',
    testName: 'Chemical Process Modeling & Industrial Safety Standards',
    department: 'Chemical',
    categoryTab: 'core',
    skills: ['Chemical Process Engineering', 'Thermodynamics', 'Manufacturing Technology'],
    duration: '70 Mins',
    questions: '45 Multiple Choice Calculations',
    codingTasks: 'P&ID Piping Calculation',
    mode: 'Offline (CBT Centre)',
    modeCategory: 'Offline (CBT Centre)',
    date: '29 Sep 2026',
    dateCategory: 'Upcoming (Next 15 Days)',
    time: '02:00 PM - 03:10 PM',
    timeCategory: 'Afternoon (02:00 PM - 04:00 PM)',
    cbtCentre: 'Kolkata Eastern Regional CBT Lab (Salt Lake)',
    feeType: 'Free',
    feeCategory: 'Free',
    lastRegDate: '26 Sep 2026',
    testType: 'Core Engineering Evaluation',
    overview: 'Process engineering validation covering mass/energy balances, distillation column hydraulics, heat exchanger design, and HAZOP procedures.',
    syllabus: 'Reaction kinetics, thermodynamics of phase equilibria, process instrumentation diagrams (P&ID), and effluent treatment.',
    passingScore: '65%',
  },
  {
    id: 'sa_bio_01',
    company: 'Biocon Biologics',
    companyLogoBg: '#0e7490',
    companyLogoText: 'BIO',
    testName: 'Bioprocess Engineering & Biopharmaceutical Analytics',
    department: 'Biotechnology',
    categoryTab: 'core',
    skills: ['Biotechnology / Life Sciences', 'Chemical Process Engineering', 'Quantitative Ability'],
    duration: '75 Mins',
    questions: '50 Technical MCQs',
    codingTasks: 'Bioreactor Kinetic Modeling',
    mode: 'Online (Proctored Remote)',
    modeCategory: 'Online (Proctored Remote)',
    date: '30 Sep 2026',
    dateCategory: 'Upcoming (Next 15 Days)',
    time: '10:00 AM - 11:15 AM',
    timeCategory: 'Morning (09:30 AM - 11:30 AM)',
    cbtCentre: 'Online / Remote Proctored',
    feeType: 'Free',
    feeCategory: 'Free',
    lastRegDate: '28 Sep 2026',
    testType: 'Domain Knowledge',
    overview: 'Accredited assessment evaluating bioreactor operations, chromatography separation principles, downstream processing, and cGMP compliance.',
    syllabus: 'Enzyme kinetics, fermentation optimization, cell culture fundamentals, and molecular analytical tools.',
    passingScore: '70%',
  },
  {
    id: 'sa_auto_01',
    company: 'Mahindra & Mahindra',
    companyLogoBg: '#991b1b',
    companyLogoText: 'M&M',
    testName: 'EV Powertrain & Battery Management Systems (BMS)',
    department: 'Automobile',
    categoryTab: 'core',
    skills: ['Mechanical Design', 'Electrical Systems', 'Embedded Systems'],
    duration: '85 Mins',
    questions: '45 Technical Problem Scenarios',
    codingTasks: 'CAN Bus Diagnostic Script',
    mode: 'Offline (CBT Centre)',
    modeCategory: 'Offline (CBT Centre)',
    date: '26 Sep 2026',
    dateCategory: 'This Week',
    time: '02:00 PM - 03:25 PM',
    timeCategory: 'Afternoon (02:00 PM - 04:00 PM)',
    cbtCentre: 'Chennai IT Corridor Testing Facility (OMR)',
    feeType: 'Corporate Sponsored',
    feeCategory: 'Corporate Sponsored',
    lastRegDate: '24 Sep 2026',
    testType: 'Core Engineering Evaluation',
    overview: 'Evaluates electric vehicle traction motor control, thermal runaway mitigation, state-of-charge (SoC) algorithms, and high-voltage safety.',
    syllabus: 'Lithium-ion cell chemistry, CAN bus communication, inverter topology, and automotive chassis dynamics.',
    passingScore: '68%',
  },
  {
    id: 'sa_inst_01',
    company: 'ABB Automation',
    companyLogoBg: '#374151',
    companyLogoText: 'ABB',
    testName: 'Industrial Automation, PLC Programming & SCADA Networks',
    department: 'Instrumentation',
    categoryTab: 'core',
    skills: ['Electronics & Circuits', 'Manufacturing Technology', 'Networking & Cloud'],
    duration: '80 Mins',
    questions: '40 Diagnostic Questions',
    codingTasks: 'Ladder Logic Simulation',
    mode: 'Offline (CBT Centre)',
    modeCategory: 'Offline (CBT Centre)',
    date: '27 Sep 2026',
    dateCategory: 'Upcoming (Next 15 Days)',
    time: '09:30 AM - 10:50 AM',
    timeCategory: 'Morning (09:30 AM - 11:30 AM)',
    cbtCentre: 'Bengaluru Central Testing Hub (Electronic City)',
    feeType: 'Free',
    feeCategory: 'Free',
    lastRegDate: '25 Sep 2026',
    testType: 'Practical Simulation & Coding',
    overview: 'Assessment in programmable logic controllers (IEC 61131-3), distributed control systems (DCS), telemetry, and sensor calibration.',
    syllabus: 'Ladder logic diagnostics, 4-20mA current loops, Modbus/Profibus industrial protocols, and PID loop tuning.',
    passingScore: '72%',
  },
  {
    id: 'sa_apt_01',
    company: 'National Skill Development Agency',
    companyLogoBg: '#155e75',
    companyLogoText: 'NSDC',
    testName: 'National Graduate Quantitative Ability & Logical Reasoning',
    department: 'Aerospace / Multidisciplinary',
    categoryTab: 'cert',
    skills: ['Aptitude & Logical Reasoning', 'Quantitative Ability', 'Technical Communication'],
    duration: '60 Mins',
    questions: '50 Standardized Speed & Accuracy MCQs',
    codingTasks: null,
    mode: 'Online (Proctored Remote)',
    modeCategory: 'Online (Proctored Remote)',
    date: '23 Sep 2026',
    dateCategory: 'Today',
    time: 'Flexible 24/7 (On-Demand)',
    timeCategory: 'Flexible 24/7 (On-Demand)',
    cbtCentre: 'Online / Remote Proctored',
    feeType: 'Free',
    feeCategory: 'Free',
    lastRegDate: '22 Sep 2026',
    testType: 'Cognitive & Aptitude',
    overview: 'Benchmarked national aptitude exam verifying speed mathematics, deductive reasoning, spatial analysis, and critical comprehension.',
    syllabus: 'Permutations, probability, syllogisms, data interpretation tables, and analytical argument evaluations.',
    passingScore: '65%',
  },
]

// Recent Completed Assessment Results
const INITIAL_RECENT_RESULTS = [
  {
    id: 'res_01',
    name: 'National Technical Aptitude Benchmark',
    testName: 'National Technical Aptitude Benchmark',
    company: 'National Skill Development Agency',
    companyLogoBg: '#155e75',
    companyLogoText: 'NSDC',
    date: '14 Sep 2026',
    time: '10:00 AM - 11:00 AM',
    score: '88%',
    percentile: '94.2 Percentile',
    status: 'Certified',
    certId: 'IAS-CERT-NAT-8821',
    certName: 'Certificate of Excellence: National Technical Aptitude',
    certIssuer: 'IAS National Assessment Council & NSDC',
    certStatus: 'Active & Verified',
    mode: 'Online (Proctored Remote)',
    modeCategory: 'Online (Proctored Remote)',
    cbtCentre: 'Online / Remote Proctored',
    duration: '60 Mins',
    questions: '50 Speed & Accuracy MCQs',
    department: 'Aerospace / Multidisciplinary',
    testType: 'Cognitive & Aptitude',
    feeType: 'Free',
    feeCategory: 'Free',
    passingScore: '65%',
    overview: 'Benchmarked national aptitude exam verifying speed mathematics, deductive reasoning, spatial analysis, and critical comprehension.',
    syllabus: 'Permutations, probability, syllogisms, data interpretation tables, and analytical argument evaluations.',
    skills: ['Aptitude & Logical Reasoning', 'Quantitative Ability', 'Technical Communication'],
  },
  {
    id: 'res_02',
    name: 'Data Structures & Algorithmic Efficiency',
    testName: 'Data Structures & Algorithmic Efficiency',
    company: 'Tata Consultancy Services',
    companyLogoBg: '#1e3a5f',
    companyLogoText: 'TCS',
    date: '04 Sep 2026',
    time: '02:00 PM - 03:30 PM',
    score: '84%',
    percentile: '91.8 Percentile',
    status: 'Certified',
    certId: 'IAS-CERT-DSA-4419',
    certName: 'Certificate of Competency: Data Structures & Algorithms',
    certIssuer: 'IAS Engineering Evaluation Board & TCS',
    certStatus: 'Active & Verified',
    mode: 'Online (Proctored Remote)',
    modeCategory: 'Online (Proctored Remote)',
    cbtCentre: 'Online / Remote Proctored',
    duration: '90 Mins',
    questions: '45 Objective Technical Questions',
    department: 'Computer Science / IT',
    testType: 'Technical Assessment',
    feeType: 'Free',
    feeCategory: 'Free',
    passingScore: '70%',
    overview: 'Comprehensive evaluation in algorithmic complexity, graph traversals, and dynamic programming paradigms.',
    syllabus: 'Trees, heaps, graph shortest path algorithms, dynamic programming, and amortized complexity.',
    skills: ['Programming / Software Development', 'Data Structures & Algorithms'],
  },
  {
    id: 'res_03',
    name: 'Computer Networks & Internet Protocol Suite',
    testName: 'Computer Networks & Internet Protocol Suite',
    company: 'Cisco Systems / IAS',
    companyLogoBg: '#0284c7',
    companyLogoText: 'CIS',
    date: '22 Aug 2026',
    time: '11:00 AM - 12:20 PM',
    score: '78%',
    percentile: '86.4 Percentile',
    status: 'Certified',
    certId: 'IAS-CERT-NET-7712',
    certName: 'Certificate of Proficiency: Computer Networks & IP Suite',
    certIssuer: 'IAS Technical Standards Council',
    certStatus: 'Active & Verified',
    mode: 'Online (Proctored Remote)',
    modeCategory: 'Online (Proctored Remote)',
    cbtCentre: 'Online / Remote Proctored',
    duration: '80 Mins',
    questions: '40 Diagnostic Questions',
    department: 'Computer Science / IT',
    testType: 'Technical Assessment',
    feeType: 'Paid',
    feeCategory: 'Paid',
    passingScore: '65%',
    overview: 'Standardized evaluation testing OSI layer protocols, TCP congestion algorithms, BGP routing, and network subnetting.',
    syllabus: 'IPv4/IPv6 addressing, socket programming, DNS resolution hierarchy, and packet transmission security.',
    skills: ['Networking & Cloud', 'Programming / Software Development'],
  },
]

// Scheduled Upcoming Assessments for Student Assessment Status
const INITIAL_UPCOMING_TESTS = [
  {
    id: 'up_01',
    refId: 'sa_cs_01',
    testName: 'National Qualifier: Full-Stack & System Design Assessment',
    company: 'Tata Consultancy Services',
    companyLogoBg: '#1e3a5f',
    companyLogoText: 'TCS',
    date: '24 Sep 2026',
    time: '10:00 AM - 11:30 AM',
    mode: 'Online (Proctored Remote)',
    cbtCentre: 'Online / Remote Proctored',
    duration: '90 Mins',
    questions: '45 Objective Technical Questions',
    status: 'Confirmed Registration',
    department: 'Computer Science / IT',
    feeType: 'Free',
    passingScore: '70%',
    testType: 'Technical Assessment',
    overview: 'Standardized evaluation testing algorithmic efficiency, backend architecture, relational database indexing, and RESTful service design.',
    syllabus: 'Data structures (Trees, Graphs, DP), SQL query optimization, object-oriented concepts, and concurrency paradigms.',
    skills: ['Programming / Software Development', 'Data Structures & Algorithms', 'Database Management'],
  },
  {
    id: 'up_02',
    refId: 'sa_mech_01',
    testName: 'Automotive Mechanical Design & CAE Simulation Evaluation',
    company: 'Tata Motors',
    companyLogoBg: '#0f4c81',
    companyLogoText: 'TM',
    date: '26 Sep 2026',
    time: '02:00 PM - 03:15 PM',
    mode: 'Offline (CBT Centre)',
    cbtCentre: 'Pune National CBT Centre (Shivajinagar)',
    duration: '75 Mins',
    questions: '50 Domain Technical MCQs',
    status: 'Hall Ticket Issued',
    department: 'Mechanical',
    feeType: 'Free',
    passingScore: '65%',
    testType: 'Core Engineering Evaluation',
    overview: 'Evaluates structural strength analysis, finite element basics, GD&T tolerance standards, and thermal dissipation systems.',
    syllabus: 'Mechanics of solids, machine design principles, kinematics, fluid dynamics, and 3D modeling validation.',
    skills: ['Mechanical Design', 'CAD / Design', 'Thermodynamics'],
  },
]

export default function StudentSkillAssessments({
  student = {},
  onBack,
  onNavigateHome,
  onOpenDashboard,
  onOpenAchievementsExperience: _onOpenAchievementsExperience,
  onOpenInternships: _onOpenInternships,
  onOpenPlacements: _onOpenPlacements,
  onOpenPublicPost: _onOpenPublicPost,
  onEditProfile: _onEditProfile,
}) {
  // Student Profile Data matching StudentPlacements
  const s = student || {}
  const studentName = s.name || 'Student Member'
  const studentBranch = s.branch || s.course || 'B.Tech - Engineering Student'

  // Navigation & Category Tab
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'core' | 'software' | 'cert' | 'status'

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [selectedCompany, setSelectedCompany] = useState('All Companies')
  const [selectedSkill, setSelectedSkill] = useState('All Skills')
  const [selectedTestType, setSelectedTestType] = useState('All Test Types')
  const [selectedMode, setSelectedMode] = useState('All Modes')
  const [selectedFeeType, setSelectedFeeType] = useState('All Fee Types')
  const [selectedDate, setSelectedDate] = useState('All Dates')
  const [selectedTime, setSelectedTime] = useState('All Slots')
  const [selectedCbtCentre, setSelectedCbtCentre] = useState('All Centres / Online')
  const [sortOption, setSortOption] = useState('default')
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  // Bookmarks / Saved assessments state
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_saved_assessments')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Tests Taken Tracker
  const [takenTestIds, setTakenTestIds] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_taken_assessments')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Modals state
  const [takeTestModalItem, setTakeTestModalItem] = useState(null)
  const [isRecentResultsModalOpen, setIsRecentResultsModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [statusCategoryTab, setStatusCategoryTab] = useState('upcoming') // 'upcoming' | 'taken'
  const [toastMessage, setToastMessage] = useState('')

  // Selected assessment & result detail states for direct page navigation
  const [highlightedAssessmentId, setHighlightedAssessmentId] = useState(null)
  const [expandedAssessmentId, setExpandedAssessmentId] = useState(null)
  const [selectedResultDetail, setSelectedResultDetail] = useState(null)

  // Back Navigation Helper
  const handleBack = () => {
    if (onBack) onBack()
    else if (onOpenDashboard) onOpenDashboard()
  }

  // All completed assessment items (initial recent results + assessments taken in current session)
  const allCompletedItems = useMemo(() => {
    const sessionItems = takenTestIds.map((id) => {
      const match = INITIAL_ASSESSMENTS.find((a) => a.id === id)
      if (!match) return null
      return {
        ...match,
        name: match.testName,
        score: 'Session Submitted',
        percentile: 'Under Evaluation',
        certId: `IAS-REV-${match.id.toUpperCase()}`,
        status: 'Proctor Review in Progress',
        isSessionSubmitted: true,
      }
    }).filter(Boolean)

    return [...INITIAL_RECENT_RESULTS, ...sessionItems]
  }, [takenTestIds])

  // Dynamic counts for status overview
  const upcomingCount = useMemo(() => {
    return INITIAL_UPCOMING_TESTS.filter(
      (t) => !takenTestIds.includes(t.refId || t.id)
    ).length
  }, [takenTestIds])

  const completedCount = allCompletedItems.length

  // Consolidated Reset Filters Handler
  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedDepartment('All Departments')
    setSelectedCompany('All Companies')
    setSelectedSkill('All Skills')
    setSelectedTestType('All Test Types')
    setSelectedMode('All Modes')
    setSelectedFeeType('All Fee Types')
    setSelectedDate('All Dates')
    setSelectedTime('All Slots')
    setSelectedCbtCentre('All Centres / Online')
    setSortOption('default')
  }

  // 1. Upcoming Tests -> Direct navigation to Skill Assessments catalog & assessment detail
  const handleNavigateToUpcomingDetail = (item) => {
    setIsStatusModalOpen(false)
    handleResetFilters()
    setActiveTab('all')
    const targetId = item.refId || item.id
    const match = INITIAL_ASSESSMENTS.find(
      (a) => a.id === targetId || a.testName === item.testName
    ) || item
    setHighlightedAssessmentId(match.id)
    setExpandedAssessmentId(match.id)
    setTimeout(() => {
      const el = document.getElementById(`assessment-card-${match.id}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 120)
  }

  // 2. Tests Taken -> Direct navigation to verified result scorecard
  const handleNavigateToTakenDetail = (item) => {
    setIsStatusModalOpen(false)
    setIsRecentResultsModalOpen(false)
    setSelectedResultDetail(item)
    setTimeout(() => {
      const el = document.getElementById('sa-selected-result-scorecard')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 120)
  }

  // Toast auto-hide
  useEffect(() => {
    if (!toastMessage) return
    const t = setTimeout(() => setToastMessage(''), 3500)
    return () => clearTimeout(t)
  }, [toastMessage])

  // Toggle Save Assessment
  const handleToggleSave = (e, id) => {
    e.stopPropagation()
    const next = savedIds.includes(id)
      ? savedIds.filter((item) => item !== id)
      : [...savedIds, id]
    setSavedIds(next)
    try {
      localStorage.setItem('udaan_student_saved_assessments', JSON.stringify(next))
    } catch {}
    setToastMessage(savedIds.includes(id) ? 'Assessment removed from saved bookmarks.' : 'Assessment saved to bookmarks!')
  }

  // Confirm Start / Take Test
  const handleConfirmStartTest = (item) => {
    const updated = Array.from(new Set([...takenTestIds, item.id]))
    setTakenTestIds(updated)
    try {
      localStorage.setItem('udaan_student_taken_assessments', JSON.stringify(updated))
    } catch {}
    setTakeTestModalItem(null)
    setToastMessage(`Assessment session launched: ${item.testName}`)
  }

  // Dynamic Companies List from catalog
  const companyOptions = useMemo(() => {
    const list = Array.from(new Set(INITIAL_ASSESSMENTS.map((a) => a.company)))
    return ['All Companies', ...list.sort()]
  }, [])

  // Filter Check
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedDepartment !== 'All Departments' ||
    selectedCompany !== 'All Companies' ||
    selectedSkill !== 'All Skills' ||
    selectedTestType !== 'All Test Types' ||
    selectedMode !== 'All Modes' ||
    selectedFeeType !== 'All Fee Types' ||
    selectedDate !== 'All Dates' ||
    selectedTime !== 'All Slots' ||
    selectedCbtCentre !== 'All Centres / Online' ||
    sortOption !== 'default'

  // Filtered Assessments Calculation with Sorting
  const filteredAssessments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    const sourceList = activeTab === 'status' ? allCompletedItems : INITIAL_ASSESSMENTS

    return sourceList.filter((item) => {
      // Category Tab Filter (applies to catalog tabs)
      if (activeTab === 'core' && item.categoryTab !== 'core') return false
      if (activeTab === 'software' && item.categoryTab !== 'software') return false
      if (activeTab === 'cert' && item.categoryTab !== 'cert') return false

      // Primary Department Filter
      if (selectedDepartment !== 'All Departments' && item.department !== selectedDepartment) {
        return false
      }

      // Keyword Search (Company, Role/Test name, Skills)
      if (q) {
        const testTitle = item.testName || item.name || ''
        const matchesName = testTitle.toLowerCase().includes(q)
        const matchesCompany = item.company?.toLowerCase().includes(q)
        const matchesSkill = item.skills?.some((sk) => sk.toLowerCase().includes(q))
        const matchesDept = item.department?.toLowerCase().includes(q)
        if (!matchesName && !matchesCompany && !matchesSkill && !matchesDept) {
          return false
        }
      }

      // Company Filter
      if (selectedCompany !== 'All Companies' && item.company !== selectedCompany) {
        return false
      }

      // Skill Filter
      if (selectedSkill !== 'All Skills') {
        const hasSkill = item.skills?.some((sk) => sk.toLowerCase() === selectedSkill.toLowerCase())
        if (!hasSkill) return false
      }

      // Test Type Filter
      if (selectedTestType !== 'All Test Types' && item.testType !== selectedTestType) {
        return false
      }

      // Mode Filter
      if (selectedMode !== 'All Modes' && item.modeCategory !== selectedMode) {
        return false
      }

      // Fee Type Filter
      if (selectedFeeType !== 'All Fee Types' && item.feeCategory !== selectedFeeType) {
        return false
      }

      // Date Filter
      if (selectedDate !== 'All Dates' && item.dateCategory !== selectedDate) {
        return false
      }

      // Time Filter
      if (selectedTime !== 'All Slots' && item.timeCategory !== selectedTime) {
        return false
      }

      // CBT Centre Filter
      if (selectedCbtCentre !== 'All Centres / Online' && item.cbtCentre !== selectedCbtCentre) {
        return false
      }

      return true
    }).sort((a, b) => {
      const aName = a.testName || a.name || ''
      const bName = b.testName || b.name || ''
      if (sortOption === 'company_az') {
        return a.company.localeCompare(b.company)
      }
      if (sortOption === 'name_az') {
        return aName.localeCompare(bName)
      }
      if (sortOption === 'duration') {
        return parseInt(a.duration, 10) - parseInt(b.duration, 10)
      }
      if (sortOption === 'free_first') {
        const aFree = (a.feeType || '').toLowerCase().includes('free')
        const bFree = (b.feeType || '').toLowerCase().includes('free')
        if (aFree && !bFree) return -1
        if (!aFree && bFree) return 1
      }
      return 0
    })
  }, [
    activeTab,
    allCompletedItems,
    selectedDepartment,
    searchQuery,
    selectedCompany,
    selectedSkill,
    selectedTestType,
    selectedMode,
    selectedFeeType,
    selectedDate,
    selectedTime,
    selectedCbtCentre,
    sortOption,
  ])

  // Assessment opportunity card renderer
  const renderAssessmentCard = (item) => {
    const isTaken = takenTestIds.includes(item.id)
    const isSaved = savedIds.includes(item.id)
    const isHighlighted = highlightedAssessmentId === item.id
    const isExpanded = expandedAssessmentId === item.id

    return (
      /* STRICT RULE: Assessment cards themselves do NOT act as clickable navigation wrappers */
      <article
        key={item.id}
        id={`assessment-card-${item.id}`}
        className={`sa-assessment-card ${isHighlighted ? 'is-highlighted' : ''}`}
      >
        <div className="sa-card-main-row">
          {/* Company Logo */}
          <div
            className="sa-company-logo"
            style={{ backgroundColor: item.companyLogoBg || '#112233' }}
          >
            {item.companyLogoText || item.company.slice(0, 2).toUpperCase()}
          </div>

          {/* Card Details */}
          <div className="sa-card-details">
            <div className="sa-card-title-row">
              <div className="sa-company-name-group">
                <span className="sa-company-name">{item.company}</span>
                <span className="sa-verified-badge" title="Official Partner Assessment">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Verified Assessment
                </span>
                <span className="sa-drive-badge">{item.testType}</span>
              </div>

              <div className="sa-card-top-right">
                {/* Score badge if completed or fee badge if available */}
                {item.score ? (
                  <span className="sa-result-badge" style={{ fontSize: '0.78rem', padding: '3px 9px' }} title={`Percentile: ${item.percentile || 'Evaluated'}`}>
                    {item.status || 'Certified'}: {item.score}
                  </span>
                ) : (item.feeType || '').toLowerCase().includes('free') ? (
                  <span className="sa-fee-badge free" title="Registration Fee: 100% Free">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    FREE
                  </span>
                ) : (item.feeType || '').toLowerCase().includes('paid') ? (
                  <span className="sa-fee-badge paid" title="Registration Fee: Paid Certification">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                    PAID
                  </span>
                ) : (
                  <span className="sa-fee-badge sponsored" title="Corporate Sponsored: Free for Students">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    SPONSORED
                  </span>
                )}

                <button
                  type="button"
                  className={`sa-bookmark-btn ${isSaved ? 'is-saved' : ''}`}
                  onClick={(e) => handleToggleSave(e, item.id)}
                  title={isSaved ? 'Remove from saved' : 'Save assessment to bookmarks'}
                  aria-label={isSaved ? 'Remove from saved' : 'Save assessment to bookmarks'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <h3 className="sa-role-title">{item.testName || item.name}</h3>

            {/* Complete Specification Pills Row with Full Information Density */}
            <div className="sa-specs-row">
              {/* Duration */}
              {item.duration && (
                <span className="sa-spec-pill" title="Test Duration">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 14 14" />
                  </svg>
                  {item.duration}
                </span>
              )}

              {/* Number of Questions */}
              {item.questions && (
                <span className="sa-spec-pill" title="Number of Questions">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  {item.questions}
                </span>
              )}

              {/* Coding Tasks, if applicable */}
              {item.codingTasks && (
                <span className="sa-spec-pill coding" title="Practical Coding / Simulation Tasks">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                  {item.codingTasks}
                </span>
              )}

              {/* Online / Offline Mode */}
              {item.mode && (
                <span className="sa-spec-pill" title="Delivery Mode">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  {item.mode}
                </span>
              )}

              {/* Date */}
              {item.date && (
                <span className="sa-spec-pill" title="Scheduled / Completed Date">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {item.date}
                </span>
              )}

              {/* Time */}
              {item.time && (
                <span className="sa-spec-pill" title="Scheduled Time Slot">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 14 10" />
                  </svg>
                  {item.time}
                </span>
              )}

              {/* CBT Centre / Location */}
              {item.cbtCentre && (
                <span className={`sa-spec-pill ${item.mode?.includes('Offline') ? 'cbt' : ''}`} title="CBT Centre / Examination Facility">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {item.cbtCentre}
                </span>
              )}

              {/* Academic Department */}
              {item.department && (
                <span className="sa-spec-pill dept" title="Academic Department">
                  {item.department}
                </span>
              )}

              {/* Passing Standard */}
              {item.passingScore && (
                <span className="sa-spec-pill passing" title="Passing Benchmark Standard">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Pass: {item.passingScore}
                </span>
              )}

              {/* Last Registration Date, if available */}
              {item.lastRegDate && (
                <span className="sa-spec-pill deadline" title="Registration Deadline">
                  Last Reg: {item.lastRegDate}
                </span>
              )}
            </div>

            {/* Skills Covered Row */}
            {item.skills && item.skills.length > 0 && (
              <div className="sa-skills-row">
                <span className="sa-skills-label">Evaluated Competencies:</span>
                {item.skills.map((sk) => (
                  <span key={sk} className="sa-skill-tag">{sk}</span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons Column */}
          <div className="sa-card-actions">
            <button
              type="button"
              className="sa-btn-view"
              onClick={() => {
                const nextExpanded = expandedAssessmentId === item.id ? null : item.id
                setExpandedAssessmentId(nextExpanded)
                if (highlightedAssessmentId === item.id) {
                  setHighlightedAssessmentId(null)
                }
              }}
              title={expandedAssessmentId === item.id ? 'Hide full details' : 'View full assessment details & syllabus'}
            >
              {expandedAssessmentId === item.id ? 'Hide Details' : 'View Details'}
            </button>

            {item.score ? (
              <button
                type="button"
                className="sa-btn-applied"
                style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac', cursor: 'pointer' }}
                onClick={() => handleNavigateToTakenDetail(item)}
                title="View verified scorecard and credential badge"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Scorecard
              </button>
            ) : isTaken ? (
              <button
                type="button"
                className="sa-btn-applied"
                disabled
                title="Assessment already completed in current session"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Completed
              </button>
            ) : (
              <button
                type="button"
                className="sa-btn-apply"
                onClick={() => setTakeTestModalItem(item)}
                title="Start proctored skill assessment"
              >
                Take Test →
              </button>
            )}
          </div>
        </div>

        {/* Full Details Section when Selected / Navigated from Status Overview */}
        {isExpanded && (
          <div
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              borderRadius: 8,
              padding: '14px 16px',
              animation: 'saFadeIn 0.2s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', background: '#e0f2fe', padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ★ Complete Assessment &amp; Syllabus Details
              </span>
              <button
                type="button"
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: '2px 6px' }}
                onClick={(e) => {
                  e.stopPropagation()
                  setHighlightedAssessmentId(null)
                  setExpandedAssessmentId(null)
                }}
              >
                ✕ Collapse
              </button>
            </div>

            <div style={{ marginBottom: 10 }}>
              <strong style={{ fontSize: '0.8rem', color: '#0f1d2f', display: 'block', marginBottom: 4 }}>
                Assessment Overview:
              </strong>
              <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                {item.overview}
              </p>
            </div>

            <div style={{ marginBottom: 10 }}>
              <strong style={{ fontSize: '0.8rem', color: '#0f1d2f', display: 'block', marginBottom: 4 }}>
                Technical Syllabus &amp; Subject Areas:
              </strong>
              <p style={{ fontSize: '0.82rem', color: '#334155', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '8px 12px', margin: 0, lineHeight: 1.5 }}>
                {item.syllabus}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, fontSize: '0.78rem', color: '#475569', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 12px' }}>
              <div>Testing Facility / Centre: <strong style={{ color: '#0f1d2f' }}>{item.cbtCentre}</strong></div>
              <div>Passing Benchmark: <strong style={{ color: '#166534' }}>{item.passingScore}</strong></div>
              <div>Academic Department: <strong style={{ color: '#0f1d2f' }}>{item.department}</strong></div>
              <div>Evaluation Mode: <strong style={{ color: '#0f1d2f' }}>{item.mode}</strong></div>
            </div>
          </div>
        )}
      </article>
    )
  }

  return (
    <div className="sa-page-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#112233', color: '#ffffff', border: '1px solid #b3881e', borderRadius: 8, padding: '10px 18px', fontSize: '0.84rem', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', zIndex: 1300, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#10b981' }}>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ====================================================================
          TOP NAVIGATION NAVBAR (Matches StudentPlacements & StudentInternships)
          ==================================================================== */}
      <header className="sa-top-navbar">
        <div className="sa-nav-left">
          <button
            type="button"
            className="sa-nav-back-btn"
            onClick={handleBack}
            title="Return to Student Dashboard"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Dashboard
          </button>

          <div className="sa-nav-brand">
            <span
              className="sa-nav-brand-bold"
              onClick={onNavigateHome}
              style={{ cursor: onNavigateHome ? 'pointer' : 'default' }}
              title={onNavigateHome ? 'Return to Portal Home' : ''}
            >
              IAS Collaboration Portal
            </span>
            <span className="sa-nav-slash">/</span>
            <span
              onClick={handleBack}
              style={{ cursor: 'pointer' }}
              title="Return to Student Dashboard"
            >
              Student Portal
            </span>
            <span className="sa-nav-slash">/</span>
            <span className="sa-nav-active-tag">Skill Assessments</span>
          </div>
        </div>

        <div className="sa-nav-right">
          <div className="sa-nav-user-chip">
            {s.profilePic ? (
              <img src={s.profilePic} alt={studentName} className="sa-nav-avatar" />
            ) : (
              <div className="sa-nav-avatar">
                {studentName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="sa-nav-user-meta">
              <span className="sa-nav-user-name">{studentName}</span>
              <span className="sa-nav-user-sub">{studentBranch}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================
          MAIN CONTENT CONTAINER (Matches StudentPlacements Structure)
          ==================================================================== */}
      <main className="sa-main-content">
        {/* COMPACT PAGE HEADER */}
        <div className="sa-page-header">
          <div className="sa-header-info">
            <h1 className="sa-page-title">Skill Assessments</h1>
            <p className="sa-page-subtitle">
              Discover and take verified skill assessments, technical evaluations, and industry-standard certifications offered by institutions and partner corporations.
            </p>
          </div>
        </div>

        {/* WORKSPACE 2-COLUMN LAYOUT (Desktop: Feed + Right Sidebar Panel) */}
        <div className="sa-workspace-layout">
          {/* ================================================================
              LEFT COLUMN: MAIN LISTINGS FEED & SEARCH/FILTER
              ================================================================ */}
          <div className="sa-main-feed">
            {/* SEARCH & DEPARTMENT FILTER CARD */}
            <section className="sa-filter-card" aria-label="Search and Filter Assessments">
              <div className="sa-search-row">
                {/* Keyword Search Input */}
                <div className="sa-search-input-wrap">
                  <svg className="sa-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    className="sa-search-input"
                    placeholder="Search by company, skill, or test name (e.g. TCS, CAD, Python, L&T, SCADA)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search assessments"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="sa-search-clear-btn"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search input"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Primary Academic Department Dropdown */}
                <div className="sa-dept-select-wrap">
                  <label htmlFor="sa-primary-dept" className="sa-sr-only">Filter by Department</label>
                  <select
                    id="sa-primary-dept"
                    className="sa-dept-select"
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

                {/* Sort Option Dropdown */}
                <div className="sa-sort-select-wrap">
                  <label htmlFor="sa-sort-select" className="sa-sr-only">Sort Assessments</label>
                  <select
                    id="sa-sort-select"
                    className="sa-sort-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    title="Sort Assessments"
                  >
                    <option value="default">Sort: Default Order</option>
                    <option value="company_az">Company (A-Z)</option>
                    <option value="name_az">Test Name (A-Z)</option>
                    <option value="duration">Duration (Shortest First)</option>
                    <option value="free_first">Fee: Free First</option>
                  </select>
                </div>

                {/* Search Actions: Toggle Detailed Filters & Reset */}
                <div className="sa-search-actions">
                  <button
                    type="button"
                    className={`sa-filter-toggle-btn ${isFilterDrawerOpen ? 'active' : ''}`}
                    onClick={() => setIsFilterDrawerOpen((prev) => !prev)}
                    title="Toggle detailed filters"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    <span>Filters {hasActiveFilters && '●'}</span>
                  </button>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="sa-filter-reset-btn"
                      onClick={handleResetFilters}
                      title="Clear all filters"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Category Tabs */}
              <div className="sa-quick-tabs">
                <button
                  type="button"
                  className={`sa-quick-tab ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Assessments ({INITIAL_ASSESSMENTS.length})
                </button>
                <button
                  type="button"
                  className={`sa-quick-tab ${activeTab === 'core' ? 'active' : ''}`}
                  onClick={() => setActiveTab('core')}
                >
                  Core Engineering
                </button>
                <button
                  type="button"
                  className={`sa-quick-tab ${activeTab === 'software' ? 'active' : ''}`}
                  onClick={() => setActiveTab('software')}
                >
                  Software &amp; IT
                </button>
                <button
                  type="button"
                  className={`sa-quick-tab ${activeTab === 'cert' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cert')}
                >
                  Standard Certifications
                </button>
                <button
                  type="button"
                  className={`sa-quick-tab ${activeTab === 'status' ? 'active' : ''}`}
                  onClick={() => setActiveTab('status')}
                >
                  My Completed ({completedCount})
                </button>
              </div>

              {/* Collapsible Advanced Filters Drawer (NO Difficulty Level) */}
              <div className={`sa-filters-grid ${isFilterDrawerOpen ? 'is-open' : ''}`}>
                {/* 1. Company */}
                <div className="sa-filter-col">
                  <label className="sa-filter-label" htmlFor="sa-f-comp">Company</label>
                  <select
                    id="sa-f-comp"
                    className="sa-filter-select"
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                  >
                    {companyOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Skill */}
                <div className="sa-filter-col">
                  <label className="sa-filter-label" htmlFor="sa-f-skill">Skill</label>
                  <select
                    id="sa-f-skill"
                    className="sa-filter-select"
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                  >
                    {SKILL_OPTIONS.map((sk) => (
                      <option key={sk} value={sk}>{sk}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Test Type */}
                <div className="sa-filter-col">
                  <label className="sa-filter-label" htmlFor="sa-f-type">Test Type</label>
                  <select
                    id="sa-f-type"
                    className="sa-filter-select"
                    value={selectedTestType}
                    onChange={(e) => setSelectedTestType(e.target.value)}
                  >
                    {TEST_TYPES.map((tt) => (
                      <option key={tt} value={tt}>{tt}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Mode */}
                <div className="sa-filter-col">
                  <label className="sa-filter-label" htmlFor="sa-f-mode">Mode</label>
                  <select
                    id="sa-f-mode"
                    className="sa-filter-select"
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                  >
                    {MODES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* 5. Fee Type */}
                <div className="sa-filter-col">
                  <label className="sa-filter-label" htmlFor="sa-f-fee">Fee Type</label>
                  <select
                    id="sa-f-fee"
                    className="sa-filter-select"
                    value={selectedFeeType}
                    onChange={(e) => setSelectedFeeType(e.target.value)}
                  >
                    {FEE_TYPES.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* 6. Date */}
                <div className="sa-filter-col">
                  <label className="sa-filter-label" htmlFor="sa-f-date">Date</label>
                  <select
                    id="sa-f-date"
                    className="sa-filter-select"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    {DATES.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* 7. Time */}
                <div className="sa-filter-col">
                  <label className="sa-filter-label" htmlFor="sa-f-time">Time</label>
                  <select
                    id="sa-f-time"
                    className="sa-filter-select"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* 8. CBT Centre / Location */}
                <div className="sa-filter-col">
                  <label className="sa-filter-label" htmlFor="sa-f-cbt">CBT Centre / Location</label>
                  <select
                    id="sa-f-cbt"
                    className="sa-filter-select"
                    value={selectedCbtCentre}
                    onChange={(e) => setSelectedCbtCentre(e.target.value)}
                  >
                    {CBT_CENTRES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Direct Result / Scorecard Detail Banner if Navigated from Status Overview */}
            {selectedResultDetail && (
              <div
                id="sa-selected-result-scorecard"
                style={{
                  background: 'linear-gradient(135deg, #0f1d2f, #1e3a5f)',
                  color: '#ffffff',
                  borderRadius: 8,
                  padding: '16px 20px',
                  marginBottom: 16,
                  border: '1px solid #b3881e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  flexWrap: 'wrap',
                  boxShadow: '0 4px 14px rgba(15, 29, 47, 0.15)',
                  animation: 'saFadeIn 0.2s ease-out',
                }}
              >
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ background: '#b3881e', color: '#ffffff', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                      Verified Assessment Scorecard
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#93c5fd' }}>
                      {selectedResultDetail.company}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.02rem', fontWeight: 800, color: '#ffffff' }}>
                    {selectedResultDetail.name || selectedResultDetail.testName}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: '0.78rem', color: '#cbd5e1' }}>
                    <span>Score: <strong style={{ color: '#4ade80' }}>{selectedResultDetail.score}</strong></span>
                    <span>Percentile: <strong style={{ color: '#ffffff' }}>{selectedResultDetail.percentile}</strong></span>
                    <span>Completed: <strong>{selectedResultDetail.date || 'Today (Session)'}</strong></span>
                    <span>Credential ID: <strong style={{ color: '#93c5fd' }}>{selectedResultDetail.certId || 'IAS-VERIFIED'}</strong></span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    type="button"
                    className="sa-btn-view"
                    style={{ fontSize: '0.76rem', padding: '6px 14px', background: 'rgba(255,255,255,0.12)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.25)' }}
                    onClick={() => setSelectedResultDetail(null)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* AVAILABLE ASSESSMENTS CARDS LIST */}
            {filteredAssessments.length === 0 ? (
              <div className="sa-empty-state">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <h3 className="sa-empty-title">No Skill Assessments Found</h3>
                <p className="sa-empty-desc">
                  No active assessment sessions matched your current filter combinations. Try resetting filters to explore opportunities across other academic departments.
                </p>
                <button type="button" className="sa-btn-apply" onClick={handleResetFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="sa-cards-list">
                {filteredAssessments.map(renderAssessmentCard)}
              </div>
            )}
          </div>

          {/* ================================================================
              RIGHT SIDEBAR: MY STATUS, RECENT RESULTS, CERTIFICATION WIDGET
              ================================================================ */}
          <aside className="sa-sidebar" aria-label="Assessment Status and Performance">
            {/* 1. MY ASSESSMENT STATUS WIDGET */}
            <div className="sa-side-card">
              <div className="sa-side-header">
                <div className="sa-side-title-group">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.4">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    <line x1="12" y1="11" x2="12" y2="17" />
                    <line x1="9" y1="14" x2="15" y2="14" />
                  </svg>
                  <h3 className="sa-side-title">My Assessment Status</h3>
                </div>
                <button
                  type="button"
                  className="sa-side-link-btn"
                  onClick={() => {
                    setStatusCategoryTab('upcoming')
                    setIsStatusModalOpen(true)
                  }}
                >
                  View All
                </button>
              </div>

              <div className="sa-status-list">
                {/* Upcoming Tests */}
                <div className="sa-status-row">
                  <div className="sa-status-left">
                    <div className="sa-status-icon-box upcoming">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 14 14" />
                      </svg>
                    </div>
                    <div className="sa-status-info">
                      <span className="sa-status-title">Upcoming Tests</span>
                      <span className="sa-status-subtitle">Scheduled test sessions</span>
                    </div>
                  </div>
                  <span className="sa-status-count">{upcomingCount}</span>
                </div>

                {/* Tests Taken */}
                <div className="sa-status-row">
                  <div className="sa-status-left">
                    <div className="sa-status-icon-box taken">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                        <polyline points="9 11 12 14 22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    </div>
                    <div className="sa-status-info">
                      <span className="sa-status-title">Tests Taken</span>
                      <span className="sa-status-subtitle">Proctored submissions</span>
                    </div>
                  </div>
                  <span className="sa-status-count">{completedCount}</span>
                </div>
              </div>
            </div>

            {/* 2. RECENT RESULTS WIDGET */}
            <div className="sa-side-card" id="sa-recent-results-widget">
              <div className="sa-side-header">
                <div className="sa-side-title-group">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.4">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                  <h3 className="sa-side-title">Recent Results</h3>
                </div>
                <button
                  type="button"
                  className="sa-side-link-btn"
                  onClick={() => setIsRecentResultsModalOpen(true)}
                >
                  View All
                </button>
              </div>

              <div className="sa-results-list">
                {INITIAL_RECENT_RESULTS.map((res) => (
                  <div key={res.id} className="sa-result-item">
                    <div className="sa-result-info">
                      <span className="sa-result-title" title={res.name}>{res.name}</span>
                      <span className="sa-result-date">Completed on {res.date}</span>
                    </div>
                    <span className="sa-result-badge" title={res.percentile}>
                      {res.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ====================================================================
          MODALS
          ==================================================================== */}

      {/* 1. TAKE TEST / CONFIRMATION MODAL */}
      {takeTestModalItem && (
        <div className="sa-modal-overlay" role="dialog" aria-modal="true" onClick={() => setTakeTestModalItem(null)}>
          <div className="sa-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="sa-modal-header" style={{ background: '#166534' }}>
              <div className="sa-modal-header-info">
                <h2 className="sa-modal-title">Launch Assessment Session</h2>
              </div>
              <button
                type="button"
                className="sa-modal-close-btn"
                onClick={() => setTakeTestModalItem(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="sa-modal-body">
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#dcfce7', color: '#166534', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 14 14" />
                  </svg>
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', color: '#0f1d2f' }}>
                  {takeTestModalItem.testName}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {takeTestModalItem.company} • {takeTestModalItem.duration} • {takeTestModalItem.questions}
                </span>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '12px', fontSize: '0.8rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div><strong>Candidate Name:</strong> {studentName}</div>
                <div><strong>Academic Department:</strong> {studentBranch}</div>
                <div><strong>Testing Mode:</strong> {takeTestModalItem.mode}</div>
                <div><strong>Testing Location / Centre:</strong> {takeTestModalItem.cbtCentre}</div>
              </div>

              <div style={{ fontSize: '0.76rem', color: '#64748b', lineHeight: 1.4 }}>
                ℹ️ <strong>Proctoring Notice:</strong> Your assessment environment will be proctored according to institutional test guidelines. Ensure a reliable connection and appropriate testing conditions.
              </div>
            </div>

            <div className="sa-modal-footer">
              <button
                type="button"
                className="sa-btn-view"
                onClick={() => setTakeTestModalItem(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="sa-btn-apply"
                onClick={() => handleConfirmStartTest(takeTestModalItem)}
              >
                Start Assessment Session →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. VIEW ALL RECENT RESULTS MODAL */}
      {isRecentResultsModalOpen && (
        <div className="sa-modal-overlay" role="dialog" aria-modal="true" onClick={() => setIsRecentResultsModalOpen(false)}>
          <div className="sa-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="sa-modal-header">
              <div className="sa-modal-header-info">
                <h2 className="sa-modal-title">Assessment History &amp; Verified Results</h2>
                <p className="sa-modal-subtitle">Official records of completed skill evaluations, verified scorecards, and credential badges</p>
              </div>
              <button
                type="button"
                className="sa-modal-close-btn"
                onClick={() => setIsRecentResultsModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="sa-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {allCompletedItems.map((res) => (
                  <div
                    key={res.id}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 14,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569' }}>{res.company}</span>
                        <span style={{ fontSize: '0.68rem', color: '#166534', fontWeight: 700, background: '#dcfce7', padding: '1px 6px', borderRadius: 4 }}>
                          ✓ {res.status || 'Verified'}
                        </span>
                      </div>
                      <strong style={{ fontSize: '0.9rem', color: '#0f1d2f', display: 'block', marginBottom: 3 }}>
                        {res.name || res.testName}
                      </strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span>Completed on {res.date || 'Today (Session)'}</span>
                        <span>•</span>
                        <span style={{ color: '#0f1d2f', fontWeight: 600 }}>{res.percentile}</span>
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#0369a1', fontWeight: 600, marginTop: 4 }}>
                        Credential ID: {res.certId}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <span className="sa-result-badge" style={{ fontSize: '0.9rem', padding: '4px 10px', display: 'inline-block' }}>
                        Score: {res.score}
                      </span>
                      <button
                        type="button"
                        className="sa-btn-view"
                        style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleNavigateToTakenDetail(res)
                        }}
                      >
                        View Scorecard
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sa-modal-footer">
              <button
                type="button"
                className="sa-btn-view"
                onClick={() => setIsRecentResultsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. VIEW ALL ASSESSMENT STATUS MODAL */}
      {isStatusModalOpen && (
        <div className="sa-modal-overlay" role="dialog" aria-modal="true" onClick={() => setIsStatusModalOpen(false)}>
          <div className="sa-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 700, maxHeight: '88vh' }}>
            <div className="sa-modal-header">
              <div className="sa-modal-header-info">
                <h2 className="sa-modal-title">My Assessment Status &amp; Activity Overview</h2>
                <p className="sa-modal-subtitle">
                  This section contains your complete assessment activity and status records across upcoming tests and completed submissions.
                </p>
              </div>
              <button
                type="button"
                className="sa-modal-close-btn"
                onClick={() => setIsStatusModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* TWO CATEGORY TABS: UPCOMING TESTS & TESTS TAKEN */}
            <div style={{ padding: '12px 20px 0', display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              {[
                { id: 'upcoming', label: 'Upcoming Tests' },
                { id: 'taken', label: 'Tests Taken' },
              ].map((tab) => {
                const isActive = statusCategoryTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStatusCategoryTab(tab.id)}
                    style={{
                      background: isActive ? '#112233' : '#ffffff',
                      color: isActive ? '#ffffff' : '#334155',
                      border: isActive ? '1px solid #112233' : '1px solid #cbd5e1',
                      borderRadius: '20px',
                      padding: '6px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginBottom: 10,
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? '0 2px 6px rgba(17, 34, 51, 0.18)' : 'none',
                    }}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className="sa-modal-body">
              {/* CATEGORY 1: UPCOMING TESTS */}
              {statusCategoryTab === 'upcoming' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="sa-status-icon-box upcoming" style={{ width: 28, height: 28 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 14 14" />
                        </svg>
                      </div>
                      <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#0f1d2f' }}>
                        Upcoming Tests
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#15803d', background: '#dcfce7', fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>
                      {upcomingCount} Scheduled
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {INITIAL_UPCOMING_TESTS.filter((t) => !takenTestIds.includes(t.refId || t.id)).map((test) => (
                      <div
                        key={test.id}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: 8,
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 14,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569' }}>
                              {test.company}
                            </span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1e40af', background: '#dbeafe', padding: '2px 8px', borderRadius: 4 }}>
                              {test.status}
                            </span>
                          </div>
                          <h4 style={{ margin: '0 0 6px', fontSize: '0.92rem', fontWeight: 800, color: '#0f1d2f' }}>
                            {test.testName}
                          </h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: '0.75rem', color: '#475569' }}>
                            <span>📅 Date: <strong>{test.date}</strong></span>
                            <span>🕒 Time: <strong>{test.time}</strong></span>
                            <span>⏱️ Duration: <strong>{test.duration}</strong></span>
                            <span>💻 Mode: <strong>{test.mode}</strong></span>
                            <span>📍 Centre: <strong>{test.cbtCentre}</strong></span>
                          </div>
                        </div>
                        <div style={{ flexShrink: 0 }}>
                          <button
                            type="button"
                            className="sa-btn-view"
                            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleNavigateToUpcomingDetail(test)
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CATEGORY 2: TESTS TAKEN */}
              {statusCategoryTab === 'taken' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="sa-status-icon-box taken" style={{ width: 28, height: 28 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                          <polyline points="9 11 12 14 22 4" />
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                      </div>
                      <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#0f1d2f' }}>
                        Tests Taken
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#166534', background: '#dcfce7', fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>
                      {completedCount} Completed
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {allCompletedItems.map((res) => (
                      <div
                        key={`taken_${res.id}`}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: 8,
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 14,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569' }}>
                              {res.company}
                            </span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: 4 }}>
                              ✓ {res.status || 'Completed'}
                            </span>
                          </div>
                          <h4 style={{ margin: '0 0 6px', fontSize: '0.92rem', fontWeight: 800, color: '#0f1d2f' }}>
                            {res.name || res.testName}
                          </h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: '0.75rem', color: '#475569' }}>
                            <span>📅 Test Date: <strong>{res.date || 'Today (Session)'}</strong></span>
                            <span>💻 Mode: <strong>{res.mode}</strong></span>
                            <span style={{ color: '#0369a1', fontWeight: 600 }}>
                              📊 Result: <strong>{res.score}</strong>
                            </span>
                          </div>
                        </div>
                        <div style={{ flexShrink: 0 }}>
                          <button
                            type="button"
                            className="sa-btn-view"
                            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleNavigateToTakenDetail(res)
                            }}
                          >
                            View Scorecard
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="sa-modal-footer">
              <button
                type="button"
                className="sa-btn-view"
                onClick={() => setIsStatusModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
