import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AdvancedPages.css'

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('mission')
  const [expandedTimeline, setExpandedTimeline] = useState<number | null>(null)

  const companyStats = [
    { number: '500+', label: 'Service Professionals' },
    { number: '50K+', label: 'Happy Customers' },
    { number: '15+', label: 'Cities Served' },
    { number: '4.8★', label: 'Average Rating' },
    { number: '24/7', label: 'Support Available' },
    { number: '100%', label: 'Satisfaction Guarantee' }
  ]

  const values = [
    {
      icon: '🎯',
      title: 'Customer First',
      description: 'We prioritize customer satisfaction above everything else'
    },
    {
      icon: '🔧',
      title: 'Quality Service',
      description: 'Delivering excellence in every service we provide'
    },
    {
      icon: '🤝',
      title: 'Trust & Transparency',
      description: 'Building relationships through honest and reliable service'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'Continuously improving with technology and new ideas'
    },
    {
      icon: '🌱',
      title: 'Sustainability',
      description: 'Eco-friendly practices and sustainable growth'
    },
    {
      icon: '👥',
      title: 'Team Work',
      description: 'Collaborating to deliver the best service experience'
    }
  ]

  const timeline = [
    {
      year: '2019',
      title: 'The Beginning',
      description: 'Smart ServiceHub started with a vision to connect customers with verified service professionals. We began with just 3 services in Mumbai.',
      achievements: ['Launched in Mumbai', '50+ service partners', '1000+ customers served']
    },
    {
      year: '2020',
      title: 'Rapid Growth',
      description: 'Despite challenges, we expanded to 5 major cities and introduced 2 new service categories. Our customer base grew 5x.',
      achievements: ['Expanded to Delhi & Bangalore', 'Added cleaning & pest control', 'Mobile app launch']
    },
    {
      year: '2021',
      title: 'Technology Innovation',
      description: 'Introduced AI-powered matching, real-time tracking, and enhanced safety features. Became the most trusted service platform.',
      achievements: ['AI matching system', 'Real-time tracking', 'Safety verification program']
    },
    {
      year: '2022',
      title: 'National Expansion',
      description: 'Expanded to 15+ cities across India, introduced corporate services, and achieved 50K+ satisfied customers.',
      achievements: ['15+ cities coverage', 'Corporate services', '50K+ customers milestone']
    },
    {
      year: '2023',
      title: 'Service Excellence',
      description: 'Launched premium services, introduced 24/7 emergency support, and achieved 4.8★ average rating.',
      achievements: ['Premium services launch', '24/7 emergency support', '4.8★ rating achievement']
    },
    {
      year: '2024',
      title: 'Future Ready',
      description: 'Continuing to innovate with smart home integration, sustainable practices, and expanding our service network.',
      achievements: ['Smart home integration', 'Eco-friendly initiatives', '500+ professionals network']
    }
  ]

  const team = [
    {
      name: 'Rahul Sharma',
      position: 'CEO & Founder',
      image: '👨‍💼',
      description: 'Visionary leader with 15+ years in service industry',
      linkedin: '#'
    },
    {
      name: 'Priya Patel',
      position: 'COO',
      image: '👩‍💼',
      description: 'Operations expert ensuring service excellence',
      linkedin: '#'
    },
    {
      name: 'Amit Kumar',
      position: 'CTO',
      image: '👨‍💻',
      description: 'Tech innovator driving digital transformation',
      linkedin: '#'
    },
    {
      name: 'Neha Gupta',
      position: 'Head of Customer Experience',
      image: '👩‍🎓',
      description: 'Customer satisfaction champion',
      linkedin: '#'
    }
  ]

  const partners = [
    { name: 'Asian Paints', logo: '🎨', type: 'Painting Partner' },
    { name: 'Daikin', logo: '❄️', type: 'AC Service Partner' },
    { name: 'Godrej', logo: '🔒', type: 'Security Partner' },
    { name: 'Hindware', logo: '🚿', type: 'Plumbing Partner' },
    { name: 'Philips', logo: '💡', type: 'Electrical Partner' },
    { name: '3M', logo: '🧪', type: 'Chemical Partner' }
  ]

  const awards = [
    { name: 'Best Service Platform 2023', organization: 'Tech India Awards', icon: '🏆' },
    { name: 'Customer Choice Award', organization: 'Service Excellence Forum', icon: '⭐' },
    { name: 'Innovation in Service', organization: 'Digital India Summit', icon: '💡' },
    { name: 'Fastest Growing Startup', organization: 'Startup India', icon: '🚀' }
  ]

  const toggleTimeline = (index: number) => {
    setExpandedTimeline(expandedTimeline === index ? null : index)
  }

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About Smart ServiceHub</h1>
          <p className="hero-subtitle">Your trusted partner for home and business services</p>
          <p className="hero-description">
            We're on a mission to make quality services accessible to everyone. 
            From a small startup to India's most trusted service platform, we've come 
            a long way while staying true to our values.
          </p>
          
          {/* Stats */}
          <div className="hero-stats">
            {companyStats.map((stat, index) => (
              <div key={index} className="hero-stat">
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section">
        <div className="container">
          <h2>Our Purpose</h2>
          <div className="tabs-container">
            <div className="tab-buttons">
              <button 
                className={`tab-btn ${activeTab === 'mission' ? 'active' : ''}`}
                onClick={() => setActiveTab('mission')}
              >
                🎯 Mission
              </button>
              <button 
                className={`tab-btn ${activeTab === 'vision' ? 'active' : ''}`}
                onClick={() => setActiveTab('vision')}
              >
                👁️ Vision
              </button>
              <button 
                className={`tab-btn ${activeTab === 'story' ? 'active' : ''}`}
                onClick={() => setActiveTab('story')}
              >
                📖 Our Story
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'mission' && (
                <div className="tab-panel">
                  <h3>Our Mission</h3>
                  <p>
                    To connect customers with verified, professional service providers while 
                    ensuring quality, transparency, and convenience. We're committed to making 
                    home and business services accessible, affordable, and reliable for everyone.
                  </p>
                  <div className="mission-points">
                    <div className="point">
                      <span className="point-icon">✅</span>
                      <span>Verified professionals only</span>
                    </div>
                    <div className="point">
                      <span className="point-icon">✅</span>
                      <span>Transparent pricing</span>
                    </div>
                    <div className="point">
                      <span className="point-icon">✅</span>
                      <span>Quality guarantee</span>
                    </div>
                    <div className="point">
                      <span className="point-icon">✅</span>
                      <span>24/7 customer support</span>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'vision' && (
                <div className="tab-panel">
                  <h3>Our Vision</h3>
                  <p>
                    To become India's most trusted and comprehensive service platform, 
                    revolutionizing how people access and experience home and business services 
                    through technology, innovation, and exceptional customer experience.
                  </p>
                  <div className="vision-points">
                    <div className="point">
                      <span className="point-icon">🌟</span>
                      <span>Pan-India service coverage</span>
                    </div>
                    <div className="point">
                      <span className="point-icon">🌟</span>
                      <span>AI-powered service matching</span>
                    </div>
                    <div className="point">
                      <span className="point-icon">🌟</span>
                      <span>Smart home integration</span>
                    </div>
                    <div className="point">
                      <span className="point-icon">🌟</span>
                      <span>Sustainable service practices</span>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'story' && (
                <div className="tab-panel">
                  <h3>Our Story</h3>
                  <p>
                    Smart ServiceHub was born from a simple frustration: finding reliable service 
                    professionals was difficult, time-consuming, and often disappointing. Our founder 
                    experienced this firsthand and decided to create a solution.
                  </p>
                  <p>
                    What started as a small platform connecting 50 professionals in Mumbai has now 
                    grown into a nationwide network of 500+ verified professionals serving 50,000+ 
                    happy customers across 15+ cities.
                  </p>
                  <div className="story-highlights">
                    <div className="highlight">
                      <span className="highlight-number">2019</span>
                      <span className="highlight-text">Started with 3 services</span>
                    </div>
                    <div className="highlight">
                      <span className="highlight-number">2021</span>
                      <span className="highlight-text">Launched mobile app</span>
                    </div>
                    <div className="highlight">
                      <span className="highlight-number">2023</span>
                      <span className="highlight-text">50K+ customers milestone</span>
                    </div>
                    <div className="highlight">
                      <span className="highlight-number">2024</span>
                      <span className="highlight-text">15+ cities coverage</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="values-section">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline-section">
        <div className="container">
          <h2>Our Journey</h2>
          <div className="timeline">
            {timeline.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <div className="timeline-year">{item.year}</div>
                </div>
                <div className="timeline-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  
                  {expandedTimeline === index && (
                    <div className="timeline-achievements">
                      <h4>Key Achievements:</h4>
                      <ul>
                        {item.achievements.map((achievement, achIndex) => (
                          <li key={achIndex}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <button 
                    className="timeline-toggle"
                    onClick={() => toggleTimeline(index)}
                  >
                    {expandedTimeline === index ? 'Show Less' : 'Learn More'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="team-section">
        <div className="container">
          <h2>Leadership Team</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image">{member.image}</div>
                <h3>{member.name}</h3>
                <p className="team-position">{member.position}</p>
                <p className="team-description">{member.description}</p>
                <a href={member.linkedin} className="team-linkedin">LinkedIn</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="partners-section">
        <div className="container">
          <h2>Our Trusted Partners</h2>
          <div className="partners-grid">
            {partners.map((partner, index) => (
              <div key={index} className="partner-card">
                <div className="partner-logo">{partner.logo}</div>
                <h3>{partner.name}</h3>
                <p>{partner.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="awards-section">
        <div className="container">
          <h2>Awards & Recognition</h2>
          <div className="awards-grid">
            {awards.map((award, index) => (
              <div key={index} className="award-card">
                <div className="award-icon">{award.icon}</div>
                <h3>{award.name}</h3>
                <p>{award.organization}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="technology-section">
        <div className="container">
          <h2>Technology & Innovation</h2>
          <div className="tech-content">
            <div className="tech-text">
              <h3>Smart Service Technology</h3>
              <p>
                We leverage cutting-edge technology to enhance service delivery and customer experience:
              </p>
              <ul className="tech-features">
                <li>🤖 AI-powered professional matching</li>
                <li>📱 Real-time service tracking</li>
                <li>🔐 Advanced safety verification</li>
                <li>💳 Secure payment processing</li>
                <li>📊 Data-driven quality monitoring</li>
                <li>🌐 Multi-platform accessibility</li>
              </ul>
            </div>
            <div className="tech-stats">
              <div className="tech-stat">
                <span className="tech-number">99.9%</span>
                <span className="tech-label">Platform Uptime</span>
              </div>
              <div className="tech-stat">
                <span className="tech-number">&lt; 1min</span>
                <span className="tech-label">Average Response</span>
              </div>
              <div className="tech-stat">
                <span className="tech-number">256-bit</span>
                <span className="tech-label">Data Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact */}
      <section className="impact-section">
        <div className="container">
          <h2>Social Impact</h2>
          <div className="impact-content">
            <div className="impact-text">
              <h3>Making a Difference</h3>
              <p>
                We're committed to creating positive impact beyond just providing services:
              </p>
              <div className="impact-initiatives">
                <div className="initiative">
                  <span className="initiative-icon">🌱</span>
                  <h4>Eco-Friendly Practices</h4>
                  <p>Promoting sustainable and environmentally responsible service practices</p>
                </div>
                <div className="initiative">
                  <span className="initiative-icon">👥</span>
                  <h4>Empowering Professionals</h4>
                  <p>Training and empowering 500+ service professionals across India</p>
                </div>
                <div className="initiative">
                  <span className="initiative-icon">🏠</span>
                  <h4>Community Support</h4>
                  <p>Providing discounted services to underprivileged communities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Join Our Journey</h2>
            <p>Be part of India's most trusted service platform</p>
            <div className="cta-actions">
              <Link to="/company/careers" className="btn-primary">Join Our Team</Link>
              <Link to="/company/partners" className="btn-secondary">Partner With Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
