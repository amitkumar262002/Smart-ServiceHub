import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/AdvancedPages.css'

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('mission')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form submitted:', formData)
    alert('Thank you for contacting us! We will get back to you soon.')
    setFormData({ name: '', email: '', message: '' })
  }

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '1000+', label: 'Service Professionals' },
    { number: '24/7', label: 'Support Available' },
    { number: '4.8★', label: 'Average Rating' }
  ]

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'CEO & Founder',
      image: '👨‍💼',
      description: 'Visionary leader with 15+ years in service industry'
    },
    {
      name: 'Priya Sharma',
      role: 'CTO',
      image: '👩‍💻',
      description: 'Tech expert driving digital transformation'
    },
    {
      name: 'Amit Patel',
      role: 'Head of Operations',
      image: '👨‍🔧',
      description: 'Ensuring quality service delivery nationwide'
    },
    {
      name: 'Sneha Reddy',
      role: 'Customer Success Head',
      image: '👩‍💼',
      description: 'Dedicated to exceptional customer experiences'
    }
  ]

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About Smart ServiceHub</h1>
          <p className="hero-subtitle">Your trusted partner for all home and professional services</p>
          <p className="hero-description">
            We're revolutionizing the service industry by connecting customers with verified professionals 
            through our innovative platform. Quality, reliability, and customer satisfaction are at the heart of everything we do.
          </p>
          <div className="hero-actions">
            <Link to="/services" className="btn-primary">Explore Services</Link>
            <Link to="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-animation">
            <div className="floating-card card-1">🔧 Plumbing</div>
            <div className="floating-card card-2">⚡ Electrical</div>
            <div className="floating-card card-3">🧹 Cleaning</div>
            <div className="floating-card card-4">🏠 Home Services</div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-section">
        <div className="container">
          <div className="tabs-container">
            <div className="tabs-header">
              <button 
                className={`tab-btn ${activeTab === 'mission' ? 'active' : ''}`}
                onClick={() => setActiveTab('mission')}
              >
                Our Mission
              </button>
              <button 
                className={`tab-btn ${activeTab === 'vision' ? 'active' : ''}`}
                onClick={() => setActiveTab('vision')}
              >
                Our Vision
              </button>
              <button 
                className={`tab-btn ${activeTab === 'values' ? 'active' : ''}`}
                onClick={() => setActiveTab('values')}
              >
                Our Values
              </button>
            </div>
            <div className="tabs-content">
              {activeTab === 'mission' && (
                <div className="tab-content">
                  <h3>Making Quality Services Accessible to Everyone</h3>
                  <p>
                    Our mission is to bridge the gap between customers and service professionals by providing 
                    a reliable, transparent, and efficient platform. We strive to make quality services 
                    accessible to everyone, anytime, anywhere.
                  </p>
                  <ul className="mission-points">
                    <li>✅ Verified and background-checked professionals</li>
                    <li>✅ Transparent pricing with no hidden charges</li>
                    <li>✅ 24/7 customer support</li>
                    <li>✅ Quality guarantee on all services</li>
                  </ul>
                </div>
              )}
              {activeTab === 'vision' && (
                <div className="tab-content">
                  <h3>Becoming the World's Most Trusted Service Platform</h3>
                  <p>
                    We envision a future where finding and booking services is seamless, trustworthy, and 
                    delightful. Our goal is to become the world's most trusted service platform, setting 
                    new standards for quality and customer satisfaction.
                  </p>
                  <ul className="vision-points">
                    <li>🌍 Expand to 100+ cities globally</li>
                    <li>🤖 AI-powered service matching</li>
                    <li>📱 Enhanced mobile experience</li>
                    <li>🏆 Industry-leading quality standards</li>
                  </ul>
                </div>
              )}
              {activeTab === 'values' && (
                <div className="tab-content">
                  <h3>Core Values That Guide Us</h3>
                  <p>
                    Our values are the foundation of everything we do. They guide our decisions, 
                    actions, and relationships with customers, partners, and team members.
                  </p>
                  <div className="values-grid">
                    <div className="value-item">
                      <div className="value-icon">🎯</div>
                      <h4>Excellence</h4>
                      <p>We strive for excellence in everything we do</p>
                    </div>
                    <div className="value-item">
                      <div className="value-icon">🤝</div>
                      <h4>Integrity</h4>
                      <p>We operate with honesty and transparency</p>
                    </div>
                    <div className="value-item">
                      <div className="value-icon">💡</div>
                      <h4>Innovation</h4>
                      <p>We continuously improve and innovate</p>
                    </div>
                    <div className="value-item">
                      <div className="value-icon">❤️</div>
                      <h4>Customer First</h4>
                      <p>Our customers are at the heart of our business</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Meet Our Leadership Team</h2>
          <p className="section-subtitle">The people behind Smart ServiceHub's success</p>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">{member.image}</div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-description">{member.description}</p>
                <div className="team-social">
                  <a href="#" className="team-social-link">📘</a>
                  <a href="#" className="team-social-link">💼</a>
                  <a href="#" className="team-social-link">📧</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
              
              <div className="contact-items">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div className="contact-details">
                    <h4>Email</h4>
                    <p>support@smartservicehub.com</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div className="contact-details">
                    <h4>Phone</h4>
                    <p>+91 98765 43210</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-details">
                    <h4>Address</h4>
                    <p>123 Business Park, Mumbai, Maharashtra 400001</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">⏰</div>
                  <div className="contact-details">
                    <h4>Business Hours</h4>
                    <p>Monday - Saturday: 9AM - 8PM<br />Sunday: 10AM - 6PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="contact-form">
              <h3>Send us a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
