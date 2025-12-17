import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '@/firebase/auth'

interface PaymentMethod {
  id: string
  type: 'card' | 'upi' | 'wallet'
  name: string
  details: string
  isDefault: boolean
  addedDate: string
}

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'payment' | 'refund'
  status: 'completed' | 'pending' | 'failed'
  method: string
  bookingId?: string
}

export default function ProfilePayments() {
  const [user, setUser] = useState<any>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'methods' | 'transactions'>('methods')
  const [showAddMethod, setShowAddMethod] = useState(false)

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        
        // Mock payment methods
        const mockPaymentMethods: PaymentMethod[] = [
          {
            id: 'pm1',
            type: 'card',
            name: 'Visa Card',
            details: '**** **** **** 1234',
            isDefault: true,
            addedDate: '2023-01-15'
          },
          {
            id: 'pm2',
            type: 'upi',
            name: 'Google Pay',
            details: 'user@okicici',
            isDefault: false,
            addedDate: '2023-03-20'
          },
          {
            id: 'pm3',
            type: 'wallet',
            name: 'Paytm Wallet',
            details: '9876543210',
            isDefault: false,
            addedDate: '2023-06-10'
          }
        ]
        
        // Mock transactions
        const mockTransactions: Transaction[] = [
          {
            id: 't1',
            date: '2024-11-20',
            description: 'AC Repair Service - John Doe',
            amount: 1200,
            type: 'payment',
            status: 'completed',
            method: 'Visa Card',
            bookingId: 'b1'
          },
          {
            id: 't2',
            date: '2024-11-15',
            description: 'Home Cleaning - Jane Smith',
            amount: 800,
            type: 'payment',
            status: 'completed',
            method: 'Google Pay',
            bookingId: 'b2'
          },
          {
            id: 't3',
            date: '2024-11-10',
            description: 'Refund for Cancelled Booking',
            amount: -500,
            type: 'refund',
            status: 'completed',
            method: 'Paytm Wallet',
            bookingId: 'b4'
          },
          {
            id: 't4',
            date: '2024-11-05',
            description: 'Plumbing Service - Mike Johnson',
            amount: 1500,
            type: 'payment',
            status: 'completed',
            method: 'Visa Card',
            bookingId: 'b3'
          },
          {
            id: 't5',
            date: '2024-11-25',
            description: 'Car Repair - Tom Brown',
            amount: 2000,
            type: 'payment',
            status: 'pending',
            method: 'Visa Card',
            bookingId: 'b5'
          }
        ]
        
        setPaymentMethods(mockPaymentMethods)
        setTransactions(mockTransactions)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    )
  }

  const handleDeleteMethod = (methodId: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== methodId))
  }

  const getPaymentIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'card': return '💳'
      case 'upi': return '📱'
      case 'wallet': return '💼'
      default: return '💰'
    }
  }

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return '#10b981'
      case 'pending': return '#f59e0b'
      case 'failed': return '#ef4444'
      default: return '#64748b'
    }
  }

  if (loading) {
    return (
      <div className="profile-payments">
        <div className="loading-container">
          <div className="loading-spinner">⏳</div>
          <p>Loading payment information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-payments">
      <div className="page-container">
        <div className="page-header">
          <h1>Payment Methods & Transactions</h1>
          <p>Manage your payment methods and view transaction history</p>
        </div>

        <div className="payment-tabs">
          <button
            className={`tab-btn ${activeTab === 'methods' ? 'active' : ''}`}
            onClick={() => setActiveTab('methods')}
          >
            Payment Methods
          </button>
          <button
            className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
        </div>

        {/* Payment Methods Tab */}
        {activeTab === 'methods' && (
          <div className="tab-content">
            <div className="payment-stats">
              <div className="stat-card">
                <div className="stat-number">{paymentMethods.length}</div>
                <div className="stat-label">Payment Methods</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{paymentMethods.filter(m => m.isDefault).length}</div>
                <div className="stat-label">Default Method</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">₹{transactions.filter(t => t.type === 'payment' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0)}</div>
                <div className="stat-label">Total Spent</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">₹{transactions.filter(t => t.type === 'refund' && t.status === 'completed').reduce((sum, t) => sum + Math.abs(t.amount), 0)}</div>
                <div className="stat-label">Total Refunds</div>
              </div>
            </div>

            <div className="payment-methods-header">
              <h2>Your Payment Methods</h2>
              <button 
                className="btn-primary"
                onClick={() => setShowAddMethod(true)}
              >
                + Add Payment Method
              </button>
            </div>

            <div className="payment-methods-grid">
              {paymentMethods.map(method => (
                <div key={method.id} className="payment-method-card">
                  <div className="method-header">
                    <div className="method-info">
                      <div className="method-icon">{getPaymentIcon(method.type)}</div>
                      <div className="method-details">
                        <h3 className="method-name">{method.name}</h3>
                        <p className="method-number">{method.details}</p>
                      </div>
                    </div>
                    {method.isDefault && (
                      <span className="default-badge">Default</span>
                    )}
                  </div>
                  
                  <div className="method-footer">
                    <span className="added-date">Added {method.addedDate}</span>
                    <div className="method-actions">
                      {!method.isDefault && (
                        <button 
                          className="btn-secondary"
                          onClick={() => handleSetDefault(method.id)}
                        >
                          Set Default
                        </button>
                      )}
                      <button 
                        className="btn-danger"
                        onClick={() => handleDeleteMethod(method.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {showAddMethod && (
              <div className="add-method-modal">
                <div className="modal-content">
                  <h3>Add Payment Method</h3>
                  <div className="method-types">
                    <button className="method-type-btn">
                      <span className="method-icon">💳</span>
                      <span>Credit/Debit Card</span>
                    </button>
                    <button className="method-type-btn">
                      <span className="method-icon">📱</span>
                      <span>UPI Payment</span>
                    </button>
                    <button className="method-type-btn">
                      <span className="method-icon">💼</span>
                      <span>Digital Wallet</span>
                    </button>
                  </div>
                  <div className="modal-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => setShowAddMethod(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="tab-content">
            <div className="transactions-header">
              <h2>Transaction History</h2>
              <div className="transaction-filters">
                <select className="filter-select">
                  <option value="all">All Transactions</option>
                  <option value="payments">Payments Only</option>
                  <option value="refunds">Refunds Only</option>
                </select>
                <select className="filter-select">
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <div className="transactions-list">
              {transactions.map(transaction => (
                <div key={transaction.id} className="transaction-card">
                  <div className="transaction-header">
                    <div className="transaction-info">
                      <div className="transaction-amount">
                        <span className="amount-symbol">{transaction.type === 'refund' ? '+' : '-'}</span>
                        ₹{Math.abs(transaction.amount)}
                      </div>
                      <div className="transaction-details">
                        <h4 className="transaction-description">{transaction.description}</h4>
                        <p className="transaction-meta">
                          {transaction.date} • {transaction.method}
                        </p>
                      </div>
                    </div>
                    <div className="transaction-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(transaction.status) }}
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="transaction-footer">
                    <span className={`transaction-type ${transaction.type}`}>
                      {transaction.type === 'refund' ? 'Refund' : 'Payment'}
                    </span>
                    {transaction.bookingId && (
                      <Link to={`/bookings/${transaction.bookingId}`} className="booking-link">
                        View Booking
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
