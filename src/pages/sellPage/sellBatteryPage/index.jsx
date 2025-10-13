import { useState } from "react";
import { Link } from "react-router-dom";
import { useSaved } from "../../../contexts/AppContext";
import "./index.scss";

function SellBatteryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [showAllBatteryTypes, setShowAllBatteryTypes] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showCapacityDropdown, setShowCapacityDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showBatteryTypeDropdown, setShowBatteryTypeDropdown] = useState(false);
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [showMoreFiltersDropdown, setShowMoreFiltersDropdown] = useState(false);
  const { toggleSaved, isSaved } = useSaved();

  const handleToggleSaved = (e, battery) => {
    e.preventDefault();
    e.stopPropagation();
    const savedBattery = {
      ...battery,
      id: `battery-${battery.id}`, // Thêm prefix để tránh conflict với trang khác
      category: 'Pin xe điện',
      image: '/api/placeholder/400/300'
    };
    toggleSaved(savedBattery);
  };

  // Icon Components
  const FilterIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 10l5 5 5-5z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );

  const HeartIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  const ChatIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );

  const PhoneIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );

  const GridIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );

  const VerifiedIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#4CAF50">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );

  const HomeIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );

  const brands = [
    { name: "VinFast", logo: "🔋", count: 8950 },
    { name: "BYD", logo: "🔋", count: 4320 },
    { name: "Panasonic", logo: "🔋", count: 3210 },
    { name: "LG", logo: "🔋", count: 2890 },
    { name: "CATL", logo: "🔋", count: 2150 },
    { name: "Samsung SDI", logo: "🔋", count: 1870 },
    { name: "Khác", logo: "🔋", count: 1560 },
  ];

  const locations = [
    "Tp Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Cần Thơ",
    "Bình Dương",
    "Gần tôi",
  ];

  const batteryListings = [
    {
      id: 1,
      title: "Pin VinFast VF8 - Dung lượng 87.7 kWh - Bảo hành 8 năm",
      capacity: "87.7 kWh",
      type: "Lithium-ion",
      condition: "Mới",
      health: "100%",
      price: "280,000,000 đ",
      location: "Tp Hồ Chí Minh",
      seller: "VinFast Official Store",
      verified: true,
      images: 8,
      featured: true,
      vip: true,
      discount: "Trả góp 0%",
    },
    {
      id: 2,
      title: "Pin Tesla Model 3 Long Range - 82 kWh - 95% dung lượng",
      capacity: "82 kWh",
      type: "Lithium-ion",
      condition: "Đã sử dụng",
      health: "95%",
      price: "195,000,000 đ",
      location: "Hà Nội",
      seller: "Tesla Battery Center",
      verified: true,
      images: 10,
      featured: true,
      vip: false,
    },
    {
      id: 3,
      title: "Pin BYD Blade Battery 60.48 kWh - Công nghệ LFP an toàn",
      capacity: "60.48 kWh",
      type: "LFP (Lithium Iron Phosphate)",
      condition: "Mới",
      health: "100%",
      price: "165,000,000 đ",
      location: "Đà Nẵng",
      seller: "BYD Authorized Dealer",
      verified: true,
      images: 6,
      featured: false,
      vip: true,
    },
    {
      id: 4,
      title: "Pin VinFast VF5 - 37.23 kWh - Chính hãng, bảo hành còn 6 năm",
      capacity: "37.23 kWh",
      type: "Lithium-ion",
      condition: "Đã sử dụng",
      health: "92%",
      price: "85,000,000 đ",
      location: "Hà Nội",
      seller: "Nguyễn Minh Tuấn",
      verified: true,
      images: 7,
      rating: 4.8,
      reviews: "15 đã bán",
      featured: false,
      vip: false,
    },
    {
      id: 5,
      title: "Pin Panasonic NCR18650B - 48V 40Ah - Dùng cho xe máy điện",
      capacity: "1.92 kWh",
      type: "Lithium-ion 18650",
      condition: "Mới",
      health: "100%",
      price: "12,500,000 đ",
      location: "Bình Dương",
      seller: "Pin Xe Điện Chính Hãng",
      verified: true,
      images: 5,
      featured: true,
      vip: false,
      discount: "Giá tốt",
    },
    {
      id: 6,
      title: "Pin CATL LFP 75 kWh - Cho ô tô điện, tuổi thọ cao",
      capacity: "75 kWh",
      type: "LFP (Lithium Iron Phosphate)",
      condition: "Mới",
      health: "100%",
      price: "220,000,000 đ",
      location: "Tp Hồ Chí Minh",
      seller: "CATL Battery Vietnam",
      verified: true,
      images: 12,
      rating: 4.9,
      featured: true,
      vip: true,
      discount: "Bảo hành 10 năm",
    },
  ];

  const priceRanges = [
    "Dưới 20 triệu",
    "20 - 50 triệu",
    "50 - 100 triệu",
    "100 - 150 triệu",
    "150 - 200 triệu",
    "200 - 250 triệu",
    "250 - 300 triệu",
    "Trên 300 triệu",
  ];

  const batteryTypes = [
    "Lithium-ion (Li-ion)",
    "LFP (Lithium Iron Phosphate)",
    "NMC (Nickel Manganese Cobalt)",
    "LTO (Lithium Titanate)",
    "Pin 18650",
    "Pin 21700",
    "Pin khác",
  ];

  const cities = [
    "Tp Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Cần Thơ",
    "Hải Phòng",
    "Bình Dương",
    "Đồng Nai",
    "Vũng Tàu",
  ];

  // Lấy ngày hiện tại theo định dạng DD/MM/YYYY
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="sell-battery-page">
      {/* Header Section */}
      <div className="page-header">
        <div className="container">
          <div className="header-top">
            <div className="breadcrumb">
              <Link to="/">EcoXe</Link>
              <span>/</span>
              <span>Pin xe điện</span>
            </div>
            <Link to="/" className="home-btn">
              <HomeIcon />
              <span>Trang chủ</span>
            </Link>
          </div>
          <h1 className="page-title">
            15.678 pin xe điện cũ mới giá tốt cập nhật {getCurrentDate()}
          </h1>

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
                <span>Pin</span>
                <ChevronDownIcon />
              </button>
              {showVehicleDropdown && (
                <div className="dropdown-menu">
                  <Link to="/oto" className="dropdown-item">
                    Xe ô tô
                  </Link>
                  <Link to="/bike" className="dropdown-item">
                    Xe điện
                  </Link>
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
                    <a key={index} href="#" className="dropdown-item">
                      {range}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button
                className="filter-btn"
                onClick={() => setShowCapacityDropdown(!showCapacityDropdown)}
              >
                <span>Dung lượng</span>
                <ChevronDownIcon />
              </button>
              {showCapacityDropdown && (
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">
                    Dưới 20 kWh
                  </a>
                  <a href="#" className="dropdown-item">
                    20 - 40 kWh
                  </a>
                  <a href="#" className="dropdown-item">
                    40 - 60 kWh
                  </a>
                  <a href="#" className="dropdown-item">
                    60 - 80 kWh
                  </a>
                  <a href="#" className="dropdown-item">
                    80 - 100 kWh
                  </a>
                  <a href="#" className="dropdown-item">
                    Trên 100 kWh
                  </a>
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button
                className="filter-btn"
                onClick={() => setShowBrandDropdown(!showBrandDropdown)}
              >
                <span>Thương hiệu</span>
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
                onClick={() =>
                  setShowBatteryTypeDropdown(!showBatteryTypeDropdown)
                }
              >
                <span>Loại pin</span>
                <ChevronDownIcon />
              </button>
              {showBatteryTypeDropdown && (
                <div className="dropdown-menu">
                  {batteryTypes.map((type, index) => (
                    <a key={index} href="#" className="dropdown-item">
                      {type}
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
                  <a href="#" className="dropdown-item">
                    Mới
                  </a>
                  <a href="#" className="dropdown-item">
                    Đã sử dụng
                  </a>
                  <a href="#" className="dropdown-item">
                    Va chạm nhẹ
                  </a>
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button
                className="filter-btn more"
                onClick={() =>
                  setShowMoreFiltersDropdown(!showMoreFiltersDropdown)
                }
              >
                <svg
                  width="4"
                  height="16"
                  viewBox="0 0 4 16"
                  fill="currentColor"
                >
                  <circle cx="2" cy="2" r="2" />
                  <circle cx="2" cy="8" r="2" />
                  <circle cx="2" cy="14" r="2" />
                </svg>
              </button>
              {showMoreFiltersDropdown && (
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">
                    Độ sức khỏe pin (%)
                  </a>
                  <a href="#" className="dropdown-item">
                    Số chu kỳ sạc
                  </a>
                  <a href="#" className="dropdown-item">
                    Bảo hành
                  </a>
                  <a href="#" className="dropdown-item">
                    Điện áp (V)
                  </a>
                  <a href="#" className="dropdown-item">
                    Công suất (kW)
                  </a>
                  <a href="#" className="dropdown-item">
                    Xuất xứ
                  </a>
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
                className={`brand-item ${
                  selectedBrands.includes(brand.name) ? "active" : ""
                }`}
                onClick={() => {
                  if (selectedBrands.includes(brand.name)) {
                    setSelectedBrands(
                      selectedBrands.filter((b) => b !== brand.name)
                    );
                  } else {
                    setSelectedBrands([...selectedBrands, brand.name]);
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
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-title">
                Lọc theo khoảng giá
                <ChevronDownIcon />
              </h3>
              <div className="filter-options">
                {(showAllPrices ? priceRanges : priceRanges.slice(0, 3)).map(
                  (range, index) => (
                    <label key={index} className="filter-option">
                      <input type="checkbox" />
                      <span>{range}</span>
                    </label>
                  )
                )}
                <button
                  className="show-more-btn"
                  onClick={() => setShowAllPrices(!showAllPrices)}
                >
                  {showAllPrices ? "Thu gọn ▲" : "Xem thêm ▼"}
                </button>
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-title">
                Lọc theo loại pin
                <ChevronDownIcon />
              </h3>
              <div className="filter-options">
                {(showAllBatteryTypes
                  ? batteryTypes
                  : batteryTypes.slice(0, 3)
                ).map((type, index) => (
                  <label key={index} className="filter-option">
                    <input type="checkbox" />
                    <span>{type}</span>
                  </label>
                ))}
                <button
                  className="show-more-btn"
                  onClick={() => setShowAllBatteryTypes(!showAllBatteryTypes)}
                >
                  {showAllBatteryTypes ? "Thu gọn ▲" : "Xem thêm ▼"}
                </button>
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-title">
                Mua bán pin xe điện
                <ChevronDownIcon />
              </h3>
              <div className="filter-options">
                {(showAllCities ? cities : cities.slice(0, 3)).map(
                  (city, index) => (
                    <label key={index} className="filter-option">
                      <input type="checkbox" />
                      <span>{city}</span>
                    </label>
                  )
                )}
                <button
                  className="show-more-btn"
                  onClick={() => setShowAllCities(!showAllCities)}
                >
                  {showAllCities ? "Thu gọn ▲" : "Xem thêm ▼"}
                </button>
              </div>
            </div>
          </aside>

          {/* Listings Section */}
          <div className="listings-section">
            {/* Tabs */}
            <div className="tabs-bar">
              <button
                className={`tab ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                Tất cả
              </button>
              <button
                className={`tab ${activeTab === "personal" ? "active" : ""}`}
                onClick={() => setActiveTab("personal")}
              >
                Cá nhân
              </button>
              <button
                className={`tab ${
                  activeTab === "professional" ? "active" : ""
                }`}
                onClick={() => setActiveTab("professional")}
              >
                Bán chuyên
              </button>

              <div className="tabs-right">
                <button className="sort-btn">
                  <span>Tin mới nhất</span>
                  <ChevronDownIcon />
                </button>
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <span>Dạng lưới</span>
                  <GridIcon />
                </button>
              </div>
            </div>

            {/* Battery Listings Grid */}
            <div className="listings-grid">
              {batteryListings.map((battery) => (
                <div key={battery.id} className="battery-card">
                  {battery.vip && <div className="vip-badge">Tin VIP</div>}
                  {battery.featured && (
                    <div className="featured-badge">Tin tiêu biểu</div>
                  )}

                  <div className="battery-image">
                    <img src="/api/placeholder/400/300" alt={battery.title} />
                    <button 
                      className={`favorite-btn ${isSaved(`battery-${battery.id}`) ? 'saved' : ''}`}
                      onClick={(e) => handleToggleSaved(e, battery)}
                      title={isSaved(`battery-${battery.id}`) ? 'Bỏ lưu' : 'Lưu tin'}
                    >
                      <HeartIcon />
                    </button>
                    <div className="image-count">{battery.images} 📷</div>
                  </div>

                  <div className="battery-content">
                    <h3 className="battery-title">{battery.title}</h3>

                    <div className="battery-specs">
                      <span>{battery.capacity}</span>
                      <span>{battery.type}</span>
                      <span>{battery.condition}</span>
                      {battery.health && (
                        <span>Sức khỏe: {battery.health}</span>
                      )}
                    </div>

                    <div className="battery-price">
                      {battery.price}
                      {battery.discount && (
                        <span className="discount">{battery.discount}</span>
                      )}
                    </div>

                    <div className="battery-location">
                      <LocationIcon />
                      <span>{battery.location}</span>
                    </div>

                    <div className="battery-seller">
                      <div className="seller-info">
                        <div className="seller-avatar">🔋</div>
                        <div className="seller-details">
                          <span className="seller-name">
                            {battery.seller}
                            {battery.verified && <VerifiedIcon />}
                          </span>
                          {battery.rating && (
                            <span className="seller-rating">
                              {battery.rating} ⭐ {battery.reviews}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="battery-actions">
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
              <span className="banner-icon">🔋</span>
              <span className="banner-text">
                Bạn tìm pin xe điện trong khoảng giá nào?
              </span>
              <span className="banner-icon">⚡</span>
            </div>

            <div className="price-range-options">
              <button className="price-option">dưới 50 triệu</button>
              <button className="price-option">50 - 100 triệu</button>
              <button className="price-option">100 - 200 triệu</button>
              <button className="price-option">trên 200 triệu</button>
            </div>

            {/* Brand Selection Section */}
            <div className="brand-selection-section">
              <h2 className="section-title">
                Bạn cần tìm thương hiệu pin nào?
              </h2>
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
  );
}
export default SellBatteryPage;
