import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingBackground from '../../components/FloatingBackground'
import '../../styles/AdvancedPages.css'
import '../../styles/ServicePages.css'

export default function PlumbingPage() {
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

  const plumbingServices = [
    {
      id: 'emergency-plumbing',
      name: 'Emergency Plumbing',
      description: '24/7 emergency plumbing services for urgent issues',
      price: '₹800-2000',
      time: '30-90 mins',
      features: ['Available 24/7', 'Quick response', 'Expert technicians'],
      popular: true
    },
    {
      id: 'pipe-repair',
      name: 'Pipe Repair & Replacement',
      description: 'Fix leaking pipes and replace damaged sections',
      price: '₹1200-3500',
      time: '2-4 hours',
      features: ['Leak detection', 'Pipe replacement', 'Quality materials'],
      popular: false
    },
    {
      id: 'drain-cleaning',
      name: 'Drain Cleaning',
      description: 'Clear blocked drains and prevent future blockages',
      price: '₹600-1500',
      time: '1-2 hours',
      features: ['Camera inspection', 'High-pressure cleaning', 'Preventive care'],
      popular: false
    },
    {
      id: 'faucet-installation',
      name: 'Faucet Installation',
      description: 'Install new faucets and fixtures',
      price: '₹800-2500',
      time: '1-3 hours',
      features: ['Brand installation', 'Leak testing', 'Warranty included'],
      popular: false
    },
    {
      id: 'water-heater',
      name: 'Water Heater Service',
      description: 'Install, repair, and maintain water heaters',
      price: '₹1500-4000',
      time: '2-4 hours',
      features: ['Installation', 'Repair', 'Annual maintenance'],
      popular: true
    },
    {
      id: 'bathroom-fitting',
      name: 'Bathroom Fitting',
      description: 'Complete bathroom plumbing solutions',
      price: '₹2000-8000',
      time: '4-8 hours',
      features: ['Full renovation', 'Modern fixtures', 'Water efficiency'],
      popular: false
    }
  ]

  const whyChooseUs = [
    {
      icon: '⚡',
      title: 'Quick Response',
      description: 'Emergency services within 30 minutes'
    },
    {
      icon: '🔧',
      title: 'Expert Technicians',
      description: 'Certified and experienced plumbers'
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      description: 'No hidden charges, upfront quotes'
    },
    {
      icon: '🛡️',
      title: 'Warranty',
      description: '30-day service warranty on all work'
    },
    {
      icon: '🏪',
      title: 'Genuine Parts',
      description: 'Only original spare parts used'
    },
    {
      icon: '📞',
      title: '24/7 Support',
      description: 'Round-the-clock customer service'
    }
  ]

  const testimonials = [
    {
      name: 'Rahul Sharma',
      rating: 5,
      comment: 'Excellent emergency plumbing service! Technician arrived within 30 minutes and fixed the issue quickly.',
      service: 'Emergency Plumbing'
    },
    {
      name: 'Priya Patel',
      rating: 5,
      comment: 'Professional bathroom fitting service. They transformed our old bathroom into a modern one.',
      service: 'Bathroom Fitting'
    },
    {
      name: 'Amit Kumar',
      rating: 4,
      comment: 'Good water heater installation service. Technician was knowledgeable and polite.',
      service: 'Water Heater Service'
    }
  ]

  const faqs = [
    {
      question: 'How quickly can you respond to plumbing emergencies?',
      answer: 'We offer emergency plumbing services with response time within 30 minutes in major cities.'
    },
    {
      question: 'Do you provide warranty on plumbing services?',
      answer: 'Yes, we provide a 30-day warranty on all plumbing work and 90-day warranty on replaced parts.'
    },
    {
      question: 'What areas do you cover for plumbing services?',
      answer: 'We provide plumbing services in Mumbai, Delhi, Bangalore, Chennai, and other major cities across India.'
    },
    {
      question: 'Are your plumbers certified and insured?',
      answer: 'Yes, all our plumbers are certified, background-checked, and insured for your safety and peace of mind.'
    },
    {
      question: 'Do you use genuine spare parts?',
      answer: 'We only use genuine, manufacturer-approved spare parts to ensure quality and longevity.'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Plumbing service booking:', { ...formData, service: selectedService })
      alert('Plumbing service booked successfully! Our team will contact you shortly.')
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
    <div className="plumbing-page">
      <FloatingBackground />

      <div className="container">
        {/* Hero Section */}
        <div className="service-hero">
          <span className="service-icon-large">🔧</span>
          <h1>Professional Plumbing Services</h1>
          <p>Expert plumbing solutions for all your residential and commercial needs</p>
          <div className="hero-features">
            <div className="hero-feature">
              <span className="feature-icon">⚡</span>
              <span>24/7 Emergency Service</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">�️</span>
              <span>Warranty Guaranteed</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">�</span>
              <span>Expert Plumbers</span>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <section className="services-section">
          <h2>Our Plumbing Services</h2>
          <div className="services-grid">
            {plumbingServices.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-header">
                  <h3>{service.name}</h3>
                  {service.popular && <span className="popular-badge">Popular</span>}
                </div>
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
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <button 
                  className="service-btn"
                  onClick={() => setSelectedService(service.id)}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Booking Form */}
        {selectedService && (
          <section className="booking-section">
            <h2>Book Your Service</h2>
            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label>Service Address</label>
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
                <label>Describe the Issue</label>
                <textarea
                  name="issue"
                  value={formData.issue}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Please describe your plumbing issue in detail..."
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label>Urgency Level</label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  <option value="normal">Normal (2-3 days)</option>
                  <option value="urgent">Urgent (24 hours)</option>
                  <option value="emergency">Emergency (2-4 hours)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Preferred Service Time</label>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Booking...' : 'Book Service'}
              </button>
            </form>
          </section>
        )}

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
              <h2>Need Plumbing Help?</h2>
              <p>Our expert plumbers are ready to solve your plumbing problems</p>
              <div className="cta-actions">
                <a href="tel:+919876543210" className="btn-primary emergency-btn">
                  📞 Emergency: +91 98765 43210
                </a>
                <Link to="/contact" className="btn-secondary">Contact Support</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
