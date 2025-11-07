import React, { useState, useCallback } from "react";
import "./signup.scss";
import api from "../../config/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { message, Form } from "antd";

const Input = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}) => {
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
        className={error ? "error" : ""}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

// Button component
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
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const password = Form.useWatch("password", form);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        yearOfBirth: values?.yearOfBirth
          ? (() => {
              const parts = String(values.yearOfBirth).split('-');
              if (parts.length === 3) {
                const [y, m, d] = parts;
                return `${d}/${m}/${y}`;
              }
              return values.yearOfBirth;
            })()
          : values?.yearOfBirth,
      };

      const response = await api.post("/members/register", payload);
      toast.success("Successfully create new account!");
      navigate("/login");
      console.log(response);
    } catch (err) {
      // show server error in form area
      console.error(err);
      console.log(err.response);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = useCallback((provider) => {
    console.log(`Đăng ký với ${provider}`);
  }, []);

  return (
    <div className="signup-container">
      <Form
        form={form}
        layout="vertical"
        className="signup-form"
        onFinish={onFinish}
        initialValues={{ sex: "", status: "", role: "MEMBER" }}
        requiredMark={false}
      >
        <Form.Item name="role" initialValue="MEMBER" hidden>
          <input type="hidden" />
        </Form.Item>
        <h1>Tạo tài khoản</h1>
        <p className="login-text">
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>
        <div className="form-grid">
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên" },
              {
                validator: (_, v) =>
                  v && v.trim()
                    ? Promise.resolve()
                    : Promise.reject(new Error("Vui lòng nhập họ và tên")),
              },
            ]}
          >
            <input
              type="text"
              placeholder="Nhập họ và tên"
              autoComplete="name"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              {
                validator: (_, v) =>
                  !v || /\S+@\S+\.\S+/.test(v)
                    ? Promise.resolve()
                    : Promise.reject(new Error("Vui lòng nhập email hợp lệ")),
              },
            ]}
          >
            <input
              type="email"
              placeholder="ban@vidu.com"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                validator: (_, v) =>
                  !v || /^0\d{9,10}$/.test(v)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          "Số điện thoại phải bắt đầu bằng 0 và có 10–11 số"
                        )
                      ),
              },
            ]}
          >
            <input
              type="tel"
              placeholder="Nhập số điện thoại"
              autoComplete="tel"
              maxLength={11}
            />
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="yearOfBirth"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <input type="date" autoComplete="bday" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <input
              type="text"
              placeholder="Nhập địa chỉ"
              autoComplete="street-address"
            />
          </Form.Item>
        </div>

        <div className="form-group">
          <label>Giới tính</label>
          <Form.Item name="sex" rules={[{ required: false }]}>
            <select>
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </Form.Item>
        </div>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
          ]}
          hasFeedback
        >
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value)
                  return Promise.resolve();
                return Promise.reject(new Error("Mật khẩu không khớp"));
              },
            }),
          ]}
        >
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
          />
        </Form.Item>

        <div className="password-requirements">
          <ul>
            <li className={password && password.length >= 6 ? "valid" : ""}>
              Ít nhất 6 ký tự
            </li>
            <li className={password && /[A-Z]/.test(password) ? "valid" : ""}>
              Ít nhất một chữ hoa
            </li>
            <li className={password && /\d/.test(password) ? "valid" : ""}>
              Ít nhất một chữ số
            </li>
          </ul>
        </div>

        <div className="terms-checkbox">
          <label>
            <Form.Item
              name="agree"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, v) =>
                    v
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Bạn phải đồng ý với điều khoản")
                        ),
                },
              ]}
            >
              <input type="checkbox" />
            </Form.Item>
            <span>
              Tôi đồng ý với{" "}
              <a href="/terms" target="_blank" rel="noreferrer">
                Điều khoản
              </a>{" "}
              và
              <a href="/privacy" target="_blank" rel="noreferrer">
                {" "}
                Chính sách quyền riêng tư
              </a>
              .
            </span>
          </label>
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
          {isLoading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </Button>

        <div className="divider">
          <span>hoặc</span>
        </div>

        <SocialLogin onGoogleLogin={() => handleSocialLogin("Google")} />
        <div className="footer-links">
          <a href="/terms">Điều khoản sử dụng</a>
          <a href="/privacy">Chính sách bảo mật</a>
        </div>
      </Form>
    </div>
  );
};

export default SignUpPage;
