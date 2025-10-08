import { useState } from 'react'
import './index.scss'

// Icon Components
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
)

const MoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2"/>
    <circle cx="12" cy="12" r="2"/>
    <circle cx="12" cy="19" r="2"/>
  </svg>
)

const ChatBubbleIcon = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)

function ChatPage({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h1 className="sidebar-title">Chat</h1>
            <button className="more-btn">
              <MoreIcon />
            </button>
          </div>

          {/* Search Box */}
          <div className="search-box">
            <SearchIcon />
            <input
              type="text"
              placeholder="Nhập 3 ký tự để bắt đầu tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
    
          {/* Tabs */}
          <div className="chat-tabs">
            <button className="tab-btn active">
              Tất cả tin nhắn
            </button>
            <button className="tab-btn">
              Tin chưa đọc
            </button>
          </div>

          {/* Chat List - Empty State */}
          <div className="chat-list">
            {/* Empty for now */}
          </div>
        </div>

        {/* Main Content - Empty State */}
        <div className="chat-main">
          <div className="empty-state">
            <div className="empty-illustration">
              <div className="chat-avatars">
                <div className="avatar avatar-1">
                  <div className="avatar-face">👤</div>
                </div>
                <div className="chat-bubble bubble-1">
                  <div className="dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="avatar avatar-2">
                  <div className="avatar-face">👤</div>
                </div>
                <div className="chat-bubble bubble-2">
                  <div className="dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="sparkle sparkle-1">✨</div>
              </div>
            </div>
            <h2 className="empty-title">Bạn chưa có cuộc trò chuyện nào!</h2>
            <p className="empty-description">
              Trải nghiệm chat để làm rõ thông tin về mặt hàng trước khi bắt đầu thực hiện mua bán
            </p>
            <button 
              className="btn-home"
              onClick={() => onNavigate && onNavigate('home')}
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
