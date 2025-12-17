import React, { useState, useEffect, useRef } from 'react'
import './ShareLocation.css'

interface LocationPoint {
  id: number
  name: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  type: 'home' | 'work' | 'favorite' | 'recent' | 'custom'
  icon: string
  description?: string
}

interface SharedLocation {
  id: number
  location: LocationPoint
  sharedWith: string[]
  timestamp: Date
  expiresAt: Date
  accessCode: string
  views: number
  isActive: boolean
}

const ShareLocation: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [savedLocations, setSavedLocations] = useState<LocationPoint[]>([])
  const [sharedLocations, setSharedLocations] = useState<SharedLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<LocationPoint | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [shareDuration, setShareDuration] = useState('1-hour')
  const [shareWith, setShareWith] = useState<string[]>([])
  const [customMessage, setCustomMessage] = useState('')
  const [showQRCode, setShowQRCode] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 40.7128, lng: -74.0060 })
  const [mapZoom, setMapZoom] = useState(14)
  const [isTracking, setIsTracking] = useState(false)
  const [trackingPath, setTrackingPath] = useState<{ lat: number; lng: number }[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'terrain'>('standard')
  const [showDirections, setShowDirections] = useState(false)
  const [destination, setDestination] = useState<LocationPoint | null>(null)
  const [directions, setDirections] = useState<any[]>([])
  const [estimatedTime, setEstimatedTime] = useState('')
  const [distance, setDistance] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [trafficLayer, setTrafficLayer] = useState(false)
  const [publicTransit, setPublicTransit] = useState(false)
  const [weatherInfo, setWeatherInfo] = useState<any>(null)
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([])
  const [selectedPlaceType, setSelectedPlaceType] = useState('all')
  const [locationHistory, setLocationHistory] = useState<LocationPoint[]>([])
  const [isGeofencing, setIsGeofencing] = useState(false)
  const [geofenceRadius, setGeofenceRadius] = useState(100)
  const [notifications, setNotifications] = useState<any[]>([])
  const mapRef = useRef<HTMLDivElement>(null)

  const defaultLocations: LocationPoint[] = [
    {
      id: 1,
      name: 'Home',
      address: '123 Main St, New York, NY 10001',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      type: 'home',
      icon: '🏠',
      description: 'My primary residence'
    },
    {
      id: 2,
      name: 'Work',
      address: '456 Office Blvd, New York, NY 10002',
      coordinates: { lat: 40.7580, lng: -73.9855 },
      type: 'work',
      icon: '🏢',
      description: 'Office building'
    },
    {
      id: 3,
      name: 'Central Park',
      address: 'Central Park, New York, NY',
      coordinates: { lat: 40.7829, lng: -73.9654 },
      type: 'favorite',
      icon: '🌳',
      description: 'Favorite park for jogging'
    },
    {
      id: 4,
      name: 'Times Square',
      address: 'Times Square, New York, NY',
      coordinates: { lat: 40.7580, lng: -73.9855 },
      type: 'recent',
      icon: '🎭',
      description: 'Visited yesterday'
    }
  ]

  const placeTypes = [
    { id: 'all', name: 'All Places', icon: '📍' },
    { id: 'restaurant', name: 'Restaurants', icon: '🍽️' },
    { id: 'gas_station', name: 'Gas Stations', icon: '⛽' },
    { id: 'hospital', name: 'Hospitals', icon: '🏥' },
    { id: 'parking', name: 'Parking', icon: '🅿️' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'transit', name: 'Transit', icon: '🚇' }
  ]

  useEffect(() => {
    setSavedLocations(defaultLocations)
    getCurrentLocation()
    loadSharedLocations()
    loadLocationHistory()
  }, [])

  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        getCurrentLocation()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isTracking])

  useEffect(() => {
    if (currentLocation) {
      fetchNearbyPlaces()
      fetchWeatherInfo()
    }
  }, [currentLocation, selectedPlaceType])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setCurrentLocation(location)
          setMapCenter(location)
          
          if (isTracking) {
            setTrackingPath(prev => [...prev, location])
          }
        },
        (error) => {
          console.error('Error getting location:', error)
          addNotification('error', 'Unable to get your location')
        }
      )
    }
  }

  const loadSharedLocations = () => {
    // Simulate loading shared locations
    const mockShared: SharedLocation[] = [
      {
        id: 1,
        location: defaultLocations[0],
        sharedWith: ['john@example.com', 'sarah@example.com'],
        timestamp: new Date(Date.now() - 3600000),
        expiresAt: new Date(Date.now() + 3600000),
        accessCode: 'ABC123',
        views: 5,
        isActive: true
      }
    ]
    setSharedLocations(mockShared)
  }

  const loadLocationHistory = () => {
    // Simulate loading location history
    const history: LocationPoint[] = [
      {
        id: 5,
        name: 'Coffee Shop',
        address: '789 Coffee St, New York, NY',
        coordinates: { lat: 40.7614, lng: -73.9776 },
        type: 'recent',
        icon: '☕',
        description: 'Morning coffee stop'
      }
    ]
    setLocationHistory(history)
  }

  const shareLocation = () => {
    if (!selectedLocation) return

    setIsSharing(true)
    
    // Generate access code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setAccessCode(code)
    
    // Calculate expiry time
    const now = new Date()
    let expiresAt = new Date()
    
    switch (shareDuration) {
      case '15-min':
        expiresAt = new Date(now.getTime() + 15 * 60 * 1000)
        break
      case '1-hour':
        expiresAt = new Date(now.getTime() + 60 * 60 * 1000)
        break
      case '6-hours':
        expiresAt = new Date(now.getTime() + 6 * 60 * 60 * 1000)
        break
      case '1-day':
        expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)
        break
      case '1-week':
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        break
    }
    
    const newShare: SharedLocation = {
      id: Date.now(),
      location: selectedLocation,
      sharedWith: shareWith,
      timestamp: now,
      expiresAt,
      accessCode: code,
      views: 0,
      isActive: true
    }
    
    setSharedLocations(prev => [newShare, ...prev])
    setShowQRCode(true)
    setIsSharing(false)
    
    addNotification('success', `Location shared successfully! Access code: ${code}`)
  }

  const stopSharing = (shareId: number) => {
    setSharedLocations(prev => 
      prev.map(share => 
        share.id === shareId 
          ? { ...share, isActive: false }
          : share
      )
    )
    addNotification('info', 'Location sharing stopped')
  }

  const saveLocation = (location: LocationPoint) => {
    if (!savedLocations.find(loc => loc.id === location.id)) {
      setSavedLocations(prev => [location, ...prev])
      addNotification('success', 'Location saved successfully')
    }
  }

  const deleteLocation = (locationId: number) => {
    setSavedLocations(prev => prev.filter(loc => loc.id !== locationId))
    addNotification('info', 'Location removed')
  }

  const getDirections = () => {
    if (!currentLocation || !destination) return

    // Simulate directions API
    const mockDirections = [
      { instruction: 'Head north on Main St', distance: '0.2 mi', duration: '2 min' },
      { instruction: 'Turn right onto 5th Ave', distance: '0.5 mi', duration: '3 min' },
      { instruction: 'Turn left onto Broadway', distance: '0.3 mi', duration: '2 min' },
      { instruction: 'Your destination is on the right', distance: '0.1 mi', duration: '1 min' }
    ]
    
    setDirections(mockDirections)
    setEstimatedTime('8 min')
    setDistance('1.1 mi')
    setShowDirections(true)
  }

  const fetchNearbyPlaces = () => {
    if (!currentLocation) return

    // Simulate nearby places API
    const mockPlaces = [
      { id: 1, name: 'Starbucks', type: 'restaurant', rating: 4.2, distance: '0.2 mi', icon: '☕' },
      { id: 2, name: 'Shell Gas', type: 'gas_station', rating: 4.0, distance: '0.5 mi', icon: '⛽' },
      { id: 3, name: 'Central Hospital', type: 'hospital', rating: 4.5, distance: '1.2 mi', icon: '🏥' },
      { id: 4, name: 'City Mall', type: 'shopping', rating: 4.3, distance: '0.8 mi', icon: '🛍️' },
      { id: 5, name: 'Subway Station', type: 'transit', rating: 4.1, distance: '0.3 mi', icon: '🚇' }
    ]
    
    const filtered = selectedPlaceType === 'all' 
      ? mockPlaces 
      : mockPlaces.filter(place => place.type === selectedPlaceType)
    
    setNearbyPlaces(filtered)
  }

  const fetchWeatherInfo = () => {
    if (!currentLocation) return

    // Simulate weather API
    const mockWeather = {
      temperature: 72,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 8,
      icon: '⛅'
    }
    setWeatherInfo(mockWeather)
  }

  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const notification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date()
    }
    setNotifications(prev => [notification, ...prev])
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    }, 5000)
  }

  const generateShareLink = (share: SharedLocation) => {
    return `https://maps.example.com/share/${share.accessCode}`
  }

  const formatDuration = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <div className={`share-location ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="location-header">
        <div className="header-content">
          <h1>📍 Share Location</h1>
          <p>Share your real-time location with friends and family</p>
        </div>
        <div className="header-actions">
          <button 
            className={`action-btn ${isTracking ? 'active' : ''}`}
            onClick={() => setIsTracking(!isTracking)}
          >
            {isTracking ? '⏸️ Stop Tracking' : '▶️ Start Tracking'}
          </button>
          <button 
            className="action-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <div className="location-main">
        <div className="map-section">
          <div className="map-container" ref={mapRef}>
            {/* Map placeholder - in real app, integrate with Google Maps or Mapbox */}
            <div className="map-placeholder">
              <div className="map-center">
                <span className="map-icon">🗺️</span>
                <p>Interactive Map View</p>
                <small>Center: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</small>
              </div>
              
              {currentLocation && (
                <div className="current-location-marker">
                  <span className="marker-icon">📍</span>
                  <span className="marker-pulse"></span>
                </div>
              )}
              
              {trackingPath.length > 0 && (
                <div className="tracking-path">
                  {trackingPath.map((point, index) => (
                    <div 
                      key={index}
                      className="path-point"
                      style={{
                        left: `${((point.lng - mapCenter.lng) * 100) + 50}%`,
                        top: `${50 - ((point.lat - mapCenter.lat) * 100)}%`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="map-controls">
              <div className="zoom-controls">
                <button onClick={() => setMapZoom(prev => Math.min(prev + 1, 20))}>+</button>
                <button onClick={() => setMapZoom(prev => Math.max(prev - 1, 1))}>-</button>
              </div>
              
              <div className="layer-controls">
                <button 
                  className={`layer-btn ${trafficLayer ? 'active' : ''}`}
                  onClick={() => setTrafficLayer(!trafficLayer)}
                >
                  🚦 Traffic
                </button>
                <button 
                  className={`layer-btn ${publicTransit ? 'active' : ''}`}
                  onClick={() => setPublicTransit(!publicTransit)}
                >
                  🚇 Transit
                </button>
              </div>
              
              <div className="style-controls">
                {(['standard', 'satellite', 'terrain'] as const).map(style => (
                  <button
                    key={style}
                    className={`style-btn ${mapStyle === style ? 'active' : ''}`}
                    onClick={() => setMapStyle(style)}
                  >
                    {style === 'standard' ? '🗺️' : style === 'satellite' ? '🛰️' : '⛰️'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {weatherInfo && (
            <div className="weather-widget">
              <div className="weather-info">
                <span className="weather-icon">{weatherInfo.icon}</span>
                <span className="weather-temp">{weatherInfo.temperature}°F</span>
                <span className="weather-condition">{weatherInfo.condition}</span>
              </div>
              <div className="weather-details">
                <span>💧 {weatherInfo.humidity}%</span>
                <span>💨 {weatherInfo.windSpeed} mph</span>
              </div>
            </div>
          )}
        </div>

        <div className="location-sidebar">
          {currentLocation && (
            <div className="current-location-card">
              <h3>📍 Current Location</h3>
              <div className="location-details">
                <p className="coordinates">
                  {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                </p>
                <p className="accuracy">Accuracy: ±10 meters</p>
                <p className="timestamp">
                  Updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
              <div className="location-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => {
                    const currentLoc: LocationPoint = {
                      id: Date.now(),
                      name: 'Current Location',
                      address: 'Current GPS Location',
                      coordinates: currentLocation,
                      type: 'custom',
                      icon: '📍'
                    }
                    setSelectedLocation(currentLoc)
                  }}
                >
                  Share This Location
                </button>
                <button className="action-btn secondary" onClick={getCurrentLocation}>
                  🔄 Refresh
                </button>
              </div>
            </div>
          )}

          <div className="saved-locations">
            <div className="section-header">
              <h3>📍 Saved Places</h3>
              <button className="add-btn" onClick={() => {
                if (currentLocation) {
                  const newLocation: LocationPoint = {
                    id: Date.now(),
                    name: `Location ${savedLocations.length + 1}`,
                    address: 'Custom Location',
                    coordinates: currentLocation,
                    type: 'custom',
                    icon: '📍'
                  }
                  saveLocation(newLocation)
                }
              }}>
                ➕
              </button>
            </div>
            
            <div className="locations-list">
              {savedLocations.map(location => (
                <div key={location.id} className="location-item">
                  <div className="location-info">
                    <span className="location-icon">{location.icon}</span>
                    <div className="location-details">
                      <h4>{location.name}</h4>
                      <p>{location.address}</p>
                      {location.description && (
                        <small>{location.description}</small>
                      )}
                    </div>
                  </div>
                  <div className="location-actions">
                    <button 
                      className="action-btn small"
                      onClick={() => {
                        setSelectedLocation(location)
                        setMapCenter(location.coordinates)
                      }}
                    >
                      📍
                    </button>
                    <button 
                      className="action-btn small"
                      onClick={() => {
                        setDestination(location)
                        getDirections()
                      }}
                    >
                      🧭
                    </button>
                    {location.type === 'custom' && (
                      <button 
                        className="action-btn small danger"
                        onClick={() => deleteLocation(location.id)}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="nearby-places">
            <div className="section-header">
              <h3>🏪 Nearby Places</h3>
              <select 
                value={selectedPlaceType}
                onChange={(e) => setSelectedPlaceType(e.target.value)}
                className="place-type-selector"
              >
                {placeTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="places-list">
              {nearbyPlaces.map(place => (
                <div key={place.id} className="place-item">
                  <div className="place-info">
                    <span className="place-icon">{place.icon}</span>
                    <div className="place-details">
                      <h4>{place.name}</h4>
                      <div className="place-meta">
                        <span>⭐ {place.rating}</span>
                        <span>📏 {place.distance}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="action-btn small"
                    onClick={() => {
                      const placeLocation: LocationPoint = {
                        id: place.id,
                        name: place.name,
                        address: 'Nearby Location',
                        coordinates: {
                          lat: currentLocation!.lat + (Math.random() - 0.5) * 0.01,
                          lng: currentLocation!.lng + (Math.random() - 0.5) * 0.01
                        },
                        type: 'custom',
                        icon: place.icon
                      }
                      setDestination(placeLocation)
                      getDirections()
                    }}
                  >
                    🧭
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedLocation && (
        <div className="share-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>📍 Share Location</h3>
              <button className="close-btn" onClick={() => setSelectedLocation(null)}>
                ✕
              </button>
            </div>
            
            <div className="location-preview">
              <div className="preview-info">
                <span className="location-icon large">{selectedLocation.icon}</span>
                <div>
                  <h4>{selectedLocation.name}</h4>
                  <p>{selectedLocation.address}</p>
                </div>
              </div>
            </div>

            <div className="share-options">
              <div className="option-group">
                <label>Share Duration</label>
                <select 
                  value={shareDuration}
                  onChange={(e) => setShareDuration(e.target.value)}
                  className="duration-selector"
                >
                  <option value="15-min">15 minutes</option>
                  <option value="1-hour">1 hour</option>
                  <option value="6-hours">6 hours</option>
                  <option value="1-day">1 day</option>
                  <option value="1-week">1 week</option>
                </select>
              </div>

              <div className="option-group">
                <label>Share With (Email addresses)</label>
                <input
                  type="text"
                  placeholder="Enter email addresses separated by commas"
                  value={shareWith.join(', ')}
                  onChange={(e) => setShareWith(e.target.value.split(',').map(email => email.trim()))}
                  className="share-input"
                />
              </div>

              <div className="option-group">
                <label>Custom Message (Optional)</label>
                <textarea
                  placeholder="Add a message for the recipients..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="message-textarea"
                  rows={3}
                />
              </div>
            </div>

            <div className="share-actions">
              <button 
                className="action-btn primary large"
                onClick={shareLocation}
                disabled={isSharing || shareWith.length === 0}
              >
                {isSharing ? '⏳ Sharing...' : '🔗 Share Location'}
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => setShowQRCode(!showQRCode)}
              >
                📱 Generate QR Code
              </button>
            </div>

            {showQRCode && accessCode && (
              <div className="qr-section">
                <h4>📱 QR Code & Access Code</h4>
                <div className="qr-code">
                  {/* QR Code placeholder - in real app, generate actual QR code */}
                  <div className="qr-placeholder">
                    <span>📱</span>
                    <p>QR Code</p>
                  </div>
                </div>
                <div className="access-code">
                  <label>Access Code:</label>
                  <div className="code-display">
                    <code>{accessCode}</code>
                    <button 
                      className="copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(accessCode)
                        addNotification('success', 'Access code copied to clipboard!')
                      }}
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
                <div className="share-link">
                  <label>Share Link:</label>
                  <div className="link-display">
                    <input
                      type="text"
                      value={`https://maps.example.com/share/${accessCode}`}
                      readOnly
                    />
                    <button 
                      className="copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(`https://maps.example.com/share/${accessCode}`)
                        addNotification('success', 'Share link copied to clipboard!')
                      }}
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showDirections && destination && (
        <div className="directions-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🧭 Directions</h3>
              <button className="close-btn" onClick={() => setShowDirections(false)}>
                ✕
              </button>
            </div>
            
            <div className="directions-summary">
              <div className="summary-info">
                <span className="summary-icon">🚗</span>
                <div>
                  <h4>To: {destination.name}</h4>
                  <p>{distance} • {estimatedTime}</p>
                </div>
              </div>
            </div>

            <div className="directions-steps">
              {directions.map((step, index) => (
                <div key={index} className="direction-step">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-content">
                    <p>{step.instruction}</p>
                    <small>{step.distance} • {step.duration}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="directions-actions">
              <button className="action-btn primary">
                🚖 Start Navigation
              </button>
              <button className="action-btn secondary">
                📋 Copy Directions
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="shared-locations">
        <div className="section-header">
          <h3>🔗 Active Shares</h3>
        </div>
        
        <div className="shares-list">
          {sharedLocations.map(share => (
            <div key={share.id} className="share-item">
              <div className="share-info">
                <span className="share-icon">{share.location.icon}</span>
                <div className="share-details">
                  <h4>{share.location.name}</h4>
                  <p>Shared with {share.sharedWith.length} people</p>
                  <div className="share-meta">
                    <span>👁️ {share.views} views</span>
                    <span>⏰ Expires in {formatDuration(share.expiresAt)}</span>
                    <span className={`status ${share.isActive ? 'active' : 'expired'}`}>
                      {share.isActive ? '🟢 Active' : '🔴 Expired'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="share-actions">
                <button 
                  className="action-btn small"
                  onClick={() => {
                    navigator.clipboard.writeText(generateShareLink(share))
                    addNotification('success', 'Share link copied to clipboard!')
                  }}
                >
                  📋
                </button>
                {share.isActive && (
                  <button 
                    className="action-btn small danger"
                    onClick={() => stopSharing(share.id)}
                  >
                    ⏹️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map(notification => (
            <div key={notification.id} className={`notification ${notification.type}`}>
              <span className="notification-icon">
                {notification.type === 'success' ? '✅' : 
                 notification.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              <span className="notification-message">{notification.message}</span>
              <button 
                className="notification-close"
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ShareLocation
