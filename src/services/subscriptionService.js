import api from '../config/api'

const SUBSCRIPTION_ENDPOINTS = {
  // /api/subscription
  BASE: '/api/subscription',
  
  // /api/subscription/{memberId}/{packageId}
  BY_IDS: (memberId, packageId) => `/api/subscription/${memberId}/${packageId}`,
  
  // /api/subscription/{memberId}/{packageId}/expire
  EXPIRE: (memberId, packageId) => `/api/subscription/${memberId}/${packageId}/expire`,
  
  // /api/subscription/{memberId}/{packageId}/cancel
  CANCEL: (memberId, packageId) => `/api/subscription/${memberId}/${packageId}/cancel`,
  
  // /api/subscription/{memberId}/{packageId}/activate
  ACTIVATE: (memberId, packageId) => `/api/subscription/${memberId}/${packageId}/activate`,
  
  // /api/subscription/status/{status}
  BY_STATUS: (status) => `/api/subscription/status/${status}`,
  
  // /api/subscription/member/{memberId}
  BY_MEMBER: (memberId) => `/api/subscription/member/${memberId}`,
}

export const subscriptionService = {
  /**
   * Lấy tất cả subscriptions
   * Tương ứng với: GET /api/subscription
   */
  async getAllSubscriptions(params) {
    try {
      // params có thể là { page, size, sort... }
      const { data } = await api.get(SUBSCRIPTION_ENDPOINTS.BASE, { params })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Tạo một subscription mới
   * Tương ứng với: POST /api/subscription
   * @param {object} subscriptionData - Dữ liệu của subscription mới
   */
  async createSubscription(subscriptionData) {
    try {
      const { data } = await api.post(SUBSCRIPTION_ENDPOINTS.BASE, subscriptionData)
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Lấy một subscription cụ thể
   * Tương ứng với: GET /api/subscription/{memberId}/{packageId}
   */
  async getSubscriptionByIds(memberId, packageId) {
    try {
      const { data } = await api.get(SUBSCRIPTION_ENDPOINTS.BY_IDS(memberId, packageId))
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Cập nhật một subscription
   * Tương ứng với: PUT /api/subscription/{memberId}/{packageId}
   * @param {object} updateData - Dữ liệu cần cập nhật
   */
  async updateSubscription(memberId, packageId, updateData) {
    try {
      const { data } = await api.put(SUBSCRIPTION_ENDPOINTS.BY_IDS(memberId, packageId), updateData)
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Xóa một subscription
   * Tương ứng với: DELETE /api/subscription/{memberId}/{packageId}
   */
  async deleteSubscription(memberId, packageId) {
    try {
      const { data } = await api.delete(SUBSCRIPTION_ENDPOINTS.BY_IDS(memberId, packageId))
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Đánh dấu subscription hết hạn
   * Tương ứng với: PATCH /api/subscription/{memberId}/{packageId}/expire
   */
  async expireSubscription(memberId, packageId) {
    try {
      const { data } = await api.patch(SUBSCRIPTION_ENDPOINTS.EXPIRE(memberId, packageId))
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Hủy subscription
   * Tương ứng với: PATCH /api/subscription/{memberId}/{packageId}/cancel
   */
  async cancelSubscription(memberId, packageId) {
    try {
      const { data } = await api.patch(SUBSCRIPTION_ENDPOINTS.CANCEL(memberId, packageId))
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Kích hoạt subscription
   * Tương ứng với: PATCH /api/subscription/{memberId}/{packageId}/activate
   */
  async activateSubscription(memberId, packageId) {
    try {
      const { data } = await api.patch(SUBSCRIPTION_ENDPOINTS.ACTIVATE(memberId, packageId))
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Lấy subscriptions theo trạng thái
   * Tương ứng với: GET /api/subscription/status/{status}
   * @param {string} status - Trạng thái cần lọc (active, expired, cancelled, etc.)
   */
  async getSubscriptionsByStatus(status, params = {}) {
    try {
      const { data } = await api.get(SUBSCRIPTION_ENDPOINTS.BY_STATUS(status), { params })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  },

  /**
   * Lấy tất cả subscriptions của một member
   * Tương ứng với: GET /api/subscription/member/{memberId}
   */
  async getMemberSubscriptions(memberId, params = {}) {
    try {
      const { data } = await api.get(SUBSCRIPTION_ENDPOINTS.BY_MEMBER(memberId), { params })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.response?.data?.message || err.message }
    }
  }
}

export default subscriptionService