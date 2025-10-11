import { useState } from 'react'
import './index.scss'

// Icon components
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

const LogOutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16,17 21,12 16,7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6"/>
  </svg>
)

function SettingsPage({ onNavigate }) {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    privacy: {
      profileVisibility: 'public',
      showPhone: true,
      showEmail: false,
      allowMessages: true
    },
    language: 'vi',
    theme: 'light',
    autoSave: true,
    twoFactorAuth: false
  })

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      onNavigate('logout')
    }
  }

  const settingsSections = [
    {
      title: 'Tài khoản',
      icon: <UserIcon />,
      items: [
        {
          title: 'Thông tin cá nhân',
          subtitle: 'Chỉnh sửa thông tin tài khoản',
          action: () => onNavigate('account')
        },
        {
          title: 'Đổi mật khẩu',
          subtitle: 'Cập nhật mật khẩu bảo mật',
          action: () => console.log('Change password')
        },
        {
          title: 'Xác thực 2 bước',
          subtitle: settings.twoFactorAuth ? 'Đã bật' : 'Chưa bật',
          toggle: true,
          value: settings.twoFactorAuth,
          onChange: (value) => handleSettingChange('privacy', 'twoFactorAuth', value)
        }
      ]
    },
    {
      title: 'Thông báo',
      icon: <BellIcon />,
      items: [
        {
          title: 'Email',
          subtitle: 'Nhận thông báo qua email',
          toggle: true,
          value: settings.notifications.email,
          onChange: (value) => handleSettingChange('notifications', 'email', value)
        },
        {
          title: 'Push notifications',
          subtitle: 'Thông báo đẩy trên thiết bị',
          toggle: true,
          value: settings.notifications.push,
          onChange: (value) => handleSettingChange('notifications', 'push', value)
        },
        {
          title: 'SMS',
          subtitle: 'Nhận thông báo qua tin nhắn',
          toggle: true,
          value: settings.notifications.sms,
          onChange: (value) => handleSettingChange('notifications', 'sms', value)
        },
        {
          title: 'Marketing',
          subtitle: 'Nhận tin tức và ưu đãi',
          toggle: true,
          value: settings.notifications.marketing,
          onChange: (value) => handleSettingChange('notifications', 'marketing', value)
        }
      ]
    },
    {
      title: 'Quyền riêng tư',
      icon: <ShieldIcon />,
      items: [
        {
          title: 'Hiển thị hồ sơ',
          subtitle: 'Ai có thể xem hồ sơ của bạn',
          select: true,
          value: settings.privacy.profileVisibility,
          options: [
            { value: 'public', label: 'Công khai' },
            { value: 'friends', label: 'Bạn bè' },
            { value: 'private', label: 'Riêng tư' }
          ],
          onChange: (value) => handleSettingChange('privacy', 'profileVisibility', value)
        },
        {
          title: 'Hiển thị số điện thoại',
          subtitle: 'Cho phép người khác xem số điện thoại',
          toggle: true,
          value: settings.privacy.showPhone,
          onChange: (value) => handleSettingChange('privacy', 'showPhone', value)
        },
        {
          title: 'Hiển thị email',
          subtitle: 'Cho phép người khác xem email',
          toggle: true,
          value: settings.privacy.showEmail,
          onChange: (value) => handleSettingChange('privacy', 'showEmail', value)
        },
        {
          title: 'Cho phép nhắn tin',
          subtitle: 'Người khác có thể nhắn tin cho bạn',
          toggle: true,
          value: settings.privacy.allowMessages,
          onChange: (value) => handleSettingChange('privacy', 'allowMessages', value)
        }
      ]
    },
    {
      title: 'Giao diện',
      icon: <GlobeIcon />,
      items: [
        {
          title: 'Ngôn ngữ',
          subtitle: 'Chọn ngôn ngữ hiển thị',
          select: true,
          value: settings.language,
          options: [
            { value: 'vi', label: 'Tiếng Việt' },
            { value: 'en', label: 'English' }
          ],
          onChange: (value) => handleSettingChange('privacy', 'language', value)
        },
        {
          title: 'Chế độ tối',
          subtitle: settings.theme === 'dark' ? 'Đã bật' : 'Đã tắt',
          toggle: true,
          value: settings.theme === 'dark',
          onChange: (value) => handleSettingChange('privacy', 'theme', value ? 'dark' : 'light')
        },
        {
          title: 'Tự động lưu',
          subtitle: 'Tự động lưu dữ liệu khi chỉnh sửa',
          toggle: true,
          value: settings.autoSave,
          onChange: (value) => handleSettingChange('privacy', 'autoSave', value)
        }
      ]
    },
    {
      title: 'Hỗ trợ',
      icon: <HelpIcon />,
      items: [
        {
          title: 'Trung tâm trợ giúp',
          subtitle: 'Tìm câu trả lời cho câu hỏi của bạn',
          action: () => console.log('Help center')
        },
        {
          title: 'Liên hệ hỗ trợ',
          subtitle: 'Gửi phản hồi hoặc báo cáo lỗi',
          action: () => console.log('Contact support')
        },
        {
          title: 'Điều khoản sử dụng',
          subtitle: 'Xem điều khoản và chính sách',
          action: () => onNavigate('terms')
        },
        {
          title: 'Chính sách bảo mật',
          subtitle: 'Thông tin về quyền riêng tư',
          action: () => onNavigate('privacy')
        }
      ]
    }
  ]

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Cài đặt</h1>
          <p>Quản lý tài khoản và tùy chọn ứng dụng</p>
        </div>

        <div className="settings-content">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="settings-section">
              <div className="section-header">
                <div className="section-icon">{section.icon}</div>
                <h2 className="section-title">{section.title}</h2>
              </div>
              
              <div className="section-items">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="setting-item">
                    <div className="item-content">
                      <h3 className="item-title">{item.title}</h3>
                      <p className="item-subtitle">{item.subtitle}</p>
                    </div>
                    
                    <div className="item-control">
                      {item.toggle && (
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={item.value}
                            onChange={(e) => item.onChange(e.target.checked)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      )}
                      
                      {item.select && (
                        <select
                          className="setting-select"
                          value={item.value}
                          onChange={(e) => item.onChange(e.target.value)}
                        >
                          {item.options.map((option, optionIndex) => (
                            <option key={optionIndex} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {item.action && (
                        <button className="action-button" onClick={item.action}>
                          <ChevronRightIcon />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Logout Section */}
          <div className="settings-section logout-section">
            <button className="logout-button" onClick={handleLogout}>
              <LogOutIcon />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage



