import { useState, useEffect } from 'react'
import { carAPI } from './api'
import "./index.scss"

// Icon Components
const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)

const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
)

const ListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

function SellOtoPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [showAllPrices, setShowAllPrices] = useState(false)
  const [showAllCarTypes, setShowAllCarTypes] = useState(false)
  const [showAllSeats, setShowAllSeats] = useState(false)
  const [showAllCities, setShowAllCities] = useState(false)
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false)
  
  // API States
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [apiCars, setApiCars] = useState([])
  const [apiBrands, setApiBrands] = useState([])
  const [apiCities, setApiCities] = useState([])
  const [apiConnected, setApiConnected] = useState(false)
  const [filters, setFilters] = useState({
    condition: 'used',
    priceRange: [],
    carType: [],
    seats: [],
    location: []
  })
  const [showPriceDropdown, setShowPriceDropdown] = useState(false)
  const [showYearDropdown, setShowYearDropdown] = useState(false)
  const [showBrandDropdown, setShowBrandDropdown] = useState(false)
  const [showConditionDropdown, setShowConditionDropdown] = useState(false)
  const [showMoreFiltersDropdown, setShowMoreFiltersDropdown] = useState(false)

  // Load data từ API
  useEffect(() => {
    loadInitialData()
  }, [])

  // Load cars khi filters thay đổi
  useEffect(() => {
    loadCars()
  }, [filters])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [brandsRes, citiesRes, conditionsRes, fuelsRes, transmissionsRes] = await Promise.all([
        carAPI.getBrands(),
        carAPI.getCities(),
        carAPI.getConditions(),
        carAPI.getFuels(),
        carAPI.getTransmissions()
      ])
      
      // Xử lý response data
      setApiBrands(brandsRes.data || brandsRes || [])
      setApiCities(citiesRes.data || citiesRes || [])
      
      console.log('API Data loaded:', {
        brands: brandsRes.data || brandsRes,
        cities: citiesRes.data || citiesRes,
        conditions: conditionsRes.data || conditionsRes,
        fuels: fuelsRes.data || fuelsRes,
        transmissions: transmissionsRes.data || transmissionsRes
      })
    } catch (err) {
      console.error('Error loading initial data:', err)
      setError(`Không thể tải dữ liệu ban đầu: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const loadCars = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Gọi API filter cars
      const response = await carAPI.filterCars(filters)
      const carsData = response.data || response || []
      
      console.log('Cars loaded from API:', carsData)
      setApiCars(carsData)
      
    } catch (err) {
      console.error('Error loading cars:', err)
      setError(`Không thể tải danh sách xe: ${err.message}`)
      // Fallback về mock data
      setApiCars(carListings)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  // Test API connection
  const testAPIConnection = async () => {
    try {
      console.log('Testing API connection to:', 'http://14.225.206.98:8080')
      const response = await carAPI.getCars({ page: 1, limit: 5 })
      console.log('API Connection successful:', response)
      setApiConnected(true)
      return true
    } catch (err) {
      console.error('API Connection failed:', err)
      setApiConnected(false)
      setError(`API Connection failed: ${err.message}`)
      return false
    }
  }

  // Test API khi component mount
  useEffect(() => {
    testAPIConnection()
  }, [])

  const brands = [
    { name: 'MG', logo: '🚙', count: 3210 },
    { name: 'VinFast', logo: '⚡', count: 8950 },
    { name: 'Wuling', logo: '🚗', count: 2150 },
    { name: 'Hyundai', logo: '🚗', count: 4320 },
    { name: 'Mercedes Benz', logo: '⭐', count: 1560 },
    { name: 'BMW', logo: '🚗', count: 2890 },
    { name: 'Audi', logo: '🚗', count: 1980 },
    { name: 'Toyota', logo: '🚗', count: 5670 },
    { name: 'Honda', logo: '🚗', count: 4230 },
    { name: 'Ford', logo: '🚗', count: 3120 }
  ]

  const locations = [
    { name: 'Hà Nội', count: 15420 },
    { name: 'TP. Hồ Chí Minh', count: 18950 },
    { name: 'Đà Nẵng', count: 8750 },
    { name: 'Hải Phòng', count: 6320 },
    { name: 'Cần Thơ', count: 4890 },
    { name: 'An Giang', count: 3210 },
    { name: 'Bà Rịa - Vũng Tàu', count: 4560 },
    { name: 'Bắc Giang', count: 2890 },
    { name: 'Bắc Kạn', count: 1230 },
    { name: 'Bạc Liêu', count: 1890 }
  ]

  const priceRanges = [
    'Dưới 500 triệu',
    '500 - 800 triệu',
    '800 triệu - 1.2 tỷ',
    '1.2 - 1.8 tỷ',
    '1.8 - 2.5 tỷ',
    '2.5 - 3.5 tỷ',
    '3.5 - 5 tỷ',
    'Trên 5 tỷ'
  ]

  const carTypes = [
    'Sedan',
    'SUV',
    'Hatchback',
    'Crossover',
    'Coupe',
    'Convertible',
    'Wagon',
    'Pickup'
  ]

  const seats = [
    '2 chỗ',
    '4 chỗ',
    '5 chỗ',
    '7 chỗ',
    '8 chỗ',
    '9 chỗ'
  ]

  const cities = [
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'An Giang',
    'Bà Rịa - Vũng Tàu',
    'Bắc Giang',
    'Bắc Kạn',
    'Bạc Liêu'
  ]

  const carListings = [
    {
      id: 1,
      title: 'VinFast VF8 2023 - Xe điện cao cấp',
      price: '1.2 tỷ',
      location: 'Hà Nội',
      year: '2023',
      mileage: '5.000 km',
      condition: 'Mới',
      type: 'SUV',
      seats: '7 chỗ',
      fuel: 'Điện',
      transmission: 'Tự động',
      brand: 'VinFast',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
      vip: true,
      featured: false,
      seller: 'Nguyễn Văn A',
      phone: '0901234567',
      description: 'Xe điện VinFast VF8 mới 100%, đầy đủ phụ kiện, bảo hành chính hãng.'
    },
    {
      id: 2,
      title: 'MG ZS EV 2022 - Xe điện tiết kiệm',
      price: '850 triệu',
      location: 'TP. Hồ Chí Minh',
      year: '2022',
      mileage: '12.000 km',
      condition: 'Đã sử dụng',
      type: 'SUV',
      seats: '5 chỗ',
      fuel: 'Điện',
      transmission: 'Tự động',
      brand: 'MG',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
      vip: false,
      featured: true,
      seller: 'Trần Thị B',
      phone: '0907654321',
      description: 'Xe điện MG ZS EV đã sử dụng, tình trạng tốt, tiết kiệm điện năng.'
    },
    {
      id: 3,
      title: 'Wuling Hongguang Mini EV 2023',
      price: '450 triệu',
      location: 'Đà Nẵng',
      year: '2023',
      mileage: '3.000 km',
      condition: 'Mới',
      type: 'Hatchback',
      seats: '4 chỗ',
      fuel: 'Điện',
      transmission: 'Tự động',
      brand: 'Wuling',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
      vip: false,
      featured: false,
      seller: 'Lê Văn C',
      phone: '0909876543',
      description: 'Xe điện mini Wuling Hongguang, phù hợp cho thành phố, giá rẻ.'
    }
  ]

  return (
    <div className="sell-oto-page">
      {/* Header Section */}
      <div className="header-section">
        <div className="header-content">
          <h1>🚗 Bán xe ô tô điện</h1>
          <p>Tìm kiếm và mua bán xe ô tô điện uy tín, chất lượng</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-item">
          <button 
            className={`filter-btn ${showPriceDropdown ? 'active' : ''}`}
            onClick={() => setShowPriceDropdown(!showPriceDropdown)}
          >
            <FilterIcon />
            Khoảng giá
          </button>
        </div>
        
        <div className="filter-item">
          <button 
            className={`filter-btn ${showYearDropdown ? 'active' : ''}`}
            onClick={() => setShowYearDropdown(!showYearDropdown)}
          >
            <FilterIcon />
            Năm sản xuất
          </button>
        </div>
        
        <div className="filter-item">
          <button 
            className={`filter-btn ${showBrandDropdown ? 'active' : ''}`}
            onClick={() => setShowBrandDropdown(!showBrandDropdown)}
          >
            <FilterIcon />
            Thương hiệu
          </button>
        </div>
        
        <div className="filter-item">
          <button 
            className={`filter-btn ${showConditionDropdown ? 'active' : ''}`}
            onClick={() => setShowConditionDropdown(!showConditionDropdown)}
          >
            <FilterIcon />
            Tình trạng
          </button>
        </div>
        
        <div className="filter-item">
          <button 
            className={`filter-btn ${showMoreFiltersDropdown ? 'active' : ''}`}
            onClick={() => setShowMoreFiltersDropdown(!showMoreFiltersDropdown)}
          >
            <FilterIcon />
            Bộ lọc khác
          </button>
        </div>
      </div>

      {/* Location & Brand Filters */}
      <div className="location-brand-filters">
        <div className="location-filter">
          <h3>📍 Khu vực</h3>
          <div className="filter-options">
            {locations.slice(0, 6).map((location, index) => (
              <button key={index} className="filter-option">
                {location.name} ({location.count})
              </button>
            ))}
          </div>
        </div>
        
        <div className="brand-filter">
          <h3>🏷️ Thương hiệu</h3>
          <div className="filter-options">
            {brands.slice(0, 6).map((brand, index) => (
              <button key={index} className="filter-option">
                {brand.logo} {brand.name} ({brand.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-header">
            <h2>Bộ lọc thông minh</h2>
            <p>Tìm kiếm xe ô tô phù hợp với nhu cầu của bạn</p>
          </div>
          <div className="filters-content">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">Tình trạng xe</label>
                <div className="filter-option">
                  <input type="radio" name="condition" defaultChecked />
                  <span>Đã sử dụng</span>
                </div>
                <div className="filter-option">
                  <input type="radio" name="condition" />
                  <span>Mới</span>
                </div>
                <div className="filter-option">
                  <input type="radio" name="condition" />
                  <span>Va chạm nhẹ</span>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Khoảng giá</label>
                {(showAllPrices ? priceRanges : priceRanges.slice(0, 3)).map((range, index) => (
                  <div key={index} className="filter-option">
                    <input type="checkbox" />
                    <span>{range}</span>
                  </div>
                ))}
                <button 
                  className="show-more-btn"
                  onClick={() => setShowAllPrices(!showAllPrices)}
                >
                  {showAllPrices ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                </button>
              </div>

              <div className="filter-group">
                <label className="filter-label">Kiểu dáng</label>
                {(showAllCarTypes ? carTypes : carTypes.slice(0, 3)).map((type, index) => (
                  <div key={index} className="filter-option">
                    <input type="checkbox" />
                    <span>{type}</span>
                  </div>
                ))}
                <button 
                  className="show-more-btn"
                  onClick={() => setShowAllCarTypes(!showAllCarTypes)}
                >
                  {showAllCarTypes ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                </button>
              </div>

              <div className="filter-group">
                <label className="filter-label">Số chỗ</label>
                {(showAllSeats ? seats : seats.slice(0, 3)).map((seat, index) => (
                  <div key={index} className="filter-option">
                    <input type="checkbox" />
                    <span>{seat}</span>
                  </div>
                ))}
                <button 
                  className="show-more-btn"
                  onClick={() => setShowAllSeats(!showAllSeats)}
                >
                  {showAllSeats ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                </button>
              </div>

              <div className="filter-group">
                <label className="filter-label">Khu vực</label>
                {(showAllCities ? cities : cities.slice(0, 3)).map((city, index) => (
                  <div key={index} className="filter-option">
                    <input type="checkbox" />
                    <span>{city}</span>
                  </div>
                ))}
                <button 
                  className="show-more-btn"
                  onClick={() => setShowAllCities(!showAllCities)}
                >
                  {showAllCities ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="listings-section">
          <div className="tabs-bar">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Tất cả ({carListings.length})
              </button>
              <button 
                className={`tab ${activeTab === 'new' ? 'active' : ''}`}
                onClick={() => setActiveTab('new')}
              >
                Mới (12)
              </button>
              <button 
                className={`tab ${activeTab === 'used' ? 'active' : ''}`}
                onClick={() => setActiveTab('used')}
              >
                Đã sử dụng (8)
              </button>
              <button 
                className={`tab ${activeTab === 'vip' ? 'active' : ''}`}
                onClick={() => setActiveTab('vip')}
              >
                Tin VIP (3)
              </button>
            </div>
            
            <div className="view-controls">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <GridIcon />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <ListIcon />
              </button>
            </div>
          </div>

          {/* API Status */}
          <div className="api-status">
            <div className={`status-indicator ${apiConnected ? 'connected' : 'disconnected'}`}>
              <span className="status-dot"></span>
              <span className="status-text">
                {apiConnected ? '🟢 API Connected' : '🔴 API Disconnected'}
              </span>
            </div>
            <div className="api-info">
              <small>Server: http://14.225.206.98:8080</small>
              <button onClick={testAPIConnection} className="test-btn">
                Test Connection
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Đang tải dữ liệu từ API...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-state">
              <p>❌ {error}</p>
              <button onClick={loadCars}>Thử lại</button>
            </div>
          )}

          {/* Car Listings Grid */}
          <div className="listings-grid">
            {(apiCars.length > 0 ? apiCars : carListings).map((car) => (
              <div key={car.id} className="car-card">
                {car.vip && <div className="vip-badge">Tin VIP</div>}
                {car.featured && <div className="featured-badge">Tin tiêu biểu</div>}
                
                <div className="car-image">
                  {car.image ? (
                    <img src={car.image} alt={car.title} />
                  ) : (
                    <div className="placeholder-image">
                      <div className="placeholder-icon">🚗</div>
                      <div className="placeholder-text">Hình ảnh</div>
                    </div>
                  )}
                </div>
                
                <div className="car-info">
                  <h3 className="car-title">{car.title}</h3>
                  <div className="car-price">{car.price}</div>
                  <div className="car-details">
                    <span className="car-year">{car.year}</span>
                    <span className="car-mileage">{car.mileage}</span>
                    <span className="car-location">📍 {car.location}</span>
                  </div>
                  <div className="car-specs">
                    <span className="spec-item">{car.type}</span>
                    <span className="spec-item">{car.seats}</span>
                    <span className="spec-item">{car.fuel}</span>
                    <span className="spec-item">{car.transmission}</span>
                  </div>
                  <div className="car-actions">
                    <button className="action-btn heart">
                      <HeartIcon />
                    </button>
                    <button className="action-btn chat">
                      <ChatIcon />
                    </button>
                    <button className="action-btn phone">
                      <PhoneIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellOtoPage