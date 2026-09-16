import { useState } from 'react'

function LoginModal({ isOpen, onClose, onSwitchToRegister, onSwitchToForgotPassword, role = 'student', onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({ username: false, password: false })
  const [loginError, setLoginError] = useState('')
  const [loginSuccess, setLoginSuccess] = useState('')

  const isAdmin = role === 'admin'
  const isAcademic = role === 'academic'
  const isIndustry = role === 'industries' || role === 'industry'

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (!isOpen) {
      setUsername('')
      setPassword('')
      setShowPassword(false)
      setTouched({ username: false, password: false })
      setLoginError('')
      setLoginSuccess('')
    }
  }

  if (!isOpen) return null

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setTouched({ username: true, password: true })

    if (!username.trim() || !password.trim()) {
      setLoginError('Please enter both username and password.')
      return
    }

    // For student login, synchronize active student account state
    if (!isAdmin && !isIndustry && !isAcademic) {
      try {
        const existingAccounts = JSON.parse(localStorage.getItem('udaan_registered_accounts') || '[]')
        const matched = existingAccounts.find(
          (a) => a.username.toLowerCase() === username.trim().toLowerCase() && a.role === 'student'
        )
        if (matched) {
          localStorage.setItem('udaan_active_student', JSON.stringify(matched))
          if (matched.verificationStatus) {
            localStorage.setItem('udaan_student_verification_status', matched.verificationStatus)
          }
        } else {
          const currentStatus = localStorage.getItem('udaan_student_verification_status') || 'unverified'
          const activeStudent = {
            name: username.trim(),
            username: username.trim(),
            email: '',
            phone: '',
            profilePic: null,
            institution: '',
            branch: '',
            course: '',
            semester: '',
            enrollmentId: '',
            verificationStatus: currentStatus,
          }
          localStorage.setItem('udaan_active_student', JSON.stringify(activeStudent))
        }
      } catch {}
    }

    setLoginError('')
    setLoginSuccess(
      isAdmin
        ? `Welcome, Administrator @${username.trim()}! Accessing Admin Console...`
        : isIndustry
        ? `Welcome, @${username.trim()}! Accessing Industry Portal...`
        : isAcademic
        ? `Welcome, @${username.trim()}! Accessing Academic Portal...`
        : `Welcome back, @${username.trim()}! Logging in...`
    )

    setTimeout(() => {
      setLoginSuccess('')
      onClose()
      if (!isAdmin && !isIndustry && !isAcademic && onLoginSuccess) {
        onLoginSuccess()
      }
    }, 1200)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top-accent"></div>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <span className="modal-role-pill">
              {isAdmin ? 'System Governance' : isIndustry ? 'Enterprise Gateway' : isAcademic ? 'Academic Institution' : 'STUDENT PORTAL'}
            </span>
            <h3 className={`modal-title ${isAdmin ? 'admin-login-title' : isIndustry ? 'industry-login-title' : isAcademic ? 'academic-login-title' : 'student-login-title'}`}>
              {isAdmin ? 'Admin Login' : isIndustry ? 'Industry Login' : isAcademic ? 'Academic Login' : 'Student Login'}
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

        {/* Modal Body / Login Form */}
        <div className="modal-body">
          <form className="access-form" onSubmit={handleLoginSubmit} noValidate>
            {loginError && (
              <div className="form-feedback-alert alert-error">
                <span>{loginError}</span>
              </div>
            )}
            {loginSuccess && (
              <div className="form-feedback-alert alert-success">
                <span>{loginSuccess}</span>
              </div>
            )}

            <div className="form-field">
              <label className="form-label" htmlFor="login-username">Username</label>
              <input
                id="login-username"
                type="text"
                className={`form-input ${touched.username && !username.trim() ? 'is-invalid' : ''}`}
                placeholder={isAdmin ? 'Enter administrator username' : isIndustry ? 'Enter corporate username' : isAcademic ? 'Enter institution username' : 'Enter your username'}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  if (!touched.username) setTouched({ ...touched, username: true })
                  if (loginError) setLoginError('')
                }}
                onBlur={() => setTouched({ ...touched, username: true })}
                required
              />
              {touched.username && !username.trim() && (
                <div className="form-feedback feedback-error">Username is required.</div>
              )}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="password-input-wrap">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${touched.password && !password.trim() ? 'is-invalid' : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (!touched.password) setTouched({ ...touched, password: true })
                    if (loginError) setLoginError('')
                  }}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
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
              {touched.password && !password.trim() && (
                <div className="form-feedback feedback-error">Password is required.</div>
              )}
              {onSwitchToForgotPassword && (
                <div className="forgot-password-row">
                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={onSwitchToForgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            <button type="submit" className="form-submit-btn">
              Log in
            </button>

            <div className="modal-switch-prompt student-login-switch">
              <button
                type="button"
                className="modal-switch-link student-register-link"
                onClick={onSwitchToRegister}
              >
                Create an account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
