import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import './index.scss'

// Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
  </svg>
)

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
  </svg>
)

function MyPostsPage({ onNavigate }) {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [userPosts, setUserPosts] = useState([])

  // Lấy tin đăng của user từ localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      const userKey = `listings_${user.id || user.memberId}`
      const listings = JSON.parse(localStorage.getItem(userKey) || '[]')
      
      // Chuyển đổi format để phù hợp với UI hiện tại
      const formattedListings = listings.map(listing => ({
        id: listing.id,
        title: listing.title,
        price: new Intl.NumberFormat('vi-VN').format(listing.price) + ' đ',
        location: `${listing.location?.city || 'Không xác định'}`,
        status: listing.status || 'active',
        views: Math.floor(Math.random() * 200) + 50, // Random views
        likes: Math.floor(Math.random() * 20) + 1, // Random likes
        postedDate: listing.postedAt ? listing.postedAt.split('T')[0] : new Date().toISOString().split('T')[0],
        images: listing.images?.length || 0,
        category: getCategoryName(listing.category),
        description: listing.description,
        brand: listing.brand,
        condition: listing.condition,
        contactPhone: listing.contactPhone,
        memberId: listing.memberId
      }))
      
      setUserPosts(formattedListings)
    } else {
      setUserPosts([])
    }
  }, [user, isAuthenticated])

  const getCategoryName = (category) => {
    const categoryMap = {
      'car': 'Ô tô điện',
      'electric': 'Xe máy điện', 
      'battery': 'Pin xe điện'
    }
    return categoryMap[category] || category
  }

  const handleDeletePost = (postId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin đăng này?')) {
      const userKey = `listings_${user.id || user.memberId}`
      const updatedListings = userPosts.filter(post => post.id !== postId)
      
      // Cập nhật localStorage
      const originalListings = JSON.parse(localStorage.getItem(userKey) || '[]')
      const updatedOriginalListings = originalListings.filter(listing => listing.id !== postId)
      localStorage.setItem(userKey, JSON.stringify(updatedOriginalListings))
      
      // Cập nhật state
      setUserPosts(updatedListings)
      
      alert('Đã xóa tin đăng thành công!')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Đang bán', class: 'status-active' },
      sold: { text: 'Đã bán', class: 'status-sold' },
      pending: { text: 'Chờ duyệt', class: 'status-pending' },
      expired: { text: 'Hết hạn', class: 'status-expired' }
    }
    return badges[status] || badges.active
  }

  const filteredPosts = userPosts.filter(post => {
    if (activeTab === 'all') return true
    return post.status === activeTab
  })

  return (
    <div className="my-posts-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>Tin đăng của tôi</h1>
            <p>Quản lý và theo dõi tất cả tin đăng của bạn</p>
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate && onNavigate('oto')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Đăng tin mới
          </button>
        </div>

        <div className="controls">
          <div className="search-box">
            <SearchIcon />
            <input 
              type="text" 
              placeholder="Tìm kiếm tin đăng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-controls">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select">
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="views">Lượt xem</option>
              <option value="price-high">Giá cao</option>
              <option value="price-low">Giá thấp</option>
            </select>
            
            <button className="btn btn-outline">
              <FilterIcon />
              Bộ lọc
            </button>
          </div>
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả ({userPosts.length})
          </button>
          <button 
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Đang bán ({userPosts.filter(p => p.status === 'active').length})
          </button>
          <button 
            className={`tab ${activeTab === 'sold' ? 'active' : ''}`}
            onClick={() => setActiveTab('sold')}
          >
            Đã bán ({userPosts.filter(p => p.status === 'sold').length})
          </button>
          <button 
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Chờ duyệt ({userPosts.filter(p => p.status === 'pending').length})
          </button>
          <button 
            className={`tab ${activeTab === 'expired' ? 'active' : ''}`}
            onClick={() => setActiveTab('expired')}
          >
            Hết hạn ({userPosts.filter(p => p.status === 'expired').length})
          </button>
        </div>

        <div className="posts-grid">
          {filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-image">
                <img src="/api/placeholder/300/200" alt={post.title} />
                <div className="image-overlay">
                  <span className="image-count">{post.images} ảnh</span>
                  <div className={`status-badge ${getStatusBadge(post.status).class}`}>
                    {getStatusBadge(post.status).text}
                  </div>
                </div>
              </div>
              
              <div className="post-content">
                <div className="post-header">
                  <h3 className="post-title">{post.title}</h3>
                  <button className="more-btn">
                    <MoreIcon />
                  </button>
                </div>
                
                <div className="post-meta">
                  <span className="category">{post.category}</span>
                  <span className="location">{post.location}</span>
                </div>
                
                <div className="post-stats">
                  <div className="stat">
                    <EyeIcon />
                    <span>{post.views} lượt xem</span>
                  </div>
                  <div className="stat">
                    <HeartIcon />
                    <span>{post.likes} thích</span>
                  </div>
                  <span className="date">Đăng {post.postedDate}</span>
                </div>
                
                <div className="post-footer">
                  <div className="price">{post.price}</div>
                  <div className="actions">
                    <button className="btn btn-sm btn-outline">
                      <EditIcon />
                      Sửa
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Xóa
                    </button>
                    <button className="btn btn-sm btn-primary">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && isAuthenticated && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <h3>Chưa có tin đăng nào</h3>
            <p>Bắt đầu đăng tin đầu tiên của bạn để bán sản phẩm</p>
            <a href="/post" className="btn btn-primary">
              Đăng tin ngay
            </a>
          </div>
        )}

        {!isAuthenticated && (
          <div className="empty-state">
            <div className="empty-icon">🔐</div>
            <h3>Vui lòng đăng nhập</h3>
            <p>Bạn cần đăng nhập để xem và quản lý tin đăng của mình</p>
            <a href="/login" className="btn btn-primary">
              Đăng nhập ngay
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPostsPage



