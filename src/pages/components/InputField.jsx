import React from 'react';
// Import CSS nếu dùng module CSS: import styles from '../styles/components.module.css';

const InputField = ({ label, type, value, onChange, placeholder }) => {
  return (
    <div className="input-group">
      <label htmlFor={label}>{label}</label>
      <input
        id={label}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || `Nhập ${label.toLowerCase()}`}
        required
      />
    </div>
  );
};

export default InputField;