import axios from 'axios'

const api = axios.create({
  baseURL: '/', // Sử dụng proxy của Vite thay vì gọi trực tiếp
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url)
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - No redirects, just logging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url, error.message)
    // KHÔNG redirect để tránh vòng lặp
    return Promise.reject(error)
  }
)

export default api
