import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className={`fab-container ${isOpen ? 'open' : ''}`}>
      <div className="fab-menu">
        <button 
          className="fab-option"
          onClick={() => {
            navigate('/post-listing')
            setIsOpen(false)
          }}
        >
          <span className="fab-icon">📝</span>
          <span className="fab-label">Đăng tin bán</span>
        </button>
        <button 
          className="fab-option"
          onClick={() => {
            navigate('/post-auction')
            setIsOpen(false)
          }}
        >
          <span className="fab-icon">🔨</span>
          <span className="fab-label">Đăng đấu giá</span>
        </button>
        <button 
          className="fab-option"
          onClick={() => {
            navigate('/auction')
            setIsOpen(false)
          }}
        >
          <span className="fab-icon">👁️</span>
          <span className="fab-label">Xem đấu giá</span>
        </button>
      </div>
      <button className="fab-button" onClick={toggleMenu}>
        <span className={`fab-icon ${isOpen ? 'rotate' : ''}`}>
          {isOpen ? '✕' : '+'}
        </span>
      </button>
    </div>
  )
}

export default FloatingActionButton
