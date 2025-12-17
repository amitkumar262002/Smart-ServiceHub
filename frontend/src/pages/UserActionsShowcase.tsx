import React, { useState } from 'react'
import AdvancedUserActions from '../components/AdvancedUserActions'
import PremiumUserActions from '../components/PremiumUserActions'

const UserActionsShowcase: React.FC = () => {
  const [mode, setMode] = useState<'advanced' | 'premium'>('premium')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [features, setFeatures] = useState({
    realTime: true,
    animations: true,
    sounds: false,
    badges: true,
    filters: true,
    actions: true
  })

  const [showDemo, setShowDemo] = useState(false)
  const [notificationCount, setNotificationCount] = useState(2)

  const isDarkTheme = theme === 'dark'
  const isLightTheme = theme === 'light'

  const handleNotificationAction = (action: string, notificationId?: string) => {
    console.log(`Notification action: ${action}`, notificationId ? `(${notificationId})` : '')
    // Handle different notification actions
    switch (action) {
      case 'view_booking':
        console.log('Navigating to booking details...')
        break
      case 'call_provider':
        console.log('Initiating call to provider...')
        break
      case 'view_receipt':
        console.log('Opening payment receipt...')
        break
      case 'find_provider':
        console.log('Finding replacement provider...')
        break
      case 'track_location':
        console.log('Opening live tracking...')
        break
      case 'view_wallet':
        console.log('Opening wallet...')
        break
      default:
        console.log(`Handling action: ${action}`)
    }
  }

  const handleProfileAction = (action: string) => {
    console.log(`Profile action: ${action}`)
    // Handle different profile actions
    switch (action) {
      case 'account':
        console.log('Opening account settings...')
        break
      case 'bookings':
        console.log('Opening bookings list...')
        break
      case 'wallet':
        console.log('Opening wallet...')
        break
      case 'settings':
        console.log('Opening settings...')
        break
      case 'help':
        console.log('Opening help center...')
        break
      case 'logout':
        console.log('Logging out...')
        break
      default:
        console.log(`Handling profile action: ${action}`)
    }
  }

  const simulateNewNotification = () => {
    setNotificationCount(prev => prev + 1)
    console.log('New notification simulated!')
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: isDarkTheme 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      position: 'relative',
      padding: '2rem'
    }}>
      {/* Control Panel */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        left: '20px', 
        zIndex: 1000,
        background: isDarkTheme 
          ? 'rgba(30, 41, 59, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '2rem',
        border: isDarkTheme 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
        minWidth: '380px',
        maxHeight: '85vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ 
          margin: '0 0 2rem 0', 
          fontSize: '1.4rem', 
          fontWeight: '800',
          background: isDarkTheme 
            ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)'
            : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          🎛️ User Actions Control
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Mode Selection */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '1rem',
              fontSize: '1rem', 
              fontWeight: '700',
              color: isDarkTheme ? '#94a3b8' : '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Component Mode
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                onClick={() => setMode('advanced')}
                style={{
                  padding: '1rem',
                  border: mode === 'advanced' 
                    ? `2px solid ${isDarkTheme ? '#60a5fa' : '#3b82f6'}` 
                    : `2px solid ${isDarkTheme ? '#475569' : '#e2e8f0'}`,
                  background: mode === 'advanced' 
                    ? `${isDarkTheme ? 'rgba(96, 165, 250, 0.15)' : 'rgba(59, 130, 246, 0.1)'}`
                    : 'transparent',
                  color: mode === 'advanced' 
                    ? (isDarkTheme ? '#60a5fa' : '#3b82f6')
                    : (isDarkTheme ? '#94a3b8' : '#64748b'),
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                ✨ Advanced
              </button>
              <button
                onClick={() => setMode('premium')}
                style={{
                  padding: '1rem',
                  border: mode === 'premium' 
                    ? `2px solid ${isDarkTheme ? '#60a5fa' : '#3b82f6'}` 
                    : `2px solid ${isDarkTheme ? '#475569' : '#e2e8f0'}`,
                  background: mode === 'premium' 
                    ? `${isDarkTheme ? 'rgba(96, 165, 250, 0.15)' : 'rgba(59, 130, 246, 0.1)'}`
                    : 'transparent',
                  color: mode === 'premium' 
                    ? (isDarkTheme ? '#60a5fa' : '#3b82f6')
                    : (isDarkTheme ? '#94a3b8' : '#64748b'),
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
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
              marginBottom: '1rem',
              fontSize: '1rem', 
              fontWeight: '700',
              color: isDarkTheme ? '#94a3b8' : '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Visual Theme
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                onClick={() => setTheme('light')}
                style={{
                  padding: '1rem',
                  border: isLightTheme 
                    ? `2px solid ${isDarkTheme ? '#60a5fa' : '#3b82f6'}` 
                    : `2px solid ${isDarkTheme ? '#475569' : '#e2e8f0'}`,
                  background: isLightTheme 
                    ? `${isDarkTheme ? 'rgba(96, 165, 250, 0.15)' : 'rgba(59, 130, 246, 0.1)'}`
                    : 'transparent',
                  color: isLightTheme 
                    ? (isDarkTheme ? '#60a5fa' : '#3b82f6')
                    : (isDarkTheme ? '#94a3b8' : '#64748b'),
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                style={{
                  padding: '1rem',
                  border: isDarkTheme 
                    ? `2px solid ${isDarkTheme ? '#60a5fa' : '#3b82f6'}` 
                    : `2px solid ${isDarkTheme ? '#475569' : '#e2e8f0'}`,
                  background: isDarkTheme 
                    ? `${isDarkTheme ? 'rgba(96, 165, 250, 0.15)' : 'rgba(59, 130, 246, 0.1)'}`
                    : 'transparent',
                  color: isDarkTheme 
                    ? (isDarkTheme ? '#60a5fa' : '#3b82f6')
                    : (isDarkTheme ? '#94a3b8' : '#64748b'),
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
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
              marginBottom: '1rem',
              fontSize: '1rem', 
              fontWeight: '700',
              color: isDarkTheme ? '#94a3b8' : '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Features
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: isDarkTheme ? '#94a3b8' : '#64748b',
                padding: '0.75rem',
                borderRadius: '12px',
                background: features.realTime 
                  ? (isDarkTheme ? 'rgba(16, 185, 129, 0.1)' : 'rgba(5, 150, 105, 0.1)')
                  : 'transparent',
                border: features.realTime 
                  ? `1px solid ${isDarkTheme ? '#10b981' : '#059669'}`
                  : '1px solid transparent'
              }}>
                <input 
                  type="checkbox" 
                  checked={features.realTime}
                  onChange={(e) => setFeatures(prev => ({ ...prev, realTime: e.target.checked }))}
                  style={{ cursor: 'pointer' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>🔄 Real-time Updates</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Live notifications every 20s</div>
                </div>
              </label>

              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: isDarkTheme ? '#94a3b8' : '#64748b',
                padding: '0.75rem',
                borderRadius: '12px',
                background: features.animations 
                  ? (isDarkTheme ? 'rgba(139, 92, 246, 0.1)' : 'rgba(124, 58, 237, 0.1)')
                  : 'transparent',
                border: features.animations 
                  ? `1px solid ${isDarkTheme ? '#8b5cf6' : '#7c3aed'}`
                  : '1px solid transparent'
              }}>
                <input 
                  type="checkbox" 
                  checked={features.animations}
                  onChange={(e) => setFeatures(prev => ({ ...prev, animations: e.target.checked }))}
                  style={{ cursor: 'pointer' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>✨ Animations</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Smooth transitions & effects</div>
                </div>
              </label>

              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: isDarkTheme ? '#94a3b8' : '#64748b',
                padding: '0.75rem',
                borderRadius: '12px',
                background: features.sounds 
                  ? (isDarkTheme ? 'rgba(245, 158, 11, 0.1)' : 'rgba(217, 119, 6, 0.1)')
                  : 'transparent',
                border: features.sounds 
                  ? `1px solid ${isDarkTheme ? '#f59e0b' : '#d97706'}`
                  : '1px solid transparent'
              }}>
                <input 
                  type="checkbox" 
                  checked={features.sounds}
                  onChange={(e) => setFeatures(prev => ({ ...prev, sounds: e.target.checked }))}
                  style={{ cursor: 'pointer' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>🔊 Sound Effects</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Notification sounds</div>
                </div>
              </label>

              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: isDarkTheme ? '#94a3b8' : '#64748b',
                padding: '0.75rem',
                borderRadius: '12px',
                background: features.badges 
                  ? (isDarkTheme ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)')
                  : 'transparent',
                border: features.badges 
                  ? `1px solid ${isDarkTheme ? '#ef4444' : '#dc2626'}`
                  : '1px solid transparent'
              }}>
                <input 
                  type="checkbox" 
                  checked={features.badges}
                  onChange={(e) => setFeatures(prev => ({ ...prev, badges: e.target.checked }))}
                  style={{ cursor: 'pointer' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>🏷️ Badges</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Notification badges & counters</div>
                </div>
              </label>

              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: isDarkTheme ? '#94a3b8' : '#64748b',
                padding: '0.75rem',
                borderRadius: '12px',
                background: features.filters 
                  ? (isDarkTheme ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)')
                  : 'transparent',
                border: features.filters 
                  ? `1px solid ${isDarkTheme ? '#3b82f6' : '#2563eb'}`
                  : '1px solid transparent'
              }}>
                <input 
                  type="checkbox" 
                  checked={features.filters}
                  onChange={(e) => setFeatures(prev => ({ ...prev, filters: e.target.checked }))}
                  style={{ cursor: 'pointer' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>🔍 Filters</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Notification filtering options</div>
                </div>
              </label>

              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: isDarkTheme ? '#94a3b8' : '#64748b',
                padding: '0.75rem',
                borderRadius: '12px',
                background: features.actions 
                  ? (isDarkTheme ? 'rgba(16, 185, 129, 0.1)' : 'rgba(5, 150, 105, 0.1)')
                  : 'transparent',
                border: features.actions 
                  ? `1px solid ${isDarkTheme ? '#10b981' : '#059669'}`
                  : '1px solid transparent'
              }}>
                <input 
                  type="checkbox" 
                  checked={features.actions}
                  onChange={(e) => setFeatures(prev => ({ ...prev, actions: e.target.checked }))}
                  style={{ cursor: 'pointer' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>⚡ Actions</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Interactive action buttons</div>
                </div>
              </label>
            </div>
          </div>

          {/* Demo Controls */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '1rem',
              fontSize: '1rem', 
              fontWeight: '700',
              color: isDarkTheme ? '#94a3b8' : '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Demo Controls
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={simulateNewNotification}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                📬 Add Notification
              </button>
              <button
                onClick={() => setShowDemo(!showDemo)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: showDemo 
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {showDemo ? '🛑 Stop Demo' : '▶️ Start Demo'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            padding: '1.5rem',
            background: isDarkTheme ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
            borderRadius: '16px',
            fontSize: '0.9rem',
            color: isDarkTheme ? '#94a3b8' : '#64748b'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span>Mode:</span>
              <span style={{ fontWeight: '700', color: mode === 'premium' ? '#8b5cf6' : '#3b82f6' }}>
                {mode === 'premium' ? 'Premium' : 'Advanced'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span>Theme:</span>
              <span style={{ fontWeight: '700' }}>{theme}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span>Active Features:</span>
              <span style={{ fontWeight: '700' }}>
                {Object.values(features).filter(Boolean).length}/{Object.keys(features).length}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Demo Status:</span>
              <span style={{ 
                fontWeight: '700', 
                color: showDemo ? '#10b981' : '#ef4444' 
              }}>
                {showDemo ? 'Running' : 'Stopped'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '4rem',
        gap: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '800px'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            background: isDarkTheme 
              ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)'
              : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem'
          }}>
            Advanced User Actions System
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: isDarkTheme ? '#94a3b8' : '#64748b',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            Professional notification and profile management with real-time updates, 
            advanced filtering, and stunning animations.
          </p>
        </div>

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          width: '100%',
          maxWidth: '1200px'
        }}>
          <div style={{
            background: isDarkTheme ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2rem',
            border: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔔</div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: isDarkTheme ? '#f8fafc' : '#1e293b',
              marginBottom: '1rem'
            }}>
              Smart Notifications
            </h3>
            <p style={{ 
              color: isDarkTheme ? '#94a3b8' : '#64748b',
              lineHeight: '1.6'
            }}>
              Real-time notifications with priority levels, filtering options, 
              and interactive action buttons for seamless user experience.
            </p>
          </div>

          <div style={{
            background: isDarkTheme ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2rem',
            border: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👤</div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: isDarkTheme ? '#f8fafc' : '#1e293b',
              marginBottom: '1rem'
            }}>
              Premium Profile
            </h3>
            <p style={{ 
              color: isDarkTheme ? '#94a3b8' : '#64748b',
              lineHeight: '1.6'
            }}>
              Advanced profile management with membership tiers, achievements, 
              statistics tracking, and comprehensive menu options.
            </p>
          </div>

          <div style={{
            background: isDarkTheme ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2rem',
            border: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: isDarkTheme ? '#f8fafc' : '#1e293b',
              marginBottom: '1rem'
            }}>
              Real-time Features
            </h3>
            <p style={{ 
              color: isDarkTheme ? '#94a3b8' : '#64748b',
              lineHeight: '1.6'
            }}>
              Live updates, animations, sound effects, and interactive elements 
              that respond to user actions instantly.
            </p>
          </div>
        </div>
      </div>

      {/* User Actions Component */}
      {mode === 'advanced' ? (
        <AdvancedUserActions
          onNotificationClick={(notification) => {
            console.log('Notification clicked:', notification)
            handleNotificationAction('view', notification.id)
          }}
          onProfileMenuClick={handleProfileAction}
        />
      ) : (
        <PremiumUserActions
          enableRealTime={features.realTime}
          enableAnimations={features.animations}
          enableSounds={features.sounds}
          onNotificationAction={handleNotificationAction}
          onProfileAction={handleProfileAction}
        />
      )}

      {/* Footer Status */}
      <div style={{ 
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '1.25rem 2rem',
        background: isDarkTheme 
          ? 'rgba(30, 41, 59, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: isDarkTheme 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
        fontSize: '0.9rem',
        color: isDarkTheme ? '#94a3b8' : '#64748b',
        zIndex: 999
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            background: showDemo ? '#10b981' : '#ef4444',
            borderRadius: '50%',
            animation: showDemo ? 'pulse 2s ease-in-out infinite' : 'none'
          }} />
          <span style={{ fontWeight: '700' }}>
            {mode === 'advanced' ? '✨ Advanced' : '💎 Premium'}
          </span>
          <span>•</span>
          <span>{isDarkTheme ? '🌙' : '☀️'} {theme}</span>
          <span>•</span>
          <span>📬 {notificationCount} Active</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}

export default UserActionsShowcase
