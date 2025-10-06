import './index.scss'

// Social Media Icons
const LinkedInIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
)

const YouTubeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
)

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
            <div className="social-links">
              <a href="#" className="social-btn linkedin" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="#" className="social-btn youtube" aria-label="YouTube">
                <YouTubeIcon />
              </a>
              <a href="#" className="social-btn facebook" aria-label="Facebook">
                <FacebookIcon />
              </a>
            </div>
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
