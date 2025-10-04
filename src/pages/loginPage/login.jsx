import React, { useState, useCallback } from 'react';
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
        console.log('Logging in with:', formData);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        setErrors({
          submit: 'Login failed. Please try again.'
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
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Log In</h1>
        <p className="signup-text">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="xxxxxx@gmail.com"
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="xxxxxxxxx"
          error={errors.password}
        />

        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </Button>

        <div className="divider">
          <span>or</span>
        </div>

        <SocialLogin 
          onGoogleLogin={() => handleSocialLogin('Google')}
        />

        <div className="footer-links">
          <a href="/terms">Terms of Use</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;