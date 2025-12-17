import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'
import { authService } from '../firebase/auth'
import { useUser } from '../contexts/UserContext'
import '../styles/AdvancedNavbar.css'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
  action?: {
    label: string
    url: string
  }
}

export default function NavbarAdvanced() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [logoAnimating, setLogoAnimating] = useState(false)
  
  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Booking Confirmed',
        message: 'Your AC repair service has been confirmed for tomorrow at 2 PM',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
        action: {
          label: 'View Booking',
          url: '/bookings'
        }
      },
      {
        id: '2',
        title: 'New Message',
        message: 'Provider sent you a message about your upcoming service',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: false
      },
      {
        id: '3',
        title: 'Payment Successful',
        message: 'Your payment of ₹1,200 has been processed successfully',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        read: true
      },
      {
        id: '4',
        title: 'Service Reminder',
        message: 'Don\'t forget your plumbing service scheduled for next week',
        type: 'warning',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        read: true
      }
    ]

    setNotifications(mockNotifications)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Advanced Search Handler
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
      
      // Add search animation
      const searchElement = searchRef.current
      if (searchElement) {
        searchElement.classList.add('searching')
        setTimeout(() => {
          searchElement.classList.remove('searching')
        }, 600)
      }
    }
  }, [searchQuery, navigate])

  // Handle search input focus
  const handleSearchFocus = useCallback(() => {
    setSearchOpen(true)
    // Load popular suggestions if needed
  }, [])

  // Handle search input blur
  const handleSearchBlur = useCallback(() => {
    // Delay closing to allow clicking on suggestions
    setTimeout(() => {
      setSearchOpen(false)
    }, 200)
  }, [])

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion)
    setSearchOpen(false)
    // Auto-submit after short delay
    setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(suggestion)}`)
      setSearchQuery('')
    }, 100)
  }, [navigate])

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('')
    searchRef.current?.querySelector('input')?.focus()
  }, [])

  // Handle logo click animation
  const handleLogoClick = useCallback(() => {
    setLogoAnimating(true)
    setTimeout(() => setLogoAnimating(false), 1200)
  }, [])

  // Handle notification click
  const handleNotificationClick = useCallback((notification: Notification) => {
    if (notification.action) {
      navigate(notification.action.url)
    }
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )
    setNotificationsOpen(false)
  }, [navigate])

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length

  // Format notification time
  const formatNotificationTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  // Get notification icon
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return 'ℹ️'
    }
  }

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠', badge: null },
    { path: '/search', label: 'Search', icon: '🔍', badge: null },
    { path: '/bookings', label: 'My Bookings', icon: '📅', badge: '3' },
    { path: '/provider', label: 'Provider', icon: '👨‍🔧', badge: null },
    { path: '/admin', label: 'Admin', icon: '⚙️', badge: null }
  ]

  // Debug navigation
  const handleNavClick = useCallback((path: string) => {
    console.log('Navigating to:', path)
    navigate(path)
  }, [navigate])

  // Logo blast effect
  const handleLogoBlast = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const logoWrapper = e.currentTarget as HTMLElement
    logoWrapper.classList.add('blast')
    
    // Create blast particles
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div')
      particle.className = 'blast-particle'
      
      const angle = (i * 30) * Math.PI / 180
      const distance = 80 + Math.random() * 40
      const tx = Math.cos(angle) * distance
      const ty = Math.sin(angle) * distance
      
      particle.style.setProperty('--tx', `${tx}px`)
      particle.style.setProperty('--ty', `${ty}px`)
      particle.style.left = '50%'
      particle.style.top = '50%'
      particle.style.animation = 'particleBlast 0.8s ease-out forwards'
      
      logoWrapper.appendChild(particle)
      
      setTimeout(() => particle.remove(), 800)
    }
    
    // Add haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50])
    }
    
    // Remove blast class after animation
    setTimeout(() => {
      logoWrapper.classList.remove('blast')
    }, 600)
  }, [])

  return (
    <header className="navbar-advanced">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link" onClick={handleLogoClick}>
            <div className={`logo-container ${logoAnimating ? 'animate' : ''}`}>
              <div className="logo-wrapper" onClick={handleLogoBlast}>
                <div className="logo-icon">
                  <span className="logo-main">🏠</span>
                  <div className="logo-sparkles">
                    <span className="sparkle sparkle-1">✨</span>
                    <span className="sparkle sparkle-2">⭐</span>
                    <span className="sparkle sparkle-3">💫</span>
                  </div>
                </div>
                <div className="logo-text">
                  <span className="logo-title">Smart</span>
                  <span className="logo-subtitle">ServiceHub</span>
                </div>
              </div>
              <div className="logo-pulse"></div>
            </div>
          </Link>
        </div>

        {/* Advanced Search Bar */}
        <div className={`navbar-search ${searchOpen ? 'open' : ''}`} ref={searchRef}>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search services, providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="search-input"
                autoComplete="off"
              />
              <div className="search-actions">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="search-clear"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
                <button
                  type="submit"
                  className="search-submit"
                  title="Search"
                  disabled={!searchQuery.trim()}
                >
                  🔎
                </button>
              </div>
            </div>
            
            {/* Enhanced Search Suggestions */}
            {searchOpen && (
              <div className="search-suggestions">
                <div className="suggestion-header">
                  <div className="suggestion-category">Popular Services</div>
                  <div className="suggestion-trending">🔥 Trending</div>
                </div>
                <div className="suggestion-items">
                  <button 
                    type="button"
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick('Emergency Plumbing')}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <span className="suggestion-icon">🔧</span>
                    <div className="suggestion-content">
                      <span className="suggestion-title">Emergency Plumbing</span>
                      <span className="suggestion-desc">24/7 plumbing services</span>
                    </div>
                    <span className="suggestion-arrow">→</span>
                  </button>
                  <button 
                    type="button"
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick('AC Repair Service')}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <span className="suggestion-icon">❄️</span>
                    <div className="suggestion-content">
                      <span className="suggestion-title">AC Repair Service</span>
                      <span className="suggestion-desc">Fast cooling solutions</span>
                    </div>
                    <span className="suggestion-arrow">→</span>
                  </button>
                  <button 
                    type="button"
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick('Home Cleaning')}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <span className="suggestion-icon">🧹</span>
                    <div className="suggestion-content">
                      <span className="suggestion-title">Home Cleaning</span>
                      <span className="suggestion-desc">Professional cleaning</span>
                    </div>
                    <span className="suggestion-arrow">→</span>
                  </button>
                  <button 
                    type="button"
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick('Electrical Services')}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <span className="suggestion-icon">⚡</span>
                    <div className="suggestion-content">
                      <span className="suggestion-title">Electrical Services</span>
                      <span className="suggestion-desc">Safe electrical work</span>
                    </div>
                    <span className="suggestion-arrow">→</span>
                  </button>
                </div>
                
                <div className="suggestion-footer">
                  <div className="suggestion-category">Recent Searches</div>
                  <div className="recent-searches">
                    <button 
                      type="button"
                      className="recent-search-item"
                      onClick={() => handleSuggestionClick('Pest Control')}
                    >
                      <span className="recent-icon">🕐</span>
                      Pest Control
                    </button>
                    <button 
                      type="button"
                      className="recent-search-item"
                      onClick={() => handleSuggestionClick('Painting Services')}
                    >
                      <span className="recent-icon">🕐</span>
                      Painting Services
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Desktop Navigation */}
        <nav className="navbar-nav desktop-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <div className="nav-content">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </div>
              <div className="nav-indicator"></div>
              <div className="nav-hover-effect"></div>
            </NavLink>
          ))}
        </nav>

        {/* Right Section */}
        <div className="navbar-actions">
          {/* Notifications */}
          <div className="navbar-notifications" ref={notificationsRef}>
            <button
              className="notifications-toggle"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <span className="notifications-icon">🔔</span>
              {unreadCount > 0 && (
                <span className="notifications-badge">{unreadCount}</span>
              )}
            </button>

            {notificationsOpen && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <button onClick={markAllAsRead} className="mark-all-read">
                    Mark all as read
                  </button>
                </div>
                <div className="notifications-list">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-icon-wrapper">
                        <span className="notification-icon">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-footer">
                          <span className="notification-time">
                            {formatNotificationTime(notification.timestamp)}
                          </span>
                          {notification.action && (
                            <span className="notification-action">
                              {notification.action.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="notifications-footer">
                  <Link to="/notifications" className="view-all-notifications">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          {user ? (
            <div className="navbar-profile" ref={profileRef}>
              <button
                className="profile-toggle"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <div className="profile-avatar">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} />
                  ) : (
                    <span className="avatar-fallback">
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <span className="profile-name">{user.displayName || 'User'}</span>
                <span className="profile-chevron">▼</span>
              </button>

              {profileMenuOpen && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <div className="profile-avatar large">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || 'User'} />
                      ) : (
                        <span className="avatar-fallback">
                          {user.displayName?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="profile-info">
                      <div className="profile-name">{user.displayName || 'User'}</div>
                      <div className="profile-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="profile-menu">
                    <Link to="/profile" className="profile-menu-item">
                      <span className="menu-icon">👤</span>
                      <span>My Profile</span>
                    </Link>
                    <Link to="/profile/bookings" className="profile-menu-item">
                      <span className="menu-icon">📅</span>
                      <span>My Bookings</span>
                    </Link>
                    <Link to="/profile/payments" className="profile-menu-item">
                      <span className="menu-icon">💳</span>
                      <span>Payment Methods</span>
                    </Link>
                    <Link to="/profile/reviews" className="profile-menu-item">
                      <span className="menu-icon">⭐</span>
                      <span>Reviews</span>
                    </Link>
                    <Link to="/profile/settings" className="profile-menu-item">
                      <span className="menu-icon">⚙️</span>
                      <span>Settings</span>
                    </Link>
                    <div className="profile-divider"></div>
                    <button
                      onClick={() => authService.signOut()}
                      className="profile-menu-item logout"
                    >
                      <span className="menu-icon">🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth">
              <button 
                onClick={() => {
                  // Open login modal or redirect to login
                  window.location.href = '/login'
                }}
                className="btn btn-outline"
              >
                Sign In
              </button>
              <button 
                onClick={() => {
                  // Open signup modal or redirect to login
                  window.location.href = '/login'
                }}
                className="btn btn-primary"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`hamburger-icon ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-brand">
            <img src="/logo.svg" alt="Smart ServiceHub" className="mobile-logo" />
            <span className="mobile-brand-name">Smart ServiceHub</span>
          </div>
          <button
            className="mobile-menu-close"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✕
          </button>
        </div>
        
        <div className="mobile-menu-content">
          <div className="mobile-search">
            <form onSubmit={handleSearch}>
              <div className="mobile-search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mobile-search-input"
                />
              </div>
            </form>
          </div>

          <nav className="mobile-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mobile-nav-icon">{item.icon}</span>
                <span className="mobile-nav-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mobile-menu-footer">
            {user ? (
              <div className="mobile-profile">
                <div className="mobile-profile-info">
                  <div className="mobile-profile-avatar">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} />
                    ) : (
                      <span className="avatar-fallback">
                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="mobile-profile-details">
                    <div className="mobile-profile-name">{user.displayName || 'User'}</div>
                    <div className="mobile-profile-email">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => authService.signOut()}
                  className="mobile-logout-btn"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="mobile-auth">
                <Link to="/login" className="btn btn-outline mobile-btn">
                  Sign In
                </Link>
                <Link to="/login" className="btn btn-primary mobile-btn">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
