import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdvancedBookingFlow from '../components/AdvancedBookingFlow'
import BookingConfirmation from '../pages/BookingConfirmation'

const BookingRoutes = () => {
  return (
    <Routes>
      <Route path="/advanced-booking" element={<AdvancedBookingFlow />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
    </Routes>
  )
}

export default BookingRoutes
