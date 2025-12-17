import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/AdvancedFooter.css'

export default function Footer() {
  const [spin, setSpin] = useState(false)
  const [email, setEmail] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [visitorCount, setVisitorCount] = useState(15234)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }))
    }
    
    const incrementVisitor = () => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3))
    }
    
    window.addEventListener('scroll', handleScroll)
    updateTime()
    const timeInterval = setInterval(updateTime, 1000)
    const visitorInterval = setInterval(incrementVisitor, 30000)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(timeInterval)
      clearInterval(visitorInterval)
    }
  }, [])
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      // Simulate newsletter subscription
      console.log('Newsletter subscription:', email)
      
      // Show success message
      const successMessage = document.createElement('div')
      successMessage.className = 'newsletter-success'
      successMessage.innerHTML = `
        <div class="success-content">
          <span class="success-icon">🎉</span>
          <div class="success-text">
            <strong>Welcome aboard! 🚀</strong>
            <p>You've successfully subscribed with ${email}</p>
            <p>Check your inbox for exclusive offers!</p>
          </div>
          <button class="success-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
      `
      document.body.appendChild(successMessage)
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (successMessage.parentElement) {
          successMessage.remove()
        }
      }, 5000)
      
      // Clear email input
      setEmail('')
      
      // Add animation to form
      const form = e.currentTarget
      form.classList.add('subscribed')
      setTimeout(() => {
        form.classList.remove('subscribed')
      }, 1000)
    }
  }

  const handleSectionHover = (section: string) => {
    setActiveSection(section)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${isScrolled ? 'visible' : ''}`}
        onClick={scrollToTop}
        title="Back to top"
      >
        <span className="back-to-top-icon">⬆️</span>
      </button>

      <footer className={`footer ${isScrolled ? 'scrolled' : ''}`}>
        {/* Animated Background Pattern */}
        <div className="footer-bg-pattern">
          <div className="pattern-dots"></div>
          <div className="pattern-lines"></div>
          <div className="pattern-gradient"></div>
        </div>

        <div className="footer-container">
          {/* Footer Top */}
          <div className="footer-top">
            {/* Footer Brand Section */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo" onClick={()=>{ setSpin(true); setTimeout(()=>setSpin(false), 1200) }}>
                <div className={`logo-wrapper ${spin ? 'animate' : ''}`}>
                  <div className="logo-icon">
                    <span className="logo-main">🏠</span>
                    <div className="logo-sparkles">
                      <span className="sparkle sparkle-1">✨</span>
                      <span className="sparkle sparkle-2">⭐</span>
                      <span className="sparkle sparkle-3">💫</span>
                    </div>
                  </div>
                  <div className="logo-text">
                    <span className="logo-title">Smart</span>
                    <span className="logo-subtitle">ServiceHub</span>
                  </div>
                </div>
              </Link>
              
              <div className="footer-description">
                <p>🌟 Your trusted service partner for all home and professional needs</p>
                <p>✅ Quality services • ✅ Verified professionals • ✅ Complete satisfaction</p>
              </div>

              <div className="footer-stats">
                <div className="stat-item">
                  <span className="stat-number">50K+</span>
                  <span className="stat-label">Happy Customers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Service Pros</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{visitorCount.toLocaleString()}</span>
                  <span className="stat-label">Visitors Today</span>
                </div>
              </div>

              <div className="social-links">
                <a href="https://facebook.com/SmartServiceHub" target="_blank" rel="noopener noreferrer" className="social-link facebook" title="Facebook">
                  <span className="social-icon">📘</span>
                  <span className="social-tooltip">Facebook</span>
                </a>
                <a href="https://twitter.com/SmartServiceHub" target="_blank" rel="noopener noreferrer" className="social-link twitter" title="Twitter">
                  <span className="social-icon">🐦</span>
                  <span className="social-tooltip">Twitter</span>
                </a>
                <a href="https://instagram.com/SmartServiceHub" target="_blank" rel="noopener noreferrer" className="social-link instagram" title="Instagram">
                  <span className="social-icon">📷</span>
                  <span className="social-tooltip">Instagram</span>
                </a>
                <a href="https://linkedin.com/company/SmartServiceHub" target="_blank" rel="noopener noreferrer" className="social-link linkedin" title="LinkedIn">
                  <span className="social-icon">💼</span>
                  <span className="social-tooltip">LinkedIn</span>
                </a>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="social-link whatsapp" title="WhatsApp">
                  <span className="social-icon">💬</span>
                  <span className="social-tooltip">WhatsApp</span>
                </a>
                <a href="https://youtube.com/SmartServiceHub" target="_blank" rel="noopener noreferrer" className="social-link youtube" title="YouTube">
                  <span className="social-icon">📺</span>
                  <span className="social-tooltip">YouTube</span>
                </a>
              </div>
            </div>

            {/* Services Section */}
            <div className="footer-section" onMouseEnter={() => handleSectionHover('services')}>
              <h3 className="footer-title">
                <span className="title-icon">🔧</span>
                Services
              </h3>
              <ul className="footer-links">
                <li><Link to="/services/plumbing"><span className="link-icon">🔧</span> Plumbing Services</Link></li>
                <li><Link to="/services/electrical"><span className="link-icon">⚡</span> Electrical Work</Link></li>
                <li><Link to="/services/cleaning"><span className="link-icon">🧹</span> Home Cleaning</Link></li>
                <li><Link to="/services/pest-control"><span className="link-icon">🐜</span> Pest Control</Link></li>
                <li><Link to="/services/ac-service"><span className="link-icon">❄️</span> AC Services</Link></li>
                <li><Link to="/services/painting"><span className="link-icon">🎨</span> Painting Work</Link></li>
              </ul>
              <div className="section-badge">Popular</div>
            </div>

            {/* Company Section */}
            <div className="footer-section" onMouseEnter={() => handleSectionHover('company')}>
              <h3 className="footer-title">
                <span className="title-icon">🏢</span>
                Company
              </h3>
              <ul className="footer-links">
                <li><Link to="/company/about"><span className="link-icon">📖</span> About Us</Link></li>
                <li><Link to="/contact"><span className="link-icon">📞</span> Contact Us</Link></li>
                <li><Link to="/company/careers"><span className="link-icon">💼</span> Careers</Link></li>
                <li><Link to="/company/blog"><span className="link-icon">📝</span> Blog</Link></li>
                <li><Link to="/company/press"><span className="link-icon">📰</span> Press Room</Link></li>
                <li><Link to="/company/partners"><span className="link-icon">🤝</span> Partners</Link></li>
              </ul>
            </div>

            {/* Support Section */}
            <div className="footer-section" onMouseEnter={() => handleSectionHover('support')}>
              <h3 className="footer-title">
                <span className="title-icon">💬</span>
                Support
              </h3>
              <ul className="footer-links">
                <li><Link to="/support/help-center"><span className="link-icon">❓</span> Help Center</Link></li>
                <li><Link to="/support/faq"><span className="link-icon">💡</span> FAQ</Link></li>
                <li><Link to="/support/terms"><span className="link-icon">📄</span> Terms of Service</Link></li>
                <li><Link to="/support/privacy"><span className="link-icon">🔒</span> Privacy Policy</Link></li>
                <li><Link to="/support/refund"><span className="link-icon">💰</span> Refund Policy</Link></li>
                <li><Link to="/support/sitemap"><span className="link-icon">🗺️</span> Sitemap</Link></li>
              </ul>
            </div>

            {/* Newsletter Section */}
            <div className="footer-section newsletter-section" onMouseEnter={() => handleSectionHover('newsletter')}>
              <h3 className="footer-title">
                <span className="title-icon">📬</span>
                Stay Connected
              </h3>
              <p className="newsletter-description">
                🎯 Get exclusive offers and service updates<br/>
                🚀 Be the first to know about new services<br/>
                💎 Special discounts for subscribers only
              </p>
              
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <div className="input-wrapper">
                  <input
                    type="email"
                    placeholder="✉️ Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="newsletter-input"
                    required
                  />
                  <span className="input-icon">📧</span>
                </div>
                <button type="submit" className="newsletter-btn">
                  <span className="btn-icon">🚀</span>
                  Subscribe Now
                </button>
              </form>

              <div className="app-download">
                <p>📱 Download our app:</p>
                <div className="app-buttons">
                  <a href="https://apps.apple.com/app/smart-servicehub/id123456789" target="_blank" rel="noopener noreferrer" className="app-btn ios">
                    <span className="app-icon">🍎</span>
                    App Store
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=com.smartservicehub.app" target="_blank" rel="noopener noreferrer" className="app-btn android">
                    <span className="app-icon">🤖</span>
                    Play Store
                  </a>
                </div>
              </div>

              <div className="contact-quick">
                <p>🆘 Need help? Call us:</p>
                <a href="tel:+919876543210" className="phone-link">📞 +91 98765 43210</a>
              </div>
            </div>
          </div>

          {/* Footer Middle - Features Bar */}
          <div className="footer-middle">
            <div className="features-bar">
              <div className="feature-item">
                <span className="feature-icon">🛡️</span>
                <div className="feature-text">
                  <strong>100% Secure</strong>
                  <span>Your data is protected</span>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <div className="feature-text">
                  <strong>Fast Service</strong>
                  <span>Quick response time</span>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💎</span>
                <div className="feature-text">
                  <strong>Best Quality</strong>
                  <span>Premium service guarantee</span>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌟</span>
                <div className="feature-text">
                  <strong>24/7 Support</strong>
                  <span>Always here to help</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              <p>© {new Date().getFullYear()} Smart ServiceHub. All rights reserved BY Blood Badshah.</p>
              <p>🌐 Made with ❤️ for amazing customers like you</p>
              <p>⏰ Current time: {currentTime} | 🌍 Serving India with pride</p>
            </div>
            
            <div className="footer-bottom-links">
              <Link to="/accessibility">♿ Accessibility</Link>
              <Link to="/cookies">🍪 Cookie Policy</Link>
              <Link to="/compliance">⚖️ Compliance</Link>
              <Link to="/sitemap">🗺️ Sitemap</Link>
            </div>
            
            <div className="payment-methods">
              <span className="payment-icon" title="Credit/Debit Cards">💳</span>
              <span className="payment-icon" title="UPI Payments">💰</span>
              <span className="payment-icon" title="Mobile Banking">📱</span>
              <span className="payment-icon" title="Net Banking">🏦</span>
              <span className="payment-icon" title="Cash on Delivery">💵</span>
              <span className="payment-icon" title="Digital Wallets">👛</span>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="float-element float-1">🏠</div>
          <div className="float-element float-2">⭐</div>
          <div className="float-element float-3">💫</div>
          <div className="float-element float-4">✨</div>
        </div>
      </footer>
    </>
  )
}
