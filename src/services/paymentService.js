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
  if (error.response) {
    const { data, status } = error.response
    const message = typeof data === 'string'
      ? data
      : data?.message || data?.error || fallbackMessage

    return {
      success: false,
      error: message,
      status,
    }
  }

  return {
    success: false,
    error: fallbackMessage,
    status: undefined,
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
      console.log('Creating VNPAY URL for orderId:', orderId)
      const payload = { orderId: Number(orderId) }

      const response = await api.post(
        PAYMENT_ENDPOINTS.CREATE_VNPAY_URL,
        payload,
        {
          params: payload, // hỗ trợ backend cũ yêu cầu query param
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'text', // backend trả về string URL
        },
      )
      
      console.log('Payment URL raw response:', response.data)
      
      let paymentUrl = response.data

      // Nếu trả về JSON string, parse lấy paymentUrl/url
      if (typeof paymentUrl === 'string' && paymentUrl.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(paymentUrl)
          paymentUrl = parsed.paymentUrl || parsed.url || paymentUrl
        } catch (e) {
          console.log('Response is not JSON, using raw string as URL')
        }
      }
      
      if (!paymentUrl || typeof paymentUrl !== 'string' || !paymentUrl.startsWith('http')) {
        console.error('Invalid payment URL:', paymentUrl)
        return {
          success: false,
          error: 'Không nhận được liên kết thanh toán hợp lệ từ máy chủ',
        }
      }

      console.log('Payment URL created successfully:', paymentUrl)
      return { success: true, data: paymentUrl }
    } catch (error) {
      console.error('Error creating VNPAY URL:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
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

