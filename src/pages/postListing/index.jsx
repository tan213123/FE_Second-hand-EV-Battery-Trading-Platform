import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'

const PostListing = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    price: '',
    negotiable: false,
    condition: '',
    brand: '',
    year: '',
    color: '',
    origin: '',
    region: '',
    // Car specific
    bodyType: '',
    seats: '',
    // Battery specific
    batteryType: '',
    capacity: '',
    location: {
      city: '',
      district: '',
      ward: '',
      address: ''
    },
    contactName: '',
    contactPhone: '',
    images: []
  })

  const categories = [
    { id: 'car', name: 'Ô tô', icon: '🚗' },
    { id: 'electric', name: 'Xe điện', icon: '🏍️' },
    { id: 'battery', name: 'Pin', icon: '🔋' }
  ]

  const carBrands = ['VinFast', 'Toyota', 'Honda', 'Mazda', 'Hyundai', 'Kia', 'Ford', 'Mitsubishi', 'Mercedes-Benz', 'BMW', 'Audi', 'Lexus']
  const electricBrands = ['VinFast', 'Yadea', 'Pega', 'DatBike', 'Anbico', 'Hkbike', 'Vinfast']
  const batteryBrands = ['Panasonic', 'Samsung', 'LG', 'CATL', 'BYD', 'GS Yuasa', 'Bosch']
  const conditions = ['Mới', 'Đã sử dụng (Còn mới)', 'Đã sử dụng (Tốt)', 'Đã sử dụng (Trung bình)']
  const bodyTypes = ['Sedan', 'SUV', 'Hatchback', 'MPV', 'Pickup', 'Coupe', 'Convertible']
  const seatOptions = ['2 chỗ', '4 chỗ', '5 chỗ', '7 chỗ', '9 chỗ', '16 chỗ']
  const batteryTypes = ['Li-ion', 'Li-Po', 'LiFePO4', 'Ni-MH', 'Lead-acid']
  const origins = ['Nhập khẩu', 'Lắp ráp trong nước', 'Sản xuất trong nước']
  const regions = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Khác']
  const colors = ['Trắng', 'Đen', 'Xám', 'Bạc', 'Đỏ', 'Xanh dương', 'Xanh lá', 'Vàng', 'Nâu', 'Khác']

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ 
      ...prev,
      [field]: value
    }))
  }

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (formData.images.length + files.length > 12) {
      alert('Tối đa 12 ảnh!')
      return
    }
    const newImages = files.map(file => URL.createObjectURL(file))
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }))
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const validateStep2 = () => {
    if (!formData.title || formData.title.length < 30) {
      alert('Tiêu đề phải có ít nhất 30 ký tự')
      return false
    }
    if (!formData.description || formData.description.length < 100) {
      alert('Mô tả phải có ít nhất 100 ký tự')
      return false
    }
    if (!formData.price) {
      alert('Vui lòng nhập giá')
      return false
    }
    if (!formData.condition) {
      alert('Vui lòng chọn tình trạng')
      return false
    }
    if (!formData.year) {
      alert('Vui lòng nhập năm sản xuất')
      return false
    }
    if (!formData.brand) {
      alert('Vui lòng chọn hãng')
      return false
    }
    if (!formData.color) {
      alert('Vui lòng chọn màu sắc')
      return false
    }
    if (!formData.origin) {
      alert('Vui lòng chọn xuất xứ')
      return false
    }
    if (!formData.region) {
      alert('Vui lòng chọn khu vực')
      return false
    }
    
    // Category specific validation
    if (formData.category === 'car') {
      if (!formData.bodyType) {
        alert('Vui lòng chọn kiểu dáng')
        return false
      }
      if (!formData.seats) {
        alert('Vui lòng chọn số chỗ')
        return false
      }
    }
    
    if (formData.category === 'battery') {
      if (!formData.batteryType) {
        alert('Vui lòng chọn loại pin')
        return false
      }
      if (!formData.capacity) {
        alert('Vui lòng nhập công suất')
        return false
      }
    }
    
    return true
  }

  const validateStep3 = () => {
    if (formData.images.length === 0) {
      alert('Vui lòng thêm ít nhất 1 ảnh')
      return false
    }
    return true
  }

  const validateStep4 = () => {
    if (!formData.location.city || !formData.location.district || !formData.location.address) {
      alert('Vui lòng điền đầy đủ địa chỉ')
      return false
    }
    if (!formData.contactName) {
      alert('Vui lòng nhập tên người liên hệ')
      return false
    }
    if (!formData.contactPhone || !/^[0-9]{10}$/.test(formData.contactPhone)) {
      alert('Vui lòng nhập số điện thoại hợp lệ (10 số)')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 2 && !validateStep2()) return
    if (step === 3 && !validateStep3()) return
    
    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  const handlePrev = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async () => {
    if (!validateStep4()) return
    
    // Call API to submit listing
    console.log('Submitting:', formData)
    alert('Đăng tin thành công!')
    navigate('/my-listings')
  }

  const getBrandOptions = () => {
    switch(formData.category) {
      case 'car': return carBrands
      case 'electric': return electricBrands
      case 'battery': return batteryBrands
      default: return []
    }
  }

  return (
    <div className="post-listing-page">
      {/* Progress Steps */}
      <div className="progress-bar">
        <div className="container">
          <div className="steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Chọn danh mục</div>
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Thông tin chi tiết</div>
            </div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Hình ảnh</div>
            </div>
            <div className={`step ${step >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">Thông tin liên hệ</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="form-wrapper">
          {/* Step 1: Category Selection */}
          {step === 1 && (
            <div className="form-step">
              <h2 className="step-title">Chọn danh mục sản phẩm</h2>
              <div className="category-grid">
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    className={`category-card ${formData.category === cat.id ? 'selected' : ''}`}
                    onClick={() => handleInputChange('category', cat.id)}
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
          {step === 2 && (
            <div className="form-step">
              <h2 className="step-title">Thông tin chi tiết - {categories.find(c => c.id === formData.category)?.name}</h2>
              
              {/* Common Fields - Dùng chung cho tất cả */}
              <div className="form-group">
                <label>Tiêu đề bài đăng *</label>
                <input
                  type="text"
                  placeholder="VD: Toyota Camry 2020 màu đen, tình trạng tốt"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
                <small>Tối thiểu 30 ký tự, tối đa 100 ký tự ({formData.title.length}/100)</small>
              </div>

              <div className="form-group">
                <label>Mô tả chi tiết *</label>
                <textarea
                  rows="6"
                  placeholder="Mô tả chi tiết về sản phẩm của bạn..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
                <small>Tối thiểu 100 ký tự ({formData.description.length}/100)</small>
              </div>

              <div className="form-group">
                <label>Giá tiền *</label>
                <input
                  type="text"
                  placeholder="VD: 500000000"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value.replace(/\D/g, ''))}
                />
                {formData.price && (
                  <small className="price-display">
                    {parseInt(formData.price).toLocaleString('vi-VN')} đ
                  </small>
                )}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.negotiable}
                    onChange={(e) => handleInputChange('negotiable', e.target.checked)}
                  />
                  Có thể thương lượng
                </label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Khu vực *</label>
                  <select
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                  >
                    <option value="">Chọn khu vực</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Tình trạng *</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                  >
                    <option value="">Chọn tình trạng</option>
                    {conditions.map(cond => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Năm sản xuất *</label>
                  <input
                    type="number"
                    placeholder="VD: 2020"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Hãng {formData.category === 'battery' ? 'Pin' : 'xe'} *</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                  >
                    <option value="">Chọn hãng</option>
                    {getBrandOptions().map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Màu sắc *</label>
                  <select
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                  >
                    <option value="">Chọn màu sắc</option>
                    {colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Xuất xứ *</label>
                  <select
                    value={formData.origin}
                    onChange={(e) => handleInputChange('origin', e.target.value)}
                  >
                    <option value="">Chọn xuất xứ</option>
                    {origins.map(origin => (
                      <option key={origin} value={origin}>{origin}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category Specific Fields */}
              {formData.category === 'car' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Kiểu dáng *</label>
                    <select
                      value={formData.bodyType}
                      onChange={(e) => handleInputChange('bodyType', e.target.value)}
                    >
                      <option value="">Chọn kiểu dáng</option>
                      {bodyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Số chỗ *</label>
                    <select
                      value={formData.seats}
                      onChange={(e) => handleInputChange('seats', e.target.value)}
                    >
                      <option value="">Chọn số chỗ</option>
                      {seatOptions.map(seat => (
                        <option key={seat} value={seat}>{seat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {formData.category === 'battery' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Loại Pin *</label>
                    <select
                      value={formData.batteryType}
                      onChange={(e) => handleInputChange('batteryType', e.target.value)}
                    >
                      <option value="">Chọn loại pin</option>
                      {batteryTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Công suất *</label>
                    <input
                      type="text"
                      placeholder="VD: 60Ah, 100kWh"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
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

          {/* Step 3: Images & Videos */}
          {step === 3 && (
            <div className="form-step">
              <h2 className="step-title">Hình ảnh sản phẩm</h2>
              <div className="upload-section">
                <div className="upload-info">
                  <p>📸 Thêm ít nhất 1 ảnh để tin đăng của bạn hấp dẫn hơn</p>
                  <ul>
                    <li>Ảnh rõ nét, không mờ, không chứa thông tin liên hệ</li>
                    <li>Tối đa 12 ảnh, mỗi ảnh tối đa 5MB</li>
                    <li>Hỗ trợ: JPG, PNG, GIF</li>
                  </ul>
                </div>

                <div className="image-upload-grid">
                  {formData.images.map((img, index) => (
                    <div key={index} className="image-preview">
                      <img src={img} alt={`Preview ${index + 1}`} />
                      <button
                        className="remove-btn"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                      {index === 0 && <span className="main-badge">Ảnh chính</span>}
                    </div>
                  ))}
                  {formData.images.length < 12 && (
                    <label className="upload-box">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <div className="upload-icon">+</div>
                      <div className="upload-text">Thêm ảnh</div>
                      <small>{formData.images.length}/12</small>
                    </label>
                  )}
                </div>
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
              <h2 className="step-title">Thông tin liên hệ</h2>
              
              <div className="form-group">
                <label>Địa chỉ *</label>
                <div className="location-selects">
                  <select
                    value={formData.location.city}
                    onChange={(e) => handleLocationChange('city', e.target.value)}
                  >
                    <option value="">Tỉnh/Thành phố</option>
                    <option value="hanoi">Hà Nội</option>
                    <option value="hcm">TP. Hồ Chí Minh</option>
                    <option value="danang">Đà Nẵng</option>
                    <option value="haiphong">Hải Phòng</option>
                    <option value="cantho">Cần Thơ</option>
                  </select>

                  <select
                    value={formData.location.district}
                    onChange={(e) => handleLocationChange('district', e.target.value)}
                    disabled={!formData.location.city}
                  >
                    <option value="">Quận/Huyện</option>
                    <option value="cg">Cầu Giấy</option>
                    <option value="dd">Đống Đa</option>
                    <option value="hbt">Hai Bà Trưng</option>
                    <option value="hk">Hoàn Kiếm</option>
                  </select>

                  <select
                    value={formData.location.ward}
                    onChange={(e) => handleLocationChange('ward', e.target.value)}
                    disabled={!formData.location.district}
                  >
                    <option value="">Phường/Xã</option>
                    <option value="dv">Dịch Vọng</option>
                    <option value="qh">Quan Hoa</option>
                    <option value="yh">Yên Hòa</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Số nhà, tên đường..."
                  value={formData.location.address}
                  onChange={(e) => handleLocationChange('address', e.target.value)}
                  style={{ marginTop: '10px' }}
                />
              </div>

              <div className="form-group">
                <label>Tên người liên hệ *</label>
                <input
                  type="text"
                  placeholder="Nhập tên của bạn"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại (10 số)"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength="10"
                />
              </div>

              <div className="terms-checkbox">
                <label>
                  <input type="checkbox" required />
                  Tôi đã đọc và đồng ý với <a href="#">Quy định đăng tin</a> của EcoXe
                </label>
              </div>

              <div className="form-actions">
                <button className="btn btn-secondary" onClick={handlePrev}>
                  Quay lại
                </button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Đăng tin
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
              <img src={formData.images[0]} alt="Preview" className="preview-image" />
            ) : (
              <div className="preview-placeholder">Chưa có ảnh</div>
            )}
            <div className="preview-content">
              <h4>{formData.title || 'Tiêu đề tin đăng'}</h4>
              <div className="preview-price">
                {formData.price ? `${parseInt(formData.price).toLocaleString('vi-VN')} đ` : 'Giá bán'}
                {formData.negotiable && <span className="negotiable-badge">Có thể TL</span>}
              </div>
              <div className="preview-specs">
                {formData.category && <span className="category-badge">{categories.find(c => c.id === formData.category)?.name}</span>}
                {formData.year && <span>📅 {formData.year}</span>}
                {formData.condition && <span>⚙️ {formData.condition}</span>}
                {formData.brand && <span>🏭 {formData.brand}</span>}
                {formData.color && <span>🎨 {formData.color}</span>}
                {formData.category === 'car' && formData.seats && <span>👥 {formData.seats}</span>}
                {formData.category === 'car' && formData.bodyType && <span>🚗 {formData.bodyType}</span>}
                {formData.category === 'battery' && formData.batteryType && <span>🔋 {formData.batteryType}</span>}
                {formData.category === 'battery' && formData.capacity && <span>⚡ {formData.capacity}</span>}
              </div>
              {formData.region && (
                <div className="preview-location">
                  📍 {formData.region}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostListing
