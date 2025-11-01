import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../config/api';
import './index.scss'

  // Format ngày về dd/MM/yyyy
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

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

  // Load posts từ API khi component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/article');
        let data = response.data;
        // Nếu API trả về object, chuyển thành mảng
        if (data && !Array.isArray(data)) {
          data = [data];
        }
        if (!Array.isArray(data)) data = [];
        // Lấy user hiện tại từ localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('User from localStorage:', user);
        console.log('API data:', data);
        // Lọc bài đăng theo memberId, ép kiểu về cùng kiểu (string)
        const myPosts = user ? data.filter(post => String(post.memberId) === String(user.memberId)) : [];
        console.log('Filtered myPosts:', myPosts);
        setPosts(myPosts.map(post => ({
          id: post.articleId,
          title: post.title || post.content || '',
          price: post.price ? post.price : 0,
          location: post.location || post.region || 'N/A',
          status: post.status || 'active',
          views: post.views || 0,
          likes: post.saves || 0,
          postedDate: post.createAt ? formatDate(post.createAt) : '',
          updatedAt: post.updateAt ? formatDate(post.updateAt) : (post.createAt ? formatDate(post.createAt) : ''),
          images: Array.isArray(post.images) ? post.images.length : (post.images ? 1 : 0),
          category: getCategoryName(post.articleType),
          imageUrl: post.mainImageUrl || (Array.isArray(post.images) && post.images.length > 0 ? post.images[0].url : null),
          description: post.content || '',
          originalData: post
        })));
      } catch (e) {
        setPosts([]);
      }
    };
    fetchPosts();
  }, []);

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

  const handleDeletePost = async (postId) => {
    if (window.confirm('Bạn có chắc muốn xóa tin đăng này?')) {
      try {
        await api.delete(`/article/${postId}`);
        // Sau khi xóa thành công, reload lại danh sách bài đăng từ API
        const response = await api.get('/article');
        const data = Array.isArray(response.data) ? response.data : [];
        setPosts(data.map(post => ({
          id: post.articleId,
          title: post.title || post.content || '',
          price: post.price ? post.price : 0,
          location: post.location || post.region || 'N/A',
          status: post.status || 'active',
          views: post.views || 0,
          likes: post.saves || 0,
          postedDate: post.createAt ? formatDate(post.createAt) : '',
          updatedAt: post.updateAt ? formatDate(post.updateAt) : (post.createAt ? formatDate(post.createAt) : ''),
          images: Array.isArray(post.images) ? post.images.length : (post.images ? 1 : 0),
          category: getCategoryName(post.articleType),
          imageUrl: post.mainImageUrl || (Array.isArray(post.images) && post.images.length > 0 ? post.images[0].url : null),
          description: post.content || '',
          originalData: post
        })));
        window.dispatchEvent(new CustomEvent('postUpdated'));
        alert('Xóa tin đăng thành công!');
      } catch (e) {
        alert('Có lỗi xảy ra khi xóa tin đăng!');
      }
    }
  }

  const handleEditPost = async (post) => {
    try {
      let endpoint = '';
      const data = post.originalData || post;
      const id = data.articleId || data.id;
      const type = data.category || data.articleType;
      if (type === 'car' || type === 'CAR_ARTICLE') {
        endpoint = `/article/car/${id}`;
      } else if (type === 'battery' || type === 'BATTERY_ARTICLE') {
        endpoint = `/article/battery/${id}`;
      } else {
        endpoint = `/article/motor/${id}`;
      }
      // Format lại ngày tháng trước khi gửi lên API
      const base = post.originalData || post;
      // Lấy user hiện tại từ localStorage để lấy memberId nếu thiếu
      const user = JSON.parse(localStorage.getItem('user'));
      const updatedData = {
        ...base,
        publicDate: formatDate(base.publicDate),
        createAt: formatDate(base.createAt),
        updateAt: formatDate(base.updateAt),
        origin: base.origin || 'Không xác định',
        milesTraveled: base.milesTraveled != null ? base.milesTraveled : 0,
        licensesPlate: base.licensesPlate || 'Chưa có',
        year: base.year != null ? base.year : new Date().getFullYear(),
        brand: base.brand || 'Không xác định',
        warrantyMonths: base.warrantyMonths != null ? base.warrantyMonths : 1,
        vehicleCapacity: base.vehicleCapacity != null ? base.vehicleCapacity : 1,
        model: base.model || base.title || base.content || 'Không xác định',
        numberOfSeat: base.numberOfSeat != null ? base.numberOfSeat : 1,
        type: base.type || base.articleType || 'Khác',
        price: base.price != null ? base.price : 0,
        title: base.title || base.content || base.model || 'Không có tiêu đề',
        location: base.location || base.region || 'Không xác định',
        status: base.status || 'active',
        memberId: base.memberId || (user ? user.memberId : ''),
        images: Array.isArray(base.images) ? base.images : [],
        views: base.views != null ? base.views : 0,
        saves: base.saves != null ? base.saves : 0,
        description: base.content || '',
        // Thêm các trường khác nếu backend yêu cầu
      };
      await api.put(endpoint, updatedData);
      // Sau khi cập nhật thành công, reload lại danh sách bài đăng từ API
      const response = await api.get('/article');
      let articlesData = response.data;
      if (articlesData && !Array.isArray(articlesData)) {
        articlesData = [articlesData];
      }
      if (!Array.isArray(articlesData)) articlesData = [];
  // Lấy user hiện tại từ localStorage
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const myPosts = currentUser ? articlesData.filter(p => String(p.memberId) === String(currentUser.memberId)) : [];
  setPosts(myPosts.map(p => ({
        id: p.articleId,
        title: p.title || p.content || '',
        price: p.price ? p.price : 0,
        location: p.location || p.region || 'N/A',
        status: p.status || 'active',
        views: p.views || 0,
        likes: p.saves || 0,
        postedDate: p.createAt ? formatDate(p.createAt) : '',
        updatedAt: p.updateAt ? formatDate(p.updateAt) : (p.createAt ? formatDate(p.createAt) : ''),
        images: Array.isArray(p.images) ? p.images.length : (p.images ? 1 : 0),
        category: getCategoryName(p.articleType),
        imageUrl: p.mainImageUrl || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0].url : null),
        description: p.content || '',
        originalData: p
      })));
      window.dispatchEvent(new CustomEvent('postUpdated'));
      alert('Cập nhật bài đăng thành công!');
    } catch (e) {
      alert('Có lỗi xảy ra khi cập nhật bài đăng!');
    }
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
    if (activeTab === 'all') {
      // Hiển thị tất cả bài đăng của user
      return true;
    }
    if (activeTab === 'active') {
      // Hiển thị bài đăng đang bán và cả bài đăng vừa tạo (DRAFT)
      if (post.status === 'active' || post.status === 'DRAFT') {
        // ...filter tiếp theo
        return true; // Allow active and DRAFT posts
      } else {
        return false;
      }
    } else {
      // Các tab khác vẫn filter như cũ
      if (post.status !== activeTab) return false;
    }
    
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
    if (sortBy === 'price-high') return Number(b.price) - Number(a.price)
    if (sortBy === 'price-low') return Number(a.price) - Number(b.price)
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
                  src={post.imageUrl || "https://via.placeholder.com/300x200"} 
                  alt={post.title}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200"
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



