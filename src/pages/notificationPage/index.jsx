import React, { useState } from 'react';
import './index.scss';

const NotificationPage = ({ onNavigate }) => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Đăng tin thành công',
      message: 'Tin đăng "Honda Wave RSX 2023" của bạn đã được duyệt và hiển thị trên website.',
      time: '2 phút trước',
      read: false,
      icon: '✅'
    },
    {
      id: 2,
      type: 'info',
      title: 'Tin nhắn mới',
      message: 'Bạn có tin nhắn mới từ người dùng quan tâm đến sản phẩm "Yamaha Exciter 155".',
      time: '1 giờ trước',
      read: false,
      icon: '💬'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Tin đăng sắp hết hạn',
      message: 'Tin đăng "Suzuki Raider 150" sẽ hết hạn trong 3 ngày. Gia hạn ngay để tiếp tục hiển thị.',
      time: '3 giờ trước',
      read: true,
      icon: '⚠️'
    },
    {
      id: 4,
      type: 'promotion',
      title: 'Ưu đãi đặc biệt',
      message: 'Nhận ngay 50% phí đăng tin khi nâng cấp lên gói PRO. Ưu đãi chỉ còn 2 ngày!',
      time: '1 ngày trước',
      read: true,
      icon: '🎉'
    },
    {
      id: 5,
      type: 'system',
      title: 'Cập nhật hệ thống',
      message: 'Chúng tôi đã cập nhật giao diện mới với nhiều tính năng hữu ích. Khám phá ngay!',
      time: '2 ngày trước',
      read: true,
      icon: '🔧'
    },
    {
      id: 6,
      type: 'success',
      title: 'Thanh toán thành công',
      message: 'Giao dịch thanh toán phí đăng tin đã được xử lý thành công. Cảm ơn bạn!',
      time: '3 ngày trước',
      read: true,
      icon: '💳'
    }
  ]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const getTypeLabel = (type) => {
    const labels = {
      success: 'Thành công',
      info: 'Thông tin',
      warning: 'Cảnh báo',
      promotion: 'Khuyến mãi',
      system: 'Hệ thống'
    };
    return labels[type] || 'Khác';
  };

  const getTypeColor = (type) => {
    const colors = {
      success: '#10b981',
      info: '#3b82f6',
      warning: '#f59e0b',
      promotion: '#8b5cf6',
      system: '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  return (
    <div className="notification-page">
      <div className="notification-container">
        {/* Header */}
        <div className="notification-header">
          <div className="header-content">
            <h1>Thông báo</h1>
            <p>Quản lý tất cả thông báo của bạn</p>
          </div>
          <div className="header-actions">
            <button 
              className="mark-all-btn"
              onClick={markAllAsRead}
              disabled={getNotificationCount() === 0}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
              </svg>
              Đánh dấu tất cả đã đọc
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="notification-stats">
          <div className="stat-card">
            <div className="stat-icon">📬</div>
            <div className="stat-content">
              <div className="stat-number">{notifications.length}</div>
              <div className="stat-label">Tổng thông báo</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔔</div>
            <div className="stat-content">
              <div className="stat-number">{getNotificationCount()}</div>
              <div className="stat-label">Chưa đọc</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{notifications.length - getNotificationCount()}</div>
              <div className="stat-label">Đã đọc</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="notification-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Chưa đọc ({getNotificationCount()})
          </button>
          <button 
            className={`filter-btn ${filter === 'success' ? 'active' : ''}`}
            onClick={() => setFilter('success')}
          >
            Thành công
          </button>
          <button 
            className={`filter-btn ${filter === 'warning' ? 'active' : ''}`}
            onClick={() => setFilter('warning')}
          >
            Cảnh báo
          </button>
          <button 
            className={`filter-btn ${filter === 'promotion' ? 'active' : ''}`}
            onClick={() => setFilter('promotion')}
          >
            Khuyến mãi
          </button>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>Không có thông báo</h3>
              <p>Bạn chưa có thông báo nào trong danh mục này.</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  <span className="icon-emoji">{notification.icon}</span>
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <h3 className="notification-title">{notification.title}</h3>
                    <div className="notification-meta">
                      <span 
                        className="notification-type"
                        style={{ color: getTypeColor(notification.type) }}
                      >
                        {getTypeLabel(notification.type)}
                      </span>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                </div>
                <div className="notification-actions">
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
