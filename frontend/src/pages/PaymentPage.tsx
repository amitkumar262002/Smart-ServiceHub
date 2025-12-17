import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PaymentsAPI } from '@/api/client'

export default function PaymentPage() {
  const { bookingId } = useParams()
  const nav = useNavigate()
  const loc = useLocation()
  const [amount, setAmount] = useState(999)
  const [order, setOrder] = useState<any|null>(null)
  const [method, setMethod] = useState<'upi'|'card'|'cod'>('upi')
  const [upi, setUpi] = useState('')
  const [card, setCard] = useState({ number:'', name:'', exp:'', cvv:'' })

  async function createOrder() {
    const res = await PaymentsAPI.create(amount)
    setOrder(res)
  }
  function payLater() {
    nav(`/track/${bookingId}`)
  }
  function mockPaySuccess() {
    nav(`/track/${bookingId}`)
  }

  // Smooth scroll to hash anchors when present
  useEffect(() => {
    if (loc.hash) {
      const id = loc.hash.replace('#','')
      const el = document.getElementById(id)
      if (el) {
        setTimeout(()=> el.scrollIntoView({ behavior:'smooth', block:'start' }), 50)
      }
    }
  }, [loc.hash])

  return (
    <div>
      <h2>Payment</h2>
      <div className="pay-card">
        <div className="tabs">
          <button className={method==='upi'?'tab active':'tab'} onClick={()=>setMethod('upi')}>UPI</button>
          <button className={method==='card'?'tab active':'tab'} onClick={()=>setMethod('card')}>Card</button>
          <button className={method==='cod'?'tab active':'tab'} onClick={()=>setMethod('cod')}>Cash on Delivery</button>
        </div>

        <div className="grid">
          <div>
            <label>Amount</label>
            <input className="input" type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} />
          </div>
          <div>
            <button className="btn" onClick={createOrder}>Create Order</button>
          </div>
        </div>

        {method==='upi' && (
          <div style={{marginTop:12}}>
            <label>UPI ID</label>
            <input className="input" placeholder="name@bank" value={upi} onChange={e=>setUpi(e.target.value)} />
          </div>
        )}
        {method==='card' && (
          <div className="grid" style={{marginTop:12}}>
            <input className="input" placeholder="Card number" value={card.number} onChange={e=>setCard({...card, number:e.target.value})} />
            <input className="input" placeholder="Name on card" value={card.name} onChange={e=>setCard({...card, name:e.target.value})} />
            <input className="input" placeholder="MM/YY" value={card.exp} onChange={e=>setCard({...card, exp:e.target.value})} />
            <input className="input" placeholder="CVV" value={card.cvv} onChange={e=>setCard({...card, cvv:e.target.value})} />
          </div>
        )}
        {method==='cod' && (
          <div className="card" style={{marginTop:12}}>
            <div className="card-title">Cash will be collected at service time.</div>
            <div className="card-sub">Please keep the exact amount ready.</div>
          </div>
        )}

        <div style={{display:'flex', gap:8, marginTop:12}}>
          <button className="btn" onClick={mockPaySuccess}>Pay Now (Mock)</button>
          <button className="btn" onClick={payLater}>Pay Later</button>
        </div>

        {order && (
          <div className="card" style={{marginTop:12}}>
            <div className="card-title">Order Created</div>
            <div>ID: {order.payment_id}</div>
            <div>Status: {order.status}</div>
          </div>
        )}
      </div>

      {/* Anchor sections */}
      <section id="contact" className="anchor-section card" style={{marginTop:16}}>
        <div className="card-title">Contact</div>
        <div className="card-sub">Need help with payment or booking? We’re here.</div>
        <div style={{marginTop:8}}>
          Email: support@smarthub.local · Phone: +91-99999-00000 · Hours: 9AM–9PM
        </div>
      </section>

      <section id="terms" className="anchor-section card" style={{marginTop:16}}>
        <div className="card-title">Terms</div>
        <div className="card-sub">Key points</div>
        <ul>
          <li>Service times are estimates; you’ll be notified of changes.</li>
          <li>Payments are securely processed; COD available where supported.</li>
          <li>Cancellations and refunds follow provider-specific policies.</li>
        </ul>
      </section>

      <section id="privacy" className="anchor-section card" style={{marginTop:16}}>
        <div className="card-title">Privacy</div>
        <div className="card-sub">Your data, protected.</div>
        <div>We only use your information to deliver services and improve your experience. No unnecessary sharing.</div>
      </section>
    </div>
  )
}
