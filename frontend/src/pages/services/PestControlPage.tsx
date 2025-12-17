import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AdvancedPages.css'

export default function PestControlPage() {
  const [selectedService, setSelectedService] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    area: '',
    pestType: '',
    severity: 'medium',
    urgency: 'normal',
    preferredTime: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const pestServices = [
    {
      id: 'general-pest-control',
      name: 'General Pest Control',
      description: 'Comprehensive pest control for common household pests',
      price: '₹2000-5000',
      time: '2-4 hours',
      features: ['Safe chemicals', 'Eco-friendly', 'Child & pet safe', '3-month warranty'],
      popular: true
    },
    {
      id: 'termite-control',
      name: 'Termite Control',
      description: 'Advanced termite treatment and prevention solutions',
      price: '₹5000-15000',
      time: '4-6 hours',
      features: ['Anti-termite treatment', 'Wood protection', 'Soil treatment', '5-year warranty'],
      popular: true
    },
    {
      id: 'cockroach-control',
      name: 'Cockroach Control',
      description: 'Specialized cockroach elimination and prevention',
      price: '₹1500-3500',
      time: '1-2 hours',
      features: ['Gel treatment', 'Bait stations', 'Crack & crevice treatment', '6-month warranty'],
      popular: false
    },
    {
      id: 'mosquito-control',
      name: 'Mosquito Control',
      description: 'Mosquito fogging and larval control treatment',
      price: '₹2500-6000',
      time: '2-3 hours',
      features: ['Fogging treatment', 'Larval control', 'Breeding source elimination', '3-month warranty'],
      popular: false
    },
    {
      id: 'rodent-control',
      name: 'Rodent Control',
      description: 'Rat and mouse control with advanced trapping methods',
      price: '₹2000-4500',
      time: '2-3 hours',
      features: ['Rodent proofing', 'Bait stations', 'Trapping', '6-month warranty'],
      popular: false
    },
    {
      id: 'bedbug-control',
      name: 'Bedbug Treatment',
      description: 'Complete bedbug elimination and prevention',
      price: '₹3000-8000',
      time: '3-5 hours',
      features: ['Heat treatment', 'Steam treatment', 'Chemical treatment', '6-month warranty'],
      popular: true
    }
  ]

  const pestTypes = [
    { id: 'cockroaches', name: 'Cockroaches', icon: '🪳' },
    { id: 'termites', name: 'Termites', icon: '🐜' },
    { id: 'mosquitoes', name: 'Mosquitoes', icon: '🦟' },
    { id: 'rodents', name: 'Rodents', icon: '🐀' },
    { id: 'bedbugs', name: 'Bedbugs', icon: '🛏️' },
    { id: 'ants', name: 'Ants', icon: '🐜' },
    { id: 'spiders', name: 'Spiders', icon: '🕷️' },
    { id: 'flies', name: 'Flies', icon: '🪰' }
  ]

  const whyChooseUs = [
    {
      icon: '🧪',
      title: 'Safe Chemicals',
      description: 'WHO-approved, eco-friendly pest control chemicals'
    },
    {
      icon: '👨‍🔬',
      title: 'Expert Technicians',
      description: 'Certified pest control specialists with years of experience'
    },
    {
      icon: '🛡️',
      title: 'Long-term Protection',
      description: 'Extended warranty and preventive treatments'
    },
    {
      icon: '🏠',
      title: 'Property Safe',
      description: 'No damage to your property during treatment'
    },
    {
      icon: '👶',
      title: 'Family Safe',
      description: 'Child and pet-friendly treatment methods'
    },
    {
      icon: '📋',
      title: 'Pre & Post Inspection',
      description: 'Thorough inspection before and after treatment'
    }
  ]

  const treatmentProcess = [
    {
      step: 1,
      title: 'Inspection',
      description: 'Thorough inspection to identify pest types and infestation level'
    },
    {
      step: 2,
      title: 'Custom Plan',
      description: 'Personalized treatment plan based on infestation severity'
    },
    {
      step: 3,
      title: 'Treatment',
      description: 'Safe and effective pest control treatment'
    },
    {
      step: 4,
      title: 'Prevention',
      description: 'Preventive measures to avoid future infestations'
    }
  ]

  const testimonials = [
    {
      name: 'Rohit Sharma',
      rating: 5,
      comment: 'Excellent termite control service! They identified the problem quickly and provided effective treatment.',
      service: 'Termite Control'
    },
    {
      name: 'Sneha Patel',
      rating: 5,
      comment: 'Professional cockroach control service. The team was thorough and the results were amazing.',
      service: 'Cockroach Control'
    },
    {
      name: 'Amit Kumar',
      rating: 4,
      comment: 'Good mosquito control service. Our mosquito problem reduced significantly after treatment.',
      service: 'Mosquito Control'
    }
  ]

  const faqs = [
    {
      question: 'Are your pest control chemicals safe for children and pets?',
      answer: 'Yes, we use WHO-approved, eco-friendly chemicals that are completely safe for children, pets, and the environment. Our technicians take all necessary precautions during treatment.'
    },
    {
      question: 'How long does the pest control treatment last?',
      answer: 'The effectiveness varies by pest type. General pest control lasts 3 months, termite treatment provides 5 years protection, and other treatments typically last 6 months with proper maintenance.'
    },
    {
      question: 'Do I need to vacate my home during treatment?',
      answer: 'For most treatments, you don\'t need to vacate. However, for certain intensive treatments like bedbug heat treatment, we recommend vacating for 4-6 hours. Our technicians will guide you accordingly.'
    },
    {
      question: 'What preparation is needed before pest control treatment?',
      answer: 'We recommend covering food items, moving furniture away from walls, and ensuring proper ventilation. Our team provides detailed preparation instructions before the service.'
    },
    {
      question: 'Do you provide warranty for your services?',
      answer: 'Yes, we provide warranty ranging from 3 months to 5 years depending on the treatment type. We also offer free follow-up visits within the warranty period if needed.'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Pest control booking:', { ...formData, service: selectedService })
      alert('Pest control service booked successfully! Our team will contact you shortly.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        area: '',
        pestType: '',
        severity: 'medium',
        urgency: 'normal',
        preferredTime: ''
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
    <div className="pest-control-page">
      {/* Hero Section */}
      <section className="service-hero">
        <div className="hero-content">
          <div className="service-icon-large">🐜</div>
          <h1>Professional Pest Control Services</h1>
          <p className="hero-subtitle">Safe and effective pest elimination</p>
          <p className="hero-description">
            Protect your home and family from unwanted pests with our safe, effective, 
            and environmentally-friendly pest control solutions using WHO-approved chemicals.
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <span className="feature-icon">🧪</span>
              <span>Safe Chemicals</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">👶</span>
              <span>Child & Pet Safe</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">🛡️</span>
              <span>Long-term Warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pest Types */}
      <section className="pest-types-section">
        <div className="container">
          <h2>Common Pests We Handle</h2>
          <div className="pest-types-grid">
            {pestTypes.map(pest => (
              <div key={pest.id} className="pest-type-card">
                <div className="pest-icon">{pest.icon}</div>
                <h3>{pest.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <div className="container">
          <h2>Our Pest Control Services</h2>
          <div className="services-grid">
            {pestServices.map(service => (
              <div key={service.id} className={`service-card ${service.popular ? 'featured' : ''}`}>
                {service.popular && <div className="popular-badge">🔥 Popular</div>}
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="service-details">
                  <div className="detail-item">
                    <span className="detail-icon">💰</span>
                    <span>Starting from {service.price}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⏰</span>
                    <span>{service.time}</span>
                  </div>
                </div>
                <ul className="service-features">
                  {service.features.map((feature, index) => (
                    <li key={index}>✅ {feature}</li>
                  ))}
                </ul>
                <button 
                  className="btn-primary"
                  onClick={() => setSelectedService(service.name)}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Process */}
      <section className="process-section">
        <div className="container">
          <h2>Our Treatment Process</h2>
          <div className="process-grid">
            {treatmentProcess.map(step => (
              <div key={step.step} className="process-card">
                <div className="step-number">{step.step}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <div className="container">
          <h2>Why Choose Smart ServiceHub for Pest Control?</h2>
          <div className="features-grid">
            {whyChooseUs.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-large">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="booking-section">
        <div className="container">
          <div className="booking-grid">
            <div className="booking-form">
              <h2>Book Pest Control Service</h2>
              {selectedService && (
                <div className="selected-service">
                  <strong>Selected Service:</strong> {selectedService}
                </div>
              )}
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
                    <label>Service Type *</label>
                    <select
                      name="service"
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select a service</option>
                      {pestServices.map(service => (
                        <option key={service.id} value={service.name}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Service Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Area Size (sq ft) *</label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="e.g., 1200"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label>Pest Type *</label>
                    <select
                      name="pestType"
                      value={formData.pestType}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select pest type</option>
                      {pestTypes.map(pest => (
                        <option key={pest.id} value={pest.name}>
                          {pest.icon} {pest.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Infestation Severity</label>
                    <select
                      name="severity"
                      value={formData.severity}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="low">Low - Few pests visible</option>
                      <option value="medium">Medium - Regular sightings</option>
                      <option value="high">High - Heavy infestation</option>
                      <option value="severe">Severe - Widespread problem</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Urgency Level</label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="normal">Normal (24-48 hours)</option>
                      <option value="urgent">Urgent (same day)</option>
                      <option value="emergency">Emergency (within 4 hours)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Preferred Time</label>
                  <input
                    type="datetime-local"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting || !selectedService}
                >
                  {isSubmitting ? 'Booking...' : 'Book Service'}
                </button>
              </form>
            </div>

            <div className="booking-info">
              <h3>Service Information</h3>
              <div className="info-card">
                <h4>🐜 Pest Control Hotline</h4>
                <p>For urgent pest control needs, call us:</p>
                <a href="tel:+919876543213" className="emergency-phone">+91 98765 43213</a>
              </div>
              
              <div className="info-card">
                <h4>💰 Pricing Information</h4>
                <ul>
                  <li>Inspection fee: Free (waived on booking)</li>
                  <li>Minimum service charge: ₹1500</li>
                  <li>Weekend surcharge: ₹300</li>
                  <li>Payment options: Cash, Card, UPI</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h4>🛡️ Service Warranty</h4>
                <ul>
                  <li>General pest control: 3 months</li>
                  <li>Termite treatment: 5 years</li>
                  <li>Other treatments: 6 months</li>
                  <li>Free follow-up visits</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>🏪 Service Areas</h4>
                <p>We provide pest control services in:</p>
                <ul>
                  <li>Mumbai & Navi Mumbai</li>
                  <li>Delhi & NCR</li>
                  <li>Bangalore</li>
                  <li>Chennai</li>
                  <li>Pune</li>
                  <li>Hyderabad</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2>Customer Reviews</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="customer-info">
                    <strong>{testimonial.name}</strong>
                    <span className="service-type">{testimonial.service}</span>
                  </div>
                  <div className="rating">
                    {'⭐'.repeat(testimonial.rating)}
                  </div>
                </div>
                <p className="testimonial-text">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={index} className="faq-item">
                <summary className="faq-question">{faq.question}</summary>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Need Pest Control Help?</h2>
            <p>Our expert pest control team is ready to eliminate your pest problems safely</p>
            <div className="cta-actions">
              <a href="tel:+919876543213" className="btn-primary emergency-btn">
                🐜 Pest Control: +91 98765 43213
              </a>
              <Link to="/contact" className="btn-secondary">Contact Support</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
