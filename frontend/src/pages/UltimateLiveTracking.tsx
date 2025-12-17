import React, { useState, useEffect } from 'react'
import AdvancedLiveTracking from '../components/AdvancedLiveTracking'
import PremiumLiveTracking from '../components/PremiumLiveTracking'

const UltimateLiveTracking: React.FC = () => {
  const [mode, setMode] = useState<'advanced' | 'premium'>('premium')
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [isSimulating, setIsSimulating] = useState(true)
  const [simulationSpeed, setSimulationSpeed] = useState(1)

  // Simulate real-time data updates
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 1234,
    totalBookings: 5678,
    avgResponseTime: 12,
    providerOnline: 89,
    systemLoad: 65
  })

  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: prev.activeUsers + Math.floor((Math.random() - 0.5) * 10),
        totalBookings: prev.totalBookings + Math.floor(Math.random() * 3),
        avgResponseTime: Math.max(5, prev.avgResponseTime + (Math.random() - 0.5) * 2),
        providerOnline: Math.max(70, Math.min(95, prev.providerOnline + (Math.random() - 0.5) * 5)),
        systemLoad: Math.max(20, Math.min(90, prev.systemLoad + (Math.random() - 0.5) * 10))
      }))
    }, 2000 / simulationSpeed)

    return () => clearInterval(interval)
  }, [isSimulating, simulationSpeed])

  const isDarkTheme = theme === 'dark'
  const isLightTheme = theme === 'light'

  return (
    <div style={{ 
      minHeight: '100vh',
      background: isDarkTheme 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isDarkTheme 
          ? 'radial-gradient(circle at 20% 50%, rgba(96, 165, 250, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

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
        borderRadius: '24px',
        padding: '2rem',
        border: isDarkTheme 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
        minWidth: '350px',
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
          🎛️ Ultimate Control
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
              Tracking Mode
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

          {/* Simulation Controls */}
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
              Simulation
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: isSimulating 
                    ? `2px solid #10b981` 
                    : `2px solid ${isDarkTheme ? '#475569' : '#e2e8f0'}`,
                  background: isSimulating 
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'transparent',
                  color: isSimulating 
                    ? '#10b981'
                    : (isDarkTheme ? '#94a3b8' : '#64748b'),
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isSimulating ? '⏸️ Pause' : '▶️ Start'}
              </button>
              <button
                onClick={() => setSimulationSpeed(prev => prev === 1 ? 2 : prev === 2 ? 0.5 : 1)}
                style={{
                  padding: '0.75rem 1rem',
                  border: `2px solid ${isDarkTheme ? '#475569' : '#e2e8f0'}`,
                  background: 'transparent',
                  color: isDarkTheme ? '#94a3b8' : '#64748b',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                {simulationSpeed}x
              </button>
            </div>
          </div>

          {/* Real-time Stats */}
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
              Live Statistics
            </label>
            <div style={{ 
              display: 'grid', 
              gap: '0.75rem',
              fontSize: '0.9rem'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '0.75rem',
                background: isDarkTheme ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '12px'
              }}>
                <span style={{ color: isDarkTheme ? '#94a3b8' : '#64748b' }}>👥 Active Users</span>
                <span style={{ 
                  fontWeight: '700', 
                  color: isDarkTheme ? '#60a5fa' : '#3b82f6' 
                }}>
                  {realTimeData.activeUsers.toLocaleString()}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '0.75rem',
                background: isDarkTheme ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '12px'
              }}>
                <span style={{ color: isDarkTheme ? '#94a3b8' : '#64748b' }}>📋 Total Bookings</span>
                <span style={{ 
                  fontWeight: '700', 
                  color: isDarkTheme ? '#10b981' : '#059669' 
                }}>
                  {realTimeData.totalBookings.toLocaleString()}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '0.75rem',
                background: isDarkTheme ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '12px'
              }}>
                <span style={{ color: isDarkTheme ? '#94a3b8' : '#64748b' }}>⚡ Response Time</span>
                <span style={{ 
                  fontWeight: '700', 
                  color: isDarkTheme ? '#f59e0b' : '#d97706' 
                }}>
                  {realTimeData.avgResponseTime.toFixed(1)}s
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '0.75rem',
                background: isDarkTheme ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '12px'
              }}>
                <span style={{ color: isDarkTheme ? '#94a3b8' : '#64748b' }}>🟢 Providers Online</span>
                <span style={{ 
                  fontWeight: '700', 
                  color: isDarkTheme ? '#8b5cf6' : '#7c3aed' 
                }}>
                  {realTimeData.providerOnline}%
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '0.75rem',
                background: isDarkTheme ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '12px'
              }}>
                <span style={{ color: isDarkTheme ? '#94a3b8' : '#64748b' }}>🖥️ System Load</span>
                <span style={{ 
                  fontWeight: '700', 
                  color: realTimeData.systemLoad > 80 
                    ? (isDarkTheme ? '#ef4444' : '#dc2626')
                    : (isDarkTheme ? '#10b981' : '#059669')
                }}>
                  {realTimeData.systemLoad}%
                </span>
              </div>
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
          <AdvancedLiveTracking 
            bookingId="BK-2025-ULTIMATE-001"
            providerId="provider-ultimate-001"
          />
        </div>
      ) : (
        <PremiumLiveTracking 
          bookingId="BK-2025-ULTIMATE-002"
          enableAR={true}
          enableVoice={true}
        />
      )}

      {/* Footer Status */}
      <div style={{ 
        position: 'fixed',
        bottom: '20px',
        left: '20px',
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
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            background: isSimulating ? '#10b981' : '#ef4444',
            borderRadius: '50%',
            animation: isSimulating ? 'pulse 2s ease-in-out infinite' : 'none'
          }} />
          <span style={{ fontWeight: '700' }}>
            {mode === 'advanced' ? '✨ Advanced' : '💎 Premium'}
          </span>
          <span>•</span>
          <span>{isDarkTheme ? '🌙' : '☀️'} {theme}</span>
          <span>•</span>
          <span>🚀 {isSimulating ? 'Live' : 'Paused'}</span>
          <span>•</span>
          <span>⚡ {simulationSpeed}x</span>
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

export default UltimateLiveTracking
