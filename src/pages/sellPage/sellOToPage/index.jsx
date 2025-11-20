import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSaved, useCompare } from "../../../contexts/AppContext";
import api from "../../../config/api";
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

function SellOtoPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedCarTypes, setSelectedCarTypes] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [showAllCarTypes, setShowAllCarTypes] = useState(false);
  const [showAllSeats, setShowAllSeats] = useState(false);
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
  const [carsFromStorage, setCarsFromStorage] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleSaved, isSaved } = useSaved();
  const { addToCompare } = useCompare();

  // Load cars from localStorage
  useEffect(() => {
    const loadCarsFromApi = async () => {
      setLoading(true);
      try {
        const response = await api.get("/article");
        let data = response.data;
        if (data && !Array.isArray(data)) {
          data = [data];
        }
        if (!Array.isArray(data)) {
          data = [];
        }

        const carPosts = data.filter(
          (post) =>
            (post.articleType === "CAR_ARTICLE" ||
              post.articleType === "car") &&
            post.status === "APPROVED"
        );

        if (carPosts.length > 0) {
          const formattedCars = carPosts.map((post) => {
            const rawMiles =
              post.mileage !== undefined && post.mileage !== null
                ? post.mileage
                : post.milesTraveled !== undefined &&
                  post.milesTraveled !== null
                ? post.milesTraveled
                : 0;

            const locationText =
              post.location && typeof post.location === "object"
                ? post.location.district && post.location.city
                  ? `${post.location.district}, ${post.location.city}`
                  : post.location.city || post.location.district || ""
                : post.location || post.region || "";

            return {
              id: post.articleId || post.id,
              title: post.title || post.content || "",
              year: post.year,
              // article type / body type from BE ("MPV", "SUV", ...)
              type: post.type || "Điện",
              condition: post.condition,
              price:
                new Intl.NumberFormat("vi-VN").format(post.price || 0) + " đ",
              location: locationText,
              seller: post.contactName || post.memberName || "",
              phone: post.contactPhone || "",
              verified: post.status === "APPROVED",
              images: Array.isArray(post.images)
                ? post.images.length
                : Array.isArray(post.imageUrls)
                ? post.imageUrls.length
                : 0,
              featured: false,
              vip: false,
              discount: post.negotiable ? "Có thể thương lượng" : "",
              mileage: `${rawMiles} km`,
              engine: "Điện",
              transmission: "Tự động",
              color: post.color,
              brand: post.brand,
              description: post.content || "",
              batteryInfo: post.batteryInfo ? `${post.batteryInfo}%` : "N/A",
              origin: post.origin || "Chưa cập nhật",
              bodyType: post.bodyType || post.model || "",
              seats: post.seats || post.numberOfSeat,
              registrationDeadline: post.registrationDeadline,
              warrantyMonths:
                post.warrantyPeriodMonths ?? post.warrantyMonths ?? null,
              originalPost: post,
              image:
                post.mainImageUrl ||
                (Array.isArray(post.images) && post.images.length > 0
                  ? post.images[0].url || post.images[0]
                  : Array.isArray(post.imageUrls) && post.imageUrls.length > 0
                  ? post.imageUrls[0]
                  : "/api/placeholder/400/300"),
              specs: {
                year: post.year || "N/A",
                brand: post.brand || "N/A",
                bodyType: post.bodyType || post.model || "Chưa cập nhật",
                seats:
                  post.numberOfSeat !== undefined && post.numberOfSeat !== null
                    ? post.numberOfSeat
                    : post.seats ?? "Chưa cập nhật",
                origin: post.origin || "Chưa cập nhật",
                mileage: rawMiles ? `${rawMiles} km` : "0 km",
                licensesPlate: post.licensesPlate || "Chưa cập nhật",
                registrationDeadline:
                  post.registrationDeadline || "Chưa cập nhật",
                warrantyPeriodMonths:
                  post.warrantyPeriodMonths ??
                  post.warrantyMonths ??
                  "Chưa cập nhật",
              },
            };
          });
          setCarsFromStorage(formattedCars);
        } else {
          setCarsFromStorage([]);
        }
      } catch (error) {
        console.error("Error loading cars from API:", error);
        setCarsFromStorage([]);
      } finally {
        setLoading(false);
      }
    };

    loadCarsFromApi();

    const handleStorageChange = () => loadCarsFromApi();
    window.addEventListener("postUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("postUpdated", handleStorageChange);
    };
  }, []);

  const handleToggleSaved = (e, car) => {
    e.preventDefault();
    e.stopPropagation();
    const savedCar = {
      ...car,
      id: `oto-${car.id}`, // Thêm prefix để tránh conflict với trang khác
      category: "Ô tô điện",
      image: car.image || "/api/placeholder/400/300",
    };
    toggleSaved(savedCar);
  };

  const handleAddToCompare = (e, car) => {
    e.preventDefault();
    e.stopPropagation();
    const compareCar = {
      ...car,
      id: `oto-${car.id}`,
      category: "Ô tô điện",
      image: car.image || "/api/placeholder/400/300",
      specs: {
        year: car.year || "-",
        brand: car.brand || "-",
        bodyType: car.bodyType || "-",
        seats: car.seats || "-",
        origin: car.origin || "-",
        mileage: car.mileage || "-",
        licensesPlate: car.originalPost?.licensesPlate || "-",
        registrationDeadline: car.originalPost?.registrationDeadline || "-",
        warrantyPeriodMonths:
          car.originalPost?.warrantyPeriodMonths ?? car.warrantyMonths ?? "-",
      },
    };
    addToCompare(compareCar);

    // Add visual feedback animation
    setComparedItems((prev) => new Set(prev).add(car.id));

    // Remove the animation class after a short delay
    setTimeout(() => {
      setComparedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(car.id);
        return newSet;
      });
    }, 2000);
  };

  // Helper function to extract city from location
  const getCityFromLocation = (location) => {
    if (!location) return "";
    const parts = location.split(",");
    return parts.length > 1 ? parts[parts.length - 1].trim() : location.trim();
  };

  // Map city codes to display names to match filter
  const mapCityCodeToName = (cityCode) => {
    const cityMapping = {
      hcm: "Tp Hồ Chí Minh",
      hanoi: "Hà Nội",
      danang: "Đà Nẵng",
      cantho: "Cần Thơ",
      haiphong: "Hải Phòng",
      binhduong: "Bình Dương",
      dongnai: "Đồng Nai",
      vungtau: "Vũng Tàu",
    };
    return cityMapping[cityCode] || cityCode;
  };

  const handleRevealPhone = (e, carId) => {
    e.preventDefault();
    e.stopPropagation();
    setRevealedPhones((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(carId)) {
        newSet.delete(carId);
      } else {
        newSet.add(carId);
      }
      return newSet;
    });
  };

  const handleProductClick = (car) => {
    setSelectedProduct(car);
    setCurrentImageIndex(0);
    setShowProductDetail(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseProductDetail = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
    document.body.style.overflow = "unset";
  };

  const handlePrevImage = () => {
    if (selectedProduct && selectedProduct.images > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProduct.images - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedProduct && selectedProduct.images > 1) {
      setCurrentImageIndex((prev) =>
        prev === selectedProduct.images - 1 ? 0 : prev + 1
      );
    }
  };

  // Dữ liệu filter
  const brands = [
    { name: "MG", logo: "🚙", count: 3210 },
    { name: "VinFast", logo: "⚡", count: 8950 },
    { name: "Wuling", logo: "🚗", count: 2150 },
    { name: "Hyundai", logo: "🚗", count: 4320 },
    { name: "Mercedes Benz", logo: "⭐", count: 1560 },
    { name: "Porsche", logo: "🚗", count: 980 },
    { name: "Kia", logo: "🚗", count: 2340 },
    { name: "BYD", logo: "🚗", count: 1870 },
  ];

  const locations = ["Tp Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Huế", "Gần tôi"];

  const priceRanges = [
    "Giá dưới 200 triệu",
    "Giá 200 triệu - 300 triệu",
    "Giá 300 triệu - 400 triệu",
    "Giá 400 triệu - 500 triệu",
    "Giá 500 triệu - 600 triệu",
    "Giá 600 triệu - 700 triệu",
    "Giá 700 triệu - 800 triệu",
    "Trên 800 triệu",
  ];

  const carTypes = [
    "Sedan",
    "SUV/Cross over",
    "Hatchback",
    "Pick-up (bán tải)",
    "Minivan",
    "Coupe",
    "Convertible",
    "Van",
  ];

  const seats = ["2 chỗ", "4 chỗ", "5 chỗ", "7 chỗ", "8 chỗ", "9 chỗ trở lên"];

  const cities = [
    "Tp Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Cần Thơ",
    "Hải Phòng",
    "Bình Dương",
    "Đồng Nai",
    "Vũng Tàu",
    "Huế",
  ];

  const colors = [
    "Trắng",
    "Đen",
    "Xám",
    "Bạc",
    "Đỏ",
    "Xanh dương",
    "Xanh lá",
    "Vàng",
    "Nâu",
    "Cam",
    "Tím",
    "Hồng",
  ];

  const origins = [
    "Việt Nam",
    "Nhật Bản",
    "Hàn Quốc",
    "Đức",
    "Mỹ",
    "Thái Lan",
    "Trung Quốc",
    "Ấn Độ",
    "Malaysia",
  ];

  const conditions = ["Mới", "Đã sử dụng", "Cũ nhưng tốt"];

  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];

  const seatNumbers = ["2 chỗ", "4 chỗ", "5 chỗ", "7 chỗ", "9 chỗ"];

  // Thêm một số dữ liệu test để kiểm tra hình ảnh
  const testCars = [
    {
      id: 1,
      title: "BYD M6 2025 - DEAL RỰC RỠ - QUÀ BẤT NGỜ",
      year: 2025,
      type: "Điện",
      transmission: "Tự động",
      condition: "Mới",
      price: "756,000,000 đ",
      location: "Bình Dương",
      seller: "BYD Miền Nam",
      phone: "0901111111",
      verified: true,
      images: 5,
      featured: true,
      vip: true,
      image:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "VinFast VF5 2025 - Mẫu nâng cao giá cơ bản",
      year: 2025,
      type: "Điện",
      transmission: "Tự động",
      condition: "Mới",
      price: "507,000,000 đ",
      location: "Tp Hồ Chí Minh",
      seller: "VinFast Thủ Đức",
      phone: "0902222222",
      verified: true,
      images: 7,
      featured: true,
      vip: false,
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
    },
  ];

  // Chỉ sử dụng dữ liệu thật từ localStorage, fallback về test data nếu trống
  const allCarListings = loading
    ? []
    : carsFromStorage.length > 0
    ? carsFromStorage
    : testCars;

  // Hàm lọc sản phẩm theo filter
  const getFilteredCars = () => {
    let filteredCars = [...allCarListings];

    // Lọc theo brands
    if (selectedBrands.length > 0) {
      filteredCars = filteredCars.filter((car) => {
        // Extract brand from title (first word usually)
        const carBrand = car.title.split(" ")[0].toLowerCase();
        return selectedBrands.some(
          (brand) =>
            brand.toLowerCase().includes(carBrand) ||
            carBrand.includes(brand.toLowerCase()) ||
            car.title.toLowerCase().includes(brand.toLowerCase())
        );
      });
    }

    // Lọc theo price ranges
    if (selectedPriceRanges.length > 0) {
      filteredCars = filteredCars.filter((car) => {
        const priceValue = parseInt(car.price.replace(/[^\d]/g, ""));
        return selectedPriceRanges.some((range) => {
          if (range.includes("dưới 200")) return priceValue < 200000000;
          if (range.includes("200 triệu - 300"))
            return priceValue >= 200000000 && priceValue <= 300000000;
          if (range.includes("300 triệu - 400"))
            return priceValue >= 300000000 && priceValue <= 400000000;
          if (range.includes("400 triệu - 500"))
            return priceValue >= 400000000 && priceValue <= 500000000;
          if (range.includes("500 triệu - 600"))
            return priceValue >= 500000000 && priceValue <= 600000000;
          if (range.includes("600 triệu - 700"))
            return priceValue >= 600000000 && priceValue <= 700000000;
          if (range.includes("700 triệu - 800"))
            return priceValue >= 700000000 && priceValue <= 800000000;
          if (range.includes("Trên 800")) return priceValue > 800000000;
          return false;
        });
      });
    }

    // Lọc theo car types
    if (selectedCarTypes.length > 0) {
      filteredCars = filteredCars.filter((car) =>
        selectedCarTypes.includes(car.type)
      );
    }

    // Lọc theo cities
    if (selectedCities.length > 0) {
      filteredCars = filteredCars.filter((car) =>
        selectedCities.some((city) => car.location.includes(city))
      );
    }

    // Lọc theo conditions
    if (selectedConditions.length > 0) {
      filteredCars = filteredCars.filter((car) =>
        selectedConditions.includes(car.condition)
      );
    }

    // Lọc theo years
    if (selectedYears.length > 0) {
      filteredCars = filteredCars.filter((car) =>
        selectedYears.includes(car.year.toString())
      );
    }

    // Lọc theo colors (giả sử có field color trong data)
    if (selectedColors.length > 0) {
      filteredCars = filteredCars.filter((car) =>
        selectedColors.some(
          (color) =>
            car.title.toLowerCase().includes(color.toLowerCase()) ||
            (car.color && car.color === color)
        )
      );
    }

    // Lọc theo origins (giả sử có field origin trong data)
    if (selectedOrigins.length > 0) {
      filteredCars = filteredCars.filter((car) =>
        selectedOrigins.some(
          (origin) =>
            car.title.toLowerCase().includes(origin.toLowerCase()) ||
            (car.origin && car.origin === origin)
        )
      );
    }

    // Lọc theo locations (khu vực)
    if (selectedLocations.length > 0) {
      filteredCars = filteredCars.filter((car) =>
        selectedLocations.some((location) => car.location.includes(location))
      );
    }

    return filteredCars;
  };

  // Lấy ngày hiện tại theo định dạng DD/MM/YYYY
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="sell-oto-page">
      {/* Header Section */}
      <div className="page-header">
        <div className="container">
          <div className="header-top">
            <div className="breadcrumb">
              <Link to="/">EcoXe</Link>
              <span>/</span>
              <span>Ô tô</span>
            </div>
            <Link to="/" className="home-btn">
              <HomeIcon />
              <span>Trang chủ</span>
            </Link>
          </div>
          <h1 className="page-title">
            43.121 xe ô tô cũ mới giá tốt cập nhật {getCurrentDate()}
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
                <span>Ô tô</span>
                <ChevronDownIcon />
              </button>
              {showVehicleDropdown && (
                <div className="dropdown-menu">
                  <Link to="/bike" className="dropdown-item">
                    Xe điện
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
                      className={`dropdown-item ${
                        selectedPriceRanges.includes(range) ? "selected" : ""
                      }`}
                      onClick={() => {
                        if (selectedPriceRanges.includes(range)) {
                          setSelectedPriceRanges(
                            selectedPriceRanges.filter((r) => r !== range)
                          );
                        } else {
                          setSelectedPriceRanges([
                            ...selectedPriceRanges,
                            range,
                          ]);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPriceRanges.includes(range)}
                        readOnly
                      />
                      {range}
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
                  {cities.map((city) => (
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
                onClick={() => setShowConditionDropdown(!showConditionDropdown)}
              >
                <span>Tình trạng</span>
                <ChevronDownIcon />
              </button>
              {showConditionDropdown && (
                <div className="dropdown-menu">
                  {conditions.map((condition) => (
                    <label
                      key={condition}
                      className="dropdown-item checkbox-item"
                    >
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(condition)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedConditions([
                              ...selectedConditions,
                              condition,
                            ]);
                          } else {
                            setSelectedConditions(
                              selectedConditions.filter((c) => c !== condition)
                            );
                          }
                        }}
                      />
                      {condition}
                    </label>
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
                  {years.map((year) => (
                    <label key={year} className="dropdown-item checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedYears.includes(year)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedYears([...selectedYears, year]);
                          } else {
                            setSelectedYears(
                              selectedYears.filter((y) => y !== year)
                            );
                          }
                        }}
                      />
                      {year}
                    </label>
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
                      className={`dropdown-item ${
                        selectedBrands.includes(brand.name) ? "selected" : ""
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
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.name)}
                        readOnly
                      />
                      {brand.logo} {brand.name} ({brand.count})
                    </div>
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
                setSelectedCarTypes([]);
                setSelectedSeats([]);
                setSelectedCities([]);
                setSelectedLocations([]);
                setSelectedConditions([]);
                setSelectedYears([]);
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
                {(showAllPrices ? priceRanges : priceRanges.slice(0, 3)).map(
                  (range, index) => (
                    <label key={index} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedPriceRanges.includes(range)}
                        onChange={() => {
                          if (selectedPriceRanges.includes(range)) {
                            setSelectedPriceRanges(
                              selectedPriceRanges.filter((r) => r !== range)
                            );
                          } else {
                            setSelectedPriceRanges([
                              ...selectedPriceRanges,
                              range,
                            ]);
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
                Lọc theo kiểu dáng
                <ChevronDownIcon />
              </h3>
              <div className="filter-options">
                {(showAllCarTypes ? carTypes : carTypes.slice(0, 3)).map(
                  (type, index) => (
                    <label key={index} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedCarTypes.includes(type)}
                        onChange={() => {
                          if (selectedCarTypes.includes(type)) {
                            setSelectedCarTypes(
                              selectedCarTypes.filter((t) => t !== type)
                            );
                          } else {
                            setSelectedCarTypes([...selectedCarTypes, type]);
                          }
                        }}
                      />
                      <span>{type}</span>
                    </label>
                  )
                )}
                <button
                  className="show-more-btn"
                  onClick={() => setShowAllCarTypes(!showAllCarTypes)}
                >
                  {showAllCarTypes ? "Thu gọn ▲" : "Xem thêm ▼"}
                </button>
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-title">
                Lọc theo số chỗ
                <ChevronDownIcon />
              </h3>
              <div className="filter-options">
                {(showAllSeats ? seats : seats.slice(0, 3)).map(
                  (seat, index) => (
                    <label key={index} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedSeats.includes(seat)}
                        onChange={() => {
                          if (selectedSeats.includes(seat)) {
                            setSelectedSeats(
                              selectedSeats.filter((s) => s !== seat)
                            );
                          } else {
                            setSelectedSeats([...selectedSeats, seat]);
                          }
                        }}
                      />
                      <span>{seat}</span>
                    </label>
                  )
                )}
                <button
                  className="show-more-btn"
                  onClick={() => setShowAllSeats(!showAllSeats)}
                >
                  {showAllSeats ? "Thu gọn ▲" : "Xem thêm ▼"}
                </button>
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-title">
                Mua bán ô tô
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
                            setSelectedCities(
                              selectedCities.filter((c) => c !== city)
                            );
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

            {/* Car Listings Grid */}
            <div className="listings-grid">
              {getFilteredCars().map((car) => (
                <div
                  key={car.id}
                  className="car-card"
                  onClick={() => handleProductClick(car)}
                  style={{ cursor: "pointer" }}
                >
                  {car.vip && <div className="vip-badge">Tin VIP</div>}
                  {car.featured && (
                    <div className="featured-badge">Tin tiêu biểu</div>
                  )}

                  <div className="car-image">
                    <img
                      src={car.image || "/api/placeholder/400/300"}
                      alt={car.title}
                      onError={(e) => {
                        e.target.src = "/api/placeholder/400/300";
                      }}
                    />
                    <button
                      className={`favorite-btn ${
                        isSaved(`oto-${car.id}`) ? "saved" : ""
                      }`}
                      onClick={(e) => handleToggleSaved(e, car)}
                      title={isSaved(car.id) ? "Bỏ lưu" : "Lưu tin"}
                    >
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
                      <span>{getCityFromLocation(car.location)}</span>
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
                      <button
                        className="action-btn primary"
                        onClick={(e) => handleRevealPhone(e, car.id)}
                      >
                        <PhoneIcon />
                        {revealedPhones.has(car.id)
                          ? car.phone
                          : "Bấm để hiện số"}
                      </button>
                      <button
                        className={`action-btn compare-btn ${
                          comparedItems.has(car.id) ? "comparing" : ""
                        }`}
                        onClick={(e) => handleAddToCompare(e, car)}
                      >
                        <CompareIcon />
                        So sánh
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {showProductDetail && selectedProduct && (
        <div
          className="product-detail-overlay"
          onClick={handleCloseProductDetail}
        >
          <div
            className="product-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={handleCloseProductDetail}>
              <CloseIcon />
            </button>

            <div className="product-detail-content">
              {/* Image Gallery */}
              <div className="product-gallery">
                <div className="main-image">
                  <img
                    src={
                      Array.isArray(selectedProduct.images)
                        ? selectedProduct.images[currentImageIndex]
                        : selectedProduct.image ||
                          `/api/placeholder/600/400?text=Image ${
                            currentImageIndex + 1
                          }`
                    }
                    alt={selectedProduct.title}
                    onError={(e) => {
                      e.target.src = `/api/placeholder/600/400?text=Image ${
                        currentImageIndex + 1
                      }`;
                    }}
                  />
                  {Array.isArray(selectedProduct.images) &&
                    selectedProduct.images.length > 1 && (
                      <>
                        <button
                          className="gallery-nav prev"
                          onClick={handlePrevImage}
                        >
                          <ChevronLeftIcon />
                        </button>
                        <button
                          className="gallery-nav next"
                          onClick={handleNextImage}
                        >
                          <ChevronRightIcon />
                        </button>
                      </>
                    )}
                </div>

                {Array.isArray(selectedProduct.images) &&
                  selectedProduct.images.length > 1 && (
                    <div className="image-thumbnails">
                      {selectedProduct.images.map((url, index) => (
                        <div
                          key={index}
                          className={`thumbnail ${
                            index === currentImageIndex ? "active" : ""
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img
                            src={url}
                            alt={`${selectedProduct.title} ${index + 1}`}
                            style={{
                              width: 60,
                              height: 45,
                              objectFit: "cover",
                              border:
                                index === currentImageIndex
                                  ? "2px solid orange"
                                  : "1px solid #ccc",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                <div className="image-counter">
                  {Array.isArray(selectedProduct.images)
                    ? currentImageIndex + 1
                    : 1}{" "}
                  /{" "}
                  {Array.isArray(selectedProduct.images)
                    ? selectedProduct.images.length
                    : 1}
                </div>
              </div>

              {/* Product Information */}
              <div className="product-info">
                <div className="product-header">
                  <h2 className="product-title">{selectedProduct.title}</h2>
                  <div className="product-price">{selectedProduct.price}</div>
                  {selectedProduct.discount && (
                    <div className="product-discount">
                      {selectedProduct.discount}
                    </div>
                  )}
                </div>

                <div className="product-basic-info">
                  <div className="info-row">
                    <span className="label">Năm sản xuất:</span>
                    <span className="value">{selectedProduct.year}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Loại xe:</span>
                    <span className="value">{selectedProduct.type}</span>
                  </div>
                  {selectedProduct.brand && (
                    <div className="info-row">
                      <span className="label">Hãng xe:</span>
                      <span className="value">{selectedProduct.brand}</span>
                    </div>
                  )}
                  {selectedProduct.bodyType && (
                    <div className="info-row">
                      <span className="label">Kiểu dáng:</span>
                      <span className="value">{selectedProduct.bodyType}</span>
                    </div>
                  )}
                  {selectedProduct.color && (
                    <div className="info-row">
                      <span className="label">Màu sắc:</span>
                      <span className="value">{selectedProduct.color}</span>
                    </div>
                  )}
                  {selectedProduct.seats && (
                    <div className="info-row">
                      <span className="label">Số lượng chỗ ngồi:</span>
                      <span className="value">{selectedProduct.seats}</span>
                    </div>
                  )}
                  {selectedProduct.registrationDeadline && (
                    <div className="info-row">
                      <span className="label">Hạn đăng kiểm:</span>
                      <span className="value">
                        {selectedProduct.registrationDeadline}
                      </span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="label">Hộp số:</span>
                    <span className="value">
                      {selectedProduct.transmission}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Xuất xứ:</span>
                    <span className="value">
                      {selectedProduct.origin || "Chưa cập nhật"}
                    </span>
                  </div>
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
                      {Object.entries(selectedProduct.specs).map(
                        ([key, value]) => (
                          <div key={key} className="spec-row">
                            <span className="spec-label">{key}:</span>
                            <span className="spec-value">{value}</span>
                          </div>
                        )
                      )}
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
                    </div>
                  </div>
                </div>

                <div className="product-actions">
                  <button
                    className="action-btn primary large"
                    onClick={(e) => handleRevealPhone(e, selectedProduct.id)}
                  >
                    <PhoneIcon />
                    {revealedPhones.has(selectedProduct.id)
                      ? selectedProduct.phone
                      : "Bấm để hiện số"}
                  </button>
                  <button
                    className={`action-btn secondary large save-btn ${
                      isSaved(`oto-${selectedProduct.id}`) ? "saved" : ""
                    }`}
                    onClick={(e) => handleToggleSaved(e, selectedProduct)}
                  >
                    <HeartIcon />
                    {isSaved(`oto-${selectedProduct.id}`)
                      ? "Đã lưu"
                      : "Lưu tin"}
                  </button>
                  <button
                    className={`action-btn secondary large compare-btn ${
                      comparedItems.has(selectedProduct.id) ? "comparing" : ""
                    }`}
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
export default SellOtoPage;
