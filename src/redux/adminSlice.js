import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../config/api'

// Thunk: fetch admin reports
export const fetchReports = createAsyncThunk(
  'admin/fetchReports',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/admin/reports', { params })
      return res.data || {}
    } catch (err) {
      const message = err?.response?.data?.message || 'Không thể tải thống kê admin'
      return rejectWithValue(message)
    }
  }
)

// Posts management
export const fetchAdminPosts = createAsyncThunk(
  'admin/fetchPosts',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/admin/posts', { params })
      return res.data
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Không thể tải danh sách bài đăng')
    }
  }
)

export const approvePost = createAsyncThunk(
  'admin/approvePost',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.post(`/admin/posts/${id}/approve`)
      return res.data
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Duyệt bài thất bại')
    }
  }
)

export const rejectPost = createAsyncThunk(
  'admin/rejectPost',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.post(`/admin/posts/${id}/reject`)
      return res.data
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Từ chối bài thất bại')
    }
  }
)

// Users management
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/admin/users', { params })
      return res.data
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Không thể tải danh sách người dùng')
    }
  }
)

export const blockUser = createAsyncThunk(
  'admin/blockUser',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/admin/users/${id}/block`, { reason })
      return res.data
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Khóa tài khoản thất bại')
    }
  }
)

export const unblockUser = createAsyncThunk(
  'admin/unblockUser',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.post(`/admin/users/${id}/unblock`)
      return res.data
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Mở khóa tài khoản thất bại')
    }
  }
)

const initialState = {
  reports: {
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    data: {
      subscriptionData: { basic: 0, premium: 0, enterprise: 0 },
      postsCount: 0,
      monthlyData: { labels: [], basic: [], premium: [], enterprise: [] },
      revenueData: { labels: [], data: [] },
      dailyData: { labels: [], revenue: [] },
    },
  },
  posts: { status: 'idle', error: null },
  users: { status: 'idle', error: null },
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.reports.status = 'loading'
        state.reports.error = null
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reports.status = 'succeeded'
        // Normalize with defaults
        const d = action.payload || {}
        state.reports.data = {
          subscriptionData: d.subscriptionData || { basic: 0, premium: 0, enterprise: 0 },
          postsCount: d.postsCount ?? 0,
          monthlyData: d.monthlyData || { labels: [], basic: [], premium: [], enterprise: [] },
          revenueData: d.revenueData || { labels: [], data: [] },
          dailyData: d.dailyData || { labels: [], revenue: [] },
        }
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.reports.status = 'failed'
        state.reports.error = action.payload || 'Yêu cầu thất bại'
      })

      // posts
      .addCase(fetchAdminPosts.pending, (state) => {
        state.posts.status = 'loading'
        state.posts.error = null
      })
      .addCase(fetchAdminPosts.fulfilled, (state) => {
        state.posts.status = 'succeeded'
      })
      .addCase(fetchAdminPosts.rejected, (state, action) => {
        state.posts.status = 'failed'
        state.posts.error = action.payload
      })
      .addCase(approvePost.rejected, (state, action) => {
        state.posts.error = action.payload
      })
      .addCase(rejectPost.rejected, (state, action) => {
        state.posts.error = action.payload
      })

      // users
      .addCase(fetchUsers.pending, (state) => {
        state.users.status = 'loading'
        state.users.error = null
      })
      .addCase(fetchUsers.fulfilled, (state) => {
        state.users.status = 'succeeded'
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users.status = 'failed'
        state.users.error = action.payload
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.users.error = action.payload
      })
      .addCase(unblockUser.rejected, (state, action) => {
        state.users.error = action.payload
      })
  },
})

export default adminSlice.reducer
