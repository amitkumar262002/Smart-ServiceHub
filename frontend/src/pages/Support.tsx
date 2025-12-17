import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Support.css'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
}

interface SupportTicket {
  id: string
  subject: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  createdAt: Date
  updatedAt: Date
  responses: Array<{
    id: string
    message: string
    sender: 'user' | 'support'
    timestamp: Date
  }>
}

interface HelpArticle {
  id: string
  title: string
  category: string
  content: string
  readTime: number
  views: number
  helpful: number
}

export default function Support() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'help' | 'faq' | 'contact' | 'tickets'>('help')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  })
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const faqs: FAQ[] = [
    {
      id: 'faq1',
      question: 'How do I book a service?',
      answer: 'To book a service, navigate to the Book Service page, select your desired service, choose a provider, pick a convenient date and time, and confirm your booking. You can also book directly from the provider\'s profile.',
      category: 'booking',
      helpful: 245
    },
    {
      id: 'faq2',
      question: 'What payment methods are accepted?',
      answer: 'We accept multiple payment methods including cash on service, credit/debit cards, UPI, net banking, and digital wallets. You can choose your preferred payment method during the booking process.',
      category: 'payment',
      helpful: 189
    },
    {
      id: 'faq3',
      question: 'Can I cancel or reschedule my booking?',
      answer: 'Yes, you can cancel or reschedule your booking up to 2 hours before the scheduled time without any charges. Go to My Bookings page, select the booking, and choose the cancel or reschedule option.',
      category: 'booking',
      helpful: 156
    },
    {
      id: 'faq4',
      question: 'How are service providers verified?',
      answer: 'All our service providers go through a rigorous verification process including background checks, skill verification, document verification, and customer reference checks. Only verified providers are listed on our platform.',
      category: 'providers',
      helpful: 203
    },
    {
      id: 'faq5',
      question: 'What if I\'m not satisfied with the service?',
      answer: 'If you\'re not satisfied with the service, you can raise a complaint within 24 hours of service completion. Our support team will investigate the issue and work towards a resolution, which may include refund or rework.',
      category: 'issues',
      helpful: 134
    },
    {
      id: 'faq6',
      question: 'Is there a warranty on services?',
      answer: 'Yes, most services come with a 7-day workmanship warranty. If you face any issues with the service within this period, the provider will fix it free of charge. Specific warranty periods may vary by service type.',
      category: 'warranty',
      helpful: 178
    }
  ]

  const helpArticles: HelpArticle[] = [
    {
      id: 'article1',
      title: 'Getting Started with Our Platform',
      category: 'getting-started',
      content: 'Learn how to navigate our platform, book services, and manage your appointments effectively.',
      readTime: 5,
      views: 1250,
      helpful: 89
    },
    {
      id: 'article2',
      title: 'Understanding Service Categories',
      category: 'services',
      content: 'Detailed guide about different service categories available and what each service includes.',
      readTime: 8,
      views: 890,
      helpful: 76
    },
    {
      id: 'article3',
      title: 'Payment and Billing Guide',
      category: 'payment',
      content: 'Complete guide to payment methods, billing process, invoices, and refund policies.',
      readTime: 6,
      views: 1100,
      helpful: 92
    },
    {
      id: 'article4',
      title: 'Provider Selection Tips',
      category: 'providers',
      content: 'How to choose the right service provider based on ratings, experience, and specialties.',
      readTime: 4,
      views: 750,
      helpful: 68
    },
    {
      id: 'article5',
      title: 'Emergency Services Guide',
      category: 'emergency',
      content: 'What to do in emergency situations and how to access our 24/7 emergency services.',
      readTime: 3,
      views: 1450,
      helpful: 112
    }
  ]

  const categories = [
    { value: 'all', label: 'All Categories', icon: '📚' },
    { value: 'booking', label: 'Booking', icon: '📅' },
    { value: 'payment', label: 'Payment', icon: '💳' },
    { value: 'providers', label: 'Providers', icon: '👨‍🔧' },
    { value: 'issues', label: 'Issues', icon: '⚠️' },
    { value: 'warranty', label: 'Warranty', icon: '🛡️' },
    { value: 'emergency', label: 'Emergency', icon: '🚨' },
    { value: 'getting-started', label: 'Getting Started', icon: '🚀' }
  ]

  const mockTickets: SupportTicket[] = [
    {
      id: 'TK001',
      subject: 'Plumbing service not completed properly',
      description: 'The plumber left without fixing the main issue',
      category: 'service',
      priority: 'high',
      status: 'in_progress',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      responses: [
        {
          id: 'r1',
          message: 'We apologize for the inconvenience. Our team is looking into this matter.',
          sender: 'support',
          timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000)
        }
      ]
    },
    {
      id: 'TK002',
      subject: 'Question about refund policy',
      description: 'I need to understand the refund process for cancelled bookings',
      category: 'billing',
      priority: 'medium',
      status: 'resolved',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      responses: [
        {
          id: 'r2',
          message: 'Refunds are processed within 5-7 business days. You can track the status in your account.',
          sender: 'support',
          timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000)
        }
      ]
    }
  ]

  useEffect(() => {
    setTickets(mockTickets)
  }, [])

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate ticket creation
    setTimeout(() => {
      const newTicket: SupportTicket = {
        id: `TK${String(tickets.length + 1).padStart(3, '0')}`,
        subject: ticketForm.subject,
        description: ticketForm.description,
        category: ticketForm.category,
        priority: ticketForm.priority,
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
        responses: []
      }
      
      setTickets([newTicket, ...tickets])
      setTicketForm({ subject: '', description: '', category: 'general', priority: 'medium' })
      setShowTicketForm(false)
      setLoading(false)
      setActiveTab('tickets')
    }, 1500)
  }

  const handleFAQHelpful = (faqId: string, helpful: boolean) => {
    // Update helpful count (in real app, this would be an API call)
    console.log(`FAQ ${faqId} marked as ${helpful ? 'helpful' : 'not helpful'}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#3b82f6'
      case 'in_progress': return '#f59e0b'
      case 'resolved': return '#10b981'
      case 'closed': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#10b981'
      case 'medium': return '#f59e0b'
      case 'high': return '#ef4444'
      case 'urgent': return '#dc2626'
      default: return '#6b7280'
    }
  }

  return (
    <div className="support">
      {/* Header */}
      <div className="support-header">
        <div className="header-content">
          <h1>Help & Support Center</h1>
          <p>We're here to help you with any questions or issues</p>
        </div>
        <div className="emergency-contact">
          <div className="emergency-info">
            <span className="emergency-icon">🚨</span>
            <div className="emergency-details">
              <h3>Emergency Support</h3>
              <p>24/7 Hotline: 1-800-URGENT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles, FAQs, or topics..."
              className="search-input"
            />
          </div>
          
          {/* Quick Categories */}
          <div className="quick-categories">
            {categories.slice(1, 5).map(category => (
              <button
                key={category.value}
                className={`category-chip ${selectedCategory === category.value ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.value)}
              >
                <span className="category-icon">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <div className="tabs-container">
          {[
            { id: 'help', label: 'Help Articles', icon: '📚' },
            { id: 'faq', label: 'FAQs', icon: '❓' },
            { id: 'tickets', label: 'My Tickets', icon: '🎫' },
            { id: 'contact', label: 'Contact Support', icon: '💬' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="support-content">
        {/* Help Articles Tab */}
        {activeTab === 'help' && (
          <div className="help-articles">
            <div className="articles-header">
              <h2>Help Articles</h2>
              <p>Browse our comprehensive help guides</p>
            </div>
            
            <div className="articles-grid">
              {filteredArticles.map(article => (
                <div key={article.id} className="article-card">
                  <div className="article-header">
                    <h3>{article.title}</h3>
                    <div className="article-meta">
                      <span className="read-time">📖 {article.readTime} min read</span>
                      <span className="views">👁️ {article.views} views</span>
                    </div>
                  </div>
                  
                  <p className="article-excerpt">{article.content}</p>
                  
                  <div className="article-footer">
                    <div className="article-stats">
                      <span className="helpful-count">👍 {article.helpful} found helpful</span>
                    </div>
                    <button className="read-more-btn">Read More →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="faq-section">
            <div className="faq-header">
              <h2>Frequently Asked Questions</h2>
              <p>Find quick answers to common questions</p>
            </div>
            
            <div className="faq-list">
              {filteredFAQs.map(faq => (
                <div key={faq.id} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  >
                    <span className="question-text">{faq.question}</span>
                    <span className={`expand-icon ${expandedFAQ === faq.id ? 'expanded' : ''}`}>▼</span>
                  </button>
                  
                  {expandedFAQ === faq.id && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                      <div className="faq-actions">
                        <span className="helpful-text">Was this helpful?</span>
                        <div className="helpful-buttons">
                          <button 
                            className="helpful-btn yes"
                            onClick={() => handleFAQHelpful(faq.id, true)}
                          >
                            👍 Yes ({faq.helpful})
                          </button>
                          <button 
                            className="helpful-btn no"
                            onClick={() => handleFAQHelpful(faq.id, false)}
                          >
                            👎 No
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="tickets-section">
            <div className="tickets-header">
              <h2>My Support Tickets</h2>
              <button 
                className="create-ticket-btn"
                onClick={() => setShowTicketForm(true)}
              >
                + Create New Ticket
              </button>
            </div>
            
            {showTicketForm && (
              <div className="ticket-form-modal">
                <div className="modal-overlay" onClick={() => setShowTicketForm(false)}></div>
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>Create Support Ticket</h3>
                    <button className="close-btn" onClick={() => setShowTicketForm(false)}>×</button>
                  </div>
                  
                  <form onSubmit={handleTicketSubmit} className="ticket-form">
                    <div className="form-group">
                      <label>Subject</label>
                      <input
                        type="text"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                      >
                        <option value="general">General</option>
                        <option value="booking">Booking Issue</option>
                        <option value="payment">Payment Issue</option>
                        <option value="service">Service Issue</option>
                        <option value="billing">Billing Issue</option>
                        <option value="technical">Technical Issue</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Priority</label>
                      <div className="priority-options">
                        {[
                          { value: 'low', label: 'Low', color: '#10b981' },
                          { value: 'medium', label: 'Medium', color: '#f59e0b' },
                          { value: 'high', label: 'High', color: '#ef4444' },
                          { value: 'urgent', label: 'Urgent', color: '#dc2626' }
                        ].map(priority => (
                          <label key={priority.value} className="priority-option">
                            <input
                              type="radio"
                              name="priority"
                              value={priority.value}
                              checked={ticketForm.priority === priority.value}
                              onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value as any})}
                            />
                            <span className="priority-dot" style={{ backgroundColor: priority.color }}></span>
                            <span>{priority.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                        placeholder="Please provide detailed information about your issue..."
                        rows={5}
                        required
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button type="button" className="cancel-btn" onClick={() => setShowTicketForm(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Ticket'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            <div className="tickets-list">
              {tickets.map(ticket => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-header">
                    <div className="ticket-info">
                      <h3>{ticket.subject}</h3>
                      <div className="ticket-meta">
                        <span className="ticket-id">#{ticket.id}</span>
                        <span className="ticket-category">{ticket.category}</span>
                        <span 
                          className="ticket-status"
                          style={{ backgroundColor: getStatusColor(ticket.status) }}
                        >
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span 
                          className="ticket-priority"
                          style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                    <div className="ticket-dates">
                      <div className="date-item">
                        <span className="date-label">Created:</span>
                        <span className="date-value">{ticket.createdAt.toLocaleDateString()}</span>
                      </div>
                      <div className="date-item">
                        <span className="date-label">Updated:</span>
                        <span className="date-value">{ticket.updatedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="ticket-description">{ticket.description}</p>
                  
                  {ticket.responses.length > 0 && (
                    <div className="ticket-responses">
                      <h4>Responses ({ticket.responses.length})</h4>
                      <div className="response-list">
                        {ticket.responses.map(response => (
                          <div key={response.id} className={`response ${response.sender}`}>
                            <div className="response-header">
                              <span className="sender-name">
                                {response.sender === 'support' ? 'Support Team' : 'You'}
                              </span>
                              <span className="response-time">
                                {response.timestamp.toLocaleString()}
                              </span>
                            </div>
                            <p className="response-message">{response.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="ticket-actions">
                    <button className="reply-btn">Reply</button>
                    <button className="close-ticket-btn">Close Ticket</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Support Tab */}
        {activeTab === 'contact' && (
          <div className="contact-section">
            <div className="contact-header">
              <h2>Contact Support</h2>
              <p>Get in touch with our support team</p>
            </div>
            
            <div className="contact-options">
              <div className="contact-card primary">
                <div className="contact-icon">💬</div>
                <h3>Live Chat</h3>
                <p>Chat with our support team in real-time</p>
                <div className="contact-status">
                  <span className="status-dot online"></span>
                  <span>Available now</span>
                </div>
                <button className="contact-btn">Start Chat</button>
              </div>
              
              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <h3>Phone Support</h3>
                <p>Call us for immediate assistance</p>
                <div className="contact-info">
                  <span className="phone-number">1-800-SUPPORT</span>
                  <span className="working-hours">Mon-Fri: 9 AM - 9 PM</span>
                </div>
                <button className="contact-btn">Call Now</button>
              </div>
              
              <div className="contact-card">
                <div className="contact-icon">📧</div>
                <h3>Email Support</h3>
                <p>Send us an email and we'll respond within 24 hours</p>
                <div className="contact-info">
                  <span className="email-address">support@example.com</span>
                  <span className="response-time">Response within 24 hours</span>
                </div>
                <button className="contact-btn">Send Email</button>
              </div>
              
              <div className="contact-card emergency">
                <div className="contact-icon">🚨</div>
                <h3>Emergency Hotline</h3>
                <p>For urgent issues requiring immediate attention</p>
                <div className="contact-info">
                  <span className="phone-number">1-800-URGENT</span>
                  <span className="availability">24/7 Available</span>
                </div>
                <button className="contact-btn emergency">Call Emergency</button>
              </div>
            </div>
            
            <div className="support-hours">
              <h3>Support Hours</h3>
              <div className="hours-grid">
                <div className="hours-item">
                  <span className="day">Monday - Friday</span>
                  <span className="time">9:00 AM - 9:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="day">Saturday</span>
                  <span className="time">10:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="day">Sunday</span>
                  <span className="time">10:00 AM - 4:00 PM</span>
                </div>
                <div className="hours-item emergency">
                  <span className="day">Emergency Services</span>
                  <span className="time">24/7 Available</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
