import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '@/firebase/auth'

interface Review {
  id: string
  bookingId: string
  service: string
  provider: string
  rating: number
  comment: string
  date: string
  helpful: number
  response?: {
    comment: string
    date: string
  }
}

interface ProviderReview {
  id: string
  customerName: string
  customerAvatar?: string
  service: string
  rating: number
  comment: string
  date: string
  helpful: number
}

export default function ProfileReviews() {
  const [user, setUser] = useState<any>(null)
  const [myReviews, setMyReviews] = useState<Review[]>([])
  const [providerReviews, setProviderReviews] = useState<ProviderReview[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'my-reviews' | 'provider-reviews'>('my-reviews')
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    fiveStarReviews: 0,
    recentReviews: 0
  })

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        
        // Mock my reviews (as customer)
        const mockMyReviews: Review[] = [
          {
            id: 'r1',
            bookingId: 'b2',
            service: 'Home Cleaning',
            provider: 'Jane Smith',
            rating: 5,
            comment: 'Excellent service! Jane was very professional and thorough. The house looks amazing after the cleaning. Highly recommend!',
            date: '2024-11-20',
            helpful: 12,
            response: {
              comment: 'Thank you so much for your kind words! It was a pleasure working with you.',
              date: '2024-11-21'
            }
          },
          {
            id: 'r2',
            bookingId: 'b3',
            service: 'Plumbing Service',
            provider: 'Mike Johnson',
            rating: 4,
            comment: 'Good work overall. Mike fixed the plumbing issue quickly and efficiently. The only reason for 4 stars is that he was a bit late.',
            date: '2024-11-15',
            helpful: 8
          },
          {
            id: 'r3',
            bookingId: 'b1',
            service: 'AC Repair Service',
            provider: 'John Doe',
            rating: 5,
            comment: 'John did an excellent job repairing my AC. He was knowledgeable, professional, and the price was reasonable.',
            date: '2024-11-10',
            helpful: 15
          }
        ]
        
        // Mock provider reviews (as service provider)
        const mockProviderReviews: ProviderReview[] = [
          {
            id: 'pr1',
            customerName: 'Sarah Johnson',
            service: 'Web Development',
            rating: 5,
            comment: 'Amazing developer! Delivered the project on time and exceeded expectations. Communication was excellent throughout.',
            date: '2024-11-18',
            helpful: 23
          },
          {
            id: 'pr2',
            customerName: 'Raj Kumar',
            service: 'Mobile App Development',
            rating: 4,
            comment: 'Good work on the app development. Minor issues were addressed quickly. Would work with again.',
            date: '2024-11-12',
            helpful: 18
          },
          {
            id: 'pr3',
            customerName: 'Emily Davis',
            service: 'UI/UX Design',
            rating: 5,
            comment: 'Incredible design work! Really captured our brand essence perfectly. Highly creative and professional.',
            date: '2024-11-08',
            helpful: 31
          },
          {
            id: 'pr4',
            customerName: 'Amit Singh',
            service: 'Web Development',
            rating: 5,
            comment: 'Excellent technical skills and problem-solving ability. Delivered exactly what we needed.',
            date: '2024-11-05',
            helpful: 19
          }
        ]
        
        setMyReviews(mockMyReviews)
        setProviderReviews(mockProviderReviews)
        
        // Calculate stats
        const allReviews = [...mockMyReviews, ...mockProviderReviews]
        const totalReviews = allReviews.length
        const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        const fiveStarReviews = allReviews.filter(r => r.rating === 5).length
        const recentReviews = allReviews.filter(r => {
          const reviewDate = new Date(r.date)
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return reviewDate >= thirtyDaysAgo
        }).length
        
        setStats({
          totalReviews,
          averageRating,
          fiveStarReviews,
          recentReviews
        })
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : 'empty'}`}>
        ⭐
      </span>
    ))
  }

  const handleHelpful = (reviewId: string, type: 'my' | 'provider') => {
    if (type === 'my') {
      setMyReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { ...review, helpful: review.helpful + 1 }
            : review
        )
      )
    } else {
      setProviderReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { ...review, helpful: review.helpful + 1 }
            : review
        )
      )
    }
  }

  if (loading) {
    return (
      <div className="profile-reviews">
        <div className="loading-container">
          <div className="loading-spinner">⏳</div>
          <p>Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-reviews">
      <div className="page-container">
        <div className="page-header">
          <h1>Reviews & Ratings</h1>
          <p>Manage your reviews and see feedback from customers</p>
        </div>

        <div className="reviews-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.totalReviews}</div>
            <div className="stat-label">Total Reviews</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.averageRating.toFixed(1)}</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.fiveStarReviews}</div>
            <div className="stat-label">5-Star Reviews</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.recentReviews}</div>
            <div className="stat-label">Recent Reviews</div>
          </div>
        </div>

        <div className="review-tabs">
          <button
            className={`tab-btn ${activeTab === 'my-reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-reviews')}
          >
            My Reviews ({myReviews.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'provider-reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('provider-reviews')}
          >
            Customer Reviews ({providerReviews.length})
          </button>
        </div>

        {/* My Reviews Tab */}
        {activeTab === 'my-reviews' && (
          <div className="tab-content">
            <div className="reviews-header">
              <h2>Reviews I've Written</h2>
              <p>Your feedback helps service providers improve their services</p>
            </div>

            {myReviews.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">⭐</div>
                <h3>No Reviews Yet</h3>
                <p>Start reviewing services you've used to help others make informed decisions</p>
                <Link to="/bookings" className="btn-primary">
                  View Completed Bookings
                </Link>
              </div>
            ) : (
              <div className="reviews-list">
                {myReviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="review-service">
                        <h3>{review.service}</h3>
                        <p className="provider-name">with {review.provider}</p>
                      </div>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                        <span className="rating-number">{review.rating}.0</span>
                      </div>
                    </div>
                    
                    <div className="review-content">
                      <p className="review-comment">{review.comment}</p>
                    </div>
                    
                    <div className="review-meta">
                      <span className="review-date">{review.date}</span>
                      <div className="review-actions">
                        <button 
                          className="helpful-btn"
                          onClick={() => handleHelpful(review.id, 'my')}
                        >
                          👍 Helpful ({review.helpful})
                        </button>
                        <Link to={`/bookings/${review.bookingId}`} className="booking-link">
                          View Booking
                        </Link>
                      </div>
                    </div>
                    
                    {review.response && (
                      <div className="provider-response">
                        <div className="response-header">
                          <span className="response-label">Provider Response</span>
                          <span className="response-date">{review.response.date}</span>
                        </div>
                        <p className="response-comment">{review.response.comment}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Provider Reviews Tab */}
        {activeTab === 'provider-reviews' && (
          <div className="tab-content">
            <div className="reviews-header">
              <h2>Customer Reviews</h2>
              <p>Feedback from customers about your services</p>
            </div>

            {providerReviews.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No Customer Reviews Yet</h3>
                <p>Complete bookings to start receiving reviews from customers</p>
                <Link to="/provider" className="btn-primary">
                  Manage Services
                </Link>
              </div>
            ) : (
              <div className="reviews-list">
                {providerReviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="customer-info">
                        <div className="customer-avatar">
                          {review.customerAvatar ? (
                            <img src={review.customerAvatar} alt={review.customerName} />
                          ) : (
                            <span className="avatar-fallback">
                              {review.customerName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="customer-details">
                          <h4 className="customer-name">{review.customerName}</h4>
                          <p className="service-name">{review.service}</p>
                        </div>
                      </div>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                        <span className="rating-number">{review.rating}.0</span>
                      </div>
                    </div>
                    
                    <div className="review-content">
                      <p className="review-comment">{review.comment}</p>
                    </div>
                    
                    <div className="review-meta">
                      <span className="review-date">{review.date}</span>
                      <div className="review-actions">
                        <button 
                          className="helpful-btn"
                          onClick={() => handleHelpful(review.id, 'provider')}
                        >
                          👍 Helpful ({review.helpful})
                        </button>
                        <button className="btn-secondary">
                          💬 Respond
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rating Distribution */}
        <div className="rating-distribution">
          <h3>Rating Distribution</h3>
          <div className="distribution-chart">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = [...myReviews, ...providerReviews].filter(r => r.rating === rating).length
              const percentage = (count / [...myReviews, ...providerReviews].length) * 100
              return (
                <div key={rating} className="rating-bar">
                  <span className="rating-label">{rating} ⭐</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="rating-count">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
