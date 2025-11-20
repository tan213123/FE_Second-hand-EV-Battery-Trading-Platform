import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../../redux/memberSlice";
import "./index.scss";

// Icon Components
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </svg>
);

const HeartIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ChatIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

const AuctionIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m9.11 6 5.67 5.67-4.21 4.21-5.67-5.67a3 3 0 0 1 0-4.24 3 3 0 0 1 4.24 0z" />
    <path d="M18.5 10.5 17 9l-5.67 5.67" />
    <path d="M5.5 20.5 9 17" />
    <circle cx="15" cy="15" r="1.5" />
  </svg>
);

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const member = useSelector((store) => store.member);
  const isAuthenticated = !!member;
  const user = member;
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showSellerDropdown, setShowSellerDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Hàm xử lý click cho các tính năng yêu cầu đăng nhập
  const handleAuthRequired = (action) => {
    if (!isAuthenticated) {
      // Đóng tất cả dropdowns
      setShowMenuDropdown(false);
      setShowSellerDropdown(false);
      setShowUserDropdown(false);

      // Hiển thị thông báo
      alert(
        "🔒 Tính năng này yêu cầu đăng nhập!\n\nVui lòng đăng nhập để truy cập đầy đủ các tính năng của EcoXe."
      );

      // Chuyển đến trang đăng nhập
      setTimeout(() => {
        navigate("/login");
      }, 500);
      return;
    }
    action();
  };

  const handleLogout = () => {
    console.log("🚪 User clicked logout button");

    // Đóng tất cả dropdowns
    setShowUserDropdown(false);
    setShowMenuDropdown(false);
    setShowSellerDropdown(false);

    // Thực hiện logout (Redux + localStorage)
    dispatch(logoutAction());
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Chuyển về trang home sau khi đăng xuất - sử dụng replace để không lưu history
    navigate("/", { replace: true });
    console.log("✅ Đăng xuất thành công, đã chuyển về trang home");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-wrapper")) {
        setShowMenuDropdown(false);
      }
      if (!event.target.closest(".seller-menu")) {
        setShowSellerDropdown(false);
      }
      if (!event.target.closest(".user-menu")) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="header-wrapper">
      {!isAuthenticated && (
        <div className="auth-banner">
          <div className="auth-banner-content">
            <span className="auth-banner-icon">🔒</span>
            <span className="auth-banner-text">
              Đăng nhập để sử dụng đầy đủ tính năng EcoXe
            </span>
            <button
              className="auth-banner-btn"
              onClick={() => navigate("/login")}
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      )}
      <header className="main-header">
        <div className="header-container">
          <div className="header-left">
            <div className="menu-wrapper">
              <button
                className={`menu-btn ${showMenuDropdown ? "active" : ""}`}
                onClick={() => setShowMenuDropdown(!showMenuDropdown)}
              >
                <MenuIcon />
              </button>
              {showMenuDropdown && (
                <div className="dropdown-menu menu-dropdown">
                  <div className="menu-section">
                    <div className="menu-section-title">Tài khoản</div>
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/account"
                          className="dropdown-item"
                          onClick={() => setShowMenuDropdown(false)}
                        >
                          <UserIcon />
                          <span>Tài khoản của tôi</span>
                        </Link>
                        <Link
                          to="/my-posts"
                          className="dropdown-item"
                          onClick={() => setShowMenuDropdown(false)}
                        >
                          <div className="item-icon">📋</div>
                          <span>Tin đăng của tôi</span>
                        </Link>
                        <Link
                          to="/saved"
                          className="dropdown-item"
                          onClick={() => setShowMenuDropdown(false)}
                        >
                          <HeartIcon />
                          <span>Tin đã lưu</span>
                        </Link>
                        <Link
                          to="/compare"
                          className="dropdown-item"
                          onClick={() => setShowMenuDropdown(false)}
                        >
                          <div className="item-icon">⚖️</div>
                          <span>So sánh sản phẩm</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <div
                          className="dropdown-item disabled"
                          onClick={() => handleAuthRequired(() => {})}
                        >
                          <UserIcon />
                          <span>Tài khoản của tôi</span>
                          <span className="lock-icon">🔒</span>
                        </div>
                        <div
                          className="dropdown-item disabled"
                          onClick={() => handleAuthRequired(() => {})}
                        >
                          <div className="item-icon">📋</div>
                          <span>Tin đăng của tôi</span>
                          <span className="lock-icon">🔒</span>
                        </div>
                        <div
                          className="dropdown-item disabled"
                          onClick={() => handleAuthRequired(() => {})}
                        >
                          <HeartIcon />
                          <span>Tin đã lưu</span>
                          <span className="lock-icon">🔒</span>
                        </div>
                        <div
                          className="dropdown-item disabled"
                          onClick={() => handleAuthRequired(() => {})}
                        >
                          <div className="item-icon">⚖️</div>
                          <span>So sánh sản phẩm</span>
                          <span className="lock-icon">🔒</span>
                        </div>
                      </>
                    )}
                  </div>
                  <hr className="dropdown-divider" />
                  <div className="menu-section">
                    <div className="menu-section-title">Dành cho người bán</div>
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/post"
                          className="dropdown-item highlight"
                          onClick={() => setShowMenuDropdown(false)}
                        >
                          <div className="item-icon">➕</div>
                          <span>Đăng tin</span>
                        </Link>
                        <Link
                          to="/packages"
                          className="dropdown-item"
                          onClick={() => setShowMenuDropdown(false)}
                        >
                          <div className="item-icon">📋</div>
                          <span>Gói Đăng tin</span>
                        </Link>
                        <Link
                          to="/packages"
                          className="dropdown-item"
                          onClick={() => setShowMenuDropdown(false)}
                        >
                          <div className="item-icon pro-badge">PRO</div>
                          <span>Gói Đăng tin Pro</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <div
                          className="dropdown-item disabled highlight"
                          onClick={() => handleAuthRequired(() => {})}
                        >
                          <div className="item-icon">➕</div>
                          <span>Đăng tin</span>
                          <span className="lock-icon">🔒</span>
                        </div>
                        <div
                          className="dropdown-item disabled"
                          onClick={() => handleAuthRequired(() => {})}
                        >
                          <div className="item-icon">📋</div>
                          <span>Gói Đăng tin</span>
                          <span className="lock-icon">🔒</span>
                        </div>
                        <div
                          className="dropdown-item disabled"
                          onClick={() => handleAuthRequired(() => {})}
                        >
                          <div className="item-icon pro-badge">PRO</div>
                          <span>Gói Đăng tin Pro</span>
                          <span className="lock-icon">🔒</span>
                        </div>
                      </>
                    )}
                  </div>
                  <hr className="dropdown-divider" />
                  <div className="menu-section">
                    {isAuthenticated ? (
                      <Link
                        to="/settings"
                        className="dropdown-item"
                        onClick={() => setShowMenuDropdown(false)}
                      >
                        <div className="item-icon">⚙️</div>
                        <span>Cài đặt</span>
                      </Link>
                    ) : (
                      <>
                        <div
                          className="dropdown-item disabled"
                          onClick={() => handleAuthRequired(() => {})}
                        >
                          <div className="item-icon">⚙️</div>
                          <span>Cài đặt</span>
                          <span className="lock-icon">🔒</span>
                        </div>
                        <Link
                          to="/login"
                          className="dropdown-item"
                          onClick={() => setShowMenuDropdown(false)}
                        >
                          <div className="item-icon">🚪</div>
                          <span>Đăng nhập</span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link to="/" className="logo">
              <span className="logo-text">Eco</span>
              <span className="logo-highlight">Xe</span>
            </Link>
            <div className="seller-menu">
              <button
                className={`location-selector ${
                  !isAuthenticated ? "disabled" : ""
                }`}
                onClick={() => {
                  if (!isAuthenticated) {
                    handleAuthRequired(() => {});
                    return;
                  }
                  setShowSellerDropdown(!showSellerDropdown);
                }}
              >
                <span className="location-label">Dành cho người bán</span>
                <ChevronDownIcon />
                {!isAuthenticated && <span className="lock-icon">🔒</span>}
              </button>
              {showSellerDropdown && isAuthenticated && (
                <div className="dropdown-menu seller-dropdown">
                  <Link to="/packages" className="dropdown-item">
                    <div className="item-icon">📋</div>
                    <span>Gói đăng tin</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <nav className="header-nav">
            {isAuthenticated ? (
              <>
                <Link to="/bike" className="nav-link">
                  Xe điện
                </Link>
                <Link to="/oto" className="nav-link">
                  Xe cộ
                </Link>
                <Link to="/battery" className="nav-link">
                  Pin
                </Link>

                  <span
                      className="nav-link"
                      style={{ color: "#4ECDC4", fontWeight: 600, cursor: "pointer" }}
                      onClick={() => {
                          if (isAuthenticated) {
                              navigate("/my-subscriptions");
                          } else {
                              navigate("/login");
                          }
                      }}
                  >
    Subscription
  </span>
              </>
            ) : (
              <>
                <div
                  className="nav-link disabled"
                  onClick={() => handleAuthRequired(() => navigate("/bike"))}
                >
                  🔒 Xe điện
                </div>
                <div
                  className="nav-link disabled"
                  onClick={() => handleAuthRequired(() => navigate("/oto"))}
                >
                  🔒 Xe cộ
                </div>
                <div
                  className="nav-link disabled"
                  onClick={() => handleAuthRequired(() => navigate("/battery"))}
                >
                  🔒 Pin
                </div>


              </>

            )}
          </nav>

          <div className="header-right">
            <button
              className={`icon-btn ${!isAuthenticated ? "disabled" : ""}`}
              onClick={() => handleAuthRequired(() => navigate("/compare"))}
              title={
                isAuthenticated ? "So sánh sản phẩm" : "Vui lòng đăng nhập"
              }
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
              </svg>
              {!isAuthenticated && <span className="lock-badge">🔒</span>}
            </button>
            <button
              className={`icon-btn ${!isAuthenticated ? "disabled" : ""}`}
              onClick={() => handleAuthRequired(() => navigate("/saved"))}
              title={isAuthenticated ? "Tin đã lưu" : "Vui lòng đăng nhập"}
            >
              <HeartIcon />
              {!isAuthenticated && <span className="lock-badge">🔒</span>}
            </button>

            {!isAuthenticated ? (
              <button
                className="btn-primary"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </button>
            ) : (
              <div className="user-menu">
                <button
                  className="user-profile-btn"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <UserIcon />
                  <span className="user-name">
                    Xin chào, {user?.name || "User"}
                  </span>
                  <ChevronDownIcon />
                </button>
                {showUserDropdown && (
                  <div className="dropdown-menu user-dropdown">
                    <Link
                      to="/account"
                      className="dropdown-item"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <UserIcon />
                      <span>Tài khoản của tôi</span>
                    </Link>
                    <Link
                      to="/my-posts"
                      className="dropdown-item"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <div className="item-icon">📋</div>
                      <span>Tin đăng của tôi</span>
                    </Link>
                    <Link
                      to="/saved"
                      className="dropdown-item"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <HeartIcon />
                      <span>Tin đã lưu</span>
                    </Link>
                    {member?.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <div className="item-icon">⚙️</div>
                        <span>Quản trị Admin</span>
                      </Link>
                    )}
                    <Link
                      to="/settings"
                      className="dropdown-item"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <div className="item-icon">🔧</div>
                      <span>Cài đặt</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      <div className="item-icon">🚪</div>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              className={`btn-secondary ${!isAuthenticated ? "disabled" : ""}`}
              onClick={() => handleAuthRequired(() => navigate("/post"))}
            >
              {!isAuthenticated && <span className="lock-icon">🔒 </span>}
              Đăng tin
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
