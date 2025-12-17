import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AdvancedPages.css'

export default function ACServicePage() {
  const [selectedService, setSelectedService] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    acType: '',
    acBrand: '',
    issue: '',
    urgency: 'normal',
    preferredTime: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const acServices = [
    {
      id: 'ac-installation',
      name: 'AC Installation',
      description: 'Professional AC installation with proper setup and testing',
      price: '₹3000-8000',
      time: '2-4 hours',
      features: ['Free installation kit', 'Proper wiring', 'Gas charging', '1-year warranty'],
      popular: true
    },
    {
      id: 'ac-repair',
      name: 'AC Repair',
      description: 'Complete AC repair for all types of cooling issues',
      price: '₹1500-5000',
      time: '1-3 hours',
      features: ['Fault diagnosis', 'Spare parts replacement', 'Performance testing', '30-day warranty'],
      popular: true
    },
    {
      id: 'ac-annual-maintenance',
      name: 'Annual Maintenance',
      description: 'Comprehensive AC maintenance for optimal performance',
      price: '₹1200-2500',
      time: '1-2 hours',
      features: ['Deep cleaning', 'Gas top-up', 'Filter replacement', 'Performance check'],
      popular: false
    },
    {
      id: 'gas-refilling',
      name: 'Gas Refilling',
      description: 'AC gas refilling and leak detection service',
      price: '₹800-3000',
      time: '1-2 hours',
      features: ['Leak detection', 'Gas refilling', 'Pressure testing', '3-month warranty'],
      popular: false
    },
    {
      id: 'ac-cleaning',
      name: 'AC Deep Cleaning',
      description: 'Thorough AC cleaning including coils and filters',
      price: '₹1000-2000',
      time: '1-2 hours',
      features: ['Coil cleaning', 'Filter cleaning', 'Drain pipe cleaning', 'Sanitization'],
      popular: false
    },
    {
      id: 'pcb-repair',
      name: 'PCB Repair & Replacement',
      description: 'AC PCB repair and replacement services',
      price: '₹2000-8000',
      time: '2-4 hours',
      features: ['PCB diagnosis', 'Component repair', 'PCB replacement', '6-month warranty'],
      popular: false
    }
  ]

  const acTypes = [
    { id: 'split', name: 'Split AC', icon: '❄️' },
    { id: 'window', name: 'Window AC', icon: '🪟' },
    { id: 'cassette', name: 'Cassette AC', icon: '🏢' },
    { id: 'central', name: 'Central AC', icon: '🌐' },
    { id: 'portable', name: 'Portable AC', icon: '📦' }
  ]

  const acBrands = [
    'Daikin', 'LG', 'Samsung', 'Voltas', 'Blue Star', 'Hitachi', 
    'Carrier', 'Whirlpool', 'Panasonic', 'Godrej', 'O General', 'Mitsubishi'
  ]

  const commonIssues = [
    { id: 'not-cooling', name: 'AC Not Cooling', icon: '🌡️' },
    { id: 'water-leakage', name: 'Water Leakage', icon: '💧' },
    { id: 'noise', name: 'Strange Noise', icon: '🔊' },
    { id: 'bad-odor', name: 'Bad Odor', icon: '👃' },
    { id: 'not-starting', name: 'AC Not Starting', icon: '⚡' },
    { id: 'gas-leak', name: 'Gas Leakage', icon: '💨' }
  ]

  const whyChooseUs = [
    {
      icon: '👨‍🔧',
      title: 'Certified Technicians',
      description: 'Factory-trained and certified AC technicians'
    },
    {
      icon: '🔧',
      title: 'Genuine Spare Parts',
      description: 'Only original manufacturer-approved spare parts'
    },
    {
      icon: '⚡',
      title: 'Quick Service',
      description: 'Same-day service for urgent AC repairs'
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      description: 'No hidden charges, upfront cost estimates'
    },
    {
      icon: '🛡️',
      title: 'Service Warranty',
      description: '30-day warranty on all repair services'
    },
    {
      icon: '📱',
      title: '24/7 Support',
      description: 'Round-the-clock customer support'
    }
  ]

  const serviceProcess = [
    {
      step: 1,
      title: 'Diagnosis',
      description: 'Thorough inspection to identify the exact issue'
    },
    {
      step: 2,
      title: 'Quote',
      description: 'Transparent pricing with detailed cost breakdown'
    },
    {
      step: 3,
      title: 'Repair',
      description: 'Expert repair using genuine spare parts'
    },
    {
      step: 4,
      title: 'Testing',
      description: 'Performance testing to ensure proper functioning'
    }
  ]

  const testimonials = [
    {
      name: 'Vikram Singh',
      rating: 5,
      comment: 'Excellent AC repair service! The technician fixed my AC quickly and it\'s working perfectly now.',
      service: 'AC Repair'
    },
    {
      name: 'Priya Nair',
      rating: 5,
      comment: 'Professional AC installation service. The team was punctual and did a great job with the setup.',
      service: 'AC Installation'
    },
    {
      name: 'Rahul Verma',
      rating: 4,
      comment: 'Good annual maintenance service. My AC is cooling much better after the service.',
      service: 'Annual Maintenance'
    }
  ]

  const faqs = [
    {
      question: 'How often should I service my AC?',
      answer: 'We recommend servicing your AC at least once a year, preferably before summer starts. For heavy usage, twice a year is ideal.'
    },
    {
      question: 'Do you provide warranty on AC repairs?',
      answer: 'Yes, we provide a 30-day warranty on all repair services and up to 1-year warranty on replaced parts and new installations.'
    },
    {
      question: 'Are your technicians certified?',
      answer: 'Yes, all our technicians are factory-trained and certified by major AC manufacturers. They undergo regular training to stay updated with latest technologies.'
    },
    {
      question: 'Do you use genuine spare parts?',
      answer: 'Absolutely! We only use genuine, manufacturer-approved spare parts to ensure quality and longevity of your AC.'
    },
    {
      question: 'How quickly can you respond to AC emergencies?',
      answer: 'For emergency AC repairs, we respond within 2-4 hours depending on your location. Regular services are typically scheduled within 24 hours.'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('AC service booking:', { ...formData, service: selectedService })
      alert('AC service booked successfully! Our team will contact you shortly.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        acType: '',
        acBrand: '',
        issue: '',
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
    <div className="ac-service-page">
      {/* Hero Section */}
      <section className="service-hero">
        <div className="hero-content">
          <div className="service-icon-large">❄️</div>
          <h1>Professional AC Services</h1>
          <p className="hero-subtitle">Expert AC repair and maintenance</p>
          <p className="hero-description">
            Keep your air conditioner running perfectly with our expert AC services including 
            installation, repair, maintenance, and gas refilling by certified technicians.
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <span className="feature-icon">👨‍🔧</span>
              <span>Certified Technicians</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">🔧</span>
              <span>Genuine Parts</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">⚡</span>
              <span>Quick Service</span>
            </div>
          </div>
        </div>
      </section>

      {/* AC Types */}
      <section className="ac-types-section">
        <div className="container">
          <h2>Types of AC We Service</h2>
          <div className="ac-types-grid">
            {acTypes.map(type => (
              <div key={type.id} className="ac-type-card">
                <div className="ac-icon">{type.icon}</div>
                <h3>{type.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="common-issues-section">
        <div className="container">
          <h2>Common AC Issues We Fix</h2>
          <div className="issues-grid">
            {commonIssues.map(issue => (
              <div key={issue.id} className="issue-card">
                <div className="issue-icon">{issue.icon}</div>
                <h3>{issue.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <div className="container">
          <h2>Our AC Services</h2>
          <div className="services-grid">
            {acServices.map(service => (
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

      {/* Service Process */}
      <section className="process-section">
        <div className="container">
          <h2>Our Service Process</h2>
          <div className="process-grid">
            {serviceProcess.map(step => (
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
          <h2>Why Choose Smart ServiceHub for AC Services?</h2>
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
              <h2>Book AC Service</h2>
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
                      {acServices.map(service => (
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
                    <label>AC Type *</label>
                    <select
                      name="acType"
                      value={formData.acType}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select AC type</option>
                      {acTypes.map(type => (
                        <option key={type.id} value={type.name}>
                          {type.icon} {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>AC Brand</label>
                    <select
                      name="acBrand"
                      value={formData.acBrand}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Select AC brand</option>
                      {acBrands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Issue Description *</label>
                  <textarea
                    name="issue"
                    value={formData.issue}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Please describe the issue with your AC in detail..."
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <div className="form-row">
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
                <h4>❄️ AC Service Hotline</h4>
                <p>For urgent AC service needs, call us:</p>
                <a href="tel:+919876543214" className="emergency-phone">+91 98765 43214</a>
              </div>
              
              <div className="info-card">
                <h4>💰 Pricing Information</h4>
                <ul>
                  <li>Inspection fee: ₹500 (waived on booking)</li>
                  <li>Minimum service charge: ₹800</li>
                  <li>Emergency surcharge: ₹500</li>
                  <li>Payment options: Cash, Card, UPI</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h4>🛡️ Service Warranty</h4>
                <ul>
                  <li>30-day warranty on repairs</li>
                  <li>1-year warranty on installations</li>
                  <li>6-month warranty on PCB replacement</li>
                  <li>Free follow-up inspection</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>🏪 Service Areas</h4>
                <p>We provide AC services in:</p>
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
            <h2>Need AC Service?</h2>
            <p>Our certified AC technicians are ready to fix your cooling problems</p>
            <div className="cta-actions">
              <a href="tel:+919876543214" className="btn-primary emergency-btn">
                ❄️ AC Service: +91 98765 43214
              </a>
              <Link to="/contact" className="btn-secondary">Contact Support</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
