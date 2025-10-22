# Admin Login Guide

## 📋 Tổng quan

Hệ thống login đã được cập nhật để hỗ trợ **role-based redirect** - tự động chuyển hướng user dựa trên vai trò sau khi đăng nhập thành công.

---

## 🎯 Tính năng

### 1. **Auto Redirect dựa trên Role**
   - ✅ **Admin** → Redirect về `/admin` (Trang quản trị)
   - ✅ **Member** → Redirect về `/` (Trang chủ)

### 2. **Demo Admin Account**
   - Tài khoản demo để test truy cập admin
   - Không cần call API backend
   - Check local trước khi gọi API

### 3. **API Integration**
   - Hỗ trợ backend trả về `role` trong response
   - Fallback về `member` nếu API không trả role
   - Lưu role vào localStorage và AuthContext

---

## 🔐 Demo Credentials

### Admin Account
```
Email:    admin@admin.com
Password: admin123
```

### Flow khi login Admin:
```
1. User nhập email = admin@admin.com
2. User nhập password = admin123
3. Click "Đăng nhập"
4. System check local → Đúng tài khoản admin demo
5. Lưu userData với role = 'admin'
6. Redirect về /admin
```

---

## 💻 Code Implementation

### File: `src/pages/loginPage/login.jsx`

#### Demo Admin Check
```javascript
// Demo Admin Account - kiểm tra trước khi call API
if (formData.email === 'admin@admin.com' && formData.password === 'admin123') {
  const adminData = {
    memberId: 'ADMIN001',
    name: 'Administrator',
    email: 'admin@admin.com',
    role: 'admin',
    status: 'active'
  };
  
  // Lưu vào AuthContext
  login(adminData, 'demo-admin-token');
  
  // Redirect về trang admin
  navigate('/admin', { replace: true });
  return;
}
```

#### API Login với Role
```javascript
// Call API login
const response = await api.post('/members/login', {
  email: formData.email,
  password: formData.password
});

// Lưu user data với role
const userData = {
  memberId: response.data.memberId,
  name: response.data.name,
  email: response.data.email,
  // ... other fields
  role: response.data.role || 'member' // Lấy role từ API
};

// Redirect dựa trên role
if (userData.role === 'admin') {
  navigate('/admin', { replace: true });
} else {
  navigate('/', { replace: true });
}
```

---

## 🧪 Testing

### Test Case 1: Login Admin Demo
```
Given: User ở trang /login
When: 
  - Nhập email: admin@admin.com
  - Nhập password: admin123
  - Click "Đăng nhập"
Then:
  - Redirect về /admin
  - LocalStorage có user với role = 'admin'
  - Console log: "Admin logged in successfully"
```

### Test Case 2: Login Member qua API
```
Given: User ở trang /login
When:
  - Nhập email: member@example.com
  - Nhập password: password123
  - API trả về role = 'member'
Then:
  - Redirect về /
  - LocalStorage có user với role = 'member'
  - Console log: "User logged in successfully"
```

### Test Case 3: Login Admin qua API
```
Given: Backend có account admin
When:
  - Nhập email: realadmin@system.com
  - API trả về role = 'admin'
Then:
  - Redirect về /admin
  - LocalStorage có user với role = 'admin'
```

---

## 📊 User Data Structure

### Admin User
```javascript
{
  memberId: 'ADMIN001',
  name: 'Administrator',
  email: 'admin@admin.com',
  role: 'admin',        // ← Key field
  status: 'active'
}
```

### Member User
```javascript
{
  memberId: 'MEM12345',
  name: 'John Doe',
  email: 'john@example.com',
  address: '123 Street',
  phone: '0123456789',
  yearOfBirth: 1990,
  sex: 'male',
  status: 'active',
  role: 'member'        // ← Key field (hoặc không có)
}
```

---

## 🎨 UI Features

### Demo Credentials Box
Hiển thị ngay trên trang login để user dễ test:

```jsx
<div className="demo-credentials-box">
  <div className="demo-header">
    <span className="demo-icon">🔑</span>
    <strong>Tài khoản demo Admin:</strong>
  </div>
  <div className="demo-info">
    <p>📧 Email: <code>admin@admin.com</code></p>
    <p>🔒 Password: <code>admin123</code></p>
  </div>
</div>
```

**Styling:**
- Gradient background (blue theme)
- Border với shadow
- Code tag cho credentials
- Icon visual cues

---

## 🔄 Flow Diagram

```
┌─────────────────┐
│  Login Page     │
│  /login         │
└────────┬────────┘
         │
         ▼
    Input email/password
         │
         ▼
    ┌───────────────────┐
    │ Is Demo Admin?    │
    │ (admin@admin.com) │
    └───┬───────────┬───┘
        │ Yes       │ No
        │           │
        ▼           ▼
   Local Auth   API Call
        │           │
        │           ▼
        │      Get role from API
        │           │
        └───────┬───┘
                │
                ▼
         ┌─────────────┐
         │ Check role  │
         └──┬──────┬───┘
            │      │
       admin│      │member
            │      │
            ▼      ▼
        /admin    /
```

---

## 🛠️ Backend Integration

### API Endpoint: `/members/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "memberId": "MEM12345",
  "name": "John Doe",
  "email": "user@example.com",
  "role": "admin",     // ← Backend cần trả về field này
  "status": "active",
  // ... other fields
}
```

### Role Values
- `"admin"` - Administrator (full access)
- `"member"` - Regular user (limited access)
- `null` or missing - Default to `"member"`

---

## 📝 Notes

1. **Demo Account chỉ check local** - Không gọi API, nhanh và offline
2. **API Backend cần trả về role** - Nếu không có sẽ default về `member`
3. **Replace navigation** - Sử dụng `replace: true` để không quay lại login page
4. **Console logging** - Để debug, có thể remove ở production
5. **Security** - Frontend redirect chỉ là UX, backend phải verify permissions

---

## 🚀 Future Enhancements

- [ ] Thêm nhiều roles (seller, buyer, moderator)
- [ ] Remember me functionality
- [ ] Auto logout khi token hết hạn
- [ ] Protected routes cho admin pages
- [ ] Role-based UI components
- [ ] Permission-based feature flags

---

## 🆘 Troubleshooting

### Issue: Không redirect về admin sau khi login
**Check:**
1. Console có log "Admin logged in successfully" không?
2. localStorage có `user` với `role: 'admin'` không?
3. Network tab có call API không? (demo account không call API)

### Issue: Login API không redirect về admin
**Check:**
1. API response có field `role: 'admin'` không?
2. Console log `userData` để xem structure
3. Check network response body

### Issue: Demo credentials box không hiển thị
**Check:**
1. File SCSS đã compile chưa?
2. Browser cache - hard refresh (Ctrl + Shift + R)
3. Inspect element để xem styles có apply không

---

## 📧 Contact

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ team dev.

---

**Last Updated:** October 2025
**Version:** 1.0

