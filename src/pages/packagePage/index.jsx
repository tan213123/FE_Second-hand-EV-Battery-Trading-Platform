import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchActivePackages, clearError } from '../../redux/packageSlice'
import { createOrder } from '../../redux/orderSlice'
import { createVnpayPaymentUrl, clearVnpayUrl } from '../../redux/paymentSlice'
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
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Redux state
  const { activePackages = [], loading: packagesLoading = false, error: packagesError = null } = 
    useSelector((state) => state.package) || {}
  const { loading: orderLoading = false } = useSelector((state) => state.order) || {}
  const { vnpayUrl = null, loading: paymentLoading = false } = useSelector((state) => state.payment) || {}
  const member = useSelector((state) => state.member)

  // Fetch packages từ backend
  useEffect(() => {
    dispatch(fetchActivePackages())
  }, [dispatch])

  // Redirect khi có VNPAY URL (fallback - không dùng nữa vì redirect trực tiếp trong handleVnpayPayment)
  // useEffect(() => {
  //   if (vnpayUrl) {
  //     console.log('Redirecting via useEffect to:', vnpayUrl)
  //     window.location.href = vnpayUrl
  //     dispatch(clearVnpayUrl())
  //   }
  // }, [vnpayUrl, dispatch])

  // Clear error khi unmount
  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  // Map backend data to UI format (hoặc có thể cập nhật UI để match backend)
  const packages = activePackages.map((pkg) => {
    // Map package từ backend về format UI hiện tại
    const iconMap = {
      'Gói Tiêu chuẩn': '⭐',
      'Gói Pro': '👑',
      'Gói Đấu giá': '💼',
    }
    const colorMap = {
      'Gói Tiêu chuẩn': '#10b981',
      'Gói Pro': '#f59e0b',
      'Gói Đấu giá': '#8b5cf6',
    }
    
    return {
      id: pkg.packageId,
      packageId: pkg.packageId, // Giữ để dùng khi tạo order
      name: pkg.name,
      price: pkg.price,
      duration: `${pkg.durationDays} ngày`,
      durationDays: pkg.durationDays,
      numberOfPost: pkg.numberOfPost,
      icon: iconMap[pkg.name] || '📦',
      color: colorMap[pkg.name] || '#6366f1',
      description: pkg.description,
      // Features có thể lấy từ description hoặc hardcode theo name
      features: generateFeatures(pkg),
      popular: pkg.name.includes('Pro') || pkg.name.includes('Pro'),
    }
  })

  // Helper để generate features từ package data
  function generateFeatures(pkg) {
    const baseFeatures = [
      { text: `Đăng ${pkg.numberOfPost} tin`, included: true },
      { text: `Hiển thị trong ${pkg.durationDays} ngày`, included: true },
      { text: 'Được đẩy tin', included: true },
      { text: 'Hiển thị trên trang chủ', included: true },
    ]
    
    if (pkg.name.includes('Pro') || pkg.name.includes('Đấu giá')) {
      return [
        ...baseFeatures,
        { text: 'Đăng không giới hạn', included: true },
        { text: 'Hỗ trợ VIP', included: true },
        { text: 'Nhãn "Tin nổi bật"', included: true },
        { text: 'Ưu tiên hiển thị hàng đầu', included: true },
        { text: 'Hỗ trợ 24/7', included: true },
      ]
    }
    
    return [
      ...baseFeatures,
      { text: 'Nhãn "Tin nổi bật"', included: true },
      { text: 'Ưu tiên hiển thị', included: false },
      { text: 'Hỗ trợ 24/7', included: false },
    ]
  }

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg)
    setShowPaymentModal(true)
  }

  const handleVnpayPayment = async (pkg) => {
    // Kiểm tra đăng nhập
    if (!member?.memberId) {
      alert('Vui lòng đăng nhập để tiếp tục')
      navigate('/login')
      return
    }

    console.log('Starting payment process for package:', pkg)

    try {
      // 1. Tạo Order
      console.log('Creating order...')
      const orderResult = await dispatch(createOrder({
        memberId: member.memberId,
        packageId: pkg.packageId,
      }))

      console.log('Order result:', orderResult)

      if (createOrder.fulfilled.match(orderResult)) {
        const orderId = orderResult.payload.orderId
        console.log('Order created successfully, orderId:', orderId)

        // 2. Tạo VNPAY Payment URL
        console.log('Creating VNPAY payment URL...')
        const paymentResult = await dispatch(createVnpayPaymentUrl(orderId))

        console.log('Payment result:', paymentResult)

        if (createVnpayPaymentUrl.fulfilled.match(paymentResult)) {
          const paymentUrl = paymentResult.payload.url
          console.log('Payment URL received:', paymentUrl)
          
          // Đóng modal trước
          setShowPaymentModal(false)
          
          // Redirect trực tiếp đến VNPAY
          if (paymentUrl && paymentUrl.startsWith('http')) {
            console.log('Redirecting to VNPAY...')
            window.location.href = paymentUrl
          } else {
            console.error('Invalid payment URL:', paymentUrl)
            alert('Lỗi: Không nhận được liên kết thanh toán hợp lệ')
          }
        } else {
          console.error('Payment URL creation failed:', paymentResult.payload)
          alert('Lỗi tạo liên kết thanh toán: ' + (paymentResult.payload || 'Unknown error'))
        }
      } else {
        console.error('Order creation failed:', orderResult.payload)
        alert('Lỗi tạo đơn hàng: ' + (orderResult.payload || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error in payment process:', error)
      alert('Có lỗi xảy ra, vui lòng thử lại: ' + (error.message || 'Unknown error'))
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  // Loading state
  if (packagesLoading) {
    return (
      <div className="package-page">
        <div className="package-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải danh sách gói dịch vụ...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (packagesError) {
    return (
      <div className="package-page">
        <div className="package-container">
          <div className="error-container">
            <p>Lỗi: {packagesError}</p>
            <button onClick={() => dispatch(fetchActivePackages())}>
              Thử lại
            </button>
          </div>
        </div>
      </div>
    )
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
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleVnpayPayment(selectedPackage)}
                    disabled={orderLoading || paymentLoading}
                  >
                    {orderLoading || paymentLoading ? 'Đang xử lý...' : '💳 Thanh toán VNPAY'}
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
