import axios from 'axios'

const api = axios.create({
  baseURL: '/api', // Sử dụng proxy của Vite thay vì gọi trực tiếp
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Chỉ redirect khi gặp 401 và không phải đang ở trang login
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      console.warn('Token expired or invalid, redirecting to login...')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
