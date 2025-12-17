import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import '../styles/TrackBooking.css'

interface TrackingStep {
  id: string
  title: string
  description: string
  completed: boolean
  timestamp?: Date
  duration?: number
}

interface BookingDetails {
  id: string
  service: string
  provider: string
  customerName: string
  date: string
  time: string
  status: 'confirmed' | 'provider_assigned' | 'on_the_way' | 'in_progress' | 'completed' | 'cancelled'
  estimatedArrival?: string
  providerLocation?: { lat: number; lng: number }
  customerLocation?: { lat: number; lng: number }
  price: number
  specialRequests?: string
}

export default function TrackBooking() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('id')
  
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [realTimeUpdate, setRealTimeUpdate] = useState<number>(0)
  const [selectedBookingId, setSelectedBookingId] = useState<string>(bookingId || '')
  const [searchInput, setSearchInput] = useState<string>(bookingId || '')

  // Mock booking data
  const mockBookings: BookingDetails[] = [
    {
      id: 'BK001',
      service: 'Professional Plumbing',
      provider: 'QuickFix Pro',
      customerName: 'Rahul Sharma',
      date: '2024-11-23',
      time: '02:00 PM',
      status: 'on_the_way',
      estimatedArrival: '2:30 PM',
      providerLocation: { lat: 28.6139, lng: 77.2090 },
      customerLocation: { lat: 28.7041, lng: 77.1025 },
      price: 1500,
      specialRequests: 'Kitchen sink leak repair'
    },
    {
      id: 'BK002',
      service: 'Electrical Services',
      provider: 'ElectroSafe',
      customerName: 'Priya Patel',
      date: '2024-11-23',
      time: '10:00 AM',
      status: 'in_progress',
      price: 1800
    },
    {
      id: 'BK003',
      service: 'Deep Cleaning',
      provider: 'Sparkle Clean',
      customerName: 'Amit Kumar',
      date: '2024-11-22',
      time: '03:00 PM',
      status: 'completed',
      price: 2000
    }
  ]

  useEffect(() => {
    if (bookingId) {
      loadBooking(bookingId)
    } else {
      setLoading(false)
    }
  }, [bookingId])

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (booking && (booking.status === 'on_the_way' || booking.status === 'in_progress')) {
        setRealTimeUpdate(prev => prev + 1)
        updateTrackingSteps()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [booking])

  const loadBooking = (id: string) => {
    setLoading(true)
    setError(null)
    
    // Simulate API call
    setTimeout(() => {
      const foundBooking = mockBookings.find(b => b.id === id)
      if (foundBooking) {
        setBooking(foundBooking)
        updateTrackingSteps(foundBooking)
      } else {
        setError('Booking not found. Please check your booking ID.')
      }
      setLoading(false)
    }, 1000)
  }

  const updateTrackingSteps = (bookingData?: BookingDetails) => {
    const currentBooking = bookingData || booking
    if (!currentBooking) return

    const steps: TrackingStep[] = [
      {
        id: 'confirmed',
        title: 'Booking Confirmed',
        description: 'Your booking has been confirmed and payment processed',
        completed: true,
        timestamp: new Date(currentBooking.date + ' ' + currentBooking.time),
        duration: 2
      },
      {
        id: 'provider_assigned',
        title: 'Provider Assigned',
        description: `${currentBooking.provider} has been assigned to your booking`,
        completed: ['provider_assigned', 'on_the_way', 'in_progress', 'completed'].includes(currentBooking.status),
        timestamp: new Date(new Date(currentBooking.date + ' ' + currentBooking.time).getTime() + 5 * 60000),
        duration: 3
      },
      {
        id: 'on_the_way',
        title: 'Provider On The Way',
        description: `${currentBooking.provider} is on the way to your location`,
        completed: ['on_the_way', 'in_progress', 'completed'].includes(currentBooking.status),
        timestamp: new Date(new Date(currentBooking.date + ' ' + currentBooking.time).getTime() + 15 * 60000),
        duration: 15
      },
      {
        id: 'in_progress',
        title: 'Service In Progress',
        description: 'Provider has arrived and started working on your service',
        completed: ['in_progress', 'completed'].includes(currentBooking.status),
        timestamp: new Date(new Date(currentBooking.date + ' ' + currentBooking.time).getTime() + 30 * 60000),
        duration: 60
      },
      {
        id: 'completed',
        title: 'Service Completed',
        description: 'Service has been completed successfully',
        completed: currentBooking.status === 'completed',
        timestamp: new Date(new Date(currentBooking.date + ' ' + currentBooking.time).getTime() + 90 * 60000),
        duration: 5
      }
    ]

    setTrackingSteps(steps)
  }

  const handleSearch = () => {
    if (searchInput.trim()) {
      setSelectedBookingId(searchInput.trim())
      loadBooking(searchInput.trim())
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#3b82f6'
      case 'provider_assigned': return '#8b5cf6'
      case 'on_the_way': return '#f59e0b'
      case 'in_progress': return '#10b981'
      case 'completed': return '#059669'
      case 'cancelled': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return '✅'
      case 'provider_assigned': return '👨‍🔧'
      case 'on_the_way': return '🚗'
      case 'in_progress': return '🔧'
      case 'completed': return '🎉'
      case 'cancelled': return '❌'
      default: return '⏳'
    }
  }

  if (loading) {
    return (
      <div className="track-booking">
        <div className="loading-state">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <h2>Loading Booking Details...</h2>
            <p>Please wait while we fetch your tracking information</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="track-booking">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Booking Not Found</h2>
          <p>{error}</p>
          <div className="search-section">
            <h3>Search Your Booking</h3>
            <div className="search-input-group">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter your booking ID (e.g., BK001)"
                className="search-input"
              />
              <button onClick={handleSearch} className="search-btn">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="track-booking">
        <div className="search-section">
          <div className="search-header">
            <h1>Track Your Booking</h1>
            <p>Enter your booking ID to track your service in real-time</p>
          </div>
          
          <div className="search-input-group">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter your booking ID (e.g., BK001)"
              className="search-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="search-btn">
              Search
            </button>
          </div>
          
          <div className="sample-bookings">
            <h3>Sample Booking IDs for Testing:</h3>
            <div className="sample-list">
              {mockBookings.map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSearchInput(b.id)
                    loadBooking(b.id)
                  }}
                  className="sample-btn"
                >
                  {b.id} - {b.service}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="track-booking">
      <div className="tracking-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/bookings')}>
            ← Back to Bookings
          </button>
          <h1>Track Your Booking</h1>
          <div className="booking-id-display">
            <span className="id-label">Booking ID:</span>
            <span className="id-value">{booking.id}</span>
          </div>
        </div>
        
        <div className="status-badge" style={{ backgroundColor: getStatusColor(booking.status) }}>
          <span className="status-icon">{getStatusIcon(booking.status)}</span>
          <span className="status-text">
            {booking.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="tracking-content">
        {/* Booking Overview */}
        <div className="booking-overview">
          <div className="overview-card">
            <h2>Service Details</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Service:</span>
                <span className="value">{booking.service}</span>
              </div>
              <div className="detail-item">
                <span className="label">Provider:</span>
                <span className="value">{booking.provider}</span>
              </div>
              <div className="detail-item">
                <span className="label">Date:</span>
                <span className="value">{new Date(booking.date).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <span className="label">Time:</span>
                <span className="value">{booking.time}</span>
              </div>
              <div className="detail-item">
                <span className="label">Price:</span>
                <span className="value">₹{booking.price}</span>
              </div>
              {booking.specialRequests && (
                <div className="detail-item full-width">
                  <span className="label">Special Requests:</span>
                  <span className="value">{booking.specialRequests}</span>
                </div>
              )}
            </div>
          </div>

          {booking.status === 'on_the_way' && booking.estimatedArrival && (
            <div className="arrival-card">
              <div className="arrival-header">
                <span className="arrival-icon">🚗</span>
                <div className="arrival-info">
                  <h3>Provider On The Way</h3>
                  <p>Estimated arrival: {booking.estimatedArrival}</p>
                </div>
              </div>
              <div className="arrival-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '65%' }}></div>
                </div>
                <span className="progress-text">65% of the way</span>
              </div>
            </div>
          )}
        </div>

        {/* Tracking Timeline */}
        <div className="tracking-timeline">
          <h2>Service Progress</h2>
          <div className="timeline">
            {trackingSteps.map((step, index) => (
              <div key={step.id} className={`timeline-step ${step.completed ? 'completed' : 'pending'}`}>
                <div className="timeline-marker">
                  <div className="marker-dot">
                    {step.completed && <span className="checkmark">✓</span>}
                  </div>
                  {index < trackingSteps.length - 1 && <div className="timeline-line"></div>}
                </div>
                
                <div className="timeline-content">
                  <div className="step-header">
                    <h3>{step.title}</h3>
                    {step.timestamp && (
                      <span className="step-time">
                        {step.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p>{step.description}</p>
                  {step.duration && step.completed && (
                    <div className="step-duration">
                      <span className="duration-icon">⏱️</span>
                      <span>Duration: {step.duration} minutes</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Map (Placeholder) */}
        {booking.status === 'on_the_way' && (
          <div className="live-tracking">
            <h2>Live Tracking</h2>
            <div className="map-placeholder">
              <div className="map-content">
                <span className="map-icon">🗺️</span>
                <h3>Live Map View</h3>
                <p>Real-time tracking of your provider's location</p>
                <div className="map-legend">
                  <div className="legend-item">
                    <span className="legend-dot provider"></span>
                    <span>Provider Location</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot customer"></span>
                    <span>Your Location</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="booking-actions">
          <div className="actions-header">
            <h2>Actions</h2>
          </div>
          <div className="actions-grid">
            <button className="action-btn primary">
              <span className="btn-icon">📞</span>
              <span>Contact Provider</span>
            </button>
            <button className="action-btn secondary">
              <span className="btn-icon">💬</span>
              <span>Live Chat</span>
            </button>
            <button className="action-btn secondary">
              <span className="btn-icon">📍</span>
              <span>Share Location</span>
            </button>
            <button className="action-btn secondary">
              <span className="btn-icon">📝</span>
              <span>Add Notes</span>
            </button>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="emergency-contact">
          <div className="contact-header">
            <span className="emergency-icon">🚨</span>
            <div className="contact-info">
              <h3>Need Help?</h3>
              <p>Contact our support team for immediate assistance</p>
            </div>
          </div>
          <div className="contact-actions">
            <button className="contact-btn">
              <span className="btn-icon">📞</span>
              <span>Call Support</span>
            </button>
            <button className="contact-btn">
              <span className="btn-icon">💬</span>
              <span>Chat Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
