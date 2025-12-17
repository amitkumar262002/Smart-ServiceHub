import React, { useState } from 'react'
import AdvancedLiveTracking from '../components/AdvancedLiveTracking'
import PremiumLiveTracking from '../components/PremiumLiveTracking'

const LiveTrackingShowcase: React.FC = () => {
  const [trackingMode, setTrackingMode] = useState<'advanced' | 'premium'>('premium')
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [features, setFeatures] = useState({
    weather: true,
    traffic: true,
    voice: false,
    ar: false,
    analytics: true
  })

  const isDarkTheme = theme === 'dark'
  const isLightTheme = theme === 'light'

  return (
    <div style={{ 
      minHeight: '100vh',
      background: isDarkTheme 
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
        minWidth: '320px',
        maxHeight: '80vh',
        overflowY: 'auto'
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
          🎛️ Tracking Control
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
              Tracking Mode
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setTrackingMode('advanced')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: trackingMode === 'advanced' 
                    ? `2px solid ${theme === 'dark' ? '#60a5fa' : '#3b82f6'}` 
                    : `2px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
                  background: trackingMode === 'advanced' 
                    ? `${theme === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
                    : 'transparent',
                  color: trackingMode === 'advanced' 
                    ? (theme === 'dark' ? '#60a5fa' : '#3b82f6')
                    : (theme === 'dark' ? '#94a3b8' : '#64748b'),
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
                onClick={() => setTrackingMode('premium')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: trackingMode === 'premium' 
                    ? `2px solid ${theme === 'dark' ? '#60a5fa' : '#3b82f6'}` 
                    : `2px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
                  background: trackingMode === 'premium' 
                    ? `${theme === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
                    : 'transparent',
                  color: trackingMode === 'premium' 
                    ? (theme === 'dark' ? '#60a5fa' : '#3b82f6')
                    : (theme === 'dark' ? '#94a3b8' : '#64748b'),
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
                <input 
                  type="checkbox" 
                  checked={features.weather}
                  onChange={(e) => setFeatures(prev => ({ ...prev, weather: e.target.checked }))}
                  style={{ cursor: 'pointer' }} 
                />
                🌤️ Weather Integration
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
                  checked={features.traffic}
                  onChange={(e) => setFeatures(prev => ({ ...prev, traffic: e.target.checked }))}
                  style={{ cursor: 'pointer' }} 
                />
                🚦 Traffic Layer
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
                  checked={features.voice}
                  onChange={(e) => setFeatures(prev => ({ ...prev, voice: e.target.checked }))}
                  style={{ cursor: 'pointer' }} 
                />
                🎙️ Voice Navigation
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
                  checked={features.ar}
                  onChange={(e) => setFeatures(prev => ({ ...prev, ar: e.target.checked }))}
                  style={{ cursor: 'pointer' }} 
                />
                🥽 AR View
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
                  checked={features.analytics}
                  onChange={(e) => setFeatures(prev => ({ ...prev, analytics: e.target.checked }))}
                  style={{ cursor: 'pointer' }} 
                />
                📊 Analytics
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
              <span>Mode:</span>
              <span style={{ fontWeight: '600', color: trackingMode === 'premium' ? '#8b5cf6' : '#3b82f6' }}>
                {trackingMode === 'premium' ? 'Premium' : 'Advanced'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Theme:</span>
              <span style={{ fontWeight: '600' }}>{theme}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Active Features:</span>
              <span style={{ fontWeight: '600' }}>
                {Object.values(features).filter(Boolean).length}/{Object.keys(features).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {trackingMode === 'advanced' ? (
        <div style={{ 
          minHeight: '100vh',
          background: isDarkTheme 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
          <AdvancedLiveTracking 
            bookingId="BK-2025-1234"
            providerId="provider-001"
          />
        </div>
      ) : (
        <PremiumLiveTracking 
          bookingId="BK-2025-5678"
          enableAR={features.ar}
          enableVoice={features.voice}
        />
      )}

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
        fontSize: '0.85rem',
        color: isDarkTheme ? '#94a3b8' : '#64748b',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{trackingMode === 'advanced' ? '✨' : '💎'}</span>
          <span style={{ fontWeight: '600' }}>
            {trackingMode === 'advanced' ? 'Advanced' : 'Premium'} Tracking
          </span>
          <span>•</span>
          <span>{isDarkTheme ? '🌙' : '☀️'} {theme}</span>
          <span>•</span>
          <span>📍 Live</span>
        </div>
      </div>
    </div>
  )
}

export default LiveTrackingShowcase
