import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';
import './login.scss';

const Input = ({ label, type, name, value, onChange, placeholder, error }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'error' : ''}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

const Button = ({ children, type = 'button', onClick, variant = 'primary', fullWidth = false, disabled }) => {
  const buttonClasses = `button ${variant} ${fullWidth ? 'full-width' : ''}`;
  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses.trim()}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const SocialLogin = ({ onGoogleLogin }) => {
  return (
    <div className="social-buttons">
      <button className="google-btn" onClick={onGoogleLogin}>
        Continue with Google
      </button>
    </div>
  );
};
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // Call API login với endpoint /members/login
        const response = await api.post('/api/members/login', {
          email: formData.email,
          password: formData.password
        });

        // Debug: log full response to help troubleshoot shape differences
        // (some backends nest the useful payload under `data`)
        console.log('Login response full:', response)

        // Extract payload safely whether backend returns fields at top-level
        // or nested under `data` (e.g. response.data or response.data.data).
        const payload = response.data?.data ? response.data.data : response.data || {};

        // Lưu token (defensive: try both locations)
        const token = payload.token || response.data?.token || '';
        if (!token) {
          console.warn('No token found on login response:', payload)
        } else {
          localStorage.setItem('token', token);
        }
        // Sử dụng AuthContext để lưu user data (guard against missing fields)
        // After storing token, try to fetch the authoritative current user from
        // the backend. This helps avoid relying on inconsistent login payloads
        // and ensures we get the correct role for redirect.
        let fetchedUser = null;
        try {
          const currentRes = await api.get('/api/members/current');
          fetchedUser = currentRes.data?.data ? currentRes.data.data : currentRes.data;
          if (process.env.NODE_ENV === 'development') {
            console.log('Fetched current user after login:', fetchedUser);
          }
        } catch (fetchErr) {
          // If fetching current fails, fall back to payload from login response.
          console.warn('Could not fetch current user after login, falling back to login payload', fetchErr);
        }

        const source = payload || fetchedUser || {};

        // Normalize role from several possible backend shapes: string, number, boolean or nested fields.
        const roleRaw = source.role ?? source.roleId ?? source.isAdmin ?? '';
        let normalizedRole = 'member';
        if (typeof roleRaw === 'number') {
          if (roleRaw === 1) normalizedRole = 'admin';
        } else {
          const roleStr = String(roleRaw).toLowerCase();
          if (['admin', 'administrator', '1', 'true'].includes(roleStr)) normalizedRole = 'admin';
        }

        const userData = {
          memberId: source.memberId || source.id || null,
          name: source.name || payload.name || '',
          email: source.email || payload.email || formData.email,
          address: source.address || payload.address || '',
          phone: source.phone || payload.phone || '',
          yearOfBirth: source.yearOfBirth || source.year || payload.yearOfBirth || null,
          sex: source.sex || payload.sex || '',
          status: source.status || payload.status || '',
          role: normalizedRole
        };

        // Gọi hàm login từ AuthContext
        login(userData, token);

        // Redirect dựa trên role
        if (userData.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true }); // Chuyển member về trang home
        }
        
      } catch (error) {
        // Thêm logging chi tiết để chẩn đoán lỗi đăng nhập (ví dụ: CORS / proxy / response shape)
        console.error('Login error full:', error);
        console.error('Login error response:', error.response);

        // Hiển thị thông báo lỗi rõ ràng cho người dùng: ưu tiên message trả về từ backend,
        // nếu không có thì hiển thị status + body để dễ debug.
        const backendMessage = error.response?.data?.message;
        const backendBody = error.response?.data ? JSON.stringify(error.response.data) : null;
        const statusInfo = error.response?.status ? ` (${error.response.status})` : '';

        setErrors({
          submit: backendMessage || (backendBody ? `Đăng nhập thất bại${statusInfo}: ${backendBody}` : `Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.`)
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleSocialLogin = useCallback((provider) => {
    console.log(`Logging in with ${provider}`);
  }, []);

  return (
    <div className="login-page">
      <div className="login-split">
        <aside className="login-hero" aria-hidden="true">
          <div className="hero-inner">
            <h2>EcoXe</h2>
            <p>Mua bán pin & xe điện - an toàn, nhanh chóng</p>
            <div className="hero-cta">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 11h18M12 3v18" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </aside>

        <main className="login-card-wrapper">
          <form className="login-card" onSubmit={handleSubmit} noValidate>
            <div className="card-header">
              <h1>Đăng nhập</h1>
              <p className="small">Chào mừng quay trở lại — đăng nhập để tiếp tục</p>
            </div>

            {errors.submit && <div className="error-message" role="alert">{errors.submit}</div>}

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
            />

            <Input
              label="Mật khẩu"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              error={errors.password}
            />

            <div className="actions-row">
              <label className="remember">
                <input type="checkbox" name="remember" /> Ghi nhớ đăng nhập
              </label>
              <a className="forgot" href="/forgot">Quên mật khẩu?</a>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>

            <div className="divider">
              <span>hoặc</span>
            </div>

            <SocialLogin 
              onGoogleLogin={() => handleSocialLogin('Google')}
            />

            <p className="signup-text">
              Chưa có tài khoản? <a href="/signup">Đăng ký ngay</a>
            </p>

            <div className="card-footer">
              <a href="/terms">Điều khoản</a>
              <a href="/privacy">Chính sách</a>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;