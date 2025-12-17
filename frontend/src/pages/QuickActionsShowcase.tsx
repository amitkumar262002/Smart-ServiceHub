import React, { useState } from 'react'
import AdvancedQuickActions from '../components/AdvancedQuickActions'
import PremiumQuickActions from '../components/PremiumQuickActions'

const QuickActionsShowcase: React.FC = () => {
  const [componentType, setComponentType] = useState<'advanced' | 'premium'>('advanced')
  const [layoutMode, setLayoutMode] = useState<'grid' | 'masonry' | 'carousel' | 'list'>('grid')
  const [showCategories, setShowCategories] = useState(true)
  const [showSearch, setShowSearch] = useState(true)
  const [enableRealTime, setEnableRealTime] = useState(true)
  const [showAnalytics, setShowAnalytics] = useState(true)
  const [autoPlay, setAutoPlay] = useState(false)

  const customActions = [
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
      badge: 'premium' as const,
      status: 'active' as const,
      notifications: 3,
      priority: 'high' as const,
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
      badge: 'trending' as const,
      featured: true,
      status: 'active' as const,
      notifications: 7,
      priority: 'high' as const,
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
      badge: 'new' as const,
      status: 'active' as const,
      notifications: 1,
      priority: 'critical' as const,
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
      status: 'active' as const,
      notifications: 0,
      priority: 'medium' as const,
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
      status: 'active' as const,
      notifications: 0,
      priority: 'low' as const,
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
      badge: 'exclusive' as const,
      status: 'beta' as const,
      notifications: 2,
      priority: 'medium' as const,
      metadata: {
        lastUpdated: '2025-01-10',
        version: '1.8.0',
        users: 456
      }
    }
  ]

  const handleActionClick = (action: any) => {
    console.log('Action clicked:', action)
    alert(`Action: ${action.title}\nCategory: ${action.category}\nStatus: ${action.status}\nPriority: ${action.priority}`)
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem'
    }}>
      {/* Control Panel */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        minWidth: '320px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ 
          margin: '0 0 1.5rem 0', 
          fontSize: '1.3rem', 
          fontWeight: '700',
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🎛️ Advanced Controls
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Component Type */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem',
              fontSize: '0.9rem', 
              fontWeight: '600',
              color: '#64748b'
            }}>
              Component Type
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setComponentType('advanced')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: componentType === 'advanced' 
                    ? '2px solid #3b82f6' 
                    : '2px solid #e2e8f0',
                  background: componentType === 'advanced' 
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'transparent',
                  color: componentType === 'advanced' 
                    ? '#3b82f6'
                    : '#64748b',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                ✨ Advanced
              </button>
              <button
                onClick={() => setComponentType('premium')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: componentType === 'premium' 
                    ? '2px solid #3b82f6' 
                    : '2px solid #e2e8f0',
                  background: componentType === 'premium' 
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'transparent',
                  color: componentType === 'premium' 
                    ? '#3b82f6'
                    : '#64748b',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                💎 Premium
              </button>
            </div>
          </div>

          {/* Layout Mode (for Premium) */}
          {componentType === 'premium' && (
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.75rem',
                fontSize: '0.9rem', 
                fontWeight: '600',
                color: '#64748b'
              }}>
                Layout Mode
              </label>
              <select
                value={layoutMode}
                onChange={(e) => setLayoutMode(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  background: 'white',
                  color: '#1e293b',
                  cursor: 'pointer'
                }}
              >
                <option value="grid">Grid</option>
                <option value="carousel">Carousel</option>
                <option value="masonry">Masonry</option>
                <option value="list">List</option>
              </select>
            </div>
          )}

          {/* Feature Toggles */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem',
              fontSize: '0.9rem', 
              fontWeight: '600',
              color: '#64748b'
            }}>
              Features
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: '#64748b'
              }}>
                <input 
                  type="checkbox" 
                  checked={showCategories}
                  onChange={(e) => setShowCategories(e.target.checked)}
                  style={{ cursor: 'pointer' }} 
                />
                📂 Show Categories
              </label>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: '#64748b'
              }}>
                <input 
                  type="checkbox" 
                  checked={showSearch}
                  onChange={(e) => setShowSearch(e.target.checked)}
                  style={{ cursor: 'pointer' }} 
                />
                🔍 Show Search
              </label>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: '#64748b'
              }}>
                <input 
                  type="checkbox" 
                  checked={enableRealTime}
                  onChange={(e) => setEnableRealTime(e.target.checked)}
                  style={{ cursor: 'pointer' }} 
                />
                🔄 Real-time Updates
              </label>
              {componentType === 'premium' && (
                <>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    color: '#64748b'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={showAnalytics}
                      onChange={(e) => setShowAnalytics(e.target.checked)}
                      style={{ cursor: 'pointer' }} 
                    />
                    📊 Show Analytics
                  </label>
                  {layoutMode === 'carousel' && (
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: '#64748b'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={autoPlay}
                        onChange={(e) => setAutoPlay(e.target.checked)}
                        style={{ cursor: 'pointer' }} 
                      />
                        ▶️ Auto Play Carousel
                    </label>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Status */}
          <div style={{
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            fontSize: '0.85rem',
            color: '#64748b'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Component:</span>
              <span style={{ fontWeight: '600' }}>{componentType}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Layout:</span>
              <span style={{ fontWeight: '600' }}>{layoutMode}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Real-time:</span>
              <span style={{ fontWeight: '600' }}>{enableRealTime ? 'On' : 'Off'}</span>
            </div>
            {componentType === 'premium' && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Analytics:</span>
                <span style={{ fontWeight: '600' }}>{showAnalytics ? 'On' : 'Off'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        paddingRight: '360px' // Space for control panel
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem'
          }}>
            {componentType === 'premium' ? '💎 Premium' : '✨ Advanced'} Quick Actions
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#64748b',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            {componentType === 'premium' 
              ? 'Professional-grade quick actions with analytics, carousel layouts, and advanced features.'
              : 'Advanced quick actions with real-time updates, search, and category filtering.'
            }
          </p>
        </div>

        {/* Render Component */}
        {componentType === 'premium' ? (
          <PremiumQuickActions
            actions={customActions}
            layout={layoutMode}
            autoPlay={autoPlay}
            showProgress={true}
            enableRealTime={enableRealTime}
            showAnalytics={showAnalytics}
            enableKeyboard={true}
            onActionClick={handleActionClick}
          />
        ) : (
          <AdvancedQuickActions
            actions={customActions}
            showCategories={showCategories}
            showSearch={showSearch}
            maxItems={6}
            enableRealTime={enableRealTime}
            onActionClick={handleActionClick}
          />
        )}

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginTop: '4rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              Professional Design
            </h3>
            <p style={{ 
              color: '#64748b',
              lineHeight: '1.6'
            }}>
              Glass morphism effects, smooth animations, and modern UI patterns.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              Real-time Features
            </h3>
            <p style={{ 
              color: '#64748b',
              lineHeight: '1.6'
            }}>
              Live updates, progress tracking, and dynamic content loading.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              Advanced Analytics
            </h3>
            <p style={{ 
              color: '#64748b',
              lineHeight: '1.6'
            }}>
              Click tracking, conversion rates, and user behavior insights.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{ 
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        padding: '1rem 1.5rem',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        fontSize: '0.9rem',
        color: '#64748b',
        zIndex: 999
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{componentType === 'premium' ? '💎' : '✨'}</span>
          <span style={{ fontWeight: '600' }}>
            {componentType === 'premium' ? 'Premium' : 'Advanced'}
          </span>
          <span>•</span>
          <span>🎯 {layoutMode}</span>
          <span>•</span>
          <span>🔄 {enableRealTime ? 'Live' : 'Static'}</span>
        </div>
      </div>
    </div>
  )
}

export default QuickActionsShowcase
