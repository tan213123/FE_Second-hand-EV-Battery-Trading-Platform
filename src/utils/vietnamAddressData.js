const vietnamAddressData = {
  'hanoi': {
    name: 'Hà Nội',
    districts: {
      'ba-dinh': {
        name: 'Ba Đình',
        wards: ['Phúc Xá', 'Trúc Bạch', 'Vĩnh Phúc', 'Cống Vị', 'Liễu Giai', 'Nguyễn Trung Trực', 'Quán Thánh', 'Ngọc Hà', 'Điện Biên', 'Đội Cấn', 'Ngọc Khánh', 'Kim Mã', 'Giảng Võ', 'Thành Công']
      },
      'hoan-kiem': {
        name: 'Hoàn Kiếm',
        wards: ['Phúc Tấn', 'Đồng Xuân', 'Hàng Mã', 'Hàng Buồm', 'Hàng Đào', 'Hàng Bồ', 'Cửa Đông', 'Lý Thái Tổ', 'Hàng Bạc', 'Hàng Gai', 'Chương Dương Độ', 'Cửa Nam', 'Hàng Trống', 'Tràng Tiền', 'Trần Hưng Đạo', 'Phan Chu Trinh', 'Hàng Bài', 'Hàng Quạt']
      },
      'dong-da': {
        name: 'Đống Đa',
        wards: ['Cát Linh', 'Văn Miếu', 'Quốc Tử Giám', 'Láng Thượng', 'Ô Chợ Dừa', 'Văn Chương', 'Hàng Bột', 'Láng Hạ', 'Khâm Thiên', 'Thổ Quan', 'Nam Đồng', 'Trung Phụng', 'Quang Trung', 'Trung Liệt', 'Phương Liên', 'Thịnh Quang', 'Trung Tự', 'Kim Liên', 'Phương Mai', 'Ngã Tư Sở', 'Khương Thượng']
      },
      'hai-ba-trung': {
        name: 'Hai Bà Trưng',
        wards: ['Nguyễn Du', 'Bạch Đằng', 'Phạm Đình Hổ', 'Lê Đại Hành', 'Đồng Nhận', 'Phố Huế', 'Đống Mác', 'Thanh Lương', 'Thanh Nhàn', 'Cầu Dền', 'Bách Khoa', 'Đồng Tâm', 'Vĩnh Tuy', 'Bạch Mai', 'Quỳnh Mai', 'Quỳnh Lôi', 'Minh Khai', 'Trương Định']
      },
      'cau-giay': {
        name: 'Cầu Giấy',
        wards: ['Nghĩa Đô', 'Nghĩa Tân', 'Mai Dịch', 'Dịch Vọng', 'Dịch Vọng Hậu', 'Quan Hoa', 'Yên Hoà', 'Trung Hoà']
      }
    }
  },
  'hcm': {
    name: 'TP. Hồ Chí Minh',
    districts: {
      'quan-1': {
        name: 'Quận 1',
        wards: ['Tân Định', 'Đa Kao', 'Bến Nghé', 'Bến Thành', 'Nguyễn Thái Bình', 'Phạm Ngũ Lão', 'Cầu Ông Lãnh', 'Cô Giang', 'Nguyễn Cư Trinh', 'Cầu Kho']
      },
      'quan-3': {
        name: 'Quận 3',
        wards: ['Võ Thị Sáu', 'Nguyễn Thị Minh Khai', 'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14']
      },
      'quan-7': {
        name: 'Quận 7',
        wards: ['Tân Thuận Đông', 'Tân Thuận Tây', 'Tân Kiểng', 'Tân Hưng', 'Bình Thuận', 'Tân Quy', 'Phú Thuận', 'Tân Phú', 'Tân Phong', 'Phú Mỹ']
      },
      'binh-thanh': {
        name: 'Bình Thạnh',
        wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15', 'Phường 17', 'Phường 19', 'Phường 21', 'Phường 22', 'Phường 24', 'Phường 25', 'Phường 26', 'Phường 27', 'Phường 28']
      },
      'thu-duc': {
        name: 'Thủ Đức',
        wards: ['Linh Xuân', 'Bình Chiểu', 'Linh Trung', 'Tam Bình', 'Tam Phú', 'Hiệp Bình Phước', 'Hiệp Bình Chánh', 'Linh Chiểu', 'Linh Tây', 'Linh Đông', 'Bình Thọ', 'Trường Thọ', 'Long Bình', 'Long Thạnh Mỹ', 'Tân Phú', 'Hiệp Phú', 'Tăng Nhơn Phú A', 'Tăng Nhơn Phú B', 'Phước Long A', 'Phước Long B', 'Trường Thạnh', 'Long Phước', 'Long Trường', 'Phước Bình', 'Phú Hữu', 'Thạnh Mỹ Lợi', 'Thủ Thiêm']
      }
    }
  },
  'danang': {
    name: 'Đà Nẵng',
    districts: {
      'hai-chau': {
        name: 'Hải Châu',
        wards: ['Thạch Thang', 'Hải Châu I', 'Hải Châu II', 'Phước Ninh', 'Hòa Thuận Tây', 'Hòa Thuận Đông', 'Nam Dương', 'Bình Hiên', 'Bình Thuận', 'Hòa Cường Bắc', 'Hòa Cường Nam', 'Thanh Bình', 'Thuận Phước']
      },
      'thanh-khe': {
        name: 'Thanh Khê',
        wards: ['Tam Thuận', 'Thanh Khê Tây', 'Thanh Khê Đông', 'Xuân Hà', 'Tân Chính', 'Chính Gian', 'Vĩnh Trung', 'Thạc Gián', 'An Khê', 'Hòa Khê']
      },
      'son-tra': {
        name: 'Sơn Trà',
        wards: ['Thọ Quang', 'Nại Hiên Đông', 'Mân Thái', 'An Hải Bắc', 'Phước Mỹ', 'An Hải Tây', 'An Hải Đông']
      },
      'ngu-hanh-son': {
        name: 'Ngũ Hành Sơn',
        wards: ['Mỹ An', 'Khuê Mỹ', 'Hoà Quý', 'Hoà Hải']
      },
      'lien-chieu': {
        name: 'Liên Chiểu',
        wards: ['Hòa Hiệp Bắc', 'Hòa Hiệp Nam', 'Hòa Khánh Bắc', 'Hòa Khánh Nam', 'Hòa Minh']
      }
    }
  },
  'cantho': {
    name: 'Cần Thơ',
    districts: {
      'ninh-kieu': {
        name: 'Ninh Kiều',
        wards: ['Cái Khế', 'Thới Bình', 'Xuân Khánh', 'Hưng Lợi', 'An Hòa', 'Tân An', 'An Nghiệp', 'An Cư', 'Hưng Thạnh', 'An Khánh', 'An Phú']
      },
      'binh-thuy': {
        name: 'Bình Thủy',
        wards: ['Bình Thủy', 'Trà An', 'Trà Nóc', 'Thới An Đông', 'An Thới', 'Bùi Hữu Nghĩa', 'Long Hòa', 'Long Tuyền']
      },
      'cai-rang': {
        name: 'Cái Răng',
        wards: ['Lê Bình', 'Hưng Phú', 'Hưng Thạnh', 'Ba Láng', 'Thường Thạnh', 'Phước Thới', 'Tân Phú']
      },
      'o-mon': {
        name: 'Ô Môn',
        wards: ['Châu Văn Liêm', 'Thới Hòa', 'Thới Long', 'Thới An', 'Phước Thạnh', 'Trường Lạc', 'Thới Thuận']
      }
    }
  },
  'haiphong': {
    name: 'Hải Phòng',
    districts: {
      'hong-bang': {
        name: 'Hồng Bàng',
        wards: ['Quán Toan', 'Hồng Bàng', 'Sở Dầu', 'Thượng Lý', 'Hạ Lý', 'Minh Khai', 'Trại Cau', 'Lạc Viên', 'Lê Lợi', 'Đông Khê', 'Phan Bội Châu']
      },
      'ngo-quyen': {
        name: 'Ngô Quyền',
        wards: ['Máy Chai', 'Máy Tơ', 'Lạch Tray', 'Cầu Tre', 'Đông Khê', 'Cầu Đất', 'Văn Đẩu', 'Lê Lợi', 'Đằng Giang', 'Cát Dài']
      },
      'le-chan': {
        name: 'Lê Chân',
        wards: ['Cát Dài', 'An Biên', 'Lam Sơn', 'An Dương', 'Trần Nguyên Hãn', 'Niệm Nghĩa', 'Dư Hàng', 'Kênh Dương', 'Cát Bi', 'Đông Hải', 'Hồ Nam']
      },
      'hai-an': {
        name: 'Hải An',
        wards: ['Đông Hải 1', 'Đông Hải 2', 'Bắc Sơn', 'Nam Sơn', 'Ngọc Sơn', 'Tràng Cát', 'Tân Thành', 'Thành Tô']
      }
    }
  },
  'binhduong': {
    name: 'Bình Dương',
    districts: {
      'thu-dau-mot': {
        name: 'Thủ Dầu Một',
        wards: ['Phú Cường', 'Phú Hòa', 'Phú Thọ', 'Chánh Nghĩa', 'Định Hoà', 'Hoà Phú', 'Phú Lợi', 'Phú Tân', 'Tương Bình Hiệp', 'Khánh Bình', 'Tân An', 'Hiệp An', 'Tân Tiến', 'Hòa Lợi', 'Phú Mỹ']
      },
      'di-an': {
        name: 'Dĩ An',
        wards: ['Dĩ An', 'An Bình', 'An Sơn', 'Đông Hòa', 'Tân Bình', 'Tân Đông Hiệp', 'Bình An', 'Bình Sơn']
      },
      'thuan-an': {
        name: 'Thuận An',
        wards: ['Lái Thiêu', 'Bình Chuẩn', 'Thuận Giao', 'An Phú', 'Hưng Định', 'An Sơn', 'Bình Hòa', 'Việt Sing']
      },
      'ben-cat': {
        name: 'Bến Cát',
        wards: ['Mỹ Phước', 'Chánh Phú Hòa', 'Uyên Hưng', 'Tân Uyên', 'Khánh Bình', 'Phú An', 'Tân Định']
      }
    }
  },
  'dongnai': {
    name: 'Đồng Nai',
    districts: {
      'bien-hoa': {
        name: 'Biên Hòa',
        wards: ['Quyết Thắng', 'Trảng Dài', 'An Bình', 'Hóa An', 'Tân Phong', 'Tân Biên', 'Hố Nai', 'Tân Hạnh', 'Hiệp Hòa', 'Bửu Long', 'Tân Tiến', 'Thống Nhất', 'Tam Hiệp', 'Tam Hòa', 'Bình Đa', 'An Hòa', 'Hưng Chiến']
      },
      'long-thanh': {
        name: 'Long Thành',
        wards: ['Long Thành', 'An Phước', 'Bình An', 'Bình Sơn', 'Cẩm Đường', 'Long Đức', 'Long Hưng', 'Long Phước', 'Phước Bình', 'Tam An', 'Tân Hiệp']
      },
      'nhon-trach': {
        name: 'Nhơn Trạch',
        wards: ['Đại Phước', 'Hiệp Phước', 'Long Tân', 'Phú Hữu', 'Phú Hội', 'Phước An', 'Phước Khánh', 'Phước Thiền', 'Vĩnh Thanh']
      },
      'trang-bom': {
        name: 'Trảng Bom',
        wards: ['Trảng Bom', 'Bàu Hàm', 'Bình Minh', 'Đông Hòa', 'Giang Điền', 'Hàng Gòn', 'Quảng Tiến', 'Sông Thao', 'Thanh Bình', 'Thiện Tân']
      }
    }
  },
  'vungtau': {
    name: 'Vũng Tàu',
    districts: {
      'vung-tau': {
        name: 'Vũng Tàu',
        wards: ['Thắng Tam', 'Thắng Nhì', 'Thắng Nhất', 'Rạch Dừa', 'Nguyễn An Ninh', 'Bến Đà', 'Phước Hưng', 'Phước Hải', 'Phước Trung', 'Long Sơn', 'Hạ Long', 'Tân Thành', 'Miền Tây']
      },
      'ba-ria': {
        name: 'Bà Rịa',
        wards: ['Phước Hiệp', 'Phước Nguyên', 'Kim Dinh', 'Phước Trung', 'Long Toàn', 'Long Tâm', 'Hoà Long', 'Tân Hưng', 'Long Hương', 'Phước Hưng']
      },
      'con-dao': {
        name: 'Côn Đảo',
        wards: ['Côn Đảo']
      }
    }
  },
}

export default vietnamAddressData;