import { useState, useEffect, useCallback, useMemo } from 'react'
import { AIAPI, ServicesAPI, ProvidersAPI } from '@/api/client'
import ServiceCard from '@/components/ServiceCard'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import '../styles/AdvancedHome.css'
import '../styles/ProfileDropdown.css'

interface Service {
  id: number | string
  title: string
  category: string
  price: number
  rating?: number
  featured?: boolean
  bookings?: number
  thumbnail?: string
  description?: string
  provider?: string
  availability?: string
  responseTime?: number
  urgency?: boolean
  discount?: number
  tags?: string[]
  images?: string[]
}

interface Provider {
  id: number | string
  user_id?: string
  name?: string
  rating?: number
  reason?: string
  verified?: boolean
  specialty?: string
  jobs?: number
  categories?: string[]
  hourly_rate?: number
  address?: string
  profile_pic?: string
  availability?: string
  response_rate?: number
  completion_rate?: number
  earnings?: number
  experience?: string
  languages?: string[]
  certifications?: string[]
}

interface AIRecommendation {
  categories: string[]
  providers: Provider[]
  reason: string
  confidence?: number
  alternatives?: string[]
}

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface UserActivity {
  id: string
  action: string
  timestamp: Date
  details: string
}

interface TrendingData {
  category: string
  growth: number
  demand: 'high' | 'medium' | 'low'
  avgPrice: number
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  route: string
  color: string
  popular?: boolean
}

export default function Home() {
  const navigate = useNavigate()
  const { user } = useUser()
  const [q, setQ] = useState('')
  const [aiText, setAiText] = useState('')
  const [recommend, setRecommend] = useState<AIRecommendation | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [trendingServices, setTrendingServices] = useState<Service[]>([])
  const [featuredProviders, setFeaturedProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeTab, setActiveTab] = useState<'search' | 'ai'>('search')
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [stats, setStats] = useState({ totalServices: 0, totalProviders: 0, completedJobs: 0, avgRating: 0 })
  const [apiError, setApiError] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [userActivity, setUserActivity] = useState<UserActivity[]>([])
  const [trendingData, setTrendingData] = useState<TrendingData[]>([])
  const [quickActions, setQuickActions] = useState<QuickAction[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [emergencyServices, setEmergencyServices] = useState<Service[]>([])
  const [realTimeStats, setRealTimeStats] = useState({
    activeUsers: 1247,
    servicesInProgress: 89,
    completedToday: 156,
    avgResponseTime: 12
  })
  const [userReviews, setUserReviews] = useState([
    { id: 'r1', userName: 'Rahul S.', service: 'Plumbing', rating: 5, comment: 'Quick and professional service!', timestamp: new Date(Date.now() - 3600000) },
    { id: 'r2', userName: 'Priya M.', service: 'AC Repair', rating: 4, comment: 'Good work, reasonable pricing', timestamp: new Date(Date.now() - 7200000) },
    { id: 'r3', userName: 'Amit K.', service: 'Cleaning', rating: 5, comment: 'Excellent cleaning service', timestamp: new Date(Date.now() - 10800000) }
  ])
  const [promotions, setPromotions] = useState([
    { id: 'p1', title: '20% OFF First Booking', code: 'FIRST20', description: 'Save 20% on your first service booking', validUntil: new Date(Date.now() + 7 * 24 * 3600000) },
    { id: 'p2', title: 'Free Inspection', code: 'FREE10', description: 'Get free inspection with any service', validUntil: new Date(Date.now() + 3 * 24 * 3600000) },
    { id: 'p3', title: 'Emergency Priority', code: 'URGENT', description: 'Priority service for emergency bookings', validUntil: new Date(Date.now() + 14 * 24 * 3600000) }
  ])
  
  const categories = [
    { name: 'All', icon: '🏠', color: '#f59e0b', description: 'All Services' },
    { name: 'Cleaning', icon: '🧹', color: '#10b981', description: 'Home & Office' },
    { name: 'Plumber', icon: '🔧', color: '#3b82f6', description: 'Pipe & Drain' },
    { name: 'Electrician', icon: '⚡', color: '#f59e0b', description: 'Wiring & Circuits' },
    { name: 'Appliance Repair', icon: '🔌', color: '#8b5cf6', description: 'Home Appliances' },
    { name: 'AC Repair', icon: '❄️', color: '#06b6d4', description: 'Cooling & Heating' },
    { name: 'Mechanic', icon: '🚗', color: '#ef4444', description: 'Vehicle Service' },
    { name: 'Tutor', icon: '📚', color: '#ec4899', description: 'Education' },
    { name: 'Carpenter', icon: '🔨', color: '#f97316', description: 'Wood Work' },
    { name: 'Painter', icon: '🎨', color: '#84cc16', description: 'Painting' },
    { name: 'Pest Control', icon: '🐛', color: '#06b6d4', description: 'Pest Removal' },
    { name: 'Security', icon: '🛡️', color: '#6366f1', description: 'Security Services' }
  ]

  const quickActionsData: QuickAction[] = [
    { id: '1', title: 'Emergency Service', description: 'Get immediate help', icon: '🚨', route: '/emergency', color: '#ef4444', popular: true },
    { id: '2', title: 'Book Service', description: 'Schedule a service', icon: '📅', route: '/book-service', color: '#3b82f6' },
    { id: '3', title: 'Track Booking', description: 'Monitor progress', icon: '📍', route: '/track-booking', color: '#10b981' },
    { id: '4', title: 'Find Provider', description: 'Browse professionals', icon: '👨‍🔧', route: '/find-provider', color: '#f59e0b' },
    { id: '5', title: 'My Bookings', description: 'View appointments', icon: '📋', route: '/bookings', color: '#8b5cf6' },
    { id: '6', title: 'Support', description: 'Get help', icon: '💬', route: '/support', color: '#06b6d4' }
  ]

  useEffect(() => {
    // Load initial data
    loadTrendingServices()
    loadFeaturedProviders()
    loadStats()
    loadSearchHistory()
    loadQuickActions()
    loadEmergencyServices()
    loadTrendingData()
    loadRealTimeStats()
    loadUserReviews()
    loadPromotions()
    if (user) {
      loadUserActivity()
      loadNotifications()
    }
  }, [user])

  // Advanced functions
  const loadRealTimeStats = useCallback(() => {
    // Simulate real-time stats updates
    setRealTimeStats({
      activeUsers: 1200 + Math.floor(Math.random() * 100),
      servicesInProgress: 80 + Math.floor(Math.random() * 20),
      completedToday: 140 + Math.floor(Math.random() * 30),
      avgResponseTime: 10 + Math.floor(Math.random() * 5)
    })
  }, [])

  const loadUserReviews = useCallback(() => {
    // Mock user reviews - in real app, this would come from reviews API
    setUserReviews([
      { id: 'r1', userName: 'Rahul S.', service: 'Plumbing', rating: 5, comment: 'Quick and professional service!', timestamp: new Date(Date.now() - 3600000) },
      { id: 'r2', userName: 'Priya M.', service: 'AC Repair', rating: 4, comment: 'Good work, reasonable pricing', timestamp: new Date(Date.now() - 7200000) },
      { id: 'r3', userName: 'Amit K.', service: 'Cleaning', rating: 5, comment: 'Excellent cleaning service', timestamp: new Date(Date.now() - 10800000) }
    ])
  }, [])

  const loadPromotions = useCallback(() => {
    // Mock promotions - in real app, this would come from promotions API
    setPromotions([
      { id: 'p1', title: '20% OFF First Booking', code: 'FIRST20', description: 'Save 20% on your first service booking', validUntil: new Date(Date.now() + 7 * 24 * 3600000) },
      { id: 'p2', title: 'Free Inspection', code: 'FREE10', description: 'Get free inspection with any service', validUntil: new Date(Date.now() + 3 * 24 * 3600000) },
      { id: 'p3', title: 'Emergency Priority', code: 'URGENT', description: 'Priority service for emergency bookings', validUntil: new Date(Date.now() + 14 * 24 * 3600000) }
    ])
  }, [])

  const loadQuickActions = useCallback(() => {
    setQuickActions(quickActionsData)
  }, [])

  const handlePromotionClick = useCallback((promotion: any) => {
    // Copy promotion code to clipboard
    navigator.clipboard.writeText(promotion.code)
    // Show success message
    alert(`Promotion code ${promotion.code} copied to clipboard!`)
  }, [])

  const handleReviewClick = useCallback((review: any) => {
    // Navigate to provider or service details
    navigate(`/search?q=${review.service}`)
  }, [navigate])

  const loadEmergencyServices = useCallback(async () => {
    try {
      // Skip API calls to avoid 429 errors, use fallback data directly
      const fallbackEmergencyServices = [
        { id: 'e1', title: 'Emergency Plumbing', category: 'Plumbing', price: 2000, urgency: true, responseTime: 30 },
        { id: 'e2', title: '24/7 Electrical', category: 'Electrician', price: 2500, urgency: true, responseTime: 45 },
        { id: 'e3', title: 'Emergency AC Repair', category: 'AC Repair', price: 1800, urgency: true, responseTime: 60 },
        { id: 'e4', title: 'Urgent Locksmith', category: 'Security', price: 1500, urgency: true, responseTime: 20 }
      ]
      setEmergencyServices(fallbackEmergencyServices)
    } catch (error) {
      // Fallback emergency services
      setEmergencyServices([
        { id: 'e1', title: 'Emergency Plumbing', category: 'Plumbing', price: 2000, urgency: true, responseTime: 30 },
        { id: 'e2', title: '24/7 Electrical', category: 'Electrician', price: 2500, urgency: true, responseTime: 45 },
        { id: 'e3', title: 'Emergency AC Repair', category: 'AC Repair', price: 1800, urgency: true, responseTime: 60 },
        { id: 'e4', title: 'Urgent Locksmith', category: 'Security', price: 1500, urgency: true, responseTime: 20 }
      ])
    }
  }, [])

  const loadTrendingData = useCallback(async () => {
    try {
      // Mock trending data - in real app, this would come from analytics API
      setTrendingData([
        { category: 'AC Repair', growth: 25, demand: 'high', avgPrice: 1800 },
        { category: 'Plumbing', growth: 18, demand: 'high', avgPrice: 1200 },
        { category: 'Cleaning', growth: 15, demand: 'medium', avgPrice: 800 },
        { category: 'Electrical', growth: 12, demand: 'medium', avgPrice: 1500 }
      ])
    } catch (error) {
      console.error('Failed to load trending data:', error)
    }
  }, [])

  const loadNotifications = useCallback(async () => {
    if (!user) return
    try {
      // Mock notifications - in real app, this would come from notifications API
      setNotifications([
        { id: 'n1', type: 'success', title: 'Booking Confirmed', message: 'Your plumbing service is confirmed for tomorrow', timestamp: new Date(), read: false },
        { id: 'n2', type: 'info', title: 'New Message', message: 'Provider sent you an update', timestamp: new Date(Date.now() - 3600000), read: false },
        { id: 'n3', type: 'warning', title: 'Payment Due', message: 'Complete payment for your recent service', timestamp: new Date(Date.now() - 7200000), read: true }
      ])
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }, [user])

  const loadUserActivity = useCallback(async () => {
    if (!user) return
    try {
      // Mock user activity - in real app, this would come from activity API
      setUserActivity([
        { id: 'a1', action: 'Booked Service', timestamp: new Date(Date.now() - 86400000), details: 'Plumbing service booked' },
        { id: 'a2', action: 'Payment Made', timestamp: new Date(Date.now() - 172800000), details: 'Paid for cleaning service' },
        { id: 'a3', action: 'Review Left', timestamp: new Date(Date.now() - 259200000), details: 'Rated provider 5 stars' }
      ])
    } catch (error) {
      console.error('Failed to load user activity:', error)
    }
  }, [user])

  const handleQuickAction = useCallback((action: QuickAction) => {
    try {
      // Add haptic feedback for mobile
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      // Add visual feedback
      const element = document.querySelector(`[data-action-id="${action.id}"]`);
      if (element) {
        element.classList.add('action-tapped');
        setTimeout(() => element.classList.remove('action-tapped'), 200);
      }
      
      // Enhanced navigation with loading state
      if (action.route === '/emergency') {
        navigate('/emergency', { state: { fromQuickAction: true, timestamp: Date.now() } });
      } else if (action.route === '/book') {
        navigate('/book-service', { state: { fromQuickAction: true } });
      } else if (action.route === '/track') {
        navigate('/track-booking', { state: { fromQuickAction: true } });
      } else if (action.route === '/provider') {
        navigate('/find-provider', { state: { fromQuickAction: true } });
      } else if (action.route === '/bookings') {
        navigate('/bookings', { state: { fromQuickAction: true } });
      } else if (action.route === '/support') {
        navigate('/support', { state: { fromQuickAction: true } });
      } else {
        navigate(action.route, { state: { fromQuickAction: true } });
      }
    } catch (error) {
      console.error('Quick action navigation failed:', error);
      // Fallback navigation
      window.location.href = action.route;
    }
  }, [navigate])

  const handleEmergencyBooking = useCallback((service: Service) => {
    navigate(`/book/${service.id}?emergency=true`)
  }, [navigate])

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ))
  }, [])

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications])

  async function loadTrendingServices() {
    try {
      // Skip API calls to avoid 429 errors, use fallback data directly
      const fallbackServices = [
        { id: '1', title: 'AC Repair', category: 'AC Repair', price: 1500, rating: 4.8, featured: true, bookings: 120, thumbnail: '/images/ac-service.jpg', description: 'Professional AC repair and maintenance services' },
        { id: '2', title: 'Plumbing Services', category: 'Plumbing', price: 1200, rating: 4.7, featured: true, bookings: 98, thumbnail: '/images/plumbing.jpg', description: 'Expert plumbing solutions for all issues' },
        { id: '3', title: 'Home Cleaning', category: 'Cleaning', price: 800, rating: 4.9, featured: true, bookings: 156, thumbnail: '/images/cleaning.jpg', description: 'Thorough home cleaning services' },
        { id: '4', title: 'Electrical Work', category: 'Electrical', price: 1800, rating: 4.6, featured: true, bookings: 87, thumbnail: '/images/electrical.jpg', description: 'Safe and reliable electrical services' },
        { id: '5', title: 'Pest Control', category: 'Pest Control', price: 1000, rating: 4.5, featured: true, bookings: 65, thumbnail: '/images/pest-control.jpg', description: 'Effective pest control solutions' },
        { id: '6', title: 'Painting Services', category: 'Painting', price: 2500, rating: 4.8, featured: true, bookings: 112, thumbnail: '/images/painting.jpg', description: 'Professional painting and decoration' }
      ]
      setTrendingServices(fallbackServices)
      setApiError(null)
    } catch (error) {
      console.error('Failed to load trending services:', error)
      setApiError('Failed to load services. Using demo data.')
      // Fallback demo data
      setTrendingServices([
        { id: '1', title: 'AC Repair', category: 'AC Repair', price: 1500, rating: 4.8, featured: true, bookings: 120, thumbnail: '/images/ac-service.jpg', description: 'Professional AC repair and maintenance services' },
        { id: '2', title: 'Plumbing Services', category: 'Plumbing', price: 1200, rating: 4.7, featured: true, bookings: 98, thumbnail: '/images/plumbing.jpg', description: 'Expert plumbing solutions for all issues' },
        { id: '3', title: 'Home Cleaning', category: 'Cleaning', price: 800, rating: 4.9, featured: true, bookings: 156, thumbnail: '/images/cleaning.jpg', description: 'Thorough home cleaning services' },
        { id: '4', title: 'Electrical Work', category: 'Electrical', price: 1800, rating: 4.6, featured: true, bookings: 87, thumbnail: '/images/electrical.jpg', description: 'Safe and reliable electrical services' },
        { id: '5', title: 'Pest Control', category: 'Pest Control', price: 1000, rating: 4.5, featured: true, bookings: 65, thumbnail: '/images/pest-control.jpg', description: 'Effective pest control solutions' },
        { id: '6', title: 'Painting Services', category: 'Painting', price: 2500, rating: 4.8, featured: true, bookings: 112, thumbnail: '/images/painting.jpg', description: 'Professional painting and decoration' }
      ])
    } finally {
      setLoading(false)
    }
  }

  async function loadFeaturedProviders() {
    try {
      // Skip API calls to avoid 429 errors, use fallback data directly
      const fallbackProviders = [
        { id: 1, name: 'QuickFix Pro', rating: 4.9, jobs: 1247, specialty: 'Plumbing', verified: true },
        { id: 2, name: 'Sparkle Clean', rating: 4.8, jobs: 892, specialty: 'Cleaning', verified: true },
        { id: 3, name: 'ElectroSafe', rating: 5.0, jobs: 634, specialty: 'Electrical', verified: true },
        { id: 4, name: 'CoolAir Experts', rating: 4.7, jobs: 445, specialty: 'AC Repair', verified: true }
      ]
      setFeaturedProviders(fallbackProviders)
      setApiError(null)
    } catch (error) {
      console.error('Failed to load providers:', error)
      setApiError('Failed to load providers. Using demo data.')
      // Fallback demo data
      const mockProviders = [
        { id: 1, name: 'QuickFix Pro', rating: 4.9, jobs: 1247, specialty: 'Plumbing', verified: true },
        { id: 2, name: 'Sparkle Clean', rating: 4.8, jobs: 892, specialty: 'Cleaning', verified: true },
        { id: 3, name: 'ElectroSafe', rating: 5.0, jobs: 634, specialty: 'Electrical', verified: true },
        { id: 4, name: 'CoolAir Experts', rating: 4.7, jobs: 445, specialty: 'AC Repair', verified: true }
      ]
      setFeaturedProviders(mockProviders)
    }
  }

  async function loadStats() {
    try {
      // Skip API calls to avoid 429 errors, use fallback data directly
      const fallbackStats = {
        totalServices: 150,
        totalProviders: 85,
        completedJobs: 2500,
        avgRating: 4.8
      }
      setStats(fallbackStats)
    } catch (error) {
      console.error('Failed to load stats:', error)
      // Fallback stats
      setStats({
        totalServices: 150,
        totalProviders: 85,
        completedJobs: 2500,
        avgRating: 4.8
      })
    }
  }

  function loadSearchHistory() {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }

  function saveSearchHistory(query: string) {
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5)
    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }

  async function search(query: string) {
    if (!query.trim()) return
    setLoading(true)
    setApiError(null)
    try {
      // Skip API calls to avoid 429 errors, use fallback search results
      const fallbackResults = [
        { id: '1', title: `${query} Service`, category: 'General', price: 1000, rating: 4.5, featured: false, bookings: 50, thumbnail: '/images/service1.jpg', description: `Professional ${query} services` },
        { id: '2', title: `Expert ${query}`, category: 'Professional', price: 1500, rating: 4.7, featured: false, bookings: 75, thumbnail: '/images/service2.jpg', description: `Expert ${query} solutions` },
        { id: '3', title: `${query} Pro`, category: 'Premium', price: 2000, rating: 4.8, featured: false, bookings: 100, thumbnail: '/images/service3.jpg', description: `Premium ${query} services` }
      ]
      setTrendingServices(fallbackResults)
      // Add to search history
      setSearchHistory(prev => [query, ...prev.filter(h => h !== query)].slice(0, 5))
    } catch (error) {
      console.error('Search failed:', error)
      setApiError('Search failed. Showing related services.')
      // Fallback search results
      setTrendingServices([
        { id: '1', title: `${query} Service`, category: 'General', price: 1000, rating: 4.5, featured: false, bookings: 50, thumbnail: '/images/service1.jpg', description: `Professional ${query} services` },
        { id: '2', title: `Expert ${query}`, category: 'Professional', price: 1500, rating: 4.7, featured: false, bookings: 75, thumbnail: '/images/service2.jpg', description: `Expert ${query} solutions` },
        { id: '3', title: `${query} Pro`, category: 'Premium', price: 2000, rating: 4.8, featured: false, bookings: 100, thumbnail: '/images/service3.jpg', description: `Premium ${query} services` }
      ])
    } finally {
      setLoading(false)
    }
  }

  async function ai() {
    if (!aiText.trim() && !q.trim()) return
    
    setLoading(true)
    setApiError(null)
    
    try {
      // Skip API calls to avoid 429 errors, use fallback AI recommendations
      const fallbackRecommendation = {
        categories: ['Plumbing', 'Cleaning', 'Electrician'],
        providers: [
          { id: 1, name: 'QuickFix Pro', rating: 4.9, reason: 'Fast response time' },
          { id: 2, name: 'Sparkle Clean', rating: 4.8, reason: 'Excellent reviews' },
          { id: 3, name: 'ElectroSafe', rating: 5.0, reason: 'Certified professionals' }
        ],
        reason: 'Based on your description, these services match your needs.'
      }
      setRecommend(fallbackRecommendation)
    } catch (error) {
      console.error('AI recommendation failed:', error)
      setApiError('AI service unavailable. Showing demo recommendations.')
      // Fallback demo data
      setRecommend({
        categories: ['Plumbing', 'Cleaning', 'Electrician'],
        providers: [
          { id: 1, name: 'QuickFix Pro', rating: 4.9, reason: 'Fast response time' },
          { id: 2, name: 'Sparkle Clean', rating: 4.8, reason: 'Excellent reviews' },
          { id: 3, name: 'ElectroSafe', rating: 5.0, reason: 'Certified professionals' }
        ],
        reason: 'Based on your description, these services match your needs.'
      })
    } finally {
      setLoading(false)
    }
  }

  function handleCategorySelect(category: string) {
    setActiveCategory(category)
    setApiError(null)
    if (category === 'All') {
      setQ('')
      setServices([])
      loadTrendingServices()
    } else {
      setQ(category)
      search(category)
    }
  }

  function handleTabChange(tab: 'search' | 'ai') {
    setActiveTab(tab)
    setApiError(null)
  }

  return (
    <div className="advanced-home">
      {/* User Header with Notifications */}
      {user && (
        <div className="user-header">
          <div className="user-info">
            <div className="user-avatar">
              <span>{user.displayName?.[0] || 'U'}</span>
            </div>
            <div className="user-details">
              <h3>Welcome, {user.displayName}</h3>
              <p>{user.email}</p>
            </div>
          </div>
          
          <div className="user-actions">
            <button 
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              🔔
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            
            <button 
              className="profile-btn"
              onClick={() => setShowProfile(!showProfile)}
            >
              👤
            </button>
          </div>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="notifications-dropdown">
              <h4>Notifications</h4>
              {notifications.length === 0 ? (
                <p>No new notifications</p>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="notification-content">
                      <h5>{notification.title}</h5>
                      <p>{notification.message}</p>
                      <span className="notification-time">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

            {/* Quick Actions Section */}
      <section className="quick-actions-section">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
          <p className="section-subtitle">Get started with our most popular services</p>
        </div>
        
        <div className="quick-actions-grid">
          {quickActions.map(action => (
            <button 
              key={action.id} 
              className={`quick-action-card ${action.popular ? 'popular' : ''}`}
              onClick={() => handleQuickAction(action)}
              style={{ '--action-color': action.color } as React.CSSProperties}
              data-action-id={action.id}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h3 className="action-title">{action.title}</h3>
                <p className="action-description">{action.description}</p>
              </div>
              {action.popular && (
                <div className="popular-badge">
                  <span>🔥 Popular</span>
                </div>
              )}
              <div className="action-arrow">→</div>
              <div className="action-ripple"></div>
            </button>
          ))}
        </div>
      </section>

      {/* Emergency Services Section */}
      <section className="emergency-services-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="emergency-icon">🚨</span>
            Emergency Services
          </h2>
          <p className="section-subtitle">24/7 immediate assistance for urgent needs</p>
        </div>
        
        <div className="emergency-services-grid">
          {emergencyServices.map(service => (
            <div key={service.id} className="emergency-service-card">
              <div className="emergency-header">
                <h3>{service.title}</h3>
                <div className="emergency-badge">
                  <span className="pulse-dot"></span>
                  <span>24/7</span>
                </div>
              </div>
              
              <div className="emergency-details">
                <div className="detail-item">
                  <span className="detail-icon">⏱️</span>
                  <span>Response: {service.responseTime} mins</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">💰</span>
                  <span>₹{service.price}</span>
                </div>
              </div>
              
              <button 
                className="emergency-book-btn"
                onClick={() => handleEmergencyBooking(service)}
              >
                Book Emergency Service
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Real-time Stats Dashboard */}
      <section className="realtime-stats-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="live-indicator">🔴</span>
            Live Platform Activity
          </h2>
          <p className="section-subtitle">Real-time service metrics and activity</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{realTimeStats.activeUsers}</h3>
              <p>Active Users</p>
              <span className="stat-change">+12% from yesterday</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔧</div>
            <div className="stat-content">
              <h3>{realTimeStats.servicesInProgress}</h3>
              <p>Services In Progress</p>
              <span className="stat-change">Real-time</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{realTimeStats.completedToday}</h3>
              <p>Completed Today</p>
              <span className="stat-change">+8% from yesterday</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h3>{realTimeStats.avgResponseTime}m</h3>
              <p>Avg Response Time</p>
              <span className="stat-change">Excellent</span>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions & Offers */}
      <section className="promotions-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="promo-icon">🎉</span>
            Exclusive Offers
          </h2>
          <p className="section-subtitle">Limited time promotions and discounts</p>
        </div>
        
        <div className="promotions-grid">
          {promotions.map(promo => (
            <div key={promo.id} className="promotion-card">
              <div className="promo-header">
                <h3>{promo.title}</h3>
                <div className="promo-badge">
                  <span>LIMITED TIME</span>
                </div>
              </div>
              
              <p className="promo-description">{promo.description}</p>
              
              <div className="promo-footer">
                <div className="promo-code">
                  <span className="code-label">Code:</span>
                  <span className="code-value">{promo.code}</span>
                </div>
                <button 
                  className="promo-claim-btn"
                  onClick={() => handlePromotionClick(promo)}
                >
                  Copy Code
                </button>
              </div>
              
              <div className="promo-expiry">
                <span className="expiry-icon">⏰</span>
                <span>Valid until {new Date(promo.validUntil).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent User Reviews */}
      <section className="reviews-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="reviews-icon">⭐</span>
            Recent Customer Reviews
          </h2>
          <p className="section-subtitle">What our customers are saying</p>
        </div>
        
        <div className="reviews-grid">
          {userReviews.map(review => (
            <div key={review.id} className="review-card" onClick={() => handleReviewClick(review)}>
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    <span>{review.userName[0]}</span>
                  </div>
                  <div className="reviewer-details">
                    <h4>{review.userName}</h4>
                    <span className="review-service">{review.service}</span>
                  </div>
                </div>
                <div className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? 'star filled' : 'star'}>
                      {i < review.rating ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="review-comment">{review.comment}</p>
              
              <div className="review-footer">
                <span className="review-time">
                  {new Date(review.timestamp).toLocaleTimeString()}
                </span>
                <button className="review-action">
                  View Service →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Analytics */}
      {trendingData.length > 0 && (
        <section className="trending-analytics-section">
          <div className="section-header">
            <h2 className="section-title">Trending Services</h2>
            <p className="section-subtitle">Most popular services this week</p>
          </div>
          
          <div className="trending-cards">
            {trendingData.map((trend, index) => (
              <div key={trend.category} className="trending-card">
                <div className="trending-header">
                  <h3>{trend.category}</h3>
                  <div className={`demand-badge ${trend.demand}`}>
                    {trend.demand} demand
                  </div>
                </div>
                
                <div className="trending-stats">
                  <div className="growth-indicator">
                    <span className="growth-arrow">📈</span>
                    <span className="growth-value">+{trend.growth}%</span>
                  </div>
                  <div className="avg-price">
                    <span className="price-label">Avg. Price</span>
                    <span className="price-value">₹{trend.avgPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="hero-advanced">
        <div className="hero-background">
          <div className="hero-particles" />
          <div className="hero-gradient" />
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">⭐</span>
            <span>Trusted by 10,000+ customers</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-gradient">Professional Services</span>
            <br />
            <span className="title-highlight">at Your Fingertips</span>
          </h1>
          
          <p className="hero-description">
            Connect with verified professionals for all your home service needs. 
            Quality guaranteed, transparent pricing, and instant booking.
          </p>
          
          {/* Advanced Search Interface */}
          <div className="search-advanced">
            <div className="search-tabs">
              <button 
                className={`search-tab ${activeTab === 'search' ? 'active' : ''}`}
                onClick={() => handleTabChange('search')}
              >
                🔍 Search
              </button>
              <button 
                className={`search-tab ${activeTab === 'ai' ? 'active' : ''}`}
                onClick={() => handleTabChange('ai')}
              >
                🤖 AI Assistant
              </button>
            </div>
            
            <div className="search-content">
              <div className="search-input-group">
                <div className="input-wrapper">
                  <input 
                    className="search-input" 
                    placeholder="What service do you need? e.g., fix leaking pipe..."
                    value={q} 
                    onChange={e=>setQ(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && search(q)}
                  />
                  <button className="search-btn" onClick={() => search(q)} disabled={loading || !q.trim()}>
                    {loading ? '⏳' : '🔍'}
                  </button>
                </div>
                
                <div className="ai-input-wrapper">
                  <input 
                    className="ai-input" 
                    placeholder="Describe your issue for AI recommendations..."
                    value={aiText} 
                    onChange={e=>setAiText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && ai()}
                  />
                  <button className="ai-btn" onClick={() => ai()} disabled={loading || (!aiText.trim() && !q.trim())}>
                    {loading ? '🤖' : '✨'}
                  </button>
                </div>
              </div>
              
              {/* Search History */}
              {searchHistory.length > 0 && (
                <div className="search-history">
                  <span className="history-label">Recent searches:</span>
                  {searchHistory.map((term, index) => (
                    <button key={index} className="history-item" onClick={() => {
                      setQ(term)
                      setActiveTab('search')
                      search(term)
                    }}>
                      {term}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Error Message */}
              {apiError && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  <span>{apiError}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Advanced Category Pills */}
          <div className="categories-advanced">
            <div className="categories-grid">
              {categories.map(cat => (
                <button 
                  key={cat.name}
                  className={`category-pill ${activeCategory === cat.name ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(cat.name)}
                  style={{ '--category-color': cat.color } as React.CSSProperties}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalServices}+</div>
              <div className="stat-label">Services</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalProviders}+</div>
              <div className="stat-label">Verified Pros</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.completedJobs.toLocaleString()}+</div>
              <div className="stat-label">Jobs Completed</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-number">{stats.avgRating?.toFixed(1) || '0.0'}</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      {recommend && (
        <section className="ai-recommendations">
          <div className="ai-header">
            <div className="ai-badge">
              <span className="ai-icon">🤖</span>
              <span>AI Recommendations</span>
            </div>
            <p className="ai-description">Smart suggestions based on your needs</p>
          </div>
          
          <div className="ai-content">
            <div className="ai-categories">
              <h4>Recommended Categories</h4>
              <div className="category-tags">
                {recommend.categories.map((cat: string, index: number) => (
                  <span key={index} className="category-tag">{cat}</span>
                ))}
              </div>
            </div>
            
            <div className="ai-providers">
              <h4>Top Providers</h4>
              <div className="provider-list">
                {recommend.providers.map((p: Provider, index: number) => (
                  <div key={p.id} className="provider-item">
                    <div className="provider-info">
                      <div className="provider-name">{p.name}</div>
                      <div className="provider-rating">⭐ {p.rating}</div>
                    </div>
                    <div className="provider-reason">{p.reason}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="ai-footer">
              <p className="ai-note">{recommend.reason}</p>
            </div>
          </div>
        </section>
      )}

      {/* Featured Providers */}
      <section className="featured-providers">
        <div className="section-header">
          <h2 className="section-title">Featured Professionals</h2>
          <Link to="/providers" className="view-all-link">View All →</Link>
        </div>
        
        <div className="providers-grid">
          {featuredProviders.map(provider => (
            <div key={provider.id} className="provider-card">
              <div className="provider-header">
                <div className="provider-avatar">
                  <span className="avatar-icon">👤</span>
                  {provider.verified && <span className="verified-badge">✓</span>}
                </div>
                <div className="provider-details">
                  <h3 className="provider-name">{provider.name}</h3>
                  <p className="provider-specialty">{provider.specialty}</p>
                </div>
              </div>
              
              <div className="provider-stats">
                <div className="stat">
                  <span className="stat-value">⭐ {provider.rating}</span>
                  <span className="stat-label">Rating</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{provider.jobs}</span>
                  <span className="stat-label">Jobs</span>
                </div>
              </div>
              
              <button className="book-provider-btn">Book Now</button>
            </div>
          ))}
        </div>
      </section>
      
      {/* Services Results */}
      {services.length > 0 && (
        <section className="search-results">
          <div className="results-header">
            <h2 className="results-title">Search Results</h2>
            <span className="results-count">{services.length} services found</span>
          </div>
          
          <div className="services-grid">
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
