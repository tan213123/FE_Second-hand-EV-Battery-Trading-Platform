import React, { useState } from 'react';
import './users.scss';

const Users = () => {
  // Mock data - replace with actual API data
  const [users, setUsers] = useState([
    {
      nameId: 'USER001',
      fullName: 'Nguyễn Văn An',
      address: '123 Nguyễn Huệ, Q1, TP.HCM',
      dateOfBirth: '1990-05-15',
      phoneNumber: '0901234567',
      email: 'nguyenvanan@email.com',
      gender: 'Nam',
      dateSignup: '2023-01-15'
    },
    {
      nameId: 'USER002',
      fullName: 'Trần Thị Bình',
      address: '456 Lê Lợi, Q5, TP.HCM',
      dateOfBirth: '1995-08-22',
      phoneNumber: '0907654321',
      email: 'tranthibinh@email.com',
      gender: 'Nữ',
      dateSignup: '2023-02-20'
    },
    // Add more mock data as needed
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting function
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    Object.values(user).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    return a[sortConfig.key].toString().localeCompare(b[sortConfig.key].toString()) * direction;
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
    setUsers(prev => prev.filter(user => !selectedUsers.includes(user.nameId)));
    setSelectedUsers([]);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
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

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    checked={selectedUsers.length === paginatedUsers.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th onClick={() => handleSort('nameId')} className="sortable">
                  Mã người dùng {sortConfig.key === 'nameId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('fullName')} className="sortable">
                  Họ và tên {sortConfig.key === 'fullName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Địa chỉ</th>
                <th onClick={() => handleSort('dateOfBirth')} className="sortable">
                  Ngày sinh {sortConfig.key === 'dateOfBirth' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Số điện thoại</th>
                <th onClick={() => handleSort('email')} className="sortable">
                  Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Giới tính</th>
                <th onClick={() => handleSort('dateSignup')} className="sortable">
                  Ngày đăng ký {sortConfig.key === 'dateSignup' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => (
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
                  <td>{user.address}</td>
                  <td>{formatDate(user.dateOfBirth)}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.email}</td>
                  <td>{user.gender}</td>
                  <td>{formatDate(user.dateSignup)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="Chỉnh sửa">
                        ✏️
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <div className="bulk-actions">
            {selectedUsers.length > 0 && (
              <button className="btn-danger" onClick={handleBulkDelete}>
                Xóa ({selectedUsers.length})
              </button>
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
