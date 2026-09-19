import { useState, useEffect, useRef } from 'react'

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
  onNavigateHome,
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

  // Projects State (synced with localStorage)
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_projects')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Filter state for Projects: 'all' | 'verified' | 'pending' | 'unverified'
  const [projectFilter, setProjectFilter] = useState('all')
  const [projectSearchQuery, setProjectSearchQuery] = useState('')

  // Add Project Form state (All fields start unselected/empty - no pre-selection!)
  const [isAddProjectFormOpen, setIsAddProjectFormOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectType, setProjectType] = useState('')
  const [projectParticipation, setProjectParticipation] = useState('')
  const [projectDuration, setProjectDuration] = useState('')
  const [customProjectDuration, setCustomProjectDuration] = useState('')
  const [projectLink, setProjectLink] = useState('')
  const [projectImageFiles, setProjectImageFiles] = useState([])
  const [replacingImageId, setReplacingImageId] = useState(null)
  const [viewingModalImage, setViewingModalImage] = useState(null)
  const [projectDocFile, setProjectDocFile] = useState(null)
  const [projectDocPreviewUrl, setProjectDocPreviewUrl] = useState('')
  const [isProjectImageDragOver, setIsProjectImageDragOver] = useState(false)
  const [isProjectDocDragOver, setIsProjectDocDragOver] = useState(false)
  const [projectFormError, setProjectFormError] = useState('')

  const addProjectFormRef = useRef(null)
  const projectImageInputRef = useRef(null)
  const replaceImageInputRef = useRef(null)
  const projectDocInputRef = useRef(null)

  // Internships State (from localStorage for counts/tabs)
  const [internships, setInternships] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_internships')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Filter state for Internships: 'all' | 'verified' | 'pending' | 'unverified'
  const [internshipFilter, setInternshipFilter] = useState('all')
  const [internshipSearchQuery, setInternshipSearchQuery] = useState('')

  // Add Internship Form state (All fields start unselected/empty)
  const [isAddInternshipFormOpen, setIsAddInternshipFormOpen] = useState(false)
  const [internshipTitle, setInternshipTitle] = useState('')
  const [internshipOrg, setInternshipOrg] = useState('')
  const [internshipDomain, setInternshipDomain] = useState('')
  const [customInternshipDomain, setCustomInternshipDomain] = useState('')
  const [internshipType, setInternshipType] = useState('')
  const [internshipStartDate, setInternshipStartDate] = useState('')
  const [internshipEndDate, setInternshipEndDate] = useState('')
  const [internshipRole, setInternshipRole] = useState('')
  const [internshipCertFile, setInternshipCertFile] = useState(null)
  const [internshipCertPreviewUrl, setInternshipCertPreviewUrl] = useState('')
  const [internshipCertLink, setInternshipCertLink] = useState('')
  const [isInternshipCertDragOver, setIsInternshipCertDragOver] = useState(false)
  const [internshipFormError, setInternshipFormError] = useState('')

  const addInternshipFormRef = useRef(null)
  const internshipCertInputRef = useRef(null)

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
  const [certificatePreviewUrl, setCertificatePreviewUrl] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [formError, setFormError] = useState('')
  const [successBanner, setSuccessBanner] = useState('')
  const [isPolicyInfoOpen, setIsPolicyInfoOpen] = useState(false)
  const fileInputRef = useRef(null)
  const addSkillFormRef = useRef(null)

  useEffect(() => {
    if (!isPolicyInfoOpen) return
    const handlePopClose = (e) => {
      if (!e.target.closest('.sae-info-tooltip-wrap')) {
        setIsPolicyInfoOpen(false)
      }
    }
    document.addEventListener('click', handlePopClose)
    return () => document.removeEventListener('click', handlePopClose)
  }, [isPolicyInfoOpen])

  const handleFileSelect = (file) => {
    if (!file) return
    const maxBytes = 5 * 1024 * 1024 // 5 MB
    if (file.size > maxBytes) {
      setFormError('Certificate file exceeds 5 MB limit. Please select a smaller file.')
      return
    }
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    if (!allowed.includes(file.type) && !['pdf', 'jpg', 'jpeg', 'png'].includes(ext)) {
      setFormError('Please upload a valid PDF, JPG, or PNG certificate file.')
      return
    }

    if (certificatePreviewUrl) {
      try { URL.revokeObjectURL(certificatePreviewUrl) } catch {}
    }

    try {
      const objUrl = URL.createObjectURL(file)
      setCertificatePreviewUrl(objUrl)
    } catch {}

    setCertificateFile(file)
    setFormError('')
  }

  const handleViewCertificate = () => {
    let url = certificatePreviewUrl
    if (!url && certificateFile) {
      try {
        url = URL.createObjectURL(certificateFile)
        setCertificatePreviewUrl(url)
      } catch {}
    }
    if (url) {
      handleOpenImageModal(url, certificateFile?.name || 'Certificate Document')
    }
  }

  const handleReplaceCertificate = () => {
    fileInputRef.current?.click()
  }

  const handleDeleteCertificate = () => {
    if (certificatePreviewUrl) {
      try { URL.revokeObjectURL(certificatePreviewUrl) } catch {}
    }
    setCertificateFile(null)
    setCertificatePreviewUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    return () => {
      if (certificatePreviewUrl) {
        try { URL.revokeObjectURL(certificatePreviewUrl) } catch {}
      }
    }
  }, [certificatePreviewUrl])

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
  const pendingProjectsCount = projects.filter((p) => !p.verified && (p.status === 'pending' || !p.status)).length
  const unverifiedProjectsCount = projects.filter((p) => p.status === 'rejected' || p.status === 'unverified').length
  const verifiedInternshipsCount = internships.filter((i) => i.verified || i.status === 'verified').length
  const pendingInternshipsCount = internships.filter((i) => !i.verified && (i.status === 'pending' || !i.status)).length
  const unverifiedInternshipsCount = internships.filter((i) => i.status === 'rejected' || i.status === 'unverified').length

  // Filtered internships
  const filteredInternships = internships.filter((item) => {
    const isVerified = item.verified || item.status === 'verified'
    const isPending = !item.verified && (item.status === 'pending' || !item.status)
    const isUnverified = item.status === 'rejected' || item.status === 'unverified'

    if (internshipFilter === 'verified' && !isVerified) return false
    if (internshipFilter === 'pending' && !isPending) return false
    if (internshipFilter === 'unverified' && !isUnverified) return false

    if (internshipSearchQuery.trim()) {
      const q = internshipSearchQuery.toLowerCase()
      const matchTitle = (item.title || '').toLowerCase().includes(q)
      const matchOrg = (item.organization || item.company || '').toLowerCase().includes(q)
      const matchDomain = (item.domain || '').toLowerCase().includes(q)
      const matchRole = (item.role || '').toLowerCase().includes(q)
      const matchType = (item.type || '').toLowerCase().includes(q)
      if (!matchTitle && !matchOrg && !matchDomain && !matchRole && !matchType) return false
    }

    return true
  })

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
      certificateUrl: certificatePreviewUrl || '',
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
    if (certificatePreviewUrl) {
      try { URL.revokeObjectURL(certificatePreviewUrl) } catch {}
    }
    setCertificateFile(null)
    setCertificatePreviewUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setFormError('')
    setIsAddFormOpen(false)
    setSkillFilter('all')
    setSearchQuery('')

    setSuccessBanner(`Skill "${newSkill.name}" successfully submitted for Portal Admin verification.`)
    setTimeout(() => setSuccessBanner(''), 5000)
  }

  // Save projects to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('udaan_student_projects', JSON.stringify(projects))
    } catch {}
  }, [projects])

  useEffect(() => {
    return () => {
      projectImageFiles.forEach((img) => {
        if (img.previewUrl) {
          try { URL.revokeObjectURL(img.previewUrl) } catch {}
        }
      })
    }
  }, [projectImageFiles])

  // Project Image Handlers (Supports Multiple Images, Add-More, Replace, and Delete)
  const handleProjectImageSelect = (fileList) => {
    if (!fileList) return
    const files = Array.isArray(fileList) ? fileList : Array.from(fileList)
    if (files.length === 0) return

    const maxBytes = 5 * 1024 * 1024 // 5 MB per image
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const newItems = []

    for (const file of files) {
      if (file.size > maxBytes) {
        setProjectFormError(`Project preview image "${file.name}" exceeds 5 MB limit. Please select a smaller file.`)
        return
      }
      const ext = (file.name.split('.').pop() || '').toLowerCase()
      if (!allowed.includes(file.type) && !['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        setProjectFormError(`File "${file.name}" is not a valid image. Please upload PNG, JPG, JPEG, or WEBP.`)
        return
      }

      let objUrl = ''
      try {
        objUrl = URL.createObjectURL(file)
      } catch {}

      newItems.push({
        id: `pimg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        file,
        previewUrl: objUrl,
        name: file.name,
        size: file.size,
      })
    }

    if (newItems.length > 0) {
      setProjectImageFiles((prev) => [...prev, ...newItems])
      setProjectFormError('')
    }
  }

  const handleReplaceProjectImage = (id, newFile) => {
    if (!newFile) return
    const maxBytes = 5 * 1024 * 1024
    if (newFile.size > maxBytes) {
      setProjectFormError(`Replacement image "${newFile.name}" exceeds 5 MB limit.`)
      return
    }
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const ext = (newFile.name.split('.').pop() || '').toLowerCase()
    if (!allowed.includes(newFile.type) && !['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      setProjectFormError(`File "${newFile.name}" is not a valid image. Allowed formats: PNG, JPG, JPEG, WEBP.`)
      return
    }

    let newUrl = ''
    try {
      newUrl = URL.createObjectURL(newFile)
    } catch {}

    setProjectImageFiles((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          if (img.previewUrl) {
            try { URL.revokeObjectURL(img.previewUrl) } catch {}
          }
          return {
            ...img,
            file: newFile,
            previewUrl: newUrl,
            name: newFile.name,
            size: newFile.size,
          }
        }
        return img
      })
    )
    setProjectFormError('')
  }

  const handleDeleteProjectImage = (id) => {
    setProjectImageFiles((prev) => {
      const target = prev.find((img) => img.id === id)
      if (target?.previewUrl) {
        try { URL.revokeObjectURL(target.previewUrl) } catch {}
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  // Universal Modal Handlers (clean in-page preview for images & documents across Skills, Projects, and Internships)
  const handleOpenImageModal = (url, name) => {
    if (!url && !name) return
    setViewingModalImage({ url: url || '', name: name || 'Document Preview' })
  }

  const handleCloseImageModal = () => {
    setViewingModalImage(null)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && viewingModalImage) {
        setViewingModalImage(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [viewingModalImage])

  // Project Documentation Handlers
  const handleProjectDocSelect = (file) => {
    if (!file) return
    const maxBytes = 10 * 1024 * 1024 // 10 MB
    if (file.size > maxBytes) {
      setProjectFormError('Project documentation file exceeds 10 MB limit.')
      return
    }
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    const allowed = ['pdf', 'doc', 'docx', 'txt', 'zip']
    if (!allowed.includes(ext)) {
      setProjectFormError('Please upload a valid documentation file (.pdf, .doc, .docx, .txt, .zip).')
      return
    }
    if (projectDocPreviewUrl) {
      try { URL.revokeObjectURL(projectDocPreviewUrl) } catch {}
    }
    try {
      const objUrl = URL.createObjectURL(file)
      setProjectDocPreviewUrl(objUrl)
    } catch {}
    setProjectDocFile(file)
    setProjectFormError('')
  }

  const handleViewProjectDoc = () => {
    if (!projectDocFile) return
    let url = projectDocPreviewUrl
    if (!url) {
      try {
        url = URL.createObjectURL(projectDocFile)
        setProjectDocPreviewUrl(url)
      } catch {}
    }
    if (url) {
      handleOpenImageModal(url, projectDocFile.name)
    }
  }

  const handleDeleteProjectDoc = () => {
    if (projectDocPreviewUrl) {
      try { URL.revokeObjectURL(projectDocPreviewUrl) } catch {}
    }
    setProjectDocFile(null)
    setProjectDocPreviewUrl('')
    if (projectDocInputRef.current) {
      projectDocInputRef.current.value = ''
    }
  }

  useEffect(() => {
    return () => {
      if (projectDocPreviewUrl) {
        try { URL.revokeObjectURL(projectDocPreviewUrl) } catch {}
      }
    }
  }, [projectDocPreviewUrl])

  // Handle Project Creation & Submission
  const handleCreateProject = (e) => {
    e.preventDefault()
    if (!projectName.trim()) {
      setProjectFormError('Please enter the Project Name.')
      return
    }
    if (!projectType) {
      setProjectFormError('Please select a Project Type (Software or Hardware).')
      return
    }
    if (!projectParticipation) {
      setProjectFormError('Please select Project Participation (Individual or Team).')
      return
    }
    if (!projectDuration) {
      setProjectFormError('Please select the Project Duration.')
      return
    }
    if (projectDuration === 'Other' && !customProjectDuration.trim()) {
      setProjectFormError('Please enter your custom project duration.')
      return
    }

    // Validation: Software projects cannot be submitted without a Project Link.
    // Hardware projects completely skip Project Link validation.
    if (projectType === 'Software') {
      if (!projectLink.trim()) {
        setProjectFormError('Project Link is required for Software projects.')
        return
      }
      if (
        !projectLink.trim().startsWith('http://') &&
        !projectLink.trim().startsWith('https://')
      ) {
        setProjectFormError('Project Link must begin with http:// or https://')
        return
      }
    }

    // Validation: At least one Project Preview Image is mandatory
    if (projectImageFiles.length === 0) {
      setProjectFormError('Please upload at least one Project Preview Image (screenshot or photo).')
      return
    }

    if (!projectDocFile) {
      setProjectFormError('Please upload Project Documentation (report or document).')
      return
    }

    const finalDuration = projectDuration === 'Other' ? customProjectDuration.trim() : projectDuration
    const isSoftware = projectType === 'Software'

    const newProj = {
      id: `p_${Date.now()}`,
      name: projectName.trim(),
      title: projectName.trim(),
      type: projectType,
      participation: projectParticipation,
      duration: finalDuration,
      url: isSoftware ? projectLink.trim() : '',
      link: isSoftware ? projectLink.trim() : '',
      previewImage: projectImageFiles[0]?.name || '',
      previewImageUrl: projectImageFiles[0]?.previewUrl || '',
      previewImages: projectImageFiles.map((img) => ({
        name: img.name,
        url: img.previewUrl,
        size: img.size,
      })),
      documentationFile: projectDocFile.name,
      documentationUrl: projectDocPreviewUrl || '',
      verified: false,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      notes: 'Submitted for Project authenticity and academic evaluation by Portal Admin.',
    }

    setProjects((prev) => [newProj, ...prev])

    // Save student notification
    try {
      const savedNotifs = JSON.parse(localStorage.getItem('udaan_student_notifications') || '[]')
      const newNotif = {
        id: `n_${Date.now()}`,
        type: 'info',
        title: `Project Submitted: ${newProj.name}`,
        message: 'Your project submission has been sent to Portal Admin for verification.',
        timestamp: 'Just now',
        read: false,
      }
      localStorage.setItem('udaan_student_notifications', JSON.stringify([newNotif, ...savedNotifs]))
    } catch {}

    // Reset project form to initial unselected state
    setProjectName('')
    setProjectType('')
    setProjectParticipation('')
    setProjectDuration('')
    setCustomProjectDuration('')
    setProjectLink('')
    projectImageFiles.forEach((img) => {
      if (img.previewUrl) {
        try { URL.revokeObjectURL(img.previewUrl) } catch {}
      }
    })
    setProjectImageFiles([])
    setReplacingImageId(null)
    if (projectDocPreviewUrl) {
      try { URL.revokeObjectURL(projectDocPreviewUrl) } catch {}
    }
    setProjectDocFile(null)
    setProjectDocPreviewUrl('')
    if (projectImageInputRef.current) projectImageInputRef.current.value = ''
    if (replaceImageInputRef.current) replaceImageInputRef.current.value = ''
    if (projectDocInputRef.current) projectDocInputRef.current.value = ''
    setProjectFormError('')
    setIsAddProjectFormOpen(false)
    setProjectFilter('all')
    setProjectSearchQuery('')

    setSuccessBanner(`Project "${newProj.name}" successfully submitted for Portal Admin verification.`)
    setTimeout(() => setSuccessBanner(''), 5000)
  }

  // Save internships to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('udaan_student_internships', JSON.stringify(internships))
    } catch {}
  }, [internships])

  // Internship Certificate Handlers
  const handleInternshipCertSelect = (file) => {
    if (!file) return
    const maxBytes = 10 * 1024 * 1024 // 10 MB
    if (file.size > maxBytes) {
      setInternshipFormError('Certificate file exceeds 10 MB limit.')
      return
    }
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    const allowed = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp']
    if (!allowed.includes(ext)) {
      setInternshipFormError('Please upload a valid certificate file (.pdf, .doc, .docx, .jpg, .png, .webp).')
      return
    }
    if (internshipCertPreviewUrl) {
      try { URL.revokeObjectURL(internshipCertPreviewUrl) } catch {}
    }
    try {
      const objUrl = URL.createObjectURL(file)
      setInternshipCertPreviewUrl(objUrl)
    } catch {}
    setInternshipCertFile(file)
    setInternshipFormError('')
  }

  const handleViewInternshipCert = () => {
    if (!internshipCertFile) return
    let url = internshipCertPreviewUrl
    if (!url) {
      try {
        url = URL.createObjectURL(internshipCertFile)
        setInternshipCertPreviewUrl(url)
      } catch {}
    }
    if (url) {
      handleOpenImageModal(url, internshipCertFile.name)
    }
  }

  const handleDeleteInternshipCert = () => {
    if (internshipCertPreviewUrl) {
      try { URL.revokeObjectURL(internshipCertPreviewUrl) } catch {}
    }
    setInternshipCertFile(null)
    setInternshipCertPreviewUrl('')
    if (internshipCertInputRef.current) {
      internshipCertInputRef.current.value = ''
    }
  }

  useEffect(() => {
    return () => {
      if (internshipCertPreviewUrl) {
        try { URL.revokeObjectURL(internshipCertPreviewUrl) } catch {}
      }
    }
  }, [internshipCertPreviewUrl])

  // Calculate internship duration in human-readable format
  const calculateInternshipDuration = (startStr, endStr) => {
    if (!startStr || !endStr) return ''
    const start = new Date(startStr)
    const end = new Date(endStr)
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return ''
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const months = Math.round(diffDays / 30.44)
    if (months >= 1) {
      return `${months} ${months === 1 ? 'Month' : 'Months'}`
    }
    const weeks = Math.round(diffDays / 7)
    if (weeks >= 1) {
      return `${weeks} ${weeks === 1 ? 'Week' : 'Weeks'}`
    }
    return `${diffDays} ${diffDays === 1 ? 'Day' : 'Days'}`
  }

  // Reset Internship Form
  const resetInternshipForm = () => {
    setInternshipTitle('')
    setInternshipOrg('')
    setInternshipDomain('')
    setCustomInternshipDomain('')
    setInternshipType('')
    setInternshipStartDate('')
    setInternshipEndDate('')
    setInternshipRole('')
    if (internshipCertPreviewUrl) {
      try { URL.revokeObjectURL(internshipCertPreviewUrl) } catch {}
    }
    setInternshipCertFile(null)
    setInternshipCertPreviewUrl('')
    setInternshipCertLink('')
    if (internshipCertInputRef.current) {
      internshipCertInputRef.current.value = ''
    }
    setInternshipFormError('')
    setIsAddInternshipFormOpen(false)
  }

  // Handle Internship Creation & Submission
  const handleCreateInternship = (e) => {
    e.preventDefault()
    if (!internshipTitle.trim()) {
      setInternshipFormError('Please enter the Internship Title.')
      return
    }
    if (!internshipOrg.trim()) {
      setInternshipFormError('Please enter the Organization / Company Name.')
      return
    }
    const finalDomain = internshipDomain === 'Other' ? customInternshipDomain.trim() : internshipDomain.trim()
    if (!finalDomain) {
      setInternshipFormError('Please select or specify the Domain / Field.')
      return
    }
    if (!internshipType) {
      setInternshipFormError('Please select the Internship Type (On-site, Remote, or Hybrid).')
      return
    }
    if (!internshipStartDate) {
      setInternshipFormError('Please select the Start Date.')
      return
    }
    if (!internshipEndDate) {
      setInternshipFormError('Please select the End Date.')
      return
    }
    if (new Date(internshipEndDate) < new Date(internshipStartDate)) {
      setInternshipFormError('End Date cannot be earlier than Start Date.')
      return
    }
    if (!internshipRole.trim()) {
      setInternshipFormError('Please enter the Internship Role.')
      return
    }
    if (!internshipCertFile) {
      setInternshipFormError('Please upload an Internship Certificate document.')
      return
    }
    const cleanCertLink = internshipCertLink.trim()
    if (!cleanCertLink) {
      setInternshipFormError('Please enter the Certificate Link.')
      return
    }
    try {
      const parsedUrl = new URL(cleanCertLink)
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        setInternshipFormError('Certificate Link must start with http:// or https://')
        return
      }
    } catch {
      setInternshipFormError('Please enter a valid Certificate Link URL (e.g. https://...).')
      return
    }

    const calculatedDur = calculateInternshipDuration(internshipStartDate, internshipEndDate)

    const newIntern = {
      id: `intern_${Date.now()}`,
      title: internshipTitle.trim(),
      organization: internshipOrg.trim(),
      company: internshipOrg.trim(),
      domain: finalDomain,
      type: internshipType,
      startDate: internshipStartDate,
      endDate: internshipEndDate,
      duration: calculatedDur || 'Completed',
      role: internshipRole.trim(),
      certificateFile: internshipCertFile.name,
      certificateUrl: internshipCertPreviewUrl || '',
      certificateLink: cleanCertLink,
      verified: false,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      notes: 'Submitted for industrial experience verification by Portal Admin.',
    }

    setInternships((prev) => [newIntern, ...prev])

    try {
      const savedNotifs = JSON.parse(localStorage.getItem('udaan_student_notifications') || '[]')
      const newNotif = {
        id: `n_${Date.now()}`,
        type: 'info',
        title: `Internship Submitted: ${newIntern.title}`,
        message: `${newIntern.role} at ${newIntern.organization} has been submitted to Portal Admin for verification.`,
        timestamp: 'Just now',
        read: false,
      }
      localStorage.setItem('udaan_student_notifications', JSON.stringify([newNotif, ...savedNotifs]))
    } catch {}

    resetInternshipForm()
    setInternshipFilter('all')
    setInternshipSearchQuery('')

    setSuccessBanner(`Internship "${newIntern.title}" at ${newIntern.organization} successfully submitted for Portal Admin verification.`)
    setTimeout(() => setSuccessBanner(''), 5000)
  }

  // Filtered projects
  const filteredProjects = projects.filter((item) => {
    const isVerified = item.verified || item.status === 'verified'
    const isPending = !item.verified && (item.status === 'pending' || !item.status)
    const isUnverified = item.status === 'rejected' || item.status === 'unverified'

    if (projectFilter === 'verified' && !isVerified) return false
    if (projectFilter === 'pending' && !isPending) return false
    if (projectFilter === 'unverified' && !isUnverified) return false

    if (projectSearchQuery.trim()) {
      const q = projectSearchQuery.toLowerCase()
      const matchName = (item.name || item.title || '').toLowerCase().includes(q)
      const matchType = (item.type || '').toLowerCase().includes(q)
      const matchPart = (item.participation || '').toLowerCase().includes(q)
      const matchDur = (item.duration || '').toLowerCase().includes(q)
      if (!matchName && !matchType && !matchPart && !matchDur) return false
    }

    return true
  })

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
          flex: 1;
          min-height: 100%;
          background-color: #f7f5ef;
          color: #112233;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          box-sizing: border-box;
        }

        /* Top Header: Full available width with balanced margins */
        .sae-header {
          background-color: #0f1f2e;
          color: #ffffff;
          border-bottom: 3px solid #b38e44;
          padding: 10px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 16px rgba(15, 31, 46, 0.18);
          box-sizing: border-box;
          width: 100%;
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

        /* Main Container: Full available width with minimal, balanced left/right margins */
        .sae-main-container {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 16px 32px 24px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 14px;
        }

        /* Page Title & Inline Verification Notice */
        .sae-page-header {
          margin-bottom: 0px;
        }

        .sae-page-title-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: nowrap;
          gap: 12px;
        }

        .sae-page-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f1f2e;
          margin: 0;
          letter-spacing: -0.015em;
          line-height: 1.2;
          white-space: nowrap;
        }

        .sae-verify-badge-wrap {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          position: relative;
          flex-shrink: 0;
        }

        .sae-verify-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
          border-radius: 9999px;
          padding: 3.5px 12px;
          font-size: 0.76rem;
          font-weight: 600;
          line-height: 1.2;
          white-space: nowrap;
        }

        .sae-verify-shield {
          display: inline-flex;
          align-items: center;
          line-height: 1;
        }

        .sae-info-tooltip-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .sae-info-btn {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #475569;
          border: 1px solid #cbd5e1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          padding: 0;
        }

        .sae-info-btn:hover,
        .sae-info-btn:focus-visible {
          background: #1e3a5f;
          color: #ffffff;
          border-color: #1e3a5f;
        }

        .sae-policy-popover {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 320px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 12px 14px;
          box-shadow: 0 10px 25px -5px rgba(15, 31, 46, 0.15), 0 4px 6px -2px rgba(15, 31, 46, 0.05);
          z-index: 1000;
          animation: saeFadeIn 0.15s ease-out;
        }

        .sae-popover-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 700;
          color: #0f1f2e;
          margin-bottom: 6px;
          padding-bottom: 4px;
          border-bottom: 1px solid #f1f5f9;
        }

        .sae-popover-close {
          background: transparent;
          border: none;
          font-size: 1.1rem;
          line-height: 1;
          color: #94a3b8;
          cursor: pointer;
          padding: 0 2px;
        }

        .sae-popover-close:hover {
          color: #0f1f2e;
        }

        .sae-popover-text {
          font-size: 0.76rem;
          color: #475569;
          line-height: 1.45;
          margin: 0;
        }

        /* Professional Executive Metrics Summary: 4 evenly sized in 1 row */
        .sae-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          width: 100%;
          box-sizing: border-box;
        }

        .sae-metric-card {
          background: #ffffff;
          border: 1px solid #ded9cc;
          border-radius: 8px;
          padding: 12px 14px;
          box-shadow: 0 1px 3px rgba(15, 31, 46, 0.04);
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          height: 74px;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .sae-metric-card:hover {
          box-shadow: 0 4px 12px rgba(15, 31, 46, 0.08);
          transform: translateY(-1px);
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
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sae-metric-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
          flex: 1;
        }

        .sae-metric-top {
          display: flex;
          align-items: baseline;
          gap: 6px;
          min-width: 0;
        }

        .sae-metric-val {
          font-size: 1.42rem;
          font-weight: 800;
          line-height: 1;
          color: #0f1f2e;
          letter-spacing: -0.025em;
        }

        .sae-metric-label {
          font-size: 0.84rem;
          font-weight: 700;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sae-metric-sub {
          font-size: 0.72rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 3px;
          line-height: 1.25;
        }

        @media (max-width: 1120px) {
          .sae-metrics-grid {
            gap: 8px;
          }
          .sae-metric-card {
            padding: 10px 8px;
            gap: 8px;
          }
          .sae-metric-icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
          }
          .sae-metric-val {
            font-size: 1.30rem;
          }
          .sae-metric-label {
            font-size: 0.78rem;
          }
          .sae-metric-sub {
            font-size: 0.68rem;
          }
          .sae-main-container {
            padding: 14px 20px 20px;
          }
          .sae-header {
            padding: 10px 20px;
          }
        }

        /* Tabs Navigation: 3 evenly balanced columns */
        .sae-tabs-nav {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          background: #ffffff;
          border: 1px solid #ded9cc;
          border-radius: 8px;
          padding: 4px;
          gap: 8px;
          box-shadow: 0 1px 3px rgba(15, 31, 46, 0.03);
          box-sizing: border-box;
          width: 100%;
        }

        .sae-tab-btn {
          width: 100%;
          background: transparent;
          border: none;
          padding: 0 16px;
          height: 40px;
          border-radius: 6px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          white-space: nowrap;
          transition: all 0.15s ease;
          box-sizing: border-box;
        }

        .sae-tab-btn:hover {
          background: #f8fafc;
          color: #0f1f2e;
        }

        .sae-tab-btn.active {
          background: #0f1f2e;
          color: #ffffff;
          box-shadow: 0 2px 5px rgba(15, 31, 46, 0.18);
        }

        .sae-tab-badge {
          font-size: 0.74rem;
          padding: 2px 8px;
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
          border-radius: 6px;
          padding: 10px 16px;
          font-size: 0.84rem;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: saeFadeIn 0.2s ease-out;
        }

        /* Toolbar: Filter & Add Action in ONE clean row */
        .sae-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: nowrap;
          gap: 14px;
          width: 100%;
          box-sizing: border-box;
          height: 36px;
        }

        .sae-filter-chips {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: nowrap;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .sae-filter-chips::-webkit-scrollbar {
          display: none;
        }

        .sae-chip {
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #475569;
          border-radius: 9999px;
          padding: 0 14px;
          height: 34px;
          font-size: 0.80rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          flex-shrink: 0;
          box-sizing: border-box;
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
          background: rgba(0, 0, 0, 0.07);
          padding: 1px 6px;
          border-radius: 9999px;
          font-size: 0.70rem;
        }

        .sae-chip.active .sae-chip-count {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .sae-toolbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .sae-search-input {
          padding: 0 12px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.84rem;
          background: #ffffff;
          outline: none;
          width: 260px;
          min-width: 150px;
          height: 34px;
          box-sizing: border-box;
          transition: all 0.15s ease;
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
          padding: 0 16px;
          height: 34px;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          white-space: nowrap;
          transition: background 0.15s ease;
          box-sizing: border-box;
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

        /* Custom Certificate Upload Box */
        .sae-upload-box {
          border: 2px dashed #cbd5e1;
          background: #fafbfc;
          border-radius: 8px;
          padding: 20px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .sae-upload-box:hover,
        .sae-upload-box.dragover {
          border-color: #1e3a5f;
          background: #ffffff;
          box-shadow: 0 4px 14px rgba(30, 58, 95, 0.08);
          transform: translateY(-1px);
        }

        .sae-upload-icon-circle {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #1e3a5f;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
          transition: background 0.2s ease;
        }

        .sae-upload-box:hover .sae-upload-icon-circle,
        .sae-upload-box.dragover .sae-upload-icon-circle {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .sae-upload-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: #0f1f2e;
        }

        .sae-upload-hint {
          font-size: 0.78rem;
          color: #64748b;
          margin-top: 3px;
        }

        /* Uploaded File Presentation Card */
        .sae-file-card {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-left: 4px solid #16a34a;
          border-radius: 8px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          box-shadow: 0 2px 8px rgba(15, 31, 46, 0.04);
        }

        .sae-file-info {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          flex: 1;
        }

        .sae-file-icon {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          background: #ecfdf5;
          color: #16a34a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sae-file-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .sae-file-name {
          font-size: 0.86rem;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sae-file-meta {
          font-size: 0.74rem;
          color: #64748b;
        }

        .sae-file-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .sae-file-btn {
          border-radius: 5px;
          padding: 6px 11px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.15s ease;
          line-height: 1;
        }

        .sae-file-btn-view {
          background: #f1f5f9;
          color: #1e3a5f;
          border: 1px solid #cbd5e1;
        }

        .sae-file-btn-view:hover {
          background: #e2e8f0;
          color: #0f1f2e;
        }

        .sae-file-btn-replace {
          background: #f1f5f9;
          color: #1e3a5f;
          border: 1px solid #cbd5e1;
        }

        .sae-file-btn-replace:hover {
          background: #e2e8f0;
          color: #0f1f2e;
        }

        .sae-file-btn-delete {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .sae-file-btn-delete:hover {
          background: #dc2626;
          color: #ffffff;
          border-color: #dc2626;
        }

        @media (max-width: 600px) {
          .sae-file-card {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .sae-file-actions {
            justify-content: flex-end;
          }
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

        .sae-add-more-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px 0 10px 0;
          margin-top: 4px;
        }

        .sae-btn-add-more {
          background: #f0fdf4;
          color: #15803d;
          border: 1.5px solid #86efac;
          border-radius: 8px;
          padding: 11px 24px;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(22, 163, 74, 0.08);
        }

        .sae-btn-add-more:hover {
          background: #16a34a;
          border-color: #16a34a;
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(22, 163, 74, 0.25);
        }

        .sae-btn-add-more:active {
          transform: translateY(0);
        }

        /* Projects Cards Grid */
        .sae-projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 16px;
        }

        @media (max-width: 480px) {
          .sae-projects-grid {
            grid-template-columns: 1fr;
          }
        }

        .sae-project-card {
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

        .sae-project-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(15, 31, 46, 0.08);
        }

        .sae-project-card.is-verified {
          border-left: 4px solid #16a34a;
        }

        .sae-project-card.is-pending {
          border-left: 4px solid #d97706;
        }

        .sae-project-card.is-unverified {
          border-left: 4px solid #ef4444;
        }

        .sae-project-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .sae-project-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f1f2e;
          margin: 0 0 6px 0;
        }

        .sae-project-badges-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .sae-badge-type {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .sae-badge-type.software {
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
        }

        .sae-badge-type.hardware {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        }

        .sae-badge-part {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        }

        .sae-project-meta-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: #475569;
        }

        .sae-btn-add-img-more {
          background: #f0fdf4;
          color: #15803d;
          border: 1.5px dashed #86efac;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.18s ease;
        }

        .sae-btn-add-img-more:hover {
          background: #dcfce7;
          border-color: #16a34a;
          color: #166534;
        }

        .sae-project-preview-wrap {
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
        }

        .sae-project-preview-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          display: block;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .sae-project-preview-img:hover {
          transform: scale(1.02);
        }

        .sae-project-img-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 24px;
          color: #64748b;
          font-size: 0.8rem;
          font-weight: 600;
        }

        /* In-Page Image Preview Modal */
        .sae-img-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.78);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          padding: 20px;
          animation: saeModalFadeIn 0.2s ease-out;
        }

        @keyframes saeModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .sae-img-modal-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.45);
          width: 100%;
          max-width: 860px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #cbd5e1;
          animation: saeModalZoomIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes saeModalZoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .sae-img-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          gap: 12px;
        }

        .sae-img-modal-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.92rem;
          font-weight: 700;
          color: #0f2e4d;
          min-width: 0;
        }

        .sae-img-modal-filename {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 550px;
        }

        .sae-img-modal-close {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .sae-img-modal-close:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        .sae-img-modal-body {
          padding: 18px;
          background: #0b1320;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: auto;
          min-height: 220px;
          max-height: calc(90vh - 120px);
        }

        .sae-img-modal-image {
          max-width: 100%;
          max-height: calc(90vh - 160px);
          object-fit: contain;
          border-radius: 6px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        .sae-img-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 18px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .sae-img-modal-hint {
          font-size: 0.76rem;
          color: #64748b;
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .sae-img-modal-card {
            max-width: 96vw;
            max-height: 94vh;
          }
          .sae-img-modal-filename {
            max-width: 220px;
          }
          .sae-img-modal-body {
            padding: 10px;
          }
        }

        .sae-project-doc-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .sae-project-doc-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.84rem;
          font-weight: 600;
          color: #1e293b;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sae-project-doc-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 200px;
        }

        .sae-project-doc-badge {
          font-size: 0.7rem;
          color: #0369a1;
          background: #e0f2fe;
          padding: 2px 6px;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          flex-shrink: 0;
          cursor: pointer;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          transition: background-color 0.15s ease;
        }

        .sae-project-doc-badge:hover {
          background: #bae6fd;
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

        /* Empty State: Flexibly uses available vertical space without huge blank void */
        .sae-empty-state {
          background: #ffffff;
          border: 1.5px dashed #cbd5e1;
          border-radius: 8px;
          padding: 32px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-sizing: border-box;
          flex: 1;
          min-height: 260px;
        }

        .sae-empty-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
        }

        .sae-empty-title {
          font-weight: 700;
          font-size: 1.15rem;
          color: #0f1f2e;
          margin: 0;
        }

        .sae-empty-desc {
          font-size: 0.86rem;
          color: #64748b;
          max-width: 500px;
          margin: 0;
          line-height: 1.5;
        }

        .sae-empty-state .sae-btn-add {
          margin-top: 8px;
          height: 38px;
          font-size: 0.88rem;
          font-weight: 700;
          padding: 0 20px;
          border-radius: 6px;
        }

        .sae-empty-state .sae-btn-cancel {
          margin-top: 8px;
          height: 38px;
          font-size: 0.88rem;
          font-weight: 600;
          padding: 0 20px;
          border-radius: 6px;
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
            <span
              onClick={onNavigateHome}
              style={{ cursor: onNavigateHome ? 'pointer' : 'default' }}
              title={onNavigateHome ? 'Return to Portal Home' : ''}
            >
              IAS Collaboration Portal
            </span>
            <span className="sae-breadcrumb-slash">/</span>
            <span
              onClick={onBack}
              style={{ cursor: onBack ? 'pointer' : 'default', color: '#ffffff', fontWeight: 500 }}
              title={onBack ? 'Return to Student Dashboard' : ''}
            >
              Student Portal
            </span>
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
        {/* PAGE TITLE & COMPACT INLINE VERIFICATION NOTICE */}
        <div className="sae-page-header">
          <div className="sae-page-title-wrap">
            <h1 className="sae-page-title">Achievements & Experience</h1>
            <div className="sae-verify-badge-wrap">
              <span className="sae-verify-badge">
                <span className="sae-verify-shield">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                <span>Only admin-verified achievements appear in your official profile</span>
              </span>
              <div className="sae-info-tooltip-wrap">
                <button
                  type="button"
                  className="sae-info-btn"
                  aria-label="Official verification info"
                  aria-expanded={isPolicyInfoOpen}
                  onClick={() => setIsPolicyInfoOpen((prev) => !prev)}
                  title="Click for verification details"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </button>
                {isPolicyInfoOpen && (
                  <div className="sae-policy-popover" role="tooltip">
                    <div className="sae-popover-header">
                      <strong>Admin Verification Notice</strong>
                      <button
                        type="button"
                        className="sae-popover-close"
                        onClick={() => setIsPolicyInfoOpen(false)}
                        aria-label="Close"
                      >
                        ×
                      </button>
                    </div>
                    <p className="sae-popover-text">
                      Submitted skills, projects, and internships are reviewed by the Portal Admin. Only approved and verified items appear in your official institutional profile, placements, and verified credentials.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* COMPACT STATUS SUMMARY BAR */}
        <section className="sae-metrics-grid" aria-label="Status summary metrics">
          {/* Card 1: Official Verified Items */}
          <div className="sae-metric-card is-verified">
            <div className="sae-metric-icon" style={{ background: '#dcfce7', color: '#166534' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="sae-metric-info">
              <div className="sae-metric-top">
                <span className="sae-metric-val">
                  {activeTab === 'experience'
                    ? verifiedInternshipsCount
                    : activeTab === 'projects'
                    ? verifiedProjectsCount
                    : verifiedSkillsCount}
                </span>
                <span className="sae-metric-label">
                  {activeTab === 'experience'
                    ? 'Verified Internships'
                    : activeTab === 'projects'
                    ? 'Verified Projects'
                    : 'Verified Skills'}
                </span>
              </div>
              <div className="sae-metric-sub" style={{ color: '#166534', fontWeight: 600 }}>
                Counted in Official Profile
              </div>
            </div>
          </div>

          {/* Card 2: Pending Admin Review */}
          <div className="sae-metric-card is-pending">
            <div className="sae-metric-icon" style={{ background: '#fef3c7', color: '#92400e' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="sae-metric-info">
              <div className="sae-metric-top">
                <span className="sae-metric-val">
                  {activeTab === 'experience'
                    ? pendingInternshipsCount
                    : activeTab === 'projects'
                    ? pendingProjectsCount
                    : pendingSkillsCount}
                </span>
                <span className="sae-metric-label">Pending Verification</span>
              </div>
              <div className="sae-metric-sub">Awaiting Admin Audit</div>
            </div>
          </div>

          {/* Card 3: Not Verified / Action Needed */}
          <div className="sae-metric-card is-unverified">
            <div className="sae-metric-icon" style={{ background: '#f1f5f9', color: '#475569' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="sae-metric-info">
              <div className="sae-metric-top">
                <span className="sae-metric-val">
                  {activeTab === 'experience'
                    ? unverifiedInternshipsCount
                    : activeTab === 'projects'
                    ? unverifiedProjectsCount
                    : unverifiedSkillsCount}
                </span>
                <span className="sae-metric-label">Needs Revision</span>
              </div>
              <div className="sae-metric-sub">Not Counted in Profile</div>
            </div>
          </div>

          {/* Card 4: Total Portfolio Submissions */}
          <div className="sae-metric-card is-projects">
            <div className="sae-metric-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div className="sae-metric-info">
              <div className="sae-metric-top">
                <span className="sae-metric-val">
                  {activeTab === 'experience'
                    ? internships.length
                    : activeTab === 'projects'
                    ? projects.length
                    : skills.length}
                </span>
                <span className="sae-metric-label">
                  {activeTab === 'experience'
                    ? 'Total Internships'
                    : activeTab === 'projects'
                    ? 'Total Projects'
                    : 'Total Skills Logged'}
                </span>
              </div>
              <div className="sae-metric-sub">
                {activeTab === 'experience'
                  ? `${verifiedSkillsCount} Skills • ${verifiedProjectsCount} Projects`
                  : activeTab === 'projects'
                  ? `${verifiedSkillsCount} Skills • ${verifiedInternshipsCount} Internships`
                  : `${verifiedProjectsCount} Projects • ${verifiedInternshipsCount} Internships`}
              </div>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
              <form ref={addSkillFormRef} className="sae-form-card" onSubmit={handleCreateSkill}>
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
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        handleFileSelect(file)
                      }}
                    />

                    {!certificateFile ? (
                      <div
                        className={`sae-upload-box ${isDragOver ? 'dragover' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setIsDragOver(true)
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault()
                          setIsDragOver(false)
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          setIsDragOver(false)
                          const file = e.dataTransfer.files?.[0] || null
                          handleFileSelect(file)
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            fileInputRef.current?.click()
                          }
                        }}
                        aria-label="Upload Certificate"
                      >
                        <div className="sae-upload-icon-circle">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <div className="sae-upload-title">Upload Certificate</div>
                        <div className="sae-upload-hint">PDF, JPG or PNG • Max 5 MB</div>
                      </div>
                    ) : (
                      <div className="sae-file-card">
                        <div className="sae-file-info">
                          <div className="sae-file-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <line x1="16" y1="13" x2="8" y2="13" />
                              <line x1="16" y1="17" x2="8" y2="17" />
                              <polyline points="10 9 9 9 8 9" />
                            </svg>
                          </div>
                          <div className="sae-file-text">
                            <span className="sae-file-name" title={certificateFile.name}>
                              {certificateFile.name}
                            </span>
                            <span className="sae-file-meta">
                              {(certificateFile.size / (1024 * 1024) >= 1)
                                ? `${(certificateFile.size / (1024 * 1024)).toFixed(2)} MB`
                                : `${(certificateFile.size / 1024).toFixed(1)} KB`} • Ready for Verification
                            </span>
                          </div>
                        </div>
                        <div className="sae-file-actions">
                          <button
                            type="button"
                            className="sae-file-btn sae-file-btn-view"
                            onClick={handleViewCertificate}
                            title="View Certificate"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            View
                          </button>
                          <button
                            type="button"
                            className="sae-file-btn sae-file-btn-replace"
                            onClick={handleReplaceCertificate}
                            title="Replace Certificate"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                            </svg>
                            Replace
                          </button>
                          <button
                            type="button"
                            className="sae-file-btn sae-file-btn-delete"
                            onClick={handleDeleteCertificate}
                            title="Delete Certificate"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
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
            {skills.length === 0 ? (
              !isAddFormOpen ? (
                <div className="sae-empty-state">
                  <div className="sae-empty-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <h3 className="sae-empty-title">
                    No skills submitted yet
                  </h3>
                  <p className="sae-empty-desc">
                    Add and document your academic, technical, managerial, or professional capabilities to submit them for Portal Admin verification.
                  </p>
                  <button
                    type="button"
                    className="sae-btn-add"
                    onClick={() => {
                      setIsAddFormOpen(true)
                      setTimeout(() => {
                        addSkillFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }, 50)
                    }}
                  >
                    + Add Your First Skill
                  </button>
                </div>
              ) : null
            ) : (
              <>
                {filteredSkills.length === 0 ? (
                  <div className="sae-empty-state">
                    <div className="sae-empty-icon">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                    <h3 className="sae-empty-title">
                      No skills match the selected filter
                    </h3>
                    <p className="sae-empty-desc">
                      Try clearing your search query or selecting a different status filter.
                    </p>
                    <button
                      type="button"
                      className="sae-btn-cancel"
                      onClick={() => {
                        setSkillFilter('all')
                        setSearchQuery('')
                      }}
                    >
                      Clear Filters
                    </button>
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
                                {item.certificateFile && (
                                  <span
                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => handleOpenImageModal(item.certificateUrl || '', item.certificateFile)}
                                    title="Click to view certificate"
                                  >
                                    <strong>File:</strong> {item.certificateFile}
                                  </span>
                                )}
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

                {/* Clean '+ Add More Skills' button below the skill list/cards */}
                <div className="sae-add-more-container">
                  <button
                    type="button"
                    className="sae-btn-add-more"
                    onClick={() => {
                      setIsAddFormOpen(true)
                      setTimeout(() => {
                        addSkillFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }, 50)
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    + Add More Skills
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: PROJECTS (FULL IMPLEMENTATION) */}
        {activeTab === 'projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Toolbar: Filter & Add */}
            <div className="sae-toolbar">
              <div className="sae-filter-chips">
                <button
                  type="button"
                  className={`sae-chip ${projectFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setProjectFilter('all')}
                >
                  All Projects <span className="sae-chip-count">{projects.length}</span>
                </button>
                <button
                  type="button"
                  className={`sae-chip ${projectFilter === 'verified' ? 'active' : ''}`}
                  onClick={() => setProjectFilter('verified')}
                >
                  Verified <span className="sae-chip-count">{verifiedProjectsCount}</span>
                </button>
                <button
                  type="button"
                  className={`sae-chip ${projectFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setProjectFilter('pending')}
                >
                  Pending Verification <span className="sae-chip-count">{pendingProjectsCount}</span>
                </button>
                <button
                  type="button"
                  className={`sae-chip ${projectFilter === 'unverified' ? 'active' : ''}`}
                  onClick={() => setProjectFilter('unverified')}
                >
                  Needs Revision <span className="sae-chip-count">{unverifiedProjectsCount}</span>
                </button>
              </div>

              <div className="sae-toolbar-actions">
                <input
                  type="text"
                  className="sae-search-input"
                  placeholder="Search projects by name, type, duration..."
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                />

                <button
                  type="button"
                  className="sae-btn-add"
                  onClick={() => setIsAddProjectFormOpen(!isAddProjectFormOpen)}
                >
                  {isAddProjectFormOpen ? (
                    'Cancel'
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add Project
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ADD PROJECT FORM */}
            {isAddProjectFormOpen && (
              <form ref={addProjectFormRef} className="sae-form-card" onSubmit={handleCreateProject}>
                <div className="sae-form-header">
                  <div className="sae-form-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    Add Project & Submit for Admin Verification
                  </div>
                </div>

                {projectFormError && (
                  <div className="sae-form-alert" role="alert">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{projectFormError}</span>
                  </div>
                )}

                <div className="sae-form-grid">
                  {/* Field 1: Project Name */}
                  <div className="sae-form-field sae-form-field-full">
                    <label>Project Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Autonomous Robotic Rover, Deep Learning Medical Imaging, FinTech Ledger"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>

                  {/* Field 2: Project Type (Software / Hardware) */}
                  <div className="sae-form-field">
                    <label>Project Type *</label>
                    <select
                      required
                      value={projectType}
                      onChange={(e) => {
                        const val = e.target.value
                        setProjectType(val)
                        if (val === 'Hardware') {
                          setProjectLink('')
                        }
                        setProjectFormError('')
                      }}
                    >
                      <option value="">Select Project Type</option>
                      <option value="Software">Software</option>
                      <option value="Hardware">Hardware</option>
                    </select>
                  </div>

                  {/* Field 3: Project Participation (Individual / Team) */}
                  <div className="sae-form-field">
                    <label>Project Participation *</label>
                    <select
                      required
                      value={projectParticipation}
                      onChange={(e) => setProjectParticipation(e.target.value)}
                    >
                      <option value="">Select Participation</option>
                      <option value="Individual">Individual</option>
                      <option value="Team">Team</option>
                    </select>
                  </div>

                  {/* Field 4: Project Duration */}
                  <div className="sae-form-field">
                    <label>Project Duration *</label>
                    <select
                      required
                      value={projectDuration}
                      onChange={(e) => {
                        setProjectDuration(e.target.value)
                        if (e.target.value !== 'Other') setCustomProjectDuration('')
                      }}
                    >
                      <option value="">Select Project Duration</option>
                      <option value="1 Month">1 Month</option>
                      <option value="2 Months">2 Months</option>
                      <option value="3 Months">3 Months</option>
                      <option value="6 Months">6 Months</option>
                      <option value="1 Year">1 Year</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Custom Duration if Other */}
                  {projectDuration === 'Other' && (
                    <div className="sae-form-field">
                      <label>Custom Duration *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5 Months, 45 Days, 8 Weeks"
                        value={customProjectDuration}
                        onChange={(e) => setCustomProjectDuration(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Field 5: Project Link (Shown and required ONLY for Software projects; completely hidden for Hardware) */}
                  {projectType === 'Software' && (
                    <div className="sae-form-field sae-form-field-full">
                      <label>Project Link *</label>
                      <input
                        type="url"
                        required
                        placeholder="https://github.com/... or https://demo.app/..."
                        value={projectLink}
                        onChange={(e) => setProjectLink(e.target.value)}
                      />
                      <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 4 }}>
                        Mandatory for Software projects (Repository, Live Demo, or Deployment URL)
                      </span>
                    </div>
                  )}

                  {/* Field 6: Project Preview Images (Multiple Allowed, + Add More, View/Replace/Delete) */}
                  <div className="sae-form-field sae-form-field-full">
                    <label>
                      Project Preview Images * (Screenshots or Photos)
                      {projectImageFiles.length > 0 && (
                        <span style={{ marginLeft: 8, fontSize: '0.76rem', color: '#166534', fontWeight: 600 }}>
                          ({projectImageFiles.length} {projectImageFiles.length === 1 ? 'image' : 'images'} added)
                        </span>
                      )}
                    </label>

                    {/* Hidden main file input for uploading one or multiple images */}
                    <input
                      ref={projectImageInputRef}
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleProjectImageSelect(e.target.files)
                          e.target.value = ''
                        }
                      }}
                    />

                    {/* Hidden file input for replacing a specific image */}
                    <input
                      ref={replaceImageInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        if (file && replacingImageId) {
                          handleReplaceProjectImage(replacingImageId, file)
                          setReplacingImageId(null)
                        }
                        e.target.value = ''
                      }}
                    />

                    {projectImageFiles.length === 0 ? (
                      <div
                        className={`sae-upload-box ${isProjectImageDragOver ? 'dragover' : ''}`}
                        onClick={() => projectImageInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setIsProjectImageDragOver(true)
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault()
                          setIsProjectImageDragOver(false)
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          setIsProjectImageDragOver(false)
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            handleProjectImageSelect(e.dataTransfer.files)
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            projectImageInputRef.current?.click()
                          }
                        }}
                        aria-label="Upload Project Preview Images"
                      >
                        <div className="sae-upload-icon-circle">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                        <div className="sae-upload-title">Upload Project Preview Images (Multiple Allowed)</div>
                        <div className="sae-upload-hint">PNG, JPG, JPEG or WEBP screenshots/photos • Up to 5 MB each • Drag & drop multiple files</div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {projectImageFiles.map((img, idx) => (
                          <div key={img.id} className="sae-file-card">
                            <div className="sae-file-info">
                              {img.previewUrl ? (
                                <img
                                  src={img.previewUrl}
                                  alt={`Preview ${idx + 1}`}
                                  style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 4, border: '1px solid #cbd5e1', cursor: 'pointer', flexShrink: 0 }}
                                  onClick={() => handleOpenImageModal(img.previewUrl, img.name)}
                                  title="Click to view full preview image"
                                />
                              ) : (
                                <div className="sae-file-icon">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                  </svg>
                                </div>
                              )}
                              <div className="sae-file-text">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                  <span className="sae-file-name" title={img.name}>
                                    {img.name}
                                  </span>
                                  <span style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    background: idx === 0 ? '#dbeafe' : '#f1f5f9',
                                    color: idx === 0 ? '#1d4ed8' : '#475569',
                                    padding: '1px 6px',
                                    borderRadius: 3,
                                  }}>
                                    {idx === 0 ? 'Primary Cover' : `Image #${idx + 1}`}
                                  </span>
                                </div>
                                <span className="sae-file-meta">
                                  {img.size / (1024 * 1024) >= 1
                                    ? `${(img.size / (1024 * 1024)).toFixed(2)} MB`
                                    : `${(img.size / 1024).toFixed(1)} KB`} • Preview Attached
                                </span>
                              </div>
                            </div>
                            <div className="sae-file-actions">
                              {img.previewUrl && (
                                <button
                                  type="button"
                                  className="sae-file-btn sae-file-btn-view"
                                  onClick={() => handleOpenImageModal(img.previewUrl, img.name)}
                                  title="View full-size image"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                  View
                                </button>
                              )}
                              <button
                                type="button"
                                className="sae-file-btn sae-file-btn-replace"
                                onClick={() => {
                                  setReplacingImageId(img.id)
                                  replaceImageInputRef.current?.click()
                                }}
                                title="Replace this image"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <polyline points="1 4 1 10 7 10" />
                                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                                </svg>
                                Replace
                              </button>
                              <button
                                type="button"
                                className="sae-file-btn sae-file-btn-delete"
                                onClick={() => handleDeleteProjectImage(img.id)}
                                title="Delete this image"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Clear '+ Add More' Option to upload additional images */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="sae-btn-add-img-more"
                            onClick={() => projectImageInputRef.current?.click()}
                            title="Add more preview images or screenshots"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            + Add More Images
                          </button>
                          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            You can add as many relevant preview images as needed.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Field 7: Project Documentation* (report/document) */}
                  <div className="sae-form-field sae-form-field-full">
                    <label>Project Documentation * (Project Report or Document)</label>
                    <input
                      ref={projectDocInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.zip"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        handleProjectDocSelect(file)
                      }}
                    />
                    {!projectDocFile ? (
                      <div
                        className={`sae-upload-box ${isProjectDocDragOver ? 'dragover' : ''}`}
                        onClick={() => projectDocInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setIsProjectDocDragOver(true)
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault()
                          setIsProjectDocDragOver(false)
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          setIsProjectDocDragOver(false)
                          const file = e.dataTransfer.files?.[0] || null
                          handleProjectDocSelect(file)
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            projectDocInputRef.current?.click()
                          }
                        }}
                        aria-label="Upload Project Documentation"
                      >
                        <div className="sae-upload-icon-circle">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                        </div>
                        <div className="sae-upload-title">Upload Project Documentation</div>
                        <div className="sae-upload-hint">PDF, DOC, DOCX, TXT or ZIP report • Max 10 MB</div>
                      </div>
                    ) : (
                      <div className="sae-file-card">
                        <div className="sae-file-info">
                          <div className="sae-file-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <div className="sae-file-text">
                            <span className="sae-file-name" title={projectDocFile.name}>
                              {projectDocFile.name}
                            </span>
                            <span className="sae-file-meta">
                              {(projectDocFile.size / (1024 * 1024) >= 1)
                                ? `${(projectDocFile.size / (1024 * 1024)).toFixed(2)} MB`
                                : `${(projectDocFile.size / 1024).toFixed(1)} KB`} • Report Attached
                            </span>
                          </div>
                        </div>
                        <div className="sae-file-actions">
                          <button
                            type="button"
                            className="sae-file-btn sae-file-btn-view"
                            onClick={handleViewProjectDoc}
                            title="View Document"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            View
                          </button>
                          <button
                            type="button"
                            className="sae-file-btn sae-file-btn-replace"
                            onClick={() => projectDocInputRef.current?.click()}
                            title="Replace Document"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <polyline points="1 4 1 10 7 10" />
                              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                            </svg>
                            Replace
                          </button>
                          <button
                            type="button"
                            className="sae-file-btn sae-file-btn-delete"
                            onClick={handleDeleteProjectDoc}
                            title="Delete Document"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="sae-form-actions">
                  <button
                    type="button"
                    className="sae-btn-cancel"
                    onClick={() => setIsAddProjectFormOpen(false)}
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

            {/* PROJECTS LISTING */}
            {projects.length === 0 ? (
              !isAddProjectFormOpen ? (
                <div className="sae-empty-state">
                  <div className="sae-empty-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h3 className="sae-empty-title">
                    No projects submitted yet
                  </h3>
                  <p className="sae-empty-desc">
                    Document your academic, capstone, innovation, or research projects and submit them for Portal Admin verification.
                  </p>
                  <button
                    type="button"
                    className="sae-btn-add"
                    onClick={() => {
                      setIsAddProjectFormOpen(true)
                      setTimeout(() => {
                        addProjectFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }, 50)
                    }}
                  >
                    + Add Your First Project
                  </button>
                </div>
              ) : null
            ) : (
              <>
                {filteredProjects.length === 0 ? (
                  <div className="sae-empty-state">
                    <div className="sae-empty-icon">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                    <h3 className="sae-empty-title">
                      No projects match the selected filter
                    </h3>
                    <p className="sae-empty-desc">
                      Try clearing your search query or selecting a different status filter.
                    </p>
                    <button
                      type="button"
                      className="sae-btn-cancel"
                      onClick={() => {
                        setProjectFilter('all')
                        setProjectSearchQuery('')
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="sae-projects-grid">
                    {filteredProjects.map((item) => {
                      const isVerified = item.verified || item.status === 'verified'
                      const isRejected = item.status === 'rejected'
                      const cardClass = isVerified ? 'is-verified' : isRejected ? 'is-unverified' : 'is-pending'

                      return (
                        <article key={item.id} className={`sae-project-card ${cardClass}`}>
                          <div className="sae-project-header">
                            <div>
                              <h3 className="sae-project-name">{item.name || item.title}</h3>
                              <div className="sae-project-badges-row">
                                <span className={`sae-badge-type ${(item.type || 'software').toLowerCase()}`}>
                                  {item.type || 'Software'}
                                </span>
                                <span className="sae-badge-part">
                                  {item.participation || 'Individual'}
                                </span>
                              </div>
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

                          {/* Duration Row */}
                          <div className="sae-project-meta-row">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span><strong>Duration:</strong> {item.duration || 'Not specified'}</span>
                          </div>

                          {/* Project Preview Image(s) */}
                          {((item.previewImages && item.previewImages.length > 0) || item.previewImageUrl || item.previewImage) && (
                            <div className="sae-project-preview-wrap">
                              {((item.previewImages && item.previewImages[0]?.url) || item.previewImageUrl) ? (
                                <img
                                  src={(item.previewImages && item.previewImages[0]?.url) || item.previewImageUrl}
                                  alt={item.name || 'Project preview'}
                                  className="sae-project-preview-img"
                                  onClick={() => handleOpenImageModal((item.previewImages && item.previewImages[0]?.url) || item.previewImageUrl, (item.previewImages && item.previewImages[0]?.name) || item.name || 'Project Preview')}
                                  title="Click to view full preview image"
                                />
                              ) : (
                                <div className="sae-project-img-placeholder">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                  </svg>
                                  <span>{item.previewImage}</span>
                                </div>
                              )}
                              {item.previewImages && item.previewImages.length > 1 && (
                                <div style={{ display: 'flex', gap: 6, padding: '7px 10px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', alignItems: 'center', overflowX: 'auto' }}>
                                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', whiteSpace: 'nowrap' }}>
                                    📷 {item.previewImages.length} Images:
                                  </span>
                                  {item.previewImages.map((pImg, pIdx) => (
                                    <img
                                      key={pIdx}
                                      src={pImg.url}
                                      alt={`Thumbnail ${pIdx + 1}`}
                                      style={{ width: 30, height: 30, objectFit: 'cover', borderRadius: 4, border: '1px solid #cbd5e1', cursor: 'pointer', flexShrink: 0 }}
                                      onClick={() => handleOpenImageModal(pImg.url, pImg.name || `${item.name || 'Project'} Preview #${pIdx + 1}`)}
                                      title={`View preview image #${pIdx + 1} (${pImg.name})`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Project Documentation */}
                          <div className="sae-project-doc-box">
                            <div className="sae-project-doc-header">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                              <span className="sae-project-doc-name" title={item.documentationFile || item.documentFile}>
                                {item.documentationFile || item.documentFile || 'Project Documentation'}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="sae-project-doc-badge"
                              onClick={() => handleOpenImageModal(item.documentationUrl || '', item.documentationFile || item.documentFile || 'Project Documentation')}
                              title="Click to view project documentation"
                            >
                              View Document ↗
                            </button>
                          </div>

                          {/* Project Link if available */}
                          {(item.url || item.link) && (
                            <a
                              href={item.url || item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="sae-cred-verify-link"
                              title="Open project repository or live site"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                              Open Project Online ↗
                            </a>
                          )}

                          {/* Status Note */}
                          <div className={`sae-card-status-note ${cardClass}`}>
                            {isVerified ? (
                              <span>
                                <strong>Official Item:</strong> Verified by Portal Admin. Counted in official academic profile.
                              </span>
                            ) : isRejected ? (
                              <span>
                                <strong>Admin Review:</strong> {item.rejectionReason || 'Project documentation could not be verified. Please update project details.'}
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

                {/* Clean '+ Add More Projects' button below the project list/cards */}
                <div className="sae-add-more-container">
                  <button
                    type="button"
                    className="sae-btn-add-more"
                    onClick={() => {
                      setIsAddProjectFormOpen(true)
                      setTimeout(() => {
                        addProjectFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }, 50)
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    + Add More Projects
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 3: INTERNSHIPS & EXPERIENCE */}
        {activeTab === 'experience' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Toolbar: Filter & Add */}
            <div className="sae-toolbar">
              <div className="sae-filter-chips">
                <button
                  type="button"
                  className={`sae-chip ${internshipFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setInternshipFilter('all')}
                >
                  All Internships <span className="sae-chip-count">{internships.length}</span>
                </button>
                <button
                  type="button"
                  className={`sae-chip ${internshipFilter === 'verified' ? 'active' : ''}`}
                  onClick={() => setInternshipFilter('verified')}
                >
                  Verified <span className="sae-chip-count">{verifiedInternshipsCount}</span>
                </button>
                <button
                  type="button"
                  className={`sae-chip ${internshipFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setInternshipFilter('pending')}
                >
                  Pending Verification <span className="sae-chip-count">{pendingInternshipsCount}</span>
                </button>
                <button
                  type="button"
                  className={`sae-chip ${internshipFilter === 'unverified' ? 'active' : ''}`}
                  onClick={() => setInternshipFilter('unverified')}
                >
                  Needs Revision <span className="sae-chip-count">{unverifiedInternshipsCount}</span>
                </button>
              </div>

              <div className="sae-toolbar-actions">
                <input
                  type="text"
                  className="sae-search-input"
                  placeholder="Search by company, role, type..."
                  value={internshipSearchQuery}
                  onChange={(e) => setInternshipSearchQuery(e.target.value)}
                />

                <button
                  type="button"
                  className="sae-btn-add"
                  onClick={() => {
                    if (isAddInternshipFormOpen) {
                      resetInternshipForm()
                    } else {
                      setIsAddInternshipFormOpen(true)
                      setTimeout(() => {
                        addInternshipFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }, 50)
                    }
                  }}
                >
                  {isAddInternshipFormOpen ? (
                    'Cancel'
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add Internship
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ADD INTERNSHIP FORM */}
            {isAddInternshipFormOpen && (
              <form ref={addInternshipFormRef} className="sae-form-card" onSubmit={handleCreateInternship}>
                <div className="sae-form-header">
                  <div className="sae-form-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    Add Internship & Submit for Admin Verification
                  </div>
                </div>

                {internshipFormError && (
                  <div className="sae-form-alert" role="alert">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{internshipFormError}</span>
                  </div>
                )}

                <div className="sae-form-grid">
                  {/* Field 1: Internship Title* */}
                  <div className="sae-form-field">
                    <label>Internship Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Summer Research Internship, Frontend Engineering Intern"
                      value={internshipTitle}
                      onChange={(e) => {
                        setInternshipTitle(e.target.value)
                        setInternshipFormError('')
                      }}
                    />
                  </div>

                  {/* Field 2: Organization / Company Name* */}
                  <div className="sae-form-field">
                    <label>Organization / Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Google, Tata Consultancy, ISRO, Siemens, Hospital / Lab"
                      value={internshipOrg}
                      onChange={(e) => {
                        setInternshipOrg(e.target.value)
                        setInternshipFormError('')
                      }}
                    />
                  </div>

                  {/* Field 3: Domain / Field* */}
                  <div className="sae-form-field">
                    <label>Domain / Field *</label>
                    <select
                      required
                      value={internshipDomain}
                      onChange={(e) => {
                        const val = e.target.value
                        setInternshipDomain(val)
                        if (val !== 'Other') setCustomInternshipDomain('')
                        setInternshipFormError('')
                      }}
                    >
                      <option value="">Select Domain / Field</option>
                      <option value="Computer Science & IT">Computer Science & IT</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Mechanical & Manufacturing">Mechanical & Manufacturing</option>
                      <option value="Civil & Infrastructure">Civil & Infrastructure</option>
                      <option value="Electrical & Power Systems">Electrical & Power Systems</option>
                      <option value="Chemical & Materials Science">Chemical & Materials Science</option>
                      <option value="Biotechnology & Healthcare">Biotechnology & Healthcare</option>
                      <option value="Data Science & AI / ML">Data Science & AI / ML</option>
                      <option value="Business, Finance & Commerce">Business, Finance & Commerce</option>
                      <option value="Design, Architecture & Media">Design, Architecture & Media</option>
                      <option value="Operations & Supply Chain">Operations & Supply Chain</option>
                      <option value="Scientific Research & Lab Tenure">Scientific Research & Lab Tenure</option>
                      <option value="Law, Governance & Social Impact">Law, Governance & Social Impact</option>
                      <option value="Other">Other Domain (Specify below)</option>
                    </select>
                  </div>

                  {/* Field 4: Internship Type* — On-site / Remote / Hybrid */}
                  <div className="sae-form-field">
                    <label>Internship Type *</label>
                    <select
                      required
                      value={internshipType}
                      onChange={(e) => {
                        setInternshipType(e.target.value)
                        setInternshipFormError('')
                      }}
                    >
                      <option value="">Select Internship Type</option>
                      <option value="On-site">On-site</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  {/* Custom Domain input if 'Other' selected */}
                  {internshipDomain === 'Other' && (
                    <div className="sae-form-field sae-form-field-full">
                      <label>Specify Domain / Field *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aerospace Engineering, Environmental Sciences, Robotics"
                        value={customInternshipDomain}
                        onChange={(e) => {
                          setCustomInternshipDomain(e.target.value)
                          setInternshipFormError('')
                        }}
                      />
                    </div>
                  )}

                  {/* Field 5: Start Date* */}
                  <div className="sae-form-field">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      required
                      value={internshipStartDate}
                      onChange={(e) => {
                        setInternshipStartDate(e.target.value)
                        setInternshipFormError('')
                      }}
                    />
                  </div>

                  {/* Field 6: End Date* */}
                  <div className="sae-form-field">
                    <label>End Date *</label>
                    <input
                      type="date"
                      required
                      min={internshipStartDate || undefined}
                      value={internshipEndDate}
                      onChange={(e) => {
                        setInternshipEndDate(e.target.value)
                        setInternshipFormError('')
                      }}
                    />
                  </div>

                  {/* Field 7: Internship Role* */}
                  <div className="sae-form-field">
                    <label>Internship Role *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Software Engineer Intern, Research Assistant, Trainee"
                      value={internshipRole}
                      onChange={(e) => {
                        setInternshipRole(e.target.value)
                        setInternshipFormError('')
                      }}
                    />
                  </div>

                  {/* Field 8: Certificate Link* */}
                  <div className="sae-form-field">
                    <label>Certificate Link *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://... (e.g. verification portal URL or drive link)"
                      value={internshipCertLink}
                      onChange={(e) => {
                        setInternshipCertLink(e.target.value)
                        setInternshipFormError('')
                      }}
                    />
                  </div>

                  {/* Field 9: Internship Certificate* — required upload */}
                  <div className="sae-form-field sae-form-field-full">
                    <label>Internship Certificate * (Official Certificate / Completion Document)</label>
                    <input
                      ref={internshipCertInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        handleInternshipCertSelect(file)
                      }}
                    />
                    {!internshipCertFile ? (
                      <div
                        className={`sae-upload-box ${isInternshipCertDragOver ? 'dragover' : ''}`}
                        onClick={() => internshipCertInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setIsInternshipCertDragOver(true)
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault()
                          setIsInternshipCertDragOver(false)
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          setIsInternshipCertDragOver(false)
                          const file = e.dataTransfer.files?.[0] || null
                          handleInternshipCertSelect(file)
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            internshipCertInputRef.current?.click()
                          }
                        }}
                        aria-label="Upload Internship Certificate"
                      >
                        <div className="sae-upload-icon-circle">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                        </div>
                        <div className="sae-upload-title">Upload Internship Certificate</div>
                        <div className="sae-upload-hint">PDF, DOC, DOCX, JPG, PNG or WEBP • Max 10 MB</div>
                      </div>
                    ) : (
                      <div className="sae-file-card">
                        <div className="sae-file-info">
                          {internshipCertPreviewUrl && (internshipCertFile.type?.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(internshipCertFile.name)) ? (
                            <img
                              src={internshipCertPreviewUrl}
                              alt="Certificate preview"
                              style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 4, border: '1px solid #cbd5e1', flexShrink: 0 }}
                            />
                          ) : (
                            <div className="sae-file-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                            </div>
                          )}
                          <div className="sae-file-text">
                            <span
                              className="sae-file-name"
                              title={internshipCertFile.name}
                            >
                              {internshipCertFile.name}
                            </span>
                            <span className="sae-file-meta">
                              {internshipCertFile.size > 1024 * 1024
                                ? `${(internshipCertFile.size / (1024 * 1024)).toFixed(2)} MB`
                                : `${(internshipCertFile.size / 1024).toFixed(1)} KB`} • Certificate Attached
                            </span>
                          </div>
                        </div>
                        <div className="sae-file-actions">
                          <button
                            type="button"
                            className="sae-file-btn sae-file-btn-view"
                            onClick={handleViewInternshipCert}
                            title="View Certificate"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            View
                          </button>
                          <button
                            type="button"
                            className="sae-file-btn sae-file-btn-replace"
                            onClick={() => internshipCertInputRef.current?.click()}
                            title="Replace Certificate"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="1 4 1 10 7 10" />
                              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                            </svg>
                            Replace
                          </button>
                          <button
                            type="button"
                            className="sae-file-btn sae-file-btn-delete"
                            onClick={handleDeleteInternshipCert}
                            title="Delete Certificate"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="sae-form-actions">
                  <button
                    type="button"
                    className="sae-btn-cancel"
                    onClick={resetInternshipForm}
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

            {/* INTERNSHIPS LISTING */}
            {internships.length === 0 ? (
              !isAddInternshipFormOpen ? (
                <div className="sae-empty-state">
                  <div className="sae-empty-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <h3 className="sae-empty-title">
                    No internships submitted yet
                  </h3>
                  <p className="sae-empty-desc">
                    Log your industrial training, company roles, research fellowships, or clinic tenures and submit them for Portal Admin verification.
                  </p>
                  <button
                    type="button"
                    className="sae-btn-add"
                    onClick={() => {
                      setIsAddInternshipFormOpen(true)
                      setTimeout(() => {
                        addInternshipFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }, 50)
                    }}
                  >
                    + Add Your First Internship
                  </button>
                </div>
              ) : null
            ) : (
              <>
                {filteredInternships.length === 0 ? (
                  <div className="sae-empty-state">
                    <div className="sae-empty-icon">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                    <h3 className="sae-empty-title">
                      No internships match the selected filter
                    </h3>
                    <p className="sae-empty-desc">
                      Try clearing your search query or selecting a different status filter.
                    </p>
                    <button
                      type="button"
                      className="sae-btn-cancel"
                      onClick={() => {
                        setInternshipFilter('all')
                        setInternshipSearchQuery('')
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="sae-projects-grid">
                    {filteredInternships.map((item) => {
                      const isVerified = item.verified || item.status === 'verified'
                      const isRejected = item.status === 'rejected'
                      const cardClass = isVerified ? 'is-verified' : isRejected ? 'is-unverified' : 'is-pending'

                      return (
                        <article key={item.id} className={`sae-project-card ${cardClass}`}>
                          <div className="sae-project-header">
                            <div>
                              <h3 className="sae-project-name">{item.title || item.organization}</h3>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, fontSize: '0.86rem', color: '#334155', fontWeight: 600 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M3 21h18M3 7v14M21 7v14M6 10h2M6 14h2M6 18h2M10 10h2M10 14h2M10 18h2M14 10h2M14 14h2M14 18h2M18 10h2M18 14h2M18 18h2M9 3h6v4H9z" />
                                </svg>
                                <span>{item.organization || item.company}</span>
                              </div>
                              <div className="sae-project-badges-row" style={{ marginTop: 6 }}>
                                {item.domain && <span className="sae-badge-type hardware">{item.domain}</span>}
                                <span className="sae-badge-type software">{item.type || 'Internship'}</span>
                              </div>
                            </div>
                            <span className={`sae-status-badge ${isVerified ? 'verified' : isRejected ? 'unverified' : 'pending'}`}>
                              {isVerified ? 'Verified' : isRejected ? 'Needs Revision' : 'Pending Verification'}
                            </span>
                          </div>

                          <div className="sae-project-meta-row">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                            <span><strong>Role:</strong> {item.role}</span>
                          </div>

                          <div className="sae-project-meta-row">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span>
                              <strong>Duration:</strong> {item.startDate && item.endDate ? `${item.startDate} to ${item.endDate} (${item.duration})` : item.duration || 'Completed'}
                            </span>
                          </div>

                          {/* Certificate Document */}
                          <div className="sae-project-doc-box">
                            <div className="sae-project-doc-header">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                              <span className="sae-project-doc-name" title={item.certificateFile || item.documentFile}>
                                {item.certificateFile || item.documentFile || 'Internship Certificate'}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="sae-project-doc-badge"
                              onClick={() => handleOpenImageModal(item.certificateUrl || '', item.certificateFile || item.documentFile || 'Internship Certificate')}
                              title="Click to view internship certificate"
                            >
                              View Certificate ↗
                            </button>
                          </div>

                          {/* Certificate Link */}
                          {item.certificateLink && (
                            <a
                              href={item.certificateLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="sae-project-link-btn"
                              title="Verify certificate credential online"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                              Open Certificate Link ↗
                            </a>
                          )}

                          {/* Status Note */}
                          <div className={`sae-card-status-note ${cardClass}`}>
                            {isVerified ? (
                              <span>
                                <strong>Officially Verified:</strong> Authenticated by Portal Admin. Counted in official student academic profile.
                              </span>
                            ) : isRejected ? (
                              <span>
                                <strong>Admin Review:</strong> {item.rejectionReason || 'Internship documentation could not be verified. Please update details.'}
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

                {/* Clean '+ Add More Internships' button below list/cards */}
                <div className="sae-add-more-container">
                  <button
                    type="button"
                    className="sae-btn-add-more"
                    onClick={() => {
                      setIsAddInternshipFormOpen(true)
                      setTimeout(() => {
                        addInternshipFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }, 50)
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    + Add More Internships
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Reusable In-Page Preview Modal for Skills, Projects, and Internships */}
      {viewingModalImage && (
        <div
          className="sae-img-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Preview Modal"
        >
          <div className="sae-img-modal-card">
            <div className="sae-img-modal-header">
              <div className="sae-img-modal-title">
                {(() => {
                  const name = (viewingModalImage.name || '').toLowerCase()
                  const isDoc = name.endsWith('.pdf') || name.endsWith('.doc') || name.endsWith('.docx') || name.endsWith('.txt') || name.endsWith('.zip') || !viewingModalImage.url
                  if (isDoc) {
                    return (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    )
                  }
                  return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  )
                })()}
                <span className="sae-img-modal-filename" title={viewingModalImage.name}>
                  {viewingModalImage.name || 'Preview Document'}
                </span>
              </div>
              <button
                type="button"
                className="sae-img-modal-close"
                onClick={handleCloseImageModal}
                title="Close preview (Esc)"
                aria-label="Close modal"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="sae-img-modal-body">
              {(() => {
                const name = (viewingModalImage.name || '').toLowerCase()
                const isPdf = name.endsWith('.pdf')
                const isDoc = name.endsWith('.doc') || name.endsWith('.docx') || name.endsWith('.txt') || name.endsWith('.zip') || !viewingModalImage.url

                if (isPdf && viewingModalImage.url) {
                  return (
                    <iframe
                      src={viewingModalImage.url}
                      title={viewingModalImage.name || 'Document PDF Preview'}
                      sandbox="allow-same-origin"
                      style={{
                        width: '100%',
                        height: 'calc(90vh - 160px)',
                        minHeight: '440px',
                        border: 'none',
                        borderRadius: '6px',
                        background: '#ffffff'
                      }}
                    />
                  )
                }

                if (isDoc) {
                  return (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '48px 24px',
                      textAlign: 'center',
                      color: '#f8fafc',
                      gap: 16
                    }}>
                      <div style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: 'rgba(56, 189, 248, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#38bdf8'
                      }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>
                          {viewingModalImage.name}
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
                          Official Document Attached • Ready for Portal Verification
                        </div>
                      </div>
                    </div>
                  )
                }

                return (
                  <img
                    src={viewingModalImage.url}
                    alt={viewingModalImage.name || 'Full Preview'}
                    className="sae-img-modal-image"
                  />
                )
              })()}
            </div>
            <div className="sae-img-modal-footer">
              <span className="sae-img-modal-hint">In-Page Document & Image Preview</span>
              <button
                type="button"
                className="sae-btn-cancel"
                style={{ padding: '6px 16px', fontSize: '0.82rem' }}
                onClick={handleCloseImageModal}
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
