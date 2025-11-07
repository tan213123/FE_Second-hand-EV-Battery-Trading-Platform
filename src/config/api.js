import axios from 'axios'

const api = axios.create({
  baseURL: 'http://14.225.206.98:8080/api', // Sử dụng proxy của Vite thay vì gọi trực tiếp
  timeout: 10000
})

// Thêm token trước khi gửi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")?.replaceAll('"', "");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export default api
