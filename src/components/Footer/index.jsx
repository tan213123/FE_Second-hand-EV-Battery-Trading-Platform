import './index.scss'

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-column">
            <h3 className="footer-title">Hỗ trợ khách hàng</h3>
            <ul className="footer-links">
              <li><a href="#">Trung tâm trợ giúp</a></li>
              <li><a href="#">An toàn mua bán</a></li>
              <li><a href="#">Quy định đăng tin</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-title">Về EcoXe</h3>
            <ul className="footer-links">
              <li><a href="#">Giới thiệu</a></li>
              <li><a href="#">Quy chế hoạt động sàn</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Liên hệ</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-title">Liên kết</h3>
            <div className="contact-info">
              <div className="contact-item">
                <strong>Email:</strong> <a href="mailto:trogiup@ecoxe.vn">trogiup@ecoxe.vn</a>
              </div>
              <div className="contact-item">
                <strong>CSKH:</strong> 19003003 (1.000đ/phút)
              </div>
              <div className="contact-item">
                <strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            © 2024 EcoXe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
