import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
export const api = axios.create({ baseURL })

export const ServicesAPI = {
  list: (params: { q?: string; category?: string } = {}) => api.get('/api/services', { params }).then(r => r.data),
}

export const AIAPI = {
  recommend: (text: string) => api.post('/api/ai/recommend', { text }).then(r => r.data),
}

export const BookingsAPI = {
  create: (payload: any) => api.post('/api/bookings', payload).then(r => r.data),
  track: (id: string) => api.get(`/api/bookings/${id}/track`).then(r => r.data),
}

export const PaymentsAPI = {
  create: (amount: number) => api.post('/api/payments/create', { amount }).then(r => r.data),
}

export const ProvidersAPI = {
  list: () => api.get('/api/providers').then(r => r.data)
}
