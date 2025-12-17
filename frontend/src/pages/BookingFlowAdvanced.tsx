import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../styles/BookingFlow.css'

interface Service {
  id: string
  name: string
  description: string
  price: string
  duration: string
  features: string[]
}

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  date: string
  time: string
  notes: string
  paymentMethod?: string
}

export default function BookingFlowAdvanced() {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    notes: '',
    paymentMethod: 'cod' // Default to cash on delivery
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const services: Service[] = [
    {
      id: 'plumbing',
      name: 'Plumbing Services',
      description: 'Professional plumbing solutions for all your needs',
      price: '₹800-2000',
      duration: '2-4 hours',
      features: ['24/7 Emergency', 'Expert Technicians', 'Warranty Included']
    },
    {
      id: 'electrical',
      name: 'Electrical Services',
      description: 'Safe and reliable electrical work',
      price: '₹1000-3000',
      duration: '1-3 hours',
      features: ['Licensed Electricians', 'Safety First', 'Quality Materials']
    },
    {
      id: 'cleaning',
      name: 'Home Cleaning',
      description: 'Professional cleaning services',
      price: '₹500-1500',
      duration: '2-4 hours',
      features: ['Trained Staff', 'Eco-Friendly Products', 'Satisfaction Guaranteed']
    }
  ]

  const selectedService = services.find(s => s.id === serviceId) || services[0]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const bookingData = {
        ...formData,
        service: selectedService,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        price: selectedService.price,
        timestamp: new Date().toISOString()
      }

      if (formData.paymentMethod === 'online') {
        // Redirect to payment selection page
        navigate('/payment/select', { state: bookingData })
      } else {
        // Direct to COD confirmation
        navigate('/payment/cod-confirmation', { state: bookingData })
      }
    } catch (error) {
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return true // Service selection is always valid
      case 2:
        return formData.name && formData.email && formData.phone
      case 3:
        return formData.address && formData.date && formData.time
      case 4:
        return formData.paymentMethod // Payment method selection is required
      case 5:
        return true // Review step
      default:
        return false
    }
  }

  return (
    <div className="booking-flow-advanced">
      <div className="container">
        <div className="booking-header">
          <h1>Book Your Service</h1>
          <p>Complete your booking in 5 simple steps</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Service</div>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Personal Info</div>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Schedule</div>
            </div>
            <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">Payment</div>
            </div>
            <div className={`step ${currentStep >= 5 ? 'active' : ''}`}>
              <div className="step-number">5</div>
              <div className="step-label">Review</div>
            </div>
          </div>
        </div>

        {/* Service Selection */}
        {currentStep === 1 && (
          <div className="booking-step">
            <h2>Select Your Service</h2>
            <div className="service-selection">
              <div className="selected-service">
                <h3>{selectedService.name}</h3>
                <p>{selectedService.description}</p>
                <div className="service-details">
                  <div className="detail-item">
                    <span className="detail-icon">💰</span>
                    <span>{selectedService.price}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⏰</span>
                    <span>{selectedService.duration}</span>
                  </div>
                </div>
                <ul className="service-features">
                  {selectedService.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="step-actions">
              <button className="btn-primary" onClick={nextStep}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Personal Information */}
        {currentStep === 2 && (
          <div className="booking-step">
            <h2>Personal Information</h2>
            <form className="booking-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="step-actions">
                <button type="button" className="btn-outline" onClick={prevStep}>
                  Back
                </button>
                <button type="button" className="btn-primary" onClick={nextStep} disabled={!isStepValid()}>
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Schedule */}
        {currentStep === 3 && (
          <div className="booking-step">
            <h2>Schedule Your Service</h2>
            <form className="booking-form">
              <div className="form-group">
                <label>Service Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your complete service address"
                  rows={3}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Time *</label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                />
              </div>
              <div className="step-actions">
                <button type="button" className="btn-outline" onClick={prevStep}>
                  Back
                </button>
                <button type="button" className="btn-primary" onClick={nextStep} disabled={!isStepValid()}>
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Method Selection */}
        {currentStep === 4 && (
          <div className="booking-step">
            <h2>Select Payment Method</h2>
            <div className="payment-method-selection">
              <div className="payment-options">
                <label className="payment-option">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod" 
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <span className="payment-icon">💵</span>
                  <span>Cash on Service</span>
                </label>
                <label className="payment-option">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="online" 
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleInputChange}
                  />
                  <span className="payment-icon">💳</span>
                  <span>Pay Online</span>
                </label>
              </div>
              
              {formData.paymentMethod === 'online' && (
                <div className="online-payment-info">
                  <div className="info-card">
                    <h4>Available Payment Methods</h4>
                    <ul>
                      <li>Google Pay (GPay)</li>
                      <li>PhonePe</li>
                      <li>Paytm</li>
                      <li>Amazon Pay</li>
                      <li>Credit/Debit Cards</li>
                      <li>Net Banking</li>
                    </ul>
                    <p>You will be redirected to a secure payment gateway to complete your payment.</p>
                  </div>
                </div>
              )}
              
              {formData.paymentMethod === 'cod' && (
                <div className="cod-info">
                  <div className="info-card">
                    <h4>Cash on Service Details</h4>
                    <p>Payment will be collected when the service is completed at your location.</p>
                    <ul>
                      <li>Pay the service provider directly</li>
                      <li>Receive official receipt</li>
                      <li>No advance payment required</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="step-actions">
              <button type="button" className="btn-outline" onClick={prevStep}>
                Back
              </button>
              <button type="button" className="btn-primary" onClick={nextStep} disabled={!isStepValid()}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Review */}
        {currentStep === 5 && (
          <div className="booking-step">
            <h2>Review Your Booking</h2>
            <div className="booking-review">
              <div className="review-section">
                <h3>Service Details</h3>
                <div className="review-item">
                  <span className="label">Service:</span>
                  <span className="value">{selectedService.name}</span>
                </div>
                <div className="review-item">
                  <span className="label">Price Range:</span>
                  <span className="value">{selectedService.price}</span>
                </div>
                <div className="review-item">
                  <span className="label">Duration:</span>
                  <span className="value">{selectedService.duration}</span>
                </div>
              </div>

              <div className="review-section">
                <h3>Personal Information</h3>
                <div className="review-item">
                  <span className="label">Name:</span>
                  <span className="value">{formData.name}</span>
                </div>
                <div className="review-item">
                  <span className="label">Email:</span>
                  <span className="value">{formData.email}</span>
                </div>
                <div className="review-item">
                  <span className="label">Phone:</span>
                  <span className="value">{formData.phone}</span>
                </div>
              </div>

              <div className="review-section">
                <h3>Schedule</h3>
                <div className="review-item">
                  <span className="label">Address:</span>
                  <span className="value">{formData.address}</span>
                </div>
                <div className="review-item">
                  <span className="label">Date:</span>
                  <span className="value">{formData.date}</span>
                </div>
                <div className="review-item">
                  <span className="label">Time:</span>
                  <span className="value">{formData.time}</span>
                </div>
                {formData.notes && (
                  <div className="review-item">
                    <span className="label">Notes:</span>
                    <span className="value">{formData.notes}</span>
                  </div>
                )}
              </div>

              <div className="review-section">
                <h3>Payment Method</h3>
                <div className="review-item">
                  <span className="label">Payment Type:</span>
                  <span className="value">{formData.paymentMethod === 'online' ? 'Pay Online' : 'Cash on Service'}</span>
                </div>
                <div className="review-item">
                  <span className="label">Amount:</span>
                  <span className="value">{selectedService.price}</span>
                </div>
              </div>
            </div>

            <div className="step-actions">
              <button type="button" className="btn-outline" onClick={prevStep}>
                Back
              </button>
              <form onSubmit={handleSubmit}>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}