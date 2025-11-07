import React, { useState, useCallback } from 'react';
import './signup.scss';
import { registerMember } from '../../services/authService';

const Input = ({ label, type, name, value, onChange, placeholder, error, autoComplete }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={error ? 'error' : ''}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

// Button component
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

// SocialLogin component
const SocialLogin = ({ onGoogleLogin }) => {
  return (
    <div className="social-buttons">
      <button className="google-btn" onClick={onGoogleLogin}>
        Tiếp tục với Google
      </button>
    </div>
  );
};

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    yearOfBirth: '',
    phone: '',
    email: '',
    role: 'MEMBER',
    sex: '',
    status: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [registrationResult, setRegistrationResult] = useState(null);


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
    
    if (!formData.name) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    }

    if (!formData.address) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    if (!formData.yearOfBirth) {
      newErrors.yearOfBirth = 'Vui lòng chọn ngày sinh';
    }

    if (!formData.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại chỉ được chứa chữ số';
    }

    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    return newErrors;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setServerError(null);
    try {
      // build payload expected by the API
      const payload = {
        name: formData.name,
        address: formData.address,
        yearOfBirth: formData.yearOfBirth,
        phone: formData.phone,
        email: formData.email,
        sex: formData.sex,
        status: formData.status,
        password: formData.password
      };

      const result = await registerMember(payload);
      setRegistrationResult(result);
      // on success navigate to login (or adjust as needed)
      window.location.href = '/login';
    } catch (err) {
      // show server error in form area
      const msg = err?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setErrors(prev => ({ ...prev, submit: msg }));
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = useCallback((provider) => {
    console.log(`Đăng ký với ${provider}`);
  }, []);

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>Tạo tài khoản</h1>
        <p className="login-text">
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <div className="form-grid">
          <Input
            label="Họ và tên*"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            autoComplete="name"
            error={errors.name}
          />

          <Input
            label="Email*"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ban@vidu.com"
            autoComplete="email"
            error={errors.email}
          />

          <Input
            label="Số điện thoại*"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            autoComplete="tel"
            error={errors.phone}
          />

          <Input
            label="Ngày sinh*"
            type="date"
            name="yearOfBirth"
            value={formData.yearOfBirth}
            onChange={handleChange}
            autoComplete="bday"
            error={errors.yearOfBirth}
          />

          <Input
            label="Địa chỉ*"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Nhập địa chỉ"
            autoComplete="street-address"
            error={errors.address}
          />
        </div>

        <div className="form-group">
          <label>Giới tính</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className={errors.sex ? 'error' : ''}
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
          {errors.sex && <span className="error-text">{errors.sex}</span>}
        </div>

        {/* <div className="form-group">
          <label>Trạng thái</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={errors.status ? 'error' : ''}
          >
            <option value="">Chọn trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
          {errors.status && <span className="error-text">{errors.status}</span>}
        </div> */}

        <Input
          label="Mật khẩu*"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Nhập mật khẩu"
          autoComplete="new-password"
          error={errors.password}
        />

        <Input
          label="Xác nhận mật khẩu*"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Nhập lại mật khẩu"
          autoComplete="new-password"
          error={errors.confirmPassword}
        />

        <div className="password-requirements">
          <ul>
            <li className={formData.password.length >= 6 ? 'valid' : ''}>Ít nhất 6 ký tự</li>
            <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>Ít nhất một chữ hoa</li>
            <li className={/\d/.test(formData.password) ? 'valid' : ''}>Ít nhất một chữ số</li>
          </ul>
        </div>

        <div className="terms-checkbox">
          <label>
            <input type="checkbox" required />
            <span>
              Tôi đồng ý với <a href="/terms" target="_blank" rel="noreferrer">Điều khoản</a> và
              <a href="/privacy" target="_blank" rel="noreferrer"> Chính sách quyền riêng tư</a>.
            </span>
          </label>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
        </Button>

        <div className="divider">
          <span>hoặc</span>
        </div>

        <SocialLogin 
          onGoogleLogin={() => handleSocialLogin('Google')}
        />

        <div className="footer-links">
          <a href="/terms">Điều khoản sử dụng</a>
          <a href="/privacy">Chính sách bảo mật</a>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;