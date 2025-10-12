import { useState } from 'react'
import './index.scss'

// Icons
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const CrownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
)

function PackagePage() {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const packages = [

    {
      id: 2,
      name: 'Gói Tiêu chuẩn',
      type: 'standard',
      price: 50000,
      duration: '15 ngày',
      icon: '⭐',
      color: '#10b981',
      features: [
        { text: 'Đăng 3 tin', included: true },
        { text: 'Hiển thị trong 15 ngày', included: true },
        { text: 'Được đẩy tin 3 lần', included: true },
        { text: 'Hỗ trợ ưu tiên', included: true },
        { text: 'Hiển thị trên trang chủ', included: true },
        { text: 'Nhãn "Tin nổi bật"', included: true },
        { text: 'Ưu tiên hiển thị', included: false },
        { text: 'Hỗ trợ 24/7', included: false }
      ],
      popular: false
    },
    {
      id: 3,
      name: 'Gói Pro',
      type: 'pro',
      price: 150000,
      duration: '30 ngày',
      icon: '👑',
      color: '#f59e0b',
      features: [
        { text: 'Đăng không giới hạn', included: true },
        { text: 'Hiển thị trong 30 ngày', included: true },
        { text: 'Được đẩy tin không giới hạn', included: true },
        { text: 'Hỗ trợ VIP', included: true },
        { text: 'Hiển thị trên trang chủ', included: true },
        { text: 'Nhãn "Tin nổi bật"', included: true },
        { text: 'Ưu tiên hiển thị hàng đầu', included: true },
        { text: 'Hỗ trợ 24/7', included: true }
      ],
      popular: true
    },
    {
      id: 4,
      name: 'Gói Đấu giá',
      type: 'enterprise',
      price: 500000,
      duration: '90 ngày',
      icon: '💼',
      color: '#8b5cf6',
      features: [
        { text: 'Đăng không giới hạn', included: true },
        { text: 'Hiển thị trong 90 ngày', included: true },
        { text: 'Được đẩy tin không giới hạn', included: true },
        { text: 'Hỗ trợ VIP đặc biệt', included: true },
        { text: 'Luôn hiển thị trên trang chủ', included: true },
        { text: 'Nhãn "Đối tác ưu tiên"', included: true },
        { text: 'Ưu tiên hiển thị cao nhất', included: true },
        { text: 'Hỗ trợ 24/7 + Auction Account', included: true }
      ],
      popular: false
    }
  ]

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg)
    setShowPaymentModal(true)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <div className="package-page">
      <div className="package-container">
        <div className="page-header">
          <h1>Chọn gói đăng tin phù hợp</h1>
          <p>Nâng cao hiệu quả bán hàng với các gói dịch vụ của chúng tôi</p>
        </div>

        <div className="packages-grid">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`package-card ${pkg.popular ? 'popular' : ''}`}
              style={{ '--package-color': pkg.color }}
            >
              {pkg.popular && (
                <div className="popular-badge">
                  <StarIcon />
                  <span>Phổ biến nhất</span>
                </div>
              )}
              
              <div className="package-header">
                <div className="package-icon">{pkg.icon}</div>
                <h3 className="package-name">{pkg.name}</h3>
                <div className="package-price">
                  {pkg.price === 0 ? (
                    <span className="free-tag">MIỄN PHÍ</span>
                  ) : (
                    <>
                      <span className="price">{formatPrice(pkg.price)}</span>
                      <span className="duration">/{pkg.duration}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="package-features">
                {pkg.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`feature-item ${feature.included ? 'included' : 'excluded'}`}
                  >
                    <div className="feature-icon">
                      {feature.included ? <CheckIcon /> : '✕'}
                    </div>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              <button 
                className="btn-select-package"
                onClick={() => handleSelectPackage(pkg)}
              >
                {pkg.price === 0 ? 'Bắt đầu miễn phí' : 'Chọn gói này'}
              </button>
            </div>
          ))}
        </div>

        <div className="package-benefits">
          <h2>Tại sao nên nâng cấp gói đăng tin?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">🚀</div>
              <h3>Tăng tỷ lệ hiển thị</h3>
              <p>Tin của bạn sẽ được ưu tiên hiển thị ở vị trí cao hơn</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">👁️</div>
              <h3>Tiếp cận nhiều người</h3>
              <p>Xuất hiện trên trang chủ và các vị trí nổi bật</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">⚡</div>
              <h3>Bán nhanh hơn</h3>
              <p>Được đẩy tin thường xuyên giúp bán hàng nhanh chóng</p>
            </div>
           
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPackage && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setShowPaymentModal(false)}
            >
              <CloseIcon />
            </button>

            <div className="modal-header">
              <div className="modal-icon" style={{ backgroundColor: selectedPackage.color }}>
                {selectedPackage.icon}
              </div>
              <h2>Thanh toán {selectedPackage.name}</h2>
            </div>

            <div className="payment-info">
              <div className="info-row">
                <span className="label">Gói dịch vụ:</span>
                <span className="value">{selectedPackage.name}</span>
              </div>
              <div className="info-row">
                <span className="label">Thời hạn:</span>
                <span className="value">{selectedPackage.duration}</span>
              </div>
              <div className="info-row total">
                <span className="label">Tổng thanh toán:</span>
                <span className="value price-highlight">
                  {selectedPackage.price === 0 ? 'MIỄN PHÍ' : formatPrice(selectedPackage.price)}
                </span>
              </div>
            </div>

            {selectedPackage.price > 0 ? (
              <>
                <div className="payment-methods">
                  <h3>Phương thức thanh toán</h3>
                  <div className="qr-section">
                    <div className="qr-code">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=EcoXe-${selectedPackage.id}-${Date.now()}`}
                        alt="QR Code"
                      />
                    </div>
                    <div className="qr-info">
                      <p className="qr-title">Quét mã QR để thanh toán</p>
                      <div className="bank-info">
                        <p><strong>Ngân hàng:</strong> Vietcombank</p>
                        <p><strong>Số TK:</strong> 1234567890</p>
                        <p><strong>Chủ TK:</strong> CONG TY ECOXE</p>
                        <p><strong>Nội dung:</strong> ECOXE {selectedPackage.id} {Date.now().toString().slice(-6)}</p>
                      </div>
                      <div className="payment-note">
                        <p>⚠️ Vui lòng nhập đúng nội dung chuyển khoản để được xử lý tự động</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    className="btn btn-outline"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Hủy
                  </button>
                  <button className="btn btn-primary">
                    Tôi đã thanh toán
                  </button>
                </div>
              </>
            ) : (
              <div className="free-package-actions">
                <p className="free-note">✨ Gói miễn phí không cần thanh toán</p>
                <button 
                  className="btn btn-primary btn-block"
                  onClick={() => {
                    alert('Kích hoạt gói miễn phí thành công!')
                    setShowPaymentModal(false)
                  }}
                >
                  Kích hoạt ngay
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PackagePage
