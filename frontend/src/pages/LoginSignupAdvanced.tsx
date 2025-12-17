import { useState, useEffect, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService, type User, type AuthResult } from '@/firebase/auth'
import { api } from '@/api/client'

interface FormData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  role: 'user' | 'provider'
  rememberMe: boolean
}

interface FormErrors {
  [key: string]: string
}

export default function LoginSignupAdvanced() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    rememberMe: false
  })

  // Check if user is already logged in
  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user) {
      setCurrentUser(user)
      // Redirect based on role
      if (user.role === 'provider') {
        navigate('/provider')
      } else if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    }
  }, [navigate])

  // Password strength calculator
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    return Math.min(strength, 4)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation (signup only)
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Full name is required'
    } else if (!isLogin && formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation (signup only)
    if (!isLogin && !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!isLogin && !/^[6-9]\d{9}$/.test(formData.phone.replace(/[^\d]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    } else if (!isLogin && passwordStrength < 2) {
      newErrors.password = 'Password is too weak. Include uppercase, lowercase, and numbers'
    }

    // Confirm password validation (signup only)
    if (!isLogin && !formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({})
    setSuccess(null)

    try {
      let result: AuthResult

      if (isLogin) {
        result = await authService.signIn(formData.email, formData.password)
        
        if (result.success && result.user) {
          setSuccess('Login successful! Redirecting...')
          
          // Redirect based on role
          setTimeout(() => {
            if (result.user?.role === 'provider') {
              navigate('/provider')
            } else if (result.user?.role === 'admin') {
              navigate('/admin')
            } else {
              navigate('/')
            }
          }, 1500)
        }
      } else {
        result = await authService.signUp(
          formData.email,
          formData.password,
          formData.name,
          formData.role,
          formData.phone
        )
        
        if (result.success) {
          setSuccess('Account created successfully! Please check your email for verification.')
          
          // Switch to login mode after successful signup
          setTimeout(() => {
            setIsLogin(true)
            setFormData(prev => ({
              ...prev,
              password: '',
              confirmPassword: ''
            }))
          }, 3000)
        }
      }

      if (result.error) {
        setErrors({ submit: result.error })
      }

      if (result.needsVerification) {
        setErrors({ submit: 'Please verify your email address before logging in.' })
      }

    } catch (error) {
      console.error('Auth error:', error)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setErrors({})
    setSuccess(null)

    try {
      const result = await authService.signInWithGoogle()
      
      if (result.success && result.user) {
        setSuccess('Login successful! Redirecting...')
        
        setTimeout(() => {
          if (result.user?.role === 'provider') {
            navigate('/provider')
          } else if (result.user?.role === 'admin') {
            navigate('/admin')
          } else {
            navigate('/')
          }
        }, 1500)
      } else if (result.error) {
        setErrors({ submit: result.error })
      }
    } catch (error) {
      console.error('Google sign in error:', error)
      setErrors({ submit: 'Failed to sign in with Google. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      setErrors({ reset: 'Please enter your email address' })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      setErrors({ reset: 'Please enter a valid email address' })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const result = await authService.resetPassword(resetEmail)
      
      if (result.success) {
        setSuccess('Password reset link sent! Please check your email.')
        setIsResettingPassword(false)
        setResetEmail('')
      } else if (result.error) {
        setErrors({ reset: result.error })
      }
    } catch (error) {
      console.error('Password reset error:', error)
      setErrors({ reset: 'Failed to send password reset email. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setSuccess(null)
    setFormData(prev => ({
      ...prev,
      password: '',
      confirmPassword: ''
    }))
    setPasswordStrength(0)
  }

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 5) return digits
    if (digits.length <= 10) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return `${digits.slice(0, 5)}-${digits.slice(5, 10)}`
  }

  const getPasswordStrengthColor = (): string => {
    if (passwordStrength <= 1) return '#ef4444'
    if (passwordStrength === 2) return '#f59e0b'
    if (passwordStrength === 3) return '#3b82f6'
    return '#10b981'
  }

  const getPasswordStrengthText = (): string => {
    if (passwordStrength <= 1) return 'Weak'
    if (passwordStrength === 2) return 'Fair'
    if (passwordStrength === 3) return 'Good'
    return 'Strong'
  }

  if (currentUser) {
    return (
      <div className="auth-page-advanced">
        <div className="auth-container">
          <div className="auth-form-container">
            <div className="auth-form">
              <div className="already-logged-in">
                <div className="logged-in-icon">✅</div>
                <h2>You're already logged in!</h2>
                <p>Redirecting you to your dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
              <p>Your trusted partner for home services</p>
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
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <h3>Secure Payments</h3>
                <p>Safe and secure payment processing</p>
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
              <div className="stat-item">
                <div className="stat-number">4.8★</div>
                <div className="stat-label">Average Rating</div>
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

            {/* Password Reset Form */}
            {isResettingPassword ? (
              <div className="password-reset-form">
                <h3>Reset Password</h3>
                <p>Enter your email address and we'll send you a link to reset your password.</p>
                
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className={`form-input ${errors.reset ? 'error' : ''}`}
                    />
                  </div>
                  {errors.reset && <span className="error-text">{errors.reset}</span>}
                </div>

                <div className="reset-buttons">
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="auth-submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="btn-spinner">⏳</span>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">📧</span>
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsResettingPassword(false)
                      setResetEmail('')
                      setErrors({})
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form-fields">
                {/* Name Field (Signup only) */}
                {!isLogin && (
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div className="input-wrapper">
                      <span className="input-icon">👤</span>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
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
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                    />
                  </div>
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                {/* Phone Field (Signup only) */}
                {!isLogin && (
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <div className="input-wrapper">
                      <span className="input-icon">📱</span>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="12345-67890"
                        value={formatPhoneNumber(formData.phone)}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        maxLength={11}
                      />
                    </div>
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                )}

                {/* Role Selection (Signup only) */}
                {!isLogin && (
                  <div className="form-group">
                    <label className="form-label">I want to</label>
                    <div className="role-selection">
                      <button
                        type="button"
                        className={`role-btn ${formData.role === 'user' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, role: 'user' }))}
                      >
                        <span className="role-icon">👤</span>
                        <span>Book Services</span>
                      </button>
                      <button
                        type="button"
                        className={`role-btn ${formData.role === 'provider' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, role: 'provider' }))}
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
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.password && <span className="error-text">{errors.password}</span>}
                  
                  {/* Password Strength Indicator (Signup only) */}
                  {!isLogin && formData.password && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div 
                          className="strength-fill"
                          style={{ 
                            width: `${(passwordStrength / 4) * 100}%`,
                            backgroundColor: getPasswordStrengthColor()
                          }}
                        />
                      </div>
                      <span className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                        Password strength: {getPasswordStrengthText()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password (Signup only) */}
                {!isLogin && (
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
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
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
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
            )}

            {/* Toggle Mode */}
            {!isResettingPassword && (
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
                
                {/* Forgot Password (Login only) */}
                {isLogin && (
                  <p>
                    <button
                      type="button"
                      onClick={() => setIsResettingPassword(true)}
                      className="forgot-password-btn"
                    >
                      Forgot password?
                    </button>
                  </p>
                )}
              </div>
            )}

            {/* Social Login */}
            {!isResettingPassword && (
              <div className="social-login">
                <div className="social-divider">
                  <span>Or continue with</span>
                </div>
                <div className="social-buttons">
                  <button 
                    type="button" 
                    className="social-btn google"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <span className="social-icon">🔍</span>
                    <span>Google</span>
                  </button>
                  <button type="button" className="social-btn phone" disabled>
                    <span className="social-icon">📱</span>
                    <span>Phone OTP</span>
                  </button>
                </div>
              </div>
            )}

            {/* Terms and Privacy */}
            {!isLogin && !isResettingPassword && (
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
