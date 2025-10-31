import React, { useState } from 'react';
import './index.scss';
import Users from './users';
import Reports from './reports';
import Fees from './fees';
import Posts from './posts';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Icons
const Icons = {
  users: '👤',
  reports: '📊',
  fees: '💰',
  posts: '📝',
  notification: '🔔',
  search: '🔍'
};

const AdminPage = () => {
  const [active, setActive] = useState('reports');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const getPageTitle = () => {
    switch(active) {
      case 'posts': return 'Duyệt bài đăng';
      case 'users': return 'Quản lý người dùng';
      case 'reports': return 'Thống kê & Báo cáo';
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
            <button 
              className="logout-btn"
              style={{ marginLeft: 12, background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
            >
              Đăng xuất
            </button>
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
                className={active === 'reports' ? 'active' : ''} 
                onClick={() => setActive('reports')}
              >
                <span className="icon">{Icons.reports}</span>
                <span className="label">Thống kê & Báo cáo</span>
              </li>
              <li 
                className={active === 'fees' ? 'active' : ''} 
                onClick={() => setActive('fees')}
              >
                <span className="icon">{Icons.fees}</span>
                <span className="label">Quản lý gói dịch vụ</span>
              </li>
              <li 
                className={active === 'posts' ? 'active' : ''} 
                onClick={() => setActive('posts')}
              >
                <span className="icon">{Icons.posts}</span>
                <span className="label">Duyệt bài đăng</span>
              </li>
              <li 
                className={active === 'users' ? 'active' : ''} 
                onClick={() => setActive('users')}
              >
                <span className="icon">{Icons.users}</span>
                <span className="label">Quản lý người dùng</span>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="content">
          <div className="content-card">
            {active === 'reports' && <Reports />}
            {active === 'fees' && <Fees />}
            {active === 'posts' && <Posts />}
            {active === 'users' && <Users />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
