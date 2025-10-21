# Test Component ImageUpload

## Để test component ImageUpload:

### 1. Cập nhật Supabase config trước
Trong file `src/config/supabase.js`, thay:
```javascript
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
```
bằng key thật từ [Supabase Dashboard](https://supabase.com/dashboard/project/rvmbqoitqkxzvmwryddx/settings/api)

### 2. Cần tạo bucket và policies
1. Vào [Storage](https://supabase.com/dashboard/project/rvmbqoitqkxzvmwryddx/storage/buckets)
2. Tạo bucket `product-images` với public access
3. Vào [Policies](https://supabase.com/dashboard/project/rvmbqoitqkxzvmwryddx/storage/policies)
4. Tạo 3 policies như trong hướng dẫn

### 3. Test component
1. Chạy `npm run dev`
2. Vào trang đăng bán: `/post-listing`
3. Điền form đến bước 2
4. Test upload ảnh:
   - Kéo thả ảnh vào vùng upload
   - Hoặc click chọn file
   - Kiểm tra preview ảnh
   - Test xóa ảnh

### 4. Kiểm tra console
- Mở Developer Tools > Console
- Xem có lỗi gì không khi upload
- Kiểm tra URLs ảnh được tạo

### 5. Kiểm tra Supabase Storage
- Vào [Storage Browser](https://supabase.com/dashboard/project/rvmbqoitqkxzvmwryddx/storage/buckets/product-images)
- Xem ảnh đã upload thành công chưa
- Test xóa ảnh từ component

## Các vấn đề có thể gặp:

### Lỗi 403 Forbidden
- Kiểm tra bucket policies đã tạo chưa
- Đảm bảo bucket là public

### Lỗi upload
- Kiểm tra Supabase key đúng chưa
- Kiểm tra network connection
- File có quá 5MB không

### Component không hiển thị
- Kiểm tra import ImageUpload đúng chưa
- Xem có lỗi trong console không