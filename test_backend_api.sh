#!/usr/bin/env bash

# Test Backend API với dữ liệu mẫu chứa Supabase URLs

# 1. Test Health Check
echo "🔍 Testing Backend Health..."
curl -X GET http://14.225.206.98:8080/api/health \
  -H "Content-Type: application/json" \
  | jq .

echo -e "\n"

# 2. Test Create Product với Supabase URLs
echo "📤 Testing Create Product with Supabase URLs..."
curl -X POST http://14.225.206.98:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "VinFast VF8 2023 - Xe điện cao cấp",
    "description": "Xe điện VinFast VF8 phiên bản cao cấp, màu trắng, nội thất da, đã đi 5000km, còn bảo hành chính hãng 3 năm. Xe được bảo dưỡng định kỳ tại đại lý chính hãng.",
    "price": 1200000000,
    "category": "car",
    "condition": "Đã sử dụng (Còn mới)",
    "brand": "VinFast",
    "year": 2023,
    "color": "Trắng",
    "origin": "Sản xuất trong nước",
    "region": "Hà Nội",
    "negotiable": true,
    "imageUrls": [
      "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test_car_1.jpg",
      "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test_car_2.jpg",
      "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test_car_3.jpg"
    ],
    "bodyType": "SUV",
    "seats": "7 chỗ",
    "location": {
      "city": "Hà Nội",
      "district": "Ba Đình", 
      "ward": "Phúc Xá",
      "address": "123 Đường Hoàng Hoa Thám"
    },
    "contact": {
      "name": "Nguyễn Văn Test",
      "phone": "0987654321"
    },
    "createdAt": "2023-10-18T10:30:00.000Z",
    "status": "active"
  }' \
  | jq .

echo -e "\n"

# 3. Test Create Battery Product
echo "🔋 Testing Create Battery Product..."
curl -X POST http://14.225.206.98:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pin Panasonic 60kWh cho xe điện - Còn 95% dung lượng",
    "description": "Pin Panasonic Li-ion 60kWh, sử dụng 1 năm, còn 95% dung lượng ban đầu. Có đầy đủ giấy tờ, bảo hành còn 2 năm. Pin phù hợp với các dòng xe VinFast VF8, VF9.",
    "price": 300000000,
    "category": "battery",
    "condition": "Đã sử dụng (Tốt)",
    "brand": "Panasonic",
    "year": 2023,
    "color": "Đen",
    "origin": "Nhập khẩu",
    "region": "TP. Hồ Chí Minh",
    "negotiable": false,
    "imageUrls": [
      "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test_battery_1.jpg",
      "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test_battery_2.jpg"
    ],
    "batteryType": "Li-ion",
    "capacity": "60kWh",
    "location": {
      "city": "TP. Hồ Chí Minh",
      "district": "Quận 1",
      "ward": "Phường Bến Nghé", 
      "address": "456 Đường Nguyễn Huệ"
    },
    "contact": {
      "name": "Trần Thị Test",
      "phone": "0123456789"
    },
    "createdAt": "2023-10-18T14:15:00.000Z",
    "status": "active"
  }' \
  | jq .

echo -e "\n✅ Test completed!"