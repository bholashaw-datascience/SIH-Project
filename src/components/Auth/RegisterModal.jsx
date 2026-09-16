import { useState } from 'react'
import ImageCropModal from './ImageCropModal'

function RegisterModal({ isOpen, onClose, onSwitchToLogin, role = 'student' }) {
  const isAdmin = role === 'admin'
  const isAcademic = role === 'academic'
  const isIndustry = role === 'industries' || role === 'industry'

  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [profilePic, setProfilePic] = useState(null)
  const [profilePicName, setProfilePicName] = useState('')
  const [profilePicError, setProfilePicError] = useState('')

  // Profile Photo / Logo Cropper State
  const [isCropping, setIsCropping] = useState(false)
  const [cropImageSrc, setCropImageSrc] = useState(null)
  const [cropFileName, setCropFileName] = useState('')

  // Form Fields State
  const [regForm, setRegForm] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const [regTouched, setRegTouched] = useState({
    name: false,
    address: false,
    email: false,
    phone: false,
    username: false,
    password: false,
    confirmPassword: false,
  })

  const [regSubmitAttempted, setRegSubmitAttempted] = useState(false)
  const [regSuccessMessage, setRegSuccessMessage] = useState('')

  // Registered usernames in localStorage to enforce uniqueness
  const [registeredUsernames, setRegisteredUsernames] = useState(() => {
    try {
      const stored = localStorage.getItem('udaan_registered_usernames')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {}
    return []
  })

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (!isOpen) {
      setRegForm({
        name: '',
        address: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        confirmPassword: '',
      })
      setRegTouched({
        name: false,
        address: false,
        email: false,
        phone: false,
        username: false,
        password: false,
        confirmPassword: false,
      })
      setShowRegPassword(false)
      setShowRegConfirmPassword(false)
      setIsPasswordFocused(false)
      setProfilePic(null)
      setProfilePicName('')
      setProfilePicError('')
      setIsCropping(false)
      setCropImageSrc(null)
      setCropFileName('')
      setRegSubmitAttempted(false)
      setRegSuccessMessage('')
    }
  }

  if (!isOpen) return null

  // 1. Name validation (Student Name vs Institute Name vs Industry Name vs Admin Name)
  const isNameValid = regForm.name.trim().length >= (isAcademic || isIndustry ? 1 : 2)
  const nameError =
    regTouched.name || regSubmitAttempted
      ? !regForm.name.trim()
        ? isAdmin
          ? 'Portal admin name is required.'
          : isIndustry
          ? 'Industry name is required.'
          : isAcademic
          ? 'Institute name is required.'
          : 'Student name is required.'
        : !isAcademic && !isIndustry && regForm.name.trim().length < 2
        ? 'Name must be at least 2 characters.'
        : ''
      : ''

  // 2. Address validation (Academic & Industry)
  const isAddressValid = isAcademic || isIndustry ? regForm.address.trim().length > 0 : true
  const addressError =
    (isAcademic || isIndustry) && (regTouched.address || regSubmitAttempted)
      ? !regForm.address.trim()
        ? isIndustry
          ? 'Corporate office address is required.'
          : 'Address is required.'
        : ''
      : ''

  // 3. Email format validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const isEmailValid = emailRegex.test(regForm.email.trim())
  const emailError =
    regTouched.email || regSubmitAttempted
      ? !regForm.email.trim()
        ? isAdmin
          ? 'Administrator email is required.'
          : isIndustry
          ? 'Corporate email is required.'
          : isAcademic
          ? 'Institutional email is required.'
          : 'Email address is required.'
        : !isEmailValid
        ? isAdmin
          ? 'Please enter a valid administrator email format (e.g. admin@portal.gov.in).'
          : isIndustry
          ? 'Please enter a valid corporate email format (e.g. recruiter@enterprise.com).'
          : 'Please enter a valid email format (e.g. coordinator@institution.edu).'
        : ''
      : ''

  // 4. Indian mobile / contact phone validation
  const cleanPhone = regForm.phone.replace(/[\s\-()]/g, '').replace(/^(\+91|91)/, '')
  const isPhoneValid = /^[6-9]\d{9}$/.test(cleanPhone)
  const phoneError =
    regTouched.phone || regSubmitAttempted
      ? !regForm.phone.trim()
        ? 'Phone number is required.'
        : !isPhoneValid
        ? 'Enter a valid 10-digit Indian phone number (e.g. 9876543210).'
        : ''
      : ''

  // 4. Username availability & uniqueness validation
  const trimmedUsername = regForm.username.trim()
  const isUsernameFormatValid = /^[a-zA-Z0-9_]{3,20}$/.test(trimmedUsername)
  const isUsernameTaken =
    isUsernameFormatValid &&
    registeredUsernames.some((u) => u.toLowerCase() === trimmedUsername.toLowerCase())
  const isUsernameValid = isUsernameFormatValid && !isUsernameTaken

  let usernameFeedback = null
  if (trimmedUsername.length > 0) {
    if (trimmedUsername.length < 3) {
      usernameFeedback = {
        type: 'error',
        message: 'Username must be at least 3 characters.',
      }
    } else if (!isUsernameFormatValid) {
      usernameFeedback = {
        type: 'error',
        message: 'Use 3–20 characters (letters, numbers, underscores only).',
      }
    } else if (isUsernameTaken) {
      usernameFeedback = {
        type: 'error',
        message: '✕ Username not available',
      }
    } else {
      usernameFeedback = {
        type: 'success',
        message: '✓ Username available',
      }
    }
  } else if (regTouched.username || regSubmitAttempted) {
    usernameFeedback = {
      type: 'error',
      message: 'Username is required.',
    }
  }

  // 5. Password validation (at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
  const passwordHasMinLen = regForm.password.length >= 8
  const passwordHasUpper = /[A-Z]/.test(regForm.password)
  const passwordHasLower = /[a-z]/.test(regForm.password)
  const passwordHasNumber = /[0-9]/.test(regForm.password)
  const passwordHasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(regForm.password)
  const isPasswordValid =
    passwordHasMinLen &&
    passwordHasUpper &&
    passwordHasLower &&
    passwordHasNumber &&
    passwordHasSpecial

  const shouldShowPasswordRules =
    isPasswordFocused ||
    ((regTouched.password || regSubmitAttempted) && !isPasswordValid)

  // 6. Confirm Password validation (must match password)
  const isConfirmPasswordValid =
    regForm.confirmPassword.length > 0 && regForm.confirmPassword === regForm.password
  let confirmPasswordFeedback = null
  if (regForm.confirmPassword.length > 0) {
    if (regForm.confirmPassword !== regForm.password) {
      confirmPasswordFeedback = {
        type: 'error',
        message: '✕ Passwords do not match.',
      }
    } else {
      confirmPasswordFeedback = {
        type: 'success',
        message: '✓ Passwords match.',
      }
    }
  } else if (regTouched.confirmPassword || regSubmitAttempted) {
    confirmPasswordFeedback = {
      type: 'error',
      message: 'Please confirm your password.',
    }
  }

  const isRegFormValid =
    isNameValid &&
    isAddressValid &&
    isEmailValid &&
    isPhoneValid &&
    isUsernameValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    !profilePicError

  const handleProfilePicChange = (e) => {
    setProfilePicError('')
    const file = e.target.files?.[0]
    if (!file) return

    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp']

    if (!validMimeTypes.includes(file.type) && !validExtensions.includes(fileExt)) {
      setProfilePicError('Invalid format. Supported formats: JPG, PNG, or WebP only.')
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfilePicError('File size exceeds 5MB limit. Please choose a smaller photo.')
      e.target.value = ''
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

  const handleRemovePhoto = () => {
    setProfilePic(null)
    setProfilePicName('')
    setProfilePicError('')
  }

  const handleCropCancel = () => {
    setIsCropping(false)
    setCropImageSrc(null)
    setCropFileName('')
  }

  const handleCropApply = (croppedDataUrl, fileName) => {
    setProfilePic(croppedDataUrl)
    setProfilePicName(`${fileName} (Adjusted)`)
    setProfilePicError('')
    setIsCropping(false)
    setCropImageSrc(null)
    setCropFileName('')
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    setRegSubmitAttempted(true)
    setRegTouched({
      name: true,
      address: isAcademic || isIndustry,
      email: true,
      phone: true,
      username: true,
      password: true,
      confirmPassword: true,
    })

    if (!isRegFormValid) {
      return
    }

    // Save registered username in localStorage to demonstrate uniqueness
    const updatedUsers = [...registeredUsernames, trimmedUsername]
    setRegisteredUsernames(updatedUsers)
    try {
      localStorage.setItem('udaan_registered_usernames', JSON.stringify(updatedUsers))
    } catch {}

    // Save registered account details for role-specific account lookup in Forgot Password and Student Portal
    try {
      const existingAccounts = JSON.parse(localStorage.getItem('udaan_registered_accounts') || '[]')
      const normalizedRole = isAdmin ? 'admin' : isIndustry ? 'industry' : isAcademic ? 'academic' : 'student'
      const newAccount = {
        username: trimmedUsername,
        name: regForm.name ? regForm.name.trim() : trimmedUsername,
        email: regForm.email.trim(),
        phone: regForm.phone ? regForm.phone.trim() : '',
        profilePic: profilePic || null,
        role: normalizedRole,
        verificationStatus: 'unverified',
      }
      existingAccounts.push(newAccount)
      localStorage.setItem('udaan_registered_accounts', JSON.stringify(existingAccounts))

      if (normalizedRole === 'student') {
        localStorage.setItem('udaan_active_student', JSON.stringify(newAccount))
        localStorage.setItem('udaan_student_verification_status', 'unverified')
      }
    } catch {}

    setRegSuccessMessage(
      isAdmin
        ? `Administrator account created successfully for @${trimmedUsername}! Switching to login...`
        : isIndustry
        ? `Industry account created successfully for @${trimmedUsername}! Switching to login...`
        : isAcademic
        ? `Institution account created successfully for @${trimmedUsername}! Switching to login...`
        : `Account created successfully for @${trimmedUsername}! Switching to login...`
    )

    setTimeout(() => {
      onSwitchToLogin()
      setRegSuccessMessage('')
      setRegSubmitAttempted(false)
      setRegForm({
        name: '',
        address: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        confirmPassword: '',
      })
      setRegTouched({
        name: false,
        address: false,
        email: false,
        phone: false,
        username: false,
        password: false,
        confirmPassword: false,
      })
      setProfilePic(null)
      setProfilePicName('')
      setProfilePicError('')
    }, 1800)
  }

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-card register-modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-top-accent"></div>

          {/* Modal Header */}
          <div className="modal-header">
            <div className="modal-header-info">
              <span className="modal-role-pill">
                {isAdmin ? 'System Governance' : isIndustry ? 'Enterprise Gateway' : isAcademic ? 'Academic Institution' : 'STUDENT PORTAL'}
              </span>
              <h3 className={`modal-title ${isAdmin ? 'admin-register-title' : isIndustry ? 'industry-register-title' : isAcademic ? 'academic-register-title' : 'student-register-title'}`}>
                {isAdmin ? 'Create Admin Account' : isIndustry ? 'Create Industry Account' : isAcademic ? 'Create Institution Account' : 'Create Student Account'}
              </h3>
            </div>

            <button
              type="button"
              className="modal-close-btn"
              aria-label="Close modal"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* Modal Body / Registration Form */}
          <div className="modal-body register-modal-body">
            <form className="access-form register-form-flow" onSubmit={handleRegisterSubmit} noValidate>
              {/* Success / Error Banners */}
              {regSuccessMessage && (
                <div className="form-feedback-alert alert-success">
                  <span>{regSuccessMessage}</span>
                </div>
              )}
              {regSubmitAttempted && !isRegFormValid && !regSuccessMessage && (
                <div className="form-feedback-alert alert-error">
                  <span>Please fill all required fields correctly before registering.</span>
                </div>
              )}

              {/* Section 1: Details & Compact Upload Card Split */}
              <div className="register-section-label">
                <span>{isAcademic ? 'Institutional Details' : isIndustry ? 'Enterprise Details' : isAdmin ? 'Administrator Details' : 'Student Details'}</span>
              </div>

              <div className="register-top-split">
                {/* LEFT: Registration Form Fields */}
                <div className="register-details-left">
                  {/* 1. Name */}
                  <div className="form-field field-half">
                    <label className="form-label" htmlFor="reg-name">
                      {isAdmin ? 'Portal Admin Name' : isIndustry ? 'Industry Name' : isAcademic ? 'Institute Name' : 'Student Name'} <span className="required-star">*</span>
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      className={`form-input ${nameError ? 'is-invalid' : (regForm.name && isNameValid ? 'is-valid' : '')}`}
                      placeholder={
                        isAdmin
                          ? 'Enter full administrator name'
                          : isIndustry
                          ? 'Company / enterprise name'
                          : isAcademic
                          ? 'Official institute name'
                          : 'Enter your full name'
                      }
                      value={regForm.name}
                      onChange={(e) => {
                        setRegForm({ ...regForm, name: e.target.value })
                        if (!regTouched.name) setRegTouched({ ...regTouched, name: true })
                      }}
                      onBlur={() => setRegTouched({ ...regTouched, name: true })}
                    />
                    {nameError && <div className="form-feedback feedback-error">{nameError}</div>}
                  </div>

                  {/* 2. Address (for Academic & Industry) OR Username (for Student & Admin) */}
                  {isAcademic || isIndustry ? (
                    <div className="form-field field-half">
                      <label className="form-label" htmlFor="reg-address">Address <span className="required-star">*</span></label>
                      <input
                        id="reg-address"
                        type="text"
                        className={`form-input ${addressError ? 'is-invalid' : (regForm.address && isAddressValid ? 'is-valid' : '')}`}
                        placeholder={isIndustry ? 'Corporate office, city, state' : 'Campus address, city, state'}
                        value={regForm.address}
                        onChange={(e) => {
                          setRegForm({ ...regForm, address: e.target.value })
                          if (!regTouched.address) setRegTouched({ ...regTouched, address: true })
                        }}
                        onBlur={() => setRegTouched({ ...regTouched, address: true })}
                      />
                      {addressError && <div className="form-feedback feedback-error">{addressError}</div>}
                    </div>
                  ) : (
                    <div className="form-field field-half">
                      <label className="form-label" htmlFor="reg-username">Username <span className="required-star">*</span></label>
                      <input
                        id="reg-username"
                        type="text"
                        className={`form-input ${usernameFeedback?.type === 'error' ? 'is-invalid' : (usernameFeedback?.type === 'success' ? 'is-valid' : '')}`}
                        placeholder={
                          isAdmin
                            ? 'Admin username (e.g. admin_ops)'
                            : 'Choose unique username'
                        }
                        value={regForm.username}
                        onChange={(e) => {
                          setRegForm({ ...regForm, username: e.target.value })
                          if (!regTouched.username) setRegTouched({ ...regTouched, username: true })
                        }}
                        onBlur={() => setRegTouched({ ...regTouched, username: true })}
                      />
                      {usernameFeedback && (
                        <div className={`form-feedback ${usernameFeedback.type === 'error' ? 'feedback-error' : 'feedback-success'}`}>
                          {usernameFeedback.message}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. Email */}
                  <div className="form-field field-half">
                    <label className="form-label" htmlFor="reg-email">
                      {isAdmin ? 'Admin Email' : isIndustry ? 'Corporate Email' : isAcademic ? 'Institutional Email' : 'Email Address'} <span className="required-star">*</span>
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      className={`form-input ${emailError ? 'is-invalid' : (regForm.email && isEmailValid ? 'is-valid' : '')}`}
                      placeholder={
                        isAdmin
                          ? 'admin.ops@portal.gov.in'
                          : isIndustry
                          ? 'recruiter@enterprise.com'
                          : isAcademic
                          ? 'coordinator@institution.edu'
                          : 'name@university.edu'
                      }
                      value={regForm.email}
                      onChange={(e) => {
                        setRegForm({ ...regForm, email: e.target.value })
                        if (!regTouched.email) setRegTouched({ ...regTouched, email: true })
                      }}
                      onBlur={() => setRegTouched({ ...regTouched, email: true })}
                    />
                    {emailError && <div className="form-feedback feedback-error">{emailError}</div>}
                    {!emailError && regForm.email && isEmailValid && (
                      <div className="form-feedback feedback-success">✓ Valid email format</div>
                    )}
                  </div>

                  {/* 4. Phone */}
                  <div className="form-field field-half">
                    <label className="form-label" htmlFor="reg-phone">Phone Number <span className="required-star">*</span></label>
                    <input
                      id="reg-phone"
                      type="tel"
                      className={`form-input ${phoneError ? 'is-invalid' : (regForm.phone && isPhoneValid ? 'is-valid' : '')}`}
                      placeholder="10-digit mobile number"
                      value={regForm.phone}
                      onChange={(e) => {
                        setRegForm({ ...regForm, phone: e.target.value })
                        if (!regTouched.phone) setRegTouched({ ...regTouched, phone: true })
                      }}
                      onBlur={() => setRegTouched({ ...regTouched, phone: true })}
                    />
                    {phoneError && <div className="form-feedback feedback-error">{phoneError}</div>}
                    {!phoneError && regForm.phone && isPhoneValid && (
                      <div className="form-feedback feedback-success">✓ Valid 10-digit phone</div>
                    )}
                  </div>

                  {/* Username for Academic & Industry (full width of left side) */}
                  {(isAcademic || isIndustry) && (
                    <div className="form-field field-full">
                      <label className="form-label" htmlFor="reg-username">Username <span className="required-star">*</span></label>
                      <input
                        id="reg-username"
                        type="text"
                        className={`form-input ${usernameFeedback?.type === 'error' ? 'is-invalid' : (usernameFeedback?.type === 'success' ? 'is-valid' : '')}`}
                        placeholder={
                          isIndustry
                            ? 'Corporate username (e.g. tata_motors_recruiter)'
                            : 'Institutional username (e.g. iit_delhi_admin)'
                        }
                        value={regForm.username}
                        onChange={(e) => {
                          setRegForm({ ...regForm, username: e.target.value })
                          if (!regTouched.username) setRegTouched({ ...regTouched, username: true })
                        }}
                        onBlur={() => setRegTouched({ ...regTouched, username: true })}
                      />
                      {usernameFeedback && (
                        <div className={`form-feedback ${usernameFeedback.type === 'error' ? 'feedback-error' : 'feedback-success'}`}>
                          {usernameFeedback.message}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* RIGHT: Compact Logo / Profile Upload Card */}
                <div className="register-upload-card-right">
                  <div className="upload-card-badge">
                    {isAcademic || isIndustry ? 'ORGANIZATION LOGO' : 'PROFILE PHOTO'}
                  </div>

                  <div className="profile-avatar-wrapper">
                    {profilePic ? (
                      <img
                        src={profilePic}
                        alt={isAdmin ? 'Admin profile preview' : isIndustry ? 'Industry logo preview' : isAcademic ? 'Institute logo preview' : 'Profile preview'}
                        className="avatar-img-preview"
                      />
                    ) : (
                      <div className="avatar-placeholder-icon">
                        {isAdmin ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <circle cx="12" cy="10" r="3" />
                            <path d="M7.5 17a4.5 4.5 0 0 1 9 0" />
                          </svg>
                        ) : isIndustry ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                            <path d="M9 22v-4h6v4" />
                            <path d="M8 6h.01" />
                            <path d="M16 6h.01" />
                            <path d="M12 6h.01" />
                            <path d="M12 10h.01" />
                            <path d="M12 14h.01" />
                            <path d="M16 10h.01" />
                            <path d="M16 14h.01" />
                            <path d="M8 10h.01" />
                            <path d="M8 14h.01" />
                          </svg>
                        ) : isAcademic ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 21h18" />
                            <path d="M3 10h18" />
                            <path d="M5 10v11" />
                            <path d="M9 10v11" />
                            <path d="M15 10v11" />
                            <path d="M19 10v11" />
                            <path d="m12 2 10 5H2z" />
                          </svg>
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="upload-card-controls">
                    <label className="btn-upload-photo">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>
                        {profilePic
                          ? isIndustry || isAcademic
                            ? 'Change Logo'
                            : 'Change Photo'
                          : isIndustry || isAcademic
                          ? 'Upload Logo'
                          : 'Upload Photo'}
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="file-hidden-input"
                        onChange={handleProfilePicChange}
                      />
                    </label>

                    {profilePic && (
                      <button
                        type="button"
                        className="btn-remove-photo"
                        onClick={handleRemovePhoto}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <span className="profile-format-note">
                    {profilePicName ? profilePicName : 'JPG, PNG, WebP (Max 5MB)'}
                  </span>

                  {profilePicError && (
                    <div className="profile-error-text">
                      {profilePicError}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Account Security */}
              <div className="register-section-label">
                <span>Security & Access Credentials</span>
              </div>

              {/* Password & Confirm Password Row */}
              <div className="register-security-grid">
                {/* 5. Password */}
                <div className="form-field field-half">
                  <label className="form-label" htmlFor="reg-password">Password <span className="required-star">*</span></label>
                  <div className="password-input-wrap">
                    <input
                      id="reg-password"
                      type={showRegPassword ? 'text' : 'password'}
                      className={`form-input ${(regTouched.password || regSubmitAttempted) && !isPasswordValid ? 'is-invalid' : (regForm.password && isPasswordValid ? 'is-valid' : '')}`}
                      placeholder="Create strong password"
                      value={regForm.password}
                      onChange={(e) => {
                        setRegForm({ ...regForm, password: e.target.value })
                        if (!regTouched.password) setRegTouched({ ...regTouched, password: true })
                      }}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => {
                        setIsPasswordFocused(false)
                        setRegTouched({ ...regTouched, password: true })
                      }}
                    />
                    <button
                      type="button"
                      className="toggle-password-btn"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {(regTouched.password || regSubmitAttempted) && regForm.password.length === 0 && (
                    <div className="form-feedback feedback-error">
                      Password is required.
                    </div>
                  )}
                </div>

                {/* 6. Confirm Password */}
                <div className="form-field field-half">
                  <label className="form-label" htmlFor="reg-confirm-password">Confirm Password <span className="required-star">*</span></label>
                  <div className="password-input-wrap">
                    <input
                      id="reg-confirm-password"
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      className={`form-input ${confirmPasswordFeedback?.type === 'error' ? 'is-invalid' : (confirmPasswordFeedback?.type === 'success' ? 'is-valid' : '')}`}
                      placeholder="Confirm your password"
                      value={regForm.confirmPassword}
                      onChange={(e) => {
                        setRegForm({ ...regForm, confirmPassword: e.target.value })
                        if (!regTouched.confirmPassword) setRegTouched({ ...regTouched, confirmPassword: true })
                      }}
                      onBlur={() => setRegTouched({ ...regTouched, confirmPassword: true })}
                    />
                    <button
                      type="button"
                      className="toggle-password-btn"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      aria-label={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegConfirmPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {confirmPasswordFeedback && (
                    <div className={`form-feedback ${confirmPasswordFeedback.type === 'error' ? 'feedback-error' : 'feedback-success'}`}>
                      {confirmPasswordFeedback.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Password Validation Checklist Area */}
              <div
                className={`register-rules-full ${shouldShowPasswordRules ? 'is-expanded' : 'is-collapsed'}`}
                aria-live="polite"
              >
                <div className={`password-checklist-card ${isPasswordValid ? 'checklist-card-all-met' : ''}`}>
                  <div className="checklist-items-grid">
                    <div className={`chk-item ${passwordHasMinLen ? 'is-met' : ''}`}>
                      <span className="chk-marker">{passwordHasMinLen ? '✓' : '○'}</span>
                      <span>8+ chars</span>
                    </div>
                    <div className={`chk-item ${passwordHasUpper ? 'is-met' : ''}`}>
                      <span className="chk-marker">{passwordHasUpper ? '✓' : '○'}</span>
                      <span>Uppercase (A-Z)</span>
                    </div>
                    <div className={`chk-item ${passwordHasLower ? 'is-met' : ''}`}>
                      <span className="chk-marker">{passwordHasLower ? '✓' : '○'}</span>
                      <span>Lowercase (a-z)</span>
                    </div>
                    <div className={`chk-item ${passwordHasNumber ? 'is-met' : ''}`}>
                      <span className="chk-marker">{passwordHasNumber ? '✓' : '○'}</span>
                      <span>Number (0-9)</span>
                    </div>
                    <div className={`chk-item ${passwordHasSpecial ? 'is-met' : ''}`}>
                      <span className="chk-marker">{passwordHasSpecial ? '✓' : '○'}</span>
                      <span>Special symbol</span>
                    </div>
                  </div>
                </div>
                {(regTouched.password || regSubmitAttempted) && !isPasswordValid && regForm.password.length > 0 && (
                  <div className="form-feedback feedback-error">
                    Please satisfy all highlighted password criteria above.
                  </div>
                )}
              </div>

              {/* Prominent Full-Width CTA & Clean Secondary Switch */}
              <div className="register-actions-footer">
                <button type="submit" className="form-submit-btn">
                  Register Account
                </button>

                <div className="modal-switch-prompt">
                  <span>Already registered? </span>
                  <button
                    type="button"
                    className="modal-switch-link"
                    onClick={onSwitchToLogin}
                  >
                    Log in to your account
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Embedded Crop Modal Component */}
      <ImageCropModal
        isOpen={isCropping}
        imageSrc={cropImageSrc}
        fileName={cropFileName}
        onCancel={handleCropCancel}
        onApply={handleCropApply}
        title={
          isAdmin
            ? 'Crop & Position Admin Photo'
            : isIndustry
            ? 'Crop & Position Industry Logo'
            : isAcademic
            ? 'Crop & Position Institute Logo'
            : 'Crop & Position Profile Photo'
        }
        subtitle="Drag to reposition, use slider to zoom"
        roleBadge={
          isAdmin
            ? 'ADMIN PHOTO'
            : isIndustry
            ? 'LOGO ADJUSTMENT'
            : isAcademic
            ? 'LOGO ADJUSTMENT'
            : 'PHOTO ADJUSTMENT'
        }
      />
    </>
  )
}

export default RegisterModal
