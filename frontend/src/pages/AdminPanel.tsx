export default function AdminPanel() {
  const providers = [
    { id: 'p1', name: 'Provider p1', verified: true },
    { id: 'p8', name: 'Provider p8', verified: false }
  ]
  const bookings = [
    { id: 'b1', amount: 999, status: 'paid' },
    { id: 'b2', amount: 1499, status: 'unpaid' }
  ]

  return (
    <div>
      <h2>Admin Panel</h2>
      <div className="card">
        <div className="card-title">Providers</div>
        {providers.map(p => (
          <div key={p.id} style={{display:'flex',justifyContent:'space-between'}}>
            <div>{p.name}</div>
            <div>{p.verified ? 'Verified' : 'Pending'}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">Bookings</div>
        {bookings.map(b => (
          <div key={b.id} style={{display:'flex',justifyContent:'space-between'}}>
            <div>Booking {b.id}</div>
            <div>₹ {b.amount} — {b.status}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">Export CSV</div>
        <button className="btn">Export (stub)</button>
      </div>
    </div>
  )
}
