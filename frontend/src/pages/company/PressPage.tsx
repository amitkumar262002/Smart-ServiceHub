import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AdvancedPages.css'

export default function PressPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedRelease, setExpandedRelease] = useState<number | null>(null)

  const pressCategories = [
    { id: 'all', name: 'All News', icon: '📰' },
    { id: 'company', name: 'Company News', icon: '🏢' },
    { id: 'product', name: 'Product Updates', icon: '🚀' },
    { id: 'awards', name: 'Awards', icon: '🏆' },
    { id: 'partnership', name: 'Partnerships', icon: '🤝' },
    { id: 'events', name: 'Events', icon: '📅' }
  ]

  const pressReleases = [
    {
      id: 1,
      date: '2024-06-10',
      category: 'company',
      title: 'Smart ServiceHub Achieves 50,000+ Customers Milestone',
      summary: 'Leading service platform celebrates major customer growth milestone with 4.8★ average rating.',
      content: 'Smart ServiceHub, India\'s trusted home and business services platform, today announced it has successfully served over 50,000 customers across 15+ cities. This achievement comes just 5 years after the company\'s founding and reflects the growing trust in their quality services.',
      quote: 'This milestone is a testament to our commitment to quality service and customer satisfaction. We\'re grateful to our customers and service professionals who made this possible.',
      quoteAuthor: 'Rahul Sharma, CEO',
      mediaContact: 'press@smartservicehub.com',
      featured: true
    },
    {
      id: 2,
      date: '2024-05-15',
      category: 'product',
      title: 'Launch of AI-Powered Service Matching System',
      summary: 'New AI technology enhances customer experience by matching with the perfect service professional in seconds.',
      content: 'Smart ServiceHub has launched its revolutionary AI-powered service matching system that uses machine learning algorithms to connect customers with the most suitable service professionals based on expertise, location, availability, and customer reviews.',
      quote: 'Our new AI system ensures customers get the right professional for their needs, improving satisfaction and reducing service time by 40%.',
      quoteAuthor: 'Amit Kumar, CTO',
      mediaContact: 'press@smartservicehub.com',
      featured: true
    },
    {
      id: 3,
      date: '2024-04-20',
      category: 'partnership',
      title: 'Strategic Partnership with Asian Paints for Premium Painting Services',
      summary: 'Collaboration brings certified painting professionals and premium paint products to customers.',
      content: 'Smart ServiceHub has announced a strategic partnership with Asian Paints, India\'s leading paint company. This collaboration ensures customers get access to certified painting professionals who use genuine Asian Paints products with warranty protection.',
      quote: 'This partnership elevates our painting service quality and gives customers peace of mind with genuine products and professional service.',
      quoteAuthor: 'Priya Patel, COO',
      mediaContact: 'press@smartservicehub.com',
      featured: false
    },
    {
      id: 4,
      date: '2024-03-10',
      category: 'awards',
      title: 'Wins "Best Service Platform 2023" at Tech India Awards',
      summary: 'Recognized for excellence in service delivery and technological innovation.',
      content: 'Smart ServiceHub has been honored with the "Best Service Platform 2023" award at the prestigious Tech India Awards. The recognition highlights the company\'s innovative approach to connecting customers with verified service professionals.',
      quote: 'This award validates our mission to revolutionize the service industry through technology and customer-centric approach.',
      quoteAuthor: 'Rahul Sharma, CEO',
      mediaContact: 'press@smartservicehub.com',
      featured: false
    },
    {
      id: 5,
      date: '2024-02-01',
      category: 'events',
      title: 'Smart ServiceHub to Sponsor Service Excellence Summit 2024',
      summary: 'Company to showcase innovation and network with industry leaders at major industry event.',
      content: 'Smart ServiceHub will be the title sponsor for the Service Excellence Summit 2024, bringing together service industry leaders, innovators, and policymakers. The company will demonstrate its latest technology and share insights on the future of service delivery.',
      quote: 'We\'re excited to sponsor this summit and contribute to the conversation about service industry innovation and excellence.',
      quoteAuthor: 'Neha Gupta, Head of Marketing',
      mediaContact: 'press@smartservicehub.com',
      featured: false
    },
    {
      id: 6,
      date: '2024-01-15',
      category: 'company',
      title: 'Expansion to 5 New Cities in Southern India',
      summary: 'Platform now available in Bangalore, Chennai, Hyderabad, Coimbatore, and Kochi.',
      content: 'Smart ServiceHub has expanded its services to 5 new cities in Southern India, bringing its trusted home and business services to more customers. The expansion includes over 100 verified service professionals in the region.',
      quote: 'Southern India is a key market for us. We\'re committed to bringing our quality services to more cities across the country.',
      quoteAuthor: 'Priya Patel, COO',
      mediaContact: 'press@smartservicehub.com',
      featured: false
    }
  ]

  const mediaKit = [
    {
      title: 'Company Logo',
      description: 'Official Smart ServiceHub logos in various formats',
      download: '#logo'
    },
    {
      title: 'Brand Guidelines',
      description: 'Complete brand style guide and usage guidelines',
      download: '#brand'
    },
    {
      title: 'Executive Photos',
      description: 'High-resolution photos of leadership team',
      download: '#photos'
    },
    {
      title: 'Company Fact Sheet',
      description: 'Key facts, figures, and company information',
      download: '#factsheet'
    },
    {
      title: 'Product Screenshots',
      description: 'App screenshots and product images',
      download: '#screenshots'
    },
    {
      title: 'B-roll Videos',
      description: 'Company videos and service demonstrations',
      download: '#videos'
    }
  ]

  const mediaCoverage = [
    {
      outlet: 'Economic Times',
      date: '2024-06-05',
      title: 'How Smart ServiceHub is Revolutionizing Home Services in India',
      link: '#economic-times'
    },
    {
      outlet: 'TechCrunch India',
      date: '2024-05-20',
      title: 'AI-Powered Service Matching: The Future of Home Services',
      link: '#techcrunch'
    },
    {
      outlet: 'YourStory',
      date: '2024-04-15',
      title: 'From Startup to Market Leader: Smart ServiceHub Journey',
      link: '#yourstory'
    },
    {
      outlet: 'Business Standard',
      date: '2024-03-25',
      title: 'Service Tech Companies Poised for Growth in Post-Pandemic India',
      link: '#business-standard'
    }
  ]

  const upcomingEvents = [
    {
      name: 'Service Excellence Summit 2024',
      date: 'July 15-17, 2024',
      location: 'Bengaluru',
      type: 'Sponsor & Speaker'
    },
    {
      name: 'Tech Startup Expo',
      date: 'August 20-21, 2024',
      location: 'Mumbai',
      type: 'Exhibitor'
    },
    {
      name: 'India Service Industry Conference',
      date: 'September 10, 2024',
      location: 'Delhi',
      type: 'Speaker'
    }
  ]

  const filteredReleases = pressReleases.filter(release => {
    return selectedCategory === 'all' || release.category === selectedCategory
  })

  const toggleRelease = (id: number) => {
    setExpandedRelease(expandedRelease === id ? null : id)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="press-page">
      {/* Hero Section */}
      <section className="press-hero">
        <div className="hero-content">
          <h1>Press & Media</h1>
          <p className="hero-subtitle">News, updates, and media resources</p>
          <p className="hero-description">
            Welcome to the Smart ServiceHub press room. Find the latest news, press releases, 
            media resources, and company information for journalists and media professionals.
          </p>
          
          {/* Quick Stats */}
          <div className="press-stats">
            <div className="press-stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Customers Served</span>
            </div>
            <div className="press-stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Service Professionals</span>
            </div>
            <div className="press-stat">
              <span className="stat-number">15+</span>
              <span className="stat-label">Cities Covered</span>
            </div>
            <div className="press-stat">
              <span className="stat-number">4.8★</span>
              <span className="stat-label">Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="media-contact-section">
        <div className="container">
          <div className="media-contact-card">
            <h2>Media Inquiries</h2>
            <p>For press inquiries, interviews, or media resources, please contact:</p>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <strong>Email:</strong>
                  <a href="mailto:press@smartservicehub.com">press@smartservicehub.com</a>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <strong>Phone:</strong>
                  <a href="tel:+919876543200">+91 98765 43200</a>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <strong>Address:</strong>
                  123 Business Park, Andheri East, Mumbai - 400001
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="press-releases-section">
        <div className="container">
          <h2>Press Releases</h2>
          
          {/* Category Filter */}
          <div className="category-filter">
            {pressCategories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Press Releases List */}
          <div className="press-releases-list">
            {filteredReleases.map(release => (
              <article key={release.id} className={`press-release ${release.featured ? 'featured' : ''}`}>
                {release.featured && <div className="featured-badge">⭐ Featured</div>}
                
                <div className="release-header">
                  <div className="release-meta">
                    <span className="release-date">{formatDate(release.date)}</span>
                    <span className="release-category">
                      {pressCategories.find(c => c.id === release.category)?.icon} 
                      {pressCategories.find(c => c.id === release.category)?.name}
                    </span>
                  </div>
                </div>
                
                <h3 className="release-title">{release.title}</h3>
                <p className="release-summary">{release.summary}</p>
                
                {expandedRelease === release.id && (
                  <div className="release-full-content">
                    <p>{release.content}</p>
                    
                    {release.quote && (
                      <blockquote className="release-quote">
                        <p>"{release.quote}"</p>
                        <cite>— {release.quoteAuthor}</cite>
                      </blockquote>
                    )}
                    
                    <div className="release-contact">
                      <strong>Media Contact:</strong> {release.mediaContact}
                    </div>
                  </div>
                )}
                
                <button 
                  className="read-more-btn"
                  onClick={() => toggleRelease(release.id)}
                >
                  {expandedRelease === release.id ? 'Show Less' : 'Read Full Release'}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="media-coverage-section">
        <div className="container">
          <h2>Media Coverage</h2>
          <div className="media-coverage-grid">
            {mediaCoverage.map((coverage, index) => (
              <article key={index} className="media-coverage-card">
                <div className="coverage-header">
                  <h3 className="outlet-name">{coverage.outlet}</h3>
                  <span className="coverage-date">{coverage.date}</span>
                </div>
                <h4 className="coverage-title">{coverage.title}</h4>
                <a href={coverage.link} className="coverage-link" target="_blank" rel="noopener noreferrer">
                  Read Article →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="media-kit-section">
        <div className="container">
          <h2>Media Kit</h2>
          <p className="section-intro">
            Download official logos, brand guidelines, executive photos, and company resources.
          </p>
          
          <div className="media-kit-grid">
            {mediaKit.map((item, index) => (
              <div key={index} className="media-kit-item">
                <div className="kit-icon">📁</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a href={item.download} className="download-btn">
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="events-section">
        <div className="container">
          <h2>Upcoming Events</h2>
          <div className="events-list">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="event-card">
                <div className="event-date">
                  <div className="date-day">{event.date.split(' ')[1].split(',')[0]}</div>
                  <div className="date-month">{event.date.split(' ')[0]}</div>
                </div>
                <div className="event-details">
                  <h3>{event.name}</h3>
                  <p className="event-location">📍 {event.location}</p>
                  <span className="event-type">{event.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Facts */}
      <section className="company-facts-section">
        <div className="container">
          <h2>Company Facts</h2>
          <div className="facts-grid">
            <div className="fact-card">
              <h3>Company Overview</h3>
              <ul>
                <li>Founded: 2019</li>
                <li>Headquarters: Mumbai, India</li>
                <li>CEO: Rahul Sharma</li>
                <li>Employees: 100+</li>
                <li>Service Categories: 6</li>
              </ul>
            </div>
            
            <div className="fact-card">
              <h3>Services</h3>
              <ul>
                <li>Plumbing Services</li>
                <li>Electrical Services</li>
                <li>Cleaning Services</li>
                <li>Pest Control</li>
                <li>AC Services</li>
                <li>Painting Services</li>
              </ul>
            </div>
            
            <div className="fact-card">
              <h3>Technology Stack</h3>
              <ul>
                <li>AI-Powered Matching</li>
                <li>Real-Time Tracking</li>
                <li>Secure Payments</li>
                <li>Mobile Apps (iOS & Android)</li>
                <li>Cloud Infrastructure</li>
              </ul>
            </div>
            
            <div className="fact-card">
              <h3>Awards & Recognition</h3>
              <ul>
                <li>Best Service Platform 2023</li>
                <li>Customer Choice Award 2023</li>
                <li>Innovation in Service 2022</li>
                <li>Fastest Growing Startup 2021</li>
                <li>Tech Excellence Award 2020</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Need More Information?</h2>
            <p>Our press team is ready to help with your media inquiries</p>
            <div className="cta-actions">
              <a href="mailto:press@smartservicehub.com" className="btn-primary">
                📧 Contact Press Team
              </a>
              <Link to="/contact" className="btn-secondary">General Contact</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
