import React from 'react'
import AdvancedServiceSummary from '../components/AdvancedServiceSummary'

const ProfessionalServiceDetails: React.FC = () => {
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <AdvancedServiceSummary 
        details={serviceDetails} 
        showActions={true}
        compact={false}
      />
    </div>
  )
}

export default ProfessionalServiceDetails
