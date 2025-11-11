import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../config/api'

// Thunk: forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      // Adjust endpoint if your backend differs
      const res = await api.post('/members/forgot-password', { email })
      return res.data || { success: true }
    } catch (err) {
      const message = err?.response?.data?.message || 'Không thể gửi liên kết đặt lại mật khẩu'
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
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.forgot.status = 'loading'
        state.forgot.error = null
        state.forgot.data = null
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgot.status = 'succeeded'
        state.forgot.data = action.payload
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgot.status = 'failed'
        state.forgot.error = action.payload || 'Yêu cầu thất bại'
      })
  },
})

export default authSlice.reducer
