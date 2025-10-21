# Test Frontend Integration với Backend

## Cách test flow hoàn chỉnh:

### 1. Test Upload Image + Submit Product

1. **Chạy dev server**:
   ```bash
   npm run dev
   ```

2. **Vào trang đăng tin**: http://localhost:5173/post-listing

3. **Điền form đầy đủ**:
   - Bước 1: Chọn danh mục (car/electric/battery)
   - Bước 2: Điền thông tin + **upload ảnh**
   - Bước 3: Điền địa chỉ
   - Bước 4: Thông tin liên hệ + Submit

4. **Kiểm tra Console**:
   - Xem URLs ảnh từ Supabase
   - Xem payload gửi lên BE
   - Xem response từ API

### 2. Payload gửi lên BE sẽ có dạng:

```json
{
  "title": "VinFast VF8 2023",
  "description": "Xe điện VinFast màu trắng...",
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
    "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/abc123.jpg",
    "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/def456.jpg"
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
  
  "createdAt": "2025-10-18T...",
  "status": "active"
}
```

### 3. Mock Backend Response (để test)

Nếu chưa có BE, có thể mock response:

```javascript
// Thêm vào productService.js để test
const MOCK_MODE = true; // Set false khi có BE thật

if (MOCK_MODE) {
  // Mock successful response
  await new Promise(resolve => setTimeout(resolve, 2000)); // Fake delay
  return { 
    data: { 
      id: 'product_' + Date.now(),
      title: productData.title,
      imageUrls: productData.images,
      createdAt: new Date().toISOString()
    }, 
    error: null 
  };
}
```

### 4. Verification Checklist

#### Frontend:
- [ ] Upload ảnh thành công lên Supabase Storage
- [ ] URLs ảnh hiển thị trong console log
- [ ] Form validation hoạt động
- [ ] Loading state hiển thị khi submit
- [ ] Success message hiển thị
- [ ] Redirect về trang quản lý

#### Backend Integration:
- [ ] POST /api/products endpoint sẵn sàng
- [ ] Database schema đã tạo
- [ ] Authentication middleware
- [ ] Validation logic
- [ ] Image URLs được lưu vào DB

#### End-to-end:
- [ ] Tạo sản phẩm thành công
- [ ] Ảnh hiển thị trong danh sách sản phẩm
- [ ] Tìm kiếm sản phẩm hoạt động
- [ ] Xem chi tiết sản phẩm

### 5. Debug Tips

#### Nếu API call fail:
1. Kiểm tra Network tab trong DevTools
2. Xem response status và message
3. Kiểm tra CORS settings
4. Verify authentication token

#### Nếu ảnh không hiển thị:
1. Kiểm tra Supabase Storage policies
2. Test URLs trực tiếp trong browser
3. Verify bucket public access
4. Check file permissions

#### Nếu form validation fail:
1. Xem console errors
2. Kiểm tra required fields
3. Verify image upload status
4. Test với dữ liệu minimal