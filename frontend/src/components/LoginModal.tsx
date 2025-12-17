import React, { useState } from 'react'
import { authService } from '@/firebase/auth'
import { useUser } from '@/contexts/UserContext'
import '../styles/LoginModal.css'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { updateUser } = useUser()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const result = await authService.signIn(email, password)
        if (result.success && result.user) {
          // Update user profile with additional info
          await updateUser({
            phone: phone || undefined,
            stats: {
              totalBookings: 0,
              completedBookings: 0,
              totalSpent: 0,
              averageRating: 5.0,
              responseRate: 100,
              responseTime: '< 1 hour',
              memberSince: new Date().toLocaleDateString()
            },
            preferences: {
              emailUpdates: true,
              notifications: true,
              darkMode: false,
              language: 'en'
            }
          })
          onSuccess()
        } else if (result.error) {
          setError(result.error)
        }
      } else {
        // Signup
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters')
          setLoading(false)
          return
        }

        const result = await authService.signUp(email, password, fullName, 'user', phone)
        if (result.success && result.user) {
          // Update user profile with additional info
          await updateUser({
            displayName: fullName,
            phone: phone || undefined,
            address: '',
            bio: 'New member of Smart ServiceHub',
            verification: {
              email: true,
              phone: false,
              identity: false,
              address: false
            },
            stats: {
              totalBookings: 0,
              completedBookings: 0,
              totalSpent: 0,
              averageRating: 5.0,
              responseRate: 100,
              responseTime: '< 1 hour',
              memberSince: new Date().toLocaleDateString()
            },
            achievements: [{
              id: 'welcome',
              title: 'Welcome Aboard!',
              description: 'Successfully joined Smart ServiceHub',
              icon: '🎉',
              earnedAt: new Date().toLocaleDateString()
            }],
            preferences: {
              emailUpdates: true,
              notifications: true,
              darkMode: false,
              language: 'en'
            }
          })
          onSuccess()
        } else if (result.error) {
          setError(result.error)
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    try {
      const result = await authService.signInWithGoogle()
      if (result.success && result.user) {
        await updateUser({
          displayName: result.user.displayName || result.user.email?.split('@')[0],
          photoURL: result.user.photoURL,
          verification: {
            email: true,
            phone: false,
            identity: false,
            address: false
          },
          stats: {
            totalBookings: 0,
            completedBookings: 0,
            totalSpent: 0,
            averageRating: 5.0,
            responseRate: 100,
            responseTime: '< 1 hour',
            memberSince: new Date().toLocaleDateString()
          },
          achievements: [{
            id: 'google_signup',
            title: 'Quick Starter!',
            description: 'Joined using Google authentication',
            icon: '🚀',
            earnedAt: new Date().toLocaleDateString()
          }],
          preferences: {
            emailUpdates: true,
            notifications: true,
            darkMode: false,
            language: 'en'
          }
        })
        onSuccess()
      } else if (result.error) {
        setError(result.error)
      }
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setFullName('')
    setPhone('')
    setError('')
    setShowPassword(false)
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    resetForm()
  }

  return (
    <div className="login-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="login-modal">
        <div className="login-modal-header">
          <div className="login-logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Smart ServiceHub</span>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="login-modal-body">
          <h2>{isLogin ? 'Welcome Back!' : 'Join Smart ServiceHub'}</h2>
          <p className="login-subtitle">
            {isLogin 
              ? 'Login to access your services and bookings' 
              : 'Create an account to start booking services'
            }
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label>Phone Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <div className="btn-spinner"></div>
              ) : (
                isLogin ? 'Login to Account' : 'Create Account'
              )}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="google-btn" onClick={handleGoogleSignIn} disabled={loading}>
            <span className="google-icon">🔍</span>
            Continue with Google
          </button>

          <div className="login-switch">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button type="button" className="switch-btn" onClick={switchMode}>
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>

        <div className="login-modal-footer">
          <div className="features-list">
            <div className="feature">
              <span className="feature-icon">🛡️</span>
              <span>Secure Authentication</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Quick Access</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💎</span>
              <span>Member Benefits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
