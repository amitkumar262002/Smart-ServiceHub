import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AdvancedPages.css'

export default function CleaningPage() {
  const [selectedService, setSelectedService] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    area: '',
    cleaningType: '',
    urgency: 'normal',
    preferredTime: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cleaningServices = [
    {
      id: 'deep-cleaning',
      name: 'Deep Home Cleaning',
      description: 'Complete deep cleaning of your home with professional equipment',
      price: '₹1500-5000',
      time: '2-6 hours',
      features: ['Professional equipment', 'Eco-friendly products', 'Trained staff', 'Satisfaction guarantee'],
      popular: true
    },
    {
      id: 'office-cleaning',
      name: 'Office Cleaning',
      description: 'Professional office cleaning for productive work environment',
      price: '₹2000-8000',
      time: '3-8 hours',
      features: ['After-hours service', 'Commercial grade cleaning', 'Disinfection', 'Regular maintenance'],
      popular: true
    },
    {
      id: 'carpet-cleaning',
      name: 'Carpet & Sofa Cleaning',
      description: 'Deep cleaning of carpets, sofas, and upholstery',
      price: '₹800-2500',
      time: '1-3 hours',
      features: ['Steam cleaning', 'Stain removal', 'Dust mite treatment', 'Quick drying'],
      popular: false
    },
    {
      id: 'kitchen-cleaning',
      name: 'Kitchen Cleaning',
      description: 'Specialized kitchen cleaning including chimney and appliances',
      price: '₹1200-3500',
      time: '2-4 hours',
      features: ['Chimney cleaning', 'Appliance cleaning', 'Degreasing', 'Sanitization'],
      popular: false
    },
    {
      id: 'bathroom-cleaning',
      name: 'Bathroom Cleaning',
      description: 'Thorough bathroom cleaning and sanitization',
      price: '₹800-2000',
      time: '1-2 hours',
      features: ['Tile cleaning', 'Grout cleaning', 'Sanitization', 'Mirror polishing'],
      popular: false
    },
    {
      id: 'post-construction',
      name: 'Post-Construction Cleaning',
      description: 'Complete cleaning after renovation or construction work',
      price: '₹3000-10000',
      time: '4-8 hours',
      features: ['Dust removal', 'Debris cleanup', 'Surface polishing', 'Final touch-up'],
      popular: false
    }
  ]

  const whyChooseUs = [
    {
      icon: '🧹',
      title: 'Professional Equipment',
      description: 'Industrial-grade cleaning equipment for best results'
    },
    {
      icon: '🌿',
      title: 'Eco-Friendly Products',
      description: 'Safe, non-toxic cleaning products for your family'
    },
    {
      icon: '👥',
      title: 'Trained Staff',
      description: 'Background-checked and professionally trained cleaners'
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      description: 'No hidden charges, upfront quotes guaranteed'
    },
    {
      icon: '🛡️',
      title: 'Satisfaction Guarantee',
      description: '100% satisfaction guarantee or re-cleaning free'
    },
    {
      icon: '⏰',
      title: 'Flexible Scheduling',
      description: 'Book cleaning at your convenient time'
    }
  ]

  const testimonials = [
    {
      name: 'Anita Sharma',
      rating: 5,
      comment: 'Excellent deep cleaning service! My house looks brand new. The team was professional and thorough.',
      service: 'Deep Home Cleaning'
    },
    {
      name: 'Rajesh Kumar',
      rating: 5,
      comment: 'Great office cleaning service. They come after hours and our office is always spotless.',
      service: 'Office Cleaning'
    },
    {
      name: 'Priya Patel',
      rating: 4,
      comment: 'Good carpet cleaning service. Removed tough stains that I thought were permanent.',
      service: 'Carpet & Sofa Cleaning'
    }
  ]

  const cleaningProcess = [
    {
      step: 1,
      title: 'Inspection',
      description: 'Our team inspects the area and discusses requirements'
    },
    {
      step: 2,
      title: 'Preparation',
      description: 'We prepare the area and bring professional equipment'
    },
    {
      step: 3,
      title: 'Cleaning',
      description: 'Thorough cleaning using eco-friendly products'
    },
    {
      step: 4,
      title: 'Quality Check',
      description: 'Final inspection to ensure quality standards'
    }
  ]

  const faqs = [
    {
      question: 'Are your cleaning products safe for children and pets?',
      answer: 'Yes, we use only eco-friendly, non-toxic cleaning products that are completely safe for children, pets, and the environment.'
    },
    {
      question: 'Do I need to provide cleaning equipment?',
      answer: 'No, we bring all necessary professional cleaning equipment including vacuum cleaners, steam cleaners, mops, and cleaning solutions.'
    },
    {
      question: 'How long does cleaning take?',
      answer: 'Cleaning time depends on the area size and type of cleaning. Deep cleaning typically takes 2-6 hours for a 2BHK apartment.'
    },
    {
      question: 'Are your cleaners background-checked?',
      answer: 'Yes, all our cleaning staff undergo thorough background verification, police verification, and professional training.'
    },
    {
      question: 'What if I\'m not satisfied with the cleaning?',
      answer: 'We offer 100% satisfaction guarantee. If you\'re not satisfied, we\'ll re-clean the area free of charge.'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Cleaning service booking:', { ...formData, service: selectedService })
      alert('Cleaning service booked successfully! Our team will contact you shortly.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        area: '',
        cleaningType: '',
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
    <div className="cleaning-page">
      {/* Hero Section */}
      <section className="service-hero">
        <div className="hero-content">
          <div className="service-icon-large">🧹</div>
          <h1>Professional Cleaning Services</h1>
          <p className="hero-subtitle">Sparkling clean spaces for healthy living</p>
          <p className="hero-description">
            From deep home cleaning to office maintenance, our professional cleaning services 
            use eco-friendly products and advanced equipment to deliver exceptional results.
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <span className="feature-icon">🌿</span>
              <span>Eco-Friendly Products</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">👥</span>
              <span>100+ Trained Cleaners</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">🛡️</span>
              <span>Satisfaction Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <div className="container">
          <h2>Our Cleaning Services</h2>
          <div className="services-grid">
            {cleaningServices.map(service => (
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

      {/* Cleaning Process */}
      <section className="process-section">
        <div className="container">
          <h2>Our Cleaning Process</h2>
          <div className="process-grid">
            {cleaningProcess.map(step => (
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
          <h2>Why Choose Smart ServiceHub for Cleaning?</h2>
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
              <h2>Book Cleaning Service</h2>
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
                      {cleaningServices.map(service => (
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
                    <label>Cleaning Type</label>
                    <select
                      name="cleaningType"
                      value={formData.cleaningType}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Select cleaning type</option>
                      <option value="regular">Regular Cleaning</option>
                      <option value="deep">Deep Cleaning</option>
                      <option value="move-in">Move-in/Move-out</option>
                      <option value="post-construction">Post-Construction</option>
                    </select>
                  </div>
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
                <h4>🧹 Cleaning Hotline</h4>
                <p>For urgent cleaning needs, call us:</p>
                <a href="tel:+919876543212" className="emergency-phone">+91 98765 43212</a>
              </div>
              
              <div className="info-card">
                <h4>💰 Pricing Information</h4>
                <ul>
                  <li>Inspection fee: Free (waived on booking)</li>
                  <li>Minimum service charge: ₹800</li>
                  <li>Weekend surcharge: ₹200</li>
                  <li>Payment options: Cash, Card, UPI</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h4>🛡️ Service Guarantee</h4>
                <ul>
                  <li>100% satisfaction guarantee</li>
                  <li>Free re-cleaning if not satisfied</li>
                  <li>Damage protection insurance</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>🏪 Service Areas</h4>
                <p>We provide cleaning services in:</p>
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
            <h2>Need Cleaning Help?</h2>
            <p>Our professional cleaners are ready to make your space sparkle</p>
            <div className="cta-actions">
              <a href="tel:+919876543212" className="btn-primary emergency-btn">
                🧹 Cleaning: +91 98765 43212
              </a>
              <Link to="/contact" className="btn-secondary">Contact Support</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
