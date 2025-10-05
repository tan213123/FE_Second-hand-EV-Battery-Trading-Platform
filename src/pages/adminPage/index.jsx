import React, { useState } from 'react';
import './index.scss';
import Users from './users';
import Reports from './reports';
import Fees from './fees';
import Posts from './posts';

// Icons (you can replace these with actual icon components from a library like react-icons)
  const Icons = {
    staff: '👥',
    users: '👤',
    reports: '📊',
    fees: '💰',
    notification: '🔔',
    search: '🔍',
    logout: '⭕'
  };

const emptyStaff = {
  staffID: '',
  role: '',
  name: '',
  phone: '',
  yearOfBirth: '',
  address: '',
  sex: '',
  age: ''
};

const AdminPage = () => {
  const [active, setActive] = useState('staff');
  const [staff, setStaff] = useState(emptyStaff);
  const [list, setList] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!staff.staffID) {
      alert('Vui lòng nhập mã nhân viên (StaffID)');
      return;
    }
    if (list.find(s => s.staffID === staff.staffID)) {
      alert('Mã nhân viên đã tồn tại');
      return;
    }
    setList(prev => [...prev, { ...staff }]);
    setStaff(emptyStaff);
  };

  const handleDelete = (id) => {
    setList(prev => prev.filter(s => s.staffID !== id));
  };

  const getPageTitle = () => {
    switch(active) {
  case 'staff': return 'Quản lý nhân viên';
  case 'posts': return 'Quản lý bài đăng';
  case 'users': return 'Quản lý người dùng';
  case 'reports': return 'Thống kê & báo cáo';
  case 'fees': return 'Quản lý gói dịch vụ';
      default: return 'Bảng điều khiển';
    }
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(prev => !prev)}
          >
            ☰
          </button>
          <h2>{getPageTitle()}</h2>
        </div>
        <div className="header-right">
          <div className="search-box">
            {Icons.search}
            <input type="text" placeholder="Tìm kiếm..." />
          </div>
          <button className="icon-button">{Icons.notification}</button>
          <div className="admin-profile">
            <img src="https://via.placeholder.com/32" alt="Admin" />
            <span>Quản trị viên</span>
          </div>
        </div>
      </header>

      <div className="admin-container">
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="brand">
            <h3>Bảng quản trị</h3>
          </div>
          <nav>
            <ul>
              <li 
                className={active === 'staff' ? 'active' : ''} 
                onClick={() => setActive('staff')}
              >
                <span className="icon">{Icons.staff}</span>
                <span className="label">Quản lý nhân viên</span>
              </li>
              <li 
                className={active === 'users' ? 'active' : ''} 
                onClick={() => setActive('users')}
              >
                <span className="icon">{Icons.users}</span>
                <span className="label">Quản lý người dùng</span>
              </li>
              <li 
                className={active === 'posts' ? 'active' : ''} 
                onClick={() => setActive('posts')}
              >
                <span className="icon">📝</span>
                <span className="label">Quản lý bài đăng</span>
              </li>
              {/* posts removed */}
              <li 
                className={active === 'reports' ? 'active' : ''} 
                onClick={() => setActive('reports')}
              >
                <span className="icon">{Icons.reports}</span>
                <span className="label">Thống kê & báo cáo</span>
              </li>
              <li 
                className={active === 'fees' ? 'active' : ''} 
                onClick={() => setActive('fees')}
              >
                <span className="icon">{Icons.fees}</span>
                <span className="label">Quản lý gói dịch vụ</span>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="content">
          <div className="content-card">
            {active === 'staff' && (
              <>
                <div className="card form-card">
                  <h3>Thêm nhân viên mới</h3>
                  <form className="staff-form" onSubmit={handleAdd}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Mã nhân viên (StaffID)*</label>
                        <input name="staffID" value={staff.staffID} onChange={handleChange} required />
                      </div>
                      <div className="form-group">
                        <label>Vai trò</label>
                        <input name="role" value={staff.role} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Họ và tên</label>
                        <input name="name" value={staff.name} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label>Số điện thoại</label>
                        <input name="phone" value={staff.phone} onChange={handleChange} type="tel" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Ngày sinh</label>
                        <input name="yearOfBirth" value={staff.yearOfBirth} onChange={handleChange} type="date" />
                      </div>
                      <div className="form-group">
                        <label>Địa chỉ</label>
                        <input name="address" value={staff.address} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Giới tính</label>
                        <select name="sex" value={staff.sex} onChange={handleChange}>
                          <option value="">Chọn</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Tuổi</label>
                        <input name="age" value={staff.age} onChange={handleChange} type="number" min="0" />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-primary">Thêm nhân viên</button>
                      <button type="button" className="btn-secondary" onClick={() => setStaff(emptyStaff)}>Làm mới</button>
                    </div>
                  </form>
                </div>

                <div className="card table-card">
                  <div className="card-header">
                    <h3>Danh sách nhân viên</h3>
                    <div className="card-actions">
                      <select className="select-sm">
                        <option>10 entries</option>
                        <option>25 entries</option>
                        <option>50 entries</option>
                      </select>
                      <input type="text" placeholder="Tìm kiếm..." className="search-sm" />
                    </div>
                  </div>
                  
                  {list.length === 0 ? (
                    <p className="empty-state">Chưa có nhân viên nào</p>
                  ) : (
                    <div className="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>Mã NV</th>
                            <th>Vai trò</th>
                            <th>Họ và tên</th>
                            <th>SĐT</th>
                            <th>Ngày sinh</th>
                            <th>Địa chỉ</th>
                            <th>Giới tính</th>
                            <th>Tuổi</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {list.map((s) => (
                            <tr key={s.staffID}>
                              <td>{s.staffID}</td>
                              <td>{s.role}</td>
                              <td>{s.name}</td>
                              <td>{s.phone}</td>
                              <td>{s.yearOfBirth}</td>
                              <td>{s.address}</td>
                              <td>{s.sex}</td>
                              <td>{s.age}</td>
                              <td>
                                <div className="table-actions">
                                  <button className="btn-icon" onClick={() => handleDelete(s.staffID)}>🗑️</button>
                                  <button className="btn-icon">✏️</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {active === 'users' && <Users />}
            {active === 'posts' && <Posts />}
            {active === 'reports' && <Reports />}
            {active === 'fees' && <Fees />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
