import api from '../config/api'

const PAYMENT_ENDPOINTS = {
  // /api/payment
  BASE: '/api/payment',
  
  // /api/payment/{id}
  BY_ID: (id) => `/api/payment/${id}`,
  
  // /api/payment/vnpay/create-url
  CREATE_VNPAY_URL: '/api/payment/vnpay/create-url',
  
  // /api/payment/vnpay/return/vnp
  VNPAY_RETURN: '/api/payment/vnpay/return/vnp',
  
  // /api/payment/vnpay/return/success/{orderId}
  VNPAY_SUCCESS: (orderId) => `/api/payment/vnpay/return/success/${orderId}`,
  
  // /api/payment/status/{status}
  BY_STATUS: (status) => `/api/payment/status/${status}`,
  
  // /api/payment/{id}/status
  UPDATE_STATUS: (id) => `/api/payment/${id}/status`,
  
  // /api/payment/{id}/refund
  REFUND: (id) => `/api/payment/${id}/refund`,
  
  // /api/payment/{id}/process
  PROCESS: (id) => `/api/payment/${id}/process`,
  
  // /api/payment/{id}/fail
  FAIL: (id) => `/api/payment/${id}/fail`,
}

export const paymentService = {
  /**
   * Lấy tất cả payment
   * Tương ứng với: GET /api/payment
   */
  async getAllPayments(params) {
    try {
      // params có thể là { page, size, sort... }
      const { data } = await api.get(PAYMENT_ENDPOINTS.BASE, { params })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Tạo một payment mới
   * Tương ứng với: POST /api/payment
   * @param {object} paymentData - Dữ liệu của payment mới
   */
  async createPayment(paymentData) {
    try {
      const { data } = await api.post(PAYMENT_ENDPOINTS.BASE, paymentData)
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Lấy thông tin một payment
   * Tương ứng với: GET /api/payment/{id}
   */
  async getPaymentById(id) {
    try {
      const { data } = await api.get(PAYMENT_ENDPOINTS.BY_ID(id))
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Xóa một payment
   * Tương ứng với: DELETE /api/payment/{id}
   */
  async deletePayment(id) {
    try {
      const { data } = await api.delete(PAYMENT_ENDPOINTS.BY_ID(id))
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Tạo URL thanh toán VNPay
   * Tương ứng với: POST /api/payment/vnpay/create-url
   * @param {object} paymentInfo - Thông tin thanh toán
   */
  async createVNPayUrl(paymentInfo) {
    try {
      const { data } = await api.post(PAYMENT_ENDPOINTS.CREATE_VNPAY_URL, paymentInfo)
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Xử lý khi VNPay trả về
   * Tương ứng với: GET /api/payment/vnpay/return/vnp
   */
  async handleVNPayReturn(params) {
    try {
      const { data } = await api.get(PAYMENT_ENDPOINTS.VNPAY_RETURN, { params })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Xử lý khi thanh toán thành công
   * Tương ứng với: GET /api/payment/vnpay/return/success/{orderId}
   */
  async handlePaymentSuccess(orderId) {
    try {
      const { data } = await api.get(PAYMENT_ENDPOINTS.VNPAY_SUCCESS(orderId))
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Lấy payments theo trạng thái
   * Tương ứng với: GET /api/payment/status/{status}
   */
  async getPaymentsByStatus(status, params = {}) {
    try {
      const { data } = await api.get(PAYMENT_ENDPOINTS.BY_STATUS(status), { params })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Cập nhật trạng thái payment
   * Tương ứng với: PATCH /api/payment/{id}/status
   * @param {string} id - ID của payment
   * @param {object} statusData - Dữ liệu trạng thái mới
   */
  async updatePaymentStatus(id, statusData) {
    try {
      const { data } = await api.patch(PAYMENT_ENDPOINTS.UPDATE_STATUS(id), statusData)
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Hoàn tiền payment
   * Tương ứng với: PATCH /api/payment/{id}/refund
   */
  async refundPayment(id, refundData = {}) {
    try {
      const { data } = await api.patch(PAYMENT_ENDPOINTS.REFUND(id), refundData)
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Xử lý payment
   * Tương ứng với: PATCH /api/payment/{id}/process
   */
  async processPayment(id, processData = {}) {
    try {
      const { data } = await api.patch(PAYMENT_ENDPOINTS.PROCESS(id), processData)
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Đánh dấu payment thất bại
   * Tương ứng với: PATCH /api/payment/{id}/fail
   */
  async failPayment(id, failData = {}) {
    try {
      const { data } = await api.patch(PAYMENT_ENDPOINTS.FAIL(id), failData)
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  }
}

export default paymentService