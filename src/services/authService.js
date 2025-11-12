import api from '../config/api'

const AUTH_ENDPOINTS = {
  FORGOT_PASSWORD: '/members/forgot-password',
  REGISTER_MEMBER: '/members/register',
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


    async registerMember(payload) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.REGISTER_MEMBER, payload);
      return response.data;
    } catch (error) {

      const message = error.response?.data?.message || 'Đăng ký thành viên thất bại';
      const err = new Error(message);
      err.response = error.response;
      throw err; 
    }
  }
}



export default authService


