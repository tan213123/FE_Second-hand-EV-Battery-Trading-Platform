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
            <img 
              src={`data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#4f46e5"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs><rect width="32" height="32" rx="16" fill="url(#g)"/><text x="16" y="21" font-size="14" text-anchor="middle" fill="#fff" font-family="Arial, Helvetica, sans-serif">A</text></svg>')}`}
              alt="Admin" 
            />
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
