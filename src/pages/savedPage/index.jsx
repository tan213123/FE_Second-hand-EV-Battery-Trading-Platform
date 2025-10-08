import { useState } from 'react'
import './index.scss'

// Icon Components
const HeartIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const HeartFilledIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF6B35" stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

function SavedPage({ onNavigate }) {
  const [savedCount] = useState(0)

  return (
    <div className="saved-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Tin đăng đã lưu ({savedCount} / 100)</h1>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">
              <HeartIcon />
            </div>
            <h2 className="empty-title">Bạn chưa lưu tin đăng nào!</h2>
            <p className="empty-description">
              Hãy bấm nút <HeartFilledIcon /> ở tin đăng để lưu và xem lại sau.
            </p>
            <button 
              className="btn-primary"
              onClick={() => onNavigate && onNavigate('home')}
            >
              Bắt đầu tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SavedPage
