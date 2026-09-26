import { useState, useRef, useEffect } from 'react'
import ImageCropModal from '../../../components/Auth/ImageCropModal'

const EMPTY_POSTS = []

const createMediaId = () =>
  `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`

// -----------------------------------------------------------------------------
// Public Post Composer & Submission Modal
// -----------------------------------------------------------------------------

export default function PublicPostModal({
  isOpen,
  onClose,
  posts = EMPTY_POSTS,
  student = {},
  onCreatePost,
  onUpdatePost,
  onDeletePost,
  onSubmitDraft,
}) {
  // Navigation & Editing State
  const [activeTab, setActiveTab] = useState('create') // 'create' | 'history'
  const [editingPostId, setEditingPostId] = useState(null)
  const [successToast, setSuccessToast] = useState('')

  // Composer Form State
  const [caption, setCaption] = useState('')
  const [category, setCategory] = useState('Technical Achievement')
  const [aspectRatio, setAspectRatio] = useState('1:1') // '1:1' | '4:5' | '16:9'
  const [mediaList, setMediaList] = useState([]) // [{ id, name, size, type: 'image'|'video', url, croppedUrl, file }]
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const [fileError, setFileError] = useState('')
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  // Media Inspection & Crop Sub-modals
  const [lightboxMedia, setLightboxMedia] = useState(null) // { name, type, url }
  const [croppingItem, setCroppingItem] = useState(null) // media object to crop

  // Refs
  const addMoreInputRef = useRef(null)
  const replaceInputRef = useRef(null)
  const initialDropInputRef = useRef(null)
  const objectUrlsRef = useRef([])

  // Student details with clean fallbacks
  const authorName = student?.name || 'Verified Student Member'
  const authorEmail = student?.email || 'student@institution.edu'
  const authorHandle = student?.email ? `@${student.email.split('@')[0]}` : '@student'
  const authorAvatar = student?.profilePic || ''
  const authorInstitution = student?.institution || 'IAS Collaboration Network'
  const authorCourse = student?.course || ''

  // Track & clean up created blob URLs
  const createTrackedBlobUrl = (file) => {
    const url = URL.createObjectURL(file)
    objectUrlsRef.current.push(url)
    return url
  }

  useEffect(() => {
    const urls = objectUrlsRef.current
    return () => {
      urls.forEach((url) => {
        try {
          URL.revokeObjectURL(url)
        } catch {}
      })
    }
  }, [])

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // Escape key listener to close modal or sub-modals
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxMedia) {
          e.stopPropagation()
          setLightboxMedia(null)
        } else if (croppingItem) {
          e.stopPropagation()
          setCroppingItem(null)
        } else {
          onClose?.()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [isOpen, lightboxMedia, croppingItem, onClose])

  if (!isOpen) return null

  // Format file size helper
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB'
    const k = 1024
    if (bytes >= k * k) {
      return `${(bytes / (k * k)).toFixed(1)} MB`
    }
    return `${Math.round(bytes / k)} KB`
  }

  // Validate and ingest multiple files
  const handleProcessFiles = (fileList, isAppend = true) => {
    if (!fileList || fileList.length === 0) return
    setFileError('')

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
        encounteredError = `"${file.name}" exceeds 15MB image size limit (${formatFileSize(file.size)}).`
        return
      }

      if (isVideo && file.size > maxVidSize) {
        encounteredError = `"${file.name}" exceeds 60MB video size limit (${formatFileSize(file.size)}).`
        return
      }

      const objectUrl = createTrackedBlobUrl(file)
      newMediaItems.push({
        id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: file.name,
        size: formatFileSize(file.size),
        type: isImage ? 'image' : 'video',
        url: objectUrl,
        croppedUrl: null,
        file,
      })
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

  // Replace active media item
  const handleReplaceActiveFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
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
    }

    setMediaList((prev) =>
      prev.map((item, idx) => (idx === activeMediaIndex ? replacement : item))
    )

    if (replaceInputRef.current) replaceInputRef.current.value = ''
  }

  // Delete active media item
  const handleDeleteMedia = (indexToDelete) => {
    setMediaList((prev) => {
      const filtered = prev.filter((_, idx) => idx !== indexToDelete)
      if (activeMediaIndex >= filtered.length) {
        setActiveMediaIndex(Math.max(0, filtered.length - 1))
      }
      return filtered
    })
  }

  // Apply Crop to active image
  const handleCropApply = (croppedDataUrl) => {
    if (!croppingItem) return
    setMediaList((prev) =>
      prev.map((item) =>
        item.id === croppingItem.id
          ? { ...item, croppedUrl: croppedDataUrl }
          : item
      )
    )
    setCroppingItem(null)
  }

  // Save / Submit Post
  const handleSavePost = (isDraft = false) => {
    if (!caption.trim() && mediaList.length === 0) {
      setFileError('Please write a caption or add at least one photo/video to your post.')
      return
    }

    const postPayload = {
      id: editingPostId || `post_${Date.now()}`,
      title: caption.trim() ? caption.trim().slice(0, 48) + (caption.trim().length > 48 ? '...' : '') : 'Media Showcase',
      caption: caption.trim(),
      content: caption.trim(),
      category,
      aspectRatio,
      media: mediaList.map((m) => ({
        id: m.id,
        name: m.name,
        size: m.size,
        type: m.type,
        url: m.croppedUrl || m.url,
      })),
      attachment: mediaList[0]?.name || '',
      attachmentUrl: mediaList[0]?.croppedUrl || mediaList[0]?.url || '',
      attachmentType: mediaList[0]?.type || 'image',
      attachmentSize: mediaList[0]?.size || '',
      author: {
        name: authorName,
        email: authorEmail,
        avatar: authorAvatar,
        institution: authorInstitution,
        course: authorCourse,
      },
      status: isDraft ? 'draft' : 'pending',
    }

    if (editingPostId) {
      onUpdatePost?.(postPayload, !isDraft)
      setSuccessToast(isDraft ? 'Draft updated successfully.' : 'Post resubmitted for Portal Admin verification.')
    } else {
      onCreatePost?.(postPayload, isDraft)
      setSuccessToast(isDraft ? 'Draft post saved.' : 'Post submitted for Portal Admin verification.')
    }

    // Reset composer state
    setEditingPostId(null)
    setCaption('')
    setMediaList([])
    setActiveMediaIndex(0)
    setFileError('')
    setActiveTab('history')

    setTimeout(() => {
      setSuccessToast('')
    }, 4500)
  }

  // Load a post into the composer to revise and resubmit
  const handleRevisePost = (post) => {
    setEditingPostId(post.id)
    setCaption(post.caption || post.content || '')
    setCategory(post.category || 'Technical Achievement')
    setAspectRatio(post.aspectRatio || '1:1')

    if (Array.isArray(post.media) && post.media.length > 0) {
      setMediaList(post.media.map((m) => ({ ...m })))
    } else if (post.attachmentUrl || post.attachment) {
      setMediaList([
        {
          id: createMediaId(),
          name: post.attachment || 'Attached Media',
          size: post.attachmentSize || '',
          type: post.attachmentType || 'image',
          url: post.attachmentUrl,
          croppedUrl: null,
        },
      ])
    } else {
      setMediaList([])
    }
    setActiveMediaIndex(0)
    setFileError('')
    setActiveTab('create')
  }

  const activeMedia = mediaList[activeMediaIndex]

  // Aspect ratio styling helpers
  const getAspectRatioStyle = (ratio) => {
    switch (ratio) {
      case '4:5':
        return { aspectRatio: '4 / 5', maxWidth: '370px' }
      case '16:9':
        return { aspectRatio: '16 / 9', maxWidth: '580px' }
      case '1:1':
      default:
        return { aspectRatio: '1 / 1', maxWidth: '440px' }
    }
  }

  // ---------------------------------------------------------------------------
  // View Rendering
  // ---------------------------------------------------------------------------
  return (
    <div
      className="sp-post-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sp-post-dialog-title"
    >
      <style>{`
        .sp-post-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(10, 22, 36, 0.72);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1250;
          padding: 16px;
          box-sizing: border-box;
          animation: spPostFadeIn 0.18s ease-out;
        }

        .sp-post-card {
          width: 100%;
          max-width: 940px;
          background: #ffffff;
          border-radius: 10px;
          border: 1px solid #ded9cc;
          box-shadow: 0 24px 60px rgba(10, 20, 32, 0.32);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 92vh;
          box-sizing: border-box;
          animation: spPostSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Header */
        .sp-post-header {
          padding: 14px 22px;
          background: #112233;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid #b38e44;
          flex-shrink: 0;
        }

        .sp-post-header-title {
          font-size: 1.08rem;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 9px;
          color: #ffffff;
        }

        .sp-post-header-sub {
          font-size: 0.76rem;
          color: #cbd5e1;
          margin-top: 1px;
        }

        .sp-post-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
          color: #e2e8f0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .sp-post-close-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        /* Navigation Tabs */
        .sp-post-tabs {
          display: flex;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 22px;
          gap: 6px;
          flex-shrink: 0;
        }

        .sp-post-tab-btn {
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          padding: 12px 16px;
          font-size: 0.86rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.15s ease;
        }

        .sp-post-tab-btn:hover {
          color: #0f172a;
        }

        .sp-post-tab-btn.active {
          color: #0f172a;
          border-bottom-color: #b38e44;
          font-weight: 700;
          background: #ffffff;
        }

        /* Scrollable Body */
        .sp-post-body {
          padding: 20px 22px;
          overflow-y: auto;
          flex: 1;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* Success / Alert Toasts */
        .sp-post-alert-success {
          background: #dcfce7;
          border: 1px solid #86efac;
          color: #166534;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 0.84rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sp-post-alert-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 0.84rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Author Profile Bar */
        .sp-post-author-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px 14px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .sp-post-author-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sp-post-author-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid #b38e44;
          object-fit: cover;
          background: #112233;
          color: #ffffff;
          font-weight: 700;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sp-post-author-info {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .sp-post-author-name {
          font-size: 0.94rem;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sp-post-author-sub {
          font-size: 0.76rem;
          color: #64748b;
        }

        .sp-post-author-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: #166534;
          background: #dcfce7;
          border: 1px solid #bbf7d0;
          padding: 3px 8px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        /* Caption Textarea */
        .sp-post-caption-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sp-post-caption-input {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.92rem;
          font-family: inherit;
          color: #0f172a;
          resize: vertical;
          min-height: 80px;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          background: #fafbfc;
        }

        .sp-post-caption-input:focus {
          border-color: #112233;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(17, 34, 51, 0.08);
        }

        .sp-post-caption-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          color: #64748b;
        }

        /* Aspect Ratio Segmented Control */
        .sp-post-ratio-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f1f5f9;
          border-radius: 8px;
          padding: 6px 12px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .sp-post-ratio-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sp-post-ratio-pills {
          display: inline-flex;
          background: #e2e8f0;
          border-radius: 6px;
          padding: 2px;
          gap: 2px;
        }

        .sp-post-ratio-btn {
          border: none;
          background: transparent;
          font-size: 0.76rem;
          font-weight: 600;
          color: #475569;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.15s ease;
        }

        .sp-post-ratio-btn:hover {
          color: #0f172a;
        }

        .sp-post-ratio-btn.active {
          background: #112233;
          color: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        }

        /* Dropzone / Upload Area */
        .sp-post-dropzone {
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          background: #fafaf9;
          padding: 36px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .sp-post-dropzone:hover,
        .sp-post-dropzone.dragging {
          border-color: #112233;
          background: #f1f5f9;
        }

        .sp-post-drop-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #334155;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sp-post-drop-title {
          font-size: 0.98rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .sp-post-drop-sub {
          font-size: 0.8rem;
          color: #64748b;
          max-width: 440px;
          line-height: 1.4;
          margin: 0;
        }

        .sp-post-btn-browse {
          background: #112233;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 8px 18px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 4px;
          transition: background 0.15s ease;
        }

        .sp-post-btn-browse:hover {
          background: #1b525c;
        }

        /* Active Media Stage */
        .sp-post-stage-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .sp-post-stage-container {
          width: 100%;
          position: relative;
          background: #0f172a;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .sp-post-stage-img,
        .sp-post-stage-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Stage Overlay Action Bar */
        .sp-post-stage-overlay-bar {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 10;
        }

        .sp-post-stage-index-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(15, 23, 42, 0.75);
          color: #ffffff;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
          backdrop-filter: blur(4px);
          z-index: 10;
        }

        .sp-post-stage-btn {
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          backdrop-filter: blur(4px);
          transition: all 0.15s ease;
        }

        .sp-post-stage-btn:hover {
          background: #112233;
          border-color: #b38e44;
          color: #ffffff;
        }

        .sp-post-stage-btn.danger:hover {
          background: #b91c1c;
          border-color: #ef4444;
        }

        /* Thumbnails Strip */
        .sp-post-thumbnails-tray {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          overflow-x: auto;
          padding: 6px 2px 10px;
          box-sizing: border-box;
        }

        .sp-post-thumb-card {
          width: 68px;
          height: 68px;
          border-radius: 6px;
          border: 2px solid #cbd5e1;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
          background: #1e293b;
          transition: all 0.15s ease;
        }

        .sp-post-thumb-card:hover {
          border-color: #64748b;
        }

        .sp-post-thumb-card.active {
          border-color: #b38e44;
          box-shadow: 0 0 0 2px rgba(179, 142, 68, 0.35);
        }

        .sp-post-thumb-img,
        .sp-post-thumb-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .sp-post-thumb-badge {
          position: absolute;
          bottom: 2px;
          right: 2px;
          background: rgba(0, 0, 0, 0.7);
          color: #ffffff;
          border-radius: 3px;
          padding: 1px 3px;
          font-size: 9px;
          line-height: 1;
        }

        .sp-post-thumb-del {
          position: absolute;
          top: 2px;
          right: 2px;
          background: rgba(185, 28, 28, 0.85);
          color: #ffffff;
          border: none;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          cursor: pointer;
          line-height: 1;
        }

        .sp-post-thumb-add-btn {
          width: 68px;
          height: 68px;
          border-radius: 6px;
          border: 2px dashed #94a3b8;
          background: #f8fafc;
          color: #475569;
          font-size: 0.72rem;
          font-weight: 700;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .sp-post-thumb-add-btn:hover {
          border-color: #112233;
          color: #112233;
          background: #f1f5f9;
        }

        /* Policy & Verification Note */
        .sp-post-policy-note {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-left: 4px solid #16a34a;
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 0.78rem;
          color: #166534;
          line-height: 1.45;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        /* Footer */
        .sp-post-footer {
          padding: 14px 22px;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          flex-shrink: 0;
        }

        .sp-post-footer-hint {
          font-size: 0.76rem;
          color: #64748b;
        }

        .sp-post-actions-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sp-post-btn-draft {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-size: 0.84rem;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .sp-post-btn-draft:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }

        .sp-post-btn-submit {
          background: #16a34a;
          border: 1px solid #15803d;
          color: #ffffff;
          font-size: 0.86rem;
          font-weight: 700;
          padding: 9px 20px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: all 0.15s ease;
          box-shadow: 0 1px 3px rgba(22, 163, 74, 0.25);
        }

        .sp-post-btn-submit:hover {
          background: #15803d;
          box-shadow: 0 2px 6px rgba(22, 163, 74, 0.35);
        }

        .sp-post-btn-submit:disabled {
          background: #94a3b8;
          border-color: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Submitted Posts History View */
        .sp-history-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sp-history-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sp-history-card.pending {
          border-left: 4px solid #d97706;
        }

        .sp-history-card.approved {
          border-left: 4px solid #16a34a;
        }

        .sp-history-card.rejected,
        .sp-history-card.revision {
          border-left: 4px solid #dc2626;
        }

        .sp-history-card.draft {
          border-left: 4px solid #64748b;
        }

        .sp-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 12px;
          text-transform: capitalize;
        }

        .sp-status-badge.pending {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        }

        .sp-status-badge.approved {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .sp-status-badge.rejected,
        .sp-status-badge.revision {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .sp-status-badge.draft {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
        }

        .sp-history-rejection-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 0.8rem;
          color: #991b1b;
          line-height: 1.45;
        }

        .sp-history-media-gallery {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 6px;
        }

        .sp-history-media-item {
          border-radius: 6px;
          overflow: hidden;
          background: #0f172a;
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        /* Dedicated Lightbox Overlay */
        .sp-lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 20, 30, 0.92);
          z-index: 1400;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
          backdrop-filter: blur(6px);
          animation: spPostFadeIn 0.16s ease-out;
        }

        .sp-lightbox-card {
          max-width: 90vw;
          max-height: 90vh;
          background: #000000;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
        }

        .sp-lightbox-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 12px 18px;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
          color: #ffffff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 20;
        }

        .sp-lightbox-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: #ffffff;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        @keyframes spPostFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes spPostSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

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
        onChange={handleReplaceActiveFile}
      />

      <div className="sp-post-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sp-post-header">
          <div>
            <h3 id="sp-post-dialog-title" className="sp-post-header-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b38e44" strokeWidth="2.4">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              {editingPostId ? 'Revise Public Post' : 'Create Public Post'}
            </h3>
            <div className="sp-post-header-sub">
              Broadcast academic milestones, capstones & research papers • Admin Verification Enforced
            </div>
          </div>
          <button
            type="button"
            className="sp-post-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="sp-post-tabs">
          <button
            type="button"
            className={`sp-post-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {editingPostId ? 'Edit / Revise Post' : 'Compose Post'}
          </button>
          <button
            type="button"
            className={`sp-post-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('history')
              setEditingPostId(null)
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            My Submitted Posts ({posts.length})
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="sp-post-body">
          {/* Notification / Toast Alert */}
          {successToast && (
            <div className="sp-post-alert-success" role="status">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{successToast}</span>
            </div>
          )}

          {fileError && (
            <div className="sp-post-alert-error" role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{fileError}</span>
            </div>
          )}

          {activeTab === 'create' ? (
            <>
              {/* Author Identity Bar (Automatically Associated) */}
              <div className="sp-post-author-bar">
                <div className="sp-post-author-left">
                  {authorAvatar ? (
                    <img src={authorAvatar} alt={authorName} className="sp-post-author-avatar" />
                  ) : (
                    <div className="sp-post-author-avatar">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="sp-post-author-info">
                    <span className="sp-post-author-name">
                      {authorName}
                      <span className="sp-post-author-tag">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Student Author
                      </span>
                    </span>
                    <span className="sp-post-author-sub">
                      {authorHandle} • {authorInstitution} {authorCourse ? `(${authorCourse})` : ''}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Submits as <strong>Pending Verification</strong>
                </div>
              </div>

              {/* Caption & Description Input */}
              <div className="sp-post-caption-box">
                <textarea
                  className="sp-post-caption-input"
                  rows="3"
                  placeholder="Write a description or caption for your public achievement, capstone project, research findings, or milestone..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={1200}
                />
                <div className="sp-post-caption-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569' }}>
                      Category:
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: 4,
                        border: '1px solid #cbd5e1',
                        fontSize: '0.76rem',
                        background: '#ffffff',
                        color: '#1e293b',
                      }}
                    >
                      <option value="Technical Achievement">Technical Achievement & Hackathons</option>
                      <option value="Academic Research">Academic Research & Papers</option>
                      <option value="Open Source Project">Open Source & Software Release</option>
                      <option value="Internship Experience">Internship & Industry Experience</option>
                      <option value="Campus Initiative">Campus Initiative & Leadership</option>
                    </select>
                  </div>
                  <span>{caption.length} / 1200 characters</span>
                </div>
              </div>

              {/* Media Aspect Ratio Selector */}
              <div className="sp-post-ratio-toolbar">
                <span className="sp-post-ratio-label">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Media Aspect Ratio:
                </span>
                <div className="sp-post-ratio-pills" role="radiogroup" aria-label="Media Aspect Ratio">
                  <button
                    type="button"
                    className={`sp-post-ratio-btn ${aspectRatio === '1:1' ? 'active' : ''}`}
                    onClick={() => setAspectRatio('1:1')}
                    title="Square Aspect Ratio (1:1)"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                    </svg>
                    Square (1:1)
                  </button>
                  <button
                    type="button"
                    className={`sp-post-ratio-btn ${aspectRatio === '4:5' ? 'active' : ''}`}
                    onClick={() => setAspectRatio('4:5')}
                    title="Portrait Aspect Ratio (4:5)"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="5" y="2" width="14" height="20" rx="2" />
                    </svg>
                    Portrait (4:5)
                  </button>
                  <button
                    type="button"
                    className={`sp-post-ratio-btn ${aspectRatio === '16:9' ? 'active' : ''}`}
                    onClick={() => setAspectRatio('16:9')}
                    title="Landscape Aspect Ratio (16:9)"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                    </svg>
                    Landscape (16:9)
                  </button>
                </div>
              </div>

              {/* Upload Dropzone or Multi-Media Stage */}
              {mediaList.length === 0 ? (
                <div
                  className={`sp-post-dropzone ${isDraggingOver ? 'dragging' : ''}`}
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
                >
                  <div className="sp-post-drop-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                  <h4 className="sp-post-drop-title">Add Photos & Videos to Your Post</h4>
                  <p className="sp-post-drop-sub">
                    Upload multiple images (JPG, PNG, WEBP) and videos (MP4, WebM, MOV) in the same post.
                    All media will be framed cleanly according to your chosen aspect ratio.
                  </p>
                  <button
                    type="button"
                    className="sp-post-btn-browse"
                    onClick={(e) => {
                      e.stopPropagation()
                      initialDropInputRef.current?.click()
                    }}
                  >
                    Browse Files
                  </button>
                </div>
              ) : (
                <div className="sp-post-stage-wrapper">
                  {/* Main Active Media Stage */}
                  <div
                    className="sp-post-stage-container"
                    style={getAspectRatioStyle(aspectRatio)}
                  >
                    {/* Index Indicator */}
                    <div className="sp-post-stage-index-badge">
                      {activeMediaIndex + 1} / {mediaList.length} • {activeMedia?.type === 'video' ? 'Video' : 'Photo'}
                    </div>

                    {/* Stage Actions: View, Adjust/Crop, Replace, Delete */}
                    <div className="sp-post-stage-overlay-bar">
                      {/* View Action */}
                      <button
                        type="button"
                        className="sp-post-stage-btn"
                        onClick={() => setLightboxMedia(activeMedia)}
                        title="View full size"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                        View
                      </button>

                      {/* Adjust / Crop (for Photos) */}
                      {activeMedia?.type === 'image' && (
                        <button
                          type="button"
                          className="sp-post-stage-btn"
                          onClick={() => setCroppingItem(activeMedia)}
                          title="Adjust and crop to aspect ratio"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                            <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15" />
                            <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15" />
                          </svg>
                          Adjust / Crop
                        </button>
                      )}

                      {/* Replace Action */}
                      <button
                        type="button"
                        className="sp-post-stage-btn"
                        onClick={() => replaceInputRef.current?.click()}
                        title="Replace this media file"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <polyline points="23 4 23 10 17 10" />
                          <polyline points="1 20 1 14 7 14" />
                          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        Replace
                      </button>

                      {/* Delete Action */}
                      <button
                        type="button"
                        className="sp-post-stage-btn danger"
                        onClick={() => handleDeleteMedia(activeMediaIndex)}
                        title="Delete this media"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Delete
                      </button>
                    </div>

                    {/* Active Media Renderer */}
                    {activeMedia?.type === 'video' ? (
                      <video
                        src={activeMedia.url}
                        controls
                        playsInline
                        className="sp-post-stage-video"
                      />
                    ) : (
                      <img
                        src={activeMedia?.croppedUrl || activeMedia?.url}
                        alt={activeMedia?.name}
                        className="sp-post-stage-img"
                      />
                    )}
                  </div>

                  {/* Thumbnail Strip with "Add More Media" Action */}
                  <div className="sp-post-thumbnails-tray">
                    {mediaList.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`sp-post-thumb-card ${idx === activeMediaIndex ? 'active' : ''}`}
                        onClick={() => setActiveMediaIndex(idx)}
                        title={item.name}
                      >
                        {item.type === 'video' ? (
                          <video src={item.url} className="sp-post-thumb-video" />
                        ) : (
                          <img
                            src={item.croppedUrl || item.url}
                            alt={item.name}
                            className="sp-post-thumb-img"
                          />
                        )}
                        <span className="sp-post-thumb-badge">
                          {item.type === 'video' ? '▶' : '📷'}
                        </span>
                        <button
                          type="button"
                          className="sp-post-thumb-del"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteMedia(idx)
                          }}
                          aria-label={`Delete ${item.name}`}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {/* "Add More Media" Button */}
                    <button
                      type="button"
                      className="sp-post-thumb-add-btn"
                      onClick={() => addMoreInputRef.current?.click()}
                      title="Add more photos or videos to this post"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add More
                    </button>
                  </div>
                </div>
              )}

              {/* Policy Notice Box */}
              <div className="sp-post-policy-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div>
                  <strong>Admin Verification Standard:</strong> Public posts broadcast to the institutional community and recruiter network. Every submission undergoes compliance review by the <strong>Portal Admin</strong> and remains in <em>Pending Verification</em> until approved.
                </div>
              </div>
            </>
          ) : (
            /* "My Submitted Posts" History Tab */
            <div className="sp-history-grid">
              {posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" style={{ marginBottom: 10 }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.96rem', color: '#334155' }}>
                    No Public Posts Submitted Yet
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.82rem' }}>
                    Use the &quot;Compose Post&quot; tab to publish academic achievements, research, and project milestones.
                  </p>
                </div>
              ) : (
                posts.map((post) => {
                  const status = post.status || 'draft'
                  const postMedia = Array.isArray(post.media) && post.media.length > 0
                    ? post.media
                    : post.attachmentUrl
                    ? [{ id: 'm1', name: post.attachment, url: post.attachmentUrl, type: post.attachmentType || 'image' }]
                    : []

                  return (
                    <div key={post.id} className={`sp-history-card ${status}`}>
                      {/* Post Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {authorAvatar ? (
                            <img src={authorAvatar} alt={authorName} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #b38e44' }} />
                          ) : (
                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#112233', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                              {authorName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 style={{ margin: 0, fontSize: '0.96rem', color: '#0f172a', fontWeight: 700 }}>
                              {post.title}
                            </h4>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', gap: 8, alignItems: 'center', marginTop: 1 }}>
                              <span>{post.category}</span>
                              <span>•</span>
                              <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}</span>
                              {post.aspectRatio && (
                                <>
                                  <span>•</span>
                                  <span>Ratio: {post.aspectRatio}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {status === 'approved' && (
                            <span className="sp-status-badge approved">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Approved & Public
                            </span>
                          )}
                          {status === 'pending' && (
                            <span className="sp-status-badge pending">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              Pending Verification
                            </span>
                          )}
                          {(status === 'rejected' || status === 'revision') && (
                            <span className="sp-status-badge rejected">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                              </svg>
                              Needs Revision
                            </span>
                          )}
                          {status === 'draft' && (
                            <span className="sp-status-badge draft">
                              Draft (Private)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Post Caption / Description */}
                      {(post.caption || post.content) && (
                        <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                          {post.caption || post.content}
                        </div>
                      )}

                      {/* Post Media Gallery */}
                      {postMedia.length > 0 && (
                        <div className="sp-history-media-gallery">
                          {postMedia.map((m, mIdx) => (
                            <div
                              key={m.id || mIdx}
                              className="sp-history-media-item"
                              style={{
                                ...getAspectRatioStyle(post.aspectRatio || '1:1'),
                                height: 180,
                                width: post.aspectRatio === '16:9' ? 320 : post.aspectRatio === '4:5' ? 144 : 180,
                              }}
                              onClick={() => setLightboxMedia(m)}
                              title="Click to view full size"
                            >
                              {m.type === 'video' ? (
                                <video src={m.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <img src={m.url} alt={m.name || 'Media'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              )}
                              <span
                                style={{
                                  position: 'absolute',
                                  bottom: 6,
                                  right: 6,
                                  background: 'rgba(0,0,0,0.7)',
                                  color: '#fff',
                                  fontSize: '10px',
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                }}
                              >
                                {m.type === 'video' ? '▶ Video' : '📷 Photo'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Admin Rejection / Revision Note */}
                      {(status === 'rejected' || status === 'revision') && (
                        <div className="sp-history-rejection-box">
                          <strong style={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                            Portal Admin Revision Required:
                          </strong>
                          <p style={{ margin: '4px 0 0' }}>
                            &quot;{post.rejectionReason || 'Please clarify your methodology, ensure image resolution is clear, or attach institutional authorization.'}&quot;
                          </p>
                        </div>
                      )}

                      {/* Action Bar inside Card */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 10, flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          {status === 'approved' && 'Verified and visible on institutional showcase'}
                          {status === 'pending' && 'Review in progress with Central Portal Admin'}
                          {(status === 'rejected' || status === 'revision') && 'Action required before public verification'}
                          {status === 'draft' && 'Private draft saved to your session'}
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          {(status === 'rejected' || status === 'revision') && (
                            <button
                              type="button"
                              className="sp-post-btn-submit"
                              style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                              onClick={() => handleRevisePost(post)}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                              </svg>
                              Revise & Resubmit
                            </button>
                          )}

                          {status === 'draft' && (
                            <button
                              type="button"
                              className="sp-post-btn-submit"
                              style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                              onClick={() => onSubmitDraft?.(post.id)}
                            >
                              Submit Draft for Verification
                            </button>
                          )}

                          <button
                            type="button"
                            className="sp-post-btn-draft"
                            style={{ padding: '6px 12px', fontSize: '0.78rem', color: '#b91c1c' }}
                            onClick={() => onDeletePost?.(post.id)}
                            title="Delete this post"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sp-post-footer">
          <div className="sp-post-footer-hint">
            Moderation authority: <strong>IAS Collaboration Portal Central Editorial Board</strong>
          </div>

          <div className="sp-post-actions-right">
            {activeTab === 'create' && (
              <>
                <button
                  type="button"
                  className="sp-post-btn-draft"
                  onClick={() => handleSavePost(true)}
                  disabled={!caption.trim() && mediaList.length === 0}
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  className="sp-post-btn-submit"
                  onClick={() => handleSavePost(false)}
                  disabled={!caption.trim() && mediaList.length === 0}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Submit for Admin Verification
                </button>
              </>
            )}
            <button
              type="button"
              className="sp-post-btn-draft"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Image Cropping Sub-Modal */}
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

      {/* Media Lightbox Full Preview Modal */}
      {lightboxMedia && (
        <div className="sp-lightbox-overlay">
          <div
            className="sp-lightbox-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Full Media Preview"
          >
            <div className="sp-lightbox-header">
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                {lightboxMedia.name || 'Media Preview'}
              </span>
              <button
                type="button"
                className="sp-lightbox-close"
                onClick={() => setLightboxMedia(null)}
                aria-label="Close lightbox"
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {lightboxMedia.type === 'video' ? (
                <video
                  src={lightboxMedia.url}
                  controls
                  autoPlay
                  playsInline
                  style={{ maxWidth: '85vw', maxHeight: '75vh', borderRadius: 6 }}
                />
              ) : (
                <img
                  src={lightboxMedia.croppedUrl || lightboxMedia.url}
                  alt={lightboxMedia.name}
                  style={{ maxWidth: '85vw', maxHeight: '75vh', objectFit: 'contain', borderRadius: 6 }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
