import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CompareProviders.css'

interface Provider {
  id: string
  name: string
  category: string
  rating: number
  reviews: number
  price: number
  experience: string
  responseTime: string
  completedJobs: number
  verified: boolean
  available: boolean
  image: string
  location: string
  specialties: string[]
  languages: string[]
  about: string
  workingHours: string
  phone: string
  email: string
  website?: string
  lastActive: string
  isOnline: boolean
  distance?: number
  badge?: string
  certifications: string[]
  equipment: string[]
  emergencyService: boolean
  pricingModel: 'hourly' | 'fixed' | 'quote'
  responseRate: number
  cancellationPolicy: string
  insurance: boolean
}

export default function CompareProviders() {
  const navigate = useNavigate()
  const [compareList, setCompareList] = useState<string[]>(['p1', 'p2', 'p3'])
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  // Mock data - in real app, this would come from API or context
  const mockProviders: Provider[] = [
    {
      id: 'p1',
      name: 'QuickFix Pro Solutions',
      category: 'Plumbing',
      rating: 4.9,
      reviews: 342,
      price: 1500,
      experience: '8+ years',
      responseTime: '30 min',
      completedJobs: 1250,
      verified: true,
      available: true,
      image: '🔧',
      location: 'Delhi NCR',
      specialties: ['Emergency Plumbing', 'Pipe Repair', 'Installation', 'Drain Cleaning'],
      languages: ['English', 'Hindi', 'Punjabi'],
      about: 'Professional plumbing services with 8+ years of experience.',
      workingHours: '24/7',
      phone: '+91-9876543210',
      email: 'info@quickfixpro.com',
      website: 'www.quickfixpro.com',
      lastActive: '2 min ago',
      isOnline: true,
      distance: 2.5,
      badge: 'Top Rated',
      certifications: ['Licensed Plumber', 'Safety Certified'],
      equipment: ['Pipe Wrench Set', 'Drain Snake', 'Leak Detection Tools'],
      emergencyService: true,
      pricingModel: 'hourly',
      responseRate: 98,
      cancellationPolicy: 'Free cancellation up to 2 hours',
      insurance: true
    },
    {
      id: 'p2',
      name: 'Sparkle Clean Services',
      category: 'Cleaning',
      rating: 4.8,
      reviews: 256,
      price: 2000,
      experience: '5+ years',
      responseTime: '1 hour',
      completedJobs: 890,
      verified: true,
      available: true,
      image: '🧹',
      location: 'Mumbai',
      specialties: ['Deep Cleaning', 'Office Cleaning', 'Post-Construction', 'Carpet Cleaning'],
      languages: ['English', 'Hindi', 'Marathi'],
      about: 'Professional cleaning services for residential and commercial properties.',
      workingHours: '8 AM - 8 PM',
      phone: '+91-9876543211',
      email: 'clean@sparkle.com',
      lastActive: '5 min ago',
      isOnline: true,
      distance: 5.2,
      badge: 'Eco Friendly',
      certifications: ['Green Cleaning Certified', 'ISO 9001'],
      equipment: ['Industrial Vacuum', 'Steam Cleaner', 'Eco-friendly Solutions'],
      emergencyService: false,
      pricingModel: 'fixed',
      responseRate: 95,
      cancellationPolicy: '24-hour notice required',
      insurance: true
    },
    {
      id: 'p3',
      name: 'ElectroSafe Electrical',
      category: 'Electrical',
      rating: 5.0,
      reviews: 189,
      price: 1800,
      experience: '12+ years',
      responseTime: '45 min',
      completedJobs: 670,
      verified: true,
      available: true,
      image: '⚡',
      location: 'Bangalore',
      specialties: ['Wiring', 'Panel Installation', 'Emergency Repairs', 'Home Automation'],
      languages: ['English', 'Hindi', 'Kannada', 'Tamil'],
      about: 'Certified electrical contractor with expertise in residential and commercial projects.',
      workingHours: '24/7 Emergency',
      phone: '+91-9876543212',
      email: 'electro@electrosafe.com',
      lastActive: '1 min ago',
      isOnline: true,
      distance: 3.8,
      badge: 'Expert',
      certifications: ['Master Electrician', 'Safety Certified', 'Smart Home Certified'],
      equipment: ['Multimeter', 'Cable Tester', 'Circuit Analyzers'],
      emergencyService: true,
      pricingModel: 'hourly',
      responseRate: 99,
      cancellationPolicy: 'Flexible cancellation',
      insurance: true
    }
  ]

  const providersToCompare = mockProviders.filter(p => compareList.includes(p.id))

  const removeFromCompare = (providerId: string) => {
    setCompareList(prev => prev.filter(id => id !== providerId))
  }

  const handleBookProvider = (providerId: string) => {
    navigate(`/book/plumbing?provider=${providerId}`)
  }

  const handleContactProvider = (providerId: string) => {
    navigate(`/contact-provider?provider=${providerId}`)
  }

  const addMoreProviders = () => {
    navigate('/find-provider')
  }

  const getComparisonScore = (provider: Provider) => {
    let score = 0
    if (provider.verified) score += 20
    if (provider.available) score += 15
    if (provider.emergencyService) score += 10
    if (provider.insurance) score += 10
    score += (provider.rating / 5) * 25
    score += (provider.responseRate / 100) * 20
    return Math.round(score)
  }

  const getBestValue = (providers: Provider[], field: keyof Provider) => {
    if (providers.length === 0) return null
    
    switch (field) {
      case 'rating':
      case 'reviews':
      case 'completedJobs':
      case 'responseRate':
        return Math.max(...providers.map(p => (p[field] as number) || 0))
      case 'price':
        return Math.min(...providers.map(p => (p[field] as number) || 0))
      case 'responseTime':
        return providers.reduce((best, p) => {
          const currentMinutes = parseInt(p.responseTime.split(' ')[0])
          const bestMinutes = parseInt(best.responseTime.split(' ')[0])
          return currentMinutes < bestMinutes ? p : best
        }).responseTime
      default:
        return null
    }
  }

  if (compareList.length === 0) {
    return (
      <div className="compare-providers">
        <div className="empty-state">
          <div className="empty-icon">⚖️</div>
          <h2>No Providers to Compare</h2>
          <p>Add providers from the search results to compare them side by side</p>
          <button className="add-providers-btn" onClick={addMoreProviders}>
            🔍 Find Providers
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="compare-providers">
      {/* Header */}
      <div className="compare-header">
        <div className="header-content">
          <h1>Compare Providers</h1>
          <p>Side-by-side comparison of {providersToCompare.length} providers</p>
          <div className="header-actions">
            <button 
              className={`view-toggle ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              📊 Table View
            </button>
            <button 
              className={`view-toggle ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              📋 Card View
            </button>
            <button className="add-more-btn" onClick={addMoreProviders}>
              + Add More
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Summary */}
      <div className="comparison-summary">
        <div className="summary-grid">
          {providersToCompare.map(provider => (
            <div key={provider.id} className="provider-summary">
              <div className="summary-header">
                <div className="provider-avatar">
                  <span className="avatar-icon">{provider.image}</span>
                  {provider.verified && (
                    <div className="verified-badge">✓</div>
                  )}
                </div>
                <div className="provider-info">
                  <h3>{provider.name}</h3>
                  <div className="provider-category">{provider.category}</div>
                  <div className="comparison-score">
                    <span className="score-label">Match Score</span>
                    <span className="score-value">{getComparisonScore(provider)}%</span>
                  </div>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCompare(provider.id)}
                >
                  ×
                </button>
              </div>
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-value">⭐ {provider.rating}</span>
                  <span className="stat-label">Rating</span>
                </div>
                <div className="stat">
                  <span className="stat-value">₹{provider.price}</span>
                  <span className="stat-label">Starting Price</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{provider.responseTime}</span>
                  <span className="stat-label">Response</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="table-comparison">
          <div className="comparison-table">
            <div className="table-header">
              <div className="feature-column">Features</div>
              {providersToCompare.map(provider => (
                <div key={provider.id} className="provider-column">
                  <div className="provider-header-cell">
                    <span className="provider-icon">{provider.image}</span>
                    <span className="provider-name">{provider.name}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Rating Row */}
            <div className="table-row">
              <div className="feature-cell">
                <span className="feature-icon">⭐</span>
                <span className="feature-name">Rating</span>
              </div>
              {providersToCompare.map(provider => (
                <div key={provider.id} className="data-cell">
                  <div className={`rating-value ${provider.rating === getBestValue(providersToCompare, 'rating') ? 'best' : ''}`}>
                    {provider.rating}
                  </div>
                  <div className="sub-value">({provider.reviews} reviews)</div>
                </div>
              ))}
            </div>

            {/* Price Row */}
            <div className="table-row">
              <div className="feature-cell">
                <span className="feature-icon">💰</span>
                <span className="feature-name">Starting Price</span>
              </div>
              {providersToCompare.map(provider => (
                <div key={provider.id} className="data-cell">
                  <div className={`price-value ${provider.price === getBestValue(providersToCompare, 'price') ? 'best' : ''}`}>
                    ₹{provider.price}
                  </div>
                  <div className="sub-value">({provider.pricingModel})</div>
                </div>
              ))}
            </div>

            {/* Experience Row */}
            <div className="table-row">
              <div className="feature-cell">
                <span className="feature-icon">🎓</span>
                <span className="feature-name">Experience</span>
              </div>
              {providersToCompare.map(provider => (
                <div key={provider.id} className="data-cell">
                  <div className="experience-value">{provider.experience}</div>
                </div>
              ))}
            </div>

            {/* Response Time Row */}
            <div className="table-row">
              <div className="feature-cell">
                <span className="feature-icon">⏱️</span>
                <span className="feature-name">Response Time</span>
              </div>
              {providersToCompare.map(provider => (
                <div key={provider.id} className="data-cell">
                  <div className={`response-value ${provider.responseTime === getBestValue(providersToCompare, 'responseTime') ? 'best' : ''}`}>
                    {provider.responseTime}
                  </div>
                </div>
              ))}
            </div>

            {/* Jobs Completed Row */}
            <div className="table-row">
              <div className="feature-cell">
                <span className="feature-icon">📋</span>
                <span className="feature-name">Jobs Completed</span>
              </div>
              {providersToCompare.map(provider => (
                <div key={provider.id} className="data-cell">
                  <div className={`jobs-value ${provider.completedJobs === getBestValue(providersToCompare, 'completedJobs') ? 'best' : ''}`}>
                    {provider.completedJobs}
                  </div>
                </div>
              ))}
            </div>

            {/* Response Rate Row */}
            <div className="table-row">
              <div className="feature-cell">
                <span className="feature-icon">📊</span>
                <span className="feature-name">Response Rate</span>
              </div>
              {providersToCompare.map(provider => (
                <div key={provider.id} className="data-cell">
                  <div className={`rate-value ${provider.responseRate === getBestValue(providersToCompare, 'responseRate') ? 'best' : ''}`}>
                    {provider.responseRate}%
                  </div>
                </div>
              ))}
            </div>

            {/* Availability Row */}
            <div className="table-row">
              <div className="feature-cell">
                <span className="feature-icon">🟢</span>
                <span className="feature-name">Available Now</span>
              </div>
              {providersToCompare.map(provider => (
                <div key={provider.id} className="data-cell">
                  <div className={`availability-badge ${provider.available ? 'available' : 'unavailable'}`}>
                    {provider.available ? '✓ Available' : '✗ Busy'}
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Service Row */}
            <div className="table-row">
              <div className="feature-cell">
                <span className="feature-icon">🚨</span>
                <span className="feature-name">Emergency Service</span>
              </div>
              {providersToCompare.map(provider => (
                <div key={provider.id} className="data-cell">
                  <div className={`emergency-badge ${provider.emergencyService ? 'available' : 'unavailable'}`}>
                    {provider.emergencyService ? '✓ Available' : '✗ Not Available'}
                  </div>
                </div>
              ))}
            </div>

            {/* Insurance Row */}
            <div className="table-row">
              <div className="feature-cell">
                <span className="feature-icon">🛡️</span>
                <span className="feature-name">Insurance</span>
              </div>
              {providersToCompare.map(provider => (
                <div key={provider.id} className="data-cell">
                  <div className={`insurance-badge ${provider.insurance ? 'available' : 'unavailable'}`}>
                    {provider.insurance ? '✓ Insured' : '✗ Not Insured'}
                  </div>
                </div>
              ))}
            </div>

            {/* Specialties Row */}
            <div className="table-row">
              <div className="feature-cell">
                <span className="feature-icon">🔧</span>
                <span className="feature-name">Specialties</span>
              </div>
              {providersToCompare.map(provider => (
                <div key={provider.id} className="data-cell">
                  <div className="specialties-list">
                    {provider.specialties.slice(0, 3).map((specialty, index) => (
                      <span key={index} className="specialty-tag">{specialty}</span>
                    ))}
                    {provider.specialties.length > 3 && (
                      <span className="more-tag">+{provider.specialties.length - 3}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Languages Row */}
            <div className="table-row">
              <div className="feature-cell">
                <span className="feature-icon">🌐</span>
                <span className="feature-name">Languages</span>
              </div>
              {providersToCompare.map(provider => (
                <div key={provider.id} className="data-cell">
                  <div className="languages-list">
                    {provider.languages.join(', ')}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions Row */}
            <div className="table-row actions-row">
              <div className="feature-cell">
                <span className="feature-icon">⚡</span>
                <span className="feature-name">Actions</span>
              </div>
              {providersToCompare.map(provider => (
                <div key={provider.id} className="data-cell">
                  <div className="action-buttons">
                    <button 
                      className="action-btn contact"
                      onClick={() => handleContactProvider(provider.id)}
                    >
                      💬 Contact
                    </button>
                    <button 
                      className="action-btn book"
                      onClick={() => handleBookProvider(provider.id)}
                      disabled={!provider.available}
                    >
                      📅 Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="cards-comparison">
          <div className="cards-grid">
            {providersToCompare.map(provider => (
              <div key={provider.id} className="comparison-card">
                <div className="card-header">
                  <div className="provider-info">
                    <div className="provider-avatar">
                      <span className="avatar-icon">{provider.image}</span>
                      {provider.verified && (
                        <div className="verified-badge">✓</div>
                      )}
                    </div>
                    <div className="provider-details">
                      <h3>{provider.name}</h3>
                      <div className="provider-category">{provider.category}</div>
                      <div className="rating">
                        <span className="stars">⭐</span>
                        <span className="rating-value">{provider.rating}</span>
                        <span className="review-count">({provider.reviews})</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCompare(provider.id)}
                  >
                    ×
                  </button>
                </div>

                <div className="card-content">
                  <div className="comparison-score">
                    <span className="score-label">Match Score</span>
                    <div className="score-bar">
                      <div 
                        className="score-fill"
                        style={{ width: `${getComparisonScore(provider)}%` }}
                      ></div>
                    </div>
                    <span className="score-value">{getComparisonScore(provider)}%</span>
                  </div>

                  <div className="features-grid">
                    <div className="feature-item">
                      <span className="feature-icon">💰</span>
                      <div className="feature-content">
                        <span className="feature-value">₹{provider.price}</span>
                        <span className="feature-label">Starting Price</span>
                      </div>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">⏱️</span>
                      <div className="feature-content">
                        <span className="feature-value">{provider.responseTime}</span>
                        <span className="feature-label">Response Time</span>
                      </div>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🎓</span>
                      <div className="feature-content">
                        <span className="feature-value">{provider.experience}</span>
                        <span className="feature-label">Experience</span>
                      </div>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">📋</span>
                      <div className="feature-content">
                        <span className="feature-value">{provider.completedJobs}</span>
                        <span className="feature-label">Jobs Done</span>
                      </div>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">📊</span>
                      <div className="feature-content">
                        <span className="feature-value">{provider.responseRate}%</span>
                        <span className="feature-label">Response Rate</span>
                      </div>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">📍</span>
                      <div className="feature-content">
                        <span className="feature-value">{provider.location}</span>
                        <span className="feature-label">Location</span>
                      </div>
                    </div>
                  </div>

                  <div className="badges-section">
                    <div className="badges-row">
                      <div className={`status-badge ${provider.available ? 'available' : 'unavailable'}`}>
                        {provider.available ? '✓ Available' : '✗ Busy'}
                      </div>
                      <div className={`status-badge ${provider.emergencyService ? 'available' : 'unavailable'}`}>
                        {provider.emergencyService ? '🚨 Emergency' : 'No Emergency'}
                      </div>
                    </div>
                    <div className="badges-row">
                      <div className={`status-badge ${provider.insurance ? 'available' : 'unavailable'}`}>
                        {provider.insurance ? '🛡️ Insured' : 'Not Insured'}
                      </div>
                      <div className={`status-badge ${provider.verified ? 'available' : 'unavailable'}`}>
                        {provider.verified ? '✓ Verified' : 'Not Verified'}
                      </div>
                    </div>
                  </div>

                  <div className="specialties-section">
                    <h4>Specialties</h4>
                    <div className="specialty-tags">
                      {provider.specialties.map((specialty, index) => (
                        <span key={index} className="specialty-tag">{specialty}</span>
                      ))}
                    </div>
                  </div>

                  <div className="languages-section">
                    <h4>Languages</h4>
                    <div className="languages-list">
                      {provider.languages.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button 
                    className="contact-btn"
                    onClick={() => handleContactProvider(provider.id)}
                  >
                    💬 Contact Provider
                  </button>
                  <button 
                    className={`book-btn ${!provider.available ? 'disabled' : ''}`}
                    onClick={() => handleBookProvider(provider.id)}
                    disabled={!provider.available}
                  >
                    {provider.available ? '📅 Book Now' : 'Currently Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="recommendations">
        <div className="recommendations-header">
          <h2>🏆 Our Recommendations</h2>
          <p>Based on your comparison criteria</p>
        </div>
        <div className="recommendation-cards">
          <div className="recommendation-card">
            <div className="recommendation-icon">💰</div>
            <h3>Best Value</h3>
            <p>{providersToCompare.reduce((best, current) => 
              current.price < best.price ? current : best
            ).name}</p>
            <span className="recommendation-reason">Lowest price with good rating</span>
          </div>
          <div className="recommendation-card">
            <div className="recommendation-icon">⭐</div>
            <h3>Highest Rated</h3>
            <p>{providersToCompare.reduce((best, current) => 
              current.rating > best.rating ? current : best
            ).name}</p>
            <span className="recommendation-reason">Best customer reviews</span>
          </div>
          <div className="recommendation-card">
            <div className="recommendation-icon">⚡</div>
            <h3>Fastest Response</h3>
            <p>{providersToCompare.reduce((best, current) => {
              const currentMinutes = parseInt(current.responseTime.split(' ')[0])
              const bestMinutes = parseInt(best.responseTime.split(' ')[0])
              return currentMinutes < bestMinutes ? current : best
            }).name}</p>
            <span className="recommendation-reason">Quickest to respond</span>
          </div>
        </div>
      </div>
    </div>
  )
}
