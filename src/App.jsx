import { useState, useEffect } from 'react'
import Home from './pages/Home/Home'
import StudentPortal from './pages/StudentPortal/StudentPortal'

function App() {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('demo') === 'true' || window.location.hash.includes('demo')
  })

  const [currentPage, setCurrentPage] = useState(() => {
    // Check URL parameters and hash for direct navigation: ?portal=student or #student-portal
    const params = new URLSearchParams(window.location.search)
    if (params.get('portal') === 'student' || window.location.hash.startsWith('#student-portal')) {
      return 'student-portal'
    }
    return 'home'
  })

  // Synchronize with browser history and hash navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash
      const params = new URLSearchParams(window.location.search)
      const isDemo = params.get('demo') === 'true' || hash.includes('demo')
      setIsDemoMode(isDemo)
      const isStudentPortal =
        params.get('portal') === 'student' || hash.startsWith('#student-portal')
      if (isStudentPortal) {
        setCurrentPage('student-portal')
      } else {
        setCurrentPage('home')
      }
    }
    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)
    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  const [demoKey, setDemoKey] = useState(0)

  const navigateTo = (page, { demo = false, hash = null } = {}) => {
    setIsDemoMode(demo)
    if (demo) {
      setDemoKey((k) => k + 1)
      const targetHash = hash || '#student-portal-demo/step-1'
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash
      }
    } else if (page === 'student-portal') {
      let targetHash = hash
      if (!targetHash) {
        try {
          const status = localStorage.getItem('udaan_student_verification_status')
          const completed = localStorage.getItem('udaan_student_profile_completed') === 'true'
          if (completed && status === 'verified') {
            targetHash = '#student-portal/dashboard'
          } else {
            targetHash = '#student-portal/first-time'
          }
        } catch {
          targetHash = '#student-portal/first-time'
        }
      }
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash
      }
    } else {
      const targetHash = hash || '#home'
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash
      }
    }
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (currentPage === 'student-portal') {
    return (
      <StudentPortal
        key={isDemoMode ? `student-demo-${demoKey}` : 'student-portal'}
        onNavigateHome={() => navigateTo('home')}
        isDemoMode={isDemoMode}
      />
    )
  }

  return (
    <Home
      onOpenStudentPortal={() => navigateTo('student-portal')}
      onOpenStudentDemo={() => navigateTo('student-portal', { demo: true })}
    />
  )
}

export default App
