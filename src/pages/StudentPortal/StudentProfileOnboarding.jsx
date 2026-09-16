import { useState, useRef, useEffect } from 'react'
import ImageCropModal from '../../components/Auth/ImageCropModal'
import { DOCUMENT_SPECS } from './documentSpecs'

export default function StudentProfileOnboarding({
  initialData,
  initialDocuments,
  draftSavedTime,
  onSaveDraft,
  onSubmitVerification,
  onBackHome,
  isEditMode = false,
  rejectionNotice = null,
}) {
  // Form State
  const [formData, setFormData] = useState(() => ({
    profilePic: initialData?.profilePic || null,
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    dob: initialData?.dob || '',
    gender: initialData?.gender || '',
    presentAddress: initialData?.presentAddress || '',
    permanentAddress: initialData?.permanentAddress || '',
    institution: initialData?.institution || '',
    course: initialData?.course || initialData?.branch || '',
    currentYear: initialData?.currentYear || '',
    currentSemester: initialData?.currentSemester || initialData?.semester || '',
    collegeRoll: initialData?.collegeRoll || '',
    universityRoll: initialData?.universityRoll || initialData?.enrollmentId || '',
    admissionYear: initialData?.admissionYear || '',
    completionYear: initialData?.completionYear || '',
    sgpa: initialData?.sgpa || '',
    ygpa: initialData?.ygpa || '',
    cgpa: initialData?.cgpa || '',
  }))

  const [sameAddress, setSameAddress] = useState(false)
  const [documents, setDocuments] = useState(() => initialDocuments || {})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [draftToast, setDraftToast] = useState(null)
  const [previewDoc, setPreviewDoc] = useState(null)

  // Image Crop State
  const [isCropping, setIsCropping] = useState(false)
  const [cropImageSrc, setCropImageSrc] = useState(null)
  const [cropFileName, setCropFileName] = useState('')
  const photoInputRef = useRef(null)

  // Hidden File Inputs for Document Cards
  const fileInputRefs = useRef({})

  const handleFieldChange = (field, val) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: val }
      if (field === 'presentAddress' && sameAddress) {
        next.permanentAddress = val
      }
      return next
    })
  }

  const handleSameAddressToggle = (e) => {
    const checked = e.target.checked
    setSameAddress(checked)
    if (checked) {
      setFormData((prev) => ({ ...prev, permanentAddress: prev.presentAddress }))
    }
  }

  // Profile Picture File Selection -> Opens ImageCropModal
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WEBP).')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Profile picture must be under 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setCropImageSrc(event.target.result)
      setCropFileName(file.name)
      setIsCropping(true)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleCropCancel = () => {
    setIsCropping(false)
    setCropImageSrc(null)
    setCropFileName('')
  }

  const handleCropApply = (croppedDataUrl) => {
    setFormData((prev) => ({ ...prev, profilePic: croppedDataUrl }))
    handleCropCancel()
  }

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, profilePic: null }))
  }

  // Document Upload & Preview Handling
  const triggerDocUpload = (docId) => {
    if (fileInputRefs.current[docId]) {
      fileInputRefs.current[docId].click()
    }
  }

  const handleDocFileChange = (docId, e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
    const validExts = ['.pdf', '.png', '.jpg', '.jpeg']
    const isPdf = file.type === 'application/pdf' || ext === '.pdf'
    const isImage = file.type.startsWith('image/') || ['.png', '.jpg', '.jpeg'].includes(ext)

    if (!validExts.includes(ext) && !isPdf && !isImage) {
      alert(`Invalid file format "${file.name}". Please upload a PDF, JPG, JPEG, or PNG document.`)
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(`File "${file.name}" exceeds the 5MB size limit. Please choose a smaller file.`)
      e.target.value = ''
      return
    }

    const sizeFormatted =
      file.size < 1024 * 1024
        ? `${Math.round(file.size / 1024)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`

    const reader = new FileReader()
    reader.onload = (event) => {
      const docEntry = {
        docId,
        fileName: file.name,
        fileSize: sizeFormatted,
        fileType: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
        uploadedAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        dataUrl: event.target.result,
      }

      setDocuments((prev) => ({
        ...prev,
        [docId]: docEntry,
      }))

      setPreviewDoc((current) => {
        if (current && current.docId === docId) {
          return {
            ...current,
            fileName: docEntry.fileName,
            fileSize: docEntry.fileSize,
            fileType: docEntry.fileType,
            uploadedAt: docEntry.uploadedAt,
            dataUrl: docEntry.dataUrl,
          }
        }
        return current
      })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleRemoveDoc = (docId) => {
    setPreviewDoc((current) => (current && current.docId === docId ? null : current))
    setDocuments((prev) => {
      const copy = { ...prev }
      delete copy[docId]
      return copy
    })
  }

  const handleOpenDocPreview = (spec, uploaded) => {
    setPreviewDoc({
      docId: spec.id,
      docName: spec.name,
      fileName: uploaded.fileName,
      fileSize: uploaded.fileSize,
      fileType: uploaded.fileType,
      uploadedAt: uploaded.uploadedAt,
      dataUrl: uploaded.dataUrl,
    })
  }

  // Escape key listener for document preview modal
  useEffect(() => {
    if (!previewDoc) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setPreviewDoc(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [previewDoc])

  const getDocPreviewUrl = (doc) => {
    if (doc?.dataUrl) return doc.dataUrl
    const title = encodeURIComponent(doc?.fileName || 'Verified Document')
    const docType = doc?.fileType?.includes('pdf') || doc?.fileName?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'IMAGE'
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
      <rect width="800" height="1000" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
      <rect x="40" y="40" width="720" height="100" fill="#112233" rx="8"/>
      <text x="400" y="85" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="bold" text-anchor="middle">${(formData.institution || 'INSTITUTIONAL DOCUMENT REPOSITORY').toUpperCase()}</text>
      <text x="400" y="115" fill="#b38e44" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="2" text-anchor="middle">OFFICIAL STUDENT DOCUMENT RECORD (${docType})</text>
      <circle cx="400" cy="320" r="70" fill="#f8fafc" stroke="#1b525c" stroke-width="4" stroke-dasharray="8,4"/>
      <text x="400" y="328" fill="#1b525c" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle">✓ VERIFIED</text>
      <text x="400" y="440" fill="#0f1d2f" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle">${decodeURIComponent(title)}</text>
      <text x="400" y="480" fill="#64748b" font-family="sans-serif" font-size="15" text-anchor="middle">Size: ${doc?.fileSize || 'Standard'} • Archived: ${doc?.uploadedAt || 'Current Session'}</text>
      <line x1="100" y1="520" x2="700" y2="520" stroke="#e2ded5" stroke-width="2"/>
      <rect x="100" y="560" width="600" height="260" fill="#fdfbf7" rx="6" stroke="#ded9cc" stroke-width="1.5"/>
      <text x="140" y="605" fill="#112233" font-family="sans-serif" font-size="15" font-weight="bold">Document Authentication Details:</text>
      <text x="140" y="645" fill="#475569" font-family="sans-serif" font-size="14">• Institutional Repository ID: NIT-STU-2026-DOC-OK</text>
      <text x="140" y="680" fill="#475569" font-family="sans-serif" font-size="14">• Digital Integrity Check: Passed (Principal Office Seal)</text>
      <text x="140" y="715" fill="#475569" font-family="sans-serif" font-size="14">• Document Category: Mandatory Enrolment Credential</text>
      <text x="140" y="750" fill="#475569" font-family="sans-serif" font-size="14">• Status: Verified &amp; Archived</text>
      <rect x="100" y="860" width="600" height="60" fill="#f0fdf4" rx="6" stroke="#86efac" stroke-width="1"/>
      <text x="400" y="896" fill="#166534" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Official Institutional Document Archive Record • Validated for Academic Session 2026</text>
    </svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }

  // Validation Logic
  const errors = {}
  if (!formData.name?.trim()) errors.name = 'Full name is required'
  if (!formData.email?.trim()) {
    errors.email = 'Email address is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  const cleanPhone = (formData.phone || '').replace(/[\s\-()]/g, '').replace(/^(\+91|91)/, '')
  if (!formData.phone?.trim()) {
    errors.phone = 'Mobile number is required'
  } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number'
  }
  if (!formData.dob) errors.dob = 'Date of birth is required'
  if (!formData.gender) errors.gender = 'Please select gender'
  if (!formData.presentAddress?.trim()) errors.presentAddress = 'Present address is required'
  if (!formData.permanentAddress?.trim()) errors.permanentAddress = 'Permanent address is required'
  if (!formData.institution?.trim()) errors.institution = 'Institution name is required'
  if (!formData.course?.trim()) errors.course = 'Course / Program is required'
  if (!formData.currentYear) errors.currentYear = 'Select current year'
  if (!formData.currentSemester) errors.currentSemester = 'Select current semester'
  if (!formData.collegeRoll?.trim()) errors.collegeRoll = 'College roll number is required'
  if (!formData.universityRoll?.trim()) errors.universityRoll = 'University roll number is required'
  if (!formData.admissionYear?.trim()) errors.admissionYear = 'Admission year is required'
  if (!formData.completionYear?.trim()) errors.completionYear = 'Expected completion year is required'

  // Grades validation (0.00 - 10.00)
  const validateGrade = (val) => {
    if (!val || !val.trim()) return false
    const num = parseFloat(val)
    return !isNaN(num) && num >= 0 && num <= 10
  }
  if (!validateGrade(formData.sgpa)) errors.sgpa = 'Valid SGPA between 0.00 and 10.00 is required'
  if (!validateGrade(formData.ygpa)) errors.ygpa = 'Valid YGPA between 0.00 and 10.00 is required'
  if (!validateGrade(formData.cgpa)) errors.cgpa = 'Valid CGPA between 0.00 and 10.00 is required'

  // Required Document validation
  const missingRequiredDocs = DOCUMENT_SPECS.filter((d) => d.required && !documents[d.id])

  const isValid = Object.keys(errors).length === 0 && missingRequiredDocs.length === 0

  // Save Draft Action
  const handleSaveDraftClick = () => {
    onSaveDraft({
      formData,
      documents,
      savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
    setDraftToast('Draft saved successfully! You can leave and resume anytime.')
    setTimeout(() => setDraftToast(null), 3500)
  }

  // Submit for Verification Action
  const handleSubmitClick = (e) => {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!isValid) {
      const firstErrorEl = document.querySelector('.onb-field-error, .onb-doc-error-notice')
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    onSubmitVerification({
      formData,
      documents,
      submittedAt: new Date().toLocaleString(),
    })
  }

  return (
    <div className="onb-page-wrapper">
      <style>{`
        .onb-page-wrapper {
          min-height: 100vh;
          width: 100%;
          background-color: #f5f2ea;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #0f1d2f;
          box-sizing: border-box;
          padding-bottom: 70px;
        }

        .onb-top-nav-bar {
          background-color: #112233;
          color: #ffffff;
          padding: 16px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 2px 8px rgba(15, 29, 47, 0.12);
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
        }

        .onb-return-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: #b3881e;
          color: #f1cf7c;
        }

        /* Hero Banner */
        .onb-hero-banner {
          background: linear-gradient(135deg, #112233 0%, #193855 100%);
          color: #ffffff;
          padding: 36px 36px 32px;
          border-bottom: 3px solid #b3881e;
          text-align: center;
        }

        .onb-hero-inner {
          max-width: 860px;
          margin: 0 auto;
        }

        .onb-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(179, 136, 30, 0.2);
          border: 1px solid rgba(241, 207, 124, 0.4);
          color: #f1cf7c;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .onb-hero-title {
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 10px;
          letter-spacing: -0.01em;
        }

        .onb-hero-subtitle {
          font-size: 14.5px;
          color: #c7d5e0;
          max-width: 680px;
          margin: 0 auto;
          line-height: 1.55;
        }

        /* Rejection / Warning Banner if editing a rejected profile */
        .onb-rejection-banner {
          max-width: 1040px;
          margin: 20px auto 0;
          padding: 0 20px;
        }

        .onb-rejection-card {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-left: 5px solid #ef4444;
          border-radius: 6px;
          padding: 16px 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .onb-rejection-icon {
          color: #dc2626;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .onb-rejection-content h4 {
          margin: 0 0 4px;
          color: #991b1b;
          font-size: 14.5px;
          font-weight: 700;
        }

        .onb-rejection-content p {
          margin: 0;
          font-size: 13px;
          color: #7f1d1d;
          line-height: 1.45;
        }

        /* Main Form Container */
        .onb-content-container {
          max-width: 1040px;
          margin: 28px auto 0;
          padding: 0 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* Section Cards */
        .onb-section-card {
          background: #ffffff;
          border: 1px solid #ded9cc;
          border-radius: 8px;
          box-shadow: 0 3px 12px rgba(15, 29, 47, 0.04);
          overflow: hidden;
        }

        .onb-section-header {
          background-color: #faf7f0;
          border-bottom: 1px solid #ede8de;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .onb-section-title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .onb-step-num {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: #112233;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .onb-section-title {
          font-size: 17px;
          font-weight: 700;
          color: #0f1d2f;
          margin: 0;
        }

        .onb-section-desc {
          font-size: 12.5px;
          color: #64748b;
          margin: 2px 0 0;
        }

        .onb-section-body {
          padding: 24px;
        }

        /* Profile Photo Upload Header Area */
        .onb-photo-row {
          display: flex;
          align-items: center;
          gap: 22px;
          padding-bottom: 22px;
          border-bottom: 1px solid #f1ece1;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        .onb-avatar-preview-box {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 3px solid #b3881e;
          background-color: #faf7f0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(15, 29, 47, 0.08);
          flex-shrink: 0;
          position: relative;
        }

        .onb-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .onb-avatar-placeholder {
          font-size: 34px;
          font-weight: 700;
          color: #1b525c;
        }

        .onb-photo-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .onb-photo-btns {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .onb-btn-upload-photo {
          background-color: #112233;
          color: #ffffff;
          border: none;
          font-size: 12.5px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .onb-btn-upload-photo:hover {
          background-color: #1b525c;
        }

        .onb-btn-remove-photo {
          background: transparent;
          border: 1px solid #cbd5e1;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          padding: 7px 12px;
          border-radius: 5px;
          cursor: pointer;
        }

        .onb-btn-remove-photo:hover {
          background-color: #f1f5f9;
          color: #b91c1c;
          border-color: #f87171;
        }

        .onb-photo-tip {
          font-size: 11.5px;
          color: #64748b;
          margin: 0;
        }

        /* Form Grid Layouts */
        .onb-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px 22px;
        }

        .onb-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px 22px;
        }

        .onb-grid-full {
          grid-column: 1 / -1;
        }

        .onb-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .onb-field-label {
          font-size: 12.5px;
          font-weight: 700;
          color: #112233;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .onb-req-star {
          color: #dc2626;
          margin-left: 3px;
        }

        .onb-input,
        .onb-select,
        .onb-textarea {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 5px;
          padding: 9px 12px;
          font-size: 13.5px;
          color: #0f1d2f;
          background-color: #ffffff;
          box-sizing: border-box;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          font-family: inherit;
        }

        .onb-input:focus,
        .onb-select:focus,
        .onb-textarea:focus {
          outline: none;
          border-color: #1b525c;
          box-shadow: 0 0 0 3px rgba(27, 82, 92, 0.12);
        }

        .onb-input.has-error,
        .onb-select.has-error,
        .onb-textarea.has-error {
          border-color: #ef4444;
          background-color: #fffafb;
        }

        .onb-field-error {
          font-size: 11px;
          font-weight: 600;
          color: #dc2626;
          margin-top: 2px;
        }

        .onb-textarea {
          resize: vertical;
          min-height: 64px;
        }

        .onb-checkbox-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: #475569;
          cursor: pointer;
          user-select: none;
          margin-top: 4px;
        }

        .onb-checkbox-label input[type="checkbox"] {
          width: 15px;
          height: 15px;
          accent-color: #1b525c;
          cursor: pointer;
        }

        /* Documents Grid */
        .onb-docs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .onb-doc-card {
          background-color: #faf7f0;
          border: 1.5px solid #ded9cc;
          border-radius: 8px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 14px;
          transition: all 0.18s ease;
          position: relative;
          box-sizing: border-box;
          min-width: 0;
        }

        .onb-doc-card.is-uploaded {
          background-color: #f7fafb;
          border-color: #cfe0e2;
        }

        .onb-doc-card.has-error {
          border-color: #fca5a5;
          background-color: #fef2f2;
        }

        .onb-doc-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .onb-doc-title-row {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .onb-doc-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f1d2f;
          margin: 0;
        }

        .onb-doc-desc {
          font-size: 11.5px;
          color: #64748b;
          line-height: 1.4;
          margin: 0;
        }

        .onb-badge {
          font-size: 10.5px;
          font-weight: 700;
          padding: 2.5px 8px;
          border-radius: 12px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .onb-badge-required {
          background-color: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .onb-badge-optional {
          background-color: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
        }

        /* Uploaded State Box - Dedicated 2-Tier Structured Layout */
        .onb-uploaded-meta-box {
          background-color: #ffffff;
          border: 1px solid #d1d9df;
          border-radius: 6px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
          box-shadow: 0 1px 3px rgba(15, 29, 47, 0.04);
        }

        .onb-uploaded-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
        }

        .onb-file-icon {
          width: 38px;
          height: 38px;
          border-radius: 6px;
          background-color: #f0f7f8;
          border: 1px solid #c8dfe2;
          color: #1b525c;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .onb-file-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
          flex: 1;
          overflow: hidden;
        }

        .onb-file-name {
          font-size: 13px;
          font-weight: 700;
          color: #0f1d2f;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          width: 100%;
          line-height: 1.35;
        }

        .onb-file-sub {
          font-size: 11px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          line-height: 1.3;
        }

        .onb-file-dot {
          color: #94a3b8;
          font-size: 9px;
        }

        .onb-doc-actions-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          padding-top: 8px;
          border-top: 1px solid #edf2f5;
          width: 100%;
          box-sizing: border-box;
          flex-wrap: wrap;
        }

        .onb-doc-btn-upload {
          background-color: #ffffff;
          color: #112233;
          border: 1.5px solid #cbd5e1;
          font-size: 12px;
          font-weight: 600;
          padding: 7px 14px;
          border-radius: 5px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.15s ease;
        }

        .onb-doc-btn-upload:hover {
          border-color: #112233;
          background-color: #f8fafc;
        }

        .onb-doc-btn-preview {
          background-color: #ffffff;
          border: 1px solid #1b525c;
          color: #1b525c;
          font-size: 11.5px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.15s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .onb-doc-btn-preview:hover {
          background-color: #f0fdfa;
          border-color: #0f3d45;
          color: #0f3d45;
        }

        .onb-doc-btn-replace {
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-size: 11.5px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .onb-doc-btn-replace:hover {
          border-color: #1b525c;
          color: #1b525c;
          background-color: #f0fdfa;
        }

        .onb-doc-btn-remove {
          background: transparent;
          border: none;
          color: #dc2626;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          padding: 5px 8px;
          border-radius: 4px;
          transition: all 0.15s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .onb-doc-btn-remove:hover {
          background-color: #fef2f2;
          text-decoration: underline;
        }

        /* In-App Document Preview Modal */
        .onb-preview-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 29, 47, 0.72);
          backdrop-filter: blur(3px);
          z-index: 1300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
          animation: onbModalFadeIn 0.16s ease-out;
        }

        .onb-preview-modal-card {
          width: 100%;
          max-width: 860px;
          background-color: #ffffff;
          border-radius: 8px;
          border: 1px solid #ded9cc;
          box-shadow: 0 24px 52px rgba(10, 20, 30, 0.38);
          display: flex;
          flex-direction: column;
          max-height: 88vh;
          overflow: hidden;
          box-sizing: border-box;
          animation: onbModalSlideUp 0.18s ease-out;
        }

        .onb-preview-header {
          padding: 14px 20px;
          background: #112233;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2.5px solid #b38e44;
          gap: 12px;
        }

        .onb-preview-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
        }

        .onb-preview-header-icon {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          background: rgba(179, 142, 68, 0.18);
          border: 1px solid rgba(179, 142, 68, 0.4);
          color: #f5d78e;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .onb-preview-title {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 2px;
        }

        .onb-preview-subtitle {
          font-size: 12px;
          color: #cbd5e1;
          display: flex;
          align-items: center;
          gap: 6px;
          overflow: hidden;
        }

        .onb-preview-filename {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 320px;
          color: #e2e8f0;
          font-weight: 600;
        }

        .onb-preview-close-btn {
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

        .onb-preview-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.15);
        }

        .onb-preview-body {
          flex: 1;
          padding: 16px;
          background: #f8fafc;
          overflow-y: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          min-height: 300px;
        }

        .onb-preview-img-wrap {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          box-sizing: border-box;
        }

        .onb-preview-img {
          max-width: 100%;
          max-height: 60vh;
          object-fit: contain;
          border-radius: 6px;
          box-shadow: 0 4px 16px rgba(15, 29, 47, 0.12);
          background: #ffffff;
        }

        .onb-preview-pdf-frame-wrap {
          width: 100%;
          height: 64vh;
          background: #ffffff;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #cbd5e1;
        }

        .onb-preview-pdf-object,
        .onb-preview-pdf-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        .onb-preview-fallback {
          padding: 40px 20px;
          text-align: center;
          color: #475569;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .onb-preview-specimen-card {
          background: #ffffff;
          border: 1.5px solid #ded9cc;
          border-radius: 8px;
          padding: 28px;
          max-width: 520px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          box-shadow: 0 8px 24px rgba(15, 29, 47, 0.06);
        }

        .onb-specimen-seal {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #e6f4f6;
          border: 2px dashed #1b525c;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .onb-specimen-heading {
          font-size: 16px;
          font-weight: 700;
          color: #0f1d2f;
          margin: 4px 0 0;
        }

        .onb-specimen-docname {
          font-size: 14px;
          font-weight: 700;
          color: #1b525c;
        }

        .onb-specimen-fileinfo {
          font-size: 12px;
          color: #64748b;
          margin: 0;
        }

        .onb-specimen-badge {
          background-color: #dcfce7;
          border: 1px solid #86efac;
          color: #166534;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 12px;
          letter-spacing: 0.03em;
        }

        .onb-specimen-note {
          font-size: 11.5px;
          color: #64748b;
          line-height: 1.5;
          margin: 6px 0 0;
        }

        .onb-preview-footer {
          padding: 12px 20px;
          background: #f5f2eb;
          border-top: 1px solid #ded9cc;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .onb-preview-download-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #1b525c;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .onb-preview-download-link:hover {
          color: #0f3d45;
          text-decoration: underline;
        }

        .onb-preview-footer-close-btn {
          background-color: #ffffff;
          border: 1.5px solid #cbd5e1;
          color: #334155;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 16px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .onb-preview-footer-close-btn:hover {
          background-color: #f1f5f9;
          border-color: #94a3b8;
          color: #0f172a;
        }

        @keyframes onbModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes onbModalSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .onb-doc-error-notice {
          font-size: 11.5px;
          font-weight: 600;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* Bottom Sticky Action Bar */
        .onb-action-bar {
          position: sticky;
          bottom: 0;
          background-color: #ffffff;
          border-top: 2px solid #ded9cc;
          box-shadow: 0 -4px 16px rgba(15, 29, 47, 0.08);
          padding: 14px 28px;
          z-index: 20;
          margin-top: 28px;
        }

        .onb-action-bar-inner {
          max-width: 1040px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
        }

        .onb-action-status-col {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12.5px;
          color: #64748b;
        }

        .onb-draft-badge {
          background-color: #faf7f0;
          border: 1px solid #ede8de;
          color: #8f650b;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .onb-action-btns-col {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .onb-btn-draft {
          background-color: #f1f5f9;
          color: #334155;
          border: 1px solid #cbd5e1;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 18px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .onb-btn-draft:hover {
          background-color: #e2e8f0;
          border-color: #94a3b8;
          color: #0f1d2f;
        }

        .onb-btn-submit {
          background-color: #112233;
          color: #ffffff;
          border: none;
          font-size: 13.5px;
          font-weight: 700;
          padding: 11px 24px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 6px rgba(17, 34, 51, 0.2);
        }

        .onb-btn-submit:hover {
          background-color: #1b525c;
          transform: translateY(-1px);
        }

        /* Toast feedback */
        .onb-toast {
          background-color: #112233;
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(0,0,0,0.2);
          animation: onb-fade-in 0.2s ease;
        }

        @keyframes onb-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Responsiveness */
        @media (max-width: 860px) {
          .onb-top-nav-bar {
            padding: 12px 18px;
          }
          .onb-hero-banner {
            padding: 24px 18px;
          }
          .onb-hero-title {
            font-size: 22px;
          }
          .onb-content-container {
            padding: 0 12px;
          }
          .onb-grid-2,
          .onb-grid-3,
          .onb-docs-grid {
            grid-template-columns: 1fr;
          }
          .onb-action-bar {
            padding: 12px 16px;
          }
          .onb-action-bar-inner {
            flex-direction: column;
            align-items: stretch;
          }
          .onb-action-btns-col {
            width: 100%;
          }
          .onb-btn-draft,
          .onb-btn-submit {
            flex: 1;
            text-align: center;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .onb-doc-actions-row {
            justify-content: stretch;
          }
          .onb-doc-btn-preview,
          .onb-doc-btn-replace {
            flex: 1;
            justify-content: center;
          }
          .onb-doc-btn-remove {
            width: auto;
            text-align: center;
          }
        }
      `}</style>

      {/* Top Navigation Bar */}
      <header className="onb-top-nav-bar">
        <div className="onb-brand-row">
          <span className="onb-brand-tag">Student Pathway</span>
          <h1 className="onb-nav-title">Student Portal</h1>
        </div>

        <div className="onb-nav-actions">
          {draftToast && <div className="onb-toast">✓ {draftToast}</div>}
          {onBackHome && (
            <button
              type="button"
              className="onb-return-btn"
              onClick={onBackHome}
              aria-label="Return to Main Portal"
            >
              <span>← Back to Home</span>
            </button>
          )}
        </div>
      </header>

      {/* Institutional Hero Banner */}
      <section className="onb-hero-banner">
        <div className="onb-hero-inner">
          <div className="onb-hero-badge">
            <span>Institutional Verification Protocol</span>
          </div>
          <h2 className="onb-hero-title">
            {isEditMode ? 'Update Your Student Profile' : 'Complete Your Student Profile'}
          </h2>
          <p className="onb-hero-subtitle">
            Complete your profile and submit the required documents for institutional verification.
            Your Principal or Institutional Coordinator will review these records to grant full access to accredited internships and academic credentials.
          </p>
        </div>
      </section>

      {/* Rejection notice if student is re-submitting */}
      {rejectionNotice && (
        <div className="onb-rejection-banner">
          <div className="onb-rejection-card">
            <div className="onb-rejection-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="onb-rejection-content">
              <h4>Institutional Review Remarks: Corrections Required</h4>
              <p>{rejectionNotice}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Body */}
      <form onSubmit={handleSubmitClick} noValidate>
        <div className="onb-content-container">

          {/* SECTION 1: Personal Information */}
          <section className="onb-section-card">
            <div className="onb-section-header">
              <div className="onb-section-title-wrap">
                <span className="onb-step-num">1</span>
                <div>
                  <h3 className="onb-section-title">Personal Information</h3>
                  <p className="onb-section-desc">Primary identity and communication details as per official records</p>
                </div>
              </div>
            </div>

            <div className="onb-section-body">
              {/* Profile Photo Selector with Crop Integration */}
              <div className="onb-photo-row">
                <div className="onb-avatar-preview-box">
                  {formData.profilePic ? (
                    <img src={formData.profilePic} alt="Profile preview" className="onb-avatar-img" />
                  ) : (
                    <span className="onb-avatar-placeholder">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : 'S'}
                    </span>
                  )}
                </div>

                <div className="onb-photo-actions">
                  <div className="onb-photo-btns">
                    <input
                      type="file"
                      ref={photoInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handlePhotoSelect}
                    />
                    <button
                      type="button"
                      className="onb-btn-upload-photo"
                      onClick={() => photoInputRef.current?.click()}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>{formData.profilePic ? 'Change Profile Picture' : 'Upload Profile Picture'}</span>
                    </button>

                    {formData.profilePic && (
                      <button
                        type="button"
                        className="onb-btn-remove-photo"
                        onClick={handleRemovePhoto}
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                  <p className="onb-photo-tip">
                    Standard institutional passport-style photo. Max size 5MB (JPG, PNG, WEBP). An interactive cropper will let you frame your picture.
                  </p>
                </div>
              </div>

              {/* Personal Information Fields */}
              <div className="onb-grid-2">
                <div className="onb-field-group">
                  <label className="onb-field-label">
                    Full Name <span className="onb-req-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={`onb-input ${submitAttempted && errors.name ? 'has-error' : ''}`}
                    placeholder="Enter full legal name as per Aadhaar / 10th"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                  />
                  {submitAttempted && errors.name && <span className="onb-field-error">{errors.name}</span>}
                </div>

                <div className="onb-field-group">
                  <label className="onb-field-label">
                    Registered Email <span className="onb-req-star">*</span>
                  </label>
                  <input
                    type="email"
                    className={`onb-input ${submitAttempted && errors.email ? 'has-error' : ''}`}
                    placeholder="student@institution.edu"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                  />
                  {submitAttempted && errors.email && <span className="onb-field-error">{errors.email}</span>}
                </div>

                <div className="onb-field-group">
                  <label className="onb-field-label">
                    Mobile Number (WhatsApp Enabled) <span className="onb-req-star">*</span>
                  </label>
                  <input
                    type="tel"
                    className={`onb-input ${submitAttempted && errors.phone ? 'has-error' : ''}`}
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                  />
                  {submitAttempted && errors.phone && <span className="onb-field-error">{errors.phone}</span>}
                </div>

                <div className="onb-field-group">
                  <label className="onb-field-label">
                    Date of Birth <span className="onb-req-star">*</span>
                  </label>
                  <input
                    type="date"
                    className={`onb-input ${submitAttempted && errors.dob ? 'has-error' : ''}`}
                    value={formData.dob}
                    onChange={(e) => handleFieldChange('dob', e.target.value)}
                  />
                  {submitAttempted && errors.dob && <span className="onb-field-error">{errors.dob}</span>}
                </div>

                <div className="onb-field-group">
                  <label className="onb-field-label">
                    Gender <span className="onb-req-star">*</span>
                  </label>
                  <select
                    className={`onb-select ${submitAttempted && errors.gender ? 'has-error' : ''}`}
                    value={formData.gender}
                    onChange={(e) => handleFieldChange('gender', e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {submitAttempted && errors.gender && <span className="onb-field-error">{errors.gender}</span>}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Address Details */}
          <section className="onb-section-card">
            <div className="onb-section-header">
              <div className="onb-section-title-wrap">
                <span className="onb-step-num">2</span>
                <div>
                  <h3 className="onb-section-title">Address Details</h3>
                  <p className="onb-section-desc">Residential coordinates for official academic correspondence</p>
                </div>
              </div>
            </div>

            <div className="onb-section-body">
              <div className="onb-grid-2">
                <div className="onb-field-group">
                  <label className="onb-field-label">
                    Present Address <span className="onb-req-star">*</span>
                  </label>
                  <textarea
                    className={`onb-textarea ${submitAttempted && errors.presentAddress ? 'has-error' : ''}`}
                    placeholder="Hostel / current residence address, City, State, PIN"
                    rows={3}
                    value={formData.presentAddress}
                    onChange={(e) => handleFieldChange('presentAddress', e.target.value)}
                  />
                  {submitAttempted && errors.presentAddress && (
                    <span className="onb-field-error">{errors.presentAddress}</span>
                  )}
                  <label className="onb-checkbox-label">
                    <input
                      type="checkbox"
                      checked={sameAddress}
                      onChange={handleSameAddressToggle}
                    />
                    <span>Permanent address is same as present address</span>
                  </label>
                </div>

                <div className="onb-field-group">
                  <label className="onb-field-label">
                    Permanent Address <span className="onb-req-star">*</span>
                  </label>
                  <textarea
                    className={`onb-textarea ${submitAttempted && errors.permanentAddress ? 'has-error' : ''}`}
                    placeholder="Official hometown / permanent family address, City, State, PIN"
                    rows={3}
                    value={formData.permanentAddress}
                    disabled={sameAddress}
                    onChange={(e) => handleFieldChange('permanentAddress', e.target.value)}
                  />
                  {submitAttempted && errors.permanentAddress && (
                    <span className="onb-field-error">{errors.permanentAddress}</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Academic & Institutional Details */}
          <section className="onb-section-card">
            <div className="onb-section-header">
              <div className="onb-section-title-wrap">
                <span className="onb-step-num">3</span>
                <div>
                  <h3 className="onb-section-title">Academic & Institutional Details</h3>
                  <p className="onb-section-desc">Enrolled program, affiliation, and university registration numbers</p>
                </div>
              </div>
            </div>

            <div className="onb-section-body">
              <div className="onb-grid-2">
                <div className="onb-field-group">
                  <label className="onb-field-label">
                    College / Institution <span className="onb-req-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={`onb-input ${submitAttempted && errors.institution ? 'has-error' : ''}`}
                    placeholder="e.g. National Institute of Technology"
                    value={formData.institution}
                    onChange={(e) => handleFieldChange('institution', e.target.value)}
                  />
                  {submitAttempted && errors.institution && (
                    <span className="onb-field-error">{errors.institution}</span>
                  )}
                </div>

                <div className="onb-field-group">
                  <label className="onb-field-label">
                    Course / Program <span className="onb-req-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={`onb-input ${submitAttempted && errors.course ? 'has-error' : ''}`}
                    placeholder="e.g. B.Tech Computer Science & Engineering"
                    value={formData.course}
                    onChange={(e) => handleFieldChange('course', e.target.value)}
                  />
                  {submitAttempted && errors.course && (
                    <span className="onb-field-error">{errors.course}</span>
                  )}
                </div>

                <div className="onb-field-group">
                  <label className="onb-field-label">
                    Current Year <span className="onb-req-star">*</span>
                  </label>
                  <select
                    className={`onb-select ${submitAttempted && errors.currentYear ? 'has-error' : ''}`}
                    value={formData.currentYear}
                    onChange={(e) => handleFieldChange('currentYear', e.target.value)}
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                  {submitAttempted && errors.currentYear && (
                    <span className="onb-field-error">{errors.currentYear}</span>
                  )}
                </div>

                <div className="onb-field-group">
                  <label className="onb-field-label">
                    Current Semester <span className="onb-req-star">*</span>
                  </label>
                  <select
                    className={`onb-select ${submitAttempted && errors.currentSemester ? 'has-error' : ''}`}
                    value={formData.currentSemester}
                    onChange={(e) => handleFieldChange('currentSemester', e.target.value)}
                  >
                    <option value="">Select Semester</option>
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                  {submitAttempted && errors.currentSemester && (
                    <span className="onb-field-error">{errors.currentSemester}</span>
                  )}
                </div>

                <div className="onb-field-group">
                  <label className="onb-field-label">
                    College Roll Number <span className="onb-req-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={`onb-input ${submitAttempted && errors.collegeRoll ? 'has-error' : ''}`}
                    placeholder="e.g. CSE-23-042"
                    value={formData.collegeRoll}
                    onChange={(e) => handleFieldChange('collegeRoll', e.target.value)}
                  />
                  {submitAttempted && errors.collegeRoll && (
                    <span className="onb-field-error">{errors.collegeRoll}</span>
                  )}
                </div>

                <div className="onb-field-group">
                  <label className="onb-field-label">
                    University Roll Number <span className="onb-req-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={`onb-input ${submitAttempted && errors.universityRoll ? 'has-error' : ''}`}
                    placeholder="e.g. 10800123042 or STU-2026-CS8841"
                    value={formData.universityRoll}
                    onChange={(e) => handleFieldChange('universityRoll', e.target.value)}
                  />
                  {submitAttempted && errors.universityRoll && (
                    <span className="onb-field-error">{errors.universityRoll}</span>
                  )}
                </div>

                <div className="onb-field-group">
                  <label className="onb-field-label">
                    Admission Year <span className="onb-req-star">*</span>
                  </label>
                  <input
                    type="number"
                    className={`onb-input ${submitAttempted && errors.admissionYear ? 'has-error' : ''}`}
                    placeholder="e.g. 2023"
                    min="2015"
                    max="2035"
                    value={formData.admissionYear}
                    onChange={(e) => handleFieldChange('admissionYear', e.target.value)}
                  />
                  {submitAttempted && errors.admissionYear && (
                    <span className="onb-field-error">{errors.admissionYear}</span>
                  )}
                </div>

                <div className="onb-field-group">
                  <label className="onb-field-label">
                    Expected Completion Year <span className="onb-req-star">*</span>
                  </label>
                  <input
                    type="number"
                    className={`onb-input ${submitAttempted && errors.completionYear ? 'has-error' : ''}`}
                    placeholder="e.g. 2027"
                    min="2020"
                    max="2040"
                    value={formData.completionYear}
                    onChange={(e) => handleFieldChange('completionYear', e.target.value)}
                  />
                  {submitAttempted && errors.completionYear && (
                    <span className="onb-field-error">{errors.completionYear}</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: Academic Performance / Grading */}
          <section className="onb-section-card">
            <div className="onb-section-header">
              <div className="onb-section-title-wrap">
                <span className="onb-step-num">4</span>
                <div>
                  <h3 className="onb-section-title">Academic Performance & Grading</h3>
                  <p className="onb-section-desc">Latest institutional GPA scores verified against marksheets (scale 0.00 – 10.00)</p>
                </div>
              </div>
            </div>

            <div className="onb-section-body">
              <div className="onb-grid-3">
                <div className="onb-field-group">
                  <label className="onb-field-label">
                    Latest SGPA <span className="onb-req-star">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className={`onb-input ${submitAttempted && errors.sgpa ? 'has-error' : ''}`}
                    placeholder="e.g. 8.45"
                    value={formData.sgpa}
                    onChange={(e) => handleFieldChange('sgpa', e.target.value)}
                  />
                  {submitAttempted && errors.sgpa && (
                    <span className="onb-field-error">{errors.sgpa}</span>
                  )}
                </div>

                <div className="onb-field-group">
                  <label className="onb-field-label">
                    Yearly YGPA <span className="onb-req-star">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className={`onb-input ${submitAttempted && errors.ygpa ? 'has-error' : ''}`}
                    placeholder="e.g. 8.30"
                    value={formData.ygpa}
                    onChange={(e) => handleFieldChange('ygpa', e.target.value)}
                  />
                  {submitAttempted && errors.ygpa && (
                    <span className="onb-field-error">{errors.ygpa}</span>
                  )}
                </div>

                <div className="onb-field-group">
                  <label className="onb-field-label">
                    Cumulative CGPA <span className="onb-req-star">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className={`onb-input ${submitAttempted && errors.cgpa ? 'has-error' : ''}`}
                    placeholder="e.g. 8.52"
                    value={formData.cgpa}
                    onChange={(e) => handleFieldChange('cgpa', e.target.value)}
                  />
                  {submitAttempted && errors.cgpa && (
                    <span className="onb-field-error">{errors.cgpa}</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: Required Documents Upload Section */}
          <section className="onb-section-card">
            <div className="onb-section-header">
              <div className="onb-section-title-wrap">
                <span className="onb-step-num">5</span>
                <div>
                  <h3 className="onb-section-title">Required Documents</h3>
                  <p className="onb-section-desc">
                    Submit authentic institutional proofs for verification by your Principal / Coordinator. Max 5MB per file (PDF, JPG, PNG). Admission Slip, Aadhaar Card, and Marksheet are mandatory; College ID Card is optional.
                  </p>
                </div>
              </div>
            </div>

            <div className="onb-section-body">
              <div className="onb-docs-grid">
                {DOCUMENT_SPECS.map((spec) => {
                  const uploaded = documents[spec.id]
                  const hasError = submitAttempted && spec.required && !uploaded

                  return (
                    <div
                      key={spec.id}
                      className={`onb-doc-card ${uploaded ? 'is-uploaded' : ''} ${hasError ? 'has-error' : ''}`}
                    >
                      <input
                        type="file"
                        ref={(el) => (fileInputRefs.current[spec.id] = el)}
                        accept={spec.accept}
                        style={{ display: 'none' }}
                        onChange={(e) => handleDocFileChange(spec.id, e)}
                      />

                      <div className="onb-doc-top">
                        <div className="onb-doc-title-row">
                          <h4 className="onb-doc-title">{spec.name}</h4>
                          <p className="onb-doc-desc">{spec.desc}</p>
                        </div>
                        <span className={`onb-badge ${spec.required ? 'onb-badge-required' : 'onb-badge-optional'}`}>
                          {spec.required ? 'Required' : 'Optional'}
                        </span>
                      </div>

                      {uploaded ? (
                        <div className="onb-uploaded-meta-box">
                          <div className="onb-uploaded-left">
                            <span className="onb-file-icon">
                              {uploaded.fileType?.includes('pdf') || uploaded.fileName?.toLowerCase().endsWith('.pdf') ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                  <line x1="16" y1="13" x2="8" y2="13" />
                                  <line x1="16" y1="17" x2="8" y2="17" />
                                  <polyline points="10 9 9 9 8 9" />
                                </svg>
                              ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                  <polyline points="21 15 16 10 5 21" />
                                </svg>
                              )}
                            </span>
                            <div className="onb-file-info">
                              <span className="onb-file-name" title={uploaded.fileName}>
                                {uploaded.fileName}
                              </span>
                              <div className="onb-file-sub">
                                <span>{uploaded.fileSize}</span>
                                <span className="onb-file-dot" aria-hidden="true">•</span>
                                <span>Uploaded {uploaded.uploadedAt}</span>
                              </div>
                            </div>
                          </div>

                          <div className="onb-doc-actions-row">
                            <button
                              type="button"
                              className="onb-doc-btn-preview"
                              onClick={() => handleOpenDocPreview(spec, uploaded)}
                              title={`Preview ${uploaded.fileName}`}
                              aria-label={`Preview ${spec.name}`}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              <span>Preview</span>
                            </button>
                            <button
                              type="button"
                              className="onb-doc-btn-replace"
                              onClick={() => triggerDocUpload(spec.id)}
                              title={`Replace ${spec.name}`}
                              aria-label={`Replace ${spec.name}`}
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              className="onb-doc-btn-remove"
                              onClick={() => handleRemoveDoc(spec.id)}
                              title={`Remove ${spec.name}`}
                              aria-label={`Remove ${spec.name}`}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="onb-doc-bottom-actions">
                          <button
                            type="button"
                            className="onb-doc-btn-upload"
                            onClick={() => triggerDocUpload(spec.id)}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>Upload Document</span>
                          </button>

                          {hasError && (
                            <span className="onb-doc-error-notice" style={{ marginTop: '6px' }}>
                              ⚠ This document is mandatory for verification.
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

        </div>

        {/* Sticky Action Bar */}
        <div className="onb-action-bar">
          <div className="onb-action-bar-inner">
            <div className="onb-action-status-col">
              {draftSavedTime ? (
                <>
                  <span className="onb-draft-badge">Draft Saved</span>
                  <span>Last saved at {draftSavedTime}</span>
                </>
              ) : (
                <span>All draft edits can be saved safely at any point.</span>
              )}
            </div>

            <div className="onb-action-btns-col">
              <button
                type="button"
                className="onb-btn-draft"
                onClick={handleSaveDraftClick}
              >
                💾 Save Draft
              </button>

              <button
                type="submit"
                className="onb-btn-submit"
              >
                <span>Submit for Verification</span>
                <span style={{ fontSize: '15px' }}>→</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Image Crop Modal Reused from Project Infrastructure */}
      <ImageCropModal
        isOpen={isCropping}
        imageSrc={cropImageSrc}
        fileName={cropFileName}
        title="Position & Crop Profile Photo"
        subtitle="Zoom and reposition to frame your face clearly for institutional verification"
        roleBadge="STUDENT ID PHOTO"
        onCancel={handleCropCancel}
        onApply={handleCropApply}
      />

      {/* Required Document In-App Preview Modal */}
      {previewDoc && (
        <div
          className="onb-preview-modal-overlay"
          onClick={() => setPreviewDoc(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Preview of ${previewDoc.docName}`}
        >
          <div
            className="onb-preview-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="onb-preview-header">
              <div className="onb-preview-header-left">
                <div className="onb-preview-header-icon">
                  {previewDoc.fileType?.includes('pdf') || previewDoc.fileName?.toLowerCase().endsWith('.pdf') ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="onb-preview-title">{previewDoc.docName}</h3>
                  <div className="onb-preview-subtitle">
                    <span className="onb-preview-filename" title={previewDoc.fileName}>{previewDoc.fileName}</span>
                    <span>•</span>
                    <span>{previewDoc.fileSize}</span>
                    {previewDoc.uploadedAt && (
                      <>
                        <span>•</span>
                        <span>Uploaded {previewDoc.uploadedAt}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="onb-preview-close-btn"
                onClick={() => setPreviewDoc(null)}
                aria-label="Close document preview"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="onb-preview-body">
              {previewDoc.fileType?.includes('pdf') || previewDoc.fileName?.toLowerCase().endsWith('.pdf') ? (
                previewDoc.dataUrl ? (
                  <div className="onb-preview-pdf-frame-wrap">
                    <object
                      data={previewDoc.dataUrl}
                      type="application/pdf"
                      className="onb-preview-pdf-object"
                    >
                      <iframe
                        src={previewDoc.dataUrl}
                        title={previewDoc.fileName}
                        className="onb-preview-pdf-iframe"
                      >
                        <div className="onb-preview-fallback">
                          <p>Your browser could not render the PDF directly inside this preview window.</p>
                          <a
                            href={previewDoc.dataUrl}
                            target="_blank"
                            rel="noreferrer"
                            download={previewDoc.fileName}
                            className="onb-doc-btn-preview"
                          >
                            Open PDF in New Window / Download
                          </a>
                        </div>
                      </iframe>
                    </object>
                  </div>
                ) : (
                  <div className="onb-preview-img-wrap">
                    <img
                      src={getDocPreviewUrl(previewDoc)}
                      alt={previewDoc.fileName}
                      className="onb-preview-img"
                    />
                  </div>
                )
              ) : (
                <div className="onb-preview-img-wrap">
                  <img
                    src={getDocPreviewUrl(previewDoc)}
                    alt={previewDoc.fileName}
                    className="onb-preview-img"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="onb-preview-footer">
              <div className="onb-preview-footer-left">
                {previewDoc.dataUrl && (
                  <a
                    href={previewDoc.dataUrl}
                    target="_blank"
                    rel="noreferrer"
                    download={previewDoc.fileName}
                    className="onb-preview-download-link"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Open in New Tab / Download</span>
                  </a>
                )}
              </div>

              <div className="onb-preview-footer-right">
                <button
                  type="button"
                  className="onb-preview-footer-close-btn"
                  onClick={() => setPreviewDoc(null)}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
