import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompare } from "../../contexts/AppContext";
import "./index.scss";

const Compare = () => {
  const navigate = useNavigate();
  const { compareItems, removeFromCompare, clearAll, addToCompare } = useCompare();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Mock data - thay bằng API call thực tế
  const mockProducts = [
    {
      id: 1,
      title: "VinFast VF 8 2023",
      price: 850000000,
      category: "car",
      image: "https://via.placeholder.com/300x200",
      specs: {
        year: 2023,
        brand: "VinFast",
        condition: "Mới",
        bodyType: "SUV",
        seats: "5 chỗ",
        color: "Đỏ",
        origin: "Sản xuất trong nước",
        mileage: "0 km",
      },
    },
    {
      id: 2,
      title: "Toyota Camry 2022",
      price: 1200000000,
      category: "car",
      image: "https://via.placeholder.com/300x200",
      specs: {
        year: 2022,
        brand: "Toyota",
        condition: "Đã sử dụng (Tốt)",
        bodyType: "Sedan",
        seats: "5 chỗ",
        color: "Đen",
        origin: "Nhập khẩu",
        mileage: "15000 km",
      },
    },
    {
      id: 3,
      title: "Yadea S3 Pro 2023",
      price: 25000000,
      category: "electric",
      image: "https://via.placeholder.com/300x200",
      specs: {
        year: 2023,
        brand: "Yadea",
        condition: "Mới",
        color: "Xanh",
        origin: "Nhập khẩu",
        battery: "60V 20Ah",
        range: "70 km",
      },
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

  const specLabels = {
    year: "Năm sản xuất",
    brand: "Hãng",
    condition: "Tình trạng",
    bodyType: "Kiểu dáng",
    seats: "Số chỗ",
    color: "Màu sắc",
    origin: "Xuất xứ",
    mileage: "Số km",
    battery: "Pin",
    range: "Quãng đường",
  };

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
              <button className="btn-clear" onClick={clearAll}>
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
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                ))}
              </div>

              {/* Specifications Rows */}
              {Object.keys(specLabels).map((specKey) => {
                const hasSpec = compareItems.some((item) => item.specs[specKey]);
                if (!hasSpec) return null;

                return (
                  <div key={specKey} className="compare-row">
                    <div className="compare-label">{specLabels[specKey]}</div>
                    {compareItems.map((item) => (
                      <div key={item.id} className="compare-cell">
                        {item.specs[specKey] || "-"}
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
            <button
              className="btn-browse"
              onClick={() => navigate("/")}
            >
              Khám phá sản phẩm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
