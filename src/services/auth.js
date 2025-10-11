import axios from 'axios';

// Base URL cho API
const API_BASE_URL = 'http://14.225.206.98:8080';

// Tạo axios instance cho auth
const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🔐 Auth API Request:', config.method?.toUpperCase(), config.url);
    console.log('🔐 Request headers:', config.headers);
    console.log('🔐 Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Auth API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý token
authApi.interceptors.response.use(
  (response) => {
    console.log('✅ Auth API Response:', response.status, response.config.url);
    console.log('📊 Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Auth API Error:', error);
    console.error('❌ Error response:', error.response);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Error data:', error.response?.data);
    
    if (error.response?.status === 401) {
      // Token hết hạn, xóa token và redirect về login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authAPI = {
  // Đăng ký - POST /api/auth/register
  register: async (userData) => {
    try {
      console.log('🚀 Gọi API register với data:', userData);
      const response = await authApi.post('/api/auth/register', userData);
      return response;
    } catch (error) {
      console.error('❌ API register failed:', error);
      
      // Fallback: Mock response nếu server không hoạt động
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error') || !error.response) {
        console.log('🔄 Sử dụng mock response cho register');
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: {
                message: 'Đăng ký thành công (Mock)',
                user: {
                  id: Date.now(),
                  name: userData.name,
                  email: userData.email,
                  phone: userData.phone
                },
                token: 'mock_token_' + Date.now()
              },
              status: 201
            });
          }, 1000);
        });
      }
      
      throw error;
    }
  },

  // Đăng nhập - POST /api/auth/login
  login: async (credentials) => {
    try {
      console.log('🚀 Gọi API login với credentials:', credentials);
      const response = await authApi.post('/api/auth/login', credentials);
      return response;
    } catch (error) {
      console.error('❌ API login failed:', error);
      
      // Fallback: Mock response nếu server không hoạt động
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error') || !error.response) {
        console.log('🔄 Sử dụng mock response cho login');
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: {
                message: 'Đăng nhập thành công (Mock)',
                user: {
                  id: Date.now(),
                  name: 'Người dùng Mock',
                  email: credentials.email,
                  phone: '0123456789'
                },
                token: 'mock_token_' + Date.now()
              },
              status: 200
            });
          }, 1000);
        });
      }
      
      throw error;
    }
  },

  // Đăng xuất - POST /api/auth/logout
  logout: () => {
    return authApi.post('/api/auth/logout');
  },

  // Lấy thông tin user - GET /api/auth/me
  getCurrentUser: () => {
    return authApi.get('/api/auth/me');
  },

  // Refresh token - POST /api/auth/refresh
  refreshToken: () => {
    return authApi.post('/api/auth/refresh');
  },

  // Quên mật khẩu - POST /api/auth/forgot-password
  forgotPassword: (email) => {
    return authApi.post('/api/auth/forgot-password', { email });
  },

  // Đặt lại mật khẩu - POST /api/auth/reset-password
  resetPassword: (token, newPassword) => {
    return authApi.post('/api/auth/reset-password', { token, newPassword });
  },

  // Xác thực email - POST /api/auth/verify-email
  verifyEmail: (token) => {
    return authApi.post('/api/auth/verify-email', { token });
  },

  // Gửi lại email xác thực - POST /api/auth/resend-verification
  resendVerification: (email) => {
    return authApi.post('/api/auth/resend-verification', { email });
  }
};

// Utility functions
export const authUtils = {
  // Lưu token vào localStorage
  setToken: (token) => {
    localStorage.setItem('authToken', token);
  },

  // Lấy token từ localStorage
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Xóa token khỏi localStorage
  removeToken: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Kiểm tra user đã đăng nhập chưa
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Lưu thông tin user
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Lấy thông tin user
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Xóa thông tin user
  removeUser: () => {
    localStorage.removeItem('user');
  }
};

export default authApi;
