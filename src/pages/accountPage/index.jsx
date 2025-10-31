import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { profileService, mockProfileData, mockUserStats, mockUserPosts, mockUserReviews } from '../../services/profileService'
import './index.scss'

function AccountPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    yearOfBirth: '',
    sex: '',
    bio: 'Người đam mê xe điện và công nghệ.'
  })
  const [userStats, setUserStats] = useState({
    totalPosts: 0,
    activePosts: 0,
    soldItems: 0,
    rating: 0,
    totalReviews: 0
  })
  const [userPosts, setUserPosts] = useState([])
  const [userReviews, setUserReviews] = useState([])

  // Load profile data when component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    loadProfileData()
  }, [isAuthenticated, navigate])

  // Load profile data from API
  const loadProfileData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // In development, use mock data
      const isDevelopment = process.env.NODE_ENV === 'development'
      
      if (isDevelopment) {
        // Use mock data for development
        setProfile(mockProfileData)
        setUserStats(mockUserStats)
        setUserPosts(mockUserPosts)
        setUserReviews(mockUserReviews)
      } else {
        // Use real API calls
        const [profileResult, statsResult, postsResult, reviewsResult] = await Promise.all([
          profileService.getProfile(),
          profileService.getUserStats(),
          profileService.getUserPosts(),
          profileService.getUserReviews()
        ])

        if (profileResult.success) {
          setProfile(profileResult.data)
        } else {
          setError(profileResult.error)
        }

        if (statsResult.success) {
          setUserStats(statsResult.data)
        }

        if (postsResult.success) {
          setUserPosts(postsResult.data)
        }

        if (reviewsResult.success) {
          setUserReviews(reviewsResult.data)
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error)
      setError('Không thể tải dữ liệu profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    
    try {
      const isDevelopment = process.env.NODE_ENV === 'development'
      
      if (isDevelopment) {
        // Simulate API call in development
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSuccess('Cập nhật profile thành công!')
        setIsEditing(false)
      } else {
        // Use real API call
        const result = await profileService.updateProfile(profile)
        
        if (result.success) {
          setSuccess(result.message)
          setIsEditing(false)
          // Reload profile data to get updated info
          await loadProfileData()
        } else {
          setError(result.error)
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      setError('Không thể cập nhật profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset to original profile data
    setProfile(mockProfileData) // In development, reset to mock data
    setIsEditing(false)
    setError(null)
    setSuccess(null)
  }

  // Handle avatar upload
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setSaving(true)
    setError(null)
    
    try {
      const isDevelopment = process.env.NODE_ENV === 'development'
      
      if (isDevelopment) {
        // Simulate upload in development
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSuccess('Cập nhật ảnh đại diện thành công!')
        // Update profile with new avatar URL
        setProfile(prev => ({ ...prev, avatar: URL.createObjectURL(file) }))
      } else {
        // Use real API call
        const result = await profileService.uploadAvatar(file)
        
        if (result.success) {
          setSuccess(result.message)
          setProfile(prev => ({ ...prev, avatar: result.data.avatarUrl }))
        } else {
          setError(result.error)
        }
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setError('Không thể cập nhật ảnh đại diện')
    } finally {
      setSaving(false)
    }
  }

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return <div>Đang chuyển hướng...</div>
  }

  // Show loading state
  if (loading) {
    return (
      <div className="account-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="account-page">

      <div className="profile">
        <div className="profile-cover">
          <div className="cover-overlay" />
        </div>

        <div className="profile-header container">
          <div className="avatar-wrap">
            <img className="avatar" src={profile.avatar || "https://via.placeholder.com/120x120/4ECDC4/FFFFFF?text=Avatar"} alt="avatar" />
            <input 
              type="file" 
              id="avatar-upload" 
              accept="image/*" 
              onChange={handleAvatarUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="avatar-upload" className="btn small secondary">
              {saving ? 'Đang tải...' : 'Đổi ảnh'}
            </label>
          </div>
          <div className="identity">
            <h1 className="name">{profile.name || 'Chưa cập nhật tên'}</h1>
            <div className="meta">
              <span className="email">📧 {profile.email || 'Chưa có email'}</span>
              <span className="dot">•</span>
              <span className="location">📍 {profile.address || 'Chưa có địa chỉ'}</span>
            </div>
            <p className="bio">{profile.bio}</p>
            <div className="quick-actions">
              <button className="btn primary" onClick={() => navigate('/my-posts')}>Tin đăng của tôi</button>
              <button className="btn outline" onClick={() => navigate('/saved')}>Tin đã lưu</button>
              <button className="btn outline" onClick={() => navigate('/settings')}>Cài đặt</button>
            </div>
          </div>
          <div className="stats">
            <div className="stat">
              <div className="value">{userStats.activePosts}</div>
              <div className="label">Tin đang bán</div>
            </div>
            <div className="stat">
              <div className="value">{userStats.rating}</div>
              <div className="label">Đánh giá</div>
            </div>
            <div className="stat">
              <div className="value">{userStats.soldItems}</div>
              <div className="label">Đã bán</div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="tabs">
            <button className={`tab-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Tổng quan</button>
            <button className={`tab-link ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>Tin đăng</button>
            <button className={`tab-link ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Đánh giá</button>
            <button className={`tab-link ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>Giới thiệu</button>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="container">
            <div className="alert alert-error">
              <span>❌ {error}</span>
              <button onClick={() => setError(null)}>✕</button>
            </div>
          </div>
        )}
        
        {success && (
          <div className="container">
            <div className="alert alert-success">
              <span>✅ {success}</span>
              <button onClick={() => setSuccess(null)}>✕</button>
            </div>
          </div>
        )}

        <div className="container content-grid">
          <aside className="sidebar">
            <nav className="side-nav">
              <button className="side-link active">Hồ sơ</button>
              <button className="side-link" onClick={() => navigate('/my-posts')}>Tin đăng</button>
              <button className="side-link" onClick={() => navigate('/saved')}>Tin đã lưu</button>
              <button className="side-link" onClick={() => navigate('/settings')}>Cài đặt</button>
            </nav>

            <div className="info-card">
              <h3>Thông tin cá nhân</h3>
              <div className="info-row">
                <span>Họ và tên</span>
                <strong>{profile.name || 'Chưa cập nhật'}</strong>
              </div>
              <div className="info-row">
                <span>Email</span>
                <strong>{profile.email || 'Chưa cập nhật'}</strong>
              </div>
              <div className="info-row">
                <span>Số điện thoại</span>
                <strong>{profile.phone || 'Chưa cập nhật'}</strong>
              </div>
              <div className="info-row">
                <span>Địa chỉ</span>
                <strong>{profile.address || 'Chưa cập nhật'}</strong>
              </div>
              <div className="info-row">
                <span>Năm sinh</span>
                <strong>{profile.yearOfBirth || 'Chưa cập nhật'}</strong>
              </div>
              <div className="info-row">
                <span>Giới tính</span>
                <strong>{profile.sex === 'male' ? 'Nam' : profile.sex === 'female' ? 'Nữ' : profile.sex || 'Chưa cập nhật'}</strong>
              </div>
            </div>
          </aside>

          <main className="main">
            {activeTab === 'overview' && (
              <>
                <div className="card">
                  <div className="card-header">
                    <h2>Thông tin tài khoản</h2>
                    <p>Quản lý thông tin cá nhân của bạn</p>
                    <button 
                      className="btn primary"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin'}
                    </button>
                  </div>
                  
                  {!isEditing ? (
                    // View Mode - Hiển thị thông tin
                    <div className="profile-info">
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Họ và tên</label>
                          <div className="value">{profile.name || 'Chưa cập nhật'}</div>
                        </div>
                        <div className="info-item">
                          <label>Email</label>
                          <div className="value">{profile.email || 'Chưa cập nhật'}</div>
                        </div>
                        <div className="info-item">
                          <label>Số điện thoại</label>
                          <div className="value">{profile.phone || 'Chưa cập nhật'}</div>
                        </div>
                        <div className="info-item">
                          <label>Địa chỉ</label>
                          <div className="value">{profile.address || 'Chưa cập nhật'}</div>
                        </div>
                        <div className="info-item">
                          <label>Năm sinh</label>
                          <div className="value">{profile.yearOfBirth || 'Chưa cập nhật'}</div>
                        </div>
                        <div className="info-item">
                          <label>Giới tính</label>
                          <div className="value">
                            {profile.sex === 'male' ? 'Nam' : profile.sex === 'female' ? 'Nữ' : profile.sex || 'Chưa cập nhật'}
                          </div>
                        </div>
                        <div className="info-item full">
                          <label>Giới thiệu</label>
                          <div className="value">{profile.bio}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Edit Mode - Form chỉnh sửa
                    <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
                      <div className="field">
                        <label>Họ và tên *</label>
                        <input 
                          name="name" 
                          value={profile.name} 
                          onChange={handleChange} 
                          placeholder="Nhập họ và tên" 
                          required
                        />
                      </div>
                      <div className="field">
                        <label>Email *</label>
                        <input 
                          type="email" 
                          name="email" 
                          value={profile.email} 
                          onChange={handleChange} 
                          placeholder="example@email.com" 
                          required
                        />
                      </div>
                      <div className="field">
                        <label>Số điện thoại *</label>
                        <input 
                          name="phone" 
                          value={profile.phone} 
                          onChange={handleChange} 
                          placeholder="0900 000 000" 
                          required
                        />
                      </div>
                      <div className="field">
                        <label>Năm sinh</label>
                        <input 
                          type="number" 
                          name="yearOfBirth" 
                          value={profile.yearOfBirth} 
                          onChange={handleChange} 
                          placeholder="1990" 
                          min="1950"
                          max="2010"
                        />
                      </div>
                      <div className="field full">
                        <label>Địa chỉ</label>
                        <input 
                          name="address" 
                          value={profile.address} 
                          onChange={handleChange} 
                          placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" 
                        />
                      </div>
                      <div className="field">
                        <label>Giới tính</label>
                        <select 
                          name="sex" 
                          value={profile.sex} 
                          onChange={handleChange}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                      <div className="field full">
                        <label>Giới thiệu</label>
                        <textarea 
                          name="bio" 
                          rows={4} 
                          value={profile.bio} 
                          onChange={handleChange} 
                          placeholder="Mô tả ngắn về bản thân..." 
                        />
                      </div>
                      <div className="actions">
                        <button 
                          className="btn primary" 
                          type="button" 
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                        <button 
                          className="btn secondary" 
                          type="button" 
                          onClick={handleCancel}
                          disabled={saving}
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="card">
                  <div className="card-header">
                    <h2>Hoạt động gần đây</h2>
                    <p>Tổng quan ngắn về các tương tác gần đây.</p>
                  </div>
                  <ul className="activity-list">
                    <li>✔ Đăng tin mới: VinFast VF 8 Plus · 2 ngày trước</li>
                    <li>★ Nhận đánh giá 5 sao từ người mua · 4 ngày trước</li>
                    <li>↻ Cập nhật hồ sơ · 1 tuần trước</li>
                  </ul>
                </div>
              </>
            )}

            {activeTab === 'posts' && (
              <div className="card">
                <div className="card-header">
                  <h2>Tin đăng gần đây</h2>
                  <p>Danh sách rút gọn các tin của bạn.</p>
                </div>
                <div className="post-grid">
                  {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                      <div key={post.id} className="post-item">
                        <div className="thumb">
                          <img src={post.images[0] || "/api/placeholder/280/180"} alt="thumb" />
                        </div>
                        <div className="info">
                          <h3>{post.title}</h3>
                          <p className="muted">
                            {new Date(post.createdAt).toLocaleDateString('vi-VN')} · {post.views} lượt xem
                          </p>
                          <div className="row">
                            <button className="btn small outline">Chỉnh sửa</button>
                            <button className="btn small ghost">Ẩn</button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>Chưa có tin đăng nào</p>
                      <button className="btn primary" onClick={() => navigate('/battery')}>
                        Đăng tin ngay
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="card">
                <div className="card-header">
                  <h2>Đánh giá</h2>
                  <p>Phản hồi từ người mua/bán đã giao dịch.</p>
                </div>
                <ul className="reviews">
                  {userReviews.length > 0 ? (
                    userReviews.map((review) => (
                      <li key={review.id} className="review">
                        <div className="avatar-sm">
                          <img src={review.reviewer.avatar || "/api/placeholder/40/40"} alt="u" />
                        </div>
                        <div className="content">
                          <div className="row">
                            <strong>{review.reviewer.name}</strong>
                            <span className="stars">
                              {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                            </span>
                          </div>
                          <p>{review.comment}</p>
                          <span className="muted">
                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>Chưa có đánh giá nào</p>
                    </div>
                  )}
                </ul>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="card">
                <div className="card-header">
                  <h2>Giới thiệu & Liên kết</h2>
                  <p>Thông tin thêm và mạng xã hội.</p>
                </div>
                <div className="about-grid">
                  <div className="block">
                    <h3>Giới thiệu</h3>
                    <p>{profile.bio}</p>
                  </div>
                  <div className="block">
                    <h3>Liên kết</h3>
                    <div className="links">
                      <a href="#" className="link-chip">Facebook</a>
                      <a href="#" className="link-chip">Zalo</a>
                      <a href="#" className="link-chip">Website</a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default AccountPage


