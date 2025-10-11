import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'

const PostListing = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    title: '',
    description: '',
    price: '',
    negotiable: false,
    condition: '',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    transmission: '',
    fuelType: '',
    color: '',
    seats: '',
    location: {
      city: '',
      district: '',
      ward: '',
      address: ''
    },
    contactName: '',
    contactPhone: '',
    images: [],
    videos: []
  })

  const categories = [
    { id: 'car', name: 'Ô tô', icon: '🚗' },
    { id: 'motorcycle', name: 'Xe máy', icon: '🏍️' },
    { id: 'electric', name: 'Xe điện', icon: '⚡' },
    { id: 'battery', name: 'Pin & Phụ kiện', icon: '🔋' }
  ]

  const carBrands = ['VinFast', 'Toyota', 'Honda', 'Mazda', 'Hyundai', 'Kia', 'Ford', 'Mitsubishi', 'Mercedes-Benz', 'BMW', 'Audi', 'Lexus']
  const motorcycleBrands = ['Honda', 'Yamaha', 'Suzuki', 'SYM', 'Piaggio', 'Vespa']
  const electricBrands = ['VinFast', 'Yadea', 'Pega', 'DatBike', 'Anbico', 'Vinfast', 'Hkbike']
  const conditions = ['Mới', 'Đã sử dụng (Còn mới)', 'Đã sử dụng (Tốt)', 'Đã sử dụng (Trung bình)']
  const transmissions = ['Số sàn', 'Số tự động', 'Bán tự động']


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

  const handleNext = () => {
    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  const handlePrev = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async () => {
    // Call API to submit listing
    console.log('Submitting:', formData)
    alert('Đăng tin thành công!')
    navigate('/')
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
              <div className="step-label">Hình ảnh & Video</div>
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
                  Tiếp tục
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="form-step">
              <h2 className="step-title">Thông tin chi tiết</h2>
              <div className="form-group">
                <label>Tiêu đề tin đăng *</label>
                <input
                  type="text"
                  placeholder="VD: Toyota Camry 2020 màu đen, đi 20.000km"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
                <small>Tối thiểu 30 ký tự, tối đa 100 ký tự</small>
              </div>

              <div className="form-group">
                <label>Mô tả chi tiết *</label>
                <textarea
                  rows="6"
                  placeholder="Mô tả chi tiết về sản phẩm của bạn..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
                <small>Tối thiểu 100 ký tự</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Hãng xe *</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                  >
                    <option value="">Chọn hãng xe</option>
                    {(formData.category === 'car' ? carBrands : 
                      formData.category === 'motorcycle' ? motorcycleBrands : 
                      electricBrands).map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Dòng xe</label>
                  <input
                    type="text"
                    placeholder="VD: Camry, Vios..."
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Năm sản xuất *</label>
                  <input
                    type="number"
                    placeholder="VD: 2020"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Số km đã đi</label>
                  <input
                    type="text"
                    placeholder="VD: 20000"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
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

                <div className="form-group">
                  <label>Hộp số</label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => handleInputChange('transmission', e.target.value)}
                  >
                    <option value="">Chọn hộp số</option>
                    {transmissions.map(trans => (
                      <option key={trans} value={trans}>{trans}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Giá bán *</label>
                <input
                  type="text"
                  placeholder="VD: 500000000"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.negotiable}
                    onChange={(e) => handleInputChange('negotiable', e.target.checked)}
                  />
                  Có thể thương lượng
                </label>
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
              <h2 className="step-title">Hình ảnh & Video</h2>
              <div className="upload-section">
                <div className="upload-info">
                  <p>📸 Thêm ít nhất 3 ảnh để tin đăng của bạn hấp dẫn hơn</p>
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
                    </label>
                  )}
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
                  </select>

                  <select
                    value={formData.location.district}
                    onChange={(e) => handleLocationChange('district', e.target.value)}
                  >
                    <option value="">Quận/Huyện</option>
                    <option value="cg">Cầu Giấy</option>
                    <option value="dd">Đống Đa</option>
                    <option value="hbt">Hai Bà Trưng</option>
                  </select>

                  <select
                    value={formData.location.ward}
                    onChange={(e) => handleLocationChange('ward', e.target.value)}
                  >
                    <option value="">Phường/Xã</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Số nhà, tên đường..."
                  value={formData.location.address}
                  onChange={(e) => handleLocationChange('address', e.target.value)}
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
                  placeholder="Nhập số điện thoại"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
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
            {formData.images.length > 0 && (
              <img src={formData.images[0]} alt="Preview" className="preview-image" />
            )}
            <div className="preview-content">
              <h4>{formData.title || 'Tiêu đề tin đăng'}</h4>
              <div className="preview-price">{formData.price ? `${parseInt(formData.price).toLocaleString('vi-VN')} đ` : 'Giá bán'}</div>
              <div className="preview-specs">
                {formData.year && <span>{formData.year}</span>}
                {formData.mileage && <span>{formData.mileage} km</span>}
                {formData.transmission && <span>{formData.transmission}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostListing
