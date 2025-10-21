# Hướng dẫn Backend API cho Product với Image URLs

## 1. API Endpoint cần tạo

### POST /api/products
**Mục đích**: Tạo sản phẩm mới với URLs hình ảnh từ Supabase

**Request Body**:
```json
{
  "title": "VinFast VF8 2023",
  "description": "Xe điện VinFast VF8 màu trắng, đi 15000km...",
  "price": 1200000000,
  "category": "car",
  "condition": "Đã sử dụng (Còn mới)",
  "brand": "VinFast",
  "year": 2023,
  "color": "Trắng",
  "origin": "Việt Nam", 
  "region": "Hồ Chí Minh",
  "negotiable": true,
  
  "imageUrls": [
    "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/abc123_1634567890.jpg",
    "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/def456_1634567891.jpg"
  ],
  
  "bodyType": "SUV",
  "seats": "5 chỗ",
  
  "location": {
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 1", 
    "ward": "Phường Bến Nghé",
    "address": "123 Đường ABC"
  },
  
  "contact": {
    "name": "Nguyễn Văn A",
    "phone": "0123456789"
  },
  
  "createdAt": "2025-10-18T10:30:00Z",
  "status": "active"
}
```

**Response Success** (201):
```json
{
  "success": true,
  "data": {
    "id": "product_123",
    "title": "VinFast VF8 2023",
    "imageUrls": [...],
    "createdAt": "2025-10-18T10:30:00Z",
    "status": "active"
  },
  "message": "Tạo sản phẩm thành công"
}
```

**Response Error** (400/500):
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Title is required",
  "details": {
    "field": "title",
    "code": "REQUIRED"
  }
}
```

## 2. Database Schema

### products table
```sql
CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price BIGINT,
  category ENUM('car', 'electric', 'battery'),
  condition VARCHAR(100),
  brand VARCHAR(100),
  year INTEGER,
  color VARCHAR(50),
  origin VARCHAR(100),
  region VARCHAR(100),
  negotiable BOOLEAN DEFAULT false,
  
  -- Category specific
  body_type VARCHAR(50), -- cho car
  seats VARCHAR(20),     -- cho car
  battery_type VARCHAR(50), -- cho battery
  capacity VARCHAR(50),     -- cho battery
  
  -- Location
  city VARCHAR(100),
  district VARCHAR(100),
  ward VARCHAR(100),
  address TEXT,
  
  -- Contact
  contact_name VARCHAR(100),
  contact_phone VARCHAR(20),
  
  -- System
  user_id VARCHAR(50), -- ID người đăng
  status ENUM('active', 'inactive', 'pending', 'sold') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### product_images table
```sql
CREATE TABLE product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id VARCHAR(50),
  image_url TEXT NOT NULL,
  image_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

## 3. Backend Logic

### Controller Example (Node.js/Express)
```javascript
const createProduct = async (req, res) => {
  try {
    const {
      title, description, price, category, condition,
      brand, year, color, origin, region, negotiable,
      imageUrls = [],
      bodyType, seats, batteryType, capacity,
      location, contact, status = 'active'
    } = req.body;
    
    // Validate required fields
    if (!title || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        error: 'VALIDATION_ERROR'
      });
    }
    
    // Validate images
    if (!imageUrls || imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required',
        error: 'IMAGES_REQUIRED'
      });
    }
    
    // Generate product ID
    const productId = generateProductId(); // Implement your ID generation
    
    // Insert product
    const productData = {
      id: productId,
      title, description, price, category, condition,
      brand, year, color, origin, region, negotiable,
      body_type: bodyType,
      seats,
      battery_type: batteryType,
      capacity,
      city: location?.city,
      district: location?.district,
      ward: location?.ward,
      address: location?.address,
      contact_name: contact?.name,
      contact_phone: contact?.phone,
      user_id: req.user?.id, // From auth middleware
      status,
      created_at: new Date()
    };
    
    await db.products.insert(productData);
    
    // Insert images
    const imageInserts = imageUrls.map((url, index) => ({
      product_id: productId,
      image_url: url,
      image_order: index
    }));
    
    await db.product_images.insertMany(imageInserts);
    
    res.status(201).json({
      success: true,
      data: {
        id: productId,
        title,
        imageUrls,
        createdAt: productData.created_at
      },
      message: 'Tạo sản phẩm thành công'
    });
    
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    });
  }
};
```

## 4. Validation Rules

### Required Fields
- `title` (min: 30 chars)
- `description` (min: 100 chars)
- `price` (number > 0)
- `category` (enum: car, electric, battery)
- `imageUrls` (array, min length: 1, max: 10)
- `contact.name`
- `contact.phone`

### Image URL Validation
```javascript
const validateImageUrls = (urls) => {
  const supabasePattern = /^https:\/\/.*\.supabase\.co\/storage\/v1\/object\/public\/product-images\/.+$/;
  
  return urls.every(url => {
    return typeof url === 'string' && 
           url.length > 0 && 
           supabasePattern.test(url);
  });
};
```

## 5. Security Considerations

1. **Authentication**: Yêu cầu user đăng nhập
2. **Rate limiting**: Giới hạn số sản phẩm đăng/ngày
3. **Image validation**: Kiểm tra URLs từ Supabase domain
4. **Input sanitization**: Clean HTML/JS khỏi description
5. **Price validation**: Kiểm tra giá hợp lý

## 6. Frontend Integration

Khi gọi từ frontend:
```javascript
const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(productData)
});
```

## 7. Testing

### Test Cases
- ✅ Tạo sản phẩm với đầy đủ thông tin
- ❌ Tạo sản phẩm thiếu title
- ❌ Tạo sản phẩm không có images
- ❌ Images URLs không hợp lệ
- ❌ Price âm hoặc 0
- ✅ Category-specific fields (bodyType cho car, etc.)

### Sample cURL
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @product_sample.json
```