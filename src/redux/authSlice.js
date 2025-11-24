import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../config/api'

// Thunk: forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const res = await api.post('/members/forgot-password', { email })
      return res.data || { success: true }
    } catch (err) {
      const message = err?.response?.data?.message || 'Không thể gửi liên kết đặt lại mật khẩu'
      return rejectWithValue(message)
    }
  }
)

// Thunk: reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const res = await api.post('/members/reset-password', { token, newPassword })
      return res.data || { success: true }
    } catch (err) {
      const message = err?.response?.data?.message || 'Không thể đặt lại mật khẩu'
      return rejectWithValue(message)
    }
  }
)

const initialState = {
  forgot: {
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    data: null,
  },
  reset: {
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    data: null,
  },
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Forgot password cases
      .addCase(forgotPassword.pending, (state) => {
        if (!state.forgot) {
          state.forgot = { status: 'idle', error: null, data: null }
        }
        state.forgot.status = 'loading'
        state.forgot.error = null
        state.forgot.data = null
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        if (!state.forgot) {
          state.forgot = { status: 'idle', error: null, data: null }
        }
        state.forgot.status = 'succeeded'
        state.forgot.data = action.payload
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        if (!state.forgot) {
          state.forgot = { status: 'idle', error: null, data: null }
        }
        state.forgot.status = 'failed'
        state.forgot.error = action.payload || 'Yêu cầu thất bại'
      })
      // Reset password cases
      .addCase(resetPassword.pending, (state) => {
        if (!state.reset) {
          state.reset = { status: 'idle', error: null, data: null }
        }
        state.reset.status = 'loading'
        state.reset.error = null
        state.reset.data = null
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        if (!state.reset) {
          state.reset = { status: 'idle', error: null, data: null }
        }
        state.reset.status = 'succeeded'
        state.reset.data = action.payload
      })
      .addCase(resetPassword.rejected, (state, action) => {
        if (!state.reset) {
          state.reset = { status: 'idle', error: null, data: null }
        }
        state.reset.status = 'failed'
        state.reset.error = action.payload || 'Đặt lại mật khẩu thất bại'
      })
  },
})

export default authSlice.reducer
