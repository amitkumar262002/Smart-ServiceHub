import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookingsAPI } from '@/api/client'

interface Booking {
  id: string
  serviceId: string
  serviceName: string
  providerName: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  amount: number
  datetime: string
  address: string
  description: string
  rating?: number
  review?: string
  paymentStatus: 'pending' | 'paid' | 'refunded'
  trackingId?: string
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'amount'>('date')
  const [apiError, setApiError] = useState<string | null>(null)
  
  const statusOptions = [
    { value: 'all', label: 'All Bookings', color: '#94a3b8' },
    { value: 'pending', label: 'Pending', color: '#f59e0b' },
    { value: 'confirmed', label: 'Confirmed', color: '#3b82f6' },
    { value: 'in_progress', label: 'In Progress', color: '#8b5cf6' },
    { value: 'completed', label: 'Completed', color: '#10b981' },
    { value: 'cancelled', label: 'Cancelled', color: '#ef4444' }
  ]

  async function loadBookings() {
    setLoading(true)
    setApiError(null)
    
    try {
      // Mock data for now since we don't have a real endpoint
      const mockBookings: Booking[] = [
        {
          id: 'BK001',
          serviceId: '1',
          serviceName: 'Home Deep Cleaning',
          providerName: 'Sparkle Clean Services',
          status: 'confirmed',
          amount: 1200,
          datetime: '2024-01-15T10:00:00',
          address: '123 Main St, Apt 4B, Delhi',
          description: 'Complete home cleaning including kitchen and bathrooms',
          paymentStatus: 'paid',
          rating: 5
        },
        {
          id: 'BK002',
          serviceId: '2',
          serviceName: 'AC Repair & Maintenance',
          providerName: 'CoolAir Experts',
          status: 'in_progress',
          amount: 800,
          datetime: '2024-01-14T14:30:00',
          address: '456 Park Avenue, Mumbai',
          description: 'AC not cooling properly, needs inspection and repair',
          paymentStatus: 'pending',
          trackingId: 'TRK123456'
        },
        {
          id: 'BK003',
          serviceId: '3',
          serviceName: 'Emergency Plumbing',
          providerName: 'QuickFix Pro',
          status: 'completed',
          amount: 1500,
          datetime: '2024-01-12T09:00:00',
          address: '789 Oak Street, Bangalore',
          description: 'Burst pipe in bathroom, urgent repair needed',
          paymentStatus: 'paid',
          rating: 4,
          review: 'Fast response and professional service'
        },
        {
          id: 'BK004',
          serviceId: '4',
          serviceName: 'Electrical Wiring Check',
          providerName: 'ElectroSafe',
          status: 'pending',
          amount: 600,
          datetime: '2024-01-16T16:00:00',
          address: '321 Elm Road, Chennai',
          description: 'Annual electrical inspection and safety check',
          paymentStatus: 'pending'
        },
        {
          id: 'BK005',
          serviceId: '5',
          serviceName: 'Car Service & Repair',
          providerName: 'AutoCare Garage',
          status: 'cancelled',
          amount: 2000,
          datetime: '2024-01-10T11:00:00',
          address: '654 Highway Road, Pune',
          description: 'Regular car service and oil change',
          paymentStatus: 'refunded'
        }
      ]
      
      setBookings(mockBookings)
    } catch (error) {
      console.error('Failed to load bookings:', error)
      setApiError('Failed to load bookings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function getStatusColor(status: string) {
    const statusConfig = statusOptions.find(s => s.value === status)
    return statusConfig?.color || '#94a3b8'
  }

  function getStatusIcon(status: string) {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      in_progress: '🔧',
      completed: '✨',
      cancelled: '❌'
    }
    return icons[status as keyof typeof icons] || '📋'
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function formatAmount(amount: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  function getFilteredAndSortedBookings() {
    let filtered = bookings

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter((b: Booking) => b.status === filter)
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((b: Booking) => 
        b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a: Booking, b: Booking) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        case 'status':
          return a.status.localeCompare(b.status)
        case 'amount':
          return b.amount - a.amount
        default:
          return 0
      }
    })

    return filtered
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const filteredBookings = getFilteredAndSortedBookings()
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    inProgress: bookings.filter(b => b.status === 'in_progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  }

  return (
    <div className="my-bookings-advanced">
      {/* Header */}
      <section className="bookings-header">
        <div className="bookings-header-content">
          <div className="bookings-title-section">
            <h1 className="bookings-title">My Bookings</h1>
            <p className="bookings-subtitle">
              Manage and track all your service bookings
            </p>
          </div>
          
          <Link to="/search" className="book-new-service-btn">
            <span className="btn-icon">➕</span>
            <span>Book New Service</span>
          </Link>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="bookings-stats">
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card active">
            <div className="stat-icon">🔧</div>
            <div className="stat-content">
              <div className="stat-number">{stats.confirmed + stats.inProgress}</div>
              <div className="stat-label">Active</div>
            </div>
          </div>
          <div className="stat-card completed">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bookings-filters">
        <div className="filters-content">
          <div className="filters-row">
            {/* Search */}
            <div className="search-group">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>

            {/* Status Filter */}
            <div className="status-filters">
              {statusOptions.map(status => (
                <button
                  key={status.value}
                  className={`status-filter-btn ${filter === status.value ? 'active' : ''}`}
                  onClick={() => setFilter(status.value)}
                  style={{ '--status-color': status.color } as React.CSSProperties}
                >
                  {status.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="sort-group">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'date' | 'status' | 'amount')}
                className="sort-select"
              >
                <option value="date">Sort by Date</option>
                <option value="status">Sort by Status</option>
                <option value="amount">Sort by Amount</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {apiError && (
        <div className="bookings-error">
          <span className="error-icon">⚠️</span>
          <span>{apiError}</span>
        </div>
      )}

      {/* Bookings List */}
      <section className="bookings-list">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner">⏳</div>
            <p>Loading your bookings...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="bookings-grid">
            {filteredBookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-info">
                    <h3 className="booking-service">{booking.serviceName}</h3>
                    <p className="booking-provider">{booking.providerName}</p>
                    <p className="booking-id">Booking ID: {booking.id}</p>
                  </div>
                  <div className="booking-status">
                    <span 
                      className="status-badge"
                      style={{ '--status-color': getStatusColor(booking.status) } as React.CSSProperties}
                    >
                      <span className="status-icon">{getStatusIcon(booking.status)}</span>
                      <span className="status-text">
                        {statusOptions.find(s => s.value === booking.status)?.label}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span className="detail-label">📅 Date & Time:</span>
                    <span className="detail-value">{formatDate(booking.datetime)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📍 Address:</span>
                    <span className="detail-value">{booking.address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">💰 Amount:</span>
                    <span className="detail-value amount">{formatAmount(booking.amount)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">💳 Payment:</span>
                    <span className={`detail-value payment-${booking.paymentStatus}`}>
                      {booking.paymentStatus === 'paid' ? '✅ Paid' : 
                       booking.paymentStatus === 'pending' ? '⏳ Pending' : '💸 Refunded'}
                    </span>
                  </div>
                </div>

                <div className="booking-description">
                  <p>{booking.description}</p>
                </div>

                {booking.trackingId && (
                  <div className="booking-tracking">
                    <Link to={`/track/${booking.trackingId}`} className="tracking-link">
                      <span className="tracking-icon">📍</span>
                      <span>Track Service</span>
                    </Link>
                  </div>
                )}

                {booking.rating && (
                  <div className="booking-review">
                    <div className="rating-display">
                      <span className="rating-stars">
                        {'⭐'.repeat(booking.rating)}
                      </span>
                      {booking.review && <p className="review-text">"{booking.review}"</p>}
                    </div>
                  </div>
                )}

                <div className="booking-actions">
                  {booking.status === 'pending' && (
                    <button className="action-btn cancel">Cancel Booking</button>
                  )}
                  {booking.status === 'completed' && !booking.rating && (
                    <button className="action-btn review">Leave Review</button>
                  )}
                  {booking.status === 'confirmed' && (
                    <Link to={`/pay/${booking.id}`} className="action-btn pay">
                      Pay Now
                    </Link>
                  )}
                  <button className="action-btn details">View Details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bookings">
            <div className="no-bookings-icon">📋</div>
            <h3>No Bookings Found</h3>
            <p>
              {searchQuery || filter !== 'all' 
                ? 'Try adjusting your filters or search terms.'
                : 'You haven\'t made any bookings yet. Start by booking a service!'
              }
            </p>
            <Link to="/search" className="book-now-btn">
              <span className="btn-icon">🔍</span>
              <span>Browse Services</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
