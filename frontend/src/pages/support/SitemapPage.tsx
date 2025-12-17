import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AdvancedPages.css'

export default function SitemapPage() {
  const sitemapSections = [
    {
      title: 'Main Pages',
      icon: '🏠',
      links: [
        { name: 'Home', url: '/', description: 'Homepage with service overview' },
        { name: 'About Us', url: '/company/about', description: 'Company information and story' },
        { name: 'Services', url: '/services', description: 'All available services' },
        { name: 'Contact', url: '/contact', description: 'Contact information and form' },
        { name: 'Blog', url: '/company/blog', description: 'Latest articles and tips' }
      ]
    },
    {
      title: 'Service Pages',
      icon: '🔧',
      links: [
        { name: 'Plumbing Services', url: '/services/plumbing', description: 'Professional plumbing solutions' },
        { name: 'Electrical Services', url: '/services/electrical', description: 'Electrical repair and installation' },
        { name: 'Cleaning Services', url: '/services/cleaning', description: 'Home and office cleaning' },
        { name: 'Pest Control', url: '/services/pest-control', description: 'Pest control and prevention' },
        { name: 'AC Services', url: '/services/ac-service', description: 'AC repair and maintenance' },
        { name: 'Painting Services', url: '/services/painting', description: 'Professional painting services' }
      ]
    },
    {
      title: 'Company Pages',
      icon: '🏢',
      links: [
        { name: 'About Us', url: '/company/about', description: 'Our company story and mission' },
        { name: 'Careers', url: '/company/careers', description: 'Job opportunities and careers' },
        { name: 'Blog', url: '/company/blog', description: 'Company blog and articles' },
        { name: 'Press', url: '/company/press', description: 'Press releases and media' },
        { name: 'Partners', url: '/company/partners', description: 'Partner with us' }
      ]
    },
    {
      title: 'Support Pages',
      icon: '📞',
      links: [
        { name: 'Help Center', url: '/support/help-center', description: 'Comprehensive help and support' },
        { name: 'FAQ', url: '/support/faq', description: 'Frequently asked questions' },
        { name: 'Terms of Service', url: '/support/terms', description: 'Terms and conditions' },
        { name: 'Privacy Policy', url: '/support/privacy', description: 'Privacy and data protection' },
        { name: 'Refund Policy', url: '/support/refund', description: 'Refund and cancellation policy' },
        { name: 'Sitemap', url: '/support/sitemap', description: 'Site map and navigation' }
      ]
    },
    {
      title: 'User Account',
      icon: '👤',
      links: [
        { name: 'Login', url: '/login', description: 'Sign in to your account' },
        { name: 'Register', url: '/register', description: 'Create a new account' },
        { name: 'My Profile', url: '/profile', description: 'Manage your profile' },
        { name: 'My Bookings', url: '/bookings', description: 'View and manage bookings' },
        { name: 'Payment Methods', url: '/payment-methods', description: 'Manage payment options' },
        { name: 'Settings', url: '/settings', description: 'Account settings and preferences' }
      ]
    },
    {
      title: 'Resources',
      icon: '📚',
      links: [
        { name: 'Service Guide', url: '/resources/service-guide', description: 'Complete service guide' },
        { name: 'Pricing', url: '/resources/pricing', description: 'Service pricing information' },
        { name: 'Service Areas', url: '/resources/areas', description: 'Cities we serve' },
        { name: 'Emergency Services', url: '/resources/emergency', description: '24/7 emergency services' },
        { name: 'Gift Cards', url: '/resources/gift-cards', description: 'Purchase gift cards' },
        { name: 'Mobile Apps', url: '/resources/apps', description: 'Download our mobile apps' }
      ]
    }
  ]

  const quickLinks = [
    { name: 'Book a Service', url: '/services', icon: '📅' },
    { name: 'Emergency Support', url: '/contact', icon: '🚨' },
    { name: 'Track Booking', url: '/track', icon: '📍' },
    { name: 'Customer Support', url: '/support/help-center', icon: '💬' }
  ]

  const footerInfo = {
    company: {
      name: 'Smart ServiceHub',
      address: '123 Business Park, Andheri East, Mumbai - 400001',
      phone: '+91 98765 43210',
      email: 'support@smartservicehub.com'
    },
    services: [
      'Plumbing', 'Electrical', 'Cleaning', 'Pest Control', 'AC Service', 'Painting'
    ],
    cities: [
      'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad'
    ]
  }

  return (
    <div className="sitemap-page">
      {/* Hero Section */}
      <section className="sitemap-hero">
        <div className="hero-content">
          <h1>Sitemap</h1>
          <p className="hero-subtitle">Navigate our website easily</p>
          <p className="hero-description">
            Find all pages and sections of Smart ServiceHub website in one place. 
            This comprehensive sitemap helps you quickly locate the information you need.
          </p>
          
          {/* Quick Search */}
          <div className="sitemap-search">
            <input
              type="text"
              placeholder="Search for pages..."
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links-section">
        <div className="container">
          <h2>Quick Access</h2>
          <div className="quick-links-grid">
            {quickLinks.map((link, index) => (
              <Link key={index} to={link.url} className="quick-link-card">
                <span className="quick-link-icon">{link.icon}</span>
                <h3>{link.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Sitemap */}
      <section className="sitemap-main">
        <div className="container">
          <h2>Complete Site Map</h2>
          
          <div className="sitemap-grid">
            {sitemapSections.map((section, index) => (
              <div key={index} className="sitemap-section">
                <div className="section-header">
                  <span className="section-icon">{section.icon}</span>
                  <h3>{section.title}</h3>
                </div>
                
                <div className="section-links">
                  {section.links.map((link, linkIndex) => (
                    <Link key={linkIndex} to={link.url} className="sitemap-link">
                      <div className="link-content">
                        <h4>{link.name}</h4>
                        <p>{link.description}</p>
                      </div>
                      <span className="link-arrow">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alphabetical Index */}
      <section className="alphabetical-index">
        <div className="container">
          <h2>Alphabetical Index</h2>
          
          <div className="index-grid">
            {['A', 'B', 'C', 'E', 'F', 'H', 'L', 'M', 'P', 'R', 'S', 'T'].map(letter => (
              <div key={letter} className="letter-section">
                <h3 className="letter-title">{letter}</h3>
                <ul className="letter-links">
                  {sitemapSections.flatMap(section => section.links)
                    .filter(link => link.name.toUpperCase().startsWith(letter))
                    .map((link, index) => (
                      <li key={index}>
                        <Link to={link.url}>{link.name}</Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Pages */}
      <section className="popular-pages">
        <div className="container">
          <h2>Popular Pages</h2>
          
          <div className="popular-grid">
            <div className="popular-card">
              <div className="popular-icon">🔧</div>
              <h3>Services</h3>
              <p>Explore all our professional services</p>
              <Link to="/services" className="popular-link">View Services</Link>
            </div>
            
            <div className="popular-card">
              <div className="popular-icon">📞</div>
              <h3>Contact</h3>
              <p>Get in touch with our support team</p>
              <Link to="/contact" className="popular-link">Contact Us</Link>
            </div>
            
            <div className="popular-card">
              <div className="popular-icon">❓</div>
              <h3>FAQ</h3>
              <p>Find answers to common questions</p>
              <Link to="/support/faq" className="popular-link">View FAQ</Link>
            </div>
            
            <div className="popular-card">
              <div className="popular-icon">🏢</div>
              <h3>About Us</h3>
              <p>Learn more about Smart ServiceHub</p>
              <Link to="/company/about" className="popular-link">About Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Site Statistics */}
      <section className="site-stats">
        <div className="container">
          <h2>Site Information</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Total Pages</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">6</div>
              <div className="stat-label">Service Categories</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">15+</div>
              <div className="stat-label">Cities Served</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Service Professionals</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Information */}
      <section className="technical-info">
        <div className="container">
          <h2>Technical Information</h2>
          
          <div className="tech-grid">
            <div className="tech-card">
              <h3>🌐 Website Technology</h3>
              <ul>
                <li>Built with React.js</li>
                <li>Responsive design for all devices</li>
                <li>SSL secured connection</li>
                <li>Fast loading optimization</li>
              </ul>
            </div>
            
            <div className="tech-card">
              <h3>📱 Mobile Applications</h3>
              <ul>
                <li>iOS App (App Store)</li>
                <li>Android App (Google Play)</li>
                <li>Native performance</li>
                <li>Offline booking support</li>
              </ul>
            </div>
            
            <div className="tech-card">
              <h3>🔒 Security Features</h3>
              <ul>
                <li>256-bit encryption</li>
                <li>Secure payment processing</li>
                <li>Data protection compliance</li>
                <li>Regular security audits</li>
              </ul>
            </div>
            
            <div className="tech-card">
              <h3>⚡ Performance</h3>
              <ul>
                <li>CDN optimized content</li>
                <li>Database optimization</li>
                <li>Caching mechanisms</li>
                <li>Real-time updates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="sitemap-contact">
        <div className="container">
          <h2>Need Help Finding Something?</h2>
          
          <div className="contact-grid">
            <div className="contact-card">
              <h3>📞 Call Support</h3>
              <p>Our support team is available to help you navigate our website</p>
              <a href="tel:+919876543210" className="contact-link">+91 98765 43210</a>
            </div>
            
            <div className="contact-card">
              <h3>💬 Live Chat</h3>
              <p>Chat with our support team for immediate assistance</p>
              <button className="contact-link">Start Chat</button>
            </div>
            
            <div className="contact-card">
              <h3>📧 Email Support</h3>
              <p>Send us an email and we'll respond within 24 hours</p>
              <a href="mailto:support@smartservicehub.com" className="contact-link">support@smartservicehub.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Summary */}
      <section className="sitemap-footer">
        <div className="container">
          <div className="footer-summary">
            <div className="company-info">
              <h3>{footerInfo.company.name}</h3>
              <p>{footerInfo.company.address}</p>
              <p>Phone: {footerInfo.company.phone}</p>
              <p>Email: {footerInfo.company.email}</p>
            </div>
            
            <div className="services-summary">
              <h3>Our Services</h3>
              <div className="services-list">
                {footerInfo.services.map((service, index) => (
                  <span key={index} className="service-tag">{service}</span>
                ))}
              </div>
            </div>
            
            <div className="cities-summary">
              <h3>Service Areas</h3>
              <div className="cities-list">
                {footerInfo.cities.map((city, index) => (
                  <span key={index} className="city-tag">{city}</span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="sitemap-note">
            <p>
              This sitemap was last updated on June 15, 2024. For the most current information, 
              please visit the respective pages directly.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
