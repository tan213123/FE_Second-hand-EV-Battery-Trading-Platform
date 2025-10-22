# 💰 Admin Cập Nhật Giá - Tích Hợp Backend API

## 📋 Tổng quan

Admin có thể **chỉnh sửa giá gói dịch vụ** và **đẩy giá mới lên backend** thông qua các API endpoint. Hệ thống sẽ tự động lưu thay đổi vào database và cập nhật UI real-time.

---

## 🔄 Flow Cập Nhật Giá

### 1️⃣ **Khi Admin click "Sửa" một gói**

```javascript
// Dòng 102-114: fees.jsx
const startEdit = (pkg) => {
  setEditing(pkg.id);
  setForm({
    name: pkg.name,
    price: pkg.price,        // ← Lấy giá hiện tại từ database
    duration: pkg.duration,
    icon: pkg.icon,
    features: pkg.features,
    color: pkg.color,
    popular: pkg.popular
  });
  setShowModal(true);
};
```

✅ **Form hiển thị giá hiện tại** từ database

---

### 2️⃣ **Admin thay đổi giá trong form**

```jsx
<div className="form-group">
  <label>Giá (VND)</label>
  <input
    type="number"
    value={form.price}
    onChange={e => setForm(prev => ({ 
      ...prev, 
      price: e.target.value    // ← Admin nhập giá mới
    }))}
    placeholder="VD: 150000"
  />
</div>
```

---

### 3️⃣ **Admin click "Lưu" → GỌI API**

```javascript
// Dòng 176-251: fees.jsx
const save = async () => {
  if (!form.name || !form.price || !form.duration) {
    alert('Vui lòng nhập đầy đủ thông tin gói');
    return;
  }

  const packageData = {
    name: form.name,
    type: form.type || 'custom',
    price: Number(form.price),    // ← Giá mới
    duration: form.duration,
    icon: form.icon,
    features: form.features,
    color: form.color,
    popular: form.popular,
    active: true
  };

  try {
    setLoading(true);
    
    if (editing === 'new') {
      // ✅ TẠO GÓI MỚI - POST /packages
      const response = await api.post('/packages', packageData);
      console.log('✅ Gói mới được tạo:', response.data);
      
      setPackages(prev => [...prev, response.data]);
      alert('✅ Tạo gói mới thành công!');
      
    } else {
      // ✅ CẬP NHẬT GIÁ - PUT /packages/:id
      const response = await api.put(`/packages/${editing}`, packageData);
      console.log('✅ Giá gói được cập nhật:', response.data);
      
      // Cập nhật state với giá mới từ API
      setPackages(prev => prev.map(p => p.id === editing ? {
        ...p,
        ...packageData,
        id: p.id
      } : p));
      
      alert('✅ Cập nhật giá thành công! Giá mới đã được lưu vào hệ thống.');
    }
    
    cancel();
  } catch (error) {
    console.error('❌ Lỗi khi lưu gói:', error);
    alert(`❌ Lỗi: ${error.message}\n\nĐang lưu tạm thời vào local...`);
    
    // Fallback: lưu vào state local nếu API lỗi
    setPackages(prev => prev.map(p => p.id === editing ? {
      ...p,
      ...packageData
    } : p));
  } finally {
    setLoading(false);
  }
};
```

---

## 🌐 API Endpoints

### **Base URL**
```javascript
baseURL: "http://14.225.206.98:8080/api"
```

### **1. Lấy danh sách gói**
```http
GET /packages
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "pkg1",
    "name": "Gói Pro",
    "type": "pro",
    "price": 150000,
    "duration": "30 ngày",
    "icon": "👑",
    "features": [
      { "text": "Đăng 10 tin", "included": true },
      { "text": "Hiển thị 30 ngày", "included": true }
    ],
    "color": "#3b82f6",
    "popular": true,
    "active": true
  }
]
```

---

### **2. Tạo gói mới**
```http
POST /packages
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Gói VIP",
  "type": "vip",
  "price": 500000,
  "duration": "90 ngày",
  "icon": "💎",
  "features": [
    { "text": "Đăng không giới hạn", "included": true },
    { "text": "Hỗ trợ 24/7", "included": true }
  ],
  "color": "#8b5cf6",
  "popular": false,
  "active": true
}
```

**Response:**
```json
{
  "id": "pkg4",
  "name": "Gói VIP",
  "price": 500000,
  ...
}
```

---

### **3. Cập nhật giá gói (PUT)**
```http
PUT /packages/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Gói Pro",
  "type": "pro",
  "price": 200000,        // ← GIÁ MỚI
  "duration": "30 ngày",
  "icon": "👑",
  "features": [...],
  "color": "#3b82f6",
  "popular": true,
  "active": true
}
```

**Response:**
```json
{
  "id": "pkg2",
  "name": "Gói Pro",
  "price": 200000,        // ← GIÁ ĐÃ CẬP NHẬT
  "updatedAt": "2025-10-22T10:30:00Z"
}
```

---

### **4. Xóa gói (DELETE)**
```http
DELETE /packages/{id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Package deleted successfully",
  "id": "pkg3"
}
```

---

### **5. Cập nhật trạng thái (PATCH)**
```http
PATCH /packages/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "active": false      // Bật/tắt gói
}
```

---

## 🎯 Tính năng chính

### ✅ **1. Tự động lưu vào Database**
- Khi admin chỉnh giá → **Gọi API PUT** `/packages/{id}`
- Giá mới được **lưu vào database backend**
- UI tự động cập nhật sau khi API thành công

### ✅ **2. Loading State**
```jsx
{loading && (
  <div className="loading-overlay">
    <div className="spinner"></div>
    <p>Đang xử lý...</p>
  </div>
)}
```

### ✅ **3. Error Handling**
```javascript
catch (error) {
  console.error('❌ Lỗi:', error);
  alert(`❌ Lỗi: ${error.message}\n\nĐang lưu tạm thời...`);
  
  // Fallback: lưu vào state local
  setPackages(prev => prev.map(...));
}
```

### ✅ **4. Success Notification**
```javascript
alert('✅ Cập nhật giá thành công! Giá mới đã được lưu vào hệ thống.');
```

---

## 🧪 Test Flow

### **Test 1: Cập nhật giá thành công**

1. **Login admin:**
   - Email: `admin@admin.com`
   - Password: `admin123`

2. **Vào Admin Page:**
   ```
   http://localhost:5173/admin
   ```

3. **Click "Quản lý gói dịch vụ"**

4. **Click "Sửa" ở gói "Gói Pro"**

5. **Thay đổi giá:**
   - Giá cũ: `150,000 VND`
   - Giá mới: `200,000 VND`

6. **Click "Lưu"**

7. **Kiểm tra:**
   - ✅ Hiện loading spinner
   - ✅ Console log: `✅ Giá gói được cập nhật: {...}`
   - ✅ Alert: "Cập nhật giá thành công!"
   - ✅ UI hiển thị `200,000đ`
   - ✅ Refresh trang → Giá vẫn là `200,000đ` (đã lưu vào DB)

---

### **Test 2: API lỗi (Fallback)**

1. **Tắt backend server** (hoặc sai endpoint)

2. **Thay đổi giá và click "Lưu"**

3. **Kiểm tra:**
   - ✅ Console log: `❌ Lỗi khi lưu gói: ...`
   - ✅ Alert: "❌ Lỗi: ... Đang lưu tạm thời vào local..."
   - ✅ UI vẫn cập nhật (fallback to local state)
   - ❌ Refresh trang → Giá quay về giá cũ (chưa lưu vào DB)

---

### **Test 3: Thêm gói mới**

1. **Click "➕ Thêm gói mới"**

2. **Nhập thông tin:**
   ```
   Tên gói: Gói VIP
   Loại gói: vip
   Giá: 500000
   Thời hạn: 90 ngày
   Icon: 💎
   ```

3. **Click "Lưu"**

4. **Kiểm tra:**
   - ✅ API POST `/packages` được gọi
   - ✅ Gói mới xuất hiện trong danh sách
   - ✅ Giá hiển thị đúng: `500,000đ`

---

## 📊 Monitoring & Logs

### **Console Logs**

```javascript
// Khi fetch packages
console.log('Error fetching packages:', error);

// Khi tạo gói mới
console.log('✅ Gói mới được tạo:', response.data);

// Khi cập nhật giá
console.log('✅ Giá gói được cập nhật:', response.data);

// Khi xóa gói
console.log('✅ Gói đã được xóa:', id);

// Khi toggle active
console.log('✅ Trạng thái gói được cập nhật:', id);
```

### **Network Tab**

```
Request URL: http://14.225.206.98:8080/api/packages/pkg2
Request Method: PUT
Status Code: 200 OK

Request Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json

Request Payload:
  {
    "name": "Gói Pro",
    "price": 200000,
    ...
  }

Response:
  {
    "id": "pkg2",
    "price": 200000,
    "updatedAt": "2025-10-22T10:30:00Z"
  }
```

---

## 🔐 Authorization

Tất cả API requests đều **tự động thêm Bearer token** từ localStorage:

```javascript
// src/config/api.jsx
api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }
);
```

---

## 🛠️ Files Modified

| File | Changes |
|------|---------|
| `src/pages/adminPage/fees.jsx` | ✅ Added `useEffect` to fetch packages<br>✅ Added `fetchPackages()` async function<br>✅ Modified `save()` to call API<br>✅ Modified `remove()` to call API<br>✅ Modified `toggleActive()` to call API<br>✅ Added loading & error states<br>✅ Added loading overlay & error message UI |
| `src/pages/adminPage/fees.scss` | ✅ Added `.loading-overlay` styles<br>✅ Added `.spinner` animation<br>✅ Added `.error-message` styles |
| `src/config/api.jsx` | ✅ Already configured with Bearer token interceptor |

---

## 🎉 Summary

✅ **Admin chỉnh giá** → **API PUT** `/packages/{id}` → **Lưu vào database**

✅ **Giá mới được đẩy lên backend** và persist sau khi refresh

✅ **Loading state** hiển thị khi đang xử lý

✅ **Error handling** với fallback to local state

✅ **Success notification** khi cập nhật thành công

---

## 📝 Next Steps

Nếu backend chưa có endpoint `/packages`, cần:

1. **Tạo API endpoints** cho:
   - `GET /packages` - Lấy danh sách
   - `POST /packages` - Tạo mới
   - `PUT /packages/:id` - Cập nhật
   - `DELETE /packages/:id` - Xóa
   - `PATCH /packages/:id` - Cập nhật status

2. **Database schema** cần có bảng `packages` với các trường:
   - `id` (primary key)
   - `name`
   - `type`
   - `price` ← **GIÁ**
   - `duration`
   - `icon`
   - `features` (JSON)
   - `color`
   - `popular`
   - `active`
   - `createdAt`
   - `updatedAt`

3. **Permissions** - Chỉ admin mới có quyền tạo/sửa/xóa gói

