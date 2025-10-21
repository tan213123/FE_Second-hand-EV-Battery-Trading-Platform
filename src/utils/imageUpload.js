import { supabase, PRODUCT_IMAGES_BUCKET } from '../config/supabase'

/**
 * Upload một file hình ảnh lên Supabase Storage
 * @param {File} file - File hình ảnh cần upload
 * @param {string} folder - Thư mục lưu trữ (vd: 'products', 'avatars')
 * @returns {Promise<{data: string | null, error: any}>} - URL của hình ảnh đã upload hoặc error
 */
export const uploadImage = async (file, folder = 'products') => {
  try {
    // Tạo tên file unique
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substr(2, 9)}_${Date.now()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload file
    const { error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return { data: null, error }
    }

    // Lấy public URL của file đã upload
    const { data: urlData } = supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .getPublicUrl(filePath)

    return { data: urlData.publicUrl, error: null }
  } catch (error) {
    console.error('Upload exception:', error)
    return { data: null, error }
  }
}

/**
 * Upload nhiều file hình ảnh
 * @param {FileList} files - Danh sách file cần upload
 * @param {string} folder - Thư mục lưu trữ
 * @returns {Promise<{data: string[], errors: any[]}>} - Danh sách URL và errors
 */
export const uploadMultipleImages = async (files, folder = 'products') => {
  const uploadPromises = Array.from(files).map(file => uploadImage(file, folder))
  const results = await Promise.all(uploadPromises)
  
  const data = results
    .filter(result => result.data)
    .map(result => result.data)
  
  const errors = results
    .filter(result => result.error)
    .map(result => result.error)

  return { data, errors }
}

/**
 * Xóa một hình ảnh từ Supabase Storage
 * @param {string} imageUrl - URL của hình ảnh cần xóa
 * @returns {Promise<{success: boolean, error: any}>}
 */
export const deleteImage = async (imageUrl) => {
  try {
    // Extract file path từ URL
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/')
    const bucketIndex = pathParts.findIndex(part => part === PRODUCT_IMAGES_BUCKET)
    
    if (bucketIndex === -1) {
      return { success: false, error: 'Invalid image URL' }
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/')

    const { error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return { success: false, error }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Delete exception:', error)
    return { success: false, error }
  }
}

/**
 * Xóa nhiều hình ảnh
 * @param {string[]} imageUrls - Danh sách URL hình ảnh cần xóa
 * @returns {Promise<{successes: number, errors: any[]}>}
 */
export const deleteMultipleImages = async (imageUrls) => {
  const deletePromises = imageUrls.map(url => deleteImage(url))
  const results = await Promise.all(deletePromises)
  
  const successes = results.filter(result => result.success).length
  const errors = results
    .filter(result => !result.success)
    .map(result => result.error)

  return { successes, errors }
}

/**
 * Kiểm tra kích thước và định dạng file
 * @param {File} file - File cần kiểm tra
 * @param {number} maxSizeMB - Kích thước tối đa (MB)
 * @param {string[]} allowedTypes - Các định dạng được phép
 * @returns {{isValid: boolean, error: string | null}}
 */
export const validateImageFile = (file, maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) => {
  // Kiểm tra định dạng
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`
    }
  }

  // Kiểm tra kích thước
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File quá lớn. Kích thước tối đa: ${maxSizeMB}MB`
    }
  }

  return { isValid: true, error: null }
}