import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ProvidersAPI } from '../api/client'

interface Provider {
  id: string
  name: string
  email: string
  phone: string
  category: string
  rating?: number
  verified?: boolean
  services?: number
  description?: string
  address?: string
  city?: string
  experience?: number
  totalBookings?: number
  completedBookings?: number
  cancelledBookings?: number
  totalEarnings?: number
  averageResponseTime?: number
  availability?: {
    monday: { open: string; close: string }
    tuesday: { open: string; close: string }
    wednesday: { open: string; close: string }
    thursday: { open: string; close: string }
    friday: { open: string; close: string }
    saturday: { open: string; close: string }
    sunday: { open: string; close: string }
  }
  specialties?: string[]
  certifications?: string[]
  languages?: string[]
  profilePhoto?: string
  coverPhoto?: string
  businessName?: string
  businessLicense?: string
  insuranceVerified?: boolean
  backgroundChecked?: boolean
  emergencyService?: boolean
  serviceRadius?: number
  lastActive?: string
  joinedDate?: string
  responseRate?: number
  acceptanceRate?: number
  onTimeRate?: number
  pricing?: {
    hourlyRate?: number
    serviceFee?: number
    emergencyFee?: number
  }
  reviews?: {
    rating: number
    comment: string
    customerName: string
    date: string
    serviceType: string
  }[]
  upcomingBookings?: {
    id: string
    serviceName: string
    customerName: string
    datetime: string
    address: string
    amount: number
    status: string
  }[]
  recentActivity?: {
    type: 'booking' | 'review' | 'payment' | 'profile_update'
    message: string
    timestamp: string
    amount?: number
  }[]
  performance?: {
    monthlyRevenue: number[]
    bookingTrends: number[]
    ratingTrends: number[]
    responseTimeTrends: number[]
  }
}

interface DashboardStats {
  totalProviders: number
  verifiedProviders: number
  totalBookings: number
  totalRevenue: number
  averageRating: number
  averageResponseTime: number
  activeProviders: number
  newProvidersThisMonth: number
  topCategories: { category: string; count: number }[]
  growthRate: number
}

interface FilterOptions {
  status: 'all' | 'verified' | 'unverified' | 'active' | 'inactive'
  category: string
  rating: number
  availability: boolean
  emergencyService: boolean
  city: string
  sortBy: 'name' | 'rating' | 'bookings' | 'earnings' | 'responseTime'
  sortOrder: 'asc' | 'desc'
}

export default function ProviderDashboardAdvanced() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'analytics'>('grid')
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    category: 'all',
    rating: 0,
    availability: false,
    emergencyService: false,
    city: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  })

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🏠' },
    { value: 'plumbing', label: 'Plumbing', icon: '🔧' },
    { value: 'electrical', label: 'Electrical', icon: '⚡' },
    { value: 'cleaning', label: 'Cleaning', icon: '🧹' },
    { value: 'ac', label: 'AC Repair', icon: '❄️' },
    { value: 'mechanic', label: 'Mechanic', icon: '🚗' },
    { value: 'tutor', label: 'Tutor', icon: '📚' },
    { value: 'appliance', label: 'Appliance', icon: '🏪' },
    { value: 'painting', label: 'Painting', icon: '🎨' },
    { value: 'carpentry', label: 'Carpentry', icon: '🔨' },
    { value: 'gardening', label: 'Gardening', icon: '🌱' },
    { value: 'pest', label: 'Pest Control', icon: '🐜' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Providers', color: '#64748b' },
    { value: 'verified', label: 'Verified', color: '#10b981' },
    { value: 'unverified', label: 'Unverified', color: '#f59e0b' },
    { value: 'active', label: 'Active', color: '#3b82f6' },
    { value: 'inactive', label: 'Inactive', color: '#ef4444' }
  ]

  async function loadProviders() {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Enhanced mock data with comprehensive provider information
      const mockProviders: Provider[] = [
        {
          id: 'p1',
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@email.com',
          phone: '+91-9876543210',
          category: 'plumbing',
          rating: 4.8,
          verified: true,
          services: 12,
          description: 'Professional plumber with 10+ years of experience in residential and commercial plumbing services. Specialized in emergency repairs and installations.',
          address: '123, Main Street, Sector 15, Gurgaon',
          city: 'Gurgaon',
          experience: 10,
          totalBookings: 342,
          completedBookings: 318,
          cancelledBookings: 24,
          totalEarnings: 2450000,
          averageResponseTime: 15,
          availability: {
            monday: { open: '08:00', close: '20:00' },
            tuesday: { open: '08:00', close: '20:00' },
            wednesday: { open: '08:00', close: '20:00' },
            thursday: { open: '08:00', close: '20:00' },
            friday: { open: '08:00', close: '20:00' },
            saturday: { open: '09:00', close: '18:00' },
            sunday: { open: '10:00', close: '16:00' }
          },
          specialties: ['Emergency Plumbing', 'Pipe Installation', 'Drain Cleaning', 'Water Heater Repair'],
          certifications: ['Licensed Plumber', 'OSHA Certified', 'Green Plumbing Certified'],
          languages: ['English', 'Hindi', 'Punjabi'],
          profilePhoto: 'https://picsum.photos/200/200?random=50',
          coverPhoto: 'https://picsum.photos/800/400?random=150',
          businessName: 'Rajesh Plumbing Services',
          businessLicense: 'DL-PL-2021-1234',
          insuranceVerified: true,
          backgroundChecked: true,
          emergencyService: true,
          serviceRadius: 25,
          lastActive: new Date().toISOString(),
          joinedDate: '2021-03-15',
          responseRate: 98,
          acceptanceRate: 92,
          onTimeRate: 96,
          pricing: {
            hourlyRate: 500,
            serviceFee: 200,
            emergencyFee: 1000
          },
          reviews: [
            { rating: 5, comment: 'Excellent service! Fixed the leak quickly.', customerName: 'Amit Sharma', date: '2024-01-18', serviceType: 'Emergency Plumbing' },
            { rating: 4, comment: 'Professional and punctual.', customerName: 'Priya Singh', date: '2024-01-15', serviceType: 'Pipe Installation' }
          ],
          upcomingBookings: [
            { id: 'BK001', serviceName: 'Bathroom Repair', customerName: 'Vikram Malhotra', datetime: '2024-01-20T10:00:00', address: 'Sector 45, Gurgaon', amount: 1200, status: 'confirmed' },
            { id: 'BK002', serviceName: 'Kitchen Sink Installation', customerName: 'Neha Sharma', datetime: '2024-01-21T14:00:00', address: 'Sector 57, Gurgaon', amount: 1800, status: 'confirmed' }
          ],
          recentActivity: [
            { type: 'booking', message: 'New booking confirmed - Bathroom Repair', timestamp: new Date().toISOString(), amount: 1200 },
            { type: 'review', message: 'Received 5-star review from Amit Sharma', timestamp: '2024-01-18T16:45:00' },
            { type: 'payment', message: 'Payment received for booking BK001', timestamp: '2024-01-18T12:00:00', amount: 1500 }
          ],
          performance: {
            monthlyRevenue: [180000, 195000, 210000, 198000, 225000, 240000],
            bookingTrends: [28, 32, 35, 31, 38, 42],
            ratingTrends: [4.6, 4.7, 4.8, 4.7, 4.8, 4.8],
            responseTimeTrends: [18, 16, 15, 17, 15, 14]
          }
        },
        {
          id: 'p2',
          name: 'Amit Sharma',
          email: 'amit.sharma@email.com',
          phone: '+91-9876543211',
          category: 'electrical',
          rating: 4.6,
          verified: true,
          services: 8,
          description: 'Expert electrician specializing in residential and commercial electrical installations, repairs, and maintenance.',
          address: '456, Park Avenue, Sector 22, Gurgaon',
          city: 'Gurgaon',
          experience: 8,
          totalBookings: 256,
          completedBookings: 238,
          cancelledBookings: 18,
          totalEarnings: 1890000,
          averageResponseTime: 20,
          availability: {
            monday: { open: '09:00', close: '19:00' },
            tuesday: { open: '09:00', close: '19:00' },
            wednesday: { open: '09:00', close: '19:00' },
            thursday: { open: '09:00', close: '19:00' },
            friday: { open: '09:00', close: '19:00' },
            saturday: { open: '10:00', close: '17:00' },
            sunday: { open: 'closed', close: 'closed' }
          },
          specialties: ['Electrical Installation', 'Circuit Repair', 'Panel Upgrades', 'Lighting'],
          certifications: ['Licensed Electrician', 'Electrical Safety Certified'],
          languages: ['English', 'Hindi'],
          profilePhoto: 'https://picsum.photos/200/200?random=51',
          coverPhoto: 'https://picsum.photos/800/400?random=151',
          businessName: 'Amit Electrical Solutions',
          businessLicense: 'DL-EL-2020-5678',
          insuranceVerified: true,
          backgroundChecked: true,
          emergencyService: true,
          serviceRadius: 20,
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          joinedDate: '2020-06-20',
          responseRate: 95,
          acceptanceRate: 88,
          onTimeRate: 94,
          pricing: {
            hourlyRate: 600,
            serviceFee: 250,
            emergencyFee: 1200
          },
          reviews: [
            { rating: 5, comment: 'Quick and efficient service!', customerName: 'Rohit Gupta', date: '2024-01-17', serviceType: 'Circuit Repair' },
            { rating: 4, comment: 'Good work, reasonable pricing.', customerName: 'Kavita Reddy', date: '2024-01-14', serviceType: 'Lighting Installation' }
          ],
          upcomingBookings: [
            { id: 'BK003', serviceName: 'Panel Upgrade', customerName: 'Sanjay Kumar', datetime: '2024-01-20T09:00:00', address: 'Sector 31, Gurgaon', amount: 3500, status: 'confirmed' }
          ],
          recentActivity: [
            { type: 'booking', message: 'New booking - Panel Upgrade', timestamp: '2024-01-19T11:20:00', amount: 3500 },
            { type: 'review', message: 'Received 4-star review from Kavita Reddy', timestamp: '2024-01-17T18:30:00' }
          ],
          performance: {
            monthlyRevenue: [150000, 165000, 175000, 168000, 182000, 195000],
            bookingTrends: [22, 25, 27, 24, 28, 30],
            ratingTrends: [4.5, 4.6, 4.6, 4.5, 4.6, 4.6],
            responseTimeTrends: [22, 21, 20, 23, 20, 19]
          }
        },
        {
          id: 'p3',
          name: 'Priya Singh',
          email: 'priya.singh@email.com',
          phone: '+91-9876543212',
          category: 'cleaning',
          rating: 4.9,
          verified: true,
          services: 15,
          description: 'Professional cleaning services for homes and offices. Eco-friendly products and guaranteed satisfaction.',
          address: '789, Green Park, New Delhi',
          city: 'New Delhi',
          experience: 6,
          totalBookings: 412,
          completedBookings: 398,
          cancelledBookings: 14,
          totalEarnings: 1680000,
          averageResponseTime: 12,
          availability: {
            monday: { open: '07:00', close: '21:00' },
            tuesday: { open: '07:00', close: '21:00' },
            wednesday: { open: '07:00', close: '21:00' },
            thursday: { open: '07:00', close: '21:00' },
            friday: { open: '07:00', close: '21:00' },
            saturday: { open: '08:00', close: '20:00' },
            sunday: { open: '09:00', close: '18:00' }
          },
          specialties: ['Deep Cleaning', 'Office Cleaning', 'Carpet Cleaning', 'Post-Construction Cleaning'],
          certifications: ['Green Cleaning Certified', 'Sanitation Certified'],
          languages: ['English', 'Hindi'],
          profilePhoto: 'https://picsum.photos/200/200?random=52',
          coverPhoto: 'https://picsum.photos/800/400?random=152',
          businessName: 'Priya Cleaning Services',
          businessLicense: 'DL-CL-2022-9012',
          insuranceVerified: true,
          backgroundChecked: true,
          emergencyService: false,
          serviceRadius: 15,
          lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          joinedDate: '2022-01-10',
          responseRate: 99,
          acceptanceRate: 95,
          onTimeRate: 98,
          pricing: {
            hourlyRate: 400,
            serviceFee: 150,
            emergencyFee: 0
          },
          reviews: [
            { rating: 5, comment: 'Amazing cleaning service! Very thorough.', customerName: 'Anita Verma', date: '2024-01-19', serviceType: 'Deep Cleaning' },
            { rating: 5, comment: 'Professional and eco-friendly.', customerName: 'Rohit Gupta', date: '2024-01-16', serviceType: 'Office Cleaning' }
          ],
          upcomingBookings: [
            { id: 'BK004', serviceName: 'Office Deep Cleaning', customerName: 'Tech Solutions Pvt Ltd', datetime: '2024-01-20T08:00:00', address: 'Cyber City, Gurgaon', amount: 5000, status: 'confirmed' },
            { id: 'BK005', serviceName: 'Carpet Cleaning', customerName: 'Vikram Malhotra', datetime: '2024-01-21T15:00:00', address: 'Sector 45, Gurgaon', amount: 1200, status: 'confirmed' }
          ],
          recentActivity: [
            { type: 'booking', message: 'Corporate booking - Office Deep Cleaning', timestamp: new Date().toISOString(), amount: 5000 },
            { type: 'review', message: 'Received 5-star review from Anita Verma', timestamp: '2024-01-19T12:15:00' }
          ],
          performance: {
            monthlyRevenue: [120000, 135000, 145000, 138000, 152000, 165000],
            bookingTrends: [35, 38, 42, 40, 45, 48],
            ratingTrends: [4.8, 4.9, 4.9, 4.8, 4.9, 4.9],
            responseTimeTrends: [15, 14, 13, 15, 12, 11]
          }
        },
        {
          id: 'p4',
          name: 'Sanjay Kumar',
          email: 'sanjay.kumar@email.com',
          phone: '+91-9876543213',
          category: 'ac',
          rating: 4.5,
          verified: false,
          services: 6,
          description: 'AC repair and maintenance specialist. All brands serviced with genuine parts.',
          address: '321, Sushant Lok Phase 1, Gurgaon',
          city: 'Gurgaon',
          experience: 5,
          totalBookings: 156,
          completedBookings: 142,
          cancelledBookings: 14,
          totalEarnings: 980000,
          averageResponseTime: 25,
          availability: {
            monday: { open: '10:00', close: '20:00' },
            tuesday: { open: '10:00', close: '20:00' },
            wednesday: { open: '10:00', close: '20:00' },
            thursday: { open: '10:00', close: '20:00' },
            friday: { open: '10:00', close: '20:00' },
            saturday: { open: '11:00', close: '18:00' },
            sunday: { open: 'closed', close: 'closed' }
          },
          specialties: ['AC Repair', 'Installation', 'Gas Refilling', 'Annual Maintenance'],
          certifications: ['AC Technician Certified'],
          languages: ['English', 'Hindi'],
          profilePhoto: 'https://picsum.photos/200/200?random=53',
          coverPhoto: 'https://picsum.photos/800/400?random=153',
          businessName: 'Sanjay AC Services',
          businessLicense: 'DL-AC-2021-3456',
          insuranceVerified: false,
          backgroundChecked: false,
          emergencyService: true,
          serviceRadius: 18,
          lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          joinedDate: '2021-09-15',
          responseRate: 88,
          acceptanceRate: 82,
          onTimeRate: 85,
          pricing: {
            hourlyRate: 450,
            serviceFee: 200,
            emergencyFee: 800
          },
          reviews: [
            { rating: 4, comment: 'Good service, arrived on time.', customerName: 'Arun Singh', date: '2024-01-16', serviceType: 'AC Repair' },
            { rating: 4, comment: 'Reasonable pricing.', customerName: 'Kavita Reddy', date: '2024-01-13', serviceType: 'Gas Refilling' }
          ],
          upcomingBookings: [
            { id: 'BK006', serviceName: 'AC Annual Maintenance', customerName: 'Neha Sharma', datetime: '2024-01-22T11:00:00', address: 'Sector 57, Gurgaon', amount: 1500, status: 'pending' }
          ],
          recentActivity: [
            { type: 'booking', message: 'New booking request - AC Maintenance', timestamp: '2024-01-18T16:20:00' },
            { type: 'review', message: 'Received 4-star review from Arun Singh', timestamp: '2024-01-16T19:45:00' }
          ],
          performance: {
            monthlyRevenue: [75000, 82000, 88000, 85000, 92000, 98000],
            bookingTrends: [18, 20, 22, 21, 24, 26],
            ratingTrends: [4.4, 4.5, 4.5, 4.4, 4.5, 4.5],
            responseTimeTrends: [28, 26, 25, 27, 25, 24]
          }
        }
      ]
      
      setProviders(mockProviders)
    } catch (error) {
      console.error('Failed to load providers:', error)
      setError('Failed to load providers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo((): DashboardStats => {
    const totalProviders = providers.length
    const verifiedProviders = providers.filter(p => p.verified).length
    const totalBookings = providers.reduce((sum, p) => sum + (p.totalBookings || 0), 0)
    const totalRevenue = providers.reduce((sum, p) => sum + (p.totalEarnings || 0), 0)
    const averageRating = providers.length > 0 
      ? providers.reduce((sum, p) => sum + (p.rating || 0), 0) / providers.length 
      : 0
    const averageResponseTime = providers.length > 0
      ? providers.reduce((sum, p) => sum + (p.averageResponseTime || 0), 0) / providers.length
      : 0
    const activeProviders = providers.filter(p => {
      const lastActive = new Date(p.lastActive || '')
      const now = new Date()
      const daysDiff = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
      return daysDiff <= 7
    }).length
    const newProvidersThisMonth = providers.filter(p => {
      const joinedDate = new Date(p.joinedDate || '')
      const now = new Date()
      return joinedDate.getMonth() === now.getMonth() && joinedDate.getFullYear() === now.getFullYear()
    }).length

    const categoryCount: { [key: string]: number } = {}
    providers.forEach(p => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1
    })
    const topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const growthRate = 15.5 // Mock growth rate

    return {
      totalProviders,
      verifiedProviders,
      totalBookings,
      totalRevenue,
      averageRating,
      averageResponseTime,
      activeProviders,
      newProvidersThisMonth,
      topCategories,
      growthRate
    }
  }, [providers])

  const filteredProviders = useMemo(() => {
    let filtered = providers

    // Apply filters
    if (filters.status !== 'all') {
      if (filters.status === 'verified') {
        filtered = filtered.filter(p => p.verified)
      } else if (filters.status === 'unverified') {
        filtered = filtered.filter(p => !p.verified)
      } else if (filters.status === 'active') {
        filtered = filtered.filter(p => {
          const lastActive = new Date(p.lastActive || '')
          const now = new Date()
          const daysDiff = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
          return daysDiff <= 7
        })
      } else if (filters.status === 'inactive') {
        filtered = filtered.filter(p => {
          const lastActive = new Date(p.lastActive || '')
          const now = new Date()
          const daysDiff = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
          return daysDiff > 7
        })
      }
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category)
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(p => (p.rating || 0) >= filters.rating)
    }

    if (filters.availability) {
      filtered = filtered.filter(p => p.availability)
    }

    if (filters.emergencyService) {
      filtered = filtered.filter(p => p.emergencyService)
    }

    if (filters.city !== 'all') {
      filtered = filtered.filter(p => p.city === filters.city)
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.phone.includes(query) ||
        p.businessName?.toLowerCase().includes(query) ||
        p.address?.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0)
          break
        case 'bookings':
          comparison = (a.totalBookings || 0) - (b.totalBookings || 0)
          break
        case 'earnings':
          comparison = (a.totalEarnings || 0) - (b.totalEarnings || 0)
          break
        case 'responseTime':
          comparison = (a.averageResponseTime || 0) - (b.averageResponseTime || 0)
          break
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [providers, filters, searchQuery])

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function getRelativeTime(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return formatDate(dateString)
  }

  function handleViewDetails(provider: Provider) {
    setSelectedProvider(provider)
    setShowDetailsModal(true)
  }

  function handleViewAnalytics(provider: Provider) {
    setSelectedProvider(provider)
    setShowAnalyticsModal(true)
  }

  function handleVerifyProvider(provider: Provider) {
    // Handle verification - update provider status
    setProviders(prevProviders => 
      prevProviders.map(p => 
        p.id === provider.id 
          ? { ...p, verified: true, backgroundChecked: true, insuranceVerified: true }
          : p
      )
    )
    
    // Show success message
    alert(`Provider ${provider.name} has been verified successfully!`)
  }

  function handleSuspendProvider(provider: Provider) {
    // Handle suspension - confirm and update provider status
    const confirmSuspension = window.confirm(
      `Are you sure you want to suspend ${provider.name}? This action can be reversed later.`
    )
    
    if (confirmSuspension) {
      setProviders(prevProviders => 
        prevProviders.map(p => 
          p.id === provider.id 
            ? { ...p, verified: false, lastActive: new Date(2020, 0, 1).toISOString() }
            : p
        )
      )
      
      alert(`Provider ${provider.name} has been suspended.`)
    }
  }

  function handleSendMessage(provider: Provider) {
    // Handle messaging - open message modal or redirect
    const message = prompt(`Send message to ${provider.name}:`)
    if (message && message.trim()) {
      // In a real app, this would send the message via API
      console.log('Sending message to provider:', provider.id, message)
      alert(`Message sent to ${provider.name}: "${message}"`)
    }
  }

  function handleExportReport() {
    // Calculate current stats for export
    const totalProviders = providers.length
    const verifiedProviders = providers.filter(p => p.verified).length
    const totalBookings = providers.reduce((sum, p) => sum + (p.totalBookings || 0), 0)
    const totalRevenue = providers.reduce((sum, p) => sum + (p.totalEarnings || 0), 0)
    const averageRating = providers.length > 0 
      ? providers.reduce((sum, p) => sum + (p.rating || 0), 0) / providers.length 
      : 0
    const averageResponseTime = providers.length > 0
      ? providers.reduce((sum, p) => sum + (p.averageResponseTime || 0), 0) / providers.length
      : 0
    const activeProviders = providers.filter(p => {
      const lastActive = new Date(p.lastActive || '')
      const now = new Date()
      const daysDiff = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
      return daysDiff <= 7
    }).length
    const newProvidersThisMonth = providers.filter(p => {
      const joinedDate = new Date(p.joinedDate || '')
      const now = new Date()
      return joinedDate.getMonth() === now.getMonth() && joinedDate.getFullYear() === now.getFullYear()
    }).length

    const categoryCount: { [key: string]: number } = {}
    providers.forEach(p => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1
    })
    const topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const growthRate = 15.5

    const currentStats = {
      totalProviders,
      verifiedProviders,
      totalBookings,
      totalRevenue,
      averageRating,
      averageResponseTime,
      activeProviders,
      newProvidersThisMonth,
      topCategories,
      growthRate
    }

    // Handle export functionality
    const reportData = {
      generatedAt: new Date().toISOString(),
      stats: currentStats,
      providers: filteredProviders.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        category: p.category,
        rating: p.rating,
        verified: p.verified,
        totalBookings: p.totalBookings,
        totalEarnings: p.totalEarnings,
        responseRate: p.responseRate,
        city: p.city
      }))
    }
    
    // Create and download JSON file
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `provider-report-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    alert('Provider report exported successfully!')
  }

  function handleAddProvider() {
    // Handle adding new provider
    const newProvider: Provider = {
      id: `p${Date.now()}`,
      name: prompt('Provider Name:') || 'New Provider',
      email: prompt('Provider Email:') || 'provider@example.com',
      phone: prompt('Provider Phone:') || '+91-0000000000',
      category: prompt('Provider Category (plumbing/electrical/cleaning/etc):') || 'plumbing',
      rating: 0,
      verified: false,
      services: 0,
      description: prompt('Provider Description:') || 'New service provider',
      address: prompt('Provider Address:') || 'Address not provided',
      city: prompt('Provider City:') || 'Unknown',
      experience: parseInt(prompt('Years of Experience:') || '0'),
      totalBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      totalEarnings: 0,
      averageResponseTime: 30,
      businessName: prompt('Business Name:') || 'Business Name',
      emergencyService: confirm('Provides Emergency Service?'),
      serviceRadius: parseInt(prompt('Service Radius (km):') || '10'),
      lastActive: new Date().toISOString(),
      joinedDate: new Date().toISOString(),
      responseRate: 0,
      acceptanceRate: 0,
      onTimeRate: 0,
      profilePhoto: `https://picsum.photos/200/200?random=${Date.now()}`,
      specialties: [],
      certifications: [],
      languages: ['English', 'Hindi'],
      reviews: [],
      upcomingBookings: [],
      recentActivity: [{
        type: 'profile_update',
        message: 'Provider profile created',
        timestamp: new Date().toISOString()
      }]
    }
    
    setProviders(prevProviders => [...prevProviders, newProvider])
    alert(`Provider ${newProvider.name} added successfully!`)
  }

  function handleClearFilters() {
    setFilters({
      status: 'all',
      category: 'all',
      rating: 0,
      availability: false,
      emergencyService: false,
      city: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    })
    setSearchQuery('')
  }

  function handleRefreshData() {
    loadProviders()
  }

  useEffect(() => {
    loadProviders()
  }, [])

  return (
    <div className="provider-dashboard-advanced">
      {/* Header */}
      <section className="dashboard-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="dashboard-title">Provider Dashboard</h1>
            <p className="dashboard-subtitle">
              Manage and monitor all service providers in one place
            </p>
          </div>
          
          <div className="header-actions">
            <button className="export-btn" onClick={handleExportReport}>
              <span className="btn-icon">📊</span>
              <span>Export Report</span>
            </button>
            <button className="add-provider-btn" onClick={handleAddProvider}>
              <span className="btn-icon">➕</span>
              <span>Add Provider</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="dashboard-stats">
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalProviders}</div>
              <div className="stat-label">Total Providers</div>
              <div className="stat-change">+{stats.newProvidersThisMonth} this month</div>
            </div>
          </div>
          
          <div className="stat-card verified">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.verifiedProviders}</div>
              <div className="stat-label">Verified Providers</div>
              <div className="stat-change">
                {Math.round((stats.verifiedProviders / stats.totalProviders) * 100)}% verification rate
              </div>
            </div>
          </div>
          
          <div className="stat-card bookings">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalBookings.toLocaleString()}</div>
              <div className="stat-label">Total Bookings</div>
              <div className="stat-change">All time</div>
            </div>
          </div>
          
          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-number">{formatCurrency(stats.totalRevenue)}</div>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-change">+{stats.growthRate}% growth</div>
            </div>
          </div>
          
          <div className="stat-card rating">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-number">{parseFloat(stats.averageRating.toFixed(2))}</div>
              <div className="stat-label">Average Rating</div>
              <div className="stat-change">Platform average</div>
            </div>
          </div>
          
          <div className="stat-card response">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-number">{stats.averageResponseTime} min</div>
              <div className="stat-label">Avg Response Time</div>
              <div className="stat-change">Quick response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="top-categories">
        <div className="categories-content">
          <h3 className="section-title">Top Categories</h3>
          <div className="categories-grid">
            {stats.topCategories.map((cat, index) => (
              <div key={cat.category} className="category-card">
                <div className="category-info">
                  <span className="category-rank">#{index + 1}</span>
                  <div className="category-details">
                    <div className="category-name">{cat.category}</div>
                    <div className="category-count">{cat.count} providers</div>
                  </div>
                </div>
                <div className="category-progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${(cat.count / stats.totalProviders) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="dashboard-controls">
        <div className="controls-content">
          <div className="controls-row">
            {/* Search */}
            <div className="search-group">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search providers by name, email, phone..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="view-mode-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <span>⊞</span>
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <span>☰</span>
              </button>
              <button
                className={`view-btn ${viewMode === 'analytics' ? 'active' : ''}`}
                onClick={() => setViewMode('analytics')}
              >
                <span>📈</span>
              </button>
            </div>

            {/* Sort */}
            <div className="sort-group">
              <select
                value={filters.sortBy}
                onChange={e => setFilters({...filters, sortBy: e.target.value as any})}
                className="sort-select"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="bookings">Sort by Bookings</option>
                <option value="earnings">Sort by Earnings</option>
                <option value="responseTime">Sort by Response Time</option>
              </select>
              <button
                className={`sort-order ${filters.sortOrder}`}
                onClick={() => setFilters({...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'})}
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="advanced-filters">
            {/* Status Filter */}
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <div className="status-filters">
                {statusOptions.map(status => (
                  <button
                    key={status.value}
                    className={`status-filter-btn ${filters.status === status.value ? 'active' : ''}`}
                    onClick={() => setFilters({...filters, status: status.value as any})}
                    style={{ '--status-color': status.color } as React.CSSProperties}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                value={filters.category}
                onChange={e => setFilters({...filters, category: e.target.value})}
                className="category-select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <label className="filter-label">Minimum Rating</label>
              <select
                value={filters.rating}
                onChange={e => setFilters({...filters, rating: Number(e.target.value)})}
                className="rating-select"
              >
                <option value="0">All Ratings</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            {/* Additional Filters */}
            <div className="filter-group">
              <label className="filter-label">Additional Filters</label>
              <div className="checkbox-filters">
                <label className="checkbox-filter">
                  <input
                    type="checkbox"
                    checked={filters.availability}
                    onChange={e => setFilters({...filters, availability: e.target.checked})}
                  />
                  <span>Available Now</span>
                </label>
                <label className="checkbox-filter">
                  <input
                    type="checkbox"
                    checked={filters.emergencyService}
                    onChange={e => setFilters({...filters, emergencyService: e.target.checked})}
                  />
                  <span>Emergency Service</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="dashboard-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={handleRefreshData} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Providers List */}
      <section className="providers-list">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading providers...</p>
          </div>
        ) : filteredProviders.length > 0 ? (
          <>
            {/* Results Summary */}
            <div className="results-summary">
              <span className="results-count">
                Showing {filteredProviders.length} of {providers.length} providers
              </span>
              <div className="results-actions">
                <button 
                  className="clear-filters-btn"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Providers Grid/List */}
            <div className={`providers-container ${viewMode}`}>
              {filteredProviders.map(provider => (
                <div key={provider.id} className="provider-card">
                  {/* Provider Header */}
                  <div className="provider-header">
                    <div className="provider-info">
                      <div className="provider-photo-section">
                        <img 
                          src={provider.profilePhoto || 'https://picsum.photos/100/100?random=1'} 
                          alt={provider.name}
                          className="provider-photo"
                        />
                        <div className={`verification-badge ${provider.verified ? 'verified' : 'unverified'}`}>
                          {provider.verified ? '✅' : '⏳'}
                        </div>
                      </div>
                      
                      <div className="provider-details">
                        <h3 className="provider-name">{provider.name}</h3>
                        <p className="provider-business">{provider.businessName}</p>
                        <div className="provider-meta">
                          <span className="provider-category">{provider.category}</span>
                          <span className="provider-experience">{provider.experience} years exp.</span>
                        </div>
                        <div className="provider-rating">
                          <span className="rating-stars">
                            {'⭐'.repeat(Math.floor(provider.rating || 0))}
                          </span>
                          <span className="rating-value">{provider.rating ? parseFloat(provider.rating.toFixed(2)) : 'N/A'}</span>
                          <span className="rating-count">({provider.totalBookings} bookings)</span>
                        </div>
                      </div>
                    </div>

                    <div className="provider-stats">
                      <div className="stat-item">
                        <span className="stat-label">Revenue</span>
                        <span className="stat-value">{formatCurrency(provider.totalEarnings || 0)}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Response</span>
                        <span className="stat-value">{provider.averageResponseTime} min</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Success</span>
                        <span className="stat-value">
                          {provider.totalBookings ? Math.round(((provider.completedBookings || 0) / provider.totalBookings) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Provider Quick Info */}
                  <div className="provider-quick-info">
                    <div className="quick-info-item">
                      <span className="info-icon">📧</span>
                      <span className="info-value">{provider.email}</span>
                    </div>
                    <div className="quick-info-item">
                      <span className="info-icon">📞</span>
                      <span className="info-value">{provider.phone}</span>
                    </div>
                    <div className="quick-info-item">
                      <span className="info-icon">📍</span>
                      <span className="info-value">{provider.city}</span>
                    </div>
                    {provider.emergencyService && (
                      <div className="quick-info-item emergency">
                        <span className="info-icon">🚨</span>
                        <span className="info-value">Emergency Service</span>
                      </div>
                    )}
                  </div>

                  {/* Specialties */}
                  {provider.specialties && provider.specialties.length > 0 && (
                    <div className="provider-specialties">
                      <h4 className="specialties-title">Specialties</h4>
                      <div className="specialties-list">
                        {provider.specialties.slice(0, 3).map((specialty, index) => (
                          <span key={index} className="specialty-tag">{specialty}</span>
                        ))}
                        {provider.specialties.length > 3 && (
                          <span className="specialty-more">+{provider.specialties.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recent Activity */}
                  {provider.recentActivity && provider.recentActivity.length > 0 && (
                    <div className="provider-activity">
                      <h4 className="activity-title">Recent Activity</h4>
                      <div className="activity-list">
                        {provider.recentActivity.slice(0, 2).map((activity, index) => (
                          <div key={index} className="activity-item">
                            <span className={`activity-icon ${activity.type}`}>
                              {activity.type === 'booking' ? '📋' : 
                               activity.type === 'review' ? '⭐' : 
                               activity.type === 'payment' ? '💰' : '📝'}
                            </span>
                            <div className="activity-content">
                              <p className="activity-message">{activity.message}</p>
                              <span className="activity-time">{getRelativeTime(activity.timestamp)}</span>
                            </div>
                            {activity.amount && (
                              <span className="activity-amount">{formatCurrency(activity.amount)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Provider Actions */}
                  <div className="provider-actions">
                    <button 
                      className="action-btn details"
                      onClick={() => handleViewDetails(provider)}
                    >
                      View Details
                    </button>
                    <button 
                      className="action-btn analytics"
                      onClick={() => handleViewAnalytics(provider)}
                    >
                      Analytics
                    </button>
                    <button 
                      className="action-btn message"
                      onClick={() => handleSendMessage(provider)}
                    >
                      Message
                    </button>
                    {!provider.verified && (
                      <button 
                        className="action-btn verify"
                        onClick={() => handleVerifyProvider(provider)}
                      >
                        Verify
                      </button>
                    )}
                    <button 
                      className="action-btn suspend"
                      onClick={() => handleSuspendProvider(provider)}
                    >
                      Suspend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-providers">
            <div className="no-providers-icon">👥</div>
            <h3>No Providers Found</h3>
            <p>
              {searchQuery || filters.status !== 'all' || filters.category !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'No providers registered yet. Start by adding a new provider!'
              }
            </p>
            <button className="add-provider-btn" onClick={handleAddProvider}>
              <span className="btn-icon">➕</span>
              <span>Add First Provider</span>
            </button>
          </div>
        )}
      </section>

      {/* Modals */}
      {showDetailsModal && selectedProvider && (
        <ProviderDetailsModal 
          provider={selectedProvider}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
      
      {showAnalyticsModal && selectedProvider && (
        <ProviderAnalyticsModal 
          provider={selectedProvider}
          onClose={() => setShowAnalyticsModal(false)}
        />
      )}
    </div>
  )
}

// Modal Components
function ProviderDetailsModal({ provider, onClose }: { provider: Provider; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content provider-details-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Provider Details</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <div className="modal-body">
          {/* Detailed provider information */}
          <div className="provider-detail-section">
            <h3>Business Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Business Name</label>
                <span>{provider.businessName}</span>
              </div>
              <div className="detail-item">
                <label>License Number</label>
                <span>{provider.businessLicense}</span>
              </div>
              <div className="detail-item">
                <label>Service Radius</label>
                <span>{provider.serviceRadius} km</span>
              </div>
              <div className="detail-item">
                <label>Joined Date</label>
                <span>{provider.joinedDate ? new Date(provider.joinedDate).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="provider-detail-section">
            <h3>Performance Metrics</h3>
            <div className="performance-grid">
              <div className="performance-item">
                <div className="performance-value">{provider.responseRate}%</div>
                <div className="performance-label">Response Rate</div>
              </div>
              <div className="performance-item">
                <div className="performance-value">{provider.acceptanceRate}%</div>
                <div className="performance-label">Acceptance Rate</div>
              </div>
              <div className="performance-item">
                <div className="performance-value">{provider.onTimeRate}%</div>
                <div className="performance-label">On-Time Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProviderAnalyticsModal({ provider, onClose }: { provider: Provider; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content analytics-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Provider Analytics - {provider.name}</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <div className="modal-body">
          {/* Analytics charts and data */}
          <div className="analytics-section">
            <h3>Revenue Trends</h3>
            <div className="chart-placeholder">
              <p>Revenue chart would be displayed here</p>
            </div>
          </div>
          
          <div className="analytics-section">
            <h3>Booking Trends</h3>
            <div className="chart-placeholder">
              <p>Booking chart would be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
