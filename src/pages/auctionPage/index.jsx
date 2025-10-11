import { useState, useEffect } from 'react'
import './index.scss'

// Icon Components
const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
)

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const HammerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0-.83-.83-.83-2.17 0-3l8.5-8.5"/>
    <path d="M17.64 15L22 10.64"/>
    <path d="M20.91 11.7l-1.25-1.25"/>
    <path d="M15.91 6.7l-1.25-1.25"/>
    <path d="M20.91 6.7l-1.25 1.25"/>
    <path d="M15.91 11.7l-1.25 1.25"/>
  </svg>
)

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
)

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
  </svg>
)

function AuctionPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('live')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('ending-soon')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock data for auctions
  const [auctions, setAuctions] = useState([
    {
      id: 1,
      title: 'VinFast VF 8 Plus 2023 - Xe điện cao cấp',
      currentBid: 280000000,
      startingBid: 250000000,
      bidIncrement: 5000000,
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      image: '/api/placeholder/400/300',
      category: 'xe-dien',
      bidders: 12,
      views: 1240,
      condition: 'Mới 95%',
      location: 'Hà Nội',
      seller: {
        name: 'Nguyễn Văn A',
        rating: 4.8,
        totalSales: 156
      },
      description: 'Xe điện VinFast VF 8 Plus 2023, đã sử dụng 8 tháng, tình trạng rất tốt. Pin còn 95%, đầy đủ phụ kiện và bảo hành chính hãng.',
      features: ['Pin thuê bao', 'Hệ thống an toàn ADAS', 'Nội thất da cao cấp', 'Màn hình 15.6 inch'],
      isWatched: false,
      isLive: true
    },
    {
      id: 2,
      title: 'Pin Lithium Tesla 72V 32Ah - Pin xe điện cao cấp',
      currentBid: 32000000,
      startingBid: 28000000,
      bidIncrement: 1000000,
      endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      image: '/api/placeholder/400/300',
      category: 'pin-xe-dien',
      bidders: 8,
      views: 890,
      condition: 'Mới 100%',
      location: 'TP.HCM',
      seller: {
        name: 'Cửa hàng Pin Xe Điện',
        rating: 4.9,
        totalSales: 89
      },
      description: 'Pin Lithium Tesla 72V 32Ah chính hãng, mới 100%, bảo hành 3 năm. Phù hợp cho các dòng xe điện phổ biến.',
      features: ['Chính hãng Tesla', 'Bảo hành 3 năm', 'Công suất cao', 'Tuổi thọ lâu dài'],
      isWatched: true,
      isLive: true
    },
    {
      id: 3,
      title: 'Yadea S3 Pro 2023 - Xe máy điện thông minh',
      currentBid: 19500000,
      startingBid: 18000000,
      bidIncrement: 500000,
      endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      image: '/api/placeholder/400/300',
      category: 'xe-may-dien',
      bidders: 15,
      views: 2100,
      condition: 'Như mới',
      location: 'Đà Nẵng',
      seller: {
        name: 'Shop Xe Điện Yadea',
        rating: 4.7,
        totalSales: 234
      },
      description: 'Yadea S3 Pro 2023, xe máy điện thông minh với nhiều tính năng hiện đại. Pin còn 98%, chạy êm, tiết kiệm điện.',
      features: ['Kết nối smartphone', 'Khóa thông minh', 'Đèn LED hiện đại', 'Hệ thống phanh ABS'],
      isWatched: false,
      isLive: true
    },
    {
      id: 4,
      title: 'VinFast VF e34 2022 - Ô tô điện sedan',
      currentBid: 520000000,
      startingBid: 500000000,
      bidIncrement: 10000000,
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      image: '/api/placeholder/400/300',
      category: 'xe-dien',
      bidders: 6,
      views: 1560,
      condition: 'Đã qua sử dụng',
      location: 'Hà Nội',
      seller: {
        name: 'AutoVin Đại lý chính thức',
        rating: 4.9,
        totalSales: 45
      },
      description: 'VinFast VF e34 2022, sedan điện cao cấp. Xe đã sử dụng 1 năm, tình trạng tốt, đầy đủ giấy tờ.',
      features: ['Thiết kế sang trọng', 'Nội thất cao cấp', 'Hệ thống giải trí hiện đại', 'An toàn 5 sao'],
      isWatched: true,
      isLive: true
    },
    {
      id: 5,
      title: 'Pin Ắc quy Lithium 48V 20Ah - Pin xe máy điện',
      currentBid: 12500000,
      startingBid: 12000000,
      bidIncrement: 250000,
      endTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      image: '/api/placeholder/400/300',
      category: 'pin-xe-dien',
      bidders: 4,
      views: 670,
      condition: 'Mới 90%',
      location: 'Cần Thơ',
      seller: {
        name: 'Pin Xe Điện Cần Thơ',
        rating: 4.6,
        totalSales: 78
      },
      description: 'Pin Ắc quy Lithium 48V 20Ah cho xe máy điện, còn 90% dung lượng. Bảo hành 2 năm, chất lượng tốt.',
      features: ['Công nghệ Lithium', 'Bảo hành 2 năm', 'Tiết kiệm điện', 'Tuổi thọ cao'],
      isWatched: false,
      isLive: true
    }
  ])

  const [timeLeft, setTimeLeft] = useState({})

  // Calculate time left for each auction
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = {}
      auctions.forEach(auction => {
        const now = new Date().getTime()
        const endTime = new Date(auction.endTime).getTime()
        const difference = endTime - now

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)

          newTimeLeft[auction.id] = { days, hours, minutes, seconds }
        } else {
          newTimeLeft[auction.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }
      })
      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [auctions])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatTimeLeft = (time) => {
    if (time.days > 0) {
      return `${time.days}d ${time.hours}h ${time.minutes}m`
    } else if (time.hours > 0) {
      return `${time.hours}h ${time.minutes}m ${time.seconds}s`
    } else {
      return `${time.minutes}m ${time.seconds}s`
    }
  }

  const getStatusColor = (time) => {
    if (time.days > 0) return '#4CAF50'
    if (time.hours > 0) return '#FF9800'
    return '#F44336'
  }

  const categories = [
    { id: 'all', name: 'Tất cả', count: auctions.length },
    { id: 'xe-dien', name: 'Xe điện', count: auctions.filter(a => a.category === 'xe-dien').length },
    { id: 'xe-may-dien', name: 'Xe máy điện', count: auctions.filter(a => a.category === 'xe-may-dien').length },
    { id: 'pin-xe-dien', name: 'Pin xe điện', count: auctions.filter(a => a.category === 'pin-xe-dien').length }
  ]

  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || auction.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleBid = (auctionId, bidAmount) => {
    setAuctions(prev => prev.map(auction => 
      auction.id === auctionId 
        ? { 
            ...auction, 
            currentBid: bidAmount,
            bidders: auction.bidders + 1
          }
        : auction
    ))
  }

  const toggleWatch = (auctionId) => {
    setAuctions(prev => prev.map(auction => 
      auction.id === auctionId 
        ? { ...auction, isWatched: !auction.isWatched }
        : auction
    ))
  }

  return (
    <div className="auction-page">
      <div className="container">
        {/* Header Section */}
        <div className="auction-header">
          <div className="header-content">
            <h1>Đấu giá xe điện</h1>
            <p>Tham gia đấu giá và sở hữu những sản phẩm xe điện chất lượng cao với giá tốt nhất</p>
          </div>
          <div className="header-stats">
            <div className="stat">
              <HammerIcon />
              <div>
                <span className="stat-number">{auctions.length}</span>
                <span className="stat-label">Đang đấu giá</span>
              </div>
            </div>
            <div className="stat">
              <UsersIcon />
              <div>
                <span className="stat-number">{auctions.reduce((sum, a) => sum + a.bidders, 0)}</span>
                <span className="stat-label">Người tham gia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="search-filter-section">
          <div className="search-box">
            <SearchIcon />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm đấu giá..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-controls">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="ending-soon">Sắp kết thúc</option>
              <option value="newest">Mới nhất</option>
              <option value="highest-bid">Giá cao nhất</option>
              <option value="most-bidders">Nhiều người đấu nhất</option>
            </select>
            
            <button className="filter-btn">
              <FilterIcon />
              Bộ lọc nâng cao
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="categories-section">
          <div className="categories-tabs">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
                <span className="count">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Auctions Grid */}
        <div className="auctions-grid">
          {filteredAuctions.map(auction => (
            <div key={auction.id} className="auction-card">
              <div className="auction-image">
                <img src={auction.image} alt={auction.title} />
                <div className="image-overlay">
                  <button 
                    className={`watch-btn ${auction.isWatched ? 'watched' : ''}`}
                    onClick={() => toggleWatch(auction.id)}
                  >
                    <HeartIcon />
                  </button>
                  <div className="auction-badge">
                    {auction.isLive ? 'Đang đấu giá' : 'Đã kết thúc'}
                  </div>
                </div>
              </div>

              <div className="auction-content">
                <div className="auction-header">
                  <h3 className="auction-title">{auction.title}</h3>
                  <div className="auction-meta">
                    <span className="condition">{auction.condition}</span>
                    <span className="location">{auction.location}</span>
                  </div>
                </div>

                <div className="auction-bid-info">
                  <div className="current-bid">
                    <span className="label">Giá hiện tại:</span>
                    <span className="amount">{formatCurrency(auction.currentBid)}</span>
                  </div>
                  <div className="bid-increment">
                    Bước giá: {formatCurrency(auction.bidIncrement)}
                  </div>
                </div>

                <div className="auction-timer">
                  <ClockIcon />
                  <div className="timer-info">
                    <span className="timer-label">Còn lại:</span>
                    <span 
                      className="timer-value"
                      style={{ color: getStatusColor(timeLeft[auction.id] || {}) }}
                    >
                      {timeLeft[auction.id] ? formatTimeLeft(timeLeft[auction.id]) : 'Đã kết thúc'}
                    </span>
                  </div>
                </div>

                <div className="auction-stats">
                  <div className="stat">
                    <UsersIcon />
                    <span>{auction.bidders} người đấu</span>
                  </div>
                  <div className="stat">
                    <span>👁️ {auction.views} lượt xem</span>
                  </div>
                </div>

                <div className="seller-info">
                  <div className="seller-avatar">
                    <img src="/api/placeholder/32/32" alt={auction.seller.name} />
                  </div>
                  <div className="seller-details">
                    <span className="seller-name">{auction.seller.name}</span>
                    <div className="seller-rating">
                      <StarIcon />
                      <span>{auction.seller.rating}</span>
                      <span className="sales">({auction.seller.totalSales} bán)</span>
                    </div>
                  </div>
                </div>

                <div className="auction-actions">
                  <button 
                    className="bid-btn"
                    onClick={() => handleBid(auction.id, auction.currentBid + auction.bidIncrement)}
                  >
                    Đấu giá ngay
                  </button>
                  <button className="view-btn">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAuctions.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <HammerIcon />
            </div>
            <h3>Không tìm thấy sản phẩm đấu giá</h3>
            <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuctionPage
