import React, { useState, useEffect, useRef, useCallback } from 'react'
import '../styles/AdvancedQuickActions.css'

interface QuickAction {
  id: number
  title: string
  description: string
  icon: string
  color: string
  category: string
  stats?: {
    bookings?: number
    rating?: number
    time?: string
    progress?: number
    active?: number
    revenue?: number
    growth?: number
  }
  badge?: 'new' | 'hot' | 'trending' | 'premium' | 'exclusive'
  featured?: boolean
  link?: string
  status?: 'active' | 'inactive' | 'maintenance' | 'beta'
  notifications?: number
  priority?: 'low' | 'medium' | 'high' | 'critical'
  metadata?: {
    lastUpdated?: string
    version?: string
    users?: number
  }
}

interface PremiumQuickActionsProps {
  actions?: QuickAction[]
  layout?: 'grid' | 'masonry' | 'carousel' | 'list'
  autoPlay?: boolean
  showProgress?: boolean
  enableRealTime?: boolean
  showAnalytics?: boolean
  enableKeyboard?: boolean
  onActionClick?: (action: QuickAction) => void
}

const PremiumQuickActions: React.FC<PremiumQuickActionsProps> = ({
  actions: propActions,
  layout = 'grid',
  autoPlay = false,
  showProgress = true,
  enableRealTime = true,
  showAnalytics = true,
  enableKeyboard = true,
  onActionClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [selectedAction, setSelectedAction] = useState<QuickAction | null>(null)
  const [loadingStates, setLoadingStates] = useState<Set<number>>(new Set())
  const [analytics, setAnalytics] = useState({
    totalClicks: 0,
    averageTime: 0,
    popularActions: [] as number[],
    conversionRate: 0
  })
  const carouselRef = useRef<HTMLDivElement>(null)
  const clickTimes = useRef<Record<number, number>>({})

  const premiumActions: QuickAction[] = [
    {
      id: 1,
      title: 'Track Booking',
      description: 'Monitor progress in real-time with live updates',
      icon: '📍',
      color: '#10b981',
      category: 'tracking',
      stats: { 
        bookings: 1234, 
        rating: 4.8, 
        time: '2-4 hrs', 
        progress: 75, 
        active: 89,
        revenue: 45678,
        growth: 12.5
      },
      featured: true,
      badge: 'premium',
      status: 'active',
      notifications: 3,
      priority: 'high',
      metadata: {
        lastUpdated: '2025-01-15',
        version: '2.1.0',
        users: 1234
      }
    },
    {
      id: 2,
      title: 'Book Service',
      description: 'AI-powered service booking with smart recommendations',
      icon: '📅',
      color: '#3b82f6',
      category: 'booking',
      stats: { 
        bookings: 2341, 
        rating: 4.9, 
        time: '1-2 hrs', 
        progress: 92, 
        active: 156,
        revenue: 78901,
        growth: 18.2
      },
      badge: 'trending',
      featured: true,
      status: 'active',
      notifications: 7,
      priority: 'high',
      metadata: {
        lastUpdated: '2025-01-14',
        version: '3.0.0',
        users: 2341
      }
    },
    {
      id: 3,
      title: 'Emergency Help',
      description: '24/7 emergency assistance with instant response',
      icon: '🚨',
      color: '#ef4444',
      category: 'emergency',
      stats: { 
        bookings: 567, 
        rating: 4.7, 
        time: '15-30 mins', 
        progress: 45, 
        active: 23,
        revenue: 23456,
        growth: 8.9
      },
      badge: 'new',
      status: 'active',
      notifications: 1,
      priority: 'critical',
      metadata: {
        lastUpdated: '2025-01-13',
        version: '1.5.0',
        users: 567
      }
    },
    {
      id: 4,
      title: 'Payment & Billing',
      description: 'Secure payment processing with multiple options',
      icon: '💳',
      color: '#8b5cf6',
      category: 'payment',
      stats: { 
        bookings: 3456, 
        rating: 4.6, 
        time: 'Instant', 
        progress: 88, 
        active: 234,
        revenue: 123456,
        growth: 15.3
      },
      status: 'active',
      notifications: 0,
      priority: 'medium',
      metadata: {
        lastUpdated: '2025-01-12',
        version: '4.2.1',
        users: 3456
      }
    },
    {
      id: 5,
      title: 'Service History',
      description: 'Complete service history with advanced analytics',
      icon: '📋',
      color: '#f59e0b',
      category: 'history',
      stats: { 
        bookings: 789, 
        rating: 4.5, 
        time: 'Available', 
        progress: 100, 
        active: 45,
        revenue: 34567,
        growth: 6.7
      },
      status: 'active',
      notifications: 0,
      priority: 'low',
      metadata: {
        lastUpdated: '2025-01-11',
        version: '2.0.3',
        users: 789
      }
    },
    {
      id: 6,
      title: 'Provider Reviews',
      description: 'Rate and review with AI sentiment analysis',
      icon: '⭐',
      color: '#ec4899',
      category: 'reviews',
      stats: { 
        bookings: 456, 
        rating: 4.8, 
        time: '2 mins', 
        progress: 67, 
        active: 78,
        revenue: 23456,
        growth: 22.1
      },
      badge: 'exclusive',
      status: 'beta',
      notifications: 2,
      priority: 'medium',
      metadata: {
        lastUpdated: '2025-01-10',
        version: '1.8.0',
        users: 456
      }
    }
  ]

  const actions = propActions || premiumActions

  // Auto-play carousel
  useEffect(() => {
    if (!isPlaying || layout !== 'carousel') return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % actions.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isPlaying, layout, actions.length])

  // Real-time updates
  useEffect(() => {
    if (!enableRealTime) return

    const interval = setInterval(() => {
      // Simulate real-time stat updates
      setAnalytics(prev => ({
        ...prev,
        totalClicks: prev.totalClicks + Math.floor(Math.random() * 3),
        conversionRate: Math.min(100, prev.conversionRate + Math.random() * 2)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [enableRealTime])

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboard) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (layout === 'carousel') {
        if (e.key === 'ArrowLeft') {
          setCurrentIndex((prev) => (prev - 1 + actions.length) % actions.length)
        } else if (e.key === 'ArrowRight') {
          setCurrentIndex((prev) => (prev + 1) % actions.length)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [layout, actions.length])

  // Mouse tracking for hover effects
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }, [])

  const handleActionClick = useCallback(async (action: QuickAction) => {
    const startTime = Date.now()
    clickTimes.current[action.id] = startTime

    setLoadingStates(prev => new Set(prev).add(action.id))
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update analytics
      const clickTime = Date.now() - startTime
      setAnalytics(prev => ({
        ...prev,
        totalClicks: prev.totalClicks + 1,
        averageTime: (prev.averageTime + clickTime) / 2,
        popularActions: [...prev.popularActions, action.id].slice(-5)
      }))
      
      onActionClick?.(action)
      setSelectedAction(action)
      
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setLoadingStates(prev => {
        const newSet = new Set(prev)
        newSet.delete(action.id)
        return newSet
      })
    }
  }, [onActionClick])

  const getCardClasses = (action: QuickAction) => {
    const classes = ['quick-action-card']
    
    if (loadingStates.has(action.id)) classes.push('loading')
    if (selectedAction?.id === action.id) classes.push('selected')
    if (hoveredCard === action.id) classes.push('hovered')
    if (action.featured) classes.push('featured')
    if (action.badge === 'premium') classes.push('premium')
    if (action.badge === 'exclusive') classes.push('exclusive')
    if (action.badge === 'new') classes.push('new')
    if (action.priority === 'critical') classes.push('critical')
    
    return classes.join(' ')
  }

  const renderCarousel = () => (
    <div className="carousel-container" ref={carouselRef}>
      <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {actions.map((action) => (
          <div key={action.id} className="carousel-slide">
            <button
              className={getCardClasses(action)}
              style={{ '--action-color': action.color } as React.CSSProperties}
              onClick={() => handleActionClick(action)}
              disabled={loadingStates.has(action.id)}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setHoveredCard(action.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h3 className="action-title">{action.title}</h3>
                <p className="action-description">{action.description}</p>
                
                {showAnalytics && action.stats && (
                  <div className="action-stats">
                    <div className="stat-item">
                      <div className="stat-value">{action.stats.bookings?.toLocaleString()}</div>
                      <div className="stat-label">Bookings</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{action.stats.rating}</div>
                      <div className="stat-label">Rating</div>
                    </div>
                    {action.stats.revenue && (
                      <div className="stat-item">
                        <div className="stat-value">${action.stats.revenue.toLocaleString()}</div>
                        <div className="stat-label">Revenue</div>
                      </div>
                    )}
                  </div>
                )}

                {showProgress && action.stats?.progress !== undefined && (
                  <div className="action-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${action.stats.progress}%` }} />
                    </div>
                    <div className="progress-text">{action.stats.progress}% Complete</div>
                  </div>
                )}

                {action.metadata && (
                  <div className="action-badges">
                    <span className="action-badge">v{action.metadata.version}</span>
                    {action.metadata.users && (
                      <span className="action-badge">{action.metadata.users} users</span>
                    )}
                  </div>
                )}
              </div>
              <div className="action-arrow">→</div>
              <div className="action-ripple" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="carousel-controls">
        <button onClick={() => setCurrentIndex((prev) => (prev - 1 + actions.length) % actions.length)}>
          ←
        </button>
        <div className="carousel-indicators">
          {actions.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
        <button onClick={() => setCurrentIndex((prev) => (prev + 1) % actions.length)}>
          →
        </button>
      </div>
    </div>
  )

  const renderGrid = () => (
    <div className="quick-actions-grid">
      {actions.map((action, index) => (
        <button
          key={action.id}
          className={getCardClasses(action)}
          style={{ 
            '--action-color': action.color,
            animationDelay: `${index * 0.1}s`
          } as React.CSSProperties}
          onClick={() => handleActionClick(action)}
          disabled={loadingStates.has(action.id)}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHoveredCard(action.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="action-icon">{action.icon}</div>
          <div className="action-content">
            <h3 className="action-title">{action.title}</h3>
            <p className="action-description">{action.description}</p>
            
            {showAnalytics && action.stats && (
              <div className="action-stats">
                {action.stats.bookings && (
                  <div className="stat-item">
                    <div className="stat-value">{action.stats.bookings.toLocaleString()}</div>
                    <div className="stat-label">Bookings</div>
                  </div>
                )}
                {action.stats.rating && (
                  <div className="stat-item">
                    <div className="stat-value">{action.stats.rating}</div>
                    <div className="stat-label">Rating</div>
                  </div>
                )}
                {action.stats.active && (
                  <div className="stat-item">
                    <div className="stat-value">{action.stats.active}</div>
                    <div className="stat-label">Active</div>
                  </div>
                )}
              </div>
            )}

            {showProgress && action.stats?.progress !== undefined && (
              <div className="action-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${action.stats.progress}%` }} />
                </div>
                <div className="progress-text">{action.stats.progress}% Complete</div>
              </div>
            )}

            {action.status && (
              <div className="action-status">
                <span className="status-dot"></span>
                <span>{action.status.charAt(0).toUpperCase() + action.status.slice(1)}</span>
              </div>
            )}

            {action.stats?.time && (
              <div className="action-badges">
                <span className="action-badge">⏱️ {action.stats.time}</span>
                {action.notifications && (
                  <span className="action-badge">🔔 {action.notifications}</span>
                )}
                {action.priority && (
                  <span className="action-badge priority-{action.priority}">
                    {action.priority.toUpperCase()}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="action-arrow">→</div>
          <div className="action-ripple" />
        </button>
      ))}
    </div>
  )

  return (
    <div className="advanced-quick-actions premium">
      <div className="actions-header">
        <h1>Premium Quick Actions</h1>
        <p>Advanced features with real-time analytics and intelligent interactions</p>
        
        {showAnalytics && (
          <div className="analytics-summary">
            <div className="analytics-item">
              <span className="analytics-value">{analytics.totalClicks.toLocaleString()}</span>
              <span className="analytics-label">Total Clicks</span>
            </div>
            <div className="analytics-item">
              <span className="analytics-value">{analytics.conversionRate.toFixed(1)}%</span>
              <span className="analytics-label">Conversion Rate</span>
            </div>
            <div className="analytics-item">
              <span className="analytics-value">{analytics.averageTime.toFixed(0)}ms</span>
              <span className="analytics-label">Avg. Response</span>
            </div>
          </div>
        )}
      </div>

      {/* Layout Controls */}
      <div className="layout-controls">
        <div className="control-group">
          <label>Layout:</label>
          <select value={layout} onChange={(e) => setCurrentIndex(0)}>
            <option value="grid">Grid</option>
            <option value="carousel">Carousel</option>
            <option value="masonry">Masonry</option>
            <option value="list">List</option>
          </select>
        </div>
        
        {layout === 'carousel' && (
          <div className="control-group">
            <button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
          </div>
        )}
        
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showProgress}
              onChange={(e) => setShowProgress(e.target.checked)}
            />
            Show Progress
          </label>
        </div>
      </div>

      {/* Render Layout */}
      {layout === 'carousel' ? renderCarousel() : renderGrid()}

      {/* Selected Action Details */}
      {selectedAction && (
        <div className="action-details-modal">
          <div className="modal-content">
            <h2>{selectedAction.title}</h2>
            <p>{selectedAction.description}</p>
            {selectedAction.metadata && (
              <div className="metadata">
                <p>Version: {selectedAction.metadata.version}</p>
                <p>Last Updated: {selectedAction.metadata.lastUpdated}</p>
                <p>Users: {selectedAction.metadata.users?.toLocaleString()}</p>
              </div>
            )}
            <button onClick={() => setSelectedAction(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PremiumQuickActions
