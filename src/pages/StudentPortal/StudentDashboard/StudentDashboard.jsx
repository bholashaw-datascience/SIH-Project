import { useState, useEffect, useRef } from 'react'
import ProfilePhotoLightbox from './ProfilePhotoLightbox'
import NotificationsModal from './NotificationsModal'
import AcademicDetailsModal from './AcademicDetailsModal'
import SkillsProjectsModal from './SkillsProjectsModal'
import PublicPostModal from './PublicPostModal'
import InternshipsPlacementsModal from './InternshipsPlacementsModal'
import SkillAssessmentsModal from './SkillAssessmentsModal'
import ChangePasswordModal from './ChangePasswordModal'

const EMPTY_OBJ = {}

export default function StudentDashboard({
  student = EMPTY_OBJ,
  verifiedProfile = EMPTY_OBJ,
  hasPendingChanges = false,
  onEditProfile,
  onViewPendingDiff,
  onNavigateHome,
  onLogout,
  onOpenAchievementsExperience,
  onOpenPublicPost,
  onOpenInternships,
  onOpenPlacements,
  verificationStatus = 'approved',
  rejectionReason = '',
}) {
  // Merged student data: real application data with clean fallbacks
  const s = {
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    dob: student?.dob || '',
    gender: student?.gender || '',
    presentAddress: student?.presentAddress || '',
    permanentAddress: student?.permanentAddress || '',
    institution: student?.institution || '',
    course: student?.course || student?.branch || '',
    year: student?.year || student?.currentYear || '',
    semester: student?.semester || student?.currentSemester || '',
    collegeRollNo: student?.collegeRoll || student?.collegeRollNo || '',
    universityRollNo: student?.universityRoll || student?.universityRollNo || student?.enrollmentId || '',
    admissionYear: student?.admissionYear || '',
    admissionCourse: student?.admissionCourse || '',
    completionYear: student?.completionYear || '',
    sgpa: student?.sgpa || '',
    ygpa: student?.ygpa || '',
    cgpa: student?.cgpa || '',
    profilePic: student?.profilePic || verifiedProfile?.formData?.profilePic || '',
  }

  // Modals state
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isAcadOpen, setIsAcadOpen] = useState(false)
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false)
  const [skillsInitialTab, setSkillsInitialTab] = useState('skills')
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [isInternshipsModalOpen, setIsInternshipsModalOpen] = useState(false)
  const [isAssessmentsModalOpen, setIsAssessmentsModalOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

  // Mobile sidebar toggle state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('')

  // Profile dropdown menu state
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)

  // Close profile dropdown on outside click or Escape key
  useEffect(() => {
    if (!isProfileMenuOpen) return

    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isProfileMenuOpen])

  // State for skills, projects, internships, posts, and notifications
  const [skills, setSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_skills')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_projects')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [internships, setInternships] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_internships')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_posts')
      if (saved) {
        const parsed = JSON.parse(saved)
        return (Array.isArray(parsed) ? parsed : []).filter(
          (p) => p && !p.id?.startsWith('post_sample_')
        )
      }
      return []
    } catch {
      return []
    }
  })

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_notifications')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Read application counts from actual application state
  const appliedInternshipsCount = (() => {
    try {
      const list = JSON.parse(localStorage.getItem('udaan_student_internship_applications') || '[]')
      return Array.isArray(list) ? list.length : 0
    } catch {
      return 0
    }
  })()

  const appliedPlacementsCount = (() => {
    try {
      const list = JSON.parse(localStorage.getItem('udaan_student_placement_applications') || '[]')
      return Array.isArray(list) ? list.length : 0
    } catch {
      return 0
    }
  })()

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('udaan_student_skills', JSON.stringify(skills))
    } catch {}
  }, [skills])

  useEffect(() => {
    try {
      localStorage.setItem('udaan_student_projects', JSON.stringify(projects))
    } catch {}
  }, [projects])

  useEffect(() => {
    try {
      localStorage.setItem('udaan_student_internships', JSON.stringify(internships))
    } catch {}
  }, [internships])

  useEffect(() => {
    try {
      localStorage.setItem('udaan_student_posts', JSON.stringify(posts))
    } catch {}
  }, [posts])

  useEffect(() => {
    try {
      localStorage.setItem('udaan_student_notifications', JSON.stringify(notifications))
    } catch {}
  }, [notifications])

  // Password change security notification handler
  const handlePasswordChanged = () => {
    const newNotif = {
      id: `n_${Date.now()}`,
      type: 'success',
      title: 'Security Alert: Password Changed',
      message: 'Your password was changed successfully.',
      timestamp: 'Just now',
      read: false,
    }
    setNotifications((prev) => [newNotif, ...prev])
  }

  // Handlers for adding new items
  const handleAddSkill = (newSkill) => {
    const item = {
      id: `s_${Date.now()}`,
      name: newSkill.name,
      category: newSkill.category,
      level: newSkill.level,
      certificateFile: newSkill.certificateFile,
      verified: false,
      status: 'pending',
    }
    setSkills((prev) => [item, ...prev])

    const notif = {
      id: `n_${Date.now()}`,
      type: 'info',
      title: `Skill Submitted: ${item.name}`,
      message: 'Your skill submission has been queued for verification by Portal Admin.',
      timestamp: 'Just now',
      read: false,
    }
    setNotifications((prev) => [notif, ...prev])
  }

  const handleAddProject = (newProj) => {
    const item = {
      id: `p_${Date.now()}`,
      title: newProj.title,
      techStack: newProj.techStack,
      url: newProj.url,
      description: newProj.description,
      documentFile: newProj.documentFile,
      verified: false,
      status: 'pending',
    }
    setProjects((prev) => [item, ...prev])

    const notif = {
      id: `n_${Date.now()}`,
      type: 'info',
      title: `Project Submitted: ${item.title}`,
      message: 'Your project proof has been forwarded to Portal Admin for verification.',
      timestamp: 'Just now',
      read: false,
    }
    setNotifications((prev) => [notif, ...prev])
  }

  const handleAddInternship = (newIntern) => {
    const item = {
      id: `i_${Date.now()}`,
      company: newIntern.company,
      role: newIntern.role,
      duration: newIntern.duration,
      description: newIntern.description,
      certificateFile: newIntern.certificateFile,
      verified: false,
      status: 'pending',
    }
    setInternships((prev) => [item, ...prev])

    const notif = {
      id: `n_${Date.now()}`,
      type: 'info',
      title: `Internship Experience Submitted: ${item.company}`,
      message: 'Certificate and tenure details submitted to Portal Admin for review.',
      timestamp: 'Just now',
      read: false,
    }
    setNotifications((prev) => [notif, ...prev])
  }

  const handleCreatePost = (postData, isDraft) => {
    const newPost = {
      id: `post_${Date.now()}`,
      title: postData.title || (postData.caption ? postData.caption.slice(0, 45) + '...' : 'Public Post'),
      caption: postData.caption || postData.content || '',
      content: postData.caption || postData.content || '',
      category: postData.category || 'Technical Achievement',
      aspectRatio: postData.aspectRatio || '1:1',
      media: postData.media || [],
      attachment: postData.attachment || (postData.media?.[0]?.name || ''),
      attachmentUrl: postData.attachmentUrl || (postData.media?.[0]?.url || ''),
      attachmentSize: postData.attachmentSize || (postData.media?.[0]?.size || ''),
      attachmentType: postData.attachmentType || (postData.media?.[0]?.type || 'image'),
      author: {
        name: s.name || 'Student Member',
        email: s.email || '',
        avatar: s.profilePic || '',
        institution: s.institution || 'Institutional Member',
        course: s.course || '',
        roll: s.universityRollNo || s.collegeRollNo || '',
      },
      status: isDraft ? 'draft' : 'pending',
      createdAt: new Date().toISOString(),
    }
    setPosts((prev) => [newPost, ...prev])

    if (!isDraft) {
      const notif = {
        id: `n_${Date.now()}`,
        type: 'info',
        title: `Public Post Submitted for Verification`,
        message: 'Your post is under moderation review by IAS Collaboration Portal Admin.',
        timestamp: 'Just now',
        read: false,
      }
      setNotifications((prev) => [notif, ...prev])
    }
  }

  const handleUpdatePost = (updatedPost, isSubmit = false) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === updatedPost.id) {
          return {
            ...p,
            ...updatedPost,
            status: isSubmit ? 'pending' : (updatedPost.status || p.status),
            updatedAt: new Date().toISOString(),
          }
        }
        return p
      })
    )
    if (isSubmit) {
      const notif = {
        id: `n_${Date.now()}`,
        type: 'info',
        title: 'Post Resubmitted for Admin Verification',
        message: 'Your revised post has been resubmitted for moderation review by Portal Admin.',
        timestamp: 'Just now',
        read: false,
      }
      setNotifications((prev) => [notif, ...prev])
    }
  }

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  const handleSubmitPostDraft = (postId) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: 'pending' } : p))
    )
    const notif = {
      id: `n_${Date.now()}`,
      type: 'info',
      title: 'Draft Post Submitted',
      message: 'Your draft post has been submitted for moderation review by IAS Collaboration Portal Admin.',
      timestamp: 'Just now',
      read: false,
    }
    setNotifications((prev) => [notif, ...prev])
  }

  const unreadNotifsCount = notifications.filter((n) => !n.read).length
  const verifiedSkillsCount = skills.filter((sItem) => sItem.verified).length

  const openSkillsTab = (tab) => {
    setSkillsInitialTab(tab)
    setIsSkillsModalOpen(true)
  }

  // Profile Completion Percentage Calculation
  const profileStats = (() => {
    const personalComplete = Boolean(s.name && s.email && s.phone)
    const academicComplete = Boolean(s.institution && s.course && (s.year || s.semester))
    const verificationComplete = Boolean(verificationStatus === 'approved' || verificationStatus === 'verified')
    const skillsComplete = Boolean(skills.length > 0 || projects.length > 0 || internships.length > 0)

    let score = 0
    if (personalComplete) score += 25
    if (academicComplete) score += 25
    if (verificationComplete) score += 25
    if (skillsComplete) score += 25

    return {
      percentage: score,
      personalComplete,
      academicComplete,
      verificationComplete,
      skillsComplete,
    }
  })()

  // Navigation handlers for sidebar & overview cards
  const navigateToInternships = () => {
    if (onOpenInternships) {
      onOpenInternships()
    } else {
      setIsInternshipsModalOpen(true)
    }
  }

  const navigateToPlacements = () => {
    if (onOpenPlacements) {
      onOpenPlacements()
    } else {
      setIsInternshipsModalOpen(true)
    }
  }

  const navigateToAchievements = (tab = 'skills') => {
    if (onOpenAchievementsExperience) {
      onOpenAchievementsExperience(tab)
    } else {
      openSkillsTab(tab)
    }
  }

  const navigateToPublicPosts = () => {
    if (onOpenPublicPost) {
      onOpenPublicPost()
    } else {
      setIsPostModalOpen(true)
    }
  }

  return (
    <div className="sd-app-layout">
      <style>{`
        /* Institutional Full-Page App Layout */
        .sd-app-layout {
          min-height: 100vh;
          background-color: #f6f8fb;
          color: #0f1d2f;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          width: 100%;
        }

        /* Top Bar Header */
        .sd-topbar {
          background-color: #0d1b2a;
          color: #ffffff;
          border-bottom: 2px solid #b3881e;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 1050;
          box-shadow: 0 2px 10px rgba(10, 20, 30, 0.2);
          box-sizing: border-box;
        }

        .sd-topbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .sd-mobile-menu-toggle {
          display: none;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          border-radius: 4px;
          padding: 6px;
          cursor: pointer;
        }

        .sd-brand-identity {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .sd-brand-emblem {
          width: 34px;
          height: 34px;
          border-radius: 6px;
          background: linear-gradient(135deg, #b3881e 0%, #8c681b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.88rem;
          color: #ffffff;
          letter-spacing: 0.04em;
          border: 1px solid rgba(255, 255, 255, 0.25);
          flex-shrink: 0;
        }

        .sd-brand-titles {
          display: flex;
          flex-direction: column;
        }

        .sd-brand-main {
          font-size: 0.96rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #ffffff;
          line-height: 1.2;
        }

        .sd-brand-sub {
          font-size: 0.68rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
        }

        .sd-topbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        /* Search input */
        .sd-search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sd-search-input {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 6px;
          padding: 6px 12px 6px 32px;
          color: #ffffff;
          font-size: 0.82rem;
          width: 200px;
          transition: all 0.2s ease;
          outline: none;
          font-family: inherit;
        }

        .sd-search-input:focus {
          background: rgba(255, 255, 255, 0.14);
          border-color: #b3881e;
          width: 240px;
        }

        .sd-search-input::placeholder {
          color: #94a3b8;
        }

        .sd-search-icon {
          position: absolute;
          left: 10px;
          color: #94a3b8;
          pointer-events: none;
        }

        /* Notification button */
        .sd-icon-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #e2e8f0;
          border-radius: 6px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.15s ease;
        }

        .sd-icon-btn:hover {
          background: rgba(255, 255, 255, 0.16);
          color: #ffffff;
          border-color: #b3881e;
        }

        .sd-badge-counter {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: #dc2626;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          border-radius: 10px;
          padding: 1px 5px;
          border: 1.5px solid #0d1b2a;
          line-height: 1;
        }

        /* User Profile Pill */
        .sd-user-dropdown-wrap {
          position: relative;
        }

        .sd-user-pill-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 20px;
          padding: 3px 12px 3px 4px;
          color: #ffffff;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 600;
          transition: all 0.15s ease;
          font-family: inherit;
        }

        .sd-user-pill-btn:hover,
        .sd-user-pill-btn.is-active {
          background: rgba(255, 255, 255, 0.14);
          border-color: #b3881e;
        }

        .sd-pill-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #1e3a5f;
          color: #f1cf7c;
          border: 1px solid #b3881e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.78rem;
          object-fit: cover;
          flex-shrink: 0;
        }

        /* Profile Dropdown Menu */
        .sd-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
          width: 220px;
          z-index: 1200;
          overflow: hidden;
          animation: sdMenuIn 0.15s ease-out;
        }

        @keyframes sdMenuIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sd-menu-head {
          padding: 12px 14px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .sd-menu-user-name {
          font-weight: 700;
          font-size: 0.88rem;
          color: #0f1d2f;
        }

        .sd-menu-user-sub {
          font-size: 0.72rem;
          color: #64748b;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sd-menu-action {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: transparent;
          border: none;
          color: #334155;
          font-size: 0.82rem;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: background 0.12s ease;
          font-family: inherit;
        }

        .sd-menu-action:hover {
          background: #f1f5f9;
          color: #0f1d2f;
        }

        .sd-menu-action.danger {
          color: #dc2626;
          border-top: 1px solid #f1f5f9;
        }

        .sd-menu-action.danger:hover {
          background: #fef2f2;
        }

        /* Main Workspace: Sidebar + Content Body */
        .sd-body-container {
          display: flex;
          flex: 1;
          width: 100%;
          min-height: calc(100vh - 60px);
          box-sizing: border-box;
          position: relative;
        }

        /* Left Sidebar: Institutional Navy */
        .sd-sidebar {
          width: 240px;
          background-color: #0d1b2a;
          color: #cbd5e1;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          border-right: 1px solid #1e2f42;
          padding: 16px 12px;
          box-sizing: border-box;
          position: sticky;
          top: 60px;
          height: calc(100vh - 60px);
          overflow-y: auto;
        }

        .sd-sidebar-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 8px 12px 6px;
        }

        .sd-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .sd-nav-item-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 9px 12px;
          border-radius: 6px;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
          font-family: inherit;
          box-sizing: border-box;
        }

        .sd-nav-item-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #f1f5f9;
        }

        /* Highlighted Dashboard Item */
        .sd-nav-item-btn.is-active {
          background: rgba(179, 136, 30, 0.16);
          color: #f1cf7c;
          font-weight: 700;
          border-left: 3px solid #b3881e;
        }

        .sd-nav-item-btn svg {
          flex-shrink: 0;
        }

        .sd-sidebar-footer {
          margin-top: auto;
          padding: 12px;
          border-top: 1px solid #1e2f42;
          font-size: 0.72rem;
          color: #64748b;
        }

        .sd-sys-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #10b981;
          font-weight: 600;
          font-size: 0.72rem;
        }

        .sd-sys-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }

        /* Main Content Viewport */
        .sd-main-viewport {
          flex: 1;
          padding: 22px 28px 40px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          box-sizing: border-box;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        /* Section 1: Welcome Header Banner */
        .sd-welcome-card {
          background: linear-gradient(135deg, #0d1b2a 0%, #15283c 100%);
          color: #ffffff;
          border-radius: 8px;
          padding: 18px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-left: 4px solid #b3881e;
          box-shadow: 0 2px 8px rgba(13, 27, 42, 0.08);
          box-sizing: border-box;
        }

        .sd-welcome-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 4px;
          letter-spacing: -0.01em;
        }

        .sd-welcome-sub {
          font-size: 0.82rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .sd-welcome-pill {
          background: rgba(179, 136, 30, 0.2);
          color: #f1cf7c;
          border: 1px solid rgba(179, 136, 30, 0.4);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* Alert Banners (Pending Changes & Rejection) */
        .sd-notice-alert {
          border-radius: 6px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: 0.82rem;
          box-sizing: border-box;
        }

        .sd-notice-alert.pending {
          background-color: #fffbeb;
          border: 1px solid #fde68a;
          border-left: 4px solid #d97706;
          color: #92400e;
        }

        .sd-notice-alert.rejected {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-left: 4px solid #dc2626;
          color: #991b1b;
        }

        .sd-notice-btn {
          background: #ffffff;
          border: 1px solid currentColor;
          color: inherit;
          padding: 5px 12px;
          font-size: 0.78rem;
          font-weight: 700;
          border-radius: 4px;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
        }

        /* Section 2: Quick Overview Stats Grid */
        .sd-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        /* Non-Clickable Card Container */
        .sd-stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(15, 29, 47, 0.04);
          box-sizing: border-box;
          cursor: default;
          user-select: none;
        }

        .sd-stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .sd-stat-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sd-stat-tag {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .sd-stat-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin: 0 0 4px;
        }

        .sd-stat-count {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f1d2f;
          line-height: 1.1;
          margin-bottom: 4px;
        }

        .sd-stat-desc {
          font-size: 0.75rem;
          color: #64748b;
          line-height: 1.35;
          flex: 1;
          margin-bottom: 12px;
        }

        /* Explicit Action Button Inside Stat Card */
        .sd-stat-btn {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-size: 0.76rem;
          font-weight: 700;
          border-radius: 4px;
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
        }

        .sd-stat-btn:hover {
          background: #0d1b2a;
          color: #ffffff;
          border-color: #0d1b2a;
        }

        /* 2-Column Balanced Content Grids */
        .sd-row-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* Standard Institutional Card */
        .sd-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 18px 20px;
          box-shadow: 0 1px 3px rgba(15, 29, 47, 0.04);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          cursor: default;
        }

        .sd-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f1f5f9;
        }

        .sd-card-heading {
          font-size: 0.92rem;
          font-weight: 800;
          color: #0f1d2f;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }

        .sd-card-badge {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
        }

        /* Section 3: Profile Completion Styling */
        .sd-progress-bar-wrap {
          margin-bottom: 14px;
        }

        .sd-progress-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 6px;
          color: #334155;
        }

        .sd-progress-track {
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .sd-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #b3881e 0%, #10b981 100%);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .sd-checklist-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 14px;
        }

        .sd-check-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: #334155;
          padding: 6px 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
        }

        .sd-check-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .sd-check-dot.complete {
          background: #dcfce7;
          color: #166534;
        }

        .sd-check-dot.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .sd-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 7px 14px;
          background: #b3881e;
          color: #ffffff;
          border: 1px solid #997316;
          border-radius: 5px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
          font-family: inherit;
        }

        .sd-btn-primary:hover {
          background: #997316;
        }

        /* Section 4: Academic Performance Summary */
        .sd-acad-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 14px;
        }

        .sd-acad-stat-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px;
          text-align: center;
        }

        .sd-acad-stat-label {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
        }

        .sd-acad-stat-val {
          font-size: 1.18rem;
          font-weight: 800;
          color: #0f1d2f;
          margin: 2px 0;
        }

        .sd-acad-stat-sub {
          font-size: 0.65rem;
          color: #94a3b8;
        }

        .sd-acad-meta-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.78rem;
          margin-bottom: 14px;
        }

        .sd-acad-meta-item {
          display: flex;
          justify-content: space-between;
          color: #475569;
          padding-bottom: 4px;
          border-bottom: 1px dashed #e2e8f0;
        }

        .sd-acad-meta-item:last-child {
          border-bottom: none;
        }

        .sd-acad-meta-item strong {
          color: #0f1d2f;
          font-weight: 600;
        }

        /* Section 5: Upcoming Deadlines & Events */
        .sd-event-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sd-empty-state-box {
          padding: 24px 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 6px;
          color: #64748b;
        }

        .sd-empty-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
        }

        .sd-empty-desc {
          font-size: 0.75rem;
          color: #64748b;
          max-width: 320px;
          line-height: 1.4;
        }

        /* Section 6: Recent Activity */
        .sd-activity-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sd-activity-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.78rem;
        }

        .sd-activity-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #b3881e;
          margin-top: 5px;
          flex-shrink: 0;
        }

        .sd-activity-title {
          font-weight: 700;
          color: #0f1d2f;
          margin-bottom: 2px;
        }

        .sd-activity-meta {
          font-size: 0.7rem;
          color: #64748b;
        }

        /* Section 7: Quick Actions Grid */
        .sd-actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .sd-action-card-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          color: #1e293b;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
          text-align: left;
        }

        .sd-action-card-btn:hover {
          background: #0d1b2a;
          color: #f1cf7c;
          border-color: #0d1b2a;
        }

        .sd-action-card-btn svg {
          flex-shrink: 0;
        }

        /* Section 8: Institutional Verification Area */
        .sd-verify-box {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 6px;
          padding: 12px 16px;
        }

        .sd-seal-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #166534;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sd-verify-title {
          font-size: 0.86rem;
          font-weight: 800;
          color: #166534;
        }

        .sd-verify-sub {
          font-size: 0.75rem;
          color: #15803d;
          margin-top: 2px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1080px) {
          .sd-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .sd-row-grid-2 {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 860px) {
          .sd-sidebar {
            position: fixed;
            top: 60px;
            left: -260px;
            height: calc(100vh - 60px);
            z-index: 1040;
            transition: left 0.25s ease;
            box-shadow: 4px 0 16px rgba(0, 0, 0, 0.3);
          }

          .sd-sidebar.is-open {
            left: 0;
          }

          .sd-mobile-menu-toggle {
            display: flex;
          }

          .sd-search-box {
            display: none;
          }

          .sd-main-viewport {
            padding: 16px;
          }
        }

        @media (max-width: 580px) {
          .sd-stats-grid {
            grid-template-columns: 1fr;
          }
          .sd-checklist-grid {
            grid-template-columns: 1fr;
          }
          .sd-actions-grid {
            grid-template-columns: 1fr;
          }
          .sd-acad-stats-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* TOPBAR HEADER (Requirement 1) */}
      <header className="sd-topbar">
        <div className="sd-topbar-left">
          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="sd-mobile-menu-toggle"
            onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Institutional Brand Identity */}
          <div className="sd-brand-identity" onClick={onNavigateHome} title="Return to Portal Home">
            <div className="sd-brand-emblem">IAS</div>
            <div className="sd-brand-titles">
              <span className="sd-brand-main">IAS Collaboration Portal</span>
              <span className="sd-brand-sub">Student Overview Dashboard</span>
            </div>
          </div>
        </div>

        <div className="sd-topbar-right">
          {/* Search Input Filter */}
          <div className="sd-search-box">
            <svg className="sd-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="sd-search-input"
              placeholder="Search portal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search portal"
            />
          </div>

          {/* Notifications Trigger Button */}
          <button
            type="button"
            className="sd-icon-btn"
            onClick={() => setIsNotifOpen(true)}
            aria-label="View notifications"
            title="Institutional Notifications & Alerts"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadNotifsCount > 0 && (
              <span className="sd-badge-counter">{unreadNotifsCount}</span>
            )}
          </button>

          {/* Profile User Dropdown Pill */}
          <div className="sd-user-dropdown-wrap" ref={profileMenuRef}>
            <button
              type="button"
              className={`sd-user-pill-btn ${isProfileMenuOpen ? 'is-active' : ''}`}
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="true"
              aria-label="User account menu"
            >
              <div className="sd-pill-avatar" onClick={(e) => { e.stopPropagation(); setIsPhotoLightboxOpen(true); }} title="View Photo">
                {s.profilePic ? (
                  <img src={s.profilePic} alt={s.name || 'Student'} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <span>{(s.name || 'S').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span>{s.name || 'Student'}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isProfileMenuOpen && (
              <div className="sd-dropdown-menu" role="menu">
                <div className="sd-menu-head">
                  <div className="sd-menu-user-name">{s.name || 'Student Account'}</div>
                  <div className="sd-menu-user-sub">{s.email || 'student@ias.edu'}</div>
                </div>

                <button
                  type="button"
                  className="sd-menu-action"
                  role="menuitem"
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    if (onEditProfile) onEditProfile()
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  className="sd-menu-action"
                  role="menuitem"
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    setIsChangePasswordOpen(true)
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Change Password</span>
                </button>

                <button
                  type="button"
                  className="sd-menu-action danger"
                  role="menuitem"
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    if (onLogout) {
                      onLogout()
                    } else if (onNavigateHome) {
                      onNavigateHome()
                    }
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* BODY: LEFT SIDEBAR + MAIN VIEWPORT */}
      <div className="sd-body-container">
        {/* Left Sidebar Navigation (Requirement 1) */}
        <aside className={`sd-sidebar ${isMobileSidebarOpen ? 'is-open' : ''}`}>
          <div className="sd-sidebar-label">Navigation Menu</div>
          <nav>
            <ul className="sd-nav-list">
              {/* 1. Dashboard (Active & Highlighted) */}
              <li>
                <button
                  type="button"
                  className="sd-nav-item-btn is-active"
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  <span>Dashboard</span>
                </button>
              </li>

              {/* 2. Projects & Experience */}
              <li>
                <button
                  type="button"
                  className="sd-nav-item-btn"
                  onClick={() => {
                    setIsMobileSidebarOpen(false)
                    navigateToAchievements('skills')
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>Projects & Experience</span>
                </button>
              </li>

              {/* 3. Internships */}
              <li>
                <button
                  type="button"
                  className="sd-nav-item-btn"
                  onClick={() => {
                    setIsMobileSidebarOpen(false)
                    navigateToInternships()
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <span>Internships</span>
                </button>
              </li>

              {/* 4. Placements */}
              <li>
                <button
                  type="button"
                  className="sd-nav-item-btn"
                  onClick={() => {
                    setIsMobileSidebarOpen(false)
                    navigateToPlacements()
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    <line x1="12" y1="11" x2="12" y2="17" />
                    <line x1="9" y1="14" x2="15" y2="14" />
                  </svg>
                  <span>Placements</span>
                </button>
              </li>

              {/* 5. Skill Assessments */}
              <li>
                <button
                  type="button"
                  className="sd-nav-item-btn"
                  onClick={() => {
                    setIsMobileSidebarOpen(false)
                    setIsAssessmentsModalOpen(true)
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                  <span>Skill Assessments</span>
                </button>
              </li>

              {/* 6. Public Posts */}
              <li>
                <button
                  type="button"
                  className="sd-nav-item-btn"
                  onClick={() => {
                    setIsMobileSidebarOpen(false)
                    navigateToPublicPosts()
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  <span>Public Posts</span>
                </button>
              </li>

              {/* 7. My Profile */}
              <li>
                <button
                  type="button"
                  className="sd-nav-item-btn"
                  onClick={() => {
                    setIsMobileSidebarOpen(false)
                    if (onEditProfile) onEditProfile()
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>My Profile</span>
                </button>
              </li>
            </ul>
          </nav>

          <div className="sd-sidebar-footer">
            <div className="sd-sys-status-badge">
              <span className="sd-sys-status-dot" />
              <span>System Online</span>
            </div>
            <div style={{ marginTop: 4 }}>IAS Portal • v2.4.0</div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="sd-main-viewport">
          {/* SECTION 1: TOP HEADER & WELCOME STRIP */}
          <div className="sd-welcome-card">
            <div>
              <h1 className="sd-welcome-title">Welcome, {s.name || 'Student'}</h1>
              <div className="sd-welcome-sub">
                <span>{s.institution || 'Verified Educational Partner'}</span>
                <span>•</span>
                <span>{s.course || 'Degree Program'}</span>
                <span>•</span>
                <span className="sd-welcome-pill">AY 2025-26</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="sd-btn-primary"
                onClick={() => {
                  if (onEditProfile) onEditProfile()
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Pending Changes Alert if active */}
          {hasPendingChanges && (
            <div className="sd-notice-alert pending">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>Profile changes pending institutional review. Active records remain unchanged until approval.</span>
              </div>
              <button type="button" className="sd-notice-btn" onClick={onViewPendingDiff}>
                View Diff
              </button>
            </div>
          )}

          {/* Rejection Alert if rejected */}
          {verificationStatus === 'rejected' && rejectionReason && (
            <div className="sd-notice-alert rejected">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span><strong>Principal Feedback:</strong> &quot;{rejectionReason}&quot;</span>
              </div>
              <button type="button" className="sd-notice-btn" onClick={onEditProfile}>
                Update Profile
              </button>
            </div>
          )}

          {/* SECTION 2: QUICK OVERVIEW STATS (4 Compact Non-Clickable Cards) */}
          <section className="sd-stats-grid">
            {/* Stat 1: Internships */}
            <div className="sd-stat-card">
              <div className="sd-stat-header">
                <div className="sd-stat-icon-wrap" style={{ background: '#fef3c7', color: '#b45309' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <span className="sd-stat-tag" style={{ background: '#fef3c7', color: '#92400e' }}>
                  Active
                </span>
              </div>
              <h3 className="sd-stat-title">Internships</h3>
              <div className="sd-stat-count">{appliedInternshipsCount} Applied</div>
              <div className="sd-stat-desc">Summer cohorts & recruitment drives</div>
              <button
                type="button"
                className="sd-stat-btn"
                onClick={navigateToInternships}
              >
                <span>View Details</span>
                <span>→</span>
              </button>
            </div>

            {/* Stat 2: Placements */}
            <div className="sd-stat-card">
              <div className="sd-stat-header">
                <div className="sd-stat-icon-wrap" style={{ background: '#f0fdf4', color: '#15803d' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    <line x1="12" y1="11" x2="12" y2="17" />
                    <line x1="9" y1="14" x2="15" y2="14" />
                  </svg>
                </div>
                <span className="sd-stat-tag" style={{ background: '#f0fdf4', color: '#166534' }}>
                  Campus
                </span>
              </div>
              <h3 className="sd-stat-title">Placements</h3>
              <div className="sd-stat-count">{appliedPlacementsCount} Drives</div>
              <div className="sd-stat-desc">Placement opportunities & notices</div>
              <button
                type="button"
                className="sd-stat-btn"
                onClick={navigateToPlacements}
              >
                <span>View Details</span>
                <span>→</span>
              </button>
            </div>

            {/* Stat 3: Skill Assessments */}
            <div className="sd-stat-card">
              <div className="sd-stat-header">
                <div className="sd-stat-icon-wrap" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
                <span className="sd-stat-tag" style={{ background: '#eff6ff', color: '#1e40af' }}>
                  Verified
                </span>
              </div>
              <h3 className="sd-stat-title">Skill Assessments</h3>
              <div className="sd-stat-count">{verifiedSkillsCount} Verified</div>
              <div className="sd-stat-desc">Standardized proctored benchmark tests</div>
              <button
                type="button"
                className="sd-stat-btn"
                onClick={() => setIsAssessmentsModalOpen(true)}
              >
                <span>View Details</span>
                <span>→</span>
              </button>
            </div>

            {/* Stat 4: Public Posts */}
            <div className="sd-stat-card">
              <div className="sd-stat-header">
                <div className="sd-stat-icon-wrap" style={{ background: '#faf5ff', color: '#7e22ce' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </div>
                <span className="sd-stat-tag" style={{ background: '#faf5ff', color: '#6b21a8' }}>
                  Published
                </span>
              </div>
              <h3 className="sd-stat-title">Public Posts</h3>
              <div className="sd-stat-count">{posts.length} Posts</div>
              <div className="sd-stat-desc">Milestones & achievements broadcast</div>
              <button
                type="button"
                className="sd-stat-btn"
                onClick={navigateToPublicPosts}
              >
                <span>View Details</span>
                <span>→</span>
              </button>
            </div>
          </section>

          {/* ROW 1: PROFILE COMPLETION & ACADEMIC PERFORMANCE (Requirements 3 & 4) */}
          <div className="sd-row-grid-2">
            {/* SECTION 3: PROFILE COMPLETION */}
            <div className="sd-card">
              <div className="sd-card-header">
                <h2 className="sd-card-heading">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b3881e" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Profile Completion
                </h2>
                <span className="sd-card-badge" style={{ background: '#fef3c7', color: '#92400e' }}>
                  {profileStats.percentage}% Complete
                </span>
              </div>

              <div className="sd-progress-bar-wrap">
                <div className="sd-progress-meta">
                  <span>Verification Readiness</span>
                  <span>{profileStats.percentage}%</span>
                </div>
                <div className="sd-progress-track">
                  <div className="sd-progress-fill" style={{ width: `${profileStats.percentage}%` }} />
                </div>
              </div>

              <div className="sd-checklist-grid">
                <div className="sd-check-item">
                  <span className={`sd-check-dot ${profileStats.personalComplete ? 'complete' : 'pending'}`}>
                    {profileStats.personalComplete ? '✓' : '•'}
                  </span>
                  <span>Personal Information</span>
                </div>
                <div className="sd-check-item">
                  <span className={`sd-check-dot ${profileStats.academicComplete ? 'complete' : 'pending'}`}>
                    {profileStats.academicComplete ? '✓' : '•'}
                  </span>
                  <span>Academic Details</span>
                </div>
                <div className="sd-check-item">
                  <span className={`sd-check-dot ${profileStats.verificationComplete ? 'complete' : 'pending'}`}>
                    {profileStats.verificationComplete ? '✓' : '•'}
                  </span>
                  <span>Institutional Seal</span>
                </div>
                <div className="sd-check-item">
                  <span className={`sd-check-dot ${profileStats.skillsComplete ? 'complete' : 'pending'}`}>
                    {profileStats.skillsComplete ? '✓' : '•'}
                  </span>
                  <span>Skills & Projects</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-start' }}>
                <button
                  type="button"
                  className="sd-btn-primary"
                  onClick={() => {
                    if (onEditProfile) onEditProfile()
                  }}
                >
                  {profileStats.percentage === 100 ? 'Review Profile Details' : 'Complete Profile Now →'}
                </button>
              </div>
            </div>

            {/* SECTION 4: ACADEMIC PERFORMANCE SUMMARY */}
            <div className="sd-card">
              <div className="sd-card-header">
                <h2 className="sd-card-heading">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                  Academic Performance Summary
                </h2>
                <span className="sd-card-badge" style={{ background: '#dcfce7', color: '#166534' }}>
                  Official Record
                </span>
              </div>

              <div className="sd-acad-stats-row">
                <div className="sd-acad-stat-box">
                  <div className="sd-acad-stat-label">SGPA</div>
                  <div className="sd-acad-stat-val">{s.sgpa || '—'}</div>
                  <div className="sd-acad-stat-sub">Latest Semester</div>
                </div>
                <div className="sd-acad-stat-box">
                  <div className="sd-acad-stat-label">YGPA</div>
                  <div className="sd-acad-stat-val">{s.ygpa || '—'}</div>
                  <div className="sd-acad-stat-sub">Academic Year</div>
                </div>
                <div className="sd-acad-stat-box">
                  <div className="sd-acad-stat-label">CGPA</div>
                  <div className="sd-acad-stat-val">{s.cgpa || '—'}</div>
                  <div className="sd-acad-stat-sub">Cumulative Index</div>
                </div>
              </div>

              <div className="sd-acad-meta-list">
                <div className="sd-acad-meta-item">
                  <span>Institution:</span>
                  <strong>{s.institution || 'Recognized Educational Partner'}</strong>
                </div>
                <div className="sd-acad-meta-item">
                  <span>Program / Course:</span>
                  <strong>{s.course || 'Undergraduate Curriculum'}</strong>
                </div>
                <div className="sd-acad-meta-item">
                  <span>Registration / Roll:</span>
                  <strong>{s.universityRollNo || s.collegeRollNo || 'Registered Student'}</strong>
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-start' }}>
                <button
                  type="button"
                  className="sd-stat-btn"
                  onClick={() => setIsAcadOpen(true)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>

          {/* ROW 2: DEADLINES & RECENT ACTIVITY (Requirements 5 & 6) */}
          <div className="sd-row-grid-2">
            {/* SECTION 5: UPCOMING DEADLINES / IMPORTANT EVENTS */}
            <div className="sd-card">
              <div className="sd-card-header">
                <h2 className="sd-card-heading">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Upcoming Deadlines & Events
                </h2>
                <span className="sd-card-badge" style={{ background: '#f8fafc', color: '#64748b' }}>
                  Schedule
                </span>
              </div>

              <div className="sd-event-list">
                {/* Clean, institutional empty state when no pending dates exist */}
                <div className="sd-empty-state-box">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 14 14" />
                  </svg>
                  <div className="sd-empty-title">No Immediate Deadlines</div>
                  <div className="sd-empty-desc">
                    All application registrations, proctored evaluations, and project milestones are currently up to date.
                  </div>
                  <button
                    type="button"
                    className="sd-stat-btn"
                    style={{ marginTop: 8 }}
                    onClick={navigateToInternships}
                  >
                    <span>Browse Opportunities</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 6: RECENT ACTIVITY */}
            <div className="sd-card">
              <div className="sd-card-header">
                <h2 className="sd-card-heading">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                  Recent Activity
                </h2>
                <span className="sd-card-badge" style={{ background: '#f8fafc', color: '#64748b' }}>
                  Audit Trail
                </span>
              </div>

              <div className="sd-activity-list">
                {notifications.length > 0 ? (
                  notifications.slice(0, 3).map((n) => (
                    <div key={n.id} className="sd-activity-row">
                      <span className="sd-activity-dot" />
                      <div style={{ flex: 1 }}>
                        <div className="sd-activity-title">{n.title}</div>
                        <div className="sd-activity-meta">{n.message || n.timestamp}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="sd-empty-state-box">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <div className="sd-empty-title">No Recent Activity Logged</div>
                    <div className="sd-empty-desc">
                      Activity log will record your internship applications, skill verifications, and post milestones.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ROW 3: QUICK ACTIONS & INSTITUTIONAL PROGRESS AREA (Requirements 7 & 8) */}
          <div className="sd-row-grid-2">
            {/* SECTION 7: QUICK ACTIONS */}
            <div className="sd-card">
              <div className="sd-card-header">
                <h2 className="sd-card-heading">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f1d2f" strokeWidth="2.2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Quick Actions
                </h2>
                <span className="sd-card-badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                  Direct Tools
                </span>
              </div>

              <div className="sd-actions-grid">
                <button
                  type="button"
                  className="sd-action-card-btn"
                  onClick={() => {
                    if (onEditProfile) onEditProfile()
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b3881e" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Update Profile</span>
                </button>

                <button
                  type="button"
                  className="sd-action-card-btn"
                  onClick={navigateToInternships}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <span>Explore Internships</span>
                </button>

                <button
                  type="button"
                  className="sd-action-card-btn"
                  onClick={navigateToPlacements}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    <line x1="12" y1="11" x2="12" y2="17" />
                  </svg>
                  <span>Explore Placements</span>
                </button>

                <button
                  type="button"
                  className="sd-action-card-btn"
                  onClick={() => setIsAssessmentsModalOpen(true)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                  <span>Take Assessment</span>
                </button>

                <button
                  type="button"
                  className="sd-action-card-btn"
                  style={{ gridColumn: 'span 2' }}
                  onClick={navigateToPublicPosts}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7e22ce" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  <span>Create Public Post</span>
                </button>
              </div>
            </div>

            {/* SECTION 8: VERIFICATION / PROGRESS AREA */}
            <div className="sd-card">
              <div className="sd-card-header">
                <h2 className="sd-card-heading">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Institutional Verification & Seal
                </h2>
                <span className="sd-card-badge" style={{ background: '#dcfce7', color: '#166534' }}>
                  Authorized
                </span>
              </div>

              <div className="sd-verify-box">
                <div className="sd-seal-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <div className="sd-verify-title">Verified Institutional Record</div>
                  <div className="sd-verify-sub">
                    Identity verified by {s.institution || 'Educational Authority'}. Profile is validated for academic placement drives.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                Your credentials, examination grade points, and semester enrolments are continuously verified under the IAS Collaboration Framework.
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 10, display: 'flex', justifyContent: 'flex-start' }}>
                <button
                  type="button"
                  className="sd-stat-btn"
                  onClick={() => {
                    if (onEditProfile) onEditProfile()
                  }}
                >
                  <span>Review Verification Status</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ALL REUSABLE MODALS PRESERVED AND CONNECTED */}
      <ProfilePhotoLightbox
        isOpen={isPhotoLightboxOpen}
        imageSrc={s.profilePic}
        studentName={s.name}
        onClose={() => setIsPhotoLightboxOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotifOpen}
        notifications={notifications}
        onClose={() => setIsNotifOpen(false)}
        onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
        onClearAll={() => setNotifications([])}
        onNotificationClick={(notif) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
          )
        }}
      />

      <AcademicDetailsModal
        isOpen={isAcadOpen}
        onClose={() => setIsAcadOpen(false)}
        student={s}
      />

      <SkillsProjectsModal
        isOpen={isSkillsModalOpen}
        initialTab={skillsInitialTab}
        onClose={() => setIsSkillsModalOpen(false)}
        skills={skills}
        projects={projects}
        internships={internships}
        onAddSkill={handleAddSkill}
        onAddProject={handleAddProject}
        onAddInternship={handleAddInternship}
      />

      <PublicPostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onCreatePost={handleCreatePost}
        onUpdatePost={handleUpdatePost}
        onDeletePost={handleDeletePost}
        onSubmitDraft={handleSubmitPostDraft}
        existingPosts={posts}
      />

      <InternshipsPlacementsModal
        isOpen={isInternshipsModalOpen}
        onClose={() => setIsInternshipsModalOpen(false)}
        student={s}
      />

      <SkillAssessmentsModal
        isOpen={isAssessmentsModalOpen}
        onClose={() => setIsAssessmentsModalOpen(false)}
        student={s}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onPasswordChanged={handlePasswordChanged}
        student={s}
      />
    </div>
  )
}
