import { useState, useEffect } from 'react'

const SKILL_CATEGORIES = [
  'Engineering & Technology',
  'Computer Science & Information Technology',
  'Management & Business Administration',
  'Commerce, Banking & Finance',
  'Medical, Dental & Healthcare Sciences',
  'Pharmacy, Nursing & Allied Health',
  'Biological & Life Sciences',
  'Physical & Chemical Sciences',
  'Mathematical & Statistical Sciences',
  'Arts, Humanities & Social Sciences',
  'Law, Legal Studies & Public Policy',
  'Education, Teaching & Pedagogy',
  'Design, Architecture & Fine Arts',
  'Media, Journalism & Mass Communication',
  'Agriculture, Veterinary & Environmental Sciences',
  'Polytechnic & Applied Vocational Trades',
  'Hospitality, Tourism & Event Management',
  'Other / Interdisciplinary Fields',
]

const DURATION_OPTIONS = [
  '3 Months',
  '6 Months',
  '1 Year',
  '2 Years',
  '3 Years',
  '4 Years',
  'Other',
]

export default function StudentAchievementsExperience({
  student = {},
  initialTab = 'skills',
  onBack,
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'skills')
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab)

  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab)
    setActiveTab(initialTab || 'skills')
  }

  // Skills State (synced with localStorage)
  const [skills, setSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_skills')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Projects State (from localStorage for counts/tabs)
  const [projects] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_projects')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Internships State (from localStorage for counts/tabs)
  const [internships] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_internships')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Filter state for Skills: 'all' | 'verified' | 'pending' | 'unverified'
  const [skillFilter, setSkillFilter] = useState('all')

  // Search filter
  const [searchQuery, setSearchQuery] = useState('')

  // Add Skill Form state (All fields start unselected/empty)
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [skillName, setSkillName] = useState('')
  const [skillCategory, setSkillCategory] = useState('')
  const [skillLevel, setSkillLevel] = useState('')
  const [courseDuration, setCourseDuration] = useState('')
  const [customDuration, setCustomDuration] = useState('')
  const [credentialName, setCredentialName] = useState('')
  const [issuingOrg, setIssuingOrg] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [credentialUrl, setCredentialUrl] = useState('')
  const [certificateFile, setCertificateFile] = useState(null)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [formError, setFormError] = useState('')
  const [successBanner, setSuccessBanner] = useState('')

  // Save skills to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('udaan_student_skills', JSON.stringify(skills))
    } catch {}
  }, [skills])

  // Only Admin-verified skills count towards official profile totals
  const verifiedSkillsCount = skills.filter((s) => s.verified || s.status === 'verified').length
  const pendingSkillsCount = skills.filter((s) => !s.verified && (s.status === 'pending' || !s.status)).length
  const unverifiedSkillsCount = skills.filter((s) => s.status === 'rejected' || s.status === 'unverified').length

  const verifiedProjectsCount = projects.filter((p) => p.verified || p.status === 'verified').length
  const verifiedInternshipsCount = internships.filter((i) => i.verified || i.status === 'verified').length

  // Filtered skills
  const filteredSkills = skills.filter((item) => {
    const isVerified = item.verified || item.status === 'verified'
    const isPending = !item.verified && (item.status === 'pending' || !item.status)
    const isUnverified = item.status === 'rejected' || item.status === 'unverified'

    if (skillFilter === 'verified' && !isVerified) return false
    if (skillFilter === 'pending' && !isPending) return false
    if (skillFilter === 'unverified' && !isUnverified) return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchName = item.name?.toLowerCase().includes(q)
      const matchCat = item.category?.toLowerCase().includes(q)
      const matchLevel = item.level?.toLowerCase().includes(q)
      const matchOrg = item.issuingOrg?.toLowerCase().includes(q)
      const matchCred = item.credentialName?.toLowerCase().includes(q)
      if (!matchName && !matchCat && !matchLevel && !matchOrg && !matchCred) return false
    }

    return true
  })

  // Handle Submit Skill for Portal Admin Verification
  const handleCreateSkill = (e) => {
    e.preventDefault()
    if (!skillName.trim()) {
      setFormError('Please enter the Skill Name.')
      return
    }

    if (!skillCategory) {
      setFormError('Please select a Category / Domain.')
      return
    }

    if (!skillLevel) {
      setFormError('Please select a Proficiency Level.')
      return
    }

    if (!courseDuration) {
      setFormError('Please select the Course / Training Duration.')
      return
    }

    if (courseDuration === 'Other' && !customDuration.trim()) {
      setFormError('Please enter your custom course / training duration.')
      return
    }

    if (!credentialName.trim()) {
      setFormError('Please enter the Certificate Name.')
      return
    }

    if (!issuingOrg.trim()) {
      setFormError('Please enter the Certificate Issuing Organization.')
      return
    }

    if (!issueDate) {
      setFormError('Please select the Certificate Issue Date.')
      return
    }

    if (!credentialUrl.trim()) {
      setFormError('Please enter the Certificate Link.')
      return
    }

    if (
      !credentialUrl.trim().startsWith('http://') &&
      !credentialUrl.trim().startsWith('https://')
    ) {
      setFormError('Certificate Link must begin with http:// or https://')
      return
    }

    if (!certificateFile) {
      setFormError('Please upload your Certificate file (PDF, JPG, or PNG).')
      return
    }

    const finalDuration = courseDuration === 'Other' ? customDuration.trim() : courseDuration

    const newSkill = {
      id: `s_${Date.now()}`,
      name: skillName.trim(),
      category: skillCategory,
      level: skillLevel,
      duration: finalDuration,
      credentialName: credentialName.trim(),
      issuingOrg: issuingOrg.trim(),
      issueDate: issueDate,
      credentialUrl: credentialUrl.trim(),
      certificateFile: certificateFile.name,
      verified: false,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      notes: 'Submitted for online authenticity verification by IAS Collaboration Portal Admin.',
    }

    setSkills((prev) => [newSkill, ...prev])

    // Push notification to student notifications
    try {
      const savedNotifs = JSON.parse(localStorage.getItem('udaan_student_notifications') || '[]')
      const newNotif = {
        id: `n_${Date.now()}`,
        type: 'info',
        title: `Skill Submitted: ${newSkill.name}`,
        message: 'Your skill credential has been submitted to Portal Admin for verification.',
        timestamp: 'Just now',
        read: false,
      }
      localStorage.setItem('udaan_student_notifications', JSON.stringify([newNotif, ...savedNotifs]))
    } catch {}

    // Reset Form to initial unselected state
    setSkillName('')
    setSkillCategory('')
    setSkillLevel('')
    setCourseDuration('')
    setCustomDuration('')
    setCredentialName('')
    setIssuingOrg('')
    setIssueDate('')
    setCredentialUrl('')
    setCertificateFile(null)
    setFileInputKey((k) => k + 1)
    setFormError('')
    setIsAddFormOpen(false)

    setSuccessBanner(`Skill "${newSkill.name}" successfully submitted for Portal Admin verification.`)
    setTimeout(() => setSuccessBanner(''), 5000)
  }

  // Proficiency level helper
  const getProficiencySteps = (lvl) => {
    const l = (lvl || '').toLowerCase()
    if (l.includes('expert')) return { count: 4, text: 'Expert (Specialist / Research / Leadership Level)' }
    if (l.includes('advanced')) return { count: 3, text: 'Advanced (Independent & Production Grade)' }
    if (l.includes('intermediate')) return { count: 2, text: 'Intermediate (Applied Practical & Projects)' }
    return { count: 1, text: 'Beginner (Foundational Knowledge)' }
  }

  const s = student || {}

  return (
    <div className="sae-page-wrap">
      <style>{`
        .sae-page-wrap {
          min-height: 100vh;
          background-color: #f7f5ef;
          color: #112233;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          box-sizing: border-box;
        }

        /* Top Header */
        .sae-header {
          background-color: #0f1f2e;
          color: #ffffff;
          border-bottom: 3px solid #b38e44;
          padding: 14px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 16px rgba(15, 31, 46, 0.18);
        }

        .sae-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .sae-back-btn {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 7px 14px;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .sae-back-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: #f1cf7c;
          color: #f1cf7c;
        }

        .sae-brand-title {
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sae-breadcrumb-slash {
          color: #94a3b8;
          font-weight: 400;
        }

        .sae-breadcrumb-active {
          color: #f1cf7c;
          font-weight: 600;
        }

        .sae-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sae-user-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          padding: 4px 12px 4px 5px;
        }

        .sae-user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #b38e44;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          overflow: hidden;
        }

        .sae-user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sae-user-meta {
          line-height: 1.15;
          text-align: left;
        }

        .sae-user-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: #ffffff;
        }

        .sae-user-role {
          font-size: 0.68rem;
          color: #94a3b8;
        }

        /* Main Container */
        .sae-main-container {
          max-width: 1240px;
          width: 100%;
          margin: 0 auto;
          padding: 24px 20px 60px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Accreditation Policy Notice Banner */
        .sae-policy-banner {
          background: #ffffff;
          border: 1px solid #d9d4c7;
          border-left: 5px solid #b38e44;
          border-radius: 8px;
          padding: 14px 18px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          box-shadow: 0 2px 8px rgba(15, 31, 46, 0.04);
        }

        .sae-policy-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #fef3c7;
          color: #b45309;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .sae-policy-text {
          flex: 1;
        }

        .sae-policy-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: #0f1f2e;
          margin-bottom: 3px;
        }

        .sae-policy-desc {
          font-size: 0.82rem;
          color: #475569;
          line-height: 1.45;
          margin: 0;
        }

        .sae-policy-desc strong {
          color: #166534;
        }

        /* Metrics Summary Bar */
        .sae-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 900px) {
          .sae-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 540px) {
          .sae-metrics-grid {
            grid-template-columns: 1fr;
          }
        }

        .sae-metric-card {
          background: #ffffff;
          border: 1px solid #ded9cc;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 6px rgba(15, 31, 46, 0.03);
          display: flex;
          align-items: center;
          gap: 14px;
          transition: transform 0.15s ease;
        }

        .sae-metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(15, 31, 46, 0.06);
        }

        .sae-metric-card.is-verified {
          border-left: 4px solid #16a34a;
        }

        .sae-metric-card.is-pending {
          border-left: 4px solid #d97706;
        }

        .sae-metric-card.is-unverified {
          border-left: 4px solid #64748b;
        }

        .sae-metric-card.is-projects {
          border-left: 4px solid #0284c7;
        }

        .sae-metric-icon {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sae-metric-val {
          font-size: 1.65rem;
          font-weight: 800;
          line-height: 1;
          color: #0f1f2e;
        }

        .sae-metric-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #475569;
          margin-top: 4px;
        }

        .sae-metric-sub {
          font-size: 0.7rem;
          color: #64748b;
          margin-top: 2px;
        }

        /* Tabs Navigation */
        .sae-tabs-nav {
          display: flex;
          background: #ffffff;
          border: 1px solid #ded9cc;
          border-radius: 8px;
          padding: 6px;
          gap: 6px;
          box-shadow: 0 2px 6px rgba(15, 31, 46, 0.04);
        }

        .sae-tab-btn {
          flex: 1;
          background: transparent;
          border: none;
          padding: 12px 18px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.15s ease;
        }

        .sae-tab-btn:hover {
          background: #f8fafc;
          color: #0f1f2e;
        }

        .sae-tab-btn.active {
          background: #0f1f2e;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(15, 31, 46, 0.2);
        }

        .sae-tab-badge {
          font-size: 0.72rem;
          padding: 2px 7px;
          border-radius: 9999px;
          font-weight: 700;
        }

        .sae-tab-btn.active .sae-tab-badge {
          background: #b38e44;
          color: #ffffff;
        }

        .sae-tab-btn:not(.active) .sae-tab-badge {
          background: #e2e8f0;
          color: #475569;
        }

        /* Success Alert */
        .sae-alert-success {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
          border-radius: 8px;
          padding: 12px 18px;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: saeFadeIn 0.2s ease-out;
        }

        /* Toolbar: Filter & Add Action */
        .sae-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }

        .sae-filter-chips {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .sae-chip {
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #475569;
          border-radius: 9999px;
          padding: 6px 14px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sae-chip:hover {
          border-color: #94a3b8;
          color: #0f1f2e;
        }

        .sae-chip.active {
          background: #1e3a5f;
          border-color: #1e3a5f;
          color: #ffffff;
        }

        .sae-chip-count {
          background: rgba(0, 0, 0, 0.08);
          padding: 1px 6px;
          border-radius: 9999px;
          font-size: 0.72rem;
        }

        .sae-chip.active .sae-chip-count {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .sae-toolbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sae-search-input {
          padding: 8px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.84rem;
          background: #ffffff;
          outline: none;
          min-width: 240px;
        }

        .sae-search-input:focus {
          border-color: #1e3a5f;
          box-shadow: 0 0 0 2px rgba(30, 58, 95, 0.12);
        }

        .sae-btn-add {
          background: #16a34a;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 9px 16px;
          font-size: 0.86rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s ease;
        }

        .sae-btn-add:hover {
          background: #15803d;
        }

        /* Add Skill Form Card */
        .sae-form-card {
          background: #ffffff;
          border: 1px solid #d9d4c7;
          border-top: 3px solid #16a34a;
          border-radius: 8px;
          padding: 20px 22px;
          box-shadow: 0 4px 16px rgba(15, 31, 46, 0.06);
          animation: saeSlideDown 0.2s ease-out;
        }

        .sae-form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }

        .sae-form-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f1f2e;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sae-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .sae-form-field-full {
          grid-column: span 2;
        }

        .sae-form-section-divider {
          grid-column: span 2;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 0 2px;
          margin-top: 6px;
          border-top: 1px solid #e2e8f0;
          color: #0f1f2e;
          font-weight: 700;
          font-size: 0.88rem;
        }

        @media (max-width: 720px) {
          .sae-form-grid {
            grid-template-columns: 1fr;
          }
          .sae-form-field-full,
          .sae-form-section-divider {
            grid-column: span 1;
          }
        }

        .sae-form-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .sae-form-field label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #334155;
        }

        .sae-form-field input[type="text"],
        .sae-form-field input[type="date"],
        .sae-form-field input[type="url"],
        .sae-form-field input[type="file"],
        .sae-form-field select {
          padding: 8px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.86rem;
          background: #fafbfc;
          outline: none;
          color: #0f172a;
          box-sizing: border-box;
          width: 100%;
        }

        .sae-form-field input[type="file"] {
          padding: 6px 10px;
          background: #ffffff;
          cursor: pointer;
        }

        .sae-form-alert {
          background: #fee2e2;
          border: 1px solid #fca5a5;
          color: #991b1b;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 0.84rem;
          font-weight: 600;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sae-form-field input:focus,
        .sae-form-field select:focus {
          border-color: #1e3a5f;
          background: #ffffff;
          box-shadow: 0 0 0 2px rgba(30, 58, 95, 0.08);
        }

        .sae-form-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 16px;
          border-top: 1px solid #f1f5f9;
          padding-top: 14px;
        }

        .sae-btn-cancel {
          background: transparent;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
        }

        .sae-btn-cancel:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .sae-btn-submit {
          background: #16a34a;
          border: 1px solid #15803d;
          border-radius: 6px;
          padding: 9px 20px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(22, 163, 74, 0.25);
          transition: background 0.15s ease;
        }

        .sae-btn-submit:hover {
          background: #15803d;
        }

        /* Skills Cards Grid */
        .sae-skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 16px;
        }

        @media (max-width: 480px) {
          .sae-skills-grid {
            grid-template-columns: 1fr;
          }
        }

        .sae-skill-card {
          background: #ffffff;
          border: 1px solid #ded9cc;
          border-radius: 8px;
          padding: 18px;
          box-shadow: 0 2px 6px rgba(15, 31, 46, 0.04);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all 0.15s ease;
          position: relative;
        }

        .sae-skill-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(15, 31, 46, 0.08);
        }

        .sae-skill-card.is-verified {
          border-left: 4px solid #16a34a;
        }

        .sae-skill-card.is-pending {
          border-left: 4px solid #d97706;
        }

        .sae-skill-card.is-unverified {
          border-left: 4px solid #ef4444;
        }

        .sae-skill-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .sae-skill-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f1f2e;
          margin: 0 0 4px 0;
        }

        .sae-skill-category-badge {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          background: #f1f5f9;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        /* Status Badges */
        .sae-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .sae-status-badge.verified {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        }

        .sae-status-badge.pending {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fcd34d;
        }

        .sae-status-badge.unverified {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        /* Proficiency Meter */
        .sae-prof-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sae-prof-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.76rem;
          color: #475569;
        }

        .sae-prof-bars {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          height: 6px;
        }

        .sae-prof-bar-segment {
          background: #e2e8f0;
          border-radius: 2px;
          transition: background 0.2s ease;
        }

        .sae-prof-bar-segment.filled {
          background: #1e3a5f;
        }

        .sae-skill-card.is-verified .sae-prof-bar-segment.filled {
          background: #16a34a;
        }

        /* Credential Box inside Card */
        .sae-cred-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sae-cred-header {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #0f1f2e;
        }

        .sae-cred-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sae-cred-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          color: #64748b;
          flex-wrap: wrap;
        }

        .sae-cred-verify-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #0369a1;
          font-size: 0.76rem;
          font-weight: 700;
          text-decoration: none;
          margin-top: 2px;
          width: fit-content;
          background: #e0f2fe;
          border: 1px solid #bae6fd;
          padding: 3px 8px;
          border-radius: 4px;
          transition: all 0.15s ease;
        }

        .sae-cred-verify-link:hover {
          background: #0284c7;
          border-color: #0284c7;
          color: #ffffff;
        }

        .sae-cred-empty {
          background: #fafaf8;
          border: 1px dashed #cbd5e1;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 0.76rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Admin Note & Status Banner inside Card */
        .sae-card-status-note {
          font-size: 0.74rem;
          border-radius: 4px;
          padding: 6px 10px;
          line-height: 1.35;
        }

        .sae-card-status-note.verified {
          background: #f0fdf4;
          color: #166534;
          border-left: 3px solid #16a34a;
        }

        .sae-card-status-note.pending {
          background: #fffbeb;
          color: #92400e;
          border-left: 3px solid #d97706;
        }

        .sae-card-status-note.unverified {
          background: #fef2f2;
          color: #991b1b;
          border-left: 3px solid #ef4444;
        }

        /* Empty State */
        .sae-empty-state {
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 8px;
          padding: 48px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .sae-empty-icon {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Placeholder Content for Future Tabs */
        .sae-placeholder-card {
          background: #ffffff;
          border: 1px solid #ded9cc;
          border-radius: 8px;
          padding: 36px 28px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(15, 31, 46, 0.04);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .sae-placeholder-badge {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #475569;
          border-radius: 9999px;
          padding: 4px 12px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .sae-placeholder-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #0f1f2e;
          margin: 0;
        }

        .sae-placeholder-desc {
          font-size: 0.9rem;
          color: #64748b;
          max-width: 600px;
          line-height: 1.5;
          margin: 0;
        }

        @keyframes saeFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes saeSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* TOP NAVBAR */}
      <header className="sae-header">
        <div className="sae-header-left">
          <button
            type="button"
            className="sae-back-btn"
            onClick={onBack}
            title="Return to Student Dashboard"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            ← Back to Dashboard
          </button>

          <div className="sae-brand-title">
            <span>IAS Collaboration Portal</span>
            <span className="sae-breadcrumb-slash">/</span>
            <span style={{ color: '#ffffff', fontWeight: 500 }}>Student Portal</span>
            <span className="sae-breadcrumb-slash">/</span>
            <span className="sae-breadcrumb-active">Achievements & Experience</span>
          </div>
        </div>

        <div className="sae-header-right">
          <div className="sae-user-chip">
            <div className="sae-user-avatar">
              {s.profilePic ? (
                <img src={s.profilePic} alt={s.name || 'Student'} />
              ) : (
                <span>{(s.name || 'S').charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="sae-user-meta">
              <div className="sae-user-name">{s.name || 'Student Member'}</div>
              <div className="sae-user-role">{s.branch || s.course || 'Student Profile'}</div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN BODY */}
      <main className="sae-main-container">
        {/* OFFICIAL ACCREDITATION POLICY DISCLOSURE */}
        <section className="sae-policy-banner">
          <div className="sae-policy-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="sae-policy-text">
            <div className="sae-policy-title">Official Portal Verification & Accreditation Rule</div>
            <p className="sae-policy-desc">
              All submissions undergo formal audit by the <strong>IAS Collaboration Portal Admin</strong> and Institutional Oversight Committee.
              <strong> Only admin-verified items count in your official profile</strong>, institutional credentials, and industry placement transcripts.
            </p>
          </div>
        </section>

        {/* METRICS SUMMARY BAR */}
        <section className="sae-metrics-grid">
          {/* Card 1: Official Verified Skills */}
          <div className="sae-metric-card is-verified">
            <div className="sae-metric-icon" style={{ background: '#dcfce7', color: '#166534' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <div className="sae-metric-val">{verifiedSkillsCount}</div>
              <div className="sae-metric-label">Verified Skills</div>
              <div className="sae-metric-sub" style={{ color: '#166534', fontWeight: 600 }}>Counted in Official Profile</div>
            </div>
          </div>

          {/* Card 2: Pending Admin Review */}
          <div className="sae-metric-card is-pending">
            <div className="sae-metric-icon" style={{ background: '#fef3c7', color: '#92400e' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <div className="sae-metric-val">{pendingSkillsCount}</div>
              <div className="sae-metric-label">Pending Verification</div>
              <div className="sae-metric-sub">Awaiting Admin Audit</div>
            </div>
          </div>

          {/* Card 3: Not Verified / Action Needed */}
          <div className="sae-metric-card is-unverified">
            <div className="sae-metric-icon" style={{ background: '#f1f5f9', color: '#475569' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <div className="sae-metric-val">{unverifiedSkillsCount}</div>
              <div className="sae-metric-label">Needs Revision</div>
              <div className="sae-metric-sub">Not Counted in Profile</div>
            </div>
          </div>

          {/* Card 4: Total Portfolio Submissions */}
          <div className="sae-metric-card is-projects">
            <div className="sae-metric-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div>
              <div className="sae-metric-val">{skills.length}</div>
              <div className="sae-metric-label">Total Skills Logged</div>
              <div className="sae-metric-sub">{verifiedProjectsCount} Projects • {verifiedInternshipsCount} Internships</div>
            </div>
          </div>
        </section>

        {/* TABS NAVIGATION (Skills, Projects, Internships & Experience) */}
        <nav className="sae-tabs-nav" aria-label="Student Achievements and Experience Tabs">
          <button
            type="button"
            className={`sae-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Skills
            <span className="sae-tab-badge">{skills.length}</span>
          </button>

          <button
            type="button"
            className={`sae-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            Projects
            <span className="sae-tab-badge">{projects.length}</span>
          </button>

          <button
            type="button"
            className={`sae-tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            Internships & Experience
            <span className="sae-tab-badge">{internships.length}</span>
          </button>
        </nav>

        {/* SUCCESS NOTIFICATION BANNER */}
        {successBanner && (
          <div className="sae-alert-success" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{successBanner}</span>
          </div>
        )}

        {/* TAB 1: SKILLS (FULLY IMPLEMENTED WITH DEPARTMENT-NEUTRAL FIELDS) */}
        {activeTab === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Toolbar: Filter & Add */}
            <div className="sae-toolbar">
              <div className="sae-filter-chips">
                <button
                  type="button"
                  className={`sae-chip ${skillFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setSkillFilter('all')}
                >
                  All Skills <span className="sae-chip-count">{skills.length}</span>
                </button>
                <button
                  type="button"
                  className={`sae-chip ${skillFilter === 'verified' ? 'active' : ''}`}
                  onClick={() => setSkillFilter('verified')}
                >
                  Verified <span className="sae-chip-count">{verifiedSkillsCount}</span>
                </button>
                <button
                  type="button"
                  className={`sae-chip ${skillFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setSkillFilter('pending')}
                >
                  Pending Verification <span className="sae-chip-count">{pendingSkillsCount}</span>
                </button>
                <button
                  type="button"
                  className={`sae-chip ${skillFilter === 'unverified' ? 'active' : ''}`}
                  onClick={() => setSkillFilter('unverified')}
                >
                  Needs Revision <span className="sae-chip-count">{unverifiedSkillsCount}</span>
                </button>
              </div>

              <div className="sae-toolbar-actions">
                <input
                  type="text"
                  className="sae-search-input"
                  placeholder="Search skills, issuer, domain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <button
                  type="button"
                  className="sae-btn-add"
                  onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                >
                  {isAddFormOpen ? (
                    'Cancel'
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add Skill
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ADD SKILL FORM (CLEAN, UNCLUTTERED, PROFESSIONAL) */}
            {isAddFormOpen && (
              <form className="sae-form-card" onSubmit={handleCreateSkill}>
                <div className="sae-form-header">
                  <div className="sae-form-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Add Skill & Submit for Admin Verification
                  </div>
                </div>

                {formError && (
                  <div className="sae-form-alert" role="alert">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{formError}</span>
                  </div>
                )}

                <div className="sae-form-grid">
                  {/* Field 1: Skill Name */}
                  <div className="sae-form-field">
                    <label>Skill Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Financial Accounting, AutoCAD, Python, Clinical Diagnostics"
                      value={skillName}
                      onChange={(e) => setSkillName(e.target.value)}
                    />
                  </div>

                  {/* Field 2: Category / Domain */}
                  <div className="sae-form-field">
                    <label>Category / Domain *</label>
                    <select
                      required
                      value={skillCategory}
                      onChange={(e) => setSkillCategory(e.target.value)}
                    >
                      <option value="">Select Category / Domain</option>
                      {SKILL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Field 3: Proficiency Level */}
                  <div className="sae-form-field">
                    <label>Proficiency Level *</label>
                    <select
                      required
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                    >
                      <option value="">Select Proficiency Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>

                  {/* Field 4: Course / Training Duration */}
                  <div className="sae-form-field">
                    <label>Course / Training Duration *</label>
                    <select
                      required
                      value={courseDuration}
                      onChange={(e) => {
                        setCourseDuration(e.target.value)
                        if (e.target.value !== 'Other') setCustomDuration('')
                      }}
                    >
                      <option value="">Select Course / Training Duration</option>
                      {DURATION_OPTIONS.map((dur) => (
                        <option key={dur} value={dur}>{dur}</option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Duration (shown only when 'Other' is selected) */}
                  {courseDuration === 'Other' && (
                    <div className="sae-form-field sae-form-field-full">
                      <label>Custom Duration *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5 Months, 45 Days, 10 Weeks, 80 Hours"
                        value={customDuration}
                        onChange={(e) => setCustomDuration(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Certificate Details Header (Compulsory) */}
                  <div className="sae-form-section-divider">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b38e44" strokeWidth="2.5">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                    </svg>
                    <span>Certificate Details (Compulsory)</span>
                  </div>

                  {/* Field 5: Certificate Name */}
                  <div className="sae-form-field">
                    <label>Certificate Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NPTEL Elite, Six Sigma, AWS Certified"
                      value={credentialName}
                      onChange={(e) => setCredentialName(e.target.value)}
                    />
                  </div>

                  {/* Field 6: Issuing Organization */}
                  <div className="sae-form-field">
                    <label>Issuing Organization *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NPTEL, Coursera, ICAI, Google, University"
                      value={issuingOrg}
                      onChange={(e) => setIssuingOrg(e.target.value)}
                    />
                  </div>

                  {/* Field 7: Issue Date */}
                  <div className="sae-form-field">
                    <label>Issue Date *</label>
                    <input
                      type="date"
                      required
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                    />
                  </div>

                  {/* Field 8: Certificate Link */}
                  <div className="sae-form-field">
                    <label>Certificate Link *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://verify.issuing-org.com/..."
                      value={credentialUrl}
                      onChange={(e) => setCredentialUrl(e.target.value)}
                    />
                  </div>

                  {/* Field 9: Upload Certificate */}
                  <div className="sae-form-field sae-form-field-full">
                    <label>Upload Certificate *</label>
                    <input
                      key={fileInputKey}
                      type="file"
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        setCertificateFile(file)
                      }}
                    />
                    {certificateFile && (
                      <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                        Attached: {certificateFile.name} ({(certificateFile.size / 1024).toFixed(1)} KB)
                      </span>
                    )}
                  </div>
                </div>

                <div className="sae-form-actions">
                  <button
                    type="button"
                    className="sae-btn-cancel"
                    onClick={() => setIsAddFormOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="sae-btn-submit"
                  >
                    Submit for Admin Verification
                  </button>
                </div>
              </form>
            )}

            {/* SKILLS LISTING */}
            {filteredSkills.length === 0 ? (
              <div className="sae-empty-state">
                <div className="sae-empty-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f1f2e' }}>
                  {skills.length === 0 ? 'No skills submitted yet' : 'No skills match the selected filter'}
                </div>
                <p style={{ fontSize: '0.84rem', color: '#64748b', maxWidth: 460, margin: 0 }}>
                  {skills.length === 0
                    ? 'Add and document your academic, technical, managerial, or professional capabilities to submit them for Portal Admin verification.'
                    : 'Try clearing your search query or selecting a different status filter.'}
                </p>
                {skills.length === 0 && (
                  <button
                    type="button"
                    className="sae-btn-add"
                    style={{ marginTop: 8 }}
                    onClick={() => setIsAddFormOpen(true)}
                  >
                    + Add Your First Skill
                  </button>
                )}
              </div>
            ) : (
              <div className="sae-skills-grid">
                {filteredSkills.map((item) => {
                  const isVerified = item.verified || item.status === 'verified'
                  const isRejected = item.status === 'rejected'
                  const prof = getProficiencySteps(item.level)

                  const cardClass = isVerified ? 'is-verified' : isRejected ? 'is-unverified' : 'is-pending'

                  return (
                    <article key={item.id} className={`sae-skill-card ${cardClass}`}>
                      <div className="sae-skill-header">
                        <div>
                          <h3 className="sae-skill-name">{item.name}</h3>
                          <span className="sae-skill-category-badge">{item.category || 'General'}</span>
                        </div>

                        {/* Status Chip */}
                        {isVerified ? (
                          <span className="sae-status-badge verified" title="Officially accredited and verified by Portal Admin">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                              <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            Verified
                          </span>
                        ) : isRejected ? (
                          <span className="sae-status-badge unverified" title="Rejected or needs revision by Portal Admin">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="15" y1="9" x2="9" y2="15" />
                              <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            Not Verified
                          </span>
                        ) : (
                          <span className="sae-status-badge pending" title="Submission received and undergoing audit">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            Pending Review
                          </span>
                        )}
                      </div>

                      {/* Proficiency Indicator */}
                      <div className="sae-prof-wrap">
                        <div className="sae-prof-label-row">
                          <span style={{ fontWeight: 600 }}>{prof.text}</span>
                          {item.duration ? (
                            <span>Duration: {item.duration}</span>
                          ) : item.experience ? (
                            <span>{item.experience}</span>
                          ) : null}
                        </div>
                        <div className="sae-prof-bars">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={`step-${step}`}
                              className={`sae-prof-bar-segment ${step <= prof.count ? 'filled' : ''}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Certificate & Credential Details (Department-Neutral) */}
                      {(item.credentialName || item.issuingOrg || item.credentialUrl || item.certificateFile) ? (
                        <div className="sae-cred-box">
                          <div className="sae-cred-header">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b38e44" strokeWidth="2">
                              <circle cx="12" cy="8" r="6" />
                              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                            </svg>
                            <span className="sae-cred-name">
                              {item.credentialName || item.certificateFile || 'Accredited Skill Credential'}
                            </span>
                          </div>

                          <div className="sae-cred-meta">
                            {item.issuingOrg && <span><strong>Issuer:</strong> {item.issuingOrg}</span>}
                            {item.issuingOrg && item.issueDate && <span>•</span>}
                            {item.issueDate && <span><strong>Issued:</strong> {item.issueDate}</span>}
                            {item.certificateFile && <span>•</span>}
                            {item.certificateFile && <span><strong>File:</strong> {item.certificateFile}</span>}
                          </div>

                          {item.credentialUrl && (
                            <a
                              href={item.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="sae-cred-verify-link"
                              title="Verify authenticity with issuing organization in new tab"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                              Verify Credential Online ↗
                            </a>
                          )}
                        </div>
                      ) : (
                        <div className="sae-cred-empty">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          Self-Declared Skill (Awaiting Verification)
                        </div>
                      )}

                      {/* Accreditation State Note */}
                      <div className={`sae-card-status-note ${cardClass}`}>
                        {isVerified ? (
                          <span>
                            <strong>Official Item:</strong> Verified by Portal Admin via issuing authority. Counted in official profile.
                          </span>
                        ) : isRejected ? (
                          <span>
                            <strong>Admin Review:</strong> {item.rejectionReason || 'Credential could not be verified. Please update the verification link or issuing details.'}
                          </span>
                        ) : (
                          <span>
                            <strong>Under Audit:</strong> Submitted for Portal Admin verification. Not yet counted in official profile.
                          </span>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROJECTS (PLACEHOLDER FOR FUTURE IMPLEMENTATION) */}
        {activeTab === 'projects' && (
          <section className="sae-placeholder-card">
            <span className="sae-placeholder-badge">Coming Soon</span>
            <h2 className="sae-placeholder-title">Student Academic & Innovation Projects</h2>
            <p className="sae-placeholder-desc">
              The dedicated Project Verification workflow is being finalized. You will soon be able to submit projects from Engineering, Arts, Sciences, Management, and Commerce with institutional supervisor endorsements for Portal Admin verification.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button
                type="button"
                className="sae-btn-cancel"
                onClick={() => setActiveTab('skills')}
              >
                ← Back to Skills
              </button>
            </div>
          </section>
        )}

        {/* TAB 3: INTERNSHIPS & EXPERIENCE (PLACEHOLDER FOR FUTURE IMPLEMENTATION) */}
        {activeTab === 'experience' && (
          <section className="sae-placeholder-card">
            <span className="sae-placeholder-badge">Coming Soon</span>
            <h2 className="sae-placeholder-title">Internships & Industrial Experience</h2>
            <p className="sae-placeholder-desc">
              The dedicated Industrial Experience workflow is being finalized. You will soon be able to log company, clinic, research lab, and corporate tenures with mentor evaluations for Portal Admin verification.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button
                type="button"
                className="sae-btn-cancel"
                onClick={() => setActiveTab('skills')}
              >
                ← Back to Skills
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
