import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../config/api'

// Endpoints
const ENDPOINTS = {
  GET_PROFILE: '/members/current',
  UPDATE_PROFILE: (id) => `/members/${id}`,
  UPLOAD_AVATAR: '/profile/avatar',
}

export const getProfile = createAsyncThunk('profile/getProfile', async (_, thunkAPI) => {
  try {
    const res = await api.get(ENDPOINTS.GET_PROFILE)
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || 'Không thể tải thông tin profile')
  }
})

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.put(ENDPOINTS.UPDATE_PROFILE(id), data)
      return res.data
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || 'Cập nhật profile thất bại')
    }
  }
)

export const uploadAvatar = createAsyncThunk('profile/uploadAvatar', async (file, thunkAPI) => {
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await api.post(ENDPOINTS.UPLOAD_AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || 'Không thể cập nhật ảnh đại diện')
  }
})

const initialState = {
  profile: null,
  loading: false,
  saving: false,
  uploading: false,
  error: null,
  success: null,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileMessages(state) {
      state.error = null
      state.success = null
    },
    resetProfileState() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      // getProfile
      .addCase(getProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Không thể tải thông tin profile'
      })
      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.saving = true
        state.error = null
        state.success = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.saving = false
        state.success = 'Cập nhật profile thành công'
        state.profile = action.payload || state.profile
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload || 'Cập nhật profile thất bại'
      })
      // uploadAvatar
      .addCase(uploadAvatar.pending, (state) => {
        state.uploading = true
        state.error = null
        state.success = null
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.uploading = false
        state.success = 'Cập nhật ảnh đại diện thành công'
        if (state.profile) {
          state.profile = { ...state.profile, avatar: action.payload?.avatarUrl || action.payload?.avatar || state.profile.avatar }
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.uploading = false
        state.error = action.payload || 'Không thể cập nhật ảnh đại diện'
      })
  },
})

export const { clearProfileMessages, resetProfileState } = profileSlice.actions
export default profileSlice.reducer
