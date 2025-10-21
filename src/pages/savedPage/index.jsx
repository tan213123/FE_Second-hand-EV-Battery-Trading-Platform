import { useState } from 'react'
import { useSaved } from '../../contexts/AppContext'
import DebugClearButton from '../../components/DebugClearButton'
import './index.scss'

// Icons
const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
)

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
)

function SavedPage() {
  const { savedItems, removeFromSaved, toggleSaved } = useSaved()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterCategory, setFilterCategory] = useState('all')

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'Ô tô điện', label: 'Ô tô điện' },
    { value: 'Xe máy điện', label: 'Xe máy điện' },
    { value: 'Pin xe điện', label: 'Pin xe điện' }
  ]

  const filteredItems = savedItems
    .filter(item => {
      const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.savedAt) - new Date(a.savedAt)
        case 'oldest':
          return new Date(a.savedAt) - new Date(b.savedAt)
        case 'price-high':
          return (b.price || 0) - (a.price || 0)
        case 'price-low':
          return (a.price || 0) - (b.price || 0)
        default:
          return 0
      }
    })

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Hôm nay'
    if (diffDays === 1) return 'Hôm qua'
    if (diffDays < 7) return `${diffDays} ngày trước`
    return date.toLocaleDateString('vi-VN')
  }

  return (
    <div className="saved-page">
      {/* DEBUG: Nút xóa localStorage - chỉ xuất hiện ở trang Saved */}
      <DebugClearButton />
      
      <div className="saved-container">
        <div className="page-header">
          <div className="header-content">
            <h1>Tin đã lưu</h1>
            <p>Bạn đã lưu {savedItems.length} sản phẩm</p>
          </div>
        </div>

        {savedItems.length > 0 && (
          <div className="controls">
            <div className="search-box">
              <SearchIcon />
              <input
                type="text"
                placeholder="Tìm kiếm trong tin đã lưu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-controls">
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="select"
              >
                <option value="newest">Mới lưu nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="price-high">Giá cao</option>
                <option value="price-low">Giá thấp</option>
              </select>
            </div>
          </div>
        )}

        {filteredItems.length > 0 ? (
          <div className="saved-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="saved-card">
                <div className="card-image">
                  <img 
                    src={item.image || '/api/placeholder/300/200'} 
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/300/200'
                    }}
                  />
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromSaved(item.id)}
                    title="Xóa khỏi danh sách"
                  >
                    <TrashIcon />
                  </button>
                  <span className="saved-date">Lưu {formatDate(item.savedAt)}</span>
                </div>

                <div className="card-content">
                  <div className="card-header">
                    <span className="category-badge">{item.category}</span>
                    {item.condition && (
                      <span className="condition-badge">{item.condition}</span>
                    )}
                  </div>

                  <h3 className="card-title">{item.title}</h3>

                  <div className="card-meta">
                    {item.location && (
                      <span className="location">
                        📍 {item.location}
                      </span>
                    )}
                    {item.year && (
                      <span className="year">📅 {item.year}</span>
                    )}
                  </div>

                  <div className="card-footer">
                    <div className="price">{formatPrice(item.price)}</div>
                    <div className="actions">
                      <button 
                        className="btn btn-outline"
                        onClick={() => toggleSaved(item)}
                      >
                        <HeartIcon filled={true} />
                      </button>
                      <button className="btn btn-primary">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <HeartIcon filled={false} />
            </div>
            <h3>
              {searchQuery || filterCategory !== 'all' 
                ? 'Không tìm thấy sản phẩm' 
                : 'Chưa có tin đã lưu'}
            </h3>
            <p>
              {searchQuery || filterCategory !== 'all'
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Nhấn vào icon trái tim trên các sản phẩm để lưu lại'}
            </p>
            <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
              Khám phá sản phẩm
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedPage
