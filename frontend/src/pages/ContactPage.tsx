import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/AdvancedPages.css'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    urgency: 'normal'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const contactMethods = [
    {
      icon: '📞',
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      contact: '+91 98765 43210',
      available: '24/7 Available',
      action: 'Call Now',
      href: 'tel:+919876543210'
    },
    {
      icon: '💬',
      title: 'WhatsApp Support',
      description: 'Chat with us on WhatsApp',
      contact: '+91 98765 43210',
      available: 'Quick Response',
      action: 'Start Chat',
      href: 'https://wa.me/919876543210'
    },
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Send us an email',
      contact: 'support@smartservicehub.com',
      available: 'Response within 24 hours',
      action: 'Send Email',
      href: 'mailto:support@smartservicehub.com'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with our support team',
      contact: 'Available on website',
      available: '9 AM - 8 PM',
      action: 'Start Chat',
      href: '#chat'
    }
  ]

  const faqs = [
    {
      question: 'How quickly can I get a service professional?',
      answer: 'We offer emergency services within 30 minutes and regular services within 2-4 hours based on availability.'
    },
    {
      question: 'Are your service professionals verified?',
      answer: 'Yes, all our professionals go through background verification, skill assessment, and training before joining our platform.'
    },
    {
      question: 'What is your refund policy?',
      answer: 'We offer 100% refund if you\'re not satisfied with the service. Terms and conditions apply.'
    },
    {
      question: 'Do you provide service warranty?',
      answer: 'Yes, we provide 30-day warranty on all services against workmanship defects.'
    },
    {
      question: 'How are service prices determined?',
      answer: 'Prices are based on service type, complexity, time required, and materials used. We provide transparent pricing upfront.'
    },
    {
      question: 'Can I reschedule or cancel my booking?',
      answer: 'Yes, you can reschedule or cancel your booking up to 2 hours before the scheduled time without any charges.'
    }
  ]

  const offices = [
    {
      city: 'Mumbai',
      address: '123 Business Park, Andheri East, Mumbai - 400001',
      phone: '+91 98765 43210',
      email: 'mumbai@smartservicehub.com'
    },
    {
      city: 'Delhi',
      address: '456 Tech Hub, Connaught Place, Delhi - 110001',
      phone: '+91 98765 43211',
      email: 'delhi@smartservicehub.com'
    },
    {
      city: 'Bangalore',
      address: '789 Innovation Center, Koramangala, Bangalore - 560001',
      phone: '+91 98765 43212',
      email: 'bangalore@smartservicehub.com'
    },
    {
      city: 'Chennai',
      address: '321 Service Plaza, T. Nagar, Chennai - 600001',
      phone: '+91 98765 43213',
      email: 'chennai@smartservicehub.com'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Contact form submitted:', formData)
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        urgency: 'normal'
      })
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } catch (error) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 5000)
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
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1>Get in Touch</h1>
          <p className="hero-subtitle">We're here to help you with all your service needs</p>
          <p className="hero-description">
            Whether you have a question, need support, or want to book a service, 
            our team is ready to assist you. Choose your preferred contact method below.
          </p>
        </div>
      </section>

      {/* Quick Contact Methods */}
      <section className="contact-methods">
        <div className="container">
          <h2>How Would You Like to Connect?</h2>
          <div className="methods-grid">
            {contactMethods.map((method, index) => (
              <div key={index} className="method-card">
                <div className="method-icon">{method.icon}</div>
                <h3>{method.title}</h3>
                <p>{method.description}</p>
                <div className="method-contact">
                  <strong>{method.contact}</strong>
                  <span className="method-available">{method.available}</span>
                </div>
                <a href={method.href} className="method-action" target="_blank" rel="noopener noreferrer">
                  {method.action}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible</p>
              
              {submitStatus === 'success' && (
                <div className="success-message">
                  <span className="success-icon">✅</span>
                  <div className="success-content">
                    <strong>Message Sent Successfully!</strong>
                    <p>We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="error-message">
                  <span className="error-icon">❌</span>
                  <div className="error-content">
                    <strong>Something went wrong!</strong>
                    <p>Please try again or call us directly.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
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
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="service">Service Type</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Select a service</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="pest-control">Pest Control</option>
                      <option value="ac-service">AC Service</option>
                      <option value="painting">Painting</option>
                      <option value="appliance">Appliance Repair</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="urgency">Urgency Level</label>
                  <div className="urgency-options">
                    <label className="urgency-option">
                      <input
                        type="radio"
                        name="urgency"
                        value="normal"
                        checked={formData.urgency === 'normal'}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                      <span>Normal (24-48 hours)</span>
                    </label>
                    <label className="urgency-option">
                      <input
                        type="radio"
                        name="urgency"
                        value="urgent"
                        checked={formData.urgency === 'urgent'}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                      <span>Urgent (2-4 hours)</span>
                    </label>
                    <label className="urgency-option">
                      <input
                        type="radio"
                        name="urgency"
                        value="emergency"
                        checked={formData.urgency === 'emergency'}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                      <span>Emergency (30 minutes)</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Tell us more about your service needs..."
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="contact-info-section">
              <h2>Office Locations</h2>
              <div className="offices-list">
                {offices.map((office, index) => (
                  <div key={index} className="office-card">
                    <h3>{office.city}</h3>
                    <p className="office-address">{office.address}</p>
                    <div className="office-contact">
                      <div className="contact-item">
                        <span className="contact-icon">📞</span>
                        <a href={`tel:${office.phone}`}>{office.phone}</a>
                      </div>
                      <div className="contact-item">
                        <span className="contact-icon">📧</span>
                        <a href={`mailto:${office.email}`}>{office.email}</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="business-hours">
                <h3>Business Hours</h3>
                <div className="hours-grid">
                  <div className="hours-item">
                    <span className="day">Monday - Friday</span>
                    <span className="time">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="hours-item">
                    <span className="day">Saturday</span>
                    <span className="time">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="hours-item">
                    <span className="day">Sunday</span>
                    <span className="time">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="hours-item emergency">
                    <span className="day">Emergency Services</span>
                    <span className="time">24/7 Available</span>
                  </div>
                </div>
              </div>
            </div>
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
                <summary className="faq-question">
                  {faq.question}
                </summary>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <h2>Find Us on the Map</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <div className="map-icon">🗺️</div>
              <h3>Interactive Map</h3>
              <p>Our service areas cover major cities across India</p>
              <div className="map-locations">
                <div className="location-point mumbai">📍 Mumbai</div>
                <div className="location-point delhi">📍 Delhi</div>
                <div className="location-point bangalore">📍 Bangalore</div>
                <div className="location-point chennai">📍 Chennai</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
