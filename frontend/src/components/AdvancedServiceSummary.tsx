import React, { useState } from 'react'
import '../styles/AdvancedServiceSummary.css'

interface ServiceDetails {
  service: string
  provider: string
  date: string
  time: string
  duration: string
  urgency: 'normal' | 'urgent' | 'emergency'
  specialRequests?: string
  status?: 'confirmed' | 'pending' | 'cancelled'
}

interface AdvancedServiceSummaryProps {
  details: ServiceDetails
  showActions?: boolean
  compact?: boolean
}

const AdvancedServiceSummary: React.FC<AdvancedServiceSummaryProps> = ({ 
  details, 
  showActions = true, 
  compact = false 
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (action: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log(`Action: ${action}`)
    setIsLoading(false)
  }

  const getUrgencyBadge = (urgency: string) => {
    const badges = {
      normal: { class: 'normal', icon: '🕐', label: 'Normal' },
      urgent: { class: 'urgent', icon: '⚡', label: 'Urgent' },
      emergency: { class: 'emergency', icon: '🚨', label: 'Emergency' }
    }
    return badges[urgency as keyof typeof badges] || badges.normal
  }

  const getStatusBadge = (status: string) => {
    const statuses = {
      confirmed: { class: 'confirmed', label: 'Confirmed' },
      pending: { class: 'pending', label: 'Pending' },
      cancelled: { class: 'cancelled', label: 'Cancelled' }
    }
    return statuses[status as keyof typeof statuses] || statuses.pending
  }

  const urgencyInfo = getUrgencyBadge(details.urgency)
  const statusInfo = details.status ? getStatusBadge(details.status) : null

  return (
    <div className="advanced-service-summary">
      <div className="summary-container">
        <div className="floating-icons">
          <span className="floating-icon">🔧</span>
          <span className="floating-icon">⚙️</span>
          <span className="floating-icon">🛠️</span>
          <span className="floating-icon">🔨</span>
        </div>

        <div className="summary-header">
          <h2>Service Details</h2>
          <p>Your professional service booking information</p>
        </div>

        <div className="summary-card">
          {statusInfo && (
            <div className={`status-indicator ${statusInfo.class}`}>
              <div className="status-dot"></div>
              {statusInfo.label}
            </div>
          )}

          <h3>Booking Information</h3>
          
          <div className="summary-grid">
            <div className="summary-item highlight">
              <span className="label">Service</span>
              <span className="value">{details.service}</span>
            </div>

            <div className="summary-item provider">
              <span className="label">Provider</span>
              <span className="value">
                {details.provider}
                <span className="provider-badge">PRO</span>
              </span>
            </div>

            <div className="summary-item">
              <span className="label">Date</span>
              <span className="value">{details.date}</span>
            </div>

            <div className="summary-item">
              <span className="label">Time</span>
              <span className="value">{details.time}</span>
            </div>

            <div className="summary-item">
              <span className="label">Duration</span>
              <span className="value">{details.duration}</span>
            </div>

            <div className="summary-item urgent">
              <span className="label">Urgency</span>
              <span className="value">
                <div className={`urgency-badge ${urgencyInfo.class}`}>
                  <span>{urgencyInfo.icon}</span>
                  <span>{urgencyInfo.label}</span>
                </div>
              </span>
            </div>
          </div>

          {details.specialRequests && (
            <div className="special-requests">
              <span className="label">
                <span>📝</span>
                Special Requests
              </span>
              <span className="value">{details.specialRequests}</span>
            </div>
          )}

          {showActions && (
            <div className="summary-actions">
              <button 
                className="action-btn primary" 
                onClick={() => handleAction('confirm')}
                disabled={isLoading}
              >
                <span>✅</span>
                {isLoading ? 'Processing...' : 'Confirm Booking'}
              </button>
              
              <button 
                className="action-btn secondary" 
                onClick={() => handleAction('reschedule')}
                disabled={isLoading}
              >
                <span>📅</span>
                Reschedule
              </button>
              
              <button 
                className="action-btn outline" 
                onClick={() => handleAction('cancel')}
                disabled={isLoading}
              >
                <span>❌</span>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdvancedServiceSummary
