import React, { useState, useEffect, useRef } from 'react'
import '../styles/AdvancedLiveTracking.css'

interface RoutePoint {
  lat: number
  lng: number
  timestamp: string
  speed: number
}

interface AdvancedStats {
  totalDistance: number
  avgSpeed: number
  maxSpeed: number
  travelTime: number
  stopsCount: number
  fuelEfficiency: number
}

interface PremiumLiveTrackingProps {
  bookingId?: string
  enableAR?: boolean
  enableVoice?: boolean
}

const PremiumLiveTracking: React.FC<PremiumLiveTrackingProps> = ({
  bookingId = 'BK-2025-5678',
  enableAR = false,
  enableVoice = false
}) => {
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090 })
  const [route, setRoute] = useState<RoutePoint[]>([])
  const [isTracking, setIsTracking] = useState(true)
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite' | 'terrain' | 'dark'>('default')
  const [trafficLayer, setTrafficLayer] = useState(true)
  const [weatherInfo, setWeatherInfo] = useState({
    temp: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12
  })
  
  const [advancedStats, setAdvancedStats] = useState<AdvancedStats>({
    totalDistance: 3.2,
    avgSpeed: 25,
    maxSpeed: 45,
    travelTime: 8,
    stopsCount: 2,
    fuelEfficiency: 85
  })

  const mapRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Simulate route tracking
  useEffect(() => {
    if (!isTracking) return

    const interval = setInterval(() => {
      const newPoint: RoutePoint = {
        lat: location.lat + (Math.random() - 0.5) * 0.002,
        lng: location.lng + (Math.random() - 0.5) * 0.002,
        timestamp: new Date().toISOString(),
        speed: 20 + Math.random() * 30
      }

      setLocation({ lat: newPoint.lat, lng: newPoint.lng })
      setRoute(prev => [...prev.slice(-19), newPoint]) // Keep last 20 points

      // Update advanced stats
      setAdvancedStats(prev => ({
        ...prev,
        totalDistance: prev.totalDistance + Math.random() * 0.05,
        avgSpeed: 20 + Math.random() * 20,
        maxSpeed: Math.max(prev.maxSpeed, newPoint.speed),
        travelTime: prev.travelTime + 1,
        fuelEfficiency: 80 + Math.random() * 15
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isTracking, location])

  // Simulate weather updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherInfo(prev => ({
        ...prev,
        temp: prev.temp + (Math.random() - 0.5) * 2,
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 5)),
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 3)
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleMapMouseMove = (e: React.MouseEvent) => {
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePosition({ x, y })
    }
  }

  const getWeatherIcon = (condition: string) => {
    const icons: { [key: string]: string } = {
      'Partly Cloudy': '⛅',
      'Sunny': '☀️',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Clear': '🌙'
    }
    return icons[condition] || '🌤️'
  }

  const getRouteColor = (speed: number) => {
    if (speed < 20) return '#ef4444' // Red for slow
    if (speed < 40) return '#f59e0b' // Orange for medium
    return '#10b981' // Green for fast
  }

  return (
    <div className="advanced-live-tracking" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      color: '#f8fafc'
    }}>
      {/* Premium Header */}
      <div className="tracking-header">
        <h1 style={{
          background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Premium Live Tracking
        </h1>
        <p style={{ color: '#94a3b8' }}>
          Advanced real-time tracking with AI-powered analytics and predictive ETA
        </p>
      </div>

      {/* Control Panel */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {['default', 'satellite', 'terrain', 'dark'].map((style) => (
          <button
            key={style}
            onClick={() => setMapStyle(style as any)}
            style={{
              padding: '0.75rem 1.5rem',
              border: mapStyle === style ? '2px solid #60a5fa' : '2px solid #475569',
              background: mapStyle === style ? 'rgba(96, 165, 250, 0.1)' : 'transparent',
              color: mapStyle === style ? '#60a5fa' : '#94a3b8',
              borderRadius: '25px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: '600',
              textTransform: 'capitalize'
            }}
          >
            {style === 'default' ? '🗺️' : style === 'satellite' ? '🛰️' : style === 'terrain' ? '⛰️' : '🌙'} {style}
          </button>
        ))}
      </div>

      <div className="tracking-dashboard">
        {/* Enhanced Map */}
        <div className="map-container" style={{
          background: '#1e293b',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div className="map-header" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}>
            <div className="map-title">
              <span>🛰️</span>
              AI-Powered Navigation
            </div>
            <div className="map-controls">
              <button className="map-control-btn" onClick={() => setTrafficLayer(!trafficLayer)}>
                {trafficLayer ? '🚦' : '🛣️'}
              </button>
              <button className="map-control-btn" onClick={() => setIsTracking(!isTracking)}>
                {isTracking ? '⏸️' : '▶️'}
              </button>
              <button className="map-control-btn">
                🎯
              </button>
            </div>
          </div>
          
          <div 
            ref={mapRef}
            className="map-content" 
            style={{ 
              background: mapStyle === 'dark' ? '#0f172a' : '#1e293b',
              position: 'relative',
              cursor: 'crosshair'
            }}
            onMouseMove={handleMapMouseMove}
          >
            {/* Route Visualization */}
            <svg style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}>
              {route.map((point, index) => {
                if (index === 0) return null
                const prevPoint = route[index - 1]
                const x1 = 50 + (prevPoint.lng - 77.2090) * 10000
                const y1 = 50 - (prevPoint.lat - 28.6139) * 10000
                const x2 = 50 + (point.lng - 77.2090) * 10000
                const y2 = 50 - (point.lat - 28.6139) * 10000
                
                return (
                  <line
                    key={index}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={getRouteColor(point.speed)}
                    strokeWidth="3"
                    strokeOpacity="0.8"
                  />
                )
              })}
            </svg>

            {/* Current Position Marker */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              border: '3px solid white',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              🚗
            </div>

            {/* Mouse Glow Effect */}
            <div style={{
              position: 'absolute',
              top: `${mousePosition.y}%`,
              left: `${mousePosition.x}%`,
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 70%)',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              opacity: 0.8
            }} />

            <div className="map-placeholder" style={{ color: '#94a3b8' }}>
              <div className="map-placeholder-icon">🗺️</div>
              <h3>Premium Map View</h3>
              <p>Advanced 3D mapping with real-time traffic</p>
              <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
                Style: {mapStyle} • Traffic: {trafficLayer ? 'On' : 'Off'}
              </p>
            </div>
            
            <div className="live-indicator" style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            }}>
              <div className="live-dot"></div>
              AI TRACKING
            </div>
          </div>
        </div>

        {/* Enhanced Info Panel */}
        <div className="info-panel">
          {/* Weather Widget */}
          <div className="provider-card" style={{ background: '#1e293b' }}>
            <h3 style={{ color: '#f8fafc', marginBottom: '1rem' }}>
              🌤️ Weather Conditions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                  {getWeatherIcon(weatherInfo.condition)}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f8fafc' }}>
                  {Math.round(weatherInfo.temp)}°C
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  {weatherInfo.condition}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>💧 Humidity:</span>
                  <span style={{ color: '#f8fafc', fontWeight: '600' }}>{weatherInfo.humidity}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>💨 Wind:</span>
                  <span style={{ color: '#f8fafc', fontWeight: '600' }}>{weatherInfo.windSpeed} km/h</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>🌡️ Feels like:</span>
                  <span style={{ color: '#f8fafc', fontWeight: '600' }}>
                    {Math.round(weatherInfo.temp - 2)}°C
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Stats */}
          <div className="stats-grid">
            <div className="stat-card" style={{ 
              background: '#1e293b',
              '--stat-color': '#3b82f6',
              '--stat-glow': 'rgba(59, 130, 246, 0.3)'
            } as React.CSSProperties}>
              <div className="stat-icon">🛣️</div>
              <div className="stat-value" style={{ color: '#f8fafc' }}>
                {advancedStats.totalDistance.toFixed(1)}
              </div>
              <div className="stat-label" style={{ color: '#94a3b8' }}>km traveled</div>
            </div>

            <div className="stat-card" style={{ 
              background: '#1e293b',
              '--stat-color': '#10b981',
              '--stat-glow': 'rgba(16, 185, 129, 0.3)'
            } as React.CSSProperties}>
              <div className="stat-icon">⚡</div>
              <div className="stat-value" style={{ color: '#f8fafc' }}>
                {advancedStats.avgSpeed.toFixed(0)}
              </div>
              <div className="stat-label" style={{ color: '#94a3b8' }}>avg speed km/h</div>
            </div>

            <div className="stat-card" style={{ 
              background: '#1e293b',
              '--stat-color': '#f59e0b',
              '--stat-glow': 'rgba(245, 158, 11, 0.3)'
            } as React.CSSProperties}>
              <div className="stat-icon">⏱️</div>
              <div className="stat-value" style={{ color: '#f8fafc' }}>
                {advancedStats.travelTime}
              </div>
              <div className="stat-label" style={{ color: '#94a3b8' }}>minutes active</div>
            </div>

            <div className="stat-card" style={{ 
              background: '#1e293b',
              '--stat-color': '#8b5cf6',
              '--stat-glow': 'rgba(139, 92, 246, 0.3)'
            } as React.CSSProperties}>
              <div className="stat-icon">⛽</div>
              <div className="stat-value" style={{ color: '#f8fafc' }}>
                {advancedStats.fuelEfficiency.toFixed(0)}%
              </div>
              <div className="stat-label" style={{ color: '#94a3b8' }}>fuel efficiency</div>
            </div>
          </div>

          {/* Route Analysis */}
          <div className="timeline-container" style={{ background: '#1e293b' }}>
            <div className="timeline-header" style={{ color: '#f8fafc' }}>
              <span>📊</span>
              Route Analysis
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>Route Efficiency</span>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>92%</span>
                </div>
                <div style={{ 
                  height: '8px', 
                  background: '#334155', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '92%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>Traffic Density</span>
                  <span style={{ color: '#f59e0b', fontWeight: '600' }}>Moderate</span>
                </div>
                <div style={{ 
                  height: '8px', 
                  background: '#334155', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '45%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>Predicted Delay</span>
                  <span style={{ color: '#ef4444', fontWeight: '600' }}>+5 min</span>
                </div>
                <div style={{ 
                  height: '8px', 
                  background: '#334155', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '15%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Actions */}
      <div className="action-buttons">
        <button className="action-btn primary" style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
        }}>
          <span>🎙️</span>
          {enableVoice ? 'Voice Guide' : 'Enable Voice'}
        </button>
        <button className="action-btn secondary" style={{
          background: 'transparent',
          border: '2px solid #3b82f6',
          color: '#3b82f6'
        }}>
          <span>🥽</span>
          {enableAR ? 'AR View' : 'Enable AR'}
        </button>
        <button className="action-btn danger" style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
        }}>
          <span>📱</span>
          Share Live Location
        </button>
      </div>
    </div>
  )
}

export default PremiumLiveTracking
