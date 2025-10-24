import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './index.scss'

const PaymentResultPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate checking payment result
    setTimeout(() => {
      // Trong thực tế, đây sẽ là API call để kiểm tra kết quả thanh toán
      const urlParams = new URLSearchParams(location.search)
      const vnpResponseCode = urlParams.get('vnp_ResponseCode')
      
      if (vnpResponseCode === '00') {
        setResult({
          success: true,
          orderId: urlParams.get('vnp_TxnRef') || 'ECO' + Date.now(),
          amount: parseInt(urlParams.get('vnp_Amount')) / 100,
          transactionId: urlParams.get('vnp_TransactionNo'),
          message: 'Thanh toán thành công!'
        })
      } else {
        setResult({
          success: false,
          orderId: urlParams.get('vnp_TxnRef') || 'ECO' + Date.now(),
          message: 'Thanh toán thất bại. Vui lòng thử lại.'
        })
      }
      setLoading(false)
    }, 2000)
  }, [location.search])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const handleContinue = () => {
    if (result?.success) {
      navigate('/auction')
    } else {
      navigate('/packages')
    }
  }

  const handleRetry = () => {
    navigate('/payment')
  }

  if (loading) {
    return (
      <div className="payment-result-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Đang xử lý kết quả thanh toán...</h2>
          <p>Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-result-page">
      <div className="result-container">
        {/* Header */}
        <div className="result-header">
          <div className="logo">
            <span className="logo-icon">🔋</span>
            <span className="logo-text">EcoXe</span>
          </div>
        </div>

        {/* Result Content */}
        <div className="result-content">
          {result?.success ? (
            <div className="success-result">
              <div className="success-icon">
                <div className="checkmark">
                  <div className="checkmark-circle">
                    <div className="checkmark-stem"></div>
                    <div className="checkmark-kick"></div>
                  </div>
                </div>
              </div>
              
              <h1 className="result-title">Thanh toán thành công!</h1>
              <p className="result-message">
                Cảm ơn bạn đã sử dụng dịch vụ của EcoXe. 
                Giao dịch đã được xử lý thành công.
              </p>

              <div className="transaction-details">
                <h3>Chi tiết giao dịch</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Mã đơn hàng:</span>
                    <span className="detail-value">{result.orderId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Số tiền:</span>
                    <span className="detail-value price">{formatPrice(result.amount)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Mã giao dịch:</span>
                    <span className="detail-value">{result.transactionId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Thời gian:</span>
                    <span className="detail-value">{new Date().toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              <div className="success-features">
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span className="feature-text">Tài khoản đã được kích hoạt</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span className="feature-text">Có thể tham gia đấu giá ngay</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📧</span>
                  <span className="feature-text">Email xác nhận đã được gửi</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="error-result">
              <div className="error-icon">
                <div className="error-circle">
                  <div className="error-line error-line-1"></div>
                  <div className="error-line error-line-2"></div>
                </div>
              </div>
              
              <h1 className="result-title">Thanh toán thất bại</h1>
              <p className="result-message">
                {result?.message || 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.'}
              </p>

              <div className="error-details">
                <h3>Thông tin lỗi</h3>
                <div className="error-info">
                  <div className="error-item">
                    <span className="error-label">Mã đơn hàng:</span>
                    <span className="error-value">{result?.orderId}</span>
                  </div>
                  <div className="error-item">
                    <span className="error-label">Thời gian:</span>
                    <span className="error-value">{new Date().toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              <div className="error-suggestions">
                <h4>Gợi ý khắc phục:</h4>
                <ul>
                  <li>Kiểm tra lại thông tin thẻ/tài khoản</li>
                  <li>Đảm bảo tài khoản có đủ số dư</li>
                  <li>Thử lại với phương thức thanh toán khác</li>
                  <li>Liên hệ ngân hàng nếu cần thiết</li>
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="result-actions">
            {result?.success ? (
              <>
                <button 
                  className="btn-primary"
                  onClick={handleContinue}
                >
                  Tiếp tục đấu giá
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => navigate('/')}
                >
                  Về trang chủ
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn-primary"
                  onClick={handleRetry}
                >
                  Thử lại thanh toán
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => navigate('/packages')}
                >
                  Chọn gói khác
                </button>
              </>
            )}
          </div>
        </div>

        {/* Support Info */}
        <div className="support-info">
          <div className="support-content">
            <h3>Hỗ trợ khách hàng</h3>
            <p>
              Nếu bạn có bất kỳ thắc mắc nào về giao dịch, 
              vui lòng liên hệ với chúng tôi:
            </p>
            <div className="support-contacts">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span className="contact-text">Hotline: 1900 1234</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span className="contact-text">Email: support@ecoxe.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">💬</span>
                <span className="contact-text">Chat trực tuyến 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentResultPage
