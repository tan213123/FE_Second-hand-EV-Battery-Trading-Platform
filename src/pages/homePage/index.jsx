import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSaved } from "../../contexts/AppContext";
import localStorageService from "../../services/localStorageService";
import "./index.scss";
import { useSelector } from "react-redux";
import api from "../../config/api";

// Icon SVG components
const LocationIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
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

const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const VideoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const VerifiedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#4CAF50">
    <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
  </svg>
);

function HomePage() {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [articlesError, setArticlesError] = useState(null);
  const { toggleSaved, isSaved } = useSaved();
  const navigate = useNavigate();

  const member = useSelector((store) => store.member);
  const isAuthenticated = !!member;
  const user = member;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const categories = [
    { icon: "electric-car", label: "Ô tô", color: "#4ECDC4", page: "oto" },
    {
      icon: "electric-motorcycle",
      label: "Xe điện",
      color: "#FF6B6B",
      page: "bike",
    },
    { icon: "battery", label: "Pin", color: "#FFD93D", page: "battery" },
  ];

  const handleCategoryClick = (page) => {
    if (!isAuthenticated) {
      // Nếu chưa đăng nhập, chuyển đến trang login
      navigate("/login");
      return;
    }

    if (page === "oto") navigate("/oto");
    else if (page === "bike") navigate("/bike");
    else if (page === "battery") navigate("/battery");
  };

  const handleProductClick = (listing) => {
    if (!isAuthenticated) {
      // Nếu chưa đăng nhập, chuyển đến trang login
      navigate("/login");
      return;
    }
    // Logic xem chi tiết sản phẩm sẽ thêm sau
    console.log("Xem chi tiết:", listing.title);
    // TODO: Navigate to product detail page
    // navigate(`/product/${listing.id}`)
  };

  // Load dữ liệu từ localStorage
  useEffect(() => {
    console.log("HomePage loaded - Loading data from localStorage");
    console.log("User authenticated:", isAuthenticated);
    if (user) {
      console.log("👤 User info:", {
        id: user.memberId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      });
    }
    if (token) {
      console.log("🔑 User token:", token);
    }

    const loadAllPosts = () => {
      setLoading(true);
      try {
        // Lấy tất cả bài đăng từ localStorage
        const posts = localStorageService.getAllPosts();
        console.log("Loaded posts from localStorage:", posts);
        setAllPosts(posts);
      } catch (error) {
        console.error("Error loading posts:", error);
        setAllPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllPosts();

    // Listen for storage changes to update when new posts are added
    const handleStorageChange = () => loadAllPosts();
    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events from same window (since storage event doesn't fire for same window)
    const handleCustomPostUpdate = () => loadAllPosts();
    window.addEventListener("postUpdated", handleCustomPostUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("postUpdated", handleCustomPostUpdate);
    };
  }, [isAuthenticated, user, token]);

  // Fetch articles once for the homepage from backend GET /article
  useEffect(() => {
    let cancelled = false;
    const fetchArticles = async () => {
      try {
        setArticlesLoading(true);
        setArticlesError(null);
        const res = await api.get("/article");
        if (!cancelled) {
          // Accept array shape or { data: [] }
          const data = Array.isArray(res.data)
            ? res.data
            : res.data?.data || [];
          setArticles(data);
        }
      } catch (err) {
        if (!cancelled)
          setArticlesError("Không thể tải bài viết. Vui lòng thử lại sau.");
        console.error("GET /article failed:", err);
      } finally {
        if (!cancelled) setArticlesLoading(false);
      }
    };
    fetchArticles();
    return () => {
      cancelled = true;
    };
  }, []);

  const getCategoryIcon = (type) => {
    const icons = {
      "electric-car": "🚗",
      "electric-motorcycle": "🏍️",
      battery: "⚡",
    };
    return icons[type] || "🚗";
  };

  const getCategoryName = (category) => {
    const categoryNames = {
      car: "Ô tô điện",
      electric: "Xe máy điện",
      battery: "Pin xe điện",
    };
    return categoryNames[category] || "Khác";
  };

  const formatPostForDisplay = (post) => {
    const now = new Date();
    const created = new Date(post.createdAt);
    const diffInMinutes = Math.floor((now - created) / (1000 * 60));

    const timeAgo = () => {
      if (diffInMinutes < 1) return "Vừa xong";
      if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} giờ trước`;

      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    };

    return {
      id: post.id,
      title: post.title,
      year: post.year,
      transmission: post.category === "battery" ? "Pin" : "Điện",
      condition: post.condition,
      price: parseInt(post.price),
      location: `${post.location?.district || ""}, ${
        post.location?.city || ""
      }`,
      images: post.images?.length || 0,
      timePosted: timeAgo(),
      badge: diffInMinutes < 60 ? "Mới đăng" : null,
      category: getCategoryName(post.category),
      image:
        post.images?.[0] ||
        "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
    };
  };

  // Sử dụng dữ liệu thật từ localStorage hoặc fallback về mock data
  const latestListings = loading
    ? []
    : allPosts.length > 0
    ? allPosts.slice(0, 12).map(formatPostForDisplay)
    : [
        {
          id: "home-1",
          title: "VinFast VF 8 Plus 2023 - Pin thuê bao",
          year: 2023,
          km: "8,500 km",
          transmission: "Điện",
          condition: "Tự động",
          price: 250000000,
          location: "Quận Cầu Giấy, Hà Nội",
          images: 12,
          timePosted: "1 phút trước",
          badge: "Mới đăng",
          category: "Ô tô điện",
          //image: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=VinFast+VF8'
          // image: '/api/placeholder/300/200' // COMMENTED to avoid API calls
        },
        {
          id: "home-2",
          title: "Pin Lithium 48V 20Ah   xe máy điện",
          year: 2024,
          status: "Pin",
          transmission: "Mới 100%",
          condition: "Chính hãng",
          price: 12500000,
          location: "Quận 7, TP.HCM",
          images: 6,
          videoCount: 1,
          timePosted: "Tin tiêu biểu",
          badge: "Tin tiêu biểu",
          category: "Pin xe điện",
          //image: 'https://via.placeholder.com/300x200/FFD93D/000000?text=Pin+Lithium'
          // image: '/api/placeholder/300/200' // COMMENTED to avoid API calls
        },
        {
          id: "home-3",
          title: "Yadea S3 Pro 2023 - Xe máy điện",
          year: 2023,
          km: "2,300 km",
          transmission: "Điện",
          condition: "Như mới",
          price: 18900000,
          location: "Quận Tân Bình, TP.HCM",
          images: 10,
          timePosted: "15 phút trước",
          badge: null,
          category: "Xe máy điện",
          //image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Yadea+S3'
          // image: '/api/placeholder/300/200' // COMMENTED to avoid API calls
        },
        {
          id: "home-4",
          title: "VinFast VF e34 2022 - Đã qua sử dụng",
          year: 2022,
          km: "15,000 km",
          transmission: "Điện",
          condition: "Tự động",
          price: 520000000,
          location: "Quận Đống Đa, Hà Nội",
          images: 15,
          timePosted: "30 phút trước",
          badge: null,
          category: "Ô tô điện",
          //image: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=VF+e34'
          // image: '/api/placeholder/300/200' // COMMENTED to avoid API calls
        },
        {
          id: "home-5",
          title: "Pin Ắc quy Lithium Tesla 72V 32Ah",
          year: 2024,
          km: "Mới 100%",
          transmission: "Pin cao cấp",
          condition: "Bảo hành 3 năm",
          price: 28000000,
          location: "Quận Hoàng Mai, Hà Nội",
          images: 8,
          timePosted: "45 phút trước",
          badge: null,
          category: "Pin xe điện",
          // image: 'https://via.placeholder.com/300x200/FFD93D/000000?text=Pin+Tesla'
          // image: '/api/placeholder/300/200' // COMMENTED to avoid API calls
        },
        {
          id: "home-6",
          title: "Pega Newtech 2023 - Xe điện thông minh",
          year: 2023,
          km: "3,800 km",
          transmission: "Điện",
          condition: "Pin rời",
          price: 22500000,
          location: "Quận Hai Bà Trưng, Hà Nội",
          images: 11,
          timePosted: "1 giờ trước",
          badge: null,
          category: "Xe máy điện",
          // image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Pega'
          // image: '/api/placeholder/300/200' // COMMENTED to avoid API calls
        },
      ];

  const handleToggleSaved = (e, listing) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Nếu chưa đăng nhập, chuyển đến trang login
      navigate("/login");
      return;
    }

    console.log("=== FAVORITE CLICKED ===");
    console.log("Listing:", listing);
    console.log("isSaved before:", isSaved(listing.id));
    toggleSaved(listing);
    // Đợi một chút để state cập nhật
    setTimeout(() => {
      console.log("isSaved after:", isSaved(listing.id));
      console.log("localStorage:", localStorage.getItem("savedItems"));
    }, 100);
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " đ";
  };

  const customerReviews = [
    {
      id: 1,
      userName: "Nguyễn Văn An",
      userType: "Người mua",
      verified: true,
      timePosted: "2 ngày trước",
      rating: 5,
      product: "VinFast VF 8 Plus 2023",
      content:
        "Mình vừa mua chiếc VF 8 từ người bán trên sàn. Xe còn rất mới, pin hoạt động tốt. Người bán tư vấn nhiệt tình, giao xe đúng hẹn. Rất hài lòng với giao dịch này!",
      //images: ['/placeholder1.jpg', '/placeholder2.jpg'],
      likes: 24,
      comments: 5,
    },
    {
      id: 2,
      userName: "Trần Thị Minh",
      userType: "Người bán",
      verified: true,
      timePosted: "5 ngày trước",
      rating: 5,
      product: "Pin Lithium 48V 20Ah",
      content:
        "Cảm ơn nền tảng đã giúp mình bán được pin xe điện nhanh chóng. Quy trình đăng tin đơn giản, nhiều người quan tâm. Đã giao dịch thành công!",
      // images: ['/placeholder3.jpg'],
      likes: 18,
      comments: 3,
    },
    {
      id: 3,
      userName: "Lê Hoàng Nam",
      userType: "Người mua",
      verified: true,
      timePosted: "1 tuần trước",
      rating: 5,
      product: "Yadea S3 Pro 2023",
      content:
        "Xe máy điện chất lượng, giá cả hợp lý. Người bán rất uy tín, cho xem xe kỹ trước khi mua. Pin còn mới 95%, chạy êm. Recommend cho mọi người!",
      //images: ['/placeholder4.jpg', '/placeholder5.jpg', '/placeholder6.jpg'],
      likes: 31,
      comments: 8,
    },
    {
      id: 4,
      userName: "Phạm Thu Hà",
      userType: "Người bán",
      verified: false,
      timePosted: "1 tuần trước",
      rating: 4,
      product: "VinFast VF e34 2022",
      content:
        "Nền tảng dễ sử dụng, hỗ trợ đăng tin miễn phí. Đã có nhiều người liên hệ hỏi về xe. Hy vọng sớm bán được xe điện của mình.",
      //images: [],
      likes: 12,
      comments: 2,
    },
  ];

  const popularKeywords = [
    ["Giá xe Vios", "Giá xe Innova", "Giá xe Fortuner", "Giá xe Yaris Cross"],
    ["Giá xe VF5", "Giá xe VF3", "Giá xe VF6", "Giá xe VF7"],
    ["Giá xe CX5", "Giá xe CX8", "Giá xe Mazda 3", "Giá xe Mazda 2"],
    ["Giá xe Honda City", "Giá xe Honda Civic", "Giá xe CRV", "Giá xe HRV"],
    [
      "Giá xe Hyundai Accent",
      "Giá xe Hyundai Creta",
      "Giá xe i10",
      "Giá xe Ford Everest",
    ],
    [
      "Giá xe Ford Ranger",
      "Giá xe Ford Territory",
      "Giá xe Xpander",
      "Giá xe Xforce",
    ],
    [
      "Giá xe Kia Sonet",
      "Giá xe Kia Morning",
      "Giá xe Kia Carens",
      "Giá xe Kia Carnival",
    ],
    ["Giá xe Vision", "Giá xe SH", "Giá xe SH Mode", "Giá xe Vario"],
    ["Giá xe Future", "Giá xe Wave", "Giá xe Lead", "Giá xe Vespa"],
    ["Giá xe Air Blade", "Giá xe Sirius", "Giá xe Exciter", "Giá xe Grande"],
    ["Vinfast Evo 200", "Vinfast Motio", "Vinfast Klara S", "Vinfast Theon S"],
    ["Dat Bike Quantum", "Honda Icon e", "Yadea i8", "Yadea XBull"],
  ];

  return (
    <div className="home-page">
      {/* Hero Section with Search */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">EcoXe - Mua bán xe cũ uy tín</h1>
          <p className="hero-subtitle">
            Hơn 75,000+ tin đăng xe ô tô, xe máy, xe điện trên toàn quốc
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <div className="container">
          <h2 className="section-title">Danh mục phổ biến</h2>
          {!isAuthenticated && (
            <div className="auth-notice">
              <p>
                🔒 Vui lòng{" "}
                <span
                  onClick={() => navigate("/login")}
                  style={{
                    color: "#007bff",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  đăng nhập
                </span>{" "}
                để sử dụng các chức năng
              </p>
            </div>
          )}
          {isAuthenticated && user && (
            <div className="user-welcome">
              <p>
                👋 Chào mừng <strong>{user.name}</strong>! Khám phá các danh mục
                dưới đây:
              </p>
            </div>
          )}
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`category-item ${
                  !isAuthenticated ? "disabled" : ""
                }`}
                style={{ "--category-color": category.color }}
                onClick={() => handleCategoryClick(category.page)}
                title={!isAuthenticated ? "Vui lòng đăng nhập để sử dụng" : ""}
              >
                <div className="category-icon">
                  <span className="icon-emoji">
                    {getCategoryIcon(category.icon)}
                  </span>
                </div>
                <div className="category-label">{category.label}</div>
                {!isAuthenticated && <div className="lock-overlay">🔒</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Listings Section */}
      <div className="listings-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Tin đăng mới nhất</h2>
            <a href="#" className="view-all-link">
              Xem tất cả →
            </a>
          </div>
          <div className="listings-grid">
            {loading ? (
              // Loading state
              <div className="loading-state">
                <p>Đang tải tin đăng...</p>
              </div>
            ) : latestListings.length === 0 ? (
              // Empty state
              <div className="empty-state">
                <p>
                  Chưa có tin đăng nào. Hãy{" "}
                  <a href="/post" style={{ color: "#007bff" }}>
                    đăng tin đầu tiên
                  </a>{" "}
                  của bạn!
                </p>
              </div>
            ) : (
              latestListings.map((listing) => (
                <div
                  key={listing.id}
                  className={`listing-card ${
                    !isAuthenticated ? "disabled" : ""
                  }`}
                  onClick={() => handleProductClick(listing)}
                  style={{ cursor: isAuthenticated ? "pointer" : "default" }}
                >
                  <div className="listing-image">
                    <div className="image-placeholder">
                      <img src={listing.image} alt={listing.title} />
                      {/* <img src="/api/placeholder/300/200" alt={listing.title} /> */}
                      {/* COMMENTED: Changed to use listing.image to avoid API calls */}
                    </div>
                    <button
                      className={`favorite-btn ${
                        isSaved(listing.id) ? "saved" : ""
                      } ${!isAuthenticated ? "disabled" : ""}`}
                      onClick={(e) => handleToggleSaved(e, listing)}
                      title={
                        !isAuthenticated
                          ? "Vui lòng đăng nhập để lưu tin"
                          : isSaved(listing.id)
                          ? "Bỏ lưu"
                          : "Lưu tin"
                      }
                      type="button"
                      disabled={!isAuthenticated}
                    >
                      <HeartIcon />
                    </button>
                    {!isAuthenticated && (
                      <div className="lock-overlay-card">🔒</div>
                    )}
                    {listing.badge && (
                      <div className="badge">{listing.badge}</div>
                    )}
                    <div className="image-info">
                      <span className="time-posted">{listing.timePosted}</span>
                      <div className="media-count">
                        <span className="count">
                          <ImageIcon />
                          {listing.images}
                        </span>
                        {listing.videoCount && (
                          <span className="count">
                            <VideoIcon />
                            {listing.videoCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="listing-content">
                    <h3 className="listing-title">{listing.title}</h3>
                    <div className="listing-specs">
                      <span className="spec-item">{listing.year}</span>
                      {listing.km && (
                        <span className="spec-item">{listing.km}</span>
                      )}
                      <span className="spec-item">{listing.transmission}</span>
                      <span className="spec-item">{listing.condition}</span>
                    </div>
                    <div className="listing-footer">
                      <div className="listing-price">
                        {formatPrice(listing.price)}
                      </div>
                      <div className="listing-location">
                        <LocationIcon />
                        {listing.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="view-more-btn">
            Xem thêm 75,347 tin đăng
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Articles Section */}
      <div className="articles-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Bài viết mới</h2>
          </div>
          {articlesLoading ? (
            <div className="loading-state">
              <p>Đang tải bài viết...</p>
            </div>
          ) : articlesError ? (
            <div className="empty-state">
              <p>{articlesError}</p>
            </div>
          ) : (
            <div className="articles-grid">
              {articles.slice(0, 6).map((a) => (
                <div key={a.id || a.articleId} className="article-card">
                  <h3 className="article-title">
                    {a.title || a.name || "Bài viết"}
                  </h3>
                  {a.summary && <p className="article-summary">{a.summary}</p>}
                </div>
              ))}
              {articles.length === 0 && (
                <div className="empty-state">
                  <p>Chưa có bài viết.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="activities-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Đánh giá và phản hồi từ người bán/mua
            </h2>
            <a href="#" className="view-all-link">
              Xem tất cả →
            </a>
          </div>
          <div className="activities-grid">
            {customerReviews.map((review) => (
              <div key={review.id} className="activity-card">
                <div className="activity-header">
                  <div className="store-info">
                    <div className="store-avatar">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="store-details">
                      <div className="store-name">
                        {review.userName}
                        {review.verified && (
                          <span className="verified">
                            <VerifiedIcon />
                          </span>
                        )}
                      </div>
                      <div className="activity-meta">
                        {review.timePosted} • {review.type}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="activity-content">
                  <div className="rating">
                    {[...Array(5)].map((_, idx) => (
                      <span
                        key={idx}
                        className={idx < review.rating ? "star filled" : "star"}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p>{review.comment}</p>
                  {review.productName && (
                    <div className="product-tag">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
                      </svg>
                      {review.productName}
                    </div>
                  )}
                </div>
                <div className="activity-footer">
                  <button className="action-btn">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    Hữu ích ({review.helpful})
                  </button>
                  <button className="action-btn">
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
                    Trả lời
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="view-more-btn">
            Xem thêm đánh giá
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="about-section">
        <div className="container">
          <h2 className="section-title">
            EcoXe - Chuyên trang mua bán xe trực tuyến hàng đầu Việt Nam
          </h2>
          <div className="about-content">
            <p>
              Ra mắt năm 2017 với khởi điểm là chuyên trang mua bán xe cũ trực
              tuyến, EcoXe đã phát triển thành nền tảng giao dịch xe hàng đầu
              tại Việt Nam với thông tin minh bạch, quy trình đăng tin đơn giản
              và khả năng tìm xe nhanh chóng, đúng nhu cầu. EcoXe có hơn 14
              triệu lượt truy cập mỗi tháng với đa dạng mọi loại xe ô tô, xe
              máy, xe điện, xe tải, xe đạp, phụ tùng và nhiều loại phương tiện
              khác, đáp ứng nhu cầu mua bán xe của người dùng.
            </p>

            <ul className="vehicle-types">
              <li>
                <strong>Xe ô tô:</strong> Trên EcoXe, tin đăng xe ô tô rất đa
                dạng và ngày càng tăng trưởng về số lượng và chất lượng. Người
                dùng dễ dàng tìm thấy mẫu xe ứng ý từ tất cả các hãng nổi tiếng
                như Toyota, Kia, Ford, Hyundai, Mazda, Mitsubishi... Các mẫu xe
                gầm cao như SUV, CUV, xe MPV ngày càng thông trị thị trường ô tô
                Việt Nam. Xu hướng mua bán ô tô điện hay hybrid cũng là một
                hướng tiêu dùng nổi bật đáng chú ý trong những năm gần đây.
              </li>
              <li>
                <strong>Xe máy:</strong> Thị trường xe máy tại Việt Nam đang
                phát triển mạnh mẽ với sự đa dạng về mẫu mã, phân khúc và thương
                hiệu, đáp ứng nhu cầu di chuyển ngày càng cao của người tiêu
                dùng...
              </li>
              <li>
                <strong>Xe tải - xe ben:</strong> Hoạt động mua bán xe tải ngày
                càng phát triển mạnh mẽ...
              </li>
              <li>
                <strong>Xe đạp:</strong> Thị trường xe đạp tại Việt Nam hiện
                đang rất sôi động...
              </li>
              <li>
                <strong>Xe điện:</strong> Trong năm 2024, thị trường xe điện
                cũng đang có sự tăng trưởng mạnh mẽ...
              </li>
            </ul>

            <p>
              Lựa chọn xe cũ ngày càng được người tiêu dùng ưu tiên lựa chọn. Xe
              cũ giúp tiết kiệm chi phí ban đầu, giảm khấu hao và mở ra cơ hội
              sở hữu phương tiện cao cấp hơn trong cùng tầm giá.
            </p>

            <button className="toggle-btn">Thu gọn</button>
          </div>
        </div>
      </div>

      {/* Popular Keywords Section */}
      <div className="keywords-section">
        <div className="container">
          <h2 className="section-title">Các từ khóa phổ biến</h2>
          <div className="keywords-grid">
            {popularKeywords.map((row, rowIndex) => (
              <div key={rowIndex} className="keywords-row">
                {row.map((keyword, colIndex) => (
                  <a key={colIndex} href="#" className="keyword-link">
                    {keyword}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
