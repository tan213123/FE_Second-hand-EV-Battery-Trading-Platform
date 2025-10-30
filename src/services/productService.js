import api from '../config/api'
import localStorageService from './localStorageService'

/**
 * API Services for Product operations
 */
export const productService = {
  /**
   * Tạo sản phẩm mới
   * @param {Object} productData - Dữ liệu sản phẩm
   * @returns {Promise} - Response từ API
   */
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData)
      return { data: response.data, error: null }
    } catch (error) {
      console.error('Create product error:', error)
      return { 
        data: null, 
        error: error.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm' 
      }
    }
  },

  /**
   * Upload metadata sản phẩm với images URLs
   * @param {Object} productData - Dữ liệu sản phẩm bao gồm imageUrls
   */
  createProductWithImages: async (productData) => {
    try {
      // MOCK MODE để test - set false khi có BE thật
      const MOCK_MODE = true
      
      if (MOCK_MODE) {
        console.log('🧪 MOCK MODE: Simulating API call...')
        console.log('📤 Product data to send:', productData)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Mock successful response
        const mockResponse = {
          id: 'product_' + Date.now(),
          title: productData.title,
          imageUrls: productData.images,
          createdAt: new Date().toISOString(),
          status: 'active'
        }
        
        console.log('✅ MOCK API Response:', mockResponse)
        
        // Lưu vào localStorage để hiển thị trong danh sách
        const savedPost = localStorageService.savePost(productData)
        console.log('💾 Saved to localStorage:', savedPost)
        
        // Dispatch event để thông báo có post mới
        window.dispatchEvent(new CustomEvent('postUpdated'))
        
        return { data: mockResponse, error: null }
      }
      
      // Validate imageUrls - đảm bảo là URL từ Supabase
      const validImageUrls = (productData.images || []).filter(url => {
        if (typeof url !== 'string') return false
        try {
          const urlObj = new URL(url)
          return urlObj.hostname.includes('supabase.co') // Kiểm tra URL từ Supabase
        } catch {
          return false
        }
      })

      if (validImageUrls.length === 0) {
        return { 
          data: null, 
          error: 'Vui lòng upload ít nhất một hình ảnh hợp lệ từ Supabase' 
        }
      }

      // Chuẩn bị dữ liệu gửi lên BE
      const payload = {
        title: productData.title,
        description: productData.description,
        price: parseInt(productData.price),
        category: productData.category,
        condition: productData.condition,
        brand: productData.brand,
        year: parseInt(productData.year),
        color: productData.color,
        origin: productData.origin,
        region: productData.region,
        negotiable: productData.negotiable || false,
        
        // URLs hình ảnh từ Supabase Storage (đã validate)
        imageUrls: validImageUrls,
        
        // Category-specific fields
        ...(productData.category === 'car' && {
          bodyType: productData.bodyType,
          seats: productData.seats
        }),
        
        ...(productData.category === 'battery' && {
          batteryType: productData.batteryType,
          capacity: productData.capacity
        }),
        
        // Location info
        location: {
          city: productData.location?.city,
          district: productData.location?.district, 
          ward: productData.location?.ward,
          address: productData.location?.address
        },
        
        // Contact info
        contact: {
          name: productData.contactName,
          phone: productData.contactPhone
        },
        
        // Metadata
        createdAt: new Date().toISOString(),
        status: 'active' // hoặc 'pending' nếu cần review
      }

      console.log('📤 Sending product data to BE:', payload)
      console.log('🖼️ Image URLs from Supabase:', validImageUrls)
      
      const response = await api.post('/products', payload)
      console.log('✅ Backend response:', response.data)
      
      return { data: response.data, error: null }
      
    } catch (error) {
      console.error('Create product with images error:', error)
      return { 
        data: null, 
        error: error.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm' 
      }
    }
  },

  /**
   * Cập nhật sản phẩm
   * @param {string} productId - ID sản phẩm
   * @param {Object} productData - Dữ liệu cần cập nhật
   */
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/${productId}`, productData)
      return { data: response.data, error: null }
    } catch (error) {
      console.error('Update product error:', error)
      return { 
        data: null, 
        error: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm' 
      }
    }
  },

  /**
   * Xóa sản phẩm
   * @param {string} productId - ID sản phẩm
   */
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`)
      return { data: response.data, error: null }
    } catch (error) {
      console.error('Delete product error:', error)
      return { 
        data: null, 
        error: error.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm' 
      }
    }
  },

  /**
   * Lấy danh sách sản phẩm
   * @param {Object} params - Query parameters
   */
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params })
      return { data: response.data, error: null }
    } catch (error) {
      console.error('Get products error:', error)
      return { 
        data: null, 
        error: error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách sản phẩm' 
      }
    }
  },

  /**
   * Lấy chi tiết sản phẩm
   * @param {string} productId - ID sản phẩm
   */
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`)
      return { data: response.data, error: null }
    } catch (error) {
      console.error('Get product by ID error:', error)
      return { 
        data: null, 
        error: error.response?.data?.message || 'Có lỗi xảy ra khi lấy thông tin sản phẩm' 
      }
    }
  },

  /**
   * Cập nhật sản phẩm với images URLs
   * @param {Object} productData - Dữ liệu sản phẩm cập nhật
   */
  updateProductWithImages: async (productData) => {
    try {
      // MOCK MODE để test
      const MOCK_MODE = true
      
      if (MOCK_MODE) {
        console.log('🧪 MOCK MODE: Simulating update API call...')
        console.log('📤 Product data to update:', productData)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Cập nhật trong localStorage
        const success = localStorageService.updatePost(productData.id, productData)
        
        if (success) {
          const mockResponse = {
            id: productData.id,
            title: productData.title,
            imageUrls: productData.images,
            updatedAt: new Date().toISOString(),
            status: 'active'
          }
          
          console.log('✅ MOCK UPDATE Response:', mockResponse)
          
          // Dispatch event để thông báo có post được cập nhật
          window.dispatchEvent(new CustomEvent('postUpdated'))
          
          return { data: mockResponse, error: null }
        } else {
          return { data: null, error: 'Không tìm thấy bài đăng để cập nhật' }
        }
      }

      // Real API call logic sẽ được thêm sau
      return { data: null, error: 'Real API chưa được implement' }
      
    } catch (error) {
      console.error('Update product error:', error)
      return { 
        data: null, 
        error: 'Có lỗi xảy ra khi cập nhật sản phẩm' 
      }
    }
  },

  /**
   * Kiểm tra kết nối với Backend
   */
  checkBackendConnection: async () => {
    try {
      const response = await api.get('/health')
      return { connected: true, data: response.data }
    } catch (error) {
      console.error('Backend connection check failed:', error)
      return { 
        connected: false, 
        error: error.message || 'Không thể kết nối đến Backend'
      }
    }
  }
}

export default productService