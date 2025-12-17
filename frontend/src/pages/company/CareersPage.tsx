import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AdvancedPages.css'

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    skills: '',
    coverLetter: '',
    resume: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const jobCategories = [
    {
      id: 'engineering',
      name: 'Engineering',
      icon: '🔧',
      description: 'Software, hardware, and system engineering roles',
      jobs: 12
    },
    {
      id: 'operations',
      name: 'Operations',
      icon: '⚙️',
      description: 'Service delivery, logistics, and quality management',
      jobs: 8
    },
    {
      id: 'sales',
      name: 'Sales & Marketing',
      icon: '📈',
      description: 'Business development, marketing, and customer acquisition',
      jobs: 6
    },
    {
      id: 'support',
      name: 'Customer Support',
      icon: '💬',
      description: 'Customer service, technical support, and success management',
      jobs: 10
    },
    {
      id: 'design',
      name: 'Design',
      icon: '🎨',
      description: 'UI/UX, product design, and creative roles',
      jobs: 4
    },
    {
      id: 'management',
      name: 'Management',
      icon: '👔',
      description: 'Leadership, strategy, and team management roles',
      jobs: 5
    }
  ]

  const openPositions = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Bangalore',
      type: 'Full-time',
      experience: '4-6 years',
      salary: '₹18-25 LPA',
      posted: '2 days ago',
      hot: true,
      description: 'We are looking for an experienced Full Stack Developer to join our engineering team.',
      requirements: [
        'Strong experience with React, Node.js, and TypeScript',
        'Experience with cloud platforms (AWS/Azure)',
        'Knowledge of microservices architecture',
        'Strong problem-solving skills'
      ],
      responsibilities: [
        'Design and develop scalable web applications',
        'Collaborate with cross-functional teams',
        'Write clean, maintainable code',
        'Mentor junior developers'
      ]
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Management',
      location: 'Mumbai',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹15-20 LPA',
      posted: '1 week ago',
      hot: true,
      description: 'Seeking a Product Manager to drive product strategy and execution.',
      requirements: [
        'MBA or equivalent experience',
        'Experience in product management',
        'Strong analytical skills',
        'Excellent communication skills'
      ],
      responsibilities: [
        'Define product roadmap',
        'Work with engineering teams',
        'Analyze market trends',
        'Drive product launches'
      ]
    },
    {
      id: 3,
      title: 'Customer Success Manager',
      department: 'Customer Support',
      location: 'Delhi',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '₹8-12 LPA',
      posted: '3 days ago',
      hot: false,
      description: 'Join our customer success team to ensure customer satisfaction.',
      requirements: [
        'Experience in customer service',
        'Excellent communication skills',
        'Problem-solving abilities',
        'Empathy and patience'
      ],
      responsibilities: [
        'Handle customer inquiries',
        'Resolve service issues',
        'Build customer relationships',
        'Gather customer feedback'
      ]
    },
    {
      id: 4,
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Pune',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '₹10-15 LPA',
      posted: '5 days ago',
      hot: false,
      description: 'Creative designer needed for our product design team.',
      requirements: [
        'Portfolio of design work',
        'Proficiency in design tools',
        'Understanding of user experience',
        'Creative problem-solving'
      ],
      responsibilities: [
        'Create user interfaces',
        'Design user experiences',
        'Conduct user research',
        'Collaborate with developers'
      ]
    },
    {
      id: 5,
      title: 'Sales Executive',
      department: 'Sales & Marketing',
      location: 'Chennai',
      type: 'Full-time',
      experience: '1-3 years',
      salary: '₹6-10 LPA',
      posted: '1 week ago',
      hot: false,
      description: 'Drive sales growth and acquire new customers.',
      requirements: [
        'Sales experience',
        'Strong communication skills',
        'Target-driven mindset',
        'Relationship building'
      ],
      responsibilities: [
        'Generate leads',
        'Convert prospects to customers',
        'Achieve sales targets',
        'Build client relationships'
      ]
    },
    {
      id: 6,
      title: 'Operations Manager',
      department: 'Operations',
      location: 'Hyderabad',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹12-18 LPA',
      posted: '4 days ago',
      hot: true,
      description: 'Manage day-to-day operations and service delivery.',
      requirements: [
        'Operations management experience',
        'Leadership skills',
        'Process optimization',
        'Analytical thinking'
      ],
      responsibilities: [
        'Oversee service operations',
        'Improve processes',
        'Manage service teams',
        'Ensure quality standards'
      ]
    }
  ]

  const benefits = [
    {
      icon: '💰',
      title: 'Competitive Salary',
      description: 'Market-leading compensation packages'
    },
    {
      icon: '🏥',
      title: 'Health Insurance',
      description: 'Comprehensive health coverage for you and your family'
    },
    {
      icon: '📈',
      title: 'Career Growth',
      description: 'Clear career progression and learning opportunities'
    },
    {
      icon: '⏰',
      title: 'Flexible Work',
      description: 'Hybrid work model and flexible hours'
    },
    {
      icon: '🎓',
      title: 'Learning & Development',
      description: 'Annual learning budget and training programs'
    },
    {
      icon: '🏖️',
      title: 'Paid Time Off',
      description: 'Generous vacation and leave policies'
    },
    {
      icon: '📱',
      title: 'Gadget Allowance',
      description: 'Latest laptop and smartphone reimbursement'
    },
    {
      icon: '🍕',
      title: 'Food & Snacks',
      description: 'Free meals and snacks at office'
    }
  ]

  const cultureValues = [
    {
      icon: '🎯',
      title: 'Customer First',
      description: 'We put our customers at the center of everything we do'
    },
    {
      icon: '🤝',
      title: 'Collaboration',
      description: 'We work together to achieve great things'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'We encourage creative thinking and new ideas'
    },
    {
      icon: '🚀',
      title: 'Growth Mindset',
      description: 'We believe in continuous learning and improvement'
    },
    {
      icon: '🌟',
      title: 'Excellence',
      description: 'We strive for excellence in everything we do'
    },
    {
      icon: '🏆',
      title: 'Ownership',
      description: 'We take ownership and responsibility for our work'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Job application submitted:', { ...formData, position: selectedJob })
      alert('Application submitted successfully! We will review your profile and get back to you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        experience: '',
        education: '',
        skills: '',
        coverLetter: '',
        resume: null
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        resume: e.target.files[0]
      })
    }
  }

  return (
    <div className="careers-page">
      {/* Hero Section */}
      <section className="careers-hero">
        <div className="hero-content">
          <h1>Join Our Team</h1>
          <p className="hero-subtitle">Build your career with Smart ServiceHub</p>
          <p className="hero-description">
            We're looking for talented individuals who are passionate about making a difference. 
            Join us in our mission to revolutionize the service industry and create amazing experiences for our customers.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Team Members</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">15+</span>
              <span className="stat-label">Cities</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">4.5★</span>
              <span className="stat-label">Employee Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="categories-section">
        <div className="container">
          <h2>Browse by Department</h2>
          <div className="categories-grid">
            {jobCategories.map(category => (
              <div key={category.id} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <div className="category-stats">
                  <span className="job-count">{category.jobs} Open Positions</span>
                </div>
                <button className="btn-secondary">View Jobs</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="positions-section">
        <div className="container">
          <h2>Open Positions</h2>
          <div className="positions-grid">
            {openPositions.map(job => (
              <div key={job.id} className={`position-card ${job.hot ? 'featured' : ''}`}>
                {job.hot && <div className="hot-badge">🔥 Hot Opening</div>}
                <div className="position-header">
                  <h3>{job.title}</h3>
                  <div className="position-meta">
                    <span className="department">{job.department}</span>
                    <span className="location">📍 {job.location}</span>
                    <span className="type">{job.type}</span>
                  </div>
                </div>
                <p className="position-description">{job.description}</p>
                <div className="position-details">
                  <div className="detail-item">
                    <span className="detail-label">Experience:</span>
                    <span>{job.experience}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Salary:</span>
                    <span>{job.salary}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Posted:</span>
                    <span>{job.posted}</span>
                  </div>
                </div>
                <div className="position-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => setSelectedJob(job.title)}
                  >
                    Apply Now
                  </button>
                  <button className="btn-secondary">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      {selectedJob && (
        <section className="application-section">
          <div className="container">
            <div className="application-grid">
              <div className="application-form">
                <h2>Apply for {selectedJob}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
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
                      <label>Total Experience *</label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select experience</option>
                        <option value="0-1">0-1 year</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-7">5-7 years</option>
                        <option value="7+">7+ years</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Highest Education *</label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      placeholder="e.g., B.Tech Computer Science"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label>Key Skills *</label>
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="List your key skills separated by commas..."
                      required
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Cover Letter</label>
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell us why you're interested in this position..."
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Resume/CV *</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                      disabled={isSubmitting}
                    />
                    <small>Upload your resume in PDF, DOC, or DOCX format (Max 5MB)</small>
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
                <h3>What to Expect Next</h3>
                <div className="process-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Application Review</h4>
                      <p>Our team will review your application within 3-5 business days</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Initial Screening</h4>
                      <p>Shortlisted candidates will receive a call for initial discussion</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Technical Interview</h4>
                      <p>Technical assessment with the hiring team</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h4>Final Round</h4>
                      <p>Meeting with senior leadership and team members</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">5</div>
                    <div className="step-content">
                      <h4>Offer</h4>
                      <p>Successful candidates receive offer letter and onboarding details</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2>Why Work With Us</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="culture-section">
        <div className="container">
          <h2>Our Culture</h2>
          <p className="culture-subtitle">Values that guide us every day</p>
          <div className="culture-grid">
            {cultureValues.map((value, index) => (
              <div key={index} className="culture-card">
                <div className="culture-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Life at Smart ServiceHub */}
      <section className="life-section">
        <div className="container">
          <h2>Life at Smart ServiceHub</h2>
          <div className="life-grid">
            <div className="life-card">
              <div className="life-icon">🏢</div>
              <h3>Modern Workspaces</h3>
              <p>Beautiful, ergonomic offices designed for collaboration and productivity</p>
            </div>
            <div className="life-card">
              <div className="life-icon">🎉</div>
              <h3>Team Events</h3>
              <p>Regular team outings, celebrations, and fun activities</p>
            </div>
            <div className="life-card">
              <div className="life-icon">📚</div>
              <h3>Learning Opportunities</h3>
              <p>Workshops, seminars, and courses to enhance your skills</p>
            </div>
            <div className="life-card">
              <div className="life-icon">🏆</div>
              <h3>Recognition</h3>
              <p>Awards and recognition for outstanding performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Join Us?</h2>
            <p>Take the first step towards an exciting career with Smart ServiceHub</p>
            <div className="cta-actions">
              <Link to="/contact" className="btn-primary">Contact HR Team</Link>
              <a href="mailto:careers@smartservicehub.com" className="btn-secondary">
                📧 careers@smartservicehub.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
