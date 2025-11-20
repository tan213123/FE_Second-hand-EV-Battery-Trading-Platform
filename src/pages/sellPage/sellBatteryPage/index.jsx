import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSaved, useCompare } from "../../../contexts/AppContext";
import api from "../../../config/api";
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
  const [batteriesFromStorage, setBatteriesFromStorage] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleSaved, isSaved } = useSaved();
  const { addToCompare } = useCompare();

  // Load batteries from localStorage
  useEffect(() => {
    const loadBatteriesFromApi = async () => {
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

        const batteryPosts = data.filter(
          (post) =>
            (post.articleType === "BATTERY_ARTICLE" ||
              post.articleType === "battery") &&
            post.status === "APPROVED"
        );

        const formattedBatteries = batteryPosts.map((post) => {
          const capacityValue =
            post.capacity !== undefined && post.capacity !== null
              ? post.capacity
              : null;

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
            type: post.batteryType || "Lithium-ion",
            condition: post.condition,
            price:
              new Intl.NumberFormat("vi-VN").format(post.price || 0) + " đ",
            location: locationText,
            seller: post.contactName || post.memberName || "",
            phone:
              post.contactPhone ||
              post.memberPhone ||
              post.phone ||
              post.phoneNumber ||
              "",
            verified: post.status === "APPROVED",
            images: Array.isArray(post.images)
              ? post.images.length
              : Array.isArray(post.imageUrls)
              ? post.imageUrls.length
              : 0,
            featured: false,
            vip: false,
            discount: post.negotiable ? "Có thể thương lượng" : "",
            capacity: capacityValue !== null ? capacityValue : "N/A",
            volt:
              post.volt !== undefined && post.volt !== null ? post.volt : null,
            size:
              post.size !== undefined && post.size !== null ? post.size : null,
            weight:
              post.weight !== undefined && post.weight !== null
                ? post.weight
                : null,
            health: post.batteryInfo ? `${post.batteryInfo}%` : "N/A",
            brand: post.brand,
            description: post.content || "",
            origin: post.origin || "Chưa cập nhật",
            warrantyMonths:
              post.warrantyMonths !== undefined && post.warrantyMonths !== null
                ? post.warrantyMonths
                : null,
            originalPost: post,
            image:
              post.mainImageUrl ||
              (Array.isArray(post.images) && post.images.length > 0
                ? post.images[0].url || post.images[0]
                : Array.isArray(post.imageUrls) && post.imageUrls.length > 0
                ? post.imageUrls[0]
                : "/api/placeholder/400/300"),
            specs: {
              brand: post.brand || "N/A",
              volt:
                post.volt !== undefined && post.volt !== null
                  ? post.volt
                  : "Chưa cập nhật",
              capacity:
                capacityValue !== null ? capacityValue : "Chưa cập nhật",
              size:
                post.size !== undefined && post.size !== null
                  ? post.size
                  : "Chưa cập nhật",
              weight:
                post.weight !== undefined && post.weight !== null
                  ? post.weight
                  : "Chưa cập nhật",
              warrantyMonths:
                post.warrantyMonths !== undefined &&
                post.warrantyMonths !== null
                  ? post.warrantyMonths
                  : "Chưa cập nhật",
              condition: post.condition || "Chưa cập nhật",
              health: post.batteryInfo ? `${post.batteryInfo}%` : "N/A",
              origin: post.origin || "Chưa cập nhật",
            },
          };
        });

        setBatteriesFromStorage(formattedBatteries);
      } catch (error) {
        console.error("Error loading batteries from API:", error);
        setBatteriesFromStorage([]);
      } finally {
        setLoading(false);
      }
    };

    loadBatteriesFromApi();

    const handleStorageChange = () => loadBatteriesFromApi();
    window.addEventListener("postUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("postUpdated", handleStorageChange);
    };
  }, []);

  const handleToggleSaved = (e, battery) => {
    e.preventDefault();
    e.stopPropagation();
    const savedBattery = {
      ...battery,
      id: `battery-${battery.id}`, // Thêm prefix để tránh conflict với trang khác
      category: "Pin xe điện",
      image: battery.image || "/api/placeholder/400/300",
    };
    toggleSaved(savedBattery);
  };

  const handleAddToCompare = (e, battery) => {
    e.preventDefault();
    e.stopPropagation();
    const compareBattery = {
      ...battery,
      id: `battery-${battery.id}`,
      category: "Pin xe điện",
      image: battery.image || "/api/placeholder/400/300",
      specs: {
        brand: battery.seller || "-",
        capacity: battery.capacity || "-",
        type: battery.type || "-",
        condition: battery.condition || "-",
        health: battery.health || "-",
        battery: battery.batteryInfo || "-",
        color: "-",
        origin: battery.origin || "-",
      },
    };
    addToCompare(compareBattery);

    // Add visual feedback animation
    setComparedItems((prev) => new Set(prev).add(battery.id));

    // Remove the animation class after a short delay
    setTimeout(() => {
      setComparedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(battery.id);
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

  const handleRevealPhone = (e, batteryId) => {
    e.preventDefault();
    e.stopPropagation();
    setRevealedPhones((prev) => {
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

  // Dữ liệu filter
  const brands = [
    { name: "VinFast", logo: "🔋", count: 8950 },
    { name: "BYD", logo: "🔋", count: 4320 },
    { name: "Panasonic", logo: "🔋", count: 3210 },
    { name: "LG", logo: "🔋", count: 2890 },
    { name: "CATL", logo: "🔋", count: 2150 },
    { name: "Samsung SDI", logo: "🔋", count: 1870 },
    { name: "Tesla", logo: "🔋", count: 1650 },
    { name: "Khác", logo: "🔋", count: 1560 },
  ];

  const locations = ["Tp Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Huế", "Gần tôi"];

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
    "LFP (Lithium Iron Phosphate)",
    "Li-ion 18650",
    "NCM",
    "NCA",
  ];

  const capacities = [
    "Dưới 20 kWh",
    "20-40 kWh",
    "40-60 kWh",
    "60-80 kWh",
    "Trên 80 kWh",
  ];

  const conditions = ["Mới", "Đã sử dụng", "Cũ nhưng tốt"];

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

  const voltageRanges = ["12V", "24V", "48V", "400V", "800V"];

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

  // Thêm một số dữ liệu test để kiểm tra hình ảnh
  const testBatteries = [
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
      image:
        "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Pin Tesla Model 3 Long Range - 82 kWh - 95% dung lượng",
      capacity: "82 kWh",
      type: "Lithium-ion",
      condition: "Đã sử dụng",
      health: "95%",
      price: "180,000,000 đ",
      location: "Hà Nội",
      seller: "Tesla Center Vietnam",
      phone: "0901234567",
      verified: true,
      images: 6,
      rating: 4.7,
      featured: false,
      vip: false,
      image:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
    },
  ];

  // Chỉ sử dụng dữ liệu thật từ localStorage, fallback về test data nếu trống
  const allBatteryListings = loading
    ? []
    : batteriesFromStorage.length > 0
    ? batteriesFromStorage
    : testBatteries;

  // Hàm lọc pin theo filter
  const getFilteredBatteries = () => {
    let filteredBatteries = [...allBatteryListings];

    // Lọc theo brands
    if (selectedBrands.length > 0) {
      filteredBatteries = filteredBatteries.filter((battery) => {
        const batteryBrand = battery.title.split(" ")[0].toLowerCase();
        return selectedBrands.some(
          (brand) =>
            brand.toLowerCase().includes(batteryBrand) ||
            batteryBrand.includes(brand.toLowerCase()) ||
            battery.title.toLowerCase().includes(brand.toLowerCase())
        );
      });
    }

    // Lọc theo price ranges
    if (selectedPriceRanges.length > 0) {
      filteredBatteries = filteredBatteries.filter((battery) => {
        const priceValue = parseInt(battery.price.replace(/[^\d]/g, ""));
        return selectedPriceRanges.some((range) => {
          if (range.includes("dưới 50")) return priceValue < 50000000;
          if (range.includes("50 triệu - 100"))
            return priceValue >= 50000000 && priceValue <= 100000000;
          if (range.includes("100 triệu - 200"))
            return priceValue >= 100000000 && priceValue <= 200000000;
          if (range.includes("200 triệu - 300"))
            return priceValue >= 200000000 && priceValue <= 300000000;
          if (range.includes("Trên 300")) return priceValue > 300000000;
          return false;
        });
      });
    }

    // Lọc theo battery types
    if (selectedBatteryTypes.length > 0) {
      filteredBatteries = filteredBatteries.filter((battery) =>
        selectedBatteryTypes.includes(battery.type)
      );
    }

    // Lọc theo capacities
    if (selectedCapacities.length > 0) {
      filteredBatteries = filteredBatteries.filter((battery) => {
        const capacityValue = parseFloat(
          battery.capacity.replace(/[^\d.]/g, "")
        );
        return selectedCapacities.some((cap) => {
          if (cap.includes("Dưới 20")) return capacityValue < 20;
          if (cap.includes("20-40"))
            return capacityValue >= 20 && capacityValue <= 40;
          if (cap.includes("40-60"))
            return capacityValue >= 40 && capacityValue <= 60;
          if (cap.includes("60-80"))
            return capacityValue >= 60 && capacityValue <= 80;
          if (cap.includes("Trên 80")) return capacityValue > 80;
          return false;
        });
      });
    }

    // Lọc theo conditions
    if (selectedConditions.length > 0) {
      filteredBatteries = filteredBatteries.filter((battery) =>
        selectedConditions.includes(battery.condition)
      );
    }

    // Lọc theo cities
    if (selectedCities.length > 0) {
      filteredBatteries = filteredBatteries.filter((battery) =>
        selectedCities.some((city) => battery.location.includes(city))
      );
    }

    // Lọc theo battery health
    if (selectedBatteryHealth.length > 0) {
      filteredBatteries = filteredBatteries.filter((battery) =>
        selectedBatteryHealth.some(
          (health) =>
            battery.title.toLowerCase().includes(health.toLowerCase()) ||
            (battery.health && battery.health.includes(health))
        )
      );
    }

    // Lọc theo cycle count
    if (selectedCycleCount.length > 0) {
      filteredBatteries = filteredBatteries.filter((battery) =>
        selectedCycleCount.some(
          (cycle) =>
            battery.title.toLowerCase().includes(cycle.toLowerCase()) ||
            (battery.cycleCount && battery.cycleCount.includes(cycle))
        )
      );
    }

    // Lọc theo warranty
    if (selectedWarranty.length > 0) {
      filteredBatteries = filteredBatteries.filter((battery) =>
        selectedWarranty.some(
          (warranty) =>
            battery.title.toLowerCase().includes(warranty.toLowerCase()) ||
            (battery.warranty && battery.warranty.includes(warranty))
        )
      );
    }

    // Lọc theo voltage
    if (selectedVoltage.length > 0) {
      filteredBatteries = filteredBatteries.filter((battery) =>
        selectedVoltage.some(
          (voltage) =>
            battery.title.toLowerCase().includes(voltage.toLowerCase()) ||
            (battery.voltage && battery.voltage.includes(voltage))
        )
      );
    }

    // Lọc theo power
    if (selectedPower.length > 0) {
      filteredBatteries = filteredBatteries.filter((battery) =>
        selectedPower.some(
          (power) =>
            battery.title.toLowerCase().includes(power.toLowerCase()) ||
            (battery.power && battery.power.includes(power))
        )
      );
    }

    // Lọc theo origins
    if (selectedOrigins.length > 0) {
      filteredBatteries = filteredBatteries.filter((battery) =>
        selectedOrigins.some(
          (origin) =>
            battery.title.toLowerCase().includes(origin.toLowerCase()) ||
            (battery.origin && battery.origin === origin)
        )
      );
    }

    // Lọc theo locations (khu vực)
    if (selectedLocations.length > 0) {
      filteredBatteries = filteredBatteries.filter((battery) =>
        selectedLocations.some((location) =>
          battery.location.includes(location)
        )
      );
    }

    return filteredBatteries;
  };

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
                      className={`dropdown-item ${
                        selectedCapacities.includes(capacity) ? "selected" : ""
                      }`}
                      onClick={() => {
                        if (selectedCapacities.includes(capacity)) {
                          setSelectedCapacities(
                            selectedCapacities.filter((c) => c !== capacity)
                          );
                        } else {
                          setSelectedCapacities([
                            ...selectedCapacities,
                            capacity,
                          ]);
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
                      <span>
                        {brand.logo} {brand.name} ({brand.count})
                      </span>
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
                      className={`dropdown-item ${
                        selectedBatteryTypes.includes(type) ? "selected" : ""
                      }`}
                      onClick={() => {
                        if (selectedBatteryTypes.includes(type)) {
                          setSelectedBatteryTypes(
                            selectedBatteryTypes.filter((t) => t !== type)
                          );
                        } else {
                          setSelectedBatteryTypes([
                            ...selectedBatteryTypes,
                            type,
                          ]);
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
                      className={`dropdown-item ${
                        selectedConditions.includes(condition) ? "selected" : ""
                      }`}
                      onClick={() => {
                        if (selectedConditions.includes(condition)) {
                          setSelectedConditions(
                            selectedConditions.filter((c) => c !== condition)
                          );
                        } else {
                          setSelectedConditions([
                            ...selectedConditions,
                            condition,
                          ]);
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
                            setSelectedBatteryHealth([
                              ...selectedBatteryHealth,
                              health,
                            ]);
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
                            setSelectedCycleCount([
                              ...selectedCycleCount,
                              cycle,
                            ]);
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
                    <label
                      key={warranty}
                      className="dropdown-item checkbox-item"
                    >
                      <input
                        type="checkbox"
                        checked={selectedWarranty.includes(warranty)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedWarranty([
                              ...selectedWarranty,
                              warranty,
                            ]);
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
                    <label
                      key={voltage}
                      className="dropdown-item checkbox-item"
                    >
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
                          setSelectedConditions(
                            selectedConditions.filter((c) => c !== condition)
                          );
                        } else {
                          setSelectedConditions([
                            ...selectedConditions,
                            condition,
                          ]);
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
                  style={{ cursor: "pointer" }}
                >
                  {battery.vip && <div className="vip-badge">Tin VIP</div>}
                  {battery.featured && (
                    <div className="featured-badge">Tin tiêu biểu</div>
                  )}

                  <div className="battery-image">
                    <img
                      src={battery.image || "/api/placeholder/400/300"}
                      alt={battery.title}
                      onError={(e) => {
                        e.target.src = "/api/placeholder/400/300";
                      }}
                    />
                    <button
                      className={`favorite-btn ${
                        isSaved(`battery-${battery.id}`) ? "saved" : ""
                      }`}
                      onClick={(e) => handleToggleSaved(e, battery)}
                      title={
                        isSaved(`battery-${battery.id}`) ? "Bỏ lưu" : "Lưu tin"
                      }
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
                      <span>{getCityFromLocation(battery.location)}</span>
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
                        {revealedPhones.has(battery.id)
                          ? battery.phone || "Không có số điện thoại"
                          : "Bấm để hiện số"}
                      </button>
                      <button
                        className={`action-btn compare-btn ${
                          comparedItems.has(battery.id) ? "comparing" : ""
                        }`}
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
                      selectedProduct.image ||
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
                  {selectedProduct.images > 1 && (
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

                {selectedProduct.images > 1 && (
                  <div className="image-thumbnails">
                    {Array.from(
                      { length: selectedProduct.images },
                      (_, index) => (
                        <div
                          key={index}
                          className={`thumbnail ${
                            index === currentImageIndex ? "active" : ""
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img
                            src={`/api/placeholder/100/80?text=${index + 1}`}
                            alt={`${selectedProduct.title} ${index + 1}`}
                          />
                        </div>
                      )
                    )}
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
                    <div className="product-discount">
                      {selectedProduct.discount}
                    </div>
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
                  {selectedProduct.brand && (
                    <div className="info-row">
                      <span className="label">Thương hiệu:</span>
                      <span className="value">{selectedProduct.brand}</span>
                    </div>
                  )}
                  {selectedProduct.origin && (
                    <div className="info-row">
                      <span className="label">Xuất xứ:</span>
                      <span className="value">{selectedProduct.origin}</span>
                    </div>
                  )}
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
                      isSaved(`battery-${selectedProduct.id}`) ? "saved" : ""
                    }`}
                    onClick={(e) => handleToggleSaved(e, selectedProduct)}
                  >
                    <HeartIcon />
                    {isSaved(`battery-${selectedProduct.id}`)
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
export default SellBatteryPage;
