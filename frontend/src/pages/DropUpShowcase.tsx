import React, { useState } from 'react'
import DropUpNotifications from '../components/DropUpNotifications'

const DropUpShowcase: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left' | 'bottom-center'>('bottom-right')
  const [showBadge, setShowBadge] = useState(true)
  const [autoClose, setAutoClose] = useState(false)

  const isDarkTheme = theme === 'dark'
  const isLightTheme = theme === 'light'

  const handleNotificationClick = (notification: any) => {
    console.log('Notification clicked:', notification)
    alert(`Clicked: ${notification.title}`)
  }

  const handleActionClick = (action: string, notificationId: string) => {
    console.log('Action clicked:', action, notificationId)
    alert(`Action: ${action} for notification ${notificationId}`)
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
        minWidth: '320px'
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
          🎛️ Drop-Up Controls
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Position Selection */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem',
              fontSize: '0.9rem', 
              fontWeight: '600',
              color: isDarkTheme ? '#94a3b8' : '#64748b'
            }}>
              Position
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { value: 'bottom-right', label: 'Bottom Right' },
                { value: 'bottom-left', label: 'Bottom Left' },
                { value: 'bottom-center', label: 'Bottom Center' }
              ].map((pos) => (
                <button
                  key={pos.value}
                  onClick={() => setPosition(pos.value as any)}
                  style={{
                    padding: '0.75rem',
                    border: position === pos.value 
                      ? `2px solid ${isDarkTheme ? '#60a5fa' : '#3b82f6'}` 
                      : `2px solid ${isDarkTheme ? '#475569' : '#e2e8f0'}`,
                    background: position === pos.value 
                      ? `${isDarkTheme ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
                      : 'transparent',
                    color: position === pos.value 
                      ? (isDarkTheme ? '#60a5fa' : '#3b82f6')
                      : (isDarkTheme ? '#94a3b8' : '#64748b'),
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  {pos.label}
                </button>
              ))}
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
                <input 
                  type="checkbox" 
                  checked={showBadge}
                  onChange={(e) => setShowBadge(e.target.checked)}
                  style={{ cursor: 'pointer' }} 
                />
                🏷️ Show Badge
              </label>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: isDarkTheme ? '#94a3b8' : '#64748b'
              }}>
                <input 
                  type="checkbox" 
                  checked={autoClose}
                  onChange={(e) => setAutoClose(e.target.checked)}
                  style={{ cursor: 'pointer' }} 
                />
                ⏰ Auto Close (5s)
              </label>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            padding: '1rem',
            background: isDarkTheme ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            fontSize: '0.85rem',
            color: isDarkTheme ? '#64748b' : '#64748b'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Position:</span>
              <span style={{ fontWeight: '600' }}>{position}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Theme:</span>
              <span style={{ fontWeight: '600' }}>{theme}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Auto Close:</span>
              <span style={{ fontWeight: '600' }}>{autoClose ? 'On' : 'Off'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
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
            Drop-Up Notifications
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: isDarkTheme ? '#94a3b8' : '#64748b',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            Professional drop-up notification system that appears above the trigger button 
            with smooth animations and advanced features.
          </p>
        </div>

        {/* Demo Areas */}
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
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: isDarkTheme ? '#f8fafc' : '#1e293b',
              marginBottom: '1rem'
            }}>
              🎯 Drop-Up Position
            </h3>
            <p style={{ 
              color: isDarkTheme ? '#94a3b8' : '#64748b',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Notifications appear above the trigger button with an arrow pointing up.
            </p>
            <div style={{
              height: '200px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '1rem'
            }}>
              <DropUpNotifications
                position={position}
                showBadge={showBadge}
                autoClose={autoClose}
                onNotificationClick={handleNotificationClick}
                onActionClick={handleActionClick}
              />
            </div>
          </div>

          <div style={{
            background: isDarkTheme ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2rem',
            border: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: isDarkTheme ? '#f8fafc' : '#1e293b',
              marginBottom: '1rem'
            }}>
              ⚡ Real-time Updates
            </h3>
            <p style={{ 
              color: isDarkTheme ? '#94a3b8' : '#64748b',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Live notifications arrive every 15 seconds with smooth animations.
            </p>
            <div style={{
              height: '200px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '1rem'
            }}>
              <DropUpNotifications
                position="bottom-center"
                showBadge={true}
                autoClose={false}
                onNotificationClick={handleNotificationClick}
                onActionClick={handleActionClick}
              />
            </div>
          </div>

          <div style={{
            background: isDarkTheme ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2rem',
            border: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: isDarkTheme ? '#f8fafc' : '#1e293b',
              marginBottom: '1rem'
            }}>
              🎨 Professional Design
            </h3>
            <p style={{ 
              color: isDarkTheme ? '#94a3b8' : '#64748b',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Glass morphism design with smooth animations and hover effects.
            </p>
            <div style={{
              height: '200px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '1rem'
            }}>
              <DropUpNotifications
                position="bottom-left"
                showBadge={true}
                autoClose={true}
                onNotificationClick={handleNotificationClick}
                onActionClick={handleActionClick}
              />
            </div>
          </div>
        </div>

        {/* Feature List */}
        <div style={{
          background: isDarkTheme ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2.5rem',
            border: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            maxWidth: '1000px',
            width: '100%'
          }}>
            <h3 style={{ 
              fontSize: '1.8rem', 
              fontWeight: '700', 
              color: isDarkTheme ? '#f8fafc' : '#1e293b',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              🚀 Advanced Features
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📍</div>
                <h4 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  color: isDarkTheme ? '#f8fafc' : '#1e293b',
                  marginBottom: '0.5rem'
                }}>
                  Drop-Up Positioning
                </h4>
                <p style={{ 
                  fontSize: '0.9rem',
                  color: isDarkTheme ? '#94a3b8' : '#64748b',
                  lineHeight: '1.5'
                }}>
                  Appears above trigger with arrow pointing up
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔄</div>
                <h4 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  color: isDarkTheme ? '#f8fafc' : '#1e293b',
                  marginBottom: '0.5rem'
                }}>
                  Real-time Updates
                </h4>
                <p style={{ 
                  fontSize: '0.9rem',
                  color: isDarkTheme ? '#94a3b8' : '#64748b',
                  lineHeight: '1.5'
                }}>
                  Live notifications every 15 seconds
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎨</div>
                <h4 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  color: isDarkTheme ? '#f8fafc' : '#1e293b',
                  marginBottom: '0.5rem'
                }}>
                  Glass Morphism
                </h4>
                <p style={{ 
                  fontSize: '0.9rem',
                  color: isDarkTheme ? '#94a3b8' : '#64748b',
                  lineHeight: '1.5'
                }}>
                  Modern transparent design with blur effects
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
                <h4 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  color: isDarkTheme ? '#f8fafc' : '#1e293b',
                  marginBottom: '0.5rem'
                }}>
                  Smooth Animations
                </h4>
                <p style={{ 
                  fontSize: '0.9rem',
                  color: isDarkTheme ? '#94a3b8' : '#64748b',
                  lineHeight: '1.5'
                }}>
                  Professional transitions and hover effects
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏷️</div>
                <h4 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  color: isDarkTheme ? '#f8fafc' : '#1e293b',
                  marginBottom: '0.5rem'
                }}>
                  Notification Badges
                </h4>
                <p style={{ 
                  fontSize: '0.9rem',
                  color: isDarkTheme ? '#94a3b8' : '#64748b',
                  lineHeight: '1.5'
                }}>
                  Dynamic badge counters with pulse animation
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
                <h4 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  color: isDarkTheme ? '#f8fafc' : '#1e293b',
                  marginBottom: '0.5rem'
                }}>
                  Action Buttons
                </h4>
                <p style={{ 
                  fontSize: '0.9rem',
                  color: isDarkTheme ? '#94a3b8' : '#64748b',
                  lineHeight: '1.5'
                }}>
                  Interactive action buttons for each notification
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
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
        fontSize: '0.9rem',
        color: isDarkTheme ? '#94a3b8' : '#64748b',
        zIndex: 999
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🔔</span>
          <span style={{ fontWeight: '600' }}>Drop-Up Notifications</span>
          <span>•</span>
          <span>{isDarkTheme ? '🌙' : '☀️'} {theme}</span>
          <span>•</span>
          <span>📍 {position}</span>
        </div>
      </div>
    </div>
  )
}

export default DropUpShowcase
