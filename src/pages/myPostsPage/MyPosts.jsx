import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import './MyPosts.scss'

const MyPosts = () => {
  const { user, isAuthenticated } = useAuth()
  const [userListings, setUserListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && user) {
      // Lấy tin đăng của user từ localStorage
      const userKey = `listings_${user.id || user.memberId}`
      const listings = JSON.parse(localStorage.getItem(userKey) || '[]')
      setUserListings(listings)
    }
    setLoading(false)
  }, [user, isAuthenticated])

  const handleDeleteListing = (listingId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin đăng này?')) {
      const userKey = `listings_${user.id || user.memberId}`
      const updatedListings = userListings.filter(listing => listing.id !== listingId)
      setUserListings(updatedListings)
      localStorage.setItem(userKey, JSON.stringify(updatedListings))
      
      // Cập nhật cả localStorage chung
      const allListings = JSON.parse(localStorage.getItem('userListings') || '[]')
      const updatedAllListings = allListings.filter(listing => listing.id !== listingId)
      localStorage.setItem('userListings', JSON.stringify(updatedAllListings))
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { text: 'Đang hiển thị', class: 'status-active' },
      pending: { text: 'Chờ duyệt', class: 'status-pending' },
      sold: { text: 'Đã bán', class: 'status-sold' },
      expired: { text: 'Hết hạn', class: 'status-expired' }
    }
    const statusInfo = statusMap[status] || statusMap.active
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  if (!isAuthenticated) {
    return (
      <div className="my-posts-page">
        <div className="container">
          <h2>Vui lòng đăng nhập để xem tin đăng của bạn</h2>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="my-posts-page">
        <div className="container">
          <h2>Đang tải...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="my-posts-page">
      <div className="container">
        <div className="page-header">
          <h1>Tin đăng của tôi</h1>
          <p>Quản lý các tin đăng bán xe và phụ kiện của bạn</p>
        </div>

        {userListings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>Chưa có tin đăng nào</h3>
            <p>Bạn chưa đăng tin bán nào. Hãy đăng tin đầu tiên của bạn!</p>
            <a href="/post-listing" className="btn btn-primary">
              Đăng tin ngay
            </a>
          </div>
        ) : (
          <div className="listings-grid">
            {userListings.map((listing) => (
              <div key={listing.id} className="listing-card">
                <div className="listing-header">
                  <h3 className="listing-title">{listing.title}</h3>
                  {getStatusBadge(listing.status)}
                </div>
                
                <div className="listing-info">
                  <div className="info-row">
                    <span className="label">Danh mục:</span>
                    <span className="value">{listing.category}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Giá:</span>
                    <span className="value price">{formatPrice(listing.price)}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Thương hiệu:</span>
                    <span className="value">{listing.brand}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Tình trạng:</span>
                    <span className="value">{listing.condition}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Ngày đăng:</span>
                    <span className="value">{formatDate(listing.postedAt)}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Liên hệ:</span>
                    <span className="value">{listing.contactPhone}</span>
                  </div>
                </div>

                <div className="listing-description">
                  <p>{listing.description}</p>
                </div>

                <div className="listing-actions">
                  <button className="btn btn-secondary btn-sm">
                    Chỉnh sửa
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteListing(listing.id)}
                  >
                    Xóa
                  </button>
                  <button className="btn btn-outline btn-sm">
                    {listing.status === 'active' ? 'Ẩn tin' : 'Hiển thị'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPosts