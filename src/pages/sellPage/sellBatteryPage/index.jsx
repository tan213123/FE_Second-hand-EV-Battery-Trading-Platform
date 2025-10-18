import { useState } from "react";
import { Link } from "react-router-dom";
import { useSaved, useCompare } from "../../../contexts/AppContext";
import "./index.scss";

function SellBatteryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedBatteryTypes, setSelectedBatteryTypes] = useState([]);
  const [selectedCapacities, setSelectedCapacities] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [showAllBatteryTypes, setShowAllBatteryTypes] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [showAllCapacities, setShowAllCapacities] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showCapacityDropdown, setShowCapacityDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showBatteryTypeDropdown, setShowBatteryTypeDropdown] = useState(false);
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [selectedBatteryHealth, setSelectedBatteryHealth] = useState([]);
  const [selectedCycleCount, setSelectedCycleCount] = useState([]);
  const [selectedWarranty, setSelectedWarranty] = useState([]);
  const [selectedVoltage, setSelectedVoltage] = useState([]);
  const [selectedPower, setSelectedPower] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [showHealthDropdown, setShowHealthDropdown] = useState(false);
  const [showCycleDropdown, setShowCycleDropdown] = useState(false);
  const [showWarrantyDropdown, setShowWarrantyDropdown] = useState(false);
  const [showVoltageDropdown, setShowVoltageDropdown] = useState(false);
  const [showPowerDropdown, setShowPowerDropdown] = useState(false);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [revealedPhones, setRevealedPhones] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comparedItems, setComparedItems] = useState(new Set());
  const { toggleSaved, isSaved } = useSaved();
  const { addToCompare } = useCompare();

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

  const handleAddToCompare = (e, battery) => {
    e.preventDefault();
    e.stopPropagation();
    const compareBattery = {
      ...battery,
      id: `battery-${battery.id}`,
      category: 'Pin xe điện',
      image: '/api/placeholder/400/300',
      specs: {
        brand: battery.seller || '-',
        capacity: battery.capacity || '-',
        type: battery.type || '-',
        condition: battery.condition || '-',
        health: battery.health || '-',
        color: '-',
        origin: '-'
      }
    };
    addToCompare(compareBattery);
    
    // Add visual feedback animation
    setComparedItems(prev => new Set(prev).add(battery.id));
    
    // Remove the animation class after a short delay
    setTimeout(() => {
      setComparedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(battery.id);
        return newSet;
      });
    }, 2000);
  };

  const handleRevealPhone = (e, batteryId) => {
    e.preventDefault();
    e.stopPropagation();
    setRevealedPhones(prev => {
      const newSet = new Set(prev);
      if (newSet.has(batteryId)) {
        newSet.delete(batteryId);
      } else {
        newSet.add(batteryId);
      }
      return newSet;
    });
  };

  const handleProductClick = (battery) => {
    setSelectedProduct(battery);
    setCurrentImageIndex(0);
    setShowProductDetail(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseProductDetail = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  const handlePrevImage = () => {
    if (selectedProduct && selectedProduct.images > 1) {
      setCurrentImageIndex(prev => 
        prev === 0 ? selectedProduct.images - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedProduct && selectedProduct.images > 1) {
      setCurrentImageIndex(prev => 
        prev === selectedProduct.images - 1 ? 0 : prev + 1
      );
    }
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

  const CompareIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
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

  const CloseIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  const ChevronLeftIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="9 18 15 12 9 6" />
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
    "Huế",
    "Gần tôi",
  ];

  // Filter data
  const priceRanges = [
    "Giá dưới 50 triệu",
    "Giá 50 triệu - 100 triệu",
    "Giá 100 triệu - 200 triệu",
    "Giá 200 triệu - 300 triệu",
    "Trên 300 triệu",
  ];

  const batteryTypes = [
    "Lithium-ion",
    "LiFePO4",
    "Lead-acid",
    "NiMH",
  ];

  const capacities = [
    "Dưới 20 kWh",
    "20-40 kWh",
    "40-60 kWh",
    "60-80 kWh",
    "Trên 80 kWh",
  ];

  const conditions = [
    "Mới",
    "Đã sử dụng",
    "Cũ nhưng tốt",
  ];

  // Additional filter data for battery-specific features
  const batteryHealthRanges = [
    "90-100%",
    "80-90%",
    "70-80%",
    "60-70%",
    "Dưới 60%",
  ];

  const cycleCountRanges = [
    "Dưới 500 chu kỳ",
    "500-1000 chu kỳ", 
    "1000-2000 chu kỳ",
    "2000-5000 chu kỳ",
    "Trên 5000 chu kỳ",
  ];

  const warrantyPeriods = [
    "Còn bảo hành",
    "1-2 năm",
    "3-5 năm",
    "Trên 5 năm",
    "Hết bảo hành",
  ];

  const voltageRanges = [
    "12V",
    "24V", 
    "48V",
    "400V",
    "800V",
  ];

  const powerRanges = [
    "Dưới 50kW",
    "50-100kW",
    "100-200kW", 
    "200-300kW",
    "Trên 300kW",
  ];

  const origins = [
    "Việt Nam",
    "Trung Quốc", 
    "Hàn Quốc",
    "Nhật Bản",
    "Đức",
    "Mỹ",
  ];

  // Hàm lọc pin theo filter
  const getFilteredBatteries = () => {
    let filteredBatteries = [...batteryListings];

    // Lọc theo brands
    if (selectedBrands.length > 0) {
      filteredBatteries = filteredBatteries.filter(battery => {
        const batteryBrand = battery.title.split(' ')[0].toLowerCase();
        return selectedBrands.some(brand => 
          brand.toLowerCase().includes(batteryBrand) || 
          batteryBrand.includes(brand.toLowerCase()) ||
          battery.title.toLowerCase().includes(brand.toLowerCase())
        );
      });
    }

    // Lọc theo price ranges
    if (selectedPriceRanges.length > 0) {
      filteredBatteries = filteredBatteries.filter(battery => {
        const priceValue = parseInt(battery.price.replace(/[^\d]/g, ''));
        return selectedPriceRanges.some(range => {
          if (range.includes('dưới 50')) return priceValue < 50000000;
          if (range.includes('50 triệu - 100')) return priceValue >= 50000000 && priceValue <= 100000000;
          if (range.includes('100 triệu - 200')) return priceValue >= 100000000 && priceValue <= 200000000;
          if (range.includes('200 triệu - 300')) return priceValue >= 200000000 && priceValue <= 300000000;
          if (range.includes('Trên 300')) return priceValue > 300000000;
          return false;
        });
      });
    }

    // Lọc theo battery types
    if (selectedBatteryTypes.length > 0) {
      filteredBatteries = filteredBatteries.filter(battery => 
        selectedBatteryTypes.includes(battery.type)
      );
    }

    // Lọc theo capacities
    if (selectedCapacities.length > 0) {
      filteredBatteries = filteredBatteries.filter(battery => {
        const capacityValue = parseFloat(battery.capacity.replace(/[^\d.]/g, ''));
        return selectedCapacities.some(cap => {
          if (cap.includes('Dưới 20')) return capacityValue < 20;
          if (cap.includes('20-40')) return capacityValue >= 20 && capacityValue <= 40;
          if (cap.includes('40-60')) return capacityValue >= 40 && capacityValue <= 60;
          if (cap.includes('60-80')) return capacityValue >= 60 && capacityValue <= 80;
          if (cap.includes('Trên 80')) return capacityValue > 80;
          return false;
        });
      });
    }

    // Lọc theo conditions
    if (selectedConditions.length > 0) {
      filteredBatteries = filteredBatteries.filter(battery => 
        selectedConditions.includes(battery.condition)
      );
    }

    // Lọc theo cities
    if (selectedCities.length > 0) {
      filteredBatteries = filteredBatteries.filter(battery => 
        selectedCities.includes(battery.location)
      );
    }

    // Lọc theo battery health
    if (selectedBatteryHealth.length > 0) {
      filteredBatteries = filteredBatteries.filter(battery => 
        selectedBatteryHealth.some(health => 
          battery.title.toLowerCase().includes(health.toLowerCase()) ||
          (battery.health && battery.health.includes(health))
        )
      );
    }

    // Lọc theo cycle count
    if (selectedCycleCount.length > 0) {
      filteredBatteries = filteredBatteries.filter(battery => 
        selectedCycleCount.some(cycle => 
          battery.title.toLowerCase().includes(cycle.toLowerCase()) ||
          (battery.cycleCount && battery.cycleCount.includes(cycle))
        )
      );
    }

    // Lọc theo warranty
    if (selectedWarranty.length > 0) {
      filteredBatteries = filteredBatteries.filter(battery => 
        selectedWarranty.some(warranty => 
          battery.title.toLowerCase().includes(warranty.toLowerCase()) ||
          (battery.warranty && battery.warranty.includes(warranty))
        )
      );
    }

    // Lọc theo voltage
    if (selectedVoltage.length > 0) {
      filteredBatteries = filteredBatteries.filter(battery => 
        selectedVoltage.some(voltage => 
          battery.title.toLowerCase().includes(voltage.toLowerCase()) ||
          (battery.voltage && battery.voltage.includes(voltage))
        )
      );
    }

    // Lọc theo power
    if (selectedPower.length > 0) {
      filteredBatteries = filteredBatteries.filter(battery => 
        selectedPower.some(power => 
          battery.title.toLowerCase().includes(power.toLowerCase()) ||
          (battery.power && battery.power.includes(power))
        )
      );
    }

    // Lọc theo origins
    if (selectedOrigins.length > 0) {
      filteredBatteries = filteredBatteries.filter(battery => 
        selectedOrigins.some(origin => 
          battery.title.toLowerCase().includes(origin.toLowerCase()) ||
          (battery.origin && battery.origin === origin)
        )
      );
    }

    // Lọc theo locations (khu vực)
    if (selectedLocations.length > 0) {
      filteredBatteries = filteredBatteries.filter(battery => 
        selectedLocations.includes(battery.location)
      );
    }

    return filteredBatteries;
  };

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
      phone: "1900636648",
      verified: true,
      images: 8,
      featured: true,
      vip: true,
      discount: "Trả góp 0%",
      voltage: "400V",
      cycleLife: "3000+ chu kỳ",
      warranty: "8 năm",
      description: "Pin VinFast VF8 chính hãng với công nghệ Lithium-ion tiên tiến. Dung lượng lớn 87.7 kWh đảm bảo quãng đường di chuyển xa. Bảo hành chính hãng 8 năm hoặc 160,000km. Hỗ trợ sạc nhanh DC.",
      specs: {
        "Dung lượng": "87.7 kWh",
        "Loại pin": "Lithium-ion NCM",
        "Điện áp": "400V",
        "Chu kỳ sống": "3000+ chu kỳ",
        "Sức khỏe pin": "100%",
        "Thời gian bảo hành": "8 năm hoặc 160,000km",
        "Tốc độ sạc": "DC Fast Charging 150kW",
        "Khối lượng": "~500kg",
        "Chứng nhận": "UN38.3, IEC62133"
      }
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
      phone: "0971111111",
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
      phone: "0972222222",
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
      phone: "0973333333",
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
      phone: "0974444444",
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
      phone: "0975555555",
      verified: true,
      images: 12,
      rating: 4.9,
      featured: true,
      vip: true,
      discount: "Bảo hành 10 năm",
    },
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
                    <div 
                      key={index} 
                      className={`dropdown-item ${selectedPriceRanges.includes(range) ? 'selected' : ''}`}
                      onClick={() => {
                        if (selectedPriceRanges.includes(range)) {
                          setSelectedPriceRanges(selectedPriceRanges.filter(r => r !== range));
                        } else {
                          setSelectedPriceRanges([...selectedPriceRanges, range]);
                        }
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedPriceRanges.includes(range)}
                        readOnly
                      />
                      <span>{range}</span>
                    </div>
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
                  {capacities.map((capacity, index) => (
                    <div 
                      key={index} 
                      className={`dropdown-item ${selectedCapacities.includes(capacity) ? 'selected' : ''}`}
                      onClick={() => {
                        if (selectedCapacities.includes(capacity)) {
                          setSelectedCapacities(selectedCapacities.filter(c => c !== capacity));
                        } else {
                          setSelectedCapacities([...selectedCapacities, capacity]);
                        }
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedCapacities.includes(capacity)}
                        readOnly
                      />
                      <span>{capacity}</span>
                    </div>
                  ))}
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
                    <div 
                      key={index} 
                      className={`dropdown-item ${selectedBrands.includes(brand.name) ? 'selected' : ''}`}
                      onClick={() => {
                        if (selectedBrands.includes(brand.name)) {
                          setSelectedBrands(selectedBrands.filter(b => b !== brand.name));
                        } else {
                          setSelectedBrands([...selectedBrands, brand.name]);
                        }
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedBrands.includes(brand.name)}
                        readOnly
                      />
                      <span>{brand.logo} {brand.name} ({brand.count})</span>
                    </div>
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
                    <div 
                      key={index} 
                      className={`dropdown-item ${selectedBatteryTypes.includes(type) ? 'selected' : ''}`}
                      onClick={() => {
                        if (selectedBatteryTypes.includes(type)) {
                          setSelectedBatteryTypes(selectedBatteryTypes.filter(t => t !== type));
                        } else {
                          setSelectedBatteryTypes([...selectedBatteryTypes, type]);
                        }
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedBatteryTypes.includes(type)}
                        readOnly
                      />
                      <span>{type}</span>
                    </div>
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
                  {conditions.map((condition, index) => (
                    <div 
                      key={index} 
                      className={`dropdown-item ${selectedConditions.includes(condition) ? 'selected' : ''}`}
                      onClick={() => {
                        if (selectedConditions.includes(condition)) {
                          setSelectedConditions(selectedConditions.filter(c => c !== condition));
                        } else {
                          setSelectedConditions([...selectedConditions, condition]);
                        }
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedConditions.includes(condition)}
                        readOnly
                      />
                      <span>{condition}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button
                className="filter-btn"
                onClick={() => setShowHealthDropdown(!showHealthDropdown)}
              >
                <span>Độ sức khỏe pin (%)</span>
                <ChevronDownIcon />
              </button>
              {showHealthDropdown && (
                <div className="dropdown-menu">
                  {batteryHealthRanges.map((health) => (
                    <label key={health} className="dropdown-item checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedBatteryHealth.includes(health)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBatteryHealth([...selectedBatteryHealth, health]);
                          } else {
                            setSelectedBatteryHealth(
                              selectedBatteryHealth.filter((h) => h !== health)
                            );
                          }
                        }}
                      />
                      {health}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button
                className="filter-btn"
                onClick={() => setShowCycleDropdown(!showCycleDropdown)}
              >
                <span>Số chu kỳ sạc</span>
                <ChevronDownIcon />
              </button>
              {showCycleDropdown && (
                <div className="dropdown-menu">
                  {cycleCountRanges.map((cycle) => (
                    <label key={cycle} className="dropdown-item checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedCycleCount.includes(cycle)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCycleCount([...selectedCycleCount, cycle]);
                          } else {
                            setSelectedCycleCount(
                              selectedCycleCount.filter((c) => c !== cycle)
                            );
                          }
                        }}
                      />
                      {cycle}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button
                className="filter-btn"
                onClick={() => setShowWarrantyDropdown(!showWarrantyDropdown)}
              >
                <span>Bảo hành</span>
                <ChevronDownIcon />
              </button>
              {showWarrantyDropdown && (
                <div className="dropdown-menu">
                  {warrantyPeriods.map((warranty) => (
                    <label key={warranty} className="dropdown-item checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedWarranty.includes(warranty)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedWarranty([...selectedWarranty, warranty]);
                          } else {
                            setSelectedWarranty(
                              selectedWarranty.filter((w) => w !== warranty)
                            );
                          }
                        }}
                      />
                      {warranty}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button
                className="filter-btn"
                onClick={() => setShowVoltageDropdown(!showVoltageDropdown)}
              >
                <span>Điện áp (V)</span>
                <ChevronDownIcon />
              </button>
              {showVoltageDropdown && (
                <div className="dropdown-menu">
                  {voltageRanges.map((voltage) => (
                    <label key={voltage} className="dropdown-item checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedVoltage.includes(voltage)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVoltage([...selectedVoltage, voltage]);
                          } else {
                            setSelectedVoltage(
                              selectedVoltage.filter((v) => v !== voltage)
                            );
                          }
                        }}
                      />
                      {voltage}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button
                className="filter-btn"
                onClick={() => setShowPowerDropdown(!showPowerDropdown)}
              >
                <span>Công suất (kW)</span>
                <ChevronDownIcon />
              </button>
              {showPowerDropdown && (
                <div className="dropdown-menu">
                  {powerRanges.map((power) => (
                    <label key={power} className="dropdown-item checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedPower.includes(power)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPower([...selectedPower, power]);
                          } else {
                            setSelectedPower(
                              selectedPower.filter((p) => p !== power)
                            );
                          }
                        }}
                      />
                      {power}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button
                className="filter-btn"
                onClick={() => setShowOriginDropdown(!showOriginDropdown)}
              >
                <span>Xuất xứ</span>
                <ChevronDownIcon />
              </button>
              {showOriginDropdown && (
                <div className="dropdown-menu">
                  {origins.map((origin) => (
                    <label key={origin} className="dropdown-item checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedOrigins.includes(origin)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrigins([...selectedOrigins, origin]);
                          } else {
                            setSelectedOrigins(
                              selectedOrigins.filter((o) => o !== origin)
                            );
                          }
                        }}
                      />
                      {origin}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <button 
              className="clear-filter"
              onClick={() => {
                setSelectedBrands([]);
                setSelectedPriceRanges([]);
                setSelectedBatteryTypes([]);
                setSelectedCapacities([]);
                setSelectedConditions([]);
                setSelectedCities([]);
                setSelectedLocations([]);
                setSelectedBatteryHealth([]);
                setSelectedCycleCount([]);
                setSelectedWarranty([]);
                setSelectedVoltage([]);
                setSelectedPower([]);
                setSelectedOrigins([]);
              }}
            >
              Xoá lọc
            </button>
          </div>

          {/* Location Filter */}
          <div className="location-filter">
            <span className="label">Khu vực:</span>
            {locations.map((location, index) => (
              <button 
                key={index} 
                className={`location-btn ${
                  selectedLocations.includes(location) ? "active" : ""
                }`}
                onClick={() => {
                  if (selectedLocations.includes(location)) {
                    setSelectedLocations(
                      selectedLocations.filter((l) => l !== location)
                    );
                  } else {
                    setSelectedLocations([...selectedLocations, location]);
                  }
                }}
              >
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
                {conditions.map((condition, index) => (
                  <label key={index} className="filter-option">
                    <input 
                      type="checkbox" 
                      checked={selectedConditions.includes(condition)}
                      onChange={() => {
                        if (selectedConditions.includes(condition)) {
                          setSelectedConditions(selectedConditions.filter(c => c !== condition));
                        } else {
                          setSelectedConditions([...selectedConditions, condition]);
                        }
                      }}
                    />
                    <span>{condition}</span>
                  </label>
                ))}
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
                      <input 
                        type="checkbox" 
                        checked={selectedPriceRanges.includes(range)}
                        onChange={() => {
                          if (selectedPriceRanges.includes(range)) {
                            setSelectedPriceRanges(selectedPriceRanges.filter(r => r !== range));
                          } else {
                            setSelectedPriceRanges([...selectedPriceRanges, range]);
                          }
                        }}
                      />
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
              {getFilteredBatteries().map((battery) => (
                <div 
                  key={battery.id} 
                  className="battery-card"
                  onClick={() => handleProductClick(battery)}
                  style={{ cursor: 'pointer' }}
                >
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
                      <button 
                        className="action-btn primary"
                        onClick={(e) => handleRevealPhone(e, battery.id)}
                      >
                        <PhoneIcon />
                        {revealedPhones.has(battery.id) ? battery.phone : "Bấm để hiện số"}
                      </button>
                      <button 
                        className={`action-btn compare-btn ${comparedItems.has(battery.id) ? 'comparing' : ''}`}
                        onClick={(e) => handleAddToCompare(e, battery)}
                      >
                        <CompareIcon />
                        So sánh
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

      {/* Product Detail Modal */}
      {showProductDetail && selectedProduct && (
        <div className="product-detail-overlay" onClick={handleCloseProductDetail}>
          <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseProductDetail}>
              <CloseIcon />
            </button>

            <div className="product-detail-content">
              {/* Image Gallery */}
              <div className="product-gallery">
                <div className="main-image">
                  <img 
                    src={`/api/placeholder/600/400?text=Image ${currentImageIndex + 1}`} 
                    alt={selectedProduct.title} 
                  />
                  {selectedProduct.images > 1 && (
                    <>
                      <button className="gallery-nav prev" onClick={handlePrevImage}>
                        <ChevronLeftIcon />
                      </button>
                      <button className="gallery-nav next" onClick={handleNextImage}>
                        <ChevronRightIcon />
                      </button>
                    </>
                  )}
                </div>
                
                {selectedProduct.images > 1 && (
                  <div className="image-thumbnails">
                    {Array.from({ length: selectedProduct.images }, (_, index) => (
                      <div
                        key={index}
                        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img 
                          src={`/api/placeholder/100/80?text=${index + 1}`} 
                          alt={`${selectedProduct.title} ${index + 1}`} 
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="image-counter">
                  {currentImageIndex + 1} / {selectedProduct.images}
                </div>
              </div>

              {/* Product Information */}
              <div className="product-info">
                <div className="product-header">
                  <h2 className="product-title">{selectedProduct.title}</h2>
                  <div className="product-price">{selectedProduct.price}</div>
                  {selectedProduct.discount && (
                    <div className="product-discount">{selectedProduct.discount}</div>
                  )}
                </div>

                <div className="product-basic-info">
                  <div className="info-row">
                    <span className="label">Dung lượng:</span>
                    <span className="value">{selectedProduct.capacity}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Loại pin:</span>
                    <span className="value">{selectedProduct.type}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Tình trạng:</span>
                    <span className="value">{selectedProduct.condition}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Sức khỏe pin:</span>
                    <span className="value">{selectedProduct.health}</span>
                  </div>
                  {selectedProduct.warranty && (
                    <div className="info-row">
                      <span className="label">Bảo hành:</span>
                      <span className="value">{selectedProduct.warranty}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="label">Khu vực:</span>
                    <span className="value">
                      <LocationIcon />
                      {selectedProduct.location}
                    </span>
                  </div>
                </div>

                {selectedProduct.description && (
                  <div className="product-description">
                    <h3>Mô tả</h3>
                    <p>{selectedProduct.description}</p>
                  </div>
                )}

                {selectedProduct.specs && (
                  <div className="product-specs">
                    <h3>Thông số kỹ thuật</h3>
                    <div className="specs-grid">
                      {Object.entries(selectedProduct.specs).map(([key, value]) => (
                        <div key={key} className="spec-row">
                          <span className="spec-label">{key}:</span>
                          <span className="spec-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="seller-section">
                  <h3>Thông tin người bán</h3>
                  <div className="seller-card">
                    <div className="seller-avatar">👤</div>
                    <div className="seller-details">
                      <div className="seller-name">
                        {selectedProduct.seller}
                        {selectedProduct.verified && <VerifiedIcon />}
                      </div>
                      {selectedProduct.rating && (
                        <div className="seller-rating">
                          {selectedProduct.rating} ⭐ {selectedProduct.reviews}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="product-actions">
                  <button 
                    className="action-btn primary large"
                    onClick={(e) => handleRevealPhone(e, selectedProduct.id)}
                  >
                    <PhoneIcon />
                    {revealedPhones.has(selectedProduct.id) ? selectedProduct.phone : "Bấm để hiện số"}
                  </button>
                  <button 
                    className={`action-btn secondary large save-btn ${isSaved(`battery-${selectedProduct.id}`) ? 'saved' : ''}`}
                    onClick={(e) => handleToggleSaved(e, selectedProduct)}
                  >
                    <HeartIcon />
                    {isSaved(`battery-${selectedProduct.id}`) ? 'Đã lưu' : 'Lưu tin'}
                  </button>
                  <button 
                    className={`action-btn secondary large compare-btn ${comparedItems.has(selectedProduct.id) ? 'comparing' : ''}`}
                    onClick={(e) => handleAddToCompare(e, selectedProduct)}
                  >
                    <CompareIcon />
                    So sánh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default SellBatteryPage;
