import React, { useState, useCallback } from 'react';
import './signup.scss';

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
        Continue with Google
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
    sex: '',
    status: '',
    password: '',
    confirmPassword: ''
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
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.address) {
      newErrors.address = 'Address is required';
    }

    if (!formData.yearOfBirth) {
      newErrors.yearOfBirth = 'Date of birth is required';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Phone must contain only numbers';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        console.log('Signing up with:', formData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Redirect to login after successful signup
        window.location.href = '/login';
      } catch (error) {
        setErrors({
          submit: 'Sign up failed. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleSocialLogin = useCallback((provider) => {
    console.log(`Signing up with ${provider}`);
  }, []);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <p className="signup-text">
          Already have an account? <a href="/login">Log In</a>
        </p>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <Input
          label="Name*"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          error={errors.name}
        />

        <Input
          label="Address*"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your address"
          error={errors.address}
        />

        <Input
          label="Date of Birth*"
          type="date"
          name="yearOfBirth"
          value={formData.yearOfBirth}
          onChange={handleChange}
          error={errors.yearOfBirth}
        />

        <Input
          label="Phone Number*"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          error={errors.phone}
        />

        <Input
          label="Email*"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="xxxxxx@gmail.com"
          error={errors.email}
        />

        <div className="form-group">
          <label>Gender</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className={errors.sex ? 'error' : ''}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.sex && <span className="error-text">{errors.sex}</span>}
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={errors.status ? 'error' : ''}
          >
            <option value="">Select status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && <span className="error-text">{errors.status}</span>}
        </div>

        <Input
          label="Password*"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
        />

        <Input
          label="Confirm Password*"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
        />

        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
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

export default SignUpPage;