import React, { useState, useEffect } from 'react'
import "./index.scss"

// Icon Components
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
)

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
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

function SearchPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [filters, setFilters] = useState({
    vehicleType: '',
    priceRange: '',
    location: '',
    year: '',
    brand: '',
    condition: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  // Mock search results data
  const mockResults = [
    {
      id: 1,
      title: 'VinFast VF 8 Plus 2023 - Pin thuê bao',
      year: 2023,
      km: '8,500 km',
      type: 'Điện',
      transmission: 'Tự động',
      condition: 'Mới',
      price: '250,000,000 đ',
      location: 'Quận Cầu Giấy, Hà Nội',
      images: 12,
      image: '',
      timePosted: '1 phút trước',
      badge: 'Mới đăng',
      featured: true,
      vip: true,
      discount: '6% thỏa thuận'
    },
    {
      id: 2,
      title: 'Pin Lithium 48V 20Ah cho xe máy điện',
      year: 2024,
      status: 'Pin',
      transmission: 'Mới 100%',
      condition: 'Chính hãng',
      price: '12,500,000 đ',
      location: 'Quận 7, TP.HCM',
      images: 6,
      image: '',
      videoCount: 1,
      timePosted: 'Tin tiêu biểu',
      badge: 'Tin tiêu biểu',
      featured: true,
      vip: false
    },
    {
      id: 3,
      title: 'Yadea S3 Pro 2023 - Xe máy điện',
      year: 2023,
      km: '2,300 km',
      type: 'Điện',
      transmission: 'Tự động',
      condition: 'Như mới',
      price: '18,900,000 đ',
      location: 'Quận Tân Bình, TP.HCM',
      images: 10,
      image: '',
      timePosted: '15 phút trước',
      badge: null,
      featured: false,
      vip: false
    },
    {
      id: 4,
      title: 'Honda Wave RSX 2022 - 1 chủ mua mới',
      year: 2022,
      km: '15,000 km',
      type: 'Xăng',
      transmission: 'Số',
      condition: '1 chủ',
      price: '25,000,000 đ',
      location: 'Quận Đống Đa, Hà Nội',
      images: 15,
      image: '',
      timePosted: '30 phút trước',
      badge: null,
      featured: false,
      vip: true
    },
    {
      id: 5,
      title: 'Yamaha Exciter 155 2024 - Màu đỏ',
      year: 2024,
      km: '500 km',
      type: 'Xăng',
      transmission: 'Số',
      condition: 'Mới',
      price: '45,000,000 đ',
      location: 'Quận 1, TP.HCM',
      images: 8,
      image: '',
      timePosted: '2 giờ trước',
      badge: 'Mới đăng',
      featured: false,
      vip: false
    },
    {
      id: 6,
      title: 'Pin 60V 30Ah cho xe máy điện - Bảo hành 2 năm',
      year: 2024,
      status: 'Pin',
      transmission: 'Mới 100%',
      condition: 'Chính hãng',
      price: '8,500,000 đ',
      location: 'Quận Hai Bà Trưng, Hà Nội',
      images: 4,
      image: '',
      timePosted: '3 giờ trước',
      badge: null,
      featured: false,
      vip: false
    },
    {
      id: 7,
      title: 'Honda SH Mode 2023 - Xe cũ 1 chủ',
      year: 2023,
      km: '12,000 km',
      type: 'Xăng',
      transmission: 'Tự động',
      condition: '1 chủ',
      price: '35,000,000 đ',
      location: 'Quận Thanh Xuân, Hà Nội',
      images: 14,
      image: '',
      timePosted: '4 giờ trước',
      badge: null,
      featured: false,
      vip: true
    },
    {
      id: 8,
      title: 'VinFast Klara S 2024 - Xe máy điện cao cấp',
      year: 2024,
      km: '1,200 km',
      type: 'Điện',
      transmission: 'Tự động',
      condition: 'Như mới',
      price: '22,000,000 đ',
      location: 'Quận Bình Thạnh, TP.HCM',
      images: 11,
      image: '',
      timePosted: '5 giờ trước',
      badge: null,
      featured: true,
      vip: false
    },
    {
      id: 9,
      title: 'Pin 72V 40Ah cho xe tải điện - Công suất cao',
      year: 2024,
      status: 'Pin',
      transmission: 'Mới 100%',
      condition: 'Chính hãng',
      price: '15,000,000 đ',
      location: 'Quận Cầu Giấy, Hà Nội',
      images: 7,
      image: '',
      timePosted: '6 giờ trước',
      badge: null,
      featured: false,
      vip: false
    },
    {
      id: 10,
      title: 'Suzuki Raider R150 2023 - Xe cũ nguyên bản',
      year: 2023,
      km: '8,500 km',
      type: 'Xăng',
      transmission: 'Số',
      condition: 'Nguyên bản',
      price: '28,000,000 đ',
      location: 'Quận 10, TP.HCM',
      images: 9,
      image: '',
      timePosted: '7 giờ trước',
      badge: null,
      featured: false,
      vip: false
    },
    {
      id: 11,
      title: 'Gogoro S2 2024 - Xe máy điện thông minh',
      year: 2024,
      km: '800 km',
      type: 'Điện',
      transmission: 'Tự động',
      condition: 'Mới',
      price: '32,000,000 đ',
      location: 'Quận Đống Đa, Hà Nội',
      images: 13,
      image: '',
      timePosted: '8 giờ trước',
      badge: 'Tin tiêu biểu',
      featured: true,
      vip: true
    },
    {
      id: 12,
      title: 'Pin 48V 15Ah cho xe đạp điện - Tiết kiệm điện',
      year: 2024,
      status: 'Pin',
      transmission: 'Mới 100%',
      condition: 'Chính hãng',
      price: '6,500,000 đ',
      location: 'Quận Tân Phú, TP.HCM',
      images: 5,
      image: '',
      timePosted: '9 giờ trước',
      badge: null,
      featured: false,
      vip: false
    },
    {
      id: 13,
      title: 'Honda Air Blade 2023 - Xe cũ đẹp',
      year: 2023,
      km: '18,000 km',
      type: 'Xăng',
      transmission: 'Tự động',
      condition: 'Đẹp',
      price: '30,000,000 đ',
      location: 'Quận Hải Châu, Đà Nẵng',
      images: 16,
      image: '',
      timePosted: '10 giờ trước',
      badge: null,
      featured: false,
      vip: false
    },
    {
      id: 14,
      title: 'VinFast VF e34 2024 - Ô tô điện 4 chỗ',
      year: 2024,
      km: '3,500 km',
      type: 'Điện',
      transmission: 'Tự động',
      condition: 'Như mới',
      price: '450,000,000 đ',
      location: 'Quận 2, TP.HCM',
      images: 20,
      image: '',
      timePosted: '11 giờ trước',
      badge: 'Tin VIP',
      featured: true,
      vip: true,
      discount: '8% thỏa thuận'
    },
    {
      id: 15,
      title: 'Pin 12V 100Ah cho xe tải - Dung lượng lớn',
      year: 2024,
      status: 'Pin',
      transmission: 'Mới 100%',
      condition: 'Chính hãng',
      price: '4,200,000 đ',
      location: 'Quận Ninh Kiều, Cần Thơ',
      images: 3,
      image: '',
      timePosted: '12 giờ trước',
      badge: null,
      featured: false,
      vip: false
    }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    performSearch()
  }

  const performSearch = () => {
    // Filter results based on search query and filters
    const filteredResults = mockResults.filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.condition?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesType = !filters.vehicleType || 
        item.type === filters.vehicleType || 
        item.status === filters.vehicleType
      
      const matchesLocation = !filters.location || 
        item.location.includes(filters.location)
      
      const matchesYear = !filters.year || 
        item.year.toString() === filters.year

      // Price range filtering
      let matchesPrice = true
      if (filters.priceRange) {
        const price = parseInt(item.price.replace(/[^\d]/g, ''))
        switch (filters.priceRange) {
          case '0-50':
            matchesPrice = price < 50000000
            break
          case '50-100':
            matchesPrice = price >= 50000000 && price < 100000000
            break
          case '100-300':
            matchesPrice = price >= 100000000 && price < 300000000
            break
          case '300-500':
            matchesPrice = price >= 300000000 && price < 500000000
            break
          case '500+':
            matchesPrice = price >= 500000000
            break
          default:
            matchesPrice = true
        }
      }

      return matchesSearch && matchesType && matchesLocation && matchesYear && matchesPrice
    })
    setSearchResults(filteredResults)
  }

  // Load all results on component mount
  useEffect(() => {
    setSearchResults(mockResults)
  }, [])

  // Auto search when search query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch()
    }, 300) // Debounce search by 300ms

    return () => clearTimeout(timeoutId)
  }, [searchQuery, filters])

  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value
    }
    setFilters(newFilters)
    
    // Auto search when filter changes
    const filteredResults = mockResults.filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.condition?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesType = !newFilters.vehicleType || 
        item.type === newFilters.vehicleType || 
        item.status === newFilters.vehicleType
      
      const matchesLocation = !newFilters.location || 
        item.location.includes(newFilters.location)
      
      const matchesYear = !newFilters.year || 
        item.year.toString() === newFilters.year

      // Price range filtering
      let matchesPrice = true
      if (newFilters.priceRange) {
        const price = parseInt(item.price.replace(/[^\d]/g, ''))
        switch (newFilters.priceRange) {
          case '0-50':
            matchesPrice = price < 50000000
            break
          case '50-100':
            matchesPrice = price >= 50000000 && price < 100000000
            break
          case '100-300':
            matchesPrice = price >= 100000000 && price < 300000000
            break
          case '300-500':
            matchesPrice = price >= 300000000 && price < 500000000
            break
          case '500+':
            matchesPrice = price >= 500000000
            break
          default:
            matchesPrice = true
        }
      }

      return matchesSearch && matchesType && matchesLocation && matchesYear && matchesPrice
    })
    setSearchResults(filteredResults)
  }

  const clearFilters = () => {
    const clearedFilters = {
      vehicleType: '',
      priceRange: '',
      location: '',
      year: '',
      brand: '',
      condition: ''
    }
    setFilters(clearedFilters)
    setSearchQuery('')
    
    // Reset to show all results
    setSearchResults(mockResults)
  }

  return (
    <div className="search-page">
      <div className="container">
        {/* Search Header */}
        <div className="search-header">
          <h1>Tìm kiếm xe</h1>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <SearchIcon />
              <input
                type="text"
                placeholder="Tìm kiếm: VinFast, Honda, Yamaha, Pin, Điện, Xăng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <SearchIcon />
              </button>
            </div>
          </form>
          
          {/* Search suggestions */}
          <div className="search-suggestions">
            <span>Gợi ý tìm kiếm:</span>
            <button 
              className="suggestion-tag"
              onClick={() => setSearchQuery('VinFast')}
            >
              VinFast
            </button>
            <button 
              className="suggestion-tag"
              onClick={() => setSearchQuery('Honda')}
            >
              Honda
            </button>
            <button 
              className="suggestion-tag"
              onClick={() => setSearchQuery('Pin')}
            >
              Pin
            </button>
            <button 
              className="suggestion-tag"
              onClick={() => setSearchQuery('Điện')}
            >
              Xe điện
            </button>
            <button 
              className="suggestion-tag"
              onClick={() => setSearchQuery('Xăng')}
            >
              Xe xăng
            </button>
          </div>
          
          <div className="search-actions">
            <button 
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon />
              <span>Bộ lọc</span>
            </button>
            
            <div className="sort-section">
              <label>Sắp xếp:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
              </select>
            </div>
          </div>
        </div>

        <div className="search-content">
          {/* Filters Sidebar */}
          <div className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Bộ lọc</h3>
              <button className="clear-filters" onClick={clearFilters}>
                Xóa bộ lọc
              </button>
            </div>
            
            <div className="filter-group">
              <h4>Loại xe</h4>
              <select 
                value={filters.vehicleType}
                onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                className="filter-select"
              >
                <option value="">Tất cả</option>
                <option value="Điện">Xe điện</option>
                <option value="Xăng">Xe xăng</option>
                <option value="Pin">Pin</option>
              </select>
            </div>
            
            <div className="filter-group">
              <h4>Khoảng giá</h4>
              <select 
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="filter-select"
              >
                <option value="">Tất cả</option>
                <option value="0-50">Dưới 50 triệu</option>
                <option value="50-100">50-100 triệu</option>
                <option value="100-300">100-300 triệu</option>
                <option value="300-500">300-500 triệu</option>
                <option value="500+">Trên 500 triệu</option>
              </select>
            </div>
            
            <div className="filter-group">
              <h4>Khu vực</h4>
              <select 
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="filter-select"
              >
                <option value="">Tất cả</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP.HCM">TP. Hồ Chí Minh</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Cần Thơ">Cần Thơ</option>
              </select>
            </div>
            
            <div className="filter-group">
              <h4>Năm sản xuất</h4>
              <select 
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="filter-select"
              >
                <option value="">Tất cả</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
            </div>
          </div>

          {/* Search Results */}
          <div className="search-results">
            <div className="results-header">
              <h2>Kết quả tìm kiếm</h2>
              <span className="results-count">
                {searchResults.length} kết quả
              </span>
            </div>
            
            {searchResults.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>Không tìm thấy kết quả nào</h3>
                <p>Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc</p>
                <button className="clear-search-btn" onClick={clearFilters}>
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="results-grid">
                {searchResults.map((item) => (
                  <div key={item.id} className="vehicle-card">
                    {item.vip && <div className="vip-badge">Tin VIP</div>}
                    {item.featured && <div className="featured-badge">Tin tiêu biểu</div>}
                    
                    <div className="vehicle-image">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.title}
                        />
                      ) : (
                        <div className="placeholder-image">
                          <div className="placeholder-icon">🚗</div>
                          <div className="placeholder-text">Hình ảnh</div>
                        </div>
                      )}
                      <button className="favorite-btn">
                        <HeartIcon />
                      </button>
                      <div className="image-count">{item.images} 📷</div>
                    </div>

                    <div className="vehicle-info">
                      <div className="vehicle-header">
                        <h3>{item.title}</h3>
                        <div className="vehicle-badges">
                          <span className="vehicle-type">{item.type}</span>
                          <span className="vehicle-year">{item.year}</span>
                        </div>
                      </div>

                      <div className="vehicle-specs">
                        <span>{item.year}</span>
                        {item.km && <span>{item.km}</span>}
                        <span>{item.transmission}</span>
                        <span>{item.condition}</span>
                      </div>

                      <div className="vehicle-price">
                        {item.price}
                        {item.discount && (
                          <span className="discount">{item.discount}</span>
                        )}
                      </div>

                      <div className="vehicle-location">
                        <LocationIcon />
                        <span>{item.location}</span>
                      </div>

                      <div className="vehicle-actions">
                        <button className="view-details-btn">
                          <PhoneIcon />
                          Bấm để hiện số
                        </button>
                        <button className="contact-btn">
                          <ChatIcon />
                          Chat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage
