import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";
import "./index.scss";
import { toast } from "react-toastify";

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    location: "",
    description: "",
    brand: "",
    year: "",
    origin: "",
    mileage: "",
    seats: "",
    model: "",
    licensesPlate: "",
    registrationDeadline: "",
    vehicleCapacity: "",
    volt: "",
    capacity: "",
    size: "",
    weight: "",
    warrantyMonths: "",
  });

  useEffect(() => {
    // Lấy dữ liệu từ sessionStorage
    const postData = sessionStorage.getItem("viewingPost");
    if (postData) {
      const raw = JSON.parse(postData);
      console.log("RAW VIEWING POST:", raw);

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
        contactPhone:
          raw.contactPhone ||
          raw.sellerPhone ||
          raw.phone ||
          raw.phoneNumber ||
          raw.memberPhone ||
          "",
        // Tình trạng chung
        condition: raw.condition || "",
        // Mapping cho bài đăng pin
        brand: raw.brand || "",
        year: raw.year || "",
        origin: raw.origin || "",
        capacity: raw.capacity || "",
        volt: raw.volt || "",
        size: raw.size || "",
        weight: raw.weight || "",
        warrantyMonths: raw.warrantyMonths || "",
        // Mapping thêm cho bài đăng xe
        seats: raw.seats || raw.numberOfSeat || "",
        model: raw.model || "",
        mileage: raw.mileage || raw.milesTraveled || "",
        licensesPlate: raw.licensesPlate || "",
        registrationDeadline: raw.registrationDeadline || "",
        vehicleCapacity: raw.vehicleCapacity || "",
        warrantyPeriodMonths: raw.warrantyPeriodMonths || "",
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

    const locationValue =
      typeof post.location === "string"
        ? post.location
        : post.location?.address || "";

    setEditForm({
      title: post.title || "",
      price:
        post.price !== undefined && post.price !== null
          ? String(post.price)
          : "",
      location: locationValue,
      description: post.description || post.content || "",
      brand: post.brand || "",
      year: post.year || "",
      origin: post.origin || "",
      mileage: post.mileage || post.milesTraveled || "",
      seats: post.seats || post.numberOfSeat || "",
      model: post.model || "",
      licensesPlate: post.licensesPlate || "",
      registrationDeadline: post.registrationDeadline || "",
      vehicleCapacity: post.vehicleCapacity || "",
      volt: post.volt || "",
      capacity: post.capacity || "",
      size: post.size || "",
      weight: post.weight || "",
      warrantyMonths: post.warrantyMonths || post.warrantyPeriodMonths || "",
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdatePost = async () => {
    if (!post) return;
    try {
      const data = post;
      const id = data.articleId || data.id;
      const type = data.category || data.articleType;
      const user = JSON.parse(localStorage.getItem("user"));

      let endpoint = "";
      let payload = {};

      if (type === "car" || type === "CAR_ARTICLE") {
        endpoint = `/article/car/${id}`;

        let regDate = "";
        if (typeof editForm.registrationDeadline === "string") {
          const ddmmyyyy = editForm.registrationDeadline.match(
            /^(\d{2})\/(\d{2})\/(\d{4})$/
          );
          const yyyymmdd = editForm.registrationDeadline.match(
            /^(\d{4})-(\d{2})-(\d{2})$/
          );
          if (ddmmyyyy) {
            regDate = editForm.registrationDeadline;
          } else if (yyyymmdd) {
            const [, yyyy, mm, dd] = yyyymmdd;
            regDate = `${dd}/${mm}/${yyyy}`;
          }
        } else if (typeof data.registrationDeadline === "string") {
          regDate = data.registrationDeadline;
        }

        payload = {
          title: editForm.title || data.title || "",
          content: editForm.description || data.content || "",
          location: editForm.location || data.location || data.region || "",
          articleType: "CAR_ARTICLE",
          publicDate: data.publicDate,
          memberId: data.memberId || (user ? user.memberId : ""),
          price: editForm.price ? parseFloat(editForm.price) : data.price || 0,
          status: data.status,
          contactPhone: data.contactPhone || "",
          brand: editForm.brand || data.brand || "",
          model: editForm.model || data.model || "",
          year: editForm.year
            ? parseInt(editForm.year)
            : data.year || new Date().getFullYear(),
          origin: editForm.origin || data.origin || "",
          type: editForm.model || data.type || "",
          numberOfSeat: editForm.seats
            ? parseInt(editForm.seats)
            : data.numberOfSeat || 4,
          licensesPlate: editForm.licensesPlate || data.licensesPlate || "",
          registrationDeadline: regDate,
          milesTraveled: editForm.mileage
            ? parseInt(editForm.mileage)
            : data.milesTraveled || 0,
          warrantyPeriodMonths: editForm.warrantyMonths
            ? parseInt(editForm.warrantyMonths)
            : data.warrantyPeriodMonths || 12,
        };
      } else if (type === "battery" || type === "BATTERY_ARTICLE") {
        endpoint = `/article/battery/${id}`;

        payload = {
          title: editForm.title || data.title || "",
          content: editForm.description || data.content || "",
          location: editForm.location || data.location || data.region || "",
          articleType: "BATTERY_ARTICLE",
          publicDate: data.publicDate,
          memberId: data.memberId || (user ? user.memberId : ""),
          price: editForm.price ? parseFloat(editForm.price) : data.price || 0,
          status: data.status,
          contactPhone: data.contactPhone || "",
          volt: editForm.volt ? parseFloat(editForm.volt) : data.volt || 0,
          capacity: editForm.capacity
            ? parseFloat(editForm.capacity)
            : data.capacity || 0,
          size: editForm.size ? parseFloat(editForm.size) : data.size || 0,
          weight: editForm.weight
            ? parseFloat(editForm.weight)
            : data.weight || 0,
          brand: editForm.brand || data.brand || "",
          origin: editForm.origin || data.origin || "",
          warrantyMonths: editForm.warrantyMonths
            ? parseInt(editForm.warrantyMonths)
            : data.warrantyMonths || 1,
        };
      } else {
        // Mặc định: MOTOR_ARTICLE
        endpoint = `/article/motor/${id}`;

        payload = {
          title: editForm.title || data.title || "",
          content: editForm.description || data.content || "",
          location: editForm.location || data.location || data.region || "",
          articleType: "MOTOR_ARTICLE",
          publicDate: data.publicDate,
          memberId: data.memberId || (user ? user.memberId : ""),
          price: editForm.price ? parseFloat(editForm.price) : data.price || 0,
          status: data.status,
          contactPhone: data.contactPhone || "",
          brand: editForm.brand || data.brand || "",
          year: editForm.year
            ? parseInt(editForm.year)
            : data.year || new Date().getFullYear(),
          vehicleCapacity: editForm.vehicleCapacity
            ? parseFloat(editForm.vehicleCapacity)
            : data.vehicleCapacity || 1,
          licensesPlate:
            editForm.licensesPlate || data.licensesPlate || "string",
          origin: editForm.origin || data.origin || "",
          milesTraveled: editForm.mileage
            ? parseFloat(editForm.mileage)
            : data.milesTraveled || 0,
          warrantyMonths: editForm.warrantyMonths
            ? parseInt(editForm.warrantyMonths)
            : data.warrantyMonths || 1,
        };
      }

      await api.put(endpoint, payload);

      setPost((prev) =>
        prev
          ? {
              ...prev,
              title: payload.title,
              price: payload.price,
              location: payload.location,
              description: payload.content,
              brand: payload.brand ?? prev.brand,
              year: payload.year ?? prev.year,
              origin: payload.origin ?? prev.origin,
              volt: payload.volt ?? prev.volt,
              capacity: payload.capacity ?? prev.capacity,
              size: payload.size ?? prev.size,
              weight: payload.weight ?? prev.weight,
              warrantyMonths:
                payload.warrantyMonths ??
                payload.warrantyPeriodMonths ??
                prev.warrantyMonths,
              seats: payload.numberOfSeat ?? prev.seats,
            }
          : prev
      );

      setShowEditModal(false);
      alert("Cập nhật bài đăng thành công!");
    } catch (err) {
      console.error(err);
      console.log(err.response);
      toast.alert("Có lỗi xảy ra khi cập nhật bài đăng!");
    }
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
                {post.brand && (
                  <div className="detail-item">
                    <span className="label">Hãng Pin/Hãng Xe:</span>
                    <span className="value">{post.brand}</span>
                  </div>
                )}
                {post.year && (
                  <div className="detail-item">
                    <span className="label">Năm sản xuất:</span>
                    <span className="value">{post.year}</span>
                  </div>
                )}
                {post.model && (
                  <div className="detail-item">
                    <span className="label">Model:</span>
                    <span className="value">{post.model}</span>
                  </div>
                )}
                {post.seats && (
                  <div className="detail-item">
                    <span className="label">Số chỗ ngồi:</span>
                    <span className="value">{post.seats}</span>
                  </div>
                )}
                {post.licensesPlate && (
                  <div className="detail-item">
                    <span className="label">Biển số:</span>
                    <span className="value">{post.licensesPlate}</span>
                  </div>
                )}
                {post.registrationDeadline && (
                  <div className="detail-item">
                    <span className="label">Hạn đăng kiểm:</span>
                    <span className="value">{post.registrationDeadline}</span>
                  </div>
                )}
                {(post.mileage || post.milesTraveled) && (
                  <div className="detail-item">
                    <span className="label">Số km đã đi:</span>
                    <span className="value">
                      {post.mileage || post.milesTraveled}
                    </span>
                  </div>
                )}
                {post.vehicleCapacity && (
                  <div className="detail-item">
                    <span className="label">Dung tích xe (kW):</span>
                    <span className="value">{post.vehicleCapacity}</span>
                  </div>
                )}
                {post.volt && (
                  <div className="detail-item">
                    <span className="label">Hiệu điện thế (Volt):</span>
                    <span className="value">{post.volt}</span>
                  </div>
                )}
                {post.capacity && (
                  <div className="detail-item">
                    <span className="label">Công suất (Ah/kWh):</span>
                    <span className="value">{post.capacity}</span>
                  </div>
                )}
                {post.size && (
                  <div className="detail-item">
                    <span className="label">Kích thước:</span>
                    <span className="value">{post.size}</span>
                  </div>
                )}
                {post.weight && (
                  <div className="detail-item">
                    <span className="label">Trọng lượng:</span>
                    <span className="value">{post.weight}</span>
                  </div>
                )}
                {(post.warrantyMonths || post.warrantyPeriodMonths) && (
                  <div className="detail-item">
                    <span className="label">Bảo hành (tháng):</span>
                    <span className="value">
                      {post.warrantyMonths || post.warrantyPeriodMonths}
                    </span>
                  </div>
                )}
                {post.condition && (
                  <div className="detail-item">
                    <span className="label">Tình trạng:</span>
                    <span className="value">
                      {getConditionName(post.condition)}
                    </span>
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
        {showEditModal && (
          <div className="edit-modal-overlay">
            <div className="edit-modal">
              <div className="modal-header">
                <h2>Chỉnh sửa tin đăng</h2>
                <button
                  className="modal-close-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tiêu đề</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      handleEditFormChange("title", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Giá</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) =>
                      handleEditFormChange("price", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Vị trí</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) =>
                      handleEditFormChange("location", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    rows="4"
                    value={editForm.description}
                    onChange={(e) =>
                      handleEditFormChange("description", e.target.value)
                    }
                  />
                </div>
                {(post.articleType === "CAR_ARTICLE" ||
                  post.category === "car" ||
                  post.articleType === "car") && (
                  <>
                    <div className="form-group">
                      <label>Hãng xe</label>
                      <input
                        type="text"
                        value={editForm.brand}
                        onChange={(e) =>
                          handleEditFormChange("brand", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Năm sản xuất</label>
                      <input
                        type="number"
                        value={editForm.year}
                        onChange={(e) =>
                          handleEditFormChange("year", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Model</label>
                      <input
                        type="text"
                        value={editForm.model}
                        onChange={(e) =>
                          handleEditFormChange("model", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Số chỗ ngồi</label>
                      <input
                        type="number"
                        value={editForm.seats}
                        onChange={(e) =>
                          handleEditFormChange("seats", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Biển số</label>
                      <input
                        type="text"
                        value={editForm.licensesPlate}
                        onChange={(e) =>
                          handleEditFormChange("licensesPlate", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Hạn đăng kiểm (dd/MM/yyyy)</label>
                      <input
                        type="text"
                        value={editForm.registrationDeadline}
                        onChange={(e) =>
                          handleEditFormChange(
                            "registrationDeadline",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Số km đã đi</label>
                      <input
                        type="number"
                        value={editForm.mileage}
                        onChange={(e) =>
                          handleEditFormChange("mileage", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Bảo hành (tháng)</label>
                      <input
                        type="number"
                        value={editForm.warrantyMonths}
                        onChange={(e) =>
                          handleEditFormChange("warrantyMonths", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
                {(post.articleType === "MOTOR_ARTICLE" ||
                  post.category === "electric" ||
                  post.articleType === "motor") && (
                  <>
                    <div className="form-group">
                      <label>Hãng xe</label>
                      <input
                        type="text"
                        value={editForm.brand}
                        onChange={(e) =>
                          handleEditFormChange("brand", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Năm sản xuất</label>
                      <input
                        type="number"
                        value={editForm.year}
                        onChange={(e) =>
                          handleEditFormChange("year", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Dung tích xe (kW)</label>
                      <input
                        type="number"
                        value={editForm.vehicleCapacity}
                        onChange={(e) =>
                          handleEditFormChange(
                            "vehicleCapacity",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Biển số</label>
                      <input
                        type="text"
                        value={editForm.licensesPlate}
                        onChange={(e) =>
                          handleEditFormChange("licensesPlate", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Số km đã đi</label>
                      <input
                        type="number"
                        value={editForm.mileage}
                        onChange={(e) =>
                          handleEditFormChange("mileage", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Bảo hành (tháng)</label>
                      <input
                        type="number"
                        value={editForm.warrantyMonths}
                        onChange={(e) =>
                          handleEditFormChange("warrantyMonths", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
                {(post.articleType === "BATTERY_ARTICLE" ||
                  post.category === "battery") && (
                  <>
                    <div className="form-group">
                      <label>Hãng pin</label>
                      <input
                        type="text"
                        value={editForm.brand}
                        onChange={(e) =>
                          handleEditFormChange("brand", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Xuất xứ</label>
                      <input
                        type="text"
                        value={editForm.origin}
                        onChange={(e) =>
                          handleEditFormChange("origin", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Hiệu điện thế (Volt)</label>
                      <input
                        type="number"
                        value={editForm.volt}
                        onChange={(e) =>
                          handleEditFormChange("volt", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Công suất (Ah/kWh)</label>
                      <input
                        type="number"
                        value={editForm.capacity}
                        onChange={(e) =>
                          handleEditFormChange("capacity", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Kích thước</label>
                      <input
                        type="number"
                        value={editForm.size}
                        onChange={(e) =>
                          handleEditFormChange("size", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Trọng lượng</label>
                      <input
                        type="number"
                        value={editForm.weight}
                        onChange={(e) =>
                          handleEditFormChange("weight", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Bảo hành (tháng)</label>
                      <input
                        type="number"
                        value={editForm.warrantyMonths}
                        onChange={(e) =>
                          handleEditFormChange("warrantyMonths", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
                <button className="btn btn-primary" onClick={handleUpdatePost}>
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetailPage;
