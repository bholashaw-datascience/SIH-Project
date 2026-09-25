import { useState } from 'react'
import StudentProfileOnboarding from './StudentProfileOnboarding'
import StudentProfileDiffView from './StudentProfileDiffView'
import StudentDashboard from './StudentDashboard/StudentDashboard'
import StudentAchievementsExperience from './StudentAchievementsExperience'
import PublicPost from './PublicPost'
import StudentInternships from './StudentInternships'
import StudentPlacements from './StudentPlacements'
import StudentSkillAssessments from './StudentSkillAssessments'
import PortalFooter from '../../components/PortalFooter'
import StudentPortalPageHeader from '../../components/StudentPortalPageHeader'

function StudentPortal({
  onNavigateHome,
  studentData = null,
  isDemoMode = false,
}) {
  const isDemoActive =
    isDemoMode ||
    (typeof window !== 'undefined' &&
      (window.location.hash.includes('demo') ||
        new URLSearchParams(window.location.search).get('demo') === 'true'))

  const [demoStep, setDemoStep] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const s = parseInt(params.get('step'), 10)
      if (s >= 1 && s <= 5) return s
      if (params.get('view') === 'achievements_experience' || window.location.hash.includes('achievements')) {
        return 5
      }
      if (params.get('view') === 'public_post' || window.location.hash.includes('public-post') || window.location.hash.includes('public_post')) {
        return 5
      }
      if (params.get('view') === 'internships' || window.location.hash.includes('internships')) {
        return 5
      }
      if (params.get('view') === 'placements' || window.location.hash.includes('placements')) {
        return 5
      }
      if (params.get('view') === 'skill_assessments' || window.location.hash.includes('skill-assessments') || window.location.hash.includes('skill_assessments')) {
        return 5
      }
    } catch {}
    return 1
  })
  // Retrieve active student or fallback to empty real record
  const student =
    studentData ||
    (() => {
      try {
        const active = JSON.parse(localStorage.getItem('udaan_active_student') || 'null')
        const registered = JSON.parse(localStorage.getItem('udaan_registered_accounts') || '[]')
        const lastStudent = registered.slice().reverse().find((a) => a.role === 'student')

        if (active && active.role === 'student') {
          if (!active.profilePic && lastStudent && lastStudent.username === active.username) {
            return { ...active, profilePic: lastStudent.profilePic }
          }
          return active
        }
        if (lastStudent) return lastStudent
      } catch {}
      return {
        name: '',
        username: '',
        email: '',
        phone: '',
        profilePic: null,
        institution: '',
        branch: '',
        course: '',
        semester: '',
        currentYear: '',
        enrollmentId: '',
        collegeRoll: '',
        universityRoll: '',
        admissionYear: '',
        completionYear: '',
        sgpa: '',
        ygpa: '',
        cgpa: '',
        presentAddress: '',
        permanentAddress: '',
        dob: '',
        gender: '',
        role: 'student',
        verificationStatus: 'unverified',
      }
    })()

  // 1. Verification Status State: 'unverified' | 'draft' | 'pending' | 'approved' | 'rejected' | 'verified'
  const [verificationStatus, setVerificationStatus] = useState(() => {
    try {
      const stored = localStorage.getItem('udaan_student_verification_status')
      if (['verified', 'approved', 'pending', 'rejected', 'draft', 'unverified'].includes(stored)) {
        return stored
      }
      const active = JSON.parse(localStorage.getItem('udaan_active_student') || 'null')
      if (active?.verificationStatus) return active.verificationStatus
    } catch {}
    return 'unverified'
  })

  // 2. Profile Setup Completed Flag
  const [isProfileCompleted, setIsProfileCompleted] = useState(() => {
    try {
      const stored = localStorage.getItem('udaan_student_profile_completed')
      return stored === 'true'
    } catch {}
    return false
  })

  // 3. Draft Profile State
  const [draftProfile, setDraftProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('udaan_student_draft_profile')
      if (stored) return JSON.parse(stored)
    } catch {}
    return null
  })

  // 4. Pending Submission Profile State
  const [pendingProfile, setPendingProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('udaan_student_pending_profile')
      if (stored) return JSON.parse(stored)
    } catch {}
    return null
  })

  // 5. Verified Live Profile Data & Documents
  const [verifiedProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('udaan_student_verified_profile')
      if (stored) return JSON.parse(stored)
    } catch {}
    return {
      formData: {},
      documents: {},
    }
  })

  // 6. Pending Changes Flag for Already Verified Student
  const [hasPendingChanges, setHasPendingChanges] = useState(() => {
    try {
      return localStorage.getItem('udaan_student_has_pending_changes') === 'true'
    } catch {}
    return false
  })

  // 7. Rejection Reason
  const [rejectionReason] = useState(() => {
    try {
      return localStorage.getItem('udaan_student_rejection_reason') || ''
    } catch {}
    return ''
  })

  // View state: 'auto' | 'edit_form' | 'diff_view' | 'achievements_experience'
  const [activeView, setActiveView] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get('view') === 'achievements_experience' || window.location.hash.includes('achievements')) {
        return 'achievements_experience'
      }
      if (params.get('view') === 'public_post' || window.location.hash.includes('public-post') || window.location.hash.includes('public_post')) {
        return 'public_post'
      }
      if (params.get('view') === 'internships' || window.location.hash.includes('internships')) {
        return 'internships'
      }
      if (params.get('view') === 'placements' || window.location.hash.includes('placements')) {
        return 'placements'
      }
      if (params.get('view') === 'skill_assessments' || window.location.hash.includes('skill-assessments') || window.location.hash.includes('skill_assessments')) {
        return 'skill_assessments'
      }
    } catch {}
    return 'auto'
  })
  const [achievementsTab, setAchievementsTab] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab')
      if (['skills', 'projects', 'experience'].includes(tab)) {
        return tab
      }
    } catch {}
    return 'skills'
  })

  // Helper to persist verification state changes
  const updateVerificationStatus = (newStatus) => {
    setVerificationStatus(newStatus)
    try {
      localStorage.setItem('udaan_student_verification_status', newStatus)
      const active = JSON.parse(localStorage.getItem('udaan_active_student') || 'null')
      if (active) {
        active.verificationStatus = newStatus
        localStorage.setItem('udaan_active_student', JSON.stringify(active))
      }
    } catch {}
  }

  // --- ACTIONS ---

  // Action: Save Draft
  const handleSaveDraft = ({ formData, documents, savedAt }) => {
    const draft = { formData, documents, savedAt }
    setDraftProfile(draft)
    try {
      localStorage.setItem('udaan_student_draft_profile', JSON.stringify(draft))
      localStorage.setItem('udaan_student_verification_status', 'draft')
    } catch {}
    setVerificationStatus('draft')
  }

  // Action: Submit for Verification
  const handleSubmitForVerification = ({ formData, documents, submittedAt }) => {
    const submission = { formData, documents, submittedAt }
    setPendingProfile(submission)
    try {
      localStorage.setItem('udaan_student_pending_profile', JSON.stringify(submission))
      localStorage.setItem('udaan_student_verification_status', 'pending')
      // If student was already verified and is submitting edits:
      if (isProfileCompleted) {
        localStorage.setItem('udaan_student_has_pending_changes', 'true')
        setHasPendingChanges(true)
      }
    } catch {}
    setVerificationStatus('pending')
    setActiveView('auto')
  }

  // Action: Re-apply / Edit after rejection
  const handleEditAndResubmit = () => {
    setActiveView('edit_form')
  }

  const handleProceedToDashboard = () => {
    updateVerificationStatus('verified')
    setIsProfileCompleted(true)
    try {
      localStorage.setItem('udaan_student_profile_completed', 'true')
    } catch {}
    setActiveView('auto')
  }

  // Determine current active display profile
  const currentLive = verifiedProfile.formData || student

  // Determine current route/screen:
  // Rule 1 & 8: Main Student Dashboard opens ONLY after profile setup completed AND status is verified.
  const showAchievementsExperience = activeView === 'achievements_experience'
  const showPublicPost = activeView === 'public_post'
  const showInternships = activeView === 'internships'
  const showPlacements = activeView === 'placements'
  const showSkillAssessments = activeView === 'skill_assessments'
  const showDashboard = isProfileCompleted && verificationStatus === 'verified' && activeView !== 'diff_view' && activeView !== 'edit_form' && !showAchievementsExperience && !showPublicPost && !showInternships && !showPlacements && !showSkillAssessments
  const showDiffView = (activeView === 'diff_view' || (isProfileCompleted && hasPendingChanges && activeView !== 'edit_form' && activeView !== 'auto_dashboard')) && !showAchievementsExperience && !showPublicPost && !showInternships && !showPlacements && !showSkillAssessments
  const showEditForm = activeView === 'edit_form' && !showAchievementsExperience && !showPublicPost && !showInternships && !showPlacements && !showSkillAssessments
  const showFirstTimeOnboarding = (!isProfileCompleted || verificationStatus === 'unverified' || verificationStatus === 'draft') && !showDashboard && !showDiffView && !showEditForm && !showAchievementsExperience && !showPublicPost && !showInternships && !showPlacements && !showSkillAssessments && !['pending', 'approved', 'rejected'].includes(verificationStatus)

  return (
    <div className={`sp-canvas ${isDemoActive && demoStep === 4 ? 'sp-canvas-step4' : ''} ${isDemoActive && demoStep === 3 ? 'sp-canvas-step3' : ''}`}>
      <style>{`
        html,
        body,
        #root {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          border-inline: none !important;
          min-height: 100vh !important;
          background-color: #f5f2ea !important;
          display: flex !important;
          flex-direction: column !important;
          box-sizing: border-box !important;
        }

        .sp-canvas {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100%;
          margin: 0;
          padding: 0;
          background-color: #f5f2ea;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #0f1d2f;
          box-sizing: border-box;
        }

        .sp-gold-accent-bar {
          height: 3px;
          background: linear-gradient(90deg, #b3881e 0%, #f1cf7c 50%, #b3881e 100%);
          width: 100%;
        }

        .sp-top-navbar {
          background-color: #112233;
          color: #ffffff;
          padding: 14px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 16px rgba(15, 29, 47, 0.12);
        }

        .onb-top-nav-bar {
          background-color: #112233;
          color: #ffffff;
          padding: clamp(8px, 1.2vh, 12px) 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 2px 8px rgba(15, 29, 47, 0.12);
          width: 100%;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .onb-brand-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .onb-brand-tag {
          background: rgba(179, 136, 30, 0.22);
          border: 1px solid #b3881e;
          color: #f1cf7c;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .onb-nav-title {
          font-size: 17px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: normal;
        }

        .onb-nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .onb-return-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
          padding: 7px 14px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
        }

        .onb-return-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: #b3881e;
          color: #f1cf7c;
        }

        .sp-brand-block {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sp-brand-title {
          font-size: 19px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .sp-header-actions {
          display: flex;
          align-items: center;
          gap: 18px;
        }


        .sp-user-summary {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: rgba(255, 255, 255, 0.05);
          padding: 4px 12px 4px 6px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sp-avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #1b525c;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .sp-avatar-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sp-user-info {
          display: flex;
          flex-direction: column;
        }

        .sp-user-name {
          font-size: 12.5px;
          font-weight: 600;
          color: #ffffff;
        }

        .sp-user-role {
          font-size: 10.5px;
          color: #8c9ba5;
        }

        .sp-exit-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.18s ease;
          font-family: inherit;
        }

        .sp-exit-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: #b3881e;
          color: #f1cf7c;
        }

        /* Workspace container */
        .sp-workspace-container {
          flex: 1;
          width: 100%;
          margin: 0;
          padding: 28px 36px 48px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Review Frames (Pending / Approved / Rejected) */
        .sp-pending-frame {
          max-width: 680px;
          width: 100%;
          margin: 16px auto;
          background: #ffffff;
          border: 1px solid #ded9cc;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(15, 29, 47, 0.06);
          overflow: hidden;
        }

        .sp-pending-banner {
          padding: 28px 32px;
          text-align: center;
          color: #ffffff;
        }

        .sp-pending-banner-pending {
          background: linear-gradient(135deg, #112233 0%, #1a3956 100%);
          border-bottom: 3px solid #b3881e;
        }

        .sp-pending-banner-approved {
          background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
          border-bottom: 3px solid #34d399;
        }

        .sp-pending-banner-rejected {
          background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
          border-bottom: 3px solid #f87171;
        }

        .sp-pending-icon-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #f1cf7c;
        }

        .sp-status-icon-approved {
          color: #a7f3d0 !important;
        }

        .sp-status-icon-rejected {
          color: #fecaca !important;
        }

        .sp-pending-heading {
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 8px;
          color: #ffffff;
        }

        .sp-pending-sub {
          font-size: 13.5px;
          line-height: 1.5;
          margin: 0 auto;
          max-width: 500px;
          opacity: 0.9;
        }

        .sp-pending-body {
          padding: 28px 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .sp-rejection-box {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-left: 4px solid #dc2626;
          padding: 14px 18px;
          border-radius: 4px;
          color: #991b1b;
          font-size: 13.5px;
          line-height: 1.5;
        }

        .sp-pending-summary-card {
          background-color: #faf7f0;
          border: 1px solid #ede8de;
          border-radius: 6px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sp-summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f0eae1;
        }

        .sp-summary-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .sp-summary-label {
          color: #64748b;
          font-weight: 500;
        }

        .sp-summary-val {
          color: #0f1d2f;
          font-weight: 600;
        }

        .sp-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .sp-status-pill-pending {
          background-color: #fef3c7;
          color: #92400e;
          border: 1px solid #fcd34d;
        }

        .sp-status-dot-pending {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #d97706;
        }

        .sp-status-pill-approved {
          background-color: #d1fae5;
          color: #065f46;
          border: 1px solid #6ee7b7;
        }

        .sp-status-dot-approved {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #059669;
        }

        .sp-status-pill-rejected {
          background-color: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .sp-status-dot-rejected {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #dc2626;
        }

        .sp-reapply-btn {
          background-color: #112233;
          color: #ffffff;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13.5px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
        }

        .sp-reapply-btn:hover {
          background-color: #1b525c;
        }

        .sp-proceed-btn {
          background-color: #059669;
          color: #ffffff;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
        }

        .sp-proceed-btn:hover {
          background-color: #047857;
        }


        /* Responsive */
        @media (max-width: 880px) {
          .sp-top-navbar {
            padding: 14px 18px;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .sp-header-actions {
            width: 100%;
            justify-content: space-between;
            flex-wrap: wrap;
          }
          .sp-workspace-container {
            padding: 20px 16px 36px;
            gap: 18px;
          }
          .sp-profile-overview-grid {
            grid-template-columns: 1fr;
          }
          .sp-welcome-avatar-group {
            flex-direction: column;
            align-items: flex-start;
          }
          .sp-dash-top-actions {
            align-items: flex-start;
          }
        }

        /* ===================================================================
           Step 3 & 4 Demo Preview: Full-Page Viewport Layouts
           =================================================================== */
        @media (min-width: 900px) and (min-height: 550px) {
          .sp-canvas-step3 {
            height: 100vh !important;
            max-height: 100vh !important;
            min-height: 100vh !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          .sp-step3-wrapper {
            height: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 0;
          }
        }

        /* Step 4 Single-Viewport Desktop Institutional Portal Layout */
        .sp-canvas-step4 {
          height: 100vh !important;
          max-height: 100vh !important;
          min-height: 100vh !important;
          display: flex !important;
          flex-direction: column !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
        }

        .sp-step2-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 0;
          box-sizing: border-box;
        }

        .sp-step4-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 0;
          box-sizing: border-box;
        }

        /* 1. Content Container */

        /* 2. Structured Content Container */
        .sp-step4-content-container {
          max-width: 980px;
          width: 100%;
          margin: 0 auto;
          padding: 0 clamp(20px, 3vw, 40px);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex: 1;
          min-height: 0;
        }

        /* 3. Section Card (Matching Step 3 Section Card) */
        .sp-step4-section-card {
          background: #ffffff;
          border: 1.5px solid #ded9cc;
          border-radius: 10px;
          box-shadow: 0 6px 22px rgba(15, 29, 47, 0.07);
          display: flex;
          flex-direction: column;
          width: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }

        .sp-step4-card-header {
          background-color: #faf7f0;
          border-bottom: 1px solid #ede8de;
          padding: clamp(8px, 1.2vh, 12px) clamp(16px, 2vw, 24px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
        }

        .sp-step4-card-title-wrap {
          display: flex;
          flex-direction: column;
        }

        .sp-step4-card-title {
          font-size: 15.5px;
          font-weight: 700;
          color: #0f1d2f;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .sp-step4-card-desc {
          font-size: 12px;
          color: #64748b;
          margin: 2px 0 0;
        }

        .sp-step4-card-body {
          padding: clamp(4px, 0.8vh, 8px) clamp(16px, 2vw, 24px);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .sp-step4-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: clamp(5.5px, 0.85vh, 8px) 8px;
          border-bottom: 1px solid #f1ebe0;
          box-sizing: border-box;
          transition: background-color 0.15s ease;
          border-radius: 4px;
        }

        .sp-step4-row:hover {
          background-color: #faf8f4;
        }

        .sp-step4-row:last-child {
          border-bottom: none;
        }

        .sp-step4-label {
          color: #64748b;
          font-weight: 600;
          font-size: clamp(12.5px, 1.3vh, 13.5px);
          letter-spacing: 0.01em;
        }

        .sp-step4-val {
          color: #0f1d2f;
          font-weight: 600;
          font-size: clamp(13px, 1.35vh, 14px);
          text-align: right;
        }

        /* 4. Centered Action Button Area (No outer card/box) */
        .sp-step4-action-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-top: clamp(14px, 2vh, 22px);
          flex-shrink: 0;
          box-sizing: border-box;
        }

        .sp-step4-proceed-btn {
          background-color: #059669;
          color: #ffffff;
          border: none;
          padding: 10px 28px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 13.5px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.2);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .sp-step4-proceed-btn:hover {
          background-color: #047857;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.32);
        }

        /* 5. Step 4 Footer Docking (Matching Step 3 Footer) */
        .sp-step4-footer {
          margin-top: auto !important;
          margin-bottom: 54px !important;
          padding: 11px 36px !important;
          font-size: 12.5px !important;
          width: 100% !important;
          box-sizing: border-box !important;
          z-index: 10 !important;
          flex-shrink: 0 !important;
        }

        .sp-step4-footer .portal-footer-inner {
          max-width: 1200px !important;
          width: 100% !important;
          margin: 0 auto !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
        }

        @media (max-width: 768px) {
          .sp-step4-content-container {
            padding: 0 16px;
          }
        }

        /* Development-Only Demo Floating Bar */
        .sp-demo-floating-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #0f1d2f;
          color: #ffffff;
          border-top: 3px solid #b3881e;
          box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.35);
          z-index: 99999;
          padding: 12px 28px;
          font-family: inherit;
          box-sizing: border-box;
        }

        .sp-demo-bar-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .sp-demo-bar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sp-demo-mode-badge {
          background-color: #b3881e;
          color: #0f1d2f;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .sp-demo-step-text {
          font-size: 13px;
          color: #c7d5e0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sp-demo-step-num {
          color: #f1cf7c;
          font-weight: 600;
        }

        .sp-demo-step-name {
          color: #ffffff;
        }

        .sp-demo-bar-dots {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sp-demo-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          color: #c7d5e0;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .sp-demo-dot.is-active {
          background-color: #b3881e;
          border-color: #f1cf7c;
          color: #0f1d2f;
        }

        .sp-demo-dot.is-done {
          background-color: #1b525c;
          border-color: #34d399;
          color: #ffffff;
        }

        .sp-demo-dot-line {
          width: 18px;
          height: 2px;
          background-color: rgba(255, 255, 255, 0.2);
        }

        .sp-demo-bar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sp-demo-btn {
          padding: 7px 15px;
          font-size: 12.5px;
          font-weight: 700;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
        }

        .sp-demo-btn-prev {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .sp-demo-btn-prev:hover {
          background-color: rgba(255, 255, 255, 0.2);
          border-color: #ffffff;
        }

        .sp-demo-btn-next {
          background-color: #b3881e;
          border: 1.5px solid #f1cf7c;
          color: #0f1d2f;
          padding: 8px 18px;
          box-shadow: 0 2px 8px rgba(179, 136, 30, 0.4);
        }

        .sp-demo-btn-next:hover {
          background-color: #d4a329;
          transform: translateY(-1px);
        }

        .sp-demo-btn-restart {
          background-color: rgba(27, 82, 92, 0.4);
          border: 1px solid #1b525c;
          color: #a7f3d0;
        }

        .sp-demo-btn-restart:hover {
          background-color: #1b525c;
          color: #ffffff;
        }

        .sp-demo-btn-exit {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #94a3b8;
        }

        .sp-demo-btn-exit:hover {
          color: #ffffff;
          border-color: #ef4444;
        }

        /* ===================================================================
           Step 1: First-Time Student Profile / Verification Onboarding
           =================================================================== */
        .sp-step1-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 0;
          box-sizing: border-box;
        }



        /* Content Container */
        .sp-step1-content-container {
          max-width: 840px;
          width: 100%;
          margin: 0 auto;
          padding: clamp(16px, 2.5vh, 28px) clamp(20px, 3vw, 36px);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex: 1;
          min-height: 0;
        }

        /* Central Institutional Onboarding Card */
        .sp-step1-card {
          background: #ffffff;
          border: 1.5px solid #ded9cc;
          border-radius: 10px;
          box-shadow: 0 4px 18px rgba(15, 29, 47, 0.06);
          display: flex;
          flex-direction: column;
          width: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }

        .sp-step1-card-header {
          background-color: #faf7f0;
          border-bottom: 1px solid #ede8de;
          padding: 12px 24px;
          box-sizing: border-box;
        }

        .sp-step1-card-title-wrap {
          display: flex;
          flex-direction: column;
        }

        .sp-step1-card-title {
          font-size: 15.5px;
          font-weight: 700;
          color: #0f1d2f;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .sp-step1-card-desc {
          font-size: 12px;
          color: #64748b;
          margin: 2px 0 0;
        }

        .sp-step1-card-body {
          padding: clamp(16px, 2.2vh, 24px) clamp(20px, 2.5vw, 28px);
          display: flex;
          align-items: center;
          gap: clamp(20px, 3vw, 32px);
          box-sizing: border-box;
        }

        /* Profile Photo Avatar Column */
        .sp-step1-avatar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sp-step1-avatar-frame {
          width: clamp(80px, 9vw, 96px);
          height: clamp(80px, 9vw, 96px);
          border-radius: 50%;
          border: 3px solid #b3881e;
          background-color: #faf7f0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(15, 29, 47, 0.1);
        }

        .sp-step1-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .sp-step1-avatar-placeholder {
          font-size: clamp(30px, 3.5vw, 36px);
          font-weight: 800;
          color: #1b525c;
        }

        /* Info Column */
        .sp-step1-info-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 0;
        }

        .sp-step1-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background-color: #faf7f0;
          border: 1px solid #ede8de;
          border-radius: 6px;
          box-sizing: border-box;
          transition: background-color 0.15s ease;
        }

        .sp-step1-row:hover {
          background-color: #f5f0e3;
        }

        .sp-step1-label {
          color: #64748b;
          font-weight: 600;
          font-size: 12.5px;
          letter-spacing: 0.01em;
          flex-shrink: 0;
        }

        .sp-step1-val {
          color: #0f1d2f;
          font-weight: 600;
          font-size: 13.5px;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-left: 12px;
        }

        .sp-step1-val-name {
          font-weight: 700;
          color: #112233;
          font-size: 14.5px;
        }

        /* Action Row with Prominent Primary CTA */
        .sp-step1-action-row {
          padding: 14px 24px 18px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-top: 1px solid #f1ece1;
          background-color: #faf8f4;
          box-sizing: border-box;
        }

        .sp-step1-cta-btn {
          background-color: #059669;
          color: #ffffff;
          border: none;
          padding: 11px 28px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.18s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.22);
          font-family: inherit;
        }

        .sp-step1-cta-btn:hover {
          background-color: #047857;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.32);
        }

        .sp-step1-cta-arrow {
          font-size: 15px;
          transition: transform 0.15s ease;
        }

        .sp-step1-cta-btn:hover .sp-step1-cta-arrow {
          transform: translateX(2px);
        }

        /* Footer in Step 1 */
        .sp-step1-footer {
          margin-top: auto !important;
          margin-bottom: 54px !important;
          padding: 11px 36px !important;
          font-size: 12.5px !important;
          width: 100% !important;
          box-sizing: border-box !important;
          z-index: 10 !important;
          flex-shrink: 0 !important;
        }

        .sp-step1-footer .portal-footer-inner {
          max-width: 1200px !important;
          width: 100% !important;
          margin: 0 auto !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
        }

        @media (max-width: 640px) {
          .sp-step1-card-body {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }
          .sp-step1-info-col {
            width: 100%;
          }
          .sp-step1-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
          }
          .sp-step1-val {
            margin-left: 0;
            text-align: left;
          }
          .sp-step1-cta-btn {
            width: 100%;
          }
        }
      `}</style>

      {/* Top Gold Accent Bar (Non-demo mode only) */}
      {(!isDemoActive && !showDashboard && !showAchievementsExperience) && <div className="sp-gold-accent-bar" />}

      {/* Top Navigation Navbar for Non-Demo flow */}
      {(!isDemoActive && !showDashboard && !showAchievementsExperience) && (
        <header className="sp-top-navbar">
          <div className="sp-brand-block">
            <h1 className="sp-brand-title">IAS Collaboration Portal</h1>
          </div>

          <div className="sp-header-actions">
            <div className="sp-user-summary">
              <div className="sp-avatar-circle">
                {currentLive.profilePic ? (
                  <img src={currentLive.profilePic} alt={currentLive.name || 'Student'} />
                ) : (
                  (currentLive.name || student.name || 'S').charAt(0).toUpperCase()
                )}
              </div>
              <div className="sp-user-info">
                <span className="sp-user-name">{currentLive.name || student.name || 'Student Account'}</span>
                <span className="sp-user-role">{student.username ? `@${student.username}` : 'Official Record'}</span>
              </div>
            </div>

            <button
              type="button"
              className="sp-exit-btn"
              onClick={onNavigateHome}
              aria-label="Return to Main Portal"
            >
              <span>← Back to Home</span>
            </button>
          </div>
        </header>
      )}

      {/* Top Navigation Navbar for Demo Preview Steps 1 & 4 (Matching Step 3 Reference Design) */}
      {(isDemoActive && (demoStep === 1 || demoStep === 4)) && (
        <header className="onb-top-nav-bar">
          <div className="onb-brand-row">
            <span className="onb-brand-tag">Student Pathway</span>
            <h1 className="onb-nav-title">IAS Collaboration Portal</h1>
          </div>

          <div className="onb-nav-actions">
            <button
              type="button"
              className="onb-return-btn"
              onClick={onNavigateHome}
              aria-label="Return to Main Portal"
            >
              <span>← Back to Home</span>
            </button>
          </div>
        </header>
      )}

      {/* ===================================================================== */}
      {/* DEVELOPMENT DEMO PREVIEW FLOW (Step 1 -> Step 2 -> Step 3)            */}
      {/* ===================================================================== */}
      {isDemoActive ? (
        <>
          {/* STEP 1: First-Time Student Profile Screen */}
          {demoStep === 1 && (
            <div className="sp-step1-wrapper">
              <StudentPortalPageHeader
                eyebrow="Institutional Verification Protocol"
                title="First-Time Student Profile"
                description="Welcome to your student workspace. Review your registered identity credentials and complete your profile to submit for institutional verification."
              />

              {/* Central Content Area */}
              <div className="sp-step1-content-container">
                <section className="sp-step1-card">
                  <div className="sp-step1-card-header">
                    <div className="sp-step1-card-title-wrap">
                      <h3 className="sp-step1-card-title">Registered Account Identity</h3>
                      <p className="sp-step1-card-desc">
                        Official primary credentials registered on the portal
                      </p>
                    </div>
                  </div>

                  <div className="sp-step1-card-body">
                    {/* 1. Student Profile Picture */}
                    <div className="sp-step1-avatar-col">
                      <div className="sp-step1-avatar-frame" title="Student Profile Photo">
                        {currentLive.profilePic ? (
                          <img
                            src={currentLive.profilePic}
                            alt={currentLive.name || student.name || 'Student Profile'}
                            className="sp-step1-avatar-img"
                          />
                        ) : (
                          <span className="sp-step1-avatar-placeholder">
                            {(currentLive.name || student.name || 'S').charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Student Identity Information: 2. Name, 3. Email, 4. Phone Number */}
                    <div className="sp-step1-info-col">
                      <div className="sp-step1-row">
                        <span className="sp-step1-label">Student Name</span>
                        <span className="sp-step1-val sp-step1-val-name">
                          {currentLive.name || student.name || '—'}
                        </span>
                      </div>

                      <div className="sp-step1-row">
                        <span className="sp-step1-label">Email Address</span>
                        <span className="sp-step1-val">
                          {currentLive.email || student.email || '—'}
                        </span>
                      </div>

                      <div className="sp-step1-row">
                        <span className="sp-step1-label">Phone Number</span>
                        <span className="sp-step1-val">
                          {currentLive.phone || student.phone || '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 5. One primary CTA: Complete Your Profile & Send for Verification */}
                  <div className="sp-step1-action-row">
                    <button
                      type="button"
                      className="sp-step1-cta-btn"
                      onClick={() => setDemoStep(2)}
                    >
                      <span>Complete Your Profile &amp; Send for Verification</span>
                      <span className="sp-step1-cta-arrow">→</span>
                    </button>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* STEP 2: Edit / Complete Student Profile page */}
          {demoStep === 2 && (
            <div className="sp-step2-wrapper">
              <StudentProfileOnboarding
                initialData={draftProfile?.formData || student}
                initialDocuments={draftProfile?.documents || {}}
                draftSavedTime={draftProfile?.savedAt}
                onSaveDraft={handleSaveDraft}
                onSubmitVerification={handleSubmitForVerification}
                onProceedToDocuments={() => setDemoStep(3)}
                onBackHome={() => setDemoStep(1)}
                isEditMode={false}
                rejectionNotice={null}
                activeSection="profile"
              />
            </div>
          )}

          {/* STEP 3: Required Documents Upload section/page */}
          {demoStep === 3 && (
            <div className="sp-step3-wrapper">
              <StudentProfileOnboarding
                initialData={draftProfile?.formData || student}
                initialDocuments={draftProfile?.documents || {}}
                draftSavedTime={draftProfile?.savedAt}
                onSaveDraft={handleSaveDraft}
                onSubmitVerification={() => setDemoStep(4)}
                onBackHome={() => setDemoStep(2)}
                isEditMode={false}
                rejectionNotice={null}
                activeSection="documents"
              />
            </div>
          )}

          {/* STEP 4: Submit for Verification / Verification Status */}
          {demoStep === 4 && (
            <div className="sp-step4-wrapper">
              <StudentPortalPageHeader
                eyebrow="Institutional Verification Protocol"
                title="Profile Submitted for Verification"
                description="Your profile and documents have been successfully submitted. Your Principal or Institutional Coordinator will review the submitted records to approve your verified profile."
              />

              {/* Structured Content Area (matching Step 3 Content Container) */}
              <div className="sp-step4-content-container">
                {/* Section Card (matching Step 3 Required Documents section card) */}
                <section className="sp-step4-section-card">
                  <div className="sp-step4-card-header">
                    <div className="sp-step4-card-title-wrap">
                      <h3 className="sp-step4-card-title">Submitted Profile Information</h3>
                      <p className="sp-step4-card-desc">
                        Official records and identity details queued for institutional review
                      </p>
                    </div>
                  </div>

                  <div className="sp-step4-card-body">
                    {/* Row 1: Student Name */}
                    <div className="sp-step4-row">
                      <span className="sp-step4-label">Student Name</span>
                      <span className="sp-step4-val">
                        {pendingProfile?.formData?.name || currentLive.name || student.name || '—'}
                      </span>
                    </div>

                    {/* Row 2: Email Address */}
                    <div className="sp-step4-row">
                      <span className="sp-step4-label">Email Address</span>
                      <span className="sp-step4-val">
                        {pendingProfile?.formData?.email || currentLive.email || student.email || '—'}
                      </span>
                    </div>

                    {/* Row 3: Mobile Number */}
                    <div className="sp-step4-row">
                      <span className="sp-step4-label">Mobile Number</span>
                      <span className="sp-step4-val">
                        {pendingProfile?.formData?.phone || currentLive.phone || student.phone || '—'}
                      </span>
                    </div>

                    {/* Row 4: Institution */}
                    <div className="sp-step4-row">
                      <span className="sp-step4-label">Institution</span>
                      <span className="sp-step4-val">
                        {pendingProfile?.formData?.institution || currentLive.institution || student.institution || '—'}
                      </span>
                    </div>

                    {/* Row 5: Course & Year */}
                    <div className="sp-step4-row">
                      <span className="sp-step4-label">Course &amp; Year</span>
                      <span className="sp-step4-val">
                        {[
                          pendingProfile?.formData?.course || currentLive.course || currentLive.branch || student.course || student.branch,
                          pendingProfile?.formData?.currentYear || currentLive.currentYear || student.currentYear,
                        ].filter(Boolean).join(' • ') || '—'}
                      </span>
                    </div>

                    {/* Row 6: Verification Status */}
                    <div className="sp-step4-row">
                      <span className="sp-step4-label">Verification Status</span>
                      <span className="sp-status-pill sp-status-pill-pending">
                        <span className="sp-status-dot-pending" />
                        PENDING VERIFICATION
                      </span>
                    </div>
                  </div>
                </section>

                {/* Centered Proceed Action Button */}
                <div className="sp-step4-action-wrap">
                  <button
                    type="button"
                    className="sp-step4-proceed-btn"
                    onClick={() => setDemoStep(5)}
                  >
                    <span>Proceed to Student Dashboard</span>
                    <span style={{ fontSize: '15px' }}>→</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Student Dashboard */}
          {demoStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <StudentPortalPageHeader
                eyebrow="Institutional Student Workspace"
                title="Student Dashboard"
                description="Official verified student portal for academic performance, accredited internships, campus placements, and verified institutional records."
              />
              {activeView === 'achievements_experience' ? (
                <StudentAchievementsExperience
                  student={currentLive}
                  initialTab={achievementsTab}
                  onBack={() => setActiveView('auto')}
                  onNavigateHome={onNavigateHome}
                />
              ) : activeView === 'public_post' ? (
                <PublicPost
                  student={currentLive}
                  onBack={() => setActiveView('auto')}
                  onNavigateHome={onNavigateHome}
                />
              ) : activeView === 'internships' ? (
                <StudentInternships
                  student={currentLive}
                  onBack={() => setActiveView('auto')}
                  onNavigateHome={onNavigateHome}
                />
              ) : activeView === 'placements' ? (
                <StudentPlacements
                  student={currentLive}
                  onBack={() => setActiveView('auto')}
                  onNavigateHome={onNavigateHome}
                />
              ) : activeView === 'skill_assessments' ? (
                <StudentSkillAssessments
                  student={currentLive}
                  onBack={() => setActiveView('auto')}
                  onOpenDashboard={() => setActiveView('auto')}
                  onOpenAchievementsExperience={(tab) => {
                    setAchievementsTab(tab || 'skills')
                    setActiveView('achievements_experience')
                  }}
                  onOpenInternships={() => setActiveView('internships')}
                  onOpenPlacements={() => setActiveView('placements')}
                  onOpenPublicPost={() => setActiveView('public_post')}
                  onEditProfile={() => setDemoStep(2)}
                  onNavigateHome={onNavigateHome}
                />
              ) : (
                <StudentDashboard
                  student={currentLive}
                  verifiedProfile={verifiedProfile}
                  hasPendingChanges={false}
                  onEditProfile={() => setDemoStep(2)}
                  onViewPendingDiff={() => {}}
                  onOpenAchievementsExperience={(tab) => {
                    setAchievementsTab(tab || 'skills')
                    setActiveView('achievements_experience')
                  }}
                  onOpenPublicPost={() => setActiveView('public_post')}
                  onOpenInternships={() => setActiveView('internships')}
                  onOpenPlacements={() => setActiveView('placements')}
                  onOpenSkillAssessments={() => setActiveView('skill_assessments')}
                  onNavigateHome={onNavigateHome}
                  onLogout={onNavigateHome}
                  verificationStatus="verified"
                  rejectionReason=""
                />
              )}
            </div>
          )}
        </>
      ) : (
        /* NORMAL FLOW */
        <>
          {/* 1. EDIT PROFILE FORM VIEW (When student clicked Edit Profile) */}
          {showEditForm && (
            <StudentProfileOnboarding
              initialData={pendingProfile?.formData || verifiedProfile?.formData || student}
              initialDocuments={pendingProfile?.documents || verifiedProfile?.documents || {}}
              onSaveDraft={handleSaveDraft}
              onSubmitVerification={handleSubmitForVerification}
              onBackHome={() => setActiveView('auto')}
              isEditMode={true}
              rejectionNotice={verificationStatus === 'rejected' ? rejectionReason : null}
            />
          )}

          {/* 2. PENDING CHANGES COMPARISON VIEW (Requirement 6) */}
          {showDiffView && !showEditForm && (
            <StudentProfileDiffView
              verifiedData={verifiedProfile.formData}
              verifiedDocuments={verifiedProfile.documents}
              pendingData={pendingProfile?.formData || verifiedProfile.formData}
              pendingDocuments={pendingProfile?.documents || verifiedProfile.documents}
              pendingStatus={verificationStatus === 'rejected' ? 'rejected' : 'pending'}
              rejectionReason={rejectionReason}
              onEditPending={handleEditAndResubmit}
              onCancelPending={() => {
                setHasPendingChanges(false)
                setPendingProfile(null)
                try {
                  localStorage.setItem('udaan_student_has_pending_changes', 'false')
                  localStorage.removeItem('udaan_student_pending_profile')
                } catch {}
                setActiveView('auto_dashboard')
              }}
              onBackToDashboard={() => setActiveView('auto_dashboard')}
            />
          )}

          {/* 3. FIRST-TIME DEDICATED ONBOARDING PAGE */}
          {showFirstTimeOnboarding && (
            <StudentProfileOnboarding
              initialData={draftProfile?.formData || student}
              initialDocuments={draftProfile?.documents || {}}
              draftSavedTime={draftProfile?.savedAt}
              onSaveDraft={handleSaveDraft}
              onSubmitVerification={handleSubmitForVerification}
              onBackHome={onNavigateHome}
              isEditMode={false}
              rejectionNotice={verificationStatus === 'rejected' ? rejectionReason : null}
            />
          )}

          {/* 4. VERIFICATION REVIEW STATES (Pending / Approved / Rejected) */}
          {!showDashboard && !showDiffView && !showEditForm && !showFirstTimeOnboarding && (
            <main className="sp-workspace-container">
              <div className="sp-pending-frame">
                <div className={`sp-pending-banner sp-pending-banner-${verificationStatus}`}>
                  {verificationStatus === 'pending' && (
                    <>
                      <div className="sp-pending-icon-circle">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <h2 className="sp-pending-heading">Profile Submitted for Verification</h2>
                      <p className="sp-pending-sub">
                        Your profile and documents have been successfully submitted. Your Principal or Institutional Coordinator will review the submitted records to approve your verified profile.
                      </p>
                    </>
                  )}

                  {verificationStatus === 'approved' && (
                    <>
                      <div className="sp-pending-icon-circle sp-status-icon-approved">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                      <h2 className="sp-pending-heading">Profile Verification Approved</h2>
                      <p className="sp-pending-sub">
                        Your profile details and required documents have been verified and approved by your Institution. You may now access the full student portal features.
                      </p>
                    </>
                  )}

                  {verificationStatus === 'rejected' && (
                    <>
                      <div className="sp-pending-icon-circle sp-status-icon-rejected">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                      </div>
                      <h2 className="sp-pending-heading">Profile Verification Rejected</h2>
                      <p className="sp-pending-sub">
                        Your profile verification was not approved by your Institution. Please review the reviewer&apos;s remarks below and re-submit.
                      </p>
                    </>
                  )}
                </div>

                <div className="sp-pending-body">
                  {/* Rejection Note if Rejected */}
                  {verificationStatus === 'rejected' && rejectionReason && (
                    <div className="sp-rejection-box">
                      <strong>Institutional Remarks:</strong> {rejectionReason}
                    </div>
                  )}

                  <div className="sp-pending-summary-card">
                    <div className="sp-summary-row">
                      <span className="sp-summary-label">Student Name</span>
                      <span className="sp-summary-val">{pendingProfile?.formData?.name || currentLive.name}</span>
                    </div>
                    <div className="sp-summary-row">
                      <span className="sp-summary-label">Email Address</span>
                      <span className="sp-summary-val">{pendingProfile?.formData?.email || currentLive.email}</span>
                    </div>
                    <div className="sp-summary-row">
                      <span className="sp-summary-label">Mobile Number</span>
                      <span className="sp-summary-val">{pendingProfile?.formData?.phone || currentLive.phone}</span>
                    </div>
                    <div className="sp-summary-row">
                      <span className="sp-summary-label">Institution</span>
                      <span className="sp-summary-val">{pendingProfile?.formData?.institution || currentLive.institution}</span>
                    </div>
                    <div className="sp-summary-row">
                      <span className="sp-summary-label">Course & Year</span>
                      <span className="sp-summary-val">
                        {pendingProfile?.formData?.course || currentLive.course || currentLive.branch} • {pendingProfile?.formData?.currentYear || currentLive.currentYear || '3rd Year'}
                      </span>
                    </div>
                    <div className="sp-summary-row">
                      <span className="sp-summary-label">Verification Status</span>
                      {verificationStatus === 'pending' && (
                        <span className="sp-status-pill sp-status-pill-pending">
                          <span className="sp-status-dot-pending" />
                          Pending Verification
                        </span>
                      )}
                      {verificationStatus === 'approved' && (
                        <span className="sp-status-pill sp-status-pill-approved">
                          <span className="sp-status-dot-approved" />
                          Approved
                        </span>
                      )}
                      {verificationStatus === 'rejected' && (
                        <span className="sp-status-pill sp-status-pill-rejected">
                          <span className="sp-status-dot-rejected" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* State-Specific Action Buttons */}
                  {verificationStatus === 'rejected' && (
                    <button
                      type="button"
                      className="sp-reapply-btn"
                      onClick={handleEditAndResubmit}
                    >
                      ↻ Edit & Re-submit Profile
                    </button>
                  )}

                  {verificationStatus === 'approved' && (
                    <button
                      type="button"
                      className="sp-proceed-btn"
                      onClick={handleProceedToDashboard}
                    >
                      Proceed to Student Dashboard →
                    </button>
                  )}

                  <button
                    type="button"
                    className="sp-exit-btn"
                    style={{ alignSelf: 'center', color: '#64748b' }}
                    onClick={onNavigateHome}
                  >
                    ← Return to Main Portal
                  </button>
                </div>
              </div>
            </main>
          )}

          {/* 5. MAIN DEDICATED STUDENT DASHBOARD COMPONENT */}
          {showDashboard && (
            <StudentDashboard
              student={currentLive}
              verifiedProfile={verifiedProfile}
              hasPendingChanges={hasPendingChanges}
              onEditProfile={() => {
                if (hasPendingChanges) {
                  setActiveView('diff_view')
                } else {
                  setActiveView('edit_form')
                }
              }}
              onViewPendingDiff={() => setActiveView('diff_view')}
              onOpenAchievementsExperience={(tab) => {
                setAchievementsTab(tab || 'skills')
                setActiveView('achievements_experience')
              }}
              onOpenPublicPost={() => setActiveView('public_post')}
              onOpenInternships={() => setActiveView('internships')}
              onOpenPlacements={() => setActiveView('placements')}
              onOpenSkillAssessments={() => setActiveView('skill_assessments')}
              onNavigateHome={onNavigateHome}
              onLogout={() => {
                try {
                  localStorage.removeItem('udaan_active_student')
                } catch {}
                onNavigateHome?.()
              }}
              verificationStatus={verificationStatus}
              rejectionReason={rejectionReason}
            />
          )}

          {/* 6. DEDICATED ACHIEVEMENTS & EXPERIENCE PAGE */}
          {showAchievementsExperience && (
            <StudentAchievementsExperience
              student={currentLive}
              initialTab={achievementsTab}
              onBack={() => setActiveView('auto')}
              onNavigateHome={onNavigateHome}
            />
          )}

          {/* 7. DEDICATED CREATE PUBLIC POST PAGE */}
          {showPublicPost && (
            <PublicPost
              student={currentLive}
              onBack={() => setActiveView('auto')}
              onNavigateHome={onNavigateHome}
            />
          )}

          {/* 8. DEDICATED INTERNSHIPS PAGE */}
          {showInternships && (
            <StudentInternships
              student={currentLive}
              onBack={() => setActiveView('auto')}
              onNavigateHome={onNavigateHome}
            />
          )}

          {/* 9. DEDICATED PLACEMENTS PAGE */}
          {showPlacements && (
            <StudentPlacements
              student={currentLive}
              onBack={() => setActiveView('auto')}
              onNavigateHome={onNavigateHome}
            />
          )}

          {/* 10. DEDICATED SKILL ASSESSMENTS PAGE */}
          {showSkillAssessments && (
            <StudentSkillAssessments
              student={currentLive}
              onBack={() => setActiveView('auto')}
              onOpenDashboard={() => setActiveView('auto')}
              onOpenAchievementsExperience={(tab) => {
                setAchievementsTab(tab || 'skills')
                setActiveView('achievements_experience')
              }}
              onOpenInternships={() => setActiveView('internships')}
              onOpenPlacements={() => setActiveView('placements')}
              onOpenPublicPost={() => setActiveView('public_post')}
              onEditProfile={() => {
                if (hasPendingChanges) {
                  setActiveView('diff_view')
                } else {
                  setActiveView('edit_form')
                }
              }}
              onNavigateHome={onNavigateHome}
            />
          )}
        </>
      )}

      {/* Official Shared Portal Footer across all Student Portal pages */}
      {(isDemoActive
        ? (demoStep === 1 || demoStep === 4 || demoStep === 5)
        : !(showFirstTimeOnboarding || showEditForm || showDiffView)
      ) && (
        <PortalFooter
          className={
            isDemoActive && demoStep === 1
              ? 'sp-step1-footer'
              : isDemoActive && demoStep === 4
              ? 'sp-step4-footer'
              : ''
          }
          style={isDemoActive ? (demoStep === 1 || demoStep === 4 ? {} : { paddingBottom: '72px' }) : {}}
        />
      )}

      {/* Development-Only Demo Floating Bar (Requirements 5, 6, 7) */}
      {isDemoActive && (
        <aside className="sp-demo-floating-bar" aria-label="Development Demo Controls">
          <div className="sp-demo-bar-inner">
            <div className="sp-demo-bar-left">
              <span className="sp-demo-mode-badge">DEV PREVIEW</span>
              <div className="sp-demo-step-text">
                <span className="sp-demo-step-num">Step {demoStep} of 5:</span>
                <strong className="sp-demo-step-name">
                  {demoStep === 1 && 'First-Time Student Profile'}
                  {demoStep === 2 && 'Edit / Complete Student Profile'}
                  {demoStep === 3 && 'Required Documents Upload'}
                  {demoStep === 4 && 'Submit for Verification / Verification Status'}
                  {demoStep === 5 && 'Student Dashboard'}
                </strong>
              </div>
            </div>

            <div className="sp-demo-bar-dots">
              {[1, 2, 3, 4, 5].map((stepNum) => (
                <span key={stepNum} style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    className={`sp-demo-dot ${demoStep === stepNum ? 'is-active' : demoStep > stepNum ? 'is-done' : ''}`}
                    onClick={() => setDemoStep(stepNum)}
                    title={`Jump to Step ${stepNum}`}
                  >
                    {stepNum}
                  </span>
                  {stepNum < 5 && <span className="sp-demo-dot-line" />}
                </span>
              ))}
            </div>

            <div className="sp-demo-bar-actions">
              {demoStep > 1 && (
                <button
                  type="button"
                  id="demo-prev-btn"
                  className="sp-demo-btn sp-demo-btn-prev"
                  onClick={() => setDemoStep((s) => s - 1)}
                >
                  ← Previous
                </button>
              )}

              {demoStep < 5 && (
                <button
                  type="button"
                  id="demo-next-btn"
                  className="sp-demo-btn sp-demo-btn-next"
                  onClick={() => setDemoStep((s) => s + 1)}
                >
                  <span>Next</span>
                  <span className="sp-demo-arrow">→</span>
                </button>
              )}

              {demoStep === 5 && (
                <button
                  type="button"
                  id="demo-restart-btn"
                  className="sp-demo-btn sp-demo-btn-restart"
                  onClick={() => setDemoStep(1)}
                >
                  ↺ Restart Demo Flow
                </button>
              )}

              <button
                type="button"
                id="demo-exit-btn"
                className="sp-demo-btn sp-demo-btn-exit"
                onClick={onNavigateHome}
              >
                Exit Demo
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}

export default StudentPortal
