import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './index.scss'

function AccountPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    yearOfBirth: '',
    sex: '',
    bio: 'Người đam mê xe điện và công nghệ.'
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // Load user data from AuthContext
    if (user) {
      setProfile(prevProfile => ({
        ...prevProfile,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        yearOfBirth: user.yearOfBirth || '',
        sex: user.sex || ''
      }))
    }
  }, [isAuthenticated, user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // TODO: Save profile changes to backend
    console.log('Saving profile:', profile)
    setIsEditing(false)
    // Show success message
  }

  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      setProfile(prevProfile => ({
        ...prevProfile,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        yearOfBirth: user.yearOfBirth || '',
        sex: user.sex || ''
      }))
    }
    setIsEditing(false)
  }

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return <div>Đang chuyển hướng...</div>
  }

  return (
    <div className="account-page">

      <div className="profile">
        <div className="profile-cover">
          <div className="cover-overlay" />
        </div>

        <div className="profile-header container">
          <div className="avatar-wrap">
            <img className="avatar" src="https://via.placeholder.com/120x120/4ECDC4/FFFFFF?text=Avatar" alt="avatar" />
            <button className="btn small secondary">Đổi ảnh</button>
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
              <div className="value">12</div>
              <div className="label">Tin đang bán</div>
            </div>
            <div className="stat">
              <div className="value">4.9</div>
              <div className="label">Đánh giá</div>
            </div>
            <div className="stat">
              <div className="value">36</div>
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
                        <button className="btn primary" type="button" onClick={handleSave}>
                          Lưu thay đổi
                        </button>
                        <button className="btn secondary" type="button" onClick={handleCancel}>
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
                  {[1,2,3].map((i) => (
                    <div key={i} className="post-item">
                      <div className="thumb"><img src="/api/placeholder/280/180" alt="thumb" /></div>
                      <div className="info">
                        <h3>Tiêu đề tin {i}</h3>
                        <p className="muted">Đăng 2 ngày trước · 12 lượt xem</p>
                        <div className="row">
                          <button className="btn small outline">Chỉnh sửa</button>
                          <button className="btn small ghost">Ẩn</button>
                        </div>
                      </div>
                    </div>
                  ))}
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
                  {[5,5,4].map((rate, idx) => (
                    <li key={idx} className="review">
                      <div className="avatar-sm"><img src="/api/placeholder/40/40" alt="u" /></div>
                      <div className="content">
                        <div className="row">
                          <strong>Người dùng {idx+1}</strong>
                          <span className="stars">{'★'.repeat(rate)}{'☆'.repeat(5-rate)}</span>
                        </div>
                        <p>Giao dịch nhanh chóng, uy tín. Sản phẩm đúng mô tả.</p>
                        <span className="muted">3 ngày trước</span>
                      </div>
                    </li>
                  ))}
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


