import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCompare } from '../../contexts/AppContext'
import { useSaved } from '../../context/SavedContext'
import './index.scss'

const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { toggleSaved, isSaved } = useSaved()
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  const inCompare = isInCompare(product.id)
  const saved = isSaved(product.id)

  const handleCompareClick = (e) => {
    e.stopPropagation()
    
    if (inCompare) {
      removeFromCompare(product.id)
      showNotify('Đã xóa khỏi danh sách so sánh')
    } else {
      const result = addToCompare(product)
      showNotify(result.message)
    }
  }

  const handleSaveClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleSaved(product)
  }

  const showNotify = (message) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleCardClick = () => {
    navigate(`/product/${product.id}`)
  }

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <div className="product-card" onClick={handleCardClick}>
      {showNotification && (
        <div className="notification">{notificationMessage}</div>
      )}
      
      <button 
        className={`save-btn ${saved ? 'saved' : ''}`}
        onClick={handleSaveClick}
        title={saved ? 'Bỏ lưu' : 'Lưu tin'}
      >
        <HeartIcon filled={saved} />
      </button>

      <div className="product-image">
        <img src={product.image || '/api/placeholder/300/200'} alt={product.title} />
        {product.imageCount && (
          <span className="image-count">📷 {product.imageCount}</span>
        )}
      </div>

      <div className="product-content">
        <h3 className="product-title">{product.title}</h3>
        
        <div className="product-meta">
          {product.year && <span>📅 {product.year}</span>}
          {product.condition && <span className="condition">{product.condition}</span>}
          {product.category && <span className="category">{product.category}</span>}
        </div>

        <div className="product-price">{formatPrice(product.price)}</div>
        
        {product.location && (
          <div className="product-location">📍 {product.location}</div>
        )}
      </div>
    </div>
  )
}

export default ProductCard
