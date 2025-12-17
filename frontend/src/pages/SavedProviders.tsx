import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/SavedProviders.css'

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
  responseRate: number
  savedDate: string
  notes?: string
  tags?: string[]
}

interface SavedList {
  id: string
  name: string
  description: string
  providerIds: string[]
  createdAt: string
  isDefault: boolean
  color: string
}

export default function SavedProvidersPage() {
  const navigate = useNavigate()
  const [savedProviders, setSavedProviders] = useState<Provider[]>([])
  const [savedLists, setSavedLists] = useState<SavedList[]>([])
  const [selectedList, setSelectedList] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'savedDate' | 'price'>('savedDate')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateListModal, setShowCreateListModal] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListDescription, setNewListDescription] = useState('')
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [notes, setNotes] = useState<{ [key: string]: string }>({})

  const mockSavedProviders: Provider[] = [
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
      responseRate: 98,
      savedDate: '2024-01-15',
      notes: 'Great for emergency repairs. Responds quickly.',
      tags: ['emergency', 'plumbing', 'reliable']
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
      responseRate: 95,
      savedDate: '2024-01-10',
      notes: 'Excellent for deep cleaning. Uses eco-friendly products.',
      tags: ['cleaning', 'eco-friendly', 'office']
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
      responseRate: 99,
      savedDate: '2024-01-08',
      notes: 'Very professional and knowledgeable. Good for complex electrical work.',
      tags: ['electrical', 'emergency', 'automation']
    },
    {
      id: 'p4',
      name: 'CoolAir HVAC Services',
      category: 'AC Repair',
      rating: 4.7,
      reviews: 412,
      price: 1200,
      experience: '6+ years',
      responseTime: '2 hours',
      completedJobs: 980,
      verified: true,
      available: false,
      image: '❄️',
      location: 'Pune',
      specialties: ['AC Installation', 'AC Repair', 'Annual Maintenance', 'Duct Cleaning'],
      languages: ['English', 'Hindi', 'Marathi'],
      about: 'Specialized in air conditioning services and maintenance.',
      workingHours: '9 AM - 7 PM',
      phone: '+91-9876543213',
      email: 'service@coolair.com',
      lastActive: '1 hour ago',
      isOnline: false,
      distance: 8.1,
      responseRate: 92,
      savedDate: '2024-01-05',
      notes: 'Good for regular AC maintenance. Reasonable pricing.',
      tags: ['ac', 'maintenance', 'seasonal']
    }
  ]

  const mockSavedLists: SavedList[] = [
    {
      id: 'all',
      name: 'All Saved',
      description: 'All your saved providers',
      providerIds: ['p1', 'p2', 'p3', 'p4'],
      createdAt: '2024-01-01',
      isDefault: true,
      color: '#f59e0b'
    },
    {
      id: 'emergency',
      name: 'Emergency Services',
      description: 'Providers available for urgent needs',
      providerIds: ['p1', 'p3'],
      createdAt: '2024-01-02',
      isDefault: false,
      color: '#ef4444'
    },
    {
      id: 'favorites',
      name: 'My Favorites',
      description: 'Top-rated providers I love',
      providerIds: ['p1', 'p3'],
      createdAt: '2024-01-03',
      isDefault: false,
      color: '#10b981'
    },
    {
      id: 'home',
      name: 'Home Services',
      description: 'Regular home maintenance providers',
      providerIds: ['p2', 'p4'],
      createdAt: '2024-01-04',
      isDefault: false,
      color: '#3b82f6'
    }
  ]

  useEffect(() => {
    // Load saved providers and lists
    setSavedProviders(mockSavedProviders)
    setSavedLists(mockSavedLists)
    
    // Initialize notes
    const initialNotes: { [key: string]: string } = {}
    mockSavedProviders.forEach(provider => {
      if (provider.notes) {
        initialNotes[provider.id] = provider.notes
      }
    })
    setNotes(initialNotes)
  }, [])

  const getFilteredProviders = () => {
    let filtered = savedProviders

    // Filter by selected list
    if (selectedList !== 'all') {
      const list = savedLists.find(l => l.id === selectedList)
      if (list) {
        filtered = filtered.filter(p => list.providerIds.includes(p.id))
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort providers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return b.rating - a.rating
        case 'price':
          return a.price - b.price
        case 'savedDate':
          return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime()
        default:
          return 0
      }
    })

    return filtered
  }

  const removeFromSaved = (providerId: string) => {
    setSavedProviders(prev => prev.filter(p => p.id !== providerId))
  }

  const contactProvider = (providerId: string) => {
    navigate(`/contact-provider?provider=${providerId}`)
  }

  const bookProvider = (providerId: string) => {
    const provider = savedProviders.find(p => p.id === providerId)
    if (provider) {
      navigate(`/book/${provider.category.toLowerCase().replace(' ', '')}?provider=${providerId}`)
    }
  }

  const createNewList = () => {
    if (!newListName.trim()) return

    const newList: SavedList = {
      id: Date.now().toString(),
      name: newListName,
      description: newListDescription,
      providerIds: [],
      createdAt: new Date().toISOString().split('T')[0],
      isDefault: false,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    }

    setSavedLists(prev => [...prev, newList])
    setNewListName('')
    setNewListDescription('')
    setShowCreateListModal(false)
  }

  const saveNotes = (providerId: string) => {
    const providerNotes = notes[providerId] || ''
    // In real app, this would save to backend
    console.log('Saving notes for', providerId, ':', providerNotes)
    setEditingNotes(null)
  }

  const addProviderToList = (providerId: string, listId: string) => {
    // In real app, this would update the backend
    console.log('Adding provider', providerId, 'to list', listId)
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Plumbing': '🔧',
      'Cleaning': '🧹',
      'Electrical': '⚡',
      'AC Repair': '❄️',
      'Carpentry': '🔨',
      'Painting': '🎨',
      'Pest Control': '🐛',
      'Landscaping': '🌿'
    }
    return icons[category] || '👷'
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Plumbing': '#3b82f6',
      'Cleaning': '#10b981',
      'Electrical': '#f59e0b',
      'AC Repair': '#06b6d4',
      'Carpentry': '#8b5cf6',
      'Painting': '#ec4899',
      'Pest Control': '#84cc16',
      'Landscaping': '#22c55e'
    }
    return colors[category] || '#6b7280'
  }

  const filteredProviders = getFilteredProviders()

  if (savedProviders.length === 0) {
    return (
      <div className="saved-providers">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>No Saved Providers</h2>
          <p>Start saving providers you like to build your personal collection</p>
          <button className="find-providers-btn" onClick={() => navigate('/find-provider')}>
            🔍 Find Providers
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="saved-providers">
      {/* Header */}
      <div className="saved-header">
        <div className="header-content">
          <h1>My Saved Providers</h1>
          <p>Manage your collection of trusted service providers</p>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-value">{savedProviders.length}</span>
              <span className="stat-label">Total Saved</span>
            </div>
            <div className="stat">
              <span className="stat-value">{savedLists.length}</span>
              <span className="stat-label">Lists</span>
            </div>
            <div className="stat">
              <span className="stat-value">{savedProviders.filter(p => p.available).length}</span>
              <span className="stat-label">Available Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lists Navigation */}
      <div className="lists-navigation">
        <div className="lists-container">
          <div className="list-tabs">
            {savedLists.map(list => (
              <button
                key={list.id}
                className={`list-tab ${selectedList === list.id ? 'active' : ''}`}
                onClick={() => setSelectedList(list.id)}
                style={{ borderColor: list.color }}
              >
                <div className="list-info">
                  <span className="list-name">{list.name}</span>
                  <span className="list-count">{list.providerIds.length} providers</span>
                </div>
                {!list.isDefault && (
                  <div className="list-color" style={{ backgroundColor: list.color }}></div>
                )}
              </button>
            ))}
            <button
              className="create-list-btn"
              onClick={() => setShowCreateListModal(true)}
            >
              + Create List
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="search-bar">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved providers..."
                className="search-input"
              />
            </div>
          </div>
          
          <div className="filter-controls">
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                ⚏ Grid
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                ☰ List
              </button>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="sort-select"
            >
              <option value="savedDate">Recently Saved</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="results-section">
        <div className="results-header">
          <h2>{filteredProviders.length} Saved Providers</h2>
          {selectedList !== 'all' && (
            <p>in "{savedLists.find(l => l.id === selectedList)?.name}" list</p>
          )}
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="providers-grid">
            {filteredProviders.map(provider => (
              <div key={provider.id} className="provider-card">
                <div className="card-header">
                  <div className="provider-avatar">
                    <span className="avatar-icon">{provider.image}</span>
                    {provider.verified && (
                      <div className="verified-badge">✓</div>
                    )}
                    <div className={`online-indicator ${provider.isOnline ? 'online' : 'offline'}`}></div>
                  </div>
                  <div className="provider-info">
                    <h3>{provider.name}</h3>
                    <div className="provider-category" style={{ backgroundColor: getCategoryColor(provider.category) }}>
                      {getCategoryIcon(provider.category)} {provider.category}
                    </div>
                    <div className="provider-rating">
                      <span className="stars">⭐</span>
                      <span className="rating-value">{provider.rating}</span>
                      <span className="review-count">({provider.reviews})</span>
                    </div>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromSaved(provider.id)}
                    title="Remove from saved"
                  >
                    ×
                  </button>
                </div>

                <div className="card-content">
                  <div className="provider-meta">
                    <span className="meta-item">
                      <span className="meta-icon">📍</span>
                      {provider.location}
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">💰</span>
                      ₹{provider.price}
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">⏱️</span>
                      {provider.responseTime}
                    </span>
                  </div>

                  <div className="provider-notes">
                    {editingNotes === provider.id ? (
                      <div className="notes-editor">
                        <textarea
                          value={notes[provider.id] || ''}
                          onChange={(e) => setNotes(prev => ({ ...prev, [provider.id]: e.target.value }))}
                          placeholder="Add notes about this provider..."
                          className="notes-input"
                        />
                        <div className="notes-actions">
                          <button
                            className="save-notes-btn"
                            onClick={() => saveNotes(provider.id)}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-notes-btn"
                            onClick={() => setEditingNotes(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="notes-display">
                        {notes[provider.id] ? (
                          <p className="notes-text">{notes[provider.id]}</p>
                        ) : (
                          <p className="notes-placeholder" onClick={() => setEditingNotes(provider.id)}>
                            + Add notes...
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {provider.tags && provider.tags.length > 0 && (
                    <div className="provider-tags">
                      {provider.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <div className="status-info">
                    <div className={`availability-badge ${provider.available ? 'available' : 'unavailable'}`}>
                      {provider.available ? '✓ Available' : '✗ Busy'}
                    </div>
                    <span className="saved-date">Saved {provider.savedDate}</span>
                  </div>
                  <div className="action-buttons">
                    <button
                      className="action-btn contact"
                      onClick={() => contactProvider(provider.id)}
                    >
                      💬
                    </button>
                    <button
                      className={`action-btn book ${!provider.available ? 'disabled' : ''}`}
                      onClick={() => bookProvider(provider.id)}
                      disabled={!provider.available}
                    >
                      📅
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="providers-list">
            {filteredProviders.map(provider => (
              <div key={provider.id} className="provider-list-item">
                <div className="provider-main">
                  <div className="provider-header">
                    <div className="provider-avatar">
                      <span className="avatar-icon">{provider.image}</span>
                      {provider.verified && (
                        <div className="verified-badge">✓</div>
                      )}
                      <div className={`online-indicator ${provider.isOnline ? 'online' : 'offline'}`}></div>
                    </div>
                    <div className="provider-info">
                      <h3>{provider.name}</h3>
                      <div className="provider-category" style={{ backgroundColor: getCategoryColor(provider.category) }}>
                        {getCategoryIcon(provider.category)} {provider.category}
                      </div>
                      <div className="provider-rating">
                        <span className="stars">⭐</span>
                        <span className="rating-value">{provider.rating}</span>
                        <span className="review-count">({provider.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="provider-about">{provider.about}</p>
                  
                  <div className="provider-meta">
                    <span className="meta-item">
                      <span className="meta-icon">📍</span>
                      {provider.location}
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">💰</span>
                      ₹{provider.price} starting
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">⏱️</span>
                      {provider.responseTime} response
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">🎓</span>
                      {provider.experience}
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">📋</span>
                      {provider.completedJobs} jobs
                    </span>
                  </div>

                  {provider.specialties && (
                    <div className="specialties">
                      <strong>Specialties:</strong> {provider.specialties.join(', ')}
                    </div>
                  )}

                  <div className="provider-notes">
                    {editingNotes === provider.id ? (
                      <div className="notes-editor">
                        <textarea
                          value={notes[provider.id] || ''}
                          onChange={(e) => setNotes(prev => ({ ...prev, [provider.id]: e.target.value }))}
                          placeholder="Add notes about this provider..."
                          className="notes-input"
                        />
                        <div className="notes-actions">
                          <button
                            className="save-notes-btn"
                            onClick={() => saveNotes(provider.id)}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-notes-btn"
                            onClick={() => setEditingNotes(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="notes-display">
                        {notes[provider.id] ? (
                          <p className="notes-text">
                            <strong>Notes:</strong> {notes[provider.id]}
                          </p>
                        ) : (
                          <p className="notes-placeholder" onClick={() => setEditingNotes(provider.id)}>
                            + Add notes about this provider...
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="provider-side">
                  <div className="status-info">
                    <div className={`availability-badge ${provider.available ? 'available' : 'unavailable'}`}>
                      {provider.available ? '✓ Available' : '✗ Busy'}
                    </div>
                    <span className="saved-date">Saved {provider.savedDate}</span>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromSaved(provider.id)}
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="action-buttons">
                    <button
                      className="action-btn contact"
                      onClick={() => contactProvider(provider.id)}
                    >
                      💬 Contact
                    </button>
                    <button
                      className={`action-btn book ${!provider.available ? 'disabled' : ''}`}
                      onClick={() => bookProvider(provider.id)}
                      disabled={!provider.available}
                    >
                      📅 Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create List Modal */}
      {showCreateListModal && (
        <div className="create-list-modal">
          <div className="modal-overlay" onClick={() => setShowCreateListModal(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New List</h3>
              <button
                className="close-btn"
                onClick={() => setShowCreateListModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>List Name</label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g., Emergency Services, Home Maintenance"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="Describe what this list is for..."
                  rows={3}
                  className="form-textarea"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                className="modal-btn secondary"
                onClick={() => setShowCreateListModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-btn primary"
                onClick={createNewList}
                disabled={!newListName.trim()}
              >
                Create List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
