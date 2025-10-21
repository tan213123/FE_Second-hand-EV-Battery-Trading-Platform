import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './index.scss'

// Icons
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
)

function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    // Lấy dữ liệu từ sessionStorage
    const postData = sessionStorage.getItem('viewingPost')
    if (postData) {
      setPost(JSON.parse(postData))
    } else {
      // Nếu không có data trong sessionStorage, redirect về trang my-posts
      navigate('/my-posts')
    }
  }, [id, navigate])

  const getCategoryName = (category) => {
    const categoryNames = {
      'car': 'Ô tô điện',
      'electric': 'Xe máy điện', 
      'battery': 'Pin xe điện'
    }
    return categoryNames[category] || 'Khác'
  }

  const getConditionName = (condition) => {
    return condition || 'Không xác định'
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const handleEdit = () => {
    sessionStorage.setItem('editingPost', JSON.stringify(post))
    navigate('/post?mode=edit&id=' + post.id)
  }

  const handleBack = () => {
    navigate('/my-posts')
  }

  const nextImage = () => {
    if (post?.images && currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
    }
  }

  if (!post) {
    return (
      <div className="post-detail-page">
        <div className="container">
          <div className="loading">Đang tải...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="post-detail-page">
      <div className="container">
        <div className="page-header">
          <button className="btn btn-outline" onClick={handleBack}>
            <BackIcon />
            Quay lại
          </button>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={handleEdit}>
              <EditIcon />
              Chỉnh sửa
            </button>
          </div>
        </div>

        <div className="post-content">
          <div className="post-images">
            {post.images && post.images.length > 0 ? (
              <div className="image-gallery">
                <div className="main-image">
                  <img 
                    src={post.images[currentImageIndex]} 
                    alt={post.title}
                    onError={(e) => {
                      e.target.src = "/api/placeholder/600/400"
                    }}
                  />
                  {post.images.length > 1 && (
                    <>
                      <button className="nav-btn prev" onClick={prevImage} disabled={currentImageIndex === 0}>
                        ‹
                      </button>
                      <button className="nav-btn next" onClick={nextImage} disabled={currentImageIndex === post.images.length - 1}>
                        ›
                      </button>
                    </>
                  )}
                </div>
                {post.images.length > 1 && (
                  <div className="image-thumbnails">
                    {post.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${post.title} ${index + 1}`}
                        className={index === currentImageIndex ? 'active' : ''}
                        onClick={() => setCurrentImageIndex(index)}
                        onError={(e) => {
                          e.target.src = "/api/placeholder/100/80"
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="no-image">
                <img src="/api/placeholder/600/400" alt="Không có hình ảnh" />
              </div>
            )}
          </div>

          <div className="post-info">
            <div className="post-header">
              <h1>{post.title}</h1>
              <div className="price">{formatPrice(post.price)}</div>
            </div>

            <div className="post-meta">
              <div className="meta-item">
                <LocationIcon />
                <span>{post.location?.district}, {post.location?.city}</span>
              </div>
              <div className="meta-item">
                <ClockIcon />
                <span>Đăng ngày {formatDate(post.createdAt)}</span>
              </div>
            </div>

            <div className="post-details">
              <h2>Thông tin chi tiết</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Loại sản phẩm:</span>
                  <span className="value">{getCategoryName(post.category)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Tình trạng:</span>
                  <span className="value">{getConditionName(post.condition)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Hãng:</span>
                  <span className="value">{post.brand}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Năm sản xuất:</span>
                  <span className="value">{post.year}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Màu sắc:</span>
                  <span className="value">{post.color}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Xuất xứ:</span>
                  <span className="value">{post.origin}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Số km đã đi:</span>
                  <span className="value">{post.mileage ? `${post.mileage} km` : 'Chưa cập nhật'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Pin:</span>
                  <span className="value">{post.batteryInfo ? `${post.batteryInfo}%` : 'Chưa cập nhật'}</span>
                </div>

                {/* Category specific fields */}
                {post.category === 'car' && (
                  <>
                    <div className="detail-item">
                      <span className="label">Kiểu dáng:</span>
                      <span className="value">{post.bodyType}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Số chỗ ngồi:</span>
                      <span className="value">{post.seats}</span>
                    </div>
                  </>
                )}

                {post.category === 'battery' && (
                  <>
                    <div className="detail-item">
                      <span className="label">Loại pin:</span>
                      <span className="value">{post.batteryType}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Công suất:</span>
                      <span className="value">{post.capacity}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="post-description">
              <h2>Mô tả</h2>
              <p>{post.description}</p>
            </div>

            <div className="contact-info">
              <h2>Thông tin liên hệ</h2>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="label">Tên người bán:</span>
                  <span className="value">{post.contactName}</span>
                </div>
                <div className="contact-item">
                  <span className="label">Số điện thoại:</span>
                  <span className="value">{post.contactPhone}</span>
                </div>
                <div className="contact-item">
                  <span className="label">Địa chỉ:</span>
                  <span className="value">
                    {post.location?.address && `${post.location.address}, `}
                    {post.location?.ward && `${post.location.ward}, `}
                    {post.location?.district && `${post.location.district}, `}
                    {post.location?.city}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetailPage