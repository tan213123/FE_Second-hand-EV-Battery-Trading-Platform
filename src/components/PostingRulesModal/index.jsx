import { useEffect } from "react";
import "./index.scss";

const PostingRulesModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="posting-rules-modal-overlay" onClick={onClose}>
      <div className="posting-rules-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Quy định đăng tin của EcoXe</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-content">
          <div className="rules-section">
            <h3>1. Thông tin sản phẩm</h3>
            <ul>
              <li>Tiêu đề tin đăng phải rõ ràng, mô tả chính xác sản phẩm</li>
              <li>Thông tin sản phẩm phải trung thực, không được gian lận</li>
              <li>Giá bán phải được công khai, minh bạch</li>
              <li>Hình ảnh sản phẩm phải là ảnh thật, không được sử dụng ảnh mạng</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>2. Nội dung tin đăng</h3>
            <ul>
              <li>Không được đăng tin có nội dung vi phạm pháp luật</li>
              <li>Không được sử dụng ngôn ngữ thô tục, xúc phạm</li>
              <li>Không được đăng tin quảng cáo, spam</li>
              <li>Nội dung phải phù hợp với danh mục đã chọn</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>3. Hình ảnh sản phẩm</h3>
            <ul>
              <li>Phải có ít nhất 1 hình ảnh sản phẩm</li>
              <li>Hình ảnh phải rõ nét, không mờ, không bị che khuất</li>
              <li>Không được chứa thông tin liên hệ trong hình ảnh</li>
              <li>Tối đa 12 hình ảnh, mỗi hình tối đa 5MB</li>
              <li>Chỉ chấp nhận định dạng: JPG, PNG, WebP</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>4. Thông tin liên hệ</h3>
            <ul>
              <li>Phải cung cấp đầy đủ thông tin liên hệ</li>
              <li>Số điện thoại phải hợp lệ (10 số)</li>
              <li>Địa chỉ phải chính xác, đầy đủ</li>
              <li>Thông tin liên hệ sẽ được hiển thị công khai</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>5. Quy trình duyệt tin</h3>
            <ul>
              <li>Tất cả tin đăng sẽ được kiểm duyệt trước khi hiển thị</li>
              <li>Thời gian duyệt tin: 24-48 giờ làm việc</li>
              <li>Tin đăng vi phạm quy định sẽ bị từ chối</li>
              <li>Người đăng sẽ nhận được thông báo về kết quả duyệt tin</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>6. Trách nhiệm người đăng</h3>
            <ul>
              <li>Người đăng tin chịu trách nhiệm về tính chính xác của thông tin</li>
              <li>Phải đảm bảo quyền sở hữu hợp pháp của sản phẩm</li>
              <li>Chịu trách nhiệm về chất lượng sản phẩm đã mô tả</li>
              <li>Phải tuân thủ các quy định của pháp luật về thương mại điện tử</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>7. Quyền của EcoXe</h3>
            <ul>
              <li>EcoXe có quyền từ chối hoặc xóa tin đăng vi phạm quy định</li>
              <li>Có quyền chỉnh sửa, gắn nhãn kiểm định cho tin đăng</li>
              <li>Có quyền khóa tài khoản nếu vi phạm nghiêm trọng</li>
              <li>Không chịu trách nhiệm về giao dịch giữa người mua và người bán</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>8. Lưu ý quan trọng</h3>
            <ul>
              <li>Vui lòng đọc kỹ quy định trước khi đăng tin</li>
              <li>Tin đăng vi phạm sẽ bị xóa mà không được hoàn tiền</li>
              <li>Mọi thắc mắc vui lòng liên hệ bộ phận hỗ trợ</li>
              <li>Quy định có thể được cập nhật, vui lòng thường xuyên kiểm tra</li>
            </ul>
          </div>

          <div className="rules-footer">
            <p>
              <strong>Bằng việc đăng tin, bạn đã đồng ý với tất cả các quy định trên.</strong>
            </p>
            <p>
              Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ:{" "}
              <a href="mailto:support@ecoxe.com">support@ecoxe.com</a> hoặc hotline:{" "}
              <a href="tel:19001234">1900-1234</a>
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostingRulesModal;






