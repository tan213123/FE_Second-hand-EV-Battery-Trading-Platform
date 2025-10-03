import React from 'react';

const Button = ({ children, type = 'button', onClick, disabled = false }) => {
  return (
    <button
      className="btn primary-btn" 
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
