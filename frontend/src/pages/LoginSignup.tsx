import { useState, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '@/api/client'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'user' | 'provider'
}

export default function LoginSignup() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'user'|'provider'>('user')
  const [rememberMe, setRememberMe] = useState(false)
  
  const [result, setResult] = useState<User | null>(null)

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {}
    
    if (!name.trim() && !isLogin) {
      newErrors.name = 'Name is required'
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[6-9]\d{9}$/.test(phone.replace(/[^\d]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (!isLogin && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({})
    setSuccess(null)
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const payload = isLogin 
        ? { email, password, rememberMe }
        : { name, email, phone, password, role }
      
      const res = await api.post(endpoint, payload)
      
      if (isLogin) {
        // Store token and user info
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        setSuccess('Login successful! Redirecting...')
        
        // Redirect based on role
        setTimeout(() => {
          if (res.data.user.role === 'provider') {
            navigate('/provider')
          } else if (res.data.user.role === 'admin') {
            navigate('/admin')
          } else {
            navigate('/')
          }
        }, 1500)
      } else {
        setResult(res.data.user)
        setSuccess('Account created successfully! Please login.')
        // Switch to login mode after successful signup
        setTimeout(() => {
          setIsLogin(true)
          setPassword('')
          setConfirmPassword('')
        }, 2000)
      }
    } catch (error: unknown) {
      console.error('Auth error:', error)
      const errorMsg = (error as any).response?.data?.message || 
                      (isLogin ? 'Login failed. Please check your credentials.' : 'Signup failed. Please try again.')
      setErrors({ submit: errorMsg })
    } finally {
      setIsLoading(false)
    }
  }

  function toggleMode() {
    setIsLogin(!isLogin)
    setErrors({})
    setSuccess(null)
    setPassword('')
    setConfirmPassword('')
  }

  function formatPhoneNumber(value: string) {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 5) return digits
    if (digits.length <= 10) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return `${digits.slice(0, 5)}-${digits.slice(5, 10)}`
  }

  return (
    <div className="auth-page-advanced">
      <div className="auth-container">
        {/* Left Side - Visual */}
        <div className="auth-visual">
          <div className="visual-content">
            <div className="auth-logo">
              <span className="logo-icon">🏠</span>
              <h2>Smart ServiceHub</h2>
            </div>
            <div className="visual-features">
              <div className="feature-item">
                <span className="feature-icon">🔍</span>
                <h3>Find Services</h3>
                <p>Discover trusted professionals for all your needs</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📅</span>
                <h3>Book Instantly</h3>
                <p>Schedule services with just a few clicks</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⭐</span>
                <h3>Rate & Review</h3>
                <p>Share your experience with the community</p>
              </div>
            </div>
            <div className="visual-stats">
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Verified Providers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50,000+</div>
                <div className="stat-label">Services Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-container">
          <div className="auth-form">
            <div className="form-header">
              <h1 className="form-title">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h1>
              <p className="form-subtitle">
                {isLogin 
                  ? 'Login to access your account and manage bookings'
                  : 'Join our community and start booking services today'
                }
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                <span>{success}</span>
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                <span>{errors.submit}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form-fields">
              {/* Name Field (Signup only) */}
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`form-input ${errors.name ? 'error' : ''}`}
                    />
                  </div>
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
              )}

              {/* Email Field */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                  />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {/* Phone Field */}
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-wrapper">
                  <span className="input-icon">📱</span>
                  <input
                    type="tel"
                    placeholder="12345-67890"
                    value={formatPhoneNumber(phone)}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    maxLength={11}
                  />
                </div>
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              {/* Role Selection (Signup only) */}
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">I want to</label>
                  <div className="role-selection">
                    <button
                      type="button"
                      className={`role-btn ${role === 'user' ? 'active' : ''}`}
                      onClick={() => setRole('user')}
                    >
                      <span className="role-icon">👤</span>
                      <span>Book Services</span>
                    </button>
                    <button
                      type="button"
                      className={`role-btn ${role === 'provider' ? 'active' : ''}`}
                      onClick={() => setRole('provider')}
                    >
                      <span className="role-icon">🔧</span>
                      <span>Provide Services</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                  />
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              {/* Confirm Password (Signup only) */}
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    />
                  </div>
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
              )}

              {/* Remember Me (Login only) */}
              {isLogin && (
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Remember me for 30 days</span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="btn-spinner">⏳</span>
                    <span>{isLogin ? 'Logging in...' : 'Creating account...'}</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">{isLogin ? '🔓' : '➕'}</span>
                    <span>{isLogin ? 'Login' : 'Create Account'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="auth-toggle">
              <p>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="toggle-btn"
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </div>

            {/* Social Login */}
            <div className="social-login">
              <div className="social-divider">
                <span>Or continue with</span>
              </div>
              <div className="social-buttons">
                <button type="button" className="social-btn google">
                  <span className="social-icon">🔍</span>
                  <span>Google</span>
                </button>
                <button type="button" className="social-btn phone">
                  <span className="social-icon">📱</span>
                  <span>Phone OTP</span>
                </button>
              </div>
            </div>

            {/* Terms and Privacy */}
            {!isLogin && (
              <div className="auth-terms">
                <p>
                  By creating an account, you agree to our
                  <Link to="/terms" className="terms-link">Terms of Service</Link>
                  {' and '}
                  <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
