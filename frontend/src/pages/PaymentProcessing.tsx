import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/PaymentProcessing.css'

interface PaymentState {
  method: string
  serviceId?: string
  serviceName?: string
  amount?: string
  bookingData?: any
  timestamp: string
}

export default function PaymentProcessing() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as PaymentState
  
  const [processingStage, setProcessingStage] = useState<'initiating' | 'processing' | 'verifying' | 'success' | 'failed'>('initiating')
  const [progress, setProgress] = useState(0)
  const [transactionId, setTransactionId] = useState('')
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (!state) {
      navigate('/payment/select')
      return
    }

    const generateTransactionId = () => {
      return 'TXN' + Date.now().toString().slice(-10) + Math.random().toString(36).substr(2, 5).toUpperCase()
    }

    setTransactionId(generateTransactionId())

    const processingStages = [
      { stage: 'initiating' as const, duration: 2000, progress: 25 },
      { stage: 'processing' as const, duration: 3000, progress: 50 },
      { stage: 'verifying' as const, duration: 2000, progress: 75 },
      { stage: 'success' as const, duration: 1000, progress: 100 }
    ]

    let currentStageIndex = 0
    let timeoutId: NodeJS.Timeout

    const runProcessing = async () => {
      while (currentStageIndex < processingStages.length) {
        const { stage, duration, progress: stageProgress } = processingStages[currentStageIndex]
        
        setProcessingStage(stage)
        setProgress(stageProgress)

        await new Promise(resolve => {
          timeoutId = setTimeout(resolve, duration)
        })

        currentStageIndex++
      }

      // Redirect to success page
      setTimeout(() => {
        navigate('/payment/success', {
          state: {
            ...state,
            transactionId,
            completedAt: new Date().toISOString()
          }
        })
      }, 1000)
    }

    runProcessing()

    // Countdown timer for auto-redirect
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      clearInterval(countdownInterval)
    }
  }, [state, navigate])

  const handleCancelPayment = () => {
    navigate('/payment/select', { state: { ...state, cancelled: true } })
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
      'wallet': '👛'
    }
    return icons[method] || '💳'
  }

  const getStageMessage = () => {
    switch (processingStage) {
      case 'initiating':
        return 'Initiating secure payment connection...'
      case 'processing':
        return 'Processing your payment securely...'
      case 'verifying':
        return 'Verifying payment details...'
      case 'success':
        return 'Payment completed successfully!'
      case 'failed':
        return 'Payment failed. Please try again.'
      default:
        return 'Processing payment...'
    }
  }

  const getStageIcon = () => {
    switch (processingStage) {
      case 'initiating':
        return '🔄'
      case 'processing':
        return '⚡'
      case 'verifying':
        return '🔍'
      case 'success':
        return '✅'
      case 'failed':
        return '❌'
      default:
        return '⏳'
    }
  }

  return (
    <div className="payment-processing">
      <div className="container">
        <div className="processing-header">
          <div className="payment-method-info">
            <div className="method-icon">
              <span>{getPaymentMethodIcon(state?.method || '')}</span>
            </div>
            <div className="method-details">
              <h2>Processing Payment</h2>
              <p>via {state?.method?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) || 'Payment Method'}</p>
            </div>
          </div>
          
          <div className="transaction-info">
            <div className="transaction-id">
              <span className="label">Transaction ID:</span>
              <span className="value">{transactionId}</span>
            </div>
            <div className="amount">
              <span className="label">Amount:</span>
              <span className="value">{state?.amount || '₹0'}</span>
            </div>
          </div>
        </div>

        <div className="processing-content">
          <div className="processing-animation">
            <div className="processing-circle">
              <div className="circle-progress">
                <div 
                  className="progress-fill"
                  style={{ 
                    background: `conic-gradient(#4CAF50 ${progress * 3.6}deg, #f0f0f0 0deg)` 
                  }}
                >
                  <div className="progress-center">
                    <span className="progress-icon">{getStageIcon()}</span>
                    <span className="progress-text">{progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="processing-status">
            <h3 className="status-title">{getStageMessage()}</h3>
            <div className="status-dots">
              <div className={`dot ${processingStage === 'initiating' ? 'active' : ''}`}></div>
              <div className={`dot ${processingStage === 'processing' ? 'active' : ''}`}></div>
              <div className={`dot ${processingStage === 'verifying' ? 'active' : ''}`}></div>
              <div className={`dot ${processingStage === 'success' ? 'active' : ''}`}></div>
            </div>
          </div>

          <div className="processing-details">
            <div className="detail-card">
              <h4>Payment Details</h4>
              <div className="detail-item">
                <span>Service:</span>
                <span>{state?.serviceName || 'Service Booking'}</span>
              </div>
              <div className="detail-item">
                <span>Payment Method:</span>
                <span>{state?.method?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span>Transaction ID:</span>
                <span>{transactionId}</span>
              </div>
              <div className="detail-item">
                <span>Time:</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="security-info">
              <div className="security-item">
                <span className="security-icon">🔒</span>
                <span>256-bit SSL encryption</span>
              </div>
              <div className="security-item">
                <span className="security-icon">🛡️</span>
                <span>PCI DSS compliant</span>
              </div>
              <div className="security-item">
                <span className="security-icon">✅</span>
                <span>Secure payment gateway</span>
              </div>
            </div>
          </div>
        </div>

        <div className="processing-footer">
          <div className="countdown-info">
            <span className="countdown-text">
              This page will automatically redirect in {countdown} seconds
            </span>
          </div>
          
          <button className="cancel-btn" onClick={handleCancelPayment}>
            Cancel Payment
          </button>
        </div>

        <div className="processing-bg-animation">
          <div className="floating-icons">
            <span className="icon" style={{ '--delay': '0s', '--duration': '3s' }}>💳</span>
            <span className="icon" style={{ '--delay': '1s', '--duration': '4s' }}>🔒</span>
            <span className="icon" style={{ '--delay': '2s', '--duration': '3.5s' }}>✅</span>
            <span className="icon" style={{ '--delay': '3s', '--duration': '4.5s' }}>💰</span>
          </div>
        </div>
      </div>
    </div>
  )
}
