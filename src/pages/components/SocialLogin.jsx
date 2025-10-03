import React from 'react';
import Button from './Button';

const SocialLogin = ({ onGoogleLogin, onFacebookLogin, onAppleLogin }) => {
  return (
    <div className="social-buttons">
      <button className="google-btn" onClick={onGoogleLogin}>
        Continue with Google
      </button>
      <button className="facebook-btn" onClick={onFacebookLogin}>
        Continue with Facebook
      </button>
      <button className="apple-btn" onClick={onAppleLogin}>
        Continue with Apple
      </button>
    </div>
  );
};

export default SocialLogin;