import  api from '../config/api'

// Centralize endpoints for easy adjustment
const ADMIN_ENDPOINTS = {
  REPORTS: '/admin/reports',
  USERS: '/admin/users',
  USER_BLOCK: (userId) => `/admin/users/${userId}/block`,
  USER_UNBLOCK: (userId) => `/admin/users/${userId}/unblock`,
  POSTS: '/admin/posts',
  POST_APPROVE: (postId) => `/admin/posts/${postId}/approve`,
  POST_REJECT: (postId) => `/admin/posts/${postId}/reject`,
}

export const adminService = {
  async getReports(params) {
    // params: { year?, month?, viewMode? }
    const token = localStorage.getItem('token')
    if (token && token.startsWith('demo')) {
      return {
        subscriptionData: { basic: 45, premium: 28, enterprise: 15 },
        postsCount: 123,
        monthlyData: {
          labels: ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'],
          basic: [10,12,15,18,20,22,25,28,32,35,40,45],
          premium: [5,7,8,10,12,15,18,20,22,24,26,28],
          enterprise: [2,3,4,5,6,8,9,10,11,13,14,15],
        },
        revenueData: {
          labels: ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'],
          data: [15,20,25,30,35,45,50,60,70,80,90,100].map(x => x * 1000000),
        },
        dailyData: { labels: Array.from({length: 30}, (_,i)=>`${i+1}`), revenue: Array.from({length:30}, ()=>Math.random()*5_000_000+1_000_000) }
      }
    }
    const { data } = await api.get(ADMIN_ENDPOINTS.REPORTS, { params })
    return data
  },

  async getUsers(params) {
    // params: { page?, size?, status?, search?, sort? }
    const token = localStorage.getItem('token')
    if (token && token.startsWith('demo')) {
      const items = Array.from({ length: 15 }, (_, i) => ({
        nameId: `USER${String(i+1).padStart(3,'0')}`,
        fullName: `User Demo ${i+1}`,
        email: `user${i+1}@demo.local`,
        phoneNumber: `090${String(1000000 + i).slice(0,7)}`,
        dateSignup: '2025-01-01',
        status: i % 5 === 0 ? 'blocked' : 'active',
        postsCount: Math.floor(Math.random()*20),
        violationsCount: i % 5 === 0 ? 1 : 0,
      }))
      return { items, total: items.length }
    }
    const { data } = await api.get(ADMIN_ENDPOINTS.USERS, { params })
    return data
  },

  async blockUser(userId, reason) {
    const token = localStorage.getItem('token')
    if (token && token.startsWith('demo')) return { success: true }
    const { data } = await api.post(ADMIN_ENDPOINTS.USER_BLOCK(userId), { reason })
    return data
  },

  async unblockUser(userId) {
    const token = localStorage.getItem('token')
    if (token && token.startsWith('demo')) return { success: true }
    const { data } = await api.post(ADMIN_ENDPOINTS.USER_UNBLOCK(userId))
    return data
  },

  async getPosts(params) {
    // params: { page?, size?, status?, search?, sort? }
    const token = localStorage.getItem('token')
    if (token && token.startsWith('demo')) {
      const items = Array.from({ length: 12 }, (_, i) => ({
        id: `POST${String(i+1).padStart(3,'0')}`,
        title: `Bài đăng demo #${i+1}`,
        provinceCity: 'Hà Nội',
        postType: 'Bán',
        createdAt: '2025-10-01',
        memberId: `MBR${1000+i}`,
        price: (i+1) * 1_000_000,
        status: ['pending','approved','rejected'][i % 3],
      }))
      return { items, total: items.length }
    }
    const { data } = await api.get(ADMIN_ENDPOINTS.POSTS, { params })
    return data
  },

  async approvePost(postId) {
    const token = localStorage.getItem('token')
    if (token && token.startsWith('demo')) return { success: true }
    const { data } = await api.post(ADMIN_ENDPOINTS.POST_APPROVE(postId))
    return data
  },

  async rejectPost(postId) {
    const token = localStorage.getItem('token')
    if (token && token.startsWith('demo')) return { success: true }
    const { data } = await api.post(ADMIN_ENDPOINTS.POST_REJECT(postId))
    return data
  },
}

export default adminService


