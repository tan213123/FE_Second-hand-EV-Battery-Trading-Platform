import api from '../config/api'

const ORDER_ENDPOINTS = {
  BASE: '/order',
  DETAIL: (id) => `/order/${id}`,
  MEMBER: (memberId) => `/order/member/${memberId}`,
  STATUS: (status) => `/order/status/${status}`,
  CONFIRM: (id) => `/order/${id}/confirm`,
  COMPLETE: (id) => `/order/${id}/complete`,
  CANCEL: (id) => `/order/${id}/cancel`,
  PAYMENT_STATUS: (id) => `/order/${id}/payment-status`,
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

export const orderService = {
  async getOrders(params) {
    try {
      const { data } = await api.get(ORDER_ENDPOINTS.BASE, { params })
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể tải danh sách đơn hàng')
    }
  },

  async getOrderById(orderId) {
    try {
      const { data } = await api.get(ORDER_ENDPOINTS.DETAIL(orderId))
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể tải thông tin đơn hàng')
    }
  },

  async getOrdersByMember(memberId) {
    try {
      const { data } = await api.get(ORDER_ENDPOINTS.MEMBER(memberId))
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể tải đơn hàng của thành viên')
    }
  },

  async getOrdersByStatus(status) {
    try {
      const { data } = await api.get(ORDER_ENDPOINTS.STATUS(status))
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể tải đơn hàng theo trạng thái')
    }
  },

  async createOrder(payload) {
    try {
      const { data } = await api.post(ORDER_ENDPOINTS.BASE, payload)
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể tạo đơn hàng')
    }
  },

  async updateOrder(orderId, payload) {
    try {
      const { data } = await api.put(ORDER_ENDPOINTS.DETAIL(orderId), payload)
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể cập nhật đơn hàng')
    }
  },

  async deleteOrder(orderId) {
    try {
      await api.delete(ORDER_ENDPOINTS.DETAIL(orderId))
      return { success: true }
    } catch (error) {
      return handleApiError(error, 'Không thể xóa đơn hàng')
    }
  },

  async confirmOrder(orderId) {
    try {
      const { data } = await api.patch(ORDER_ENDPOINTS.CONFIRM(orderId))
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể xác nhận đơn hàng')
    }
  },

  async completeOrder(orderId) {
    try {
      const { data } = await api.patch(ORDER_ENDPOINTS.COMPLETE(orderId))
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể hoàn tất đơn hàng')
    }
  },

  async cancelOrder(orderId) {
    try {
      const { data } = await api.patch(ORDER_ENDPOINTS.CANCEL(orderId))
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể hủy đơn hàng')
    }
  },

  async updatePaymentStatus(orderId, paymentStatus) {
    try {
      const { data } = await api.patch(ORDER_ENDPOINTS.PAYMENT_STATUS(orderId), null, {
        params: { paymentStatus },
      })
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể cập nhật trạng thái thanh toán')
    }
  },
}

export default orderService

