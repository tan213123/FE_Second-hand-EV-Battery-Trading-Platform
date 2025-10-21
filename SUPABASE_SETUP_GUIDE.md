# Hướng dẫn cài đặt và sử dụng Supabase Storage

## 1. Cài đặt ban đầu

### Bước 1: Tạo project Supabase
1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Tạo project mới
3. Lấy URL và API Key từ Settings > API

### Bước 2: Cấu hình môi trường
Cập nhật file `src/config/supabase.js`:

```javascript
const supabaseUrl = 'https://rvmbqoitqkxzvmwryddx.supabase.co'
const supabaseKey = 'your_actual_anon_key_here' // Thay thế bằng key thật
```

### Bước 3: Tạo Storage Bucket
1. Vào Storage > Buckets trong Supabase Dashboard
2. Tạo bucket mới tên `product-images`
3. Cấu hình public access

### Bước 4: Cấu hình Storage Policies
Tạo các policies sau trong Storage > Policies:

1. **Policy cho SELECT (xem ảnh)**:
```sql
-- Policy name: Anyone can view images
-- Operation: SELECT
-- Target roles: public

CREATE POLICY "Anyone can view images" ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'product-images');
```

2. **Policy cho INSERT (upload ảnh)**:
```sql
-- Policy name: Anyone can upload images
-- Operation: INSERT
-- Target roles: public

CREATE POLICY "Anyone can upload images" ON storage.objects 
FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'product-images');
```

3. **Policy cho DELETE (xóa ảnh)**:
```sql
-- Policy name: Anyone can delete images
-- Operation: DELETE
-- Target roles: public

CREATE POLICY "Anyone can delete images" ON storage.objects 
FOR DELETE 
TO public 
USING (bucket_id = 'product-images');
```

## 2. Sử dụng Component

### Ví dụ 1: Upload một ảnh
```jsx
import ImageUpload from '../components/ImageUpload'

function SingleImageForm() {
  const [productImage, setProductImage] = useState('')

  const handleImageChange = (images) => {
    setProductImage(images[0] || '')
  }

  return (
    <div>
      <ImageUpload
        onImagesChange={handleImageChange}
        multiple={false}
        folder="products"
      />
    </div>
  )
}
```

### Ví dụ 2: Upload nhiều ảnh
```jsx
import ImageUpload from '../components/ImageUpload'

function MultipleImageForm() {
  const [productImages, setProductImages] = useState([])

  const handleImagesChange = (images) => {
    setProductImages(images)
  }

  return (
    <div>
      <ImageUpload
        onImagesChange={handleImagesChange}
        multiple={true}
        maxFiles={5}
        folder="products"
        existingImages={productImages}
      />
    </div>
  )
}
```

### Ví dụ 3: Tích hợp vào form đăng bán
```jsx
import { useState } from 'react'
import ImageUpload from '../components/ImageUpload'

function SellProductForm() {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    images: []
  })

  const handleImagesChange = (images) => {
    setFormData(prev => ({
      ...prev,
      images
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Gửi dữ liệu sản phẩm kèm URLs hình ảnh
    const productData = {
      ...formData,
      imageUrls: formData.images // URLs từ Supabase
    }
    
    // Call API để lưu sản phẩm
    console.log('Product data:', productData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Tên sản phẩm"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
      />
      
      <input
        type="number"
        placeholder="Giá"
        value={formData.price}
        onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
      />
      
      <textarea
        placeholder="Mô tả"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
      />
      
      <ImageUpload
        onImagesChange={handleImagesChange}
        multiple={true}
        maxFiles={10}
        folder="products"
      />
      
      <button type="submit">Đăng sản phẩm</button>
    </form>
  )
}
```

## 3. API Functions có sẵn

### Upload Functions
- `uploadImage(file, folder)` - Upload một file
- `uploadMultipleImages(files, folder)` - Upload nhiều file

### Delete Functions  
- `deleteImage(imageUrl)` - Xóa một ảnh
- `deleteMultipleImages(imageUrls)` - Xóa nhiều ảnh

### Validation
- `validateImageFile(file, maxSizeMB, allowedTypes)` - Kiểm tra file hợp lệ

## 4. Lưu ý quan trọng

1. **Bảo mật**: Cấu hình RLS (Row Level Security) cho bucket
2. **Hiệu suất**: Nén ảnh trước khi upload để tối ưu bandwidth
3. **Cleanup**: Xóa ảnh cũ khi cập nhật để tiết kiệm storage
4. **Validation**: Luôn validate file phía client và server
5. **Error handling**: Xử lý lỗi network và storage đầy đủ

## 5. Troubleshooting

### Lỗi thường gặp:
1. **403 Forbidden**: Kiểm tra Storage policies
2. **File too large**: Kiểm tra giới hạn upload của Supabase
3. **Invalid file type**: Đảm bảo chỉ upload image files
4. **Network error**: Kiểm tra kết nối internet và Supabase status