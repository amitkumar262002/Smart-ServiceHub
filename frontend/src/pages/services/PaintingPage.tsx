import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AdvancedPages.css'

export default function PaintingPage() {
  const [selectedService, setSelectedService] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    area: '',
    paintType: '',
    rooms: '',
    urgency: 'normal',
    preferredTime: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const paintingServices = [
    {
      id: 'interior-painting',
      name: 'Interior Painting',
      description: 'Professional interior painting for walls, ceilings, and woodwork',
      price: '₹20-50 per sq ft',
      time: '2-5 days',
      features: ['Wall preparation', 'Putty filling', 'Primer coat', '2 paint coats'],
      popular: true
    },
    {
      id: 'exterior-painting',
      name: 'Exterior Painting',
      description: 'Weather-resistant exterior painting for all building types',
      price: '₹25-60 per sq ft',
      time: '3-7 days',
      features: ['Surface cleaning', 'Waterproofing', 'Crack filling', 'Weather-proof paint'],
      popular: true
    },
    {
      id: 'texture-painting',
      name: 'Texture Painting',
      description: 'Decorative texture painting for unique wall designs',
      price: '₹40-120 per sq ft',
      time: '3-6 days',
      features: ['Texture application', 'Design patterns', 'Custom colors', 'Artistic finish'],
      popular: false
    },
    {
      id: 'wood-polishing',
      name: 'Wood Polishing',
      description: 'Professional wood polishing for furniture and fixtures',
      price: '₹80-200 per sq ft',
      time: '2-4 days',
      features: ['Sanding', 'Staining', 'Polishing', 'Protective coating'],
      popular: false
    },
    {
      id: 'waterproofing',
      name: 'Waterproof Painting',
      description: 'Waterproof painting solutions for leak protection',
      price: '₹30-80 per sq ft',
      time: '3-5 days',
      features: ['Waterproof coating', 'Leak sealing', 'Moisture protection', 'Long-lasting'],
      popular: false
    },
    {
      id: 'commercial-painting',
      name: 'Commercial Painting',
      description: 'Large-scale painting for offices, shops, and commercial spaces',
      price: '₹15-40 per sq ft',
      time: '5-10 days',
      features: ['Bulk pricing', 'Quick completion', 'Minimal disruption', 'Professional finish'],
      popular: true
    }
  ]

  const paintTypes = [
    { id: 'emulsion', name: 'Emulsion Paint', icon: '🎨', description: 'Durable and washable interior paint' },
    { id: 'enamel', name: 'Enamel Paint', icon: '🖌️', description: 'Hard-wearing paint for wood and metal' },
    { id: 'distemper', name: 'Distemper Paint', icon: '🖼️', description: 'Economical paint for interior walls' },
    { id: 'texture', name: 'Texture Paint', icon: '🏗️', description: 'Decorative textured paint finishes' },
    { id: 'waterproof', name: 'Waterproof Paint', icon: '💧', description: 'Water-resistant exterior paint' },
    { id: 'premium', name: 'Premium Paint', icon: '⭐', description: 'High-end luxury paint options' }
  ]

  const colorThemes = [
    { name: 'Modern Neutral', colors: ['#F5F5F5', '#E8E8E8', '#D0D0D0', '#B8B8B8'] },
    { name: 'Warm Earth', colors: ['#D4A574', '#C19A6B', '#A0826D', '#8B7355'] },
    { name: 'Cool Blues', colors: ['#E6F3FF', '#B3D9FF', '#80BFFF', '#4DA6FF'] },
    { name: 'Fresh Greens', colors: ['#E8F5E8', '#C8E6C9', '#A5D6A7', '#81C784'] },
    { name: 'Bold Accent', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'] },
    { name: 'Classic White', colors: ['#FFFFFF', '#F8F8F8', '#F0F0F0', '#E8E8E8'] }
  ]

  const whyChooseUs = [
    {
      icon: '🎨',
      title: 'Expert Painters',
      description: 'Skilled painters with years of experience'
    },
    {
      icon: '🏆',
      title: 'Quality Materials',
      description: 'Premium paints from leading brands'
    },
    {
      icon: '🛡️',
      title: 'Surface Preparation',
      description: 'Thorough preparation for lasting results'
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      description: 'No hidden charges, detailed quotations'
    },
    {
      icon: '⏰',
      title: 'Timely Completion',
      description: 'Projects completed on schedule'
    },
    {
      icon: '🧹',
      title: 'Clean Service',
      description: 'Post-painting cleanup included'
    }
  ]

  const paintingProcess = [
    {
      step: 1,
      title: 'Consultation',
      description: 'Site visit and color consultation'
    },
    {
      step: 2,
      title: 'Preparation',
      description: 'Surface preparation and protection'
    },
    {
      step: 3,
      title: 'Painting',
      description: 'Professional painting with quality materials'
    },
    {
      step: 4,
      title: 'Finishing',
      description: 'Final inspection and cleanup'
    }
  ]

  const testimonials = [
    {
      name: 'Anjali Sharma',
      rating: 5,
      comment: 'Excellent interior painting service! The team was professional and the finish is perfect.',
      service: 'Interior Painting'
    },
    {
      name: 'Rahul Verma',
      rating: 5,
      comment: 'Great exterior painting work. They used quality materials and completed on time.',
      service: 'Exterior Painting'
    },
    {
      name: 'Priya Patel',
      rating: 4,
      comment: 'Beautiful texture painting in my living room. The design is exactly what I wanted.',
      service: 'Texture Painting'
    }
  ]

  const faqs = [
    {
      question: 'How long does painting take?',
      answer: 'Interior painting typically takes 2-5 days, exterior painting 3-7 days, depending on the area size and surface condition.'
    },
    {
      question: 'Do you provide color consultation?',
      answer: 'Yes, we provide free color consultation and can help you choose the perfect colors for your space.'
    },
    {
      question: 'What paint brands do you use?',
      answer: 'We use premium paint brands including Asian Paints, Berger, Nerolac, Dulux, and other leading brands based on your preference.'
    },
    {
      question: 'Do you move furniture during painting?',
      answer: 'Yes, we handle furniture moving and cover all surfaces to protect them during the painting process.'
    },
    {
      question: 'Is there any warranty on painting?',
      answer: 'Yes, we provide a 2-year warranty on interior painting and 3-year warranty on exterior painting against peeling and fading.'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Painting service booking:', { ...formData, service: selectedService })
      alert('Painting service booked successfully! Our team will contact you shortly.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        area: '',
        paintType: '',
        rooms: '',
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
    <div className="painting-page">
      {/* Hero Section */}
      <section className="service-hero">
        <div className="hero-content">
          <div className="service-icon-large">🎨</div>
          <h1>Professional Painting Services</h1>
          <p className="hero-subtitle">Transform your space with beautiful colors</p>
          <p className="hero-description">
            Give your home or office a fresh new look with our professional painting services. 
            From interior to exterior, texture to waterproof painting - we deliver quality results.
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <span className="feature-icon">🎨</span>
              <span>Expert Painters</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">🏆</span>
              <span>Quality Materials</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">🛡️</span>
              <span>2-Year Warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* Color Themes */}
      <section className="color-themes-section">
        <div className="container">
          <h2>Popular Color Themes</h2>
          <div className="color-themes-grid">
            {colorThemes.map((theme, index) => (
              <div key={index} className="color-theme-card">
                <h3>{theme.name}</h3>
                <div className="color-palette">
                  {theme.colors.map((color, colorIndex) => (
                    <div 
                      key={colorIndex} 
                      className="color-swatch" 
                      style={{ backgroundColor: color }}
                      title={color}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paint Types */}
      <section className="paint-types-section">
        <div className="container">
          <h2>Paint Types We Offer</h2>
          <div className="paint-types-grid">
            {paintTypes.map(type => (
              <div key={type.id} className="paint-type-card">
                <div className="paint-icon">{type.icon}</div>
                <h3>{type.name}</h3>
                <p>{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <div className="container">
          <h2>Our Painting Services</h2>
          <div className="services-grid">
            {paintingServices.map(service => (
              <div key={service.id} className={`service-card ${service.popular ? 'featured' : ''}`}>
                {service.popular && <div className="popular-badge">🔥 Popular</div>}
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="service-details">
                  <div className="detail-item">
                    <span className="detail-icon">💰</span>
                    <span>{service.price}</span>
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

      {/* Painting Process */}
      <section className="process-section">
        <div className="container">
          <h2>Our Painting Process</h2>
          <div className="process-grid">
            {paintingProcess.map(step => (
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
          <h2>Why Choose Smart ServiceHub for Painting?</h2>
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
              <h2>Book Painting Service</h2>
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
                      {paintingServices.map(service => (
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
                    <label>Total Area (sq ft) *</label>
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
                    <label>Number of Rooms</label>
                    <input
                      type="text"
                      name="rooms"
                      value={formData.rooms}
                      onChange={handleInputChange}
                      placeholder="e.g., 2BHK, 3 rooms"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Paint Type Preference</label>
                  <select
                    name="paintType"
                    value={formData.paintType}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    <option value="">Select paint type</option>
                    {paintTypes.map(type => (
                      <option key={type.id} value={type.name}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
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
                      <option value="normal">Normal (1 week)</option>
                      <option value="urgent">Urgent (3-4 days)</option>
                      <option value="emergency">Emergency (within 48 hours)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Preferred Start Date</label>
                    <input
                      type="date"
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
                <h4>🎨 Painting Hotline</h4>
                <p>For painting consultation and booking:</p>
                <a href="tel:+919876543215" className="emergency-phone">+91 98765 43215</a>
              </div>
              
              <div className="info-card">
                <h4>💰 Pricing Information</h4>
                <ul>
                  <li>Free site visit and quotation</li>
                  <li>Transparent per sq ft pricing</li>
                  <li>No hidden charges</li>
                  <li>Payment options: Cash, Card, UPI</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h4>🛡️ Service Warranty</h4>
                <ul>
                  <li>2-year warranty on interior painting</li>
                  <li>3-year warranty on exterior painting</li>
                  <li>Free touch-up within warranty period</li>
                  <li>Quality guarantee assured</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>🏪 Service Areas</h4>
                <p>We provide painting services in:</p>
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
            <h2>Ready to Transform Your Space?</h2>
            <p>Our expert painters are ready to bring your vision to life</p>
            <div className="cta-actions">
              <a href="tel:+919876543215" className="btn-primary emergency-btn">
                🎨 Painting: +91 98765 43215
              </a>
              <Link to="/contact" className="btn-secondary">Contact Support</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
