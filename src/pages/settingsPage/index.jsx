import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/memberSlice";
import { toast } from "react-toastify";
import "./index.scss";

// Icon components
const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BellIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const HelpIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const LogOutIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="9,18 15,12 9,6" />
  </svg>
);

function SettingsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const member = useSelector((store) => store.member);
  const isAuthenticated = !!member;

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
    },
    privacy: {
      profileVisibility: "public",
      showPhone: true,
      showEmail: false,
      allowMessages: true,
    },
    language: "vi",
    theme: "light",
    autoSave: true,
    twoFactorAuth: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSettingChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      console.log("🚪 Settings page - User confirmed logout");

      // Thực hiện logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(logout());

      // Chuyển về trang home
      navigate("/", { replace: true });
      console.log("✅ Settings page - Đã đăng xuất và chuyển về trang chủ");
      toast.success("Đăng xuất thành công");
    }
  };

  const settingsSections = [
    {
      title: "Tài khoản",
      icon: <UserIcon />,
      items: [
        {
          title: "Thông tin cá nhân",
          subtitle: "Chỉnh sửa thông tin tài khoản",
          action: () => navigate("/account"),
        },
        {
          title: "Đổi mật khẩu",
          subtitle: "Cập nhật mật khẩu bảo mật",
          action: () => navigate("/forgot"),
        },
      ],
    },

    {
      title: "Hỗ trợ",
      icon: <HelpIcon />,
      items: [
        {
          title: "Trung tâm trợ giúp",
          subtitle: "Tìm câu trả lời cho câu hỏi của bạn",
          action: () => console.log("Help center"),
        },
        {
          title: "Liên hệ hỗ trợ",
          subtitle: "Gửi phản hồi hoặc báo cáo lỗi",
          action: () => console.log("Contact support"),
        },
        {
          title: "Điều khoản sử dụng",
          subtitle: "Xem điều khoản và chính sách",
          action: () => navigate("/terms"),
        },
        {
          title: "Chính sách bảo mật",
          subtitle: "Thông tin về quyền riêng tư",
          action: () => navigate("/privacy"),
        },
      ],
    },
  ];

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Cài đặt</h1>
          <p>Quản lý tài khoản và tùy chọn ứng dụng</p>
        </div>

        <div className="settings-content">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="settings-section">
              <div className="section-header">
                <div className="section-icon">{section.icon}</div>
                <h2 className="section-title">{section.title}</h2>
              </div>

              <div className="section-items">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="setting-item">
                    <div className="item-content">
                      <h3 className="item-title">{item.title}</h3>
                      <p className="item-subtitle">{item.subtitle}</p>
                    </div>

                    <div className="item-control">
                      {item.toggle && (
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={item.value}
                            onChange={(e) => item.onChange(e.target.checked)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      )}

                      {item.select && (
                        <select
                          className="setting-select"
                          value={item.value}
                          onChange={(e) => item.onChange(e.target.value)}
                        >
                          {item.options.map((option, optionIndex) => (
                            <option key={optionIndex} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {item.action && (
                        <button className="action-button" onClick={item.action}>
                          <ChevronRightIcon />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="settings-section logout-section">
            <button className="logout-button" onClick={handleLogout}>
              <LogOutIcon />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
