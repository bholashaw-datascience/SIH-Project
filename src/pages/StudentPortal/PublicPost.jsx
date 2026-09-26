import { useState, useRef, useEffect } from 'react'
import ImageCropModal from '../../components/Auth/ImageCropModal'
import './PublicPost.css'

function StudentPageNavbar({
  student = {},
  subtitle = 'Portal',
  onNavigateHome,
  onBack,
  onEditProfile,
  onLogout,
}) {
  const studentName = student?.name || 'Student'
  const studentEmail = student?.email || 'student@ias.edu'
  const studentPic = student?.profilePic || ''
  const studentInitial = (studentName || 'S').charAt(0).toUpperCase()

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const notifMenuRef = useRef(null)
  const [localSearch, setLocalSearch] = useState('')

  const [notifications] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_notifications')
      if (saved) return JSON.parse(saved)
    } catch {}
    return [
      { id: 'n1', type: 'info', title: 'Portal Verified Session', message: 'Institutional collaboration tools are active.', timestamp: 'Active now' },
      { id: 'n2', type: 'success', title: 'Profile Document Verification', message: 'Your submitted academic credentials have been verified.', timestamp: '1d ago' }
    ]
  })

  useEffect(() => {
    if (!isProfileMenuOpen && !isNotifOpen) return
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false)
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setIsNotifOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsProfileMenuOpen(false)
        setIsNotifOpen(false)
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
  }, [isProfileMenuOpen, isNotifOpen])

  return (
    <header className="sd-topbar">
      <style>{`
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
          gap: 14px;
        }
        .sd-brand-identity {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          text-decoration: none;
          user-select: none;
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
          white-space: nowrap;
        }
        .sd-brand-sub {
          font-size: 0.68rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
          white-space: nowrap;
        }
        .sd-topbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .sd-search-box {
          position: relative;
          display: flex;
          align-items: center;
        }
        .sd-search-icon {
          position: absolute;
          left: 10px;
          color: #94a3b8;
          pointer-events: none;
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
        }
        .sd-search-input:focus {
          border-color: #b3881e;
          background: rgba(255, 255, 255, 0.14);
          box-shadow: 0 0 0 2px rgba(179, 136, 30, 0.25);
        }
        .sd-icon-btn {
          position: relative;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 6px;
          color: #ffffff;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .sd-icon-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }
        .sd-user-dropdown-wrap {
          position: relative;
        }
        .sd-user-pill-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 20px;
          padding: 3px 10px 3px 4px;
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .sd-user-pill-btn:hover,
        .sd-user-pill-btn.is-active {
          background: rgba(255, 255, 255, 0.15);
          border-color: #b3881e;
        }
        .sd-pill-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #b3881e;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.76rem;
          font-weight: 700;
          overflow: hidden;
        }
        .sd-dropdown-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 220px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          z-index: 1100;
          overflow: hidden;
          animation: sdMenuFade 0.15s ease-out forwards;
        }
        @keyframes sdMenuFade {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sd-menu-head {
          padding: 12px 14px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .sd-menu-user-name {
          font-weight: 700;
          font-size: 0.86rem;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sd-menu-user-sub {
          font-size: 0.74rem;
          color: #64748b;
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
          background: none;
          border: none;
          font-size: 0.84rem;
          font-weight: 500;
          color: #334155;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
        }
        .sd-menu-action:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .sd-menu-action.danger {
          color: #dc2626;
          border-top: 1px solid #f1f5f9;
        }
        .sd-menu-action.danger:hover {
          background: #fef2f2;
        }
        @media (max-width: 860px) {
          .sd-search-box { display: none; }
        }
        @media (max-width: 580px) {
          .sd-topbar { padding: 0 12px; }
          .sd-brand-sub { display: none; }
          .sd-user-pill-btn > span { display: none; }
          .sd-user-pill-btn { padding: 3px 6px 3px 4px; }
        }
      `}</style>
      <div className="sd-topbar-left">
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
        <div className="sd-search-box">
          <svg className="sd-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="sd-search-input"
            placeholder="Search portal..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            aria-label="Search portal"
          />
        </div>

        <div className="sd-user-dropdown-wrap" ref={notifMenuRef}>
          <button
            type="button"
            className={`sd-icon-btn ${isNotifOpen ? 'is-active' : ''}`}
            aria-label="View notifications"
            title="Institutional Notifications & Alerts"
            onClick={() => setIsNotifOpen((prev) => !prev)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          {isNotifOpen && (
            <div className="sd-dropdown-menu" style={{ width: '280px', padding: '0' }}>
              <div className="sd-menu-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>Notifications</span>
                <span style={{ fontSize: '0.72rem', background: '#b3881e', color: '#fff', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>
                  {notifications.length}
                </span>
              </div>
              <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <div key={n.id} style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1e293b' }}>{n.title}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>{n.message}</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>{n.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sd-user-dropdown-wrap" ref={profileMenuRef}>
          <button
            type="button"
            className={`sd-user-pill-btn ${isProfileMenuOpen ? 'is-active' : ''}`}
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="true"
            aria-label="User account menu"
          >
            <div className="sd-pill-avatar" title="User avatar">
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
                  if (onEditProfile) onEditProfile()
                  else if (onBack) onBack()
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
                className="sd-menu-action danger"
                role="menuitem"
                onClick={() => {
                  setIsProfileMenuOpen(false)
                  if (onLogout) onLogout()
                  else if (onNavigateHome) onNavigateHome()
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
  )
}

const createPostId = (prefix = 'post') =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`

export default function PublicPost({
  student = {},
  onBack,
  onNavigateHome,
  onEditProfile,
  onLogout,
}) {
  // ---------------------------------------------------------------------------
  // State Management & Post Creation Form
  // ---------------------------------------------------------------------------
  // Student metadata with reliable fallbacks
  const s = {
    name: student?.name || 'Verified Student Member',
    email: student?.email || 'student@institution.edu',
    handle: student?.email ? `@${student.email.split('@')[0]}` : '@student',
    profilePic: student?.profilePic || '',
    institution: student?.institution || 'IAS Collaboration Portal',
    branch: student?.branch || student?.course || 'Engineering & Technology',
  }

  // Posts State (synced with localStorage key 'udaan_student_posts')
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('udaan_student_posts')
      if (saved) {
        const parsed = JSON.parse(saved)
        const realPosts = (Array.isArray(parsed) ? parsed : []).filter(
          (p) => p && !p.id?.startsWith('post_sample_')
        )
        return realPosts
      }
    } catch {}
    return []
  })

  // Persist posts changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('udaan_student_posts', JSON.stringify(posts))
    } catch {}
  }, [posts])

  // Form State
  const [mediaList, setMediaList] = useState([]) // [{ id, name, size, type: 'image'|'video', url, croppedUrl, file }]
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const [aspectRatio, setAspectRatio] = useState('1:1') // '1:1' | '4:5' | '16:9'
  const [caption, setCaption] = useState('')
  const [description, setDescription] = useState('')
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [fileError, setFileError] = useState('')
  const [validationError, setValidationError] = useState('')
  const [editingPostId, setEditingPostId] = useState(null)

  // Sub-modals & Lightboxes
  const [lightboxMedia, setLightboxMedia] = useState(null)
  const [croppingItem, setCroppingItem] = useState(null)
  const [confirmationPost, setConfirmationPost] = useState(null)

  // Filter state for Recent Posts
  const [recentFilter, setRecentFilter] = useState('all') // 'all' | 'pending' | 'approved' | 'revision'

  // Refs
  const initialDropInputRef = useRef(null)
  const addMoreInputRef = useRef(null)
  const replaceInputRef = useRef(null)
  const replacingIndexRef = useRef(null)
  const objectUrlsRef = useRef([])
  const recentSectionRef = useRef(null)
  const mainFormRef = useRef(null)

  // Blob URL cleanup helper
  const createTrackedBlobUrl = (file) => {
    const url = URL.createObjectURL(file)
    objectUrlsRef.current.push(url)
    return url
  }

  useEffect(() => {
    const activeUrls = objectUrlsRef.current
    return () => {
      activeUrls.forEach((url) => {
        try {
          URL.revokeObjectURL(url)
        } catch {}
      })
    }
  }, [])

  // File size formatting helper
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB'
    const k = 1024
    if (bytes >= k * k) {
      return `${(bytes / (k * k)).toFixed(1)} MB`
    }
    return `${Math.round(bytes / k)} KB`
  }

  // Handle file uploads (Photos & Videos)
  const handleProcessFiles = (fileList, isAppend = true) => {
    if (!fileList || fileList.length === 0) return
    setFileError('')
    setValidationError('')

    const allowedImgExts = ['.jpg', '.jpeg', '.png', '.webp']
    const allowedVidExts = ['.mp4', '.webm', '.mov', '.ogg']
    const maxImgSize = 15 * 1024 * 1024 // 15MB
    const maxVidSize = 60 * 1024 * 1024 // 60MB

    const newMediaItems = []
    let encounteredError = ''

    Array.from(fileList).forEach((file) => {
      const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
      const validImgMimes = ['image/jpeg', 'image/png', 'image/webp']
      const validVidMimes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg']
      const isImage = allowedImgExts.includes(ext) && (validImgMimes.includes(file.type) || !file.type) && file.type !== 'image/svg+xml'
      const isVideo = allowedVidExts.includes(ext) && (validVidMimes.includes(file.type) || file.type.startsWith('video/') || !file.type)

      if (!isImage && !isVideo) {
        encounteredError = `"${file.name}" is not supported. Please upload photos (JPG, PNG, WEBP) or videos (MP4, WebM, MOV).`
        return
      }

      if (isImage && file.size > maxImgSize) {
        encounteredError = `"${file.name}" exceeds 15MB photo limit (${formatFileSize(file.size)}).`
        return
      }

      if (isVideo && file.size > maxVidSize) {
        encounteredError = `"${file.name}" exceeds 60MB video limit (${formatFileSize(file.size)}).`
        return
      }

      const objectUrl = createTrackedBlobUrl(file)
      const newItem = {
        id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: file.name,
        size: formatFileSize(file.size),
        type: isImage ? 'image' : 'video',
        url: objectUrl,
        croppedUrl: null,
        file,
        aspectRatio: null,
      }

      if (isImage) {
        const tempImg = new Image()
        tempImg.onload = () => {
          if (tempImg.naturalWidth && tempImg.naturalHeight) {
            const ratio = tempImg.naturalWidth / tempImg.naturalHeight
            setMediaList((prev) =>
              prev.map((m) => (m.id === newItem.id ? { ...m, aspectRatio: ratio } : m))
            )
          }
        }
        tempImg.src = objectUrl
      } else if (isVideo) {
        const tempVid = document.createElement('video')
        tempVid.onloadedmetadata = () => {
          if (tempVid.videoWidth && tempVid.videoHeight) {
            const ratio = tempVid.videoWidth / tempVid.videoHeight
            setMediaList((prev) =>
              prev.map((m) => (m.id === newItem.id ? { ...m, aspectRatio: ratio } : m))
            )
          }
        }
        tempVid.src = objectUrl
      }

      newMediaItems.push(newItem)
    })

    if (encounteredError) {
      setFileError(encounteredError)
    }

    if (newMediaItems.length > 0) {
      if (isAppend) {
        setMediaList((prev) => {
          const combined = [...prev, ...newMediaItems]
          setActiveMediaIndex(combined.length - 1)
          return combined
        })
      } else {
        setMediaList(newMediaItems)
        setActiveMediaIndex(0)
      }
    }
  }

  // Replace a specific uploaded media item
  const handleOpenReplace = (index) => {
    replacingIndexRef.current = index
    if (replaceInputRef.current) {
      replaceInputRef.current.value = ''
      replaceInputRef.current.click()
    }
  }

  const handleExecuteReplace = (e) => {
    const file = e.target.files?.[0]
    const idx = replacingIndexRef.current
    if (!file || idx === null || idx === undefined) return
    setFileError('')

    const allowedImgExts = ['.jpg', '.jpeg', '.png', '.webp']
    const allowedVidExts = ['.mp4', '.webm', '.mov', '.ogg']
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
    const validImgMimes = ['image/jpeg', 'image/png', 'image/webp']
    const validVidMimes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg']
    const isImage = allowedImgExts.includes(ext) && (validImgMimes.includes(file.type) || !file.type) && file.type !== 'image/svg+xml'
    const isVideo = allowedVidExts.includes(ext) && (validVidMimes.includes(file.type) || file.type.startsWith('video/') || !file.type)

    if (!isImage && !isVideo) {
      setFileError('Invalid file format. Please choose a valid photo (JPG, PNG) or video (MP4, WebM).')
      return
    }

    const objectUrl = createTrackedBlobUrl(file)
    const replacement = {
      id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: file.name,
      size: formatFileSize(file.size),
      type: isImage ? 'image' : 'video',
      url: objectUrl,
      croppedUrl: null,
      file,
      aspectRatio: null,
    }

    if (isImage) {
      const tempImg = new Image()
      tempImg.onload = () => {
        if (tempImg.naturalWidth && tempImg.naturalHeight) {
          const ratio = tempImg.naturalWidth / tempImg.naturalHeight
          setMediaList((prev) =>
            prev.map((m) => (m.id === replacement.id ? { ...m, aspectRatio: ratio } : m))
          )
        }
      }
      tempImg.src = objectUrl
    } else if (isVideo) {
      const tempVid = document.createElement('video')
      tempVid.onloadedmetadata = () => {
        if (tempVid.videoWidth && tempVid.videoHeight) {
          const ratio = tempVid.videoWidth / tempVid.videoHeight
          setMediaList((prev) =>
            prev.map((m) => (m.id === replacement.id ? { ...m, aspectRatio: ratio } : m))
          )
        }
      }
      tempVid.src = objectUrl
    }

    setMediaList((prev) =>
      prev.map((item, i) => (i === idx ? replacement : item))
    )
  }

  // Delete an uploaded media item
  const handleDeleteMedia = (indexToDelete) => {
    setMediaList((prev) => {
      const filtered = prev.filter((_, idx) => idx !== indexToDelete)
      if (activeMediaIndex >= filtered.length) {
        setActiveMediaIndex(Math.max(0, filtered.length - 1))
      }
      return filtered
    })
  }

  // Apply photo crop from ImageCropModal
  const handleCropApply = (croppedDataUrl) => {
    if (!croppingItem) return
    const tempImg = new Image()
    tempImg.onload = () => {
      const ratio = tempImg.naturalWidth && tempImg.naturalHeight
        ? tempImg.naturalWidth / tempImg.naturalHeight
        : null
      setMediaList((prev) =>
        prev.map((item) =>
          item.id === croppingItem.id
            ? { ...item, croppedUrl: croppedDataUrl, ...(ratio ? { aspectRatio: ratio } : {}) }
            : item
        )
      )
    }
    tempImg.src = croppedDataUrl
    setCroppingItem(null)
  }

  // Form Reset
  const handleResetForm = () => {
    setMediaList([])
    setActiveMediaIndex(0)
    setCaption('')
    setDescription('')
    setAspectRatio('1:1')
    setFileError('')
    setValidationError('')
    setEditingPostId(null)
  }

  // Submit Post for Admin Verification
  const handleSubmitPost = () => {
    setValidationError('')
    setFileError('')

    // Validation 1: At least 1 photo or video required
    if (mediaList.length === 0) {
      setValidationError('Please upload at least one photo or video before submitting.')
      return
    }

    // Validation 2: Description is strictly required
    if (!description.trim()) {
      setValidationError('Please write a description for your post before submitting.')
      return
    }

    const newPost = {
      id: editingPostId || createPostId('post'),
      title: caption.trim() || description.trim().slice(0, 50) + (description.trim().length > 50 ? '...' : ''),
      caption: caption.trim() || description.trim(),
      content: description.trim(),
      category: caption.trim() || 'Public Post',
      aspectRatio,
      media: mediaList.map((m) => ({
        id: m.id,
        name: m.name,
        size: m.size,
        type: m.type,
        url: m.croppedUrl || m.url,
      })),
      author: {
        name: s.name,
        handle: s.handle,
        avatar: s.profilePic,
        institution: s.institution,
        course: s.branch,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: editingPostId ? new Date().toISOString() : null,
    }

    if (editingPostId) {
      setPosts((prev) => prev.map((p) => (p.id === editingPostId ? newPost : p)))
    } else {
      setPosts((prev) => [newPost, ...prev])
    }

    // Push notification to student notifications
    try {
      const savedNotifs = JSON.parse(localStorage.getItem('udaan_student_notifications') || '[]')
      const notif = {
        id: createPostId('n'),
        type: 'info',
        title: 'Public Post Submitted for Verification',
        message: `Your post "${newPost.title}" has been submitted for moderation review by Portal Admin.`,
        timestamp: 'Just now',
        read: false,
      }
      localStorage.setItem('udaan_student_notifications', JSON.stringify([notif, ...savedNotifs]))
    } catch {}

    // Show Confirmation State Modal
    setConfirmationPost(newPost)
    handleResetForm()
  }

  // Load a post into form for revision
  const handleLoadForRevision = (post) => {
    setEditingPostId(post.id)
    setCaption(post.caption || post.title || '')
    setDescription(post.content || post.description || post.caption || '')
    setAspectRatio(post.aspectRatio || '1:1')

    if (Array.isArray(post.media) && post.media.length > 0) {
      setMediaList(post.media.map((m) => ({ ...m })))
    } else {
      setMediaList([])
    }
    setActiveMediaIndex(0)
    setValidationError('')
    setFileError('')

    // Scroll to form
    mainFormRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Delete an existing post
  const handleDeleteExistingPost = (postId) => {
    if (window.confirm('Are you sure you want to delete this public post?')) {
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    }
  }

  // Filtered recent posts
  const filteredPosts = posts.filter((p) => {
    if (recentFilter === 'all') return true
    if (recentFilter === 'approved') return p.status === 'approved' || p.status === 'verified'
    if (recentFilter === 'revision') return p.status === 'revision' || p.status === 'rejected'
    return p.status === recentFilter
  })

  // Current active media for preview carousel
  const activeMediaItem = mediaList[activeMediaIndex] || mediaList[0]
  const activeRatio = activeMediaItem?.aspectRatio || null

  const stageContainerStyle = activeMediaItem
    ? activeRatio
      ? {
          aspectRatio: `${activeRatio}`,
          maxHeight: '260px',
          width: `min(100%, calc(260px * ${activeRatio}))`,
          margin: '0 auto',
        }
      : {
          maxHeight: '260px',
          width: '100%',
          margin: '0 auto',
        }
    : undefined

  // ---------------------------------------------------------------------------
  // View Rendering
  // ---------------------------------------------------------------------------
  return (
    <div className="pp-page-wrapper">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={initialDropInputRef}
        multiple
        accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={(e) => handleProcessFiles(e.target.files, false)}
      />
      <input
        type="file"
        ref={addMoreInputRef}
        multiple
        accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={(e) => handleProcessFiles(e.target.files, true)}
      />
      <input
        type="file"
        ref={replaceInputRef}
        accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={handleExecuteReplace}
      />

      {/* STANDARDIZED NAVBAR */}
      <StudentPageNavbar
        student={student}
        onBack={onBack}
        onNavigateHome={onNavigateHome}
        onEditProfile={onEditProfile}
        onLogout={onLogout}
        subtitle="Public Posts"
      />

      {/* MAIN BODY CONTAINER */}
      <main className="pp-main-content">
        {/* Compact Page Heading */}
        <div className="pp-compact-heading">
          <h1 className="pp-compact-title">Create Public Post</h1>
        </div>

        {/* 2-COLUMN WORKSPACE GRID: FORM (LEFT) + GUIDELINES & PREVIEW (RIGHT) */}
        <div className="pp-workspace-grid" ref={mainFormRef}>
          {/* ================================================================
              LEFT COLUMN: COMPOSER FORM
              ================================================================ */}
          <div className="pp-form-column">
            {/* Revision Notice Banner if editing */}
            {editingPostId && (
              <div className="pp-alert-banner success" style={{ background: '#fef3c7', borderColor: '#fcd34d', color: '#92400e' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span>Revising Post for Resubmission. Once submitted, it will be re-audited by Portal Admin.</span>
                <button
                  type="button"
                  onClick={handleResetForm}
                  style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#92400e', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                >
                  Cancel Edit
                </button>
              </div>
            )}

            {/* Validation & File Errors */}
            {fileError && (
              <div className="pp-alert-banner error" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{fileError}</span>
              </div>
            )}

            {validationError && (
              <div className="pp-alert-banner error" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{validationError}</span>
              </div>
            )}

            {/* --------------------------------------------------------------
                SECTION 2: ADD MEDIA
                -------------------------------------------------------------- */}
            <div className="pp-card">
              <div className="pp-card-header">
                <div className="pp-card-title-group">
                  <span className="pp-card-step-badge">1</span>
                  <h2 className="pp-card-title">Add Media</h2>
                </div>
                <span className="pp-card-badge">
                  {mediaList.length} {mediaList.length === 1 ? 'file' : 'files'} selected • Photos & Videos
                </span>
              </div>

              {mediaList.length === 0 ? (
                /* Empty Dropzone */
                <div
                  className={`pp-dropzone ${isDraggingOver ? 'is-dragging' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDraggingOver(true)
                  }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDraggingOver(false)
                    handleProcessFiles(e.dataTransfer.files, false)
                  }}
                  onClick={() => initialDropInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload photos and videos"
                >
                  <div className="pp-drop-icon-wrap">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                  <h3 className="pp-drop-title">Upload Photos & Videos</h3>
                  <p className="pp-drop-subtitle">
                    Select multiple photos (JPG, PNG, WEBP) or videos (MP4, WebM, MOV). You can upload multiple media files together in a single post.
                  </p>
                  <button
                    type="button"
                    className="pp-btn-browse"
                    onClick={(e) => {
                      e.stopPropagation()
                      initialDropInputRef.current?.click()
                    }}
                  >
                    Browse Media Files
                  </button>
                </div>
              ) : (
                /* Uploaded Media Thumbnails Grid with Actions */
                <div className="pp-media-section">
                  <div className="pp-media-grid">
                    {mediaList.map((item, idx) => (
                      <div
                        key={item.id}
                        className="pp-media-item-card"
                        style={{
                          borderColor: idx === activeMediaIndex ? '#b3881e' : '#e2e8f0',
                        }}
                      >
                        {/* Media Preview Box */}
                        <div
                          className="pp-media-preview-box"
                          onClick={() => setActiveMediaIndex(idx)}
                          style={{ cursor: 'pointer' }}
                          title="Click to preview on social card"
                        >
                          {item.type === 'video' ? (
                            <>
                              <video src={item.url} className="pp-media-video" />
                              <div className="pp-media-video-overlay-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                              </div>
                            </>
                          ) : (
                            <img
                              src={item.croppedUrl || item.url}
                              alt={item.name}
                              className="pp-media-img"
                            />
                          )}

                          <span className="pp-media-type-tag">
                            {item.type === 'video' ? '▶ Video' : '📷 Photo'}
                          </span>
                        </div>

                        {/* Card Body & Actions */}
                        <div className="pp-media-card-body">
                          <div className="pp-media-info">
                            <span className="pp-media-name" title={item.name}>
                              {item.name}
                            </span>
                            <span className="pp-media-size">{item.size}</span>
                          </div>

                          {/* Action Buttons: View, Crop/Adjust, Replace, Delete */}
                          <div className="pp-media-actions-bar">
                            <button
                              type="button"
                              className="pp-item-btn"
                              onClick={() => setLightboxMedia(item)}
                              title="View full size"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                              </svg>
                              View
                            </button>

                            {item.type === 'image' && (
                              <button
                                type="button"
                                className="pp-item-btn crop"
                                onClick={() => setCroppingItem(item)}
                                title="Adjust and crop to format"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15" />
                                  <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15" />
                                </svg>
                                Crop
                              </button>
                            )}

                            <button
                              type="button"
                              className="pp-item-btn"
                              onClick={() => handleOpenReplace(idx)}
                              title="Replace this media item"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <polyline points="23 4 23 10 17 10" />
                                <polyline points="1 20 1 14 7 14" />
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                              </svg>
                              Replace
                            </button>

                            <button
                              type="button"
                              className="pp-item-btn danger"
                              onClick={() => handleDeleteMedia(idx)}
                              title="Delete this media"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add More Media Action Card */}
                    <div
                      className="pp-add-more-card"
                      onClick={() => addMoreInputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                      title="Upload additional photos or videos"
                    >
                      <div className="pp-add-more-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </div>
                      <span className="pp-add-more-text">Add More</span>
                      <span className="pp-add-more-sub">Photos or Videos</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* --------------------------------------------------------------
                SECTION 3: CHOOSE POST FORMAT
                -------------------------------------------------------------- */}
            <div className="pp-card">
              <div className="pp-card-header">
                <div className="pp-card-title-group">
                  <span className="pp-card-step-badge">2</span>
                  <h2 className="pp-card-title">Choose Post Format</h2>
                </div>
                <span className="pp-card-badge">Selected: {aspectRatio}</span>
              </div>

              <div className="pp-format-grid" role="radiogroup" aria-label="Post Format Options">
                {/* Format 1: Square (1:1) */}
                <div
                  className={`pp-format-option-card ${aspectRatio === '1:1' ? 'is-active' : ''}`}
                  onClick={() => setAspectRatio('1:1')}
                  role="radio"
                  aria-checked={aspectRatio === '1:1'}
                  tabIndex={0}
                >
                  <div className="pp-format-ratio-glyph pp-format-glyph-square" />
                  <div className="pp-format-name">Square</div>
                  <div className="pp-format-ratio-pill">1:1</div>
                  <div className="pp-format-desc">Standard balanced format for certificates & highlights</div>
                </div>

                {/* Format 2: Portrait (4:5) */}
                <div
                  className={`pp-format-option-card ${aspectRatio === '4:5' ? 'is-active' : ''}`}
                  onClick={() => setAspectRatio('4:5')}
                  role="radio"
                  aria-checked={aspectRatio === '4:5'}
                  tabIndex={0}
                >
                  <div className="pp-format-ratio-glyph pp-format-glyph-portrait" />
                  <div className="pp-format-name">Portrait</div>
                  <div className="pp-format-ratio-pill">4:5</div>
                  <div className="pp-format-desc">Tall vertical format for posters, banners & mobile feeds</div>
                </div>

                {/* Format 3: Landscape (16:9) */}
                <div
                  className={`pp-format-option-card ${aspectRatio === '16:9' ? 'is-active' : ''}`}
                  onClick={() => setAspectRatio('16:9')}
                  role="radio"
                  aria-checked={aspectRatio === '16:9'}
                  tabIndex={0}
                >
                  <div className="pp-format-ratio-glyph pp-format-glyph-landscape" />
                  <div className="pp-format-name">Landscape</div>
                  <div className="pp-format-ratio-pill">16:9</div>
                  <div className="pp-format-desc">Widescreen format for presentation slides & video demos</div>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------------
                SECTION 3: CAPTION
                -------------------------------------------------------------- */}
            <div className="pp-card">
              <div className="pp-card-header">
                <div className="pp-card-title-group">
                  <span className="pp-card-step-badge">3</span>
                  <h2 className="pp-card-title">Caption</h2>
                </div>
                <span className="pp-card-badge">Optional Headline</span>
              </div>

              <div className="pp-caption-row">
                <label htmlFor="pp-caption-input" className="pp-caption-label">
                  Caption
                </label>
                <input
                  type="text"
                  id="pp-caption-input"
                  className="pp-caption-input"
                  placeholder="Write a caption for your post (e.g. 1st Place at National Smart Mobility Hackathon)..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
            </div>

            {/* --------------------------------------------------------------
                SECTION 4: WRITE DESCRIPTION
                -------------------------------------------------------------- */}
            <div className="pp-card">
              <div className="pp-card-header">
                <div className="pp-card-title-group">
                  <span className="pp-card-step-badge">4</span>
                  <h2 className="pp-card-title">Write Description</h2>
                </div>
                <span className="pp-required-tag">* Required</span>
              </div>

              <div className="pp-textarea-wrap">
                <textarea
                  id="pp-description-textarea"
                  className={`pp-textarea ${validationError && !description.trim() ? 'is-invalid' : ''}`}
                  placeholder="Write a clear description about this public post. Highlight the methodology, findings, honors received, or collaborative contributions..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    if (validationError && e.target.value.trim()) {
                      setValidationError('')
                    }
                  }}
                  maxLength={1200}
                  rows={4}
                />

                <div className="pp-textarea-footer">
                  <span>
                    {validationError && !description.trim() ? (
                      <span style={{ color: '#dc2626', fontWeight: 600 }}>Description is required</span>
                    ) : (
                      'Provide meaningful academic context'
                    )}
                  </span>
                  <span>{description.length} / 1200 characters</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================
              RIGHT COLUMN: POST GUIDELINES & LIVE SOCIAL PREVIEW
              ================================================================ */}
          <div className="pp-sidebar-column">
            {/* --------------------------------------------------------------
                SECTION 6: POST GUIDELINES
                -------------------------------------------------------------- */}
            <div className="pp-guidelines-card">
              <div className="pp-guidelines-header">
                <div className="pp-guidelines-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="pp-guidelines-title">Post Guidelines</h3>
              </div>

              <ul className="pp-guidelines-list">
                <li className="pp-guideline-item">
                  <span className="pp-guideline-bullet check">✓</span>
                  <div>
                    <strong>Multiple Media Support:</strong> Multiple photos and videos can be uploaded together in a single post.
                  </div>
                </li>

                <li className="pp-guideline-item">
                  <span className="pp-guideline-bullet check">✓</span>
                  <div>
                    <strong>Supported Media Formats:</strong> Images (JPG, PNG, WEBP up to 15MB) and Videos (MP4, WebM, MOV up to 60MB).
                  </div>
                </li>

                <li className="pp-guideline-item">
                  <span className="pp-guideline-bullet check">✓</span>
                  <div>
                    <strong>Select Appropriate Format:</strong> Choose 1:1 Square, 4:5 Portrait, or 16:9 Landscape to showcase your media optimally.
                  </div>
                </li>

                <li className="pp-guideline-item">
                  <span className="pp-guideline-bullet check">✓</span>
                  <div>
                    <strong>Meaningful Description:</strong> Detail research methodology, conference title, competition results, or team credits.
                  </div>
                </li>

                <li className="pp-guideline-item">
                  <span className="pp-guideline-bullet shield">🛡️</span>
                  <div>
                    <strong>Admin Verification:</strong> Every post is audited by the Portal Admin before being published publicly.
                  </div>
                </li>

                <li className="pp-guideline-item">
                  <span className="pp-guideline-bullet shield">🛡️</span>
                  <div>
                    <strong>Public Visibility:</strong> Only verified posts appear on the institutional portfolio and recruiter showcase.
                  </div>
                </li>

                <li className="pp-guideline-item">
                  <span className="pp-guideline-bullet">✕</span>
                  <div>
                    <strong>Appropriate Content Only:</strong> Do not upload plagiarized, misleading, or irrelevant non-academic content.
                  </div>
                </li>
              </ul>
            </div>

            {/* --------------------------------------------------------------
                SECTION 7: SOCIAL-MEDIA LIVE PREVIEW
                -------------------------------------------------------------- */}
            <div className="pp-preview-card">
              <div className="pp-preview-card-header">
                <div className="pp-preview-card-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Live Social Preview
                </div>
              </div>

              {/* Feed Simulation Card */}
              <div className="pp-social-post-box">
                {/* Author Header */}
                <div className="pp-post-author-row">
                  <div className="pp-author-left">
                    {s.profilePic ? (
                      <img src={s.profilePic} alt={s.name} className="pp-author-avatar" />
                    ) : (
                      <div className="pp-author-avatar">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="pp-author-meta">
                      <div className="pp-author-name">
                        {s.name}
                        <span className="pp-author-verified-badge" title="Verified Student Author">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#2563eb">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        </span>
                      </div>
                      <div className="pp-author-sub">
                        {s.handle} • {s.branch}
                      </div>
                    </div>
                  </div>

                  <span className="pp-post-status-pill">
                    Pending Verification
                  </span>
                </div>

                {/* Media Viewport with Original Aspect Ratio */}
                <div
                  className={`pp-preview-stage-container ${mediaList.length === 0 ? 'is-empty' : 'has-media'}`}
                  style={stageContainerStyle}
                >
                  {mediaList.length > 0 ? (
                    <>
                      {/* Active Media Renderer */}
                      {activeMediaItem?.type === 'video' ? (
                        <div className="pp-preview-video-wrap">
                          <video
                            src={activeMediaItem.url}
                            controls
                            playsInline
                            className="pp-preview-video"
                            key={activeMediaItem.url}
                            onLoadedMetadata={(e) => {
                              if (e.currentTarget.videoWidth && e.currentTarget.videoHeight) {
                                const ratio = e.currentTarget.videoWidth / e.currentTarget.videoHeight
                                if (activeMediaItem && activeMediaItem.aspectRatio !== ratio) {
                                  setMediaList((prev) =>
                                    prev.map((m) => (m.id === activeMediaItem.id ? { ...m, aspectRatio: ratio } : m))
                                  )
                                }
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <img
                          src={activeMediaItem?.croppedUrl || activeMediaItem?.url}
                          alt={activeMediaItem?.name || 'Preview'}
                          className="pp-preview-img"
                          onLoad={(e) => {
                            if (e.currentTarget.naturalWidth && e.currentTarget.naturalHeight) {
                              const ratio = e.currentTarget.naturalWidth / e.currentTarget.naturalHeight
                              if (activeMediaItem && activeMediaItem.aspectRatio !== ratio) {
                                setMediaList((prev) =>
                                  prev.map((m) => (m.id === activeMediaItem.id ? { ...m, aspectRatio: ratio } : m))
                                )
                              }
                            }
                          }}
                        />
                      )}

                      {/* Navigation Overlays if Multiple Media Files */}
                      {mediaList.length > 1 && (
                        <>
                          <button
                            type="button"
                            className="pp-preview-nav-btn prev"
                            onClick={() =>
                              setActiveMediaIndex((prev) =>
                                prev > 0 ? prev - 1 : mediaList.length - 1
                              )
                            }
                            aria-label="Previous media"
                          >
                            ‹
                          </button>

                          <button
                            type="button"
                            className="pp-preview-nav-btn next"
                            onClick={() =>
                              setActiveMediaIndex((prev) =>
                                prev < mediaList.length - 1 ? prev + 1 : 0
                              )
                            }
                            aria-label="Next media"
                          >
                            ›
                          </button>

                          <div className="pp-preview-pagination-badge">
                            {activeMediaIndex + 1} / {mediaList.length}
                          </div>

                          <div className="pp-preview-dots-row">
                            {mediaList.map((_, dotIdx) => (
                              <span
                                key={dotIdx}
                                className={`pp-preview-dot ${dotIdx === activeMediaIndex ? 'is-active' : ''}`}
                                onClick={() => setActiveMediaIndex(dotIdx)}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    /* Clean Placeholder when no media uploaded */
                    <div className="pp-preview-empty-stage">
                      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>Media Preview</span>
                      <small style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Uploaded photos &amp; videos will display here
                      </small>
                    </div>
                  )}
                </div>

                {/* Social Card Body / Description */}
                <div className="pp-social-body">
                  {caption.trim() ? (
                    <span className="pp-social-category-tag">{caption.trim()}</span>
                  ) : null}

                  <p className="pp-social-description">
                    {description.trim() ? (
                      description
                    ) : (
                      <span className="pp-social-description-placeholder">
                        Your post description will appear here in real time...
                      </span>
                    )}
                  </p>

                  <div className="pp-social-timestamp">
                    Just now • Institutional Public Feed
                  </div>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------------
                SECTION 7: PREVIEW / SUBMIT ACTIONS
                -------------------------------------------------------------- */}
            <div className="pp-submit-section">
              <div className="pp-submit-action-row">
                <button
                  type="button"
                  id="pp-submit-btn"
                  className="pp-btn-submit"
                  onClick={handleSubmitPost}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Submit for Admin Verification
                </button>

                <button
                  type="button"
                  className="pp-btn-cancel"
                  onClick={onBack}
                >
                  Cancel
                </button>
              </div>

              <div className="pp-submit-note">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b3881e" strokeWidth="2.4">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>
                  <strong>Admin Verification Standard:</strong> Your post will become publicly visible across the institutional network only after formal review and approval by the Portal Admin.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================
            SECTION 8: YOUR RECENT POSTS
            ================================================================== */}
        <section className="pp-recent-section" ref={recentSectionRef} aria-label="Recent Public Posts">
          <div className="pp-recent-header">
            <div className="pp-recent-title-wrap">
              <h2 className="pp-recent-title">Your Recent Posts</h2>
              <span className="pp-recent-count-badge">{posts.length}</span>
            </div>

            {/* Filter Pills only when student has created posts */}
            {posts.length > 0 && (
              <div className="pp-recent-filter-pills" role="tablist">
                <button
                  type="button"
                  className={`pp-filter-pill ${recentFilter === 'all' ? 'is-active' : ''}`}
                  onClick={() => setRecentFilter('all')}
                >
                  All ({posts.length})
                </button>
                <button
                  type="button"
                  className={`pp-filter-pill ${recentFilter === 'pending' ? 'is-active' : ''}`}
                  onClick={() => setRecentFilter('pending')}
                >
                  Pending ({posts.filter((p) => p.status === 'pending').length})
                </button>
                <button
                  type="button"
                  className={`pp-filter-pill ${recentFilter === 'approved' ? 'is-active' : ''}`}
                  onClick={() => setRecentFilter('approved')}
                >
                  Verified ({posts.filter((p) => p.status === 'approved' || p.status === 'verified').length})
                </button>
                <button
                  type="button"
                  className={`pp-filter-pill ${recentFilter === 'revision' ? 'is-active' : ''}`}
                  onClick={() => setRecentFilter('revision')}
                >
                  Needs Revision ({posts.filter((p) => p.status === 'revision' || p.status === 'rejected').length})
                </button>
              </div>
            )}
          </div>

          {posts.length === 0 ? (
            /* Instagram-like clean empty state when student has no posts yet */
            <div className="pp-empty-recent-instagram">
              <div className="pp-empty-instagram-icon-circle">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <h3 className="pp-empty-instagram-title">No Posts Yet</h3>
              <p className="pp-empty-instagram-sub">
                Once you submit a post for verification, it will appear here.
              </p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="pp-empty-recent">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>No posts found under the &quot;{recentFilter}&quot; filter.</span>
            </div>
          ) : (
            <div className="pp-recent-grid">
              {filteredPosts.map((post) => {
                const postMediaList = Array.isArray(post.media) && post.media.length > 0 ? post.media : []
                const firstMedia = postMediaList[0]
                const status = post.status || 'pending'

                return (
                  <div key={post.id} className="pp-recent-card">
                    {/* Thumbnail Row */}
                    <div className="pp-recent-thumb-row">
                      {firstMedia ? (
                        firstMedia.type === 'video' ? (
                          <>
                            <video src={firstMedia.url} className="pp-recent-thumb-img" />
                            <div className="pp-media-video-overlay-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3" />
                              </svg>
                            </div>
                          </>
                        ) : (
                          <img
                            src={firstMedia.url}
                            alt={post.title}
                            className="pp-recent-thumb-img"
                          />
                        )
                      ) : (
                        <div className="pp-recent-thumb-placeholder">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                          <span>No Media</span>
                        </div>
                      )}

                      {/* Status Pill */}
                      <span className={`pp-recent-status-pill ${status}`}>
                        {status === 'pending' && 'Pending Verification'}
                        {(status === 'approved' || status === 'verified') && '✓ Verified'}
                        {(status === 'revision' || status === 'rejected') && 'Needs Revision'}
                        {status === 'draft' && 'Draft'}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="pp-recent-card-body">
                      <div className="pp-recent-meta-line">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.aspectRatio || '1:1'}</span>
                        <span>•</span>
                        <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}</span>
                      </div>

                      <p className="pp-recent-card-caption">
                        {post.caption || post.content || post.title}
                      </p>

                      {/* Admin Revision Note if Needed */}
                      {(status === 'revision' || status === 'rejected') && (
                        <div className="pp-recent-revision-box">
                          <strong>Admin Feedback:</strong> &quot;{post.rejectionReason || 'Please review image clarity and provide additional project documentation.'}&quot;
                        </div>
                      )}

                      {/* Card Action Bar */}
                      <div className="pp-recent-actions">
                        <div style={{ display: 'flex', gap: 6 }}>
                          {firstMedia && (
                            <button
                              type="button"
                              className="pp-recent-btn"
                              onClick={() => setLightboxMedia(firstMedia)}
                              title="View media"
                            >
                              View
                            </button>
                          )}

                          {(status === 'revision' || status === 'rejected') && (
                            <button
                              type="button"
                              className="pp-recent-btn revise"
                              onClick={() => handleLoadForRevision(post)}
                              title="Revise & Resubmit post"
                            >
                              Revise & Resubmit
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          className="pp-recent-btn delete"
                          onClick={() => handleDeleteExistingPost(post.id)}
                          title="Delete post"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>

      {/* ====================================================================
          SUB-MODALS: CONFIRMATION STATE MODAL
          ==================================================================== */}
      {confirmationPost && (
        <div className="pp-modal-overlay">
          <div className="pp-confirmation-card" onClick={(e) => e.stopPropagation()}>
            <div className="pp-confirmation-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h3 className="pp-confirmation-title">Post Submitted for Admin Verification!</h3>
            <p className="pp-confirmation-desc">
              Your public post has been successfully queued for moderation review. It is saved under <strong>Pending Verification</strong> and will become publicly visible once approved by Portal Admin.
            </p>

            <div className="pp-confirmation-actions">
              <button
                type="button"
                className="pp-confirmation-btn primary"
                onClick={() => {
                  setConfirmationPost(null)
                  recentSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                View in Recent Posts
              </button>
              <button
                type="button"
                className="pp-confirmation-btn secondary"
                onClick={() => setConfirmationPost(null)}
              >
                Create Another Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SUB-MODALS: IMAGE CROP MODAL (REUSED)
          ==================================================================== */}
      {croppingItem && (
        <ImageCropModal
          isOpen={Boolean(croppingItem)}
          imageSrc={croppingItem.url}
          fileName={croppingItem.name}
          aspectRatio={aspectRatio}
          shape="rect"
          title={`Adjust & Crop Photo (${aspectRatio})`}
          subtitle="Drag to reposition frame, use slider to zoom into the crop frame"
          roleBadge="ASPECT RATIO CROP"
          onCancel={() => setCroppingItem(null)}
          onApply={handleCropApply}
        />
      )}

      {/* ====================================================================
          SUB-MODALS: FULLSCREEN MEDIA LIGHTBOX
          ==================================================================== */}
      {lightboxMedia && (
        <div className="pp-modal-overlay">
          <div className="pp-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <div className="pp-lightbox-header">
              <span>{lightboxMedia.name || 'Media Preview'}</span>
              <button
                type="button"
                className="pp-lightbox-close"
                onClick={() => setLightboxMedia(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="pp-lightbox-body">
              {lightboxMedia.type === 'video' ? (
                <video
                  src={lightboxMedia.url}
                  controls
                  autoPlay
                  playsInline
                  className="pp-lightbox-video"
                />
              ) : (
                <img
                  src={lightboxMedia.croppedUrl || lightboxMedia.url}
                  alt={lightboxMedia.name}
                  className="pp-lightbox-img"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
