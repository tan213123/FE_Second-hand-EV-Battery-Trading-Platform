import api from '../config/api'

const AUTH_ENDPOINTS = {
  FORGOT_PASSWORD: '/members/forgot-password',
}

export const authService = {
  async forgotPassword(email) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email })
      return { success: true, data: response.data }
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể gửi yêu cầu quên mật khẩu'
      return { success: false, error: message }
    }
  },
}

export default authService


