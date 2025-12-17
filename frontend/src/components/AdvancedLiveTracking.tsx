import React, { useState, useEffect } from 'react'
import '../styles/AdvancedLiveTracking.css'

interface Location {
  lat: number
  lng: number
  address: string
  timestamp: string
}

interface Provider {
  id: string
  name: string
  phone: string
  rating: number
  avatar: string
  status: 'online' | 'offline' | 'busy'
  vehicle: string
  experience: string
}

interface TimelineEvent {
  id: string
  time: string
  title: string
  description: string
  status: 'completed' | 'current' | 'upcoming'
}

interface AdvancedLiveTrackingProps {
  bookingId?: string
  providerId?: string
  initialLocation?: Location
}

const AdvancedLiveTracking: React.FC<AdvancedLiveTrackingProps> = ({
  bookingId = 'BK-2025-1234',
  providerId = 'provider-001',
  initialLocation
}) => {
  const [location, setLocation] = useState<Location>({
    lat: 28.6139,
    lng: 77.2090,
    address: 'Connaught Place, New Delhi, Delhi 110001',
    timestamp: new Date().toISOString()
  })
  
  const [provider, setProvider] = useState<Provider>({
    id: providerId,
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    rating: 4.8,
    avatar: '👨‍🔧',
    status: 'online',
    vehicle: 'Honda Activa',
    experience: '5+ years'
  })
  
  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    {
      id: '1',
      time: '10:30 AM',
      title: 'Booking Confirmed',
      description: 'Your service booking has been confirmed and provider assigned',
      status: 'completed'
    },
    {
      id: '2',
      time: '10:45 AM',
      title: 'Provider Started',
      description: 'Provider has started from their location',
      status: 'completed'
    },
    {
      id: '3',
      time: '11:15 AM',
      title: 'On the Way',
      description: 'Provider is currently on the way to your location',
      status: 'current'
    },
    {
      id: '4',
      time: '11:45 AM',
      title: 'Expected Arrival',
      description: 'Provider expected to arrive at your location',
      status: 'upcoming'
    },
    {
      id: '5',
      time: '12:00 PM',
      title: 'Service Started',
      description: 'Service work will begin at your location',
      status: 'upcoming'
    }
  ])
  
  const [stats, setStats] = useState({
    distance: 3.2,
    estimatedTime: 25,
    speed: 0,
    accuracy: 95
  })
  
  const [isLive, setIsLive] = useState(true)
  const [mapZoom, setMapZoom] = useState(15)
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap')

  // Simulate real-time location updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setLocation(prev => {
        // Simulate small movement
        const latChange = (Math.random() - 0.5) * 0.001
        const lngChange = (Math.random() - 0.5) * 0.001
        
        return {
          ...prev,
          lat: prev.lat + latChange,
          lng: prev.lng + lngChange,
          timestamp: new Date().toISOString()
        }
      })

      // Update stats
      setStats(prev => ({
        ...prev,
        distance: Math.max(0, prev.distance - Math.random() * 0.1),
        estimatedTime: Math.max(5, prev.estimatedTime - Math.random() * 0.5),
        speed: Math.min(60, Math.random() * 40),
        accuracy: 90 + Math.random() * 10
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  const handleCallProvider = () => {
    console.log(`Calling provider: ${provider.phone}`)
    // In real app, would initiate phone call
  }

  const handleShareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Provider Location',
        text: `Provider is currently at: ${location.address}`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`Provider Location: ${location.lat}, ${location.lng}`)
    }
  }

  const handleRefresh = () => {
    setLocation(prev => ({
      ...prev,
      timestamp: new Date().toISOString()
    }))
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEtaColor = (minutes: number) => {
    if (minutes <= 10) return '#10b981'
    if (minutes <= 20) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="advanced-live-tracking">
      <div className="tracking-header">
        <h1>Live Tracking</h1>
        <p>Track your service provider in real-time with advanced location services</p>
      </div>

      <div className="tracking-dashboard">
        {/* Map Section */}
        <div className="map-container">
          <div className="map-header">
            <div className="map-title">
              <span>📍</span>
              Provider Location
            </div>
            <div className="map-controls">
              <button className="map-control-btn" onClick={() => setMapZoom(prev => Math.min(20, prev + 1))}>
                ➕
              </button>
              <button className="map-control-btn" onClick={() => setMapZoom(prev => Math.max(1, prev - 1))}>
                ➖
              </button>
              <button className="map-control-btn" onClick={handleRefresh}>
                🔄
              </button>
            </div>
          </div>
          
          <div className="map-content">
            <div className="map-placeholder">
              <div className="map-placeholder-icon">🗺️</div>
              <h3>Interactive Map</h3>
              <p>Google Maps integration will be implemented here</p>
              <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#94a3b8' }}>
                Current zoom level: {mapZoom}x
              </p>
            </div>
            
            <div className="live-indicator">
              <div className="live-dot"></div>
              LIVE
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="info-panel">
          {/* Provider Card */}
          <div className="provider-card">
            <div className="provider-header">
              <div className="provider-avatar">
                {provider.avatar}
                <div className="provider-status"></div>
              </div>
              <div className="provider-info">
                <h3>{provider.name}</h3>
                <p>{provider.vehicle} • {provider.experience}</p>
                <div className="provider-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="star">
                        {i < Math.floor(provider.rating) ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span>{provider.rating}</span>
                </div>
              </div>
            </div>

            <div className="location-details">
              <h4>
                <span>📍</span>
                Current Location
              </h4>
              <div className="coordinates">
                <div className="coordinate-item">
                  <div className="coordinate-label">Latitude</div>
                  <div className="coordinate-value">{location.lat.toFixed(4)}</div>
                </div>
                <div className="coordinate-item">
                  <div className="coordinate-label">Longitude</div>
                  <div className="coordinate-value">{location.lng.toFixed(4)}</div>
                </div>
              </div>
              <div className="address-info">
                <strong>Address:</strong> {location.address}
                <br />
                <small>Last updated: {formatTime(location.timestamp)}</small>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card" style={{ '--stat-color': '#3b82f6', '--stat-glow': 'rgba(59, 130, 246, 0.3)' } as React.CSSProperties}>
              <div className="stat-icon">🛣️</div>
              <div className="stat-value">{stats.distance.toFixed(1)}</div>
              <div className="stat-label">km away</div>
              <div className="stat-change negative">
                -{Math.abs(stats.distance - 3.2).toFixed(1)} km
              </div>
            </div>

            <div className="stat-card" style={{ '--stat-color': '#10b981', '--stat-glow': 'rgba(16, 185, 129, 0.3)' } as React.CSSProperties}>
              <div className="stat-icon">⏱️</div>
              <div className="stat-value">{Math.round(stats.estimatedTime)}</div>
              <div className="stat-label">min ETA</div>
              <div className="stat-change positive">
                -{Math.abs(stats.estimatedTime - 25).toFixed(0)} min
              </div>
            </div>

            <div className="stat-card" style={{ '--stat-color': '#f59e0b', '--stat-glow': 'rgba(245, 158, 11, 0.3)' } as React.CSSProperties}>
              <div className="stat-icon">🚗</div>
              <div className="stat-value">{Math.round(stats.speed)}</div>
              <div className="stat-label">km/h</div>
              <div className="stat-change positive">
                {stats.speed > 0 ? '+' : ''}{Math.round(stats.speed)} km/h
              </div>
            </div>

            <div className="stat-card" style={{ '--stat-color': '#8b5cf6', '--stat-glow': 'rgba(139, 92, 246, 0.3)' } as React.CSSProperties}>
              <div className="stat-icon">🎯</div>
              <div className="stat-value">{Math.round(stats.accuracy)}%</div>
              <div className="stat-label">accuracy</div>
              <div className="stat-change positive">
                High precision
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline-container">
            <div className="timeline-header">
              <span>📋</span>
              Service Timeline
            </div>
            <div className="timeline-items">
              {timeline.map((event, index) => (
                <div key={event.id} className="timeline-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`timeline-dot ${event.status}`}></div>
                  <div className={`timeline-content ${event.status}`}>
                    <div className="timeline-time">{event.time}</div>
                    <div className="timeline-title">{event.title}</div>
                    <div className="timeline-description">{event.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="action-btn primary" onClick={handleCallProvider}>
          <span>📞</span>
          Call Provider
        </button>
        <button className="action-btn secondary" onClick={handleShareLocation}>
          <span>📤</span>
          Share Location
        </button>
        <button className="action-btn danger" onClick={() => setIsLive(!isLive)}>
          <span>{isLive ? '⏸️' : '▶️'}</span>
          {isLive ? 'Pause Tracking' : 'Resume Tracking'}
        </button>
      </div>
    </div>
  )
}

export default AdvancedLiveTracking
