import { useState } from 'react'
import "./index.scss"

// Icon Components
const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 10l5 5 5-5z"/>
  </svg>
)

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)

const VerifiedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#4CAF50">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
)

function SellOtoPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [showAllPrices, setShowAllPrices] = useState(false)
  const [showAllCarTypes, setShowAllCarTypes] = useState(false)
  const [showAllSeats, setShowAllSeats] = useState(false)
  const [showAllCities, setShowAllCities] = useState(false)

  const brands = [
    { name: 'MG', logo: '🚙', count: 3210 },
    { name: 'VinFast', logo: '⚡', count: 8950 },
    { name: 'Wuling', logo: '🚗', count: 2150 },
    { name: 'Hyundai', logo: '🚗', count: 4320 },
    { name: 'Mercedes Benz', logo: '⭐', count: 1560 },
    { name: 'Porsche', logo: '🚗', count: 980 },
    { name: 'Kia', logo: '🚗', count: 2340 },
    { name: 'Rolls-Royce', logo: '🚗', count: 1870 }
  ]

  const locations = [
    'Tp Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Bình Dương', 'Gần tôi'
  ]

  const carListings = [
    {
      id: 1,
      title: 'BYD M6 2025 - DEAL RỰC RỠ - QUÀ BẤT NGỜ',
      year: 2025,
      type: 'Điện',
      transmission: 'Tự động',
      condition: 'Mới',
      price: '756,000,000 đ',
      location: 'Bình Dương',
      seller: 'THÁO NGUYÊN BYD MIỀN NAM',
      verified: true,
      images: 5,
      featured: true,
      vip: true,
      discount: '6% thỏa thuận'
    },
    {
      id: 2,
      title: 'MUA XE VF5 Ở ĐỘNG, MẪU NÂNG CAO GIÁ CƠ BẢN',
      year: 2025,
      type: 'Điện',
      transmission: 'Tự động',
      condition: 'Mới',
      price: '507,000,000 đ',
      location: 'Tp Hồ Chí Minh',
      seller: 'Vinfast VFX Thủ Đức',
      verified: false,
      images: 7,
      featured: true,
      vip: false
    },
    {
      id: 3,
      title: 'VF6 trả trước 90 triệu, không cần bằng lái & cmtn',
      year: 2025,
      type: 'Điện',
      transmission: 'Tự động',
      condition: 'Mới',
      price: '651,000,000 đ',
      location: 'Bình Dương',
      seller: 'ĐỔ HÙNG VINFAST NAM THÁI',
      verified: true,
      images: 6,
      featured: true,
      vip: false,
      soldTime: '5 đã bán'
    },
    {
      id: 4,
      title: 'Hyundai Elantra 2017 2.0 AT - 1chủ mua mới',
      year: 2017,
      km: '76000 km',
      type: 'Xăng',
      transmission: 'Tự động',
      condition: '1 chủ',
      price: '378,000,000 đ',
      location: 'Tp Hồ Chí Minh',
      seller: 'Trần Vũ',
      verified: true,
      images: 10,
      rating: 4.7,
      reviews: '19 đã bán',
      featured: false,
      vip: true,
      discount: '6% thỏa thuận'
    },
    {
      id: 5,
      title: 'Kia Sorento 2016 GAT - 93000 km',
      year: 2016,
      km: '93000 km',
      type: 'Xăng',
      transmission: 'Tự động',
      condition: 'Cũ',
      price: '458,000,000 đ',
      location: 'Gia Lai',
      seller: 'Nhân Nguyen',
      verified: true,
      images: 20,
      featured: false,
      vip: true
    },
    {
      id: 6,
      title: 'Hyundai Accent 2021 1.4 AT - 72000 km bao zin 1chu',
      year: 2021,
      km: '72000 km',
      type: 'Xăng',
      transmission: 'Tự động',
      condition: '1 chủ',
      price: '379,000,000 đ',
      location: 'Hà Nội',
      seller: 'A Công',
      verified: false,
      images: 12,
      rating: 10,
      featured: false,
      vip: false,
      discount: 'Giá tốt'
    }
  ]

  const priceRanges = [
    'Giá dưới 200 triệu',
    'Giá 200 triệu - 300 triệu',
    'Giá 300 triệu - 400 triệu',
    'Giá 400 triệu - 500 triệu',
    'Giá 500 triệu - 600 triệu',
    'Giá 600 triệu - 700 triệu',
    'Giá 700 triệu - 800 triệu',
    'Trên 800 triệu'
  ]

  const carTypes = [
    'Sedan',
    'SUV/Cross over',
    'Hatchback',
    'Pick-up (bán tải)',
    'Minivan',
    'Coupe',
    'Convertible',
    'Van'
  ]
  
  const seats = [
    '2 chỗ',
    '4 chỗ',
    '5 chỗ',
    '7 chỗ',
    '8 chỗ',
    '9 chỗ trở lên'
  ]
  
  const cities = [
    'Tp Hồ Chí Minh',
    'Hà Nội',
    'Đà Nẵng',
    'Cần Thơ',
    'Hải Phòng',
    'Bình Dương',
    'Đồng Nai',
    'Vũng Tàu',
    'Huế',
  ]

  return (
    <div className="sell-oto-page">
      {/* Header Section */}
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">EcoXe</a>
            <span>/</span>
            <span>Ô tô</span>
          </div>
          <h1 className="page-title">43.121 xe ô tô cũ mới giá tốt cập nhật 04/10/2025</h1>
          
          {/* Filter Bar */}
          <div className="filter-bar">
            <button className="filter-btn">
              <FilterIcon />
              <span>Lọc</span>
            </button>
            <button className="filter-btn active">
              <span>Ô tô</span>
              <ChevronDownIcon />
            </button>
            <button className="filter-btn">
              <span>Giá</span>
              <ChevronDownIcon />
            </button>
            <button className="filter-btn">
              <span>Năm sản xuất</span>
              <ChevronDownIcon />
            </button>
            <button className="filter-btn">
              <span>Hãng xe</span>
              <ChevronDownIcon />
            </button>
            <button className="filter-btn">
              <span>Tình trạng</span>
              <ChevronDownIcon />
            </button>
            <button className="filter-btn more">
              <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor">
                <circle cx="2" cy="2" r="2"/><circle cx="2" cy="8" r="2"/><circle cx="2" cy="14" r="2"/>
              </svg>
            </button>
            <button className="clear-filter">Xoá lọc</button>
          </div>

          {/* Location Filter */}
          <div className="location-filter">
            <span className="label">Khu vực:</span>
            {locations.map((location, index) => (
              <button key={index} className="location-btn">
                {location}
              </button>
            ))}
          </div>

          {/* Brand Filter */}
          <div className="brand-filter">
            {brands.map((brand, index) => (
              <div 
                key={index} 
                className={`brand-item ${selectedBrands.includes(brand.name) ? 'active' : ''}`}
                onClick={() => {
                  if (selectedBrands.includes(brand.name)) {
                    setSelectedBrands(selectedBrands.filter(b => b !== brand.name))
                  } else {
                    setSelectedBrands([...selectedBrands, brand.name])
                  }
                }}
              >
                <div className="brand-logo">{brand.logo}</div>
                <div className="brand-name">{brand.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          <div className="content-wrapper">
            {/* Sidebar Filters */}
            <aside className="sidebar">
              <div className="filter-section">
                <h3 className="filter-title">Lọc theo tình trạng</h3>
                <div className="filter-options">
                  <label className="filter-option">
                    <input type="radio" name="condition" defaultChecked />
                    <span>Đã sử dụng</span>
                  </label>
                  <label className="filter-option">
                    <input type="radio" name="condition" />
                    <span>Mới</span>
                  </label>
                  <label className="filter-option">
                    <input type="radio" name="condition" />
                    <span>Va chạm nhẹ</span>
                  </label>
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">
                  Lọc theo khoảng giá
                  <ChevronDownIcon />
                </h3>
                <div className="filter-options">
                  {(showAllPrices ? priceRanges : priceRanges.slice(0, 3)).map((range, index) => (
                    <label key={index} className="filter-option">
                      <input type="checkbox" />
                      <span>{range}</span>
                    </label>
                  ))}
                  <button 
                    className="show-more-btn"
                    onClick={() => setShowAllPrices(!showAllPrices)}
                  >
                    {showAllPrices ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                  </button>
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">
                  Lọc theo kiểu dáng
                  <ChevronDownIcon />
                </h3>
                <div className="filter-options">
                  {(showAllCarTypes ? carTypes : carTypes.slice(0, 3)).map((type, index) => (
                    <label key={index} className="filter-option">
                      <input type="checkbox" />
                      <span>{type}</span>
                    </label>
                  ))}
                  <button 
                    className="show-more-btn"
                    onClick={() => setShowAllCarTypes(!showAllCarTypes)}
                  >
                    {showAllCarTypes ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                  </button>
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">
                  Lọc theo số chỗ
                  <ChevronDownIcon />
                </h3>
                <div className="filter-options">
                  {(showAllSeats ? seats : seats.slice(0, 3)).map((seat, index) => (
                    <label key={index} className="filter-option">
                      <input type="checkbox" />
                      <span>{seat}</span>
                    </label>
                  ))}
                  <button 
                    className="show-more-btn"
                    onClick={() => setShowAllSeats(!showAllSeats)}
                  >
                    {showAllSeats ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                  </button>
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">
                  Mua bán ô tô
                  <ChevronDownIcon />
                </h3>
                <div className="filter-options">
                  {(showAllCities ? cities : cities.slice(0, 3)).map((city, index) => (
                    <label key={index} className="filter-option">
                      <input type="checkbox" />
                      <span>{city}</span>
                    </label>
                  ))}
                  <button 
                    className="show-more-btn"
                    onClick={() => setShowAllCities(!showAllCities)}
                  >
                    {showAllCities ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                  </button>
                </div>
              </div>
            </aside>

            {/* Listings Section */}
            <div className="listings-section">
              {/* Tabs */}
              <div className="tabs-bar">
                <button 
                  className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  Tất cả
                </button>
                <button 
                  className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('personal')}
                >
                  Cá nhân
                </button>
                <button 
                  className={`tab ${activeTab === 'professional' ? 'active' : ''}`}
                  onClick={() => setActiveTab('professional')}
                >
                  Bán chuyên
                </button>

                <div className="tabs-right">
                  <button className="sort-btn">
                    <span>Tin mới nhất</span>
                    <ChevronDownIcon />
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <span>Dạng lưới</span>
                    <GridIcon />
                  </button>
                </div>
              </div>

              {/* Car Listings Grid */}
              <div className="listings-grid">
                {carListings.map((car) => (
                  <div key={car.id} className="car-card">
                    {car.vip && <div className="vip-badge">Tin VIP</div>}
                    {car.featured && <div className="featured-badge">Tin tiêu biểu</div>}
                    
                    <div className="car-image">
                      <img src="/api/placeholder/400/300" alt={car.title} />
                      <button className="favorite-btn">
                        <HeartIcon />
                      </button>
                      <div className="image-count">{car.images} 📷</div>
                    </div>

                    <div className="car-content">
                      <h3 className="car-title">{car.title}</h3>
                      
                      <div className="car-specs">
                        <span>{car.year}</span>
                        {car.km && <span>{car.km}</span>}
                        <span>{car.type}</span>
                        <span>{car.transmission}</span>
                        <span>{car.condition}</span>
                      </div>

                      <div className="car-price">
                        {car.price}
                        {car.discount && (
                          <span className="discount">{car.discount}</span>
                        )}
                      </div>

                      <div className="car-location">
                        <LocationIcon />
                        <span>{car.location}</span>
                      </div>

                      <div className="car-seller">
                        <div className="seller-info">
                          <div className="seller-avatar">👤</div>
                          <div className="seller-details">
                            <span className="seller-name">
                              {car.seller}
                              {car.verified && <VerifiedIcon />}
                            </span>
                            {car.rating && (
                              <span className="seller-rating">
                                {car.rating} ⭐ {car.reviews}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="car-actions">
                        <button className="action-btn primary">
                          <PhoneIcon />
                          Bấm để hiện số
                        </button>
                        <button className="action-btn">
                          <ChatIcon />
                          Chat
                        </button>
                        <button className="action-btn icon-only">
                          <HeartIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Range Banner */}
              <div className="price-range-banner">
                <span className="banner-icon">🚗</span>
                <span className="banner-text">Bạn tìm xe trong khoảng giá nào?</span>
                <span className="banner-icon">🚙</span>
              </div>

              <div className="price-range-options">
                <button className="price-option">dưới 300 triệu</button>
                <button className="price-option">300 - 500 triệu</button>
                <button className="price-option">500 - 800 triệu</button>
                <button className="price-option">trên 800 triệu</button>
              </div>

              {/* Brand Selection Section */}
              <div className="brand-selection-section">
                <h2 className="section-title">Bạn cần tìm hãng xe nào ?</h2>
                <div className="brand-grid">
                  {brands.slice(0, 8).map((brand, index) => (
                    <div key={index} className="brand-card">
                      <div className="brand-logo-large">{brand.logo}</div>
                      <div className="brand-name">{brand.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellOtoPage
