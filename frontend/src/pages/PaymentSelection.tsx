import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/PaymentSelection.css'

interface PaymentMethod {
  id: string
  name: string
  icon: string
  description: string
  color: string
  popular?: boolean
  upi?: boolean
  wallet?: boolean
  card?: boolean
}

interface LocationState {
  serviceId?: string
  serviceName?: string
  price?: string
  bookingData?: any
}

export default function PaymentSelection() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState
  
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'gpay',
      name: 'Google Pay',
      icon: '🟢',
      description: 'Pay instantly with Google Pay UPI',
      color: '#4285F4',
      popular: true,
      upi: true
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      icon: '🟣',
      description: 'Fast and secure payments with PhonePe',
      color: '#6B21A8',
      popular: true,
      upi: true
    },
    {
      id: 'paytm',
      name: 'Paytm',
      icon: '🔵',
      description: 'Pay with Paytm Wallet or UPI',
      color: '#00BFFF',
      popular: true,
      wallet: true,
      upi: true
    },
    {
      id: 'amazonpay',
      name: 'Amazon Pay',
      icon: '🟠',
      description: 'Use Amazon Pay balance or UPI',
      color: '#FF9900',
      wallet: true,
      upi: true
    },
    {
      id: 'upi',
      name: 'UPI Apps',
      icon: '💳',
      description: 'Pay with any UPI app',
      color: '#2E7D32',
      upi: true
    },
    {
      id: 'creditcard',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, RuPay, Amex',
      color: '#1976D2',
      card: true
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'Pay directly from your bank account',
      color: '#7B1FA2'
    },
    {
      id: 'wallet',
      name: 'Paytm Wallet',
      icon: '👛',
      description: 'Use Paytm wallet balance',
      color: '#00BFFF',
      wallet: true
    },
    {
      id: 'cod',
      name: 'Cash on Service',
      icon: '💵',
      description: 'Pay when service is completed',
      color: '#388E3C'
    }
  ]

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
  }

  const handleProceedToPayment = async () => {
    if (!selectedMethod) return

    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const paymentData = {
        method: selectedMethod,
        serviceId: state?.serviceId,
        serviceName: state?.serviceName,
        amount: state?.price,
        bookingData: state?.bookingData,
        timestamp: new Date().toISOString()
      }

      if (selectedMethod === 'cod') {
        navigate('/payment/cod-confirmation', { state: paymentData })
      } else {
        navigate('/payment/process', { state: paymentData })
      }
    } catch (error) {
      console.error('Payment processing error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const selectedPayment = paymentMethods.find(m => m.id === selectedMethod)

  return (
    <div className="payment-selection">
      <div className="container">
        <div className="payment-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1>Select Payment Method</h1>
          <p>Choose your preferred payment option</p>
        </div>

        {state && (
          <div className="payment-summary">
            <div className="summary-card">
              <h3>Payment Summary</h3>
              <div className="summary-item">
                <span>Service:</span>
                <span>{state.serviceName || 'Service Booking'}</span>
              </div>
              <div className="summary-item">
                <span>Amount:</span>
                <span className="amount">{state.price || '₹0'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="payment-methods">
          <div className="methods-grid">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`payment-method-card ${selectedMethod === method.id ? 'selected' : ''} ${method.popular ? 'popular' : ''}`}
                onClick={() => handlePaymentMethodSelect(method.id)}
                style={{ borderColor: selectedMethod === method.id ? method.color : undefined }}
              >
                {method.popular && (
                  <div className="popular-badge">
                    Popular
                  </div>
                )}
                <div className="method-icon" style={{ backgroundColor: `${method.color}15` }}>
                  <span className="icon-emoji">{method.icon}</span>
                </div>
                <div className="method-info">
                  <h4>{method.name}</h4>
                  <p>{method.description}</p>
                </div>
                <div className="method-select">
                  <div className={`radio-circle ${selectedMethod === method.id ? 'selected' : ''}`}>
                    {selectedMethod === method.id && <div className="radio-dot" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedPayment && (
          <div className="selected-payment-details">
            <div className="details-card">
              <h4>Selected Payment Method</h4>
              <div className="selected-method">
                <div className="method-icon-large" style={{ backgroundColor: `${selectedPayment.color}15` }}>
                  <span className="icon-emoji-large">{selectedPayment.icon}</span>
                </div>
                <div className="method-details">
                  <h5>{selectedPayment.name}</h5>
                  <p>{selectedPayment.description}</p>
                </div>
              </div>
              
              {selectedPayment.upi && (
                <div className="payment-note">
                  <span className="note-icon">ℹ️</span>
                  <span>You will be redirected to the UPI app to complete the payment</span>
                </div>
              )}
              
              {selectedPayment.card && (
                <div className="payment-note">
                  <span className="note-icon">🔒</span>
                  <span>Your card information will be securely processed</span>
                </div>
              )}
              
              {selectedPayment.id === 'cod' && (
                <div className="payment-note">
                  <span className="note-icon">💵</span>
                  <span>Payment will be collected when the service is completed</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="payment-actions">
          <button 
            className="proceed-btn" 
            onClick={handleProceedToPayment}
            disabled={!selectedMethod || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="spinner"></div>
                Processing...
              </>
            ) : (
              <>
                Proceed to Pay {state?.price || ''}
              </>
            )}
          </button>
          
          <div className="security-badges">
            <div className="badge">
              <span className="badge-icon">🔒</span>
              <span>Secure Payment</span>
            </div>
            <div className="badge">
              <span className="badge-icon">✅</span>
              <span>SSL Encrypted</span>
            </div>
            <div className="badge">
              <span className="badge-icon">🛡️</span>
              <span>Safe & Trusted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
