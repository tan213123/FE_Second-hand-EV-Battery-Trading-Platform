import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCompare } from '../../contexts/CompareContext'
import './index.scss'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  const inCompare = isInCompare(product.id)

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

  const showNotify = (message) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleCardClick = () => {
    navigate(`/product/${product.id}`)
  }

  return (
    <div className="product-card" onClick={handleCardClick}>
      {showNotification && (
        <div className="notification">{notificationMessage}</div>
      )}
      
      <div className="product-image">
        <img src={product.image} alt={product.title} />
        <button 
          className={`btn-compare ${inCompare ? 'active' : ''}`}
          onClick={handleCompareClick}
          title={inCompare ? 'Xóa khỏi so sánh' : 'Thêm vào so sánh'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
          </svg>
        </button>
        <button className="btn-favorite">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <div className="product-price">
          {product.price?.toLocaleString('vi-VN')} đ
        </div>
        <div className="product-specs">
          {product.year && <span>{product.year}</span>}
          {product.mileage && <span>{product.mileage} km</span>}
          {product.location && <span>{product.location}</span>}
        </div>
        <div className="product-meta">
          <span className="product-time">{product.timeAgo || '2 giờ trước'}</span>
          <span className="product-location">📍 {product.region || 'Hà Nội'}</span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
