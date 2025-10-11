import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './index.scss'

// Icon Components
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
)

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)

const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 10l5 5 5-5z"/>
  </svg>
)

function Header() {
  const navigate = useNavigate()
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showSellerDropdown, setShowSellerDropdown] = useState(false)

  return (
    <header className="main-header">
      <div className="header-container">
        {/* Left Section */}
        <div className="header-left">
          <button className="menu-btn">
            <MenuIcon />
          </button>
          <Link to="/" className="logo">
            <span className="logo-text">Eco</span>
            <span className="logo-highlight">Xe</span>
          </Link>
          <div className="seller-menu">
            <button 
              className="location-selector"
              onClick={() => setShowSellerDropdown(!showSellerDropdown)}
            >
              <span className="location-label">Dành cho người bán</span>
              <ChevronDownIcon />
            </button>
            {showSellerDropdown && (
              <div className="dropdown-menu seller-dropdown">
                <Link to="/my-posts" className="dropdown-item">
                  <div className="item-icon">📋</div>
                  <span>Quản lý tin</span>
                </Link>
                <Link to="/pro" className="dropdown-item">
                  <div className="item-icon pro-badge">PRO</div>
                  <span>Gói Pro</span>
                </Link>
                <Link to="/partner" className="dropdown-item">
                  <div className="item-icon partner-badge">👥</div>
                  <span>Dành cho Đối tác</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Center Section - Navigation */}
        <nav className="header-nav">
          <Link 
            to="/" 
            className="nav-link active">
            EcoXe
          </Link>
          <Link 
            to="/oto" 
            className="nav-link">
            Xe cộ
          </Link>
          <Link 
            to="/battery" 
            className="nav-link">
            Pin
          </Link>
        </nav>

        {/* Right Section */}
        <div className="header-right">
          <button 
            className="icon-btn"
            onClick={() => navigate('/saved')}
          >
            <HeartIcon />
          </button>
          <button 
            className="icon-btn"
            onClick={() => navigate('/chat')}
          >
            <ChatIcon />
          </button>
          <button className="icon-btn">
            <BellIcon />
          </button>
          
          <button className="btn-primary" onClick={() => navigate('/login')}>Đăng nhập</button>
          <button className="btn-secondary">Đăng tin</button>
          
          <div className="user-menu">
            <button 
              className="user-btn"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <UserIcon />
              <ChevronDownIcon />
            </button>
            {showUserDropdown && (
              <div className="dropdown-menu">
                <Link to="/account" className="dropdown-item">Tài khoản của tôi</Link>
                <Link to="/my-posts" className="dropdown-item">Tin đăng của tôi</Link>
                <Link to="/saved" className="dropdown-item">Tin đã lưu</Link>
                <Link to="/settings" className="dropdown-item">Cài đặt</Link>
                <hr className="dropdown-divider" />
                <Link to="/login" className="dropdown-item">Đăng xuất</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
