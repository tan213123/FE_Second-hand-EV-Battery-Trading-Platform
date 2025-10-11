import { useState } from 'react'
import './index.scss'

function AccountPage({ onNavigate }) {
  const [profile, setProfile] = useState({
    fullName: 'Nguyễn Văn A',
    username: 'nguyenvana',
    email: 'user@example.com',
    phone: '0900 000 000',
    location: 'Hà Nội, Việt Nam',
    bio: 'Người đam mê xe điện và công nghệ.',
  })
  const [activeTab, setActiveTab] = useState('overview')

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="account-page">
      <div className="profile">
        <div className="profile-cover">
          <div className="cover-overlay" />
        </div>

        <div className="profile-header container">
          <div className="avatar-wrap">
            <img className="avatar" src="/api/placeholder/120/120" alt="avatar" />
            <button className="btn small secondary">Đổi ảnh</button>
          </div>
          <div className="identity">
            <h1 className="name">{profile.fullName}</h1>
            <div className="meta">
              <span className="username">@{profile.username}</span>
              <span className="dot">•</span>
              <span className="location">{profile.location}</span>
            </div>
            <p className="bio">{profile.bio}</p>
            <div className="quick-actions">
              <button className="btn primary" onClick={() => onNavigate && onNavigate('my-posts')}>Tin đăng</button>
              <button className="btn outline" onClick={() => onNavigate && onNavigate('saved')}>Tin đã lưu</button>
              <button className="btn outline" onClick={() => onNavigate && onNavigate('settings')}>Cài đặt</button>
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
              <button className="side-link" onClick={() => onNavigate && onNavigate('my-posts')}>Tin đăng</button>
              <button className="side-link" onClick={() => onNavigate && onNavigate('saved')}>Tin đã lưu</button>
              <button className="side-link" onClick={() => onNavigate && onNavigate('settings')}>Cài đặt</button>
            </nav>

            <div className="info-card">
              <h3>Thông tin liên hệ</h3>
              <div className="info-row"><span>Email</span><strong>{profile.email}</strong></div>
              <div className="info-row"><span>Điện thoại</span><strong>{profile.phone}</strong></div>
              <div className="info-row"><span>Khu vực</span><strong>{profile.location}</strong></div>
            </div>
          </aside>

          <main className="main">
            {activeTab === 'overview' && (
              <>
                <div className="card">
                  <div className="card-header">
                    <h2>Chỉnh sửa hồ sơ</h2>
                    <p>Cập nhật thông tin hiển thị với người khác.</p>
                  </div>
                  <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
                    <div className="field">
                      <label>Họ và tên</label>
                      <input name="fullName" value={profile.fullName} onChange={handleChange} placeholder="Tên của bạn" />
                    </div>
                    <div className="field">
                      <label>Tên người dùng</label>
                      <input name="username" value={profile.username} onChange={handleChange} placeholder="username" />
                    </div>
                    <div className="field">
                      <label>Email</label>
                      <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="you@example.com" />
                    </div>
                    <div className="field">
                      <label>Số điện thoại</label>
                      <input name="phone" value={profile.phone} onChange={handleChange} placeholder="0900 000 000" />
                    </div>
                    <div className="field full">
                      <label>Khu vực</label>
                      <input name="location" value={profile.location} onChange={handleChange} placeholder="Tỉnh/Thành" />
                    </div>
                    <div className="field full">
                      <label>Giới thiệu</label>
                      <textarea name="bio" rows={4} value={profile.bio} onChange={handleChange} placeholder="Mô tả ngắn về bạn" />
                    </div>
                    <div className="actions">
                      <button className="btn primary" type="submit">Lưu thay đổi</button>
                      <button className="btn ghost" type="button">Hủy</button>
                    </div>
                  </form>
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


