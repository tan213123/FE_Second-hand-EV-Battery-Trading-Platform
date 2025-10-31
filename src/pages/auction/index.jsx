import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'

const AuctionPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('ongoing')
  const [timeLeft, setTimeLeft] = useState({})

  const auctionItems = [
    {
      id: 1,
      title: 'VinFast VF 8 Plus 2023 - Xe điện cao cấp',
      currentBid: 850000000,
      startingBid: 800000000,
      totalBids: 24,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      image: '/placeholder1.jpg',
      specs: {
        year: 2023,
        km: '8,500 km',
        condition: 'Như mới'
      },
      seller: 'Nguyễn Văn A',
      location: 'Hà Nội',
      status: 'ongoing'
    },
    {
      id: 2,
      title: 'Toyota Camry 2022 - Sedan sang trọng',
      currentBid: 1200000000,
      startingBid: 1100000000,
      totalBids: 45,
      endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
      image: '/placeholder2.jpg',
      specs: {
        year: 2022,
        km: '15,000 km',
        condition: 'Đã qua sử dụng'
      },
      seller: 'Trần Thị B',
      location: 'TP.HCM',
      status: 'ongoing'
    },
    {
      id: 3,
      title: 'Honda SH 350i 2023 - Xe máy cao cấp',
      currentBid: 145000000,
      startingBid: 130000000,
      totalBids: 67,
      endTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
      image: '/placeholder3.jpg',
      specs: {
        year: 2023,
        km: '3,200 km',
        condition: 'Mới 98%'
      },
      seller: 'Lê Văn C',
      location: 'Đà Nẵng',
      status: 'ongoing'
    },
    {
      id: 4,
      title: 'VinFast VF e34 2022 - SUV điện',
      currentBid: 520000000,
      winningBid: 520000000,
      totalBids: 38,
      endTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
      image: '/placeholder4.jpg',
      specs: {
        year: 2022,
        km: '18,000 km',
        condition: 'Tốt'
      },
      seller: 'Phạm Thu D',
      winner: 'Hoàng Văn E',
      location: 'Hà Nội',
      status: 'completed'
    }
  ]

  const upcomingAuctions = [
    {
      id: 5,
      title: 'Mazda CX-5 2023 - SUV 7 chỗ',
      startingBid: 900000000,
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      image: '/placeholder5.jpg',
      specs: {
        year: 2023,
        km: '5,000 km',
        condition: 'Mới 99%'
      },
      seller: 'Võ Thị F',
      location: 'Hải Phòng',
      status: 'upcoming'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = {}
      auctionItems.forEach(item => {
        if (item.status === 'ongoing') {
          const diff = item.endTime - new Date()
          if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)
            newTimeLeft[item.id] = { hours, minutes, seconds }
          }
        }
      })
      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handlePlaceBid = (itemId) => {
    navigate(`/auction/${itemId}/bid`)
  }

  const handleAuctionPayment = () => {
    const paymentData = {
      orderId: `AUCTION${Date.now()}`,
      amount: 500000,
      description: 'Phí tham gia đấu giá',
      packageName: 'Phí tham gia đấu giá',
      customerName: 'Nguyễn Văn A', // Trong thực tế sẽ lấy từ user context
      customerEmail: 'nguyenvana@email.com',
      customerPhone: '0901234567'
    }
    
    navigate('/payment', { state: { paymentData } })
  }

  const renderAuctionCard = (item) => (
    <div key={item.id} className="auction-card">
      <div className="auction-image">
        <img src="/api/placeholder/400/300" alt={item.title} />
        {item.status === 'ongoing' && (
          <div className="status-badge live">
            🔴 Đang đấu giá
          </div>
        )}
        {item.status === 'completed' && (
          <div className="status-badge completed">
            ✓ Đã kết thúc
          </div>
        )}
        {item.status === 'upcoming' && (
          <div className="status-badge upcoming">
            ⏰ Sắp diễn ra
          </div>
        )}
      </div>

      <div className="auction-content">
        <h3 className="auction-title">{item.title}</h3>
        
        <div className="auction-specs">
          <span>{item.specs.year}</span>
          <span>{item.specs.km}</span>
          <span>{item.specs.condition}</span>
        </div>

        <div className="auction-seller">
          <span>👤 {item.seller}</span>
          <span>📍 {item.location}</span>
        </div>

        {item.status === 'ongoing' && (
          <>
            <div className="current-bid">
              <div className="bid-label">Giá hiện tại</div>
              <div className="bid-amount">{item.currentBid.toLocaleString('vi-VN')} đ</div>
              <div className="bid-count">{item.totalBids} lượt đấu giá</div>
            </div>

            <div className="time-left">
              <div className="time-label">⏱ Kết thúc sau:</div>
              <div className="countdown">
                {timeLeft[item.id] && (
                  <>
                    <span className="time-unit">
                      <strong>{timeLeft[item.id].hours}</strong>
                      <small>giờ</small>
                    </span>
                    <span className="separator">:</span>
                    <span className="time-unit">
                      <strong>{timeLeft[item.id].minutes}</strong>
                      <small>phút</small>
                    </span>
                    <span className="separator">:</span>
                    <span className="time-unit">
                      <strong>{timeLeft[item.id].seconds}</strong>
                      <small>giây</small>
                    </span>
                  </>
                )}
              </div>
            </div>

            <button 
              className="bid-btn"
              onClick={() => handlePlaceBid(item.id)}
            >
              Đặt giá ngay
            </button>
          </>
        )}

        {item.status === 'completed' && (
          <>
            <div className="winning-bid">
              <div className="bid-label">Giá thành công</div>
              <div className="bid-amount won">{item.winningBid.toLocaleString('vi-VN')} đ</div>
              <div className="winner">🏆 Người thắng: {item.winner}</div>
            </div>
            <button className="view-btn">
              Xem chi tiết
            </button>
          </>
        )}

        {item.status === 'upcoming' && (
          <>
            <div className="starting-bid">
              <div className="bid-label">Giá khởi điểm</div>
              <div className="bid-amount">{item.startingBid.toLocaleString('vi-VN')} đ</div>
            </div>
            <div className="start-time">
              Bắt đầu: {item.startTime.toLocaleString('vi-VN')}
            </div>
            <button className="notify-btn">
              🔔 Nhận thông báo
            </button>
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="auction-page">
      {/* Hero Banner */}
      <div className="auction-hero">
        <div className="container">
          <h1>🔨 Đấu giá xe cũ</h1>
          <p>Cơ hội sở hữu xe mơ ước với giá tốt nhất</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="auction-tabs">
        <div className="container">
          <button
            className={`tab ${activeTab === 'ongoing' ? 'active' : ''}`}
            onClick={() => setActiveTab('ongoing')}
          >
            Đang đấu giá ({auctionItems.filter(i => i.status === 'ongoing').length})
          </button>
          <button
            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Sắp diễn ra ({upcomingAuctions.length})
          </button>
          <button
            className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Đã kết thúc ({auctionItems.filter(i => i.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="auction-content">
        <div className="container">
          {/* How it works */}
          <div className="how-it-works">
            <h2>📋 Quy trình đấu giá</h2>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Đăng ký tham gia</h3>
                <p>Đăng ký tài khoản và xác thực thông tin</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Đóng phí</h3>
                <p>Người tham gia cần đóng phí tham gia đấu giá (500,000đ)</p>
                <button 
                  className="payment-btn"
                  onClick={handleAuctionPayment}
                >
                  💳 Thanh toán VNPAY
                </button>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Tham gia đấu giá</h3>
                <p>Đặt giá trong thời gian diễn ra</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Thanh toán & nhận xe</h3>
                <p>Người thắng thanh toán và nhận xe</p>
              </div>
            </div>
          </div>

          {/* Auction Grid */}
          <div className="auction-grid">
            {activeTab === 'ongoing' &&
              auctionItems
                .filter(item => item.status === 'ongoing')
                .map(renderAuctionCard)
            }
            {activeTab === 'upcoming' &&
              upcomingAuctions.map(renderAuctionCard)
            }
            {activeTab === 'completed' &&
              auctionItems
                .filter(item => item.status === 'completed')
                .map(renderAuctionCard)
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionPage
