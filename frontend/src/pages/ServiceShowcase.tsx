import React, { useState } from 'react'
import AdvancedServiceSummary from '../components/AdvancedServiceSummary'
import PremiumServiceSummary from '../components/PremiumServiceSummary'

const ServiceShowcase: React.FC = () => {
  const [viewMode, setViewMode] = useState<'advanced' | 'premium'>('premium')

  const serviceDetails = {
    service: 'Professional Plumbing',
    provider: 'QuickFix Pro',
    date: '25/11/2025',
    time: '02:00 PM',
    duration: '120 minutes',
    urgency: 'normal' as const,
    specialRequests: 'kjhgfhjkmlkiuytr',
    status: 'confirmed' as const
  }

  return (
    <div style={{ minHeight: '100vh', background: viewMode === 'premium' ? 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #1e1b4b 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* View Mode Toggle */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode('advanced')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '12px',
              background: viewMode === 'advanced' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: '600'
            }}
          >
            Advanced
          </button>
          <button
            onClick={() => setViewMode('premium')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '12px',
              background: viewMode === 'premium' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: '600'
            }}
          >
            Premium
          </button>
        </div>
      </div>

      {/* Render based on view mode */}
      {viewMode === 'advanced' ? (
        <AdvancedServiceSummary 
          details={serviceDetails} 
          showActions={true}
          compact={false}
        />
      ) : (
        <PremiumServiceSummary 
          details={serviceDetails} 
          showActions={true}
          compact={false}
          animated={true}
        />
      )}
    </div>
  )
}

export default ServiceShowcase
