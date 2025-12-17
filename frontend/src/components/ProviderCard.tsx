import RatingStars from './RatingStars'

interface Provider {
  id: number | string
  user_id?: string
  name?: string
  email?: string
  phone?: string
  category?: string
  rating?: number
  verified?: boolean
  services?: number
  description?: string
  specialty?: string
  jobs?: number
  categories?: string[]
  profile_pic?: string
  hourly_rate?: number
  address?: string
  experience_years?: number
  jobs_completed?: number
  response_time_minutes?: number
  availability?: string[]
  languages?: string[]
  specialties?: string[]
  certifications?: string[]
  about?: string
  working_hours?: { start: string; end: string }
  online_teaching?: boolean
  students_taught?: number
  success_rate?: number
  eco_friendly?: boolean
  team_size?: number
  garage_type?: string
  mobile_service?: boolean
}

type Props = { provider: Provider }
export default function ProviderCard({ provider }: Props) {
  const id = provider.id || 'p?'
  const displayName = provider.name || `Pro ${String(id).toUpperCase()}`
  const cats: string[] = provider.categories || []
  const rawPic = provider.profile_pic
  const apiBase = (import.meta as any).env.VITE_API_BASE || 'http://localhost:5000'
  
  // Fix thumbnail handling for Unsplash URLs
  let imgPrimary = '/images/placeholder-provider.svg'
  if (rawPic) {
    if (rawPic.includes('unsplash.com')) {
      imgPrimary = rawPic
    } else if (rawPic.startsWith('http')) {
      imgPrimary = `${apiBase}/api/proxy?url=${encodeURIComponent(rawPic)}`
    } else {
      imgPrimary = rawPic
    }
  }
  
  const imgFallback = '/images/placeholder-provider.svg'

  const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget
    el.classList.add('error')
    el.src = imgFallback
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
    <div className="card provider">
      <img className="avatar circle" src={imgPrimary} alt={displayName} onError={onImgError} onLoad={onLoad} onLoadStart={onLoadStart} referrerPolicy="no-referrer" />
      <div className="provider-info">
        <div className="card-title">{displayName}</div>
        <div className="card-sub">
          <RatingStars value={provider.rating || 0} />
          <span style={{marginLeft:6}}>{provider.rating ? parseFloat(provider.rating.toFixed(2)) : '—'} ★</span>
        </div>
        {provider.experience_years && <div className="provider-experience">👨‍🔧 {provider.experience_years} years experience</div>}
        {provider.jobs_completed && <div className="provider-jobs">📋 {provider.jobs_completed} jobs completed</div>}
        {provider.response_time_minutes && <div className="provider-response">⚡ {provider.response_time_minutes} mins response</div>}
        {provider.hourly_rate && <div className="provider-rate">💰 ₹{provider.hourly_rate.toFixed(0)}/hour</div>}
        {provider.address && <div className="provider-address">📍 {provider.address}</div>}
        {provider.languages && provider.languages.length > 0 && (
          <div className="provider-languages">🗣️ {provider.languages.join(', ')}</div>
        )}
        <div className="chips">
          {cats.map(c => <span key={c} className="chip chip-sm">{c}</span>)}
          {provider.verified && <span className="chip chip-sm verified">✓ Verified</span>}
          {provider.eco_friendly && <span className="chip chip-sm eco">🌿 Eco-friendly</span>}
          {provider.online_teaching && <span className="chip chip-sm online">💻 Online</span>}
          {provider.mobile_service && <span className="chip chip-sm mobile">🚗 Mobile</span>}
          {provider.success_rate && <span className="chip chip-sm success">✅ {provider.success_rate}%</span>}
        </div>
        {provider.about && <div className="provider-about">{provider.about}</div>}
      </div>
    </div>
  )
}
