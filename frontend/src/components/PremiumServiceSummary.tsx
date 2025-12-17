import React, { useState, useEffect, useRef } from 'react'
import '../styles/PremiumServiceSummary.css'

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

interface PremiumServiceSummaryProps {
  details: ServiceDetails
  showActions?: boolean
  compact?: boolean
  animated?: boolean
}

const PremiumServiceSummary: React.FC<PremiumServiceSummaryProps> = ({ 
  details, 
  showActions = true, 
  compact = false,
  animated = true
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setMousePosition({ x, y })
      }
    }

    if (animated && cardRef.current) {
      cardRef.current.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [animated])

  const handleAction = async (action: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log(`Action: ${action}`)
    setIsLoading(false)
  }

  const getUrgencyInfo = (urgency: string) => {
    const urgencyMap = {
      normal: { 
        class: 'normal', 
        icon: '🕐', 
        label: 'Normal Priority',
        description: 'Standard service timing'
      },
      urgent: { 
        class: 'urgent', 
        icon: '⚡', 
        label: 'Urgent Priority',
        description: 'Expedited service available'
      },
      emergency: { 
        class: 'emergency', 
        icon: '🚨', 
        label: 'Emergency',
        description: 'Immediate response required'
      }
    }
    return urgencyMap[urgency as keyof typeof urgencyMap] || urgencyMap.normal
  }

  const getStatusInfo = (status: string) => {
    const statusMap = {
      confirmed: { class: 'confirmed', label: 'Booking Confirmed', icon: '✅' },
      pending: { class: 'pending', label: 'Awaiting Confirmation', icon: '⏳' },
      cancelled: { class: 'cancelled', label: 'Booking Cancelled', icon: '❌' }
    }
    return statusMap[status as keyof typeof statusMap] || statusMap.pending
  }

  const urgencyInfo = getUrgencyInfo(details.urgency)
  const statusInfo = details.status ? getStatusInfo(details.status) : null

  return (
    <div className="premium-service-summary">
      <div className="premium-container">
        <div className="premium-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="premium-header">
          <h1>Service Details</h1>
          <p>Professional service booking with advanced tracking and management</p>
        </div>

        <div 
          className="premium-card" 
          ref={cardRef}
          style={{ 
            '--mouse-x': `${mousePosition.x}%`, 
            '--mouse-y': `${mousePosition.y}%` 
          } as React.CSSProperties}
        >
          {statusInfo && (
            <div className={`premium-status ${statusInfo.class}`}>
              <div className="status-indicator"></div>
              <span>{statusInfo.icon}</span>
              {statusInfo.label}
            </div>
          )}

          <h2 className="premium-title">
            Booking Information
          </h2>
          
          <div className="premium-grid">
            <div className="premium-item highlight">
              <div className="premium-label">Service Type</div>
              <div className="premium-value">
                <span>🔧</span>
                {details.service}
              </div>
            </div>

            <div className="premium-item provider">
              <div className="premium-label">Service Provider</div>
              <div className="premium-value">
                <span>⭐</span>
                {details.provider}
              </div>
            </div>

            <div className="premium-item">
              <div className="premium-label">Scheduled Date</div>
              <div className="premium-value">
                <span>📅</span>
                {details.date}
              </div>
            </div>

            <div className="premium-item">
              <div className="premium-label">Time Slot</div>
              <div className="premium-value">
                <span>🕐</span>
                {details.time}
              </div>
            </div>

            <div className="premium-item">
              <div className="premium-label">Service Duration</div>
              <div className="premium-value">
                <span>⏱️</span>
                {details.duration}
              </div>
            </div>

            <div className="premium-item">
              <div className="premium-label">Priority Level</div>
              <div className="premium-value">
                <div className={`premium-urgency ${urgencyInfo.class}`}>
                  <span>{urgencyInfo.icon}</span>
                  <span>{urgencyInfo.label}</span>
                </div>
              </div>
            </div>
          </div>

          {details.specialRequests && (
            <div className="premium-special">
              <div className="premium-label">
                <span>📝</span>
                Special Requirements
              </div>
              <div className="premium-value">
                {details.specialRequests}
              </div>
            </div>
          )}

          {showActions && (
            <div className="premium-actions">
              <button 
                className="premium-btn primary" 
                onClick={() => handleAction('confirm')}
                disabled={isLoading}
              >
                <span>✅</span>
                {isLoading ? 'Processing...' : 'Confirm Booking'}
              </button>
              
              <button 
                className="premium-btn secondary" 
                onClick={() => handleAction('reschedule')}
                disabled={isLoading}
              >
                <span>📅</span>
                Reschedule Service
              </button>
              
              <button 
                className="premium-btn danger" 
                onClick={() => handleAction('cancel')}
                disabled={isLoading}
              >
                <span>❌</span>
                Cancel Booking
              </button>
            </div>
          )}

          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            background: 'rgba(255, 255, 255, 0.02)', 
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.875rem'
            }}>
              <span>Booking ID: #BK-2025-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
              <span>Last updated: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PremiumServiceSummary
