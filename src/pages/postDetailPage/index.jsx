import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./index.scss";

// Icons
const BackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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

const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Lấy dữ liệu từ sessionStorage
    const postData = sessionStorage.getItem("viewingPost");
    if (postData) {
      const raw = JSON.parse(postData);
      setPost({
        ...raw,
        // Chuẩn hóa id và loại bài đăng để sử dụng lại khi chỉnh sửa / gọi API
        id: raw.articleId || raw.id,
        articleType: raw.articleType || raw.category || "",
        title: raw.title || raw.content || "",
        price: raw.price || 0,
        location:
          typeof raw.location === "string"
            ? raw.location
            : raw.location?.address || raw.region || "",
        description: raw.description || raw.content || "",
        category: raw.category || raw.articleType || "",
        status: raw.status || "",
        images: Array.isArray(raw.images)
          ? raw.images.map((img) => img.url || img)
          : raw.mainImageUrl
          ? [raw.mainImageUrl]
          : [],
        views: raw.views || 0,
        likes: raw.saves || 0,
        postedDate: raw.publicDate || raw.createAt || raw.createdAt || "",
        updatedAt: raw.updateAt || raw.updatedAt || "",
        contactName: raw.contactName || raw.sellerName || raw.memberName || "",
        contactPhone: raw.contactPhone || raw.sellerPhone || raw.phone || "",
        // Mapping cho bài đăng pin
        brand: raw.brand || "",
        year: raw.year || "",
        origin: raw.origin || "",
        capacity: raw.capacity || "",
        volt: raw.volt || "",
        size: raw.size || "",
        weight: raw.weight || "",
        warrantyMonths: raw.warrantyMonths || "",
      });
    } else {
      // Nếu không có data trong sessionStorage, redirect về trang my-posts
      navigate("/my-posts");
    }
  }, [id, navigate]);

  const getCategoryName = (category) => {
    const categoryNames = {
      car: "Ô tô điện",
      electric: "Xe máy điện",
      battery: "Pin xe điện",
    };
    return categoryNames[category] || "Khác";
  };

  const getConditionName = (condition) => {
    return condition || "Không xác định";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleEdit = () => {
    if (!post) return;

    // Lấy id thực của bài viết từ articleId hoặc id
    const articleId = post.articleId || post.id;
    // Chuẩn hóa category theo articleType để form edit hiểu đúng loại bài đăng
    const category = post.articleType || post.category || "";

    const editingData = {
      ...post,
      id: articleId,
      category,
    };

    sessionStorage.setItem("editingPost", JSON.stringify(editingData));
    navigate("/post?mode=edit&id=" + articleId);
  };

  const handleBack = () => {
    navigate("/my-posts");
  };

  const nextImage = () => {
    if (post?.images && currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  if (!post) {
    return (
      <div className="post-detail-page">
        <div className="container">
          <div className="loading">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <div className="container">
        <div className="page-header">
          <button className="btn btn-outline" onClick={handleBack}>
            <BackIcon />
            Quay lại
          </button>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={handleEdit}>
              <EditIcon />
              Chỉnh sửa
            </button>
          </div>
        </div>

        <div className="post-content">
          <div className="post-images">
            {post.images && post.images.length > 0 ? (
              <div className="image-gallery">
                <div className="main-image">
                  <img
                    src={post.images[currentImageIndex]}
                    alt={post.title}
                    onError={(e) => {
                      e.target.src = "/api/placeholder/600/400";
                    }}
                  />
                  {post.images.length > 1 && (
                    <>
                      <button
                        className="nav-btn prev"
                        onClick={prevImage}
                        disabled={currentImageIndex === 0}
                      >
                        ‹
                      </button>
                      <button
                        className="nav-btn next"
                        onClick={nextImage}
                        disabled={currentImageIndex === post.images.length - 1}
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
                {post.images.length > 1 && (
                  <div className="image-thumbnails">
                    {post.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${post.title} ${index + 1}`}
                        className={index === currentImageIndex ? "active" : ""}
                        onClick={() => setCurrentImageIndex(index)}
                        onError={(e) => {
                          e.target.src = "/api/placeholder/100/80";
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="no-image">
                <img src="/api/placeholder/600/400" alt="Không có hình ảnh" />
              </div>
            )}
          </div>

          <div className="post-info">
            <div className="post-header">
              <h1>{post.title}</h1>
              <div className="price">{formatPrice(post.price)}</div>
            </div>

            <div className="post-meta">
              <div className="meta-item">
                <LocationIcon />
                <span>
                  {typeof post.location === "string"
                    ? post.location
                    : `${post.location?.district || ""}${
                        post.location?.city ? ", " + post.location.city : ""
                      }`}
                </span>
              </div>
              <div className="meta-item">
                <ClockIcon />
                <span>Đăng ngày {formatDate(post.postedDate)}</span>
              </div>
              <div className="meta-item">
                <span>Lượt xem: {post.views}</span>
              </div>
              <div className="meta-item">
                <span>Lượt thích: {post.likes}</span>
              </div>
              <div className="meta-item">
                <span>Trạng thái: {post.status}</span>
              </div>
            </div>

            <div className="post-details">
              <h2>Thông tin chi tiết</h2>
              <div className="details-grid">
                {/* Các trường đặc biệt, chỉ hiển thị nếu có dữ liệu */}
                {post.origin && (
                  <div className="detail-item">
                    <span className="label">Xuất xứ:</span>
                    <span className="value">{post.origin}</span>
                  </div>
                )}
                {post.volt && (
                  <div className="detail-item">
                    <span className="label">Hiệu điện thế (Volt):</span>
                    <span className="value">{post.volt}</span>
                  </div>
                )}
                {post.brand && (
                  <div className="detail-item">
                    <span className="label">Hãng Pin/Hãng Xe:</span>
                    <span className="value">{post.brand}</span>
                  </div>
                )}
                {post.size && (
                  <div className="detail-item">
                    <span className="label">Kích thước (cm):</span>
                    <span className="value">{post.size}</span>
                  </div>
                )}
                {post.seats && (
                  <div className="detail-item">
                    <span className="label">Số chỗ ngồi:</span>
                    <span className="value">{post.seats}</span>
                  </div>
                )}
                {/* Hiển thị tất cả các trường có trong object bài đăng */}
                <div className="detail-item">
                  <span className="label">Loại bài đăng:</span>
                  <span className="value">{post.articleType}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Giá:</span>
                  <span className="value">{post.price}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Vị trí:</span>
                  <span className="value">{post.location}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Trạng thái:</span>
                  <span className="value">{post.status}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Ngày đăng:</span>
                  <span className="value">{post.publicDate}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Ngày cập nhật:</span>
                  <span className="value">
                    {post.updateAt
                      ? new Date(post.updateAt).toLocaleDateString("vi-VN")
                      : ""}
                  </span>
                </div>
                {/* Nếu có images thì hiển thị số lượng ảnh */}
                {post.images && (
                  <div className="detail-item">
                    <span className="label">Số lượng ảnh:</span>
                    <span className="value">
                      {Array.isArray(post.images) ? post.images.length : 0}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="post-description">
              <h2>Mô tả</h2>
              <p>{post.description}</p>
              {/* Nếu có content mà không có description thì hiển thị content */}
              {!post.description && post.content && <p>{post.content}</p>}
            </div>

            <div className="contact-info">
              <h2>Thông tin liên hệ</h2>
              <div className="contact-details">
                {post.contactName && (
                  <div className="contact-item">
                    <span className="label">Tên người bán:</span>
                    <span className="value">{post.contactName}</span>
                  </div>
                )}
                {post.contactPhone && (
                  <div className="contact-item">
                    <span className="label">Số điện thoại:</span>
                    <span className="value">{post.contactPhone}</span>
                  </div>
                )}
                {/* Địa chỉ: nếu là object location thì hiển thị các trường, nếu là string thì hiển thị luôn */}
                {(typeof post.location === "string" && post.location) ||
                post.location?.address ||
                post.location?.ward ||
                post.location?.district ||
                post.location?.city ? (
                  <div className="contact-item">
                    <span className="label">Địa chỉ:</span>
                    <span className="value">
                      {typeof post.location === "string"
                        ? post.location
                        : `${
                            post.location?.address
                              ? post.location.address + ", "
                              : ""
                          }${
                            post.location?.ward ? post.location.ward + ", " : ""
                          }${
                            post.location?.district
                              ? post.location.district + ", "
                              : ""
                          }${post.location?.city || ""}`}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;
