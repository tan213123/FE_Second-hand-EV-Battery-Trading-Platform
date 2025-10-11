import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
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

function Header({ onNavigate }) {
  const [showSellerDropdown, setShowSellerDropdown] = useState(false)
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false)
  const searchRef = useRef(null)
  const { user, isLoggedIn, logout } = useAuth()

  // Mock notifications data - in real app, this would come from API
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Đăng tin thành công',
      message: 'Tin đăng "Honda Wave RSX 2023" của bạn đã được duyệt và hiển thị trên website.',
      time: '2 phút trước',
      read: false,
      icon: '✅'
    },
    {
      id: 2,
      type: 'info',
      title: 'Tin nhắn mới',
      message: 'Bạn có tin nhắn mới từ người dùng quan tâm đến sản phẩm "Yamaha Exciter 155".',
      time: '1 giờ trước',
      read: false,
      icon: '💬'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Tin đăng sắp hết hạn',
      message: 'Tin đăng "Suzuki Raider 150" sẽ hết hạn trong 3 ngày. Gia hạn ngay để tiếp tục hiển thị.',
      time: '3 giờ trước',
      read: false,
      icon: '⚠️'
    }
  ]

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length


  // Mock suggestions data
  const mockSuggestions = [
    'Tesla Model 3',
    'Tesla Model Y', 
    'Tesla Model S',
    'Tesla Model X',
    'VinFast VF8',
    'VinFast VF9',
    'BMW i3',
    'BMW iX',
    'Mercedes EQS',
    'Audi e-tron',
    'Porsche Taycan',
    'Hyundai Ioniq 5',
    'KIA EV6',
    'MG ZS EV',
    'Wuling Hongguang Mini EV',
    'VinFast Evo 200',
    'Honda PCX Electric',
    'Yamaha E01',
    'SYM E-Bike 3.0',
    'Kymco i-One X',
    'PGO Ur1'
  ]

  // Filter suggestions based on search term
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 8)) // Show max 8 suggestions
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchTerm])

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
    onNavigate && onNavigate('search')
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Handle search submit
  const handleSearchSubmit = () => {
    setShowSuggestions(false)
    onNavigate && onNavigate('search')
  }

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="main-header">
      <div className="header-container">
        {/* Left Section */}
        <div className="header-left">
          <button 
            className="menu-btn"
            onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
          >
            <MenuIcon />
          </button>
          <div className="logo" onClick={() => onNavigate && onNavigate('home')}>
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#gradient1)"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="url(#gradient2)" strokeWidth="2" fill="none"/>
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6"/>
                    <stop offset="100%" stopColor="#A855F7"/>
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6"/>
                    <stop offset="100%" stopColor="#A855F7"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-main">Eco</span>
              <span className="logo-accent">Xe</span>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="header-center">
          <div className="search-container" ref={searchRef}>
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input 
                type="text" 
                placeholder="Tìm kiếm ô tô điện, xe máy điện..." 
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
              />
              <button 
                className="search-btn"
                onClick={handleSearchSubmit}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
            </div>
            
            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <svg className="suggestion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <span className="suggestion-text">{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>

        {/* Right Section */}
        <div className="header-right">
          <div className="seller-menu">
            <button 
              className="seller-btn"
              onClick={() => setShowSellerDropdown(!showSellerDropdown)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6"/>
              </svg>
              <span>Bán hàng</span>
              <ChevronDownIcon />
            </button>
            {showSellerDropdown && (
              <div className="dropdown-menu seller-dropdown">
                <button className="dropdown-item">
                  <div className="item-icon">📋</div>
                  <span>Quản lý tin</span>
                </button>
                <button className="dropdown-item">
                  <div className="item-icon pro-badge">PRO</div>
                  <span>Gói Pro</span>
                </button>
                <button className="dropdown-item">
                  <div className="item-icon partner-badge">👥</div>
                  <span>Dành cho Đối tác</span>
                </button>
              </div>
            )}
          </div>
          
          <button className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14m7-7H5"/>
            </svg>
            <span>Đăng tin</span>
          </button>
          
          {/* Notification Button */}
          <div className="notification-menu">
            <button 
              className="notification-btn"
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            
            {showNotificationDropdown && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Thông báo</h3>
                  <button 
                    className="view-all-btn"
                    onClick={() => {
                      onNavigate && onNavigate('notifications');
                      setShowNotificationDropdown(false);
                    }}
                  >
                    Xem tất cả
                  </button>
                </div>
                <div className="notification-list">
                  {notifications.slice(0, 3).map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    >
                      <div className="notification-icon">{notification.icon}</div>
                      <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">{notification.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hamburger Menu Overlay */}
      {showHamburgerMenu && (
        <div className="hamburger-overlay" onClick={() => setShowHamburgerMenu(false)}>
          <div className="hamburger-menu" onClick={(e) => e.stopPropagation()}>
            <div className="hamburger-header">
              <div className="profile-section">
                <div className="profile-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" />
                  ) : (
                    <UserIcon />
                  )}
                </div>
                <div className="profile-info">
                  <h3>{isLoggedIn ? user?.name || 'Người dùng' : 'Tài khoản'}</h3>
                  <p>{isLoggedIn ? `Xin chào, ${user?.name || 'bạn'}!` : 'Đăng nhập để sử dụng'}</p>
                </div>
              </div>
              <button 
                className="close-btn"
                onClick={() => setShowHamburgerMenu(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <div className="hamburger-content">
              <div className="menu-section">
                <h4>Trang chủ</h4>
                <button 
                  className="menu-item"
                  onClick={() => {
                    onNavigate && onNavigate('home');
                    setShowHamburgerMenu(false);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                  <span>Trang chủ</span>
                </button>
        </div>

              <div className="menu-section">
                <h4>Mua bán</h4>
                <button 
                  className="menu-item"
                  onClick={() => {
                    onNavigate && onNavigate('oto');
                    setShowHamburgerMenu(false);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                  <span>Xe ô tô điện</span>
                </button>
                <button 
                  className="menu-item"
                  onClick={() => {
                    onNavigate && onNavigate('bike');
                    setShowHamburgerMenu(false);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 12a7 7 0 1 0 14 0 7 7 0 0 0-14 0zm12.5-1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    <path d="M12 6v6l4 2"/>
                    <path d="M12 6L8 8l4 2"/>
                    <path d="M12 6l4 2-4 2"/>
                  </svg>
                  <span>Xe máy điện</span>
                </button>
                <button 
                  className="menu-item"
                  onClick={() => {
                    onNavigate && onNavigate('battery');
                    setShowHamburgerMenu(false);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="7" width="16" height="10" rx="2" ry="2"/>
                    <line x1="22" y1="11" x2="22" y2="13"/>
                    <line x1="6" y1="11" x2="6" y2="13"/>
                    <line x1="10" y1="11" x2="10" y2="13"/>
                    <line x1="14" y1="11" x2="14" y2="13"/>
                  </svg>
                  <span>Pin</span>
                </button>
                <button 
                  className="menu-item"
                  onClick={() => {
                    onNavigate && onNavigate('auction');
                    setShowHamburgerMenu(false);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0-.83-.83-.83-2.17 0-3l8.5-8.5"/>
                    <path d="M17.64 15L22 10.64"/>
                    <path d="M20.91 11.7l-1.25-1.25"/>
                    <path d="M15.91 6.7l-1.25-1.25"/>
                    <path d="M20.91 6.7l-1.25 1.25"/>
                    <path d="M15.91 11.7l-1.25 1.25"/>
                  </svg>
                  <span>Đấu giá</span>
                </button>
              </div>

              <div className="menu-section">
                <h4>Tài khoản</h4>
                <button 
                  className="menu-item"
                  onClick={() => {
                    onNavigate && onNavigate('account');
                    setShowHamburgerMenu(false);
                  }}
                >
                  <UserIcon />
                  <span>Tài khoản của tôi</span>
                </button>
                <button 
                  className="menu-item"
                  onClick={() => {
                    onNavigate && onNavigate('my-posts');
                    setShowHamburgerMenu(false);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  <span>Tin đăng của tôi</span>
                </button>
          <button 
                  className="menu-item"
                  onClick={() => {
                    onNavigate && onNavigate('saved');
                    setShowHamburgerMenu(false);
                  }}
          >
            <HeartIcon />
                  <span>Tin đã lưu</span>
                </button>
                <button 
                  className="menu-item"
                  onClick={() => {
                    onNavigate && onNavigate('settings');
                    setShowHamburgerMenu(false);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  <span>Cài đặt</span>
                </button>
                <button 
                  className="menu-item"
                  onClick={() => {
                    onNavigate && onNavigate('transaction-history');
                    setShowHamburgerMenu(false);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  <span>Lịch sử giao dịch</span>
                </button>
              </div>

              <div className="menu-section">
                <h4>Khác</h4>
                <button 
                  className="menu-item"
                  onClick={() => {
                    onNavigate && onNavigate('notifications');
                    setShowHamburgerMenu(false);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  <span>Thông báo</span>
          </button>
          <button 
                  className="menu-item"
                  onClick={() => {
                    onNavigate && onNavigate('chat');
                    setShowHamburgerMenu(false);
                  }}
          >
            <ChatIcon />
                  <span>Tin nhắn</span>
          </button>
            <button 
                  className="menu-item"
                  onClick={() => {
                    if (isLoggedIn) {
                      logout();
                      onNavigate && onNavigate('home');
                    } else {
                      onNavigate && onNavigate('login');
                    }
                    setShowHamburgerMenu(false);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16,17 21,12 16,7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  <span>{isLoggedIn ? 'Đăng xuất' : 'Đăng nhập'}</span>
            </button>
              </div>
          </div>
        </div>
      </div>
      )}
    </header>
  )
}

export default Header
