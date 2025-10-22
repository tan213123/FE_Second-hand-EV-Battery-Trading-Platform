# 🧪 Test Admin Cập Nhật Giá - Hướng dẫn Chi tiết

## 📋 Mục đích

Hướng dẫn test tính năng **Admin chỉnh giá và đẩy giá mới lên backend**.

---

## 🚀 Chuẩn bị

### 1. Khởi động project
```bash
npm run dev
```

### 2. Mở Browser DevTools
- **F12** hoặc **Right Click → Inspect**
- Chuyển sang tab **Console** để xem logs
- Chuyển sang tab **Network** để xem API requests

---

## ✅ Test Case 1: Cập nhật giá thành công

### **Bước 1: Login với tài khoản Admin**

1. Mở: `http://localhost:5173/login`
2. Nhập thông tin:
   ```
   📧 Email: admin@admin.com
   🔒 Password: admin123
   ```
3. Click **"Đăng nhập"**
4. Tự động redirect đến: `http://localhost:5173/admin`

---

### **Bước 2: Vào Quản lý gói dịch vụ**

1. Click tab **"Quản lý gói dịch vụ"** ở sidebar
2. Xem danh sách các gói hiện có
3. Ghi nhớ **giá hiện tại** của gói cần test (VD: Gói Pro = `150,000đ`)

---

### **Bước 3: Chỉnh sửa giá**

1. Click nút **"✏️ Sửa"** ở gói "Gói Pro"
2. Modal hiện ra với form chỉnh sửa
3. Thay đổi giá:
   ```
   Giá cũ: 150000
   Giá mới: 250000  ← Đổi sang giá mới
   ```
4. Giữ nguyên các field khác
5. Click **"Lưu"**

---

### **Bước 4: Kiểm tra kết quả**

#### **✅ UI Response**
- ✅ Hiện **loading spinner** với text "Đang xử lý..."
- ✅ Loading overlay phủ toàn màn hình
- ✅ Sau 1-2s, hiện **alert**: 
  ```
  ✅ Cập nhật giá thành công! Giá mới đã được lưu vào hệ thống.
  ```
- ✅ Modal tự động đóng
- ✅ Card gói hiển thị **giá mới**: `250,000đ`

#### **✅ Console Logs**
Mở **DevTools → Console**, kiểm tra:
```javascript
✅ Giá gói được cập nhật: {
  id: "pkg2",
  name: "Gói Pro",
  price: 250000,
  updatedAt: "2025-10-22T10:30:00Z",
  ...
}
```

#### **✅ Network Requests**
Mở **DevTools → Network**, tìm request:
```
Request URL: http://14.225.206.98:8080/api/packages/pkg2
Request Method: PUT
Status Code: 200 OK

Request Payload:
{
  "name": "Gói Pro",
  "type": "pro",
  "price": 250000,    ← GIÁ MỚI
  "duration": "30 ngày",
  "icon": "👑",
  "features": [...],
  "color": "#3b82f6",
  "popular": true,
  "active": true
}

Response:
{
  "id": "pkg2",
  "price": 250000,
  "updatedAt": "2025-10-22T10:30:00Z"
}
```

---

### **Bước 5: Verify Data Persistence**

1. **Refresh trang** (F5)
2. Kiểm tra:
   - ✅ Gói "Gói Pro" vẫn hiển thị giá **250,000đ**
   - ✅ Giá không quay về giá cũ
   - ✅ Data đã được lưu vào database

3. **Logout và Login lại**
4. Vào "Quản lý gói dịch vụ"
5. Kiểm tra:
   - ✅ Giá vẫn là **250,000đ**

---

## ✅ Test Case 2: Thêm gói mới

### **Bước 1: Click "➕ Thêm gói mới"**

1. Ở trang "Quản lý gói dịch vụ"
2. Click nút **"➕ Thêm gói mới"** ở góc phải trên
3. Modal "Thêm gói mới" hiện ra

---

### **Bước 2: Nhập thông tin gói mới**

```
Tên gói: Gói VIP
Loại gói: custom
Giá (VND): 500000
Thời hạn: 90 ngày
Icon (Emoji): 💎 (chọn từ dropdown)
Màu sắc: #8b5cf6
☑️ Đánh dấu là "Phổ biến nhất"
```

**Thêm tính năng:**
1. Nhập: "Đăng không giới hạn tin"
2. ✅ Check "Có"
3. Click "Thêm tính năng"

4. Nhập: "Hỗ trợ 24/7"
5. ✅ Check "Có"
6. Click "Thêm tính năng"

---

### **Bước 3: Lưu gói mới**

1. Click **"Lưu"**
2. Kiểm tra:
   - ✅ Hiện loading spinner
   - ✅ Console log: `✅ Gói mới được tạo: {...}`
   - ✅ Alert: "✅ Tạo gói mới thành công!"
   - ✅ Gói mới xuất hiện trong danh sách
   - ✅ Giá hiển thị: **500,000đ**
   - ✅ Badge "⭐ Phổ biến nhất" xuất hiện

---

### **Bước 4: Verify Network**

**DevTools → Network:**
```
Request URL: http://14.225.206.98:8080/api/packages
Request Method: POST
Status Code: 201 Created

Request Payload:
{
  "name": "Gói VIP",
  "type": "custom",
  "price": 500000,    ← GIÁ MỚI
  "duration": "90 ngày",
  "icon": "💎",
  "features": [
    { "text": "Đăng không giới hạn tin", "included": true },
    { "text": "Hỗ trợ 24/7", "included": true }
  ],
  "color": "#8b5cf6",
  "popular": true,
  "active": true
}

Response:
{
  "id": "pkg4",
  "name": "Gói VIP",
  "price": 500000,
  "createdAt": "2025-10-22T10:35:00Z"
}
```

---

## ✅ Test Case 3: Xóa gói

### **Bước 1: Click "🗑️ Xóa"**

1. Chọn gói cần xóa (VD: Gói VIP vừa tạo)
2. Click nút **"🗑️ Xóa"**
3. Confirm dialog hiện ra: "Bạn có chắc muốn xóa gói này không?"
4. Click **OK**

---

### **Bước 2: Kiểm tra kết quả**

- ✅ Hiện loading spinner
- ✅ Console log: `✅ Gói đã được xóa: pkg4`
- ✅ Alert: "✅ Xóa gói thành công!"
- ✅ Gói biến mất khỏi danh sách

**Network:**
```
Request URL: http://14.225.206.98:8080/api/packages/pkg4
Request Method: DELETE
Status Code: 200 OK

Response:
{
  "message": "Package deleted successfully",
  "id": "pkg4"
}
```

---

## ✅ Test Case 4: Bật/Tắt gói

### **Bước 1: Click "🔴 Tắt"**

1. Chọn gói đang active (VD: Gói Pro)
2. Click nút **"🔴 Tắt"**
3. Không cần confirm

---

### **Bước 2: Kiểm tra kết quả**

- ✅ Hiện loading spinner ngắn
- ✅ Console log: `✅ Trạng thái gói được cập nhật: pkg2`
- ✅ Nút đổi sang **"🟢 Bật"**
- ✅ Card gói có badge **"Đã tắt"** màu xám
- ✅ Card gói có opacity giảm (mờ hơn)

**Network:**
```
Request URL: http://14.225.206.98:8080/api/packages/pkg2
Request Method: PATCH
Status Code: 200 OK

Request Payload:
{
  "active": false
}
```

---

### **Bước 3: Bật lại**

1. Click **"🟢 Bật"**
2. Kiểm tra:
   - ✅ Badge "Đã tắt" biến mất
   - ✅ Card gói trở lại bình thường
   - ✅ Nút đổi lại thành **"🔴 Tắt"**

---

## ❌ Test Case 5: API Lỗi (Fallback)

### **Scenario 1: Backend không hoạt động**

1. **Tắt backend server** (hoặc sửa baseURL sai trong `api.jsx`)
2. Thử cập nhật giá gói
3. Kiểm tra:
   - ✅ Hiện loading spinner
   - ✅ Console log: `❌ Lỗi khi lưu gói: Network Error`
   - ✅ Alert: 
     ```
     ❌ Lỗi: Network Error
     
     Đang lưu tạm thời vào local...
     ```
   - ✅ UI vẫn cập nhật (fallback to local state)
   - ⚠️ Error message hiển thị ở top:
     ```
     ⚠️ Không thể tải danh sách gói. Sử dụng dữ liệu mặc định.
     ```

4. **Refresh trang**
5. Kiểm tra:
   - ❌ Giá quay về giá cũ (chưa lưu vào database)
   - ✅ Error message vẫn hiển thị

---

### **Scenario 2: Token hết hạn**

1. Xóa token trong localStorage:
   ```javascript
   // Console DevTools
   localStorage.removeItem('token');
   ```

2. Thử cập nhật giá gói
3. Kiểm tra:
   - ✅ API response: `401 Unauthorized`
   - ✅ Alert: "❌ Lỗi: Unauthorized"
   - ✅ Redirect về trang login (tùy cấu hình interceptor)

---

### **Scenario 3: Validation lỗi**

1. Click "➕ Thêm gói mới"
2. **Bỏ trống** field "Giá (VND)"
3. Click "Lưu"
4. Kiểm tra:
   - ✅ Alert: "Vui lòng nhập đầy đủ thông tin gói"
   - ✅ KHÔNG gọi API
   - ✅ Modal vẫn mở

---

## 📊 Checklist tổng hợp

### **API Integration**
- [ ] GET `/packages` - Tải danh sách khi component mount
- [ ] POST `/packages` - Tạo gói mới
- [ ] PUT `/packages/:id` - Cập nhật giá gói
- [ ] DELETE `/packages/:id` - Xóa gói
- [ ] PATCH `/packages/:id` - Cập nhật status

### **UI/UX**
- [ ] Loading spinner hiển thị khi đang xử lý
- [ ] Alert thông báo success/error
- [ ] Error message hiển thị khi API lỗi
- [ ] Button disabled khi đang loading
- [ ] Modal đóng sau khi save thành công

### **Data Persistence**
- [ ] Refresh trang → Giá vẫn giữ nguyên
- [ ] Logout → Login lại → Giá vẫn giữ nguyên
- [ ] Multiple tabs → Giá sync sau khi refresh

### **Error Handling**
- [ ] Backend offline → Fallback to local state + hiện error
- [ ] Token hết hạn → Redirect về login
- [ ] Validation lỗi → Hiện alert, không gọi API
- [ ] Network timeout → Hiện error message

---

## 🔍 Debugging Tips

### **Nếu API không được gọi:**

1. Kiểm tra **Network tab** có request không
2. Kiểm tra **Console** có error không
3. Verify **token** trong localStorage:
   ```javascript
   localStorage.getItem('token')
   ```
4. Verify **baseURL** trong `src/config/api.jsx`:
   ```javascript
   baseURL: "http://14.225.206.98:8080/api"
   ```

---

### **Nếu giá không update:**

1. Kiểm tra **API response** có trả về data không
2. Kiểm tra **state update** trong `setPackages()`
3. Kiểm tra **re-render** component (add console.log)
4. Verify **ID match** giữa editing và package.id

---

### **Nếu loading spinner không hiện:**

1. Kiểm tra `loading` state có được set true không
2. Kiểm tra CSS của `.loading-overlay`
3. Kiểm tra `z-index` của loading overlay (phải > modal)

---

## 📝 Expected Console Output

### **Khi load trang:**
```javascript
// Initial fetch
Error fetching packages: {message: "Network Error"}
⚠️ Không thể tải danh sách gói. Sử dụng dữ liệu mặc định.
```

### **Khi cập nhật giá:**
```javascript
✅ Giá gói được cập nhật: {
  id: "pkg2",
  name: "Gói Pro",
  price: 250000,
  updatedAt: "2025-10-22T10:30:00Z",
  ...
}
```

### **Khi có lỗi:**
```javascript
❌ Lỗi khi lưu gói: Error: Request failed with status code 500
```

---

## 🎯 Success Criteria

✅ **Admin có thể:**
1. Xem danh sách gói từ backend
2. Chỉnh sửa giá gói
3. Giá mới được đẩy lên backend (API PUT)
4. Giá mới persist sau khi refresh
5. Thêm gói mới với giá tùy chỉnh
6. Xóa gói (soft delete hoặc hard delete)
7. Bật/tắt gói

✅ **System:**
1. Loading state hiển thị đúng
2. Error handling hoạt động tốt
3. Fallback to local state khi API lỗi
4. Data sync giữa UI và backend
5. Authorization header tự động thêm vào mọi request

---

## 📞 Support

Nếu gặp lỗi, kiểm tra:
1. `ADMIN_PRICE_UPDATE_API.md` - Tài liệu API chi tiết
2. `src/pages/adminPage/fees.jsx` - Source code
3. Console logs và Network tab
4. Backend server có đang chạy không
5. Database có bảng `packages` không

---

**Happy Testing! 🎉**

