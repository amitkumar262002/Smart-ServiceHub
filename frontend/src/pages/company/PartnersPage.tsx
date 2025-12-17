import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AdvancedPages.css'

export default function PartnersPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    category: '',
    message: '',
    partnershipType: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const partnershipCategories = [
    { id: 'all', name: 'All Partners', icon: '🤝' },
    { id: 'service', name: 'Service Partners', icon: '🔧' },
    { id: 'technology', name: 'Technology Partners', icon: '💻' },
    { id: 'material', name: 'Material Suppliers', icon: '📦' },
    { id: 'corporate', name: 'Corporate Clients', icon: '🏢' },
    { id: 'franchise', name: 'Franchise Partners', icon: '📍' }
  ]

  const partners = [
    {
      id: 1,
      name: 'Asian Paints',
      category: 'material',
      logo: '🎨',
      description: 'Leading paint manufacturer providing premium quality paints and coatings',
      benefits: ['Genuine products', 'Warranty support', 'Training programs', 'Marketing support'],
      partnershipType: 'Material Supplier',
      since: '2022'
    },
    {
      id: 2,
      name: 'Daikin India',
      category: 'material',
      logo: '❄️',
      description: 'Premium air conditioning manufacturer with advanced cooling solutions',
      benefits: ['Original parts', 'Technical training', 'Warranty coverage', 'Service support'],
      partnershipType: 'Material Supplier',
      since: '2021'
    },
    {
      id: 3,
      name: 'Godrej Security',
      category: 'service',
      logo: '🔒',
      description: 'Trusted security solutions provider for homes and businesses',
      benefits: ['Verified professionals', 'Quality equipment', '24/7 support', 'Insurance coverage'],
      partnershipType: 'Service Partner',
      since: '2020'
    },
    {
      id: 4,
      name: 'Hindware',
      category: 'material',
      logo: '🚿',
      description: 'Leading bathroom and kitchen fixtures manufacturer',
      benefits: ['Premium products', 'Installation support', 'Warranty services', 'Design consultation'],
      partnershipType: 'Material Supplier',
      since: '2023'
    },
    {
      id: 5,
      name: 'Philips Lighting',
      category: 'material',
      logo: '💡',
      description: 'Innovative lighting solutions for residential and commercial spaces',
      benefits: ['Energy-efficient products', 'Smart lighting', 'Technical support', 'Warranty assurance'],
      partnershipType: 'Material Supplier',
      since: '2021'
    },
    {
      id: 6,
      name: '3M India',
      category: 'material',
      logo: '🧪',
      description: 'Chemical and adhesive solutions for various service applications',
      benefits: ['Industrial-grade chemicals', 'Safety compliance', 'Training programs', 'R&D support'],
      partnershipType: 'Material Supplier',
      since: '2022'
    },
    {
      id: 7,
      name: 'TCS',
      category: 'technology',
      logo: '💻',
      description: 'Technology partner providing cloud infrastructure and AI solutions',
      benefits: ['Cloud services', 'AI integration', 'Data security', '24/7 tech support'],
      partnershipType: 'Technology Partner',
      since: '2020'
    },
    {
      id: 8,
      name: 'Infosys',
      category: 'technology',
      logo: '🖥️',
      description: 'Digital transformation and mobile app development partner',
      benefits: ['App development', 'UX design', 'Quality assurance', 'Maintenance support'],
      partnershipType: 'Technology Partner',
      since: '2021'
    },
    {
      id: 9,
      name: 'Reliance Corporate',
      category: 'corporate',
      logo: '🏢',
      description: 'Corporate client for comprehensive facility management services',
      benefits: ['Long-term contracts', 'Bulk services', 'Priority support', 'Customized solutions'],
      partnershipType: 'Corporate Client',
      since: '2022'
    },
    {
      id: 10,
      name: 'Tata Group',
      category: 'corporate',
      logo: '🏗️',
      description: 'Multi-location corporate facilities maintenance partner',
      benefits: ['Pan-India coverage', 'Standardized quality', 'Dedicated team', 'Performance metrics'],
      partnershipType: 'Corporate Client',
      since: '2023'
    }
  ]

  const partnershipTypes = [
    {
      type: 'service-partner',
      title: 'Service Partners',
      description: 'Join our network of verified service professionals',
      benefits: [
        'Access to 50K+ customers',
        'Flexible work schedule',
        'Professional training',
        'Insurance coverage',
        'Timely payments',
        'Performance bonuses'
      ],
      requirements: [
        'Minimum 3 years experience',
        'Valid certifications',
        'Background verification',
        'Quality service record',
        'Customer references'
      ]
    },
    {
      type: 'material-supplier',
      title: 'Material Suppliers',
      description: 'Supply quality materials and products for our services',
      benefits: [
        'Bulk order opportunities',
        'Long-term contracts',
        'Brand visibility',
        'Quality assurance',
        'Payment security',
        'Growth partnership'
      ],
      requirements: [
        'ISO certified products',
        'Quality assurance process',
        'Supply chain capability',
        'Competitive pricing',
        'After-sales support'
      ]
    },
    {
      type: 'technology-partner',
      title: 'Technology Partners',
      description: 'Collaborate on technology innovation and development',
      benefits: [
        'Co-development opportunities',
        'API integration',
        'Shared IP rights',
        'Joint marketing',
        'Revenue sharing',
        'Innovation labs'
      ],
      requirements: [
        'Technical expertise',
        'Innovation capability',
        'Scalable solutions',
        'Security compliance',
        'Support infrastructure'
      ]
    },
    {
      type: 'corporate-client',
      title: 'Corporate Clients',
      description: 'Comprehensive facility management for businesses',
      benefits: [
        'Customized service packages',
        'Dedicated account manager',
        'Priority service',
        'Cost optimization',
        'Quality reporting',
        'SLA guarantee'
      ],
      requirements: [
        'Minimum 6-month contract',
        'Multiple locations',
        'Regular service needs',
        'Budget approval',
        'Point of contact'
      ]
    },
    {
      type: 'franchise-partner',
      title: 'Franchise Partners',
      description: 'Operate Smart ServiceHub in your city or region',
      benefits: [
        'Established brand',
        'Proven business model',
        'Training & support',
        'Marketing assistance',
        'Technology platform',
        'Shared success'
      ],
      requirements: [
        'Investment capability',
        'Business experience',
        'Local market knowledge',
        'Team management',
        'Infrastructure'
      ]
    }
  ]

  const successStories = [
    {
      name: 'Raj Electrical Services',
      type: 'Service Partner',
      story: 'Joined in 2020, now serving 500+ customers monthly with 4.9★ rating',
      growth: '300% revenue growth'
    },
    {
      name: 'PaintMart Supplies',
      type: 'Material Supplier',
      story: 'Partnered for painting services, now exclusive supplier in 8 cities',
      growth: '250% order volume'
    },
    {
      name: 'TechSolutions Pvt Ltd',
      type: 'Technology Partner',
      story: 'Co-developed AI matching system, now processing 10K+ requests daily',
      growth: 'Strategic partnership'
    }
  ]

  const filteredPartners = partners.filter(partner => {
    return selectedCategory === 'all' || partner.category === selectedCategory
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Partnership inquiry:', formData)
      alert('Partnership inquiry submitted successfully! Our team will contact you within 48 hours.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        category: '',
        message: '',
        partnershipType: ''
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
    <div className="partners-page">
      {/* Hero Section */}
      <section className="partners-hero">
        <div className="hero-content">
          <h1>Partner With Us</h1>
          <p className="hero-subtitle">Build success together</p>
          <p className="hero-description">
            Join our growing ecosystem of service providers, suppliers, and technology partners. 
            Together, we're revolutionizing the service industry and creating opportunities for growth.
          </p>
          
          {/* Partnership Stats */}
          <div className="partnership-stats">
            <div className="partner-stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Service Partners</span>
            </div>
            <div className="partner-stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Material Suppliers</span>
            </div>
            <div className="partner-stat">
              <span className="stat-number">15+</span>
              <span className="stat-label">Tech Partners</span>
            </div>
            <div className="partner-stat">
              <span className="stat-number">100+</span>
              <span className="stat-label">Corporate Clients</span>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="partnership-types-section">
        <div className="container">
          <h2>Partnership Opportunities</h2>
          <div className="partnership-types-grid">
            {partnershipTypes.map((type, index) => (
              <div key={index} className="partnership-type-card">
                <div className="type-header">
                  <h3>{type.title}</h3>
                  <p>{type.description}</p>
                </div>
                
                <div className="type-benefits">
                  <h4>Benefits</h4>
                  <ul>
                    {type.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex}>✅ {benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="type-requirements">
                  <h4>Requirements</h4>
                  <ul>
                    {type.requirements.map((req, reqIndex) => (
                      <li key={reqIndex}>📋 {req}</li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  className="apply-btn"
                  onClick={() => setFormData({...formData, partnershipType: type.type})}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="current-partners-section">
        <div className="container">
          <h2>Our Trusted Partners</h2>
          
          {/* Category Filter */}
          <div className="category-filter">
            {partnershipCategories.map(category => (
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

          {/* Partners Grid */}
          <div className="partners-grid">
            {filteredPartners.map(partner => (
              <div key={partner.id} className="partner-card">
                <div className="partner-header">
                  <div className="partner-logo">{partner.logo}</div>
                  <div className="partner-meta">
                    <span className="partnership-type">{partner.partnershipType}</span>
                    <span className="partnership-since">Partner since {partner.since}</span>
                  </div>
                </div>
                
                <h3>{partner.name}</h3>
                <p>{partner.description}</p>
                
                <div className="partner-benefits">
                  <h4>Partnership Benefits</h4>
                  <div className="benefits-list">
                    {partner.benefits.slice(0, 3).map((benefit, index) => (
                      <span key={index} className="benefit-tag">{benefit}</span>
                    ))}
                    {partner.benefits.length > 3 && (
                      <span className="benefit-more">+{partner.benefits.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="success-stories-section">
        <div className="container">
          <h2>Success Stories</h2>
          <div className="success-stories-grid">
            {successStories.map((story, index) => (
              <div key={index} className="success-story-card">
                <div className="story-header">
                  <h3>{story.name}</h3>
                  <span className="story-type">{story.type}</span>
                </div>
                <p className="story-content">{story.story}</p>
                <div className="story-growth">
                  <span className="growth-icon">📈</span>
                  <span className="growth-text">{story.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Application */}
      <section className="partnership-application-section">
        <div className="container">
          <h2>Apply for Partnership</h2>
          <p className="section-intro">
            Ready to grow with us? Fill out the form below and our partnership team will contact you within 48 hours.
          </p>
          
          <div className="application-grid">
            <div className="application-form">
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
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label>Company Name *</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Partnership Type *</label>
                    <select
                      name="partnershipType"
                      value={formData.partnershipType}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select partnership type</option>
                      {partnershipTypes.map(type => (
                        <option key={type.type} value={type.type}>
                          {type.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Select category</option>
                      <option value="service">Service Provider</option>
                      <option value="material">Material Supplier</option>
                      <option value="technology">Technology</option>
                      <option value="corporate">Corporate</option>
                      <option value="franchise">Franchise</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Tell us about your business *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe your business, experience, and why you want to partner with us..."
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </div>

            <div className="application-info">
              <h3>Partnership Benefits</h3>
              
              <div className="info-card">
                <h4>📈 Growth Opportunities</h4>
                <ul>
                  <li>Access to 50K+ active customers</li>
                  <li>Regular service requests</li>
                  <li>Performance-based rewards</li>
                  <li>Professional development</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>🛡️ Support & Training</h4>
                <ul>
                  <li>Free professional training</li>
                  <li>Quality standards guidance</li>
                  <li>Customer service support</li>
                  <li>Technology platform access</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>💰 Financial Benefits</h4>
                <ul>
                  <li>Competitive commission rates</li>
                  <li>Timely payment processing</li>
                  <li>Performance bonuses</li>
                  <li>Insurance coverage</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>🤝 Partnership Process</h4>
                <ol>
                  <li>Submit application form</li>
                  <li>Initial review (2-3 days)</li>
                  <li>Discussion & evaluation</li>
                  <li>Agreement finalization</li>
                  <li>Onboarding & training</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Partner?</h2>
            <p>Join our growing network and unlock new opportunities for growth</p>
            <div className="cta-actions">
              <a href="tel:+919876543210" className="btn-primary">
                📞 Call Partnership Team
              </a>
              <Link to="/contact" className="btn-secondary">General Inquiry</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
