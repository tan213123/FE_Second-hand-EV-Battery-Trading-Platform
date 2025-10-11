import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'

const PostAuction = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    startingBid: '',
    reservePrice: '',
    depositAmount: '',
    auctionDuration: '24',
    startTime: 'immediate',
    scheduledTime: '',
    condition: '',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    transmission: '',
    fuelType: '',
    color: '',
    location: {
      city: '',
      district: '',
      ward: '',
      address: ''
    },
    contactName: '',
    contactPhone: '',
    images: [],
    videos: [],
    terms: false
  })

  const categories = [
    { id: 'car', name: 'Ô tô', icon: '🚗' },
    { id: 'motorcycle', name: 'Xe máy', icon: '🏍️' },
    { id: 'electric', name: 'Xe điện', icon: '⚡' },
    { id: 'battery', name: 'Pin & Phụ kiện', icon: '🔋' }
  ]

  const carBrands = ['VinFast', 'Toyota', 'Honda', 'Mazda', 'Hyundai', 'Kia', 'Ford', 'Mitsubishi', 'Mercedes-Benz', 'BMW', 'Audi', 'Lexus']
  const motorcycleBrands = ['Honda', 'Yamaha', 'Suzuki', 'SYM', 'Piaggio', 'Vespa']
  const electricBrands = ['VinFast', 'Yadea', 'Pega', 'DatBike', 'Anbico', 'Hkbike']
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
    console.log('Submitting auction:', formData)
    alert('Đăng sản phẩm đấu giá thành công! Chúng tôi sẽ xem xét và phê duyệt trong vòng 24h.')
    navigate('/auction')
  }

  const calculateDepositAmount = () => {
    if (formData.startingBid) {
      const deposit = parseInt(formData.startingBid) * 0.1
      return deposit.toLocaleString('vi-VN')
    }
    return '0'
  }

  return (
    <div className="post-auction-page">
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
              <div className="step-label">Thông tin sản phẩm</div>
            </div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Điều kiện đấu giá</div>
            </div>
            <div className={`step ${step >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">Hình ảnh</div>
            </div>
            <div className={`step ${step >= 5 ? 'active' : ''}`}>
              <div className="step-number">5</div>
              <div className="step-label">Xác nhận</div>
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

          {/* Step 2: Product Details */}
          {step === 2 && (
            <div className="form-step">
              <h2 className="step-title">Thông tin sản phẩm</h2>
              
              <div className="form-group">
                <label>Tiêu đề sản phẩm *</label>
                <input
                  type="text"
                  placeholder="VD: Toyota Camry 2020 màu đen - Đấu giá xe nguyên bản"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
                <small>Tiêu đề hấp dẫn sẽ thu hút nhiều người tham gia đấu giá hơn</small>
              </div>

              <div className="form-group">
                <label>Mô tả chi tiết *</label>
                <textarea
                  rows="8"
                  placeholder="Mô tả chi tiết về sản phẩm: tình trạng, lịch sử sử dụng, lý do bán..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
                <small>Mô tả càng chi tiết, người mua càng tin tưởng</small>
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
                  <label>Dòng xe *</label>
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

          {/* Step 3: Auction Terms */}
          {step === 3 && (
            <div className="form-step">
              <h2 className="step-title">Điều kiện đấu giá</h2>
              
              <div className="info-box">
                <h4>📋 Lưu ý quan trọng:</h4>
                <ul>
                  <li>Giá khởi điểm nên thấp hơn giá thị trường 20-30% để thu hút người tham gia</li>
                  <li>Giá dự trữ là mức giá tối thiểu bạn chấp nhận bán (không công khai)</li>
                  <li>Tiền đặt cọc thường là 10% giá khởi điểm</li>
                  <li>Thời gian đấu giá phổ biến: 24h, 48h, 72h</li>
                </ul>
              </div>

              <div className="form-group">
                <label>Giá khởi điểm *</label>
                <input
                  type="text"
                  placeholder="VD: 500000000"
                  value={formData.startingBid}
                  onChange={(e) => handleInputChange('startingBid', e.target.value)}
                />
                <small>Giá khởi điểm càng hợp lý, càng nhiều người tham gia</small>
              </div>

              <div className="form-group">
                <label>Giá dự trữ (Giá tối thiểu chấp nhận)</label>
                <input
                  type="text"
                  placeholder="VD: 600000000"
                  value={formData.reservePrice}
                  onChange={(e) => handleInputChange('reservePrice', e.target.value)}
                />
                <small>Không bắt buộc. Nếu không đạt giá này, bạn có quyền không bán</small>
              </div>

              <div className="form-group">
                <label>Tiền đặt cọc *</label>
                <input
                  type="text"
                  value={calculateDepositAmount()}
                  readOnly
                  disabled
                />
                <small>Tự động tính = 10% giá khởi điểm. Người thua sẽ được hoàn lại</small>
              </div>

              <div className="form-group">
                <label>Thời gian đấu giá *</label>
                <select
                  value={formData.auctionDuration}
                  onChange={(e) => handleInputChange('auctionDuration', e.target.value)}
                >
                  <option value="24">24 giờ</option>
                  <option value="48">48 giờ (2 ngày)</option>
                  <option value="72">72 giờ (3 ngày)</option>
                  <option value="120">120 giờ (5 ngày)</option>
                  <option value="168">168 giờ (7 ngày)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Thời điểm bắt đầu *</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="startTime"
                      value="immediate"
                      checked={formData.startTime === 'immediate'}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                    />
                    Bắt đầu ngay sau khi được duyệt
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="startTime"
                      value="scheduled"
                      checked={formData.startTime === 'scheduled'}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                    />
                    Lên lịch thời gian cụ thể
                  </label>
                </div>
                {formData.startTime === 'scheduled' && (
                  <input
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                )}
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

          {/* Step 4: Images */}
          {step === 4 && (
            <div className="form-step">
              <h2 className="step-title">Hình ảnh & Video</h2>
              <div className="upload-section">
                <div className="upload-info">
                  <p>📸 Thêm ít nhất 5 ảnh chất lượng cao</p>
                  <ul>
                    <li>Ảnh thực tế của sản phẩm, chụp từ nhiều góc độ</li>
                    <li>Không chỉnh sửa quá mức, ảnh phải trung thực</li>
                    <li>Tối đa 15 ảnh, mỗi ảnh tối đa 10MB</li>
                    <li>Hỗ trợ: JPG, PNG, HEIC</li>
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
                      {index === 0 && <div className="main-badge">Ảnh chính</div>}
                    </div>
                  ))}
                  {formData.images.length < 15 && (
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
                <button 
                  className="btn btn-primary" 
                  onClick={handleNext}
                  disabled={formData.images.length < 5}
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div className="form-step">
              <h2 className="step-title">Xác nhận thông tin</h2>
              
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

              <div className="summary-box">
                <h3>📝 Tóm tắt phiên đấu giá</h3>
                <div className="summary-item">
                  <span>Sản phẩm:</span>
                  <strong>{formData.title}</strong>
                </div>
                <div className="summary-item">
                  <span>Giá khởi điểm:</span>
                  <strong>{parseInt(formData.startingBid || 0).toLocaleString('vi-VN')} đ</strong>
                </div>
                {formData.reservePrice && (
                  <div className="summary-item">
                    <span>Giá dự trữ:</span>
                    <strong>{parseInt(formData.reservePrice).toLocaleString('vi-VN')} đ</strong>
                  </div>
                )}
                <div className="summary-item">
                  <span>Tiền đặt cọc:</span>
                  <strong>{calculateDepositAmount()} đ</strong>
                </div>
                <div className="summary-item">
                  <span>Thời gian đấu giá:</span>
                  <strong>{formData.auctionDuration} giờ</strong>
                </div>
                <div className="summary-item">
                  <span>Số lượng ảnh:</span>
                  <strong>{formData.images.length} ảnh</strong>
                </div>
              </div>

              <div className="terms-checkbox">
                <label>
                  <input 
                    type="checkbox" 
                    checked={formData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.checked)}
                  />
                  Tôi cam kết:
                </label>
                <ul>
                  <li>Thông tin sản phẩm là chính xác và trung thực</li>
                  <li>Sản phẩm là của tôi và có quyền bán</li>
                  <li>Chấp nhận bán nếu đạt giá dự trữ (nếu có)</li>
                  <li>Đã đọc và đồng ý với <a href="#">Quy định đấu giá</a></li>
                </ul>
              </div>

              <div className="form-actions">
                <button className="btn btn-secondary" onClick={handlePrev}>
                  Quay lại
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSubmit}
                  disabled={!formData.terms}
                >
                  Gửi phê duyệt
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preview Sidebar */}
        <div className="preview-sidebar">
          <div className="preview-card">
            <h3>Xem trước phiên đấu giá</h3>
            {formData.images.length > 0 && (
              <img src={formData.images[0]} alt="Preview" className="preview-image" />
            )}
            <div className="preview-content">
              <div className="preview-badge">🔨 Đấu giá</div>
              <h4>{formData.title || 'Tiêu đề sản phẩm'}</h4>
              <div className="preview-price-box">
                <div className="preview-label">Giá khởi điểm</div>
                <div className="preview-price">
                  {formData.startingBid ? `${parseInt(formData.startingBid).toLocaleString('vi-VN')} đ` : 'Chưa nhập'}
                </div>
              </div>
              <div className="preview-specs">
                {formData.year && <span>{formData.year}</span>}
                {formData.mileage && <span>{formData.mileage} km</span>}
                {formData.transmission && <span>{formData.transmission}</span>}
              </div>
              {formData.auctionDuration && (
                <div className="preview-duration">
                  ⏱ Thời gian: {formData.auctionDuration} giờ
                </div>
              )}
            </div>
          </div>

          <div className="help-card">
            <h4>💡 Mẹo để tăng giá bán</h4>
            <ul>
              <li>Chụp ảnh đẹp, nhiều góc độ</li>
              <li>Mô tả chi tiết, trung thực</li>
              <li>Giá khởi điểm hợp lý</li>
              <li>Chọn thời gian phù hợp</li>
              <li>Phản hồi nhanh câu hỏi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostAuction
