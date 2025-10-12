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

const AuctionIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9.11 6 5.67 5.67-4.21 4.21-5.67-5.67a3 3 0 0 1 0-4.24 3 3 0 0 1 4.24 0z"/>
    <path d="M18.5 10.5 17 9l-5.67 5.67"/>
    <path d="M5.5 20.5 9 17"/>
    <circle cx="15" cy="15" r="1.5"/>
  </svg>
)

function Header() {
  const navigate = useNavigate()
  const [showMenuDropdown, setShowMenuDropdown] = useState(false)
  const [showSellerDropdown, setShowSellerDropdown] = useState(false)

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <div className="menu-wrapper">
            <button 
              className={`menu-btn ${showMenuDropdown ? 'active' : ''}`}
              onClick={() => setShowMenuDropdown(!showMenuDropdown)}
            >
              <MenuIcon />
            </button>
            {showMenuDropdown && (
              <div className="dropdown-menu menu-dropdown">
                <div className="menu-section">
                  <div className="menu-section-title">Tài khoản</div>
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
                  <Link 
                    to="/auction-register" 
                    className="dropdown-item"
                    onClick={() => setShowMenuDropdown(false)}
                  >
                    <div className="item-icon">🎯</div>
                    <span>Đăng ký đấu giá</span>
                  </Link>
                </div>
                <hr className="dropdown-divider" />
                <div className="menu-section">
                  <div className="menu-section-title">Dành cho người bán</div>
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
                  <Link 
                    to="/packages" 
                    className="dropdown-item"
                    onClick={() => setShowMenuDropdown(false)}
                  >
                    <div className="item-icon partner-badge">👥</div>
                    <span>Gói đấu giá</span>
                  </Link>
                </div>
                <hr className="dropdown-divider" />
                <div className="menu-section">
                  <Link 
                    to="/settings" 
                    className="dropdown-item"
                    onClick={() => setShowMenuDropdown(false)}
                  >
                    <div className="item-icon">⚙️</div>
                    <span>Cài đặt</span>
                  </Link>
                  <Link 
                    to="/login" 
                    className="dropdown-item"
                    onClick={() => setShowMenuDropdown(false)}
                  >
                    <div className="item-icon">🚪</div>
                    <span>Đăng xuất</span>
                  </Link>
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
              className="location-selector"
              onClick={() => setShowSellerDropdown(!showSellerDropdown)}
            >
              <span className="location-label">Dành cho người bán</span>
              <ChevronDownIcon />
            </button>
            {showSellerDropdown && (
              <div className="dropdown-menu seller-dropdown">
                <Link to="/packages" className="dropdown-item">
                  <div className="item-icon">📋</div>
                  <span>Gói đăng tin</span>
                </Link>
                <Link to="/packages" className="dropdown-item">
                  <div className="item-icon pro-badge">PRO</div>
                  <span>Gói đăng tin Pro</span>
                </Link>
                <Link to="/packages" className="dropdown-item">
                  <div className="item-icon partner-badge">👥</div>
                  <span>Gói đấu giá</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        <nav className="header-nav">
          <Link to="/" className="nav-link active">EcoXe</Link>
          <Link to="/oto" className="nav-link">Xe cộ</Link>
          <Link to="/battery" className="nav-link">Pin</Link>
        </nav>

        <div className="header-right">
          <button 
            className="icon-btn"
            onClick={() => navigate('/compare')}
            title="So sánh sản phẩm"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
            </svg>
          </button>
          <button 
            className="icon-btn"
            onClick={() => navigate('/saved')}
          >
            <HeartIcon />
          </button>
          <button 
            className="icon-btn"
            onClick={() => navigate('/auction-register')}
            title="Đăng ký đấu giá"
          >
            <AuctionIcon />
          </button>
          
          <button className="btn-primary" onClick={() => navigate('/login')}>Đăng nhập</button>
          <button className="btn-secondary" onClick={() => navigate('/post')}>Đăng tin</button>
          <button className="btn-secondary" onClick={() => navigate('/auction')}>Đấu giá</button>
        </div>
      </div>
    </header>
  )
}

export default Header
