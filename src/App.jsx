import { useState, useEffect } from 'react'
import Home from './pages/Home/Home'
import StudentPortal from './pages/StudentPortal/StudentPortal'

function App() {
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
      const params = new URLSearchParams(window.location.search)
      const isStudentPortal =
        params.get('portal') === 'student' || window.location.hash.startsWith('#student-portal')
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

  const navigateTo = (page) => {
    if (page === 'student-portal') {
      window.location.hash = '#student-portal'
    } else {
      if (window.location.hash.startsWith('#student-portal')) {
        window.history.pushState(null, '', window.location.pathname)
      }
    }
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (currentPage === 'student-portal') {
    return (
      <StudentPortal
        onNavigateHome={() => navigateTo('home')}
      />
    )
  }

  return (
    <Home
      onOpenStudentPortal={() => navigateTo('student-portal')}
    />
  )
}

export default App
