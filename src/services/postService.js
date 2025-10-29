// Lấy tất cả bài đăng xe ô tô từ backend
export async function fetchAllCarPosts() {
  try {
    const response = await import('../config/api').then(({ default: api }) =>
      api.get('/article/car')
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài đăng xe ô tô:', error);
    return [];
  }
}

// Lấy tất cả bài đăng (nếu backend có endpoint chung)
export async function fetchAllPosts() {
  try {
    const response = await import('../config/api').then(({ default: api }) =>
      api.get('/article')
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài đăng:', error);
    return [];
  }
}
