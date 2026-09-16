import { useState, useEffect, useRef } from 'react'
import ProfilePhotoLightbox from './ProfilePhotoLightbox'
import NotificationsModal from './NotificationsModal'
import AcademicDetailsModal from './AcademicDetailsModal'
import SkillsProjectsModal from './SkillsProjectsModal'
import PublicPostModal from './PublicPostModal'
import InternshipsPlacementsModal from './InternshipsPlacementsModal'
import SkillAssessmentsModal from './SkillAssessmentsModal'
import ChangePasswordModal from './ChangePasswordModal'

export default function StudentDashboard({
  student = {},
  verifiedProfile = {},
  hasPendingChanges = false,
  onEditProfile,
  onViewPendingDiff,
  onNavigateHome,
  onLogout,
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
      return saved ? JSON.parse(saved) : []
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
      message: 'Your password was changed successfully just now.',
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

    // Add notification
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
      title: postData.title,
      category: postData.category,
      content: postData.content,
      attachment: postData.attachment,
      attachmentUrl: postData.attachmentUrl,
      attachmentSize: postData.attachmentSize,
      attachmentType: postData.attachmentType,
      status: isDraft ? 'draft' : 'pending',
      createdAt: new Date().toISOString(),
    }
    setPosts((prev) => [newPost, ...prev])

    if (!isDraft) {
      const notif = {
        id: `n_${Date.now()}`,
        type: 'info',
        title: `Public Post Submitted: ${newPost.title}`,
        message: 'Your post is under moderation review by Udaan Portal Admin.',
        timestamp: 'Just now',
        read: false,
      }
      setNotifications((prev) => [notif, ...prev])
    }
  }

  const handleSubmitPostDraft = (postId) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: 'pending' } : p))
    )
    const notif = {
      id: `n_${Date.now()}`,
      type: 'info',
      title: 'Draft Post Submitted',
      message: 'Your draft post has been submitted for moderation review by Udaan Portal Admin.',
      timestamp: 'Just now',
      read: false,
    }
    setNotifications((prev) => [notif, ...prev])
  }


  const unreadNotifsCount = notifications.filter((n) => !n.read).length
  const verifiedSkillsCount = skills.filter((sItem) => sItem.verified).length
  const verifiedProjectsCount = projects.filter((pItem) => pItem.verified).length
  const verifiedInternshipsCount = internships.filter((iItem) => iItem.verified).length

  const openSkillsTab = (tab) => {
    setSkillsInitialTab(tab)
    setIsSkillsModalOpen(true)
  }

  return (
    <div className="sd-page-wrapper">
      <style>{`
        .sd-page-wrapper {
          min-height: 100vh;
          background-color: #f7f5ef;
          color: #112233;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        /* Top Header */
        .sd-header {
          background-color: #0f1f2e;
          color: #ffffff;
          border-bottom: 3px solid #b38e44;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 16px rgba(10, 20, 30, 0.18);
        }

        .sd-header-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .sd-brand-logo {
          width: 38px;
          height: 38px;
          border-radius: 6px;
          background: linear-gradient(135deg, #b38e44 0%, #8c681b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.15rem;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .sd-brand-text {
          display: flex;
          flex-direction: column;
        }

        .sd-brand-title {
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #ffffff;
        }

        .sd-brand-sub {
          font-size: 0.72rem;
          color: #cbd5e1;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .sd-header-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        /* Profile Menu Trigger & Dropdown */
        .sd-profile-menu-wrap {
          position: relative;
          display: inline-flex;
        }

        .sd-user-badge-btn {
          display: flex;
          align-items: center;
          gap: 9px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.16);
          padding: 4px 12px 4px 5px;
          border-radius: 20px;
          cursor: pointer;
          color: #f1f5f9;
          font-family: inherit;
          font-size: 0.84rem;
          font-weight: 600;
          transition: all 0.15s ease;
          user-select: none;
        }

        .sd-user-badge-btn:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 255, 255, 0.32);
          color: #ffffff;
        }

        .sd-user-badge-btn.is-active {
          background: rgba(255, 255, 255, 0.2);
          border-color: #b38e44;
          box-shadow: 0 0 0 2px rgba(179, 142, 68, 0.25);
        }

        .sd-user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid #b38e44;
          background: #1e3a5f;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.8rem;
          flex-shrink: 0;
        }

        .sd-user-name {
          font-size: 0.84rem;
          font-weight: 600;
          color: #f1f5f9;
          max-width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sd-dropdown-chevron {
          color: #cbd5e1;
          transition: transform 0.18s ease;
          flex-shrink: 0;
        }

        .sd-dropdown-chevron.is-open {
          transform: rotate(180deg);
          color: #f1cf7c;
        }

        /* Profile Dropdown Menu Card */
        .sd-profile-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 220px;
          max-width: calc(100vw - 24px);
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 12px 28px -4px rgba(10, 20, 30, 0.22), 0 6px 12px -2px rgba(10, 20, 30, 0.12);
          padding: 6px;
          z-index: 1200;
          animation: sdDropdownSlide 0.14s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
        }

        @keyframes sdDropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .sd-dropdown-header {
          padding: 8px 10px 6px;
        }

        .sd-dropdown-user-name {
          font-size: 0.86rem;
          font-weight: 700;
          color: #0f1f2e;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sd-dropdown-user-email {
          font-size: 0.74rem;
          color: #64748b;
          line-height: 1.3;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sd-dropdown-user-role {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #b38e44;
          margin-top: 4px;
        }

        .sd-dropdown-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 4px 0;
        }

        .sd-dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border: none;
          background: transparent;
          color: #334155;
          font-size: 0.82rem;
          font-weight: 600;
          font-family: inherit;
          text-align: left;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.12s ease;
          box-sizing: border-box;
        }

        .sd-dropdown-item:hover,
        .sd-dropdown-item:focus-visible {
          background: #f8fafc;
          color: #0f1f2e;
          outline: none;
        }

        .sd-dropdown-item-logout {
          color: #dc2626;
        }

        .sd-dropdown-item-logout:hover,
        .sd-dropdown-item-logout:focus-visible {
          background: #fef2f2;
          color: #b91c1c;
        }

        .sd-notif-btn {
          position: relative;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .sd-notif-btn:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .sd-notif-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: #dc2626;
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 800;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
          border: 2px solid #0f1f2e;
        }

        /* Container & Hierarchy */
        .sd-container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 24px 20px 48px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Pending / Rejection Banners */
        .sd-alert-banner {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-left: 5px solid #d97706;
          border-radius: 6px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          box-shadow: 0 2px 6px rgba(217, 119, 6, 0.08);
        }

        .sd-alert-banner.rejected {
          background: #fef2f2;
          border-color: #fecaca;
          border-left-color: #dc2626;
        }

        .sd-alert-btn {
          background: #1e3a5f;
          border: 1px solid #152942;
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 7px 14px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .sd-alert-btn:hover {
          background: #162c48;
        }

        /* Section 1: Dual Top Columns (Profile Overview + Academic Overview) */
        .sd-top-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 900px) {
          .sd-top-grid {
            grid-template-columns: 1fr;
          }
        }

        .sd-card {
          background: #ffffff;
          border: 1px solid #ded9cc;
          border-radius: 8px;
          box-shadow: 0 4px 14px rgba(15, 29, 47, 0.05);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .sd-card-header {
          padding: 14px 18px;
          background: #f8f6f0;
          border-bottom: 1px solid #e5dfd2;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sd-card-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: #112233;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .sd-card-body {
          padding: 18px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* Profile Overview Specifics */
        .sd-profile-head {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid #f1eeea;
        }

        .sd-avatar-box {
          position: relative;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 2px solid #b38e44;
          box-shadow: 0 3px 10px rgba(0,0,0,0.12);
          cursor: pointer;
          overflow: hidden;
          background: #1e3a5f;
          flex-shrink: 0;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .sd-avatar-box:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 14px rgba(179, 142, 68, 0.35);
        }

        .sd-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .sd-avatar-initial {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.7rem;
          font-weight: 700;
          color: #ffffff;
        }

        .sd-avatar-zoom-hint {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(15, 31, 46, 0.75);
          color: #ffffff;
          font-size: 0.6rem;
          text-align: center;
          padding: 2px 0;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .sd-info-table {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px 14px;
          font-size: 0.84rem;
        }

        @media (max-width: 500px) {
          .sd-info-table {
            grid-template-columns: 1fr;
          }
        }

        .sd-info-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sd-info-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .sd-info-val {
          font-size: 0.88rem;
          font-weight: 600;
          color: #112233;
          word-break: break-word;
        }

        .sd-card-actions {
          display: flex;
          gap: 10px;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid #f1eeea;
        }

        .sd-btn-primary {
          background: #1e3a5f;
          border: 1px solid #152942;
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
        }

        .sd-btn-primary:hover {
          background: #162c48;
        }

        .sd-btn-secondary {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
        }

        .sd-btn-secondary:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          color: #0f172a;
        }

        /* GPA Chips in Academic Overview */
        .sd-gpa-chips {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          background: #fdfbf7;
          border: 1px solid #eadecb;
          border-radius: 6px;
          padding: 10px;
          text-align: center;
        }

        .sd-gpa-chip-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sd-gpa-chip-num {
          font-size: 1.25rem;
          font-weight: 800;
          color: #1e3a5f;
        }

        .sd-gpa-chip-lbl {
          font-size: 0.68rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }

        /* Section 2: Verification Overview (3 Compact Cards) */
        .sd-verif-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 768px) {
          .sd-verif-grid {
            grid-template-columns: 1fr;
          }
        }

        .sd-verif-card {
          background: #ffffff;
          border: 1px solid #ded9cc;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          transition: all 0.15s ease;
          border-left: 4px solid #16a34a;
          box-shadow: 0 2px 8px rgba(15, 29, 47, 0.04);
        }

        .sd-verif-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(15, 29, 47, 0.09);
          border-color: #16a34a;
        }

        .sd-verif-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background: #dcfce7;
          color: #166534;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sd-verif-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 2px;
        }

        .sd-verif-count {
          font-size: 1.4rem;
          font-weight: 800;
          color: #112233;
          line-height: 1;
        }

        .sd-verif-sub {
          font-size: 0.72rem;
          color: #166534;
          font-weight: 600;
          margin-top: 4px;
        }

        /* Section 3: My Institution */
        .sd-contacts-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        @media (max-width: 900px) {
          .sd-contacts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 500px) {
          .sd-contacts-grid {
            grid-template-columns: 1fr;
          }
        }

        .sd-contact-card {
          background: #fbfaf8;
          border: 1px solid #e6e2d8;
          border-radius: 6px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sd-contact-role {
          font-size: 0.7rem;
          font-weight: 800;
          color: #b38e44;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .sd-contact-name {
          font-size: 0.92rem;
          font-weight: 700;
          color: #112233;
        }

        .sd-contact-detail {
          font-size: 0.78rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Section 4 & 5: Action Gateways & Detailed Cards */
        .sd-gateways-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (max-width: 768px) {
          .sd-gateways-grid {
            grid-template-columns: 1fr;
          }
        }

        .sd-gateway-card {
          background: #ffffff;
          border: 1px solid #ded9cc;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 2px 8px rgba(15, 29, 47, 0.04);
        }

        .sd-gateway-card:hover {
          border-color: #1e3a5f;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(15, 29, 47, 0.08);
        }

        .sd-gateway-card.featured {
          border-left: 4px solid #b38e44;
        }

        .sd-gw-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: #f0f4f9;
          color: #1e3a5f;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sd-gw-title {
          font-size: 1rem;
          font-weight: 700;
          color: #112233;
          margin: 0 0 4px;
        }

        .sd-gw-desc {
          font-size: 0.8rem;
          color: #64748b;
          margin: 0;
          line-height: 1.4;
        }

        /* Single Action for Post */
        .sd-post-action-card {
          background: linear-gradient(135deg, #112233 0%, #1e3a5f 100%);
          border-radius: 8px;
          padding: 20px 24px;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          box-shadow: 0 4px 16px rgba(15, 29, 47, 0.12);
        }

        .sd-post-action-btn {
          background: #b38e44;
          border: 1px solid #8c681b;
          color: #ffffff;
          font-size: 0.86rem;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.15s ease;
        }

        .sd-post-action-btn:hover {
          background: #a17c35;
        }

      `}</style>

      {/* 1. TOP HEADER (Requirement 2) */}
      <header className="sd-header">
        <div className="sd-header-brand" onClick={onNavigateHome} title="Return to Portal Home">
          <div className="sd-brand-logo">U</div>
          <div className="sd-brand-text">
            <span className="sd-brand-title">UDAAN</span>
            <span className="sd-brand-sub">Student Portal & Control Center</span>
          </div>
        </div>

        <div className="sd-header-actions">
          {/* Notifications Button */}
          <button
            className="sd-notif-btn"
            onClick={() => setIsNotifOpen(true)}
            aria-label="View notifications"
            title="Institutional Notifications & Verifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadNotifsCount > 0 && (
              <span className="sd-notif-badge">{unreadNotifsCount}</span>
            )}
          </button>

          {/* Profile Dropdown Menu Control */}
          <div className="sd-profile-menu-wrap" ref={profileMenuRef}>
            <button
              type="button"
              className={`sd-user-badge-btn ${isProfileMenuOpen ? 'is-active' : ''}`}
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="true"
              aria-label="User account menu"
            >
              <div className="sd-user-avatar">
                {s.profilePic ? (
                  <img src={s.profilePic} alt={s.name || 'Student'} className="sd-avatar-img" />
                ) : (
                  <span>{(s.name || 'S').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className="sd-user-name">{s.name || 'Student'}</span>
              <svg
                className={`sd-dropdown-chevron ${isProfileMenuOpen ? 'is-open' : ''}`}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isProfileMenuOpen && (
              <div className="sd-profile-dropdown-menu" role="menu">
                <div className="sd-dropdown-header">
                  <div className="sd-dropdown-user-name">{s.name || 'Student Account'}</div>
                  <div className="sd-dropdown-user-email">{s.email || 'No email registered'}</div>
                  <div className="sd-dropdown-user-role">Student Account</div>
                </div>
                <div className="sd-dropdown-divider" />

                {/* 1. Change Password Entry */}
                <button
                  type="button"
                  className="sd-dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    setIsChangePasswordOpen(true)
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Change Password</span>
                </button>

                <div className="sd-dropdown-divider" />

                {/* 2. Logout Entry */}
                <button
                  type="button"
                  className="sd-dropdown-item sd-dropdown-item-logout"
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
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* MAIN CONTENT HIERARCHY (Requirement 14) */}
      <main className="sd-container">
        {/* PENDING CHANGES ALERT (Requirement 13) */}
        {hasPendingChanges && (
          <div className="sd-alert-banner">
            <div>
              <strong style={{ color: '#92400e', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.92rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Profile Edits Awaiting Principal Verification
              </strong>
              <div style={{ fontSize: '0.8rem', color: '#78350f', marginTop: 3 }}>
                You recently submitted changes to your profile. Your currently approved profile remains active until your Principal reviews and approves the updates.
              </div>
            </div>
            <button className="sd-alert-btn" onClick={onViewPendingDiff}>
              View Pending Changes Diff →
            </button>
          </div>
        )}

        {/* REJECTION REASON BANNER IF PRINCIPAL REJECTED CHANGES (Requirement 13) */}
        {verificationStatus === 'rejected' && rejectionReason && (
          <div className="sd-alert-banner rejected">
            <div>
              <strong style={{ color: '#991b1b', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.92rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                Principal Verification Notice: Changes Rejected
              </strong>
              <div style={{ fontSize: '0.82rem', color: '#7f1d1d', marginTop: 4 }}>
                <strong>Official Reason:</strong> &quot;{rejectionReason}&quot;
              </div>
              <div style={{ fontSize: '0.76rem', color: '#991b1b', marginTop: 2 }}>
                Your previously approved profile remains active as your official institutional record.
              </div>
            </div>
            <button className="sd-alert-btn" onClick={onEditProfile}>
              Correct & Resubmit
            </button>
          </div>
        )}

        {/* SECTION 1: PROFILE OVERVIEW + ACADEMIC OVERVIEW (Requirements 3 & 4) */}
        <section className="sd-top-grid">
          {/* PROFILE OVERVIEW (Requirement 3) */}
          <div className="sd-card">
            <div className="sd-card-header">
              <h3 className="sd-card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile Overview
              </h3>
              <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', border: '1px solid #86efac', padding: '3px 8px', borderRadius: 12, fontWeight: 700 }}>
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
                    <img src={s.profilePic} alt={s.name} className="sd-avatar-img" />
                  ) : (
                    <div className="sd-avatar-initial">{(s.name || 'S').charAt(0).toUpperCase()}</div>
                  )}
                  <div className="sd-avatar-zoom-hint">Enlarge</div>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', color: '#112233', fontWeight: 700 }}>
                    {s.name || 'Student'}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {s.email || 'No email address registered'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#1e3a5f', fontWeight: 600, marginTop: 2 }}>
                    {s.course || 'Academic program not specified'}
                  </div>
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

              <div className="sd-card-actions">
                <button
                  type="button"
                  className="sd-btn-primary"
                  onClick={onEditProfile}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* ACADEMIC OVERVIEW (Requirement 4) */}
          <div className="sd-card">
            <div className="sd-card-header">
              <h3 className="sd-card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                Academic Information
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                {s.year && s.semester ? `${s.year} • ${s.semester}` : s.year || s.semester || 'Academic Standing'}
              </span>
            </div>

            <div className="sd-card-body">
              {/* Top GPA Chips */}
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
                  <span className="sd-gpa-chip-num" style={{ color: '#b38e44' }}>{s.cgpa || '—'}</span>
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

              <div className="sd-card-actions">
                <button
                  type="button"
                  className="sd-btn-primary"
                  onClick={() => setIsAcadOpen(true)}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  View Details & Full Transcript
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: VERIFICATION OVERVIEW (Requirement 5) */}
        <section>
          <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Verification Overview
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Only Portal Admin verified items count towards official totals
            </span>
          </div>

          <div className="sd-verif-grid">
            {/* Card 1: Verified Skills */}
            <div className="sd-verif-card" onClick={() => openSkillsTab('skills')}>
              <div className="sd-verif-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <div className="sd-verif-title">Verified Skills</div>
                <div className="sd-verif-count">{verifiedSkillsCount}</div>
                <div className="sd-verif-sub">
                  {skills.length - verifiedSkillsCount > 0 ? `+${skills.length - verifiedSkillsCount} Pending Review` : skills.length === 0 ? 'No verified items yet' : 'All Submissions Verified'}
                </div>
              </div>
            </div>

            {/* Card 2: Verified Projects */}
            <div className="sd-verif-card" onClick={() => openSkillsTab('projects')}>
              <div className="sd-verif-icon-box" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <div className="sd-verif-title">Verified Projects</div>
                <div className="sd-verif-count">{verifiedProjectsCount}</div>
                <div className="sd-verif-sub" style={{ color: '#0369a1' }}>
                  {projects.length - verifiedProjectsCount > 0 ? `+${projects.length - verifiedProjectsCount} Pending Review` : projects.length === 0 ? 'No verified items yet' : 'Institutional Code Verified'}
                </div>
              </div>
            </div>

            {/* Card 3: Verified Internship Experience */}
            <div className="sd-verif-card" onClick={() => openSkillsTab('experience')}>
              <div className="sd-verif-icon-box" style={{ background: '#fef3c7', color: '#b45309' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div>
                <div className="sd-verif-title">Verified Experience</div>
                <div className="sd-verif-count">{verifiedInternshipsCount}</div>
                <div className="sd-verif-sub" style={{ color: '#b45309' }}>
                  {internships.length - verifiedInternshipsCount > 0 ? `+${internships.length - verifiedInternshipsCount} Pending Review` : internships.length === 0 ? 'No verified items yet' : 'Industry Tenures Accredited'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: MY INSTITUTION (Requirement 6) */}
        <section className="sd-card">
          <div className="sd-card-header">
            <h3 className="sd-card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              My Institution Contacts
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Context: {s.institution || 'Institutional Office'} • {s.course || 'Program Office'}
            </span>
          </div>

          <div className="sd-card-body">
            <div className="sd-contacts-grid">
              {(student?.institutionContacts && Array.isArray(student.institutionContacts) && student.institutionContacts.length > 0) ? (
                student.institutionContacts.map((c, i) => (
                  <div key={i} className="sd-contact-card">
                    <span className="sd-contact-role">{c.role}</span>
                    <span className="sd-contact-name">{c.name}</span>
                    <span className="sd-contact-detail">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {c.phone}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{c.dept}</span>
                  </div>
                ))
              ) : (
                [
                  { role: 'Principal / Director', dept: 'Office of the Principal' },
                  { role: 'Head of Department (HOD)', dept: s.course ? `Dept of ${s.course}` : 'Department Office' },
                  { role: 'Academic Advisor', dept: 'Batch Mentor & Faculty' },
                  { role: 'Placement Cell Head', dept: 'Training & Placements Cell' },
                ].map((slot, i) => (
                  <div key={i} className="sd-contact-card" style={{ background: '#fafbfc' }}>
                    <span className="sd-contact-role">{slot.role}</span>
                    <span className="sd-contact-name" style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 500 }}>
                      Not available yet
                    </span>
                    <span className="sd-contact-detail" style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                      Institution contact information will appear after verification
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{slot.dept}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* SECTION 4: INTERNSHIPS & PLACEMENTS + SKILL ASSESSMENTS (Requirements 7 & 8) */}
        <section className="sd-gateways-grid">
          {/* Card: Internships & Placements */}
          <div className="sd-gateway-card featured" onClick={() => setIsInternshipsModalOpen(true)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="sd-gw-icon" style={{ background: '#fdfbf7', color: '#b38e44' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div>
                <h4 className="sd-gw-title">Internships & Placements</h4>
                <p className="sd-gw-desc">
                  Browse verified campus recruitment drives, summer internships, and active applications.
                </p>
              </div>
            </div>
            <button type="button" className="sd-btn-secondary" style={{ flexShrink: 0 }}>
              Explore →
            </button>
          </div>

          {/* Card: Skill Assessments */}
          <div className="sd-gateway-card" onClick={() => setIsAssessmentsModalOpen(true)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="sd-gw-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <h4 className="sd-gw-title">Skill Assessments</h4>
                <p className="sd-gw-desc">
                  Institutional proctored tests, DSA benchmark evaluations, and accredited credential badges.
                </p>
              </div>
            </div>
            <button type="button" className="sd-btn-secondary" style={{ flexShrink: 0 }}>
              View Tests →
            </button>
          </div>
        </section>

        {/* SECTION 5: SKILLS, PROJECTS & INTERNSHIP EXPERIENCE (Requirements 9 & 10) */}
        <section className="sd-card">
          <div className="sd-card-header">
            <h3 className="sd-card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Skills, Projects & Experience Hub
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#166534', fontWeight: 600 }}>
              Portal Admin Verification System Enforced
            </span>
          </div>

          <div className="sd-card-body">
            <p style={{ margin: '0 0 8px', fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
              Manage your technical competencies, code repositories, and work history. All entries require uploaded supporting documentation and must be reviewed by the <strong>Portal Admin</strong> before appearing as verified.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <button
                type="button"
                className="sd-btn-primary"
                onClick={() => openSkillsTab('skills')}
              >
                Manage Technical Skills ({verifiedSkillsCount} Verified)
              </button>
              <button
                type="button"
                className="sd-btn-secondary"
                onClick={() => openSkillsTab('projects')}
              >
                Manage Projects ({verifiedProjectsCount} Verified)
              </button>
              <button
                type="button"
                className="sd-btn-secondary"
                onClick={() => openSkillsTab('experience')}
              >
                Manage Internships ({verifiedInternshipsCount} Verified)
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 6: CREATE PUBLIC POST (Requirement 11) */}
        <section className="sd-post-action-card">
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 700 }}>
              Create Public Post & Community Portfolio
            </h3>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', maxWidth: 640, lineHeight: 1.4 }}>
              Broadcast academic milestones, hackathon awards, and research papers. Submissions undergo review by Portal Admin before publication.
            </p>
          </div>

          <button
            type="button"
            className="sd-post-action-btn"
            onClick={() => setIsPostModalOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create / View Public Posts ({posts.length})
          </button>
        </section>

      </main>

      {/* MODALS */}
      {/* View-Only Profile Photo Lightbox (Requirement 3) */}
      <ProfilePhotoLightbox
        isOpen={isPhotoLightboxOpen}
        onClose={() => setIsPhotoLightboxOpen(false)}
        imageUrl={s.profilePic}
        studentName={s.name}
      />

      {/* Notifications Modal (Requirement 12) */}
      <NotificationsModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }}
        onClearAll={() => {
          setNotifications([])
        }}
      />

      {/* Academic Information Modal (Requirement 4) */}
      <AcademicDetailsModal
        isOpen={isAcadOpen}
        onClose={() => setIsAcadOpen(false)}
        student={s}
      />

      {/* Skills, Projects & Experience Modal (Requirements 5, 9, 10) */}
      <SkillsProjectsModal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
        initialTab={skillsInitialTab}
        skills={skills}
        projects={projects}
        internships={internships}
        onAddSkill={handleAddSkill}
        onAddProject={handleAddProject}
        onAddInternship={handleAddInternship}
      />

      {/* Public Post Modal (Requirement 11) */}
      <PublicPostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        posts={posts}
        onCreatePost={handleCreatePost}
        onSubmitDraft={handleSubmitPostDraft}
      />

      {/* Internships & Placements Modal (Requirement 7) */}
      <InternshipsPlacementsModal
        isOpen={isInternshipsModalOpen}
        onClose={() => setIsInternshipsModalOpen(false)}
        student={s}
      />

      {/* Skill Assessments Modal (Requirement 8) */}
      <SkillAssessmentsModal
        isOpen={isAssessmentsModalOpen}
        onClose={() => setIsAssessmentsModalOpen(false)}
      />

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
          student={s}
          onPasswordChanged={handlePasswordChanged}
        />
      )}
    </div>
  )
}
