import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage bucket configuration
export const STORAGE_BUCKET = 'PRODUCT-IMG' // Tên bucket để lưu ảnh sản phẩm

// Helper functions for image upload
export const uploadImage = async (file, folder = 'listings') => {
  try {
    console.log('📸 Starting image upload:', file.name)
    console.log('🗂️ Bucket:', STORAGE_BUCKET)
    console.log('🔑 Supabase URL:', supabaseUrl)
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    console.log('📁 File path:', filePath)

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    console.log('📤 Upload result:', { data, error })

    if (error) {
      console.error('❌ Upload error:', error)
      throw error
    }

    // Lấy public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath)

    return {
      success: true,
      data: {
        path: data.path,
        publicUrl: publicUrl,
        fileName: fileName
      }
    }
  } catch (error) {
    console.error('❌ Error uploading image:', error)
    console.error('❌ Error details:', {
      message: error.message,
      status: error.status,
      statusCode: error.statusCode,
      details: error.details
    })
    return {
      success: false,
      error: error.message || 'Unknown upload error',
      details: error
    }
  }
}

// Upload multiple images
export const uploadMultipleImages = async (files, folder = 'listings') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder))
    const results = await Promise.all(uploadPromises)
    
    const successfulUploads = results.filter(result => result.success)
    const failedUploads = results.filter(result => !result.success)

    return {
      success: failedUploads.length === 0,
      successfulUploads: successfulUploads.map(upload => upload.data),
      failedUploads: failedUploads,
      totalUploaded: successfulUploads.length,
      totalFailed: failedUploads.length
    }
  } catch (error) {
    console.error('Error uploading multiple images:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Delete image
export const deleteImage = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath])

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting image:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get image URL
export const getImageUrl = (filePath) => {
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath)
  
  return publicUrl
}

// Test connection and bucket
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Test bucket existence
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError)
      return { success: false, error: bucketsError }
    }

    console.log('📦 Available buckets:', buckets.map(b => b.name))
    
    const bucketExists = buckets.find(b => b.name === STORAGE_BUCKET)
    if (!bucketExists) {
      console.error(`❌ Bucket '${STORAGE_BUCKET}' not found!`)
      return { 
        success: false, 
        error: `Bucket '${STORAGE_BUCKET}' not found. Available buckets: ${buckets.map(b => b.name).join(', ')}` 
      }
    }

    console.log('✅ Connection test successful!')
    return { success: true, bucket: bucketExists }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return { success: false, error: error.message }
  }
}