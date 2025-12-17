import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AdvancedPages.css'

export default function RefundPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bookingId: '',
    serviceType: '',
    reason: '',
    description: '',
    refundAmount: '',
    bankAccount: '',
    ifsc: '',
    accountHolder: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const refundPolicies = [
    {
      category: 'Service Quality',
      description: 'If you\'re not satisfied with the service quality',
      refundPercentage: '100%',
      conditions: 'Must report within 24 hours of service completion',
      processingTime: '3-5 business days'
    },
    {
      category: 'Incomplete Service',
      description: 'Service was not completed as agreed',
      refundPercentage: '100%',
      conditions: 'Must provide evidence of incomplete service',
      processingTime: '2-3 business days'
    },
    {
      category: 'Late Arrival',
      description: 'Professional arrived more than 2 hours late',
      refundPercentage: '50%',
      conditions: 'Must be verified through platform records',
      processingTime: '3-5 business days'
    },
    {
      category: 'Cancellation',
      description: 'Customer cancellation',
      refundPercentage: '100%',
      conditions: 'Cancelled more than 2 hours before scheduled time',
      processingTime: '3-5 business days'
    },
    {
      category: 'Emergency Cancellation',
      description: 'Customer cancellation within 2 hours',
      refundPercentage: '50%',
      conditions: 'Valid emergency reason required',
      processingTime: '5-7 business days'
    },
    {
      category: 'Professional No-Show',
      description: 'Professional didn\'t arrive for scheduled service',
      refundPercentage: '100%',
      conditions: 'Must be verified through platform records',
      processingTime: '1-2 business days'
    }
  ]

  const nonRefundableCases = [
    'Services completed successfully and customer was satisfied',
    'Damage caused by customer or family members',
    'Issues reported after 24 hours of service completion',
    'Cancellation due to customer unavailability',
    'Services modified at customer request',
    'Force majeure events (natural disasters, etc.)'
  ]

  const refundProcess = [
    {
      step: 1,
      title: 'Submit Request',
      description: 'Fill out the refund request form with booking details and reason'
    },
    {
      step: 2,
      title: 'Review Process',
      description: 'Our team reviews your request within 24-48 hours'
    },
    {
      step: 3,
      title: 'Investigation',
      description: 'We investigate the issue with the service professional'
    },
    {
      step: 4,
      title: 'Decision',
      description: 'We notify you of our decision and refund amount'
    },
    {
      step: 5,
      title: 'Processing',
      description: 'Refund is processed to your original payment method or bank account'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Refund request submitted:', formData)
      alert('Refund request submitted successfully! We will review your request and contact you within 24-48 hours.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        bookingId: '',
        serviceType: '',
        reason: '',
        description: '',
        refundAmount: '',
        bankAccount: '',
        ifsc: '',
        accountHolder: ''
      })
    } catch (error) {
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="refund-page">
      {/* Hero Section */}
      <section className="legal-hero">
        <div className="hero-content">
          <h1>Refund Policy</h1>
          <p className="hero-subtitle">Fair and transparent refund process</p>
          <p className="hero-description">
            We stand behind our services with a comprehensive refund policy. 
            If you're not satisfied with our service, we'll make it right.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Satisfaction Guarantee</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">24hrs</span>
              <span className="stat-label">Review Time</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">3-5</span>
              <span className="stat-label">Days Processing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Policy Overview */}
      <section className="refund-overview">
        <div className="container">
          <h2>Our Refund Commitment</h2>
          <p className="overview-text">
            At Smart ServiceHub, customer satisfaction is our top priority. We offer a comprehensive 
            refund policy to ensure you're completely satisfied with our services. Our policy is designed 
            to be fair, transparent, and easy to understand.
          </p>
          
          <div className="refund-highlights">
            <div className="highlight-card">
              <span className="highlight-icon">✅</span>
              <h3>100% Satisfaction</h3>
              <p>Full refund if you're not satisfied with the service quality</p>
            </div>
            <div className="highlight-card">
              <span className="highlight-icon">⏰</span>
              <h3>Quick Processing</h3>
              <p>Refunds processed within 3-5 business days</p>
            </div>
            <div className="highlight-card">
              <span className="highlight-icon">🤝</span>
              <h3>Fair Resolution</h3>
              <p>Transparent review process with clear guidelines</p>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Categories */}
      <section className="refund-categories">
        <div className="container">
          <h2>Refund Categories</h2>
          <div className="categories-grid">
            {refundPolicies.map((policy, index) => (
              <div key={index} className="policy-card">
                <div className="policy-header">
                  <h3>{policy.category}</h3>
                  <span className="refund-percentage">{policy.refundPercentage}</span>
                </div>
                <p className="policy-description">{policy.description}</p>
                <div className="policy-details">
                  <div className="detail-item">
                    <span className="detail-label">Conditions:</span>
                    <span>{policy.conditions}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Processing Time:</span>
                    <span>{policy.processingTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Non-Refundable Cases */}
      <section className="non-refundable">
        <div className="container">
          <h2>Non-Refundable Cases</h2>
          <div className="non-refundable-content">
            <p className="non-refundable-intro">
              The following cases are generally not eligible for refunds:
            </p>
            <ul className="non-refundable-list">
              {nonRefundableCases.map((item, index) => (
                <li key={index} className="non-refundable-item">
                  <span className="item-icon">❌</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="note-box">
              <span className="note-icon">ℹ️</span>
              <p>
                <strong>Note:</strong> We review each case individually and may make exceptions 
                based on specific circumstances. Contact our support team for special cases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Process */}
      <section className="refund-process">
        <div className="container">
          <h2>Refund Process</h2>
          <div className="process-timeline">
            {refundProcess.map((step, index) => (
              <div key={step.step} className="process-step">
                <div className="step-number">{step.step}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {index < refundProcess.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Request Form */}
      <section className="refund-form-section">
        <div className="container">
          <h2>Request a Refund</h2>
          <p className="form-intro">
            Fill out the form below to submit your refund request. Our team will review it within 24-48 hours.
          </p>
          
          <div className="refund-form-grid">
            <div className="refund-form">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label>Booking ID *</label>
                    <input
                      type="text"
                      name="bookingId"
                      value={formData.bookingId}
                      onChange={handleInputChange}
                      placeholder="e.g., BK123456"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Service Type *</label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select service type</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="pest-control">Pest Control</option>
                      <option value="ac-service">AC Service</option>
                      <option value="painting">Painting</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Refund Reason *</label>
                    <select
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select reason</option>
                      <option value="quality">Service Quality Issue</option>
                      <option value="incomplete">Incomplete Service</option>
                      <option value="late">Late Arrival</option>
                      <option value="no-show">Professional No-Show</option>
                      <option value="damage">Property Damage</option>
                      <option value="other">Other Reason</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Detailed Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Please describe the issue in detail..."
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Refund Amount Requested (₹) *</label>
                  <input
                    type="text"
                    name="refundAmount"
                    value={formData.refundAmount}
                    onChange={handleInputChange}
                    placeholder="e.g., 1500"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="bank-details-section">
                  <h4>Bank Details for Refund</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Account Holder Name *</label>
                      <input
                        type="text"
                        name="accountHolder"
                        value={formData.accountHolder}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="form-group">
                      <label>Bank Account Number *</label>
                      <input
                        type="text"
                        name="bankAccount"
                        value={formData.bankAccount}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>IFSC Code *</label>
                    <input
                      type="text"
                      name="ifsc"
                      value={formData.ifsc}
                      onChange={handleInputChange}
                      placeholder="e.g., SBIN0001234"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Refund Request'}
                </button>
              </form>
            </div>

            <div className="refund-info">
              <h3>Important Information</h3>
              
              <div className="info-card">
                <h4>📋 Required Documents</h4>
                <ul>
                  <li>Service booking confirmation</li>
                  <li>Photos/videos of the issue (if applicable)</li>
                  <li>Payment receipt or transaction ID</li>
                  <li>Any communication with the professional</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>⏰ Timeline</h4>
                <ul>
                  <li>Request review: 24-48 hours</li>
                  <li>Investigation: 2-3 business days</li>
                  <li>Decision: Within 5 business days</li>
                  <li>Refund processing: 3-5 business days</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>💡 Tips for Faster Processing</h4>
                <ul>
                  <li>Provide detailed description of the issue</li>
                  <li>Attach relevant photos or videos</li>
                  <li>Include booking ID in all communications</li>
                  <li>Respond promptly to follow-up questions</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>📞 Need Help?</h4>
                <p>If you need assistance with your refund request, contact our support team:</p>
                <ul>
                  <li>Phone: +91 98765 43210</li>
                  <li>Email: refunds@smartservicehub.com</li>
                  <li>Live Chat: Available 9 AM - 8 PM</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="refund-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Questions About Refunds?</h2>
            <p>Our support team is here to help you with any refund-related queries</p>
            <div className="cta-actions">
              <a href="tel:+919876543210" className="btn-primary">
                📞 Call Support
              </a>
              <Link to="/support/faq" className="btn-secondary">
                ❓ View FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
