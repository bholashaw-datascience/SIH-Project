import { useState, useMemo, useEffect } from 'react'
import './StudentInternships.css'

// Default Verified Opportunities for Institutional Network
const INITIAL_INTERNSHIPS = [
  {
    id: 'int_01',
    company: 'Microsoft India',
    companyLogoBg: '#0078d4',
    companyLogoText: 'MS',
    verifiedCompany: true,
    role: 'Software Engineering Intern',
    department: 'Cloud & AI Division',
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
    company: 'Google India',
    companyLogoBg: '#ea4335',
    companyLogoText: 'G',
    verifiedCompany: true,
    role: 'AI & Machine Learning Research Intern',
    department: 'Google Research India',
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
    company: 'Razorpay Technologies',
    companyLogoBg: '#0c2340',
    companyLogoText: 'RZ',
    verifiedCompany: true,
    role: 'Full Stack Web Developer Intern',
    department: 'Fintech Payments Platform',
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
    company: 'Tata Consultancy Services (TCS)',
    companyLogoBg: '#1e3a8a',
    companyLogoText: 'TCS',
    verifiedCompany: true,
    role: 'Cloud Infrastructure & DevOps Intern',
    department: 'Enterprise Cloud Transformation Unit',
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
  {
    id: 'int_05',
    company: 'Zomato Design Studios',
    companyLogoBg: '#e23744',
    companyLogoText: 'ZM',
    verifiedCompany: true,
    role: 'UI/UX Design & Product Intern',
    department: 'Consumer Experience Design',
    duration: '3 Months',
    durationMonths: 3,
    stipend: '₹40,000 / month',
    stipendAmount: 40000,
    type: 'Hybrid',
    location: 'Gurugram, Haryana',
    requiredSkills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Wireframing'],
    postedDate: 'Just now',
    postedDaysAgo: 0,
    deadline: '2026-10-05',
    displayDeadline: '05 Oct 2026',
    isUrgent: true,
    openings: 4,
    eligibility: 'Design, Engineering, or Humanities students with a portfolio showcasing interactive design work.',
    minCgpa: 6.5,
    overview: 'Design engaging consumer mobile applications and order tracking micro-interactions that delight millions of daily active users across urban metros.',
    responsibilities: [
      'Conduct user interviews, usability audits, and card-sorting exercises.',
      'Create high-fidelity interactive prototypes in Figma with micro-animations.',
      'Maintain and expand the design token library for iOS and Android platforms.',
      'Collaborate with frontend engineers to ensure design fidelity in production builds.'
    ],
    perks: ['Zomato Gold Benefits', 'MacBook Pro workstation provided', 'Mentorship from Design Leads', 'Portfolio Case-Study Approval'],
    selectionProcess: 'Portfolio Review → Design Challenge (48h) → Design Walkthrough Round → Final Chat'
  },
  {
    id: 'int_06',
    company: 'Siemens Healthineers',
    companyLogoBg: '#0d9488',
    companyLogoText: 'SH',
    verifiedCompany: true,
    role: 'Embedded Systems & IoT Intern',
    department: 'Medical Device Engineering',
    duration: '6 Months',
    durationMonths: 6,
    stipend: '₹35,000 / month',
    stipendAmount: 35000,
    type: 'On-site',
    location: 'Bengaluru, Karnataka',
    requiredSkills: ['Embedded C', 'C++', 'RTOS', 'Microcontrollers', 'IoT Protocols'],
    postedDate: '4 days ago',
    postedDaysAgo: 4,
    deadline: '2026-11-01',
    displayDeadline: '01 Nov 2026',
    isUrgent: false,
    openings: 5,
    eligibility: 'B.Tech/B.E. in ECE, EEE, Instrumentation, or Biomedical Engineering. CGPA ≥ 7.2.',
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
  {
    id: 'int_07',
    company: 'Wipro Cyber Defense Labs',
    companyLogoBg: '#3b82f6',
    companyLogoText: 'WP',
    verifiedCompany: true,
    role: 'Cybersecurity Analyst Intern',
    department: 'Security Operations & Threat Intelligence',
    duration: '3 Months',
    durationMonths: 3,
    stipend: '₹28,000 / month',
    stipendAmount: 28000,
    type: 'Remote',
    location: 'Remote - India',
    requiredSkills: ['Networking', 'Linux', 'Wireshark', 'Python', 'Vulnerability Assessment'],
    postedDate: '6 days ago',
    postedDaysAgo: 6,
    deadline: '2026-10-18',
    displayDeadline: '18 Oct 2026',
    isUrgent: false,
    openings: 10,
    eligibility: 'Engineering students in CSE, IT, Cyber Security, or Information Assurance. CGPA ≥ 6.8.',
    minCgpa: 6.8,
    overview: 'Monitor enterprise security events, evaluate vulnerability scanners, conduct packet analysis, and write automated Python threat detection playbooks in a live SOC environment.',
    responsibilities: [
      'Analyze SIEM telemetry and identify anomalies using Splunk and Wireshark.',
      'Perform authenticated vulnerability scans on simulated test networks.',
      'Draft incident response documentation and remediation advisories.',
      'Automate repetitive triage steps using Python scripts and REST APIs.'
    ],
    perks: ['Hands-on SIEM platform access', 'Cybersecurity certification sponsorship', 'Flexible remote hours', 'Institutional internship recognition'],
    selectionProcess: 'Profile Evaluation → Cyber Knowledge Assessment → Technical Q&A with SOC Lead'
  },
  {
    id: 'int_08',
    company: 'ISRO Telemetry & Space Center',
    companyLogoBg: '#f97316',
    companyLogoText: 'IS',
    verifiedCompany: true,
    role: 'Data Science & Scientific Computing Intern',
    department: 'Satellite Data Processing Division',
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
    eligibility: 'Pre-final or Final year B.Tech/M.Sc students with strong math, statistics, and programming foundation. CGPA ≥ 7.5.',
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

export default function StudentInternships({ student = {}, onBack, onNavigateHome }) {
  // Navigation & View mode
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'remote' | 'on-site' | 'hybrid' | 'status'
  const [sortOption, setSortOption] = useState('latest') // 'latest' | 'stipend_high' | 'deadline_soon'

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedSkill, setSelectedSkill] = useState('all')
  const [selectedDuration, setSelectedDuration] = useState('all')
  const [selectedStipend, setSelectedStipend] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedPostedDate, setSelectedPostedDate] = useState('all')
  const [selectedDeadline, setSelectedDeadline] = useState('all')
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  // Modals
  const [detailsModalItem, setDetailsModalItem] = useState(null)
  const [applyModalItem, setApplyModalItem] = useState(null)
  const [applicationNote, setApplicationNote] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Student Profile Data
  const s = student || {}
  const studentName = s.name || 'Student Member'
  const studentBranch = s.branch || s.course || 'B.Tech - Computer Science'
  const studentCgpa = parseFloat(s.cgpa) || 8.4
  const studentRoll = s.rollNo || s.roll || '2023-CS-1048'
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
        internshipId: 'int_03',
        company: 'Razorpay Technologies',
        role: 'Full Stack Web Developer Intern',
        stipend: '₹45,000 / month',
        type: 'Remote',
        location: 'Remote - India',
        appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'applied', // 'applied' | 'shortlisted' | 'selected' | 'offer'
        statusLabel: 'Application Under Review',
        feedback: 'Your verified academic credentials and GitHub projects are currently being reviewed by the engineering talent team.'
      }
    ]
  })

  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_saved_internships')
      if (saved) return JSON.parse(saved)
    } catch {}
    return ['int_01']
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
      setToastMessage(exists ? 'Internship removed from saved items.' : 'Internship saved to your bookmarks!')
      return next
    })
  }

  // Check if an internship is applied
  const isApplied = (id) => applications.some((app) => app.internshipId === id)

  // Metrics Count
  const metrics = useMemo(() => {
    const appliedCount = applications.filter((a) => a.status === 'applied').length
    const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length
    const selectedCount = applications.filter((a) => a.status === 'selected').length
    const offerCount = applications.filter((a) => a.status === 'offer').length
    return {
      applied: appliedCount,
      shortlisted: shortlistedCount,
      selected: selectedCount,
      offers: offerCount,
      total: applications.length,
    }
  }, [applications])

  // Filter & Search Logic
  const filteredInternships = useMemo(() => {
    return INITIAL_INTERNSHIPS.filter((item) => {
      // 1. Tab / Category Filter
      if (activeTab === 'remote' && item.type.toLowerCase() !== 'remote') return false
      if (activeTab === 'on-site' && item.type.toLowerCase() !== 'on-site') return false
      if (activeTab === 'hybrid' && item.type.toLowerCase() !== 'hybrid') return false

      // 2. Keyword Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchComp = item.company.toLowerCase().includes(q)
        const matchRole = item.role.toLowerCase().includes(q)
        const matchLoc = item.location.toLowerCase().includes(q)
        const matchSkills = item.requiredSkills.some((s) => s.toLowerCase().includes(q))
        if (!matchComp && !matchRole && !matchLoc && !matchSkills) return false
      }

      // 3. Role Filter
      if (selectedRole !== 'all') {
        if (!item.role.toLowerCase().includes(selectedRole.toLowerCase())) return false
      }

      // 4. Skills Filter
      if (selectedSkill !== 'all') {
        if (!item.requiredSkills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase())) return false
      }

      // 5. Duration Filter
      if (selectedDuration !== 'all') {
        if (selectedDuration === '2' && item.durationMonths !== 2) return false
        if (selectedDuration === '3' && item.durationMonths !== 3) return false
        if (selectedDuration === '6' && item.durationMonths !== 6) return false
      }

      // 6. Stipend Filter
      if (selectedStipend !== 'all') {
        const minStipend = parseInt(selectedStipend, 10) || 0
        if (item.stipendAmount < minStipend) return false
      }

      // 7. Work Type Filter
      if (selectedType !== 'all') {
        if (item.type.toLowerCase() !== selectedType.toLowerCase()) return false
      }

      // 8. Location Filter
      if (selectedLocation !== 'all') {
        if (!item.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false
      }

      // 9. Posted Date Filter
      if (selectedPostedDate !== 'all') {
        const maxDays = parseInt(selectedPostedDate, 10)
        if (item.postedDaysAgo > maxDays) return false
      }

      // 10. Application Deadline Filter
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
      // 'latest' default
      return a.postedDaysAgo - b.postedDaysAgo
    })
  }, [
    activeTab,
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
  ])

  // Clear / Reset All Filters
  const handleResetFilters = () => {
    setSearchQuery('')
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
        stipend: applyModalItem.stipend,
        type: applyModalItem.type,
        location: applyModalItem.location,
        appliedAt: new Date().toISOString(),
        status: 'applied',
        statusLabel: 'Application Submitted',
        note: applicationNote.trim(),
        verifiedCgpa: studentCgpa,
        feedback: 'Your verified profile and approved academic records have been transmitted directly to the campus recruitment coordinator.'
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
      setToastMessage(`Application successfully submitted to ${applyModalItem.company}!`)
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
          <button type="button" onClick={() => setToastMessage('')} className="si-toast-close">✕</button>
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

          {onNavigateHome && (
            <button
              type="button"
              className="si-nav-back-btn"
              onClick={onNavigateHome}
              title="Return to Portal Home"
              style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.15)' }}
            >
              Exit
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="si-main-content">
        {/* COMPACT PAGE HEADER */}
        <div className="si-page-header">
          <div className="si-header-info">
            <h1 className="si-page-title">Internships</h1>
            <p className="si-page-subtitle">
              Discover verified institutional internships and industry opportunities accredited by the IAS collaboration network.
            </p>
          </div>

          <div className="si-header-actions">
            <button
              type="button"
              className={`si-header-btn ${activeTab === 'status' ? 'active' : ''}`}
              onClick={() => setActiveTab((prev) => (prev === 'status' ? 'all' : 'status'))}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>My Applications ({applications.length})</span>
            </button>
          </div>
        </div>

        {/* 1. MY INTERNSHIP STATUS SECTION */}
        <section className="si-status-strip" aria-label="Internship Application Status">
          <div className="si-status-card" onClick={() => setActiveTab('status')}>
            <div className="si-status-icon applied">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="si-status-info">
              <span className="si-status-label">Applied</span>
              <strong className="si-status-value">{metrics.applied}</strong>
            </div>
            <span className="si-status-tag">Under Review</span>
          </div>

          <div className="si-status-card" onClick={() => setActiveTab('status')}>
            <div className="si-status-icon shortlisted">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="si-status-info">
              <span className="si-status-label">Shortlisted</span>
              <strong className="si-status-value">{metrics.shortlisted}</strong>
            </div>
            <span className="si-status-tag">Rounds Active</span>
          </div>

          <div className="si-status-card" onClick={() => setActiveTab('status')}>
            <div className="si-status-icon selected">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="si-status-info">
              <span className="si-status-label">Selected</span>
              <strong className="si-status-value">{metrics.selected}</strong>
            </div>
            <span className="si-status-tag">Finalized</span>
          </div>

          <div className="si-status-card" onClick={() => setActiveTab('status')}>
            <div className="si-status-icon offer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="si-status-info">
              <span className="si-status-label">Offer Letters</span>
              <strong className="si-status-value">{metrics.offers}</strong>
            </div>
            <span className="si-status-tag">Institutional NOC Ready</span>
          </div>
        </section>

        {/* CONDITIONAL VIEW: MY APPLICATIONS TAB */}
        {activeTab === 'status' ? (
          <section className="si-applications-view">
            <div className="si-applications-header">
              <div>
                <h2 className="si-section-title">My Submitted Applications</h2>
                <p className="si-section-sub">
                  Track the real-time review progress of your verified institutional applications.
                </p>
              </div>
              <button
                type="button"
                className="si-btn-secondary"
                onClick={() => setActiveTab('all')}
              >
                ← Back to All Internships
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="si-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <h3>No Applications Yet</h3>
                <p>Browse the verified internships directory below and apply directly using your verified portal credentials.</p>
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
                        <span className="si-app-company">{app.company}</span>
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
                      <strong>Recruiter Note:</strong> {app.feedback || 'Your verified institutional profile has been forwarded to the department lead.'}
                    </p>

                    <div className="si-app-bottom">
                      <span className="si-app-date">
                        Applied: {new Date(app.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <button
                        type="button"
                        className="si-btn-outline"
                        onClick={() => {
                          const item = INITIAL_INTERNSHIPS.find((i) => i.id === app.internshipId)
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
          /* MAIN DIRECTORY VIEW */
          <>
            {/* 2. SEARCH & ADVANCED FILTERS TOOLBAR */}
            <section className="si-filter-card">
              {/* Top Search & Filter Toggle Bar */}
              <div className="si-search-row">
                <div className="si-search-input-wrap">
                  <svg className="si-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    className="si-search-input"
                    placeholder="Search by company, role title, required skills or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="si-search-clear-btn"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="si-search-actions">
                  <button
                    type="button"
                    className={`si-filter-toggle-btn ${isFilterDrawerOpen ? 'active' : ''}`}
                    onClick={() => setIsFilterDrawerOpen((prev) => !prev)}
                    title="Toggle multi-filter options"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
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
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Collapsible/Expandable 8-Attribute Multi-Filter Controls */}
              <div className={`si-filters-grid ${isFilterDrawerOpen ? 'is-open' : ''}`}>
                {/* Filter 1: Role */}
                <div className="si-filter-col">
                  <label className="si-filter-label" htmlFor="si-f-role">Role</label>
                  <select
                    id="si-f-role"
                    className="si-filter-select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="Software">Software Engineering</option>
                    <option value="Machine Learning">AI & Machine Learning</option>
                    <option value="Full Stack">Full Stack Web</option>
                    <option value="DevOps">Cloud & DevOps</option>
                    <option value="Design">UI/UX & Product Design</option>
                    <option value="Embedded">Embedded & IoT</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>

                {/* Filter 2: Skills */}
                <div className="si-filter-col">
                  <label className="si-filter-label" htmlFor="si-f-skills">Required Skill</label>
                  <select
                    id="si-f-skills"
                    className="si-filter-select"
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                  >
                    <option value="all">All Skills</option>
                    <option value="React">React</option>
                    <option value="Python">Python</option>
                    <option value="Node.js">Node.js</option>
                    <option value="AWS">AWS</option>
                    <option value="Docker">Docker</option>
                    <option value="Figma">Figma</option>
                    <option value="PyTorch">PyTorch</option>
                    <option value="Embedded C">Embedded C</option>
                    <option value="Linux">Linux</option>
                    <option value="SQL">SQL</option>
                  </select>
                </div>

                {/* Filter 3: Duration */}
                <div className="si-filter-col">
                  <label className="si-filter-label" htmlFor="si-f-duration">Duration</label>
                  <select
                    id="si-f-duration"
                    className="si-filter-select"
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                  >
                    <option value="all">Any Duration</option>
                    <option value="2">2 Months (Summer Sprint)</option>
                    <option value="3">3 Months (Standard)</option>
                    <option value="6">6 Months (Semester Long)</option>
                  </select>
                </div>

                {/* Filter 4: Stipend */}
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
                    <option value="50000">₹50,000+ / mo</option>
                    <option value="80000">₹80,000+ / mo</option>
                  </select>
                </div>

                {/* Filter 5: Type */}
                <div className="si-filter-col">
                  <label className="si-filter-label" htmlFor="si-f-type">Work Type</label>
                  <select
                    id="si-f-type"
                    className="si-filter-select"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site / In-office</option>
                  </select>
                </div>

                {/* Filter 6: Location */}
                <div className="si-filter-col">
                  <label className="si-filter-label" htmlFor="si-f-loc">Location</label>
                  <select
                    id="si-f-loc"
                    className="si-filter-select"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="all">All Locations</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Gurugram">Gurugram</option>
                    <option value="Remote">Remote India</option>
                  </select>
                </div>

                {/* Filter 7: Posted Date */}
                <div className="si-filter-col">
                  <label className="si-filter-label" htmlFor="si-f-posted">Posted Date</label>
                  <select
                    id="si-f-posted"
                    className="si-filter-select"
                    value={selectedPostedDate}
                    onChange={(e) => setSelectedPostedDate(e.target.value)}
                  >
                    <option value="all">Anytime</option>
                    <option value="1">Last 24 Hours</option>
                    <option value="3">Last 3 Days</option>
                    <option value="7">Last 7 Days</option>
                  </select>
                </div>

                {/* Filter 8: Application Deadline */}
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

            {/* 3. CATEGORIES/TABS & SORTING BAR */}
            <div className="si-sub-bar">
              {/* Category Tabs */}
              <div className="si-tabs-row" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'all'}
                  className={`si-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Internships
                  <span className="si-tab-count">
                    {INITIAL_INTERNSHIPS.length}
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
                    {INITIAL_INTERNSHIPS.filter((i) => i.type === 'Remote').length}
                  </span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'on-site'}
                  className={`si-tab-btn ${activeTab === 'on-site' ? 'active' : ''}`}
                  onClick={() => setActiveTab('on-site')}
                >
                  On-site
                  <span className="si-tab-count">
                    {INITIAL_INTERNSHIPS.filter((i) => i.type === 'On-site').length}
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
                    {INITIAL_INTERNSHIPS.filter((i) => i.type === 'Hybrid').length}
                  </span>
                </button>
              </div>

              {/* Sort Dropdown */}
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

            {/* 4. INTERNSHIP LISTING CARDS (Full Desktop Width Grid) */}
            <div className="si-cards-grid">
              {filteredInternships.length === 0 ? (
                <div className="si-empty-state">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <h3>No matching internships found</h3>
                  <p>Try adjusting your search query, clearing filters, or switching category tabs.</p>
                  <button type="button" className="si-btn-secondary" onClick={handleResetFilters}>
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredInternships.map((item) => {
                  const alreadyApplied = isApplied(item.id)
                  const isSaved = savedIds.includes(item.id)

                  return (
                    <article key={item.id} className="si-job-card">
                      {/* Card Header: Company, Verified Badge, Bookmark */}
                      <div className="si-job-header">
                        <div className="si-comp-info">
                          <div
                            className="si-comp-avatar"
                            style={{ backgroundColor: item.companyLogoBg }}
                            aria-hidden="true"
                          >
                            {item.companyLogoText}
                          </div>
                          <div>
                            <div className="si-comp-name-row">
                              <span className="si-comp-name">{item.company}</span>
                              {item.verifiedCompany && (
                                <span className="si-verified-pill" title="Verified Institutional Recruiter Partner">
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                  </svg>
                                  Verified
                                </span>
                              )}
                            </div>
                            <span className="si-comp-dept">{item.department}</span>
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                        </button>
                      </div>

                      {/* Job Title */}
                      <h3 className="si-job-title">{item.role}</h3>

                      {/* Core Highlights Pills: Duration, Stipend, Work Type, Location */}
                      <div className="si-job-badges-wrap">
                        <span className="si-pill duration" title="Duration">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {item.duration}
                        </span>

                        <span className="si-pill stipend" title="Monthly Stipend">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                          </svg>
                          {item.stipend}
                        </span>

                        <span className={`si-pill type ${item.type.toLowerCase()}`} title="Work Mode">
                          {item.type}
                        </span>

                        <span className="si-pill location" title="Location">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {item.location}
                        </span>
                      </div>

                      {/* Required Skills Chips */}
                      <div className="si-skills-row">
                        {item.requiredSkills.map((sk) => (
                          <span key={sk} className="si-skill-tag">
                            {sk}
                          </span>
                        ))}
                      </div>

                      {/* Short Description */}
                      <p className="si-job-desc">{item.overview}</p>

                      {/* Footer: Deadline & Action Buttons */}
                      <div className="si-job-footer">
                        <div className="si-deadline-info">
                          <span className="si-deadline-label">Deadline:</span>
                          <span className={`si-deadline-date ${item.isUrgent ? 'urgent' : ''}`}>
                            {item.displayDeadline} {item.isUrgent && '⚠️ Closing soon'}
                          </span>
                        </div>

                        <div className="si-job-actions">
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
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
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
                      </div>
                    </article>
                  )
                })
              )}
            </div>

            {/* 8. HELPFUL APPLICATION TIPS SECTION */}
            <section className="si-tips-card">
              <div className="si-tips-header">
                <div className="si-tips-title-wrap">
                  <div className="si-tips-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b3881e" strokeWidth="2.4">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="si-tips-title">Institutional Application Tips</h3>
                    <p className="si-tips-sub">Maximizing your candidate score across partner recruitment drives</p>
                  </div>
                </div>
              </div>

              <div className="si-tips-grid">
                <div className="si-tip-item">
                  <span className="si-tip-num">1</span>
                  <div>
                    <strong>Verified Profile Priority</strong>
                    <p>Recruiters automatically filter candidates by Portal-Admin verified skills and approved capstone projects.</p>
                  </div>
                </div>

                <div className="si-tip-item">
                  <span className="si-tip-num">2</span>
                  <div>
                    <strong>No Resume Upload Required</strong>
                    <p>Your institutional transcript, verified CGPA, and audited credentials serve as your official digital portfolio.</p>
                  </div>
                </div>

                <div className="si-tip-item">
                  <span className="si-tip-num">3</span>
                  <div>
                    <strong>Academic Credits &amp; NOC</strong>
                    <p>Selected internships are eligible for institutional credits upon coordinator sign-off and completion review.</p>
                  </div>
                </div>
              </div>
            </section>
          </>
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
                  </div>
                  <span className="si-modal-sub">
                    {detailsModalItem.company} • {detailsModalItem.department}
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
                  <span className="si-dc-label">Deadline</span>
                  <strong className="si-dc-val">{detailsModalItem.displayDeadline}</strong>
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

              {/* Section: Eligibility Criteria */}
              <div className="si-detail-section">
                <h4 className="si-ds-title">Academic Eligibility</h4>
                <p className="si-ds-text">{detailsModalItem.eligibility}</p>
              </div>

              {/* Section: Perks & Mentorship */}
              <div className="si-detail-section">
                <h4 className="si-ds-title">Mentorship &amp; Benefits</h4>
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
                  Role: <strong>{applyModalItem.role}</strong> • {applyModalItem.stipend}
                </span>
              </div>

              <button
                type="button"
                className="si-modal-close-btn"
                onClick={() => !isApplying && setApplyModalItem(null)}
                disabled={isApplying}
                aria-label="Close"
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
                        : 'React, Python, Node.js, Cloud Fundamentals'}
                    </span>
                  </div>
                  <div className="si-pp-row">
                    <span className="si-pp-label">Audited Projects:</span>
                    <span className="si-pp-val">
                      {verifiedProjects.length > 0
                        ? `${verifiedProjects.length} Verified Capstone Projects`
                        : 'Institutional Capstone Projects Included'}
                    </span>
                  </div>
                  <div className="si-pp-row">
                    <span className="si-pp-label">Prior Experience:</span>
                    <span className="si-pp-val">
                      {verifiedInternships.length > 0
                        ? `${verifiedInternships.length} Verified Prior Experiences`
                        : 'Institutional Training Credentials'}
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
                  placeholder="Mention any specific interest in this team, availability dates, or relevant project milestones..."
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
    </div>
  )
}
