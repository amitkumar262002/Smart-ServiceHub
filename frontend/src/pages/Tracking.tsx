import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BookingsAPI } from '@/api/client'

export default function Tracking() {
  const { bookingId } = useParams()
  const [loc, setLoc] = useState<{lat:number; lng:number}|null>(null)

  useEffect(() => {
    let mounted = true
    async function tick() {
      const res = await BookingsAPI.track(bookingId!)
      if (!mounted) return
      setLoc(res.provider_location)
    }
    tick()
    const id = setInterval(tick, 4000)
    return () => { mounted = false; clearInterval(id) }
  }, [bookingId])

  return (
    <div>
      <h2>Live Tracking</h2>
      {loc ? (
        <div className="card">
          <div className="card-title">Provider location</div>
          <div>Lat: {loc.lat.toFixed(4)} Lng: {loc.lng.toFixed(4)}</div>
          <div style={{color:'#64748b'}}>Map placeholder (integrate Google Maps later)</div>
        </div>
      ) : (
        <div>Loading location…</div>
      )}
    </div>
  )
}
