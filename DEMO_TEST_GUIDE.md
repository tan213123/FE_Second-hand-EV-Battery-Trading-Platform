# Demo & Test Guide - Trang Đăng Tin & Đấu Giá

## 🧪 Hướng dẫn test

### 1. Khởi động ứng dụng

```bash
npm run dev
```

Mở trình duyệt tại: `http://localhost:5174`

### 2. Test Trang Đăng Tin

#### Truy cập trang:
```
http://localhost:5174/post-listing
```

#### Test Cases:

**Test 1: Flow hoàn chỉnh - Đăng tin xe ô tô**
1. Bước 1: Chọn "Ô tô điện" → Nhấn "Tiếp tục"
2. Bước 2: Upload 3-5 ảnh xe → Nhấn "Tiếp tục"
3. Bước 3:
   - Tiêu đề: "VinFast VF8 Plus 2023 - Giá tốt"
   - Mô tả: Mô tả chi tiết về xe
   - Hãng: VinFast
   - Model: VF8 Plus
   - Năm: 2023
   - Tình trạng: "Như mới"
4. Bước 4:
   - Số km: 8500
   - Hộp số: Tự động
   - Màu sắc: Trắng
   - Số chỗ: 5 chỗ
5. Bước 5:
   - Giá: 250000000
   - Check "Có thể thương lượng"
   - Tỉnh: Hà Nội
   - Quận: Cầu Giấy
6. Bước 6:
   - Tên: Nguyễn Văn A
   - SĐT: 0123456789
   - Check "Đồng ý điều khoản"
   - Nhấn "Đăng tin"

**Test 2: Validation errors**
- Bước 1: Không chọn danh mục → Nhấn "Tiếp tục" → Hiện lỗi
- Bước 2: Không upload ảnh → Nhấn "Tiếp tục" → Hiện lỗi
- Bước 3: Để trống tiêu đề → Nhấn "Tiếp tục" → Hiện lỗi
- etc.

**Test 3: Đăng tin đấu giá**
1. Bước 1: Chọn "Xe máy điện" + Check "Đăng tin đấu giá"
2. Follow các bước như bình thường
3. Bước 5: Nhập "Giá khởi điểm" và "Thời gian kết thúc"
4. Submit

**Test 4: Upload ảnh**
- Upload 1 ảnh → OK
- Upload 10 ảnh → OK
- Upload 11 ảnh → Hiện lỗi "Tối đa 10 ảnh"
- Set ảnh thứ 3 làm ảnh chính → Ảnh di chuyển lên đầu
- Xóa ảnh → Ảnh biến mất

**Test 5: Quay lại bước trước**
- Điền form đến bước 4
- Nhấn "Quay lại"
- Kiểm tra data vẫn còn
- Tiếp tục điền

### 3. Test Trang Đấu Giá

#### Truy cập trang:
```
http://localhost:5174/auction
```

#### Test Cases:

**Test 1: Xem danh sách đấu giá**
- Kiểm tra hiển thị đầy đủ thông tin
- Kiểm tra countdown timer chạy đúng
- Kiểm tra badge "Sắp kết thúc" cho phiên < 3 giờ

**Test 2: Bộ lọc**
- Lọc theo "Ô tô điện" → Chỉ hiện ô tô
- Lọc theo "Đang đấu giá" → Chỉ hiện phiên active
- Sắp xếp theo "Giá cao đến thấp" → Kiểm tra thứ tự

**Test 3: Đấu giá sản phẩm**
1. Click "Đấu giá ngay" trên 1 sản phẩm
2. Modal hiện lên với thông tin đầy đủ
3. Nhập giá đấu thấp hơn giá hiện tại → Lỗi
4. Nhập giá đấu cao hơn → OK
5. Click "+5,000,000" → Giá tăng lên
6. Check "Cam kết mua" → Required
7. Click "Xác nhận" → Submit

**Test 4: Responsive**
- Resize browser xuống mobile size
- Kiểm tra layout responsive
- Test modal trên mobile

**Test 5: Empty state**
- Khi chưa có dữ liệu → Hiện "Chưa có phiên đấu giá"
- Click "Tạo đấu giá ngay" → Chuyển đến /post-listing

### 4. Test Integration với API

#### Mock API Response:

Nếu API chưa sẵn sàng, component sẽ dùng mock data có sẵn.

#### Test API Call:

**1. Test POST /api/posts (Đăng tin)**

```javascript
// Mở DevTools > Network tab
// Submit form đăng tin
// Kiểm tra request:
{
  method: 'POST',
  url: 'http://14.225.206.98:8080/api/posts',
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Bearer <token>'
  },
  body: FormData {
    images: [...],
    data: JSON.stringify({...})
  }
}
```

**2. Test GET /api/auctions (Danh sách đấu giá)**

```javascript
// Mở trang /auction
// Check request:
{
  method: 'GET',
  url: 'http://14.225.206.98:8080/api/auctions?category=all&status=active&sortBy=ending-soon'
}
```

**3. Test POST /api/auctions/:id/bid (Đặt giá đấu)**

```javascript
// Click "Đấu giá ngay" và submit
// Check request:
{
  method: 'POST',
  url: 'http://14.225.206.98:8080/api/auctions/1/bid',
  body: { amount: 285000000 }
}
```

### 5. Test CORS Issues

#### Nếu gặp lỗi CORS:

```
Access to XMLHttpRequest at 'http://14.225.206.98:8080/api/posts' 
from origin 'http://localhost:5174' has been blocked by CORS policy
```

**Giải pháp:**

1. **Tạm thời:** Dùng Vite proxy

```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://14.225.206.98:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
}
```

2. **Vĩnh viễn:** Yêu cầu backend thêm CORS headers

### 6. Browser Compatibility Test

Test trên các trình duyệt:
- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)

### 7. Performance Test

#### Kiểm tra:
1. Upload 10 ảnh lớn (>5MB mỗi ảnh) → Check loading time
2. Scroll danh sách đấu giá với 50+ items → Check performance
3. Multiple countdown timers → Check CPU usage

### 8. Accessibility Test

#### Checklist:
- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ Screen reader friendly
- ✅ Focus states visible
- ✅ Color contrast đạt chuẩn WCAG
- ✅ Alt text cho images

## 🎯 Test Scenarios

### Scenario 1: User muốn bán xe điện

1. User vào trang chủ
2. Click "Đăng tin" ở header
3. Chọn "Xe máy điện"
4. Upload 5 ảnh xe
5. Điền thông tin đầy đủ
6. Đặt giá 18,500,000 VNĐ
7. Chọn địa chỉ ở TP.HCM
8. Submit → Thành công

**Expected:**
- Alert "Đăng tin thành công!"
- Redirect về trang chủ "/"
- Tin đăng xuất hiện trong danh sách

### Scenario 2: User muốn đấu giá pin

1. User vào /auction
2. Lọc category = "Pin xe điện"
3. Tìm pin phù hợp
4. Click "Đấu giá ngay"
5. Nhập giá cao hơn giá hiện tại
6. Xác nhận đấu giá
7. Submit → Thành công

**Expected:**
- Alert "Đấu giá thành công!"
- Modal đóng lại
- Danh sách refresh với giá mới
- User trở thành người dẫn đầu

### Scenario 3: User tạo phiên đấu giá

1. User vào /post-listing
2. Chọn "Ô tô điện"
3. Check "Đăng tin đấu giá"
4. Upload ảnh và điền thông tin
5. Bước 5: Nhập giá khởi điểm 200,000,000
6. Chọn thời gian kết thúc: 7 ngày sau
7. Submit → Thành công

**Expected:**
- Phiên đấu giá được tạo
- Hiển thị trong trang /auction
- Countdown timer bắt đầu chạy

## 🐛 Known Issues & Workarounds

### Issue 1: CORS Error
**Workaround:** Dùng Vite proxy hoặc yêu cầu backend fix

### Issue 2: Image upload lớn
**Workaround:** Compress ảnh trước khi upload

### Issue 3: Token expired
**Workaround:** Auto logout và redirect về /login

## 📊 Test Coverage

- ✅ Component Rendering
- ✅ User Interactions
- ✅ Form Validation
- ✅ API Integration
- ✅ Error Handling
- ✅ Responsive Design
- ✅ Performance
- ⏳ Unit Tests (TODO)
- ⏳ E2E Tests (TODO)

## 🔍 Debug Tips

### 1. Check Console Logs

```javascript
// Trong PostListingPage
console.log('Form data:', formData)
console.log('Current step:', currentStep)

// Trong AuctionPage
console.log('Auctions:', auctions)
console.log('Selected auction:', selectedAuction)
```

### 2. React DevTools

- Install React DevTools extension
- Inspect component state
- Check props và state changes

### 3. Network Tab

- Check API requests
- Verify request payload
- Check response data

## ✅ Pre-deployment Checklist

- [ ] Tất cả test cases đều pass
- [ ] Không có console errors
- [ ] Responsive trên tất cả devices
- [ ] API integration hoạt động
- [ ] Error handling đầy đủ
- [ ] Loading states hiển thị đúng
- [ ] Form validation chính xác
- [ ] Images upload thành công
- [ ] Countdown timer chính xác
- [ ] CORS issues đã fix
- [ ] Performance tốt
- [ ] Code đã optimize
- [ ] README updated
- [ ] Comments đầy đủ

---

**Ready to deploy! 🚀**
