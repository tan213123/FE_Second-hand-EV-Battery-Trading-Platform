import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompare } from "../../contexts/AppContext";
import "./index.scss";

const Compare = () => {
  const navigate = useNavigate();
  const { compareItems, removeFromCompare, clearCompare, addToCompare } =
    useCompare();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Mock data - thay bằng API call thực tế
  const mockProducts = [
    {
      id: 1,
      title: "VinFast VF 8 2023",
      price: 850000000,
      category: "car",
      image: "/api/placeholder/300/200?text=VinFast+VF8",
      specs: {
        year: 2023,
        brand: "VinFast",
        condition: "Mới",
        bodyType: "SUV",
        seats: "5 chỗ",
        color: "Đỏ",
        origin: "Sản xuất trong nước",
        mileage: "0 km",
        battery: "95%",
      },
      // Thêm thông tin đầy đủ cho PostDetailPage
      year: 2023,
      brand: "VinFast",
      condition: "Mới",
      color: "Đỏ",
      origin: "Sản xuất trong nước",
      mileage: 0,
      batteryInfo: 95,
      description:
        "VinFast VF 8 2023 - xe điện cao cấp với công nghệ tiên tiến, thiết kế sang trọng và hiệu suất vượt trội.",
      contactName: "Showroom VinFast",
      contactPhone: "0901234567",
      location: {
        city: "TP. Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường Bến Nghé",
        address: "123 Đường Nguyễn Huệ",
      },
      images: [
        "/api/placeholder/600/400?text=VinFast+VF8+1",
        "/api/placeholder/600/400?text=VinFast+VF8+2",
      ],
      createdAt: new Date().toISOString(),
      negotiable: true,
    },
    {
      id: 2,
      title: "Cần bán xe điện gấp để mua xe mới",
      price: 200000000,
      category: "electric",
      image: "/api/placeholder/300/200?text=Xe+Dien",
      specs: {
        year: 2023,
        brand: "VinFast",
        condition: "Đã sử dụng (Còn mới)",
        color: "Nâu",
        origin: "Sản xuất trong nước",
        mileage: "100 km",
        battery: "85%",
      },
      // Thêm thông tin đầy đủ cho PostDetailPage
      year: 2023,
      brand: "VinFast",
      condition: "Đã sử dụng (Còn mới)",
      color: "Nâu",
      origin: "Sản xuất trong nước",
      mileage: 100,
      batteryInfo: 85,
      description:
        "Xe điện VinFast Klara S 2022 còn mới 95%, pin tốt, chạy êm. Cần bán gấp để mua xe mới.",
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      location: {
        city: "TP. Hồ Chí Minh",
        district: "Quận 7",
        ward: "Phường Tân Phú",
        address: "456 Đường Nguyễn Thị Thập",
      },
      images: [
        "/api/placeholder/600/400?text=Klara+S+1",
        "/api/placeholder/600/400?text=Klara+S+2",
      ],
      createdAt: new Date().toISOString(),
      negotiable: true,
    },
    {
      id: 3,
      title: "Yadea S3 Pro 2023",
      price: 25000000,
      category: "electric",
      image: "/api/placeholder/300/200?text=Yadea+S3",
      specs: {
        year: 2023,
        brand: "Yadea",
        condition: "Mới",
        color: "Xanh",
        origin: "Nhập khẩu",
        battery: "90%",
        range: "70 km",
      },
      // Thêm thông tin đầy đủ cho PostDetailPage
      year: 2023,
      brand: "Yadea",
      condition: "Mới",
      color: "Xanh",
      origin: "Nhập khẩu",
      mileage: 0,
      batteryInfo: 90,
      description:
        "Yadea S3 Pro 2023 mới 100%, pin lithium cao cấp, thiết kế thể thao năng động.",
      contactName: "Yadea Chính Hãng",
      contactPhone: "0912345678",
      location: {
        city: "Hà Nội",
        district: "Quận Hai Bà Trưng",
        ward: "Phường Bách Khoa",
        address: "789 Đường Hai Bà Trưng",
      },
      images: [
        "/api/placeholder/600/400?text=Yadea+S3+1",
        "/api/placeholder/600/400?text=Yadea+S3+2",
      ],
      createdAt: new Date().toISOString(),
      negotiable: false,
    },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = mockProducts.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddToCompare = (product) => {
    const result = addToCompare(product);
    if (result.success) {
      setSearchQuery("");
      setSearchResults([]);
    } else {
      alert(result.message);
    }
  };

  const handleViewDetail = (item) => {
    // Lưu dữ liệu sản phẩm vào sessionStorage để sử dụng trong trang detail
    // Ưu tiên originalPost (dữ liệu thực), fallback về item (mock data)
    const postData = item.originalPost || item;
    sessionStorage.setItem("viewingPost", JSON.stringify(postData));
    // Chuyển đến trang chi tiết bài đăng
    navigate("/post-detail/" + postData.id);
  };

  const getCompareType = () => {
    if (!compareItems.length) return "unknown";
    const item = compareItems[0];

    if (item.compareType) return item.compareType;

    const cat = (item.category || "").toLowerCase();
    const articleType = item.articleType || item.type;

    if (
      cat.includes("ô tô") ||
      articleType === "CAR_ARTICLE" ||
      articleType === "car"
    ) {
      return "car";
    }

    if (
      cat.includes("xe máy") ||
      cat.includes("xe điện") ||
      articleType === "MOTOR_ARTICLE" ||
      articleType === "electric"
    ) {
      return "bike";
    }

    if (
      cat.includes("pin") ||
      articleType === "BATTERY_ARTICLE" ||
      articleType === "battery"
    ) {
      return "battery";
    }

    return "unknown";
  };

  const compareType = getCompareType();

  const carSpecLabels = {
    year: "Năm sản xuất",
    brand: "Hãng/Thương hiệu",
    bodyType: "Kiểu dáng",
    seats: "Số chỗ",
    origin: "Xuất xứ",
    mileage: "Số km đã đi",
    licensesPlate: "Biển số xe",
    registrationDeadline: "Hạn đăng kiểm",
    warrantyPeriodMonths: "Bảo hành (tháng)",
  };

  const bikeSpecLabels = {
    year: "Năm sản xuất",
    brand: "Hãng/Thương hiệu",
    condition: "Tình trạng",
    color: "Màu sắc",
    origin: "Xuất xứ",
    mileage: "Số km đã đi",
    battery: "Pin",
  };

  const batterySpecLabels = {
    brand: "Thương hiệu",
    volt: "Điện áp (Volt)",
    capacity: "Dung lượng (Ah/kWh)",
    size: "Kích thước",
    weight: "Trọng lượng",
    warrantyMonths: "Bảo hành (tháng)",
    condition: "Tình trạng",
    health: "Độ khỏe pin",
    origin: "Xuất xứ",
  };

  const defaultSpecLabels = {
    year: "Năm sản xuất",
    brand: "Hãng/Thương hiệu",
    condition: "Tình trạng",
    bodyType: "Kiểu dáng",
    seats: "Số chỗ",
    color: "Màu sắc",
    origin: "Xuất xứ",
    mileage: "Số km đã đi",
    battery: "Pin",
    capacity: "Dung lượng",
    type: "Loại pin",
    health: "Sức khỏe pin",
  };

  const specLabels =
    compareType === "car"
      ? carSpecLabels
      : compareType === "bike"
      ? bikeSpecLabels
      : compareType === "battery"
      ? batterySpecLabels
      : defaultSpecLabels;

  return (
    <div className="compare-page">
      <div className="container">
        <div className="compare-header">
          <h1>So sánh sản phẩm</h1>
          <p>So sánh chi tiết để chọn được sản phẩm phù hợp nhất</p>
        </div>

        {/* Search Box */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm để thêm vào so sánh..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="search-result-item"
                  onClick={() => handleAddToCompare(product)}
                >
                  <img src={product.image} alt={product.title} />
                  <div className="result-info">
                    <h4>{product.title}</h4>
                    <div className="result-price">
                      {product.price.toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                  <button className="btn-add">+</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compare Table */}
        {compareItems.length > 0 ? (
          <div className="compare-container">
            <div className="compare-actions">
              <button className="btn-clear" onClick={clearCompare}>
                Xóa tất cả
              </button>
              <span className="item-count">
                {compareItems.length}/4 sản phẩm
              </span>
            </div>

            <div className="compare-table">
              {/* Product Cards */}
              <div className="compare-row products-row">
                <div className="compare-label"></div>
                {compareItems.map((item) => (
                  <div key={item.id} className="compare-cell product-card">
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCompare(item.id)}
                    >
                      ×
                    </button>
                    <img src={item.image} alt={item.title} />
                    <h3>{item.title}</h3>
                    <div className="product-price">
                      {item.price.toLocaleString("vi-VN")} đ
                    </div>
                    <button
                      className="btn-view"
                      onClick={() => handleViewDetail(item)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                ))}
              </div>

              {/* Specifications Rows */}
              {Object.keys(specLabels).map((specKey) => {
                const hasSpec = compareItems.some(
                  (item) => item.specs?.[specKey]
                );
                if (!hasSpec) return null;

                return (
                  <div key={specKey} className="compare-row">
                    <div className="compare-label">{specLabels[specKey]}</div>
                    {compareItems.map((item) => (
                      <div key={item.id} className="compare-cell">
                        {item.specs?.[specKey] || "-"}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">⚖️</div>
            <h2>Chưa có sản phẩm để so sánh</h2>
            <p>Tìm kiếm và thêm sản phẩm vào danh sách để bắt đầu so sánh</p>
            <button className="btn-browse" onClick={() => navigate("/")}>
              Khám phá sản phẩm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
