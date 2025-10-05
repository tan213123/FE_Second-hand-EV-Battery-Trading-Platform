import React, { useState } from 'react';
import './fees.scss';

const defaultPackages = [
  {
    id: 'pkg1',
    name: 'Gói Cơ Bản',
    price: 50000,
    durationDays: 30,
    active: true,
    features: [
      'Đăng 5 bài/tháng',
      'Ưu tiên hiển thị thấp',
      'Hỗ trợ cơ bản',
      'Báo cáo cơ bản'
    ],
    color: '#3182ce',
    recommended: false
  },
  {
    id: 'pkg2',
    name: 'Gói Premium',
    price: 120000,
    durationDays: 90,
    active: true,
    features: [
      'Đăng không giới hạn bài',
      'Ưu tiên hiển thị cao',
      'Hỗ trợ 24/7',
      'Báo cáo chi tiết',
      'Badge Premium',
      'Công cụ phân tích'
    ],
    color: '#805ad5',
    recommended: true
  },
  {
    id: 'pkg3',
    name: 'Gói Doanh Nghiệp',
    price: 299000,
    durationDays: 180,
    active: true,
    features: [
      'Tất cả tính năng Premium',
      'API tích hợp',
      'Hỗ trợ riêng',
      'Báo cáo tùy chỉnh',
      'Badge Verified Business',
      'Ưu tiên cao nhất'
    ],
    color: '#d69e2e',
    recommended: false
  }
];

const Fees = () => {
  const [packages, setPackages] = useState(defaultPackages);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    durationDays: '',
    features: [],
    color: '#3182ce',
    recommended: false
  });
  const [showModal, setShowModal] = useState(false);
  const [currentFeature, setCurrentFeature] = useState('');

  const startAdd = () => {
    setEditing('new');
    setForm({
      name: '',
      price: '',
      durationDays: '',
      features: [],
      color: '#3182ce',
      recommended: false
    });
    setShowModal(true);
  };

  const startEdit = (pkg) => {
    setEditing(pkg.id);
    setForm({
      name: pkg.name,
      price: pkg.price,
      durationDays: pkg.durationDays,
      features: [...pkg.features],
      color: pkg.color,
      recommended: pkg.recommended
    });
    setShowModal(true);
  };

  const cancel = () => {
    setEditing(null);
    setShowModal(false);
    setForm({
      name: '',
      price: '',
      durationDays: '',
      features: [],
      color: '#3182ce',
      recommended: false
    });
  };

  const addFeature = () => {
    if (currentFeature.trim()) {
      setForm(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
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

  const save = () => {
    if (!form.name || !form.price || !form.durationDays) {
      alert('Vui lòng nhập đầy đủ thông tin gói');
      return;
    }

    if (editing === 'new') {
      const id = `pkg${packages.length + 1}`;
      setPackages(prev => [...prev, {
        id,
        name: form.name,
        price: Number(form.price),
        durationDays: Number(form.durationDays),
        features: form.features,
        color: form.color,
        recommended: form.recommended,
        active: true
      }]);
    } else {
      setPackages(prev => prev.map(p => p.id === editing ? {
        ...p,
        name: form.name,
        price: Number(form.price),
        durationDays: Number(form.durationDays),
        features: form.features,
        color: form.color,
        recommended: form.recommended
      } : p));
    }

    cancel();
  };

  const remove = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa gói này không?')) {
      setPackages(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleActive = (id) => setPackages(prev => 
    prev.map(p => p.id === id ? { ...p, active: !p.active } : p)
  );

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
        <button className="btn-primary" onClick={startAdd}>
          <span>➕</span> Thêm gói mới
        </button>
      </div>

      <div className="packages-grid">
        {packages.map(pkg => (
          <div 
            key={pkg.id} 
            className={`package-card ${pkg.recommended ? 'recommended' : ''} ${!pkg.active ? 'inactive' : ''}`}
            style={{'--package-color': pkg.color}}
          >
            {pkg.recommended && <div className="recommended-badge">Phổ biến nhất</div>}
            {!pkg.active && <div className="inactive-badge">Đã tắt</div>}
            
            <div className="package-header">
              <h3>{pkg.name}</h3>
              <div className="price">
                <span className="amount">{formatPrice(pkg.price)}</span>
                <span className="duration">/{pkg.durationDays} ngày</span>
              </div>
            </div>

            <div className="package-features">
              <ul>
                {pkg.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
            </div>

            <div className="package-actions">
              <button className="btn-edit" onClick={() => startEdit(pkg)}>
                ✏️ Chỉnh sửa
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
              <div className="form-group">
                <label>Tên gói</label>
                <input
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="VD: Gói Premium"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giá (VND)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="VD: 199000"
                  />
                </div>

                <div className="form-group">
                  <label>Thời hạn (ngày)</label>
                  <input
                    type="number"
                    value={form.durationDays}
                    onChange={e => setForm(prev => ({ ...prev, durationDays: e.target.value }))}
                    placeholder="VD: 30"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Màu sắc</label>
                  <input
                    type="color"
                    value={form.color}
                    onChange={e => setForm(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>

                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={form.recommended}
                      onChange={e => setForm(prev => ({ ...prev, recommended: e.target.checked }))}
                    />
                    Đánh dấu là gói phổ biến nhất
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Tính năng của gói</label>
                <div className="feature-input">
                  <input
                    value={currentFeature}
                    onChange={e => setCurrentFeature(e.target.value)}
                    placeholder="Nhập tính năng và nhấn Enter"
                    onKeyPress={e => e.key === 'Enter' && addFeature()}
                  />
                  <button type="button" onClick={addFeature}>Thêm</button>
                </div>
                <ul className="features-list">
                  {form.features.map((feature, index) => (
                    <li key={index}>
                      {feature}
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
