import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { BookingsAPI } from '@/api/client'
import { db } from '@/firebase'
import { ref, push, set } from 'firebase/database'

export default function BookingFlow() {
  const { serviceId } = useParams()
  const nav = useNavigate()
  const [dt, setDt] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function confirm() {
    if (!dt || !address) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const payload = {
        user_id: 'u1', // demo
        provider_id: 'p1', // demo stub
        service_id: serviceId,
        datetime: dt,
        address,
        note
      }

      // write to backend (stub)
      const booking = await BookingsAPI.create(payload)

      // write to Firebase RTDB (mirror)
      try {
        const r = push(ref(db, 'bookings'))
        await set(r, { id: booking.id, status: 'pending', amount: 999, ...payload, createdAt: new Date().toISOString() })
      } catch (e) {
        // non-blocking: proceed even if Firebase write fails
        console.warn('Firebase write failed', e)
      }
      
      setSuccess(true)
      setTimeout(() => {
        nav(`/pay/${booking.id}`)
      }, 2000)
    } catch (err) {
      console.error('Booking failed:', err)
      setError('Failed to create booking. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="booking-flow-advanced">
      <div className="booking-container">
        <div className="booking-header">
          <h1 className="booking-title">Book Service</h1>
          <p className="booking-subtitle">Service ID: {serviceId}</p>
        </div>

        {success && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            <span>Booking created successfully! Redirecting to payment...</span>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            <span>{error}</span>
          </div>
        )}

        <div className="booking-form">
          <div className="form-group">
            <label className="form-label">Date & Time *</label>
            <input 
              className="form-input" 
              type="datetime-local" 
              value={dt} 
              onChange={e=>setDt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Service Address *</label>
            <input 
              className="form-input" 
              placeholder="Enter your complete address" 
              value={address} 
              onChange={e=>setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Additional Notes (Optional)</label>
            <textarea 
              className="form-textarea" 
              placeholder="Any specific requirements or instructions..." 
              value={note} 
              onChange={e=>setNote(e.target.value)}
              rows={4}
            />
          </div>

          <div className="booking-actions">
            <button 
              className="btn-secondary" 
              onClick={() => nav('/search')}
              disabled={isLoading}
            >
              Back to Search
            </button>
            <button 
              className="btn-primary" 
              onClick={confirm}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Booking...' : 'Confirm & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
