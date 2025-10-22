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
        // Demo Admin Account - kiểm tra trước khi call API
        if (formData.email === 'admin@admin.com' && formData.password === 'admin123') {
          const adminData = {
            memberId: 'ADMIN001',
            name: 'Administrator',
            email: 'admin@admin.com',
            role: 'admin',
            status: 'active'
          };
          
          // Lưu vào AuthContext
          login(adminData, 'demo-admin-token');
          
          console.log('Admin logged in successfully');
          
          // Redirect về trang admin
          navigate('/admin', { replace: true });
          setIsSubmitting(false);
          return;
        }

        // Call API login với endpoint /members/login
        const response = await api.post('/members/login', {
          email: formData.email,
          password: formData.password
        });

        // Sử dụng AuthContext để lưu user data
        const userData = {
          memberId: response.data.memberId,
          name: response.data.name,
          email: response.data.email,
          address: response.data.address,
          phone: response.data.phone,
          yearOfBirth: response.data.yearOfBirth,
          sex: response.data.sex,
          status: response.data.status,
          role: response.data.role || 'member' // Lấy role từ API response
        };

        // Gọi hàm login từ AuthContext
        login(userData, response.data.token);

        // Thông báo thành công
        console.log('User logged in successfully:', userData.name);

        // Redirect dựa trên role
        if (userData.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
        
      } catch (error) {
        console.error('Login error:', error);
        setErrors({
          submit: error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.'
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

            <div className="demo-credentials-box">
              <div className="demo-header">
                <span className="demo-icon">🔑</span>
                <strong>Tài khoản demo Admin:</strong>
              </div>
              <div className="demo-info">
                <p>📧 Email: <code>admin@admin.com</code></p>
                <p>🔒 Password: <code>admin123</code></p>
              </div>
            </div>

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