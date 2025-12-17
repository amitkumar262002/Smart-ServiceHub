import { Link } from 'react-router-dom'
import { useRef } from 'react'

interface Service {
  id: number | string
  title: string
  category: string
  price: number
  rating?: number
  featured?: boolean
  bookings?: number
  thumbnail?: string
  description?: string
  tags?: string[]
  difficulty?: string
  tools_required?: string[]
  warranty_months?: number
  duration_minutes?: number
  eco_friendly?: boolean
  materials_included?: boolean
  online_available?: boolean
  success_rate?: number
}

type Props = { service: Service }
export default function ServiceCard({ service }: Props) {
  const thumb = service.thumbnail || ''
  const apiBase = (import.meta as any).env.VITE_API_BASE || 'http://localhost:5000'
  
  // Category-specific icon mapping
  const categoryIcons: Record<string, string> = {
    'Plumber': '/images/icon-plumber.svg',
    'Electrician': '/images/icon-electrician.svg',
    'Tutor': '/images/icon-tutor.svg',
    'Cleaning': '/images/icon-cleaning.svg',
    'Mechanic': '/images/icon-mechanic.svg',
    'AC Repair': '/images/icon-ac.svg',
    'Appliance Repair': '/images/icon-appliance.svg'
  }
  
  // For Unsplash URLs, use them directly
  // For other external URLs, use proxy
  // For local/missing, use category icon or default placeholder
  let img = categoryIcons[service.category] || '/images/placeholder-service.svg'
  
  if (thumb) {
    if (thumb.includes('unsplash.com')) {
      img = thumb
    } else if (thumb.startsWith('http')) {
      img = `${apiBase}/api/proxy?url=${encodeURIComponent(thumb)}`
    } else {
      img = thumb
    }
  }
  
  const onErr = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget
    el.classList.add('error')
    el.src = categoryIcons[service.category] || '/images/placeholder-service.svg'
  }
  
  const onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget
    el.classList.remove('loading')
    el.classList.remove('error')
  }
  
  const onLoadStart = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget
    el.classList.add('loading')
  }
  return (
    <div className="card service">
      {img && <img className="service-thumb" src={img} alt={service.title} onError={onErr} onLoad={onLoad} onLoadStart={onLoadStart} referrerPolicy="no-referrer" crossOrigin="anonymous" />}
      <div className="service-body">
        <div className="card-title">{service.title}</div>
        <div className="card-sub">{service.category}</div>
        <div className="service-price">₹ {service.price.toFixed(0)}</div>
        {service.duration_minutes && <div className="service-duration">⏱️ {service.duration_minutes} mins</div>}
        {service.difficulty && <div className="service-difficulty">📊 {service.difficulty}</div>}
        {service.warranty_months && service.warranty_months > 0 && <div className="service-warranty">🛡️ {service.warranty_months} months warranty</div>}
        {service.eco_friendly && <span className="chip chip-sm eco">🌿 Eco-friendly</span>}
        {service.materials_included && <span className="chip chip-sm">📦 Materials included</span>}
        {service.online_available && <span className="chip chip-sm">💻 Online available</span>}
        {service.success_rate && <span className="chip chip-sm success">✅ {service.success_rate}% success</span>}
        {service.featured && <span className="chip chip-sm featured">⭐ Featured</span>}
        {service.rating && <div className="service-rating">⭐ {parseFloat(service.rating.toFixed(2))}</div>}
        {service.bookings && <div className="service-bookings">📅 {service.bookings} bookings</div>}
        {service.tags && service.tags.length > 0 && (
          <div className="service-tags">
            {service.tags.slice(0, 3).map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}
      </div>
      <div className="service-cta">
        <Link to={`/book/${service.id}`} className="btn">Book Now</Link>
      </div>
    </div>
  )
}
