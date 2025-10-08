import './index.scss'

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Column 1: Hỗ trợ khách hàng */}
          <div className="footer-column">
            <h3 className="footer-title">Hỗ trợ khách hàng</h3>
            <ul className="footer-links">
              <li><a href="#">Trung tâm trợ giúp</a></li>
              <li><a href="#">An toàn mua bán</a></li>
              <li><a href="#">Liên hệ hỗ trợ</a></li>
            </ul>
          </div>

          {/* Column 2: Về Chợ Tốt */}
          <div className="footer-column">
            <h3 className="footer-title">Về EcoXe</h3>
            <ul className="footer-links">
              <li><a href="#">Giới thiệu</a></li>
              <li><a href="#">Quy chế hoạt động sàn</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Giải quyết tranh chấp</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Truyền thông</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          {/* Column 3: Liên kết */}
          <div className="footer-column">
            <h3 className="footer-title">Liên kết</h3>
            <div className="contact-info">
              <p className="contact-item">
                <strong>Email:</strong> <a href="mailto:trogiup@ecoxe.vn">trogiup@ecoxe.vn</a>
              </p>
              <p className="contact-item">
                <strong>CSKH:</strong> 19003003(1.000đ/phút)
              </p>
              <p className="contact-item">
                <strong>Địa chỉ:</strong> Tầng 18, Toà nhà UOA, Số 6 đường Tân Trào, Phường Tân Mỹ, Thành phố Hồ Chí Minh, Việt Nam
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
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
