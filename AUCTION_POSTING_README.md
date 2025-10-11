# Trang Đăng Tin & Đấu Giá - Chợ Xe Điện

## 📋 Tổng quan

Dự án bao gồm 2 tính năng chính theo flow của Chợ Tốt:

1. **Trang Đăng Tin** (`/post-listing`) - Cho phép người dùng đăng tin bán xe điện/pin
2. **Trang Đấu Giá** (`/auction`) - Hiển thị và tham gia đấu giá sản phẩm

## 🎯 Tính năng

### Trang Đăng Tin (Post Listing)

#### Flow đăng tin 6 bước:

1. **Bước 1 - Chọn danh mục**
   - Chọn loại sản phẩm: Ô tô điện, Xe máy điện, hoặc Pin
   - Tùy chọn đăng tin đấu giá

2. **Bước 2 - Tải ảnh**
   - Upload tối thiểu 1 ảnh, tối đa 10 ảnh
   - Chọn ảnh chính (ảnh đầu tiên)
   - Drag & drop hoặc click để upload
   - Preview và quản lý ảnh

3. **Bước 3 - Thông tin chi tiết**
   - Tiêu đề tin đăng (tối đa 100 ký tự)
   - Mô tả chi tiết (tối đa 3000 ký tự)
   - Hãng sản xuất và model
   - Năm sản xuất
   - Tình trạng sản phẩm

4. **Bước 4 - Thông số kỹ thuật**
   - **Đối với xe (ô tô/xe máy):**
     - Số km đã đi
     - Hộp số (tự động/số sàn)
     - Màu sắc
     - Số chỗ ngồi (đối với ô tô)
   
   - **Đối với pin:**
     - Điện áp (V)
     - Dung lượng (Ah)
     - Loại pin
     - Thời gian bảo hành

5. **Bước 5 - Giá & Địa chỉ**
   - Giá bán hoặc giá khởi điểm (nếu đấu giá)
   - Tùy chọn thương lượng
   - Địa chỉ chi tiết (tỉnh/thành, quận/huyện, phường/xã)
   - Thời gian kết thúc đấu giá (nếu chọn đấu giá)

6. **Bước 6 - Thông tin liên hệ**
   - Tên người liên hệ
   - Số điện thoại
   - Email (không bắt buộc)
   - Preview tin đăng
   - Đồng ý điều khoản

#### Tính năng nổi bật:
- ✅ Step-by-step wizard với progress indicator
- ✅ Validation từng bước
- ✅ Preview tin đăng trước khi đăng
- ✅ Upload và quản lý ảnh trực quan
- ✅ Form động theo loại sản phẩm
- ✅ Hỗ trợ đăng tin đấu giá

### Trang Đấu Giá (Auction)

#### Tính năng chính:

1. **Danh sách đấu giá**
   - Hiển thị tất cả phiên đấu giá đang diễn ra
   - Thông tin chi tiết: giá khởi điểm, giá hiện tại, số lượt đấu
   - Đếm ngược thời gian còn lại
   - Badge "Sắp kết thúc" cho các phiên gấp

2. **Bộ lọc & Sắp xếp**
   - Lọc theo danh mục (ô tô, xe máy, pin)
   - Lọc theo trạng thái (đang đấu giá, sắp kết thúc, đã kết thúc)
   - Sắp xếp theo: sắp kết thúc, mới nhất, giá, số lượt đấu

3. **Đấu giá sản phẩm**
   - Modal đấu giá với thông tin chi tiết
   - Hiển thị người dẫn đầu hiện tại
   - Gợi ý giá đấu (giá hiện tại + bước giá)
   - Nút tăng giá nhanh
   - Cam kết mua khi thắng đấu giá

4. **Thông tin hiển thị**
   - Giá khởi điểm và giá hiện tại
   - Số lượt đấu giá
   - Người đang dẫn đầu
   - Thời gian còn lại (real-time countdown)
   - Địa chỉ người bán

5. **Hướng dẫn đấu giá**
   - 4 bước hướng dẫn chi tiết
   - Giao diện thân thiện với người dùng mới

## 🚀 Cách sử dụng

### 1. Đăng tin mới

```
Trang chủ → Nhấn "Đăng tin" hoặc truy cập /post-listing
```

Hoặc từ Header:
```jsx
<Link to="/post-listing">Đăng tin</Link>
```

### 2. Xem đấu giá

```
Truy cập /auction
```

Hoặc từ trang đấu giá, nhấn "Tạo phiên đấu giá" sẽ chuyển đến trang đăng tin với tùy chọn đấu giá đã được chọn.

### 3. Tham gia đấu giá

1. Chọn sản phẩm muốn đấu giá
2. Nhấn "Đấu giá ngay"
3. Nhập giá đấu (phải cao hơn giá hiện tại)
4. Xác nhận đấu giá

## 🎨 Giao diện

### Màu sắc chính:

- **Trang đăng tin:** Gradient tím (#667eea → #764ba2)
- **Trang đấu giá:** Gradient đỏ (#ff6b6b → #ee5a6f)
- **Accent colors:** Xanh dương (#1976d2), Xanh lá (#4CAF50), Cam (#f57c00)

### Responsive Design:

- ✅ Desktop (> 1024px)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (< 768px)

## 📡 API Endpoints

### Post Listing API

```javascript
// Tạo tin đăng mới
POST /api/posts
Content-Type: multipart/form-data

Body:
{
  images: [File],
  data: {
    category: string,
    title: string,
    description: string,
    price: number,
    location: {...},
    contact: {...},
    isAuction: boolean,
    ...
  }
}
```

### Auction API

```javascript
// Lấy danh sách đấu giá
GET /api/auctions?category=all&status=active&sortBy=ending-soon

// Đặt giá đấu
POST /api/auctions/:id/bid
Body: { amount: number }
```

## 🔧 Cấu hình API

File: `src/components/config/api.jsx`

```javascript
const api = axios.create({
  baseURL: "http://14.225.206.98:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Giải quyết lỗi CORS:

**Cách 1:** Backend thêm CORS headers
```
Access-Control-Allow-Origin: http://localhost:5174
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Cách 2:** Dùng Vite proxy (Development)

File: `vite.config.js`
```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://14.225.206.98:8080',
        changeOrigin: true,
      }
    }
  }
}
```

Sau đó đổi baseURL trong api.jsx thành `'/api'`

## 📱 Component Structure

```
src/pages/
├── postListingPage/
│   ├── index.jsx       # Main component với 6-step wizard
│   └── index.scss      # Styling
│
└── auctionPage/
    ├── index.jsx       # Main component + AuctionCard + BidModal
    └── index.scss      # Styling

src/components/config/
└── api.jsx             # Axios instance với interceptors
```

## 🎯 State Management

### Post Listing Page

```javascript
const [formData, setFormData] = useState({
  category: '',
  images: [],
  title: '',
  description: '',
  price: '',
  location: {...},
  contact: {...},
  isAuction: false,
  ...
})
```

### Auction Page

```javascript
const [auctions, setAuctions] = useState([])
const [selectedAuction, setSelectedAuction] = useState(null)
const [bidAmount, setBidAmount] = useState('')
const [filters, setFilters] = useState({...})
```

## ⚡ Tính năng nâng cao

### 1. Real-time Countdown Timer

```javascript
const calculateTimeLeft = (endDate) => {
  const difference = new Date(endDate) - new Date()
  // Calculate days, hours, minutes, seconds
  // Return formatted time string
}
```

### 2. Image Upload với Preview

```javascript
const handleImageUpload = (e) => {
  const files = Array.from(e.target.files)
  // Validate max 10 images
  // Convert to base64 for preview
  // Store File objects for upload
}
```

### 3. Form Validation từng bước

```javascript
const validateCurrentStep = () => {
  switch (currentStep) {
    case 1: return validateCategory()
    case 2: return validateImages()
    // ...
  }
}
```

### 4. Dynamic Form Fields

Form thay đổi dựa trên category được chọn:
- Ô tô/Xe máy: mileage, transmission, seats
- Pin: voltage, capacity, warranty

## 🐛 Xử lý lỗi

### 1. Network Errors

```javascript
try {
  await api.post('/posts', data)
} catch (error) {
  if (error.code === 'ERR_NETWORK') {
    alert('Không thể kết nối đến server')
  } else if (error.response) {
    alert(error.response.data?.message)
  }
}
```

### 2. Validation Errors

- Client-side validation trước khi gửi
- Server-side validation messages
- User-friendly error messages

## 🔐 Authentication

Token được lưu trong localStorage và tự động gửi với mọi request:

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})
```

## 📝 TODO / Cải tiến

- [ ] Thêm drag & drop cho image upload
- [ ] Real-time updates cho auction bids (WebSocket)
- [ ] Lưu draft tin đăng
- [ ] Notification khi bị outbid
- [ ] Chat trực tiếp với người bán
- [ ] Lịch sử đấu giá
- [ ] Báo cáo và thống kê

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed for FE_Second-hand-EV-Battery-Trading-Platform

---

**Happy Coding! 🚀**
