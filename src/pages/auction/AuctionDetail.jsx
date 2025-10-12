import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './AuctionDetail.scss'

const AuctionDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [bidAmount, setBidAmount] = useState('')
  const [timeLeft, setTimeLeft] = useState({})

  // Mock data - thay bằng API call
  const auctionItem = {
    id: id,
    title: 'VinFast VF 8 Plus 2023 - Xe điện cao cấp',
    currentBid: 850000000,
    startingBid: 800000000,
    minIncrement: 10000000,
    totalBids: 24,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    images: ['/placeholder1.jpg', '/placeholder2.jpg', '/placeholder3.jpg'],
    specs: {
      year: 2023,
      km: '8,500 km',
      condition: 'Như mới',
      brand: 'VinFast',
      model: 'VF 8 Plus',
      transmission: 'Tự động',
      color: 'Đen'
    },
    seller: 'Nguyễn Văn A',
    location: 'Hà Nội',
    description: 'Xe đẹp, chạy êm, pin tốt...',
    bidHistory: [
      { user: 'User123', amount: 850000000, time: '2 phút trước' },
      { user: 'User456', amount: 840000000, time: '5 phút trước' },
      { user: 'User789', amount: 830000000, time: '10 phút trước' }
    ]
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = auctionItem.endTime - new Date()
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft({ hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handlePlaceBid = () => {
    const amount = parseInt(bidAmount)
    if (amount < auctionItem.currentBid + auctionItem.minIncrement) {
      alert(`Giá đặt phải lớn hơn ${(auctionItem.currentBid + auctionItem.minIncrement).toLocaleString('vi-VN')} đ`)
      return
    }
    console.log('Placing bid:', amount)
    alert('Đặt giá thành công!')
  }

  return (
    <div className="auction-detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/auction')}>
          ← Quay lại danh sách đấu giá
        </button>

        <div className="auction-detail-grid">
          {/* Left: Images & Info */}
          <div className="auction-main">
            <div className="image-gallery">
              <div className="main-image">
                <img src="/api/placeholder/800/600" alt={auctionItem.title} />
                <div className="status-badge live">🔴 Đang đấu giá</div>
              </div>
              <div className="thumbnail-list">
                {auctionItem.images.map((img, index) => (
                  <img key={index} src="/api/placeholder/150/100" alt={`Thumb ${index}`} />
                ))}
              </div>
            </div>

            <div className="auction-info-card">
              <h1>{auctionItem.title}</h1>
              
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="label">Hãng:</span>
                  <span className="value">{auctionItem.specs.brand}</span>
                </div>
                <div className="spec-item">
                  <span className="label">Dòng xe:</span>
                  <span className="value">{auctionItem.specs.model}</span>
                </div>
                <div className="spec-item">
                  <span className="label">Năm:</span>
                  <span className="value">{auctionItem.specs.year}</span>
                </div>
                <div className="spec-item">
                  <span className="label">Km:</span>
                  <span className="value">{auctionItem.specs.km}</span>
                </div>
                <div className="spec-item">
                  <span className="label">Hộp số:</span>
                  <span className="value">{auctionItem.specs.transmission}</span>
                </div>
                <div className="spec-item">
                  <span className="label">Màu:</span>
                  <span className="value">{auctionItem.specs.color}</span>
                </div>
              </div>

              <div className="seller-info">
                <h3>Thông tin người bán</h3>
                <p>👤 {auctionItem.seller}</p>
                <p>📍 {auctionItem.location}</p>
              </div>

              <div className="description">
                <h3>Mô tả</h3>
                <p>{auctionItem.description}</p>
              </div>
            </div>
          </div>

          {/* Right: Bidding Panel */}
          <div className="bidding-panel">
            <div className="bid-card">
              <div className="current-bid-section">
                <div className="label">Giá hiện tại</div>
                <div className="amount">{auctionItem.currentBid.toLocaleString('vi-VN')} đ</div>
                <div className="bid-count">{auctionItem.totalBids} lượt đấu giá</div>
              </div>

              <div className="time-left-section">
                <div className="label">⏱ Kết thúc sau:</div>
                <div className="countdown">
                  <div className="time-unit">
                    <strong>{timeLeft.hours || 0}</strong>
                    <small>giờ</small>
                  </div>
                  <span>:</span>
                  <div className="time-unit">
                    <strong>{timeLeft.minutes || 0}</strong>
                    <small>phút</small>
                  </div>
                  <span>:</span>
                  <div className="time-unit">
                    <strong>{timeLeft.seconds || 0}</strong>
                    <small>giây</small>
                  </div>
                </div>
              </div>

              <div className="bid-input-section">
                <label>Nhập giá đặt của bạn</label>
                <input
                  type="text"
                  placeholder={`Tối thiểu ${(auctionItem.currentBid + auctionItem.minIncrement).toLocaleString('vi-VN')} đ`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value.replace(/\D/g, ''))}
                />
                <small>Bước giá tối thiểu: {auctionItem.minIncrement.toLocaleString('vi-VN')} đ</small>
              </div>

              <button className="place-bid-btn" onClick={handlePlaceBid}>
                Đặt giá ngay
              </button>

              <div className="quick-bid-buttons">
                <button onClick={() => setBidAmount((auctionItem.currentBid + auctionItem.minIncrement).toString())}>
                  +{auctionItem.minIncrement.toLocaleString('vi-VN')}
                </button>
                <button onClick={() => setBidAmount((auctionItem.currentBid + auctionItem.minIncrement * 2).toString())}>
                  +{(auctionItem.minIncrement * 2).toLocaleString('vi-VN')}
                </button>
                <button onClick={() => setBidAmount((auctionItem.currentBid + auctionItem.minIncrement * 5).toString())}>
                  +{(auctionItem.minIncrement * 5).toLocaleString('vi-VN')}
                </button>
              </div>
            </div>

            <div className="bid-history-card">
              <h3>Lịch sử đấu giá</h3>
              <div className="bid-list">
                {auctionItem.bidHistory.map((bid, index) => (
                  <div key={index} className="bid-item">
                    <div className="bid-user">{bid.user}</div>
                    <div className="bid-amount">{bid.amount.toLocaleString('vi-VN')} đ</div>
                    <div className="bid-time">{bid.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionDetailPage
