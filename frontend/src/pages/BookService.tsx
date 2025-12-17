import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/BookService.css'

interface Service {
  id: string
  title: string
  category: string
  price: number
  duration: number
  description: string
  providerCount: number
  rating: number
  popular: boolean
}

interface TimeSlot {
  time: string
  available: boolean
  provider?: string
}

interface Provider {
  id: string
  name: string
  rating: number
  specialty: string
  price: number
  available: boolean
  image: string
  responseTime: string
  completedJobs: number
}

export default function BookService() {
  const navigate = useNavigate()
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<string>('')
  const [specialRequests, setSpecialRequests] = useState<string>('')
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'emergency'>('normal')

  const services: Service[] = [
    {
      id: 'plumbing',
      title: 'Professional Plumbing',
      category: 'Plumbing',
      price: 1500,
      duration: 120,
      description: 'Expert plumbing services for repairs, installations, and maintenance',
      providerCount: 45,
      rating: 4.8,
      popular: true
    },
    {
      id: 'electrical',
      title: 'Electrical Services',
      category: 'Electrical',
      price: 1800,
      duration: 90,
      description: 'Certified electricians for all your electrical needs',
      providerCount: 32,
      rating: 4.7,
      popular: true
    },
    {
      id: 'cleaning',
      title: 'Deep Cleaning',
      category: 'Cleaning',
      price: 2000,
      duration: 180,
      description: 'Thorough cleaning services for homes and offices',
      providerCount: 67,
      rating: 4.9,
      popular: false
    },
    {
      id: 'ac',
      title: 'AC Repair & Service',
      category: 'AC Service',
      price: 1200,
      duration: 60,
      description: 'Fast and reliable AC repair and maintenance services',
      providerCount: 28,
      rating: 4.6,
      popular: false
    },
    {
      id: 'painting',
      title: 'Painting Services',
      category: 'Painting',
      price: 3500,
      duration: 240,
      description: 'Professional painting for interior and exterior spaces',
      providerCount: 19,
      rating: 4.8,
      popular: false
    },
    {
      id: 'pest',
      title: 'Pest Control',
      category: 'Pest Control',
      price: 1000,
      duration: 45,
      description: 'Effective pest control and prevention services',
      providerCount: 23,
      rating: 4.5,
      popular: false
    }
  ]

  const providers: Provider[] = [
    {
      id: 'p1',
      name: 'QuickFix Pro',
      rating: 4.9,
      specialty: 'Plumbing',
      price: 1500,
      available: true,
      image: '🔧',
      responseTime: '30 min',
      completedJobs: 342
    },
    {
      id: 'p2',
      name: 'Sparkle Clean',
      rating: 4.8,
      specialty: 'Cleaning',
      price: 2000,
      available: true,
      image: '🧹',
      responseTime: '1 hour',
      completedJobs: 256
    },
    {
      id: 'p3',
      name: 'ElectroSafe',
      rating: 5.0,
      specialty: 'Electrical',
      price: 1800,
      available: true,
      image: '⚡',
      responseTime: '45 min',
      completedJobs: 189
    }
  ]

  const timeSlots: TimeSlot[] = [
    { time: '09:00 AM', available: true, provider: 'John D.' },
    { time: '10:00 AM', available: true, provider: 'Sarah M.' },
    { time: '11:00 AM', available: false },
    { time: '12:00 PM', available: true, provider: 'Mike R.' },
    { time: '01:00 PM', available: true, provider: 'Lisa K.' },
    { time: '02:00 PM', available: true, provider: 'Tom B.' },
    { time: '03:00 PM', available: false },
    { time: '04:00 PM', available: true, provider: 'Amy S.' },
    { time: '05:00 PM', available: true, provider: 'David L.' },
    { time: '06:00 PM', available: true, provider: 'Chris P.' }
  ]

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
        },
        (error) => {
          setUserLocation('Location not available')
        }
      )
    }

    // Set default date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setSelectedDate(tomorrow.toISOString().split('T')[0])
  }, [])

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setCurrentStep(2)
  }

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider)
    setCurrentStep(3)
  }

  const handleDateTimeSelect = () => {
    if (selectedDate && selectedTime) {
      setCurrentStep(4)
    }
  }

  const handleBookingConfirm = () => {
    setLoading(true)
    // Simulate booking process
    setTimeout(() => {
      setLoading(false)
      navigate('/bookings?confirmed=true')
    }, 2000)
  }

  const filteredProviders = selectedService 
    ? providers.filter(p => p.specialty === selectedService.category)
    : providers

  return (
    <div className="book-service">
      <div className="booking-header">
        <div className="header-content">
          <h1>Book Professional Service</h1>
          <p>Get expert help at your convenience</p>
          <div className="location-display">
            <span className="location-icon">📍</span>
            <span>{userLocation || 'Detecting location...'}</span>
          </div>
        </div>
        <div className="progress-indicator">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''}`}>
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && 'Service'}
                {step === 2 && 'Provider'}
                {step === 3 && 'Schedule'}
                {step === 4 && 'Confirm'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="booking-content">
        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <div className="service-selection">
            <div className="section-header">
              <h2>Choose a Service</h2>
              <p>Select the service you need help with</p>
            </div>
            
            <div className="services-grid">
              {services.map((service) => (
                <div 
                  key={service.id}
                  className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                  onClick={() => handleServiceSelect(service)}
                >
                  {service.popular && (
                    <div className="popular-badge">
                      <span>🔥 Popular</span>
                    </div>
                  )}
                  
                  <div className="service-icon">
                    {service.category === 'Plumbing' && '🔧'}
                    {service.category === 'Electrical' && '⚡'}
                    {service.category === 'Cleaning' && '🧹'}
                    {service.category === 'AC Service' && '❄️'}
                    {service.category === 'Painting' && '🎨'}
                    {service.category === 'Pest Control' && '🦟'}
                  </div>
                  
                  <div className="service-info">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    
                    <div className="service-meta">
                      <div className="meta-item">
                        <span className="meta-icon">💰</span>
                        <span>₹{service.price}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">⏱️</span>
                        <span>{service.duration} min</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">⭐</span>
                        <span>{service.rating}</span>
                      </div>
                    </div>
                    
                    <div className="provider-count">
                      <span className="count-icon">👥</span>
                      <span>{service.providerCount} providers available</span>
                    </div>
                  </div>
                  
                  <div className="select-arrow">→</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Provider Selection */}
        {currentStep === 2 && (
          <div className="provider-selection">
            <div className="section-header">
              <button className="back-btn" onClick={() => setCurrentStep(1)}>
                ← Back
              </button>
              <h2>Choose a Provider</h2>
              <p>Select a professional for your {selectedService?.title}</p>
            </div>
            
            <div className="providers-grid">
              {filteredProviders.map((provider) => (
                <div 
                  key={provider.id}
                  className={`provider-card ${selectedProvider?.id === provider.id ? 'selected' : ''}`}
                  onClick={() => handleProviderSelect(provider)}
                >
                  <div className="provider-header">
                    <div className="provider-avatar">
                      <span>{provider.image}</span>
                    </div>
                    <div className="provider-info">
                      <h3>{provider.name}</h3>
                      <p className="provider-specialty">{provider.specialty}</p>
                      <div className="provider-rating">
                        <span className="stars">⭐</span>
                        <span>{provider.rating}</span>
                      </div>
                    </div>
                    <div className="provider-status">
                      <div className={`status-dot ${provider.available ? 'available' : 'busy'}`}></div>
                      <span>{provider.available ? 'Available' : 'Busy'}</span>
                    </div>
                  </div>
                  
                  <div className="provider-stats">
                    <div className="stat">
                      <span className="stat-icon">💰</span>
                      <span className="stat-value">₹{provider.price}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-icon">⏱️</span>
                      <span className="stat-value">{provider.responseTime}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-icon">📋</span>
                      <span className="stat-value">{provider.completedJobs} jobs</span>
                    </div>
                  </div>
                  
                  <div className="provider-actions">
                    <button className="view-profile-btn">View Profile</button>
                    <button className="select-provider-btn">Select</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Schedule Selection */}
        {currentStep === 3 && (
          <div className="schedule-selection">
            <div className="section-header">
              <button className="back-btn" onClick={() => setCurrentStep(2)}>
                ← Back
              </button>
              <h2>Schedule Your Service</h2>
              <p>Choose a date and time that works for you</p>
            </div>
            
            <div className="schedule-container">
              <div className="date-selection">
                <label>Select Date</label>
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="urgency-selection">
                <label>Urgency Level</label>
                <div className="urgency-options">
                  {[
                    { value: 'normal', label: 'Normal', icon: '🕐' },
                    { value: 'urgent', label: 'Urgent', icon: '⚡' },
                    { value: 'emergency', label: 'Emergency', icon: '🚨' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`urgency-btn ${urgency === option.value ? 'active' : ''}`}
                      onClick={() => setUrgency(option.value as any)}
                    >
                      <span className="urgency-icon">{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="time-selection">
                <label>Available Time Slots</label>
                <div className="time-slots-grid">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      className={`time-slot ${!slot.available ? 'disabled' : ''} ${selectedTime === slot.time ? 'selected' : ''}`}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                    >
                      <div className="slot-time">{slot.time}</div>
                      {slot.provider && (
                        <div className="slot-provider">with {slot.provider}</div>
                      )}
                      {!slot.available && (
                        <div className="slot-unavailable">Unavailable</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="special-requests">
                <label>Special Requests (Optional)</label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any specific requirements or notes for the provider..."
                  rows={4}
                />
              </div>
              
              <button 
                className="continue-btn"
                onClick={handleDateTimeSelect}
                disabled={!selectedDate || !selectedTime}
              >
                Continue to Confirmation
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div className="booking-confirmation">
            <div className="section-header">
              <button className="back-btn" onClick={() => setCurrentStep(3)}>
                ← Back
              </button>
              <h2>Confirm Your Booking</h2>
              <p>Please review your booking details</p>
            </div>
            
            <div className="confirmation-summary">
              <div className="summary-card">
                <h3>Service Details</h3>
                <div className="summary-item">
                  <span className="label">Service:</span>
                  <span className="value">{selectedService?.title}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Provider:</span>
                  <span className="value">{selectedProvider?.name}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(selectedDate).toLocaleDateString()}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Time:</span>
                  <span className="value">{selectedTime}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Duration:</span>
                  <span className="value">{selectedService?.duration} minutes</span>
                </div>
                <div className="summary-item">
                  <span className="label">Urgency:</span>
                  <span className="value">{urgency.charAt(0).toUpperCase() + urgency.slice(1)}</span>
                </div>
                {specialRequests && (
                  <div className="summary-item">
                    <span className="label">Special Requests:</span>
                    <span className="value">{specialRequests}</span>
                  </div>
                )}
              </div>
              
              <div className="pricing-card">
                <h3>Pricing</h3>
                <div className="price-item">
                  <span className="label">Service Cost:</span>
                  <span className="value">₹{selectedService?.price}</span>
                </div>
                <div className="price-item">
                  <span className="label">Urgency Fee:</span>
                  <span className="value">
                    {urgency === 'emergency' ? '₹500' : urgency === 'urgent' ? '₹200' : '₹0'}
                  </span>
                </div>
                <div className="price-item total">
                  <span className="label">Total:</span>
                  <span className="value">
                    ₹{selectedService?.price + (urgency === 'emergency' ? 500 : urgency === 'urgent' ? 200 : 0)}
                  </span>
                </div>
              </div>
              
              <div className="payment-method">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input type="radio" name="payment" value="cash" defaultChecked />
                    <span className="payment-icon">💵</span>
                    <span>Cash on Service</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" value="online" />
                    <span className="payment-icon">💳</span>
                    <span>Pay Online</span>
                  </label>
                </div>
              </div>
              
              <button 
                className="confirm-booking-btn"
                onClick={handleBookingConfirm}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
