import React, { useState, useEffect, useRef } from 'react'
import '../styles/AdvancedUserActions.css'

interface PremiumNotification {
  id: string
  type: 'booking' | 'payment' | 'system' | 'promo' | 'emergency'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  title: string
  message: string
  time: string
  unread: boolean
  actions?: Array<{
    label: string
    action: string
    primary?: boolean
  }>
  metadata?: {
    providerName?: string
    amount?: string
    location?: string
    estimatedTime?: string
  }
}

interface PremiumProfile {
  name: string
  email: string
  phone: string
  avatar: string
  status: 'online' | 'offline' | 'busy' | 'away'
  membership: 'basic' | 'premium' | 'elite'
  stats: {
    bookings: number
    savings: number
    points: number
    rating: number
    streak: number
    referrals: number
  }
  achievements: Array<{
    id: string
    name: string
    icon: string
    unlocked: boolean
    progress?: number
  }>
}

interface PremiumUserActionsProps {
  enableRealTime?: boolean
  enableAnimations?: boolean
  enableSounds?: boolean
  userProfile?: PremiumProfile
  onNotificationAction?: (action: string, notificationId: string) => void
  onProfileAction?: (action: string) => void
}

const PremiumUserActions: React.FC<PremiumUserActionsProps> = ({
  enableRealTime = true,
  enableAnimations = true,
  enableSounds = false,
  userProfile = {
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '+91 98765 43210',
    avatar: '👨‍💼',
    status: 'online',
    membership: 'premium',
    stats: {
      bookings: 47,
      savings: 12500,
      points: 3420,
      rating: 4.9,
      streak: 12,
      referrals: 8
    },
    achievements: [
      { id: '1', name: 'First Booking', icon: '🎯', unlocked: true },
      { id: '2', name: 'Super Saver', icon: '💰', unlocked: true },
      { id: '3', name: 'Rating Master', icon: '⭐', unlocked: true },
      { id: '4', name: 'Referral Champion', icon: '🤝', unlocked: false, progress: 80 }
    ]
  },
  onNotificationAction,
  onProfileAction
}) => {
  const [notifications, setNotifications] = useState<PremiumNotification[]>([
    {
      id: '1',
      type: 'emergency',
      priority: 'urgent',
      title: '🚨 Urgent: Service Cancellation',
      message: 'Your provider has cancelled today\'s booking due to emergency. We\'re finding a replacement.',
      time: 'Just now',
      unread: true,
      actions: [
        { label: 'Find New Provider', action: 'find_provider', primary: true },
        { label: 'Reschedule', action: 'reschedule' }
      ],
      metadata: {
        providerName: 'Rajesh Kumar',
        estimatedTime: '15 mins'
      }
    },
    {
      id: '2',
      type: 'booking',
      priority: 'high',
      title: 'Provider Arrived',
      message: 'Your service provider has arrived and is waiting at your location',
      time: '2 min ago',
      unread: true,
      actions: [
        { label: 'Track Location', action: 'track_location', primary: true },
        { label: 'Call Provider', action: 'call_provider' }
      ],
      metadata: {
        providerName: 'Priya Sharma',
        location: 'Main Gate'
      }
    },
    {
      id: '3',
      type: 'payment',
      priority: 'medium',
      title: 'Cashback Earned! 💰',
      message: 'You earned ₹150 cashback on your recent payment. Added to your wallet.',
      time: '1 hour ago',
      unread: true,
      actions: [
        { label: 'View Wallet', action: 'view_wallet', primary: true }
      ],
      metadata: {
        amount: '₹150'
      }
    },
    {
      id: '4',
      type: 'promo',
      priority: 'low',
      title: 'Elite Membership Offer',
      message: 'Upgrade to Elite and get unlimited free bookings + 30% cashback on all services',
      time: '3 hours ago',
      unread: false,
      actions: [
        { label: 'Upgrade Now', action: 'upgrade', primary: true },
        { label: 'Learn More', action: 'learn_more' }
      ]
    },
    {
      id: '5',
      type: 'system',
      priority: 'medium',
      title: 'New Achievement Unlocked! 🏆',
      message: 'You\'ve completed 10 bookings this month. You\'re on fire!',
      time: '1 day ago',
      unread: false,
      actions: [
        { label: 'View Achievements', action: 'view_achievements' }
      ]
    }
  ])

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'urgent' | 'bookings' | 'payments' | 'promos'>('all')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Real-time notification simulation
  useEffect(() => {
    if (!enableRealTime) return

    const interval = setInterval(() => {
      const randomNotifications: PremiumNotification[] = [
        {
          id: Date.now().toString(),
          type: 'booking',
          priority: 'high',
          title: 'Service Started',
          message: 'Your provider has started the service work',
          time: 'Just now',
          unread: true,
          metadata: {
            providerName: 'Service Team',
            estimatedTime: '45 mins'
          }
        },
        {
          id: Date.now().toString(),
          type: 'payment',
          priority: 'medium',
          title: 'Payment Reminder',
          message: 'Complete your payment for today\'s service to earn extra points',
          time: 'Just now',
          unread: true,
          metadata: {
            amount: '₹850'
          }
        },
        {
          id: Date.now().toString(),
          type: 'system',
          priority: 'low',
          title: 'App Update Available',
          message: 'New features and improvements are waiting for you',
          time: 'Just now',
          unread: true
        }
      ]

      if (Math.random() > 0.7) {
        const newNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
        setNotifications(prev => [newNotification, ...prev.slice(0, 14)])
        
        // Trigger animation
        if (enableAnimations) {
          setIsAnimating(true)
          setTimeout(() => setIsAnimating(false), 500)
        }

        // Play notification sound (if enabled)
        if (enableSounds) {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
          audio.play().catch(() => {}) // Ignore autoplay errors
        }
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [enableRealTime, enableAnimations, enableSounds])

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
  const urgentCount = notifications.filter(n => n.priority === 'urgent').length

  const filteredNotifications = notifications.filter(notification => {
    switch (activeFilter) {
      case 'unread':
        return notification.unread
      case 'urgent':
        return notification.priority === 'urgent' || notification.priority === 'high'
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

  const handleNotificationClick = (notification: PremiumNotification) => {
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, unread: false } : n)
    )
    onNotificationAction?.('view', notification.id)
  }

  const handleNotificationAction = (notification: PremiumNotification, action: string) => {
    console.log(`Action: ${action} for notification: ${notification.id}`)
    onNotificationAction?.(action, notification.id)
  }

  const handleProfileMenuClick = (action: string) => {
    setShowProfile(false)
    onProfileAction?.(action)
  }

  const getNotificationIcon = (type: string, priority: string) => {
    const baseIcons = {
      booking: '📅',
      payment: '💳',
      system: '⚙️',
      promo: '🎁',
      emergency: '🚨'
    }
    
    const priorityIndicators = {
      urgent: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢'
    }

    return priority === 'urgent' ? priorityIndicators.urgent : baseIcons[type as keyof typeof baseIcons] || '📢'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: '#ef4444',
      high: '#f59e0b',
      medium: '#3b82f6',
      low: '#10b981'
    }
    return colors[priority as keyof typeof colors] || '#64748b'
  }

  const getMembershipBadge = () => {
    const badges = {
      basic: { color: '#64748b', label: 'Basic' },
      premium: { color: '#8b5cf6', label: 'Premium' },
      elite: { color: '#f59e0b', label: 'Elite' }
    }
    return badges[userProfile.membership]
  }

  return (
    <div className="advanced-user-actions">
      {/* Enhanced Notification Button */}
      <div className="notification-container" ref={notificationRef}>
        <button 
          className={`notification-btn ${isAnimating ? 'animating' : ''}`}
          onClick={() => {
            setShowNotifications(!showNotifications)
            setShowProfile(false)
          }}
          style={{
            background: urgentCount > 0 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            color: urgentCount > 0 ? 'white' : '#1e293b',
            animation: isAnimating ? 'shake 0.5s ease-in-out' : 'none'
          }}
        >
          🔔
          <span className="notification-badge" style={{
            background: urgentCount > 0 
              ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
          }}>
            {unreadCount}
          </span>
        </button>

        {/* Enhanced Notification Dropdown */}
        <div className={`notification-dropdown ${showNotifications ? 'active' : ''}`} style={{
          width: '480px',
          maxHeight: '700px'
        }}>
          <div className="notification-header" style={{
            background: urgentCount > 0 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
          }}>
            <h3>
              Notifications
              <span className="notification-count">{notifications.length}</span>
              {urgentCount > 0 && (
                <span className="notification-count" style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                  marginLeft: '0.5rem'
                }}>
                  {urgentCount} Urgent
                </span>
              )}
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
                className={`filter-btn ${activeFilter === 'urgent' ? 'active' : ''}`}
                onClick={() => setActiveFilter('urgent')}
                style={{
                  background: activeFilter === 'urgent' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                }}
              >
                Urgent ({urgentCount})
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
              filteredNotifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.unread ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    borderLeft: `4px solid ${getPriorityColor(notification.priority)}`,
                    animation: enableAnimations ? `slideIn 0.3s ease-out ${index * 0.1}s both` : 'none'
                  }}
                >
                  <div className={`notification-icon ${notification.type}`} style={{
                    background: notification.priority === 'urgent' 
                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      : undefined
                  }}>
                    {getNotificationIcon(notification.type, notification.priority)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title" style={{
                      color: notification.priority === 'urgent' ? '#ef4444' : '#1e293b',
                      fontWeight: notification.priority === 'urgent' ? '700' : '600'
                    }}>
                      {notification.title}
                    </div>
                    <div className="notification-message">{notification.message}</div>
                    
                    {notification.metadata && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                        {notification.metadata.providerName && (
                          <div>Provider: {notification.metadata.providerName}</div>
                        )}
                        {notification.metadata.amount && (
                          <div>Amount: {notification.metadata.amount}</div>
                        )}
                        {notification.metadata.location && (
                          <div>Location: {notification.metadata.location}</div>
                        )}
                        {notification.metadata.estimatedTime && (
                          <div>ETA: {notification.metadata.estimatedTime}</div>
                        )}
                      </div>
                    )}
                    
                    <div className="notification-time">{notification.time}</div>
                    {notification.actions && (
                      <div className="notification-actions">
                        {notification.actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            className={`notification-action-btn ${action.primary ? 'primary' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleNotificationAction(notification, action.action)
                            }}
                            style={{
                              background: action.primary 
                                ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                                : 'rgba(59, 130, 246, 0.1)',
                              color: action.primary ? 'white' : '#3b82f6',
                              border: action.primary 
                                ? 'none'
                                : '1px solid rgba(59, 130, 246, 0.2)'
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
                padding: '3rem', 
                color: '#94a3b8',
                fontSize: '0.9rem'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <div>No notifications found</div>
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

      {/* Enhanced Profile Button */}
      <div className="profile-container" ref={profileRef}>
        <button 
          className="profile-btn"
          onClick={() => {
            setShowProfile(!showProfile)
            setShowNotifications(false)
          }}
          style={{
            background: userProfile.membership === 'elite' 
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : userProfile.membership === 'premium'
              ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            color: userProfile.membership !== 'basic' ? 'white' : '#1e293b'
          }}
        >
          👤
          {userProfile.status === 'online' && (
            <div style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '12px',
              height: '12px',
              background: '#10b981',
              border: '2px solid white',
              borderRadius: '50%'
            }} />
          )}
        </button>

        {/* Enhanced Profile Dropdown */}
        <div className={`profile-dropdown ${showProfile ? 'active' : ''}`} style={{
          width: '360px'
        }}>
          <div className="profile-header" style={{
            background: userProfile.membership === 'elite' 
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : userProfile.membership === 'premium'
              ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
              : 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
          }}>
            <div className="profile-avatar" style={{
              background: userProfile.membership === 'elite' 
                ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                : userProfile.membership === 'premium'
                ? 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)'
                : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              color: userProfile.membership === 'elite' 
                ? '#d97706'
                : userProfile.membership === 'premium'
                ? '#7c3aed'
                : '#64748b'
            }}>
              {userProfile.avatar}
              <div className="profile-status"></div>
            </div>
            <div className="profile-name">{userProfile.name}</div>
            <div className="profile-email">{userProfile.email}</div>
            <div className="profile-email" style={{ fontSize: '0.8rem', opacity: 0.8 }}>
              {userProfile.phone}
            </div>
            
            {/* Membership Badge */}
            <div style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              marginTop: '0.5rem'
            }}>
              {getMembershipBadge().label} Member
            </div>

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

            {/* Additional Stats */}
            <div className="profile-stats" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <div className="profile-stat">
                <div className="profile-stat-value">{userProfile.stats.streak}</div>
                <div className="profile-stat-label">Streak 🔥</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{userProfile.stats.referrals}</div>
                <div className="profile-stat-label">Referrals</div>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div style={{ padding: '1rem', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.75rem' }}>
              🏆 Achievements
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {userProfile.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: achievement.unlocked 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease'
                  }}
                  title={achievement.name}
                >
                  {achievement.icon}
                  {!achievement.unlocked && achievement.progress && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '16px',
                      height: '16px',
                      background: '#3b82f6',
                      color: 'white',
                      borderRadius: '50%',
                      fontSize: '0.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600'
                    }}>
                      {achievement.progress}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="profile-menu">
            <div className="menu-item" onClick={() => handleProfileMenuClick('account')}>
              <div className="menu-icon account">👤</div>
              <div className="menu-content">
                <div className="menu-title">My Account</div>
                <div className="menu-description">Manage profile and preferences</div>
              </div>
            </div>

            <div className="menu-item" onClick={() => handleProfileMenuClick('bookings')}>
              <div className="menu-icon bookings">📅</div>
              <div className="menu-content">
                <div className="menu-title">My Bookings</div>
                <div className="menu-description">View and manage bookings</div>
              </div>
              <span className="menu-badge" style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
              }}>3 Active</span>
            </div>

            <div className="menu-item" onClick={() => handleProfileMenuClick('wallet')}>
              <div className="menu-icon payments">💳</div>
              <div className="menu-content">
                <div className="menu-title">Wallet & Payments</div>
                <div className="menu-description">Balance: ₹2,450</div>
              </div>
            </div>

            <div className="menu-item" onClick={() => handleProfileMenuClick('rewards')}>
              <div className="menu-icon promo">🎁</div>
              <div className="menu-content">
                <div className="menu-title">Rewards & Offers</div>
                <div className="menu-description">5 new offers available</div>
              </div>
              <span className="menu-badge" style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              }}>New</span>
            </div>

            <div className="menu-item" onClick={() => handleProfileMenuClick('settings')}>
              <div className="menu-icon settings">⚙️</div>
              <div className="menu-content">
                <div className="menu-title">Settings</div>
                <div className="menu-description">App preferences and privacy</div>
              </div>
            </div>

            <div className="menu-item" onClick={() => handleProfileMenuClick('help')}>
              <div className="menu-icon help">❓</div>
              <div className="menu-content">
                <div className="menu-title">Help & Support</div>
                <div className="menu-description">24/7 customer support</div>
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

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-5deg); }
          75% { transform: translateX(5px) rotate(5deg); }
        }

        .notification-btn.animating {
          animation: shake 0.5s ease-in-out;
        }

        .notification-action-btn.primary {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
          color: white !important;
          border: none !important;
        }
      `}</style>
    </div>
  )
}

export default PremiumUserActions
