import { useState, useEffect, useRef } from 'react'
import ProfilePhotoLightbox from '../pages/StudentPortal/StudentDashboard/ProfilePhotoLightbox'
import NotificationsModal from '../pages/StudentPortal/StudentDashboard/NotificationsModal'
import ChangePasswordModal from '../pages/StudentPortal/StudentDashboard/ChangePasswordModal'
import './StudentDashboardNavbar.css'

export default function StudentDashboardNavbar({
  student = {},
  verifiedProfile = {},
  subtitle = 'Student Overview Dashboard',
  onNavigateHome,
  onBack,
  onEditProfile,
  onLogout,
  onToggleSidebar,
  searchQuery = '',
  onSearchChange,
  unreadCount,
  onOpenNotifications,
  onChangePassword,
  onOpenPhotoLightbox,
}) {
  // Extract student details with clean fallbacks
  const studentName = student?.name || verifiedProfile?.formData?.name || 'Student'
  const studentEmail = student?.email || verifiedProfile?.formData?.email || 'student@ias.edu'
  const studentPic = student?.profilePic || verifiedProfile?.formData?.profilePic || ''
  const studentInitial = (studentName || 'S').charAt(0).toUpperCase()

  // Local state for profile dropdown menu
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)

  // Local search query if parent doesn't handle onSearchChange
  const [localSearch, setLocalSearch] = useState('')

  // Local modal states when parent doesn't provide handlers
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

  // Local notifications synced with localStorage
  const [internalNotifs, setInternalNotifs] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_notifications')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Sync internal notifications on open
  useEffect(() => {
    if (isNotifOpen) {
      try {
        const saved = localStorage.getItem('udaan_student_notifications')
        if (saved) setInternalNotifs(JSON.parse(saved))
      } catch {}
    }
  }, [isNotifOpen])

  const calculatedUnread = internalNotifs.filter((n) => !n.read).length
  const effectiveUnreadCount = typeof unreadCount === 'number' ? unreadCount : calculatedUnread

  const handleMarkAllRead = () => {
    const updated = internalNotifs.map((n) => ({ ...n, read: true }))
    setInternalNotifs(updated)
    try {
      localStorage.setItem('udaan_student_notifications', JSON.stringify(updated))
    } catch {}
  }

  const handleClearAll = () => {
    setInternalNotifs([])
    try {
      localStorage.setItem('udaan_student_notifications', JSON.stringify([]))
    } catch {}
  }

  const handlePasswordChanged = () => {
    const newNotif = {
      id: `n_${Date.now()}`,
      type: 'success',
      title: 'Security Alert: Password Changed',
      message: 'Your password was changed successfully.',
      timestamp: 'Just now',
      read: false,
    }
    const updated = [newNotif, ...internalNotifs]
    setInternalNotifs(updated)
    try {
      localStorage.setItem('udaan_student_notifications', JSON.stringify(updated))
    } catch {}
  }

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

  return (
    <>
      <header className="sd-topbar">
        <div className="sd-topbar-left">
          {/* Back to Dashboard Button on Subpages */}
          {onBack ? (
            <button
              type="button"
              className="sd-topbar-back-btn"
              onClick={onBack}
              title="Return to Student Dashboard"
              aria-label="Return to Student Dashboard"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Dashboard</span>
            </button>
          ) : onToggleSidebar ? (
            <button
              type="button"
              className="sd-mobile-menu-toggle"
              onClick={onToggleSidebar}
              aria-label="Toggle navigation menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          ) : null}

          {/* Institutional Brand Identity */}
          <div
            className="sd-brand-identity"
            onClick={() => {
              if (onNavigateHome) onNavigateHome()
              else if (onBack) onBack()
            }}
            title={onNavigateHome ? 'Return to Portal Home' : 'Return to Student Dashboard'}
          >
            <div className="sd-brand-emblem">IAS</div>
            <div className="sd-brand-titles">
              <span className="sd-brand-main">IAS Collaboration Portal</span>
              <span className="sd-brand-sub">{subtitle}</span>
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
              value={onSearchChange ? (searchQuery || '') : localSearch}
              onChange={(e) => {
                if (onSearchChange) {
                  onSearchChange(e.target.value)
                } else {
                  setLocalSearch(e.target.value)
                }
              }}
              aria-label="Search portal"
            />
          </div>

          {/* Notifications Trigger Button */}
          <button
            type="button"
            className="sd-icon-btn"
            onClick={() => {
              if (onOpenNotifications) {
                onOpenNotifications()
              } else {
                setIsNotifOpen(true)
              }
            }}
            aria-label="View notifications"
            title="Institutional Notifications & Alerts"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {effectiveUnreadCount > 0 && (
              <span className="sd-badge-counter">{effectiveUnreadCount}</span>
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
              <div
                className="sd-pill-avatar"
                onClick={(e) => {
                  e.stopPropagation()
                  if (onOpenPhotoLightbox) {
                    onOpenPhotoLightbox()
                  } else {
                    setIsPhotoLightboxOpen(true)
                  }
                }}
                title="View Photo"
              >
                {studentPic ? (
                  <img
                    src={studentPic}
                    alt={studentName}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{studentInitial}</span>
                )}
              </div>
              <span>{studentName}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isProfileMenuOpen && (
              <div className="sd-dropdown-menu" role="menu">
                <div className="sd-menu-head">
                  <div className="sd-menu-user-name">{studentName}</div>
                  <div className="sd-menu-user-sub">{studentEmail}</div>
                </div>

                <button
                  type="button"
                  className="sd-menu-action"
                  role="menuitem"
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    if (onEditProfile) {
                      onEditProfile()
                    } else if (onBack) {
                      onBack()
                    }
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
                    if (onChangePassword) {
                      onChangePassword()
                    } else {
                      setIsChangePasswordOpen(true)
                    }
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

      {/* Internal Modals for standalone page usage */}
      {!onOpenPhotoLightbox && (
        <ProfilePhotoLightbox
          isOpen={isPhotoLightboxOpen}
          imageSrc={studentPic}
          studentName={studentName}
          onClose={() => setIsPhotoLightboxOpen(false)}
        />
      )}

      {!onOpenNotifications && (
        <NotificationsModal
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
          notifications={internalNotifs}
          onMarkAllRead={handleMarkAllRead}
          onClearAll={handleClearAll}
        />
      )}

      {!onChangePassword && (
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
          student={student}
          onPasswordChanged={handlePasswordChanged}
        />
      )}
    </>
  )
}
