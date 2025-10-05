import React, { useState, useMemo, useEffect } from 'react';
import './posts.scss';

const samplePosts = [
  { id: 'POST001', title: 'Xe điện cũ - Like new', author: 'Nguyen A', status: 'published', createdAt: '2025-09-20' },
  { id: 'POST002', title: 'Bán pin EV 48V', author: 'Le B', status: 'pending', createdAt: '2025-09-22' },
  { id: 'POST003', title: 'Trao đổi 60Ah', author: 'Tran C', status: 'removed', createdAt: '2025-09-25' }
];

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    setPosts(samplePosts);
  }, []);

  const handleSort = (key) => {
    setSortConfig({ key, direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc' });
  };

  const filtered = useMemo(() => {
    return posts.filter(p =>
      Object.values(p).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [posts, searchTerm]);

  const sorted = useMemo(() => {
    if (!sortConfig.key) return filtered;
    const dir = sortConfig.direction === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key])) * dir);
  }, [filtered, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedPosts(paginated.map(p => p.id));
    else setSelectedPosts([]);
  };

  const handleSelect = (id) => {
    setSelectedPosts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleDelete = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    setSelectedPosts(prev => prev.filter(x => x !== id));
  };

  const handleBulkDelete = () => {
    setPosts(prev => prev.filter(p => !selectedPosts.includes(p.id)));
    setSelectedPosts([]);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN');

  return (
    <div className="users-management">
      <div className="card">
        <div className="card-header">
          <h2>Quản lý bài đăng</h2>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm Mã bài, Tên bài, Người đăng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>

            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="select-entries">
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
                  <input type="checkbox" checked={selectedPosts.length === paginated.length && paginated.length > 0} onChange={handleSelectAll} />
                </th>
                <th onClick={() => handleSort('id')} className="sortable">Mã bài đăng {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('title')} className="sortable">Tên bài đăng {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('author')} className="sortable">Người đăng {sortConfig.key === 'author' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('createdAt')} className="sortable">Ngày đăng {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th>Trạng thái</th>
                <th>Hoạt động</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id} className={selectedPosts.includes(p.id) ? 'selected' : ''}>
                  <td>
                    <input type="checkbox" checked={selectedPosts.includes(p.id)} onChange={() => handleSelect(p.id)} />
                  </td>
                  <td>{p.id}</td>
                  <td>{p.title}</td>
                  <td>{p.author}</td>
                  <td>{formatDate(p.createdAt)}</td>
                  <td>{p.status === 'published' ? 'Đã đăng' : p.status === 'pending' ? 'Chờ duyệt' : 'Đã gỡ'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="Chi tiết">🔍</button>
                      <button className="btn-icon" title="Chỉnh sửa">✏️</button>
                      <button className="btn-icon delete" onClick={() => handleDelete(p.id)} title="Xóa">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <div className="bulk-actions">
            {selectedPosts.length > 0 && (
              <button className="btn-danger" onClick={handleBulkDelete}>Xóa ({selectedPosts.length})</button>
            )}
          </div>

          <div className="pagination">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>⟪</button>
            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>⟨</button>
            <span>Trang {currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>⟩</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>⟫</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
