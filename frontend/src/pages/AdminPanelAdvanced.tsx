import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

interface AdminStats {
  totalUsers: number
  totalProviders: number
  totalBookings: number
  totalRevenue: number
  activeUsers: number
  pendingVerifications: number
  supportTickets: number
  systemHealth: number
  monthlyGrowth: number
  userSatisfaction: number
  avgResponseTime: number
  serverUptime: number
  errorRate: number
}

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'customer' | 'provider' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  joinedDate: string
  lastActive: string
  totalBookings?: number
  totalSpent?: number
  verificationStatus?: 'verified' | 'pending' | 'rejected'
  rating?: number
  location: string
  device: string
  ip: string
}

interface Booking {
  id: string
  customerId: string
  providerId: string
  customerName: string
  providerName: string
  service: string
  category: string
  amount: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded'
  date: string
  time: string
  duration: number
  location: string
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded'
  paymentMethod: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  rating?: number
  review?: string
  issues?: string[]
}

interface SupportTicket {
  id: string
  userId: string
  userName: string
  userEmail: string
  subject: string
  category: 'technical' | 'billing' | 'account' | 'service' | 'complaint' | 'feedback'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  description: string
  createdAt: string
  updatedAt: string
  assignedTo?: string
  responses: number
  satisfaction?: number
}

interface SystemLog {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'critical'
  service: string
  message: string
  details?: string
  userId?: string
  ip?: string
  resolved?: boolean
}

interface FilterOptions {
  status: string
  role: string
  category: string
  priority: string
  dateRange: string
  searchQuery: string
}

export default function AdminPanelAdvanced() {
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([])
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bookings' | 'support' | 'analytics' | 'settings' | 'logs'>('overview')
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    role: 'all',
    category: 'all',
    priority: 'all',
    dateRange: 'all',
    searchQuery: ''
  })
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  async function loadDashboardData() {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock users data
      const mockUsers: User[] = [
        {
          id: 'u1',
          name: 'Rahul Sharma',
          email: 'rahul.sharma@email.com',
          phone: '+91-9876543210',
          role: 'customer',
          status: 'active',
          joinedDate: '2023-06-15',
          lastActive: new Date().toISOString(),
          totalBookings: 12,
          totalSpent: 45000,
          location: 'Gurgaon, Haryana',
          device: 'Mobile App',
          ip: '192.168.1.100'
        },
        {
          id: 'u2',
          name: 'Priya Singh',
          email: 'priya.singh@email.com',
          phone: '+91-9876543211',
          role: 'provider',
          status: 'active',
          joinedDate: '2023-04-20',
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          totalBookings: 156,
          verificationStatus: 'verified',
          rating: 4.8,
          location: 'New Delhi, Delhi',
          device: 'Web',
          ip: '192.168.1.101'
        },
        {
          id: 'u3',
          name: 'Amit Kumar',
          email: 'amit.kumar@email.com',
          phone: '+91-9876543212',
          role: 'customer',
          status: 'suspended',
          joinedDate: '2023-08-10',
          lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          totalBookings: 3,
          totalSpent: 8500,
          location: 'Mumbai, Maharashtra',
          device: 'Mobile App',
          ip: '192.168.1.102'
        },
        {
          id: 'u4',
          name: 'Neha Verma',
          email: 'neha.verma@email.com',
          phone: '+91-9876543213',
          role: 'provider',
          status: 'active',
          joinedDate: '2023-02-28',
          lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          totalBookings: 89,
          verificationStatus: 'pending',
          rating: 4.5,
          location: 'Bangalore, Karnataka',
          device: 'Web',
          ip: '192.168.1.103'
        }
      ]
      
      // Mock bookings data
      const mockBookings: Booking[] = [
        {
          id: 'b1',
          customerId: 'u1',
          providerId: 'u2',
          customerName: 'Rahul Sharma',
          providerName: 'Priya Singh',
          service: 'Home Cleaning',
          category: 'cleaning',
          amount: 1200,
          status: 'completed',
          date: '2024-01-18',
          time: '14:00',
          duration: 120,
          location: 'Sector 15, Gurgaon',
          paymentStatus: 'paid',
          paymentMethod: 'Credit Card',
          priority: 'medium',
          rating: 5
        },
        {
          id: 'b2',
          customerId: 'u3',
          providerId: 'u2',
          customerName: 'Amit Kumar',
          providerName: 'Priya Singh',
          service: 'AC Repair',
          category: 'ac',
          amount: 2500,
          status: 'in_progress',
          date: '2024-01-19',
          time: '10:00',
          duration: 90,
          location: 'Andheri, Mumbai',
          paymentStatus: 'pending',
          paymentMethod: 'UPI',
          priority: 'high',
          issues: ['Customer not responding to calls']
        },
        {
          id: 'b3',
          customerId: 'u1',
          providerId: 'u4',
          customerName: 'Rahul Sharma',
          providerName: 'Neha Verma',
          service: 'Plumbing Repair',
          category: 'plumbing',
          amount: 1800,
          status: 'cancelled',
          date: '2024-01-17',
          time: '16:00',
          duration: 60,
          location: 'Sector 45, Gurgaon',
          paymentStatus: 'refunded',
          paymentMethod: 'Net Banking',
          priority: 'low',
          issues: ['Provider cancelled due to emergency']
        }
      ]
      
      // Mock support tickets
      const mockSupportTickets: SupportTicket[] = [
        {
          id: 't1',
          userId: 'u1',
          userName: 'Rahul Sharma',
          userEmail: 'rahul.sharma@email.com',
          subject: 'Payment not processed',
          category: 'billing',
          priority: 'high',
          status: 'in_progress',
          description: 'My payment was deducted but booking shows as unpaid',
          createdAt: '2024-01-19T10:30:00',
          updatedAt: '2024-01-19T14:20:00',
          assignedTo: 'admin@service.com',
          responses: 3
        },
        {
          id: 't2',
          userId: 'u3',
          userName: 'Amit Kumar',
          userEmail: 'amit.kumar@email.com',
          subject: 'Account suspended',
          category: 'account',
          priority: 'urgent',
          status: 'open',
          description: 'My account was suspended without any reason',
          createdAt: '2024-01-19T16:45:00',
          updatedAt: '2024-01-19T16:45:00',
          responses: 0
        },
        {
          id: 't3',
          userId: 'u4',
          userName: 'Neha Verma',
          userEmail: 'neha.verma@email.com',
          subject: 'App not loading',
          category: 'technical',
          priority: 'medium',
          status: 'resolved',
          description: 'Mobile app crashes on startup',
          createdAt: '2024-01-18T09:15:00',
          updatedAt: '2024-01-18T17:30:00',
          assignedTo: 'tech@service.com',
          responses: 5,
          satisfaction: 4
        }
      ]
      
      // Mock system logs
      const mockSystemLogs: SystemLog[] = [
        {
          id: 'l1',
          timestamp: new Date().toISOString(),
          level: 'error',
          service: 'payment-gateway',
          message: 'Payment processing failed for booking b2',
          details: 'Transaction ID: txn_123456789',
          userId: 'u3',
          ip: '192.168.1.102',
          resolved: false
        },
        {
          id: 'l2',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          level: 'warning',
          service: 'auth-service',
          message: 'Multiple failed login attempts',
          details: '5 failed attempts from IP 192.168.1.50',
          ip: '192.168.1.50',
          resolved: true
        },
        {
          id: 'l3',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          level: 'info',
          service: 'booking-service',
          message: 'New booking created',
          details: 'Booking b4 created successfully',
          userId: 'u1',
          resolved: true
        }
      ]
      
      setUsers(mockUsers)
      setBookings(mockBookings)
      setSupportTickets(mockSupportTickets)
      setSystemLogs(mockSystemLogs)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo((): AdminStats => {
    const totalUsers = users.length
    const totalProviders = users.filter(u => u.role === 'provider').length
    const totalBookings = bookings.length
    const totalRevenue = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.amount, 0)
    const activeUsers = users.filter(u => {
      const lastActive = new Date(u.lastActive)
      const now = new Date()
      const daysDiff = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
      return daysDiff <= 7
    }).length
    const pendingVerifications = users.filter(u => u.verificationStatus === 'pending').length
    const openSupportTickets = supportTickets.filter((t: SupportTicket) => t.status !== 'resolved' && t.status !== 'closed').length
    const systemHealth = 95.2
    const monthlyGrowth = 12.5
    const userSatisfaction = 4.6
    const avgResponseTime = 2.8
    const serverUptime = 99.9
    const errorRate = 0.3

    return {
      totalUsers,
      totalProviders,
      totalBookings,
      totalRevenue,
      activeUsers,
      pendingVerifications,
      supportTickets: openSupportTickets,
      systemHealth,
      monthlyGrowth,
      userSatisfaction,
      avgResponseTime,
      serverUptime,
      errorRate
    }
  }, [users, bookings, supportTickets])

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  function formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function getTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return formatDate(dateString)
  }

  function handleUserAction(user: User, action: string) {
    setSelectedItem(user)
    
    switch (action) {
      case 'suspend':
        const confirmSuspend = window.confirm(`Suspend user ${user.name}?`)
        if (confirmSuspend) {
          setUsers(prevUsers => 
            prevUsers.map(u => 
              u.id === user.id ? { ...u, status: 'suspended' } : u
            )
          )
          alert(`User ${user.name} has been suspended`)
        }
        break
      case 'activate':
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === user.id ? { ...u, status: 'active' } : u
          )
        )
        alert(`User ${user.name} has been activated`)
        break
      case 'verify':
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === user.id ? { ...u, verificationStatus: 'verified' } : u
          )
        )
        alert(`Provider ${user.name} has been verified`)
        break
      case 'details':
        setShowModal(true)
        break
    }
  }

  function handleBookingAction(booking: Booking, action: string) {
    setSelectedItem(booking)
    
    switch (action) {
      case 'cancel':
        const confirmCancel = window.confirm(`Cancel booking ${booking.id}?`)
        if (confirmCancel) {
          setBookings(prevBookings => 
            prevBookings.map(b => 
              b.id === booking.id ? { ...b, status: 'cancelled' } : b
            )
          )
          alert(`Booking ${booking.id} has been cancelled`)
        }
        break
      case 'refund':
        setBookings(prevBookings => 
          prevBookings.map(b => 
            b.id === booking.id ? { ...b, paymentStatus: 'refunded' } : b
          )
        )
        alert(`Refund processed for booking ${booking.id}`)
        break
      case 'details':
        setShowModal(true)
        break
    }
  }

  function handleTicketAction(ticket: SupportTicket, action: string) {
    setSelectedItem(ticket)
    
    switch (action) {
      case 'assign':
        const assignedTo = prompt('Assign to (email):')
        if (assignedTo) {
          setSupportTickets(prevTickets => 
            prevTickets.map(t => 
              t.id === ticket.id ? { ...t, assignedTo, status: 'in_progress' } : t
            )
          )
          alert(`Ticket assigned to ${assignedTo}`)
        }
        break
      case 'resolve':
        setSupportTickets(prevTickets => 
          prevTickets.map(t => 
            t.id === ticket.id ? { ...t, status: 'resolved' } : t
          )
        )
        alert(`Ticket ${ticket.id} marked as resolved`)
        break
      case 'close':
        setSupportTickets(prevTickets => 
          prevTickets.map(t => 
            t.id === ticket.id ? { ...t, status: 'closed' } : t
          )
        )
        alert(`Ticket ${ticket.id} closed`)
        break
      case 'details':
        setShowModal(true)
        break
    }
  }

  function handleExportData(type: string) {
    let data: any = {}
    let filename = ''
    
    switch (type) {
      case 'users':
        data = users
        filename = `users-export-${new Date().toISOString().split('T')[0]}.json`
        break
      case 'bookings':
        data = bookings
        filename = `bookings-export-${new Date().toISOString().split('T')[0]}.json`
        break
      case 'tickets':
        data = supportTickets
        filename = `support-tickets-export-${new Date().toISOString().split('T')[0]}.json`
        break
      case 'all':
        data = { users, bookings, supportTickets, stats, exportedAt: new Date().toISOString() }
        filename = `admin-dashboard-export-${new Date().toISOString().split('T')[0]}.json`
        break
    }
    
    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', filename)
    linkElement.click()
    
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully!`)
  }

  function handleSystemAction(action: string) {
    switch (action) {
      case 'backup':
        alert('System backup initiated. You will receive an email when completed.')
        break
      case 'maintenance':
        const confirmMaintenance = window.confirm('Start maintenance mode? Users will be unable to access the system.')
        if (confirmMaintenance) {
          alert('Maintenance mode activated. System will be back online in 2 hours.')
        }
        break
      case 'restart':
        const confirmRestart = window.confirm('Restart system? This will temporarily interrupt service.')
        if (confirmRestart) {
          alert('System restart initiated. Service will resume in 5 minutes.')
        }
        break
      case 'cache-clear':
        alert('System cache cleared successfully.')
        break
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="admin-panel-advanced">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel-advanced">
      {/* Header */}
      <section className="admin-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Complete system administration and monitoring</p>
          </div>
          
          <div className="header-actions">
            <button className="system-action-btn" onClick={() => handleSystemAction('backup')}>
              <span className="btn-icon">💾</span>
              <span>Backup</span>
            </button>
            <button className="system-action-btn" onClick={() => handleSystemAction('maintenance')}>
              <span className="btn-icon">🔧</span>
              <span>Maintenance</span>
            </button>
            <button className="system-action-btn critical" onClick={() => handleSystemAction('restart')}>
              <span className="btn-icon">🔄</span>
              <span>Restart</span>
            </button>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="admin-navigation">
        <div className="nav-tabs">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'users', label: 'Users', icon: '👥' },
            { id: 'bookings', label: 'Bookings', icon: '📋' },
            { id: 'support', label: 'Support', icon: '💬' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'settings', label: 'Settings', icon: '⚙️' },
            { id: 'logs', label: 'System Logs', icon: '📝' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="admin-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={loadDashboardData} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <section className="admin-overview">
          {/* Key Metrics */}
          <div className="metrics-grid">
            <div className="metric-card primary">
              <div className="metric-icon">👥</div>
              <div className="metric-content">
                <div className="metric-number">{stats.totalUsers}</div>
                <div className="metric-label">Total Users</div>
                <div className="metric-change">+{stats.monthlyGrowth}% this month</div>
              </div>
            </div>
            
            <div className="metric-card success">
              <div className="metric-icon">📋</div>
              <div className="metric-content">
                <div className="metric-number">{stats.totalBookings}</div>
                <div className="metric-label">Total Bookings</div>
                <div className="metric-change">All time</div>
              </div>
            </div>
            
            <div className="metric-card warning">
              <div className="metric-icon">💰</div>
              <div className="metric-content">
                <div className="metric-number">{formatCurrency(stats.totalRevenue)}</div>
                <div className="metric-label">Total Revenue</div>
                <div className="metric-change">+{stats.monthlyGrowth}% growth</div>
              </div>
            </div>
            
            <div className="metric-card info">
              <div className="metric-icon">💬</div>
              <div className="metric-content">
                <div className="metric-number">{stats.supportTickets}</div>
                <div className="metric-label">Open Tickets</div>
                <div className="metric-change">Need attention</div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="system-health-section">
            <h2 className="section-title">System Health</h2>
            <div className="health-grid">
              <div className="health-item">
                <div className="health-label">System Health</div>
                <div className="health-bar">
                  <div className="health-fill" style={{ width: `${stats.systemHealth}%` }}></div>
                </div>
                <div className="health-value">{stats.systemHealth}%</div>
              </div>
              
              <div className="health-item">
                <div className="health-label">Server Uptime</div>
                <div className="health-bar">
                  <div className="health-fill excellent" style={{ width: `${stats.serverUptime}%` }}></div>
                </div>
                <div className="health-value">{stats.serverUptime}%</div>
              </div>
              
              <div className="health-item">
                <div className="health-label">Error Rate</div>
                <div className="health-bar">
                  <div className="health-fill warning" style={{ width: `${stats.errorRate * 10}%` }}></div>
                </div>
                <div className="health-value">{stats.errorRate}%</div>
              </div>
              
              <div className="health-item">
                <div className="health-label">User Satisfaction</div>
                <div className="health-bar">
                  <div className="health-fill good" style={{ width: `${(stats.userSatisfaction / 5) * 100}%` }}></div>
                </div>
                <div className="health-value">{stats.userSatisfaction}/5</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity-section">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              {systemLogs.slice(0, 5).map(log => (
                <div key={log.id} className={`activity-item ${log.level}`}>
                  <div className="activity-icon">
                    {log.level === 'error' && '❌'}
                    {log.level === 'warning' && '⚠️'}
                    {log.level === 'info' && 'ℹ️'}
                    {log.level === 'critical' && '🔴'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-message">{log.message}</div>
                    <div className="activity-details">{log.service} • {getTimeAgo(log.timestamp)}</div>
                  </div>
                  <div className="activity-status">
                    {log.resolved ? <span className="status-resolved">Resolved</span> : <span className="status-pending">Pending</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <section className="admin-users">
          <div className="section-header">
            <h2 className="section-title">User Management</h2>
            <div className="section-actions">
              <button className="export-btn" onClick={() => handleExportData('users')}>
                <span className="btn-icon">📊</span>
                <span>Export Users</span>
              </button>
            </div>
          </div>
          
          <div className="users-grid">
            {users.map(user => (
              <div key={user.id} className={`user-card ${user.status}`}>
                <div className="user-header">
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h3 className="user-name">{user.name}</h3>
                    <p className="user-email">{user.email}</p>
                    <div className="user-meta">
                      <span className={`user-role ${user.role}`}>{user.role}</span>
                      <span className={`user-status ${user.status}`}>{user.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="user-stats">
                  {user.role === 'customer' && (
                    <>
                      <div className="stat-item">
                        <span className="stat-label">Bookings</span>
                        <span className="stat-value">{user.totalBookings || 0}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Spent</span>
                        <span className="stat-value">{formatCurrency(user.totalSpent || 0)}</span>
                      </div>
                    </>
                  )}
                  {user.role === 'provider' && (
                    <>
                      <div className="stat-item">
                        <span className="stat-label">Bookings</span>
                        <span className="stat-value">{user.totalBookings || 0}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Rating</span>
                        <span className="stat-value">{user.rating ? parseFloat(user.rating.toFixed(2)) : 'N/A'}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Verification</span>
                        <span className="stat-value">{user.verificationStatus || 'N/A'}</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="user-details">
                  <div className="detail-item">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{user.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Active</span>
                    <span className="detail-value">{getTimeAgo(user.lastActive)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Device</span>
                    <span className="detail-value">{user.device}</span>
                  </div>
                </div>
                
                <div className="user-actions">
                  <button className="action-btn details" onClick={() => handleUserAction(user, 'details')}>
                    Details
                  </button>
                  {user.status === 'suspended' ? (
                    <button className="action-btn activate" onClick={() => handleUserAction(user, 'activate')}>
                      Activate
                    </button>
                  ) : (
                    <button className="action-btn suspend" onClick={() => handleUserAction(user, 'suspend')}>
                      Suspend
                    </button>
                  )}
                  {user.role === 'provider' && user.verificationStatus === 'pending' && (
                    <button className="action-btn verify" onClick={() => handleUserAction(user, 'verify')}>
                      Verify
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <section className="admin-bookings">
          <div className="section-header">
            <h2 className="section-title">Booking Management</h2>
            <div className="section-actions">
              <button className="export-btn" onClick={() => handleExportData('bookings')}>
                <span className="btn-icon">📊</span>
                <span>Export Bookings</span>
              </button>
            </div>
          </div>
          
          <div className="bookings-table">
            <div className="table-header">
              <div className="header-cell">Booking ID</div>
              <div className="header-cell">Customer</div>
              <div className="header-cell">Provider</div>
              <div className="header-cell">Service</div>
              <div className="header-cell">Amount</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Payment</div>
              <div className="header-cell">Priority</div>
              <div className="header-cell">Actions</div>
            </div>
            
            {bookings.map(booking => (
              <div key={booking.id} className="table-row">
                <div className="table-cell">
                  <span className="booking-id">#{booking.id}</span>
                </div>
                <div className="table-cell">
                  <div className="user-info">
                    <span className="user-name">{booking.customerName}</span>
                  </div>
                </div>
                <div className="table-cell">
                  <div className="user-info">
                    <span className="user-name">{booking.providerName}</span>
                  </div>
                </div>
                <div className="table-cell">
                  <div className="service-info">
                    <span className="service-name">{booking.service}</span>
                    <span className="service-category">{booking.category}</span>
                  </div>
                </div>
                <div className="table-cell">
                  <span className="amount">{formatCurrency(booking.amount)}</span>
                </div>
                <div className="table-cell">
                  <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                </div>
                <div className="table-cell">
                  <span className={`payment-status ${booking.paymentStatus}`}>{booking.paymentStatus}</span>
                </div>
                <div className="table-cell">
                  <span className={`priority-badge ${booking.priority}`}>{booking.priority}</span>
                </div>
                <div className="table-cell">
                  <div className="action-buttons">
                    <button className="action-btn details" onClick={() => handleBookingAction(booking, 'details')}>
                      View
                    </button>
                    {booking.status !== 'cancelled' && (
                      <button className="action-btn cancel" onClick={() => handleBookingAction(booking, 'cancel')}>
                        Cancel
                      </button>
                    )}
                    {booking.paymentStatus === 'paid' && (
                      <button className="action-btn refund" onClick={() => handleBookingAction(booking, 'refund')}>
                        Refund
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Support Tab */}
      {activeTab === 'support' && (
        <section className="admin-support">
          <div className="section-header">
            <h2 className="section-title">Support Tickets</h2>
            <div className="section-actions">
              <button className="export-btn" onClick={() => handleExportData('tickets')}>
                <span className="btn-icon">📊</span>
                <span>Export Tickets</span>
              </button>
            </div>
          </div>
          
          <div className="tickets-grid">
            {supportTickets.map(ticket => (
              <div key={ticket.id} className={`ticket-card ${ticket.priority} ${ticket.status}`}>
                <div className="ticket-header">
                  <div className="ticket-info">
                    <h3 className="ticket-subject">{ticket.subject}</h3>
                    <p className="ticket-meta">
                      {ticket.userName} • {ticket.userEmail} • {getTimeAgo(ticket.createdAt)}
                    </p>
                  </div>
                  <div className="ticket-badges">
                    <span className={`priority-badge ${ticket.priority}`}>{ticket.priority}</span>
                    <span className={`status-badge ${ticket.status}`}>{ticket.status}</span>
                  </div>
                </div>
                
                <div className="ticket-content">
                  <p className="ticket-description">{ticket.description}</p>
                  <div className="ticket-details">
                    <span className="ticket-category">{ticket.category}</span>
                    <span className="ticket-responses">{ticket.responses} responses</span>
                    {ticket.assignedTo && <span className="ticket-assigned">Assigned to {ticket.assignedTo}</span>}
                  </div>
                </div>
                
                <div className="ticket-actions">
                  <button className="action-btn details" onClick={() => handleTicketAction(ticket, 'details')}>
                    View Details
                  </button>
                  {ticket.status === 'open' && (
                    <button className="action-btn assign" onClick={() => handleTicketAction(ticket, 'assign')}>
                      Assign
                    </button>
                  )}
                  {ticket.status === 'in_progress' && (
                    <button className="action-btn resolve" onClick={() => handleTicketAction(ticket, 'resolve')}>
                      Resolve
                    </button>
                  )}
                  {ticket.status !== 'closed' && (
                    <button className="action-btn close" onClick={() => handleTicketAction(ticket, 'close')}>
                      Close
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <section className="admin-analytics">
          <div className="section-header">
            <h2 className="section-title">Analytics & Reports</h2>
            <div className="section-actions">
              <button className="export-btn" onClick={() => handleExportData('all')}>
                <span className="btn-icon">📊</span>
                <span>Export All Data</span>
              </button>
            </div>
          </div>
          
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>User Growth</h3>
              <div className="chart-placeholder">
                <p>User growth chart would be displayed here</p>
              </div>
            </div>
            
            <div className="analytics-card">
              <h3>Revenue Trends</h3>
              <div className="chart-placeholder">
                <p>Revenue trends chart would be displayed here</p>
              </div>
            </div>
            
            <div className="analytics-card">
              <h3>Service Categories</h3>
              <div className="chart-placeholder">
                <p>Service categories distribution would be displayed here</p>
              </div>
            </div>
            
            <div className="analytics-card">
              <h3>User Satisfaction</h3>
              <div className="chart-placeholder">
                <p>User satisfaction metrics would be displayed here</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <section className="admin-settings">
          <div className="section-header">
            <h2 className="section-title">System Settings</h2>
          </div>
          
          <div className="settings-grid">
            <div className="settings-card">
              <h3>General Settings</h3>
              <div className="setting-item">
                <label>System Maintenance Mode</label>
                <button className="setting-btn" onClick={() => handleSystemAction('maintenance')}>
                  Configure
                </button>
              </div>
              <div className="setting-item">
                <label>Backup Schedule</label>
                <button className="setting-btn" onClick={() => handleSystemAction('backup')}>
                  Configure
                </button>
              </div>
              <div className="setting-item">
                <label>Cache Management</label>
                <button className="setting-btn" onClick={() => handleSystemAction('cache-clear')}>
                  Clear Cache
                </button>
              </div>
            </div>
            
            <div className="settings-card">
              <h3>User Management</h3>
              <div className="setting-item">
                <label>User Registration</label>
                <select className="setting-select">
                  <option>Open</option>
                  <option>Invite Only</option>
                  <option>Closed</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Email Verification</label>
                <select className="setting-select">
                  <option>Required</option>
                  <option>Optional</option>
                  <option>Disabled</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Provider Verification</label>
                <select className="setting-select">
                  <option>Automatic</option>
                  <option>Manual Review</option>
                  <option>Document Required</option>
                </select>
              </div>
            </div>
            
            <div className="settings-card">
              <h3>Notification Settings</h3>
              <div className="setting-item">
                <label>Email Notifications</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="setting-item">
                <label>SMS Notifications</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="setting-item">
                <label>Push Notifications</label>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* System Logs Tab */}
      {activeTab === 'logs' && (
        <section className="admin-logs">
          <div className="section-header">
            <h2 className="section-title">System Logs</h2>
            <div className="section-actions">
              <button className="export-btn" onClick={() => handleExportData('logs')}>
                <span className="btn-icon">📊</span>
                <span>Export Logs</span>
              </button>
            </div>
          </div>
          
          <div className="logs-table">
            <div className="table-header">
              <div className="header-cell">Timestamp</div>
              <div className="header-cell">Level</div>
              <div className="header-cell">Service</div>
              <div className="header-cell">Message</div>
              <div className="header-cell">User ID</div>
              <div className="header-cell">IP Address</div>
              <div className="header-cell">Status</div>
            </div>
            
            {systemLogs.map(log => (
              <div key={log.id} className={`table-row ${log.level}`}>
                <div className="table-cell">
                  <span className="timestamp">{formatDate(log.timestamp)} {formatTime(log.timestamp)}</span>
                </div>
                <div className="table-cell">
                  <span className={`log-level ${log.level}`}>{log.level.toUpperCase()}</span>
                </div>
                <div className="table-cell">
                  <span className="service-name">{log.service}</span>
                </div>
                <div className="table-cell">
                  <span className="log-message">{log.message}</span>
                </div>
                <div className="table-cell">
                  <span className="user-id">{log.userId || 'N/A'}</span>
                </div>
                <div className="table-cell">
                  <span className="ip-address">{log.ip || 'N/A'}</span>
                </div>
                <div className="table-cell">
                  <span className={`log-status ${log.resolved ? 'resolved' : 'pending'}`}>
                    {log.resolved ? 'Resolved' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modal */}
      {showModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Details</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
