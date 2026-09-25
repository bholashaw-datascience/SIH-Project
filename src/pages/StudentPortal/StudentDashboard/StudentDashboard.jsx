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
  onOpenSkillAssessments,
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
  const openSkillsTab = (tab) => {
    setSkillsInitialTab(tab)
    setIsSkillsModalOpen(true)
  }

  // Institutional Contacts: Principal, HOD, Student Mentor, Placement Cell Head
  const institutionContacts = (() => {
    const raw = student?.institutionContacts && Array.isArray(student.institutionContacts) && student.institutionContacts.length > 0
      ? student.institutionContacts
      : [
          { role: 'Principal / Director', dept: 'Office of the Principal' },
          { role: 'Head of Department (HOD)', dept: s.course ? `Dept of ${s.course}` : 'Department Office' },
          { role: 'Student Mentor', dept: 'Batch Mentor & Faculty' },
          { role: 'Placement Cell Head', dept: 'Training & Placements Cell' },
        ]

    return raw.map((c) => ({
      ...c,
      role: c.role === 'Academic Advisor' ? 'Student Mentor' : c.role,
    }))
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

  const navigateToSkillAssessments = () => {
    if (onOpenSkillAssessments) {
      onOpenSkillAssessments()
    } else {
      setIsAssessmentsModalOpen(true)
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
          min-height: 0;
          flex: 1;
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
          height: 52px;
          min-height: 52px;
          max-height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          position: sticky;
          top: 0;
          z-index: 1050;
          box-shadow: 0 2px 10px rgba(10, 20, 30, 0.2);
          box-sizing: border-box;
          width: 100%;
          flex-shrink: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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
          min-height: 0;
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
          padding: 12px 10px;
          box-sizing: border-box;
          position: sticky;
          top: 52px;
          min-height: 100%;
          overflow-y: auto;
        }

        .sd-sidebar-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 6px 10px 4px;
        }

        .sd-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sd-nav-item-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 10px;
          border-radius: 5px;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 0.82rem;
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
          padding: 14px 22px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
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
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-left: 4px solid #b3881e;
          box-shadow: 0 2px 8px rgba(13, 27, 42, 0.08);
          box-sizing: border-box;
        }

        .sd-welcome-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 3px;
          letter-spacing: -0.01em;
        }

        .sd-welcome-sub {
          font-size: 0.78rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .sd-welcome-pill {
          background: rgba(179, 136, 30, 0.2);
          color: #f1cf7c;
          border: 1px solid rgba(179, 136, 30, 0.4);
          font-size: 0.68rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* Alert Banners (Pending Changes & Rejection) */
        .sd-notice-alert {
          border-radius: 6px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          font-size: 0.8rem;
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
          padding: 4px 10px;
          font-size: 0.76rem;
          font-weight: 700;
          border-radius: 4px;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
        }

        /* SECTION 1 & 2: Dual Top Columns (Profile Overview + Academic Information) */
        .sd-top-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* Standard Institutional Card */
        .sd-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(15, 29, 47, 0.04);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          cursor: default;
          overflow: hidden;
        }

        .sd-card-header {
          padding: 9px 16px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .sd-card-heading {
          font-size: 0.88rem;
          font-weight: 800;
          color: #0f1d2f;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }

        .sd-card-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 12px;
        }

        .sd-card-body {
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 10px;
        }

        /* Section 1: Profile Overview Styling */
        .sd-profile-head {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .sd-avatar-box {
          width: 70px;
          height: 70px;
          border-radius: 8px;
          background: #0d1b2a;
          border: 2px solid #b3881e;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(13, 27, 42, 0.12);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .sd-avatar-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 14px rgba(179, 136, 30, 0.25);
        }

        .sd-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sd-avatar-initial {
          font-size: 1.7rem;
          font-weight: 800;
          color: #f1cf7c;
        }

        .sd-avatar-zoom-hint {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(13, 27, 42, 0.85);
          color: #ffffff;
          font-size: 0.6rem;
          font-weight: 700;
          text-align: center;
          padding: 2px 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .sd-avatar-box:hover .sd-avatar-zoom-hint {
          opacity: 1;
        }

        .sd-profile-primary {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sd-profile-name {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f1d2f;
          margin: 0;
          line-height: 1.2;
        }

        .sd-profile-email {
          font-size: 0.8rem;
          color: #64748b;
        }

        .sd-profile-course {
          font-size: 0.76rem;
          font-weight: 600;
          color: #b3881e;
          margin-top: 1px;
        }

        /* 2-Column Info Table */
        .sd-info-table {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 8px 12px;
        }

        .sd-info-item {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .sd-info-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .sd-info-val {
          font-size: 0.8rem;
          font-weight: 600;
          color: #1e293b;
          word-break: break-word;
        }

        .sd-card-footer-action {
          margin-top: auto;
          padding-top: 4px;
          display: flex;
          justify-content: flex-start;
        }

        .sd-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 5px 12px;
          background: #b3881e;
          color: #ffffff;
          border: 1px solid #997316;
          border-radius: 5px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
          font-family: inherit;
        }

        .sd-btn-primary:hover {
          background: #997316;
        }

        /* Section 2: Academic Information Styling */
        .sd-gpa-chips {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .sd-gpa-chip-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 6px 8px;
          text-align: center;
        }

        .sd-gpa-chip-num {
          display: block;
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f1d2f;
          line-height: 1.1;
        }

        .sd-gpa-chip-lbl {
          font-size: 0.65rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-top: 2px;
        }

        .sd-stat-btn {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 11px;
          font-size: 0.75rem;
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

        /* Section 3: My Institution Contacts */
        .sd-contacts-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .sd-contact-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          cursor: default;
          box-sizing: border-box;
        }

        .sd-contact-role {
          font-size: 0.7rem;
          font-weight: 800;
          color: #b3881e;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .sd-contact-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: #0f1d2f;
          line-height: 1.2;
        }

        .sd-contact-detail {
          font-size: 0.75rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 5px;
          line-height: 1.3;
        }

        .sd-contact-dept {
          font-size: 0.68rem;
          color: #94a3b8;
          margin-top: auto;
          padding-top: 2px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .sd-top-grid {
            grid-template-columns: 1fr;
          }
          .sd-contacts-grid {
            grid-template-columns: repeat(2, 1fr);
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
          .sd-topbar {
            padding: 0 12px;
          }
          .sd-brand-sub {
            display: none;
          }
          .sd-user-pill-btn > span {
            display: none;
          }
          .sd-user-pill-btn {
            padding: 3px 6px 3px 4px;
          }
          .sd-contacts-grid {
            grid-template-columns: 1fr;
          }
          .sd-info-table {
            grid-template-columns: 1fr;
          }
          .sd-gpa-chips {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* TOPBAR HEADER */}
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
              <span className="sd-brand-main">Student Dashboard</span>
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
                    navigateToSkillAssessments()
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
        </aside>

        {/* Main Content Viewport */}
        <main className="sd-main-viewport">
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

          {/* SECTION 1 & 2: DUAL TOP GRID (Profile Overview + Academic Information) */}
          <div className="sd-top-grid">
            {/* 1. PROFILE OVERVIEW */}
            <section className="sd-card">
              <div className="sd-card-header">
                <h2 className="sd-card-heading">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b3881e" strokeWidth="2.2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile Overview
                </h2>
                <span className="sd-card-badge" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
                  ✓ Official Record
                </span>
              </div>

              <div className="sd-card-body">
                <div className="sd-profile-head">
                  <div
                    className="sd-avatar-box"
                    onClick={() => setIsPhotoLightboxOpen(true)}
                    title="Click to view enlarged profile picture (View Only)"
                  >
                    {s.profilePic ? (
                      <img src={s.profilePic} alt={s.name || 'Student'} className="sd-avatar-img" />
                    ) : (
                      <div className="sd-avatar-initial">{(s.name || 'S').charAt(0).toUpperCase()}</div>
                    )}
                    <div className="sd-avatar-zoom-hint">Enlarge</div>
                  </div>

                  <div className="sd-profile-primary">
                    <h3 className="sd-profile-name">{s.name || 'Student'}</h3>
                    <div className="sd-profile-email">{s.email || 'No email address registered'}</div>
                    <div className="sd-profile-course">{s.course || 'Academic program not specified'}</div>
                  </div>
                </div>

                <div className="sd-info-table">
                  <div className="sd-info-item">
                    <span className="sd-info-label">Mobile Number</span>
                    <span className="sd-info-val">{s.phone || 'Not available yet'}</span>
                  </div>
                  <div className="sd-info-item">
                    <span className="sd-info-label">Date of Birth & Gender</span>
                    <span className="sd-info-val">
                      {s.dob && s.gender ? `${s.dob} • ${s.gender}` : s.dob || s.gender || 'Not available yet'}
                    </span>
                  </div>
                  <div className="sd-info-item" style={{ gridColumn: 'span 2' }}>
                    <span className="sd-info-label">Present Address</span>
                    <span className="sd-info-val">{s.presentAddress || 'No address added yet'}</span>
                  </div>
                  <div className="sd-info-item" style={{ gridColumn: 'span 2' }}>
                    <span className="sd-info-label">Permanent Address</span>
                    <span className="sd-info-val">{s.permanentAddress || 'No address added yet'}</span>
                  </div>
                </div>

                <div className="sd-card-footer-action">
                  <button
                    type="button"
                    className="sd-btn-primary"
                    onClick={() => {
                      if (onEditProfile) onEditProfile()
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 2. ACADEMIC INFORMATION */}
            <section className="sd-card">
              <div className="sd-card-header">
                <h2 className="sd-card-heading">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                  Academic Information
                </h2>
                <span className="sd-card-badge" style={{ background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1' }}>
                  {s.year && s.semester ? `${s.year} • ${s.semester}` : s.year || s.semester || 'Academic Standing'}
                </span>
              </div>

              <div className="sd-card-body">
                {/* GPA Chips */}
                <div className="sd-gpa-chips">
                  <div className="sd-gpa-chip-item">
                    <span className="sd-gpa-chip-num">{s.sgpa || '—'}</span>
                    <span className="sd-gpa-chip-lbl">Latest SGPA</span>
                  </div>
                  <div className="sd-gpa-chip-item">
                    <span className="sd-gpa-chip-num">{s.ygpa || '—'}</span>
                    <span className="sd-gpa-chip-lbl">Yearly YGPA</span>
                  </div>
                  <div className="sd-gpa-chip-item">
                    <span className="sd-gpa-chip-num" style={{ color: '#b3881e' }}>{s.cgpa || '—'}</span>
                    <span className="sd-gpa-chip-lbl">Cumulative CGPA</span>
                  </div>
                </div>

                <div className="sd-info-table">
                  <div className="sd-info-item">
                    <span className="sd-info-label">College / Institution</span>
                    <span className="sd-info-val">{s.institution || 'Not available yet'}</span>
                  </div>
                  <div className="sd-info-item">
                    <span className="sd-info-label">Course / Program</span>
                    <span className="sd-info-val">{s.course || 'Not specified'}</span>
                  </div>
                  <div className="sd-info-item">
                    <span className="sd-info-label">College Roll Number</span>
                    <span className="sd-info-val">{s.collegeRollNo || 'Not available yet'}</span>
                  </div>
                  <div className="sd-info-item">
                    <span className="sd-info-label">University Roll Number</span>
                    <span className="sd-info-val">{s.universityRollNo || 'Not available yet'}</span>
                  </div>
                  <div className="sd-info-item">
                    <span className="sd-info-label">Admission Year & Course</span>
                    <span className="sd-info-val">
                      {s.admissionYear && s.admissionCourse ? `${s.admissionYear} • ${s.admissionCourse}` : s.admissionYear || s.admissionCourse || 'Not available yet'}
                    </span>
                  </div>
                  <div className="sd-info-item">
                    <span className="sd-info-label">Expected Completion Year</span>
                    <span className="sd-info-val">{s.completionYear || 'Not available yet'}</span>
                  </div>
                </div>

                <div className="sd-card-footer-action">
                  <button
                    type="button"
                    className="sd-stat-btn"
                    onClick={() => setIsAcadOpen(true)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                    <span>View Details & Full Transcript →</span>
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* 3. MY INSTITUTION CONTACT */}
          <section className="sd-card">
            <div className="sd-card-header">
              <h2 className="sd-card-heading">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d1b2a" strokeWidth="2.2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                My Institution Contact
              </h2>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Context: {s.institution || 'Institutional Office'} • {s.course || 'Program Office'}
              </span>
            </div>

            <div className="sd-card-body">
              <div className="sd-contacts-grid">
                {institutionContacts.map((c, i) => (
                  <div key={c.id || c.role || i} className="sd-contact-card">
                    <span className="sd-contact-role">{c.role}</span>
                    <span className="sd-contact-name" style={{ color: c.name ? '#0f1d2f' : '#64748b', fontWeight: c.name ? 700 : 500 }}>
                      {c.name || 'Not available yet'}
                    </span>
                    <span className="sd-contact-detail">
                      {c.phone ? (
                        <>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <span>{c.phone}</span>
                        </>
                      ) : (
                        <span>Institution contact information will appear after verification</span>
                      )}
                    </span>
                    <span className="sd-contact-dept">{c.dept || ''}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
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
