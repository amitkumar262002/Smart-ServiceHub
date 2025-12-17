import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AdvancedPages.css'

export default function ElectricalPage() {
  const [selectedService, setSelectedService] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    issue: '',
    urgency: 'normal',
    preferredTime: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const electricalServices = [
    {
      id: 'emergency-electrical',
      name: 'Emergency Electrical',
      description: '24/7 emergency electrical services for power outages and faults',
      price: '₹1000-3000',
      time: '45-120 mins',
      features: ['Available 24/7', 'Safety first', 'Quick diagnosis'],
      popular: true
    },
    {
      id: 'wiring-installation',
      name: 'Wiring & Installation',
      description: 'Complete electrical wiring for new construction and renovation',
      price: '₹5000-15000',
      time: '1-3 days',
      features: ['Copper wiring', 'Safety compliance', 'Load calculation'],
      popular: false
    },
    {
      id: 'circuit-breaker',
      name: 'Circuit Breaker Repair',
      description: 'Fix tripping breakers and install new circuit protection',
      price: '₹1500-4000',
      time: '2-4 hours',
      features: ['Breaker replacement', 'Load balancing', 'Safety testing'],
      popular: false
    },
    {
      id: 'lighting-installation',
      name: 'Lighting Installation',
      description: 'Install indoor and outdoor lighting systems',
      price: '₹2000-8000',
      time: '3-6 hours',
      features: ['LED lighting', 'Smart lighting', 'Dimmer installation'],
      popular: true
    },
    {
      id: 'generator-service',
      name: 'Generator Service',
      description: 'Install, repair, and maintain backup generators',
      price: '₳3000-10000',
      time: '4-8 hours',
      features: ['Installation', 'Repair', 'Annual maintenance'],
      popular: false
    },
    {
      id: 'solar-installation',
      name: 'Solar Panel Installation',
      description: 'Complete solar power system installation and maintenance',
      price: '₹25000-100000',
      time: '2-5 days',
      features: ['Solar panels', 'Inverter setup', 'Net metering'],
      popular: true
    }
  ]

  const whyChooseUs = [
    {
      icon: '⚡',
      title: 'Certified Electricians',
      description: 'Licensed and experienced electrical professionals'
    },
    {
      icon: '🛡️',
      title: 'Safety First',
      description: 'Strict safety protocols and insurance coverage'
    },
    {
      icon: '🔧',
      title: 'Modern Equipment',
      description: 'Latest tools and technology for electrical work'
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      description: 'No hidden charges, detailed cost breakdown'
    },
    {
      icon: '📞',
      title: '24/7 Support',
      description: 'Round-the-clock emergency electrical services'
    },
    {
      icon: '🏆',
      title: 'Quality Guarantee',
      description: '12-month warranty on all electrical work'
    }
  ]

  const testimonials = [
    {
      name: 'Sanjay Reddy',
      rating: 5,
      comment: 'Excellent emergency electrical service! They fixed our power outage within 2 hours.',
      service: 'Emergency Electrical'
    },
    {
      name: 'Anita Sharma',
      rating: 5,
      comment: 'Professional solar panel installation. The team was knowledgeable and efficient.',
      service: 'Solar Panel Installation'
    },
    {
      name: 'Rajesh Kumar',
      rating: 4,
      comment: 'Good lighting installation service. They transformed our home with modern LED lights.',
      service: 'Lighting Installation'
    }
  ]

  const faqs = [
    {
      question: 'Are your electricians licensed and insured?',
      answer: 'Yes, all our electricians are licensed, certified, and fully insured for your protection.'
    },
    {
      question: 'Do you provide emergency electrical services?',
      answer: 'Yes, we offer 24/7 emergency electrical services with response time within 2 hours.'
    },
    {
      question: 'What safety measures do you follow?',
      answer: 'We follow strict safety protocols including proper lockout/tagout procedures, PPE usage, and electrical code compliance.'
    },
    {
      question: 'Do you provide warranty on electrical work?',
      answer: 'We provide a 12-month warranty on all electrical work and 24-month warranty on replaced equipment.'
    },
    {
      question: 'Can you help with energy-efficient solutions?',
      answer: 'Yes, we specialize in energy-efficient solutions including LED lighting, solar installations, and smart home automation.'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Electrical service booking:', { ...formData, service: selectedService })
      alert('Electrical service booked successfully! Our team will contact you shortly.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
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
    <div className="electrical-page">
      {/* Hero Section */}
      <section className="service-hero">
        <div className="hero-content">
          <div className="service-icon-large">⚡</div>
          <h1>Professional Electrical Services</h1>
          <p className="hero-subtitle">Safe and reliable electrical solutions</p>
          <p className="hero-description">
            From emergency repairs to complete installations, our certified electricians 
            provide safe, code-compliant electrical services with guaranteed workmanship.
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <span className="feature-icon">⚡</span>
              <span>24/7 Emergency Service</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">👥</span>
              <span>75+ Certified Electricians</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">🛡️</span>
              <span>12-Month Warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <div className="container">
          <h2>Our Electrical Services</h2>
          <div className="services-grid">
            {electricalServices.map(service => (
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

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <div className="container">
          <h2>Why Choose Smart ServiceHub for Electrical?</h2>
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
              <h2>Book Electrical Service</h2>
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
                      {electricalServices.map(service => (
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

                <div className="form-group">
                  <label>Describe the Issue *</label>
                  <textarea
                    name="issue"
                    value={formData.issue}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Please describe your electrical issue in detail..."
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
                      <option value="urgent">Urgent (2-4 hours)</option>
                      <option value="emergency">Emergency (45 minutes)</option>
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
                <h4>⚡ Emergency Hotline</h4>
                <p>For urgent electrical issues, call us 24/7:</p>
                <a href="tel:+919876543211" className="emergency-phone">+91 98765 43211</a>
              </div>
              
              <div className="info-card">
                <h4>💰 Pricing Information</h4>
                <ul>
                  <li>Inspection fee: ₹300 (waived on service booking)</li>
                  <li>Minimum service charge: ₹800</li>
                  <li>Emergency surcharge: ₹500</li>
                  <li>Payment options: Cash, Card, UPI</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h4>🛡️ Safety & Warranty</h4>
                <ul>
                  <li>12-month warranty on workmanship</li>
                  <li>24-month warranty on equipment</li>
                  <li>Electrical code compliance</li>
                  <li>Insurance coverage</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>🏪 Service Areas</h4>
                <p>We provide electrical services in:</p>
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
            <h2>Need Electrical Help?</h2>
            <p>Our certified electricians are ready to solve your electrical problems safely</p>
            <div className="cta-actions">
              <a href="tel:+919876543211" className="btn-primary emergency-btn">
                ⚡ Emergency: +91 98765 43211
              </a>
              <Link to="/contact" className="btn-secondary">Contact Support</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
