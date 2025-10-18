# 🚀 Hướng dẫn setup Supabase cho lưu trữ ảnh

## 1. 🔑 Lấy API Keys từ Supabase Dashboard

1. Truy cập: https://supabase.com/dashboard/project/rvmbqoitqkxzvmwryddx/settings/api
2. Copy **anon** key và **URL**
3. Paste vào file `.env.local`:

```env
VITE_SUPABASE_URL=https://rvmbqoitqkxzvmwryddx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bWJxb2l0cWt4enZtd3J5ZGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0NDYyNTIsImV4cCI6MjA0NTAyMjI1Mn0.YOUR_ACTUAL_KEY_HERE
```

## 2. 📁 Tạo Storage Bucket

1. Vào **Storage** → **Buckets** trong Supabase Dashboard
2. Tạo bucket mới:
   - Name: `product-images`
   - Public: ✅ (để có thể truy cập public URLs)
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg,image/png,image/gif`

## 3. 🔐 Cấu hình RLS (Row Level Security)

Vào **Storage** → **Policies** và tạo policies:

### Policy 1: Anyone can view images
```sql
CREATE POLICY "Anyone can view images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');
```

### Policy 2: Anyone can upload images  
```sql
CREATE POLICY "Anyone can upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');
```

### Policy 3: Users can delete their own images
```sql
CREATE POLICY "Users can delete own images" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');
```

## 4. 📂 Cấu trúc thư mục

Ảnh sẽ được lưu với cấu trúc:
```
product-images/
├── product-listings/
│   ├── 1729446252_abc123.jpg
│   ├── 1729446253_def456.png
│   └── ...
└── user-avatars/
    ├── user123_avatar.jpg
    └── ...
```

## 5. 🧪 Test Upload

Restart server và thử upload ảnh:
```bash
npm run dev
```

Vào `/post` → Step 3 → Thử upload ảnh và kiểm tra:
- Console logs
- Supabase Storage Dashboard
- Network tab để xem API calls

## 6. 🔍 Debug

Nếu có lỗi, kiểm tra:
1. **Console errors**: F12 → Console
2. **Network tab**: Xem API calls to Supabase
3. **Supabase logs**: Dashboard → Logs
4. **Environment variables**: Console.log để check keys

## 7. 📊 Monitoring

Theo dõi usage tại:
- **Dashboard** → **Settings** → **Usage**
- **Storage** → **Usage**
- Giới hạn free plan: 1GB storage