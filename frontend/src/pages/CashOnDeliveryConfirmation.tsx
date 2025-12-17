import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/CashOnDeliveryConfirmation.css'

interface CODConfirmationState {
  method: string
  serviceId?: string
  serviceName?: string
  amount?: string
  bookingData?: any
  timestamp: string
}

export default function CashOnDeliveryConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as CODConfirmationState
  
  const [countdown, setCountdown] = useState(10)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  useEffect(() => {
    if (!state) {
      navigate('/payment/select')
      return
    }

    // Auto-generate booking ID
    const bookingId = 'BK' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase()
    
    // Simulate booking confirmation
    const confirmBooking = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setBookingConfirmed(true)
    }
    
    confirmBooking()

    // Countdown for auto-redirect
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          navigate('/bookings')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(countdownInterval)
    }
  }, [state, navigate])

  const handleViewBookings = () => {
    navigate('/bookings')
  }

  const handlePrintDetails = () => {
    const bookingDetails = `
CASH ON SERVICE BOOKING CONFIRMATION
====================================

Booking ID: BK${Date.now().toString().slice(-8)}${Math.random().toString(36).substr(2, 4).toUpperCase()}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

SERVICE DETAILS
--------------
Service: ${state.serviceName || 'Service Booking'}
Amount to be Paid: ${state.amount || '₹0'}
Payment Method: Cash on Service

CUSTOMER INFORMATION
--------------------
Name: ${state.bookingData?.name || 'Customer'}
Email: ${state.bookingData?.email || ''}
Phone: ${state.bookingData?.phone || ''}

SERVICE SCHEDULE
----------------
Date: ${state.bookingData?.date || 'To be scheduled'}
Time: ${state.bookingData?.time || 'To be scheduled'}
Address: ${state.bookingData?.address || ''}

PAYMENT INSTRUCTIONS
--------------------
1. Payment to be collected when service is completed
2. Please keep exact amount ready
3. You will receive an official receipt
4. Service provider will verify service completion

IMPORTANT NOTES
---------------
- Service provider will call before arrival
- Please ensure someone is available at the service address
- Payment should be made in Indian Rupees
- You will receive a confirmation SMS

Thank you for choosing our service!
    `.trim()

    const blob = new Blob([bookingDetails], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `booking_confirmation_${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="cod-confirmation">
      <div className="container">
        <div className="confirmation-header">
          <div className="confirmation-icon">
            <div className="icon-circle">
              <span className="cash-icon">💵</span>
            </div>
          </div>
          <h1>Booking Confirmed!</h1>
          <p>Your service has been booked successfully</p>
          <div className="payment-method-badge">
            <span className="badge-icon">💵</span>
            <span>Cash on Service</span>
          </div>
        </div>

        <div className="confirmation-content">
          <div className="booking-summary">
            <div className="summary-card">
              <div className="summary-header">
                <h3>Booking Summary</h3>
                <div className="booking-status confirmed">
                  <span className="status-dot"></span>
                  <span>Confirmed</span>
                </div>
              </div>

              <div className="booking-details">
                <div className="detail-item">
                  <span className="label">Booking ID:</span>
                  <span className="value">BK{Date.now().toString().slice(-8)}{Math.random().toString(36).substr(2, 4).toUpperCase()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Service:</span>
                  <span className="value">{state.serviceName || 'Service Booking'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Amount to be Paid:</span>
                  <span className="value amount">{state.amount || '₹0'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Payment Method:</span>
                  <span className="value">Cash on Service</span>
                </div>
              </div>
            </div>
          </div>

          <div className="payment-instructions">
            <div className="instructions-card">
              <h3>Payment Instructions</h3>
              <div className="instruction-list">
                <div className="instruction-item">
                  <div className="instruction-icon">1</div>
                  <div className="instruction-text">
                    <h4>Service Completion</h4>
                    <p>Payment will be collected only after the service is completed to your satisfaction</p>
                  </div>
                </div>
                <div className="instruction-item">
                  <div className="instruction-icon">2</div>
                  <div className="instruction-text">
                    <h4>Exact Amount</h4>
                    <p>Please keep the exact amount ready: {state.amount || '₹0'}</p>
                  </div>
                </div>
                <div className="instruction-item">
                  <div className="instruction-icon">3</div>
                  <div className="instruction-text">
                    <h4>Official Receipt</h4>
                    <p>You will receive an official receipt for your payment</p>
                  </div>
                </div>
                <div className="instruction-item">
                  <div className="instruction-icon">4</div>
                  <div className="instruction-text">
                    <h4>Service Verification</h4>
                    <p>Our service provider will verify service completion before payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="service-info">
            <div className="info-card">
              <h3>Service Schedule</h3>
              {state.bookingData && (
                <div className="schedule-details">
                  <div className="schedule-item">
                    <span className="schedule-icon">📅</span>
                    <div className="schedule-content">
                      <span className="label">Date</span>
                      <span className="value">{state.bookingData.date || 'To be scheduled'}</span>
                    </div>
                  </div>
                  <div className="schedule-item">
                    <span className="schedule-icon">⏰</span>
                    <div className="schedule-content">
                      <span className="label">Time</span>
                      <span className="value">{state.bookingData.time || 'To be scheduled'}</span>
                    </div>
                  </div>
                  <div className="schedule-item">
                    <span className="schedule-icon">📍</span>
                    <div className="schedule-content">
                      <span className="label">Address</span>
                      <span className="value">{state.bookingData.address || 'Service address'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="important-notes">
            <div className="notes-card">
              <h3>Important Information</h3>
              <div className="notes-list">
                <div className="note-item">
                  <span className="note-icon">📞</span>
                  <span>Service provider will call you before arrival</span>
                </div>
                <div className="note-item">
                  <span className="note-icon">👥</span>
                  <span>Please ensure someone is available at the service address</span>
                </div>
                <div className="note-item">
                  <span className="note-icon">💰</span>
                  <span>Payment should be made in Indian Rupees</span>
                </div>
                <div className="note-item">
                  <span className="note-icon">📱</span>
                  <span>You will receive a confirmation SMS with booking details</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <div className="primary-actions">
            <button className="btn-primary" onClick={handleViewBookings}>
              View My Bookings
            </button>
            <button className="btn-secondary" onClick={handlePrintDetails}>
              📄 Print Details
            </button>
          </div>

          <div className="secondary-actions">
            <button className="btn-text" onClick={() => navigate('/')}>
              Book Another Service
            </button>
            <button className="btn-text" onClick={() => navigate('/support')}>
              Need Help?
            </button>
          </div>
        </div>

        <div className="auto-redirect">
          <div className="redirect-info">
            <span className="redirect-text">
              You will be automatically redirected to your bookings in {countdown} seconds
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(10 - countdown) * 10}%` }}
              />
            </div>
          </div>
        </div>

        <div className="support-info">
          <div className="support-card">
            <h4>Need Assistance?</h4>
            <p>If you have any questions about your booking or payment, our support team is here to help.</p>
            <div className="support-actions">
              <button className="support-btn" onClick={() => navigate('/support')}>
                Contact Support
              </button>
              <button className="support-btn" onClick={() => navigate('/support/faq')}>
                View FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
