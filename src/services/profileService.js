import api from '../config/api'

// API endpoints for profile management
const PROFILE_ENDPOINTS = {
  GET_PROFILE: '/profile',
  UPDATE_PROFILE: '/profile',
  UPLOAD_AVATAR: '/profile/avatar',
  GET_USER_STATS: '/profile/stats',
  GET_USER_POSTS: '/profile/posts',
  GET_USER_REVIEWS: '/profile/reviews'
}

// Profile API service
export const profileService = {
  // Lấy thông tin profile của user hiện tại
  async getProfile() {
    try {
      const response = await api.get(PROFILE_ENDPOINTS.GET_PROFILE)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tải thông tin profile'
      }
    }
  },

  // Cập nhật thông tin profile
  async updateProfile(profileData) {
    try {
      const response = await api.put(PROFILE_ENDPOINTS.UPDATE_PROFILE, profileData)
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật profile thành công'
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể cập nhật profile'
      }
    }
  },

  // Upload avatar
  async uploadAvatar(file) {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      
      const response = await api.post(PROFILE_ENDPOINTS.UPLOAD_AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật ảnh đại diện thành công'
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể cập nhật ảnh đại diện'
      }
    }
  },

  // Lấy thống kê của user
  async getUserStats() {
    try {
      const response = await api.get(PROFILE_ENDPOINTS.GET_USER_STATS)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tải thống kê'
      }
    }
  },

  // Lấy danh sách bài đăng của user
  async getUserPosts(params = {}) {
    try {
      const response = await api.get(PROFILE_ENDPOINTS.GET_USER_POSTS, { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching user posts:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tải danh sách bài đăng'
      }
    }
  },

  // Lấy đánh giá của user
  async getUserReviews(params = {}) {
    try {
      const response = await api.get(PROFILE_ENDPOINTS.GET_USER_REVIEWS, { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching user reviews:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tải đánh giá'
      }
    }
  }
}

// Mock data for development/testing
export const mockProfileData = {
  id: 1,
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@email.com',
  phone: '0901234567',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  yearOfBirth: 1990,
  sex: 'male',
  bio: 'Người đam mê xe điện và công nghệ.',
  avatar: 'https://via.placeholder.com/120x120/4ECDC4/FFFFFF?text=Avatar',
  verified: true,
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-20T00:00:00Z'
}

export const mockUserStats = {
  totalPosts: 12,
  activePosts: 8,
  soldItems: 36,
  rating: 4.9,
  totalReviews: 25,
  memberSince: '2024-01-15'
}

export const mockUserPosts = [
  {
    id: 1,
    title: 'VinFast VF 8 Plus 2023 - Xe điện cao cấp',
    price: 850000000,
    status: 'active',
    views: 156,
    createdAt: '2024-01-18T00:00:00Z',
    images: ['/api/placeholder/280/180']
  },
  {
    id: 2,
    title: 'Tesla Model 3 Long Range - 82 kWh',
    price: 1200000000,
    status: 'sold',
    views: 89,
    createdAt: '2024-01-15T00:00:00Z',
    images: ['/api/placeholder/280/180']
  }
]

export const mockUserReviews = [
  {
    id: 1,
    reviewer: {
      name: 'Trần Thị B',
      avatar: '/api/placeholder/40/40'
    },
    rating: 5,
    comment: 'Giao dịch nhanh chóng, uy tín. Sản phẩm đúng mô tả.',
    createdAt: '2024-01-19T00:00:00Z'
  },
  {
    id: 2,
    reviewer: {
      name: 'Lê Văn C',
      avatar: '/api/placeholder/40/40'
    },
    rating: 5,
    comment: 'Người bán rất nhiệt tình, sản phẩm chất lượng tốt.',
    createdAt: '2024-01-17T00:00:00Z'
  }
]

export default profileService
