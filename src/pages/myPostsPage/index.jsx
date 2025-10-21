import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import localStorageService from '../../services/localStorageService'
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

function MyPostsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [posts, setPosts] = useState([])
  const [selectedCities, setSelectedCities] = useState([])
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)

  // Load posts from localStorage khi component mount
  useEffect(() => {
    const loadPosts = () => {
      const myPosts = localStorageService.getMyPosts()
      
      // Format lại data để phù hợp với giao diện
      const formattedPosts = myPosts.map(post => ({
        id: post.id,
        title: post.title,
        price: new Intl.NumberFormat('vi-VN').format(post.price) + ' đ',
        location: post.location?.district && post.location?.city 
          ? `${post.location.district}, ${post.location.city}`
          : post.location?.city || post.location?.district || 'N/A',
        status: post.status || 'active',
        views: post.views || 0,
        likes: post.saves || 0,
        postedDate: new Date(post.createdAt).toISOString().split('T')[0],
        images: post.images?.length || 0,
        category: getCategoryName(post.category),
        imageUrl: post.images?.[0] || null,
        description: post.description,
        originalData: post // Lưu data gốc để dùng khi cần
      }))
      
      setPosts(formattedPosts)
    }
    
    loadPosts()
    
    // Reload khi có thay đổi trong localStorage
    const handleStorageChange = () => loadPosts()
    window.addEventListener('storage', handleStorageChange)
    
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLocationDropdown && !event.target.closest('.location-filter')) {
        setShowLocationDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showLocationDropdown])

  const getCategoryName = (category) => {
    const categoryNames = {
      'car': 'Ô tô điện',
      'electric': 'Xe máy điện', 
      'battery': 'Pin xe điện'
    }
    return categoryNames[category] || 'Khác'
  }

  // Danh sách thành phố cho filter
  const cities = [
    "Tp Hồ Chí Minh",
    "Hà Nội", 
    "Đà Nẵng",
    "Cần Thơ",
    "Hải Phòng",
    "Bình Dương",
    "Đồng Nai",
    "Vũng Tàu",
  ]

  // Helper function để lấy thành phố từ location
  const getCityFromLocation = (location) => {
    if (!location) return '';
    const parts = location.split(',');
    return parts.length > 1 ? parts[parts.length - 1].trim() : location.trim();
  }

  const handleDeletePost = (postId) => {
    if (window.confirm('Bạn có chắc muốn xóa tin đăng này?')) {
      const success = localStorageService.deletePost(postId)
      if (success) {
        // Reload posts sau khi xóa
        const myPosts = localStorageService.getMyPosts()
        const formattedPosts = myPosts.map(post => ({
          id: post.id,
          title: post.title,
          price: new Intl.NumberFormat('vi-VN').format(post.price) + ' đ',
          location: `${post.location?.district || 'N/A'}, ${post.location?.city || 'N/A'}`,
          status: post.status || 'active',
          views: post.views || 0,
          likes: post.saves || 0,
          postedDate: new Date(post.createdAt).toISOString().split('T')[0],
          images: post.images?.length || 0,
          category: getCategoryName(post.category),
          imageUrl: post.images?.[0] || null,
          description: post.description,
          originalData: post
        }))
        setPosts(formattedPosts)
        
        // Dispatch event để cập nhật HomePage
        window.dispatchEvent(new CustomEvent('postUpdated'))
        
        alert('Xóa tin đăng thành công!')
      } else {
        alert('Có lỗi xảy ra khi xóa tin đăng!')
      }
    }
  }

  const handleEditPost = (post) => {
    // Lưu dữ liệu bài đăng vào sessionStorage để sử dụng trong trang edit
    sessionStorage.setItem('editingPost', JSON.stringify(post.originalData))
    // Chuyển đến trang đăng tin với mode edit
    navigate('/post?mode=edit&id=' + post.id)
  }

  const handleViewDetail = (post) => {
    // Lưu dữ liệu bài đăng vào sessionStorage để sử dụng trong trang detail
    sessionStorage.setItem('viewingPost', JSON.stringify(post.originalData))
    // Chuyển đến trang chi tiết bài đăng
    navigate('/post-detail/' + post.id)
  }



  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Đang bán', class: 'status-active' },
      sold: { text: 'Đã bán', class: 'status-sold' },
      expired: { text: 'Hết hạn', class: 'status-expired' }
    }
    return badges[status] || badges.active
  }

  const filteredPosts = posts.filter(post => {
    // Filter theo tab
    if (activeTab !== 'all' && post.status !== activeTab) return false
    
    // Filter theo search query
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    
    // Filter theo location
    if (selectedCities.length > 0) {
      const postCity = getCityFromLocation(post.location);
      if (!selectedCities.some(city => postCity.includes(city))) return false
    }
    
    return true
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.updatedAt) - new Date(a.updatedAt)
    if (sortBy === 'oldest') return new Date(a.updatedAt) - new Date(b.updatedAt)
    if (sortBy === 'price-high') return parseInt(b.price) - parseInt(a.price)
    if (sortBy === 'price-low') return parseInt(a.price) - parseInt(b.price)
    return 0
  })

  return (
    <div className="my-posts-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>Tin đăng của tôi</h1>
            <p>Quản lý và theo dõi tất cả tin đăng của bạn</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/post')}>
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
            <div className="location-filter">
              <button 
                className={`filter-dropdown-btn ${selectedCities.length > 0 ? 'active' : ''}`}
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Khu vực {selectedCities.length > 0 && `(${selectedCities.length})`}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
              
              {showLocationDropdown && (
                <div className="dropdown-content">
                  <div className="dropdown-header">
                    <span>Chọn khu vực</span>
                    {selectedCities.length > 0 && (
                      <button 
                        className="clear-all"
                        onClick={() => setSelectedCities([])}
                      >
                        Xóa tất cả
                      </button>
                    )}
                  </div>
                  {cities.map((city) => (
                    <label key={city} className="dropdown-item">
                      <input
                        type="checkbox"
                        checked={selectedCities.includes(city)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCities([...selectedCities, city]);
                          } else {
                            setSelectedCities(selectedCities.filter(c => c !== city));
                          }
                        }}
                      />
                      <span>{city}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select">
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="views">Lượt xem</option>
              <option value="price-high">Giá cao</option>
              <option value="price-low">Giá thấp</option>
            </select>
            
            <button className="btn btn-outline">
              <FilterIcon />
              Bộ lọc khác
            </button>
          </div>
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả ({posts.length})
          </button>
          <button 
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Đang bán ({posts.filter(p => p.status === 'active').length})
          </button>
          <button 
            className={`tab ${activeTab === 'sold' ? 'active' : ''}`}
            onClick={() => setActiveTab('sold')}
          >
            Đã bán ({posts.filter(p => p.status === 'sold').length})
          </button>
          <button 
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Chờ duyệt ({posts.filter(p => p.status === 'pending').length})
          </button>
          <button 
            className={`tab ${activeTab === 'expired' ? 'active' : ''}`}
            onClick={() => setActiveTab('expired')}
          >
            Hết hạn ({posts.filter(p => p.status === 'expired').length})
          </button>
        </div>

        <div className="posts-grid">
          {filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-image">
                <img 
                  src={post.imageUrl || "/api/placeholder/300/200"} 
                  alt={post.title}
                  onError={(e) => {
                    e.target.src = "/api/placeholder/300/200"
                  }}
                />
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
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => handleEditPost(post)}
                    >
                      <EditIcon />
                      Sửa
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Xóa
                    </button>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleViewDetail(post)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
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
            <h3>
              {posts.length === 0 ? 'Chưa có tin đăng nào' : `Không tìm thấy tin đăng nào phù hợp`}
            </h3>
            <p>
              {posts.length === 0 
                ? 'Bắt đầu đăng tin đầu tiên của bạn để bán sản phẩm' 
                : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
              }
            </p>
            {posts.length === 0 && (
              <button className="btn btn-primary" onClick={() => navigate('/post')}>
                Đăng tin ngay
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPostsPage



