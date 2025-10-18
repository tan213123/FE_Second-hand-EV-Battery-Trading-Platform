import { useState } from "react";
import { Link } from "react-router-dom";
import { useSaved, useCompare } from "../../../contexts/AppContext";
import "./index.scss";

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
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1.5"
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

function SellBikePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedCarTypes, setSelectedCarTypes] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [showCarTypeDropdown, setShowCarTypeDropdown] = useState(false);
  const [showSeatsDropdown, setShowSeatsDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [revealedPhones, setRevealedPhones] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comparedItems, setComparedItems] = useState(new Set());
  const { toggleSaved, isSaved } = useSaved();
  const { addToCompare } = useCompare();

  const handleToggleSaved = (e, bike) => {
    e.preventDefault();
    e.stopPropagation();
    const savedBike = {
      ...bike,
      id: `bike-${bike.id}`, // Thêm prefix để tránh conflict với trang khác
      category: 'Xe máy điện',
      image: '/api/placeholder/400/300'
    };
    toggleSaved(savedBike);
  };

  const handleAddToCompare = (e, bike) => {
    e.preventDefault();
    e.stopPropagation();
    const compareBike = {
      ...bike,
      id: `bike-${bike.id}`,
      category: 'Xe máy điện',
      image: '/api/placeholder/400/300',
      specs: {
        year: bike.year || '-',
        brand: bike.brand || '-',
        condition: bike.condition || '-',
        color: bike.color || '-',
        origin: bike.origin || '-',
        mileage: bike.mileage || '-',
        battery: '-',
        range: '-'
      }
    };
    addToCompare(compareBike);
    
    // Add visual feedback animation
    setComparedItems(prev => new Set(prev).add(bike.id));
    
    // Remove the animation class after a short delay
    setTimeout(() => {
      setComparedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(bike.id);
        return newSet;
      });
    }, 2000);
  };

  const handleRevealPhone = (e, bikeId) => {
    e.preventDefault();
    e.stopPropagation();
    setRevealedPhones(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bikeId)) {
        newSet.delete(bikeId);
      } else {
        newSet.add(bikeId);
      }
      return newSet;
    });
  };

  const handleProductClick = (bike) => {
    setSelectedProduct(bike);
    setCurrentImageIndex(0);
    setShowProductDetail(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const handleCloseProductDetail = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'unset'; // Restore scrolling
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

  const brands = [
    { name: "Pega", logo: "🏍️", count: 12450 },
    { name: "DKBike", logo: "🏍️", count: 9320 },
    { name: "VinFast", logo: "⚡", count: 8950 },
    { name: "Dibao", logo: "🏍️", count: 6210 },
    { name: "Honda", logo: "🏍️", count: 5840 },
    { name: "Piaggio", logo: "🏍️", count: 3560 },
    { name: "Yadea", logo: "⚡", count: 2980 },
    { name: "Dat Bike", logo: "⚡", count: 1870 },
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
    "Giá dưới 30 triệu",
    "Giá 30 triệu - 50 triệu",
    "Giá 50 triệu - 70 triệu",
    "Giá 70 triệu - 100 triệu",
    "Trên 100 triệu",
  ];

  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

  const conditions = [
    "Mới",
    "Đã sử dụng",
    "Cũ nhưng tốt",
  ];

  const carTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible"];
  const seatNumbers = ["2 chỗ", "4 chỗ", "5 chỗ", "7 chỗ", "9 chỗ"];
  const colors = [
    "Trắng", "Đen", "Xám", "Bạc", "Đỏ", "Xanh dương", 
    "Xanh lá", "Vàng", "Nâu", "Cam", "Tím", "Hồng"
  ];
  const origins = [
    "Việt Nam", "Nhật Bản", "Hàn Quốc", "Đức", "Mỹ", 
    "Thái Lan", "Trung Quốc", "Ấn Độ", "Malaysia"
  ];

  // Hàm lọc xe máy theo filter
  const getFilteredBikes = () => {
    let filteredBikes = [...bikeListings];

    // Lọc theo brands
    if (selectedBrands.length > 0) {
      filteredBikes = filteredBikes.filter(bike => {
        const bikeBrand = bike.title.split(' ')[0].toLowerCase();
        return selectedBrands.some(brand => 
          brand.toLowerCase().includes(bikeBrand) || 
          bikeBrand.includes(brand.toLowerCase()) ||
          bike.title.toLowerCase().includes(brand.toLowerCase())
        );
      });
    }

    // Lọc theo price ranges
    if (selectedPriceRanges.length > 0) {
      filteredBikes = filteredBikes.filter(bike => {
        const priceValue = parseInt(bike.price.replace(/[^\d]/g, ''));
        return selectedPriceRanges.some(range => {
          if (range.includes('dưới 30')) return priceValue < 30000000;
          if (range.includes('30 triệu - 50')) return priceValue >= 30000000 && priceValue <= 50000000;
          if (range.includes('50 triệu - 70')) return priceValue >= 50000000 && priceValue <= 70000000;
          if (range.includes('70 triệu - 100')) return priceValue >= 70000000 && priceValue <= 100000000;
          if (range.includes('Trên 100')) return priceValue > 100000000;
          return false;
        });
      });
    }

    // Lọc theo years
    if (selectedYears.length > 0) {
      filteredBikes = filteredBikes.filter(bike => 
        selectedYears.includes(bike.year)
      );
    }

    // Lọc theo conditions
    if (selectedConditions.length > 0) {
      filteredBikes = filteredBikes.filter(bike => 
        selectedConditions.includes(bike.condition)
      );
    }

    // Lọc theo cities
    if (selectedCities.length > 0) {
      filteredBikes = filteredBikes.filter(bike => 
        selectedCities.includes(bike.location)
      );
    }

    // Lọc theo car types
    if (selectedCarTypes.length > 0) {
      filteredBikes = filteredBikes.filter(bike => 
        selectedCarTypes.some(type => 
          bike.title.toLowerCase().includes(type.toLowerCase()) ||
          (bike.type && bike.type === type)
        )
      );
    }

    // Lọc theo seats
    if (selectedSeats.length > 0) {
      filteredBikes = filteredBikes.filter(bike => 
        selectedSeats.some(seat => 
          bike.title.toLowerCase().includes(seat.toLowerCase()) ||
          (bike.seats && bike.seats === seat)
        )
      );
    }

    // Lọc theo colors
    if (selectedColors.length > 0) {
      filteredBikes = filteredBikes.filter(bike => 
        selectedColors.some(color => 
          bike.title.toLowerCase().includes(color.toLowerCase()) ||
          (bike.color && bike.color === color)
        )
      );
    }

    // Lọc theo origins
    if (selectedOrigins.length > 0) {
      filteredBikes = filteredBikes.filter(bike => 
        selectedOrigins.some(origin => 
          bike.title.toLowerCase().includes(origin.toLowerCase()) ||
          (bike.origin && bike.origin === origin)
        )
      );
    }

    // Lọc theo locations (khu vực)
    if (selectedLocations.length > 0) {
      filteredBikes = filteredBikes.filter(bike => 
        selectedLocations.includes(bike.location)
      );
    }

    return filteredBikes;
  };

  const bikeListings = [
    {
      id: 1,
      title: "Honda SH Mode 2024 - Mới 100% - Giá tốt nhất",
      year: 2024,
      type: "Xăng",
      condition: "Mới",
      price: "58,000,000 đ",
      location: "Tp Hồ Chí Minh",
      seller: "HONDA HEAD MIỀN NAM",
      phone: "0901234567",
      verified: true,
      images: 8,
      featured: true,
      vip: true,
      discount: "5% thỏa thuận",
      mileage: "0 km",
      engine: "125cc",
      fuelType: "Xăng",
      color: "Đen",
      description: "Honda SH Mode 2024 hoàn toàn mới, chưa qua sử dụng. Bảo hành chính hãng 3 năm. Tặng kèm nón bảo hiểm, áo mưa và thảm sàn. Có thể trả góp với lãi suất ưu đãi.",
      specs: {
        "Động cơ": "125cc, xi-lanh đơn",
        "Công suất": "9.3 kW (12.6 PS) @ 6,750 rpm",
        "Mô-men xoắn": "12.2 Nm @ 5,000 rpm",
        "Hộp số": "Vô cấp (CVT)",
        "Dung tích bình xăng": "7.1 lít",
        "Trọng lượng": "116 kg",
        "Phanh trước": "Đĩa đơn 240mm",
        "Phanh sau": "Trống 130mm"
      }
    },
    {
      id: 2,
      title: "VinFast Evo 200 - Xe điện thông minh",
      year: 2024,
      type: "Điện",
      condition: "Mới",
      price: "62,900,000 đ",
      location: "Hà Nội",
      seller: "VinFast Showroom",
      phone: "0987654321",
      verified: true,
      images: 10,
      featured: true,
      vip: false,
      mileage: "0 km",
      engine: "Động cơ điện",
      fuelType: "Điện",
      color: "Trắng",
      description: "VinFast Evo 200 - Xe máy điện thông minh với công nghệ tiên tiến. Kết nối smartphone, GPS tích hợp, chống trộm thông minh. Bảo hành pin 3 năm, xe 2 năm.",
      specs: {
        "Động cơ": "Động cơ điện BLDC",
        "Công suất": "3.2 kW",
        "Mô-men xoắn": "110 Nm",
        "Tốc độ tối đa": "99 km/h",
        "Quãng đường": "200 km/lần sạc",
        "Pin": "Lithium 4.2 kWh",
        "Thời gian sạc": "6-8 tiếng",
        "Trọng lượng": "118 kg"
      }
    },
    {
      id: 3,
      title: "Yamaha Exciter 155 2023 - Xe zin chính chủ",
      year: 2023,
      km: "5000 km",
      type: "Xăng",
      condition: "Đã sử dụng",
      price: "45,000,000 đ",
      location: "Đà Nẵng",
      seller: "Nguyễn Văn A",
      phone: "0912345678",
      verified: false,
      images: 6,
      featured: false,
      vip: true,
    },
    {
      id: 4,
      title: "Honda Vision 2022 - 1 chủ từ đầu, biển Hà Nội",
      year: 2022,
      km: "8000 km",
      type: "Xăng",
      condition: "Đã sử dụng",
      price: "28,500,000 đ",
      location: "Hà Nội",
      seller: "Trần Minh",
      phone: "0934567890",
      verified: true,
      images: 7,
      rating: 4.8,
      reviews: "23 đã bán",
      featured: false,
      vip: false,
    },
    {
      id: 5,
      title: "Yadea Xmen Neo - Pin 60V giá cực tốt",
      year: 2024,
      type: "Điện",
      condition: "Mới",
      price: "18,900,000 đ",
      location: "Huế",
      seller: "Yadea Chính Hãng",
      phone: "0945678901",
      verified: true,
      images: 5,
      featured: true,
      vip: false,
      discount: "Giá tốt",
    },
    {
      id: 6,
      title: "Dat Bike Weaver 200 - Xe điện thông minh 2024",
      year: 2024,
      type: "Điện",
      condition: "Mới",
      price: "85,000,000 đ",
      location: "Tp Hồ Chí Minh",
      seller: "Dat Bike Official",
      phone: "0956789012",
      verified: true,
      images: 12,
      rating: 4.9,
      featured: true,
      vip: true,
      discount: "Trả góp 0%",
    },
  ];

  const cities = [
    "Tp Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Huế",
    "Hải Phòng",
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
    <div className="sell-bike-page">
      {/* Header Section */}
      <div className="page-header">
        <div className="container">
          <div className="header-top">
            <div className="breadcrumb">
              <Link to="/">EcoXe</Link>
              <span>/</span>
              <span>Xe điện</span>
            </div>
            <Link to="/" className="home-btn">
              <HomeIcon />
              <span>Trang chủ</span>
            </Link>
          </div>
          <h1 className="page-title">
            28.456 xe điện cũ mới giá tốt cập nhật {getCurrentDate()}
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
                <span>Xe điện</span>
                <ChevronDownIcon />
              </button>
              {showVehicleDropdown && (
                <div className="dropdown-menu">
                  <Link to="/oto" className="dropdown-item">
                    Xe ô tô
                  </Link>
                  <Link to="/battery" className="dropdown-item">
                    Pin
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
                onClick={() => setShowYearDropdown(!showYearDropdown)}
              >
                <span>Năm sản xuất</span>
                <ChevronDownIcon />
              </button>
              {showYearDropdown && (
                <div className="dropdown-menu">
                  {years.map((year, index) => (
                    <div 
                      key={index} 
                      className={`dropdown-item ${selectedYears.includes(year) ? 'selected' : ''}`}
                      onClick={() => {
                        if (selectedYears.includes(year)) {
                          setSelectedYears(selectedYears.filter(y => y !== year));
                        } else {
                          setSelectedYears([...selectedYears, year]);
                        }
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedYears.includes(year)}
                        readOnly
                      />
                      <span>{year}</span>
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
                <span>Hãng xe</span>
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
                onClick={() => setShowCarTypeDropdown(!showCarTypeDropdown)}
              >
                <span>Kiểu dáng</span>
                <ChevronDownIcon />
              </button>
              {showCarTypeDropdown && (
                <div className="dropdown-menu">
                  {carTypes.map((type) => (
                    <label key={type} className="dropdown-item checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedCarTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCarTypes([...selectedCarTypes, type]);
                          } else {
                            setSelectedCarTypes(
                              selectedCarTypes.filter((t) => t !== type)
                            );
                          }
                        }}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button
                className="filter-btn"
                onClick={() => setShowSeatsDropdown(!showSeatsDropdown)}
              >
                <span>Số chỗ</span>
                <ChevronDownIcon />
              </button>
              {showSeatsDropdown && (
                <div className="dropdown-menu">
                  {seatNumbers.map((seat) => (
                    <label key={seat} className="dropdown-item checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedSeats.includes(seat)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSeats([...selectedSeats, seat]);
                          } else {
                            setSelectedSeats(
                              selectedSeats.filter((s) => s !== seat)
                            );
                          }
                        }}
                      />
                      {seat}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button
                className="filter-btn"
                onClick={() => setShowCityDropdown(!showCityDropdown)}
              >
                <span>Khu vực</span>
                <ChevronDownIcon />
              </button>
              {showCityDropdown && (
                <div className="dropdown-menu">
                  {locations.map((city) => (
                    <label key={city} className="dropdown-item checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedCities.includes(city)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCities([...selectedCities, city]);
                          } else {
                            setSelectedCities(
                              selectedCities.filter((c) => c !== city)
                            );
                          }
                        }}
                      />
                      {city}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-dropdown-wrapper">
              <button
                className="filter-btn"
                onClick={() => setShowColorDropdown(!showColorDropdown)}
              >
                <span>Màu sắc</span>
                <ChevronDownIcon />
              </button>
              {showColorDropdown && (
                <div className="dropdown-menu">
                  {colors.map((color) => (
                    <label key={color} className="dropdown-item checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedColors([...selectedColors, color]);
                          } else {
                            setSelectedColors(
                              selectedColors.filter((c) => c !== color)
                            );
                          }
                        }}
                      />
                      {color}
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
                setSelectedYears([]);
                setSelectedConditions([]);
                setSelectedCities([]);
                setSelectedLocations([]);
                setSelectedCarTypes([]);
                setSelectedSeats([]);
                setSelectedColors([]);
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
                Mua bán xe điện
                <ChevronDownIcon />
              </h3>
              <div className="filter-options">
                {(showAllCities ? cities : cities.slice(0, 3)).map(
                  (city, index) => (
                    <label key={index} className="filter-option">
                      <input 
                        type="checkbox" 
                        checked={selectedCities.includes(city)}
                        onChange={() => {
                          if (selectedCities.includes(city)) {
                            setSelectedCities(selectedCities.filter(c => c !== city));
                          } else {
                            setSelectedCities([...selectedCities, city]);
                          }
                        }}
                      />
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

            {/* Bike Listings Grid */}
            <div className="listings-grid">
              {getFilteredBikes().map((bike) => (
                <div 
                  key={bike.id} 
                  className="bike-card"
                  onClick={() => handleProductClick(bike)}
                  style={{ cursor: 'pointer' }}
                >
                  {bike.vip && <div className="vip-badge">Tin VIP</div>}
                  {bike.featured && (
                    <div className="featured-badge">Tin tiêu biểu</div>
                  )}

                  <div className="bike-image">
                    <img src="/api/placeholder/400/300" alt={bike.title} />
                    <button 
                      className={`favorite-btn ${isSaved(`bike-${bike.id}`) ? 'saved' : ''}`}
                      onClick={(e) => handleToggleSaved(e, bike)}
                      title={isSaved(`bike-${bike.id}`) ? 'Bỏ lưu' : 'Lưu tin'}
                    >
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
                      <button 
                        className="action-btn primary"
                        onClick={(e) => handleRevealPhone(e, bike.id)}
                      >
                        <PhoneIcon />
                        {revealedPhones.has(bike.id) ? bike.phone : "Bấm để hiện số"}
                      </button>
                      <button 
                        className={`action-btn compare-btn ${comparedItems.has(bike.id) ? 'comparing' : ''}`}
                        onClick={(e) => handleAddToCompare(e, bike)}
                      >
                        <CompareIcon />
                        {comparedItems.has(bike.id) ? 'Đã thêm' : 'So sánh'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Range Banner */}
            <div className="price-range-banner">
              <span className="banner-icon">🏍️</span>
              <span className="banner-text">
                Bạn tìm xe điện trong khoảng giá nào?
              </span>
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
                    <span className="label">Năm sản xuất:</span>
                    <span className="value">{selectedProduct.year}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Tình trạng:</span>
                    <span className="value">{selectedProduct.condition}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Loại xe:</span>
                    <span className="value">{selectedProduct.type}</span>
                  </div>
                  {selectedProduct.mileage && (
                    <div className="info-row">
                      <span className="label">Số km đã đi:</span>
                      <span className="value">{selectedProduct.mileage}</span>
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
                    className={`action-btn secondary large save-btn ${isSaved(`bike-${selectedProduct.id}`) ? 'saved' : ''}`}
                    onClick={(e) => handleToggleSaved(e, selectedProduct)}
                  >
                    <HeartIcon />
                    {isSaved(`bike-${selectedProduct.id}`) ? 'Đã lưu' : 'Lưu tin'}
                  </button>
                  <button 
                    className={`action-btn secondary large compare-btn ${comparedItems.has(selectedProduct.id) ? 'comparing' : ''}`}
                    onClick={(e) => handleAddToCompare(e, selectedProduct)}
                  >
                    <CompareIcon />
                    {comparedItems.has(selectedProduct.id) ? 'Đã thêm' : 'So sánh'}
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
export default SellBikePage;
