import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/AdvancedPages.css'

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('popular')

  const categories = [
    { id: 'all', name: 'All Services', icon: '🏠' },
    { id: 'plumbing', name: 'Plumbing', icon: '🔧' },
    { id: 'electrical', name: 'Electrical', icon: '⚡' },
    { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
    { id: 'pest-control', name: 'Pest Control', icon: '🐜' },
    { id: 'ac-service', name: 'AC Service', icon: '❄️' },
    { id: 'painting', name: 'Painting', icon: '🎨' },
    { id: 'appliance', name: 'Appliance Repair', icon: '🔌' }
  ]

  const services = [
    {
      id: 1,
      category: 'plumbing',
      name: 'Emergency Plumbing',
      description: '24/7 emergency plumbing services including leak repairs, pipe fixing, drain cleaning',
      price: '₹800-2000',
      rating: 4.8,
      reviews: 324,
      time: '30-90 mins',
      professionals: 15,
      image: '🔧',
      popular: true,
      featured: true
    },
    {
      id: 2,
      category: 'electrical',
      name: 'Expert Electrical Services',
      description: 'Professional electrical work including wiring, repairs, installations, safety inspections',
      price: '₹1000-3000',
      rating: 4.9,
      reviews: 256,
      time: '45-120 mins',
      professionals: 12,
      image: '⚡',
      popular: true,
      featured: true
    },
    {
      id: 3,
      category: 'cleaning',
      name: 'Deep Home Cleaning',
      description: 'Comprehensive home cleaning with professional equipment and eco-friendly products',
      price: '₹1500-5000',
      rating: 4.7,
      reviews: 189,
      time: '2-6 hours',
      professionals: 20,
      image: '🧹',
      popular: false,
      featured: true
    },
    {
      id: 4,
      category: 'pest-control',
      name: 'Pest Control Treatment',
      description: 'Effective pest control for cockroaches, termites, mosquitoes, and other pests',
      price: '₹1200-3500',
      rating: 4.6,
      reviews: 145,
      time: '1-3 hours',
      professionals: 8,
      image: '🐜',
      popular: false,
      featured: false
    },
    {
      id: 5,
      category: 'ac-service',
      name: 'AC Repair & Service',
      description: 'Complete AC servicing, repair, gas refilling, and installation services',
      price: '₹800-2500',
      rating: 4.8,
      reviews: 298,
      time: '1-2 hours',
      professionals: 18,
      image: '❄️',
      popular: true,
      featured: false
    },
    {
      id: 6,
      category: 'painting',
      name: 'Professional Painting',
      description: 'Interior and exterior painting with premium quality paints and expert painters',
      price: '₹5000-20000',
      rating: 4.7,
      reviews: 167,
      time: '1-3 days',
      professionals: 10,
      image: '🎨',
      popular: false,
      featured: false
    },
    {
      id: 7,
      category: 'appliance',
      name: 'Appliance Repair',
      description: 'Repair services for washing machines, refrigerators, microwaves, and more',
      price: '₹600-2000',
      rating: 4.5,
      reviews: 134,
      time: '1-3 hours',
      professionals: 14,
      image: '🔌',
      popular: false,
      featured: false
    },
    {
      id: 8,
      category: 'plumbing',
      name: 'Bathroom Fitting',
      description: 'Installation and repair of bathroom fittings, taps, showers, and sanitary ware',
      price: '₹1200-4000',
      rating: 4.6,
      reviews: 98,
      time: '2-4 hours',
      professionals: 6,
      image: '🚿',
      popular: false,
      featured: false
    }
  ]

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseInt(a.price.replace(/[₹,]/g, '').split('-')[0]) - 
               parseInt(b.price.replace(/[₹,]/g, '').split('-')[0])
      case 'price-high':
        return parseInt(b.price.replace(/[₹,]/g, '').split('-')[0]) - 
               parseInt(a.price.replace(/[₹,]/g, '').split('-')[0])
      case 'rating':
        return b.rating - a.rating
      case 'time':
        return parseInt(a.time.split('-')[0]) - parseInt(b.time.split('-')[0])
      default: // popular
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.reviews - a.reviews
    }
  })

  const handleBookService = (serviceId: number) => {
    console.log('Booking service:', serviceId)
    // Navigate to booking page or open booking modal
    alert(`Service ${serviceId} booking initiated! Redirecting to booking page...`)
  }

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="hero-content">
          <h1>Professional Services at Your Fingertips</h1>
          <p className="hero-subtitle">Book verified professionals for all your home and business needs</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Verified Professionals</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">4.8★</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-container">
            {/* Category Filter */}
            <div className="filter-group">
              <label>Category</label>
              <div className="category-filters">
                {categories.map(category => (
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
            </div>

            {/* Search and Sort */}
            <div className="search-sort-group">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
              
              <div className="sort-dropdown">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="time">Fastest Service</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="results-info">
            <p>Showing {sortedServices.length} services</p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="container">
          <div className="services-grid">
            {sortedServices.map(service => (
              <div key={service.id} className={`service-card ${service.featured ? 'featured' : ''}`}>
                {service.featured && <div className="featured-badge">⭐ Featured</div>}
                {service.popular && <div className="popular-badge">🔥 Popular</div>}
                
                <div className="service-header">
                  <div className="service-icon">{service.image}</div>
                  <div className="service-info">
                    <h3>{service.name}</h3>
                    <p className="service-description">{service.description}</p>
                  </div>
                </div>

                <div className="service-details">
                  <div className="service-stats">
                    <div className="stat">
                      <span className="stat-icon">⭐</span>
                      <span className="stat-value">{service.rating}</span>
                      <span className="stat-text">({service.reviews})</span>
                    </div>
                    <div className="stat">
                      <span className="stat-icon">⏰</span>
                      <span className="stat-value">{service.time}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-icon">👥</span>
                      <span className="stat-value">{service.professionals}</span>
                      <span className="stat-text">Pros</span>
                    </div>
                  </div>
                  
                  <div className="service-price">
                    <span className="price-label">Starting from</span>
                    <span className="price-value">{service.price}</span>
                  </div>
                </div>

                <div className="service-actions">
                  <button className="btn-secondary">View Details</button>
                  <button 
                    className="btn-primary"
                    onClick={() => handleBookService(service.id)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {sortedServices.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No services found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button 
                className="btn-primary"
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchTerm('')
                  setSortBy('popular')
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Need a Custom Service?</h2>
            <p>Can't find what you're looking for? Contact us and we'll help you find the right professional</p>
            <div className="cta-actions">
              <Link to="/contact" className="btn-primary">Contact Support</Link>
              <a href="tel:+919876543210" className="btn-secondary">Call Us</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
