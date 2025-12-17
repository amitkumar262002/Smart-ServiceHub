import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AdvancedPages.css'

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const faqCategories = [
    { id: 'all', name: 'All FAQs', icon: '❓' },
    { id: 'general', name: 'General', icon: '🏠' },
    { id: 'booking', name: 'Booking', icon: '📅' },
    { id: 'payment', name: 'Payment', icon: '💳' },
    { id: 'services', name: 'Services', icon: '🔧' },
    { id: 'account', name: 'Account', icon: '👤' },
    { id: 'technical', name: 'Technical', icon: '💻' }
  ]

  const faqs = [
    // General FAQs
    {
      id: 1,
      category: 'general',
      question: 'What is Smart ServiceHub?',
      answer: 'Smart ServiceHub is a comprehensive platform that connects customers with verified professionals for various home and business services. We offer plumbing, electrical, cleaning, pest control, AC service, painting, and appliance repair services across major cities in India.',
      helpful: 234
    },
    {
      id: 2,
      category: 'general',
      question: 'Which cities do you operate in?',
      answer: 'We currently operate in Mumbai, Delhi, Bangalore, Chennai, Pune, Hyderabad, and their surrounding areas. We are continuously expanding to serve more cities across India.',
      helpful: 189
    },
    {
      id: 3,
      category: 'general',
      question: 'How do I know your professionals are reliable?',
      answer: 'All our professionals undergo a rigorous verification process including background checks, police verification, skill assessment, and training. We also monitor customer feedback and ratings to ensure quality service.',
      helpful: 312
    },
    {
      id: 4,
      category: 'general',
      question: 'What are your service hours?',
      answer: 'Our standard service hours are 9 AM to 8 PM, Monday to Saturday, and 10 AM to 6 PM on Sunday. However, we offer 24/7 emergency services for urgent plumbing and electrical issues.',
      helpful: 156
    },

    // Booking FAQs
    {
      id: 5,
      category: 'booking',
      question: 'How do I book a service?',
      answer: 'Booking is easy! You can book through our website, mobile app, or by calling our customer service. Simply select the service you need, choose your preferred time slot, provide your details, and confirm the booking. You\'ll receive a confirmation message with all details.',
      helpful: 445
    },
    {
      id: 6,
      category: 'booking',
      question: 'Can I reschedule or cancel my booking?',
      answer: 'Yes, you can reschedule or cancel your booking up to 2 hours before the scheduled time without any charges. Simply go to My Bookings in your account and select the reschedule or cancel option.',
      helpful: 278
    },
    {
      id: 7,
      category: 'booking',
      question: 'How far in advance should I book?',
      answer: 'For regular services, we recommend booking 24-48 hours in advance to ensure availability. For emergency services, we can typically respond within 30 minutes to 2 hours depending on your location.',
      helpful: 198
    },
    {
      id: 8,
      category: 'booking',
      question: 'What happens after I book a service?',
      answer: 'After booking, you\'ll receive a confirmation with the professional\'s details and estimated arrival time. The professional will call you 30 minutes before arrival. You can track their real-time location through our app.',
      helpful: 234
    },

    // Payment FAQs
    {
      id: 9,
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept multiple payment methods including credit/debit cards, UPI, net banking, and cash on service. All online payments are secured with 256-bit encryption.',
      helpful: 367
    },
    {
      id: 10,
      category: 'payment',
      question: 'How is the pricing determined?',
      answer: 'Pricing varies based on service type, complexity, time required, and materials used. We provide transparent, upfront quotes before starting any work. There are no hidden charges.',
      helpful: 289
    },
    {
      id: 11,
      category: 'payment',
      question: 'Can I get a refund?',
      answer: 'Yes, we offer a 100% satisfaction guarantee. If you\'re not satisfied with the service, you can request a refund within 7 days. We\'ll process the refund within 3-5 business days.',
      helpful: 201
    },
    {
      id: 12,
      category: 'payment',
      question: 'Are there any additional charges?',
      answer: 'The price quoted includes all standard charges. Additional charges may apply for emergency services (₹300 surcharge), weekend services (₹200 surcharge), or if additional work is required beyond the scope of the original booking.',
      helpful: 167
    },

    // Services FAQs
    {
      id: 13,
      category: 'services',
      question: 'Do you provide warranty on services?',
      answer: 'Yes, we provide a 30-day warranty on workmanship and 90-day warranty on replaced parts. If any issues arise during the warranty period, we\'ll fix them free of charge.',
      helpful: 423
    },
    {
      id: 14,
      category: 'services',
      question: 'What if I\'m not satisfied with the service?',
      answer: 'Customer satisfaction is our top priority. If you\'re not satisfied, please contact us immediately within 24 hours. We\'ll either re-do the service free of charge or provide a full refund.',
      helpful: 356
    },
    {
      id: 15,
      category: 'services',
      question: 'Do you use genuine spare parts?',
      answer: 'Yes, we only use genuine, manufacturer-approved spare parts to ensure quality and longevity. All parts come with their own manufacturer warranty.',
      helpful: 234
    },
    {
      id: 16,
      category: 'services',
      question: 'Can I request a specific professional?',
      answer: 'While we try to accommodate requests for specific professionals, it depends on their availability. However, all our professionals are equally qualified and trained to provide excellent service.',
      helpful: 178
    },

    // Account FAQs
    {
      id: 17,
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Creating an account is simple! Click on Sign Up, enter your name, email, phone number, and create a password. You\'ll receive a verification email/SMS to activate your account.',
      helpful: 289
    },
    {
      id: 18,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click on Forgot Password on the login page. Enter your registered email address, and we\'ll send you a password reset link. Follow the instructions to create a new password.',
      helpful: 234
    },
    {
      id: 19,
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Log in to your account and go to Profile section. You can update your name, phone number, address, and other personal information. Don\'t forget to save the changes.',
      helpful: 167
    },
    {
      id: 20,
      category: 'account',
      question: 'Is my personal information secure?',
      answer: 'Yes, we take data security very seriously. All your personal information is encrypted and stored securely. We never share your data with third parties without your consent.',
      helpful: 312
    },

    // Technical FAQs
    {
      id: 21,
      category: 'technical',
      question: 'Is your mobile app available for both iOS and Android?',
      answer: 'Yes, our mobile app is available for both iOS (App Store) and Android (Google Play Store). You can download it for free and enjoy all features.',
      helpful: 245
    },
    {
      id: 22,
      category: 'technical',
      question: 'The app is not working, what should I do?',
      answer: 'Try these steps: 1) Clear app cache, 2) Update to the latest version, 3) Restart your device, 4) Check internet connection. If issues persist, contact our technical support.',
      helpful: 189
    },
    {
      id: 23,
      category: 'technical',
      question: 'I forgot my password and can\'t access email, what do I do?',
      answer: 'Contact our customer support at +91 98765 43210. After verifying your identity, we can help you reset your password through an alternative method.',
      helpful: 134
    },
    {
      id: 24,
      category: 'technical',
      question: 'How do I report a technical issue?',
      answer: 'You can report technical issues through the app\'s Help section, email us at support@smartservicehub.com, or call our technical support team.',
      helpful: 156
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFAQ = (faqId: number) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  const markHelpful = (faqId: number) => {
    console.log('Marked as helpful:', faqId)
    // In a real app, this would make an API call
  }

  const contactOptions = [
    {
      icon: '📞',
      title: 'Call Support',
      description: 'Speak with our support team',
      contact: '+91 98765 43210',
      href: 'tel:+919876543210'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with support agent',
      contact: 'Available 9 AM - 8 PM',
      href: '#chat'
    },
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Send us an email',
      contact: 'support@smartservicehub.com',
      href: 'mailto:support@smartservicehub.com'
    },
    {
      icon: '📱',
      title: 'WhatsApp',
      description: 'Chat on WhatsApp',
      contact: '+91 98765 43210',
      href: 'https://wa.me/919876543210'
    }
  ]

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <section className="faq-hero">
        <div className="hero-content">
          <h1>Frequently Asked Questions</h1>
          <p className="hero-subtitle">Find answers to common questions</p>
          <p className="hero-description">
            Can't find what you're looking for? Our comprehensive FAQ section covers everything 
            from booking services to payments and technical support.
          </p>
          
          {/* Search Bar */}
          <div className="faq-search">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="faq-categories">
        <div className="container">
          <div className="categories-nav">
            {faqCategories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="faq-content">
        <div className="container">
          <div className="faq-grid">
            {/* FAQ List */}
            <div className="faq-list-section">
              <div className="faq-header">
                <h2>Questions & Answers</h2>
                <p className="faq-count">{filteredFAQs.length} FAQs found</p>
              </div>
              
              {filteredFAQs.length === 0 ? (
                <div className="no-faqs">
                  <div className="no-faqs-icon">🔍</div>
                  <h3>No FAQs found</h3>
                  <p>Try adjusting your search or browse different categories</p>
                </div>
              ) : (
                <div className="faq-list">
                  {filteredFAQs.map(faq => (
                    <div key={faq.id} className="faq-item">
                      <button 
                        className="faq-question"
                        onClick={() => toggleFAQ(faq.id)}
                      >
                        <span className="question-text">{faq.question}</span>
                        <span className="question-icon">{expandedFAQ === faq.id ? '−' : '+'}</span>
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                          <div className="faq-actions">
                            <button 
                              className="helpful-btn"
                              onClick={() => markHelpful(faq.id)}
                            >
                              👍 Helpful ({faq.helpful})
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="faq-sidebar">
              {/* Quick Help */}
              <div className="sidebar-section">
                <h3>Still Need Help?</h3>
                <div className="contact-options">
                  {contactOptions.map((option, index) => (
                    <a key={index} href={option.href} className="contact-option">
                      <div className="contact-icon">{option.icon}</div>
                      <div className="contact-details">
                        <h4>{option.title}</h4>
                        <p>{option.description}</p>
                        <span className="contact-info">{option.contact}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Popular FAQs */}
              <div className="sidebar-section">
                <h3>Popular FAQs</h3>
                <div className="popular-faqs">
                  {faqs.filter(faq => faq.helpful > 300).slice(0, 5).map(faq => (
                    <div key={faq.id} className="popular-faq">
                      <button 
                        className="popular-faq-question"
                        onClick={() => toggleFAQ(faq.id)}
                      >
                        {faq.question}
                      </button>
                      <span className="popular-faq-helpful">👍 {faq.helpful}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="sidebar-section">
                <h3>Quick Links</h3>
                <div className="quick-links">
                  <Link to="/help-center" className="quick-link">📚 Help Center</Link>
                  <Link to="/contact" className="quick-link">📞 Contact Support</Link>
                  <Link to="/services" className="quick-link">🔧 Our Services</Link>
                  <Link to="/company/about" className="quick-link">🏢 About Us</Link>
                </div>
              </div>

              {/* Categories Stats */}
              <div className="sidebar-section">
                <h3>FAQ Categories</h3>
                <div className="category-stats">
                  {faqCategories.slice(1).map(category => {
                    const count = faqs.filter(faq => faq.category === category.id).length
                    return (
                      <div key={category.id} className="category-stat">
                        <span className="category-icon">{category.icon}</span>
                        <span className="category-name">{category.name}</span>
                        <span className="category-count">{count} FAQs</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="faq-contact-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Can't Find Your Answer?</h2>
            <p>Our support team is here to help you with any questions</p>
            <div className="cta-actions">
              <a href="tel:+919876543210" className="btn-primary emergency-btn">
                📞 Call Support
              </a>
              <Link to="/contact" className="btn-secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
