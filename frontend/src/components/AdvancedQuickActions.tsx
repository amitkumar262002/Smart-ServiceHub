import React, { useState, useEffect, useCallback } from 'react'
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
  }
  badge?: 'new' | 'hot' | 'trending' | 'premium' | 'exclusive'
  featured?: boolean
  link?: string
  status?: 'active' | 'inactive' | 'maintenance'
  notifications?: number
}

interface AdvancedQuickActionsProps {
  actions?: QuickAction[]
  showCategories?: boolean
  showSearch?: boolean
  maxItems?: number
  enableRealTime?: boolean
  onActionClick?: (action: QuickAction) => void
}

const AdvancedQuickActions: React.FC<AdvancedQuickActionsProps> = ({
  actions: propActions,
  showCategories = true,
  showSearch = true,
  maxItems = 6,
  enableRealTime = true,
  onActionClick
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingStates, setLoadingStates] = useState<Set<number>>(new Set())
  const [successStates, setSuccessStates] = useState<Set<number>>(new Set())
  const [errorStates, setErrorStates] = useState<Set<number>>(new Set())
  const [progressData, setProgressData] = useState<Record<number, number>>({})

  const defaultActions: QuickAction[] = [
    {
      id: 1,
      title: 'Track Booking',
      description: 'Monitor progress in real-time',
      icon: 'ðŸ“',
      color: '#10b981',
      category: 'tracking',
      stats: { bookings: 1234, rating: 4.8, time: '2-4 hrs', progress: 75, active: 89 },
      featured: true,
      link: '/track-booking',
      status: 'active',
      notifications: 3
    },
    {
      id: 2,
      title: 'Book Service',
      description: 'Schedule a professional service at your convenience',
      icon: 'ðŸ“…',
      color: '#3b82f6',
      category: 'booking',
      stats: { bookings: 2341, rating: 4.9, time: '1-2 hrs', progress: 92, active: 156 },
      badge: 'hot',
      link: '/book-service',
      status: 'active'
    },
    {
      id: 3,
      title: 'Emergency Help',
      description: 'Get immediate assistance for urgent issues',
      icon: 'ðŸš¨',
      color: '#ef4444',
      category: 'emergency',
      stats: { bookings: 567, rating: 4.7, time: '15-30 mins', progress: 45, active: 23 },
      badge: 'new',
      link: '/emergency',
      status: 'active'
    },
    {
      id: 4,
      title: 'Payment & Billing',
      description: 'Manage payments and view billing history',
      icon: 'ðŸ’³',
      color: '#8b5cf6',
      category: 'payment',
      stats: { bookings: 3456, rating: 4.6, time: 'Instant', progress: 88, active: 234 },
      link: '/payments',
      status: 'active'
    },
    {
      id: 5,
      title: 'Service History',
      description: 'View your complete service history and records',
      icon: 'ðŸ“‹',
      color: '#f59e0b',
      category: 'history',
      stats: { bookings: 789, rating: 4.5, time: 'Available', progress: 100, active: 45 },
      link: '/history',
      status: 'active'
    },
    {
      id: 6,
      title: 'Provider Reviews',
      description: 'Rate and review service providers',
      icon: 'â­',
      color: '#ec4899',
      category: 'reviews',
      stats: { bookings: 456, rating: 4.8, time: '2 mins', progress: 67, active: 78 },
      badge: 'premium',
      link: '/reviews',
      status: 'active'
    },
    {
      id: 7,
      title: 'Live Chat Support',
      description: 'Connect with customer support instantly',
      icon: 'ðŸ’¬',
      color: '#06b6d4',
      category: 'support',
      stats: { bookings: 234, rating: 4.9, time: 'Instant', progress: 95, active: 12 },
      link: '/chat',
      status: 'active'
    },
    {
      id: 8,
      title: 'Service Analytics',
      description: 'View detailed analytics and insights',
      icon: 'ðŸ“Š',
      color: '#84cc16',
      category: 'analytics',
      stats: { bookings: 123, rating: 4.7, time: 'Real-time', progress: 82, active: 34 },
      badge: 'trending',
      link: '/analytics',
      status: 'active'
    }
  ]

  const actions = propActions || defaultActions

  // Real-time progress simulation
  useEffect(() => {
    if (!enableRealTime) return

    const interval = setInterval(() => {
      setProgressData(prev => {
        const updated = { ...prev }
        actions.forEach(action => {
          if (action.stats?.progress !== undefined) {
            const currentProgress = prev[action.id] || action.stats.progress
            const change = Math.floor(Math.random() * 11) - 5 // -5 to +5
            updated[action.id] = Math.max(0, Math.min(100, currentProgress + change))
          }
        })
        return updated
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [actions, enableRealTime])

  // Simulate real-time notifications
  useEffect(() => {
    if (!enableRealTime) return

    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const randomAction = actions[Math.floor(Math.random() * actions.length)]
        console.log(`New notification for ${randomAction.title}`)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [actions, enableRealTime])

  const categories = [
    { id: 'all', name: 'All Actions', icon: 'ðŸŽ¯' },
    { id: 'booking', name: 'Booking', icon: 'ðŸ“…' },
    { id: 'tracking', name: 'Tracking', icon: 'ðŸ“' },
    { id: 'payment', name: 'Payment', icon: 'ðŸ’³' },
    { id: 'emergency', name: 'Emergency', icon: 'ðŸš¨' },
    { id: 'support', name: 'Support', icon: 'ðŸ’¬' }
  ]

  const filteredActions = actions.filter(action => {
    const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory
    const matchesSearch = action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         action.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  }).slice(0, maxItems)

  const handleActionClick = useCallback(async (action: QuickAction) => {
    // Add loading state
    setLoadingStates(prev => new Set(prev).add(action.id))
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Add success state
      setSuccessStates(prev => new Set(prev).add(action.id))
      
      // Call parent callback
      onActionClick?.(action)
      
      // Remove success state after delay
      setTimeout(() => {
        setSuccessStates(prev => {
          const newSet = new Set(prev)
          newSet.delete(action.id)
          return newSet
        })
      }, 2000)
      
    } catch (error) {
      // Add error state
      setErrorStates(prev => new Set(prev).add(action.id))
      
      // Remove error state after delay
      setTimeout(() => {
        setErrorStates(prev => {
          const newSet = new Set(prev)
          newSet.delete(action.id)
          return newSet
        })
      }, 2000)
    } finally {
      // Remove loading state
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
    if (successStates.has(action.id)) classes.push('success')
    if (errorStates.has(action.id)) classes.push('error')
    if (action.featured) classes.push('featured')
    if (action.badge === 'premium') classes.push('premium')
    if (action.badge === 'new') classes.push('new')
    
    return classes.join(' ')
  }

  const getProgress = (action: QuickAction) => {
    return progressData[action.id] || action.stats?.progress || 0
  }

  return (
    <div className="advanced-quick-actions">
      <div className="actions-header">
        <h1>Quick Actions</h1>
        <p>Access all your services and features in one place</p>
      </div>

      {/* Search and Categories */}
      {(showSearch || showCategories) && (
        <div style={{ marginBottom: '3rem', position: 'relative', zIndex: 2 }}>
          {showSearch && (
            <div style={{ marginBottom: '2rem' }}>
              <input
                type="text"
                placeholder="Search actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '1rem 1.5rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6'
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          )}

          {showCategories && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: selectedCategory === category.id 
                      ? '2px solid #3b82f6' 
                      : '2px solid #e2e8f0',
                    background: selectedCategory === category.id 
                      ? 'rgba(59, 130, 246, 0.1)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: selectedCategory === category.id ? '#3b82f6' : '#64748b'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.borderColor = '#3b82f6'
                      e.currentTarget.style.color = '#3b82f6'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.borderColor = '#e2e8f0'
                      e.currentTarget.style.color = '#64748b'
                    }
                  }}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions Grid */}
      <div className="quick-actions-grid">
        {filteredActions.map((action, index) => (
          <button
            key={action.id}
            className={getCardClasses(action)}
            style={{ '--action-color': action.color } as React.CSSProperties}
            onClick={() => handleActionClick(action)}
            disabled={loadingStates.has(action.id)}
            style={{
              '--action-color': action.color,
              animationDelay: `${index * 0.1}s`
            } as React.CSSProperties}
          >
            <div className="action-icon">{action.icon}</div>
            <div className="action-content">
              <h3 className="action-title">{action.title}</h3>
              <p className="action-description">{action.description}</p>
              
              {/* Stats */}
              {action.stats && (
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

              {/* Progress Bar */}
              {action.stats?.progress !== undefined && (
                <div className="action-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${getProgress(action)}%` }}
                    />
                  </div>
                  <div className="progress-text">{getProgress(action)}% Complete</div>
                </div>
              )}

              {/* Status */}
              {action.status && (
                <div className="action-status">
                  <span className="status-dot"></span>
                  <span>{action.status.charAt(0).toUpperCase() + action.status.slice(1)}</span>
                </div>
              )}

              {/* Badges */}
              {action.stats?.time && (
                <div className="action-badges">
                  <span className="action-badge">â±ï¸ {action.stats.time}</span>
                  {action.notifications && (
                    <span className="action-badge">ðŸ”” {action.notifications}</span>
                  )}
                </div>
              )}
            </div>
            <div className="action-arrow">â†’</div>
            <div className="action-ripple"></div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredActions.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: '#64748b'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>ðŸ”</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1e293b' }}>
            No actions found
          </h3>
          <p>Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  )
}

export default AdvancedQuickActions

  const defaultActions: QuickAction[] = [
    {
      id: 1,
      title: 'Book Service',
      description: 'Schedule a professional service at your convenience',
      icon: 'ðŸ“…',
      color: '#3b82f6',
      category: 'booking',
      stats: { bookings: 1234, rating: 4.8, time: '2-4 hrs' },
      featured: true,
      link: '/book-service'
    },
    {
      id: 2,
      title: 'Track Booking',
      description: 'Monitor your service status in real-time',
      icon: 'ðŸ“',
      color: '#10b981',
      category: 'tracking',
      stats: { bookings: 856, rating: 4.9, time: 'Live' },
      link: '/track-booking'
    },
    {
      id: 3,
      title: 'Emergency Help',
      description: 'Get immediate assistance for urgent issues',
      icon: '🚨',
      color: '#ef4444',
      category: 'emergency',
      stats: { bookings: 432, rating: 4.9, time: '24/7' },
      badge: 'new',
      link: '/emergency'
    },
    {
      id: 4,
      title: 'Support Center',
      description: 'Get help from our customer support team',
      icon: '💬',
      color: '#8b5cf6',
      category: 'support',
      stats: { bookings: 1567, rating: 4.6, time: 'Quick' },
      link: '/support'
    },
    {
      id: 5,
      title: 'Service History',
      description: 'View your past service bookings and receipts',
      icon: '📋',
      color: '#06b6d4',
      category: 'history',
      stats: { bookings: 892, rating: 4.8, time: 'Archive' },
      link: '/bookings'
    },
    {
      id: 6,
      title: 'Payment Methods',
      description: 'Manage your payment options and transactions',
      icon: '💳',
      color: '#3b82f6',
      category: 'payment',
      stats: { bookings: 3456, rating: 4.9, time: 'Secure' },
      badge: 'trending',
      link: '/payment'
    },
    {
      id: 7,
      title: 'Profile Settings',
      description: 'Customize your account and preferences',
      icon: '⚙️',
      color: '#64748b',
      category: 'profile',
      stats: { bookings: 789, rating: 4.5, time: 'Settings' },
      link: '/profile'
    }
  ]

  const actions = propActions || defaultActions

  const categories = [
    { id: 'all', name: 'All Services', icon: '🌟' },
    { id: 'booking', name: 'Booking', icon: '📅' },
    { id: 'tracking', name: 'Tracking', icon: '📍' },
    { id: 'emergency', name: 'Emergency', icon: '🚨' },
    { id: 'support', name: 'Support', icon: '💬' },
    { id: 'payment', name: 'Payment', icon: '💳' },
    { id: 'profile', name: 'Profile', icon: '⚙️' }
  ]

  const filteredActions = actions
    .filter(action => {
      const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory
      const matchesSearch = action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           action.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .slice(0, maxItems)

  const handleActionClick = async (action: QuickAction) => {
    if (!action.link) return

    // Set loading state
    setLoadingStates(prev => new Set(prev).add(action.id))

    // Simulate navigation or API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Clear loading and set success
    setLoadingStates(prev => {
      const newSet = new Set(prev)
      newSet.delete(action.id)
      return newSet
    })

    setSuccessStates(prev => new Set(prev).add(action.id))

    // Clear success after delay
    setTimeout(() => {
      setSuccessStates(prev => {
        const newSet = new Set(prev)
        newSet.delete(action.id)
        return newSet
      })
    }, 2000)

    // Navigate (in real app, use React Router)
    console.log(`Navigating to: ${action.link}`)
  }

  const getBadgeClass = (badge?: string) => {
    switch (badge) {
      case 'new': return 'new'
      case 'hot': return 'hot'
      case 'trending': return 'trending'
      default: return ''
    }
  }

  return (
    <div className="advanced-quick-actions">
      <div className="actions-header">
        <h1>Quick Actions</h1>
        <p>Access all our services and features with one click</p>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="actions-search">
          <input
            type="text"
            className="search-input"
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">ðŸ”</span>
        </div>
      )}

      {/* Category Filters */}
      {showCategories && (
        <div className="categories-section">
          <div className="actions-categories">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span style={{ marginRight: '0.5rem' }}>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions Grid */}
      <div className="actions-grid">
        {filteredActions.map(action => (
          <button
            key={action.id}
            className={`quick-action-card ${action.featured ? 'featured' : ''} ${
              loadingStates.has(action.id) ? 'loading' : ''
            } ${successStates.has(action.id) ? 'success' : ''}`}
            data-action-color={action.color}
            onClick={() => handleActionClick(action)}
            disabled={loadingStates.has(action.id)}
          >
            {action.badge && (
              <span className={`action-badge ${getBadgeClass(action.badge)}`}>
                {action.badge}
              </span>
            )}

            <div className="action-content">
              <div className="action-header">
                <div className="action-icon">{action.icon}</div>
                <div className="action-text">
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                </div>
              </div>

              <div className="action-footer">
                <div className="action-stats">
                  {action.stats?.bookings && (
                    <div className="stat-item">
                      <span>ðŸ“Š</span>
                      <span>{action.stats.bookings.toLocaleString()}</span>
                    </div>
                  )}
                  {action.stats?.rating && (
                    <div className="stat-item">
                      <span>â­</span>
                      <span>{action.stats.rating}</span>
                    </div>
                  )}
                  {action.stats?.time && (
                    <div className="stat-item">
                      <span>â±ï¸</span>
                      <span>{action.stats.time}</span>
                    </div>
                  )}
                </div>
                <div className="action-arrow">
                  {loadingStates.has(action.id) ? 'â³' : 'â†’'}
                </div>
              </div>
            </div>

            <div className="action-ripple"></div>
          </button>
        ))}
      </div>

      {/* No Results State */}
      {filteredActions.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          color: '#64748b'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>ðŸ”</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1e293b' }}>
            No services found
          </h3>
          <p>Try adjusting your search or browse all categories</p>
        </div>
      )}
    </div>
  )
export default AdvancedQuickActions

