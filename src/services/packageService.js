import api from '../config/api'

const PACKAGE_ENDPOINTS = {
  BASE: '/package',
  ACTIVE: '/package/active',
  DETAIL: (id) => `/package/${id}`,
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

export const packageService = {
  async getPackages(params) {
    try {
      const { data } = await api.get(PACKAGE_ENDPOINTS.BASE, { params })
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể tải danh sách gói dịch vụ')
    }
  },

  async getActivePackages() {
    try {
      const { data } = await api.get(PACKAGE_ENDPOINTS.ACTIVE)
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể tải danh sách gói đang hoạt động')
    }
  },

  async getPackageById(packageId) {
    try {
      const { data } = await api.get(PACKAGE_ENDPOINTS.DETAIL(packageId))
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể tải thông tin gói dịch vụ')
    }
  },

  async createPackage(payload) {
    try {
      // Client-side validation khớp với BE
      if (!payload || typeof payload !== 'object') {
        return { success: false, error: 'Dữ liệu không hợp lệ' }
      }
      const { price, numberOfPost, durationDays } = payload
      if (!Number.isFinite(price) || price <= 0) {
        return { success: false, error: 'Giá phải lớn hơn 0' }
      }
      if (!Number.isInteger(numberOfPost) || numberOfPost <= 0) {
        return { success: false, error: 'Số lượng bài đăng phải lớn hơn 0' }
      }
      if (!Number.isInteger(durationDays) || durationDays <= 0) {
        return { success: false, error: 'Thời hạn (ngày) phải lớn hơn 0' }
      }
      const { data } = await api.post(PACKAGE_ENDPOINTS.BASE, payload)
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể tạo gói dịch vụ')
    }
  },

  async updatePackage(packageId, payload) {
    try {
      // Client-side validation tương tự
      if (!payload || typeof payload !== 'object') {
        return { success: false, error: 'Dữ liệu không hợp lệ' }
      }
      const { price, numberOfPost, durationDays } = payload
      if (!Number.isFinite(price) || price <= 0) {
        return { success: false, error: 'Giá phải lớn hơn 0' }
      }
      if (!Number.isInteger(numberOfPost) || numberOfPost <= 0) {
        return { success: false, error: 'Số lượng bài đăng phải lớn hơn 0' }
      }
      if (durationDays != null && (!Number.isInteger(durationDays) || durationDays <= 0)) {
        return { success: false, error: 'Thời hạn (ngày) phải lớn hơn 0' }
      }
      const { data } = await api.put(
        PACKAGE_ENDPOINTS.DETAIL(packageId),
        payload,
      )
      return { success: true, data }
    } catch (error) {
      return handleApiError(error, 'Không thể cập nhật gói dịch vụ')
    }
  },

  async deletePackage(packageId) {
    try {
      await api.delete(PACKAGE_ENDPOINTS.DETAIL(packageId))
      return { success: true }
    } catch (error) {
      return handleApiError(error, 'Không thể xóa gói dịch vụ')
    }
  },
}

export default packageService

