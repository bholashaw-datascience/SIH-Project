import { useState, useEffect } from 'react'

const DEFAULT_PORTAL_ACCOUNTS = {
  student: [],
  academic: [
    { username: 'iit_delhi', email: 'coordinator@iitd.ac.in' },
    { username: 'nit_trichy', email: 'dean.academic@nitt.edu' },
  ],
  industry: [
    { username: 'tata_motors', email: 'recruiter@tatamotors.com' },
    { username: 'infosys_hr', email: 'careers@infosys.com' },
  ],
  admin: [
    { username: 'admin', email: 'system.admin@udaan.gov.in' },
    { username: 'admin_operations', email: 'admin.ops@portal.gov.in' },
    { username: 'lead_supervisor', email: 'supervisor@portal.gov.in' },
  ],
}

function maskEmail(email) {
  if (!email || !email.includes('@')) return email
  const [local, domain] = email.split('@')
  const firstChar = local.charAt(0) || 'u'
  return `${firstChar}***@${domain}`
}

function ForgotPasswordModal({ isOpen, onClose, onSwitchToLogin, role = 'student' }) {
  const isAdmin = role === 'admin'
  const isAcademic = role === 'academic'
  const isIndustry = role === 'industries' || role === 'industry'

  const normalizedRole = isAdmin ? 'admin' : isIndustry ? 'industry' : isAcademic ? 'academic' : 'student'

  const roleBadge = isAdmin
    ? 'System Governance'
    : isIndustry
    ? 'Enterprise Gateway'
    : isAcademic
    ? 'Academic Institution'
    : 'STUDENT PORTAL'

  const roleLabel = isAdmin
    ? 'Portal Admin'
    : isIndustry
    ? 'Industry Partner'
    : isAcademic
    ? 'Academic Institution'
    : 'Student'

  const usernamePlaceholder = isAdmin
    ? 'Enter administrator username'
    : isIndustry
    ? 'Enter corporate username'
    : isAcademic
    ? 'Enter institutional username'
    : 'Enter your student username'

  // Step state: 1: 'identify', 2: 'otp', 3: 'password', 4: 'success'
  const [step, setStep] = useState(1)

  // Step 1: Username & Account Identification
  const [username, setUsername] = useState('')
  const [foundAccount, setFoundAccount] = useState(null)

  // Step 2: Email OTP
  const [otpSent, setOtpSent] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [otpExpiry, setOtpExpiry] = useState(0)
  const [enteredOtp, setEnteredOtp] = useState('')
  const [cooldownSeconds, setCooldownSeconds] = useState(0)

  // Step 3: New Password
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Feedback states
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [touched, setTouched] = useState({ username: false, otp: false, password: false, confirmPassword: false })

  // Reset state when opening/closing modal
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (!isOpen) {
      setStep(1)
      setUsername('')
      setFoundAccount(null)
      setOtpSent(false)
      setGeneratedOtp('')
      setOtpExpiry(0)
      setEnteredOtp('')
      setNewPassword('')
      setConfirmPassword('')
      setShowNewPassword(false)
      setShowConfirmPassword(false)
      setErrorMessage('')
      setSuccessMessage('')
      setCooldownSeconds(0)
      setTouched({ username: false, otp: false, password: false, confirmPassword: false })
    }
  }

  // Cooldown countdown
  useEffect(() => {
    let timer = null
    if (cooldownSeconds > 0) {
      timer = setInterval(() => {
        setCooldownSeconds((prev) => Math.max(prev - 1, 0))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [cooldownSeconds])

  if (!isOpen) return null

  // Password validation rules (reusing the registration password-strength criteria)
  const passwordHasMinLen = newPassword.length >= 8
  const passwordHasUpper = /[A-Z]/.test(newPassword)
  const passwordHasLower = /[a-z]/.test(newPassword)
  const passwordHasNumber = /[0-9]/.test(newPassword)
  const passwordHasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(newPassword)
  const isPasswordValid =
    passwordHasMinLen &&
    passwordHasUpper &&
    passwordHasLower &&
    passwordHasNumber &&
    passwordHasSpecial

  const isConfirmPasswordValid =
    confirmPassword.length > 0 && confirmPassword === newPassword

  // STEP 1 HANDLER: Account Lookup
  const handleIdentifySubmit = (e) => {
    e.preventDefault()
    setTouched((prev) => ({ ...prev, username: true }))
    setErrorMessage('')

    const trimmed = username.trim()
    if (!trimmed) {
      setErrorMessage('Please enter your registered username.')
      return
    }

    // Retrieve default accounts + localStorage accounts
    let accountsForRole = [...(DEFAULT_PORTAL_ACCOUNTS[normalizedRole] || [])]
    try {
      const storedAccounts = JSON.parse(localStorage.getItem('udaan_registered_accounts') || '[]')
      const customForRole = storedAccounts.filter(
        (a) => a.role === normalizedRole || (normalizedRole === 'industry' && a.role === 'industries')
      )
      accountsForRole = [...accountsForRole, ...customForRole]
    } catch {}

    // Strict role isolation: only find accounts registered under this specific portal
    const matched = accountsForRole.find(
      (a) => a.username.toLowerCase() === trimmed.toLowerCase()
    )

    if (!matched) {
      setErrorMessage(
        `No ${roleLabel} account found with username '@${trimmed}'. Please check your username or select the correct gateway.`
      )
      return
    }

    // Account identified! Move to Step 2 with explicit Send OTP state
    setFoundAccount(matched)
    setOtpSent(false)
    setGeneratedOtp('')
    setEnteredOtp('')
    setErrorMessage('')
    setSuccessMessage('')
    setStep(2)
  }

  // Action: Send OTP explicitly
  const handleSendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(newOtp)
    setOtpExpiry(Date.now() + 10 * 60 * 1000) // 10 minutes validity
    setCooldownSeconds(45)
    setEnteredOtp('')
    setErrorMessage('')
    setOtpSent(true)
    setSuccessMessage('A simulated verification OTP has been generated for demo testing.')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  // STEP 2 HANDLER: Verify OTP
  const handleOtpSubmit = (e) => {
    e.preventDefault()
    setTouched((prev) => ({ ...prev, otp: true }))
    setErrorMessage('')

    const cleanOtp = enteredOtp.trim()
    if (!cleanOtp) {
      setErrorMessage('Please enter the 6-digit OTP code.')
      return
    }

    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      setErrorMessage('Please enter a valid 6-digit numerical code.')
      return
    }

    if (Date.now() > otpExpiry) {
      setErrorMessage('This OTP code has expired. Please click "Resend OTP" to generate a fresh code.')
      return
    }

    if (cleanOtp !== generatedOtp) {
      setErrorMessage('Invalid OTP code. Please enter the 6-digit code received on your email.')
      return
    }

    // OTP Verified! Proceed to Step 3
    setErrorMessage('')
    setStep(3)
  }

  // Resend OTP Action
  const handleResendOtp = () => {
    if (cooldownSeconds > 0) return
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(newOtp)
    setOtpExpiry(Date.now() + 10 * 60 * 1000)
    setCooldownSeconds(45)
    setEnteredOtp('')
    setErrorMessage('')
    setSuccessMessage('A fresh verification OTP has been generated.')
    setTimeout(() => setSuccessMessage(''), 3500)
  }

  // STEP 3 HANDLER: Reset Password
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault()
    setTouched((prev) => ({ ...prev, password: true, confirmPassword: true }))
    setErrorMessage('')

    if (!isPasswordValid) {
      setErrorMessage('Please ensure your new password satisfies all strength requirements.')
      return
    }

    if (!isConfirmPasswordValid) {
      setErrorMessage('Password confirmation does not match the new password.')
      return
    }

    // Update in localStorage if registered accounts exist
    try {
      const storedAccounts = JSON.parse(localStorage.getItem('udaan_registered_accounts') || '[]')
      const updated = storedAccounts.map((acc) => {
        if (
          acc.username.toLowerCase() === foundAccount.username.toLowerCase() &&
          (acc.role === normalizedRole || (normalizedRole === 'industry' && acc.role === 'industries'))
        ) {
          return { ...acc, password: newPassword }
        }
        return acc
      })
      localStorage.setItem('udaan_registered_accounts', JSON.stringify(updated))
    } catch {}

    // Move to Step 4: Success
    setStep(4)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top-accent"></div>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <span className="modal-role-pill">{roleBadge}</span>
            <h3 className="modal-title reset-password-title">Reset Password</h3>
            <p className="modal-subtitle">
              {step === 1 && 'Enter your username to look up your account and initiate verification.'}
              {step === 2 && (!otpSent ? 'Confirm your registered account and send a verification code.' : 'Enter the security code to verify your account.')}
              {step === 3 && 'Create a strong, secure new password for your account.'}
              {step === 4 && 'Your password reset process is complete.'}
            </p>
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

        {/* Multi-Step Visual Progress Bar */}
        {step < 4 && (
          <div className="forgot-steps-indicator">
            <div className={`step-pill ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <span className="step-num">{step > 1 ? '✓' : '1'}</span>
              <span className="step-label">Identify</span>
            </div>
            <div className={`step-divider ${step >= 2 ? 'active' : ''}`} />
            <div className={`step-pill ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <span className="step-num">{step > 2 ? '✓' : '2'}</span>
              <span className="step-label">Verify OTP</span>
            </div>
            <div className={`step-divider ${step >= 3 ? 'active' : ''}`} />
            <div className={`step-pill ${step >= 3 ? 'active' : ''}`}>
              <span className="step-num">3</span>
              <span className="step-label">New Password</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="modal-body">
          {/* Global Error Banner */}
          {errorMessage && (
            <div className="form-feedback-alert alert-error">
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Global Success Banner */}
          {successMessage && (
            <div className="form-feedback-alert alert-success">
              <span>{successMessage}</span>
            </div>
          )}

          {/* STEP 1: ACCOUNT IDENTIFICATION */}
          {step === 1 && (
            <form className="access-form" onSubmit={handleIdentifySubmit} noValidate>
              <div className="form-field">
                <label className="form-label" htmlFor="forgot-username">Username *</label>
                <input
                  id="forgot-username"
                  type="text"
                  className={`form-input ${touched.username && !username.trim() ? 'is-invalid' : ''}`}
                  placeholder={usernamePlaceholder}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    if (errorMessage) setErrorMessage('')
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
                  required
                  autoFocus
                />
                <span className="form-feedback feedback-hint">
                  Enter your registered username to verify your account in the {roleLabel} portal.
                </span>
              </div>

              <button type="submit" className="form-submit-btn">
                Continue to Verification
              </button>

              <div className="modal-switch-prompt">
                <span>Remember your password?</span>
                <button
                  type="button"
                  className="modal-switch-link"
                  onClick={onSwitchToLogin}
                >
                  Log in
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: EMAIL OTP VERIFICATION */}
          {step === 2 && foundAccount && (
            <div className="access-form">
              {/* Account Identified Banner */}
              <div className="identified-account-box">
                <div className="account-avatar-mini">
                  <span>👤</span>
                </div>
                <div className="account-details-mini">
                  <div className="account-user-name">@{foundAccount.username}</div>
                  <div className="account-email-masked">
                    {otpSent ? (
                      <>Verification code sent to <strong>{maskEmail(foundAccount.email)}</strong></>
                    ) : (
                      <>Registered Email: <strong>{maskEmail(foundAccount.email)}</strong></>
                    )}
                  </div>
                </div>
              </div>

              {!otpSent ? (
                <div className="otp-send-action-box">
                  <div className="otp-prompt-card">
                    <div className="otp-prompt-title">Identity Verification Required</div>
                    <div className="otp-prompt-text">
                      To safeguard your {roleLabel} account, click below to generate a 6-digit one-time verification password (OTP) for your registered email address <strong>{maskEmail(foundAccount.email)}</strong>.
                    </div>
                  </div>

                  <button
                    type="button"
                    className="form-submit-btn send-otp-btn"
                    onClick={handleSendOtp}
                  >
                    Send OTP
                  </button>

                  <div className="modal-switch-prompt">
                    <button
                      type="button"
                      className="modal-switch-link secondary-sublink"
                      onClick={() => {
                        setStep(1)
                        setOtpSent(false)
                        setErrorMessage('')
                        setSuccessMessage('')
                      }}
                    >
                      ← Change username
                    </button>
                    <span className="dot-separator">•</span>
                    <button
                      type="button"
                      className="modal-switch-link"
                      onClick={onSwitchToLogin}
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              ) : (
                <form className="access-form" onSubmit={handleOtpSubmit} noValidate>
                  {/* Dev Simulation Notice */}
                  <div className="otp-simulation-alert">
                    <div className="otp-sim-badge">DEMO GATEWAY</div>
                    <div className="otp-sim-text">
                      Your simulated OTP code is <strong>{generatedOtp}</strong> (valid for 10 min). Note: Running in frontend preview mode — no external email was dispatched.
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label" htmlFor="forgot-otp">Enter the 6-Digit OTP *</label>
                    <input
                      id="forgot-otp"
                      type="text"
                      maxLength={6}
                      className={`form-input otp-code-input ${touched.otp && !enteredOtp.trim() ? 'is-invalid' : ''}`}
                      placeholder="••••••"
                      value={enteredOtp}
                      onChange={(e) => {
                        setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                        if (errorMessage) setErrorMessage('')
                      }}
                      onBlur={() => setTouched((prev) => ({ ...prev, otp: true }))}
                      autoComplete="one-time-code"
                      autoFocus
                    />
                    {touched.otp && !enteredOtp.trim() && (
                      <div className="form-feedback feedback-error">Please enter the 6-digit OTP code.</div>
                    )}
                  </div>

                  <div className="otp-actions-strip">
                    <span className="otp-timer-text">
                      {cooldownSeconds > 0
                        ? `Resend available in ${cooldownSeconds}s`
                        : "Didn't receive the code?"}
                    </span>
                    <button
                      type="button"
                      className="resend-otp-btn"
                      onClick={handleResendOtp}
                      disabled={cooldownSeconds > 0}
                    >
                      Resend OTP
                    </button>
                  </div>

                  <button type="submit" className="form-submit-btn">
                    Verify OTP
                  </button>

                  <div className="modal-switch-prompt">
                    <button
                      type="button"
                      className="modal-switch-link secondary-sublink"
                      onClick={() => {
                        setStep(1)
                        setOtpSent(false)
                        setErrorMessage('')
                        setSuccessMessage('')
                      }}
                    >
                      ← Change username
                    </button>
                    <span className="dot-separator">•</span>
                    <button
                      type="button"
                      className="modal-switch-link"
                      onClick={onSwitchToLogin}
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 3: SET NEW PASSWORD */}
          {step === 3 && (
            <form className="access-form" onSubmit={handleResetPasswordSubmit} noValidate>
              <div className="form-field">
                <label className="form-label" htmlFor="forgot-new-password">New Password *</label>
                <div className="password-input-wrap">
                  <input
                    id="forgot-new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    className={`form-input ${touched.password && !isPasswordValid ? 'is-invalid' : newPassword && isPasswordValid ? 'is-valid' : ''}`}
                    placeholder="Create a strong new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      if (errorMessage) setErrorMessage('')
                    }}
                    onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? (
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

                {/* Dynamic Password Requirements */}
                {!isPasswordValid ? (
                  <div className="password-rules-box">
                    <span className={`pwd-rule ${passwordHasMinLen ? 'met' : 'unmet'}`}>
                      <span className="pwd-rule-icon">{passwordHasMinLen ? '✓' : '○'}</span>
                      <span>8+ characters</span>
                    </span>
                    <span className={`pwd-rule ${passwordHasUpper ? 'met' : 'unmet'}`}>
                      <span className="pwd-rule-icon">{passwordHasUpper ? '✓' : '○'}</span>
                      <span>1 Uppercase (A-Z)</span>
                    </span>
                    <span className={`pwd-rule ${passwordHasLower ? 'met' : 'unmet'}`}>
                      <span className="pwd-rule-icon">{passwordHasLower ? '✓' : '○'}</span>
                      <span>1 Lowercase (a-z)</span>
                    </span>
                    <span className={`pwd-rule ${passwordHasNumber ? 'met' : 'unmet'}`}>
                      <span className="pwd-rule-icon">{passwordHasNumber ? '✓' : '○'}</span>
                      <span>1 Number (0-9)</span>
                    </span>
                    <span className={`pwd-rule ${passwordHasSpecial ? 'met' : 'unmet'}`}>
                      <span className="pwd-rule-icon">{passwordHasSpecial ? '✓' : '○'}</span>
                      <span>1 Special character</span>
                    </span>
                  </div>
                ) : (
                  <div className="form-feedback feedback-success">
                    ✓ All password requirements satisfied
                  </div>
                )}
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="forgot-confirm-password">Confirm New Password *</label>
                <div className="password-input-wrap">
                  <input
                    id="forgot-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-input ${confirmPassword && !isConfirmPasswordValid ? 'is-invalid' : confirmPassword && isConfirmPasswordValid ? 'is-valid' : ''}`}
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (errorMessage) setErrorMessage('')
                    }}
                    onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
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
                {confirmPassword && (
                  <div className={`form-feedback ${isConfirmPasswordValid ? 'feedback-success' : 'feedback-error'}`}>
                    {isConfirmPasswordValid ? '✓ Passwords match.' : '✕ Passwords do not match.'}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="form-submit-btn"
                disabled={!isPasswordValid || !isConfirmPasswordValid}
              >
                Reset Password
              </button>

              <div className="modal-switch-prompt">
                <button
                  type="button"
                  className="modal-switch-link"
                  onClick={onSwitchToLogin}
                >
                  Cancel and return to Login
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && (
            <div className="forgot-success-view">
              <div className="success-icon-circle">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h4 className="success-heading">Password Reset Complete</h4>
              <p className="success-description">
                Your password has been successfully updated for <strong>@{foundAccount?.username}</strong>. You can now log in using your new password.
              </p>

              <button
                type="button"
                className="form-submit-btn"
                onClick={onSwitchToLogin}
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordModal
