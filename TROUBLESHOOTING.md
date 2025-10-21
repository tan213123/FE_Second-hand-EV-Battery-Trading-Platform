# Troubleshooting Common Issues

## 1. Policy Syntax Error
**Triệu chứng**: "Error adding policy: syntax error at or near CREATE"

**Giải pháp**:
- Sử dụng SQL Editor thay vì Policy Builder
- Chạy từng policy một cách riêng biệt
- Đảm bảo bucket 'product-images' đã tồn tại trước khi tạo policy

## 2. Bucket Permission Error
**Triệu chứng**: 403 Forbidden khi upload

**Giải pháp**:
- Kiểm tra bucket là "Public bucket" ✅
- Đảm bảo cả 3 policies (SELECT, INSERT, DELETE) đã được tạo
- Kiểm tra bucket name chính xác là 'product-images'

## 3. API Key Error
**Triệu chứng**: Invalid API key hoặc unauthorized

**Giải pháp**:
- Sử dụng "anon" key, không phải "service_role" key
- Copy key từ Settings > API trong Supabase Dashboard
- Đảm bảo project URL đúng

## 4. File Upload Error
**Triệu chứng**: Upload fails với network error

**Kiểm tra**:
- File size < 5MB
- File type là image (JPG, PNG, WebP)
- Internet connection stable
- Supabase service status

## 5. Component không hiển thị
**Triệu chứng**: ImageUpload component không render

**Kiểm tra**:
- Import path đúng: `'../../components/ImageUpload'`
- Component file tồn tại
- Không có syntax error trong console

## Quick Test Commands:
```bash
# Test dev server
npm run dev

# Check for errors
npm run lint

# Build test
npm run build
```