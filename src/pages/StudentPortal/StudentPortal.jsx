import { useState } from 'react'
import StudentProfileOnboarding from './StudentProfileOnboarding'
import StudentProfileDiffView from './StudentProfileDiffView'
import StudentDashboard from './StudentDashboard/StudentDashboard'

function StudentPortal({
  onNavigateHome,
  studentData = null,
}) {
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

  // View state: 'auto' | 'edit_form' | 'diff_view'
  const [activeView, setActiveView] = useState('auto')

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
  const showDashboard = isProfileCompleted && verificationStatus === 'verified' && activeView !== 'diff_view' && activeView !== 'edit_form'
  const showDiffView = activeView === 'diff_view' || (isProfileCompleted && hasPendingChanges && activeView !== 'edit_form' && activeView !== 'auto_dashboard')
  const showEditForm = activeView === 'edit_form'
  const showFirstTimeOnboarding = (!isProfileCompleted || verificationStatus === 'unverified' || verificationStatus === 'draft') && !showDashboard && !showDiffView && !showEditForm && !['pending', 'approved', 'rejected'].includes(verificationStatus)

  return (
    <div className="sp-canvas">
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
      `}</style>

      {/* Top Gold Accent Bar */}
      {!showDashboard && <div className="sp-gold-accent-bar" />}

      {/* Top Navigation Navbar */}
      {!showDashboard && (
        <header className="sp-top-navbar">
          <div className="sp-brand-block">
            <h1 className="sp-brand-title">Student Portal</h1>
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

      {/* ===================================================================== */}
      {/* 1. EDIT PROFILE FORM VIEW (When student clicked Edit Profile)          */}
      {/* ===================================================================== */}
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

      {/* ===================================================================== */}
      {/* 2. PENDING CHANGES COMPARISON VIEW (Requirement 6)                     */}
      {/* ===================================================================== */}
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

      {/* ===================================================================== */}
      {/* 3. FIRST-TIME DEDICATED ONBOARDING PAGE (Requirements 1 - 4, 8)       */}
      {/* ===================================================================== */}
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

      {/* ===================================================================== */}
      {/* 4. VERIFICATION REVIEW STATES (Pending / Approved / Rejected)          */}
      {/* ===================================================================== */}
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
                    Your profile verification was not approved by your Institution. Please review the reviewer's remarks below and re-submit.
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

      {/* ===================================================================== */}
      {/* 5. MAIN DEDICATED STUDENT DASHBOARD COMPONENT                         */}
      {/* ===================================================================== */}
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

      {/* Footer */}
      {!showDashboard && (
        <footer className="sp-footer">
          <div className="sp-footer-inner">
            <div>
              <span className="sp-footer-brand">Student Portal</span>
            </div>
            <div>Portal for Academia–Industry Collaboration</div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default StudentPortal
