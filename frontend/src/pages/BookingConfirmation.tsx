import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './BookingConfirmation.css'

interface BookingData {
  service: any
  professional: any
  date: string
  timeSlot: any
  personalInfo: any
  urgency: string
  description: string
  paymentMethod: string
  totalAmount: number
}

export default function BookingConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const bookingData: BookingData = location.state?.bookingData
  const [countdown, setCountdown] = useState(10)
  const [bookingId, setBookingId] = useState('')

  useEffect(() => {
    if (!bookingData) {
      navigate('/booking')
      return
    }

    // Generate booking ID
    const id = `BK${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    setBookingId(id)

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [bookingData, navigate])

  const handleTrackBooking = () => {
    navigate(`/track/${bookingId}`)
  }

  const handleViewBookings = () => {
    navigate('/my-bookings')
  }

  const handleBookAnother = () => {
    navigate('/booking')
  }

  const handleShareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Service Booking Confirmed',
        text: `Your booking ${bookingId} has been confirmed!`,
        url: window.location.href
      })
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Booking link copied to clipboard!')
    }
  }

  if (!bookingData) {
    return <div>Loading...</div>
  }

  return (
    <div className="booking-confirmation">
      <div className="confirmation-container">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="success-circle">
            <div className="success-checkmark">✓</div>
          </div>
          <div className="confetti">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="confetti-piece" style={{ '--delay': `${i * 0.1}s` } as any}></div>
            ))}
          </div>
        </div>

        {/* Confirmation Message */}
        <div className="confirmation-message">
          <h1>Booking Confirmed!</h1>
          <p>Your service has been successfully booked</p>
          <div className="booking-id">
            <span className="id-label">Booking ID:</span>
            <span className="id-value">{bookingId}</span>
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(bookingId)}>
              📋 Copy
            </button>
          </div>
        </div>

        {/* Booking Details */}
        <div className="booking-details">
          <h2>Booking Details</h2>
          
          <div className="detail-cards">
            {/* Service Card */}
            <div className="detail-card service-card">
              <div className="card-header">
                <span className="card-icon">🛠️</span>
                <h3>Service Information</h3>
              </div>
              <div className="card-content">
                <div className="detail-row">
                  <span className="label">Service:</span>
                  <span className="value">{bookingData.service?.title}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Professional:</span>
                  <span className="value">{bookingData.professional?.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(bookingData.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Time:</span>
                  <span className="value">{bookingData.timeSlot?.time}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Urgency:</span>
                  <span className={`value urgency ${bookingData.urgency}`}>
                    {bookingData.urgency === 'urgent' && '🚨 Emergency'}
                    {bookingData.urgency === 'high' && '⚡ Express'}
                    {bookingData.urgency === 'medium' && '📅 Standard'}
                    {bookingData.urgency === 'low' && '🕐 Regular'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="detail-card contact-card">
              <div className="card-header">
                <span className="card-icon">📍</span>
                <h3>Contact & Address</h3>
              </div>
              <div className="card-content">
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{bookingData.personalInfo?.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span className="value">{bookingData.personalInfo?.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{bookingData.personalInfo?.email}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Address:</span>
                  <span className="value">
                    {bookingData.personalInfo?.address}, {bookingData.personalInfo?.city}, {bookingData.personalInfo?.state} {bookingData.personalInfo?.pincode}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="detail-card payment-card">
              <div className="card-header">
                <span className="card-icon">💳</span>
                <h3>Payment Information</h3>
              </div>
              <div className="card-content">
                <div className="detail-row">
                  <span className="label">Method:</span>
                  <span className="value">
                    {bookingData.paymentMethod === 'card' && '💳 Credit/Debit Card'}
                    {bookingData.paymentMethod === 'upi' && '📱 UPI Payment'}
                    {bookingData.paymentMethod === 'wallet' && '💰 Wallet'}
                    {bookingData.paymentMethod === 'cash' && '💵 Cash on Service'}
                  </span>
                </div>
                <div className="detail-row total-row">
                  <span className="label">Total Amount:</span>
                  <span className="value total">₹{bookingData.totalAmount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline-section">
          <h2>What Happens Next?</h2>
          <div className="timeline">
            <div className="timeline-item completed">
              <div className="timeline-dot">✓</div>
              <div className="timeline-content">
                <h4>Booking Confirmed</h4>
                <p>Your booking has been confirmed and professional has been notified</p>
                <span className="timeline-time">Just now</span>
              </div>
            </div>
            <div className="timeline-item upcoming">
              <div className="timeline-dot">📞</div>
              <div className="timeline-content">
                <h4>Professional Contact</h4>
                <p>{bookingData.professional?.name} will call you within 30 minutes to confirm details</p>
                <span className="timeline-time">Within 30 mins</span>
              </div>
            </div>
            <div className="timeline-item upcoming">
              <div className="timeline-dot">🚗</div>
              <div className="timeline-content">
                <h4>Professional Arrives</h4>
                <p>Professional will arrive at your location at the scheduled time</p>
                <span className="timeline-time">{bookingData.timeSlot?.time}</span>
              </div>
            </div>
            <div className="timeline-item upcoming">
              <div className="timeline-dot">🔧</div>
              <div className="timeline-content">
                <h4>Service Completion</h4>
                <p>Service will be completed and payment will be processed</p>
                <span className="timeline-time">After service</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn-primary" onClick={handleTrackBooking}>
            📍 Track Booking
          </button>
          <button className="btn-secondary" onClick={handleViewBookings}>
            📋 My Bookings
          </button>
          <button className="btn-secondary" onClick={handleShareBooking}>
            📤 Share
          </button>
          <button className="btn-outline" onClick={handleBookAnother}>
            ➕ Book Another Service
          </button>
        </div>

        {/* Support Section */}
        <div className="support-section">
          <h3>Need Help?</h3>
          <p>Our customer support team is available 24/7 to assist you</p>
          <div className="support-options">
            <a href="tel:18001234567" className="support-option">
              <span className="support-icon">📞</span>
              <div className="support-info">
                <strong>Call Us</strong>
                <span>1-800-123-4567</span>
              </div>
            </a>
            <a href="mailto:support@servicehub.com" className="support-option">
              <span className="support-icon">📧</span>
              <div className="support-info">
                <strong>Email Us</strong>
                <span>support@servicehub.com</span>
              </div>
            </a>
            <a href="/chat" className="support-option">
              <span className="support-icon">💬</span>
              <div className="support-info">
                <strong>Live Chat</strong>
                <span>Chat with support team</span>
              </div>
            </a>
          </div>
        </div>

        {/* Auto Redirect Notice */}
        {countdown > 0 && (
          <div className="redirect-notice">
            <p>Redirecting to booking tracking in {countdown} seconds...</p>
            <button className="btn-cancel" onClick={() => setCountdown(0)}>
              Stay Here
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
