import api from '../config/api'

const PAYMENT_ENDPOINTS = {
  BASE: '/payment',
  DETAIL: (id) => `/payment/${id}`,
  STATUS: (status) => `/payment/status/${status}`,
  UPDATE_STATUS: (id) => `/payment/${id}/status`,
  PROCESS: (id) => `/payment/${id}/process`,
  FAIL: (id) => `/payment/${id}/fail`,
  REFUND: (id) => `/payment/${id}/refund`,
  CREATE_VNPAY_URL: '/payment/vnpay/create-url',
  VNPAY_RETURN_SUCCESS: (orderId) => `/payment/vnpay/return/success/${orderId}`,
  VNPAY_RETURN_GENERAL: '/payment/vnpay/return/vnp',
}

const handleApiError = (error, fallbackMessage) => {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    fallbackMessage

  return {
    success: false,
    error: message,
    status: error.response?.status,
  }
}

export const paymentService = {
  async getPayments(params) {
    try {
      const { data } = await api.get(PAYMENT_ENDPOINTS.BASE, { params })
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể tải danh sách thanh toán')
    }
  },

  async getPaymentById(paymentId) {
    try {
      const { data } = await api.get(PAYMENT_ENDPOINTS.DETAIL(paymentId))
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể tải thông tin thanh toán')
    }
  },

  async getPaymentsByStatus(status) {
    try {
      const { data } = await api.get(PAYMENT_ENDPOINTS.STATUS(status))
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể tải thanh toán theo trạng thái')
    }
  },

  async createPayment(payload) {
    try {
      const { data } = await api.post(PAYMENT_ENDPOINTS.BASE, payload)
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể tạo thanh toán')
    }
  },

  async updatePaymentStatus(paymentId, status) {
    try {
      const { data } = await api.patch(PAYMENT_ENDPOINTS.UPDATE_STATUS(paymentId), null, {
        params: { status },
      })
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể cập nhật trạng thái thanh toán')
    }
  },

  async deletePayment(paymentId) {
    try {
      await api.delete(PAYMENT_ENDPOINTS.DETAIL(paymentId))
      return { success: true }
    } catch (error) {
      return handleApiError(error, 'Không thể xóa thanh toán')
    }
  },

  async processPayment(paymentId) {
    try {
      const { data } = await api.patch(PAYMENT_ENDPOINTS.PROCESS(paymentId))
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể xử lý thanh toán')
    }
  },

  async failPayment(paymentId, reason) {
    try {
      const { data } = await api.patch(
        PAYMENT_ENDPOINTS.FAIL(paymentId),
        null,
        { params: reason ? { reason } : undefined },
      )
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể cập nhật trạng thái thất bại')
    }
  },

  async refundPayment(paymentId) {
    try {
      const { data } = await api.patch(PAYMENT_ENDPOINTS.REFUND(paymentId))
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể hoàn tiền thanh toán')
    }
  },

  async createVnpayPaymentUrl(orderId) {
    try {
      const { data } = await api.post(
        PAYMENT_ENDPOINTS.CREATE_VNPAY_URL,
        null,
        { params: { orderId } },
      )
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể tạo liên kết thanh toán VNPAY')
    }
  },

  async handleVnpayReturnSuccess(orderId, params) {
    try {
      const { data } = await api.get(
        PAYMENT_ENDPOINTS.VNPAY_RETURN_SUCCESS(orderId),
        { params },
      )
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể xử lý callback VNPAY thành công')
    }
  },

  async handleVnpayReturn(params) {
    try {
      const { data } = await api.get(
        PAYMENT_ENDPOINTS.VNPAY_RETURN_GENERAL,
        { params },
      )
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể xử lý callback VNPAY')
    }
  },
}

export default paymentService

