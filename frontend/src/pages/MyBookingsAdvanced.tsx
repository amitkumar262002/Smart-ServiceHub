import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/ProfilePages.css'

interface Booking {
  id: string
  service: string
  provider: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  price: string
  address: string
  paymentStatus: 'pending' | 'paid' | 'refunded'
}

export default function MyBookingsAdvanced() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all')

  useEffect(() => {
    // Simulate loading bookings
    const mockBookings: Booking[] = [
      {
        id: 'BK001',
        service: 'Plumbing Services',
        provider: 'Expert Plumbers Inc.',
        date: '2024-11-25',
        time: '10:00 AM',
        status: 'confirmed',
        price: '₹1,500',
        address: '123 Main St, Mumbai',
        paymentStatus: 'paid'
      },
      {
        id: 'BK002',
        service: 'Electrical Work',
        provider: 'Power Solutions',
        date: '2024-11-26',
        time: '2:00 PM',
        status: 'pending',
        price: '₹2,000',
        address: '456 Park Ave, Delhi',
        paymentStatus: 'pending'
      },
      {
        id: 'BK003',
        service: 'Home Cleaning',
        provider: 'Clean Team Pro',
        date: '2024-11-20',
        time: '9:00 AM',
        status: 'completed',
        price: '₹800',
        address: '789 Garden Rd, Bangalore',
        paymentStatus: 'paid'
      }
    ]

    setTimeout(() => {
      setBookings(mockBookings)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' || booking.status === filter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffc107'
      case 'confirmed': return '#28a745'
      case 'in-progress': return '#17a2b8'
      case 'completed': return '#6c757d'
      case 'cancelled': return '#dc3545'
      default: return '#6c757d'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending'
      case 'confirmed': return 'Confirmed'
      case 'in-progress': return 'In Progress'
      case 'completed': return 'Completed'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending'
      case 'paid': return 'Paid'
      case 'refunded': return 'Refunded'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="my-bookings-advanced">
      <div className="container">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>Manage and track all your service bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Bookings
          </button>
          <button
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-tab ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {/* Bookings List */}
        <div className="bookings-list">
          {filteredBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No bookings found</h3>
              <p>You don't have any {filter !== 'all' ? filter : ''} bookings yet.</p>
              <Link to="/services" className="btn-primary">
                Book a Service
              </Link>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-info">
                    <h3>{booking.service}</h3>
                    <p className="booking-id">Booking ID: {booking.id}</p>
                  </div>
                  <div className="booking-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-icon">👤</span>
                      <div>
                        <p className="detail-label">Provider</p>
                        <p className="detail-value">{booking.provider}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <div>
                        <p className="detail-label">Date & Time</p>
                        <p className="detail-value">{booking.date} at {booking.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <div>
                        <p className="detail-label">Address</p>
                        <p className="detail-value">{booking.address}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <div>
                        <p className="detail-label">Price</p>
                        <p className="detail-value">{booking.price}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="booking-footer">
                  <div className="payment-status">
                    <span className={`payment-badge ${booking.paymentStatus}`}>
                      Payment: {getPaymentStatusText(booking.paymentStatus)}
                    </span>
                  </div>
                  <div className="booking-actions">
                    {booking.status === 'pending' && (
                      <>
                        <button className="btn btn-outline">Cancel</button>
                        <button className="btn btn-primary">Confirm</button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <>
                        <button className="btn btn-outline">Reschedule</button>
                        <button className="btn btn-primary">Track</button>
                      </>
                    )}
                    {booking.status === 'in-progress' && (
                      <button className="btn btn-primary">Track Progress</button>
                    )}
                    {booking.status === 'completed' && (
                      <>
                        <button className="btn btn-outline">Book Again</button>
                        <button className="btn btn-primary">Leave Review</button>
                      </>
                    )}
                    <Link to={`/track/${booking.id}`} className="btn btn-secondary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/services" className="action-card">
              <span className="action-icon">🔧</span>
              <h4>Book New Service</h4>
              <p>Schedule a new service booking</p>
            </Link>
            <Link to="/profile" className="action-card">
              <span className="action-icon">👤</span>
              <h4>Update Profile</h4>
              <p>Manage your personal information</p>
            </Link>
            <Link to="/support/help-center" className="action-card">
              <span className="action-icon">💬</span>
              <h4>Get Help</h4>
              <p>Contact support for assistance</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
