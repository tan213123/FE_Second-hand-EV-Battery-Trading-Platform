import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { Form, message } from "antd";
import { toast } from "react-toastify";
import "./login.scss";
import { useDispatch } from "react-redux";
import { login } from "../../redux/memberSlice";

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
        className={error ? "error" : ""}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

const Button = ({
  children,
  type = "button",
  onClick,
  variant = "primary",
  fullWidth = false,
  disabled,
}) => {
  const buttonClasses = `button ${variant} ${fullWidth ? "full-width" : ""}`;
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
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await api.post("/members/login", values);
      toast.success("Login successfully!");
      console.log(response);
      const { token, role } = response.data;
      localStorage.setItem("token", token);

      //luu state
      dispatch(login(response.data));

      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      console.log("RESPONSE FROM BACKEND:", response.data);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu."
      );
    } finally {
      setIsLoading(false);
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
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M3 11h18M12 3v18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </aside>

        <main className="login-card-wrapper">
          <Form
            className="login-card"
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <div className="card-header">
              <h1>Đăng nhập</h1>
              <p className="small">
                Chào mừng quay trở lại — đăng nhập để tiếp tục
              </p>
            </div>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                {
                  validator: (_, v) =>
                    !v || /\S+@\S+\.\S+/.test(v)
                      ? Promise.resolve()
                      : Promise.reject(new Error("Please enter a valid email")),
                },
              ]}
            >
              <input type="email" placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
              hasFeedback
            >
              <input type="password" placeholder="Nhập mật khẩu" />
            </Form.Item>

            <div className="actions-row">
              <label className="remember">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <input type="checkbox" />
                </Form.Item>
                Ghi nhớ đăng nhập
              </label>
              <a className="forgot" href="/forgot">
                Quên mật khẩu?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <div className="divider">
              <span>hoặc</span>
            </div>

            <SocialLogin onGoogleLogin={() => handleSocialLogin("Google")} />

            <p className="signup-text">
              Chưa có tài khoản? <a href="/signup">Đăng ký ngay</a>
            </p>

            <div className="card-footer">
              <a href="/terms">Điều khoản</a>
              <a href="/privacy">Chính sách</a>
            </div>
          </Form>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
