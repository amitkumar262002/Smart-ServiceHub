import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/PaymentSuccess.css'

interface PaymentSuccessState {
  method: string
  serviceId?: string
  serviceName?: string
  amount?: string
  bookingData?: any
  transactionId: string
  completedAt: string
}

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as PaymentSuccessState
  
  const [showConfetti, setShowConfetti] = useState(true)
  const [countdown, setCountdown] = useState(15)

  useEffect(() => {
    if (!state) {
      // Use setTimeout to defer navigation until after render
      const timer = setTimeout(() => {
        navigate('/payment/select')
      }, 0)
      return () => clearTimeout(timer)
    }

    // Stop confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    // Countdown for auto-redirect
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          // Use setTimeout to defer navigation until after render
          setTimeout(() => {
            navigate('/bookings')
          }, 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearTimeout(confettiTimer)
      clearInterval(countdownInterval)
    }
  }, [state, navigate])

  const handleViewBooking = () => {
    // Navigation in event handler is fine, but let's wrap it for consistency
    setTimeout(() => {
      navigate('/bookings')
    }, 0)
  }

  const handleDownloadReceipt = () => {
    // Generate receipt PDF
    const receiptData = {
      transactionId: state.transactionId,
      serviceName: state.serviceName,
      amount: state.amount,
      paymentMethod: state.method,
      completedAt: state.completedAt,
      customerName: state.bookingData?.name || 'Customer',
      customerEmail: state.bookingData?.email || '',
      customerPhone: state.bookingData?.phone || '',
      serviceAddress: state.bookingData?.address || '',
      serviceDate: state.bookingData?.date || '',
      serviceTime: state.bookingData?.time || ''
    }

    // Create a simple text receipt (in real app, use PDF library)
    const receiptText = `
PAYMENT RECEIPT
================

Transaction ID: ${receiptData.transactionId}
Date: ${new Date(receiptData.completedAt).toLocaleDateString()}
Time: ${new Date(receiptData.completedAt).toLocaleTimeString()}

CUSTOMER INFORMATION
--------------------
Name: ${receiptData.customerName}
Email: ${receiptData.customerEmail}
Phone: ${receiptData.customerPhone}

SERVICE DETAILS
--------------
Service: ${receiptData.serviceName}
Amount: ${receiptData.amount}
Payment Method: ${receiptData.paymentMethod}

SERVICE SCHEDULE
----------------
Date: ${receiptData.serviceDate}
Time: ${receiptData.serviceTime}
Address: ${receiptData.serviceAddress}

PAYMENT STATUS: COMPLETED ✅

This is an automatically generated receipt.
Thank you for your business!
    `.trim()

    // Download as text file
    const blob = new Blob([receiptText], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt_${state.transactionId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleShareReceipt = async () => {
    const shareData = {
      title: 'Payment Successful',
      text: `Payment of ${state.amount} for ${state.serviceName} completed successfully. Transaction ID: ${state.transactionId}`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.text)
        alert('Receipt details copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing receipt:', error)
    }
  }

  const handleBookAnotherService = () => {
    setTimeout(() => {
      navigate('/')
    }, 0)
  }

  const handleNeedHelp = () => {
    setTimeout(() => {
      navigate('/support')
    }, 0)
  }

  const handleContactSupport = () => {
    setTimeout(() => {
      navigate('/support')
    }, 0)
  }

  const handleViewFAQ = () => {
    setTimeout(() => {
      navigate('/support/faq')
    }, 0)
  }

  const getPaymentMethodIcon = (method: string) => {
    const icons: { [key: string]: string } = {
      'gpay': '🟢',
      'phonepe': '🟣',
      'paytm': '🔵',
      'amazonpay': '🟠',
      'upi': '💳',
      'creditcard': '💳',
      'netbanking': '🏦',
      'wallet': '👛',
      'cod': '💵'
    }
    return icons[method] || '💳'
  }

  return (
    <div className="payment-success">
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                '--delay': `${Math.random() * 3}s`,
                '--duration': `${2 + Math.random() * 2}s`,
                '--x': `${Math.random() * 100}%`,
                '--rotation': `${Math.random() * 360}deg`
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      <div className="container">
        <div className="success-header">
          <div className="success-icon">
            <div className="icon-circle">
              <span className="checkmark">✓</span>
            </div>
          </div>
          <h1>Payment Successful!</h1>
          <p>Your payment has been processed successfully</p>
        </div>

        <div className="success-content">
          <div className="payment-summary">
            <div className="summary-card">
              <div className="summary-header">
                <div className="payment-method">
                  <span className="method-icon">{getPaymentMethodIcon(state.method)}</span>
                  <span className="method-name">
                    {state.method.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </div>
                <div className="amount-display">
                  <span className="amount">{state.amount}</span>
                  <span className="status-badge success">Paid</span>
                </div>
              </div>

              <div className="transaction-details">
                <div className="detail-item">
                  <span className="label">Transaction ID:</span>
                  <span className="value">{state.transactionId}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Payment Date:</span>
                  <span className="value">{new Date(state.completedAt).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Payment Time:</span>
                  <span className="value">{new Date(state.completedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="booking-details">
            <div className="booking-card">
              <h3>Service Booking Details</h3>
              <div className="booking-info">
                <div className="info-item">
                  <span className="icon">🔧</span>
                  <div className="info-content">
                    <span className="label">Service</span>
                    <span className="value">{state.serviceName || 'Service Booking'}</span>
                  </div>
                </div>
                {state.bookingData && (
                  <>
                    <div className="info-item">
                      <span className="icon">📅</span>
                      <div className="info-content">
                        <span className="label">Date</span>
                        <span className="value">{state.bookingData.date || 'To be scheduled'}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="icon">⏰</span>
                      <div className="info-content">
                        <span className="label">Time</span>
                        <span className="value">{state.bookingData.time || 'To be scheduled'}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="icon">📍</span>
                      <div className="info-content">
                        <span className="label">Address</span>
                        <span className="value">{state.bookingData.address || 'Service address'}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="next-steps">
            <div className="steps-card">
              <h3>What's Next?</h3>
              <div className="steps-list">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Confirmation Email</h4>
                    <p>You'll receive a confirmation email with all booking details</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Provider Assignment</h4>
                    <p>We'll assign the best service provider for your booking</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Service Reminder</h4>
                    <p>You'll get a reminder before your scheduled service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="success-actions">
          <div className="primary-actions">
            <button className="btn-primary" onClick={handleViewBooking}>
              View My Bookings
            </button>
            <button className="btn-secondary" onClick={handleDownloadReceipt}>
              📄 Download Receipt
            </button>
            <button className="btn-outline" onClick={handleShareReceipt}>
              📤 Share Receipt
            </button>
          </div>

          <div className="secondary-actions">
            <button className="btn-text" onClick={handleBookAnotherService}>
              Book Another Service
            </button>
            <button className="btn-text" onClick={handleNeedHelp}>
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
                style={{ width: `${(15 - countdown) * 100 / 15}%` }}
              />
            </div>
          </div>
        </div>

        <div className="support-info">
          <div className="support-card">
            <h4>Need Assistance?</h4>
            <p>If you have any questions about your booking or payment, our support team is here to help.</p>
            <div className="support-actions">
              <button className="support-btn" onClick={handleContactSupport}>
                Contact Support
              </button>
              <button className="support-btn" onClick={handleViewFAQ}>
                View FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
