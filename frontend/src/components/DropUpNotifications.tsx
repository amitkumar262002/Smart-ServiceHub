import React, { useState, useEffect, useRef } from 'react'
import '../styles/DropUpNotifications.css'

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

interface DropUpNotificationsProps {
  notifications?: Notification[]
  onNotificationClick?: (notification: Notification) => void
  onActionClick?: (action: string, notificationId: string) => void
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
  showBadge?: boolean
  autoClose?: boolean
}

const DropUpNotifications: React.FC<DropUpNotificationsProps> = ({
  notifications = [
    {
      id: '1',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your plumbing service is confirmed for tomorrow',
      time: '18:55:03',
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
      message: 'Provider sent you an update about your service',
      time: '17:55:03',
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
      time: '16:55:03',
      unread: false,
      actions: [
        { label: 'Pay Now', action: 'pay_now' }
      ]
    }
  ],
  onNotificationClick,
  onActionClick,
  position = 'bottom-right',
  showBadge = true,
  autoClose = false
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

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
      case 'bottom-left':
        return { right: 'auto', left: 0 }
      case 'bottom-center':
        return { right: '50%', transform: 'translateX(50%)' }
      default:
        return { right: 0 }
    }
  }

  return (
    <div className="drop-up-container" ref={dropdownRef}>
      <button
        className="drop-up-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔 Notifications
        {showBadge && unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      <div className={`drop-up-dropdown ${isOpen ? 'active' : ''}`} style={getPositionStyles()}>
        <div className="drop-up-header">
          <h4>
            Notifications
            <span className="notification-count">{notificationList.length}</span>
          </h4>
        </div>

        <div className="drop-up-list">
          {notificationList.length > 0 ? (
            notificationList.map((notification, index) => (
              <div
                key={notification.id}
                className={`drop-up-item ${notification.unread ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`drop-up-icon ${notification.type}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="drop-up-content">
                  <div className="drop-up-title">{notification.title}</div>
                  <div className="drop-up-message">{notification.message}</div>
                  <div className="drop-up-time">{notification.time}</div>
                  {notification.actions && (
                    <div className="drop-up-actions">
                      {notification.actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          className="drop-up-action-btn"
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
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div>No notifications</div>
            </div>
          )}
        </div>

        {unreadCount > 0 && (
          <div className="drop-up-footer">
            <button className="mark-all-read-btn" onClick={markAllAsRead}>
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DropUpNotifications
