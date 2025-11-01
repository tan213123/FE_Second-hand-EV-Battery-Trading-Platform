import React, { useState, useEffect } from 'react';
import './users.scss';
import { adminService } from '../../services/adminService';

const Users = () => {
  // API state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, blocked
  // Fetch users
  useEffect(() => {
    const controller = new AbortController();
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await adminService.getUsers({
          page: currentPage,
          size: itemsPerPage,
          status: filterStatus === 'all' ? undefined : filterStatus,
          search: searchTerm || undefined,
          sort: sortConfig.key ? `${sortConfig.key},${sortConfig.direction}` : undefined,
        });
        // Expecting data.items and data.total; fallback for array
        const list = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        setUsers(list.map(u => ({
          nameId: u.nameId || u.memberId || u.id,
          fullName: u.fullName || u.name,
          address: u.address,
          dateOfBirth: u.dateOfBirth,
          phoneNumber: u.phoneNumber || u.phone,
          email: u.email,
          gender: u.gender || u.sex,
          dateSignup: u.dateSignup || u.createdAt,
          status: u.status || (u.blocked ? 'blocked' : 'active'),
          postsCount: u.postsCount ?? u.numPosts ?? 0,
          violationsCount: u.violationsCount ?? u.numViolations ?? 0,
        })));
      } catch (e) {
        setError(e?.response?.data?.message || 'Không thể tải danh sách người dùng');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    return () => controller.abort();
  }, [currentPage, itemsPerPage, filterStatus, searchTerm, sortConfig]);

  // Sorting function
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Filter users based on search term and status
  const filteredUsers = users.filter(user => {
    // Filter by status
    if (filterStatus !== 'all' && user.status !== filterStatus) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return Object.values(user).some(value => String(value ?? '').toLowerCase().includes(term));
    }
    
    return true;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    const aVal = String(a[sortConfig.key] ?? '');
    const bVal = String(b[sortConfig.key] ?? '');
    return aVal.localeCompare(bVal) * direction;
  });

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle bulk selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(paginatedUsers.map(user => user.nameId));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (nameId) => {
    setSelectedUsers(prev => 
      prev.includes(nameId) 
        ? prev.filter(id => id !== nameId)
        : [...prev, nameId]
    );
  };

  // Handlers for user actions
  const handleDelete = (nameId) => {
    setUsers(prev => prev.filter(user => user.nameId !== nameId));
    setSelectedUsers(prev => prev.filter(id => id !== nameId));
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Bạn có chắc muốn xóa ${selectedUsers.length} người dùng?`)) {
      setUsers(prev => prev.filter(user => !selectedUsers.includes(user.nameId)));
      setSelectedUsers([]);
    }
  };

  const handleBlock = async (nameId, reason = '') => {
    const user = users.find(u => u.nameId === nameId);
    if (user?.status === 'active') {
      const confirmReason = reason || prompt('Lý do khóa tài khoản:');
      if (confirmReason) {
        try {
          await adminService.blockUser(nameId, confirmReason);
          setUsers(prev => prev.map(u => 
            u.nameId === nameId 
              ? { ...u, status: 'blocked', blockReason: confirmReason, violationsCount: (u.violationsCount || 0) + 1 }
              : u
          ));
        } catch (e) {
          alert(e?.response?.data?.message || 'Khóa tài khoản thất bại');
        }
      }
    }
  };

  const handleUnblock = async (nameId) => {
    if (window.confirm('Bạn có chắc muốn mở khóa tài khoản này?')) {
      try {
        await adminService.unblockUser(nameId);
        setUsers(prev => prev.map(u => 
          u.nameId === nameId 
            ? { ...u, status: 'active', blockReason: undefined }
            : u
        ));
      } catch (e) {
        alert(e?.response?.data?.message || 'Mở khóa tài khoản thất bại');
      }
    }
  };

  const handleBulkBlock = () => {
    const reason = prompt('Lý do khóa các tài khoản đã chọn:');
    if (reason) {
      setUsers(prev => prev.map(u => 
        selectedUsers.includes(u.nameId) && u.status === 'active'
          ? { ...u, status: 'blocked', blockReason: reason, violationsCount: u.violationsCount + 1 }
          : u
      ));
      setSelectedUsers([]);
    }
  };

  const handleBulkUnblock = () => {
    if (window.confirm(`Bạn có chắc muốn mở khóa ${selectedUsers.length} tài khoản?`)) {
      setUsers(prev => prev.map(u => 
        selectedUsers.includes(u.nameId)
          ? { ...u, status: 'active', blockReason: undefined }
          : u
      ));
      setSelectedUsers([]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? { text: 'Hoạt động', class: 'status-active' }
      : { text: 'Đã khóa', class: 'status-blocked' };
  };

  const statusCounts = {
    all: users.length,
    active: users.filter(u => u.status === 'active').length,
    blocked: users.filter(u => u.status === 'blocked').length
  };

  return (
    <div className="users-management">
      <div className="card">
        <div className="card-header">
          <h2>Quản lý người dùng</h2>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
            <select 
              value={itemsPerPage} 
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="select-entries"
            >
              <option value={10}>10 dòng</option>
              <option value={25}>25 dòng</option>
              <option value={50}>50 dòng</option>
            </select>
          </div>
        </div>

        <div className="status-filter">
          <button 
            className={filterStatus === 'all' ? 'active' : ''} 
            onClick={() => setFilterStatus('all')}
          >
            Tất cả ({statusCounts.all})
          </button>
          <button 
            className={filterStatus === 'active' ? 'active' : ''} 
            onClick={() => setFilterStatus('active')}
          >
            Hoạt động ({statusCounts.active})
          </button>
          <button 
            className={filterStatus === 'blocked' ? 'active' : ''} 
            onClick={() => setFilterStatus('blocked')}
          >
            Đã khóa ({statusCounts.blocked})
          </button>
        </div>

        {loading && <div className="loading">Đang tải...</div>}
        {error && <div className="error-message">{error}</div>}
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th onClick={() => handleSort('nameId')} className="sortable">
                  Mã người dùng {sortConfig.key === 'nameId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('fullName')} className="sortable">
                  Họ và tên {sortConfig.key === 'fullName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('email')} className="sortable">
                  Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Số điện thoại</th>
                <th onClick={() => handleSort('dateSignup')} className="sortable">
                  Ngày đăng ký {sortConfig.key === 'dateSignup' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Số bài đăng</th>
                <th>Vi phạm</th>
                <th onClick={() => handleSort('status')} className="sortable">
                  Trạng thái {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => {
                const statusBadge = getStatusBadge(user.status);
                return (
                  <tr key={user.nameId} className={selectedUsers.includes(user.nameId) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.nameId)}
                        onChange={() => handleSelectUser(user.nameId)}
                      />
                    </td>
                    <td>{user.nameId}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{formatDate(user.dateSignup)}</td>
                    <td>{user.postsCount}</td>
                    <td>
                      <span className={user.violationsCount > 0 ? 'violations-badge' : ''}>
                        {user.violationsCount}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${statusBadge.class}`} title={user.blockReason}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {user.status === 'active' ? (
                          <button 
                            className="btn-icon block" 
                            onClick={() => handleBlock(user.nameId)}
                            title="Khóa tài khoản"
                          >
                            🔒
                          </button>
                        ) : (
                          <button 
                            className="btn-icon unblock" 
                            onClick={() => handleUnblock(user.nameId)}
                            title="Mở khóa tài khoản"
                          >
                            🔓
                          </button>
                        )}
                        <button className="btn-icon" title="Xem chi tiết">
                          👁️
                        </button>
                        <button 
                          className="btn-icon delete" 
                          onClick={() => handleDelete(user.nameId)}
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <div className="bulk-actions">
            {selectedUsers.length > 0 && (
              <>
                <button className="btn-warning" onClick={handleBulkBlock}>
                  Khóa ({selectedUsers.length})
                </button>
                <button className="btn-success" onClick={handleBulkUnblock}>
                  Mở khóa ({selectedUsers.length})
                </button>
                <button className="btn-danger" onClick={handleBulkDelete}>
                  Xóa ({selectedUsers.length})
                </button>
              </>
            )}
          </div>
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              ⟪
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ⟨
            </button>
            <span>Trang {currentPage} / {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              ⟩
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              ⟫
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
