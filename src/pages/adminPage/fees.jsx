import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import './fees.scss';

const defaultPackages = [
  {
    id: 'pkg1',
    name: 'Gói Tiêu chuẩn',
    type: 'standard',
    price: 50000,
    duration: '15 ngày',
    icon: '⭐',
    color: '#10b981',
    active: true,
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
    id: 'pkg2',
    name: 'Gói Pro',
    type: 'pro',
    price: 150000,
    duration: '30 ngày',
    icon: '👑',
    color: '#f59e0b',
    active: true,
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
    id: 'pkg3',
    name: 'Gói Đấu giá',
    type: 'enterprise',
    price: 500000,
    duration: '90 ngày',
    icon: '💼',
    color: '#8b5cf6',
    active: true,
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
];

const Fees = () => {
  const [packages, setPackages] = useState(defaultPackages);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    type: '',
    price: '',
    duration: '',
    icon: '⭐',
    features: [],
    color: '#10b981',
    popular: false
  });
  const [showModal, setShowModal] = useState(false);
  const [currentFeature, setCurrentFeature] = useState('');

  const startAdd = () => {
    setEditing('new');
    setForm({
      name: '',
      type: '',
      price: '',
      duration: '',
      icon: '⭐',
      features: [],
      color: '#10b981',
      popular: false
    });
    setShowModal(true);
  };

  const startEdit = (pkg) => {
    setEditing(pkg.id);
    setForm({
      name: pkg.name,
      type: pkg.type || '',
      price: pkg.price,
      duration: pkg.duration,
      icon: pkg.icon || '⭐',
      features: [...pkg.features],
      color: pkg.color,
      popular: pkg.popular || false
    });
    setShowModal(true);
  };

  const cancel = () => {
    setEditing(null);
    setShowModal(false);
    setForm({
      name: '',
      type: '',
      price: '',
      duration: '',
      icon: '⭐',
      features: [],
      color: '#10b981',
      popular: false
    });
  };

  const [featureIncluded, setFeatureIncluded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy danh sách gói từ API khi component mount
  useEffect(() => {
    fetchPackages();
  }, []);

  // Fetch packages from API
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/packages');
      if (response.data && response.data.length > 0) {
        setPackages(response.data);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Không thể tải danh sách gói. Sử dụng dữ liệu mặc định.');
      // Giữ defaultPackages nếu API lỗi
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (currentFeature.trim()) {
      setForm(prev => ({
        ...prev,
        features: [...prev.features, { text: currentFeature.trim(), included: featureIncluded }]
      }));
      setCurrentFeature('');
    }
  };

  const removeFeature = (index) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const save = async () => {
    if (!form.name || !form.price || !form.duration) {
      alert('Vui lòng nhập đầy đủ thông tin gói');
      return;
    }

    const packageData = {
      name: form.name,
      type: form.type || 'custom',
      price: Number(form.price),
      duration: form.duration,
      icon: form.icon,
      features: form.features,
      color: form.color,
      popular: form.popular,
      active: true
    };

    try {
      setLoading(true);
      
      if (editing === 'new') {
        // Tạo gói mới - GỌI API POST
        const response = await api.post('/packages', packageData);
        console.log('✅ Gói mới được tạo:', response.data);
        
        // Cập nhật state với data từ API
        if (response.data) {
          setPackages(prev => [...prev, response.data]);
        } else {
          // Fallback nếu API không trả về data
          const id = `pkg${packages.length + 1}`;
          setPackages(prev => [...prev, { id, ...packageData }]);
        }
        
        alert('✅ Tạo gói mới thành công!');
      } else {
        // Cập nhật gói - GỌI API PUT/PATCH
        const response = await api.put(`/packages/${editing}`, packageData);
        console.log('✅ Giá gói được cập nhật:', response.data);
        
        // Cập nhật state với data từ API
        setPackages(prev => prev.map(p => p.id === editing ? {
          ...p,
          ...packageData,
          id: p.id // Giữ lại ID cũ
        } : p));
        
        alert('✅ Cập nhật giá thành công! Giá mới đã được lưu vào hệ thống.');
      }
      
      setError(null);
      cancel();
    } catch (error) {
      console.error('❌ Lỗi khi lưu gói:', error);
      
      // Hiển thị lỗi chi tiết
      const errorMsg = error.response?.data?.message || error.message || 'Không thể lưu thay đổi';
      alert(`❌ Lỗi: ${errorMsg}\n\nĐang lưu tạm thời vào local...`);
      
      // Fallback: lưu vào state local nếu API lỗi
      if (editing === 'new') {
        const id = `pkg${packages.length + 1}`;
        setPackages(prev => [...prev, { id, ...packageData }]);
      } else {
        setPackages(prev => prev.map(p => p.id === editing ? {
          ...p,
          ...packageData
        } : p));
      }
      
      cancel();
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa gói này không?')) {
      try {
        setLoading(true);
        
        // GỌI API DELETE
        await api.delete(`/packages/${id}`);
        console.log('✅ Gói đã được xóa:', id);
        
        // Cập nhật state
        setPackages(prev => prev.filter(p => p.id !== id));
        alert('✅ Xóa gói thành công!');
        setError(null);
      } catch (error) {
        console.error('❌ Lỗi khi xóa gói:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Không thể xóa gói';
        alert(`❌ Lỗi: ${errorMsg}\n\nĐang xóa tạm thời khỏi local...`);
        
        // Fallback: xóa khỏi state local
        setPackages(prev => prev.filter(p => p.id !== id));
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleActive = async (id) => {
    try {
      setLoading(true);
      
      // Tìm package hiện tại
      const pkg = packages.find(p => p.id === id);
      if (!pkg) return;
      
      // GỌI API PATCH để cập nhật status
      await api.patch(`/packages/${id}`, { active: !pkg.active });
      console.log('✅ Trạng thái gói được cập nhật:', id);
      
      // Cập nhật state
      setPackages(prev => 
        prev.map(p => p.id === id ? { ...p, active: !p.active } : p)
      );
      setError(null);
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật trạng thái:', error);
      alert('❌ Không thể cập nhật trạng thái. Đang cập nhật tạm thời...');
      
      // Fallback: cập nhật local
      setPackages(prev => 
        prev.map(p => p.id === id ? { ...p, active: !p.active } : p)
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="fees-management">
      <div className="page-header">
        <div>
          <h2>Quản lý gói dịch vụ</h2>
          <p>Thiết lập và quản lý các gói dịch vụ cho người dùng</p>
        </div>
        <button className="btn-primary" onClick={startAdd} disabled={loading}>
          <span>➕</span> {loading ? 'Đang xử lý...' : 'Thêm gói mới'}
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Đang xử lý...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <div className="packages-grid">
        {packages.map(pkg => (
          <div 
            key={pkg.id} 
            className={`package-card ${pkg.popular ? 'popular' : ''} ${!pkg.active ? 'inactive' : ''}`}
            style={{'--package-color': pkg.color}}
          >
            {pkg.popular && <div className="popular-badge">⭐ Phổ biến nhất</div>}
            {!pkg.active && <div className="inactive-badge">Đã tắt</div>}
            
            <div className="package-header">
              <div className="package-icon">{pkg.icon}</div>
              <h3>{pkg.name}</h3>
              <div className="price">
                <span className="amount">{formatPrice(pkg.price)}</span>
                <span className="duration">/{pkg.duration}</span>
              </div>
            </div>

            <div className="package-features">
              <ul>
                {pkg.features.map((feature, index) => (
                  <li key={index} className={feature.included ? 'included' : 'excluded'}>
                    <span className="feature-icon">{feature.included ? '✓' : '✕'}</span>
                    {feature.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="package-actions">
              <button className="btn-edit" onClick={() => startEdit(pkg)}>
                ✏️ Sửa
              </button>
              <button 
                className={`btn-toggle ${pkg.active ? 'active' : ''}`}
                onClick={() => toggleActive(pkg.id)}
              >
                {pkg.active ? '🔴 Tắt' : '🟢 Bật'}
              </button>
              <button className="btn-delete" onClick={() => remove(pkg.id)}>
                🗑️ Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editing === 'new' ? 'Thêm gói mới' : 'Chỉnh sửa gói'}</h3>
              <button className="btn-close" onClick={cancel}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Tên gói</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="VD: Gói Pro"
                  />
                </div>

                <div className="form-group">
                  <label>Loại gói</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="">Chọn loại</option>
                    <option value="standard">Tiêu chuẩn</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Đấu giá</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giá (VND)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="VD: 150000"
                  />
                </div>

                <div className="form-group">
                  <label>Thời hạn</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={e => setForm(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="VD: 30 ngày"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Icon (Emoji)</label>
                  <select
                    value={form.icon}
                    onChange={e => setForm(prev => ({ ...prev, icon: e.target.value }))}
                  >
                    <option value="⭐">⭐ Ngôi sao</option>
                    <option value="👑">👑 Vương miện</option>
                    <option value="💼">💼 Cặp</option>
                    <option value="🎯">🎯 Mục tiêu</option>
                    <option value="🚀">🚀 Tên lửa</option>
                    <option value="💎">💎 Kim cương</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Màu sắc</label>
                  <input
                    type="color"
                    value={form.color}
                    onChange={e => setForm(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={form.popular}
                    onChange={e => setForm(prev => ({ ...prev, popular: e.target.checked }))}
                  />
                  <span>Đánh dấu là gói phổ biến nhất</span>
                </label>
              </div>

              <div className="form-group">
                <label>Tính năng của gói</label>
                <div className="feature-input">
                  <input
                    value={currentFeature}
                    onChange={e => setCurrentFeature(e.target.value)}
                    placeholder="Nhập tính năng"
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <label className="feature-checkbox">
                    <input
                      type="checkbox"
                      checked={featureIncluded}
                      onChange={e => setFeatureIncluded(e.target.checked)}
                    />
                    <span>Bao gồm</span>
                  </label>
                  <button type="button" onClick={addFeature}>Thêm</button>
                </div>
                <ul className="features-list">
                  {form.features.map((feature, index) => (
                    <li key={index} className={feature.included ? 'included' : 'excluded'}>
                      <span className="feature-icon">{feature.included ? '✓' : '✕'}</span>
                      <span className="feature-text">{feature.text}</span>
                      <button type="button" onClick={() => removeFeature(index)}>×</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={cancel}>Hủy</button>
              <button className="btn-primary" onClick={save}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fees;
