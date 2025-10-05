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

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

function SellBikePage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [showAllPrices, setShowAllPrices] = useState(false)
  const [showAllCities, setShowAllCities] = useState(false)
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false)
  const [showPriceDropdown, setShowPriceDropdown] = useState(false)
  const [showYearDropdown, setShowYearDropdown] = useState(false)
  const [showBrandDropdown, setShowBrandDropdown] = useState(false)
  const [showConditionDropdown, setShowConditionDropdown] = useState(false)
  const [showMoreFiltersDropdown, setShowMoreFiltersDropdown] = useState(false)

  const brands = [
    { name: 'Pega', logo: '🏍️', count: 12450 },
    { name: 'DKBike', logo: '🏍️', count: 9320 },
    { name: 'VinFast', logo: '⚡', count: 8950 },
    { name: 'Dibao', logo: '🏍️', count: 6210 },
    { name: 'Honda', logo: '🏍️', count: 5840 },
    { name: 'Piaggio', logo: '🏍️', count: 3560 },
    { name: 'Yadea', logo: '⚡', count: 2980 },
    { name: 'Dat Bike', logo: '⚡', count: 1870 }
  ]

  const locations = [
    'Tp Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Bình Dương', 'Gần tôi'
  ]

  const bikeListings = [
    {
      id: 1,
      title: 'Honda SH Mode 2024 - Mới 100% - Giá tốt nhất',
      year: 2024,
      type: 'Xăng',
      condition: 'Mới',
      price: '58,000,000 đ',
      location: 'Tp Hồ Chí Minh',
      seller: 'HONDA HEAD MIỀN NAM',
      verified: true,
      images: 8,
      featured: true,
      vip: true,
      discount: '5% thỏa thuận'
    },
    {
      id: 2,
      title: 'VinFast Evo 200 - Xe điện thông minh',
      year: 2024,
      type: 'Điện',
      condition: 'Mới',
      price: '62,900,000 đ',
      location: 'Hà Nội',
      seller: 'VinFast Showroom',
      verified: true,
      images: 10,
      featured: true,
      vip: false
    },
    {
      id: 3,
      title: 'Yamaha Exciter 155 2023 - Xe zin chính chủ',
      year: 2023,
      km: '5000 km',
      type: 'Xăng',
      condition: 'Đã sử dụng',
      price: '45,000,000 đ',
      location: 'Đà Nẵng',
      seller: 'Nguyễn Văn A',
      verified: false,
      images: 6,
      featured: false,
      vip: true
    },
    {
      id: 4,
      title: 'Honda Vision 2022 - 1 chủ từ đầu, biển Hà Nội',
      year: 2022,
      km: '8000 km',
      type: 'Xăng',
      condition: 'Đã sử dụng',
      price: '28,500,000 đ',
      location: 'Hà Nội',
      seller: 'Trần Minh',
      verified: true,
      images: 7,
      rating: 4.8,
      reviews: '23 đã bán',
      featured: false,
      vip: false
    },
    {
      id: 5,
      title: 'Yadea Xmen Neo - Pin 60V giá cực tốt',
      year: 2024,
      type: 'Điện',
      condition: 'Mới',
      price: '18,900,000 đ',
      location: 'Bình Dương',
      seller: 'Yadea Chính Hãng',
      verified: true,
      images: 5,
      featured: true,
      vip: false,
      discount: 'Giá tốt'
    },
    {
      id: 6,
      title: 'Dat Bike Weaver 200 - Xe điện thông minh 2024',
      year: 2024,
      type: 'Điện',
      condition: 'Mới',
      price: '85,000,000 đ',
      location: 'Tp Hồ Chí Minh',
      seller: 'Dat Bike Official',
      verified: true,
      images: 12,
      rating: 4.9,
      featured: true,
      vip: true,
      discount: 'Trả góp 0%'
    }
  ]

  const priceRanges = [
    'Giá dưới 10 triệu',
    'Giá 10 triệu - 20 triệu',
    'Giá 20 triệu - 30 triệu',
    'Giá 30 triệu - 40 triệu',
    'Giá 40 triệu - 50 triệu',
    'Giá 50 triệu - 70 triệu',
    'Giá 70 triệu - 100 triệu',
    'Trên 100 triệu'
  ]
  
  const cities = [
    'Tp Hồ Chí Minh',
    'Hà Nội',
    'Đà Nẵng',
    'Cần Thơ',
    'Hải Phòng',
    'Bình Dương',
    'Đồng Nai',
    'Vũng Tàu'
  ]

  // Lấy ngày hiện tại theo định dạng DD/MM/YYYY
  const getCurrentDate = () => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <div className="sell-bike-page">
      {/* Header Section */}
      <div className="page-header">
        <div className="container">
          <div className="header-top">
            <div className="breadcrumb">
              <a onClick={() => onNavigate && onNavigate('home')} style={{cursor: 'pointer'}}>EcoXe</a>
              <span>/</span>
              <span>Xe điện</span>
            </div>
            <button className="home-btn" onClick={() => onNavigate && onNavigate('home')}>
              <HomeIcon />
              <span>Trang chủ</span>
            </button>
          </div>
          <h1 className="page-title">28.456 xe điện cũ mới giá tốt cập nhật {getCurrentDate()}</h1>
          
          {/* Filter Bar */}
          <div className="filter-bar">
            <button className="filter-btn">
              <FilterIcon />
              <span>Lọc</span>
            </button>
            <div className="filter-dropdown-wrapper">
              <button 
                className="filter-btn active"
                onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
              >
                <span>Xe điện</span>
                <ChevronDownIcon />
              </button>
              {showVehicleDropdown && (
                <div className="dropdown-menu">
                  <a onClick={() => onNavigate && onNavigate('oto')} className="dropdown-item" style={{cursor: 'pointer'}}>Xe ô tô</a>
                  <a onClick={() => onNavigate && onNavigate('battery')} className="dropdown-item" style={{cursor: 'pointer'}}>Pin</a>
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button 
                className="filter-btn"
                onClick={() => setShowPriceDropdown(!showPriceDropdown)}
              >
                <span>Giá</span>
                <ChevronDownIcon />
              </button>
              {showPriceDropdown && (
                <div className="dropdown-menu">
                  {priceRanges.map((range, index) => (
                    <a key={index} href="#" className="dropdown-item">{range}</a>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button 
                className="filter-btn"
                onClick={() => setShowYearDropdown(!showYearDropdown)}
              >
                <span>Năm sản xuất</span>
                <ChevronDownIcon />
              </button>
              {showYearDropdown && (
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">2025</a>
                  <a href="#" className="dropdown-item">2024</a>
                  <a href="#" className="dropdown-item">2023</a>
                  <a href="#" className="dropdown-item">2022</a>
                  <a href="#" className="dropdown-item">2021</a>
                  <a href="#" className="dropdown-item">2020</a>
                  <a href="#" className="dropdown-item">2019</a>
                  <a href="#" className="dropdown-item">Trước 2019</a>
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button 
                className="filter-btn"
                onClick={() => setShowBrandDropdown(!showBrandDropdown)}
              >
                <span>Hãng xe</span>
                <ChevronDownIcon />
              </button>
              {showBrandDropdown && (
                <div className="dropdown-menu">
                  {brands.map((brand, index) => (
                    <a key={index} href="#" className="dropdown-item">
                      {brand.logo} {brand.name} ({brand.count})
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button 
                className="filter-btn"
                onClick={() => setShowConditionDropdown(!showConditionDropdown)}
              >
                <span>Tình trạng</span>
                <ChevronDownIcon />
              </button>
              {showConditionDropdown && (
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">Mới</a>
                  <a href="#" className="dropdown-item">Đã sử dụng</a>
                  <a href="#" className="dropdown-item">Va chạm nhẹ</a>
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button 
                className="filter-btn more"
                onClick={() => setShowMoreFiltersDropdown(!showMoreFiltersDropdown)}
              >
                <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor">
                  <circle cx="2" cy="2" r="2"/><circle cx="2" cy="8" r="2"/><circle cx="2" cy="14" r="2"/>
                </svg>
              </button>
              {showMoreFiltersDropdown && (
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">Công suất động cơ</a>
                  <a href="#" className="dropdown-item">Dung lượng pin</a>
                  <a href="#" className="dropdown-item">Quãng đường</a>
                  <a href="#" className="dropdown-item">Hộp số</a>
                  <a href="#" className="dropdown-item">Màu sắc</a>
                  <a href="#" className="dropdown-item">Xuất xứ</a>
                </div>
              )}
            </div>
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
                  Mua bán xe điện
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

              {/* Bike Listings Grid */}
              <div className="listings-grid">
                {bikeListings.map((bike) => (
                  <div key={bike.id} className="bike-card">
                    {bike.vip && <div className="vip-badge">Tin VIP</div>}
                    {bike.featured && <div className="featured-badge">Tin tiêu biểu</div>}
                    
                    <div className="bike-image">
                      <img src="/api/placeholder/400/300" alt={bike.title} />
                      <button className="favorite-btn">
                        <HeartIcon />
                      </button>
                      <div className="image-count">{bike.images} 📷</div>
                    </div>

                    <div className="bike-content">
                      <h3 className="bike-title">{bike.title}</h3>
                      
                      <div className="bike-specs">
                        <span>{bike.year}</span>
                        {bike.km && <span>{bike.km}</span>}
                        <span>{bike.type}</span>
                        <span>{bike.condition}</span>
                      </div>

                      <div className="bike-price">
                        {bike.price}
                        {bike.discount && (
                          <span className="discount">{bike.discount}</span>
                        )}
                      </div>

                      <div className="bike-location">
                        <LocationIcon />
                        <span>{bike.location}</span>
                      </div>

                      <div className="bike-seller">
                        <div className="seller-info">
                          <div className="seller-avatar">👤</div>
                          <div className="seller-details">
                            <span className="seller-name">
                              {bike.seller}
                              {bike.verified && <VerifiedIcon />}
                            </span>
                            {bike.rating && (
                              <span className="seller-rating">
                                {bike.rating} ⭐ {bike.reviews}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bike-actions">
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
                <span className="banner-icon">🏍️</span>
                <span className="banner-text">Bạn tìm xe điện trong khoảng giá nào?</span>
                <span className="banner-icon">⚡</span>
              </div>

              <div className="price-range-options">
                <button className="price-option">dưới 20 triệu</button>
                <button className="price-option">20 - 40 triệu</button>
                <button className="price-option">40 - 70 triệu</button>
                <button className="price-option">trên 70 triệu</button>
              </div>

              {/* Brand Selection Section */}
              <div className="brand-selection-section">
                <h2 className="section-title">Bạn cần tìm hãng xe điện nào ?</h2>
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

export default SellBikePage
