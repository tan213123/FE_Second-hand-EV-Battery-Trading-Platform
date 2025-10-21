import { createClient } from '@supabase/supabase-js'

// Thay thế với URL và API Key của project Supabase của bạn
const supabaseUrl = 'https://rvmbqoitqkxzvmwryddx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bWJxb2l0cWt4enZtd3J5ZGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MzUwMjIsImV4cCI6MjA3NjMxMTAyMn0.1RZxy9TQuCBm7j1CaN7z5iDcFDuOM0thg2vylMC6oMY' // Thay thế bằng anon key thật

export const supabase = createClient(supabaseUrl, supabaseKey)

// Storage bucket name cho hình ảnh sản phẩm
export const PRODUCT_IMAGES_BUCKET = 'product-images'