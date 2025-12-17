import React from 'react'
import PremiumServiceSummary from '../components/PremiumServiceSummary'

const PremiumServiceDetails: React.FC = () => {
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
    <PremiumServiceSummary 
      details={serviceDetails} 
      showActions={true}
      compact={false}
      animated={true}
    />
  )
}

export default PremiumServiceDetails
