# 🧪 Các bước test tiếp theo

## ✅ Hiện tại đang ở:
- Trang: `localhost:5174/admin` → "Quản lý gói dịch vụ"
- Trạng thái: ⚠️ API lỗi nhưng UI vẫn hoạt động (dùng defaultPackages)

---

## 📝 Test Case: SỬA GIÁ GÓI

### Bước 1: Click "✏️ Sửa" ở gói "Gói Pro"
- Gói hiện tại: **150,000đ** /30 ngày
- Click nút "✏️ Sửa" ở card màu vàng (có badge "Phổ biến nhất")

### Bước 2: Modal sẽ hiện ra
- Tiêu đề: "Chỉnh sửa gói"
- Form có các field:
  - Tên gói: "Gói Pro"
  - Loại gói: "pro"
  - **Giá (VND): 150000** ← ĐỔI SANG **250000**
  - Thời hạn: "30 ngày"
  - Icon: 👑
  - Features list

### Bước 3: Đổi giá
```
Giá cũ: 150000
Giá mới: 250000  ← Nhập số mới
```

### Bước 4: Click "Lưu"

---

## 🔍 Kết quả mong đợi:

### Scenario A: Nếu Backend ONLINE ✅
1. Hiện loading spinner
2. Gọi API: `PUT http://14.225.206.98:8080/api/packages/pkg2`
3. Alert: "✅ Cập nhật giá thành công! Giá mới đã được lưu vào hệ thống."
4. UI cập nhật: **250,000đ**
5. Console log: `✅ Giá gói được cập nhật: {...}`
6. Refresh trang → Giá vẫn **250,000đ** (đã lưu DB)

### Scenario B: Nếu Backend OFFLINE ⚠️ (Hiện tại)
1. Hiện loading spinner
2. Gọi API: `PUT http://14.225.206.98:8080/api/packages/pkg2`
3. API FAILED (Network Error)
4. Alert: 
   ```
   ❌ Lỗi: Request failed...
   
   Đang lưu tạm thời vào local...
   ```
5. UI vẫn cập nhật: **250,000đ** (local state)
6. Console log: `❌ Lỗi khi lưu gói: ...`
7. ⚠️ Refresh trang → Giá quay về **150,000đ** (chưa lưu DB)

---

## 🌐 Để test FULL FLOW (Backend online):

### Option 1: Dùng Mock API
```bash
npm install -D json-server

# Tạo db.json với mock data
# Chạy mock server:
npx json-server --watch db.json --port 8080
```

### Option 2: Đợi Backend team implement
Backend cần implement:
- `GET /api/packages` - Lấy danh sách
- `PUT /api/packages/:id` - Cập nhật giá
- `POST /api/packages` - Tạo mới
- `DELETE /api/packages/:id` - Xóa
- `PATCH /api/packages/:id` - Update status

---

## 📸 Screenshots cần capture:

1. ✅ **Trang hiện tại** (DONE - có warning)
2. 🔄 Modal "Chỉnh sửa gói" với giá mới
3. 🔄 Alert thông báo (success hoặc error)
4. 🔄 UI sau khi update (250,000đ)
5. 🔄 DevTools Console logs
6. 🔄 DevTools Network tab (PUT request)

---

**Tiếp tục test bằng cách click "✏️ Sửa" nhé!** 👆

