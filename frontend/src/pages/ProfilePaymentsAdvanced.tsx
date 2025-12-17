import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'

// Advanced payment interfaces
interface PaymentMethod {
  id: string
  type: 'card' | 'upi' | 'wallet' | 'net_banking' | 'crypto' | 'international'
  name: string
  details: string
  maskedDetails: string
  isDefault: boolean
  isVerified: boolean
  addedDate: string
  lastUsed?: string
  expiryDate?: string
  cardType?: 'visa' | 'mastercard' | 'amex' | 'rupay' | 'discover'
  bankName?: string
  walletProvider?: 'paytm' | 'phonepe' | 'googlepay' | 'amazonpay' | 'mobikwik'
  upiProvider?: 'googlepay' | 'phonepe' | 'paytm' | 'bhim' | 'other'
  cryptoWallet?: string
  internationalProvider?: 'paypal' | 'stripe' | 'wise' | 'payoneer'
  billingAddress?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  settings?: {
    autoSave: boolean
    quickPay: boolean
    notifications: boolean
    spendingLimit?: number
    monthlyLimit?: number
  }
  metadata?: {
    deviceFingerprint?: string
    ipAddress?: string
    verificationAttempts?: number
    lastVerificationDate?: string
  }
}

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  originalAmount?: number
  currency: string
  type: 'payment' | 'refund' | 'chargeback' | 'dispute' | 'fee' | 'reward' | 'cashback'
  status: 'completed' | 'pending' | 'failed' | 'processing' | 'cancelled' | 'disputed'
  method: string
  methodId: string
  bookingId?: string
  invoiceId?: string
  receiptId?: string
  refundId?: string
  chargebackId?: string
  disputeId?: string
  merchantInfo?: {
    name: string
    category: string
    logo?: string
    gstNumber?: string
  }
  fees?: {
    processing: number
    platform: number
    gateway: number
    total: number
  }
  taxes?: {
    gst: number
    serviceTax: number
    total: number
  }
  rewards?: {
    cashback: number
    points: number
    coupons: string[]
  }
  installmentInfo?: {
    totalInstallments: number
    currentInstallment: number
    installmentAmount: number
    nextDueDate: string
  }
  international?: {
    originalCurrency: string
    exchangeRate: number
    conversionFee: number
  }
  metadata?: {
    ipAddress?: string
    device?: string
    location?: string
    riskScore?: number
    fraudCheck?: string
  }
  notes?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  failedAt?: string
  cancelledAt?: string
}

interface PaymentStats {
  totalMethods: number
  defaultMethod: string
  totalSpent: number
  totalRefunds: number
  totalFees: number
  totalRewards: number
  thisMonthSpent: number
  thisMonthTransactions: number
  pendingTransactions: number
  failedTransactions: number
  averageTransaction: number
  mostUsedMethod: string
  lastTransactionDate: string
  internationalTransactions: number
  installmentPayments: number
  autoPayEnabled: boolean
  quickPayEnabled: boolean
  verificationRequired: boolean
  spendingLimit: number
  monthlySpending: number
  savingsFromRewards: number
}

interface FilterOptions {
  type: 'all' | 'payments' | 'refunds' | 'fees' | 'rewards' | 'chargeback' | 'dispute'
  status: 'all' | 'completed' | 'pending' | 'failed' | 'processing'
  method: 'all' | string
  dateRange: 'all' | 'today' | 'week' | 'month' | 'quarter' | 'year'
  amountRange: [number, number]
  searchQuery: string
  sortBy: 'date' | 'amount' | 'status' | 'method' | 'type'
  sortOrder: 'asc' | 'desc'
  viewMode: 'list' | 'grid' | 'calendar'
}

export default function ProfilePaymentsAdvanced() {
  const navigate = useNavigate()
  const { user } = useUser()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'methods' | 'transactions' | 'analytics' | 'settings'>('methods')
  const [showAddMethodModal, setShowAddMethodModal] = useState(false)
  const [showEditMethodModal, setShowEditMethodModal] = useState(false)
  const [showDeleteMethodModal, setShowDeleteMethodModal] = useState(false)
  const [showVerifyMethodModal, setShowVerifyMethodModal] = useState(false)
  const [showTransactionDetailsModal, setShowTransactionDetailsModal] = useState(false)
  const [showDisputeModal, setShowDisputeModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [newMethodType, setNewMethodType] = useState<PaymentMethod['type']>('card')
  const [verificationCode, setVerificationCode] = useState('')
  const [disputeReason, setDisputeReason] = useState('')
  const [disputeDescription, setDisputeDescription] = useState('')
  
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    status: 'all',
    method: 'all',
    dateRange: 'month',
    amountRange: [0, 100000],
    searchQuery: '',
    sortBy: 'date',
    sortOrder: 'desc',
    viewMode: 'list'
  })

  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf')

  // Payment method configurations
  const paymentMethodConfig = {
    card: { label: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, Rupay, etc.' },
    upi: { label: 'UPI Payment', icon: '📱', description: 'Google Pay, PhonePe, Paytm, BHIM' },
    wallet: { label: 'Digital Wallet', icon: '💼', description: 'Paytm, PhonePe, Amazon Pay, etc.' },
    net_banking: { label: 'Net Banking', icon: '🏦', description: 'Direct bank transfer' },
    crypto: { label: 'Cryptocurrency', icon: '₿', description: 'Bitcoin, Ethereum, etc.' },
    international: { label: 'International', icon: '🌍', description: 'PayPal, Stripe, Wise, etc.' }
  }

  const transactionStatusConfig = {
    completed: { label: 'Completed', color: '#10b981', icon: '✅', description: 'Transaction successful' },
    pending: { label: 'Pending', color: '#f59e0b', icon: '⏳', description: 'Processing payment' },
    failed: { label: 'Failed', color: '#ef4444', icon: '❌', description: 'Payment failed' },
    processing: { label: 'Processing', color: '#3b82f6', icon: '🔄', description: 'Payment in progress' },
    cancelled: { label: 'Cancelled', color: '#6b7280', icon: '🚫', description: 'Payment cancelled' },
    disputed: { label: 'Disputed', color: '#f97316', icon: '⚠️', description: 'Payment under dispute' }
  }

  const transactionTypeConfig = {
    payment: { label: 'Payment', color: '#3b82f6', icon: '💸' },
    refund: { label: 'Refund', color: '#10b981', icon: '💰' },
    chargeback: { label: 'Chargeback', color: '#ef4444', icon: '🔄' },
    dispute: { label: 'Dispute', color: '#f97316', icon: '⚠️' },
    fee: { label: 'Fee', color: '#6b7280', icon: '💳' },
    reward: { label: 'Reward', color: '#8b5cf6', icon: '🎁' },
    cashback: { label: 'Cashback', color: '#ec4899', icon: '💵' }
  }

  // Load payment data with comprehensive mock data
  useEffect(() => {
    const loadPaymentData = async () => {
      setLoading(true)
      
      // Enhanced mock payment methods
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: 'pm001',
          type: 'card',
          name: 'HDFC Visa Credit Card',
          details: '4234 5678 9012 3456',
          maskedDetails: '**** **** **** 3456',
          isDefault: true,
          isVerified: true,
          addedDate: '2023-01-15',
          lastUsed: '2024-11-22',
          expiryDate: '2025-12-31',
          cardType: 'visa',
          bankName: 'HDFC Bank',
          billingAddress: {
            street: '123, Palm Greens',
            city: 'Gurgaon',
            state: 'Haryana',
            zip: '122001',
            country: 'India'
          },
          settings: {
            autoSave: true,
            quickPay: true,
            notifications: true,
            spendingLimit: 50000,
            monthlyLimit: 200000
          },
          metadata: {
            deviceFingerprint: 'fp_123456',
            ipAddress: '192.168.1.1',
            verificationAttempts: 2,
            lastVerificationDate: '2024-11-20'
          }
        },
        {
          id: 'pm002',
          type: 'upi',
          name: 'Google Pay',
          details: 'superman.verma@okicici',
          maskedDetails: 'super****@okicici',
          isDefault: false,
          isVerified: true,
          addedDate: '2023-03-20',
          lastUsed: '2024-11-20',
          upiProvider: 'googlepay',
          settings: {
            autoSave: false,
            quickPay: true,
            notifications: true,
            spendingLimit: 25000,
            monthlyLimit: 100000
          }
        },
        {
          id: 'pm003',
          type: 'wallet',
          name: 'Paytm Wallet',
          details: '9876543210',
          maskedDetails: '****543210',
          isDefault: false,
          isVerified: true,
          addedDate: '2023-06-10',
          lastUsed: '2024-11-15',
          walletProvider: 'paytm',
          settings: {
            autoSave: true,
            quickPay: false,
            notifications: true,
            spendingLimit: 10000,
            monthlyLimit: 50000
          }
        },
        {
          id: 'pm004',
          type: 'net_banking',
          name: 'ICICI Bank',
          details: 'ICICI0001234',
          maskedDetails: 'ICICI****1234',
          isDefault: false,
          isVerified: true,
          addedDate: '2023-08-15',
          lastUsed: '2024-11-10',
          bankName: 'ICICI Bank',
          settings: {
            autoSave: false,
            quickPay: false,
            notifications: true,
            spendingLimit: 100000,
            monthlyLimit: 500000
          }
        },
        {
          id: 'pm005',
          type: 'international',
          name: 'PayPal',
          details: 'superman.verma@example.com',
          maskedDetails: 'super****@example.com',
          isDefault: false,
          isVerified: true,
          addedDate: '2024-01-10',
          lastUsed: '2024-11-05',
          internationalProvider: 'paypal',
          settings: {
            autoSave: true,
            quickPay: false,
            notifications: true,
            spendingLimit: 1000,
            monthlyLimit: 5000
          }
        }
      ]
      
      // Enhanced mock transactions
      const mockTransactions: Transaction[] = [
        {
          id: 'txn001',
          date: '2024-11-22T14:30:00',
          description: 'AC Repair Service - CoolAir Experts',
          amount: 1899,
          originalAmount: 1899,
          currency: 'INR',
          type: 'payment',
          status: 'completed',
          method: 'HDFC Visa Credit Card',
          methodId: 'pm001',
          bookingId: 'BK002',
          invoiceId: 'INV001',
          receiptId: 'REC001',
          merchantInfo: {
            name: 'CoolAir Experts',
            category: 'AC Repair',
            logo: 'https://picsum.photos/50/50?random=1',
            gstNumber: '07AAHPC7746P1ZV'
          },
          fees: {
            processing: 56.97,
            platform: 18.99,
            gateway: 37.98,
            total: 113.94
          },
          taxes: {
            gst: 341.82,
            serviceTax: 0,
            total: 341.82
          },
          rewards: {
            cashback: 94.95,
            points: 189,
            coupons: ['SAVE10', 'WELCOME50']
          },
          metadata: {
            ipAddress: '192.168.1.1',
            device: 'Chrome on Windows',
            location: 'Gurgaon, India',
            riskScore: 0.15,
            fraudCheck: 'passed'
          },
          createdAt: '2024-11-22T14:25:00',
          updatedAt: '2024-11-22T14:35:00',
          completedAt: '2024-11-22T14:35:00'
        },
        {
          id: 'txn002',
          date: '2024-11-20T10:00:00',
          description: 'Complete Home Deep Cleaning - Sparkle Clean Pro',
          amount: 2499,
          originalAmount: 2999,
          currency: 'INR',
          type: 'payment',
          status: 'completed',
          method: 'Google Pay',
          methodId: 'pm002',
          bookingId: 'BK001',
          invoiceId: 'INV002',
          receiptId: 'REC002',
          merchantInfo: {
            name: 'Sparkle Clean Pro',
            category: 'Cleaning',
            logo: 'https://picsum.photos/50/50?random=2',
            gstNumber: '07AAHPC7746P1ZV'
          },
          fees: {
            processing: 74.97,
            platform: 24.99,
            gateway: 49.98,
            total: 149.94
          },
          taxes: {
            gst: 449.82,
            serviceTax: 0,
            total: 449.82
          },
          rewards: {
            cashback: 124.95,
            points: 250,
            coupons: ['CLEAN500']
          },
          installmentInfo: {
            totalInstallments: 3,
            currentInstallment: 1,
            installmentAmount: 833,
            nextDueDate: '2024-12-20'
          },
          metadata: {
            ipAddress: '192.168.1.1',
            device: 'Android App',
            location: 'Gurgaon, India',
            riskScore: 0.12,
            fraudCheck: 'passed'
          },
          createdAt: '2024-11-20T09:55:00',
          updatedAt: '2024-11-20T10:05:00',
          completedAt: '2024-11-20T10:05:00'
        },
        {
          id: 'txn003',
          date: '2024-11-15T11:30:00',
          description: 'Bathroom Plumbing Repair - QuickFix Pro',
          amount: 1599,
          currency: 'INR',
          type: 'payment',
          status: 'completed',
          method: 'Paytm Wallet',
          methodId: 'pm003',
          bookingId: 'BK003',
          invoiceId: 'INV003',
          receiptId: 'REC003',
          merchantInfo: {
            name: 'QuickFix Pro',
            category: 'Plumbing',
            logo: 'https://picsum.photos/50/50?random=3',
            gstNumber: '07AAHPC7746P1ZV'
          },
          fees: {
            processing: 47.97,
            platform: 15.99,
            gateway: 31.98,
            total: 95.94
          },
          taxes: {
            gst: 287.82,
            serviceTax: 0,
            total: 287.82
          },
          rewards: {
            cashback: 79.95,
            points: 160,
            coupons: []
          },
          metadata: {
            ipAddress: '192.168.1.1',
            device: 'iOS App',
            location: 'Delhi, India',
            riskScore: 0.08,
            fraudCheck: 'passed'
          },
          createdAt: '2024-11-15T11:25:00',
          updatedAt: '2024-11-15T11:35:00',
          completedAt: '2024-11-15T11:35:00'
        },
        {
          id: 'txn004',
          date: '2024-11-10T09:00:00',
          description: 'Refund for Cancelled Booking - AutoCare Garage',
          amount: -2799.20,
          originalAmount: 3499,
          currency: 'INR',
          type: 'refund',
          status: 'completed',
          method: 'HDFC Visa Credit Card',
          methodId: 'pm001',
          bookingId: 'BK005',
          refundId: 'REF001',
          merchantInfo: {
            name: 'AutoCare Garage',
            category: 'Mechanic',
            logo: 'https://picsum.photos/50/50?random=4',
            gstNumber: '07AAHPC7746P1ZV'
          },
          fees: {
            processing: -83.98,
            platform: -27.99,
            gateway: -55.99,
            total: -167.96
          },
          taxes: {
            gst: -503.86,
            serviceTax: 0,
            total: -503.86
          },
          metadata: {
            ipAddress: '192.168.1.1',
            device: 'Chrome on Windows',
            location: 'Gurgaon, India',
            riskScore: 0.05,
            fraudCheck: 'passed'
          },
          notes: '80% refund as per cancellation policy',
          createdAt: '2024-11-10T08:55:00',
          updatedAt: '2024-11-11T10:30:00',
          completedAt: '2024-11-11T10:30:00'
        },
        {
          id: 'txn005',
          date: '2024-11-05T16:00:00',
          description: 'Electrical Safety Inspection - ElectroSafe Solutions',
          amount: 999,
          currency: 'INR',
          type: 'payment',
          status: 'pending',
          method: 'ICICI Bank',
          methodId: 'pm004',
          bookingId: 'BK004',
          invoiceId: 'INV004',
          merchantInfo: {
            name: 'ElectroSafe Solutions',
            category: 'Electrical',
            logo: 'https://picsum.photos/50/50?random=5',
            gstNumber: '07AAHPC7746P1ZV'
          },
          fees: {
            processing: 29.97,
            platform: 9.99,
            gateway: 19.98,
            total: 59.94
          },
          taxes: {
            gst: 179.82,
            serviceTax: 0,
            total: 179.82
          },
          metadata: {
            ipAddress: '192.168.1.1',
            device: 'Chrome on Windows',
            location: 'Gurgaon, India',
            riskScore: 0.18,
            fraudCheck: 'pending'
          },
          createdAt: '2024-11-05T15:55:00',
          updatedAt: '2024-11-05T16:00:00'
        },
        {
          id: 'txn006',
          date: '2024-11-01T12:00:00',
          description: 'Math Tutoring - LearnWell Academy',
          amount: 1200,
          originalAmount: 1500,
          currency: 'INR',
          type: 'payment',
          status: 'completed',
          method: 'PayPal',
          methodId: 'pm005',
          bookingId: 'BK006',
          invoiceId: 'INV005',
          receiptId: 'REC005',
          merchantInfo: {
            name: 'LearnWell Academy',
            category: 'Education',
            logo: 'https://picsum.photos/50/50?random=6',
            gstNumber: '07AAHPC7746P1ZV'
          },
          international: {
            originalCurrency: 'USD',
            exchangeRate: 83.12,
            conversionFee: 14.45
          },
          fees: {
            processing: 36.00,
            platform: 12.00,
            gateway: 24.00,
            total: 72.00
          },
          taxes: {
            gst: 216.00,
            serviceTax: 0,
            total: 216.00
          },
          rewards: {
            cashback: 60.00,
            points: 120,
            coupons: ['STUDENT300']
          },
          metadata: {
            ipAddress: '192.168.1.1',
            device: 'Chrome on Windows',
            location: 'Gurgaon, India',
            riskScore: 0.20,
            fraudCheck: 'passed'
          },
          createdAt: '2024-11-01T11:55:00',
          updatedAt: '2024-11-01T12:05:00',
          completedAt: '2024-11-01T12:05:00'
        }
      ]
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPaymentMethods(mockPaymentMethods)
      setTransactions(mockTransactions)
      setLoading(false)
    }

    if (user) {
      loadPaymentData()
    }
  }, [user])

  // Calculate comprehensive statistics
  const stats = useMemo<PaymentStats>(() => {
    const totalMethods = paymentMethods.length
    const defaultMethod = paymentMethods.find(m => m.isDefault)?.name || 'None'
    
    const payments = transactions.filter(t => t.type === 'payment')
    const refunds = transactions.filter(t => t.type === 'refund')
    const completedTransactions = transactions.filter(t => t.status === 'completed')
    
    const totalSpent = payments
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalRefunds = refunds
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    const totalFees = transactions
      .filter(t => t.status === 'completed' && t.fees)
      .reduce((sum, t) => sum + (t.fees?.total || 0), 0)
    
    const totalRewards = transactions
      .filter(t => t.status === 'completed' && t.rewards)
      .reduce((sum, t) => sum + (t.rewards?.cashback || 0), 0)
    
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const thisMonthTransactions = transactions.filter(t => new Date(t.date) >= thisMonth)
    const thisMonthSpent = thisMonthTransactions
      .filter(t => t.type === 'payment' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const pendingTransactions = transactions.filter(t => t.status === 'pending').length
    const failedTransactions = transactions.filter(t => t.status === 'failed').length
    
    const averageTransaction = completedTransactions.length > 0
      ? completedTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / completedTransactions.length
      : 0
    
    const methodFrequency = transactions.reduce((acc, t) => {
      acc[t.method] = (acc[t.method] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const mostUsedMethod = Object.entries(methodFrequency)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
    
    const lastTransactionDate = transactions.length > 0
      ? new Date(Math.max(...transactions.map(t => new Date(t.date).getTime()))).toISOString()
      : ''
    
    const internationalTransactions = transactions.filter(t => t.international).length
    const installmentPayments = transactions.filter(t => t.installmentInfo).length
    
    const autoPayEnabled = paymentMethods.some(m => m.settings?.autoSave)
    const quickPayEnabled = paymentMethods.some(m => m.settings?.quickPay)
    const verificationRequired = paymentMethods.some(m => !m.isVerified)
    
    const spendingLimit = paymentMethods.reduce((sum, m) => sum + (m.settings?.spendingLimit || 0), 0)
    const monthlySpending = thisMonthSpent
    
    return {
      totalMethods,
      defaultMethod,
      totalSpent,
      totalRefunds,
      totalFees,
      totalRewards,
      thisMonthSpent,
      thisMonthTransactions: thisMonthTransactions.length,
      pendingTransactions,
      failedTransactions,
      averageTransaction,
      mostUsedMethod,
      lastTransactionDate,
      internationalTransactions,
      installmentPayments,
      autoPayEnabled,
      quickPayEnabled,
      verificationRequired,
      spendingLimit,
      monthlySpending,
      savingsFromRewards: totalRewards
    }
  }, [paymentMethods, transactions])

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions]

    // Apply filters
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => {
        if (filters.type === 'payments') return t.type === 'payment'
        if (filters.type === 'refunds') return t.type === 'refund'
        if (filters.type === 'fees') return t.type === 'fee'
        if (filters.type === 'rewards') return t.type === 'reward' || t.type === 'cashback'
        // Handle chargeback and dispute types
        if (filters.type === 'chargeback') return t.type === 'chargeback'
        if (filters.type === 'dispute') return t.type === 'dispute'
        return false // Default case for safety
      })
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status)
    }

    if (filters.method !== 'all') {
      filtered = filtered.filter(t => t.method === filters.method)
    }

    if (filters.amountRange[1] > 0) {
      filtered = filtered.filter(t => 
        Math.abs(t.amount) >= filters.amountRange[0] && 
        Math.abs(t.amount) <= filters.amountRange[1]
      )
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date()
      let startDate: Date
      
      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'quarter':
          startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
          break
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1)
          break
        default:
          startDate = new Date(0)
      }
      
      filtered = filtered.filter(t => new Date(t.date) >= startDate)
    }

    // Apply search
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query) ||
        t.method.toLowerCase().includes(query) ||
        t.bookingId?.toLowerCase().includes(query) ||
        t.invoiceId?.toLowerCase().includes(query) ||
        t.merchantInfo?.name.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'amount':
          comparison = Math.abs(a.amount) - Math.abs(b.amount)
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'method':
          comparison = a.method.localeCompare(b.method)
          break
        case 'type':
          comparison = a.type.localeCompare(b.type)
          break
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [transactions, filters])

  // Format functions
  const formatAmount = (amount: number, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: currency === 'INR' ? 0 : 2
    }).format(amount)
  }

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

  // Action handlers
  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    )
  }

  const handleDeleteMethod = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setShowDeleteMethodModal(true)
  }

  const handleEditMethod = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setShowEditMethodModal(true)
  }

  const handleVerifyMethod = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setShowVerifyMethodModal(true)
  }

  const confirmDeleteMethod = () => {
    if (selectedMethod) {
      setPaymentMethods(prev => prev.filter(m => m.id !== selectedMethod.id))
      setShowDeleteMethodModal(false)
      setSelectedMethod(null)
    }
  }

  const confirmVerification = () => {
    if (selectedMethod && verificationCode) {
      setPaymentMethods(prev => 
        prev.map(method => 
          method.id === selectedMethod.id 
            ? { ...method, isVerified: true, metadata: { ...method.metadata, lastVerificationDate: new Date().toISOString() } }
            : method
        )
      )
      setShowVerifyMethodModal(false)
      setVerificationCode('')
      setSelectedMethod(null)
    }
  }

  const handleAddPaymentMethod = async (methodType: PaymentMethod['type']) => {
    setNewMethodType(methodType)
    setShowAddMethodModal(true)
  }

  const handleViewTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowTransactionDetailsModal(true)
  }

  const handleDisputeTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowDisputeModal(true)
  }

  const handleExportTransactions = () => {
    setShowExportModal(true)
  }

  const confirmDispute = () => {
    if (selectedTransaction && disputeReason && disputeDescription) {
      setTransactions(prev => 
        prev.map(t => 
          t.id === selectedTransaction.id 
            ? { 
                ...t, 
                status: 'disputed', 
                disputeId: `DISP${Date.now()}`,
                updatedAt: new Date().toISOString(),
                notes: disputeDescription
              }
            : t
        )
      )
      setShowDisputeModal(false)
      setDisputeReason('')
      setDisputeDescription('')
      setSelectedTransaction(null)
    }
  }

  if (loading) {
    return (
      <div className="profile-payments-advanced">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading payment information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-payments-advanced">
      {/* Enhanced Header */}
      <section className="payments-header">
        <div className="payments-header-content">
          <div className="payments-title-section">
            <h1 className="payments-title">Payment Methods & Transactions</h1>
            <p className="payments-subtitle">
              Manage payment methods, view transactions, and track spending
            </p>
          </div>
          
          <div className="payments-header-actions">
            <button className="export-btn" onClick={handleExportTransactions}>
              <span className="btn-icon">📊</span>
              <span>Export</span>
            </button>
            <button className="settings-btn" onClick={() => setShowSettingsModal(true)}>
              <span className="btn-icon">⚙️</span>
              <span>Settings</span>
            </button>
            <button 
              className="add-method-btn"
              onClick={() => setShowAddMethodModal(true)}
            >
              <span className="btn-icon">➕</span>
              <span>Add Payment Method</span>
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Cards */}
      <section className="payments-stats">
        <div className="stats-grid">
          <div className="stat-card methods">
            <div className="stat-icon">💳</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalMethods}</div>
              <div className="stat-label">Payment Methods</div>
              <div className="stat-change">{stats.defaultMethod}</div>
            </div>
          </div>
          <div className="stat-card spent">
            <div className="stat-icon">💸</div>
            <div className="stat-content">
              <div className="stat-number">{formatAmount(stats.totalSpent)}</div>
              <div className="stat-label">Total Spent</div>
              <div className="stat-change">{stats.thisMonthTransactions} this month</div>
            </div>
          </div>
          <div className="stat-card refunds">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-number">{formatAmount(stats.totalRefunds)}</div>
              <div className="stat-label">Total Refunds</div>
              <div className="stat-change">From {transactions.filter(t => t.type === 'refund').length} transactions</div>
            </div>
          </div>
          <div className="stat-card rewards">
            <div className="stat-icon">🎁</div>
            <div className="stat-content">
              <div className="stat-number">{formatAmount(stats.totalRewards)}</div>
              <div className="stat-label">Cashback & Rewards</div>
              <div className="stat-change">Saved {formatAmount(stats.savingsFromRewards)}</div>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{stats.pendingTransactions}</div>
              <div className="stat-label">Pending</div>
              <div className="stat-change">Processing payments</div>
            </div>
          </div>
          <div className="stat-card average">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{formatAmount(stats.averageTransaction)}</div>
              <div className="stat-label">Average Transaction</div>
              <div className="stat-change">{stats.mostUsedMethod}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Tabs */}
      <section className="payments-tabs">
        <div className="tabs-navigation">
          {['methods', 'transactions', 'analytics', 'settings'].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab as any)}
            >
              <span className="tab-icon">
                {tab === 'methods' ? '💳' : 
                 tab === 'transactions' ? '📊' : 
                 tab === 'analytics' ? '📈' : '⚙️'}
              </span>
              <span className="tab-label">
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Payment Methods Tab */}
      {activeTab === 'methods' && (
        <section className="payment-methods-section">
          <div className="methods-header">
            <div className="methods-title">
              <h2>Your Payment Methods</h2>
              <p>Manage and organize your payment options</p>
            </div>
            
            <div className="methods-actions">
              <div className="view-toggle">
                <button className={`view-btn ${filters.viewMode === 'grid' ? 'active' : ''}`}>
                  <span>⊞</span>
                </button>
                <button className={`view-btn ${filters.viewMode === 'list' ? 'active' : ''}`}>
                  <span>☰</span>
                </button>
              </div>
            </div>
          </div>

          <div className={`payment-methods-container ${filters.viewMode}`}>
            {paymentMethods.map(method => (
              <div key={method.id} className="payment-method-card">
                <div className="method-header">
                  <div className="method-info">
                    <div className="method-icon">
                      {paymentMethodConfig[method.type].icon}
                    </div>
                    <div className="method-details">
                      <h3 className="method-name">{method.name}</h3>
                      <p className="method-number">{method.maskedDetails}</p>
                      <div className="method-meta">
                        {method.isVerified && (
                          <span className="verification-badge verified">✓ Verified</span>
                        )}
                        {method.isDefault && (
                          <span className="default-badge">Default</span>
                        )}
                        {method.lastUsed && (
                          <span className="last-used">Used {getRelativeTime(method.lastUsed)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="method-status">
                    <div className={`status-indicator ${method.isVerified ? 'verified' : 'unverified'}`}>
                      <span className="status-dot"></span>
                    </div>
                  </div>
                </div>

                <div className="method-details-expanded">
                  {method.expiryDate && (
                    <div className="method-detail">
                      <span className="detail-label">Expires:</span>
                      <span className="detail-value">{method.expiryDate}</span>
                    </div>
                  )}
                  
                  {method.bankName && (
                    <div className="method-detail">
                      <span className="detail-label">Bank:</span>
                      <span className="detail-value">{method.bankName}</span>
                    </div>
                  )}
                  
                  {method.settings?.spendingLimit && (
                    <div className="method-detail">
                      <span className="detail-label">Spending Limit:</span>
                      <span className="detail-value">{formatAmount(method.settings.spendingLimit)}</span>
                    </div>
                  )}
                  
                  <div className="method-detail">
                    <span className="detail-label">Added:</span>
                    <span className="detail-value">{formatDate(method.addedDate)}</span>
                  </div>
                </div>

                <div className="method-actions">
                  {!method.isDefault && (
                    <button 
                      className="action-btn default"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set Default
                    </button>
                  )}
                  
                  {!method.isVerified && (
                    <button 
                      className="action-btn verify"
                      onClick={() => handleVerifyMethod(method)}
                    >
                      Verify
                    </button>
                  )}
                  
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditMethod(method)}
                  >
                    Edit
                  </button>
                  
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteMethod(method)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {paymentMethods.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">💳</div>
              <h3>No Payment Methods</h3>
              <p>Add a payment method to make booking payments easier</p>
              <button 
                className="add-method-btn"
                onClick={() => setShowAddMethodModal(true)}
              >
                <span className="btn-icon">➕</span>
                <span>Add Payment Method</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <section className="transactions-section">
          <div className="transactions-header">
            <div className="transactions-title">
              <h2>Transaction History</h2>
              <p>View and manage all your payment transactions</p>
            </div>
            
            <div className="transactions-filters">
              <div className="filter-group">
                <select
                  value={filters.type}
                  onChange={e => setFilters({...filters, type: e.target.value as any})}
                  className="filter-select"
                >
                  <option value="all">All Types</option>
                  <option value="payments">Payments</option>
                  <option value="refunds">Refunds</option>
                  <option value="fees">Fees</option>
                  <option value="rewards">Rewards</option>
                  <option value="chargeback">Chargebacks</option>
                  <option value="dispute">Disputes</option>
                </select>
              </div>
              
              <div className="filter-group">
                <select
                  value={filters.status}
                  onChange={e => setFilters({...filters, status: e.target.value as any})}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="processing">Processing</option>
                </select>
              </div>
              
              <div className="filter-group">
                <select
                  value={filters.dateRange}
                  onChange={e => setFilters({...filters, dateRange: e.target.value as any})}
                  className="filter-select"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              
              <div className="search-group">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={filters.searchQuery}
                  onChange={e => setFilters({...filters, searchQuery: e.target.value})}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>
          </div>

          <div className="transactions-list">
            {filteredAndSortedTransactions.map(transaction => (
              <div key={transaction.id} className="transaction-card">
                <div className="transaction-header">
                  <div className="transaction-info">
                    <div className="transaction-amount">
                      <span className="amount-symbol">
                        {transaction.type === 'refund' ? '+' : '-'}
                      </span>
                      <span className="amount-value">
                        {formatAmount(Math.abs(transaction.amount))}
                      </span>
                      {transaction.originalAmount && transaction.originalAmount !== Math.abs(transaction.amount) && (
                        <span className="original-amount">
                          {formatAmount(transaction.originalAmount)}
                        </span>
                      )}
                    </div>
                    
                    <div className="transaction-details">
                      <h4 className="transaction-description">{transaction.description}</h4>
                      <div className="transaction-meta">
                        <span className="transaction-date">{formatDate(transaction.date)}</span>
                        <span className="transaction-method">{transaction.method}</span>
                        {transaction.bookingId && (
                          <Link to={`/profile/bookings`} className="booking-link">
                            View Booking
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="transaction-status">
                    <span 
                      className={`status-badge status-${transaction.status}`}
                      style={{ '--status-color': transactionStatusConfig[transaction.status].color } as React.CSSProperties}
                    >
                      <span className="status-icon">
                        {transactionStatusConfig[transaction.status].icon}
                      </span>
                      <span className="status-text">
                        {transactionStatusConfig[transaction.status].label}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="transaction-footer">
                  <div className="transaction-type">
                    <span className="type-icon">
                      {transactionTypeConfig[transaction.type].icon}
                    </span>
                    <span className="type-label">
                      {transactionTypeConfig[transaction.type].label}
                    </span>
                  </div>
                  
                  <div className="transaction-actions">
                    <button 
                      className="action-btn details"
                      onClick={() => handleViewTransactionDetails(transaction)}
                    >
                      View Details
                    </button>
                    
                    {transaction.status === 'completed' && transaction.type === 'payment' && (
                      <button 
                        className="action-btn dispute"
                        onClick={() => handleDisputeTransaction(transaction)}
                      >
                        Dispute
                      </button>
                    )}
                    
                    {transaction.receiptId && (
                      <button className="action-btn invoice">
                        Download Invoice
                      </button>
                    )}
                  </div>
                </div>

                {/* Additional transaction details */}
                {(transaction.fees || transaction.taxes || transaction.rewards) && (
                  <div className="transaction-breakdown">
                    {transaction.fees && (
                      <div className="breakdown-item">
                        <span className="breakdown-label">Fees:</span>
                        <span className="breakdown-value">{formatAmount(transaction.fees.total)}</span>
                      </div>
                    )}
                    
                    {transaction.taxes && (
                      <div className="breakdown-item">
                        <span className="breakdown-label">Taxes:</span>
                        <span className="breakdown-value">{formatAmount(transaction.taxes.total)}</span>
                      </div>
                    )}
                    
                    {transaction.rewards && (
                      <div className="breakdown-item reward">
                        <span className="breakdown-label">Cashback:</span>
                        <span className="breakdown-value">-{formatAmount(transaction.rewards.cashback)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredAndSortedTransactions.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No Transactions Found</h3>
              <p>
                {filters.searchQuery || filters.type !== 'all' || filters.status !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : 'You haven\'t made any transactions yet.'}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <section className="analytics-section">
          <div className="analytics-header">
            <h2>Payment Analytics</h2>
            <p>Insights and trends in your payment activity</p>
          </div>
          
          <div className="analytics-content">
            <div className="analytics-grid">
              <div className="analytics-card spending-trend">
                <h3>Spending Trend</h3>
                <div className="chart-placeholder">
                  <p>📈 Spending over time chart</p>
                </div>
              </div>
              
              <div className="analytics-card payment-methods">
                <h3>Payment Methods Usage</h3>
                <div className="chart-placeholder">
                  <p>📊 Method distribution chart</p>
                </div>
              </div>
              
              <div className="analytics-card category-breakdown">
                <h3>Spending by Category</h3>
                <div className="chart-placeholder">
                  <p>🥧 Category pie chart</p>
                </div>
              </div>
              
              <div className="analytics-card savings">
                <h3>Savings & Rewards</h3>
                <div className="savings-summary">
                  <div className="savings-item">
                    <span className="savings-label">Total Cashback:</span>
                    <span className="savings-value">{formatAmount(stats.totalRewards)}</span>
                  </div>
                  <div className="savings-item">
                    <span className="savings-label">Discounts Used:</span>
                    <span className="savings-value">{formatAmount(1200)}</span>
                  </div>
                  <div className="savings-item">
                    <span className="savings-label">Total Savings:</span>
                    <span className="savings-value">{formatAmount(stats.totalRewards + 1200)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <section className="settings-section">
          <div className="settings-header">
            <h2>Payment Settings</h2>
            <p>Configure your payment preferences and security</p>
          </div>
          
          <div className="settings-content">
            <div className="settings-group">
              <h3>Security Settings</h3>
              <div className="setting-item">
                <label className="setting-label">
                  <input type="checkbox" defaultChecked />
                  <span>Two-factor authentication</span>
                </label>
                <p className="setting-description">Add an extra layer of security to your payments</p>
              </div>
              
              <div className="setting-item">
                <label className="setting-label">
                  <input type="checkbox" defaultChecked />
                  <span>Payment verification</span>
                </label>
                <p className="setting-description">Require verification for large transactions</p>
              </div>
            </div>
            
            <div className="settings-group">
              <h3>Notifications</h3>
              <div className="setting-item">
                <label className="setting-label">
                  <input type="checkbox" defaultChecked />
                  <span>Payment confirmations</span>
                </label>
                <p className="setting-description">Get notified when payments are processed</p>
              </div>
              
              <div className="setting-item">
                <label className="setting-label">
                  <input type="checkbox" defaultChecked />
                  <span>Failed payment alerts</span>
                </label>
                <p className="setting-description">Alert when payments fail</p>
              </div>
            </div>
            
            <div className="settings-group">
              <h3>Auto-Pay Settings</h3>
              <div className="setting-item">
                <label className="setting-label">
                  <input type="checkbox" />
                  <span>Enable auto-pay</span>
                </label>
                <p className="setting-description">Automatically pay recurring bookings</p>
              </div>
              
              <div className="setting-item">
                <label className="setting-label">
                  <span>Default payment method:</span>
                  <select className="setting-select">
                    {paymentMethods.map(method => (
                      <option key={method.id} value={method.id}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modals */}
      {/* Add Payment Method Modal */}
      {showAddMethodModal && (
        <div className="modal-overlay" onClick={() => setShowAddMethodModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Payment Method</h2>
              <button onClick={() => setShowAddMethodModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <div className="method-types">
                {Object.entries(paymentMethodConfig).map(([type, config]) => (
                  <button
                    key={type}
                    className={`method-type-btn ${newMethodType === type ? 'selected' : ''}`}
                    onClick={() => setNewMethodType(type as PaymentMethod['type'])}
                  >
                    <span className="method-icon">{config.icon}</span>
                    <div className="method-info">
                      <span className="method-name">{config.label}</span>
                      <span className="method-description">{config.description}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="modal-actions">
                <button onClick={() => setShowAddMethodModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button className="btn-primary">
                  Continue with {paymentMethodConfig[newMethodType].label}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Method Modal */}
      {showDeleteMethodModal && selectedMethod && (
        <div className="modal-overlay" onClick={() => setShowDeleteMethodModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Payment Method</h2>
              <button onClick={() => setShowDeleteMethodModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <div className="warning-message">
                <p>Are you sure you want to delete this payment method?</p>
                <div className="method-summary">
                  <h4>{selectedMethod.name}</h4>
                  <p>{selectedMethod.maskedDetails}</p>
                </div>
                <p className="warning-text">
                  This action cannot be undone. Any recurring payments using this method will be cancelled.
                </p>
              </div>
              
              <div className="modal-actions">
                <button onClick={() => setShowDeleteMethodModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={confirmDeleteMethod} className="btn-danger">
                  Delete Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verify Method Modal */}
      {showVerifyMethodModal && selectedMethod && (
        <div className="modal-overlay" onClick={() => setShowVerifyMethodModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Verify Payment Method</h2>
              <button onClick={() => setShowVerifyMethodModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <div className="verification-info">
                <p>Enter the verification code sent to your registered device</p>
                <div className="method-summary">
                  <h4>{selectedMethod.name}</h4>
                  <p>{selectedMethod.maskedDetails}</p>
                </div>
              </div>
              
              <div className="form-group">
                <label>Verification Code</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="form-input"
                />
              </div>
              
              <div className="resend-section">
                <button className="resend-btn">Resend Code</button>
              </div>
              
              <div className="modal-actions">
                <button onClick={() => setShowVerifyMethodModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button 
                  onClick={confirmVerification} 
                  className="btn-primary"
                  disabled={verificationCode.length !== 6}
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showTransactionDetailsModal && selectedTransaction && (
        <div className="modal-overlay" onClick={() => setShowTransactionDetailsModal(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Transaction Details</h2>
              <button onClick={() => setShowTransactionDetailsModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <div className="transaction-details-full">
                <div className="detail-section">
                  <h3>Transaction Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Transaction ID:</label>
                      <span>{selectedTransaction.id}</span>
                    </div>
                    <div className="detail-item">
                      <label>Date:</label>
                      <span>{formatDate(selectedTransaction.date)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Description:</label>
                      <span>{selectedTransaction.description}</span>
                    </div>
                    <div className="detail-item">
                      <label>Amount:</label>
                      <span>{formatAmount(selectedTransaction.amount)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Status:</label>
                      <span className={`status-badge status-${selectedTransaction.status}`}>
                        {transactionStatusConfig[selectedTransaction.status].label}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Payment Method:</label>
                      <span>{selectedTransaction.method}</span>
                    </div>
                  </div>
                </div>
                
                {selectedTransaction.merchantInfo && (
                  <div className="detail-section">
                    <h3>Merchant Information</h3>
                    <div className="merchant-details">
                      {selectedTransaction.merchantInfo.logo && (
                        <img src={selectedTransaction.merchantInfo.logo} alt="Merchant" className="merchant-logo" />
                      )}
                      <div className="merchant-info">
                        <h4>{selectedTransaction.merchantInfo.name}</h4>
                        <p>{selectedTransaction.merchantInfo.category}</p>
                        {selectedTransaction.merchantInfo.gstNumber && (
                          <p>GST: {selectedTransaction.merchantInfo.gstNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedTransaction.fees && (
                  <div className="detail-section">
                    <h3>Fee Breakdown</h3>
                    <div className="fee-breakdown">
                      <div className="fee-item">
                        <span>Processing Fee:</span>
                        <span>{formatAmount(selectedTransaction.fees.processing)}</span>
                      </div>
                      <div className="fee-item">
                        <span>Platform Fee:</span>
                        <span>{formatAmount(selectedTransaction.fees.platform)}</span>
                      </div>
                      <div className="fee-item">
                        <span>Gateway Fee:</span>
                        <span>{formatAmount(selectedTransaction.fees.gateway)}</span>
                      </div>
                      <div className="fee-item total">
                        <span>Total Fees:</span>
                        <span>{formatAmount(selectedTransaction.fees.total)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedTransaction.rewards && (
                  <div className="detail-section">
                    <h3>Rewards Earned</h3>
                    <div className="rewards-breakdown">
                      <div className="reward-item">
                        <span>Cashback:</span>
                        <span>{formatAmount(selectedTransaction.rewards.cashback)}</span>
                      </div>
                      <div className="reward-item">
                        <span>Loyalty Points:</span>
                        <span>{selectedTransaction.rewards.points} points</span>
                      </div>
                      {selectedTransaction.rewards.coupons.length > 0 && (
                        <div className="reward-item">
                          <span>Coupons Earned:</span>
                          <span>{selectedTransaction.rewards.coupons.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && selectedTransaction && (
        <div className="modal-overlay" onClick={() => setShowDisputeModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Dispute Transaction</h2>
              <button onClick={() => setShowDisputeModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <div className="dispute-info">
                <p>Why are you disputing this transaction?</p>
                <div className="transaction-summary">
                  <h4>{selectedTransaction.description}</h4>
                  <p>{formatAmount(selectedTransaction.amount)}</p>
                  <p>{formatDate(selectedTransaction.date)}</p>
                </div>
              </div>
              
              <div className="form-group">
                <label>Dispute Reason *</label>
                <select
                  value={disputeReason}
                  onChange={e => setDisputeReason(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select a reason</option>
                  <option value="service_not_provided">Service not provided</option>
                  <option value="quality_issue">Quality issue</option>
                  <option value="overcharged">Overcharged</option>
                  <option value="duplicate_charge">Duplicate charge</option>
                  <option value="unauthorized">Unauthorized charge</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={disputeDescription}
                  onChange={e => setDisputeDescription(e.target.value)}
                  placeholder="Please provide details about your dispute..."
                  rows={4}
                  className="form-textarea"
                />
              </div>
              
              <div className="disclaimer">
                <p>
                  By submitting this dispute, you agree to our dispute resolution process. 
                  This may temporarily refund the amount while we investigate.
                </p>
              </div>
              
              <div className="modal-actions">
                <button onClick={() => setShowDisputeModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button 
                  onClick={confirmDispute} 
                  className="btn-primary"
                  disabled={!disputeReason || !disputeDescription.trim()}
                >
                  Submit Dispute
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Export Transactions</h2>
              <button onClick={() => setShowExportModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <div className="export-options">
                <h3>Select Export Format</h3>
                <div className="format-options">
                  <label className="format-option">
                    <input 
                      type="radio" 
                      name="format" 
                      value="pdf"
                      checked={exportFormat === 'pdf'}
                      onChange={e => setExportFormat(e.target.value as any)}
                    />
                    <span className="format-icon">📄</span>
                    <div className="format-info">
                      <span className="format-name">PDF</span>
                      <span className="format-description">Best for printing and sharing</span>
                    </div>
                  </label>
                  
                  <label className="format-option">
                    <input 
                      type="radio" 
                      name="format" 
                      value="excel"
                      checked={exportFormat === 'excel'}
                      onChange={e => setExportFormat(e.target.value as any)}
                    />
                    <span className="format-icon">📊</span>
                    <div className="format-info">
                      <span className="format-name">Excel</span>
                      <span className="format-description">Best for data analysis</span>
                    </div>
                  </label>
                  
                  <label className="format-option">
                    <input 
                      type="radio" 
                      name="format" 
                      value="csv"
                      checked={exportFormat === 'csv'}
                      onChange={e => setExportFormat(e.target.value as any)}
                    />
                    <span className="format-icon">📋</span>
                    <div className="format-info">
                      <span className="format-name">CSV</span>
                      <span className="format-description">Best for importing to other systems</span>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="modal-actions">
                <button onClick={() => setShowExportModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={() => {/* Handle export */}} className="btn-primary">
                  Export as {exportFormat.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
