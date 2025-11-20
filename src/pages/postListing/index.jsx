import { useState, useMemo, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import { productService } from "../../services/productService";
import api from "../../config/api";
import "./index.scss";

// Dữ liệu địa chỉ Việt Nam
const vietnamAddressData = {
  hanoi: {
    name: "Hà Nội",
    districts: {
      "ba-dinh": {
        name: "Ba Đình",
        wards: [
          "Phúc Xá",
          "Trúc Bạch",
          "Vĩnh Phúc",
          "Cống Vị",
          "Liễu Giai",
          "Nguyễn Trung Trực",
          "Quán Thánh",
          "Ngọc Hà",
          "Điện Biên",
          "Đội Cấn",
          "Ngọc Khánh",
          "Kim Mã",
          "Giảng Võ",
          "Thành Công",
        ],
      },
      "hoan-kiem": {
        name: "Hoàn Kiếm",
        wards: [
          "Phúc Tấn",
          "Đồng Xuân",
          "Hàng Mã",
          "Hàng Buồm",
          "Hàng Đào",
          "Hàng Bồ",
          "Cửa Đông",
          "Lý Thái Tổ",
          "Hàng Bạc",
          "Hàng Gai",
          "Chương Dương Độ",
          "Cửa Nam",
          "Hàng Trống",
          "Tràng Tiền",
          "Trần Hưng Đạo",
          "Phan Chu Trinh",
          "Hàng Bài",
          "Hàng Quạt",
        ],
      },
      "dong-da": {
        name: "Đống Đa",
        wards: [
          "Cát Linh",
          "Văn Miếu",
          "Quốc Tử Giám",
          "Láng Thượng",
          "Ô Chợ Dừa",
          "Văn Chương",
          "Hàng Bột",
          "Láng Hạ",
          "Khâm Thiên",
          "Thổ Quan",
          "Nam Đồng",
          "Trung Phụng",
          "Quang Trung",
          "Trung Liệt",
          "Phương Liên",
          "Thịnh Quang",
          "Trung Tự",
          "Kim Liên",
          "Phương Mai",
          "Ngã Tư Sở",
          "Khương Thượng",
        ],
      },
      "hai-ba-trung": {
        name: "Hai Bà Trưng",
        wards: [
          "Nguyễn Du",
          "Bạch Đằng",
          "Phạm Đình Hổ",
          "Lê Đại Hành",
          "Đồng Nhận",
          "Phố Huế",
          "Đống Mác",
          "Thanh Lương",
          "Thanh Nhàn",
          "Cầu Dền",
          "Bách Khoa",
          "Đồng Tâm",
          "Vĩnh Tuy",
          "Bạch Mai",
          "Quỳnh Mai",
          "Quỳnh Lôi",
          "Minh Khai",
          "Trương Định",
        ],
      },
      "cau-giay": {
        name: "Cầu Giấy",
        wards: [
          "Nghĩa Đô",
          "Nghĩa Tân",
          "Mai Dịch",
          "Dịch Vọng",
          "Dịch Vọng Hậu",
          "Quan Hoa",
          "Yên Hoà",
          "Trung Hoà",
        ],
      },
    },
  },
  hcm: {
    name: "TP. Hồ Chí Minh",
    districts: {
      "quan-1": {
        name: "Quận 1",
        wards: [
          "Tân Định",
          "Đa Kao",
          "Bến Nghé",
          "Bến Thành",
          "Nguyễn Thái Bình",
          "Phạm Ngũ Lão",
          "Cầu Ông Lãnh",
          "Cô Giang",
          "Nguyễn Cư Trinh",
          "Cầu Kho",
        ],
      },
      "quan-3": {
        name: "Quận 3",
        wards: [
          "Võ Thị Sáu",
          "Nguyễn Thị Minh Khai",
          "Phường 1",
          "Phường 2",
          "Phường 3",
          "Phường 4",
          "Phường 5",
          "Phường 6",
          "Phường 7",
          "Phường 8",
          "Phường 9",
          "Phường 10",
          "Phường 11",
          "Phường 12",
          "Phường 13",
          "Phường 14",
        ],
      },
      "quan-7": {
        name: "Quận 7",
        wards: [
          "Tân Thuận Đông",
          "Tân Thuận Tây",
          "Tân Kiểng",
          "Tân Hưng",
          "Bình Thuận",
          "Tân Quy",
          "Phú Thuận",
          "Tân Phú",
          "Tân Phong",
          "Phú Mỹ",
        ],
      },
      "binh-thanh": {
        name: "Bình Thạnh",
        wards: [
          "Phường 1",
          "Phường 2",
          "Phường 3",
          "Phường 5",
          "Phường 6",
          "Phường 7",
          "Phường 11",
          "Phường 12",
          "Phường 13",
          "Phường 14",
          "Phường 15",
          "Phường 17",
          "Phường 19",
          "Phường 21",
          "Phường 22",
          "Phường 24",
          "Phường 25",
          "Phường 26",
          "Phường 27",
          "Phường 28",
        ],
      },
      "thu-duc": {
        name: "Thủ Đức",
        wards: [
          "Linh Xuân",
          "Bình Chiểu",
          "Linh Trung",
          "Tam Bình",
          "Tam Phú",
          "Hiệp Bình Phước",
          "Hiệp Bình Chánh",
          "Linh Chiểu",
          "Linh Tây",
          "Linh Đông",
          "Bình Thọ",
          "Trường Thọ",
          "Long Bình",
          "Long Thạnh Mỹ",
          "Tân Phú",
          "Hiệp Phú",
          "Tăng Nhơn Phú A",
          "Tăng Nhơn Phú B",
          "Phước Long A",
          "Phước Long B",
          "Trường Thạnh",
          "Long Phước",
          "Long Trường",
          "Phước Bình",
          "Phú Hữu",
          "Thạnh Mỹ Lợi",
          "Thủ Thiêm",
        ],
      },
    },
  },
  danang: {
    name: "Đà Nẵng",
    districts: {
      "hai-chau": {
        name: "Hải Châu",
        wards: [
          "Thạch Thang",
          "Hải Châu I",
          "Hải Châu II",
          "Phước Ninh",
          "Hòa Thuận Tây",
          "Hòa Thuận Đông",
          "Nam Dương",
          "Bình Hiên",
          "Bình Thuận",
          "Hòa Cường Bắc",
          "Hòa Cường Nam",
          "Thanh Bình",
          "Thuận Phước",
        ],
      },
      "thanh-khe": {
        name: "Thanh Khê",
        wards: [
          "Tam Thuận",
          "Thanh Khê Tây",
          "Thanh Khê Đông",
          "Xuân Hà",
          "Tân Chính",
          "Chính Gian",
          "Vĩnh Trung",
          "Thạc Gián",
          "An Khê",
          "Hòa Khê",
        ],
      },
      "son-tra": {
        name: "Sơn Trà",
        wards: [
          "Thọ Quang",
          "Nại Hiên Đông",
          "Mân Thái",
          "An Hải Bắc",
          "Phước Mỹ",
          "An Hải Tây",
          "An Hải Đông",
        ],
      },
      "ngu-hanh-son": {
        name: "Ngũ Hành Sơn",
        wards: ["Mỹ An", "Khuê Mỹ", "Hoà Quý", "Hoà Hải"],
      },
      "lien-chieu": {
        name: "Liên Chiểu",
        wards: [
          "Hòa Hiệp Bắc",
          "Hòa Hiệp Nam",
          "Hòa Khánh Bắc",
          "Hòa Khánh Nam",
          "Hòa Minh",
        ],
      },
    },
  },
  cantho: {
    name: "Cần Thơ",
    districts: {
      "ninh-kieu": {
        name: "Ninh Kiều",
        wards: [
          "Cái Khế",
          "Thới Bình",
          "Xuân Khánh",
          "Hưng Lợi",
          "An Hòa",
          "Tân An",
          "An Nghiệp",
          "An Cư",
          "Hưng Thạnh",
          "An Khánh",
          "An Phú",
        ],
      },
      "binh-thuy": {
        name: "Bình Thủy",
        wards: [
          "Bình Thủy",
          "Trà An",
          "Trà Nóc",
          "Thới An Đông",
          "An Thới",
          "Bùi Hữu Nghĩa",
          "Long Hòa",
          "Long Tuyền",
        ],
      },
      "cai-rang": {
        name: "Cái Răng",
        wards: [
          "Lê Bình",
          "Hưng Phú",
          "Hưng Thạnh",
          "Ba Láng",
          "Thường Thạnh",
          "Phước Thới",
          "Tân Phú",
        ],
      },
      "o-mon": {
        name: "Ô Môn",
        wards: [
          "Châu Văn Liêm",
          "Thới Hòa",
          "Thới Long",
          "Thới An",
          "Phước Thạnh",
          "Trường Lạc",
          "Thới Thuận",
        ],
      },
    },
  },
  haiphong: {
    name: "Hải Phòng",
    districts: {
      "hong-bang": {
        name: "Hồng Bàng",
        wards: [
          "Quán Toan",
          "Hồng Bàng",
          "Sở Dầu",
          "Thượng Lý",
          "Hạ Lý",
          "Minh Khai",
          "Trại Cau",
          "Lạc Viên",
          "Lê Lợi",
          "Đông Khê",
          "Phan Bội Châu",
        ],
      },
      "ngo-quyen": {
        name: "Ngô Quyền",
        wards: [
          "Máy Chai",
          "Máy Tơ",
          "Lạch Tray",
          "Cầu Tre",
          "Đông Khê",
          "Cầu Đất",
          "Văn Đẩu",
          "Lê Lợi",
          "Đằng Giang",
          "Cát Dài",
        ],
      },
      "le-chan": {
        name: "Lê Chân",
        wards: [
          "Cát Dài",
          "An Biên",
          "Lam Sơn",
          "An Dương",
          "Trần Nguyên Hãn",
          "Niệm Nghĩa",
          "Dư Hàng",
          "Kênh Dương",
          "Cát Bi",
          "Đông Hải",
          "Hồ Nam",
        ],
      },
      "hai-an": {
        name: "Hải An",
        wards: [
          "Đông Hải 1",
          "Đông Hải 2",
          "Bắc Sơn",
          "Nam Sơn",
          "Ngọc Sơn",
          "Tràng Cát",
          "Tân Thành",
          "Thành Tô",
        ],
      },
    },
  },
  binhduong: {
    name: "Bình Dương",
    districts: {
      "thu-dau-mot": {
        name: "Thủ Dầu Một",
        wards: [
          "Phú Cường",
          "Phú Hòa",
          "Phú Thọ",
          "Chánh Nghĩa",
          "Định Hoà",
          "Hoà Phú",
          "Phú Lợi",
          "Phú Tân",
          "Tương Bình Hiệp",
          "Khánh Bình",
          "Tân An",
          "Hiệp An",
          "Tân Tiến",
          "Hòa Lợi",
          "Phú Mỹ",
        ],
      },
      "di-an": {
        name: "Dĩ An",
        wards: [
          "Dĩ An",
          "An Bình",
          "An Sơn",
          "Đông Hòa",
          "Tân Bình",
          "Tân Đông Hiệp",
          "Bình An",
          "Bình Thắng",
        ],
      },
      "thuan-an": {
        name: "Thuận An",
        wards: [
          "Lái Thiêu",
          "Bình Chuẩn",
          "Thuận Giao",
          "An Phú",
          "Hưng Định",
          "An Sơn",
          "Bình Hòa",
          "Việt Sing",
        ],
      },
      "ben-cat": {
        name: "Bến Cát",
        wards: [
          "Mỹ Phước",
          "Chánh Phú Hòa",
          "Uyên Hưng",
          "Tân Uyên",
          "Khánh Bình",
          "Phú An",
          "Tân Định",
        ],
      },
    },
  },
  dongnai: {
    name: "Đồng Nai",
    districts: {
      "bien-hoa": {
        name: "Biên Hòa",
        wards: [
          "Quyết Thắng",
          "Trảng Dài",
          "An Bình",
          "Hóa An",
          "Tân Phong",
          "Tân Biên",
          "Hố Nai",
          "Tân Hạnh",
          "Hiệp Hòa",
          "Bửu Long",
          "Tân Tiến",
          "Thống Nhất",
          "Tam Hiệp",
          "Tam Hòa",
          "Bình Đa",
          "An Hòa",
          "Hưng Chiến",
        ],
      },
      "long-thanh": {
        name: "Long Thành",
        wards: [
          "Long Thành",
          "An Phước",
          "Bình An",
          "Bình Sơn",
          "Cẩm Đường",
          "Long Đức",
          "Long Hưng",
          "Long Phước",
          "Phước Bình",
          "Tam An",
          "Tân Hiệp",
        ],
      },
      "nhon-trach": {
        name: "Nhơn Trạch",
        wards: [
          "Đại Phước",
          "Hiệp Phước",
          "Long Tân",
          "Phú Hữu",
          "Phú Hội",
          "Phước An",
          "Phước Khánh",
          "Phước Thiền",
          "Vĩnh Thanh",
        ],
      },
      "trang-bom": {
        name: "Trảng Bom",
        wards: [
          "Trảng Bom",
          "Bàu Hàm",
          "Bình Minh",
          "Đông Hòa",
          "Giang Điền",
          "Hàng Gòn",
          "Quảng Tiến",
          "Sông Thao",
          "Thanh Bình",
          "Thiện Tân",
        ],
      },
    },
  },
  vungtau: {
    name: "Vũng Tàu",
    districts: {
      "vung-tau": {
        name: "Vũng Tàu",
        wards: [
          "Thắng Tam",
          "Thắng Nhì",
          "Thắng Nhất",
          "Rạch Dừa",
          "Nguyễn An Ninh",
          "Bến Đà",
          "Phước Hưng",
          "Phước Hải",
          "Phước Trung",
          "Long Sơn",
          "Hạ Long",
          "Tân Thành",
          "Miền Tây",
        ],
      },
      "ba-ria": {
        name: "Bà Rịa",
        wards: [
          "Phước Hiệp",
          "Phước Nguyên",
          "Kim Dinh",
          "Phước Trung",
          "Long Toàn",
          "Long Tâm",
          "Hoà Long",
          "Tân Hưng",
          "Long Hương",
          "Phước Hưng",
        ],
      },
      "con-dao": {
        name: "Côn Đảo",
        wards: ["Côn Đảo"],
      },
    },
  },
};

const PostListing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [postingAccess, setPostingAccess] = useState({
    loading: true,
    allowed: false,
    remaining: 0,
    message: "",
  });
  const [agreeTerm, setAgreeTerm] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    price: "",
    negotiable: false,
    condition: "",
    brand: "",
    year: "",
    color: "",
    origin: "",
    region: "",
    // Common fields for vehicles
    mileage: "", // Quãng đường đã đi (km)
    batteryInfo: "", // Thông tin pin (%)
    // Car specific
    model: "",
    seats: "",
    licensesPlate: "",
    registrationDeadline: "",
    milesTraveled: "",
    warrantyPeriodMonths: "",
    // Battery specific
    batteryType: "",
    capacity: "",
    volt: "",
    size: "",
    weight: "",
    location: {
      city: "",
      district: "",
      ward: "",
      address: "",
    },
    contactName: "",
    contactPhone: "",
    images: [],
  });

  // State để theo dõi trạng thái điền form
  const [fieldStatus, setFieldStatus] = useState({});

  // Redux: current logged-in member
  const member = useSelector((store) => store.member);

  useEffect(() => {
    let cancelled = false;

    if (isEditMode) {
      setPostingAccess({
        loading: false,
        allowed: true,
        remaining: 0,
        message: "",
      });
      return () => {
        cancelled = true;
      };
    }

    if (!member?.memberId) {
      setPostingAccess({
        loading: false,
        allowed: false,
        remaining: 0,
        message: "Bạn cần đăng nhập và mua gói đăng tin để tiếp tục.",
      });
      return () => {
        cancelled = true;
      };
    }

    setPostingAccess((prev) => ({
      ...prev,
      loading: true,
    }));

    api
      .get(`/subscription/member/${member.memberId}`)
      .then((res) => {
        if (cancelled) return;
        const subs = res.data || [];
        const now = new Date();
        const activeSub = subs.find(
          (sub) =>
            sub.status === "ACTIVE" &&
            (!sub.endDate || new Date(sub.endDate) > now)
        );
        const remaining = activeSub?.remainingPosts ?? 0;
        if (activeSub && remaining > 0) {
          setPostingAccess({
            loading: false,
            allowed: true,
            remaining,
            message: "",
          });
        } else {
          setPostingAccess({
            loading: false,
            allowed: false,
            remaining: 0,
            message: activeSub
              ? "Bạn đã hết lượt đăng tin. Vui lòng mua gói để tiếp tục."
              : "Bạn chưa có gói đăng tin. Vui lòng mua gói để bắt đầu đăng tin.",
          });
        }
      })
      .catch(() => {
        if (cancelled) return;
        setPostingAccess({
          loading: false,
          allowed: false,
          remaining: 0,
          message: "Không thể kiểm tra quyền đăng tin. Vui lòng thử lại.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [member?.memberId, isEditMode]);

  // Function để kiểm tra field đã được điền đầy đủ chưa
  const checkFieldCompletion = useCallback(
    (fieldName, value) => {
      let isComplete = false;

      switch (fieldName) {
        case "title":
          isComplete = value && value.length >= 10;
          break;
        case "description":
          isComplete = value && value.length >= 10;
          break;
        case "price":
          isComplete = value && parseFloat(value) > 0;
          break;
        case "images":
          isComplete = value && value.length > 0;
          break;
        case "condition":
        case "brand":
        case "year":
        case "color":
        case "origin":
        case "category":
          isComplete = value && value !== "";
          break;
        case "mileage":
        case "batteryInfo":
          isComplete = value && value !== "";
          break;
        case "model":
        case "seats":
          isComplete =
            formData.category === "CAR_ARTICLE" ? value && value !== "" : true;
          break;
        case "volt":
        case "capacity":
          isComplete =
            formData.category === "BATTERY_ARTICLE"
              ? value && value !== ""
              : true;
          break;
        case "contactName":
          isComplete = value && value.length >= 2;
          break;
        case "contactPhone":
          isComplete = value && /^[0-9]{10}$/.test(value);
          break;
        case "location.city":
          isComplete = formData.location.city && formData.location.city !== "";
          break;
        case "location.district":
          isComplete =
            formData.location.district && formData.location.district !== "";
          break;
        case "location.ward":
          isComplete = formData.location.ward && formData.location.ward !== "";
          break;
        case "location.address":
          isComplete =
            formData.location.address && formData.location.address.length >= 10;
          break;
        default:
          isComplete = false;
      }

      setFieldStatus((prev) => ({
        ...prev,
        [fieldName]: isComplete,
      }));

      return isComplete;
    },
    [formData]
  );

  // Effect để cập nhật trạng thái field khi formData thay đổi
  useEffect(() => {
    // Kiểm tra tất cả các field quan trọng
    checkFieldCompletion("title", formData.title);
    checkFieldCompletion("description", formData.description);
    checkFieldCompletion("price", formData.price);
    checkFieldCompletion("images", formData.images);
    checkFieldCompletion("condition", formData.condition);
    checkFieldCompletion("brand", formData.brand);
    checkFieldCompletion("year", formData.year);
    checkFieldCompletion("color", formData.color);
    checkFieldCompletion("origin", formData.origin);
    checkFieldCompletion("category", formData.category);
    checkFieldCompletion("mileage", formData.mileage);
    checkFieldCompletion("batteryInfo", formData.batteryInfo);
    checkFieldCompletion("model", formData.model);
    checkFieldCompletion("seats", formData.seats);
    checkFieldCompletion("volt", formData.volt);
    checkFieldCompletion("capacity", formData.capacity);
    checkFieldCompletion("contactName", formData.contactName);
    checkFieldCompletion("contactPhone", formData.contactPhone);
    checkFieldCompletion("location.city", formData.location.city);
    checkFieldCompletion("location.district", formData.location.district);
    checkFieldCompletion("location.ward", formData.location.ward);
    checkFieldCompletion("location.address", formData.location.address);
  }, [formData, checkFieldCompletion]);

  const categories = [
    { id: "CAR_ARTICLE", name: "Ô tô", icon: "🚗" },
    { id: "MOTOR_ARTICLE", name: "Xe điện", icon: "🏍️" },
    { id: "BATTERY_ARTICLE", name: "Pin", icon: "🔋" },
  ];

  const carBrands = [
    "VinFast",
    "Toyota",
    "Honda",
    "Mazda",
    "Hyundai",
    "Kia",
    "Ford",
    "Mitsubishi",
    "Mercedes-Benz",
    "BMW",
    "Audi",
    "Lexus",
  ];
  const electricBrands = [
    "VinFast",
    "Yadea",
    "Pega",
    "DatBike",
    "Anbico",
    "Hkbike",
    "Vinfast",
  ];
  const batteryBrands = [
    "Panasonic",
    "Samsung",
    "LG",
    "CATL",
    "BYD",
    "GS Yuasa",
    "Bosch",
  ];
  const conditions = [
    "Mới",
    "Đã sử dụng (Còn mới)",
    "Đã sử dụng (Tốt)",
    "Đã sử dụng (Trung bình)",
  ];
  const bodyTypes = [
    "Sedan",
    "SUV",
    "Hatchback",
    "MPV",
    "Pickup",
    "Coupe",
    "Convertible",
  ];
  const seatOptions = ["2 chỗ", "4 chỗ", "5 chỗ", "7 chỗ", "9 chỗ", "16 chỗ"];
  const origins = ["Nhập khẩu", "Lắp ráp trong nước", "Sản xuất trong nước"];
  const regions = [
    "Hà Nội",
    "TP. Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
    "Khác",
  ];

  // Effect để load dữ liệu khi ở chế độ edit
  useEffect(() => {
    const mode = searchParams.get("mode");
    const postId = searchParams.get("id");

    if (mode === "edit" && postId) {
      setIsEditMode(true);
      const editingPostData = sessionStorage.getItem("editingPost");

      if (editingPostData) {
        const postData = JSON.parse(editingPostData);
        setFormData(postData);
        setStep(2); // Bắt đầu từ step 2 khi edit
      } else {
        // Nếu không có dữ liệu, redirect về my-posts
        navigate("/my-posts");
      }
    }
  }, [searchParams, navigate]);

  // Lấy danh sách quận/huyện theo tỉnh/thành phố được chọn
  const availableDistricts = useMemo(() => {
    if (!formData.location.city) return [];
    const cityData = vietnamAddressData[formData.location.city];
    return cityData
      ? Object.entries(cityData.districts).map(([key, value]) => ({
          id: key,
          name: value.name,
        }))
      : [];
  }, [formData.location.city]);

  // Lấy danh sách phường/xã theo quận/huyện được chọn
  const availableWards = useMemo(() => {
    if (!formData.location.city || !formData.location.district) return [];
    const cityData = vietnamAddressData[formData.location.city];
    const districtData = cityData?.districts[formData.location.district];
    return districtData ? districtData.wards : [];
  }, [formData.location.city, formData.location.district]);

  const handleInputChange = (field, value) => {
    if (field === "images") {
      console.log("Images updated:", value);
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationChange = (field, value) => {
    setFormData((prev) => {
      const newLocation = { ...prev.location, [field]: value };

      // Reset district và ward khi thay đổi city
      if (field === "city") {
        newLocation.district = "";
        newLocation.ward = "";
      }

      // Reset ward khi thay đổi district
      if (field === "district") {
        newLocation.ward = "";
      }

      return {
        ...prev,
        location: newLocation,
      };
    });
  };

  // Handler khi ImageUpload component thay đổi danh sách ảnh
  const handleImagesChange = (imageUrls) => {
    console.log("Images changed:", imageUrls);
    setFormData((prev) => ({
      ...prev,
      images: imageUrls,
    }));
  };

  const validateStep2 = () => {
    if (!formData.title || formData.title.length < 10) {
      alert("Tiêu đề phải có ít nhất 10 ký tự");
      return false;
    }
    if (!formData.description || formData.description.length < 10) {
      alert("Mô tả phải có ít nhất 10 ký tự");
      return false;
    }
    if (!formData.price) {
      alert("Vui lòng nhập giá");
      return false;
    }
    if (!formData.condition) {
      alert("Vui lòng chọn tình trạng");
      return false;
    }
    if (!formData.year) {
      alert("Vui lòng nhập năm sản xuất");
      return false;
    }
    if (!formData.brand) {
      alert("Vui lòng chọn hãng");
      return false;
    }
    if (!formData.origin) {
      alert("Vui lòng chọn xuất xứ");
      return false;
    }
    if (!formData.region) {
      alert("Vui lòng chọn khu vực");
      return false;
    }

    // Category specific validation
    if (formData.category === "CAR_ARTICLE") {
      if (!formData.model) {
        alert("Vui lòng chọn Model");
        return false;
      }
      if (!formData.seats) {
        alert("Vui lòng chọn số chỗ");
        return false;
      }
    }

    if (formData.category === "BATTERY_ARTICLE") {
      if (!formData.volt) {
        alert("Vui lòng nhập Volt");
        return false;
      }
      if (!formData.capacity) {
        alert("Vui lòng nhập công suất");
        return false;
      }
    }

    return true;
  };

  const validateStep3 = () => {
    if (formData.images.length === 0) {
      alert("Vui lòng thêm ít nhất 1 ảnh");
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (
      !formData.location.city ||
      !formData.location.district ||
      !formData.location.address
    ) {
      alert("Vui lòng điền đầy đủ địa chỉ");
      return false;
    }
    if (!formData.contactName) {
      alert("Vui lòng nhập tên người liên hệ");
      return false;
    }
    if (!formData.contactPhone || !/^[0-9]{10}$/.test(formData.contactPhone)) {
      alert("Vui lòng nhập số điện thoại hợp lệ (10 số)");
      return false;
    }
    if (!agreeTerm) {
      alert("Vui lòng đồng ý với Quy định đăng tin của EcoXe");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;

    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!validateStep4()) return;
    setIsSubmitting(true);
    try {
      let result;
      // Prefer Redux member; fallback to localStorage user if needed
      let memberId = member?.memberId ?? member?.id;
      if (!memberId) {
        try {
          const auth = JSON.parse(localStorage.getItem("user"));
          if (auth) {
            memberId = auth.memberId ?? auth.id;
          }
        } catch (e) {
          console.warn("Failed to parse user from localStorage", e);
        }
      }
      if (!memberId) {
        console.warn("memberId is missing from localStorage user payload.");
      }
      if (isEditMode) {
        result = await productService.updateProductWithImages(formData);
      } else {
        let pubDate = "";
        const now = new Date();
        // ISO yyyy-MM-dd
        pubDate = now.toISOString().slice(0, 10);

        if (formData.category === "BATTERY_ARTICLE") {
          // Format location chỉ lấy thành phố
          const payload = {
            title: formData.title || "",
            content: formData.description || "",
            location: formData.region || "",
            articleType: "BATTERY_ARTICLE",
            publicDate: pubDate,
            memberId: memberId,
            price: parseFloat(formData.price) || 0,
            status: "PENDING_APPROVAL",
            imageUrls:
              Array.isArray(formData.images) && formData.images.length > 0
                ? formData.images
                : [],
            volt: formData.volt ? parseFloat(formData.volt) : 0,
            capacity: formData.capacity ? parseFloat(formData.capacity) : 0,
            size: formData.size ? parseFloat(formData.size) : 0,
            weight: formData.weight ? parseFloat(formData.weight) : 0,
            brand: formData.brand || "",
            origin: formData.origin || "",
            warrantyMonths: formData.warrantyPeriodMonths
              ? parseInt(formData.warrantyPeriodMonths)
              : 1,
          };
          console.log("API Request: /article/battery", payload);
          const response = await api.post("/article/battery", payload);
          result = { data: response.data, error: null };
          console.log("API Response:", result);
        } else if (formData.category === "MOTOR_ARTICLE") {
          // ...existing code for MOTOR_ARTICLE...
          const payload = {
            title: formData.title || "",
            content: formData.description || "",
            location: formData.region || "",
            articleType: "MOTOR_ARTICLE",
            publicDate: pubDate,
            memberId: memberId,
            price: parseFloat(formData.price) || 0,
            status: "PENDING_APPROVAL",
            imageUrls:
              Array.isArray(formData.images) && formData.images.length > 0
                ? formData.images
                : [],
            brand: formData.brand || "",
            year: formData.year
              ? parseInt(formData.year)
              : new Date().getFullYear(),
            vehicleCapacity: formData.vehicleCapacity
              ? parseFloat(formData.vehicleCapacity)
              : 1,
            licensesPlate: formData.licensesPlate || "string",
            origin: formData.origin || "",
            milesTraveled: formData.mileage ? parseFloat(formData.mileage) : 0,
            warrantyMonths: formData.warrantyPeriodMonths
              ? parseInt(formData.warrantyPeriodMonths)
              : 1,
          };
          console.log("API Request: /article/motor", payload);
          const response = await api.post("/article/motor", payload);
          result = { data: response.data, error: null };
          console.log("API Response:", result);
        } else {
          // ...existing code for CAR_ARTICLE and other types...
          let regDate = "";
          if (typeof formData.registrationDeadline === "string") {
            const ddmmyyyy = formData.registrationDeadline.match(
              /^(\d{2})\/(\d{2})\/(\d{4})$/
            );
            const yyyymmdd = formData.registrationDeadline.match(
              /^(\d{4})-(\d{2})-(\d{2})$/
            );
            if (ddmmyyyy) {
              // Already dd/MM/yyyy -> keep
              regDate = formData.registrationDeadline;
            } else if (yyyymmdd) {
              // Convert ISO to dd/MM/yyyy
              const [, yyyy, mm, dd] = yyyymmdd;
              regDate = `${dd}/${mm}/${yyyy}`;
            }
          }
          const payload = {
            title: formData.title || "",
            content: formData.description || "",
            location: formData.region || "",
            articleType: "CAR_ARTICLE",
            publicDate: pubDate,
            memberId: memberId,
            price: parseFloat(formData.price) || 0,
            status: "PENDING_APPROVAL",
            imageUrls:
              Array.isArray(formData.images) && formData.images.length > 0
                ? formData.images
                : [],
            brand: formData.brand || "",
            model: formData.model || "",
            year: formData.year ? parseInt(formData.year) : 2024,
            origin: formData.origin || "",
            type: formData.model || "",
            numberOfSeat: formData.seats ? parseInt(formData.seats) : 4,
            licensesPlate: formData.licensesPlate || "",
            registrationDeadline: regDate,
            milesTraveled: formData.mileage ? parseInt(formData.mileage) : 0,
            warrantyPeriodMonths: formData.warrantyPeriodMonths
              ? parseInt(formData.warrantyPeriodMonths)
              : 12,
          };
          console.log("API Request: /article/car", payload);
          const response = await api.post("/article/car", payload);
          result = { data: response.data, error: null };
          console.log("API Response:", result);
        }
      }
      if (result.error) {
        alert(`Lỗi: ${result.error}`);
        return;
      }
      alert(
        isEditMode ? "Cập nhật tin đăng thành công!" : "Đăng tin thành công!"
      );

      if (!isEditMode) {
        setPostingAccess((prev) => ({
          ...prev,
          remaining: Math.max((prev.remaining || 1) - 1, 0),
        }));
      }
      if (isEditMode) {
        sessionStorage.removeItem("editingPost");
      }
      setFormData({
        category: "",
        title: "",
        description: "",
        price: "",
        negotiable: false,
        condition: "",
        brand: "",
        year: "",
        color: "",
        origin: "",
        region: "",
        mileage: "",
        batteryInfo: "",
        model: "",
        seats: "",
        batteryType: "",
        capacity: "",
        volt: "",
        size: "",
        weight: "",
        location: {
          city: "",
          district: "",
          ward: "",
          address: "",
        },
        contactName: "",
        contactPhone: "",
        images: [],
      });
      navigate("/my-posts");
    } catch (error) {
      console.error("❌ Lỗi không mong muốn:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBrandOptions = () => {
    switch (formData.category) {
      case "CAR_ARTICLE":
        return carBrands;
      case "MOTOR_ARTICLE":
        return electricBrands;
      case "BATTERY_ARTICLE":
        return batteryBrands;
      default:
        return [];
    }
  };

  if (!isEditMode && postingAccess.loading) {
    return (
      <div className="post-listing-page">
        <div className="post-access-guard">
          <div className="guard-card">
            <div className="guard-spinner" />
            <h2>Đang kiểm tra quyền đăng tin</h2>
            <p>Vui lòng chờ trong giây lát.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isEditMode && !postingAccess.allowed) {
    return (
      <div className="post-listing-page">
        <div className="post-access-guard">
          <div className="guard-card">
            <div className="guard-icon">⚠️</div>
            <h2>Không thể đăng tin</h2>
            <p>{postingAccess.message}</p>
            <div className="guard-actions">
              {!member?.memberId ? (
                <button className="primary" onClick={() => navigate("/login")}>
                  Đăng nhập
                </button>
              ) : (
                <>
                  <button className="primary" onClick={() => navigate("/packages")}>
                    Mua gói đăng tin
                  </button>
                  <button
                    className="secondary"
                    onClick={() => navigate("/my-subscriptions")}
                  >
                    Xem gói của tôi
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-listing-page">
      {/* Progress Steps */}
      <div className="progress-bar">
        <div className="container">
          <div className="steps">
            <div className={`step ${step >= 1 ? "active" : ""}`}>
              <div className="step-number">1</div>
              <div className="step-label">Chọn danh mục</div>
            </div>
            <div className={`step ${step >= 2 ? "active" : ""}`}>
              <div className="step-number">2</div>
              <div className="step-label">Thông tin chi tiết</div>
            </div>
            <div className={`step ${step >= 3 ? "active" : ""}`}>
              <div className="step-number">3</div>
              <div className="step-label">Hình ảnh</div>
            </div>
            <div className={`step ${step >= 4 ? "active" : ""}`}>
              <div className="step-number">4</div>
              <div className="step-label">Thông tin liên hệ</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="form-wrapper">
          {!isEditMode && postingAccess.allowed && (
            <div className="quota-banner">
              <strong>Bạn còn {postingAccess.remaining}</strong> lượt đăng tin trong gói hiện tại.
            </div>
          )}
          {/* Step 1: Category Selection */}
          {step === 1 && (
            <div className="form-step">
              <h2 className="step-title">
                {isEditMode
                  ? "Chỉnh sửa danh mục sản phẩm"
                  : "Chọn danh mục sản phẩm"}
              </h2>
              <div className="category-grid">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`category-card ${
                      formData.category === cat.id ? "selected" : ""
                    }`}
                    onClick={() => handleInputChange("category", cat.id)}
                  >
                    <div className="category-icon">{cat.icon}</div>
                    <div className="category-name">{cat.name}</div>
                  </div>
                ))}
              </div>
              <div className="form-actions">
                <button
                  className="btn btn-primary"
                  disabled={!formData.category}
                  onClick={handleNext}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && formData.category !== "BATTERY_ARTICLE" && (
            <div className="form-step">
              <h2 className="step-title">
                {isEditMode
                  ? "Chỉnh sửa thông tin chi tiết"
                  : "Thông tin chi tiết"}{" "}
                - {categories.find((c) => c.id === formData.category)?.name}
              </h2>

              {/* Common Fields - Dùng chung cho tất cả */}
              <div
                className={`form-group ${fieldStatus.title ? "completed" : ""}`}
              >
                <label>Tiêu đề bài đăng *</label>
                <input
                  type="text"
                  placeholder="VD: Toyota Camry 2020 màu đen, tình trạng tốt"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
                <small>
                  Tối thiểu 10 ký tự, tối đa 10 ký tự ({formData.title.length}
                  /10)
                </small>
              </div>

              <div
                className={`form-group ${
                  fieldStatus.description ? "completed" : ""
                }`}
              >
                <label>Mô tả chi tiết *</label>
                <textarea
                  rows="6"
                  placeholder="Mô tả chi tiết về sản phẩm của bạn..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
                <small>
                  Tối thiểu 100 ký tự ({formData.description.length}/100)
                </small>
              </div>

              <div
                className={`form-group ${fieldStatus.price ? "completed" : ""}`}
              >
                <label>Giá tiền *</label>
                <input
                  type="number"
                  min="0"
                  max="9999999999"
                  step="1000"
                  placeholder="VD: 50000000"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                />
                {formData.price && (
                  <small className="price-display">
                    {parseInt(formData.price).toLocaleString("vi-VN")} đ
                  </small>
                )}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.negotiable}
                    onChange={(e) =>
                      handleInputChange("negotiable", e.target.checked)
                    }
                  />
                  Có thể thương lượng
                </label>
              </div>

              <div className="form-row">
                <div
                  className={`form-group ${formData.region ? "completed" : ""}`}
                >
                  <label>Khu vực *</label>
                  <select
                    value={formData.region}
                    onChange={(e) =>
                      handleInputChange("region", e.target.value)
                    }
                  >
                    <option value="">Chọn khu vực</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Các trường đặc thù cho MOTOR_ARTICLE */}
                {formData.category === "MOTOR_ARTICLE" && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Biển số xe *</label>
                        <input
                          type="text"
                          placeholder="VD: 51A12345"
                          value={formData.licensesPlate || ""}
                          onChange={(e) =>
                            handleInputChange("licensesPlate", e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Số km đã đi *</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="VD: 5000"
                          value={formData.mileage || ""}
                          onChange={(e) =>
                            handleInputChange("mileage", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Dung tích xe (cc) *</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="VD: 18"
                          value={formData.vehicleCapacity || ""}
                          onChange={(e) =>
                            handleInputChange("vehicleCapacity", e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Thời gian bảo hành (tháng) *</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="VD: 12"
                          value={formData.warrantyPeriodMonths || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "warrantyPeriodMonths",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </>
                )}
                <div
                  className={`form-group ${
                    fieldStatus.condition ? "completed" : ""
                  }`}
                >
                  <label>Tình trạng *</label>
                  <select
                    value={formData.condition}
                    onChange={(e) =>
                      handleInputChange("condition", e.target.value)
                    }
                  >
                    <option value="">Chọn tình trạng</option>
                    {conditions.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div
                  className={`form-group ${
                    fieldStatus.year ? "completed" : ""
                  }`}
                >
                  <label>Năm sản xuất *</label>
                  <input
                    type="number"
                    placeholder="VD: 2020"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                  />
                </div>
                <div
                  className={`form-group ${
                    fieldStatus.brand ? "completed" : ""
                  }`}
                >
                  <label>
                    Hãng {formData.category === "battery" ? "Pin" : "xe"} *
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                  >
                    <option value="">Chọn hãng</option>
                    {getBrandOptions().map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Xuất xứ *</label>
                  <select
                    value={formData.origin}
                    onChange={(e) =>
                      handleInputChange("origin", e.target.value)
                    }
                  >
                    <option value="">Chọn xuất xứ</option>
                    {origins.map((origin) => (
                      <option key={origin} value={origin}>
                        {origin}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Common Vehicle Fields - Chỉ hiển thị cho xe (car và electric) */}
              {(formData.category === "car" ||
                formData.category === "electric") && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Số km đã đi (km)</label>
                    <input
                      type="number"
                      placeholder="VD: 15000"
                      min="0"
                      value={formData.mileage}
                      onChange={(e) =>
                        handleInputChange("mileage", e.target.value)
                      }
                    />
                    <small>
                      Nhập số km xe đã đi (có thể để trống nếu xe mới)
                    </small>
                  </div>

                  <div className="form-group">
                    <label>Pin (%)</label>
                    <input
                      type="number"
                      placeholder="VD: 85"
                      min="0"
                      max="100"
                      value={formData.batteryInfo}
                      onChange={(e) =>
                        handleInputChange("batteryInfo", e.target.value)
                      }
                    />
                    <small>Nhập phần trăm pin còn lại (có thể để trống)</small>
                  </div>
                </div>
              )}

              {/* Category Specific Fields */}
              {formData.category === "CAR_ARTICLE" && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Model *</label>
                    <select
                      value={formData.model}
                      onChange={(e) =>
                        handleInputChange("model", e.target.value)
                      }
                    >
                      <option value="">Chọn kiểu dáng</option>
                      {bodyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Số chỗ *</label>
                    <select
                      value={formData.seats}
                      onChange={(e) =>
                        handleInputChange("seats", e.target.value)
                      }
                    >
                      <option value="">Chọn số chỗ</option>
                      {seatOptions.map((seat) => (
                        <option key={seat} value={seat}>
                          {seat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Biển số xe *</label>
                    <input
                      type="text"
                      placeholder="VD: 30A-12345"
                      value={formData.licensesPlate || ""}
                      onChange={(e) =>
                        handleInputChange("licensesPlate", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Hạn đăng kiểm *</label>
                    <input
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={formData.registrationDeadline || ""}
                      onChange={(e) => {
                        let v = e.target.value.replace(/[^0-9/]/g, "");
                        // Tự động thêm dấu / khi nhập
                        if (v.length === 2 && !v.includes("/")) v = v + "/";
                        if (v.length === 5 && v.split("/").length < 3)
                          v = v + "/";
                        // Giới hạn tối đa 10 ký tự
                        v = v.slice(0, 10);
                        handleInputChange("registrationDeadline", v);
                      }}
                    />
                    <small>Định dạng: dd/mm/yyyy</small>
                  </div>
                  <div className="form-group">
                    <label>Số km đã đi *</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="VD: 15000"
                      value={formData.milesTraveled || ""}
                      onChange={(e) =>
                        handleInputChange("milesTraveled", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Thời gian bảo hành (tháng) *</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="VD: 12"
                      value={formData.warrantyPeriodMonths || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "warrantyPeriodMonths",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button className="btn btn-secondary" onClick={handlePrev}>
                  Quay lại
                </button>
                <button className="btn btn-primary" onClick={handleNext}>
                  Tiếp tục
                </button>
              </div>
            </div>
          )}

          {/* Step 2: CHO PIN */}
          {step === 2 && formData.category === "BATTERY_ARTICLE" && (
            <div className="form-step">
              <h2 className="step-title">
                {isEditMode
                  ? "Chỉnh sửa thông tin chi tiết"
                  : "Thông tin chi tiết"}{" "}
                - Pin
              </h2>
              {/* Tiêu đề, mô tả, hình ảnh */}
              <div
                className={`form-group ${fieldStatus.title ? "completed" : ""}`}
              >
                <label>Tiêu đề bài đăng *</label>
                <input
                  type="text"
                  placeholder="VD: Pin xe điện CATL 48V 60Ah"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
                <small>
                  Tối thiểu 30 ký tự, tối đa 100 ký tự ({formData.title.length}
                  /100)
                </small>
              </div>
              <div
                className={`form-group ${
                  fieldStatus.description ? "completed" : ""
                }`}
              >
                <label>Mô tả chi tiết *</label>
                <textarea
                  rows="6"
                  placeholder="Mô tả chi tiết về sản phẩm của bạn..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
                <small>
                  Tối thiểu 100 ký tự ({formData.description.length}/100)
                </small>
              </div>
              {/* Giá tiền, thương lượng */}
              <div
                className={`form-group ${fieldStatus.price ? "completed" : ""}`}
              >
                <label>Giá tiền *</label>
                <input
                  type="number"
                  min="0"
                  max="99999999"
                  step="1000"
                  placeholder="VD: 5000000"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                />
                {formData.price && (
                  <small className="price-display">
                    {parseInt(formData.price).toLocaleString("vi-VN")} đ
                  </small>
                )}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.negotiable}
                    onChange={(e) =>
                      handleInputChange("negotiable", e.target.checked)
                    }
                  />
                  Có thể thương lượng
                </label>
              </div>
              {/* Khu vực, tình trạng */}
              <div className="form-row">
                <div
                  className={`form-group ${formData.region ? "completed" : ""}`}
                >
                  <label>Khu vực *</label>
                  <select
                    value={formData.region}
                    onChange={(e) =>
                      handleInputChange("region", e.target.value)
                    }
                  >
                    <option value="">Chọn khu vực</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  className={`form-group ${
                    fieldStatus.condition ? "completed" : ""
                  }`}
                >
                  <label>Tình trạng *</label>
                  <select
                    value={formData.condition}
                    onChange={(e) =>
                      handleInputChange("condition", e.target.value)
                    }
                  >
                    <option value="">Chọn tình trạng</option>
                    {conditions.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Năm sản xuất, hãng */}
              <div className="form-row">
                <div
                  className={`form-group ${
                    fieldStatus.year ? "completed" : ""
                  }`}
                >
                  <label>Năm sản xuất *</label>
                  <input
                    type="number"
                    placeholder="VD: 2020"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                  />
                </div>
                <div
                  className={`form-group ${
                    fieldStatus.brand ? "completed" : ""
                  }`}
                >
                  <label>Hãng Pin *</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                  >
                    <option value="">Chọn hãng</option>
                    {batteryBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Xuất xứ */}
              <div className="form-row">
                <div className="form-group">
                  <label>Xuất xứ *</label>
                  <select
                    value={formData.origin}
                    onChange={(e) =>
                      handleInputChange("origin", e.target.value)
                    }
                  >
                    <option value="">Chọn xuất xứ</option>
                    {origins.map((origin) => (
                      <option key={origin} value={origin}>
                        {origin}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Các trường đặc thù của Pin */}
              <div className="form-row">
                <div className="form-group">
                  <label>Hiệu điện thế (Volt) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="VD: 48"
                    value={formData.volt || ""}
                    onChange={(e) => handleInputChange("volt", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Dung lượng (Ah/kWh) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="VD: 60"
                    value={formData.capacity || ""}
                    onChange={(e) =>
                      handleInputChange("capacity", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Kích thước (cm) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="VD: 30"
                    value={formData.size || ""}
                    onChange={(e) => handleInputChange("size", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Khối lượng (kg) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="VD: 12"
                    value={formData.weight || ""}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Thời gian bảo hành (tháng) *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="VD: 12"
                    value={formData.warrantyPeriodMonths || ""}
                    onChange={(e) =>
                      handleInputChange("warrantyPeriodMonths", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={handlePrev}>
                  Quay lại
                </button>
                <button className="btn btn-primary" onClick={handleNext}>
                  Tiếp tục
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Images & Videos */}
          {step === 3 && (
            <div className="form-step">
              <h2 className="step-title">
                {isEditMode
                  ? "Chỉnh sửa hình ảnh sản phẩm"
                  : "Hình ảnh sản phẩm"}
              </h2>
              <div className="upload-section">
                <div className="upload-info">
                  <p>📸 Thêm ít nhất 1 ảnh để tin đăng của bạn hấp dẫn hơn</p>
                  <ul>
                    <li>Ảnh rõ nét, không mờ, không chứa thông tin liên hệ</li>
                    <li>Tối đa 12 ảnh, mỗi ảnh tối đa 5MB</li>
                    <li>Hỗ trợ: JPG, PNG, WebP</li>
                    <li>Ảnh sẽ được tự động upload lên Supabase Storage</li>
                  </ul>
                </div>

                <ImageUpload
                  onImagesChange={handleImagesChange}
                  multiple={true}
                  maxFiles={12}
                  folder="products"
                  existingImages={formData.images}
                />
              </div>

              <div className="form-actions">
                <button className="btn btn-secondary" onClick={handlePrev}>
                  Quay lại
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={formData.images.length === 0}
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Contact Info */}
          {step === 4 && (
            <div className="form-step">
              <h2 className="step-title">
                {isEditMode
                  ? "Chỉnh sửa thông tin liên hệ"
                  : "Thông tin liên hệ"}
              </h2>

              <div
                className={`form-group ${
                  fieldStatus["location.city"] &&
                  fieldStatus["location.district"] &&
                  fieldStatus["location.address"]
                    ? "completed"
                    : ""
                }`}
              >
                <label>Địa chỉ *</label>
                <div className="location-selects">
                  <select
                    value={formData.location.city}
                    onChange={(e) =>
                      handleLocationChange("city", e.target.value)
                    }
                  >
                    <option value="">Tỉnh/Thành phố</option>
                    {Object.entries(vietnamAddressData).map(([key, city]) => (
                      <option key={key} value={key}>
                        {city.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={formData.location.district}
                    onChange={(e) =>
                      handleLocationChange("district", e.target.value)
                    }
                    disabled={!formData.location.city}
                  >
                    <option value="">Quận/Huyện</option>
                    {availableDistricts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={formData.location.ward}
                    onChange={(e) =>
                      handleLocationChange("ward", e.target.value)
                    }
                    disabled={!formData.location.district}
                  >
                    <option value="">Phường/Xã</option>
                    {availableWards.map((ward) => (
                      <option key={ward} value={ward}>
                        {ward}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Số nhà, tên đường..."
                  value={formData.location.address}
                  onChange={(e) =>
                    handleLocationChange("address", e.target.value)
                  }
                  style={{ marginTop: "10px" }}
                />
              </div>

              <div
                className={`form-group ${
                  fieldStatus.contactName ? "completed" : ""
                }`}
              >
                <label>Tên người liên hệ *</label>
                <input
                  type="text"
                  placeholder="Nhập tên của bạn"
                  value={formData.contactName}
                  onChange={(e) =>
                    handleInputChange("contactName", e.target.value)
                  }
                />
              </div>

              <div
                className={`form-group ${
                  fieldStatus.contactPhone ? "completed" : ""
                }`}
              >
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại (10 số)"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    handleInputChange(
                      "contactPhone",
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  maxLength="10"
                />
              </div>

              <div className="terms-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={agreeTerm}
                    onChange={(e) => setAgreeTerm(e.target.checked)}
                    required
                  />
                  Tôi đã đọc và đồng ý với <a href="#">Quy định đăng tin</a> của
                  EcoXe
                </label>
              </div>

              <div className="form-actions">
                <button className="btn btn-secondary" onClick={handlePrev}>
                  Quay lại
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? isEditMode
                      ? "Đang cập nhật..."
                      : "Đang đăng tin..."
                    : isEditMode
                    ? "Cập nhật tin đăng"
                    : "Đăng tin"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preview Sidebar */}
        <div className="preview-sidebar">
          <div className="preview-card">
            <h3>Xem trước tin đăng</h3>
            {formData.images.length > 0 ? (
              <img
                src={formData.images[0]}
                alt="Preview"
                className="preview-image"
              />
            ) : (
              <div className="preview-placeholder">Chưa có ảnh</div>
            )}
            <div className="preview-content">
              {formData.category === "BATTERY_ARTICLE" ? (
                <>
                  <h4>{formData.title || "Tiêu đề tin đăng"}</h4>
                  <div className="preview-price">
                    {formData.price
                      ? `${parseInt(formData.price).toLocaleString("vi-VN")} đ`
                      : "Giá bán"}
                  </div>
                  <div className="preview-specs">
                    {formData.brand && <span>🏭 {formData.brand}</span>}
                    {formData.origin && <span>🌏 {formData.origin}</span>}
                    {formData.volt && <span>🔋 Volt: {formData.volt}</span>}
                    {formData.capacity && (
                      <span>⚡ Dung lượng: {formData.capacity}</span>
                    )}
                    {formData.size && (
                      <span>📏 Kích thước: {formData.size}</span>
                    )}
                    {formData.weight && (
                      <span>⚖️ Khối lượng: {formData.weight}</span>
                    )}
                    {formData.warrantyMonths && (
                      <span>🛡️ Bảo hành: {formData.warrantyMonths} tháng</span>
                    )}
                  </div>
                  <div className="preview-location">
                    {formData.location?.city}, {formData.location?.district},{" "}
                    {formData.location?.ward}, {formData.location?.address}
                  </div>
                  <div className="preview-other">
                    {formData.status && (
                      <span>Trạng thái: {formData.status}</span>
                    )}
                    {formData.approvedById && (
                      <span>Người duyệt: {formData.approvedById}</span>
                    )}
                    {formData.memberId && (
                      <span>Thành viên: {formData.memberId}</span>
                    )}
                    {formData.publicDate && (
                      <span>Ngày đăng: {formData.publicDate}</span>
                    )}
                    {formData.articleType && (
                      <span>Loại bài: {formData.articleType}</span>
                    )}
                  </div>
                  <div className="preview-images">
                    {formData.imageUrls && formData.imageUrls.length > 0 && (
                      <span>Ảnh: {formData.imageUrls.join(", ")}</span>
                    )}
                  </div>
                  <div className="preview-description">
                    {formData.description || formData.content}
                  </div>
                </>
              ) : (
                <>
                  <h4>{formData.title || "Tiêu đề tin đăng"}</h4>
                  <div className="preview-price">
                    {formData.price
                      ? `${parseInt(formData.price).toLocaleString("vi-VN")} đ`
                      : "Giá bán"}
                    {formData.negotiable && (
                      <span className="negotiable-badge">Có thể TL</span>
                    )}
                  </div>
                  <div className="preview-specs">
                    {formData.category && (
                      <span className="category-badge">
                        {
                          categories.find((c) => c.id === formData.category)
                            ?.name
                        }
                      </span>
                    )}
                    {formData.year && <span>📅 {formData.year}</span>}
                    {formData.condition && <span>⚙️ {formData.condition}</span>}
                    {formData.brand && <span>🏭 {formData.brand}</span>}
                    {formData.color && <span>🎨 {formData.color}</span>}
                    {formData.category === "car" && formData.seats && (
                      <span>👥 {formData.seats}</span>
                    )}
                    {formData.category === "car" && formData.bodyType && (
                      <span>🚗 {formData.bodyType}</span>
                    )}
                    {formData.category === "battery" &&
                      formData.batteryType && (
                        <span>🔋 {formData.batteryType}</span>
                      )}
                    {formData.category === "battery" && formData.capacity && (
                      <span>⚡ {formData.capacity}</span>
                    )}
                  </div>
                  {formData.region && (
                    <div className="preview-location">📍 {formData.region}</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostListing;
