# Role-Based Authentication System

## 📋 Tổng quan

Hệ thống xác thực dựa trên role (vai trò) đã được tích hợp hoàn chỉnh vào ứng dụng, cho phép:
- ✅ Phân quyền truy cập dựa trên role (Admin/Member)
- ✅ Protected routes để bảo vệ trang admin
- ✅ Hiển thị UI phù hợp với từng role
- ✅ Auto redirect sau login dựa trên role

---

## 🎯 Các tính năng chính

### 1. **Protected Admin Route**
- Chỉ user với `role === 'admin'` mới truy cập được `/admin`
- Auto redirect về `/login` nếu chưa đăng nhập
- Auto redirect về `/` nếu không có quyền admin

### 2. **Role-Based UI**
- Link "Quản trị hệ thống" chỉ hiển thị cho admin
- Logout button trong admin panel
- Tên user hiển thị động trong header

### 3. **Login Flow với Role**
- Demo admin account: `admin@admin.com` / `admin123`
- API integration hỗ trợ role từ backend
- Auto redirect dựa trên role sau login

---

## 📁 Cấu trúc File

```
src/
├── utils/
│   └── authHelpers.js              # Auth utility functions
├── components/
│   ├── ProtectedRoute/
│   │   ├── ProtectedAdminRoute.jsx # Protected route component
│   │   └── index.js                # Export file
│   └── Header/
│       └── index.jsx                # Header với admin link
├── pages/
│   ├── adminPage/
│   │   ├── index.jsx                # Admin page với logout
│   │   └── index.scss               # Admin styling với logout btn
│   └── loginPage/
│       ├── login.jsx                # Login với role check
│       └── login.scss               # Login styling với demo box
└── App.jsx                          # Router config với protected route
```

---

## 🔐 Auth Helpers (`src/utils/authHelpers.js`)

### Các function có sẵn:

```javascript
// Kiểm tra đã login chưa
isAuthenticated() // → boolean

// Lấy thông tin user hiện tại
getCurrentUser() // → object | null

// Kiểm tra có phải admin không
isAdmin() // → boolean

// Lấy token
getToken() // → string | null

// Xóa toàn bộ auth data (logout)
clearAuth() // → void

// Lấy tên hiển thị
getUserDisplayName() // → string
```

### Ví dụ sử dụng:

```javascript
import { isAdmin, clearAuth } from '../utils/authHelpers';

// Check admin
if (isAdmin()) {
  console.log('User là admin!');
}

// Logout
const handleLogout = () => {
  clearAuth();
  navigate('/login');
};
```

---

## 🛡️ Protected Admin Route

### File: `src/components/ProtectedRoute/ProtectedAdminRoute.jsx`

```javascript
import { ProtectedAdminRoute } from './components/ProtectedRoute';

// Sử dụng trong router
<Route 
  path="/admin" 
  element={
    <ProtectedAdminRoute>
      <AdminPage />
    </ProtectedAdminRoute>
  } 
/>
```

### Logic Flow:

```
User truy cập /admin
    │
    ├─► isAuthenticated() === false
    │   └─► Alert "Vui lòng đăng nhập" → Navigate to /login
    │
    ├─► isAdmin() === false
    │   └─► Alert "Không có quyền" → Navigate to /
    │
    └─► isAdmin() === true
        └─► Render <AdminPage />
```

---

## 🔄 Login Flow với Role

### File: `src/pages/loginPage/login.jsx`

#### 1. Demo Admin Account
```javascript
Email: admin@admin.com
Password: admin123

// Check local → không call API
if (formData.email === 'admin@admin.com' && 
    formData.password === 'admin123') {
  const adminData = {
    memberId: 'ADMIN001',
    name: 'Administrator',
    email: 'admin@admin.com',
    role: 'admin',
    status: 'active'
  };
  
  login(adminData, 'demo-admin-token');
  navigate('/admin'); // ← Redirect admin
}
```

#### 2. API Login
```javascript
// Call API
const response = await api.post('/members/login', {
  email: formData.email,
  password: formData.password
});

// Lưu với role từ API
const userData = {
  ...response.data,
  role: response.data.role || 'member'
};

login(userData, response.data.token);

// Redirect dựa trên role
if (userData.role === 'admin') {
  navigate('/admin');
} else {
  navigate('/');
}
```

---

## 🎨 Header Integration

### File: `src/components/Header/index.jsx`

Link "Quản trị hệ thống" chỉ hiển thị cho admin:

```jsx
{isAdmin() && (
  <>
    <Link 
      to="/admin" 
      className="dropdown-item admin-link"
      onClick={() => setShowUserDropdown(false)}
    >
      <div className="item-icon">👑</div>
      <span>Quản trị hệ thống</span>
    </Link>
    <div className="dropdown-divider"></div>
  </>
)}
```

### Styling đặc biệt cho admin-link:

```scss
.admin-link {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%) !important;
  border-left: 3px solid #f59e0b !important;
  font-weight: 600 !important;
  
  &:hover {
    background: linear-gradient(135deg, #fde68a 0%, #fcd34d 100%) !important;
    transform: translateX(4px);
  }
}
```

---

## 🚪 Admin Page với Logout

### File: `src/pages/adminPage/index.jsx`

#### Logout Button trong Header:

```jsx
<button 
  className="logout-btn" 
  onClick={handleLogout}
  title="Đăng xuất"
>
  🚪
</button>
```

#### Logout Handler:

```javascript
const handleLogout = () => {
  if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
    clearAuth(); // Xóa toàn bộ auth data
    navigate('/login');
  }
};
```

#### Display User Name:

```jsx
<div className="admin-profile">
  <img src="https://via.placeholder.com/32" alt="Admin" />
  <span>{getUserDisplayName()}</span>
</div>
```

---

## 🧪 Testing Guide

### Test Case 1: Demo Admin Login
```
1. Vào http://localhost:5175/login
2. Nhập:
   - Email: admin@admin.com
   - Password: admin123
3. Click "Đăng nhập"

Expected:
✅ Redirect về /admin
✅ localStorage có user với role = 'admin'
✅ Header hiển thị link "Quản trị hệ thống"
✅ Admin page hiển thị nút logout
```

### Test Case 2: Protected Route - Chưa Login
```
1. Clear localStorage (hoặc logout)
2. Vào trực tiếp http://localhost:5175/admin

Expected:
✅ Alert "Vui lòng đăng nhập để tiếp tục!"
✅ Redirect về /login
```

### Test Case 3: Protected Route - Member Access
```
1. Login với tài khoản member (không phải admin)
2. Vào trực tiếp http://localhost:5175/admin

Expected:
✅ Alert "Bạn không có quyền truy cập trang này!"
✅ Redirect về /
```

### Test Case 4: Admin Link in Header
```
1. Login với admin account
2. Click vào avatar/user menu

Expected:
✅ Hiển thị link "👑 Quản trị hệ thống" (highlighted vàng)
✅ Click link → redirect /admin

---

1. Login với member account
2. Click vào avatar/user menu

Expected:
✅ KHÔNG hiển thị link "Quản trị hệ thống"
```

### Test Case 5: Logout từ Admin Page
```
1. Login admin và vào /admin
2. Click nút logout 🚪

Expected:
✅ Hiển thị confirm dialog
✅ Sau confirm → localStorage bị clear
✅ Redirect về /login
```

---

## 📊 Data Structure

### User Object với Role:

```javascript
// Admin User
{
  memberId: 'ADMIN001',
  name: 'Administrator',
  email: 'admin@admin.com',
  role: 'admin',           // ← Key field
  status: 'active'
}

// Member User
{
  memberId: 'MEM12345',
  name: 'John Doe',
  email: 'john@example.com',
  address: '123 Street',
  phone: '0123456789',
  role: 'member',          // ← Key field
  status: 'active'
}
```

### LocalStorage Structure:

```javascript
localStorage.token = "jwt-token-here"
localStorage.user = JSON.stringify({
  memberId: "...",
  name: "...",
  email: "...",
  role: "admin" | "member",
  // ... other fields
})
```

---

## 🔄 Complete User Flow

### Admin User Journey:

```
1. Visit /login
   ↓
2. Enter admin credentials
   ↓
3. Click "Đăng nhập"
   ↓
4. System checks email/password
   ↓
5. Save user with role='admin'
   ↓
6. Redirect to /admin
   ↓
7. ProtectedAdminRoute checks:
   - isAuthenticated() ✅
   - isAdmin() ✅
   ↓
8. Render AdminPage
   ↓
9. User clicks avatar
   → See "Quản trị hệ thống" link
   ↓
10. User clicks logout
    → Clear auth → /login
```

### Member User Journey:

```
1. Visit /login
   ↓
2. Enter member credentials
   ↓
3. Click "Đăng nhập"
   ↓
4. System checks with API
   ↓
5. Save user with role='member'
   ↓
6. Redirect to / (home)
   ↓
7. User tries to access /admin
   ↓
8. ProtectedAdminRoute checks:
   - isAuthenticated() ✅
   - isAdmin() ❌
   ↓
9. Alert + Redirect to /
```

---

## 🎯 Best Practices

### 1. **Always use helpers**
```javascript
// ✅ Good
import { isAdmin } from '../utils/authHelpers';
if (isAdmin()) { /* ... */ }

// ❌ Bad
const user = JSON.parse(localStorage.getItem('user'));
if (user && user.role === 'admin') { /* ... */ }
```

### 2. **Clear auth on logout**
```javascript
// ✅ Good
clearAuth(); // Xóa tất cả

// ❌ Bad
localStorage.removeItem('token'); // Thiếu user
```

### 3. **Use ProtectedRoute**
```javascript
// ✅ Good
<Route path="/admin" element={
  <ProtectedAdminRoute>
    <AdminPage />
  </ProtectedAdminRoute>
} />

// ❌ Bad - không có protection
<Route path="/admin" element={<AdminPage />} />
```

### 4. **Backend also needs to verify**
```javascript
// Frontend checks chỉ là UX
// Backend PHẢI verify permissions cho mọi API call
```

---

## 🚀 Future Enhancements

- [ ] Thêm nhiều roles (seller, moderator, etc.)
- [ ] Permission-based access (fine-grained control)
- [ ] Role hierarchy (admin > moderator > member)
- [ ] Session timeout và auto-logout
- [ ] Remember me functionality
- [ ] JWT token refresh logic
- [ ] Audit log cho admin actions

---

## 🆘 Troubleshooting

### Issue: Admin link không hiển thị sau login
**Solution:**
```
1. Check localStorage → có user với role='admin' không?
2. Check console → có error từ isAdmin() không?
3. Hard refresh browser (Ctrl + Shift + R)
4. Clear cache và login lại
```

### Issue: Vẫn vào được /admin dù không phải admin
**Solution:**
```
1. Check App.jsx → có wrap với ProtectedAdminRoute không?
2. Check import → import { ProtectedAdminRoute } đúng chưa?
3. Restart dev server
```

### Issue: Logout không clear hết data
**Solution:**
```
1. Check clearAuth() function
2. Xem có localStorage items nào khác không?
3. Manually clear: localStorage.clear()
```

---

## 📝 Checklist Hoàn tất

- [x] Auth helpers (`authHelpers.js`)
- [x] Protected Admin Route component
- [x] Login flow với role check
- [x] Admin link trong header (chỉ admin thấy)
- [x] Logout button trong admin page
- [x] Styling cho admin-link
- [x] Demo admin credentials trên login page
- [x] Auto redirect sau login dựa trên role
- [x] Protected /admin route
- [x] Display user name trong admin panel

---

**System Status:** ✅ HOẠT ĐỘNG HOÀN CHỈNH

**Last Updated:** October 2025
**Version:** 1.0.0

