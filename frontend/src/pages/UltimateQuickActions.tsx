import React, { useState } from 'react'
import AdvancedQuickActions from '../components/AdvancedQuickActions'
import PremiumQuickActions from '../components/PremiumQuickActions'

const UltimateQuickActions: React.FC = () => {
  const [mode, setMode] = useState<'advanced' | 'premium'>('premium')
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  const isDarkTheme = theme === 'dark'
const isLightTheme = theme === 'light'

  const customActions = [
    {
      id: 1,
      title: 'Book Service',
      description: 'Schedule a service',
      icon: '📅',
      color: '#3b82f6',
      category: 'booking',
      stats: { bookings: 1234, rating: 4.8, time: '2-4 hrs' },
      featured: true,
      progress: 85,
      link: '/book-service'
    },
    {
      id: 2,
      title: 'Track Booking',
      description: 'Monitor your service status',
      icon: '📍',
      color: '#10b981',
      category: 'tracking',
      stats: { bookings: 856, rating: 4.9, time: 'Live' },
      progress: 92,
      link: '/track-booking'
    },
    {
      id: 3,
      title: 'Emergency Help',
      description: 'Get immediate assistance',
      icon: '🚨',
      color: '#ef4444',
      category: 'emergency',
      stats: { bookings: 432, rating: 4.9, time: '24/7' },
      badge: 'new' as const,
      progress: 100,
      link: '/emergency'
    },
    {
      id: 4,
      title: 'AI Assistant',
      description: 'Smart AI-powered support',
      icon: '🤖',
      color: '#8b5cf6',
      category: 'ai',
      stats: { bookings: 1567, rating: 4.9, time: 'Instant' },
      progress: 65,
      link: '/ai-assistant'
    },
    {
      id: 5,
      title: 'Analytics',
      description: 'View detailed insights',
      icon: '📊',
      color: '#06b6d4',
      category: 'analytics',
      stats: { bookings: 892, rating: 4.8, time: 'Real-time' },
      progress: 45,
      link: '/analytics'
    }
  ]

  return (
    <div style={{ 
      minHeight: '100vh',
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      position: 'relative'
    }}>
      {/* Control Panel */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        zIndex: 1000,
        background: isDarkTheme 
          ? 'rgba(30, 41, 59, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '2rem',
        border: isDarkTheme 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        minWidth: '280px'
      }}>
        <h3 style={{ 
          margin: '0 0 1.5rem 0', 
          fontSize: '1.3rem', 
          fontWeight: '700',
          color: isDarkTheme ? '#f8fafc' : '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🎛️ Control Panel
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Mode Selection */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem',
              fontSize: '0.9rem', 
              fontWeight: '600',
              color: isDarkTheme ? '#94a3b8' : '#64748b'
            }}>
              Design Mode
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setMode('advanced')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: mode === 'advanced' 
                    ? `2px solid ${isDarkTheme ? '#60a5fa' : '#3b82f6'}` 
                    : `2px solid ${isDarkTheme ? '#475569' : '#e2e8f0'}`,
                  background: mode === 'advanced' 
                    ? `${isDarkTheme ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
                    : 'transparent',
                  color: mode === 'advanced' 
                    ? (isDarkTheme ? '#60a5fa' : '#3b82f6')
                    : (isDarkTheme ? '#94a3b8' : '#64748b'),
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
                onClick={() => setMode('premium')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: mode === 'premium' 
                    ? `2px solid ${isDarkTheme ? '#60a5fa' : '#3b82f6'}` 
                    : `2px solid ${isDarkTheme ? '#475569' : '#e2e8f0'}`,
                  background: mode === 'premium' 
                    ? `${isDarkTheme ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
                    : 'transparent',
                  color: mode === 'premium' 
                    ? (isDarkTheme ? '#60a5fa' : '#3b82f6')
                    : (isDarkTheme ? '#94a3b8' : '#64748b'),
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

          {/* Theme Selection */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem',
              fontSize: '0.9rem', 
              fontWeight: '600',
              color: isDarkTheme ? '#94a3b8' : '#64748b'
            }}>
              Theme
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setTheme('light')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: isLightTheme 
                    ? `2px solid ${isDarkTheme ? '#60a5fa' : '#3b82f6'}` 
                    : `2px solid ${isDarkTheme ? '#475569' : '#e2e8f0'}`,
                  background: isLightTheme 
                    ? `${isDarkTheme ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
                    : 'transparent',
                  color: isLightTheme 
                    ? (isDarkTheme ? '#60a5fa' : '#3b82f6')
                    : (isDarkTheme ? '#94a3b8' : '#64748b'),
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: isDarkTheme 
                    ? `2px solid ${isDarkTheme ? '#60a5fa' : '#3b82f6'}` 
                    : `2px solid ${isDarkTheme ? '#475569' : '#e2e8f0'}`,
                  background: isDarkTheme 
                    ? `${isDarkTheme ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
                    : 'transparent',
                  color: isDarkTheme 
                    ? (isDarkTheme ? '#60a5fa' : '#3b82f6')
                    : (isDarkTheme ? '#94a3b8' : '#64748b'),
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                🌙 Dark
              </button>
            </div>
          </div>

          {/* Feature Toggles */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem',
              fontSize: '0.9rem', 
              fontWeight: '600',
              color: isDarkTheme ? '#94a3b8' : '#64748b'
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
                color: isDarkTheme ? '#94a3b8' : '#64748b'
              }}>
                <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                Show Categories
              </label>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: isDarkTheme ? '#94a3b8' : '#64748b'
              }}>
                <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                Show Search
              </label>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: isDarkTheme ? '#94a3b8' : '#64748b'
              }}>
                <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                Show Progress Bars
              </label>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: isDarkTheme ? '#94a3b8' : '#64748b'
              }}>
                <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                Enable Animations
              </label>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            padding: '1rem',
            background: theme === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            fontSize: '0.85rem',
            color: theme === 'dark' ? '#64748b' : '#64748b'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Total Actions:</span>
              <span style={{ fontWeight: '600' }}>{customActions.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Featured:</span>
              <span style={{ fontWeight: '600' }}>
                {customActions.filter(a => a.featured).length}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>With Badges:</span>
              <span style={{ fontWeight: '600' }}>
                {customActions.filter(a => a.badge).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {mode === 'advanced' ? (
        <div style={{ 
          minHeight: '100vh',
          background: isDarkTheme 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
          <AdvancedQuickActions 
            actions={customActions}
            showCategories={true}
            showSearch={true}
            maxItems={customActions.length}
          />
        </div>
      ) : (
        <PremiumQuickActions 
          actions={customActions}
          layout="grid"
          autoPlay={false}
          showProgress={true}
        />
      )}

      {/* Footer */}
      <div style={{ 
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        padding: '1rem 1.5rem',
        background: isDarkTheme 
          ? 'rgba(30, 41, 59, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: isDarkTheme 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        fontSize: '0.85rem',
        color: isDarkTheme ? '#94a3b8' : '#64748b',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{mode === 'advanced' ? '✨' : '💎'}</span>
          <span style={{ fontWeight: '600' }}>
            {mode === 'advanced' ? 'Advanced' : 'Premium'} Mode
          </span>
          <span>•</span>
          <span>{isDarkTheme ? '🌙' : '☀️'} {theme}</span>
        </div>
      </div>
    </div>
  )
}

export default UltimateQuickActions
