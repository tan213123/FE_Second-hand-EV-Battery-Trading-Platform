// API Configuration
export const API_CONFIG = {
  // Base URLs
  BASE_URL: process.env.REACT_APP_API_URL || 'http://14.225.206.98:8080',
  
  // Endpoints
  ENDPOINTS: {
    CARS: '/cars',
    BRANDS: '/brands',
    CITIES: '/cities',
    SEARCH: '/search',
    FILTER: '/filter',
    UPLOAD: '/upload',
    AUTH: '/auth'
  },

  // Timeouts
  TIMEOUT: 10000,

  // Retry config
  RETRY: {
    attempts: 3,
    delay: 1000
  }
}

// Environment variables
export const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  API_URL: process.env.REACT_APP_API_URL,
  DEBUG: process.env.REACT_APP_DEBUG === 'true'
}
