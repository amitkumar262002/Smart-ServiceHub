import React, { useState, useEffect } from 'react'
import { useUser } from '@/contexts/UserContext'
import LoginModal from './LoginModal'
import '../styles/AuthPrompt.css'

interface AuthPromptProps {
  onClose: () => void
  onLoginSuccess: () => void
}

export default function AuthPrompt({ onClose, onLoginSuccess }: AuthPromptProps) {
  const { user } = useUser()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Auto-close if user logs in
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        onLoginSuccess()
        onClose()
      }, 1000)
    }
  }, [user, onLoginSuccess, onClose])

  const handleLoginClick = () => {
    setShowLoginModal(true)
  }

  const handleDismiss = () => {
    setDismissed(true)
    setTimeout(() => onClose(), 300)
  }

  if (dismissed) return null

  return (
    <>
      <div className="auth-prompt-overlay">
        <div className={`auth-prompt ${dismissed ? 'dismissed' : ''}`}>
          <div className="auth-prompt-content">
            <div className="auth-prompt-header">
              <div className="auth-prompt-icon">🔐</div>
              <button className="auth-prompt-close" onClick={handleDismiss}>
                ×
              </button>
            </div>
            
            <div className="auth-prompt-body">
              <h3>Unlock Full Experience!</h3>
              <p>
                Sign in to book services, track orders, and get exclusive member benefits
              </p>
              
              <div className="auth-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">⭐</span>
                  <span>Book Services Instantly</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">📅</span>
                  <span>Track Your Orders</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">💎</span>
                  <span>Member Discounts</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🛡️</span>
                  <span>Secure Payments</span>
                </div>
              </div>
              
              <div className="auth-prompt-actions">
                <button 
                  className="auth-prompt-btn primary"
                  onClick={handleLoginClick}
                >
                  Sign In / Sign Up
                </button>
                <button 
                  className="auth-prompt-btn secondary"
                  onClick={handleDismiss}
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false)
            onLoginSuccess()
          }}
        />
      )}
    </>
  )
}
