import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'

// Advanced booking interfaces
interface Booking {
  id: string
  serviceId: string
  serviceName: string
  providerName: string
  providerId: string
  providerPhoto?: string
  providerRating?: number
  providerPhone?: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show'
  amount: number
  originalAmount?: number
  discountApplied?: number
  couponUsed?: string
  datetime: string
  duration: number
  actualDuration?: number
  address: string
  addressType: 'home' | 'office' | 'other'
  description: string
  specialInstructions?: string
  rating?: number
  review?: string
  reviewDate?: string
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'partially_refunded' | 'failed'
  paymentMethod?: string
  transactionId?: string
  invoiceUrl?: string
  receiptUrl?: string
  trackingId?: string
  estimatedArrival?: string
  actualArrival?: string
  rescheduledAt?: string
  rescheduledTo?: string
  cancellationReason?: string
  cancellationDate?: string
  refundAmount?: number
  refundDate?: string
  completionPhotos?: string[]
  beforePhotos?: string[]
  notes?: string
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency'
  category: string
  subcategory?: string
  tags?: string[]
  recurringService?: boolean
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  nextServiceDate?: string
  loyaltyPointsEarned?: number
  supportTicketId?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  professionalName?: string
  professionalPhone?: string
  professionalPhoto?: string
  serviceCategory?: string
  attachments?: string[]
  workReport?: string
  materialsUsed?: string[]
  warrantyPeriod?: number
  followUpRequired?: boolean
  followUpDate?: string
  customerSatisfaction?: number
  providerNotes?: string
  emergencyContact?: string
  accessInstructions?: string
  parkingInfo?: string
  petInfo?: string
  gateCode?: string
  buildingInstructions?: string
}

interface BookingStats {
  total: number
  pending: number
  confirmed: number
  inProgress: number
  completed: number
  cancelled: number
  rescheduled: number
  totalSpent: number
  totalSaved: number
  avgRating: number
  upcomingAppointments: number
  emergencyServices: number
  recurringServices: number
  loyaltyPoints: number
  thisMonthBookings: number
  thisMonthSpent: number
  completionRate: number
  onTimeRate: number
  avgResponseTime: string
  favoriteProvider?: string
  mostBookedService?: string
}

interface FilterOptions {
  status: string
  dateRange: string
  category: string
  paymentStatus: string
  priceRange: [number, number]
  rating: number
  hasReview: boolean
  isRecurring: boolean
  isEmergency: boolean
  hasDiscount: boolean
  provider: string
  sortBy: 'date' | 'status' | 'amount' | 'rating' | 'provider' | 'urgency'
  sortOrder: 'asc' | 'desc'
  viewMode: 'grid' | 'list' | 'calendar' | 'timeline'
}

export default function ProfileBookingsAdvanced() {
  const navigate = useNavigate()
  const { user } = useUser()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    dateRange: 'all',
    category: 'all',
    paymentStatus: 'all',
    priceRange: [0, 50000],
    rating: 0,
    hasReview: false,
    isRecurring: false,
    isEmergency: false,
    hasDiscount: false,
    provider: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
    viewMode: 'grid'
  })

  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf')
  const [reviewData, setReviewData] = useState({ rating: 0, review: '' })
  const [cancellationReason, setCancellationReason] = useState('')
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')

  // Status configurations
  const statusConfig = {
    pending: { label: 'Pending Confirmation', color: '#f59e0b', icon: '⏳', description: 'Awaiting provider confirmation' },
    confirmed: { label: 'Confirmed', color: '#10b981', icon: '✅', description: 'Booking confirmed' },
    in_progress: { label: 'In Progress', color: '#3b82f6', icon: '🔧', description: 'Service in progress' },
    completed: { label: 'Completed', color: '#059669', icon: '✨', description: 'Service completed successfully' },
    cancelled: { label: 'Cancelled', color: '#ef4444', icon: '❌', description: 'Booking cancelled' },
    rescheduled: { label: 'Rescheduled', color: '#f97316', icon: '🔄', description: 'Booking rescheduled' },
    no_show: { label: 'No Show', color: '#6b7280', icon: '🚫', description: 'Provider didn\'t show up' }
  }

  const categoryConfig = {
    all: { label: 'All Categories', icon: '🏠' },
    plumbing: { label: 'Plumbing', icon: '🔧' },
    electrical: { label: 'Electrical', icon: '⚡' },
    cleaning: { label: 'Cleaning', icon: '🧹' },
    ac: { label: 'AC Repair', icon: '❄️' },
    mechanic: { label: 'Mechanic', icon: '🚗' },
    tutor: { label: 'Tutor', icon: '📚' },
    appliance: { label: 'Appliance', icon: '🏪' },
    painting: { label: 'Painting', icon: '🎨' },
    carpentry: { label: 'Carpentry', icon: '🔨' },
    pest: { label: 'Pest Control', icon: '🐛' },
    landscaping: { label: 'Landscaping', icon: '🌱' }
  }

  const urgencyConfig = {
    low: { label: 'Low', color: '#10b981', icon: '🟢' },
    medium: { label: 'Medium', color: '#f59e0b', icon: '🟡' },
    high: { label: 'High', color: '#f97316', icon: '🟠' },
    emergency: { label: 'Emergency', color: '#ef4444', icon: '🔴' }
  }

  // Load bookings with comprehensive mock data
  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true)
      
      // Enhanced mock data with realistic scenarios
      const mockBookings: Booking[] = [
        {
          id: 'BK001',
          serviceId: 'svc001',
          serviceName: 'Complete Home Deep Cleaning',
          providerName: 'Sparkle Clean Pro',
          providerId: 'prov001',
          providerPhoto: 'https://picsum.photos/100/100?random=1',
          providerRating: 4.8,
          providerPhone: '+91-9876543210',
          status: 'confirmed',
          amount: 2499,
          originalAmount: 2999,
          discountApplied: 500,
          couponUsed: 'CLEAN500',
          datetime: '2024-11-25T10:00:00',
          duration: 240,
          address: '123, Palm Greens, Sector 15, Gurgaon - 122001',
          addressType: 'home',
          description: 'Complete deep cleaning of 3BHK apartment including kitchen deep clean, bathroom sanitization, and carpet cleaning',
          specialInstructions: 'Please focus on kitchen grease removal and bathroom sanitization',
          paymentStatus: 'paid',
          paymentMethod: 'Credit Card',
          transactionId: 'TXN123456789',
          invoiceUrl: '#',
          receiptUrl: '#',
          urgencyLevel: 'medium',
          category: 'cleaning',
          subcategory: 'deep cleaning',
          tags: ['deep-clean', 'kitchen', 'bathroom', 'carpet'],
          recurringService: true,
          recurringFrequency: 'monthly',
          nextServiceDate: '2024-12-25T10:00:00',
          loyaltyPointsEarned: 125,
          createdAt: '2024-11-20T08:30:00',
          updatedAt: '2024-11-20T09:15:00',
          professionalName: 'Rajesh Kumar',
          professionalPhone: '+91-9876543210',
          professionalPhoto: 'https://picsum.photos/100/100?random=2',
          serviceCategory: 'cleaning',
          warrantyPeriod: 7,
          followUpRequired: false,
          customerSatisfaction: 0,
          accessInstructions: 'Ring doorbell, security guard will assist',
          parkingInfo: 'Visitor parking available',
          petInfo: 'No pets',
          materialsUsed: []
        },
        {
          id: 'BK002',
          serviceId: 'svc002',
          serviceName: 'Emergency AC Repair',
          providerName: 'CoolAir Experts',
          providerId: 'prov002',
          providerPhoto: 'https://picsum.photos/100/100?random=3',
          providerRating: 4.9,
          providerPhone: '+91-9876543211',
          status: 'in_progress',
          amount: 1899,
          datetime: '2024-11-22T14:30:00',
          duration: 120,
          actualDuration: 90,
          address: '456, Tower A, DLF Cyber City, Gurgaon - 122002',
          addressType: 'office',
          description: 'AC not cooling properly, gas leak suspected, urgent repair needed for split AC (1.5 ton)',
          specialInstructions: 'Customer mentioned water leakage from indoor unit',
          paymentStatus: 'pending',
          trackingId: 'TRK123456789',
          estimatedArrival: '2024-11-22T14:45:00',
          actualArrival: '2024-11-22T14:50:00',
          urgencyLevel: 'emergency',
          category: 'ac',
          subcategory: 'repair',
          tags: ['emergency', 'gas-leak', 'split-ac'],
          loyaltyPointsEarned: 95,
          supportTicketId: 'SUP-789456',
          createdAt: '2024-11-22T13:00:00',
          updatedAt: '2024-11-22T14:50:00',
          professionalName: 'Amit Sharma',
          professionalPhone: '+91-9876543211',
          professionalPhoto: 'https://picsum.photos/100/100?random=4',
          serviceCategory: 'ac',
          followUpRequired: true,
          followUpDate: '2024-11-23T10:00:00',
          emergencyContact: '+91-9876543212',
          accessInstructions: 'Reception desk has key',
          buildingInstructions: 'Take elevator to 12th floor, office 1205',
          materialsUsed: ['Copper pipe', 'Gas', 'Filter']
        },
        {
          id: 'BK003',
          serviceId: 'svc003',
          serviceName: 'Bathroom Plumbing Repair',
          providerName: 'QuickFix Pro',
          providerId: 'prov003',
          providerPhoto: 'https://picsum.photos/100/100?random=5',
          providerRating: 4.6,
          providerPhone: '+91-9876543212',
          status: 'completed',
          amount: 1599,
          datetime: '2024-11-15T09:00:00',
          duration: 90,
          actualDuration: 75,
          address: '789, Green Park, New Delhi - 110016',
          addressType: 'home',
          description: 'Fix leaking tap and unclog bathroom drain, replace worn-out washers',
          paymentStatus: 'paid',
          paymentMethod: 'UPI',
          transactionId: 'TXN987654321',
          invoiceUrl: '#',
          receiptUrl: '#',
          rating: 5,
          review: 'Excellent service! Professional work, arrived on time, and fixed the issue permanently. Highly recommended!',
          reviewDate: '2024-11-15T11:30:00',
          urgencyLevel: 'high',
          category: 'plumbing',
          subcategory: 'repair',
          tags: ['leak', 'drain', 'tap-repair'],
          completionPhotos: ['https://picsum.photos/300/200?random=100', 'https://picsum.photos/300/200?random=101'],
          beforePhotos: ['https://picsum.photos/300/200?random=102'],
          loyaltyPointsEarned: 80,
          createdAt: '2024-11-14T16:30:00',
          updatedAt: '2024-11-15T10:45:00',
          completedAt: '2024-11-15T10:15:00',
          professionalName: 'Sanjay Kumar',
          professionalPhone: '+91-9876543212',
          professionalPhoto: 'https://picsum.photos/100/100?random=6',
          serviceCategory: 'plumbing',
          warrantyPeriod: 30,
          followUpRequired: false,
          customerSatisfaction: 5,
          workReport: 'Replaced worn-out washers, fixed tap mechanism, cleared drain blockage',
          materialsUsed: ['Washers', 'Sealant', 'Drain cleaner'],
          gateCode: '1234#'
        },
        {
          id: 'BK004',
          serviceId: 'svc004',
          serviceName: 'Electrical Safety Inspection',
          providerName: 'ElectroSafe Solutions',
          providerId: 'prov004',
          providerPhoto: 'https://picsum.photos/100/100?random=7',
          providerRating: 4.7,
          providerPhone: '+91-9876543213',
          status: 'rescheduled',
          amount: 999,
          datetime: '2024-11-16T16:00:00',
          duration: 120,
          address: '321, Sushant Lok Phase 1, Gurgaon - 122002',
          addressType: 'home',
          description: 'Complete electrical safety inspection for 2BHK apartment, wiring check, and MCB testing',
          specialInstructions: 'Customer requested morning slot',
          paymentStatus: 'pending',
          rescheduledAt: '2024-11-15T14:30:00',
          rescheduledTo: '2024-11-18T10:00:00',
          urgencyLevel: 'low',
          category: 'electrical',
          subcategory: 'inspection',
          tags: ['safety', 'inspection', 'wiring'],
          loyaltyPointsEarned: 50,
          createdAt: '2024-11-14T11:20:00',
          updatedAt: '2024-11-15T14:30:00',
          professionalName: 'Vikram Malhotra',
          professionalPhone: '+91-9876543213',
          professionalPhoto: 'https://picsum.photos/100/100?random=8',
          serviceCategory: 'electrical',
          warrantyPeriod: 0,
          followUpRequired: false,
          parkingInfo: 'Street parking available'
        },
        {
          id: 'BK005',
          serviceId: 'svc005',
          serviceName: 'Car Service & Oil Change',
          providerName: 'AutoCare Garage',
          providerId: 'prov005',
          providerPhoto: 'https://picsum.photos/100/100?random=9',
          providerRating: 4.5,
          providerPhone: '+91-9876543214',
          status: 'cancelled',
          amount: 3499,
          originalAmount: 3499,
          datetime: '2024-11-10T11:00:00',
          duration: 180,
          address: '654, NH-48, Near Toll Plaza, Gurgaon - 122001',
          addressType: 'other',
          description: 'Comprehensive car service including oil change, filter replacement, and general check-up for Honda City',
          paymentStatus: 'refunded',
          refundAmount: 3499,
          refundDate: '2024-11-11T10:30:00',
          cancellationReason: 'Customer had emergency and couldn\'t make it',
          cancellationDate: '2024-11-10T09:15:00',
          urgencyLevel: 'low',
          category: 'mechanic',
          subcategory: 'service',
          tags: ['car-service', 'oil-change', 'general-checkup'],
          invoiceUrl: '#',
          receiptUrl: '#',
          loyaltyPointsEarned: 0,
          createdAt: '2024-11-08T15:45:00',
          updatedAt: '2024-11-10T09:15:00',
          professionalName: 'Rohit Gupta',
          professionalPhone: '+91-9876543214',
          professionalPhoto: 'https://picsum.photos/100/100?random=10',
          serviceCategory: 'mechanic',
          warrantyPeriod: 90,
          followUpRequired: false
        },
        {
          id: 'BK006',
          serviceId: 'svc006',
          serviceName: 'Math Tutoring (Grade 10)',
          providerName: 'LearnWell Academy',
          providerId: 'prov006',
          providerPhoto: 'https://picsum.photos/100/100?random=11',
          providerRating: 4.9,
          providerPhone: '+91-9876543215',
          status: 'confirmed',
          amount: 1200,
          originalAmount: 1500,
          discountApplied: 300,
          couponUsed: 'STUDENT300',
          datetime: '2024-11-23T15:00:00',
          duration: 60,
          address: 'Online Session',
          addressType: 'other',
          description: 'Mathematics tutoring for Grade 10 student - Algebra and Geometry',
          specialInstructions: 'Focus on weak areas in algebra',
          paymentStatus: 'paid',
          paymentMethod: 'Net Banking',
          transactionId: 'TXN555666777',
          urgencyLevel: 'medium',
          category: 'tutor',
          subcategory: 'mathematics',
          tags: ['math', 'algebra', 'geometry', 'grade10'],
          recurringService: true,
          recurringFrequency: 'weekly',
          nextServiceDate: '2024-11-30T15:00:00',
          loyaltyPointsEarned: 60,
          createdAt: '2024-11-20T10:00:00',
          updatedAt: '2024-11-20T10:30:00',
          professionalName: 'Priya Singh',
          professionalPhone: '+91-9876543215',
          professionalPhoto: 'https://picsum.photos/100/100?random=12',
          serviceCategory: 'tutor',
          warrantyPeriod: 0,
          followUpRequired: true,
          followUpDate: '2024-11-24T18:00:00',
          materialsUsed: ['Study materials', 'Practice papers']
        }
      ]
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setBookings(mockBookings)
      setLoading(false)
    }

    if (user) {
      loadBookings()
    }
  }, [user])

  // Calculate comprehensive statistics
  const stats = useMemo<BookingStats>(() => {
    const total = bookings.length
    const pending = bookings.filter(b => b.status === 'pending').length
    const confirmed = bookings.filter(b => b.status === 'confirmed').length
    const inProgress = bookings.filter(b => b.status === 'in_progress').length
    const completed = bookings.filter(b => b.status === 'completed').length
    const cancelled = bookings.filter(b => b.status === 'cancelled').length
    const rescheduled = bookings.filter(b => b.status === 'rescheduled').length
    
    const totalSpent = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.amount, 0)
    
    const totalSaved = bookings
      .filter(b => b.discountApplied)
      .reduce((sum, b) => sum + (b.discountApplied || 0), 0)
    
    const completedWithRating = bookings.filter(b => b.status === 'completed' && b.rating)
    const avgRating = completedWithRating.length > 0
      ? completedWithRating.reduce((sum, b) => sum + (b.rating || 0), 0) / completedWithRating.length
      : 0
    
    const upcomingAppointments = bookings.filter(b => 
      ['confirmed', 'pending'].includes(b.status) && 
      new Date(b.datetime) > new Date()
    ).length
    
    const emergencyServices = bookings.filter(b => b.urgencyLevel === 'emergency').length
    const recurringServices = bookings.filter(b => b.recurringService).length
    
    const loyaltyPoints = bookings.reduce((sum, b) => sum + (b.loyaltyPointsEarned || 0), 0)
    
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const thisMonthBookings = bookings.filter(b => new Date(b.datetime) >= thisMonth).length
    const thisMonthSpent = bookings
      .filter(b => b.paymentStatus === 'paid' && new Date(b.datetime) >= thisMonth)
      .reduce((sum, b) => sum + b.amount, 0)
    
    const completionRate = total > 0 ? (completed / (completed + cancelled)) * 100 : 0
    
    const onTimeCompleted = bookings.filter(b => 
      b.status === 'completed' && b.actualArrival && b.estimatedArrival &&
      new Date(b.actualArrival) <= new Date(b.estimatedArrival)
    ).length
    const onTimeRate = completed > 0 ? (onTimeCompleted / completed) * 100 : 0
    
    const providerFrequency = bookings.reduce((acc, b) => {
      acc[b.providerName] = (acc[b.providerName] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const favoriteProvider = Object.entries(providerFrequency)
      .sort(([,a], [,b]) => b - a)[0]?.[0]
    
    const serviceFrequency = bookings.reduce((acc, b) => {
      acc[b.serviceName] = (acc[b.serviceName] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const mostBookedService = Object.entries(serviceFrequency)
      .sort(([,a], [,b]) => b - a)[0]?.[0]

    return {
      total,
      pending,
      confirmed,
      inProgress,
      completed,
      cancelled,
      rescheduled,
      totalSpent,
      totalSaved,
      avgRating,
      upcomingAppointments,
      emergencyServices,
      recurringServices,
      loyaltyPoints,
      thisMonthBookings,
      thisMonthSpent,
      completionRate,
      onTimeRate,
      avgResponseTime: '2 hours',
      favoriteProvider,
      mostBookedService
    }
  }, [bookings])

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = [...bookings]

    // Apply filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(b => b.status === filters.status)
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(b => b.category === filters.category)
    }

    if (filters.paymentStatus !== 'all') {
      filtered = filtered.filter(b => b.paymentStatus === filters.paymentStatus)
    }

    if (filters.priceRange[1] > 0) {
      filtered = filtered.filter(b => 
        b.amount >= filters.priceRange[0] && b.amount <= filters.priceRange[1]
      )
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(b => (b.rating || 0) >= filters.rating)
    }

    if (filters.hasReview) {
      filtered = filtered.filter(b => !!b.review)
    }

    if (filters.isRecurring) {
      filtered = filtered.filter(b => b.recurringService)
    }

    if (filters.isEmergency) {
      filtered = filtered.filter(b => b.urgencyLevel === 'emergency')
    }

    if (filters.hasDiscount) {
      filtered = filtered.filter(b => !!b.discountApplied)
    }

    if (filters.provider !== 'all') {
      filtered = filtered.filter(b => b.providerName === filters.provider)
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(b => 
        b.serviceName.toLowerCase().includes(query) ||
        b.providerName.toLowerCase().includes(query) ||
        b.id.toLowerCase().includes(query) ||
        b.address.toLowerCase().includes(query) ||
        b.professionalName?.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'amount':
          comparison = a.amount - b.amount
          break
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0)
          break
        case 'provider':
          comparison = a.providerName.localeCompare(b.providerName)
          break
        case 'urgency':
          const urgencyOrder = { emergency: 4, high: 3, medium: 2, low: 1 }
          comparison = urgencyOrder[a.urgencyLevel] - urgencyOrder[b.urgencyLevel]
          break
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [bookings, filters, searchQuery])

  // Format functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getDaysUntilBooking = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Past'
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    return `${diffDays} days`
  }

  // Action handlers
  const toggleCardExpansion = (bookingId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(bookingId)) {
      newExpanded.delete(bookingId)
    } else {
      newExpanded.add(bookingId)
    }
    setExpandedCards(newExpanded)
  }

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowCancelModal(true)
  }

  const handleRescheduleBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowRescheduleModal(true)
  }

  const handleLeaveReview = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowReviewModal(true)
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetailsModal(true)
  }

  const handleTrackService = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowTrackingModal(true)
  }

  const handlePayment = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowPaymentModal(true)
  }

  const handleExportBookings = () => {
    setShowExportModal(true)
  }

  const confirmCancelBooking = () => {
    if (selectedBooking && cancellationReason) {
      // Update booking status
      setBookings(prev => prev.map(b => 
        b.id === selectedBooking.id 
          ? { 
              ...b, 
              status: 'cancelled', 
              cancellationReason, 
              cancellationDate: new Date().toISOString(),
              refundAmount: b.amount * 0.8, // 80% refund
              paymentStatus: 'refunded'
            }
          : b
      ))
      setShowCancelModal(false)
      setCancellationReason('')
      setSelectedBooking(null)
    }
  }

  const confirmRescheduleBooking = () => {
    if (selectedBooking && rescheduleDate && rescheduleTime) {
      const newDateTime = `${rescheduleDate}T${rescheduleTime}:00`
      setBookings(prev => prev.map(b => 
        b.id === selectedBooking.id 
          ? { 
              ...b, 
              status: 'rescheduled', 
              rescheduledAt: new Date().toISOString(),
              rescheduledTo: newDateTime,
              datetime: newDateTime
            }
          : b
      ))
      setShowRescheduleModal(false)
      setRescheduleDate('')
      setRescheduleTime('')
      setSelectedBooking(null)
    }
  }

  const submitReview = () => {
    if (selectedBooking && reviewData.rating > 0) {
      setBookings(prev => prev.map(b => 
        b.id === selectedBooking.id 
          ? { 
              ...b, 
              rating: reviewData.rating, 
              review: reviewData.review,
              reviewDate: new Date().toISOString(),
              customerSatisfaction: reviewData.rating
            }
          : b
      ))
      setShowReviewModal(false)
      setReviewData({ rating: 0, review: '' })
      setSelectedBooking(null)
    }
  }

  const processPayment = () => {
    if (selectedBooking) {
      setBookings(prev => prev.map(b => 
        b.id === selectedBooking.id 
          ? { 
              ...b, 
              paymentStatus: 'paid',
              transactionId: `TXN${Date.now()}`,
              paidAt: new Date().toISOString()
            }
          : b
      ))
      setShowPaymentModal(false)
      setSelectedBooking(null)
    }
  }

  if (loading) {
    return (
      <div className="profile-bookings-advanced">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-bookings-advanced">
      {/* Enhanced Header */}
      <section className="bookings-header">
        <div className="bookings-header-content">
          <div className="bookings-title-section">
            <h1 className="bookings-title">My Bookings</h1>
            <p className="bookings-subtitle">
              Manage and track all your service bookings in one place
            </p>
          </div>
          
          <div className="bookings-header-actions">
            <button className="export-btn" onClick={handleExportBookings}>
              <span className="btn-icon">📊</span>
              <span>Export</span>
            </button>
            <Link to="/search" className="book-new-service-btn">
              <span className="btn-icon">➕</span>
              <span>Book New Service</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Cards */}
      <section className="bookings-stats">
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Bookings</div>
              <div className="stat-change">+{stats.thisMonthBookings} this month</div>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{stats.pending + stats.confirmed}</div>
              <div className="stat-label">Upcoming</div>
              <div className="stat-change">{stats.upcomingAppointments} active</div>
            </div>
          </div>
          <div className="stat-card active">
            <div className="stat-icon">🔧</div>
            <div className="stat-content">
              <div className="stat-number">{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
              <div className="stat-change">Currently active</div>
            </div>
          </div>
          <div className="stat-card completed">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.completed}</div>
              <div className="stat-label">Completed</div>
              <div className="stat-change">⭐ {stats.avgRating.toFixed(1)} avg rating</div>
            </div>
          </div>
          <div className="stat-card spent">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-number">{formatAmount(stats.totalSpent)}</div>
              <div className="stat-label">Total Spent</div>
              <div className="stat-change">Saved {formatAmount(stats.totalSaved)}</div>
            </div>
          </div>
          <div className="stat-card loyalty">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-number">{stats.loyaltyPoints}</div>
              <div className="stat-label">Loyalty Points</div>
              <div className="stat-change">{stats.completionRate.toFixed(1)}% completion</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Filters and Search */}
      <section className="bookings-filters">
        <div className="filters-content">
          <div className="filters-row">
            {/* Search */}
            <div className="search-group">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search bookings, services, providers..."
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
                className={`view-btn ${filters.viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, viewMode: 'grid'})}
              >
                <span>⊞</span>
              </button>
              <button
                className={`view-btn ${filters.viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, viewMode: 'list'})}
              >
                <span>☰</span>
              </button>
              <button
                className={`view-btn ${filters.viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, viewMode: 'calendar'})}
              >
                <span>📅</span>
              </button>
              <button
                className={`view-btn ${filters.viewMode === 'timeline' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, viewMode: 'timeline'})}
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
                <option value="date">Sort by Date</option>
                <option value="status">Sort by Status</option>
                <option value="amount">Sort by Amount</option>
                <option value="rating">Sort by Rating</option>
                <option value="provider">Sort by Provider</option>
                <option value="urgency">Sort by Urgency</option>
              </select>
              <button
                className={`sort-order ${filters.sortOrder}`}
                onClick={() => setFilters({...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'})}
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            {/* Advanced Filters Button */}
            <button 
              className="advanced-filters-btn"
              onClick={() => setShowFiltersModal(true)}
            >
              <span className="btn-icon">🔍</span>
              <span>Advanced Filters</span>
            </button>
          </div>

          {/* Quick Status Filters */}
          <div className="quick-filters">
            {Object.entries(statusConfig).map(([key, config]) => (
              <button
                key={key}
                className={`status-filter-btn ${filters.status === key ? 'active' : ''}`}
                onClick={() => setFilters({...filters, status: key})}
                style={{ '--status-color': config.color } as React.CSSProperties}
              >
                <span className="filter-icon">{config.icon}</span>
                <span className="filter-text">{config.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bookings Display */}
      <section className="bookings-display">
        {filteredAndSortedBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No bookings found</h3>
            <p>
              {searchQuery || filters.status !== 'all' || filters.category !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'You haven\'t made any bookings yet. Start by booking a service!'}
            </p>
            <Link to="/search" className="book-now-btn">
              <span className="btn-icon">🔍</span>
              <span>Browse Services</span>
            </Link>
          </div>
        ) : (
          <div className={`bookings-container ${filters.viewMode}`}>
            {filteredAndSortedBookings.map(booking => (
              <div key={booking.id} className={`booking-card ${expandedCards.has(booking.id) ? 'expanded' : ''}`}>
                {/* Card Header */}
                <div className="booking-header">
                  <div className="booking-info">
                    <div className="service-info">
                      <h3 className="booking-service">{booking.serviceName}</h3>
                      <div className="booking-meta">
                        <span className="booking-provider">{booking.providerName}</span>
                        {booking.professionalName && (
                          <span className="professional-name">• {booking.professionalName}</span>
                        )}
                        {booking.providerRating && (
                          <span className="provider-rating">⭐ {booking.providerRating}</span>
                        )}
                      </div>
                      <p className="booking-id">Booking ID: {booking.id}</p>
                    </div>
                    
                    <div className="booking-status">
                      <span 
                        className="status-badge"
                        style={{ '--status-color': statusConfig[booking.status].color } as React.CSSProperties}
                      >
                        <span className="status-icon">{statusConfig[booking.status].icon}</span>
                        <span className="status-text">{statusConfig[booking.status].label}</span>
                      </span>
                      
                      {booking.urgencyLevel && (
                        <span className={`urgency-badge urgency-${booking.urgencyLevel}`}>
                          <span className="urgency-icon">
                            {urgencyConfig[booking.urgencyLevel].icon}
                          </span>
                          <span className="urgency-text">
                            {urgencyConfig[booking.urgencyLevel].label}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Provider Info */}
                  {booking.providerPhoto && (
                    <div className="provider-card">
                      <img 
                        src={booking.providerPhoto} 
                        alt={booking.providerName}
                        className="provider-photo"
                      />
                      <div className="provider-info">
                        <p className="provider-name">{booking.providerName}</p>
                        <p className="provider-phone">{booking.providerPhone}</p>
                        {booking.providerRating && (
                          <div className="provider-rating-small">⭐ {booking.providerRating}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Details */}
                <div className="booking-quick-details">
                  <div className="quick-detail">
                    <span className="detail-icon">📅</span>
                    <div className="detail-content">
                      <span className="detail-label">Date & Time</span>
                      <span className="detail-value">{formatDate(booking.datetime)}</span>
                      <span className="detail-sub">{getDaysUntilBooking(booking.datetime)}</span>
                    </div>
                  </div>
                  
                  <div className="quick-detail">
                    <span className="detail-icon">📍</span>
                    <div className="detail-content">
                      <span className="detail-label">Location</span>
                      <span className="detail-value">{booking.address}</span>
                      <span className="detail-sub">{booking.addressType}</span>
                    </div>
                  </div>
                  
                  <div className="quick-detail">
                    <span className="detail-icon">💰</span>
                    <div className="detail-content">
                      <span className="detail-label">Amount</span>
                      <span className="detail-value amount">{formatAmount(booking.amount)}</span>
                      {booking.discountApplied && (
                        <span className="discount-badge">Saved {formatAmount(booking.discountApplied)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="quick-detail">
                    <span className="detail-icon">💳</span>
                    <div className="detail-content">
                      <span className="detail-label">Payment</span>
                      <span className={`detail-value payment-${booking.paymentStatus}`}>
                        {booking.paymentStatus === 'paid' ? '✅ Paid' : 
                         booking.paymentStatus === 'pending' ? '⏳ Pending' : 
                         booking.paymentStatus === 'refunded' ? '💸 Refunded' : '❌ Failed'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedCards.has(booking.id) && (
                  <div className="booking-expanded-details">
                    <div className="expanded-section">
                      <h4 className="section-title">Service Details</h4>
                      <p className="booking-description">{booking.description}</p>
                      
                      {booking.specialInstructions && (
                        <div className="notes-section">
                          <strong>Special Instructions:</strong> {booking.specialInstructions}
                        </div>
                      )}
                      
                      <div className="duration-info">
                        <span className="duration-label">Estimated Duration:</span>
                        <span className="duration-value">{formatDuration(booking.duration)}</span>
                        {booking.actualDuration && (
                          <>
                            <span className="duration-label">Actual Duration:</span>
                            <span className="duration-value">{formatDuration(booking.actualDuration)}</span>
                          </>
                        )}
                      </div>

                      {booking.tags && booking.tags.length > 0 && (
                        <div className="tags-section">
                          <span className="tags-label">Tags:</span>
                          <div className="tags-list">
                            {booking.tags.map((tag, index) => (
                              <span key={index} className="tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {booking.completionPhotos && booking.completionPhotos.length > 0 && (
                      <div className="expanded-section">
                        <h4 className="section-title">Completion Photos</h4>
                        <div className="photos-grid">
                          {booking.completionPhotos.map((photo, index) => (
                            <img key={index} src={photo} alt="Completion photo" className="completion-photo" />
                          ))}
                        </div>
                      </div>
                    )}

                    {booking.beforePhotos && booking.beforePhotos.length > 0 && (
                      <div className="expanded-section">
                        <h4 className="section-title">Before Photos</h4>
                        <div className="photos-grid">
                          {booking.beforePhotos.map((photo, index) => (
                            <img key={index} src={photo} alt="Before photo" className="before-photo" />
                          ))}
                        </div>
                      </div>
                    )}

                    {booking.rating && (
                      <div className="expanded-section">
                        <h4 className="section-title">Your Review</h4>
                        <div className="review-display">
                          <div className="rating-stars">
                            {'⭐'.repeat(booking.rating)}
                          </div>
                          {booking.review && <p className="review-text">"{booking.review}"</p>}
                          {booking.reviewDate && (
                            <p className="review-date">Reviewed on {formatDate(booking.reviewDate)}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {booking.workReport && (
                      <div className="expanded-section">
                        <h4 className="section-title">Work Report</h4>
                        <p className="work-report">{booking.workReport}</p>
                      </div>
                    )}

                    {booking.materialsUsed && booking.materialsUsed.length > 0 && (
                      <div className="expanded-section">
                        <h4 className="section-title">Materials Used</h4>
                        <div className="materials-list">
                          {booking.materialsUsed.map((material, index) => (
                            <span key={index} className="material-item">{material}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Card Actions */}
                <div className="booking-actions">
                  <button 
                    className="action-btn expand"
                    onClick={() => toggleCardExpansion(booking.id)}
                  >
                    {expandedCards.has(booking.id) ? 'Show Less' : 'Show More'}
                  </button>
                  
                  <button 
                    className="action-btn details"
                    onClick={() => handleViewDetails(booking)}
                  >
                    View Details
                  </button>
                  
                  {booking.trackingId && (
                    <button 
                      className="action-btn track"
                      onClick={() => handleTrackService(booking)}
                    >
                      Track Service
                    </button>
                  )}
                  
                  {booking.status === 'pending' && (
                    <button 
                      className="action-btn confirm"
                      onClick={() => {/* Handle confirm */}}
                    >
                      Confirm Booking
                    </button>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <>
                      <button 
                        className="action-btn reschedule"
                        onClick={() => handleRescheduleBooking(booking)}
                      >
                        Reschedule
                      </button>
                      <button 
                        className="action-btn cancel"
                        onClick={() => handleCancelBooking(booking)}
                      >
                        Cancel Booking
                      </button>
                    </>
                  )}
                  
                  {booking.status === 'confirmed' && booking.paymentStatus === 'pending' && (
                    <button 
                      className="action-btn pay"
                      onClick={() => handlePayment(booking)}
                    >
                      Pay Now
                    </button>
                  )}
                  
                  {booking.status === 'in_progress' && booking.trackingId && (
                    <button 
                      className="action-btn tracking"
                      onClick={() => handleTrackService(booking)}
                    >
                      Live Tracking
                    </button>
                  )}
                  
                  {booking.status === 'completed' && !booking.rating && (
                    <button 
                      className="action-btn review"
                      onClick={() => handleLeaveReview(booking)}
                    >
                      Leave Review
                    </button>
                  )}
                  
                  {booking.invoiceUrl && (
                    <button 
                      className="action-btn invoice"
                      onClick={() => {/* Download invoice */}}
                    >
                      Download Invoice
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      {/* Cancel Booking Modal */}
      {showCancelModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cancel Booking</h2>
              <button onClick={() => setShowCancelModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <div className="booking-summary">
                <h3>{selectedBooking.serviceName}</h3>
                <p>{selectedBooking.providerName}</p>
                <p>{formatDate(selectedBooking.datetime)}</p>
                <p className="amount">{formatAmount(selectedBooking.amount)}</p>
              </div>
              
              <div className="cancellation-info">
                <p><strong>Refund Policy:</strong></p>
                <p>• Cancellation 24+ hours before: 80% refund</p>
                <p>• Cancellation less than 24 hours: 50% refund</p>
                <p>• No-show: No refund</p>
              </div>
              
              <div className="form-group">
                <label>Reason for cancellation *</label>
                <textarea
                  value={cancellationReason}
                  onChange={e => setCancellationReason(e.target.value)}
                  placeholder="Please tell us why you're cancelling..."
                  rows={4}
                  className="form-textarea"
                />
              </div>
              
              <div className="modal-actions">
                <button onClick={() => setShowCancelModal(false)} className="btn-secondary">
                  Keep Booking
                </button>
                <button 
                  onClick={confirmCancelBooking} 
                  className="btn-danger"
                  disabled={!cancellationReason.trim()}
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowRescheduleModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reschedule Booking</h2>
              <button onClick={() => setShowRescheduleModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <div className="booking-summary">
                <h3>{selectedBooking.serviceName}</h3>
                <p>{selectedBooking.providerName}</p>
                <p>Current: {formatDate(selectedBooking.datetime)}</p>
              </div>
              
              <div className="form-group">
                <label>New Date *</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>New Time *</label>
                <input
                  type="time"
                  value={rescheduleTime}
                  onChange={e => setRescheduleTime(e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="reschedule-info">
                <p><strong>Rescheduling Policy:</strong></p>
                <p>• Free rescheduling up to 24 hours before</p>
                <p>• Within 24 hours: ₹100 rescheduling fee</p>
              </div>
              
              <div className="modal-actions">
                <button onClick={() => setShowRescheduleModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button 
                  onClick={confirmRescheduleBooking} 
                  className="btn-primary"
                  disabled={!rescheduleDate || !rescheduleTime}
                >
                  Reschedule Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Leave a Review</h2>
              <button onClick={() => setShowReviewModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <div className="booking-summary">
                <h3>{selectedBooking.serviceName}</h3>
                <p>{selectedBooking.providerName}</p>
                <p>{formatDate(selectedBooking.datetime)}</p>
              </div>
              
              <div className="form-group">
                <label>Rating *</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      className={`star-btn ${reviewData.rating >= star ? 'active' : ''}`}
                      onClick={() => setReviewData({...reviewData, rating: star})}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={reviewData.review}
                  onChange={e => setReviewData({...reviewData, review: e.target.value})}
                  placeholder="Share your experience with this service..."
                  rows={4}
                  className="form-textarea"
                />
              </div>
              
              <div className="modal-actions">
                <button onClick={() => setShowReviewModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button 
                  onClick={submitReview} 
                  className="btn-primary"
                  disabled={reviewData.rating === 0}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Complete Payment</h2>
              <button onClick={() => setShowPaymentModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <div className="payment-summary">
                <h3>{selectedBooking.serviceName}</h3>
                <p>{selectedBooking.providerName}</p>
                <p>{formatDate(selectedBooking.datetime)}</p>
                <div className="amount-breakdown">
                  <div className="amount-row">
                    <span>Service Amount:</span>
                    <span>{formatAmount(selectedBooking.amount)}</span>
                  </div>
                  {selectedBooking.discountApplied && (
                    <div className="amount-row discount">
                      <span>Discount:</span>
                      <span>-{formatAmount(selectedBooking.discountApplied)}</span>
                    </div>
                  )}
                  <div className="amount-row total">
                    <span>Total Amount:</span>
                    <span>{formatAmount(selectedBooking.amount)}</span>
                  </div>
                </div>
              </div>
              
              <div className="payment-methods">
                <h4>Select Payment Method</h4>
                <div className="payment-options">
                  <label className="payment-option">
                    <input type="radio" name="payment" defaultChecked />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    <span>UPI</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    <span>Net Banking</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    <span>Wallet</span>
                  </label>
                </div>
              </div>
              
              <div className="modal-actions">
                <button onClick={() => setShowPaymentModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={processPayment} className="btn-primary">
                  Pay {formatAmount(selectedBooking.amount)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              {/* Comprehensive booking details */}
              <div className="booking-details-full">
                <div className="detail-section">
                  <h3>Service Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Service Name:</label>
                      <span>{selectedBooking.serviceName}</span>
                    </div>
                    <div className="detail-item">
                      <label>Category:</label>
                      <span>{selectedBooking.category}</span>
                    </div>
                    <div className="detail-item">
                      <label>Description:</label>
                      <span>{selectedBooking.description}</span>
                    </div>
                    <div className="detail-item">
                      <label>Duration:</label>
                      <span>{formatDuration(selectedBooking.duration)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Provider Information</h3>
                  <div className="provider-details">
                    {selectedBooking.providerPhoto && (
                      <img src={selectedBooking.providerPhoto} alt={selectedBooking.providerName} className="provider-large-photo" />
                    )}
                    <div className="provider-info-full">
                      <h4>{selectedBooking.providerName}</h4>
                      {selectedBooking.providerRating && (
                        <div className="rating">⭐ {selectedBooking.providerRating}</div>
                      )}
                      <p>{selectedBooking.providerPhone}</p>
                      {selectedBooking.professionalName && (
                        <p>Professional: {selectedBooking.professionalName}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Schedule & Location</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Date & Time:</label>
                      <span>{formatDate(selectedBooking.datetime)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Address:</label>
                      <span>{selectedBooking.address}</span>
                    </div>
                    <div className="detail-item">
                      <label>Address Type:</label>
                      <span>{selectedBooking.addressType}</span>
                    </div>
                    {selectedBooking.estimatedArrival && (
                      <div className="detail-item">
                        <label>Estimated Arrival:</label>
                        <span>{formatTime(selectedBooking.estimatedArrival)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Payment Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Total Amount:</label>
                      <span>{formatAmount(selectedBooking.amount)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Payment Status:</label>
                      <span className={`payment-status ${selectedBooking.paymentStatus}`}>
                        {selectedBooking.paymentStatus}
                      </span>
                    </div>
                    {selectedBooking.paymentMethod && (
                      <div className="detail-item">
                        <label>Payment Method:</label>
                        <span>{selectedBooking.paymentMethod}</span>
                      </div>
                    )}
                    {selectedBooking.transactionId && (
                      <div className="detail-item">
                        <label>Transaction ID:</label>
                        <span>{selectedBooking.transactionId}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedBooking.specialInstructions && (
                  <div className="detail-section">
                    <h3>Special Instructions</h3>
                    <p>{selectedBooking.specialInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
