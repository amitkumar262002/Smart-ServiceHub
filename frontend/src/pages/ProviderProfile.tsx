import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ServicesAPI } from '@/api/client'
import ServiceCard from '@/components/ServiceCard'

interface Service {
  id: string
  title: string
  category: string
  price: number
  provider_id?: string
  rating?: number
  featured?: boolean
  thumbnail?: string
  description?: string
}

export default function ProviderProfile() {
  const { id } = useParams()
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    // Simple filter: show services whose provider_id matches
    ;(async () => {
      const all = await ServicesAPI.list()
      setServices(all.filter((s: Service) => s.provider_id === id))
    })()
  }, [id])

  return (
    <div>
      <h2>Provider {id}</h2>
      <div style={{marginTop:12}}>
        {services.map(s => <ServiceCard key={s.id} service={s} />)}
      </div>
      <div style={{marginTop:12}}>
        <Link to="/search" className="btn">Back to Search</Link>
      </div>
    </div>
  )
}
