import React, { useState, useEffect, useRef } from 'react'
import '../styles/AdvancedUserActions.css'

interface Notification {
  id: string
  type: 'booking' | 'payment' | 'system' | 'promo'
  title: string
  message: string
  time: string
  unread: boolean
  actions?: Array<{
    label: string
    action: string
  }>
}

interface UserProfile {
  name: string
  email: string
  avatar: string
  status: 'online' | 'offline' | 'busy'
  stats: {
    bookings: number
    savings: number
    points: number
    rating: number
  }
}

interface AdvancedUserActionsProps {
  initialNotifications?: Notification[]
  userProfile?: UserProfile
  onNotificationClick?: (notification: Notification) => void
  onProfileMenuClick?: (action: string) => void
}

const AdvancedUserActions: React.FC<AdvancedUserActionsProps> = ({
  initialNotifications,
  userProfile = {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    avatar: '👤',
    status: 'online',
    stats: {
      bookings: 23,
      savings: 4500,
      points: 1250,
      rating: 4.8
    }
  },
  onNotificationClick,
  onProfileMenuClick
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications || [
    {
      id: '1',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your AC service booking for tomorrow has been confirmed. Provider: Rajesh Kumar',
      time: '2 min ago',
      unread: true,
      actions: [
        { label: 'View Details', action: 'view_booking' },
        { label: 'Call Provider', action: 'call_provider' }
      ]
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Successful',
      message: 'Payment of ₹850 for plumbing services has been processed successfully',
      time: '1 hour ago',
      unread: true,
      actions: [
        { label: 'View Receipt', action: 'view_receipt' }
      ]
    },
    {
      id: '3',
      type: 'promo',
      title: 'Special Offer! 🎉',
      message: 'Get 20% off on your next booking. Use code SAVE20. Valid for 48 hours only!',
      time: '3 hours ago',
      unread: false,
      actions: [
        { label: 'Book Now', action: 'book_now' },
        { label: 'View Offers', action: 'view_offers' }
      ]
    },
    {
      id: '4',
      type: 'system',
      title: 'Profile Updated',
      message: 'Your profile information has been successfully updated',
      time: '1 day ago',
      unread: false
    },
    {
      id: '5',
      type: 'booking',
      title: 'Service Completed',
      message: 'Your electrical service has been completed. Please rate your experience',
      time: '2 days ago',
      unread: false,
      actions: [
        { label: 'Rate Service', action: 'rate_service' }
      ]
    }
  ])

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'bookings' | 'payments' | 'promos'>('all')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          id: Date.now().toString(),
          type: 'booking' as const,
          title: 'New Booking Request',
          message: 'Someone wants to book your cleaning service',
          time: 'Just now',
          unread: true
        },
        {
          id: Date.now().toString(),
          type: 'system' as const,
          title: 'System Update',
          message: 'New features have been added to the app',
          time: 'Just now',
          unread: true
        }
      ]

      if (Math.random() > 0.8) {
        const newNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)])
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter(n => n.unread).length

  const filteredNotifications = notifications.filter(notification => {
    switch (activeFilter) {
      case 'unread':
        return notification.unread
      case 'bookings':
        return notification.type === 'booking'
      case 'payments':
        return notification.type === 'payment'
      case 'promos':
        return notification.type === 'promo'
      default:
        return true
    }
  })

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, unread: false } : n)
    )
    onNotificationClick?.(notification)
  }

  const handleNotificationAction = (notification: Notification, action: string) => {
    console.log(`Action: ${action} for notification: ${notification.id}`)
    onProfileMenuClick?.(action)
  }

  const handleProfileMenuClick = (action: string) => {
    setShowProfile(false)
    onProfileMenuClick?.(action)
  }

  const getNotificationIcon = (type: string) => {
    const icons = {
      booking: '📅',
      payment: '💳',
      system: '⚙️',
      promo: '🎁'
    }
    return icons[type as keyof typeof icons] || '📢'
  }

  const formatTime = (time: string) => {
    if (time === 'Just now') return 'Just now'
    return time
  }

  return (
    <div className="advanced-user-actions">
      {/* Notification Button */}
      <div className="notification-container" ref={notificationRef}>
        <button 
          className="notification-btn"
          onClick={() => {
            setShowNotifications(!showNotifications)
            setShowProfile(false)
          }}
        >
          🔔
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </button>

        {/* Notification Dropdown */}
        <div className={`notification-dropdown ${showNotifications ? 'active' : ''}`}>
          <div className="notification-header">
            <h3>
              Notifications
              <span className="notification-count">{notifications.length}</span>
            </h3>
            <div className="notification-filters">
              <button 
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'unread' ? 'active' : ''}`}
                onClick={() => setActiveFilter('unread')}
              >
                Unread ({unreadCount})
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveFilter('bookings')}
              >
                Bookings
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'payments' ? 'active' : ''}`}
                onClick={() => setActiveFilter('payments')}
              >
                Payments
              </button>
            </div>
          </div>

          <div className="notification-list">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.unread ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`notification-icon ${notification.type}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{formatTime(notification.time)}</div>
                    {notification.actions && (
                      <div className="notification-actions">
                        {notification.actions.map((action, index) => (
                          <button
                            key={index}
                            className="notification-action-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleNotificationAction(notification, action.action)
                            }}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                color: '#94a3b8',
                fontSize: '0.9rem'
              }}>
                No notifications found
              </div>
            )}
          </div>

          {unreadCount > 0 && (
            <div className="notification-footer">
              <button className="mark-all-read-btn" onClick={markAllAsRead}>
                Mark all as read
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Button */}
      <div className="profile-container" ref={profileRef}>
        <button 
          className="profile-btn"
          onClick={() => {
            setShowProfile(!showProfile)
            setShowNotifications(false)
          }}
        >
          👤
        </button>

        {/* Profile Dropdown */}
        <div className={`profile-dropdown ${showProfile ? 'active' : ''}`}>
          <div className="profile-header">
            <div className="profile-avatar">
              {userProfile.avatar}
              <div className="profile-status"></div>
            </div>
            <div className="profile-name">{userProfile.name}</div>
            <div className="profile-email">{userProfile.email}</div>
            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat-value">{userProfile.stats.bookings}</div>
                <div className="profile-stat-label">Bookings</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">₹{userProfile.stats.savings}</div>
                <div className="profile-stat-label">Saved</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{userProfile.stats.points}</div>
                <div className="profile-stat-label">Points</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{userProfile.stats.rating}</div>
                <div className="profile-stat-label">Rating</div>
              </div>
            </div>
          </div>

          <div className="profile-menu">
            <div className="menu-item" onClick={() => handleProfileMenuClick('account')}>
              <div className="menu-icon account">👤</div>
              <div className="menu-content">
                <div className="menu-title">My Account</div>
                <div className="menu-description">Manage your profile settings</div>
              </div>
            </div>

            <div className="menu-item" onClick={() => handleProfileMenuClick('bookings')}>
              <div className="menu-icon bookings">📅</div>
              <div className="menu-content">
                <div className="menu-title">My Bookings</div>
                <div className="menu-description">View booking history</div>
              </div>
              <span className="menu-badge">3</span>
            </div>

            <div className="menu-item" onClick={() => handleProfileMenuClick('payments')}>
              <div className="menu-icon payments">💳</div>
              <div className="menu-content">
                <div className="menu-title">Payment Methods</div>
                <div className="menu-description">Manage payment options</div>
              </div>
            </div>

            <div className="menu-item" onClick={() => handleProfileMenuClick('settings')}>
              <div className="menu-icon settings">⚙️</div>
              <div className="menu-content">
                <div className="menu-title">Settings</div>
                <div className="menu-description">App preferences</div>
              </div>
            </div>

            <div className="menu-item" onClick={() => handleProfileMenuClick('help')}>
              <div className="menu-icon help">❓</div>
              <div className="menu-content">
                <div className="menu-title">Help & Support</div>
                <div className="menu-description">Get assistance</div>
              </div>
            </div>

            <div className="menu-item" onClick={() => handleProfileMenuClick('logout')} style={{ marginTop: '1rem' }}>
              <div className="menu-icon logout">🚪</div>
              <div className="menu-content">
                <div className="menu-title">Logout</div>
                <div className="menu-description">Sign out of your account</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedUserActions
