import React, { useState, useEffect, useRef } from 'react'
import '../styles/FixedNotifications.css'

interface Notification {
  id: string
  type: 'booking' | 'message' | 'payment' | 'system'
  title: string
  message: string
  time: string
  unread: boolean
  actions?: Array<{
    label: string
    action: string
  }>
}

interface FixedNotificationsProps {
  notifications?: Notification[]
  onNotificationClick?: (notification: Notification) => void
  onActionClick?: (action: string, notificationId: string) => void
  showBadge?: boolean
  autoClose?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

const FixedNotifications: React.FC<FixedNotificationsProps> = ({
  notifications = [
    {
      id: '1',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your plumbing service is confirmed for tomorrow',
      time: '19:07:34',
      unread: true,
      actions: [
        { label: 'View Details', action: 'view_details' },
        { label: 'Reschedule', action: 'reschedule' }
      ]
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      message: 'Provider sent you an update',
      time: '18:07:34',
      unread: true,
      actions: [
        { label: 'Read Message', action: 'read_message' },
        { label: 'Reply', action: 'reply' }
      ]
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Due',
      message: 'Complete payment for your recent service',
      time: '17:07:34',
      unread: false,
      actions: [
        { label: 'Pay Now', action: 'pay_now' }
      ]
    }
  ],
  onNotificationClick,
  onActionClick,
  showBadge = true,
  autoClose = false,
  position = 'top-right'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationList, setNotificationList] = useState(notifications)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          id: Date.now().toString(),
          type: 'booking' as const,
          title: 'Service Started',
          message: 'Your provider has started the service',
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          unread: true
        },
        {
          id: Date.now().toString(),
          type: 'message' as const,
          title: 'Provider Update',
          message: 'Provider is 10 minutes away',
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          unread: true
        },
        {
          id: Date.now().toString(),
          type: 'system' as const,
          title: 'System Update',
          message: 'New features available in your app',
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          unread: false
        }
      ]

      if (Math.random() > 0.8) {
        const newNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
        setNotificationList(prev => [newNotification, ...prev.slice(0, 9)])
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  // Auto close functionality
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        setIsOpen(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, autoClose])

  const unreadCount = notificationList.filter(n => n.unread).length

  const markAllAsRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const handleNotificationClick = (notification: Notification) => {
    setNotificationList(prev => 
      prev.map(n => n.id === notification.id ? { ...n, unread: false } : n)
    )
    onNotificationClick?.(notification)
    
    // Auto close after clicking
    if (autoClose) {
      setIsOpen(false)
    }
  }

  const handleActionClick = (action: string, notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    onActionClick?.(action, notificationId)
    
    // Auto close after action
    if (autoClose) {
      setIsOpen(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    const icons = {
      booking: '📅',
      message: '💬',
      payment: '💳',
      system: '⚙️'
    }
    return icons[type as keyof typeof icons] || '📢'
  }

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return { right: 'auto', left: 0 }
      case 'bottom-right':
        return { 
          top: 'auto', 
          bottom: 'calc(100% + 1rem)',
          right: 0 
        }
      case 'bottom-left':
        return { 
          top: 'auto', 
          bottom: 'calc(100% + 1rem)',
          right: 'auto', 
          left: 0 
        }
      default:
        return { right: 0 }
    }
  }

  const getDropdownPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return { right: 'auto', left: 0 }
      case 'bottom-right':
        return { 
          top: 'auto', 
          bottom: 'calc(100% + 1rem)',
          right: 0 
        }
      case 'bottom-left':
        return { 
          top: 'auto', 
          bottom: 'calc(100% + 1rem)',
          right: 'auto', 
          left: 0 
        }
      default:
        return { right: 0 }
    }
  }

  return (
    <div className="notifications-container" ref={dropdownRef}>
      <button
        className="notification-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        🔔
        {showBadge && unreadCount > 0 && (
          <span className="notification-badge" aria-label={`${unreadCount} unread notifications`}>
            {unreadCount}
          </span>
        )}
      </button>

      <div className={`notifications-dropdown ${isOpen ? 'active' : ''}`} style={getDropdownPositionStyles()}>
        <div className="notifications-header">
          <h4>
            Notifications
            <span className="notification-count-header">{notificationList.length}</span>
          </h4>
        </div>

        <div className="notifications-list">
          {notificationList.length > 0 ? (
            notificationList.map((notification, index) => (
              <div
                key={notification.id}
                className={`notification-item ${notification.unread ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
                style={{ animationDelay: `${index * 0.1}s` }}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleNotificationClick(notification)
                  }
                }}
              >
                <div className={`notification-icon ${notification.type}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">{notification.time}</div>
                  {notification.actions && (
                    <div className="notification-actions">
                      {notification.actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          className="notification-action-btn"
                          onClick={(e) => handleActionClick(action.action, notification.id, e)}
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
            <div className="empty-notifications">
              <div className="empty-notifications-icon">📭</div>
              <div>No notifications</div>
            </div>
          )}
        </div>

        {unreadCount > 0 && (
          <div className="notifications-footer">
            <button className="mark-all-read-btn" onClick={markAllAsRead}>
              Mark all as read
            </button>
          </div>
        )}
      </div>

      {/* Overlay for mobile and better UX */}
      {isOpen && (
        <div 
          className="notifications-overlay active" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default FixedNotifications
