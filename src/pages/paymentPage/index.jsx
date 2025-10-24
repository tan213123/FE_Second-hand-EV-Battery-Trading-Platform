import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './index.scss'

const PaymentPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [paymentData, setPaymentData] = useState(null)
  const [selectedMethod, setSelectedMethod] = useState('vnpay')
  const [isProcessing, setIsProcessing] = useState(false)
  const [countdown, setCountdown] = useState(900) // 15 phút

  // Lấy dữ liệu thanh toán từ state hoặc query params
  useEffect(() => {
    const state = location.state
    if (state?.paymentData) {
      setPaymentData(state.paymentData)
    } else {
      // Fallback data nếu không có state
      setPaymentData({
        orderId: `ECO${Date.now()}`,
        amount: 500000,
        description: 'Phí tham gia đấu giá',
        packageName: 'Gói Đấu giá',
        customerName: 'Nguyễn Văn A',
        customerEmail: 'nguyenvana@email.com',
        customerPhone: '0901234567'
      })
    }
  }, [location.state])

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate VNPAY payment process
    setTimeout(() => {
      // Trong thực tế, đây sẽ là API call đến VNPAY
      const vnpayUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${paymentData.amount * 100}&vnp_Command=pay&vnp_CreateDate=${new Date().toISOString().replace(/[-:]/g, '').replace('T', '').substring(0, 14)}&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=${encodeURIComponent(paymentData.description)}&vnp_OrderType=other&vnp_ReturnUrl=${encodeURIComponent(window.location.origin + '/payment/result')}&vnp_TmnCode=ECOXETEST&vnp_TxnRef=${paymentData.orderId}&vnp_Version=2.1.0&vnp_SecureHash=testhash`
      
      // Redirect to VNPAY
      window.location.href = vnpayUrl
    }, 2000)
  }

  const handleCancel = () => {
    navigate(-1)
  }

  if (!paymentData) {
    return (
      <div className="payment-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Header */}
        <div className="payment-header">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">🔋</span>
              <span className="logo-text">EcoXe</span>
            </div>
            <div className="payment-title">
              <h1>Thanh toán an toàn</h1>
              <p>Được bảo vệ bởi VNPAY</p>
            </div>
          </div>
          <div className="countdown-timer">
            <div className="timer-icon">⏰</div>
            <div className="timer-text">
              <span>Thời gian còn lại:</span>
              <span className="timer-value">{formatTime(countdown)}</span>
            </div>
          </div>
        </div>

        {/* Payment Content */}
        <div className="payment-content">
          <div className="payment-info">
            {/* Order Summary */}
            <div className="order-summary">
              <h2>Thông tin đơn hàng</h2>
              <div className="order-details">
                <div className="detail-row">
                  <span className="label">Mã đơn hàng:</span>
                  <span className="value">{paymentData.orderId}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Sản phẩm:</span>
                  <span className="value">{paymentData.packageName || paymentData.description}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Khách hàng:</span>
                  <span className="value">{paymentData.customerName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{paymentData.customerEmail}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Số điện thoại:</span>
                  <span className="value">{paymentData.customerPhone}</span>
                </div>
                <div className="detail-row total">
                  <span className="label">Tổng thanh toán:</span>
                  <span className="value price">{formatPrice(paymentData.amount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-methods">
              <h2>Chọn phương thức thanh toán</h2>
              
              <div className="method-options">
                <div 
                  className={`method-option ${selectedMethod === 'vnpay' ? 'selected' : ''}`}
                  onClick={() => setSelectedMethod('vnpay')}
                >
                  <div className="method-icon">
                    <img src="https://sandbox.vnpayment.vn/merchant_website/assets/images/logo.svg" alt="VNPAY" />
                  </div>
                  <div className="method-info">
                    <h3>VNPAY</h3>
                    <p>Thanh toán qua VNPAY - An toàn, nhanh chóng</p>
                    <div className="method-features">
                      <span>💳 Thẻ ATM</span>
                      <span>🏦 Internet Banking</span>
                      <span>📱 Ví điện tử</span>
                    </div>
                  </div>
                  <div className="method-radio">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="vnpay"
                      checked={selectedMethod === 'vnpay'}
                      onChange={() => setSelectedMethod('vnpay')}
                    />
                  </div>
                </div>

                <div 
                  className={`method-option ${selectedMethod === 'bank' ? 'selected' : ''}`}
                  onClick={() => setSelectedMethod('bank')}
                >
                  <div className="method-icon">
                    <span className="bank-icon">🏦</span>
                  </div>
                  <div className="method-info">
                    <h3>Chuyển khoản ngân hàng</h3>
                    <p>Chuyển khoản trực tiếp đến tài khoản ngân hàng</p>
                    <div className="method-features">
                      <span>⚡ Xử lý nhanh</span>
                      <span>🔒 An toàn</span>
                    </div>
                  </div>
                  <div className="method-radio">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="bank"
                      checked={selectedMethod === 'bank'}
                      onChange={() => setSelectedMethod('bank')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* VNPAY Payment Form */}
            {selectedMethod === 'vnpay' && (
              <div className="vnpay-payment">
                <div className="vnpay-info">
                  <div className="vnpay-logo">
                    <img src="https://sandbox.vnpayment.vn/merchant_website/assets/images/logo.svg" alt="VNPAY" />
                  </div>
                  <div className="vnpay-details">
                    <h3>Thanh toán qua VNPAY</h3>
                    <p>Bạn sẽ được chuyển hướng đến trang thanh toán VNPAY để hoàn tất giao dịch</p>
                    <div className="vnpay-features">
                      <div className="feature-item">
                        <span className="feature-icon">🔒</span>
                        <span>Bảo mật SSL 256-bit</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">⚡</span>
                        <span>Xử lý tức thì</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">📱</span>
                        <span>Hỗ trợ đa nền tảng</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Transfer Form */}
            {selectedMethod === 'bank' && (
              <div className="bank-transfer">
                <div className="bank-info">
                  <h3>Thông tin chuyển khoản</h3>
                  <div className="bank-details">
                    <div className="bank-row">
                      <span className="bank-label">Ngân hàng:</span>
                      <span className="bank-value">Vietcombank</span>
                    </div>
                    <div className="bank-row">
                      <span className="bank-label">Số tài khoản:</span>
                      <span className="bank-value">1234567890</span>
                    </div>
                    <div className="bank-row">
                      <span className="bank-label">Chủ tài khoản:</span>
                      <span className="bank-value">CONG TY ECOXE</span>
                    </div>
                    <div className="bank-row">
                      <span className="bank-label">Nội dung chuyển khoản:</span>
                      <span className="bank-value">{paymentData.orderId}</span>
                    </div>
                    <div className="bank-row total">
                      <span className="bank-label">Số tiền:</span>
                      <span className="bank-value price">{formatPrice(paymentData.amount)}</span>
                    </div>
                  </div>
                  
                  <div className="qr-code-section">
                    <div className="qr-code">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`Vietcombank|1234567890|CONG TY ECOXE|${paymentData.amount}|${paymentData.orderId}`)}`}
                        alt="QR Code"
                      />
                    </div>
                    <div className="qr-info">
                      <p>Quét mã QR để chuyển khoản nhanh</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Actions */}
          <div className="payment-actions">
            <button 
              className="btn-cancel"
              onClick={handleCancel}
            >
              Hủy thanh toán
            </button>
            <button 
              className={`btn-pay ${isProcessing ? 'processing' : ''}`}
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="spinner"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  {selectedMethod === 'vnpay' ? 'Thanh toán VNPAY' : 'Xác nhận chuyển khoản'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security Info */}
        <div className="security-info">
          <div className="security-badges">
            <div className="security-badge">
              <span className="badge-icon">🔒</span>
              <span className="badge-text">SSL 256-bit</span>
            </div>
            <div className="security-badge">
              <span className="badge-icon">🛡️</span>
              <span className="badge-text">Bảo mật PCI DSS</span>
            </div>
            <div className="security-badge">
              <span className="badge-icon">✅</span>
              <span className="badge-text">Được VNPAY bảo vệ</span>
            </div>
          </div>
          <p className="security-note">
            Thông tin thanh toán của bạn được mã hóa và bảo mật tuyệt đối. 
            Chúng tôi không lưu trữ thông tin thẻ của bạn.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
