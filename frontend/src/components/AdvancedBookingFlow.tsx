import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './AdvancedBookingFlow.css'

interface Service {
  id: string
  title: string
  category: string
  price: number
  duration: string
  description: string
  features: string[]
  professionals: number
  rating: number
  reviews: number
  availability: boolean
  urgency?: 'low' | 'medium' | 'high' | 'urgent'
}

interface TimeSlot {
  id: string
  time: string
  available: boolean
  price?: number
}

interface Professional {
  id: string
  name: string
  avatar: string
  rating: number
  reviews: number
  experience: string
  specialties: string[]
  responseTime: string
  hourlyRate: number
  verified: boolean
  available: boolean
}

interface BookingData {
  service: Service | null
  professional: Professional | null
  date: string
  timeSlot: TimeSlot | null
  personalInfo: {
    name: string
    email: string
    phone: string
    address: string
    landmark?: string
    city: string
    state: string
    pincode: string
  }
  urgency: 'low' | 'medium' | 'high' | 'urgent'
  description: string
  photos: string[]
  paymentMethod: 'card' | 'upi' | 'cash' | 'wallet'
  promoCode: string
  termsAccepted: boolean
  notifications: {
    sms: boolean
    email: boolean
    whatsapp: boolean
  }
}

export default function AdvancedBookingFlow() {
  const navigate = useNavigate()
  const location = useLocation()
  const emergencyService = location.state?.service

  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    service: null,
    professional: null,
    date: '',
    timeSlot: null,
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      pincode: ''
    },
    urgency: 'medium',
    description: '',
    photos: [],
    paymentMethod: 'card',
    promoCode: '',
    termsAccepted: false,
    notifications: {
      sms: true,
      email: true,
      whatsapp: true
    }
  })

  const [services] = useState<Service[]>([
    {
      id: 'plumbing',
      title: 'Plumbing Services',
      category: 'Plumbing',
      price: 800,
      duration: '2-4 hours',
      description: 'Professional plumbing solutions for all your needs',
      features: ['24/7 Emergency', 'Expert Technicians', 'Warranty Included', 'Same Day Service'],
      professionals: 12,
      rating: 4.8,
      reviews: 342,
      availability: true
    },
    {
      id: 'electrical',
      title: 'Electrical Services',
      category: 'Electrical',
      price: 1200,
      duration: '1-3 hours',
      description: 'Complete electrical solutions and repairs',
      features: ['Licensed Electricians', 'Safety Certified', 'Emergency Service', 'Free Inspection'],
      professionals: 8,
      rating: 4.9,
      reviews: 256,
      availability: true
    },
    {
      id: 'ac',
      title: 'AC Services',
      category: 'AC & Cooling',
      price: 1500,
      duration: '2-3 hours',
      description: 'AC installation, repair and maintenance',
      features: ['Expert Technicians', 'Genuine Parts', 'Annual Maintenance', '24/7 Support'],
      professionals: 15,
      rating: 4.7,
      reviews: 189,
      availability: true
    }
  ])

  const [professionals] = useState<Professional[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      avatar: '👨‍🔧',
      rating: 4.9,
      reviews: 127,
      experience: '8 years',
      specialties: ['Plumbing', 'Pipe Repair', 'Installation'],
      responseTime: '30 mins',
      hourlyRate: 800,
      verified: true,
      available: true
    },
    {
      id: '2',
      name: 'Amit Sharma',
      avatar: '👨‍🔧',
      rating: 4.8,
      reviews: 98,
      experience: '6 years',
      specialties: ['Electrical', 'Wiring', 'Appliances'],
      responseTime: '45 mins',
      hourlyRate: 1200,
      verified: true,
      available: true
    },
    {
      id: '3',
      name: 'Vikram Singh',
      avatar: '👨‍🔧',
      rating: 4.7,
      reviews: 156,
      experience: '10 years',
      specialties: ['AC Repair', 'Installation', 'Maintenance'],
      responseTime: '60 mins',
      hourlyRate: 1500,
      verified: true,
      available: true
    }
  ])

  const [timeSlots] = useState<TimeSlot[]>([
    { id: '1', time: '9:00 AM', available: true },
    { id: '2', time: '10:00 AM', available: true },
    { id: '3', time: '11:00 AM', available: false },
    { id: '4', time: '12:00 PM', available: true },
    { id: '5', time: '2:00 PM', available: true },
    { id: '6', time: '3:00 PM', available: true },
    { id: '7', time: '4:00 PM', available: false },
    { id: '8', time: '5:00 PM', available: true },
    { id: '9', time: '6:00 PM', available: true, price: 200 }
  ])

  const [loading, setLoading] = useState(false)
  const [promoApplied, setPromoApplied] = useState(false)
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    if (emergencyService) {
      setBookingData(prev => ({
        ...prev,
        service: emergencyService,
        urgency: 'urgent'
      }))
    }
  }, [emergencyService])

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const applyPromoCode = () => {
    if (bookingData.promoCode === 'FIRST10') {
      setDiscount(10)
      setPromoApplied(true)
    } else if (bookingData.promoCode === 'SAVE20') {
      setDiscount(20)
      setPromoApplied(true)
    } else {
      alert('Invalid promo code')
    }
  }

  const calculateTotal = () => {
    let total = bookingData.service?.price || 0
    if (bookingData.timeSlot?.price) {
      total += bookingData.timeSlot.price
    }
    if (discount > 0) {
      total = total * (1 - discount / 100)
    }
    return total
  }

  const submitBooking = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      navigate('/booking-confirmation', { state: { bookingData } })
    }, 2000)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ServiceSelection services={services} bookingData={bookingData} updateBookingData={updateBookingData} />
      case 2:
        return <PersonalInfo bookingData={bookingData} updateBookingData={updateBookingData} />
      case 3:
        return <Scheduling 
          professionals={professionals} 
          timeSlots={timeSlots} 
          bookingData={bookingData} 
          updateBookingData={updateBookingData} 
        />
      case 4:
        return <Review 
          bookingData={bookingData} 
          calculateTotal={calculateTotal}
          applyPromoCode={applyPromoCode}
          promoApplied={promoApplied}
          discount={discount}
          updateBookingData={updateBookingData}
        />
      default:
        return null
    }
  }

  return (
    <div className="advanced-booking-flow">
      <div className="booking-container">
        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-header">
            <h1>Book Your Service</h1>
            <p>Complete your booking in 4 simple steps</p>
          </div>
          <div className="progress-bar">
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
            <div className="progress-steps">
              {[
                { step: 1, label: 'Service', icon: '🛠️' },
                { step: 2, label: 'Personal Info', icon: '👤' },
                { step: 3, label: 'Schedule', icon: '📅' },
                { step: 4, label: 'Review', icon: '✅' }
              ].map(({ step, label, icon }) => (
                <div 
                  key={step}
                  className={`step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
                >
                  <div className="step-number">
                    <span className="step-icon">{icon}</span>
                    <span className="step-text">{step}</span>
                  </div>
                  <div className="step-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="step-content">
          <div className="step-header">
            <h2>
              {currentStep === 1 && 'Select Your Service'}
              {currentStep === 2 && 'Personal Information'}
              {currentStep === 3 && 'Schedule Your Service'}
              {currentStep === 4 && 'Review & Confirm'}
            </h2>
          </div>
          
          <div className="step-body">
            {renderStep()}
          </div>

          {/* Step Actions */}
          <div className="step-actions">
            {currentStep > 1 && (
              <button className="btn-secondary" onClick={prevStep}>
                ← Back
              </button>
            )}
            {currentStep < 4 ? (
              <button 
                className="btn-primary" 
                onClick={nextStep}
                disabled={!bookingData.service || (currentStep === 2 && !bookingData.personalInfo.name)}
              >
                Continue →
              </button>
            ) : (
              <button 
                className="btn-primary btn-submit" 
                onClick={submitBooking}
                disabled={!bookingData.termsAccepted || loading}
              >
                {loading ? 'Processing...' : `Confirm Booking • ₹${calculateTotal()}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Service Selection Component
function ServiceSelection({ services, bookingData, updateBookingData }: any) {
  return (
    <div className="service-selection-advanced">
      <div className="services-showcase">
        {/* Featured Service */}
        <div className="featured-section">
          <div className="featured-header">
            <h2>Most Popular Services</h2>
            <p>Trusted by thousands of customers</p>
          </div>
          
          <div className="featured-services">
            {services.map((service: Service, index: number) => (
              <div 
                key={service.id}
                className={`featured-service-card ${bookingData.service?.id === service.id ? 'selected' : ''}`}
                style={{ '--delay': `${index * 0.1}s` } as any}
                onClick={() => updateBookingData({ service })}
              >
                <div className="service-visual">
                  <div className="service-icon">
                    {service.category === 'Plumbing' && '🔧'}
                    {service.category === 'Electrical' && '⚡'}
                    {service.category === 'AC & Cooling' && '❄️'}
                  </div>
                  <div className="service-badge">
                    <span className="badge-text">Popular</span>
                  </div>
                </div>
                
                <div className="service-content">
                  <div className="service-header-info">
                    <h3>{service.title}</h3>
                    <div className="service-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star ${i < Math.floor(service.rating) ? 'filled' : ''}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="rating-text">{service.rating} ({service.reviews})</span>
                    </div>
                  </div>
                  
                  <p className="service-description">{service.description}</p>
                  
                  <div className="service-metrics-advanced">
                    <div className="metric-item">
                      <div className="metric-icon-wrapper">
                        <span className="metric-icon">💰</span>
                      </div>
                      <div className="metric-info">
                        <span className="metric-value">₹{service.price}</span>
                        <span className="metric-label">Starting Price</span>
                      </div>
                    </div>
                    
                    <div className="metric-item">
                      <div className="metric-icon-wrapper">
                        <span className="metric-icon">⏱️</span>
                      </div>
                      <div className="metric-info">
                        <span className="metric-value">{service.duration}</span>
                        <span className="metric-label">Service Time</span>
                      </div>
                    </div>
                    
                    <div className="metric-item">
                      <div className="metric-icon-wrapper">
                        <span className="metric-icon">👥</span>
                      </div>
                      <div className="metric-info">
                        <span className="metric-value">{service.professionals}</span>
                        <span className="metric-label">Experts Available</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="service-features-advanced">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="feature-tag">
                        <span className="feature-icon">✓</span>
                        <span className="feature-text">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="service-footer-advanced">
                    <div className="availability-status">
                      <div className={`status-indicator ${service.availability ? 'available' : 'unavailable'}`}>
                        <span className="status-dot"></span>
                        <span className="status-text">
                          {service.availability ? 'Available Now' : 'Currently Busy'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="selection-indicator">
                      <div className="check-circle">
                        <span className="check-mark">✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alternative Services Grid */}
        <div className="alternative-services">
          <h3>All Services</h3>
          <div className="services-grid-advanced">
            {services.map((service: Service) => (
              <div 
                key={service.id}
                className={`service-card-compact ${bookingData.service?.id === service.id ? 'selected' : ''}`}
                onClick={() => updateBookingData({ service })}
              >
                <div className="compact-header">
                  <div className="compact-icon">
                    {service.category === 'Plumbing' && '🔧'}
                    {service.category === 'Electrical' && '⚡'}
                    {service.category === 'AC & Cooling' && '❄️'}
                  </div>
                  <div className="compact-info">
                    <h4>{service.title}</h4>
                    <div className="compact-rating">
                      ⭐ {service.rating} • {service.reviews} reviews
                    </div>
                  </div>
                  <div className="compact-price">
                    ₹{service.price}
                  </div>
                </div>
                
                <div className="compact-details">
                  <p>{service.description}</p>
                  <div className="compact-features">
                    {service.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="compact-feature">{feature}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Personal Info Component
function PersonalInfo({ bookingData, updateBookingData }: any) {
  return (
    <div className="personal-info-section">
      <div className="info-grid">
        <div className="info-column">
          <h3>Contact Information</h3>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={bookingData.personalInfo.name}
              onChange={(e) => updateBookingData({
                personalInfo: { ...bookingData.personalInfo, name: e.target.value }
              })}
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              value={bookingData.personalInfo.email}
              onChange={(e) => updateBookingData({
                personalInfo: { ...bookingData.personalInfo, email: e.target.value }
              })}
              placeholder="your@email.com"
            />
          </div>
          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              value={bookingData.personalInfo.phone}
              onChange={(e) => updateBookingData({
                personalInfo: { ...bookingData.personalInfo, phone: e.target.value }
              })}
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        <div className="info-column">
          <h3>Service Address</h3>
          <div className="form-group">
            <label>Street Address *</label>
            <input
              type="text"
              value={bookingData.personalInfo.address}
              onChange={(e) => updateBookingData({
                personalInfo: { ...bookingData.personalInfo, address: e.target.value }
              })}
              placeholder="123, Main Street"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                value={bookingData.personalInfo.city}
                onChange={(e) => updateBookingData({
                  personalInfo: { ...bookingData.personalInfo, city: e.target.value }
                })}
                placeholder="Mumbai"
              />
            </div>
            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                value={bookingData.personalInfo.state}
                onChange={(e) => updateBookingData({
                  personalInfo: { ...bookingData.personalInfo, state: e.target.value }
                })}
                placeholder="Maharashtra"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Pincode *</label>
              <input
                type="text"
                value={bookingData.personalInfo.pincode}
                onChange={(e) => updateBookingData({
                  personalInfo: { ...bookingData.personalInfo, pincode: e.target.value }
                })}
                placeholder="400001"
              />
            </div>
            <div className="form-group">
              <label>Landmark</label>
              <input
                type="text"
                value={bookingData.personalInfo.landmark}
                onChange={(e) => updateBookingData({
                  personalInfo: { ...bookingData.personalInfo, landmark: e.target.value }
                })}
                placeholder="Near Railway Station"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="urgency-section">
        <h3>Service Urgency</h3>
        <div className="urgency-options">
          {[
            { value: 'low', label: 'Regular (3-5 days)', color: 'green' },
            { value: 'medium', label: 'Standard (1-2 days)', color: 'blue' },
            { value: 'high', label: 'Express (Same day)', color: 'orange' },
            { value: 'urgent', label: 'Emergency (2-4 hours)', color: 'red' }
          ].map(option => (
            <label key={option.value} className="urgency-option">
              <input
                type="radio"
                name="urgency"
                value={option.value}
                checked={bookingData.urgency === option.value}
                onChange={(e) => updateBookingData({ urgency: e.target.value as any })}
              />
              <span className={`urgency-label ${option.color}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="description-section">
        <h3>Service Description</h3>
        <textarea
          value={bookingData.description}
          onChange={(e) => updateBookingData({ description: e.target.value })}
          placeholder="Please describe the issue you're facing in detail..."
          rows={4}
        />
      </div>
    </div>
  )
}

// Scheduling Component
function Scheduling({ professionals, timeSlots, bookingData, updateBookingData }: any) {
  const [selectedDate, setSelectedDate] = useState('')
  
  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        isToday: i === 0,
        isTomorrow: i === 1
      })
    }
    return dates
  }

  return (
    <div className="scheduling-section">
      <div className="scheduling-grid">
        <div className="professionals-section">
          <h3>Choose Professional</h3>
          <div className="professionals-list">
            {professionals.map((professional: Professional) => (
              <div 
                key={professional.id}
                className={`professional-card ${bookingData.professional?.id === professional.id ? 'selected' : ''}`}
                onClick={() => updateBookingData({ professional })}
              >
                <div className="professional-header">
                  <div className="professional-avatar">
                    <span>{professional.avatar}</span>
                    {professional.verified && <span className="verified-badge">✓</span>}
                  </div>
                  <div className="professional-info">
                    <h4>{professional.name}</h4>
                    <div className="professional-meta">
                      <span className="rating">⭐ {professional.rating}</span>
                      <span className="reviews">({professional.reviews} reviews)</span>
                    </div>
                    <div className="professional-details">
                      <span className="experience">🎓 {professional.experience}</span>
                      <span className="response-time">⏱️ {professional.responseTime}</span>
                    </div>
                  </div>
                  <div className="professional-price">
                    <span className="rate">₹{professional.hourlyRate}/hr</span>
                    <span className={`availability ${professional.available ? 'available' : 'unavailable'}`}>
                      {professional.available ? 'Available' : 'Busy'}
                    </span>
                  </div>
                </div>
                
                <div className="professional-specialties">
                  {professional.specialties.map((specialty, index) => (
                    <span key={index} className="specialty-tag">{specialty}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="datetime-section">
          <div className="date-selection">
            <h3>Select Date</h3>
            <div className="date-options">
              {generateDates().map((date) => (
                <label key={date.value} className="date-option">
                  <input
                    type="radio"
                    name="date"
                    value={date.value}
                    checked={selectedDate === date.value}
                    onChange={(e) => {
                      setSelectedDate(e.target.value)
                      updateBookingData({ date: e.target.value })
                    }}
                  />
                  <span className={`date-label ${date.isToday ? 'today' : ''} ${date.isTomorrow ? 'tomorrow' : ''}`}>
                    {date.isToday && 'Today, '}
                    {date.isTomorrow && 'Tomorrow, '}
                    {date.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="time-selection">
            <h3>Select Time Slot</h3>
            <div className="time-grid">
              {timeSlots.map((slot: TimeSlot) => (
                <label key={slot.id} className="time-slot">
                  <input
                    type="radio"
                    name="time"
                    value={slot.id}
                    checked={bookingData.timeSlot?.id === slot.id}
                    onChange={() => updateBookingData({ timeSlot: slot })}
                    disabled={!slot.available}
                  />
                  <span className={`time-label ${!slot.available ? 'disabled' : ''} ${slot.price ? 'premium' : ''}`}>
                    {slot.time}
                    {slot.price && <span className="extra-charge">+₹{slot.price}</span>}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Review Component
function Review({ bookingData, calculateTotal, applyPromoCode, promoApplied, discount, updateBookingData }: any) {
  return (
    <div className="review-section">
      <div className="review-grid">
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          
          <div className="summary-item">
            <div className="summary-label">Service</div>
            <div className="summary-value">
              <strong>{bookingData.service?.title}</strong>
              <span>{bookingData.service?.description}</span>
            </div>
          </div>

          {bookingData.professional && (
            <div className="summary-item">
              <div className="summary-label">Professional</div>
              <div className="summary-value">
                <strong>{bookingData.professional.name}</strong>
                <span>⭐ {bookingData.professional.rating} • {bookingData.professional.experience}</span>
              </div>
            </div>
          )}

          <div className="summary-item">
            <div className="summary-label">Date & Time</div>
            <div className="summary-value">
              <strong>{new Date(bookingData.date).toLocaleDateString()}</strong>
              <span>{bookingData.timeSlot?.time}</span>
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-label">Address</div>
            <div className="summary-value">
              <strong>{bookingData.personalInfo.address}</strong>
              <span>{bookingData.personalInfo.city}, {bookingData.personalInfo.state} {bookingData.personalInfo.pincode}</span>
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-label">Contact</div>
            <div className="summary-value">
              <strong>{bookingData.personalInfo.name}</strong>
              <span>{bookingData.personalInfo.phone} • {bookingData.personalInfo.email}</span>
            </div>
          </div>

          {bookingData.description && (
            <div className="summary-item">
              <div className="summary-label">Issue Description</div>
              <div className="summary-value">
                <p>{bookingData.description}</p>
              </div>
            </div>
          )}
        </div>

        <div className="payment-section">
          <h3>Payment Details</h3>
          
          <div className="price-breakdown">
            <div className="price-item">
              <span>Service Cost</span>
              <span>₹{bookingData.service?.price || 0}</span>
            </div>
            {bookingData.timeSlot?.price && (
              <div className="price-item">
                <span>Prime Time Slot</span>
                <span>+₹{bookingData.timeSlot.price}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="price-item discount">
                <span>Promo Discount ({discount}%)</span>
                <span>-₹{Math.round((bookingData.service?.price || 0) * discount / 100)}</span>
              </div>
            )}
            <div className="price-item total">
              <span>Total Amount</span>
              <span>₹{calculateTotal()}</span>
            </div>
          </div>

          <div className="promo-section">
            <div className="promo-input-group">
              <input
                type="text"
                value={bookingData.promoCode}
                onChange={(e) => updateBookingData({ promoCode: e.target.value })}
                placeholder="Enter promo code"
                disabled={promoApplied}
              />
              <button 
                className="btn-apply-promo"
                onClick={applyPromoCode}
                disabled={promoApplied || !bookingData.promoCode}
              >
                {promoApplied ? 'Applied ✓' : 'Apply'}
              </button>
            </div>
            {promoApplied && (
              <div className="promo-success">
                Promo code applied successfully! You saved {discount}%
              </div>
            )}
          </div>

          <div className="payment-methods">
            <h4>Payment Method</h4>
            <div className="payment-options">
              {[
                { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
                { value: 'upi', label: 'UPI Payment', icon: '📱' },
                { value: 'wallet', label: 'Wallet', icon: '💰' },
                { value: 'cash', label: 'Cash on Service', icon: '💵' }
              ].map(method => (
                <label key={method.value} className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value={method.value}
                    checked={bookingData.paymentMethod === method.value}
                    onChange={(e) => updateBookingData({ paymentMethod: e.target.value as any })}
                  />
                  <span className="payment-label">
                    <span className="payment-icon">{method.icon}</span>
                    {method.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="notifications-section">
            <h4>Notifications</h4>
            <div className="notification-options">
              <label className="notification-option">
                <input
                  type="checkbox"
                  checked={bookingData.notifications.sms}
                  onChange={(e) => updateBookingData({
                    notifications: { ...bookingData.notifications, sms: e.target.checked }
                  })}
                />
                <span>SMS Updates</span>
              </label>
              <label className="notification-option">
                <input
                  type="checkbox"
                  checked={bookingData.notifications.email}
                  onChange={(e) => updateBookingData({
                    notifications: { ...bookingData.notifications, email: e.target.checked }
                  })}
                />
                <span>Email Notifications</span>
              </label>
              <label className="notification-option">
                <input
                  type="checkbox"
                  checked={bookingData.notifications.whatsapp}
                  onChange={(e) => updateBookingData({
                    notifications: { ...bookingData.notifications, whatsapp: e.target.checked }
                  })}
                />
                <span>WhatsApp Updates</span>
              </label>
            </div>
          </div>

          <div className="terms-section">
            <label className="terms-checkbox">
              <input
                type="checkbox"
                checked={bookingData.termsAccepted}
                onChange={(e) => updateBookingData({ termsAccepted: e.target.checked })}
              />
              <span>
                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
