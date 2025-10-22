# Hướng dẫn Tính năng Admin

## 🎯 Tổng quan

Admin có đầy đủ quyền quản lý hệ thống qua trang `/admin` với các chức năng:

---

## 1. 📝 DUYỆT BÀI ĐĂNG (Posts Management)

### Tính năng có sẵn:

#### ✅ **Duyệt/Từ chối bài đăng**
- **Duyệt 1 bài:** Click nút "Duyệt" trên từng bài
- **Từ chối 1 bài:** Click nút "Từ chối" trên từng bài
- **Duyệt nhiều bài:** Chọn checkbox → Click "Duyệt đã chọn"
- **Từ chối nhiều bài:** Chọn checkbox → Click "Từ chối đã chọn"

#### 🔍 **Filter & Search**
- Filter theo trạng thái:
  - **Tất cả** - Hiển thị tất cả bài đăng
  - **Chờ duyệt** (Pending) - Bài chưa được xử lý
  - **Đã duyệt** (Approved) - Bài đã được chấp nhận
  - **Từ chối** (Rejected) - Bài bị từ chối
- Tìm kiếm theo: ID, tiêu đề, địa điểm, member ID

#### 📊 **Thống kê**
- Hiển thị số lượng bài theo từng trạng thái
- Tổng số bài đăng

#### 🎨 **Hiển thị**
- Badge màu sắc cho từng trạng thái:
  - 🟡 Vàng - Chờ duyệt
  - 🟢 Xanh - Đã duyệt  
  - 🔴 Đỏ - Từ chối
- Table với pagination
- Sort theo các cột

---

## 2. 💰 QUẢN LÝ GÓI DỊCH VỤ (Package Management)

### Tính năng có sẵn:

#### ➕ **Thêm gói mới**
Click "Thêm gói mới" → Điền form:
- Tên gói (VD: Gói VIP)
- Loại gói (Standard/Pro/Đấu giá/Tùy chỉnh)
- Giá (VND)
- Thời hạn (VD: 30 ngày)
- Icon (chọn emoji)
- Màu sắc (color picker)
- Đánh dấu "Phổ biến nhất"
- Thêm các tính năng (features):
  - Nhập tính năng
  - Chọn "Bao gồm" hoặc không
  - Click "Thêm"

#### ✏️ **Chỉnh sửa gói**
- Click nút "Sửa" trên gói cần chỉnh sửa
- Form hiện lên với thông tin hiện tại
- Chỉnh sửa bất kỳ field nào
- Thêm/xóa features
- Click "Lưu"

#### 🗑️ **Xóa gói**
- Click nút "Xóa" trên gói cần xóa
- Confirm → Gói bị xóa

#### 🔘 **Bật/Tắt gói**
- Toggle switch "Kích hoạt/Tắt"
- Gói tắt sẽ có badge "Đã tắt"
- Gói tắt không hiển thị cho user

#### 🎨 **Tùy chỉnh hiển thị**
- Chọn icon từ 6 emoji có sẵn
- Chọn màu sắc tùy ý
- Đánh dấu "Gói phổ biến nhất" (có badge ⭐)

---

## 3. 📊 THỐNG KÊ & BÁO CÁO (Reports)

### Tính năng có sẵn:

#### 📅 **Filter theo thời gian**
- Chọn năm
- Chọn tháng cụ thể
- Chọn chế độ xem:
  - **Theo năm** - Xem tổng quan cả năm
  - **Theo tháng** - Xem chi tiết từng tháng

#### 📈 **Các biểu đồ**

**1. Biểu đồ cột - Tổng quan hoạt động**
- Số người dùng mới
- Số bài đăng
- Số gói đã bán
- So sánh theo tháng

**2. Biểu đồ tròn - Phân bố loại bài**
- Xe điện
- Pin EV
- Phụ kiện
- Khác

**3. Biểu đồ đường - Xu hướng đăng ký**
(Chỉ hiện ở chế độ xem năm)
- Theo dõi xu hướng đăng ký user theo tháng

**4. Biểu đồ doanh thu**
- Doanh thu từ gói dịch vụ theo tháng
- Biểu đồ cột màu xanh

#### 📋 **Thống kê tổng quan**
Cards hiển thị:
- 👥 Tổng người dùng
- 📝 Tổng bài đăng
- 💰 Doanh thu (tháng/năm)
- 📦 Gói đã bán

---

## 4. 👥 QUẢN LÝ NGƯỜI DÙNG (User Management)

### Tính năng có sẵn:

#### 🚫 **Block/Unblock User**
- **Block 1 user:** Click "Chặn" → Nhập lý do → Confirm
- **Unblock 1 user:** Click "Bỏ chặn"
- **Block nhiều user:** Chọn checkbox → Click "Chặn đã chọn"
- **Unblock nhiều user:** Chọn checkbox → Click "Bỏ chặn đã chọn"

#### 🔍 **Filter & Search**
- Filter theo trạng thái:
  - Tất cả
  - Hoạt động (Active)
  - Bị chặn (Blocked)
- Tìm kiếm theo: ID, tên, email, số điện thoại

#### 📊 **Thông tin hiển thị**
- Member ID
- Tên
- Email  
- Số điện thoại
- Trạng thái (Active/Blocked)
- Số bài đăng
- Số vi phạm
- Lý do chặn (nếu bị chặn)
- Ngày tạo

#### 🎨 **Badge trạng thái**
- 🟢 Xanh - Hoạt động
- 🔴 Đỏ - Bị chặn

---

## 🚀 Cách sử dụng

### Bước 1: Truy cập Admin Panel

**Option 1: Từ Header**
```
1. Login vào hệ thống
2. Click avatar (góc phải trên)
3. Click "⚙️ Quản trị Admin"
4. → Redirect đến /admin
```

**Option 2: URL trực tiếp**
```
Vào: http://localhost:5173/admin
```

### Bước 2: Chọn chức năng

Sidebar bên trái có 4 tab:
- 📊 **Thống kê & Báo cáo** - Xem dashboard
- 💰 **Quản lý gói dịch vụ** - Thêm/sửa/xóa gói
- 📝 **Duyệt bài đăng** - Approve/reject posts
- 👤 **Quản lý người dùng** - Block/unblock users

---

## 📝 Demo Data

### Bài đăng mẫu:
```javascript
- POST001: Xe điện cũ - Like new (Chờ duyệt)
- POST002: Bán pin EV 48V (Chờ duyệt)
- POST003: Trao đổi 60Ah (Đã duyệt)
- POST004: Pin lithium 72V (Từ chối)
```

### Gói dịch vụ mẫu:
```javascript
- Gói Tiêu chuẩn: 50,000đ / 15 ngày
- Gói Pro: 150,000đ / 30 ngày (Phổ biến)
- Gói Đấu giá: 500,000đ / 90 ngày
```

### User mẫu:
```javascript
- Nguyễn Văn A (Active, 5 bài đăng)
- Trần Thị B (Active, 12 bài đăng)  
- Lê Văn C (Blocked, 3 vi phạm)
- Phạm Thị D (Active, 0 bài đăng)
```

---

## 🎯 Workflow thực tế

### Duyệt bài đăng:
```
1. Vào tab "Duyệt bài đăng"
2. Click filter "Chờ duyệt"
3. Xem danh sách bài chờ duyệt
4. Đọc thông tin bài: tiêu đề, giá, địa điểm
5. Quyết định:
   - ✅ Click "Duyệt" nếu hợp lệ
   - ❌ Click "Từ chối" nếu vi phạm
6. Bài được cập nhật trạng thái ngay lập tức
```

### Quản lý gói dịch vụ:
```
1. Vào tab "Quản lý gói dịch vụ"
2. Xem danh sách gói hiện có
3. Để chỉnh sửa:
   - Click "Sửa" trên gói cần sửa
   - Modal hiện ra với form
   - Chỉnh sửa: tên, giá, thời hạn, features
   - Click "Lưu"
4. Để thêm gói mới:
   - Click "Thêm gói mới"
   - Điền đầy đủ thông tin
   - Thêm các features
   - Click "Lưu"
5. Để tắt gói:
   - Toggle switch "Tắt"
   - Gói sẽ không hiển thị cho user
```

### Quản lý user:
```
1. Vào tab "Quản lý người dùng"
2. Xem danh sách user
3. Nếu user vi phạm:
   - Click "Chặn"
   - Nhập lý do (VD: "Spam bài đăng")
   - Confirm
   - User bị block, không thể đăng bài
4. Để bỏ chặn:
   - Click "Bỏ chặn"
   - User có thể hoạt động lại
```

---

## ⚡ Features nổi bật

### Bulk Actions (Xử lý hàng loạt)
- Chọn nhiều items bằng checkbox
- Thực hiện action cho tất cả cùng lúc
- Tiết kiệm thời gian

### Real-time Update
- Không cần refresh page
- Cập nhật ngay sau mỗi action
- Badge và số liệu tự động cập nhật

### Responsive Design
- Hoạt động tốt trên mọi màn hình
- Table có scroll khi cần
- Modal đẹp và dễ sử dụng

### Search & Filter
- Tìm kiếm nhanh
- Filter theo nhiều tiêu chí
- Kết hợp search + filter

---

## 🔒 Bảo mật

**Hiện tại:**
- ❌ Chưa có protected route
- ❌ Ai cũng vào được `/admin`

**Khuyến nghị:**
- Nên thêm protected route
- Check role trước khi cho phép action
- Backend verify permissions

---

## 📞 Support

Nếu cần thêm tính năng hoặc gặp lỗi:
1. Check console log
2. Xem network tab
3. Kiểm tra data structure

---

**Version:** 1.0
**Last Updated:** October 2025

