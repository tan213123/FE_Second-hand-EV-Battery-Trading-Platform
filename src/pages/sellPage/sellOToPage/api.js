import axios from 'axios';

// Base URL cho API
const API_BASE_URL = 'http://14.225.206.98:8080';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn, xóa token và redirect về login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API Services
export const carAPI = {
  // Lấy danh sách xe - GET /api/vehicles
  getCars: (params = {}) => {
    return api.get('/api/vehicles', { params });
  },

  // Lấy chi tiết xe - GET /api/vehicles/{id}
  getCarById: (id) => {
    return api.get(`/api/vehicles/${id}`);
  },

  // Tìm kiếm xe - POST /api/vehicles/search
  searchCars: (searchParams) => {
    return api.post('/api/vehicles/search', searchParams);
  },

  // Lọc xe theo điều kiện - GET /api/vehicles/filter
  filterCars: (filters) => {
    return api.get('/api/vehicles/filter', { params: filters });
  },

  // Lấy danh sách hãng xe - GET /api/brands
  getBrands: () => {
    return api.get('/api/brands');
  },

  // Lấy danh sách tỉnh thành - GET /api/cities
  getCities: () => {
    return api.get('/api/cities');
  },

  // Lấy danh sách loại xe - GET /api/vehicle-types
  getVehicleTypes: () => {
    return api.get('/api/vehicle-types');
  },

  // Lấy danh sách tình trạng xe - GET /api/conditions
  getConditions: () => {
    return api.get('/api/conditions');
  },

  // Lấy danh sách nhiên liệu - GET /api/fuels
  getFuels: () => {
    return api.get('/api/fuels');
  },

  // Lấy danh sách hộp số - GET /api/transmissions
  getTransmissions: () => {
    return api.get('/api/transmissions');
  },

  // Upload hình ảnh - POST /api/upload
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Tạo tin đăng mới - POST /api/vehicles
  createVehicle: (vehicleData) => {
    return api.post('/api/vehicles', vehicleData);
  },

  // Cập nhật tin đăng - PUT /api/vehicles/{id}
  updateVehicle: (id, vehicleData) => {
    return api.put(`/api/vehicles/${id}`, vehicleData);
  },

  // Xóa tin đăng - DELETE /api/vehicles/{id}
  deleteVehicle: (id) => {
    return api.delete(`/api/vehicles/${id}`);
  }
};

export default api;
