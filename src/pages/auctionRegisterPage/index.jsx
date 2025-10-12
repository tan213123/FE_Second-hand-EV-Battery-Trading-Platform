import { useState } from 'react'
import './index.scss'

// Icons
const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
)

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
)

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>
)

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17,8 12,3 7,8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

function AuctionRegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    phone: '',
    email: '',
    idNumber: '',
    idIssueDate: '',
    idIssuePlace: '',
    dateOfBirth: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    
    // Financial Info
    depositAmount: '50000000',
    paymentMethod: 'bank_transfer',
    bankName: '',
    accountNumber: '',
    accountName: '',
    
    // Documents
    idCardFront: null,
    idCardBack: null,
    proofOfAddress: null,
    
    // Terms
    agreeTerms: false,
    agreePrivacy: false,
    agreeRules: false
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }))
    }
  }

  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên'
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại'
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email'
    if (!formData.idNumber.trim()) newErrors.idNumber = 'Vui lòng nhập số CMND/CCCD'
    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (formData.paymentMethod === 'bank_transfer') {
      if (!formData.bankName.trim()) newErrors.bankName = 'Vui lòng nhập tên ngân hàng'
      if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Vui lòng nhập số tài khoản'
      if (!formData.accountName.trim()) newErrors.accountName = 'Vui lòng nhập tên chủ tài khoản'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors = {}
    if (!formData.idCardFront) newErrors.idCardFront = 'Vui lòng tải ảnh mặt trước CMND/CCCD'
    if (!formData.idCardBack) newErrors.idCardBack = 'Vui lòng tải ảnh mặt sau CMND/CCCD'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep4 = () => {
    const newErrors = {}
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Vui lòng đồng ý với điều khoản sử dụng'
    if (!formData.agreePrivacy) newErrors.agreePrivacy = 'Vui lòng đồng ý với chính sách bảo mật'
    if (!formData.agreeRules) newErrors.agreeRules = 'Vui lòng đồng ý với quy định đấu giá'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    let isValid = false
    
    switch(step) {
      case 1:
        isValid = validateStep1()
        break
      case 2:
        isValid = validateStep2()
        break
      case 3:
        isValid = validateStep3()
        break
      case 4:
        isValid = validateStep4()
        break
      default:
        isValid = true
    }
    
    if (isValid && step < 4) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep4()) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      alert('Đăng ký tham gia đấu giá thành công! Chúng tôi sẽ xác nhận thông tin trong vòng 24h.')
      setIsSubmitting(false)
      setStep(5) // Success step
    }, 2000)
  }

  const steps = [
    { number: 1, title: 'Thông tin cá nhân', icon: <UserIcon /> },
    { number: 2, title: 'Thông tin thanh toán', icon: <CreditCardIcon /> },
    { number: 3, title: 'Tải giấy tờ', icon: <FileTextIcon /> },
    { number: 4, title: 'Xác nhận', icon: <ShieldIcon /> }
  ]

  if (step === 5) {
    return (
      <div className="auction-register-page">
        <div className="success-container">
          <div className="success-icon">
            <CheckCircleIcon />
          </div>
          <h1>Đăng ký thành công!</h1>
          <p>Cảm ơn bạn đã đăng ký tham gia đấu giá trên EcoXe.</p>
          <p>Chúng tôi sẽ xác nhận thông tin của bạn trong vòng 24 giờ và gửi kết quả qua email.</p>
          <div className="success-info">
            <div className="info-item">
              <strong>Mã đăng ký:</strong>
              <span>DG{Date.now().toString().slice(-8)}</span>
            </div>
            <div className="info-item">
              <strong>Email:</strong>
              <span>{formData.email}</span>
            </div>
            <div className="info-item">
              <strong>Số tiền đặt cọc:</strong>
              <span className="highlight">50,000,000 đ</span>
            </div>
          </div>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
              Về trang chủ
            </button>
            <button className="btn btn-outline" onClick={() => window.location.href = '/auction'}>
              Xem phiên đấu giá
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auction-register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Đăng ký tham gia đấu giá</h1>
          <p>Hoàn thành các bước dưới đây để tham gia đấu giá xe điện</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          {steps.map((s, index) => (
            <div key={s.number} className={`step-item ${step >= s.number ? 'active' : ''} ${step > s.number ? 'completed' : ''}`}>
              <div className="step-number">
                {step > s.number ? <CheckCircleIcon /> : <span>{s.number}</span>}
              </div>
              <div className="step-info">
                <div className="step-icon">{s.icon}</div>
                <span className="step-title">{s.title}</span>
              </div>
              {index < steps.length - 1 && <div className="step-line"></div>}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="register-form">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="form-section">
              <h2>Thông tin cá nhân</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Họ và tên <span className="required">*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên"
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label>Số điện thoại <span className="required">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>Email <span className="required">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Nhập email"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Số CMND/CCCD <span className="required">*</span></label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    placeholder="Nhập số CMND/CCCD"
                    className={errors.idNumber ? 'error' : ''}
                  />
                  {errors.idNumber && <span className="error-message">{errors.idNumber}</span>}
                </div>

                <div className="form-group">
                  <label>Ngày cấp</label>
                  <input
                    type="date"
                    name="idIssueDate"
                    value={formData.idIssueDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Nơi cấp</label>
                  <input
                    type="text"
                    name="idIssuePlace"
                    value={formData.idIssuePlace}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Công an TP.HCM"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Địa chỉ thường trú <span className="required">*</span></label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ chi tiết"
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-group">
                  <label>Tỉnh/Thành phố</label>
                  <select name="city" value={formData.city} onChange={handleInputChange}>
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    <option value="hanoi">Hà Nội</option>
                    <option value="hcm">TP. Hồ Chí Minh</option>
                    <option value="danang">Đà Nẵng</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Quận/Huyện</label>
                  <select name="district" value={formData.district} onChange={handleInputChange}>
                    <option value="">Chọn Quận/Huyện</option>
                    <option value="district1">Quận 1</option>
                    <option value="district2">Quận 2</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Phường/Xã</label>
                  <select name="ward" value={formData.ward} onChange={handleInputChange}>
                    <option value="">Chọn Phường/Xã</option>
                    <option value="ward1">Phường 1</option>
                    <option value="ward2">Phường 2</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment Information */}
          {step === 2 && (
            <div className="form-section">
              <h2>Thông tin thanh toán đặt cọc</h2>
              
              <div className="deposit-info">
                <div className="info-card">
                  <h3>Số tiền đặt cọc</h3>
                  <div className="amount">50,000,000 đ</div>
                  <p>Số tiền này sẽ được hoàn trả nếu bạn không trúng đấu giá</p>
                </div>
              </div>

              <div className="form-group">
                <label>Phương thức thanh toán</label>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={handleInputChange}
                    />
                    <div className="option-content">
                      <CreditCardIcon />
                      <span>Chuyển khoản ngân hàng</span>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                    />
                    <div className="option-content">
                      <span>💵</span>
                      <span>Tiền mặt tại văn phòng</span>
                    </div>
                  </label>
                </div>
              </div>

              {formData.paymentMethod === 'bank_transfer' && (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Tên ngân hàng <span className="required">*</span></label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: Vietcombank"
                      className={errors.bankName ? 'error' : ''}
                    />
                    {errors.bankName && <span className="error-message">{errors.bankName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Số tài khoản <span className="required">*</span></label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder="Nhập số tài khoản"
                      className={errors.accountNumber ? 'error' : ''}
                    />
                    {errors.accountNumber && <span className="error-message">{errors.accountNumber}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label>Tên chủ tài khoản <span className="required">*</span></label>
                    <input
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      placeholder="Nhập tên chủ tài khoản"
                      className={errors.accountName ? 'error' : ''}
                    />
                    {errors.accountName && <span className="error-message">{errors.accountName}</span>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Documents Upload */}
          {step === 3 && (
            <div className="form-section">
              <h2>Tải giấy tờ cần thiết</h2>
              
              <div className="upload-grid">
                <div className="upload-group">
                  <label>CMND/CCCD (Mặt trước) <span className="required">*</span></label>
                  <div className={`upload-area ${errors.idCardFront ? 'error' : ''}`}>
                    {formData.idCardFront ? (
                      <div className="file-preview">
                        <FileTextIcon />
                        <span>{formData.idCardFront.name}</span>
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, idCardFront: null }))}>
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="upload-label">
                        <UploadIcon />
                        <span>Tải ảnh mặt trước</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'idCardFront')}
                          hidden
                        />
                      </label>
                    )}
                  </div>
                  {errors.idCardFront && <span className="error-message">{errors.idCardFront}</span>}
                </div>

                <div className="upload-group">
                  <label>CMND/CCCD (Mặt sau) <span className="required">*</span></label>
                  <div className={`upload-area ${errors.idCardBack ? 'error' : ''}`}>
                    {formData.idCardBack ? (
                      <div className="file-preview">
                        <FileTextIcon />
                        <span>{formData.idCardBack.name}</span>
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, idCardBack: null }))}>
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="upload-label">
                        <UploadIcon />
                        <span>Tải ảnh mặt sau</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'idCardBack')}
                          hidden
                        />
                      </label>
                    )}
                  </div>
                  {errors.idCardBack && <span className="error-message">{errors.idCardBack}</span>}
                </div>

                <div className="upload-group full-width">
                  <label>Giấy tờ chứng minh địa chỉ (Tùy chọn)</label>
                  <div className="upload-area">
                    {formData.proofOfAddress ? (
                      <div className="file-preview">
                        <FileTextIcon />
                        <span>{formData.proofOfAddress.name}</span>
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, proofOfAddress: null }))}>
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="upload-label">
                        <UploadIcon />
                        <span>Tải giấy tờ (Hóa đơn điện, nước...)</span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileChange(e, 'proofOfAddress')}
                          hidden
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="upload-note">
                <p>📋 <strong>Lưu ý:</strong></p>
                <ul>
                  <li>Ảnh chụp rõ nét, đầy đủ 4 góc</li>
                  <li>Định dạng: JPG, PNG, PDF</li>
                  <li>Dung lượng tối đa: 5MB/file</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="form-section">
              <h2>Xác nhận thông tin</h2>
              
              <div className="summary-section">
                <h3>Thông tin cá nhân</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="label">Họ tên:</span>
                    <span className="value">{formData.fullName}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Số điện thoại:</span>
                    <span className="value">{formData.phone}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Email:</span>
                    <span className="value">{formData.email}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">CMND/CCCD:</span>
                    <span className="value">{formData.idNumber}</span>
                  </div>
                  <div className="summary-item full-width">
                    <span className="label">Địa chỉ:</span>
                    <span className="value">{formData.address}</span>
                  </div>
                </div>
              </div>

              <div className="summary-section">
                <h3>Thông tin thanh toán</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="label">Số tiền đặt cọc:</span>
                    <span className="value highlight">50,000,000 đ</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Phương thức:</span>
                    <span className="value">
                      {formData.paymentMethod === 'bank_transfer' ? 'Chuyển khoản ngân hàng' : 'Tiền mặt'}
                    </span>
                  </div>
                  {formData.paymentMethod === 'bank_transfer' && (
                    <>
                      <div className="summary-item">
                        <span className="label">Ngân hàng:</span>
                        <span className="value">{formData.bankName}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Số TK:</span>
                        <span className="value">{formData.accountNumber}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="terms-section">
                <h3>Điều khoản và điều kiện</h3>
                
                <div className="term-item">
                  <label className={errors.agreeTerms ? 'error' : ''}>
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                    />
                    <span>Tôi đồng ý với <a href="/terms" target="_blank">Điều khoản sử dụng</a> của EcoXe</span>
                  </label>
                  {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
                </div>

                <div className="term-item">
                  <label className={errors.agreePrivacy ? 'error' : ''}>
                    <input
                      type="checkbox"
                      name="agreePrivacy"
                      checked={formData.agreePrivacy}
                      onChange={handleInputChange}
                    />
                    <span>Tôi đồng ý với <a href="/privacy" target="_blank">Chính sách bảo mật</a></span>
                  </label>
                  {errors.agreePrivacy && <span className="error-message">{errors.agreePrivacy}</span>}
                </div>

                <div className="term-item">
                  <label className={errors.agreeRules ? 'error' : ''}>
                    <input
                      type="checkbox"
                      name="agreeRules"
                      checked={formData.agreeRules}
                      onChange={handleInputChange}
                    />
                    <span>Tôi đã đọc và hiểu <a href="/auction-rules" target="_blank">Quy định đấu giá</a></span>
                  </label>
                  {errors.agreeRules && <span className="error-message">{errors.agreeRules}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            {step > 1 && (
              <button type="button" className="btn btn-outline" onClick={handlePrevStep}>
                ← Quay lại
              </button>
            )}
            {step < 4 ? (
              <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                Tiếp tục →
              </button>
            ) : (
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AuctionRegisterPage
