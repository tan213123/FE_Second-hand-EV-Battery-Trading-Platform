# Hướng dẫn Backend nhận URL từ Supabase

## 1. Cấu trúc dữ liệu gửi từ Frontend

Khi user đăng tin, Frontend sẽ gửi POST request tới `/api/products` với payload sau:

```json
{
  "title": "Tên sản phẩm",
  "description": "Mô tả sản phẩm",
  "price": 50000000,
  "category": "car",
  "condition": "Mới",
  "brand": "VinFast", 
  "year": 2023,
  "color": "Trắng",
  "origin": "Sản xuất trong nước",
  "region": "Hà Nội",
  "negotiable": false,
  
  "imageUrls": [
    "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/abc123_1234567890.jpg",
    "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/def456_1234567890.jpg"
  ],
  
  "bodyType": "SUV",
  "seats": "7 chỗ",
  
  "batteryType": "Li-ion",
  "capacity": "60kWh",
  
  "location": {
    "city": "Hà Nội",
    "district": "Ba Đình",
    "ward": "Phúc Xá",
    "address": "123 Đường ABC"
  },
  
  "contact": {
    "name": "Nguyễn Văn A",
    "phone": "0123456789"
  },
  
  "createdAt": "2023-10-18T10:30:00.000Z",
  "status": "active"
}
```

## 2. Đặc điểm quan trọng của imageUrls

### 2.1 Format URL Supabase
- **Pattern**: `https://{project_id}.supabase.co/storage/v1/object/public/{bucket}/{folder}/{filename}`
- **Ví dụ**: `https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/abc123_1234567890.jpg`

### 2.2 Validation bên Frontend
Frontend đã validate để đảm bảo:
- URL phải là string hợp lệ
- Hostname phải chứa `.supabase.co`
- Ít nhất phải có 1 URL hình ảnh

### 2.3 Đặc điểm URL
- **Public Access**: Các URL này có thể truy cập trực tiếp từ browser
- **Permanent**: URL sẽ tồn tại vĩnh viễn trừ khi bị xóa thủ công
- **CDN**: Supabase có CDN tự động để tối ưu tốc độ load

## 3. Backend Implementation Suggestions

### 3.1 Validation bên Backend
```javascript
// Validate imageUrls
const validateImageUrls = (imageUrls) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return { isValid: false, error: 'At least one image URL is required' }
  }
  
  for (const url of imageUrls) {
    try {
      const urlObj = new URL(url)
      if (!urlObj.hostname.includes('supabase.co')) {
        return { isValid: false, error: 'Invalid image URL format' }
      }
    } catch (error) {
      return { isValid: false, error: 'Invalid URL format' }
    }
  }
  
  return { isValid: true }
}
```

### 3.2 Database Schema
Đề xuất cấu trúc bảng `products`:

```sql
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(15,2),
  category VARCHAR(50),
  condition VARCHAR(100),
  brand VARCHAR(100),
  year INTEGER,
  color VARCHAR(50),
  origin VARCHAR(100),
  region VARCHAR(100),
  negotiable BOOLEAN DEFAULT FALSE,
  
  -- JSON field để lưu imageUrls
  image_urls JSON,
  -- Hoặc có thể tách riêng bảng product_images
  
  -- Category specific fields
  body_type VARCHAR(50),
  seats VARCHAR(20),
  battery_type VARCHAR(50),
  capacity VARCHAR(20),
  
  -- Location (JSON)
  location JSON,
  
  -- Contact (JSON) 
  contact JSON,
  
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3.3 API Endpoint Example (Node.js/Express)
```javascript
// POST /api/products
app.post('/api/products', async (req, res) => {
  try {
    const {
      title,
      description, 
      price,
      category,
      imageUrls,
      location,
      contact,
      ...otherFields
    } = req.body
    
    // Validate imageUrls
    const validation = validateImageUrls(imageUrls)
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: validation.error 
      })
    }
    
    // Tạo product trong database
    const product = await db.products.create({
      id: generateUUID(),
      title,
      description,
      price,
      category,
      image_urls: JSON.stringify(imageUrls),
      location: JSON.stringify(location),
      contact: JSON.stringify(contact),
      ...otherFields,
      created_at: new Date(),
      status: 'active'
    })
    
    res.status(201).json({
      success: true,
      data: {
        id: product.id,
        title: product.title,
        imageUrls: JSON.parse(product.image_urls),
        createdAt: product.created_at,
        status: product.status
      }
    })
    
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({
      error: 'Internal server error'
    })
  }
})
```

## 4. Lưu ý quan trọng

### 4.1 Security
- Không cần validate file content vì ảnh đã được upload lên Supabase
- Supabase đã có validation và security
- Chỉ cần validate URL format

### 4.2 Storage
- Backend chỉ lưu URL, không lưu file
- Giảm tải storage cho Backend server
- Tăng tốc độ response

### 4.3 Display
- Frontend có thể hiển thị ảnh trực tiếp từ URL
- Supabase có CDN tối ưu tốc độ
- Hỗ trợ resize/transform tự động

## 5. Testing

### 5.1 Test URL hợp lệ
```javascript
const testUrls = [
  "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test1.jpg",
  "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test2.png"
]
```

### 5.2 Test Backend health
Frontend có thể gọi `/api/health` để kiểm tra kết nối

## 6. Error Handling

Backend nên trả về error rõ ràng:
- 400: Validation failed (thiếu imageUrls, URL không hợp lệ)
- 500: Server error
- 201: Success với data response

Việc thiết lập này đảm bảo Backend sẽ nhận được URL từ Supabase một cách chính xác và an toàn.