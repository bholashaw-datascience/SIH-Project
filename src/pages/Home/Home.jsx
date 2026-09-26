import { useState, useEffect } from 'react'
import LoginModal from '../../components/Auth/LoginModal'
import RegisterModal from '../../components/Auth/RegisterModal'
import ForgotPasswordModal from '../../components/Auth/ForgotPasswordModal'

function Home({ onOpenStudentPortal, onOpenStudentDemo }) {
  const [selectedRole, setSelectedRole] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash === '#student-login' || hash === '#student-register' || hash === '#student-forgot') {
        return 'students'
      }
    }
    return null
  })
  const [activeModal, setActiveModal] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash === '#student-login' || hash === '#student-register' || hash === '#student-forgot') {
        return 'students'
      }
    }
    return null
  })
  const [studentMode, setStudentMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash === '#student-register') return 'register'
      if (hash === '#student-forgot') return 'forgot'
    }
    return 'login'
  }) // 'login' | 'register' | 'forgot'
  const [academicMode, setAcademicMode] = useState('login') // 'login' | 'register'
  const [industryMode, setIndustryMode] = useState('login') // 'login' | 'register'
  const [adminMode, setAdminMode] = useState('login') // 'login' | 'register'

  // ---------------------------------------------------------------------------
  // Browser History & Hash Synchronization
  // ---------------------------------------------------------------------------
  // Synchronize modal state when user navigates using Back / Forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#student-login') {
        setSelectedRole('students')
        setActiveModal('students')
        setStudentMode('login')
      } else if (hash === '#student-register') {
        setSelectedRole('students')
        setActiveModal('students')
        setStudentMode('register')
      } else if (hash === '#student-forgot') {
        setSelectedRole('students')
        setActiveModal('students')
        setStudentMode('forgot')
      } else if (!hash || hash === '#' || hash === '#home') {
        setActiveModal(null)
      }
    }

    window.addEventListener('popstate', handleHashChange)
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('popstate', handleHashChange)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Synchronize URL hash when student modal is opened or changes mode
  useEffect(() => {
    if (activeModal === 'students') {
      const targetHash =
        studentMode === 'register'
          ? '#student-register'
          : studentMode === 'forgot'
          ? '#student-forgot'
          : '#student-login'
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash
      }
    } else if (!activeModal) {
      if (['#student-login', '#student-register', '#student-forgot'].includes(window.location.hash)) {
        window.location.hash = '#home'
      }
    }
  }, [activeModal, studentMode])

  // ---------------------------------------------------------------------------
  // Role Definitions & Gateway Configuration
  // ---------------------------------------------------------------------------
  const roles = [
    {
      id: 'academic',
      title: 'Academic Institutions',
      category: 'Academic Pathway',
      description:
        'Align curricula with industry demand, track student competencies, and manage institutional internship outcomes.',
      actionLabel: 'Access Institutional Tools',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" />
          <path d="M3 10h18" />
          <path d="M5 10v11" />
          <path d="M9 10v11" />
          <path d="M15 10v11" />
          <path d="M19 10v11" />
          <path d="m12 2 10 5H2z" />
        </svg>
      ),
    },
    {
      id: 'industries',
      title: 'Industries',
      category: 'Industry Pathway',
      description:
        'Post internship opportunities, define target skill requirements, and recruit qualified, industry-ready students.',
      actionLabel: 'Access Industry Tools',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      ),
    },
    {
      id: 'students',
      title: 'Students',
      category: 'Student Pathway',
      description:
        'Build your verified skill profile, identify learning gaps, and apply for relevant internship and placement opportunities.',
      actionLabel: 'Access Student Tools',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      id: 'admin',
      title: 'Portal Admin',
      category: 'Admin Pathway',
      description:
        'Manage system access, oversee partnership workflows, and ensure a secure, transparent collaboration framework.',
      actionLabel: 'Access Admin Tools',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <circle cx="12" cy="10" r="3" />
          <path d="M7.5 17a4.5 4.5 0 0 1 9 0" />
        </svg>
      ),
    },
  ]

  // ---------------------------------------------------------------------------
  // Modal & Role Handlers
  // ---------------------------------------------------------------------------
  const handleRoleClick = (roleId) => {
    setSelectedRole(roleId)
    setActiveModal(roleId)
  }

  const closeModal = () => {
    setActiveModal(null)
    setStudentMode('login')
    setAcademicMode('login')
    setIndustryMode('login')
    setAdminMode('login')
  }

  // ---------------------------------------------------------------------------
  // View Rendering
  // ---------------------------------------------------------------------------
  return (
    <div className="portal-canvas">
      <style>{`
        #root {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          border-inline: none !important;
          min-height: 100vh !important;
          display: flex !important;
          flex-direction: column !important;
          background-color: #f5f2ea;
        }

        .portal-canvas {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          padding: 0;
          margin: 0;
          background-color: #f7f5ef;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #0f1d2f;
          box-sizing: border-box;
        }

        .portal-card-frame,
        .portal-main-layout {
          width: 100%;
          flex: 1 0 auto;
          display: flex;
          flex-direction: column;
          background: transparent;
          border-radius: 0;
          border: none;
          box-shadow: none;
          overflow: visible;
          box-sizing: border-box;
        }

        /* Top Accent Rule */
        .portal-gold-accent-bar {
          height: 4px;
          width: 100%;
          background-color: #b3881e;
          flex-shrink: 0;
        }

        /* Hero / Title Banner Section (Solid Deep Navy) */
        .hero-navy-strip {
          background-color: #112233;
          color: #ffffff;
          width: 100%;
          padding: clamp(28px, 3.8vh, 44px) clamp(20px, 4vw, 56px);
          text-align: center;
          border-bottom: 1px solid #20354b;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .hero-portal-title {
          font-size: clamp(22px, 2.2vw, 29px);
          font-weight: 700;
          line-height: 1.25;
          letter-spacing: -0.01em;
          margin: 0 0 clamp(8px, 1.1vh, 12px);
          color: #fbfaf6;
        }

        .hero-portal-desc {
          font-size: clamp(13px, 1.05vw, 15px);
          color: #cbd5e1;
          max-width: 780px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .hero-portal-subtitle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          column-gap: 14px;
          row-gap: 6px;
        }

        .hero-subtitle-word {
          color: #cbd5e1;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .hero-subtitle-dot {
          color: #b3881e;
          font-size: 11px;
          line-height: 1;
          user-select: none;
        }

        /* Roles Selection Container (Warm Ivory Tone) */
        .roles-workspace {
          width: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(20px, 2.8vh, 40px) clamp(20px, 4vw, 56px);
          box-sizing: border-box;
          background-color: #f7f5ef;
        }

        .roles-inner-content {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
        }

        .roles-header-block {
          text-align: center;
          margin-bottom: clamp(14px, 2.2vh, 26px);
        }

        .roles-main-title {
          font-size: clamp(19px, 1.8vw, 23px);
          font-weight: 700;
          color: #0f1d2f;
          margin: 0 0 6px;
          letter-spacing: -0.01em;
        }

        .roles-sub-guide {
          font-size: clamp(13px, 0.95vw, 14.5px);
          color: #556977;
          margin: 0 auto;
          max-width: 640px;
          line-height: 1.5;
        }

        .roles-grid-layout {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(16px, 1.6vw, 24px);
          width: 100%;
        }

        .stakeholder-tile {
          background-color: #ffffff;
          border: 1.5px solid #ded8cb;
          border-radius: 8px;
          padding: clamp(18px, 2.2vh, 26px) clamp(14px, 1.3vw, 20px);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.2s ease-in-out;
          box-sizing: border-box;
          position: relative;
          z-index: 1;
          box-shadow: 0 2px 8px rgba(15, 29, 47, 0.04);
        }

        .stakeholder-tile:hover {
          border-color: #1b525c;
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -4px rgba(17, 34, 51, 0.09), 0 4px 8px -2px rgba(17, 34, 51, 0.04);
          z-index: 3;
        }

        .stakeholder-tile.tile-selected {
          border-color: #b3881e;
          background-color: #fffefb;
          box-shadow: 0 0 0 2px #b3881e, 0 10px 22px rgba(179, 136, 30, 0.12);
          z-index: 2;
        }

        .tile-category-tag {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #1b525c;
          background-color: #edf5f5;
          border: 1px solid #cfe0e2;
          padding: 2.5px 8px;
          border-radius: 3px;
          margin-bottom: clamp(10px, 1.3vh, 16px);
          position: relative;
          z-index: 1;
        }

        .tile-icon-box {
          width: clamp(42px, 4.8vh, 50px);
          height: clamp(42px, 4.8vh, 50px);
          border-radius: 8px;
          background-color: #f3f7f7;
          border: 1px solid #d4e3e5;
          color: #1b525c;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: clamp(10px, 1.3vh, 14px);
          transition: all 0.2s ease;
          position: relative;
          z-index: 1;
        }

        .stakeholder-tile:hover .tile-icon-box {
          background-color: #1b525c;
          color: #ffffff;
          border-color: #1b525c;
        }

        .stakeholder-tile.tile-selected .tile-icon-box {
          background-color: #b3881e;
          color: #ffffff;
          border-color: #b3881e;
        }

        .tile-title {
          font-size: clamp(15px, 1.2vw, 17.5px);
          font-weight: 700;
          color: #0f1d2f;
          margin: 0 0 8px;
          line-height: 1.3;
          position: relative;
          z-index: 1;
        }

        .tile-desc {
          font-size: clamp(12px, 0.9vw, 13px);
          color: #4b5d6c;
          line-height: 1.5;
          margin: 0 0 clamp(14px, 1.8vh, 20px);
          flex-grow: 1;
          position: relative;
          z-index: 1;
        }

        .tile-action-button {
          width: 100%;
          padding: 9px 12px;
          font-size: 12.5px;
          font-weight: 600;
          border-radius: 6px;
          border: 1.5px solid #c9c3b4;
          background-color: #ffffff;
          color: #112233;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
          box-sizing: border-box;
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }

        .stakeholder-tile:hover .tile-action-button {
          background-color: #112233;
          color: #ffffff;
          border-color: #112233;
        }

        .stakeholder-tile.tile-selected .tile-action-button {
          background-color: #b3881e;
          color: #ffffff;
          border-color: #b3881e;
        }

        .btn-arrow-icon {
          font-size: 14px;
          transition: transform 0.2s ease;
        }

        .stakeholder-tile:hover .btn-arrow-icon {
          transform: translateX(4px);
        }

        .tile-demo-button {
          width: 100%;
          margin-top: 8px;
          padding: 7px 12px;
          font-size: 11.5px;
          font-weight: 700;
          border-radius: 6px;
          border: 1.5px dashed #b3881e;
          background-color: rgba(179, 136, 30, 0.08);
          color: #785307;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
          box-sizing: border-box;
          position: relative;
          z-index: 2;
          flex-shrink: 0;
          font-family: inherit;
        }

        .tile-demo-button:hover {
          background-color: #112233;
          border-color: #112233;
          color: #f1cf7c;
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(17, 34, 51, 0.18);
        }

        .tile-demo-tag {
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 6px;
          border-radius: 4px;
          background-color: #b3881e;
          color: #ffffff;
        }

        .tile-demo-button:hover .tile-demo-tag {
          background-color: #f1cf7c;
          color: #112233;
        }

        /* Modal Overlay & Dialog Styles */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 29, 47, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          box-sizing: border-box;
          backdrop-filter: blur(2px);
          animation: fadeIn 0.18s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-card {
          width: 100%;
          max-width: 500px;
          background-color: #ffffff;
          border-radius: 8px;
          border: 1px solid #dcd5c7;
          box-shadow: 0 20px 40px rgba(15, 29, 47, 0.25);
          overflow: hidden;
          position: relative;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          animation: slideUp 0.2s ease-out;
        }

        @keyframes slideUp {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-top-accent {
          height: 4px;
          width: 100%;
          background-color: #b3881e;
        }

        .modal-header {
          padding: 20px 24px 16px;
          border-bottom: 1px solid #ede8de;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          position: relative;
        }

        .modal-header-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }

        .modal-role-pill {
          display: inline-flex;
          align-items: center;
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #1b525c;
          background-color: #edf5f5;
          border: 1px solid #cfe0e2;
          padding: 2.5px 8px;
          border-radius: 3px;
          margin: 0;
          line-height: 1.2;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #0f1d2f;
          margin: 0 0 4px;
        }

        .modal-title.student-login-title,
        .modal-title.student-register-title,
        .modal-title.academic-login-title,
        .modal-title.academic-register-title,
        .modal-title.industry-login-title,
        .modal-title.industry-register-title,
        .modal-title.admin-login-title,
        .modal-title.admin-register-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f1d2f;
          margin: 0;
          letter-spacing: -0.015em;
          line-height: 1.25;
        }

        .modal-subtitle {
          font-size: 13px;
          color: #556977;
          margin: 0;
          line-height: 1.45;
        }

        .modal-close-btn {
          background: transparent;
          border: 1px solid #ded9cc;
          border-radius: 4px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #556977;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.15s ease;
          flex-shrink: 0;
          margin-left: 12px;
        }

        .modal-close-btn:hover {
          background-color: #f5f2ea;
          color: #0f1d2f;
          border-color: #b3881e;
        }

        .modal-body {
          padding: 20px 24px 22px;
          overflow-y: auto;
          box-sizing: border-box;
        }

        /* Register Modal Refined Institutional / Enterprise Design */
        .modal-card.register-modal-card {
          max-width: 740px;
          width: 94%;
          max-height: calc(100vh - 24px);
          border-radius: 8px;
          box-shadow: 0 16px 40px -8px rgba(15, 29, 47, 0.16), 0 2px 6px rgba(15, 29, 47, 0.04);
          border: 1px solid #dcd6cb;
          background-color: #ffffff;
        }

        .modal-card.register-modal-card .modal-header {
          padding: 12px 24px 10px;
          background-color: #ffffff;
          border-bottom: 1px solid #ebe6dc;
        }

        .modal-card.register-modal-card .modal-role-pill {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #1b525c;
          background-color: #f0f6f6;
          border: 1px solid #cfe0e2;
          border-radius: 3px;
          padding: 2px 7px;
          margin-bottom: 2px;
          display: inline-block;
        }

        .modal-card.register-modal-card .modal-title {
          font-size: 17px;
          font-weight: 700;
          color: #0f1d2f;
          letter-spacing: -0.01em;
          margin: 2px 0 0;
          line-height: 1.25;
        }

        .modal-card.register-modal-card .modal-close-btn {
          width: 28px;
          height: 28px;
          font-size: 13px;
          border: 1px solid #ded8cb;
          border-radius: 4px;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .modal-card.register-modal-card .modal-close-btn:hover {
          background-color: #f8f6f0;
          color: #0f1d2f;
          border-color: #cbd5e1;
        }

        .modal-card.register-modal-card .modal-body.register-modal-body {
          padding: 10px 24px 14px;
          overflow-y: auto;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
          background-color: #ffffff;
        }

        .modal-card.register-modal-card .modal-body.register-modal-body::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        .register-form-flow {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* Top Two-Column Split (Details Left, Compact Upload Card Right) */
        .register-top-split {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
        }

        .register-details-left {
          flex: 1;
          min-width: 0;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 5px 12px;
          align-content: start;
        }

        .register-details-left .form-field {
          gap: 2px;
        }

        .register-details-left .field-full {
          grid-column: 1 / -1;
        }

        .register-details-left .field-half {
          grid-column: span 1;
        }

        .register-upload-card-right {
          width: 200px;
          flex-shrink: 0;
          background: #fbfaf7;
          border: 1px solid #ded8cb;
          border-radius: 6px;
          padding: 7px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 4px;
          box-shadow: 0 1px 3px rgba(15, 29, 47, 0.04);
          box-sizing: border-box;
          position: relative;
        }

        .upload-card-badge {
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #475569;
          text-transform: uppercase;
          background-color: #eeebe3;
          padding: 1.5px 7px;
          border-radius: 3px;
          border: 1px solid #ded8cb;
          line-height: 1.2;
        }

        .register-upload-card-right .profile-avatar-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: #ffffff;
          border: 1.5px solid #d4cdc0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          transition: border-color 0.2s ease;
          flex-shrink: 0;
          aspect-ratio: 1 / 1;
          margin: 0 auto;
        }

        .register-upload-card-right .profile-avatar-wrapper:hover {
          border-color: #1b525c;
        }

        .register-upload-card-right .avatar-placeholder-icon {
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .register-upload-card-right .avatar-img-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
        }

        .upload-card-action-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          width: 100%;
        }

        .upload-card-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          width: 100%;
          flex-wrap: nowrap;
        }

        .register-upload-card-right .btn-upload-photo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 3px 8px;
          height: 25px;
          font-size: 11px;
          font-weight: 600;
          line-height: 1;
          color: #1e293b;
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          box-sizing: border-box;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        .register-upload-card-right .btn-upload-photo:hover {
          background-color: #0f1d2f;
          color: #ffffff;
          border-color: #0f1d2f;
          box-shadow: 0 2px 5px rgba(15, 29, 47, 0.15);
        }

        .register-upload-card-right .btn-remove-photo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border: 1px solid #fecdd3;
          color: #991b1b;
          font-size: 11px;
          font-weight: 600;
          line-height: 1;
          padding: 3px 8px;
          height: 25px;
          border-radius: 4px;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          box-sizing: border-box;
          transition: all 0.15s ease;
        }

        .register-upload-card-right .btn-remove-photo:hover {
          background-color: #fee2e2;
          border-color: #fca5a5;
          color: #7f1d1d;
        }

        .register-upload-card-right .profile-format-note {
          font-size: 9px;
          color: #64748b;
          line-height: 1.2;
          max-width: 180px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }

        .register-upload-card-right .profile-error-text {
          font-size: 9px;
          color: #991b1b;
          font-weight: 600;
          line-height: 1.15;
          margin-top: 1px;
        }

        /* Form Logical Section Labels */
        .register-section-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
          margin-bottom: 2px;
          width: 100%;
        }

        .register-section-label span {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: #1b525c;
          background-color: #f2f7f7;
          padding: 2px 8px;
          border-radius: 3px;
          border: 1px solid #d4e5e7;
        }

        .register-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, #ded8cb, rgba(222, 216, 203, 0.2));
        }

        /* 2-Column Responsive Security Input Grid */
        .register-security-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 5px 12px;
          width: 100%;
        }

        .register-security-grid .form-field {
          gap: 2px;
        }

        .register-security-grid .field-half {
          grid-column: span 1;
        }

        .modal-card.register-modal-card .form-label {
          font-size: 11px;
          font-weight: 600;
          color: #1e293b;
          letter-spacing: 0.01em;
          line-height: 1.2;
          margin-bottom: 1px;
        }

        .modal-card.register-modal-card .required-star {
          color: #b91c1c;
          font-weight: 700;
          margin-left: 2px;
        }

        .modal-card.register-modal-card .form-input {
          padding: 0 10px;
          font-size: 12.5px;
          height: 34px;
          border: 1px solid #d5cfc3;
          border-radius: 4px;
          background-color: #fdfcf9;
          color: #0f172a;
          transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
        }

        .modal-card.register-modal-card .form-input:focus {
          border-color: #1b525c;
          box-shadow: 0 0 0 2.5px rgba(27, 82, 92, 0.14);
          background-color: #ffffff;
          outline: none;
        }

        .modal-card.register-modal-card .form-feedback {
          font-size: 10px;
          margin-top: 1px;
          line-height: 1.2;
        }

        /* Password Input Wrapper with Symmetrical Eye Button */
        .modal-card.register-modal-card .password-input-wrap {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .modal-card.register-modal-card .password-input-wrap .form-input {
          width: 100%;
          padding-right: 32px;
        }

        .modal-card.register-modal-card .toggle-password-btn {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          border-radius: 3px;
          padding: 0;
          transition: color 0.15s ease, background-color 0.15s ease;
        }

        .modal-card.register-modal-card .toggle-password-btn:hover {
          color: #0f1d2f;
          background-color: rgba(0, 0, 0, 0.05);
        }

        /* Password Checklist Card */
        .register-rules-full {
          width: 100%;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          margin-top: 0;
          transition: max-height 0.22s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.18s ease, margin-top 0.22s ease;
          pointer-events: none;
        }

        .register-rules-full.is-expanded {
          max-height: 90px;
          opacity: 1;
          margin-top: 3px;
          pointer-events: auto;
        }

        .password-checklist-card {
          padding: 4px 10px;
          background-color: #f8fafb;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          box-sizing: border-box;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }

        .password-checklist-card.checklist-card-all-met {
          background-color: #f0fdf4;
          border-color: #bbf7d0;
        }

        .checklist-items-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: nowrap;
          gap: 6px;
        }

        .chk-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: #64748b;
          font-weight: 500;
          white-space: nowrap;
          transition: color 0.15s ease;
        }

        .chk-marker {
          font-size: 9px;
          font-weight: 700;
          color: #94a3b8;
          width: 10px;
          text-align: center;
        }

        .chk-item.is-met {
          color: #166534;
          font-weight: 600;
        }

        .chk-item.is-met .chk-marker {
          color: #15803d;
        }

        .checklist-card-satisfied {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
          font-size: 10.5px;
          font-weight: 600;
          border-radius: 4px;
        }

        .chk-marker-success {
          font-size: 11.5px;
          font-weight: 700;
          color: #15803d;
        }

        /* Prominent Full-Width CTA & Secondary Switch */
        .register-actions-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
          width: 100%;
        }

        .modal-card.register-modal-card .form-submit-btn {
          width: 100%;
          height: 36px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          border-radius: 4px;
          border: 1px solid #0f1d2f;
          background-color: #0f1d2f;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 1px 3px rgba(15, 29, 47, 0.15);
        }

        .modal-card.register-modal-card .form-submit-btn:hover:not(:disabled) {
          background-color: #1b525c;
          border-color: #1b525c;
          box-shadow: 0 3px 8px rgba(27, 82, 92, 0.22);
        }

        .modal-card.register-modal-card .form-submit-btn:active:not(:disabled) {
          transform: translateY(1px);
          box-shadow: 0 1px 2px rgba(15, 29, 47, 0.12);
        }

        .modal-card.register-modal-card .modal-switch-prompt {
          font-size: 11.5px;
          color: #64748b;
          margin-top: 1px;
          line-height: 1.2;
        }

        .modal-card.register-modal-card .modal-switch-link {
          color: #1b525c;
          font-weight: 600;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          font-family: inherit;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.15s ease;
        }

        .modal-card.register-modal-card .modal-switch-link:hover {
          color: #b3881e;
        }

        /* Form Controls */
        .access-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .form-label {
          font-size: 12.5px;
          font-weight: 600;
          color: #112233;
        }

        .form-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .forgot-password-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 6px;
          margin-bottom: 2px;
        }

        .forgot-password-link {
          background: transparent;
          border: none;
          padding: 0;
          font-size: 12px;
          font-weight: 600;
          color: #1b525c;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.15s ease;
          font-family: inherit;
        }

        .forgot-password-link:hover {
          color: #b3881e;
        }

        /* Forgot Password Step Indicator */
        .forgot-steps-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 24px;
          background-color: #faf7f0;
          border-bottom: 1px solid #ede8de;
          gap: 8px;
        }

        .step-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #8c9ba5;
          font-size: 12px;
          font-weight: 500;
        }

        .step-pill.active {
          color: #0f1d2f;
          font-weight: 700;
        }

        .step-pill.completed {
          color: #1b525c;
        }

        .step-num {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #ede8de;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
        }

        .step-pill.active .step-num {
          background-color: #112233;
          color: #ffffff;
        }

        .step-pill.completed .step-num {
          background-color: #1b525c;
          color: #ffffff;
        }

        .step-divider {
          height: 2px;
          width: 22px;
          background-color: #e2dbce;
          border-radius: 2px;
        }

        .step-divider.active {
          background-color: #1b525c;
        }

        /* Identified Account Box */
        .identified-account-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background-color: #edf5f5;
          border: 1px solid #cfe0e2;
          border-radius: 6px;
        }

        .account-avatar-mini {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
          border: 1px solid #cfe0e2;
        }

        .account-details-mini {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }

        .account-user-name {
          font-size: 13px;
          font-weight: 700;
          color: #0f1d2f;
        }

        .account-email-masked {
          font-size: 11.5px;
          color: #556977;
        }

        .account-email-masked strong {
          color: #0f1d2f;
        }

        /* Send OTP Step 2 Box */
        .otp-send-action-box {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 4px;
        }

        .otp-prompt-card {
          background-color: #f7fafb;
          border: 1px solid #dce5e9;
          border-radius: 6px;
          padding: 12px 14px;
          text-align: left;
        }

        .otp-prompt-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #0f1d2f;
          margin-bottom: 4px;
        }

        .otp-prompt-text {
          font-size: 12px;
          color: #475569;
          line-height: 1.5;
        }

        .otp-prompt-text strong {
          color: #112233;
        }

        /* OTP Simulation Banner */
        .otp-simulation-alert {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 9px 12px;
          background-color: #fcf6e8;
          border: 1px solid #ebd9b0;
          border-radius: 6px;
          font-size: 11.5px;
          color: #7a5813;
          line-height: 1.45;
          text-align: left;
        }

        .otp-sim-badge {
          background-color: #b3881e;
          color: #ffffff;
          font-size: 9.5px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 3px;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }

        .otp-sim-text {
          flex: 1;
        }

        .otp-sim-text strong {
          color: #0f1d2f;
          font-size: 12.5px;
          letter-spacing: 1px;
        }

        /* OTP Code Input */
        .otp-code-input {
          font-size: 22px !important;
          letter-spacing: 10px;
          text-align: center;
          font-weight: 700;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
          padding: 8px 12px !important;
        }

        .otp-actions-strip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2px;
          font-size: 11.5px;
        }

        .otp-timer-text {
          color: #64748b;
        }

        .resend-otp-btn {
          background: transparent;
          border: none;
          color: #1b525c;
          font-weight: 600;
          font-size: 11.5px;
          cursor: pointer;
          text-decoration: underline;
          font-family: inherit;
          padding: 0;
        }

        .resend-otp-btn:hover:not(:disabled) {
          color: #b3881e;
        }

        .resend-otp-btn:disabled {
          color: #94a3b8;
          cursor: not-allowed;
          text-decoration: none;
        }

        .secondary-sublink {
          color: #64748b !important;
          font-size: 12px !important;
        }

        .dot-separator {
          color: #cbd5e1;
        }

        /* Forgot Success View */
        .forgot-success-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 12px 8px 8px;
        }

        .success-icon-circle {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background-color: #edf7f4;
          border: 2px solid #a4dbc8;
          color: #114c3e;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .success-heading {
          font-size: 18px;
          font-weight: 700;
          color: #0f1d2f;
          margin: 0 0 8px;
        }

        .success-description {
          font-size: 13px;
          color: #556977;
          margin: 0 0 20px;
          line-height: 1.5;
        }

        .form-submit-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          background-color: #64748b;
          border-color: #64748b;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 9px 12px;
          font-size: 13.5px;
          border: 1.5px solid #d4cdc0;
          border-radius: 5px;
          background-color: #fcfbf9;
          color: #0f1d2f;
          box-sizing: border-box;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          font-family: inherit;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #1b525c;
          box-shadow: 0 0 0 3px rgba(27, 82, 92, 0.12);
          background-color: #ffffff;
        }

        .form-input.is-invalid {
          border-color: #b3261e !important;
          background-color: #fffbfa;
        }

        .form-input.is-invalid:focus {
          border-color: #b3261e !important;
          box-shadow: 0 0 0 3px rgba(179, 38, 30, 0.14) !important;
        }

        .form-input.is-valid {
          border-color: #1b525c;
        }

        .form-feedback {
          font-size: 11.5px;
          margin-top: 3px;
          line-height: 1.35;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .form-feedback.feedback-error {
          color: #b3261e;
          font-weight: 500;
        }

        .form-feedback.feedback-success {
          color: #1b525c;
          font-weight: 600;
        }

        .form-feedback.feedback-hint {
          color: #64748b;
          font-size: 11px;
        }

        .password-rules-box {
          display: flex;
          flex-wrap: wrap;
          gap: 5px 8px;
          margin-top: 6px;
          padding: 8px 10px;
          background-color: #faf8f3;
          border: 1px solid #ded8cb;
          border-radius: 5px;
          transition: all 0.2s ease;
        }

        .pwd-rule {
          font-size: 11px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
          padding: 2px 7px;
          border-radius: 3px;
          transition: all 0.15s ease;
        }

        .pwd-rule.unmet {
          color: #64748b;
          background-color: #f2ede4;
          border: 1px solid #e2dbce;
        }

        .pwd-rule.met {
          color: #114c3e;
          background-color: #e6f4f0;
          border: 1px solid #a3d9ca;
          font-weight: 700;
        }

        .pwd-rule-icon {
          font-size: 10px;
          font-weight: 700;
        }

        .form-feedback-alert {
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          line-height: 1.4;
        }

        .form-feedback-alert.alert-success {
          background-color: #edf7f4;
          border: 1px solid #a4dbc8;
          color: #114c3e;
          font-weight: 600;
        }

        .form-feedback-alert.alert-error {
          background-color: #fdf2f2;
          border: 1px solid #f8b4b4;
          color: #9b1c1c;
          font-weight: 500;
        }

        /* Password Visibility Control */
        .password-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .password-input-wrap .form-input {
          padding-right: 42px;
        }

        .toggle-password-btn {
          position: absolute;
          right: 10px;
          background: transparent;
          border: none;
          color: #556977;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.15s ease;
        }

        .toggle-password-btn:hover {
          color: #0f1d2f;
        }

        /* Profile Picture Upload Component (Centered Top) */
        .profile-upload-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 4px 0 14px;
          border-bottom: 1px solid #ede8de;
          margin-bottom: 4px;
        }

        .profile-avatar-wrapper {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background-color: #ede8de;
          border: 2px solid #d4cdc0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(15, 29, 47, 0.08);
          margin-bottom: 10px;
        }

        .avatar-placeholder-icon {
          color: #556977;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-img-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .profile-upload-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .btn-upload-photo {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #0f1d2f;
          background-color: #ffffff;
          border: 1.5px solid #c9c3b4;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
          width: fit-content;
        }

        .btn-upload-photo:hover {
          background-color: #112233;
          color: #ffffff;
          border-color: #112233;
        }

        .btn-remove-photo {
          background: transparent;
          border: 1px solid #d4cdc0;
          color: #842029;
          font-size: 11.5px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-remove-photo:hover {
          background-color: #f8d7da;
          border-color: #f5c2c7;
        }

        .file-hidden-input {
          display: none;
        }

        .profile-format-note {
          font-size: 11px;
          color: #64748b;
          line-height: 1.35;
          text-align: center;
        }

        .profile-error-text {
          font-size: 11.5px;
          color: #b3261e;
          font-weight: 600;
          margin-top: 5px;
          text-align: center;
        }

        /* Crop Modal Styles */
        .crop-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(12, 24, 36, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1200;
          padding: 16px;
          box-sizing: border-box;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.16s ease-out;
        }

        .crop-modal-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #ded9cc;
          box-shadow: 0 24px 48px rgba(15, 29, 47, 0.35);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          animation: slideUp 0.18s ease-out;
        }

        .crop-modal-top-accent {
          height: 4px;
          width: 100%;
          background-color: #b3881e;
        }

        .crop-modal-header {
          padding: 18px 22px 14px;
          border-bottom: 1px solid #ede8de;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .crop-modal-title {
          font-size: 17px;
          font-weight: 700;
          color: #0f1d2f;
          margin: 4px 0 2px;
          letter-spacing: -0.01em;
        }

        .crop-modal-subtitle {
          font-size: 12px;
          color: #64748b;
          margin: 0;
        }

        .crop-modal-body {
          padding: 20px 22px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          background-color: #fcfbf9;
        }

        .crop-viewport {
          width: 280px;
          height: 280px;
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          background-color: #0f1d2f;
          cursor: grab;
          user-select: none;
          touch-action: none;
          box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.5);
        }

        .crop-viewport:active {
          cursor: grabbing;
        }

        .crop-target-img {
          position: absolute;
          top: 50%;
          left: 50%;
          pointer-events: none;
          transform-origin: center center;
          will-change: transform;
          user-select: none;
        }

        .crop-circle-mask {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 220px;
          height: 220px;
          border-radius: 50%;
          box-shadow: 0 0 0 9999px rgba(15, 29, 47, 0.72);
          border: 2px solid #d4af37;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }

        .crop-grid-lines {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .crop-grid-h {
          position: absolute;
          top: 33.33%;
          left: 0;
          right: 0;
          height: 33.33%;
          border-top: 1px dashed rgba(212, 175, 55, 0.35);
          border-bottom: 1px dashed rgba(212, 175, 55, 0.35);
          pointer-events: none;
        }

        .crop-grid-v {
          position: absolute;
          left: 33.33%;
          top: 0;
          bottom: 0;
          width: 33.33%;
          border-left: 1px dashed rgba(212, 175, 55, 0.35);
          border-right: 1px dashed rgba(212, 175, 55, 0.35);
          pointer-events: none;
        }

        .crop-controls-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          max-width: 320px;
        }

        .crop-zoom-btn {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          border: 1px solid #d4cdc0;
          background: #ffffff;
          color: #0f1d2f;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
          padding: 0;
          line-height: 1;
        }

        .crop-zoom-btn:hover {
          background-color: #112233;
          color: #ffffff;
          border-color: #112233;
        }

        .crop-zoom-slider {
          flex-grow: 1;
          accent-color: #1b525c;
          cursor: pointer;
          height: 5px;
        }

        .crop-zoom-label {
          font-size: 11.5px;
          font-weight: 600;
          color: #556977;
          min-width: 36px;
          text-align: right;
        }

        .crop-reset-btn {
          background: transparent;
          border: 1px solid #ded9cc;
          border-radius: 3px;
          padding: 3px 8px;
          font-size: 11px;
          font-weight: 600;
          color: #556977;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .crop-reset-btn:hover {
          color: #0f1d2f;
          border-color: #112233;
          background-color: #f5f2ea;
        }

        .crop-modal-footer {
          padding: 14px 22px 18px;
          border-top: 1px solid #ede8de;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          background: #ffffff;
        }

        .crop-btn-cancel {
          padding: 8px 16px;
          border-radius: 4px;
          border: 1.5px solid #ded9cc;
          background: #ffffff;
          color: #556977;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .crop-btn-cancel:hover {
          background-color: #f5f2ea;
          color: #0f1d2f;
          border-color: #b3881e;
        }

        .crop-btn-apply {
          padding: 8px 20px;
          border-radius: 4px;
          border: 1.5px solid #112233;
          background: #112233;
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .crop-btn-apply:hover {
          background: #1b525c;
          border-color: #1b525c;
        }

        .form-submit-btn {
          margin-top: 6px;
          width: 100%;
          padding: 11px 16px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 5px;
          border: 1px solid #112233;
          background-color: #112233;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.15s ease;
        }

        .form-submit-btn:hover {
          background-color: #1b525c;
          border-color: #1b525c;
        }

        .modal-switch-prompt {
          margin-top: 12px;
          text-align: center;
          font-size: 12.5px;
          color: #556977;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .modal-switch-prompt.student-login-switch {
          margin-top: 10px;
        }

        .modal-switch-link {
          background: transparent;
          border: none;
          color: #1b525c;
          font-weight: 600;
          font-size: 12.5px;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
          padding: 0;
          font-family: inherit;
          transition: color 0.15s ease;
        }

        .modal-switch-link.student-register-link {
          font-size: 12px;
          font-weight: 500;
          color: #4a636f;
          letter-spacing: 0.01em;
        }

        .modal-switch-link:hover,
        .modal-switch-link.student-register-link:hover {
          color: #b3881e;
        }


        .modal-security-notice {
          margin-top: 14px;
          padding: 10px 12px;
          background-color: #f7f5ed;
          border: 1px solid #e5dfd2;
          border-radius: 4px;
          font-size: 11.5px;
          color: #556977;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          line-height: 1.45;
        }

        .modal-security-notice.notice-admin {
          background-color: #fff9ed;
          border-color: #e8c983;
          color: #7c530b;
        }

        .modal-security-notice span:first-child {
          flex-shrink: 0;
          font-size: 13px;
        }

        @media (max-width: 1080px) {
          .roles-workspace {
            padding: 28px 24px 32px;
            justify-content: flex-start;
          }
          .roles-grid-layout {
            grid-template-columns: repeat(2, 1fr);
            gap: 18px;
          }
          .hero-navy-strip {
            padding: 28px 24px 24px;
          }
          .hero-portal-title {
            font-size: 24px;
          }
          .roles-main-title {
            font-size: 20px;
          }
        }

        @media (max-width: 640px) {
          .portal-canvas {
            padding: 0;
          }
          .hero-navy-strip {
            padding: 24px 16px 20px;
          }
          .hero-portal-title {
            font-size: 20px;
          }
          .hero-portal-desc {
            font-size: 13px;
          }
          .roles-workspace {
            padding: 20px 16px 28px;
          }
          .roles-grid-layout {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .modal-card {
            max-width: 100%;
          }
          .modal-header {
            padding: 16px 16px 12px;
          }
          .modal-body {
            padding: 16px;
          }
          .modal-card.register-modal-card {
            max-width: 95%;
            width: 95%;
            margin: 8px auto;
            max-height: calc(100vh - 16px);
          }
          .modal-card.register-modal-card .modal-header {
            padding: 9px 14px 7px;
          }
          .modal-card.register-modal-card .modal-body.register-modal-body {
            padding: 9px 14px 12px;
          }
          .register-top-split {
            flex-direction: column;
            gap: 10px;
          }
          .register-upload-card-right {
            width: 100%;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            padding: 7px 12px;
            gap: 12px;
            text-align: left;
            box-sizing: border-box;
          }
          .register-upload-card-right .upload-card-badge {
            display: none;
          }
          .register-upload-card-right .profile-avatar-wrapper {
            width: 42px;
            height: 42px;
            margin: 0;
          }
          .upload-card-action-group {
            align-items: flex-start;
            flex: 1;
            min-width: 0;
          }
          .upload-card-controls {
            justify-content: flex-start;
          }
          .register-upload-card-right .profile-format-note {
            max-width: 100%;
            margin: 0;
          }
          .register-details-left {
            grid-template-columns: 1fr;
            gap: 6px;
          }
          .register-details-left .field-half {
            grid-column: 1 / -1;
          }
          .register-security-grid {
            grid-template-columns: 1fr;
            gap: 6px;
          }
          .register-security-grid .field-half {
            grid-column: 1 / -1;
          }
          .register-rules-full.is-expanded {
            max-height: 140px;
          }
          .checklist-items-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3px 6px;
          }
          .modal-card.register-modal-card .form-input {
            height: 35px;
            font-size: 12.5px;
            padding: 6px 10px;
          }
          .modal-card.register-modal-card .form-label {
            font-size: 11px;
          }
          .modal-card.register-modal-card .form-submit-btn {
            height: 36px;
            font-size: 13px;
          }
        }

        /* Official Portal Footer */
        .portal-footer {
          margin-top: auto;
          background: #0f1d2f;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 18px 36px;
          color: #94a3b8;
          font-size: 13px;
        }

        .portal-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .portal-footer-brand {
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.02em;
        }

        .portal-footer-attribution {
          color: #e2e8f0;
          font-weight: 600;
          letter-spacing: 0.01em;
        }
      `}</style>

      <main className="portal-card-frame portal-main-layout">
        {/* Subtle Gold Accent Bar */}
        <div className="portal-gold-accent-bar"></div>

        {/* Deep Navy Hero / Title Banner Section */}
        <section className="hero-navy-strip">
          <h1 className="hero-portal-title">
            IAS Collaboration Portal
          </h1>
          <p className="hero-portal-desc hero-portal-subtitle">
            <span className="hero-subtitle-word">Industries</span>
            <span className="hero-subtitle-dot" aria-hidden="true">•</span>
            <span className="hero-subtitle-word">Academic</span>
            <span className="hero-subtitle-dot" aria-hidden="true">•</span>
            <span className="hero-subtitle-word">Student</span>
          </p>
        </section>

        {/* Roles Workspace with Warm Ivory Tone */}
        <section className="roles-workspace">
          <div className="roles-inner-content">
            <div className="roles-header-block">
              <h2 className="roles-main-title">Choose Your Path</h2>
              <p className="roles-sub-guide">
                Select your role to explore the tools, opportunities, and services available to you.
              </p>
            </div>

            <div className="roles-grid-layout">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`stakeholder-tile ${selectedRole === role.id ? 'tile-selected' : ''}`}
                >
                  <span className="tile-category-tag">{role.category}</span>
                  <div className="tile-icon-box">{role.icon}</div>
                  <h3 className="tile-title">{role.title}</h3>
                  <p className="tile-desc">{role.description}</p>
                  <button
                    type="button"
                    className="tile-action-button"
                    onClick={() => handleRoleClick(role.id)}
                  >
                    <span>{role.actionLabel}</span>
                    <span className="btn-arrow-icon">→</span>
                  </button>
                  {role.id === 'students' && (
                    <button
                      type="button"
                      id="students-demo-preview-btn"
                      className="tile-demo-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenStudentDemo?.()
                      }}
                      title="Launch development-only student flow preview"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                      </svg>
                      <span>Demo Preview</span>
                      <span className="tile-demo-tag">Dev</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Official Portal Footer */}
        <footer className="portal-footer">
          <div className="portal-footer-inner">
            <span className="portal-footer-brand">IAS Collaboration Portal</span>
            <span className="portal-footer-attribution">Built by Team UDAAN</span>
          </div>
        </footer>
      </main>

      {/* ===================================================================== */}
      {/* Authentication Modals (Student, Academic, Industry, Admin)            */}
      {/* ===================================================================== */}
      {/* Student Login, Registration & Forgot Password Modals */}
      <LoginModal
        isOpen={activeModal === 'students' && studentMode === 'login'}
        onClose={closeModal}
        onSwitchToRegister={() => setStudentMode('register')}
        onSwitchToForgotPassword={() => setStudentMode('forgot')}
        role="student"
        onLoginSuccess={() => onOpenStudentPortal && onOpenStudentPortal()}
      />

      <RegisterModal
        isOpen={activeModal === 'students' && studentMode === 'register'}
        onClose={closeModal}
        onSwitchToLogin={() => setStudentMode('login')}
        role="student"
      />

      <ForgotPasswordModal
        isOpen={activeModal === 'students' && studentMode === 'forgot'}
        onClose={closeModal}
        onSwitchToLogin={() => setStudentMode('login')}
        role="student"
      />

      {/* Academic Institution Login, Registration & Forgot Password Modals */}
      <LoginModal
        isOpen={activeModal === 'academic' && academicMode === 'login'}
        onClose={closeModal}
        onSwitchToRegister={() => setAcademicMode('register')}
        onSwitchToForgotPassword={() => setAcademicMode('forgot')}
        role="academic"
      />

      <RegisterModal
        isOpen={activeModal === 'academic' && academicMode === 'register'}
        onClose={closeModal}
        onSwitchToLogin={() => setAcademicMode('login')}
        role="academic"
      />

      <ForgotPasswordModal
        isOpen={activeModal === 'academic' && academicMode === 'forgot'}
        onClose={closeModal}
        onSwitchToLogin={() => setAcademicMode('login')}
        role="academic"
      />

      {/* Industry Partner Login, Registration & Forgot Password Modals */}
      <LoginModal
        isOpen={activeModal === 'industries' && industryMode === 'login'}
        onClose={closeModal}
        onSwitchToRegister={() => setIndustryMode('register')}
        onSwitchToForgotPassword={() => setIndustryMode('forgot')}
        role="industries"
      />

      <RegisterModal
        isOpen={activeModal === 'industries' && industryMode === 'register'}
        onClose={closeModal}
        onSwitchToLogin={() => setIndustryMode('login')}
        role="industries"
      />

      <ForgotPasswordModal
        isOpen={activeModal === 'industries' && industryMode === 'forgot'}
        onClose={closeModal}
        onSwitchToLogin={() => setIndustryMode('login')}
        role="industries"
      />

      {/* Portal Admin Login, Registration & Forgot Password Modals */}
      <LoginModal
        isOpen={activeModal === 'admin' && adminMode === 'login'}
        onClose={closeModal}
        onSwitchToRegister={() => setAdminMode('register')}
        onSwitchToForgotPassword={() => setAdminMode('forgot')}
        role="admin"
      />

      <RegisterModal
        isOpen={activeModal === 'admin' && adminMode === 'register'}
        onClose={closeModal}
        onSwitchToLogin={() => setAdminMode('login')}
        role="admin"
      />

      <ForgotPasswordModal
        isOpen={activeModal === 'admin' && adminMode === 'forgot'}
        onClose={closeModal}
        onSwitchToLogin={() => setAdminMode('login')}
        role="admin"
      />
    </div>
  )
}

export default Home
