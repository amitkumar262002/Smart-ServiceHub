import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '@/firebase/auth'

interface Booking {
  id: string
  service: string
  provider: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  amount: number
  rating?: number
  review?: string
  address: string
  category: string
}

export default function ProfileBookings() {
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        // Mock bookings data
        const mockBookings: Booking[] = [
          {
            id: 'b1',
            service: 'AC Repair Service',
            provider: 'John Doe',
            date: '2024-11-25',
            time: '14:00',
            status: 'confirmed',
            amount: 1200,
            address: '123 Main St, Delhi',
            category: 'AC Repair'
          },
          {
            id: 'b2',
            service: 'Home Cleaning',
            provider: 'Jane Smith',
            date: '2024-11-20',
            time: '10:00',
            status: 'completed',
            amount: 800,
            rating: 5,
            review: 'Excellent service, very professional!',
            address: '123 Main St, Delhi',
            category: 'Cleaning'
          },
          {
            id: 'b3',
            service: 'Plumbing Service',
            provider: 'Mike Johnson',
            date: '2024-11-15',
            time: '16:00',
            status: 'completed',
            amount: 1500,
            rating: 4,
            review: 'Good work, fixed the issue quickly.',
            address: '123 Main St, Delhi',
            category: 'Plumbing'
          },
          {
            id: 'b4',
            service: 'Electrical Work',
            provider: 'Sarah Wilson',
            date: '2024-11-10',
            time: '11:00',
            status: 'cancelled',
            amount: 0,
            address: '123 Main St, Delhi',
            category: 'Electrician'
          },
          {
            id: 'b5',
            service: 'Car Repair',
            provider: 'Tom Brown',
            date: '2024-11-30',
            time: '09:00',
            status: 'pending',
            amount: 2000,
            address: '123 Main St, Delhi',
            category: 'Mechanic'
          }
        ]
        setBookings(mockBookings)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'upcoming' && ['pending', 'confirmed'].includes(booking.status)) ||
      (filter === 'completed' && booking.status === 'completed') ||
      (filter === 'cancelled' && booking.status === 'cancelled')
    
    const matchesSearch = booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return '#10b981'
      case 'completed': return '#3b82f6'
      case 'in-progress': return '#f59e0b'
      case 'cancelled': return '#ef4444'
      default: return '#64748b'
    }
  }

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return '✓'
      case 'completed': return '✅'
      case 'in-progress': return '⚡'
      case 'cancelled': return '✕'
      default: return '⏳'
    }
  }

  if (loading) {
    return (
      <div className="profile-bookings">
        <div className="loading-container">
          <div className="loading-spinner">⏳</div>
          <p>Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-bookings">
      <div className="page-container">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>Manage and track all your service bookings</p>
        </div>

        <div className="bookings-controls">
          <div className="filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Bookings
            </button>
            <button
              className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button
              className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="bookings-stats">
          <div className="stat-card">
            <div className="stat-number">{bookings.filter(b => ['pending', 'confirmed', 'in-progress'].includes(b.status)).length}</div>
            <div className="stat-label">Active Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{bookings.filter(b => b.status === 'completed').length}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">₹{bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.amount, 0)}</div>
            <div className="stat-label">Total Spent</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{bookings.filter(b => b.rating).reduce((sum, b) => sum + (b.rating || 0), 0) / bookings.filter(b => b.rating).length || 0}</div>
            <div className="stat-label">Avg Rating</div>
          </div>
        </div>

        <div className="bookings-list">
          {filteredBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No bookings found</h3>
              <p>
                {searchQuery ? 'Try adjusting your search terms' : 
                 filter === 'all' ? 'You haven\'t made any bookings yet' :
                 `No ${filter} bookings found`}
              </p>
              {filter === 'all' && !searchQuery && (
                <Link to="/search" className="btn-primary">
                  Book a Service
                </Link>
              )}
            </div>
          ) : (
            filteredBookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-info">
                    <h3 className="booking-service">{booking.service}</h3>
                    <p className="booking-provider">{booking.provider}</p>
                  </div>
                  <div className="booking-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      <span className="status-icon">{getStatusIcon(booking.status)}</span>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="booking-details">
                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-text">{booking.date} at {booking.time}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">{booking.address}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🏷️</span>
                      <span className="detail-text">{booking.category}</span>
                    </div>
                  </div>
                  
                  <div className="booking-actions">
                    <div className="booking-amount">₹{booking.amount}</div>
                    <div className="action-buttons">
                      {booking.status === 'confirmed' && (
                        <>
                          <button className="btn-secondary">Reschedule</button>
                          <button className="btn-danger">Cancel</button>
                        </>
                      )}
                      {booking.status === 'completed' && !booking.rating && (
                        <button className="btn-primary">Leave Review</button>
                      )}
                      {booking.status === 'completed' && booking.rating && (
                        <div className="rating-display">
                          <span className="rating-stars">⭐{booking.rating}</span>
                          <span className="rating-text">Reviewed</span>
                        </div>
                      )}
                      {booking.status === 'pending' && (
                        <button className="btn-primary">Confirm Booking</button>
                      )}
                    </div>
                  </div>
                </div>
                
                {booking.review && (
                  <div className="booking-review">
                    <div className="review-header">
                      <span className="review-rating">⭐{booking.rating}</span>
                      <span className="review-title">Your Review</span>
                    </div>
                    <p className="review-text">{booking.review}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
