import React, { useState, useRef } from 'react'
import { uploadImage, uploadMultipleImages, deleteImage, validateImageFile } from '../../utils/imageUpload'
import './ImageUpload.scss'

const ImageUpload = ({ 
  onImagesChange, 
  multiple = false, 
  maxFiles = 5,
  folder = 'products',
  existingImages = []
}) => {
  const [images, setImages] = useState(existingImages)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return

    setUploading(true)
    
    try {
      if (multiple) {
        // Kiểm tra số lượng file
        if (images.length + files.length > maxFiles) {
          alert(`Chỉ có thể upload tối đa ${maxFiles} hình ảnh`)
          setUploading(false)
          return
        }

        // Validate từng file
        const validFiles = []
        for (const file of files) {
          const validation = validateImageFile(file)
          if (validation.isValid) {
            validFiles.push(file)
          } else {
            alert(`File ${file.name}: ${validation.error}`)
          }
        }

        if (validFiles.length > 0) {
          const { data: uploadedUrls, errors } = await uploadMultipleImages(validFiles, folder)
          
          if (errors.length > 0) {
            console.error('Upload errors:', errors)
            alert('Có lỗi xảy ra khi upload một số file')
          }

          const newImages = [...images, ...uploadedUrls]
          setImages(newImages)
          onImagesChange?.(newImages)
        }
      } else {
        // Single file upload
        const file = files[0]
        const validation = validateImageFile(file)
        
        if (!validation.isValid) {
          alert(validation.error)
          setUploading(false)
          return
        }

        const { data: imageUrl, error } = await uploadImage(file, folder)
        
        if (error) {
          console.error('Upload error:', error)
          alert('Có lỗi xảy ra khi upload hình ảnh')
        } else {
          const newImages = [imageUrl]
          setImages(newImages)
          onImagesChange?.(newImages)
        }
      }
    } catch (error) {
      console.error('Upload exception:', error)
      alert('Có lỗi xảy ra khi upload hình ảnh')
    }
    
    setUploading(false)
  }

  const handleRemoveImage = async (imageUrl, index) => {
    try {
      const { success, error } = await deleteImage(imageUrl)
      
      if (!success) {
        console.error('Delete error:', error)
        alert('Có lỗi xảy ra khi xóa hình ảnh')
        return
      }

      const newImages = images.filter((_, i) => i !== index)
      setImages(newImages)
      onImagesChange?.(newImages)
    } catch (error) {
      console.error('Delete exception:', error)
      alert('Có lỗi xảy ra khi xóa hình ảnh')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFileSelect(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files)
    handleFileSelect(files)
    // Reset input để có thể chọn lại cùng file
    e.target.value = ''
  }

  return (
    <div className="image-upload">
      {/* Upload Area */}
      <div 
        className={`upload-area ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        
        {uploading ? (
          <div className="upload-status">
            <div className="spinner"></div>
            <p>Đang upload...</p>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">📷</div>
            <p>
              {multiple 
                ? `Kéo thả hoặc click để chọn hình ảnh (tối đa ${maxFiles} ảnh)`
                : 'Kéo thả hoặc click để chọn hình ảnh'
              }
            </p>
            <small>Hỗ trợ: JPG, PNG, WebP (tối đa 5MB)</small>
          </div>
        )}
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="image-preview">
          <h4>Hình ảnh đã chọn ({images.length}{multiple ? `/${maxFiles}` : ''})</h4>
          <div className="image-grid">
            {images.map((imageUrl, index) => (
              <div key={index} className="image-item">
                <img src={imageUrl} alt={`Preview ${index + 1}`} />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemoveImage(imageUrl, index)}
                  title="Xóa hình ảnh"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUpload