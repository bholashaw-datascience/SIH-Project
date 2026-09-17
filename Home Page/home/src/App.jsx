import React, { useEffect, useRef, useState } from "react";
import {
  GraduationCap,
  Building2,
  Users,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Link2,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  X,
  ImagePlus,
  KeyRound,
  Send,
} from "lucide-react";

//Shared design tokens
const colors = {
  harbor: "#16233F",
  steel: "#3D5A80",
  ink: "#101826",
  slate: "#5B6472",
  mist: "#F3F5F7",
  line: "#E2E6EC",
  signal: "#D98E2B",
  signalDark: "#B5721C",
  danger: "#C0402C",
  white: "#FFFFFF",
};

const roles = [
  {
    key: "academia",
    label: "Academic Institutions",
    loginTitle: "Log in here as an Academic Institution",
    registerTitle: "Register here as an Academic Institution",
    nameLabel: "Institution Name",
    desc: "Publish curricula, track student skill gaps, and connect classrooms to real industry demand.",
    icon: GraduationCap,
    canRegister: true,
  },
  {
    key: "industry",
    label: "Industries",
    loginTitle: "Log in here as an Industry Partner",
    registerTitle: "Register here as an Industry Partner",
    nameLabel: "Company Name",
    desc: "Post internships and openings, define required skills, and discover job-ready talent early.",
    icon: Building2,
    canRegister: true,
  },
  {
    key: "students",
    label: "Students",
    loginTitle: "Log in here as a Student",
    registerTitle: "Register here as Student",
    nameLabel: "Student Name",
    desc: "Map your skills, apply for internships, and follow a clear path from coursework to career.",
    icon: Users,
    canRegister: true,
  },
  {
    key: "admin",
    label: "Portal Admin",
    loginTitle: "Log in here as a Portal Admin",
    registerTitle: null,
    nameLabel: null,
    desc: "Oversee institutions, verify listings, and monitor placement outcomes across the network.",
    icon: ShieldCheck,
    canRegister: false,
  },
];

// Auth modal 
function AuthModal({ role, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState("login"); // 'login' | 'register'
  const [switching, setSwitching] = useState(false);

  // login fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // register fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // reset-password fields
  const [resetUsername, setResetUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const firstFieldRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    const t2 = setTimeout(() => firstFieldRef.current?.focus(), 260);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleClose = () => {
    setMounted(false);
    setTimeout(onClose, 200);
  };

  const switchView = (next) => {
    setErrors({});
    setSwitching(true);
    setTimeout(() => {
      setView(next);
      setSwitching(false);
      setTimeout(() => firstFieldRef.current?.focus(), 180);
    }, 160);
  };

  const validateLogin = () => {
    const next = {};
    if (!username.trim()) next.username = "Enter your username.";
    if (!password) next.password = "Enter your password.";
    return next;
  };

  const validateRegister = () => {
    const next = {};
    if (!fullName.trim()) next.fullName = "This field is required.";
    if (!email.trim()) next.email = "Enter an email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (!phone.trim()) next.phone = "Enter a phone number.";
    if (!regUsername.trim()) next.regUsername = "Choose a username.";
    if (!regPassword) next.regPassword = "Create a password.";
    else if (regPassword.length < 6) next.regPassword = "Use at least 6 characters.";
    if (confirmPassword !== regPassword || !confirmPassword) next.confirmPassword = "Passwords do not match.";
    return next;
  };

  const validateReset = () => {
    const next = {};
    if (!resetUsername.trim()) next.resetUsername = "Enter your username.";
    if (!otpSent) next.otp = "Send yourself an OTP first.";
    else if (!otp.trim()) next.otp = "Enter the OTP sent to your email.";
    else if (!/^\d{4,6}$/.test(otp.trim())) next.otp = "Enter the numeric OTP you received.";
    if (!newPassword) next.newPassword = "Create a new password.";
    else if (newPassword.length < 6) next.newPassword = "Use at least 6 characters.";
    if (confirmNewPassword !== newPassword || !confirmNewPassword) next.confirmNewPassword = "Passwords do not match.";
    return next;
  };

  const handleSendOtp = () => {
    if (!resetUsername.trim()) {
      setErrors((prev) => ({ ...prev, resetUsername: "Enter your username first." }));
      return;
    }
    setErrors((prev) => ({ ...prev, resetUsername: undefined, otp: undefined }));
    setOtpSent(true);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const next = validateLogin();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 1200);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const next = validateRegister();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 1200);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    const next = validateReset();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      switchView("login");
    }, 1200);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const clearField = (key) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const Icon = role.icon;
  const isRegister = view === "register";
  const isReset = view === "reset";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8">
      <div
        className="overlay-in fixed inset-0"
        style={{ background: "rgba(16, 24, 38, 0.55)" }}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className={`relative z-10 my-auto w-full max-w-sm overflow-hidden rounded-2xl border ${mounted ? "dialog-in" : "dialog-out"}`}
        style={{ background: colors.white, borderColor: colors.line }}
      >
        {/* Header */}
        <div
          className="relative px-6 py-7 text-center sm:px-8"
          style={{ background: `linear-gradient(135deg, ${colors.harbor} 0%, ${colors.steel} 100%)` }}
        >
          {(isRegister || isReset) && (
            <button
              type="button"
              onClick={() => switchView("login")}
              aria-label="Back to log in"
              className="close-btn absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-200"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="close-btn absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-200"
          >
            <X size={16} />
          </button>
          <span
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            {isReset ? (
              <KeyRound size={24} style={{ color: colors.signal }} aria-hidden="true" />
            ) : (
              <Icon size={24} style={{ color: colors.signal }} aria-hidden="true" />
            )}
          </span>
          <h2
            id="auth-title"
            className="text-lg font-bold text-white sm:text-xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {isRegister ? role.registerTitle : isReset ? "Reset Your Password" : role.loginTitle}
          </h2>
        </div>

        {/* Body */}
        <div className={`px-6 py-6 sm:px-8 ${switching ? "view-out" : "view-in"}`}>
          {view === "login" ? (
            <form onSubmit={handleLoginSubmit} noValidate>
              <div className="mb-4">
                <label htmlFor="username" className="mb-1.5 block text-xs font-medium uppercase tracking-wide" style={{ color: colors.slate }}>
                  Username
                </label>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.slate }} aria-hidden="true" />
                  <input
                    ref={firstFieldRef}
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="e.g. jane.doe"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      clearField("username");
                    }}
                    aria-invalid={!!errors.username}
                    className={`field-input w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm ${errors.username ? "has-error field-error" : ""}`}
                    style={{ borderColor: errors.username ? colors.danger : colors.line, color: colors.ink }}
                  />
                </div>
                {errors.username && <p className="mt-1 text-xs" style={{ color: colors.danger }}>{errors.username}</p>}
              </div>

              <div className="mb-5">
                <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-wide" style={{ color: colors.slate }}>
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.slate }} aria-hidden="true" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearField("password");
                    }}
                    aria-invalid={!!errors.password}
                    className={`field-input w-full rounded-lg border py-2.5 pl-9 pr-9 text-sm ${errors.password ? "has-error field-error" : ""}`}
                    style={{ borderColor: errors.password ? colors.danger : colors.line, color: colors.ink }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2"
                    style={{ color: colors.slate }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs" style={{ color: colors.danger }}>{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="submit-btn flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-70"
                style={{ background: colors.signal, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {submitting ? "Logging in..." : "Log in"}
                {!submitting && <ArrowRight size={15} aria-hidden="true" />}
              </button>

              <p className="mt-3 text-center text-sm">
                <button
                  type="button"
                  onClick={() => switchView("reset")}
                  className="register-link font-medium underline-offset-2 hover:underline"
                  style={{ color: colors.slate }}
                >
                  Forgot password?
                </button>
              </p>

              {role.canRegister && (
                <p className="mt-2 text-center text-sm" style={{ color: colors.slate }}>
                  New here?{" "}
                  <button
                    type="button"
                    onClick={() => switchView("register")}
                    className="register-link font-medium underline-offset-2 hover:underline"
                    style={{ color: colors.steel }}
                  >
                    Register if not registered yet
                  </button>
                </p>
              )}
            </form>
          ) : view === "register" ? (
            <form onSubmit={handleRegisterSubmit} noValidate>
              {/* Profile picture upload */}
              <div className="mb-5 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="avatar-btn relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed"
                  style={{ borderColor: colors.line, background: colors.mist }}
                  aria-label="Upload profile picture"
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlus size={22} style={{ color: colors.slate }} aria-hidden="true" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <span className="mt-2 text-xs" style={{ color: colors.slate }}>
                  Upload profile picture
                </span>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label htmlFor="fullName" className="mb-1.5 block text-xs font-medium uppercase tracking-wide" style={{ color: colors.slate }}>
                  {role.nameLabel}
                </label>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.slate }} aria-hidden="true" />
                  <input
                    ref={firstFieldRef}
                    id="fullName"
                    type="text"
                    placeholder={role.nameLabel}
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      clearField("fullName");
                    }}
                    aria-invalid={!!errors.fullName}
                    className={`field-input w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm ${errors.fullName ? "has-error field-error" : ""}`}
                    style={{ borderColor: errors.fullName ? colors.danger : colors.line, color: colors.ink }}
                  />
                </div>
                {errors.fullName && <p className="mt-1 text-xs" style={{ color: colors.danger }}>{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wide" style={{ color: colors.slate }}>
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.slate }} aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearField("email");
                    }}
                    aria-invalid={!!errors.email}
                    className={`field-input w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm ${errors.email ? "has-error field-error" : ""}`}
                    style={{ borderColor: errors.email ? colors.danger : colors.line, color: colors.ink }}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs" style={{ color: colors.danger }}>{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label htmlFor="phone" className="mb-1.5 block text-xs font-medium uppercase tracking-wide" style={{ color: colors.slate }}>
                  Phone
                </label>
                <div className="relative">
                  <Phone size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.slate }} aria-hidden="true" />
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      clearField("phone");
                    }}
                    aria-invalid={!!errors.phone}
                    className={`field-input w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm ${errors.phone ? "has-error field-error" : ""}`}
                    style={{ borderColor: errors.phone ? colors.danger : colors.line, color: colors.ink }}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs" style={{ color: colors.danger }}>{errors.phone}</p>}
              </div>

              {/* Username */}
              <div className="mb-4">
                <label htmlFor="regUsername" className="mb-1.5 block text-xs font-medium uppercase tracking-wide" style={{ color: colors.slate }}>
                  Username
                </label>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.slate }} aria-hidden="true" />
                  <input
                    id="regUsername"
                    type="text"
                    autoComplete="username"
                    placeholder="Choose a username"
                    value={regUsername}
                    onChange={(e) => {
                      setRegUsername(e.target.value);
                      clearField("regUsername");
                    }}
                    aria-invalid={!!errors.regUsername}
                    className={`field-input w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm ${errors.regUsername ? "has-error field-error" : ""}`}
                    style={{ borderColor: errors.regUsername ? colors.danger : colors.line, color: colors.ink }}
                  />
                </div>
                {errors.regUsername && <p className="mt-1 text-xs" style={{ color: colors.danger }}>{errors.regUsername}</p>}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="regPassword" className="mb-1.5 block text-xs font-medium uppercase tracking-wide" style={{ color: colors.slate }}>
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.slate }} aria-hidden="true" />
                  <input
                    id="regPassword"
                    type={showRegPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      clearField("regPassword");
                    }}
                    aria-invalid={!!errors.regPassword}
                    className={`field-input w-full rounded-lg border py-2.5 pl-9 pr-9 text-sm ${errors.regPassword ? "has-error field-error" : ""}`}
                    style={{ borderColor: errors.regPassword ? colors.danger : colors.line, color: colors.ink }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword((s) => !s)}
                    aria-label={showRegPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2"
                    style={{ color: colors.slate }}
                  >
                    {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.regPassword && <p className="mt-1 text-xs" style={{ color: colors.danger }}>{errors.regPassword}</p>}
              </div>

              {/* Confirm Password */}
              <div className="mb-5">
                <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-medium uppercase tracking-wide" style={{ color: colors.slate }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.slate }} aria-hidden="true" />
                  <input
                    id="confirmPassword"
                    type={showRegPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearField("confirmPassword");
                    }}
                    aria-invalid={!!errors.confirmPassword}
                    className={`field-input w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm ${errors.confirmPassword ? "has-error field-error" : ""}`}
                    style={{ borderColor: errors.confirmPassword ? colors.danger : colors.line, color: colors.ink }}
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs" style={{ color: colors.danger }}>{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="submit-btn flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-70"
                style={{ background: colors.signal, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {submitting ? "Creating account..." : "Register"}
                {!submitting && <ArrowRight size={15} aria-hidden="true" />}
              </button>

              <p className="mt-5 text-center text-sm" style={{ color: colors.slate }}>
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => switchView("login")}
                  className="register-link font-medium underline-offset-2 hover:underline"
                  style={{ color: colors.steel }}
                >
                  Log in
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit} noValidate>
              {/* Username */}
              <div className="mb-4">
                <label htmlFor="resetUsername" className="mb-1.5 block text-xs font-medium uppercase tracking-wide" style={{ color: colors.slate }}>
                  Username
                </label>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.slate }} aria-hidden="true" />
                  <input
                    ref={firstFieldRef}
                    id="resetUsername"
                    type="text"
                    autoComplete="username"
                    placeholder="e.g. jane.doe"
                    value={resetUsername}
                    onChange={(e) => {
                      setResetUsername(e.target.value);
                      clearField("resetUsername");
                      if (otpSent) setOtpSent(false);
                    }}
                    aria-invalid={!!errors.resetUsername}
                    className={`field-input w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm ${errors.resetUsername ? "has-error field-error" : ""}`}
                    style={{ borderColor: errors.resetUsername ? colors.danger : colors.line, color: colors.ink }}
                  />
                </div>
                {errors.resetUsername && <p className="mt-1 text-xs" style={{ color: colors.danger }}>{errors.resetUsername}</p>}
              </div>

              {/* OTP */}
              <div className="mb-4">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <label htmlFor="otp" className="block text-xs font-medium uppercase tracking-wide" style={{ color: colors.slate }}>
                    Enter the OTP sent to your Email
                  </label>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="register-link flex shrink-0 items-center gap-1 text-xs font-medium"
                    style={{ color: colors.steel }}
                  >
                    <Send size={12} aria-hidden="true" />
                    {otpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </div>
                <div className="relative">
                  <KeyRound size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.slate }} aria-hidden="true" />
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder={otpSent ? "Enter the 6-digit code" : "Send OTP to enable this field"}
                    value={otp}
                    disabled={!otpSent}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      clearField("otp");
                    }}
                    aria-invalid={!!errors.otp}
                    className={`field-input w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm disabled:opacity-60 ${errors.otp ? "has-error field-error" : ""}`}
                    style={{ borderColor: errors.otp ? colors.danger : colors.line, color: colors.ink }}
                  />
                </div>
                {otpSent && !errors.otp && (
                  <p className="mt-1 text-xs" style={{ color: colors.steel }}>
                    A one-time code has been sent to your registered email.
                  </p>
                )}
                {errors.otp && <p className="mt-1 text-xs" style={{ color: colors.danger }}>{errors.otp}</p>}
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label htmlFor="newPassword" className="mb-1.5 block text-xs font-medium uppercase tracking-wide" style={{ color: colors.slate }}>
                  New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.slate }} aria-hidden="true" />
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      clearField("newPassword");
                    }}
                    aria-invalid={!!errors.newPassword}
                    className={`field-input w-full rounded-lg border py-2.5 pl-9 pr-9 text-sm ${errors.newPassword ? "has-error field-error" : ""}`}
                    style={{ borderColor: errors.newPassword ? colors.danger : colors.line, color: colors.ink }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((s) => !s)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2"
                    style={{ color: colors.slate }}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.newPassword && <p className="mt-1 text-xs" style={{ color: colors.danger }}>{errors.newPassword}</p>}
              </div>

              {/* Confirm New Password */}
              <div className="mb-5">
                <label htmlFor="confirmNewPassword" className="mb-1.5 block text-xs font-medium uppercase tracking-wide" style={{ color: colors.slate }}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.slate }} aria-hidden="true" />
                  <input
                    id="confirmNewPassword"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your new password"
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      clearField("confirmNewPassword");
                    }}
                    aria-invalid={!!errors.confirmNewPassword}
                    className={`field-input w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm ${errors.confirmNewPassword ? "has-error field-error" : ""}`}
                    style={{ borderColor: errors.confirmNewPassword ? colors.danger : colors.line, color: colors.ink }}
                  />
                </div>
                {errors.confirmNewPassword && <p className="mt-1 text-xs" style={{ color: colors.danger }}>{errors.confirmNewPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="submit-btn flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-70"
                style={{ background: colors.signal, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {submitting ? "Resetting..." : "Reset"}
                {!submitting && <ArrowRight size={15} aria-hidden="true" />}
              </button>

              <p className="mt-5 text-center text-sm" style={{ color: colors.slate }}>
                Remembered it?{" "}
                <button
                  type="button"
                  onClick={() => switchView("login")}
                  className="register-link font-medium underline-offset-2 hover:underline"
                  style={{ color: colors.steel }}
                >
                  Log in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Home page 
export default function AcademiaIndustryPortal() {
  const [mounted, setMounted] = useState(false);
  const [lineDrawn, setLineDrawn] = useState(false);
  const [activeRole, setActiveRole] = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 50);
    const t2 = setTimeout(() => setLineDrawn(true), 350);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      className="flex min-h-screen w-full flex-col"
      style={{ background: colors.mist, fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="mx-auto flex w-full  flex-1 flex-col px-4 py-6 sm:px-6 sm:py-10">
        <div
          className="flex flex-1 flex-col overflow-hidden rounded-2xl border"
          style={{ borderColor: colors.line, background: colors.white }}
        >
          {/* Header */}
          <header
            className="relative overflow-hidden px-6 py-14 text-center sm:px-10 sm:py-20"
            style={{ background: `linear-gradient(135deg, ${colors.harbor} 0%, ${colors.steel} 100%)` }}
          >
            <svg
              viewBox="0 0 400 60"
              className="pointer-events-none absolute left-1/2 top-4 hidden w-340px -translate-x-1/2 opacity-90 sm:block md:w-420px"
              aria-hidden="true"
            >
              <line x1="55" y1="30" x2="345" y2="30" stroke={colors.signal} strokeWidth="2" strokeLinecap="round" className={`bridge-line ${lineDrawn ? "drawn" : ""}`} />
              <g className={`node-pop ${mounted ? "in" : ""}`} style={{ animationDelay: "0.1s" }}>
                <circle cx="35" cy="30" r="20" fill={colors.white} fillOpacity="0.12" />
                <circle cx="35" cy="30" r="20" stroke={colors.white} strokeOpacity="0.4" fill="none" />
              </g>
              <g className={`node-pop ${mounted ? "in" : ""}`} style={{ animationDelay: "0.35s" }}>
                <circle cx="365" cy="30" r="20" fill={colors.white} fillOpacity="0.12" />
                <circle cx="365" cy="30" r="20" stroke={colors.white} strokeOpacity="0.4" fill="none" />
              </g>
            </svg>

            <div className="relative">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] sm:mb-4 sm:text-sm" style={{ color: colors.signal }}>
                Academia &ndash; Industry Bridge
              </p>
              <h1
                className="mx-auto max-w-3xl text-2xl font-bold leading-tight text-white sm:text-4xl md:text-[2.75rem]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Portal for Academia&ndash;Industry Collaboration
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm text-slate-200 sm:text-base">
                Skill mapping, internships, and placement &mdash; one bridge connecting classrooms to careers.
              </p>
            </div>
          </header>

          {/* Role selection */}
          <section className="relative z-10 flex flex-1 flex-col justify-center px-4 pb-10 pt-6 sm:px-8 sm:pb-14 sm:pt-8">
            <div
              className={`fade-up ${mounted ? "in" : ""} mx-auto -mt-12 mb-8 flex max-w-md items-center justify-center gap-2 rounded-xl border px-5 py-3 text-center shadow-sm sm:mb-10`}
              style={{ background: colors.white, borderColor: colors.line }}
            >
              <Link2 size={16} style={{ color: colors.signal }} aria-hidden="true" />
              <span className="text-sm font-medium sm:text-base" style={{ color: colors.ink }}>
                Select your role
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {roles.map((role, i) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.key}
                    type="button"
                    onClick={() => setActiveRole(role)}
                    className={`role-card fade-up ${mounted ? "in" : ""} flex flex-col items-start gap-3 rounded-xl border p-5 text-left focus:outline-none`}
                    style={{ background: colors.white, borderColor: colors.line, animationDelay: `${0.15 + i * 0.1}s` }}
                  >
                    <span className="role-icon-wrap flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-300" style={{ background: "#EAF0F7" }}>
                      <Icon size={22} style={{ color: colors.steel }} aria-hidden="true" />
                    </span>
                    <span className="text-base font-semibold sm:text-lg" style={{ color: colors.ink, fontFamily: "'Space Grotesk', sans-serif" }}>
                      {role.label}
                    </span>
                    <span className="text-sm leading-snug" style={{ color: colors.slate }}>
                      {role.desc}
                    </span>
                    <span className="role-arrow mt-1 flex items-center gap-1 text-sm font-medium opacity-0 transition-all duration-300" style={{ color: colors.signalDark }}>
                      Continue <ArrowRight size={15} aria-hidden="true" />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: colors.slate }}>
          A single bridge between classrooms and careers &mdash; choose your role to continue.
        </p>
      </div>

      {activeRole && <AuthModal role={activeRole} onClose={() => setActiveRole(null)} />}
    </div>
  );
}