import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/EmergencyServices.css'
import '../js/emergency-fixes'

interface EmergencyService {
  id: string
  title: string
  category: string
  price: number
  responseTime: number
  available: boolean
  description: string
  providerCount: number
}

export default function EmergencyServices() {
  const navigate = useNavigate()
  const [services, setServices] = useState<EmergencyService[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<EmergencyService | null>(null)
  const [userLocation, setUserLocation] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [expandedService, setExpandedService] = useState<string | null>(null)
  const location = useLocation()
  const fromQuickAction = location.state?.fromQuickAction

  const emergencyServices: EmergencyService[] = [
    {
      id: 'emergency-plumbing',
      title: 'Emergency Plumbing',
      category: 'Plumbing',
      price: 2500,
      responseTime: 30,
      available: true,
      description: '24/7 emergency plumbing services for leaks, bursts, and blockages',
      providerCount: 12
    },
    {
      id: 'emergency-electrical',
      title: '24/7 Electrical',
      category: 'Electrical',
      price: 3000,
      responseTime: 45,
      available: true,
      description: 'Urgent electrical repairs and power restoration services',
      providerCount: 8
    },
    {
      id: 'emergency-ac',
      title: 'Emergency AC Repair',
      category: 'AC Repair',
      price: 2000,
      responseTime: 60,
      available: true,
      description: 'Immediate AC repair for breakdowns and cooling failures',
      providerCount: 15
    },
    {
      id: 'emergency-locksmith',
      title: 'Urgent Locksmith',
      category: 'Security',
      price: 1800,
      responseTime: 20,
      available: true,
      description: 'Emergency lockout and lock replacement services',
      providerCount: 6
    },
    {
      id: 'emergency-medical',
      title: 'Medical Transport',
      category: 'Medical',
      price: 1500,
      responseTime: 15,
      available: true,
      description: 'Non-emergency medical transportation services',
      providerCount: 10
    },
    {
      id: 'emergency-gas',
      title: 'Gas Leak Repair',
      category: 'Gas',
      price: 3500,
      responseTime: 25,
      available: true,
      description: 'Urgent gas leak detection and repair services',
      providerCount: 4
    }
  ]

  useEffect(() => {
    // Get user location with error handling
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
          },
          (error) => {
            console.log('Location access denied:', error)
            setUserLocation('Location not available')
          }
        )
      } else {
        setUserLocation('Geolocation not supported')
      }
    } catch (error) {
      console.error('Error getting location:', error)
      setUserLocation('Location error')
    }

    // Load emergency services with fallback
    try {
      // Simulate loading delay for better UX
      const loadTimer = setTimeout(() => {
        if (emergencyServices && emergencyServices.length > 0) {
          setServices(emergencyServices)
          setError(null)
        } else {
          setError('No emergency services available')
        }
        setLoading(false)
      }, 800)

      return () => clearTimeout(loadTimer)
    } catch (error) {
      console.error('Error loading services:', error)
      setError('Failed to load emergency services')
      setServices(emergencyServices)
      setLoading(false)
    }
  }, [])

  const handleBookEmergency = (service: EmergencyService) => {
    try {
      // Add haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      
      setSelectedService(service)
      // Navigate to advanced booking flow with service data
      navigate('/advanced-booking', { 
        state: { 
          service: {
            id: service.id,
            title: service.title,
            category: service.category,
            price: service.price,
            duration: '2-4 hours',
            description: service.description,
            features: ['24/7 Emergency', 'Expert Technicians', 'Warranty Included', 'Same Day Service'],
            professionals: service.providerCount,
            rating: 4.8,
            reviews: 342,
            availability: service.available
          },
          urgency: 'urgent',
          fromEmergency: true
        } 
      })
    } catch (error) {
      console.error('Error booking emergency service:', error)
      alert('Failed to book emergency service. Please try again.')
    }
  }

  const handleCallEmergency = (service: EmergencyService) => {
    try {
      // Add haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
      
      // In a real app, this would call the emergency hotline
      if (confirm(`Call emergency ${service.category} service?\n\nIn a real app, this would initiate a phone call to: 1-800-URGENT`)) {
        alert(`Connecting to ${service.title}...\n\nPlease stay on the line. A representative will be with you shortly.`)
      }
    } catch (error) {
      console.error('Error calling emergency service:', error)
      alert('Failed to connect to emergency service. Please call 1-800-URGENT directly.')
    }
  }

  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedService(expandedService === serviceId ? null : serviceId)
  }

  if (loading) {
    return (
      <div className="emergency-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <h2>Finding Emergency Services...</h2>
          <p>Locating available providers near you</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="emergency-loading">
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <h2>Service Unavailable</h2>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="emergency-services">
      <div className="emergency-header">
        <div className="emergency-alert">
          <div className="alert-icon">
            <span className="pulse-animation">🚨</span>
          </div>
          <div className="alert-content">
            <h1>Emergency Services</h1>
            <p>24/7 immediate assistance for urgent needs</p>
            {fromQuickAction && (
              <div className="quick-action-indicator">
                <span>⚡ Quick Action Accessed</span>
              </div>
            )}
            <div className="location-info">
              <span className="location-icon">📍</span>
              <span>{userLocation || 'Detecting location...'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="emergency-content">
        {services.length === 0 ? (
          <div className="no-services">
            <div className="no-services-icon">🚨</div>
            <h2>No Emergency Services Available</h2>
            <p>We're sorry, but no emergency services are currently available in your area.</p>
            <div className="emergency-hotline">
              <h3>Emergency Hotline</h3>
              <div className="hotline-number">
                <span className="phone-icon">📞</span>
                <span className="number">1-800-URGENT</span>
              </div>
              <p>For immediate assistance, call our 24/7 emergency hotline</p>
            </div>
          </div>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="emergency-service-card">
                <div className="service-header">
                  <div className="service-info">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                  <div className="service-status">
                    <div className={`status-indicator ${service.available ? 'available' : 'unavailable'}`}>
                      <span className="status-dot"></span>
                      <span>{service.available ? 'Available' : 'Busy'}</span>
                    </div>
                  </div>
                </div>

                <div className="service-metrics">
                  <div className="metric">
                    <span className="metric-icon">⏱️</span>
                    <div className="metric-content">
                      <span className="metric-value">{service.responseTime} min</span>
                      <span className="metric-label">Response Time</span>
                    </div>
                  </div>
                  <div className="metric">
                    <span className="metric-icon">💰</span>
                    <div className="metric-content">
                      <span className="metric-value">₹{service.price}</span>
                      <span className="metric-label">Starting Price</span>
                    </div>
                  </div>
                  <div className="metric">
                    <span className="metric-icon">👥</span>
                    <div className="metric-content">
                      <span className="metric-value">{service.providerCount}</span>
                      <span className="metric-label">Providers Available</span>
                    </div>
                  </div>
                </div>

                {/* Expandable Details */}
                <div className={`service-details ${expandedService === service.id ? 'expanded' : ''}`}>
                  <button 
                    className="expand-btn"
                    onClick={() => toggleServiceExpansion(service.id)}
                  >
                    <span>{expandedService === service.id ? '▼' : '▶'} More Details</span>
                  </button>
                  
                  {expandedService === service.id && (
                    <div className="expanded-content">
                      <div className="detail-item">
                        <span className="detail-icon">🔧</span>
                        <div className="detail-text">
                          <h4>Services Include</h4>
                          <p>Emergency repairs, diagnostics, and immediate solutions for {service.category.toLowerCase()} issues.</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🕐</span>
                        <div className="detail-text">
                          <h4>Availability</h4>
                          <p>Available 24/7 including holidays and weekends. Average response time: {service.responseTime} minutes.</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">💳</span>
                        <div className="detail-text">
                          <h4>Pricing</h4>
                          <p>Starting at ₹{service.price}. Final cost depends on the complexity and required materials.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="service-actions">
                  <button 
                    className="emergency-book-btn"
                    onClick={() => handleBookEmergency(service)}
                    disabled={!service.available}
                  >
                    <span className="btn-icon">📱</span>
                    Book Emergency Service
                  </button>
                  <button 
                    className="emergency-call-btn"
                    onClick={() => handleCallEmergency(service)}
                    disabled={!service.available}
                  >
                    <span className="btn-icon">📞</span>
                    Call Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="emergency-info">
          <div className="info-card">
            <h3>Emergency Information</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-icon">⚡</span>
                <div className="info-content">
                  <h4>Quick Response</h4>
                  <p>Providers arrive within the specified response time</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">💳</span>
                <div className="info-content">
                  <h4>Transparent Pricing</h4>
                  <p>No hidden fees, pay only for services rendered</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🛡️</span>
                <div className="info-content">
                  <h4>Verified Professionals</h4>
                  <p>All providers are background-checked and certified</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📞</span>
                <div className="info-content">
                  <h4>24/7 Support</h4>
                  <p>Customer service available round the clock</p>
                </div>
              </div>
            </div>
          </div>

          <div className="emergency-hotline">
            <h3>Emergency Hotline</h3>
            <div className="hotline-number">
              <span className="phone-icon">📞</span>
              <span className="number">1-800-URGENT</span>
            </div>
            <p>For immediate assistance, call our 24/7 emergency hotline</p>
          </div>
        </div>
      </div>
    </div>
  )
}
