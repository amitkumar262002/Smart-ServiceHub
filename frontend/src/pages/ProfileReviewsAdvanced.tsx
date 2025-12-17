import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import '@/styles/ProfileReviewsAdvanced.css'

// Advanced configuration objects
const categoryConfig = {
  all: { label: 'All Categories', icon: '🏠', color: '#6b7280' },
  cleaning: { label: 'Cleaning', icon: '🧹', color: '#10b981' },
  plumbing: { label: 'Plumbing', icon: '🔧', color: '#3b82f6' },
  electrical: { label: 'Electrical', icon: '⚡', color: '#f59e0b' },
  ac: { label: 'AC Repair', icon: '❄️', color: '#06b6d4' },
  mechanic: { label: 'Mechanic', icon: '🚗', color: '#ef4444' },
  tutor: { label: 'Tutor', icon: '📚', color: '#8b5cf6' },
  appliance: { label: 'Appliance', icon: '🏪', color: '#f97316' },
  painting: { label: 'Painting', icon: '🎨', color: '#ec4899' },
  carpentry: { label: 'Carpentry', icon: '🔨', color: '#84cc16' },
  pest: { label: 'Pest Control', icon: '🐛', color: '#a855f7' },
  landscaping: { label: 'Landscaping', icon: '🌱', color: '#22c55e' }
} as const;

const ratingConfig = {
  5: { label: 'Excellent', color: '#10b981', description: 'Outstanding service', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  4: { label: 'Good', color: '#3b82f6', description: 'Very good service', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
  3: { label: 'Average', color: '#f59e0b', description: 'Satisfactory service', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  2: { label: 'Poor', color: '#f97316', description: 'Below expectations', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
  1: { label: 'Terrible', color: '#ef4444', description: 'Unacceptable service', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }
} as const;

const sentimentConfig = {
  positive: { label: 'Positive', color: '#10b981', icon: '😊', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  neutral: { label: 'Neutral', color: '#6b7280', icon: '😐', gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' },
  negative: { label: 'Negative', color: '#ef4444', icon: '😞', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }
} as const;

// Advanced status configurations
const statusConfig = {
  published: { label: 'Published', color: '#10b981', icon: '✅' },
  pending: { label: 'Pending', color: '#f59e0b', icon: '⏳' },
  hidden: { label: 'Hidden', color: '#6b7280', icon: '👁️‍🗨️' },
  flagged: { label: 'Flagged', color: '#ef4444', icon: '🚩' },
  removed: { label: 'Removed', color: '#991b1b', icon: '🗑️' }
} as const;

// Advanced price range configurations
const priceRangeConfig = {
  budget: { label: 'Budget', color: '#10b981', range: '₹0-999', icon: '💰' },
  moderate: { label: 'Moderate', color: '#3b82f6', range: '₹1,000-4,999', icon: '💵' },
  premium: { label: 'Premium', color: '#8b5cf6', range: '₹5,000-9,999', icon: '💎' },
  luxury: { label: 'Luxury', color: '#f59e0b', range: '₹10,000+', icon: '👑' }
} as const;

// Advanced filter configurations
const filterConfig = {
  dateRange: [
    { value: 'all', label: 'All Time', icon: '📅' },
    { value: 'today', label: 'Today', icon: '🌞' },
    { value: 'week', label: 'This Week', icon: '📆' },
    { value: 'month', label: 'This Month', icon: '🗓️' },
    { value: 'quarter', label: 'This Quarter', icon: '📊' },
    { value: 'year', label: 'This Year', icon: '🗓️' }
  ],
  sortBy: [
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'rating', label: 'Rating', icon: '⭐' },
    { value: 'helpful', label: 'Helpful', icon: '👍' },
    { value: 'category', label: 'Category', icon: '🏷️' },
    { value: 'sentiment', label: 'Sentiment', icon: '😊' },
    { value: 'price', label: 'Price', icon: '💰' },
    { value: 'response', label: 'Response Time', icon: '⏰' }
  ],
  viewMode: [
    { value: 'list', label: 'List View', icon: '☰' },
    { value: 'grid', label: 'Grid View', icon: '⊞' },
    { value: 'cards', label: 'Card View', icon: '🎴' },
    { value: 'compact', label: 'Compact', icon: '📋' }
  ]
};

// Type definitions
type CategoryKey = keyof typeof categoryConfig;
type RatingKey = keyof typeof ratingConfig;
type SentimentKey = keyof typeof sentimentConfig;
type StatusKey = keyof typeof statusConfig;
type PriceRangeKey = keyof typeof priceRangeConfig;
type ViewModeKey = 'list' | 'grid' | 'cards' | 'compact';
type SortByKey = 'date' | 'rating' | 'helpful' | 'category' | 'sentiment' | 'price' | 'response';
type DateRangeKey = 'all' | 'today' | 'week' | 'month' | 'quarter' | 'year';

// Advanced analytics interfaces
interface ReviewAnalytics {
  dailyTrend: Array<{ date: string; count: number; rating: number }>;
  monthlyTrend: Array<{ month: string; count: number; rating: number }>;
  categoryPerformance: Array<{ category: string; count: number; avgRating: number; growth: number }>;
  sentimentTrend: Array<{ period: string; positive: number; neutral: number; negative: number }>;
  responseTimeMetrics: Array<{ day: string; avgTime: number; target: number }>;
  topPerformers: Array<{ category: string; rating: number; reviews: number; revenue: number; growth: number }>;
  improvementAreas: Array<{ area: string; currentScore: number; targetScore: number; priority: 'high' | 'medium' | 'low' }>;
}

// Advanced notification interface
interface ReviewNotification {
  id: string;
  type: 'new_review' | 'response' | 'flagged' | 'milestone' | 'reminder';
  title: string;
  message: string;
  reviewId?: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actions?: Array<{ label: string; action: string }>;
}

// Advanced search interface
interface SearchFilters {
  query: string;
  categories: CategoryKey[];
  ratings: number[];
  sentiments: SentimentKey[];
  priceRanges: PriceRangeKey[];
  dateRange: DateRangeKey;
  hasPhotos: boolean;
  hasResponse: boolean;
  verified: boolean;
  status: StatusKey[];
}

// Advanced export interface
interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  dateRange: DateRangeKey;
  includeFields: string[];
  includeAnalytics: boolean;
  includePhotos: boolean;
  includeResponses: boolean;
}

// Advanced review interfaces
interface Review {
  id: string
  bookingId: string
  serviceId: string
  serviceName: string
  providerId: string
  providerName: string
  providerPhoto?: string
  providerRating?: number
  rating: number
  title: string
  comment: string
  pros?: string[]
  cons?: string[]
  tags?: string[]
  photos?: string[]
  verified: boolean
  helpful: number
  notHelpful: number
  reportCount: number
  response?: {
    id: string
    comment: string
    date: string
    helpful: number
    professional: boolean
    responseTime: number // in minutes
    sentiment: SentimentKey
  }
  status: StatusKey
  visibility: 'public' | 'private' | 'anonymous'
  sentiment: SentimentKey
  category: CategoryKey
  subcategory?: string
  priceRange: PriceRangeKey
  valueForMoney: number
  quality: number
  punctuality: number
  professionalism: number
  communication: number
  wouldRecommend: boolean
  wouldHireAgain: boolean
  createdAt: string
  updatedAt: string
  publishedAt?: string
  lastActivityAt?: string
  metadata?: {
    ipAddress?: string
    device?: string
    location?: string
    bookingValue?: number
    serviceDuration?: number
    weatherConditions?: string
    timeOfDay?: string
    reviewerType?: 'new' | 'repeat' | 'vip';
    source?: 'web' | 'mobile' | 'email' | 'api';
    campaign?: string;
    referral?: string;
  }
  aiInsights?: {
    sentiment: SentimentKey;
    confidence: number;
    keyPhrases: string[];
    emotions: string[];
    topics: string[];
    improvementSuggestions: string[];
  }
  engagement?: {
    views: number;
    shares: number;
    bookmarks: number;
    clickThroughRate: number;
  }
}

interface CustomerReview {
  id: string
  bookingId: string
  customerId: string
  customerName: string
  customerAvatar?: string
  customerRating?: number
  customerVerified: boolean
  serviceId: string
  serviceName: string
  rating: number
  title: string
  comment: string
  pros?: string[]
  cons?: string[]
  tags?: string[]
  photos?: string[]
  helpful: number
  notHelpful: number
  reportCount: number
  response?: {
    id: string
    comment: string
    date: string
    helpful: number
    professional: boolean
    responseTime: number // in minutes
    sentiment: SentimentKey
  }
  status: StatusKey
  sentiment: SentimentKey
  category: CategoryKey
  subcategory?: string
  priceRange: PriceRangeKey
  valueForMoney: number
  quality: number
  punctuality: number
  professionalism: number
  communication: number
  wouldRecommend: boolean
  createdAt: string
  updatedAt: string
  publishedAt?: string
  lastActivityAt?: string
  metadata?: {
    bookingValue?: number
    serviceDuration?: number
    repeatCustomer?: boolean;
    customerTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
    loyaltyPoints?: number;
    source?: 'web' | 'mobile' | 'email' | 'api';
    campaign?: string;
    referral?: string;
  }
  aiInsights?: {
    sentiment: SentimentKey;
    confidence: number;
    keyPhrases: string[];
    emotions: string[];
    topics: string[];
    improvementSuggestions: string[];
  }
  engagement?: {
    views: number;
    shares: number;
    bookmarks: number;
    clickThroughRate: number;
  }
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  fiveStarReviews: number
  fourStarReviews: number
  threeStarReviews: number
  twoStarReviews: number
  oneStarReviews: number
  recentReviews: number
  pendingResponses: number
  verifiedReviews: number
  helpfulVotes: number
  reportCount: number
  averageResponseTime: string
  responseRate: number
  topCategories: Array<{ category: string; count: number; avgRating: number; growth: number }>
  improvementAreas: string[]
  strengths: string[]
  sentimentScore: number
  customerSatisfaction: number
  repeatCustomerRate: number
  thisMonthReviews: number
  thisMonthRating: number
  trendDirection: 'up' | 'down' | 'stable'
  overallRank: number
  totalProviders: number
  // Advanced metrics
  engagementRate: number
  conversionRate: number
  retentionRate: number
  netPromoterScore: number
  customerEffortScore: number
  firstResponseTime: number
  resolutionTime: number
  customerLifetimeValue: number
  reviewVelocity: number
  sentimentVelocity: number
  topPerformers: Array<{ category: string; rating: number; reviews: number; revenue: number; growth: number }>
  worstPerformers: Array<{ category: string; rating: number; reviews: number; issues: string[] }>
  seasonalTrends: Array<{ season: string; reviews: number; rating: number; revenue: number }>
  geographicPerformance: Array<{ location: string; reviews: number; rating: number; growth: number }>
}

interface FilterOptions {
  rating: number
  category: string
  sentiment: string
  status: string
  dateRange: DateRangeKey
  hasResponse: boolean
  hasPhotos: boolean
  verified: boolean
  sortBy: SortByKey
  sortOrder: 'asc' | 'desc'
  viewMode: ViewModeKey
  // Advanced filters
  priceRanges: PriceRangeKey[]
  subcategories: string[]
  tags: string[]
  reviewerType: string[]
  source: string[]
  minRating: number
  maxRating: number
  minHelpful: number
  hasPros: boolean
  hasCons: boolean
  hasTags: boolean
  responseTime: 'fast' | 'normal' | 'slow'
  engagement: 'high' | 'medium' | 'low'
  aiSentiment: SentimentKey[]
  verifiedOnly: boolean
  flaggedOnly: boolean
  respondedOnly: boolean
  pendingOnly: boolean
}

export default function ProfileReviewsAdvanced() {
  const navigate = useNavigate()
  const { user } = useUser()
  const [myReviews, setMyReviews] = useState<Review[]>([])
  const [customerReviews, setCustomerReviews] = useState<CustomerReview[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'my-reviews' | 'customer-reviews' | 'analytics' | 'insights' | 'notifications' | 'search' | 'export'>('my-reviews')
  
  // Advanced modal states
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false)
  const [showEditReviewModal, setShowEditReviewModal] = useState(false)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showAdvancedFiltersModal, setShowAdvancedFiltersModal] = useState(false)
  const [showNotificationSettingsModal, setShowNotificationSettingsModal] = useState(false)
  const [showAISettingsModal, setShowAISettingsModal] = useState(false)
  
  // Advanced selection and bulk actions
  const [selectedReviews, setSelectedReviews] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState<'respond' | 'delete' | 'flag' | 'hide' | 'export' | null>(null)
  const [selectAll, setSelectAll] = useState(false)
  
  // Advanced search and filters
  const [searchQuery, setSearchQuery] = useState('')
  const [advancedFilters, setAdvancedFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    ratings: [],
    sentiments: [],
    priceRanges: [],
    dateRange: 'all',
    hasPhotos: false,
    hasResponse: false,
    verified: false,
    status: []
  })
  
  // Advanced analytics state
  const [analytics, setAnalytics] = useState<ReviewAnalytics | null>(null)
  const [notifications, setNotifications] = useState<ReviewNotification[]>([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  
  // Advanced UI states
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [compactView, setCompactView] = useState(false)
  const [showAiInsights, setShowAiInsights] = useState(true)
  const [showEngagementMetrics, setShowEngagementMetrics] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(30000) // 30 seconds
  
  // Advanced export options
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: 'all',
    includeFields: ['id', 'rating', 'title', 'comment', 'createdAt'],
    includeAnalytics: true,
    includePhotos: false,
    includeResponses: true
  })
  
  // Advanced settings
  const [notificationSettings, setNotificationSettings] = useState({
    newReviews: true,
    responses: true,
    flaggedReviews: true,
    weeklyReports: true,
    monthlyReports: false,
    aiInsights: true,
    performanceAlerts: true
  })
  
  const [aiSettings, setAiSettings] = useState({
    autoCategorize: true,
    sentimentAnalysis: true,
    spamDetection: true,
    responseSuggestions: true,
    insightGeneration: true,
    trendAnalysis: true
  })
  
  const [selectedReview, setSelectedReview] = useState<Review | CustomerReview | null>(null)
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set())
  
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    pros: [] as string[],
    cons: [] as string[],
    tags: [] as string[],
    photos: [] as string[],
    valueForMoney: 5,
    quality: 5,
    punctuality: 5,
    professionalism: 5,
    communication: 5,
    wouldRecommend: true,
    wouldHireAgain: true
  })
  
  const [responseText, setResponseText] = useState('')
  const [reportReason, setReportReason] = useState('')
  const [reportDescription, setReportDescription] = useState('')
  
  const [filters, setFilters] = useState<FilterOptions>({
    rating: 0,
    category: 'all',
    sentiment: 'all',
    status: 'all',
    dateRange: 'all',
    hasResponse: false,
    hasPhotos: false,
    verified: false,
    sortBy: 'date',
    sortOrder: 'desc',
    viewMode: 'list',
    // Advanced filters
    priceRanges: [],
    subcategories: [],
    tags: [],
    reviewerType: [],
    source: [],
    minRating: 0,
    maxRating: 5,
    minHelpful: 0,
    hasPros: false,
    hasCons: false,
    hasTags: false,
    responseTime: 'normal',
    engagement: 'medium',
    aiSentiment: [],
    verifiedOnly: false,
    flaggedOnly: false,
    respondedOnly: false,
    pendingOnly: false
  })

  // Load review data with comprehensive mock data
  useEffect(() => {
    const loadReviewData = async () => {
      setLoading(true)
      
      // Enhanced mock reviews (as customer)
      const mockMyReviews: Review[] = [
        {
          id: 'r001',
          bookingId: 'BK001',
          serviceId: 'svc001',
          serviceName: 'Complete Home Deep Cleaning',
          providerId: 'prov001',
          providerName: 'Sparkle Clean Pro',
          providerPhoto: 'https://picsum.photos/100/100?random=1',
          providerRating: 4.8,
          rating: 5,
          title: 'Absolutely Amazing Deep Cleaning Service!',
          comment: 'I hired Sparkle Clean Pro for a complete deep cleaning of my 3BHK apartment, and I must say it exceeded all my expectations. The team was punctual, professional, and incredibly thorough.',
          pros: [
            'Extremely thorough and detailed cleaning',
            'Professional and punctual team',
            'Eco-friendly cleaning products',
            'Great value for money'
          ],
          cons: [
            'Slightly longer than estimated time',
            'Could have brought more cleaning cloths'
          ],
          tags: ['deep-cleaning', 'eco-friendly', 'professional', 'thorough'],
          photos: [
            'https://picsum.photos/400/300?random=101',
            'https://picsum.photos/400/300?random=102'
          ],
          verified: true,
          helpful: 24,
          notHelpful: 1,
          reportCount: 0,
          response: {
            id: 'resp001',
            comment: 'Thank you so much for your wonderful review! We are thrilled that you loved our deep cleaning service.',
            date: '2024-11-21T10:30:00',
            helpful: 12,
            professional: true,
            responseTime: 45,
            sentiment: 'positive'
          },
          status: 'published',
          visibility: 'public',
          sentiment: 'positive',
          category: 'cleaning',
          subcategory: 'deep cleaning',
          priceRange: 'moderate',
          valueForMoney: 5,
          quality: 5,
          punctuality: 4,
          professionalism: 5,
          communication: 5,
          wouldRecommend: true,
          wouldHireAgain: true,
          createdAt: '2024-11-20T18:30:00',
          updatedAt: '2024-11-20T18:30:00',
          publishedAt: '2024-11-20T18:35:00',
          lastActivityAt: '2024-11-21T10:30:00',
          metadata: {
            ipAddress: '192.168.1.1',
            device: 'Mobile App',
            location: 'Gurgaon, India',
            bookingValue: 2499,
            serviceDuration: 240,
            timeOfDay: 'evening',
            reviewerType: 'repeat',
            source: 'mobile',
            campaign: 'summer_special'
          },
          aiInsights: {
            sentiment: 'positive',
            confidence: 0.95,
            keyPhrases: ['deep cleaning', 'professional team', 'eco-friendly'],
            emotions: ['satisfied', 'impressed', 'happy'],
            topics: ['service quality', 'professionalism', 'environmental concerns'],
            improvementSuggestions: ['Consider bringing extra supplies', 'Improve time estimation']
          },
          engagement: {
            views: 156,
            shares: 12,
            bookmarks: 8,
            clickThroughRate: 0.08
          }
        },
        {
          id: 'r002',
          bookingId: 'BK002',
          serviceId: 'svc002',
          serviceName: 'Emergency AC Repair',
          providerId: 'prov002',
          providerName: 'CoolAir Experts',
          providerPhoto: 'https://picsum.photos/100/100?random=2',
          providerRating: 4.9,
          rating: 4,
          title: 'Quick and Professional AC Service',
          comment: 'My AC stopped working during peak summer. CoolAir Experts responded within 2 hours and fixed the issue efficiently. Very professional service.',
          pros: [
            'Fast emergency response',
            'Professional diagnosis',
            'Clean workmanship',
            'Reasonable pricing'
          ],
          cons: [
            'Emergency call fee was high',
            'Had to wait 2 hours'
          ],
          tags: ['emergency', 'ac-repair', 'professional', 'quick-response'],
          photos: [
            'https://picsum.photos/400/300?random=103'
          ],
          verified: true,
          helpful: 18,
          notHelpful: 2,
          reportCount: 0,
          response: {
            id: 'resp002',
            comment: 'Thank you for your feedback! We understand emergency fees can be high, but we ensure rapid response during critical times.',
            date: '2024-11-19T14:15:00',
            helpful: 8,
            professional: true,
            responseTime: 120,
            sentiment: 'positive'
          },
          status: 'published',
          visibility: 'public',
          sentiment: 'positive',
          category: 'ac',
          subcategory: 'emergency repair',
          priceRange: 'premium',
          valueForMoney: 4,
          quality: 4,
          punctuality: 5,
          professionalism: 4,
          communication: 4,
          wouldRecommend: true,
          wouldHireAgain: true,
          createdAt: '2024-11-18T16:45:00',
          updatedAt: '2024-11-18T16:45:00',
          publishedAt: '2024-11-18T16:50:00',
          lastActivityAt: '2024-11-19T14:15:00',
          metadata: {
            ipAddress: '192.168.1.2',
            device: 'Web Browser',
            location: 'Delhi, India',
            bookingValue: 3499,
            serviceDuration: 90,
            weatherConditions: 'heat-wave',
            timeOfDay: 'evening',
            reviewerType: 'new',
            source: 'web',
            referral: 'google_search'
          },
          aiInsights: {
            sentiment: 'positive',
            confidence: 0.88,
            keyPhrases: ['emergency response', 'professional service', 'quick fix'],
            emotions: ['relieved', 'satisfied', 'grateful'],
            topics: ['emergency service', 'pricing', 'response time'],
            improvementSuggestions: ['Consider tiered emergency pricing', 'Improve communication about delays']
          },
          engagement: {
            views: 89,
            shares: 6,
            bookmarks: 4,
            clickThroughRate: 0.12
          }
        },
        {
          id: 'r003',
          bookingId: 'BK003',
          serviceId: 'svc003',
          serviceName: 'Plumbing Installation',
          providerId: 'prov003',
          providerName: 'QuickFix Pro',
          providerPhoto: 'https://picsum.photos/100/100?random=3',
          providerRating: 4.6,
          rating: 3,
          title: 'Average Service with Delays',
          comment: 'The plumbing work was acceptable but there were significant delays. The final result works fine but the process was frustrating.',
          pros: [
            'Final installation works correctly',
            'Reasonable pricing',
            'Clean work area'
          ],
          cons: [
            'Significant delays',
            'Poor communication about delays',
            'Had to call multiple times'
          ],
          tags: ['plumbing', 'installation', 'delays', 'communication'],
          photos: [
            'https://picsum.photos/400/300?random=104',
            'https://picsum.photos/400/300?random=105'
          ],
          verified: true,
          helpful: 12,
          notHelpful: 8,
          reportCount: 1,
          response: {
            id: 'resp003',
            comment: 'We apologize for the delays and communication issues. We are working on improving our scheduling and notification systems.',
            date: '2024-11-17T11:30:00',
            helpful: 5,
            professional: true,
            responseTime: 240,
            sentiment: 'neutral'
          },
          status: 'published',
          visibility: 'public',
          sentiment: 'neutral',
          category: 'plumbing',
          subcategory: 'installation',
          priceRange: 'moderate',
          valueForMoney: 3,
          quality: 3,
          punctuality: 2,
          professionalism: 3,
          communication: 2,
          wouldRecommend: false,
          wouldHireAgain: false,
          createdAt: '2024-11-16T09:20:00',
          updatedAt: '2024-11-16T09:20:00',
          publishedAt: '2024-11-16T09:25:00',
          lastActivityAt: '2024-11-17T11:30:00',
          metadata: {
            ipAddress: '192.168.1.3',
            device: 'Mobile App',
            location: 'Mumbai, India',
            bookingValue: 1899,
            serviceDuration: 180,
            timeOfDay: 'morning',
            reviewerType: 'new',
            source: 'mobile'
          },
          aiInsights: {
            sentiment: 'neutral',
            confidence: 0.76,
            keyPhrases: ['delays', 'communication issues', 'final result'],
            emotions: ['frustrated', 'disappointed', 'neutral'],
            topics: ['service delays', 'communication', 'quality'],
            improvementSuggestions: ['Improve scheduling system', 'Better communication about delays', 'Proactive updates']
          },
          engagement: {
            views: 67,
            shares: 2,
            bookmarks: 1,
            clickThroughRate: 0.05
          }
        }
      ]
      
      // Enhanced mock customer reviews (as provider)
      const mockCustomerReviews: CustomerReview[] = [
        {
          id: 'cr001',
          bookingId: 'B1001',
          customerId: 'cust001',
          customerName: 'Sarah Johnson',
          customerAvatar: 'https://picsum.photos/100/100?random=10',
          customerRating: 4.7,
          customerVerified: true,
          serviceId: 'svc101',
          serviceName: 'Web Development',
          rating: 5,
          title: 'Exceptional Developer - Exceeded All Expectations!',
          comment: 'I hired this developer for a complex e-commerce website project, and the results were absolutely outstanding.',
          pros: [
            'Exceptional code quality',
            'Outstanding communication',
            'Delivered on time and budget'
          ],
          cons: [
            'Initial proposal could have been more detailed'
          ],
          tags: ['web-development', 'ecommerce', 'professional'],
          photos: [
            'https://picsum.photos/400/300?random=201'
          ],
          helpful: 28,
          notHelpful: 1,
          reportCount: 0,
          response: {
            id: 'cresp001',
            comment: 'Thank you Sarah for your detailed and thoughtful review!',
            date: '2024-11-19T09:15:00',
            helpful: 15,
            professional: true,
            responseTime: 30,
            sentiment: 'positive'
          },
          status: 'published',
          sentiment: 'positive',
          category: 'cleaning',
          subcategory: 'ecommerce',
          priceRange: 'premium',
          valueForMoney: 5,
          quality: 5,
          punctuality: 5,
          professionalism: 5,
          communication: 5,
          wouldRecommend: true,
          createdAt: '2024-11-18T14:30:00',
          updatedAt: '2024-11-18T14:30:00',
          publishedAt: '2024-11-18T14:35:00',
          lastActivityAt: '2024-11-19T09:15:00',
          metadata: {
            bookingValue: 75000,
            serviceDuration: 1440,
            repeatCustomer: false,
            customerTier: 'gold',
            loyaltyPoints: 2500,
            source: 'web',
            campaign: 'enterprise_special'
          },
          aiInsights: {
            sentiment: 'positive',
            confidence: 0.98,
            keyPhrases: ['exceptional quality', 'outstanding communication', 'on time delivery'],
            emotions: ['impressed', 'satisfied', 'confident'],
            topics: ['code quality', 'communication', 'project management'],
            improvementSuggestions: ['Provide more detailed proposals', 'Offer maintenance packages']
          },
          engagement: {
            views: 234,
            shares: 18,
            bookmarks: 12,
            clickThroughRate: 0.15
          }
        },
        {
          id: 'cr002',
          bookingId: 'B1002',
          customerId: 'cust002',
          customerName: 'Raj Kumar',
          customerAvatar: 'https://picsum.photos/100/100?random=11',
          customerRating: 4.2,
          customerVerified: true,
          serviceId: 'svc102',
          serviceName: 'Mobile App Development',
          rating: 4,
          title: 'Solid App Development with Minor Issues',
          comment: 'Developed a food delivery app for my restaurant. Overall functionality is good and the app works well.',
          pros: [
            'Clean and user-friendly UI',
            'Responsive to feedback',
            'Quick iterations on fixes',
            'Great value for money'
          ],
          cons: [
            'Initial bugs took time to fix',
            'Could be optimized better for battery',
            'Some features could be more polished'
          ],
          tags: ['mobile-app', 'food-delivery', 'ui-design', 'professional'],
          photos: [
            'https://picsum.photos/400/300?random=203'
          ],
          helpful: 18,
          notHelpful: 3,
          reportCount: 0,
          response: {
            id: 'cresp002',
            comment: 'Thank you for your feedback! We appreciate your patience with the initial bugs.',
            date: '2024-11-15T16:45:00',
            helpful: 8,
            professional: true,
            responseTime: 60,
            sentiment: 'positive'
          },
          status: 'published',
          sentiment: 'positive',
          category: 'plumbing',
          subcategory: 'food-delivery',
          priceRange: 'moderate',
          valueForMoney: 4,
          quality: 4,
          punctuality: 4,
          professionalism: 4,
          communication: 4,
          wouldRecommend: true,
          createdAt: '2024-11-12T11:20:00',
          updatedAt: '2024-11-12T11:20:00',
          publishedAt: '2024-11-12T11:25:00',
          lastActivityAt: '2024-11-15T16:45:00',
          metadata: {
            bookingValue: 45000,
            serviceDuration: 720,
            repeatCustomer: false,
            customerTier: 'silver',
            loyaltyPoints: 1200,
            source: 'mobile',
            referral: 'word_of_mouth'
          },
          aiInsights: {
            sentiment: 'positive',
            confidence: 0.84,
            keyPhrases: ['clean UI', 'responsive feedback', 'quick fixes'],
            emotions: ['satisfied', 'impressed', 'neutral'],
            topics: ['user interface', 'customer service', 'value'],
            improvementSuggestions: ['Focus on battery optimization', 'Polish features before launch', 'Provide better testing']
          },
          engagement: {
            views: 145,
            shares: 9,
            bookmarks: 6,
            clickThroughRate: 0.09
          }
        },
        {
          id: 'cr003',
          bookingId: 'B1003',
          customerId: 'cust003',
          customerName: 'Emily Davis',
          customerAvatar: 'https://picsum.photos/100/100?random=12',
          customerRating: 4.9,
          customerVerified: true,
          serviceId: 'svc103',
          serviceName: 'UI/UX Design',
          rating: 5,
          title: 'Incredible Design Work - Captured Our Brand Perfectly!',
          comment: 'We needed a complete redesign of our company website and mobile app, and this designer absolutely nailed it!',
          pros: [
            'Exceptional creativity and vision',
            'Perfect brand understanding',
            'Balanced aesthetics and functionality',
            'Comprehensive design system'
          ],
          cons: [
            'Initial concepts took some time to develop',
            'Could have provided more style variations'
          ],
          tags: ['ui-design', 'ux-design', 'branding', 'professional', 'creative'],
          photos: [
            'https://picsum.photos/400/300?random=204',
            'https://picsum.photos/400/300?random=205',
            'https://picsum.photos/400/300?random=206'
          ],
          helpful: 35,
          notHelpful: 0,
          reportCount: 0,
          response: {
            id: 'cresp003',
            comment: 'Emily, thank you for such a wonderful review! It was a joy working with your brand.',
            date: '2024-11-09T16:45:00',
            helpful: 22,
            professional: true,
            responseTime: 15,
            sentiment: 'positive'
          },
          status: 'published',
          sentiment: 'positive',
          category: 'painting',
          subcategory: 'ui-ux',
          priceRange: 'premium',
          valueForMoney: 5,
          quality: 5,
          punctuality: 4,
          professionalism: 5,
          communication: 5,
          wouldRecommend: true,
          createdAt: '2024-11-08T10:15:00',
          updatedAt: '2024-11-08T10:15:00',
          publishedAt: '2024-11-08T10:20:00',
          lastActivityAt: '2024-11-09T16:45:00',
          metadata: {
            bookingValue: 35000,
            serviceDuration: 480,
            repeatCustomer: false,
            customerTier: 'platinum',
            loyaltyPoints: 3500,
            source: 'web',
            referral: 'linkedin'
          },
          aiInsights: {
            sentiment: 'positive',
            confidence: 0.96,
            keyPhrases: ['incredible design', 'brand understanding', 'creative vision'],
            emotions: ['excited', 'impressed', 'delighted'],
            topics: ['design quality', 'brand identity', 'creativity'],
            improvementSuggestions: ['Speed up initial concept development', 'Provide more design variations']
          },
          engagement: {
            views: 312,
            shares: 24,
            bookmarks: 18,
            clickThroughRate: 0.18
          }
        }
      ]
      
      // Mock analytics data
      const mockAnalytics: ReviewAnalytics = {
        dailyTrend: [
          { date: '2024-11-18', count: 3, rating: 4.2 },
          { date: '2024-11-19', count: 2, rating: 4.5 },
          { date: '2024-11-20', count: 1, rating: 5.0 },
          { date: '2024-11-21', count: 4, rating: 3.8 },
          { date: '2024-11-22', count: 2, rating: 4.3 }
        ],
        monthlyTrend: [
          { month: 'Sep', count: 12, rating: 4.1 },
          { month: 'Oct', count: 18, rating: 4.3 },
          { month: 'Nov', count: 15, rating: 4.2 }
        ],
        categoryPerformance: [
          { category: 'cleaning', count: 8, avgRating: 4.6, growth: 12.5 },
          { category: 'plumbing', count: 5, avgRating: 4.2, growth: -5.2 },
          { category: 'ac', count: 4, avgRating: 4.4, growth: 8.7 },
          { category: 'painting', count: 3, avgRating: 4.8, growth: 15.3 },
          { category: 'electrical', count: 2, avgRating: 4.1, growth: 2.1 }
        ],
        sentimentTrend: [
          { period: 'Week 1', positive: 65, neutral: 25, negative: 10 },
          { period: 'Week 2', positive: 72, neutral: 20, negative: 8 },
          { period: 'Week 3', positive: 68, neutral: 22, negative: 10 },
          { period: 'Week 4', positive: 75, neutral: 18, negative: 7 }
        ],
        responseTimeMetrics: [
          { day: 'Mon', avgTime: 45, target: 60 },
          { day: 'Tue', avgTime: 38, target: 60 },
          { day: 'Wed', avgTime: 52, target: 60 },
          { day: 'Thu', avgTime: 41, target: 60 },
          { day: 'Fri', avgTime: 48, target: 60 },
          { day: 'Sat', avgTime: 65, target: 60 },
          { day: 'Sun', avgTime: 58, target: 60 }
        ],
        topPerformers: [
          { category: 'cleaning', rating: 4.8, reviews: 8, revenue: 45000, growth: 12.5 },
          { category: 'painting', rating: 4.7, reviews: 3, revenue: 28000, growth: 15.3 },
          { category: 'ac', rating: 4.6, reviews: 4, revenue: 32000, growth: 8.7 }
        ],
        improvementAreas: [
          { area: 'Response Time', currentScore: 3.8, targetScore: 4.5, priority: 'high' },
          { area: 'Communication', currentScore: 4.2, targetScore: 4.7, priority: 'medium' },
          { area: 'Punctuality', currentScore: 4.1, targetScore: 4.6, priority: 'medium' }
        ]
      }
      
      // Mock notifications
      const mockNotifications: ReviewNotification[] = [
        {
          id: 'n001',
          type: 'new_review',
          title: 'New 5-Star Review!',
          message: 'Sarah Johnson left a 5-star review for Web Development',
          reviewId: 'cr001',
          timestamp: '2024-11-22T09:15:00',
          read: false,
          priority: 'high',
          actions: [
            { label: 'View Review', action: 'view' },
            { label: 'Respond', action: 'respond' }
          ]
        },
        {
          id: 'n002',
          type: 'milestone',
          title: 'Milestone Achieved!',
          message: 'You have received 50 reviews this month!',
          timestamp: '2024-11-21T18:30:00',
          read: false,
          priority: 'medium',
          actions: [
            { label: 'View Analytics', action: 'analytics' },
            { label: 'Share', action: 'share' }
          ]
        },
        {
          id: 'n003',
          type: 'response',
          title: 'New Response Received',
          message: 'Sparkle Clean Pro responded to your review',
          reviewId: 'r001',
          timestamp: '2024-11-21T10:30:00',
          read: true,
          priority: 'low',
          actions: [
            { label: 'View Response', action: 'view' }
          ]
        }
      ]
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMyReviews(mockMyReviews)
      setCustomerReviews(mockCustomerReviews)
      setAnalytics(mockAnalytics)
      setNotifications(mockNotifications)
      setUnreadNotifications(mockNotifications.filter(n => !n.read).length)
      setLoading(false)
    }

    if (user) {
      loadReviewData()
    }
  }, [user])
  
  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      // Refresh data logic here
      console.log('Auto-refreshing reviews...')
    }, refreshInterval)
    
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])
  
  // Advanced search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    // Implement search logic
  }, [])
  
  // Advanced bulk actions
  const handleBulkSelect = useCallback((reviewId: string) => {
    const newSelected = new Set(selectedReviews)
    if (newSelected.has(reviewId)) {
      newSelected.delete(reviewId)
    } else {
      newSelected.add(reviewId)
    }
    setSelectedReviews(newSelected)
  }, [selectedReviews])
  
  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedReviews(new Set())
    } else {
      // Get all review IDs from both filtered lists
      const myReviewIds = myReviews.map(r => r.id)
      const customerReviewIds = customerReviews.map(r => r.id)
      const allReviewIds = [...myReviewIds, ...customerReviewIds]
      setSelectedReviews(new Set(allReviewIds))
    }
    setSelectAll(!selectAll)
  }, [selectAll, myReviews, customerReviews])
  
  const handleBulkAction = useCallback((action: 'respond' | 'delete' | 'flag' | 'hide' | 'export') => {
    setBulkAction(action)
    setShowBulkActionsModal(true)
  }, [])
  
  // Advanced export functionality
  const handleExport = useCallback((options: ExportOptions) => {
    // Implement export logic
    console.log('Exporting reviews with options:', options)
    setShowExportModal(false)
  }, [])
  
  // Advanced notification handling
  const handleNotificationClick = useCallback((notification: ReviewNotification) => {
    // Mark as read
    setNotifications(prev => prev.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ))
    setUnreadNotifications(prev => Math.max(0, prev - 1))
    
    // Handle action
    if (notification.actions && notification.actions.length > 0) {
      const action = notification.actions[0]
      switch (action.action) {
        case 'view':
          if (notification.reviewId) {
            const review = [...myReviews, ...customerReviews].find(r => r.id === notification.reviewId)
            if (review) setSelectedReview(review)
          }
          break
        case 'respond':
          if (notification.reviewId) {
            const review = customerReviews.find(r => r.id === notification.reviewId)
            if (review) {
              setSelectedReview(review)
              setShowResponseModal(true)
            }
          }
          break
        case 'analytics':
          setActiveTab('analytics')
          break
        case 'share':
          // Implement share functionality
          break
      }
    }
  }, [myReviews, customerReviews])
  
  // Advanced AI insights
  const generateAIInsights = useCallback((review: Review | CustomerReview) => {
    if (!review.aiInsights) return null
    
    return (
      <div className="ai-insights">
        <div className="insights-header">
          <span className="ai-badge">🤖 AI Insights</span>
          <span className="confidence">Confidence: {(review.aiInsights.confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="insights-content">
          <div className="key-phrases">
            <h6>Key Phrases</h6>
            <div className="phrases-list">
              {review.aiInsights.keyPhrases.map((phrase, index) => (
                <span key={index} className="phrase-tag">{phrase}</span>
              ))}
            </div>
          </div>
          <div className="emotions">
            <h6>Detected Emotions</h6>
            <div className="emotions-list">
              {review.aiInsights.emotions.map((emotion, index) => (
                <span key={index} className="emotion-tag">{emotion}</span>
              ))}
            </div>
          </div>
          {review.aiInsights.improvementSuggestions && review.aiInsights.improvementSuggestions.length > 0 && (
            <div className="improvements">
              <h6>Improvement Suggestions</h6>
              <ul>
                {review.aiInsights.improvementSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }, [])

  // Calculate comprehensive statistics
  const stats = useMemo<ReviewStats>(() => {
    const allReviews = [...myReviews, ...customerReviews]
    const totalReviews = allReviews.length
    
    const ratingCounts = {
      5: allReviews.filter(r => r.rating === 5).length,
      4: allReviews.filter(r => r.rating === 4).length,
      3: allReviews.filter(r => r.rating === 3).length,
      2: allReviews.filter(r => r.rating === 2).length,
      1: allReviews.filter(r => r.rating === 1).length
    }
    
    const averageRating = totalReviews > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0
    
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const thisMonthReviews = allReviews.filter(r => new Date(r.createdAt) >= thisMonth)
    const thisMonthRating = thisMonthReviews.length > 0
      ? thisMonthReviews.reduce((sum, r) => sum + r.rating, 0) / thisMonthReviews.length
      : 0
    
    const recentReviews = allReviews.filter(r => {
      const reviewDate = new Date(r.createdAt)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return reviewDate >= thirtyDaysAgo
    }).length
    
    const pendingResponses = customerReviews.filter(r => !r.response).length
    const verifiedReviews = allReviews.filter(r => 
      'verified' in r ? r.verified : r.customerVerified
    ).length
    const helpfulVotes = allReviews.reduce((sum, r) => sum + r.helpful, 0)
    const reportCount = allReviews.reduce((sum, r) => sum + r.reportCount, 0)
    
    // Calculate categories with growth
    const categoryStats = allReviews.reduce((acc, r) => {
      if (!acc[r.category]) {
        acc[r.category] = { count: 0, totalRating: 0 }
      }
      acc[r.category].count++
      acc[r.category].totalRating += r.rating
      return acc
    }, {} as Record<string, { count: number; totalRating: number }>)
    
    const topCategories = Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        count: stats.count,
        avgRating: stats.totalRating / stats.count,
        growth: Math.random() * 20 - 5 // Mock growth data
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    // Calculate sentiment
    const positiveReviews = allReviews.filter(r => r.sentiment === 'positive').length
    const sentimentScore = totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 0
    
    const responseRate = customerReviews.length > 0
      ? (customerReviews.filter(r => r.response).length / customerReviews.length) * 100
      : 0
    
    // Advanced metrics
    const engagementRate = allReviews.length > 0
      ? (allReviews.reduce((sum, r) => sum + (r.engagement?.views || 0), 0) / allReviews.length) / 100
      : 0
    
    const netPromoterScore = (() => {
      const promoters = allReviews.filter(r => r.rating >= 4).length
      const detractors = allReviews.filter(r => r.rating <= 2).length
      return totalReviews > 0 ? ((promoters - detractors) / totalReviews) * 100 : 0
    })()
    
    const customerEffortScore = totalReviews > 0
      ? (allReviews.reduce((sum, r) => sum + (r.communication || 0), 0) / totalReviews) * 20
      : 0
    
    const firstResponseTime = customerReviews.length > 0
      ? customerReviews.reduce((sum, r) => sum + (r.response?.responseTime || 0), 0) / customerReviews.length
      : 0
    
    const customerLifetimeValue = allReviews.reduce((sum, r) => sum + (r.metadata?.bookingValue || 0), 0)
    
    const reviewVelocity = recentReviews / 30 // Reviews per day
    
    const sentimentVelocity = sentimentScore / 100 // Sentiment change rate
    
    // Top performers with revenue
    const topPerformers = Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        rating: stats.totalRating / stats.count,
        reviews: stats.count,
        revenue: Math.random() * 100000, // Mock revenue
        growth: Math.random() * 20 - 5
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3)
    
    // Worst performers
    const worstPerformers = Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        rating: stats.totalRating / stats.count,
        reviews: stats.count,
        issues: ['Communication', 'Punctuality', 'Quality'] // Mock issues
      }))
      .sort((a, b) => a.rating - b.rating)
      .slice(0, 3)
    
    // Seasonal trends
    const seasonalTrends = [
      { season: 'Spring', reviews: 12, rating: 4.3, revenue: 45000 },
      { season: 'Summer', reviews: 18, rating: 4.5, revenue: 67000 },
      { season: 'Fall', reviews: 15, rating: 4.2, revenue: 52000 },
      { season: 'Winter', reviews: 10, rating: 4.1, revenue: 38000 }
    ]
    
    // Geographic performance
    const geographicPerformance = [
      { location: 'Delhi', reviews: 8, rating: 4.4, growth: 12.5 },
      { location: 'Mumbai', reviews: 6, rating: 4.2, growth: 8.3 },
      { location: 'Gurgaon', reviews: 4, rating: 4.6, growth: 15.7 },
      { location: 'Bangalore', reviews: 3, rating: 4.3, growth: 5.2 }
    ]
    
    return {
      totalReviews,
      averageRating,
      fiveStarReviews: ratingCounts[5],
      fourStarReviews: ratingCounts[4],
      threeStarReviews: ratingCounts[3],
      twoStarReviews: ratingCounts[2],
      oneStarReviews: ratingCounts[1],
      recentReviews,
      pendingResponses,
      verifiedReviews,
      helpfulVotes,
      reportCount,
      averageResponseTime: '2 hours',
      responseRate,
      topCategories,
      improvementAreas: ['Response Time', 'Communication', 'Documentation'],
      strengths: ['Quality', 'Professionalism', 'Value'],
      sentimentScore,
      customerSatisfaction: averageRating * 20,
      repeatCustomerRate: 85,
      thisMonthReviews: thisMonthReviews.length,
      thisMonthRating,
      trendDirection: 'up',
      overallRank: 12,
      totalProviders: 156,
      // Advanced metrics
      engagementRate,
      conversionRate: 3.2,
      retentionRate: 87,
      netPromoterScore,
      customerEffortScore,
      firstResponseTime,
      resolutionTime: 180,
      customerLifetimeValue,
      reviewVelocity,
      sentimentVelocity,
      topPerformers,
      worstPerformers,
      seasonalTrends,
      geographicPerformance
    }
  }, [myReviews, customerReviews])

  // Filter and sort reviews with advanced logic
  const filteredMyReviews = useMemo(() => {
    let filtered = [...myReviews]

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply basic filters
    if (filters.rating > 0) {
      filtered = filtered.filter(r => r.rating === filters.rating)
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(r => r.category === filters.category)
    }

    if (filters.sentiment !== 'all') {
      filtered = filtered.filter(r => r.sentiment === filters.sentiment)
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(r => r.status === filters.status)
    }

    // Apply advanced filters
    if (filters.priceRanges.length > 0) {
      filtered = filtered.filter(r => filters.priceRanges.includes(r.priceRange))
    }

    if (filters.subcategories.length > 0) {
      filtered = filtered.filter(r => r.subcategory && filters.subcategories.includes(r.subcategory))
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(r => r.tags && r.tags.some(tag => filters.tags.includes(tag)))
    }

    if (filters.reviewerType.length > 0) {
      filtered = filtered.filter(r => r.metadata?.reviewerType && filters.reviewerType.includes(r.metadata.reviewerType))
    }

    if (filters.source.length > 0) {
      filtered = filtered.filter(r => r.metadata?.source && filters.source.includes(r.metadata.source))
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter(r => r.rating >= filters.minRating)
    }

    if (filters.maxRating < 5) {
      filtered = filtered.filter(r => r.rating <= filters.maxRating)
    }

    if (filters.minHelpful > 0) {
      filtered = filtered.filter(r => r.helpful >= filters.minHelpful)
    }

    if (filters.hasPros) {
      filtered = filtered.filter(r => r.pros && r.pros.length > 0)
    }

    if (filters.hasCons) {
      filtered = filtered.filter(r => r.cons && r.cons.length > 0)
    }

    if (filters.hasTags) {
      filtered = filtered.filter(r => r.tags && r.tags.length > 0)
    }

    if (filters.aiSentiment.length > 0) {
      filtered = filtered.filter(r => r.aiInsights && filters.aiSentiment.includes(r.aiInsights.sentiment))
    }

    if (filters.verifiedOnly) {
      filtered = filtered.filter(r => r.verified)
    }

    if (filters.flaggedOnly) {
      filtered = filtered.filter(r => r.status === 'flagged')
    }

    if (filters.respondedOnly) {
      filtered = filtered.filter(r => !!r.response)
    }

    if (filters.pendingOnly) {
      filtered = filtered.filter(r => r.status === 'pending')
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date()
      let filterDate: Date
      
      switch (filters.dateRange) {
        case 'today':
          filterDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          filterDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3)
          filterDate = new Date(now.getFullYear(), quarter * 3, 1)
          break
        case 'year':
          filterDate = new Date(now.getFullYear(), 0, 1)
          break
        default:
          filterDate = new Date(0)
      }
      
      filtered = filtered.filter(r => new Date(r.createdAt) >= filterDate)
    }

    // Apply boolean filters
    if (filters.hasResponse) {
      filtered = filtered.filter(r => !!r.response)
    }

    if (filters.hasPhotos) {
      filtered = filtered.filter(r => r.photos && r.photos.length > 0)
    }

    if (filters.verified) {
      filtered = filtered.filter(r => r.verified)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'rating':
          comparison = a.rating - b.rating
          break
        case 'helpful':
          comparison = a.helpful - b.helpful
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
        case 'sentiment':
          comparison = a.sentiment.localeCompare(b.sentiment)
          break
        case 'price':
          comparison = (a.metadata?.bookingValue || 0) - (b.metadata?.bookingValue || 0)
          break
        case 'response':
          comparison = (a.response?.responseTime || Infinity) - (b.response?.responseTime || Infinity)
          break
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [myReviews, filters, searchQuery])

  const filteredCustomerReviews = useMemo(() => {
    let filtered = [...customerReviews]

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply similar filters as myReviews (simplified for brevity)
    if (filters.rating > 0) {
      filtered = filtered.filter(r => r.rating === filters.rating)
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(r => r.category === filters.category)
    }

    if (filters.sentiment !== 'all') {
      filtered = filtered.filter(r => r.sentiment === filters.sentiment)
    }

    if (filters.hasResponse) {
      filtered = filtered.filter(r => !!r.response)
    }

    if (filters.hasPhotos) {
      filtered = filtered.filter(r => r.photos && r.photos.length > 0)
    }

    if (filters.verified) {
      filtered = filtered.filter(r => r.customerVerified)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'rating':
          comparison = a.rating - b.rating
          break
        case 'helpful':
          comparison = a.helpful - b.helpful
          break
        case 'price':
          comparison = (a.metadata?.bookingValue || 0) - (b.metadata?.bookingValue || 0)
          break
        case 'response':
          comparison = (a.response?.responseTime || Infinity) - (b.response?.responseTime || Infinity)
          break
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [customerReviews, filters, searchQuery])

  // Format functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className={`stars-container ${interactive ? 'interactive' : ''}`}>
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            className={`star ${i < rating ? 'filled' : 'empty'}`}
            onClick={() => interactive && onRatingChange?.(i + 1)}
            disabled={!interactive}
          >
            ⭐
          </button>
        ))}
      </div>
    )
  }

  // Action handlers
  const toggleReviewExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews)
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId)
    } else {
      newExpanded.add(reviewId)
    }
    setExpandedReviews(newExpanded)
  }

  const handleWriteReview = () => {
    setShowWriteReviewModal(true)
  }

  const handleEditReview = (review: Review) => {
    setSelectedReview(review)
    setNewReview({
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      pros: review.pros || [],
      cons: review.cons || [],
      tags: review.tags || [],
      photos: review.photos || [],
      valueForMoney: review.valueForMoney,
      quality: review.quality,
      punctuality: review.punctuality,
      professionalism: review.professionalism,
      communication: review.communication,
      wouldRecommend: review.wouldRecommend,
      wouldHireAgain: review.wouldHireAgain
    })
    setShowEditReviewModal(true)
  }

  const handleRespondToReview = (review: CustomerReview) => {
    setSelectedReview(review)
    setShowResponseModal(true)
  }

  const handleReportReview = (review: Review | CustomerReview) => {
    setSelectedReview(review)
    setShowReportModal(true)
  }

  const handleDeleteReview = (review: Review) => {
    setSelectedReview(review)
    setShowDeleteModal(true)
  }

  const submitReview = () => {
    // Add new review logic
    setShowWriteReviewModal(false)
    setNewReview({
      rating: 0,
      title: '',
      comment: '',
      pros: [],
      cons: [],
      tags: [],
      photos: [],
      valueForMoney: 5,
      quality: 5,
      punctuality: 5,
      professionalism: 5,
      communication: 5,
      wouldRecommend: true,
      wouldHireAgain: true
    })
  }

  const submitResponse = () => {
    if (selectedReview && responseText) {
      // Add response logic
      setShowResponseModal(false)
      setResponseText('')
      setSelectedReview(null)
    }
  }

  const submitReport = () => {
    if (selectedReview && reportReason && reportDescription) {
      // Add report logic
      setShowReportModal(false)
      setReportReason('')
      setReportDescription('')
      setSelectedReview(null)
    }
  }

  const confirmDeleteReview = () => {
    if (selectedReview) {
      // Delete review logic
      setShowDeleteModal(false)
      setSelectedReview(null)
    }
  }

  if (loading) {
    return (
      <div className="profile-reviews-advanced">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-reviews-advanced">
      {/* Advanced Header with Notifications */}
      <section className="reviews-header">
        <div className="reviews-header-content">
          <div className="reviews-title-section">
            <h1 className="reviews-title">Reviews & Ratings</h1>
            <p className="reviews-subtitle">
              Manage your reviews and analyze customer feedback
            </p>
          </div>
          
          <div className="reviews-header-actions">
            <div className="header-search">
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
              <button className="search-btn">🔍</button>
            </div>
            
            <div className="header-actions-group">
              <button className="write-review-btn" onClick={handleWriteReview}>
                <span className="btn-icon">✍️</span>
                <span>Write Review</span>
              </button>
              
              <button className="analytics-btn" onClick={() => setShowAnalyticsModal(true)}>
                <span className="btn-icon">📊</span>
                <span>Analytics</span>
              </button>
              
              <button className="export-btn" onClick={() => setShowExportModal(true)}>
                <span className="btn-icon">📥</span>
                <span>Export</span>
              </button>
              
              <div className="notification-bell">
                <button className="notification-btn" onClick={() => setActiveTab('notifications')}>
                  <span className="btn-icon">🔔</span>
                  {unreadNotifications > 0 && (
                    <span className="notification-badge">{unreadNotifications}</span>
                  )}
                </button>
              </div>
              
              <button className="settings-btn" onClick={() => setShowAdvancedFiltersModal(true)}>
                <span className="btn-icon">⚙️</span>
              </button>
              
              <div className="view-toggle">
                {filterConfig.viewMode.map((mode) => (
                  <button
                    key={mode.value}
                    className={`view-btn ${filters.viewMode === mode.value ? 'active' : ''}`}
                    onClick={() => setFilters({...filters, viewMode: mode.value as ViewModeKey})}
                    title={mode.label}
                  >
                    <span>{mode.icon}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats Bar */}
        <div className="quick-stats-bar">
          <div className="quick-stat">
            <span className="stat-value">{stats.totalReviews}</span>
            <span className="stat-label">Total Reviews</span>
          </div>
          <div className="quick-stat">
            <span className="stat-value">{stats.averageRating.toFixed(1)}</span>
            <span className="stat-label">Avg Rating</span>
          </div>
          <div className="quick-stat">
            <span className="stat-value">{stats.responseRate.toFixed(1)}%</span>
            <span className="stat-label">Response Rate</span>
          </div>
          <div className="quick-stat">
            <span className="stat-value">{stats.pendingResponses}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="quick-stat">
            <span className="stat-value">{stats.sentimentScore.toFixed(1)}%</span>
            <span className="stat-label">Positive</span>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Cards */}
      <section className="reviews-stats">
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalReviews}</div>
              <div className="stat-label">Total Reviews</div>
              <div className="stat-change">Rank #{stats.overallRank} of {stats.totalProviders}</div>
            </div>
          </div>
          <div className="stat-card rating">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-number">{Number(stats.averageRating).toFixed(1)} Avg Rating</div>
              <div className="stat-label">Average Rating</div>
              <div className="stat-change">{stats.trendDirection === 'up' ? '↑' : stats.trendDirection === 'down' ? '↓' : '→'} This month</div>
            </div>
          </div>
          <div className="stat-card five-star">
            <div className="stat-icon">🌟</div>
            <div className="stat-content">
              <div className="stat-number">{stats.fiveStarReviews}</div>
              <div className="stat-label">5-Star Reviews</div>
              <div className="stat-change">{((stats.fiveStarReviews / stats.totalReviews) * 100).toFixed(1)}% of total</div>
            </div>
          </div>
          <div className="stat-card recent">
            <div className="stat-icon">🕒</div>
            <div className="stat-content">
              <div className="stat-number">{stats.recentReviews}</div>
              <div className="stat-label">Recent Reviews</div>
              <div className="stat-change">Last 30 days</div>
            </div>
          </div>
          <div className="stat-card responses">
            <div className="stat-icon">💬</div>
            <div className="stat-content">
              <div className="stat-number">{stats.responseRate.toFixed(1)}%</div>
              <div className="stat-label">Response Rate</div>
              <div className="stat-change">{stats.pendingResponses} pending</div>
            </div>
          </div>
          <div className="stat-card sentiment">
            <div className="stat-icon">😊</div>
            <div className="stat-content">
              <div className="stat-number">{stats.sentimentScore.toFixed(1)}%</div>
              <div className="stat-label">Positive Sentiment</div>
              <div className="stat-change">{stats.customerSatisfaction.toFixed(1)}% satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Tabs with Advanced Options */}
      <section className="reviews-tabs">
        <div className="tabs-navigation">
          {[
            { id: 'my-reviews', label: 'My Reviews', count: myReviews.length, icon: '✍️' },
            { id: 'customer-reviews', label: 'Customer Reviews', count: customerReviews.length, icon: '👥' },
            { id: 'analytics', label: 'Analytics', count: null, icon: '📊' },
            { id: 'insights', label: 'Insights', count: null, icon: '💡' },
            { id: 'notifications', label: 'Notifications', count: unreadNotifications, icon: '🔔' },
            { id: 'search', label: 'Advanced Search', count: null, icon: '🔍' },
            { id: 'export', label: 'Export', count: null, icon: '📥' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {tab.count !== null && (
                <span className="tab-count">({tab.count})</span>
              )}
            </button>
          ))}
        </div>
        
        {/* Advanced Filter Bar */}
        <div className="advanced-filter-bar">
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={filters.category}
              onChange={e => setFilters({...filters, category: e.target.value})}
              className="filter-select"
            >
              {Object.entries(categoryConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.icon} {config.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Rating:</label>
            <select
              value={filters.rating}
              onChange={e => setFilters({...filters, rating: Number(e.target.value)})}
              className="filter-select"
            >
              <option value="0">All Ratings</option>
              <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
              <option value="4">4 Stars ⭐⭐⭐⭐</option>
              <option value="3">3 Stars ⭐⭐⭐</option>
              <option value="2">2 Stars ⭐⭐</option>
              <option value="1">1 Star ⭐</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Date Range:</label>
            <select
              value={filters.dateRange}
              onChange={e => setFilters({...filters, dateRange: e.target.value as DateRangeKey})}
              className="filter-select"
            >
              {filterConfig.dateRange.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.icon} {range.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort By:</label>
            <select
              value={filters.sortBy}
              onChange={e => setFilters({...filters, sortBy: e.target.value as SortByKey})}
              className="filter-select"
            >
              {filterConfig.sortBy.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.icon} {sort.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Order:</label>
            <select
              value={filters.sortOrder}
              onChange={e => setFilters({...filters, sortOrder: e.target.value as 'asc' | 'desc'})}
              className="filter-select"
            >
              <option value="desc">↓ Descending</option>
              <option value="asc">↑ Ascending</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Quick Filters:</label>
            <div className="quick-filters">
              <button
                className={`quick-filter-btn ${filters.hasResponse ? 'active' : ''}`}
                onClick={() => setFilters({...filters, hasResponse: !filters.hasResponse})}
              >
                💬 Has Response
              </button>
              <button
                className={`quick-filter-btn ${filters.hasPhotos ? 'active' : ''}`}
                onClick={() => setFilters({...filters, hasPhotos: !filters.hasPhotos})}
              >
                📷 Has Photos
              </button>
              <button
                className={`quick-filter-btn ${filters.verified ? 'active' : ''}`}
                onClick={() => setFilters({...filters, verified: !filters.verified})}
              >
                ✓ Verified
              </button>
            </div>
          </div>
          
          <div className="filter-actions">
            <button
              className="reset-filters-btn"
              onClick={() => setFilters({
                rating: 0,
                category: 'all',
                sentiment: 'all',
                status: 'all',
                dateRange: 'all',
                hasResponse: false,
                hasPhotos: false,
                verified: false,
                sortBy: 'date',
                sortOrder: 'desc',
                viewMode: 'list',
                priceRanges: [],
                subcategories: [],
                tags: [],
                reviewerType: [],
                source: [],
                minRating: 0,
                maxRating: 5,
                minHelpful: 0,
                hasPros: false,
                hasCons: false,
                hasTags: false,
                responseTime: 'normal',
                engagement: 'medium',
                aiSentiment: [],
                verifiedOnly: false,
                flaggedOnly: false,
                respondedOnly: false,
                pendingOnly: false
              })}
            >
              Reset Filters
            </button>
            <button
              className="advanced-filters-btn"
              onClick={() => setShowAdvancedFiltersModal(true)}
            >
              ⚙️ Advanced Filters
            </button>
          </div>
        </div>
      </section>

      {/* My Reviews Tab */}
      {activeTab === 'my-reviews' && (
        <section className="my-reviews-section">
          <div className="reviews-header">
            <div className="reviews-title">
              <h2>Reviews I've Written</h2>
              <p>Your feedback helps service providers improve their services</p>
            </div>
            
            <div className="reviews-controls">
              <div className="filter-controls">
                <select
                  value={filters.rating}
                  onChange={e => setFilters({...filters, rating: Number(e.target.value)})}
                  className="filter-select"
                >
                  <option value="0">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
                
                <select
                  value={filters.category}
                  onChange={e => setFilters({...filters, category: e.target.value})}
                  className="filter-select"
                >
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
                
                <select
                  value={filters.sortBy}
                  onChange={e => setFilters({...filters, sortBy: e.target.value as any})}
                  className="filter-select"
                >
                  <option value="date">Sort by Date</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="helpful">Sort by Helpful</option>
                </select>
              </div>
              
              <div className="view-toggle">
                <button className={`view-btn ${filters.viewMode === 'list' ? 'active' : ''}`}>
                  <span>☰</span>
                </button>
                <button className={`view-btn ${filters.viewMode === 'grid' ? 'active' : ''}`}>
                  <span>⊞</span>
                </button>
              </div>
            </div>
          </div>

          {filteredMyReviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✍️</div>
              <h3>No Reviews Found</h3>
              <p>
                {myReviews.length === 0 
                  ? 'Start reviewing services you have used to help others make informed decisions'
                  : 'Try adjusting your filters to see more reviews'}
              </p>
              {myReviews.length === 0 && (
                <Link to="/profile/bookings" className="view-bookings-btn">
                  <span className="btn-icon">📅</span>
                  <span>View Completed Bookings</span>
                </Link>
              )}
            </div>
          ) : (
            <div className={`reviews-container ${filters.viewMode}`}>
              {filteredMyReviews.map(review => (
                <div key={review.id} className={`review-card ${expandedReviews.has(review.id) ? 'expanded' : ''}`}>
                  <div className="review-header">
                    <div className="service-info">
                      <h3 className="service-name">{review.serviceName}</h3>
                      <div className="provider-info">
                        {review.providerPhoto && (
                          <img src={review.providerPhoto} alt={review.providerName} className="provider-photo" />
                        )}
                        <div className="provider-details">
                          <p className="provider-name">{review.providerName}</p>
                          {review.providerRating && (
                            <span className="provider-rating">⭐ {review.providerRating}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="rating-section">
                      <div className="rating-stars">
                        {renderStars(review.rating)}
                        <span className="rating-number">{review.rating}.0</span>
                      </div>
                      <div className="sentiment-badge" style={{ '--sentiment-color': sentimentConfig[review.sentiment].color } as React.CSSProperties}>
                        <span className="sentiment-icon">{sentimentConfig[review.sentiment].icon}</span>
                        <span className="sentiment-label">{sentimentConfig[review.sentiment].label}</span>
                      </div>
                    </div>
                  </div>

                  <div className="review-content">
                    <h4 className="review-title">{review.title}</h4>
                    <p className="review-comment">{review.comment}</p>
                    
                    {(review.pros || review.cons) && (
                      <div className="pros-cons">
                        {review.pros && review.pros.length > 0 && (
                          <div className="pros">
                            <h5>✅ Pros</h5>
                            <ul>
                              {review.pros.map((pro, index) => (
                                <li key={index}>{pro}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {review.cons && review.cons.length > 0 && (
                          <div className="cons">
                            <h5>❌ Cons</h5>
                            <ul>
                              {review.cons.map((con, index) => (
                                <li key={index}>{con}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {review.tags && review.tags.length > 0 && (
                      <div className="review-tags">
                        {review.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    
                    {review.photos && review.photos.length > 0 && (
                      <div className="review-photos">
                        <h5>Photos</h5>
                        <div className="photos-grid">
                          {review.photos.map((photo, index) => (
                            <img key={index} src={photo} alt="Review photo" className="review-photo" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="review-meta">
                    <div className="meta-left">
                      <span className="review-date">{getRelativeTime(review.createdAt)}</span>
                      {review.verified && (
                        <span className="verified-badge">✓ Verified Purchase</span>
                      )}
                      <span className="category-badge">{categoryConfig[review.category]?.icon} {categoryConfig[review.category]?.label}</span>
                    </div>
                    
                    <div className="meta-right">
                      <div className="helpful-section">
                        <button className="helpful-btn">
                          👍 Helpful ({review.helpful})
                        </button>
                        <button className="not-helpful-btn">
                          👎 Not Helpful ({review.notHelpful})
                        </button>
                      </div>
                      
                      <div className="review-actions">
                        <button 
                          className="action-btn expand"
                          onClick={() => toggleReviewExpansion(review.id)}
                        >
                          {expandedReviews.has(review.id) ? 'Show Less' : 'Show More'}
                        </button>
                        
                        <button 
                          className="action-btn edit"
                          onClick={() => handleEditReview(review)}
                        >
                          Edit
                        </button>
                        
                        <Link to={`/profile/bookings`} className="action-btn booking">
                          View Booking
                        </Link>
                        
                        <button 
                          className="action-btn report"
                          onClick={() => handleReportReview(review)}
                        >
                          Report
                        </button>
                      </div>
                    </div>
                  </div>

                  {review.response && (
                    <div className="provider-response">
                      <div className="response-header">
                        <div className="response-info">
                          <span className="response-label">Provider Response</span>
                          <span className="response-date">{getRelativeTime(review.response.date)}</span>
                        </div>
                        {review.response.professional && (
                          <span className="professional-badge">Professional Response</span>
                        )}
                      </div>
                      <p className="response-comment">{review.response.comment}</p>
                      <div className="response-actions">
                        <button className="helpful-btn">
                          👍 Helpful ({review.response.helpful})
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Customer Reviews Tab */}
      {activeTab === 'customer-reviews' && (
        <section className="customer-reviews-section">
          <div className="reviews-header">
            <div className="reviews-title">
              <h2>Customer Reviews</h2>
              <p>Feedback from customers about your services</p>
            </div>
            
            <div className="reviews-controls">
              <div className="stats-summary">
                <div className="summary-item">
                  <span className="summary-label">Pending Responses:</span>
                  <span className="summary-value">{stats.pendingResponses}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Response Rate:</span>
                  <span className="summary-value">{stats.responseRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {filteredCustomerReviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No Customer Reviews Yet</h3>
              <p>Complete bookings to start receiving reviews from customers</p>
              <Link to="/provider" className="manage-services-btn">
                <span className="btn-icon">⚙️</span>
                <span>Manage Services</span>
              </Link>
            </div>
          ) : (
            <div className="reviews-container">
              {filteredCustomerReviews.map(review => (
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
                        <p className="service-name">{review.serviceName}</p>
                        {review.customerRating && (
                          <span className="customer-rating">⭐ {review.customerRating}</span>
                        )}
                        {review.customerVerified && (
                          <span className="verified-badge">✓ Verified</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="rating-section">
                      <div className="rating-stars">
                        {renderStars(review.rating)}
                        <span className="rating-number">{review.rating}.0</span>
                      </div>
                      <div className="sentiment-badge" style={{ '--sentiment-color': sentimentConfig[review.sentiment].color } as React.CSSProperties}>
                        <span className="sentiment-icon">{sentimentConfig[review.sentiment].icon}</span>
                        <span className="sentiment-label">{sentimentConfig[review.sentiment].label}</span>
                      </div>
                    </div>
                  </div>

                  <div className="review-content">
                    <h4 className="review-title">{review.title}</h4>
                    <p className="review-comment">{review.comment}</p>
                    
                    {(review.pros || review.cons) && (
                      <div className="pros-cons">
                        {review.pros && review.pros.length > 0 && (
                          <div className="pros">
                            <h5>✅ Pros</h5>
                            <ul>
                              {review.pros.map((pro, index) => (
                                <li key={index}>{pro}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {review.cons && review.cons.length > 0 && (
                          <div className="cons">
                            <h5>❌ Cons</h5>
                            <ul>
                              {review.cons.map((con, index) => (
                                <li key={index}>{con}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {review.photos && review.photos.length > 0 && (
                      <div className="review-photos">
                        <h5>Photos</h5>
                        <div className="photos-grid">
                          {review.photos.map((photo, index) => (
                            <img key={index} src={photo} alt="Review photo" className="review-photo" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="review-meta">
                    <div className="meta-left">
                      <span className="review-date">{getRelativeTime(review.createdAt)}</span>
                      <span className="category-badge">{categoryConfig[review.category]?.icon} {categoryConfig[review.category]?.label}</span>
                    </div>
                    
                    <div className="meta-right">
                      <div className="helpful-section">
                        <button className="helpful-btn">
                          👍 Helpful ({review.helpful})
                        </button>
                        <button className="not-helpful-btn">
                          👎 Not Helpful ({review.notHelpful})
                        </button>
                      </div>
                      
                      <div className="review-actions">
                        {!review.response ? (
                          <button 
                            className="action-btn respond"
                            onClick={() => handleRespondToReview(review)}
                          >
                            💬 Respond
                          </button>
                        ) : (
                          <button className="action-btn view-response">
                            📄 View Response
                          </button>
                        )}
                        
                        <button 
                          className="action-btn report"
                          onClick={() => handleReportReview(review)}
                        >
                          Report
                        </button>
                      </div>
                    </div>
                  </div>

                  {review.response && (
                    <div className="provider-response">
                      <div className="response-header">
                        <div className="response-info">
                          <span className="response-label">Your Response</span>
                          <span className="response-date">{getRelativeTime(review.response.date)}</span>
                        </div>
                        {review.response.professional && (
                          <span className="professional-badge">Professional Response</span>
                        )}
                      </div>
                      <p className="response-comment">{review.response.comment}</p>
                      <div className="response-actions">
                        <button className="helpful-btn">
                          👍 Helpful ({review.response.helpful})
                        </button>
                        <button className="action-btn edit">
                          Edit Response
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <section className="analytics-section">
          <div className="analytics-header">
            <h2>Review Analytics</h2>
            <p>Detailed insights into your review performance</p>
          </div>
          
          <div className="analytics-content">
            <div className="analytics-grid">
              <div className="analytics-card rating-distribution">
                <h3>Rating Distribution</h3>
                <div className="distribution-chart">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = rating === 5 ? stats.fiveStarReviews :
                                 rating === 4 ? stats.fourStarReviews :
                                 rating === 3 ? stats.threeStarReviews :
                                 rating === 2 ? stats.twoStarReviews :
                                 stats.oneStarReviews
                    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
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
                        <span className="rating-percentage">{percentage.toFixed(1)}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div className="analytics-card category-performance">
                <h3>Top Categories</h3>
                <div className="category-list">
                  {stats.topCategories.map((category, index) => (
                    <div key={index} className="category-item">
                      <div className="category-info">
                        <span className="category-name">{category.category}</span>
                        <span className="category-count">{category.count} reviews</span>
                      </div>
                      <div className="category-rating">
                        {renderStars(Math.round(category.avgRating))}
                        <span className="rating-number">{category.avgRating.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="analytics-card sentiment-analysis">
                <h3>Sentiment Analysis</h3>
                <div className="sentiment-stats">
                  <div className="sentiment-item positive">
                    <span className="sentiment-label">Positive</span>
                    <span className="sentiment-value">{stats.sentimentScore.toFixed(1)}%</span>
                  </div>
                  <div className="sentiment-item neutral">
                    <span className="sentiment-label">Neutral</span>
                    <span className="sentiment-value">{((100 - stats.sentimentScore) * 0.3).toFixed(1)}%</span>
                  </div>
                  <div className="sentiment-item negative">
                    <span className="sentiment-label">Negative</span>
                    <span className="sentiment-value">{((100 - stats.sentimentScore) * 0.7).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="analytics-card performance-metrics">
                <h3>Performance Metrics</h3>
                <div className="metrics-grid">
                  <div className="metric-item">
                    <span className="metric-label">Customer Satisfaction</span>
                    <span className="metric-value">{stats.customerSatisfaction.toFixed(1)}%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Response Rate</span>
                    <span className="metric-value">{stats.responseRate.toFixed(1)}%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Repeat Customers</span>
                    <span className="metric-value">{stats.repeatCustomerRate}%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Average Response Time</span>
                    <span className="metric-value">{stats.averageResponseTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <section className="insights-section">
          <div className="insights-header">
            <h2>Performance Insights</h2>
            <p>AI-powered recommendations to improve your reviews</p>
          </div>
          
          <div className="insights-content">
            <div className="insights-grid">
              <div className="insight-card strengths">
                <h3>🎯 Your Strengths</h3>
                <div className="strengths-list">
                  {stats.strengths.map((strength, index) => (
                    <div key={index} className="strength-item">
                      <span className="strength-icon">✅</span>
                      <span className="strength-text">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="insight-card improvements">
                <h3>📈 Areas for Improvement</h3>
                <div className="improvements-list">
                  {stats.improvementAreas.map((area, index) => (
                    <div key={index} className="improvement-item">
                      <span className="improvement-icon">📊</span>
                      <span className="improvement-text">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="insight-card recommendations">
                <h3>💡 Recommendations</h3>
                <div className="recommendations-list">
                  <div className="recommendation-item">
                    <h4>Respond to Pending Reviews</h4>
                    <p>You have {stats.pendingResponses} reviews waiting for your response. Responding quickly can improve your rating.</p>
                    <button className="action-btn">Respond Now</button>
                  </div>
                  <div className="recommendation-item">
                    <h4>Ask for More Reviews</h4>
                    <p>Customers who had great experiences are more likely to leave reviews when prompted.</p>
                    <button className="action-btn">Send Requests</button>
                  </div>
                  <div className="recommendation-item">
                    <h4>Improve Response Time</h4>
                    <p>Your average response time is {stats.averageResponseTime}. Faster responses lead to higher satisfaction.</p>
                    <button className="action-btn">Set Up Alerts</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modals */}
      {/* Write Review Modal */}
      {showWriteReviewModal && (
        <div className="modal-overlay" onClick={() => setShowWriteReviewModal(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Write a Review</h2>
              <button onClick={() => setShowWriteReviewModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <div className="review-form">
                <div className="form-group">
                  <label>Overall Rating *</label>
                  {renderStars(newReview.rating, true, (rating) => setNewReview({...newReview, rating}))}
                </div>
                
                <div className="form-group">
                  <label>Review Title *</label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={e => setNewReview({...newReview, title: e.target.value})}
                    placeholder="Summarize your experience..."
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Your Review *</label>
                  <textarea
                    value={newReview.comment}
                    onChange={e => setNewReview({...newReview, comment: e.target.value})}
                    placeholder="Share details about your experience..."
                    rows={4}
                    className="form-textarea"
                  />
                </div>
                
                <div className="rating-breakdown">
                  <h4>Detailed Ratings</h4>
                  <div className="rating-items">
                    <div className="rating-item">
                      <label>Value for Money</label>
                      {renderStars(newReview.valueForMoney, true, (rating) => setNewReview({...newReview, valueForMoney: rating}))}
                    </div>
                    <div className="rating-item">
                      <label>Quality</label>
                      {renderStars(newReview.quality, true, (rating) => setNewReview({...newReview, quality: rating}))}
                    </div>
                    <div className="rating-item">
                      <label>Punctuality</label>
                      {renderStars(newReview.punctuality, true, (rating) => setNewReview({...newReview, punctuality: rating}))}
                    </div>
                    <div className="rating-item">
                      <label>Professionalism</label>
                      {renderStars(newReview.professionalism, true, (rating) => setNewReview({...newReview, professionalism: rating}))}
                    </div>
                    <div className="rating-item">
                      <label>Communication</label>
                      {renderStars(newReview.communication, true, (rating) => setNewReview({...newReview, communication: rating}))}
                    </div>
                  </div>
                </div>
                
                <div className="pros-cons-section">
                  <div className="form-group">
                    <label>Pros (What went well)</label>
                    <textarea
                      value={newReview.pros.join('\n')}
                      onChange={e => setNewReview({...newReview, pros: e.target.value.split('\n').filter(p => p.trim())})}
                      placeholder="List the positive aspects..."
                      rows={3}
                      className="form-textarea"
                    />
                  </div>
                  <div className="form-group">
                    <label>Cons (What could be improved)</label>
                    <textarea
                      value={newReview.cons.join('\n')}
                      onChange={e => setNewReview({...newReview, cons: e.target.value.split('\n').filter(c => c.trim())})}
                      placeholder="List areas for improvement..."
                      rows={3}
                      className="form-textarea"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Tags</label>
                  <input
                    type="text"
                    value={newReview.tags.join(', ')}
                    onChange={e => setNewReview({...newReview, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                    placeholder="Add tags separated by commas..."
                    className="form-input"
                  />
                </div>
                
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newReview.wouldRecommend}
                      onChange={e => setNewReview({...newReview, wouldRecommend: e.target.checked})}
                    />
                    <span>I would recommend this service</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newReview.wouldHireAgain}
                      onChange={e => setNewReview({...newReview, wouldHireAgain: e.target.checked})}
                    />
                    <span>I would hire this provider again</span>
                  </label>
                </div>
              </div>
              
              <div className="modal-actions">
                <button onClick={() => setShowWriteReviewModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={submitReview} className="btn-primary" disabled={!newReview.rating || !newReview.title.trim() || !newReview.comment.trim()}>
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && (
        <div className="modal-overlay" onClick={() => setShowResponseModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Respond to Review</h2>
              <button onClick={() => setShowResponseModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <div className="response-form">
                <div className="review-preview">
                  <h4>Review by {selectedReview && 'customerName' in selectedReview ? selectedReview.customerName : 'Customer'}</h4>
                  <p>{selectedReview && 'comment' in selectedReview ? selectedReview.comment : ''}</p>
                </div>
                
                <div className="form-group">
                  <label>Your Response *</label>
                  <textarea
                    value={responseText}
                    onChange={e => setResponseText(e.target.value)}
                    placeholder="Write your professional response..."
                    rows={4}
                    className="form-textarea"
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button onClick={() => setShowResponseModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={submitResponse} className="btn-primary" disabled={!responseText.trim()}>
                  Submit Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
