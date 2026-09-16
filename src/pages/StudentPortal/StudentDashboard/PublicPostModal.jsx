import { useState, useRef, useEffect } from 'react'

export default function PublicPostModal({
  isOpen,
  onClose,
  posts = [],
  onCreatePost,
  onSubmitDraft,
}) {
  const [activeView, setActiveView] = useState('create') // 'create' | 'history'
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Technical Achievement')
  const [content, setContent] = useState('')

  // Attachment & Preview State
  const [attachmentName, setAttachmentName] = useState('')
  const [attachmentSize, setAttachmentSize] = useState('')
  const [attachmentType, setAttachmentType] = useState('') // 'image' | 'pdf'
  const [previewUrl, setPreviewUrl] = useState(null)
  const [fileError, setFileError] = useState('')
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [activePreviewDoc, setActivePreviewDoc] = useState(null) // { name, url, type, size }
  const fileInputRef = useRef(null)

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Escape key listener for the preview modal
  useEffect(() => {
    if (!isPreviewModalOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setIsPreviewModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [isPreviewModalOpen])

  if (!isOpen) return null

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileError('')

    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
    const validExts = ['.pdf', '.png', '.jpg', '.jpeg']
    const isPdf = file.type === 'application/pdf' || ext === '.pdf'
    const isImage = file.type.startsWith('image/') || ['.png', '.jpg', '.jpeg'].includes(ext)

    // Type validation
    if (!validExts.includes(ext) || (!isPdf && !isImage)) {
      setFileError('Invalid file format. Please upload a PDF, JPG, JPEG, or PNG document.')
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setAttachmentName('')
      setAttachmentSize('')
      setAttachmentType('')
      setPreviewUrl(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Size validation (Max 10 MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setFileError(`File size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a smaller file.`)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setAttachmentName('')
      setAttachmentSize('')
      setAttachmentType('')
      setPreviewUrl(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Revoke previous object URL if any
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const formattedSize = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`

    const objectUrl = URL.createObjectURL(file)
    setAttachmentName(file.name)
    setAttachmentSize(formattedSize)
    setAttachmentType(isPdf ? 'pdf' : 'image')
    setPreviewUrl(objectUrl)
    setFileError('')
  }

  const handleRemoveAttachment = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setAttachmentName('')
    setAttachmentSize('')
    setAttachmentType('')
    setPreviewUrl(null)
    setFileError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleOpenCurrentPreview = () => {
    if (!previewUrl) return
    setActivePreviewDoc({
      name: attachmentName,
      size: attachmentSize,
      type: attachmentType,
      url: previewUrl,
    })
    setIsPreviewModalOpen(true)
  }

  const handleOpenSubmittedPreview = (post) => {
    if (post.attachmentUrl) {
      setActivePreviewDoc({
        name: post.attachment,
        size: post.attachmentSize || 'Uploaded Attachment',
        type: post.attachmentType || (post.attachment.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'),
        url: post.attachmentUrl,
      })
      setIsPreviewModalOpen(true)
    } else {
      // Fallback for demo records without an active blob
      alert(`Attachment: "${post.attachment}"\nThis institutional proof was archived with Portal Admin. Live document preview is active for current session uploads.`)
    }
  }

  const handleSave = (asDraft) => {
    if (!title.trim() || !content.trim()) return
    onCreatePost?.(
      {
        title: title.trim(),
        category,
        content: content.trim(),
        attachment: attachmentName,
        attachmentUrl: previewUrl,
        attachmentSize: attachmentSize,
        attachmentType: attachmentType,
      },
      asDraft
    )
    setTitle('')
    setContent('')
    // Keep previewUrl alive in memory for the session list, but reset form state
    setAttachmentName('')
    setAttachmentSize('')
    setAttachmentType('')
    setPreviewUrl(null)
    setFileError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    setActiveView('history')
  }

  return (
    <div className="post-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="post-modal-title">
      <style>{`
        .post-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 29, 47, 0.65);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1200;
          padding: 20px;
          box-sizing: border-box;
          animation: postFadeIn 0.18s ease-out;
        }

        .post-modal-card {
          width: 100%;
          max-width: 820px;
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #d9d4c7;
          box-shadow: 0 20px 48px rgba(12, 24, 38, 0.28);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          box-sizing: border-box;
          animation: postSlideUp 0.2s ease-out;
        }

        .post-header {
          padding: 16px 24px;
          background: #112233;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid #b38e44;
        }

        .post-tabs {
          display: flex;
          background: #f4f2eb;
          border-bottom: 1px solid #ded9cc;
          padding: 0 24px;
          gap: 8px;
        }

        .post-tab-btn {
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          padding: 12px 16px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.15s ease;
        }

        .post-tab-btn:hover {
          color: #112233;
        }

        .post-tab-btn.active {
          color: #112233;
          border-bottom-color: #b38e44;
          background: #ffffff;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }

        .post-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .post-policy-box {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-left: 4px solid #1e3a5f;
          border-radius: 6px;
          padding: 12px 16px;
          font-size: 0.82rem;
          color: #334155;
          line-height: 1.5;
        }

        .post-form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .post-form-field label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .post-form-field input[type="text"], 
        .post-form-field select, 
        .post-form-field textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          font-size: 0.88rem;
          color: #1e293b;
          font-family: inherit;
        }

        .post-form-field input:focus, .post-form-field select:focus, .post-form-field textarea:focus {
          outline: none;
          border-color: #1e3a5f;
          box-shadow: 0 0 0 2px rgba(30, 58, 95, 0.15);
        }

        /* File Upload & Preview Specifics */
        .post-file-input-native {
          width: 100%;
          box-sizing: border-box;
          padding: 8px 10px;
          border: 1px dashed #cbd5e1;
          border-radius: 6px;
          background: #fafaf9;
          font-size: 0.84rem;
          color: #475569;
          cursor: pointer;
        }

        .post-file-input-native:focus {
          outline: none;
          border-color: #1e3a5f;
        }

        .post-file-error {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          font-size: 0.78rem;
          padding: 6px 10px;
          border-radius: 4px;
          margin-top: 4px;
        }

        .post-file-selected-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f0fdf4;
          border: 1px solid #86efac;
          border-radius: 6px;
          padding: 8px 14px;
          margin-top: 6px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .post-file-meta-left {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
          min-width: 0;
          flex: 1 1 200px;
        }

        .post-file-badge-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: #dcfce7;
          border: 1px solid #86efac;
          color: #15803d;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .post-file-details {
          display: flex;
          flex-direction: column;
          gap: 1px;
          overflow: hidden;
          min-width: 0;
          flex: 1;
        }

        .post-file-name {
          font-size: 0.84rem;
          font-weight: 700;
          color: #166534;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .post-file-size {
          font-size: 0.72rem;
          color: #15803d;
        }

        .post-file-actions-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .post-btn-preview-action {
          background: #ffffff;
          border: 1px solid #86efac;
          color: #15803d;
          font-size: 0.76rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.15s ease;
        }

        .post-btn-preview-action:hover {
          background: #dcfce7;
          border-color: #4ade80;
          color: #14532d;
        }

        .post-btn-remove-action {
          background: transparent;
          border: 1px solid #cbd5e1;
          color: #64748b;
          font-size: 0.74rem;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .post-btn-remove-action:hover {
          background: #fee2e2;
          border-color: #fca5a5;
          color: #b91c1c;
        }

        .post-actions-bar {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 10px;
        }

        .post-btn-draft {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-size: 0.84rem;
          font-weight: 600;
          padding: 9px 18px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .post-btn-draft:hover {
          background: #f1f5f9;
        }

        .post-btn-submit {
          background: #1e3a5f;
          border: 1px solid #152942;
          color: #ffffff;
          font-size: 0.84rem;
          font-weight: 600;
          padding: 9px 20px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
        }

        .post-btn-submit:hover {
          background: #162c48;
        }

        .post-card-item {
          background: #ffffff;
          border: 1px solid #e2ded5;
          border-radius: 6px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .post-card-item.approved {
          border-left: 4px solid #16a34a;
        }

        .post-card-item.pending {
          border-left: 4px solid #d97706;
          background: #fffdfa;
        }

        .post-card-item.draft {
          border-left: 4px solid #64748b;
          background: #f8fafc;
        }

        .post-card-item.rejected {
          border-left: 4px solid #dc2626;
          background: #fffafa;
        }

        .post-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .post-status-badge.approved {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        }

        .post-status-badge.pending {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        }

        .post-status-badge.draft {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
        }

        .post-status-badge.rejected {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .post-rejection-alert {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 0.82rem;
          color: #991b1b;
        }

        .post-footer {
          padding: 14px 24px;
          background: #f8f6f0;
          border-top: 1px solid #e2ded5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Attachment Preview Modal Styling */
        .post-preview-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(10, 20, 30, 0.75);
          backdrop-filter: blur(3px);
          z-index: 1350;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
          animation: postFadeIn 0.16s ease-out;
        }

        .post-preview-modal-card {
          width: 100%;
          max-width: 860px;
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #ded9cc;
          box-shadow: 0 24px 50px rgba(10, 20, 30, 0.35);
          display: flex;
          flex-direction: column;
          max-height: 88vh;
          overflow: hidden;
          box-sizing: border-box;
          animation: postSlideUp 0.18s ease-out;
        }

        .post-preview-modal-header {
          padding: 14px 20px;
          background: #112233;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #b38e44;
        }

        .post-preview-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
        }

        .post-preview-header-icon {
          width: 34px;
          height: 34px;
          border-radius: 6px;
          background: rgba(179, 142, 68, 0.2);
          border: 1px solid rgba(179, 142, 68, 0.4);
          color: #f5d78e;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .post-preview-file-title {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 500px;
        }

        .post-preview-file-sub {
          font-size: 0.74rem;
          color: #cbd5e1;
        }

        .post-preview-close-btn {
          background: transparent;
          border: none;
          color: #cbd5e1;
          cursor: pointer;
          padding: 6px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .post-preview-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.15);
        }

        .post-preview-modal-body {
          flex: 1;
          padding: 16px;
          background: #f8fafc;
          overflow-y: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          min-height: 320px;
        }

        .post-preview-img-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          box-sizing: border-box;
        }

        .post-preview-display-img {
          max-width: 100%;
          max-height: 60vh;
          object-fit: contain;
          border-radius: 6px;
          box-shadow: 0 4px 16px rgba(15, 29, 47, 0.15);
          background: #ffffff;
        }

        .post-preview-pdf-container {
          width: 100%;
          height: 64vh;
          background: #ffffff;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #cbd5e1;
        }

        .post-preview-pdf-object, 
        .post-preview-pdf-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        .post-preview-pdf-fallback {
          padding: 40px 20px;
          text-align: center;
          color: #475569;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .post-preview-modal-footer {
          padding: 12px 20px;
          background: #f1eeea;
          border-top: 1px solid #ded9cc;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .post-preview-download-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #0369a1;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .post-preview-download-link:hover {
          color: #075985;
          text-decoration: underline;
        }

        @keyframes postFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes postSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="post-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="post-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <div>
              <h3 id="post-modal-title" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                Public Posts & Community Showcase
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                Institutional Broadcast Hub • Admin Moderation Enforced
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 6 }}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="post-tabs">
          <button
            className={`post-tab-btn ${activeView === 'create' ? 'active' : ''}`}
            onClick={() => setActiveView('create')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create New Post
          </button>
          <button
            className={`post-tab-btn ${activeView === 'history' ? 'active' : ''}`}
            onClick={() => setActiveView('history')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            My Submitted Posts ({posts.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="post-body">
          {activeView === 'create' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="post-policy-box">
                <strong>Institutional Publishing Rule:</strong> Students cannot directly publish unverified posts to the public platform. Every submission must undergo compliance verification by the <strong>Portal Admin</strong>. Posts remain in <em>Pending Verification</em> until formally approved.
              </div>

              <div className="post-form-field">
                <label>Post Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Winner of National Smart India Hackathon 2025"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="post-form-field">
                <label>Post Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Technical Achievement">Technical Achievement & Hackathons</option>
                  <option value="Academic Research">Academic Research & Papers</option>
                  <option value="Open Source Project">Open Source & Software Release</option>
                  <option value="Internship Experience">Internship & Industry Experience</option>
                  <option value="Campus Initiative">Campus Initiative & Leadership</option>
                </select>
              </div>

              <div className="post-form-field">
                <label>Post Content & Description *</label>
                <textarea
                  rows="5"
                  placeholder="Describe your achievement, methodology, tools used, and institutional affiliations..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* Supporting Attachment Field with File Preview Action */}
              <div className="post-form-field">
                <label>Supporting Attachment / Certificate Proof (PDF / JPG / PNG)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="post-file-input-native"
                  onChange={handleFileChange}
                />

                {/* Validation Error Banner */}
                {fileError && (
                  <div className="post-file-error" role="alert">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{fileError}</span>
                  </div>
                )}

                {/* Selected File Card with "Preview File" Action */}
                {attachmentName && previewUrl && !fileError && (
                  <div className="post-file-selected-box">
                    <div className="post-file-meta-left">
                      <span className="post-file-badge-icon">
                        {attachmentType === 'pdf' ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        )}
                      </span>
                      <div className="post-file-details">
                        <span className="post-file-name" title={attachmentName}>
                          {attachmentName}
                        </span>
                        <span className="post-file-size">
                          {attachmentSize} • {attachmentType === 'pdf' ? 'PDF Document' : 'Image File'}
                        </span>
                      </div>
                    </div>

                    <div className="post-file-actions-group">
                      {/* Secondary Preview File Action */}
                      <button
                        type="button"
                        className="post-btn-preview-action"
                        onClick={handleOpenCurrentPreview}
                        title="Open file preview modal"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Preview File</span>
                      </button>

                      <button
                        type="button"
                        className="post-btn-remove-action"
                        onClick={handleRemoveAttachment}
                        title="Remove attached file"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="post-actions-bar">
                <button
                  type="button"
                  className="post-btn-draft"
                  onClick={() => handleSave(true)}
                  disabled={!title.trim() || !content.trim()}
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  className="post-btn-submit"
                  onClick={() => handleSave(false)}
                  disabled={!title.trim() || !content.trim()}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Submit for Portal Admin Verification
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No posts submitted yet. Click &quot;Create New Post&quot; to draft or submit.
                </div>
              ) : (
                posts.map((post) => {
                  const status = post.status || 'draft'
                  return (
                    <div key={post.id} className={`post-card-item ${status}`}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div>
                          <h4 style={{ margin: '0 0 6px', fontSize: '1rem', color: '#112233' }}>
                            {post.title}
                          </h4>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                            <span><strong>Category:</strong> {post.category}</span>
                            <span>•</span>
                            <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}</span>
                            {post.attachment && (
                              <>
                                <span>•</span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenSubmittedPreview(post)}
                                  style={{
                                    background: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: 4,
                                    padding: '2px 8px',
                                    fontSize: '0.75rem',
                                    color: '#0369a1',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                  }}
                                  title="Click to preview attachment"
                                >
                                  📎 {post.attachment}
                                  <span style={{ fontSize: '0.68rem', textDecoration: 'underline' }}>(Preview)</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          {status === 'approved' && (
                            <span className="post-status-badge approved">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                              </svg>
                              Approved & Public
                            </span>
                          )}
                          {status === 'pending' && (
                            <span className="post-status-badge pending">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              Pending Verification
                            </span>
                          )}
                          {status === 'draft' && (
                            <span className="post-status-badge draft">
                              Draft (Private)
                            </span>
                          )}
                          {status === 'rejected' && (
                            <span className="post-status-badge rejected">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                              </svg>
                              Rejected by Admin
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {post.content}
                      </div>

                      {/* Exact Rejection Reason Box */}
                      {status === 'rejected' && post.rejectionReason && (
                        <div className="post-rejection-alert">
                          <div style={{ fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                            Official Portal Admin Rejection Reason:
                          </div>
                          <div>&quot;{post.rejectionReason}&quot;</div>
                        </div>
                      )}

                      {/* Controls */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e2ded5', paddingTop: 8, marginTop: 4, flexWrap: 'wrap', gap: 8 }}>
                        {status === 'draft' ? (
                          <button
                            type="button"
                            className="post-btn-submit"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                            onClick={() => onSubmitDraft?.(post.id)}
                          >
                            Submit Draft for Admin Verification
                          </button>
                        ) : (
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            {status === 'approved' ? 'Live on Udaan Public Network' : status === 'pending' ? 'Review queued with Central Portal Admin' : 'Review completed with remarks'}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="post-footer">
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Moderation authority: <strong>Udaan Portal Central Editorial Board</strong>
          </div>
          <button className="post-btn-draft" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {/* DEDICATED FILE PREVIEW MODAL */}
      {isPreviewModalOpen && activePreviewDoc && (
        <div className="post-preview-modal-overlay" onClick={() => setIsPreviewModalOpen(false)}>
          <div className="post-preview-modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Attachment Preview">
            <div className="post-preview-modal-header">
              <div className="post-preview-header-left">
                <div className="post-preview-header-icon">
                  {activePreviewDoc.type === 'pdf' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="post-preview-file-title" title={activePreviewDoc.name}>
                    {activePreviewDoc.name}
                  </h4>
                  <span className="post-preview-file-sub">
                    {activePreviewDoc.size} • {activePreviewDoc.type === 'pdf' ? 'PDF Document' : 'Image Preview'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="post-preview-close-btn"
                onClick={() => setIsPreviewModalOpen(false)}
                aria-label="Close preview"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="post-preview-modal-body">
              {activePreviewDoc.type === 'image' ? (
                <div className="post-preview-img-container">
                  <img
                    src={activePreviewDoc.url}
                    alt={activePreviewDoc.name}
                    className="post-preview-display-img"
                  />
                </div>
              ) : (
                <div className="post-preview-pdf-container">
                  <object
                    data={activePreviewDoc.url}
                    type="application/pdf"
                    className="post-preview-pdf-object"
                  >
                    <iframe
                      src={activePreviewDoc.url}
                      title={activePreviewDoc.name}
                      className="post-preview-pdf-iframe"
                    >
                      <div className="post-preview-pdf-fallback">
                        <p>Your browser could not render the PDF directly inside this frame.</p>
                        <a
                          href={activePreviewDoc.url}
                          target="_blank"
                          rel="noreferrer"
                          download={activePreviewDoc.name}
                          className="post-btn-preview-action"
                        >
                          Open PDF in New Tab / Download
                        </a>
                      </div>
                    </iframe>
                  </object>
                </div>
              )}
            </div>

            <div className="post-preview-modal-footer">
              <a
                href={activePreviewDoc.url}
                target="_blank"
                rel="noreferrer"
                download={activePreviewDoc.name}
                className="post-preview-download-link"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Open Full Screen / Download
              </a>

              <button
                type="button"
                className="post-btn-draft"
                style={{ padding: '6px 16px', fontSize: '0.8rem' }}
                onClick={() => setIsPreviewModalOpen(false)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
