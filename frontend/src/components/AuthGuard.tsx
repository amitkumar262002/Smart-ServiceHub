import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import AuthPrompt from './AuthPrompt'
import '../styles/AuthGuard.css'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, loading } = useUser()
  const location = useLocation()
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [hasSeenAuthPrompt, setHasSeenAuthPrompt] = useState(false)

  // Check if user has seen auth prompt in this session
  useEffect(() => {
    const seen = sessionStorage.getItem('authPromptSeen')
    setHasSeenAuthPrompt(!!seen)
  }, [])

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/services',
    '/services/plumbing',
    '/services/electrical',
    '/services/cleaning',
    '/services/pest-control',
    '/services/ac-service',
    '/services/painting',
    '/emergency',
    '/book-service',
    '/track-booking',
    '/find-provider',
    '/support',
    '/company/about',
    '/company/careers',
    '/company/blog',
    '/company/press',
    '/company/partners',
    '/support/help-center',
    '/support/faq',
    '/support/terms',
    '/support/privacy',
    '/support/refund',
    '/support/sitemap',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/login',
    '/search',
    '/bookings',
    '/provider',
    '/admin'
  ]

  const isPublicRoute = publicRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route + '/')
  )

  // Show auth prompt for unauthenticated users on protected routes
  useEffect(() => {
    if (!loading && !user && !isPublicRoute && !hasSeenAuthPrompt) {
      const timer = setTimeout(() => {
        setShowAuthPrompt(true)
        sessionStorage.setItem('authPromptSeen', 'true')
        setHasSeenAuthPrompt(true)
      }, 3000) // Show after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [user, loading, isPublicRoute, hasSeenAuthPrompt])

  // If still loading, show loading screen
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Smart ServiceHub...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicRoute && requireAuth) {
    if (showAuthPrompt) {
      return (
        <>
          <AuthPrompt
            onClose={() => setShowAuthPrompt(false)}
            onLoginSuccess={() => setShowAuthPrompt(false)}
          />
          {children}
        </>
      )
    }
    
    // Navigate to home if not showing prompt
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // If user is authenticated or accessing public route, show children
  return <>{children}</>
}
