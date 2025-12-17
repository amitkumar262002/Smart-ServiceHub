import { useEffect, useState } from 'react'
import { ProvidersAPI } from '@/api/client'
import ProviderCard from '@/components/ProviderCard'

interface Provider {
  id: string
  name: string
  email: string
  phone: string
  category: string
  rating?: number
  verified?: boolean
  services?: number
  description?: string
}

export default function ProviderDashboard() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string|undefined>()

  useEffect(() => {
    ProvidersAPI.list()
      .then(setProviders)
      .catch(e => setErr(e?.message || 'Failed to load providers'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h2>Provider Dashboard</h2>
      {loading && <div className="card">Loading providers…</div>}
      {err && <div className="card" style={{color:'#fca5a5'}}>Error: {err}</div>}
      <div className="grid">
        {providers.map((p: Provider) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>
    </div>
  )
}
