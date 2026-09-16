import { useState, useEffect, useRef } from 'react'

export default function ChangePasswordModal({ isOpen, onClose, student, onPasswordChanged }) {
  const s = student || {}

  // Flow step: 'normal' | 'forgot_email' | 'forgot_otp' | 'forgot_new_password' | 'success'
  const [step, setStep] = useState('normal')

  // --- Normal Flow State ---
  const [currentPassword, setCurrentPassword] = useState('')
  const [normalNewPassword, setNormalNewPassword] = useState('')
  const [normalConfirmPassword, setNormalConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNormalNewPassword, setShowNormalNewPassword] = useState(false)
  const [showNormalConfirmPassword, setShowNormalConfirmPassword] = useState(false)
  const [normalErrors, setNormalErrors] = useState({})
  const [normalSubmitAttempted, setNormalSubmitAttempted] = useState(false)
  const [isVerifyingCurrent, setIsVerifyingCurrent] = useState(false)

  // --- Forgot Password Flow State ---
  const [mockOtp, setMockOtp] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [otpSuccessNotice, setOtpSuccessNotice] = useState('')
  const [timeLeft, setTimeLeft] = useState(120) // 120s = 02:00
  const [isOtpExpired, setIsOtpExpired] = useState(false)
  const timerRef = useRef(null)
  const otpInputRefs = useRef([])

  // Forgot Password - Set New Password Step
  const [resetNewPassword, setResetNewPassword] = useState('')
  const [resetConfirmPassword, setResetConfirmPassword] = useState('')
  const [showResetNewPassword, setShowResetNewPassword] = useState(false)
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false)
  const [resetErrors, setResetErrors] = useState({})
  const [resetSubmitAttempted, setResetSubmitAttempted] = useState(false)


  // Escape key handler for modal
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Timer cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  if (!isOpen) return null

  // --- Password Strength & Validation Helper ---
  const validatePasswordRules = (pwd) => {
    return {
      hasMinLen: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(pwd),
    }
  }

  const getPasswordStrength = (rules) => {
    const score = Object.values(rules).filter(Boolean).length
    if (score <= 2) return { score, label: 'Weak', color: '#ef4444', percent: 33 }
    if (score <= 4) return { score, label: 'Medium', color: '#f59e0b', percent: 66 }
    return { score, label: 'Strong', color: '#10b981', percent: 100 }
  }

  const normalRules = validatePasswordRules(normalNewPassword)
  const isNormalPasswordValid = Object.values(normalRules).every(Boolean)

  const resetRules = validatePasswordRules(resetNewPassword)
  const isResetPasswordValid = Object.values(resetRules).every(Boolean)

  // Timer Controller
  const startCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeLeft(120)
    setIsOtpExpired(false)
    setOtpError('')

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          timerRef.current = null
          setIsOtpExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // --- STEP 1: NORMAL PASSWORD CHANGE SUBMISSION ---
  const handleNormalSubmit = (e) => {
    e.preventDefault()
    setNormalSubmitAttempted(true)

    const errs = {}
    if (!currentPassword.trim()) {
      errs.currentPassword = 'Current password is required.'
    }
    if (!normalNewPassword) {
      errs.normalNewPassword = 'New password is required.'
    } else if (!isNormalPasswordValid) {
      errs.normalNewPassword = 'Password does not meet all security requirements.'
    }
    if (!normalConfirmPassword) {
      errs.normalConfirmPassword = 'Confirm password is required.'
    } else if (normalNewPassword !== normalConfirmPassword) {
      errs.normalConfirmPassword = 'Confirm password does not match new password.'
    }

    setNormalErrors(errs)
    if (Object.keys(errs).length > 0) return

    // Clearly Separated Verification State / API Ready Integration Point:
    // Future backend call: POST /api/student/change-password { currentPassword, newPassword }
    setIsVerifyingCurrent(true)

    setTimeout(() => {
      setIsVerifyingCurrent(false)

      // Test simulation check:
      // If student types "wrong" or "incorrect", simulate incorrect current password response
      if (
        currentPassword.trim().toLowerCase() === 'wrong' ||
        currentPassword.trim().toLowerCase() === 'incorrect'
      ) {
        setNormalErrors({ currentPassword: 'Current password is incorrect.' })
        return
      }

      // Backend Success Pathway:
      onPasswordChanged?.()
      setStep('success')
    }, 600)
  }

  // --- STEP 2: SEND OTP CODE TO REGISTERED EMAIL ---
  const handleSendOtp = () => {
    // Generate mock 6-digit OTP for frontend prototype
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setMockOtp(code)
    setOtpDigits(['', '', '', '', '', ''])
    setOtpError('')
    setOtpSuccessNotice(`A 6-digit verification code has been dispatched to ${s.email || 'your registered institutional email'}.`)
    startCountdown()
    setStep('forgot_otp')
  }

  // --- STEP 3: OTP DIGIT INPUT HANDLING ---
  const handleOtpDigitChange = (index, value) => {
    // Only accept numeric inputs
    const sanitized = value.replace(/\D/g, '')

    // Handle multi-character paste into any box
    if (sanitized.length > 1) {
      const pasted = sanitized.slice(0, 6).split('')
      const newDigits = [...otpDigits]
      pasted.forEach((char, idx) => {
        if (index + idx < 6) newDigits[index + idx] = char
      })
      setOtpDigits(newDigits)
      const nextFocusIdx = Math.min(index + pasted.length, 5)
      otpInputRefs.current[nextFocusIdx]?.focus()
      return
    }

    const newDigits = [...otpDigits]
    newDigits[index] = sanitized
    setOtpDigits(newDigits)
    setOtpError('')

    // Auto-advance to next box
    if (sanitized && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    const fullOtp = otpDigits.join('')

    if (fullOtp.length < 6) {
      setOtpError('Please enter the complete 6-digit verification code.')
      return
    }

    if (isOtpExpired) {
      setOtpError('This verification code has expired. Please request a new code.')
      return
    }

    // Isolated Mock OTP Verification Handler
    // Future backend call: POST /api/student/verify-otp { email: s.email, otp: fullOtp }
    if (fullOtp !== mockOtp) {
      setOtpError('Invalid verification code. Please try again.')
      return
    }

    // OTP Verified successfully! Stop timer and proceed to set new password
    if (timerRef.current) clearInterval(timerRef.current)
    setStep('forgot_new_password')
  }

  const handleResendOtp = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    const freshCode = Math.floor(100000 + Math.random() * 900000).toString()
    setMockOtp(freshCode)
    setOtpDigits(['', '', '', '', '', ''])
    setOtpError('')
    setOtpSuccessNotice(`A fresh verification code has been dispatched to ${s.email || 'your email'}.`)
    startCountdown()
    setTimeout(() => {
      otpInputRefs.current[0]?.focus()
    }, 50)
  }

  // --- STEP 4: FORGOT FLOW - CREATE NEW PASSWORD ---
  const handleResetSubmit = (e) => {
    e.preventDefault()
    setResetSubmitAttempted(true)

    const errs = {}
    if (!resetNewPassword) {
      errs.resetNewPassword = 'New password is required.'
    } else if (!isResetPasswordValid) {
      errs.resetNewPassword = 'Password does not meet all security requirements.'
    }
    if (!resetConfirmPassword) {
      errs.resetConfirmPassword = 'Confirm password is required.'
    } else if (resetNewPassword !== resetConfirmPassword) {
      errs.resetConfirmPassword = 'Confirm password does not match new password.'
    }

    setResetErrors(errs)
    if (Object.keys(errs).length > 0) return

    // Future backend call: POST /api/student/reset-password { email: s.email, newPassword: resetNewPassword }
    onPasswordChanged?.()
    setStep('success')
  }

  return (
    <div className="cp-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <style>{`
        .cp-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 29, 47, 0.72);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1300;
          padding: 20px;
          box-sizing: border-box;
          animation: cpFadeIn 0.16s ease-out;
        }

        .cp-modal-card {
          width: 100%;
          max-width: 500px;
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #d9d4c7;
          box-shadow: 0 24px 56px rgba(12, 24, 38, 0.32);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          box-sizing: border-box;
          animation: cpSlideUp 0.18s ease-out;
        }

        .cp-header {
          padding: 16px 22px;
          background: linear-gradient(135deg, #102437 0%, #1e3a5f 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid #b38e44;
          gap: 12px;
        }

        .cp-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cp-badge-icon {
          width: 38px;
          height: 38px;
          border-radius: 6px;
          background: rgba(179, 142, 68, 0.2);
          border: 1px solid rgba(179, 142, 68, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f5d78e;
          flex-shrink: 0;
        }

        .cp-header-title {
          font-size: 1.05rem;
          font-weight: 700;
          margin: 0 0 2px;
          color: #ffffff;
        }

        .cp-header-sub {
          font-size: 0.74rem;
          color: #cbd5e1;
          margin: 0;
        }

        .cp-close-btn {
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

        .cp-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
        }

        .cp-body {
          padding: 22px 24px;
          overflow-y: auto;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* Step Progress Indicators */
        .cp-step-trail {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1ece1;
        }

        .cp-step-trail-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #cbd5e1;
        }

        .cp-step-trail-dot.active {
          background: #b38e44;
          box-shadow: 0 0 0 3px rgba(179, 142, 68, 0.2);
        }

        /* Field Groups */
        .cp-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cp-field-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #112233;
        }

        /* Centered Forgot Password Link */
        .cp-forgot-pwd-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2px 0;
        }

        .cp-forgot-pwd-btn {
          background: transparent;
          border: none;
          color: #1e3a5f;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 10px;
          border-radius: 4px;
          text-decoration: underline;
          text-underline-offset: 3px;
          font-family: inherit;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1.4;
        }

        .cp-forgot-pwd-btn:hover {
          color: #b38e44;
          background: rgba(179, 142, 68, 0.08);
        }

        .cp-forgot-pwd-btn:focus-visible {
          outline: 2px solid #b38e44;
          outline-offset: 2px;
        }

        .cp-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .cp-input {
          width: 100%;
          padding: 10px 40px 10px 12px;
          font-size: 0.88rem;
          color: #0f1d2f;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 6px;
          box-sizing: border-box;
          font-family: inherit;
          transition: all 0.15s ease;
        }

        .cp-input:focus {
          outline: none;
          border-color: #1e3a5f;
          box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
        }

        .cp-input.has-error {
          border-color: #ef4444;
          background-color: #fef2f2;
        }

        .cp-toggle-eye-btn {
          position: absolute;
          right: 8px;
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .cp-toggle-eye-btn:hover {
          color: #0f1d2f;
        }

        .cp-field-error {
          font-size: 0.74rem;
          font-weight: 600;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Password Strength Bar & Requirements Checklist */
        .cp-strength-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cp-strength-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.74rem;
          font-weight: 700;
        }

        .cp-strength-track {
          width: 100%;
          height: 5px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .cp-strength-fill {
          height: 100%;
          transition: all 0.25s ease;
        }

        .cp-rules-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 12px;
          margin-top: 4px;
        }

        .cp-rule-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #64748b;
          transition: color 0.15s ease;
        }

        .cp-rule-item.valid {
          color: #166534;
        }

        .cp-rule-dot {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          flex-shrink: 0;
        }

        .cp-rule-item.valid .cp-rule-dot {
          background: #dcfce7;
          color: #166534;
        }

        /* Primary & Secondary Action Buttons */
        .cp-actions-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 6px;
        }

        .cp-btn-primary {
          background: #112233;
          color: #ffffff;
          border: none;
          font-size: 0.84rem;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.15s ease;
          box-shadow: 0 2px 6px rgba(17, 34, 51, 0.18);
        }

        .cp-btn-primary:hover:not(:disabled) {
          background: #1e3a5f;
          transform: translateY(-1px);
        }

        .cp-btn-primary:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .cp-btn-secondary {
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #cbd5e1;
          font-size: 0.84rem;
          font-weight: 600;
          padding: 9px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cp-btn-secondary:hover {
          background: #e2e8f0;
          color: #0f1d2f;
        }

        /* 6-Digit OTP Box Grid */
        .cp-otp-box-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 10px 0 4px;
        }

        .cp-otp-digit-input {
          width: 46px;
          height: 52px;
          font-size: 1.4rem;
          font-weight: 800;
          text-align: center;
          color: #0f1d2f;
          background: #ffffff;
          border: 2px solid #cbd5e1;
          border-radius: 6px;
          box-sizing: border-box;
          font-family: monospace;
          transition: all 0.15s ease;
        }

        .cp-otp-digit-input:focus {
          outline: none;
          border-color: #b38e44;
          box-shadow: 0 0 0 3px rgba(179, 142, 68, 0.2);
          background: #fffdfa;
        }

        .cp-otp-digit-input.is-expired {
          border-color: #fca5a5;
          background-color: #fef2f2;
          color: #991b1b;
        }

        .cp-timer-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #1e3a5f;
          background: #f0f7f8;
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid #cce4e7;
          margin: 0 auto;
        }

        .cp-timer-badge.expired {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }

        .cp-demo-otp-banner {
          background: #fefce8;
          border: 1px dashed #ca8a04;
          border-radius: 6px;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 3px;
          font-size: 0.74rem;
          color: #854d0e;
        }

        .cp-demo-otp-pill {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #a16207;
        }

        .cp-demo-otp-code {
          font-family: monospace;
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: #713f12;
        }

        .cp-info-callout {
          background: #f8fafc;
          border-left: 4px solid #1e3a5f;
          border-radius: 4px;
          padding: 10px 14px;
          font-size: 0.78rem;
          color: #334155;
          line-height: 1.45;
        }

        .cp-read-only-email-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          padding: 10px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
        }

        /* Success State */
        .cp-success-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 14px;
          padding: 10px 8px;
        }

        .cp-success-icon-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #ecfdf5;
          border: 2px solid #86efac;
          color: #16a34a;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(22, 163, 74, 0.15);
        }

        .cp-success-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f1f2e;
          margin: 0;
        }

        .cp-success-desc {
          font-size: 0.84rem;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
          max-width: 380px;
        }

        .cp-security-email-notice {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 0.75rem;
          color: #166534;
          line-height: 1.4;
          text-align: left;
          width: 100%;
          box-sizing: border-box;
        }

        @keyframes cpFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes cpSlideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 480px) {
          .cp-modal-card {
            max-width: 100%;
          }
          .cp-body {
            padding: 18px 16px;
          }
          .cp-otp-digit-input {
            width: 38px;
            height: 46px;
            font-size: 1.2rem;
          }
          .cp-rules-grid {
            grid-template-columns: 1fr;
          }
          .cp-actions-row {
            flex-direction: column-reverse;
          }
          .cp-btn-primary,
          .cp-btn-secondary {
            width: 100%;
          }
        }
      `}</style>

      <div className="cp-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="cp-header">
          <div className="cp-title-group">
            <div className="cp-badge-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h3 className="cp-header-title">
                {step === 'normal' && 'Change Account Password'}
                {step === 'forgot_email' && 'Verify Registered Email'}
                {step === 'forgot_otp' && 'Enter Verification Code'}
                {step === 'forgot_new_password' && 'Set New Password'}
                {step === 'success' && 'Password Updated'}
              </h3>
              <p className="cp-header-sub">
                {step === 'normal' && 'Update your institutional portal credentials'}
                {step === 'forgot_email' && 'Step 1 of 3: Identity Confirmation'}
                {step === 'forgot_otp' && 'Step 2 of 3: Enter 6-digit OTP'}
                {step === 'forgot_new_password' && 'Step 3 of 3: Create strong password'}
                {step === 'success' && 'Security credentials refreshed successfully'}
              </p>
            </div>
          </div>

          <button type="button" className="cp-close-btn" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="cp-body">
          {/* STEP 1: NORMAL PASSWORD CHANGE FORM */}
          {step === 'normal' && (
            <form onSubmit={handleNormalSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Current Password Field */}
              <div className="cp-field-group">
                <label className="cp-field-label" htmlFor="cp-current-pwd">
                  Current Password *
                </label>
                <div className="cp-input-wrap">
                  <input
                    id="cp-current-pwd"
                    type={showCurrentPassword ? 'text' : 'password'}
                    className={`cp-input ${normalSubmitAttempted && normalErrors.currentPassword ? 'has-error' : ''}`}
                    placeholder="Enter existing password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value)
                      if (normalErrors.currentPassword) {
                        setNormalErrors((prev) => ({ ...prev, currentPassword: null }))
                      }
                    }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="cp-toggle-eye-btn"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    title={showCurrentPassword ? 'Hide password' : 'Show password'}
                    aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {normalSubmitAttempted && normalErrors.currentPassword && (
                  <span className="cp-field-error">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{normalErrors.currentPassword}</span>
                  </span>
                )}
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  (Tip: Enter any password to succeed, or type &quot;wrong&quot; to test verification error)
                </span>
              </div>

              {/* New Password Field */}
              <div className="cp-field-group">
                <label className="cp-field-label" htmlFor="cp-normal-new-pwd">
                  New Password *
                </label>
                <div className="cp-input-wrap">
                  <input
                    id="cp-normal-new-pwd"
                    type={showNormalNewPassword ? 'text' : 'password'}
                    className={`cp-input ${normalSubmitAttempted && normalErrors.normalNewPassword ? 'has-error' : ''}`}
                    placeholder="Create strong new password"
                    value={normalNewPassword}
                    onChange={(e) => {
                      setNormalNewPassword(e.target.value)
                      if (normalErrors.normalNewPassword) {
                        setNormalErrors((prev) => ({ ...prev, normalNewPassword: null }))
                      }
                    }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="cp-toggle-eye-btn"
                    onClick={() => setShowNormalNewPassword(!showNormalNewPassword)}
                    title={showNormalNewPassword ? 'Hide password' : 'Show password'}
                    aria-label={showNormalNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNormalNewPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                {normalSubmitAttempted && normalErrors.normalNewPassword && (
                  <span className="cp-field-error">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{normalErrors.normalNewPassword}</span>
                  </span>
                )}

                {/* Password Strength Indicator & Real-Time Rule Checklist */}
                {normalNewPassword && (
                  <div className="cp-strength-card">
                    <div className="cp-strength-header">
                      <span>Password Strength:</span>
                      <span style={{ color: getPasswordStrength(normalRules).color }}>
                        {getPasswordStrength(normalRules).label}
                      </span>
                    </div>
                    <div className="cp-strength-track">
                      <div
                        className="cp-strength-fill"
                        style={{
                          width: `${getPasswordStrength(normalRules).percent}%`,
                          backgroundColor: getPasswordStrength(normalRules).color,
                        }}
                      />
                    </div>
                    <div className="cp-rules-grid">
                      <div className={`cp-rule-item ${normalRules.hasMinLen ? 'valid' : ''}`}>
                        <span className="cp-rule-dot">{normalRules.hasMinLen ? '✓' : '•'}</span>
                        <span>8+ characters</span>
                      </div>
                      <div className={`cp-rule-item ${normalRules.hasUpper ? 'valid' : ''}`}>
                        <span className="cp-rule-dot">{normalRules.hasUpper ? '✓' : '•'}</span>
                        <span>1 uppercase letter (A-Z)</span>
                      </div>
                      <div className={`cp-rule-item ${normalRules.hasLower ? 'valid' : ''}`}>
                        <span className="cp-rule-dot">{normalRules.hasLower ? '✓' : '•'}</span>
                        <span>1 lowercase letter (a-z)</span>
                      </div>
                      <div className={`cp-rule-item ${normalRules.hasNumber ? 'valid' : ''}`}>
                        <span className="cp-rule-dot">{normalRules.hasNumber ? '✓' : '•'}</span>
                        <span>1 number (0-9)</span>
                      </div>
                      <div className={`cp-rule-item ${normalRules.hasSpecial ? 'valid' : ''}`} style={{ gridColumn: 'span 2' }}>
                        <span className="cp-rule-dot">{normalRules.hasSpecial ? '✓' : '•'}</span>
                        <span>1 special symbol (!@#$%^&*)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password Field */}
              <div className="cp-field-group">
                <label className="cp-field-label" htmlFor="cp-normal-confirm-pwd">
                  Confirm New Password *
                </label>
                <div className="cp-input-wrap">
                  <input
                    id="cp-normal-confirm-pwd"
                    type={showNormalConfirmPassword ? 'text' : 'password'}
                    className={`cp-input ${normalSubmitAttempted && normalErrors.normalConfirmPassword ? 'has-error' : ''}`}
                    placeholder="Re-enter new password"
                    value={normalConfirmPassword}
                    onChange={(e) => {
                      setNormalConfirmPassword(e.target.value)
                      if (normalErrors.normalConfirmPassword) {
                        setNormalErrors((prev) => ({ ...prev, normalConfirmPassword: null }))
                      }
                    }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="cp-toggle-eye-btn"
                    onClick={() => setShowNormalConfirmPassword(!showNormalConfirmPassword)}
                    title={showNormalConfirmPassword ? 'Hide password' : 'Show password'}
                    aria-label={showNormalConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNormalConfirmPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {normalSubmitAttempted && normalErrors.normalConfirmPassword && (
                  <span className="cp-field-error">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{normalErrors.normalConfirmPassword}</span>
                  </span>
                )}
              </div>

              {/* Centered Forgot Password Link */}
              <div className="cp-forgot-pwd-wrap">
                <button
                  type="button"
                  className="cp-forgot-pwd-btn"
                  onClick={() => {
                    setStep('forgot_email')
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="cp-actions-row">
                <button type="button" className="cp-btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="cp-btn-primary" disabled={isVerifyingCurrent}>
                  {isVerifyingCurrent ? (
                    <>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Update Password</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: FORGOT PASSWORD - REGISTERED EMAIL CONFIRMATION */}
          {step === 'forgot_email' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="cp-step-trail">
                <span>Step 1: Email Confirmation</span>
                <span className="cp-step-trail-dot active" />
                <span className="cp-step-trail-dot" />
                <span className="cp-step-trail-dot" />
              </div>

              <div className="cp-info-callout">
                To protect your academic and placement records, a secure 6-digit verification code will be sent to your registered institutional email address.
              </div>

              <div className="cp-field-group">
                <label className="cp-field-label">
                  Registered Institutional Email
                </label>
                <div className="cp-read-only-email-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>{s.email || 'Not available yet'}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#64748b' }}>Verified</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Institutional policy prevents sending OTP codes to unverified alternate email addresses.
                </span>
              </div>

              <div className="cp-actions-row">
                <button
                  type="button"
                  className="cp-btn-secondary"
                  onClick={() => setStep('normal')}
                >
                  ← Back to Password Change
                </button>
                <button
                  type="button"
                  className="cp-btn-primary"
                  onClick={handleSendOtp}
                >
                  <span>Send Verification Code</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FORGOT PASSWORD - 6-DIGIT OTP VERIFICATION */}
          {step === 'forgot_otp' && (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="cp-step-trail">
                <span>Step 2: OTP Verification</span>
                <span className="cp-step-trail-dot" />
                <span className="cp-step-trail-dot active" />
                <span className="cp-step-trail-dot" />
              </div>

              {otpSuccessNotice && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: '0.78rem', padding: '8px 12px', borderRadius: '5px' }}>
                  ✓ {otpSuccessNotice}
                </div>
              )}

              {/* Demo Test Helper Banner */}
              <div className="cp-demo-otp-banner">
                <div className="cp-demo-otp-pill">⚡ Prototype Verification Code</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="cp-demo-otp-code">{mockOtp}</span>
                  <button
                    type="button"
                    style={{ background: '#eab308', border: 'none', color: '#ffffff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}
                    onClick={() => {
                      setOtpDigits(mockOtp.split(''))
                      setOtpError('')
                    }}
                  >
                    Auto-Fill OTP
                  </button>
                </div>
                <span style={{ fontSize: '0.7rem' }}>
                  In production, this code is emailed via institutional SMTP.
                </span>
              </div>

              {/* 6 Individual Digit Inputs */}
              <div className="cp-field-group" style={{ alignItems: 'center' }}>
                <label className="cp-field-label" style={{ marginBottom: 4 }}>
                  Enter 6-Digit Verification Code
                </label>
                <div className="cp-otp-box-row">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      className={`cp-otp-digit-input ${isOtpExpired ? 'is-expired' : ''}`}
                      value={digit}
                      disabled={isOtpExpired}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                {/* 02:00 Countdown Timer */}
                <div className={`cp-timer-badge ${isOtpExpired ? 'expired' : ''}`}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>
                    {isOtpExpired
                      ? 'Code Expired (00:00)'
                      : `Expires in ${formatTimer(timeLeft)}`}
                  </span>
                </div>

                {otpError && (
                  <span className="cp-field-error" style={{ marginTop: 6, justifyContent: 'center' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{otpError}</span>
                  </span>
                )}
              </div>

              {/* Expired State Notice & Resend Button */}
              {isOtpExpired && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '10px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: '0.78rem', color: '#991b1b', fontWeight: 600 }}>
                    This verification code has expired. Please request a new code.
                  </span>
                  <button
                    type="button"
                    style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', alignSelf: 'center' }}
                    onClick={handleResendOtp}
                  >
                    ↻ Resend Code (Restart 02:00 Timer)
                  </button>
                </div>
              )}

              {!isOtpExpired && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: -4 }}>
                  <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', color: '#1e3a5f', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={handleResendOtp}
                  >
                    Didn&apos;t receive code? Resend Code
                  </button>
                </div>
              )}

              <div className="cp-actions-row">
                <button
                  type="button"
                  className="cp-btn-secondary"
                  onClick={() => {
                    if (timerRef.current) clearInterval(timerRef.current)
                    setStep('forgot_email')
                  }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="cp-btn-primary"
                  disabled={isOtpExpired || otpDigits.join('').length < 6}
                >
                  <span>Verify Code</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: FORGOT FLOW - CREATE NEW PASSWORD */}
          {step === 'forgot_new_password' && (
            <form onSubmit={handleResetSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="cp-step-trail">
                <span>Step 3: Set New Password</span>
                <span className="cp-step-trail-dot" />
                <span className="cp-step-trail-dot" />
                <span className="cp-step-trail-dot active" />
              </div>

              <div className="cp-info-callout" style={{ borderLeftColor: '#16a34a' }}>
                Identity verified successfully! Please enter your new password below.
              </div>

              {/* New Password */}
              <div className="cp-field-group">
                <label className="cp-field-label" htmlFor="cp-reset-new-pwd">
                  New Password *
                </label>
                <div className="cp-input-wrap">
                  <input
                    id="cp-reset-new-pwd"
                    type={showResetNewPassword ? 'text' : 'password'}
                    className={`cp-input ${resetSubmitAttempted && resetErrors.resetNewPassword ? 'has-error' : ''}`}
                    placeholder="Create strong new password"
                    value={resetNewPassword}
                    onChange={(e) => {
                      setResetNewPassword(e.target.value)
                      if (resetErrors.resetNewPassword) {
                        setResetErrors((prev) => ({ ...prev, resetNewPassword: null }))
                      }
                    }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="cp-toggle-eye-btn"
                    onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                    title={showResetNewPassword ? 'Hide password' : 'Show password'}
                    aria-label={showResetNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showResetNewPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                {resetSubmitAttempted && resetErrors.resetNewPassword && (
                  <span className="cp-field-error">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{resetErrors.resetNewPassword}</span>
                  </span>
                )}

                {/* Live Password Strength & Checklist */}
                {resetNewPassword && (
                  <div className="cp-strength-card">
                    <div className="cp-strength-header">
                      <span>Password Strength:</span>
                      <span style={{ color: getPasswordStrength(resetRules).color }}>
                        {getPasswordStrength(resetRules).label}
                      </span>
                    </div>
                    <div className="cp-strength-track">
                      <div
                        className="cp-strength-fill"
                        style={{
                          width: `${getPasswordStrength(resetRules).percent}%`,
                          backgroundColor: getPasswordStrength(resetRules).color,
                        }}
                      />
                    </div>
                    <div className="cp-rules-grid">
                      <div className={`cp-rule-item ${resetRules.hasMinLen ? 'valid' : ''}`}>
                        <span className="cp-rule-dot">{resetRules.hasMinLen ? '✓' : '•'}</span>
                        <span>8+ characters</span>
                      </div>
                      <div className={`cp-rule-item ${resetRules.hasUpper ? 'valid' : ''}`}>
                        <span className="cp-rule-dot">{resetRules.hasUpper ? '✓' : '•'}</span>
                        <span>1 uppercase letter (A-Z)</span>
                      </div>
                      <div className={`cp-rule-item ${resetRules.hasLower ? 'valid' : ''}`}>
                        <span className="cp-rule-dot">{resetRules.hasLower ? '✓' : '•'}</span>
                        <span>1 lowercase letter (a-z)</span>
                      </div>
                      <div className={`cp-rule-item ${resetRules.hasNumber ? 'valid' : ''}`}>
                        <span className="cp-rule-dot">{resetRules.hasNumber ? '✓' : '•'}</span>
                        <span>1 number (0-9)</span>
                      </div>
                      <div className={`cp-rule-item ${resetRules.hasSpecial ? 'valid' : ''}`} style={{ gridColumn: 'span 2' }}>
                        <span className="cp-rule-dot">{resetRules.hasSpecial ? '✓' : '•'}</span>
                        <span>1 special symbol (!@#$%^&*)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="cp-field-group">
                <label className="cp-field-label" htmlFor="cp-reset-confirm-pwd">
                  Confirm New Password *
                </label>
                <div className="cp-input-wrap">
                  <input
                    id="cp-reset-confirm-pwd"
                    type={showResetConfirmPassword ? 'text' : 'password'}
                    className={`cp-input ${resetSubmitAttempted && resetErrors.resetConfirmPassword ? 'has-error' : ''}`}
                    placeholder="Re-enter new password"
                    value={resetConfirmPassword}
                    onChange={(e) => {
                      setResetConfirmPassword(e.target.value)
                      if (resetErrors.resetConfirmPassword) {
                        setResetErrors((prev) => ({ ...prev, resetConfirmPassword: null }))
                      }
                    }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="cp-toggle-eye-btn"
                    onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                    title={showResetConfirmPassword ? 'Hide password' : 'Show password'}
                    aria-label={showResetConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showResetConfirmPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {resetSubmitAttempted && resetErrors.resetConfirmPassword && (
                  <span className="cp-field-error">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{resetErrors.resetConfirmPassword}</span>
                  </span>
                )}
              </div>

              <div className="cp-actions-row">
                <button
                  type="button"
                  className="cp-btn-secondary"
                  onClick={() => setStep('forgot_otp')}
                >
                  ← Back to OTP
                </button>
                <button type="submit" className="cp-btn-primary">
                  <span>Set New Password</span>
                  <span>✓</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: SUCCESS STATE */}
          {step === 'success' && (
            <div className="cp-success-screen">
              <div className="cp-success-icon-circle">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h4 className="cp-success-title">Password Changed Successfully</h4>
              <p className="cp-success-desc">
                Your student account password has been updated securely. You can now use your new credentials for all future sessions across the Udaan Portal.
              </p>

              {/* Prepared Architecture Integration Point for Security Email */}
              <div className="cp-security-email-notice">
                <div style={{ fontWeight: 700, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>🔒 Security Dispatch Logged</span>
                </div>
                <div>
                  A security notification has been scheduled for delivery to <strong>{s.email || 'your registered institutional email'}</strong>.
                </div>
              </div>

              <div style={{ width: '100%', marginTop: 8 }}>
                <button
                  type="button"
                  className="cp-btn-primary"
                  style={{ width: '100%' }}
                  onClick={onClose}
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
