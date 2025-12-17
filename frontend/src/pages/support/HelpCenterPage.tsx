import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AdvancedPages.css'

export default function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: '',
    priority: 'normal'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const helpCategories = [
    {
      id: 'booking',
      name: 'Booking & Appointments',
      icon: '📅',
      description: 'Issues with service bookings, rescheduling, cancellations',
      articles: 15
    },
    {
      id: 'payment',
      name: 'Payment & Billing',
      icon: '💳',
      description: 'Payment methods, refunds, invoices, and billing issues',
      articles: 12
    },
    {
      id: 'services',
      name: 'Service Issues',
      icon: '🔧',
      description: 'Service quality, technician issues, service complaints',
      articles: 18
    },
    {
      id: 'account',
      name: 'Account Management',
      icon: '👤',
      description: 'Profile settings, login issues, account security',
      articles: 10
    },
    {
      id: 'technical',
      name: 'Technical Support',
      icon: '💻',
      description: 'App issues, website problems, technical errors',
      articles: 8
    },
    {
      id: 'general',
      name: 'General Inquiries',
      icon: '❓',
      description: 'General questions, feedback, suggestions',
      articles: 6
    }
  ]

  const helpArticles = [
    {
      id: 1,
      category: 'booking',
      title: 'How to book a service?',
      content: 'Booking a service is easy! Simply browse our services, select what you need, choose your preferred time, and confirm your booking. You\'ll receive a confirmation message with all details.',
      helpful: 245,
      category_name: 'Booking & Appointments'
    },
    {
      id: 2,
      category: 'booking',
      title: 'How to reschedule or cancel my booking?',
      content: 'You can reschedule or cancel your booking up to 2 hours before the scheduled time. Go to My Bookings, select the booking, and choose Reschedule or Cancel option.',
      helpful: 189,
      category_name: 'Booking & Appointments'
    },
    {
      id: 3,
      category: 'payment',
      title: 'What payment methods are accepted?',
      content: 'We accept multiple payment methods including credit/debit cards, UPI, net banking, and cash on service. All transactions are secure and encrypted.',
      helpful: 167,
      category_name: 'Payment & Billing'
    },
    {
      id: 4,
      category: 'payment',
      title: 'How do I get a refund?',
      content: 'If you\'re not satisfied with the service, you can request a refund within 7 days. Go to the service details and click on Request Refund. We\'ll process it within 3-5 business days.',
      helpful: 134,
      category_name: 'Payment & Billing'
    },
    {
      id: 5,
      category: 'services',
      title: 'What if I\'m not satisfied with the service?',
      content: 'We strive for 100% customer satisfaction. If you\'re not happy with the service, please contact us immediately. We\'ll either fix the issue or provide a refund.',
      helpful: 298,
      category_name: 'Service Issues'
    },
    {
      id: 6,
      category: 'services',
      title: 'Are your service professionals verified?',
      content: 'Yes, all our service professionals go through rigorous background verification, skill assessment, and training before joining our platform.',
      helpful: 412,
      category_name: 'Service Issues'
    },
    {
      id: 7,
      category: 'account',
      title: 'How do I reset my password?',
      content: 'Click on Forgot Password on the login page. Enter your email address, and we\'ll send you a password reset link. Follow the instructions to create a new password.',
      helpful: 156,
      category_name: 'Account Management'
    },
    {
      id: 8,
      category: 'account',
      title: 'How do I update my profile information?',
      content: 'Go to My Profile section in the app or website. You can update your name, phone number, address, and other personal information. Save the changes when done.',
      helpful: 98,
      category_name: 'Account Management'
    },
    {
      id: 9,
      category: 'technical',
      title: 'The app is not working, what should I do?',
      content: 'Try these steps: 1) Clear app cache, 2) Update to the latest version, 3) Restart your device, 4) Check internet connection. If issues persist, contact our technical support.',
      helpful: 223,
      category_name: 'Technical Support'
    },
    {
      id: 10,
      category: 'general',
      title: 'How do I contact customer support?',
      content: 'You can reach our customer support through multiple channels: Call us at +91 98765 43210, WhatsApp at +91 98765 43210, email at support@smartservicehub.com, or use the in-app chat support.',
      helpful: 387,
      category_name: 'General Inquiries'
    }
  ]

  const quickActions = [
    {
      icon: '📞',
      title: 'Call Support',
      description: 'Speak with our support team',
      action: 'Call Now',
      href: 'tel:+919876543210'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with support agent',
      action: 'Start Chat',
      href: '#chat'
    },
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Send us an email',
      action: 'Send Email',
      href: 'mailto:support@smartservicehub.com'
    },
    {
      icon: '📱',
      title: 'WhatsApp',
      description: 'Chat on WhatsApp',
      action: 'Chat Now',
      href: 'https://wa.me/919876543210'
    }
  ]

  const filteredArticles = helpArticles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Support ticket submitted:', formData)
      alert('Support ticket submitted successfully! Our team will respond within 24 hours.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: '',
        priority: 'normal'
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

  const toggleArticle = (articleId: number) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId)
  }

  const markHelpful = (articleId: number) => {
    console.log('Marked as helpful:', articleId)
    // In a real app, this would make an API call
  }

  return (
    <div className="help-center-page">
      {/* Hero Section */}
      <section className="help-hero">
        <div className="hero-content">
          <h1>Help Center</h1>
          <p className="hero-subtitle">We're here to help you</p>
          <p className="hero-description">
            Find answers to common questions, get support for your issues, and learn how to make the most of Smart ServiceHub services.
          </p>
          
          {/* Search Bar */}
          <div className="help-search">
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            {quickActions.map((action, index) => (
              <a key={index} href={action.href} className="quick-action">
                <div className="action-icon">{action.icon}</div>
                <div className="action-content">
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                </div>
                <span className="action-link">{action.action}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Browse by Category</h2>
          <div className="categories-grid">
            <button 
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              <span className="category-icon">📚</span>
              <span className="category-name">All Articles</span>
              <span className="article-count">{helpArticles.length} articles</span>
            </button>
            {helpCategories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="article-count">{category.articles} articles</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Help Articles */}
      <section className="articles-section">
        <div className="container">
          <h2>Help Articles</h2>
          {filteredArticles.length === 0 ? (
            <div className="no-articles">
              <div className="no-articles-icon">🔍</div>
              <h3>No articles found</h3>
              <p>Try adjusting your search or browse different categories</p>
            </div>
          ) : (
            <div className="articles-list">
              {filteredArticles.map(article => (
                <div key={article.id} className="article-card">
                  <div className="article-header">
                    <div className="article-category">{article.category_name}</div>
                    <div className="article-helpful">
                      <span className="helpful-count">👍 {article.helpful}</span>
                      <button 
                        className="helpful-btn"
                        onClick={() => markHelpful(article.id)}
                      >
                        Helpful
                      </button>
                    </div>
                  </div>
                  <h3 className="article-title">{article.title}</h3>
                  <div className={`article-content ${expandedArticle === article.id ? 'expanded' : ''}`}>
                    <p>{article.content}</p>
                  </div>
                  <button 
                    className="read-more-btn"
                    onClick={() => toggleArticle(article.id)}
                  >
                    {expandedArticle === article.id ? 'Show Less' : 'Read More'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Support Form */}
      <section className="contact-support-section">
        <div className="container">
          <h2>Still Need Help?</h2>
          <p>Can't find what you're looking for? Contact our support team directly.</p>
          
          <div className="support-grid">
            <div className="support-form">
              <h3>Submit a Support Ticket</h3>
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
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select category</option>
                      {helpCategories.map(category => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief description of your issue"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label>Priority Level</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="normal">Normal - Standard support</option>
                    <option value="high">High - Urgent issue</option>
                    <option value="critical">Critical - Service down</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Please describe your issue in detail..."
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </form>
            </div>

            <div className="support-info">
              <h3>Other Ways to Get Help</h3>
              
              <div className="support-methods">
                <div className="support-method">
                  <div className="method-icon">📞</div>
                  <div className="method-details">
                    <h4>Phone Support</h4>
                    <p>24/7 available for urgent issues</p>
                    <a href="tel:+919876543210" className="method-link">+91 98765 43210</a>
                  </div>
                </div>

                <div className="support-method">
                  <div className="method-icon">💬</div>
                  <div className="method-details">
                    <h4>Live Chat</h4>
                    <p>Chat with our support team</p>
                    <button className="method-link">Start Chat</button>
                  </div>
                </div>

                <div className="support-method">
                  <div className="method-icon">📱</div>
                  <div className="method-details">
                    <h4>WhatsApp Support</h4>
                    <p>Quick support via WhatsApp</p>
                    <a href="https://wa.me/919876543210" className="method-link">Chat Now</a>
                  </div>
                </div>

                <div className="support-method">
                  <div className="method-icon">📧</div>
                  <div className="method-details">
                    <h4>Email Support</h4>
                    <p>Get response within 24 hours</p>
                    <a href="mailto:support@smartservicehub.com" className="method-link">Send Email</a>
                  </div>
                </div>
              </div>

              <div className="response-times">
                <h4>Response Times</h4>
                <ul>
                  <li><strong>Critical Issues:</strong> Within 30 minutes</li>
                  <li><strong>High Priority:</strong> Within 2 hours</li>
                  <li><strong>Normal Priority:</strong> Within 8 hours</li>
                  <li><strong>Low Priority:</strong> Within 24 hours</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="popular-topics-section">
        <div className="container">
          <h2>Popular Topics</h2>
          <div className="topics-grid">
            <div className="topic-card">
              <div className="topic-icon">📱</div>
              <h3>Getting Started</h3>
              <p>Learn how to use Smart ServiceHub</p>
              <button className="topic-btn">View Articles</button>
            </div>
            <div className="topic-card">
              <div className="topic-icon">💰</div>
              <h3>Payment Help</h3>
              <p>Understand payments and refunds</p>
              <button className="topic-btn">View Articles</button>
            </div>
            <div className="topic-card">
              <div className="topic-icon">🔧</div>
              <h3>Service Issues</h3>
              <p>Resolve service-related problems</p>
              <button className="topic-btn">View Articles</button>
            </div>
            <div className="topic-card">
              <div className="topic-icon">👤</div>
              <h3>Account Help</h3>
              <p>Manage your account settings</p>
              <button className="topic-btn">View Articles</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Need Immediate Assistance?</h2>
            <p>Our support team is available 24/7 to help you with any issues</p>
            <div className="cta-actions">
              <a href="tel:+919876543210" className="btn-primary emergency-btn">
                📞 Emergency Support
              </a>
              <a href="https://wa.me/919876543210" className="btn-secondary">
                💬 WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
